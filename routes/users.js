const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User')

//Login page
router.get('/login',(req, res) => res.render('login'));

//Rgister page
router.get('/register',(req, res) => res.render('register'));

router.post('/register', (req, res)=>{
                    const {name, email, password, password2} = req.body;
                    let errors =[]

                    //check email fields
                    if(!name || !email || !password || !password2){
                                        errors.push({msg: 'Please fill in all fields'})
                    }

                    //check password
                    if(password !== password2){
                                        errors.push({msg: 'Passwords do not match'})
                    }
                    //check password length
                    if(password.length < 6){
                                        errors.push({msg:'Passwords should be at least six characters'})
                    }
                    if(errors.length > 0){

                                        res.render('register',{
                                                            errors,
                                                            name,
                                                            email,
                                                            password,
                                                            password2
                                        })
                    }else{
                                        //Validation passed
                                        User.findOne({email:email})
                                        .then(user =>{
                                                            if(user){ 
                                                                                errors.push({msg:'Email already exist'})
                                                                                res.render('register',{
                                                                                                    errors,
                                                                                                    name,
                                                                                                    email,
                                                                                                    password,
                                                                                                    password2
                                                                                });
                                        
                                                            }else{
                                                                                const newUser = new User({
                                                                                                    name,
                                                                                                    email,
                                                                                                    password

                                                                                });
                                                                                //hashed password
                                                                                bcrypt.genSalt(10, (err, salt)=>
                                                                                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                                                                                                    if (err)throw err
                                                                                                    newUser.password = hash;
                                                                                                    newUser.save()
                                                                                                     .then(user =>{
                                                                                                                        req.flash('success_msg',  'Welcome aboard chatmate')
                                                                                                                        res.redirect('/users/login')
                                                                                                     })
                                                                                                     .catch(err => console.log(err))
                                                                                }))

                                                            }
                                        });
                    }
});
//Handle Login
router.post('/login', (req, res, next)=>{
                    passport.authenticate('local', {
                                        successRedirect:'/dashboard',
                                        failureRedirect:'/users/login',
                                        failureFlash: true
                    })(req, res, next);
})


module.exports = router
