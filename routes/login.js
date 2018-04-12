var express = require('express');
var router = express.Router();
var db =require('../database/db');
var passwordHash = require('password-hash');
const request = require('request');
var hour = 3600000;
var fs = require('fs-extra');
/*
const options = {
    url: 'http://localhost:3000/api/reload/test',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'my-reddit-client'
    },

};

var options2= {
    method: 'POST',
    url: 'http://localhost:3000/api/reload/test',
    headers:
        {
            'cache-control': 'no-cache',
            'content-type': 'application/xml' },
    body: fs.createReadStream('../documents/test.xml')
};

request(options2, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    fs.readFile('../documents/test.xml', 'utf8', function(err, data) {
        console.log(data);
    })
});*/
/*
request(options, function(err, res, body) {
    var json = JSON.parse(body);
    console.log(json.message);
});*/


router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var sql = "SELECT name,password,userID,level FROM user WHERE email='"+email+"'";
    db.query(sql,function (err,result) {
        if(err){
            console.log(err);
            res.json({
                success:false,
                error : 2,
                data: ''
            })
        }
        else{
            if(result.length!==0){
                if(passwordHash.verify(password,result[0].password)){
                    req.session.login=true;
                    req.session.level=result[0].level;
                    req.session.cookie.maxAge = hour;
                    req.session.email=email;
                    req.session.userID=result[0].userID;
                    res.json({
                        success:true,
                        error:0,
                        login: true,
                        level:req.session.level,
                        userID:req.session.userID
                    });
                }else{
                    res.json({
                        success:false,
                        error: 4,
                        data: ''
                    });
                }
            }else{
                res.json({
                    success:false,
                    error: 4,
                    data: ''
                });
            }
        }
    });
});

router.get('/logout',function (req,res) {
    req.session.login = false;
    req.session.level=1;
    res.json({
        success:true,
        error:0,
        data: ''
    });
});

router.get('/document', function(req, res) {
    var x = "content dok ddd sok content";
    fs.writeFile('../documents/mynewfile3.txt', x, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    fs.outputJson('../documents/mynewfile4.txt', {name: 'JP'}, function(err) {
        console.log(err); //null
        });
    res.download('../documents/test.xml');
});

router.get('/exp',function (req,res) {
    console.log(req.session.level);
   res.json({
       login: req.session.login,
       level: req.session.level
   });
});
module.exports = router;