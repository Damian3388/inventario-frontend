const API_URL = "https://inventario-backend-8jtf.onrender.com/productos";

let modoEdicion = false;
let idEditando = null;

// Función para consultar los datos guardados en MongoDB Atlas
async function obtenerProductos() {
  try {
    const res = await fetch(API_URL);
    const datos = await res.json();
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";

    datos.forEach(prod => {
      tabla.innerHTML += `
        <tr>
          <td>${prod.nombre}</td>
          <td>$${prod.precio}</td>
          <td>${prod.existencia} pzas</td>
          <td>
            <button onclick="editarProducto('${prod._id}', '${prod.nombre}', ${prod.precio}, ${prod.existencia})"
              style="background:#f0a500;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;margin-right:4px;">
              ✏️ Editar
            </button>
            <button onclick="eliminarProducto('${prod._id}')"
              style="background:#e53935;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;">
              🗑️ Eliminar
            </button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error("Error al traer datos:", err);
  }
}

// Rellena el formulario con los datos del producto a editar
function editarProducto(id, nombre, precio, existencia) {
  modoEdicion = true;
  idEditando = id;

  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("existencia").value = existencia;

  const btnSubmit = document.querySelector("#formProducto button[type='submit']");
  btnSubmit.textContent = "💾 Actualizar producto";
  btnSubmit.style.background = "#f0a500";

  // Mostrar botón para cancelar edición
  let btnCancelar = document.getElementById("btnCancelar");
  if (!btnCancelar) {
    btnCancelar = document.createElement("button");
    btnCancelar.id = "btnCancelar";
    btnCancelar.type = "button";
    btnCancelar.textContent = "✖ Cancelar";
    btnCancelar.style.cssText = "margin-left:8px;background:#aaa;color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;";
    btnCancelar.onclick = cancelarEdicion;
    btnSubmit.parentNode.insertBefore(btnCancelar, btnSubmit.nextSibling);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cancela el modo edición y regresa al formulario normal
function cancelarEdicion() {
  modoEdicion = false;
  idEditando = null;
  document.getElementById("formProducto").reset();

  const btnSubmit = document.querySelector("#formProducto button[type='submit']");
  btnSubmit.textContent = "Guardar producto";
  btnSubmit.style.background = "";

  const btnCancelar = document.getElementById("btnCancelar");
  if (btnCancelar) btnCancelar.remove();
}

// Elimina un producto por su ID
async function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
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

// Envía un nuevo registro o actualiza uno existente
document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    existencia: Number(document.getElementById("existencia").value)
  };

  try {
    let res;

    if (modoEdicion && idEditando) {
      // Modo edición → PUT
      res = await fetch(`${API_URL}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      if (res.ok) {
        alert("¡Producto actualizado con éxito!");
        cancelarEdicion();
      }
    } else {
      // Modo creación → POST
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      if (res.ok) {
        alert("¡Guardado con éxito en MongoDB Atlas!");
        document.getElementById("formProducto").reset();
      }
    }

    obtenerProductos(); // Recarga la tabla de manera dinámica
  } catch (err) {
    console.error("Error al enviar datos:", err);
  }
});

// Cargar la base de datos inmediatamente al abrir la página
obtenerProductos();
} catch (err) {
console.error("Error al enviar datos:", err);
}
});

// Cargar la base de datos inmediatamente al abrir la página
obtenerProductos();
