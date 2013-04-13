
if (Meteor.isClient) {
  CodeSession = new Meteor.Collection("CodeSessions");
  cocodojo = {};
  Meteor.startup(function () {
    Backbone.history.start({pushState: true});
    $(document).ready(function() {
      if (window.location.pathname == "/") {
        var codeSessionId = CodeSession.insert({name: "New Dojo"});
        Router.navigate(codeSessionId, false);
      }
    });
  });

}
