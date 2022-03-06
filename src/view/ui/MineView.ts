/**
 * 
 */
class MineView extends egret.Sprite {

    private viewBg: egret.Bitmap;

    private msgContainer: egret.Sprite;

    // private nameText: egret.TextField;
    // private levelText: egret.TextField;


    private msgKey = ["playerName", "排名", "城镇积分", "可掠夺金币", "被进攻次数", "S率", "摧毁炮数"];
    private msgValue = [];

    private level_title: egret.TextField;
    private total_game_show: egret.TextField;
    private game_rate_show: egret.TextField;
    private bullet_show: egret.TextField;
    private total_puzzle_show: egret.TextField;
    private puzzle_rate_show: egret.TextField;
    private playerDetail: PlayerDetail;

    private status;

    // private msgData = {"playerName":
    // "level": , "rank", "city_score", "gold_can_rob", "attack_times", "S_rate", "success"}

    private opponentData;

    constructor() {
        super();
        this.initView();
    }

    private initView() {

        let data = PlayerController.getInstance().getData();

        this.viewBg = new egret.Bitmap();
        this.viewBg.texture = RES.getRes("msg_png");
        this.viewBg.width = AdaptSceenUtil.curWidth() - 10
        this.viewBg.height = (AdaptSceenUtil.curHeight() - AdaptSceenUtil.y_fix() * 2) / 2 - 340;
        // this.viewBg.width = AdaptSceenUtil.curWidth();
        this.addChild(this.viewBg);




        this.playerDetail = SceneManager.getInstance().myPlayerDetail;
        this.playerDetail.x = 165;
        this.playerDetail.y = 15;
        this.addChild(this.playerDetail);

        // let headIcon = new WebBitmap(this._data.avatar);
        // headIcon.width = 160;
        // headIcon.height = 160;
        // headIcon.x = 165;
        // headIcon.y = 15;
        // headIcon.scaleX = headIcon.scaleY = 0.5;
        // this.addChild(headIcon);

        // let nickName = DrawUtil.textFilter(this._data.player_name, 30);
        // nickName.x = 270 + nickName.width / 2;
        // nickName.y = 40;
        // this.addChild(nickName);

        // this.msgContainer = new egret.Sprite();
        // this.msgContainer.x = 200;
        // this.msgContainer.y = 20;
        // this.addChild(this.msgContainer);

        // PlayerController.getInstance().setUpPlayerData();

        // let stars = new 
        // this.level_title = new egret.TextField();
        // this.level_title.text = "军衔:"
        // this.level_title.size = 30;
        // this.level_title.x = 160
        // this.level_title.y = 10;
        // this.addChild(this.level_title);

        // this.level_show = new egret.TextField();
        // this.level_show.text = i18n.getLanguage("level_name_" +data.level);
        // this.level_show.size = 30;
        // this.level_show.x = 265
        // this.level_show.y = nickName.height + 20;
        // this.level_show.textAlign = egret.HorizontalAlign.LEFT;
        // this.addChild(this.level_show);

        this.level_title = new egret.TextField();
        this.addChild(this.level_title);

        this.total_game_show = new egret.TextField();
        this.total_game_show.text = "游戏局数: " + data.total_game + "局," + "胜率: " + data.Srate;
        this.total_game_show.size = 25;
        this.total_game_show.x = 140;
        this.total_game_show.y = 110;
        this.addChild(this.total_game_show);

        // this.game_rate_show = new egret.TextField();
        // this.game_rate_show.text = ;
        // this.game_rate_show.x = 120 + this.total_game_show.width;
        // this.game_rate_show.y = 90;
        // this.addChild(this.game_rate_show);

        this.bullet_show = new egret.TextField();
        this.bullet_show.text = "平均弹药消耗: " + data.misslePerGame;
        this.bullet_show.size = 25;
        this.bullet_show.x = 140;
        this.bullet_show.y = 140;
        this.addChild(this.bullet_show);

        this.total_puzzle_show = new egret.TextField();
        this.total_puzzle_show.text = "战术研究: " + data.total_puzzle + "局," + "胜率: " + data.Prate;
        this.total_puzzle_show.size = 25;
        this.total_puzzle_show.x = 140;
        this.total_puzzle_show.y = 170;
        this.addChild(this.total_puzzle_show);

        // this.puzzle_rate_show = new egret.TextField();
        // this.puzzle_rate_show.text = ;
        // this.puzzle_rate_show.x = 120 + this.total_puzzle_show.width;
        // this.puzzle_rate_show.y = 170;
        // this.addChild(this.puzzle_rate_show);

        // this.msgContainer.addChild(this.text);

    }


    public updateView(level = 0) {
        let data = PlayerController.getInstance().getData();
        // this.level_show.text = i18n.getLanguage("level_name_" +data.level);
        this.playerDetail.updateLevel(data)
        this.total_game_show.text = "飞机局数: " + data.total_game + "局," + "胜率: " + data.Srate;
        // this.game_rate_show.text =;
        this.bullet_show.text = "平均弹药消耗: " + data.misslePerGame;
        this.total_puzzle_show.text = "战术研究: " + data.total_puzzle + "局," + "胜率: " + data.Prate;
        // this.puzzle_rate_show.text = ;
    }

    public showPlayerDetail() {
        this.playerDetail.x = 165;
        this.playerDetail.y = 15;
        this.playerDetail.visible = true;
        this.addChild(this.playerDetail);
    }
}