#!/usr/bin/env python3
"""Importa el contenido exportado de WordPress a JSON limpio + medios optimizados.

Uso:  python scripts/import_wordpress.py <carpeta_raw> <raiz_del_proyecto>

<carpeta_raw> debe contener pages-1.json, posts-1.json, media-*.json y seo.json
(respuestas de /wp-json/wp/v2 y metadatos SEO rastreados). Nada de WordPress
queda en el sitio final: el HTML pasa por una lista blanca de etiquetas y atributos,
y cada medio se descarga y se sirve desde /media.
"""
import glob
import hashlib
import html as htmllib
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

from bs4 import BeautifulSoup, Comment, NavigableString, Tag
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
RAW, ROOT = sys.argv[1], sys.argv[2]
ORIGIN = "https://agenciaidp.com"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36"}
MEDIA_DIR = os.path.join(ROOT, "public", "media")
CACHE = os.path.join(RAW, "media-cache")
MAX_W = 1600

# Páginas con plantilla propia en app/ (no pasan por el renderizador genérico).
BESPOKE = {
    "home-page-agencia-idp", "contacto", "precios", "blog", "agentes-seo", "ui-ux",
    "pagina-posicionamiento-seo", "informe-seo-geo", "agenciaidp-com-informe-seo-geo",
    "formulario-prueba",
}
# Sin contenido real: se resuelven con redirecciones 301 en next.config.mjs.
SKIP = {
    "acceder", "mi-cuenta", "carrito", "tienda", "elementor-978",
    "detalles-de-portafolio", "licitacion-de-servicios-publicos",
}

ALLOWED = {
    "p", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "a", "strong", "b", "em", "i", "u",
    "br", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "figure", "figcaption",
    "img", "hr", "code", "pre", "iframe",
}
DROP = {"script", "style", "svg", "noscript", "form", "input", "button", "select", "textarea", "link", "meta", "head", "object", "embed"}
ATTRS = {"a": {"href"}, "img": {"src", "alt", "width", "height"}, "th": {"colspan", "rowspan"}, "td": {"colspan", "rowspan"}, "iframe": {"src", "title"}}

pages = json.load(open(f"{RAW}/pages-1.json", encoding="utf8"))
posts = json.load(open(f"{RAW}/posts-1.json", encoding="utf8"))
cats = {c["id"]: c for c in json.load(open(f"{RAW}/categories-1.json", encoding="utf8"))}
media = []
for f in sorted(glob.glob(f"{RAW}/media-*.json")):
    media += json.load(open(f, encoding="utf8"))
seo = json.load(open(f"{RAW}/seo.json", encoding="utf8"))
media_by_id = {m["id"]: m for m in media}
originals = {m["source_url"] for m in media}
alt_by_url = {m["source_url"]: m.get("alt_text", "") for m in media}

os.makedirs(MEDIA_DIR, exist_ok=True)
os.makedirs(CACHE, exist_ok=True)
downloaded = {}
failed = []


def fetch(url):
    key = hashlib.sha1(url.encode()).hexdigest()
    path = os.path.join(CACHE, key)
    if os.path.exists(path):
        return open(path, "rb").read()
    quoted = urllib.parse.quote(url, safe=":/%?=&")
    data = urllib.request.urlopen(urllib.request.Request(quoted, headers=UA), timeout=60).read()
    open(path, "wb").write(data)
    time.sleep(0.05)
    return data


def original_of(url):
    """Prefiere el archivo original frente a la miniatura -300x169."""
    url = url.split("?")[0].replace("dev.agenciaidp.com", "agenciaidp.com")
    base = re.sub(r"-\d+x\d+(\.\w+)$", r"\1", url)
    return base if base in originals else url


def safe_name(url):
    rel = url.split("/wp-content/uploads/")[-1]
    rel = urllib.parse.unquote(rel).lower()
    stem, ext = os.path.splitext(rel)
    stem = re.sub(r"[^a-z0-9]+", "-", stem.encode("ascii", "ignore").decode()).strip("-")
    return stem[-90:].strip("-") or hashlib.sha1(url.encode()).hexdigest()[:12], ext


