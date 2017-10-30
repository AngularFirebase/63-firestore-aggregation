const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.aggregateComments = functions.firestore
    .document('posts/{postId}/comments/{commentId}')
    .onWrite(event => {


    // var commentId = event.data.data();
    const commentId = event.params.commentId; 
    const postId = event.params.postId;
    
    // ref to the parent document
    const docRef = admin.firestore().collection('posts').doc(postId)
    
    // get all comments and aggregate
    return docRef.collection('comments').orderBy('createdAt', 'desc')
         .get()
         .then(querySnapshot => {

            // get the total comment count
            const commentCount = querySnapshot.size

            const recentComments = []

            // add data from the 5 most recent comments to the array
            querySnapshot.forEach(doc => {
                recentComments.push( doc.data() )
            });

            recentComments.splice(5)

            // record last comment timestamp
            const lastActivity = recentComments[0].createdAt

            // data to update on the documemnt
            const data = { commentCount, recentComments, lastActivity }
            
            // run update
            return docRef.update(data)
         })
         .catch(err => console.log(err) )
});