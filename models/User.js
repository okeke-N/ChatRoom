const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
                    name:{
                                        type:String,
                                        required: true
                    },
                    email:{
                                        type:String,
                                        required: true
                    },
                    pssword:{
                                        type:String,
                                        required: true
                    },
                    date:{
                                        type:String,
                                        default:Date.now
                    },
                    
                    
});
const User =mongoose.model('User', UserSchema)
module.exports =User;