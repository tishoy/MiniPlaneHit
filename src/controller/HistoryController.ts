/**
 * 历史回顾
 * creat by tishoy
 * 2019.4.12
 */

class HistoryController {
    private static instance: HistoryController = null;
    private current = 0;

    constructor() {
        if (HistoryController.instance) {
            throw new Error("AIController singlon error")
        }
        this.init();
    }

    private reverseData = [];
    private historyData = [];

    private init() {
        this.historyData = SaveDataManager.getInstance().getHistory();
        this.reverseData = SaveDataManager.getInstance().getHistory().reverse();
    }

    public getHistory() {
        return this.historyData;
    }

    public updateHistory() {
        this.current = 0;
        this.reverseData.push(SaveDataManager.getInstance().getHistory()[0]);
        SceneManager.getInstance().historyScene.updateMapList(this.reverseData[this.reverseData.length - 1]);
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new HistoryController();
        }
        return this.instance;
    }

    public get currentHistory() {
        if (this.reverseData.length > 0) {
            return this.reverseData[this.current];
        }
        return null;
    }

    public pre() {
        if (this.current <= 0) {
            this.current = 0;
            return false
        }
        else if (this.current > 0) {
            this.current--;
            return true
        }
    }

    public next() {
        if (this.current >= this.reverseData.length - 1) {
            this.current = this.reverseData.length - 1;
            return false;
        } else if (this.current < this.reverseData.length - 1) {
            this.current++;
            return true;
        }

    }

    public get currentHistoryHeads() {
        return this.reverseData[this.current].id;
    }

    public get currentHistoryTime() {
        return this.reverseData[this.current].time;
    }

    public getCurrentHistoryBullet(index) {
        return MapUtil.bulletParse(this.reverseData[this.current]["bullet"], index);
    }

    public getCurrentHistoryHit(index) {
        return MapUtil.statusParse(this.reverseData[this.current]["history"], index);
    }

    public getOpenGrid(index) {
        return this.reverseData[this.current]["wow"][index];
    }

    public isValidBullet(amount) {
        if (amount < this.reverseData[this.current]["history"].length / 2) {
            return true;
        } else {
            return false;
        }
    }

    public selectHistoryMap(selectedId) {
        this.current = selectedId;
    }

}