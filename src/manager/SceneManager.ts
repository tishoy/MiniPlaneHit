/**
 * 
 */
class SceneManager {
    private static instance: SceneManager = null;

    public currentScene = null;

    // 放置GameView
    private gameLayer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    private loadingLayer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    private uiLayer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    private effectLayer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    private popLayer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
    private tipLayer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

    private _storedGameView: GameView;
    private _placingGameView: PlacingGameView;
    private alertView: Alert = null;
    private guide_view: GuideView;

    public _myPlayerDetail: PlayerDetail = null;
    public _oppoPlayerDetail: PlayerDetail = null;

    constructor() {

    }

    private egretStage: egret.Stage;

    public awayScene: AwayScene;
    public placingScene: PlacingScene;
    public resultScene: ResultScene;
    public techScene: TechScene;
    public puzzleScene: PuzzleScene;
    public historyScene: HistoryScene;
    public editorScene: EditorScene;
    public mineScene: MineScene;
    public matchScene: MatchScene;
    // public raceScene: RaceScene;

    private saveMsg: SaveDataManager;

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new SceneManager();
        }
        return this.instance;
    }

    public init(stage: egret.Stage): void {
        this.egretStage = stage;

        this.saveMsg = SaveDataManager.getInstance();

        // this.loadingScene = new LoadingScene();

        // this.initLayer(this.gameLayer);
        // this.initLayer(this.uiLayer);
        let bg = new BackGround();
        this.egretStage.addChild(bg);
        //GameView 层
        this.egretStage.addChild(this.gameLayer);


        //组件UI
        this.egretStage.addChild(this.uiLayer);
        //云彩层
        this.egretStage.addChild(this.effectLayer);
        this.egretStage.addChild(this.popLayer);
        this.egretStage.addChild(this.tipLayer);

        // 飞机图上打E8
        this.egretStage.addChild(this.loadingLayer);



    }

    private initLayer(layer) {
        layer.x = (AdaptSceenUtil.curWidth() - AdaptSceenUtil.displayWidth()) / 2;
        layer.y = (AdaptSceenUtil.curHeight() - AdaptSceenUtil.displayHeight()) / 2;
        this.egretStage.addChild(layer);
    }


    public initUIView() {
        this.headUI = new HeadUI();
        this.updateGas();
        this.updateGold();
        SceneManager.getInstance().getUILayer().addChild(this.headUI);

    }

    public get myPlayerDetail() {
        if (!this._myPlayerDetail) {
            this._myPlayerDetail = new PlayerDetail();
        }
        return this._myPlayerDetail;
    }

    public updateMyDetail(data) {
        this.myPlayerDetail.updateData(data);
    }

    public get oppoPlayerDetail() {
        if (!this._oppoPlayerDetail) {
            this._oppoPlayerDetail = new PlayerDetail();
        }
        return this._oppoPlayerDetail;
    }

    public updateOppoDetail(data) {
        this.oppoPlayerDetail.updateData(data)
    }

    private headUI: HeadUI = null;

    updateGold() {
        this.headUI.setGold(Math.max(this.saveMsg.getUserData().gold, 0));
    }

    updateGas() {
        this.headUI.setGas(Math.min(Math.max(this.saveMsg.getUserData().gas, 0)));
    }

    updateGasMax() {
        this.headUI.setGasMax();
    }

    public headUIEffect(isInEffect) {
        if (isInEffect) {
            this.headUI.inEffect();
        } else {
            this.headUI.outEffect();
        }
    }

    // ----------------------scene

    prepareScene() {
        this.balloon = new egret.Bitmap();
        this.balloon.touchEnabled = true;
        this.balloon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBalloonReward, this);
        this.effectLayer.addChild(this.balloon);
        this.targetBullet = new BulletView(false);

        this.awayScene = new AwayScene();
        this.placingScene = new PlacingScene();
        this.resultScene = new ResultScene();
        this.techScene = new TechScene();
        this.puzzleScene = new PuzzleScene();
        this.matchScene = new MatchScene();
        this.historyScene = new HistoryScene();
        this.editorScene = new EditorScene();
        // this.placingScene.x = 0;
        // this.resultScene.x = 0;
        // this.techScene.x = 0;
        // this.gameLayer.addChild(SceneManager.getInstance().awayScene);
        // this.gameLayer.addChild(SceneManager.getInstance().cityScene);


        // this.gameLayer.addChild(this.placingScene);
        // this.gameLayer.addChild(this.resultScene);

        // this.currentScene = SceneManager.getInstance().cityScene;
    }

    public toTechScene() {
        if (this.currentScene === this.techScene) {
            return;
        }
        if (this.currentScene) {
            this.currentScene.outAnimate();
        }
        GameController.getInstance().type = GameTypeEnum.GAME_TYPE_IDLE;
        this.techScene.inAnimate();
        this.gameLayer.addChild(SceneManager.getInstance().techScene);
        if (this.gameLayer.contains(this.currentScene)) {
            this.gameLayer.removeChild(this.currentScene);
        }
        this.currentScene = this.techScene;
    }

    public toMatchScene() {
        if (this.currentScene === this.matchScene) {
            return;
        }
        if (this.currentScene) {
            this.currentScene.outAnimate();
        }
        this.matchScene.inAnimate();
        this.gameLayer.addChild(SceneManager.getInstance().matchScene);
        if (this.gameLayer.contains(this.currentScene)) {
            this.gameLayer.removeChild(this.currentScene);
        }
        this.currentScene = this.matchScene;
    }

    public toEditorScene() {
        if (this.currentScene === this.editorScene) {
            return;
        }
        if (this.currentScene) {
            this.currentScene.outAnimate();
        }
        this.editorScene.inAnimate();
        this.gameLayer.addChild(SceneManager.getInstance().editorScene);
        if (this.gameLayer.contains(this.currentScene)) {
            this.gameLayer.removeChild(this.currentScene);
        }
        this.currentScene = this.editorScene;
    }

    public toResultScene() {
        if (this.currentScene === this.resultScene) {
            return;
        }
        if (this.currentScene) {
            this.currentScene.outAnimate();
        }
        this.resultScene.inAnimate();
        this.gameLayer.addChild(SceneManager.getInstance().resultScene);
        if (this.gameLayer.contains(this.currentScene)) {
            this.gameLayer.removeChild(this.currentScene);
        }
        this.currentScene = this.resultScene;
    }

    public toAwayScene() {
        if (this.currentScene === this.awayScene) {
            return;
        }
        if (this.currentScene) {
            this.currentScene.outAnimate();
        }
        this.awayScene.inAnimate();
        this.gameLayer.removeChildren();
        this.gameLayer.addChild(this.awayScene);
        if (this.gameLayer.contains(this.currentScene)) {

            this.gameLayer.removeChild(this.currentScene);
        }
        this.currentScene = this.awayScene;
    }

    public toPlacingScene() {
        if (this.currentScene === this.placingScene) {
            return;
        }
        if (this.currentScene) {
            this.currentScene.outAnimate();
        }
        this.placingScene.inAnimate();
        this.gameLayer.addChild(SceneManager.getInstance().placingScene);
        if (this.gameLayer.contains(this.currentScene)) {
            this.gameLayer.removeChild(this.currentScene);
        }
        this.currentScene = this.placingScene;
    }

    public toPuzzleScene() {
        if (this.currentScene === this.puzzleScene) {
            return;
        }
        if (this.currentScene) {
            this.currentScene.outAnimate();
        }
        this.puzzleScene.inAnimate();
        this.gameLayer.removeChildren();
        this.gameLayer.addChild(this.puzzleScene);
        if (this.gameLayer.contains(this.currentScene)) {

            // this.gameLayer.removeChild(this.currentScene);
        }
        this.currentScene = this.puzzleScene;
    }

    public toHistoryScene() {
        if (this.currentScene === this.historyScene) {
            return;
        }
        if (this.currentScene) {
            this.currentScene.outAnimate();
        }
        this.historyScene.inAnimate();
        this.gameLayer.removeChildren();
        this.gameLayer.addChild(this.historyScene);
        if (this.gameLayer.contains(this.currentScene)) {

            // this.gameLayer.removeChild(this.currentScene);
        }
        this.currentScene = this.historyScene;
    }

    // layer get

    public getGameLayer(): egret.DisplayObjectContainer {
        return this.gameLayer;
    }

    public getEffectLayer(): egret.DisplayObjectContainer {
        return this.effectLayer
    }

    public getUILayer(): egret.DisplayObjectContainer {
        return this.uiLayer;
    }

    public getLoadingLayer(): egret.DisplayObjectContainer {
        return this.loadingLayer;
    }

    public getPopLayer(): egret.DisplayObjectContainer {
        return this.popLayer;
    }

    public getTipLayer(): egret.DisplayObjectContainer {
        return this.tipLayer;
    }

    // -----------Pop

    public getGuideView() {
        return this.guide_view;
    }

    public showGuide(type = null) {
        if (this.guide_view == null) {
            this.guide_view = new GuideView();
            this.guide_view.anchorOffsetX = this.guide_view.width / 2;
            this.guide_view.anchorOffsetY = this.guide_view.height / 2;
            this.guide_view.x = AdaptSceenUtil.curWidth() / 2;
            this.guide_view.y = AdaptSceenUtil.curHeight() / 2;
        }
        if (type != null) {
            this.guide_view.setType(type);
        }
        SoundManager.getInstance().playSound(SoundEnum.POPUP_MP3);
        SceneManager.getInstance().getPopLayer().addChild(this.guide_view);
    }

    public hideGuide() {
        if (SceneManager.getInstance().getPopLayer().contains(this.guide_view)) {
            SoundManager.getInstance().playSound(SoundEnum.POPUP_MP3);
            SceneManager.getInstance().getPopLayer().removeChild(this.guide_view);
        }
    }

    public showAlert(title = "报告", context = "欢迎您指挥官返航，快来看看您的基地发生了什么！", leftButtonText = "执 行", leftCallBack = null, rightButtonText = "", rightCallBack = null, touchClose = false, closeCallBack = () => { }) {
        if (this.popLayer.contains(this.guide_view)) {
            return;
        }
        if (this.alertView == null) {
            this.alertView = new Alert();
        }
        this.alertView.setContent(title, context, leftButtonText, leftCallBack, rightButtonText, rightCallBack, touchClose, closeCallBack);
        this.alertView.x = AdaptSceenUtil.curWidth() / 2;
        this.alertView.y = AdaptSceenUtil.curHeight() / 2;
        this.alertView.popup();
    }

    public hideAlert() {
        this.alertView.popdown();
    }

    public removeTip() {
        this.tipLayer.removeChildren();
    }

    public showTip(tip) {
        if (this.tipLayer.numChildren !== 0) {
            this.tipLayer.removeChildren();
        }

        let tipView = new FlippyTip(tip);
        // tipView.anchorOffsetX = tipView.width / 2;
        // tipView.anchorOffsetY = tipView.height / 2;
        tipView.x = AdaptSceenUtil.curWidth() / 2;
        tipView.y = AdaptSceenUtil.curHeight() / 2;
        egret.setTimeout(() => {
            if (this.tipLayer.contains(tipView)) {
                this.tipLayer.removeChild(tipView);
            }

        }, this, 1500);

        this.tipLayer.addChild(tipView);
    }


    // ----------------placingView



    public get placingGameView() {
        if (this._placingGameView === undefined) {
            this._placingGameView = new PlacingGameView();
            this._placingGameView.y = this._placingGameView.y + 50;
        }
        return this._placingGameView;
    }




    //----------------- GameView
    public get storedGameView() {
        if (this._storedGameView === undefined) {
            this._storedGameView = new GameView();
            GameController.getInstance().type = GameTypeEnum.GAME_TYPE_IDLE;
            this._storedGameView.y = this._storedGameView.y + 50;
        }
        return this._storedGameView;
    }

    public set storedGameView(value) {
        this._storedGameView = value;
    }

    public stopFire(gridId) {
        (this._storedGameView.gridList[gridId] as AwayGridView).fire = false;
    }

    public fireGrid(gridId) {
        (this._storedGameView.gridList[gridId] as AwayGridView).fire = true;
    }



    private targetBullet: BulletView;

    public showTargetBullet(e: egret.TouchEvent) {
        this.gameLayer.addChild(this.targetBullet);
        this.targetBullet.type = BulletController.getInstance().getCurrentBullet();
        this.targetBullet.scaleX = this.targetBullet.scaleY = 0.5;
        this.targetBullet.x = e.stageX;
        this.targetBullet.y = e.stageY;
    }

    public moveTargetBullet(e) {
        this.targetBullet.x = e.stageX;
        this.targetBullet.y = e.stageY;
    }

    public cancelTargetBullet(e) {
        if (this.gameLayer.contains(this.targetBullet)) {
            this.gameLayer.removeChild(this.targetBullet);
        }
    }





    // 气球


    private balloon;

    public flyBalloon() {
        if (ServerController.getInstance().hasGameStart) {
            return;
        }

        let type = Math.floor(Math.random() * 3) + 1;
        this.balloon.texture = RES.getRes("balloon" + type + "_png")
        this.balloon.x = AdaptSceenUtil.curWidth();
        this.balloon.y = AdaptSceenUtil.curHeight() / 2 + 100 - Math.random() * 250;
        this.balloon.scaleX = this.balloon.scaleY = 1;
        this.balloon.visible = true;
        egret.Tween.get(this.balloon).to({ x: 150 }, 10000).to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .to({ y: this.balloon.y + Math.random() * 10 }, 1000)
            .call(() => {
                this.balloon.visible = false;
            })
    }

    public onBalloonReward() {
        SceneManager.getInstance().showAlert("日 常 报 告", "    我们率先得到了空投下来的物资，今晚吃鸡在望了！", "$v双倍领取", () => {
            platform.vedioPlay(AdvertiseController.getInstance().vedio, () => {
                this.balloon.visible = false;
                SceneManager.getInstance().hideAlert();
            }, (result) => {
                if (result.finish) {
                    RewardController.getInstance().balloonReward(true);
                    // GameController.getInstance().attackOpponent(oppo.level);
                }
            });
        }, "领  取", () => {
            this.balloon.visible = false;
            SceneManager.getInstance().hideAlert();
            RewardController.getInstance().balloonReward(false);
        });

    }

}