class MatchScene extends egret.Sprite implements Scene {
    private backButton: E8Button;
    private gameView: GameView;

    public opponetGameView: GameView;

    private viewBg: egret.Bitmap;

    private bulletPool = [];
    // private scrollView: egret.ScrollView;
    private bulletContainer: egret.Sprite;
    private currentSelected: number = 0;

    private makingBullet: BulletView;

    private effect: CooldownEffect;

    private giveUpButton: E8TextButton;
    private switchButton: E8TextButton;
    private switchBackButton: E8TextButton;
    private showMiniButton: E8TextButton;
    private hideMiniButton: E8TextButton;
    private winBackButton: E8TextButton;
    private myPlayerDetail: PlayerDetail;
    private oppoPlayerDetail: PlayerDetail;
    private vsTextField: egret.Sprite;

    public isMyHome;

    constructor() {
        super();
        this.initView();
    }

    private initView() {

        this.viewBg = new egret.Bitmap();
        this.viewBg.texture = RES.getRes("msg_png");
        this.viewBg.x = AdaptSceenUtil.curWidth() / 2 - this.viewBg.width / 2;
        this.viewBg.y = AdaptSceenUtil.y_fix() + 140;
        this.addChild(this.viewBg);

        this.vsTextField = DrawUtil.textFilter("VS");
        this.vsTextField.y = AdaptSceenUtil.y_fix() + 100;
        this.vsTextField.x = AdaptSceenUtil.curWidth() / 2;
        this.addChild(this.vsTextField);


        this.giveUpButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.giveUpTouched);
        this.giveUpButton.scale(0.65, 0.4);
        this.giveUpButton.setButtonText("放 弃 返 航");
        // this.giveUpButton.setButtonText("微 信 登 录");
        this.giveUpButton.touchEnabled = true;
        this.giveUpButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.giveUpButton.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.giveUpButton);


        this.switchButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.switchButtonTouched);
        this.switchButton.scale(0.65, 0.4);
        this.switchButton.setButtonText("切换至敌情");
        // this.switchButton.setButtonText("微 信 登 录");
        this.switchButton.touchEnabled = true;
        this.switchButton.x = AdaptSceenUtil.curWidth() * 4 / 5;
        this.switchButton.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.switchButton);

        this.switchBackButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.switchBackTouched);
        this.switchBackButton.scale(0.65, 0.4);
        this.switchBackButton.setButtonText("切换至我方");
        // this.switchButton.setButtonText("微 信 登 录");
        this.switchBackButton.touchEnabled = true;
        this.switchBackButton.x = AdaptSceenUtil.curWidth() * 4 / 5;
        this.switchBackButton.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.switchBackButton);


        this.showMiniButton = new E8TextButton(this, RES.getRes("btn_purple_png"), this.showMiniTouched);
        this.showMiniButton.scale(0.65, 0.4);
        this.showMiniButton.setButtonText("显示mini敌情");
        // this.giveUpButton.setButtonText("微 信 登 录");
        this.showMiniButton.touchEnabled = true;
        this.showMiniButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.showMiniButton.y = 1000 + AdaptSceenUtil.y_fix();
        this.addChild(this.showMiniButton);

        this.hideMiniButton = new E8TextButton(this, RES.getRes("btn_purple_png"), this.hideMiniTouced);
        this.hideMiniButton.scale(0.65, 0.4);
        this.hideMiniButton.setButtonText("隐藏mini敌情");
        // this.giveUpButton.setButtonText("微 信 登 录");
        this.hideMiniButton.touchEnabled = true;
        this.hideMiniButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.hideMiniButton.y = 1000 + AdaptSceenUtil.y_fix();
        this.addChild(this.hideMiniButton);

        this.winBackButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.onWinBackTouched);
        this.winBackButton.scale(0.65, 0.4);
        this.winBackButton.setButtonText("胜 利 返 航");
        // this.giveUpButton.setButtonText("微 信 登 录");
        this.winBackButton.touchEnabled = true;
        this.winBackButton.x = AdaptSceenUtil.curWidth() * 1 / 5;
        this.winBackButton.y = 1000 + AdaptSceenUtil.y_fix();
        this.addChild(this.winBackButton);


        this.backButton = new E8Button(this, RES.getRes("back_png"), this.onBackButtonTouched);
        this.backButton.touchEnabled = true;
        this.backButton.x = -10 + this.backButton.width / 2;
        this.backButton.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.backButton.height / 2 + platform.offsetHead();
        // this.addChild(this.backButton);



        // this.scrollView = new egret.ScrollView();
        this.bulletContainer = new egret.Sprite();
        this.bulletContainer.x = this.viewBg.x + 20;
        this.bulletContainer.y = AdaptSceenUtil.y_fix() + 120;
        this.addChild(this.bulletContainer);

        this.bulletPool = new Array<BulletView>();

        this.makingBullet = new BulletView(true, false, true);
        this.makingBullet.type = BulletTypeEnum.MISSILE;
        this.makingBullet.scaleY = this.makingBullet.scaleX = 0.8;
        this.makingBullet.x = AdaptSceenUtil.curWidth() - 100;
        this.makingBullet.y = this.bulletContainer.y + 70;
        this.addChild(this.makingBullet);
        this.effect = new CooldownEffect(this.makingBullet.width, this.makingBullet.height, true, false);
        this.addChild(this.effect);
        this.effect.x = this.makingBullet.x - this.makingBullet.width / 2;
        this.effect.y = this.makingBullet.y - this.makingBullet.height / 2;
        this.effect.start(3000);
        let bmp = new egret.Bitmap();
        bmp.texture = RES.getRes("map_bg_png");
        bmp.width = bmp.width * 0.64;
        bmp.height = bmp.height * 0.64;
        bmp.anchorOffsetX = bmp.width / 2;
        bmp.anchorOffsetY = bmp.height / 2;
        bmp.x = this.makingBullet.x;
        bmp.y = this.makingBullet.y + 17;
        this.addChild(bmp);
        this.effect.mask = bmp;


        this.opponetGameView = new GameView(false, null, true, false);
        this.opponetGameView.scaleX = 0.8;
        this.opponetGameView.scaleY = 0.8;
        this.opponetGameView.alpha = 0.8;
        this.opponetGameView.visible = false;
        this.opponetGameView.touchEnabled = true;
        SceneManager.getInstance().getPopLayer().addChild(this.opponetGameView);
        this.opponetGameView.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onOGVToucheBegin, this);
        this.opponetGameView.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOGVDoubleTouched, this);
    }


    public updateOppoData(data) {
        this.oppoPlayerDetail.updateData(data);
    }

    public startCoolDown() {
        this.effect.start(3000);
    }

    // private bulletTouched(e) {
    //     let bullet = e.target as BulletView;
    //     (this.bulletPool[this.currentSelected] as BulletView).used = false;
    //     this.currentSelected = bullet.type;
    //     bullet.used = true;
    //     BulletController.getInstance().useBullet(bullet.type);
    // }

    private giveUpTouched() {
        SceneManager.getInstance().showAlert("报  告", "    返航将会记录一次败绩，真的要返航么？", "返  航", () => {
            this.giveUpButton.touchEnabled = false;
            ServerController.getInstance().endGame();
            GameController.getInstance().giveUpMatchGame();
            GameController.getInstance().gameFinished(false);
            SceneManager.getInstance().hideAlert();
        }, "取消");
    }

    private switchButtonTouched(e) {
        this.isMyHome = false;
        this.switchButton.visible = false;
        this.switchBackButton.visible = true;
        this.opponetGameView.alpha = 1;
        this.opponetGameView.scaleX = this.opponetGameView.scaleY = 1;
        this.opponetGameView.x = this.gameView.x;
        this.opponetGameView.y = this.gameView.y;
        this.gameView.visible = false;
        this.opponetGameView.visible = true;
        this.hideMiniButton.visible = false;
        // this.opponetGameView.touchEnabled = false;
        this.opponetGameView.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onOGVToucheBegin, this);
    }

    private switchBackTouched(e) {
        this.isMyHome = true;
        this.switchButton.visible = true;
        this.switchBackButton.visible = false;
        this.gameView.visible = true;
        this.opponetGameView.scaleX = 0.8;
        this.opponetGameView.scaleY = 0.8;
        this.opponetGameView.alpha = 0.8;
        this.hideMiniButton.visible = true;
        // this.opponetGameView.touchEnabled = true;
        this.opponetGameView.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onOGVToucheBegin, this);
    }

    private showMiniTouched() {
        this.hideMiniButton.visible = true;
        this.showMiniButton.visible = false;
        this.opponetGameView.visible = true;
        this.switchButton.visible = true;
    }

    private hideMiniTouced() {
        this.switchButton.visible = false;
        this.hideMiniButton.visible = false;
        this.showMiniButton.visible = true;
        this.opponetGameView.visible = false;
    }

    public resetBullet() {
        this.bulletContainer.removeChildren();
        this.bulletPool = [];
        let bullet: BulletView;
        let bullets = BulletController.getInstance().getMatchBullets();
        for (let i = 0; i < bullets.length; i++) {
            bullet = new BulletView(true, false, true);
            bullet.type = bullets[i];
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

    public shootBullet() {
        if (this.bulletPool.length == 0) {
            return;
        } else {
            this.bulletPool[0].used = true;
        }
        let bullet = this.bulletPool.shift();
        if (this.bulletContainer.contains(bullet)) {
            this.bulletContainer.removeChild(bullet);
        }
        for (let i = 0; i < this.bulletPool.length; i++) {
            egret.Tween.get(this.bulletPool[i]).to({ x: 100 + i * 110 }, 500);
        }


        // this.scrollView.scrollLeft += 110;
    }

    public addBullet(type) {
        let bullet = new BulletView(true, false, true);
        bullet.type = type;
        bullet.x = 100 + this.bulletPool.length * 110;
        bullet.y = 70;
        bullet.used = false;
        this.bulletPool.push(bullet);
        this.bulletContainer.addChild(bullet);
    }

    public setNewBullet(bullet) {
        this.makingBullet.type = bullet;
    }

    public showWinBackButton() {
        this.winBackButton.visible = true;
    }

    private onWinBackTouched() {
        ServerController.getInstance().areYouFinished = true;
        GameController.getInstance().gameFinished(true);
    }

    private onBackButtonTouched() {
        SceneManager.getInstance().toTechScene();
        return;
        SceneManager.getInstance().showAlert("报  告", "    放弃与对手交战么，返回的话就等于认输了呀？", "返  回", () => {
            GameController.getInstance().gameFinished(false);
            // GameController.getInstance().gameFinished(false);
            SceneManager.getInstance().hideAlert();
            SceneManager.getInstance().toTechScene();
        }, "取消");
        //
    }

    public onGameEnd() {

    }

    inAnimate() {
        this.winBackButton.visible = false;
        this.backButton.touchEnabled = true;
        this.giveUpButton.touchEnabled = true;
        this.opponetGameView.visible = false;
        this.opponetGameView.resetView();
        this.gameView = SceneManager.getInstance().storedGameView;
        this.gameView.resetView();
        this.addChild(this.gameView);
        egret.Tween.get(this.gameView).to({
            scaleX: 1, scaleY: 1, alpha: 1
        }, 500);
        this.switchButton.visible = false;
        this.switchBackButton.visible = false;
        this.hideMiniButton.visible = false;
        this.showMiniButton.visible = true;
        this.visible = true;

        SceneManager.getInstance().headUIEffect(false);
        this.showDetail();
    }

    showDetail() {
        this.myPlayerDetail = SceneManager.getInstance().myPlayerDetail;
        this.myPlayerDetail.x = AdaptSceenUtil.curWidth() / 2 - this.myPlayerDetail.width - this.vsTextField.width;
        this.myPlayerDetail.y = AdaptSceenUtil.y_fix() + 40;
        this.addChild(this.myPlayerDetail);


        this.oppoPlayerDetail = SceneManager.getInstance().oppoPlayerDetail;
        this.oppoPlayerDetail.x = AdaptSceenUtil.curWidth() / 2 + this.vsTextField.width;
        this.oppoPlayerDetail.y = AdaptSceenUtil.y_fix() + 40;
        this.addChild(this.oppoPlayerDetail);
    }

    outAnimate() {
        this.visible = false;
        this.gameView.visible = true;
        this.opponetGameView.visible = false;
        SceneManager.getInstance().headUIEffect(true);
    }

    public hitGrid(grid, bullet) {
        this.opponetGameView.showHitEffect(grid, bullet);
    }

    public showGrid(effectList: Array<number>) {
        for (let i = 0; i < effectList.length; i++) {
            let hitType = PlayerController.getInstance().getMyMap().getMapGridById(effectList[i]).gridType;
            this.opponetGameView.gridList[effectList[i]].type = hitType;
            (this.opponetGameView.gridList[effectList[i]] as AwayGridView).status = GridStatusEnum.SHOW;
        }

    }

    private firingList = [];
    public showFiring(firingList) {
        for (let i = 0; i < this.firingList.length; i++) {
            (this.opponetGameView.gridList[this.firingList[i].grid] as AwayGridView).fire = false;
        }
        this.firingList = firingList;
        for (let i = 0; i < firingList.length; i++) {
            (this.opponetGameView.gridList[firingList[i].grid] as AwayGridView).fire = true;
        }
    }

    private fixX;
    private fixY;
    private lastTouch = false;
    private timerIndex = -1;
    private onOGVDoubleTouched(e) {
        if (this.lastTouch == true) {
            if (this.isMyHome) {
                this.switchButtonTouched(e);
            } else {
                this.switchBackTouched(e);
            }
            this.lastTouch = false;
        } else {
            this.lastTouch = true;
            this.timerIndex = egret.setTimeout(() => { this.lastTouch = false; egret.clearTimeout(this.timerIndex) }, this, 500)
        }
    }

    private onOGVToucheBegin(e) {
        this.fixX = this.opponetGameView.x - e.stageX;
        this.fixY = this.opponetGameView.y - e.stageY;
        this.opponetGameView.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onOGVToucheBegin, this);
        this.opponetGameView.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onOGVToucheMove, this);
        this.opponetGameView.addEventListener(egret.TouchEvent.TOUCH_END, this.onOGVToucheEnd, this);
    }

    public onOGVToucheMove(e) {
        this.opponetGameView.x = e.stageX + this.fixX;
        this.opponetGameView.y = e.stageY + this.fixY;
    }

    /**
     * onOGVToucheEnd
     */
    public onOGVToucheEnd(e) {
        this.opponetGameView.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onOGVToucheBegin, this);
        this.opponetGameView.removeEventListener(egret.TouchEvent.TOUCH_END, this.onOGVToucheEnd, this);
        this.opponetGameView.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onOGVToucheMove, this);
    }

}