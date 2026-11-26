/* ==========================================================================
   CARGA DE DATOS · Caminos Verdes
   --------------------------------------------------------------------------
   Los textos de la página están en tres archivos JSON que se editan desde
   el panel de administración (Pages CMS) o a mano:
     data/arboles.json     → los 27 árboles del mapa
     data/especies.json    → nombre científico y descripción de cada especie
     data/calendario.json  → los textos de cada mes del calendario
   Este archivo los descarga y, cuando están listos, arranca el resto.
   ========================================================================== */
(function () {
  "use strict";

  var version = "?v=" + Math.floor(Date.now() / 60000); // cambia cada minuto: evita ver datos viejos guardados
  function leer(ruta) {
    return fetch(ruta + version).then(function (r) {
      if (!r.ok) throw new Error(ruta + ": " + r.status);
      return r.json();
    });
  }

  var datos = Promise.all([
    leer("data/arboles.json"),
    leer("data/especies.json"),
    leer("data/calendario.json")
  ]).then(function (r) {
    window.ARBOLES = r[0];
    // especies.json es una lista; el mapa la busca por nombre
    var especies = {};
    r[1].forEach(function (e) { if (e && e.nombre) especies[e.nombre] = e; });
    window.ESPECIES = especies;
    window.CALENDARIO = r[2];
  }).catch(function (e) {
    console.error("No se pudieron cargar los datos de Caminos Verdes", e);
    window.ARBOLES = window.ARBOLES || [];
    window.ESPECIES = window.ESPECIES || {};
    window.CALENDARIO = window.CALENDARIO || [];
  });

  var dom = new Promise(function (listo) {
    if (document.readyState !== "loading") listo();
    else document.addEventListener("DOMContentLoaded", listo);
  });

  var todo = Promise.all([datos, dom]);

  // Úsalo en lugar de DOMContentLoaded: espera a la página y a los datos.
  window.alListo = function (fn) { todo.then(fn); };
})();
