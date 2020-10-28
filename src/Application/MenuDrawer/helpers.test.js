import { link2Id } from "./helpers";

test("link2Id should return proper value", () => {
  expect(
    link2Id(
      "https://drive.google.com/drive/folders/13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr?usp=sharing"
    )
  ).toBe("13s5wep_gYYVCroQcFB6nJHMWz8V2Onsr");
});
