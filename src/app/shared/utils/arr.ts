export const arraySum = (arr: number[]) =>
  arr.length <= 1 ? arr[0] : arr.reduce((a, b) => a + b);

export const asyncForeach = async (callback, arr) =>
  await new Promise((resolve) =>
    arr.forEach(async (item, idx) => {
      await callback(item);

      if (idx === arr.length - 1) {
        resolve(true);
      }
    })
  );
