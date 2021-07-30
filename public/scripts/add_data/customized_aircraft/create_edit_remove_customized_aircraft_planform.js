
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// function to check whether the name of the aircraft is valid
function checkElementName(name){

     // Trim the name
     let nameTrimmed = name.trim().replace(" ","");

     // Check the length
     if (nameTrimmed.length >= 4) {
         return [name,nameTrimmed];
     } else {
         return null
     }
}

// Function to add aircraft planform 
function addAircraftPlanform(){

    // Checking which type of planform is added
    if (selectAircraftPlanformTypesModal.options[selectAircraftPlanformTypesModal.selectedIndex].value == "Straight-Tapered") {

        let selectedPlanformName = checkElementName(planformNameInput.value)

        if (selectedPlanformName) {

            // Getting user uid
            firebase.auth().onAuthStateChanged((user) => {
                firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
                .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
                .collection("Planforms").doc(selectedPlanformName[1])
                .set({
                    Name: selectedPlanformName[0],
                    Span: +planformSpanInput.value,
                    rootChord: +planformRootChordInput.value,
                    tipChord: +planformTipChordInput.value,
                    sweepLeadingEdge: +planformSweepLeadingEdgeInput.value,
                    type: selectAircraftPlanformTypesModal.options[selectAircraftPlanformTypesModal.selectedIndex].value
                })
                .then(() => {
                    aircraftPlanformPropertiesInputForm.reset();
                    addEditAircraftModalContainer.style.display = "none";
                })
                .catch((err) => {
                    console.log(err)
                })
            })
            
        } else {
            planformNameInput.style = "background-color: red";
            planformNameInput.value = "";
        }
    } else if (selectAircraftPlanformTypesModal.options[selectAircraftPlanformTypesModal.selectedIndex].value == "Double-Tapered"){

        let selectedPlanformName = checkElementName(doublePlanformNameInput.value);

        if (selectedPlanformName) {

            // Getting user uid
            firebase.auth().onAuthStateChanged((user) => {
                firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
                .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
                .collection("Planforms").doc(selectedPlanformName[1])
                .set({
                    Name: selectedPlanformName[0],
                    spanInboard: +spanPlanformTwoInboardPanelsInput.value,
                    spanOutboard:    +spanPlanformTwoOutboardPanelsInput.value,
                    chordAtBreakSpan:    +chordAtBreakSpanStationInput.value,
                    rootChord:    +doubleRootChordInput.value,
                    tipChord:    +doubleTipChordInput.value,
                    sweepLeadingEdgeInboard:    +doubleSweepLeadingEdgeInboardInput.value,
                    sweepLeadingEdgeOutboard:    +doubleSweepLeadingEdgeOutboardInput.value,
                    type: selectAircraftPlanformTypesModal.options[selectAircraftPlanformTypesModal.selectedIndex].value,
                })
                .then(() => {
                    doubleTaperedPlanformPropertiesForm.reset();
                    addEditAircraftModalContainer.style.display = "none";
                })
                .catch((err) => {
                    console.log(err)
                })
            })

        } else {
            doublePlanformNameInput.style = "background-color: red";
            doublePlanformNameInput.value = "";
        }
    }
}

// Function to load the selected user aircraft
function loadSelectedUserAircraftPlanforms(){

    // Removing all the previous planforms in the select and set hidden all the display data
    
    selectUserAircraftPlanforms.options.length = 0;
    selectAircraftPlanformTypesContainerDisplay.setAttribute("hidden","true");
    straightTaperedPlanformDisplayContainer.setAttribute("hidden","true");
    doubleTaperedPlanformDisplayContainer.setAttribute("hidden","true");
    editToolbarButton.setAttribute("hidden","true");
    removeToolbarButton.setAttribute("hidden","true");

    // Accessing user uid
    firebase.auth().onAuthStateChanged((user) => {
        firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
        .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
        .collection("Planforms").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "removed") {
                    // Create a function to delete Planform on html
                    deletePlanform(change.doc.id);
                } else if (change.type === "added") {
                    let newPlanform = change.doc.data();
                    // Create a function to display information of the selected planform on aircraft
                    // Adding input according to what is needed to display on the screen
                    createAndInsertPlanform(change.doc.id,newPlanform.Name)
                }
            })

            displaySelectedAircraftPlanforms();
        })
    })
}

