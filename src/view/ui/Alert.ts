class Alert extends egret.Sprite {
    private alertContainer: egret.Sprite;
    private bg: egret.Bitmap;
    private bullet: BulletView;
    private board: egret.Bitmap;

    private leftButton: E8TextButton;
    private rightButton: E8TextButton;

    private titleText: egret.Sprite;
    private contextText: egret.TextField;

    private touchCallBack: Function;

    constructor() {
        super();
        this.initView();
    }

    private initView() {

        this.alertContainer = new egret.Sprite();


        let mask = new egret.Shape();
        mask.graphics.beginFill(0x000000, 1);
        mask.graphics.drawRect(0, 0, AdaptSceenUtil.curWidth(), AdaptSceenUtil.curHeight());
        mask.graphics.endFill();
        mask.alpha = 0.1;
        mask.touchEnabled = true;
        this.addChild(mask);



        this.bg = new egret.Bitmap();
        // this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextStep, this);
        this.bg.texture = RES.getRes("guide_bg_png");
        this.bg.width = AdaptSceenUtil.curWidth();
        this.bg.height = AdaptSceenUtil.curHeight();
        this.bg.x = 0;

        this.board = new egret.Bitmap();
        // this.board.anchorOffsetX= this.board.width/2;
        // this.board.x = AdaptSceenUtil.curWidth()/2;
        this.board.texture = RES.getRes("guide_board_png");

        this.alertContainer.addChild(this.board);

        this.bullet = new BulletView(false);
        this.bullet.type = BulletTypeEnum.MISSILE;
        this.bullet.scaleX = this.bullet.scaleY = 2;
        this.bullet.x = this.board.width + 50;
        this.bullet.y = this.board.height - this.bullet.height;
        this.alertContainer.addChild(this.bullet);

        this.contextText = new egret.TextField();
        this.contextText.width = this.board.width - 60;
        this.contextText.x = 25;
        this.contextText.textColor = ColorEnum.PURPLE;
        this.contextText.height = 120;
        this.contextText.y = 80;
        this.contextText.multiline = true;
        this.alertContainer.addChild(this.contextText);

        this.leftButton = new E8TextButton("确 定", RES.getRes("btn_yellow_png"), () => { this.popdown() });
        this.leftButton.scale(0.65, 0.4);
        this.leftButton.x = this.board.width * 2 / 7 - 15;
        this.leftButton.y = this.board.height - this.leftButton.height;
        this.rightButton = new E8TextButton("取 消", RES.getRes("btn_red_png"), () => { this.popdown() });
        this.rightButton.scale(0.65, 0.4);
        this.rightButton.x = this.board.width * 5 / 7 - 15;
        this.rightButton.y = this.board.height - this.rightButton.height;
        this.alertContainer.addChild(this.leftButton);
        this.alertContainer.addChild(this.rightButton);

        this.alertContainer.anchorOffsetX = this.alertContainer.width / 2;
        this.alertContainer.anchorOffsetY = this.alertContainer.height / 2;
        this.alertContainer.x = this.width / 2;
        this.alertContainer.y = this.height / 2;
        this.addChild(this.alertContainer);
        // this._step = 1;
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;

        this.touchCallBack = () => {

        }
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchCloseFunction, this);
    }

    public setContent(title = "报告", context = "欢迎您加入奕吧科技，共创未来！", leftButtonText = "执 行", leftCallBack = null, rightButtonText = "", rightCallBack = null, touchClose = false, closeCallBack) {
        if (this.alertContainer.contains(this.titleText)) {
            this.alertContainer.removeChild(this.titleText);
        }
        this.titleText = DrawUtil.textFilter(title, 50, true);
        this.alertContainer.addChild(this.titleText);

        this.contextText.text = context;
        this.contextText.textColor = ArrayUtil.random(ColorEnum.colorList, 1);
        this.titleText.x = this.board.width / 2 - 10;
        this.titleText.y = this.board.y + 45;

        if (leftButtonText == "") {
            this.leftButton.setButtonText("");
            if (this.alertContainer.contains(this.leftButton)) {
                this.alertContainer.removeChild(this.leftButton);
            }
        } else {
            if (!this.alertContainer.contains(this.leftButton)) {
                this.alertContainer.addChild(this.leftButton);
            }
            if (rightButtonText == "") {
                this.leftButton.x = this.board.width * 1 / 2 - 15;
            } else {
                this.leftButton.x = this.board.width * 2 / 7 - 15;
            }
            if (leftButtonText.indexOf("$v") !== -1) {
                this.leftButton.setButtonText(leftButtonText.slice(2, leftButtonText.length), 20, 0, "video_png");
            } else {
                this.leftButton.setButtonText(leftButtonText);
            }
            if (leftCallBack) {
                this.leftButton.changeCallBack(() => { leftCallBack() });
            } else {
                this.leftButton.changeCallBack(() => { this.popdown() });
            }

        }

        if (rightButtonText == "") {
            this.rightButton.setButtonText("");
            if (this.alertContainer.contains(this.rightButton)) {
                this.alertContainer.removeChild(this.rightButton);
            }
        } else {
            if (!this.alertContainer.contains(this.rightButton)) {
                this.alertContainer.addChild(this.rightButton);
            }
            if (leftButtonText == "") {
                this.leftButton.x = this.board.width * 1 / 2 - 15;
            } else {
                this.leftButton.x = this.board.width * 2 / 7 - 15;
            }
            this.rightButton.setButtonText(rightButtonText);
            if (rightCallBack) {
                this.rightButton.changeCallBack(() => { rightCallBack() });
            } else {
                this.rightButton.changeCallBack(() => { this.popdown() });
            }
        }
        if (touchClose) {
            this.touchCallBack = closeCallBack;
        } else {
            this.touchCallBack = () => {

            }
        }
    }

    public touchCloseFunction(e) {
        this.touchCallBack();
    }

    public popup() {
        SoundManager.getInstance().playSound(SoundEnum.POPUP_MP3);
        SceneManager.getInstance().getPopLayer().addChild(this);
    }

    public popdown(e = null) {
        if (SceneManager.getInstance().getPopLayer().contains(this)) {
            SceneManager.getInstance().getPopLayer().removeChild(this);
        }
    }

    public setBullet() {

    }

    public setButtonColor(isLeft = false, color = "yellow") {

    }

}