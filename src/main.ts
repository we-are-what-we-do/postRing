import { v4 as uuidv4 } from 'uuid';
import { Point, FeatureCollection } from 'geojson';
import { getLocationConfig, getRingData } from './modules/fetchDb';
import { RingData } from './types';
import { getIso8601DateTime } from './modules/calculateTimeData';
import { getAvailableIndex, getUsedIndexes } from './modules/handleRingIndexes';

main();

// ランダムなリングデータを送信する関数
async function main(){
    // ロケーションを一か所取得する
    const geoJsonData: FeatureCollection<Point> = await getLocationConfig();
    const locationId: string | undefined = geoJsonData.features[0]?.id as string; // リングデータを送信するための仮ロケーションピンのID
    if(!locationId) throw new Error("有効なロケーションピンIDを取得できませんでした"); // ロケーションピン設定が一か所もない場合、エラーを返す
    // console.log(locationId); // 仮

    // リングデータの最新インスタンスを取得する
    const latestRings: RingData[] = await getRingData();

    // 有効なリング軌道indexを1つ取得する
    const usedIndexes: number[] = getUsedIndexes(latestRings); // 既に使用済みのリング軌道indexの配列
    const availableIndex: number | null = getAvailableIndex(usedIndexes); // 空いているランダムなリング軌道index
    if(availableIndex === null) throw new Error("有効なリング軌道indexが存在しません");

    // ランダムにリングデータを作成する
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
    
    // 送信したリングデータをログに表示する
    console.log(newRingData);
}



// 新しいUUIDを生成する
// const newUuid = uuidv4();
// console.log('New UUID:', newUuid);