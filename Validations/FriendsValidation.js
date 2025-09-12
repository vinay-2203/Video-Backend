const joi = require('joi');
const { default: mongoose } = require('mongoose');
const { relative } = require('path');

const FriendValidation = joi.object({
    friendId: joi.string()
    .required()
    .custom((value,helpers)=>{
        if(!mongoose.Types.ObjectId.isValid(value)){
            return helpers.error("any.invalid")
        }
        return value;

    },"ObjectId validation"),
    Name:joi.string().min(2).max(50).required(),
    Number: joi.number().min(1000000000).max(9999999999).required(),
    relation: joi.string().min(2).max(30).required()

});

const addFriendsValidation = joi.object({
  userId: joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation"),
  
  friends: joi.array().items(FriendValidation).default([])
});

module.exports = { addFriendsValidation, FriendValidation};