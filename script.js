// Estado da Aplicação
const state = {
    adultsCount: 1,
    adults: [""],
    hasKids: null,
    kids: [{ name: "", age: "" }]
};

let currentStep = 1;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const countEl = document.getElementById('adultCount');
    if (countEl) {
        const initialCount = parseInt(countEl.innerText) || 1;
        state.adultsCount = initialCount;
        state.adults = new Array(initialCount).fill("");
    }

    renderAdultInputs();
    renderKidsInputs();
});

// PASSO 1: CONTADOR DE ADULTOS
function adjustAdults(delta) {
    if (state.adultsCount + delta >= 1) {
        state.adultsCount += delta;
        const adultCountEl = document.getElementById('adultCount');
        if (adultCountEl) adultCountEl.innerText = state.adultsCount;
        
        while (state.adults.length < state.adultsCount) state.adults.push("");
        while (state.adults.length > state.adultsCount) state.adults.pop();
        
        renderAdultInputs();
    }
}

// PASSO 2: INPUTS DOS ADULTOS
function renderAdultInputs() {
    const container = document.getElementById('adultInputsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    state.adults.forEach((name, index) => {
        const group = document.createElement('div');
        group.className = 'input-group';
        group.innerHTML = `
            <label>Adulto ${index + 1}</label>
            <input type="text" placeholder="Nome completo" value="${name}" oninput="state.adults[${index}] = this.value">
        `;
        container.appendChild(group);
    });
}

function addAdultInput() {
    state.adultsCount++;
    const adultCountEl = document.getElementById('adultCount');
    if (adultCountEl) adultCountEl.innerText = state.adultsCount;
    state.adults.push("");
    renderAdultInputs();
}

// PASSO 3: SELEÇÃO SIM / NÃO
function toggleKids(value) {
    state.hasKids = value;
    
    const cardSim = document.getElementById('cardSim');
    const cardNao = document.getElementById('cardNao');
    
    if (cardSim && cardNao) {
        if (value === true) {
            cardSim.classList.add('selected');
            cardNao.classList.remove('selected');
        } else if (value === false) {
            cardNao.classList.add('selected');
            cardSim.classList.remove('selected');
        }
    }
}

// ESTA FUNÇÃO FOI ADAPTADA PARA FUNCIONAR SEJA NO PASSO 3 OU NO PASSO 4
function handleKidsChoice() {
    // Se o usuário clicar enquanto estiver na tela do Passo 4 (Crianças), avança para o Passo 5
    if (currentStep === 4) {
        nextStep(5);
        return;
    }

    // confrimar se vai levar criança
    if (state.hasKids === null || state.hasKids === undefined) {
        alert("Por favor, selecione se você irá levar crianças ou não.");
        return;
    }

    if (state.hasKids === true) {
        if (!state.kids || state.kids.length === 0) {
            state.kids = [{ name: "", age: "" }];
        }
        renderKidsInputs();
        nextStep(4);
    } else {
        nextStep(5);
    }
}

// PASSO 4: INPUTS DAS CRIANÇAS
function renderKidsInputs() {
    const container = document.getElementById('kidsInputsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    state.kids.forEach((kid, index) => {
        const group = document.createElement('div');
        group.className = 'input-group';
        group.innerHTML = `
            <label>Criança ${index + 1}</label>
            <div class="input-row" style="display:flex; gap:8px;">
                <input type="text" placeholder="Nome" value="${kid.name || ''}" oninput="state.kids[${index}].name = this.value" style="flex:2">
                <input type="text" placeholder="Idade" value="${kid.age || ''}" oninput="state.kids[${index}].age = this.value" style="flex:1">
            </div>
        `;
        container.appendChild(group);
    });
}

function addKidInput() {
    state.kids.push({ name: "", age: "" });
    renderKidsInputs();
}

