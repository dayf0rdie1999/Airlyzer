
// Load The Comments
function loadComments() {
    let commentQuery = firebase.firestore().collection("news").doc(new_id).collection("comments").orderBy('timestamp','desc');

    commentQuery.onSnapshot(snapShot => {
        snapShot.docChanges().forEach(change => {
            if (change.type === "removed") {
                deleteComment(change.doc.id);
            } else {
                let newComment = change.doc.data();
                displayComment(change.doc.id, newComment.comment_title,newComment.comment_body,newComment.timestamp);
            }
        })
    })
}

// Create a template for the comment section
const comment_template = 
    `<div class="comment-title-content-timestamp-container">` +

        `<div class ="comment-title-timestamp-container">` +

            `<div id="comment-title-container">` +
                `<h4 id="comment-title"></h4>` +
            `</div>`+


            `<div id="comment-timestamp-container">` +
                `<p id="comment-timestamp"></p>` +
            `</div>`+


        `</div>` +
        
        `<div id="comment-content-container">` +
            `<p id="comment-content"> </p>`+
        `</div>`+

    `</div>`

function createAndInsertComment(id,timestamp) {
    // Create Element
    const div_container = document.createElement("div");

    div_container.innerHTML = comment_template;

    // Getting the first element of the first container
    let div = div_container.firstChild;

    // Assign the id the timestamp to the element
    div.setAttribute('id',id);

    // Adding the timestamp
    timestamp = timestamp ? timestamp.toMillis() : Date.now();
    div.setAttribute('timestamp',timestamp);

    // Reorganizing the list to order the comment
    const existingCommentList = comments_list.children;
    if (existingCommentList.length == 0) {
        comments_list.appendChild(div);
    } else {
        let commentListNode = existingCommentList[0];

        while(commentListNode) {
            let commentListNodeTime = commentListNode.getAttribute('timestamp');

            if (!commentListNodeTime) {
                throw new Error(
                    `Child ${commentListNode.id} has no 'timestamp' attribute`
                  );
            }

            if (commentListNodeTime > timestamp){
                break;
            }

            commentListNode = commentListNode.nextSibling;
        }

        comments_list.insertBefore(div,commentListNode);
    }

    return div;
}

function displayComment(id,comment_title,comment_body,timestamp) {
    const div = document.getElementById(id) || createAndInsertComment(id,timestamp);

    // Convert the firebase timestamp to date and to string
    var date_str = timestamp.toDate().toString();
    
    // Split the string
    let date_str_array = date_str.split('(');

    // Adding the content into the div
    div.querySelector('#comment-title').textContent = comment_title;
    div.querySelector('#comment-timestamp').textContent = date_str_array[0];
    div.querySelector('#comment-content').textContent = comment_body;

}

// Connecting to the display comment div
const comments_list = document.getElementsByClassName('user-comment-list')[0];

// Loading the data
loadComments()
