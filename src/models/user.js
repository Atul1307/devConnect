const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email address is not valid');
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Gender data is not valid');
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('photo URL is not valid');
        }
      },
    },
    about: {
      type: String,
      default: 'This is a default about of our user',
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'DEV@CONNECT$0814', {
    expiresIn: '7d',
  });
  return token;
};

userSchema.methods.validatePassword = async function (userInput) {
  const user = this;
  const passwordHash = this.password;

  const isPasswordValid = await bcrypt.compare(userInput, passwordHash);
  return isPasswordValid;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
