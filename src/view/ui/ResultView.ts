
class ResultView extends egret.Sprite {

    private viewBg: egret.Bitmap;




    private bullet_show: egret.TextField;
    private result_text: egret.TextField;
    private reward_text: egret.TextField;

    // private msgdata.data = {"playerName":
    // "level": , "rank", "city_score", "gold_can_rob", "attack_times", "S_rate", "success"}


    constructor() {
        super();
        this.initView();
    }

    private initView() {
        this.viewBg = new egret.Bitmap();
        this.viewBg.texture = RES.getRes("msg_png");
        // this.viewBg.width = AdaptSceenUtil.curWidth();
        this.addChild(this.viewBg);


        this.result_text = new egret.TextField;
        this.result_text.x = 40;
        this.result_text.y = 20;
        this.result_text.width = this.viewBg.width - 80;
        this.result_text.multiline = true;
        this.addChild(this.result_text);

        this.bullet_show = new egret.TextField;
        this.bullet_show.x = 40;
        this.bullet_show.visible = false;
        this.addChild(this.bullet_show);

        this.reward_text = new egret.TextField;
        this.reward_text.x = 40;
        this.addChild(this.reward_text);
    }

    public updateView(result, bullet, data = null) {
        console.log("更新结果界面" + JSON.stringify(data));
        if (data.isOpponent) {
            if (result === ResultTypeEnum.WIN) {
                this.result_text.text = i18n.getLanguage(i18n.RESULT_WIN).replace("#player", data.data.player_name).replace("#level", i18n.getLanguage(i18n.LEVEL_NAME_ + data.data.level));
                this.reward_text.visible = true;
                let continueReward = RewardController.getInstance().getRewardContinuous();
                this.reward_text.text = i18n.getLanguage(i18n.GAME_REWARD).replace("#gold", data.data.gold.toString()).replace("#continue", continueReward.toString());
                // this.bullet_show.y = this.result_text.height + 30;
            } else if (result === ResultTypeEnum.FAIL) {
                this.result_text.text = i18n.getLanguage(i18n.RESULT_LOSS).replace("#player", data.data.player_name).replace("#level", i18n.getLanguage(i18n.LEVEL_NAME_ + data.data.level));
                this.reward_text.visible = false;
            } else if (result === ResultTypeEnum.GIVE_UP) {
                this.result_text.text = i18n.getLanguage(i18n.RESULT_GIVE_UP).replace("#player", data.data.player_name).replace("#level", i18n.getLanguage(i18n.LEVEL_NAME_ + data.data.level));
                this.reward_text.visible = false;
            } else if (result === ResultTypeEnum.WIN_BUT_SLOW) {
                this.result_text.text = i18n.getLanguage(i18n.RESULT_WIN_BUT_SLOW).replace("#player", data.data.player_name).replace("#level", i18n.getLanguage(i18n.LEVEL_NAME_ + data.data.level));
                this.reward_text.visible = false;
            }
            // this.bullet_show.visible = true;
            this.result_text.text += i18n.getLanguage(i18n.BULLET_COST).replace("#bullet", bullet.toString());
            this.reward_text.y = this.result_text.height + 30;
        } else {
            if (result === ResultTypeEnum.WIN) {
                this.result_text.text = i18n.getLanguage(i18n.PUZZLE_RESULT_WIN).replace("#author", data.data.author).replace("#map", data.data.name);
                this.reward_text.visible = true;
                this.reward_text.text = i18n.getLanguage(i18n.PUZZLE_REWARD).replace("#gold", RewardController.getInstance().puzzleReward);
                this.reward_text.y = this.result_text.height + 30;
            } else if (result === ResultTypeEnum.FAIL) {
                this.result_text.text = i18n.getLanguage(i18n.PUZZLE_RESULT_LOSS).replace("#map", data.data.name);
                this.reward_text.visible = false;
            } else if (result === ResultTypeEnum.GIVE_UP) {
                this.result_text.text = i18n.getLanguage(i18n.PUZZLE_RESULT_GIVE_UP).replace("#map", data.data.name);
                this.reward_text.visible = false;
            }
        }



        // this.text.text = "攻击玩家:" + this._data.data.player_name + "\n军衔" + this._data.data.levelName + "\n弹药消耗:" + 8;

    }
}