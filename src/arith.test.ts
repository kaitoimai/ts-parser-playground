import { assertEquals, assertThrows } from "jsr:@std/assert";
import { parseArith } from "npm:tiny-ts-parser";
import { typecheck } from "./arith.ts";

// Positive Testing
Deno.test("typecheck true returns Boolean", () => {
  const result = typecheck(parseArith("true"));
  assertEquals(result, { tag: "Boolean" });
});

Deno.test("typecheck false returns Boolean", () => {
  const result = typecheck(parseArith("false"));
  assertEquals(result, { tag: "Boolean" });
});

Deno.test("typecheck number returns Number", () => {
  const result = typecheck(parseArith("42"));
  assertEquals(result, { tag: "Number" });
});

Deno.test("typecheck if with matching then/else types returns that type (Boolean)", () => {
  const result = typecheck(parseArith("true ? true : false"));
  assertEquals(result, { tag: "Boolean" });
});

Deno.test("typecheck if with matching then/else types returns that type (Number)", () => {
  const result = typecheck(parseArith("true ? 1 : 2"));
  assertEquals(result, { tag: "Number" });
});

Deno.test("typecheck add returns Number", () => {
  const result = typecheck(parseArith("1 + 2"));
  assertEquals(result, { tag: "Number" });
});

Deno.test("typecheck nested add returns Number", () => {
  const result = typecheck(parseArith("1 + (2 + 3)"));
  assertEquals(result, { tag: "Number" });
});

Deno.test("typecheck complex nested expressions", () => {
  const result = typecheck(parseArith("true ? 1 + 2 : 3 + 4"));
  assertEquals(result, { tag: "Number" });
});

// Negative Testing
Deno.test("typecheck if with non-boolean condition throws", () => {
  assertThrows(
    () => {
      typecheck(parseArith("42 ? true : false"));
    },
    "boolean expected",
  );
});

Deno.test("typecheck if with mismatched then/else types throws", () => {
  assertThrows(
    () => {
      typecheck(parseArith("true ? 1 : false"));
    },
    "then and else have different types",
  );
});

Deno.test("typecheck add with non-number operand throws", () => {
  assertThrows(
    () => {
      typecheck(parseArith("1 + true"));
    },
    "number expected",
  );
});
