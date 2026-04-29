# EDCA — Sitio Web

**Our community, our culture** · @edcabrand

## Estructura del proyecto

```
edca-web/
├── index.html          # 2.6 MB — todas las imágenes embebidas en base64
├── css/
│   └── style.css       # Estilos del sitio (estética skate-zine)
├── js/
│   └── main.js         # Scroll reveals, navegación móvil, parallax
└── images/             # JPEGs originales (backup/referencia, no usadas en runtime)
```

## Cómo desplegar en Netlify

**Opción A — Drag & drop (más rápido):**

1. Ve a https://netlify.com/drop
2. Arrastra la carpeta `edca-web/` completa
3. URL pública lista en ~10 segundos

**Opción B — Deploy desde Git:**

1. Sube la carpeta a un repo de GitHub
2. Conecta el repo a Netlify
3. Build command: *(ninguno)*
4. Publish directory: `/` (raíz)

## Notas técnicas

- Las imágenes están **embebidas como base64** dentro del `index.html` — el sitio funciona 100% offline abriendo el archivo directamente.
- La carpeta `images/` contiene los JPEG originales pero **no se cargan** en runtime (se mantienen por si luego quieres separarlas).
- Fuentes cargadas desde Google Fonts CDN: Anton, Instrument Serif, JetBrains Mono, Inter.
- El sitio es completamente responsive (mobile-first desde 390px).

## Enlaces externos configurados

- Instagram: https://www.instagram.com/edcabrand/
- TikTok: https://www.tiktok.com/@edcabrand
- YouTube: https://www.youtube.com/@edcabrand
- Facebook: https://www.facebook.com/edcabrand
- Linktree (locales & contacto): https://linktr.ee/edcabrand

## Si quieres editar

- **Cambiar colores:** edita las variables CSS al inicio de `css/style.css` (`--accent`, `--bg`, etc.)
- **Cambiar textos:** edita directamente `index.html`
- **Agregar/quitar productos:** duplica o elimina `<article class="drop">` en la sección `§02 — Latest drops`
