# Kółko i Krzyżyk

Gra "Kółko i Krzyżyk" w HTML, CSS i JavaScript. Po wygraniu, rysuje linię zwyciężcy za pomocą draw.

## Funkcje

4. **Rysowanie linii zwycięstwa na draw**  
   Po wygranej, na planszy rysowana jest linia pokazująca zwycięską kombinację.
   `function checkWin() {
    const winConditions = [
        // Kwadraciki, gdzie mozna wygrać
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];`
   To są zwycięskie kombinacje
   ` if (start === 0 && end === 2) {
        line.style.top = "50px";
        line.style.left = "0";
    } else if (start === 3 && end === 5) {
        line.style.top = "155px";
        line.style.left = "0";`
   To jest rysowanie linii
   
7. **Przycisk resetowania gry**  
   Pozwala zrestartować grę i zacząć od nowa bez odświeżania strony.
   `const resetBtn = document.querySelector("#resetBtn");
resetBtn.addEventListener("click", resetGame);
function resetGame() {
    gameBoard = ["","","","","","","","",""];
    currentPlayer = "X";
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.addEventListener("click", handleCellClick)

        const jestLine = document.querySelector(".line");
        if (jestLine) {
            jestLine.remove();
        }
    });`

9. **Responsywny układ planszy**  
   Gra działa dobrze na różnych urządzeniach.
