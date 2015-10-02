(function(win, doc) {
  'use strict';
  var EventDispatcher;
  EventDispatcher = (function() {
    function EventDispatcher() {
      this._events = {};
    }

    EventDispatcher.prototype.hasEventListener = function(eventName) {
      return !!this._events[eventName];
    };

    EventDispatcher.prototype.addEventListener = function(eventName, callback) {
      var events, i, k, len1;
      if (this.hasEventListener(eventName)) {
        events = this._events[eventName];
        for (k = 0, len1 = events.length; k < len1; k++) {
          i = events[k];
          if (events[i] === callback) {
            return;
          }
        }
        events.push(callback);
      } else {
        this._events[eventName] = [callback];
      }
      return this;
    };

    EventDispatcher.prototype.removeEventListener = function(eventName, callback) {
      var events, i, index;
      if (!this.hasEventListener(eventName)) {
        return;
      } else {
        events = this._events[eventName];
        i = events.length;
        index = 0;
        while (i--) {
          if (events[i] === callback) {
            index = i;
          }
        }
        events.splice(index, i);
      }
      return this;
    };

    EventDispatcher.prototype.fireEvent = function(eventName, opt_this) {
      var arg, copyEvents, event, events, k, len1, results;
      if (!this.hasEventListener(eventName)) {

      } else {
        events = this._events[eventName];
        copyEvents = this._merge([], events);
        arg = this._merge([], arguments);
        arg.splice(0, 2);
        results = [];
        for (k = 0, len1 = copyEvents.length; k < len1; k++) {
          event = copyEvents[k];
          results.push(event.apply(opt_this || this, arg));
        }
        return results;
      }
    };

    EventDispatcher.prototype._merge = function(first, second) {
      var i, j, len;
      len = +second.length;
      j = 0;
      i = first.length;
      while (j < len) {
        first[i++] = second[j++];
      }
      if (len !== len) {
        while (second[j] !== void 0) {
          first[i++] = second[j++];
        }
      }
      first.length = i;
      return first;
    };

    return EventDispatcher;

  })();
  EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;
  EventDispatcher.prototype.off = EventDispatcher.prototype.removeEventListener;
  EventDispatcher.prototype.trigger = EventDispatcher.prototype.fireEvent;
  return win.EventDispatcher = EventDispatcher;
})(window, window.document);
