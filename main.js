let transactionForm = document.getElementById("transactionForm");

let transactionFormData = new FormData(transactionForm);
// El formData es la forma más fácil de pasar un formulario a una Api.
// Todo esto se hace mediante la etiqueta name.

transactionFormData.get("transactionDescription");