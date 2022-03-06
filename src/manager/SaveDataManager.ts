/**
 * 存档
 */
class SaveDataManager {

    private static instance: SaveDataManager = null;

    constructor() {
    }

    private userData: UserData = null;


    public static getInstance() {
        if (this.instance === null) {
            this.instance = new SaveDataManager();
        }
        return this.instance;
    }

    public getUserData() {
        if (!this.userData) {
            this.userData = new UserData();
            this.userData.initData();
        }
        return this.userData;
    }

    public saveUserData() {
        this.userData.saveUserData();
    }

    public getCollection() {
        let saved = this.getFromLocal("collection");
        let collection;
        if (saved == undefined || saved == "") {
            collection = [];
        } else {
            collection = JSON.parse(saved);
        }
        return collection;
    }

    public saveCollection(collection) {
        this.saveToLocal("collection", JSON.stringify(collection));
    }

    public getHistory() {
        let saved = this.getFromLocal("history");
        let history;
        if (saved == undefined || saved == "") {
            history = [];
        } else {
            history = JSON.parse(saved)
        }
        return history.slice(0, 10);
    }

    public savePuzzle(data) {
        let puzzle = this.getPuzzle();
        puzzle.push(data)
        this.saveToLocal("puzzle", JSON.stringify(puzzle));
    }

    public getPuzzle() {
        let saved = this.getFromLocal("puzzle");
        let puzzle;
        if (saved == undefined || saved == "") {
            puzzle = [];
        } else {
            puzzle = JSON.parse(saved)
        }
        return puzzle;
    }

    public saveHistory(id, hitHistory, bullet) {
        let history = this.getHistory();
        // if (history.length == 10) {
        //     history.pop();
        // }
        history.unshift({ id: id, history: hitHistory, bullet: bullet, date: new Date().getTime(), wow: RecordController.getInstance().getEachRound() });
        this.saveToLocal("history", JSON.stringify(history));
        HistoryController.getInstance().updateHistory();
    }

    public getFromLocal(tag): string {
        return egret.localStorage.getItem(tag);
    }

    public saveToLocal(tag, data) {
        egret.localStorage.setItem(tag, data);
    }


    /**
     * 声音存储
     * status: "1" playing "0" silence
     */
    public saveSoundStatus(status) {
        egret.localStorage.setItem("soundPlaying", status);
    }

    public getSoundStatus() {
        return egret.localStorage.getItem("soundPlaying");
    }

    /**
     * 语言设置
     */
    public getLang() {
        return egret.localStorage.getItem("lang")
    }

    public setLang(lang) {
        egret.localStorage.setItem("lang", lang);
    }

    /**
     * 
     */
    public getGuide() {
        return this.userData.guide;
    }

    public setGuide(data) {
        this.userData.guide = data;
        this.userData.saveUserData();
    }

}
