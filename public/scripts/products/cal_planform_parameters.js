// Initializing the firestore and storage
const fireStore = firebase.firestore();
const storage = firebase.storage();

// create an empty variable to hold aircraft
let selectedUserAircraft = null;



// Loading the data and adding to the option
function loadSelectUserAircrafts() {

    // Getting user id
    firebase.auth().onAuthStateChanged((user) => {
        // Getting all the aircraft doc id from firebase
        fireStore.collection(user.uid).doc('users-info').collection('aircrafts').onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    // Display the planform
                    createAndInsertUserAircrafts(change.doc.id,change.doc.data().aircraftName);
                }
                if (change.type === "modified") {
                    console.log("Modified planform: ", change.doc.data());
                } 
                if(change.type === "removed") {
                    // Delete the planform
                    console.log("Removed planform: ", change.doc.data());
                }
            })

            loadSelectedAircraftPlanform();
        })
    });
}

// Function to create and insert aircrafts planforms
function createAndInsertUserAircrafts(id,name) {
    
    // Create an option element
    let opt = document.createElement("option")

    // Adding text to the option
    opt.appendChild(document.createTextNode(`${name}`));

    // Adding the value to the option
    opt.value = `${id}`;

    // Adding the option to the select element
    userAircraftSelectElement.appendChild(opt);
}

function loadSelectedAircraftPlanform(){

    aircraftPlanformElement.options.length = 0;

    firebase.auth().onAuthStateChanged((user) => {
        fireStore.collection(user.uid).doc("users-info").collection("aircrafts")
        .doc(userAircraftSelectElement.options[userAircraftSelectElement.selectedIndex].value)
        .collection("Planforms").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    // Display the planform
                    createAndInsertSelectedAircraftPlanforms(change.doc.id,change.doc.data().Name);
                }
                if (change.type === "modified") {
                    console.log("Modified planform: ", change.doc.data());
                } 
                if(change.type === "removed") {
                    console.log("Removed planform: ", change.doc.data());
                    // Delete the planform
                }
            })

            loadSelectedAircraftPlanformData()
        })
    })
}

// Loading aircraft planform data
function loadSelectedAircraftPlanformData() {

    calculatedPlanformParametersForm.reset();
    newAircraftDoublePlanformParameterForm.reset();

    firebase.auth().onAuthStateChanged((user) => {
        fireStore.collection(user.uid).doc("users-info").collection("aircrafts")
        .doc(userAircraftSelectElement.options[userAircraftSelectElement.selectedIndex].value).collection("Planforms")
        .doc(aircraftPlanformElement.options[aircraftPlanformElement.selectedIndex].value).get()
        .then((doc) => {
            if (doc.exists) {
                if (doc.data().type === "Straight-Tapered") {

                    displayStraightPlanformData(doc.data().Span,doc.data().rootChord,doc.data().tipChord,doc.data().sweepLeadingEdge);

                } else if (doc.data().type === "Double-Tapered") {

                    displayDoublePlanformData(doc.data().spanInboard,doc.data().spanOutboard,doc.data().sweepLeadingEdgeInboard,doc.data().sweepLeadingEdgeOutboard,doc.data().chordAtBreakSpan,doc.data().rootChord,doc.data().tipChord);

                }
            } 
        })
        .catch((err) => {
            console.log(err)
        })
    })

}

function displayStraightPlanformData(span,rootChord,tipChord,sweepLeadingEdge) {

    // Set hidden the input form
    existedDoublePlanformParameterForm.setAttribute("hidden","true");
    newAircraftDoublePlanformParameterForm.setAttribute("hidden","true");

    // Remove hidden of single-aircraft-planform-form
    existedPlanformParameterForm.removeAttribute("hidden","false");
    calculatedPlanformParametersForm.removeAttribute("hidden","false");


    selectAircraftPlanformType.selectedIndex = 0;
    spanInputElement.value = span
    rootChordInputElement.value = rootChord
    tipChordInputElement.value = tipChord
    sweepLeadingEdgeInputElement.value = sweepLeadingEdge

}

