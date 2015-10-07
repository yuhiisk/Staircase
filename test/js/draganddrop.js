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
        size: {
          width: 640,
          height: 480
        },
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
      this.dnd = new Staircase.DragAndDrop('#DragAndDrop');
      this.previewCanvas = new Staircase.PreviewCanvas('#Canvas');
      this.previewImage = new Staircase.PreviewImage('#PreviewContainer');
      this.$btnRetake = $('#Retake');
      this.$btnPostWebCamera = $('#PostWebCamera');
      this.$form = $('#Upload');
      this.eventify();
      return this.globalize();
    };

    Main.prototype.eventify = function() {
      this.dnd.on(Events.DND_SELECT, function(e, files) {
        return console.log(e, files);
      });
      this.dnd.on(Events.DND_DROP, function(e, files) {
        return console.log(e, files);
      });
      this.dnd.on(Events.DND_LOAD_IMG, (function(_this) {
        return function(e, image, file) {
          console.log(e, image, file);
          if (file.size >= 2097152) {
            alert('アップロードサイズ上限を超えています。');
          }
          _this.previewCanvas.draw(image);
          _this.previewImage.show();
          $('#DragAndDrop').hide();
          return $('#Preview').show();
        };
      })(this));
      this.$btnRetake.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.previewImage.hide();
          $('#DragAndDrop').show();
          return $('#Preview').hide();
        };
      })(this));
      return this.$btnPostWebCamera.on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
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
      var blob, canvas, formData, xhr;
      canvas = this.previewCanvas.getCanvas();
      blob = this.previewCanvas.getBlob('image/png');
      formData = new FormData(this.$form[0]);
      xhr = new XMLHttpRequest();
      formData.append('image', blob);
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
