(function(win, doc, Staircase) {
  'use strict';
  var Debug, Events, Main, Params, UI, Util;
  Debug = Staircase.Debug;
  Events = Staircase.Events;
  Util = Staircase.Util;
  UI = Staircase.UI;
  Params = Staircase.Params;

  /*
   * Entry Point
   */
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
      this.previewImage = new Staircase.PreviewImage('#PreviewContainer');
      this.uploader = new Staircase.Uploader('#StartUpload');
      this.reUploader = new Staircase.ReUploader({
        size: 640
      });
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
      this.eventify();
      return this.globalize();
    };

    Main.prototype.eventify = function() {
      this.$btnReselect.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.uploader.reset();
          _this.transformView.$el.addClass('is-hidden');
          return _this.modal.hide();
        };
      })(this));
      this.$btnPostPhoto.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.reUploader.submit();
          $('.loading__upload').append($('.transform__wrap'));
          return _this.loading.start();
        };
      })(this));
      this.uploader.on(Events.UPLOAD_LOAD_IMG, (function(_this) {
        return function(e, image) {
          return _this.$form.submit();
        };
      })(this));
      this.reUploader.on(Events.REUPLOAD_SUCCESS, (function(_this) {
        return function(e) {
          Params.reupload = e.response;
          return _this.processChecker.set(Params.reupload.result_path).start();
        };
      })(this));
      this.reUploader.on(Events.REUPLOAD_ERROR, (function(_this) {
        return function(e) {
          alert('アップロードに失敗しました。');
          return _this.loading.stop();
        };
      })(this));
      return this.processChecker.on(Events.CHECK_COMPLETE, (function(_this) {
        return function(res) {
          _this.loading.stop();
          switch (res.result.face_count) {
            case 0:
              win.location.href = '/error.html#0';
              break;
            case 1:
              win.location.href = res.result_url;
              break;
            case 2:
              win.location.href = '/error.html#2';
              break;
            default:
              break;
          }
        };
      })(this));
    };

    Main.prototype.globalize = function() {
      var self;
      self = this;
      Util.setResponse = function(res, CAMERA_or_PHOTO) {
        Params.upload = res.response;
        switch (CAMERA_or_PHOTO) {
          case 'CAMERA':
            self.processChecker.set(Params.upload.result_path).start();
            break;
          case 'PHOTO':
            if (self.transformView == null) {
              self.transformView = new Staircase.Transform({
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
            } else {
              self.transformView.setImage();
              self.transformView.reset();
            }
            self.transformView.$el.removeClass('is-hidden');
            break;
          default:
            break;
        }
      };
      return Util['getJSON'] = function(json) {
        return Util.setResponse(json, 'PHOTO');
      };
    };

    Main.prototype._postCameraImage = function() {};

    return Main;

  })();
  return new Main();
})(window, window.document, window.Staircase);
