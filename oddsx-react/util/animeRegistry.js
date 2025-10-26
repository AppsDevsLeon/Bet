// src/utils/animeRegistry.js
export function createAnimeRegistry() {
  const instances = new Set();
  return {
    add(inst) { if (inst) instances.add(inst); return inst; },
    playAll() { instances.forEach(i => i.play && i.play()); },
    pauseAll() { instances.forEach(i => i.pause && i.pause()); },
    reverseAll() { instances.forEach(i => i.reverse && i.reverse()); },
    clear() { instances.clear(); },
    get all() { return Array.from(instances); }
  };
}
