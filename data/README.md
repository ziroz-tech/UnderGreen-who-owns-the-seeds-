# Data CSV Notes

## info_books.csv
情報タブに表示する「本」を管理します。

- `id`: 本のID。`info_entries.csv` の `bookId` と対応します。
- `order`: 表示順。
- `title`: 本のタイトル。
- `kicker`: 小さな分類ラベル。
- `description`: 本棚に表示する説明文。
- `thumbnail`: 本のサムネイル画像パス。
- `defaultEntryId`: 本を開いたとき最初に選ばれる項目ID。
- `style`: `book` または `handwritten`。手書き風にしたい本は `handwritten`。
- `unlocked`: `true` で表示、`false` で非表示。

## info_entries.csv
情報タブの各本の中身を管理します。

- `bookId`: 所属する本のID。
- `id`: 項目ID。
- `order`: 表示順。
- `title`: 項目名。
- `kicker`: 項目の短い説明ラベル。
- `category`: 分類。
- `thumbnail`: 項目サムネイル。空欄時は作物アイコンや本のサムネイルを使います。
- `cropId`: 作物と紐づける場合に指定。指定するとゲーム内ステータスが自動表示されます。
- `body`: 本文。`|` 区切りで段落を分けられます。
- `method`: 水耕栽培方法などの補足本文。`|` 区切り対応。
- `protagonistNote`: 主人公メモ。手書き風のメモ欄として表示されます。

## labor_tooltips.csv
労務管理画面のツールチップを管理します。

- `id`: 表示箇所を示す固定キー。変更するとその行は参照されません。
- `title`: ツールチップ上部の見出し。空欄にすると見出しを表示しません。
- `body`: ツールチップ本文。空欄にするとそのツールチップを無効にできます。
- 文中の `{label}` などは動的な値へ置換されるプレースホルダーです。名称は変更せず、前後の文章だけ編集してください。
- 使用中のプレースホルダー: `{label}`、`{direction}`、`{reason}`、`{condition}`、`{packageLabel}`、`{coreLabel}`、`{skippedNodes}`、`{robotName}`。
