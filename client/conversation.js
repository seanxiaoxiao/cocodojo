/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 4/13/13
 * Time: 1:47 AM
 * To change this template use File | Settings | File Templates.
 */

Conversation = new Meteor.Collection("Conversations");

Template.conversations.all = function() {
  var codeSessionId = Session.get("codeSessionId");
  var allConversation = Conversation.find().fetch();
  var result = "";
  for (var i = 0; i < allConversation.length; i++) {
    result += allConversation[i].message + "\n";
    console.log(result);
  }
  return result;
}


Template.conversations.events = {
  'click #sendBtn' : function () {
    var text = $("#message").val();
    var codeSessionId = Session.get("codeSessionId");
    var id = Conversation.insert({message: text, codeSessionId: codeSessionId});
  }
}

