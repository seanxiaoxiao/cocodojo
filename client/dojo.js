/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 4/12/13
 * Time: 11:03 PM
 * To change this template use File | Settings | File Templates.
 */


Template.dojo.codeSession = function () {
  var codeSessionId = Session.get("codeSessionId");
  return CodeSession.findOne({_id:codeSessionId});
};

var codeSessionHandle = null;

Deps.autorun(function () {
  var codeSessionId = Session.get('codeSessionId');
  if (codeSessionId) {
    codeSessionHandle = Meteor.subscribe('codeSession', codeSessionId);
  }
  else {
    codeSessionHandle = null;
  }
});


var Drawing = function (type, options) {
  this.type = type;
  this.options = options;
  this.attrs = {}
  this.data = {};
  this.init();
  return this;
}

Drawing.prototype.init = function () {
  this.element = this[this.type].apply(this, this.options);
  if (this.element == null) return;

  // connect sub object to the Drawing object
  this.element.data("mother", this);

  //add listeners
  this.element.drag(function (dx, dy, x, y, event) {
    dx = this.data["adjust_position"].x + dx;
    dy = this.data["adjust_position"].y + dy;
    this.element.transform("t" + dx + "," + dy);
    this.data["dx"] = dx;
    this.data["dy"] = dy;
  }, function () {
    this.data["adjust_position"] = (!this.data.hasOwnProperty("dx")) ? {x:0, y:0} : {x:this.data["dx"], y:this.data["dy"]};

  }, null, this, this);
  this.element.dblclick(function () {
  }, this);
}
Drawing.prototype.simplify = function () {
  var obj = {};
  obj.type = this.type;
  obj.attrs = {};
  for (var key in this.attrs) {
    obj.attrs.key = this.attrs[key];
  }
  obj.options = [];
  for (var i = 1; i < this.options.length; i++) {
    obj.options.push(this.options[i]);
  }
  return obj;
}
Drawing.prototype.line = function (paper, startX, startY, endX, endY) {
  paper.setStart();
  paper.path("M" + startX + "," + startY + "L" + endX + "," + endY).attr({"stroke-width":3});
  return paper.setFinish();
}
Drawing.prototype.circle = function (paper, centerX, centerY, radius) {
  paper.setStart();
  paper.circle(centerX, centerY, radius).attr("fill", "white");
  return paper.setFinish();
}
Drawing.prototype.getData = function (key) {
  return this.data[key];
}
Drawing.prototype.rectangle = function (paper, startX, startY, width, height) {
  paper.setStart();
  paper.rect(startX, startY, width, height).attr({fill:"white"});
  return paper.setFinish();
}
Drawing.prototype.text = function (paper, startX, startY, text) {
  paper.setStart();
  paper.text(startX, startY, text);
  return paper.setFinish();
}

Drawing.prototype.oneDimensionArray = function (paper, startX, startY, elements) {
  paper.setStart();
  var unit_width = 30;
  var unit_height = 30;
  for (var i = 0; i < elements.length; i++) {
    var t = paper.text(startX + i * unit_width + unit_width / 2, startY, i);
    var h = t.getBBox().height;
    paper.rect(startX + i * unit_width, startY + h, unit_width, unit_height).attr({fill:"white"});
    var t = paper.text(startX + i * unit_width + unit_width / 2, startY + h + unit_height / 2, elements[i]);
  }
  return paper.setFinish();
}
Drawing.prototype.binaryTree = function (paper, startX, startY, treeHeight) {

  paper.setStart();
  var r = 15;
  var separation = r;
  for (var level = treeHeight - 1; level >= 0; level--) {
    var temp = [];
    var last_index = 0;
    if (level == treeHeight - 1) {
      for (var i = 0; i < Math.pow(2, treeHeight - 1); i++) {
        var node = paper.circle(startX + i * r + 2 * i * r, startY + level * 2 * r, r).attr({fill:"white"});
        temp.push(node);
      }
    }
    else {
      for (var i = 0; i < Math.pow(2, level); i++) {
        var cx = (last_children[last_index].attrs.cx + last_children[last_index + 1].attrs.cx) / 2;
        last_index += 2;
        var node = paper.circle(cx, startY + level * 2 * r, r).attr({fill:"white"});
        temp.push(node);
      }
    }
    last_children = temp;
  }
  return paper.setFinish();
}
Drawing.prototype.updateAttrs = function (key, value) {
  this.element.attr(key, value);
  this.attrs[key] = value;
  return this;
}
Drawing.prototype.remove = function () {
  this.element.remove();
  delete this;
}

