/**
 * CG 开场动画
 */
class CG extends egret.Sprite {
    constructor() {
        super();
        this.initView();
    }

    private gameView: GameView;
    private bullet_first: BulletView;
    private bullet_yi: BulletView;
    private bullet_ba1: BulletView;
    private bullet_ba2: BulletView;
    private word;
    private infoText: egret.TextField;

    initView() {
        this.gameView = SceneManager.getInstance().storedGameView;
        this.addChild(this.gameView);

        this.bullet_first = new BulletView(false);
        this.bullet_first.type = BulletTypeEnum.MISSILE;
        this.bullet_first.x = AdaptSceenUtil.curWidth() - 50;
        this.bullet_first.y = -this.bullet_first.height - 100;
        this.bullet_first.rotation = 30;
        this.addChild(this.bullet_first);

        this.bullet_yi = new BulletView(false);
        this.bullet_yi.type = BulletTypeEnum.INFRARED_COL;
        this.bullet_yi.x = AdaptSceenUtil.curWidth() - 50;
        this.bullet_yi.y = -this.bullet_yi.height - 100;
        this.bullet_yi.rotation = 30;
        this.addChild(this.bullet_yi);

        this.bullet_ba1 = new BulletView(false);
        this.bullet_ba1.type = BulletTypeEnum.NINE_PALACE_MISSILE;
        this.bullet_ba1.x = AdaptSceenUtil.curWidth() - 50;
        this.bullet_ba1.y = -this.bullet_ba1.height - 100;
        this.bullet_ba1.rotation = 30;
        this.addChild(this.bullet_ba1);

        this.bullet_ba2 = new BulletView(false);
        this.bullet_ba2.type = BulletTypeEnum.NINE_PALACE_MISSILE;
        this.bullet_ba2.x = AdaptSceenUtil.curWidth() - 50;
        this.bullet_ba2.y = -this.bullet_ba2.height - 100;
        this.bullet_ba2.rotation = 30;
        this.addChild(this.bullet_ba2);

        this.word = DrawUtil.textFilter("TECH . CO", 40, true);

        this.infoText = new egret.TextField();
        this.infoText.multiline = false;
        this.infoText.text = "v" + Const.getInstance().clientVersion;
        this.infoText.textAlign = egret.HorizontalAlign.RIGHT;
        this.infoText.x = AdaptSceenUtil.curWidth() / 2 - this.infoText.width / 2;
        this.infoText.y = AdaptSceenUtil.curHeight() - this.infoText.height - 20;
        SceneManager.getInstance().getLoadingLayer().addChild(this.infoText);

        egret.setTimeout(this.attack1, this, 1000);
        egret.setTimeout(this.attack2, this, 1300);
        egret.setTimeout(this.attack3, this, 1500);
        egret.setTimeout(this.attack4, this, 1800);
        egret.setTimeout(this.showTech, this, 3000);
    }

    attack1() {
        let pos = this.globalToLocal(
            this.gameView.gridList[MapUtil.getValueFromXY(2, 3)].x,
            this.gameView.gridList[MapUtil.getValueFromXY(2, 3)].y);

        egret.Tween.get(this.bullet_first).to({ x: pos.x + this.gameView.x - this.gameView.width / 2 + 20, y: pos.y + this.gameView.y - this.gameView.height / 2 - 40 }, 200).call(
            () => {
                SoundManager.getInstance().playSound(SoundEnum.LASER_M4A);
                let grid = (this.gameView.gridList[MapUtil.getValueFromXY(1, 2)] as AwayGridView)
                grid.effect = true;
            }
        ).wait(300).call(() => {
            this.bullet_first.visible = false;
            let grid = (this.gameView.gridList[MapUtil.getValueFromXY(1, 2)] as AwayGridView)
            grid.effect = false;
            grid.status = GridStatusEnum.SHOW;
            grid.type = GridTypeEnum.BODY;
            grid.updateView();
        });

    }

