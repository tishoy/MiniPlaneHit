class PlayerData {
    private _id;
    public level;
    private _player_name;
    private _avatar
    public rank;
    public missle;
    public total_game;
    public win_game;
    public total_puzzle;
    public win_puzzle;
    private _mapId;
    private _gold;

    constructor() {
    }
    // this.level = data.level;
    // this.rank = data.rank;
    // this.total_game = data.total_game;
    // this.win_game = data.win_game;
    // this.total_puzzle = data.total_puzzle;
    // this.win_puzzle = data.win_puzzle;
    // this.missle = data.missle;


    public setData(data) {
        for (let key in data) {
            this[key] = data[key];
        }
    }

    public set avatar(value) {
        this._avatar = value;
    }

    public get avatar() {
        return this._avatar;
    }

    public set gold(value) {
        this._gold = value;
    }

    public get gold() {
        let max = Math.floor(this.level * 1000 * Math.random()) * 10;
        return max > SaveDataManager.getInstance().getUserData().gold ? SaveDataManager.getInstance().getUserData().gold : max;
    }

    public set player_name(value) {
        this._player_name = value;
    }

    public get player_name() {
        return this._player_name;
    }

    public set id(id) {
        this._mapId = id;
    }

    public get id() {
        return this._mapId;
    }

    public set mapId(id) {
        this._mapId = id;
    }

    public get mapId() {
        return this._mapId;
    }

    public get levelName() {
        return i18n.getLanguage(i18n.LEVEL_NAME_ + this.level);
    }

    public get Srate() {
        if (this.total_game === 0) {
            return "-"
        }
        return (Math.floor(this.win_game / this.total_game * 10000) / 100) + "%";
    }

    public get Prate() {
        if (this.total_puzzle === 0) {
            return "-"
        }
        return (Math.floor(this.win_puzzle / this.total_puzzle * 10000) / 100) + "%";
    }

    public get misslePerGame() {
        if (this.total_game === 0) {
            return "-";
        }
        return Math.floor(this.missle / this.total_game * 100) / 100;
    }

    public getDataString() {
        return JSON.stringify({
            "level": this.level,
            "player_name": this.player_name,
            "rank": this.rank,
            "total_game": this.total_game,
            "win_game": this.win_game,
            "total_puzzle": this.total_puzzle,
            "win_puzzle": this.win_puzzle,
            "missle": this.missle,
            "avatar": this._avatar,
            "gold": this._gold
        })
    }

    public savePlayerData() {
        SaveDataManager.getInstance().saveToLocal("playerData", this.getDataString());
    }
}