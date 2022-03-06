/**
 * 游戏类型
 */
module GameTypeEnum {
    // 未开启地图
    export const GAME_TYPE_IDLE = 0
    // 放置飞机
    export const GAME_TYPE_MAPING = 1;
    // 打飞机
    export const GAME_TYPE_AWAY = 2;
    export const GAME_TYPE_HITTING = 2;
    export const GAME_TYPE_MULTIPLAYER = 3;
    export const GAME_TYPE_PUZZLE = 4;
    export const GAME_TYPE_HISTORY = 5;
    export const GAME_TYPE_RACE = 6;
    export const GAME_TYPE_EDITOR = 7;
    export const GAME_TYPE_DESIGN = 8;
    export const GAME_TYPE_ROBOT_PLAYER = 9;
    export const GAME_TYPE_PLACING_WAITING = 10;
    export const GAME_TYPE_RESULT_WAITING = 11;
}