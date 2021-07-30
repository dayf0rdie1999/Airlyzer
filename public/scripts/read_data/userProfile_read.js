// Initialize the firebase firestore and storage 
const firebaseFirestore = firebase.firestore();
const firebaseStorage = firebase.storage();





// Loading the data into the input elements
function loadProfileData() {
    
    let userName = null;
    let userImageURL = null;

    // Getting the user information 
    firebase.auth().onAuthStateChanged((user) => {
        // if existed
        if (user) {
            // assign name and image to the page if the account created by google
            userName = user.displayName;
            userImageURL = user.photoURL;
            
            // if they both don't exist, assign information that is stored from the firestore
            if(!userName && !userImageURL) {
                
                firebaseFirestore.collection(user.uid).doc('users-info').get()
                .then((doc) => {
                    if (doc.exists) {

                        userName = doc.data().userName;
                        userImageURL = doc.data().imagePublicURL;

                        userNameInputElement.value = userName;
                        profileUserImageElement.src = userImageURL;

                    } 
                })
            } else {
                userNameInputElement.value = userName;
                profileUserImageElement.src = userImageURL;
            }

            // Disabling all the input value
            userNameInputElement.disabled = true;

            // Getting all the collections from the firestore
            firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts").get()
                .then(querySnapShot => {
                    querySnapShot.forEach(doc => {

                        // Creating an options
                        let opt = document.createElement("option");

                        // Creating a text to that options
                        opt.appendChild( document.createTextNode(`${doc.id}`) );

                        // Adding values to the options
                        opt.value = `${doc.id}`;

                        // Append the options to select element
                        profileAircraftSelectElement.appendChild(opt);
                    })
                })

        } else {
            console.log("Doc isn't existed");
        }
    });
}

function loadSelectedAircraftData(event) {

    firebase.auth().onAuthStateChanged((user) => {
        
        if (user) {
            
            firebaseFirestore.collection(user.uid).doc('users-info').collection("aircrafts").doc(profileAircraftSelectElement.options[profileAircraftSelectElement.selectedIndex].value).get()
                .then((doc) => {
                    if (doc.exists) {
                        selectedAircraftContainer.removeAttribute('hidden','false');

                        // Assigning all the values to the elements
                        aircraftNameInput.value = profileAircraftSelectElement.options[profileAircraftSelectElement.selectedIndex].value;
                        wingSpanInput.value = doc.data().wingSpan;
                        wingRootChordInput.value = doc.data().wingRootChord;
                        wingTipChordInput.value = doc.data().wingTipChord;
                        wingSweepLeadingEdge.value = doc.data().wingSweepLeadingEdge;
                        horizontalTailSpan.value = doc.data().horizontalTailSpan;
                        horizontalTailRootChord.value = doc.data().horizontalTailRootChord;
                        horizontalTailTipChord.value = doc.data().horizontalTailTipChord;
                        horizontalTailSweepLeadingEdge.value = doc.data().horizontalTailSweepLeadingEdge;
                        verticalTailSpan.value = doc.data().verticalTailSpan;
                        verticalTailRootChord.value = doc.data().verticalTailRootChord;
                        verticalTailTipChord.value = doc.data().verticalTailTipChord;
                        verticalTailSweepLeadingEdge.value = doc.data().verticalTailSweepLeadingEdge;
                        fuselageWettedArea.value = doc.data().fuselageWettedArea;
                        fuselageVolume.value =  doc.data().fuselageVolume;

                        // Disable all the input value
                        DisableAircraftInputElements()
                        editAircraftDataButtonContainer.removeAttribute('hidden','false');
                    }
                    
                })
                .catch(err => {
                    console.log(err)
                });
        }
    });
}

function DisableAircraftInputElements() {
    aircraftNameInput.disabled = true;
    wingSpanInput.disabled = true;
    wingRootChordInput.disabled = true;
    wingTipChordInput.disabled = true;
    wingSweepLeadingEdge.disabled = true;
    horizontalTailSpan.disabled = true;
    horizontalTailRootChord.disabled = true;
    horizontalTailTipChord.disabled = true;
    horizontalTailSweepLeadingEdge.disabled = true;
    verticalTailSpan.disabled = true;
    verticalTailRootChord.disabled = true;
    verticalTailTipChord.disabled = true;
    verticalTailSweepLeadingEdge.disabled = true;
    fuselageWettedArea.disabled = true;
    fuselageVolume.disabled = true; 
}

function UnDisableAircraftInputElements() {
    wingSpanInput.disabled = false;
    wingRootChordInput.disabled = false;
    wingTipChordInput.disabled = false;
    wingSweepLeadingEdge.disabled = false;
    horizontalTailSpan.disabled = false;
    horizontalTailRootChord.disabled = false;
    horizontalTailTipChord.disabled = false;
    horizontalTailSweepLeadingEdge.disabled = false;
    verticalTailSpan.disabled = false;
    verticalTailRootChord.disabled = false;
    verticalTailTipChord.disabled = false;
    verticalTailSweepLeadingEdge.disabled = false;
    fuselageWettedArea.disabled = false;
    fuselageVolume.disabled = false; 
}

function updateUserNameProfile() {
    // Check whether the input element is disable or not
    if (userNameInputElement.disabled) {
        userNameInputElement.disabled = false;
    } else {

        // Accessing to the firebase firestore to update the username
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebaseFirestore.collection(user.uid).doc(`users-info`).update({
                    userName: userNameInputElement.value
                }).then((res) => {
                    userNameInputElement.disabled = true;
                }).catch(err => {
                    console.log(err);
                })
            }
        })
    }
}

