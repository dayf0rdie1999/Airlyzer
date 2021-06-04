

// Function to Retrieve the data on the server
export const loadNews = () => {
    // Create the query to load the last 4 news and listen for new ones
    let query = firebase.firestore()
    .collection('news')
    .orderBy('timestamp','desc')
    .limit(4);

    // Start listening to the query
    query.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "removed") {
                deleteMessage(change.doc.id);
            } else {
                let a_new = change.doc.data();
                displayNew(change.doc.id,a_new.content,a_new.snippet,a_new.title,a_new.timestamp,a_new.name);
            }
        })
    })
}

const new_index_page_template = 
    `<div class= 'new-container'>`  +
        `<a class= "news-link" href = "">` +
            `<div class = 'title-name-container'>` +
                `<div class= "news-title"></div>` +
                `<div class= "name"></div>` +
            `</div>`+
            `<div class= "news-snippet"></div>` +
        `</a>` + 
    `</div>`;

// Create a function to insert and sort the news
const createAndInsertNews = (id,timestamp) => {
    // Create a container
    const a_new_container = document.createElement('div');

    // Putting the template in the container
    a_new_container.innerHTML = new_index_page_template;

    // getting the first element of the container
    let div = a_new_container.firstChild;
    
    // Access it the id and the timestamp
    div.setAttribute('id',id);

    // accessing to the timestamp or create one if the timestamp doesn't exist
    timestamp = timestamp ? timestamp.toMillis() : Date.now();
    div.setAttribute('timestamp',timestamp);
    
    // Getting all the existing news
    var existingNews = news_list.children;
    
    // Condition whether the length of the object is 0 or not
    if (existingNews.length === 0) {
        // just insert the message
        news_list.appendChild(div);
    } else {

        // Getting the first element of the message
        let newListNode = existingNews[0];

            // Getting the timestamp attribute of the message list
            while(newListNode) {
                // Getting the timestamp  
                let newListNodeTime = newListNode.getAttribute('timestamp');

                // Condition if there is no timestamp
                if (!newListNodeTime) {
                    // Throwing the error
                    throw new Error(
                        `Child ${newListNode.id} has no 'timestamp' attribute`
                      );
                }
                    

                // Condition if the first element timestamp has greater time
                if (newListNodeTime > timestamp) {
                    // Breaking the while loop
                    break;
                }
                    
                // going to the next element
                newListNode = newListNode.nextSibling;
            }
        

        // Putting the new before that element
        news_list.insertBefore(div,newListNode);

    }

    return div;
}

//Display the news on the screen
const displayNew = (id, content,snippet,title,timestamp,name) => {
    
    let div = document.getElementById(id) || createAndInsertNews(id, timestamp);

    // Putting the content in the div element
    div.querySelector('.news-link').setAttribute('href',`/news/${id}`);
    div.querySelector('.news-title').textContent = `${title}`;
    div.querySelector('.news-snippet').textContent = `${snippet}`;
    div.querySelector('.name').textContent = `Author: ${name}`;

}


// Function to retrieve the update data on the server
export const loadUpdates = () => {

    // Retreive the data ordered by timestamp and limited number
    let query = firebase.firestore.collection('updates').orderBy('timestamp','desc').limit(4);

    // Start listening to the query
    query.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'removed') {
                deleteUpdate(change.doc.id);
            } else {
                let update = change.doc.data();
                displayUpdates()
            }
        })
    })
}

const update_index_page_template =
    `<div class = 'update_container'>` +
        `<a href=""></a>` +
    `</div>`


// Function to create and insert the updates on the update list
const createAndInsertUpdates = (id, templates) => {
    let container_div = document.createElement("div");

    // Putting the template into the container_div
    container_div.innerHTML = update_index_page_template;

    // Access to the div update-container 
    let div = container_div.firstChild;

    // set Id and timestamp attribute to the object
    div.setAttribute("id",id);

    // Getting the timestamp or create one if not existed
    timestamp = timestamp ? timestamp.toMillis() : 
}

// Function to display updates
const dispalyUpdates = (id,update_link,update_content) => {
    // Either getting the component through id or create and insert into the udpate list
    var div = document.getElementById(id) | createAndInsertUpdates(id, template);
}

// Accessing to the news
const news_list = document.getElementById('news');
const updates_list = document.getElementById('updates');






