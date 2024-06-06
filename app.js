// import { Modal } from 'bootstrap.min.js';
const db = new PouchDB("recordatorios");
// Selecciono los elementos
const inputTarea = document.querySelector("#tarea");

const form = document.querySelector("form");

const listaRecordatorios = document.querySelector("#recordatorios");

let radioInput = document.querySelectorAll('#nuevoRecordatorio input[type="radio"]');


let radioDivTrue = document.querySelector(".divRadioTrue");

let radioDivFalse = document.querySelector(".divRadioFalse");

let recordatorios = [];
let imgReference = document.getElementById("#img_reference");
let file;

// Funcion que depende que radio pone se crea otro campo
let existingDiv = null;
let valorRadio = null;
const eventoRadios = (radios) => {

  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      // Elimina el div existente si hay uno
      if (existingDiv) {
        existingDiv.remove();
        existingDiv = null;
        valorRadio = false;
        return valorRadio;
      }

      if (e.target.value === "True") {
        // Crea un nuevo div
        let div = document.createElement("div");

        let p = document.createElement("p");
        p.innerText = "Inserte fecha límite";
        p.setAttribute("class", "mt-3");

        let fecha = document.createElement("input");
        fecha.setAttribute("type", "datetime-local");
        fecha.setAttribute("id", "datetime");
        fecha.setAttribute("name", "datetime");
        fecha.setAttribute("class", "form-control  mb-3");

        div.appendChild(p);
        div.appendChild(fecha);
        radioDivTrue.insertAdjacentElement("afterend", div);
        valorRadio = true;
        existingDiv = div;
        return valorRadio;
      }
    });
  });
}
// Funcion 1 - Leer los inputs y los pushea en array contactos
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let fechaMax = document.getElementById("datetime")
    ? document.getElementById("datetime").value
    : "Sin fecha límite";

  const body = inputTarea.value;
  const fecha = new Date().toLocaleDateString();
  const idRandom = crypto.randomUUID();
  let imgFileName;
  // Si se seleccionó un archivo de imagen
  if (file) {
    imgFileName = file.name;
  }

  const recordatorio = {
    _id: idRandom,
    fecha: fecha,
    fechaLimite: fechaMax ? fechaMax : "Sin fecha límite",
    body: body,
    importanceType: valorRadio ? "True" : "False",
    img: imgFileName,
  };
  db.put(recordatorio)
    .then((resp) => {
      console.log(resp);
    })
    .catch((error) => {
      console.error(error);
    });

  recordatorios.push(recordatorio);

  inputTarea.value = "";
  console.log(recordatorios);
  renderizarRecordatorios(recordatorios);
});
let btns;
let btns2;
// Funcion 2 - Recibe un array y los renderiza las notas
const renderizarRecordatorios = (lista) => {
  // Limpio el contenedor

  listaRecordatorios.innerHTML = "";
  lista.forEach((recordatorio, index) => {
    listaRecordatorios.innerHTML += `
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
                <div>
                    <span>
                        <i class="fa-solid fa-calendar"></i>
                        <strong> ${recordatorio.fecha}</strong>
                    </span>
                    <br>
                    <div>
                    <i class="fa-regular fa-file-lines"></i> ${recordatorio.body}
                    </div>
                    <div>
                    <i class="fa-solid fa-camera"></i>
                        ${recordatorio.img}
                    </div>
                    <div>
                    <i class="fa-solid fa-calendar text-danger"></i>
                        ${recordatorio.fechaLimite}
                    </div>
                    <div>
                        ${recordatorio.importanceType}
                    </div>
                </div>
                <div>
                
                <button id="${index}" data-id2="${recordatorio._id}" style="height:100%;" class=" btn btn-danger btn-delete" type="button">
                X
                </button>
                </div>
            </div>
        </li>
        
        `
  });
/* <button data-bs-toggle="modal" data-bs-target="#editRecordatorio"id="${index}" data-id2="${recordatorio._id}" class="m-1 btn btn-warning" style="height:100%;" type="button">
                <i style="color:white;" class="fa-regular fa-pen-to-square"></i>
                </button><div  hidden class="modal fade" id="editRecordatorio" tabindex="-1" aria-labelledby="editRecordatorio" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <h1 class="modal-title fs-5" id="exampleModalLabel">Modifica tu recordatorio</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
    
    <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary">Save changes</button>
    </div>
    </div>
    </div>
    </div> */
  btns = document.querySelectorAll(".btn-delete");
  btns2 = document.querySelectorAll(".btn-warning");
  console.log(btns);
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.id;
      let id2 = e.target.dataset.id2;
      deleteRecordatorio(id, id2);
    });
  });
  btns2.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // const id = e.target.id;
      let id2 = e.target.dataset.id2;
      editRecordatorio(id2);
    });
  });

};

