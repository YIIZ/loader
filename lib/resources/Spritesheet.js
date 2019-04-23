"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _resource = _interopRequireWildcard(require("../resource.js"));

var _requesters = require("../requesters");

var _Texture = _interopRequireDefault(require("./Texture.js"));

var _JSON = _interopRequireDefault(require("./JSON.js"));

var _path = _interopRequireDefault(require("path"));

var Spritesheet =
/*#__PURE__*/
function (_Resource) {
  (0, _inherits2.default)(Spritesheet, _Resource);

  function Spritesheet(_ref) {
    var _this;

    var url = _ref.url,
        json = _ref.json,
        image = _ref.image;
    (0, _classCallCheck2.default)(this, Spritesheet);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Spritesheet).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "type", _resource.RESOURCE_TYPE.SPRITESHEET);
    _this.chunk = 3;
    json = json || url;

    var ext = _path.default.extname(json);

    _this.name = _path.default.basename(json, ext);
    _this.json = json;
    _this.image = image;
    return _this;
  }

  (0, _createClass2.default)(Spritesheet, [{
    key: "request",
    value: function () {
      var _request = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(ctx, next) {
        var loader, res, config, imgPath, image;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                loader = ctx.loader, res = ctx.res;
                _context.next = 3;
                return loader.load(new _JSON.default(res.json)).promise;

              case 3:
                config = _context.sent;
                this.completeChunk += 1;
                imgPath = res.image || config.data.meta.image;
                _context.next = 8;
                return loader.load(new _Texture.default(imgPath)).promise;

              case 8:
                image = _context.sent;
                this.completeChunk += 1;
                res.spritesheet = new PIXI.Spritesheet(image.texture.baseTexture, config.data);
                res.spritesheet.parse(next);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function request(_x, _x2) {
        return _request.apply(this, arguments);
      }

      return request;
    }()
  }]);
  return Spritesheet;
}(_resource.default);

exports.default = Spritesheet;