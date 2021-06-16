const addCommentToFirestore = () => {
    if (commentTitleInput.value && commentContentTextAreaInput.value) {
        return firebase.firestore().collection("news").doc(new_id).collection("comments").add({
            comment_title: commentTitleInput.value,
            comment_body: commentContentTextAreaInput.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(result => {
            document.getElementById('user-comment-created').reset();
        })
        .catch(err => {
            console.log(`Add Comment Error: ${err}`)
        })
    }
}

// Connecting to the all the element of the comment section
const commentTitleInput = document.getElementById("comment-title-input");
const commentContentTextAreaInput = document.getElementById("comment-content-textArea");
const sendCommentButton = document.getElementById('send-comment');

// Checking the connection to the comment
sendCommentButton.addEventListener('click',addCommentToFirestore);

