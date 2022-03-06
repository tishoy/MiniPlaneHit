/**
 * Created by tishoy on 15/1/31.
 * 方向枚举
 * 通过方向获取身体位置
 */
module DirectionTypeEnum {
  export const DIRECTION_LIST: number[] = [27, -3, -27, 3];
  /**
   * 错误
   */
  export const ERROR: number = -2;
  /**
   * 未设置
   */
  export const UNSET: number = -1;
  /**
    *  上
    */
  export const UP: number = 0;
  /**
    *  右
    */
  export const RIGHT: number = 1;
  /**
    *  下
    */
  export const DOWN: number = 2;
  /**
    *  左
    */
  export const LEFT: number = 3;
  /**
   * 添加飞机斜向 未确定
   */
  export const UNCERTAIN: number = 4;
  export const DIRECTION_LETTER = ["U", "R", "D", "L"];

  /**
    * 增加称号功能后，此处飞机身体数组顺序不可改变
    */
  export function getGridByDirection(direction: number): number[] {
    switch (direction) {
      case DirectionTypeEnum.UP:
        return [9, 18, 7, 8, 10, 11, 26, 28, 27];

      case DirectionTypeEnum.RIGHT:
        return [-1, -2, -19, -10, 8, 17, -12, 6, - 3];

      case DirectionTypeEnum.DOWN:
        return [-9, -18, -7, -8, -10, -11, - 26, -28, -27];

      case DirectionTypeEnum.LEFT:
        return [1, 2, 19, 10, -8, -17, 12, - 6, 3];

      default:
        return [];
    }
  }

  /**
   * 包括头
   * @param direction 方向
   */
  export function getRowFromHeadByDirection(direction: number): number[] {
    switch (direction) {
      case DirectionTypeEnum.UP:
        return [0, 1, 2, 1, 1, 1, 1, 3, 3, 3];

      case DirectionTypeEnum.RIGHT:
        return [0, 0, 0, -2, -1, 1, 2, -1, 1, 0];

      case DirectionTypeEnum.DOWN:
        return [0, -1, -2, -1, -1, -1, -1, - 3, -3, -3];

      case DirectionTypeEnum.LEFT:
        return [0, 0, 0, 2, 1, -1, -2, 1, -1, 0];

      default:
        return [];
    }
  }

} 