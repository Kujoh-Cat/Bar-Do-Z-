let coffeeCount = parseInt(localStorage.getItem("coffeeCount")) || 0;
let name = localStorage.getItem("name") || "";
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

document.addEventListener("DOMContentLoaded", function () {
    const isNameChosen = localStorage.getItem("nameChosen") === "true";

    if (isNameChosen) {
        const inputElement = document.getElementById("nameInput");
        const nameLabelElement = document.getElementById("nameLabel");
        const saveButtonElement = document.getElementById("saveButton");

        // Oculta os elementos se o nome já foi escolhido
        inputElement.style.display = "none";
        nameLabelElement.style.display = "none";
        saveButtonElement.style.display = "none";

        // Atualiza o atributo data-name-chosen no body para persistir entre recargas
        document.body.setAttribute("data-name-chosen", "true");
    }
});

function saveName() {
    const inputElement = document.getElementById("nameInput");
    const nameLabelElement = document.getElementById("nameLabel");
    const saveButtonElement = document.getElementById("saveButton");

    const newName = inputElement.value.trim();

    if (newName === "") {
        alert("Por favor, escolha um nome válido.");
        return;
    }

    name = newName;
    localStorage.setItem("name", name);
    localStorage.setItem("nameChosen", "true"); // Indica que o nome foi escolhido

    // Oculta os elementos após salvar o nome
    inputElement.style.display = "none";
    nameLabelElement.style.display = "none";
    saveButtonElement.style.display = "none";

    // Atualiza o atributo data-name-chosen no body para persistir entre recargas
    document.body.setAttribute("data-name-chosen", "true");
}

function updateLeaderboard() {
    const existingEntryIndex = leaderboard.findIndex(entry => entry.name === name);

    if (existingEntryIndex !== -1) {
        leaderboard[existingEntryIndex].coffees = coffeeCount;
    } else {
        const userFlag = getCountryFlag(); // Função para obter o emoji da bandeira
        leaderboard.push({ name, coffees: coffeeCount, flag: userFlag });
    }

    leaderboard.sort((a, b) => b.coffees - a.coffees);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    localStorage.setItem("coffeeCount", coffeeCount);

    const leaderboardElement = document.getElementById("leaderboard");
    leaderboardElement.innerHTML = "";
    leaderboard.slice(0, 5).forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${entry.flag || ""} ${entry.name}: ${entry.coffees} cafés`;
        leaderboardElement.appendChild(li);
    });
}

let productionMultiplier = 1;
let productionCooldown = false;

function makeCoffee() {
    if (!name) {
        alert("Escolha Seu Nome.");
        return;
    }

    if (productionMultiplier === 1) {
        coffeeCount++;
    } else {
        coffeeCount += productionMultiplier;
    }

    document.getElementById("coffeeCount").textContent = coffeeCount;

    if (coffeeCount % 300 === 0 && !productionCooldown) {
        alert("☕ • Dobro De Cafés! (30 Segundos)");
        doubleCoffeeProduction();
    }

    updateLeaderboard();
    localStorage.setItem("coffeeCount", coffeeCount); // Salva a quantidade de cafés no localStorage
}

function doubleCoffeeProduction() {
    productionMultiplier = 2;
    productionCooldown = true;
    updateButtonText();

    setTimeout(() => {
        productionMultiplier = 1;
        productionCooldown = false;
        updateButtonText();
        updateLeaderboard();
    }, 30000);
}

function updateButtonText() {
    const buttonText = productionMultiplier === 1 ? "Trabalhar" : `Trabalhar (x${productionMultiplier})`;
    document.getElementById("coffeeButton").textContent = buttonText;
}

// Adicionado para exibir o valor atual dos cafés ao carregar a página
document.getElementById("coffeeCount").textContent = coffeeCount;
updateButtonText();

function getCountryFlag() {
    let userFlag = "";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const countryCode = getCountryCode(position.coords.latitude, position.coords.longitude);
            userFlag = getFlagEmoji(countryCode);
        });
    }
    return userFlag;
}

function getCountryCode(latitude, longitude) {
    // Use serviços ou APIs externas para obter o código do país com base na latitude e longitude
    // Exemplo fictício: aqui você precisaria de uma API real ou um banco de dados para mapear as coordenadas para um país
    return "US";
}

function getFlagEmoji(countryCode) {
    // Mapeie códigos de país para emojis de bandeira
    // Adicione mais mapeamentos conforme necessário
    const flagMappings = {
        "US": "🇺🇸",
        "BR": "🇧🇷",
        // ...
    };

    return flagMappings[countryCode] || "";
}

const socket = io('http://127.0.0.1:8080');

socket.on('updateLeaderboard', (data) => {
    leaderboard = data;
    updateLeaderboard();
});

