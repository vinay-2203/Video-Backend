const express = require('express');
const router = express.Router();
const { addFriendsValidation, FriendValidation } = require('/Users/vinaykumar/Desktop/Product/video calling/backend/Validations/FriendsValidation.js');
const Friend = require('/Users/vinaykumar/Desktop/Product/video calling/backend/Model/Friend.js');
const User = require("../Model/User")
const authMiddleware = require('../Authmiddleware/authmiddleware');
const { message } = require('../Validations/Validation');
// const { default: AddFriend } = require('../../frontend/src/landingpage/chatting/AddFriend');




// Add Friends
router.post('/AddFriend', authMiddleware, async (req, res) => {
    try{
    const number = req.body.Number;
    const userId = req.userId.toString();
    console.log(userId)
    const friend = await User.findOne({ Number: number });
    if (!friend) {
        return res.status(404).json({ error: `No user found with number : ${number} in this website` });
    }
    const friend_Id = friend._id;

    

    const friend_data = {
        friendId: friend_Id.toString(),
        Name: req.body.Name,
        Number: req.body.Number,
        relation: req.body.Relation,
    }
    const {error} = addFriendsValidation.validate({userId,friends:[friend_data]});
    if(error){
        return res.status(400).json({success:false,message:error.details[0].message});
    }
    let userfriend = await Friend.findOne({ userId });
    if(userfriend) return res.status(201).json({success:true,message:"Friend is Already Added"})
    if (!userfriend) {
        userfriend = new Friend({ userId, friends: [] });
    }

    userfriend.friends.push(friend_data);
    
    await userfriend.save();
    res.status(201).json({success:true,message:"Friend added",data:userfriend})
}catch(err){
    console.error(err);
    res.status(500).json({success:false,message:"Sever error",error:err.message});
}
});

// Get Friends List for a User
router.get("/friends-list",authMiddleware,async(req,res)=>{
    console.log("Friends")
    const userId = req.userId;
    try{
        const userFriends = await Friend.findOne({userId});
        if(!userFriends){
            return res.status(404).json({
                success:false,
                message:"No friends found for this user"
            });
        }

        const friendArray = userFriends.friends;
        res.status(200).json({success:true,userId:userId,friends:friendArray});
    }catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:'Sever error',
            error:err.message
        })
    }
})


module.exports = router;
