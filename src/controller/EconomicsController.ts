/**
 * 金融控制
 * 在任务中会大量使用
 * creat by tishoy
 * 2021.4.25
 */
class EconomicsController {
    private static instance: EconomicsController = null;

    private _stocks = [];
    private _levels = [];

    public lastDate;

    constructor() {
        if (EconomicsController.instance) {
            throw new Error("EconomicsController singlon error")
        }
    }

    private stocks_config;
    private invest_config;
    private bannerKey;
    private interstitialKey;

    public init() {
        this.stocks_config = RES.getRes(ResourceManager.STOCK_JSON);
        this.invest_config = RES.getRes(ResourceManager.BUILDING_JSON);
        // let invest = SaveDataManager.getInstance().getUserData().invest;
        for (let i = 0; i < this.invest_config.length; i++) {
            this._levels.push(this.investLevel(i));
        }
        this._gasPrice = Math.floor(Math.random() * 1000 + Math.random() * 20000 + 10000);
        egret.setInterval(this.bolloonFly, this, 30000);
        egret.setInterval(this.checkGasIsFull, this, 30000);
        // this.setUpAdvertise();
    }

    public static getInstance() {
        if (this.instance === null) {
            this.instance = new EconomicsController();
        }
        return this.instance;
    }

    public setUpAdvertise() {
        if (platform.name == "tt") {
            SaveDataManager.getInstance().getUserData().banner = false;
            SaveDataManager.getInstance().getUserData().interstitial = true;
        }
        if (SaveDataManager.getInstance().getUserData().banner) {
            AdvertiseController.getInstance().showBanner();
            this.bannerKey = egret.setInterval(this.bannerReward, this, 120000);
        }
        if (SaveDataManager.getInstance().getUserData().interstitial) {
            AdvertiseController.getInstance().onCloseInterstitialAd();
        }

    }

    public removeAdvertise() {
        if (!SaveDataManager.getInstance().getUserData().banner) {
            AdvertiseController.getInstance().hideBanner();
            egret.clearInterval(this.bannerKey);
        }
    }

    public interstitialReward() {
        let gold = (this._levels[InvestTypeEnum.INVEST_TYPE_ADVERTISE] + 1) * 8000;
        SceneManager.getInstance().showTip("获得广告公司弹窗广告盈利金币" + gold);
        this.addGold(gold);
    }

    public bannerReward() {
        let gold = (this._levels[InvestTypeEnum.INVEST_TYPE_ADVERTISE] + 1) * 5000;
        SceneManager.getInstance().showTip("获得广告公司底部广告牌盈利金币" + gold);
        this.addGold(gold);
    }

    public vedioReward() {
        let gold = (this._levels[InvestTypeEnum.INVEST_TYPE_ADVERTISE] + 1) * 50000;
        SceneManager.getInstance().showTip("获得广告公司宣传大片广告盈利金币" + gold);
        this.addGold(gold);
    }

    public loginCost = null;

    public login(save: UserData) {
        this.lastDate = save.lastDate;

    }

    private _gasPrice;

    public get gasPrice() {
        return this._gasPrice;
    }


    public checkGasIsFull() {
        let udata = SaveDataManager.getInstance().getUserData();
        if (udata.gas > udata.gasMax) {
            SceneManager.getInstance().showTip("油量超出仓库最大容量，将无法保存至下次游戏");
        }
    }

    private bolloonFly() {
        if (SaveDataManager.getInstance().getUserData().gold < 9999) {
            SceneManager.getInstance().flyBalloon();
        }
        // CityController.getInstance().balloonFly();
    }

    public buyGas() {
        if (this.costGold(this._gasPrice * (1 + SaveDataManager.getInstance().getUserData().gasTax / 100))) {
            this.addGas(1);
        }
    }

    public sellGas() {
        if (this.costGas(1)) {
            this.addGold(this._gasPrice * (1 - SaveDataManager.getInstance().getUserData().gasTax / 100))
        }
    }

