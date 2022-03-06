/**
 * 地图游戏数据
 */
class MapStatsData {
    public id;
    public heads: HeadData[];
    public attacted: number; //被进攻次数
    // public 
    // public design:;

    constructor(data) {
        this.id = data.id;
        this.heads = data.heads;
        this.attacted = data.attacted
    }
}