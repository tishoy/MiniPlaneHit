/**
 * GM工具
 * create by tishoy
 * 2021.4.25
 */
class GMToolManager {
    constructor() {
        if (GMToolManager.instance) {
            throw new Error("AIController singlon error")
        }
    }

    private static instance: GMToolManager = null;
    private static _isRelease = false;

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new GMToolManager();
        }
        return this.instance;
    }

    public static get isRelease() {
        return this._isRelease;
    }

    public static set isRelease(value) {
        this._isRelease = value;
    }
}