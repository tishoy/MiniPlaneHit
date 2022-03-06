/**
 * 测试页面
 */
class TechScene extends egret.Sprite implements Scene {

    private gameView: GameView;
    private guide_view: GuideView;

    private start_button: E8TextButton;

    private cityButton: E8TextButton;
    private bankButton: E8TextButton;
    private gasButton: E8TextButton;
    private techButton: E8TextButton;
    private insureButton: E8TextButton;
    private repairButton: E8TextButton;
    private bulletButton: E8TextButton;
    private advertiseButton: E8TextButton;
    private matchButton: E8TextButton;
    private joinRaceButton: E8TextButton;

    public msgView: MineView;
    private q_icon: E8Button;

    private bankPanel: BankPanel;
    private gsPop: GasStationPop;
    private techPop: TechPop;
    private adCompanyPop: AdCompanyPop;

    constructor() {
        super();
        this.initView();
    }

    private initView() {

        let uiLayer = SceneManager.getInstance().getUILayer();

        this.guide_view = new GuideView();

        this.q_icon = new E8Button(this, RES.getRes("question"));
        this.q_icon.x = AdaptSceenUtil.curWidth() - this.q_icon.width - 20;
        this.q_icon.y = 64 + AdaptSceenUtil.y_fix() / 2;
        this.addChild(this.q_icon);
        this.q_icon.visible = false;
        this.q_icon.touchEnabled = true;
        this.q_icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowGuide, this);

        this.start_button = new E8TextButton(this, RES.getRes("btn_blue_png"), this.startButtonTouched);
        this.start_button.scale(0.65, 0.4);
        this.start_button.setButtonText(i18n.getLanguage(i18n.START_BUTTON));
        this.start_button.touchEnabled = true;
        this.start_button.x = AdaptSceenUtil.curWidth() / 2;
        this.start_button.y = AdaptSceenUtil.y_fix() + 850;
        this.start_button.visible = false;
        uiLayer.addChild(this.start_button);


        this.techButton = new E8TextButton(this, RES.getRes("view_defense_png"), this.onDefenseTouched);
        this.techButton.y = AdaptSceenUtil.y_fix() + 465;
        this.techButton.scale(0.2, 0.2);
        this.techButton.x = -10 - this.techButton.width / 2;
        this.techButton.setButtonText(i18n.getLanguage(i18n.PUZZLE_BUTTON), 0, 80);
        this.techButton.visible = false;
        uiLayer.addChild(this.techButton);


        this.cityButton = new E8TextButton(this, RES.getRes("view_airport_png"), this.onAirportTouched);
        this.cityButton.y = AdaptSceenUtil.y_fix() + 310;
        this.cityButton.scale(0.2, 0.2);
        this.cityButton.x = -10 - this.cityButton.width / 2;
        this.cityButton.setButtonText(i18n.getLanguage(i18n.AIRPORT_BUTTON), 0, 80);
        this.cityButton.visible = false;
        uiLayer.addChild(this.cityButton);

        this.bankButton = new E8TextButton(this, RES.getRes("view_bank_png"), this.onBankTouched);
        this.bankButton.y = AdaptSceenUtil.y_fix() + 620;
        this.bankButton.scale(0.2, 0.2);
        this.bankButton.x = -10 - this.bankButton.width / 2;
        this.bankButton.setButtonText(i18n.getLanguage(i18n.BANK_BUTTON), 0, 80);
        this.bankButton.visible = false;
        uiLayer.addChild(this.bankButton);

        this.gasButton = new E8TextButton(this, RES.getRes("view_gas_station_png"), this.onGasStationTouched);
        this.gasButton.y = AdaptSceenUtil.y_fix() + 775;
        this.gasButton.scale(0.2, 0.2);
        this.gasButton.x = -10 - this.gasButton.width / 2;
        this.gasButton.setButtonText(i18n.getLanguage(i18n.GAS_BUTTON) + "\n原油单价" + EconomicsController.getInstance().gasPrice, 0, 80);
        this.gasButton.visible = false;
        uiLayer.addChild(this.gasButton);


