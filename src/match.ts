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

type A =
  | {
      readonly _tag: string
      readonly value: unknown
    }
  | DefaultCase

/**
 * Pattern Maching function
 *
 * @example
 * import * as M from 'pattern-matching-ts'
 *
 * const optionMatching = M.match<O.Option<string>, string>({
 *   Some: (x) => x.value,
 *   None: () => 'Nothing',
 * })
 *
 *
 * assert.deepStrictEqual(optionMatching(O.some('data')), 'data')
 * assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
 *
 * @category pattern matching
 */
export function match<T extends Option<unknown> | A, R = unknown>(
  pattern: T extends Option<unknown>
    ? { [K in _Tag<T>]: (x: MatchingType<T, K>) => R }
    : {
        [K in _Tag<T> | DefaultCase['_tag']]: (x: MatchingType<T, K>) => R
      }
): (x: T) => R {
  return (x) => (pattern as any)[typeof x?._tag !== 'undefined' ? x._tag : '_'](x)
}
