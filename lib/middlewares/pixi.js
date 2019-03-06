"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spritesheetParser = spritesheetParser;
exports.spineParser = spineParser;
exports.textureParser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _resource = require("../resource.js");

var PIXI = _interopRequireWildcard(require("pixi.js"));

var textureParser = function textureParser(ctx, next) {
  var res = ctx.res;
  if (res.type !== _resource.RESOURCE_TYPE.IMAGE) return next();
  res.texture = PIXI.Texture.fromLoader(res.source, res.url, res.name);
  next();
};

exports.textureParser = textureParser;

function spritesheetParser(_x, _x2) {
  return _spritesheetParser.apply(this, arguments);
}

function _spritesheetParser() {
  _spritesheetParser = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(ctx, next) {
    var res, loader, config, imgPath, image;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res = ctx.res, loader = ctx.loader;

            if (!(res.type !== _resource.RESOURCE_TYPE.SPRITESHEET)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", next());

          case 3:
            _context.next = 5;
            return loader.load(res.url).promise;

          case 5:
            config = _context.sent;
            imgPath = res.image || config.data.meta.image;
            console.log(imgPath);
            _context.next = 10;
            return loader.load(imgPath).promise;

          case 10:
            image = _context.sent;
            res.spritesheet = new PIXI.Spritesheet(image.texture.baseTexture, config.data);
            res.spritesheet.parse(next);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _spritesheetParser.apply(this, arguments);
}

function spineParser(_x3, _x4) {
  return _spineParser.apply(this, arguments);
}

function _spineParser() {
  _spineParser = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(ctx, next) {
    var res, loader, spine, url, atlas, _res$images, images, textureLoader, _textureLoader, config, atlasPath, atlasRes;

    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _textureLoader = function _ref2() {
              _textureLoader = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee2(path, callback) {
                var img, item;
                return _regenerator.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        img = images[path] || path;
                        _context2.next = 3;
                        return loader.load(img).promise;

                      case 3:
                        item = _context2.sent;
                        callback(item.texture.baseTexture);

                      case 5:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));
              return _textureLoader.apply(this, arguments);
            };

            textureLoader = function _ref(_x5, _x6) {
              return _textureLoader.apply(this, arguments);
            };

            res = ctx.res, loader = ctx.loader;

            if (!(res.type !== _resource.RESOURCE_TYPE.SPINE)) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt("return", next());

          case 5:
            spine = PIXI.spine.core;
            url = res.url, atlas = res.atlas, _res$images = res.images, images = _res$images === void 0 ? {} : _res$images;
            _context3.next = 9;
            return loader.load({
              name: "json:".concat(url),
              url: url
            }).promise;

          case 9:
            config = _context3.sent;
            atlasPath = atlas || url.replace(/\.json$/, '.atlas');
            _context3.next = 13;
            return loader.load(atlasPath).promise;

          case 13:
            atlasRes = _context3.sent;
            new spine.TextureAtlas(atlasRes.source, textureLoader, function (spineAtlas) {
              var attachmentLoader = new spine.AtlasAttachmentLoader(spineAtlas);
              var json = new spine.SkeletonJson(attachmentLoader);
              var skeletonData = json.readSkeletonData(config.data);
              res.spineData = skeletonData;
              res.spineAtlas = spineAtlas;
              next();
            });

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _spineParser.apply(this, arguments);
}