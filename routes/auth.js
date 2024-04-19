const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const {users} = require('../db');

router.post('/signup', [
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Password cannot be shorter than 5 characters').isLength({min: 6})
], (req, res) => {
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
    res.send('<h1>Validation passed</h1>');
});

module.exports = router;