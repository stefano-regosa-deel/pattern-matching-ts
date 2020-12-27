## What is Pattern Matching? 


  <strong>Pattern Matching</strong> is a declarative much more powerful and less verbose alternative to imperatives <i>"if/else"</i> conditions.<br/><br/>
  A definition can be found inside <a href="https://docs.scala-lang.org/tour/pattern-matching.html"><strong>Scala Documentation</strong></a><br>
><i>“Pattern matching tests whether a given value (or sequence of values) has the shape defined by a pattern, and, if it does, binds the variables in the pattern to the corresponding components of the value (or sequence of values).”
</i>

<br>
  In <strong>Functional Programming languages</strong>, there're built-in keywords for <strong>Pattern Matching</strong>. <strong>Typescript</strong> though is one language that works very well with <strong>Functional Programming</strong> but lacks this feature, for this reason I made a package <a href="https://github.com/nrdlab/pattern-matching-ts"><strong>pattern-matching-ts</strong></a> that aims to bring <strong>Pattern Matching</strong> feature to <strong>Typescript</strong> through <strong>Discriminated Union Types</strong> / <strong>Algebraic Data Types</strong>.
</p>



## Pattern Matching with Option 
### What's an Option Monad? 

> "<i>In programming languages (more so functional programming languages) and type theory, an option type or maybe type is a polymorphic type that represents an encapsulation of an optional value; e.g., it is used as the return type of functions which may or may not return a meaningful value when they are applied. It consists of a constructor which either is empty (often named None or Nothing), or which encapsulates the original data type A (often written Just A or Some A).</i>"<br/>

<br/>
<p>Let's implement our Option Type signature</p>


```ts
interface None {
  readonly _tag: 'None'
}

interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

type Option<A> = None | Some<A>
```

<p>Now that we have defined the Option type signature we can use it as a discriminated union for our pattern matching.</p>

## The pattern-matching package 


yarn

```shell
yarn add pattern-matching-ts
```
npm
```shell
npm install --save pattern-matching-ts
```

<br/>
<p>Now we are ready to implement our option pattern matching.</p>

```ts
 * as M from 'pattern-matching-ts/lib/match' 


const optionMatching = M.match<Option<string>, string>({
  Some: (x) => `Some: ${x.value}`,
  None: () => 'Nothing'
})

assert.deepStrictEqual(
  optionMatching(O.some('data')),
   'Some: data'
)
```
<br>

Let's say we have to handle more cases than a simple value that may or not be there...

we can achieve that easily by defining a discriminated union

```ts
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
```
<br/>

Now we are ready to build our Pattern Matching by implementing all the cases 
plus the required default that uses `_:=>` as a reserved keyword.  

```ts
import * as M from 'pattern-matching-ts'

const matchMessage = M.match<Cases, string>({
    ChangeColor: ({ value: { r, g, b } }) => `Red: ${r} | Green: ${g} | Blue: ${b}`,
    Move: ({ value: { x, y } }) => `Move in the x direction: ${x} and in the y direction: ${y}`,
    Write: ({ value: { text } }) => `Text message: ${text}`,
    _: () => 'Default message' 
})

const ChangeColor = ({ r, g, b }: ChangeColor<number>['value']) => ({
   _tag: 'ChangeColor', value: { r, g, b }
}) 

assert.deepStrictEqual(
  matchMessage(ChangeColor({ r: 12, g: 20, b: 30 })),
  'Red: 12 | Green: 20 | Blue: 30'
)

assert.deepStrictEqual(matchMessage(null), 'Default message')
```

[pattern-matching-ts **source-code**](https://github.com/nrdlab/pattern-matching-ts)

[pattern-matching-ts **NPM**](https://www.npmjs.com/package/pattern-matching-ts)