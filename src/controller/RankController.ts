/**
 * creat by tishoy
 * 2019.4.12
 */
class RankController {
    private static instance: RankController = null;

    private rank;

    constructor() {
        if (RankController.instance) {
            throw new Error("AIController singlon error")
        }
        this.init();
    }

    private init() {
        // this.rank = 
        
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new RankController();
        }
        return this.instance;
    }

    public randomRankData() {

    }

    // public 

    // public update

}