// VALIDAÇÕES
function validateStep2() {
    for (let i = 0; i < state.adults.length; i++) {
        if (!state.adults[i] || state.adults[i].trim() === "") {
            alert(`Por favor, preencha o nome do Adulto ${i + 1}.`);
            return false;
        }
    }
    return true;
}

function validateStep4() {
    if (!state.kids || state.kids.length === 0) {
        alert("Adicione pelo menos uma criança ou volte e selecione 'Não'.");
        return false;
    }

    for (let i = 0; i < state.kids.length; i++) {
        const kid = state.kids[i];
        const nameStr = kid && kid.name ? String(kid.name).trim() : "";
        const ageStr = kid && kid.age !== undefined && kid.age !== null ? String(kid.age).trim() : "";

        if (nameStr === "") {
            alert(`Por favor, informe o nome da Criança ${i + 1}.`);
            return false;
        }
        if (ageStr === "") {
            alert(`Por favor, informe a idade da Criança ${i + 1}.`);
            return false;
        }
    }
    return true;
}

// NAVEGAÇÃO
function nextStep(targetStep) {
    if (currentStep === 2 && targetStep > 2) {
        if (!validateStep2()) return;
    }

    if (currentStep === 4 && targetStep > 4) {
        if (!validateStep4()) return;
    }

    const currentActive = document.querySelector(`.step-page.active`);
    if (currentActive) {
        currentActive.classList.remove('active');
    }
    
    currentStep = targetStep;

    if (targetStep === 2) {
        renderAdultInputs();
    } else if (targetStep === 4) {
        if (!state.kids || state.kids.length === 0) {
            state.kids = [{ name: "", age: "" }];
        }
        renderKidsInputs();
    }

    const nextPage = document.getElementById(`step${targetStep}`);
    if (nextPage) {
        nextPage.classList.add('active');
    }
    
    updateHeaderUI(targetStep);

    if (targetStep === 5) {
        updateSummary();
    }
}

