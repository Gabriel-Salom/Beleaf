// Lista de contendo todos os labels
var labels_date = [];
// Lista contendo apenas os labels para o gráfico
var labels_graph_date = [];

// Lista contendo todos os valores
var humidity_list = [];
var light_list = [];
var temperature_list = [];
var ph_list = [];
var conductivity_list = [];

// Lista contendo apenas os valores para o gráfico
var humidity_graph_list = [];
var light_graph_list = [];
var temperature_graph_list = [];
var ph_graph_list = [];
var conductivity_graph_list = [];

// Número de pontos no gráfico
var data_points = 5;

// Variavel para controle do led
var automatic_light = 0;

// Api URL
const api_url_chart = '/chart_data';
const api_url_config = '/config_elements';
const sse_url ='/listen';

//==============================================================
// Gauges 
var humidityopts = {
        // color configs
        colorStart: "#6FADCF",
        colorStop: "0B57DA",
        gradientType: 0,
        strokeColor: "#FFFFFF",
        generateGradient: true,
        percentColors: [[1.0, "#ff0000"]],
    
        // customize pointer
        pointer: {
          length: 0.8,
          strokeWidth: 0.035,
          iconScale: 1.0
        },
    
        // static labels
        staticLabels: {
          font: "10px sans-serif",
          labels: [0, 50, 100],
          fractionDigits: 0
        },
        
        // static zones
        staticZones: [
          {strokeStyle: "#F03E3E", min: 0, max: 40},
          {strokeStyle: "#FFDD00", min: 40, max: 50},
          {strokeStyle: "#30B32D", min: 50, max: 70},
          {strokeStyle: "#FFDD00", min: 70, max: 80},
          {strokeStyle: "#F03E3E", min: 80, max: 100}
        ],
        

        // render ticks
        renderTicks: {
          divisions: 0,
          divWidth: 1.1,
          divLength: 0.7,
          subDivisions: 3,
          subLength: 0.5,
          subWidth: 0.6,
        },
    
        // the span of the gauge arc
        angle: 0.15,
    
        // line thickness
        lineWidth: 0.44,
    
        // radius scale
        radiusScale: 1.0,
    
        // font size
        fontSize: 40,
    
        // if false, max value increases automatically if value > maxValue
        limitMax: 100,
    
        // if true, the min value of the gauge will be fixed
        limitMin: 0,
    
        // High resolution support
        highDpiSupport: true
    
};
var lightopts = {
        // color configs
        colorStart: "#6FADCF",
        colorStop: "0B57DA",
        gradientType: 0,
        strokeColor: "#FFFFFF",
        generateGradient: true,
        percentColors: [[1.0, "#ff0000"]],
    
        // customize pointer
        pointer: {
          length: 0.8,
          strokeWidth: 0.035,
          iconScale: 1.0
        },
    
        // static labels
        staticLabels: {
          font: "10px sans-serif",
          labels: [15000],
          fractionDigits: 0
        },
        
        // static zones
        staticZones: [
          {strokeStyle: "#F03E3E", min: 0, max: 10000},
          {strokeStyle: "#FFDD00", min: 10000, max: 15000},
          {strokeStyle: "#30B32D", min: 15000, max: 75000}
        ],
        

        // render ticks
        renderTicks: {
          divisions: 0,
          divWidth: 1.1,
          divLength: 0.7,
          subDivisions: 3,
          subLength: 0.5,
          subWidth: 0.6,
        },
    
        // the span of the gauge arc
        angle: 0.15,
    
        // line thickness
        lineWidth: 0.44,
    
        // radius scale
        radiusScale: 1.0,
    
        // font size
        fontSize: 40,
    
        // if false, max value increases automatically if value > maxValue
        limitMax: false,
    
        // if true, the min value of the gauge will be fixed
        limitMin: 0,
    
        // High resolution support
        highDpiSupport: true
    
};

