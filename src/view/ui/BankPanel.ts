/**
 * 
 */
class BankPanel extends egret.Sprite {
    constructor() {
        super();
        this.initView();
    }

    private panelBg: egret.Bitmap;

    private stocks = [];

    private container: egret.Sprite;

    private amount: number = 0;
    private selectedId: number = -1;
    private selected: egret.Sprite;

    private amountInput: egret.TextField;

    private buyStockButton: E8TextButton;
    private sellStockButton: E8TextButton;
    private LoanButton: E8TextButton;
    private investBankButton: E8TextButton;

    protected initView() {


        let mask = new egret.Shape();
        mask.graphics.beginFill(0x000000, 1);
        mask.graphics.drawRect(0, 0, AdaptSceenUtil.curWidth(), AdaptSceenUtil.curHeight());
        mask.graphics.endFill();
        mask.alpha = 0.1;
        mask.touchEnabled = true;
        this.addChild(mask);
        mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);

        this.panelBg = new egret.Bitmap();
        this.panelBg.texture = RES.getRes("notice_png");
        // this.panelBg.x = this.width / 2;
        // this.panelBg.y = this.height / 2;
        this.container = new egret.Sprite();
        this.container.addChild(this.panelBg);

        let data = EconomicsController.getInstance().stocks;
        let title = DrawUtil.textFilter("金融交易所", 30);
        title.x = this.panelBg.width / 2;
        title.y = 60;
        this.container.addChild(title);
        let heads = ["股票类别", "现价", "成本", "手"];
        let headsX = [120, 240, 330, 465];
        let stockHead;
        for (let i = 0; i < heads.length; i++) {
            stockHead = DrawUtil.textFilter(heads[i], 20, true);
            stockHead.x = headsX[i];
            stockHead.y = 100;
            this.container.addChild(stockHead);
        }