function displayDoublePlanformData(spanInBoard,spanOutBoard,sweepLeadingEdgeInBoard,sweepLeadingEdgeOutboard,chordAtBreakSpan,rootChord,tipChord) {

    

    existedPlanformParameterForm.setAttribute("hidden","true");
    calculatedPlanformParametersForm.setAttribute("hidden","true");

    // Remove hidden
    existedDoublePlanformParameterForm.removeAttribute("hidden","false");
    newAircraftDoublePlanformParameterForm.removeAttribute("hidden","false");


    selectAircraftPlanformType.selectedIndex = 1;
    
    spanInboardInput.value = spanInBoard
    spanOutboardInput.value = spanOutBoard
    doubleRootChordInput.value = rootChord
    doubleTipChordInput.value = tipChord
    doubleChordAtBreakSpanInput.value = chordAtBreakSpan
    sweepLeadingEdgeInboardInput.value = sweepLeadingEdgeInBoard
    sweepLeadingEdgeOutboardInput.value = sweepLeadingEdgeOutboard

}

    

// Function to create and insert aircrafts planforms
function createAndInsertSelectedAircraftPlanforms(id,name) {
    
    let option = document.createElement("option");

    // Adding text to the option
    option.appendChild(document.createTextNode(`${name}`));

    // Adding value to the option
    option.value = id;

    // Adding to the select planform
    aircraftPlanformElement.appendChild(option);
}

function loadSelectedUserAircraft() {

    // Getting access to the user id
    firebase.auth().onAuthStateChanged(user => {
        fireStore.collection(user.uid).doc('users-info').collection("aircrafts")
            .doc(userAircraftSelectElement.options[userAircraftSelectElement.selectedIndex].value).get()
            .then((doc) => {
                if (doc.exists) {
                    selectedUserAircraft = new Aircraft(doc.data().wingSpan,doc.data().wingRootChord,doc.data().wingTipChord,doc.data().wingSweepLeadingEdge,doc.data().horizontalTailSpan,doc.data().horizontalTailRootChord,doc.data().horizontalTailTipChord,
                    doc.data().horizontalTailSweepLeadingEdge,doc.data().verticalTailSpan,doc.data().verticalTailRootChord,doc.data().verticalTailTipChord,doc.data().verticalTailSweepLeadingEdge,
                    doc.data().fuselageWettedArea,doc.data().fuselageVolume);
                    
                    loadSelectedAircraftPlanform();

                    // Resetting when change the aircraft
                    calculatedPlanformParametersForm.reset();
                    newAircraftDoublePlanformParameterForm.reset();
                }
            }).catch(err => {
                console.log(err)
            })
    })
}

function saveSelectedAircraftPlanformData(){

    if (selectAircraftPlanformType.options[selectAircraftPlanformType.selectedIndex].value === "Straight-Tapered"){
        
        firebase.auth().onAuthStateChanged((user) => {
            fireStore.collection(user.uid).doc("users-info").collection("aircrafts")
            .doc(userAircraftSelectElement.options[userAircraftSelectElement.selectedIndex].value).collection("Planforms")
            .doc(aircraftPlanformElement.options[aircraftPlanformElement.selectedIndex].value).update({
                Span: +spanInputElement.value,
                rootChord: +rootChordInputElement.value,
                tipChord: +tipChordInputElement.value,
                sweepLeadingEdge: +sweepLeadingEdgeInputElement.value
            })
        })

    } else {
        firebase.auth().onAuthStateChanged((user) => {
            fireStore.collection(user.uid).doc("users-info").collection("aircrafts")
            .doc(userAircraftSelectElement.options[userAircraftSelectElement.selectedIndex].value).collection("Planforms")
            .doc(aircraftPlanformElement.options[aircraftPlanformElement.selectedIndex].value).update({
                spanInboard: +spanInboardInput.value,
                spanOutboard: +spanOutboardInput.value,
                rootChord: +doubleRootChordInput.value,
                tipChord: +doubleTipChordInput.value,
                chordAtBreakSpan: +doubleChordAtBreakSpanInput.value,
                sweepLeadingEdgeInboard: +sweepLeadingEdgeInboardInput.value,
                sweepLeadingEdgeOutboard: +sweepLeadingEdgeOutboardInput.value
            })
        })
    }
    
}


