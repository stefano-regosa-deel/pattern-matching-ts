import * as assert from 'assert'
import * as O from 'fp-ts/lib/Option'
// import { match } from '../dist/lib/match'
import { match } from '../src/match'

interface Zero {
  readonly _tag: 'Zero'
  readonly value: {
    node: {
      leaf: string
    }
  }
}

interface One {
  readonly _tag: 'One'
  readonly value: number
}

interface Two {
  readonly _tag: 'Two'
  readonly value: {
    nested: string
  }
}

type TaggedUnion = Zero | One | Two

describe('pattern matching', () => {
  const optionMatching = match<O.Option<string>, string>({
    Some: (x) => x.value,
    None: () => 'Nothing here...'
  })

  const matching = match<TaggedUnion, string | number>({
    One: ({ value }) => value + 1,
    Two: ({ value }) => value.nested,
    _: () => 'this is the default case'
  })

  it('Option', () => {
    assert.deepStrictEqual(optionMatching(O.some('data')), 'data')
  })
  it('match', () => {
    matching({ _tag: 'One', value: 1 })
    assert.deepStrictEqual(optionMatching(O.some('data')), 'data')
  })
})
