
if (Meteor.isClient) {
  CodeSession = new Meteor.Collection("CodeSessions");
  SessionGraph = new Meteor.Collection("SessionGraphs");
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

  Template.dojo.rendered = function() {
    $(".toggle").each(function(index, toggle) {
        toggleHandler(toggle);
    });
  }

}
