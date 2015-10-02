var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Count, Events, UI;
  Events = win.Staircase.ns('Events');
  UI = win.Staircase.ns('UI');

  /*
   * Count
   * @constructor
   * @extends EventDispatcher
   */
  Count = (function(superClass) {
    extend(Count, superClass);

    function Count(id) {
      Count.__super__.constructor.call(this);
      this.$el = $(id);
      this.numbers = [];
      this.count = 0;
      this.max = parseInt(this.$el.data('count'), 10);
      this.digit = this.max.toString().length;
      this.time = 5000;
      this.timer = null;
      this.initialize();
      this.eventify();
    }

    Count.prototype.initialize = function() {
      $.each(this.max.toString().split(''), (function(_this) {
        return function(i) {
          var el;
          el = $('.diagnosis__score-number', _this.$el).eq(i);
          return _this.numbers.unshift(el);
        };
      })(this));
      return this.render();
    };

    Count.prototype.eventify = function() {
      return this.$el.on({
        start: (function(_this) {
          return function() {
            return _this.start();
          };
        })(this),
        stop: (function(_this) {
          return function() {
            return _this.stop();
          };
        })(this),
        reset: (function(_this) {
          return function() {
            return _this.reset();
          };
        })(this)
      });
    };

    Count.prototype.start = function() {
      var interval, self;
      self = this;
      interval = 10;
      return this.timer = setInterval(function() {
        self.time -= interval;
        self.count++;
        self.render();
        if (self.max <= self.count) {
          return self.stop();
        }
      }, interval);
    };

    Count.prototype.stop = function() {
      clearInterval(this.timer);
      return this.timer = null;
    };

    Count.prototype.render = function() {
      var count, i, j, padding, ref;
      padding = '';
      for (i = j = 0, ref = this.digit; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        padding += '0';
      }
      count = (padding + this.count).slice(-3);
      return $.each(this.numbers, (function(_this) {
        return function(i, $number) {
          var className;
          className = 'diagnosis__score-number icon-n';
          if (_this.digit !== 1 && _this.digit - 1 === i) {
            className += count.slice(i, i + 1);
          } else {
            className += count.slice(-1);
          }
          return $number[0].className = className;
        };
      })(this));
    };

    Count.prototype.getTime = function() {
      return this.time;
    };

    Count.prototype.reset = function() {
      this.count = 0;
      this.time = 5000;
      this.timer = null;
      return $.each(this.numbers, function(i, $number) {
        return $number[0].className = 'diagnosis__score-number icon-n0';
      });
    };

    return Count;

  })(EventDispatcher);
  return UI.Count = Count;
})(window, window.document);