function displaySelectedAircraftPlanforms() {

    if (selectUserAircraftPlanforms.options.length > 0) {

        selectAircraftPlanformTypesContainerDisplay.removeAttribute("hidden","false");

        // Accessing to the user uid 
        firebase.auth().onAuthStateChanged((user) => {
            // Accessing the data to get the type of the selected planforms
            firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
            .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value).collection("Planforms")
            .doc(selectUserAircraftPlanforms.options[selectUserAircraftPlanforms.selectedIndex].value).get()
            .then((doc) => {
                if(doc.exists) {

                    if(doc.data().type === "Straight-Tapered") {

                        selectAircraftPlanformTypes.selectedIndex  = 0;
                        // Adding the data to the inputs
                        straightTaperedSpan.value = doc.data().Span;
                        straightTaperedRootChord.value = doc.data().rootChord;
                        straightTaperedTipChord.value  = doc.data().tipChord;
                        straightTaperedSweepLeadingEdge.value = doc.data().sweepLeadingEdge;


                        // remove hidden 
                        straightTaperedPlanformDisplayContainer.removeAttribute("hidden","false");
                        doubleTaperedPlanformDisplayContainer.setAttribute("hidden","true");
                        editToolbarButton.removeAttribute("hidden","false");
                        removeToolbarButton.removeAttribute("hidden","false");

                    } else if (doc.data().type === "Double-Tapered") {

                        selectAircraftPlanformTypes.selectedIndex  = 1;
                        // Adding the data to the inputs
                        spanPlanformTwoInboardPanels.value = doc.data().spanInboard;
                        spanPlanformTwoOutboardPanels.value = doc.data().spanOutboard;
                        chordAtBreakSpanStation.value = doc.data().chordAtBreakSpan;
                        doubleRootChord.value = doc.data().rootChord;
                        doubleTipChord.value = doc.data().tipChord;
                        doubleSweepLeadingEdgeInboard.value = doc.data().sweepLeadingEdgeInboard;
                        doubleSweepLeadingEdgeOutboard.value = doc.data().sweepLeadingEdgeOutboard;


                        // remove hidden 
                        straightTaperedPlanformDisplayContainer.setAttribute("hidden","true");
                        doubleTaperedPlanformDisplayContainer.removeAttribute("hidden","false");
                        editToolbarButton.removeAttribute("hidden","false");
                        removeToolbarButton.removeAttribute("hidden","false");
                    }
                }

            })
            .catch((err) => {
                console.log(err)
            })
        })
            
    } else {
        selectAircraftPlanformTypesContainerDisplay.setAttribute("hidden","true");
        editToolbarButton.setAttribute("hidden","true");
        removeToolbarButton.setAttribute("hidden","true");
        straightTaperedPlanformDisplayContainer.setAttribute("hidden","true");
        doubleTaperedPlanformDisplayContainer.setAttribute("hidden","true");
    }

}

// function to delete the planform
function deletePlanform(id) {
    const option = document.getElementById(id);
    if (option) {
        selectUserAircraftPlanforms.remove(option.index);
    }
}

// Create and insert into the select
function createAndInsertPlanform(id,name) {

    const option = document.createElement("option");

    // Adding id to the option
    option.setAttribute("id",id)

    // Create text node in the option
    option.appendChild(document.createTextNode(`${name}`));

    // Create value in the option
    option.value = id;

    // Add to the aircraft planform select
    selectUserAircraftPlanforms.appendChild(option);

}

