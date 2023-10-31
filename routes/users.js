const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User =require('../models/User');


//login 
router.get("/login", (req, res)=> res.render('login'));


//register
router.get("/register", (req, res)=> res.render('register'));

//register handle
router.post('/register', (req, res)=>{
                    const{ name, email, password} = req.body;
                    let errors =[];

                    //check required fields
                    if( !email || !password){
                                        errors.push({msg: 'Please fill in all fields'})

                    }
                    //check password length
                    if(password.length < 6){
                                        errors.push({msg: 'Password should be at least six chracters'})
                    }
                    if (errors.length < 0){
                                        res.render('register',{
                                                            errors,
                                                            name,
                                                            email,
                                                            password
                                        });

                    }else{
                                        //Validation passed
                                        User.findOne({email:email})
                                        .then(user =>{
                                                            if(user){
                                                                                //user exist
                                                                                errors.push({msg: 'Email is already registered'})
                                                                                res.render('register',{
                                                                                                    errors,
                                                                                                    name,
                                                                                                    email,
                                                                                                    password
                                                                                });
                                        
                                                            }else{
                                                                                const newUser =new User({
                                                                                                    name,
                                                                                                    email,
                                                                                                    password
                                                                                });
                                                                                //harshed password
                                                                                bcrypt.genSalt(10, (err, salt)=>bcrypt.harsh(newUser.password, salt, (err, hash) =>{
                                                                                                    if(err) throw err;

                                                                                                    //hashed password
                                                                                                    newUser.password =hash;

                                                                                                    //Save user
                                                                                                    newUser.save()
                                                                                                    .then(user =>{
                                                                                                                        req.flash('success_msg', 'Welcome aboard chatmate')
                                                                                                                        res.redirect('/users/login');
                                                                                                    })
                                                                                                    .catch(err => console.log(err));

                                                                                }))

                                                            }
                                        });

                    }

                    
});
//Login Handle

router.post('/login', (req, res, next)=>{
                    passport.authenticate('local', {
                                        successRedirect: '/dashboard',
                                        failureRedirect: 'users/login',
                                        failureFlash: true,
                    })(req, res, next);

});

//Logout handle
router.get('/logout', (req, res, next)=>{
                    req.logout();
                    req.flash('success_msg', 'sucessfiully loged out');
                    res.redirect('/users/login');
});


module.exports = router