"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _resource = _interopRequireDefault(require("../resource.js"));

var MockResource =
/*#__PURE__*/
function (_Resource) {
  (0, _inherits2["default"])(MockResource, _Resource);

  function MockResource(_ref) {
    var _this;

    var _duration = _ref.duration,
        chunk = _ref.chunk;
    (0, _classCallCheck2["default"])(this, MockResource);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(MockResource).call(this));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "type", 'MOCK');
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "loop", function () {
      var _assertThisInitialize = (0, _assertThisInitialized2["default"])(_this),
          chunk = _assertThisInitialize.chunk,
          completeChunk = _assertThisInitialize.completeChunk,
          duration = _assertThisInitialize.duration,
          startAt = _assertThisInitialize.startAt,
          msRate = _assertThisInitialize.msRate,
          next = _assertThisInitialize.next;

      var now = (0, _now["default"])();
      var elapse = now - startAt;

      if (elapse > duration) {
        return next();
      }

      _this.completeChunk = Math.floor(elapse * msRate);

      _this.emit('progress', (0, _assertThisInitialized2["default"])(_this));

      requestAnimationFrame(_this.loop);
    });
    _this.name = '$$mock$$';
    _this.duration = _duration;
    _this.chunk = chunk;
    _this.msRate = chunk / _duration;
    return _this;
  }

  (0, _createClass2["default"])(MockResource, [{
    key: "request",
    value: function request(ctx, next) {
      this.startAt = (0, _now["default"])();
      this.next = next;
      this.loop();
    }
  }]);
  return MockResource;
}(_resource["default"]);

exports["default"] = MockResource;