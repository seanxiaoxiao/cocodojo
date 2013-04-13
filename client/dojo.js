/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 4/12/13
 * Time: 11:03 PM
 * To change this template use File | Settings | File Templates.
 */


Template.dojo.codeSession = function() {
  var codeSessionId = Session.get("codeSessionId");
  return CodeSession.findOne({_id: codeSessionId});
};

var codeSessionHandle = null;

Deps.autorun(function() {
  var codeSessionId = Session.get('codeSessionId');
  if (codeSessionId) {
    codeSessionHandle = Meteor.subscribe('codeSession', codeSessionId);
  }
  else {
    codeSessionHandle = null;
  }
});



var Drawing = function(type, attrs) {
  this.type = type;
  this.attrs = attrs;
  this.data = {};
  this.init();
  return this;
}

Drawing.prototype.init = function(){
    this.element = this[this.type].apply(this, this.attrs);
    if(this.element == null) return;
    
    // connect sub object to the Drawing object
    this.element.data("mother", this);
    
    //add listeners 
    this.element.drag(function(dx, dy, x, y, event){
        dx = this.data["adjust_position"].x + dx;
        dy = this.data["adjust_position"].y + dy;
        this.element.transform("t" + dx + "," + dy);
        this.data["dx"] = dx;
        this.data["dy"] = dy;
    }, function(){
        this.data["adjust_position"] = (!this.data.hasOwnProperty("dx"))?{x: 0, y:0}:{x: this.data["dx"], y:this.data["dy"]};

    }, null, this, this);
    this.element.dblclick(function(){
    }, this);
}
Drawing.prototype.line = function(paper, startX, startY, endX, endY){
    paper.setStart();
    paper.path("M" + startX +"," + startY + "L" + endX + "," + endY).attr({"stroke-width": 3});
    return paper.setFinish();
}
Drawing.prototype.circle = function(paper, centerX, centerY, radius){
    paper.setStart();
    paper.circle(centerX, centerY, radius).attr("fill", "white");
    return paper.setFinish();
}
Drawing.prototype.getData = function(key){
  return this.data[key];
}
Drawing.prototype.rectangle = function(paper, startX, startY, width, height){
    paper.setStart();
    paper.rect(startX, startY, width, height).attr({fill: "white"});
    return paper.setFinish();
}
Drawing.prototype.text = function(paper, startX, startY, text){
    paper.setStart();
    paper.text(startX, startY, text);
    return paper.setFinish();
}

Drawing.prototype.oneDimensionArray = function(paper, startX, startY, elements){
    paper.setStart();
    var unit_width = 30;
    var unit_height = 30;
    for(var i = 0; i< elements.length; i++){
        var t = paper.text(startX + i*unit_width + unit_width/2, startY, i);
        var h = t.getBBox().height;
        paper.rect(startX+ i* unit_width, startY + h, unit_width, unit_height).attr({fill: "white"});
        var t = paper.text(startX + i*unit_width + unit_width/2, startY+h+unit_height/2, elements[i]);
    }
    return paper.setFinish();
}
Drawing.prototype.binaryTree = function(paper, startX, startY, treeHeight){

    paper.setStart();
    var r = 15;
    var separtion = r;
    for(var level= treeHeight-1; level >=0 ; level--){
        temp = [];
        last_index = 0;
        if( level == treeHeight - 1){
            for(var i= 0; i< Math.pow(2, treeHeight - 1); i++){
                var node = paper.circle(startX + i * r + 2 * i * r , startY + level * 2 *r, r).attr({fill: "white"});
                temp.push(node);
            }
        }
        else{
            for(var i= 0; i< Math.pow(2, level); i++){
                var cx = (last_children[last_index].attrs.cx + last_children[last_index+1].attrs.cx)/2;
                last_index += 2;
                var node = paper.circle(cx, startY + level * 2 * r , r).attr({fill: "white"});
                temp.push(node);
            }
        }
        last_children = temp;
  }
  return paper.setFinish();
}
Drawing.prototype.updateAttrs = function(){
    this.element.attr.apply(this.element, arguments);
}

