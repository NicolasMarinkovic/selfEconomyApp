const form = document.getElementById("transactionForm");
const tableElement = document.getElementById("transactionTable");

// Primer evento de la pagina cada vez que se carga.
// Toma lo que hay en el local storage y lo presenta 1x1
document.addEventListener("DOMContentLoaded", function(event) {
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
    if (transactionObjArr != null) {
        transactionObjArr.forEach(
            function(arrayElement) {
                insertRowTransaction(arrayElement);
            });
    }
});

// El evento submit es el que hace el navegador por defecto que recarga la pag cuando tocas un botón.
form.addEventListener("submit", function(event) {
    event.preventDefault(); // preventDefault cancela el comportamiento que tiene el navegador por defecto, con respecto al submit.

    let transactionFormData = new FormData(form); //Form es el elemento a partir del cual se va a recibir esa CLAVE - VALOR
    let transactionObject = convertFormData(transactionFormData);
    saveTransactionObject(transactionObject);
    insertRowTransaction(transactionObject);
    form.reset();
});

// Recibe el ultimo nro de transaccion y le suma uno. Sirve para que cada fila que agreguemos tenga un id unico
function getNewTransactionId() {
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
    let newTransactionId = JSON.parse(lastTransactionId) + 1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
    return newTransactionId;
}

// Recibe el formulario que ingresamos y lo transformamos en un objeto.
function convertFormData(transactionFormData) {
    let transactionType = transactionFormData.get("transactionType");
    let transactionDescription = transactionFormData.get("transactionDescription");
    let transactionAmount = transactionFormData.get("transactionAmount");
    let transactionCategory = transactionFormData.get("transactionCategory");
    let transactionId = getNewTransactionId();
    return {
        "transactionType": transactionType,
        "transactionDescription": transactionDescription,
        "transactionAmount": transactionAmount,
        "transactionCategory": transactionCategory,
        "transactionId": transactionId
    }
}

//transactionObject = convertFormData(transactionFormData); Guardo el objeto obtenido de la función anterior.
function saveTransactionObject(transactionObject) {
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    //EN CASO QUE NO HAYA NADA EN EL LOCAL STORAGE PONGO UN ARRAY VACÍO.
    myTransactionArray.push(transactionObject);
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    // Convierto mi array de transacciones a JSON
    localStorage.setItem("transactionData", transactionArrayJSON);
    // Guardo mi array en el local storage
}

// Le paso el id de la transaction que quiere eliminar
function deleteTransactionObject(transactionId) {
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));;
    let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId === transactionId);
    // Busco el índice/posición del id que proximamente será borrado y lo guardo en una variable.
    transactionObjArr.splice(transactionIndexInArray, 1);
    //Splice sirve para borrar un elemento. El 1 es para que borre solo 1.
    let transactionArrayJSON = JSON.stringify(transactionObjArr);
    // Convierto nuevamente a Json y guardo el array en el local storage
    localStorage.setItem("transactionData", transactionArrayJSON);

}

//Agrego los textContent de las filas haciendo referencia a los objetos antes creados.
function insertRowTransaction(transactionObject) {

    let transactionTableRef = document.getElementById("transactionTable");
    let newTransactionRowRef = transactionTableRef.insertRow(-1);
    newTransactionRowRef.setAttribute("data-transaction-id", transactionObject["transactionId"]);
    // le agrego al html el data attribute del id para despues poder borrarlo

    let newTypeCellRef = newTransactionRowRef.insertCell(0);
    newTypeCellRef.textContent = transactionObject["transactionType"];
    // El objeto toma el parametro de la etiqueta Name

    newTypeCellRef = newTransactionRowRef.insertCell(1);
    newTypeCellRef.textContent = transactionObject["transactionDescription"];

    newTypeCellRef = newTransactionRowRef.insertCell(2);
    newTypeCellRef.textContent = transactionObject["transactionAmount"];

    newTypeCellRef = newTransactionRowRef.insertCell(3);
    newTypeCellRef.textContent = transactionObject["transactionCategory"];

    insertDeleteButton(newTransactionRowRef);


}

//Agrego botón de eliminar y agrega el event listener que lo borra del html y local storage
function insertDeleteButton(newTransactionRowRef) {
    let newDeleteCell = newTransactionRowRef.insertCell(4);
    let deleteButton = document.createElement("button"); // Creo el elemento
    deleteButton.textContent = "Eliminar";
    newDeleteCell.appendChild(deleteButton);
    //appendChild inserta un nuevo nodo dentro de la estructura DOM de un documento

    deleteButton.addEventListener("click", () => {
        let transactionRow = event.target.parentNode.parentNode;
        let transactionId = transactionRow.getAttribute("data-transaction-id");
        transactionRow.remove(); // Lo borro del HTML
        // El tr es el padre del td que es el padre del button, por eso doble parentNode.

        deleteTransactionObject(transactionId); //Lo borro del Local Storage
    });
}