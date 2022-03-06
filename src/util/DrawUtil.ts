/**
 * 
 */
module DrawUtil {
    export function spliceColor(color) {
        let result = { r: -1, g: -1, b: -1 };
        result.b = color % 256;
        result.g = Math.floor((color / 256)) % 256;
        result.r = Math.floor((color / 256) / 256);
        return result;
    }
    export function setImageColor(image: egret.DisplayObject, color: number) {
        // 将16进制颜色分割成rgb值
        let result = spliceColor(color);
        let colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        colorMatrix[0] = result.r / 255;
        colorMatrix[6] = result.g / 255;
        colorMatrix[12] = result.b / 255;
        let colorFilter = new egret.ColorMatrixFilter(colorMatrix);

        image.filters = [colorFilter];
    }

    export function textFilter(textContent, fontSize = 24, withShadow = true) {
        let textEffect = new egret.Sprite();
        let text: egret.TextField = new egret.TextField();
        text.text = textContent;
        text.size = fontSize;
        text.stroke = 4;
        text.height = text.textHeight + 10;
        text.width = text.textWidth + 10;
        text.strokeColor = 0x333333;
        text.lineSpacing = 20;
        text.textAlign = egret.HorizontalAlign.CENTER;
        text.verticalAlign = egret.VerticalAlign.MIDDLE;

        if (withShadow) {
            let textShadow: egret.TextField = new egret.TextField();
            textShadow.text = textContent;
            textShadow.textColor = 0x333333;
            textShadow.size = fontSize;
            // textShadow.lineSpacing = 20;
            textShadow.stroke = 4;
            textShadow.strokeColor = 0x333333;
            textShadow.x = 2;
            textShadow.y = 4;
            textShadow.height = textShadow.textHeight + 10;
            textShadow.width = textShadow.textWidth + 10;
            textEffect.addChild(textShadow);
            textShadow.textAlign = egret.HorizontalAlign.CENTER;
            textShadow.verticalAlign = egret.VerticalAlign.MIDDLE;
        }

        // text.x = - text.textWidth / 2;
        // text.y = - text.textHeight / 2;

        textEffect.addChild(text);
        textEffect.anchorOffsetX = textEffect.width / 2;
        textEffect.anchorOffsetY = textEffect.height / 2;
        textEffect.cacheAsBitmap = true;
        return textEffect;

    }

    export function randomColor(colorA, colorB) {
        let resultA = spliceColor(colorA);
        let resultB = spliceColor(colorB);
        let colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        colorMatrix[0] = NumUtil.range(resultA.r, resultB.r, true) / 255;
        colorMatrix[6] = NumUtil.range(resultA.g, resultB.g, true) / 255;
        colorMatrix[12] = NumUtil.range(resultA.b, resultB.b, true) / 255;
        let colorFilter = new egret.ColorMatrixFilter(colorMatrix);
        return colorFilter;
    }

    export function colorTween(image: egret.DisplayObject, from, to, ms = 2000) {
        let fromResult = spliceColor(from);
        let toResult = spliceColor(to);
        let colorMatrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

        let times = 0;
        let interval = egret.setInterval(() => {
            if (times < 20) {
                times++;
                colorMatrix[0] = (Math.floor((toResult.r - fromResult.r) * times / 20) + fromResult.r) / 255;
                colorMatrix[6] = (Math.floor((toResult.g - fromResult.g) * times / 20) + fromResult.g) / 255;
                colorMatrix[12] = (Math.floor((toResult.b - fromResult.b) * times / 20) + fromResult.b) / 255;
                image.filters = [new egret.ColorMatrixFilter(colorMatrix)];
            } else {
                egret.clearInterval(interval);
            }

        }, this, 100);

    }
}