<div align="center">
  <img src="../../public/memo-icon.svg" width="88" height="88" alt="Memo Desktop icon" />
  <h1>Memo Desktop</h1>
  <p>Notas leves para a área de trabalho do Windows com arraste, Markdown e IA.</p>
  <p>Windows x64 · React · Electron · 11 idiomas de interface · MIT</p>
</div>

[简体中文](../../README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md) · **Português** · [Русский](README.ru.md) · [العربية](README.ar.md)

## Recursos

- **Notas na área de trabalho**: janelas independentes, movimento, redimensionamento, sempre no topo, bloqueio, favoritas e sombras suaves.
- **Recolhimento lateral**: recolha a nota manualmente em uma aba estreita à direita. Passe o mouse para visualizar sem cobrir as outras abas; ao trocar, a prévia anterior se fecha. Clique ou arraste para manter aberta.
- **Markdown**: títulos, negrito, itálico, listas, tarefas, prévia e exportação `.md`.
- **Espaço de trabalho**: busca, todas as notas, favoritas, cores, temas, início ao entrar e controles de bandeja.
- **IA / MCP**: um serviço local permite à IA criar, ler, editar, acrescentar texto, mostrar, ocultar e excluir notas.
- **Idiomas**: chinês simplificado e tradicional, inglês, japonês, coreano, alemão, francês, espanhol, português, russo e árabe. Escolha manual ou pelo sistema; árabe com layout RTL.
- **Armazenamento local**: os dados ficam na pasta do usuário atual do Windows. Não exige conta no aplicativo nem sincronização em nuvem.

Suporte oficial: **Windows 10/11 x64**. Outras plataformas e Windows ARM64 ainda não estão incluídos no empacotamento e na validação.

## Instalação e atualizações

