/**
 * 
 */
class PerfectMapData extends MapData {

    constructor() {
        super();
        this.numPlane = 3;
    }

    public setPlaneByHeadData() {
        if (this.headList.length === 3) {
            for (let i = 0; i < this.headList.length; i++) {
                this.setPlaneGridByHead(this.headList[i].head, this.headList[i].direction);
            }
        } else {
            throw new Error("headDataError");
        }
    }

}