// Creating function to update the aircraft planforms properties
function updateAircraftPlanformsProperties() {

    if (selectAircraftPlanformTypes.options[selectAircraftPlanformTypes.selectedIndex].value == "Straight-Tapered") {
        // Checking if the input are disabled or not
        if (straightTaperedSpan.disabled == true){

            // Turn off disable for all inputs
            straightTaperedSpan.disabled = false;
            straightTaperedRootChord.disabled = false;
            straightTaperedTipChord.disabled = false;
            straightTaperedSweepLeadingEdge.disabled = false;

        } else if (straightTaperedSpan.disabled == false) {
            // Updating all the data
            firebase.auth().onAuthStateChanged((user) => {
                firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
                .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
                .collection("Planforms").doc(selectUserAircraftPlanforms.options[selectUserAircraftPlanforms.selectedIndex].value).update({

                    Span: straightTaperedSpan.value,
                    rootChord: straightTaperedRootChord.value,
                    tipChord: straightTaperedTipChord.value,
                    sweepLeadingEdge: straightTaperedSweepLeadingEdge.value

                }).then(() => {

                    straightTaperedSpan.disabled = true;
                    straightTaperedRootChord.disabled = true;
                    straightTaperedTipChord.disabled = true;
                    straightTaperedSweepLeadingEdge.disabled = true;

                }).catch(err => {
                    console.log(err)
                })
            })
        }
    } else if (selectAircraftPlanformTypes.options[selectAircraftPlanformTypes.selectedIndex].value == "Double-Tapered") {

        if (spanPlanformTwoInboardPanels.disabled == true) {

            spanPlanformTwoInboardPanels.disabled = false;
            spanPlanformTwoOutboardPanels.disabled = false;
            chordAtBreakSpanStation.disabled = false;
            doubleRootChord.disabled = false;
            doubleTipChord.disabled = false;
            doubleSweepLeadingEdgeInboard.disabled = false;
            doubleSweepLeadingEdgeOutboard.disabled = false;

        } else if (spanPlanformTwoInboardPanels.disabled == false) {

            firebase.auth().onAuthStateChanged((user) => {
                firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
                .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
                .collection("Planforms").doc(selectUserAircraftPlanforms.options[selectUserAircraftPlanforms.selectedIndex].value).update({

                    spanInboard: +spanPlanformTwoInboardPanels.value,
                    spanOutboard:    +spanPlanformTwoOutboardPanels.value,
                    chordAtBreakSpan:    +chordAtBreakSpanStation.value,
                    rootChord:    +doubleRootChord.value,
                    tipChord:    +doubleTipChord.value,
                    sweepLeadingEdgeInboard:    + doubleSweepLeadingEdgeInboard.value,
                    sweepLeadingEdgeOutboard:    +doubleSweepLeadingEdgeOutboard.value

                }).then(() => {

                    spanPlanformTwoInboardPanels.disabled = true;
                    spanPlanformTwoOutboardPanels.disabled = true;
                    chordAtBreakSpanStation.disabled = true;
                    doubleRootChord.disabled = true;
                    doubleTipChord.disabled = true;
                    doubleSweepLeadingEdgeInboard.disabled = true;
                    doubleSweepLeadingEdgeOutboard.disabled = true;

                }).catch(err => {
                    console.log(err)
                })
            })

        }
    }
        
}

// Function to delete the planform
function deleteAircraftPlanform() {

    // Accessing to user uid
    firebase.auth().onAuthStateChanged((user) => {
        // accessing to the document and delete it
        firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
        .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
        .collection("Planforms").doc(selectUserAircraftPlanforms.options[selectUserAircraftPlanforms.selectedIndex].value).delete()
        .then(() => {
            deleteAircraftModalContainer.style.display = "none";
            
            if (selectUserAircraftPlanforms.options.length == 0) {

            }
            
        })
        .catch((err) => {
            console.log(err)
        })
    })
}


