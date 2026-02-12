# カスタムメッセージ機能追加と出力フォーマット変更

## Goal Description
ユーザーが任意のメッセージを計算結果に追加できるようにし、出力されるテキストのフォーマットを指定の形式に変更する。

## Proposed Changes

### wos-calc

#### [MODIFY] [index.html](file:///Users/takahironochiseabirdinc./Downloads/アングラ1/wos-calc/index.html)

1.  **UI追加**: `calc-area` (計算ボタン) と `result-box` (結果表示) の間に、カスタムメッセージ入力用の `<textarea>` を追加する。
    *   最大文字数: 100文字
    *   プレースホルダー: "追加メッセージ（任意・最大100文字）"
2.  **スタイル追加**: `<textarea>` が既存のデザイン（カード形式、角丸、パディング等）に馴染むようにCSSを追加する。
3.  **ロジック変更**: `calcFromTarget` および `calcFromDelay` 関数内の `output` 生成ロジックを変更する。
    *   削除: `\n着弾時間に合わせて派兵してください`
    *   追加: ユーザー入力メッセージ（改行含む）
    *   追加: `\n※UT9@2618: The ultimate alliance for your WOS life!`

### 追加修正: カスタムメッセージの保存機能

#### [MODIFY] [index.html](file:///Users/takahironochiseabirdinc./Downloads/アングラ1/wos-calc/index.html)

1.  **保存ロジック**:
    *   `<textarea id="customMessage">` に `oninput` イベントを追加し、入力内容を `localStorage` に保存する関数 (`saveCustomMessage`) を呼び出す。
    *   保存キー: `wos_custom_message`
2.  **復元ロジック**:
    *   `window.onload` イベント内で、`localStorage` から `wos_custom_message` を読み出し、値があれば `<textarea>` にセットする処理を追加する。

### 追加修正: 英語対応 (i18n)

#### [MODIFY] [index.html](file:///Users/takahironochiseabirdinc./Downloads/アングラ1/wos-calc/index.html)

1.  **翻訳リソース管理**:
    *   `const translations = { ja: { ... }, en: { ... } };` を定義。
    *   ユーザー指定の翻訳ルールを適用（"Larry Time Calculator", "Time Remaining", "Custom Message", "Calculate", "Copy" 等）。
2.  **言語切り替え機能**:
    *   ヘッダー部分に `[JP] / [EN]` 切り替えボタンを配置。
    *   クリック時に `currentLang` を更新し、UIを再描画。
    *   設定を `localStorage` ('wos_lang') に保存。初期表示時はブラウザ言語設定 (`navigator.language`) を考慮。
3.  **UIの多言語化**:
    *   静的テキスト要素に `data-i18n="key"` 属性を付与。
    *   動的生成部分（`renderLeaders`, 計算結果出力）を `currentLang` に応じて分岐または翻訳関数を使用するように変更。
    *   「距離」となっていたラベルをユーザー指定の「残り時間 (Time Remaining)」に変更。

## Verification Plan

### Manual Verification
1.  **言語切り替え**:
    *   画面上部のスイッチで日本語/英語が切り替わることを確認。
    *   指定された用語（"Larry Time Calculator" 等）が正しく表示されるか確認。
    *   特に「距離」が「残り時間」/「Time Remaining」に変わっているか確認。
2.  **自動判別**:
    *   リロード時に前回の言語設定が維持されるか確認。
3.  **機能確認**:
    *   英語モードで計算を行い、結果テキストも英語（または指定形式）で出力されるか確認。
### 追加修正: 時間入力の柔軟化

#### [MODIFY] [index.html](file:///Users/takahironochiseabirdinc./Downloads/アングラ1/wos-calc/index.html)

1.  **`parseTimeInput` 関数のロジック変更**:
    *   入力文字列から数字以外の文字（コロン、全角コロン、スペース等）を区切り文字として扱う、または数字のみを抽出する柔軟なパース処理に変更。
    *   **パターン認識**:
        *   3つの数字グループ (H, M, S) -> そのまま採用。
        *   2つの数字グループ (M, S) -> H=0 とみなす。
        *   1つの数字グループ (Sのみ? または Mのみ?) -> 今回の要件では `mm:ss` が主眼なので、2つ以上を基本とするが、数字の羅列（例: `184500` -> 18:45:00, `4500` -> 45:00）も可能な範囲でサポートするか検討。
        *   **ユーザー要望**: "HH（時）の入力を任意にする" -> `mm:ss` なら `00:mm:ss`。
    *   アラートの抑制: パース不能な場合のみアラート（またはエラー表示）を出すが、極力解釈するように努める。

## Verification Plan

### Manual Verification
1.  **入力パターンのテスト**:
    *   `18:45:00` (通常) -> 成功
    *   `45:00` (mm:ss) -> 成功 (00:45:00扱い)
    *   `18：45：00` (全角コロン) -> 成功
    *   `18 45 00` (スペース区切り) -> 成功 (実装次第)
2.  **計算結果確認**:
    *   意図した時間で計算されているか結果を確認。
