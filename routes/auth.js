const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {users} = require('../db');
const bcrypt = require('bcrypt');

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
        res.status(400).json({
            "errors": [
                {"msg": "User already exists"}]
        })
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    users.push({
        email,
        password: hashedPassword
    });
    res.send('<h1>Validation passed</h1>');
});

router.get('/all', (req, res) => {
    res.json(users);
});

module.exports = router;