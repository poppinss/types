import { bench } from '@ark/attest'
import { type InferRouteParams } from '../src/route.ts'

export type BaseLine = InferRouteParams<'/'>

bench('prettify', () => {
  type ViewUser = InferRouteParams<'/users/:id/:name/:slug?'>
  return {} as ViewUser
}).types([1, 'instantiations'])
