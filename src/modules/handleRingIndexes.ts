import { RingData } from "../types";
import { positionArray } from "../torusPosition"; // 値は使用しないが、配列の長さを取得したいため、torus軌道設定配列をimportする

/**
 * 既に使用されているリング軌道indexを配列で取得する関数
 * @param {RingData[]} existedRings 現在のインスタンス内のリングデータの配列
 * @returns {number[]} 既に使用されているリング軌道indexの配列
 */
export function getUsedIndexes(existedRings: RingData[]): number[]{
    const usedIndexes: number[] = existedRings.map(value => {
        return value.indexed;
    });
    return usedIndexes;
}

/**
 * 指定した配列内に存在するindex以外の要素から、ランダムなindexを取得する関数
 * @param {number[]} excludedIndexes 現在のインスタンス内のリング軌道indexの配列
 * @returns {number | null} 現在のインスタンス内の空いているindex
 */
export function getAvailableIndex(excludedIndexes: number[]): number | null{
    // 指定した配列内に存在するindex以外の要素のみが含まれた配列を生成する
    const eligibleIndexes = positionArray
        .map((_, index) => index)
        .filter(index => !excludedIndexes.includes(index)); // indexが既に存在する場合は配列に追加しない

    // すべての要素が除外された場合、nullを返す
    if (eligibleIndexes.length === 0) return null;

    // 指定した配列内に存在するindex以外の要素から、ランダムなindexを取得する
    const randomIndex = eligibleIndexes[Math.floor(Math.random() * eligibleIndexes.length)];

    return randomIndex;
}