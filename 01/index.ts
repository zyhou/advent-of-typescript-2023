import { Expect, Equal } from "type-testing";

const age = Number(42);

type test_age = Expect<Equal<number, typeof age>>;
