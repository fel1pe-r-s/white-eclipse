export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
  readonly value: L;
  readonly isLeft: true = true;
  readonly isRight: false = false;
  readonly _R!: R; // Phantom type to hold the generic

  constructor(value: L) {
    this.value = value;
  }
}

export class Right<L, R> {
  readonly value: R;
  readonly isLeft: false = false;
  readonly isRight: true = true;
  readonly _L!: L; // Phantom type to hold the generic

  constructor(value: R) {
    this.value = value;
  }
}

export const left = <L, R>(l: L): Either<L, R> => new Left(l);
export const right = <L, R>(r: R): Either<L, R> => new Right(r);

export const fold = <L, R, T>(
  e: Either<L, R>,
  onLeft: (l: L) => T,
  onRight: (r: R) => T
): T => {
  if (e.isLeft) {
    return onLeft(e.value);
  }
  return onRight(e.value);
};
