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

// Response when listen to /edit-new/:id
app.get('/edit-new/:id', (id,res) => {
    res.render('edit/edit-new')
})

// Response when listen to /news/:id
app.get('/news/:id', (req,res) => {
    res.render('detail/news_detail')
});

app.get('/user-info/:id', (req,res) => {
    res.render("user/user_info.ejs")
});

// Response when listen to create-news
app.get('/create-news', (req,res) => {
    res.render('create/create_news');
});

// Response when listen to create your aircraft
app.get('/create-your-aircraft', (req,res) => {
    res.render('create/create_your_aircraft');
});

// Response when listen to create-updates
app.get('/create-updates',(req,res) => {
    res.render('create/create-updates');
});

app.get('/add-members', (req,res) => {
    res.render('add/add-members');
});

// Response when listen to Sign Up
app.get('/signUp', (req,res) => {
    res.render('auth/signUp.ejs');
});

app.get('/signIn', (req,res) => {
    res.render('auth/signIn.ejs');
})

app.get('/determine-conventional-straight-tapered-planform', (req,res) => {
    res.render('products/Aircraft/cal-con-stra-tapered-plan.ejs');
});

app.get('/', (req,res) => {
    res.render('index.ejs');
});




exports.app = functions.https.onRequest(app);



