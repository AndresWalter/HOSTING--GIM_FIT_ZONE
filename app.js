// Variables globales
let menuVisible = false;
let carrito = []; // Array para almacenar productos en el carrito

// Función que oculta o muestra el menu
function mostrarOcultarMenu(){
    if(menuVisible){
        document.getElementById("nav").classList = "";
        menuVisible = false;
    }else{
        document.getElementById("nav").classList = "responsive";
        menuVisible = true;
    }
}

function seleccionar(){
    //oculto el menu una vez que selecciono una opcion
    document.getElementById("nav").classList = "";
    menuVisible = false;
} 


// Array de productos basado en los servicios del gimnasio
const productosServicios = [
    { id: 1, nombre: "Clases de Fitness", descripcion: "Entrenamientos completos que combinan ejercicios cardiovasculares y de fuerza para mejorar tu condición física general.", precio: 50 },
    { id: 2, nombre: "Clases de Crossfit", descripcion: "Entrenamiento funcional de alta intensidad que combina gimnasia, levantamiento de pesas y ejercicios cardiovasculares.", precio: 60 },
    { id: 3, nombre: "Clases de Boxeo", descripcion: "Aprende técnicas de boxeo mientras mejoras tu condición física. Incluye entrenamiento con saco.", precio: 55 },
    { id: 4, nombre: "Clases de Enduro", descripcion: "Entrenamiento específico para mejorar tu resistencia física y mental.", precio: 45 },
    { id: 5, nombre: "Clases de Cardio", descripcion: "Sesiones intensivas focalizadas en mejorar tu capacidad cardiovascular.", precio: 40 },
    { id: 6, nombre: "Clases de Ciclismo", descripcion: "Entrenamiento en bicicleta estática con diferentes niveles de intensidad.", precio: 45 }
];

// Funciones del Carrito

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    if (contador) {
        contador.textContent = totalItems;
    } else {
        const carritoIcono = document.querySelector('.fa-cart-arrow-down');
        const nuevoContador = document.createElement('span');
        nuevoContador.id = 'contador-carrito';
        nuevoContador.textContent = totalItems;
        nuevoContador.style.cssText = `
            position: absolute;
            top: -10px;
            right: -10px;
            background: #ff1133;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 12px;
        `;
        carritoIcono.parentElement.style.position = 'relative';
        carritoIcono.parentElement.appendChild(nuevoContador);
    }
}

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
    const producto = productosServicios.find(p => p.id === productoId);
    const itemExistente = carrito.find(item => item.id === productoId);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    guardarCarrito();
    mostrarMensaje(`${producto.nombre} agregado al carrito`);
}

