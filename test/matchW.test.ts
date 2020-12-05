import * as assert from 'assert'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import * as M from '../src/matchW'

describe('pattern matching pipeble', () => {
  const optionMatching = (o: O.Option<string>) =>
    pipe(
      o,
      M.matchW('_tag')({
        Some: ({ value }) => 'Something: ' + value,
        None: () => 'Nothing',
        _: () => 'Default'
      })
    )

  it('Option', () => {
    assert.deepStrictEqual(optionMatching(O.some('data')), 'Something: data')
    assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
    assert.deepStrictEqual(optionMatching((undefined as unknown) as O.None), 'Default')
    assert.deepStrictEqual(optionMatching((null as unknown) as O.None), 'Default')
    assert.deepStrictEqual(optionMatching(('' as unknown) as O.None), 'Default')
  })

  const eitherMatchingRight = pipe(
    E.right({ r: 255, g: 255, b: 0 }),
    M.matchW('_tag')({
      Right: ({ right: { r, g, b } }) => `Red: ${r} | Green: ${g} | Blue: ${b}`,
      Left: ({ left }) => 'Error: ' + left
    })
  )

  const eitherMatchingLeft = pipe(
    E.left('RGB color values not found'),
    M.matchW('_tag')({
      Right: ({ right: { r, g, b } }) => `Red: ${r} | Green: ${g} | Blue: ${b}`,
      Left: ({ left }) => 'Error: ' + left,
      _: () => 'ok'
    })
  )

  it('Either', () => {
    assert.deepStrictEqual(eitherMatchingRight, 'Red: 255 | Green: 255 | Blue: 0')
    assert.deepStrictEqual(eitherMatchingLeft, 'Error: RGB color values not found')
  })

  interface ServerResponse<Code extends string | number> {
    readonly code: Code
  }

  interface Success extends ServerResponse<200> {
    readonly response: {
      readonly body: unknown
    }
  }

  interface Failure extends ServerResponse<404 | 500> {
    readonly detail?: unknown
  }

  const matchResponse = (response: Success | Failure) =>
    pipe(
      response,
      M.matchW('code')({
        200: ({ response }) => response.body,
        404: () => 'The page cannot be found!',
        500: ({ detail }) => `Internal server error: ${detail}`,
        _: () => 'Unexpected response'
      })
    )

  it('match reponse', () => {
    assert.deepStrictEqual(matchResponse({ code: 200, response: { body: 'data' } }), 'data')
    assert.deepStrictEqual(
      matchResponse({ code: 500, detail: 'Cannot connect to the database' }),
      'Internal server error: Cannot connect to the database'
    )
    assert.deepStrictEqual(matchResponse({ code: 404 }), 'The page cannot be found!')
  })
  it('Default', () => {
    assert.deepStrictEqual(matchResponse((null as unknown) as Failure), 'Unexpected response')
    assert.deepStrictEqual(matchResponse((undefined as unknown) as Failure), 'Unexpected response')
    assert.deepStrictEqual(matchResponse(({ code: '_', value: '' } as unknown) as Failure), 'Unexpected response')
  })
})
