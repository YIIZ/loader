"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

_Object$defineProperty(exports, "MockResource", {
  enumerable: true,
  get: function get() {
    return _resources.MockResource;
  }
});

_Object$defineProperty(exports, "TextResource", {
  enumerable: true,
  get: function get() {
    return _resources.TextResource;
  }
});

_Object$defineProperty(exports, "JSONResource", {
  enumerable: true,
  get: function get() {
    return _resources.JSONResource;
  }
});

_Object$defineProperty(exports, "TextureResource", {
  enumerable: true,
  get: function get() {
    return _resources.TextureResource;
  }
});

_Object$defineProperty(exports, "SpritesheetResource", {
  enumerable: true,
  get: function get() {
    return _resources.SpritesheetResource;
  }
});

exports.Loader = exports["default"] = void 0;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/find"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

var _koaCompose = _interopRequireDefault(require("koa-compose"));

var _resource = _interopRequireWildcard(require("./resource.js"));

var _resources = require("./resources");

var RESOURCE_STATE = _resource["default"].RESOURCE_STATE,
    RESOURCE_TYPE = _resource["default"].RESOURCE_TYPE;

var Loader =
/*#__PURE__*/
function (_Resource) {
  (0, _inherits2["default"])(Loader, _Resource);

  function Loader() {
    var _this;

    (0, _classCallCheck2["default"])(this, Loader);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Loader).call(this, {
      type: 'LOADER'
    }));
    _this.groups = {};
    _this.resources = {};
    _this.timeout = 3000;
    _this._before = [];
    _this._after = [];
    _this._queue = [];
    _this._links = {};
    return _this;
  }

  (0, _createClass2["default"])(Loader, [{
    key: "beforeRequest",
    value: function beforeRequest() {
      var _this$_before, _context;

      if (this.progressing) {
        throw new Error('add middleware when progressing');
      }

      (_this$_before = this._before).push.apply(_this$_before, arguments);

      this.handle = (0, _koaCompose["default"])((0, _concat["default"])(_context = []).call(_context, (0, _toConsumableArray2["default"])(this._before), [this.request], (0, _toConsumableArray2["default"])(this._after)));
    }
  }, {
    key: "afterRequest",
    value: function afterRequest() {
      var _this$_after, _context2;

      if (this.progressing) {
        throw new Error('add middleware when progressing');
      }

      (_this$_after = this._after).unshift.apply(_this$_after, arguments);

      this.handle = (0, _koaCompose["default"])((0, _concat["default"])(_context2 = []).call(_context2, (0, _toConsumableArray2["default"])(this._before), [this.request], (0, _toConsumableArray2["default"])(this._after)));
    }
  }, {
    key: "request",
    value: function request(ctx, next) {
      return ctx.res.request(ctx, next);
    }
  }, {
    key: "_structure",
    value: function _structure(params) {
      if (params instanceof _resource["default"]) {
        return params;
      }

      params = typeof params === 'string' ? {
        url: params
      } : params;
      var type = (0, _resource.determineResourceType)(params);
      var res;

      switch (type) {
        case RESOURCE_TYPE.JSON:
          res = new _resources.JSONResource(params);
          break;

        case RESOURCE_TYPE.TEXT:
          res = new _resources.JSONResource(params);
          break;

        case RESOURCE_TYPE.IMAGE:
          res = new _resources.TextureResource(params);
          break;

        case RESOURCE_TYPE.SPRITESHEET:
          res = new _resources.SpritesheetResource(params);
          break;

        case RESOURCE_TYPE.MOCK:
          res = new _resources.MockResource(params);
          break;

        default:
          throw new Error("unknown resource");
      }

      return res;
    }
  }, {
    key: "_link",
    value: function _link(res) {
      this._links[res.name] = this._links[res.name] || 0;
      this._links[res.name]++;
    }
  }, {
    key: "_unlink",
    value: function _unlink(res) {
      this._links[res.name]--;
    }
  }, {
    key: "add",
    value: function add(params) {
      var _context3;

      if (this.progressing) {
        throw new Error('add resource when progressing');
      }

      var res = this._structure(params);

      res = this.resources[res.name] || res;
      if (res.complete) return res;
      this.resources[res.name] = res;
      if ((0, _find["default"])(_context3 = this._queue).call(_context3, function (r) {
        return r.name === res.name;
      })) return res;
      res.on('progress', this.emitProgress, this);
      res.on('complete', this.emitProgress, this);

      this._queue.push(res);

      return res;
    }
  }, {
    key: "emitProgress",
    value: function emitProgress() {
      var _context4, _context5;

      var all = (0, _reduce["default"])(_context4 = this._queue).call(_context4, function (s, v) {
        return s + v.chunk;
      }, 0);
      var complete = (0, _reduce["default"])(_context5 = this._queue).call(_context5, function (s, v) {
        return s + v.completeChunk;
      }, 0);
      this.emit('update', {
        progress: complete / all * 100
      });
      this.emit('progress', {
        progress: complete / all * 100
      });
    }
  }, {
    key: "remove",
    value: function remove(params) {
      var _context6, _context7;

      if (this.progressing) {
        throw new Error('remove resource when progressing');
      }

      var res = this._structure(params);

      if (this._links[res.name] > 0) {
        console.error(res.name, 'has link');
      }

      delete this.resources[res.name];
      delete this._links[res.name];
      var index = (0, _indexOf["default"])(_context6 = this._queue).call(_context6, res);
      if (index > -1) (0, _splice["default"])(_context7 = this._queue).call(_context7, index, 1);
      return res;
    }
  }, {
    key: "run",
    value: function run() {
      var _this2 = this;

      var resources = this.resources,
          _queue = this._queue;

      _promise["default"].all((0, _map["default"])(_queue).call(_queue, function (res) {
        return loader.load(res).promise;
      })).then(function () {
        _this2.resolve();

        _this2._queue.length = 0;
      });
    }
  }, {
    key: "load",
    value: function load(params) {
      var res = this._structure(params);

      res = this.resources[res.name] || res;
      if (res.progressing) return res;
      if (res.complete) return res;
      res.state = RESOURCE_STATE.LOADING;
      this.resources[res.name] = res;
      this.handle({
        res: res,
        loader: this
      });
      return res;
    }
  }, {
    key: "group",
    value: function group(name) {
      if (this.groups[name]) return this.groups[name];
      var g = new Group(name, this);
      this.groups[name] = g;
      return g;
    }
  }, {
    key: "find",
    value: function find(name) {
      var _context8;

      var r = this.resources[name];
      if (r) return r;
      return (0, _find["default"])(_context8 = (0, _values["default"])(this.resources)).call(_context8, function (r) {
        return r.name === name || r.url === name;
      });
    }
  }]);
  return Loader;
}(_resource["default"]);

