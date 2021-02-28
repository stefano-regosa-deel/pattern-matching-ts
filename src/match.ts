/**
 * @since 1.0.1
 */
const DEFAULT = '_'
interface None {
  readonly _tag: 'None'
}
interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

/**
 * @since 1.0.0
 */
export type Option<A> = None | Some<A>

interface DefaultCase {
  readonly _tag: typeof DEFAULT
  readonly value: unknown
}
interface DefaultCase {
  readonly [DEFAULT]: () => unknown
}

type _Tag<T extends { readonly _tag: string }> = T['_tag']
type MatchingType<T, Type extends string> = Extract<T, { readonly _tag: Type }>

type X = 'left' | 'right' | 'value'
type Match = {
  readonly [k in X]?: unknown
} & { readonly _tag: string }

type MatchW<A, _Tag extends string, X, R> = (p: Extract<A, { [_tag in _Tag]: X }>) => R
/**
 *  Strict `Pattern Maching` Implementation
 *
 * @example
 * import * as M from 'pattern-matching-ts/match'
 *
 * interface ChangeColor<T = number> {
 * readonly _tag: 'ChangeColor'
 * readonly value: {
 *  readonly r: T
 *  readonly g: T
 *  readonly b: T
 * }
 * }
 * interface Move<T = number> {
 *  readonly _tag: 'Move'
 *  readonly value: {
 *    readonly x: T
 *    readonly y: T
 *  }
 * }
 * interface Write {
 *  readonly _tag: 'Write'
 *  readonly value: {
 *    readonly text: string
 *  }
 * }
 *
 * type Cases = ChangeColor<number> | Move | Write
 * const matchMessage = M.match<Cases, string>({
 *  ChangeColor: ({ value: { r, g, b } }) => `Change the color to Red: ${r} | Green: ${g} | Blue: ${b}`,
 *  Move: ({ value: { x, y } }) => `Move in the x direction: ${x} and in the y direction: ${y}`,
 *  Write: ({ value: { text } }) => `Text message: ${text}`,
 *  _: () => 'Default message'
 * })
 *
 * const ChangeColor = ({ r, g, b }: ChangeColor<number>['value']): ChangeColor<number> => ({
 *   _tag: 'ChangeColor',
 *   value: { r, g, b }
 * })
 *
 * assert.deepStrictEqual(
 *    matchMessage(ChangeColor({ r: 12, g: 20, b: 30 })),
 *   'Change the color to Red: 12 | Green: 20 | Blue: 30'
 * )
 *
 *  const Move = ({ x, y }: Move['value']): Move => ({
 *   _tag: 'Move',
 *   value: { x, y }
 *  })
 *  assert.deepStrictEqual(matchMessage(Move({ x: 500, y: 100 })),
 *   'Move in the x direction: 500 and in the y direction: 100'
 *  )
 *
 *  const Write = ({ text }: Write['value']): Write => ({
 *   _tag: 'Write',
 *   value: { text }
 *  })
 *
 *  assert.deepStrictEqual(matchMessage(Write({ text: 'my message' })), 'Text message: my message')
 * @since 0.0.1
 */
export function match<T extends Match | DefaultCase, R = unknown>(
  pattern: T extends Option<unknown>
    ? { [K in _Tag<T>]: (x: MatchingType<T, K>) => R }
    : {
        [K in _Tag<T> | DefaultCase['_tag']]: (x: MatchingType<T, K>) => R
      }
): (x: T) => R {
  return (x) => (pattern as any)[x?._tag ?? DEFAULT](x)
}
/**
 * A Wider pipeable `Pattern Maching` Implementation
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import * as M from 'pattern-matching-ts/match'
 * import * as O from 'fp-ts/Option'
 *
 * const optionMatching = (o: O.Option<string>) =>
 * pipe(
 *   o,
 *   M.matchW('_tag')({
 *     Some: ({ value }) => 'Something: ' + value,
 *     None: () => 'Nothing'
 *  })
 * )
 *
 * assert.deepStrictEqual(optionMatching(O.some('data')), 'Something: data')
 * assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
 *
 * interface ServerResponse<Code extends string | number> {
 *  readonly code: Code
 * }
 *
 * interface Response<Body> {
 *  readonly response: {
 *    readonly body: Body
 *  }
 * }
 *
 * interface Success extends ServerResponse<200>, Response<ReadonlyArray<string>> {}
 *
 * interface NotFoundError extends ServerResponse<404> {}
 *
 * interface ServerError extends ServerResponse<500> {
 *  readonly detail: string
 * }
 *
 * type Responses = Success | NotFoundError | ServerError
 *
 * const matchResponse = (response: Responses) =>
 *  pipe(
 *    response,
 *    M.matchW('code')({
 *      500: ({ detail }) => ({ message: 'Internal server error', detail }),
 *      404: () => ({ message: 'The page cannot be found!' }),
 *      200: ({ response }) => response.body,
 *      _: () => 'Unexpected response'
 *    })
 *  )
 *
 * assert.deepStrictEqual(matchResponse({ code: 200, response: { body: ['data'] } }), ['data'])
 * assert.deepStrictEqual(matchResponse({ code: 500, detail: 'Cannot connect to the database' }), {
 *  message: 'Internal server error',
 *  detail: 'Cannot connect to the database'
 * })
 * assert.deepStrictEqual(matchResponse({ code: 404 }), { message: 'The page cannot be found!' })
 *
 * @since 2.0.
 */
export const matchW: <_Tag extends string>(
  _tag: _Tag
) => {
  <
    A extends { [X in _Tag]: string | number | typeof DEFAULT },
    K extends { [X in A[_Tag]]: MatchW<A, _Tag, X, unknown> }
  >(
    k: K
  ): (match: A) => ReturnType<K[keyof K]> | DefaultCase
} = (_tag) => (k: any) => (match: any | DefaultCase) => {
  /* istanbul ignore next */
  return k?.[match?.[_tag]] ? k[match[_tag]](match) : k[DEFAULT](match)
}
