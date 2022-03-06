/**
 * 
 */
class BulletDataCache {

    public static instance = null

    public bulletDatas = [];

    constructor() {
        this.intiData();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new BulletDataCache();
        }
        return this.instance;
    }

    private intiData() {
        this.parseData(RES.getRes("bullet_json"));
    }

    private parseData(bulletData) {
        let bullet: BulletData;

        for (var i = 0; i < bulletData.length; i++) {
            bulletData[i].id = i;
            bulletData[i].type = i;
            bullet = new BulletData(bulletData[i]);
            this.bulletDatas.push(bullet);
        }
    }

    public getData(type) {
        return this.bulletDatas[type];
    }
}