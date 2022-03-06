/**
 * 
 */
class i18n {
    public static langData;

    public static getLanguage(word) {
        return i18n.langData[SettingController.getInstance().Lang][word];
    }

    public static FLY_BACK_TIP = "fly_back_tip";

    public static PLAYER_COMMAN_NAME = "player_comman_name";

    public static START_BUTTON = "start_button";
    public static START_BUTTON2 = "start_button2";

    public static AIRPORT_BUTTON = "airport_button";
    public static BANK_BUTTON = "bank_button";
    public static GAS_BUTTON = "gas_button";
    public static PUZZLE_BUTTON = "puzzle_button";
    public static INSURE_BUTTON = "insure_button";
    public static REPAIR_BUTTON = "repair_button";
    public static BULLET_BUTTON = "bullet_button";
    public static ADVERTISE_BUTTON = "advertise_button";

    public static INVEST_BUTTON = "invest_button";

    public static RESULT_WIN = "result_win";

    public static RESULT_LOSS = "result_loss";

    public static RESULT_GIVE_UP = "result_give_up";

    public static RESULT_WIN_BUT_SLOW = "result_win_but_slow";

    public static PUZZLE_RESULT_WIN = "puzzle_result_win";

    public static PUZZLE_RESULT_LOSS = "puzzle_result_loss";

    public static PUZZLE_RESULT_GIVE_UP = "result_puzzle_give_up"

    public static BULLET_COST = "bullet_cost";

    public static GAME_REWARD = "game_reward";

    public static PUZZLE_REWARD = "puzzle_reward";

    public static INVEST_HELP_ = "invest_help_";

    public static NOT_ENOUGH_MONEY_TIP = "not_enough_money_tip";

    public static HEALTH_GAME_TIP = "health_game_tip";

    public static GAME_OVER = "game_over";

    public static LEVEL_NAME_ = "level_name_";

    public static UI_BULLET_DETAIL_ = "ui_bullet_detail_";

    public static TIP_NEED_ONE_MAP = "tip_need_one_map";
}