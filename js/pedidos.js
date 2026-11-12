const form = document.getElementById("formPedido");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const telefono = document.getElementById("telefono");
const selectCategoria = document.getElementById("categoria");
const selectProducto = document.getElementById("producto");
const inputCantidad = document.getElementById("cantidad");
const btnAgregar = document.getElementById("btnAgregar");
const listaPedido = document.getElementById("listaPedido");
const textoTotal = document.getElementById("total");
const mensaje = document.getElementById("mensaje");

let pedido = [];

function reiniciarProducto() {
    selectProducto.disabled = true;
    selectProducto.innerHTML = '<option value="">Primero elige una categoría</option>';
}

function mostrarPedido() {
    listaPedido.innerHTML = "";
    let total = 0;

    if (pedido.length === 0) {
        listaPedido.innerHTML = '<li class="list-group-item text-muted">Aún no agregaste productos.</li>';
    }

    pedido.forEach(function (item, indice) {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = item.cantidad + " x " + item.nombre + " (" + item.presentacion + ") - S/ " + subtotal.toFixed(2);

        const btnQuitar = document.createElement("button");
        btnQuitar.type = "button";
        btnQuitar.className = "btn btn-sm btn-outline-danger";
        btnQuitar.textContent = "Quitar";
        btnQuitar.setAttribute("aria-label", "Quitar " + item.nombre);
        btnQuitar.addEventListener("click", function () {
            pedido.splice(indice, 1);
            mostrarPedido();
        });

        li.appendChild(btnQuitar);
        listaPedido.appendChild(li);
    });

    textoTotal.textContent = "S/ " + total.toFixed(2);
}

selectCategoria.addEventListener("change", function () {
    const categoria = selectCategoria.value;

    if (categoria === "") {
        reiniciarProducto();
        return;
    }

    selectProducto.disabled = false;
    selectProducto.innerHTML = '<option value="">Elige un producto</option>';

    productos
        .filter(function (p) { return p.categoria === categoria; })
        .forEach(function (p) {
            const opcion = document.createElement("option");
            opcion.value = p.nombre;
            opcion.textContent = p.nombre + " (" + p.presentacion + ") - S/" + p.precio.toFixed(2);
            selectProducto.appendChild(opcion);
        });
});

function validarCampo(campo, esValido) {
    campo.classList.toggle("is-invalid", !esValido);
    campo.classList.toggle("is-valid", esValido);
    return esValido;
}

btnAgregar.addEventListener("click", function () {
    const cantidad = parseInt(inputCantidad.value);

    const categoriaOk = validarCampo(selectCategoria, selectCategoria.value !== "");
    const productoOk = validarCampo(selectProducto, selectProducto.value !== "");
    const cantidadOk = validarCampo(inputCantidad, cantidad >= 1);

    if (!categoriaOk || !productoOk || !cantidadOk) {
        return;
    }

    const producto = productos.find(function (p) {
        return p.nombre === selectProducto.value;
    });

    const existente = pedido.find(function (item) {
        return item.nombre === producto.nombre;
    });

    if (existente) {
        existente.cantidad += cantidad;
    } else {
        pedido.push({
            nombre: producto.nombre,
            presentacion: producto.presentacion,
            precio: producto.precio,
            cantidad: cantidad
        });
    }

    mostrarPedido();

    selectCategoria.value = "";
    reiniciarProducto();
    inputCantidad.value = 1;
    [selectCategoria, selectProducto, inputCantidad].forEach(function (c) {
        c.classList.remove("is-valid", "is-invalid");
    });
});

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const datosOk = [
        validarCampo(nombre, nombre.value.trim() !== ""),
        validarCampo(apellido, apellido.value.trim() !== ""),
        validarCampo(telefono, /^9\d{8}$/.test(telefono.value.trim()))
    ];

    if (datosOk.includes(false)) {
        mensaje.className = "alert alert-danger mt-3";
        mensaje.textContent = "Revisa los campos marcados en rojo.";
        return;
    }

    if (pedido.length === 0) {
        mensaje.className = "alert alert-danger mt-3";
        mensaje.textContent = "Agrega al menos un producto a tu pedido.";
        return;
    }

    mensaje.className = "alert alert-success mt-3";
    mensaje.textContent = "Ya se registró correctamente tu pedido. Nos contactaremos en breve con usted.";
    
    form.reset();
    form.querySelectorAll(".is-valid, .is-invalid").forEach(function (c) {
        c.classList.remove("is-valid", "is-invalid");
    });
    pedido = [];
    reiniciarProducto();
    mostrarPedido();
});