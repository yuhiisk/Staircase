var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, ORIGINAL_IMAGE_WIDTH, ReUploader, UI, Util;
  Events = win.Staircase.ns('Events');
  Util = win.Staircase.ns('Util');
  UI = win.Staircase.ns('UI');
  ORIGINAL_IMAGE_WIDTH = 640;

  /*
   * Re-Uploader
   * @constructor
   * @extends EventDispatcher
   * @params {object} options
   */
  ReUploader = (function(superClass) {
    extend(ReUploader, superClass);

    function ReUploader(option) {
      ReUploader.__super__.constructor.call(this);
      this.size = option.size || ORIGINAL_IMAGE_WIDTH;
      this.expansion = ORIGINAL_IMAGE_WIDTH / this.size;
      this.initialize();
      this.eventify();
    }

    ReUploader.prototype.initialize = function() {
      this.$form = $('#Adjust');
      this.$imageFrame = $('.transform__image');
      return this.$image = $('img', this.$imageFrame);
    };

    ReUploader.prototype.eventify = function() {
      return this.$form.on('submit', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.submit();
        };
      })(this));
    };

    ReUploader.prototype.submit = function() {
      var params, ratio;
      ratio = this.$image.width() / this.size + (UI.TRIM_RATIO - 1);
      params = {
        image_uuid: Util.getImageId(),
        zoom: ratio,
        x: (UI.TRIM_OFFSET_LEFT * UI.TRIM_RATIO) + Math.abs(this.$imageFrame.position().left) * this.expansion,
        y: (UI.TRIM_OFFSET_TOP * UI.TRIM_RATIO) + Math.abs(this.$imageFrame.position().top) * this.expansion,
        width: UI.TRIM_WIDTH,
        height: UI.TRIM_HEIGHT
      };
      this.trigger(Events.REUPLOAD_SUBMIT, null, params);
      return $.ajax({
        type: 'POST',
        url: this.$form.attr('action'),
        data: params
      }).done((function(_this) {
        return function(e) {
          return _this.trigger(Events.REUPLOAD_SUCCESS, null, e);
        };
      })(this)).fail((function(_this) {
        return function(e) {
          return _this.trigger(Events.REUPLOAD_ERROR, null, e);
        };
      })(this));
    };

    return ReUploader;

  })(EventDispatcher);
  return UI.ReUploader = ReUploader;
})(window, window.document);
