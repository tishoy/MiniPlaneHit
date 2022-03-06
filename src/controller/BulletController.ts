/**
 * 子弹控制
 * created ty tishoy
 * 2121.4.25
 */
class BulletController {
    private static instance: BulletController = null;
    private bulletData;

    public bulletNumber = 20;
    private bulletList: Array<number> = [];
    private opponentBulletList: Array<number> = [];

    private currentBullet: number = 0;

    constructor() {
        if (BulletController.instance) {
            throw new Error("AIController singlon error")
        }
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new BulletController();
        }
        return this.instance;
    }

    public resetBullets(bullet = 20) {
        this.bulletNumber = bullet;
    }

    public getCurrentBullet() {
        return this.currentBullet;
    }

    public lanchBullet() {
        return this.currentBullet;
    }

    public useBullet(type) {
        this.currentBullet = type;
    }

    public rewardBullet(bulletType) {
        // GameController.getInstance().startAttackPhase();
    }

    public prepareNextBullet() {
        SceneManager.getInstance().awayScene.updateBullets();
        GameController.getInstance().startAttackPhase();
    }


    // double game
    public bulletRound = 0;
    public resetDoubleGameBullets() {
        this.bulletList
    }


    public get bullets() {
        return this.bulletList;
    }

    public rewardOneBullet(bulletType) {
        this.bulletList.unshift(bulletType);
    }

    public getMatchBullet() {
        if (this.bulletList.length > 0) {
            return this.bulletList[0];
        } else {
            return null;
        }
    }

    public getMatchBullets() {
        return this.bulletList;
    }

    public prepareMatchGameBullet() {
        this.newBullet = BulletTypeEnum.MISSILE;
        this.bulletList = [BulletTypeEnum.MISSILE,
        BulletTypeEnum.MISSILE,
        BulletTypeEnum.MISSILE];
        this.bulletRound = 3;
        SceneManager.getInstance().matchScene.resetBullet();
        SceneManager.getInstance().matchScene.startCoolDown();
        this.bulletShootUp = false;
        this.bulletIndex = egret.setInterval(() => {
            if (this.bulletRound > 20) {
                egret.clearInterval(this.bulletIndex);

            } else {
                this.bulletList.push(this.newBullet);
                if (!GameController.getInstance().isResultWaiting()) {
                    SceneManager.getInstance().matchScene.addBullet(this.newBullet);
                }
                ServerController.getInstance().uploadBullet(this.newBullet);
                this.bulletRound++;
                this.genNextBullet();
            }
        }, this, 3000);
    }

    private bulletIndex;
    public newBullet;
    private oppoBulletList = [];
    private oppoNewBullet;
    public bulletShootUp = false;

    public genNextBullet() {

        if (ServerController.getInstance().oppoIsRobot) {
            AIController.getInstance().hitGrid();
        }
        if (ServerController.getInstance().imFinished) {
            return;
        }
        if (this.bulletRound >= 20) {
            this.bulletShootUp = true;
            return;
        }
        let bullets = SaveDataManager.getInstance().getUserData().missles;
        if (this.bulletRound > 5 && Math.random() < 0.3) {
            this.newBullet = ArrayUtil.random(bullets, 1)[0];
        } else if (this.bulletRound > 10 && Math.random() < 0.5) {
            this.newBullet = ArrayUtil.random(bullets, 1)[0];
        } else {
            this.newBullet = BulletTypeEnum.MISSILE;
        }
        if (!GameController.getInstance().isResultWaiting()) {
            SceneManager.getInstance().matchScene.setNewBullet(this.newBullet);
            SceneManager.getInstance().matchScene.startCoolDown();
        }
        // this.newBullet = BulletTypeEnum.MISSILE;

        ServerController.getInstance().uploadBullet(this.newBullet);
    }

    public shoot() {
        this.bulletList.shift();
    }

    public getOppoBulletList() {
        return this.oppoBulletList;
    }

    public getOppoNewBullet() {
        return this.oppoNewBullet;
    }

    public onUpdateOpponentNewBullet(bullet) {
        this.oppoBulletList.push(bullet);
        this.oppoNewBullet = bullet;
        if (SceneManager.getInstance().matchScene.isMyHome) {
            SceneManager.getInstance().matchScene.setNewBullet(bullet)
        }
        SceneManager.getInstance().matchScene.startCoolDown;
    }

}
