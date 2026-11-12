# Caminos Verdes · 2KAMIGOS

Plataforma web de educación ambiental de la **Asociación de Amigos de Los Dos Caminos (2KAMIGOS)**: mapa interactivo de los árboles de la Avenida Sucre y calendario ambiental 2027.

Es un **sitio estático**: solo HTML, CSS y JavaScript, sin base de datos ni servidor. Se puede publicar gratis y no requiere mantenimiento técnico.

---

## 1. Abrir el proyecto en VS Code

1. Descomprime `caminos-verdes-web.zip` en tu computadora.
2. En VS Code: **Archivo → Abrir carpeta…** y elige la carpeta `caminos-verdes-web`.
3. VS Code te sugerirá instalar la extensión **Live Server**: acepta. (Si no aparece, búscala en Extensiones: *Live Server*, de Ritwick Dey).
4. Abre `index.html`, haz clic derecho → **Open with Live Server**. Se abrirá la página en el navegador y se actualizará sola cada vez que guardes un cambio.

> También funciona con doble clic sobre `index.html`, pero Live Server muestra los cambios al instante.

Para verla como en un teléfono: en Chrome, presiona `F12` y luego el ícono de teléfono (o `Ctrl+Shift+M`).

---

## 2. Estructura de carpetas

```
caminos-verdes-web/
├── index.html              ← la página (todas las secciones)
├── css/
│   └── estilos.css         ← colores, tipografías y diseño
├── js/
│   ├── mapa.js             ← mapa interactivo y fichas de árboles
│   ├── calendario.js       ← visor del calendario
│   └── main.js             ← menú y enlaces directos para QR
├── data/
│   ├── arboles.js          ← ★ DATOS DE LOS 27 ÁRBOLES (aquí se edita)
│   ├── especies.js         ← ★ texto de cada especie (Roble, Samán…)
│   └── calendario.js       ← textos de cada mes del calendario
├── img/
│   ├── mapa/               ← el mapa original exportado del PDF
│   ├── calendario/         ← las 13 páginas originales del calendario
│   ├── fondos/             ← fondos de pantalla de cada mes (imagen .jpg y video .mp4)
│   ├── arboles/            ← fotos originales de cada árbol (y miniaturas)
│   ├── fotos/              ← fotos de la portada
│   └── logo/               ← logos y favicon
├── docs/
│   ├── mapa-caminos-verdes-web.pdf        ← mapa liviano para el teléfono
│   ├── calendario-2027-caminos-verdes.pdf
│   └── originales/                        ← archivos originales sin tocar
└── vendor/leaflet/         ← librería del mapa (no modificar)
```

---

## 3. Cómo actualizar contenidos (sin saber programar)

### Agregar información a un árbol
Abre `data/arboles.js`. Cada línea es un árbol, numerados en el sentido del recorrido: el n.º 1 (Mangos) está en la Av. Francisco de Miranda y el n.º 27 (Jabillo) en la Av. Los Chorros. Por ejemplo, el árbol n.º 27:

```js
{"id": 27, "nombre": "Jabillo", ..., "nombre_cientifico": "", "camino": "", "descripcion": "", ...}
```

Escribe entre las comillas y guarda:

```js
"nombre_cientifico": "Nombre científico validado",
"camino": "Camino 1",
"descripcion": "Texto con las características de la especie (con fuente confiable)."
```

- Campo opcional `"nota"`: una línea extra en la ficha (por ejemplo, en el n.º 1: "Hilera de 3 árboles de mango.").
- Un campo vacío `""` **no se muestra** en la ficha. Así nunca aparece información inventada.
- Cuando todos los árboles tengan el campo `camino`, aparecerán **solos** los botones para filtrar por recorrido.
- No cambies `id`, `foto` ni `mapa`: unen cada árbol con su globo en el dibujo.
- Cuidado con las comas y comillas: si la página deja de mostrar los árboles, revisa que no falte ninguna (VS Code subraya en rojo los errores).

### Cambiar textos de la página
Abre `index.html`. Cada sección está marcada con un comentario, por ejemplo `<!-- ==================== D. CONOCE CAMINOS VERDES ==================== -->`. Cambia el texto entre las etiquetas y guarda.

### Cambiar los autores
En `index.html`, busca `credito-autores` (`Ctrl+F`) y edita los nombres. También están en la etiqueta `<meta name="author">` al inicio.

### Cambiar una foto
Reemplaza el archivo en `img/` **con el mismo nombre**. Usa fotos de máximo 1000 px de ancho para que la página cargue rápido.

---

