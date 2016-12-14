/**
 * Created by 少冬 on 2016/7/21.
 */
'use strict'

var config = require('./config')
var Wechat = require('./wechat/wechat')
var Ticket = require('./wechat/ticket')
var path = require('path')
var menu = require('./menu')
var wechatApi= new Wechat(config.wechat)
var TicketAPi = new Ticket()

wechatApi.delMenu().then(function () {
  return wechatApi.createMenu(menu)
})
.then(function (msg) {
  console.log(msg);
})

exports.reply=function *(next) {
    var message = this.weixin

    if(message.MsgType==='event'){
        if(message.Event==='subscribe'){
            if(message.EventKey) {
                console.log('扫码进来' + message.EventKey + ' ' + message.ticket)
            }

            this.body = '欢迎订阅这个号'
        }
        else if (message.Event==='unsubscribe'){
            console.log('取消关注')
            this.body=''
        }
        else if (message.Event==='LOCATION'){
            this.body='您上报的地理位置是： '+message.Latitude+'/'+message.Longitude+'-'+message.Precision
        }
        else if (message.Event==='CLICK'){
            this.body='您点击了菜单： '+message.EventKey
            console.log(this.body);
        }
        else if (message.Event==='SCAN'){
            console.log('关注后扫二维码'+message.EventKey+' '+message.Ticket)

            this.body='看到你扫了一下哦'
        }
        else if (message.Event==='VIEW'){
            this.body='您点击了菜单中的链接： '+message.EventKey
        }
        else if (message.Event==='scancode_push'){
          console.log(message.ScanCodeInfo.ScanType);
          console.log(message.ScanCodeInfo.ScanResult);
            this.body='您点击了菜单中： '+ message.EventKey
        }
        else if (message.Event==='scancode_waitmsg'){

          yield  TicketAPi.checking(message.ScanCodeInfo.ScanResult).then(function (data) {
                    if (data.code === '1010')
                      var body = '验票成功'
                    else
                      var body = '验票失败'

                    this.body = body

                  }.bind(this))

        }
        else if (message.Event==='pic_sysphoto'){
            this.body='您点击了菜单中的链接： '+message.EventKey
        }
        else if (message.Event==='pic_photo_or_album'){
            this.body='您点击了菜单中的链接： '+message.EventKey
        }
        else if (message.Event==='pic_weixin'){
            this.body='您点击了菜单中的链接： '+message.EventKey
        }
        else if (message.Event==='location_select'){
            this.body='您点击了菜单中的链接： '+message.EventKey
        }
    }
    else if(message.MsgType==='text'){
        var content=message.Content
        var reply='牙合'+message.Content+'真不容易'

        if (content==='1'){
            reply='测试消息回复'
        }

        this.body=reply
    }

    yield (next)
}
