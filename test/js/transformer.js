(function(win, doc) {
  'use strict';
  var Debug, Events, Params, UI, Util, sc;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  Util = Staircase.Util;
  UI = Staircase.UI;
  Params = Staircase.Params;
  Staircase.prototype.initialize = function() {
    this.uploader = new UI.Uploader(this.settings.uploader);
    this.transform = new UI.Transform(this.settings.transformOption);
    this.$btnPostPhoto = $(this.settings.btnPostPhoto);
    this.eventify();
    return this.globalize();
  };
  Staircase.prototype.eventify = function() {
    return this.$btnPostPhoto.on('click', (function(_this) {
      return function(e) {
        return e.preventDefault();
      };
    })(this));
  };
  Staircase.prototype._postCameraImage = function() {};

  /*
   * Entry Point
   */
  sc = new Staircase({
    size: 640,
    trim_offset_top: 176,
    trim_offset_left: 0,
    trim_width: 886,
    trim_height: 236,
    params: {
      upload: {
        'image_path': '/stub/kayac.png',
        'image_uuid': '*********'
      }
    },
    btnUp: '#AdjustUp',
    btnDown: '#AdjustDown',
    btnLeft: '#AdjustLeft',
    btnRight: '#AdjustRight',
    btnZoomIn: '#ZoomIn',
    btnZoomOut: '#ZoomOut'
  });
  return console.log(sc);
})(window, document);
