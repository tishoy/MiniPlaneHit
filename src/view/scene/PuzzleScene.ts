/**
 * 解谜
 * 残局
 */
class PuzzleScene extends egret.Sprite implements Scene {
    private backButton: E8Button;
    private gameView: GameView;

    private progress: Progress;

    private mapName: egret.Sprite;

    private shareButton: E8TextButton;
    private giveUpButton: E8TextButton;

    private viewBg: egret.Bitmap;

    constructor() {
        super();
        this.initView();
    }

    initView() {
        // this.mapName = 

        this.viewBg = new egret.Bitmap();
        this.viewBg.texture = RES.getRes("msg_png");
        this.viewBg.x = AdaptSceenUtil.curWidth() / 2 - this.viewBg.width / 2
        this.viewBg.y = AdaptSceenUtil.y_fix() + 140;
        this.addChild(this.viewBg);

        this.giveUpButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.giveUpTouched);
        this.giveUpButton.scale(0.65, 0.4);
        this.giveUpButton.setButtonText("放 弃 返 航");
        // this.giveUpButton.setButtonText("微 信 登 录");
        this.giveUpButton.touchEnabled = true;
        this.giveUpButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.giveUpButton.y = 1000 + AdaptSceenUtil.y_fix();
        this.addChild(this.giveUpButton);

        this.shareButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.shareButtonTouched);
        this.shareButton.scale(0.65, 0.4);
        this.shareButton.setButtonText("场 外 求 助");
        this.shareButton.touchEnabled = true;
        this.shareButton.x = AdaptSceenUtil.curWidth() / 5;
        this.shareButton.y = 1000 + AdaptSceenUtil.y_fix();
        this.addChild(this.shareButton);

        this.backButton = new E8Button(this, RES.getRes("back_png"), this.onBackButtonTouched);
        this.backButton.touchEnabled = true;
        this.backButton.x = -10 + this.backButton.width / 2;
        this.backButton.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.backButton.height / 2 + platform.offsetHead();
        this.addChild(this.backButton);

        // this.scrollView = new egret.ScrollView();
        this.bulletContainer = new egret.Sprite();
        this.bulletContainer.x = this.viewBg.x + 20;
        this.bulletContainer.y = AdaptSceenUtil.y_fix() + 120;
        this.addChild(this.bulletContainer);

        this.bulletPool = new Array<BulletView>();


    }

    private bulletTouched(e) {
        let bullet = e.target as BulletView;
        (this.bulletPool[this.currentSelected] as BulletView).used = false;
        this.currentSelected = bullet.type;
        bullet.used = true;
        BulletController.getInstance().useBullet(bullet.type);
    }

    private bulletPool = [];
    // private scrollView: egret.ScrollView;
    private bulletContainer: egret.Sprite;
    private currentSelected: number = 0;

    private giveUpTouched() {
        SceneManager.getInstance().showAlert("报  告", "    返航将会记录一次败绩，真的要返航么？", "返  航", () => {
            this.giveUpButton.touchEnabled = false;
            GameController.getInstance().gameFinished(false);
            SceneManager.getInstance().hideAlert();
        }, "取消");
    }

    private shareButtonTouched(puzzle) {
        // platform.share()
        // let id = MapUtil.headDataToHeadId(RecordController.getInstance().heads);
        JSON.stringify(puzzle);
        platform.share("这个谜题我实在是不知道怎么解，不信你也来试试？", "", "", this.onShared, "puzzle=" + GameController.getInstance().currentPuzzle, "");
    }

    public showPuzzleName(name, author) {
        if (this.contains(this.mapName)) {
            this.removeChild(this.mapName);
        }
        this.mapName = DrawUtil.textFilter("地图名：" + name + "  作者：" + author, 30);
        this.mapName.x = AdaptSceenUtil.curWidth() / 2;
        this.mapName.y = AdaptSceenUtil.y_fix() + 120;
        this.addChild(this.mapName);
    }

    onShared() {

    }

    public resetBullet() {
        this.bulletContainer.removeChildren();
        this.bulletPool = [];
        let bullet: BulletView;
        let hasBullet = BulletController.getInstance().bulletNumber - RecordController.getInstance().bulletUsed;
        for (let i = 0; i <= hasBullet - 1; i++) {
            bullet = new BulletView(true, false, true);
            bullet.type = BulletTypeEnum.MISSILE;
            bullet.x = 100 + i * 110;
            bullet.y = 70;
            bullet.used = false;
            this.bulletPool.push(bullet);
            this.bulletContainer.addChild(bullet);
            if (i == 0) {
                bullet.used = true;
                this.currentSelected = bullet.type;
                BulletController.getInstance().useBullet(bullet.type);
                bullet.status = true;
            }

            // bullet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bulletTouched, this);
        }
        this.bulletContainer.x = this.viewBg.x + 20;
        // this.bulletContainer.x = AdaptSceenUtil.curWidth() / 2 - this.bulletContainer.width / 2;
    }

    public updateBullet() {
        let bullet = this.bulletPool.shift();
        if (this.bulletContainer.contains(bullet)) {
            this.bulletContainer.removeChild(bullet);
        }
        if (this.bulletPool.length == 0) {
            return;
        }
        egret.Tween.get(this.bulletContainer).to({ x: this.viewBg.x + 20 - 110 * RecordController.getInstance().bulletUsed }, 500);

        this.bulletPool[0].used = true;

        this.bulletPool[0]
        // this.scrollView.scrollLeft += 110;
    }


    private onBackButtonTouched() {
        SceneManager.getInstance().showAlert("报  告", "    谜题模式返回，就会记录为失败!真的要返航么？", "返  回", () => {
            this.giveUpButton.touchEnabled = false;
            GameController.getInstance().gameFinished(false);
            SceneManager.getInstance().hideAlert();
        }, "取消");
        // SceneManager.getInstance().toTechScene();
    }

    inAnimate() {
        this.backButton.touchEnabled = true;
        this.giveUpButton.touchEnabled = true;
        this.gameView = SceneManager.getInstance().storedGameView;
        this.addChild(this.gameView);
        egret.Tween.get(this.gameView).to({
            scaleX: 1, scaleY: 1, alpha: 1
        }, 500);



        // this.progress.resetView();
        // this.gameView.resetView();
        // GameController.getInstance().preparePuzzle();
        this.visible = true;
    }

    outAnimate() {
        this.visible = false;
    }
}