class LevelData {
    private _level;
    private _type;
    private _amount;
    private _language;
    private _res;

    constructor(data) {
        this._level = data.level;
        this._type = data.type;
        this._amount = data.amount;
        this._language = "level_name_" + data.level;
        this._res = "level_" + data.level;
    }

    public get level() {
        return this._level;
    }

    public get type() {
        return this._type;
    }

    public get amount() {
        return this._amount;
    }

    public get language() {
        return this._language;
    }

    public get res() {
        return this._res;
    }

    public get levelNeedPlay() {
        return this._amount[0]
    }

    public get levelNeedWin() {
        return this._amount[1];
    }

    public get levelNeedRate() {
        return this._amount[2];
    }

    public get levelNeedPuzzleRate() {
        return this._amount[3];
    }

    public get levelNeedBullet() {
        return this._amount[4];
    }


    public get levelNeedRank() {
        return this._amount[5];
    }

    public isGotThisLevel(playerData: PlayerData) {
        if (playerData.total_game < this.levelNeedPlay) {
            return false;
        } else if (this._type > LevelTypeEnum.LEVEL_TYPE_GAME_PLAY && playerData.win_game < this.levelNeedWin) {
            return false;
        } else if (this._type > LevelTypeEnum.LEVEL_TYPE_WIN_RATE
            && (playerData.Srate < this.levelNeedRate
                || playerData.Prate < this.levelNeedPuzzleRate)) {
            return false;
        } else if (this._type > LevelTypeEnum.LEVEL_TYPE_BULLET_USE && playerData.missle > this.levelNeedBullet) {
            return false;
        } else if (this._type > LevelTypeEnum.LEVEL_TYPE_RANK && playerData.rank < this.levelNeedRank) {
            return false;
        }
        return true;
    }
}