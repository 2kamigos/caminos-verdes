/*
  INFORMACIÓN POR ESPECIE · Caminos Verdes 2KAMIGOS
  --------------------------------------------------
  Un texto por especie: todos los árboles con ese nombre en data/arboles.js
  muestran esta información en su ficha (por ejemplo, los dos Robles).

  IMPORTANTE: es información general de cada especie, identificada solo por
  su nombre común. Debe validarla un especialista (botánico, Plantados Ccs, etc.).
  Cuando esté validada, cambia  validado: false  por  validado: true
  y desaparecerá el aviso "por validar".

  Campos:
    nombre_cientifico  Nombre científico probable ("" si no se puede asegurar).
    descripcion        Texto breve para la ficha.
    validado           true cuando un especialista lo confirme.

  Si una especie no aparece aquí, la ficha dice que pronto tendrá información.
*/
window.ESPECIES = {
  "Jabillo": {
    nombre_cientifico: "Hura crepitans",
    descripcion: "Árbol nativo de la América tropical, de gran tamaño, con el tronco cubierto de espinas cónicas. Sus frutos, con forma de pequeña calabaza, estallan al secarse y lanzan las semillas lejos. Su savia es irritante: es mejor no tocarla.",
    validado: false
  },
  "Samán": {
    nombre_cientifico: "Samanea saman",
    descripcion: "Árbol nativo de la América tropical y uno de los más emblemáticos de Venezuela. Su copa muy amplia, en forma de sombrilla, da sombra abundante. Sus hojas se cierran al atardecer y en los días nublados.",
    validado: true
  },
  "Mango": {
    nombre_cientifico: "Mangifera indica",
    descripcion: "Originario del sur de Asia y cultivado en todo el trópico. Es un árbol de copa densa y siempre verde que da sombra todo el año. Sus frutos alimentan a personas, aves y otros animales de la ciudad.",
    validado: false
  },
  "Apamates": {
    nombre_cientifico: "Tabebuia rosea",
    descripcion: "Árbol nativo de la América tropical. En la temporada seca pierde sus hojas y se cubre de flores rosadas o lilas, uno de los espectáculos más bonitos de las calles de Caracas.",
    validado: false
  },
  "Roble": {
    nombre_cientifico: "Platymiscium diadelphum",
    descripcion: "Árbol nativo de Venezuela, conocido popularmente como roble. Florece con racimos de pequeñas flores amarillas y su madera es muy apreciada por su dureza.",
    validado: false
  },
  "Almendrón": {
    nombre_cientifico: "Terminalia catappa",
    descripcion: "Originario de Asia tropical y muy usado en las ciudades por su sombra. Sus ramas crecen en pisos horizontales y sus hojas grandes se tornan rojizas antes de caer.",
    validado: false
  },
  "Urape Blanco": {
    nombre_cientifico: "Bauhinia sp.",
    descripcion: "Árbol pequeño del género Bauhinia, reconocible por sus hojas con dos lóbulos, parecidas a la huella de una pezuña, y por sus flores blancas.",
    validado: false
  },
  "Pilón": {
    nombre_cientifico: "Andira inermis",
    descripcion: "Árbol nativo de la América tropical, de copa redondeada. Florece con racimos de flores rosadas o moradas que atraen abejas y otros polinizadores.",
    validado: false
  },
  "Nim": {
    nombre_cientifico: "Azadirachta indica",
    descripcion: "Originario de la India, de crecimiento rápido y resistente a la sequía. Tradicionalmente sus hojas y semillas se usan como repelente natural de insectos.",
    validado: false
  },
  "Cheflera": {
    nombre_cientifico: "Schefflera actinophylla",
    descripcion: "Originaria de Australia y Nueva Guinea. Tiene hojas compuestas en forma de paraguas y flores rojas en largos racimos que atraen aves e insectos.",
    validado: false
  },
  "Pittosporum": {
    nombre_cientifico: "Pittosporum tobira",
    descripcion: "Originario de Asia oriental. Es un arbusto o árbol pequeño de hojas brillantes, muy usado en jardinería porque tolera bien la poda; por eso puede verse con forma redondeada.",
    validado: false
  },
  "Ficus": {
    nombre_cientifico: "Ficus sp.",
    descripcion: "Árbol del género Ficus, de copa densa y raíces muy fuertes. Sus pequeños frutos alimentan a muchas aves de la ciudad.",
    validado: false
  },
  "Ficus Higuerón": {
    nombre_cientifico: "Ficus sp.",
    descripcion: "Los higuerones son árboles del género Ficus, de gran tamaño y raíces poderosas. Sus pequeños frutos son alimento para aves y murciélagos.",
    validado: false
  },
  "Palma Fénix": {
    nombre_cientifico: "Phoenix sp.",
    descripcion: "Palmera del género Phoenix, pariente de la palma datilera, con hojas largas y arqueadas. Es muy usada como ornamental en calles y jardines.",
    validado: false
  }
};