var temperatureopts = {
    // color configs
    colorStart: "#6FADCF",
    colorStop: "0B57DA",
    gradientType: 0,
    strokeColor: "#FFFFFF",
    generateGradient: true,
    percentColors: [[1.0, "#ff0000"]],

    // customize pointer
    pointer: {
      length: 0.8,
      strokeWidth: 0.035,
      iconScale: 1.0
    },

    // static labels
    staticLabels: {
      font: "10px sans-serif",
      labels: [-20, 22, 27, 45],
      fractionDigits: 0
    },
    
    // static zones
    staticZones: [
      {strokeStyle: "#F03E3E", min: -20, max: 20},
      {strokeStyle: "#FFDD00", min: 20, max: 22},
      {strokeStyle: "#30B32D", min: 22, max: 27},
      {strokeStyle: "#FFDD00", min: 27, max: 29},
      {strokeStyle: "#F03E3E", min: 29, max: 45}
    ],
    

    // render ticks
    renderTicks: {
      divisions: 0,
      divWidth: 1.1,
      divLength: 0.7,
      subDivisions: 3,
      subLength: 0.5,
      subWidth: 0.6,
    },

    // the span of the gauge arc
    angle: 0.15,

    // line thickness
    lineWidth: 0.44,

    // radius scale
    radiusScale: 1.0,

    // font size
    fontSize: 40,

    // if false, max value increases automatically if value > maxValue
    limitMax: 100,

    // if true, the min value of the gauge will be fixed
    limitMin: 0,

    // High resolution support
    highDpiSupport: true

};

var phopts = {
    // color configs
    colorStart: "#6FADCF",
    colorStop: "0B57DA",
    gradientType: 0,
    strokeColor: "#FFFFFF",
    generateGradient: true,
    percentColors: [[1.0, "#ff0000"]],

    // customize pointer
    pointer: {
      length: 0.8,
      strokeWidth: 0.035,
      iconScale: 1.0
    },

    // static labels
    staticLabels: {
      font: "10px sans-serif",
      labels: [0, 5.5, 6.5, 14],
      fractionDigits: 1
    },
    
    // static zones
    staticZones: [
      {strokeStyle: "#F03E3E", min: 0, max: 5},
      {strokeStyle: "#FFDD00", min: 5, max: 5.5},
      {strokeStyle: "#30B32D", min: 5.5, max: 6.5},
      {strokeStyle: "#FFDD00", min: 6.5, max: 7},
      {strokeStyle: "#F03E3E", min: 7, max: 14}
    ],
    

    // render ticks
    renderTicks: {
      divisions: 1,
      divWidth: 1.1,
      divLength: 0.7,
      subDivisions: 3,
      subLength: 0.5,
      subWidth: 0.6,
    },

    // the span of the gauge arc
    angle: 0.15,

    // line thickness
    lineWidth: 0.44,

    // radius scale
    radiusScale: 1.0,

    // font size
    fontSize: 40,

    // if false, max value increases automatically if value > maxValue
    limitMax: 14,

    // if true, the min value of the gauge will be fixed
    limitMin: 0,

    // High resolution support
    highDpiSupport: true

};

var condopts = {
    // color configs
    colorStart: "#6FADCF",
    colorStop: "0B57DA",
    gradientType: 0,
    strokeColor: "#FFFFFF",
    generateGradient: true,
    percentColors: [[1.0, "#ff0000"]],

    // customize pointer
    pointer: {
      length: 0.8,
      strokeWidth: 0.035,
      iconScale: 1.0
    },

    // static labels
    staticLabels: {
      font: "10px sans-serif",
      labels: [0, 1, 2, 4],
      fractionDigits: 1
    },
    
    // static zones
    staticZones: [
      {strokeStyle: "#F03E3E", min: 0, max: 1},
      {strokeStyle: "#FFDD00", min: 1, max: 1.2},
      {strokeStyle: "#30B32D", min: 1.2, max: 2},
      {strokeStyle: "#FFDD00", min: 2, max: 2.2},
      {strokeStyle: "#F03E3E", min: 2.2, max: 4}
    ],
    

    // render ticks
    renderTicks: {
      divisions: 1,
      divWidth: 1.1,
      divLength: 0.7,
      subDivisions: 3,
      subLength: 0.5,
      subWidth: 0.6,
    },

    // the span of the gauge arc
    angle: 0.15,

    // line thickness
    lineWidth: 0.44,

    // radius scale
    radiusScale: 1.0,

    // font size
    fontSize: 40,

    // if false, max value increases automatically if value > maxValue
    limitMax: 4,

    // if true, the min value of the gauge will be fixed
    limitMin: 0,

    // High resolution support
    highDpiSupport: true

};

var targetHumidity = document.getElementById('humidity_gauge'); 
var gaugeHumidity = new Gauge(targetHumidity).setOptions(humidityopts);
gaugeHumidity.maxValue = 100;
gaugeHumidity.setMinValue(0); 
gaugeHumidity.animationSpeed = 32

