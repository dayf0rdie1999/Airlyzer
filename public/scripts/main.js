
const signIn = () => {
    console.log("Sign In Button Connected");
    // Remove Hidden for Sign In and Sign Up button
    signInButtonElement.setAttribute('hidden','true');
    signUpLinkElement.setAttribute('hidden','true');
    // set content to the element
    userPicElement.textContent = "Duong Anh Vu";
    userNameElement.textContent = "User Placeholder";
    // Replace with image, user-name and signout button
    signOutButtonElement.removeAttribute('hidden','false');
    userPicElement.removeAttribute('hidden','false');
    userNameElement.removeAttribute('hidden','false');

}

const signOut = () => {
    signInButtonElement.removeAttribute('hidden');

    // Set Attribute for the element
    signOutButtonElement.setAttribute('hidden','true');
    userPicElement.setAttribute('hidden','true');
    userNameElement.setAttribute('hidden','true');

}

const signUp = () => {
    console.log("Sign Up Anchor Connected");
}

// Creating the news template
const news_template =
    '<div class= "news-container">' +
        '<div class= "news-title"></div>' +
        '<div class= "news-body"></div>' +
    '</div>';

// Creating a function to add news to the template
const addNewsTestData = (id) => {
    // Creating a container
    // const container = document.createElement('div');
    // container.innerHTML = news_template;
    // const div = container.firstChild;
    // div.setAttribute('id',id);

    
    // newsListElement.appendChild(div);
    // console.log(newsListElement);
    // return div;
}

const displayNews= () => {
    // var div = addNewsTestData("firstNews");

    // div.querySelector('.news-title').textContent = "first News";
    // div.querySelector('.news-body').textContent = "This is the first News";

}

// Creating updates templates
const updates_template = 
    '<div class = "updates-container">' +
        '<div class = "updates-title"></div>' +
        '<div class= "updates-body"></div>' +
    '</div>';

// Create a function to add updates to the list
const addUpdatesTestData = (id) => {
    // const container = document.createElement('div');
    // container.innerHTML = updates_template;
    // const div = container.firstChild;
    // div.setAttribute('id',id);

    // updatesListElement.appendChild(div);
    // console.log(updatesListElement);
    // return div
}


// Create a function to display test updates
const displayUpdates = () => {
    // var div = addUpdatesTestData("first Updates");

    // div.querySelector('.updates-title').textContent = "first Updates";
    // div.querySelector('.updates-body').textContent = "This is the first Updates";
    
}

// Connect to signIn button
const signInButtonElement = document.getElementById('signIn');
const signUpLinkElement = document.getElementById('signUpLink');
const signUpLink = document.getElementById("signUpLink");
const userPicElement = document.getElementById("user-pic");
const userNameElement = document.getElementById("user-name");
const signOutButtonElement = document.getElementById("sign-out");
const newsListElement = document.getElementById("news");
const updatesListElement = document.getElementById("updates");
// const addNewsButtonElement = document.getElementById("add-news-test-data");
// const addUpdatesButtonElement = document.getElementById("add-updates-test-data");

// Adding an event listener to interact with the button
signInButtonElement.addEventListener('click', signIn);
signUpLink.addEventListener('click',signUp);
signOutButtonElement.addEventListener('click',signOut);
// addNewsButtonElement.addEventListener('click',displayNews);
// addUpdatesButtonElement.addEventListener('click',displayUpdates);
