import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mainContainer = document.getElementById('main3d');
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

const axes = new THREE.AxesHelper(3.5);
scene.add(axes);

const sphereRadius = 1.4;
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(sphereRadius, 40, 30),
  new THREE.MeshStandardMaterial({ color: 0x2ac0ff, metalness: 0.1, roughness: 0.3 })
);
sphere.position.set(-2.5, 1.6, 0);
scene.add(sphere);

const cubeSize = 3;
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
  new THREE.MeshStandardMaterial({ color: 0xf08cff, metalness: 0.15, roughness: 0.3 })
);
cube.position.set(2.3, 1.5, 0.6);
scene.add(cube);

const overlapPoints = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0x7dff7f, size: 0.065, sizeAttenuation: true })
);
scene.add(overlapPoints);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -sphere.position.y);
const dragHit = new THREE.Vector3();
let draggingSphere = false;

renderer.domElement.addEventListener('pointerdown', (ev) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(sphere);
  if (hit.length > 0) {
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
  }
});

const keyState = new Set();
window.addEventListener('keydown', (e) => keyState.add(e.code));
window.addEventListener('keyup', (e) => keyState.delete(e.code));

const panels = {
  xy: document.getElementById('xy'),
  xz: document.getElementById('xz'),
  yz: document.getElementById('yz')
};

function resizePanelCanvas(canvas) {
  const dpr = Math.min(devicePixelRatio, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
}

function drawProjection(canvas, points, axisA, axisB, worldMin = -8, worldMax = 8) {
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

  if (points.length === 0) return;
  ctx.fillStyle = '#70ff73';
  for (const p of points) {
    const u = toPx(p[axisA]) * w;
    const v = (1 - toPx(p[axisB])) * h;
    ctx.fillRect(u - 1, v - 1, 3, 3);
  }
}

function sampleIntersectionPoints(samplesPerAxis = 15) {
  const bMin = cube.position.clone().addScalar(-cubeSize / 2);
  const bMax = cube.position.clone().addScalar(cubeSize / 2);

  const min = new THREE.Vector3(
    Math.max(bMin.x, sphere.position.x - sphereRadius),
    Math.max(bMin.y, sphere.position.y - sphereRadius),
    Math.max(bMin.z, sphere.position.z - sphereRadius)
  );
  const max = new THREE.Vector3(
    Math.min(bMax.x, sphere.position.x + sphereRadius),
    Math.min(bMax.y, sphere.position.y + sphereRadius),
    Math.min(bMax.z, sphere.position.z + sphereRadius)
  );

  if (min.x >= max.x || min.y >= max.y || min.z >= max.z) return [];

  const points = [];
  for (let i = 0; i <= samplesPerAxis; i++) {
    for (let j = 0; j <= samplesPerAxis; j++) {
      for (let k = 0; k <= samplesPerAxis; k++) {
        const x = THREE.MathUtils.lerp(min.x, max.x, i / samplesPerAxis);
        const y = THREE.MathUtils.lerp(min.y, max.y, j / samplesPerAxis);
        const z = THREE.MathUtils.lerp(min.z, max.z, k / samplesPerAxis);
        const dx = x - sphere.position.x;
        const dy = y - sphere.position.y;
        const dz = z - sphere.position.z;
        if (dx * dx + dy * dy + dz * dz <= sphereRadius * sphereRadius) {
          points.push({ x, y, z });
        }
      }
    }
  }
  return points;
}

function updateCubeMovement(delta) {
  const speed = 4.2;
  if (keyState.has('KeyW')) cube.position.z -= speed * delta;
  if (keyState.has('KeyS')) cube.position.z += speed * delta;
  if (keyState.has('KeyA')) cube.position.x -= speed * delta;
  if (keyState.has('KeyD')) cube.position.x += speed * delta;
  if (keyState.has('KeyQ')) cube.position.y -= speed * delta;
  if (keyState.has('KeyE')) cube.position.y += speed * delta;

  cube.position.x = THREE.MathUtils.clamp(cube.position.x, -8, 8);
  cube.position.y = THREE.MathUtils.clamp(cube.position.y, 0.5, 8);
  cube.position.z = THREE.MathUtils.clamp(cube.position.z, -8, 8);
}

function syncOverlay(points) {
  drawProjection(panels.xy, points, 'x', 'y');
  drawProjection(panels.xz, points, 'x', 'z');
  drawProjection(panels.yz, points, 'y', 'z');

  const arr = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    arr[i * 3 + 0] = points[i].x;
    arr[i * 3 + 1] = points[i].y;
    arr[i * 3 + 2] = points[i].z;
  }
  overlapPoints.geometry.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  overlapPoints.geometry.computeBoundingSphere();
}

function onResize() {
  renderer.setSize(mainContainer.clientWidth, mainContainer.clientHeight);
  camera.aspect = mainContainer.clientWidth / mainContainer.clientHeight;
  camera.updateProjectionMatrix();
  resizePanelCanvas(panels.xy);
  resizePanelCanvas(panels.xz);
  resizePanelCanvas(panels.yz);
}

window.addEventListener('resize', onResize);
onResize();

const clock = new THREE.Clock();
function animate() {
  const dt = clock.getDelta();
  updateCubeMovement(dt);
  const points = sampleIntersectionPoints(13);
  syncOverlay(points);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
