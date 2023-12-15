import { Expect, Equal } from "type-testing";

// It used Distributive Conditional Types
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type BoxToys<
  Word extends string,
  Length,
  Accumulator extends string[] = [],
> = Length extends Accumulator["length"]
  ? Accumulator
  : BoxToys<Word, Length, [...Accumulator, Word]>;

// ------------------- Test section ---------------------

type test_doll_actual = BoxToys<"doll", 1>;
//   ^?
type test_doll_expected = ["doll"];
type test_doll = Expect<Equal<test_doll_expected, test_doll_actual>>;

type test_nutcracker_actual = BoxToys<"nutcracker", 3 | 4>;
//   ^?
type test_nutcracker_expected =
  | ["nutcracker", "nutcracker", "nutcracker"]
  | ["nutcracker", "nutcracker", "nutcracker", "nutcracker"];
type test_nutcracker = Expect<
  Equal<test_nutcracker_expected, test_nutcracker_actual>
>;
