<div align="center">
  <img src="../../public/memo-icon.svg" width="88" height="88" alt="Memo Desktop icon" />
  <h1>Memo Desktop</h1>
  <p>드래그, Markdown, AI를 지원하는 가벼운 Windows 바탕 화면 메모.</p>
  <p>Windows x64 · React · Electron · 11개 표시 언어 · MIT</p>
</div>

[简体中文](../../README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · [日本語](README.ja.md) · **한국어** · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt-BR.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

## 기능

- **바탕 화면 메모**: 독립 창, 이동, 크기 조절, 항상 위, 잠금, 별표와 부드러운 그림자.
- **오른쪽 접기**: 버튼으로 좁은 탭에 접고 마우스를 올려 미리 봅니다. 다른 탭을 가리지 않으며 전환하면 이전 미리 보기를 접습니다. 클릭하거나 끌면 열린 상태를 유지합니다.
- **Markdown**: 제목, 굵게, 기울임꼴, 목록, 할 일, 미리 보기와 `.md` 내보내기.
- **작업 공간**: 검색, 모든 메모, 별표 표시된 메모, 색상, 테마, 로그인 시 실행과 트레이 관리.
- **AI / MCP**: 로컬 서비스를 통해 AI가 메모를 만들고 읽고 편집하고 추가하고 표시하고 숨기고 삭제합니다.
- **다국어**: 중국어 간체·번체, 영어, 일본어, 한국어, 독일어, 프랑스어, 스페인어, 포르투갈어, 러시아어, 아랍어. 시스템 언어를 따를 수 있으며 아랍어는 RTL을 지원합니다.
- **로컬 저장**: 현재 Windows 사용자 폴더에 저장합니다. 앱 계정이나 클라우드 동기화가 필요하지 않습니다.

공식 지원 환경은 **Windows 10/11 x64**입니다. 다른 플랫폼과 Windows ARM64는 패키징 및 검증 대상이 아닙니다.

## 설치 및 업데이트

이 저장소의 **Releases**에서 `Memo Desktop Setup <version>.exe`를 다운로드하세요. 같은 릴리스의 `SHA256SUMS.txt`로 확인할 수 있습니다:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\Memo Desktop Setup <version>.exe'
```

업데이트 전에 트레이에서 이전 버전을 종료하세요. 현재 설치 파일에는 Windows 코드 서명이 없으며 앱은 업데이트를 자동 다운로드하지 않습니다.

`v<package.json.version>` 태그를 푸시하면 릴리스 워크플로가 실행됩니다. 첫 릴리스 전에는 설치 파일이 없을 수 있습니다. [릴리스 안내](../RELEASING.md)(영어)를 참고하세요.

## 소스에서 실행

**Windows x64, Node.js 22.12 이상, npm, Git**이 필요합니다. 저장소를 복제하고 루트 디렉터리에서 실행하세요:

```powershell
npm ci
npm start
```

의존성을 설치한 뒤 [`start.cmd`](../../start.cmd)를 두 번 클릭해도 됩니다. `release`의 오래된 실행 파일 대신 현재 소스를 빌드하고 실행합니다. 실행 중인 다른 버전은 먼저 트레이에서 종료하세요.

`npm start`, `start.cmd`, 설치 버전은 `%APPDATA%\Memo\memo.json`을 공유합니다. 개발 전에 앱을 종료하고 백업하세요. `npm run dev`는 브라우저 미리 보기이며 실제 창, 트레이, MCP 기능은 제공하지 않습니다.

### 개발 명령

| 명령 | 용도 |
| --- | --- |
| `npm ci` | 잠금 파일에 따라 의존성 설치 |
| `npm start` | 빌드 후 로컬 Electron 앱 실행 |
| `npm run dev` | Vite 브라우저 미리 보기 |
| `npm test` | 데이터, 접기, 언어, 실행, 릴리스 테스트 |
| `npm run build` | 타입 검사 및 프런트엔드 빌드 |
| `npm run runtime` | Windows Electron 런타임 준비 및 검증 |
| `npm run check:i18n` | 숨겨진 창에서 11개 언어와 RTL 검사. 먼저 빌드와 런타임 준비 필요 |
| `npm run check:dpi` | 연결된 화면의 DPI와 가장자리 탭 크기 검사. 먼저 빌드와 런타임 준비 필요 |
| `npm run pack` | `release/win-unpacked`에 무설치 버전 생성 |
| `npm run dist` | 게시하지 않고 NSIS 설치 파일 생성 |
| `npm run package:win` | 기존 빌드를 Windows x64 설치 파일로 패키징 |
| `npm run release:check` | 버전과 변경 기록 확인. RELEASE_TAG가 있으면 태그도 확인 |
| `npm run release:prepare` | 릴리스 파일과 체크섬을 로컬에 준비하며 업로드하지 않음 |

CI의 단일 화면 검사는 실제 혼합 DPI 다중 화면 테스트를 대체하지 않습니다. 화면 간 동작을 수정할 때는 기여 안내를 따르세요.

## 메모 사용법

- 제목 표시줄의 손잡이로 이동하고 제목을 바로 편집할 수 있습니다.
- 핀은 다른 창 위에 유지하고 별은 즐겨 찾기에 추가합니다. 두 상태는 독립적입니다.
- 잠그면 편집 도구가 숨겨지고 제목, 본문, 색상, 이동과 크기 조절이 제한됩니다. 삭제 전 잠금을 해제하세요. 별표와 항상 위 상태는 변경할 수 있습니다.
- 일반 메모는 접기 버튼으로만 접힙니다. 포커스를 잃거나 가장자리에 접근해도 접히지 않습니다. 고정을 먼저 해제하세요. 접기 설정을 끄면 버튼이 숨겨집니다.
- 접힌 탭에 약 0.15초 마우스를 올리면 미리 보기가 열립니다. 원래 탭, 간격 또는 메모 위에서는 유지되고 모두 벗어나면 약 0.45초 뒤 접힙니다. 클릭, 드래그 또는 크기 조절 후에는 열린 상태를 유지합니다.
- 창을 닫으면 숨겨지고 작업 공간에서 삭제하면 내용이 제거됩니다. 관리 창을 닫아도 트레이에서 계속 실행됩니다.
- 환경설정에서 테마, 기본 색상, 언어, 로그인 시 실행, 트레이에서 시작과 오른쪽 접기를 설정할 수 있습니다.
- 데이터 위치는 환경설정에서 확인하세요. memo.json을 백업하거나 복원하기 전에 앱을 종료하세요.

## AI / MCP 연결

**AI 및 MCP** 화면에서 설정을 복사하여 stdio MCP 클라이언트에 추가하세요. 바탕 화면 앱은 실행해 두어야 합니다. 설치 버전은 Electron의 Node 모드를 사용하므로 별도의 Node.js가 필요하지 않습니다. 개발 시 시스템 Node도 사용할 수 있습니다. 아래 경로를 실제 복제 위치로 바꾸세요:

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

| 도구 | 기능 |
| --- | --- |
| `memo_list` | 메모와 상태 목록 |
| `memo_create` | 색상, 고정, 잠금, 별표를 지정하여 생성 |
| `memo_update` | 제목, 본문, 색상과 상태 업데이트 |
| `memo_append` | 기존 본문 뒤에 텍스트 추가 |
| `memo_show / memo_hide` | 바탕 화면 메모 표시 또는 숨기기 |
| `memo_delete` | 잠기지 않은 메모 삭제 |

예: “녹색 주간 계획 메모를 만들고 할 일 세 개를 추가한 뒤 별표를 표시해 줘.”

MCP는 현재 사용자의 로컬 명명된 파이프로 주 프로세스에 요청하며 데이터 파일을 직접 쓰지 않습니다. 활성화된 동안 연결한 클라이언트는 메모를 읽고 수정할 수 있고 잠금 규칙도 적용됩니다. 렌더러는 sandbox 및 context isolation을 사용하며 Node integration은 꺼져 있습니다. Markdown은 외부 이미지나 링크를 자동으로 열지 않습니다. [보안 안내](../../SECURITY.md)(중국어)를 참고하세요.

## 기여하기

문제 보고, 번역, 문서 개선과 수정을 환영합니다. [기여 안내](../../CONTRIBUTING.md), [변경 기록](../../CHANGELOG.md), [릴리스 안내](../RELEASING.md), [행동 강령](../../CODE_OF_CONDUCT.md)을 확인하세요. 릴리스 안내는 영어이고 나머지 유지 관리 문서는 현재 중국어이며 Issue와 PR은 중국어나 영어로 작성할 수 있습니다.

PR 및 메인 브랜치 푸시는 Windows 테스트, 빌드, 언어/DPI 검사와 설치 파일 생성을 실행합니다. 성공한 설치 파일은 Actions Artifacts에서 받을 수 있습니다. 버전 태그는 별도의 릴리스 워크플로를 실행합니다.

## 프로젝트 구조

| 디렉터리 | 내용 |
| --- | --- |
| `src/` | React UI 및 언어 설정 |
| `electron/` | 창, 트레이, 저장, 접기와 MCP |
| `locales/` | 언어 메타데이터 및 translation.json |
| `public/` | SVG / PNG / ICO 아이콘 |
| `scripts/` | 런타임, 실행, 검사와 릴리스 도구 |
| `tests/` | Node.js 테스트 |
| `.github/` | Issue / PR 템플릿과 워크플로 |
| `docs/` | 유지 관리 및 릴리스 문서 |

## 라이선스 및 감사의 말

[MIT 라이선스](../../LICENSE)를 따릅니다. 의존성은 각각의 라이선스를 유지합니다. [서드파티 안내](../../THIRD_PARTY_NOTICES.md)를 확인하세요.

React, Electron, Base UI, shadcn/ui 스타일 컴포넌트, Tailwind CSS, Lucide, i18next 및 공식 MCP SDK를 사용합니다.
