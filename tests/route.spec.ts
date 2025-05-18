/*
 * @poppinss/types
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { InferRouteParams } from '../src/route.js'

test.group('Route types', () => {
  test('extract params from route identifier', ({ expectTypeOf }) => {
    expectTypeOf<InferRouteParams<'/users'>>().toEqualTypeOf<{}>()
    expectTypeOf<InferRouteParams<'/users/:id'>>().toEqualTypeOf<{ id: string }>()
    expectTypeOf<InferRouteParams<'/users/:id?'>>().toEqualTypeOf<{ id?: string }>()
    expectTypeOf<InferRouteParams<'/users/:id/:slug?'>>().toEqualTypeOf<{
      id: string
      slug?: string
    }>()
    expectTypeOf<InferRouteParams<'/users/:id.json'>>().toEqualTypeOf<{ id: string }>()
    expectTypeOf<InferRouteParams<'/users/*'>>().toEqualTypeOf<{ '*': string[] }>()
    expectTypeOf<InferRouteParams<'/posts/:category/*'>>().toEqualTypeOf<{
      'category': string
      '*': string[]
    }>()
  })
})
