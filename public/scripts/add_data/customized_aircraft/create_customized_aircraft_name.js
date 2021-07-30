firebaseFirestore = firebase.firestore();


// create and adding an option to the select
function createAndInsertSelectOption(id,aircraftName) {
    
    // Create an option element
    let option = document.createElement("option");
    if (aircraftName) {
        // Adding text to the option
        option.appendChild(document.createTextNode(`${aircraftName}`));
    } else {
        option.appendChild(document.createTextNode(`${id}`));
    }

    // Adding value to the option
    option.value = id;

    // Adding to the selection options
    selectedCreatedUserAircraft.appendChild(option);

}

// Loading the document id to the select and options html
function loadUserAircraftID(){
 
    // Getting the user UID
    firebase.auth().onAuthStateChanged((user) => {

        firebaseFirestore.collection(user.uid).doc('users-info').collection("aircrafts").get()
            .then((docs) => {
                if (!docs.empty) {
                    docs.forEach(doc => {
                        createAndInsertSelectOption(doc.id,doc.data().aircraftName);
                    })
                    loadSelectedUserAircraftPlanforms();
                    loadAircraftFuselages();
                } else {
                    console.log("No Aircrafts")
                }
            })
            .catch(err => {
                console.log(err)
            })
        })
}


// Creating a new customized aircraft
function addNewUserAircraft() {

    let newUserAircraftName = checkName(newCustomizedUserAircraftInput.value);
    
    if (newUserAircraftName) {

        firebase.auth().onAuthStateChanged((user) => {
            firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts").doc(newUserAircraftName[1]).set({
                aircraftName: newUserAircraftName[0]
            })
            .then(() => {
                createAndInsertSelectOption(newUserAircraftName[0],newUserAircraftName[1])
                createNewCustomizedUserAircraftForm.reset();
                addAircraftButton.click();
            })
            .catch((err) => {
                console.log(err)
            })

        })

    } else {
        createNewCustomizedUserAircraftForm.reset();
        newCustomizedUserAircraftInput.setAttribute("style","background-color: red")
    }

}

function checkName(name) {
    // Trim the name
    let nameTrimmed = name.trim().replace(" ","");

    // Check the length
    if (nameTrimmed.length >= 8) {
        return [name,nameTrimmed];
    } else {
        return null
    }

}


