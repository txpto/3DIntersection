import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SamplingWorkerBackend } from './src/boolean-backend.js';

const mainContainer = document.getElementById('main3d');
const metricsEl = document.getElementById('metrics');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);
mainContainer.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#03040d');

const camera = new THREE.PerspectiveCamera(60, mainContainer.clientWidth / mainContainer.clientHeight, 0.1, 100);
camera.position.set(8, 7, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0x8290d2, 0.35));
const keyLight = new THREE.DirectionalLight(0x9caeff, 0.9);
keyLight.position.set(7, 10, 8);
scene.add(keyLight);

const grid = new THREE.GridHelper(20, 20, 0x1f2d6a, 0x101731);
grid.material.opacity = 0.5;
grid.material.transparent = true;
scene.add(grid);

scene.add(new THREE.AxesHelper(3.5));

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.4, 40, 30),
  new THREE.MeshStandardMaterial({ color: 0x2ac0ff, metalness: 0.1, roughness: 0.3 })
);
sphere.position.set(-2.5, 1.6, 0);
scene.add(sphere);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshStandardMaterial({ color: 0xf08cff, metalness: 0.15, roughness: 0.3 })
);
cube.position.set(2.3, 1.5, 0.6);
scene.add(cube);

const overlapPoints = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0x7dff7f, size: 0.065, sizeAttenuation: true })
);
scene.add(overlapPoints);

const panels = {
  xy: document.getElementById('xy'),
  xz: document.getElementById('xz'),
  yz: document.getElementById('yz')
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -sphere.position.y);
const dragHit = new THREE.Vector3();

const keyState = new Set();
let dirty = true;
let backendStatus = 'worker';
let latestRequestId = 0;

const backend = new SamplingWorkerBackend({ samplesPerAxis: 20 });

function getInputPayload() {
  return {
    sphere: {
      position: { x: sphere.position.x, y: sphere.position.y, z: sphere.position.z },
      radius: 1.4
    },
    cube: {
      position: { x: cube.position.x, y: cube.position.y, z: cube.position.z },
      rotation: { x: cube.quaternion.x, y: cube.quaternion.y, z: cube.quaternion.z, w: cube.quaternion.w },
      halfSize: { x: 1.5, y: 1.5, z: 1.5 }
    }
  };
}

function resizePanelCanvas(canvas) {
  const dpr = Math.min(devicePixelRatio, 2);
  canvas.width = Math.floor(canvas.clientWidth * dpr);
  canvas.height = Math.floor(canvas.clientHeight * dpr);
}

function drawProjection(canvas, positions, axisA, axisB, worldMin = -8, worldMax = 8) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#050714';
  ctx.fillRect(0, 0, w, h);

  const toPx = (v) => ((v - worldMin) / (worldMax - worldMin));

  ctx.strokeStyle = '#1f2c61';
  ctx.lineWidth = 1;

  const x0 = toPx(0) * w;
  const y0 = (1 - toPx(0)) * h;
  ctx.beginPath();
  ctx.moveTo(0, y0);
  ctx.lineTo(w, y0);
  ctx.moveTo(x0, 0);
  ctx.lineTo(x0, h);
  ctx.stroke();

  if (positions.length === 0) return;

  const axisToIndex = { x: 0, y: 1, z: 2 };
  const a = axisToIndex[axisA];
  const b = axisToIndex[axisB];

  ctx.fillStyle = '#70ff73';
  for (let i = 0; i < positions.length; i += 3) {
    const u = toPx(positions[i + a]) * w;
    const v = (1 - toPx(positions[i + b])) * h;
    ctx.fillRect(u - 1, v - 1, 3, 3);
  }
}

function syncOverlay(positions) {
  drawProjection(panels.xy, positions, 'x', 'y');
  drawProjection(panels.xz, positions, 'x', 'z');
  drawProjection(panels.yz, positions, 'y', 'z');

  overlapPoints.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  overlapPoints.geometry.computeBoundingSphere();
}

