"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loader = exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

var _koaCompose = _interopRequireDefault(require("koa-compose"));

var _resource = _interopRequireDefault(require("./resource.js"));

var RESOURCE_STATE = _resource.default.RESOURCE_STATE,
    RESOURCE_TYPE = _resource.default.RESOURCE_TYPE;

var Loader =
/*#__PURE__*/
function (_Resource) {
  (0, _inherits2.default)(Loader, _Resource);

  function Loader() {
    var _this;

    (0, _classCallCheck2.default)(this, Loader);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Loader).call(this, {
      type: 'LOADER'
    }));
    _this.groups = {};
    _this.resources = {};
    _this.timeout = 3000;
    _this._middlewares = [];
    _this._queue = [];
    _this._links = {};
    return _this;
  }

  (0, _createClass2.default)(Loader, [{
    key: "use",
    value: function use() {
      var _this$_middlewares;

      if (this.progressing) {
        throw new Error('add middleware when progressing');
      }

      (_this$_middlewares = this._middlewares).push.apply(_this$_middlewares, arguments);

      this.handle = (0, _koaCompose.default)(this._middlewares);
    }
  }, {
    key: "_normalize",
    value: function _normalize(params) {
      var res = params instanceof _resource.default ? params : new _resource.default(params);
      res = this.resources[res.name] || res;
      this.resources[res.name] = res;
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
      if (this.progressing) {
        throw new Error('add resource when progressing');
      }

      var res = this._normalize(params);

      if (this._queue.indexOf(res) > -1) return res;
      res.on('update', this.emitUpdate, this);
      res.on('complete', this.emitUpdate, this);

      this._queue.push(res);

      return res;
    }
  }, {
    key: "emitUpdate",
    value: function emitUpdate() {
      var all = this._queue.reduce(function (s, v) {
        return s + v.chunk;
      }, 0);

      var complete = this._queue.reduce(function (s, v) {
        return s + v.completeChunk;
      }, 0);

      this.emit('update', {
        progress: complete / all * 100
      });
    }
  }, {
    key: "remove",
    value: function remove(params) {
      if (this.progressing) {
        throw new Error('remove resource when progressing');
      }

      var res = this._normalize(params);

      if (this._links[res.name] > 0) {
        console.error(res.name, 'has link');
      }

      delete this.resources[res.name];
      delete this._links[res.name];

      var index = this._queue.indexOf(res);

      if (index > -1) this._queue.splice(index, 1);
      return res;
    }
  }, {
    key: "run",
    value: function run() {
      var _this2 = this;

      var resources = this.resources,
          _queue = this._queue;
      Promise.all(_queue.map(function (res) {
        return loader.load(res).promise;
      })).then(function () {
        _this2.resolve();

        _this2._queue.length = 0;
      });
    }
  }, {
    key: "load",
    value: function load(params) {
      var res = this._normalize(params);

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
  }]);
  return Loader;
}(_resource.default);

exports.Loader = Loader;

var Group =
/*#__PURE__*/
function (_Resource2) {
  (0, _inherits2.default)(Group, _Resource2);

  function Group(name, loader) {
    var _this3;

    (0, _classCallCheck2.default)(this, Group);
    _this3 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Group).call(this, {
      type: 'GROUP'
    }));
    _this3.name = name;
    _this3.loader = loader;
    _this3._queue = [];
    return _this3;
  }

  (0, _createClass2.default)(Group, [{
    key: "add",
    value: function add(params) {
      var loader = this.loader,
          _queue = this._queue;

      var res = loader._normalize(params);

      if (_queue.indexOf(res) > -1) return res;

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
      Promise.all(_queue.map(function (res) {
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
      return _queue.filter(function (res) {
        return loader._links[res.name] === 1;
      });
    }
  }, {
    key: "destory",
    value: function destory() {
      var loader = this.loader,
          _queue = this._queue;

      _queue.forEach(function (res) {
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
}(_resource.default); // TODO children resource


var loader = new Loader();
var _default = loader;
exports.default = _default;