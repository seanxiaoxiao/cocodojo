// Meteor Logics
Template.editor.codeSession = function() {
  var codeSessionId = Session.get("codeSessionId");
  return CodeSession.findOne({_id: codeSessionId});
};

// Manual Manipulation
Template.editor.rendered = function() {
  editorInstance = ace.edit("editorInstance");
  editorInstance.setTheme("ace/theme/monokai");
  editorInstance.getSession().setMode("ace/mode/javascript");

};