let datosPouch;
// Funcion 3 - Lee las notas del indexedDB
const getNotas = async () => {
  try {
    const result = await db.allDocs({ include_docs: true, descending: true });
    datosPouch = result.rows.map((row) => row.doc); // Extrae todos los documentos en un array
    datosPouch.forEach((element) => {
      recordatorios.push(element);
    });

    renderizarRecordatorios(datosPouch);
  } catch (error) {
    console.error("Error al obtener las notas:", error);
  }
};

// Funcion 4 - Elimina un Nota
const deleteRecordatorio = (index, id2) => {
  try {
    let id = recordatorios[index]._id;
    deleteObject(id);
    recordatorios.splice(index, 1);
    renderizarRecordatorios(recordatorios);
  } catch (error) {
    console.error(error);
  }
};
const deleteObject = async (id) => {
  const doc = await db.get(id);
  await db.remove(doc);
}

let modalDocBody
// let divCreated = document.getElementById("edit-action")
// if ((divCreated==null)) {
  // let atrribute= modalDocBody.getAttribute("hidden")
  // console.log(atrribute)
  // console.log("estoy")
  // divCreated.innerHTML = ""
// }
// const editRecordatorio = async (id) => {

//   try {

//     const doc = await db.get(id);
//     let modal = document.querySelector("#editRecordatorio")
//     modal.removeAttribute("hidden")
//     modalDocBody = document.querySelector("#editRecordatorio .modal-body")
//     let form = document.createElement("div")
//     form.setAttribute("id", "edit-action")
//     form = `<label for="edit-body">Editá tu recordatorio</label>
//               <input  class="form-control" value="${doc.body}"/>
//               <label class="mt-3 mb-3" for="nombre">¿Es de importancia su fecha
//               límite?</label>
//               <div class="d-flex justify-content-around flex-column">
//               <div class="divRadioTrue">
//               <input class="form-check-input" type="radio" name="importance-edit"
//               id="trueRadio" value="True" required />
//               <label class="form-check-label" for="trueRadio">Sí</label>
//               </div>
//               <div class="divRadioFalse">
//               <input class="form-check-input" type="radio" name="importance-edit"
//               id="falseRadio" value="False" required />
//               <label class="form-check-label" for="falseRadio">No</label>
//               </div>
//               </div>
//               <label for="edit-img">Editá tu imagen</label>
//               <input class="form-control" type="file"/>`

//     modalDocBody.insertAdjacentHTML('afterbegin', form);
//     let radioInputEdit = document.querySelectorAll('#editRecordatorio input[name="importance-edit"]');
//     console.log(radioInputEdit)
//     eventoRadios(radioInputEdit);
//   } catch (error) {

//   }

//   // doc.body = nota.body;
//   // doc.img = nota.img;
//   // doc.importanceType = nota.importanceType;
//   // doc.fechaLimite = nota.fechaLimite;

//   // await db.put(doc);
// }

const renderError = (msg) => {
  listNotas.innerHTML = `<div class="alert alert-warning" role="alert">
                ${msg}
    </div>`;
};
getNotas();

eventoRadios(radioInput);


// Funcion de mozilla para previsualizar
function previewFile() {
  const preview = document.querySelector("img");
  file = document.querySelector("input[type=file]").files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      // convierte la imagen a una cadena en base64
      preview.src = reader.result;
      preview.hidden = false;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
    console.log(file);
  }
}
if( 'serviceWorker' in navigator  ){
  navigator.serviceWorker.register('js/sw.js');
} else {
  titulo.innerText = 'Lamentablemente tu navegador no soporta está tecnología'
}