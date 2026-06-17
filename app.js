const API_URL = "https://inventario-backend-9yx1.onrender.com/productos";

let modoEdicion = false;
let idEditando = null;

async function obtenerProductos() {
  try {
    const res = await fetch(API_URL);
    const datos = await res.json();
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";

    datos.forEach(function(prod) {
      tabla.innerHTML += "<tr>" +
        "<td>" + prod.nombre + "</td>" +
        "<td>$" + prod.precio + "</td>" +
        "<td>" + prod.existencia + " pzas</td>" +
        "<td>" +
          "<button onclick=\"editarProducto('" + prod._id + "', '" + prod.nombre + "', " + prod.precio + ", " + prod.existencia + ")\" " +
          "style=\"background:#f0a500;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;margin-right:4px;\">Editar</button>" +
          "<button onclick=\"eliminarProducto('" + prod._id + "')\" " +
          "style=\"background:#e53935;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;\">Eliminar</button>" +
        "</td>" +
      "</tr>";
    });
  } catch (err) {
    console.error("Error al traer datos:", err);
  }
}

function editarProducto(id, nombre, precio, existencia) {
  modoEdicion = true;
  idEditando = id;

  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("existencia").value = existencia;

  var btnSubmit = document.querySelector("#formProducto button[type='submit']");
  btnSubmit.textContent = "Actualizar producto";
  btnSubmit.style.background = "#f0a500";

  var btnCancelar = document.getElementById("btnCancelar");
  if (!btnCancelar) {
    btnCancelar = document.createElement("button");
    btnCancelar.id = "btnCancelar";
    btnCancelar.type = "button";
    btnCancelar.textContent = "Cancelar";
    btnCancelar.style.cssText = "margin-top:8px;background:#aaa;color:#fff;border:none;padding:10px;width:100%;border-radius:4px;cursor:pointer;";
    btnCancelar.onclick = cancelarEdicion;
    btnSubmit.parentNode.insertBefore(btnCancelar, btnSubmit.nextSibling);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelarEdicion() {
  modoEdicion = false;
  idEditando = null;
  document.getElementById("formProducto").reset();

  var btnSubmit = document.querySelector("#formProducto button[type='submit']");
  btnSubmit.textContent = "Enviar a la Nube";
  btnSubmit.style.background = "";

  var btnCancelar = document.getElementById("btnCancelar");
  if (btnCancelar) {
    btnCancelar.remove();
  }
}

async function eliminarProducto(id) {
  if (!confirm("Seguro que deseas eliminar este producto?")) return;

  try {
    var res = await fetch(API_URL + "/" + id, { method: "DELETE" });
    if (res.ok) {
      alert("Producto eliminado.");
      obtenerProductos();
    } else {
      alert("Error al eliminar el producto.");
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  }
}

document.getElementById("formProducto").addEventListener("submit", async function(e) {
  e.preventDefault();

  var datos = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    existencia: Number(document.getElementById("existencia").value)
  };

  try {
    var res;

    if (modoEdicion && idEditando) {
      res = await fetch(API_URL + "/" + idEditando, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      if (res.ok) {
        alert("Producto actualizado con exito!");
        cancelarEdicion();
        obtenerProductos();
      }
    } else {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      if (res.ok) {
        alert("Guardado con exito en MongoDB Atlas!");
        document.getElementById("formProducto").reset();
        obtenerProductos();
      }
    }
  } catch (err) {
    console.error("Error al enviar datos:", err);
  }
});

obtenerProductos();
