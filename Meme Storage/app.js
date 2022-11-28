const express  = require( "express" );
const mongoose = require( "mongoose" );

const fs = require("fs");

// this is a canonical alias to make your life easier, like jQuery to $.
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
require("dotenv").config();
/////////////////////////////////////////////////////////////////////////////

// this is a canonical alias to make your life easier, like jQuery to $.
const app = express(); 
// a common localhost test port
const port = 3000; 

app.use( express.urlencoded( { extended: true} ) ); 

// 2. Create a session. The secret is used to sign the session ID.
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use (passport.initialize());
app.use (passport.session());
/////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");

// connect to mongoose on port 27017
mongoose.connect( "mongodb://0.0.0.0:27017/memes", { useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// plugins extend Schema functionality
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
/////////////////////////////////////////////////////////////////////////////
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////////////////////////////////////////////

// Simple server operation
app.listen (port, () => {
    // template literal
    console.log (`Server is running on http://0.0.0.0:${port}`);
});
/////////////////////////////////////////////////////////////////////////////
app.use(express.static("public"))


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/log.ejs")
});

var loginUser;
/////////////////////////////////////////////////////////////////////////////

app.get("/main", function(req, res){
    res.render("main");
})

app.get("/join", function(req, res){
    res.render("log");
})

app.get("/create", function(req, res){
    username = req.body["name"];
    res.render("create");
})

app.post( "/login", ( req, res ) => {
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
                res.redirect( "/main"); 
            });
        }
    });
});

// 8. Logout ///////////////////////////////////////////////////////
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
          return next(err); 
      }
      res.redirect('/');
    });
  });
  ////////////////////////////////////////////////////////////////////
  
app.post( "/register", (req, res) => {
    var signupAuth = req.body["authentication"];

    console.log( "User " + req.body.username + " is attempting to register" );

    if(process.env.AUTHENTICATION == signupAuth) {
        loginUser = req.body.username;

        User.register({ username : req.body.username }, 
            req.body.password, 
            ( err, user ) => {
                if ( err ) {
                    console.log( err );
                    res.redirect( "/" );
                } else {
                    passport.authenticate( "local" )( req, res, () => {
                        res.redirect( "/main" );
                    });
                }
            }
        );
    }
    else {
        res.redirect( "/" );
    }
});

// User.register({ username: "user1" },  "1")