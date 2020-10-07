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

// =========================================================
// Teste do botão slider

// Tempo de acionamento da bomba
var time_on = document.getElementById("time_on");
var time_off = document.getElementById("time_off");

var time_on_output = document.getElementById("time_on_output");
var time_off_output = document.getElementById("time_off_output");

time_on_output.innerHTML = time_on.value;
time_off_output.innerHTML = time_off.value;

time_on.oninput = function() {
    time_on_output.innerHTML = this.value;
}

time_off.oninput = function() {
    time_off_output.innerHTML = this.value;
}

// Limites de luminosidade
var lux_max = document.getElementById("lux_max");
var lux_min = document.getElementById("lux_min");

var lux_max_output = document.getElementById("lux_max_output");
var lux_min_output = document.getElementById("lux_min_output");

lux_max_output.innerHTML = lux_max.value;
lux_min_output.innerHTML = lux_min.value;

lux_max.oninput = function() {
    lux_max_output.innerHTML = this.value;
}

lux_min.oninput = function() {
    lux_min_output.innerHTML = this.value;
}

// When the user releases the slider, sends the new data to the database
/*
time_on.onchange = function() {
    $.post( "/config_elements", function( data ) {
        $( ".result" ).html( data );
      });
}
*/

time_off.onchange = function() {
    console.log(this.value);
}

lux_max.onchange = function() {
    console.log(this.value);
}

lux_min.onchange = function() {
    console.log(this.value);
}

// =========================================================
