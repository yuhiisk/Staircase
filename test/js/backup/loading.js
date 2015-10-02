var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, Exchange, Loading, LoadingSprite, UI;
  Events = win.Staircase.ns('Events');
  UI = win.Staircase.ns('UI');

  /*
   * Loading
   * @constructor
   * @extends EventDispatcher
   */
  Loading = (function(superClass) {
    extend(Loading, superClass);

    function Loading(id) {
      Loading.__super__.constructor.call(this);
      this.$el = $(id);
      this.$icon = this.$el.find('.loading__icon');
      this.initialize();
      this.eventify();
    }

    Loading.prototype.initialize = function() {
      var _start, _stop;
      _start = (function(_this) {
        return function() {
          _this.$icon.addClass('is-active');
          return _this.trigger(Events.LOADING_SHOW);
        };
      })(this);
      _stop = (function(_this) {
        return function() {
          _this.$icon.removeClass('is-active');
          return _this.trigger(Events.LOADING_HIDE);
        };
      })(this);
      this.start = _start;
      return this.stop = _stop;
    };

    Loading.prototype.eventify = function() {};

    return Loading;

  })(EventDispatcher);
  UI.Loading = Loading;

  /*
   * LoadingSprite
   * @constructor
   * @extends EventDispatcher
   */
  LoadingSprite = (function(superClass) {
    extend(LoadingSprite, superClass);

    function LoadingSprite(el) {
      LoadingSprite.__super__.constructor.call(this);
      this.$el = $(el);
      this.$icon = $('.loading__icon', this.$el);
      this.defaultClass = this.$icon.attr('class');
      this.initialize();
      this.eventify();
    }

    LoadingSprite.prototype.initialize = function() {
      var _rotate, _start, _stop, count, interval, max, timer;
      timer = null;
      interval = 40;
      count = 0;
      max = 36;
      _rotate = (function(_this) {
        return function() {
          return timer = setInterval(function() {
            count++;
            _this.$icon[0].className = _this.defaultClass + ' loading-n' + count;
            if (count >= max) {
              return count = 0;
            }
          }, interval);
        };
      })(this);
      _start = (function(_this) {
        return function() {
          _this.$el.show();
          _rotate();
          return _this.trigger(Events.LOADING_START);
        };
      })(this);
      _stop = (function(_this) {
        return function() {
          _this.$el.hide();
          timer = clearInterval(timer);
          timer = null;
          return _this.trigger(Events.LOADING_STOP);
        };
      })(this);
      this.start = _start;
      return this.stop = _stop;
    };

    LoadingSprite.prototype.eventify = function() {};

    return LoadingSprite;

  })(EventDispatcher);
  UI.LoadingSprite = LoadingSprite;

  /*
   * Exchange
   * @constructor
   * @extends EventDispatcher
   */
  Exchange = (function(superClass) {
    extend(Exchange, superClass);

    function Exchange(id) {
      Exchange.__super__.constructor.call(this);
      this.$el = $(id);
      this.$icon = this.$el.find('.loading__icon');
      this.initialize();
    }

    Exchange.prototype.initialize = function() {
      var _active, _deactive, _hide, _show;
      _show = (function(_this) {
        return function() {
          _this.$el.removeClass('is-hidden');
          return _this;
        };
      })(this);
      _hide = (function(_this) {
        return function() {
          _this.$el.addClass('is-hidden');
          return _this;
        };
      })(this);
      _active = (function(_this) {
        return function() {
          _this.$icon.addClass('is-active');
          return _this;
        };
      })(this);
      _deactive = (function(_this) {
        return function() {
          _this.$icon.removeClass('is-active');
          return _this;
        };
      })(this);
      this.show = _show;
      this.hide = _hide;
      this.active = _active;
      return this.deactive = _deactive;
    };

    return Exchange;

  })(EventDispatcher);
  return UI.Exchange = Exchange;
})(window, window.document);
