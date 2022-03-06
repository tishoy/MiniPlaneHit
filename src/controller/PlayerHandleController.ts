/**
 * 用户操作控制
 * creat by tishoy
 * 2019.4.12
 */
class PlayerHandleController {
    private static instance: PlayerHandleController = null;


    constructor() {
        if (PlayerHandleController.instance) {
            throw new Error("AIController singlon error")
        }
        this.init();
    }

    private E8ToolTimer: egret.Timer;
    private toolCount = 0;

    private init() {
        this.E8ToolTimer = new egret.Timer(1000, 1);
        this.toolCount = 0;
        this.E8ToolTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimer, this);
    }

    private onTimer(e) {
        this.E8ToolTimer.reset();
        this.toolCount = 0;
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new PlayerHandleController();
        }
        return this.instance;
    }


    public playerTouchedGameView(gridId) {
        if (GameController.getInstance().isAwayGame()) {
            if (GameController.getInstance().isAttackPhase) {
                if (RecordController.getInstance().isGridOpen(gridId)) {
                    SceneManager.getInstance().showTip(i18n.getLanguage("tip_already_hit_this_place"));
                } else {
                    let bulletType = BulletController.getInstance().lanchBullet()
                    let cost = BulletDataCache.getInstance().getData(bulletType).cost;
                    if (!EconomicsController.getInstance().costGold(cost) && !GameController.getInstance().lanchMissleVedio) {
                        SceneManager.getInstance().showAlert("军 事 报 告", "    我方囊中羞涩，无法支付高昂的导弹费用。观看视频，可以以获得广告公司赞助，自由使用", "$v使 用", () => {
                            EconomicsController.getInstance().useAllGold();
                            GameController.getInstance().lanchMissleVedio = true;
                            AdvertiseController.getInstance().showVedio(() => {
                            }, (result) => {
                                if (result.finish) {
                                }
                            }, "使用导弹");
                            SceneManager.getInstance().hideAlert();
                        }, "放 弃 使 用", () => {
                            SceneManager.getInstance().hideAlert();
                            SceneManager.getInstance().showTip("我们还是选择普通的导弹进行攻击吧");
                            return;
                        });
                        return;
                    } else {
                        GameController.getInstance().hitGrid(gridId, bulletType);
                    }
                }


                // GameController.getInstance().hitGrid(gridId);
                // SceneManager.getInstance().awayScene.updateBullets();
            } else {

            }
        } else if (GameController.getInstance().isMultiplayer()) {
            if (GameController.getInstance().isAttackPhase) {
                if (RecordController.getInstance().isGridOpen(gridId)) {
                    SceneManager.getInstance().showTip(i18n.getLanguage("tip_already_hit_this_place"));
                } else {
                    let bullet = BulletController.getInstance().getMatchBullet();
                    if (bullet != null) {
                        SceneManager.getInstance().matchScene.shootBullet();
                        BulletController.getInstance().shoot();
                        GameController.getInstance().hitGrid(gridId, bullet);
                        ServerController.getInstance().uploadHitGrid(gridId, bullet);
                    } else {
                        SceneManager.getInstance().showTip("弹药还在装在的过程中");
                    }
                    // GameController.getInstance().doubleGameHitGird(gridId, BulletController.getInstance().getMatchBullet());
                }
            }
        } else if (GameController.getInstance().isPlacing()) {
            SceneManager.getInstance().placingGameView.rotationPlane(gridId);
        } else if (GameController.getInstance().isPuzzleGame()) {
            GameController.getInstance().hitGrid(gridId, BulletController.getInstance().lanchBullet());
        } else if (GameController.getInstance().isIdle()) {
            let x = MapUtil.getXYFromValue(gridId).x;
            let y = MapUtil.getXYFromValue(gridId).y;
            if (x === 7 && y === 4) {
                if (this.toolCount === 0) {
                    this.E8ToolTimer.start();
                } else if (this.toolCount === 3) {
                    // E8
                    GMToolManager.isRelease = true;
                    this.toolCount = -1;
                    this.E8ToolTimer.reset();
                }
                this.toolCount++;
            }
        } else if (GameController.getInstance().isEditor()) {
            GameController.getInstance().editorGrid(gridId);
        } else if (GameController.getInstance().isRobotPlayer()) {
            if (RecordController.getInstance().isGridOpen(gridId)) {
                SceneManager.getInstance().showTip(i18n.getLanguage("tip_already_hit_this_place"));
            } else {
                let bullet = BulletController.getInstance().getMatchBullet();
                if (bullet != null) {
                    SceneManager.getInstance().matchScene.shootBullet();
                    BulletController.getInstance().shoot();
                    GameController.getInstance().hitGrid(gridId, bullet);
                } else {
                    SceneManager.getInstance().showTip("弹药还在装在的过程中");
                }
                // GameController.getInstance().doubleGameHitGird(gridId, BulletController.getInstance().getMatchBullet());
            }
        } else if (GameController.getInstance().isPlaceWaiting()) {
            // SceneManager.getInstance().showTip("请等待一下其他玩家布置地图！");
        } else if (GameController.getInstance().isResultWaiting()) {
            // SceneManager.getInstance().showTip("请等待一下其他玩家完成游戏！");
        }
    }

    private targetBullet: BulletView;
    /**
     * 
     * @param gridId 
     */
    public playerBeginMoveInGameView(gridId, e) {
        if (GameController.getInstance().isNormalGame() && GameController.getInstance().isAttackPhase) {
            // SceneManager.getInstance().awayScene.getGameView().setSelected(gridId);
            SceneManager.getInstance().showTargetBullet(e);
            SceneManager.getInstance().storedGameView.showTouchEffect(gridId);
        } else if (GameController.getInstance().isPlacing()) {
            SceneManager.getInstance().placingGameView.selectOneGrid(gridId);
        } else if (GameController.getInstance().isPlaceWaiting()) {
            SceneManager.getInstance().showTip("请等待一下其他玩家布置地图！");
        } else if (GameController.getInstance().isResultWaiting()) {
            SceneManager.getInstance().showTip("请等待一下其他玩家完成游戏！");
        }

    }

    public playerMovingInGameView(gridId, e) {
        if (GameController.getInstance().isNormalGame() && GameController.getInstance().isAttackPhase) {
            // SceneManager.getInstance().awayScene.getGameView().setSelected(gridId);
            SceneManager.getInstance().moveTargetBullet(e);
            SceneManager.getInstance().storedGameView.resetTouchEffect();
            SceneManager.getInstance().storedGameView.showTouchEffect(gridId);
        } else if (GameController.getInstance().isPlacing()) {
            SceneManager.getInstance().placingGameView.movingOnePlane(gridId, e);
        }

    }

    public playerReleaseOnGameView(gridId, e) {
        if (GameController.getInstance().isNormalGame()) {
            // SceneManager.getInstance().awayScene.getGameView().setSelected(-1);
            SceneManager.getInstance().cancelTargetBullet(e);
            SceneManager.getInstance().storedGameView.resetTouchEffect();
        } else if (GameController.getInstance().isPlacing()) {
            SceneManager.getInstance().placingGameView.releaseOnePlane(gridId, e);
        }

    }

    public playerReleaseOut(gridId, e) {
        if (GameController.getInstance().isNormalGame()) {
            // SceneManager.getInstance().awayScene.getGameView().setSelected(-1);
            SceneManager.getInstance().cancelTargetBullet(e);
            SceneManager.getInstance().storedGameView.resetTouchEffect();
        } else if (GameController.getInstance().isPlacing()) {
            // SceneManager.getInstance().placingScene.releaseOnePlane(gridId, e);
        }
    }

}