exports.Loader = Loader;

var Group =
/*#__PURE__*/
function (_Resource2) {
  (0, _inherits2["default"])(Group, _Resource2);

  function Group(name, loader) {
    var _this3;

    (0, _classCallCheck2["default"])(this, Group);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Group).call(this, {
      type: 'GROUP'
    }));
    _this3.name = name;
    _this3.loader = loader;
    _this3._queue = [];
    return _this3;
  }

  (0, _createClass2["default"])(Group, [{
    key: "add",
    value: function add(params) {
      var loader = this.loader,
          _queue = this._queue;
      var res = loader.add(params);
      if ((0, _indexOf["default"])(_queue).call(_queue, res) > -1) return res;

      loader._link(res);

      _queue.push(res);

      return res;
    }
  }, {
    key: "run",
    value: function run() {
      var _this4 = this;

      var _queue = this._queue,
          loader = this.loader;

      _promise["default"].all((0, _map["default"])(_queue).call(_queue, function (res) {
        return loader.load(res).promise;
      })).then(function () {
        _this4.resolve();

        _this4._queue.length = 0;
      });
    }
  }, {
    key: "unique",
    value: function unique() {
      var loader = this.loader,
          _queue = this._queue;
      return (0, _filter["default"])(_queue).call(_queue, function (res) {
        return loader._links[res.name] === 1;
      });
    }
  }, {
    key: "destory",
    value: function destory() {
      var loader = this.loader,
          _queue = this._queue;
      (0, _forEach["default"])(_queue).call(_queue, function (res) {
        loader._unlink(res);

        if (loader._links[res] > 0) return;
        loader.remove(res);
      });
    }
  }, {
    key: "resources",
    get: function get() {
      return this.loader.resources;
    }
  }]);
  return Group;
}(_resource["default"]); // TODO children resource


var loader = new Loader();
var _default = loader;
exports["default"] = _default;