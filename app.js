const path=require('path');
const express=require('express');
const app=express();
const http=require('http');
const bodyParser=require('body-parser');
const multer=require('multer');
const port=process.env.PORT || 8000;
const sequelize=require('models/connection');
const post=require('models/post');
const user=require('models/user');
const feed=require('routes/feed');
const auth=require('routes/auth');


module.exports=class Application
{
    constructor(){
        this.setupExpress();
        //this.setupSequelize();
        this.setConfigs();
        this.setRouters();
    }
    setupSequelize(){
        post.belongsTo(user,{constraints:true, onDelete:'CASCADE'});
        user.hasMany(post);
        sequelize.sync({alter:true})
        .then(result=>{
            console.log(result);            
        }).catch(err=>{
            console.log(err);
        }); 
    }
    setupExpress(){
            const server=http.createServer(app);
            server.listen(port,()=>console.log(`Listenning on port ${port}`));
        }
    setConfigs(){
        const fileStorage=multer.diskStorage({
            destination:(req,file,cb)=>{
                cb(null,'images');
            },
            filename:(req, file, cb)=>{
                cb(null, new Date().toISOString()+'_'+file.originalname);
            }
        });
        const fileFilter=(req, file, cb)=>{
            if(file.mimetype=== 'image/png' 
            || file.mimetype==='image/jpg' 
            || file.mimetype==='image/jpeg')
            {cb(null,true);}
            else{cb(null,false);}
        };
        app.use(multer({storage:fileStorage,fileFilter}).single('image'));
        app.use(bodyParser.json());
        app.use('/images',express.static(path.join(__dirname+'images')));
        app.use((req,res,next)=>{
            res.setHeader('Access-Control-Allow-Origin','*');
            res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
            if(req.method==='OPTIONS'){
                res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH,OPTIONS');
                return res.status(200).json({});
               
            }
             next();
        });    

        app.use((error,req,res,next)=>{
            //console.log(error);
            const status=error.statusCode || 500;
            const message=error.message;
            const data=error.data;
            res.status(status).json({message ,data});
            
        });
       
        
    }
    setRouters() {
        app.use('/auth',auth);   
        app.use('/feed',feed);
    }
}
