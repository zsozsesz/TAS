var express = require('express');
var router = express.Router();
var db =require('../database/db');
var passwordHash = require('password-hash');

router.post('/adduser', function(req, res, next) {
    var email = req.body.email;
    var sql = "SELECT email FROM user WHERE email='"+email+"'";
    db.query(sql,function (err,result) {
        if(err) {
            return res.json({
                success: false,
                error: 2
            });
        }
        if(result.length!==0){
            return res.json({
                success:false,
                error: 1
            });
        }else{
            next();
        }

    });
});
router.post('/adduser', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var level = req.body.level;
    password= passwordHash.generate(password);
    var sql="INSERT INTO user (name,email,password,level) " +
        "VALUES ('"+username+"','"+email+"','"+password+"','"+level+"')";
    db.query(sql,function (err) {
        if(err){
            res.json({
                success:false,
                error: 2,
                data: ''
            });
        }else{
            res.json({
                success:true,
                error:0,
                data: ''
            });
        }
    });
});

router.delete('/deleteuser/:userID',function (req,res) {
    var sql="DELETE FROM user WHERE userID='"+req.params.userID+"'";
    db.query(sql,function (err) {
        if(err){
            res.json({
                success:false,
                error: 2
            });
        }else{
            res.json({
                success:true,
                error:0
            });
        }
    });
});
module.exports = router;