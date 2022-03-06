//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2018-present, Eyeball(E8) Technology. 
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY E8 AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL E8 AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        AdaptSceenUtil.E8ScaleMode();
        egret.lifecycle.addLifecycleListener((context) => {

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();

        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await RES.loadConfig("resource/preload.res.json", "resource/");

        await RES.loadGroup("preload", 0);
        // await RES.loadGroup("sound", 0);
        SceneManager.getInstance().init(this.stage);
        this.showLogo();
    }

    private static CG;

    private async showLogo() {
        let save = SaveDataManager.getInstance().getUserData();
        let logoLayer = SceneManager.getInstance().getLoadingLayer();
        Main.CG = new CG();
        logoLayer.addChild(Main.CG);

        let bird = new egret.Bitmap();
        bird.texture = RES.getRes("bird_png");
        bird.visible = (Math.random() < 0.05 && save.missles.length > 1 && save.missles.indexOf(6) == -1);
        let pos = Math.floor(Math.random() * 6);
        let xList = [0, 230, 190, 280, 500, 530];
        let yList = [260, 260, 320, 260, 210, 160];
        bird.x = AdaptSceenUtil.x_fix() + xList[pos];
        bird.y = AdaptSceenUtil.y_fix() > 150 ? 0 : AdaptSceenUtil.y_fix() - 150 + yList[pos];
        bird.touchEnabled = true;
        bird.addEventListener(egret.TouchEvent.TOUCH_TAP, this.birdTouched, this);
        logoLayer.addChild(bird);

        let title = new egret.Bitmap();
        title.texture = RES.getRes("title_png");
        title.anchorOffsetX = title.width / 2;
        // DrawUtil.setImageColor(Title, ArrayUtil.random(ColorEnum.colorList, 1));
        title.x = AdaptSceenUtil.curWidth() / 2;
        title.y = AdaptSceenUtil.y_fix() > 150 ? 0 : AdaptSceenUtil.y_fix() - 150;
        logoLayer.addChild(title);
        title.touchEnabled = false;


        Main.health_text = new egret.TextField();
        Main.health_text.multiline = true;
        Main.health_text.textAlign = egret.HorizontalAlign.CENTER;
        let health_tips = "健康游戏忠告,抵制不良游戏，拒绝盗版游戏。,注意自我保护，谨防受骗上当。,适度游戏益脑，沉迷游戏伤身。,合理安排时间，享受健康生活。".split(",");
        Main.health_text.text = health_tips[0] + "\n" +
            health_tips[1] + "\n" +
            health_tips[2] + "\n" +
            health_tips[3] + "\n" +
            health_tips[4] + "\n";
        Main.health_text.x = AdaptSceenUtil.curWidth() / 2 - Main.health_text.width / 2;
        Main.health_text.y = AdaptSceenUtil.curHeight() - AdaptSceenUtil.y_fix() / 2 - Main.health_text.height - 50;
        logoLayer.addChild(Main.health_text);

        let copyright = new egret.TextField();
        copyright.multiline = true;
        copyright.textAlign = egret.HorizontalAlign.LEFT;
        copyright.size = 20;
        copyright.textColor = ColorEnum.BLACK;
        copyright.text = "著作权人:北京奕吧科技游戏公司";
        // copyright.x = AdaptSceenUtil.curWidth() - copyright.width;
        copyright.y = 10 + AdaptSceenUtil.y_fix() / 2;
        logoLayer.addChild(copyright);

        // egret.setTimeout(() => {
        //     Main.health_text.visible = false;
        //     // text.text = "游戏著作权人:北京奕吧科技游戏公司"
        // }, this, 3000);
        // egret.setTimeout(this.hideLogo, this, 2000);
        Main.Login();
    }

    private static health_text: egret.TextField;

    // 授权登录
    public static async Login() {
        await platform.login(() => {
            Main.health_text.visible = false;
        }, (isNew, res, code) => {
            Main.loading();
            if (platform.name == "web") {
                return
            }
            let userInfo = JSON.parse(res.rawData);
            // PlayerController.getInstance().userLogin();
            PlayerController.getInstance().setUserInfo(isNew, userInfo, code);
        });
        // await platform.getUserInfo((userInfo) => {
        //     console.log(userInfo);
        //     PlayerController.getInstance().setUserInfo(userInfo);
        // });
    }

    private birdTouched(e) {
        ArrayUtil.add(SaveDataManager.getInstance().getUserData().missles, BulletTypeEnum.ARMOR_PIERCING_MISSILE);
        SceneManager.getInstance().awayScene.ownBirdBullet();
    }

    private static async loading() {
        Main.CG.setText("正在请求资源");
        await Main.loadResource();
        Main.CG.setText("读取配置");
        PlayerController.getInstance().init();
        PlayerController.getInstance().setUpPlayerData();
        // ServerController.getInstance().uploadPlayerData(PlayerController.getInstance().getData().getDataString());
        // console.log(PlayerController.getInstance().getData().getDataString());
        Main.CG.setText("准备场景中");
        EconomicsController.getInstance().init();
        SceneManager.getInstance().prepareScene();

        Main.loginFinished = true;
        this.hideLogo();
    }

    private static loginFinished = false;
    public static logoFinished = false;

    public static hideLogo() {
        if (Main.loginFinished && Main.logoFinished) {
            Main.CG.setText("进入游戏");
            Main.createGameScene();
            SceneManager.getInstance().getLoadingLayer().removeChildren();
            SoundManager.getInstance().playBGM();
        }
    }

    private static async loadResource() {
        try {
            await ResourceManager.setDisplayRes("default.res.json");
            // await RES.loadConfig("resource/default.res.json", "resource/");
            await ResourceManager.setDisplayRes("config.res.json");
            // await RES.loadConfig("resource/config.res.json", "resource/");
            await RES.loadGroup("config", 0);
            await RES.loadGroup("guide", 0);
            await RES.loadGroup("ui", 0);
            await RES.loadGroup("city", 0);
            await RES.loadGroup("sound", 0);

            i18n.langData = await RES.getRes(ResourceManager.LANGUAGE_JSON);
            // this.stage.removeChild(loadingView);
        }
        catch (e) {
            Main.CG.setText("资源读取失败，请检查网络");
            console.error(e);
        }
    }

    static get width() {
        return AdaptSceenUtil.curWidth();
    }

    static get height() {
        return AdaptSceenUtil.curHeight();
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    public static createGameScene() {

        platform.initSDK();
        platform.onShow((res) => {
            let query = res.query;
            console.log(res);
            console.log(query);
            if (query && query !== undefined) {
                console.log("query");
                if (query.type == "puzzle" && query.puzzle !== undefined) {
                    GuideController.getInstance().setGuideFinished();
                    GameController.getInstance().attackSharedPuzzle(query.puzzle);
                } else if (query.type == "away" && query.mapId != undefined) {
                    let mapId = query.mapId;
                    console.log(mapId);
                    GuideController.getInstance().setGuideFinished();
                    GameController.getInstance().attackSharedMap(mapId, query.opponent);
                }

            }
        });
        // AIController.getInstance().whereToHit(status);
        // platform.enterFrom();
        // AIController.getInstance().computeIsBodyWhereIsHead();
        // AIController.getInstance().computeAllHeadDirectionBody();
        /**
         * UI界面
         */
        SceneManager.getInstance().initUIView();
        /**
         * 计算离线 行为
         */
        // 通过不同入口，进入不同界面
        let launchOption = platform.getLaunchOption();
        let query = launchOption.query;
        if (query && query !== undefined) {
            if (query.type == "puzzle" && query.puzzle !== undefined) {
                GuideController.getInstance().setGuideFinished();
                GameController.getInstance().attackSharedPuzzle(query.puzzle);
                return;
            } else if (query.type == "away" && query.mapId != undefined) {
                let mapId = query.mapId;
                console.log(mapId);
                GuideController.getInstance().setGuideFinished();
                GameController.getInstance().attackSharedMap(mapId, query.opponent);
                return;
            }
        }

        // SceneManager.getInstance().showAlert();


        SceneManager.getInstance().toTechScene();
        // SceneManager.getInstance().toMatchScene();
        if (GuideController.getInstance().isFinished()) {
            SceneManager.getInstance().showAlert();
            // let sayHello = EconomicsController.getInstance().loginCost;
            let user = SaveDataManager.getInstance().getUserData();
            let now = new Date().getTime();
            if (user.gas > user.gasMax) {
                let exceed = user.gas - user.gasMax;
                EconomicsController.getInstance().costGas(user.gas - user.gasMax);
                SceneManager.getInstance().showTip("原油储备爆仓，未能消耗完毕。扣除" + (user.gas - user.gasMax));
            }
            if (Math.random() < 0.2 || now - user.lastDate > 2 * DateUtil.HOUR) {
                egret.setTimeout(() => {
                    let ownGold = SaveDataManager.getInstance().getUserData().gold;
                    if (ownGold > 10000) {
                        let rob = Math.floor(ownGold / Math.log((32 - PlayerController.getInstance().getData().level * 2)))
                        EconomicsController.getInstance().costGold(rob);
                        SceneManager.getInstance().showTip("家里的金币，被恶人打劫啦" + rob);
                    } else {
                        EconomicsController.getInstance().costGold(1500);
                    }
                }, this, 2000);
            }
            egret.setTimeout(() => {
                if (user.loan.money > 0) {
                    EconomicsController.getInstance().payForLoan();
                }
                // SceneManager.getInstance().showTip("家里的金币，被恶人打劫啦" + sayHello.rob);
            }, this, 4000);
        }
        AdvertiseController.getInstance().initAd();
    }
}