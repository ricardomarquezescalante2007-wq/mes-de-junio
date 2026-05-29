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
// LÓGICA DE VALIDACIÓN
// ===============================================
const palabrasNegativas = ["pendejo", "pendeja", "cabron", "puta", "puto", "chingar", "mierda", "verga", "idiota", "estupido"];

function verificarYNormalizar(texto) {
    const reemplazos = {'0':'o', '1':'i', '2':'z', '3':'e', '4':'a', '5':'s', '6':'g', '7':'t', '8':'b', '9':'g'};
    let limpio = texto.toLowerCase();
    for (const char in reemplazos) limpio = limpio.split(char).join(reemplazos[char]);
    limpio = limpio.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const palabras = limpio.split(/\s+/);
    return palabras.some(p => palabrasNegativas.includes(p));
}

// ===============================================
// MANEJO DEL DOM Y FORMULARIO
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

    if (!texto) return;
    if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(texto)) {
        mensajeError.innerText = "Solo se permiten letras";
        mensajeError.classList.remove('oculto');
        return;
    }
    if (verificarYNormalizar(texto)) {
        mensajeError.innerText = "Frase no permitida";
        mensajeError.classList.remove('oculto');
        return;
    }

    database.ref('frases').push({ texto: texto, timestamp: Date.now() });
    entrada.value = '';
    mensajeError.classList.add('oculto');
    tarjetaPrincipal.classList.add('deslizar-ocultar');
    setTimeout(() => btnAbrirFormulario.classList.remove('oculto'), 400);
});

btnAbrirFormulario.addEventListener('click', () => {
    btnAbrirFormulario.classList.add('oculto');
    tarjetaPrincipal.classList.remove('deslizar-ocultar');
    tarjetaPrincipal.classList.add('deslizar-mostrar');
});

// ===============================================
// RENDERIZADO DE FRASES
// ===============================================
function crearFrase(texto) {
    const el = document.createElement('div');
    el.className = 'frase-animada';
    el.style.left = `${Math.random() * 80}%`;
    el.style.top = `${Math.random() * 80}%`;
    el.innerHTML = `<span>${texto}</span>`;
    contenedorFondo.appendChild(el);
    
    setTimeout(() => {
        el.style.opacity = '1';
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 1500);
        }, 8000);
    }, 100);
}

database.ref('frases').on('child_added', (snap) => crearFrase(snap.val().texto));

// Bucle para frases históricas
database.ref('frases').once('value', (snap) => {
    const frases = Object.values(snap.val() || {}).map(o => o.texto);
    if (frases.length > 0) {
        setInterval(() => crearFrase(frases[Math.floor(Math.random() * frases.length)]), 8000);
    }
});
