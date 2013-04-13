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
  if (codeSessionId)
    codeSessionHandle = Meteor.subscribe('codeSession', codeSessionId);
  else
    codeSessionHandle = null;
});

var CocoDojoRouter = Backbone.Router.extend({
  routes: {
    ":session_id": "main"
  },
  main: function (codeSessionId) {
    Session.set("codeSessionId", codeSessionId);
  },
  setCodeSession: function (codeSessionId) {
    this.navigate(codeSessionId, true);
  }
});

Router = new CocoDojoRouter;
