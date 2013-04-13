
if (Meteor.isClient) {
  CodeSession = new Meteor.Collection("CodeSessions");

  Template.actions.greeting = function () {
    return "Welcome to cmu_hackathon.";
  };

  Template.actions.events({
    'click #create' : function () {
      // template data, if any, is available in 'this'
    }
  });

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
