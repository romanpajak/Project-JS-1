function addItem(columnId) {
  const itemName = document
    .getElementById(columnId)
    .getElementsByClassName("item-name")[0].value;
  let itemValue = document
    .getElementById(columnId)
    .getElementsByClassName("item-amount")[0].value;
  //----FORMS ERROR HANDLING----
  //if any input is empty
  const formNamePlaceholder = document
    .getElementById(columnId)
    .getElementsByClassName("item-name")[0].placeholder;
  const formAmountPlaceholder = document
    .getElementById(columnId)
    .getElementsByClassName("item-amount")[0].placeholder;
  if (itemName === "" && itemValue === "") {
    let warn = `Uzupełnij pola: ${formNamePlaceholder} i ${formAmountPlaceholder}`;
    showAlert(warn);
    return;
  }
  if (itemName === "") {
    warn = `Uzupełnij pole ${formNamePlaceholder}`;
    showAlert(warn);
    return;
  }
  //if input number empty or contains string
  if (itemValue === "") {
    warn = `Uzupełnij pole ${formAmountPlaceholder} wpisując poprawną wartość np. 12.34`;
    document
      .getElementById(columnId)
      .getElementsByClassName("item-amount")[0].value = "";
    showAlert(warn);
    return;
  }
  //if decimal is leading 0
  itemValue = itemValue.replace(/^0*/g, "").replace(/^(\.|\,)/g, "0.");
  if (itemValue <= 0) {
    warn = `Pole ${formAmountPlaceholder} musi zawierać wartość liczbową powyżej 0`;
    showAlert(warn);
    document
      .getElementById(columnId)
      .getElementsByClassName("item-amount")[0].value = "";
    return;
  }
  //if input number starts from dot or colon
  if (itemValue.indexOf(".") === 0 || itemValue.indexOf(",") === 0) {
    warn = `Uzupełnij pole ${formAmountPlaceholder} wpisując poprawną wartość np. 12.34`;
    document
      .getElementById(columnId)
      .getElementsByClassName("item-amount")[0].value = "";
    return;
  }
  //decimals number
  const decimalPosition = itemValue.indexOf(".");
  if (decimalPosition > 0) {
    if (itemValue.length - decimalPosition > 3) {
      warn = `Pole ${formAmountPlaceholder} nie może zawierać więcej niż 2 miejsca po przecinku.`;
      showAlert(warn);
      document
        .getElementById(columnId)
        .getElementsByClassName("item-amount")[0].value = "";
      return;
    }
    if (itemValue.length - decimalPosition === 2) {
      itemValue = `${itemValue}0`;
    }
  } else {
    itemValue = `${itemValue}.00`;
  }
  const newItem = document.createElement("div");
  const idName = columnId + "List";
  newItem.classList = "item-row row h-auto m-2 pt-3 pb-3";
  const leftColumn = document.createElement("div");
  leftColumn.classList = "row-details d-flex col h-auto";
  const newItemKind = document.createElement("p");
  newItemKind.classList = "item-kind mb-0";
  newItemKind.innerHTML = itemName;
  leftColumn.appendChild(newItemKind);
  const newItemValue = document.createElement("p");
  newItemValue.classList = "item-value mb-0";
  newItemValue.innerHTML = itemValue;
  leftColumn.appendChild(newItemValue);
  const rightColumn = document.createElement("div");
  rightColumn.classList = "buttons-container col h-auto p-0 d-flex";
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList = "buttons d-flex";
  rightColumn.appendChild(buttonsContainer);
  const leftButton = document.createElement("button");
  leftButton.type = "button";
  leftButton.classList = "btn btn btn-outline-success btn-sm";
  leftButton.innerHTML = "Edytuj";
  leftButton.addEventListener("click", editItem);
  const rightButton = document.createElement("button");
  rightButton.type = "button";
  rightButton.classList = "delate-btn btn btn-outline-danger btn-sm";
  rightButton.innerHTML = "Usuń";
  buttonsContainer.appendChild(leftButton);
  buttonsContainer.appendChild(rightButton);
  rightButton.addEventListener("click", delateItem);
  rightButton.innerHTML = "Usuń";
  newItem.appendChild(leftColumn);
  newItem.appendChild(rightColumn);
  document.getElementById(idName).appendChild(newItem);
  getSum(columnId);
  totalBalance();
  document.getElementById(columnId).getElementsByTagName("form")[0].reset();
  const scrolledElement = document.getElementById(idName);
  document.getElementById(idName).scrollTo(0, scrolledElement.scrollHeight);
}

function delateItem() {
  const parendId =
    this.parentNode.parentNode.parentNode.parentNode.parentNode.id;
  this.parentNode.parentNode.parentNode.remove();
  getSum(parendId);
  totalBalance();
}