        let stock: Stock;
        for (let i = 0; i < data.length; i++) {
            stock = new Stock();
            stock.setStock(data[i]);
            stock.x = 60;
            stock.y = 130 + 50 * i;
            stock.id = i;
            stock.touchEnabled = true;
            this.stocks.push(stock);
            stock.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelect, this);
            this.container.addChild(stock);
        }
        this.container.anchorOffsetX = this.container.width / 2;
        this.container.anchorOffsetY = this.container.height / 2;
        this.container.x = this.width / 2;
        this.container.y = this.height / 2;
        this.container.touchEnabled = true;
        this.addChild(this.container);





        this.amountInput = new egret.TextField();
        this.amountInput.text = "交易手数";
        this.amountInput.size = 30;
        this.amountInput.type = egret.TextFieldType.INPUT;
        this.amountInput.inputType = egret.TextFieldInputType.TEXT;
        this.amountInput.width = 200;
        this.amountInput.textAlign = egret.HorizontalAlign.RIGHT;
        this.amountInput.multiline = false;
        this.amountInput.x = 250;
        this.amountInput.y = 435;
        this.amountInput.touchEnabled = true;
        this.amountInput.addEventListener(egret.TextEvent.CHANGE, this.checkInput, this);
        this.amountInput.addEventListener(egret.TextEvent.FOCUS_IN, this.amountInputTouched, this);
        this.amountInput.addEventListener(egret.TouchEvent.TOUCH_TAP, this.amountInputTouched, this);
        this.container.addChild(this.amountInput);

        this.buyStockButton = new E8TextButton(this, RES.getRes("btn_blue_png"), this.buyStockTouched);
        this.buyStockButton.scale(0.65, 0.4);
        this.buyStockButton.setButtonText("买  入");
        this.buyStockButton.touchEnabled = true;
        this.buyStockButton.x = AdaptSceenUtil.curWidth() * 1 / 3;
        this.buyStockButton.y = AdaptSceenUtil.y_fix() + 900;
        this.addChild(this.buyStockButton);

        this.sellStockButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.sellStockTouched);
        this.sellStockButton.scale(0.65, 0.4);
        this.sellStockButton.setButtonText("卖  出");
        this.sellStockButton.touchEnabled = true;
        this.sellStockButton.x = AdaptSceenUtil.curWidth() * 2 / 3;
        this.sellStockButton.y = AdaptSceenUtil.y_fix() + 900;
        this.addChild(this.sellStockButton);


        let invesTip = DrawUtil.textFilter(i18n.getLanguage(i18n.INVEST_HELP_ + 0), 16);
        invesTip.x = AdaptSceenUtil.curWidth() / 2;
        invesTip.y = 950 + AdaptSceenUtil.y_fix();
        this.addChild(invesTip);

        this.investBankButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.investBank);
        this.investBankButton.scale(0.65, 0.4);
        this.investBankButton.setButtonText("投 资 建 设");
        this.investBankButton.touchEnabled = true;
        this.investBankButton.x = AdaptSceenUtil.curWidth() * 1 / 3;
        this.investBankButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.addChild(this.investBankButton);

        this.LoanButton = new E8TextButton(this, RES.getRes("btn_blue_png"), this.loanTouched);
        this.LoanButton.scale(0.65, 0.4);
        this.LoanButton.setButtonText("贷 款 申 请");
        this.LoanButton.touchEnabled = true;
        this.LoanButton.x = AdaptSceenUtil.curWidth() * 2 / 3;
        this.LoanButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.addChild(this.LoanButton);

        if (EconomicsController.getInstance().stockClosed()) {
            this.selected = DrawUtil.textFilter("已经休市", 30);
            this.selected.x = 150;
            this.selected.y = 450;
            this.container.addChild(this.selected);
            let hour = new Date().getHours()
            if (hour < 12) {
                this.amountInput.text = "中午12点开市"
            }
            if (hour > 12 && hour < 18) {
                this.amountInput.text = "下午6点开市"
            }
            this.amountInput.touchEnabled = false;
        } else {
            this.selected = DrawUtil.textFilter("请选择股票", 30);
            this.selected.x = 150;
            this.selected.y = 450;
            this.container.addChild(this.selected);

        }

        this.visible = false;
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
    }

    inAnimate() {
        // this.container.scaleX = this.container.scaleY = 0.5;
        this.visible = true;
        // egret.Tween.get(this.container).to({ scaleX: 1, scaleY: 1 }, 500);
    }

    outAnimate() {
        this.visible = false;
    }

    private investBank() {
        EconomicsController.getInstance().investBank()
    }

    private closePanel() {
        this.outAnimate();
    }

    private buyStockTouched() {

        if (EconomicsController.getInstance().stockClosed()) {
            SceneManager.getInstance().showTip("股票已经休市");
            return
        }
        if (this.selectedId == -1) {
            SceneManager.getInstance().showTip("请选择需要买入的股票");
        } else if (this.amount === 0) {
            SceneManager.getInstance().showTip("请输入需要购买股票手数");
        } else if (isNaN(this.amount)) {
        } else {
            EconomicsController.getInstance().buyStock(this.selectedId, this.amount);
            this.updateView();
        }
    }

    private sellStockTouched() {
        if (EconomicsController.getInstance().stockClosed()) {
            SceneManager.getInstance().showTip("股票已经休市");
            return
        }
        if (this.selectedId == -1) {
            SceneManager.getInstance().showTip("请选择需要卖出的股票");
        } else if (this.amount === 0) {
            SceneManager.getInstance().showTip("请输入需要出售股票手数");
        } else if (isNaN(this.amount)) {
        } else {
            EconomicsController.getInstance().sellStock(this.selectedId, this.amount);
            this.updateView();
        }

    }

    private updateView() {
        this.stocks[this.selectedId].updateCostHand();
    }

    private loanTouched() {
        EconomicsController.getInstance().loan()
    }

    private onSelect(e: egret.TouchEvent) {
        if (EconomicsController.getInstance().stockClosed()) {
            return
        }
        SoundManager.getInstance().playSound(SoundEnum.DROP_M4A);
        let stock = e.target as Stock;
        this.container.removeChild(this.selected);
        this.selectedId = stock.id;
        this.selected = DrawUtil.textFilter(stock.data.name, 30);
        this.selected.x = 150;
        this.selected.y = 450;
        this.container.addChild(this.selected);
    }

    private amountInputTouched() {
        this.amountInput.text = "";
    }

    private checkInput(e) {
        if (isNaN(Number(this.amountInput.text))) {
            this.amountInput.text = this.amountInput.text.slice(0, this.amountInput.text.length - 1);
        }
        if (this.amountInput.text.length > 4) {
            this.amountInput.text = this.amountInput.text.slice(0, this.amountInput.text.length - 1);
        }
        this.amount = Number(this.amountInput.text);
    }

}