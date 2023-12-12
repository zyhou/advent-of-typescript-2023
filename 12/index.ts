import { Expect, Equal } from "type-testing";

// recursion
// type FindSanta<T> = T extends [...infer Rest, infer Last]
//   ? Last extends "🎅🏼"
//     ? Rest["length"]
//     : FindSanta<Rest>
//   : never;

// The best one imo
// source: https://twitter.com/ecyrbedev/status/1734578564215812513
// type FindSanta<
//   T,
//   K extends keyof T = keyof T,
// > = K extends `${infer Index extends number}`
//   ? T[K] extends "🎅🏼"
//     ? Index
//     : never
//   : never;

type StringToNumber<T> = T extends `${infer R extends number}` ? R : never;

type FindSanta<T extends unknown[]> = {
  [K in keyof T]: T[K] extends "🎅🏼" ? StringToNumber<K> : never;
}[number];

// ------------------- Test section ---------------------

type Forest0 = ["🎅🏼", "🎄", "🎄", "🎄"];
type test_0_actual = FindSanta<Forest0>;
//   ^?
type test_0_expected = 0;
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type Forest1 = ["🎄", "🎅🏼", "🎄", "🎄", "🎄", "🎄"];
type test_1_actual = FindSanta<Forest1>;
//   ^?
type test_1_expected = 1;
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type Forest2 = ["🎄", "🎄", "🎅🏼", "🎄"];
type test_2_actual = FindSanta<Forest2>;
//   ^?
type test_2_expected = 2;
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;

type Forest3 = ["🎄", "🎄", "🎄", "🎅🏼", "🎄"];
type test_3_actual = FindSanta<Forest3>;
//   ^?
type test_3_expected = 3;
type test_3 = Expect<Equal<test_3_expected, test_3_actual>>;

type Forest4 = ["🎄", "🎄", "🎄", "🎄"];
type test_4_actual = FindSanta<Forest4>;
//   ^?
type test_4_expected = never;
type test_4 = Expect<Equal<test_4_expected, test_4_actual>>;
