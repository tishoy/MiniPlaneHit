/**
 * 玩家练习
 * 随机地图
 * creat by tishoy
 * 2019.4.12
 */
class PlacingController {
    private static instance: PlacingController = null;

    private homeMapData: MapData;

    private mapList = [];

    constructor() {
        if (PlacingController.instance) {
            throw new Error("AIController singlon error")
        }
        this.init();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new PlacingController();
        }
        return this.instance;
    }

    private init() {
        this.mapList = SaveDataManager.getInstance().getCollection();
    }

    public getCollections() {
        return this.mapList;
    }

    public shareMap() {
        if (this.heads === null) {
            return;
        }
        let id = MapUtil.headDataToHeadId(this.heads);
        platform.share("这张我精心设计的地图,你的水平肯定过不去", "", "", this.onShared, "mapId=" + id, "");

        // SaveDataManager.getInstance().getUserData().shareMap(this.heads);
    }



    public hasMap(id) {
        let result = false;
        for (var i = 0; i < this.mapList.length; i++) {
            if (this.mapList[i].id == id) {
                return true;
            }
        }
        return result;
    }

    public deleteMap(id) {
        let result = false;
        if (this.mapList.length === 1) {
            SceneManager.getInstance().showTip(i18n.getLanguage(i18n.TIP_NEED_ONE_MAP));
            return;
        }
        for (var i = 0; i < this.mapList.length; i++) {
            if (this.mapList[i].id == id) {
                this.mapList.splice(i, 1);
                result = true;
                SceneManager.getInstance().placingScene.deleteMap();
                break;
            }
        }
        if (result) {
            this.saveMap();
        }
    }

    public collectionMap(headId) {
        // let id = MapUtil.headDataToHeadId();
        let id = headId;
        if (this.hasMap(headId)) {
            SceneManager.getInstance().showTip("已经按设计布置好飞机啦,无法再布置一张重复的设计图");
            return false;
        }
        if (this.moreThanMax()) {
            SceneManager.getInstance().showTip("地图收藏不下了，看视频开发一片空地，用于扩建机场吧");
            return false;
        }
        this.mapList.push({ id: headId, using: false, date: new Date().getTime() });
        this.saveMap();
        return true;
    }

    public moreThanMax() {
        if (this.mapList.length >= SaveDataManager.getInstance().getUserData().defenseMaps) {


            // if (this.mapList.length > UserController.getInstance().collectionMax) {
            return true;
        }
        return false
    }

    public useMap(id) {
        this.mapList[id].using = true;
        this.saveMap();
    }


    public useNewMap(id) {
        if (this.hasMap(id)) {
            this.useMap(id);
            // SceneManager.getInstance().showTip("地图收藏不下了，看视频开个数据库空间吧");
        }
        if (this.moreThanMax()) {
            SceneManager.getInstance().showTip("地图收藏不下了，看视频开个数据库空间吧");
            return;
        }
        this.mapList.push({ id: id, using: true, date: new Date().getTime() });
        this.saveMap();
    }

    /**
     * 
     * 存在local
     */
    public saveMap() {
        SaveDataManager.getInstance().saveCollection(this.mapList);
    }

    private onShared() {
        EconomicsController.getInstance().addGold(300);
    }

    private heads = null;

    public useAwayMap() {
        SceneManager.getInstance().placingGameView.resetView();
        let mapdata = GameController.getInstance().getAwayData();
        this.heads = mapdata.getHeadList();
        let amount = 0;
        for (let i = 0; i < this.heads.length; i++) {
            amount++;
            SceneManager.getInstance().placingGameView.addOnePlane(amount, this.heads[i].head, this.heads[i].direction);
        }
        SceneManager.getInstance().placingGameView.planeAmount = amount;
    }

    public updateMap(list) {
        this.heads = list;
    }

    public randomMap() {
        SceneManager.getInstance().placingGameView.resetView();
        let mapdata = AIController.getInstance().generateRandomMap()
        this.heads = mapdata.getHeadList();
        let amount = 0;
        for (let i = 0; i < this.heads.length; i++) {
            amount++;
            SceneManager.getInstance().placingGameView.addOnePlane(amount, this.heads[i].head, this.heads[i].direction);
        }
        SceneManager.getInstance().placingGameView.planeAmount = amount;
    }

    public selectedSharedMap(map) {
        SceneManager.getInstance().placingGameView.resetView();
        let amount = 0;
        map.headData.forEach(head => {
            amount++;
            SceneManager.getInstance().placingGameView.addOnePlane(amount, head.head, head.direction);
        });

        // SceneManager.getInstance().placingGameView.gameView.updateWithData(map);
        SceneManager.getInstance().placingGameView.planeAmount = 3;

        // SceneManager.getInstance().placingGameView.msgView.shareTimes = map.getShareTimes();
    }

    public getHomeMapData(gridId) {
        return this.homeMapData.map[gridId].gridType;
    }

    public setHomeMapData(gridId, type) {
        this.homeMapData.map[gridId].gridType = type;
    }

    public get mapId() {
        // this.heads = this.homeMapData.getHeadList();
        return MapUtil.headDataToHeadId(this.heads);
    }
}