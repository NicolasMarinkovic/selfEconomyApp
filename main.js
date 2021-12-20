const form = document.getElementById("transactionForm");


form.addEventListener("submit", function(event) { // El evento submit es el que hace el navegador por defecto que recarga la pag cuando tocas un botón.
    event.preventDefault();   // preventDefault cancela el comportamiento que tiene el navegador por defecto, con respecto al submit.
    
    let transactionFormData = new FormData(form); //Form es el elemento a partir del cual se va a recibir esa CLAVE - VALOR
    let transactionObject = convertFormData(transactionFormData);
    saveTransactionObject(transactionObject);
    insertRowTransaction(transactionObject);
}
);

document.addEventListener("DOMContentLoaded", function(event) { 
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
    if (transactionObjArr != null) {
        transactionObjArr.forEach(
            function(arrayElement){
                insertRowTransaction(arrayElement);
        });
    }
});

function convertFormData(transactionFormData) {
    let transactionType = transactionFormData.get("transactionType");
    let transactionDescription = transactionFormData.get("transactionDescription");
    let transactionAmount = transactionFormData.get("transactionAmount");
    let transactionCategory = transactionFormData.get("transactionCategory");
    return {
            "transactionType" : transactionType,
            "transactionDescription" : transactionDescription,
            "transactionAmount" : transactionAmount,
            "transactionCategory" : transactionCategory,
        }
}

function saveTransactionObject(transactionObject) {
    
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || []; //EN CASO QUE NO HAYA NADA EN EL LOCAL STORAGE PONGO UN ARRAY VACÍO.
    myTransactionArray.push(transactionObject);
    // Convierto mi array de transacciones a JSON
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    // Guardo mi array en el local storage
    localStorage.setItem("transactionData",transactionArrayJSON);

}

function insertRowTransaction(transactionObject) {
    
    let transactionTableRef = document.getElementById("transactionTable");
    let newTransactionRowRef = transactionTableRef.insertRow(-1);

    let newTypeCellRef = newTransactionRowRef.insertCell(0);
    newTypeCellRef.textContent = transactionObject ["transactionType"];
    
    newTypeCellRef = newTransactionRowRef.insertCell(1);
    newTypeCellRef.textContent = transactionObject ["transactionDescription"];
    
    newTypeCellRef = newTransactionRowRef.insertCell(2);
    newTypeCellRef.textContent = transactionObject ["transactionAmount"];
    
    newTypeCellRef = newTransactionRowRef.insertCell(3);
    newTypeCellRef.textContent = transactionObject ["transactionCategory"];

}
