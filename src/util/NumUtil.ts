/**
 * 
 */
module NumUtil {
    export function circle(length, id) {
        if (id > length) {
            return circle(length, id - length);
        }
        if (id <= 0) {
            return circle(length, id + length)
        }
        return id;
    }

    export function range(from, to, integer = true) {
        let random = Math.random() * (to - from);
        return from + (integer ? Math.floor(random) : random);
    }

    export function exceptRange(list: Array<any>, except) {
        let result = Math.floor(Math.random() * (list.length - 1));
        let index = list.indexOf(except);
        if (index === -1) {
            return ColorEnum.colorList[0];
        }
        if (index > result) {
            return ColorEnum.colorList[result];
        } else {
            return ColorEnum.colorList[result + 1];
        }
    }

    export const TRILLION = "T";
    export const BILLION = "B";
    export const MILLION = "M";
    export const THOUSAND = "K";
    export const DOT = ".";
    export const EMPTY = "";
    export const POST_FIX: string[] = [
        "K", "M", "B", "T",
        "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM",
        "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ",
        "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM",
        "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ",
        "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM",
        "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ",
        "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM",
        "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ",
        "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EJ", "EK", "EL", "EM",
        "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EU", "EV", "EW", "EX", "EY", "EZ"
    ];


    export function numberToString(number: number): string {
        let resultStr = "";

        number = Math.floor(number);
        if (number <= 1000) {
            return (number).toString();
        }


        let length = 0;
        let LOGE10 = 10;
        let power = 1;
        while (number / Math.pow(LOGE10, power) > 1) {
            power++;
        }
        length = power;

        let groupOfThree = Math.floor((length - 1) / 3);
        let reduced = number / Math.pow(1000, groupOfThree);

        resultStr = "";
        if (length % 3 == 1) {
            resultStr += reduced.toFixed(1);
        } else {
            reduced = Math.round(reduced);
            resultStr += reduced.toString();
        }



        //append postfix
        if (groupOfThree >= POST_FIX.length) {
            groupOfThree = POST_FIX.length - 1;
        }

        resultStr += POST_FIX[groupOfThree - 1];

        return resultStr;

    }
}