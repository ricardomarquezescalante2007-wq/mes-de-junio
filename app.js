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
const palabrasNegativas = [
    "malo", "horrible", "feo", "terrible", "odioso", "desagradable", "horrendo", "asqueroso",
    "maldito", "pésimo", "decepcionante", "desastroso", "nefasto", "lamentable", "tonto", "basura", "estupido", "morir", "asco",
    "pendejo", "pendeja", "pendejos", "pendejas",
    "chingar", "chingada", "chingado", "chingaderas", "chingon", "chingo",
    "cabron", "cabrona", "cabrones",
    "culero", "culera", "culeros", "culo",
    "mierda", "mierdas", "cagado", "cagar", "cagada",
    "puto", "puta", "putitos", "putitas", "putazos",
    "pito", "verga", "vergas", "riata", "meco", "mecos",
    "mamon", "mamona", "mamar", "mamadas",
    "buey", "guey", "wey",
    "bobo", "boba", "tarado", "tarada", "idiota", "idiotas",
    "imbecil", "imbeciles", "baboso", "babosa",
    "bitch", "shit", "fuck", "haypendejo", "hay pendejo", "hay pendeja", "hay cabron", "hay cabrona", "hay culero", "hay culera", "hay mierda", "hay puto", "hay puta", "hay verga", "hay mamon", "hay mamona", "hay buey", "hay guey", "hay wey", "hay bobo", "hay boba", "hay tarado", "hay tarada", "hay idiota", "hay idiotas",
    "hay imbecil", "hay imbeciles", "hay baboso", "hay babosa", "gay", "lesbiana", "maricon", "maricón", "maricones", "mariconas",
    "puta madre", "puta que te pario", "hijo de puta", "hijo de la chingada", "cabrón de mierda", "pendejo de mierda", "culero de mierda", "chingada madre", "chingada que te pario", "chingada tu madre",
    "maldita sea", "maldita madre", "maldito sea", "maldito hijo de puta", "maldito cabrón", "maldito pendejo", "maldito culero", "maldita chingada",
    "te voy a matar", "te voy a matar hijo de puta", "te voy a matar cabrón", "te voy a matar pendejo", "te voy a matar culero", "te voy a matar mierda",
    //frases en ingles ofensibas
    "you are an idiot", "you are a moron", "you are a fool", "you are stupid", "you are dumb", "you are a jerk", "you are a loser", "you are a piece of shit"
    , "you are a   bitch", "you are a fucker", "you are a motherfucker", "you are a son of a   bitch", "you are a bastard", "you are a douchebag", "you are a prick", "you are a   dickhead", "you are a pussy", "you are a wimp", "you are a weakling", "you are a scumbag", "you are a creep", "you are a pervert", "you are a pig",
    "you are a"
    // Agrega más palabras según sea necesario
];

// Función para transformar los intentos de evasión a texto plano
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        // Reemplaza números comunes de leetspeak por letras
        .replace(/4/g, 'a')
        .replace(/3/g, 'e')
        .replace(/1/g, 'i')
        .replace(/0/g, 'o')
        .replace(/5/g, 's')
        .replace(/7/g, 't')
        .replace(/8/g, 'b')
        // Reemplaza símbolos que imitan letras
        .replace(/@/g, 'a')
        .replace(/\$/g, 's')
        // Elimina acentos y diéresis
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        // Elimina puntos, espacios intermedios, guiones y cualquier carácter especial para juntar las letras
        .replace(/[^a-z]/g, "");
}

// funcion para remplazar simbolos en palabras de ingles ofensivas
function normalizarTextoIngles(texto) {
    return texto
        .toLowerCase()
        // Reemplaza números comunes de leetspeak por letras
        .replace(/4/g, 'a')
        .replace(/3/g, 'e')
        .replace(/1/g, 'i')
        .replace(/0/g, 'o')
        .replace(/5/g, 's')
        .replace(/7/g, 't')
        .replace(/8/g, 'b')
        // Reemplaza símbolos que imitan letras
        .replace(/@/g, 'a')
        .replace(/\$/g, 's')
        // Elimina acentos y diéresis
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        // Elimina puntos, espacios intermedios, guiones y cualquier carácter especial para juntar las letras
        .replace(/[^a-z]/g, "");
}

// Ejemplo de uso:
function verificarMensaje(mensajeUsuario) {
    const textoLimpio = normalizarTexto(mensajeUsuario);
    
    // Verifica si alguna de las palabras prohibidas está contenida en el texto procesado
    const contieneGroseria = palabrasNegativas.some(palabra => {
        const palabraLimpia = normalizarTexto(palabra);
        return textoLimpio.includes(palabraLimpia);
    });

    return contieneGroseria;
}

// Pruebas que el sistema detectará con éxito:
console.log(verificarMensaje("Eres un p3nd3j0")); // true (Detecta pendejo)
console.log(verificarMensaje("M.I.E.R.D.A"));     // true (Detecta mierda)
console.log(verificarMensaje("C@br0n"));         // true (Detecta cabron)

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

// Limpieza general automática
setInterval(() => {
    const frases = document.querySelectorAll('.frase-animada');
    frases.forEach(frase => frase.remove());
}, 600000);

//animacion de los mensajes en el movil desbanescando y apareciendo suavemente
