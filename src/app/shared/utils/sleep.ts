export const sleep = async (time = 200) =>
  await new Promise((resolve) => setTimeout(resolve, time));
