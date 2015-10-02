var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(win, doc) {
  'use strict';
  var Debug, Events, Main, Result, UI, Util;
  Debug = win.Staircase.ns('Debug');
  Events = win.Staircase.ns('Events');
  UI = win.Staircase.ns('UI');
  Util = win.Staircase.ns('Util');

  /*
   * Result
   */
  Result = (function(superClass) {
    extend(Result, superClass);

    function Result(id) {
      Result.__super__.constructor.call(this);
      this.el = doc.getElementById(id);
      this.img = new Image();
      this.initialize();
    }

    Result.prototype.initialize = function() {
      var _render;
      _render = function() {
        return this.el.appendChild(this.img);
      };
      return this.render = _render;
    };

    return Result;

  })(EventDispatcher);
  UI.Result = Result;
  Main = (function() {
    function Main() {
      this.initialize();
      this.eventify();
    }

    Main.prototype.initialize = function() {
      var _drawDoughnut, _drawRader, _startShowElements, _startShowElementsIE, _startShowVisual, self;
      if (/^#share$/.test(win.location.hash)) {
        $(doc.body).addClass('mode-share');
      }
      self = this;
      this.modal = new UI.Modal({
        id: '#Modal',
        page: '.wrapper'
      });
      this.countUp = new UI.Count('#Count');
      _drawRader = function() {
        var canvas, chart, context, data, radarChartData, rader;
        if (Debug === true) {
          data = [85, 10, 42, 22, 9];
        } else {
          data = GRAPH_DATA;
        }
        radarChartData = {
          labels: ['', '', '', '', ''],
          datasets: [
            {
              fillColor: 'rgba(153,153,153,0.5)',
              strokeColor: 'rgba(0,162,154,0)',
              pointColor: '#fff',
              pointStrokeColor: '#03a39b',
              data: data
            }
          ]
        };
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');
        chart = new Chart(context);
        return rader = chart.Radar(radarChartData, {
          animationEasing: "easeOutExpo",
          angleLineColor: '#bbe6e4',
          angleLineWidth: 0,
          scaleLineWidth: 0,
          scaleLineColor: '#bbe6e4',
          scaleShowLabel: false,
          scaleShowGridLines: false,
          showTooltips: false,
          pointDotRadius: 2,
          pointDotStrokeWidth: 2
        });
      };
      _drawDoughnut = function() {
        var canvas, chart, context, data, doughnutChartData, options, rader;
        if (Debug === true) {
          data = [50, 50];
        } else {
          data = DOUGHNUT_CHART_DATA;
        }
        doughnutChartData = [
          {
            value: data[0],
            color: "#00a29a"
          }, {
            value: data[1],
            color: "rgba(255,255,255,0)"
          }
        ];
        options = {
          segmentShowStroke: false,
          segmentStrokeColor: "transparent",
          segmentStrokeWidth: 1,
          percentageInnerCutout: 84,
          animationSteps: 70,
          animationEasing: "easeOutExpo",
          animateRotate: true,
          animateScale: false,
          showTooltips: false
        };
        canvas = document.getElementById('ScoreChart');
        context = canvas.getContext('2d');
        chart = new Chart(context);
        return rader = chart.Doughnut(doughnutChartData, options);
      };
      _startShowVisual = function() {
        var duration, easing;
        duration = 3000;
        easing = 'swing';
        $('.diagnosis__image-effect').animate({
          left: 886 + 547
        }, duration, easing);
        return $('.diagnosis__image-processed').animate({
          width: 886 + 1089
        }, duration, easing);
      };
      _startShowElements = function() {
        var base;
        base = 2000;
        $('.diagnosis__comment-heading').delay(base).animate({
          opacity: 1
        });
        $('.diagnosis__comment-title').delay(base + 500).animate({
          opacity: 1
        });
        $('.diagnosis__comment-text').delay(base + 1000).animate({
          opacity: 1
        });
        $('.diagnosis__comment-text').delay(base + 1000).animate({
          opacity: 1
        });
        $('.diagnosis__score-text').delay(base + 1500).animate({
          opacity: 1
        });
        $('.diagnosis__score-graph').delay(base + 2000).animate({
          opacity: 1
        }, function() {
          self.countUp.start();
          return _drawDoughnut();
        });
        return $('.diagnosis__graph').delay(base + 3000).animate({
          opacity: 1
        }, function() {
          return _drawRader();
        });
      };
      _startShowElementsIE = function() {
        var base;
        base = 1000;
        setTimeout(function() {
          self.countUp.start();
          return _drawDoughnut();
        }, base);
        return setTimeout(function() {
          return _drawRader();
        }, base + 500);
      };
      _startShowVisual();
      if (Modernizr.opacity === false) {
        _startShowElementsIE();
      } else {
        _startShowElements();
      }
      this.drawRader = _drawRader;
      this.drawDoughnut = _drawDoughnut;
      this.start = _startShowVisual;
      this.start();
      return Util.rollover();
    };

    Main.prototype.eventify = function() {
      $('.btn__item--entry').on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.modal.show();
        };
      })(this));
      $('.btn__item--download').on('click', function(e) {
        var url;
        url = $(this).data('redirect');
        return setTimeout(function() {
          return win.location.href = url;
        }, 1500);
      });
      return $('.download__close').on('click', (function(_this) {
        return function(e) {
          e.preventDefault();
          return _this.modal.hide();
        };
      })(this));
    };

    return Main;

  })();
  return new Main();
})(window, window.document);