    public buyStock(stockId, amount) {

        if (this._stocks[stockId].hand + amount >= 99999) {
            SceneManager.getInstance().showTip("整这么多手，你要当股东么？");
            return;
        }
        let userData = SaveDataManager.getInstance().getUserData();
        let own = userData.gold;
        let cost = Math.floor(this.stocks[stockId].price * amount * (1 + SaveDataManager.getInstance().getUserData().stockTax / 100));
        let tax = Math.floor(this.stocks[stockId].price * SaveDataManager.getInstance().getUserData().stockTax / 100);
        if (cost > own + 200000) {
            SceneManager.getInstance().showTip("您的金币差的太多了，广告公司也觉得无能为力");
        } else if (own > cost) {

            SceneManager.getInstance().showAlert("财 务 报 告", "    买入" + amount + "手" + i18n.getLanguage("stock_name_" + stockId) + "将消耗" + cost + "金币, 其中缴税" + tax + "金币,是否看视频获取免税资格？",
                "$v确 定", () => {
                    AdvertiseController.getInstance().showVedio(() => {
                        SceneManager.getInstance().hideAlert();
                    }, (result) => {
                        if (result.finish) {
                            this.costGold(cost - tax);
                            platform.analytics("buyStock", { stockId: stockId, amount: amount, cost: cost - tax });
                        }
                    }, "免 税");
                }, "缴纳购买", () => {
                    this.costGold(cost);
                    SceneManager.getInstance().hideAlert();
                    platform.analytics("buyStock", { stockId: stockId, amount: amount, cost: cost });
                });
            let userData = SaveDataManager.getInstance().getUserData();
            this._stocks[stockId].cost = this._stocks[stockId].cost + this.stocks[stockId].price * amount;
            this._stocks[stockId].hand += amount;
            this._stocks[stockId].time = new Date().getTime();
            userData.updateStock(stockId, this._stocks[stockId])
        } else {
            if (own > this.stocks[stockId].price * amount) {
                SceneManager.getInstance().showAlert("财 务 报 告", "    由于税费原因，此次购买股票现金不足，可以观看广告，以免除此次税金" + (this.stocks[stockId].price * amount * SaveDataManager.getInstance().getUserData().stockTax / 100) + "金币",
                    "$v确 定", () => {
                        AdvertiseController.getInstance().showVedio(() => {
                            SceneManager.getInstance().hideAlert();
                        }, (result) => {
                            if (result.finish) {
                                platform.analytics("buyStock", { stockId: stockId, amount: amount, cost: own });
                                this.costGold(own);
                                this._stocks[stockId].cost = this._stocks[stockId].cost + this.stocks[stockId].price * amount;
                                this._stocks[stockId].hand += amount;
                                this._stocks[stockId].time = new Date().getTime();
                                userData.updateStock(stockId, this._stocks[stockId]);
                            }
                        }, "购买股票");
                    }, "取消交易");
            } else {
                SceneManager.getInstance().showAlert("财 务 报 告", "    此次购买股票现金不足，可以观看广告，完成此次购买！" + "其中税费为" + (this.stocks[stockId].price * amount * SaveDataManager.getInstance().getUserData().stockTax / 100) + "金币",
                    "$v确 定", () => {
                        AdvertiseController.getInstance().showVedio(() => {
                            SceneManager.getInstance().hideAlert();
                        }, (result) => {
                            if (result.finish) {
                                platform.analytics("buyStock", { stockId: stockId, amount: amount, cost: own });
                                this.costGold(own);
                                this._stocks[stockId].cost = this._stocks[stockId].cost + this.stocks[stockId].price * amount;
                                this._stocks[stockId].hand += amount;
                                this._stocks[stockId].time = new Date().getTime();
                                userData.updateStock(stockId, this._stocks[stockId]);
                            }
                        }, "购买股票");
                    }, "取消交易");
            }

        }
    }

