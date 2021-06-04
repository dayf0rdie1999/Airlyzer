import('./index_read.js').then(module => {
    console.log(module.loadNews())
})

//  Sign- in with Google Authentication
const signIn = () => {
    // Sign in Firebase using popup auth and Google as the identity provider
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
};

// Sign-Out
const signOut = () => {
    // Sign out of Firebase.
    firebase.auth().signOut();
}

// Initiate Firebase Authentication

const initFirebaseAuth = () => {
    // Listen to auth state changes
    firebase.auth().onAuthStateChanged(authStateObserver);
}
    
// Getting the user's profile Pic URL
const getProfilePicUrl = () => {
    return firebase.auth().currentUser.photoURL || '../testData/img/mario.jpeg';
}
// Getting the user display name
const getUserName = () => {
    return firebase.auth().currentUser.displayName;
}

// Checking whether the user is signed in or out
const isUserSignIn = () => {
    return !!firebase.auth().currentUser;
}

// Checking Whether User or Admin
const isAdmin = () => {
    // Getting user information
    let user = firebase.auth().currentUser;

    // Check user Provider-specific UID:
    const admin_id_list = ['Ae0bs8TZrTh8TH8Oqkm7JKgCgDb2'];

    for(var i = 0; i < admin_id_list.length; i++) {
        if (admin_id_list[i] == user.uid) {
            return true;
        }
    }

    return false;
}


// Changing size of the image
// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
      return url + '?sz=150';
    }
    return url;
  }

// Trigger when the auth state changes
const authStateObserver = (user) => {
    if (user) {
        let profilePicURL = getProfilePicUrl();
        let userName = getUserName();

        // Setting the profile and image to the element
        userNameElement.textContent = userName;
        userImgElement.setAttribute('src',`${addSizeToGoogleProfilePic(profilePicURL)}`);

        
        // Remove Hidden for Sign In and Sign Up button
        signInButtonElement.setAttribute('hidden','true');
        signUpLinkElement.setAttribute('hidden','true');

        // Replace with image, user-name and signout button
        signOutButtonElement.removeAttribute('hidden','false');
        userNameElement.removeAttribute('hidden','false');
        userImgElement.removeAttribute('hidden','false');
        // Checking whether the user is admin or user
        if (isAdmin()) {
            dropDownMenuElement[0].removeAttribute('hidden','false');
        } 

    } else {
        signInButtonElement.removeAttribute('hidden');
        signUpLinkElement.removeAttribute('hidden');

        // Set Attribute for the element
        signOutButtonElement.setAttribute('hidden','true');
        userNameElement.setAttribute('hidden','true');
        userImgElement.setAttribute('hidden','true');
        dropDownMenuElement[0].setAttribute('hidden','true');
    }
}


// Checks that the Firebase SDK has been correctly setup and configured.
const checkSetup = () => {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
    }
}

// Checking the Firebase SDK
checkSetup();

// Initialize Firebase
initFirebaseAuth();

// Creating a function to show the dropdown content
const showDropDownContent = () => {
    // // Access to attribute
    if(dropDownContentElement[0].getAttribute('hidden') == 'true' ) {
        dropDownContentElement[0].removeAttribute('hidden','false')
    } 
    else {
        dropDownContentElement[0].setAttribute('hidden','true')
    }
}

const signUp = () => {
    console.log("Sign Up Anchor Connected");
}


// Connect to signIn button
const signInButtonElement = document.getElementById('signIn');
const signUpLinkElement = document.getElementById('signUpLink');
const signUpLink = document.getElementById("signUpLink");
const userNameElement = document.getElementById("user-name");
const signOutButtonElement = document.getElementById("sign-out");
const userImgElement = document.getElementById("userImage");
const dropDownMenuElement = document.getElementsByClassName("dropDownMenu"); 
const dropDownContentElement = document.getElementsByClassName("dropdown-content");


// Adding an event listener to interact with the button
signInButtonElement.addEventListener('click', signIn);
signUpLink.addEventListener('click',signUp);
signOutButtonElement.addEventListener('click',signOut);
dropDownMenuElement[0].addEventListener('click',showDropDownContent);
