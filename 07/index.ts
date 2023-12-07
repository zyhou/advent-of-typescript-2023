import { Expect, Equal } from "type-testing";

type AppendGood<T> = {
  [K in keyof T as `good_${string & K}`]: T[K];
};

// ------------------- Test section ---------------------

interface WellBehavedList {
  tom: { address: "1 candy cane lane" };
  timmy: { address: "43 chocolate dr" };
  trash: { address: "637 starlight way" };
  candace: { address: "12 aurora" };
  1: { address: "12 aurora" };
}
type test_wellBehaved_actual = AppendGood<WellBehavedList>;
//   ^?
interface test_wellBehaved_expected {
  good_tom: { address: "1 candy cane lane" };
  good_timmy: { address: "43 chocolate dr" };
  good_trash: { address: "637 starlight way" };
  good_candace: { address: "12 aurora" };
}
type test_wellBehaved = Expect<
  Equal<test_wellBehaved_expected, test_wellBehaved_actual>
>;

interface Unrelated {
  dont: "cheat";
  play: "fair";
}
type test_Unrelated_actual = AppendGood<Unrelated>;
//   ^?
interface test_Unrelated_expected {
  good_dont: "cheat";
  good_play: "fair";
}
type test_Unrelated = Expect<
  Equal<test_Unrelated_expected, test_Unrelated_actual>
>;
