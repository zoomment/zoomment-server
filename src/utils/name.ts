export const cleanName = (input: string) => {
  const regex = /[\p{L}\s\d\._]/gu;

  const cleaned = input.trim().match(regex)?.join('') || '';

  return cleaned;
};
