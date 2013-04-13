
if (Meteor.isClient) {
  CodeSession = new Meteor.Collection("CodeSessions");

  Template.actions.greeting = function () {
    return "Welcome to cmu_hackathon.";
  };

  Template.actions.events({
    'click #create' : function () {
      // template data, if any, is available in 'this'
      var id = CodeSession.insert({name: "New Dojo"});
      Router.setCodeSession(id);
    }
  });

  Meteor.startup(function () {
    Backbone.history.start({pushState: true});
  });
}
