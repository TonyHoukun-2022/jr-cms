/**
 * @firstName: String
 * @lastName: String
 * @email: String
 */

//data validation libraries =>
//joi, express-validator

const mongoose = require("mongoose");
const joi = require("joi");

const Model = mongoose.model(
  "Student",
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 10,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (email) => {
          //传入email, email必须是字符串且不为空，email必须符合valid email address
          //保证不要有error属性
          const validation = joi.string().email().validate(email);
          const { error } = validation;
          if (error) {
            return false;
          }
          return true;

          //相当于
          // return !joi.string().email().validate(email).error
        },
        msg: "Invalid email message",
      },
    },
    //one student can have many courses => 1:M
    courses: [
      {
        //type 必须与course document 的 _id 类型一样
        type: String,
        ref: "Course", //reference to Course model
      },
    ],
  })
);

module.exports = Model;
