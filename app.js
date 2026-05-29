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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ===============================================
// PALABRAS PROHIBIDAS
// ===============================================

const palabrasNegativas = [
    "pendejo", "pendeja", "cabron", "cabrona", "culero", "culera", "puta", "puto", 
    "chingar", "chingada", "chingado", "mierda", "verga", "mamon", "idiota", "imbecil", 
    "tarado", "baboso", "estupido", "pinche", "ojete", "naco", "perra", "zorra", 
    "maricon", "joto", "puñetas", "chaqueto", "puta madre", "hijo de puta", 
    "hijo de la chingada", "chinga tu madre", "vete a la verga", "no mames", 
    "fuck", "fucker", "motherfucker", "bitch", "asshole", "dumbass", "bastard"
];

// ===============================================
// FUNCIONES DE NORMALIZACIÓN
// ===============================================

function normalizarTexto(texto) {
    const reemplazos = {
        '0':'o', '1':'i', '2':'z', '3':'e', '4':'a', '5':'s', '6':'g', '7':'t', '8':'b', '9':'g',
        '@':'a', '$':'s', '!':'i', '|':'i', '+':'t', '#':'h', '%':'x', '&':'y'
    };

    texto = texto.toLowerCase()
        .split('').map(c => reemplazos[c] ?? c).join('')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z]/g, '')
        .replace(/(.)\1+/g, '$1');

    return texto;
}

function verificarMensaje(mensajeUsuario) {
    const textoLimpio = normalizarTexto(mensajeUsuario);
    for (const palabra of palabrasNegativas) {
        const palabraLimpia = normalizarTexto(palabra);
        if (textoLimpio.includes(palabraLimpia)) return true;
        const regex = new RegExp(palabraLimpia.split('').join('.*'), 'i');
        if (regex.test(textoLimpio)) return true;
    }
    return false;
}

// ===============================================
// ELEMENTOS DOM Y COLORES
// ===============================================

const formulario = document.getElementById('formulario-mensaje');
const entrada = document.getElementById('entrada-mensaje');
const mensajeError = document.getElementById('mensaje-error');
const contenedorFondo = document.getElementById('fondo-frases');
const tarjetaPrincipal = document.querySelector('.contenedor-principal');
const btnAbrirFormulario = document.getElementById('btn-abrir-formulario');

const colores = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];

// ===============================================
// LÓGICA DE FORMULARIO
// ===============================================

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const textoMensaje = entrada.value.trim();

    if (textoMensaje === "") {
        mensajeError.innerText = "Escribe un mensaje";
        mensajeError.classList.remove('oculto');
        return;
    }

    const caracteresInvalidos = /[0-9@#$%^&*()_\-+=\[\]{};:'"<>/?\\|`~]/;
    if (caracteresInvalidos.test(textoMensaje)) {
        mensajeError.innerText = "No se permiten números ni caracteres especiales";
        mensajeError.classList.remove('oculto');
        return;
    }

    if (verificarMensaje(textoMensaje)) {
        mensajeError.innerText = "No se permiten palabras ofensivas";
        mensajeError.classList.remove('oculto');
        return;
    }

    mensajeError.classList.add('oculto');
    database.ref('frases').push({ texto: textoMensaje, timestamp: Date.now() });
    entrada.value = '';
    
    tarjetaPrincipal.classList.add('deslizar-ocultar');
    setTimeout(() => btnAbrirFormulario.classList.remove('oculto'), 400);
});

btnAbrirFormulario.addEventListener('click', () => {
    btnAbrirFormulario.classList.add('oculto');
    tarjetaPrincipal.classList.remove('deslizar-ocultar');
    tarjetaPrincipal.classList.add('deslizar-mostrar');
});

// ===============================================
// RENDERIZADO DE FRASES (UNIFICADO)
// ===============================================

database.ref('frases').on('child_added', (snapshot) => {
    crearFrase(snapshot.val().texto);
});

function crearFrase(texto) {
    const elemento = document.createElement('div');
    elemento.classList.add('frase-animada');
    
    // Posicionamiento absoluto forzado
    elemento.style.position = 'absolute';
    elemento.style.left = `${Math.floor(Math.random() * 70) + 5}%`;
    elemento.style.top = `${Math.floor(Math.random() * 80) + 5}%`;
    elemento.style.cursor = 'default';
    
    // Colores aleatorios por letra
    elemento.innerHTML = texto.split('').map(letra => {
        const color = colores[Math.floor(Math.random() * colores.length)];
        return `<span style="color:${color}; font-weight:bold; font-size:1.2rem;">${letra}</span>`;
    }).join('');

    contenedorFondo.appendChild(elemento);

    // Auto-limpieza después de 15 segundos
    setTimeout(() => elemento.remove(), 15000);
}
