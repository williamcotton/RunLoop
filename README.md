A very lightweight animation engine.
---

### Install
```bash
bower install RunLoop
```
### Barebones Example
```javascript
RunLoop(document.querySelector("canvas"), function(context, tick) {
  context.fillRect(Math.sin(tick/5)*20 + 100, 20, 40, 40);
}).play();
```
### AMD and more...
```javascript
require([
  "RunLoop"
], 
function(RunLoop) {
  
  var canvas = document.querySelector("canvas");
  var context = canvas.getContext('2d');
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;
  context.width = width;
  context.height = height;
  
  var hue = 0;
  
  var runLoop = RunLoop(context, function(context, tick) {
    context.fillStyle = "hsla(" + hue + ", 100%, 50%, 1.0)";
    context.fillRect(Math.sin(tick/5)*20 + 100, 20, 40, 40);
  });
  
  runLoop.setTickscale(0.2);
  
  runLoop.setInterval(function() {
    hue += 20;
  },10);
  
  runLoop.play();
  
});
```

### Tests

This project uses RequireJS, Karma, and Jasmine.

To set it all up:
```
npm install
```

Karma runs using PhantomJS by default, so you might need to [follow these instructions](http://karma-runner.github.io/0.8/config/browsers.html).

Then:
```
karma start
```
