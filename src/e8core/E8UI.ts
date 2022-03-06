class E8UI {
    static setUIPosition(ui: egret.DisplayObject, posType: number, x, y) {
        switch (posType) {
            case UIDirectionEnum.L_B:
                ui.x = x + ui.width / 2;
                ui.y = Main.width - ui.height / 2 - y;
                break;

            case UIDirectionEnum.B:
                ui.x = Main.width / 2;
                ui.y = Main.height - ui.height / 2 - y;
                break;

            case UIDirectionEnum.R_B:
                ui.x = Main.width - ui.width / 2 - x;
                ui.y = Main.height - ui.height / 2 - y;
                break;

            case UIDirectionEnum.L:
                ui.x = x + ui.width / 2;
                ui.y = Main.height / 2;
                break;

            case UIDirectionEnum.M:
                ui.x = Main.width / 2;
                ui.y = Main.height / 2;
                break;

            case UIDirectionEnum.R:
                ui.x = Main.width - x - ui.width / 2;
                ui.y = Main.height / 2;
                break;

            case UIDirectionEnum.L_T:
                ui.x = x + ui.width / 2;
                ui.y = ui.height + y;
                break;

            case UIDirectionEnum.T:
                ui.x = Main.width / 2;
                ui.y = ui.height + y;
                break;

            case UIDirectionEnum.R_T:
                ui.x = Main.width - x - ui.width / 2;
                ui.y = ui.height + y;
                break;
        }
    }
}