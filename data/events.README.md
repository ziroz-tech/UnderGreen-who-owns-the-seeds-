# Demand Signals and Market Events

市場価格は、作物と市場の組み合わせごとに持つ「需要量」から、実際の売却で蓄積した「供給圧」を差し引いた需給バランスと、直近の基礎食料出荷から算出する「出荷レベル」で決まります。

## 編集するCSV

- `market_demand_signals.csv`: 通常時の需要容量、供給圧の吸収速度、1個売却した時に増える供給圧、価格感度、価格倍率の上下限を設定します。
- `supply_crops.csv`: 出荷レベルへ加算する作物と、1個あたりの供給ポイントを設定します。
- `supply_levels.csv`: 直近期間の供給ポイントに応じた段階と、商品作物の需要容量・回復・価格への補正を設定します。
- `market_event_demand_effects.csv`: ランダム市場イベントが、どの需要シグナルへどう作用するかを設定します。
- `schedule_rumors.csv`: 予定表の噂と需要シグナルへの作用を設定します。
- `events.csv`: ランダム市場イベントの予告文、発生文、期間、仲介料を設定します。

## market_demand_signals.csv

- `baseSignal`: 通常時に回復する需要シグナルの基準値。
- `maxSignal`: イベント込みで保持できる最大値。
- `recoveryPerDay`: ゲーム内1日あたりに市場が吸収する供給圧。値が小さい作物ほど値崩れが長く残ります。
- `saleImpact`: 1個売却するたびに蓄積する供給圧。
- `sensitivity`: 標準需要を下回った時の値崩れが価格へ反映される強さ。
- `surgeSensitivity`: 標準需要を上回った時の需要増が価格へ反映される強さ。大きくすると噂・イベント時の価格が強く上がります。
- `priceFloor` / `priceCeiling`: 需要による価格倍率の下限・上限。
- `supplyBoostFactor`: 出荷レベル補正を受ける割合。基礎食料は `0`、商品作物ほど大きくします。

## 出荷レベル

`supply_levels.csv` の `windowDays` 日以内に出荷した対象作物だけを集計します。レタス、ホウレンソウ、トマトのような基礎食料を継続出荷すると、商品作物の需要容量と回復速度が上がります。

## 価格と供給圧

通常時は需要量と標準需要が等しく、供給圧が0なので価格倍率は1.0です。売却すると市場・作物ごとに供給圧が増え、実効需要が下がって価格も下落します。供給圧はrecoveryPerDayずつ減少します。噂や市場イベントの追加需要は需要量を直接増やすため、同じ供給量でも価格が上昇します。

## イベント操作

`operation` / `signalOperation` は次の3種類です。

- `add`: 期間限定の追加需要。供給圧と相殺され、期間終了時に消滅します。
- `subtract`: 期間中、需要シグナルを指定量だけ減らします。
- `multiply`: 期間中、需要シグナル全体へ倍率を掛けます。

`market_event_demand_effects.csv` では `marketId` または `cropId` に `*` を指定すると、登録済みの全対象へ展開されます。

`forecastText` と `activeText` では `{leadDays}`、`{activeDay}`、`{duration}` を使用できます。LOWNet履歴と予定表は需要変動の予告として表示されます。

旧 `market_signals.csv`、`crop_market_response.csv`、`market_supply_effects.csv` は現在のゲームから読み込まれません。