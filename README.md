<div align="center">
  <img src="https://github.com/nrdlab/pattern-matching-ts/blob/matchW/img/pattern-matching-ts.png?raw=true">
</div>

<h4 align="center">
  <strong>Pattern matching</strong> in <strong>Typescript</strong>.
</h4>

<p>
  <strong>Pattern Matching</strong> is a declarative much more powerful and less verbose alternative to imperatives <i>"if/else"</i> conditions.<br/>
  A definition can be found inside <a href="https://docs.scala-lang.org/tour/pattern-matching.html"><strong>Scala Documentation</strong></a><br><br>
<i>“Pattern matching tests whether a given value (or sequence of values) has the shape defined by a pattern, and, if it does, binds the variables in the pattern to the corresponding components of the value (or sequence of values).”</i><br><br>
  In <strong>Functional Programming languages</strong>, there're built-in keywords for <strong>Pattern Matching</strong>. <strong>Typescript</strong> though is one language that works very well with <strong>Functional Programming</strong> but lacks this feature.<br/>
This package aims to bring <strong>Pattern Matching</strong> feature to <strong>Typescript</strong> through <strong>Discriminated Union Types</strong> / <strong>Algebraic Data Types</strong>.
</p>

<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/pattern-matching-ts?color=green&logo=yarn&logoColor=white&style=flat-square">
      <a href="https://codecov.io/gh/nrdlab/pattern-matching-ts">
        <img src="https://codecov.io/gh/nrdlab/pattern-matching-ts/branch/matchW/graph/badge.svg?token=1V23E6VDHN"/>
      </a>
<a href="https://github.com/nrdlab/pattern-matching-ts/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/nrdlab/pattern-matching-ts?style=flat-square"></a>
<a href="https://github.com/nrdlab/pattern-matching-ts/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/nrdlab/pattern-matching-ts?color=green&style=flat-square"></a>
<a href="https://github.com/nrdlab/pattern-matching-ts/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/nrdlab/pattern-matching-ts?color=green&style=flat-square"></a>
  <a href="https://github.com/nrdlab/pattern-matching-ts/actions?query=workflow%3ACI">
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/nrdlab/pattern-matching-ts/CI?style=flat-square">
  <a>
  <a href="https://www.npmjs.com/package/pattern-matching-ts">
    <img src="https://badge.fury.io/js/ts-pattern.svg" alt="npm version" >
  </a>
  <a href="https://app.codecov.io/gh/nrdlab/pattern-matching-ts/branch/matchW">
    <img src="https://img.shields.io/badge/coverage-100%25-brightgreen" >
  </a>
</p>

<br />

# Index

- [Installation](#installation)
- [Usage](#usage)

---

- [Match](#match)
  - [Match Option](#option-match)
  - [Match Default ](#default-match)
- [MatchW](#matchW)
  - [MatchW Option](#option-MatchW)
  - [MatchW Either](#either-MatchW)
  - [MatchW Default](#default-matchW)

---

- [License](#license)

# Installation

**yarn**

```sh
yarn add pattern-matching-ts
```

**npm**

```sh
npm install --save pattern-matching-ts
```

# Usage

**_MatchW_**

> ### Option MatchW

```ts
import * as M from 'pattern-matching-ts/lib/match'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'

const optionMatching = (o: unknown) =>
  pipe(
    o,
    M.matchW('_tag')({
      Some: ({ value }) => 'Something: ' + value,
      None: () => 'Nothing',
      _: () => 'Default'
    })
  )

assert.deepStrictEqual(optionMatching(O.some('data')), 'Something: data')
assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
assert.deepStrictEqual(optionMatching((undefined as unknown) as O.None), 'Default')
```

> ### Either MatchW

```ts
import * as M from 'pattern-matching-ts/lib/match'
import { pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'

type RGB = Record<'r' | 'g' | 'b', number>
const either = (maybeRgb: E.Either<string, RGB>) =>
  pipe(
    maybeRgb,
    M.matchW('_tag')({
      Left: ({ left }) => 'Error: ' + left,
      Right: ({ right: { r, g, b } }) => `Red: ${r} | Green: ${g} | Blue: ${b}`
    })
  )

assert.deepStrictEqual(either(E.right({ r: 255, g: 255, b: 0 })), 'Red: 255 | Green: 255 | Blue: 0')
```

> ### Default MatchW

```ts
import * as M from 'pattern-matching-ts/lib/match'
import { pipe } from 'fp-ts/lib/function'

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

assert.deepStrictEqual(either(E.right({ r: 255, g: 255, b: 0 })), 'Red: 255 | Green: 255 | Blue: 0')
assert.deepStrictEqual(matchResponse({ code: 200, response: { body: ['data'] } }), ['data'])
assert.deepStrictEqual(matchResponse({ code: 500, detail: 'Cannot connect to the database' }), {
  message: 'Internal server error',
  detail: 'Cannot connect to the database'
})
assert.deepStrictEqual(matchResponse({ code: 404 }), { message: 'The page cannot be found!' })
```

**_Match_**

> ### Option Match 

```ts
import * as M from 'pattern-matching-ts/lib/match'
import * as O from 'fp-ts/lib/Option'

const optionMatching = M.match<O.Option<string>, string>({
  Some: (x) => `Something: ${x.value}`,
  None: () => 'Nothing'
})

assert.deepStrictEqual(optionMatching(O.some('data')), 'Something: data')
assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
```

> ### Default Match

```ts
import * as M from 'pattern-matching-ts/lib/match'

interface ChangeColor<T = number> {
  readonly _tag: 'ChangeColor'
  readonly value: {
    readonly r: T
    readonly g: T
    readonly b: T
  }
}
interface Move<T = number> {
  readonly _tag: 'Move'
  readonly value: {
    readonly x: T
    readonly y: T
  }
}
interface Write {
  readonly _tag: 'Write'
  readonly value: {
    readonly text: string
  }
}

type Cases = ChangeColor<number> | Move | Write
const matchMessage = M.match<Cases, string>({
  ChangeColor: ({ value: { r, g, b } }) => `Change the color to Red: ${r} | Green: ${g} | Blue: ${b}`,
  Move: ({ value: { x, y } }) => `Move in the x direction: ${x} and in the y direction: ${y}`,
  Write: ({ value: { text } }) => `Text message: ${text}`,
  _: () => 'Default message'
})

const ChangeColor = ({ r, g, b }: ChangeColor<number>['value']): ChangeColor<number> => ({
  _tag: 'ChangeColor',
  value: { r, g, b }
})

const Move = ({ x, y }: Move['value']): Move => ({
  _tag: 'Move',
  value: { x, y }
})

const Write = ({ text }: Write['value']): Write => ({
  _tag: 'Write',
  value: { text }
})

assert.deepStrictEqual(
  matchMessage(Move({ x: 500, y: 100 })),
  'Move in the x direction: 500 and in the y direction: 100'
)

assert.deepStrictEqual(
  matchMessage(ChangeColor({ r: 12, g: 20, b: 30 })),
  'Change the color to Red: 12 | Green: 20 | Blue: 30'
)

assert.deepStrictEqual(matchMessage(Write({ text: 'my message' })), 'Text message: my message')
```

Here's a blog post that introduces the API. 👉
[Pattern Matching in Typescript](https://dev.to/stefano_regosa/typescript-pattern-matching-ne8)

[MIT](/LICENSE.md)
