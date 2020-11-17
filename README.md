<div align="center">
  <img src="/img/pattern-matching-ts.png">
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
  <a href="https://github.com/nrdlab/pattern-matching-ts/actions?query=workflow%3ACI">
   <img src="https://img.shields.io/badge/build-passing-green">
  <a>
  <a href="https://www.npmjs.com/package/pattern-matching-ts">
    <img src="https://badge.fury.io/js/ts-pattern.svg" alt="npm version" >
  </a>
  <a href="https://github.com/nrdlab/pattern-matching-ts">
    <img src="https://img.shields.io/badge/coverage-100%25-brightgreen" >
  </a>
</p>



<br />



# Index

- [Installation](#installation)
- [Usage](#usage)
  - [Option Monad Example](#option-example)
  - [Default Example](#default-example) 
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

### Option Monad Example

```ts

import * as M from 'pattern-matching-ts'

interface None {
  readonly _tag: 'None'
}

interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

type Option<A> = None | Some<A>

const optionMatching = M.match<Option<string>, string>({
    Some: (x) => `Something: ${x.value}`,
    None: () => 'Nothing'
})

assert.deepStrictEqual(optionMatching(O.some('data')), 'Something: data')

```

### Default Example

```ts

import * as M from 'pattern-matching-ts'

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
    ChangeColor: ({ value: { r, g, b } }) => `Red: ${r} | Green: ${g} | Blue: ${b}`,
    Move: ({ value: { x, y } }) => `Move in the x direction: ${x} and in the y direction: ${y}`,
    Write: ({ value: { text } }) => `Text message: ${text}`,
    _: () => 'Default message'
})

const ChangeColor = ({ r, g, b }: ChangeColor<number>['value']): ChangeColor<number> => ({
   _tag: 'ChangeColor', value: { r, g, b }
})

assert.deepStrictEqual(matchMessage(ChangeColor({ r: 12, g: 20, b: 30 })),'Red: 12 | Green: 20 | Blue: 30')

assert.deepStrictEqual(matchMessage(null), 'Default message')
```


Here's a blog post that introduces the API. 👉
[Pattern Matching in Typescript](https://dev.to/stefano_regosa/typescript-pattern-matching-ne8)


[MIT](/LICENSE.md)
