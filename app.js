const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const cluster = require('cluster');
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// not using cookies for now and using bcrypt

// app.use(session({
//     secret: "I am the King.",
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());


let dbConnection = 'mongodb+srv://gagan:JdFgagankingmkltGM0BkpTVA@thakurjii.cclgvbd.mongodb.net/travellerDB';
mongoose.connect(dbConnection, {useNewUrlParser: true});


const travellerSchema = {
    name: {
        type: String,
        // required: [true]
    },
    number: {
        type: Number,
        // required: [true, "Number is required"]
    },
    place: [
        {
            type: String,
            // required: [true, "Place is required"]
        }
    ],
    date: {
        type: Date,
        // required: [true, "Date is required"]
    }
};

const userSchema = new mongoose.Schema({name: String, email: String, password: String});

// userSchema.plugin(passportLocalMongoose)


const Traveller = mongoose.model("Traveller", travellerSchema);
const User = mongoose.model("User", userSchema);


// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
    res.render("home1");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/home", function (req, res) {
    res.render("home");
});


app.post("/register", function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({name: req.body.name, email: req.body.username, password: hash});
        User.findOne({email: newUser.email}).then((foundUser) => {
            if (foundUser) {
                res.render("login1");
            } else {
                newUser.save().then(function (err) {
                    res.render("home");
                });
            }
        });
    });
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;


    User.findOne({email: username}).then((foundUser) => {
        if (foundUser) {
            bcrypt.compare(password, foundUser.password, function (err, result) {
                if (result === true) {
                    res.render("home");
                } else {
                    res.render("login2");
                }
            });
        }
    });
});


// const filter = { Traveller: /chennai/i };
// const travName = req.body.newName;
// const travNumber = req.body.newNumber;
// const travPlace = req.body.newPlace;
// const travDate = req.body.newDate;
// const item = new Traveller({
//     name: travName,
//     number: travNumber,
//     place: travPlace,
//     date: travDate
// });

//
// User.find({email: {$regex: regex, $options: "i"}});
// var regex = new RegExp(req.body.newPlace);


app.post("/", function (req, res) {


    const travName = req.body.newName;
    const travNumber = req.body.newNumber;
    const travPlace = req.body.newPlace;
    const travDate = req.body.newDate;

    const item = new Traveller({name: travName, number: travNumber, place: travPlace, date: travDate});
    item.save();
    // console.log(travPlace + " outside");


    res.redirect("/data");

});


app.get("/data", function (req, res) {

    Traveller.find().sort({place:1, name: 1, date: 1}).then((foundTrav) => {
        res.render("data", {newtravellers: foundTrav});
    });

    // console.log(travPlace + " inside ");

});


app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/about1", function (req, res) {
    res.render("about1");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/testing", function (req, res) {
    res.render("testing");
});


// let port = process.env.PORT;
// if(port==null || port==""){
//     port=4000;
// }

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// app.listen(process.env.PORT || 3000, function(){
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });

// app.get("/system/reboot", (req, res)=> {
// process.exit(1)
// })


// console.log("This is pid " + process.pid);
// setTimeout(function () {
//     process.on("exit", function () {
//         require("child_process").spawn(process.argv.shift(), process.argv, {
//             cwd: process.cwd(),
//             detached : true,
//             stdio: "inherit"
//         });
//     });
//     process.exit();
// },2000);

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => console.log(`Application is listening on port ${PORT}!`));
// console.log("This is pid " + process.pid);
// setTimeout(function () {
//     process.on("exit", function () {
//         require("child_process").spawn(process.argv.shift(), process.argv, {
//             cwd: process.cwd(),
//             detached : true,
//             stdio: "inherit"
//         });
//     });
//     process.exit();
// }, 5000);


// const trav1 = new Traveller({
//     name: "Gagan",
//     number: 12,
//     place: "Banglore",
//     date: 29/11/2003
// });

// const trav2 = new Traveller({
//     name: "awesome",
//     number: 12,
//     place: "Banglore",
//     date: 29/11/2003
// });
// const trav3 = new Traveller({
//     name: "Hello",
//     number: 12,
//     place: "Banglore",
//     date: 29/11/2003
// });

// const defaulttrav = [trav1,trav2,trav3];


// Traveller.insertMany(defaulttrav).then((trav)=>{
//     console.log(trav);
// }).catch((err)=>{
//     console.log(err);
// });


// app.get ("/list", async (req, res) =>{
// try {
// let match = {};
// if (req.query.keyword) {
// match.title = new RegExp(req.query.keyword, "¡");
// }
// if (req.query.year) {
// match.year = parseInt(req.query.year);
// }
// const response = await Book.aggregate([{ $match: match }]);

// res. send (response);
// } catch (error) {
// res.status(500).send(error);
// }
// });
