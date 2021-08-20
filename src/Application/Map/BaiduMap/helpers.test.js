import { foldersToBMapPoints } from "./helpers";

test("foldersToBMapPoints should return proper value", () => {
  expect(foldersToBMapPoints([])).toEqual([]);
});
