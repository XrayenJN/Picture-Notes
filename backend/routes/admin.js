const router = require('express').Router();
let Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.route('/').get((req, res) => {
    Admin.find()
        .then(admins => res.json(admins))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/add').post(async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const newAdmin = new Admin({
        username: req.body.username,
        email: req.body.email,
        password,
    });

    newAdmin.save()
        .then(() => res.json('Admin added!'))
        .catch(err => {res.status(400).json('Error: ' + err)})
})

router.route('/login').post(async(req, res) => {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(400).json("Email is wrong");

    const validPassword = await bcrypt.compare(req.body.password, admin.password)
    if(!validPassword) return res.status(400).json("Password is wrong")

    const token = jwt.sign({
        adminname: admin.adminname,
        id: admin._id,
    },
    process.env.TOKEN_SECRET
    );

    res.header('auth-token', token).json({
        token
    })
})

module.exports = router;