        this.repairButton = new E8TextButton(this, RES.getRes("view_repair_factory_png"), this.onRepairTouched);
        this.repairButton.y = AdaptSceenUtil.y_fix() + 310;
        this.repairButton.scale(0.2, 0.2);
        this.repairButton.x = AdaptSceenUtil.curWidth() + 10 + this.repairButton.width / 2;
        this.repairButton.setButtonText(i18n.getLanguage(i18n.REPAIR_BUTTON), 0, 80);
        this.repairButton.visible = false;
        uiLayer.addChild(this.repairButton);

        this.insureButton = new E8TextButton(this, RES.getRes("view_insure_company_png"), this.onInsureTouched);
        this.insureButton.y = AdaptSceenUtil.y_fix() + 465;
        this.insureButton.scale(0.2, 0.2);
        this.insureButton.x = AdaptSceenUtil.curWidth() + 10 + this.insureButton.width / 2;
        this.insureButton.setButtonText(i18n.getLanguage(i18n.INSURE_BUTTON), 0, 80);
        this.insureButton.visible = false;
        uiLayer.addChild(this.insureButton);

        this.bulletButton = new E8TextButton(this, RES.getRes("view_bullet_science_png"), this.onBulletTouched);
        this.bulletButton.y = AdaptSceenUtil.y_fix() + 620;
        this.bulletButton.scale(0.2, 0.2);
        this.bulletButton.x = AdaptSceenUtil.curWidth() + 10 + this.bulletButton.width / 2;
        this.bulletButton.setButtonText(i18n.getLanguage(i18n.BULLET_BUTTON), 0, 80);
        this.bulletButton.visible = false;
        uiLayer.addChild(this.bulletButton);

        this.advertiseButton = new E8TextButton(this, RES.getRes("view_advertise_company_png"), this.onAdvertiseTouched);
        this.advertiseButton.y = AdaptSceenUtil.y_fix() + 775;
        this.advertiseButton.scale(0.2, 0.2);
        this.advertiseButton.x = AdaptSceenUtil.curWidth() + 10 + this.advertiseButton.width / 2;
        this.advertiseButton.setButtonText(i18n.getLanguage(i18n.ADVERTISE_BUTTON), 0, 80);
        this.advertiseButton.visible = false;
        uiLayer.addChild(this.advertiseButton);

        this.joinRaceButton = new E8TextButton(this, RES.getRes("btn_yellow_png"), this.raceButtonTouched);
        this.joinRaceButton.scale(0.65, 0.4);
        this.joinRaceButton.setButtonText("报 名 参 赛");
        // this.start_button.setButtonText(i18n.getLanguage(""));
        this.joinRaceButton.touchEnabled = true;
        this.joinRaceButton.x = AdaptSceenUtil.curWidth() / 2;
        this.joinRaceButton.y = AdaptSceenUtil.y_fix() + 750;
        this.joinRaceButton.visible = false;
        uiLayer.addChild(this.joinRaceButton);

