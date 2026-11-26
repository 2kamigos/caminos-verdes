/* ==========================================================================
   VISOR DEL CALENDARIO 2027 · Caminos Verdes
   --------------------------------------------------------------------------
   Muestra las páginas originales del calendario (una imagen por mes).
   Se puede navegar con flechas, deslizando el dedo o con las teclas ← →.
   Los textos de cada mes están en data/calendario.json.
   ========================================================================== */
(function () {
  "use strict";

  var paginas = [];             // se llena en el arranque con data/calendario.json
  var actual = 0;
  var MESES_CORTOS = ["Portada", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  function normalizar(t) {
    return (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  }

  function mostrar(indice, moverFoco) {
    actual = (indice + paginas.length) % paginas.length;
    var p = paginas[actual];
    var img = document.getElementById("calendario-pagina");

    img.classList.add("cargando");
    var nueva = new Image();
    nueva.onload = nueva.onerror = function () {
      img.src = p.imagen;
      img.alt = p.mes ? p.mes + " 2027: " + p.especie + ". " + p.ubicacion : "Portada del Calendario 2027 Caminos Verdes";
      img.classList.remove("cargando");
    };
    nueva.src = p.imagen;

    document.getElementById("calendario-mes").textContent = p.mes ? p.mes + " 2027" : "Calendario ambiental";
    document.getElementById("calendario-especie").textContent = p.especie;
    document.getElementById("calendario-ubicacion").textContent = p.ubicacion;
    document.getElementById("calendario-ampliar").href = p.imagen;
    document.getElementById("calendario-ver-mapa").hidden = !p.especie_mapa;
    document.getElementById("calendario-fondo").hidden = !p.fondo;

    document.querySelectorAll("#calendario-meses button").forEach(function (b, i) {
      b.setAttribute("aria-current", i === actual ? "true" : "false");
      if (i === actual && moverFoco !== false) b.scrollIntoView({ block: "nearest", inline: "center" });
    });

    // Precarga del mes siguiente y anterior para que el cambio sea rápido
    [actual + 1, actual - 1].forEach(function (k) {
      var q = paginas[(k + paginas.length) % paginas.length];
      if (q) { var pre = new Image(); pre.src = q.imagen; }
    });
  }

  // Enlaces directos tipo #mes-noviembre (útiles para códigos QR por mes)
  function irAMes(nombre) {
    var buscado = normalizar(nombre);
    for (var i = 0; i < paginas.length; i++) {
      if (normalizar(paginas[i].mes) === buscado) { mostrar(i); return true; }
    }
    return false;
  }

  function iniciar() {
    if (!paginas.length) return;
    var caja = document.getElementById("calendario-meses");
    paginas.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = MESES_CORTOS[i] || p.mes;
      b.setAttribute("aria-label", p.mes ? p.mes + ": " + p.especie : "Portada");
      b.addEventListener("click", function () { mostrar(i); });
      caja.appendChild(b);
    });

    document.getElementById("calendario-ant").addEventListener("click", function () { mostrar(actual - 1); });
    document.getElementById("calendario-sig").addEventListener("click", function () { mostrar(actual + 1); });
    document.getElementById("calendario-ver-mapa").addEventListener("click", function () {
      var p = paginas[actual];
      if (p.especie_mapa && window.CaminosMapa) window.CaminosMapa.mostrarEspecie(p.especie_mapa);
    });

    // Fondo de pantalla del mes: ventana con la imagen fija y el video
    var dialogo = document.getElementById("fondos");
    var video = document.getElementById("fondos-video");
    document.getElementById("calendario-fondo").addEventListener("click", function () {
      var p = paginas[actual];
      if (!p.fondo) return;
      var ruta = "img/fondos/fondo-" + p.fondo;
      var nombre = "caminos-verdes-" + p.fondo + "-2027";
      document.getElementById("fondos-mes").textContent = p.mes + " 2027 · " + p.especie;
      var img = document.getElementById("fondos-img");
      img.src = "img/fondos/mini-" + p.fondo + ".jpg";
      img.alt = "Fondo de pantalla de " + p.mes + ": " + p.especie;
      var a1 = document.getElementById("fondos-descargar-img");
      a1.href = ruta + ".jpg"; a1.setAttribute("download", nombre + ".jpg");
      var a2 = document.getElementById("fondos-descargar-video");
      a2.href = ruta + ".mp4"; a2.setAttribute("download", nombre + ".mp4");
      video.poster = img.src;
      video.src = ruta + ".mp4";
      if (dialogo.showModal) dialogo.showModal(); else dialogo.setAttribute("open", "");
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        var r = video.play(); if (r && r.catch) r.catch(function () {});
      }
    });
    function cerrarFondos() { video.pause(); if (dialogo.close) dialogo.close(); else dialogo.removeAttribute("open"); }
    document.getElementById("fondos-cerrar").addEventListener("click", cerrarFondos);
    dialogo.addEventListener("click", function (e) { if (e.target === dialogo) cerrarFondos(); });
    dialogo.addEventListener("close", function () { video.pause(); });

    // Teclado: flechas cuando el visor tiene el foco o el ratón encima
    var visor = document.getElementById("calendario-visor");
    visor.tabIndex = 0;
    visor.setAttribute("aria-label", "Página del calendario. Usa las flechas izquierda y derecha para cambiar de mes.");
    visor.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { mostrar(actual + 1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { mostrar(actual - 1); e.preventDefault(); }
    });

    // Deslizar con el dedo
    var inicioX = null, inicioY = null;
    visor.addEventListener("touchstart", function (e) {
      inicioX = e.touches[0].clientX; inicioY = e.touches[0].clientY;
    }, { passive: true });
    visor.addEventListener("touchend", function (e) {
      if (inicioX === null) return;
      var dx = e.changedTouches[0].clientX - inicioX;
      var dy = e.changedTouches[0].clientY - inicioY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) mostrar(actual + (dx < 0 ? 1 : -1));
      inicioX = null;
    });

    // Mes inicial: el mes actual si estamos en 2027; si no, la portada
    var hoy = new Date();
    mostrar(hoy.getFullYear() === 2027 ? hoy.getMonth() + 1 : 0, false);
  }

  window.alListo(function () {
    paginas = window.CALENDARIO || [];
    iniciar();
  });
  window.CaminosCalendario = { irAMes: irAMes };
})();
