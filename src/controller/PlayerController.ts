/**
 * 用户管理
 * create by tishoy
 * 2021.4.25
 */
class PlayerController {
    private static instance: PlayerController = null;

    private opponentData: PlayerData;

    private levels = [];
    private _data: PlayerData = null;

    private myMap: MapData;
    private opponentMap: MapData;

    private _userInfo;

    constructor() {
        if (PlayerController.instance) {
            throw new Error("UserController singlon error")
        }
    }

    public init() {
        this.initLevelData();
        this.opponentData = new PlayerData();
        this.myMap = new MapData();
        this.opponentMap = new MapData();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new PlayerController();
        }
        return this.instance;
    }

    private async initLevelData() {
        let levelData = await RES.getRes(ResourceManager.LEVEL_JSON);
        for (var i = 0; i < levelData.length; i++) {
            this.levels.push(new LevelData(levelData[i]));
        }
    }

    public setUpPlayerData() {
        if (SaveDataManager.getInstance().getFromLocal("playerData") == undefined || SaveDataManager.getInstance().getFromLocal("playerData") == "") {
            this._data = AIController.getInstance().newPlayer();
            this._data.player_name = (this._userInfo == undefined || this._userInfo["nickName"] == undefined) ? "无名小卒" : this._userInfo["nickName"];
            this._data.avatar = (this._userInfo == undefined || this._userInfo["avatarUrl"] == undefined) ? "" : this._userInfo["avatarUrl"];
            this._data.savePlayerData();
        } else {
            let player = JSON.parse(SaveDataManager.getInstance().getFromLocal("playerData"));
            this._data = new PlayerData();
            this._data.setData(player);
            if (this._userInfo == undefined) {

            } else if (this._data.player_name != this._userInfo["nickName"] || this._data.avatar != this._userInfo["avatarUrl"]) {
                this._data.player_name = this._userInfo["nickName"];
                this._data.avatar = this._userInfo["avatarUrl"];
                this._data.savePlayerData();
            }
        }
        SceneManager.getInstance().myPlayerDetail.initView(this._data);
        SceneManager.getInstance().oppoPlayerDetail.initView(AIController.getInstance().robotPlayer());
    }

    public getData(): PlayerData {
        if (!this._data) {
            this.setUpPlayerData();
        }
        return this._data;
    }

    /**
     * 注册新用户
     * 服务器功能
     */
    public registPlayer() {

    }

    public levelUp() {
        for (let i = this._data.level > 0 ? this._data.level : 0; this.levels.length; i++) {
            if (this.levels[i].isGotThisLevel(this._data)) {
                this._data.level = this.levels[i].level;
            } else {
                break;
            }
        }
    }

    public playGame(isWin, missle) {
        this._data.total_game++;
        if (isWin) this._data.win_game++;
        this.levelUp();
        this._data.missle += missle;
        SceneManager.getInstance().techScene.msgView.updateView();
        this._data.savePlayerData();
    }

    public playPuzzle(isWin, puzzle) {
        this._data.total_puzzle++;
        if (isWin) this._data.win_puzzle++;
        this.levelUp();
        SceneManager.getInstance().techScene.msgView.updateView();
        this._data.savePlayerData();
    }

    public defense() {

    }

    public set userInfo(value) {
        this._userInfo = value;
    }

    //    对战功能


    public setOpponentData(data) {
        this.opponentData.setData(data);
        SceneManager.getInstance().updateOppoDetail(this.opponentData);
    }

    public setOpponentUserInfo(info) {
        this.opponentData.player_name = info.nickName;
        this.opponentData.avatar = info.avatarUrl;
    }

    public get currentOpponent() {
        return this.opponentData;
    }

    public setUserInfo(isNew, info, code) {
        this.userInfo = info;
        if (isNew) {
            NetWorkManager.playerRegist(info, platform.name, code);
        } else {
            // 不做登录记录
            // NetWorkManager.playerLogin(platform.name, code);
        }
    }


    public setMyMap(list) {
        this.myMap.clear();
        for (let i = 0; i < 3; i++) {
            this.myMap.setPlaneGridByHead(list[i].head, list[i].direction);
        }
        if (ServerController.getInstance().oppoIsRobot) {
            AIController.getInstance().camputeRobotHitList();
        }
    }

    public setOpponentMap(list) {
        this.opponentMap.clear();
        for (let i = 0; i < 3; i++) {
            this.opponentMap.setPlaneGridByHead(list[i].head, list[i].direction);
        }
    }

    public getMyMap() {
        return this.myMap;
    }

    public getOppoMap() {
        return this.opponentMap;
    }




    public getStoredOpponent() {
        // let im = this._data.openId;
        // NetWorkManager.send({protocol : NetWorkManager.PLAYER_GET_PLAYER, im: })
    }
}