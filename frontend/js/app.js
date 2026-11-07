let productos = [
  { codigo: "P001", nombre: "Camiseta", precio: 12.5, stock: 20, emoji: "👕" },
  { codigo: "P002", nombre: "Gorra", precio: 8.0, stock: 15, emoji: "🧢" },
  { codigo: "P003", nombre: "Zapatos", precio: 45.0, stock: 5, emoji: "👟" },
  { codigo: "P004", nombre: "Mochila", precio: 30.0, stock: 8, emoji: "🎒" },
  { codigo: "P005", nombre: "Medias", precio: 3.5, stock: 40, emoji: "🧦" },
  { codigo: "P006", nombre: "chompa", precio: 10, stock: 15, emoji: "🧥" }
];

const carrito = {};
const listaProductos = document.querySelector("#lista-productos");

function dinero(valor) {
  return "$" + valor.toFixed(2);
}

function pintarProductos(lista) {
  listaProductos.innerHTML = "";
  for (const p of lista) {
    const disponibles = p.stock - (carrito[p.codigo] || 0);
    listaProductos.innerHTML += `
      <article class="tarjeta">
        <div class="emoji">${p.emoji}</div>
        <h3>${p.nombre}</h3>
        <p class="precio">${dinero(p.precio)}</p>
        <p class="stock">Disponibles: ${disponibles}</p>
        <button class="boton" onclick="agregar('${p.codigo}')" ${disponibles === 0 ? "disabled" : ""}>Agregar</button>
      </article>`;
  }
}

const listaCarrito = document.querySelector("#lista-carrito");
const contador = document.querySelector("#contador");
const mensaje = document.querySelector("#mensaje");

function buscarProducto(codigo) {
  return productos.find((p) => p.codigo === codigo);
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = tipo;
}

function agregar(codigo) {
  const producto = buscarProducto(codigo);
  const cantidad = carrito[codigo] || 0;
  if (cantidad >= producto.stock) {
    mostrarMensaje("No hay más stock de " + producto.nombre, "error");
    return;
  }
  carrito[codigo] = cantidad + 1;
  mostrarMensaje("", "");
  actualizar();
}

function pintarCarrito() {
  listaCarrito.innerHTML = "";
  let unidades = 0;
  for (const codigo in carrito) {
    const p = buscarProducto(codigo);
    const cantidad = carrito[codigo];
    unidades += cantidad;
    listaCarrito.innerHTML += `
      <li>
        <span>${cantidad} × ${p.nombre}</span>
        <span>${dinero(p.precio * cantidad)}</span>
        <button class="quitar" onclick="quitar('${codigo}')">✕</button>
      </li>`;
  }
  if (unidades === 0) {
    listaCarrito.innerHTML = "<li>El carrito está vacío</li>";
  }
  contador.textContent = unidades;
}

const resumen = document.querySelector("#resumen");
const botonConfirmar = document.querySelector("#btn-confirmar");

function calcularSubtotal() {
  let subtotal = 0;
  for (const codigo in carrito) {
    subtotal += buscarProducto(codigo).precio * carrito[codigo];
  }
  return subtotal;
}

function mostrarResumen() {
  const subtotal = calcularSubtotal();
  resumen.innerHTML = `<p class="total">Subtotal: ${dinero(subtotal)}</p>`;
  botonConfirmar.disabled = subtotal === 0;
}

function quitar(codigo) {
  delete carrito[codigo];
  actualizar();
}

function actualizar() {
  pintarProductos(filtrar());
  pintarCarrito();
  mostrarResumen();
}

// ===== 3.6 Buscador en vivo =====
const campoBuscar = document.querySelector("#buscar");

function filtrar() {
  const texto = campoBuscar.value.toLowerCase();
  return productos.filter((p) => p.nombre.toLowerCase().includes(texto));
}

campoBuscar.addEventListener("input", actualizar);


actualizar();