
if (Meteor.isClient) {
  CodeSession = new Meteor.Collection("CodeSessions");

  Meteor.startup(function () {
    Backbone.history.start({pushState: true});
    $(document).ready(function() {
      if (window.location.pathname == "/") {
        var codeSessionId = CodeSession.insert({name: "New Dojo"});
        Router.navigate(codeSessionId, false);
      }
    });
  });

  Deps.afterFlush(function() {

    var editorInstance = ace.edit("editorInstance");
    editorInstance.setTheme("ace/theme/monokai");
    editorInstance.getSession().setMode("ace/mode/javascript");
  });
}
