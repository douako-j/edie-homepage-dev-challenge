/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-for-each.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-for-each.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $forEach = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").forEach);
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js/internals/array-method-is-strict.js");

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;


/***/ }),

/***/ "./node_modules/core-js/internals/array-iteration.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/array-iteration.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-method-is-strict.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/array-method-is-strict.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-constructor.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-create.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arraySpeciesConstructor = __webpack_require__(/*! ../internals/array-species-constructor */ "./node_modules/core-js/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-built-in.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-global-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/define-global-property.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/document-all.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/document-all.js ***!
  \********************************************************/
/***/ ((module) => {

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/internals/dom-iterables.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/dom-iterables.js ***!
  \*********************************************************/
/***/ ((module) => {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "./node_modules/core-js/internals/dom-token-list-prototype.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/dom-token-list-prototype.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;


/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/***/ ((module) => {

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-context.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-context.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js/internals/function-uncurry-this-clause.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-native.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this-clause.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this-clause.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js/internals/weak-map-basic-detection.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-array.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/is-array.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js/internals/document-all.js");

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-constructor.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/is-constructor.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ "./node_modules/core-js/internals/is-null-or-undefined.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/is-null-or-undefined.js ***!
  \****************************************************************/
/***/ ((module) => {

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var $documentAll = __webpack_require__(/*! ../internals/document-all */ "./node_modules/core-js/internals/document-all.js");

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ ((module) => {

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/make-built-in.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/make-built-in.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").CONFIGURABLE);
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ "./node_modules/core-js/internals/math-trunc.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/math-trunc.js ***!
  \******************************************************/
/***/ ((module) => {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js/internals/object-to-string.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/object-to-string.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.29.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.29.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js/internals/symbol-constructor-detection.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-constructor-detection.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ ((module) => {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ "./node_modules/core-js/internals/weak-map-basic-detection.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/weak-map-basic-detection.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.to-string.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var toString = __webpack_require__(/*! ../internals/object-to-string */ "./node_modules/core-js/internals/object-to-string.js");

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-collections.for-each.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.for-each.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js/internals/dom-iterables.js");
var DOMTokenListPrototype = __webpack_require__(/*! ../internals/dom-token-list-prototype */ "./node_modules/core-js/internals/dom-token-list-prototype.js");
var forEach = __webpack_require__(/*! ../internals/array-for-each */ "./node_modules/core-js/internals/array-for-each.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

var handlePrototype = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype);
  }
}

handlePrototype(DOMTokenListPrototype);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/assets/styles/styles.scss":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/assets/styles/styles.scss ***!
  \********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Heebo:wght@800&family=Montserrat:wght@700&family=Poppins:wght@300;400;500;700&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*=============== Google-Font ===============*/\n:root {\n  --montserrat-font: \"Montserrat\", sans-serif;\n  --heebo-font: \"Heebo\", sans-serif;\n  --poppins-font: \"Poppins\", sans-serif;\n  --blue: #2d9cdb;\n  --green: #27ae60;\n  --red: #eb5757;\n  --jaune: #f2c94c;\n  --hint: #828282;\n  --text-color: #333;\n  --p-color: #4f4f4f;\n  --light-gray-color: #bdbdbd;\n  --z-fixed: 100;\n  --z-modal: 1000;\n}\n\n/* Landscape phones and down */\n/* Landscape phone to portrait tablet */\n/* Portrait tablet to landscape and desktop */\n/* Large desktop */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml {\n  font-size: 62.5%;\n  scroll-behavior: smooth;\n}\n\nbody {\n  width: 100%;\n  min-height: 100vh;\n  font-size: 1.6rem;\n  font-style: normal;\n  font-weight: 500;\n  color: var(--text-color);\n  font-family: var(--poppins-font);\n}\n\nul {\n  list-style: none;\n}\n\na {\n  color: var(--text-color);\n  text-decoration: none;\n}\n\nimg {\n  max-width: 100%;\n}\n\n/*=============== Section ===============*/\n.section {\n  padding-left: 1rem;\n  padding-right: 1.7rem;\n}\n\n.section__title {\n  font-size: 2.4rem;\n  line-height: 3.6rem;\n  font-weight: 500;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .section__title {\n    font-size: 3.6rem;\n    line-height: 5.4rem;\n  }\n}\n@media (min-width: 980px) {\n  .section__title {\n    font-size: 3.6rem;\n    line-height: 5.4rem;\n  }\n}\n\n/*=============== Logo ===============*/\n.logo {\n  font-size: 2.4rem;\n  line-height: 3.5rem;\n  font-weight: 800;\n  font-family: var(--heebo-font);\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .logo {\n    font-size: 3.6rem;\n    line-height: 5.3rem;\n  }\n}\n\n/*=============== Form ===============*/\n.form {\n  width: 29.2rem;\n}\n.form label {\n  font-size: 1rem;\n  line-height: 1.5rem;\n  color: var(--hint);\n}\n.form .custom__input {\n  display: flex;\n  width: 100%;\n  background-color: #f2f2f2;\n  border-radius: 1.2rem;\n  margin-top: 0.5rem;\n}\n.form .custom__input input[type=email] {\n  width: 100%;\n  padding: 1.2rem 0 1.2rem 1.9rem;\n  color: var(--light-gray-color);\n  font-size: 1.4rem;\n  line-height: 2.1rem;\n  background-color: transparent;\n  border: none;\n  outline: none;\n}\n.form .custom__input input[type=submit] {\n  margin: 0.2rem 0;\n  padding: 1.2rem 2rem;\n  background-color: var(--blue);\n  border-radius: 1.2rem;\n  border: none;\n  color: #f2f2f2;\n  font-size: 1.4rem;\n  line-height: 2.1rem;\n  cursor: pointer;\n}\n@media (min-width: 980px) {\n  .form {\n    width: 35rem;\n  }\n}\n\n/*=============== Header ===============*/\n.header {\n  width: 100%;\n  padding: 1rem 1.5rem;\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  background-color: #fbfbfe;\n  z-index: var(--z-fixed);\n  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.15);\n}\n.header nav {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  /*===== Show Menu =====*/\n}\n.header nav .nav__menu {\n  position: fixed;\n  bottom: -100%;\n  left: 0;\n  width: 100%;\n  padding: 3.2rem 2.5rem 6.4rem;\n  background-color: #fbfbfe;\n  border-radius: 2.4rem 2.4rem 0 0;\n  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.15);\n  transition: 0.3s;\n}\n.header nav .nav__menu .nav__list {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 3.2rem;\n}\n.header nav .nav__menu .nav__list .nav__items .nav__link {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  font-size: 1.5rem;\n  font-weight: 500;\n}\n.header nav .nav__menu .nav__list .nav__items .nav__link i {\n  font-size: 1.92rem;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .header nav .nav__menu .nav__list .nav__items .nav__link i {\n    display: none;\n  }\n}\n@media (min-width: 980px) {\n  .header nav .nav__menu .nav__list .nav__items .nav__link i {\n    display: none;\n  }\n}\n.header nav .nav__menu .nav__list .nav__items .nav__link:hover {\n  color: var(--blue);\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .header nav .nav__menu .nav__list {\n    display: flex;\n    gap: 5.2rem;\n    justify-content: flex-end;\n  }\n}\n@media (min-width: 980px) {\n  .header nav .nav__menu .nav__list {\n    display: flex;\n    gap: 5.2rem;\n    justify-content: flex-end;\n  }\n}\n.header nav .nav__menu .nav__close {\n  position: absolute;\n  bottom: 0.5rem;\n  right: 2.08rem;\n  font-size: 2.4rem;\n  color: var(--blue);\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .header nav .nav__menu .nav__close {\n    display: none;\n  }\n}\n@media (min-width: 980px) {\n  .header nav .nav__menu .nav__close {\n    display: none;\n  }\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .header nav .nav__menu {\n    position: unset;\n    border-radius: 0;\n    box-shadow: unset;\n    padding: 0;\n  }\n}\n@media (min-width: 980px) {\n  .header nav .nav__menu {\n    position: unset;\n    border-radius: 0;\n    box-shadow: unset;\n    padding: 0;\n  }\n}\n.header nav .show-menu {\n  bottom: 0;\n}\n.header nav .nav__toggle {\n  font-size: 2rem;\n  cursor: pointer;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .header nav .nav__toggle {\n    display: none;\n  }\n}\n@media (min-width: 980px) {\n  .header nav .nav__toggle {\n    display: none;\n  }\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .header {\n    top: 0;\n    bottom: initial;\n    padding: 1rem 5.6rem 1rem 5.2rem;\n  }\n}\n@media (min-width: 980px) {\n  .header {\n    top: 0;\n    bottom: initial;\n    padding: 1rem 5.6rem 1rem 5.2rem;\n  }\n}\n\n/*=============== Main ===============*/\n.main {\n  margin-top: 4rem;\n  margin-bottom: 7rem;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .main {\n    margin-top: 10.5rem;\n  }\n}\n@media (min-width: 980px) {\n  .main {\n    margin-top: 10.5rem;\n  }\n}\n\n/*============ Home ============*/\n.home {\n  padding-left: 1rem;\n  padding-right: 1.7rem;\n  margin-bottom: 2.2rem;\n}\n.home .home__content {\n  margin: 0 4.7rem 1.5rem 3rem;\n}\n.home .home__content p {\n  font-size: 1.2rem;\n  line-height: 1.8rem;\n  color: var(--blue);\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .home .home__content p {\n    font-size: 1.8rem;\n    line-height: 2.7rem;\n  }\n}\n@media (min-width: 980px) {\n  .home .home__content p {\n    font-size: 1.8rem;\n    line-height: 2.7rem;\n  }\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .home .home__content h1 {\n    width: 54.3rem;\n    font-size: 4.8rem;\n    line-height: 7.2rem;\n  }\n}\n@media (min-width: 980px) {\n  .home .home__content h1 {\n    width: 54.3rem;\n    font-size: 4.8rem;\n    line-height: 7.2rem;\n  }\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .home .home__content {\n    margin-bottom: 4.2rem;\n    margin-left: 7rem;\n  }\n}\n@media (min-width: 980px) {\n  .home .home__content {\n    margin-bottom: 4.2rem;\n    margin-left: 7rem;\n  }\n}\n@media (min-width: 980px) {\n  .home .home__content {\n    margin-left: 22.1rem;\n  }\n}\n.home img {\n  width: 100%;\n  height: 14.5rem;\n  border-radius: 1.8rem;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .home img {\n    height: 25.4rem;\n  }\n}\n@media (min-width: 980px) {\n  .home img {\n    height: 35.4rem;\n  }\n}\n@media (min-width: 481px) and (max-width: 767px) {\n  .home {\n    padding-left: 4rem;\n    padding-right: 5.7rem;\n  }\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .home {\n    padding-left: 5.2rem;\n    padding-right: 5.6rem;\n    margin-bottom: 4.2rem;\n  }\n}\n@media (min-width: 980px) {\n  .home {\n    padding-left: 5.2rem;\n    padding-right: 5.6rem;\n    margin-bottom: 4.2rem;\n  }\n}\n\n/*============ Contact ============*/\n.contact {\n  padding-left: 4rem;\n  padding-right: 4.4rem;\n  margin-bottom: 7rem;\n}\n.contact .section__title {\n  margin-right: 6.4rem;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .contact .section__title {\n    width: 36.6rem;\n    font-size: 4.8rem;\n    line-height: 7.2rem;\n  }\n}\n@media (min-width: 980px) {\n  .contact .section__title {\n    width: 36.6rem;\n    font-size: 4.8rem;\n    line-height: 7.2rem;\n  }\n}\n.contact p {\n  font-size: 1.2rem;\n  line-height: 1.8rem;\n  font-weight: 400;\n  color: var(--p-color);\n  margin: 2rem 1.6rem 3rem 0;\n}\n@media (min-width: 481px) and (max-width: 767px) {\n  .contact {\n    padding-left: 7rem;\n    padding-right: 17.4rem;\n  }\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .contact {\n    margin-left: 10rem;\n    padding-right: 4.4rem;\n    margin-bottom: 13rem;\n    width: 40rem;\n  }\n}\n@media (min-width: 980px) {\n  .contact {\n    margin-left: 10rem;\n    padding-right: 4.4rem;\n    margin-bottom: 13rem;\n    width: 40rem;\n  }\n}\n@media (min-width: 980px) {\n  .contact {\n    margin-left: 23rem;\n  }\n}\n\n/*============ Services ============*/\n.services {\n  padding-left: 1.5rem;\n  padding-right: 1.9rem;\n  margin-bottom: 5rem;\n}\n.services .section__title {\n  margin-bottom: 3.4rem;\n  margin-left: 3.4rem;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .services .section__title {\n    width: 34.6rem;\n  }\n}\n@media (min-width: 980px) {\n  .services .section__title {\n    width: 34.6rem;\n  }\n}\n.services .services__list {\n  display: flex;\n  flex-direction: column;\n  gap: 3.6rem;\n}\n.services .services__list .service {\n  min-height: 42.2rem;\n  padding: 4.9rem 3.4rem 4.3rem;\n  transition: 0.3s;\n  cursor: pointer;\n}\n.services .services__list .service .service__icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 6.7rem;\n  height: 6.7rem;\n  font-size: 2.7rem;\n  color: #fff;\n  border-radius: 1.6rem;\n}\n.services .services__list .service .blue {\n  background-color: var(--blue);\n}\n.services .services__list .service .green {\n  background-color: var(--green);\n}\n.services .services__list .service .red {\n  background-color: var(--red);\n}\n.services .services__list .service .service__title {\n  font-weight: 700;\n  font-size: 2.4rem;\n  line-height: 3.6rem;\n  margin-top: 3.5rem;\n  margin-bottom: 2.5rem;\n}\n.services .services__list .service .service_description {\n  font-weight: 400;\n  font-size: 1.6rem;\n  line-height: 2.4rem;\n  margin-bottom: 3rem;\n  color: var(--p-color);\n}\n.services .services__list .service .btn {\n  font-size: 1.5rem;\n  line-height: 2.4rem;\n  color: var(--hint);\n  border-radius: 1.2rem;\n  background-color: #e0e0e0;\n  padding: 0.9rem 1.2rem;\n  transition: 0.3s;\n}\n.services .services__list .service .btn:hover {\n  color: #fff;\n  background-color: var(--blue);\n}\n.services .services__list .service:hover {\n  background: #fff;\n  box-shadow: 0 1rem 3rem rgba(51, 51, 51, 0.1);\n  border-radius: 2.4rem;\n}\n@media (min-width: 980px) {\n  .services .services__list {\n    flex-direction: row;\n  }\n}\n@media (min-width: 481px) and (max-width: 767px) {\n  .services {\n    padding-left: 6.5rem;\n    padding-right: 10.9rem;\n  }\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .services {\n    padding-left: 10.5rem;\n    padding-right: 10.9rem;\n    margin-bottom: 13rem;\n  }\n}\n@media (min-width: 980px) {\n  .services {\n    padding-left: 16.5rem;\n    padding-right: 13.9rem;\n    margin-bottom: 13rem;\n  }\n}\n\n/*============ Our Works ============*/\n.works {\n  padding-left: 1.5rem;\n  padding-right: 1.9rem;\n  margin-bottom: 7rem;\n}\n.works .section__title {\n  margin-bottom: 3.4rem;\n  margin-left: 3rem;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .works .section__title {\n    width: 44.8rem;\n  }\n}\n@media (min-width: 980px) {\n  .works .section__title {\n    width: 44.8rem;\n  }\n}\n.works .works__list {\n  display: grid;\n  grid-template-rows: 1fr;\n  row-gap: 3.6rem;\n  margin-bottom: 3.5rem;\n}\n.works .works__list .work {\n  width: fit-content;\n}\n.works .works__list .work img {\n  border-radius: 2.4rem;\n}\n@media (min-width: 980px) {\n  .works .works__list .work img {\n    width: 53.4rem;\n    height: 53.4rem;\n  }\n}\n.works .works__list .work .work__type {\n  color: var(--hint);\n  font-size: 1rem;\n  line-height: 1.8rem;\n  font-weight: 300;\n}\n.works .works__list .work .work__title {\n  font-size: 1.8rem;\n  line-height: 2.7rem;\n  font-weight: 500;\n}\n@media (min-width: 980px) {\n  .works .works__list {\n    grid-template-columns: 1fr 1fr;\n    column-gap: 3rem;\n  }\n  .works .works__list .work:nth-child(2n-1) {\n    margin-top: 13.2rem;\n  }\n}\n.works .works__link {\n  color: var(--blue);\n  font-size: 1.8rem;\n  line-height: 2.7rem;\n  display: flex;\n  align-items: center;\n}\n@media (min-width: 980px) {\n  .works .works__link {\n    justify-content: flex-end;\n  }\n}\n@media (min-width: 481px) and (max-width: 767px) {\n  .works {\n    padding-left: 6.5rem;\n    padding-right: 10.9rem;\n  }\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .works {\n    padding-left: 10.5rem;\n    padding-right: 10.9rem;\n    margin-bottom: 13rem;\n  }\n}\n@media (min-width: 980px) {\n  .works {\n    padding-left: 16.5rem;\n    padding-right: 17.9rem;\n    margin-bottom: 13rem;\n  }\n}\n\n/*============ Clients ============*/\n.clients {\n  padding-left: 1.5rem;\n  padding-right: 1.9rem;\n  position: relative;\n}\n.clients .team .team__intro span {\n  color: var(--red);\n  font-size: 1.8rem;\n  line-height: 2.7rem;\n}\n.clients .team .team__intro .section__title {\n  margin-bottom: 1.4rem;\n  margin-right: 6.6rem;\n  font-size: 3.6rem;\n  line-height: 5.4rem;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .clients .team .team__intro .section__title {\n    width: 44.8rem;\n  }\n}\n@media (min-width: 980px) {\n  .clients .team .team__intro .section__title {\n    margin-right: 0.6rem;\n  }\n}\n.clients .team .team__intro .clients__intro {\n  color: var(--p-color);\n  font-size: 1.6rem;\n  line-height: 2.4rem;\n  font-weight: 400;\n  margin-bottom: 3.6rem;\n  margin-right: 7.3rem;\n}\n@media (min-width: 980px) {\n  .clients .team .team__intro .clients__intro {\n    margin-right: 5.3rem;\n  }\n}\n@media (min-width: 980px) {\n  .clients .team .team__intro {\n    width: 28rem;\n    margin-right: 18.5rem;\n  }\n}\n.clients .team .team__pictures {\n  margin-bottom: 5rem;\n  position: relative;\n  width: 34.932rem;\n  height: 32.069rem;\n}\n.clients .team .team__pictures img {\n  border-radius: 2.4rem;\n  position: absolute;\n}\n.clients .team .team__pictures .pic__one {\n  width: 14.476rem;\n  height: 14.476rem;\n  top: 0;\n  right: 1.7rem;\n}\n@media (min-width: 980px) {\n  .clients .team .team__pictures .pic__one {\n    width: 26rem;\n    height: 26rem;\n    top: -2.4rem;\n  }\n}\n.clients .team .team__pictures .pic__two {\n  width: 16.225rem;\n  height: 16.703rem;\n  bottom: 0;\n  right: 0;\n}\n@media (min-width: 980px) {\n  .clients .team .team__pictures .pic__two {\n    width: 29.143rem;\n    height: 30rem;\n  }\n}\n.clients .team .team__pictures .pic__three {\n  width: 17.816rem;\n  height: 17.816rem;\n  top: 7.063rem;\n  left: 0;\n}\n@media (min-width: 980px) {\n  .clients .team .team__pictures .pic__three {\n    width: 32rem;\n    height: 32rem;\n    left: -1.3rem;\n  }\n}\n@media (min-width: 980px) {\n  .clients .team .team__pictures {\n    width: 62rem;\n    height: 56rem;\n  }\n}\n@media (min-width: 980px) {\n  .clients .team {\n    display: flex;\n    justify-content: space-around;\n    align-items: center;\n    margin-bottom: 10rem;\n  }\n}\n.clients .testimonial .testimonial__content {\n  font-size: 2.4rem;\n  line-height: 3.6rem;\n  margin-bottom: 3rem;\n}\n@media (min-width: 980px) {\n  .clients .testimonial .testimonial__content {\n    font-size: 3.6rem;\n    line-height: 5.4rem;\n  }\n}\n.clients .testimonial .testimonial__infos {\n  display: flex;\n  column-gap: 3rem;\n}\n.clients .testimonial .testimonial__infos img {\n  width: 8.2rem;\n  height: 8.2rem;\n  border-radius: 1.2rem;\n}\n.clients .testimonial .testimonial__infos .infos__details h4 {\n  font-size: 2.4rem;\n  line-height: 3.6rem;\n  font-weight: 500;\n  margin-bottom: 1.2rem;\n}\n.clients .testimonial .testimonial__infos .infos__details p {\n  color: var(--hint);\n  font-size: 1.8rem;\n  line-height: 2.7rem;\n}\n@media (min-width: 980px) {\n  .clients .testimonial {\n    width: 93.7rem;\n  }\n}\n@media (min-width: 481px) and (max-width: 767px) {\n  .clients {\n    padding-left: 6.5rem;\n    padding-right: 8.9rem;\n  }\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  .clients {\n    padding-left: 10.5rem;\n    padding-right: 20.9rem;\n    margin-bottom: 13rem;\n  }\n}\n@media (min-width: 980px) {\n  .clients {\n    padding-left: 17rem;\n    padding-right: 16.657rem;\n    margin-bottom: 15rem;\n  }\n}\n\n/*=============== Footer ===============*/\nfooter {\n  margin-bottom: 5.5rem;\n  background-color: #100e1d;\n  color: #f2f2f2;\n  padding-bottom: 2.4rem;\n}\nfooter .footer__nav {\n  display: flex;\n  flex-direction: column;\n  row-gap: 6.5rem;\n  padding: 3.6rem 4.2rem 0 4.4rem;\n  margin-bottom: 9rem;\n}\nfooter .footer__nav .footer__nav-list li a {\n  color: #fff;\n  font-size: 1.8rem;\n  line-height: 3.6rem;\n  font-weight: 400;\n}\nfooter .footer__nav .footer__links .logo a {\n  color: inherit;\n  font-size: 3.6rem;\n  line-height: 5.3rem;\n}\nfooter .footer__nav .footer__links .links__list {\n  display: flex;\n  column-gap: 1.1rem;\n}\nfooter .footer__nav .footer__links .links__list a {\n  color: inherit;\n  font-size: 2.4rem;\n}\n@media (min-width: 980px) {\n  footer .footer__nav {\n    flex-direction: row;\n    justify-content: space-between;\n  }\n}\nfooter p {\n  text-align: center;\n  color: #f2f2f2;\n  font-size: 1.4rem;\n  font-weight: 500;\n  line-height: 1.7rem;\n  font-family: var(--montserrat-font);\n}\nfooter p a {\n  color: inherit;\n}\n@media (min-width: 768px) and (max-width: 979px) {\n  footer {\n    margin-bottom: 0;\n  }\n}\n@media (min-width: 980px) {\n  footer {\n    margin-bottom: 0;\n  }\n}", "",{"version":3,"sources":["webpack://./src/assets/styles/_variables.scss","webpack://./src/assets/styles/styles.scss","webpack://./src/assets/styles/_media-queries.scss","webpack://./src/assets/styles/_bases.scss","webpack://./src/assets/styles/_classes.scss"],"names":[],"mappings":"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","sourcesContent":["/*=============== Google-Font ===============*/\n@import url(\"https://fonts.googleapis.com/css2?family=Heebo:wght@800&family=Montserrat:wght@700&family=Poppins:wght@300;400;500;700&display=swap\");\n\n:root {\n  // font-family\n  --montserrat-font: \"Montserrat\", sans-serif;\n  --heebo-font: \"Heebo\", sans-serif;\n  --poppins-font: \"Poppins\", sans-serif;\n\n  // color\n  --blue: #2d9cdb;\n  --green: #27ae60;\n  --red: #eb5757;\n  --jaune: #f2c94c;\n  --hint: #828282;\n  --text-color: #333;\n  --p-color: #4f4f4f;\n  --light-gray-color: #bdbdbd;\n\n  // index\n\n  --z-fixed: 100;\n  --z-modal: 1000;\n}\n","@import \"variables\";\n@import \"media-queries\";\n@import \"bases\";\n@import \"classes\";\n\n/*=============== Header ===============*/\n.header {\n  width: 100%;\n  padding: 1rem 1.5rem;\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  background-color: #fbfbfe;\n  z-index: var(--z-fixed);\n  box-shadow: 0 -1px 4px rgb(0 0 0 / 15%);\n\n  nav {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n\n    .nav__logo {\n    }\n\n    .nav__menu {\n      position: fixed;\n      bottom: -100%;\n      left: 0;\n      width: 100%;\n      padding: 3.2rem 2.5rem 6.4rem;\n      background-color: #fbfbfe;\n      border-radius: 2.4rem 2.4rem 0 0;\n      box-shadow: 0 -1px 4px rgb(0 0 0 / 15%);\n      transition: 0.3s;\n\n      .nav__list {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        gap: 3.2rem;\n\n        .nav__items {\n          .nav__link {\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            font-size: 1.5rem;\n            font-weight: 500;\n\n            i {\n              font-size: 1.92rem;\n\n              @include media(md, xl) {\n                display: none;\n              }\n            }\n\n            &:hover {\n              color: var(--blue);\n            }\n          }\n        }\n\n        @include media(md, xl) {\n          display: flex;\n          gap: 5.2rem;\n          justify-content: flex-end;\n        }\n      }\n\n      .nav__close {\n        position: absolute;\n        bottom: 0.5rem;\n        right: 2.08rem;\n        font-size: 2.4rem;\n        color: var(--blue);\n\n        @include media(md, xl) {\n          display: none;\n        }\n      }\n\n      @include media(md, xl) {\n        position: unset;\n        border-radius: 0;\n        box-shadow: unset;\n        padding: 0;\n      }\n    }\n\n    /*===== Show Menu =====*/\n    .show-menu {\n      bottom: 0;\n    }\n\n    .nav__toggle {\n      font-size: 2rem;\n      cursor: pointer;\n\n      @include media(md, xl) {\n        display: none;\n      }\n    }\n  }\n\n  @include media(md, xl) {\n    top: 0;\n    bottom: initial;\n    padding: 1rem 5.6rem 1rem 5.2rem;\n  }\n}\n\n/*=============== Main ===============*/\n.main {\n  margin-top: 4rem;\n  margin-bottom: 7rem;\n\n  @include media(md, xl) {\n    margin-top: 10.5rem;\n  }\n}\n\n/*============ Home ============*/\n.home {\n  padding-left: 1rem;\n  padding-right: 1.7rem;\n  margin-bottom: 2.2rem;\n\n  .home__content {\n    margin: 0 4.7rem 1.5rem 3rem;\n    p {\n      font-size: 1.2rem;\n      line-height: 1.8rem;\n      color: var(--blue);\n\n      @include media(md, xl) {\n        font-size: 1.8rem;\n        line-height: 2.7rem;\n      }\n    }\n\n    h1 {\n      @include media(md, xl) {\n        width: 54.3rem;\n        font-size: 4.8rem;\n        line-height: 7.2rem;\n      }\n    }\n\n    @include media(md, xl) {\n      margin-bottom: 4.2rem;\n      margin-left: 7rem;\n    }\n\n    @include media(xl) {\n      margin-left: 22.1rem;\n    }\n  }\n\n  img {\n    width: 100%;\n    height: 14.5rem;\n    border-radius: 1.8rem;\n\n    @include md {\n      height: 25.4rem;\n    }\n\n    @include xl {\n      height: 35.4rem;\n    }\n  }\n\n  @include sm {\n    padding-left: 4rem;\n    padding-right: 5.7rem;\n  }\n\n  @include media(md, xl) {\n    padding-left: 5.2rem;\n    padding-right: 5.6rem;\n    margin-bottom: 4.2rem;\n  }\n}\n\n/*============ Contact ============*/\n.contact {\n  padding-left: 4rem;\n  padding-right: 4.4rem;\n  margin-bottom: 7rem;\n\n  .section__title {\n    margin-right: 6.4rem;\n\n    @include media(md, xl) {\n      width: 36.6rem;\n      font-size: 4.8rem;\n      line-height: 7.2rem;\n    }\n\n    @include xl {\n      //margin-left: 22.7rem;\n    }\n  }\n\n  p {\n    font-size: 1.2rem;\n    line-height: 1.8rem;\n    font-weight: 400;\n    color: var(--p-color);\n    margin: 2rem 1.6rem 3rem 0;\n  }\n\n  @include sm {\n    padding-left: 7rem;\n    padding-right: 17.4rem;\n  }\n\n  @include media(md, xl) {\n    margin-left: 10rem;\n    padding-right: 4.4rem;\n    margin-bottom: 13rem;\n    width: 40rem;\n  }\n\n  @include xl {\n    margin-left: 23rem;\n  }\n}\n\n/*============ Services ============*/\n.services {\n  padding-left: 1.5rem;\n  padding-right: 1.9rem;\n  margin-bottom: 5rem;\n\n  .section__title {\n    margin-bottom: 3.4rem;\n    margin-left: 3.4rem;\n\n    @include media(md, xl) {\n      width: 34.6rem;\n    }\n  }\n\n  .services__list {\n    display: flex;\n    flex-direction: column;\n    gap: 3.6rem;\n\n    .service {\n      min-height: 42.2rem;\n      padding: 4.9rem 3.4rem 4.3rem;\n      transition: 0.3s;\n      cursor: pointer;\n\n      .service__icon {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        width: 6.7rem;\n        height: 6.7rem;\n        font-size: 2.7rem;\n        color: #fff;\n        border-radius: 1.6rem;\n      }\n\n      .blue {\n        background-color: var(--blue);\n      }\n\n      .green {\n        background-color: var(--green);\n      }\n\n      .red {\n        background-color: var(--red);\n      }\n\n      .service__title {\n        font-weight: 700;\n        font-size: 2.4rem;\n        line-height: 3.6rem;\n        margin-top: 3.5rem;\n        margin-bottom: 2.5rem;\n      }\n\n      .service_description {\n        font-weight: 400;\n        font-size: 1.6rem;\n        line-height: 2.4rem;\n        margin-bottom: 3rem;\n        color: var(--p-color);\n      }\n\n      .btn {\n        font-size: 1.5rem;\n        line-height: 2.4rem;\n        color: var(--hint);\n        border-radius: 1.2rem;\n        background-color: #e0e0e0;\n        padding: 0.9rem 1.2rem;\n        transition: 0.3s;\n\n        &:hover {\n          color: #fff;\n          background-color: var(--blue);\n        }\n      }\n\n      &:hover {\n        background: #fff;\n        box-shadow: 0 1rem 3rem rgba(51, 51, 51, 0.1);\n        border-radius: 2.4rem;\n      }\n    }\n\n    @include xl {\n      flex-direction: row;\n    }\n  }\n\n  @include sm {\n    padding-left: 6.5rem;\n    padding-right: 10.9rem;\n  }\n\n  @include md {\n    padding-left: 10.5rem;\n    padding-right: 10.9rem;\n    margin-bottom: 13rem;\n  }\n\n  @include xl {\n    padding-left: 16.5rem;\n    padding-right: 13.9rem;\n    margin-bottom: 13rem;\n  }\n}\n\n/*============ Our Works ============*/\n.works {\n  padding-left: 1.5rem;\n  padding-right: 1.9rem;\n  margin-bottom: 7rem;\n\n  .section__title {\n    margin-bottom: 3.4rem;\n    margin-left: 3rem;\n\n    @include media(md, xl) {\n      width: 44.8rem;\n    }\n  }\n\n  .works__list {\n    display: grid;\n    grid-template-rows: 1fr;\n    row-gap: 3.6rem;\n    margin-bottom: 3.5rem;\n\n    .work {\n      width: fit-content;\n      img {\n        border-radius: 2.4rem;\n\n        @include xl {\n          width: 53.4rem;\n          height: 53.4rem;\n        }\n      }\n\n      .work__type {\n        color: var(--hint);\n        font-size: 1rem;\n        line-height: 1.8rem;\n        font-weight: 300;\n      }\n\n      .work__title {\n        font-size: 1.8rem;\n        line-height: 2.7rem;\n        font-weight: 500;\n      }\n    }\n\n    @include xl {\n      grid-template-columns: 1fr 1fr;\n      column-gap: 3rem;\n\n      .work:nth-child(2n-1) {\n        margin-top: 13.2rem;\n      }\n    }\n  }\n\n  .works__link {\n    color: var(--blue);\n    font-size: 1.8rem;\n    line-height: 2.7rem;\n    display: flex;\n    align-items: center;\n\n    @include xl {\n      justify-content: flex-end;\n    }\n  }\n\n  @include sm {\n    padding-left: 6.5rem;\n    padding-right: 10.9rem;\n  }\n\n  @include md {\n    padding-left: 10.5rem;\n    padding-right: 10.9rem;\n    margin-bottom: 13rem;\n  }\n\n  @include xl {\n    padding-left: 16.5rem;\n    padding-right: 17.9rem;\n    margin-bottom: 13rem;\n  }\n}\n\n/*============ Clients ============*/\n.clients {\n  padding-left: 1.5rem;\n  padding-right: 1.9rem;\n  position: relative;\n\n  .team {\n    .team__intro {\n      span {\n        color: var(--red);\n        font-size: 1.8rem;\n        line-height: 2.7rem;\n      }\n\n      .section__title {\n        margin-bottom: 1.4rem;\n        margin-right: 6.6rem;\n        font-size: 3.6rem;\n        line-height: 5.4rem;\n\n        @include md {\n          width: 44.8rem;\n        }\n\n        @include xl {\n          margin-right: 0.6rem;\n        }\n      }\n\n      .clients__intro {\n        color: var(--p-color);\n        font-size: 1.6rem;\n        line-height: 2.4rem;\n        font-weight: 400;\n        margin-bottom: 3.6rem;\n        margin-right: 7.3rem;\n\n        @include xl {\n          margin-right: 5.3rem;\n        }\n      }\n\n      @include xl {\n        width: 28rem;\n        margin-right: 18.5rem;\n      }\n    }\n\n    .team__pictures {\n      margin-bottom: 5rem;\n      position: relative;\n      width: 34.932rem;\n      height: 32.069rem;\n\n      img {\n        border-radius: 2.4rem;\n        position: absolute;\n      }\n\n      .pic__one {\n        width: 14.476rem;\n        height: 14.476rem;\n        top: 0;\n        right: 1.7rem;\n\n        @include xl {\n          width: 26rem;\n          height: 26rem;\n          top: -2.4rem;\n        }\n      }\n\n      .pic__two {\n        width: 16.225rem;\n        height: 16.703rem;\n        bottom: 0;\n        right: 0;\n\n        @include xl {\n          width: 29.143rem;\n          height: 30rem;\n        }\n      }\n\n      .pic__three {\n        width: 17.816rem;\n        height: 17.816rem;\n        top: 7.063rem;\n        left: 0;\n\n        @include xl {\n          width: 32rem;\n          height: 32rem;\n          left: -1.3rem;\n        }\n      }\n\n      @include xl {\n        width: 62rem;\n        height: 56rem;\n      }\n    }\n\n    @include xl {\n      display: flex;\n      justify-content: space-around;\n      align-items: center;\n      margin-bottom: 10rem;\n    }\n  }\n\n  .testimonial {\n    .testimonial__content {\n      font-size: 2.4rem;\n      line-height: 3.6rem;\n      margin-bottom: 3rem;\n\n      @include xl {\n        font-size: 3.6rem;\n        line-height: 5.4rem;\n      }\n    }\n\n    .testimonial__infos {\n      display: flex;\n      column-gap: 3rem;\n\n      img {\n        width: 8.2rem;\n        height: 8.2rem;\n        border-radius: 1.2rem;\n      }\n\n      .infos__details {\n        h4 {\n          font-size: 2.4rem;\n          line-height: 3.6rem;\n          font-weight: 500;\n          margin-bottom: 1.2rem;\n        }\n\n        p {\n          color: var(--hint);\n          font-size: 1.8rem;\n          line-height: 2.7rem;\n        }\n      }\n    }\n\n    @include xl {\n      width: 93.7rem;\n    }\n  }\n\n  @include sm {\n    padding-left: 6.5rem;\n    padding-right: 8.9rem;\n  }\n\n  @include md {\n    padding-left: 10.5rem;\n    padding-right: 20.9rem;\n    margin-bottom: 13rem;\n  }\n\n  @include xl {\n    padding-left: 17rem;\n    padding-right: 16.657rem;\n    margin-bottom: 15rem;\n  }\n}\n\n/*=============== Footer ===============*/\nfooter {\n  margin-bottom: 5.5rem;\n  background-color: #100e1d;\n  color: #f2f2f2;\n  padding-bottom: 2.4rem;\n\n  .footer__nav {\n    display: flex;\n    flex-direction: column;\n    row-gap: 6.5rem;\n    padding: 3.6rem 4.2rem 0 4.4rem;\n    margin-bottom: 9rem;\n\n    .footer__nav-list {\n      li {\n        a {\n          color: #fff;\n          font-size: 1.8rem;\n          line-height: 3.6rem;\n          font-weight: 400;\n        }\n      }\n    }\n\n    .footer__links {\n      .logo {\n        a {\n          color: inherit;\n          font-size: 3.6rem;\n          line-height: 5.3rem;\n        }\n      }\n\n      .links__list {\n        display: flex;\n        column-gap: 1.1rem;\n\n        a {\n          color: inherit;\n          font-size: 2.4rem;\n        }\n      }\n    }\n\n    @include xl {\n      flex-direction: row;\n      justify-content: space-between;\n    }\n  }\n\n  p {\n    text-align: center;\n    color: #f2f2f2;\n    font-size: 1.4rem;\n    font-weight: 500;\n    line-height: 1.7rem;\n    font-family: var(--montserrat-font);\n    a {\n      color: inherit;\n    }\n  }\n\n  @include media(md, xl) {\n    margin-bottom: 0;\n  }\n}\n","/* Landscape phones and down */\n@mixin xs {\n  @media (max-width: 480px) {\n    @content;\n  }\n}\n\n/* Landscape phone to portrait tablet */\n@mixin sm {\n  @media (min-width: 481px) and (max-width: 767px) {\n    @content;\n  }\n}\n\n/* Portrait tablet to landscape and desktop */\n@mixin md {\n  @media (min-width: 768px) and (max-width: 979px) {\n    @content;\n  }\n}\n\n/* Large desktop */\n@mixin xl {\n  @media (min-width: 980px) {\n    @content;\n  }\n}\n\n@mixin media($keys...) {\n  @each $key in $keys {\n    @if ($key == sm) {\n      @include sm {\n        @content;\n      }\n    } @else if ($key == md) {\n      @include md {\n        @content;\n      }\n    } @else if ($key == xl) {\n      @include xl {\n        @content;\n      }\n    }\n  }\n}\n","* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml {\n  font-size: 62.5%;\n  scroll-behavior: smooth;\n}\n\nbody {\n  width: 100%;\n  min-height: 100vh;\n  font-size: 1.6rem;\n  font-style: normal;\n  font-weight: 500;\n  color: var(--text-color);\n  font-family: var(--poppins-font);\n}\n\nul {\n  list-style: none;\n}\n\na {\n  color: var(--text-color);\n  text-decoration: none;\n}\n\nimg {\n  max-width: 100%;\n}\n","/*=============== Section ===============*/\n.section {\n  padding-left: 1rem;\n  padding-right: 1.7rem;\n}\n\n.section__title {\n  font-size: 2.4rem;\n  line-height: 3.6rem;\n  font-weight: 500;\n\n  @include media(md, xl) {\n    font-size: 3.6rem;\n    line-height: 5.4rem;\n  }\n}\n\n/*=============== Logo ===============*/\n.logo {\n  font-size: 2.4rem;\n  line-height: 3.5rem;\n  font-weight: 800;\n  font-family: var(--heebo-font);\n\n  @include md {\n    font-size: 3.6rem;\n    line-height: 5.3rem;\n  }\n}\n\n/*=============== Form ===============*/\n.form {\n  width: 29.2rem;\n\n  label {\n    font-size: 1rem;\n    line-height: 1.5rem;\n    color: var(--hint);\n  }\n\n  .custom__input {\n    display: flex;\n    width: 100%;\n    background-color: #f2f2f2;\n    border-radius: 1.2rem;\n    margin-top: 0.5rem;\n\n    input[type=\"email\"] {\n      width: 100%;\n      padding: 1.2rem 0 1.2rem 1.9rem;\n      color: var(--light-gray-color);\n      font-size: 1.4rem;\n      line-height: 2.1rem;\n      background-color: transparent;\n      border: none;\n      outline: none;\n    }\n    input[type=\"submit\"] {\n      margin: 0.2rem 0;\n      padding: 1.2rem 2rem;\n      background-color: var(--blue);\n      border-radius: 1.2rem;\n      border: none;\n      color: #f2f2f2;\n      font-size: 1.4rem;\n      line-height: 2.1rem;\n      cursor: pointer;\n    }\n  }\n\n  @include xl {\n    width: 35rem;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/assets/styles/styles.scss":
/*!***************************************!*\
  !*** ./src/assets/styles/styles.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!../../../node_modules/sass-loader/dist/cjs.js!./styles.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/assets/styles/styles.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _assets_styles_styles_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/styles/styles.scss */ "./src/assets/styles/styles.scss");




/*==================== MENU SHOW Y HIDDEN ====================*/
var navMenu = document.querySelector("#nav-menu"),
  navToggle = document.querySelector("#nav-toggle"),
  navClose = document.querySelector("#nav-close");

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
  navToggle.addEventListener("click", function () {
    navMenu.classList.add("show-menu");
  });
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
  navClose.addEventListener("click", function () {
    navMenu.classList.remove("show-menu");
  });
}

/*==================== REMOVE MENU MOBILE ====================*/
var navLink = document.querySelectorAll(".nav__link");
function linkAction() {
  var navMenu = document.querySelector("#nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
}
navLink.forEach(function (n) {
  return n.addEventListener("click", linkAction);
});
})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map