const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const archivo = path.join(__dirname, "tareas.txt");

// LISTA ENLAZADA

class Nodo {
  constructor(id, nombre, descripcion, estado) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
    this.siguiente = null;
  }
}

let cabeza = null;
let siguienteId = 1;

// AGREGAR TAREA

function agregar(id, nombre, descripcion, estado) {
  let nuevo = new Nodo(id, nombre, descripcion, estado);

  if (cabeza == null) {
    cabeza = nuevo;
  } else {
    let actual = cabeza;

    while (actual.siguiente != null) {
      actual = actual.siguiente;
    }

    actual.siguiente = nuevo;
  }
}

// CONSULTAR TAREAS

function consultar() {
  let tareas = [];
  let actual = cabeza;

  while (actual != null) {
    tareas.push({
      id: actual.id,
      nombre: actual.nombre,
      descripcion: actual.descripcion,
      estado: actual.estado,
    });

    actual = actual.siguiente;
  }

  return tareas;
}

// GUARDAR EN TXT

function guardar() {
  fs.writeFileSync(archivo, JSON.stringify(consultar(), null, 2));
}

// CARGAR TAREAS GUARDADAS

if (fs.existsSync(archivo)) {
  let datos = fs.readFileSync(archivo, "utf8");

  if (datos.trim() != "") {
    let tareas = JSON.parse(datos);

    tareas.forEach((tarea) => {
      let id = siguienteId;

      if (Number.isInteger(tarea.id) && tarea.id >= siguienteId) {
        id = tarea.id;
      }

      agregar(id, tarea.nombre, tarea.descripcion, tarea.estado);

      siguienteId = id + 1;
    });
  }
}

// REGISTRAR

app.post("/tareas", (req, res) => {
  let { nombre, descripcion, estado } = req.body;

  if (!nombre || !descripcion || !estado) {
    return res.status(400).json({
      mensaje: "Completa todos los campos",
    });
  }

  agregar(siguienteId, nombre, descripcion, estado);
  siguienteId++;

  guardar();

  res.json({ mensaje: "Tarea registrada" });
});

// CONSULTAR

app.get("/tareas", (req, res) => {
  res.json(consultar());
});

// ACTUALIZAR TODA LA ACTIVIDAD

app.put("/tareas/:id", (req, res) => {
  let id = Number(req.params.id);
  let { nombre, descripcion, estado } = req.body;

  if (!nombre || !descripcion || !estado) {
    return res.status(400).json({
      mensaje: "Completa todos los campos",
    });
  }

  let actual = cabeza;

  while (actual != null) {
    if (actual.id == id) {
      actual.nombre = nombre;
      actual.descripcion = descripcion;
      actual.estado = estado;

      guardar();

      return res.json({
        mensaje: "Tarea actualizada",
      });
    }

    actual = actual.siguiente;
  }

  res.status(404).json({
    mensaje: "Tarea no encontrada",
  });
});

// INICIAR SERVIDOR

app.listen(3000, () => {
  console.log("Servidor iniciado en puerto 3000");
});
