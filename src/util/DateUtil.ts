/**
 * 
 */
module DateUtil {
    export const SECOND = 1000;
    export const MINUTE = 60 * SECOND;
    export const HOUR = 60 * MINUTE;
    export const DAY = 24 * HOUR;

    export function getDateString(time) {
        let dateObj = new Date(time);
        let year = dateObj.getFullYear();
        let date = dateObj.getDate();
        let month = dateObj.getMonth();
        return year + "/" + month + "/" + date;
    }

    export function getTimeString(time) {
        let dateObj = new Date(time);
        let hour = dateObj.getHours();
        let minute = dateObj.getMinutes();
        let second = dateObj.getSeconds();
        return hour + ":" + minute + ":" + second;
    }
}