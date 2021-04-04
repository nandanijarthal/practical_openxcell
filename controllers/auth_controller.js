const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const tokenService = require("../services/tokenService")
const mailService = require("../services/mailService")
require('dotenv').config();
const {
    Validator
} = require('node-input-validator');

exports.signIn = async (req, res) => {
    try {
        let valid = new Validator(req.body, {
            email: 'required|email',
            password: 'required'
        });
        let matched = await valid.check();
        if (!matched) {
            let validatorError = parseValidate(valid.errors);
            return res.status(400).send({
                'message': validatorError
            });
        }
        let user = await User.findOne({
            email: req.body.email
        })
        if (!user) {
            return res.status(400).send({
                message: "user not found"
            });
        }
        const checkPass = await bcrypt.compare(req.body.password, user.password);
        if (!checkPass) {
            return res.status(400).send({
                "message": "invalid Login"
            });
        }
        var token = await tokenService.createJwtToken(user.id)
        return res.status(200).send({
            data: user,
            access_token: token,
            message: "Successfully logged in"
        })

    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
}

exports.signUp = async (req, res) => {
    try {
        let valid = new Validator(req.body, {
            name: 'required',
            email: 'required|email',
            password: 'required'
        });
        let matched = await valid.check();
        if (!matched) {
            let validatorError = parseValidate(valid.errors);
            return res.status(400).send({
                'message': validatorError
            });
        }
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });
        let userInst = await user.save();
        if (!userInst) {
            return res.status(500).send({
                message: "user not created"
            });
        }
        let mailData = {
            to_email: user.email,
            subject: "Welcome",
        }
        await mailService.sendMail(mailData)
        return res.status(200).send({
        message: "User registered"
        })

    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
}
