const api_url_chart = '/chart_data';
const api_url_image = '/image';
var last_date = 0;
//==============================================================
// Teste img
var image_path = [];
var slideShow = document.getElementById("slideshow");
var picturesDateOutput = document.getElementById("pictures_date_output");

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
      labels: [0, 50, 70, 100],
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
//Atualizando Gauges
var date = document.getElementById("date");
var humidity = document.getElementById("humidity");
var light = document.getElementById("light");
var temperature = document.getElementById("temperature");
var ph = document.getElementById("ph");
var conductivity = document.getElementById("conductivity");
var dot = document.getElementsByClassName('dot')[0];


get_info()

//Função para atualizar os valores do slider
function updateImage(image_path){
    //Atualiza a imagem para a mais recente
    newImage = new Image();
    newImage.src = 'static/live_image' + image_path[image_path.length-1];
    document.getElementById("image").src = newImage.src;
    //Atualiza o label para o mais recente
    var image_label = (image_path[image_path.length-1]).substring(0,(image_path[image_path.length-1]).length-4);
    image_label = image_label.substring(1)
    image_label = image_label.replace(/_/g, "/")
    image_label = image_label.replace(/=/g, ":")
    picturesDateOutput.innerHTML = image_label;
};

// Função para atualizar o gráfico a cada 31 segundos
setInterval(get_info,31000);


function get_info(){
    $.getJSON(api_url_chart, function(data) {
        // Gambiarra porque não da para implementar SSE no PythonAnywhere :(
            if(data[0].date_posted == last_date && last_date != 0){
                dot.style.backgroundColor  = "rgb(250, 41, 41)";
            } 
            else{
                dot.style.backgroundColor  = "rgb(34, 214, 49)";
                }           
            last_date = data[0].date_posted;
            date.innerHTML = data[0].date_posted;
            humidity.innerHTML = data[0].humidity;   
            gaugeHumidity.set(data[0].humidity);
        
            light.innerHTML = data[0].light;   
            gaugeLight.set(data[0].light);
        
            temperature.innerHTML = data[0].temperature; 
            gaugeTemperature.set(data[0].temperature);
        
            ph.innerHTML = data[0].ph;   
            gaugePh.set(data[0].ph);
        
            conductivity.innerHTML = data[0].conductivity;   
            gaugeCond.set(data[0].conductivity);
    })
    $.getJSON(api_url_image, function(data) {
      image_path = [];
      for(var i = 0; i < data.length; i++) {
        image_path.push(data[i]);
      }
      // Recebeu novas imagens, atualiza os valores da barra slider
      slideShow.min = 0;
      slideShow.max = image_path.length-1;
      slideShow.value = image_path.length-1;
      // Chama a função para atualizar as imagens e os labels
      updateImage(image_path);
  })
};

slideShow.oninput = function() {
  //Atualiza a imagem para a imagem que o usuário quer
  newImage = new Image();
  newImage.src = 'static/live_image' + image_path[this.value];
  document.getElementById("image").src = newImage.src;
  //Atualiza o label compativel com a imagem
  var image_label = (image_path[this.value]).substring(0,(image_path[this.value]).length-4);
  image_label = image_label.substring(1)
  image_label = image_label.replace(/_/g, "/")
  image_label = image_label.replace(/=/g, ":")
  picturesDateOutput.innerHTML = image_label;
}