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

// Función para validar si la frase es positiva
function esFrasePositiva(texto) {
    const textoMinusculas = texto.toLowerCase();
    // Verifica si alguna palabra de la lista negra está en el texto
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
        // Mostrar error si la frase contiene palabras negativas
        mensajeError.classList.remove('oculto');
    }
});

// Escuchar la base de datos en tiempo real
// Cada vez que se añade un nodo a 'frases', se ejecuta esta función para todos los usuarios
database.ref('frases').on('child_added', (snapshot) => {
    const datos = snapshot.val();
    crearFraseEnPantalla(datos.texto);
});

// Función para crear el elemento HTML de la frase y añadirlo al fondo
function crearFraseEnPantalla(texto) {
    const elementoFrase = document.createElement('div');
    elementoFrase.classList.add('frase-animada');
    elementoFrase.innerHTML = crearColoresFosforecentes(texto); // Aplicar colores fosforescentes a cada letra

    // Posición horizontal aleatoria (entre 5% y 85% para evitar cortes en los bordes)
    const posicionX = Math.floor(Math.random() * 80) + 5;
    elementoFrase.style.left = `${posicionX}%`;

    // Retraso aleatorio en la animación para que no salgan todas simétricas si entran juntas
    const retraso = Math.random() * 2;
    elementoFrase.style.animationDelay = `${retraso}s`;

    contenedorFondo.appendChild(elementoFrase);

    // Eliminar el elemento del DOM una vez termine la animación CSS (12 segundos)
    setTimeout(() => {
        elementoFrase.remove();
    }, 14000); 
}

// funcion para eliminar frases antiguas cada cierto tiempo (opcional, para evitar saturar el fondo)
setInterval(() => {
    const frases = document.querySelectorAll('.frase-animada');
    frases.forEach(frase => frase.remove());
}, 6000000000); // Eliminar frases cada 6000000000 segundos

//funcion para que cada palabra tenga un resalto diferente (opcional, para hacer el fondo más colorido)
function resaltarPalabras(texto) {
    const palabras = texto.split(' ');
    return palabras.map(palabra => {
        const colores = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        return `<span style="color: ${colorAleatorio}; font-weight: bold;">${palabra}</span>`;
    }).join(' ');
}

//funcion para crear colores fosforecentes en cada palabra (opcional, para hacer el fondo más colorido)
function crearColoresFosforecentes(texto) {
    const colores = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];
    return texto.split('').map(letra => {
        const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
        return `<span style="color: ${colorAleatorio}; font-weight: bold;">${letra}</span>`;
    }).join('');
}


