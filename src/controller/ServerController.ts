class ServerController {
    private static instance: ServerController = null;

    public static MSG_GOTMAP = 100;    //获得地图 开始游戏
    public static MSG_PLAYER = 101;
    public static MSG_HITGRID = 200;   //打击的位置
    public static MSG_NEWBULLET = 201; //发送新炮弹
    public static MSG_EFFECTGRID = 202; //攻击的格子
    public static MSG_FIRINGGRID = 203;
    public static MSG_AFTERGRID = 204;
    public static MSG_WINGAME = 300;   //胜利游戏
    public static MSG_TIMEUP = 301;    //时间结束
    public static MSG_BULLETUP = 302;  // 炮弹用光
    public static MSG_GIVEUP = 303;    //主动放弃
    public static MSG_NICEWORD = 400;
    public static MSG_GAMEOVER = 500;
    public static MSG_ONCEMORE = 501;

    constructor() {
        if (ServerController.instance) {
            throw new Error("ServerController singlon error")
        }
        this.init();
    }

    private server = null;

    public oppoIsRobot = false;

    public roomInfo = {};
    public hasGameStart = false;
    public gameEnding = false;
    public gameResult = [];

    public imReady = false;
    public areYouReady = false;

    public imFinished = false;
    public areYouFinished = false;

    public amIWonFirst = false;
    public areYouWon = false;
    public amIWon = false;

    public imGoOn = false;
    public imGiveUp = false;
    public areYouGoOn = false;

    public platformSupport = true;

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new ServerController();
        }
        return this.instance;
    }

    private init() {
        this.matching = false;
        this.server = platform.getGameServerManager();
        if (this.server == null) {
            this.platformSupport = false;
        }
    }


    public backToHome() {
        this.pairGame = false;

        if (this.matching) {
            this.cancelMatch();
            this.matching = false;
        }
        if (this.hasGameStart) {
            this.hasGameStart = false;
            this.endGame();
        }
    }

    public serverLogin() {
        SceneManager.getInstance().showTip("准备中，请稍后")
        if (this.server) {
            platform.gameServerLogin(this.server, () => {
                GameController.getInstance().startPlacingGame();
                this.onLogin();
            }, () => {
                SceneManager.getInstance().showTip("链接服务器失败");
            });
        } else {
            SceneManager.getInstance().showTip("该平台不支持,请到微信中寻找~飞机在哪里，匹配对手吧");
        }
    }

    public startRobotMatch() {
        this.oppoIsRobot = true;
        this.hasGameStart = true;
        this.openId = "playerId";
        this.oppoId = "robotId";
    }

    public getNetworkType() {

    }

    // 服务器通用
    public reconnect() {

    }

    public onLogin() {
        this.pairGame = true;
        SceneManager.getInstance().toPlacingScene();
    }


    public onLougout() {

    }

    /**
     * 创建房间模式
     */

    public createRoom() {

    }

    public joinRoom() {

    }

    public getRoomInfo() {

    }

    public onRoomInfoChange() {

    }

    public broadcastInRoom() {

    }


    /**
     * 匹配模式
     */
    public pairGame = false;
    public matching = false;
    private raceId;
    private groupInfoList;

    public startMatch() {
        this.matching = true;
        if (!this.platformSupport) {
            SceneManager.getInstance().placingScene.matchButtons.updateMatchButton();
            return;
        }
        platform.startMatch(this.server, (res) => {
            this.matching = false;
            this.onMatch(res);
        }, () => {
            this.matching = true;
            SceneManager.getInstance().placingScene.matchButtons.updateMatchButton();
        }, (code) => {
            this.onMatchError(code);
        }, (res) => {
            this.onJoin(res);
        })
    }

    public onMatchError(code) {
        switch (code) {
            case 500001:
                this.matching = true;
                break;

            case 500003:
                this.matching = false;
                break;

            default:
                break;
        }
        SceneManager.getInstance().placingScene.matchButtons.updateMatchButton();
    }


    public cancelMatch() {
        this.matching = false;
        if (!this.platformSupport) {
            return;
        }
        platform.cancelMatch(this.server, () => {
            if (!this.oppoIsRobot) {
                SceneManager.getInstance().placingScene.matchButtons.updateMatchButton();
            }
        }, (code) => {
            this.onMatchError(code);
        })
    }

    private openId = "";
    private oppoId = "";

    public onMatch(res) {
        this.matching = false;
        this.oppoIsRobot = false;
        SceneManager.getInstance().placingScene.matchButtons.stopRotobMatch();
        if (res != undefined) {
            this.openId = res.openId;
            for (let i = 0; i < res.groupInfoList.length; i++) {
                if (res.groupInfoList[i].memberInfoList[0].openId != this.openId) {
                    this.oppoId = res.groupInfoList[i].memberInfoList[0].openId;
                    let userInfo = {
                        avatarUrl: res.groupInfoList[i].memberInfoList[0].avatarUrl,
                        nickName: res.groupInfoList[i].memberInfoList[0].nickName
                    };
                    PlayerController.getInstance().setOpponentUserInfo(userInfo)
                }
            }
        }
    }

    public onJoin(res) {
        SceneManager.getInstance().showTip("匹配成功，请在30秒内完成飞机布置");
        SceneManager.getInstance().placingScene.onMatchUpdate();
        this.startGame();
    }

    public offMatch() {

    }


    /**
     * 开始游戏
     */

    public startGame() {
        // 开始游戏 等待双方选择地图 uploadFrame []

        platform.startGame(this.server,
            (res) => { this.onStartGame(); },
            (res) => {
                this.onSyncFrame(res)
            },
            (res) => { this.onGameEnd() }
        )
        this.hasGameStart = true;

    }

    public endGame() {
        if (this.hasGameStart && !this.gameEnding) {
            this.uploadGameOver();
            this.imGiveUp = true;
            this.gameEnding = true;
            platform.endGame(this.server);
        }
    }

    public uploadPlayerData(pd) {
        let data = [JSON.stringify({ code: ServerController.MSG_PLAYER, player: pd, openId: this.openId })];
        this.uploadFrame(data);
        // let res = {
        //     actionList: data
        // };
        // this.onSyncFrame(res);
    }

    public uploadMapData(map) {
        this.imReady = true;
        let data = [JSON.stringify({ code: ServerController.MSG_GOTMAP, mapId: map, openId: this.openId })];
        this.uploadFrame(data);
        if (this.imReady && this.areYouReady) {
            if (this.oppoIsRobot) {
                GameController.getInstance().startRobotPlayerGame();
            } else {
                GameController.getInstance().startMultiplayerGame();
            }
            this.imReady = false;
            this.areYouReady = false;
            this.imFinished = false;
            this.areYouFinished = false;
            this.amIWonFirst = false;
            this.areYouWon = false;
            this.amIWon = false;
        }
    }

    public uploadHitGrid(grid, bullet) {
        let data = [JSON.stringify({ code: ServerController.MSG_HITGRID, grid, bullet, openId: this.openId })];
        this.uploadFrame(data);
        // let res = {
        //     actionList: data
        // };
        // this.onSyncFrame(res);
    }

    public uploadEffectGrids(list) {
        let data = [JSON.stringify({ code: ServerController.MSG_EFFECTGRID, effectList: list, openId: this.openId })];
        this.uploadFrame(data);
        // let res = {
        //     actionList: data
        // };
        // this.onSyncFrame(res);
    }

    public uploadFiringGrids(list) {
        let data = [JSON.stringify({ code: ServerController.MSG_FIRINGGRID, firingList: list, openId: this.openId })];
        this.uploadFrame(data);
        // let res = {
        //     actionList: data
        // };
        // this.onSyncFrame(res);
    }

    public uploadBullet(bullet) {
        let data = [JSON.stringify({ code: ServerController.MSG_NEWBULLET, bullet, openId: this.openId })];
        this.uploadFrame(data);
    }

    public uplodaGameEnd(result) {
        this.imFinished = true;
        let data;
        if (result == ResultTypeEnum.WIN) {
            if (!this.areYouWon) {
                this.amIWonFirst = true;
            }
            this.amIWon = true;
            data = [JSON.stringify({ code: ServerController.MSG_WINGAME, openId: this.openId })];
        } else if (result == ResultTypeEnum.FAIL) {
            this.amIWon = false;
            data = [JSON.stringify({ code: ServerController.MSG_BULLETUP, openId: this.openId })];
        } else {
            this.amIWon = false;
            data = [JSON.stringify({ code: ServerController.MSG_GIVEUP, openId: this.openId })];
        }
        this.uploadFrame(data);
    }

    public uploadGameOver() {
        let data = [JSON.stringify({ code: ServerController.MSG_GAMEOVER, openId: this.openId })];
        this.uploadFrame(data);
    }

    public uploadWord(word) {
        let data = [JSON.stringify({ code: ServerController.MSG_NICEWORD, word: word, openId: this.openId })];
        this.uploadFrame(data);
    }

    public uploadOnceMore() {
        let data = [JSON.stringify({ code: ServerController.MSG_ONCEMORE, openId: this.openId })];
        this.uploadFrame(data);
    }

    public uploadFrame(action) {
        if (this.oppoIsRobot) {
            return;
        }
        platform.uploadFrame(this.server, action);
    }

    public onStartGame() {
        console.log(JSON.parse(PlayerController.getInstance().getData().getDataString()));
        this.uploadPlayerData(JSON.parse(PlayerController.getInstance().getData().getDataString()));
        SceneManager.getInstance().placingScene.onGameStart();
    }

    public setImGoOn() {
        this.imGoOn = true;
        if (this.areYouGoOn) {
            this.onStartGame();
        }
    }

    /**
     * 根据收到不同的同步信息处理结果
     */
    public onSyncFrame(res) {
        if (res.actionList.length > 0) {
            for (let i = 0; i < res.actionList.length; i++) {
                let data = JSON.parse(res.actionList[i]);
                if (data.openId == this.oppoId) {
                    switch (data.code) {
                        case ServerController.MSG_PLAYER:
                            let playerData = data.player;
                            PlayerController.getInstance().setOpponentData(playerData);
                            SceneManager.getInstance().matchScene.updateOppoData(playerData);
                            SceneManager.getInstance().oppoPlayerDetail.tellWorld("狭路相逢，请多多指教！");
                            break;

                        case ServerController.MSG_GOTMAP:
                            this.areYouReady = true;
                            let list = MapUtil.headIdToHeadData(data.mapId);
                            PlayerController.getInstance().setOpponentMap(list);
                            SceneManager.getInstance().showTip("对手已经准备就绪");
                            if (this.areYouReady && this.imReady) {
                                if (this.oppoIsRobot) {
                                    GameController.getInstance().startRobotPlayerGame();
                                } else {
                                    GameController.getInstance().startMultiplayerGame();
                                }
                                this.imReady = false;
                                this.areYouReady = false;
                                this.imFinished = false;
                                this.areYouFinished = false;
                                this.amIWonFirst = false;
                                this.areYouWon = false;
                                this.amIWon = false;
                            }
                            break;

                        case ServerController.MSG_HITGRID:
                            SceneManager.getInstance().matchScene.hitGrid(data.grid, data.bullet);
                            break;

                        case ServerController.MSG_BULLETUP:
                            SceneManager.getInstance().oppoPlayerDetail.tellWorld("你的飞机都在哪里?");
                            this.areYouFinished = true;
                            this.areYouWon = false;
                            if (this.imFinished) {
                                GameController.getInstance().gameFinished(false);
                            }
                            break;

                        case ServerController.MSG_EFFECTGRID:
                            SceneManager.getInstance().matchScene.showGrid(data.effectList)
                            break;

                        case ServerController.MSG_FIRINGGRID:
                            SceneManager.getInstance().matchScene.showFiring(data.firingList)
                            break;

                        case ServerController.MSG_NEWBULLET:
                            BulletController.getInstance().onUpdateOpponentNewBullet(data.bullet);
                            break;

                        case ServerController.MSG_TIMEUP:
                            SceneManager.getInstance().oppoPlayerDetail.tellWorld("留给我得时间不多了");
                            this.areYouFinished = true;
                            this.areYouWon = false;
                            if (this.imFinished) {
                                GameController.getInstance().gameFinished(false);
                            }
                            break;

                        case ServerController.MSG_WINGAME:
                            SceneManager.getInstance().oppoPlayerDetail.tellWorld("我已经找到你飞机啦");
                            this.areYouFinished = true;
                            this.areYouWon = true;
                            if (this.imFinished) {
                                if (this.amIWonFirst) {
                                    GameController.getInstance().gameFinished(true);
                                } else {
                                    GameController.getInstance().gameFinished(false);
                                }
                            }
                            break;

                        case ServerController.MSG_GAMEOVER:
                            this.endGame();
                            break;

                        case ServerController.MSG_ONCEMORE:
                            this.areYouGoOn = true;
                            if (this.imGoOn) {
                                this.onStartGame();
                            }
                            break;

                        case ServerController.MSG_NICEWORD:
                            // SceneManager.getInstance().showTip(data.word);
                            SceneManager.getInstance().oppoPlayerDetail.tellWorld(data.word);
                            break;

                        case ServerController.MSG_GIVEUP:
                            SceneManager.getInstance().oppoPlayerDetail.tellWorld("我放弃了，你赢了！");
                            this.areYouFinished = true;
                            this.areYouWon = false;
                            if (this.imFinished) {
                                GameController.getInstance().gameFinished(false);
                            }
                            // GameController.getInstance().gameFinished(true);
                            break;
                    }
                }
            }


        }
    }

    public onGameEnd() {
        this.gameEnding = false
        this.hasGameStart = false;
        SceneManager.getInstance().placingScene.onGameEnd();
    }

    public getOpponentData() {
        return null;
        // return this.opponent;
    }
}
