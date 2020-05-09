const express=require('express');
const {body}=require('express-validator');
const router=express.Router();
const user=require('models/user');
const authController=require('controllers/auth');
router.put('/signup',[
    body('email').isEmail().withMessage('Email is incorrect')
    .custom((value ,{ req})=>{
            return user.findOne({ where:{email: value}})
            .then(user=>{
                if(user)  return Promise.reject('E-Mail is already exists!');
            });
            
    }).normalizeEmail(),
    body('password').trim().isLength({min :5}),
    body('name').trim().not().isEmpty()
],authController.signup);
router.post('/login',authController.login)

module.exports=router;