var targetLight = document.getElementById('light_gauge'); 
var gaugeLight = new Gauge(targetLight).setOptions(lightopts);
gaugeLight.maxValue = 75000;
gaugeLight.setMinValue(0); 
gaugeLight.animationSpeed = 32

var targetTemperature = document.getElementById('temperature_gauge'); 
var gaugeTemperature = new Gauge(targetTemperature).setOptions(temperatureopts);
gaugeTemperature.maxValue = 45;
gaugeTemperature.setMinValue(-20); 
gaugeTemperature.animationSpeed = 32

var targetPh = document.getElementById('ph_gauge'); 
var gaugePh = new Gauge(targetPh).setOptions(phopts);
gaugePh.maxValue = 14;
gaugePh.setMinValue(0); 
gaugePh.animationSpeed = 32

var targetCond = document.getElementById('conductivity_gauge'); 
var gaugeCond = new Gauge(targetCond).setOptions(condopts);
gaugeCond.maxValue = 4;
gaugeCond.setMinValue(0); 
gaugeCond.animationSpeed = 32


//==============================================================
//Teste SSE
var humidity = document.getElementById("humidity");
var light = document.getElementById("light");
var temperature = document.getElementById("temperature");
var ph = document.getElementById("ph");
var conductivity = document.getElementById("conductivity");

//Escutando ao stream de dados
var source = new EventSource(sse_url);

//Atualizando valores de data
source.addEventListener('date_posted', dateHandler, false);
function dateHandler(event) {
labels_date.push(event.data);
};
//Atualizando valores de umidade
source.addEventListener('humidity', humidityHandler, false);
function humidityHandler(event) {
humidity.innerHTML = event.data;    
humidity_list.push(event.data);
gaugeHumidity.set(parseInt(event.data));
};
//Atualizando valores de luminosidade
source.addEventListener('light', lightHandler, false);
function lightHandler(event) {
light.innerHTML = event.data;    
light_list.push(event.data);
gaugeLight.set(parseInt(event.data));
};
//Atualizando valores de temperatura
source.addEventListener('temperature', temperatureHandler, false);
function temperatureHandler(event) {
temperature.innerHTML = event.data;    
temperature_list.push(event.data);
gaugeTemperature.set(parseInt(event.data));
};
//Atualizando valores de ph
source.addEventListener('ph', phHandler, false);
function phHandler(event) {
ph.innerHTML = event.data;  
ph_list.push(event.data);  
gaugePh.set(parseFloat(event.data));
};
//Atualizando valores de conductivity
source.addEventListener('conductivity', conductivityHandler, false);
function conductivityHandler(event) {
conductivity.innerHTML = event.data;    
conductivity_list.push(event.data);
gaugeCond.set(parseFloat(event.data));
update_graph(40);
};

//==============================================================
// Função para atualizar o gráfico a cada 3 segundos
//setInterval(update_graph,3000);

// Função para dar update nos gráficos
function update_graph(points){
        labels_graph_date = labels_date.slice(Math.max(labels_date.length - points, 0))
        humidity_graph_list = humidity_list.slice(Math.max(humidity_list.length - points, 0))
        light_graph_list = light_list.slice(Math.max(light_list.length - points, 0))
        temperature_graph_list = temperature_list.slice(Math.max(temperature_list.length - points, 0))
        ph_graph_list = ph_list.slice(Math.max(ph_list.length - points, 0))
        conductivity_graph_list = conductivity_list.slice(Math.max(conductivity_list.length - points, 0))
        // Update no gráfico de umidade
        humidity_chart.data.datasets[0].labels = labels_graph_date;
        humidity_chart.data.datasets[0].data = humidity_graph_list;
        humidity_chart.update();

        // Update no gráfico de luz
        light_chart.data.datasets[0].labels = labels_graph_date;
        light_chart.data.datasets[0].data = light_graph_list;
        light_chart.update();

        // Update no gráfico de temperatura
        temperature_chart.data.datasets[0].labels = labels_graph_date;
        temperature_chart.data.datasets[0].data = temperature_graph_list;
        temperature_chart.update();

        // Update no gráfico de ph
        ph_chart.data.datasets[0].labels = labels_graph_date;
        ph_chart.data.datasets[0].data = ph_graph_list;
        ph_chart.update();

        // Update no gráfico de condutividade
        conductivity_chart.data.datasets[0].labels = labels_graph_date;
        conductivity_chart.data.datasets[0].data = conductivity_graph_list;
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
        for(var i = 0; i < data.length; i++) {
            labels_date.push(data[i].date_posted);
            humidity_list.push(data[i].humidity);
            light_list.push(data[i].light);
            temperature_list.push(data[i].temperature);
            ph_list.push(data[i].ph);
            conductivity_list.push(data[i].conductivity);
        }
    humidity.innerHTML = humidity_list[data.length-1];   
    gaugeHumidity.set(humidity_list[data.length-1]);

    light.innerHTML = light_list[data.length-1];   
    gaugeLight.set(light_list[data.length-1]);

    temperature.innerHTML = temperature_list[data.length-1];   
    gaugeTemperature.set(temperature_list[data.length-1]);

    ph.innerHTML = ph_list[data.length-1];   
    gaugePh.set(ph_list[data.length-1]);

    conductivity.innerHTML = conductivity_list[data.length-1];   
    gaugeCond.set(conductivity_list[data.length-1]);
    update_graph(40);
    })
};

