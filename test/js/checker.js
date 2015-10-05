(function(win, doc) {
  'use strict';
  var Debug, Events, Params, UI, Util;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  Util = Staircase.Util;
  UI = Staircase.UI;
  Params = Staircase.Params;
  Staircase.prototype.initialize = function() {
    this.processChecker = new UI.ProcessChecker();
    this.loading = new UI.LoadingSprite(this.settings.loading);
    this.$btnStartUpload = $(this.settings.btnStartUpload);
    this.$btnStartCamera = $(this.settings.btnStartCamera);
    this.$btnCancel = $(this.settings.btnCancelCamera);
    this.$btnCapture = $(this.settings.btnCaptureCamera);
    this.$btnRetake = $(this.settings.btnRetakeCapture);
    this.$btnReselect = $(this.settings.btnReselect);
    this.$btnPostWebCamera = $(this.settings.btnPostWebCamera);
    this.$btnPostPhoto = $(this.settings.btnPostPhoto);
    this.$form = $(this.settings.uploadForm);
    this.eventify();
    return this.globalize();
  };
  Staircase.prototype.eventify = function() {
    this.$btnPostPhoto.on('click', (function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.processChecker.set('/stub/status.jsonp').start();
      };
    })(this));
    this.processChecker.on(Events.CHECK_PROCESS, (function(_this) {
      return function(res) {
        console.log(res);
        return console.log(_this.processChecker.getStatus());
      };
    })(this));
    return this.processChecker.on(Events.CHECK_COMPLETE, (function(_this) {
      return function(res) {
        console.log(res);
        return _this.processChecker.stop();
      };
    })(this));
  };

  /*
   * Entry Point
   */
  return new Staircase({
    size: 640,
    trim_offset_top: 176,
    trim_offset_left: 0,
    trim_width: 886,
    trim_height: 236,
    params: {},
    btnStartUpload: '#StartUpload',
    btnStartCamera: '#StartCamera',
    btnCancelCamera: '#Cancel',
    btnCaptureCamera: '#Capture',
    btnRetakeCapture: '#Retake',
    btnReselect: '#Reselect',
    btnPostWebCamera: '#PostWebCamera',
    btnPostPhoto: '#PostPhoto',
    uploadForm: '#Upload'
  });
})(window, document);
