import { Expect, Equal } from "type-testing";

type FilterChildrenBy<T, Filter> = T extends Filter ? never : T;

// ------------------- Test section ---------------------

type test_0_actual = FilterChildrenBy<
  //   ^?
  "nice",
  "naughty"
>;
type test_0_expected = "nice";
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = FilterChildrenBy<
  //   ^?
  "nice" | "naughty",
  "naughty"
>;
type test_1_expected = "nice";
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = FilterChildrenBy<
  //   ^?
  string | number | (() => void),
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function
>;
type test_2_expected = string | number;
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
