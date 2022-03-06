/**
 * 
 */
class PlacingScene extends egret.Sprite {
    constructor() {
        super();
        this.initView();
    }

    public mapList: Array<MiniGameView>;
    private scrollView: egret.ScrollView;
    private mapController: egret.Sprite;

    public q_icon: egret.Bitmap;
    private backButton: E8Button;

    private myPlayerDetail: PlayerDetail;
    private oppoPlayerDetail: PlayerDetail;

    public gameView: PlacingGameView;
    public matchButtons: MatchGamePlacingButtons;
    private placingButtons: PlacingButtons;

    private edit_Button: E8TextButton;
    private vsTextField: egret.Sprite;

    private initView() {

        this.vsTextField = DrawUtil.textFilter("VS");
        this.vsTextField.y = AdaptSceenUtil.y_fix() + 100;
        this.vsTextField.x = AdaptSceenUtil.curWidth() / 2;
        this.vsTextField.visible = false;
        this.addChild(this.vsTextField);

        this.scrollView = new egret.ScrollView();
        this.mapController = new egret.Sprite();

        this.mapList = new Array<MiniGameView>();


        this.scrollView.x = 0;
        this.scrollView.width = AdaptSceenUtil.curWidth();
        this.scrollView.y = AdaptSceenUtil.y_fix() + 80;
        this.scrollView.height = 300;
        this.scrollView.bounces = false;
        this.scrollView.touchEnabled = true;
        this.scrollView.setContent(this.mapController);
        this.addChild(this.scrollView);

        this.mapController.removeChildren();
        let map: MiniGameView;
        let history_map = PlacingController.getInstance().getCollections();
        for (let i = 0; i < history_map.length; i++) {
            let date = {
                heads: MapUtil.headIdToHeadData(history_map[i].id),
                date: history_map[i].date
            }
            map = new MiniGameView(date);
            map.anchorOffsetX = map.width / 2;
            map.anchorOffsetY = map.height / 2;
            map.x = 100 + map.width / 2 + i * 200;
            map.y = map.height / 2;
            map.id = i;

            // map.y = this.controlViewBg.height - map.height;
            this.mapController.addChild(map);
            this.mapList.push(map);
            map.touchEnabled = true;
            map.selected = false;
            map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mapTouched, this);
        }

        this.mapController.width += 200;


