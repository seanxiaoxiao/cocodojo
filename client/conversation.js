/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 4/13/13
 * Time: 1:47 AM
 * To change this template use File | Settings | File Templates.
 */

Template.conversations.all = function() {
  var codeSessionId = Session.get("codeSessionId");
<<<<<<< HEAD
  var allConversation = Conversation.find().fetch();
  var result = "";
  for (var i = 0; i < allConversation.length; i++) {
    result += allConversation[i].message + "\n";
    console.log(result);
  }
  return result;
=======
  var codeSession = CodeSession.findOne({_id: codeSessionId});
  if (codeSession && codeSession.messages) {
    var result = "";
    for (var i = 0; i < codeSession.messages.length; i++) {
      result += codeSession.messages[i] + "\n";
    }
    return result;
  }
>>>>>>> 2aa9bd62a06b1ec4ff6b7a053b655604e83d469a
}


Template.conversations.events = {
<<<<<<< HEAD
  'click #sendBtn' : function () {
    var text = $("#message").val();
    var codeSessionId = Session.get("codeSessionId");
    var id = Conversation.insert({message: text, codeSessionId: codeSessionId});
=======
  'click #sendBtn': function() {
    var text = "Anonymous: " + $("#message").val();
    CodeSession.update({_id: Session.get("codeSessionId")}, {"$push": {messages: text}});
    $("#message").val("");
  },
  'keydown #message': function(evt) {
    if (evt.which === 13) {
      var text = "Anonymous: " + $("#message").val();
      CodeSession.update({_id: Session.get("codeSessionId")}, {"$push": {messages: text}});
      $("#message").val("");
    }
>>>>>>> 2aa9bd62a06b1ec4ff6b7a053b655604e83d469a
  }
}

