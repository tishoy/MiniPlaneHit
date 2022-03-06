/**
 * 
 */
module ArrayUtil {
    export function add(list: any[], item: any) {
        if (list.indexOf(item) === -1) {
            list.push(item);
        }
    }

    export function remove(list: any[], item: any) {
        let index = list.indexOf(item);
        if (index !== -1) {
            list = list.splice(index, 1);
        }
        return list;
    }

    export function random(list: any[], amount: number = 1, temp = []) {
        if (amount === 0) {
            return temp;
        } else {
            let roundResult = list[Math.floor(Math.random() * list.length)];
            temp.push(roundResult);
            amount--;
            return ArrayUtil.random(list, amount, temp);
        }
    }

    export function randomS(list: any[], amount: number = 1, tempList = [], tempResult = []) {
        if (amount >= list.length) {
            return list;
        } else if (amount === 0) {
            return tempResult;
        } else {
            if (tempResult.length === 0) {
                for (var i = 0; i < list.length; i++) {
                    tempList.push(list[i]);
                }
            }
            let roundResult = tempList[Math.floor(Math.random() * tempList.length)];
            ArrayUtil.add(tempResult, roundResult);
            ArrayUtil.remove(tempList, roundResult);
            amount--;
            return ArrayUtil.randomS(list, amount, tempList, tempResult);
        }
    }

}