    public sellStock(stockId, amount) {
        if (this._stocks[stockId].hand >= amount) {
            let userData = SaveDataManager.getInstance().getUserData();
            let earn = this.stocks[stockId].price * amount;
            this._stocks[stockId].hand -= amount;
            if (this._stocks[stockId].hand == 0) {
                this._stocks[stockId].cost = 0;
            } else {
                this._stocks[stockId].cost = this._stocks[stockId].cost - earn;
            }
            this._stocks[stockId].time = new Date().getTime();
            userData.updateStock(stockId, this._stocks[stockId]);


            let tax = SaveDataManager.getInstance().getUserData().stockTax / 100 * earn;

            SceneManager.getInstance().showAlert("财 务 报 告",
                "    卖出" + amount + "手" + i18n.getLanguage("stock_name_" + stockId) + "盈利" + earn + "金币,需要缴纳税金" + tax + "金币,是否看视频获取免税资格？",
                "$v确 定", () => {
                    AdvertiseController.getInstance().showVedio(() => {
                        SceneManager.getInstance().hideAlert();
                    }, (result) => {
                        if (result.finish) {
                            this.addGold(earn);
                            SceneManager.getInstance().showTip("卖出股票获得金币" + earn);
                            platform.analytics("sellStock", { stockId: stockId, amount: amount, earn: earn });
                        }
                    }, "免税资格");
                },
                "缴纳税费", () => {
                    this.addGold(earn * (1 - SaveDataManager.getInstance().getUserData().stockTax / 100));
                    SceneManager.getInstance().hideAlert();
                    SceneManager.getInstance().showTip("卖出股票获得金币" + earn);
                    platform.analytics("sellStock", { stockId: stockId, amount: amount, earn: earn * (1 + SaveDataManager.getInstance().getUserData().stockTax / 100) });
                });


        } else {
            SceneManager.getInstance().showTip("手数不足,卖出操作失败");
        }
    }

    public addGasFull() {
        let user = SaveDataManager.getInstance().getUserData();
        if (user.gasMax > user.gas) {
            let added = user.gasMax - user.gas;
            if (added > 10) {
                added = 10
            }
            SceneManager.getInstance().showAlert("报  告", "    观看视频广告,将会获得" + added + "滴宝贵的原油", "$v确 定", () => {
                AdvertiseController.getInstance().showVedio(() => {
                    SceneManager.getInstance().hideAlert();
                }, (result) => {
                    if (result.finish) {
                        SceneManager.getInstance().showTip("通过广告的大力宣传，我为祖国献石油成了当下第一热度");
                        this.addGas(added);
                        platform.analytics("gasAdd", { amount: added });
                    }
                }, "石油加号");
            }, "否 决", null);
        } else {
            SceneManager.getInstance().showAlert("报  告", "    观看视频广告,提高1点的原油储备", "$v确 定", () => {
                AdvertiseController.getInstance().showVedio(() => {
                    SceneManager.getInstance().hideAlert();
                }, (result) => {
                    if (result.finish) {
                        SceneManager.getInstance().showTip("为了感谢您的支持，广告公司为您扩建了油库");
                        SaveDataManager.getInstance().getUserData().gasMax++;
                        SceneManager.getInstance().updateGasMax();
                        platform.analytics("gasMaxAdd", { current: SaveDataManager.getInstance().getUserData().gasMax });
                    }
                }, "石油加号");
            }, "否 决", null);

        }
    }

    public useAllGold() {
        let userGold = SaveDataManager.getInstance().getUserData().gold;
        this.costGold(userGold);
    }

    public costGold(cost, tips = "") {
        let userGold = SaveDataManager.getInstance().getUserData().gold;
        if (Number(userGold) === NaN) {
            return false;
        }
        if (cost > userGold) {
            if (tips == "") {
                tips = i18n.getLanguage("tip_gold_not_enough") + ",广告公司的视频广告可以获取金币～"
            }
            SceneManager.getInstance().showTip(tips);
            // TODO 提示
            return false;
        }

        SaveDataManager.getInstance().getUserData().gold = Number(userGold) - Number(cost);
        SceneManager.getInstance().updateGold();
        SaveDataManager.getInstance().saveUserData();
        return true;
    }

    public costGas(cost) {
        let userGas = SaveDataManager.getInstance().getUserData().gas;
        if (Number(userGas) === NaN) {
            return false;
        }
        if (cost > userGas) {
            SceneManager.getInstance().showTip(i18n.getLanguage("tip_gas_not_enough") + ",点击原油公司以购买");
            // TODO 提示
            return false;
        }
        SaveDataManager.getInstance().getUserData().gas -= cost;
        SceneManager.getInstance().updateGas();
        SaveDataManager.getInstance().saveUserData();
        return true;
    }

    public addGold(add) {
        SaveDataManager.getInstance().getUserData().gold += add;
        SceneManager.getInstance().updateGold();
        SaveDataManager.getInstance().saveUserData();
    }

    public addGas(add) {
        SaveDataManager.getInstance().getUserData().gas += add;
        SceneManager.getInstance().updateGas();
        SaveDataManager.getInstance().saveUserData();
    }

