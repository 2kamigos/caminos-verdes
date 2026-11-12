/* ==========================================================================
   FUNCIONES GENERALES · Caminos Verdes
   - Menú del teléfono
   - Enlaces directos para códigos QR:
       #mapa              → sección del mapa
       #calendario        → sección del calendario
       #arbol-5           → abre la ficha del árbol n.º 5
       #mes-noviembre     → abre el calendario en noviembre
   ========================================================================== */
(function () {
  "use strict";

  function iniciarMenu() {
    var boton = document.getElementById("menu-boton");
    var menu = document.getElementById("menu");
    function cerrar() {
      menu.classList.remove("abierto");
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir menú");
    }
    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
      boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", cerrar); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });
  }

  // Resalta en el menú la sección que se está viendo
  function iniciarMenuActivo() {
    if (!("IntersectionObserver" in window)) return;
    var enlaces = document.querySelectorAll(".menu a");
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        enlaces.forEach(function (a) { a.classList.toggle("activo", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["inicio", "mapa", "calendario", "conoce", "participa", "sobre"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) obs.observe(s);
    });
  }

  function leerEnlace() {
    var h = decodeURIComponent(location.hash || "");
    var arbol = h.match(/^#arbol-(\d+)$/);
    var mes = h.match(/^#mes-(.+)$/);
    if (arbol && window.CaminosMapa) {
      document.getElementById("mapa").scrollIntoView();
      setTimeout(function () { window.CaminosMapa.abrirFicha(parseInt(arbol[1], 10)); }, 200);
    } else if (mes && window.CaminosCalendario) {
      if (window.CaminosCalendario.irAMes(mes[1])) document.getElementById("calendario").scrollIntoView();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    iniciarMenu();
    iniciarMenuActivo();
    leerEnlace();
  });
  window.addEventListener("hashchange", leerEnlace);
})();
