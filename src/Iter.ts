export function count(iterable: Iterable<any>) {
  let count = 0;
  for (let iterator = iterable[Symbol.iterator](), result = iterator.next(); !result.done; result = iterator.next()) {
    count++;
  }
  return count;
}

export function filter<T>(predicate: (t: T) => boolean, iterable: Iterable<T>): Iterable<T> {
  return {
    [Symbol.iterator]: function* () {
      for (let iterator = iterable[Symbol.iterator](), result = iterator.next(); !result.done; result = iterator.next()) {
        if (predicate(result.value)) yield result.value;
      }
    }
  }
}

export function take<T>(count: number, iterable: Iterable<T>): Iterable<T> {
  return {
    [Symbol.iterator]: function* () {
      let yielded = 0;
      for (let iterator = iterable[Symbol.iterator](), result = iterator.next(); !result.done && yielded < count; result = iterator.next()) {
        yield result.value;
        yielded++;
      }
    }
  }
}

export function map<T, U>(transform: (t: T) => U, iterable: Iterable<T>): Iterable<U> {
  return {
    [Symbol.iterator]: function* () {
      for (let iterator = iterable[Symbol.iterator](), result = iterator.next(); !result.done; result = iterator.next()) {
        yield transform(result.value);
      }
    }
  }
}
