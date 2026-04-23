import test from 'node:test';
import assert from 'node:assert/strict';
import { intersectSampled } from '../src/intersection-core.js';

function makeCase({ spherePos = [0, 0, 0], radius = 1, cubePos = [0, 0, 0], half = [1, 1, 1], rot = [0, 0, 0, 1], samplesPerAxis = 20 } = {}) {
  return {
    sphere: {
      position: { x: spherePos[0], y: spherePos[1], z: spherePos[2] },
      radius
    },
    cube: {
      position: { x: cubePos[0], y: cubePos[1], z: cubePos[2] },
      halfSize: { x: half[0], y: half[1], z: half[2] },
      rotation: { x: rot[0], y: rot[1], z: rot[2], w: rot[3] }
    },
    samplesPerAxis
  };
}

test('returns empty intersection when sphere and cube are far apart', () => {
  const result = intersectSampled(makeCase({ spherePos: [50, 50, 50], radius: 1, cubePos: [0, 0, 0], half: [1, 1, 1] }));
  assert.equal(result.metrics.intersects, false);
  assert.equal(result.positions.length, 0);
  assert.equal(result.metrics.volumeApprox, 0);
});

test('approximates full cube volume when sphere fully contains cube', () => {
  const half = [1.5, 1.5, 1.5];
  const expectedCubeVolume = (2 * half[0]) * (2 * half[1]) * (2 * half[2]);

  const result = intersectSampled(makeCase({
    spherePos: [0, 0, 0],
    radius: 20,
    cubePos: [0, 0, 0],
    half,
    samplesPerAxis: 28
  }));

  assert.equal(result.metrics.intersects, true);
  assert.ok(Math.abs(result.metrics.volumeApprox - expectedCubeVolume) < 0.25, `volume=${result.metrics.volumeApprox} expected=${expectedCubeVolume}`);
});

test('keeps extents non-negative and finite for partial overlap', () => {
  const result = intersectSampled(makeCase({
    spherePos: [1.2, 0.4, -0.8],
    radius: 2.0,
    cubePos: [0, 0, 0],
    half: [1.5, 1.5, 1.5],
    samplesPerAxis: 22
  }));

  assert.equal(result.metrics.intersects, true);
  assert.ok(Number.isFinite(result.metrics.size.x));
  assert.ok(Number.isFinite(result.metrics.size.y));
  assert.ok(Number.isFinite(result.metrics.size.z));
  assert.ok(result.metrics.size.x >= 0);
  assert.ok(result.metrics.size.y >= 0);
  assert.ok(result.metrics.size.z >= 0);
});

test('increases sample fidelity with higher resolution (stability check)', () => {
  const low = intersectSampled(makeCase({ spherePos: [0.6, 0.4, 0.2], radius: 1.9, half: [1.5, 1.5, 1.5], samplesPerAxis: 10 }));
  const high = intersectSampled(makeCase({ spherePos: [0.6, 0.4, 0.2], radius: 1.9, half: [1.5, 1.5, 1.5], samplesPerAxis: 28 }));

  assert.equal(low.metrics.intersects, true);
  assert.equal(high.metrics.intersects, true);
  assert.ok(Math.abs(high.metrics.volumeApprox - low.metrics.volumeApprox) < 2.0);
});