function updateMetricsOverlay(metrics) {
  if (!metricsEl) return;

  if (!metrics.intersects) {
    metricsEl.innerHTML = [
      'Intersección: <strong>no</strong>',
      `Backend: <strong>${backendStatus}</strong>`
    ].join('<br />');
    return;
  }

  metricsEl.innerHTML = [
    'Intersección: <strong>sí</strong>',
    `Backend: <strong>${backendStatus}</strong>`,
    `Volumen aprox.: <strong>${metrics.volumeApprox.toFixed(4)}</strong>`,
    `Δx=${metrics.size.x.toFixed(3)} · Δy=${metrics.size.y.toFixed(3)} · Δz=${metrics.size.z.toFixed(3)}`
  ].join('<br />');
}

let draggingSphere = false;
renderer.domElement.addEventListener('pointerdown', (ev) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  if (raycaster.intersectObject(sphere).length > 0) {
    draggingSphere = true;
    controls.enabled = false;
  }
});

window.addEventListener('pointerup', () => {
  draggingSphere = false;
  controls.enabled = true;
});

window.addEventListener('pointermove', (ev) => {
  if (!draggingSphere) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  if (raycaster.ray.intersectPlane(dragPlane, dragHit)) {
    sphere.position.x = THREE.MathUtils.clamp(dragHit.x, -8, 8);
    sphere.position.z = THREE.MathUtils.clamp(dragHit.z, -8, 8);
    dirty = true;
  }
});

window.addEventListener('keydown', (e) => keyState.add(e.code));
window.addEventListener('keyup', (e) => keyState.delete(e.code));
window.addEventListener('blur', () => keyState.clear());

function updateCubeMovement(delta) {
  const speed = 4.2;
  const rotSpeed = 1.4;

  const prevPos = cube.position.clone();
  const prevQuat = cube.quaternion.clone();

  if (keyState.has('KeyW')) cube.position.z -= speed * delta;
  if (keyState.has('KeyS')) cube.position.z += speed * delta;
  if (keyState.has('KeyA')) cube.position.x -= speed * delta;
  if (keyState.has('KeyD')) cube.position.x += speed * delta;
  if (keyState.has('KeyQ')) cube.position.y -= speed * delta;
  if (keyState.has('KeyE')) cube.position.y += speed * delta;

  if (keyState.has('KeyJ')) cube.rotateY(rotSpeed * delta);
  if (keyState.has('KeyL')) cube.rotateY(-rotSpeed * delta);
  if (keyState.has('KeyI')) cube.rotateX(rotSpeed * delta);
  if (keyState.has('KeyK')) cube.rotateX(-rotSpeed * delta);
  if (keyState.has('KeyU')) cube.rotateZ(rotSpeed * delta);
  if (keyState.has('KeyO')) cube.rotateZ(-rotSpeed * delta);

  cube.position.x = THREE.MathUtils.clamp(cube.position.x, -8, 8);
  cube.position.y = THREE.MathUtils.clamp(cube.position.y, 0.5, 8);
  cube.position.z = THREE.MathUtils.clamp(cube.position.z, -8, 8);

  if (!prevPos.equals(cube.position) || prevQuat.angleTo(cube.quaternion) > 1e-8) {
    dirty = true;
  }
}

async function recomputeIfNeeded() {
  if (!dirty) return;

  const request = backend.intersect(getInputPayload());
  latestRequestId = request.id;

  try {
    const result = await request.promise;
    if (request.id !== latestRequestId) return;

    const positions = result.positions instanceof Float32Array ? result.positions : new Float32Array(result.positions);
    syncOverlay(positions);
    updateMetricsOverlay(result.metrics);
  } catch {
    backendStatus = 'fallback-pending';
  } finally {
    if (request.id === latestRequestId) dirty = false;
  }
}

function onResize() {
  renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);
  camera.aspect = mainContainer.clientWidth / mainContainer.clientHeight;
  camera.updateProjectionMatrix();
  resizePanelCanvas(panels.xy);
  resizePanelCanvas(panels.xz);
  resizePanelCanvas(panels.yz);
  dirty = true;
}

window.addEventListener('resize', onResize);
onResize();

const clock = new THREE.Clock();
function animate() {
  const dt = clock.getDelta();
  updateCubeMovement(dt);
  void recomputeIfNeeded();

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('beforeunload', () => {
  backend.dispose();
});
