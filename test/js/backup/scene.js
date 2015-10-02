var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Events, Scene, SceneManager, UI;
  Events = win.Staircase.ns('Events');
  UI = win.Staircase.ns('UI');

  /*
   * Scene
   * シーン単体のクラス
   * @constructor
   * @extends EventDispatcher
   * @params {string} DOM id
   */
  Scene = (function(superClass) {
    extend(Scene, superClass);

    function Scene(id) {
      Scene.__super__.constructor.call(this);
      this.el = document.getElementById(id);
      this.items = [];
      this.initialize();
    }

    Scene.prototype.initialize = function() {};

    Scene.prototype.add = function(item) {
      this.items.push(item);
      return this.trigger('scene.add', item, this);
    };

    Scene.prototype.active = function() {
      var item, j, len, ref;
      if (this.items.length > 0) {
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          item.show();
        }
      }
      this.el.style.display = 'block';
      return this.trigger('scene.active', this);
    };

    Scene.prototype.deactive = function() {
      var item, j, len, ref;
      if (this.items.length > 0) {
        ref = this.items;
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          item.hide();
        }
      }
      this.el.style.display = 'none';
      return this.trigger('scene.deactive', this);
    };

    return Scene;

  })(EventDispatcher);
  UI.Scene = Scene;

  /*
   * SceneManager
   * シーン管理クラス
   * @constructor
   * @extends EventDispatcher
   * @params {HTMLElement} DOM
   */
  SceneManager = (function(superClass) {
    extend(SceneManager, superClass);

    function SceneManager(scene) {
      SceneManager.__super__.constructor.call(this);
      this.scenes = scene || [];
      this.current = 0;
      this.active(this.current);
    }

    SceneManager.prototype.add = function(scene) {
      return this.scenes.push(scene);
    };

    SceneManager.prototype.active = function(index, silent) {
      var current, i, j, ref, scene;
      if (index != null) {
        current = index;
      } else {
        current = this.current;
      }
      for (i = j = 0, ref = this.scenes.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        scene = this.scenes[i];
        if (i === current) {
          scene.active();
        } else {
          scene.deactive();
        }
      }
      this.current = current;
      return this.trigger('sceneManager.active', null, this.current);
    };

    SceneManager.prototype.deactive = function(index) {
      var current;
      if (index != null) {
        current = index;
      } else {
        current = this.current;
      }
      this.scenes[index].deactive();
      this.current = current;
      return this.trigger('sceneManager.deactive', null, this.current);
    };

    SceneManager.prototype.reset = function() {
      var i, j, ref, scene;
      this.current = 0;
      for (i = j = 0, ref = this.scene.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        scene = this.scene[i];
        scene.deactive();
      }
      return this.scenes = [];
    };

    SceneManager.prototype.first = function() {
      return this.scenes[0];
    };

    SceneManager.prototype.last = function() {
      return this.scenes[this.scenes.length - 1];
    };

    SceneManager.prototype.isFirst = function() {
      return this.current === 0;
    };

    SceneManager.prototype.isLast = function() {
      return this.current === this.scenes.length - 1;
    };

    SceneManager.prototype.prev = function() {
      if (this.hasPrev()) {
        return this.active(--this.current);
      }
    };

    SceneManager.prototype.next = function() {
      if (this.hasNext()) {
        return this.active(++this.current);
      }
    };

    SceneManager.prototype.hasPrev = function() {
      return 0 <= this.current - 1;
    };

    SceneManager.prototype.hasNext = function() {
      return this.scenes.length > this.current + 1;
    };

    return SceneManager;

  })(EventDispatcher);
  return UI.SceneManager = SceneManager;
})(window, window.document);
