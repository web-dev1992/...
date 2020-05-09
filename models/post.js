const Sequelize=require('sequelize');
const sequelize=require('./connection');


const Post=sequelize.define('post',{
  id: {type: Sequelize.INTEGER,autoIncrement: true,allowNull: false,primaryKey: true},
  title:{ type:Sequelize.STRING,allowNull:false},
  content: {type: Sequelize.STRING,allowNull: false},
  imageUrl: {type: Sequelize.STRING, allowNull: false },
  userId:{type:Sequelize.INTEGER,allowNull:false}
  //creator: {type: Sequelize.STRING}
},{timestamps:true,charset:'utf8'});



module.exports = Post;