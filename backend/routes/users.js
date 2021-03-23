const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/add').post(async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password,
    });

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => {res.status(400).json('Error: ' + err)})
})

router.route('/login').post(async(req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("Email is wrong");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).json("Password is wrong")

    const token = jwt.sign({
        username: user.username,
        id: user._id,
    },
    process.env.TOKEN_SECRET
    );

    res.header('auth-token', token).json({
        message: 'yey',
        token
    })
})

module.exports = router;