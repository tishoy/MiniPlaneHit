class WebBitmap extends egret.Bitmap {

    private loader: egret.ImageLoader;
    
    constructor(url) {
        super();
        this.initView(url)
    }

    private initView(url): void {

        this.loader = new egret.ImageLoader();
        this.loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        if (url !== undefined) {
            this.loader.load(url);
        }
    }

    private onLoadComplete(event: egret.Event): void {
        this.loader = <egret.ImageLoader>event.target;
        var bitmapData: egret.BitmapData = this.loader.data;
        var texture = new egret.Texture();
        texture.bitmapData = bitmapData;
        this.texture = texture;
    }

    public updateView(url): void {
        if (url !== undefined) {
            this.texture = null;
            this.loader.load(url);
        }
    }
}