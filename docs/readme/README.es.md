<div align="center">
  <img src="../../public/memo-icon.svg" width="88" height="88" alt="Memo Desktop icon" />
  <h1>Memo Desktop</h1>
  <p>Notas ligeras para el escritorio de Windows con arrastre, Markdown e IA.</p>
  <p>Windows x64 · React · Electron · 11 idiomas de interfaz · MIT</p>
</div>

[简体中文](../../README.md) · [繁體中文](README.zh-TW.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · **Español** · [Português](README.pt-BR.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

## Funciones

- **Notas de escritorio**: ventanas independientes, movimiento, cambio de tamaño, siempre encima, bloqueo, estrellas y sombras suaves.
- **Recogida lateral**: recoge manualmente una nota en una pestaña estrecha a la derecha. Pasa el cursor para verla sin tapar las demás pestañas; al cambiar se recoge la anterior. Haz clic o arrastra para mantenerla abierta.
- **Markdown**: títulos, negrita, cursiva, listas, tareas, vista previa y exportación `.md`.
- **Espacio de trabajo**: búsqueda, todas las notas, destacadas, colores, temas, inicio de sesión y controles de bandeja.
- **IA / MCP**: servicio local para que la IA cree, lea, edite, añada texto, muestre, oculte y elimine notas.
- **Idiomas**: chino simplificado y tradicional, inglés, japonés, coreano, alemán, francés, español, portugués, ruso y árabe. Selección manual o del sistema; árabe con disposición RTL.
- **Almacenamiento local**: los datos permanecen en la carpeta del usuario actual de Windows. No requiere cuenta de la aplicación ni sincronización en la nube.

Compatibilidad oficial: **Windows 10/11 x64**. Otras plataformas y Windows ARM64 aún no forman parte del empaquetado y las pruebas.

## Instalación y actualizaciones

Descarga `Memo Desktop Setup <version>.exe` desde **Releases** de este repositorio. Comprueba el archivo con `SHA256SUMS.txt` de la misma versión:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath '.\Memo Desktop Setup <version>.exe'
```

Cierra la versión anterior desde la bandeja antes de actualizar. Los instaladores no tienen firma de código Windows actualmente y la aplicación no descarga actualizaciones automáticamente.

Al enviar la etiqueta `v<package.json.version>` se ejecuta el flujo de publicación. Antes de la primera versión puede no haber instalador. Consulta la [guía de publicación](../RELEASING.md) (inglés).

## Ejecutar desde el código fuente

Requiere **Windows x64, Node.js 22.12 o posterior, npm y Git**. Clona el repositorio y ejecuta desde su raíz:

```powershell
npm ci
npm start
```

Tras instalar las dependencias también puedes abrir [`start.cmd`](../../start.cmd). Compila y ejecuta el código actual, sin usar un exe antiguo de `release`. Cierra primero cualquier otra versión desde la bandeja.

`npm start`, `start.cmd` y la aplicación instalada comparten `%APPDATA%\Memo\memo.json`. Cierra la aplicación y guarda una copia antes de desarrollar. `npm run dev` solo ofrece una vista web sin ventanas reales de escritorio, bandeja ni servicio MCP.

### Comandos de desarrollo

| Comando | Finalidad |
| --- | --- |
| `npm ci` | Instalar dependencias según el archivo de bloqueo |
| `npm start` | Compilar y ejecutar la aplicación Electron local |
| `npm run dev` | Iniciar la vista previa web de Vite |
| `npm test` | Probar datos, recogida, idiomas, inicio y publicación |
| `npm run build` | Comprobar tipos y compilar la interfaz |
| `npm run runtime` | Preparar y verificar el entorno Electron para Windows |
| `npm run check:i18n` | Comprobar 11 idiomas y RTL en ventanas ocultas; compilar y preparar el entorno primero |
| `npm run check:dpi` | Comprobar DPI y pestañas en las pantallas conectadas; compilar y preparar el entorno primero |
| `npm run pack` | Generar la aplicación descomprimida en `release/win-unpacked` |
| `npm run dist` | Crear el instalador NSIS sin publicar |
| `npm run package:win` | Empaquetar una compilación existente para Windows x64 |
| `npm run release:check` | Validar versiones y registro; también RELEASE_TAG si está definido |
| `npm run release:prepare` | Preparar archivos y sumas de publicación localmente, sin subirlos |

La prueba CI con una pantalla no sustituye las pruebas reales con varios DPI. Sigue la guía de contribución al cambiar el comportamiento entre pantallas.

## Uso de las notas

- Mueve la nota con el asa de la barra superior y edita el título directamente.
- El pin mantiene la nota sobre otras ventanas y la estrella la añade a Destacadas. Son estados independientes.
- El bloqueo oculta herramientas e impide cambiar título, texto, color, posición y tamaño. Desbloquea antes de eliminar; aún puedes cambiar estrella y pin.
- Una nota normal solo se recoge con el botón, no al perder el foco o acercarse al borde. Desfíjala primero. Desactivar la recogida lateral oculta el botón.
- Pasa el cursor unos 0,15 segundos para abrir una pestaña. La vista permanece abierta sobre la pestaña original, el hueco o la nota; al salir de las tres zonas se recoge tras unos 0,45 segundos. Hacer clic, arrastrar o redimensionar la mantiene abierta.
- Cerrar una nota la oculta; eliminarla en el espacio de trabajo borra su contenido. Cerrar el espacio de trabajo mantiene la aplicación en la bandeja.
- Preferencias permite cambiar tema, color predeterminado, idioma, inicio de sesión, inicio en bandeja y recogida lateral.
- La ubicación de los datos aparece en Preferencias. Cierra la aplicación antes de copiar o restaurar memo.json.

## Conectar IA / MCP

Copia la configuración de **IA y MCP** en un cliente compatible con stdio MCP. Mantén la aplicación abierta. La versión instalada usa el modo Node de Electron, sin instalar Node.js aparte. En desarrollo puedes usar Node del sistema; sustituye la ruta del ejemplo por la de tu copia:

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

| Herramienta | Finalidad |
| --- | --- |
| `memo_list` | Listar notas y estados |
| `memo_create` | Crear notas con color, pin, bloqueo y estrella |
| `memo_update` | Actualizar títulos, contenido, colores y estados |
| `memo_append` | Añadir texto al contenido existente |
| `memo_show / memo_hide` | Mostrar u ocultar notas de escritorio |
| `memo_delete` | Eliminar notas desbloqueadas |

Ejemplo: «Crea una nota verde con mi plan semanal, añade tres tareas y márcala como destacada».

MCP solicita operaciones al proceso principal por una canalización local con nombre del usuario actual; no escribe directamente el archivo. Los clientes conectados pueden leer y modificar notas mientras MCP esté activo, respetando el bloqueo. Los renderizadores usan sandbox y context isolation, con Node integration desactivado. Markdown no carga imágenes externas ni abre enlaces automáticamente. Consulta las [notas de seguridad](../../SECURITY.md) (chino).

## Contribuir

Se aceptan informes de errores, traducciones, documentación y correcciones. Lee la [guía de contribución](../../CONTRIBUTING.md), el [registro de cambios](../../CHANGELOG.md), la [guía de publicación](../RELEASING.md) y el [código de conducta](../../CODE_OF_CONDUCT.md). La guía de publicación está en inglés y los otros documentos están actualmente en chino; los issues y PR pueden escribirse en chino o inglés.

Los PR y envíos a la rama principal ejecutan pruebas Windows, compilación, controles de idiomas/DPI y empaquetado. Los instaladores correctos aparecen en Actions Artifacts. Las etiquetas activan un flujo de publicación independiente.

## Estructura del proyecto

| Directorio | Contenido |
| --- | --- |
| `src/` | Interfaz React y localización |
| `electron/` | Ventanas, bandeja, almacenamiento, recogida y MCP |
| `locales/` | Metadatos de idiomas y translation.json |
| `public/` | Iconos SVG / PNG / ICO |
| `scripts/` | Entorno, inicio, comprobaciones y herramientas de publicación |
| `tests/` | Pruebas Node.js |
| `.github/` | Plantillas de issues / PR y flujos de trabajo |
| `docs/` | Documentación de mantenimiento y publicación |

## Licencia y agradecimientos

Bajo la [licencia MIT](../../LICENSE). Las dependencias conservan sus licencias; consulta los [avisos de terceros](../../THIRD_PARTY_NOTICES.md).

Creado con React, Electron, Base UI, componentes de estilo shadcn/ui, Tailwind CSS, Lucide, i18next y el SDK oficial de MCP.
