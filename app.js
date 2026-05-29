// Configuración de Firebase
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

// Elementos del DOM
const formulario = document.getElementById('formulario-mensaje');
const entrada = document.getElementById('entrada-mensaje');
const contenedorCentrado = document.querySelector('.contenedor-centrado');
const btnAbrir = document.getElementById('btn-abrir-formulario');
const fondoFrases = document.getElementById('fondo-frases');

// Evento de envío del formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = entrada.value.trim();
    
    if (!texto) return;

    // Guardar en Firebase
    database.ref('frases').push({ 
        texto: texto, 
        timestamp: Date.now() 
    });

    entrada.value = '';
    
    // Ocultar la tarjeta y mostrar el botón
    contenedorCentrado.classList.add('oculto');
    btnAbrir.classList.remove('oculto');
});

// Evento para reabrir la tarjeta
btnAbrir.addEventListener('click', () => {
    contenedorCentrado.classList.remove('oculto');
    btnAbrir.classList.add('oculto');
});

// Función para crear y animar frases en el fondo
function crearFrase(texto) {
    const el = document.createElement('div');
    el.className = 'frase-animada';
    
    // Posición aleatoria dentro de la pantalla
    el.style.left = `${10 + Math.random() * 70}%`;
    el.style.top = `${10 + Math.random() * 70}%`;
    
    el.innerHTML = `<span>${texto}</span>`;
    fondoFrases.appendChild(el);
    
    // Animación de entrada y salida
    setTimeout(() => {
        el.style.opacity = '1';
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 1500);
        }, 8000);
    }, 100);
}

// Escuchar nuevas frases en tiempo real
database.ref('frases').on('child_added', (snap) => {
    crearFrase(snap.val().texto);
});
