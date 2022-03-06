/**
 * 声音管理
 * create by tishoy
 * 2018.8.8
 */

class SoundManager {

    private static instance: SoundManager = null;

    private bgm: egret.Sound;

    private bgmChannel: egret.SoundChannel;
    private soundChannel: egret.SoundChannel;

    private map: { [key: string]: egret.Sound; };

    constructor() {
        this.init();
    }

    private init(): void {
        if (SoundManager.instance !== null) {
            throw new Error("single instance error");
        }
        // this.loadBGM();
    }


    public static getInstance(): SoundManager {
        if (this.instance === null) {
            this.instance = new SoundManager();
        }
        return this.instance;
    }

    private loadBGM() {
        var sound = new egret.Sound();
        var url: string = "resource/assets/sound.mp3";
        //添加加载完成侦听
        sound.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        //开始加载
        sound.load(url);
    }

    private onLoadComplete(event) {
        this.bgm = <egret.Sound>event.target;
        //播放音乐
        this.bgmChannel = this.bgm.play(0, 0);
    }

    playBGM() {
        if (SettingController.getInstance().SoundPlaying) {
            if (this.bgm === undefined || this.bgm === null) {
                this.bgm = RES.getRes(SoundEnum.BACKGROUND_M4A);
                if (this.bgm === undefined || this.bgm === null) {
                    return;
                }
            }
            this.bgmChannel = this.bgm.play(0, 0);
        }
    }



    playSound(sound_res, loop: number = 1) {
        if (SettingController.getInstance().SoundPlaying) {
            let sound: egret.Sound = RES.getRes(sound_res);
            if (sound === undefined || sound === null) {
                return;
            }
            this.soundChannel = sound.play(0, loop);
        }
    }

    private onPlayOver() {
        // this.map[sound_res] = null;
    }

    public stopBGM(): void {
        this.bgmChannel.stop();
        if (this.soundChannel !== undefined) {
            this.soundChannel.stop();
        }
    }
}