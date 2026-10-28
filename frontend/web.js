const url = "http://localhost:3000/tareas";

async function registrar() {
  let nombre = document.getElementById("nombre").value;
  let descripcion = document.getElementById("descripcion").value;
  let estado = document.getElementById("estado").value;

  if (nombre == "" || descripcion == "") {
    alert("Completa todos los campos");
    return;
  }

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      descripcion,
      estado,
    }),
  });

  alert("Actividad registrada");

  document.getElementById("nombre").value = "";
  document.getElementById("descripcion").value = "";

  consultar();
}

async function consultar() {
  let respuesta = await fetch(url);
  let tareas = await respuesta.json();

  let tabla = document.getElementById("tabla");
  tabla.innerHTML = "";

  tareas.forEach((tarea) => {
    let fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${tarea.nombre}</td>
      <td>${tarea.descripcion}</td>
      <td>${tarea.estado}</td>
      <td><button>Editar</button></td>
    `;

    fila.querySelector("button").onclick = () => editar(tarea);

    tabla.appendChild(fila);
  });
}

async function editar(tarea) {
  let nombre = prompt("Nuevo nombre:", tarea.nombre);

  if (nombre == null) return;

  let descripcion = prompt("Nueva descripción:", tarea.descripcion);

  if (descripcion == null) return;

  let estado = prompt(
    "Nuevo estado (Pendiente, En proceso, Finalizada):",
    tarea.estado,
  );

  if (estado == null) return;

  if (nombre.trim() == "" || descripcion.trim() == "") {
    alert("Los campos no pueden estar vacíos");
    return;
  }

  if (!["Pendiente", "En proceso", "Finalizada"].includes(estado)) {
    alert("Estado no válido");
    return;
  }

  let respuesta = await fetch(url + "/" + tarea.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      descripcion,
      estado,
    }),
  });

  if (respuesta.ok) {
    alert("Actividad actualizada");
    consultar();
  } else {
    alert("No se pudo actualizar");
  }
}

consultar();
