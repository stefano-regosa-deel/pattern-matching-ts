import assert from 'assert'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import * as M from '../src/matchW'

describe('pattern matching pipeble', () => {
  interface ServerResponse<Code extends string | number> {
    readonly code: Code
  }

  interface Response<Body> {
    readonly response: {
      readonly body: Body
    }
  }
  interface Success extends ServerResponse<200>, Response<ReadonlyArray<string>> {}

  interface NotFoundError extends ServerResponse<404> {}
  interface ServerError extends ServerResponse<500> {
    readonly detail: string
  }

  type Responses = Success | NotFoundError | ServerError

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
  type RGB = Record<'r' | 'g' | 'b',string>
  const either = (maybeRgb: E.Either<string,RGB>) => pipe(
    maybeRgb,
    M.matchW('_tag')({
      Left: ({ left }) => 'Error: ' + left,
      Right: ({ right: { r, g, b } }) => `Red: ${r} | Green: ${g} | Blue: ${b}`
    })
  )
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
      Left: ({ left }) => 'Error: ' + left
    })
  )

  it('Either', () => {
    assert.deepStrictEqual(eitherMatchingRight, 'Red: 255 | Green: 255 | Blue: 0')
    assert.deepStrictEqual(eitherMatchingLeft, 'Error: RGB color values not found')
  })

  const matchResponse = (response: Responses) =>
    pipe(
      response,
      M.matchW('code')({
        500: ({ detail }) => ({ message: 'Internal server error', detail }),
        404: () => ({ message: 'The page cannot be found!' }),
        200: ({ response }) => response.body,
        _: () => 'Unexpected response'
      })
    )

  it('Response', () => {
    assert.deepStrictEqual(matchResponse({ code: 200, response: { body: ['data'] } }), ['data'])
    assert.deepStrictEqual(matchResponse({ code: 500, detail: 'Cannot connect to the database' }), {
      message: 'Internal server error',
      detail: 'Cannot connect to the database'
    })
    assert.deepStrictEqual(matchResponse({ code: 404 }), { message: 'The page cannot be found!' })
  })

  it('Default', () => {
    assert.deepStrictEqual(matchResponse((null as unknown) as ServerError), 'Unexpected response')
    assert.deepStrictEqual(matchResponse((undefined as unknown) as ServerError), 'Unexpected response')
    assert.deepStrictEqual(matchResponse(({ code: '_', value: '' } as unknown) as ServerError), 'Unexpected response')
  })
})
