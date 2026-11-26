/* ==========================================================================
   MAPA INTERACTIVO · Caminos Verdes
   --------------------------------------------------------------------------
   Cómo funciona:
   1. La imagen del mapa original (exportada del PDF, sin redibujar) se usa
      como fondo en Leaflet, en modo "imagen plana" (CRS.Simple): no es un
      mapa geográfico, es el dibujo del diseñador con zoom y desplazamiento.
   2. Sobre cada globo del dibujo se coloca una zona invisible que se puede
      tocar. Sus coordenadas están en data/arboles.json (campo "mapa").
   3. Al tocar una zona se abre la ficha del árbol.
   ========================================================================== */
(function () {
  "use strict";

  // Tamaño en píxeles de la imagen img/mapa/mapa-caminos-verdes.webp
  var ANCHO = 1800;
  var ALTO = 6774;
  var IMAGEN = "img/mapa/mapa-caminos-verdes.webp";

  var arboles = [];             // se llena en el arranque con data/arboles.json
  var mapa = null;
  var zonas = {};              // id del árbol -> rectángulo de Leaflet
  var seleccionados = [];      // ids resaltados
  var arbolAbierto = null;
  var ultimoFoco = null;

  // Estilos de las zonas tocables
  var ESTILO_NORMAL = { stroke: false, fill: true, fillColor: "#FFFFFF", fillOpacity: 0 };
  var ESTILO_RESALTADO = { stroke: true, color: "#FFFFFF", weight: 5, fill: true, fillColor: "#FFFFFF", fillOpacity: 0.18 };

  // Leaflet usa [y, x] y la "y" crece hacia arriba: convertimos desde píxeles.
  function punto(x, y) { return [-y, x]; }

  function normalizar(texto) {
    return (texto || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  }

  /* ---------- Crear el mapa ---------- */
  function iniciarMapa() {
    var contenedor = document.getElementById("mapa-visor");
    if (!contenedor || typeof L === "undefined") return;

    var limites = [punto(0, ALTO), punto(ANCHO, 0)];
    mapa = L.map(contenedor, {
      crs: L.CRS.Simple,
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 120,
      maxBounds: limites,
      maxBoundsViscosity: 1,
      bounceAtZoomLimits: false
    });
    L.imageOverlay(IMAGEN, limites, { alt: "Mapa ilustrado Caminos Verdes" }).addTo(mapa);

    ajustarZoom(true);

    // Zonas tocables
    arboles.forEach(function (a) {
      var z = a.mapa.zona; // [x0, y0, x1, y1]
      var rect = L.rectangle([punto(z[0], z[3]), punto(z[2], z[1])], ESTILO_NORMAL)
        .addTo(mapa)
        .on("click", function () { abrirFicha(a.id); });
      rect.bindTooltip(a.nombre, { direction: "top", opacity: 0.95 });
      zonas[a.id] = rect;
    });

    // Botones propios
    document.getElementById("mapa-acercar").addEventListener("click", function () { mapa.zoomIn(); });
    document.getElementById("mapa-alejar").addEventListener("click", function () { mapa.zoomOut(); });
    document.getElementById("mapa-completo").addEventListener("click", alternarPantallaCompleta);
    window.addEventListener("resize", function () { ajustarZoom(false); });
  }

  // Zoom mínimo = ver todo el ancho del dibujo; vista inicial = inicio del recorrido.
  function ajustarZoom(inicial) {
    var tam = mapa.getSize();
    var zoomAncho = Math.log2(tam.x / ANCHO);
    var zoomAlto = Math.log2(tam.y / ALTO);
    mapa.setMinZoom(Math.min(zoomAncho, zoomAlto));
    mapa.setMaxZoom(zoomAncho + 2);
    if (inicial) {
      // En teléfono empieza por la cabecera del mapa; en pantallas anchas,
      // directamente en los primeros árboles (la cabecera queda arriba).
      var arriba = tam.x < 600 ? 0 : 950;
      var y = Math.min(ALTO, arriba + (tam.y / 2) / Math.pow(2, zoomAncho));
      mapa.setView(punto(ANCHO / 2, y), zoomAncho, { animate: false });
    }
  }

  function alternarPantallaCompleta() {
    var marco = document.getElementById("mapa-marco");
    var boton = document.getElementById("mapa-completo");
    var activo = marco.classList.toggle("pantalla-completa");
    boton.setAttribute("aria-pressed", activo ? "true" : "false");
    boton.setAttribute("aria-label", activo ? "Salir de pantalla completa" : "Ver mapa en pantalla completa");
    document.body.style.overflow = activo ? "hidden" : "";
    setTimeout(function () { mapa.invalidateSize(); ajustarZoom(false); }, 50);
  }

  /* ---------- Resaltar árboles ---------- */
  function limpiarResaltado() {
    seleccionados.forEach(function (id) { zonas[id] && zonas[id].setStyle(ESTILO_NORMAL); });
    seleccionados = [];
  }

  function resaltar(ids, centrar) {
    limpiarResaltado();
    ids.forEach(function (id) { if (zonas[id]) { zonas[id].setStyle(ESTILO_RESALTADO); seleccionados.push(id); } });
    if (centrar && ids.length) {
      var grupo = L.featureGroup(ids.map(function (id) { return zonas[id]; }));
      mapa.flyToBounds(grupo.getBounds(), { padding: [40, 40], maxZoom: mapa.getMaxZoom() - 1, duration: 0.6 });
    }
  }

  // Usado por el calendario: "Ver en el mapa"
  function mostrarEspecie(especie) {
    var buscada = normalizar(especie);
    var ids = arboles.filter(function (a) {
      var n = normalizar(a.nombre);
      return n === buscada || n === buscada + "s" || n + "s" === buscada || n.indexOf(buscada + " ") === 0;
    }).map(function (a) { return a.id; });

    activarPestana("interactivo");
    document.getElementById("mapa").scrollIntoView();
    setTimeout(function () {
      mapa.invalidateSize();
      resaltar(ids, true);
      var aviso = document.getElementById("mapa-aviso");
      aviso.textContent = ids.length
        ? (ids.length === 1 ? "Resaltado: 1 " + especie + " en el mapa." : "Resaltados: " + ids.length + " árboles de " + especie + " en el mapa.")
        : "Esta especie aún no está identificada en el mapa.";
    }, 350);
  }

  /* ---------- Ficha del árbol ---------- */
  function buscarArbol(id) {
    for (var i = 0; i < arboles.length; i++) if (arboles[i].id === id) return arboles[i];
    return null;
  }

  function mostrarCampo(elemento, valor) {
    if (valor) { elemento.textContent = valor; elemento.hidden = false; }
    else { elemento.textContent = ""; elemento.hidden = true; }
  }

  function abrirFicha(id) {
    var a = buscarArbol(id);
    if (!a) return;
    if (!arbolAbierto) ultimoFoco = document.activeElement;
    arbolAbierto = id;

    var foto = document.getElementById("ficha-foto");
    foto.src = a.foto;
    foto.alt = "Fotografía del " + a.nombre + " (árbol n.º " + a.id + ")";
    document.getElementById("ficha-num").textContent = "Árbol n.º " + a.id + " de " + arboles.length;
    document.getElementById("ficha-nombre").textContent = a.nombre;
    // Información de la especie: primero la propia del árbol (data/arboles.js),
    // si no existe, la general de su especie (data/especies.js).
    var esp = buscarEspecie(a.nombre);
    var cientifico = a.nombre_cientifico || (esp && esp.nombre_cientifico) || "";
    var descripcion = a.descripcion || (esp && esp.descripcion) || "";
    var porValidar = !a.descripcion && esp && !esp.validado;
    mostrarCampo(document.getElementById("ficha-cientifico"), cientifico ? cientifico + (porValidar ? " (por validar)" : "") : "");
    mostrarCampo(document.getElementById("ficha-camino"), a.camino ? "Recorrido: " + a.camino : "");
    document.getElementById("ficha-ubicacion").textContent = a.ubicacion;
    mostrarCampo(document.getElementById("ficha-especie-titulo"), descripcion ? "Sobre esta especie" : "");
    mostrarCampo(document.getElementById("ficha-descripcion"), descripcion);
    mostrarCampo(document.getElementById("ficha-nota"), a.nota || "");  // nota opcional del árbol (por ejemplo, una hilera)
    mostrarCampo(document.getElementById("ficha-pendiente"), descripcion ? "" : "Pronto agregaremos información sobre esta especie: " + a.nombre + ".");

    // ¿La especie aparece en el calendario?
    var acciones = document.getElementById("ficha-acciones");
    acciones.innerHTML = "";
    var meses = (window.CALENDARIO || []).filter(function (m) {
      return m.mes && normalizar(m.especie_mapa) && mostrarEspecieCoincide(m.especie_mapa, a.nombre);
    });
    meses.forEach(function (m) {
      var b = document.createElement("a");
      b.className = "boton boton--lleno";
      b.href = "#mes-" + normalizar(m.mes);
      b.innerHTML = '<svg aria-hidden="true"><use href="#i-calendario"></use></svg>' + m.mes + " en el calendario";
      b.addEventListener("click", function () { cerrarFicha(); });
      acciones.appendChild(b);
    });

    resaltar([id], false);
    var fondo = document.getElementById("ficha-fondo");
    var ficha = document.getElementById("ficha");
    fondo.hidden = false;
    ficha.hidden = false;
    ficha.scrollTop = 0;
    document.getElementById("ficha-cerrar").focus();
    if (location.hash !== "#arbol-" + id) history.replaceState(null, "", "#arbol-" + id);
  }

  // Busca la especie en data/especies.js (acepta singular y plural: "Mangos" → "Mango")
  function buscarEspecie(nombre) {
    var lista = window.ESPECIES || {};
    var n = normalizar(nombre);
    for (var clave in lista) {
      var k = normalizar(clave);
      if (k === n || k + "s" === n || k === n + "s") return lista[clave];
    }
    return null;
  }

  function mostrarEspecieCoincide(especieMapa, nombreArbol) {
    var e = normalizar(especieMapa), n = normalizar(nombreArbol);
    return n === e || n === e + "s" || n + "s" === e || n.indexOf(e + " ") === 0;
  }

  function cerrarFicha() {
    if (!arbolAbierto) return;
    arbolAbierto = null;
    document.getElementById("ficha").hidden = true;
    document.getElementById("ficha-fondo").hidden = true;
    if (/^#arbol-/.test(location.hash)) history.replaceState(null, "", "#mapa");
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  function moverFicha(paso) {
    if (!arbolAbierto) return;
    var indice = arboles.findIndex(function (a) { return a.id === arbolAbierto; });
    var siguiente = arboles[(indice + paso + arboles.length) % arboles.length];
    abrirFicha(siguiente.id);
    var z = zonas[siguiente.id];
    if (z && !mapa.getBounds().contains(z.getBounds())) mapa.panTo(z.getCenter());
  }

  function iniciarFicha() {
    document.getElementById("ficha-cerrar").addEventListener("click", cerrarFicha);
    document.getElementById("ficha-fondo").addEventListener("click", cerrarFicha);
    document.getElementById("ficha-anterior").addEventListener("click", function () { moverFicha(-1); });
    document.getElementById("ficha-siguiente").addEventListener("click", function () { moverFicha(1); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (arbolAbierto) cerrarFicha();
        else if (document.getElementById("mapa-marco").classList.contains("pantalla-completa")) alternarPantallaCompleta();
      }
      if (arbolAbierto && e.key === "ArrowRight") moverFicha(1);
      if (arbolAbierto && e.key === "ArrowLeft") moverFicha(-1);
    });
  }

  /* ---------- Lista accesible de árboles ---------- */
  function iniciarLista() {
    var lista = document.getElementById("lista-arboles");
    arboles.forEach(function (a) {
      var li = document.createElement("li");
      li.dataset.camino = a.camino || "";
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML =
        '<img src="' + a.foto.replace("img/arboles/", "img/arboles/mini/") + '" alt="" loading="lazy" width="46" height="46">' +
        '<span><span class="num">N.º ' + a.id + '</span><span class="nom"></span></span>';
      b.querySelector(".nom").textContent = a.nombre;
      b.addEventListener("click", function () {
        var z = zonas[a.id];
        if (z) mapa.panTo(z.getCenter());
        abrirFicha(a.id);
      });
      li.appendChild(b);
      lista.appendChild(li);
    });
    document.getElementById("cifra-arboles").textContent = arboles.length;
  }

  /* ---------- Filtros por camino (solo si hay datos) ---------- */
  function iniciarFiltros() {
    var caminos = [];
    arboles.forEach(function (a) { if (a.camino && caminos.indexOf(a.camino) < 0) caminos.push(a.camino); });
    if (!caminos.length) return; // sin datos de caminos todavía: no se muestran filtros
    var caja = document.getElementById("filtros");
    caja.hidden = false;
    ["Todos"].concat(caminos).forEach(function (nombre, i) {
      var b = document.createElement("button");
      b.className = "filtro";
      b.type = "button";
      b.textContent = nombre;
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        caja.querySelectorAll(".filtro").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        var ids = nombre === "Todos" ? [] : arboles.filter(function (a) { return a.camino === nombre; }).map(function (a) { return a.id; });
        if (ids.length) resaltar(ids, true); else limpiarResaltado();
        document.querySelectorAll("#lista-arboles li").forEach(function (li) {
          li.hidden = nombre !== "Todos" && li.dataset.camino !== nombre;
        });
      });
      caja.appendChild(b);
    });
  }

  /* ---------- Pestañas: interactivo / PDF ---------- */
  function activarPestana(cual) {
    var interactivo = cual === "interactivo";
    var ti = document.getElementById("tab-interactivo"), tp = document.getElementById("tab-pdf");
    ti.setAttribute("aria-selected", interactivo); tp.setAttribute("aria-selected", !interactivo);
    ti.tabIndex = interactivo ? 0 : -1; tp.tabIndex = interactivo ? -1 : 0;
    document.getElementById("panel-interactivo").hidden = !interactivo;
    document.getElementById("panel-pdf").hidden = interactivo;
    if (interactivo && mapa) setTimeout(function () { mapa.invalidateSize(); }, 30);
  }

  function iniciarPestanas() {
    var ti = document.getElementById("tab-interactivo"), tp = document.getElementById("tab-pdf");
    ti.addEventListener("click", function () { activarPestana("interactivo"); });
    tp.addEventListener("click", function () { activarPestana("pdf"); });
    [ti, tp].forEach(function (t) {
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          var otra = t === ti ? tp : ti;
          otra.click(); otra.focus();
        }
      });
    });
  }

  /* ---------- Arranque ---------- */
  window.alListo(function () {
    arboles = window.ARBOLES || [];
    iniciarPestanas();
    iniciarMapa();
    iniciarFicha();
    iniciarLista();
    iniciarFiltros();
  });

  // Funciones que usan otros archivos (calendario.js y main.js)
  window.CaminosMapa = { abrirFicha: abrirFicha, cerrarFicha: cerrarFicha, mostrarEspecie: mostrarEspecie };
})();
