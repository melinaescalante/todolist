const db = new PouchDB('recordatorios');

// Selecciono los elementos
const inputTarea = document.querySelector('#tarea');

const form = document.querySelector('form');

const listaRecordatorios = document.querySelector('#recordatorios');

let radioInput = document.querySelectorAll('input[name="importance"]')

let radioDivTrue = document.querySelector(".divRadioTrue")

let radioDivFalse = document.querySelector(".divRadioFalse")

let recordatorios = [];
let imgReference = document.getElementById("#img_reference")
let file

// Funcion que depende que radio pone se crea otro campo
let existingDiv = null;
let valorRadio = null

radioInput.forEach(radio => {
    radio.addEventListener('change', (e) => {
        // Elimina el div existente si hay uno
        if (existingDiv) {
            existingDiv.remove();
            existingDiv = null;
            valorRadio = false
            return valorRadio
        }

        if (e.target.value === "True") {
            // Crea un nuevo div
            let div = document.createElement("div");
            
            let p = document.createElement("p");
            p.innerText = "Inserte fecha límite";
            p.setAttribute("class", "mt-3")
            
            let fecha = document.createElement("input");
            fecha.setAttribute("type", "datetime-local");
            fecha.setAttribute("id", "datetime");
            fecha.setAttribute("name", "datetime");
            fecha.setAttribute("class", "form-control  mb-3");
            
            div.appendChild(p);
            div.appendChild(fecha);
            radioDivTrue.insertAdjacentElement("afterend", div);
            valorRadio = true
            existingDiv = div;
            return valorRadio
            
        }
    })
});
// Funcion 1 - Leer los inputs y los pushea en array contactos
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let fechaMax = document.getElementById('datetime') ? document.getElementById('datetime').value : "Sin fecha límite";

    const body = inputTarea.value;
    const fecha = new Date().toLocaleDateString();
    const idRandom = crypto.randomUUID();
    let imgFileName
    // Si se seleccionó un archivo de imagen
    if (file) {
        imgFileName = file.name;

    }
    
    const recordatorio = {
        _id: idRandom,
        fecha: fecha,
        fechaLimite: fechaMax? fechaMax: "Sin fecha límite",
        body: body,
        importanceType:valorRadio? "True": "False",
        img: imgFileName,
        
    };
    db.put(recordatorio).then(resp => {
        console.log(resp)
    }).catch(error => {
        alert('Ocurrio un error');
        console.error(error)
    })

    recordatorios.push(recordatorio);

    inputTarea.value = '';
    console.log(recordatorios);
    renderizarRecordatorios(recordatorios)
})

// Funcion 2 - Recibe un array y los renderiza las notas
const renderizarRecordatorios = (lista) => {
    // Limpio el contenedor
    listaRecordatorios.innerHTML = '';
    lista.forEach((recordatorio, index) => {
        listaRecordatorios.innerHTML += `
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
                <div>
                    <span>
                        <i class="fa-solid fa-calendar text-primary"></i>
                        <strong> ${recordatorio.fecha}</strong>
                    </span>
                    <br>
                    <div>
                        <i class="fa-solid fa-mobile-screen text-success"></i> ${recordatorio.body}
                    </div>
                    <div>
                        ${recordatorio.img}
                    </div>
                    <div>
                        ${recordatorio.fechaLimite}
                    </div>
                    <div>
                        ${recordatorio.importanceType}
                    </div>
                </div>

                <button id="${index}" class="btn btn-danger btn-delete" type="button">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </li>`;
    });

    const btns = document.querySelectorAll('.btn-delete');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.id;
            deleteRecordatorio(id);
        })
    });
}

// Funcion 3 - Lee las notas del indexedDB
const getNotas = async () => {
    db.allDocs({ include_docs: true, descending: true }).then(docs => {
        console.log(docs.rows);
      
    })
}

// Funcion 4 - Elimina un Nota
const deleteRecordatorio = (index) => {
    console.log(index);
    // Elimino localmente
    recordatorios.splice(index, 1);
    console.log(recordatorios);
    // Actualización
    renderizarRecordatorios(recordatorios);
}

const renderError = (msg) => {
    listNotas.innerHTML =
        `<div class="alert alert-warning" role="alert">
                ${msg}
    </div>`
}
getNotas();
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
    false,
  );

  if (file) {
    reader.readAsDataURL(file);
    console.log(file)
  }
}



