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

class Ticket {
  constructor (opts) {

  }

  checking (code) {
    var url = `https://api.91buyin.com/business/ticket/verify`
    var data = {
      code: code
    }

    return new Promise(function (resolve,reject) {
      request({method: 'POST', url:url, body: data, json:true})
        .then(function (response) {
          var _data = response.body

          resolve(_data)

        })
        .catch(function(err) {
            console.log(err);
        })
    })

  }


}



module.exports = Ticket