def localize(url):
    """Descarga y optimiza un medio. Devuelve {src,width,height} o None."""
    if not url or url.startswith("data:"):
        return None
    if url.startswith("/"):
        url = ORIGIN + url
    url = original_of(url)
    if url in downloaded:
        return downloaded[url]
    if "/wp-content/" not in url:
        return None
    try:
        data = fetch(url)
    except Exception:
        failed.append(url)
        return None
    stem, ext = safe_name(url)
    out = None
    if ext == ".svg":
        text = data.decode("utf8", "replace")
        text = re.sub(r"<script\b.*?</script>", "", text, flags=re.S | re.I)
        text = re.sub(r"\son\w+=\"[^\"]*\"", "", text)
        name = f"{stem}.svg"
        open(os.path.join(MEDIA_DIR, name), "w", encoding="utf8").write(text)
        m = re.search(r'viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) ([\d.]+)"', text)
        out = {"src": f"/media/{name}", "width": round(float(m.group(1))) if m else 300, "height": round(float(m.group(2))) if m else 150}
    elif ext == ".gif":
        name = f"{stem}.gif"
        open(os.path.join(MEDIA_DIR, name), "wb").write(data)
        im = Image.open(io.BytesIO(data))
        out = {"src": f"/media/{name}", "width": im.width, "height": im.height}
    else:
        im = Image.open(io.BytesIO(data))
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        if im.width > MAX_W:
            im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
        name = f"{stem}.webp"
        im.save(os.path.join(MEDIA_DIR, name), "WEBP", quality=80, method=5)
        out = {"src": f"/media/{name}", "width": im.width, "height": im.height}
    downloaded[url] = out
    return out


def fix_href(href):
    href = (href or "").strip()
    if not href or href == "#":
        return None
    if "elementor-action" in href:
        return "/contacto/"
    if re.match(r"(?i)^(mailto:|tel:)", href) or href.startswith("#"):
        return href
    if "/cdn-cgi/" in href:
        return "mailto:info@agenciaidp.com"
    if href.startswith("/"):
        href = ORIGIN + href
    if not re.match(r"(?i)^https?://", href):
        return None
    m = re.match(r"(?i)^https?://(?:www\.|dev\.)?agenciaidp\.com(/.*)?$", href)
    if m:
        path = m.group(1) or "/"
        if "/wp-content/uploads/" in path:
            if path.lower().endswith(".pdf"):
                return localize_doc(ORIGIN + path)
            loc = localize(ORIGIN + path)
            return loc["src"] if loc else None
        return path
    return href


def localize_doc(url):
    os.makedirs(os.path.join(ROOT, "public", "docs"), exist_ok=True)
    name = os.path.basename(urllib.parse.unquote(url)).lower()
    open(os.path.join(ROOT, "public", "docs", name), "wb").write(fetch(url))
    return f"/docs/{name}"


def youtube_embed(src):
    m = re.search(r"(?:youtube(?:-nocookie)?\.com/(?:embed/|watch\?v=)|youtu\.be/)([\w-]{6,})", src or "")
    return f"https://www.youtube-nocookie.com/embed/{m.group(1)}" if m else None


