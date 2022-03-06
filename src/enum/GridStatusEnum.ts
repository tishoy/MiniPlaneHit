/**
 * 格子状态
 */
module GridStatusEnum {
  /**
    *  覆盖
    */
  export const COVER: number = 0;
  /**
    *  隐形 被探知，未被击中
    */
  export const KNOWN: number = 1;
  /**
   * 展示
   */
  export const SHOW: number = 2;
  /**
   * 始终不显示
   */
  export const UNSHOW: number = 3;
  /**
   * 被标记
   */
  export const SIGN: number = 4;
}