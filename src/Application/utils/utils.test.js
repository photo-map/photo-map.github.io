import { chunk } from "./utils";

test("chunk happy path", () => {
  expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
  expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
});
