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
// LISTA DE PALABRAS PROHIBIDAS
// ===============================================

const palabrasNegativas = [
    "pendejo", "pendeja", "pendejadas", "cabron", "cabrona", "culero", "culera", "puta", "puto", 
    "chingar", "chingada", "chingado", "chingon", "chingona", "mierda", "mierdero", "verga", 
    "verguero", "mamon", "mamona", "idiota", "imbecil", "tarado", "baboso", "estupido", 
    "estupida", "pinche", "ojete", "naco", "naca", "perra", "zorra", "maricon", "joto", 
    "puñetas", "chaqueto", "pito", "pija", "polla", "coño", "cagar", "cagado", "culiado", 
    "culeado", "vagina", "penis", "wey", "guey", "follar", "follando", "panocha", "joder", 
    "jodido", "jodida", "chingadamadre", "mierdoso", "idiotez", "bastardo", "malparido", 
    "malparida", "careverga", "hijueputa", "putamadre", "putero", "putera", "ano", "nalgas", 
    "tetas", "chichis", "vergazo", "culon", "culona", "panochon", "pelado", "pelada", 
    "fuck", "fucker", "motherfucker", "bitch", "asshole", "dumbass", "bastard", "cunt", 
    "shit", "dick", "cock", "pussy", "wanker", "faggot", "nigger", "dickhead", "twat", 
    "piss", "slut", "whore", "cum", "semen", "garchado", "garchada", "boludo", "pelotudo"
];

const colores = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];

// ===============================================
// LÓGICA DE VALIDACIÓN Y NORMALIZACIÓN
// ===============================================

function normalizarTexto(texto) {
    const reemplazos = { '0':'o', '1':'i', '2':'z', '3':'e', '4':'a', '5':'s', '6':'g', '7':'t', '8':'b', '9':'g' };
    let textoProcesado = texto.toLowerCase();
    for (const char in reemplazos) {
        textoProcesado = textoProcesado.split(char).join(reemplazos[char]);
    }
    return textoProcesado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function verificarMensaje(texto) {
    const palabrasUsuario = normalizarTexto(texto).split(/\s+/);
    for (const palabra of palabrasUsuario) {
        if (palabrasNegativas.includes(palabra)) return true;
    }
    return false;
}

// ===============================================
// LÓGICA DE FORMULARIO
// ===============================================

const formulario = document.getElementById('formulario-mensaje');
const entrada = document.getElementById('entrada-mensaje');
const mensajeError = document.getElementById('mensaje-error');
const contenedorFondo = document.getElementById('fondo-frases');
const tarjetaPrincipal = document.querySelector('.contenedor-principal');
const btnAbrirFormulario = document.getElementById('btn-abrir-formulario');

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = entrada.value.trim();

    if (texto === "") {
        mensajeError.innerText = "Escribe un mensaje";
        mensajeError.classList.remove('oculto');
        return;
    }

    if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(texto)) {
        mensajeError.innerText = "No se permiten números ni caracteres especiales, solo letras";
        mensajeError.classList.remove('oculto');
        return;
    }

    if (verificarMensaje(texto)) {
        mensajeError.innerText = "Esta palabra no está permitida, solo se permiten frases motivadoras";
        mensajeError.classList.remove('oculto');
        return;
    }

    mensajeError.classList.add('oculto');
    database.ref('frases').push({ texto: texto, timestamp: Date.now() });
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
// RENDERIZADO MEJORADO PARA EVITAR AMONTONAMIENTO
// ===============================================

database.ref('frases').on('child_added', (snapshot) => {
    crearFrase(snapshot.val().texto);
});

function crearFrase(texto) {
    const elemento = document.createElement('div');
    elemento.className = 'frase-animada';
    
    // Posicionamiento aleatorio disperso
    elemento.style.position = 'absolute';
    elemento.style.left = `${Math.random() * 80}%`;
    elemento.style.top = `${Math.random() * 80}%`;
    elemento.style.whiteSpace = 'nowrap';
    elemento.style.transition = 'opacity 1s ease';
    elemento.style.opacity = '0';
    
    elemento.innerHTML = texto.split('').map(letra => {
        const color = colores[Math.floor(Math.random() * colores.length)];
        return `<span style="color:${color}; font-weight:bold; font-size:1.2rem; margin: 0 2px;">${letra}</span>`;
    }).join('');

    contenedorFondo.appendChild(elemento);
    
    // Fade in
    requestAnimationFrame(() => { elemento.style.opacity = '1'; });
    
    // Desaparece después de 12 segundos
    setTimeout(() => {
        elemento.style.opacity = '0';
        setTimeout(() => elemento.remove(), 1000);
    }, 12000);
}
