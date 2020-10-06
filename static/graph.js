// Lista de labels
var labels_date = [];

// Lista para valores de umidade, luz
var humidity_list = [];
var light_list = [];
var temperature_list = [];
var ph_list = [];
var conductivity_list = [];

// Api URL
const api_url = '/chart_data';

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

// Função para preencher o gráfico utilizando os valores existentes no banco de dados inicialmente
create_graph();

function create_graph(){
    $.getJSON(api_url, function(data) {
        for(var i = 0; i < data.length; i++) {
            labels_date.push(data[i].date_posted);
            humidity_list.push(data[i].humidity);
            light_list.push(data[i].light);
            temperature_list.push(data[i].temperature);
            ph_list.push(data[i].ph);
            conductivity_list.push(data[i].conductivity);
        }
    update_lists();
    })
};

// Função para atualizar o gráfico a cada 3 segundos
setInterval(update_graph,3000);

function update_graph(){
    $.getJSON(api_url, function(data) {
        if(data.length != labels_date.length){
            for(var i = labels_date.length; i < data.length; i++) {
                labels_date.push(data[i].date_posted);
                humidity_list.push(data[i].humidity);
                light_list.push(data[i].light);
                temperature_list.push(data[i].temperature);
                ph_list.push(data[i].ph);
                conductivity_list.push(data[i].conductivity);
            }
        update_lists();
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
    }
});