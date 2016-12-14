/**
 * Created by Jno
 * Processing WeChat interface
 */
'use strict'
var Promise =require('bluebird')
var request = Promise.promisify(require('request'))
var util=require('./util')
var  fs =require('fs')
var prefix = 'https://api.weixin.qq.com/cgi-bin/'

var api={
    accessToken:prefix + 'token?grant_type=client_credential',
    upload:prefix+'media/upload?',
    menu: {
      create: `${prefix}menu/create?`,
      del: `${prefix}menu/delete?`,
      current: `${prefix}get_current_selfmenu_info?`,
    }
}

class Wechat {
  constructor (opts) {
    this.appID=opts.appID
    this.appSecret=opts.appSecret
    this.getAccessToken=opts.getAccessToken
    this.saveAccessToken=opts.saveAccessToken

    this.fetchAccessToken()
  }

  fetchAccessToken (data) {
    var that=this
    if(this.access_token&&this.expires_in){
        if(this.isValidAccessToken(this)){
            return Promise.resolve(this)
        }
    }
    return this.getAccessToken()
        .then(function (data) {
            try{
                data=JSON.parse(data)
            }
            catch(e){
                return that.updateAccessToken()
            }

            if(that.isValidAccessToken(data)){
                return Promise.resolve(data)
            }
            else{
                return that.updateAccessToken()
            }
        })
        .then(function (data) {
            that.access_token=data.access_token
            that.expires_in=data.expires_in

            that.saveAccessToken(data)
            return Promise.resolve(data)
        })
  }

  isValidAccessToken (data) {
    if(!data||!data.access_token||data.expires_in){
        return false
    }

    var access_token=data.access_token
    var expires_in = data.expires_in
    var now =(new Date().getTime())

    if(now<expires_in){
        return true
    }else {
        return false
    }
  }

  updateAccessToken () {
    var appID=this.appID
    var appSecret = this.appSecret
    var url = api.accessToken+'&appid='+appID+'&secret='+appSecret

    return new Promise(function (resolve,reject) {
        request({url:url,json:true}).then(function (response) {
            var data = response.body
            var now =(new Date().getTime())
            var expires_in = now + (data.expires_in-20)*1000

            data.expires_in = expires_in

            resolve(data)
        })
    })
  }

  uploadMaterial (type, filepath) {
    var that=this
    var form={
        media: fs.createReadStream(filepath)
    }
    var appID=this.appID
    var appSecret = this.appSecret

    return new Promise(function (resolve,reject) {
        that
            .fetchAccessToken()
            .then(function (data) {
                var url = api.upload+'access_token='+data.access_token+'&type='+type
                request({method:'POST',url:url,formData: form,json:true}).then(function (response) {
                    var _data = response.body
                    if(_data){
                        resolve(_data)
                    }else
                    {
                        throw new Error('Upload meterial fails')
                    }
                })
                .catch(function (err) {
                    reject(err)
                })
            })
    })
  }

  createMenu (menu) {
    var that = this

    return new Promise(function (resolve,reject) {
      that
        .fetchAccessToken()
        .then(function (data) {
          var url = `${api.menu.create}access_token=${data.access_token}`

          request({method: 'POST', url:url, body: menu, json:true})
            .then(function (response) {
              var _data = response.body

              if (_data)
                resolve(_data)
              else
                throw new Error('Create menu fail')
            })
            .catch(function(err) {
              reject(err)
            })
        })
    })
  }

  delMenu (menu) {
    var that = this

    return new Promise(function (resolve,reject) {
      that
        .fetchAccessToken()
        .then(function (data) {
          var url = `${api.menu.del}access_token=${data.access_token}`
          request({method: 'GET', url:url, json:true})
            .then(function (response) {
              var _data = response.body
              if (_data)
                resolve(_data)
              else
                throw new Error('Delete menu fail')
            })
            .catch(function(err) {
              reject(err)
            })
        })
    })
  }

  reply () {
    var content = this.body
    var message = this.weixin

    var xml= util.tpl(content,message)
    this.status=200
    this.type='application/xml'
    this.body=xml
  }
}



module.exports=Wechat
