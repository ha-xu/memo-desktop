<div align="center">
  <img src="../../public/memo-icon.svg" width="88" height="88" alt="Memo Desktop icon" />
  <h1>Memo Desktop</h1>
  <p>Des notes de bureau Windows légères, déplaçables, avec Markdown et IA.</p>
  <p>Windows x64 · React · Electron · 11 langues d’interface · MIT</p>
</div>

[简体中文](../../README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · **Français** · [Español](README.es.md) · [Português](README.pt-BR.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

## Fonctionnalités

- **Notes de bureau** : fenêtres indépendantes, déplacement, redimensionnement, épinglage, verrouillage, favoris et ombres douces.
- **Repli latéral** : repliez manuellement une note en onglet sur le bord droit. Survolez pour prévisualiser sans masquer les autres onglets ; changer d’onglet replie la précédente. Un clic ou un glissement la garde ouverte.
- **Markdown** : titres, gras, italique, listes, tâches, aperçu et export `.md`.
- **Espace de travail** : recherche, toutes les notes, favoris, couleurs, thèmes, démarrage à la connexion et zone de notification.
- **IA / MCP** : un service local permet à l’IA de créer, lire, modifier, compléter, afficher, masquer et supprimer des notes.
- **Langues** : chinois simplifié et traditionnel, anglais, japonais, coréen, allemand, français, espagnol, portugais, russe et arabe. Choix manuel ou système ; interface RTL pour l’arabe.
- **Stockage local** : les données restent dans le dossier de l’utilisateur Windows actuel. Aucun compte applicatif ni synchronisation cloud requis.

Prise en charge officielle : **Windows 10/11 x64**. Les autres plateformes et Windows ARM64 ne sont pas encore inclus dans les paquets et validations.

## Installation et mises à jour

Téléchargez `Memo Desktop Setup <version>.exe` depuis **Releases** dans ce dépôt. Vérifiez son empreinte avec `SHA256SUMS.txt` de la même version :

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\Memo Desktop Setup <version>.exe'
```

Quittez l’ancienne version depuis la zone de notification avant une mise à jour. Les installateurs ne sont pas signés actuellement ; l’application ne télécharge pas automatiquement les mises à jour.

Pousser un tag `v<package.json.version>` déclenche la publication. Avant la première version, aucun installateur n’est nécessairement disponible. Consultez le [guide de publication](../RELEASING.md) (anglais).

## Exécuter depuis les sources

Prérequis : **Windows x64, Node.js 22.12 ou ultérieur, npm et Git**. Clonez le dépôt et exécutez à sa racine :

```powershell
npm ci
npm start
```

Après installation des dépendances, vous pouvez aussi ouvrir [`start.cmd`](../../start.cmd). Il compile et lance les sources actuelles, pas un ancien exe dans `release`. Quittez d’abord toute autre version depuis la zone de notification.

`npm start`, `start.cmd` et l’application installée partagent `%APPDATA%\Memo\memo.json`. Fermez l’application et sauvegardez ce fichier avant de développer. `npm run dev` n’est qu’un aperçu navigateur sans véritables fenêtres de bureau, zone de notification ou service MCP.

### Commandes de développement

| Commande | Rôle |
| --- | --- |
| `npm ci` | Installer les dépendances selon le fichier de verrouillage |
| `npm start` | Compiler et lancer l’application Electron locale |
| `npm run dev` | Lancer l’aperçu Vite dans le navigateur |
| `npm test` | Tester données, repli, langues, lancement et publication |
| `npm run build` | Vérifier les types et compiler le frontend |
| `npm run runtime` | Préparer et vérifier le runtime Electron Windows |
| `npm run check:i18n` | Vérifier 11 langues et RTL dans des fenêtres cachées ; compiler et préparer le runtime d’abord |
| `npm run check:dpi` | Vérifier DPI et onglets sur les écrans connectés ; compiler et préparer le runtime d’abord |
| `npm run pack` | Créer l’application décompressée dans `release/win-unpacked` |
| `npm run dist` | Créer un installateur NSIS sans publication |
| `npm run package:win` | Empaqueter une compilation existante pour Windows x64 |
| `npm run release:check` | Vérifier versions et journal, ainsi que RELEASE_TAG s’il est défini |
| `npm run release:prepare` | Préparer localement les fichiers de publication et empreintes, sans envoi |

Un test CI sur un seul écran ne remplace pas les essais réels avec plusieurs DPI. Suivez le guide de contribution pour les changements entre écrans.

## Utiliser les notes

- Déplacez la note avec la poignée de la barre supérieure ; son titre se modifie directement.
- L’épingle garde la note au-dessus des autres fenêtres ; l’étoile l’ajoute aux favoris. Les deux états sont indépendants.
- Le verrouillage masque les outils et bloque titre, contenu, couleur, déplacement et taille. Déverrouillez avant de supprimer ; favoris et épinglage restent modifiables.
- Seul le bouton replie une note normale : ni la perte de focus ni la proximité du bord ne le font. Désépinglez d’abord. Désactiver le repli latéral masque ce bouton.
- Survolez un onglet environ 0,15 seconde pour prévisualiser. Le survol de l’onglet initial, de l’espace ou de la note garde l’aperçu ouvert ; quitter ces trois zones le replie après environ 0,45 seconde. Un clic, un glissement ou un redimensionnement le garde ouvert.
- Fermer une note la masque ; la supprimer dans l’espace de travail retire son contenu. Fermer cet espace laisse l’application dans la zone de notification.
- Les préférences règlent thème, couleur par défaut, langue, démarrage à la connexion, lancement réduit et repli latéral.
- L’emplacement des données figure dans les préférences. Quittez l’application avant de sauvegarder ou restaurer memo.json.

## Connecter l’IA / MCP

Copiez la configuration dans **IA et MCP** vers un client compatible stdio MCP. Gardez l’application ouverte. La version installée utilise le mode Node d’Electron, sans Node.js supplémentaire. En développement, Node système convient aussi ; remplacez le chemin d’exemple par celui de votre copie :

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

| Outil | Rôle |
| --- | --- |
| `memo_list` | Lister les notes et leur état |
| `memo_create` | Créer une note avec couleur, épinglage, verrouillage et favori |
| `memo_update` | Modifier titres, contenu, couleurs et états |
| `memo_append` | Ajouter du texte à la suite du contenu |
| `memo_show / memo_hide` | Afficher ou masquer les notes de bureau |
| `memo_delete` | Supprimer les notes déverrouillées |

Exemple : « Crée une note verte pour mon planning de la semaine, ajoute trois tâches et mets-la en favori. »

MCP transmet les demandes au processus principal par un canal nommé local de l’utilisateur ; il n’écrit pas directement le fichier de données. Les clients connectés peuvent lire et modifier les notes lorsque MCP est actif, sous les mêmes règles de verrouillage. Les renderers utilisent sandbox et context isolation, sans Node integration. Markdown ne charge pas d’images externes et n’ouvre pas de liens automatiquement. Voir la [sécurité](../../SECURITY.md) (chinois).

## Contribuer

Rapports de bugs, traductions, documentation et correctifs sont bienvenus. Lisez le [guide de contribution](../../CONTRIBUTING.md), le [journal](../../CHANGELOG.md), le [guide de publication](../RELEASING.md) et le [code de conduite](../../CODE_OF_CONDUCT.md). Le guide de publication est en anglais, les autres documents sont actuellement en chinois ; les issues et PR peuvent être rédigées en chinois ou en anglais.

Les PR et envois sur la branche principale exécutent les tests Windows, la compilation, les contrôles langue/DPI et la création de l’installateur. Les fichiers validés sont dans Actions Artifacts. Les tags déclenchent un workflow de publication distinct.

## Structure du projet

| Dossier | Contenu |
| --- | --- |
| `src/` | Interface React et localisation |
| `electron/` | Fenêtres, zone de notification, stockage, repli et MCP |
| `locales/` | Métadonnées des langues et translation.json |
| `public/` | Icônes SVG / PNG / ICO |
| `scripts/` | Runtime, lancement, vérifications et publication |
| `tests/` | Tests Node.js |
| `.github/` | Modèles d’issues / PR et workflows |
| `docs/` | Documentation de maintenance et publication |

## Licence et remerciements

Sous [licence MIT](../../LICENSE). Les dépendances conservent leurs licences respectives ; voir les [mentions tierces](../../THIRD_PARTY_NOTICES.md).

Réalisé avec React, Electron, Base UI, des composants de style shadcn/ui, Tailwind CSS, Lucide, i18next et le SDK MCP officiel.
