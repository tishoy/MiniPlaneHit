/**
 * Created by tishoy on 15/1/31.
 * 格子类型枚举
 */
module GridTypeEnum {
  export const UNSET: number = -1;
  /**
    *  格子空
    */
  export const MISS: number = 0;
  /**
    *  格子中
    */
  export const BODY: number = 1;
  /**
    *  格子头
    */
  export const HEAD: number = 2;
  /**
   * 已知头
   */
  export const AI_KNOWNHEAD: number = 10;
  /**
   * 已知身体
   */
  export const AI_KNOWNBODY: number = 11;
  /**
   * 已知空
   */
  export const AI_KNOWNMISS: number = 12;
  /**
   * 机器检测的时候使用
   */
  export const AI_TEMPHEAD: number = 13;
  /**
  * 机器检测的时候使用
  */
  export const AI_TEMPBODY1: number = 15;
  export const AI_TEMPBODY2: number = 16;
  export const AI_TEMPBODY3: number = 17;
  /**
* 机器检测的时候使用
*/
  export const AI_KNOWNTEMPBODY1: number = 18;
  export const AI_KNOWNTEMPBODY2: number = 19;
  export const AI_KNOWNTEMPBODY3: number = 20;

  export const AI_KNOWNCERTAINBODY: number = 14;
  /**
    *  宝箱    //打算设置在角落里
    */
  export const GIFT: number = 50;
  /**
    *  金币    //打算设置在角落里
    */
  export const GOLD: number = 51;
  /**
   * 传送点
   */
  export const TELEPORT: number = 60;

} 