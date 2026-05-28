```javascript
// ===============================================
// CONFIGURACIÓN FIREBASE
// ===============================================

const firebaseConfig = {
    apiKey: "AIzaSyCWOSCmwXJkCucciMvrCi4kKcdSbUJ2bno",
    authDomain: "muro-mensajes-positivos.firebaseapp.com",
    databaseURL: "https://muro-mensajes-positivos-default-rtdb.firebaseio.com",
    projectId: "muro-mensajes-positivos",
    storageBucket: "muro-mensajes-positivos.appspot.com",
    messagingSenderId: "550796933344",
    appId: "1:550796933344:web:b2bd6f438e9a3c3dbd7885"
};

// ===============================================
// INICIALIZAR FIREBASE
// ===============================================

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

// ===============================================
// PALABRAS PROHIBIDAS
// ===============================================

const palabrasNegativas = [

    // Español
    "pendejo",
    "pendeja",
    "cabron",
    "cabrona",
    "culero",
    "culera",
    "puta",
    "puto",
    "chingar",
    "chingada",
    "chingado",
    "mierda",
    "verga",
    "mamon",
    "idiota",
    "imbecil",
    "tarado",
    "baboso",
    "estupido",
    "pinche",
    "ojete",
    "naco",
    "perra",
    "zorra",
    "maricon",
    "joto",
    "puñetas",
    "chaqueto",

    // frases
    "puta madre",
    "hijo de puta",
    "hijo de la chingada",
    "chinga tu madre",
    "vete a la verga",
    "no mames",

    // inglés
    "fuck",
    "fucker",
    "motherfucker",
    "bitch",
    "asshole",
    "dumbass",
    "bastard"
];

// ===============================================
// NORMALIZACIÓN EXTREMA
// ===============================================

function normalizarTexto(texto) {

    const reemplazos = {

        // números
        '0':'o',
        '1':'i',
        '2':'z',
        '3':'e',
        '4':'a',
        '5':'s',
        '6':'g',
        '7':'t',
        '8':'b',
        '9':'g',

        // símbolos
        '@':'a',
        '$':'s',
        '!':'i',
        '|':'i',
        '+':'t',
        '#':'h',
        '%':'x',
        '&':'y',
        '*':'',
        '_':'',
        '-':'',
        '.':'',
        ',':'',
        ';':'',
        ':':'',
        '(':'',
        ')':'',
        '[':'',
        ']':'',
        '{':'',
        '}':'',
        '=':'',
        '?':'',
        '¿':'',
        '¡':'',
        '/':'',
        '\\':'',
        '"':'',
        "'":'',
        '<':'',
        '>':'',
        '~':'',
        '`':''
    };

    texto = texto.toLowerCase();

    // reemplazar caracteres
    texto = texto
        .split('')
        .map(c => reemplazos[c] ?? c)
        .join('');

    // quitar acentos
    texto = texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // quitar emojis y basura
    texto = texto.replace(/[^a-z]/g, '');

    // quitar letras repetidas
    texto = texto.replace(/(.)\1+/g, '$1');

    return texto;
}

// ===============================================
// DETECTOR DE GROSERÍAS
// ===============================================

function verificarMensaje(mensajeUsuario) {

    const textoLimpio =
        normalizarTexto(mensajeUsuario);

    for (const palabra of palabrasNegativas) {

        const palabraLimpia =
            normalizarTexto(palabra);

        // detección directa
        if (textoLimpio.includes(palabraLimpia)) {
            return true;
        }

        // regex extremo flexible
        const regex = new RegExp(

            palabraLimpia
                .split('')
                .join('.*'),

            'i'
        );

        if (regex.test(textoLimpio)) {
            return true;
        }
    }

    return false;
}

// ===============================================
// VALIDAR FRASE
// ===============================================

function esFrasePositiva(texto) {

    return !verificarMensaje(texto);
}

// ===============================================
// ELEMENTOS DOM
// ===============================================

const formulario =
    document.getElementById('formulario-mensaje');

const entrada =
    document.getElementById('entrada-mensaje');

const mensajeError =
    document.getElementById('mensaje-error');

const contenedorFondo =
    document.getElementById('fondo-frases');

const tarjetaPrincipal =
    document.querySelector('.contenedor-principal');

const btnAbrirFormulario =
    document.getElementById('btn-abrir-formulario');

// ===============================================
// COLORES
// ===============================================

const clasesFosforo = [
    'fosforo-verde',
    'fosforo-rosa',
    'fosforo-azul',
    'fosforo-amarillo',
    'fosforo-naranja'
];

// ===============================================
// VALIDACIÓN FORMULARIO
// ===============================================

