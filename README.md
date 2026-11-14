# Agencia IDP

Sitio de agenciaidp.com en Next.js 16: 100 % estático, sin WordPress, sin base de datos y sin panel de administración expuesto.

## Comandos

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
pnpm start
```

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Datos de contacto, menú, redes e IDs de analítica | `lib/site.ts` |
| Artículos del blog | `content/posts/*.json` |
| Páginas de servicios | `content/pages/*.json` (se componen en `components/nx-subpages.tsx`) |
| Precios | `content/precios.json` |
| Textos de la portada | `content/home.json` y `app/page.tsx` |
| Colores y estilos de marca | `app/redesign.css` |
| Redirecciones 301 y cabeceras de seguridad | `next.config.mjs` |
| Imágenes (WebP optimizado) | `public/media/` |

## Variables de entorno

`NEXT_PUBLIC_SEO_API` (opcional): URL del backend del diagnóstico SEO. Por defecto usa el servidor actual. Si cambia, se actualiza también la CSP en el siguiente build.

## Volver a importar desde WordPress

`scripts/import_wordpress.py` convierte la exportación de `/wp-json/wp/v2` en el contenido de `content/` y `public/media/`. Requiere Python con `beautifulsoup4` y `pillow`. Sobrescribe `content/`, así que solo debe usarse antes de editar contenido a mano.

```bash
python scripts/import_wordpress.py <carpeta_exportada> .
```
