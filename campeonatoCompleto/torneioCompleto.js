let form = document.getElementById('timeForm');
let formCriar = document.getElementById('timeCriar');
let numeroDeTimesInput = document.getElementById('numeroDeTimes');
let nomesDosTimesDiv = document.getElementById('nomesDosTimes');
let iniciarBtn = document.getElementById('iniciarBtn');
let tabelaDiv = document.getElementById('tabela');
let confrontosDiv = document.getElementById('confrontos');
let teste = document.getElementById('teste');
let teste2 = document.getElementById('teste2');
let teste3 = document.getElementById('teste3');
let teste4 = document.getElementById('teste4');


let iniciarBtnDois = document.getElementById('iniciarBtnDois');
let confrontosDivDois = document.getElementById('confrontos-dois');
let fasesDiv = document.getElementById('fases');
let campeao = document.getElementById('campeao');

let timesCriados = false;

function criarTimes() {
    if (timesCriados) {
        alert("Os times já foram criados.");
        return;
    }
    let numeroDeTimes = parseInt(numeroDeTimesInput.value);

    if (numeroDeTimes < 3) {
        alert("O número de times deve ser par.");
        return;
    }

    numeroDeClassificados(numeroDeTimes)

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

function criarTabela(times) {
    let tabela = times.map(time => ({time: time, pontos: 0, vitorias: 0, empates: 0, derrotas: 0, golsMarcados: 0, golsSofridos: 0}));

    function sortearConfrontos() {
        let confrontos = [];
        for(let i = 0; i < tabela.length; i++) {
            for(let j = i + 1; j < tabela.length; j++) {
                confrontos.push([tabela[i].time, tabela[j].time]);
            }
        }   
        return confrontos;
    }
    

    function atualizarTabela(time1, time2, placar, gols) {
        for(let time of tabela) {
            if(time.time === time1) {
                if(placar === 'empate') {
                    time.pontos += 1;
                    time.empates += 1;
                } else if(placar === time1) {
                    time.pontos += 3;
                    time.vitorias += 1;
                } else {
                    time.derrotas += 1;
                }
                time.golsMarcados += gols[0];
                time.golsSofridos += gols[1];
            } else if(time.time === time2) {
                if(placar === 'empate') {
                    time.pontos += 1;
                    time.empates += 1;
                } else if(placar === time2) {
                    time.pontos += 3;
                    time.vitorias += 1;
                } else {
                    time.derrotas += 1;
                }
                time.golsMarcados += gols[1];
                time.golsSofridos += gols[0];
            }
        }
        tabela.sort((a, b) => b.pontos - a.pontos  || b.vitorias - a.vitorias || b.golsMarcados - a.golsMarcados);
    }
    


    return {tabela, sortearConfrontos, atualizarTabela};
}


function apresentarTabela(tabela) {
    let numeroClassificados = numeroDeClassificados(tabela.length);
    let html = '<table><tr class="titulo"><th>Posição</th><th>Time</th><th>Pontos</th><th>Vitórias</th><th>Empates</th><th>Derrotas</th><th>Gols Marcados</th><th>Gols Sofridos</th></tr>';

    for (let i = 0; i < tabela.length; i++) {
        let classe = i < numeroClassificados ? 'classificado' : '';
        html += '<tr class="' + classe + '"><td>' + (i+1) + '</td><td class="destaque">' + tabela[i].time + '</td><td>' + tabela[i].pontos + '</td><td>' + tabela[i].vitorias + '</td><td>' + tabela[i].empates + '</td><td>' + tabela[i].derrotas + '</td><td>' + tabela[i].golsMarcados + '</td><td>' + tabela[i].golsSofridos + '</td></tr>';
    }

    html += '</table>';

    document.getElementById('tabela').innerHTML = html;
}

let campeonatoEmAndamento = false;

function iniciarCampeonato() {
    let times = [];
    for (let i = 0; i < numeroDeTimesInput.value; i++) {
        let nomeDoTime = document.getElementById('time' + (i + 1)).value;
        if (!nomeDoTime) {
            alert("Por favor, preencha todos os nomes dos times.");
            return;
        }
        times.push(nomeDoTime);
    }

    let campeonato = criarTabela(times);
    let confrontos = campeonato.sortearConfrontos();

    let resultados = [];

    if (campeonatoEmAndamento) {
        resultados = [];
        confrontosDiv.innerHTML = '';
    }
    
    for(let i = 0; i < confrontos.length; i++) {
        let form = document.createElement('form');
        form.id = 'confronto' + (i + 1);
        form.className = 'Jogos';

        let label = document.createElement('label');
        label.innerHTML = confrontos[i][0] + " vs " + confrontos[i][1];
        form.appendChild(label);
        label.className = "timeConfronto";

        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'ex: 3x2';
        form.appendChild(input);
        input.className = "inputConfronto";

        let button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'Enviar Placar';
        button.className = "botaoConfronto";
        button.onclick = function() {
            let placar = form.getElementsByTagName('input')[0].value;

            let regex = /^\d+x\d+$/;
            if (!regex.test(placar)) {
                alert("Por favor, insira um placar válido.");
                return;
            }
            let gols = placar.split('x').map(Number);
            
            let vencedor;
            if (gols[0] > gols[1]) {
                vencedor = confrontos[i][0];
            } else if (gols[0] < gols[1]) {
                vencedor = confrontos[i][1];
            } else {
                vencedor = 'empate';
            }

            resultados[i] = { time1: confrontos[i][0], time2: confrontos[i][1], placar: vencedor, gols: gols };

            campeonato.atualizarTabela(resultados[i].time1, resultados[i].time2, resultados[i].placar, resultados[i].gols);
            apresentarTabela(campeonato.tabela);

            button.disabled = true;
            if (resultados.length === confrontos.length && campeonato.tabela.length > 0) {
                let numeroClassificados = numeroDeClassificados(campeonato.tabela.length);
                let classificados = campeonato.tabela.slice(0, numeroClassificados);
                classificados = classificados.map(time => time.time);
                teste4.style.display = 'block';
                torneio(classificados);
            }
            
        };
        form.appendChild(button);
        confrontosDiv.appendChild(form);
    }
    form.style.display = 'none';
    formCriar.style.display = 'none';

    teste2.style.display = 'block';
    teste3.style.display = 'block';
    campeonatoEmAndamento = true;

}

/* Segunda-Fase */

function numeroDeClassificados(numeroDeTimes) {
    if (numeroDeTimes <= 4) {
        return 2;
    } else if (numeroDeTimes <= 8) {
        return 4;
    } else if (numeroDeTimes <= 16) {
        return 8;
    } else {
        return 16;
    }
}


function gerarConfrontos(times) {
    var confrontos = [];
    for (var i = 0; i < times.length / 2; i++) {
        confrontos.push([times[i], times[times.length - 1 - i]]);
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
        inputIda.placeholder = 'Placar do jogo de ida (ex: 3x2)';
        form.appendChild(inputIda);
        inputIda.className = "inputConfronto";

        let inputVolta = document.createElement('input');
        inputVolta.type = 'text';
        inputVolta.placeholder = 'Placar do jogo de volta (ex: 2x1)';
        form.appendChild(inputVolta);
        inputVolta.className = "inputConfronto";
    
        let button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'Enviar Placar';
        button.className = "botaoConfronto";

        
        button.onclick = function() { handleButtonClick(i, confrontos, vencedores, faseAtual); };
        
        form.appendChild(button);


        confrontosDivDois.appendChild(form);

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

        confrontosDivDois = faseDiv;
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