    public stockClosed() {
        let now = new Date();
        let close = false;
        if (now.getHours() < 12 || (now.getHours() >= 14 && now.getHours() < 18)) {
            close = true;
        }
        return close;
    }


    public get stocks() {
        if (this._stocks.length === 0) {
            let data;
            let reset;
            let userSave = SaveDataManager.getInstance().getUserData();
            let now = new Date();
            let close = false;
            if (now.getHours() < 12 || (now.getHours() >= 14 && now.getHours() < 18)) {
                close = true;
            }
            if (now.getDate() != new Date(this.lastDate).getDate()) {
                reset = true;
            }
            let distance = now.getTime() - new Date(userSave.registDate).getTime();
            for (let i = 0; i < this.stocks_config.length; i++) {
                data = new StockData();
                data.id = this.stocks_config[i].id;
                let save = userSave.getStockById(data.id);
                data.name = i18n.getLanguage("stock_name_" + i);
                if (save != null) {
                    data.cost = save.cost;
                    data.time = save.time;
                    data.hand = save.hand;
                    data.burst = save.burst;
                } else {
                    data.cost = 0;
                    data.time = 0;
                    data.hand = 0;
                    data.burst = false;
                }
                if (close) {
                    data.price = NaN;
                    this._stocks.push(data);
                    continue;
                }
                // 设置burst
                if (reset && Math.random() < this.stocks_config[i].burst) {
                    data.burst = true;
                } else {
                    data.burst = false;
                }
                let rebase = this.stocks_config[i].base + this.stocks_config[i].wave * Math.floor(distance / DateUtil.DAY / this.stocks_config[i].bigcircle);
                // if (rebase > this.stocks_config[i].base + this.stocks_config[i].target) {
                //     this.stocks_config[i].base + this.stocks_config[i].wave * (Math.floor(distance / DateUtil.DAY / this.stocks_config[i].bigcircle) - 1)
                // }
                let allDay = distance / DateUtil.DAY;
                if (allDay < 1) {

                }
                let circle = Math.floor(distance / 2 / this.stocks_config[i].smcircle);
                if (data.burst) {
                    data.price = rebase + Math.floor(Math.random() * 4) * (2 * (circle % 2) - 1) * Math.floor(Math.random() * this.stocks_config[i].wave * (allDay % this.stocks_config[i].smcircle) / this.stocks_config[i].smcircle * 100) / 100;
                } else {
                    data.price = rebase + (2 * (circle % 2) - 1) * Math.floor(Math.random() * this.stocks_config[i].wave * 100) / 100
                }
                this._stocks.push(data);
            }
        }
        return this._stocks;
    }

    public investLevel(type) {
        let invest = SaveDataManager.getInstance().getUserData().invest[type];
        let level = 0;
        while (invest > Math.exp(level) * 100000) {
            level++;
        }
        return level;
    }

    public investBank() {
        let base = 100000;
        let now = new Date();
        let day = (now.getTime() - SaveDataManager.getInstance().getUserData().registDate) / DateUtil.DAY;
        let level = this.investLevel(InvestTypeEnum.INVEST_TYPE_BANK);
        let cost = Math.pow(2, level) * base * Math.ceil(day / 10);
        SceneManager.getInstance().showAlert("财 务 报 告", "    此次投资建设，将耗费" + cost + "金币。投资取得成果后，有希望降低交易税费，提高银行信用报告等。", "投 资", () => {
            if (this.costGold(cost)) {
                SaveDataManager.getInstance().getUserData().saveInvest(0, cost);
                let tax = Const.getInstance().initStockTax - level > Const.getInstance().stockTaxMin ?
                    (Const.getInstance().initStockTax - level) : Const.getInstance().stockTaxMin;
                SaveDataManager.getInstance().getUserData().stockTax = tax;
                platform.analytics("invest_bank", { cost: cost, tax: tax });
                SceneManager.getInstance().hideAlert();
                SceneManager.getInstance().showTip("投资成功")
            }
        }, "算 了 吧");

    }

