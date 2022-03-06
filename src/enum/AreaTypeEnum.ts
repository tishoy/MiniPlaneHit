/**
 * 
 */
module AreaTypeEnum {
    export const ONE_POINT = 0;
    export const POINTS = 1;
    export const ROW_OR_COL = 2;
    export const POINT_EXPAND = 3;

    export const ROW_A = 0;
    export const ROW_B = 9;
    export const ROW_C = 18;
    export const ROW_D = 27;
    export const ROW_E = 36;
    export const ROW_F = 45;
    export const ROW_G = 54;
    export const ROW_H = 63;
    export const ROW_I = 72;
    export const ROWS = [ROW_A, ROW_B, ROW_C, ROW_D, ROW_E, ROW_F, ROW_G, ROW_H, ROW_I];

    export const COL_1 = 0;
    export const COL_2 = 1;
    export const COL_3 = 2;
    export const COL_4 = 3;
    export const COL_5 = 4;
    export const COL_6 = 5;
    export const COL_7 = 6;
    export const COL_8 = 7;
    export const COL_9 = 8;
    export const COLS = [COL_1, COL_2, COL_3, COL_4, COL_5, COL_6, COL_7, COL_8, COL_9];

    export function getOneRow(row) {
        let grids = [];
        for (let i = 0; i < 9; i++) {
            grids.push(row + i)
        }
        return grids;
    }

    export function getOneCol(col) {
        let grids = [];
        for (let i = 0; i < 9; i++) {
            grids.push(col + 9 * i);
        }
        return grids;
    }
}