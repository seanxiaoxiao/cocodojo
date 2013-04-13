
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
      $("body").on("ondragover", function(e) {
        alert("Xvx");
        e.preventDefault();
        return false;
      });
      $("body").on("drop", function() {
        e.preventDefault();
        return false;
      });
      $("body").on("dropover", function() {
        e.preventDefault();
        return false;
      });
    });
  });


}
