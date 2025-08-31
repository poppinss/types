/*
 * @poppinss/types
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import type {
  Opaque,
  UnwrapOpaque,
  LazyImport,
  Constructor,
  AreAllOptional,
  ExtractDefined,
  ExtractFunctions,
  ExtractUndefined,
  UnWrapLazyImport,
  AbstractConstructor,
  NormalizeConstructor,
  DeepPartial,
} from '../src/base.js'

test.group('Base types', () => {
  test('represent a constructor type', ({ expectTypeOf }) => {
    expectTypeOf<Constructor<{ create(): any }>>().toEqualTypeOf<{
      new (...args: any[]): {
        create(): any
      }
    }>()
    expectTypeOf<Constructor<{ create(): any }, [id: number]>>().toEqualTypeOf<{
      new (id: number): {
        create(): any
      }
    }>()
  })

  test('represent an abstract constructor type', ({ expectTypeOf }) => {
    expectTypeOf<AbstractConstructor<{ create(): any }>>().toEqualTypeOf<{
      new (...args: any[]): {
        create(): any
      }
    }>()
    expectTypeOf<AbstractConstructor<{ create(): any }, [id: number]>>().toEqualTypeOf<{
      new (id: number): {
        create(): any
      }
    }>()
  })

  test('extract methods from a class', ({ expectTypeOf }) => {
    class User {
      declare id: number
      declare username: string

      create() {}
      update(_id: number, __attributes: any) {}
    }

    expectTypeOf<ExtractFunctions<User>>().toEqualTypeOf<'create' | 'update'>()
  })

  test("extract methods from a class except the one's from the base class", ({ expectTypeOf }) => {
    class Base {
      save() {}
    }

    class User extends Base {
      declare id: number
      declare username: string

      create() {}
      update(_id: number, __attributes: any) {}
    }

    expectTypeOf<ExtractFunctions<User, ExtractFunctions<Base>>>().toEqualTypeOf<
      'create' | 'update'
    >()
  })

  test('specify a lazy import', ({ expectTypeOf }) => {
    class User {}
    expectTypeOf<LazyImport<User>>().toEqualTypeOf<
      () => Promise<{
        default: User
      }>
    >()
  })

  test('unwrap a lazy import', ({ expectTypeOf }) => {
    class User {}
    expectTypeOf<UnWrapLazyImport<LazyImport<User>>>().toEqualTypeOf<User>()
  })

  test('specify opaque types', ({ expectTypeOf }) => {
    type Username = Opaque<string, 'username'>
    type Password = Opaque<string, 'password'>

    expectTypeOf<UnwrapOpaque<Username>>().toEqualTypeOf<string>()
    expectTypeOf<UnwrapOpaque<Password>>().toEqualTypeOf<string>()

    function checkUser(_: Username) {}
    // @ts-expect-error
    checkUser('hello')
    // @ts-expect-error
    checkUser('hello' as Password)
    checkUser('hello' as Username)
  })

  test('check if all are optional', ({ expectTypeOf }) => {
    expectTypeOf<AreAllOptional<{}>>().toEqualTypeOf<true>()
    expectTypeOf<AreAllOptional<{ id?: string }>>().toEqualTypeOf<true>()
    expectTypeOf<AreAllOptional<{ id?: string; foo?: string }>>().toEqualTypeOf<true>()
    expectTypeOf<
      AreAllOptional<{ id: string | undefined; foo: string | undefined }>
    >().toEqualTypeOf<true>()
    expectTypeOf<AreAllOptional<{ id: string; foo?: string }>>().toEqualTypeOf<false>()
  })

  test('extract all undefined values', ({ expectTypeOf }) => {
    expectTypeOf<ExtractUndefined<{ username: undefined }>>().toEqualTypeOf<'username'>()
    expectTypeOf<ExtractUndefined<{ username: string | undefined }>>().toEqualTypeOf<'username'>()
    expectTypeOf<
      ExtractUndefined<{ username: string | undefined | null }>
    >().toEqualTypeOf<'username'>()
    expectTypeOf<ExtractUndefined<{ username: string | null }>>().toEqualTypeOf<never>()
  })

  test('extract all defined values', ({ expectTypeOf }) => {
    expectTypeOf<ExtractDefined<{ username: undefined }>>().toEqualTypeOf<never>()
    expectTypeOf<ExtractDefined<{ username: string | undefined }>>().toEqualTypeOf<never>()
    expectTypeOf<ExtractDefined<{ username: string | undefined | null }>>().toEqualTypeOf<never>()
    expectTypeOf<ExtractDefined<{ username: string | null }>>().toEqualTypeOf<'username'>()
  })

  test('normalize constructor to work with mixins', () => {
    class Base {}

    function DatesMixin<TBase extends typeof Base>(superclass: TBase) {
      // A mixin class must have a constructor with a single rest parameter of type 'any[]'. ts(2545)
      // @ts-expect-error
      return class HasDates extends superclass {
        //           ^^
        declare createdAt: Date
        declare updatedAt: Date
      }
    }

    // Base constructors must all have the same return type.ts(2510)
    // @ts-expect-error
    class User extends DatesMixin(Base) {}
    //                      ^^

    function DatesMixinFixed<TBase extends NormalizeConstructor<typeof Base>>(superclass: TBase) {
      return class HasDates extends superclass {
        declare createdAt: Date
        declare updatedAt: Date
      }
    }

    class User1 extends DatesMixinFixed(Base) {}
    new User1()
  })

  test('mark properties deeply partial', ({ expectTypeOf }) => {
    type Config = {
      http: {
        bodyParser: {
          enabled: boolean
          parsers: [
            {
              json: {
                enabled: boolean
              }
            },
          ]
        }
        qs: {
          parse: {
            quotes: boolean
          }
          stringify: {
            arrayIndices: string
          }
        }
      }
    }

    expectTypeOf<DeepPartial<Config>>().toEqualTypeOf<{
      http?: {
        bodyParser?: {
          enabled?: boolean
          parsers?: [
            {
              json?: {
                enabled?: boolean
              }
            }?,
          ]
        }
        qs?: {
          parse?: {
            quotes?: boolean
          }
          stringify?: {
            arrayIndices?: string
          }
        }
      }
    }>()
  })
})
