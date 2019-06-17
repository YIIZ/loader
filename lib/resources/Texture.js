"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _pixi = require("pixi.js");

var _resource = _interopRequireWildcard(require("../resource.js"));

var _requesters = require("../requesters");

var TextureRes =
/*#__PURE__*/
function (_Resource) {
  (0, _inherits2["default"])(TextureRes, _Resource);

  function TextureRes() {
    var _getPrototypeOf2, _context;

    var _this;

    (0, _classCallCheck2["default"])(this, TextureRes);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2["default"])(this, (_getPrototypeOf2 = (0, _getPrototypeOf3["default"])(TextureRes)).call.apply(_getPrototypeOf2, (0, _concat["default"])(_context = [this]).call(_context, args)));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "type", _resource.RESOURCE_TYPE.IMAGE);
    return _this;
  }

  (0, _createClass2["default"])(TextureRes, [{
    key: "request",
    value: function () {
      var _request2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(ctx, next) {
        var res;
        return _regenerator["default"].wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                res = ctx.res;
                _context2.next = 3;
                return (0, _requesters.request)(ctx);

              case 3:
                res.texture = _pixi.Texture.fromLoader(res.source, res.url, res.name);
                next();
                return _context2.abrupt("return");

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee);
      }));

      function request(_x, _x2) {
        return _request2.apply(this, arguments);
      }

      return request;
    }()
  }]);
  return TextureRes;
}(_resource["default"]);

exports["default"] = TextureRes;