(function(win, doc) {
  'use strict';
  var Events, Main, Params, UI, Util;
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
        params: {},
        reUploadSize: 640,
        debugMode: 'debug'
      });
      this.initialize();
    }

    Main.prototype.initialize = function() {
      this.camera = new Staircase.Camera('#Video');
      this.previewCanvas = new Staircase.PreviewCanvas('#Canvas');
      this.previewImage = new Staircase.PreviewImage('#PreviewContainer');
      this.$btnStartUpload = $('#StartUpload');
      this.$btnStartCamera = $('#StartCamera');
      this.$btnCancel = $('#Cancel');
      this.$btnCapture = $('#Capture');
      this.$btnRetake = $('#Retake');
      this.$btnReselect = $('#Reselect');
      this.$btnPostWebCamera = $('#PostWebCamera');
      this.$form = $('#Upload');
      this.eventify();
      return this.globalize();
    };

    Main.prototype.eventify = function() {
      if (this.camera.isSupport == null) {
        this.$btnStartCamera.parent().hide();
      }
      this.$btnStartCamera.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.camera.powerOn();
        };
      })(this));
      this.camera.on(Events.CAMERA_SUCCESS, (function(_this) {
        return function(e) {
          return console.log(e);
        };
      })(this));
      this.camera.on(Events.CAMERA_ERROR, function(e) {
        return console.log(e);
      });
      this.$btnCancel.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.camera.powerOff();
        };
      })(this));
      this.$btnCapture.on('click', (function(_this) {
        return function(e) {
          var video;
          e.preventDefault();
          video = _this.camera.getVideo();
          _this.previewCanvas.draw(video);
          _this.previewImage.show();
          $('#Camera').hide();
          return $('#Preview').show();
        };
      })(this));
      this.$btnRetake.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.previewImage.hide();
          $('#Camera').show();
          return $('#Preview').hide();
        };
      })(this));
      return this.$btnPostWebCamera.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.camera.powerOff();
          return _this._postCameraImage();
        };
      })(this));
    };

    Main.prototype.globalize = function() {
      var self;
      self = this;
      Util.setResponse = function(res, type) {
        Params.upload = res.response;
        switch (type) {
          case 'CAMERA':
            alert('Post Complete.');
            break;
          case 'PHOTO':
            alert('Form?');
            break;
          default:
            break;
        }
      };
      return Util['getJSON'] = function(json) {
        return Util.setResponse(json, 'PHOTO');
      };
    };

    Main.prototype._postCameraImage = function() {
      var blob, canvas, formData, ratio, video, x, xhr, y;
      canvas = this.previewCanvas.getCanvas();
      blob = this.previewCanvas.getBlob('image/png');
      formData = new FormData(this.$form[0]);
      xhr = new XMLHttpRequest();
      ratio = 2.2 + (UI.TRIM_RATIO - 1);
      video = this.camera.getVideo();
      x = ($(video).width() / 2 * ratio) - (UI.TRIM_WIDTH / 2);
      y = ($(video).height() / 2 * ratio) - (UI.TRIM_HEIGHT / 2);
      formData.append('is_camera', true);
      formData.append('image', blob);
      formData.append('zoom', ratio);
      formData.append('x', x);
      formData.append('y', y);
      formData.append('width', UI.TRIM_WIDTH);
      formData.append('height', UI.TRIM_HEIGHT);
      xhr.onload = function(e) {
        var json;
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            json = Util.parseJSON(xhr.responseText);
            return Util.setResponse(json, 'CAMERA');
          } else {

          }
        }
      };
      xhr.onerror = function(e) {
        return console.log('XHR ERROR: ', e);
      };
      if (Staircase.Debug) {
        xhr.open('GET', 'stub/result.json');
        return xhr.send();
      } else {
        xhr.open('POST', this.$form.attr('action'));
        return xhr.send(formData);
      }
    };

    return Main;

  })();
  return new Main();
})(window, document);
