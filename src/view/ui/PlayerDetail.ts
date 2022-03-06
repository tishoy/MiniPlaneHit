/**
 * 
 */
class PlayerDetail extends egret.Sprite {
    private headIcon: WebBitmap;
    private nickName;
    private level_show: egret.TextField;

    private wordContainer: egret.Sprite;
    private wordBg: egret.Bitmap;

    constructor() {
        super();
    }

    public updateData(data: PlayerData) {
        this.level_show.text = i18n.getLanguage("level_name_" + data.level);
        this.headIcon.updateView(data.avatar);
        if (this.contains(this.nickName)) {
            this.removeChild(this.nickName);
        }
        let name = data.player_name.length > 6 ? data.player_name.slice(0, 5) + ".." : data.player_name;
        this.nickName = DrawUtil.textFilter(name, 30);
        this.nickName.x = 105 + this.nickName.width / 2;
        this.nickName.y = 25;
        this.addChild(this.nickName);
    }

    public updateLevel(data: PlayerData) {
        this.level_show.text = i18n.getLanguage("level_name_" + data.level);
    }

    public initView(data: PlayerData) {
        this.headIcon = new WebBitmap(data.avatar);
        this.headIcon.width = 80;
        this.headIcon.height = 80;
        // this.headIcon.scaleX = this.headIcon.scaleY = 0.5;
        this.addChild(this.headIcon);

        let name = data.player_name.length > 6 ? data.player_name.slice(0, 5) + ".." : data.player_name;
        this.nickName = DrawUtil.textFilter(name, 30);
        this.nickName.x = 105 + this.nickName.width / 2;
        this.nickName.y = 25;
        this.addChild(this.nickName);

        this.level_show = new egret.TextField();
        this.level_show.text = i18n.getLanguage("level_name_" + data.level);
        this.level_show.size = 30;
        this.level_show.x = 100
        this.level_show.y = this.nickName.height + 5;
        this.level_show.textAlign = egret.HorizontalAlign.LEFT;
        this.addChild(this.level_show);

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
        this.wordContainer = new egret.Sprite();
        this.wordContainer.x = -150;
        this.wordContainer.y = 100;
        this.addChild(this.wordContainer);

        this.wordBg = new egret.Bitmap;
        this.wordBg.texture = RES.getRes("talk_board_png");
        this.wordBg.y = 0;
    }

    public tellWorld(word) {
        this.wordContainer.removeChildren();

        this.wordContainer.addChild(this.wordBg);
        let textFilter = DrawUtil.textFilter(word, 30, false);
        textFilter.x = 10 + textFilter.width / 2;
        textFilter.y = 65;
        this.wordContainer.addChild(textFilter);
        egret.setTimeout(() => {
            this.wordContainer.removeChildren();
        }, this, 1500);
    }

}
