/**
 * 
 */
class GasStationPop extends egret.Sprite {
    constructor() {
        super();
        this.initView();
    }

    private buyGasButton: E8TextButton;
    private sellGasButton: E8TextButton;
    private investGasButton: E8TextButton;
    private maxGasButton: E8TextButton;

    private initView() {

        this.buyGasButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.buyGas);
        this.buyGasButton.scale(0.65, 0.4);
        this.buyGasButton.setButtonText("购 买 原 油");
        this.buyGasButton.touchEnabled = true;
        this.buyGasButton.x = AdaptSceenUtil.curWidth() / 3;
        this.buyGasButton.y = 0;
        this.buyGasButton.visible = false;
        this.addChild(this.buyGasButton);

        this.sellGasButton = new E8TextButton(this, RES.getRes("btn_yellow_png"), this.sellGas);
        this.sellGasButton.scale(0.65, 0.4);
        this.sellGasButton.setButtonText("出 售 原 油");
        this.sellGasButton.touchEnabled = true;
        this.sellGasButton.x = AdaptSceenUtil.curWidth() * 2 / 3;
        this.sellGasButton.y = 0;
        this.sellGasButton.visible = false;
        this.addChild(this.sellGasButton);

        let invesTip = DrawUtil.textFilter(i18n.getLanguage(i18n.INVEST_HELP_ + 1), 16);
        invesTip.x = AdaptSceenUtil.curWidth() / 2;
        invesTip.y = -50;
        this.addChild(invesTip);

        this.investGasButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.invest);
        this.investGasButton.scale(0.65, 0.4);
        this.investGasButton.setButtonText("投 资 建 设");
        this.investGasButton.touchEnabled = true;
        this.investGasButton.x = AdaptSceenUtil.curWidth() * 1 / 3;
        this.investGasButton.y = 80;
        this.investGasButton.visible = false;
        this.addChild(this.investGasButton);

        this.maxGasButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.vedioPlay);
        this.maxGasButton.scale(0.65, 0.4);
        this.maxGasButton.setButtonText("扩 容", 15, 0, "video_png");
        this.maxGasButton.touchEnabled = true;
        this.maxGasButton.x = AdaptSceenUtil.curWidth() * 2 / 3;
        this.maxGasButton.y = 80;
        this.maxGasButton.visible = false;
        this.addChild(this.maxGasButton);

        this.buyGasButton.visible = true;
        this.sellGasButton.visible = true;
        this.investGasButton.visible = true;
        this.maxGasButton.visible = true;

        this.visible = false;

        this.y = 1000 + AdaptSceenUtil.y_fix();

    }

    public inAnimate() {
        this.visible = true;
    }

    public outAnimate() {
        this.visible = false;
    }

    private buyGas() {
        EconomicsController.getInstance().buyGas();
    }

    private sellGas() {
        EconomicsController.getInstance().sellGas();
    }


    private vedioPlay() {
        AdvertiseController.getInstance().showVedio(() => {

        }, (result) => {
            if (result.finish) {
                SaveDataManager.getInstance().getUserData().gasMax++;
                SceneManager.getInstance().updateGasMax();
            }
        }, "油厂扩容");
    }

    private invest() {
        EconomicsController.getInstance().investGasStation();
    }

}