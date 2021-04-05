const db = require("../models");
const Comment = db.comment;
const {
  Validator
} = require("node-input-validator");

exports.addComment = async (req, res) => {
  try {
    let user_id = req.userId;
    let valid = new Validator(req.body, {
      comment: 'required',
      post_id:'required'

    });
    let matched = await valid.check();
    if (!matched) {
      let validatorError = parseValidate(valid.errors);
      return res.status(400).send({
        message: validatorError,
      });
    }
    const comment = new Comment({
      comment: req.body.comment,
      post_id: req.body.post_id,
      user_id: user_id
    });
    let commentInst = await comment.save();
    if (!commentInst) {
      return res.status(500).send({
        message: "Comment not created"
      });
    }
    res.status(200).send({
      message: "Comment created"
    });
  } catch (e) {
    return res.status(500).send({
      message: e.message,
    });
  }
};