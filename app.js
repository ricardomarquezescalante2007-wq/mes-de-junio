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
    const esMovil = window.innerWidth <= 600;

    if (esMovil) {
        const palabras = texto.split(' ');
        palabras.forEach(palabra => {
            if (palabra.trim() !== "") {
                crearPalabraAleatoriaMovil(palabra);
            }
        });
    } else {
        crearFraseEnPantallaPC(texto);
    }
}

// NUEVA LOGICA: Las palabras se quedan fijas en el DOM corriendo en un bucle infinito de CSS
function crearPalabraAleatoriaMovil(palabra) {
    const elementoPalabra = document.createElement('div');
    elementoPalabra.classList.add('frase-animada');
    elementoPalabra.innerText = palabra;

    // Asignación inicial de posición y color fosforescente
    cambiarColorYPosicion(elementoPalabra);

    // Retraso inicial aleatorio para que no aparezcan todas al mismo tiempo al cargar
    const retraso = Math.random() * 5;
    elementoPalabra.style.animationDelay = `${retraso}s`;

    // Escucha cuando la animación termina una repetición completa (cuando opacidad es 0)
    // Justo en ese momento reubica la palabra y cambia su color para la siguiente vuelta
    elementoPalabra.addEventListener('animationiteration', () => {
        cambiarColorYPosicion(elementoPalabra);
    });

    contenedorFondo.appendChild(elementoPalabra);
}

// Función auxiliar para mover la palabra y alternar su color sin romper el flujo
function cambiarColorYPosicion(elemento) {
    // Remover clases de color anteriores para evitar acumulación
    clasesFosforo.forEach(clase => elemento.classList.remove(clase));

    // Elegir nuevo color
    const claseColorAleatorio = clasesFosforo[Math.floor(Math.random() * clasesFosforo.length)];
    elemento.classList.add(claseColorAleatorio);

    // Calcular nuevas coordenadas aleatorias
    const posicionX = Math.floor(Math.random() * 80) + 5;
    const posicionY = Math.floor(Math.random() * 80) + 5;

    elemento.style.left = `${posicionX}%`;
    elemento.style.top = `${posicionY}%`;
}

// Mantiene el flujo clásico hacia arriba para computadoras sin alteración
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
