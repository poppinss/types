import { bench } from '@ark/attest'
import { type DeepPartial } from '../src/base.ts'

export type BaseLine = DeepPartial<{}>

bench('prettify', () => {
  type User = DeepPartial<{
    id: number
    scores: number[]
    profile: {
      twitterHandle?: string
      githubHandle?: string
    }
  }>

  return {} as User
}).types([1, 'instantiations'])
