// Meteor Logics
Template.editor.codeSession = function() {
  var codeSessionId = Session.get("codeSessionId");
  return CodeSession.findOne({_id: codeSessionId});
};

// Manual Manipulation
var editorInstance = ace.edit("editor");
editorInstance.setTheme("ace/theme/monokai");
editorInstance.getSession().setMode("ace/mode/javascript");