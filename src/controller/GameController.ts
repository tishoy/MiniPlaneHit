/**
 * 游戏主逻辑
 * creat by tishoy
 * 2019.4.12
 */
class GameController {
    private static instance: GameController = null;

    // private homeDataList;

    //当前游戏的地图
    private awayMapData: MapData;

    //游戏类型
    private _type: number;
    //游戏状态
    private _phase: number = PhaseEnum.OUT_PHASE;
    private gameResult = null;

    private one_round_result = [];  //gridType
    private firing_grid = [];

    public currentPuzzle = null;
    public currentOpponent: PlayerData = null;

    public lanchMissleVedio = false;
    public record = false;

    constructor() {
        if (GameController.instance) {
            throw new Error("AIController singlon error")
        }
        this.awayMapData = new MapData();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new GameController();
        }
        return this.instance;
    }


    // 解谜游戏 -------------------------------


    public attackPuzzle(puzzle) {
        let mapId = puzzle.id
        let status = puzzle.status;
        let bullet = puzzle.bullet[0];
        platform.analytics("puzzle", { map: puzzle.name });

        //mapId, status, bullets
        let list = MapUtil.headIdToHeadData(mapId);
        this.phase = PhaseEnum.PREPARE_PHASE;
        this.gameResult = null;
        this.currentOpponent = null;
        RewardController.getInstance().reset();
        RecordController.getInstance().reset();

        BulletController.getInstance().useBullet(BulletTypeEnum.MISSILE);
        BulletController.getInstance().resetBullets(bullet);
        this._type = GameTypeEnum.GAME_TYPE_PUZZLE;
        this.awayMapData.clear();
        this.firing_grid = [];
        for (let i = 0; i < 3; i++) {
            this.awayMapData.setPlaneGridByHead(list[i].head, list[i].direction);
        }
        SceneManager.getInstance().storedGameView.updateWithData(this.awayMapData.map);
        SceneManager.getInstance().storedGameView.resetView();
        // SceneManager.getInstance().toAwayScene();
        SceneManager.getInstance().toPuzzleScene();
        puzzle.author = puzzle.author == undefined ? "18tech" : puzzle.author;
        SceneManager.getInstance().puzzleScene.showPuzzleName(puzzle.name, puzzle.author);
        SceneManager.getInstance().puzzleScene.resetBullet();
        RecordController.getInstance().preparePuzzle(this.awayMapData.getHeadList(), status);
        SceneManager.getInstance().storedGameView.preparePuzzle(status);
        this.currentPuzzle = puzzle;
        this.startAttackPhase();
    }

    public attackSharedPuzzle(puzzle) {
        platform.analytics("puzzle", { map: puzzle.name });
        this.attackPuzzle(puzzle);
    }

    public printAllMap() {
        let puzzles = SaveDataManager.getInstance().getPuzzle();
        let data = [];
        for (let i = 0; i < puzzles.length; i++) {
            let mapId = puzzles[i].id;
            let list = MapUtil.headIdToHeadData(mapId);
            let status = puzzles[i].status;
            let bullet = puzzles[i].bullet[0];
            this.awayMapData.clear();
            for (let j = 0; j < 3; j++) {
                this.awayMapData.setPlaneGridByHead(list[j].head, list[j].direction);
            }
            let write = [];
            let temp = [];
            let result = [];
            for (let l = 0; l < 81; l++) {
                write.push(3);
            }
            for (let k = 0; k < status.length; k = k + 2) {
                let value = Number(status.slice(k, k + 2));
                write[value] = this.awayMapData.map[value].gridType;
            }
            for (let m = 0; m < 81; m++) {
                temp.push(write[m]);
                if (temp.length == 9) {
                    result.push(temp);
                    temp = [];
                }
            }
            let key = puzzles[i].name;
            let obj = {};
            obj[key] = result;
            obj["bullet"] = bullet;
            obj["onlyOne"] = false;
            data.push(obj);
        }
        SaveDataManager.getInstance().saveToLocal("nbwf", JSON.stringify(data));
        return;
    }

    public attackRandomPuzzle() {
        let puzzles = RES.getRes(ResourceManager.PUZZLES_JSON);

        // let puzzles = SaveDataManager.getInstance().getPuzzle();
        if (puzzles.length === 0) {
            return;
        }

        let puzzle = ArrayUtil.random(puzzles, 1)[0];
        // let puzzle = puzzles[0];
        this.attackPuzzle(puzzle);
        // AIController.getInstance().computeWhersIsPlane(AIController.getInstance().initCamputeMapByIdStatus(puzzle.id, puzzle.status));
        // AIController.getInstance().computeWhersIsPlane(11583725, "20212930313238394041424748495057");
        // let mapId = 11583725;
        // let status = "20212930313238394041424748495057";
    }

    public startRobotPlayerGame() {
        this.phase = PhaseEnum.PREPARE_PHASE;
        this._type = GameTypeEnum.GAME_TYPE_ROBOT_PLAYER;
        SceneManager.getInstance().storedGameView.resetView();
        this.gameResult = null;
        this.firing_grid = [];
        this.awayMapData = PlayerController.getInstance().getOppoMap();
        console.log(this.awayMapData.getHeadList());
        RewardController.getInstance().reset();
        RecordController.getInstance().reset();
        BulletController.getInstance().resetBullets();
        BulletController.getInstance().resetDoubleGameBullets();
        BulletController.getInstance().prepareMatchGameBullet();
        // PlayerController.getInstance().setOpponentData() = ;
        this.currentOpponent = AIController.getInstance().robotPlayer();
        // SceneManager.getInstance().awayScene.resetGameView(this.currentOpponent);
        SceneManager.getInstance().toMatchScene();
        GameController.getInstance().startAttackPhase();
        AIController.getInstance().onRobotGameStart();
    }


    // 多人游戏 
    public startMultiplayerGame() {
        this.phase = PhaseEnum.PREPARE_PHASE;
        this._type = GameTypeEnum.GAME_TYPE_MULTIPLAYER;
        SceneManager.getInstance().storedGameView.resetView();
        this.gameResult = null;
        this.firing_grid = [];
        this.awayMapData = PlayerController.getInstance().getOppoMap();
        RewardController.getInstance().reset();
        RecordController.getInstance().reset();
        BulletController.getInstance().resetBullets();
        BulletController.getInstance().resetDoubleGameBullets();
        BulletController.getInstance().prepareMatchGameBullet();
        this.currentOpponent = PlayerController.getInstance().currentOpponent;
        // SceneManager.getInstance().awayScene.resetGameView(this.currentOpponent);
        SceneManager.getInstance().toMatchScene();
        GameController.getInstance().startAttackPhase();
    }



    // 单人游戏 -------------------------------
    // 随机地图设置
    public setAwayGame(value) {
        this.awayMapData = value;
    }

    public attackSharedMap(mapId, opponet) {
        let list = MapUtil.headIdToHeadData(mapId);
        platform.analytics("playShare", { mapId: mapId });
        this.phase = PhaseEnum.PREPARE_PHASE;
        this.gameResult = null;
        RewardController.getInstance().reset();
        RecordController.getInstance().reset();
        BulletController.getInstance().resetBullets();
        this._type = GameTypeEnum.GAME_TYPE_AWAY;
        this.awayMapData.clear();
        this.firing_grid = [];
        for (let i = 0; i < 3; i++) {
            this.awayMapData.setPlaneGridByHead(list[i].head, list[i].direction);
        }
        SceneManager.getInstance().awayScene.resetGameView(this.currentOpponent);
        SceneManager.getInstance().toAwayScene();
        this.startAttackPhase();
    }


    public continueGame() {
        SceneManager.getInstance().toAwayScene();
        GameController.getInstance().type = GameTypeEnum.GAME_TYPE_AWAY;
        this.startAttackPhase();
    }

    public attackOpponent(level = 0) {
        this.lanchMissleVedio = false;
        this.phase = PhaseEnum.PREPARE_PHASE;
        this.firing_grid = [];
        this.gameResult = null;
        RewardController.getInstance().reset();
        RecordController.getInstance().reset();
        BulletController.getInstance().resetBullets();
        this._type = GameTypeEnum.GAME_TYPE_AWAY;
        this.awayMapData = AIController.getInstance().generateRandomMap();
        let headList = this.awayMapData.getHeadList();
        for (let i = 0; i < 3; i++) {
            this.awayMapData.setPlaneGridByHead(headList[i].head, headList[i].direction);
        }
        SceneManager.getInstance().toAwayScene();
        this.startAttackPhase();
        let mapId = MapUtil.headDataToHeadId(headList);
        let data = { id: mapId };
        this.currentPuzzle = null;
        this.currentOpponent = AIController.getInstance().robotPlayer();
        this.currentOpponent.mapId = mapId;
        platform.analytics("attack", this.currentOpponent);
        SceneManager.getInstance().awayScene.resetGameView(this.currentOpponent);
        // NetManager.send(NetManager.MAP_PLAY, data);
        return;
    }

    public giveUpMatchGame() {
        this.phase = PhaseEnum.OUT_PHASE;
    }

    public gameFinished(isWin: boolean) {
        let imSlow = false;
        if (this.isMultiplayer() || this.isRobotPlayer()) {
            if (!ServerController.getInstance().imGiveUp) {
                if (ServerController.getInstance().imFinished) {
                    return;
                }
                if (!ServerController.getInstance().imFinished) {
                    if (isWin) {
                        ServerController.getInstance().uplodaGameEnd(ResultTypeEnum.WIN)
                    } else if (RecordController.getInstance().bulletUsed < BulletController.getInstance().bulletNumber) {
                        ServerController.getInstance().uplodaGameEnd(ResultTypeEnum.GIVE_UP);
                        ServerController.getInstance().endGame();
                    } else {
                        ServerController.getInstance().uplodaGameEnd(ResultTypeEnum.FAIL)
                    }
                }
                if (!ServerController.getInstance().amIWonFirst) {
                    imSlow = true;
                }

                if (ServerController.getInstance().areYouFinished) {

                } else {
                    this._type = GameTypeEnum.GAME_TYPE_RESULT_WAITING;
                    SceneManager.getInstance().showTip("等待玩家结束战斗");
                    SceneManager.getInstance().matchScene.showWinBackButton();
                    return;
                }
            }

            // if (this.isRobotPlayer()) {
            //     ServerController.getInstance().onGameEnd();
            // }
        }
        this.phase = PhaseEnum.OUT_PHASE;
        this.gameResult = isWin;
        RecordController.getInstance().recordMap(this.awayMapData.map);
        // let result = ScoreTypeEnum.C;
        let bullet = RecordController.getInstance().bulletUsed;
        let isOpponent = false;
        let mapData;
        if (this.currentOpponent) {
            mapData = {
                isOpponent: true,
                data: this.currentOpponent
            }
            isOpponent = true;
        } else {
            mapData = {
                isOpponent: false,
                data: this.currentPuzzle
            }
        }
        if (isWin) {
            if (imSlow) {
                SceneManager.getInstance().resultScene.showResult(ResultTypeEnum.WIN_BUT_SLOW, bullet, mapData);
            } else {
                SceneManager.getInstance().resultScene.showResult(ResultTypeEnum.WIN, bullet, mapData);
            }
            // if (this.isMultiplayer()) {
            //     ServerController.getInstance().uplodaGameEnd(ResultTypeEnum.WIN)
            // }
        } else if (RecordController.getInstance().bulletUsed < BulletController.getInstance().bulletNumber) {
            SceneManager.getInstance().resultScene.showResult(ResultTypeEnum.GIVE_UP, bullet, mapData);
            // if (this.isMultiplayer()) {
            //     ServerController.getInstance().uplodaGameEnd(ResultTypeEnum.GIVE_UP);
            //     ServerController.getInstance().endGame();
            // }
        } else {
            SceneManager.getInstance().resultScene.showResult(ResultTypeEnum.FAIL, bullet, mapData);
            // if (this.isMultiplayer()) {
            //     ServerController.getInstance().uplodaGameEnd(ResultTypeEnum.FAIL)
            // }
        }

        if (isOpponent) {
            let mapId = MapUtil.headDataToHeadId(this.awayMapData.getHeadList());
            let mapStatus = SceneManager.getInstance().storedGameView.saveStatus();
            SaveDataManager.getInstance().saveHistory(mapId, RecordController.getInstance().history, RecordController.getInstance().bullet);
            PlayerController.getInstance().playGame(isWin, bullet);
            platform.analytics("a_result", { isWin: isWin, "bullet": bullet, mapData: mapData })
            NetWorkManager.uploadMap(mapId, isWin, bullet);
        } else {
            PlayerController.getInstance().playPuzzle(isWin, this.currentPuzzle);
            platform.analytics("p_result", { isWin: isWin, mapData: mapData })
        }


        SceneManager.getInstance().awayScene.showGameFinished();

    }







    public startPlacingGame(isRandom = true) {
        this._type = GameTypeEnum.GAME_TYPE_MAPING;
        platform.analytics("placing", {});
        if (isRandom) {
            PlacingController.getInstance().randomMap();
        } else {
            PlacingController.getInstance().useAwayMap();
        }
    }


    public editorMap() {
        this._type = GameTypeEnum.GAME_TYPE_EDITOR;
        SceneManager.getInstance().toEditorScene();
        SceneManager.getInstance().editorScene.initData();
    }


    public placingToEditor(headList) {
        SceneManager.getInstance().storedGameView.resetView();
        this._type = GameTypeEnum.GAME_TYPE_EDITOR;
        this.awayMapData.clear();
        this.firing_grid = [];
        for (let i = 0; i < 3; i++) {
            this.awayMapData.setPlaneGridByHead(headList[i].head, headList[i].direction);
        }
        SceneManager.getInstance().toEditorScene();
        SceneManager.getInstance().editorScene.initData();
    }

    public historyReview() {
        this.phase = PhaseEnum.OUT_PHASE;
        let hc = HistoryController.getInstance();
        let history = hc.currentHistory;
        if (!history) {
            SceneManager.getInstance().showTip("还没有历史数据");
            return;
        }
        let mapId = history.id;
        let list = MapUtil.headIdToHeadData(mapId);
        platform.analytics("history", { mapId: mapId });
        this.phase = PhaseEnum.PREPARE_PHASE;
        this.gameResult = null;
        RewardController.getInstance().reset();
        RecordController.getInstance().reset();
        // BulletController.getInstance().resetBullets();
        this._type = GameTypeEnum.GAME_TYPE_HISTORY;
        this.awayMapData.clear();
        this.firing_grid = [];
        for (let i = 0; i < 3; i++) {
            this.awayMapData.setPlaneGridByHead(list[i].head, list[i].direction);
        }
        SceneManager.getInstance().storedGameView.resetView();
        SceneManager.getInstance().toHistoryScene();
        // this.startAttackPhase();
    }

    public mapHideGrid(gridId) {
        (SceneManager.getInstance().storedGameView.gridList[gridId] as AwayGridView).status = GridStatusEnum.COVER;
    }

    public mapShowGird(gridId, fire = false) {
        if (MapUtil.gridValid(gridId)) {
            let grid = this.awayMapData.map[gridId];
            this.one_round_result.push(grid.gridType);
            RecordController.getInstance().recordGridOpen(grid);
            (SceneManager.getInstance().storedGameView.gridList[gridId] as AwayGridView).status = GridStatusEnum.SHOW;
            SceneManager.getInstance().storedGameView.gridList[gridId].type = grid.gridType;
            // SceneManager.getInstance().awayScene.showGridView(gridId, grid.gridType);
            if (fire) {
                SceneManager.getInstance().fireGrid(gridId);
            }
            return grid.gridType
        }
        return ""
    }


    public startAttackPhase() {
        // if (this.phase === PhaseEnum.OUT_PHASE) {
        //     return;
        // }

        this.phase = PhaseEnum.ATTACK_PHASE;
        // if (BulletController.getInstance().getCurrentBullet() === BulletTypeEnum.GUIDED_MISSILE) {
        //     // let planeIndex = RecordController.getInstance().getUnHitPlaneGrid();
        //     // let girds = this.awayMapData.getPlaneByIndex(planeIndex);

        //     this.hitGrid(this.getUnHitPlaneGrid(), BulletController.getInstance().useBullet());
        // } else {

        // }

    }

    public editorGrid(gridId) {
        let grid = this.awayMapData.map[gridId];
        let gridView = (SceneManager.getInstance().storedGameView.gridList[gridId] as AwayGridView);
        if (gridView.status == GridStatusEnum.SHOW) {
            gridView.status = GridStatusEnum.COVER;
        } else {
            gridView.status = GridStatusEnum.SHOW;
            SceneManager.getInstance().storedGameView.gridList[gridId].type = grid.gridType;
        }
        SceneManager.getInstance().editorScene.updateText();
    }


    /** 飞机 过程 -------------------------------------------------------- */

    public hitGrid(gridId, bulletType) {

        if (this.phase !== PhaseEnum.ATTACK_PHASE) {
            return;
        }

        this.phase = PhaseEnum.RESULT_PHASE;
        let effectGrids;
        let effectArea = BulletTypeEnum.BULLET_GRID_AREA[bulletType];
        this.one_round_result = [];


        SceneManager.getInstance().storedGameView.showHitEffect(gridId, bulletType);
        // 打击一个位置
        if (bulletType === BulletTypeEnum.GUIDED_MISSILE) {
            SoundManager.getInstance().playSound(SoundEnum.LANCH_MP3);
            if (this.awayMapData.getMapGridById(gridId).gridType === GridTypeEnum.MISS) {
                effectGrids = [this.getUnHitPlaneGrid(gridId)];
                if (this.isMultiplayer()) {
                    ServerController.getInstance().uploadEffectGrids(effectGrids)
                }
                SceneManager.getInstance().storedGameView.launchGuidedMissile(gridId, effectGrids[0]);
                // 制导导弹 upload
            } else {
                this.afterAnimate(gridId);
            }
            RecordController.getInstance().recordAction(this.awayMapData.map[gridId], bulletType);
        } else {
            effectGrids = BulletTypeEnum.getBulletEffect(bulletType, gridId);
            if (this.isMultiplayer()) {
                ServerController.getInstance().uploadEffectGrids(effectGrids)
            }
            for (var i = 0; i < effectGrids.length; i++) {
                this.mapShowGird(effectGrids[i]);
            }
            if (bulletType === BulletTypeEnum.MISSILE) {
                let grid = this.awayMapData.map[gridId];
                switch (grid.gridType) {
                    case GridTypeEnum.HEAD:
                        SoundManager.getInstance().playSound(SoundEnum.HEAD_MP3);
                        break;
                    case GridTypeEnum.BODY:
                        SoundManager.getInstance().playSound(SoundEnum.HIT_MP3);
                        break;
                    case GridTypeEnum.MISS:
                        SoundManager.getInstance().playSound(SoundEnum.MISS_MP3);
                        break;
                }
            }
            if (bulletType === BulletTypeEnum.INFRARED_ROW || bulletType === BulletTypeEnum.INFRARED_COL) {
                SoundManager.getInstance().playSound(SoundEnum.LASER_M4A);
            }
            if (bulletType === BulletTypeEnum.ARMOR_PIERCING_MISSILE) {
                SoundManager.getInstance().playSound(SoundEnum.BIRD_MP3);
            }
            if (bulletType === BulletTypeEnum.CROSS_BOOM || bulletType == BulletTypeEnum.NINE_PALACE_MISSILE) {
                SoundManager.getInstance().playSound(SoundEnum.BOOM_MP3);
            }
            if (bulletType == BulletTypeEnum.INCENDIARY_BOMB) {
                SoundManager.getInstance().playSound(SoundEnum.FIRE_MP3)
            }

            if (bulletType === BulletTypeEnum.INCENDIARY_BOMB) {
                if (this.awayMapData.map[gridId].gridType !== GridTypeEnum.MISS) {
                    this.firing_grid.push({ grid: gridId, fire: 0 });
                }
            }

            RecordController.getInstance().recordEachRound();
            // 同时击中奖励
            let reward = RewardController.getInstance().hitReward(this.one_round_result);

            if (RecordController.getInstance().recordAction(this.awayMapData.map[gridId], bulletType)) {
                return
            }


            // 连击奖励
            if (RecordController.getInstance().isContinuous(this.awayMapData.map[gridId], this.awayMapData.map[gridId].gridType)) {
                RewardController.getInstance().continuousReward();
            }

            if (this.phase !== PhaseEnum.OUT_PHASE) {
                this.phase = PhaseEnum.ROUND_END_PHASE;
                this.endingPhase()
                //    SceneManager.getInstance().awayScene.m
            }
        }
    }


    public afterAnimate(hitGrid) {
        this.mapShowGird(hitGrid);
        switch (this.awayMapData.getMapGridById(hitGrid).gridType) {
            case GridTypeEnum.HEAD:
                SoundManager.getInstance().playSound(SoundEnum.HEAD_MP3);
                break;
            case GridTypeEnum.BODY:
                SoundManager.getInstance().playSound(SoundEnum.HIT_MP3);
                break;
            case GridTypeEnum.MISS:
                SoundManager.getInstance().playSound(SoundEnum.MISS_MP3);
                break;
        }
        RecordController.getInstance().recordEachRound();
        let reward = RewardController.getInstance().hitReward(this.one_round_result);
        // RecordController.getInstance().recordAction(this.awayMapData.map[gridId], bulletType);


        // if (RecordController.getInstance().isContinuous(this.awayMapData.map[gridId], this.awayMapData.map[gridId].gridType)) {
        //     RewardController.getInstance().continuousReward();
        // }

        if (RecordController.getInstance().checkGameWin()) {
            GameController.getInstance().gameFinished(true);
            return;
        }

        if (this.phase !== PhaseEnum.OUT_PHASE) {
            this.phase = PhaseEnum.ROUND_END_PHASE;
            this.endingPhase()

            //    SceneManager.getInstance().awayScene.m
        }
    }

    private endingPhase() {
        if (this.firing_grid.length > 0) {
            let next_firing_grid = [];
            let effectList = [];
            for (let i = 0; i < this.firing_grid.length; i++) {
                let times = this.firing_grid[i].fire;
                if (times === 0) {
                    next_firing_grid.push({ grid: this.firing_grid[i].grid, fire: ++times });
                    SceneManager.getInstance().fireGrid(this.firing_grid[i].grid);
                    continue;
                } else if (times === 2) {
                    SceneManager.getInstance().stopFire(this.firing_grid[i].grid);
                }
                let firing_nearby = MapUtil.getNearByGrid(this.firing_grid[i].grid);
                for (let j = 0; j < firing_nearby.length; j++) {
                    let grid = this.awayMapData.map[firing_nearby[j]];

                    if (grid.gridType !== GridTypeEnum.MISS) {
                        // RecordController.getInstance().isGridOpen(grid.gridValue)
                        effectList.push(firing_nearby[j])
                        this.mapShowGird(firing_nearby[j], true);
                        if (times === 2) {
                            SceneManager.getInstance().stopFire(firing_nearby[j]);
                        } else {
                            next_firing_grid.push({ grid: grid.gridValue, fire: times + 1 });
                        }
                    }
                }
            }
            SoundManager.getInstance().playSound(SoundEnum.FIRING_MP3);
            this.firing_grid = next_firing_grid;
            if (this.isMultiplayer()) {
                ServerController.getInstance().uploadEffectGrids(effectList);
                ServerController.getInstance().uploadFiringGrids(this.firing_grid);
            }
        }
        if (RecordController.getInstance().checkGameWin()) {
            GameController.getInstance().gameFinished(true);
        } else {
            if (RecordController.getInstance().round < 20) {
                BulletController.getInstance().prepareNextBullet();
            }
        }
    }


    public getMapByUser() {

    }


    // 辅助 -------------------------------------
    public getAwayMapData(gridId) {
        return this.awayMapData.map[gridId].gridType;
    }

    public get type() {
        return this._type;
    }
    public set type(value) {
        this._type = value;
    }

    public get isOverPhase(): boolean {
        return this.phase === PhaseEnum.OUT_PHASE;
    }

    public get isAttackPhase(): boolean {
        return this.phase === PhaseEnum.ATTACK_PHASE;
    }

    /**
     * 获取未击中飞机的一个位置
     */
    public getUnHitPlaneGrid(gridId) {
        return this.getPlaneGridUnhit();
    }

    public getPlaneHeadUnhit() {
        let heads = this.awayMapData.getHeadList();
        let unhit = heads.filter((element) => {
            return !RecordController.getInstance().isGridOpen(element.head)
        });
        return ArrayUtil.random(unhit)[0].head;
    }

    public getPlaneGridUnhitByIndex(index) {
        let plane = this.awayMapData.getPlaneGridByIndex(index);
        let unhit = plane.filter((element) => {
            return !RecordController.getInstance().isGridOpen(element.gridValue)
        })
        return ArrayUtil.random(unhit)[0].gridValue;
    }

    public getPlaneGridUnhit() {
        let planes = this.awayMapData.getPlaneGrid();
        let unhit = planes.filter((element) => {
            return !RecordController.getInstance().isGridOpen(element.gridValue)
        })
        return ArrayUtil.random(unhit)[0].gridValue;
    }

    public getAwayData() {
        return this.awayMapData;
    }


    // 判断状态

    public isNormalGame() {
        return GameTypeEnum.GAME_TYPE_AWAY === GameController.getInstance().type ||
            GameTypeEnum.GAME_TYPE_PUZZLE === GameController.getInstance().type ||
            GameTypeEnum.GAME_TYPE_MULTIPLAYER === GameController.getInstance().type ||
            GameTypeEnum.GAME_TYPE_ROBOT_PLAYER === GameController.getInstance().type
    }

    public isIdle() {
        return GameTypeEnum.GAME_TYPE_IDLE === GameController.getInstance().type;
    }

    public isAwayGame() {
        return GameTypeEnum.GAME_TYPE_AWAY === GameController.getInstance().type;
    }


    public isPuzzleGame() {
        return GameTypeEnum.GAME_TYPE_PUZZLE === GameController.getInstance().type;
    }

    public isRobotPlayer() {
        return GameTypeEnum.GAME_TYPE_ROBOT_PLAYER === GameController.getInstance().type;
    }

    public isMultiplayer() {
        return GameTypeEnum.GAME_TYPE_MULTIPLAYER === GameController.getInstance().type;
    }

    public isPlacing() {
        return GameTypeEnum.GAME_TYPE_MAPING === GameController.getInstance().type;
    }

    public isEditor() {
        return GameTypeEnum.GAME_TYPE_EDITOR === GameController.getInstance().type;
    }

    public isPlaceWaiting() {
        return GameTypeEnum.GAME_TYPE_PLACING_WAITING === GameController.getInstance().type;
    }

    public isResultWaiting() {
        return GameTypeEnum.GAME_TYPE_RESULT_WAITING === GameController.getInstance().type;
    }

    public set phase(value) {
        this._phase = value;
    }

    public get phase() {
        return this._phase;
    }
}