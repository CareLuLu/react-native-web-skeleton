export const waitTime = time => new Promise((resolve) => {
  setTimeout(() => resolve(), time);
});

export const waitFor = async (expression) => {
  if (expression()) {
    return true;
  }
  await waitTime(100);
  return waitFor(expression);
};