/*
function update_graph(){
    $.getJSON(api_url_chart, function(data) {
        if(data.length > labels_date.length){
            for(var i = labels_date.length; i < data.length; i++) {
                id_list.push(data[i].id)
                labels_date.push(data[i].date_posted);
                humidity_list.push(data[i].humidity);
                light_list.push(data[i].light);
                temperature_list.push(data[i].temperature);
                ph_list.push(data[i].ph);
                conductivity_list.push(data[i].conductivity);
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
*/

// 
config_info();

var automatic_light_output = document.getElementById("automatic_light_output");
function config_info(){
    $.getJSON(api_url_config, function(data) {
            time_on_output.innerHTML = data.time_on/60;
            time_on.value = data.time_on/60;
            time_off_output.innerHTML = data.time_off/60;
            time_off.value = data.time_off/60;
            lux_max_output.innerHTML = data.lux_max;
            lux_max.value = data.lux_max;
            lux_min_output.innerHTML = data.lux_min;
            lux_min.value = data.lux_min;
            light_intensity_output.innerHTML = data.light_intensity;
            light_intensity.value = data.light_intensity;
            if (data.automatic_light == 1){
                automatic_light_output.className = "on";
                automatic_light_output.value = "on";
            }
            if (data.automatic_light == 0){
                automatic_light_output.className = "off";
                automatic_light_output.value = "off";
            }
    })
};

// =========================================================
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

// Intensidade do led
var light_intensity = document.getElementById("light_intensity");

var light_intensity_output = document.getElementById("light_intensity_output");
light_intensity_output.innerHTML = light_intensity.value;
light_intensity.oninput = function() {
    light_intensity_output.innerHTML = this.value;
}

function toggleState(item){
    if(item.className == "on") {
       item.className="off";
       item.value="off";
       automatic_light = 0;
       GenerateJSON();
    } else {
       item.className="on";
       item.value="on";
       automatic_light = 1;
       GenerateJSON();
    }
 }


// When the user releases the slider, sends the new data to the database
function GenerateJSON()
{
    var jsonData = {}
    jsonData['lux_max'] = parseInt(lux_max.value);
    jsonData['lux_min'] = parseInt(lux_min.value);
    jsonData['time_on'] = 60*parseInt(time_on.value);
    jsonData['time_off'] = 60*parseInt(time_off.value);
    jsonData['light_intensity'] = parseInt(light_intensity.value);
    jsonData['automatic_light'] = parseInt(automatic_light);;

    console.log(jsonData);

      $.ajax({
        type: "POST",
        url: "/config_elements",
        contentType: 'application/json',
        data: JSON.stringify(jsonData),
        dataType: 'json',
        success: function() {
            //console.log(data);
        }
        });
 }

time_on.onchange = function() {
    GenerateJSON();
}

time_off.onchange = function() {
    GenerateJSON();
}

lux_max.onchange = function() {
    GenerateJSON();
}

lux_min.onchange = function() {
    GenerateJSON();
}

light_intensity.onchange = function() {
    GenerateJSON();
}

// =========================================================
// Deletar todos os dados


function confirmDelete() {
    swal({
        title: "Atenção!",
        text: "Deseja limpar a base de dados? Uma vez realizado, o ato não poderá ser desfeito.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((isConfirm) => {
        if (isConfirm) {
        $.ajax({
            type: "DELETE",
            url: "/chart_data",
            success: function() {
                swal("Dados deletados com sucesso", "success");
            },
            error: function () {
                swal("Erro ao deletar!", "Por favor tente novamente", "error");
            }
        });
    }else{
        swal("Cancelado!", "Os dados estão a salvo... por enquanto!", "error");
        } 
    });
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