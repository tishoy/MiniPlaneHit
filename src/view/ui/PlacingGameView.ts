class PlacingGameView extends egret.Sprite {

    private amount = 0;
    private draggingGridId = -1;
    private currentDraggingGridId = -1;
    private current_selected = 0;
    private dragging = false;
    private drag_plane: PlaneView;
    private planeList = [];
    private selectedHead = -1;

    private _gameView: GameView;

    constructor() {
        super();
        this.initView();
    }

    private initView() {
        this._gameView = new GameView(true);
        this.addChild(this._gameView);
        this._gameView.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.releaseOut, this);

        this.drag_plane = new PlaneView();
        this.drag_plane.visible = false;
        this.addChild(this.drag_plane);

    }

    public random() {

    }

    public releaseOnePlane(gridId, e: egret.TouchEvent) {
        if (!this.dragging || this.currentDraggingGridId === gridId) {
            return;
        }
        SoundManager.getInstance().playSound(SoundEnum.DROP_M4A);

        let gridView = this._gameView.gridList[this.draggingGridId] as PlacingGridView;
        let selectBodyType;
        let headGridId;
        let direction = gridView.direction;
        let bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        if (gridView.type === GridTypeEnum.BODY) {
            selectBodyType = gridView.bodyType;
            headGridId = gridId - bodyGrids[selectBodyType];
        } else {
            headGridId = gridId;
        }
        // this.addOnePlane(headGridId, direction);
        if (this.checkValid(headGridId, direction)) {
            this.removeOnePlane(this.selectedHead);
            this.addOnePlane(this.current_selected, headGridId, direction);
            this.cancelSelected();
            this._gameView.updateView();
            this.drag_plane.clearView();
        } else {
            this.cancelSelected();
        }
        this.drag_plane.visible = false;

        for (var i = 0; i < this._gameView.gridList.length; i++) {
            let grid = (this._gameView.gridList[i] as PlacingGridView);
            grid.setNoPlaneLanding();
        }
        // removeOnePlane
    }

    private checkValid(headGridId, direction) {
        let result = false;

        let dropingHeadGridView = (this._gameView.gridList[headGridId] as PlacingGridView);
        if (!MapUtil.checkHeadAndDirection(headGridId, direction)) {
            return false;
        }
        if (dropingHeadGridView.getPlaneIndex() !== 0 && dropingHeadGridView.getPlaneIndex() !== this.current_selected) {
            return result;
        }

        let bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        if (bodyGrids.length === 0) {
            return false;
        }
        for (let bodyType = 0; bodyType < bodyGrids.length; bodyType++) {
            let bodyGridView = (this._gameView.gridList[headGridId + bodyGrids[bodyType]] as PlacingGridView);
            if (bodyGridView.getPlaneIndex() !== 0 && bodyGridView.getPlaneIndex() !== this.current_selected) {
                return result;
            }
        }
        result = true;
        return result;
        // for () {

        // }
        // return false;
    }


    public movingOnePlane(gridId, e: egret.TouchEvent) {
        if (!this.dragging || this.currentDraggingGridId === gridId) {
            return;
        }

        if (!this.drag_plane.visible) {
            this.drag_plane.visible = true;
            this.drag_plane.setView(gridId);
            if (!this.contains(this.drag_plane)) {
                this.addChild(this.drag_plane);
            }
        }

        // this.drag_plane.x = this.drag_plane.y = 0;
        this.drag_plane.x = e.stageX - this.x;
        this.drag_plane.y = e.stageY - this.y;

        if (this.draggingGridId !== gridId) {
            //原始飞机的数据
            let gridView = this._gameView.gridList[this.draggingGridId] as PlacingGridView;
            let selectBodyType;
            let headGridId;
            let direction = gridView.direction;
            let bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
            let rowFromHead = DirectionTypeEnum.getRowFromHeadByDirection(direction);
            if (gridView.type === GridTypeEnum.BODY) {
                selectBodyType = gridView.bodyType;
                headGridId = gridId - bodyGrids[selectBodyType];
            } else {
                headGridId = gridId;
            }
            let planeList = [];
            planeList.push(headGridId);

            bodyGrids.forEach(element => {
                planeList.push(element + headGridId);
            });
            for (var i = 0; i < this._gameView.gridList.length; i++) {
                let id = this._gameView.gridList[i].id;
                let grid = (this._gameView.gridList[id] as PlacingGridView);
                if (planeList.indexOf(id) !== -1) {

                    if (grid.type !== GridTypeEnum.MISS) {
                        if (rowFromHead[planeList.indexOf(id)] + rowFromHead[planeList.indexOf(gridId)] === MapUtil.getYOffset(headGridId, id) + MapUtil.getYOffset(headGridId, gridId)) {
                            if (grid.getPlaneIndex() !== this.current_selected) {
                                grid.setPlaneEnable(false);
                            } else {
                                grid.setPlaneEnable(true);
                            }
                        }
                        else {
                            grid.setNoPlaneLanding();
                        }

                    } else {
                        grid.setNoPlaneLanding();
                    }

                } else {
                    grid.setNoPlaneLanding();
                }
            }

        }
    }

    public addOnePlane(index, headGridId, direction) {
        (this._gameView.gridList[headGridId] as PlacingGridView).setPlane(index, GridTypeEnum.HEAD, BodyGridEnum.UNSET, direction);
        let bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        for (let bodyType = 0; bodyType < bodyGrids.length; bodyType++) {
            (this._gameView.gridList[headGridId + bodyGrids[bodyType]] as PlacingGridView).setPlane(index, GridTypeEnum.BODY, bodyType, direction);
        }
        this.planeList.push({ head: headGridId, direction: direction });
        if (this.planeList.length == 3) {
            PlacingController.getInstance().updateMap(this.planeList);
        }
    }

    public removeOnePlane(headGridId) {
        let headGridView = (this._gameView.gridList[headGridId] as PlacingGridView);
        let direction = headGridView.direction;
        headGridView.setPlane(0, GridTypeEnum.MISS, BodyGridEnum.UNSET, DirectionTypeEnum.UNSET);
        let bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        for (let bodyType = 0; bodyType < bodyGrids.length; bodyType++) {
            (this._gameView.gridList[headGridId + bodyGrids[bodyType]] as PlacingGridView).setPlane(0, GridTypeEnum.MISS, BodyGridEnum.UNSET, DirectionTypeEnum.UNSET);
        }
        this.removeHeadFromList(headGridId);
    }

    private removeHeadFromList(headPos) {
        for (var i = 0; i < this.planeList.length; i++) {
            if (this.planeList[i].head === headPos) {
                this.planeList.splice(i, 1);
                break;
            }
        }
    }



    public selectOneGrid(gridId) {
        let gridView = this._gameView.gridList[gridId] as PlacingGridView;
        if (gridView.type === GridTypeEnum.MISS) {
            if (this.current_selected !== 0) {
                this.cancelSelected();
            }
        } else if (gridView.type === GridTypeEnum.BODY) {
            if (this.current_selected === gridView.getPlaneIndex()) {

                this.cancelSelected();
            } else {
                if (this.current_selected !== 0) {
                    this.cancelSelected();
                }
                this.selectOnePlane(gridId);
            }
        } else if (gridView.type === GridTypeEnum.HEAD) {
            if (this.current_selected === gridView.getPlaneIndex()) {

                this.cancelSelected();
            } else {
                if (this.current_selected !== 0) {
                    this.cancelSelected();
                }
                this.selectOnePlane(gridId);
            }
        }
    }

    private cancelSelected() {
        if (this.current_selected === 0) {
            return;
        }
        let plane_data = this.planeList[this.current_selected - 1];
        let headGridId = plane_data.head;
        let direction = plane_data.direction;
        let bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        (this._gameView.gridList[headGridId] as PlacingGridView).selected = false;
        for (let bodyType = 0; bodyType < bodyGrids.length; bodyType++) {
            (this._gameView.gridList[headGridId + bodyGrids[bodyType]] as PlacingGridView).selected = false;
        }
        this.dragging = false;
        this.currentDraggingGridId = -1;
        this.current_selected = 0;
    }

    public selectOnePlane(gridId) {
        this.dragging = true;
        this.draggingGridId = gridId;
        //新点击的飞机
        let gridView = this._gameView.gridList[gridId] as PlacingGridView;
        let selectBodyType;
        let headGridId;
        let direction = gridView.direction;
        let bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        if (gridView.type === GridTypeEnum.BODY) {
            selectBodyType = gridView.bodyType;
            headGridId = gridId - bodyGrids[selectBodyType];
        } else {
            headGridId = gridId;
        }

        // if (this.current_selected === 0) {
        //     selectBodyType = gridView.bodyType;
        //     direction = gridView.direction;
        //     bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        //     headGridId = gridId - bodyGrids[selectBodyType];
        //     (this.gameView.gridList[headGridId] as PlacingGridView).selected = false;
        //     for (let bodyType = 0; bodyType < bodyGrids.length; bodyType++) {
        //         (this.gameView.gridList[headGridId + bodyGrids[bodyType]] as PlacingGridView).selected = false;
        //     }
        //     this.current_selected = 0;
        // } else if (this.current_selected === gridView.getPlaneIndex()) {

        // }

        // if (this.current_selected === gridView.getPlaneIndex()) {
        //     // 点击的飞机就是当前的飞机；则取消选中

        //     return;
        // } else {
        //     this.current_selected = gridView.getPlaneIndex();

        // }


        // if (this.current_selected !== 0) {
        //     let plane_data = this.planeList[this.current_selected];
        //     headGridId = plane_data.head;
        //     direction = plane_data.direction;
        //     bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        //     (this.gameView.gridList[headGridId] as PlacingGridView).selected = true;
        //     for (let bodyType = 0; bodyType < bodyGrids.length; bodyType++) {
        //         (this.gameView.gridList[headGridId + bodyGrids[bodyType]] as PlacingGridView).selected = true;
        //     }
        // }


        (this._gameView.gridList[headGridId] as PlacingGridView).selected = true;
        for (let bodyType = 0; bodyType < bodyGrids.length; bodyType++) {
            (this._gameView.gridList[headGridId + bodyGrids[bodyType]] as PlacingGridView).selected = true;
        }
        this.current_selected = gridView.getPlaneIndex();
        this.selectedHead = headGridId;
    }
    /**
     * 旋转飞机
     */
    public rotationPlane(gridId) {
        let gridView = this._gameView.gridList[gridId] as PlacingGridView;
        if (gridView.type === GridTypeEnum.MISS) {
            return;
        }
        this.current_selected = gridView.getPlaneIndex();
        let selectBodyType;
        let headGridId;
        let direction = gridView.direction;
        let bodyGrids = DirectionTypeEnum.getGridByDirection(direction);
        if (gridView.type === GridTypeEnum.BODY) {
            selectBodyType = gridView.bodyType;
            headGridId = gridId - bodyGrids[selectBodyType];
        } else {
            headGridId = gridId;
        }
        let result = MapUtil.rotationPlane(headGridId, direction);
        let rotationed = false;
        while (result.direction !== direction) {
            if (this.checkValid(result.head, result.direction)) {
                let rotationIndex = gridView.getPlaneIndex();
                this.removeOnePlane(headGridId);
                this.addOnePlane(rotationIndex, result.head, result.direction);
                rotationed = true;
                break;
            } else {
                result = MapUtil.rotationPlane(result.head, result.direction);
            }
        }
        if (!rotationed) {
            SceneManager.getInstance().showTip(i18n.getLanguage("tip_this_place_cant_rotation"));
        }
        this.cancelSelected();
    }

    private releaseOut(e) {
        this.releaseOnePlane(this.draggingGridId, e);
    }


    public getDraggingRealHead() {
        return this.selectedHead;
    }

    public set planeAmount(value) {
        this.amount = value;
    }

    public resetView() {
        this.amount = 0;
        this.planeList = [];
        this._gameView.resetView();
    }

    public getPlaneList() {
        return this.planeList;
    }

    public get gridList() {
        return this._gameView.gridList;
    }
}