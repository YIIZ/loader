"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.determineResourceType = determineResourceType;
exports.default = exports.RESOURCE_TYPE = exports.RESOURCE_STATE = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

var RESOURCE_TYPE = {
  IMAGE: 'IMAGE',
  TEXT: 'TEXT',
  JSON: 'JSON',
  SPRITESHEET: 'SPRITESHEET',
  SPINE: 'SPINE',
  FONT: 'FONT',
  MOCK: 'MOCK',
  UNKNOWN: 'UNKNOWN'
};
exports.RESOURCE_TYPE = RESOURCE_TYPE;
var RESOURCE_STATE = {
  ERROR: -1,
  INIT: 0,
  LOADING: 1,
  LOADED: 2,
  COMPLETE: 3
};
exports.RESOURCE_STATE = RESOURCE_STATE;

var Resource =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(Resource, _EventEmitter);

  function Resource() {
    var _this;

    var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Resource);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Resource).call(this));
    _this.chunk = 1;
    _this.completeChunk = 0;
    _this.state = RESOURCE_STATE.INIT;
    var params = typeof arg === 'string' ? {
      url: arg
    } : arg;
    Object.assign((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), params);
    _this.name = params.name || params.url;
    _this.promise = new Promise(function (resolve, reject) {
      _this.resolve = function () {
        _this.completeChunk = _this.chunk;
        _this.state = RESOURCE_STATE.COMPLETE;

        _this.emit('complete', (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));

        resolve((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
      };

      _this.reject = function (err) {
        _this.state = RESOURCE_STATE.ERROR;

        _this.emit('reject', (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));

        reject((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
      };
    });
    return _this;
  }

  (0, _createClass2.default)(Resource, [{
    key: "complete",
    get: function get() {
      return this.state === RESOURCE_STATE.COMPLETE;
    }
  }, {
    key: "progressing",
    get: function get() {
      return this.state > RESOURCE_STATE.INIT && this.state < RESOURCE_STATE.COMPLETE;
    }
  }]);
  return Resource;
}(_eventemitter.default);

function determineResourceType(params) {
  var url = params.url,
      type = params.type;
  if (type) return type;
  if (url.match(/\.json$/)) return RESOURCE_TYPE.JSON;
  if (url.match(/\.png|\.jpg|\.jpeg|\.svg/)) return RESOURCE_TYPE.IMAGE;
  if (url.match(/^data:image/)) return RESOURCE_TYPE.IMAGE;
  if (url.match(/\.atlas/)) return RESOURCE_TYPE.TEXT;
  return RESOURCE_TYPE.UNKNOWN;
}

Resource.determineResourceType = determineResourceType;
Resource.RESOURCE_STATE = RESOURCE_STATE;
Resource.RESOURCE_TYPE = RESOURCE_TYPE;
var _default = Resource;
exports.default = _default;