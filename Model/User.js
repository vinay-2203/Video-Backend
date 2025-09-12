const mongoose = require('mongoose')
const { Schema } = mongoose;


const Userschema = new Schema ({

    Name: { type: String, required: true },
    Age: { type: Number, min: 16 },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Number: Number,
    Country: String,
    City: String,
    PinCode: Number
},
    { timestamps: true }
);

const User = mongoose.model('User', Userschema);

module.exports = User;