const display = document.querySelector(".calculator-screen");

const buttons = document.querySelectorAll(".calculator-keys>button");

let buttonNum = [];
let buttonOperator = [];
let buttonFunction = [];
let cache = [];
let cacheValue = "";
let lastOperator = "";
buttons.forEach((button) => {
  if (button.classList.contains("operator")) {
    buttonOperator.push(button);
    const operator = button.value;
    switch (operator) {
      case "+":
        button.addEventListener("click", (e) => {
          cache.push(operator);
          setDisplayValue(operator);
        });
        break;
      case "-":
        button.addEventListener("click", (e) => {
          cache.push(operator);
          setDisplayValue(operator);
        });
        break;
      case "*":
        button.addEventListener("click", (e) => {
          cache.push(operator);
          setDisplayValue(operator);
        });
        break;
      case "/":
        button.addEventListener("click", (e) => {
          cache.push(operator);
          setDisplayValue(operator);
        });
        break;
    }
  }
  // Moliwość dodawania liczb dziesiętnych
  else if (button.classList.contains("decimal")) {
    button.addEventListener("click", (e) => {
      if (cache[cache.length - 1] !== '.') {
        cache.push('.');
        console.log(cache);
        setDisplayValue(".");
      }
    });
  } else if (button.classList.contains("all-clear")) {
    buttonFunction.push(button);
    button.addEventListener("click", (e) => {
      clearDisplay();
      cache = [];
    });
  } else if (button.classList.contains("equal-sign")) {
    buttonFunction.push(button);
    button.addEventListener("click", (e) => {
      equal();
    });
  } else {
    buttonNum.push(button);
    buttonFunction.push(button);
    button.addEventListener("click", (e) => {
      cache.push(parseFloat(e.target.value));
      setDisplayValue(e.target.value);
      console.log(cache);
    });
  }
});

function setDisplayValue(value) {
  display.innerText += value;
  console.log("value:" + value);
  cacheValue += value;
}
function clearDisplay() {
  display.innerText = "";
  cacheValue = "";
}
let test = true;
function add(a) {
  cache.push(a);
  console.log(cache);
}
function subtract(a) {
  cache.push(a);
  console.log(cache);
}

function multiply(a) {
  cache.push(a);
  console.log(cache);
}

function division(a) {
  cache.push(a);
  console.log(cache);
}


function equal() {
  if (cache.length === 0) return;

  const expression = cache.join('').replaceAll(/(\*|\/|\+|-)$/g, '');
  
  // Zabezpieczenie przed złymi danymi
  const safePattern = /^[0-9+\-*/. ]+$/;

  if (safePattern.test(expression)) {
    try {
      const result = eval(expression);
      clearDisplay();
      setDisplayValue(result.toString());
      cache = [result];
    } catch (error) {
      clearDisplay();
      setDisplayValue("Error: Invalid expression");
      cache = [];
    }
  } else {
    clearDisplay();
    setDisplayValue("Error: Invalid expression");
    cache = [];
  }
}

// Sprawdź, jaki operator został wybrany jako ostatni i czy została podana liczba, wtedy wykonaj działanie ostatniego operatora.
// Jeśli nie podano liczby, a kliknięto operator, wyświetl wartość z pamięci podręcznej (cache).

// Metoda/funkcja mnożenia

// Metoda/funkcja dzielenia

// Metoda/funkcja dodawania liczb zmiennoprzecinkowych: dodawany jest przecinek, a wartości float muszą zawierać kropkę (np. 1.2 zamiast 1,2).

// Te zmienne nie są wykorzystywane. Dodaje się do nich przyciski z kalkulatora, ale potem nie są używane.
// Pasowałoby je usunąć z kodu.
// let buttonNum = [];
// let buttonOperator = [];
// let buttonFunction = [];

// Gdy wszystko będzie działać, dopisz komentarze wyjaśniające działanie kodu oraz udokumentuj go w plikach Markdown dokumentacji:
// https://github.com/Code-V-Craft/Documentation
// Ten kod powinien być w Moduł 0: Kalkulator
