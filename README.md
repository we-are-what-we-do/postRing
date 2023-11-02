# postRing
## 説明
プロジェクト[we-are-what-we-do](https://github.com/we-are-what-we-do/we-are-what-we-do)の[バックエンド](https://github.com/HalsekiRaika/wawwd)に、
ランダムなリングデータを送信するためのプログラムです。

## 必要なもの
- `node.js`
- `npm`

## 使い方
1. `npm install`で、必要なモジュールをインストール
1. バックエンドのAPサーバーをdocker-composeで起動する
1. `npm run serve`で、APサーバーにリングデータを1つ送信する
    - 補足
        - `npx ts-node ./src/main.ts {POSTしたい回数}`で、POSTするリングデータ数を指定できます
        - POST先は`http://localhost:3854/rings`です
            - POST先は`/src/constants.ts`の`API_URL`を参照しています
    - 注意
        - インスタンスを切り替える処理を実装していません
            - そのため、現在のインスタンスが終了次第、POST処理のループが終了します
        - 有効なロケーションが一つ必要です
            - 全ロケーションデータから0番目のidを、POSTするリングデータの`location`プロパティとして設定しています