    public investGasStation() {
        let base = 100000;
        let now = new Date();
        let day = (now.getTime() - SaveDataManager.getInstance().getUserData().registDate) / DateUtil.DAY;
        let level = this.investLevel(InvestTypeEnum.INVEST_TYPE_GASSTATION);
        let cost = Math.pow(2, level) * base * Math.ceil(day / 10);
        SceneManager.getInstance().showAlert("财 务 报 告", "    将耗费" + cost + "金币用于开采能源。投资取得成果后，有希望降低原油的交易汇费。", "投 资", () => {
            if (this.costGold(cost)) {
                SaveDataManager.getInstance().getUserData().saveInvest(1, cost);
                let tax = Const.getInstance().initGasTax - level > Const.getInstance().gasTaxMin ?
                    (Const.getInstance().initGasTax - level) : Const.getInstance().gasTaxMin;
                SaveDataManager.getInstance().getUserData().gasTax = tax;
                platform.analytics("invest_gas", { cost: cost, tax: tax });
                SceneManager.getInstance().hideAlert();
                SceneManager.getInstance().showTip("投资成功")
            }
        }, "再 想 想");
    }

    public investTech() {
        let base = 100000;
        let now = new Date();
        let day = (now.getTime() - SaveDataManager.getInstance().getUserData().registDate) / DateUtil.DAY;
        let level = this.investLevel(InvestTypeEnum.INVEST_TYPE_TECHNOLOGY);
        let cost = Math.pow(2, level) * base * Math.ceil(day / 10);
        SceneManager.getInstance().showAlert("财 务 报 告", "    将投资" + cost + "用于武器研发上。都说科技是第一生产力，钱不往这里花往哪花呀。", "投 资", () => {
            if (this.costGold(cost)) {
                SaveDataManager.getInstance().getUserData().saveInvest(2, cost);

                let missles = SaveDataManager.getInstance().getUserData().missles;
                let hasBird = false;
                let techExpectBird = missles.length;
                if (missles.indexOf(BulletTypeEnum.ARMOR_PIERCING_MISSILE) != -1) {
                    hasBird = true;
                    techExpectBird -= 1;
                }
                if (techExpectBird <= level) {
                    // missles = [];
                    let newBullets = ArrayUtil.randomS([
                        BulletTypeEnum.CROSS_BOOM,
                        BulletTypeEnum.INFRARED_ROW,
                        BulletTypeEnum.INFRARED_COL,
                        BulletTypeEnum.GUIDED_MISSILE,
                        BulletTypeEnum.INCENDIARY_BOMB,
                        BulletTypeEnum.NINE_PALACE_MISSILE], level);
                    if (missles.every((element) => {
                        return newBullets.indexOf(element) != -1
                    })) {
                        SceneManager.getInstance().showTip("科学家更换了研究方向，\n新品种的导弹很快就会得到生产");
                    } else {
                        SceneManager.getInstance().showTip("科学家们对于导弹研究已经突破了界限，\n但是生产还需要一定的时间");
                    }
                    newBullets.push(BulletTypeEnum.MISSILE);
                    if (hasBird) {
                        newBullets.push(BulletTypeEnum.ARMOR_PIERCING_MISSILE);
                    }
                    SaveDataManager.getInstance().getUserData().missles = newBullets;
                    platform.analytics("invest_tech", { cost: cost, bullets: newBullets });
                }

                SceneManager.getInstance().hideAlert();
                SceneManager.getInstance().showTip("投资成功")
            }


        }, "有 点 贵");
    }

    public investAdvertise() {
        let base = 100000;
        let now = new Date();
        let day = (now.getTime() - SaveDataManager.getInstance().getUserData().registDate) / DateUtil.DAY;
        let level = this.investLevel(InvestTypeEnum.INVEST_TYPE_ADVERTISE);
        let cost = Math.pow(2, level) * base * Math.ceil(day / 10);
        SceneManager.getInstance().showAlert("财 务 报 告", "    将投资" + cost + "再媒体宣传中。大幅度提高玩家底部广告，插屏广告，视频广告的收益。", "投 资", () => {
            if (this.costGold(cost)) {
                SaveDataManager.getInstance().getUserData().saveInvest(3, cost);
                if (this._levels[3] != level) {
                    this._levels[3] = level;
                }
                platform.analytics("invest_ad", { cost: cost, level: level });

                SceneManager.getInstance().hideAlert();
                SceneManager.getInstance().showTip("投资成功");
            }


        }, "钱 不 够");
    }

