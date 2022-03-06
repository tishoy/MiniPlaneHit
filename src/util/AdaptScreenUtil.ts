
module AdaptSceenUtil {


    export function factor(): number {
        return egret.MainContext.instance.stage.stageWidth / 640;
    }
    export function wDivideH(): number {
        return egret.MainContext.instance.stage.stageHeight / egret.MainContext.instance.stage.stageWidth;
    }
    export function designWDivideH(): number {
        return 640 / 1136;
    }

    export function x_fix(): number {
        return (egret.MainContext.instance.stage.stageWidth - 640) / 2;
    }
    export function y_fix(): number {
        return (egret.MainContext.instance.stage.stageHeight - 1136) / 2;
    }

    export function gameStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }

    //当前游戏宽度
    export function curWidth(): number {
        return egret.MainContext.instance.stage.stageWidth;
    }

    //当前游戏宽度
    export function curHeight(): number {
        return egret.MainContext.instance.stage.stageHeight;
    }

    export function displayWidth(): number {
        return 640
    }

    export function displayHeight(): number {
        return 1136;
    }

    export function scaleMode(): string {
        return egret.MainContext.instance.stage.scaleMode;
    }

    export function loopPlay(mc, from = 1, to = 0) {
        if (to === 0) {
            to = mc.totalFrames;
        }
        if (mc.currentFrame < from || mc.currentFrame >= to) {
            mc.gotoAndStop(from);
        } else {
            mc.nextFrame();
        }
    }

    export function E8ScaleMode() {
        /**
          * 长宽适配方案
          */
        egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.NO_SCALE;

        if (AdaptSceenUtil.curWidth() > AdaptSceenUtil.displayWidth() && AdaptSceenUtil.curHeight() > AdaptSceenUtil.displayHeight()) {
            egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.NO_SCALE;
        } else {
            if (AdaptSceenUtil.curWidth() / AdaptSceenUtil.curHeight() < AdaptSceenUtil.displayWidth() / AdaptSceenUtil.displayHeight()) {
                egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
            } else {
                egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
            }
        }
    }
}
