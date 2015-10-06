(function(win, doc) {
  'use strict';
  var Debug, Events, Main, Params, Util;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  Util = Staircase.Util;
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
        params: {},
        reUploadSize: 640,
        debugMode: 'debug'
      });
      this.initialize();
    }

    Main.prototype.initialize = function() {
      this.processChecker = new Staircase.ProcessChecker();
      this.loading = new Staircase.LoadingSprite('#Loading');
      this.$btnStartUpload = $('#StartUpload');
      this.$btnStartCamera = $('#StartCamera');
      this.$btnCancel = $('#Cancel');
      this.$btnCapture = $('#Capture');
      this.$btnRetake = $('#Retake');
      this.$btnReselect = $('#Reselect');
      this.$btnPostWebCamera = $('#PostWebCamera');
      this.$btnPostPhoto = $('#PostPhoto');
      this.$form = $('#Upload');
      return this.eventify();
    };

    Main.prototype.eventify = function() {
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

    return Main;

  })();
  return new Main();
})(window, document);
