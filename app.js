// ===============================================
// RENDERIZADO CONSTANTE Y DISPERSO
// ===============================================

database.ref('frases').on('child_added', (snapshot) => {
    crearFrase(snapshot.val().texto);
});

function crearFrase(texto) {
    const elemento = document.createElement('div');
    elemento.className = 'frase-animada';
    
    // Posicionamiento calculado para usar toda el área visible
    elemento.style.position = 'absolute';
    // Se asegura que aparezcan en cualquier punto, evitando que se corten en los bordes
    elemento.style.left = `${Math.random() * 85}%`;
    elemento.style.top = `${Math.random() * 85}%`;
    elemento.style.whiteSpace = 'nowrap';
    elemento.style.transition = 'opacity 1.5s ease';
    elemento.style.opacity = '0';
    elemento.style.zIndex = '100'; // Asegura que estén sobre otros elementos
    
    elemento.innerHTML = texto.split('').map(letra => {
        const color = colores[Math.floor(Math.random() * colores.length)];
        return `<span style="color:${color}; font-weight:bold; font-size:1.4rem; margin: 0 1px;">${letra}</span>`;
    }).join('');

    contenedorFondo.appendChild(elemento);
    
    // Aparece suavemente
    requestAnimationFrame(() => { elemento.style.opacity = '1'; });
    
    // Se mantiene 10 segundos y se desvanece
    setTimeout(() => {
        elemento.style.opacity = '0';
        setTimeout(() => elemento.remove(), 2000);
    }, 10000);
}