    attack2() {
        let pos1 = this.globalToLocal(
            this.gameView.gridList[MapUtil.getValueFromXY(3, 3)].x,
            this.gameView.gridList[MapUtil.getValueFromXY(3, 3)].y);


        egret.Tween.get(this.bullet_yi).to({ x: pos1.x + this.gameView.x - this.gameView.width / 2 + 20, y: pos1.y + this.gameView.y - this.gameView.height / 2 - 40 }, 200).wait(400).call(
            () => {
                this.bullet_yi.visible = false;
                let list = [11, 20, 29, 38, 47, 56]
                for (let i = 0; i < list.length; i++) {
                    // SoundManager.getInstance().playSound(SoundEnum.LASER_M4A);
                    let grid = (this.gameView.gridList[list[i]] as AwayGridView)
                    grid.status = GridStatusEnum.SHOW;
                    grid.type = GridTypeEnum.BODY;
                    grid.updateView();
                }


            }
        )
    }

    attack3() {
        let pos81 = this.globalToLocal(
            this.gameView.gridList[MapUtil.getValueFromXY(6, 4)].x,
            this.gameView.gridList[MapUtil.getValueFromXY(6, 4)].y);
        egret.Tween.get(this.bullet_ba1).to({ x: pos81.x + this.gameView.x - this.gameView.width / 2, y: pos81.y + this.gameView.y - this.gameView.height / 2 }, 200)
            .wait(300).call(
                () => {
                    SoundManager.getInstance().playSound(SoundEnum.BOOM_MP3);
                    this.bullet_ba1.visible = false;
                    let list = [13, 14, 15, 22, 23, 24, 31, 32, 33]
                    for (let i = 0; i < list.length; i++) {
                        let grid = (this.gameView.gridList[list[i]] as AwayGridView)
                        grid.status = GridStatusEnum.SHOW;
                        if (list[i] == 23) {
                            grid.type = GridTypeEnum.MISS
                        } else {
                            grid.type = GridTypeEnum.BODY;
                        }
                        grid.updateView();
                    }


                }
            )

    }
    attack4() {
        let pos82 = this.globalToLocal(
            this.gameView.gridList[MapUtil.getValueFromXY(6, 6)].x,
            this.gameView.gridList[MapUtil.getValueFromXY(6, 6)].y);
        egret.Tween.get(this.bullet_ba2).to({ x: pos82.x + this.gameView.x - this.gameView.width / 2, y: pos82.y + this.gameView.y - this.gameView.height / 2 }, 200)
            .wait(300).call(
                () => {
                    SoundManager.getInstance().playSound(SoundEnum.BOOM_MP3);
                    this.bullet_ba2.visible = false;
                    let list = [40, 41, 42, 49, 50, 51, 58, 59, 60]
                    for (let i = 0; i < list.length; i++) {
                        let grid = (this.gameView.gridList[list[i]] as AwayGridView)
                        grid.status = GridStatusEnum.SHOW;
                        if (list[i] == 50) {
                            grid.type = GridTypeEnum.MISS;
                        } else {
                            grid.type = GridTypeEnum.BODY;

                        }
                        grid.updateView();
                    }
                    Main.logoFinished = true;
                    Main.hideLogo();
                    this.setText("正在登录中，请稍后");
                    // egret.setTimeout(Main.hideLogo, this, 2000);
                }
            )
    }

    setText(text) {
        this.infoText.text = text;
        this.infoText.x = AdaptSceenUtil.curWidth() / 2 - this.infoText.width / 2;
    }

    showTech() {
        let posWord = this.globalToLocal(
            this.gameView.gridList[MapUtil.getValueFromXY(5, 8)].x,
            this.gameView.gridList[MapUtil.getValueFromXY(5, 8)].y);
        this.word.x = posWord.x + this.gameView.x - this.gameView.width / 2 - 30;
        this.word.y = posWord.y + this.gameView.y - this.gameView.height / 2 + 30;
        this.addChild(this.word);
    }
}