        this.q_icon = new egret.Bitmap();
        this.q_icon.texture = RES.getRes("question");
        this.q_icon.x = AdaptSceenUtil.curWidth() - this.q_icon.width - 20;
        this.q_icon.y = AdaptSceenUtil.y_fix() + 100
        this.addChild(this.q_icon);
        this.q_icon.touchEnabled = true;
        this.q_icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowGuide, this);


        // this.controlView = new PlacingControlView();
        // this.controlView.x = 0;
        // this.controlView.visible = false;
        // this.controlView.y = AdaptSceenUtil.curHeight() - this.controlView.height;
        // SceneManager.getInstance().getUILayer().addChild(this.controlView);
        this.matchButtons = new MatchGamePlacingButtons();
        this.addChild(this.matchButtons);

        this.placingButtons = new PlacingButtons();
        this.addChild(this.placingButtons);


        this.edit_Button = new E8TextButton(this, RES.getRes("btn_red_png"), this.editThisMap);
        this.edit_Button.scale(0.65, 0.4);
        this.edit_Button.setButtonText("编 辑 模 式");
        this.edit_Button.touchEnabled = true;
        this.edit_Button.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.edit_Button.y = 1000 + AdaptSceenUtil.y_fix();
        this.addChild(this.edit_Button);

        this.backButton = new E8Button(this, RES.getRes("back_png"), this.onBackButtonTouched);
        this.backButton.touchEnabled = true;
        this.backButton.x = -10 + this.backButton.width / 2;
        this.backButton.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.backButton.height / 2 + platform.offsetHead();
        this.addChild(this.backButton);


    }

    updateMapList() {
        this.mapController.removeChildren();
        let map: MiniGameView;
        let history_map = PlacingController.getInstance().getCollections();
        for (let i = 0; i < history_map.length; i++) {
            let date = {
                heads: MapUtil.headIdToHeadData(history_map[i].id),
                date: history_map[i].date
            }
            map = new MiniGameView(date);
            map.anchorOffsetX = map.width / 2;
            map.anchorOffsetY = map.height / 2;
            map.x = 100 + map.width / 2 + i * 200;
            map.y = map.height / 2;
            map.id = i;

            // map.y = this.controlViewBg.height - map.height;
            this.mapController.addChild(map);
            this.mapList.push(map);
            map.touchEnabled = true;
            map.selected = false;
            map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mapTouched, this);
        }
        this.mapController.width = this.mapController.measuredWidth + 200;
    }

    editThisMap() {
        GameController.getInstance().placingToEditor(this.gameView.getPlaneList());
    }

    deleteMap() {
        this.mapController.removeChildren();
        let map: MiniGameView;
        let history_map = PlacingController.getInstance().getCollections();
        for (let i = 0; i < history_map.length; i++) {
            let date = {
                heads: MapUtil.headIdToHeadData(history_map[i].id),
                date: history_map[i].date
            }
            map = new MiniGameView(date);
            map.anchorOffsetX = map.width / 2;
            map.anchorOffsetY = map.height / 2;
            map.x = 100 + map.width / 2 + i * 200;
            map.y = map.height / 2;
            map.id = i;

            // map.y = this.controlViewBg.height - map.height;
            this.mapController.addChild(map);
            this.mapList.push(map);
            map.touchEnabled = true;
            map.selected = false;
            map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mapTouched, this);
        }
        if (this.mapList.length <= 4) {
            this.scrollView.scrollLeft = 100;
        }
        this.mapController.width = this.mapController.measuredWidth + 200;
    }

    public unSelectMap() {
        for (let i = 0; i < this.mapList.length; i++) {
            this.mapList[i].selected = false;
        }
    }

    public setSelectMap() {
        for (let i = 0; i < this.mapList.length; i++) {
            this.mapList[i].selected = false;

            if (MapUtil.headDataToHeadId(this.gameView.getPlaneList()) == this.mapList[i].headId) {
                this.mapList[i].selected = true;
            }
        }
    }

    private mapTouched(e: egret.TouchEvent) {
        let map = e.target as MiniGameView;
        for (let i = 0; i < this.mapList.length; i++) {
            this.mapList[i].selected = false;
            map.selected = true;
        }

        // map
        PlacingController.getInstance().selectedSharedMap(map);
    }

    hideDetail() {
        if (this.contains(this.myPlayerDetail)) {
            this.removeChild(this.myPlayerDetail);
        }
        if (this.contains(this.oppoPlayerDetail)) {
            this.removeChild(this.oppoPlayerDetail);
        }
        this.vsTextField.visible = false;
        this.backButton.visible = true;
    }

    showDetail() {
        this.myPlayerDetail = SceneManager.getInstance().myPlayerDetail;
        this.myPlayerDetail.x = AdaptSceenUtil.curWidth() / 2 - this.myPlayerDetail.width - this.vsTextField.width;
        this.myPlayerDetail.y = AdaptSceenUtil.y_fix() + 40;
        this.addChild(this.myPlayerDetail);

        this.vsTextField.visible = true;

        this.oppoPlayerDetail = SceneManager.getInstance().oppoPlayerDetail;
        this.oppoPlayerDetail.x = AdaptSceenUtil.curWidth() / 2 + this.vsTextField.width;
        this.oppoPlayerDetail.y = AdaptSceenUtil.y_fix() + 40;
        this.addChild(this.oppoPlayerDetail);

        this.backButton.visible = false;
    }

    private count_number = 30;
    public counter = null;

    public onGameStart() {
        this.count_number = 30;
        this.counter = new egret.Timer(1000, 30);
        this.counter.addEventListener(egret.TimerEvent.TIMER, this.onCount, this);
        this.counter.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onCountComplete, this);
        this.counter.start();
        // egret.setTimeout(this.onCount, this, 1000);
        // egret.clearInterval(this.counter);
    }

    public onCountComplete() {
        if (this.counter !== null) {
            this.counter.removeEventListener(egret.TimerEvent.TIMER, this.onCount, this);
            this.counter.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onCountComplete, this);
        }
    }

    private onCount() {
        if (ServerController.getInstance().imReady) {
            this.onCountComplete();
            return;
        }
        this.count_number--;
        if (this.count_number < 0) {
            this.onCountComplete();
        } else {
            if (this.count_number == 0) {
                if (!ServerController.getInstance().imReady) {
                    this.matchButtons.onUseMapTouched();
                }
                SceneManager.getInstance().removeTip();
                SceneManager.getInstance().showTip("比赛开始，正在进入比赛!");
            } else if (this.count_number == 20) {
                SceneManager.getInstance().removeTip();
                SceneManager.getInstance().showTip("比赛倒计时，还有" + this.count_number + "秒钟");
            } else if (this.count_number == 10) {
                SceneManager.getInstance().removeTip();
                SceneManager.getInstance().showTip("比赛倒计时，还有" + this.count_number + "秒钟");
            } else if (this.count_number <= 3) {
                SceneManager.getInstance().removeTip();
                SceneManager.getInstance().showTip("比赛倒计时，还有" + this.count_number + "秒钟");
            }
        }
    }

    public onGameEnd() {
        this.inAnimate();
    }

    // 开始打的阶段
    public onHittingStart() {
        SceneManager.getInstance().showTip("等待对手准备");
        // GameController.getInstance().startMultiplayerGame();
        // SceneManager.getInstance().toMatchScene();
    }

    private onShowGuide(e) {
        GuideController.getInstance().startGuide(GuideEnum.GUIDE_TYPE_PLACE);
    }


    private onBackButtonTouched() {
        // 返回继续攻击

        // GameController.getInstance().attackOpponent();
        ServerController.getInstance().backToHome();
        SceneManager.getInstance().toTechScene();
    }


    public inAnimate() {
        this.mapController.visible = true;

        this.gameView = SceneManager.getInstance().placingGameView;
        this.addChild(this.gameView);
        this.setSelectMap();
        // this.cityView.
        // egret.Tween.get(this).to({ x: 0 }, 800);
        if (GuideController.getInstance().isFinished()) {
            this.q_icon.visible = true;
        } else {
            this.q_icon.visible = false;
        }

        if (ServerController.getInstance().pairGame) {
            this.matchButtons.visible = true;
            this.placingButtons.visible = false;
            this.edit_Button.visible = false;
            this.matchButtons.inAnimate();
            if (ServerController.getInstance().areYouGoOn) {
                this.backButton.visible = false;
                this.onMatchUpdate();
                // this.onGameStart();
                this.vsTextField.visible = true;
            } else {
                this.vsTextField.visible = false;
                this.offMatchUpdate();
                this.backButton.visible = true;
            }
        } else {
            this.backButton.visible = true;
            this.placingButtons.visible = true;
            this.matchButtons.visible = false;
            if (GMToolManager.isRelease) {
                this.edit_Button.visible = true;
            } else {
                this.edit_Button.visible = false;
            }
        }

        this.visible = true;
    }

    public outAnimate() {
        this.visible = false;
        this.onCountComplete();
        // egret.Tween.get(this).to({ x: -640 }, 800);
    }


    public guideBuildAirport() {
        this.backButton.touchChildren = false;
        this.placingButtons.guideBuildAirport();

    }

    public guideBack() {
        this.backButton.touchChildren = true;
        this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGuideBack, this);
    }

    private onGuideBack() {
        this.backButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGuideBack, this);
        SceneManager.getInstance().getGuideView().onNextStep();
        SceneManager.getInstance().showGuide();
    }

    public onMatchUpdate() {
        this.matchButtons.onMatchUpdate();
        this.mapController.visible = false;
        this.q_icon.visible = false;
        SceneManager.getInstance().headUIEffect(false);
        this.showDetail()
    }

    public offMatchUpdate() {
        this.matchButtons.offMatchUpdate();
        this.mapController.visible = true;
        this.q_icon.visible = true;
        SceneManager.getInstance().headUIEffect(true);
        this.hideDetail()
    }
}