formulario.addEventListener('submit', (e) => {

    e.preventDefault();

    const textoMensaje =
        entrada.value.trim();

    // vacío
    if (textoMensaje === "") {

        mensajeError.innerText =
            "Escribe un mensaje";

        mensajeError.classList.remove('oculto');

        return;
    }

    // bloquear números y símbolos
    const caracteresInvalidos =
        /[0-9@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/;

    if (caracteresInvalidos.test(textoMensaje)) {

        mensajeError.innerText =
            "No se permiten números ni caracteres especiales";

        mensajeError.classList.remove('oculto');

        return;
    }

    // bloquear groserías
    if (!esFrasePositiva(textoMensaje)) {

        mensajeError.innerText =
            "No se permiten palabras ofensivas";

        mensajeError.classList.remove('oculto');

        return;
    }

    mensajeError.classList.add('oculto');

    // guardar firebase
    database.ref('frases').push({

        texto: textoMensaje,
        timestamp: Date.now()
    });

    entrada.value = '';

    // animación
    tarjetaPrincipal.classList.remove(
        'deslizar-mostrar'
    );

    tarjetaPrincipal.classList.add(
        'deslizar-ocultar'
    );

    setTimeout(() => {

        btnAbrirFormulario
            .classList
            .remove('oculto');

    }, 400);
});

// ===============================================
// BOTÓN REABRIR
// ===============================================

btnAbrirFormulario.addEventListener('click', () => {

    btnAbrirFormulario.classList.add('oculto');

    tarjetaPrincipal.classList.remove(
        'deslizar-ocultar'
    );

    tarjetaPrincipal.classList.add(
        'deslizar-mostrar'
    );
});

// ===============================================
// FIREBASE REALTIME
// ===============================================

database
    .ref('frases')
    .on('child_added', (snapshot) => {

        const datos = snapshot.val();

        procesarDistribuciónFrase(
            datos.texto
        );
    });

// ===============================================
// DISTRIBUIR FRASES
// ===============================================

function procesarDistribuciónFrase(texto) {

    const esMovil =
        window.innerWidth <= 600;

    if (esMovil) {

        if (
            texto.trim() !== "" &&
            texto.includes(' ')
        ) {

            crearFraseAleatoriaMovil(texto);
        }

    } else {

        crearFraseEnPantallaPC(texto);
    }
}

// ===============================================
// MÓVIL
// ===============================================

function crearFraseAleatoriaMovil(fraseCompleta) {

    const elementoFrase =
        document.createElement('div');

    elementoFrase.classList.add(
        'frase-animada'
    );

    elementoFrase.innerText =
        fraseCompleta;

    elementoFrase.style.whiteSpace =
        'nowrap';

    elementoFrase.style.display =
        'inline-block';

    cambiarColorYPosicion(
        elementoFrase
    );

    const retraso =
        Math.random() * 5;

    elementoFrase.style.animationDelay =
        `${retraso}s`;

    elementoFrase.addEventListener(
        'animationiteration',
        () => {

            cambiarColorYPosicion(
                elementoFrase
            );
        }
    );

    contenedorFondo.appendChild(
        elementoFrase
    );
}

// ===============================================
// COLOR Y POSICIÓN
// ===============================================

function cambiarColorYPosicion(elemento) {

    clasesFosforo.forEach(clase =>
        elemento.classList.remove(clase)
    );

    const claseColorAleatorio =
        clasesFosforo[
            Math.floor(
                Math.random() *
                clasesFosforo.length
            )
        ];

    elemento.classList.add(
        claseColorAleatorio
    );

    const posicionX =
        Math.floor(
            Math.random() * 45
        ) + 5;

    const posicionY =
        Math.floor(
            Math.random() * 80
        ) + 5;

    elemento.style.left =
        `${posicionX}%`;

    elemento.style.top =
        `${posicionY}%`;
}

// ===============================================
// PC
// ===============================================

function crearFraseEnPantallaPC(texto) {

    const elementoFrase =
        document.createElement('div');

    elementoFrase.classList.add(
        'frase-animada'
    );

    elementoFrase.innerHTML =
        crearColoresLetrasPC(texto);

    const posicionX =
        Math.floor(
            Math.random() * 80
        ) + 5;

    elementoFrase.style.left =
        `${posicionX}%`;

    const retraso =
        Math.random() * 2;

    elementoFrase.style.animationDelay =
        `${retraso}s`;

    contenedorFondo.appendChild(
        elementoFrase
    );

    setTimeout(() => {

        elementoFrase.remove();

    }, 14000);
}

// ===============================================
// COLORES TEXTO
// ===============================================

function crearColoresLetrasPC(texto) {

    const colores = [

        '#ff6b6b',
        '#feca57',
        '#48dbfb',
        '#1dd1a1',
        '#5f27cd'
    ];

    return texto
        .split('')
        .map(letra => {

            const colorAleatorio =
                colores[
                    Math.floor(
                        Math.random() *
                        colores.length
                    )
                ];

            return `
                <span style="
                    color:${colorAleatorio};
                    font-weight:bold;
                ">
                    ${letra}
                </span>
            `;
        })
        .join('');
}

// ===============================================
// LIMPIEZA AUTOMÁTICA
// ===============================================

setInterval(() => {

    const frases =
        document.querySelectorAll(
            '.frase-animada'
        );

    frases.forEach(frase =>
        frase.remove()
    );

}, 600000);

// ===============================================
// LIMPIEZA MÓVIL
// ===============================================

setInterval(() => {

    if (window.innerWidth <= 600) {

        const frases =
            document.querySelectorAll(
                '.frase-animada'
            );

        frases.forEach(frase =>
            frase.remove()
        );
    }

}, 30000);

// ===============================================
// RESIZE
// ===============================================

window.addEventListener('resize', () => {

    const esMovil =
        window.innerWidth <= 600;

    const frases =
        document.querySelectorAll(
            '.frase-animada'
        );

    frases.forEach(frase => {

        if (esMovil) {

            frase.style.whiteSpace =
                'nowrap';

            frase.style.display =
                'inline-block';

        } else {

            frase.style.whiteSpace =
                'normal';

            frase.style.display =
                'block';
        }
    });
});
```
