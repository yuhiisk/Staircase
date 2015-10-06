(function(win, doc) {
  'use strict';
  var Debug, Events, Main, Params, UI, Util;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  Util = Staircase.Util;
  UI = Staircase.UI;
  Params = Staircase.Params;
  Main = (function() {
    function Main() {
      Staircase.initialize({
        size: 640,
        trim_offset_top: 176,
        trim_offset_left: 0,
        trim_width: 886,
        trim_height: 236,
        eventNamespace: 'Staircase',
        params: {
          upload: {
            'image_path': '/stub/kayac.png',
            'image_uuid': '*********'
          }
        },
        reUploadSize: 640,
        debugMode: 'debug'
      });
      this.initialize();
    }

    Main.prototype.initialize = function() {
      this.uploader = new Staircase.Uploader('#StartUpload');
      this.transform = new Staircase.Transform({
        transform: '#Transform',
        transformImageWrap: '.transform__image',
        transformDrag: '.transform__touch',
        btnUp: '#AdjustUp',
        btnDown: '#AdjustDown',
        btnLeft: '#AdjustLeft',
        btnRight: '#AdjustRight',
        btnZoomIn: '#ZoomIn',
        btnZoomOut: '#ZoomOut'
      });
      this.$btnPostPhoto = $('#PostPhoto');
      return this.eventify();
    };

    Main.prototype.eventify = function() {
      return this.$btnPostPhoto.on('click', (function(_this) {
        return function(e) {
          return e.preventDefault();
        };
      })(this));
    };

    Main.prototype._postCameraImage = function() {};

    return Main;

  })();
  return new Main();
})(window, document);
