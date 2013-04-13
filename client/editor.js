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
  cocodojo.editor.editorInstance.setTheme("ace/theme/monokai");
  cocodojo.editor.editorInstance.getSession().setMode("ace/mode/javascript");

  var codeSession;
  setTimeout( function(){ codeSession = new Template.editor.codeSession(); console.log(codeSession);}, 1000);
  

  // Manual Manipulation
  cocodojo.editor.editorInstance.getSession().getDocument().on("change", function(e){
    if(cocodojo.editor.updateDue){ return 0; }
    else{
      //console.log(e);
      CodeSession.update(
        {_id: Session.get("codeSessionId")}, 
        /*{ $set: 
          { newDelta: e.data,//cocodojo.editor.editorInstance.getValue(),
            sender_uid: cocodojo.editor.local_uid }
        }*/
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
  //console.log(mongoQuery.fetch());
  //setTimeout( function(){
  mongoQuery.observe({
    changed : function(newDoc, oldIndex, oldDoc) {
      /*if(newDoc.sender_uid !== cocodojo.editor.local_uid){
        //console.log(newDoc.newDelta);
        cocodojo.editor.updateDue = true;
        cocodojo.editor.editorInstance.getSession().getDocument().applyDeltas([newDoc.newDelta]);
      }*/
      console.log(newDoc);

      var newDocLength = newDoc.Deltas.length;
      var pendDeltas = [];
      for(var i=cocodojo.editor.currentDelta; i<newDocLength; ++i){
      console.log(i);
        if(newDoc.Deltas[i].sender_uid !== cocodojo.editor.local_uid){
          pendDeltas.push(newDoc.Deltas[i].delta);
        }
      }
      //console.log(pendDeltas);
      
      if(pendDeltas.length > 0){
        cocodojo.editor.updateDue = true;
        cocodojo.editor.editorInstance.getSession().getDocument().applyDeltas(pendDeltas);
      }
      cocodojo.editor.currentDelta = newDocLength;
      cocodojo.editor.updateDue = false;

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
};