// Function to add fuselage to the selected aircraft
function addAircraftFuselage() {

    let fuselageName = checkElementName(fuselageNameInput.value);

    if(fuselageName) {
        // Get access to the user
        firebase.auth().onAuthStateChanged((user) => {
            // add the data to the firestore
            firebaseFirestore.collection(`${user.uid}`).doc("users-info").collection("aircrafts")
            .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
            .collection("Fuselages").doc(fuselageName[1]).set({
                Name: fuselageName[0],
                wettedArea: fuselageWettedAreaInput.value,
                volume: fuselageVolumeInput.value
            })
            .then(() => {
                
                aircraftFuselagePropertiesInputForm.reset();
                // turn off the modal
                addEditAircraftModalContainer.style.display = "none";

            })
            .catch((err) => {
                console.log(err)
            })
        })
    } else {
        fuselageNameInput.setAttribute("style","background-color: red")
    }
}

// create a function to load aircraft fuselages
function loadAircraftFuselages() {
    
    // Reset everything before loading
    selectUserFuselages.options.length = 0;

    // Getting the user uid
    firebase.auth().onAuthStateChanged((user) => {
        
        // Accessing to the Fuselage collection
        firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
        .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
        .collection("Fuselages").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "removed") {
                    // Create a function to delete Planform on html
                    deleteFuselage(change.doc.id);
                } else if (change.type === "added") {
                    let newFuselage= change.doc.data();
                    // Create a function to display information of the selected planform on aircraft
                    // Adding input according to what is needed to display on the screen
                    createAndInsertFuselage(change.doc.id,newFuselage.Name)
                }
            })

            displaySelectedAircraftFuselage();
        })
    }) 
}

// Function to delete the fuselage select/option section
function deleteFuselage(id){
    const option = document.getElementById(id);
    if (option) {
        selectUserFuselages.remove(option.index);
    }
}


// Function to insert into the fuselage select/option section
function createAndInsertFuselage(id, name) {

    const option = document.createElement("option");

    // Adding id to the option
    option.setAttribute("id",id)

    // Create text node in the option
    option.appendChild(document.createTextNode(`${name}`));

    // Create value in the option
    option.value = id;

    // Add to the aircraft planform select
    selectUserFuselages.appendChild(option);
}

// Function to display the selected fuselage 
function displaySelectedAircraftFuselage(){

    if (selectUserFuselages.options.length > 0) {

        // Accessing to the user uid 
        firebase.auth().onAuthStateChanged((user) => {
            // Accessing the data to get the type of the selected planforms
            firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
            .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value).collection("Fuselages")
            .doc(selectUserFuselages.options[selectUserFuselages.selectedIndex].value).get()
            .then((doc) => {
                if(doc.exists) {

                    // Remove the fuselages display container
                    fuselagesDisplayContainer.removeAttribute("hidden","false");

                    // Adding the data to the inputs
                    fuselagesWettedArea.value = doc.data().wettedArea;
                    fuselagesVolume.value = doc.data().volume;

                    // remove hidden 
                    editFuselageToolbarButton.removeAttribute("hidden","false");
                    removeFuselageToolbarButton.removeAttribute("hidden","false");

                }

            })
            .catch((err) => {
                console.log(err)
            })
        })
            
    } else {
        
        fuselagesDisplayContainer.setAttribute("hidden","true");
        // remove hidden 
        editFuselageToolbarButton.setAttribute("hidden","true");
        removeFuselageToolbarButton.setAttribute("hidden","true");
    }

}

