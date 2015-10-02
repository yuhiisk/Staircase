var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, ProcessChecker, UI;
  Events = win.Staircase.ns('Events');
  UI = win.Staircase.ns('UI');

  /*
   * ProcessChecker
   * サーババッチ処理の完了チェッカ
   * @constructor
   * @extends EventDispatcher
   */
  ProcessChecker = (function(superClass) {
    extend(ProcessChecker, superClass);

    function ProcessChecker() {
      ProcessChecker.__super__.constructor.call(this);
      this.initialize();
    }

    ProcessChecker.prototype.initialize = function() {
      var _getStatus, _set, _start, _stop, isComplete, self, timer, url;
      self = this;
      isComplete = false;
      timer = null;
      url = '';
      _set = function(path) {
        url = path;
        return this;
      };
      _start = function() {
        isComplete = false;
        return timer = setInterval(function() {
          return $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            jsonpCallback: 'callback'
          }).done(function(res) {
            if (res.is_recogition_finished === true) {
              _stop();
              isComplete = true;
              return self.trigger(Events.CHECK_COMPLETE, null, res);
            } else if (res.is_recogition_finished === false) {
              return self.trigger(Events.CHECK_PROCESS, null, res);
            }
          });
        }, 1000);
      };
      _stop = function() {
        clearInterval(timer);
        return timer = null;
      };
      _getStatus = function() {
        return isComplete;
      };
      this.set = _set;
      this.start = _start;
      this.stop = _stop;
      return this.getStatus = _getStatus;
    };

    return ProcessChecker;

  })(EventDispatcher);
  return UI.ProcessChecker = ProcessChecker;
})(window, window.document);
