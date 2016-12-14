/**
 * Created by 少冬 on 2016/7/21.
 */
'use strict'

var config = require('./config')
var Wechat = require('./wechat/wechat')
var path = require('path')
var menu = require('./menu')
var wechatApi= new Wechat(config.wechat)

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
          console.log(message.ScanCodeInfo.ScanType);
          console.log(message.ScanCodeInfo.ScanResult);
            this.body='您点击了菜单中： '+ message.EventKey
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
            reply='第一'
        }
        else if(content==='2'){
            reply='第二'
        }
        else if(content==='3'){
            reply='第三'
        }
        else if(content==='4'){
            reply=[{
                title:'知识改变世界',
                description:'卖弄书',
                picUrl:__dirname+'\\img\\3.jpg',
                url:'https://github.com/'
            },{
                title:'知识改变世界',
                description:'卖弄书',
                picUrl:__dirname+'\\img\\4.jpg',
                url:'https://github.com/'
            }]
        }
        else if(content==='5'){
            var data = yield(wechatApi.uploadMaterial('image',__dirname+ '\\img\\5.jpg'))
            reply={
                type:'image',
                mediaId:data.media_id
            }
        }
        else if(content==='6'){
            var data = yield(wechatApi.uploadMaterial('video',__dirname+ '\\img\\5.jpg'))
            reply={
                type:'video',
                title:'回复视频内容',
                description:'老司机带带我',
                mediaId:data.media_id
            }
        }
        else if(content==='7'){
            var data = yield(wechatApi.uploadMaterial('image',__dirname+ '\\img\\5.jpg'))
            reply={
                type:'music',
                title:'回复音乐内容',
                description:'老司机带带我',
                musicUrl:__dirname+'\\7.mp3',
                thumbMediaId:data.media_id
            }
        }
        this.body=reply
        console.log(reply)

    }
    yield (next)
}