// Function to edit the aircraft fuselage
function editAircraftFuselage(){

    if (fuselagesWettedArea.disabled == false) {

        // Updating the data
        firebase.auth().onAuthStateChanged((user) => {
            firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
            .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value).collection("Fuselages")
            .doc(selectUserFuselages.options[selectUserFuselages.selectedIndex].value).update({
                wettedArea:  fuselagesWettedArea.value,
                volume: fuselagesVolume.value
            })
            .then(() => {
                // Turn disabled option back on
                fuselagesWettedArea.disabled = true;
                fuselagesVolume.disabled = true;
            })
            .catch((err) => {
                console.log(err)
            })
        })
        
    } else {

        fuselagesWettedArea.disabled = false;
        fuselagesVolume.disabled = false;

    }
}

function removeAircraftFuselage(){
    //  Accessing to user uid
    firebase.auth().onAuthStateChanged((user) => {
        // accessing to the document and delete it
        firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
        .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
        .collection("Fuselages").doc(selectUserFuselages.options[selectUserFuselages.selectedIndex].value).delete()
        .then(() => {
            deleteAircraftModalContainer.style.display = "none";
        })
        .catch((err) => {
            console.log(err)
        })
    })
}



function loadSelectedAircraftPlanformTypes(){

    // Checking the selected options value
    if (selectAircraftPlanformTypesModal.options[selectAircraftPlanformTypesModal.selectedIndex].value == "Straight-Tapered") {

        aircraftPlanformPropertiesInputForm.removeAttribute("hidden","false");

        aircraftDoublePlanformPropertiesInputForm.setAttribute("hidden","true");

    } else if (selectAircraftPlanformTypesModal.options[selectAircraftPlanformTypesModal.selectedIndex].value == "Double-Tapered") {

        aircraftPlanformPropertiesInputForm.setAttribute("hidden","true");

        aircraftDoublePlanformPropertiesInputForm.removeAttribute("hidden","false");

    }

}