Baixe `Memo Desktop Setup <version>.exe` em **Releases** deste repositório. Compare o arquivo com `SHA256SUMS.txt` da mesma versão:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\Memo Desktop Setup <version>.exe'
```

Encerre a versão anterior pela bandeja antes de atualizar. Os instaladores ainda não têm assinatura de código Windows; o aplicativo não baixa atualizações automaticamente.

Enviar a tag `v<package.json.version>` inicia o fluxo de publicação. Antes da primeira versão, pode não haver instalador. Consulte o [guia de publicação](../RELEASING.md) (inglês).

## Executar a partir do código-fonte

Requer **Windows x64, Node.js 22.12 ou mais recente, npm e Git**. Clone o repositório e execute na raiz:

```powershell
npm ci
npm start
```

Após instalar as dependências, você também pode abrir [`start.cmd`](../../start.cmd). Ele compila e inicia o código atual, sem usar um exe antigo em `release`. Encerre outras versões pela bandeja primeiro.

`npm start`, `start.cmd` e o aplicativo instalado compartilham `%APPDATA%\Memo\memo.json`. Feche o aplicativo e faça backup antes de desenvolver. `npm run dev` é apenas uma prévia no navegador, sem janelas reais de desktop, bandeja ou serviço MCP.

### Comandos de desenvolvimento

| Comando | Finalidade |
| --- | --- |
| `npm ci` | Instalar dependências conforme o arquivo de trava |
| `npm start` | Compilar e iniciar o aplicativo Electron local |
| `npm run dev` | Iniciar a prévia Vite no navegador |
| `npm test` | Testar dados, recolhimento, idiomas, inicialização e publicação |
| `npm run build` | Verificar tipos e compilar a interface |
| `npm run runtime` | Preparar e verificar o runtime Electron Windows |
| `npm run check:i18n` | Verificar 11 idiomas e RTL em janelas ocultas; compilar e preparar o runtime antes |
| `npm run check:dpi` | Verificar DPI e abas nos monitores conectados; compilar e preparar o runtime antes |
| `npm run pack` | Gerar o aplicativo descompactado em `release/win-unpacked` |
| `npm run dist` | Gerar instalador NSIS sem publicar |
| `npm run package:win` | Empacotar uma compilação existente para Windows x64 |
| `npm run release:check` | Validar versões e histórico; também RELEASE_TAG quando definido |
| `npm run release:prepare` | Preparar arquivos e checksums localmente, sem enviar |

A verificação CI com uma tela não substitui testes reais com diferentes DPI. Siga o guia de contribuição ao mudar o comportamento entre monitores.

## Como usar as notas

- Mova a nota pela alça da barra superior e edite o título diretamente.
- O alfinete mantém a nota acima das outras janelas; a estrela adiciona às favoritas. São estados independentes.
- O bloqueio esconde ferramentas e impede alterações no título, texto, cor, posição e tamanho. Desbloqueie antes de excluir; estrela e fixação ainda podem mudar.
- Uma nota comum só se recolhe pelo botão, não ao perder foco ou chegar ao canto. Desafixe primeiro. Desativar o recolhimento lateral oculta o botão.
- Passe o mouse por cerca de 0,15 segundo para abrir uma aba. A prévia fica aberta sobre a aba original, o espaço ou a nota; ao sair de todas as áreas, recolhe após cerca de 0,45 segundo. Clicar, arrastar ou redimensionar mantém aberta.
- Fechar uma nota apenas a oculta; excluir no espaço de trabalho remove o conteúdo. Fechar o espaço de trabalho mantém o aplicativo na bandeja.
- Preferências controla tema, cor padrão, idioma, início ao entrar, início na bandeja e recolhimento lateral.
- O local dos dados aparece nas preferências. Encerre o aplicativo antes de copiar ou restaurar memo.json.

## Conectar IA / MCP

Copie a configuração de **IA e MCP** para um cliente compatível com stdio MCP. Mantenha o aplicativo aberto. A versão instalada usa o modo Node do Electron, sem precisar instalar Node.js à parte. No desenvolvimento, também é possível usar o Node do sistema; troque o caminho do exemplo pelo da sua cópia:

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

| Ferramenta | Finalidade |
| --- | --- |
| `memo_list` | Listar notas e estados |
| `memo_create` | Criar notas com cor, fixação, bloqueio e estrela |
| `memo_update` | Atualizar títulos, conteúdo, cores e estados |
| `memo_append` | Acrescentar texto ao conteúdo existente |
| `memo_show / memo_hide` | Mostrar ou ocultar notas na área de trabalho |
| `memo_delete` | Excluir notas desbloqueadas |

Exemplo: “Crie uma nota verde de planejamento semanal, inclua três tarefas e marque como favorita.”

MCP envia solicitações ao processo principal por um pipe nomeado local do usuário atual, sem escrever diretamente no arquivo. Os clientes conectados podem ler e alterar notas enquanto MCP estiver ativo, seguindo as regras de bloqueio. Os renderizadores usam sandbox e context isolation, sem Node integration. Markdown não carrega imagens externas nem abre links automaticamente. Veja as [notas de segurança](../../SECURITY.md) (chinês).

## Como contribuir

Relatos de erros, traduções, documentação e correções são bem-vindos. Leia o [guia de contribuição](../../CONTRIBUTING.md), o [histórico](../../CHANGELOG.md), o [guia de publicação](../RELEASING.md) e o [código de conduta](../../CODE_OF_CONDUCT.md). O guia de publicação está em inglês e os demais documentos estão atualmente em chinês; issues e PRs podem ser escritos em chinês ou inglês.

PRs e envios à branch principal executam testes Windows, compilação, verificações de idioma/DPI e criação do instalador. Os instaladores aprovados ficam em Actions Artifacts. Tags ativam um fluxo de publicação separado.

## Estrutura do projeto

| Diretório | Conteúdo |
| --- | --- |
| `src/` | Interface React e localização |
| `electron/` | Janelas, bandeja, armazenamento, recolhimento e MCP |
| `locales/` | Metadados de idiomas e translation.json |
| `public/` | Ícones SVG / PNG / ICO |
| `scripts/` | Runtime, inicialização, verificações e publicação |
| `tests/` | Testes Node.js |
| `.github/` | Modelos de issues / PR e workflows |
| `docs/` | Documentação de manutenção e publicação |

## Licença e agradecimentos

Sob a [licença MIT](../../LICENSE). As dependências mantêm suas próprias licenças; veja os [avisos de terceiros](../../THIRD_PARTY_NOTICES.md).

Feito com React, Electron, Base UI, componentes no estilo shadcn/ui, Tailwind CSS, Lucide, i18next e o SDK oficial MCP.
