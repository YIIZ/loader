"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _pixi = require("pixi.js");

var _resource = _interopRequireWildcard(require("../resource.js"));

var _requesters = require("../requesters");

var _Texture = _interopRequireDefault(require("./Texture.js"));

var _JSON = _interopRequireDefault(require("./JSON.js"));

var _path = _interopRequireDefault(require("path"));

var SpritesheetRes =
/*#__PURE__*/
function (_Resource) {
  (0, _inherits2["default"])(SpritesheetRes, _Resource);

  function SpritesheetRes(_ref) {
    var _this;

    var name = _ref.name,
        url = _ref.url,
        json = _ref.json,
        image = _ref.image;
    (0, _classCallCheck2["default"])(this, SpritesheetRes);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SpritesheetRes).call(this));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "type", _resource.RESOURCE_TYPE.SPRITESHEET);
    _this.chunk = 3;
    json = json || url;

    var ext = _path["default"].extname(json);

    _this.name = name || _path["default"].basename(json, ext);
    _this.json = json;
    _this.image = image;
    return _this;
  }

  (0, _createClass2["default"])(SpritesheetRes, [{
    key: "request",
    value: function () {
      var _request = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(ctx, next) {
        var loader, res, config, imgPath, image, _context;

        return _regenerator["default"].wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                loader = ctx.loader, res = ctx.res;
                _context2.next = 3;
                return loader.load(new _JSON["default"](res.json)).promise;

              case 3:
                config = _context2.sent;
                this.completeChunk += 1;
                imgPath = res.image || config.data.meta.image;
                _context2.next = 8;
                return loader.load(new _Texture["default"](imgPath)).promise;

              case 8:
                image = _context2.sent;
                this.completeChunk += 1; // old version

                if ((0, _isArray["default"])(config.data.frames)) {
                  config.data.frames = (0, _reduce["default"])(_context = config.data.frames).call(_context, function (m, f) {
                    return (m[res.name + f.filename] = f) && m;
                  }, {});
                }

                res.spritesheet = new _pixi.Spritesheet(image.texture.baseTexture, config.data);
                res.spritesheet.parse(next);

              case 13:
              case "end":
                return _context2.stop();
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
  return SpritesheetRes;
}(_resource["default"]);

exports["default"] = SpritesheetRes;