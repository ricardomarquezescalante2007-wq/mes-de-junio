// Configuración de Firebase con tus credenciales reales
const firebaseConfig = {
    apiKey: "AIzaSyCWOSCmwXJkCucciMvrCi4kKcdSbUJ2bno",
    authDomain: "muro-mensajes-positivos.firebaseapp.com",
    databaseURL: "https://muro-mensajes-positivos-default-rtdb.firebaseio.com",
    projectId: "muro-mensajes-positivos",
    storageBucket: "muro-mensajes-positivos.appspot.com",
    messagingSenderId: "550796933344",
    appId: "1:550796933344:web:b2bd6f438e9a3c3dbd7885"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Tu lista base se mantiene limpia y manejable
// ===============================================
// FILTRO AVANZADO DE GROSERÍAS Y EVASIONES
// ===============================================

// LISTA DE PALABRAS Y FRASES OFENSIVAS
const palabrasNegativas = [

    // insultos comunes
    "pendejo", "pendeja", "pendejos", "pendejas",
    "cabron", "cabrona", "cabrones",
    "culero", "culera", "culeros",
    "puta", "puto", "putas", "putos",
    "chingar", "chingada", "chingado", "chingados",
    "mierda", "mierdas",
    "verga", "vergas",
    "mamon", "mamona", "mamones",
    "idiota", "idiotas",
    "imbecil", "imbeciles",
    "tarado", "tarada",
    "baboso", "babosa",
    "estupido", "estupida",
    "asco",
    "culo",
    "cagar",
    "cagada",
    "cagado",
    "meco", "mecos",
    "riata",
    "pito",
    "pinche",
    "ojete",
    "hocicon",
    "naco",
    "perra",
    "zorra",
    "maricon",
    "maricones",
    "joto",
    "jotos",
    "puñetas",
    "chaqueto",
    "gay",
    "lesbiana",

    // frases ofensivas
    "puta madre",
    "hijo de puta",
    "hijo de la chingada",
    "chinga tu madre",
    "vete a la verga",
    "vete al diablo",
    "me vale madre",
    "no mames",
    "valeverga",
    "valemadre",
    "chingatumadre",
    "hijodeputa",
    "hijodelachingada",
    "maldita sea",
    "maldito cabron",
    "maldito pendejo",
    "maldito culero",
    "te voy a matar",

    // inglés
    "fuck",
    "fucker",
    "motherfucker",
    "bitch",
    "asshole",
    "piece of shit",
    "dumbass",
    "son of a bitch",
    "bastard",
    "jerk",
    "moron",
    "loser",
    "dickhead",
    "prick",
    "scumbag",
    "creep",
    "pervert",
    "pig"
];

// ===============================================
// REEMPLAZOS DE LETRAS, NÚMEROS Y SÍMBOLOS
// ===============================================

const reemplazos = {

    // números
    '0': 'o',
    '1': 'i',
    '2': 'z',
    '3': 'e',
    '4': 'a',
    '5': 's',
    '6': 'g',
    '7': 't',
    '8': 'b',
    '9': 'g',

    // símbolos
    '@': 'a',
    '$': 's',
    '+': 't',
    '!': 'i',
    '|': 'i',
    '#': 'h',
    '%': 'x',
    '&': 'y',
    '*': '',
    '_': '',
    '-': '',
    '.': '',
    ',': '',
    ';': '',
    ':': '',
    '(': '',
    ')': '',
    '[': '',
    ']': '',
    '{': '',
    '}': '',
    '=': '',
    '?': '',
    '¿': '',
    '¡': '',
    '/': '',
    '\\': '',
    '"': '',
    "'": '',
    '<': '',
    '>': ''
};

// ===============================================
// FUNCIÓN PARA NORMALIZAR TEXTO
// ===============================================

function normalizarTexto(texto) {

    texto = texto.toLowerCase();

    // sustituir números y símbolos
    texto = texto
        .split('')
        .map(caracter => reemplazos[caracter] || caracter)
        .join('');

    // eliminar acentos
    texto = texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // eliminar cualquier caracter raro
    texto = texto.replace(/[^a-z]/g, '');

    // reducir letras repetidas
    // ej: puuuutooo => puto
    texto = texto.replace(/(.)\1+/g, '$1');

    return texto;
}

// ===============================================
// FUNCIÓN PRINCIPAL
// ===============================================

function verificarMensaje(mensajeUsuario) {

    const textoLimpio = normalizarTexto(mensajeUsuario);

    // revisar lista normal
    const contieneGroseria = palabrasNegativas.some(palabra => {

        const palabraLimpia = normalizarTexto(palabra);

        return textoLimpio.includes(palabraLimpia);
    });

    // revisar patrones regex avanzados
    const patrones = [

        /p+e+n+d+e+j+o+/,
        /c+a+b+r+o+n+/,
        /c+h+i+n+g+a+/,
        /v+e+r+g+a+/,
        /p+u+t+o+/,
        /m+i+e+r+d+a+/,
        /c+u+l+e+r+o+/,
        /m+a+m+o+n+/,
        /i+d+i+o+t+a+/,
        /f+u+c+k+/,
        /b+i+t+c+h+/,
        /a+s+s+h+o+l+e+/,
        /m+o+t+h+e+r+f+u+c+k+e+r+/
    ];

    const contieneRegex = patrones.some(regex =>
        regex.test(textoLimpio)
    );

    return contieneGroseria || contieneRegex;
}

// ===============================================
// PRUEBAS
// ===============================================

const pruebas = [

    "Eres un pendejo",
    "Eres un p3nd3j0",
    "C@br0n",
    "vete a la v3rg4",
    "No m@m3s",
    "M.I.E.R.D.A",
    "puuuuutoooo",
    "Ch1ng4 tu m4dr3",
    "motherfucker",
    "f.u.c.k",
    "assh0le",
    "pppeeennndeeejooo",
    "c h i n g a d a",
    "v e r g a",
    "p#t0",
    "idi0t4",
    "b1tch",
    "dumb4ss"
];

// ===============================================
// RESULTADOS
// ===============================================

pruebas.forEach(texto => {

    console.log(
        `"${texto}" =>`,
        verificarMensaje(texto)
    );

});
// Elementos del DOM
const formulario = document.getElementById('formulario-mensaje');
const entrada = document.getElementById('entrada-mensaje');
const mensajeError = document.getElementById('mensaje-error');
const contenedorFondo = document.getElementById('fondo-frases');
const tarjetaPrincipal = document.querySelector('.contenedor-principal');
const btnAbrirFormulario = document.getElementById('btn-abrir-formulario');

// Clases de colores fosforescentes declaradas en el CSS
const clasesFosforo = ['fosforo-verde', 'fosforo-rosa', 'fosforo-azul', 'fosforo-amarillo', 'fosforo-naranja'];

// Función para validar si la frase es positiva
function esFrasePositiva(texto) {
    const textoMinusculas = texto.toLowerCase();
    return !palabrasNegativas.some(palabra => textoMinusculas.includes(palabra));
}

// Escuchar el envío del formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const textoMensaje = entrada.value.trim();

    if (esFrasePositiva(textoMensaje)) {
        mensajeError.classList.add('oculto');
        
        // Guardar en la base de datos de Firebase
        database.ref('frases').push({
            texto: textoMensaje,
            timestamp: Date.now()
        });

        entrada.value = ''; // Limpiar el campo

        // ANIMACIÓN: Ocultar la tarjeta hacia la derecha y mostrar el botón de reapertura
        tarjetaPrincipal.classList.remove('deslizar-mostrar');
        tarjetaPrincipal.classList.add('deslizar-ocultar');
        
        // El botón aparece suavemente después de que la tarjeta se desliza
        setTimeout(() => {
            btnAbrirFormulario.classList.remove('oculto');
        }, 400);

    } else {
        mensajeError.classList.remove('oculto');
    }
});

