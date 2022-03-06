class NetWorkManager {
    // public static SERVER_ADDRESS = "http://192.168.0.140:1337/parse/functions/";
    public static SERVER_ADDRESS = "https://server.18game.cloud/parse/functions/";
    // public static 

    public static send(func, data) {
        const httpRequest = new egret.HttpRequest();
        httpRequest.setRequestHeader('X-Parse-Application-Id', 'wsplane');
        httpRequest.open(this.SERVER_ADDRESS + func + "?data=" + JSON.stringify(data), egret.HttpMethod.POST);
        httpRequest.addEventListener(egret.Event.COMPLETE, NetWorkManager.onGetComplete, this);
        httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, NetWorkManager.onGetIOError, this);
        httpRequest.addEventListener(egret.ProgressEvent.PROGRESS, NetWorkManager.onGetProgress, this);
        httpRequest.send();
    }

    private static onGetComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        egret.log("get data : ", request.response);
        switch (request.response.func) {
            case this.PLAYER_GET_OPPO:
                this.onOpponentGet(request.response.oppo);
                break;
        }
    }

    private static onGetIOError(event: egret.IOErrorEvent): void {
        egret.log("get error : " + JSON.stringify(event));
    }

    private static onGetProgress(event: egret.ProgressEvent): void {
        egret.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    }

    /**
     * 用户注册
     */
    public static playerRegist(info, platform, code) {
        let data = {
            platform: platform,
            userInfo: info,
            code: code
        }
        this.send(this.PLAYER_REGIST, data);
    }

    public static playerLogin(platform, code) {
        let data = {
            platform: platform,
            code: code
        }
        this.send(this.PLAYER_REGIST, data);
    }

    public static randomOpponent(platform) {
        let data = {
            platform: platform,
        }
        this.send(this.PLAYER_REGIST, data);
    }

    public static onOpponentGet(oppo) {
        let oppoData = JSON.parse(oppo);
        let info = {
            avatar: oppoData.avatar,
            nickName: oppoData.nickName
        }
        PlayerController.getInstance().setOpponentUserInfo(info);
    }

    public static uploadMap(id, pass, bullet) {
        let data = {
            mapId: id,
            pass: pass,
            bullet: bullet
        }
        this.send(this.MAP_UPLOAD, data);
    }


    /**
     * params
     * [platform, pUId]
     * 
     * return
     * {userId userData}
     */
    // 数据中有该用户，则会将数据返回
    public static PLAYER_REGIST = "player_regist";

    /**
     * 
     * return
     * session
     */
    public static PLAYER_LOGIN = "player_login";

    /**
     * params
     * [platform, pUId]
     * 
     * return
     * {userId userData}
     */
    public static PLAYER_GET_OPPO = "player_get_oppo";

    /**
     * params
     * [userId, mapId]
     * 
     * return
     * array
     */
    public static MAP_UPLOAD = "map_upload";

    /**
     * 玩地图
     * params
     * [id]
     * [number]
     */
    public static MAP_PLAY = "map_play";

    /**
     * 地图结果
     * params
     * [id, attacked, loss, bullet]
     * [number, number, number, number]
     * [,,地图失守次数,胜利总炮数]
     */
    public static MAP_RESULT = "map_result";

    /**
     * 获取某地图信息
     * params
     * [id]
     * [number]
     */
    public static MAP_GET = "map_get";

    /**
     * 
     */
    public static PUZZLE_GET = "puzzle_get";

    /**
     * 
     */
    public static PUZZLE_RESULT = "puzzle_result";
}