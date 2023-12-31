let form = document.getElementById('timeForm');
let numeroDeTimesInput = document.getElementById('numeroDeTimes');
let nomesDosTimesDiv = document.getElementById('nomesDosTimes');
let iniciarBtn = document.getElementById('iniciarBtn');
let tabelaDiv = document.getElementById('tabela');
let confrontosDiv = document.getElementById('confrontos');
let fasesDiv = document.getElementById('fases');
let teste = document.getElementById('teste');
let campeao = document.getElementById('campeao');

let timesCriados = false;

function criarTimes() {
    if (timesCriados) {
        alert("Os times já foram criados.");
        return;
    }
    let numeroDeTimes = parseInt(numeroDeTimesInput.value);

    if (numeroDeTimes < 2 || numeroDeTimes % 2 !== 0) {
        alert("O número de times deve ser par e maior ou igual a 2.");
        return;
    }

    for (let i = 0; i < numeroDeTimes; i++) {
        let input = document.createElement('input');
        input.className="nomeUsuario";
        input.id = 'time' + (i + 1);
        input.placeholder = 'Nome do time ' + (i + 1);
        nomesDosTimesDiv.appendChild(input);
    }
    iniciarBtn.style.display = 'block';
    teste.style.display = 'block';
    timesCriados = true;

}


function gerarConfrontos(times) {
    var confrontos = [];
    for (var i = 0; i < times.length; i += 2) {
        if (i + 1 < times.length) {
            confrontos.push([times[i], times[i + 1]]);
        } else {
            confrontos.push([times[i]]);
        }
    }
    return confrontos;
}

function handleButtonClick(i, confrontos, vencedores, faseAtual) {
    let form = document.getElementById('fase' + faseAtual + 'confronto' + (i + 1));
    let placarIda = form.getElementsByTagName('input')[0].value;
    let placarVolta = form.getElementsByTagName('input')[1].value;

    let regex = /^\d+x\d+$/;
    if (!regex.test(placarIda) || !regex.test(placarVolta)) {
        alert("Por favor, insira um placar válido.");
        return;
    }
    let golsIda = placarIda.split('x').map(Number);
    let golsVolta = placarVolta.split('x').map(Number);

    let golsTime1 = golsIda[0] + golsVolta[0];
    let golsTime2 = golsIda[1] + golsVolta[1];

    let vencedor;
    if (golsTime1 > golsTime2) {
        vencedor = confrontos[i][0];
    } else if (golsTime1 < golsTime2) {
        vencedor = confrontos[i][1];
    } else {
        alert("O jogo não pode terminar empatado. Por favor, insira um placar válido.");
        return;
    }
    vencedores.push(vencedor);

    form.getElementsByTagName('button')[0].disabled = true;

    let allButtonsClicked = true;
    for(let j = 0; j < confrontos.length; j++) {
        if(!document.getElementById('fase' + faseAtual + 'confronto' + (j + 1)).getElementsByTagName('button')[0].disabled) {
            allButtonsClicked = false;
            break;
        }
    }

    if(vencedores.length === confrontos.length && vencedores.length >= 1) {
        torneio(vencedores);
    }
}


function determinarVencedores(confrontos, faseAtual) {
    let vencedores = [];

    for(let i = 0; i < confrontos.length; i++) {
        let form = document.createElement('form');
        form.id = 'fase' + faseAtual + 'confronto' + (i + 1);
        form.className = 'Jogos';
    
        let label = document.createElement('label');
        label.innerHTML = confrontos[i][0] + " vs " + confrontos[i][1];
        form.appendChild(label);
        label.className = "timeConfronto";
    
        let inputIda = document.createElement('input');
        inputIda.type = 'text';
        inputIda.placeholder = 'Placar do jogo de ida (ex: 3 x 2)';
        form.appendChild(inputIda);
        inputIda.className = "inputConfronto";

        let inputVolta = document.createElement('input');
        inputVolta.type = 'text';
        inputVolta.placeholder = 'Placar do jogo de volta (ex: 2 x 1)';
        form.appendChild(inputVolta);
        inputVolta.className = "inputConfronto";
    
        let button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'Enviar Placar';
        button.className = "botaoConfronto";

        
        button.onclick = function() { handleButtonClick(i, confrontos, vencedores, faseAtual); };
        
        form.appendChild(button);


        confrontosDiv.appendChild(form);

    }
    
    return vencedores;
}

let faseAtual = 0;

function torneio(times) {
    let fase;
    switch(times.length) {
        case 16:
            fase = 'Oitavas de final';
            break;
        case 8:
            fase = 'Quartas de final';
            break;
        case 4:
            fase = 'Semifinais';
            break;
        case 2:
            fase = 'Final';
            break;
        default:
            fase = '';
    }

    if(fase) {
        let h2 = document.createElement('h2');
        h2.innerHTML = fase;

        let faseDiv = document.createElement('div');
        faseDiv.appendChild(h2);
        
        fasesDiv.appendChild(faseDiv);

        confrontosDiv = faseDiv;
    }

    if(times.length === 1) {
        campeao.innerHTML = "Parabéns! O campeão é " + times[0] + "!";
        campeao.style.display = 'block';
        let allButtons = document.getElementsByTagName('button');
        for(let i = 0; i < allButtons.length; i++) {
            allButtons[i].disabled = true;
        }
        return;
    }
    
    var confrontos = gerarConfrontos(times);
    var vencedores = determinarVencedores(confrontos, faseAtual);
    faseAtual++
}

document.getElementById('iniciarBtn').addEventListener('click', function() {
    let times = [];
    for (let i = 0; i < numeroDeTimesInput.value; i++) {
        let nomeDoTime = document.getElementById('time' + (i + 1)).value;
        if (!nomeDoTime) {
            alert("Por favor, preencha todos os nomes dos times.");
            return;
        }
        times.push(nomeDoTime);
    }

    torneio(times);
});