// Actualizar cantidad de producto
function actualizarCantidad(productoId, nuevaCantidad) {
    const item = carrito.find(item => item.id === productoId);
    if (item) {
        item.cantidad = parseInt(nuevaCantidad);
        if (item.cantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            guardarCarrito();
            mostrarCarrito(); // Actualizar vista del carrito
        }
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    guardarCarrito();
    mostrarCarrito(); // Actualizar vista del carrito
}

// Mostrar mensaje temporal
function mostrarMensaje(texto) {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-carrito';
    mensaje.textContent = texto;
    mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
    `;

    document.body.appendChild(mensaje);
    setTimeout(() => mensaje.remove(), 2000);
}

// Mostrar modal del carrito
function mostrarCarrito() {
    // Eliminar modal existente si hay uno
    const modalExistente = document.getElementById('modal-carrito');
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement('div');
    modal.id = 'modal-carrito';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;

    let contenido = '<h2>Carrito de Compras</h2>';

    if (carrito.length === 0) {
        contenido += '<p>El carrito está vacío</p>';
    } else {
        let total = 0;
        contenido += '<div class="items-carrito">';
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            contenido += `
                <div class="item-carrito" style="border-bottom: 1px solid #eee; padding: 10px 0;">
                    <h3>${item.nombre}</h3>
                    <p>Precio: $${item.precio}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <label>Cantidad: </label>
                            <input type="number" 
                            value="${item.cantidad}" 
                            min="1" 
                            tyle="width: 60px;" 
                            onchange="actualizarCantidad(${item.id}, this.value)">
                        </div>
                        <button onclick="eliminarDelCarrito(${item.id})" 
                                style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                            Eliminar
                        </button>
                    </div>
                    <p>Subtotal: $${subtotal}</p>
                </div>
            `;
        });
        contenido += `
            </div>
            <div style="margin-top: 20px; border-top: 2px solid #eee; padding-top: 10px;">
                <h3>Total: $${total}</h3>
            </div>
        `;
    }

    contenido += `
        <button onclick="document.getElementById('modal-carrito').remove();" 
        style="background: #ff1133; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 20px;">
        Cerrar
        </button>
    `;

    modal.innerHTML = contenido;
    document.body.appendChild(modal);
}

// Función para inicializar los botones de compra
function inicializarBotonesCompra() {
    document.querySelectorAll('.servicio').forEach((servicio, index) => {
        // Crear botón de compra con estilos unificados
        const botonCompra = document.createElement('button');
        botonCompra.textContent = 'Añadir';
        botonCompra.className = 'boton-compra';
        botonCompra.style.cssText = `
            background-color: #28a745;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            margin-left: 10px;
            width: 120px; // Ancho fijo para ambos botones
            height: 35px; // Alto fijo para ambos botones
        `;
        
        botonCompra.onclick = () => agregarAlCarrito(productosServicios[index].id);
        servicio.appendChild(botonCompra);
    });

    // Agregar evento click al ícono del carrito
    const iconoCarrito = document.querySelector('.fa-cart-arrow-down');
    if (iconoCarrito) {
        iconoCarrito.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarCarrito();
        });
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    inicializarBotonesCompra();
    
    // Mantener la funcionalidad original de mostrar descripciones
    const servicios = document.querySelectorAll('.servicio');
    servicios.forEach((servicio, index) => {
        const botonVerMas = document.createElement('button');
        botonVerMas.textContent = 'Ver más';
        botonVerMas.style.cssText = `
            background-color: #ff1133;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            width: 120px; // Mismo ancho que el botón de compra
            height: 35px; // Mismo alto que el botón de compra
        `;
        
        botonVerMas.addEventListener('click', () => {
            const descripcionExistente = servicio.querySelector('.descripcion-completa');
            
            if (descripcionExistente) {
                if (descripcionExistente.style.display === 'none') {
                    descripcionExistente.style.display = 'block';
                    botonVerMas.textContent = 'Ver menos';
                } else {
                    descripcionExistente.style.display = 'none';
                    botonVerMas.textContent = 'Ver más';
                }
            } else {
                const descripcion = document.createElement('p');
                descripcion.classList.add('descripcion-completa');
                descripcion.textContent = productosServicios[index].descripcion;
                descripcion.style.cssText = `
                    margin-top: 10px;
                    font-size: 0.9em;
                    color: #666;
                `;
                servicio.appendChild(descripcion);
                botonVerMas.textContent = 'Ver menos';
            }
        });
        
        servicio.appendChild(botonVerMas);
    });
});



// Mejora Seccion Galeria

function initializeGallery() {
    const galleryImages = document.querySelectorAll('.galeria .col img');
    
    galleryImages.forEach(img => {
        // Añadir estilos de transición
        img.style.cssText = `
            transition: transform 0.3s ease;
            cursor: pointer;
        `;
        
        // Eventos del mouse
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.1)';
            img.style.zIndex = '1';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            img.style.zIndex = '0';
        });
        
        //  Añadir lightbox al hacer click
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `;
            
            const imgClone = img.cloneNode();
            imgClone.style.cssText = `
                max-width: 90%;
                max-height: 90vh;
                object-fit: contain;
            `;
            
            lightbox.appendChild(imgClone);
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', () => {
                lightbox.remove();
            });
        });
    });
}

// Añadir al DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeGallery);