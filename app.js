'use strict'

var koa=require('koa')
var path =require('path')
var wechat=require('./wechat/g')
var util=require('./libs/util')
var config=require('./config')
var weixin = require('./weixin')
var port = process.env.PORT || 80;
var wechat_file = path.join(__dirname,'./config/wechat.txt')

var app = new koa()

app.use(wechat(config.wechat,weixin.reply))

app.listen(port)
console.log(`port is ${port}`);
