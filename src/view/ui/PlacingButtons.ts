class PlacingButtons extends egret.Sprite {

    // 删除收藏 -- 上传服务器
    private deleteButton: E8TextButton;

    // 分享该地图
    private shareButton: E8TextButton;
    // 收藏地图
    private collectButton: E8TextButton;
    // 使用该地图
    private extendButton: E8TextButton;
    // 不再使用地图
    private unuseButton: E8TextButton;
    // 随机一张地图
    private randomButton: E8TextButton;

    constructor() {
        super();
        this.initView();
    }

    private initView() {

        this.shareButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.shareButtonTouched);
        this.shareButton.touchEnabled = true;
        this.shareButton.scale(0.65, 0.4)
        this.shareButton.x = AdaptSceenUtil.curWidth() / 5;
        this.shareButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.shareButton.setButtonText("分 享 机 场");
        this.addChild(this.shareButton);

        this.collectButton = new E8TextButton(this, RES.getRes("btn_yellow_png"), this.collectionButtonTouched);
        this.collectButton.touchEnabled = true;
        this.collectButton.scale(0.65, 0.4)
        this.collectButton.x = AdaptSceenUtil.curWidth() * 1 / 5;
        this.collectButton.y = AdaptSceenUtil.y_fix() + 1080;
        this.collectButton.setButtonText("布 置 机 场");
        this.addChild(this.collectButton);


        this.extendButton = new E8TextButton(this, RES.getRes("btn_purple_png"), this.buildButtonTouched);
        this.extendButton.touchEnabled = true;
        this.extendButton.scale(0.65, 0.4)
        this.extendButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.extendButton.y = AdaptSceenUtil.y_fix() + 1080;
        this.extendButton.setButtonText("扩 建", 15, 0, "video_png");
        this.addChild(this.extendButton);

        // this.useButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.useButtonTouched);
        // this.useButton.touchEnabled = true;
        // this.useButton.scale(0.5, 0.5)
        // this.useButton.x = AdaptSceenUtil.curWidth() * 3 / 5;
        // this.useButton.y = AdaptSceenUtil.curHeight() - AdaptSceenUtil.y_fix() - 120;
        // this.useButton.setButtonText("使用");
        // this.addChild(this.useButton);


        // this.unuseButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.unuseButtonTouched);
        // this.unuseButton.touchEnabled = true;
        // this.unuseButton.scale(0.5, 0.5)
        // this.unuseButton.x = AdaptSceenUtil.curWidth() * 3 / 5;
        // this.unuseButton.y = AdaptSceenUtil.curHeight() - AdaptSceenUtil.y_fix() - 120;
        // this.unuseButton.setButtonText("停  用");
        // this.addChild(this.unuseButton);

        this.deleteButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.deleteButtonTouched);
        this.deleteButton.touchEnabled = true;
        this.deleteButton.scale(0.65, 0.4)
        this.deleteButton.x = AdaptSceenUtil.curWidth() * 4 / 5;
        this.deleteButton.y = AdaptSceenUtil.y_fix() + 1080;
        this.deleteButton.setButtonText("撤 离 机 场");
        this.addChild(this.deleteButton);


        this.randomButton = new E8TextButton(this, RES.getRes("btn_purple_png"), this.onRandomButtonTouched);
        this.randomButton.touchEnabled = true;
        this.randomButton.scale(0.65, 0.4);
        this.randomButton.x = AdaptSceenUtil.curWidth() * 4 / 5;
        this.randomButton.y = AdaptSceenUtil.y_fix() + 1000;
        this.randomButton.setButtonText("随 机 图 纸");
        this.addChild(this.randomButton);
    }


    private shareButtonTouched() {
        PlacingController.getInstance().shareMap();
    }

    private buildButtonTouched() {
        AdvertiseController.getInstance().showVedio(() => {
            SceneManager.getInstance().hideAlert();
        }, (result) => {
            if (result.finish) {
                SaveDataManager.getInstance().getUserData().defenseMaps++
            }
        }, "购买新机场");
    }

    private collectionButtonTouched() {
        if (PlacingController.getInstance().collectionMap(MapUtil.headDataToHeadId(SceneManager.getInstance().placingGameView.getPlaneList()))) {
            SceneManager.getInstance().placingScene.updateMapList();
            SceneManager.getInstance().placingScene.setSelectMap();
        }
    }

    private deleteButtonTouched() {
        for (var i = 0; i < SceneManager.getInstance().placingScene.mapList.length; i++) {
            if (SceneManager.getInstance().placingScene.mapList[i].selected) {
                SceneManager.getInstance().showAlert("报  告", "    保留更多的机场，将大大提高我方飞机的存活的可能，确定要删除么？", "确 定", () => {
                    PlacingController.getInstance().deleteMap(MapUtil.headDataToHeadId(SceneManager.getInstance().placingGameView.getPlaneList()));
                    SceneManager.getInstance().hideAlert();
                }, "取 消");
                return;
            }
        }
        SceneManager.getInstance().showTip("请选择您要将飞机撤离的机场");
    }

    private useButtonTouched() {
        // PlacingController.getInstance().useMap();
    }

    private unuseButtonTouched() {
        // PlacingController.getInstance().unuseMap();
    }

    private onRandomButtonTouched(e) {
        SceneManager.getInstance().placingScene.unSelectMap();
        SceneManager.getInstance().placingGameView.resetView();
        PlacingController.getInstance().randomMap();
    }

    public guideBuildAirport() {
        this.deleteButton.visible = false;
        this.shareButton.visible = false;
        this.extendButton.visible = false;
        this.collectButton.visible = true;
        this.randomButton.visible = true;
        this.collectButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGuideCollection, this);
    }

    private onGuideCollection(e) {
        this.collectButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGuideCollection, this);
        SceneManager.getInstance().getGuideView().onNextStep();
        SceneManager.getInstance().showGuide();
        SceneManager.getInstance().placingScene.guideBack();
        this.deleteButton.visible = true;
        this.shareButton.visible = true;
        this.extendButton.visible = true;
    }

}