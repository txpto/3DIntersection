export function quatMultiply(a, b) {
  return {
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
  };
}

export function quatRotateVec3(q, v) {
  const qv = { x: v.x, y: v.y, z: v.z, w: 0 };
  const qc = { x: -q.x, y: -q.y, z: -q.z, w: q.w };
  const tmp = quatMultiply(q, qv);
  const out = quatMultiply(tmp, qc);
  return { x: out.x, y: out.y, z: out.z };
}

export function sphereIntersectsObb(sphere, cube) {
  const inv = { x: -cube.rotation.x, y: -cube.rotation.y, z: -cube.rotation.z, w: cube.rotation.w };
  const rel = {
    x: sphere.position.x - cube.position.x,
    y: sphere.position.y - cube.position.y,
    z: sphere.position.z - cube.position.z
  };
  const local = quatRotateVec3(inv, rel);

  const cx = Math.max(-cube.halfSize.x, Math.min(cube.halfSize.x, local.x));
  const cy = Math.max(-cube.halfSize.y, Math.min(cube.halfSize.y, local.y));
  const cz = Math.max(-cube.halfSize.z, Math.min(cube.halfSize.z, local.z));

  const dx = local.x - cx;
  const dy = local.y - cy;
  const dz = local.z - cz;

  return (dx * dx + dy * dy + dz * dz) <= (sphere.radius * sphere.radius);
}

export function intersectSampled({ sphere, cube, samplesPerAxis }) {
  if (!sphereIntersectsObb(sphere, cube)) {
    return {
      positions: new Float32Array(0),
      metrics: {
        intersects: false,
        volumeApprox: 0,
        areaApprox: 0,
        min: { x: 0, y: 0, z: 0 },
        max: { x: 0, y: 0, z: 0 },
        size: { x: 0, y: 0, z: 0 }
      }
    };
  }

  const points = [];
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i <= samplesPerAxis; i++) {
    for (let j = 0; j <= samplesPerAxis; j++) {
      for (let k = 0; k <= samplesPerAxis; k++) {
        const local = {
          x: -cube.halfSize.x + (2 * cube.halfSize.x * i / samplesPerAxis),
          y: -cube.halfSize.y + (2 * cube.halfSize.y * j / samplesPerAxis),
          z: -cube.halfSize.z + (2 * cube.halfSize.z * k / samplesPerAxis)
        };

        const worldRot = quatRotateVec3(cube.rotation, local);
        const world = {
          x: worldRot.x + cube.position.x,
          y: worldRot.y + cube.position.y,
          z: worldRot.z + cube.position.z
        };

        const dx = world.x - sphere.position.x;
        const dy = world.y - sphere.position.y;
        const dz = world.z - sphere.position.z;
        if ((dx * dx + dy * dy + dz * dz) > (sphere.radius * sphere.radius)) continue;

        points.push(world.x, world.y, world.z);

        minX = Math.min(minX, world.x);
        minY = Math.min(minY, world.y);
        minZ = Math.min(minZ, world.z);
        maxX = Math.max(maxX, world.x);
        maxY = Math.max(maxY, world.y);
        maxZ = Math.max(maxZ, world.z);
      }
    }
  }

  const volumeCube = (2 * cube.halfSize.x) * (2 * cube.halfSize.y) * (2 * cube.halfSize.z);
  const totalSamples = (samplesPerAxis + 1) ** 3;
  const volumeApprox = (points.length / 3) / totalSamples * volumeCube;

  const sx = maxX - minX;
  const sy = maxY - minY;
  const sz = maxZ - minZ;
  const areaApprox = 2 * (sx * sy + sx * sz + sy * sz);

  return {
    positions: new Float32Array(points),
    metrics: {
      intersects: points.length > 0,
      volumeApprox,
      areaApprox: Number.isFinite(areaApprox) ? areaApprox : 0,
      min: { x: points.length ? minX : 0, y: points.length ? minY : 0, z: points.length ? minZ : 0 },
      max: { x: points.length ? maxX : 0, y: points.length ? maxY : 0, z: points.length ? maxZ : 0 },
      size: {
        x: points.length ? (maxX - minX) : 0,
        y: points.length ? (maxY - minY) : 0,
        z: points.length ? (maxZ - minZ) : 0
      }
    }
  };
}
