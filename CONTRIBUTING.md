# 贡献指南 / Contributing

感谢帮助改进 Memo Desktop。中文或英文的 Issue、文档和 PR 均可。

## 开始之前

- 先搜索已有 Issue 和 PR，避免重复。
- Bug 修复可直接提交；较大功能或行为变化请先开 Issue 说明目标和使用场景。
- 一个 PR 尽量只解决一个问题。避免夹带格式化、无关重构或生成的安装包。
- 维护者会根据使用价值、兼容性及长期维护成本决定是否合并；提交 PR 不代表一定合并。

## 开发环境

正式支持 Windows 10/11 x64，Node.js >=22.12.0。建议与 CI 一样使用 Node.js 22。

Fork 并克隆仓库后，在根目录运行：

```powershell
npm ci
npm start
```

也可双击 `start.cmd`。本地运行与安装版共用 `%APPDATA%\Memo\memo.json`，测试前先退出真实应用并备份数据。`scripts/check-i18n.cjs` 和 DPI 检查使用独立的隐藏测试窗口；不要在自动测试中读取真实便签。

新建独立分支，如 `fix/hover-preview` 或 `feat/note-search`。提交信息应说明目的，可采用 `fix:`、`feat:`、`docs:`、`chore:` 等前缀。

## 修改与验证

所有代码修改至少执行：

```powershell
npm test
npm run build
```

影响界面、语言或桌面窗口时，继续执行：

```powershell
npm run runtime
npm run check:i18n
npm run check:dpi
```

修改打包、资源路径、启动或发布逻辑时，再运行 `npm run dist` 并检查安装包。纯文档修改无须手动反复运行所有界面检查，但 CI 仍会执行全套检查。

测试应该验证可观察的行为，例如锁定保护、过期编辑冲突、预览切换、语言保存或错误版本标签被拒绝。不要仅复制实现逻辑来凑测试数量。

### 桌面行为回归

对涉及窗口的改动，请在 PR 中说明验证范围：

- 便签新建、编辑、置顶、锁定、标星、隐藏与恢复。
- 手动收纳；悬停预览移出收回；切换标签仅保留一个临时预览；编辑或拖动后保持展开。
- 收起标签不被预览遮挡；跨不同 DPI 的屏幕后尺寸正确。
- 阿拉伯语下的 RTL 排列；正文和 MCP JSON 的方向正确。
- 退出后重新启动，便签内容、状态与设置仍保留。

CI 的虚拟显示器只能验证单屏路径，不能声称覆盖真实多屏设备。

## 翻译贡献

语言元数据位于 `locales/languages.json`；翻译资源位于 `locales/<语言代码>/translation.json`，使用 i18next 嵌套键。

- 先确认现有 key 是否能复用；新增界面文案不要直接写死在组件中。
- 新词条需补齐所有受支持语言；保留 `{{title}}`、`{{count}}` 等占位符。
- 数量文本使用 i18next 的复数规则；阿拉伯语包含 zero / one / two / few / many / other。
- 文本方向优先使用 CSS logical properties、`dir` 与 Base UI DirectionProvider，不能把屏幕物理右侧标签误移到左边。
- 不翻译用户已有便签内容，不改动 MCP 工具名、JSON 键或代码语法。
- 执行 `npm test` 和 `npm run check:i18n`，必要时提供截图。机器辅助翻译应由熟悉该语言的人复核。

### README 翻译

根目录 `README.md` 为简体中文，其余 10 个版本位于 `docs/readme/README.<语言代码>.md`。每个版本保留完整的语言切换导航，深层文件中的项目链接使用 `../../` 指向根目录。修改安装步骤、命令、数据路径、收纳行为或 MCP 示例时，请同步所有 README；发布指南为英文，其他维护文档目前仍为中文，译文应说明这一点。阿拉伯语正文使用 `dir="rtl"`，命令和 JSON 示例使用 `dir="ltr"`。

## 依赖和资源

使用 npm，提交 `package-lock.json`。不要混用其他包管理器锁文件。

新增依赖需说明用途、维护成本和许可证；涉及第三方素材或复制的代码时，保留其声明并更新 `THIRD_PARTY_NOTICES.md`。不要提交依赖目录、安装包、临时截图、真实便签、访问令牌或个人绝对路径。

GitHub Actions 固定到完整提交号，由 Dependabot 提议更新。普通 PR 工作流只读，不使用 `pull_request_target` 执行贡献者代码。

## 提交 PR

1. 更新或补充必要测试，按上面的范围验证。
2. 用户可感知的改动在 `CHANGELOG.md` 的 `Unreleased` 下记录；普通 PR 不自行增加应用版本或标签。
3. 填写 PR 模板：问题、改动、验证、截图及关联 Issue。
4. 等待 CI 与审查反馈；后续修改继续推到同一分支。

不要在 PR 中直接发布 Release 或上传安装包。发布由维护者按 [发布指南（英文）](docs/RELEASING.md) 统一进行。

## 许可与协作

请遵守 [行为准则](CODE_OF_CONDUCT.md)。除非另有明确说明，提交的贡献按本项目 [MIT 许可证](LICENSE) 提供；无需额外签署 CLA。请确认你有权提交相应内容。
