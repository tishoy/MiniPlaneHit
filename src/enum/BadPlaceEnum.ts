/**
 * Created by tishoy on 15/1/31.
 * 坏飞机枚举
 */
module BadPlaceEnum {
  /**
    *  可能会导致无法放置三架飞机的格子的飞机头   //需要与身子确定方向
    */
  export const BAD_GRID_LIST: number[] = [4, 13, 20, 20, 24, 24, 31, 36,
    37, 39, 40, 40, 40, 40, 41, 43,
    44, 49, 56, 56, 60, 60, 67, 76];
  /**
    *  可能会导致无法放置三架飞机的格子的飞机方向  //辅助头来确定方向，有的格子可能不用，但是为了数据对应都填上了
    */
  export const BAD_GRID_DIRECTION_LIST: number[] = [DirectionTypeEnum.UP, DirectionTypeEnum.UP,
  DirectionTypeEnum.UP, DirectionTypeEnum.LEFT,
  DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT,
  DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT,
  DirectionTypeEnum.LEFT, DirectionTypeEnum.RIGHT,
  DirectionTypeEnum.UP, DirectionTypeEnum.RIGHT,
  DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT,
  DirectionTypeEnum.LEFT, DirectionTypeEnum.RIGHT,
  DirectionTypeEnum.RIGHT, DirectionTypeEnum.UP,
  DirectionTypeEnum.DOWN, DirectionTypeEnum.LEFT,
  DirectionTypeEnum.RIGHT, DirectionTypeEnum.DOWN,
  DirectionTypeEnum.DOWN, DirectionTypeEnum.DOWN];
  /**
    *  第一架已经确定为badPlane后，来查看第二架飞机
    */
  export const BAD_GRID_TEST_LIST: number[][] = [[10, 22], [23], [13, 14], [10, 17],
  [9, 11], [10, 17], [10, 19, 20], [13, 15],
  [16], [4, 13, 21], [0, 3, 5, 6], [4, 14, 16, 21],
  [17, 19, 20, 23], [2, 7, 9, 18], [2, 11, 18], [7],
  [8, 11], [3, 5, 12], [13, 14], [6, 12],
  [6, 12], [9, 11], [0], [1, 12]];
  /**
    *  肯定不会出现飞机头的格子    //打算放置礼包
    */
  export const GIFT_GRID_LIST: number[] = [0, 8, 72, 80];
} 