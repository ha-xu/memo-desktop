<div align="center">
  <img src="../../public/memo-icon.svg" width="88" height="88" alt="Memo Desktop icon" />
  <h1>Memo Desktop</h1>
  <p>輕量、可拖曳、支援 Markdown 與 AI 的 Windows 桌面便箋。</p>
  <p>Windows x64 · React · Electron · 11 種介面語言 · MIT</p>
</div>

[简体中文](../../README.md) · **繁體中文** · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt-BR.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

## 功能

- **桌面便箋**：獨立視窗、拖曳與縮放、置頂、鎖定、標星和柔和陰影。
- **右側收納**：手動收起為窄標籤，懸停預覽且不遮擋其他標籤；切換時收回上一張預覽，點擊或拖曳後保持展開。
- **Markdown**：標題、粗體、斜體、清單、待辦、預覽及 `.md` 匯出。
- **管理介面**：搜尋、全部便箋、已標星、顏色、主題、登入時啟動和系統匣操作。
- **AI / MCP**：本機服務讓 AI 建立、讀取、編輯、附加、顯示、隱藏及刪除便箋。
- **多語言**：簡中、繁中、英、日、韓、德、法、西、葡、俄、阿拉伯語。可跟隨系統，阿拉伯語使用 RTL 排列。
- **本機儲存**：資料位於目前 Windows 使用者的本機目錄，不需要應用程式帳號或雲端同步。

正式支援 **Windows 10/11 x64**；其他平台及 Windows ARM64 尚未納入打包與驗證。

## 安裝與更新

