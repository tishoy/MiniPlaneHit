/**
 * 管理员使用
 */
class EditorScene extends egret.Sprite implements Scene {
    constructor() {
        super();
        this.initView();
    }

    private viewBg: egret.Bitmap;


    private headIdText: egret.TextField;
    private statusInput: egret.TextField;
    private nameInput: egret.TextField;
    private bulletInput: egret.TextField;

    private backButton: E8Button;
    private saveLocalButton: E8TextButton;
    private uploadButton: E8TextButton;
    private AITestButton: E8TextButton;

    private initView() {


        this.viewBg = new egret.Bitmap();
        this.viewBg.texture = RES.getRes("msg_png");
        this.viewBg.y = AdaptSceenUtil.y_fix() + 140;
        this.addChild(this.viewBg);

        this.headIdText = new egret.TextField();
        this.headIdText.size = 30;
        this.headIdText.width = 300;
        this.headIdText.multiline = false;
        this.headIdText.textAlign = egret.HorizontalAlign.LEFT;
        this.headIdText.x = 30;
        this.headIdText.y = AdaptSceenUtil.y_fix() + 150;
        this.addChild(this.headIdText);


        this.nameInput = new egret.TextField();
        this.nameInput.text = "在此输入名字";
        this.nameInput.size = 30;
        this.nameInput.type = egret.TextFieldType.INPUT;
        this.nameInput.inputType = egret.TextFieldInputType.TEXT;
        this.nameInput.width = 600;
        this.nameInput.textAlign = egret.HorizontalAlign.LEFT;
        this.nameInput.multiline = true;
        this.nameInput.x = 30;
        this.nameInput.y = AdaptSceenUtil.y_fix() + 100;
        this.nameInput.touchEnabled = true;
        // this.statusInput.addEventListener(egret.TextEvent.CHANGE, this.checkInput, this);
        // this.statusInput.addEventListener(egret.TextEvent.FOCUS_IN, this.amountInputTouched, this);
        this.addChild(this.nameInput);

        this.statusInput = new egret.TextField();
        this.statusInput.text = "";
        this.statusInput.size = 30;
        this.statusInput.height = 120;
        this.statusInput.type = egret.TextFieldType.INPUT;
        this.statusInput.inputType = egret.TextFieldInputType.TEXT;
        this.statusInput.width = 600;
        this.statusInput.textAlign = egret.HorizontalAlign.LEFT;
        this.statusInput.multiline = true;
        this.statusInput.x = 30;
        this.statusInput.y = AdaptSceenUtil.y_fix() + 200;
        this.statusInput.touchEnabled = true;
        // this.statusInput.addEventListener(egret.TextEvent.CHANGE, this.checkInput, this);
        // this.statusInput.addEventListener(egret.TextEvent.FOCUS_IN, this.amountInputTouched, this);
        this.addChild(this.statusInput);


        this.bulletInput = new egret.TextField();
        this.bulletInput.text = "0";
        this.bulletInput.size = 30;
        this.bulletInput.type = egret.TextFieldType.INPUT;
        this.bulletInput.inputType = egret.TextFieldInputType.TEXT;
        this.bulletInput.width = 300;
        this.bulletInput.textAlign = egret.HorizontalAlign.RIGHT;
        this.bulletInput.multiline = false;
        this.bulletInput.x = AdaptSceenUtil.curWidth() - this.bulletInput.width - 30;
        this.bulletInput.y = AdaptSceenUtil.y_fix() + 150;
        this.bulletInput.touchEnabled = true;
        // this.bulletInput.addEventListener(egret.TextEvent.CHANGE, this.checkInput, this);
        // this.bulletInput.addEventListener(egret.TextEvent.FOCUS_IN, this.amountInputTouched, this);
        this.addChild(this.bulletInput);

        // this.needBullet = new egret.TextField()

        this.backButton = new E8Button(this, RES.getRes("back_png"), this.onBackButtonTouched);
        this.backButton.touchEnabled = true;
        this.backButton.x = -10 + this.backButton.width / 2;
        this.backButton.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.backButton.height / 2;
        this.addChild(this.backButton);

        this.saveLocalButton = new E8TextButton(this, RES.getRes("btn_blue_png"), this.saveLocalTouched);
        this.saveLocalButton.scale(0.65, 0.4);
        this.saveLocalButton.setButtonText("保 存 关 卡");
        this.saveLocalButton.touchEnabled = true;
        this.saveLocalButton.x = AdaptSceenUtil.curWidth() * 1 / 5;
        this.saveLocalButton.y = 1000 + AdaptSceenUtil.y_fix();
        this.addChild(this.saveLocalButton);

        this.uploadButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.uploadButtonTouched);
        this.uploadButton.scale(0.65, 0.4);
        this.uploadButton.setButtonText("上 传 关 卡");
        this.uploadButton.touchEnabled = true;
        this.uploadButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.uploadButton.y = 1000 + AdaptSceenUtil.y_fix();
        this.addChild(this.uploadButton);

        this.AITestButton = new E8TextButton(this, RES.getRes("btn_blue_png"), this.AITestButtonTouched);
        this.AITestButton.scale(0.65, 0.4);
        this.AITestButton.setButtonText("测 试 关 卡");
        this.AITestButton.touchEnabled = true;
        this.AITestButton.x = AdaptSceenUtil.curWidth() * 4 / 5;
        this.AITestButton.y = 1000 + AdaptSceenUtil.y_fix();
        this.addChild(this.AITestButton);
    }


    public updateText() {
        this.statusInput.text = "";
        for (let i = 0; i < this.gameView.gridList.length; i++) {
            if ((this.gameView.gridList[i] as AwayGridView).status === GridStatusEnum.SHOW) {
                this.statusList.push(i);
                this.statusInput.text = MapUtil.statusRecord(this.statusInput.text, i);
            }
        }

    }

    private saveLocalTouched() {
        let data = {
            id: Number(this.headIdText.text),
            status: this.statusInput.text,
            bullet: JSON.parse("[" + this.bulletInput.text + "]"),
            name: this.nameInput.text,
        }
        SaveDataManager.getInstance().savePuzzle(data);
    }

    private uploadButtonTouched() {

    }

    private AITestButtonTouched() {
        // AIController.getInstance().computeWhersIsPlane(Number(this.headIdText.text), this.statusInput.text);
    }

    private gameView: GameView;

    public statusList = [];

    initData() {
        // this.headIdText.text = PlacingController.getInstance().mapId.toString();
        this.statusList = [];
        let mapData = GameController.getInstance().getAwayData();
        this.headIdText.text = MapUtil.headDataToHeadId(mapData.getHeadList()).toString();
        for (let i = 0; i < this.gameView.gridList.length; i++) {
            if ((this.gameView.gridList[i] as AwayGridView).status === GridStatusEnum.SHOW) {
                this.statusList.push(i);
                this.statusInput.text = MapUtil.statusRecord(this.statusInput.text, i);
            }
        }
    }

    inAnimate() {
        this.gameView = SceneManager.getInstance().storedGameView;
        this.addChild(this.gameView);
    }

    outAnimate() {

    }

    private onBackButtonTouched() {
        SceneManager.getInstance().toTechScene();
    }
}