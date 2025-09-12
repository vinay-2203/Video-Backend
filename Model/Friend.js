const mongoose = require('mongoose');
const { type } = require('os');
const {Schema} = mongoose;

const FriendSchema = new Schema ({
    userId: {type: mongoose.Schema.Types.ObjectId, ref : 'User'},
    friends : [
        {

            friendId: {type: mongoose.Schema.Types.ObjectId,ref:'User'},
            Name: {type: String , required:true},
            Number:{type:Number,required:true},
            relation:{type:String,required:true}
        }
    ]
})

const Friends = mongoose.model("Friends",FriendSchema);
module.exports = Friends;