// Evento para volver a mostrar la tarjeta al presionar el botón de abajo
btnAbrirFormulario.addEventListener('click', () => {
    btnAbrirFormulario.classList.add('oculto');
    tarjetaPrincipal.classList.remove('deslizar-ocultar');
    tarjetaPrincipal.classList.add('deslizar-mostrar');
});

// Escuchar la base de datos en tiempo real
database.ref('frases').on('child_added', (snapshot) => {
    const datos = snapshot.val();
    procesarDistribuciónFrase(datos.texto);
});

// Decide cómo pintar la frase según el dispositivo
function procesarDistribuciónFrase(texto) {
    const esMovil = window.innerWidth <= 600;

    if (esMovil) {
        // Filtro para saltarse los residuos/palabras sueltas antiguas de la base de datos
        if (texto.trim() !== "" && texto.includes(' ')) {
            crearFraseAleatoriaMovil(texto);
        }
    } else {
        crearFraseEnPantallaPC(texto);
    }
}

// Lógica para pantallas móviles (Frase completa e infinita)
function crearFraseAleatoriaMovil(fraseCompleta) {
    const elementoFrase = document.createElement('div');
    elementoFrase.classList.add('frase-animada');
    elementoFrase.innerText = fraseCompleta;
    
    elementoFrase.style.whiteSpace = 'nowrap';
    elementoFrase.style.display = 'inline-block';

    cambiarColorYPosicion(elementoFrase);

    const retraso = Math.random() * 5;
    elementoFrase.style.animationDelay = `${retraso}s`;

    elementoFrase.addEventListener('animationiteration', () => {
        cambiarColorYPosicion(elementoFrase);
    });

    contenedorFondo.appendChild(elementoFrase);
}

