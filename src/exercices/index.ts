// 1)
declare function get<A, B extends keyof A>(
  object: A,
  key: B,
): A

get({ a: 1 }, 'a') // ok
get({ a: 1 }, 'b') // error

// 2)
const translations = {
  when: 'Quando',
  where: 'Dove'
}

type TranslationType = typeof translations;

const translate = <T extends keyof TranslationType>(key: T): string => translations[key]

translate('when') // ok
translate('foo') // error

// 3)
declare function getTranslate<T>(translations: T): <TK extends keyof T>(key: TK) => string

getTranslate(translations)('when') // ok
getTranslate(translations)('foo') // error

// 4)
interface Foo {
  foo: {
    bar: {
      baz: number
      quux: string
    }
  }
}

type Baz = Foo['foo']['bar']['baz']

// 5)
type Bar = keyof Foo['foo']['bar']

// 6)
declare function get<K extends keyof O, O extends object>(key: K, obj: O): O[K]

get('foo', { foo: 2 }) // ok
get('baz', { foo: 2 }) // error

// 7)
declare function set<
K extends string,
V,
O extends {},
NO extends O & { [k in K]: V }
>(key: K, value: V, o: O): NO

const r = set('a', 2, { b: 'c' })

// 8)
type Morph<S, A> = (s: S) => A;

type ReverseMorph<S, A> = (a: A) => S;

class Iso<S, A> {
  to: Morph<S, A>;

  unwrap: Morph<S, A>;

  from: ReverseMorph<S, A>;

  wrap: ReverseMorph<S, A>;

  constructor(
    readonly get: Morph<S, A>,
    readonly reverseGet: ReverseMorph<S, A>,
  ) {
    this.to = get
    this.unwrap = get
    this.from = reverseGet
    this.wrap = reverseGet
  }
}

const meter2Km = new Iso<number, string>(
  s => s.toString(),
  a => parseInt(a, 10)
)
meter2Km.get(1200) // 1.2
meter2Km.to(1200) // 1.2
meter2Km.unwrap(1200) // 1.2
meter2Km.reverseGet('1200') // 1.2
meter2Km.from('1200') // 1.2
meter2Km.wrap('1200') // 1.2
meter2Km.foo(1200) // 1.2

// 9)
type Key = 'foo'

type O = {
  [K in Key]: number
}

// 10)
declare function pick<O, K extends keyof O>(keys: Array<K>, obj: O): K

pick(['a', 'b'], { a: 1, b: 2, c: 3 }) // ok
pick(['a', 'b', 'd'], { a: 1, b: 2, c: 3 }) // error

// 11)
/*
  getName è un getter che lavora su un campo specifico (name),
  definire una funzione getter che, dato il nome di un campo, restituisce il
  getter corrispondente
*/
declare function getter<K extends string, O extends { [key in K]: any }>(key: K): (o: O) => O[K];

getter('a')({ a: 1 }) // ok
getter('a')({ b: 1 }) // error

// 12)
type Option<A> = Some<A> | None<A>

class Some<A> {
  value: A

  constructor(value: A) {
    this.value = value
  }

  fold = <R>(f: () => R, g: (a: A) => R) => g(this.value)

  map<B>(f: (a: A) => B): Option<B> {
    return new Some(f(this.value))
  }
}

class None<A> {
  fold = <R>(f: () => R, g: (a: A) => R) => f()
  map<B>(f: (a: A) => B): Option<B> {
    return new None()
  }
}

const none: Option<never> = new None()
const some = <A>(a: A): Option<A> => new Some(a)

class Type<A> {
  constructor(readonly decode: (v: any) => Option<A>) {}
}

// Esercizio. Rappresentare Array<any>
const arrayAny = new Type<Array<any>>(
  v => Array.isArray(v) ? some(v) : none
)

console.log(arrayAny.decode(['caio', 'ciao'])) // some
console.log(arrayAny.decode([])) // some
console.log(arrayAny.decode(['caio', 1])) // some
console.log(arrayAny.decode('caio')) // none

// Esercizio. Rappresentare Array<A>
const string = new Type<string>(
  v => typeof v === 'string' ? some(v) : none
)

const isString = (v: string) => string.decode(v).fold(() => false, () => true)

const stringArray = new Type<Array<string>>(
  v => Array.isArray(v) && v.every(isString) ? some(v) : none
)

console.log(stringArray.decode(['caio', 'ciao'])) // some
console.log(stringArray.decode([])) // some
console.log(stringArray.decode(['caio', 1])) // none
console.log(stringArray.decode('caio')) // none

// Esercizio. Rappresentare { [key: string]: A }

const objectOfStrings = new Type<object>(
  v => !Array.isArray(v) && (<any>Object).values(v).every(isString) ? some(v) : none
)

console.log(stringArray.decode({ a: 'caio', b: 'ciao' })) // some
console.log(stringArray.decode([])) // some
console.log(stringArray.decode(['caio', 1])) // none
console.log(stringArray.decode('caio')) // none

// Esercizio. Rappresentare una generica interface
