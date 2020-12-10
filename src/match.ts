interface None {
  readonly _tag: 'None'
}
interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

export type Option<A> = None | Some<A>

const DEFAULT = '_'
interface DefaultCase {
  readonly _tag: typeof DEFAULT
  readonly value: unknown
}

type _Tag<T extends { readonly _tag: string }> = T['_tag']
type MatchingType<T, Type extends string> = Extract<T, { readonly _tag: Type }>

/**
 * Pattern Maching
 *
 * @example
 * import * as M from 'pattern-matching-ts/lib/match'
 *
 * type Option<A> = None | Some<A>
 *
 * const optionMatching = M.match<Option<string>, string>({
 *   Some: (x) => x.value,
 *   None: () => 'Nothing',
 * })
 *
 * assert.deepStrictEqual(optionMatching(O.some('data')), 'data')
 * assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
 *
 * type Cases = ChangeColor<number> | Move | Write
 *
 * const matchMessage = M.match<Cases, string>({
 *   ChangeColor: ({ value: { r, g, b } }) => `Change the color to Red: ${r} | Green: ${g} | Blue: ${b}`,
 *   Move: ({ value: { x, y } }) => `Move in the x direction: ${x} and in the y direction: ${y}`,
 *   Write: ({ value: { text } }) => `Text message: ${text}`,
 *   _: () => 'Default message'
 * })
 *
 * assert.deepStrictEqual(matchMessage(ChangeColor({ r: 12, g: 20, b: 30 })),'Change the color to Red: 12 | Green: 20 | Blue: 30')
 * assert.deepStrictEqual(matchMessage(Move({ x: 500, y: 100 })),'Move in the x direction: 500 and in the y direction: 100')
 *
 */

type X = 'left' | 'right' | 'value'
type Match = {
  readonly [k in X]?: unknown
} & { readonly _tag: string }

export function match<T extends Match | DefaultCase, R = unknown>(
  pattern: T extends Option<unknown>
    ? { [K in _Tag<T>]: (x: MatchingType<T, K>) => R }
    : {
        [K in _Tag<T> | DefaultCase['_tag']]: (x: MatchingType<T, K>) => R
      }
): (x: T) => R {
  return (x) => (pattern as any)[x?._tag ?? DEFAULT](x)
}
