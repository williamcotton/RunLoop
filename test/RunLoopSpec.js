define(["RunLoop"], function(RunLoop) {
  
  var runLoopInstance, canvas, context;
  
  beforeEach(function() {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    runLoopInstance = RunLoop(canvas, function(ctx, tick) {});
  });
  
  afterEach(function() {
    canvas.parentNode.removeChild(canvas);
  });
  
  describe("canvas", function() {
    
    it("should make a context from a canvas", function() {
      
      runs(function() {
        RunLoop(canvas, function(ctx, tick) {
          expect(ctx).not.toBeDefined();
        }).play();
      });
      
    });
    
    it("should use a context", function() {
      
      var context = canvas.getContext('2d');
      var width = canvas.offsetWidth;
      var height = canvas.offsetHeight;
      context.width = width;
      context.height = height;
      
      runs(function() {
        
        RunLoop(context, function(ctx, tick) {
          expect(ctx).toBeDefined();
        }).play();
        
      });
      
    });
    
  });
  
  describe("ticks, tickscale, and step", function() {
    
    it("should get the default tickscale of 1", function() {
      expect(runLoopInstance.getTickscale()).toBe(1);
    });
    
    it("should get the update the tickscale", function() {
      runLoopInstance.setTickscale(10);
      expect(runLoopInstance.getTickscale()).toBe(10);
    });
    
    it("should have a tick of 0 at the start", function() {
      expect(runLoopInstance.getTick()).toBe(0);
    });
    
    it("should have a tick of 1 after a step", function() {
      runLoopInstance.step();
      expect(runLoopInstance.getTick()).toBe(1);
    });
    
    it("should have a tick of 2 after two steps", function() {
      runLoopInstance.step(2);
      expect(runLoopInstance.getTick()).toBe(2);
    });
    
    it("should have a tick of 10 after two steps with a tickscale of 5", function() {
      runLoopInstance.setTickscale(5);
      runLoopInstance.step(2);
      expect(runLoopInstance.getTick()).toBe(10);
    });
    
  });
  
  describe("play and pause", function() {
    
    it("should play", function() {
      
      runs(function() {
        runLoopInstance.play();
      });
      
      waits(50);
      
      runs(function() {
        expect(runLoopInstance.getTick()).toBeGreaterThan(0);
      });
      
    });
    
    it("should play and then pause", function() {
      
      var tickAtPause;
      
      runs(function() {
        runLoopInstance.play();
      });
      
      waits(50);
      
      runs(function() {
        runLoopInstance.pause();
        tickAtPause = runLoopInstance.getTick();
      });
      
      waits(50);
      
      runs(function() {
        expect(tickAtPause).toBe(runLoopInstance.getTick());
      });
      
    });
    
    it("should play, pause, and then play again", function() {
      
      var tickAtPause;
      
      runs(function() {
        runLoopInstance.play();
      });
      
      waits(50);
      
      runs(function() {
        runLoopInstance.pause();
        tickAtPause = runLoopInstance.getTick();
        runLoopInstance.play();
      });
      
      waits(50);
      
      runs(function() {
        expect(tickAtPause).toBeLessThan(runLoopInstance.getTick());
      });
      
    });
    
  });
  
  describe("setInterval and setTimeout", function() {
    
    it("should do something after 50 ticks", function() {
      
      var didItHappen;
      
      runs(function() {
        runLoopInstance.setTimeout(function() {
          didItHappen = true;
        }, 50);
        runLoopInstance.step(50);
        expect(didItHappen).toBe(true);
      });
      
    });
    
    it("should do something after every 50 ticks", function() {
      
      var didItHappen = 0;
      
      runs(function() {
        runLoopInstance.setInterval(function() {
          didItHappen++;
        }, 50);
        runLoopInstance.step(100);
        expect(didItHappen).toBe(2);
      });
      
    });
    
    it("should play and then something should happen", function() {
      
      var didItHappen;
      
      runs(function() {
        runLoopInstance.setTimeout(function() {
          didItHappen = true;
        }, 5);
        runLoopInstance.play();
      });
      
      waitsFor(function() {
        return didItHappen;
      }, 1000);
      
      runs(function() {
        expect(didItHappen).toBe(true);
      });
      
    });
    
  });
  
});