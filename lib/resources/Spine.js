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

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _resource = _interopRequireWildcard(require("../resource.js"));

var _requesters = require("../requesters");

var _Texture = _interopRequireDefault(require("./Texture.js"));

var _JSON = _interopRequireDefault(require("./JSON.js"));

var _Text = _interopRequireDefault(require("./Text.js"));

var _path = _interopRequireDefault(require("path"));

var _pixiSpine = _interopRequireDefault(require("pixi-spine.es"));

//import { TextureAtlas } from 'pixi-spine/bin/core/TextureAtlas'
//import { AtlasAttachmentLoader } from 'pixi-spine/bin/core/AtlasAttachmentLoader'
//import { SkeletonJson } from 'pixi-spine/bin/core/SkeletonJson'
// FIXME now need expose spine
var _spine$core = _pixiSpine["default"].core,
    TextureAtlas = _spine$core.TextureAtlas,
    AtlasAttachmentLoader = _spine$core.AtlasAttachmentLoader,
    SkeletonJson = _spine$core.SkeletonJson;

var Spine =
/*#__PURE__*/
function (_Resource) {
  (0, _inherits2["default"])(Spine, _Resource);

  function Spine(_ref) {
    var _this;

    var name = _ref.name,
        url = _ref.url,
        json = _ref.json,
        atlas = _ref.atlas,
        images = _ref.images;
    (0, _classCallCheck2["default"])(this, Spine);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Spine).call(this));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "type", _resource.RESOURCE_TYPE.SPINE);
    json = json || url;

    var ext = _path["default"].extname(json);

    _this.name = name || _path["default"].basename(json, ext);
    _this.json = json;
    _this.atlas = atlas;
    _this.images = images;
    _this.chunk = 4;
    return _this;
  }

  (0, _createClass2["default"])(Spine, [{
    key: "request",
    value: function () {
      var _request = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(ctx, next) {
        var loader, res, json, atlas, _res$images, images, textureLoader, _textureLoader, config, atlasPath, atlasRes;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _textureLoader = function _ref3() {
                  _textureLoader = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee(path, callback) {
                    var img, item;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            img = images[path] || path;
                            _context.next = 3;
                            return loader.load(new _Texture["default"](img)).promise;

                          case 3:
                            item = _context.sent;
                            callback(item.texture.baseTexture);

                          case 5:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));
                  return _textureLoader.apply(this, arguments);
                };

                textureLoader = function _ref2(_x3, _x4) {
                  return _textureLoader.apply(this, arguments);
                };

                loader = ctx.loader, res = ctx.res;
                json = res.json, atlas = res.atlas, _res$images = res.images, images = _res$images === void 0 ? {} : _res$images;
                _context2.next = 6;
                return loader.load(new _JSON["default"](json)).promise;

              case 6:
                config = _context2.sent;
                this.completeChunk++;
                atlasPath = atlas || json.replace(/\.json$/, '.atlas');
                _context2.next = 11;
                return loader.load(new _Text["default"](atlasPath)).promise;

              case 11:
                atlasRes = _context2.sent;
                this.completeChunk++;
                new TextureAtlas(atlasRes.source, textureLoader, function (spineAtlas) {
                  var attachmentLoader = new AtlasAttachmentLoader(spineAtlas);
                  var json = new SkeletonJson(attachmentLoader);
                  var skeletonData = json.readSkeletonData(config.data);
                  res.spineData = skeletonData;
                  res.spineAtlas = spineAtlas;
                  next();
                });

              case 14:
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
}(_resource["default"]);

exports["default"] = Spine;