/**
 * 成绩界面
 */
class ResultScene extends egret.Sprite implements Scene {

    private title: egret.Bitmap;
    private score: egret.Bitmap;
    private return_button: E8Button;
    private review_button: E8TextButton;

    private attackBackButton: E8TextButton;
    private shareButton: E8TextButton;
    private otherButton: E8TextButton;
    private placingButton: E8TextButton;
    private rewardDoubleButton: E8TextButton;
    private shareVedioButton: E8TextButton;

    private resultView: ResultView;

    private gameView: GameView;

    private isOpponent: boolean = true;
    private text: egret.TextField;

    private isMultiplayer = false;
    private result;

    constructor() {
        super();
        this.title = new egret.Bitmap();
        this.title.scaleX = this.title.scaleY = 0.8;
        this.title.y = AdaptSceenUtil.y_fix() + 100;
        this.addChild(this.title);

        this.text = new egret.TextField();
        this.text.y = 150;
        this.addChild(this.text);

        // this.score = new egret.Bitmap();
        // this.score.y = this.title.y + this.title.height + 50;
        // this.addChild(this.score);

        this.resultView = new ResultView();
        this.resultView.anchorOffsetX = this.resultView.width / 2;
        this.resultView.anchorOffsetY = this.resultView.height / 2;
        this.resultView.x = AdaptSceenUtil.curWidth() / 2;
        this.resultView.y = AdaptSceenUtil.y_fix() + 250;
        this.resultView.scaleX = 0.8;
        this.resultView.scaleY = 0.8;
        this.resultView.alpha = 0;
        this.addChild(this.resultView);

        this.return_button = new E8Button(this, RES.getRes("back_png"), this.onReturnButtonTouched);
        this.return_button.touchEnabled = true;
        this.return_button.x = -10 + this.return_button.width / 2;
        this.return_button.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.return_button.height / 2 + platform.offsetHead();
        this.addChild(this.return_button);


        // this.reward_control = new RewardControlView();
        // this.reward_control.width = AdaptSceenUtil.curWidth();
        // this.reward_control.x = 0;
        // this.reward_control.y = AdaptSceenUtil.curHeight() - this.reward_control.height;
        // this.reward_control.visible = false;
        // this.addChild(this.reward_control);



        // this.review_panel = new E8Panel(this, RES.getRes("panel_png"), null);
        // this.review_panel.width = AdaptSceenUtil.curWidth() * 0.5;
        // this.review_panel.height = AdaptSceenUtil.curHeight() * 0.5;
        // this.review_panel.x = AdaptSceenUtil.curWidth() / 2;
        // this.review_panel.y = AdaptSceenUtil.curHeight() / 2;
        // this.review_panel.visible = false;
        // this.addChild(this.review_panel);

        // this.gameView = new GameView(false);
        // this.gameView.visible = false;
        // this.gameView.resetView();
        // this.addChild(this.gameView);


        this.review_button = new E8TextButton(this, RES.getRes("btn_green_png"), this.reviewButtonTouched);
        this.review_button.scale(0.65, 0.4);
        this.review_button.setButtonText("复 盘 分 析");
        this.review_button.touchEnabled = true;
        this.review_button.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.review_button.y = AdaptSceenUtil.y_fix() + 1080;
        this.addChild(this.review_button);

        this.rewardDoubleButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.rewardDoubleButtonTouched);
        this.rewardDoubleButton.scale(0.65, 0.4);
        this.rewardDoubleButton.setButtonText("双倍领取", 20, 0, "video_png");
        this.rewardDoubleButton.touchEnabled = true;
        this.rewardDoubleButton.x = AdaptSceenUtil.curWidth() * 1 / 5;
        this.rewardDoubleButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.addChild(this.rewardDoubleButton);
        // this.review_close_button.visible = false;
        // this.addChild(this.review_close_button);


