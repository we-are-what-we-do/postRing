import { Response } from 'node-fetch';
import { Point, FeatureCollection } from 'geojson';
import { getLocationConfig, getRingData, postRingData } from './modules/fetchDb';
import { RingData } from './types';
import { getAvailableIndex, getUsedIndexes } from './modules/handleRingIndexes';
import { generateRandomRing } from './modules/generateRandomRing';
import { argv } from 'process';
import { positionArray } from './torusPosition';
import { sleep } from "./modules/sleep";


// リングデータをPOSTする回数を、コマンドライン引数から指定する
const repeat: number = Number(argv[2]) || 1;

// 現在のインスタンス内で、使用済みのリング軌道indexの配列
let usedIndexes: number[] = [];


// ランダムなリングデータを送信する関数
async function main(): Promise<void>{
    // ロケーションを一か所取得する
    const geoJsonData: FeatureCollection<Point> = await getLocationConfig();
    const locationId: string | undefined = geoJsonData.features[0]?.id as string; // リングデータを送信するための仮ロケーションピンのID
    if(!locationId) throw new Error("有効なロケーションピンIDを取得できませんでした"); // ロケーションピン設定が一か所もない場合、エラーを返す

    // リングデータの最新インスタンスを取得する
    const latestRings: RingData[] = await getRingData();

    // 既に使用済みのリング軌道indexの配列を取得する
    usedIndexes = getUsedIndexes(latestRings);

    // コマンドライン引数で指定された回数分、ランダムなリングデータを生成してPOSTする
    for(let i: number = 0; i < repeat; i++){
        // インスタンスが終わるまでリングデータをPOST済みなら、処理をそこで停止する
        if(usedIndexes.length >= positionArray.length){
            console.log("インスタンスが終了したため、POSTを打ち切ります");
            break;
        };

        // 有効なリング軌道indexを1つ取得する
        const availableIndex: number | null = getAvailableIndex(usedIndexes); // 空いているランダムなリング軌道index
        if(availableIndex === null) throw new Error("有効なリング軌道indexが存在しません");

        // ランダムにリングデータを作成する
        const newRingData: RingData = generateRandomRing(locationId, usedIndexes);

        // 作成したリングデータをAPサーバーにPOSTする
        const response: Response = await postRingData(newRingData);

        // POSTしたリングデータを使用済みリング軌道indexとして登録しておく
        usedIndexes.push(newRingData.indexed);

        // 送信したリングデータをログに表示する
        console.log(newRingData);

        // 次のPOSTに間隔を空けるために0.1秒待機する
        await sleep(100);
    }

    // 最後に現在のインスタンス内のリング数を出力する
    console.log("Now ring count: " + usedIndexes.length + "/70");
}

main();