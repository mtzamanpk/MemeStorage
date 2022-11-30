const express  = require( "express" );
const mongoose = require( "mongoose" );


// 1. Require dependencies /////////////////////////////////////////
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config();
////////////////////////////////////////////////////////////////////
var fs = require('fs');
var path = require('path');

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
// a common localhost test port
const port = 3000; 

// body-parser is now built into express!
app.use( express.urlencoded( { extended: true} ) ); 

// 2. Create a session. The secret is used to sign the session ID.
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());
////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");

// set up multer for storing uploaded files
  
var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });

var imgModel = require('./model');
// connect to mongoose on port 27017
mongoose.connect( "mongodb://0.0.0.0:27017/memes", { useNewUrlParser: true, useUnifiedTopology: true});


const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// plugins extend Schema functionality
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);


// 4. Add our strategy for using Passport, using the local user from MongoDB
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////////////////////////////////////////////////////////


// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://0.0.0.0:${port}`);
});


//here is where statis files are stores
app.use(express.static("public"))


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
});

var loginUser;

////////////////////////////////////////////////////////////////////////////////////

app.get('/meme', async(req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('./memes', { username: loginUser, items: items });
        }
    });
});


app.post( "/register", (req, res) => {
    var signupAuth = req.body["password"];
    
    console.log( "User " + req.body.username + " is attempting to register" );

    if(req.body["confirmPassword"] === signupAuth) {
        loginUser = req.body.username;

        User.register({ username : req.body.username }, 
            req.body.password, 
            ( err, user ) => {
                if ( err ) {
                    console.log( err );
                    res.redirect( "/" );
                } else {
                    passport.authenticate( "local" )( req, res, () => {
                        res.redirect( "/meme" );
                    });
                }
            }
        );
    }
    else {
        res.redirect( "/" );
    }
});

app.post( "/login", ( req, res ) => {``
    loginUser = req.body.username;

    console.log( "User " + req.body.username + " is attempting to log in" );
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });
    req.login ( user, ( err ) => {
        if ( err ) {
            console.log( err );
            res.redirect( "/" );
        } else {
            passport.authenticate( "local" )( req, res, () => {
                res.redirect( "/meme" ); 
            });
        }
    });
});

app.get('/logout', function(req, res, next) {
    loginUser = null;

    req.logout(function(err) {
      if (err) { 
          return next(err); 
      }
      res.redirect('/');
    });
});

 // the POST handler for processing the uploaded file
  
app.post('/meme', upload.single('image'), (req, res, next) => {
   
    var obj = {
        username: req.user.username,
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/meme');
        }
    });
});
//User.register({ username: "user1" },  "1")
 //User.register({ username: "user2" }, "2");