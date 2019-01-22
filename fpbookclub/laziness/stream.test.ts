import { List } from "../data_structures/list";
import { Option } from "../error_handling/option";

import stream, { Cons, Empty, Stream } from "./stream";

describe("Stream()", () => {
  test("with no arguments returns an empty stream", () => {
    expect(Stream().tag).toBe("empty");
  });

  test("with one argument returns a cons", () => {
    expect(Stream(1).tag).toBe("cons");
  });

  test("with multiple arguments returns multiple conses", () => {
    expect(Stream(1, 2, 3).toList()).toEqual(List(1, 2, 3));
  });
});

describe("drop()", () => {
  test("with 0 returns the same stream", () => {
    expect(Stream(1, 2).drop(0).toList()).toEqual(List(1, 2));
  });

  test("on an empty stream returns the empty stream", () => {
    expect(Stream().drop(3)).toEqual(stream.empty());
  });

  test("with 1 returns everything after the first element", () => {
    expect(Stream(1, 2).drop(1).toList()).toEqual(List(2));
  });
});

describe("headOption()", () => {
  test("returns Some(val) from a non-empty stream", () => {
    expect(Stream(1).headOption().getOrElse(() => -1)).toEqual(1);
  });

  test("returns None from an empty stream", () => {
    expect(Stream<number>().headOption().getOrElse(() => -1)).toEqual(-1);
  });
});

describe("cons()", () => {
  test("memoizes the provided thunk", () => {
    let n = 0;
    const val = () => {
      return ++n;
    };

    const stm = stream.cons(val, () => stream.empty());
    expect(stm.headOption().getOrElse(() => -1)).toEqual(1);
    expect(stm.headOption().getOrElse(() => -1)).toEqual(1);
  });
});

describe("dropWhile()", () => {
  test("of an empty stream returns an empty stream", () => {
    expect(Stream().dropWhile(a => true)).toEqual(stream.empty());
  });

  test("when every item passes the predicate returns empty", () => {
    expect(Stream(2, 4).dropWhile(n => n % 2 === 0)).toEqual(stream.empty());
  });

  test("drops the prefix of passing elements", () => {
    expect(Stream(2, 4, 1).dropWhile(n => n % 2 === 0).toList())
      .toEqual(List(1));
  });

  test("returns the whole stream if the first element fails", () => {
    expect(Stream(2, 4).dropWhile(n => n % 2 === 1).toList())
      .toEqual(List(2, 4));
  });
});

describe("exists()", () => {
  test("returns true if a matching element exists", () => {
    expect(Stream(1, 2, 3).exists(a => a === 2)).toEqual(true);
  });

  test("returns false if no matching element exists", () => {
    expect(Stream(1, 2, 3).exists(a => a === -1)).toEqual(false);
  });
});

describe("foldRight()", () => {
  test("folds the stream", () => {
    expect(Stream(1, 2, 3).foldRight(() => 0, (a, b) => a + b())).toEqual(6);
  });
});

describe("ones()", () => {
  test("produces all 1s", () => {
    expect(stream.ones.take(3).toList()).toEqual(List(1, 1, 1));
  });
});

describe("takeWhile()", () => {
  test("of an empty stream returns an empty stream", () => {
    expect(Stream().takeWhile(a => true)).toEqual(stream.empty());
  });

  test("when the first item fails the predicate returns empty", () => {
    expect(Stream(2, 4).takeWhile(n => n % 2 === 1)).toEqual(stream.empty());
  });

  test("returns the prefix of passing elements", () => {
    expect(Stream(2, 4, 1).takeWhile(n => n % 2 === 0).toList())
      .toEqual(List(2, 4));
  });

  test("returns the whole stream if every element passes", () => {
    expect(Stream(2, 4).takeWhile(n => n % 2 === 0).toList())
      .toEqual(List(2, 4));
  });
});

describe("toList()", () => {
  test("transforms the Stream into a List", () => {
    expect(Stream(1, 2, 3).toList()).toEqual(List(1, 2, 3));
  });
});
