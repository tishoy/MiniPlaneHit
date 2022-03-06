/**
 * 
 * @param {JayPac, H5 sdk} v1.01 
 * 版权有joypac 所有
 */

/**
 * JPlatform 初始化
 */
var Common = require("Common");

var JPlatform = cc.Class({
    properties: {
        jpsoundMgr: null,
        openId: null,
        platform: "",
        shareCb: null,
        ad: null,
        rankType: 0
    },

    onLoad: function () {

    },

    init: function () {

        // this.initXiaoMi();
        // this.oppoInit();
        // this.init4399();
        // this.jpsoundMgr = new JPSoundManager();

        // this.gb4399Init();

        this.initAnalytics();

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.login({
                success: function (res) {
                    // wx.getUserInfo({
                    //     success: function (res) {
                    //         console.log("getUserInfo success", res);
                    //     }
                    // })
                    //console.log(res);
                    wx.getSetting({
                        success: function (res) {
                            var authSetting = res.authSetting
                            console.log("authSetting", authSetting);
                            res.authSetting = {
                                "scope.userInfo": true,
                                "scope.userLocation": true,
                                "scope.record": true,
                                "scope.werun": true,
                                "scope.writePhotosAlbum": true
                            }
                        }
                    })
                },
                fail: function (res) {
                    console.log(res);
                },
                complete: function (res) {
                    console.log(res);
                },
            })
        }
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this.openId = GameStatusInfo.openId;
        }
    },

    initXiaoMi: function () {
        this.platform = "xiaomi";
        window.hy_dj_sdk.ready({
            zIndex: 9999,
            pin: 0
        }, function () {
            let data = hy_dj_sdk.getBaseData();
            console.log(data);
            //sdk已经加载完成，可执行游戏的初始化逻辑
            // hy_dj_sdk.reload()
        })
    },

    init4399: function () {
        this.platform = "4399";
        // if (!window.h5api.isLogin()) {
        //     /**
        //      * 打开用户登录面板
        //      * @param {func} callback 回调函数
        //      */
        //     window.h5api.login(function (data) {
        //         /* data = {
        //             uId: 1234567, // 用户编号
        //             userName: '昵称', // 用户昵称
        //         } */
        //     })
        // }
    },

    gb4399Init: function () {
        this.platform = "gb4399";
        gb4399.init({
            gameId: '31',  // 游戏运营id　　
            dev: '1', // 开发状态　1，　发布状态　0
            success: function () {
                console.log("初始化成功");
                //初始化成功
                gb4399.login({
                    success: function (res) {
                        // JPlatform.getInstance().jpsoundMgr.initBGMusic("resources/Sound/bgm_stage_mp3.mp3");
                        res.accessToken,     //临时登录凭证
                            res.uid,            //4399用户id
                            res.username,       //用户名
                            res.nick,           // 昵称
                            res.avatar,          //用户头像
                            res.accountType   //用户类型，如QQ、4399、微博等
                    },
                    fail: function (res) {
                        // JPlatform.getInstance().jpsoundMgr.initBGMusic("resources/Sound/bgm_stage_mp3.mp3");
                        res.code //失败状态码
                        res.msg  //错误信息描述
                    }
                });
            },
            fail: function () {
                console.log("初始化失败");
                //初始化失败
            }
        })
    },

    gb4399exit: function () {
        gb4399.exit();
        gb4399.login({
            success: function (res) {
                res.accessToken,     //临时登录凭证
                    res.uid,            //4399用户id
                    res.username,       //用户名
                    res.nick,           // 昵称
                    res.avatar,          //用户头像
                    res.accountType   //用户类型，如QQ、4399、微博等
            },
            fail: function (res) {
                res.code //失败状态码
                res.msg  //错误信息描述
            }
        });
    },

    oppoInit: function () {
        this.platform = "OPPO"; // Mobile OPPO
        return;
        if (JPlatform.getInstance().platform === "OPPO") {
            // banner广告
            JPlatform.getInstance().getAd().bannerAd = opUnion.createBannerAd({
                containerId: 'banner',
                posId: '27189',
                mediaId: '101000075',
            });
            JPlatform.getInstance().getAd().bannerAd.onLoad(function (err) {
                let ad_node = document.getElementById("ad");
                ad_node.style.display = "none";//block
                JPlatform.getInstance().getAd().isBannerAdOK = true;
                console.log('Banner广告加载成功');

            })
            JPlatform.getInstance().getAd().bannerAd.onError(function (err) {
                if (!JPlatform.getInstance().getAd().isBannerAdOK) {
                    let ad_node = document.getElementById("ad");
                    ad_node.style.display = "none";//block
                    console.log(JSON.parse(err));
                    console.log('Banner广告加载失败');
                }
            })
            // 插屏广告
            JPlatform.getInstance().getAd().interstitialAd = opUnion.createInterstitialAd({
                posId: '27191',
                mediaId: '101000075'
            })
            console.log('开始插屏广告加载')

            JPlatform.getInstance().getAd().interstitialAd.onLoad(function () {
                JPlatform.getInstance().getAd().isInterstitialAdOK = true;
                console.log('插屏广告加载成功')
            })

            JPlatform.getInstance().getAd().interstitialAd.onError(function (err) {
                console.log(err);
                console.log('插屏广告加载失败')
            })
            // 视频广告 暂时没有视频广告 使用插屏广告代替
            JPlatform.getInstance().getAd().rewardedVideoAd = opUnion.createInterstitialAd({
                posId: '27190',
                mediaId: '101000075'
            })
            console.log('开始插屏广告加载')

            JPlatform.getInstance().getAd().rewardedVideoAd.onLoad(function () {
                JPlatform.getInstance().getAd().isVedioAdOK = true;
                console.log('插屏广告加载成功')
            })

            JPlatform.getInstance().getAd().rewardedVideoAd.onError(function (err) {
                console.log(JSON.parse(err));
                console.log('插屏广告加载失败')
            })
        }
        // OPPO.setWebviewOrientation('portrait');
        // OPPO.login({
        //     packageName: 'com.joypac.dagen.h5.nearme.gamecenter', //开发者在oppo开放平台填写的包名
        //     callback: function (res) {
        //         console.log(res)
        //     }
        // });
    },

    JPSetLocalStorage: function (key, value) {
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            var openKey = this.openId;
            cc.sys.localStorage.setItem("qq_" + openKey + "_" + key, value);
        } else {
            cc.sys.localStorage.setItem(key, value);
        }
    },

    JPGetLocalStorage: function (key) {
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            var openKey = this.openId;
            return cc.sys.localStorage.getItem("qq_" + openKey + "_" + key);
        } else {
            return cc.sys.localStorage.getItem(key);

        }
    },

    ////以下为微信相关接口 wx5d68b666861cb8b4 be820e6daa9856ca23d49ef08b1f8c4a////
    //比较微信版本
    compareWeChatVersion: function (v1, v2) {
        v1 = v1.split('.');
        v2 = v2.split('.');
        let len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (let i = 0; i < len; i++) {
            let num1 = parseInt(v1[i]);
            let num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
    },

    /**
     * 暂未开放的sdk
     */
    login: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.authorize({
                scope: 'scope.userInfo',
                fail: function (res) {
                    // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                    if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                        // 处理用户拒绝授权的情况
                        console.log("用户拒绝授权");
                    }
                }
            })
        }
        if (cc.sys.platform === cc.sys.QQ_PLAY) {

        } else {
            if (this.platform === "OPPO") {


            }
        }
    },
    getInfo: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.getUserInfo({
                success: function (res) {
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                }
            })

        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            BK.QQ.fetchOpenKey(function (errCode, cmd, data) {
                if (errCode == 0) {
                    JPlatform.getInstance().userInfo = data;
                } else {
                    JPlatform.getInstance().print("获取用户信息失败");
                }
            }.bind(this));
        }
    },



    /**
     * 微信显示分享菜单
     * @param {分享标题} title 
     * @param {分享图片url} url 
     * @param {分享回调} cb 
     */
    showShareMenu: function (title, url, cb = null) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.onShareAppMessage(function () {
                return {
                    title: title,
                    imageUrl: url,
                    success(res) {
                        cb();
                        console.log('res', res)
                    },
                    fail(res) {
                        console.log('resErr', res)
                    }
                }
            });
            wx.showShareMenu({
                withShareTicket: true,

            })
        } else {

        }
    },
    /**
     * 分享功能
     * @param {分享标题} title 
     * @param {分享图片url} url 
     * @param {分享回调} cb 
     * @param {*} extendInfo 
     * @param {*} savedPath 
     */
    share: function (title, url, iconurl = "", cb = null, extendInfo = "", savedPath = "") {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            if (url.indexOf("http") === -1) {
                wx.shareAppMessage({
                    title: title,
                    imageUrl: url
                })
            } else {
                wx.shareAppMessage({
                    title: title,
                })
            }
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            // if (url.indexOf("http") === -1) {
            //     url = "GameRes://" + url
            // }
            var shareInfo = {
                summary: title,          //QQ聊天消息标题
                picUrl: "",               //QQ聊天消息图片
                extendInfo: extendInfo,    //QQ聊天消息扩展字段
                localPicPath: "",   //分享至空间、微信、朋友圈时需要的图。（选填，若无该字段，系统使用游戏对应的二维码）
                gameName: "抱紧大根"          //游戏名，暂用与生成二维码
            };

            BK.QQ.share(shareInfo, function (retCode, shareDest, isFirstShare) {
                BK.Script.log(1, 1, "joypac retCode:" + retCode + " shareDest:" + shareDest + " isFirstShare:" + isFirstShare);
                if (retCode == 0) {
                    if (cb !== null) {
                        cb();
                    }
                    if (shareDest == 0 /* QQ */) {
                        //聊天窗
                        BK.Script.log(1, 1, "joypac 成功分享至QQ");
                    }
                    else if (shareDest == 1 /* QZone */) {
                        //空间
                        BK.Script.log(1, 1, "joypac 成功分享至空间");
                    }
                    else if (shareDest == 2 /* WX */) {
                        //微信
                        BK.Script.log(1, 1, "joypac 成功分享至微信");
                    }
                    else if (shareDest == 3 /* WXCircle */) {
                        // 朋友圈
                        BK.Script.log(1, 1, "joypac 成功分享至朋友圈");
                    }
                }
                else if (retCode == 1) {
                    BK.Script.log(1, 1, "joypac 分享失败" + retCode);
                }
                else if (retCode == 2) {
                    BK.Script.log(1, 1, "joypac 分享失败，用户取消分享：" + retCode);
                }
            }.bind(this));
        } else {
            if (this.platform === "4399") {
                window.h5api.share();
            }
            if (this.platform === "gb4399") {
                gb4399.showShareMenu({
                    shareTitle: "抱紧大根", //分享标题
                    shareContent: title, //分享内容
                    shareIcon: url, //分享图标地址
                    // shareUrl: "http://www.baidu.com", //分享地址(可选)
                    // cornerIcon: "", //分享的角标（可选）
                    extra: "", //扩展字段,json字符串
                    success: function () {
                        //分享成功回调
                    },
                    fail: function () {
                        //分享失败
                    }
                });
            }
        }
    },

    getAd: function () {
        if (this.ad === null) {
            this.ad = new AD();
        }
        return this.ad;
    },

    /**
     * 微信支持 多个key 列表获取    
     * QQ 需要依次获取
     * @param {*} key 
     * @param {*} value 
     * @param {*} startTime 
     * @param {*} costms 
     */
    uploadRank: function (key, value, startTime, costms) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let valueStr = {
                "wxgame": {
                    "score": value + '',
                    "update_time": startTime
                },
                "const_ms": costms
            };
            var kvDataList = [];
            kvDataList.push({
                key: 'radishRecord',
                value: JSON.stringify(valueStr)
            });
            wx.getStorageInfo({
                success: (keys, currentSize, limitSize) => {
                    let hasKey = false;

                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i] === key) {
                            console.log("存在本地存储");
                            wx.getStorage({
                                "key": key,//根据上传托管定义的key值进行获取 获取存储的记录
                                success: res => {
                                    //后面加上 ?aaa=aa.jpg 这几个字符，就能够访问到用户头像图片
                                    //拿到数居 进行排序
                                    // this.parseCloudRecord(data);
                                    // this.recordData = res.data;
                                    // this.parseCloudRecord(res.data);
                                    // 对比上次成绩 再次上传



                                    wx.setUserCloudStorage({
                                        KVDataList: kvDataList,
                                        success: function (res) {
                                            console.log("上传数据成功");
                                            console.log(kvDataList);

                                            wx.setStorage({
                                                key: key,
                                                data: valueStr,
                                                success: function (res) {
                                                    console.log("本地存储更新成功");
                                                },
                                                fail: function (res) {
                                                    console.log("本地存储更新失败");
                                                },
                                                complete: function (res) {
                                                }
                                            });
                                        },
                                        fail: function (res) {

                                        },
                                        complete: function (res) {
                                        }
                                    });

                                },
                                fail: function (res) {
                                },
                                complete: function () {
                                }
                            })
                            hasKey = true;
                            break;
                        }

                    }
                    if (hasKey === false) {
                        wx.setUserCloudStorage({
                            KVDataList: kvDataList,
                            success: function (res) {
                                console.log(kvDataList);

                                wx.setStorage({
                                    key: key,
                                    data: valueStr,
                                    success: function (res) {
                                        console.log("本地存储更新成功");
                                    },
                                    fail: function (res) {
                                        console.log("本地存储更新失败");
                                    },
                                    complete: function (res) {
                                    }
                                });
                            },
                            fail: function (res) {

                            },
                            complete: function (res) {
                            }
                        });
                    }

                },
                fail: () => {

                },
                complete: () => {

                }

            });
            //先获取之前的成绩  再上传新的成绩




        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            var data = {
                userData: [
                    {
                        openId: GameStatusInfo.openId,
                        startMs: startTime,    //必填。 游戏开始时间。单位为毫秒，<font color=#ff0000>类型必须是字符串</font>
                        endMs: ((new Date()).getTime()).toString(),  //((new Date()).getTime()).toString(),  //必填。 游戏结束时间。单位为毫秒，<font color=#ff0000>类型必须是字符串</font>
                        scoreInfo: {
                            score: value, //分数，类型必须是整型数
                        },
                    },
                ],
                attr: {
                    score: {
                        type: 'rank',
                        order: 1,
                    },
                },
            };
            // gameMode: 游戏模式，如果没有模式区分，直接填 1
            // 必须配置好周期规则后，才能使用数据上报和排行榜功能
            BK.QQ.uploadScoreWithoutRoom(1, data, function (errCode, cmd, data) {
                // 返回错误码信息
                if (errCode !== 0) {
                    BK.Script.log(1, 1, '上传分数失败!错误码：' + errCode);
                }
            });
        } else {
            if (this.platform === "4399") {
                return;
                console.log("上传分数" + value);
                window.h5api.submitRanking(value, function (data) {
                    /* data = {
                        code: 10000, // 10000代表提交成功，10001为提交失败
                        my: { // 当前用户信息
                          uid: 1234567, // 用户编号
                          userName: '用户昵称'// 用户昵称
                        },
                        history: { // 分数提交后的历史最好成绩
                          rank: -1, // 历史最好分数的排名 -1为未进入排行榜（排行榜只统计前500名）
                          score: 0 // 历史最好分数
                        }
                    } */
                })
            }

            if (this.platform === "gb4399") {
                gb4399.submitScore({
                    score: value, //游戏分数为非负整数
                    success: function () {
                        //积分提交成功
                    },
                    fail: function (res) {
                        //积分提交失败
                        res.code;//错误码
                        res.msg;  //错误信息
                    }
                });
            }
        }
    },

    /**
     * 获取排行榜
     * @param rankType 0: 好友排行榜，1: 群排行榜，
     */
    getRank: function (rankType, callBack) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.getFriendCloudStorage({
                keyList: ['radishRecord'],//根据上传托管定义的key值进行获取 获取存储的记录
                success: res => {
                    //后面加上 ?aaa=aa.jpg 这几个字符，就能够访问到用户头像图片
                    console.log("好友数据请求成功", res.data);
                    //拿到数居 进行排序
                    // this.parseCloudRecord(data);
                    // this.recordData = res.data;
                    // this.parseCloudRecord(res.data);

                },
                fail: function () {
                    console.log("好友数据失败");
                },
                complete: function () {
                    console.log("好友数据完成");
                }
            })
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            var attr = "score";//使用哪一种上报数据做排行，可传入score，a1，a2等
            var order = 1;     //排序的方法：[ 1: 从大到小(单局)，2: 从小到大(单局)，3: 由大到小(累积)]
            var rankType = 0; //要查询的排行榜类型，0: 好友排行榜，1: 群排行榜，2: 讨论组排行榜，3: C2C二人转 (手Q 7.6.0以上支持)
            // 必须配置好周期规则后，才能使用数据上报和排行榜功能
            BK.QQ.getRankListWithoutRoom(attr, order, rankType, function (errCode, cmd, data) {
                // 返回错误码信息
                if (errCode !== 0) {
                    return;
                }
                // 解析数据
                if (data) {
                    /**
                     * {"nick":"哈N她!)|A(","score":5,"selfFlag":1,"url":"http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478"}
                     */
                    callBack(data);
                }


            }.bind(this));
        } else {
            if (JPlatform.getInstance().platform === "gb4399") {
                gb4399.openRank({
                    success: function () {
                        //打开游戏排行榜成功
                    },
                    fail: function (res) {
                        res.code;//错误代码
                        res.msg; //错误信息
                    }
                });
            }
        }

    },

    /**
     * 该接口支持将玩家所有数据同意存储
     * 
     * @param {用户存储的key}} key 
     * @param {对象数据} data 
     */
    saveData: function (data) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.setStorage({
                key: "jpData",
                data: JSON.stringify(data),
                success: function (res) {
                    console.log("本地存储更新成功");
                },
                fail: function (res) {
                    console.log("本地存储更新失败");
                },
                complete: function (res) {
                }
            });
        }
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            BK.QQ.saveGameData(data, function (errCode, cmd, data) {
                BK.Script.log(1, 1, "joypac" + JSON.stringify(errCode));
                BK.Script.log(1, 1, "joypac" + JSON.stringify(data));
            });
        }
    },

    loadData: function (cb) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.getStorage({
                key: "jpData",
                success: function (res) {
                    cb(JSON.parse(res));
                    console.log("本地存储获取成功");
                },
                fail: function (res) {
                    console.log(JSON.stringify(res));
                    cb(undefined);
                    console.log("本地存储获取失败");
                },
                complete: function (res) {
                }
            });
        }
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            BK.QQ.loadGameData(function (errCode, cmd, data) {
                BK.Script.log(1, 1, "joypac" + JSON.stringify(errCode));
                BK.Script.log(1, 1, "joypac" + JSON.stringify(data));
                this.cb(data);
            }.bind(this));
        }
    },



    /*
    托管数据的限制
    每个openid所标识的微信用户在每个游戏上托管的数据不能超过128个key-value对。
    上报的key-value列表当中每一项的key+value长度都不能超过1K(1024)字节。
    上报的key-value列表当中每一个key长度都不能超过128字节。
    dataObj.radishId 关卡Id 排行参数
    dataObj.maxScore 关卡成绩 显示成绩
    {"wxgame":{"score":16,"update_time": 1513080573},"cost_ms":36500}//value 示例
    */
    saveDataToWeChatCloud: function (dataObj) {

        let valueStr = {
            "wxgame": {
                "score": dataObj.radishId + '',
                "update_time": Math.floor(new Date().getTime() / 1000)
            },
            "const_ms": dataObj.maxScore
        };
        var kvDataList = [];
        kvDataList.push({
            key: 'radishRecord',
            value: JSON.stringify(valueStr)
        });

        console.log(kvDataList);
        wx.setUserCloudStorage({
            KVDataList: kvDataList,
            success: function (res) {
                console.log("上传数据成功");
            },
            fail: function (res) {
                console.log("上传数据失败");

            },
            complete: function (res) {
                console.log("接口调用结束，调用成功、失败都会执行");
            }
        });
    },
    // wx.getFriendCloudStorage（）拉取当前用户所有同玩好友的托管数据（开放数据域使用）排行榜项目域使用
    // wx.getUserCloudStorage(Object object)获取用户托管数据
    showChildCmd: function (cmd) {
        //1.发消息给子域
        if (cmd == "showRank") {
            wx.postMessage({ message: 'showRank' });//显示排行榜；
        }
    },

    print: function (msg) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            console.log("joypac" + msg)
        }
        if (cc.sys.platform === cc.sys.QQ_PLAY) {
            BK.Script.log(1, 1, "joypac" + msg);
        }
    },

    initAnalytics: function () {

        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
        } else if (cc.sys.QQ_PLAY === cc.sys.platform) {
            window.GameAnalytics = window.GameAnalytics || function () { (GameAnalytics.q = GameAnalytics.q || []).push(arguments) };
            GameAnalytics("setEnabledInfoLog", true);
            GameAnalytics("initialize", "41fa0f9d0199535cb516644b132cbe2b", "b3b91e903a0ff8d5610b9506c5e40c3782edab1d");
        } else {
            if (JPlatform.getInstance().platform === "xiaomi") {
                window.GameAnalytics = window.GameAnalytics || function () { (GameAnalytics.q = GameAnalytics.q || []).push(arguments) };
                GameAnalytics("setEnabledInfoLog", true);
                GameAnalytics("initialize", "27c6e8707d0215ad21ae70315d4983cf", "32994b4afc2250803eb999b6011eaa0b212c43a1");
            }
        }
    },

    rankEnterAnalytics: function () {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.aldSendEvent('EnterRank', { 'times': 1 })
        } else {
            GameAnalytics("addDesignEvent", "Rank", 1);
        }
    },

    stagePassAnalytics: function (radishId) {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            wx.aldSendEvent('StageClear', { 'stage': radishId })
        } else if (cc.sys.QQ_PLAY === cc.sys.platform) {
            GameAnalytics("addProgressionEvent", "Complete", "", "", "", radishId);
        } else {
            if (JPlatform.getInstance().platform === "xiaomi") {
                GameAnalytics("addProgressionEvent", "Complete", "", "", "", radishId);
            }
        }
    },

    cancelReviveAnalytics: function (radishId) {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            wx.aldSendEvent('StageFail', { 'stage': radishId })
        } if (cc.sys.QQ_PLAY === cc.sys.platform) {
            GameAnalytics("addProgressionEvent", "Fail", "", "", "", radishId);
        } else {
            if (JPlatform.getInstance().platform === "xiaomi") {
                GameAnalytics("addProgressionEvent", "Fail", "", "", "", radishId);
            }
        }

    },

    vedioReviveAnalytics: function () {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            wx.aldSendEvent('VedioRevive', { 'times': 1 })
        } else if (cc.sys.QQ_PLAY === cc.sys.platform) {
            GameAnalytics("addDesignEvent", "Revive:VedioPlay", 1);
        } else {
            if (JPlatform.getInstance().platform === "xiaomi") {
                GameAnalytics("addDesignEvent", "Revive:VedioPlay", 1);
            }
        }
    },

    shareReviveAnalytics: function () {
        if (cc.sys.WECHAT_GAME === cc.sys.platform) {
            wx.aldSendEvent("ShareRevive", "times", 1);
        } else if (cc.sys.QQ_PLAY === cc.sys.platform) {
            GameAnalytics("addDesignEvent", "Revive:Share", 1);
        } else {
            if (JPlatform.getInstance().platform === "xiaomi") {
                GameAnalytics("addDesignEvent", "Revive:Share", 1);
            }
        }
    }

});

