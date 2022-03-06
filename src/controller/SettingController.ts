/**
 * creat by tishoy
 * 2019.4.12
 */
class SettingController {

    static instance: SettingController = null;

    private _soundPlaying: boolean;

    private _lang: string;

    constructor() {
        this.init();
    }

    init() {

    }

    public static getInstance(): SettingController {
        if (this.instance === null) {
            this.instance = new SettingController();
        }
        return this.instance;
    }

    get SoundPlaying() {
        if (this._soundPlaying === undefined) {
            let soundPlaying = SaveDataManager.getInstance().getSoundStatus();
            if (soundPlaying === null || soundPlaying === undefined || soundPlaying === "" || soundPlaying === "1") {
                this.SoundPlaying = true;
            } else {
                this._soundPlaying = soundPlaying === "1" ? true : false;
            }
        }
        return this._soundPlaying
    }

    set SoundPlaying(playing: boolean) {
        this._soundPlaying = playing;
        if (playing) {
            SaveDataManager.getInstance().saveSoundStatus("1");
            SoundManager.getInstance().playBGM();
        } else {
            SaveDataManager.getInstance().saveSoundStatus("0");
            SoundManager.getInstance().stopBGM();
        }
    }

    get Lang() {
        if (this._lang === undefined) {
            let lang = SaveDataManager.getInstance().getLang();
            if (lang === null || lang === undefined || lang === "") {
                this._lang = "zh_CN"
            } else {
                this._lang = lang;
            }
        }
        return this._lang
    }

    set Lang(lang) {
        SaveDataManager.getInstance().setLang(lang);
        this._lang = lang;
    }

}