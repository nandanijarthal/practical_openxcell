const db = require("../models");
const Post = db.post;
const {
  Validator
} = require("node-input-validator");
const comment = require("../models/comment");

exports.createPost = async (req, res) => {
  try {
    let user_id = req.userId;
    let valid = new Validator(req.body, {
      name: 'required',
      topic_id: 'required'

    });
    let matched = await valid.check();
    if (!matched) {
      let validatorError = parseValidate(valid.errors);
      return res.status(400).send({
        message: validatorError,
      });
    }
    const post = new Post({
      name: req.body.name,
      topic_id: req.body.topic_id,
      description: req.body.description,
      user_id: user_id
    });
    let postInst = await post.save();
    if (!postInst) {
      return res.status(500).send({
        message: "Post not created"
      });
    }
    res.status(200).send({
      data: postInst,
      message: "Topic created"
    });
  } catch (e) {
    return res.status(500).send({
      message: e.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let filter = {};
    let sortBy, sortWith;
    let limit = parseInt(req.query.limit);
    let page = Math.max(0, req.query.page);
    filter.status = true;
    filter.deletedAt = null;
    if (req.query.order) {
      sortBy = req.query.order_by || -1;
      if (req.query.order === "createdAt") {
        sortWith = {
          createdAt: parseInt(sortBy),
        };
      } else {
        sortWith = {
          name: parseInt(sortBy),
        };
      }
    }
    let posts = await Post.find(filter)
      .sort(sortWith)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("comments");
    if (!posts) {
      return res.status(500).send({
        message: "posts not found",
      });
    }

    return res.status(200).send({
      data: posts,
      message: "Successfully get all posts",
    });
  } catch (e) {
    return res.status(500).send({
      message: e.message,
    });
  }
};