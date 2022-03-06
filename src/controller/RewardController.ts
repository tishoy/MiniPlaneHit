/**
 * 攻击奖励反馈
 * creat by tishoy
 * 2019.4.12
 */
class RewardController {
    private static instance: RewardController = null;

    private rewardList = [];

    constructor() {
        if (RewardController.instance) {
            throw new Error("AIController singlon error")
        }
        this.init();
    }

    private missRewardTimes = 0;
    // private continuousReward;

    private init() {

    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new RewardController();
        }
        return this.instance;
    }

    public reset() {
        this.missRewardTimes = 0;
    }

    public roundReward() {
        return this.hitReward;
    }

    private rewardContinuous = 0;
    private rewardMoreHit = 0;
    private rewardContinuousKill = 0;

    public continuousReward() {
        switch (RecordController.getInstance().continuousType) {
            case GridTypeEnum.MISS:
                break;

            case GridTypeEnum.BODY:
                let continuousTimes = RecordController.getInstance().continuousTimes;
                if (continuousTimes >= RewardTitleEnum.HOLY_SHIT) {
                    SceneManager.getInstance().showTip("十连击");
                    platform.analytics("rewardTitle", { type: "HOLY_SHIT" });
                } else if (continuousTimes === RewardTitleEnum.GOD_LIKE) {
                    SceneManager.getInstance().showTip("九连击");
                    platform.analytics("rewardTitle", { type: "GOD_LIKE" });
                } else if (continuousTimes === RewardTitleEnum.MONSTER_KILL) {
                    SceneManager.getInstance().showTip("八连击");
                    platform.analytics("rewardTitle", { type: "MONSTER_KILL" });
                } else if (continuousTimes === RewardTitleEnum.WICKED_SICK) {
                    SceneManager.getInstance().showTip("七连击");
                    platform.analytics("rewardTitle", { type: "WICKED_SICK" });
                } else if (continuousTimes === RewardTitleEnum.UNSTOPPABLE) {
                    SceneManager.getInstance().showTip("六连击");
                    platform.analytics("rewardTitle", { type: "UNSTOPPABLE" });
                } else if (continuousTimes === RewardTitleEnum.MEGA_KILL) {
                    SceneManager.getInstance().showTip("五连击");
                    platform.analytics("rewardTitle", { type: "MEGA_KILL" });
                } else if (continuousTimes === RewardTitleEnum.DOMANATING) {
                    SceneManager.getInstance().showTip("四连击");
                    platform.analytics("rewardTitle", { type: "DOMANATING" });
                } else if (continuousTimes === RewardTitleEnum.KILLING_SPREE) {
                    SceneManager.getInstance().showTip("三连击");
                    platform.analytics("rewardTitle", { type: "KILLING_SPREE" });
                }
                this.rewardContinuous = this.rewardContinuous < continuousTimes ? continuousTimes : this.rewardContinuous;
        }
    }

    public hitReward(hitResult: number[]) {
        let hitNumber = hitResult.filter((element) => {
            return element !== GridTypeEnum.MISS;
        }).length;
        if (hitNumber === 0) {
            this.missReward();
            return;
        }
        let headNumber = hitResult.filter((element) => {
            return element === GridTypeEnum.HEAD;
        }).length;



        if (headNumber > 0) {
            this.headReward(headNumber)
        }
        if (hitNumber >= 5) {
            this.ranmpage(hitNumber);
        }
        switch (hitNumber) {
            case RewardTitleEnum.DOUBLE_KILL:
                this.doubleHit();
                platform.analytics("rewardTitle", { type: "DOUBLE_KILL" });
                break;

            case RewardTitleEnum.TRIPLE_KILL:
                this.tripleHit();
                platform.analytics("rewardTitle", { type: "TRIPLE_KILL" });
                break;

            case RewardTitleEnum.ULTRAKILL:
                this.ultraHit();
                platform.analytics("rewardTitle", { type: "ULTRAKILL" });
                break;
        }
        this.rewardMoreHit = this.rewardMoreHit < hitNumber ? hitNumber : this.rewardMoreHit;
    }

    public headReward(headNumber) {
        switch (headNumber) {
            case RewardTitleEnum.DOUBLE_KILL:
                this.doubleKill();
                platform.analytics("rewardTitle", { type: "DOUBLE_KILL" });
                break;
            case RewardTitleEnum.TRIPLE_KILL:
                this.tripleKill();
                platform.analytics("rewardTitle", { type: "TRIPLE_KILL" });
                break;
            default:
                this.planeKill();
                break;
        }
        this.rewardContinuousKill = headNumber;
    }

    public isMissReward(): boolean {
        let missTime = RecordController.getInstance().missTimes;
        return Math.random() < (0.2 * missTime - 0.5 * this.missRewardTimes);
    }

    public missReward(): number {
        return;
        if (!this.isMissReward()) {
            return;
        }
        // SceneManager.getInstance().showTip("获得宝箱");

        switch (Math.floor(Math.random() * 2)) {
            case 1:
                let reward = 0;
                platform.analytics("missReward", { bullet: -1, gold: reward });
                SceneManager.getInstance().showTip("获得宝箱,金币奖励" + reward);
            case 2:
                let bullet = Math.floor(Math.random() * BulletTypeEnum.COUNT);
                platform.analytics("missReward", { bullet: bullet, gold: 0 });
                SceneManager.getInstance().showTip("获得宝箱,炮弹奖励" + i18n.getLanguage("ui_bullet_" + bullet));
                BulletController.getInstance().rewardOneBullet(bullet)
                break;
            case 3:
                break;
        }

        return;
    }

    public planeKill() {
        SceneManager.getInstance().showTip("击中飞机头");
    }

    public doubleKill() {
        SceneManager.getInstance().showTip("爆头连击");
    }

    public tripleKill() {
        SceneManager.getInstance().showTip("爆头连击");
    }

    public doubleHit() {
        SceneManager.getInstance().showTip("同时击中");
    }

    public tripleHit() {
        SceneManager.getInstance().showTip("同时击中");

    }

    public ultraHit() {
        SceneManager.getInstance().showTip("同时击中");

    }

    public ranmpage(hitNumber) {
        SceneManager.getInstance().showTip("同时击中");

    }

    public balloonReward(double = false) {
        if (double) {
            SceneManager.getInstance().showTip("领取气球奖励,获得60000金币");
            platform.analytics("balloonReward", { double: true })
            EconomicsController.getInstance().addGold(60000);
        } else {
            SceneManager.getInstance().showTip("领取气球奖励,获得30000金币");
            platform.analytics("balloonReward", { double: false })
            EconomicsController.getInstance().addGold(30000);
        }
    }

    public getRewardContinuous() {
        return this.rewardContinuous * 500 + this.rewardMoreHit * 100
    }

    public gameReward(double = false) {

        if (GameController.getInstance().currentOpponent !== null) {
            let rob = GameController.getInstance().currentOpponent.gold;
            let reward = this.rewardContinuous * 500 + this.rewardMoreHit * 100 + rob;
            if (double) {
                EconomicsController.getInstance().addGold(2 * reward);
            } else {
                EconomicsController.getInstance().addGold(reward);
            }
        } else {
            if (double) {
                EconomicsController.getInstance().addGold(2 * this.puzzleReward);
            } else {
                EconomicsController.getInstance().addGold(this.puzzleReward);
            }
        }

    }

    public get puzzleReward() {
        return 4000;
    }
}