Template.canvas.rendered = function () {
  var dataref = new firebase('https://sean-firebase.firebaseio.com/');
  var drawgraph = function (snapshot) {
    var graphobj = snapshot.val();
    console.log(graphobj);
  };

  dataRef.on('child_added', drawGraph);

  var width = 1000;
  var height = 1000;

  var paper = Raphael(document.getElementById("canvas"), width, height);
  var background = paper.rect(0, 0, width, height).attr({fill:"white", stroke:"white"});

  var graphs = [];

  var line = null;
  var lastDate = new Date();
  $("#lineButton").click(function (event) {
    line = null;
    background.drag(function (dx, dy, x, y, event) {
      x -= paper.canvas.offsetLeft;
      y -= paper.canvas.offsetTop;
      if (!line.hasOwnProperty("element")) {
        line.element = new Drawing("line", [paper, line.x, line.y, x, y]);
      }
      else {
        line.element.updateAttrs("path", "M" + line.x + "," + line.y + "L" + x + "," + y);
      }
    }, function (x, y, event) {
      //drag Start

      x -= paper.canvas.offsetLeft;
      y -= paper.canvas.offsetTop;
      line = {x:x, y:y};
    }, function (x, y, event) {
      var newPushRef = dataRef.push();
      newPushRef.set(line.element.simplify());
    });

    var deleteHandler = function (event) {
      paper.forEach(function (el2) {
        el2.unclick(deleteHandler);
        el2.unhover(highlightHandler, unHighlightHandler);
      });
      console.log(this.data("mother"));
      this.data("mother").element.g.remove();
      this.data("mother").remove();
    };

    var highlightHandler = function () {
      this.data("mother").element.g = this.data("mother").element.glow({
        color:"#0FF",
        width:100
      });
    };
    var unHighlightHandler = function () {
      this.data("mother").element.g.remove();
    }
    var circle = null;
    $("#circleButton").click(function () {
      var handler = function (dx, dy, x, y, event) {
        x -= paper.canvas.offsetLeft;
        y -= paper.canvas.offsetTop;
        var r = Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2));
        if (!circle.hasOwnProperty("element")) {
          circle.element = new Drawing("circle", [paper, circle.x, circle.y, r]);
        }
        else {
          circle.element.updateAttrs("r", r);
        }
      };
      background.drag(handler, function (x, y) {
        //drag start
        x -= paper.canvas.offsetLeft;
        y -= paper.canvas.offsetTop;
        circle = {x:x, y:y};
      }, function () {
        //drag end
        circle = null;
        background.undrag(handler);
      });
    });
    var square = null;
    $("#squareButton").click(function () {
      var handler = function (dx, dy, x, y, event) {
        x -= paper.canvas.offsetLeft;
        y -= paper.canvas.offsetTop;
        if (!square.hasOwnProperty("element")) {
          square.element = new Drawing("rectangle", [paper, Math.min(x, square.x), Math.min(y, square.y), Math.abs(x - square.x), Math.abs(y - square.y)]);
        }
        else {
          if (x - square.x < 0) {
            square.element.updateAttrs("x", x);
          }
          if (y - square.y < 0) {
            square.element.updateAttrs("y", y);
          }
          square.element.updateAttrs("width", Math.abs(x - square.x)).updateAttrs("height", Math.abs(y - square.y));
        }
      };
      background.drag(handler, function (x, y, event) {
        //Drag Start
        x -= paper.canvas.offsetLeft;
        y -= paper.canvas.offsetTop;
        square = {x:x, y:y};

      }, function (x, y, event) {
        //Drag End
        background.undrag(handler);
        square = null;
      }, background, background);
    });
  });
  oneDimensionArray = null;
  $("#arrayButton").click(function (event) {
    var handler = function (event, x, y) {
      x -= paper.canvas.offsetLeft;
      y -= paper.canvas.offsetTop;
      var element = new Drawing("oneDimensionArray", [paper, x, y, [1, 2, 3, 4, 5]]);
      background.unclick(handler);
    };
    background.click(handler);
  });

  $("#trashButton").click(function (event) {
    paper.forEach(function (el) {
      //add click listener on every object;
      if (el == this) return;
      el.click(deleteHandler);
      el.hover(highlightHandler, unHighlightHandler, el, el);
    }, background);
  });
}
var CocoDojoRouter = Backbone.Router.extend({

  routes:{
    ":session_id":"dojo"
  },
  dojo:function (codeSessionId) {
    Session.set("codeSessionId", codeSessionId);
  },
  setCodeSession:function (codeSessionId) {
    this.navigate(codeSessionId, true);
  }
});
Router = new CocoDojoRouter;

