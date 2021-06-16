

function sendAircraftData() {
    // Getting user id
    let user_id = firebase.auth().currentUser.uid

    let aircraftNameNoSpace = removeSpaces(aircraftNameInput.value);

    // Create a local empty list    
    if (aircraftNameNoSpace) {
        firebase.firestore().collection(user_id).doc("user-info").collection(aircraftNameNoSpace).doc(`${aircraftNameNoSpace}-properties`)
        .withConverter(aircraftConverter)
        .set(new Aircraft(convertNum(wingSpanInput.value),convertNum(wingRootChordInput.value),convertNum(wingTipChordInput.value),convertNum(wingSweepLeadingEdge.value),
        convertNum(horizontalTailSpan.value),convertNum(horizontalTailRootChord.value),convertNum(horizontalTailTipChord.value),convertNum(horizontalTailSweepLeadingEdge.value),
        convertNum(verticalTailSpan.value),convertNum(verticalTailRootChord.value),convertNum(verticalTailTipChord.value),convertNum(verticalTailSweepLeadingEdge.value),
        convertNum(fuselageWettedArea.value),convertNum(fuselageVolume.value)))
        .then(()=> {
            console.log("Document Successfully Written!")

        })
        .catch(err => {
            console.log(err);
        });
    } else {
        aircraftNameInput.setAttribute('style','background-color: red');
    }
    
}

function convertNum(val) {
    return +val;
}

function removeSpaces(aircraftName) {
    return aircraftName.replace(/ /g,"");
}

// Getting all the input element
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
const saveYourAircraftButton = document.getElementById('submit');


// Uploading the data when the button is clicked
saveYourAircraftButton.addEventListener('click',sendAircraftData);