function calculateAircraftPlanform() {

    if (selectAircraftPlanformType.options[selectAircraftPlanformType.selectedIndex].value === "Straight-Tapered") {
        let ratioChordwisePosition = cal_ratio_chordwise_position(spanInputElement.value,sweepLeadingEdgeInputElement.value,rootChordInputElement.value);
        let taperRatio = cal_taper_ratio(tipChordInputElement.value,rootChordInputElement.value);
        let aspectRatio = cal_aspect_ratio(spanInputElement.value,rootChordInputElement.value,taperRatio);
        let meanAerodynamicChord = cal_mean_aerodynamic_chord(rootChordInputElement.value,taperRatio)
        let area = cal_area(spanInputElement.value,rootChordInputElement.value,taperRatio);
        let xCentroid = cal_x_centroid(taperRatio,ratioChordwisePosition,rootChordInputElement.value);
        let yMAC = cal_y_mac(spanInputElement.value,taperRatio)
        let positionSweepAngle = cal_sweepAngle_SelectedLocation(aspectRatio,selectSweepAngleLocation.options[selectSweepAngleLocation.selectedIndex].value,taperRatio,sweepLeadingEdgeInputElement.value)
    
        // Calculate ratio of chordwise position
        ratioChordWisePositionInputElement.value = +ratioChordwisePosition.toPrecision(3);
    
        // Calculate Taper Ratio
        taperRatioInputElement.value = +taperRatio.toPrecision(3);
    
        // Calculate Aspect Ratio
        aspectRatioInputElement.value =+ aspectRatio.toPrecision(3);
    
        // Calculate Mean Aerodynamic Chord
        meanAerodynamicChordInputElement.value = +meanAerodynamicChord.toPrecision(3);
    
        // Calculate the wing area
        planformAreaInputElement.value = +area.toPrecision(3);
    
        // Calculate x centroid location
        xCentroidLocationInputElement.value = +xCentroid.toPrecision(3);
    
        // Calculate Y Mean Aerodynamic Chord
        yMACLocationInputElement.value = +yMAC.toPrecision(3);
    
        // Calculate the sweep angle at certain location
        sweepAngleLocationInputElement.value = +positionSweepAngle.toPrecision(3);
    } else {

        let doubleTotalSpan = cal_total_span(+spanInboardInput.value,+spanOutboardInput.value);
        let doubleSpanRatio = cal_double_span_ratio(+spanInboardInput.value,+spanOutboardInput.value);
        let doubleTaperRatio = cal_double_taper_ratio(+doubleTipChordInput.value,+doubleRootChordInput.value);
        let doubleInnerTaperRatio = cal_inner_taper_ratio(+doubleChordAtBreakSpanInput.value,+doubleRootChordInput.value);
        let doubleOuterTaperRatio = cal_outer_taper_ratio(+doubleTipChordInput.value,+doubleChordAtBreakSpanInput.value);
        let doubleAspectRatio = cal_double_aspect_ratio(doubleTotalSpan,+doubleRootChordInput.value,doubleTaperRatio,doubleInnerTaperRatio,doubleSpanRatio);

        let doubleInnerMAC = cal_mean_aerodynamic_chord(+doubleRootChordInput.value,doubleInnerTaperRatio);
        let doubleOuterMAC = cal_mean_aerodynamic_chord(+doubleChordAtBreakSpanInput.value,doubleOuterTaperRatio);
        let doubleInnerArea = cal_area(+spanInboardInput.value,+doubleRootChordInput.value,doubleInnerTaperRatio);
        let doubleOuterArea = cal_area(+spanOutboardInput.value,+doubleChordAtBreakSpanInput.value,doubleOuterTaperRatio);
        let doubleMAC = cal_double_mean_aerodynamic_chord(doubleInnerMAC,doubleInnerArea,doubleOuterMAC,doubleOuterArea);
        let doubleArea = cal_double_area(doubleInnerArea,doubleOuterArea);

        let doubleYInnerMAC = cal_y_mac(+spanInboardInput.value,doubleInnerTaperRatio);
        let doubleYOuterMAC = cal_y_mac(+spanOutboardInput.value,doubleOuterTaperRatio);
        let X_Centroid_LeadingEdge = cal_X_Centroid_LeadingEdge(doubleYInnerMAC,+sweepLeadingEdgeInboardInput.value,doubleInnerArea,+spanInboardInput.value,doubleYOuterMAC,doubleOuterArea,sweepLeadingEdgeOutboardInput.value)
        let X_Centroid = cal_X_Centroid(X_Centroid_LeadingEdge,doubleMAC)
        let doubleY_MAC = cal_Y_MAC(doubleYInnerMAC,doubleInnerArea,+spanInboardInput.value,doubleYOuterMAC,doubleOuterArea);
        
        doubleSpanRatioInput.value = +doubleSpanRatio.toPrecision(3);
        doubleTaperRatioInput.value = +doubleTaperRatio.toPrecision(3);
        doubleInnerTaperRatioInput.value = +doubleInnerTaperRatio.toPrecision(3);
        doubleOuterTaperRatioInput.value = +doubleOuterTaperRatio.toPrecision(3);
        doubleAspectRatioInput.value = +doubleAspectRatio.toPrecision(3);
        doubleMACChordInput.value = +doubleMAC.toPrecision(3);
        doubleAreaInput.value = +doubleArea.toPrecision(3);
        doubleXCentroidLeadingEdgeInput.value = +X_Centroid_LeadingEdge.toPrecision(3);
        doubleXCentroidInput.value = +X_Centroid.toPrecision(3);
        doubleYMACInput.value = +doubleY_MAC.toPrecision(3);
        
    }
    
}



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ All the equations to calculate aircraft planform ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function cal_ratio_chordwise_position(span,sweepLeadingEdge,rootChord) {
    return (span/2)*(Math.tan(sweepLeadingEdge*Math.PI/180)/rootChord);
}

