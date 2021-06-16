// Load the members data
const loadMembers = () => {
    // Create a query that has no limtis and listen to changes
    let query = firebase.firestore()
        .collection('members')
        .orderBy('timestamp','desc');

    // Start listening to the query and react when changes is made
    query.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "removed") {
                deleteMembers(change.doc.id);
            } else {
                let newMember = change.doc.data();
                displayMember(change.doc.id, newMember.name,newMember.info,newMember.imageUrl,newMember.timestamp);
            }
        })
    })
}



// Adding to the child
createAndInsertMember = (id, timestamp) => {
    // Creating a container to add the template
    let div_container = document.createElement("div");

    // InnerHTML into div_container
    div_container.innerHTML = member_template;

    let div = div_container.firstChild;

    // Setting the id and timestamp
    div.setAttribute('id',id);
    
    timestamp = timestamp ? timestamp.toMillis() : Date.now();
    div.setAttribute('timestamp',timestamp);

    // Accessing to chidlren inside the list
    const existingMemberList = members_list.children;
    if (existingMemberList.length == 0) {
        members_list.appendChild(div);
    } else {
        let memberListNode = existingMemberList[0];

        while(memberListNode) {
            const memberListNodeTime = memberListNode.getAttribute('timestamp');

            if (!memberListNodeTime) {
                throw new Error(
                    `Child ${memberListNode.id} has no 'timestamp' attribute`
                  );
            }

            if (memberListNodeTime > timestamp) {
                break;
            }

            memberListNode = memberListNode.nextSibling;
        }

        members_list.insertBefore(div,memberListNode);
    }
    
    return div;
}

// Creating a template for member
const member_template = 
    `<div class = "row">` +
        `<div class="column left">` +
            `<div class="team-information">` +
                `<p class = "member-task"></p>` +
            `</div>` +
        `</div>` +
        `<div class="column right">` +
            `<div class="team-name-image">` +
                `<h4 class="member-name"></h4>` +
                `<img src= "" class= "member-image"> </img>` +
            `</div>` +
        `</div>` +
    `</div>`

// Display the content
const displayMember = (id, name, info, imageUrl, timestamp) => {
    let div = document.getElementById(id) || createAndInsertMember(id, timestamp);

    // display the content
    div.querySelector('.member-task').textContent = info;
    div.querySelector('.member-name').textContent = name;
    div.querySelector('.member-image').setAttribute('src',imageUrl);


}

// Delete Member
const deleteMember = (id) => {
    const div = document.getElementById(id);

    if (div) {
        members_list.removeChild(div);
    }
}

// Access to the element in the list
let members_list = document.getElementById('members-list');


// Start the loading process
loadMembers();