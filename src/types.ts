// APサーバーから取得するリングデータ
export type RingInstance = {
    id: string; // インスタンスのid (UUID)
    location: string; // その場所であるというLocation (UUID)
    started_at: string; // インスタンスが作成された時間 (ISO8601)
    rings?: RingData[]; // リングデータ
}

// リングデータ
export type RingData = {
    "id"?: string; // リングデータのID (UUID)
    "pos_in"?: { // torusの座標
        "x": number;
        "y": number;
    };
    "location": string; // ロケーションピンのID (UUID)
    "longitude": number; // 撮影地点の経度
    "latitude": number; // 撮影地点の緯度
    "indexed": number; // リング軌道内の順番 (DEI中の何個目か、0~69)
    "hue": number; // リングの色調 (0～360)
    "user": string; // ユーザーID (UUID)
    "created_at": string; // 撮影日時 (ISO8601)
};