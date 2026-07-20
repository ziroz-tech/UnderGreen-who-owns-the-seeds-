# ストーリー会話CSVガイド

重要なシナリオ会話は、通常の通信イベント `comm_events.csv` とは別に、以下の3つのCSVで管理します。

## data/story_events.csv

イベントそのものの発生条件を指定します。

- `id`: 一意のイベントID。下の2つのCSVの `eventId` と一致させます。
- `trigger`: 発生タイミング。例: `game_start`, `first_plant`, `first_sale`, `market_upper_unlocked`。
- `layout`: 表示レイアウト。現状は `duel` を使います。
- `kicker`: 小さな分類ラベル。空欄なら表示されません。
- `title`: 会話タイトル。空欄なら表示されません。
- `background`: 背景画像。推奨は横長16:9。
- `choices`: 最終ページのボタン。例: `ok=LINK CLOSE|accept=ACCEPT SIGNAL`。
- `once`: `TRUE` なら一度だけ発生します。
- `priority`: 同じタイミングで複数ある場合の優先度。大きいほど先です。
- `blocking`: `TRUE` なら背景操作とゲーム内時間を止めます。
- `requirements`: 発生条件。例: `unitsSold>=1`。
- `context`: 発生文脈。例: `cropId=lettuce`。
- `sound`, `soundVolume`: 開始SE。`data/audio.csv` のIDを指定します。
- `effects`: 閉じた後の効果。例: `choice:*->comms:game_start`。

## data/story_event_speakers.csv

イベントごとの話者カードを指定します。

- `eventId`: `story_events.csv` の `id`。
- `speakerId`: 台詞行から参照する話者ID。同じイベント内で一意にします。
- `side`: `left`, `right`, `system`。`left` と `right` は画面左右のカードとして表示されます。`system` はナレーション用で、カードは出ません。
- `slot`: 同じ側に複数人いる場合の並び順。小さいほど基本位置に近くなります。
- `name`: 表示名。その場限りの偽名や呼称もここで指定できます。
- `role`: 肩書き。その場限りの表記を入れられます。
- `icon`: 話者画像。推奨は縦長または正方形。カード内でトリミングされます。

同じ `side` に複数人を置くと、カードが背面に積まれます。現在しゃべっている話者カードが前面に出ます。左右の配置は同一シナリオ内では固定です。

## data/story_event_lines.csv

会話本文を一行ずつ指定します。編集時はこのCSVを台本として上から読めます。

- `eventId`: `story_events.csv` の `id`。
- `speakerId`: `story_event_speakers.csv` の `speakerId`。
- `text`: 本文。話者名は本文に混ぜず、本文だけを書いてください。

表示順は、同じ `eventId` の行をCSVに書いた順番です。行を入れ替えれば、ゲーム内の会話順もそのまま変わります。

### 画像ポップアップ行

`text` に以下の形式を書くと、その行で画像ポップアップが表示されます。

```csv
episode0_first_illegal_procurement,mara,"[[image:assets/story/sample.png|マーラが提示した旧式PODの搬入写真]]"
```

- `image:` の後に画像URLを書きます。
- `|` の後に、履歴へ表示する概要文を書きます。
- 画像ポップアップを閉じると、次の会話行へ進みます。
- 会話履歴には画像URLではなく、`[IMAGE] 概要文` が表示されます。