        this.shareButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.shareButtonTouched);
        this.shareButton.scale(0.65, 0.4);
        this.shareButton.setButtonText("分   享");
        this.shareButton.touchEnabled = true;
        this.shareButton.x = AdaptSceenUtil.curWidth() / 5;
        this.shareButton.y = AdaptSceenUtil.y_fix() + 1080;
        this.addChild(this.shareButton);

        this.shareVedioButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.shareVedioButtonTouched);
        this.shareVedioButton.scale(0.65, 0.4);
        this.shareVedioButton.setButtonText("分 享 视 频");
        this.shareVedioButton.touchEnabled = true;
        this.shareVedioButton.x = AdaptSceenUtil.curWidth() / 2;
        this.shareVedioButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.addChild(this.shareVedioButton);


        this.attackBackButton = new E8TextButton(this, RES.getRes("btn_yellow_png"), this.onAttackBackTouched);
        this.attackBackButton.scale(0.65, 0.4);
        this.attackBackButton.setButtonText("反 击 敌 人");
        this.attackBackButton.touchEnabled = true;
        this.attackBackButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.attackBackButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.attackBackButton.visible = false;
        // this.backButton.x = -10 + this.backButton.width / 2;
        // this.backButton.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.backButton.height / 2;
        this.addChild(this.attackBackButton);

        this.otherButton = new E8TextButton(this, RES.getRes("btn_yellow_png"), this.onOtherButtonTouched);
        this.otherButton.scale(0.65, 0.4);
        this.otherButton.setButtonText("再 来 一 局");
        this.otherButton.touchEnabled = true;
        this.otherButton.x = AdaptSceenUtil.curWidth() * 4 / 5;
        this.otherButton.y = AdaptSceenUtil.y_fix() + 1000;
        // this.backButton.x = -10 + this.backButton.width / 2;
        // this.backButton.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.backButton.height / 2;
        this.addChild(this.otherButton);

        this.placingButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.onToPlacingScene);
        this.placingButton.scale(0.65, 0.4);
        this.placingButton.setButtonText("收 藏 设 计");
        this.placingButton.touchEnabled = true;
        this.placingButton.x = AdaptSceenUtil.curWidth() * 4 / 5;
        this.placingButton.y = AdaptSceenUtil.y_fix() + 1080;
        // this.backButton.x = -10 + this.backButton.width / 2;
        // this.backButton.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.backButton.height / 2;
        this.addChild(this.placingButton);

    }

    private reviewButtonTouched() {
        // this.reporting = true;
        // // this.gameView.visible = true;
        // this.review_button.visible = false;
        // this.review_close_button.visible = true
        // this.next_button.visible = true;
        // // this.review_panel.visible = false;
        // HistoryController.getInstance().getHistory();
        GameController.getInstance().historyReview();
        RewardController.getInstance().gameReward();
    }

    private rewardDoubleButtonTouched() {
        AdvertiseController.getInstance().showVedio(() => {

        }, (result) => {
            if (result.finish) {
                this.rewardDoubleButton.visible = false;
                RewardController.getInstance().gameReward(true);
            }
        }, "双倍获取")
    }

    private onAttackBackTouched() {
        RewardController.getInstance().gameReward();
        GameController.getInstance().attackOpponent();
    }

    private shareButtonTouched() {
        // platform.share();
        let id = MapUtil.headDataToHeadId(RecordController.getInstance().heads);
        platform.share("欢迎来打飞机", "", "", this.onShared, "mapId=" + id, "");
    }

    private shareVedioButtonTouched() {
        if (platform.name == "wxgame") {
            SceneManager.getInstance().showAlert("日 常 报 告", "    分享视频将向其他势力炫耀我方军事能力！", "", null, "", null, true, () => {
                platform.hideShareButton();
                SceneManager.getInstance().hideAlert();
            });
            platform.showShareButton();
        } else {
            platform.shareVedio(() => { });
        }
    }

    private onShared() {
        SceneManager.getInstance().showTip("分享成功，增进了国际交流，获利30000金币！")
        EconomicsController.getInstance().addGold(300);
    }

    private onOtherButtonTouched() {
        if (this.isMultiplayer) {
            RewardController.getInstance().gameReward();
            ServerController.getInstance().setImGoOn();
            GameController.getInstance().startPlacingGame();
            SceneManager.getInstance().toPlacingScene();
        } else {
            RewardController.getInstance().gameReward();
            if (this.isOpponent) {
                if (EconomicsController.getInstance().costGas(1)) {
                    GameController.getInstance().attackOpponent();
                } else {
                    SceneManager.getInstance().showTip("资源不足，已经返航！")
                    SceneManager.getInstance().toTechScene();
                }
            } else {
                GameController.getInstance().attackRandomPuzzle();
            }
        }

        // SceneManager.getInstance().toAwayScene();
    }

    private onReturnButtonTouched() {
        RewardController.getInstance().gameReward();
        SceneManager.getInstance().toTechScene();
        if (this.isMultiplayer) {
            ServerController.getInstance().endGame();
        }
    }

    private onToPlacingScene() {
        if (this.isMultiplayer) {
            ServerController.getInstance().endGame();
        }
        RewardController.getInstance().gameReward();
        GameController.getInstance().startPlacingGame(false);
        SceneManager.getInstance().toPlacingScene();
    }

    public showResult(result = ResultTypeEnum.WIN, bullet = 20, data = null) {
        this.result = result;
        this.isOpponent = data.isOpponent;
        if (result === ResultTypeEnum.WIN) {
            this.title.texture = RES.getRes("win_png");
            this.resultView.updateView(result, bullet, data);

        } else if (result === ResultTypeEnum.FAIL) {
            this.title.texture = RES.getRes("fail_png");
            this.resultView.updateView(result, bullet, data);
            if (data.isOpponent) {
            } else {
            }
        } else if (result === ResultTypeEnum.GIVE_UP) {
            this.title.texture = RES.getRes("give_up_png");
            this.resultView.updateView(result, bullet, data);
        } else if (result === ResultTypeEnum.WIN_BUT_SLOW) {
            this.title.texture = RES.getRes("fail_png");
            this.resultView.updateView(result, bullet, data);
        }
        if (data.isOpponent) {
            this.review_button.visible = true;
            this.placingButton.visible = true;
        } else {
            this.review_button.visible = false;
            this.placingButton.visible = false;
        }
        this.title.x = AdaptSceenUtil.curWidth() / 2 - this.title.width / 2;

        // 如果不存在opponet 说明是puzzle



        // switch (score) {
        //     case ScoreTypeEnum.SSS:
        //         this.score.texture = RES.getRes("sss_png");
        //         break;
        //     case ScoreTypeEnum.S:
        //         this.score.texture = RES.getRes("s_png");
        //         break;
        //     case ScoreTypeEnum.A:
        //         this.score.texture = RES.getRes("a_png");
        //         break;
        //     case ScoreTypeEnum.B:
        //         this.score.texture = RES.getRes("b_png");
        //         break;
        //     case ScoreTypeEnum.C:
        //         this.score.texture = RES.getRes("c_png");
        //         break;
        // }
        // this.score.x = AdaptSceenUtil.curWidth() / 2 - this.score.width / 2;
    }

    public inAnimate() {
        if (SaveDataManager.getInstance().getUserData().interstitial) {
            AdvertiseController.getInstance().showInterstitial();
        }
        if (GameController.getInstance().record) {
            this.shareVedioButton.visible = true;
        } else {
            this.shareVedioButton.visible = false;
        }
        SceneManager.getInstance().matchScene.opponetGameView.visible = false;
        this.gameView = SceneManager.getInstance().storedGameView;
        this.addChild(this.gameView);
        egret.Tween.get(this.gameView).to({
            scaleX: 0.95, scaleY: 0.95, alpha: 0.8
        }, 500).call(() => {
            if (this.result === ResultTypeEnum.WIN) {
                SoundManager.getInstance().playSound(SoundEnum.WIN_MP3);
            } else if (this.isOpponent == false) {
                SoundManager.getInstance().playSound(SoundEnum.OVER_MP3);
            } else {
                SoundManager.getInstance().playSound(SoundEnum.FAIL_MP3);
            }
        });
        // this.reward_control.visible = true;
        // this.hideReview();
        // if (GameController.getInstance().lanchMissleVedio) {
        //     AdvertiseController.getInstance().showVedio(() => {
        //     }, (result) => {
        //         if (result.finish) {
        //         }
        //     }, "使用导弹");
        // }
        egret.Tween.get(this.resultView).to({ alpha: 1 }, 400);
        this.visible = true;
        if (GameController.getInstance().isMultiplayer() || GameController.getInstance().isRobotPlayer()) {
            this.isMultiplayer = true;
        } else {
            this.isMultiplayer = false;
        }
    }

    public outAnimate() {
        // this.reward_control.visible = false;
        this.gameView.resetView();
        this.visible = false;
    }
}