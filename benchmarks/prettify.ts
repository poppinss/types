import { bench } from '@ark/attest'
import { type Prettify } from '../src/base.ts'

export type BaseLine = Prettify<{}>

bench('prettify', () => {
  type JSONObject<V> = Prettify<{
    [K in keyof V]: V[K]
  }>
  type JSONArray<V> = Prettify<Array<V>>

  type User = JSONObject<{
    id: number
    scores: JSONArray<number>
    profile: JSONObject<{
      twitterHandle?: string
      githubHandle?: string
    }>
  }>

  return {} as User
}).types([1, 'instantiations'])
