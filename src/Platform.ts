/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {

    initSDK();

    onShow(func);

    initAnalytics(): Object;

    analytics(key, value);

    name: string;
    openDataContext;
    // name;
    // banner;
    // vedio;

    setLoadingProgress(per);

    loadingComplete();

    setLifeCycleCallBack(onPause, onResume): Promise<any>;

    print(msg): Promise<any>;

    share(title, url, iconurl, cb, extendInfo, savedPath): Promise<any>;

    existRank(): boolean;

    getRank(): Promise<any>;

    uploadRank(key, score): Promise<any>;

    fetchBanner(): Promise<any>;

    showBanner(banner): Promise<any>;

    hideBanner(banner): Promise<any>;

    fetchVedio(): Promise<any>;

    reloadVedio(vedio);

    vedioPlay(vedio, onPlay, onEnd): Promise<any>;

    fetchInterstitial(): Promise<any>;

    showInterstitial(interstitialAd): Promise<any>;

    setInterstitialCloseCallBack(interstitialAd, onClose);

    getUserInfo(onSuccess): Promise<any>;

    offsetHead(): number;

    login(loading, onLogin): Promise<any>

    getSaveData(key): Promise<any>;

    setSaveData(key, data): Promise<any>;

    rankView(show): Promise<any>;

    getGameRecorderManager();

    stopRecord();

    pauseRecord();

    resumeRecord();

    startRecord();

    shareVedio(onShare);

    showShareButton();

    hideShareButton();

    showTip(title);

    loadFont(): Promise<any>;

    loadNextStage(stage): Promise<any>;

    hasBannerSDK(): boolean;

    hasInterstitialSDK(): boolean;

    hasVedioSDK(): boolean;

    hasShareSDK(): boolean;

    hasShareVedioSDK(): boolean;

    openScheme();

    getAppName();

    getLaunchOption();

    callFunction(func, data, callback);


    /**
     * 游戏服务器
     */
    getGameServerManager();

    gameServerLogin(svr, onLogin, onError);

    startMatch(svr, onMatch, onSuccess, onError, onJoin);

    cancelMatch(svr, onCancel, onError);

    startGame(svr, onStart, onSyncFrame, onEnd);

    endGame(svr);

    uploadFrame(svr, action);
}

class DebugPlatform implements Platform {
    name: "mi";
    banner;
    vedio;

    initSDK() {

    }

    onShow(func) {

    }

    async initAnalytics() {
        return {
            gameKey: "02a2d376f1268780cdeb969e3385bae2",
            secretKey: "9b426779362d3259747c55f90ce0a40500524bcb"
        };
        return {
            gameKey: "",
            secretKey: ""
        }
    }

    async analytics(key, value) {
        console.log(key, value);
    }

    async setLifeCycleCallBack(onPause, onResume) {
        egret.lifecycle.onPause = () => {
            onPause();
        }

        egret.lifecycle.onResume = () => {
            onResume();
        }
    }

    async setLoadingProgress(per) {

    }

    async loadingComplete() {

    }

    async print(msg) {
        console.log(msg)
    }

    existRank() {
        return false;
    }

    async getRank() {
        return new Promise((resolve, reject) => {
            console.log("获取");
            resolve([
                { "nick": "哈N她!)|A(1", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)A(2", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(3", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(4", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(5", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(6", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(7", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(8", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(9", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(10", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(11", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(12", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(13", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" },
                { "nick": "哈N她!)|A(14", "score": 5, "selfFlag": 1, "url": "http://thirdqq.qlogo.cn/g?b=sdk&k=F7aCnicxWzpicK89d0gkh7cw&s=100&t=1516260478" }
            ]);
        });
        // return  [];
    }
    async share(title, url) {
        console.log(title);
    }
    async uploadRank(key, score) {
        return score;
    }
    async getUserInfo(onSuccess) {
        onSuccess({ nickName: "username" })
        return { nickName: "username" }
    }
    offsetHead() {
        return 0
    }
    async login(loading, onLogin) {
        loading();
        onLogin(false, {}, 0);
    }
    async fetchBanner() {
        return null;
    }
    async showBanner(banner) {

    }
    async hideBanner(banner) {

    }
    async fetchInterstitial() {
        return null
    }
    async showInterstitial(interstitialAd) {

    }
    async setInterstitialCloseCallBack(interstitialAd, cb) {

    }
    async fetchVedio() {
        return null
    }
    async reloadVedio(vedio) {

    }
    async vedioPlay(vedio, onPlay, onEnd) {
        onEnd(true);
    }
    /**获得文件内容 */
    async getSaveData(fileName) {
        return { key: "key" }
    }
    /**文件中写入 */
    async setSaveData(fileName, data) {

    }
    async rankView(show) {
        // UIManager.getInstance().toRankScene();
    }
    getGameRecorderManager() {
        return null;
    }
    shareVedio(onShare) {

    }
    showShareButton() {

    }
    hideShareButton() {

    }
    showTip(title) {

    }
    stopRecord() {
    }

    pauseRecord() {
    }

    resumeRecord() {
    }

    startRecord() {
    }
    async loadNextStage(newLoadStage) {
        return;
        if (newLoadStage <= 30) {
            platform.print("load new stage" + newLoadStage);
            await RES.loadConfig(newLoadStage + ".res.json", "https://games.tishoy.com/kaihi3_h5/resource/");
            // 'RES.loadConfig("stage21.res.json", "https://games.tishoy.com/kaihi3_h5/resource/")'
        }
    }

    async loadFont() {

    }

    getAppName() {
        return "";
    }

    hasBannerSDK() {
        return false;
    }

    hasInterstitialSDK() {
        return false;
    }

    hasVedioSDK() {
        return false;
    }

    hasShareSDK() {
        return false;
    }

    hasShareVedioSDK() {
        return false;
    }

    openScheme() {

    }

    getLaunchOption() {
        return {};
    }

    callFunction(func, data, callback) {
        callback();
    }

    getGameServerManager() {
        return null;
    }

    gameServerLogin(svr, onLogin, onError) {

    }

    startMatch(svr, onStart, onSuccess, onError, onJoin) { }

    cancelMatch(svr, onCancel, onError) { }

    startGame(svr, onStart, onSyncFrame, onEnd) { }

    endGame(svr) { }

    uploadFrame(svr, action) { }

    openDataContext
}

if (!window.platform) {
    window.platform = new DebugPlatform();
    window.platform.name = "web";
}



declare let platform: Platform;

declare interface Window {
    platform: Platform
}





