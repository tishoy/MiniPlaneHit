/**
 * 
 */
class AwayGameMsgView extends egret.Sprite {

    private MAP_INFO = "map_info";
    private HIT_INFO = "hit_info";
    private REWARD_INFO = "reward_info";
    private BANNER_INFO = "banner_info";
    private GUIDE_INFO = "guide_info";

    private viewBg: egret.Bitmap;

    private msgContainer: egret.Sprite;

    private nameText: egret.TextField;
    private levelText: egret.TextField;


    private msgKey = ["playerName", "排名", "城镇积分", "可掠夺金币", "被进攻次数", "S率", "摧毁炮数"];
    private msgValue = [];

    private status;

    // private msgData = {"playerName":
    // "level": , "rank", "city_score", "gold_can_rob", "attack_times", "S_rate", "success"}

    private opponentData;

    constructor() {
        super();
        this.initView();
    }

    private initView() {
        this.viewBg = new egret.Bitmap();
        this.viewBg.texture = RES.getRes("msg_png");
        // this.viewBg.width = AdaptSceenUtil.curWidth();
        this.addChild(this.viewBg);

        this.msgContainer = new egret.Sprite();
        this.addChild(this.msgContainer);

        this.bullet_text = new egret.TextField();
        this.bullet_text.x = 20;
        this.bullet_text.y = 10;
        this.msgContainer.addChild(this.bullet_text);


        this.reward_text = new egret.TextField();
        // this.reward_text.text = RewardController.getInstance().roundReward();
        this.reward_text.x = 20;
        this.reward_text.y = 10 + this.bullet_text.y + this.bullet_text.height;
        this.msgContainer.addChild(this.reward_text);

        this.guide_text = new egret.TextField();
        this.guide_text.width = this.viewBg.width - 40;
        this.guide_text.multiline = true;
        this.guide_text.x = 20;
        this.guide_text.y = 10;
        this.msgContainer.addChild(this.guide_text);

        this.guide_help_text = new egret.TextField();
        this.guide_help_text.width = this.viewBg.width - 40;
        this.guide_help_text.multiline = true;
        this.guide_help_text.x = 20;
        this.msgContainer.addChild(this.guide_help_text);

        // let text: egret.TextField;
        // let textWidth: number;
        // for (let i = 0; i < this.msgKey.length; i++) {
        //     text = new egret.TextField();
        //     text.text = this.getPlayerData(this.msgKey[i]);
        //     text.x = 20 + Math.floor(i % 2) * AdaptSceenUtil.curWidth() / 2;
        //     text.y = 10 + Math.floor(i / 2) * text.height;

        //     textWidth = text.width;
        //     this.msgContainer.addChild(text);
        //     text = new egret.TextField();
        //     // text.text = this.getPlayerData(this.msgValue[i]);
        //     text.x = textWidth + 20 + Math.floor(i % 2) * AdaptSceenUtil.curWidth() / 2;
        //     text.y = 10 + Math.floor(i / 2) * text.height;
        //     this.msgContainer.addChild(text);

        // }
    }

    private guide_text: egret.TextField;
    private bullet_text: egret.TextField;
    private reward_text: egret.TextField;
    private guide_help_text: egret.TextField;

    public updateView(level = 0) {
        this.msgContainer.removeChildren();
        if (this.status === this.GUIDE_INFO) {
          

        } else if (this.status === this.HIT_INFO) {
            this.bullet_text.text = "使用炮数:" + RecordController.getInstance().round + "/" + Const.getInstance().winBullets;

        } else if (this.status === this.MAP_INFO) {
            if (level === 0) {

            } else {
                let text: egret.TextField;
                let textWidth: number;
                this.msgKey[0] = "随机玩家";
                this.msgValue = [level.toString() + "级", Math.floor(Math.random() * Math.pow(10, 8 - level)), Math.floor(level * 100 * Math.random()), Math.floor(level * 100 * Math.random()) * 10, Math.floor(level * 100 * Math.random()), (40 + (Math.random() * 20)).toFixed(2) + "%", Math.floor((Math.random()) * 11) + 8]

                for (let i = 0; i < this.msgKey.length; i++) {
                    text = new egret.TextField();
                    text.text = this.msgKey[i] + ":";
                    text.x = 20 + Math.floor(i % 2) * this.viewBg.width / 2;
                    text.y = 10 + Math.floor(i / 2) * text.height;

                    textWidth = text.width;
                    this.msgContainer.addChild(text);
                    text = new egret.TextField();
                    text.text = this.msgValue[i];
                    text.x = textWidth + 20 + Math.floor(i % 2) * this.viewBg.width / 2;
                    text.y = 10 + Math.floor(i / 2) * text.height;
                    this.msgContainer.addChild(text);

                }
            }
        } else if (this.status === this.REWARD_INFO) {
            this.reward_text.text = "获得奖励:";
        }

    }

    public resetMsgViewStatus(level, isGuide) {
        if (isGuide) {
            this.status = this.GUIDE_INFO;
        } else {
            this.status = this.MAP_INFO;
        }
        this.updateView(level);
    }

    public showHitInfo() {
        this.status = this.HIT_INFO;
        this.updateView();
    }

    public showRewardInfo() {
        this.status = this.REWARD_INFO;
        this.updateView();
    }

    public showBannerInfo() {
        this.status = this.BANNER_INFO;
        this.updateView();
    }

    public showGuideInfo() {
        this.status = this.GUIDE_INFO;
        this.updateView();
    }

    private getPlayerData(key) {
        if (key.indexOf("msg") !== -1) {
            return this.opponentData[key]
        }
        return key;
    }
}