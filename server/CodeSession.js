/**
 * Created with JetBrains WebStorm.
 * User: xiaoxiao
 * Date: 4/12/13
 * Time: 9:46 PM
 * To change this template use File | Settings | File Templates.
 */

CodeSession = new Meteor.Collection("CodeSessions");

// Publish all items for requested list_id.
Meteor.publish('codeSession', function (codeSessionId) {
  return CodeSession.find({_id: codeSessionId});
});
