/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 4/13/13
 * Time: 1:47 AM
 * To change this template use File | Settings | File Templates.
 */

Coversation = new Meteor.Collection("Conversations");

Template.conversations.all = function() {
  var codeSessionId = Session.get("codeSessionId");
  return Conversation.find({codeSessionId: codeSessionId});
}


Template.conversations.event = {
  'click #send' : function () {
    var text = $("#send-input").text();
    var codeSessionId = Session.get("codeSessionId");
    Conversation.insert({message: text, codeSessionId: codeSessionId});
  }
}

