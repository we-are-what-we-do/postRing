/**
 * 指定時間処理を停止する関数
 * @param {number} ms 待機するミリ秒数
 */
export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}