### Fondos de pantalla del calendario
Cada mes tiene un botón **Fondo de pantalla** con dos descargas: una imagen fija (`img/fondos/fondo-MES.jpg`) y un video corto en movimiento (`img/fondos/fondo-MES.mp4`), hechos con la foto real del árbol del mes. Para cambiar uno, reemplaza los archivos con el mismo nombre. Si un mes tiene `fondo: ""` en `data/calendario.js`, el botón no aparece. Cuando los estudiantes graben videos reales de los árboles, basta con reemplazar el `.mp4`.

---

## 4. Enlaces directos (para los códigos QR)

| Enlace (agregar al final de la dirección web) | Abre |
|---|---|
| `/` | La portada |
| `/#mapa` | El mapa interactivo |
| `/#calendario` | El calendario |
| `/#arbol-12` | La ficha del árbol n.º 12 |
| `/#mes-noviembre` | El calendario en noviembre |

Ejemplo: `https://2kamigos.github.io/caminos-verdes/#arbol-12` podría ir en un QR pegado junto a ese árbol.

**No generes los QR definitivos** hasta que la página esté publicada en su dirección final.

---

## 5. Publicar gratis (dirección permanente)

Opción recomendada: **GitHub Pages** (gratis, estable, no depende de tu computadora).

1. Crea una cuenta en [github.com](https://github.com) (idealmente a nombre de la asociación, no personal, para que la dirección no dependa de una persona).
2. Crea un repositorio público llamado `caminos-verdes`.
3. Sube todo el contenido de la carpeta (botón **Add file → Upload files**, arrastra los archivos y carpetas).
4. Ve a **Settings → Pages** → en *Branch* elige `main` y carpeta `/ (root)` → **Save**.
5. En 1 o 2 minutos la página estará en `https://USUARIO.github.io/caminos-verdes/`.

Alternativas igual de gratuitas: **Netlify** (arrastrar la carpeta en app.netlify.com/drop) o **Cloudflare Pages**.
Opcional: un dominio propio (por ejemplo `caminosverdes2k.org`) cuesta aprox. 10–15 USD al año.

---

## 6. Mantenimiento básico

- **Una vez al año:** revisar que los árboles sigan en su lugar y actualizar fotos si cambiaron.
- **Calendario nuevo (2028):** reemplazar las imágenes de `img/calendario/` y los textos de `data/calendario.js`.
- **Nuevo árbol en el mapa:** requiere actualizar el mapa en Illustrator, exportarlo de nuevo y ubicar su zona tocable. Pídelo como cambio técnico.
- Guarda siempre una copia de la carpeta antes de editar.

---

## 7. Decisiones técnicas (resumen)

- **Mapa:** el PDF de Illustrator no tiene coordenadas geográficas (es una ilustración), así que se usa la imagen original de alta resolución como fondo y zonas tocables sobre cada globo, con la librería gratuita **Leaflet** en modo imagen. El diseño original no se modificó.
- **Calendario:** se muestran las páginas originales; la navegación digital se agrega alrededor.
- **Identidad:** tipografías Montserrat y Open Sans (presentes en el mapa original) y la paleta turquesa medida en los materiales. Para textos pequeños se usa un turquesa un poco más oscuro (#1A6E82) para garantizar la legibilidad.
- **Accesibilidad:** botones de mínimo 44 px, textos alternativos en imágenes, navegación con teclado, lista de árboles alternativa al mapa y respeto por la opción "reducir movimiento".
- **Sin formularios ni recolección de datos personales.**

---

## 8. Pendientes de contenido

- [ ] Nombres de los dos caminos y qué árboles pertenecen a cada uno.
- [ ] Validar con un especialista los textos y nombres científicos de `data/especies.js` (hoy marcados "por validar") y completar Castaño, Acacias, Palmas Dulces y Chaguaramo Enano.
- [x] Autores en los créditos: Angelo Guevara, Jose Zambrano y Carla Belisario.
- [ ] Logos en SVG o PNG de alta resolución (los actuales se extrajeron de los PDF).
- [ ] Coordenadas GPS de cada árbol (opcional: para un botón "Abrir en Google Maps").
- [ ] Confirmar qué árbol exacto corresponde a enero (Jabillo frente a Mansión Ávila) y a febrero (Mango frente a Multi Servicios Jack 4x4): se usó la foto del Jabillo n.º 27 y del Mango n.º 25.
- [ ] Confirmar las tildes de los nombres (en la web se escribieron Fénix, Almendrón, Higuerón y Pilón).

---

Autores: Angelo Guevara, Jose Zambrano y Carla Belisario.
Proyecto de labor social de la Universidad José María Vargas · TSU en Diseño Gráfico · para la Asociación de Amigos de Los Dos Caminos (2KAMIGOS).
Mapa: Leaflet 1.9.4 (licencia BSD-2, ver `vendor/leaflet/LICENSE`).
