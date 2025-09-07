# VOICEVOX運用環境について

## ローカルでサーバーを立ち上げて動かす

以下のコマンドを実行してローカルでサーバーを立てることでローカルでAPIを実行することができる

```
docker pull voicevox/voicevox_engine:cpu-latest
docker run --rm -it -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest
```

詳しくは [こちら](https://hub.docker.com/r/voicevox/voicevox_engine) を参照

## 公開サーバー上でAPIとして動かす

GCP Cloud Runにて稼働中
Cloud Runにて稼働している様子やコンソールの確認は [こちら](https://console.cloud.google.com/run?hl=ja) にアクセスして確認してください

## 参考

* [GCPでVOICEVOXを動かす](https://zenn.dev/yunkai/articles/gcp-voicevox)


# 実行ファイルのダウンロード

実際にアプリをダウンロードしてインストールしてみたい場合にはこちらにアクセスしてください

* [apk](https://climbing-pig.taptappun.workers.dev/download/apk) https://climbing-pig.taptappun.workers.dev/download/apk