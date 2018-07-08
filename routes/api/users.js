const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//load User model
const User = require("../../models/User");

//@route  GET api/users/test
//@desc   tests users route
//@access public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

//@route  POST api/users/register
//@desc   register users
//@access public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar =
        "https://res.cloudinary.com/bimpongcdn/image/upload/v1530663306/ic_account_circle_24px.png";

      const newUser = new User({
        name: req.body.name,
        avatar,
        email: req.body.email,
        id_number: req.body.id_number,
        phone: req.body.phone,
        course: req.body.course,
        session: req.body.session,
        level: req.body.level,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route  POST api/users/login
//@desc   login users
//@access public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then(user => {
    //check if user exists
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched
        const payload = {
          id: user.id,
          name: user.name,
          id_number: user.id_number,
          avatar: user.avatar
        }; //payload for jwt
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route  GET api/users/current
//@desc   return current user
//@access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      id_number: req.user.id_number
    });
  }
);

module.exports = router;

/*const newUser = new User({
  name: req.body.name,
  email: req.body.email,
  id_number: req.body.id_number,
  phone: req.body.phone,
  course: req.body.course,
  session: req.body.session,
  level: req.body.level,
  password: req.body.password
});*/