    public loan() {
        let own = this.appraisal();
        let userSave = SaveDataManager.getInstance().getUserData();
        if (userSave.loan.money < 0) {
            SceneManager.getInstance().showTip("您已经登陆弈吧银行的老赖名单，我们无法为您发放贷款");
            return;
        }
        if (userSave.loan.money > own) {
            SceneManager.getInstance().showTip("您的征信水平偏低，请先偿还欠款以提高征信");
            return;
        }
        let level = this._levels[InvestTypeEnum.INVEST_TYPE_BANK]
        if (level == 0) {
            SceneManager.getInstance().showTip("您不满足本次借贷条件，可以先进行一些商业投资试试");
            return;
        }
        let interest = own * Math.pow((SaveDataManager.getInstance().getUserData().stockTax) / 100, level);
        SceneManager.getInstance().showAlert("财 务 报 告", "    是否贷款" + own + "金币,期限为" + level + "天一次性还清,利息为" + interest, "确 定", () => {
            userSave.loan = {
                money: own * level,
                time: new Date().getTime(),
                day: level,
            };
            this.addGold(own * level);
            platform.analytics("loan", { own: own, level: level });
            SceneManager.getInstance().hideAlert();
            SceneManager.getInstance().showTip("给您发放了" + (own * level) + "的贷款,贷款天数为" + userSave.loan.day + "天");
        }, "取 消");
    }

    public payForLoan() {
        let loan = SaveDataManager.getInstance().getUserData().loan;
        let now = new Date().getTime();
        if (loan.time + loan.day * DateUtil.DAY > now) {
            // 提示贷款到期时间
            let leastTime = loan.time + loan.day * DateUtil.DAY - now;
            let days = Math.floor(leastTime / DateUtil.DAY);
            let hours = Math.floor(leastTime / DateUtil.HOUR);
            let minutes = Math.floor(leastTime / DateUtil.MINUTE);
            if (days > 0) {
                SceneManager.getInstance().showTip("贷款将在" + days + "天后到期，起准备好相应金币");
            } else if (hours > 0) {
                SceneManager.getInstance().showTip("贷款将在" + hours + "小时后到期，起准备好相应金币");
            } else if (minutes > 0) {
                SceneManager.getInstance().showTip("贷款将在" + minutes + "分钟后到期，起准备好相应金币");
            }

        } else {
            let user = SaveDataManager.getInstance().getUserData();
            let moreTime = now - (loan.time + loan.day * DateUtil.DAY);
            let moreDays = Math.ceil(moreTime / DateUtil.DAY);
            let interest = Math.floor(loan.money * Math.pow((SaveDataManager.getInstance().getUserData().stockTax) / 100, loan.day) + loan.money * Math.pow((SaveDataManager.getInstance().getUserData().stockTax / 100 * 2), moreDays));
            if (user.gold > loan.money + interest) {
                SceneManager.getInstance().showAlert("财 务 报 告", "    您的贷款已经到期,银行从您的账户扣除您的贷款" + loan.money + "及利息" + interest + "金币", "确 定", () => {
                    SceneManager.getInstance().hideAlert();
                    SceneManager.getInstance().showTip("贷款到期扣除金币" + loan.money + ",及利息" + interest);
                    this.costGold(loan.money + interest);
                    user.loan = { money: 0, time: 0, day: 0 };
                    user.saveUserData();
                    platform.analytics("payLoan", { cost: loan.money + interest, interest: interest });
                }, "");

            } else {
                // 提示不足
                SceneManager.getInstance().showAlert("财 务 报 告", "    您的贷款已经到期,您当前无法偿还此次贷款及利息" + (loan.money + interest) + "金币，请您尽快在存放足够的金币，以免逾期给您带来不便", "确 定", () => {
                    SceneManager.getInstance().hideAlert();
                    this.costGold(user.gold);
                    user.loan = { money: loan.money - user.gold, time: loan.time, day: loan.day };
                    user.saveUserData();
                    SceneManager.getInstance().showTip("贷款已经到期，您的金币账户余额不足，无法偿还。已经扣除您账户中所有金币，余下贷款及利息将在下次登录时扣取");
                }, "");
            }
        }
    }


    // 玩家资产评估 // 贷款使用
    public appraisal() {
        let userSave = SaveDataManager.getInstance().getUserData();
        let money = userSave.gold + userSave.getStockEarn() + userSave.gas * 20000;
        return money
    }

}