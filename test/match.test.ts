import * as assert from 'assert'
import * as O from 'fp-ts/lib/Option'
import * as M from '../src/match'

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

describe('pattern matching', () => {
  const optionMatching = M.match<O.Option<string>, string>({
    Some: (x) => `Something: ${x.value}`,
    None: () => 'Nothing'
  })

  type Cases = ChangeColor<number> | Move | Write
  const matchMessage = M.match<Cases, string>({
    ChangeColor: ({ value: { r, g, b } }) => `Change the color to Red: ${r} | Green: ${g} | Blue: ${b}`,
    Move: ({ value: { x, y } }) => `Move in the x direction: ${x} and in the y direction: ${y}`,
    Write: ({ value: { text } }) => `Text message: ${text}`,
    _: () => 'Default message'
  })

  it('Option', () => {
    assert.deepStrictEqual(optionMatching(O.some('data')), 'Something: data')
    assert.deepStrictEqual(optionMatching(O.none), 'Nothing')
  })

  it('match', () => {
    const ChangeColor = ({ r, g, b }: ChangeColor<number>['value']): ChangeColor<number> => ({
      _tag: 'ChangeColor',
      value: { r, g, b }
    })
    assert.deepStrictEqual(
      matchMessage(ChangeColor({ r: 12, g: 20, b: 30 })),
      'Change the color to Red: 12 | Green: 20 | Blue: 30'
    )

    const Move = ({ x, y }: Move['value']): Move => ({
      _tag: 'Move',
      value: { x, y }
    })
    assert.deepStrictEqual(
      matchMessage(Move({ x: 500, y: 100 })),
      'Move in the x direction: 500 and in the y direction: 100'
    )

    const Write = ({ text }: Write['value']): Write => ({
      _tag: 'Write',
      value: { text }
    })
    assert.deepStrictEqual(matchMessage(Write({ text: 'my message' })), 'Text message: my message')
  })

  it('match default', () => {
    assert.deepStrictEqual(matchMessage((null as unknown) as ChangeColor), 'Default message')
    assert.deepStrictEqual(matchMessage((undefined as unknown) as ChangeColor), 'Default message')
  })
})
