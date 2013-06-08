A very lightweight animation engine.
---

```javascript
// set up our canvas context...
var canvas = document.querySelector("canvas");
var context = canvas.getContext('2d');
var width = canvas.offsetWidth;
var height = canvas.offsetHeight;
context.width = width;
context.height = height;

RunLoop(context, function(context, tick) {
  // make a little dude oscillate...
  context.fillStyle = "black";
  var x = Math.sin(tick/5)*20 + 100;
  context.fillRect(x, 20, 40, 40);
}).play();
```
