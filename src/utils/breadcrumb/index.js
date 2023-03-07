export const isReachable = sequence => {
  console.log('is reachable', sequence);
  return sequence.reached && sequence.visible;
};
