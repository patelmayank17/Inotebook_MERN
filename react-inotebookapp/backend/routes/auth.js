require('dotenv').config({ path: './.env.local' });
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

// Create a User using: POST api and no login required
router.post('/createuser', [
    body('name', 'Enter valid name!').isLength({ min: 3 }),
    body('email', 'Enter valid email!').isEmail(),
    body('password', 'Password must be atleast 5 characters!').isLength({ min: 5 })
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Check whether email already exists in DB
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry email already exists!' })
        }

        // added security by hashing and salting 
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create new user in db 
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        // generating authtoken using jwt
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        res.json({ success, authtoken })
        //res.json(user);
        //res.json({ 'msg': req.body.email + ' User is created' })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured!");
    }
    // .then(user => res.json(user))
    // .catch(err => {
    //     console.log(err)
    //     res.json({ error: 'Please enter a unique value for email', message: err.message })
    //  })

    //console.log(req.body)
    //const user = User(req.body);
    //user.save()
    //res.send(req.body);
});

// creating login endpoint
router.post('/login', [
    body('email', 'Enter valid email!').isEmail(),
    body('password', 'Password cannot be blank!').exists()
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success, errors: "Please try to login by correct crendentials!" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ success, errors: "Please try to login by correct crendentials!" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        success = true
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);

        res.json({ success, authtoken });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured!");
    }
})

// creating getuser endpoint using middleware called fetchuser
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error Occured!");
    }
})

module.exports = router