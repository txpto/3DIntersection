import { intersectSampled } from './intersection-core.js';

self.onmessage = (event) => {
  const { id, sphere, cube, samplesPerAxis } = event.data;

  try {
    const payload = intersectSampled({ sphere, cube, samplesPerAxis });
    self.postMessage({ id, ok: true, payload }, [payload.positions.buffer]);
  } catch (error) {
    self.postMessage({
      id,
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown worker error'
    });
  }
};
