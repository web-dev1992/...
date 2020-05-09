const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    const authHeader=req.get('Authorization');
    let loadedToken;
    if(!authHeader){
        const error=new Error('Not Authenticated');
        error.statusCode=401;
        throw error;
    }
    const token=authHeader.split(' ')[1];
    try{
        loadedToken=jwt.verify(token,'jsonwebtokensecretkey');
    }catch(err){
        err.statusCode=500;
        throw err;
    }
    if(!loadedToken){
        const error=new Error('Not Authenticated');
        error.statusCode=401;
        throw error;
    }
    req.userId=loadedToken.userId;
    if(req.userId){console.log('user id:'+req.userId);}else{console.log('undefined');}
    
    next();
}