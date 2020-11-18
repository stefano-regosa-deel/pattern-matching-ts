import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'

export type NonTagType<A, K extends keyof A, Type extends string> = Omit<Extract<A, { [k in K]: Type }>, K>

type Matcher<_Tag extends string, A extends { [k in _Tag]: string }, R = unknown> = {
  [K in A[_Tag]]: (v: NonTagType<A, _Tag, K>) => R
}
type ReturnFromMatcher<A extends Record<string, unknown>> = {
  [P in keyof A]: A[P] extends (...args: infer P) => infer R ? (...args: P) => R : never
}[keyof A]

interface DefaultCase { readonly '_': () => any }

export const matchP = <_Tag extends string>(
  _tag: _Tag /* _tag */
) => <A extends { [k in _Tag ]: string }>(
  matcher: Matcher<_Tag, A> | DefaultCase /* Case */
) => <R extends ReturnFromMatcher<Matcher<_Tag, A>>>(
  v: A
): R => {
  return (matcher as any)[typeof v?.[_tag] !== 'undefined' ? v?.[_tag] : '_' ](v)
}

pipe(
  O.some('wow'),
  matchP('_tag')({
    None: () => 'oh noooo ',
    Some: ({ value }) => 'some ' + value,
    _: () => 'stocazzo'
  })
)
export interface Left<E> {
  readonly _tag: 'Left'
  readonly left: E
}
export interface Right<A> {
  readonly _tag: 'Right'
  readonly right: A
}
export type Either<E, A> = Left<E> | Right<A>
export const left = <E = never, A = never>(e: E): Either<E, A> => ({ _tag: 'Left', left: e })
pipe(
  E.left({ r: 'R', g: 'G', b: 1 }),
  matchP('_tag')({
    Left: ({ left: { r, g, b } }) => `Red: ${r} | Green: ${g} | Blue: ${b}`,
    Right: ({ right }) => 'is right' + right
  })
)
