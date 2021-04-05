const db = require("../models");
const Topic = db.topic;
const {
  Validator
} = require("node-input-validator");

exports.createTopic = async (req, res) => {
  try {
    let valid = new Validator(req.body, {
      name: "required",
    });
    let matched = await valid.check();
    if (!matched) {
      let validatorError = parseValidate(valid.errors);
      return res.status(400).send({
        message: validatorError,
      });
    }
    let isExist = await Topic.findOne({
      name: req.body.name,
    });
    if (isExist) {
      return res.status(500).send({
        message: "Topic already exist",
      });
    }
    const topic = new Topic({
      name: req.body.name
    });
    let topicInst = await topic.save();
    if (!topicInst) {
      return res.status(500).send({
        message: "Topic not created"
      });
    }
    res.status(200).send({
      data: topicInst,
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
    let topics = await Topic.find(filter)
      .sort(sortWith)
      .limit(limit)
      .skip((page - 1) * limit);
    if (!topics) {
      return res.status(500).send({
        message: "Topic not found",
      });
    }
    return res.status(200).send({
      data: topics,
      message: "Successfully get all topic",
    });
  } catch (e) {
    return res.status(500).send({
      message: e.message,
    });
  }
};