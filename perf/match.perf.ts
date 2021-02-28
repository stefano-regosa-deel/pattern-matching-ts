import * as Benchmark from 'benchmark'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as M from 'pattern-matching-ts/match'

const suite = new Benchmark.Suite()

const matchW = (o: O.Option<string>) =>
  pipe(
    o,
    M.matchW('_tag')({
      Some: () => 'Something',
      None: () => 'Nothing'
    })
  )

const match = M.match<O.Option<string>, string>({
  Some: () => 'Something',
  None: () => 'Nothing'
})

suite
  .add('matchW', function () {
    matchW(O.some('a'))
  })
  .add('match', function () {
    match(O.some('a'))
  })
  .on('cycle', function (event: any) {
    // tslint:disable-next-line: no-console
    console.log(String(event.target))
  })
  .on('complete', function (this: any) {
    // tslint:disable-next-line: no-console
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })
