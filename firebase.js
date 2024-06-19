// Importo las configuraciones

// import { dbPouch } from './app.js'
import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    getDoc,
    setDoc,
    deleteDoc,
    doc

} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";


//   Inicio de la app
const app = initializeApp(firebaseConfig);

//   Creo base de datos de la app
const db = getFirestore(app)
//   Creo las funciones
export const deleteRecordatorioFirebase = async (id) => {


    await deleteDoc(doc(db, "recordatorio", id));
}
export const guardarRecordatorioFirebase = async (recordatorio) => {
    try {
        const doc = await addDoc(collection(db, 'recordatorio'), recordatorio);
       
        // return doc.id;
    } catch (error) {
        console.error(error);
    }
}
export const getRecordatoriosFirebase = async () => {
    try {
        const querySnapShot = await getDocs(collection(db, 'recordatorio'));
        const data = [];
        querySnapShot.forEach(doc => {
            const { body, fecha, fechaLimite, importanceType } = doc.data();
            data.push({
                id: doc.id,
                body,
                fecha,
                fechaLimite,
                importanceType,
            })

        });

        // renderizarRecordatorios(data);

        return data;
    } catch (error) {
        console.log(error)
    }

}