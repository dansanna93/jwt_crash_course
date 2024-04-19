const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {users} = require('../db');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

router.post('/signup', [
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Password cannot be shorter than 5 characters').isLength({min: 6})],
    async (req, res) => {
    const {email, password} = req.body;

    //Input Validation
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    
    //Validate if user doesn't already exist
    let user = users.find((user) => {
        return user.email === email
    });
    
    if(user) {
        return res.status(400).json({
            "errors": [
                {"msg": "User already exists"}]
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        email,
        password: hashedPassword
    });

    const token = await JWT.sign({
        email
    }, 'bd7683e2gbdy823bd28db82bduiwdbd2783dbu32ib87', {
        expiresIn: 3600000
    });

    res.json({token});
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    let user = users.find((user) => {
        return user.email === email;
    });

    if(!user) {
        return res.status(400).json({
            "errors": [
                {"msg": "Invalid Credentials"}]
        })
    };

    let isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.status(400).json({
            "errors": [
                {"msg": "Invalid Credentials"}]
        })
    };

    const token = await JWT.sign({
        email
    }, 'bd7683e2gbdy823bd28db82bduiwdbd2783dbu32ib87', {
        expiresIn: 3600000
    });

    res.json({token});
});




router.get('/all', (req, res) => {
    res.json(users);
});

module.exports = router;