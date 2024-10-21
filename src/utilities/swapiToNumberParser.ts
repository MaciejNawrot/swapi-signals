export const swapiToNumberParser = (str: string): number | undefined => {
  const num = Number(str.replace(/,/g, ''));

  return isNaN(num) ? undefined : num;
};
