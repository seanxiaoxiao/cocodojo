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
            $("#editorContainer").fadeIn(1, function() {
              $(".media").fadeOut(1);
            })
          } else {
              $(toggle).addClass("toggle-off");
            $("#editorContainer").fadeOut(1, function() {
              $(".media").fadeIn(1);
            })
          }
      };

      checkToggleState();

      radio.eq(0).click(function() {
        $(toggle).removeClass("toggle-off");
        $(".media").fadeOut(618, function() {
          $("#editorContainer").fadeIn(618);
        });
      });

      radio.eq(1).click(function() {
        console.log("xxxxx");
        $(toggle).addClass("toggle-off");
        $("#editorContainer").fadeOut(618, function() {
          $(".media").fadeIn(618);
        });
      });
    };

    $(".toggle").each(function(index, toggle) {
        toggleHandler(toggle);
    });
  }
}
