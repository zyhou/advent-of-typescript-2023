import { Expect, Equal } from "type-testing";

type Toy = ["🛹", "🚲", "🛴", "🏄"];

// copy paste from day 13
type BuildTuple<
  Length,
  Value,
  Tuple extends Value[] = [],
> = Tuple["length"] extends Length
  ? Tuple
  : BuildTuple<Length, Value, [...Tuple, Value]>;

type Rebuild<T extends number[], $acc extends string[] = []> = T extends [
  infer First,
  ...infer Rest extends number[],
]
  ? [
      ...BuildTuple<First, Toy[$acc["length"]]>,
      ...Rebuild<Rest, $acc["length"] extends 3 ? [] : ["", ...$acc]>,
    ]
  : [];

// ------------------- Test section ---------------------

type test_0_actual = Rebuild<[2, 1, 3, 3, 1, 1, 2]>;
//   ^?
type test_0_expected = [
  "🛹",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
  "🛴",
  "🏄",
  "🏄",
  "🏄",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Rebuild<[3, 3, 2, 1, 2, 1, 2]>;
//   ^?
type test_1_expected = [
  "🛹",
  "🛹",
  "🛹",
  "🚲",
  "🚲",
  "🚲",
  "🛴",
  "🛴",
  "🏄",
  "🛹",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Rebuild<[2, 3, 3, 5, 1, 1, 2]>;
//   ^?
type test_2_expected = [
  "🛹",
  "🛹",
  "🚲",
  "🚲",
  "🚲",
  "🛴",
  "🛴",
  "🛴",
  "🏄",
  "🏄",
  "🏄",
  "🏄",
  "🏄",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
];
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