function cal_taper_ratio(tipChord,rootChord) {
    return tipChord/rootChord;

}

function cal_aspect_ratio(span,rootChord,taperRatio) {
    return (2*span)/(rootChord*(1+taperRatio));

}

function cal_mean_aerodynamic_chord(rootChord,taperRatio) {
    return (2/3)*rootChord*((1+taperRatio+Math.pow(taperRatio,2))/(1+taperRatio));

}

function cal_area(span,rootChord,taperRatio) {
    return (span/2)*rootChord*(1+taperRatio)
}

function cal_x_centroid(lambda,sigma,rootChord) {
    return (rootChord*(1/3)*(lambda+sigma+((1+sigma*lambda)/(1+lambda))));
}

function cal_y_mac(span,lambda) {
    return (span/2)*(1/3)*((1+2*lambda)/(1+lambda));
}

function cal_sweepAngle_SelectedLocation(A,position,lambda,sweepLeadingEdge) {
    return Math.atan(Math.tan(sweepLeadingEdge*Math.PI/180) - (4/A)*((+position)*((1-lambda)/(1+lambda)))) * (180/Math.PI);
}

// Function to calculate all the properties of the double planforms
function cal_double_span_ratio(spanInboard,spanOutBoard) {
    return (spanInboard/2)/(spanInboard+spanOutBoard);
}