        this.matchButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.matchButtonTouched);
        this.matchButton.scale(0.65, 0.4);
        this.matchButton.setButtonText("匹 配 对 战");
        // this.start_button.setButtonText(i18n.getLanguage(""));
        this.matchButton.touchEnabled = true;
        this.matchButton.x = AdaptSceenUtil.curWidth() / 2;
        this.matchButton.y = AdaptSceenUtil.y_fix() + 650;
        this.matchButton.visible = false;
        uiLayer.addChild(this.matchButton);


        this.msgView = new MineView();
        this.msgView.anchorOffsetX = this.msgView.width / 2;
        this.msgView.anchorOffsetY = this.msgView.height / 2;
        this.msgView.x = AdaptSceenUtil.curWidth() / 2;
        this.msgView.y = AdaptSceenUtil.y_fix() + this.msgView.height / 2 + 80;
        // this.msgView.scaleX = 0.8;
        // this.msgView.scaleY = 0.8;
        this.msgView.alpha = 0;
        this.addChild(this.msgView);

        this.bankPanel = new BankPanel();
        this.bankPanel.x = AdaptSceenUtil.curWidth() / 2;
        this.bankPanel.y = AdaptSceenUtil.curHeight() / 2;
        SceneManager.getInstance().getPopLayer().addChild(this.bankPanel);

        this.gsPop = new GasStationPop();
        this.addChild(this.gsPop);

        this.adCompanyPop = new AdCompanyPop();
        this.addChild(this.adCompanyPop);

        this.techPop = new TechPop();
        this.techPop.x = AdaptSceenUtil.curWidth() / 2;
        this.techPop.y = AdaptSceenUtil.curHeight() / 2;
        SceneManager.getInstance().getPopLayer().addChild(this.techPop);

    }

    private onShowGuide() {
        // this.guide_view.setType(GuideEnum.GUIDE_TYPE_AWAY);
        // SceneManager.getInstance().getPopLayer().addChild(this.guide_view);
        // this.guide_view.setStep(1);
    }

    private matchButtonTouched() {
        if (ServerController.getInstance().platformSupport) {
            ServerController.getInstance().serverLogin();
        } else {
            ServerController.getInstance().pairGame = true;
            GameController.getInstance().startPlacingGame();
            SceneManager.getInstance().toPlacingScene();
        }
    }

    private raceButtonTouched() {
        SceneManager.getInstance().showTip("玩家数量还不足以支撑全国大赛，还需要您多多分享")
    }

    private startButtonTouched() {
        if (EconomicsController.getInstance().costGas(1)) {
            if (GameController.getInstance().isOverPhase) {
                GameController.getInstance().attackOpponent();
            } else {
                GameController.getInstance().continueGame();
            }
        }
    }

    private onAirportTouched() {
        // AIController.getInstance().hitList();
        // return
        if (EconomicsController.getInstance().costGas(1)) {
            GameController.getInstance().attackOpponent();
        }
    }

    private hideButtomAreaView() {
        this.bankPanel.outAnimate();
        this.gsPop.outAnimate();
        this.adCompanyPop.outAnimate();
        this.techPop.outAnimate();
    }

    private onBankTouched() {
        this.hideButtomAreaView();
        this.bankPanel.inAnimate();
        // this.addChild(this.bankPanel);
        // EconomicsController.getInstance().addGold(2000);
    }

    private onDefenseTouched() {
        // SceneManager.getInstance().toMatchScene();
        // ServerController.getInstance().onStartGame();
        GameController.getInstance().attackRandomPuzzle();
    }

    private onGasStationTouched() {
        this.hideButtomAreaView();
        this.gsPop.inAnimate();
        // EconomicsController.getInstance().addGas(10);
    }

    private onInsureTouched() {
        GameController.getInstance().historyReview();
    }

    private onRepairTouched() {
        GameController.getInstance().startPlacingGame();
        SceneManager.getInstance().toPlacingScene();
    }

    private onBulletTouched() {
        this.hideButtomAreaView();
        this.techPop.inAnimate();
        // SceneManager.getInstance().showTip("该功能还未开放")
    }

    private onAdvertiseTouched() {
        this.hideButtomAreaView();
        this.adCompanyPop.inAnimate();
    }

    public inAnimate() {
        SceneManager.getInstance().headUIEffect(true);
        if (GameController.getInstance().isOverPhase) {
            this.start_button.setButtonText(i18n.getLanguage(i18n.START_BUTTON));
        } else {
            this.start_button.setButtonText(i18n.getLanguage(i18n.START_BUTTON2));
        }

        this.msgView.showPlayerDetail()

        this.gameView = SceneManager.getInstance().storedGameView;
        // this.gameView.scaleX = this.gameView.scaleY = 0.95;
        // this.gameView.alpha = 0.8;
        this.addChild(this.gameView);
        egret.Tween.get(this.gameView).to({
            scaleX: 0.95, scaleY: 0.95, alpha: 0.3
        }, 500);

        this.cityButton.visible = true;
        this.techButton.visible = true;
        this.bankButton.visible = true;
        this.gasButton.visible = true;
        this.insureButton.visible = true;
        this.repairButton.visible = true;
        this.advertiseButton.visible = true;
        this.bulletButton.visible = true;
        this.start_button.visible = true;
        this.matchButton.visible = true;
        this.joinRaceButton.visible = true;

        egret.Tween.get(this.msgView).to({ alpha: 1 }, 400);

        egret.Tween.get(this.cityButton).to({ x: -10 + this.cityButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.gasButton).to({ x: -10 + this.gasButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.bankButton).to({ x: -10 + this.bankButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.techButton).to({ x: -10 + this.techButton.width / 2 }, 500, egret.Ease.backInOut);

        egret.Tween.get(this.insureButton).to({ x: AdaptSceenUtil.curWidth() + 10 - this.bulletButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.repairButton).to({ x: AdaptSceenUtil.curWidth() + 10 - this.bulletButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.advertiseButton).to({ x: AdaptSceenUtil.curWidth() + 10 - this.bulletButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.bulletButton).to({ x: AdaptSceenUtil.curWidth() + 10 - this.bulletButton.width / 2 }, 500, egret.Ease.backInOut);

        this.visible = true;
    }

    public outAnimate() {
        egret.Tween.get(this.cityButton).to({ x: -10 - this.cityButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.gasButton).to({ x: -10 - this.gasButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.bankButton).to({ x: -10 - this.bankButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.techButton).to({ x: -10 - this.techButton.width / 2 }, 500, egret.Ease.backInOut);

        egret.Tween.get(this.insureButton).to({ x: AdaptSceenUtil.curWidth() + 10 + this.bulletButton.width / 2 }, 500, egret.Ease.backInOut).call(() => {
            this.insureButton.visible = false;
        });
        egret.Tween.get(this.repairButton).to({ x: AdaptSceenUtil.curWidth() + 10 + this.bulletButton.width / 2 }, 500, egret.Ease.backInOut).call(() => {
            this.repairButton.visible = false;
        });
        egret.Tween.get(this.advertiseButton).to({ x: AdaptSceenUtil.curWidth() + 10 + this.bulletButton.width / 2 }, 500, egret.Ease.backInOut);
        egret.Tween.get(this.bulletButton).to({ x: AdaptSceenUtil.curWidth() + 10 + this.bulletButton.width / 2 }, 500, egret.Ease.backInOut);

        this.matchButton.visible = false;
        this.start_button.visible = false;
        this.joinRaceButton.visible = false;

        this.visible = false;
    }

    public guideToPlace() {
        DrawUtil.setImageColor(this.cityButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.techButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.bankButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.gasButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.insureButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.advertiseButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.bulletButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.start_button, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.matchButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.joinRaceButton, ColorEnum.GRAY);
        this.cityButton.touchChildren = false;
        this.techButton.touchChildren = false;
        this.bankButton.touchChildren = false;
        this.gasButton.touchChildren = false;
        this.insureButton.touchChildren = false;
        this.advertiseButton.touchChildren = false;
        this.bulletButton.touchChildren = false;
        this.start_button.touchChildren = false;
        this.matchButton.touchChildren = false;
        this.joinRaceButton.touchChildren = false;
        this.guideBullet = new BulletView(false, false, false);
        this.guideBullet.type = BulletTypeEnum.GUIDED_MISSILE;
        // this.guideBullet.scaleX = this.guideBullet.scaleY = 2;
        this.guideBullet.x = this.repairButton.x - this.guideBullet.width;
        this.guideBullet.y = this.repairButton.y;
        this.guideBullet.rotation = -60;
        SceneManager.getInstance().getUILayer().addChild(this.guideBullet);
        egret.Tween.get(this.guideBullet, { loop: true }).to({
            x: this.repairButton.x - this.guideBullet.width - 40,
            y: this.repairButton.y - 20
        }, 1000).to({
            x: this.repairButton.x - this.guideBullet.width,
            y: this.repairButton.y
        }, 1000)

        this.repairButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guidePlaceStart, this);
    }

    public guideToAway() {
        DrawUtil.setImageColor(this.cityButton, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.repairButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.techButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.bankButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.gasButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.insureButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.advertiseButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.bulletButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.start_button, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.matchButton, ColorEnum.GRAY);
        DrawUtil.setImageColor(this.joinRaceButton, ColorEnum.GRAY);
        this.repairButton.touchChildren = false;
        this.cityButton.touchChildren = true;
        this.techButton.touchChildren = false;
        this.bankButton.touchChildren = false;
        this.gasButton.touchChildren = false;
        this.insureButton.touchChildren = false;
        this.advertiseButton.touchChildren = false;
        this.bulletButton.touchChildren = false;
        this.start_button.touchChildren = false;
        this.matchButton.touchChildren = false;
        this.joinRaceButton.touchChildren = false;
        if (this.guideBullet !== null) {
            this.guideBullet = new BulletView(false, false, false);
            this.guideBullet.type = BulletTypeEnum.GUIDED_MISSILE;
        }
        // this.guideBullet.scaleX = this.guideBullet.scaleY = 2;
        this.guideBullet.x = this.cityButton.x + this.guideBullet.width;
        this.guideBullet.y = this.cityButton.y;
        this.guideBullet.rotation = 60;
        SceneManager.getInstance().getUILayer().addChild(this.guideBullet);
        egret.Tween.get(this.guideBullet, { loop: true }).to({
            x: this.cityButton.x + this.guideBullet.width + 40,
            y: this.cityButton.y - 20
        }, 1000).to({
            x: this.cityButton.x + this.guideBullet.width,
            y: this.repairButton.y
        }, 1000)

        this.cityButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guideAwayStart, this);
    }

    private guideBullet: BulletView = null;

    private guidePlaceStart() {
        this.repairButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.guidePlaceStart, this);
        if (GuideController.getInstance().isFinished()) {
            return;
        }
        egret.Tween.removeTweens(this.guideBullet);
        if (SceneManager.getInstance().getUILayer().contains(this.guideBullet)) {
            SceneManager.getInstance().getUILayer().removeChild(this.guideBullet);
        }
        SceneManager.getInstance().getGuideView().onNextStep();
        SceneManager.getInstance().showGuide();
    }

    private guideAwayStart() {
        this.cityButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.guideAwayStart, this);
        egret.Tween.removeTweens(this.guideBullet);
        SceneManager.getInstance().getUILayer().removeChild(this.guideBullet);
        egret.Tween.get(this).wait(1000).call(() => {
            GuideController.getInstance().startGuide(GuideEnum.GUIDE_TYPE_AWAY);
        });
    }

    public endGuide() {
        DrawUtil.setImageColor(this.repairButton, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.techButton, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.bankButton, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.gasButton, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.insureButton, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.advertiseButton, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.bulletButton, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.start_button, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.matchButton, ColorEnum.WHITE);
        DrawUtil.setImageColor(this.joinRaceButton, ColorEnum.WHITE);
        this.repairButton.touchChildren = true;
        this.techButton.touchChildren = true;
        this.bankButton.touchChildren = true;
        this.gasButton.touchChildren = true;
        this.insureButton.touchChildren = true;
        this.repairButton.touchChildren = true;
        this.advertiseButton.touchChildren = true;
        this.bulletButton.touchChildren = true;
        this.start_button.touchChildren = true;
        this.matchButton.touchChildren = true;
        this.joinRaceButton.touchChildren = true;
    }

}