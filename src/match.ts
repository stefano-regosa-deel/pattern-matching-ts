type _Tag<T extends { readonly _tag: string }> = T['_tag']
type MatchingType<T, Type extends string> = Extract<T, { readonly _tag: Type }>

interface None {
  readonly _tag: 'None'
}

interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

type Option<A> = None | Some<A>

interface DefaultCase {
  readonly _tag: '_'
  readonly value: unknown
}

type A = { readonly _tag: string } | DefaultCase

/**
 * Pattern Matching
 *
 * @example
 * import { match } from 'pattern-matching-ts/match'
 *
 *
 * assert.deepStrictEqual(1, 1)
 *
 */

export const match = <T extends Option<unknown> | A, R = unknown>(
  pattern: T extends Option<unknown>
    ? { [K in _Tag<T>]: (x: MatchingType<T, K>) => R }
    : {
        [K in _Tag<T> | DefaultCase['_tag']]: (x: MatchingType<T, K>) => R
      }
): ((x: T) => R) => (x) => (pattern as any)['_tag' in x ? x._tag : '_'](x)
