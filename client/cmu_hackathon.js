
if (Meteor.isClient) {
  CodeSession = new Meteor.Collection("CodeSessions");

  Template.index.greeting = function () {
    return "Welcome to cmu_hackathon.";
  };

  Template.index.events({
    'click #create' : function () {
      // template data, if any, is available in 'this'
      var id = CodeSession.insert({});
      Meteor.publish("newSession", function() {
        return CodeSession.find({_id: id});
      });
    }
  });
}