function onMediaFileSelected(event) {
    event.preventDefault();

    // Create file to hold the file as a variable
    let file = event.target.files[0];

    // Check if the file is an image
    if (!file.type.match('image.*')) {
        var data = {
            message: 'You can only share images',
            timeout: 2000
        };
        return;
    }

    // Check if the user is signed in and is admin
    if (isUserSignIn()) {
        
        // Access user uid
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let newUserImgFilePath = user.uid + "/" + file.name;

                // Getting the user image File Path
                firebaseFirestore.collection(user.uid).doc('users-info').get()
                    .then((doc) => {
                        if (doc.exists) {
                            // Access to the storage and delete the image
                            firebaseStorage.ref(doc.data().imageFilePath).delete()
                                
                                .then(() => {
                                    // Adding the new image
                                    firebaseStorage.ref(newUserImgFilePath).put(file)
                                        .then((snapshot) => {
                                            snapshot.ref.getDownloadURL()
                                                .then((url) => {
                                                    // Updating the file path and a new publicimage URL
                                                    firebaseFirestore.collection(user.uid).doc('users-info').update({
                                                        imageFilePath: newUserImgFilePath,
                                                        imagePublicURL: url
                                        }).then(() => {
                                            profileUserImageElement.src = url;
                                        }).catch((err) => {
                                            console.log(err);
                                        });
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                            }).catch((err) => {
                                console.log(err);
                            });
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        })
    }
}


// Function to edit aircraft data
function TogglingAircraftInputElementDisability() {
    if (wingSpanInput.disabled) {
        UnDisableAircraftInputElements();
    } else {

        // Getting the user id
        firebase.auth().onAuthStateChanged((user) => {
            // accessing to the data and Updating all the data to the firestore
            firebaseFirestore.collection(user.uid).doc(`users-info`).collection(`aircrafts`).doc(aircraftNameInput.value).update({
                fuselageVolume: fuselageVolume.value,
                fuselageWettedArea: fuselageWettedArea.value,
                horizontalTailRootChord: horizontalTailRootChord.value,
                horizontalTailTipChord: horizontalTailTipChord.value,
                horizontalTailSweepLeadingEdge: horizontalTailSweepLeadingEdge.value,
                horizontalTailSpan: horizontalTailSpan.value,
                verticalTailSpan: verticalTailSpan.value,
                verticalTailRootChord: verticalTailRootChord.value,
                verticalTailTipChord: verticalTailTipChord.value,
                verticalTailSweepLeadingEdge: verticalTailSweepLeadingEdge.value,
                wingSpan: wingSpanInput.value,
                wingRootChord: wingRootChordInput.value,
                wingSweepLeadingEdge: wingSweepLeadingEdge.value,
                wingTipChord: wingTipChordInput.value,
            })
            .then((res) => {
                DisableAircraftInputElements();
            })
            .catch((err) => {
                console.log(err);
            })
        });
    }
}

// Accessing to all the elements in the profile page
const userNameInputElement = document.getElementById('userName');
const profileUserImageElement = document.getElementById('profile-userImage');
const userImageCaptureElement = document.getElementById('userImageCapture');
const profileAircraftSelectElement = document.getElementById("select-options-aircrafts");
const selectedAircraftContainer = document.getElementsByClassName("selected-aircraft-container")[0];
const editAircraftDataButton = document.getElementById("aircrafts-edit-button");
const aircraftNameInput = document.getElementById('aircraft-name');
const wingSpanInput = document.getElementById('wing-span');
const wingRootChordInput = document.getElementById('wing-root-chord');
const wingTipChordInput = document.getElementById('wing-tip-chord');
const wingSweepLeadingEdge = document.getElementById('wing-sweep-leadingEdge');
const horizontalTailSpan = document.getElementById('horizontal-tail-span');
const horizontalTailRootChord = document.getElementById('horizontal-tail-root-chord');
const horizontalTailTipChord = document.getElementById('horizontal-tail-tip-chord');
const horizontalTailSweepLeadingEdge = document.getElementById('horizontal-tail-sweep-leadingEdge');
const verticalTailSpan = document.getElementById('vertical-tail-span');
const verticalTailRootChord = document.getElementById('vertical-tail-root-chord');
const verticalTailTipChord = document.getElementById('vertical-tail-tip-chord');
const verticalTailSweepLeadingEdge = document.getElementById('vertical-tail-sweep-leadingEdge');
const fuselageWettedArea = document.getElementById('fuselage-wetted-area');
const fuselageVolume = document.getElementById('fuselage-volume');
const editAircraftDataButtonContainer = document.getElementsByClassName('edit-button-container')[0];


// Accessing the UserName edit button
const userNameEditButton = document.getElementById('userName-edit-button');

// Undisable aircrafts data to allow edit the data
editAircraftDataButton.addEventListener('click',TogglingAircraftInputElementDisability);

// allow the input to enter user name
userNameEditButton.addEventListener('click',updateUserNameProfile)

// Click the img and trigger the input image, response the img file 
profileUserImageElement.addEventListener('click',function(e) {
    e.preventDefault();
    userImageCaptureElement.click();
});

userImageCaptureElement.addEventListener('change',onMediaFileSelected);

// AddEventListener when the select options is changed
profileAircraftSelectElement.addEventListener('change',loadSelectedAircraftData);

loadProfileData()