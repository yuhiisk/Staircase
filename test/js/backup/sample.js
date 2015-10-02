(function(win, doc) {
  'use strict';
  var Events, Main, Params, UI, Util;
  Events = win.hitomi.ns('Events');
  Util = win.hitomi.ns('Util');
  UI = win.hitomi.ns('UI');
  Params = win.hitomi.ns('Params');
  Util.getImagePath = function() {
    return '/assets/img/dummy.jpg';
  };
  Util.getImageId = function() {
    return '/assets/img/dummy.jpg';
  };

  /*
   * Entry Point
   */
  Main = (function() {
    function Main() {
      this.initialize();
    }

    Main.prototype.initialize = function() {
      return this.transform = new UI.Transform('#Transform');
    };

    return Main;

  })();
  return new Main();
})(window, window.document);
