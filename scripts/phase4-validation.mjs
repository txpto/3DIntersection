import { intersectSampled } from '../src/intersection-core.js';

const scenario = {
  sphere: { position: { x: 0.75, y: 0.45, z: -0.35 }, radius: 2.05 },
  cube: {
    position: { x: 0.0, y: 0.0, z: 0.0 },
    halfSize: { x: 1.5, y: 1.5, z: 1.5 },
    rotation: { x: 0.18, y: 0.22, z: 0.09, w: 0.955 }
  }
};

const resolutions = [8, 12, 16, 20, 24, 28, 32];
const rows = resolutions.map((samplesPerAxis) => {
  const result = intersectSampled({ ...scenario, samplesPerAxis });
  return {
    samplesPerAxis,
    volumeApprox: result.metrics.volumeApprox,
    areaApprox: result.metrics.areaApprox,
    points: result.positions.length / 3
  };
});

console.table(rows);

const first = rows[0].volumeApprox;
const last = rows.at(-1).volumeApprox;
const drift = Math.abs(last - first);

console.log(`Volume drift (res ${resolutions[0]} -> ${resolutions.at(-1)}): ${drift.toFixed(6)}`);
if (drift > 2.0) {
  console.error('Validation warning: high drift detected.');
  process.exitCode = 1;
}
