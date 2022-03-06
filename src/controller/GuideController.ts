/**
 * 引导
 * creat by tishoy
 * 2019.4.12
 */
class GuideController {
    private static instance: GuideController = null;

    private guideSave;
    private guideData;
    private away_guide = [];
    private place_guide = [];
    private city_guide = [];
    public isAwayGuideFinished = true;

    constructor() {
        if (GuideController.instance) {
            throw new Error("AIController singlon error")
        }
        this.init();
    }

    private async init() {

        this.guideSave = Number(SaveDataManager.getInstance().getUserData().guide);
        this.guideData = await RES.getRes("guide_json");
        this.away_guide = this.parseData(GuideEnum.GUIDE_TYPE_AWAY);
        this.place_guide = this.parseData(GuideEnum.GUIDE_TYPE_PLACE);
        if (!this.isFinished()) {
            this.city_guide = this.parseData(GuideEnum.GUIDE_TYPE_CITY);
            if (this.guideSave < 21 && this.guideSave > 0) {
                this.isAwayGuideFinished = false
                //说明已经完成城市部分，开始进行进攻部分 
                // this.startGuide(GuideEnum.GUIDE_TYPE_AWAY);
            } else {
                // 从头开始
                this.startGuide(GuideEnum.GUIDE_TYPE_CITY);
            }
        }

    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new GuideController();
        }
        return this.instance;
    }

    private parseData(type) {
        let list = [];
        let steps = this.guideData.guide[type];
        for (let j = 0; j < steps.length; j++) {
            for (let i = 0; i < this.guideData.data.length; i++) {
                if (this.guideData.data[i].id == steps[j]) {
                    list.push(this.guideData.data[i]);
                    continue;
                }
            }
        }
        return list;
    }

    public isNew() {
        return this.guideSave === GuideEnum.GUIDE_START;
    }

    public isFinished() {
        return this.guideSave == GuideEnum.GUIDE_FINISHED;
    }

    public startGuide(type) {
        SceneManager.getInstance().showGuide(type);
    }

    public getGuideListByType(type) {
        switch (type) {
            case GuideEnum.GUIDE_TYPE_AWAY:
                return this.away_guide;

            case GuideEnum.GUIDE_TYPE_CITY:
                return this.city_guide;

            case GuideEnum.GUIDE_TYPE_PLACE:
                return this.place_guide;
        }
    }


    public nextGuide(type, current_step) {
        if (current_step < this.getGuideListByType(type).length) {
            return true;
        } else {
            return false;
        }
    }

    public setGuideFinished() {
        SaveDataManager.getInstance().setGuide(GuideEnum.GUIDE_FINISHED);
    }

    public saveGuide(type, step) {
        if (this.isFinished()) {
            return;
        }
        if (type == GuideEnum.GUIDE_TYPE_AWAY && step == this.away_guide.length) {
            this.guideSave = GuideEnum.GUIDE_FINISHED;
        } else if (type == GuideEnum.GUIDE_TYPE_CITY && step == this.city_guide.length) {
            this.guideSave = GuideEnum.AWAY_THREE_PLANE;
        } else {
            this.guideSave = this.getGuideListByType(type)[step].id;
        }
        SaveDataManager.getInstance().setGuide(this.guideSave);
    }


}