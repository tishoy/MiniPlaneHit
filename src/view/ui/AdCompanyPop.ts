/**
 * create by tishoy
 * 2021.4.26
 */
class AdCompanyPop extends egret.Sprite {
    constructor() {
        super();
        this.initView();
    }

    private bannerShowButton: E8TextButton;
    private bannerHideButton: E8TextButton;
    private interstitialShowButton: E8TextButton;
    private interstitialHideButton: E8TextButton;
    private vedioPlayButton: E8TextButton;

    private investButton: E8TextButton;

    private initView() {

        this.bannerShowButton = new E8TextButton(this, RES.getRes("btn_blue_png"), this.bannerShow);
        this.bannerShowButton.scale(0.65, 0.4);
        this.bannerShowButton.setButtonText("底部广告牌");
        this.bannerShowButton.touchEnabled = true;
        this.bannerShowButton.x = AdaptSceenUtil.curWidth() * 1 / 3;
        this.bannerShowButton.y = 80;
        this.addChild(this.bannerShowButton);

        this.bannerHideButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.bannerHide);
        this.bannerHideButton.scale(0.65, 0.4);
        this.bannerHideButton.setButtonText("隐藏底部广告");
        this.bannerHideButton.touchEnabled = true;
        this.bannerHideButton.x = AdaptSceenUtil.curWidth() * 1 / 3;
        this.bannerHideButton.y = 80;
        this.bannerHideButton.visible = false;
        this.addChild(this.bannerHideButton);

        let invesTip = DrawUtil.textFilter(i18n.getLanguage(i18n.INVEST_HELP_ + 3), 16);
        invesTip.x = AdaptSceenUtil.curWidth() / 2;
        invesTip.y = -50;
        this.addChild(invesTip);

        this.interstitialShowButton = new E8TextButton(this, RES.getRes("btn_blue_png"), this.interstitialShow);
        this.interstitialShowButton.scale(0.65, 0.4);
        this.interstitialShowButton.setButtonText("插屏广告牌");
        this.interstitialShowButton.touchEnabled = true;
        this.interstitialShowButton.x = AdaptSceenUtil.curWidth() * 2 / 3;
        this.interstitialShowButton.y = 80;
        this.addChild(this.interstitialShowButton);

        this.interstitialHideButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.interstitialHide);
        this.interstitialHideButton.scale(0.65, 0.4);
        this.interstitialHideButton.setButtonText("隐藏插屏广告");
        this.interstitialHideButton.touchEnabled = true;
        this.interstitialHideButton.x = AdaptSceenUtil.curWidth() * 2 / 3;
        this.interstitialHideButton.y = 80;
        this.interstitialHideButton.visible = false;
        this.addChild(this.interstitialHideButton);

        this.vedioPlayButton = new E8TextButton(this, RES.getRes("btn_blue_png"), this.vedioPlay);
        this.vedioPlayButton.scale(0.65, 0.4);
        this.vedioPlayButton.setButtonText("视频奖励", 20, 0, "video_png");
        this.vedioPlayButton.touchEnabled = true;
        this.vedioPlayButton.x = AdaptSceenUtil.curWidth() / 3;
        this.vedioPlayButton.y = 0;
        this.addChild(this.vedioPlayButton);

        this.investButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.invest);
        this.investButton.scale(0.65, 0.4);
        this.investButton.setButtonText("投 资 建 设");
        this.investButton.touchEnabled = true;
        this.investButton.x = AdaptSceenUtil.curWidth() * 2 / 3;
        this.investButton.y = 0;
        this.addChild(this.investButton);

        this.visible = false;
        this.y = 1000 + AdaptSceenUtil.y_fix();
    }

    public inAnimate() {
        let userData = SaveDataManager.getInstance().getUserData();
        if (userData.banner) {
            this.bannerShowButton.visible = false;
            this.bannerHideButton.visible = true;
        } else {
            this.bannerShowButton.visible = true;
            this.bannerHideButton.visible = false;
        }
        if (platform.name == "tt") {
            this.bannerShowButton.visible = false;
            this.bannerHideButton.visible = false;
        }
        if (userData.interstitial) {
            this.interstitialShowButton.visible = false;
            this.interstitialHideButton.visible = true;
        } else {
            this.interstitialShowButton.visible = true;
            this.interstitialHideButton.visible = false;
        }
        if (platform.name == "tt") {
            this.interstitialShowButton.visible = false;
            this.interstitialHideButton.visible = false;
        }
        this.visible = true;
    }

    public outAnimate() {
        this.visible = false;
    }

    private bannerShow() {
        SceneManager.getInstance().showAlert("报 告", "    展示底部广告可能会造成按钮的遮挡，如果影响您的游戏正常进行，请选择隐藏底部广告！", "确 定", () => {
            SceneManager.getInstance().hideAlert();
            SceneManager.getInstance().showAlert("报 告", "    展示底部广告，会给我们带来一定的经济效益。随着投资力度越高，金币获得越多！", "展 示", () => {

                if (SaveDataManager.getInstance().getUserData().banner) {
                    return;
                }
                SaveDataManager.getInstance().getUserData().banner = true;
                // AdvertiseController.getInstance().showBanner();
                EconomicsController.getInstance().setUpAdvertise();
                this.bannerHideButton.visible = true;
                this.bannerShowButton.visible = false;
                SceneManager.getInstance().hideAlert();
            }, "");
        }, "");
    }

    private bannerHide() {
        SceneManager.getInstance().showTip("游戏过程中，将不展示底部广告");
        if (SaveDataManager.getInstance().getUserData().banner) {
            SaveDataManager.getInstance().getUserData().banner = false;
            // AdvertiseController.getInstance().hideBanner();
        }
        EconomicsController.getInstance().removeAdvertise();
        this.bannerHideButton.visible = false;
        this.bannerShowButton.visible = true;
    }

    private interstitialShow() {
        SceneManager.getInstance().showAlert("报 告", "    展示插屏广告牌，插屏广告就会在游戏中弹出，为我们带来一定的经济效益。随着投资力度越高，金币获得越多！", "展 示", () => {
            if (SaveDataManager.getInstance().getUserData().interstitial) {
                return;
            }
            SaveDataManager.getInstance().getUserData().interstitial = true;
            AdvertiseController.getInstance().onCloseInterstitialAd();
            this.interstitialShowButton.visible = false;
            this.interstitialHideButton.visible = true;
            SceneManager.getInstance().hideAlert();
        }, "");
    }

    private interstitialHide() {
        SceneManager.getInstance().showTip("游戏过程中，将不展示插屏广告");
        if (SaveDataManager.getInstance().getUserData().interstitial) {
            SaveDataManager.getInstance().getUserData().interstitial = false;
        }
        this.interstitialHideButton.visible = false;
        this.interstitialShowButton.visible = true;
    }

    private vedioPlay() {
        AdvertiseController.getInstance().showVedio(() => {

        }, (result) => {
            if (result.finish) {
                EconomicsController.getInstance().vedioReward();
            }
        }, "广告公司");
    }

    private invest(type) {
        EconomicsController.getInstance().investAdvertise();
    }

}