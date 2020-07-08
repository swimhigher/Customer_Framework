function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if (isEdge) {
        return 'edge';//edge
    } else if (isIE11) {
        return 11; //IE11
    } else {
        return -1;//不是ie浏览器
    }
}

var WebVedio = window.WebVedio || (function () {
    var _webVedio = function (opt) {
        var that = this;
        if (!(that instanceof _webVedio))
            return;

        var runtime = {
            ready: false
            , message: ''
            , logined: false
            , device: {
                ip: ''
                , port: 80
                , uid: 'admin'
                , pwd: '123456'
            }
            , deviceLength: 0
        };
        that.option = {
            windex: 0,//默认窗口
            wshowtype: 2,//窗口分割数 1 4 9 16
            equipmentport: 8000,//设备端口
            defaultport: 80,//端口号
            bWndFull: true,
            equipmentlist: [],//获取设备列表
            is_nvr: false,
            ip: '',
            port: 80,
            uid: 'admin',
            pwd: '123456',
            alert: function (msg) { alert(msg); },
            onClick: function (index) { }
        };
        $.extend(that.option, opt);

        //初始化控件
        that.init = function (eid, callback) {
            //eid 要使用的容器ID
            switch (IEVersion()) {
                case -1:
                    callback(false, { code: -4, message: '请使用IE浏览器访问本页' });
                    return;
                case 'edge':
                    callback(false, { code: -4, message: 'edge浏览器不支持，请使用IE浏览器' });
                    return;
            }

            var iRet = WebVideoCtrl.I_CheckPluginInstall();
            if (-2 == iRet) {
                callback(false, { code: -1, message: '您的浏览器版本不支持NPAPI插件' });
                return;
            }
            else if (-1 == iRet) {
                callback(false, { code: -2, message: '您还未安装WebComponentsKit插件' });
                return;
            }

            // 初始化插件参数及插入插件
            WebVideoCtrl.I_InitPlugin("100%", "100%", {
                bWndFull: that.option.bWndFull,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
                iWndowType: that.option.wshowtype,
                cbSelWnd: function (xmlDoc) {// 单击回发事件
                    if (!runtime.ready) return;
                    var g_iWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text());
                    that.option.windex = g_iWndIndex;
                    banana.helper.invoke(that.option.onClick, g_iWndIndex);
                },
                cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
                    //双击
                },
                cbInitPluginComplete: function () {
                    WebVideoCtrl.I_InsertOBJECTPlugin(eid);
                    // 检查插件是否最新
                    if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
                        callback(false, { code: -3, message: '检测到新的插件版本，请先升级' });
                        return;
                    }

                    runtime.ready = true;
                    callback(true);
                }
            });
        };

        //设置窗口分割数
        that.setScreenNum = function (num) {
            if (runtime.ready) {
                num = parseInt(num, 10);

                var snum = Math.pow(num, 2);
                if (runtime.deviceLength > snum) {
                    //暂时先取消提醒，后期改为动态画面
                    //that.option.alert('切换失败：屏幕数（' + snum + '）小于设备数（' + runtime.deviceLength + '）');
                    //return false;
                }

                that.option.wshowtype = num;
                WebVideoCtrl.I_ChangeWndNum(num);
            }
            else {
                that.option.alert(runtime.message);
            }
        };

        //全屏
        that.fullScreen = function () {
            WebVideoCtrl.I_FullScreen(true);
        };

        //设备登录
        that.login = function (callback) {
            if (runtime.ready) {
                var ip = that.option.ip;
                var port = that.option.port;
                var uid = that.option.uid;
                var pwd = that.option.pwd;
                if (ip == '' || port == '') {
                    that.option.alert("IP或者端口号不能为空");
                    return false;
                }

                //#region 设备登录
                var iRet = WebVideoCtrl.I_Login(ip, 1, port, uid, pwd, {
                    success: function (xmlDoc) {
                        runtime.device.ip = ip;
                        runtime.device.port = port;
                        runtime.device.uid = uid;
                        runtime.device.pwd = pwd;

                        //that.option.alert(ip + ':' + port + " 登录成功");
                        runtime.logined = true;
                        var ichannels = [];

                        if (!that.option.is_nvr) {
                            //#region not nvr
                            WebVideoCtrl.I_GetAnalogChannelInfo(ip, {
                                async: false,
                                success: function (xmlDoc) {
                                    var oChannels = $(xmlDoc).find("VideoInputChannel");
                                    $.each(oChannels, function (i) {
                                        var id = $(this).find("id").eq(0).text();
                                        var name = $(this).find("name").eq(0).text();
                                        var ipAddress = ip;
                                        var online = true;
                                        if ("" == name) {
                                            name = "Camera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                                        }
                                        var channel = { id: id, name: name, ip: ipAddress, online: online };
                                        ichannels.push(channel);
                                    });
                                    var equiptment = { ip: ip, port: port, channel: ichannels };
                                    that.option.equipmentlist.push(equiptment);
                                    if ($.isFunction(that.option.onChannelLoaded)) {
                                        that.option.onChannelLoaded(equiptment);
                                    }
                                },
                                error: function () {
                                    that.option.alert(ip + " 获取模拟通道失败");
                                    //showOPInfo(szIP + " 获取模拟通道失败！");
                                }
                            });

                            //#endregion
                        } else {
                            //#region nvr
                            //获取NVR所带所有网络摄像头
                            WebVideoCtrl.I_GetDigitalChannelInfo(ip, {
                                async: false,
                                success: function (xmlDoc) {
                                    var oChannels = $(xmlDoc).find("InputProxyChannelStatus");

                                    $.each(oChannels, function (i) {
                                        var id = $(this).find("id").eq(0).text();
                                        var name = $(this).find("name").eq(0).text();
                                        var ipAddress = $(this).find("ipAddress").eq(0).text();
                                        var online = $(this).find("online").eq(0).text().toLowerCase() == 'true';
                                        //if ("false" == online) {// 过滤禁用的数字通道
                                        //    return true;
                                        //}
                                        if ("" == name) {
                                            name = "IPCamera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                                        }
                                        var channel = { id: id, name: name, ip: ipAddress, online: online };
                                        ichannels.push(channel);
                                    });
                                    //that.option.alert(ip + " 获取数字通道成功");
                                    var equiptment = { ip: ip, port: port, channel: ichannels };
                                    that.option.equipmentlist.push(equiptment);
                                    that.option.channels = ichannels;
                                    if ($.isFunction(that.option.onChannelLoaded)) {
                                        that.option.onChannelLoaded(equiptment);
                                    }
                                    return true;
                                    //showOPInfo(szIP + " 获取数字通道成功！");
                                },
                                error: function () {
                                    that.option.alert(ip + " 获取数字通道失败");
                                    return false;
                                    //showOPInfo(szIP + " 获取数字通道失败！");
                                }
                            });
                            //#endregion
                        }

                        runtime.deviceLength = ichannels.length;//设定设备树
                        banana.helper.invoke(callback);
                        return true;
                    },
                    error: function () {
                        that.option.alert(ip + " 登录异常");
                        return false;
                    }
                });
                //#endregion

                if (-1 == iRet) {
                    runtime.logined = true;
                    //that.option.alert(szIP + " 已登录过");
                    return true;
                }
            }
            else {
                that.option.alert(runtime.message);
                return false;
            }
        };

        //开始播放
        //wIndex-播放的窗口
        //ip-播放的设备ip
        //id-通道，默认1
        that.play = function (wIndex, id) {//要播放所在window顺序
            var szIP = "127.0.0.1_80";
            if (runtime.ready) {
                if (runtime.logined) {
                    var camera = that.option.equipmentlist[0]; //get first camera

                    if (id == null || id.length == 0)
                        id = camera.channel[0].id;

                    szIP = camera.ip + '_' + camera.port;
                } else {
                    that.option.alert("设备未登录");
                    return;
                }

                var oWndInfo = WebVideoCtrl.I_GetWindowStatus(wIndex);
                var iStreamType = 1;//直接使用主码流
                var iChannelID = id;//默认使用第一通道;
                var bZeroChannel = false;//默认不使用零通道
                var iRtspPort = 554;
                var szInfo = "";

                if ("" == szIP) {
                    return;
                }

                if (oWndInfo != null) {// 已经在播放了，先停止
                    WebVideoCtrl.I_Stop({
                        iWndIndex: wIndex
                    });
                }
                var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
                    iRtspPort: iRtspPort,
                    iStreamType: iStreamType,
                    iChannelID: iChannelID,
                    bZeroChannel: bZeroChannel,
                    iWndIndex: wIndex,
                    success: function () {
                        //szInfo = "开始预览成功！";
                        //alert(szInfo);
                    },
                    error: function (status, xmlDoc) {
                        if (403 === status) {
                            szInfo = "设备不支持Websocket取流";
                        } else {
                            szInfo = "预览失败";
                        }
                        that.option.alert(szInfo);
                    }
                });
            } else {
                that.option.alert(runtime.message);
            }
        };

        that.playByIp = function (ip) {
            if (!runtime.logined) {
                that.option.alert("请先登录");
                return;
            }

            //var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
            //if (oWndInfo != null) { //已经在播放了，先停止
            //    WebVideoCtrl.I_Stop({
            //        iWndIndex: 0
            //    });
            //}
            var szInfo = '';
            var iRet = WebVideoCtrl.I_StartRealPlay(ip + '_80', {
                iRtspPort: 554,
                iStreamType: 1,
                bZeroChannel: false,
                iChannelID: 1,
                iWndIndex: 0,
                success: function () { }
                , error: function (status, xmlDoc) {
                    if (403 === status) {
                        szInfo = "设备不支持Websocket取流";
                    } else {
                        szInfo = "预览失败";
                    }
                    that.option.alert(szInfo);
                }
            });
        };

        //停止播放
        that.stop = function (index) {
            var winStatus = WebVideoCtrl.I_GetWindowStatus(index);
            if (winStatus != null) {
                WebVideoCtrl.I_Stop({ iWndIndex: index });
            }
        };

        that.setProperty = function (key, value) {
            if (!runtime.ready) return false;

            var keys = ['PackgeSize', 'PlayWndType', 'BuffNumberType', 'RecordPath', 'CapturePath',
                'PlaybackFilePath', 'PlaybackPicPath', 'DownloadPath', 'IVSMode', 'CaptureFileFormat', 'ProtocolType'];

            var xmlDoc = WebVideoCtrl.I_GetLocalCfg();
            var arrXml = [];

            arrXml.push("<LocalConfigInfo>");
            $(keys).each(function (i, item) {
                if (key == item) {
                    arrXml.push('<{0}>{1}</{0}>'.format(item, value));
                    return true;
                }
                arrXml.push('<{0}>{1}</{0}>'.format(item, $(xmlDoc).find(item).first().text()));
            });
            arrXml.push("</LocalConfigInfo>");
            //that.option.alert('修改' + key + '的值为：' + value);
            return WebVideoCtrl.I_SetLocalCfg(arrXml.join('')) == 0;
        };

        that.getProperty = function (key) {
            if (!runtime.ready) return null;
            return $(WebVideoCtrl.I_GetLocalCfg()).find(key).eq(0).text()
        };

        //截图
        that.capture = function (index, callback) {
            //that.option.alert(this.getProperty('CapturePath'));
            var pname = ((new Date()).format('yyyy-MM-dd-HH-mm-ss').replace(/-/g, '')) + B.Helper.createID() + B.Helper.createID() + '.jpg';
            var r = WebVideoCtrl.I_CapturePic(pname, {
                iWndIndex: index
                //, bDateDir: false
            });
            if (r == 0) {
                var floder = (new Date()).format('yyyy-MM-dd');
                callback(true, {
                    filename: pname
                    , fullname: this.getProperty('CapturePath') + '/' + floder + '/' + pname
                    , floder: floder
                });
            } else {
                callback(false, { code: r });
            }
        }

        //回放
        that.playBack = function (opt) {
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
            var defaults = {
                iChannelID: 1,
                startTime: null
                , endTime: null
                , success: function () { }
                , error: function () { }
            };
            var eq = banana.helper.getEnumerable().From(this.option.channels).Where('x=>x.ip=="' + opt.ip + '"').ToArray();
            var option = $.extend({}, defaults, opt);
            var szIP = "127.0.0.1_80";
            if (runtime.ready) {
                if (runtime.logined) {
                    szIP = that.option.equipmentlist[0].ip + '_' + that.option.equipmentlist[0].port;
                } else {
                    that.option.alert("请先登录");
                    return;
                }
                WebVideoCtrl.I_StartPlayback(szIP, {
                    iRtspPort: 554,
                    iStreamType: 1,
                    iChannelID: (eq.length > 0 ? eq[0].id : option.iChannelID),
                    szStartTime: option.startTime,
                    szEndTime: option.endTime,
                    success: option.success,
                    error: option.error
                });
                //WebVideoCtrl.I_StartPlayback(szIP, {
                //    szStartTime: option.startTime
                //    , szEndTime: option.endTime
                //    , success: option.success
                //    , error: option.error
                //});
            }
            if (oWndInfo != null) {// 已经在播放了，先停止
                WebVideoCtrl.I_Stop({
                    success: function () {
                        WebVideoCtrl.I_StartPlayback(szIP, {
                            iRtspPort: 554,
                            iStreamType: 1,
                            iChannelID: (eq.length > 0 ? eq[0].id : option.iChannelID),
                            szStartTime: option.startTime,
                            szEndTime: option.endTime,
                            success: option.success,
                            error: option.error
                        });
                    }
                });
            } else {
                WebVideoCtrl.I_StartPlayback(szIP, {
                    iRtspPort: 554,
                    iStreamType: 1,
                    iChannelID: (eq.length > 0 ? eq[0].id : option.iChannelID),
                    szStartTime: option.startTime,
                    szEndTime: option.endTime,
                    success: option.success,
                    error: option.error
                });
            }
        };

        //回放2
        that.playBackTwo = function (opt) {
            var oWndInfo = WebVideoCtrl.I_GetWindowStatus(1);
            var defaults = {
                startTime: null
                , endTime: null
                , success: function () { }
                , error: function () { }
            };
            var option = $.extend({}, defaults, opt);
            var szIP = "127.0.0.1_80";
            var CameraIp = option.CameraIp;//摄像头ip
            if (runtime.ready) {
                if (runtime.logined) {
                    szIP = that.option.equipmentlist[0].ip + '_' + that.option.equipmentlist[0].port;
                } else {
                    that.option.alert("请先登录");
                    return;
                }
                var iChannelID;//通道id

                var result = false;
                $.each(that.option.equipmentlist[0].channel, function (i, item) {
                    if (item.ip == CameraIp) {
                        result = item.online;
                        if (result) {
                            iChannelID = item.id;
                        } else {
                            that.option.alert("该通道离线");
                            return;
                        }
                    }
                })
                if (!result) {
                    return;
                }
                var startPlayback = function () {
                    WebVideoCtrl.I_StartPlayback(szIP, {
                        iRtspPort: parseInt(option.iRtspPort, 10),
                        iStreamType: parseInt(option.iStreamType, 10),
                        iChannelID: parseInt(iChannelID, 10),
                        szStartTime: option.startTime,
                        szEndTime: option.endTime,
                        success: option.success,
                        error: option.error
                    });
                }
            }
            if (oWndInfo != null) {// 已经在播放了，先停止
                WebVideoCtrl.I_Stop({
                    success: function () {
                        startPlayback();
                    }
                });
            } else {
                startPlayback();
            }
        };
        //加速播放 1/8 to 8
        that.playFast = function (opt) {
            //I_PlayFast
            var defaults = {
                iWndIndex: null
                , success: function () { }
                , error: function () { }
            };
            var option = $.extend({}, defaults, opt);
            if (runtime.ready) {
                WebVideoCtrl.I_PlayFast({
                    iWndIndex: option.iWndIndex
                    , success: option.success
                    , error: option.error
                });
            }
        };

        //减速播放 1/8 to 8
        that.playSlow = function (opt) {
            //I_PlaySlow
            var defaults = {
                iWndIndex: null
                , success: function () { }
                , error: function () { }
            };
            var option = $.extend({}, defaults, opt);
            if (runtime.ready) {
                WebVideoCtrl.I_PlaySlow({
                    iWndIndex: option.iWndIndex
                    , success: option.success
                    , error: option.error
                });
            }
        };
    };
    _webVedio.prototype = { constructor: _webVedio };
    return _webVedio;
})();