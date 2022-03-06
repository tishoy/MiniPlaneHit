/**
 * 
 */
class ResourceManager {


    private static cdn_url = "https://res.18game.cloud/wsplane/resource/"


    constructor() {
        this.init();
    }

    private static instance: ResourceManager = null;

    private init(): void {
        if (ResourceManager.instance !== null) {
            throw new Error("single instance error");
        }
    }



    public static getInstance(): ResourceManager {
        if (this.instance === null) {
            this.instance = new ResourceManager();
        }
        return this.instance;
    }

    public static async setDisplayRes(res_data) {
        if (platform.name === "web" || platform.name === "tt") {
            await RES.loadConfig("resource/" + res_data, "resource/");
        } else {
            await RES.loadConfig(res_data, ResourceManager.cdn_url);
        }
    }

    // 语言包
    public static LANGUAGE_JSON = "language_json";
    public static STOCK_JSON = "stock_json";
    public static BUILDING_JSON = "building_json";
    public static PUZZLES_JSON = "puzzles_json";
    // 健康忠告
    public static HEALTH_GAME_TIP_JSON = "health_game_tip_json";

    // 机场图标
    public static VIEW_AIRPORT_PNG = "view_airport_png";

    // 数据
    public static LEVEL_JSON = "level_json";


}