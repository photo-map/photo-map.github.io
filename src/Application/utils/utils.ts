export const chunk = <T,>(array: T[], length: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0, j = array.length; i < j; i += length) {
    chunks.push(array.slice(i, i + length));
  }
  return chunks;
};