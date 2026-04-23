import { intersectSampled } from './intersection-core.js';

export class SamplingInlineBackend {
  constructor({ samplesPerAxis = 20 } = {}) {
    this.samplesPerAxis = samplesPerAxis;
    this.requestId = 0;
  }

  intersect(input) {
    this.requestId += 1;
    const id = this.requestId;
    const payload = intersectSampled({
      sphere: input.sphere,
      cube: input.cube,
      samplesPerAxis: this.samplesPerAxis
    });

    return { id, promise: Promise.resolve(payload) };
  }

  dispose() {}
}

export class SamplingWorkerBackend {
  constructor({ workerUrl = './src/intersection-worker.js', samplesPerAxis = 20 } = {}) {
    this.samplesPerAxis = samplesPerAxis;
    this.worker = new Worker(workerUrl, { type: 'module' });
    this.requestId = 0;
    this.pending = new Map();

    this.worker.onmessage = (event) => {
      const { id, ok, payload, error } = event.data;
      const resolver = this.pending.get(id);
      if (!resolver) return;
      this.pending.delete(id);
      if (!ok) {
        resolver.reject(new Error(error || 'Intersection worker failed'));
        return;
      }
      resolver.resolve(payload);
    };

    this.worker.onerror = (err) => {
      for (const { reject } of this.pending.values()) {
        reject(err instanceof Error ? err : new Error('Intersection worker error'));
      }
      this.pending.clear();
    };
  }

  intersect(input) {
    this.requestId += 1;
    const id = this.requestId;

    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });

    this.worker.postMessage({
      id,
      samplesPerAxis: this.samplesPerAxis,
      sphere: input.sphere,
      cube: input.cube
    });

    return { id, promise };
  }

  dispose() {
    this.worker.terminate();
    this.pending.clear();
  }
}

export function createIntersectionBackend(options = {}) {
  const { preferWorker = true, samplesPerAxis = 20 } = options;

  if (preferWorker && typeof Worker !== 'undefined') {
    try {
      return { backend: new SamplingWorkerBackend({ samplesPerAxis }), mode: 'worker' };
    } catch {
      return { backend: new SamplingInlineBackend({ samplesPerAxis }), mode: 'inline-fallback' };
    }
  }

  return { backend: new SamplingInlineBackend({ samplesPerAxis }), mode: 'inline' };
}
