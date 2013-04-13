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
  var allConversation = Conversation.find({codeSessionId: codeSessionId});
  var result = "";
  for (var i = 0; i < allConversation.length; i++) {
    console.log(allConversation[i].message);
    result += allConversation[i].message + "\n";
  }
  return
}


Template.conversations.events = {
  'click #sendBtn' : function () {
    var text = $("#message").val();
    console.log(text);
    var codeSessionId = Session.get("codeSessionId");
    Conversation.insert({message: text, codeSessionId: codeSessionId});
  }
}

