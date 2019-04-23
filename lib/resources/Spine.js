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

var _Text = _interopRequireDefault(require("./Text.js"));

var _path = _interopRequireDefault(require("path"));

var Spine =
/*#__PURE__*/
function (_Resource) {
  (0, _inherits2.default)(Spine, _Resource);

  function Spine(_ref) {
    var _this;

    var json = _ref.json,
        atlas = _ref.atlas,
        images = _ref.images;
    (0, _classCallCheck2.default)(this, Spine);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Spine).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "type", _resource.RESOURCE_TYPE.SPINE);
    json = json || url;

    var ext = _path.default.extname(json);

    _this.name = _path.default.basename(json, ext);
    _this.json = json;
    _this.images = images;
    _this.chunk = 4;
    return _this;
  }

  (0, _createClass2.default)(Spine, [{
    key: "request",
    value: function () {
      var _request = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(ctx, next) {
        var loader, res, json, atlas, _res$images, images, spine, textureLoader, _textureLoader, config, atlasPath, atlasRes;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _textureLoader = function _ref3() {
                  _textureLoader = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee(path, callback) {
                    var img, item;
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            img = images[path] || path;
                            _context.next = 3;
                            return loader.load(new _Texture.default(img)).promise;

                          case 3:
                            item = _context.sent;
                            callback(item.texture.baseTexture);

                          case 5:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  }));
                  return _textureLoader.apply(this, arguments);
                };

                textureLoader = function _ref2(_x3, _x4) {
                  return _textureLoader.apply(this, arguments);
                };

                loader = ctx.loader, res = ctx.res;
                json = res.json, atlas = res.atlas, _res$images = res.images, images = _res$images === void 0 ? {} : _res$images;
                spine = PIXI.spine.core;
                _context2.next = 7;
                return loader.load(new _JSON.default(json)).promise;

              case 7:
                config = _context2.sent;
                this.completeChunk++;
                atlasPath = atlas || url.replace(/\.json$/, '.atlas');
                _context2.next = 12;
                return loader.load(new _Text.default(atlasPath)).promise;

              case 12:
                atlasRes = _context2.sent;
                this.completeChunk++;
                new spine.TextureAtlas(atlasees.source, textureLoader, function (spineAtlas) {
                  var attachmentLoader = new spine.AtlasAttachmentLoader(spineAtlas);
                  var json = new spine.SkeletonJson(attachmentLoader);
                  var skeletonData = json.readSkeletonData(config.data);
                  res.spineData = skeletonData;
                  res.spineAtlas = spineAtlas;
                  next();
                });

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function request(_x, _x2) {
        return _request.apply(this, arguments);
      }

      return request;
    }()
  }]);
  return Spine;
}(_resource.default);

exports.default = Spine;