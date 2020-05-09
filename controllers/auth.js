const User=require('models/user');
const {validationResult}=require('express-validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

exports.signup=(req, res, next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        const error=new Error('the validation failed due to incorrect data');
        console.log(errors);
        error.statusCode=422;
        error.data=errors.array();
        throw error;
       
    }
    const email=req.body.email;
    const username=req.body.name;
    const password=req.body.password;
    const user=new User({        
        username,
        email,
        password:bcrypt.hashSync(password,8)
    });
    //user.password=user.hashPassword(password);
    return user.save()
    .then(result=>{
        res.status(201).json({message:'user created successfuly', userId:result.id});
    })
    .catch(err => {
        if(! err.statusCode) { err.statusCode=500; }
        next(err);
      });

}

exports.login=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    let userLoaded;
    User.findOne({where:{email:email}})
    .then(user=>{
        if(!user){
            const error=new Error('User not found!');
            error.statusCode=401;
            error.data=errors.array();
            throw error;
        }
        userLoaded=user;
        return bcrypt.compareSync(password,user.password)
    }).then(isEqual=>{
        if(!isEqual){
            const error=new Error('Entered password is incorrect...');
            error.statusCode=401;
            error.data=errors.array();
            throw error;
        }
        const token=jwt.sign({
            email:userLoaded.email,
            username:userLoaded.username,
            userId:userLoaded.id
        },'jsonwebtokensecretkey',{expiresIn:'2h'});

        res.status(200).json({token,userId:userLoaded.id.toString()});

        }
    )
    .catch(err => {
        if(! err.statusCode) { err.statusCode=500; }
        next(err);
      });
}