A very lightweight animation engine.
---

```javascript
RunLoop(document.querySelector("canvas"), function(context, tick) {
  context.fillRect(Math.sin(tick/5)*20 + 100, 20, 40, 40);
}).play();
```
