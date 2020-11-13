<div align="center">
  <img src="/img/pattern-matching-ts.png">
</div>

<h4 align="center">
  Pattern matching in typescript.
</h4>

<p align="center">
  <a href="https://github.com/nrdlab/pattern-matching-ts/actions?query=workflow%3ACI">
   <img src="https://img.shields.io/badge/build-passing-green">
  <a>
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



[MIT](/LICENSE.md)