function prevStep(targetStep) {
    const currentActive = document.querySelector(`.step-page.active`);
    if (currentActive) {
        currentActive.classList.remove('active');
    }

    currentStep = targetStep;

    if (targetStep === 2) {
        renderAdultInputs();
    } else if (targetStep === 4) {
        renderKidsInputs();
    }

    const targetPage = document.getElementById(`step${targetStep}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    updateHeaderUI(targetStep);
}

function updateHeaderUI(step) {
    if (step <= 5) {
        const badge = document.getElementById('stepBadge');
        if (badge) badge.innerText = `${step} de 5`;

        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx < step);
        });
    }
}

// pagina confrimar informações
function updateSummary() {
    const summaryAdultCount = document.getElementById('summaryAdultCount');
    if (summaryAdultCount) summaryAdultCount.innerText = `${state.adultsCount} adultos`;

    const summaryAdultNames = document.getElementById('summaryAdultNames');
    if (summaryAdultNames) {
        summaryAdultNames.innerHTML = state.adults.filter(n => n && n.trim()).join('<br>') || 'Não informado';
    }

    const summaryHasKids = document.getElementById('summaryHasKids');
    if (summaryHasKids) summaryHasKids.innerText = state.hasKids ? 'Sim' : 'Não';
    
    const summaryKidsList = document.getElementById('summaryKidsList');
    if (summaryKidsList) {
        if (state.hasKids && state.kids.length > 0) {
            const kidsFormatted = state.kids
                .filter(k => k && k.name && String(k.name).trim())
                .map(k => `• ${k.name} - ${k.age || '?'} anos`)
                .join('<br>');
            summaryKidsList.innerHTML = kidsFormatted || 'Nenhuma';
        } else {
            summaryKidsList.innerText = 'Nenhuma';
        }
    }
}

// pagina final
function finishRsvp() {
    // Envia os dados para o e-mail via Web3Forms
    const formData = new FormData();
    formData.append("access_key", "d7a7e438-47cb-4ad3-9338-3404a6009ad7");
    formData.append("subject", "🎉 Nova Confirmação de Presença - Festa da Maya");
    formData.append("from_name", "Convite da Maya");
    
    formData.append("Adultos (" + state.adultsCount + ")", state.adults.filter(n => n && n.trim()).join(", "));
    formData.append("Crianças", state.hasKids ? state.kids.map(k => `${k.name} (${k.age || '?'} anos)`).join(", ") : "Não");

    fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });

    // Mantém exatamente o seu código de transição de telas e comemoração
    const topBanner = document.getElementById('topBanner');
    if (topBanner) topBanner.style.display = 'none';

    const step5 = document.getElementById('step5');
    if (step5) step5.classList.remove('active');

    const stepSuccess = document.getElementById('stepSuccess');
    if (stepSuccess) stepSuccess.classList.add('active');

    launchCelebration();

    console.log("Dados do Formulário:", state);
}

// chuva de confetes
function launchCelebration() {
    if (typeof confetti !== 'function') return;

//    chuva de confetes nas cores da mesma paleta aquarela do convite
    const circoColors = ['#f7e9c1', '#d0e9e8', '#ffb6c1', '#ed99b7'];

   
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: circoColors
    });

//    duração da animação
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: circoColors
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: circoColors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Animação de entrada: Balões subindo por cima e revelando o site
function triggerOpeningBalloons() {
    // Cria a camada de abertura por cima de tudo
    const overlay = document.createElement('div');
    overlay.id = 'balloon-overlay';
    document.body.appendChild(overlay);

    // Cores do Circo Mágico
    const colors = ['#f7e9c1', '#d0e9e8', '#ffb6c1', '#ed99b7'];

    // Gera 35 balões distribuídos na tela para cobrir o conteúdo inicial
    for (let i = 0; i < 100; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'opening-balloon';

        const left = Math.random() * 100; // Posição na largura
        const size = Math.floor(Math.random() * 30) + 45; // Tamanho entre 45px e 75px
        const delay = Math.random() * 1.2; // Atrasos variados para subida natural
        const duration = Math.random() * 2 + 5.5; // Tempo de subida (3.5s a 5.5s)
        const color = colors[Math.floor(Math.random() * colors.length)];

        balloon.style.left = `${left}%`;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.25}px`;
        balloon.style.backgroundColor = color;
        balloon.style.animationDelay = `${delay}s`;
        balloon.style.animationDuration = `${duration}s`;

        overlay.appendChild(balloon);
    }

    // Remove a camada de balões do código depois que todos subirem (após 6 segundos)
    setTimeout(() => {
        overlay.remove();
    }, 5000);
}

// Inicia a animação assim que a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    triggerOpeningBalloons();
});

// =======================================================
// 1. O SEU CÓDIGO ATUAL (Troca de etapas do formulário)
// =======================================================
function goToStep(stepNumber) {
    // Esconde todas as etapas
    document.querySelectorAll('.step-page').forEach(step => {
        step.classList.remove('active');
    });

    // Mostra a etapa selecionada
    const currentStep = document.getElementById('step' + stepNumber);
    if (currentStep) {
        currentStep.classList.add('active');
    }
}


// =======================================================
// 2. O CÓDIGO NOVO (Envio do formulário para o seu e-mail)
// =======================================================
const form = document.getElementById('rsvpForm');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita recarregar a página

        const formData = new FormData(form);
        formData.append("access_key", "SUA_ACCESS_KEY_AQUI"); // Sua chave do Web3Forms
        formData.append("subject", "🎉 Nova Confirmação de Presença - Festa da Maya");

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Quando o e-mail é enviado com sucesso, aciona a tela final do leão e elefante
                document.querySelectorAll('.step-page').forEach(step => step.classList.remove('active'));
                document.getElementById('stepSuccess').classList.add('active');
            } else {
                alert("Ocorreu um erro ao enviar. Tente novamente.");
            }
        })
        .catch(error => {
            alert("Erro de conexão. Verifique sua internet.");
        });
    });
}
