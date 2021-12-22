const form = document.getElementById("transactionForm");
const tableElement = document.getElementById("transactionTable");

form.addEventListener("submit", function(event) { // El evento submit es el que hace el navegador por defecto que recarga la pag cuando tocas un botón.
    event.preventDefault(); // preventDefault cancela el comportamiento que tiene el navegador por defecto, con respecto al submit.

    let transactionFormData = new FormData(form); //Form es el elemento a partir del cual se va a recibir esa CLAVE - VALOR
    let transactionObject = convertFormData(transactionFormData);
    saveTransactionObject(transactionObject);
    insertRowTransaction(transactionObject);
    form.reset();
});

document.addEventListener("DOMContentLoaded", function(event) {
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
    if (transactionObjArr != null) {
        transactionObjArr.forEach(
            function(arrayElement) {
                insertRowTransaction(arrayElement);
            });
    }
});

function getNewTransactionId() {
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
    let newTransactionId = JSON.parse(lastTransactionId) + 1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
    return newTransactionId;

}

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

function saveTransactionObject(transactionObject) {

    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || []; //EN CASO QUE NO HAYA NADA EN EL LOCAL STORAGE PONGO UN ARRAY VACÍO.
    myTransactionArray.push(transactionObject);
    // Convierto mi array de transacciones a JSON
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    // Guardo mi array en el local storage
    localStorage.setItem("transactionData", transactionArrayJSON);

}

// Le paso el id de la transaction que quiere eliminar
function deleteTransactionObject(transactionId) {
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
    let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId === transactionId);
    // Busco el índice/posición del id que proximamente será borrado y lo guardo en una variable.
    transactionObjArr.splice(transactionIndexInArray, 1);
    //Splice sirve para borrar un elemento. El 1 es para que borre solo 1.
    let transactionArrayJSON = JSON.stringify(transactionObjArr);
    // Convierto nuevamente a Json y guardo el array en el local storage
    localStorage.setItem("transactionData", transactionArrayJSON);

}

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

function insertDeleteButton(newTransactionRowRef) {
    let newDeleteCell = newTransactionRowRef.insertCell(4);
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    newDeleteCell.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
        let transactionRow = event.target.parentNode.parentNode;
        let transactionId = transactionRow.getAttribute("data-transaction-id");
        transactionRow.remove(); // Lo borro del HTML
        // El tr es el padre del td que es el padre del button, por eso doble parentNode.

        deleteTransactionObject(transactionId); //Lo borro del Local Storage
    });
}