let form = document.getElementById('timeForm');
let numeroDeTimesInput = document.getElementById('numeroDeTimes');
let nomesDosTimesDiv = document.getElementById('nomesDosTimes');
let iniciarBtn = document.getElementById('iniciarBtn');
let tabelaDiv = document.getElementById('tabela');
let confrontosDiv = document.getElementById('confrontos');
let teste = document.getElementById('teste');
let teste2 = document.getElementById('teste2');
let teste3 = document.getElementById('teste3');
let teste4 = document.getElementById('teste4');
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
    let html = '<table><tr class="titulo"><th>Posição</th><th>Time</th><th>Pontos</th><th>Vitórias</th><th>Empates</th><th>Derrotas</th><th>Gols Marcados</th><th>Gols Sofridos</th></tr>';

    for (let i = 0; i < tabela.length; i++) {
        html += '<tr><td>' + (i+1) + '</td><td class="destaque">' + tabela[i].time + '</td><td>' + tabela[i].pontos + '</td><td>' + tabela[i].vitorias + '</td><td>' + tabela[i].empates + '</td><td>' + tabela[i].derrotas + '</td><td>' + tabela[i].golsMarcados + '</td><td>' + tabela[i].golsSofridos + '</td></tr>';
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
        input.placeholder = 'golsTime1-golsTime2';
        form.appendChild(input);
        input.className = "inputConfronto";

        let button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'Enviar Placar';
        button.className = "botaoConfronto";
        button.onclick = function() {
            let placar = form.getElementsByTagName('input')[0].value;

            let regex = /^\d+-\d+$/;
            if (!regex.test(placar)) {
                alert("Por favor, insira um placar válido.");
                return;
            }
            let gols = placar.split('-').map(Number);
            
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
                let primeiro = campeonato.tabela[0];
                let segundo = campeonato.tabela[1];
                let terceiro = campeonato.tabela[2];
            
                if (primeiro) {
                    let Plabel = document.createElement('label');
                    Plabel.innerHTML = primeiro.time;
                    campeao.appendChild(Plabel);
                    Plabel.className = "primeiroColocado";
                }
                if (segundo) {
                    let Slabel = document.createElement('label');
                    Slabel.innerHTML = segundo.time;
                    campeao.appendChild(Slabel);
                    Slabel.className = "segundoColocado";
                }
                if (terceiro) {
                    let Tlabel = document.createElement('label');
                    Tlabel.innerHTML = terceiro.time;
                    campeao.appendChild(Tlabel);
                    Tlabel.className = "terceiroColocado";
                }
            }
            
        };
        form.appendChild(button);
        confrontosDiv.appendChild(form);
    }
    teste2.style.display = 'block';
    teste3.style.display = 'block';
    teste4.style.display = 'block';
    campeonatoEmAndamento = true;

}