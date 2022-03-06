/**
 * 
 */

class MiniGameView extends egret.Sprite {
    constructor(data) {
        super();
        this.headData = data.heads;
        this.status = data.status === undefined ? null : data.status;
        this.bullet = data.bullet === undefined ? null : data.bullet;
        this.wow = data.wow === undefined ? null : data.wow;
        this.times = data.times;
        this.date = data.date;
        this.initView();
    }

    private headData: HeadData[];

    private bg: egret.Bitmap;

    private gameView: GameView;

    private mapData: MapData;
    private date: number;
    private times: number;

    private _selected: boolean;

    private _index: number

    private status: string;
    private bullet: number;
    private wow;

    private hitTimesText: egret.TextField;

    async initView() {
        this.bg = new egret.Bitmap();
        this.bg.texture = RES.getRes("map_bg_png");
        this.addChild(this.bg);


        this.mapData = new PerfectMapData();
        await this.initData();

        if (this.status == null) {
            this.gameView = new GameView(true, this.mapData.map, false);
        } else {
            this.gameView = new GameView(false, this.mapData.map, false);
            this.gameView.preparePuzzle(this.status, this.wow);
        }

        // this.gameView.sethe
        this.gameView.anchorOffsetX = this.gameView.width / 2;
        this.gameView.anchorOffsetY = this.gameView.height / 2;
        this.gameView.scaleX = 160 / 630;
        this.gameView.scaleY = 160 / 630;
        this.gameView.x = this.bg.width / 2;
        this.gameView.y = this.bg.height / 2 - 5;
        this.addChild(this.gameView);
        // this.gameView.cacheAsBitmap = true;
        this.gameView.touchEnabled = false;
        this.gameView.touchChildren = false;
        this.gameView.cacheAsBitmap = true;

        this.hitTimesText = new egret.TextField();
        this.hitTimesText.text = DateUtil.getDateString(this.date) + "\n" + DateUtil.getTimeString(this.date);
        this.hitTimesText.size = 25;
        this.hitTimesText.x = this.width - this.hitTimesText.width - 20;
        this.hitTimesText.y = this.height;
        this.hitTimesText.textAlign = egret.HorizontalAlign.RIGHT;
        this.addChild(this.hitTimesText);
    }

    private initData() {
        for (let i = 0; i < this.headData.length; i++) {
            this.mapData.setPlaneGridByHead(this.headData[i].head, this.headData[i].direction);
        }
    }

    private updateSelected() {
        if (this._selected) {
            this.bg.texture = RES.getRes("map_bg_selected_png");
            this.scaleX = this.scaleY = 0.8;
        } else {
            this.bg.texture = RES.getRes("map_bg_png");
            this.scaleX = this.scaleY = 0.75;
        }
    }

    public getBullet() {
        return this.bullet;
    }

    public getShareTimes() {
        return this.times;
    }

    public get id() {
        return this._index;
    }

    public set id(value) {
        this._index = value;
    }

    public get selected() {
        return this._selected;
    }

    public set selected(value) {
        this._selected = value;
        this.updateSelected();
    }

    public get headId() {
        return MapUtil.headDataToHeadId(this.headData);
    }
}