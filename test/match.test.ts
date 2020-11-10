import * as assert from 'assert'
import * as O from 'fp-ts/lib/Option'
// import * as M from '../dist/lib/match'
import * as M from '../src/match'

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

describe('pattern matching', () => {
  const optionMatching = M.match<O.Option<string>, string>({
    Some: (x) => x.value,
    None: () => 'Nothing'
  })

  type TaggedUnion = Zero | One | Two
  const matching = M.match<TaggedUnion, string | number>({
    One: ({ value }) => value + 1,
    Two: ({ value }) => value.nested,
    _: () => 'value from default case'
  })

  it('Option', () => {
    assert.deepStrictEqual(optionMatching(O.some('data')), 'data')
    assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
  })

  it('match', () => {
    assert.deepStrictEqual(matching({ _tag: 'One', value: 1 }), 2)
  })

  it('match default', () => {
    //@ts-ignore
    assert.deepStrictEqual(matching(null), 'value from default case')
    //@ts-ignore
    assert.deepStrictEqual(matching(), 'value from default case')
  })
})
