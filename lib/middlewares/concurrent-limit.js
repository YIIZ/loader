"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var concurrentLimit = function concurrentLimit() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var count = 0;
  return function (ctx, next) {
    var check =
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(count >= limit)) {
                  _context.next = 4;
                  break;
                }

                requestAnimationFrame(check);
                _context.next = 8;
                break;

              case 4:
                count++;
                _context.next = 7;
                return next();

              case 7:
                count--;

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function check() {
        return _ref.apply(this, arguments);
      };
    }();

    check();
  };
};

var _default = concurrentLimit;
exports["default"] = _default;