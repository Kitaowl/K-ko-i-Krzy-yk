document.addEventListener('DOMContentLoaded', function() {
    // Pobieranie elementów z DOM
    const fileInput = document.getElementById('jsonFileInput');
    const generateBtn = document.getElementById('generateBtn');
    const changeStyleBtn = document.getElementById('changeStyleBtn');
    const contentContainer = document.getElementById('contentContainer');
    const errorMessage = document.getElementById('errorMessage');
    
    // Deklarujemy zmienne do przechowywania danych i bieżącego stylu
    let jsonData = null;
    let currentStyleIndex = 0;
    // Dostępne style, które mogą być użyte
    const availableStyles = ['style-default', 'style-modern', 'style-elegant'];
    
    // Obsługa zmiany pliku przez użytkownika
    fileInput.addEventListener('change', function(e) {
        // Reset komunikatu o błędzie
        errorMessage.textContent = '';
        
        // Pobieranie wybrany plik
        const file = e.target.files[0];
        
        // Przyciski nie działają, kiedy plik nie jest wybrany
        if (!file) {
            generateBtn.disabled = true;
            changeStyleBtn.disabled = true;
            return;
        }
        
        // FileRead odczytuje plik
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                // Parsujemy dane JSON z pliku
                jsonData = JSON.parse(e.target.result);
                // Włączenie przycisków po załadowaniu pliku
                generateBtn.disabled = false;
                changeStyleBtn.disabled = false;
                
                // Resetujemy indeks stylu przy nowym pliku
                currentStyleIndex = 0;
            } catch (error) {
                // Wyświetlaenie błędu, jeśli JSON nie jest poprawny
                errorMessage.textContent = 'Błąd w pliku JSON: ' + error.message;
                generateBtn.disabled = true;
                changeStyleBtn.disabled = true;
            }
        };
        
        reader.onerror = function() {
            // Wyświetlenie błędu, jeżeli się nie uda odczytać pliku
            errorMessage.textContent = 'Błąd podczas odczytu pliku';
            generateBtn.disabled = true;
            changeStyleBtn.disabled = true;
        };
        
        // Odczytanie plik jako tekst
        reader.readAsText(file);
    });
    
    // Obsługa kliknięcia przycisku generowania strony
    generateBtn.addEventListener('click', function() {
        // Jeśli nie ma załadowanych danych, wyświetli się błąd
        if (!jsonData) {
            errorMessage.textContent = 'Najpierw trzeba załadować plik JSON';
            return;
        }
        
        // Generacja stronę ze załadowanych danych
        generatePage(jsonData);
    });
    
    // Obsługa zmiany stylu
    changeStyleBtn.addEventListener('click', function() {
        // Jeśli brak danych, żadna akcja się nie wykonuje
        if (!jsonData) return;
        
        // Zmieniamy indeks stylu
        currentStyleIndex = (currentStyleIndex + 1) % availableStyles.length;
        // Generujemy stronę z nowym stylem
        generatePage(jsonData);
    });
    
    // Funkcja do generowania zawartości strony na podstawie danych JSON
    function generatePage(data) {
        // Czyścimy zawartość kontenera
        contentContainer.innerHTML = '';
        
        // Wybieramy styl: jeśli jest w danych JSON, używamy go, w przeciwnym razie stosujemy bieżący styl
        let selectedStyle;
        if (data.style && availableStyles.includes(data.style)) {
            selectedStyle = data.style;
            // Ustawiamy indeks na znaleziony styl
            currentStyleIndex = availableStyles.indexOf(data.style);
        } else {
            selectedStyle = availableStyles[currentStyleIndex];
        }
        
        console.log('Używany styl:', selectedStyle); // Debugowanie
        
        // Tworzymy główny kontener zawartości
        const contentDiv = document.createElement('div');
        contentDiv.className = `generated-content ${selectedStyle}`;
        
        // Generowanie nagłówka strony, jeśli jest obecny w danych
        if (data.title) {
            const title = document.createElement('h2');
            title.textContent = data.title;
            contentDiv.appendChild(title);
        }
        
        // Generowanie opisu, jeśli jest obecny w danych
        if (data.description) {
            const description = document.createElement('p');
            description.textContent = data.description;
            contentDiv.appendChild(description);
        }
        
        // Generowanie obrazka, jeśli jest obecny w danych
        if (data.imageUrl) {
            const image = document.createElement('img');
            image.src = data.imageUrl;
            image.alt = data.imageAlt || 'Obrazek';
            contentDiv.appendChild(image);
        }
        
        // Generowanie sekcji, jeśli są obecne w danych
        if (data.sections && Array.isArray(data.sections)) {
            data.sections.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'section';
                
                // Generowanie nagłówka sekcji
                if (section.title) {
                    const sectionHeader = document.createElement('div');
                    sectionHeader.className = 'section-header';
                    sectionHeader.textContent = section.title;
                    sectionDiv.appendChild(sectionHeader);
                }
                
                // Generowanie zawartości sekcji
                if (section.content) {
                    if (Array.isArray(section.content)) {
                        // Tworzymy listę, jeśli zawartość jest tablicą
                        const list = document.createElement('ul');
                        section.content.forEach(item => {
                            const listItem = document.createElement('li');
                            listItem.textContent = item;
                            list.appendChild(listItem);
                        });
                        sectionDiv.appendChild(list);
                    } else {
                        // Tworzymy paragraf, jeśli zawartość jest tekstem
                        const paragraph = document.createElement('p');
                        paragraph.textContent = section.content;
                        sectionDiv.appendChild(paragraph);
                    }
                }
                
                contentDiv.appendChild(sectionDiv);
            });
        }
        
        // Generowanie stopki, jeśli jest obecna w danych
        if (data.footer) {
            const footer = document.createElement('div');
            footer.className = 'footer';
            footer.textContent = data.footer;
            contentDiv.appendChild(footer);
        }
        
        // Dodajemy wygenerowaną zawartość do kontenera na stronie
        contentContainer.appendChild(contentDiv);
    }
});
