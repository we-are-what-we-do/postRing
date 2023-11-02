import fetch, { Response } from 'node-fetch';
import { Point, FeatureCollection } from 'geojson';
import { API_URL } from '../constants';
import { RingData, RingInstance } from '../types';
import { compareISO8601Dates } from './calculateTimeData';


/**
 * GETリクエストを行う共通関数
 * @param {string} apiEndpoint APIのエンドポイント
 * @param {string} queryParams クエリ文字列
 * @returns {Promise<Response>} fetch APIのResponse
 */
async function makeGetRequest(apiEndpoint: string, queryParams: string = ""): Promise<Response>{
    try {
        const url: string = API_URL + apiEndpoint + queryParams;
        const response = await fetch(url);
        if(response.ok){
            return response;
        }else{
            // エラーレスポンスの場合はエラーハンドリングを行う
            throw new Error(`HTTPエラー: ${response.status}`);
        }
    }catch(error){
        // エラーハンドリング
        console.error('リクエストエラー:', error);
        throw error;
    }
}

/**
 * ピンの全設定データを取得する関数
 * @returns {Promise<FeatureCollection<Point>>} GeoJSON形式のピンの全設定データ
 */
export async function getLocationConfig(): Promise<FeatureCollection<Point>>{
    let result: FeatureCollection<Point> | null = null;

    // キャッシュデータがない場合、サーバーからデータを取得する
    const apiEndpoint: string = "locations";
    const response: Response = await makeGetRequest(apiEndpoint);
    result = await response.json() as FeatureCollection<Point>;
    // console.log("location: ", result);

    return result;
}

/**
 * リングのデータを取得する関数
 * @returns {Promise<RingData[]>} APサーバーから取得したリングデータ
 */
export async function getRingData(): Promise<RingData[]>{
    const apiEndpoint: string = "rings";

    // インスタンス一覧を取得する
    const latestInstanceId: string | null = await getLatestInstanceId(apiEndpoint); // 全インスタンスを取得し、最新のインスタンスを切り出す
    if(!latestInstanceId) return []; // 有効なインスタンスが一つもない場合は、空配列で開始する

    // 最新のインスタンスを取得する
    const queryParams: string = `?id=${latestInstanceId}`
    const response: Response = await makeGetRequest(apiEndpoint, queryParams);
    const data: RingInstance = await response.json() as RingInstance;

    // リングデータを取得する
    const ringData: RingData[] | undefined = data.rings;
    if(ringData === undefined) throw new Error("取得したデータにringsプロパティがありません")

    return ringData;
}

// 最新のインスタンスのIDを取得する関数
/**
 * 最新のインスタンスのIDを取得する関数
 * @param {string} apiEndpoint 基本的に"rings"を指定
 * @returns {Promise<string | null>} 最新のリング周回インスタンスのID
 */
async function getLatestInstanceId(apiEndpoint: string = "rings"): Promise<string | null>{
    // 全インスタンスを取得する
    const response: Response = await makeGetRequest(apiEndpoint);
    const data: RingInstance[] = await response.json() as RingInstance[];

    // 取得した全インスタンスの中から、最新のインスタンスを切り出す
    const latestInstance: RingInstance | null = data.reduce((latestInstance: RingInstance | null, currentInstance: RingInstance) => {
        if(!latestInstance){
            return currentInstance;
        }

        // 新しい日付時刻文字列が見つかった場合に更新
        const latestDate: string = latestInstance.started_at;
        const currentDate: string = currentInstance.started_at;
        if(compareISO8601Dates(currentDate, latestDate)){
            return currentInstance;
        }else{
            return latestInstance;
        }
    }, null);

    const latestInstanceId: string | null = latestInstance?.id ?? null; // 有効なインスタンスが一つもない場合は、nullを返す
    // console.log({data, latestInstance})

    return latestInstanceId;
}


/**
 * JSONのPOSTリクエストを行う共通関数
 * @param {string} apiEndpoint APIのエンドポイント
 * @param {Object} data POSTしたいデータ
 * @returns {Promise<Response>} fetch APIのResponse
 */
async function makePostRequest(apiEndpoint: string, data: Object): Promise<Response>{
    try {
        const url: string = API_URL + apiEndpoint;
        // console.log({url, data})

        const response: Response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if(response.ok){
            // HTTPステータスコードが2xx（成功）の場合にレスポンスを返す
            return response;
        }else{
            console.log(response.status)
            // エラーレスポンスの場合はエラーハンドリングを行う
            throw new Error(`HTTPエラー: ${response.status}`);
        }
    }catch(error){
        // エラーハンドリング
        console.log(error)
        // console.error('POSTリクエストエラー:', error.message);
        throw error;
    }
}

/**
 * リングデータを送信する関数
 * @param {Object} data POSTしたいリングデータ
 * @returns {Promise<Response>} fetch APIのResponse
 */
export async function postRingData(data: RingData): Promise<Response>{
    const apiEndpoint: string = "rings"; // リングのデータを送信するための、APIのエンドポイント
    const response: Response = await makePostRequest(apiEndpoint, data);
    return response;
}