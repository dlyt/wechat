/**
 * Created by 少冬 on 2016/7/21.
 */
'use strict'
var path =require('path')
var util=require('./libs/util')
var wechat_file = path.join(__dirname,'./config/wechat.txt')
var config ={
    wechat:{
        appID:'wx5689f7934bafeaa7',
        appSecret:'8e98850776f058b3f0ec2e9b56bf15b1',
        token:'miao123',
        getAccessToken:function () {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken:function (data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file,data)
        }
    }
}

module.exports=config
