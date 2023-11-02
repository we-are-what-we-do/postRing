/* ISO8601形式の文字列を取り扱う関数 */
// 現在時刻'日本標準時)をISO8601形式の文字列で取得する関数
export function getIso8601DateTime(): string{
    // 取得できる値は必ず日本時間になる
    const jstNow = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    return new Date(jstNow).toISOString();
}

// ISO8601形式の日付時刻文字列同士を比較し、どちらが新しいのかを真偽値で取得する関数
export function compareISO8601Dates(dateStr1: string, dateStr2: string): boolean{
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);

    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        throw new Error('無効な日付時刻文字列です。');
    }

    return date1 > date2;
}