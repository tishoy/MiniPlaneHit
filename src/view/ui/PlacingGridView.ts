/**
 * 
 */
class PlacingGridView extends GridView {

    private _bodyType = BodyGridEnum.UNSET;
    private _direction = DirectionTypeEnum.UNSET;
    private _planeIndex = 0;

    private helpView: egret.Bitmap;


    constructor(id) {
        super(id);
        this.helpView = new egret.Bitmap();
        this.helpView.width = 60;
        this.helpView.height = 60;
        this.helpView.texture = RES.getRes("help_png");
        this.addChild(this.helpView);
    }



    public get direction() {
        return this._direction;
    }

    public getPlaneIndex() {
        return this._planeIndex;
    }

    public get bodyType() {
        return this._bodyType;
    }

    public updateView() {
        if (this._type === GridTypeEnum.HEAD) {
            this.gridView.texture = this.grid_sheet.getTexture(
                DirectionTypeEnum.DIRECTION_LETTER[this._direction] + "_H");
        } else if (this._type === GridTypeEnum.BODY) {
            this.gridView.texture = this.grid_sheet.getTexture(
                DirectionTypeEnum.DIRECTION_LETTER[this._direction] + "_" + this._bodyType);
        } else {
            this.gridView.texture = null;
        }
    }


    public resetView() {
        this._planeIndex = 0;
        this._type = GridTypeEnum.MISS;
        this._bodyType = BodyGridEnum.UNSET;
        this._direction = DirectionTypeEnum.UNSET;
        this.gridView.texture = null;
        this.updateView();
    }

    public setPlane(index, type, bodyType, direction) {
        this._planeIndex = index;
        this._direction = direction;
        this._bodyType = bodyType;
        this._type = type;
        this.updateView();
    }

    public set selected(value) {
        if (value) {
            DrawUtil.setImageColor(this.gridView, 0x888888);
        } else {
            DrawUtil.setImageColor(this.gridView, 0xffffff);
        }
    }

    public setPlaneEnable(enable = true) {
        if (enable) {
            DrawUtil.setImageColor(this.gridView, 0x00ff00);
        } else {
            DrawUtil.setImageColor(this.gridView, 0xff0000);
        }
    }

    public setNoPlaneLanding() {
        DrawUtil.setImageColor(this.gridView, 0xffffff);
    }

}