"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _resource = _interopRequireDefault(require("../resource.js"));

var MockResource =
/*#__PURE__*/
function (_Resource) {
  (0, _inherits2.default)(MockResource, _Resource);

  function MockResource(_ref) {
    var _this;

    var _duration = _ref.duration,
        _chunk = _ref.chunk;
    (0, _classCallCheck2.default)(this, MockResource);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(MockResource).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "type", 'MOCK');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "loop", function () {
      var _assertThisInitialize = (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)),
          chunk = _assertThisInitialize.chunk,
          completeChunk = _assertThisInitialize.completeChunk,
          duration = _assertThisInitialize.duration,
          startAt = _assertThisInitialize.startAt,
          msRate = _assertThisInitialize.msRate,
          next = _assertThisInitialize.next;

      var now = Date.now();
      var elapse = now - startAt;

      if (elapse > duration) {
        return next();
      }

      _this.completeChunk = Math.floor(elapse * msRate);

      _this.emit('progress', (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));

      requestAnimationFrame(_this.loop);
    });
    _this.name = '$$mock$$';
    _this.duration = _duration;
    _this.chunk = _chunk;
    _this.msRate = _chunk / _duration;
    return _this;
  }

  (0, _createClass2.default)(MockResource, [{
    key: "request",
    value: function request(ctx, next) {
      this.startAt = Date.now();
      this.next = next;
      this.loop();
    }
  }]);
  return MockResource;
}(_resource.default);

exports.default = MockResource;