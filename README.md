<div align="center">
  <img src="public/memo-icon.svg" width="88" height="88" alt="Memo Desktop icon" />
  <h1>Memo Desktop</h1>
  <p>轻量、可拖动、支持 Markdown 与 AI 的 Windows 桌面便签。</p>
  <p>Windows x64 · React · Electron · 11 种界面语言 · MIT</p>
</div>

[简体中文](README.md) · [繁體中文](docs/readme/README.zh-TW.md) · [English](docs/readme/README.en.md) · [日本語](docs/readme/README.ja.md) · [한국어](docs/readme/README.ko.md) · [Deutsch](docs/readme/README.de.md) · [Français](docs/readme/README.fr.md) · [Español](docs/readme/README.es.md) · [Português](docs/readme/README.pt-BR.md) · [Русский](docs/readme/README.ru.md) · [العربية](docs/readme/README.ar.md)

## 功能

- **桌面便签**：独立窗口、拖动与缩放、置顶、锁定、标星和柔和阴影。
- **右侧收纳**：手动收起为窄标签；悬停临时展开，切换标签时收回上一张预览，并避开其他标签。点击编辑或拖动后保持展开。
- **Markdown**：标题、加粗、斜体、列表、待办、预览和 `.md` 导出。
- **管理界面**：搜索、全部便签与已标星视图、颜色、主题、开机启动及托盘管理。
- **AI / MCP**：本地 MCP 服务支持 AI 创建、读取、编辑、续写、显示、隐藏和删除便签。
- **多语言**：简体中文、繁體中文、English、日本語、한국어、Deutsch、Français、Español、Português、Русский、العربية。支持跟随系统，阿拉伯语采用 RTL 布局。
- **本地存储**：便签保存在当前 Windows 用户的本机目录，不依赖应用账号或云端同步。

当前正式支持 **Windows 10/11 x64**。其他平台和 Windows ARM64 尚未纳入打包与验证。

## 安装与更新