Drawing.prototype.remove = function(){
    this.element.remove();
    delete this;
}
Template.canvas.rendered = function(){
    var width = 1000;
    var height = 1000;

    var paper = Raphael(document.getElementById("canvas"), width, height);
    var background = paper.rect(0,0, width, height).attr({fill: "white", stroke: "white"});

    /*
    var drawing = new Drawing("line", [paper,10, 20, 30, 40]);
    var drawing = new Drawing("rectangle", [paper,10, 10, 100, 200]);
    var drawing = new Drawing("text", [paper,10, 10, "Helllo, world!"]); 
    var obj = new Drawing("oneDimensionArray", [paper, 10, 20, [1,2,3, 4, 5]]);
    var drawing = new Drawing("circle", [paper,70, 70, 50]);
    var rectangle = new Drawing("rectangle", [paper, 20, 20, 40, 50]);
    var binaryTree = new Drawing("binaryTree", [paper, 100, 20, 4]);
    */
    var graphs = [];

    var line = null;
    var lastDate = new Date();
    $("#lineButton").click(function(event){
        line = null;
        background.drag(function(dx, dy, x, y, event){
            x -= paper.canvas.offsetLeft;
            y -= paper.canvas.offsetTop;
            if(!line.hasOwnProperty("element")){
                line.element = new Drawing("line", [paper, line.x, line.y, x, y]);
                line.element.codeSessionId = Session.get("codeSessionId");
                SessionGraph.insert({graph: line.element});
            }
            else{
                line.element.updateAttrs("path", "M" + line.x + "," + line.y + "L" + x + "," + y);
              console.log(new Date() - lastDate);
              console.log(new Date() - lastDate > 5000);
                if (new Date() - lastDate > 5000) {
                  CodeSession.update({_id: Session.get("codeSessionId")}, {"$set": {graphs: line.element }});
                  lastDate = new Date();
                }
                console.log(line.element);
            }
        }, function(x, y , event){
            //drag Start
            x -= paper.canvas.offsetLeft;
            y -= paper.canvas.offsetTop;
            line = {x: x, y: y};
        }, function(x, y, event){
            background.undrag();
        });

    });
    
    var deleteHandler = function(event){
        paper.forEach(function(el2){
            el2.unclick(deleteHandler);
            el2.unhover(highlightHandler, unHighlightHandler);
        });
        this.data("mother").element.g.remove();
        this.data("mother").remove();
    };
    var highlightHandler = function(){
        this.data("mother").element.g = this.data("mother").element.glow({
            color: "#0FF",
            width: 100
        });
    };
    var unHighlightHandler = function(){
        this.data("mother").element.g.remove();
    }
    $("#deleteButton").click(function(event){
        paper.forEach(function(el){
            //add click listener on every object; 
            if(el == this) return;
            el.click(deleteHandler);
            el.hover(highlightHandler, unHighlightHandler, el, el);
        }, background);
    });


  var pixSize = 2, lastPoint = null, currentColor = "000", mouseDown = 0;

  //Create a reference to the pixel data for our drawing.
  var pixelDataRef = new Firebase('https://sean-firebase.firebaseio.com/');

  // Set up our canvas
  var myCanvas = document.getElementById('drawing-canvas');
  var myContext = myCanvas.getContext ? myCanvas.getContext('2d') : null;
  if (myContext == null) {
    alert("You must use a browser that supports HTML5 Canvas to run this demo.");
    return;
  }

  //Keep track of if the mouse is up or down
  myCanvas.onmousedown = function () {mouseDown = 1;};
  myCanvas.onmouseout = myCanvas.onmouseup = function () {
    mouseDown = 0, lastPoint = null;
  };

  //Draw a line from the mouse's last position to its current position
  var drawLineOnMouseMove = function(e) {
    if (!mouseDown) return;

    // Bresenham's line algorithm. We use this to ensure smooth lines are drawn
    var offset = $('canvas').offset();
    var x1 = Math.floor((e.pageX - offset.left) / pixSize - 1),
      y1 = Math.floor((e.pageY - offset.top) / pixSize - 1);
    var x0 = (lastPoint == null) ? x1 : lastPoint[0];
    var y0 = (lastPoint == null) ? y1 : lastPoint[1];
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;
    while (true) {
      //write the pixel into Firebase, or if we are drawing white, remove the pixel
      pixelDataRef.child(x0 + ":" + y0).set(currentColor === "fff" ? null : currentColor);

      if (x0 == x1 && y0 == y1) break;
      var e2 = 2 * err;
      if (e2 > -dy) {
        err = err - dy;
        x0 = x0 + sx;
      }
      if (e2 < dx) {
        err = err + dx;
        y0 = y0 + sy;
      }
    }
    lastPoint = [x1, y1];
  }
  $(myCanvas).mousemove(drawLineOnMouseMove);
  $(myCanvas).mousedown(drawLineOnMouseMove);

  // Add callbacks that are fired any time the pixel data changes and adjusts the canvas appropriately.
  // Note that child_added events will be fired for initial pixel data as well.
  var drawPixel = function(snapshot) {
    var coords = snapshot.name().split(":");
    myContext.fillStyle = "#" + snapshot.val();
    myContext.fillRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
  }
  var clearPixel = function(snapshot) {
    var coords = snapshot.name().split(":");
    myContext.clearRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
  }
  pixelDataRef.on('child_added', drawPixel);
  pixelDataRef.on('child_changed', drawPixel);
  pixelDataRef.on('child_removed', clearPixel);
}


var CocoDojoRouter = Backbone.Router.extend({
  routes: {
    ":session_id": "dojo"
  },
  dojo: function (codeSessionId) {
    Session.set("codeSessionId", codeSessionId);
  },
  setCodeSession: function(codeSessionId) {
    this.navigate(codeSessionId, true);
  }
});

Router = new CocoDojoRouter;

