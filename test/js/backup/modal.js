var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, Modal, UI;
  Events = win.Staircase.ns('Events');
  UI = win.Staircase.ns('UI');

  /*
   * Modal
   * @constructor
   * @extends EventDispatcher
   */
  Modal = (function(superClass) {
    extend(Modal, superClass);

    function Modal(option) {
      Modal.__super__.constructor.call(this);
      this.$el = $(option.id);
      this.$page = $(option.page);
      this.$win = $(win);
      this.winHeight = this.$win.height();
      this.currentScroll = 0;
      this.initialize();
      this.eventify();
    }

    Modal.prototype.initialize = function() {
      var _hide, _show;
      _show = (function(_this) {
        return function() {
          _this._fixed();
          _this.$el.show();
          return _this.trigger(Events.MODAL_SHOW);
        };
      })(this);
      _hide = (function(_this) {
        return function() {
          _this._static();
          _this.$el.hide();
          return _this.trigger(Events.MODAL_HIDE);
        };
      })(this);
      this.show = _show;
      return this.hide = _hide;
    };

    Modal.prototype.eventify = function() {
      return this.$el.on('click', '.modal__bg, .modal__close', (function(_this) {
        return function(e) {
          return _this.hide();
        };
      })(this));
    };

    Modal.prototype._fixed = function() {
      var scrollTop;
      scrollTop = this.$win.scrollTop() * -1;
      this.currentScroll = this.$win.scrollTop();
      this.$page.addClass('is-fixed').css('top', scrollTop);
      this.$el.css({
        position: 'relative',
        height: this.winHeight
      });
      return this.$win.scrollTop(0);
    };

    Modal.prototype._static = function() {
      var scrollTop;
      scrollTop = this.$win.scrollTop() * -1;
      this.$page.removeClass('is-fixed').css('top', '');
      this.$el.css({
        position: '',
        height: 'auto'
      });
      return this.$win.scrollTop(this.currentScroll);
    };

    return Modal;

  })(EventDispatcher);
  return UI.Modal = Modal;
})(window, window.document);
