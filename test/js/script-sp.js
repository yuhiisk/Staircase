(function(win, doc) {
  'use strict';
  var Events, Main, Params, UI, Util;
  Events = Staircase.Events;
  Params = Staircase.Params;
  Util = Staircase.Util;
  UI = Staircase.UI;
  UI.TRIM_OFFSET_TOP = 200;
  UI.TRIM_OFFSET_LEFT = 0;

  /*
   * Entry Point
   */
  Main = (function() {
    function Main() {
      this.initialize();
    }

    Main.prototype.initialize = function() {
      this.modal = new Staircase.Modal({
        id: '#Modal',
        page: '.wrapper'
      });
      this.previewImage = new Staircase.PreviewImage('#PreviewContainer');
      this.uploader = new Staircase.Uploader('#StartUpload');
      this.reUploader = new Staircase.ReUploader({
        size: 276
      });
      this.processChecker = new Staircase.ProcessChecker();
      this.loading = new Staircase.Loading('#Loading');
      this.exchangeLoading = new Staircase.Exchange('#Exchange');
      this.$form = $('#Upload');
      this.previewView = new Staircase.Scene('#Preview');
      this.loadingView = new Staircase.Scene('#Loading');
      this.sceneManager = new Staircase.SceneManager([this.previewView, this.loadingView]);
      this.$btnCancel = $('#Cancel');
      this.$btnCapture = $('#Capture');
      this.$btnReselect = $('#Reselect');
      this.$btnPostPhoto = $('#PostPhoto');
      this.eventify();
      return this.globalize();
    };

    Main.prototype.eventify = function() {
      this.$btnCancel.on('click', (function(_this) {
        return function(e) {
          _this.sceneManager.prev();
          return _this.modal.hide();
        };
      })(this));
      this.$btnReselect.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.sceneManager.active(0);
          _this.uploader.reset();
          _this.transformView.$el.addClass('is-hidden');
          return _this.modal.hide();
        };
      })(this));
      this.$btnPostPhoto.on('click', (function(_this) {
        return function(e) {
          _this.reUploader.submit();
          $('.loading__upload').append($('.transform__wrap').clone());
          _this.loading.start();
          return _this.sceneManager.next();
        };
      })(this));
      this.modal.on(Events.MODAL_SHOW, (function(_this) {
        return function(e) {
          if (_this.modal.HEIGHT == null) {
            _this.modal.HEIGHT = _this.modal.$el.find('.modal__content').height();
          }
          return _this.modal.$el.height(_this.modal.HEIGHT);
        };
      })(this));
      this.modal.on(Events.MODAL_HIDE, (function(_this) {
        return function(e) {
          return _this.modal.$el.height('auto');
        };
      })(this));
      this.$form.on('submit', (function(_this) {
        return function(e) {
          return _this.exchangeLoading.active().show();
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
              win.location.href = '/sp/error.html#0';
              break;
            case 1:
              win.location.href = res.result_url;
              break;
            case 2:
              win.location.href = '/sp/error.html#2';
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
        self.modal.show();
        switch (CAMERA_or_PHOTO) {
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
            self.exchangeLoading.deactive().hide();
            self.transformView.$el.removeClass('is-hidden');
            self.previewView.trigger(Events.PREVIEW_PHOTO);
            self.sceneManager.active(0);
            break;
          default:
            break;
        }
      };
      return Util['getJSON'] = function(json) {
        return Util.setResponse(json, 'PHOTO');
      };
    };

    return Main;

  })();
  return new Main();
})(window, window.document);
