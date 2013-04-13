
if (Meteor.isClient) {
  CodeSession = new Meteor.Collection("CodeSessions");
  cocodojo = {};

  Meteor.startup(function () {
    Backbone.history.start({pushState: true});
    $(document).ready(function() {
      if (window.location.pathname == "/") {
        var codeSessionId = CodeSession.insert({name: "New Dojo"});
        Router.navigate(codeSessionId, false);
      }
    });
  });

  Template.dojo.rendered = function() {
    var toggleHandler = function(toggle) {
    
      var toggle = toggle;
      var radio = $(toggle).find("input");

      var checkToggleState = function() {
          if (radio.eq(0).is(":checked")) {
              $(toggle).removeClass("toggle-off");
          } else {
              $(toggle).addClass("toggle-off");
          }
      };

      checkToggleState();

      radio.eq(0).click(function() {
          $(toggle).toggleClass("toggle-off");
      });

      radio.eq(1).click(function() {
          $(toggle).toggleClass("toggle-off");
      });
    };

    $(".toggle").each(function(index, toggle) {
        toggleHandler(toggle);
    });
  }

}
