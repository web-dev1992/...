const {validationResult}=require('express-validator');
const path=require('path');
const fs=require('fs');
const Post=require('models/post');
const User=require('models/user');
exports.getPosts=(req,res,next)=>{
    const currentPage=req.query.page || 1;
    const perPage=2;
    let totalItems;
    Post.count()
    .then(count=>{
        totalItems=count;
        return Post.findAll
        ({ offset: (currentPage-1)* perPage // offset defines how many items should be skipped
            , limit: perPage  // limit defines how many item should be fetched
        })
    })
    .then(posts=>{      
        res.status(200)
        .json({ message:'posts fetched successfuly', posts,totalItems });
    })   
   .catch(err=>{
        if(! err.statusCode)
          {
              err.statusCode=500;
          }
          next(err);
    });
}

exports.createPost=(req,res,next)=>{
    const errors=validationResult(req);
    let creator;
    if(!errors.isEmpty()) throwError('the validation failed due to incorrect data',422);
    if(! req.file) throwError('No image provided',422);
    const imageUrl=req.file.path;
    console.log(`req.userId equals ${req.userId}`);
    User.findByPk(req.userId).then(user=>{
         return creator=user;
    }).then( req.user.createPost({
        title: req.body.title,
        content: req.body.content,
        imageUrl: imageUrl
    })
        ).then(result => {
            res.status(201).json({
                message:"post created successfuly",
                post:result,
                creator:{id:creator.userId,username:creator.username }
            });
        })
        .catch(err => {
          if(! err.statusCode)
          {
              err.statusCode=500;
          }
          next(err);
        });
    
    
}

exports.getPost=(req,res,next)=>{
    console.log('getpost');
    const postId=req.params.postId;
    console.log(postId);
    Post.findByPk(postId)
    .then(post=>{
        if(!post) throwError('Could not find post',404);
        res.status(200).json({message:'fetch post successfuly!', post});
        console.log(post);
       
    })
    .catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err);
    });
}


exports.updatePost=(req,res, next)=>{
    const postId=req.params.postId;
    const errors=validationResult(req);
    if(!errors.isEmpty())  throwError('the validation failed due to incorrect data',422);
    let title=req.body.title;
    let content=req.body.content;
    let imageUrl=req.body.image;
    if(req.file) { imageUrl=req.file.path; }
    if(! imageUrl){
        const error=new Error('Image file was not provided');
        error.statusCode=422;
        throw error;
    }
    Post.findByPk(postId)
    .then(post=>{
        if(post.userId !== req.userId) throwError('Not Authorized!',403);
         if(!post) throwError('Could not find post',404);
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title=title;
        post.content=content;
        post.imageUrl=imageUrl;
        return post.save();
        })
    .then(result=>{
            res.status(200).json({
                message:'Post updated successfuly',
                post:result
            });
        })
    .catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err);
    });

}


exports.deletePost=(req,res,next)=>{
    const postId=req.params.postId;
    Post.findByPk(postId)
    .then(post=>{
        if(post.userId !== req.userId) throwError('Not Authorized!',403);        
        if(!post)  throwError('Could not find post',404);
        clearImage(post.imageUrl);
        return post.destroy();
    })
    .then(result=>{
        console.log(result);
        res.status(200).json({message:'post deleted successfuly'});
    })
    .catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err);
    });


}

const clearImage=filePath=>{
    filePath=path.join(__dirname +'..'+ filePath);
    fs.unlink(filePath,err=>{console.log(err);});
}

const throwError=(message,code=500)=>{
    const error=new Error(message);
    error.statusCode=code;
    throw error;
}