/**
 * 历史局
 * 
 */
class HistoryScene extends egret.Sprite implements Scene {
    constructor() {
        super();
        this.initView();
    }


    private mapList: Array<MiniGameView>;
    private scrollView: egret.ScrollView;
    private mapController: egret.Sprite;


    private backButton: E8Button;
    private gameView: GameView;

    private usedBullet: number;


    private pre_history_button: E8TextButton;
    private next_history_button: E8TextButton;

    private pre_button: E8TextButton;
    private next_button: E8TextButton;

    private first_button: E8TextButton;
    private last_button: E8TextButton;

    private edit_Button: E8TextButton;

    private show_all_button: E8TextButton;

    private timeText: egret.TextField;

    private progress: Progress;

    private currentSelected: number;

    initView() {
        this.usedBullet = 0;


        this.scrollView = new egret.ScrollView();
        this.mapController = new egret.Sprite();

        this.mapList = new Array<MiniGameView>();


        this.scrollView.x = 0;
        this.scrollView.width = AdaptSceenUtil.curWidth();
        this.scrollView.y = AdaptSceenUtil.y_fix() + 80;
        this.scrollView.height = 300;
        this.scrollView.bounces = false;
        this.scrollView.touchEnabled = true;
        this.scrollView.setContent(this.mapController);
        this.addChild(this.scrollView);

        this.mapController.removeChildren();
        let map: MiniGameView;
        let history_map = HistoryController.getInstance().getHistory();
        for (let i = history_map.length - 1; i >= 0; i--) {
            let date = {
                heads: MapUtil.headIdToHeadData(history_map[i].id),
                status: history_map[i].history,
                wow: history_map[i].wow,
                date: history_map[i].date
            }
            map = new MiniGameView(date);
            map.anchorOffsetX = map.width / 2;
            map.anchorOffsetY = map.height / 2;
            map.x = 100 + map.width / 2 + i * 200;
            map.y = map.height / 2;
            // map.scaleX = map.scaleY = 0.8;
            map.id = history_map.length - i - 1;

            // map.y = this.controlViewBg.height - map.height;
            this.mapController.addChild(map);
            this.mapList.push(map);
            map.selected = false;
            if (i == 0) {
                map.selected = true;
                this.currentSelected = map.id;
                HistoryController.getInstance().selectHistoryMap(map.id);
                this.scrollView.scrollLeft = - AdaptSceenUtil.curWidth() / 2 + this.mapList[this.currentSelected].x;
            }
            map.touchEnabled = true;
            map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mapTouched, this);
        }

        this.mapController.width += 200;

        this.backButton = new E8Button(this, RES.getRes("back_png"), this.onBackButtonTouched);
        this.backButton.touchEnabled = true;
        this.backButton.x = -10 + this.backButton.width / 2;
        this.backButton.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.backButton.height / 2+platform.offsetHead();
        this.addChild(this.backButton);

        this.pre_button = new E8TextButton(this, RES.getRes("btn_blue_png"), this.preButtonTouched);
        this.pre_button.scale(0.65, 0.4);
        this.pre_button.setButtonText(i18n.getLanguage("ui_pre_bullet"));
        this.pre_button.touchEnabled = true;
        this.pre_button.x = AdaptSceenUtil.curWidth() / 3;
        this.pre_button.y = 1000 + AdaptSceenUtil.y_fix();
        // this.pre_button.visible = false;
        this.addChild(this.pre_button);


        this.next_button = new E8TextButton(this, RES.getRes("btn_blue_png"), this.nextButtonTouched);
        this.next_button.scale(0.65, 0.4);
        this.next_button.setButtonText(i18n.getLanguage("ui_next_bullet"));
        this.next_button.touchEnabled = true;
        this.next_button.x = AdaptSceenUtil.curWidth() * 2 / 3;
        this.next_button.y = 1000 + AdaptSceenUtil.y_fix();
        // this.next_button.visible = false;
        this.addChild(this.next_button);

        this.pre_history_button = new E8TextButton(this, RES.getRes("btn_blue_png"), this.preHistoryTouched);
        this.pre_history_button.scale(0.65, 0.4);
        this.pre_history_button.setButtonText(i18n.getLanguage("ui_pre_history"));
        this.pre_history_button.touchEnabled = true;
        this.pre_history_button.x = AdaptSceenUtil.curWidth() * 1 / 3;
        this.pre_history_button.y = 260;
        // this.next_button.visible = false;
        // this.addChild(this.pre_history_button);

        this.next_history_button = new E8TextButton(this, RES.getRes("btn_blue_png"), this.nextHistoryTouched);
        this.next_history_button.scale(0.65, 0.4);
        this.next_history_button.setButtonText(i18n.getLanguage("ui_next_history"));
        this.next_history_button.touchEnabled = true;
        this.next_history_button.x = AdaptSceenUtil.curWidth() * 2 / 3;
        this.next_history_button.y = 260;
        // this.addChild(this.next_history_button);

