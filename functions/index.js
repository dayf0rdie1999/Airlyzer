const functions = require("firebase-functions");
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);


const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// Setting app view engine
app.set('views','./views');
app.set('view engine', 'ejs');


app.get('/about', (req,res) => {
    res.render(`about`);
});

app.get('/', (req,res) => {
    res.send("index.html");
});

// Response when listen to /news/:id
app.get('/news/:id', (req,res) => {
    res.send("Hello World");
});

// Response when listen to create-news
app.get('/create-news', (req,res) => {
    res.render('create_news');
});


// Response when listen to create-updates
app.get('/create-updates',(req,res) => {
    res.render('create-updates');
});


exports.app = functions.https.onRequest(app);



