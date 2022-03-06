/**
 * 
 */
class PlaneView extends egret.Sprite {

    private grid_sheet: egret.SpriteSheet;
    private drag_index: number;

    private gridViewList = [];

    constructor() {

        super();
        this.initView();
    }

    private initView() {
        // this.planeView.texture = RES.getRes("");
        this.grid_sheet = RES.getRes("plane_sheet");
        this.drag_index = 0;
        let gridView;
        for (let i = 0; i < 10; i++) {
            gridView = new egret.Bitmap();
            this.gridViewList.push(gridView);
            this.addChild(gridView);
        }
    }

    public clearView() {

    }

    public setView(gridId) {

        let gridList = SceneManager.getInstance().placingGameView.gridList;
        let gridView = gridList[gridId] as PlacingGridView;
        this.drag_index = gridView.getPlaneIndex();
        let direction = gridView.direction;
        let bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        let movingBodyType;
        let headGridId;
        if (gridView.type === GridTypeEnum.HEAD) {
            headGridId = gridId;
        } else {
            movingBodyType = gridView.bodyType;
            headGridId = gridId - bodyGrids[movingBodyType];
        }


        this.addGrid(direction, "_H", gridId, headGridId);

        for (let bodyType = 0; bodyType < bodyGrids.length; bodyType++) {
            this.addGrid(direction, "_" + bodyType, gridId, (gridList[headGridId + bodyGrids[bodyType]] as PlacingGridView).id);
        }
    }

    private addGrid(direction, texture_fix, fromId, targetId) {

        let gridView = this.gridViewList.shift();
        gridView.texture = this.grid_sheet.getTexture(
            DirectionTypeEnum.DIRECTION_LETTER[direction] + texture_fix);
        gridView.x = -30 + 60 * MapUtil.getXOffset(fromId, targetId);
        gridView.y = -30 + 60 * MapUtil.getYOffset(fromId, targetId);
        this.gridViewList.push(gridView);
    }

    public getIndex() {
        return this.drag_index;
    }

}