從本儲存庫的 **Releases** 頁面下載 `Memo Desktop Setup <version>.exe`，並使用同一版本的 `SHA256SUMS.txt` 核對：

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\Memo Desktop Setup <version>.exe'
```

更新前先從系統匣結束舊版本。安裝程式目前未設定 Windows 程式碼簽署，應用程式不會自動下載更新。

推送 `v<package.json.version>` 標籤後會觸發發佈流程；首次發佈前可能尚無安裝程式。詳見[發佈指南](../RELEASING.md)（英文）。

## 從原始碼執行

需要 **Windows x64、Node.js 22.12 或更新版本、npm 與 Git**。複製儲存庫並進入根目錄後執行：

```powershell
npm ci
npm start
```

安裝依賴後也可雙擊 [`start.cmd`](../../start.cmd)，它會建置並啟動目前原始碼，不會使用 `release` 裡的舊程式。請先從系統匣結束其他版本。

`npm start`、`start.cmd` 和安裝版共用 `%APPDATA%\Memo\memo.json`。開發前請結束應用程式並備份。`npm run dev` 僅為網頁預覽，沒有實際桌面視窗、系統匣或 MCP 服務。

### 開發指令

| 指令 | 用途 |
| --- | --- |
| `npm ci` | 依鎖定檔安裝依賴 |
| `npm start` | 建置並啟動本機 Electron 版本 |
| `npm run dev` | 啟動 Vite 網頁預覽 |
| `npm test` | 執行資料、收納、語言、啟動與發佈測試 |
| `npm run build` | TypeScript 檢查及前端建置 |
| `npm run runtime` | 準備並校驗 Windows Electron 執行環境 |
| `npm run check:i18n` | 在隱藏視窗檢查 11 種語言與 RTL；先建置並準備執行環境 |
| `npm run check:dpi` | 檢查連接螢幕的 DPI 與側邊標籤；先建置並準備執行環境 |
| `npm run pack` | 產生 `release/win-unpacked` 免安裝目錄 |
| `npm run dist` | 產生 NSIS 安裝程式，不自動發佈 |
| `npm run package:win` | 將現有建置打包為 Windows x64 安裝程式 |
| `npm run release:check` | 檢查版本與更新日誌；設定 RELEASE_TAG 時也檢查標籤 |
| `npm run release:prepare` | 在本機整理發佈檔案與校驗碼，不會上傳 |

CI 單螢幕檢查無法取代實際的混合 DPI 測試；變更跨螢幕行為時，請依貢獻指南驗證。

## 使用說明

- 拖曳頂欄抓手移動便箋，標題可直接編輯。
- 圖釘讓便箋位於其他視窗之上；星星加入「已標星」，兩者互相獨立。
- 鎖定會隱藏編輯工具，禁止變更標題、正文、顏色及移動／縮放。解鎖後才能刪除，仍可標星或切換置頂。
- 一般便箋僅按收納按鈕才收起，失焦或靠近邊緣不會自動收起。置頂時需先取消置頂；停用收納設定會隱藏按鈕。
- 收起的標籤懸停約 0.15 秒展開；滑鼠停在原標籤、間隙或便箋時保持預覽，同時離開後約 0.45 秒收回。點擊、拖曳或縮放後保持展開。
- 關閉便箋只是隱藏；在管理介面刪除才會移除內容。關閉管理視窗後繼續駐留系統匣。
- 偏好設定可調整主題、預設顏色、語言、登入啟動、啟動至系統匣與右側收納。
- 資料位置可在偏好設定查看，備份或還原 memo.json 前請先結束程式。

## 連接 AI / MCP

在 **AI 與 MCP** 頁面複製設定至支援 stdio MCP 的用戶端，並保持桌面程式執行。安裝版設定使用 Electron 的 Node 模式，不必另外安裝 Node.js。開發時可使用系統 Node，請替換範例中的本機路徑：

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

| 工具 | 功能 |
| --- | --- |
| `memo_list` | 列出便箋與狀態 |
| `memo_create` | 建立便箋，可指定顏色、置頂、鎖定與標星 |
| `memo_update` | 修改標題、正文、顏色與狀態 |
| `memo_append` | 在既有正文末尾附加文字 |
| `memo_show / memo_hide` | 顯示或隱藏桌面便箋 |
| `memo_delete` | 刪除未鎖定便箋 |

範例：「建立綠色的週計畫便箋，加入三項待辦並標星。」

MCP 透過目前使用者的本機具名管道請求主程序操作，不直接寫資料檔案。啟用時連線的用戶端可讀取及修改便箋，鎖定規則同樣適用。渲染程序啟用 sandbox 與 context isolation，停用 Node integration；Markdown 不會自動載入外部圖片或開啟連結。詳見[安全說明](../../SECURITY.md)（簡中）。

## 參與貢獻

歡迎回報問題、改善翻譯與文件及提交修復。請參閱[貢獻指南](../../CONTRIBUTING.md)、[更新日誌](../../CHANGELOG.md)、[發佈指南](../RELEASING.md)和[行為準則](../../CODE_OF_CONDUCT.md)。發佈指南為英文，其他維護文件目前為簡中，Issue 和 PR 可使用中文或英文。

PR 與主分支提交會執行 Windows 測試、建置、語言／DPI 檢查及安裝程式打包。成功的安裝程式可從 Actions Artifacts 下載，版本標籤另行觸發發佈流程。

## 專案結構

| 目錄 | 內容 |
| --- | --- |
| `src/` | React 介面與語言設定 |
| `electron/` | 視窗、系統匣、儲存、收納與 MCP |
| `locales/` | 語言中繼資料與 translation.json |
| `public/` | SVG / PNG / ICO 圖示 |
| `scripts/` | 執行環境、啟動、檢查及發佈工具 |
| `tests/` | Node.js 測試 |
| `.github/` | Issue／PR 範本與工作流程 |
| `docs/` | 維護與發佈文件 |

## 授權與致謝

採用 [MIT 授權](../../LICENSE)。第三方依賴保留各自授權，請見[第三方說明](../../THIRD_PARTY_NOTICES.md)。

主要基於 React、Electron、Base UI、shadcn/ui 風格元件、Tailwind CSS、Lucide、i18next 與官方 MCP SDK。
