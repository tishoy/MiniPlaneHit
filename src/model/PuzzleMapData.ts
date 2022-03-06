class PuzzleMapData extends MapData {
    constructor() {
        super();
    }

    public setKnownGrid() {

    }

    public getKnownGrid() {

    }

    public getBulletAmount() {

    }

    public setBulletAmount() {

    }

    public knownHeadGrid = [];
    public knownBodyGrid = [];
    public knownMissGrid = [];

    public resetPlane(headData, index) {
        if (this.getMapGridById(headData.head).gridType == GridTypeEnum.AI_TEMPHEAD) {
            this.setMapGridTypeByValue(headData.head, GridTypeEnum.MISS);
        }
        let list = DirectionTypeEnum.getGridByDirection(headData.direction);
        for (let i = 0; i < list.length; i++) {
            if (this.getMapGridById(list[i] + headData.head).gridType == GridTypeEnum.AI_KNOWNTEMPBODY1 + index) {
                this.setMapGridTypeByValue(list[i] + headData.head, GridTypeEnum.AI_KNOWNBODY);
            }
            if (this.getMapGridById(list[i] + headData.head).gridType == GridTypeEnum.AI_TEMPBODY1 + index) {
                this.setMapGridTypeByValue(list[i] + headData.head, GridTypeEnum.MISS);
            }
        }
    }

    public initStatusByList(types, status) {
        // let value = Number(status.slice(i, i + 2));
        // if (types == GridTypeEnum.HEAD) {
        //     this.knownHeadGrid.push(status);
        //     this.setMapGridTypeByValue(status, GridTypeEnum.AI_KNOWNHEAD);
        // } else if (types == GridTypeEnum.BODY) {
        //     this.knownBodyGrid.push(status);
        //     this.setMapGridTypeByValue(status, GridTypeEnum.AI_KNOWNBODY);
        // } else if (types == GridTypeEnum.MISS) {
        //     this.knownMissGrid.push(status);
        //     this.setMapGridTypeByValue(status, GridTypeEnum.AI_KNOWNMISS);
        // }
        // return;
        for (let i = 0; i < status.length; i++) {
            // let value = Number(status.slice(i, i + 2));
            let value = status[i];
            if (types[i] == GridTypeEnum.HEAD) {
                this.knownHeadGrid.push(value);
                this.setMapGridTypeByValue(value, GridTypeEnum.AI_KNOWNHEAD);
            } else if (types[i] == GridTypeEnum.BODY) {
                this.knownBodyGrid.push(value);
                this.setMapGridTypeByValue(value, GridTypeEnum.AI_KNOWNBODY);
            } else if (types[i] == GridTypeEnum.MISS) {
                this.knownMissGrid.push(value);
                this.setMapGridTypeByValue(value, GridTypeEnum.AI_KNOWNMISS);
            }
        }
    }

    public initStatus(data, status) {
        for (let i = 0; i < status.length; i = i + 2) {
            let value = Number(status.slice(i, i + 2));
            if (data.getMapGridById(value).gridType == GridTypeEnum.HEAD) {
                this.knownHeadGrid.push(value);
                this.setMapGridTypeByValue(value, GridTypeEnum.AI_KNOWNHEAD);
            } else if (data.getMapGridById(value).gridType == GridTypeEnum.BODY) {
                this.knownBodyGrid.push(value);
                this.setMapGridTypeByValue(value, GridTypeEnum.AI_KNOWNBODY);
            } else if (data.getMapGridById(value).gridType == GridTypeEnum.MISS) {
                this.knownMissGrid.push(value);
                this.setMapGridTypeByValue(value, GridTypeEnum.AI_KNOWNMISS);
            }
        }
    }

    public checkAllBodyIsUsed() {
        for (let i = 0; i < this.knownBodyGrid.length; i++) {
            if (this.getMapGridById(this.knownBodyGrid[i]).gridType == GridTypeEnum.AI_KNOWNBODY) {
                return false;
            }
        }
        return true;
    }

    public checkMapValid(headList) {
        if (headList.length === 3) {
            for (let i = 0; i < headList.length; i++) {
                if (!this.setPlaneGridByHead(headList[i].head, headList[i].direction)) {
                    return false;
                }
            }
            return true;
        } else {
            throw new Error("headDataError");
        }
    }

    setPlaneGridByHead(headValue: number, direction: number, index = 0): boolean {
        return this.setPlaneGrid(headValue % 9, Math.floor(headValue / 9), direction, index);
    }

    checkValid(headColumn: number, headRow: number, direction: number): boolean {

        if (this.getMapGridByXY(headColumn, headRow).gridType == GridTypeEnum.MISS || this.getMapGridByXY(headColumn, headRow).gridType == GridTypeEnum.AI_KNOWNHEAD) {
            var headPos: number = headRow * this.columns + headColumn;
            var plane: number[] = DirectionTypeEnum.getGridByDirection(direction);
            for (var i = 0; i < plane.length; i++) {
                if (MapUtil.gridValid(headPos + plane[i])) {
                    if (this.getMapGridById(headPos + plane[i]).gridType == GridTypeEnum.MISS || this.getMapGridById(headPos + plane[i]).gridType == GridTypeEnum.AI_KNOWNBODY) {
                        continue;
                    } else {
                        return false;
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    }


    setPlaneGrid(headColumn: number, headRow: number, direction: number, index = 0): boolean {
        //先检查该飞机能否加入。
        if (!this.checkValid(headColumn, headRow, direction)) {
            return false;
        }
        //        if (this.numPlane == 0) {
        //            //再检查飞机是否是badPlane
        //            this.hasBadPlane = !this.checkForThreePlane(headColumn, headRow, direction);
        //        }
        //        if (this.numPlane == 1 && this.hasBadPlane) {
        //            //再检查飞机是否是badPlane
        //            if (!this.checkForThreePlane(headColumn, headRow, direction)) {
        //                return false;
        //            }
        //        }
        // if (this.numPlane == 1) {
        //     //再检查飞机是否是badPlane
        //     if (!this.checkForThreePlane(headColumn, headRow, direction)) {
        //         return false;
        //     }
        // }
        var headPos: number = this.columns * headRow + headColumn;
        if (this.getMapGridById(headPos).gridType == GridTypeEnum.MISS) {
            this.setMapGridTypeByValue(headPos, GridTypeEnum.AI_TEMPHEAD);
        }
        var plane: number[] = DirectionTypeEnum.getGridByDirection(direction);
        for (var i = 0; i < plane.length; i++) {
            if (this.getMapGridById(headPos + plane[i]).gridType == GridTypeEnum.MISS) {
                this.setMapGridTypeByValue(headPos + plane[i], GridTypeEnum.AI_TEMPBODY1 + index);
            } else if (this.getMapGridById(headPos + plane[i]).gridType == GridTypeEnum.AI_KNOWNBODY) {
                this.setMapGridTypeByValue(headPos + plane[i], GridTypeEnum.AI_KNOWNTEMPBODY1 + index);
            }

        }
        // this.headList.push({ "head": headPos, "direction": direction });
        return true;
    }
}