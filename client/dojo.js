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

Template.dojo.rendered = function(){
        var width = 1000;
        var height = 1000;
        var paper = Raphael(document.getElementById("canvas"), width, height);
        var drawing = new Drawing("line", [paper,10, 20, 30, 40]);
        var drawing = new Drawing("rectangle", [paper,10, 10, 100, 200]); 
        var drawing = new Drawing("text", [paper,10, 10, "Helllo, world!"]); 
        var obj = new Drawing("oneDimensionArray", [paper, 10, 20, [1,2,3, 4, 5]]);

        var drawing = new Drawing("circle", [paper,70, 70, 50]);
        var rectangle = new Drawing("rectangle", [paper, 20, 20, 40, 50]);
        var binaryTree = new Drawing("binaryTree", [paper, 100, 20, 4]);
    console.log("hrere");
}


Router = new CocoDojoRouter;
