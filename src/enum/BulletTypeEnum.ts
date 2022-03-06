/**
 * 子弹类型
 * create by tishoy
 * 2019.4.14
 */
module BulletTypeEnum {
  export var BULLET_GRID = {};
  export var BULLET_GRID_AREA = [];
  export var BULLET_GRID_ROW = [];
  export var BULLET_UNLOCK_LEVEL = [];

  var auto = 0;

  /**
   * 普通导弹
   * 0
   */
  export const MISSILE = auto++;
  BULLET_UNLOCK_LEVEL[MISSILE] = 0;
  BULLET_GRID[MISSILE] = [0];
  BULLET_GRID_AREA[MISSILE] = AreaTypeEnum.ONE_POINT;

  /**
   * 十字花炸弹
   * 1
   */
  export const CROSS_BOOM = auto++;
  BULLET_UNLOCK_LEVEL[CROSS_BOOM] = 2;
  BULLET_GRID_AREA[CROSS_BOOM] = AreaTypeEnum.POINTS;
  BULLET_GRID[CROSS_BOOM] = [-9, -1, 0, 1, 9];
  BULLET_GRID_ROW[CROSS_BOOM] = [-1, 0, 0, 0, 1];
  /**
   * 行外线
   * 2
   */
  export const INFRARED_ROW = auto++;
  BULLET_UNLOCK_LEVEL[INFRARED_ROW] = 5;
  BULLET_GRID_AREA[INFRARED_ROW] = AreaTypeEnum.ROW_OR_COL;
  /**
   * 列射线
   * 3
   */
  export const INFRARED_COL = auto++;
  BULLET_UNLOCK_LEVEL[INFRARED_COL] = 5;
  BULLET_GRID_AREA[INFRARED_COL] = AreaTypeEnum.ROW_OR_COL;
  /**
   * 制导导弹
   * 4
   */
  export const GUIDED_MISSILE = auto++;
  BULLET_UNLOCK_LEVEL[GUIDED_MISSILE] = 1;
  BULLET_GRID[GUIDED_MISSILE] = [0];
  BULLET_GRID_AREA[GUIDED_MISSILE] = AreaTypeEnum.ONE_POINT;
  /**
   * 燃烧弹
   * 5
   */
  export const INCENDIARY_BOMB = auto++;
  BULLET_UNLOCK_LEVEL[INCENDIARY_BOMB] = 5;
  BULLET_GRID[INCENDIARY_BOMB] = [0];
  BULLET_GRID_AREA[INCENDIARY_BOMB] = AreaTypeEnum.ONE_POINT;
  /**
   * 碎甲
   * 6
   */
  export const ARMOR_PIERCING_MISSILE = auto++;
  BULLET_UNLOCK_LEVEL[ARMOR_PIERCING_MISSILE] = -1;
  BULLET_GRID[ARMOR_PIERCING_MISSILE] = [0];
  BULLET_GRID_AREA[ARMOR_PIERCING_MISSILE] = AreaTypeEnum.ONE_POINT;
  /**
   * 9宫格炸弹
   * 7
   */
  export const NINE_PALACE_MISSILE = auto++;
  BULLET_UNLOCK_LEVEL[NINE_PALACE_MISSILE] = 3;
  BULLET_GRID_AREA[NINE_PALACE_MISSILE] = AreaTypeEnum.POINTS;
  BULLET_GRID[NINE_PALACE_MISSILE] = [- 10, -9, -8, -1, 0, 1, 8, 9, 10];
  BULLET_GRID_ROW[NINE_PALACE_MISSILE] = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
  /**
   * 探测弹
   */

  /**
   * 雷爆单
   */
  /**
   * 迷惑飞机
   */

  /**
   * 伞兵
   */

  /**
   * 类型总数
   */
  export const COUNT = auto;


  export function getBulletEffect(bulletType, grid) {
    let effectGrids = [];
    let { x, y } = MapUtil.getXYFromValue(grid);
    if (this.BULLET_GRID_AREA[bulletType] === AreaTypeEnum.ONE_POINT) {
      // if (bulletType === BulletTypeEnum.GUIDED_MISSILE) {
      //   // this.hitGrid(this.getUnHitPlaneGrid(), BulletController.getInstance().useBullet());
      //   this.getUnHitPlaneGrid()
      // }
      return [grid];
    } else if (this.BULLET_GRID_AREA[bulletType] === AreaTypeEnum.ROW_OR_COL) {
      if (bulletType === this.INFRARED_ROW) {
        effectGrids = AreaTypeEnum.getOneRow(AreaTypeEnum.ROWS[y])
      } else {
        effectGrids = AreaTypeEnum.getOneCol(AreaTypeEnum.COLS[x]);
      }
    } else if (this.BULLET_GRID_AREA[bulletType] === AreaTypeEnum.POINTS) {
      let target_grid = this.BULLET_GRID[bulletType];
      let target_grid_row = this.BULLET_GRID_ROW[bulletType];

      for (let i = 0; i < target_grid_row.length; i++) {
        if (y + target_grid_row[i] === MapUtil.getXYFromValue(grid + target_grid[i]).y && MapUtil.gridValid(grid + target_grid[i])) {
          effectGrids.push(grid + target_grid[i]);
        }
      }
    }
    return effectGrids;
  }
}