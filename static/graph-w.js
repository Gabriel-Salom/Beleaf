// Lista de labels
var labels_date = [];

// Lista contendo todos os valores
var humidity_list = [];
var light_list = [];
var temperature_list = [];
var ph_list = [];
var conductivity_list = [];
var waterflux_list = [];


// Api URL
const api_url_chart = '/get_chart_data';

//==============================================================
//Range test



// Função para dar update nos gráficos
function update_lists(){
        // Update no gráfico de condutividade
        waterflux_chart.data.datasets[0].labels = labels_date;
        waterflux_chart.data.datasets[0].data = waterflux_list;
        waterflux_chart.update();
};


function clear_chart(){
    waterflux_chart.clear();
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
            waterflux_list.push(data[i].waterflux);
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
            waterflux_list.shift();
            for(var i = (data.length-2); i < (data.length-1); i++) {
                labels_date.push(data[0].date_posted);
                humidity_list.push(data[0].humidity);
                light_list.push(data[0].light);
                temperature_list.push(data[0].temperature);
                ph_list.push(data[0].ph);
                conductivity_list.push(data[0].conductivity);
                waterflux_list.push(data[0].waterflux);
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
            waterflux_list = [];
            clear_chart();
        }
    })
};

// Criando o gráfico de water flow
var ctx = document.getElementById('waterflux_chart');
var waterflux_chart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: labels_date,
    datasets: [{
        label: 'Fluxo de água (ml/s)',
        data: conductivity_list,
        backgroundColor: [
            'rgba(91, 171, 255, 0.5)'
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