class MatchGamePlacingButtons extends egret.Sprite {
    /**
       * 匹配功能
       */
    private inviteFriendButton: E8TextButton;
    private startMatchButton: E8TextButton;
    private stopMatchButton: E8TextButton;
    private useMapReadyButton: E8TextButton;
    private randomButton: E8TextButton;
    private giveUpButton: E8TextButton;

    private matchTime;
    private robotTimer;

    constructor() {
        super();
        this.initView();
    }

    private onInviteTouched() {

    }

    private initView() {
        this.inviteFriendButton = new E8TextButton(this, RES.getRes("btn_purple_png"), this.onInviteTouched);
        this.inviteFriendButton.touchEnabled = true;
        this.inviteFriendButton.scale(0.65, 0.4);
        this.inviteFriendButton.x = AdaptSceenUtil.curWidth() * 1 / 5;
        this.inviteFriendButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.inviteFriendButton.setButtonText("邀 请 好 友");
        this.inviteFriendButton.visible = false;
        this.addChild(this.inviteFriendButton);

        this.startMatchButton = new E8TextButton(this, RES.getRes("btn_purple_png"), this.onStartMatchTouched);
        this.startMatchButton.touchEnabled = true;
        this.startMatchButton.scale(0.65, 0.4);
        this.startMatchButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.startMatchButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.startMatchButton.setButtonText("开 始 匹 配");
        this.addChild(this.startMatchButton);

        this.stopMatchButton = new E8TextButton(this, RES.getRes("btn_purple_png"), this.onStopMatchTouched);
        this.stopMatchButton.touchEnabled = true;
        this.stopMatchButton.scale(0.65, 0.4);
        this.stopMatchButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.stopMatchButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.stopMatchButton.setButtonText("停 止 匹 配");
        this.addChild(this.stopMatchButton);

        this.useMapReadyButton = new E8TextButton(this, RES.getRes("btn_purple_png"), this.onUseMapTouched);
        this.useMapReadyButton.touchEnabled = true;
        this.useMapReadyButton.scale(0.65, 0.4);
        this.useMapReadyButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.useMapReadyButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.useMapReadyButton.setButtonText("选用并准备");
        this.addChild(this.useMapReadyButton);

        this.randomButton = new E8TextButton(this, RES.getRes("btn_purple_png"), this.onRandomButtonTouched);
        this.randomButton.touchEnabled = true;
        this.randomButton.scale(0.65, 0.4);
        this.randomButton.x = AdaptSceenUtil.curWidth() * 4 / 5;
        this.randomButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.randomButton.setButtonText("随 机 图 纸");
        this.addChild(this.randomButton);


        this.giveUpButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.giveUpTouched);
        this.giveUpButton.scale(0.65, 0.4);
        this.giveUpButton.setButtonText("放 弃 返 航");
        // this.giveUpButton.setButtonText("微 信 登 录");
        this.giveUpButton.touchEnabled = true;
        this.giveUpButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.giveUpButton.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.giveUpButton);
    }

    private giveUpTouched() {
        SceneManager.getInstance().showAlert("报  告", "    是否放弃与次对手交战,返航回到我们的基地？", "返  航", () => {
            this.giveUpButton.touchEnabled = false;
            ServerController.getInstance().endGame();
            SceneManager.getInstance().hideAlert();
            SceneManager.getInstance().toTechScene();
        }, "取消");
    }

    public updateMatchButton() {
        if (ServerController.getInstance().matching) {
            this.stopMatchButton.visible = true;
            this.startMatchButton.visible = false;
        } else {
            this.startMatchButton.visible = true;
            this.stopMatchButton.visible = false;
        }
    }

    private robotMatch() {
        if (ServerController.getInstance().matching) {
            this.onStopMatchTouched();
            SceneManager.getInstance().showTip("匹配成功，请在30秒内完成飞机布置");
            this.onMatchUpdate();
            SceneManager.getInstance().placingScene.onGameStart();
            this.startMatchButton.visible = false;
            ServerController.getInstance().startRobotMatch();
            AIController.getInstance().startRobotMatch();
        } else {
            this.stopRotobMatch();
        }
    }

    public stopRotobMatch() {
        egret.clearTimeout(this.robotTimer);
    }

    private onStopMatchTouched() {
        egret.clearTimeout(this.robotTimer);
        if (ServerController.getInstance().matching) {
            ServerController.getInstance().cancelMatch();
        }
    }

    private onStartMatchTouched() {
        if (ServerController.getInstance().platformSupport) {
            if (!ServerController.getInstance().matching) {
                this.robotTimer = egret.setTimeout(this.robotMatch, this, 15000);
                ServerController.getInstance().startMatch();
            }
        } else {
            let sec = Math.random() * 5;
            this.robotTimer = egret.setTimeout(this.robotMatch, this, sec * 1000);
            ServerController.getInstance().startMatch();
        }
        // 
        // return;

    }

    public cancelReady() {
        // this.useMapReadyButton.visible = false;
        // this.cancelReadyButton.visible = true;
    }

    public onUseMapTouched() {
        GameController.getInstance().type = GameTypeEnum.GAME_TYPE_PLACING_WAITING;
        if (ServerController.getInstance().imReady) {
            SceneManager.getInstance().showTip("我方已经准备，请耐心等待对手完成布置");
            return;
        } else {
            SceneManager.getInstance().showTip("我方已经准备，请耐心等待对手完成布置");
            this.useMapReadyButton.visible = false;
            this.randomButton.visible = false;
            // this.cancelReadyButton.visible = true;
            PlayerController.getInstance().setMyMap(SceneManager.getInstance().placingGameView.getPlaneList());
            let mapId = MapUtil.headDataToHeadId(SceneManager.getInstance().placingGameView.getPlaneList());
            ServerController.getInstance().uploadMapData(mapId);
        }
    }

    public inAnimate() {
        this.startMatchButton.visible = true;
        this.stopMatchButton.visible = false;
        this.useMapReadyButton.visible = false;
        this.inviteFriendButton.visible = false;
        this.randomButton.visible = true;
    }

    public offMatchUpdate() {
        this.startMatchButton.visible = true;
        this.stopMatchButton.visible = false;
        this.useMapReadyButton.visible = false;
        this.inviteFriendButton.visible = false;
        this.randomButton.visible = true;
    }

    public onMatchUpdate() {
        this.startMatchButton.visible = false;
        this.stopMatchButton.visible = false;
        this.useMapReadyButton.visible = true;
        this.inviteFriendButton.visible = false;
        this.randomButton.visible = true;
    }

    async onRandomButtonTouched(e) {
        SceneManager.getInstance().placingScene.unSelectMap();
        SceneManager.getInstance().placingGameView.resetView();
        PlacingController.getInstance().randomMap();
    }

}