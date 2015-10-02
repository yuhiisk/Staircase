var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Debug, Events, UI, Uploader, Util;
  Debug = win.Staircase.ns('Debug');
  Events = win.Staircase.ns('Events');
  UI = win.Staircase.ns('UI');
  Util = win.Staircase.ns('Util');

  /*
   * Uploader
   * @constructor
   * @extends EventDispatcher
   */
  Uploader = (function(superClass) {
    extend(Uploader, superClass);

    function Uploader(id) {
      Uploader.__super__.constructor.call(this);
      this.$el = $(id);
      this.initialize();
    }

    Uploader.prototype.initialize = function(els) {
      var $iframe, $input, _handleFileChange, _handleImgLoad, _handleReaderLoad, _onChangeHandler, reset, self;
      self = this;
      $input = this.$el.find('input[type="file"]');
      $iframe = this.$el.find('iframe');
      _handleFileChange = function(e) {
        var file, reader;
        reader = new FileReader();
        file = e.target.files[0];
        reader.onload = _handleReaderLoad;
        return reader.readAsDataURL(file);
      };
      _handleReaderLoad = function(e) {
        var img;
        self.trigger(Events.UPLOAD_READER);
        img = new Image();
        img.onload = _handleImgLoad;
        return img.src = e.target.result;
      };
      _handleImgLoad = function(e) {
        return self.trigger(Events.UPLOAD_LOAD_IMG);
      };
      _onChangeHandler = function(e) {
        if (Debug) {
          $iframe.attr({
            src: '/stub/_image.html',
            width: 500,
            height: 300
          });
          return;
        }
        if (Util.ua.isMobile || !win.FileReader) {
          return self.$el.find('form').submit();
        } else {
          return _handleFileChange(e);
        }
      };
      $input.on('change', _onChangeHandler);
      reset = function() {
        $input.val('');
        $input.off('change');
        $input.parent().html($input.parent().html());
        $input = this.$el.find('input[type="file"]');
        return $input.on('change', _onChangeHandler);
      };
      return this.reset = reset;
    };

    return Uploader;

  })(EventDispatcher);
  return UI.Uploader = Uploader;
})(window, window.document);
