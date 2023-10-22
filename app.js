const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisourtopsecrets.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    async function checkUser() {
        try {
            const foundUser = await User.findOne({email: username});
            if(foundUser) {
                if(foundUser.password === password) {
                    res.render("secrets");
                } else {
                    console.log("You have entered wrong password!!!");
                    res.redirect("/login");
                }
            } else {
                console.log("No User Found!!!");
                res.redirect("/login");
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    checkUser();
});

app.get("/register", (req, res) => {
    res.render("register");
});


app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    async function saveNewUser() {
        try {
            newUser.save();
            res.render("secrets");
        } catch (error) {
            console.log(error.message);
        }
    }
    saveNewUser();
});

app.listen(3000, () => {
    console.log("The server has started on port 3000");
})