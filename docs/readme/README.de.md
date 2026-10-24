<div align="center">
  <img src="../../public/memo-icon.svg" width="88" height="88" alt="Memo Desktop icon" />
  <h1>Memo Desktop</h1>
  <p>Leichte Windows-Desktopnotizen mit Drag-and-drop, Markdown und KI.</p>
  <p>Windows x64 · React · Electron · 11 Oberflächensprachen · MIT</p>
</div>

[简体中文](../../README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · **Deutsch** · [Français](README.fr.md) · [Español](README.es.md) · [Português](README.pt-BR.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

![Memo Desktop — Screenshots](../media/screenshots/01-workspace-en.png)

## Funktionen

- **Desktopnotizen**: eigene Fenster, Verschieben, Größenänderung, Anheften, Sperren, Sterne und weiche Schatten.
- **Randablage**: Notizen per Schaltfläche als schmale Reiter rechts einklappen. Darüberfahren öffnet eine Vorschau, ohne andere Reiter zu verdecken. Beim Wechsel schließt sich die vorherige Vorschau. Klicken oder Ziehen hält sie offen.
- **Markdown**: Überschriften, Fett, Kursiv, Listen, Aufgaben, Vorschau und `.md`-Export.
- **Arbeitsbereich**: Suche, alle und markierte Notizen, Farben, Designs, Autostart und Infobereich.
- **KI / MCP**: Ein lokaler Dienst erlaubt KI-Clients das Erstellen, Lesen, Bearbeiten, Ergänzen, Anzeigen, Ausblenden und Löschen von Notizen.
- **Sprachen**: vereinfachtes und traditionelles Chinesisch, Englisch, Japanisch, Koreanisch, Deutsch, Französisch, Spanisch, Portugiesisch, Russisch und Arabisch. Systemauswahl und RTL für Arabisch.
- **Lokale Speicherung**: Daten bleiben im Ordner des aktuellen Windows-Benutzers. Kein App-Konto und keine Cloud-Synchronisierung erforderlich.

Offiziell unterstützt: **Windows 10/11 x64**. Andere Plattformen und Windows ARM64 werden bisher nicht paketiert oder geprüft.

## Screenshots

### Desktop-Notizen

Unabhängige Notizen verschieben, im Vordergrund halten, sperren und markieren.

![Desktop-Notizen](../media/screenshots/03-desktop-notes.png)

### Am Bildschirmrand einklappen und Vorschau

Notizen manuell als Rand-Tabs einklappen. Beim Darüberfahren bleibt Platz für andere Tabs.

![Am Bildschirmrand einklappen und Vorschau](../media/screenshots/08-edge-dock.png)

### Markdown bearbeiten und anzeigen

Ideen in Markdown festhalten und zur Lesevorschau wechseln.

![Markdown bearbeiten und anzeigen](../media/screenshots/04-markdown.png)

## Installation und Updates

Lade `Memo Desktop Setup <version>.exe` von der Seite **Releases** dieses Repositorys herunter. Vergleiche die Prüfsumme mit `SHA256SUMS.txt` derselben Veröffentlichung:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\Memo Desktop Setup <version>.exe'
```

Beende die alte Version vor dem Update im Infobereich. Installationsdateien sind derzeit nicht signiert; die App lädt Updates nicht automatisch herunter.

Ein Push des Tags `v<package.json.version>` startet den Veröffentlichungsablauf. Vor dem ersten Release gibt es möglicherweise noch keinen Installer. Siehe [Veröffentlichungsleitfaden](../RELEASING.md) (Englisch).

## Aus dem Quellcode starten

Voraussetzungen: **Windows x64, Node.js ab 22.12, npm und Git**. Repository klonen und im Projektstamm ausführen:

```powershell
npm ci
npm start
```

Nach der Installation der Abhängigkeiten kann auch [`start.cmd`](../../start.cmd) per Doppelklick gestartet werden. Es baut den aktuellen Quellcode und verwendet keine alte exe aus `release`. Andere Versionen zuvor im Infobereich beenden.

`npm start`, `start.cmd` und die installierte App teilen `%APPDATA%\Memo\memo.json`. Vor der Entwicklung die App beenden und diese Datei sichern. `npm run dev` ist nur eine Browservorschau ohne echte Desktopfenster, Infobereich oder MCP-Dienst.

### Entwicklungsbefehle

| Befehl | Zweck |
| --- | --- |
| `npm ci` | Abhängigkeiten anhand der Sperrdatei installieren |
| `npm start` | Lokale Electron-App bauen und starten |
| `npm run dev` | Vite-Browservorschau starten |
| `npm test` | Daten-, Ablage-, Sprach-, Start- und Release-Tests ausführen |
| `npm run build` | Typprüfung und Frontend-Build |
| `npm run runtime` | Windows-Electron-Laufzeit vorbereiten und prüfen |
| `npm run check:i18n` | 11 Sprachen und RTL in versteckten Fenstern prüfen; vorher Build und Laufzeit vorbereiten |
| `npm run check:dpi` | DPI und Reitergröße auf angeschlossenen Bildschirmen prüfen; vorher Build und Laufzeit vorbereiten |
| `npm run pack` | Entpackte App in `release/win-unpacked` bauen |
| `npm run dist` | NSIS-Installer ohne Veröffentlichung erstellen |
| `npm run package:win` | Vorhandenen Build als Windows-x64-Installer verpacken |
| `npm run release:check` | Versionen und Änderungsprotokoll prüfen, bei gesetztem RELEASE_TAG auch das Tag |
| `npm run release:prepare` | Release-Dateien und Prüfsummen lokal vorbereiten, ohne Upload |

Ein CI-Test mit einem Bildschirm ersetzt keine echten Tests mit unterschiedlichen DPI-Werten. Bei Änderungen am Bildschirmwechsel den Beitragsleitfaden beachten.

## Notizen verwenden

- Notizen am Griff in der Titelleiste bewegen und den Titel direkt bearbeiten.
- Die Stecknadel hält das Fenster im Vordergrund; der Stern markiert es als Favorit. Beide Zustände sind unabhängig.
- Sperren blendet Werkzeuge aus und verhindert Text-, Titel-, Farb-, Positions- und Größenänderungen. Zum Löschen entsperren; Stern und Anheften bleiben bedienbar.
- Normale Notizen klappen nur über die Schaltfläche ein, nicht bei Fokusverlust oder Randnähe. Vorher lösen. Bei deaktivierter Randablage verschwindet die Schaltfläche.
- Etwa 0,15 Sekunden über einem Reiter öffnen die Vorschau. Über dem ursprünglichen Reiter, Zwischenraum oder Fenster bleibt sie offen; nach Verlassen aller Bereiche klappt sie nach etwa 0,45 Sekunden ein. Klicken, Ziehen oder Größenänderung hält sie offen.
- Schließen blendet eine Notiz aus; Löschen im Arbeitsbereich entfernt ihren Inhalt. Nach dem Schließen des Arbeitsbereichs läuft die App im Infobereich weiter.
- Einstellungen umfassen Design, Standardfarbe, Sprache, Autostart, Start im Infobereich und Randablage.
- Der Speicherort steht in den Einstellungen. Vor Sicherung oder Wiederherstellung von memo.json die App beenden.

## KI / MCP verbinden

Die Konfiguration unter **KI & MCP** in einen Client mit stdio-MCP-Unterstützung kopieren. Die Desktop-App muss laufen. Installierte Versionen verwenden den Node-Modus von Electron und benötigen kein zusätzliches Node.js. Für die Entwicklung kann System-Node genutzt werden; den Beispielpfad durch den tatsächlichen Projektpfad ersetzen:

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

| Werkzeug | Zweck |
| --- | --- |
| `memo_list` | Notizen und Zustände auflisten |
| `memo_create` | Notiz mit Farbe, Anheften, Sperre und Stern erstellen |
| `memo_update` | Titel, Inhalt, Farben und Zustände ändern |
| `memo_append` | Text an vorhandenen Inhalt anhängen |
| `memo_show / memo_hide` | Desktopnotizen anzeigen oder ausblenden |
| `memo_delete` | Entsperrte Notizen löschen |

Beispiel: „Erstelle eine grüne Wochenplan-Notiz mit drei Aufgaben und markiere sie mit einem Stern.“

MCP übermittelt Anfragen über eine lokale Named Pipe des aktuellen Benutzers an den Hauptprozess und schreibt die Datei nicht direkt. Verbundene Clients können bei aktiviertem MCP Notizen lesen und ändern; Sperren gelten weiterhin. Renderer verwenden Sandbox und Context Isolation, ohne Node Integration. Markdown lädt keine externen Bilder und öffnet keine Links automatisch. Siehe [Sicherheitshinweise](../../SECURITY.md) (Chinesisch).

## Mitwirken

Fehlerberichte, Übersetzungen, Dokumentation und Korrekturen sind willkommen. Bitte [Beitragsleitfaden](../../CONTRIBUTING.md), [Änderungsprotokoll](../../CHANGELOG.md), [Veröffentlichungsleitfaden](../RELEASING.md) und [Verhaltenskodex](../../CODE_OF_CONDUCT.md) lesen. Der Veröffentlichungsleitfaden ist auf Englisch, die anderen Dokumente sind derzeit auf Chinesisch; Issues und PRs können auf Chinesisch oder Englisch verfasst werden.

PRs und Pushes auf den Hauptbranch führen Windows-Tests, Builds, Sprach-/DPI-Prüfungen und Installer-Paketierung aus. Erfolgreiche Installer stehen unter Actions Artifacts bereit. Versionstags lösen einen getrennten Release-Workflow aus.

## Projektstruktur

| Ordner | Inhalt |
| --- | --- |
| `src/` | React-Oberfläche und Sprachkonfiguration |
| `electron/` | Fenster, Infobereich, Speicherung, Ablage und MCP |
| `locales/` | Sprachmetadaten und translation.json |
| `public/` | SVG-/PNG-/ICO-Symbole |
| `scripts/` | Laufzeit, Start-, Prüf- und Release-Werkzeuge |
| `tests/` | Node.js-Tests |
| `.github/` | Issue-/PR-Vorlagen und Workflows |
| `docs/` | Wartungs- und Veröffentlichungsdokumentation |

## Lizenz und Danksagung

Veröffentlicht unter der [MIT-Lizenz](../../LICENSE). Abhängigkeiten behalten ihre eigenen Lizenzen; siehe [Drittanbieterhinweise](../../THIRD_PARTY_NOTICES.md).

Entwickelt mit React, Electron, Base UI, Komponenten im shadcn/ui-Stil, Tailwind CSS, Lucide, i18next und dem offiziellen MCP SDK.