function getSum(columnID) {
  const itemValuesLen = document
    .getElementById(columnID)
    .getElementsByClassName("item-value").length;
  let valuesSum = 0;
  for (let i = 0; i < itemValuesLen; i++) {
    const itemValueContent = document
      .getElementById(columnID)
      .getElementsByClassName("item-value")[i].innerHTML;
    valuesSum += parseFloat(itemValueContent);
  }
  document
    .getElementById(columnID)
    .getElementsByClassName("price")[0].innerHTML = valuesSum.toFixed(2);
}
function totalBalance() {
  const incomesSum = parseFloat(
    document.getElementsByClassName("price")[0].innerHTML
  );
  const expencesSum = parseFloat(
    document.getElementsByClassName("price")[1].innerHTML
  );
  let totalSum = parseFloat(incomesSum) - parseFloat(expencesSum);
  if (totalSum !== 0) {
    totalSum = totalSum.toFixed(2);
  } else {
    totalSum = 0;
  }
  if (totalSum > 0) {
    document.getElementById(
      "headerDetails"
    ).innerHTML = `Możesz jeszcze wydać ${totalSum} złotych`;
  }
  if (totalSum === 0) {
    document.getElementById("headerDetails").innerHTML = "Bilans wynosi zero";
  }
  if (totalSum < 0) {
    document.getElementById(
      "headerDetails"
    ).innerHTML = `Bilans jest ujemny. Jesteś na minusie ${totalSum} złotych`;
  }
}
//modal box functions
const modal = document.getElementById("modalBox");
const btn = document.getElementById("myBtn");
const btn1 = document.getElementById("btn-left");
const btn2 = document.getElementById("btn-right");
const modForm = document.getElementById("modalForm");
let modContent = document.getElementById("alertContent");
btn2.onclick = function () {
  modal.style.display = "none";
};
function showAlert(warningText) {
  modal.style.display = "block";
  modContent.style.display = "block";
  btn1.style.display = "none";
  modForm.style.display = "none";
  modContent.style.color = "black";
  modContent.innerHTML = warningText;
}
function editItem() {
  modForm.style.display = "block";
  btn1.style.display = "block";
  const colId = this.parentNode.parentNode.parentNode.parentNode.parentNode.id;
  const itemKind =
    this.parentNode.parentNode.parentNode.getElementsByClassName(
      "item-kind"
    )[0];
  const itemValue =
    this.parentNode.parentNode.parentNode.getElementsByClassName(
      "item-value"
    )[0];
  const modFormTxt = document.getElementById("modalFormTextInp");
  let modFormNmb = document.getElementById("modalFormNumbInp");
  modFormTxt.value = itemKind.innerHTML;
  modFormNmb.value = itemValue.innerHTML;
  modContent.style.display = "none";
  modal.style.display = "block";
  function showWarning(content) {
    modContent.style.display = "block";
    modContent.style.color = "red";
    modContent.innerHTML = content;
  }
  btn1.onclick = function () {
    const modFormTxtVal = modFormTxt.value;
    let modFormNmbVal = modFormNmb.value;
    //Form errors handling are repeated from addItem function
    if (modFormTxtVal === "" && modFormNmbVal === "") {
      showWarning("Wartości w polach nie mogą być puste");
      return;
    }
    if (modFormNmbVal === "") {
      showWarning("Uzupełnij pole Kwota wpisując poprawną wartość np. 12.34");
      modFormNmb.value = "";
      return;
    }
    modFormNmbVal = modFormNmbVal
      .replace(/^0*/g, "")
      .replace(/^(\.|\,)/g, "0.");
    if (modFormNmbVal <= 0) {
      showWarning("Pole Kwota musi zawierać wartość liczbową powyżej 0");
      modFormNmb.value = "";
      return;
    }
    if (modFormNmbVal.indexOf(".") === 0 || modFormNmbVal.indexOf(",") === 0) {
      showWarning("Uzupełnij pole wpisując poprawną wartość np. 12.34");
      return;
    }
    const decimalPos = modFormNmbVal.indexOf(".");
    if (decimalPos > 0) {
      if (modFormNmbVal.length - decimalPos > 3) {
        showWarning(
          "Pole nie może zawierać więcej niż 2 miejsca po przecinku."
        );
        modFormNmb.value = "";
        return;
      }
      if (modFormNmbVal.length - decimalPos === 2) {
        modFormNmbVal = `${modFormNmbVal}0`;
      }
    } else {
      modFormNmbVal = `${modFormNmbVal}.00`;
    }
    itemKind.innerHTML = modFormTxtVal;
    itemValue.innerHTML = modFormNmbVal;
    modal.style.display = "none";
    getSum(colId);
    totalBalance();
  };
}