在本仓库的 **Releases** 页面下载 `Memo Desktop Setup <版本号>.exe` 并安装；可用同一 Release 中的 `SHA256SUMS.txt` 核对文件。

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\Memo Desktop Setup <版本号>.exe'
```

更新前先从系统托盘退出旧版本，再运行新安装包。安装包目前未配置 Windows 代码签名；应用目前不包含自动下载更新功能。

> 此仓库的自动发布流程在推送 `v<package.json.version>` 标签后运行。首次发布前，Releases 中可能还没有安装包。发布说明见 [发布指南（英文）](docs/RELEASING.md)。

## 从源码运行

需要 **Windows x64、Node.js 22.12 或更新版本、npm 和 Git**。

克隆本仓库，进入项目根目录后执行：

```powershell
npm ci
npm start
```

也可在安装依赖后双击 [`start.cmd`](start.cmd)。它会构建并启动当前源码，不会启动 `release` 中残留的旧程序。如果已有其他版本运行，请先从托盘退出。

`npm start` 与 `start.cmd` 使用和安装版相同的 `%APPDATA%\Memo\memo.json`。开发前可退出应用并备份该文件。`npm run dev` 只启动网页预览，不能提供真实桌面窗口、托盘或 MCP 服务。

### 开发命令

| 命令 | 用途 |
| --- | --- |
| `npm ci` | 按锁文件安装依赖 |
| `npm start` | 构建并启动本地 Electron 版本 |
| `npm run dev` | Vite 网页预览 |
| `npm test` | 数据、收纳、语言、启动与发布脚本测试 |
| `npm run build` | TypeScript 检查及前端生产构建 |
| `npm run runtime` | 准备并校验 Windows Electron 运行时 |
| `npm run check:i18n` | 隐藏窗口中检查 11 种语言同步与 RTL；需先构建并准备运行时 |
| `npm run check:dpi` | 隐藏窗口中检查当前显示器的 DPI 与侧边标签尺寸；需先构建并准备运行时 |
| `npm run pack` | 构建 Windows 免安装目录 `release/win-unpacked` |
| `npm run dist` | 构建 Windows NSIS 安装包；不会自动发布 |
| `npm run package:win` | 仅将已有构建打包为 Windows x64 安装包 |
| `npm run release:check` | 检查当前版本、锁文件和对应更新日志；设置 `RELEASE_TAG` 时同时检查标签 |

CI 的单屏 DPI 检查不能代替真实多屏测试。涉及跨屏收纳时，请按贡献指南在不同缩放比例的显示器间验证。

## 使用说明

- 拖动便签顶栏的抓手移动窗口；顶栏标题可直接编辑。
- 图钉控制是否始终位于其他窗口上方，星星用于加入“已标星”。二者互相独立。
- 锁定后隐藏编辑工具并禁止修改标题、正文、颜色和移动／缩放；解锁后才能删除。仍可标星或切换置顶。
- 点击便签顶栏的收纳按钮才会收起；失焦或靠近屏幕边缘不会收起普通便签。置顶期间需先取消置顶；关闭右侧收纳设置后，便签上的收纳按钮会隐藏。
- 已收起便签悬停约 0.15 秒展开；鼠标停在原标签、间隙或便签内时保持预览，同时离开后约 0.45 秒收回。点击、拖动或缩放后保持展开。
- 关闭便签窗口只会隐藏它；从管理界面删除才会移除内容。关闭管理窗口后仍在系统托盘运行。
- 偏好设置可调整主题、默认颜色、语言、开机启动、启动到托盘及右侧收纳。
- 数据位置可在偏好设置查看。复制 `memo.json` 备份前请退出应用，恢复时同样先退出。

## 连接 AI / MCP

在管理界面的 **AI 与 MCP** 页面复制客户端配置，添加到支持 stdio MCP 的 AI 客户端中。桌面应用需保持运行。安装版生成的配置使用 Electron 的 Node 模式，无需另装 Node.js。

开发时也可以使用系统 Node；将下面的路径替换为实际克隆位置：

```json
{
  "mcpServers": {
    "memo": {
      "command": "node",
      "args": ["C:/path/to/memo-desktop/electron/mcp.cjs"]
    }
  }
}
```

| 工具 | 功能 |
| --- | --- |
| `memo_list` | 列出便签及状态 |
| `memo_create` | 创建便签，可指定颜色、置顶、锁定和标星 |
| `memo_update` | 修改标题、正文、颜色与状态 |
| `memo_append` | 在正文末尾追加文字 |
| `memo_show` / `memo_hide` | 显示／隐藏桌面便签 |
| `memo_delete` | 删除未锁定便签 |

示例：“创建一个绿色的周计划便签，填入三项待办并标星。”

MCP 通过当前用户的本地命名管道请求主进程操作，不直接写数据文件。启用后，连接的本地客户端可以读取和修改便签；锁定规则同样适用。渲染进程启用 sandbox、context isolation，禁用 Node integration；Markdown 不自动加载外部图片或打开链接。实现细节和漏洞反馈见 [安全说明](SECURITY.md)。

## 参与贡献

欢迎反馈问题、完善翻译、改进文档和提交功能修复。请先查看：

- [贡献指南](CONTRIBUTING.md)：环境、分支、验证及 PR 要求。
- [更新日志](CHANGELOG.md)：当前版本与后续改动。
- [发布指南（英文）](docs/RELEASING.md)：版本标签、Actions、安装包与校验文件。
- [行为准则](CODE_OF_CONDUCT.md)：协作约定。

PR 与主分支提交会运行 Windows 测试、构建、语言／DPI 检查和安装包构建；成功的安装包可从 Actions 的 Artifacts 下载。标签发布使用独立工作流。

## 项目结构

```text
.github/        Issue / PR 模板、CI 与发布工作流
src/            React 界面、组件及客户端语言配置
electron/       窗口、托盘、数据存储、收纳与 MCP
locales/        语言元数据与各语言 translation.json
public/         应用 SVG / PNG / ICO 图标
scripts/        运行时、启动、界面验证与发布工具
tests/          Node.js 测试
docs/           维护与发布文档
```

## 许可证与致谢

项目采用 [MIT License](LICENSE)。第三方依赖保留各自许可证，见 [第三方说明](THIRD_PARTY_NOTICES.md)。

主要基于 React、Electron、Base UI、shadcn/ui 风格组件、Tailwind CSS、Lucide、i18next 和官方 MCP SDK。
