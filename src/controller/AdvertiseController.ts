/**
 * 广告组件
 * creat by tishoy
 * 2019.10.3
 */
class AdvertiseController {
    private static instance: AdvertiseController = null;

    private _vedioAd;
    private _interstitialAd;
    private _bannerAd;

    constructor() {
        if (AdvertiseController.instance) {
            throw new Error("AdvertiseController singlon error")
        }
    }

    public async initAd() {
        this._vedioAd = await platform.fetchVedio();
        this._interstitialAd = await platform.fetchInterstitial();
        // if (SaveDataManager.getInstance().getUserData().interstitial) {
        //     AdvertiseController.getInstance().onCloseInterstitialAd();
        // }
        if (platform.name != "tt") {
            this._bannerAd = await platform.fetchBanner();
        }
        EconomicsController.getInstance().setUpAdvertise();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new AdvertiseController();
        }
        return this.instance;
    }

    public get vedio() {
        return this._vedioAd;
    }

    public get interstitial() {
        return this._interstitialAd;
    }

    public get banner() {
        return this._bannerAd;
    }

    public setBannerPosition(x, y, width, height) {
    }

    public async showBanner() {
        if (this.banner) {
            platform.analytics("showBanner", {});
            platform.showBanner(this.banner);
        } else {
            this._bannerAd = await platform.fetchBanner();
            platform.analytics("showBanner", {});
            platform.showBanner(this.banner);
        }
    }

    public async hideBanner() {
        if (this.banner) {
            platform.hideBanner(this.banner);
        } else {
            this._bannerAd = await platform.fetchBanner();
            platform.hideBanner(this.banner);
        }
    }

    public async showVedio(onPlay, onEnd, where) {
        if (this.vedio) {
            platform.analytics("showVedio", { tag: where });
            platform.vedioPlay(this.vedio, onPlay, onEnd);
        } else {
            this._vedioAd = await platform.fetchVedio();
            platform.analytics("showVedio", { tag: where });
            platform.vedioPlay(this.vedio, onPlay, onEnd);
        }

    }

    public async showInterstitial() {
        if (this.interstitial) {
            platform.analytics("showInterstitial", {});
            platform.showInterstitial(this._interstitialAd);
        } else {
            this._interstitialAd = await platform.fetchInterstitial();
            platform.analytics("showInterstitial", {});
            platform.showInterstitial(this._interstitialAd);
            this.onCloseInterstitialAd();
        }
    }

    /**
     * onCloseInterstitialAd
     */
    public async onCloseInterstitialAd() {
        this._interstitialAd.onClose(res => {
            EconomicsController.getInstance().interstitialReward()
        })
        // platform.setInterstitialCloseCallBack(this._interstitialAd, onClose);
    }


}