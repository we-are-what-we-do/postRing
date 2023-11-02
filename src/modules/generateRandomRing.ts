import { RingData } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { getIso8601DateTime } from './calculateTimeData';
import { getAvailableIndex } from './handleRingIndexes';

/**
 *  POST用のランダムなリングデータを生成する関数
 * @param {string} locationId 生成するリングデータに指定するlocation
 * @param {number[]} usedIndexes 現在のインスタンス内のリングで使用されているindex群
 * @return {RingData} POST用のランダムなリングデータ
 */
export function generateRandomRing(locationId: string, usedIndexes: number[]): RingData{
    const availableIndex: number | null = getAvailableIndex(usedIndexes); // 空いているランダムなリング軌道index
    if(availableIndex === null) throw new Error("有効なリング軌道indexが存在しません");

    const ringHue: number = Math.floor(Math.random() * 361); // ランダムに選択したリングの色調
    const newUserId: string = uuidv4(); // ランダムに作成した一意なユーザーID
    const nowTime: string = getIso8601DateTime(); // ISO8601形式の現在時刻

    const newRingData: RingData = {
        location: locationId, // ロケーションピンのID (UUID)
        longitude: 0, // 撮影地点の経度
        latitude: 0, // 撮影地点の緯度
        indexed: availableIndex, // リング軌道内の順番 (DEI中の何個目か、0~69)
        hue: ringHue, // リングの色調 (0～360)
        user: newUserId, // ユーザーID (UUID)
        created_at: nowTime // 撮影日時 (ISO8601)
    }

    return newRingData;
}