function cambiarColorYPosicion(elemento) {
    clasesFosforo.forEach(clase => elemento.classList.remove(clase));

    const claseColorAleatorio = clasesFosforo[Math.floor(Math.random() * clasesFosforo.length)];
    elemento.classList.add(claseColorAleatorio);

    const posicionX = Math.floor(Math.random() * 45) + 5; // Ajuste horizontal prudente
    const posicionY = Math.floor(Math.random() * 80) + 5;

    elemento.style.left = `${posicionX}%`;
    elemento.style.top = `${posicionY}%`;
}

// Mantiene el flujo clásico para computadoras
function crearFraseEnPantallaPC(texto) {
    const elementoFrase = document.createElement('div');
    elementoFrase.classList.add('frase-animada');
    elementoFrase.innerHTML = crearColoresLetrasPC(texto);

    const posicionX = Math.floor(Math.random() * 80) + 5;
    elementoFrase.style.left = `${posicionX}%`;

    const retraso = Math.random() * 2;
    elementoFrase.style.animationDelay = `${retraso}s`;

    contenedorFondo.appendChild(elementoFrase);

    setTimeout(() => {
        elementoFrase.remove();
    }, 14000); 
}

function crearColoresLetrasPC(texto) {
    const colores = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];
    return texto.split('').map(letra => {
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        return `<span style="color: ${colorAleatorio}; font-weight: bold;">${letra}</span>`;
    }).join('');
}

// Limpieza general automática despues de 10 minutos para evitar acumulación excesiva de elementos en el DOM, especialmente en móviles
setInterval(() => {
    const frases = document.querySelectorAll('.frase-animada');
    frases.forEach(frase => frase.remove());
}, 600000); // 600000 ms = 10 minutos

// desamontonar las frases en móviles cada 30 segundos para evitar superposición excesiva
setInterval(() => {
    if (window.innerWidth <= 600) {
        const frases = document.querySelectorAll('.frase-animada');
        frases.forEach(frase => frase.remove());
    }
}, 30000); // 30000 ms = 30 segundos

// Escuchar cambios de tamaño para ajustar la visualización en tiempo real
window.addEventListener('resize', () => {
    const esMovil = window.innerWidth <= 600;
    const frases = document.querySelectorAll('.frase-animada');
    frases.forEach(frase => {
        if (esMovil) {
            frase.style.whiteSpace = 'nowrap';  
            frase.style.display = 'inline-block';
        } else {
            frase.style.whiteSpace = 'normal';  
            frase.style.display = 'block';
        }   
    });
});
