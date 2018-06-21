var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
get({ a: 1 }, 'a'); // ok
get({ a: 1 }, 'b'); // error
// 2)
var translations = {
    when: 'Quando',
    where: 'Dove'
};
var translate = function (key) { return translations[key]; };
translate('when'); // ok
translate('foo'); // error
getTranslate(translations)('when'); // ok
getTranslate(translations)('foo'); // error
get('foo', { foo: 2 }); // ok
get('baz', { foo: 2 }); // error
var r = set('a', 2, { b: 'c' });
var Iso = /** @class */ (function () {
    function Iso(get, reverseGet) {
        this.get = get;
        this.reverseGet = reverseGet;
        this.to = get;
        this.unwrap = get;
        this.from = reverseGet;
        this.wrap = reverseGet;
    }
    return Iso;
}());
var meter2Km = new Iso(function (s) { return s.toString(); }, function (a) { return parseInt(a, 10); });
meter2Km.get(1200); // 1.2
meter2Km.to(1200); // 1.2
meter2Km.unwrap(1200); // 1.2
meter2Km.reverseGet('1200'); // 1.2
meter2Km.from('1200'); // 1.2
meter2Km.wrap('1200'); // 1.2
meter2Km.foo(1200); // 1.2
pick(['a', 'b'], { a: 1, b: 2, c: 3 }); // ok
pick(['a', 'b', 'd'], { a: 1, b: 2, c: 3 }); // error
getter('a')({ a: 1 }); // ok
getter('a')({ b: 1 }); // error
var Some = /** @class */ (function () {
    function Some(value) {
        this.value = value;
    }
    Some.prototype.map = function (f) {
        return new Some(f(this.value));
    };
    return Some;
}());
var None = /** @class */ (function () {
    function None() {
    }
    None.prototype.map = function (f) {
        return new None();
    };
    return None;
}());
var none = new None();
var some = function (a) { return new Some(a); };
var Type = /** @class */ (function () {
    function Type(decode) {
        this.decode = decode;
    }
    return Type;
}());
// Esercizio. Rappresentare Array<any>
var arrayAny = new Type(function (v) { return Array.isArray(v) ? some(v) : none; });
console.log(arrayAny.decode(['caio', 'ciao'])); // some
console.log(arrayAny.decode([])); // none
console.log(arrayAny.decode(['caio', 1])); // some
console.log(arrayAny.decode('caio')); // error
// Esercizio. Rappresentare Array<A>
var TypedArray = /** @class */ (function (_super) {
    __extends(TypedArray, _super);
    function TypedArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TypedArray;
}(Type));
var stringArray = new TypedArray(function (v) { return Array.isArray(v) ? some(v) : none; });
console.log(stringArray.decode(['caio', 'ciao'])); // some
console.log(stringArray.decode([])); // none
console.log(stringArray.decode(['caio', 1])); // error
console.log(stringArray.decode('caio')); // error
// Esercizio. Rappresentare { [key: string]: A }
// Esercizio. Rappresentare una generica interface
