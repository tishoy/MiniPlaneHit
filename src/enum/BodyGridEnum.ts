/**
 * Created by tishoy on 15/1/31.
 * 身体枚举，需要与DirectionTypeEnum搭配使用
 */
module BodyGridEnum {
    export const UNSET: number = -1;
    export const BONE: number = 1;
    export const WING: number = 6;
    export const TAIL: number = 7;
    export const BOTTOM: number = 8;

    export function getType(indexOfBodyGrid: number): number {
        if (indexOfBodyGrid <= BodyGridEnum.BONE) {
            return BodyGridEnum.BONE;
        } else if (indexOfBodyGrid <= BodyGridEnum.WING) {
            return BodyGridEnum.WING;
        } else if (indexOfBodyGrid <= BodyGridEnum.TAIL) {
            return BodyGridEnum.TAIL;
        } else if (indexOfBodyGrid == BodyGridEnum.BOTTOM) {
            return BodyGridEnum.BOTTOM;
        }
    }
} 