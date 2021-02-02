// Lista de labels
var labels_date = [];

// Lista contendo todos os valores
var humidity_list = [];
var light_list = [];
var temperature_list = [];
var ph_list = [];
var conductivity_list = [];


// Api URL
const api_url_chart = '/get_chart_data';

//==============================================================
//Range test



// Função para dar update nos gráficos
function update_lists(){
        // Update no gráfico de temperatura
        temperature_chart.data.datasets[0].labels = labels_date;
        temperature_chart.data.datasets[0].data = temperature_list;
        temperature_chart.update();
};


function clear_chart(){
    temperature_chart.clear();
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
    update_lists();
    })
};

// Função para atualizar o gráfico a cada 30 segundos
setInterval(update_graph,30000);

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