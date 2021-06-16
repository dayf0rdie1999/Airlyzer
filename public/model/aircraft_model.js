class Aircraft {
    constructor(wingSpan,wingRootChord,wingTipChord,wingSweepLeadingEdge,horizontalTailSpan,horizontalTailRootChord,horizontalTailTipChord,horizontalTailSweepLeadingEdge,verticalTailSpan,verticalTailRootChord,verticalTailTipChord,verticalTailSweepLeadingEdge,fuselageWettedArea,fuselageVolume) {
        this.wingSpan = wingSpan;
        this.wingRootChord = wingRootChord;
        this.wingTipChord = wingTipChord;
        this.wingSweepLeadingEdge = wingSweepLeadingEdge;
        this.horizontalTailSpan = horizontalTailSpan;
        this.horizontalTailRootChord = horizontalTailRootChord;
        this.horizontalTailTipChord = horizontalTailTipChord;
        this.horizontalTailSweepLeadingEdge = horizontalTailSweepLeadingEdge;
        this.verticalTailSpan = verticalTailSpan;
        this.verticalTailRootChord = verticalTailRootChord;
        this.verticalTailTipChord = verticalTailTipChord;
        this.verticalTailSweepLeadingEdge = verticalTailSweepLeadingEdge;
        this.fuselageWettedArea = fuselageWettedArea;
        this.fuselageVolume = fuselageVolume;
    }
}

// Firestore data converter
var aircraftConverter = {
    toFirestore: function(aircraft) {
        return {
            wingSpan : aircraft.wingSpan,
            wingRootChord : aircraft.wingRootChord,
            wingTipChord : aircraft.wingTipChord,
            wingSweepLeadingEdge : aircraft.wingSweepLeadingEdge,
            horizontalTailSpan : aircraft.horizontalTailSpan,
            horizontalTailRootChord : aircraft.horizontalTailRootChord,
            horizontalTailTipChord : aircraft.horizontalTailTipChord,
            horizontalTailSweepLeadingEdge : aircraft.horizontalTailSweepLeadingEdge,
            verticalTailSpan : aircraft.verticalTailSpan,
            verticalTailRootChord : aircraft.verticalTailRootChord,
            verticalTailTipChord : aircraft.verticalTailTipChord,
            verticalTailSweepLeadingEdge : aircraft.verticalTailSweepLeadingEdge,
            fuselageWettedArea : aircraft.fuselageWettedArea,
            fuselageVolume : aircraft.fuselageVolume
        };
    },
    
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new Aircraft(data.wingSpan, data.wingRootChord, data.wingTipChord,data.wingSweepLeadingEdge,data.horizontalTailSpan,data.horizontalTailRootChord,data.horizontalTailTipChord,data.horizontalTailSweepLeadingEdge,data.verticalTailSpan,
            data.verticalTailRootChord,data.verticalTailTipChord,data.verticalTailSweepLeadingEdge,data.fuselageWettedArea,data.fuselageVolume);
    }
};
