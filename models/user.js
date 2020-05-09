const bcrypt=require('bcrypt');
const Sequelize=require('sequelize');
const sequelize=require('./connection');

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    username:{
        type:Sequelize.STRING(30),
        allowNull:false
    },
    email:{
        type:Sequelize.STRING(100),
        allowNull:false,

    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.STRING,
        defaultValue:"I'm new!"
    },
    
//},
// {
//     timestamps:true,
//     paranoid:true,
//     charset:'utf8'
// }
//,
//  {
//   instanceMethods: {
//     hashPassword: function (password) {
//         let salt=bcrypt.genSaltSync(8);
//         let hash=bcrypt.hashSync(password, salt);
//         return hash;
//     },
//     comparePassword: function (password) {
//       return bcrypt.compareSync(password, this.password);
//     }
//   }
});
  module.exports=User;
//   hashPassword=password=>{
//     let salt=bcrypt.genSaltSync(8);
//     let hash=bcrypt.hashSync(password, salt);
//     return hash;
// }


// exports.comparePassword=(password)=>{
//     return bcrypt.compareSync(password,User.password);
// }






// *********************************************
// "use strict";
// const Sequelize=require('sequelize');
// var bcrypt = require('bcrypt');
// const sequelize=require('./connection'); 

// module.exports = function (sequelize, DataTypes) {
//     const User=sequelize.define('user',{
//             id:{
//                 type:Sequelize.INTEGER,
//                 autoIncrement:true,
//                 allowNull:false,
//                 primaryKey:true
//             },
//             username:{
//                 type:Sequelize.STRING(30),
//                 allowNull:false
//             },
//             email:{
//                 type:Sequelize.STRING(100),
//                 allowNull:false,
        
//             },
//             password:{
//                 type:Sequelize.STRING,
//                 allowNull:false
//             },
//             status:{
//                 type:Sequelize.STRING,
//                 defaultValue:"I'm new!"
//             },
            
//         },
//         {
//             timestamps:true,
//             paranoid:true,
//             charset:'utf8'
//         }
//         , {
//       instanceMethods: {
//         hashPassword: function (password) {
//             let salt=bcrypt.genSaltSync(8);
//             let hash=bcrypt.hashSync(password, salt);
//             return hash;
//         },
//         comparePassword: function (password) {
//           return bcrypt.compareSync(password, this.password);
//         }
//       }


//     });

//   return User;
// }