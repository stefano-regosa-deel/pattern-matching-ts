const DEFAULT = '_'
interface DefaultCase {
  readonly [DEFAULT]: () => unknown
}

type Match<A, _Tag extends string, X, R> = (p: Extract<A, { [_tag in _Tag]: X }>) => R
/**
 * A Wider pipeable Pattern Maching Implementation
 *
 * @example
 * import * as M from 'pattern-matching-ts/lib/matchW'
 *
 * const optionMatching = (o: O.Option<string>) => pipe(
 *      o,
 *      M.matchW('_tag')({
 *       Some: ({ value }) => 'Something: ' + value,
 *       None: () => 'Nothing',
 *     })
 *  )
 *
 *   assert.deepStrictEqual(optionMatching(O.some('data')), 'Something: data')
 *   assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
 *
 * interface ServerResponse<Code extends string | number> {
 *  readonly code: Code
 * }
 *
 * interface Success extends ServerResponse<200> {
 *  readonly response: {
 *     readonly body: unknown
 *  }
 * }
 *
 * interface Failure extends ServerResponse<404 | 500> {
 *  readonly detail?: unknown
 * }
 *  const matchResponse = (response: Success | Failure) =>
 *   pipe(
 *     response,
 *     M.matchW('code')({
 *       200: ({ response }) => response.body,
 *       404: () => 'The page cannot be found!',
 *       500: ({ detail }) => `Internal server error: ${detail}`,
 *       _: () => 'Unexpected response'
 *    })
 *   )
 *
 *   assert.deepStrictEqual(matchResponse({ code: 200, response: { body: 'data' } }), 'data')
 *   assert.deepStrictEqual(matchResponse({ code: 404 }), 'The page cannot be found!')
 */
export const matchW: <_Tag extends string>(
  _tag: _Tag
) => {
  <
    A extends { [X in _Tag]: string | number | typeof DEFAULT },
    K extends { [X in A[_Tag]]: Match<A, _Tag, X, unknown> }
  >(
    k: K
  ): (match: A) => ReturnType<K[keyof K]> | DefaultCase
} = (_tag) => (k: any) => (match: any | DefaultCase) => {
  /* istanbul ignore next */
  return k?.[match?.[_tag]] ? k[match[_tag]](match) : k[DEFAULT](match)
}
