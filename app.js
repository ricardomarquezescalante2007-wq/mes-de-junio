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

// Lista negra básica para el filtro de negatividad
const palabrasNegativas = ["odiar", "tonto", "feo", "basura", "malo", "estupido", "morir", "asco"];

// Elementos del DOM
const formulario = document.getElementById('formulario-mensaje');
const entrada = document.getElementById('entrada-mensaje');
const mensajeError = document.getElementById('mensaje-error');
const contenedorFondo = document.getElementById('fondo-frases');

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
    } else {
        mensajeError.classList.remove('oculto');
    }
});

// Escuchar la base de datos en tiempo real
database.ref('frases').on('child_added', (snapshot) => {
    const datos = snapshot.val();
    procesarDistribuciónFrase(datos.texto);
});

// Decide cómo pintar la frase según el dispositivo
function procesarDistribuciónFrase(texto) {
    // Detecta si es pantalla móvil basándose en los 600px del Media Query de CSS
    const esMovil = window.innerWidth <= 600;

    if (esMovil) {
        // Separa por palabras individuales
        const palabras = texto.split(' ');
        palabras.forEach(palabra => {
            if (palabra.trim() !== "") {
                crearPalabraAleatoriaMovil(palabra);
            }
        });
    } else {
        // Comportamiento por defecto para PC
        crearFraseEnPantallaPC(texto);
    }
}

// NUEVA FUNCIÓN: Distribuye palabras individuales en lugares random con colores fosforescentes (Móviles)
function crearPalabraAleatoriaMovil(palabra) {
    const elementoPalabra = document.createElement('div');
    elementoPalabra.classList.add('frase-animada');
    elementoPalabra.innerText = palabra;

    // Asigna un color fosforescente aleatorio desde las clases CSS
    const claseColorAleatorio = clasesFosforo[Math.floor(Math.random() * clasesFosforo.length)];
    elementoPalabra.classList.add(claseColorAleatorio);

    // Posición X e Y aleatorias restringidas entre 5% y 85% para que no se corten en los bordes físicos del teléfono
    const posicionX = Math.floor(Math.random() * 80) + 5;
    const posicionY = Math.floor(Math.random() * 80) + 5;

    elementoPalabra.style.left = `${posicionX}%`;
    elementoPalabra.style.top = `${posicionY}%`;

    // Variación pequeña en los tiempos de animación para romper la sincronía
    const retraso = Math.random() * 1.5;
    elementoPalabra.style.animationDelay = `${retraso}s`;

    contenedorFondo.appendChild(elementoPalabra);

    // Se elimina tras 4 segundos siguiendo el ciclo de la animación CSS 'aparecerFosforo'
    setTimeout(() => {
        elementoPalabra.remove();
    }, 4500);
}

// FUNCIÓN ORIGINAL ADAPTADA: Mantiene el flujo clásico hacia arriba para computadoras
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

// Mantiene los colores por letra tradicionales exclusivamente para la vista de PC
function crearColoresLetrasPC(texto) {
    const colores = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];
    return texto.split('').map(letra => {
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        return `<span style="color: ${colorAleatorio}; font-weight: bold;">${letra}</span>`;
    }).join('');
}

// Limpieza automática preventiva del fondo
setInterval(() => {
    const frases = document.querySelectorAll('.frase-animada');
    frases.forEach(frase => frase.remove());
}, 600000);
