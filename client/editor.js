// Meteor Logics
Template.editor.codeSession = function() {
  var codeSessionId = Session.get("codeSessionId");
  return CodeSession.findOne({_id: codeSessionId});
};

Template.editor.events({

  'dropover #editorInstance' : function(e, t) {
    e.preventDefault();
  },

  'drop #editorInstance' : function(e, t) {
    e.preventDefault();
  }

});

Template.editor.rendered = function() {
  cocodojo.editor = {};
  cocodojo.editor.updateDue = false;
  cocodojo.editor.disableInput = false;
  cocodojo.editor.currentDelta = 0;
  cocodojo.editor.local_uid = (((1+Math.random())*0x10000)|0).toString(16).slice(1);
  cocodojo.editor.editorInstance = ace.edit("editorInstance");
  //cocodojo.editor.editorInstance.setFontSize(14);
  cocodojo.editor.editorInstance.setTheme("ace/theme/monokai");
  
  cocodojo.editor.editorInstance.getSession().setMode("ace/mode/javascript");

  cocodojo.editor.update = function(deltas){
    if(deltas === undefined){ return false; }
    var deltaLength = deltas.length;
    var pendDeltas = [];
    for(var i=cocodojo.editor.currentDelta; i<deltaLength; ++i){
      if(deltas[i].sender_uid !== cocodojo.editor.local_uid){
        pendDeltas.push(deltas[i].delta);
      }
    }
      
    if(pendDeltas.length > 0){
      cocodojo.editor.updateDue = true;
      cocodojo.editor.editorInstance.getSession().getDocument().applyDeltas(pendDeltas);
    }
    cocodojo.editor.currentDelta = deltaLength;
    cocodojo.editor.updateDue = false;
  }

  var codeSession;
  setTimeout( function(){
    codeSession = new Template.editor.codeSession();
    cocodojo.editor.update(codeSession.Deltas);
  }, 1000);
  

  // Manual Manipulation
  cocodojo.editor.editorInstance.getSession().getDocument().on("change", function(e){
    if(cocodojo.editor.updateDue){ return 0; }
    else{
      CodeSession.update(
        {_id: Session.get("codeSessionId")}, 
        { $push:
          {
            Deltas: { delta: e.data, sender_uid: cocodojo.editor.local_uid }
          }
        }
      );
    }
  });

  setTimeout( function(){
    var mongoQuery = CodeSession.find({_id: Session.get("codeSessionId")});
    mongoQuery.observe({
      changed : function(newDoc, oldIndex, oldDoc) {
        cocodojo.editor.update(newDoc.Deltas);
      }
    });
  }, 1000);



  $('#editorInstance').parent().css('padding', '1em');

  $('#editorInstance').on('keydown', function(e){
    if(cocodojo.editor.disableInput){ e.preventDefault(); }
    else{
      cocodojo.editor.disableInput = true;
      setTimeout(function(){ cocodojo.editor.disableInput = false; }, 50);
    }
  });

  $('#editorLang').on('change', function(e){
    cocodojo.editor.editorInstance.getSession().setMode("ace/mode/"+$(this).val());
  });

  $('#editorTheme').on('change', function(e){
    cocodojo.editor.editorInstance.setTheme("ace/theme/"+$(this).val());
  });


  // Drag and Drop File function
  $('#editorInstance').on('ondragover',function() {
    e.stopPropagation();
    return false;
  });
  $('#editorInstance').on('ondragend',function() {
    e.stopPropagation();
    return false;
  });
  $('#editorInstance').on('ondrop',function(e) {
    if (e.preventDefault) e.preventDefault();
    e.stopPropagation();
    var file = e.dataTransfer.files[0], reader = new FileReader();
    reader.onload = function (event) {
      console.log(event.target);
    };
    return false;
  });

  filepicker.setKey("A5FhMuKiRViDaQtnHUotPz");
  filepicker.makeDropPane($('#editorInstance')[0], {
    multiple: true,
    dragEnter: function() {
//      $("#exampleDropPane").html("Drop to upload").css({
//      });
    },
    dragLeave: function() {
      $(".bar").css("width", "0%");
    },
    onSuccess: function(fpfiles) {
//      $("#exampleDropPane").text("Done, see result below");
      filepicker.read(fpfiles[0], function(data){
        var extHash = {
          'js' : 'javascript',
          'c' : 'c_cpp',
          'cpp' : 'c_cpp',
          'java' : 'java',
          'ruby' : 'ruby',
          'html' : 'html'
        };
        var extName = fpfiles[0].filename.split('.').pop();
        cocodojo.editor.editorInstance.getSession().setMode("ace/mode/"+extHash[extName]);
        $('#editorLang option[value="'+extHash[extName]+'"]').attr('selected','');
        cocodojo.editor.editorInstance.setValue(data);
        cocodojo.editor.editorInstance.moveCursorTo(0, 0);
      });
    },
    onError: function(type, message) {
//      $("#localDropResult").text('('+type+') '+ message);
    },
    onProgress: function(percentage) {

      $(".bar").css("width", percentage + "%");
    }
  });
};