        this.first_button = new E8TextButton(this, RES.getRes("btn_blue_png"), this.firstTouched);
        this.first_button.scale(0.65, 0.4);
        this.first_button.setButtonText(i18n.getLanguage("ui_first_bullet"));
        this.first_button.touchEnabled = true;
        this.first_button.x = AdaptSceenUtil.curWidth() * 1 / 5;
        this.first_button.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.first_button);

        this.last_button = new E8TextButton(this, RES.getRes("btn_blue_png"), this.lastTouched);
        this.last_button.scale(0.65, 0.4);
        this.last_button.setButtonText(i18n.getLanguage("ui_last_bullet"));
        this.last_button.touchEnabled = true;
        this.last_button.x = AdaptSceenUtil.curWidth() * 4 / 5;
        this.last_button.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.last_button);

        this.edit_Button = new E8TextButton(this, RES.getRes("btn_red_png"), this.editThisMap);
        this.edit_Button.scale(0.65, 0.4);
        this.edit_Button.setButtonText("编 辑 模 式");
        this.edit_Button.touchEnabled = true;
        this.edit_Button.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.edit_Button.y = 1000 + AdaptSceenUtil.y_fix();
        this.edit_Button.visible = false;
        this.addChild(this.edit_Button);

        this.show_all_button = new E8TextButton(this, RES.getRes("btn_blue_png"), this.showAllTouched);
        this.show_all_button.scale(0.65, 0.4);
        this.show_all_button.setButtonText(i18n.getLanguage("ui_show_plane"));
        this.show_all_button.touchEnabled = true;
        this.show_all_button.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.show_all_button.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.show_all_button);
    }


    private mapTouched(e: egret.TouchEvent) {
        let map = e.target as MiniGameView;
        // map
        this.gameView.resetView();
        this.mapList[this.currentSelected].selected = false;
        this.currentSelected = map.id;
        this.mapList[map.id].selected = true;
        this.scrollView.scrollLeft = - AdaptSceenUtil.curWidth() / 2 + this.mapList[map.id].x;
        HistoryController.getInstance().selectHistoryMap(map.id);
        this.usedBullet = 0;
        GameController.getInstance().historyReview();
    }

    private editThisMap() {
        GameController.getInstance().editorMap();
    }

    private showAllTouched() {
        this.gameView.showPlaneEffect();
    }

    private preHistoryTouched() {
        if (HistoryController.getInstance().pre()) {
            this.usedBullet = 0;
            GameController.getInstance().historyReview();
        } else {
            SceneManager.getInstance().showTip("已经是最近的一局比赛了!");
        }

    }

    private nextHistoryTouched() {
        if (HistoryController.getInstance().next()) {
            this.usedBullet = 0;
            GameController.getInstance().historyReview();
        } else {
            SceneManager.getInstance().showTip("没有更多的比赛了!");
        }

    }

    private firstTouched() {
        while (this.usedBullet > 0) {
            this.usedBullet--;
            this.next_button.touchEnabled = true;
            // let grid = HistoryController.getInstance().getCurrentHistoryHit(this.usedBullet);
            let wow = HistoryController.getInstance().getOpenGrid(this.usedBullet);
            for (let i = 0; i < wow.length; i++) {
                if (MapUtil.gridValid(wow[i])) {
                    GameController.getInstance().mapHideGrid(wow[i]);
                }
            }
        }
    }

    // 自动播放
    private lastTouched() {
        while (HistoryController.getInstance().isValidBullet(this.usedBullet)) {
            // let grid = HistoryController.getInstance().getCurrentHistoryHit(this.usedBullet);
            this.pre_button.alpha = 1;
            this.pre_button.touchEnabled = true;
            let wow = HistoryController.getInstance().getOpenGrid(this.usedBullet);
            for (let i = 0; i < wow.length; i++) {
                if (MapUtil.gridValid(wow[i])) {
                    GameController.getInstance().mapShowGird(wow[i]);
                }
            }
            this.usedBullet++;
        }
    }


    private preButtonTouched() {
        // if (RecordController.getInstance().getEachGridOpenRecord(this.report_bullet).length === 0) {
        //     return;
        // }
        // for (let i = 0; i < RecordController.getInstance().getEachGridOpenRecord(this.report_bullet).length; i++) {
        //     let gridId = RecordController.getInstance().getEachGridOpenRecord(this.report_bullet)[i];
        //     let gridData = RecordController.getInstance().recordedMap[gridId];
        //     this.showGridView(
        //         gridId, gridData.gridType
        //     )
        // }
        // this.report_bullet++;
        if (this.usedBullet === 0) {
            SceneManager.getInstance().showTip("已经是第一发炮弹了!");
            return;
        }
        this.usedBullet--;
        this.next_button.touchEnabled = true;
        let grid = HistoryController.getInstance().getCurrentHistoryHit(this.usedBullet);
        let wow = HistoryController.getInstance().getOpenGrid(this.usedBullet);
        for (let i = 0; i < wow.length; i++) {
            if (MapUtil.gridValid(wow[i])) {
                GameController.getInstance().mapHideGrid(wow[i]);
            }
        }
        // if (MapUtil.gridValid(grid)) {
        //     GameController.getInstance().mapHideGrid(grid);
        // }
    }


    private nextButtonTouched() {
        if (!HistoryController.getInstance().isValidBullet(this.usedBullet)) {
            SceneManager.getInstance().showTip("已经是最后一发炮弹了!");
            return;
        } else {
            let bullet = HistoryController.getInstance().getCurrentHistoryBullet(this.usedBullet);
            let grid = HistoryController.getInstance().getCurrentHistoryHit(this.usedBullet);

            SceneManager.getInstance().storedGameView.showHitEffect(grid, bullet);
            this.pre_button.touchEnabled = true;
            let wow = HistoryController.getInstance().getOpenGrid(this.usedBullet);
            for (let i = 0; i < wow.length; i++) {
                if (MapUtil.gridValid(wow[i])) {
                    GameController.getInstance().mapShowGird(wow[i]);
                }
            }
            this.usedBullet++;
        }

        // if (RecordController.getInstance().getEachGridOpenRecord(this.report_bullet).length === 0) {
        //     return;
        // }
        // for (let i = 0; i < RecordController.getInstance().getEachGridOpenRecord(this.report_bullet).length; i++) {
        //     let gridId = RecordController.getInstance().getEachGridOpenRecord(this.report_bullet)[i];
        //     let gridData = RecordController.getInstance().recordedMap[gridId];
        //     this.showGridView(
        //         gridId, gridData.gridType
        //     )
        // }
        // this.report_bullet++;
    }

    updateMapList(history_map) {

        if (this.currentSelected != undefined) {
            this.mapList[this.currentSelected].selected = false;
        }
        let data = {
            heads: MapUtil.headIdToHeadData(history_map.id),
            status: history_map.history,
            wow: history_map.wow,
            date: history_map.date
        }
        let map: MiniGameView;
        map = new MiniGameView(data);
        map.anchorOffsetX = map.width / 2;
        map.anchorOffsetY = map.height / 2;
        map.y = map.height / 2;
        map.id = this.mapList.length;
        map.selected = true;
        this.currentSelected = map.id;
        HistoryController.getInstance().selectHistoryMap(map.id);
        this.mapController.addChild(map);
        this.mapList.push(map);
        map.touchEnabled = true;
        map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mapTouched, this);

        for (let i = 0; i < this.mapList.length; i++) {
            this.mapList[i].x = 100 + map.width / 2 + 200 * (this.mapList.length - 1 - i);
        }
        this.mapController.width += 200;
        this.scrollView.scrollLeft = - AdaptSceenUtil.curWidth() / 2 + this.mapList[map.id].x;


        // this.mapController.removeChildren();
        // let map: MiniGameView;
        // let history_map = SaveDataManager.getInstance().getHistory();
        // for (let i = 0; i < history_map.length; i++) {
        //     let date = {
        //         heads: MapUtil.headIdToHeadData(history_map[i].id),
        //         status: history_map[i].history,
        //         date: history_map[i].date
        //     }
        //     map = new MiniGameView(date);
        //     map.anchorOffsetX = map.width / 2;
        //     map.anchorOffsetY = map.height / 2;
        //     map.x = map.width / 2 + 200 * i;
        //     map.y = map.height / 2;
        //     // map.scaleX = map.scaleY = 0.8;
        //     map.selected = false;
        //     map.id = i;
        //     // map.y = this.controlViewBg.height - map.height;
        //     this.mapController.addChild(map);
        //     this.mapList.push(map);
        //     map.touchEnabled = true;
        //     map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mapTouched, this);
        // }

        // this.currentSelected = 0;
        // this.mapList[0].selected = true;
        // this.scrollView.scrollLeft = 0;
    }

    private onBackButtonTouched() {
        SceneManager.getInstance().toTechScene();
    }

    inAnimate() {
        this.gameView = SceneManager.getInstance().storedGameView;
        this.addChild(this.gameView);
        egret.Tween.get(this.gameView).to({
            scaleX: 1, scaleY: 1, alpha: 1
        }, 500);
        this.usedBullet = 0;

        if (GMToolManager.isRelease) {
            this.edit_Button.visible = true;
        } else {
            this.edit_Button.visible = false;
        }
        // this.updateMapList();
        // this.progress.resetView();
        // this.gameView.resetView();
        // GameController.getInstance().preparePuzzle();
        this.visible = true;
    }

    outAnimate() {
        this.visible = false;
    }

}