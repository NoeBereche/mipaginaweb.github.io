const botones = document.querySelectorAll('#menuCategorias .nav-link');
const tarjetas = document.querySelectorAll('[data-categoria]');

function mezclar() {
    if (tarjetas.length === 0) {
        return;
    }

    const fila = tarjetas[0].parentElement;
    const lista = Array.from(tarjetas);

    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }

    lista.forEach(function (t) {
        fila.appendChild(t);
    });
}

mezclar();

botones.forEach(function (boton) {
    boton.addEventListener('click', function (e) {
        e.preventDefault();

        botones.forEach(function (b) {
            b.classList.remove('active');
        });
        boton.classList.add('active');

        const filtro = boton.dataset.filtro;

        if (filtro === 'todos') {
            mezclar();
        }

        tarjetas.forEach(function (t) {
            if (filtro === 'todos' || t.dataset.categoria === filtro) {
                t.classList.remove('d-none');
            } else {
                t.classList.add('d-none');
            }
        });
    });
}); 

// ----- PEDIDO -----
const CLAVE = 'carritoSantaRosa';
const cajaCarrito = document.getElementById('carrito');
const listaCarrito = document.getElementById('carritoLista');
const totalCarrito = document.getElementById('carritoTotal');

let carrito = JSON.parse(localStorage.getItem(CLAVE)) || [];

function mostrarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach(function (item, indice) {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML =
            '<div class="d-flex justify-content-between">' +
                '<strong>' + item.nombre + '</strong>' +
                '<span>S/ ' + subtotal.toFixed(2) + '</span>' +
            '</div>' +
            '<small class="text-muted">' + item.presentacion + ' - S/ ' + item.precio.toFixed(2) + '</small>' +
            '<div class="d-flex align-items-center gap-2 mt-1">' +
                '<button type="button" class="btn btn-sm btn-outline-secondary" data-accion="menos" data-indice="' + indice + '">-</button>' +
                '<span>' + item.cantidad + '</span>' +
                '<button type="button" class="btn btn-sm btn-outline-secondary" data-accion="mas" data-indice="' + indice + '">+</button>' +
                '<button type="button" class="btn btn-sm btn-outline-danger ms-auto" data-accion="quitar" data-indice="' + indice + '">Quitar</button>' +
            '</div>';
        listaCarrito.appendChild(li);
    });

    totalCarrito.textContent = 'S/ ' + total.toFixed(2);
    cajaCarrito.classList.toggle('d-none', carrito.length === 0);
    localStorage.setItem(CLAVE, JSON.stringify(carrito));
}

document.addEventListener('click', function (e) {
    const boton = e.target.closest('.btn-pedir');
    if (!boton) {
        return;
    }

    const producto = productos.find(function (p) {
        return p.nombre === boton.dataset.nombre;
    });

    if (!producto) {
        console.warn('No encontré en dato.js:', boton.dataset.nombre);
        return;
    }

    const existente = carrito.find(function (item) {
        return item.nombre === producto.nombre;
    });

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            nombre: producto.nombre,
            presentacion: producto.presentacion,
            precio: producto.precio,
            cantidad: 1
        });
    }
    mostrarCarrito();
});

listaCarrito.addEventListener('click', function (e) {
    const boton = e.target.closest('button');
    if (!boton) {
        return;
    }

    const i = parseInt(boton.dataset.indice);
    const accion = boton.dataset.accion;

    if (accion === 'mas') {
        carrito[i].cantidad += 1;
    } else if (accion === 'menos') {
        carrito[i].cantidad -= 1;
        if (carrito[i].cantidad < 1) {
            carrito.splice(i, 1);
        }
    } else if (accion === 'quitar') {
        carrito.splice(i, 1);
    }
    mostrarCarrito();
});

document.getElementById('btnVaciar').addEventListener('click', function () {
    carrito = [];
    mostrarCarrito();
});

document.getElementById('btnComprar').addEventListener('click', function () {
    window.location.href = 'pedidos.html';
});

mostrarCarrito();