function cal_double_taper_ratio(tipChord,rootChord) {
    return tipChord/rootChord;
}

function cal_inner_taper_ratio(chordAtBreak,rootChord){
    return chordAtBreak/rootChord;
}

function cal_outer_taper_ratio(tipChord,chordAtBreak){
    return tipChord/chordAtBreak;
}

function cal_total_span(spanInboard,spanOutboard) {
    return spanInboard+spanOutboard;
}

function cal_double_aspect_ratio(b,C_r,l,l_i,eta) {
    return (2*b)/(C_r*((1-l)*eta+l_i+l));
}

function cal_double_mean_aerodynamic_chord(MAC_i,S_i,MAC_o,S_o) {
    
    return (MAC_i*S_i + MAC_o*S_o)/(S_i+S_o);
}

function cal_double_area(S_i,S_o) {
    return S_i + S_o;
}

function cal_X_Centroid_LeadingEdge(Y_MAC_i,A_LE_i,S_i,b_i,Y_MAC_o,S_o, A_LE_o) {
    return ((Y_MAC_i*Math.tan(A_LE_i * Math.PI/180))*S_i + ((b_i/2)*Math.tan(A_LE_i) + Y_MAC_o*Math.tan(A_LE_o* Math.PI/180))*S_o)/(S_i + S_o);
}

function cal_X_Centroid(X_Centroid_LE,C_MAC) {
    return X_Centroid_LE + (C_MAC/2)
}

function cal_Y_MAC(Y_MAC_i,S_i,b_i,Y_MAC_o,S_o){
    return (Y_MAC_i*S_i+((b_i/2)+Y_MAC_o)*S_o)/(S_i+S_o)
}



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Connecting From HTML to JS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Accessing to the all the calculated input 
const doubleSpanRatioInput = document.getElementById("double-span-ratio-input");
const doubleTaperRatioInput = document.getElementById("double-taper-ratio-input");
const doubleInnerTaperRatioInput = document.getElementById("double-inner-taper-ratio-input");
const doubleOuterTaperRatioInput = document.getElementById("double-outer-taper-ratio-input");
const doubleAspectRatioInput = document.getElementById("double-aspect-ratio-input");
const doubleChordRootInput = document.getElementById("double-chord-root-input");
const doubleMACChordInput = document.getElementById("double-MAC-chord-input");
const doubleAreaInput = document.getElementById("double-area-input");
const doubleXCentroidInput = document.getElementById("double-X-centroid-input");
const doubleXCentroidLeadingEdgeInput = document.getElementById("double-X-centroid-leadingEdge-input");
const doubleYMACInput = document.getElementById("double-Y-MAC-input");

// Accessing to the double planform input new-aircraft-double-planform-parameter-form
const newAircraftDoublePlanformParameterForm = document.getElementsByClassName("new-aircraft-double-planform-parameter-form")[0];

// Accessing to all double planform input information
const spanInboardInput = document.getElementById("spanInboard-input");
const spanOutboardInput = document.getElementById("spanOutboard-input");
const doubleRootChordInput = document.getElementById("double-rootChord-input");
const doubleTipChordInput = document.getElementById("double-tipChord-input");
const doubleChordAtBreakSpanInput = document.getElementById("double-chordAtBreakSpan-input");
const sweepLeadingEdgeInboardInput = document.getElementById("sweepLeadingEdgeInboard-input");
const sweepLeadingEdgeOutboardInput = document.getElementById("sweepLeadingEdgeoutboard-input");

// Accessing to double planform form input
const existedDoublePlanformParameterForm = document.getElementsByClassName("existed-double-planform-parameter-form")[0];

// Connecting to the straight planform input form
const existedPlanformParameterForm = document.getElementsByClassName("existed-planform-parameter-form")[0];

// Connecting to the aircraft planform type
const selectAircraftPlanformType = document.getElementById("aircraft-planform-type");

// Connecting to the user aircraft selection menu
const userAircraftSelectElement = document.getElementById("select-user-aircraft");
const aircraftPlanformElement = document.getElementById("aircraft-planform-element");

// Accessing to the label in the required input
const spanInputElement = document.getElementById("span-input");
const rootChordInputElement = document.getElementById("rootChord-input");
const tipChordInputElement = document.getElementById("tipChord-input");
const sweepLeadingEdgeInputElement = document.getElementById("sweepLeadingEdge-input");

// Get Access to all buttons
const saveAircraftPlanformButton = document.getElementById("update-aircraft-planform");
const resetAircraftPlanformButton = document.getElementById("reset-aircraft-planform");
const calculateAircraftPlanformButton = document.getElementById("calculate-aircraft-planform");

// Accessing to the calculated input form
const calculatedPlanformParametersForm = document.getElementsByClassName("new-aircraft-planform-parameter-form")[0];

// Accessing to the Calculated input elements
const ratioChordWisePositionInputElement = document.getElementById("ratio-of-chordwise-position");
const taperRatioInputElement =  document.getElementById("taper-ratio");
const aspectRatioInputElement =  document.getElementById("aspect-ratio");
const meanAerodynamicChordInputElement = document.getElementById("mean-aerodynamic-chord");
const planformAreaInputElement = document.getElementById("planform-area");
const xCentroidLocationInputElement = document.getElementById("x-centroid-location");
const yMACLocationInputElement = document.getElementById("y-MAC-location");
const selectSweepAngleLocation = document.getElementById("select-sweep-angle-location");
const sweepAngleLocationInputElement = document.getElementById("sweep-angle-location-input");


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Adding Event Listener ~~~~~~~~~~~~~~~~~~~~~~~~~~~

aircraftPlanformElement.addEventListener('change',loadSelectedAircraftPlanformData);
userAircraftSelectElement.addEventListener('change',loadSelectedUserAircraft);

// Adding event listener to all the buttons 
saveAircraftPlanformButton.addEventListener('click',saveSelectedAircraftPlanformData);
resetAircraftPlanformButton.addEventListener('click',loadSelectedAircraftPlanformData);
calculateAircraftPlanformButton.addEventListener('click',calculateAircraftPlanform);

loadSelectUserAircrafts()



















// function resetAircraftPlanformData(){

//     if (aircraftPlanformElement.options[aircraftPlanformElement.selectedIndex].value == "horizontalTail") {

//         spanInputElement.value = selectedUserAircraft.horizontalTailSpan
//         rootChordInputElement.value = selectedUserAircraft.horizontalTailRootChord
//         tipChordInputElement.value = selectedUserAircraft.horizontalTailTipChord
//         sweepLeadingEdgeInputElement.value = selectedUserAircraft.horizontalTailSweepLeadingEdge

//     } else if (aircraftPlanformElement.options[aircraftPlanformElement.selectedIndex].value == "verticalTail") {

//         spanInputElement.value = selectedUserAircraft.verticalTailSpan
//         rootChordInputElement.value = selectedUserAircraft.verticalTailRootChord
//         tipChordInputElement.value = selectedUserAircraft.verticalTailTipChord
//         sweepLeadingEdgeInputElement.value = selectedUserAircraft.verticalTailSweepLeadingEdge

//     } else if (aircraftPlanformElement.options[aircraftPlanformElement.selectedIndex].value == "wing") {

//         spanInputElement.value = selectedUserAircraft.wingSpan
//         rootChordInputElement.value = selectedUserAircraft.wingRootChord
//         tipChordInputElement.value = selectedUserAircraft.wingTipChord
//         sweepLeadingEdgeInputElement.value = selectedUserAircraft.wingSweepLeadingEdge

//     }
// }