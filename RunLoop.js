// requestAnimationFrame polyfill
window.requestAnimationFrame = (function(callback) {
  return window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || 
  window.oRequestAnimationFrame || 
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(function() {
      var timestamp = Date.now();
      callback(timestamp);
    }, 1000 / 60);
  };
})();

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.RunLoop = factory();
    }
}(this, function () {
  
    var RunLoop = function(context_or_canvas, callback) {
      
      var context;
      if (typeof(context_or_canvas.getContext('2d'))) {
        var canvas = context_or_canvas;
        context = canvas.getContext('2d');
        var width = canvas.offsetWidth;
        var height = canvas.offsetHeight;
        context.width = width;
        context.height = height;
      }
      else {
        context = context_or_canvas;
      }

      var tick = 0;
      var tickscale = 1;
      var paused = false;

      var scheduledEvents = [];

      /* -- Out raison d'être... -- */
      var rl = function() {

        // tick, tock
        tick += tickscale;

        // clear the canvas every frame
        context.clearRect(0, 0, context.width, context.height);

        // run callbacks scheduled with setInterval and setTimeout
        runScheduledEvents(context, tick);

        // run
        callback(context, tick);

        // loop
        window.requestAnimationFrame(function(timestamp) {
          if (!paused) {
            rl(timestamp);
          }
        });
      }

      /* -- Our event scheduler -- */
      var runScheduledEvents = function(context, tick) {
        var previousEvents = scheduledEvents;
        scheduledEvents.forEach(function(scheduledEvent) {
          if (tick > scheduledEvent.fire_at) {
            scheduledEvent.callback(context, tick);
            if (scheduledEvent.repeat) {
              scheduledEvent.fire_at += scheduledEvent.elapsed_ticks;
            }
            else {
              scheduledEvent.finished = true;
            }
          }
        });
        scheduledEvents.forEach(function(scheduledEvent) {
          if (scheduledEvent.finished) {
            scheduledEvents.splice(scheduledEvents.indexOf(scheduledEvent), 1);
          }
        });
      }

      /* -- Our module exports -- */
      var exports = {

        getTickscale: function() {
          return tickscale;
        },

        setTickscale: function(new_tickscale) {
          tickscale = new_tickscale;
        },

        getTick: function() {
          return tick;
        },

        setTick: function(new_ticks) {
          ticks = new_ticks;
        },

        pause: function() {
          paused = true;
        },

        play: function() {
          paused = false;
          rl();
        },

        step: function(count) {
          exports.pause();
          var c = count || 1;
          for (var i=0; i < c; i++) {
            rl();
          };
        },

        /*

          Browser vendors have implemented power saving techniques related to the
          animationFrame callback that cause the loop to pause when the browser tab
          is not visible. This causes issues if window.setInterval is used to feed 
          events in to the run loop... when you come back to the browser tab with
          your animation on it, all of the window.setInterval events are triggered
          at once.

          By creating our own setInterval mechanism we can alleviate the issue by
          triggering the callbacks from within the context of the run loop.

        */

        setInterval: function(callback, ticks) {
          exports.setTimeout(function() {
            callback();
          }, ticks, true)
        },

        setTimeout: function(callback, elapsed_ticks, repeat) {
          scheduledEvents.push({
            callback: callback,
            elapsed_ticks: elapsed_ticks,
            fire_at: elapsed_ticks + tick,
            repeat: repeat
          });
        }

      }

      return exports;

    };

    return RunLoop;
}));