/**
 * 广告实例
 */
var AD = function () {
    this.adOpen = cc.sys.platform === cc.sys.QQ_PLAY ? true : false;
    this.isBannerAdOK = false;
    this.isVedioAdOK = false;
    this.isInterstitialAdOK = false;
    this.bannerAd = null;
    this.rewardedVideoAd = null;
    this.adUnitId = 0;
    this.onStart = null;
    this.onLoad = null;
    this.onClose = null;    //传入参数 是否播放完成
    this.onError = null;
    this.isVedioEnded = false;    //微信不提供此接口
    this.vedioPlaying = false;
    this.createBanner = function createBanner(andShow = false, onLoad = null, left = 0, top = 0, width = 320, height = 100) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            // let bannerAd = wx.createBannerAd({
            //     adUnitId: 'adunit-5039e371b2b7bef2'
            //     style: {
            //         left: 0,
            //         top: 0,
            //         width: 350
            //     }
            // })
            // bannerAd.show();
            this.bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-5039e371b2b7bef2',
                style: {
                    left: 0,
                    top: 0,
                    width: 320,
                    height: 80
                }
            });

            this.bannerAd.onLoad(function () {
                if (this.bannerAd !== undefined || this.bannerAd !== null) {
                    this.isBannerAdOK = true;
                    if (onLoad !== null) {
                        onLoad();
                    }
                } else {
                    this.isBannerAdOK = false;
                }
            }.bind(this))

        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            BK.Advertisement.fetchBannerAd(function (retCode, msg, adBannerHandle) {
                if (retCode == 0) {
                    this.isBannerAdOK = true;
                    this.bannerAd = adBannerHandle;
                    BK.Script.log(1, 1, "joypac 获取到了 广告:" + this.bannerAd);
                    //2.2 开发者主动关闭广告。
                    //adBannerHandle.close(); 
                    //2.3 开发者监听事件
                    this.bannerAd.onClickContent(function () {
                        // SDK 不提供接口
                        BK.Script.log(1, 1, "joypac 点击了广告 msg:" + msg);
                    });
                    this.bannerAd.onClickClose(function () {
                        // SDK 不提供接口
                        BK.Script.log(1, 1, "joypac 关闭了广告 msg:" + msg);
                    });
                    if (andShow) {
                        this.bannerAd.show(function (succCode, msg, handle) {
                            if (succCode == 0) {
                                //
                            }
                            else {
                                BK.Script.log(1, 1, "展示失败 msg:" + msg);
                            }
                        }.bind(this));
                    }
                    if (onLoad !== null) {
                        onLoad();
                    }
                } else {
                    this.isBannerAdOK = false;
                }
            }.bind(this));
        } else {
            if (JPlatform.getInstance().platform === "OPPO") {

            }
        }
    };

    this.createInterstitialAd = function createInterstitialAd() {
        // if (this.platform === "OPPO") {
        console.log("拉取插屏广告");
        this.interstitialAd = opUnion.createInterstitialAd({
            posId: "26697",
            mediaId: "101000055"
        })

        console.log('开始插屏广告加载')

        this.interstitialAd.onLoad(function () {
            JPlatform.getInstance().getAd().isInterstitialAdOK = true;
            console.log('插屏广告加载成功')
        })

        this.interstitialAd.onError(function (err) {
            JPlatform.getInstance().getAd().isInterstitialAdOK = false;
            console.log(err);
            console.log('插屏广告加载失败')
        })
    };

    this.showInterstitial = function showInterstitial(onShow, onClose) {
        if (this.platform === "OPPO") {
            this.interstitialAd.onClose(function () {
                onClose();
                console.log('插屏⼴告关闭');
            }.bind(this))
            this.interstitialAd.show().catch(function (err) {
                this.interstitialAd.load().then(function () {
                    this.interstitialAd.show()
                }.bind(this))
            })
        }
    }

    this.createVideo = function createVideo(onLoad, onStart = null, onClose = null, onError = null) {
        this.vedioSetCallBack(onLoad, onStart, onClose, onError);
        console.log("设置onload")
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // let videoAd = wx.createRewardedVideoAd({
            //     adUnitId: 'adunit-85a936fb437f4961'
            // })

            // videoAd.load()
            // .then(() => videoAd.show())
            // .catch(err => console.log(err.errMsg))

            // if (this.adUnitId !== 0) {
            this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-f9279a1489084761' });
            this.rewardedVideoAd.load()
                .then(() => this.isVedioAdOK = true)
                .catch(err => this.isVedioAdOK = false)
            // }
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            var videoType = 0; //激励视频广告场景 0.游戏页面挂件广告 1.游戏结算页广告 2.游戏任务广告  3.游戏复活广告 
            BK.Advertisement.fetchVideoAd(videoType, function (retCode, msg, handle) {
                if (retCode == 0) {
                    this.isVedioAdOK = true;
                    this.rewardedVideoAd = handle;
                    if (this.onLoad !== null) {
                        this.onLoad();
                    }
                } else {
                    this.isVedioAdOK = false;
                    if (this.onError !== null) {
                        this.onError(retCode);
                    }
                }
            }.bind(this));
        } else {
            if (this.platform === "4399") {
                console.log("进入4399")
                let canPlay = window.h5api.canPlayAd();
                console.log(canPlay)
                if (canPlay) {
                    console.log("加载视频")
                    this.isVedioAdOK = ture;
                    this.onLoad();
                }
            }
            if (this.platform === "gb4399") {
                this.isVedioAdOK = false;
                this.onError(0);
            }
            if (JPlatform.getInstance().platform === "OPPO") {

            }
        }
    };

    this.isCanShowVideo = function isCanShowVideo() {
        let canShow = false;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let curVersion = wx.getSystemInfoSync().SDKVersion;
            if (this.compareWeChatVersion(curVersion, "2.0.4") === -1) {
                console.log("-->版本过低，视频不支持");
            } else {
                canShow = true;
            }
        }
        return canShow;
    };

    this.showBanner = function showBanner() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            var phone = wx.getSystemInfoSync();
            console.log(phone);
            var w = phone.screenWidth / 2;
            var h = phone.screenHeight;
            this.bannerAd.style.left = w - this.bannerAd.style.realWidth / 2;
            this.bannerAd.style.top = h - this.bannerAd.style.realHeight;
            this.bannerAd.show();
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            if (this.bannerAd === null) {
                this.createBanner(true);
                BK.Script.log(1, 1, "joypac" + "banner广告为空");
                return;
            }
            this.bannerAd.show(function (succCode, msg, handle) {
                if (succCode == 0) {
                    //
                }
                else {
                    BK.Script.log(1, 1, "展示失败 msg:" + msg);
                }
            }.bind(this));
        } else if (this.platform === "OPPO") {
            if (this.isBannerAdOK) {
                // let ad_node = document.getElementById("ad");
                // ad_node.style.display = "block";//block
            }
        }
    };
    this.hideBanner = function hideBanner() {
        if (this.bannerAd === null) {
            return;
        }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.bannerAd.hide();
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            if (this.bannerAd !== null) {
                this.bannerAd.close();
                this.bannerAd = null;
                this.isBannerAdOK = false;
                this.createBanner();
            }
        } else if (JPlatform.getInstance().platform === "OPPO") {
            if (this.isBannerAdOK) {
                // let ad_node = document.getElementById("ad");
                // ad_node.style.display = "none";//block
            }
        }
    };
    this.destroyBanner = function destroy() {
        if (this.bannerAd === null) {
            return;
        }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.bannerAd.destroy();
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this.bannerAd.close();
        }
    };
    this.vedioPlay = function vedioPlay(onStart, onClose) {
        this.vedioSetCallBack(null, onStart, onClose, null);
        // this.isVedioAdOK = false;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.rewardedVideoAd.onClose(function (res) {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    onClose(res.isEnded);
                } else {
                    onClose(false);
                    // 播放中途退出，不下发游戏奖励
                }
                this.vedioPlaying = false;
            }.bind(this))
            this.rewardedVideoAd.show()
                .then(function () {
                    this.vedioPlaying = true;
                    onStart()
                }.bind(this));
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this.rewardedVideoAd.jump();
        } else {
            if (JPlatform.getInstance().platform === "4399") {
                console.log("4399广告");
                function callback(obj) {
                    console.log('代码:' + obj.code + ',消息:' + obj.message)
                    if (obj.code === 10000) {
                        onStart();
                        console.log('开始播放')
                    } else if (obj.code === 10001) {
                        onClose(true);
                        console.log('播放结束')
                    } else {
                        onClose(false);
                        console.log('广告异常')
                    }
                }
                window.h5api.playAd(callback)
            }
            // if (this.onStart !== null) {
            //     onStart();
            // }
            // if (this.onClose !== null) {
            //     onClose(true);
            // }
            // console.log("不支持视频")
        }
    };
    this.vedioSetCallBack = function vedioSetCallBack(onLoad, onStart, onClose, onError) {
        this.onLoad = (onLoad === null) ? this.onLoad : onLoad;
        this.onStart = (onStart === null) ? this.onStart : onStart;
        this.onClose = (onClose === null) ? this.onClose : onClose;
        this.onError = (onError === null) ? this.onError : onError;
        if (this.rewardedVideoAd === null) {
            return;
        }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // this.RewardedVideoAd.onLoad(this.onLoad);
            // this.RewardedVideoAd.onClose(this.onClose);
            // this.RewardedVideoAd.onError(this.onError);
        } else if (cc.sys.platform === cc.sys.QQ_PLAY) {
            this.rewardedVideoAd.setEventCallack(
                function (code, msg) {

                }.bind(this),
                function (code, msg) {
                    if (code === 0) {
                        BK.Script.log(1, 1, "joypac" + "广告视频播放完成.code:" + code + " msg" + msg);
                        this.isVedioEnded = true;
                    }
                }.bind(this),   //播放完
                function (code, msg) {
                    BK.Script.log(1, 1, "joypac" + "关闭广告.code:" + code + " msg" + msg);
                    this.vedioPlaying = false;
                    if (this.onClose !== null) {
                        this.onClose(this.isVedioEnded);
                    }
                }.bind(this), //关闭
                function (code, msg) {
                    BK.Script.log(1, 1, "joypac" + "广告视频开始播放.code:" + code + " msg" + msg);
                    this.isVedioEnded = false;
                    this.vedioPlaying = true;
                    if (this.onStart !== null) {
                        this.onStart();
                    }
                }.bind(this)); //开始播放
        } else {
            if (this.platform === "4399") {
                this.onLoad = onLoad;
            }
        }
    }
};

JPlatform._instance = null;
JPlatform.getInstance = function () {
    if (!JPlatform._instance) {
        JPlatform._instance = new JPlatform();
        JPlatform._instance.init();
    }
    return JPlatform._instance;
}

module.exports = JPlatform;