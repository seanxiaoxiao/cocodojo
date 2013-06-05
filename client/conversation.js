/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 4/13/13
 * Time: 1:47 AM
 * To change this template use File | Settings | File Templates.
 */

Template.conversations.all = function() {
  var codeSessionId = Session.get("codeSessionId");
  var codeSession = CodeSession.findOne({_id: codeSessionId});
  if (codeSession && codeSession.messages) {
    var result = "";
    for (var i = 0; i < codeSession.messages.length; i++) {
      result += codeSession.messages[i] + "\n";
    }
    return result;
  }
}

Template.conversations.rendered = function() {
  cocodojo.conversation = cocodojo.conversation || {};
  if (cocodojo.conversation.name == null) {
    cocodojo.conversation.name = /*prompt("Please input your user name.") */ false|| "Anonymous";
  }
};


Template.conversations.events = {

  'click #sendBtn': function() {
    if ($("#message").val() == "") {
      return;
    }
    var text = cocodojo.conversation.name + ": " + $("#message").val();
    CodeSession.update({_id: Session.get("codeSessionId")}, {"$push": {messages: text}});
    $("#message").val("");
  },
  'keydown #message': function(evt) {
    if (evt.which === 13) {
      if ($("#message").val() == "") {
        return;
      }
      var text = cocodojo.conversation.name + ": " + $("#message").val();
      CodeSession.update({_id: Session.get("codeSessionId")}, {"$push": {messages: text}});
      $("#message").val("");
    }
  }
}