function loadSelectedAircraftFuselage(){

    // Accessing to the user uid
    firebase.auth().onAuthStateChanged((user) => {
        firebaseFirestore.collection(user.uid).doc("users-info").collection("aircrafts")
        .doc(selectedCreatedUserAircraft.options[selectedCreatedUserAircraft.selectedIndex].value)
        .collection("Fuselages").doc(selectUserFuselages.options[selectUserFuselages.selectedIndex].value).get()
        .then((doc) => {
            if (doc.exists) {
                fuselagesWettedArea.value = doc.data().wettedArea;
                fuselagesVolume.value = doc.data().volume;
            }
        })
    })

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Connecting HTML to JS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Accessing to the fuselages-display-container
const fuselagesDisplayContainer = document.getElementsByClassName("fuselages-display-container")[0];

// Accessing to double-tapered-planform-properties-form
const doubleTaperedPlanformPropertiesForm = document.getElementById("aircraft-double-planform-properties-input-form");

// Accessing to the select-aircraft-planform-types-container from the display container
const selectAircraftPlanformTypesContainerDisplay = document.getElementsByClassName("select-aircraft-planform-types-container")[0];

// Accessing to the display input of the double planform 
const spanPlanformTwoInboardPanels = document.getElementById("span-planform-two-inboard-panels");
const spanPlanformTwoOutboardPanels = document.getElementById("span-planform-two-outboard-panels");
const chordAtBreakSpanStation = document.getElementById("chord-at-break-span-station");
const doubleRootChord = document.getElementById("double-root-chord");
const doubleTipChord = document.getElementById("double-tip-chord");
const doubleSweepLeadingEdgeInboard = document.getElementById("double-sweepLeadingEdge-inboard");
const doubleSweepLeadingEdgeOutboard = document.getElementById("double-sweepLeadingEdge-outboard");

// Accessing to the input of the double planform
const doublePlanformNameInput = document.getElementsByClassName("planform-name-input")[1];
const spanPlanformTwoInboardPanelsInput = document.getElementById("span-planform-two-inboard-panels-input");
const spanPlanformTwoOutboardPanelsInput = document.getElementById("span-planform-two-outboard-panels-input");
const chordAtBreakSpanStationInput = document.getElementById("chord-at-break-span-station-input");
const doubleRootChordInput = document.getElementById("double-root-chord-input");
const doubleTipChordInput = document.getElementById("double-tip-chord-input");
const doubleSweepLeadingEdgeInboardInput =  document.getElementById("double-sweepLeadingEdge-inboard-input");
const doubleSweepLeadingEdgeOutboardInput = document.getElementById("double-sweepLeadingEdge-outboard-input");


// Accessing to the modal select-aircraft-planform-types
const selectAircraftPlanformTypesModal = document.getElementsByClassName("select-aircraft-planform-types")[1];

// Accessing to aircraft-double-planform-properties-input-form
const aircraftDoublePlanformPropertiesInputForm  = document.getElementById("aircraft-double-planform-properties-input-form");

// Accessing to modal select-aircraft-planform-types-container
const selectAircraftPlanformTypesContainer = document.getElementsByClassName("select-aircraft-planform-types-container")[1];

// Accessing to select aircraft planform types 
const selectAircraftPlanformTypes = document.getElementsByClassName("select-aircraft-planform-types")[0];

// Accessing to the confirmed deletion fuselage button
const confirmFuselageDeleteButton = document.getElementsByClassName("confirm-fuselage-delete-button")[0];

// Accessing to the fuselage display input value
const fuselagesWettedArea = document.getElementById("fuselages-wettedArea");
const fuselagesVolume = document.getElementById("fuselages-volume");

// Accessing to the select of the aircraft fuselages
const selectUserFuselages = document.getElementById("select-user-fuselages");

// Accessing all inputs in the fuselage input form
const fuselageNameInput = document.getElementsByClassName("fuselage-name-input")[0];
const fuselageWettedAreaInput = document.getElementsByClassName("fuselage-wettedArea-input")[0];
const fuselageVolumeInput = document.getElementsByClassName("fuselage-volume-input")[0];

// Accessing to all the toolbar button in the fuselage section
const addFuselageToolbarButton = document.getElementsByClassName("add-toolbar-button")[1];
const editFuselageToolbarButton = document.getElementsByClassName("edit-toolbar-button")[1];
const removeFuselageToolbarButton = document.getElementsByClassName("remove-toolbar-button")[1];

// Accessing to the modal-body of the create aircraft element input
const createAircraftElementModalBody = document.getElementsByClassName("modal-body")[0];
const createAircraftElementModalFooter = document.getElementsByClassName("modal-footer")[0];

// Accessing to confirmed element deletion modal
const deleteAircraftModalContainer = document.getElementsByClassName("delete-aircraft-modal-container")[0];
const checkingAircraftPlanformText = document.getElementById("checking-aircraft-planform-text");
const spanDeletePlanformModal = document.getElementsByClassName("close")[1];
const confirmDeletePlanformButton = document.getElementsByClassName("confirm-delete-button")[0];
const denyDeletePlanformButton = document.getElementsByClassName("deny-delete-button")[0];

// Accessing the two class lists
const customizedAircraftPlanformElementsContainer = document.getElementsByClassName("customized-aircraft-planform-elements-container")[0];
const customizedAircraftFuselageList = document.getElementsByClassName("customized-aircraft-fuselage-container")[0];

// Format Adding and Selecting aircraft name
const createNewCustomizedUserAircraftContainer = document.getElementsByClassName("create-new-customized-user-aircraft-container")[0];
const createNewCustomizedUserAircraftFormContainer = document.getElementsByClassName("create-new-customized-user-aircraft-form-container")[0];
const selectedCreatedUserAircraft = document.getElementById("selected-created-user-aircraft");
const addAircraftButton = document.getElementById("add-user-aircraft-button");

const newCustomizedUserAircraftInput = document.getElementById("new-customized-user-aircraft-input");
const addNewUserAircraftSubmitButton = document.getElementById("add-new-user-aircraft-submit-button");
const createNewCustomizedUserAircraftForm = document.getElementById("create-new-customized-user-aircraft-form");

// Connecting to the select element of user aircraft planforms
const selectUserAircraftPlanforms = document.getElementById("select-user-aircraft-planforms");

// Connecting to the adding, editing, and removing icons
const addToolbarButton = document.getElementsByClassName("add-toolbar-button")[0];
const editToolbarButton = document.getElementsByClassName("edit-toolbar-button")[0];
const removeToolbarButton = document.getElementsByClassName("remove-toolbar-button")[0];

// Get Access to the add-edit-modal-container
const addEditAircraftModalContainer = document.getElementsByClassName("add-edit-aircraft-modal-container")[0];
const span = document.getElementsByClassName("close")[0];
const addNewPlanformButton = document.getElementsByClassName("add-new-planform-button")[0];
const addNewFuselageButton = document.getElementsByClassName("add-new-fuselage-button")[0];
const cancelNewPlanformButton = document.getElementsByClassName("cancel-new-planform-button")[0];
const aircraftPlanformPropertiesInputForm = document.getElementById("aircraft-planform-properties-input-form");
const aircraftFuselagePropertiesInputForm = document.getElementById("aircraft-fuselage-properties-input-form");

// Access to the form and all the input of the add-edit-modal-container
const planformNameInput = document.getElementsByClassName("planform-name-input")[0];
const planformSpanInput = document.getElementsByClassName("planform-span-input")[0];
const planformRootChordInput = document.getElementsByClassName("planform-rootChord-input")[0];
const planformTipChordInput = document.getElementsByClassName("planform-tipChord-input")[0];
const planformSweepLeadingEdgeInput = document.getElementsByClassName("planform-sweepLeadingEdge-input")[0];

// Accessing to the container of two different type of aircraft planforms 
const straightTaperedPlanformDisplayContainer = document.getElementsByClassName("straight-tapered-planform-display-container")[0];
const doubleTaperedPlanformDisplayContainer = document.getElementsByClassName("double-tapered-planform-display-container")[0];

// Accessing to all the planforms inputs
const straightTaperedSpan = document.getElementById("straight-tapered-span");
const straightTaperedRootChord = document.getElementById("straight-tapered-root-chord");
const straightTaperedTipChord = document.getElementById("straight-tapered-tip-chord");
const straightTaperedSweepLeadingEdge = document.getElementById("straight-tapered-sweep-leadingEdge");



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Event Listener to the connected elements ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Adding event listener to selectUserFuselages when there is changes
selectUserFuselages.addEventListener("change",loadSelectedAircraftFuselage)

// Adding event listener to confirm removing the aircraft planform
selectAircraftPlanformTypesModal.addEventListener("change",(e) => {
    loadSelectedAircraftPlanformTypes();
    
})

// Adding event listener to confirm removing the aircraft fuselage
confirmFuselageDeleteButton.addEventListener("click", removeAircraftFuselage)

// Adding event listener to removeFuselageToolbarButton to remove the fuselage
removeFuselageToolbarButton.addEventListener("click",(e) => {
    confirmDeletePlanformButton.setAttribute("hidden","true");
    confirmFuselageDeleteButton.removeAttribute("hidden","false");
    checkingAircraftPlanformText.textContent = `Do you want to delete ${selectUserFuselages.options[selectUserFuselages.selectedIndex].textContent}?`;
    deleteAircraftModalContainer.style.display = "block";
})

// Adding event listener for editFuselageToolbarButton to edit the fuselage
editFuselageToolbarButton.addEventListener("click",editAircraftFuselage)

// Adding event listener for addNewFuselageButton to adding the fuselage to the selected aircraft
addNewFuselageButton.addEventListener("click",addAircraftFuselage)


// Adding event listener when the add toolbar button in the fuselage section 
addFuselageToolbarButton.addEventListener("click",(e) => {

    addNewPlanformButton.setAttribute("hidden","true");
    aircraftPlanformPropertiesInputForm.setAttribute("hidden","true");
    selectAircraftPlanformTypesContainer.setAttribute("hidden","true");
    aircraftDoublePlanformPropertiesInputForm.setAttribute("hidden","true");

    addNewFuselageButton.removeAttribute("hidden","false");
    aircraftFuselagePropertiesInputForm.removeAttribute("hidden","false");
    

    addEditAircraftModalContainer.style.display = "block";

})

// Adding event listener when the confirm delete the planform button is clicked
confirmDeletePlanformButton.addEventListener("click",deleteAircraftPlanform)


// Adding event listener when the deny delete planform button is clicked
denyDeletePlanformButton.addEventListener("click",(e) => {
    deleteAircraftModalContainer.style.display = "none";
})

// Adding event listener when the span icon is clicked
spanDeletePlanformModal.addEventListener("click",(e) => {
    deleteAircraftModalContainer.style.display = "none";
})

// Adding event listener when the removing icon is clicked
removeToolbarButton.addEventListener("click",(e) => {
    confirmFuselageDeleteButton.setAttribute("hidden","true");
    confirmDeletePlanformButton.removeAttribute("hidden","false")
    checkingAircraftPlanformText.textContent = `Do you want to delete ${selectUserAircraftPlanforms.options[selectUserAircraftPlanforms.selectedIndex].textContent}?`;
    deleteAircraftModalContainer.style.display = "block";

})

// Adding event listener when the editing icon is clicked
editToolbarButton.addEventListener("click",updateAircraftPlanformsProperties)

// Adding event listener when selecting different user aircraft planforms
selectUserAircraftPlanforms.addEventListener("change",displaySelectedAircraftPlanforms)

// Adding event listener when selecting different aircrafts
selectedCreatedUserAircraft.addEventListener("change",(e) => {
    loadSelectedUserAircraftPlanforms();
    loadAircraftFuselages();
})

// Adding event listener when selecting add new aircraft button
addAircraftButton.addEventListener("click",(e)=> {

    if (createNewCustomizedUserAircraftContainer.getAttribute("hidden") == "true"){

        createNewCustomizedUserAircraftContainer.removeAttribute("hidden", "false");
        addNewUserAircraftSubmitButton.removeAttribute("hidden", "false");
        createNewCustomizedUserAircraftFormContainer.removeAttribute("hidden","false");

    } else {

        createNewCustomizedUserAircraftContainer.setAttribute("hidden", "true"); 
        addNewUserAircraftSubmitButton.setAttribute("hidden", "true");
        createNewCustomizedUserAircraftFormContainer.setAttribute("hidden","true");

    }
})

addNewUserAircraftSubmitButton.addEventListener("click", addNewUserAircraft);


// Adding the triggering function at the addToolbarButton
addToolbarButton.addEventListener("click",(e) => {
    e.preventDefault();

    // Unhidden some items
    addNewPlanformButton.removeAttribute("hidden","false");
    selectAircraftPlanformTypesContainer.removeAttribute("hidden","false");

    // Hidden some items
    addNewFuselageButton.setAttribute("hidden","true");
    aircraftFuselagePropertiesInputForm.setAttribute("hidden","true");
    aircraftPlanformPropertiesInputForm.setAttribute("hidden","true");
    aircraftDoublePlanformPropertiesInputForm.setAttribute("hidden","true");

    // Loading the correct input forms
    loadSelectedAircraftPlanformTypes();

    addEditAircraftModalContainer.style.display = "block";
})

span.addEventListener("click", (e) => {
    e.preventDefault();
    addEditAircraftModalContainer.style.display = "none";
})

cancelNewPlanformButton.addEventListener("click",(e) => {
    e.preventDefault();
    addEditAircraftModalContainer.style.display = "none";
})

addNewPlanformButton.addEventListener("click",addAircraftPlanform)

// Call the function everytime to laod the data
loadUserAircraftID()
