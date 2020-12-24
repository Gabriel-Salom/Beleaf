// Lista de labels
var labels_date = [];

// Lista contendo todos os valores
var humidity_list = [];
var light_list = [];
var temperature_list = [];
var ph_list = [];
var conductivity_list = [];

// Variavel para controle do led
var automatic_light = 0;

// Api URL
const api_url_chart = '/chart_data';

//==============================================================
//Range test



// Função para dar update nos gráficos
function update_lists(){
        // Update no gráfico de umidade
        humidity_chart.data.datasets[0].labels = labels_date;
        humidity_chart.data.datasets[0].data = humidity_list;
        humidity_chart.update();

        // Update no gráfico de luz
        light_chart.data.datasets[0].labels = labels_date;
        light_chart.data.datasets[0].data = light_list;
        light_chart.update();

        // Update no gráfico de temperatura
        temperature_chart.data.datasets[0].labels = labels_date;
        temperature_chart.data.datasets[0].data = temperature_list;
        temperature_chart.update();

        // Update no gráfico de ph
        ph_chart.data.datasets[0].labels = labels_date;
        ph_chart.data.datasets[0].data = ph_list;
        ph_chart.update();

        // Update no gráfico de condutividade
        conductivity_chart.data.datasets[0].labels = labels_date;
        conductivity_chart.data.datasets[0].data = conductivity_list;
        conductivity_chart.update();
};


function clear_chart(){
    humidity_chart.clear();
    light_chart.clear();
    temperature_chart.clear();
    ph_chart.clear();
    conductivity_chart.clear();
}

// Função para preencher o gráfico utilizando os valores existentes no banco de dados inicialmente
create_graph();

function create_graph(){
    $.getJSON(api_url_chart, function(data) {
        for(var i = (data.length-1); i >= 0; i--) {
            labels_date.push(data[i].date_posted);
            humidity_list.push(data[i].humidity);
            light_list.push(data[i].light);
            temperature_list.push(data[i].temperature);
            ph_list.push(data[i].ph);
            conductivity_list.push(data[i].conductivity);
        }
    humidity.innerHTML = humidity_list[humidity_list.length-1];   
    gaugeHumidity.set(humidity_list[humidity_list.length-1]);

    light.innerHTML = light_list[light_list.length-1];   
    gaugeLight.set(light_list[light_list.length-1]);

    temperature.innerHTML = temperature_list[temperature_list.length-1];   
    gaugeTemperature.set(temperature_list[temperature_list.length-1]);

    ph.innerHTML = ph_list[ph_list.length-1];   
    gaugePh.set(ph_list[ph_list.length-1]);

    conductivity.innerHTML = conductivity_list[conductivity_list.length-1];   
    gaugeCond.set(conductivity_list[conductivity_list.length-1]);
    update_lists();
    })
};

// Função para atualizar o gráfico a cada 20 segundos
setInterval(update_graph,20000);

function update_graph(){
    $.getJSON(api_url_chart, function(data) {
        // Gambiarra porque não da para implementar SSE no PythonAny :(

        if(data[0].date_posted != labels_date[labels_date.length-1]){
            labels_date.shift();
            humidity_list.shift();
            light_list.shift();
            temperature_list.shift();
            ph_list.shift();
            conductivity_list.shift();
            for(var i = (data.length-2); i < (data.length-1); i++) {
                labels_date.push(data[0].date_posted);
                humidity_list.push(data[0].humidity);
                light_list.push(data[0].light);
                temperature_list.push(data[0].temperature);
                ph_list.push(data[0].ph);
                conductivity_list.push(data[0].conductivity);
            }
            humidity.innerHTML = humidity_list[humidity_list.length-1];   
            gaugeHumidity.set(humidity_list[humidity_list.length-1]);
        
            light.innerHTML = light_list[light_list.length-1];   
            gaugeLight.set(light_list[light_list.length-1]);
        
            temperature.innerHTML = temperature_list[temperature_list.length-1];   
            gaugeTemperature.set(temperature_list[temperature_list.length-1]);
        
            ph.innerHTML = ph_list[ph_list.length-1];   
            gaugePh.set(ph_list[ph_list.length-1]);
        
            conductivity.innerHTML = conductivity_list[conductivity_list.length-1];   
            gaugeCond.set(conductivity_list[conductivity_list.length-1]);
            update_lists();
        }
        if(data.length == 0){
            labels_date = [];
            humidity_list = [];
            light_list = [];
            temperature_list = [];
            ph_list = [];
            conductivity_list = [];
            clear_chart();
        }
    })
};

// Criando o gráfico de umidade
var ctx = document.getElementById('humidity_chart');
var humidity_chart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: labels_date,
    datasets: [{
        label: 'Umidade',
        data: humidity_list,
        backgroundColor: [
            'rgba(0,153,255,0.2)'
        ],
        borderColor: [
            'rgba(120, 120, 64, 1)'
        ],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                }
            }]
        }
    }
});

// Criando o gráfico de luz
var ctx = document.getElementById('light_chart');
var light_chart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: labels_date,
    datasets: [{
        label: 'Luminosidade',
        data: light_list,
        backgroundColor: [
            'rgba(255,255,51,0.2)'
        ],
        borderColor: [
            'rgba(120, 120, 64, 1)'
        ],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                }
            }]
        }
    }
});

// Criando o gráfico de temperatura

var ctx = document.getElementById('temperature_chart');
var temperature_chart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: labels_date,
    datasets: [{
        label: 'Temperatura',
        data: temperature_list,
        backgroundColor: [
            'rgba(255,153,51,0.2)'
        ],
        borderColor: [
            'rgba(120, 120, 64, 1)'
        ],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                }
            }]
        }
    }
});

// Criando o gráfico de ph
var ctx = document.getElementById('ph_chart');
var ph_chart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: labels_date,
    datasets: [{
        label: 'Ph',
        data: ph_list,
        backgroundColor: [
            'rgba(102,255,153,0.2)'
        ],
        borderColor: [
            'rgba(120, 120, 64, 1)'
        ],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                }
            }]
        }
    }
});

// Criando o gráfico de condutividade
var ctx = document.getElementById('conductivity_chart');
var conductivity_chart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: labels_date,
    datasets: [{
        label: 'Condutividade',
        data: conductivity_list,
        backgroundColor: [
            'rgba(0,255,255,0.2)'
        ],
        borderColor: [
            'rgba(120, 120, 64, 1)'
        ],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    display: false
                }
            }]
        }
    }
});