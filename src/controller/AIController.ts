/**
 * 玩家练习
 * 随机地图
 * creat by tishoy
 * 2019.4.12
 */
class AIController {
    private static instance: AIController = null;

    //当前游戏的地图
    private randomMapData: MapData;
    private random: boolean = true;

    constructor() {
        if (AIController.instance) {
            throw new Error("AIController singlon error")
        }
        this.init();
    }

    private init() {
        this.randomMapData = new MapData();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new AIController();
        }
        return this.instance;
    }


    //------------------ 生成地图部分 ------------------
    async clear() {
        await this.randomMapData.clear();
    }

    public generateRandomMap() {
        this.clear();
        while (this.randomMapData.numPlane < 3) {
            this.addPlane();
        }
        return this.randomMapData;
    }

    public addPlane(): void {
        var direction: number = 0;
        var headColumn: number = 0;
        var headRow: number = 0;

        if (this.random) {
            direction = Math.floor(Math.random() * 4);
            switch (direction) {
                case DirectionTypeEnum.UP:
                    headColumn = 2 + Math.floor(Math.random() * 5);
                    headRow = Math.floor(Math.random() * 6);
                    break;
                case DirectionTypeEnum.RIGHT:
                    headColumn = 3 + Math.floor(Math.random() * 6);
                    headRow = 2 + Math.floor(Math.random() * 5);
                    break;
                case DirectionTypeEnum.DOWN:
                    headColumn = 2 + Math.floor(Math.random() * 5);
                    headRow = 3 + Math.floor(Math.random() * 6);
                    break;
                case DirectionTypeEnum.LEFT:
                    headColumn = Math.floor(Math.random() * 6);
                    headRow = 2 + Math.floor(Math.random() * 5);
                    break;
            }
            //处理特殊情况，无法放置三架飞机的情况！！！
        } else {

        }
        if (this.randomMapData.setPlaneGrid(headColumn, headRow, direction)) {
            this.randomMapData.numPlane++;
        } else {
            this.randomMapData.clear();
        }
    }

    public getGridTypeById(id): number {
        return this.randomMapData.map[id].gridType;
    }

    public addPlaneByBody(gridId) {
        let data = null;
        do {
            data = this.generateRandomMap()
        } while (data.map[gridId].gridType !== GridTypeEnum.BODY);
        if (data !== null) {
            GameController.getInstance().setAwayGame(data);
        } else {
            console.log("引导地图生产错误")
        }
    }

    //------------------ 智能生产残局 --------------------

    //------------------ 进攻部分 ------------------
    //这里使用需要配合DirectionTypeEnum
    private gridIsHeadPlaneDirection = [
        [],//0
        [],
        [DirectionTypeEnum.UP],
        [DirectionTypeEnum.UP],
        [DirectionTypeEnum.UP],
        [DirectionTypeEnum.UP],
        [DirectionTypeEnum.UP],
        [],
        [],
        [],//9
        [],
        [DirectionTypeEnum.UP],
        [DirectionTypeEnum.UP],
        [DirectionTypeEnum.UP],
        [DirectionTypeEnum.UP],
        [DirectionTypeEnum.UP],
        [],
        [],
        [DirectionTypeEnum.LEFT],   //18
        [DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.LEFT],   //27
        [DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.LEFT],   //36
        [DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.LEFT],   //45
        [DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.LEFT],   //54
        [DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT],
        [DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.RIGHT],
        [DirectionTypeEnum.RIGHT],
        [],//63
        [],
        [DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.DOWN],
        [],
        [],
        [],//72
        [],
        [DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.DOWN],
        [DirectionTypeEnum.DOWN],
        [],
        []
    ];

    private gridIsBodyPlaneDirection = [
        [],
        [
            2,
            3
        ],
        [
            1,
            2,
            2,
            3
        ],
        [
            1,
            2,
            2,
            2,
            3
        ],
        [
            1,
            2,
            2,
            2,
            3
        ],
        [
            1,
            2,
            2,
            2,
            3
        ],
        [
            1,
            2,
            2,
            3
        ],
        [
            1,
            2
        ],
        [],
        [
            0,
            1
        ],
        [
            0,
            0,
            1,
            2,
            3,
            3
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            0,
            1,
            1,
            2,
            3
        ],
        [
            0,
            3
        ],
        [
            0,
            1,
            1,
            2
        ],
        [
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            2,
            3,
            3
        ],
        [
            0,
            1,
            1,
            1,
            2
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3,
            3
        ],
        [
            0,
            2,
            3,
            3,
            3
        ],
        [
            0,
            1,
            1,
            1,
            2
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3,
            3
        ],
        [
            0,
            2,
            3,
            3,
            3
        ],
        [
            0,
            1,
            1,
            1,
            2
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3,
            3
        ],
        [
            0,
            2,
            3,
            3,
            3
        ],
        [
            0,
            1,
            1,
            2
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            2,
            3,
            3
        ],
        [
            1,
            2
        ],
        [
            0,
            1,
            2,
            2,
            3,
            3
        ],
        [
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            0,
            0,
            1,
            1,
            2,
            2,
            2,
            3,
            3,
            3
        ],
        [
            0,
            1,
            1,
            2,
            2,
            3
        ],
        [
            2,
            3
        ],
        [],
        [
            0,
            3
        ],
        [
            0,
            0,
            1,
            3
        ],
        [
            0,
            0,
            0,
            1,
            3
        ],
        [
            0,
            0,
            0,
            1,
            3
        ],
        [
            0,
            0,
            0,
            1,
            3
        ],
        [
            0,
            0,
            1,
            3
        ],
        [
            0,
            1
        ],
        []
    ];

    private gridIsBodyWhereIsHead = [
        [],
        [
            29,
            18
        ],
        [
            21,
            30,
            29,
            19
        ],
        [
            22,
            29,
            31,
            30,
            20
        ],
        [
            23,
            30,
            32,
            31,
            21
        ],
        [
            24,
            31,
            33,
            32,
            22
        ],
        [
            25,
            32,
            33,
            23
        ],
        [
            26,
            33
        ],
        [],
        [
            2,
            21
        ],
        [
            3,
            2,
            22,
            38,
            18,
            27
        ],
        [
            2,
            4,
            3,
            30,
            21,
            23,
            29,
            39,
            38,
            19,
            28
        ],
        [
            3,
            5,
            4,
            2,
            31,
            22,
            24,
            30,
            38,
            40,
            39,
            20,
            29,
            18
        ],
        [
            4,
            6,
            5,
            3,
            2,
            32,
            23,
            25,
            31,
            39,
            41,
            40,
            21,
            30,
            19
        ],
        [
            5,
            6,
            4,
            3,
            33,
            24,
            26,
            32,
            40,
            42,
            41,
            22,
            31,
            20
        ],
        [
            6,
            5,
            4,
            34,
            25,
            33,
            41,
            42,
            23,
            32,
            21
        ],
        [
            6,
            5,
            35,
            26,
            42,
            22
        ],
        [
            6,
            23
        ],
        [
            11,
            30,
            21,
            29
        ],
        [
            12,
            11,
            21,
            31,
            22,
            29,
            30,
            47,
            18,
            27,
            36
        ],
        [
            11,
            2,
            13,
            12,
            21,
            22,
            39,
            30,
            32,
            23,
            29,
            38,
            30,
            31,
            48,
            47,
            19,
            18,
            28,
            37
        ],
        [
            12,
            3,
            14,
            13,
            11,
            22,
            23,
            40,
            31,
            33,
            24,
            30,
            39,
            29,
            31,
            32,
            47,
            49,
            48,
            20,
            19,
            29,
            38,
            27,
            18
        ],
        [
            13,
            4,
            15,
            14,
            12,
            11,
            23,
            24,
            41,
            32,
            34,
            25,
            31,
            40,
            29,
            30,
            32,
            33,
            48,
            50,
            49,
            21,
            20,
            30,
            39,
            28,
            19
        ],
        [
            14,
            5,
            15,
            13,
            12,
            24,
            25,
            42,
            33,
            35,
            26,
            32,
            41,
            30,
            31,
            33,
            49,
            51,
            50,
            22,
            21,
            31,
            40,
            29,
            20
        ],
        [
            15,
            6,
            14,
            13,
            25,
            26,
            43,
            34,
            33,
            42,
            31,
            32,
            50,
            51,
            23,
            22,
            32,
            41,
            30,
            21
        ],
        [
            15,
            14,
            26,
            44,
            35,
            32,
            33,
            51,
            23,
            31,
            22
        ],
        [
            15,
            33,
            32,
            23
        ],
        [
            20,
            39,
            21,
            30,
            38
        ],
        [
            21,
            20,
            2,
            30,
            40,
            22,
            31,
            38,
            39,
            56,
            27,
            18,
            36,
            45
        ],
        [
            20,
            11,
            22,
            21,
            3,
            2,
            30,
            31,
            48,
            39,
            21,
            41,
            23,
            32,
            38,
            47,
            39,
            40,
            57,
            56,
            28,
            27,
            19,
            37,
            46
        ],
        [
            21,
            12,
            23,
            22,
            20,
            4,
            2,
            3,
            31,
            32,
            49,
            40,
            22,
            42,
            24,
            33,
            39,
            48,
            38,
            40,
            41,
            56,
            58,
            57,
            29,
            28,
            20,
            38,
            47,
            18,
            36,
            27
        ],
        [
            22,
            13,
            24,
            23,
            21,
            20,
            5,
            3,
            4,
            32,
            33,
            50,
            41,
            23,
            43,
            25,
            34,
            40,
            49,
            38,
            39,
            41,
            42,
            57,
            59,
            58,
            30,
            29,
            21,
            39,
            48,
            19,
            37,
            28
        ],
        [
            23,
            14,
            24,
            22,
            21,
            6,
            4,
            5,
            33,
            34,
            51,
            42,
            24,
            44,
            26,
            35,
            41,
            50,
            39,
            40,
            42,
            58,
            60,
            59,
            31,
            30,
            22,
            40,
            49,
            20,
            38,
            29
        ],
        [
            24,
            15,
            23,
            22,
            5,
            6,
            34,
            35,
            52,
            43,
            25,
            42,
            51,
            40,
            41,
            59,
            60,
            32,
            31,
            23,
            41,
            50,
            21,
            39,
            30
        ],
        [
            24,
            23,
            6,
            35,
            53,
            44,
            26,
            41,
            42,
            60,
            32,
            22,
            40,
            31
        ],
        [
            24,
            42,
            23,
            41,
            32
        ],
        [
            29,
            48,
            30,
            39,
            47
        ],
        [
            30,
            29,
            11,
            39,
            49,
            31,
            40,
            47,
            48,
            65,
            36,
            18,
            27,
            45,
            54
        ],
        [
            29,
            20,
            31,
            30,
            12,
            11,
            39,
            40,
            57,
            48,
            30,
            21,
            50,
            32,
            41,
            47,
            56,
            48,
            49,
            66,
            65,
            37,
            36,
            19,
            28,
            46,
            55
        ],
        [
            30,
            21,
            32,
            31,
            29,
            13,
            11,
            12,
            40,
            41,
            58,
            49,
            31,
            22,
            51,
            33,
            42,
            48,
            57,
            47,
            49,
            50,
            65,
            67,
            66,
            38,
            37,
            20,
            29,
            47,
            56,
            27,
            45,
            36
        ],
        [
            31,
            22,
            33,
            32,
            30,
            29,
            14,
            12,
            13,
            41,
            42,
            59,
            50,
            32,
            23,
            52,
            34,
            43,
            49,
            58,
            47,
            48,
            50,
            51,
            66,
            68,
            67,
            39,
            38,
            21,
            30,
            48,
            57,
            28,
            46,
            37
        ],
        [
            32,
            23,
            33,
            31,
            30,
            15,
            13,
            14,
            42,
            43,
            60,
            51,
            33,
            24,
            53,
            35,
            44,
            50,
            59,
            48,
            49,
            51,
            67,
            69,
            68,
            40,
            39,
            22,
            31,
            49,
            58,
            29,
            47,
            38
        ],
        [
            33,
            24,
            32,
            31,
            14,
            15,
            43,
            44,
            61,
            52,
            34,
            25,
            51,
            60,
            49,
            50,
            68,
            69,
            41,
            40,
            23,
            32,
            50,
            59,
            30,
            48,
            39
        ],
        [
            33,
            32,
            15,
            44,
            62,
            53,
            35,
            26,
            50,
            51,
            69,
            41,
            31,
            49,
            40
        ],
        [
            33,
            51,
            32,
            50,
            41
        ],
        [
            38,
            57,
            39,
            48,
            56
        ],
        [
            39,
            38,
            20,
            48,
            58,
            40,
            49,
            56,
            57,
            74,
            45,
            27,
            36,
            54
        ],
        [
            38,
            29,
            40,
            39,
            21,
            20,
            48,
            49,
            57,
            39,
            30,
            59,
            41,
            50,
            56,
            65,
            57,
            58,
            75,
            74,
            46,
            45,
            28,
            37,
            55
        ],
        [
            39,
            30,
            41,
            40,
            38,
            22,
            20,
            21,
            49,
            50,
            58,
            40,
            31,
            60,
            42,
            51,
            57,
            66,
            56,
            58,
            59,
            74,
            76,
            75,
            47,
            46,
            29,
            38,
            56,
            36,
            54,
            45
        ],
        [
            40,
            31,
            42,
            41,
            39,
            38,
            23,
            21,
            22,
            50,
            51,
            59,
            41,
            32,
            61,
            43,
            52,
            58,
            67,
            56,
            57,
            59,
            60,
            75,
            77,
            76,
            48,
            47,
            30,
            39,
            57,
            37,
            55,
            46
        ],
        [
            41,
            32,
            42,
            40,
            39,
            24,
            22,
            23,
            51,
            52,
            60,
            42,
            33,
            62,
            44,
            53,
            59,
            68,
            57,
            58,
            60,
            76,
            78,
            77,
            49,
            48,
            31,
            40,
            58,
            38,
            56,
            47
        ],
        [
            42,
            33,
            41,
            40,
            23,
            24,
            52,
            53,
            61,
            43,
            34,
            60,
            69,
            58,
            59,
            77,
            78,
            50,
            49,
            32,
            41,
            59,
            39,
            57,
            48
        ],
        [
            42,
            41,
            24,
            53,
            62,
            44,
            35,
            59,
            60,
            78,
            50,
            40,
            58,
            49
        ],
        [
            42,
            60,
            41,
            59,
            50
        ],
        [
            47,
            48,
            57,
            65
        ],
        [
            48,
            47,
            29,
            57,
            49,
            58,
            65,
            66,
            54,
            36,
            45
        ],
        [
            47,
            38,
            49,
            48,
            30,
            29,
            57,
            58,
            48,
            39,
            50,
            59,
            65,
            74,
            66,
            67,
            55,
            54,
            37,
            46
        ],
        [
            48,
            39,
            50,
            49,
            47,
            31,
            29,
            30,
            58,
            59,
            49,
            40,
            51,
            60,
            66,
            75,
            65,
            67,
            68,
            56,
            55,
            38,
            47,
            45,
            54
        ],
        [
            49,
            40,
            51,
            50,
            48,
            47,
            32,
            30,
            31,
            59,
            60,
            50,
            41,
            52,
            61,
            67,
            76,
            65,
            66,
            68,
            69,
            57,
            56,
            39,
            48,
            46,
            55
        ],
        [
            50,
            41,
            51,
            49,
            48,
            33,
            31,
            32,
            60,
            61,
            51,
            42,
            53,
            62,
            68,
            77,
            66,
            67,
            69,
            58,
            57,
            40,
            49,
            47,
            56
        ],
        [
            51,
            42,
            50,
            49,
            32,
            33,
            61,
            62,
            52,
            43,
            69,
            78,
            67,
            68,
            59,
            58,
            41,
            50,
            48,
            57
        ],
        [
            51,
            50,
            33,
            62,
            53,
            44,
            68,
            69,
            59,
            49,
            58
        ],
        [
            51,
            69,
            50,
            59
        ],
        [
            57,
            74
        ],
        [
            38,
            58,
            74,
            75,
            45,
            54
        ],
        [
            47,
            39,
            38,
            57,
            48,
            59,
            74,
            75,
            76,
            46,
            55
        ],
        [
            48,
            40,
            38,
            39,
            58,
            49,
            60,
            75,
            74,
            76,
            77,
            47,
            56,
            54
        ],
        [
            49,
            41,
            39,
            40,
            59,
            50,
            61,
            76,
            74,
            75,
            77,
            78,
            48,
            57,
            55
        ],
        [
            50,
            42,
            40,
            41,
            60,
            51,
            62,
            77,
            75,
            76,
            78,
            49,
            58,
            56
        ],
        [
            51,
            41,
            42,
            61,
            52,
            78,
            76,
            77,
            50,
            59,
            57
        ],
        [
            42,
            62,
            53,
            77,
            78,
            58
        ],
        [
            78,
            59
        ],
        [],
        [
            47,
            54
        ],
        [
            48,
            47,
            57,
            55
        ],
        [
            49,
            47,
            48,
            58,
            56
        ],
        [
            50,
            48,
            49,
            59,
            57
        ],
        [
            51,
            49,
            50,
            60,
            58
        ],
        [
            50,
            51,
            61,
            59
        ],
        [
            51,
            62
        ],
        []
    ];

    public computeAllHead() {
        let result = [];
        for (let i = 0; i < this.gridIsHeadPlaneDirection.length; i++) {
            result.push([]);
            for (let j = 0; j < this.gridIsHeadPlaneDirection[i].length; j++) {
                result[i].push(this.gridIsHeadPlaneDirection[i][j]);
            }
        }
        return result;
    }

    public gridIsBodyHowManyCanBeHead() {
        let temp = [];
        let result = [];
        for (let i = 0; i < this.gridIsBodyWhereIsHead.length; i++) {
            temp.push({ grid: i, amount: this.gridIsBodyWhereIsHead[i].length });
        }
        let sort = temp.sort((a, b) => { return a.amount - b.amount });
        for (let i = 0; i < sort.length; i++) {
            result.push(sort[i].grid);
        }
        return result;
    };

    public computeIsBodyWhereIsHead() {
        for (let i = 0; i < 81; i++) {
            this.gridIsBodyPlaneDirection.push([]);
            this.gridIsBodyWhereIsHead.push([]);
            for (let j = 0; j < 4; j++) {
                let bodyGrids = DirectionTypeEnum.getGridByDirection(j);
                for (let k = 0; k < bodyGrids.length; k++) {
                    if (MapUtil.checkHeadAndDirection(i - bodyGrids[k], j)) {
                        this.gridIsBodyWhereIsHead[i].push(i - bodyGrids[k]);
                        this.gridIsBodyPlaneDirection[i].push(j)
                    }
                }
            }
        }
    }

    public computeAllHeadDirectionBody() {
        let result = [];
        let planeGrids;
        for (let i = 0; i < 81; i++) {
            result.push([]);
        }
        for (let i = 0; i < 81; i++) {
            for (let j = 0; j < this.gridIsHeadPlaneDirection[i].length; j++) {
                planeGrids = DirectionTypeEnum.getGridByDirection(this.gridIsHeadPlaneDirection[i][j]);
                for (let k = 0; k < planeGrids.length; k++) {
                    result[i + planeGrids[k]].push({ head: i, direction: this.gridIsHeadPlaneDirection[i][j] });
                }
            }
        }
        return result;
    }

    // 每个位置身体 存在头的可能
    private allHeadDirectionByBody = [
        [],//0
        [
            {
                "head": 18,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 2
            }
        ],
        [
            {
                "head": 19,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 1
            },
            {
                "head": 29,
                "direction": 2
            },
            {
                "head": 30,
                "direction": 2
            }
        ],
        [
            {
                "head": 20,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 1
            },
            {
                "head": 29,
                "direction": 2
            },
            {
                "head": 30,
                "direction": 2
            },
            {
                "head": 31,
                "direction": 2
            }
        ],
        [
            {
                "head": 21,
                "direction": 3
            },
            {
                "head": 23,
                "direction": 1
            },
            {
                "head": 30,
                "direction": 2
            },
            {
                "head": 31,
                "direction": 2
            },
            {
                "head": 32,
                "direction": 2
            }
        ],
        [
            {
                "head": 22,
                "direction": 3
            },
            {
                "head": 24,
                "direction": 1
            },
            {
                "head": 31,
                "direction": 2
            },
            {
                "head": 32,
                "direction": 2
            },
            {
                "head": 33,
                "direction": 2
            }
        ],
        [
            {
                "head": 23,
                "direction": 3
            },
            {
                "head": 25,
                "direction": 1
            },
            {
                "head": 32,
                "direction": 2
            },
            {
                "head": 33,
                "direction": 2
            }
        ],
        [
            {
                "head": 26,
                "direction": 1
            },
            {
                "head": 33,
                "direction": 2
            }
        ],
        [],
        [
            {
                "head": 2,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 1
            }
        ],//9
        [
            {
                "head": 2,
                "direction": 0
            },
            {
                "head": 3,
                "direction": 0
            },
            {
                "head": 18,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 1
            },
            {
                "head": 27,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 2
            }
        ],
        [
            {
                "head": 2,
                "direction": 0
            },
            {
                "head": 3,
                "direction": 0
            },
            {
                "head": 4,
                "direction": 0
            },
            {
                "head": 19,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 1
            },
            {
                "head": 23,
                "direction": 1
            },
            {
                "head": 28,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 2
            },
            {
                "head": 30,
                "direction": 1
            },
            {
                "head": 38,
                "direction": 2
            },
            {
                "head": 39,
                "direction": 2
            }
        ],
        [
            {
                "head": 2,
                "direction": 0
            },
            {
                "head": 3,
                "direction": 0
            },
            {
                "head": 4,
                "direction": 0
            },
            {
                "head": 5,
                "direction": 0
            },
            {
                "head": 18,
                "direction": 3
            },
            {
                "head": 20,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 1
            },
            {
                "head": 24,
                "direction": 1
            },
            {
                "head": 29,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 2
            },
            {
                "head": 31,
                "direction": 1
            },
            {
                "head": 38,
                "direction": 2
            },
            {
                "head": 39,
                "direction": 2
            },
            {
                "head": 40,
                "direction": 2
            }
        ],
        [
            {
                "head": 2,
                "direction": 0
            },
            {
                "head": 3,
                "direction": 0
            },
            {
                "head": 4,
                "direction": 0
            },
            {
                "head": 5,
                "direction": 0
            },
            {
                "head": 6,
                "direction": 0
            },
            {
                "head": 19,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 3
            },
            {
                "head": 23,
                "direction": 1
            },
            {
                "head": 25,
                "direction": 1
            },
            {
                "head": 30,
                "direction": 3
            },
            {
                "head": 31,
                "direction": 2
            },
            {
                "head": 32,
                "direction": 1
            },
            {
                "head": 39,
                "direction": 2
            },
            {
                "head": 40,
                "direction": 2
            },
            {
                "head": 41,
                "direction": 2
            }
        ],
        [
            {
                "head": 3,
                "direction": 0
            },
            {
                "head": 4,
                "direction": 0
            },
            {
                "head": 5,
                "direction": 0
            },
            {
                "head": 6,
                "direction": 0
            },
            {
                "head": 20,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 3
            },
            {
                "head": 24,
                "direction": 1
            },
            {
                "head": 26,
                "direction": 1
            },
            {
                "head": 31,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 2
            },
            {
                "head": 33,
                "direction": 1
            },
            {
                "head": 40,
                "direction": 2
            },
            {
                "head": 41,
                "direction": 2
            },
            {
                "head": 42,
                "direction": 2
            }
        ],
        [
            {
                "head": 4,
                "direction": 0
            },
            {
                "head": 5,
                "direction": 0
            },
            {
                "head": 6,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 3
            },
            {
                "head": 23,
                "direction": 3
            },
            {
                "head": 25,
                "direction": 1
            },
            {
                "head": 32,
                "direction": 3
            },
            {
                "head": 33,
                "direction": 2
            },
            {
                "head": 34,
                "direction": 1
            },
            {
                "head": 41,
                "direction": 2
            },
            {
                "head": 42,
                "direction": 2
            }
        ],
        [
            {
                "head": 5,
                "direction": 0
            },
            {
                "head": 6,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 3
            },
            {
                "head": 26,
                "direction": 1
            },
            {
                "head": 35,
                "direction": 1
            },
            {
                "head": 42,
                "direction": 2
            }
        ],
        [
            {
                "head": 6,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 3
            }
        ],
        [
            {
                "head": 11,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 1
            },
            {
                "head": 29,
                "direction": 2
            },
            {
                "head": 30,
                "direction": 1
            }
        ],//18
        [
            {
                "head": 11,
                "direction": 0
            },
            {
                "head": 12,
                "direction": 0
            },
            {
                "head": 18,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 1
            },
            {
                "head": 22,
                "direction": 1
            },
            {
                "head": 27,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 2
            },
            {
                "head": 30,
                "direction": 2
            },
            {
                "head": 31,
                "direction": 1
            },
            {
                "head": 36,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 2
            }
        ],
        [
            {
                "head": 2,
                "direction": 0
            },
            {
                "head": 11,
                "direction": 0
            },
            {
                "head": 12,
                "direction": 0
            },
            {
                "head": 13,
                "direction": 0
            },
            {
                "head": 18,
                "direction": 3
            },
            {
                "head": 19,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 1
            },
            {
                "head": 22,
                "direction": 1
            },
            {
                "head": 23,
                "direction": 1
            },
            {
                "head": 28,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 2
            },
            {
                "head": 30,
                "direction": 1
            },
            {
                "head": 30,
                "direction": 2
            },
            {
                "head": 31,
                "direction": 2
            },
            {
                "head": 32,
                "direction": 1
            },
            {
                "head": 37,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 2
            },
            {
                "head": 39,
                "direction": 1
            },
            {
                "head": 47,
                "direction": 2
            },
            {
                "head": 48,
                "direction": 2
            }
        ],
        [
            {
                "head": 3,
                "direction": 0
            },
            {
                "head": 11,
                "direction": 0
            },
            {
                "head": 12,
                "direction": 0
            },
            {
                "head": 13,
                "direction": 0
            },
            {
                "head": 14,
                "direction": 0
            },
            {
                "head": 18,
                "direction": 3
            },
            {
                "head": 19,
                "direction": 3
            },
            {
                "head": 20,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 1
            },
            {
                "head": 23,
                "direction": 1
            },
            {
                "head": 24,
                "direction": 1
            },
            {
                "head": 27,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 2
            },
            {
                "head": 29,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 2
            },
            {
                "head": 31,
                "direction": 1
            },
            {
                "head": 31,
                "direction": 2
            },
            {
                "head": 32,
                "direction": 2
            },
            {
                "head": 33,
                "direction": 1
            },
            {
                "head": 38,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 2
            },
            {
                "head": 40,
                "direction": 1
            },
            {
                "head": 47,
                "direction": 2
            },
            {
                "head": 48,
                "direction": 2
            },
            {
                "head": 49,
                "direction": 2
            }
        ],
        [
            {
                "head": 4,
                "direction": 0
            },
            {
                "head": 11,
                "direction": 0
            },
            {
                "head": 12,
                "direction": 0
            },
            {
                "head": 13,
                "direction": 0
            },
            {
                "head": 14,
                "direction": 0
            },
            {
                "head": 15,
                "direction": 0
            },
            {
                "head": 19,
                "direction": 3
            },
            {
                "head": 20,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 3
            },
            {
                "head": 23,
                "direction": 1
            },
            {
                "head": 24,
                "direction": 1
            },
            {
                "head": 25,
                "direction": 1
            },
            {
                "head": 28,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 2
            },
            {
                "head": 30,
                "direction": 2
            },
            {
                "head": 30,
                "direction": 3
            },
            {
                "head": 31,
                "direction": 2
            },
            {
                "head": 32,
                "direction": 1
            },
            {
                "head": 32,
                "direction": 2
            },
            {
                "head": 33,
                "direction": 2
            },
            {
                "head": 34,
                "direction": 1
            },
            {
                "head": 39,
                "direction": 3
            },
            {
                "head": 40,
                "direction": 2
            },
            {
                "head": 41,
                "direction": 1
            },
            {
                "head": 48,
                "direction": 2
            },
            {
                "head": 49,
                "direction": 2
            },
            {
                "head": 50,
                "direction": 2
            }
        ],
        [
            {
                "head": 5,
                "direction": 0
            },
            {
                "head": 12,
                "direction": 0
            },
            {
                "head": 13,
                "direction": 0
            },
            {
                "head": 14,
                "direction": 0
            },
            {
                "head": 15,
                "direction": 0
            },
            {
                "head": 20,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 3
            },
            {
                "head": 24,
                "direction": 1
            },
            {
                "head": 25,
                "direction": 1
            },
            {
                "head": 26,
                "direction": 1
            },
            {
                "head": 29,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 2
            },
            {
                "head": 31,
                "direction": 2
            },
            {
                "head": 31,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 2
            },
            {
                "head": 33,
                "direction": 1
            },
            {
                "head": 33,
                "direction": 2
            },
            {
                "head": 35,
                "direction": 1
            },
            {
                "head": 40,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 2
            },
            {
                "head": 42,
                "direction": 1
            },
            {
                "head": 49,
                "direction": 2
            },
            {
                "head": 50,
                "direction": 2
            },
            {
                "head": 51,
                "direction": 2
            }
        ],
        [
            {
                "head": 6,
                "direction": 0
            },
            {
                "head": 13,
                "direction": 0
            },
            {
                "head": 14,
                "direction": 0
            },
            {
                "head": 15,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 3
            },
            {
                "head": 23,
                "direction": 3
            },
            {
                "head": 25,
                "direction": 1
            },
            {
                "head": 26,
                "direction": 1
            },
            {
                "head": 30,
                "direction": 3
            },
            {
                "head": 31,
                "direction": 2
            },
            {
                "head": 32,
                "direction": 2
            },
            {
                "head": 32,
                "direction": 3
            },
            {
                "head": 33,
                "direction": 2
            },
            {
                "head": 34,
                "direction": 1
            },
            {
                "head": 41,
                "direction": 3
            },
            {
                "head": 42,
                "direction": 2
            },
            {
                "head": 43,
                "direction": 1
            },
            {
                "head": 50,
                "direction": 2
            },
            {
                "head": 51,
                "direction": 2
            }
        ],
        [
            {
                "head": 14,
                "direction": 0
            },
            {
                "head": 15,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 3
            },
            {
                "head": 23,
                "direction": 3
            },
            {
                "head": 26,
                "direction": 1
            },
            {
                "head": 31,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 2
            },
            {
                "head": 33,
                "direction": 2
            },
            {
                "head": 35,
                "direction": 1
            },
            {
                "head": 44,
                "direction": 1
            },
            {
                "head": 51,
                "direction": 2
            }
        ],
        [
            {
                "head": 15,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 3
            },
            {
                "head": 33,
                "direction": 2
            }
        ],
        [
            {
                "head": 20,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 1
            },
            {
                "head": 30,
                "direction": 1
            },
            {
                "head": 38,
                "direction": 2
            },
            {
                "head": 39,
                "direction": 1
            }
        ],
        [
            {
                "head": 2,
                "direction": 0
            },
            {
                "head": 18,
                "direction": 3
            },
            {
                "head": 20,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 1
            },
            {
                "head": 27,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 1
            },
            {
                "head": 31,
                "direction": 1
            },
            {
                "head": 36,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 2
            },
            {
                "head": 39,
                "direction": 2
            },
            {
                "head": 40,
                "direction": 1
            },
            {
                "head": 45,
                "direction": 3
            },
            {
                "head": 56,
                "direction": 2
            }
        ],
        [
            {
                "head": 2,
                "direction": 0
            },
            {
                "head": 3,
                "direction": 0
            },
            {
                "head": 11,
                "direction": 0
            },
            {
                "head": 19,
                "direction": 3
            },
            {
                "head": 20,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 1
            },
            {
                "head": 22,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 1
            },
            {
                "head": 27,
                "direction": 3
            },
            {
                "head": 28,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 1
            },
            {
                "head": 31,
                "direction": 1
            },
            {
                "head": 32,
                "direction": 1
            },
            {
                "head": 37,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 2
            },
            {
                "head": 39,
                "direction": 1
            },
            {
                "head": 39,
                "direction": 2
            },
            {
                "head": 40,
                "direction": 2
            },
            {
                "head": 41,
                "direction": 1
            },
            {
                "head": 46,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 2
            },
            {
                "head": 48,
                "direction": 1
            },
            {
                "head": 56,
                "direction": 2
            },
            {
                "head": 57,
                "direction": 2
            }
        ],
        [
            {
                "head": 2,
                "direction": 0
            },
            {
                "head": 3,
                "direction": 0
            },
            {
                "head": 4,
                "direction": 0
            },
            {
                "head": 12,
                "direction": 0
            },
            {
                "head": 18,
                "direction": 3
            },
            {
                "head": 20,
                "direction": 0
            },
            {
                "head": 20,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 1
            },
            {
                "head": 23,
                "direction": 0
            },
            {
                "head": 24,
                "direction": 1
            },
            {
                "head": 27,
                "direction": 3
            },
            {
                "head": 28,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 3
            },
            {
                "head": 31,
                "direction": 1
            },
            {
                "head": 32,
                "direction": 1
            },
            {
                "head": 33,
                "direction": 1
            },
            {
                "head": 36,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 2
            },
            {
                "head": 38,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 2
            },
            {
                "head": 40,
                "direction": 1
            },
            {
                "head": 40,
                "direction": 2
            },
            {
                "head": 41,
                "direction": 2
            },
            {
                "head": 42,
                "direction": 1
            },
            {
                "head": 47,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 2
            },
            {
                "head": 49,
                "direction": 1
            },
            {
                "head": 56,
                "direction": 2
            },
            {
                "head": 57,
                "direction": 2
            },
            {
                "head": 58,
                "direction": 2
            }
        ],
        [
            {
                "head": 3,
                "direction": 0
            },
            {
                "head": 4,
                "direction": 0
            },
            {
                "head": 5,
                "direction": 0
            },
            {
                "head": 13,
                "direction": 0
            },
            {
                "head": 19,
                "direction": 3
            },
            {
                "head": 20,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 1
            },
            {
                "head": 24,
                "direction": 0
            },
            {
                "head": 25,
                "direction": 1
            },
            {
                "head": 28,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 1
            },
            {
                "head": 33,
                "direction": 1
            },
            {
                "head": 34,
                "direction": 1
            },
            {
                "head": 37,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 2
            },
            {
                "head": 39,
                "direction": 2
            },
            {
                "head": 39,
                "direction": 3
            },
            {
                "head": 40,
                "direction": 2
            },
            {
                "head": 41,
                "direction": 1
            },
            {
                "head": 41,
                "direction": 2
            },
            {
                "head": 42,
                "direction": 2
            },
            {
                "head": 43,
                "direction": 1
            },
            {
                "head": 48,
                "direction": 3
            },
            {
                "head": 49,
                "direction": 2
            },
            {
                "head": 50,
                "direction": 1
            },
            {
                "head": 57,
                "direction": 2
            },
            {
                "head": 58,
                "direction": 2
            },
            {
                "head": 59,
                "direction": 2
            }
        ],
        [
            {
                "head": 4,
                "direction": 0
            },
            {
                "head": 5,
                "direction": 0
            },
            {
                "head": 6,
                "direction": 0
            },
            {
                "head": 14,
                "direction": 0
            },
            {
                "head": 20,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 3
            },
            {
                "head": 23,
                "direction": 0
            },
            {
                "head": 24,
                "direction": 0
            },
            {
                "head": 24,
                "direction": 1
            },
            {
                "head": 26,
                "direction": 1
            },
            {
                "head": 29,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 3
            },
            {
                "head": 31,
                "direction": 3
            },
            {
                "head": 33,
                "direction": 1
            },
            {
                "head": 34,
                "direction": 1
            },
            {
                "head": 35,
                "direction": 1
            },
            {
                "head": 38,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 2
            },
            {
                "head": 40,
                "direction": 2
            },
            {
                "head": 40,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 2
            },
            {
                "head": 42,
                "direction": 1
            },
            {
                "head": 42,
                "direction": 2
            },
            {
                "head": 44,
                "direction": 1
            },
            {
                "head": 49,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 2
            },
            {
                "head": 51,
                "direction": 1
            },
            {
                "head": 58,
                "direction": 2
            },
            {
                "head": 59,
                "direction": 2
            },
            {
                "head": 60,
                "direction": 2
            }
        ],
        [
            {
                "head": 5,
                "direction": 0
            },
            {
                "head": 6,
                "direction": 0
            },
            {
                "head": 15,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 3
            },
            {
                "head": 24,
                "direction": 0
            },
            {
                "head": 25,
                "direction": 1
            },
            {
                "head": 30,
                "direction": 3
            },
            {
                "head": 31,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 3
            },
            {
                "head": 34,
                "direction": 1
            },
            {
                "head": 35,
                "direction": 1
            },
            {
                "head": 39,
                "direction": 3
            },
            {
                "head": 40,
                "direction": 2
            },
            {
                "head": 41,
                "direction": 2
            },
            {
                "head": 41,
                "direction": 3
            },
            {
                "head": 42,
                "direction": 2
            },
            {
                "head": 43,
                "direction": 1
            },
            {
                "head": 50,
                "direction": 3
            },
            {
                "head": 51,
                "direction": 2
            },
            {
                "head": 52,
                "direction": 1
            },
            {
                "head": 59,
                "direction": 2
            },
            {
                "head": 60,
                "direction": 2
            }
        ],
        [
            {
                "head": 6,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 3
            },
            {
                "head": 23,
                "direction": 0
            },
            {
                "head": 24,
                "direction": 0
            },
            {
                "head": 26,
                "direction": 1
            },
            {
                "head": 31,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 3
            },
            {
                "head": 35,
                "direction": 1
            },
            {
                "head": 40,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 2
            },
            {
                "head": 42,
                "direction": 2
            },
            {
                "head": 44,
                "direction": 1
            },
            {
                "head": 53,
                "direction": 1
            },
            {
                "head": 60,
                "direction": 2
            }
        ],
        [
            {
                "head": 23,
                "direction": 3
            },
            {
                "head": 24,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 3
            },
            {
                "head": 42,
                "direction": 2
            }
        ],
        [
            {
                "head": 29,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 1
            },
            {
                "head": 39,
                "direction": 1
            },
            {
                "head": 47,
                "direction": 2
            },
            {
                "head": 48,
                "direction": 1
            }
        ],
        [
            {
                "head": 11,
                "direction": 0
            },
            {
                "head": 18,
                "direction": 3
            },
            {
                "head": 27,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 0
            },
            {
                "head": 31,
                "direction": 1
            },
            {
                "head": 36,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 1
            },
            {
                "head": 40,
                "direction": 1
            },
            {
                "head": 45,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 2
            },
            {
                "head": 48,
                "direction": 2
            },
            {
                "head": 49,
                "direction": 1
            },
            {
                "head": 54,
                "direction": 3
            },
            {
                "head": 65,
                "direction": 2
            }
        ],
        [
            {
                "head": 11,
                "direction": 0
            },
            {
                "head": 12,
                "direction": 0
            },
            {
                "head": 19,
                "direction": 3
            },
            {
                "head": 20,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 1
            },
            {
                "head": 28,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 1
            },
            {
                "head": 31,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 1
            },
            {
                "head": 36,
                "direction": 3
            },
            {
                "head": 37,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 1
            },
            {
                "head": 40,
                "direction": 1
            },
            {
                "head": 41,
                "direction": 1
            },
            {
                "head": 46,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 2
            },
            {
                "head": 48,
                "direction": 1
            },
            {
                "head": 48,
                "direction": 2
            },
            {
                "head": 49,
                "direction": 2
            },
            {
                "head": 50,
                "direction": 1
            },
            {
                "head": 55,
                "direction": 3
            },
            {
                "head": 56,
                "direction": 2
            },
            {
                "head": 57,
                "direction": 1
            },
            {
                "head": 65,
                "direction": 2
            },
            {
                "head": 66,
                "direction": 2
            }
        ],
        [
            {
                "head": 11,
                "direction": 0
            },
            {
                "head": 12,
                "direction": 0
            },
            {
                "head": 13,
                "direction": 0
            },
            {
                "head": 20,
                "direction": 3
            },
            {
                "head": 21,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 1
            },
            {
                "head": 27,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 0
            },
            {
                "head": 29,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 0
            },
            {
                "head": 31,
                "direction": 0
            },
            {
                "head": 31,
                "direction": 1
            },
            {
                "head": 32,
                "direction": 0
            },
            {
                "head": 33,
                "direction": 1
            },
            {
                "head": 36,
                "direction": 3
            },
            {
                "head": 37,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 3
            },
            {
                "head": 40,
                "direction": 1
            },
            {
                "head": 41,
                "direction": 1
            },
            {
                "head": 42,
                "direction": 1
            },
            {
                "head": 45,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 2
            },
            {
                "head": 47,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 2
            },
            {
                "head": 49,
                "direction": 1
            },
            {
                "head": 49,
                "direction": 2
            },
            {
                "head": 50,
                "direction": 2
            },
            {
                "head": 51,
                "direction": 1
            },
            {
                "head": 56,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 2
            },
            {
                "head": 58,
                "direction": 1
            },
            {
                "head": 65,
                "direction": 2
            },
            {
                "head": 66,
                "direction": 2
            },
            {
                "head": 67,
                "direction": 2
            }
        ],
        [
            {
                "head": 12,
                "direction": 0
            },
            {
                "head": 13,
                "direction": 0
            },
            {
                "head": 14,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 3
            },
            {
                "head": 22,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 1
            },
            {
                "head": 28,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 3
            },
            {
                "head": 31,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 1
            },
            {
                "head": 33,
                "direction": 0
            },
            {
                "head": 34,
                "direction": 1
            },
            {
                "head": 37,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 1
            },
            {
                "head": 42,
                "direction": 1
            },
            {
                "head": 43,
                "direction": 1
            },
            {
                "head": 46,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 2
            },
            {
                "head": 48,
                "direction": 2
            },
            {
                "head": 48,
                "direction": 3
            },
            {
                "head": 49,
                "direction": 2
            },
            {
                "head": 50,
                "direction": 1
            },
            {
                "head": 50,
                "direction": 2
            },
            {
                "head": 51,
                "direction": 2
            },
            {
                "head": 52,
                "direction": 1
            },
            {
                "head": 57,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 2
            },
            {
                "head": 59,
                "direction": 1
            },
            {
                "head": 66,
                "direction": 2
            },
            {
                "head": 67,
                "direction": 2
            },
            {
                "head": 68,
                "direction": 2
            }
        ],
        [
            {
                "head": 13,
                "direction": 0
            },
            {
                "head": 14,
                "direction": 0
            },
            {
                "head": 15,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 3
            },
            {
                "head": 23,
                "direction": 0
            },
            {
                "head": 24,
                "direction": 1
            },
            {
                "head": 29,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 0
            },
            {
                "head": 31,
                "direction": 0
            },
            {
                "head": 31,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 0
            },
            {
                "head": 33,
                "direction": 0
            },
            {
                "head": 33,
                "direction": 1
            },
            {
                "head": 35,
                "direction": 1
            },
            {
                "head": 38,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 3
            },
            {
                "head": 40,
                "direction": 3
            },
            {
                "head": 42,
                "direction": 1
            },
            {
                "head": 43,
                "direction": 1
            },
            {
                "head": 44,
                "direction": 1
            },
            {
                "head": 47,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 2
            },
            {
                "head": 49,
                "direction": 2
            },
            {
                "head": 49,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 2
            },
            {
                "head": 51,
                "direction": 1
            },
            {
                "head": 51,
                "direction": 2
            },
            {
                "head": 53,
                "direction": 1
            },
            {
                "head": 58,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 2
            },
            {
                "head": 60,
                "direction": 1
            },
            {
                "head": 67,
                "direction": 2
            },
            {
                "head": 68,
                "direction": 2
            },
            {
                "head": 69,
                "direction": 2
            }
        ],
        [
            {
                "head": 14,
                "direction": 0
            },
            {
                "head": 15,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 3
            },
            {
                "head": 24,
                "direction": 0
            },
            {
                "head": 25,
                "direction": 1
            },
            {
                "head": 30,
                "direction": 3
            },
            {
                "head": 31,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 3
            },
            {
                "head": 33,
                "direction": 0
            },
            {
                "head": 34,
                "direction": 1
            },
            {
                "head": 39,
                "direction": 3
            },
            {
                "head": 40,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 3
            },
            {
                "head": 43,
                "direction": 1
            },
            {
                "head": 44,
                "direction": 1
            },
            {
                "head": 48,
                "direction": 3
            },
            {
                "head": 49,
                "direction": 2
            },
            {
                "head": 50,
                "direction": 2
            },
            {
                "head": 50,
                "direction": 3
            },
            {
                "head": 51,
                "direction": 2
            },
            {
                "head": 52,
                "direction": 1
            },
            {
                "head": 59,
                "direction": 3
            },
            {
                "head": 60,
                "direction": 2
            },
            {
                "head": 61,
                "direction": 1
            },
            {
                "head": 68,
                "direction": 2
            },
            {
                "head": 69,
                "direction": 2
            }
        ],
        [
            {
                "head": 15,
                "direction": 0
            },
            {
                "head": 26,
                "direction": 1
            },
            {
                "head": 31,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 0
            },
            {
                "head": 33,
                "direction": 0
            },
            {
                "head": 35,
                "direction": 1
            },
            {
                "head": 40,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 3
            },
            {
                "head": 44,
                "direction": 1
            },
            {
                "head": 49,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 2
            },
            {
                "head": 51,
                "direction": 2
            },
            {
                "head": 53,
                "direction": 1
            },
            {
                "head": 62,
                "direction": 1
            },
            {
                "head": 69,
                "direction": 2
            }
        ],
        [
            {
                "head": 32,
                "direction": 3
            },
            {
                "head": 33,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 3
            },
            {
                "head": 51,
                "direction": 2
            }
        ],
        [
            {
                "head": 38,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 1
            },
            {
                "head": 48,
                "direction": 1
            },
            {
                "head": 56,
                "direction": 2
            },
            {
                "head": 57,
                "direction": 1
            }
        ],
        [
            {
                "head": 20,
                "direction": 0
            },
            {
                "head": 27,
                "direction": 3
            },
            {
                "head": 36,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 0
            },
            {
                "head": 40,
                "direction": 1
            },
            {
                "head": 45,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 1
            },
            {
                "head": 49,
                "direction": 1
            },
            {
                "head": 54,
                "direction": 3
            },
            {
                "head": 56,
                "direction": 2
            },
            {
                "head": 57,
                "direction": 2
            },
            {
                "head": 58,
                "direction": 1
            },
            {
                "head": 74,
                "direction": 2
            }
        ],
        [
            {
                "head": 20,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 0
            },
            {
                "head": 28,
                "direction": 3
            },
            {
                "head": 29,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 1
            },
            {
                "head": 37,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 1
            },
            {
                "head": 40,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 1
            },
            {
                "head": 45,
                "direction": 3
            },
            {
                "head": 46,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 1
            },
            {
                "head": 49,
                "direction": 1
            },
            {
                "head": 50,
                "direction": 1
            },
            {
                "head": 55,
                "direction": 3
            },
            {
                "head": 56,
                "direction": 2
            },
            {
                "head": 57,
                "direction": 1
            },
            {
                "head": 57,
                "direction": 2
            },
            {
                "head": 58,
                "direction": 2
            },
            {
                "head": 59,
                "direction": 1
            },
            {
                "head": 65,
                "direction": 2
            },
            {
                "head": 74,
                "direction": 2
            },
            {
                "head": 75,
                "direction": 2
            }
        ],
        [
            {
                "head": 20,
                "direction": 0
            },
            {
                "head": 21,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 0
            },
            {
                "head": 29,
                "direction": 3
            },
            {
                "head": 30,
                "direction": 0
            },
            {
                "head": 31,
                "direction": 1
            },
            {
                "head": 36,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 0
            },
            {
                "head": 38,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 0
            },
            {
                "head": 40,
                "direction": 0
            },
            {
                "head": 40,
                "direction": 1
            },
            {
                "head": 41,
                "direction": 0
            },
            {
                "head": 42,
                "direction": 1
            },
            {
                "head": 45,
                "direction": 3
            },
            {
                "head": 46,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 3
            },
            {
                "head": 49,
                "direction": 1
            },
            {
                "head": 50,
                "direction": 1
            },
            {
                "head": 51,
                "direction": 1
            },
            {
                "head": 54,
                "direction": 3
            },
            {
                "head": 56,
                "direction": 2
            },
            {
                "head": 56,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 2
            },
            {
                "head": 58,
                "direction": 1
            },
            {
                "head": 58,
                "direction": 2
            },
            {
                "head": 59,
                "direction": 2
            },
            {
                "head": 60,
                "direction": 1
            },
            {
                "head": 66,
                "direction": 2
            },
            {
                "head": 74,
                "direction": 2
            },
            {
                "head": 75,
                "direction": 2
            },
            {
                "head": 76,
                "direction": 2
            }
        ],
        [
            {
                "head": 21,
                "direction": 0
            },
            {
                "head": 22,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 3
            },
            {
                "head": 31,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 1
            },
            {
                "head": 37,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 3
            },
            {
                "head": 40,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 1
            },
            {
                "head": 42,
                "direction": 0
            },
            {
                "head": 43,
                "direction": 1
            },
            {
                "head": 46,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 1
            },
            {
                "head": 51,
                "direction": 1
            },
            {
                "head": 52,
                "direction": 1
            },
            {
                "head": 55,
                "direction": 3
            },
            {
                "head": 56,
                "direction": 2
            },
            {
                "head": 57,
                "direction": 2
            },
            {
                "head": 57,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 2
            },
            {
                "head": 59,
                "direction": 1
            },
            {
                "head": 59,
                "direction": 2
            },
            {
                "head": 60,
                "direction": 2
            },
            {
                "head": 61,
                "direction": 1
            },
            {
                "head": 67,
                "direction": 2
            },
            {
                "head": 75,
                "direction": 2
            },
            {
                "head": 76,
                "direction": 2
            },
            {
                "head": 77,
                "direction": 2
            }
        ],
        [
            {
                "head": 22,
                "direction": 0
            },
            {
                "head": 23,
                "direction": 0
            },
            {
                "head": 24,
                "direction": 0
            },
            {
                "head": 31,
                "direction": 3
            },
            {
                "head": 32,
                "direction": 0
            },
            {
                "head": 33,
                "direction": 1
            },
            {
                "head": 38,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 0
            },
            {
                "head": 40,
                "direction": 0
            },
            {
                "head": 40,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 0
            },
            {
                "head": 42,
                "direction": 0
            },
            {
                "head": 42,
                "direction": 1
            },
            {
                "head": 44,
                "direction": 1
            },
            {
                "head": 47,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 3
            },
            {
                "head": 49,
                "direction": 3
            },
            {
                "head": 51,
                "direction": 1
            },
            {
                "head": 52,
                "direction": 1
            },
            {
                "head": 53,
                "direction": 1
            },
            {
                "head": 56,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 2
            },
            {
                "head": 58,
                "direction": 2
            },
            {
                "head": 58,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 2
            },
            {
                "head": 60,
                "direction": 1
            },
            {
                "head": 60,
                "direction": 2
            },
            {
                "head": 62,
                "direction": 1
            },
            {
                "head": 68,
                "direction": 2
            },
            {
                "head": 76,
                "direction": 2
            },
            {
                "head": 77,
                "direction": 2
            },
            {
                "head": 78,
                "direction": 2
            }
        ],
        [
            {
                "head": 23,
                "direction": 0
            },
            {
                "head": 24,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 3
            },
            {
                "head": 33,
                "direction": 0
            },
            {
                "head": 34,
                "direction": 1
            },
            {
                "head": 39,
                "direction": 3
            },
            {
                "head": 40,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 3
            },
            {
                "head": 42,
                "direction": 0
            },
            {
                "head": 43,
                "direction": 1
            },
            {
                "head": 48,
                "direction": 3
            },
            {
                "head": 49,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 3
            },
            {
                "head": 52,
                "direction": 1
            },
            {
                "head": 53,
                "direction": 1
            },
            {
                "head": 57,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 2
            },
            {
                "head": 59,
                "direction": 2
            },
            {
                "head": 59,
                "direction": 3
            },
            {
                "head": 60,
                "direction": 2
            },
            {
                "head": 61,
                "direction": 1
            },
            {
                "head": 69,
                "direction": 2
            },
            {
                "head": 77,
                "direction": 2
            },
            {
                "head": 78,
                "direction": 2
            }
        ],
        [
            {
                "head": 24,
                "direction": 0
            },
            {
                "head": 35,
                "direction": 1
            },
            {
                "head": 40,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 0
            },
            {
                "head": 42,
                "direction": 0
            },
            {
                "head": 44,
                "direction": 1
            },
            {
                "head": 49,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 3
            },
            {
                "head": 53,
                "direction": 1
            },
            {
                "head": 58,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 2
            },
            {
                "head": 60,
                "direction": 2
            },
            {
                "head": 62,
                "direction": 1
            },
            {
                "head": 78,
                "direction": 2
            }
        ],
        [
            {
                "head": 41,
                "direction": 3
            },
            {
                "head": 42,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 3
            },
            {
                "head": 60,
                "direction": 2
            }
        ],
        [
            {
                "head": 47,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 1
            },
            {
                "head": 57,
                "direction": 1
            },
            {
                "head": 65,
                "direction": 2
            }
        ],
        [
            {
                "head": 29,
                "direction": 0
            },
            {
                "head": 36,
                "direction": 3
            },
            {
                "head": 45,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 0
            },
            {
                "head": 49,
                "direction": 1
            },
            {
                "head": 54,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 1
            },
            {
                "head": 58,
                "direction": 1
            },
            {
                "head": 65,
                "direction": 2
            },
            {
                "head": 66,
                "direction": 2
            }
        ],
        [
            {
                "head": 29,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 0
            },
            {
                "head": 37,
                "direction": 3
            },
            {
                "head": 38,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 1
            },
            {
                "head": 46,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 1
            },
            {
                "head": 49,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 1
            },
            {
                "head": 54,
                "direction": 3
            },
            {
                "head": 55,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 1
            },
            {
                "head": 58,
                "direction": 1
            },
            {
                "head": 59,
                "direction": 1
            },
            {
                "head": 65,
                "direction": 2
            },
            {
                "head": 66,
                "direction": 2
            },
            {
                "head": 67,
                "direction": 2
            },
            {
                "head": 74,
                "direction": 2
            }
        ],
        [
            {
                "head": 29,
                "direction": 0
            },
            {
                "head": 30,
                "direction": 0
            },
            {
                "head": 31,
                "direction": 0
            },
            {
                "head": 38,
                "direction": 3
            },
            {
                "head": 39,
                "direction": 0
            },
            {
                "head": 40,
                "direction": 1
            },
            {
                "head": 45,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 0
            },
            {
                "head": 47,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 0
            },
            {
                "head": 49,
                "direction": 0
            },
            {
                "head": 49,
                "direction": 1
            },
            {
                "head": 50,
                "direction": 0
            },
            {
                "head": 51,
                "direction": 1
            },
            {
                "head": 54,
                "direction": 3
            },
            {
                "head": 55,
                "direction": 3
            },
            {
                "head": 56,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 1
            },
            {
                "head": 59,
                "direction": 1
            },
            {
                "head": 60,
                "direction": 1
            },
            {
                "head": 65,
                "direction": 2
            },
            {
                "head": 66,
                "direction": 2
            },
            {
                "head": 67,
                "direction": 2
            },
            {
                "head": 68,
                "direction": 2
            },
            {
                "head": 75,
                "direction": 2
            }
        ],
        [
            {
                "head": 30,
                "direction": 0
            },
            {
                "head": 31,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 3
            },
            {
                "head": 40,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 1
            },
            {
                "head": 46,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 3
            },
            {
                "head": 49,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 1
            },
            {
                "head": 51,
                "direction": 0
            },
            {
                "head": 52,
                "direction": 1
            },
            {
                "head": 55,
                "direction": 3
            },
            {
                "head": 56,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 1
            },
            {
                "head": 60,
                "direction": 1
            },
            {
                "head": 61,
                "direction": 1
            },
            {
                "head": 65,
                "direction": 2
            },
            {
                "head": 66,
                "direction": 2
            },
            {
                "head": 67,
                "direction": 2
            },
            {
                "head": 68,
                "direction": 2
            },
            {
                "head": 69,
                "direction": 2
            },
            {
                "head": 76,
                "direction": 2
            }
        ],
        [
            {
                "head": 31,
                "direction": 0
            },
            {
                "head": 32,
                "direction": 0
            },
            {
                "head": 33,
                "direction": 0
            },
            {
                "head": 40,
                "direction": 3
            },
            {
                "head": 41,
                "direction": 0
            },
            {
                "head": 42,
                "direction": 1
            },
            {
                "head": 47,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 0
            },
            {
                "head": 49,
                "direction": 0
            },
            {
                "head": 49,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 0
            },
            {
                "head": 51,
                "direction": 0
            },
            {
                "head": 51,
                "direction": 1
            },
            {
                "head": 53,
                "direction": 1
            },
            {
                "head": 56,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 3
            },
            {
                "head": 60,
                "direction": 1
            },
            {
                "head": 61,
                "direction": 1
            },
            {
                "head": 62,
                "direction": 1
            },
            {
                "head": 66,
                "direction": 2
            },
            {
                "head": 67,
                "direction": 2
            },
            {
                "head": 68,
                "direction": 2
            },
            {
                "head": 69,
                "direction": 2
            },
            {
                "head": 77,
                "direction": 2
            }
        ],
        [
            {
                "head": 32,
                "direction": 0
            },
            {
                "head": 33,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 3
            },
            {
                "head": 42,
                "direction": 0
            },
            {
                "head": 43,
                "direction": 1
            },
            {
                "head": 48,
                "direction": 3
            },
            {
                "head": 49,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 3
            },
            {
                "head": 51,
                "direction": 0
            },
            {
                "head": 52,
                "direction": 1
            },
            {
                "head": 57,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 3
            },
            {
                "head": 61,
                "direction": 1
            },
            {
                "head": 62,
                "direction": 1
            },
            {
                "head": 67,
                "direction": 2
            },
            {
                "head": 68,
                "direction": 2
            },
            {
                "head": 69,
                "direction": 2
            },
            {
                "head": 78,
                "direction": 2
            }
        ],
        [
            {
                "head": 33,
                "direction": 0
            },
            {
                "head": 44,
                "direction": 1
            },
            {
                "head": 49,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 0
            },
            {
                "head": 51,
                "direction": 0
            },
            {
                "head": 53,
                "direction": 1
            },
            {
                "head": 58,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 3
            },
            {
                "head": 62,
                "direction": 1
            },
            {
                "head": 68,
                "direction": 2
            },
            {
                "head": 69,
                "direction": 2
            }
        ],
        [
            {
                "head": 50,
                "direction": 3
            },
            {
                "head": 51,
                "direction": 0
            },
            {
                "head": 59,
                "direction": 3
            },
            {
                "head": 69,
                "direction": 2
            }
        ],
        [
            {
                "head": 57,
                "direction": 1
            },
            {
                "head": 74,
                "direction": 2
            }
        ],
        [
            {
                "head": 38,
                "direction": 0
            },
            {
                "head": 45,
                "direction": 3
            },
            {
                "head": 54,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 1
            },
            {
                "head": 74,
                "direction": 2
            },
            {
                "head": 75,
                "direction": 2
            }
        ],
        [
            {
                "head": 38,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 0
            },
            {
                "head": 46,
                "direction": 3
            },
            {
                "head": 47,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 1
            },
            {
                "head": 55,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 1
            },
            {
                "head": 59,
                "direction": 1
            },
            {
                "head": 74,
                "direction": 2
            },
            {
                "head": 75,
                "direction": 2
            },
            {
                "head": 76,
                "direction": 2
            }
        ],
        [
            {
                "head": 38,
                "direction": 0
            },
            {
                "head": 39,
                "direction": 0
            },
            {
                "head": 40,
                "direction": 0
            },
            {
                "head": 47,
                "direction": 3
            },
            {
                "head": 48,
                "direction": 0
            },
            {
                "head": 49,
                "direction": 1
            },
            {
                "head": 54,
                "direction": 3
            },
            {
                "head": 56,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 1
            },
            {
                "head": 60,
                "direction": 1
            },
            {
                "head": 74,
                "direction": 2
            },
            {
                "head": 75,
                "direction": 2
            },
            {
                "head": 76,
                "direction": 2
            },
            {
                "head": 77,
                "direction": 2
            }
        ],
        [
            {
                "head": 39,
                "direction": 0
            },
            {
                "head": 40,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 3
            },
            {
                "head": 49,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 1
            },
            {
                "head": 55,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 1
            },
            {
                "head": 61,
                "direction": 1
            },
            {
                "head": 74,
                "direction": 2
            },
            {
                "head": 75,
                "direction": 2
            },
            {
                "head": 76,
                "direction": 2
            },
            {
                "head": 77,
                "direction": 2
            },
            {
                "head": 78,
                "direction": 2
            }
        ],
        [
            {
                "head": 40,
                "direction": 0
            },
            {
                "head": 41,
                "direction": 0
            },
            {
                "head": 42,
                "direction": 0
            },
            {
                "head": 49,
                "direction": 3
            },
            {
                "head": 50,
                "direction": 0
            },
            {
                "head": 51,
                "direction": 1
            },
            {
                "head": 56,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 3
            },
            {
                "head": 60,
                "direction": 1
            },
            {
                "head": 62,
                "direction": 1
            },
            {
                "head": 75,
                "direction": 2
            },
            {
                "head": 76,
                "direction": 2
            },
            {
                "head": 77,
                "direction": 2
            },
            {
                "head": 78,
                "direction": 2
            }
        ],
        [
            {
                "head": 41,
                "direction": 0
            },
            {
                "head": 42,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 3
            },
            {
                "head": 51,
                "direction": 0
            },
            {
                "head": 52,
                "direction": 1
            },
            {
                "head": 57,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 3
            },
            {
                "head": 61,
                "direction": 1
            },
            {
                "head": 76,
                "direction": 2
            },
            {
                "head": 77,
                "direction": 2
            },
            {
                "head": 78,
                "direction": 2
            }
        ],
        [
            {
                "head": 42,
                "direction": 0
            },
            {
                "head": 53,
                "direction": 1
            },
            {
                "head": 58,
                "direction": 3
            },
            {
                "head": 62,
                "direction": 1
            },
            {
                "head": 77,
                "direction": 2
            },
            {
                "head": 78,
                "direction": 2
            }
        ],
        [
            {
                "head": 59,
                "direction": 3
            },
            {
                "head": 78,
                "direction": 2
            }
        ],
        [],
        [
            {
                "head": 47,
                "direction": 0
            },
            {
                "head": 54,
                "direction": 3
            }
        ],
        [
            {
                "head": 47,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 0
            },
            {
                "head": 55,
                "direction": 3
            },
            {
                "head": 57,
                "direction": 1
            }
        ],
        [
            {
                "head": 47,
                "direction": 0
            },
            {
                "head": 48,
                "direction": 0
            },
            {
                "head": 49,
                "direction": 0
            },
            {
                "head": 56,
                "direction": 3
            },
            {
                "head": 58,
                "direction": 1
            }
        ],
        [
            {
                "head": 48,
                "direction": 0
            },
            {
                "head": 49,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 0
            },
            {
                "head": 57,
                "direction": 3
            },
            {
                "head": 59,
                "direction": 1
            }
        ],
        [
            {
                "head": 49,
                "direction": 0
            },
            {
                "head": 50,
                "direction": 0
            },
            {
                "head": 51,
                "direction": 0
            },
            {
                "head": 58,
                "direction": 3
            },
            {
                "head": 60,
                "direction": 1
            }
        ],
        [
            {
                "head": 50,
                "direction": 0
            },
            {
                "head": 51,
                "direction": 0
            },
            {
                "head": 59,
                "direction": 3
            },
            {
                "head": 61,
                "direction": 1
            }
        ],
        [
            {
                "head": 51,
                "direction": 0
            },
            {
                "head": 62,
                "direction": 1
            }
        ],
        []
    ];

    // private testIsResultOrNot(data, headList) {
    //     for (let i = 0; i < headList.length; i++) {
    //         if () {
    //             return false
    //         }
    //     }
    //     return true;
    // }
    public hitList() {
        let types = [];
        let grids = [];
        let result;
        let times = 0;
        do {
            times++;
            result = this.computeWhersIsPlane(this.initCamputeMapByList(types, grids));
            grids.push(result);
            if (result != -1) {
                types.push(this.testMap.getMapGridById(result).gridType);
            }

        } while (result != -1 && times < 30);
        return grids;
    }

    private testMap: MapData;

    public whereToHit(status) {
        // let puzzleData = this.initCamputeMapByList(1, 40);
        // console.log(puzzleData.knownBodyGrid);
        // console.log(puzzleData.knownHeadGrid);
        // console.log(puzzleData.knownMissGrid);
        // let result = this.computeWhersIsPlane(puzzleData);
        // console.log(result);
        this.testMap = AIController.getInstance().generateRandomMap();
        let headList = this.testMap.getHeadList();
        for (let i = 0; i < 3; i++) {
            this.testMap.setPlaneGridByHead(headList[i].head, headList[i].direction);
        }

        // for (let k = 0; k <= GridTypeEnum.HEAD; k++) {
        //     types.push(k);
        //     // for (let l = 0; l <= GridTypeEnum.HEAD; l++) {

        //     if (result === 0) {
        //         break;
        //     }
        //     grids.push(result)
        // }
    }

    public initCamputeMapByList(types, status) {
        let puzzleData = new PuzzleMapData();
        puzzleData.initStatusByList(types, status);
        return puzzleData;
    }

    public initCamputeMapByIdStatus(mapId, status) {
        let data = new MapData();
        let headList = MapUtil.headIdToHeadData(mapId);
        for (let i = 0; i < 3; i++) {
            data.setPlaneGridByHead(headList[i].head, headList[i].direction);
        }
        let puzzleData = new PuzzleMapData();
        puzzleData.initStatus(data, status);
        return puzzleData;
    }


    public computeWhersIsPlane(puzzleData: PuzzleMapData) {
        // 获取已知条件

        // let knownBodyGrid = [];
        // let knownHeadGrid = [];
        // let knownMissGrid = [];

        // for (let i = 0; i < status.length; i = i + 2) {
        //     let value = Number(status.slice(i, i + 2));
        //     if (data.getMapGridById(value).gridType == GridTypeEnum.HEAD) {
        //         knownHeadGrid.push(value);
        //         puzzleData.setMapGridTypeByValue(value, GridTypeEnum.AI_KNOWNHEAD);
        //     } else if (data.getMapGridById(value).gridType == GridTypeEnum.BODY) {
        //         knownBodyGrid.push(value);
        //         puzzleData.setMapGridTypeByValue(value, GridTypeEnum.AI_KNOWNBODY);
        //     } else if (data.getMapGridById(value).gridType == GridTypeEnum.MISS) {
        //         knownMissGrid.push(value);
        //         puzzleData.setMapGridTypeByValue(value, GridTypeEnum.AI_KNOWNMISS);
        //     }
        // }


        if (puzzleData.knownHeadGrid.length === 3) {
            // return 1;
            // return puzzleData.knownHeadGrid;
            return -1
        }
        for (let i = 0; i < puzzleData.knownHeadGrid.length; i++) {
            if (!MapUtil.checkHeadValid(puzzleData.knownHeadGrid[i])) {
                return 0;
            }
        }
        for (let i = 0; i < puzzleData.knownBodyGrid.length; i++) {
            if (!MapUtil.checkBodyValid(puzzleData.knownHeadGrid[i])) {
                return 0;
            }
        }

        // console.log(puzzleData.knownMissGrid, puzzleData.knownBodyGrid, puzzleData.knownHeadGrid);
        let headAndMiss = puzzleData.knownHeadGrid.concat(puzzleData.knownMissGrid);
        let bodyAndMiss = puzzleData.knownBodyGrid.concat(puzzleData.knownMissGrid);
        // console.log(headAndMiss);

        // 准备临时数据
        let temp_gridIsHeadPlaneDirection = this.computeAllHead();

        for (let i = 0; i < bodyAndMiss.length; i++) {
            temp_gridIsHeadPlaneDirection[bodyAndMiss[i]] = [];
        }

        // 处理已知MISS
        for (let i = 0; i < headAndMiss.length; i++) {
            let gridValue = headAndMiss[i];
            // if (puzzleData.knownMissGrid.indexOf(gridValue) != -1) {
            //     temp_gridIsHeadPlaneDirection[gridValue] = [];
            // }
            for (let j = 0; j < this.allHeadDirectionByBody[gridValue].length; j++) {
                let removeHead = this.allHeadDirectionByBody[gridValue][j].head;
                let removeDirection = this.allHeadDirectionByBody[gridValue][j].direction;
                let index = temp_gridIsHeadPlaneDirection[removeHead].indexOf(removeDirection);
                if (index != -1) {
                    temp_gridIsHeadPlaneDirection[removeHead].splice(index, 1);
                }
            }
        }
        let allMaybe = [];
        let knownHeadMaybeList = [];
        for (let i = 0; i < temp_gridIsHeadPlaneDirection.length; i++) {
            let tempHeadMaybe = [];
            for (let j = 0; j < temp_gridIsHeadPlaneDirection[i].length; j++) {
                if (puzzleData.knownHeadGrid.indexOf(i) !== -1) {
                    tempHeadMaybe.push({
                        head: i,
                        direction: temp_gridIsHeadPlaneDirection[i][j]
                    })
                } else {
                    allMaybe.push({
                        head: i,
                        direction: temp_gridIsHeadPlaneDirection[i][j]
                    })
                }
            }
            if (tempHeadMaybe.length > 0) {
                knownHeadMaybeList.push(tempHeadMaybe);
            }
        }

        let list1, list2, list3;
        let list1IsHead = false;
        let list2IsHead = false;
        if (knownHeadMaybeList.length > 0) {
            list1 = knownHeadMaybeList[0];
            list1IsHead = true;
        } else {
            list1 = allMaybe;
        }

        if (knownHeadMaybeList.length > 1) {
            list2 = knownHeadMaybeList[1];
            list2IsHead = true;
        } else {
            list2 = allMaybe;
        }

        list3 = allMaybe;
        // console.log(list3);
        let max = 0;
        let index = -1;
        let list = [];
        for (let i = 0; i < temp_gridIsHeadPlaneDirection.length; i++) {
            if (temp_gridIsHeadPlaneDirection[i].length > max && puzzleData.knownHeadGrid.indexOf(i) == -1) {
                max = temp_gridIsHeadPlaneDirection[i].length;
                // index = i;
                list = [i];
            } else if (temp_gridIsHeadPlaneDirection[i].length == max && puzzleData.knownHeadGrid.indexOf(i) == -1) {
                list.push(i);
            }
        }
        if (list.length == 0) {
            return -1;
        }
        return ArrayUtil.random(list, 1)[0];
        // console.log(temp_gridIsHeadPlaneDirection.length);
        // console.log(new Date().getTime());
        let result = [];
        for (let i = 0; i < list1.length; i++) {
            if (!puzzleData.setPlaneGridByHead(list1[i].head, list1[i].direction, 0)) {
                continue;
            }
            for (let j = 0; j < list2.length; j++) {
                if (!list1IsHead && list1[i].head >= list2[j].head) {
                    continue;
                }
                if (!puzzleData.setPlaneGridByHead(list2[j].head, list2[j].direction, 1)) {
                    continue;
                }
                for (let k = 0; k < list3.length; k++) {
                    if (!list1IsHead && list1[i].head >= list3[k].head) {
                        continue;
                    }
                    if (!list2IsHead && list2[j].head >= list3[k].head) {
                        continue;
                    }
                    if (!puzzleData.setPlaneGridByHead(list3[k].head, list3[k].direction, 2)) {
                        continue;
                    }
                    if (puzzleData.checkAllBodyIsUsed()) {
                        result.push([list1[i], list2[j], list3[k]]);
                    }
                    puzzleData.resetPlane(list3[k], 2);
                }
                if (list2.length > 1) {
                    puzzleData.resetPlane(list2[j], 1);
                }
            }
            if (list1.length > 1) {
                puzzleData.resetPlane(list1[i], 0);
            }
        }
        // console.log(new Date().getTime());
        // console.log(result);

        return result.length;

        // let planes = [];
        // let headNumber = knownHeadGrid.length;

        // let certainOne = false;
        // let certainTow = false;

        // let planeBodyList = [[], [], []];

        // for (let i = 0; i < headNumber; i++) {
        //     for (let j = 0; j < temp_gridIsHeadPlaneDirection[knownHeadGrid[i]].length; j++) {
        //         planeMaybeList[i].push({
        //             head: knownHeadGrid[i],
        //             direction: temp_gridIsHeadPlaneDirection[knownHeadGrid[i]][j]
        //         });
        //     }
        //     if (planeMaybeList[i].length === 1) {
        //         console.log("第一阶段就有飞机确定");
        //         let list = this.getBodyByHeadDirection(planeMaybeList[i][0].head, planeMaybeList[i][0].direction)
        //         this.setGridsCertainType(puzzleData, list);
        //         if (i == 0) {
        //             planes.push({
        //                 head: planeMaybeList[i][0].head, direction: planeMaybeList[i][0].direction
        //             });
        //             certainOne = true;
        //             planeBodyList[0] = list;
        //         }
        //         if (i == 1) {
        //             planes.push({
        //                 head: planeMaybeList[i][0].head, direction: planeMaybeList[i][0].direction
        //             });
        //             certainTow = true;
        //             planeBodyList[1] = list;
        //         }
        //     }
        // }
        // let result = [];
        // let list1;
        // let list2;
        // let list3;
        // // 如果有头 那么开始算头
        // if (planeMaybeList[0].length > 0) {
        //     // while (planeMaybeList[0].length > 0) {
        //     for (let i = 0; i < planeMaybeList[0].length; i++) {
        //         let plane1 = {
        //             head: planeMaybeList[0][i]["head"],
        //             direction: planeMaybeList[0][i]["direction"]
        //         };
        //         if (certainOne) {

        //         } else {
        //             if (certainTow) {
        //                 if (this.checkValid(puzzleData, plane1["head"], plane1["direction"])) {
        //                     this.cancelGridsTempType(puzzleData, list1, 0);
        //                     list1 = this.getBodyByHeadDirection(plane1["head"], plane1["direction"])
        //                     this.setGridsTempType(puzzleData, list1, 0);
        //                     planeBodyList[0] = list1;
        //                 } else {
        //                     continue;
        //                 };
        //             } else {
        //                 this.cancelGridsTempType(puzzleData, list1, 0);
        //                 list1 = this.getBodyByHeadDirection(plane1["head"], plane1["direction"])
        //                 this.setGridsTempType(puzzleData, list1, 0);
        //                 planeBodyList[0] = list1;
        //             }
        //         }
        //         if (planeMaybeList[1].length > 0) {
        //             for (let j = 0; j < planeMaybeList[1].length; i++) {
        //                 let plane2 = {
        //                     head: planeMaybeList[1][j]["head"],
        //                     direction: planeMaybeList[1][j]["direction"]
        //                 };
        //                 if (certainTow) {
        //                 } else {
        //                     if (certainOne) {
        //                         if (this.checkValid(puzzleData, plane2["head"], plane2["direction"])) {
        //                             list2 = this.getBodyByHeadDirection(plane2["head"], plane2["direction"])
        //                             this.setGridsTempType(puzzleData, list2, 1);
        //                             planeBodyList[1] = list2;
        //                         } else {
        //                             continue;
        //                         }
        //                     } else {
        //                         if (this.checkValid(puzzleData, plane2["head"], plane2["direction"])) {
        //                             list2 = this.getBodyByHeadDirection(plane2["head"], plane2["direction"])
        //                             this.setGridsTempType(puzzleData, list2, 1);
        //                             planeBodyList[1] = list2;
        //                         } else {
        //                             continue;
        //                         }
        //                     }
        //                 }
        //                 for (let k = 0; k < knownBodyGrid.length; k++) {
        //                     let plane3;
        //                     if (puzzleData.getMapGridById(knownBodyGrid[k]).gridType == GridTypeEnum.AI_KNOWNBODY) {
        //                         for (let l = 0; l < this.allHeadDirectionByBody[knownBodyGrid[k]].length; l++) {
        //                             plane3 = {
        //                                 head: this.allHeadDirectionByBody[knownBodyGrid[k]][l].head,
        //                                 direction: this.allHeadDirectionByBody[knownBodyGrid[k]][l].direction
        //                             }
        //                             console.log(this.allHeadDirectionByBody[knownBodyGrid[k]][l].head, this.allHeadDirectionByBody[knownBodyGrid[k]][l].direction);
        //                             if (temp_gridIsHeadPlaneDirection[plane3.head].length > 0) {
        //                                 if (this.checkValid(puzzleData, plane3.head, plane3.dirction)) {
        //                                     list3 = this.getBodyByHeadDirection(this.allHeadDirectionByBody[knownBodyGrid[k]][l].head, this.allHeadDirectionByBody[knownBodyGrid[k]][l].direction)
        //                                     this.setGridsTempType(puzzleData, list3, 2);
        //                                     if (this.checkAllBodyUsed(puzzleData, knownBodyGrid)) {
        //                                         planes.push(plane3);
        //                                     } else {
        //                                         this.cancelGridsTempType(puzzleData, list3, 2);
        //                                     }
        //                                 }
        //                             }

        //                         }
        //                     }
        //                 }
        //             }
        //         } else {
        //             while (headNumber < 3) {
        //                 for (let i = 0; i <  ) {

        //                 }
        //             }

        //             for (let k = 0; k < knownBodyGrid.length; k++) {
        //                 if (puzzleData.getMapGridById(knownBodyGrid[k]).gridType == GridTypeEnum.AI_KNOWNBODY) {
        //                     for (let l = 0; l < this.allHeadDirectionByBody[knownBodyGrid[k]].length; l++) {
        //                         let temp2Head = this.allHeadDirectionByBody[knownBodyGrid[k]][l].head;
        //                         let temp2Direction = this.allHeadDirectionByBody[knownBodyGrid[k]][l].direction;
        //                         if (temp_gridIsHeadPlaneDirection[temp2Head].length > 0) {
        //                             if (this.checkValid(puzzleData, temp2Head, temp2Direction)) {
        //                                 let list2 = this.getBodyByHeadDirection(temp2Head, temp2Direction)
        //                                 this.setGridsTempType(puzzleData, list2, 2);
        //                                 for (let i = 0; i < knownBodyGrid.length; i++) {
        //                                     if (puzzleData.getMapGridById(knownBodyGrid[k]).gridType == GridTypeEnum.AI_KNOWNBODY) {
        //                                         for (let j = 0; j < this.allHeadDirectionByBody[knownBodyGrid[i]].length; j++) {
        //                                             let temp3Head = this.allHeadDirectionByBody[knownBodyGrid[i]][j].head;
        //                                             let temp3Direction = this.allHeadDirectionByBody[knownBodyGrid[i]][j].direction
        //                                             if (temp_gridIsHeadPlaneDirection[temp3Head].length > 0) {
        //                                                 if (this.checkValid(puzzleData, temp3Head, temp3Direction)) {
        //                                                     let list = this.getBodyByHeadDirection(temp3Head, temp3Direction)
        //                                                     this.setGridsTempType(puzzleData, list, 2);
        //                                                     if (this.checkAllBodyUsed(puzzleData, knownBodyGrid)) {
        //                                                         let plane2 = {
        //                                                             head: temp2Head,
        //                                                             direction: temp2Direction
        //                                                         }
        //                                                         let plane3 = {
        //                                                             head: temp3Head,
        //                                                             direction: temp3Direction
        //                                                         }
        //                                                         result.push([plane1, plane2, plane3]);
        //                                                     }
        //                                                 } else {
        //                                                     let list3 = this.getBodyByHeadDirection(temp3Head, temp3Direction)
        //                                                     this.cancelGridsTempType(puzzleData, list3, 2);
        //                                                 }
        //                                             }
        //                                         }
        //                                     }
        //                                 }
        //                                 this.cancelGridsTempType(puzzleData, list2, 1);
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }

        //     }
        // } else {
        //     // 已知身体信息计算添加飞机 判断格子是否被占用或者是否为已知空
        //     // 一个头都没有的情况，先将身体位置排序
        //     let sortKnownBodyGrid;
        //     if (knownBodyGrid.length > 10) {
        //         let sortAllBody = this.gridIsBodyHowManyCanBeHead();
        //         sortKnownBodyGrid = knownBodyGrid.sort((a, b) => {
        //             return sortAllBody.indexOf(a) - sortAllBody.indexOf(b);
        //         });
        //     } else {
        //         sortKnownBodyGrid = knownBodyGrid;
        //     }
        //     for (let m = 0; m < sortKnownBodyGrid.length; m++) {
        //         if (puzzleData.getMapGridById(sortKnownBodyGrid[m]).gridType == GridTypeEnum.AI_KNOWNBODY) {
        //             for (let n = 0; n < this.allHeadDirectionByBody[sortKnownBodyGrid[m]].length; n++) {
        //                 let temp1Head = this.allHeadDirectionByBody[sortKnownBodyGrid[m]][n].head;
        //                 let temp1Direction = this.allHeadDirectionByBody[sortKnownBodyGrid[m]][n].direction;
        //                 console.log(temp1Head, temp1Direction);
        //                 if (temp_gridIsHeadPlaneDirection[temp1Head].length > 0) {
        //                     if (this.checkValid(puzzleData, temp1Head, temp1Direction)) {
        //                         // planes.push();
        //                         let list = this.getBodyByHeadDirection(temp1Head, temp1Direction)
        //                         this.setGridsTempType(puzzleData, list, 0);
        //                         //第二架飞机
        //                         for (let k = 0; k < sortKnownBodyGrid.length; k++) {
        //                             if (puzzleData.getMapGridById(sortKnownBodyGrid[m]).gridType == GridTypeEnum.AI_KNOWNBODY) {
        //                                 for (let l = 0; l < this.allHeadDirectionByBody[sortKnownBodyGrid[k]].length; l++) {
        //                                     let temp2Head = this.allHeadDirectionByBody[sortKnownBodyGrid[k]][l].head;
        //                                     let temp2Direction = this.allHeadDirectionByBody[sortKnownBodyGrid[k]][l].direction;
        //                                     console.log(temp2Head, temp2Direction);
        //                                     if (temp_gridIsHeadPlaneDirection[temp2Head].length > 0) {
        //                                         if (this.checkValid(puzzleData, temp2Head, temp2Direction)) {
        //                                             // planes.push(plane2);
        //                                             let list = this.getBodyByHeadDirection(temp2Head, temp2Direction)
        //                                             this.setGridsTempType(puzzleData, list, 1);
        //                                             // 第三个飞机
        //                                             for (let i = 0; i < sortKnownBodyGrid.length; i++) {
        //                                                 if (puzzleData.getMapGridById(sortKnownBodyGrid[m]).gridType == GridTypeEnum.AI_KNOWNBODY) {
        //                                                     for (let j = 0; j < this.allHeadDirectionByBody[sortKnownBodyGrid[i]].length; j++) {
        //                                                         let temp3Head = this.allHeadDirectionByBody[sortKnownBodyGrid[i]][j].head;
        //                                                         let temp3Direction = this.allHeadDirectionByBody[sortKnownBodyGrid[i]][j].direction;
        //                                                         console.log(temp3Head, temp3Direction);
        //                                                         if (temp_gridIsHeadPlaneDirection[temp2Head].length > 0) {
        //                                                             if (this.checkValid(puzzleData, temp3Head, temp3Direction)) {
        //                                                                 // planes.push(plane3);
        //                                                                 let list = this.getBodyByHeadDirection(temp3Head, temp3Direction)
        //                                                                 this.setGridsTempType(puzzleData, list, 2);
        //                                                                 if (this.checkAllBodyUsed(puzzleData, sortKnownBodyGrid)) {


        //                                                                     // plane3 = {
        //                                                                     //     head: temp3Head,
        //                                                                     //     direction: temp3Direction
        //                                                                     // }
        //                                                                     // result.push([plane1, plane2, plane3]);
        //                                                                 }
        //                                                             }
        //                                                         }
        //                                                     }
        //                                                 }

        //                                             }
        //                                         }
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 } else {
        //                     continue
        //                 }
        //             }
        //         }
        //     }
        // }
        // console.log(result);

        // return;
    }

    checkAllBodyUsed(data, list) {
        for (let i = 0; i < list.length; i++) {
            if (data.getMapGridById(list[i]).gridType == GridTypeEnum.AI_KNOWNBODY) {
                return false
            }
        }
        return true;
    }

    setGridsCertainType(data: MapData, list) {
        for (let i = 0; i < list.length; i++) {
            data.setMapGridTypeByValue(list[i], GridTypeEnum.AI_KNOWNCERTAINBODY);
        }
    }

    cancelGridsTempType(data: MapData, list, index) {
        for (let i = 0; i < list.length; i++) {
            if (data.getMapGridById(list[i]).gridType == GridTypeEnum.AI_KNOWNTEMPBODY1 + index) {
                data.setMapGridTypeByValue(list[i], GridTypeEnum.AI_KNOWNBODY);
            }
            if (data.getMapGridById(list[i]).gridType == GridTypeEnum.AI_TEMPBODY1 + index) {
                data.setMapGridTypeByValue(list[i], GridTypeEnum.MISS);
            }
        }
    }

    setGridsTempType(data: MapData, list, index) {
        for (let i = 0; i < list.length; i++) {
            if (data.getMapGridById(list[i]).gridType == GridTypeEnum.AI_KNOWNBODY) {
                data.setMapGridTypeByValue(list[i], GridTypeEnum.AI_KNOWNTEMPBODY1 + index);
            }
            if (data.getMapGridById(list[i]).gridType == GridTypeEnum.MISS) {
                data.setMapGridTypeByValue(list[i], GridTypeEnum.AI_TEMPBODY1 + index);
            }
        }
    }

    getBodyByHeadDirection(head, direction) {
        let result = [];
        let list = DirectionTypeEnum.getGridByDirection(direction);
        for (let i = 0; i < list.length; i++) {
            result.push(list[i] + head);
        }
        return result;
    }

    /**
     * 检查防止飞机的格子，若其中有的格子已经放置过飞机，则返回false。
     * return true:表示这些所有格子都可以防止飞机。
     */
    checkValid(map: MapData, head: number, direction: number): boolean {
        let pos = MapUtil.getXYFromValue(head);
        let type = map.getMapGridByXY(pos.x, pos.y).gridType;
        if (type == GridTypeEnum.MISS || type == GridTypeEnum.AI_KNOWNHEAD) {
            var plane: number[] = DirectionTypeEnum.getGridByDirection(direction);
            for (var i = 0; i < plane.length; i++) {
                if (type == GridTypeEnum.MISS || type == GridTypeEnum.AI_KNOWNBODY) {
                    continue;
                } else {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    public startRobotMatch() {
        this.robotBullet = 0;
        let robotData = PlayerController.getInstance().getStoredOpponent();

        let robot_map_time = 5000 + Math.random() * 5000;
        this.map_timer = new egret.Timer(robot_map_time, 1);
        this.map_timer.addEventListener(egret.TimerEvent.TIMER, this.onMapComplete, this);
        this.map_timer.start();
    }

    public onMapComplete() {
        this.map_timer.removeEventListener(egret.TimerEvent.TIMER, this.onMapComplete, this);
        let headList = AIController.getInstance().generateRandomMap().getHeadList();
        let mapId = MapUtil.headDataToHeadId(headList);
        let data = [JSON.stringify({ code: ServerController.MSG_GOTMAP, mapId: mapId, openId: "robotId" })];
        let res = {
            actionList: data
        };
        ServerController.getInstance().onSyncFrame(res);
    }

    public camputeRobotHitList() {
        this.testMap = PlayerController.getInstance().getMyMap();
        this.AIHitList = this.hitList();
    }

    public onRobotGameStart() {
        egret.setTimeout(this.onHitTimer, this, 5000);
        egret.setTimeout(this.onHitTimer, this, 3500);
        egret.setTimeout(this.onHitTimer, this, 1500);
    }

    public hitGrid() {
        let robot_hit_time = Math.random() * 3000;
        this.hit_timer = new egret.Timer(robot_hit_time, 1);
        this.hit_timer.addEventListener(egret.TimerEvent.TIMER, this.onHitTimer, this);
        this.hit_timer.start();
    }

    private onHitTimer() {
        console.log("进入这个timer");
        if (this.AIHitList.length == 0 || this.AIHitList[0] == -1) {
            this.hit_timer.removeEventListener(egret.TimerEvent.TIMER, this.onHitTimer, this);
            return;
        }
        let grid = this.AIHitList[0];
        this.AIHitList.shift();
        let isWin = false;
        if (this.robotBullet == 20) {
            let data = [JSON.stringify({ code: ServerController.MSG_BULLETUP, openId: "robotId" }), JSON.stringify({ code: ServerController.MSG_BULLETUP, openId: "robotId" })];
            let res = {
                actionList: data
            };
            ServerController.getInstance().onSyncFrame(res);
            ServerController.getInstance().areYouGoOn = false;
            this.hit_timer.removeEventListener(egret.TimerEvent.TIMER, this.onHitTimer, this);
            return;
        }
        this.robotBullet++;
        let data = [JSON.stringify({ code: ServerController.MSG_HITGRID, grid: grid, bullet: BulletTypeEnum.MISSILE, openId: "robotId" }), JSON.stringify({ code: ServerController.MSG_EFFECTGRID, effectList: [grid], openId: "robotId" })];
        let res = {
            actionList: data
        };
        ServerController.getInstance().onSyncFrame(res);
        if (grid != -1 && this.AIHitList[0] == -1) {
            let data = [JSON.stringify({ code: ServerController.MSG_WINGAME, openId: "robotId" })];
            let res = {
                actionList: data
            };
            ServerController.getInstance().onSyncFrame(res);
            ServerController.getInstance().areYouGoOn = false;
            return;
        }
    }

    private AIMapData: MapData;
    private AIHitList;

    private robotBullet = 0

    private map_timer: egret.Timer;

    private hit_timer: egret.Timer;


    /**
     * 打飞机的策略 
     * 提示
     */
    public AIPlayGame() {
        if (RecordController.getInstance().bulletUsed < 15) {
            return GameController.getInstance().getPlaneGridUnhit();
        } else {
            return GameController.getInstance().getPlaneHeadUnhit();
        }
    }

    /**
     * AI 
     * 智能提示
     */
    public AITellYouWhereIsPlane() {
        // 炮弹数字超过15个之后
        // 寻找三个飞机被打的次数
        // 返回一个被打次数最多且没被找到的头部
        // if () {

        // }

        // 炮弹数字超过10个之后
        // 寻找三个飞机被打的次数
        // 不返回没有被击中过的头部 返回身子
    }

    /**
     * 
     */
    public newPlayer() {
        let player = new PlayerData();
        player.setData(Const.getInstance().player);
        // let userInfo = platform.getUserInfo();
        // userInfo["name"] != undefined ? userInfo["name"]:
        player.player_name = i18n.getLanguage(i18n.PLAYER_COMMAN_NAME);
        return player;
    }

    /**
     * 机器玩家
     */
    public robotPlayer() {

        let msgValue = [];
        let level = PlayerController.getInstance().getData().level + Math.floor(Math.random() * 4) - 2;
        level = level > 0 ? level : 1;
        msgValue = [
            level,                 // 等级
            Math.floor(Math.random() * Math.pow(4, 16 - level)),    // 排名
            Math.floor(level * 100 * Math.random()),                // 城市积分
            Math.floor(level * 1000 * Math.random()) * 10,           // 可掠夺金币
            Math.floor(level * 100 * Math.random()),                // 被进攻次数
            (40 + (Math.random() * 20)).toFixed(2) + "%",           // 平均S率 //胜率
            Math.floor((Math.random()) * 11) + 8                    // 摧毁炮数
        ]
        let robot = new PlayerData()
        robot.setData({
            level: msgValue[0],
            rank: msgValue[1],
            win_game: Math.floor((40 + (Math.random() * 40)) * 100),
            total_game: 10000,
            missle: msgValue[6]
        });
        robot.player_name = "匿名玩家";
        robot.gold = msgValue[3];
        return robot;
    }

    saveRobotPlayer() {

    }

    //------------------ 智能广告 ------------------
    /**
     * 
     */
}