def sanitize(fragment):
    """Lista blanca estricta: lo que no esté permitido se elimina o se desenvuelve."""
    soup = BeautifulSoup(fragment, "html.parser") if isinstance(fragment, str) else BeautifulSoup(str(fragment), "html.parser")
    for c in soup.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()
    for t in soup.find_all(list(DROP)):
        t.decompose()
    for t in soup.find_all("h1"):
        t.name = "h2"
    for t in list(soup.find_all(True)):
        if t.parent is None:
            continue
        if t.name not in ALLOWED:
            t.unwrap()
            continue
        keep = ATTRS.get(t.name, set())
        for a in list(t.attrs):
            if a not in keep:
                del t.attrs[a]
        if t.name == "a":
            href = fix_href(t.get("href"))
            if href:
                t["href"] = href
                if re.match(r"https?://", href):
                    t["target"] = "_blank"
                    t["rel"] = "noopener noreferrer"
            else:
                t.unwrap()
        elif t.name == "img":
            src = t.get("src", "")
            loc = localize(src)
            if not loc:
                t.decompose()
                continue
            t["src"], t["width"], t["height"] = loc["src"], str(loc["width"]), str(loc["height"])
            t["alt"] = t.get("alt", "")
            t["loading"] = "lazy"
            t["decoding"] = "async"
        elif t.name == "iframe":
            emb = youtube_embed(t.get("src"))
            if emb:
                t["src"] = emb
                t["title"] = t.get("title") or "Video"
                t["loading"] = "lazy"
                t["allowfullscreen"] = ""
            else:
                t.decompose()
    for t in soup.find_all(["p", "li", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em"]):
        if not t.get_text(strip=True) and not t.find(["img", "iframe", "br"]):
            t.decompose()
    return re.sub(r"\n\s*\n+", "\n", str(soup)).strip()


def clean_text(t):
    t = re.sub(r"<[^>]{1,200}>", " ", t)
    t = re.sub(r"[\u200b\u200c\u200d\ufeff]", "", t)
    return re.sub(r"\s+", " ", t).strip()


def text_of(node):
    return clean_text(node.get_text(" ", strip=True)) if node else ""


def inner(node):
    return sanitize("".join(str(c) for c in node.contents)) if node else ""


def css_bg(node):
    m = re.search(r"url\(['\"]?([^'\")]+)", node.get("style", "") or "") if node else None
    return m.group(1) if m else None


def img_block(img, extra_alt=""):
    src = img.get("src") or img.get("data-src") or ""
    loc = localize(src)
    if not loc:
        return None
    return {**loc, "alt": (img.get("alt") or extra_alt or alt_by_url.get(original_of(src), "")).strip()}


def widget_blocks(w):
    t = (w.get("data-widget_type") or "").split(".")[0]
    out = []
    if t in ("heading", "jkit_heading"):
        sub = w.select_one(".heading-section-subtitle")
        if sub and text_of(sub):
            out.append({"t": "label", "text": text_of(sub)})
        h = w.select_one(".heading-title") or w.find(re.compile(r"^h[1-6]$")) or w.find(class_="elementor-heading-title")
        txt = text_of(h)
        if txt:
            lvl = int(h.name[1]) if h and h.name and re.match(r"h[1-6]", h.name) else 3
            out.append({"t": "heading", "level": lvl, "text": txt})
        desc = w.select_one(".heading-section-description")
        if desc and text_of(desc):
            out.append({"t": "rich", "html": inner(desc)})
    elif t == "animated-headline":
        h = w.find(re.compile(r"^h[1-6]$"))
        parts = []
        for part in w.select(".elementor-headline-text-wrapper"):
            if "elementor-headline-dynamic-wrapper" in part.get("class", []):
                parts.append(text_of(part.select_one(".elementor-headline-dynamic-text")))
            else:
                parts.append(text_of(part))
        txt = " ".join(x for x in parts if x)
        out.append({"t": "heading", "level": int(h.name[1]) if h else 2, "text": txt.strip()})
    elif t == "text-editor":
        h = sanitize(w.select_one(".elementor-widget-container") or w)
        if BeautifulSoup(h, "html.parser").get_text(strip=True):
            out.append({"t": "rich", "html": h})
    elif t == "image":
        img = w.find("img")
        b = img_block(img) if img else None
        if b:
            out.append({"t": "image", **b})
    elif t in ("button", "jkit_button"):
        a = w.find("a")
        href = fix_href(a.get("href")) if a else None
        if a and text_of(a):
            if href:
                out.append({"t": "button", "href": href, "text": text_of(a)})
            else:
                out.append({"t": "kicker", "text": text_of(a)})
    elif t in ("icon-box", "jkit_icon_box", "image-box"):
        title = w.select_one(".elementor-icon-box-title, .elementor-image-box-title, .title")
        desc = w.select_one(".elementor-icon-box-description, .elementor-image-box-description, .icon-box-description")
        img = w.find("img")
        a = w.find("a")
        card = {"t": "card", "title": text_of(title), "html": inner(desc) if desc else ""}
        if img:
            b = img_block(img)
            if b:
                card["image"] = b
        href = fix_href(a.get("href")) if a else None
        if href:
            card["href"] = href
        if card["title"] or card["html"]:
            out.append(card)
    elif t == "icon-list":
        items = [text_of(x) for x in w.select(".elementor-icon-list-text")]
        items = [i for i in items if i]
        if items:
            out.append({"t": "list", "items": items})
    elif t == "counter":
        num = w.select_one(".elementor-counter-number")
        out.append({
            "t": "stat",
            "value": (text_of(w.select_one(".elementor-counter-number-prefix")) + (num.get("data-to-value", "") if num else "")),
            "suffix": text_of(w.select_one(".elementor-counter-number-suffix")),
            "label": text_of(w.select_one(".elementor-counter-title")),
        })
    elif t == "jkit_fun_fact":
        num = w.select_one(".number")
        out.append({"t": "stat", "value": num.get("data-value", "") if num else "", "suffix": text_of(w.select_one(".suffix")), "label": text_of(w.select_one(".title"))})
    elif t == "jkit_accordion":
        for c in w.select(".card-wrapper"):
            out.append({"t": "faq", "q": text_of(c.select_one(".title")), "a": inner(c.select_one(".card-body"))})
    elif t == "toggle":
        for c in w.select(".elementor-toggle-item"):
            out.append({"t": "faq", "q": text_of(c.select_one(".elementor-toggle-title")), "a": inner(c.select_one(".elementor-tab-content"))})
    elif t == "testimonial":
        img = w.find("img")
        out.append({"t": "quote", "text": text_of(w.select_one(".elementor-testimonial-content")), "name": text_of(w.select_one(".elementor-testimonial-name")), "role": text_of(w.select_one(".elementor-testimonial-job")), **({"image": img_block(img)} if img else {})})
    elif t == "testimonial-carousel":
        seen = set()
        for s in w.select(".swiper-slide"):
            txt = text_of(s.select_one(".elementor-testimonial__text, .elementor-testimonial__content"))
            name = text_of(s.select_one(".elementor-testimonial__name"))
            if not (txt or name) or (txt, name) in seen:
                continue
            seen.add((txt, name))
            img = s.find("img")
            out.append({"t": "quote" if txt else "person", "text": txt, "name": name, "role": text_of(s.select_one(".elementor-testimonial__title")), **({"image": img_block(img)} if img else {})})
    elif t in ("media-carousel", "image-carousel"):
        imgs, seen = [], set()
        for s in w.select(".swiper-slide"):
            img = s.find("img")
            src = (img.get("src") if img else None) or css_bg(s.select_one("[style*='background-image']"))
            if not src:
                continue
            b = localize(src)
            if b and b["src"] not in seen:
                seen.add(b["src"])
                imgs.append({**b, "alt": (img.get("alt") if img else "") or ""})
        if imgs:
            out.append({"t": "gallery", "images": imgs})
    elif t == "call-to-action":
        b = localize(css_bg(w.select_one(".elementor-cta__bg")))
        d = w.select_one(".elementor-cta__description")
        title = w.select_one(".elementor-cta__title")
        a = w.select_one("a")
        card = {"t": "card", "title": text_of(title), "html": inner(d) if d else ""}
        if b:
            card["image"] = {**b, "alt": (w.select_one(".elementor-cta__bg") or {}).get("aria-label", "") if w.select_one(".elementor-cta__bg") else ""}
        href = fix_href(a.get("href")) if a else None
        if href:
            card["href"] = href
        out.append(card)
    elif t == "jkit_video_button":
        a = w.find("a")
        emb = youtube_embed(a.get("href")) if a else None
        if emb:
            out.append({"t": "video", "src": emb})
    elif t == "form":
        out.append({"t": "contact"})
    elif t == "shortcode" or t == "html":
        h = sanitize(w.select_one(".elementor-widget-container") or w)
        if BeautifulSoup(h, "html.parser").get_text(strip=True):
            out.append({"t": "rich", "html": h})
    # divider, spacer, star-rating, icon, social-icons, countdown, jkit_progress_bar: decorativos.
    return out


CARD_WIDGETS = {"image", "heading", "jkit_heading", "text-editor", "button", "jkit_button", "divider", "spacer"}


def widgets_in(node):
    return node.select(".elementor-widget")


def is_card_shape(c):
    ws = widgets_in(c)
    kinds = [(w.get("data-widget_type") or "").split(".")[0] for w in ws]
    return (
        0 < len(ws) <= 8
        and kinds.count("image") == 1
        and sum(k in ("heading", "jkit_heading") for k in kinds) >= 1
        and all(k in CARD_WIDGETS for k in kinds)
    )


def to_card(c):
    blocks = []
    for w in widgets_in(c):
        blocks += widget_blocks(w)
    heads = [b for b in blocks if b["t"] == "heading"]
    # La línea corta sobre el título (categoría) se conserva como antetítulo.
    title = max(heads, key=lambda h: (h["level"] == 2, len(h["text"]))) if heads else None
    card = {"t": "card", "title": title["text"] if title else "", "html": ""}
    kicker = [b["text"] for b in blocks if b["t"] == "label"] + [h["text"] for h in heads if h is not title]
    if kicker:
        card["kicker"] = kicker[0]
    html_parts = [b["html"] for b in blocks if b["t"] == "rich"]
    card["html"] = "".join(html_parts)
    img = next((b for b in blocks if b["t"] == "image"), None)
    if img:
        card["image"] = {k: img[k] for k in ("src", "width", "height", "alt")}
    btn = next((b for b in blocks if b["t"] == "button"), None)
    if btn:
        card["href"], card["cta"] = btn["href"], btn["text"]
    return card


def child_tags(node):
    return [c for c in node.children if isinstance(c, Tag)]


def is_container(c):
    cl = c.get("class") or []
    return "e-con" in cl or "elementor-column" in cl or "elementor-inner-section" in cl or "elementor-section" in cl


def hidden(c):
    cl = c.get("class") or []
    return "elementor-hidden-desktop" in cl or "elementor-hidden" in cl


def walk(node, out):
    kids = [k for k in child_tags(node) if not hidden(k)]
    containers = [k for k in kids if is_container(k)]
    card_like = [k for k in containers if is_card_shape(k)]
    as_cards = len(card_like) >= 2
    for k in kids:
        if k.get("id") and is_container(k):
            out.append({"t": "anchor", "id": k["id"]})
        if "elementor-widget" in (k.get("class") or []):
            out += widget_blocks(k)
        elif as_cards and k in card_like:
            out.append(to_card(k))
        else:
            walk(k, out)


LEFTOVERS = re.compile(r"(?i)get (your )?tickets|free 3x all design|maximum 2 type of design|lorem ipsum|movely")


def tidy(blocks):
    """Convierte patrones de maquetación de Elementor en bloques con significado."""
    out, i = [], 0
    while i < len(blocks):
        b = blocks[i]
        if b["t"] != "heading":
            out.append(b)
            i += 1
            continue
        run = []
        j = i
        while j < len(blocks) and blocks[j]["t"] == "heading":
            run.append(blocks[j])
            j += 1
        if len(run) >= 4 and all(x["level"] >= 5 for x in run[0::2]):
            # Antetítulo pequeño + frase: tarjeta de paso.
            for k in range(0, len(run), 2):
                body = f"<p>{htmllib.escape(run[k + 1]['text'])}</p>" if k + 1 < len(run) else ""
                out.append({"t": "card", "title": run[k]["text"], "html": body})
        elif len(run) >= 3 and not any(re.search(r"[?$:]", x["text"]) for x in run):
            lead = len(run[0]["text"]) < 40 and any(len(x["text"]) > 40 for x in run[1:])
            rest = run[1:] if lead else run
            if lead:
                out.append(run[0])
            short = all(len(x["text"]) < 30 for x in rest)
            out.append({"t": "chips" if short else "list", "items": [x["text"] for x in rest]})
        else:
            out += run
        i = j
    return out


def page_sections(rendered):
    soup = BeautifulSoup(rendered, "html.parser")
    for t in soup.find_all(["script", "style", "svg"]):
        t.decompose()
    tops = [t for t in soup.select(".elementor > .e-con, .elementor > section") if not hidden(t)]
    sections, seen, people = [], set(), set()
    for top in tops:
        blocks = []
        walk(top, blocks)
        kept = []
        for b in blocks:
            if LEFTOVERS.search(json.dumps(b, ensure_ascii=False)):
                continue
            if b["t"] == "heading" and b["text"] in ("$949", "$449"):
                continue
            if b["t"] == "person":
                if b["name"] in people:
                    continue
                people.add(b["name"])
            kept.append(b)
        kept = tidy(kept)
        # Tabla de precios en inglés heredada de la plantilla (no es oferta real).
        if "Pricing & Plans" in json.dumps(kept, ensure_ascii=False):
            continue
        # Un botón sin destino al inicio es una etiqueta; más abajo es una llamada a la acción.
        first = next((n for n, b in enumerate(kept) if b["t"] != "anchor"), 0)
        for n, b in enumerate(kept):
            if b["t"] == "kicker" and n != first:
                kept[n] = {"t": "button", "href": "/contacto/", "text": b["text"]}
        content = [b for b in kept if b["t"] != "anchor"]
        sig = json.dumps(content, ensure_ascii=False, sort_keys=True)
        logos = sum(b["t"] == "image" for b in content) > 6
        heads = [b["text"] for b in content if b["t"] == "heading"]
        if not content or sig in seen or (logos and heads and heads[0] in seen):
            continue
        seen.add(sig)
        if logos and heads:
            seen.add(heads[0])
        sections.append({"blocks": kept})
    # Anclas que ya no existen (popups de Elementor) llevan a contacto.
    ids = {b["id"] for sec in sections for b in sec["blocks"] if b["t"] == "anchor"}
    for sec in sections:
        for b in sec["blocks"]:
            if str(b.get("href", "")).startswith("#") and b["href"][1:] not in ids:
                b["href"] = "/contacto/"
    if not tops:
        h = sanitize(soup)
        if h:
            sections.append({"blocks": [{"t": "rich", "html": h}]})
    return sections


def seo_of(key, fallback_title):
    s = seo.get(key, {})
    og = localize(s.get("ogimage")) if s.get("ogimage") else None
    return {"title": s.get("title") or fallback_title, "description": s.get("description", ""), "image": og["src"] if og else None}


def clean_title(t):
    return re.sub(r"\s+", " ", htmllib.unescape(t).replace("\xa0", " ")).strip()


TYPOS = {
    "Casos de èxito": "Casos de éxito", "Procesos estructurado": "Procesos estructurados", '"AWA"': '"AWS"',
    "Desarollador": "Desarrollador", "Ciberseguirdad": "Ciberseguridad",
    "Una fabrica de transformacion digital": "Una fábrica de transformación digital",
}


def fix_typos(sections):
    text = json.dumps(sections, ensure_ascii=False)
    for bad, good in TYPOS.items():
        text = text.replace(bad.replace('"', '\\"') if False else bad, good)
    return json.loads(text)


def write(rel, obj):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    json.dump(obj, open(path, "w", encoding="utf8"), ensure_ascii=False, indent=1)


def shorten(text, limit=170):
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0].rstrip(" ,;:") + "…"


# ---------- Artículos ----------
index = []
for p in posts:
    slug = p["slug"]
    title = clean_title(p["title"]["rendered"])
    feat = media_by_id.get(p.get("featured_media"))
    meta = seo_of(slug, title)
    img = localize(feat["source_url"]) if feat else None
    if img:
        img = {**img, "alt": feat.get("alt_text") or title}
    elif meta["image"]:
        img = {"src": meta["image"], "width": 1200, "height": 675, "alt": title}
    body = sanitize(p["content"]["rendered"])
    excerpt = clean_title(BeautifulSoup(p["excerpt"]["rendered"], "html.parser").get_text(" ", strip=True))
    excerpt = re.sub(r"\s*(\[…\]|\[\.\.\.\]|Leer más.*)$", "", excerpt)
    item = {
        "slug": slug, "title": title, "date": p["date"], "modified": p["modified"], "excerpt": shorten(excerpt),
        "category": cats.get((p.get("categories") or [0])[0], {}).get("name", "Blog"),
        "image": img, "seo": meta,
    }
    index.append(item)
    write(f"content/posts/{slug}.json", {**item, "html": body})
index.sort(key=lambda x: x["date"], reverse=True)
write("content/posts-index.json", index)

# ---------- Páginas genéricas ----------
listing = []
for p in pages:
    slug = p["slug"]
    if slug in BESPOKE or slug in SKIP:
        continue
    title = clean_title(p["title"]["rendered"])
    sections = page_sections(p["content"]["rendered"])
    # En esta página el primer bloque es texto SEO oculto: el héroe real es el segundo.
    if slug == "impulsa-desarrollo-producto-minimo-viable":
        sections[0], sections[1] = sections[1], sections[0]
    write(f"content/pages/{slug}.json", {"slug": slug, "title": title, "seo": seo_of(slug, title), "sections": fix_typos(sections), "modified": p["modified"]})
    listing.append(slug)
write("content/pages-index.json", sorted(listing))

# ---------- SEO de páginas con plantilla propia ----------
bespoke_seo = {}
for slug in BESPOKE:
    key = "home" if slug == "home-page-agencia-idp" else slug
    bespoke_seo[key] = seo_of(key, slug)
write("content/seo.json", bespoke_seo)

# ---------- Precios ----------
pr = BeautifulSoup(next(p for p in pages if p["slug"] == "precios")["content"]["rendered"], "html.parser")
for t in pr.find_all(["script", "style", "svg"]):
    t.decompose()
groups = []
plan = None
pending = []
for el in pr.find_all(["h2", "h3", "li"]):
    txt = text_of(el)
    if not txt:
        continue
    if el.name == "li":
        if plan is not None and txt not in plan["items"]:
            plan["items"].append(txt)
    elif "$" in txt:
        plan = {"name": pending[0] if pending else "", "desc": pending[1] if len(pending) > 1 else "", "price": txt.replace(" ", ""), "items": []}
        groups[-1]["plans"].append(plan)
        pending = []
    elif el.name == "h2":
        if txt.startswith("Planes") and "&" in txt:
            continue
        groups.append({"title": txt, "plans": []})
        plan, pending = None, []
    else:
        pending.append(txt)
for g in groups:
    if len(g["plans"]) == 6:
        g["tabs"] = [{"name": "Desarrollo web", "plans": g["plans"][:3]}, {"name": "Administración", "plans": g["plans"][3:]}]
    else:
        g["tabs"] = [{"name": "Planes", "plans": g["plans"]}]
    del g["plans"]
write("content/precios.json", groups)

# ---------- Medios de la portada ----------
home_media = {}
for name, url in {
    "founder": "2025/04/fa55e558-3750-4068-85e3-0da57a8a819e.png",
    "testimonios": "2024/04/people-hand-holding-a-pen-for-working-to-write-on-a-book-for-letter-or-business-document.jpg",
    "pintuco": "2025/04/pintuco.png", "corpaul": "2025/04/corpaul.png", "comfama": "2025/04/comfama.png",
    "humano": "2025/04/Humanoseguros.webp", "starco": "2025/04/starco.png", "logoCliente": "2025/04/logo.svg",
    "t1": "2024/04/portrait-of-a-woman-6M4S34K.jpg", "t2": "2024/04/handsome-man-smiling-in-the-park-RKUHFQB.jpg",
    "t3": "2024/04/portrait-of-an-african-woman-smiling-8LRBATX.jpg",
}.items():
    home_media[name] = localize(f"{ORIGIN}/wp-content/uploads/{url}")
home_media["brochure"] = localize_doc(f"{ORIGIN}/wp-content/uploads/2026/05/Presentacion-Corporativa-Agencia-IDP.pdf")
write("content/home-media.json", home_media)

# ---------- Textos de la portada ----------
hs = BeautifulSoup(next(p for p in pages if p["slug"] == "home-page-agencia-idp")["content"]["rendered"], "html.parser")
for t in hs.find_all(["script", "style", "svg"]):
    t.decompose()
paras = [clean_text(x.get_text(" ", strip=True)) for x in hs.find_all(["p", "li"])]


def para(prefix):
    return next(x for x in paras if x.startswith(prefix))


techs = []
for title, pct, prefix, stack in (
    ("Tecnologías FRONT", 93, "Transformamos tu experiencia", "React JS · Angular · Flutter"),
    ("Tecnologías BACKEND", 96, "Fortalecemos tu infraestructura", "Node JS · PHP · .NET"),
    ("Ciencia de datos", 82, "Impulsamos tu análisis", "Python"),
    ("Gestores de contenido", 86, "Potenciamos tu gestión", ""),
    ("Aplicaciones móviles", 90, "Elevamos tu experiencia", ""),
):
    techs.append({"title": title, "pct": pct, "text": para(prefix), "stack": stack})
services = []
for w in hs.select('[data-widget_type^="jkit_icon_box"]'):
    title = text_of(w.select_one(".title"))
    ps = [x for x in w.select_one(".icon-box-description").stripped_strings] if w.select_one(".icon-box-description") else []
    services.append({"title": title, "paragraphs": [clean_text(x) for x in ps]})
write("content/home.json", {
    "intro": para("La mejor fabrica"), "about": para("Tanto las personas"),
    "techIntro": [para("En Agencia IDP, combinamos"), para("Somos una fábrica")],
    "focus": [para("Rendimiento superior"), para("Seguridad avanzada"), para("Escalabilidad y eficiencia"), para("Innovación y respaldo")],
    "focusEnd": para("El resultado"), "techs": techs, "services": services,
    "work": para("Nuestra experiencia enfocada"),
    "testimonials": [text_of(x) for x in hs.select(".elementor-testimonial-content")] or [para("¡Increíble"), para("Estamos encantados"), para("No podríamos")],
})

# ---------- Fondos e imágenes que no están en el contenido ----------
extra = {}
for name, url in {
    "autoHero": "wp-content/uploads/2024/08/fondo-agencia-idp-automatizaciones-1-scaled.jpg",
    "paper": "wp-content/uploads/2024/04/9977596f-1667-47f9-a325-5c699769b31e.jpeg",
    "transformHero": "wp-content/uploads/2025/04/team-of-system-engineer-writing-data-and-discussin-2025-02-17-20-18-54-utc-scaled-e1746637459956.jpg",
    "asociaciones": "wp-content/uploads/2024/10/asociaciones.jpeg",
    "mvpAvatar": "wp-content/uploads/2025/05/nexi-37-248x300.jpg",
    "colombiaPeople": "wp-content/uploads/2025/05/desarrollo-software-idp-empresarios-felices-scaled.webp",
    "colombiaTeam": "wp-content/uploads/2025/05/transformando-ideas-en-productos-digitales-scaled.webp",
    "ecoBadge": "wp-content/plugins/plugin-footer//assets/logo-2.png",
}.items():
    extra[name] = localize(f"{ORIGIN}/{url}")
write("content/extra-media.json", extra)

# ---------- Marca ----------
brand = os.path.join(ROOT, "public", "brand")
os.makedirs(brand, exist_ok=True)
for src, name in (("2024/04/Logo-negro2.png", "logo-agencia-idp.webp"), ("2024/04/Logoblanco-y-negro-e1746639452452.png", "logo-agencia-idp-blanco.webp")):
    im = Image.open(io.BytesIO(fetch(f"{ORIGIN}/wp-content/uploads/{src}"))).convert("RGBA")
    im = im.crop(im.getchannel("A").getbbox())
    if im.width > 640:
        im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
    im.save(os.path.join(brand, name), "WEBP", quality=90)
    print(name, im.size)
fav = Image.open(io.BytesIO(fetch(f"{ORIGIN}/wp-content/uploads/2025/05/favicon-300x300.png"))).convert("RGBA")
fav.save(os.path.join(ROOT, "app", "icon.png"))
fav.resize((180, 180), Image.LANCZOS).save(os.path.join(ROOT, "app", "apple-icon.png"))

total = sum(os.path.getsize(os.path.join(MEDIA_DIR, f)) for f in os.listdir(MEDIA_DIR))
print(f"posts={len(index)} pages={len(listing)} media={len(downloaded)} size={total/1e6:.1f}MB failed={len(failed)}")
for f in failed[:20]:
    print(" FAIL", f)
