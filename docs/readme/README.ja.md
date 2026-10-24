<div align="center">
  <img src="../../public/memo-icon.svg" width="88" height="88" alt="Memo Desktop icon" />
  <h1>Memo Desktop</h1>
  <p>ドラッグ操作、Markdown、AI に対応した軽量な Windows デスクトップメモ。</p>
  <p>Windows x64 · React · Electron · 11 の表示言語 · MIT</p>
</div>

[简体中文](../../README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · **日本語** · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt-BR.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

## 機能

- **デスクトップメモ**：独立したウィンドウ、移動、サイズ変更、最前面表示、ロック、スター、柔らかな影。
- **右端への収納**：ボタンで細いタブに収納し、ホバーでプレビュー。他のタブを隠さず、切り替えると前のプレビューを閉じます。クリックやドラッグ後は開いたままになります。
- **Markdown**：見出し、太字、斜体、リスト、タスク、プレビュー、`.md` 書き出し。
- **ワークスペース**：検索、すべてのメモ、スター付きメモ、色、テーマ、ログイン時の起動、トレイ操作。
- **AI / MCP**：ローカルサービスを通じて AI がメモの作成、読み取り、編集、追記、表示、非表示、削除を行えます。
- **多言語**：簡体字中国語、繁体字中国語、英語、日本語、韓国語、ドイツ語、フランス語、スペイン語、ポルトガル語、ロシア語、アラビア語。システム言語への追従とアラビア語の RTL に対応。
- **ローカル保存**：現在の Windows ユーザーのデータフォルダーに保存します。アプリのアカウントやクラウド同期は不要です。

正式対応は **Windows 10/11 x64** です。その他の OS と Windows ARM64 はパッケージ作成・検証の対象外です。

## インストールと更新

このリポジトリの **Releases** から `Memo Desktop Setup <version>.exe` をダウンロードしてください。同じリリースの `SHA256SUMS.txt` と照合できます：

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\Memo Desktop Setup <version>.exe'
```

更新前にトレイから旧バージョンを終了してください。現在、インストーラーに Windows コード署名はなく、自動更新のダウンロード機能もありません。

`v<package.json.version>` タグを push するとリリース処理が始まります。初回リリース前はインストーラーがない場合があります。[リリースガイド](../RELEASING.md)（英語）を参照してください。

## ソースから実行

**Windows x64、Node.js 22.12 以降、npm、Git** が必要です。リポジトリを clone し、ルートで実行します：

```powershell
npm ci
npm start
```

依存関係のインストール後は [`start.cmd`](../../start.cmd) のダブルクリックでも起動できます。現在のソースをビルドして起動し、`release` 内の古い実行ファイルは使用しません。別バージョンは先にトレイから終了してください。

`npm start`、`start.cmd`、インストール版は `%APPDATA%\Memo\memo.json` を共有します。開発前にアプリを終了してバックアップしてください。`npm run dev` はブラウザープレビューのみで、実際のデスクトップウィンドウ、トレイ、MCP は利用できません。

### 開発用コマンド

| コマンド | 用途 |
| --- | --- |
| `npm ci` | ロックファイルに従って依存関係をインストール |
| `npm start` | ビルドしてローカル Electron アプリを起動 |
| `npm run dev` | Vite のブラウザープレビューを起動 |
| `npm test` | データ、収納、言語、起動、リリースのテスト |
| `npm run build` | 型チェックとフロントエンドのビルド |
| `npm run runtime` | Windows Electron ランタイムの準備と検証 |
| `npm run check:i18n` | 隠しウィンドウで 11 言語と RTL を検証。先にビルドとランタイムの準備が必要 |
| `npm run check:dpi` | 接続中の画面の DPI とタブのサイズを検証。先にビルドとランタイムの準備が必要 |
| `npm run pack` | `release/win-unpacked` に展開版を作成 |
| `npm run dist` | 公開せず NSIS インストーラーを作成 |
| `npm run package:win` | 既存ビルドから Windows x64 インストーラーを作成 |
| `npm run release:check` | バージョンと変更履歴を検証。設定時は RELEASE_TAG も確認 |
| `npm run release:prepare` | リリース資産とチェックサムをローカルで準備。アップロードしない |

CI の単一画面テストは、実際の異なる DPI の複数画面テストの代わりにはなりません。画面間の動作を変更する場合は貢献ガイドに従ってください。

## メモの使い方

- タイトルバーのグリップでメモを移動し、タイトルを直接編集できます。
- ピンは最前面表示、スターは「スター付き」への追加です。それぞれ独立しています。
- ロックすると編集ツールが隠れ、タイトル、本文、色、移動、サイズ変更ができなくなります。削除前にロックを解除してください。スターとピンは変更できます。
- 通常のメモは収納ボタンを押したときだけ閉じます。フォーカスを失ったり端に近づくだけでは収納しません。収納前にピンを解除し、収納設定を無効にするとボタンも隠れます。
- 収納タブは約 0.15 秒のホバーで開きます。元のタブ、隙間、メモ上では開いたまま、すべてから離れて約 0.45 秒後に閉じます。クリック、移動、サイズ変更後は開いたままです。
- メモを閉じると非表示になり、ワークスペースで削除すると内容が消えます。管理画面を閉じてもトレイで動作します。
- 設定ではテーマ、既定の色、言語、ログイン起動、トレイ起動、右端への収納を変更できます。
- データの場所は設定で確認できます。memo.json のバックアップ・復元前にアプリを終了してください。

## AI / MCP の接続

**AI と MCP** 画面の設定をコピーし、stdio MCP 対応クライアントに追加してください。デスクトップアプリは起動したままにします。インストール版の設定は Electron の Node モードを使うため、別途 Node.js は不要です。開発時はシステムの Node も使えます。下のパスを実際の clone 先に置き換えてください：

```json
{
  "mcpServers": {
    "memo": {
      "command": "node",
      "args": [
        "C:/path/to/memo-desktop/electron/mcp.cjs"
      ]
    }
  }
}
```

| ツール | 機能 |
| --- | --- |
| `memo_list` | メモと状態の一覧 |
| `memo_create` | 色、ピン、ロック、スターを指定して作成 |
| `memo_update` | タイトル、本文、色、状態を更新 |
| `memo_append` | 既存の本文にテキストを追記 |
| `memo_show / memo_hide` | デスクトップメモを表示・非表示 |
| `memo_delete` | ロックされていないメモを削除 |

例：「緑色の週間計画メモを作り、タスクを 3 つ追加してスターを付けて」。

MCP は現在のユーザーのローカル名前付きパイプでメインプロセスに要求し、データファイルを直接書き換えません。有効な間、接続クライアントはメモを読み書きでき、ロック規則も適用されます。レンダラーは sandbox と context isolation を使用し、Node integration は無効です。Markdown は外部画像やリンクを自動で開きません。[セキュリティ説明](../../SECURITY.md)（中国語）を参照してください。

## 貢献する

不具合報告、翻訳、文書、修正を歓迎します。[貢献ガイド](../../CONTRIBUTING.md)、[変更履歴](../../CHANGELOG.md)、[リリースガイド](../RELEASING.md)、[行動規範](../../CODE_OF_CONDUCT.md)をご確認ください。リリースガイドは英語、その他の保守文書は現在中国語です。Issue と PR は中国語または英語で投稿できます。

PR とメインブランチへの push で Windows テスト、ビルド、言語／DPI 検証、インストーラー作成を実行します。成功した成果物は Actions Artifacts から取得できます。タグの公開処理は別ワークフローです。

## プロジェクト構成

| ディレクトリ | 内容 |
| --- | --- |
| `src/` | React UI とクライアント言語設定 |
| `electron/` | ウィンドウ、トレイ、保存、収納、MCP |
| `locales/` | 言語メタデータと translation.json |
| `public/` | SVG / PNG / ICO アイコン |
| `scripts/` | ランタイム、起動、検証、リリースツール |
| `tests/` | Node.js テスト |
| `.github/` | Issue / PR テンプレートとワークフロー |
| `docs/` | 保守・リリース文書 |

## ライセンスと謝辞

[MIT License](../../LICENSE) を採用しています。依存関係はそれぞれのライセンスに従います。[サードパーティーの説明](../../THIRD_PARTY_NOTICES.md)を参照してください。

React、Electron、Base UI、shadcn/ui スタイルのコンポーネント、Tailwind CSS、Lucide、i18next、公式 MCP SDK を利用しています。
