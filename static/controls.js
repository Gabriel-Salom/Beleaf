const api_url_config = '/config_elements';

const api_url_last_value = '/last_value';

// =========================================================
// Pegando informações do server
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
            lightOnSchedule.value = data.lighton_schedule;
            lightOnSchedule_output.innerHTML = data.lighton_schedule;
            lightOffSchedule.value = data.lightoff_schedule;
            lightOffSchedule_output.innerHTML = data.lightoff_schedule;
            if (data.automatic_light == 1){
                automatic_light = 1;
                automatic_light_output.className = "on";
                automatic_light_output.value = "on";
            }
            if (data.automatic_light == 0){
                automatic_light = 0;
                automatic_light_output.className = "off";
                automatic_light_output.value = "off";
            }
    })

    $.getJSON(api_url_last_value, function(data) {
        light_intensity_output.innerHTML = data.last_intensity;
        light_intensity.value = data.last_intensity;
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

// =========================================================
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

// =========================================================
// Intensidade do led
var light_intensity = document.getElementById("light_intensity");
var light_intensity_output = document.getElementById("light_intensity_output");

light_intensity_output.innerHTML = light_intensity.value;
light_intensity.oninput = function() {
    light_intensity_output.innerHTML = this.value;
}


// =========================================================
//Light schedule
var lightOnSchedule = document.getElementById("lighton-schedule");
var lightOnSchedule_output = document.getElementById("lighton_schedule_output");

lightOnSchedule.oninput = function() {
    lightOnSchedule_output.innerHTML = this.value;
}

var lightOffSchedule = document.getElementById("lightoff-schedule");
var lightOffSchedule_output = document.getElementById("lightoff_schedule_output");

lightOffSchedule.oninput = function() {
    lightOffSchedule_output.innerHTML = this.value;
}

// =========================================================
//Botão ligar/desligar

function toggleState(item){
    if(item.className == "on") {
       item.className="off";
       item.value="off";
       automatic_light = 0;
       confirmChange();
    } else {
       item.className="on";
       item.value="on";
       automatic_light = 1;
       confirmChange();
    }
 }

// =========================================================
// When the user releases the slider, sends the new data to the database
function GenerateJSON()
{
    var jsonData = {}
    jsonData['lux_max'] = parseInt(lux_max.value);
    jsonData['lux_min'] = parseInt(lux_min.value);
    jsonData['time_on'] = 60*parseInt(time_on.value);
    jsonData['time_off'] = 60*parseInt(time_off.value);
    jsonData['light_intensity'] = parseInt(light_intensity.value);
    jsonData['automatic_light'] = parseInt(automatic_light);
    jsonData['lighton_schedule'] = parseInt(lightOnSchedule.value);
    jsonData['lightoff_schedule'] = parseInt(lightOffSchedule.value);

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
    
    var jsonlast = {}
    jsonlast['last_intensity'] = parseInt(light_intensity.value);

        $.ajax({
            type: "POST",
            url: "/last_value",
            contentType: 'application/json',
            data: JSON.stringify(jsonlast),
            dataType: 'json',
            success: function() {
                //console.log(data);
            }
            });
 }

time_on.onchange = function() {
    confirmChange();
}

time_off.onchange = function() {
    confirmChange();
}

lux_max.onchange = function() {
    confirmChange();
}

lux_min.onchange = function() {
    confirmChange();
}

light_intensity.onchange = function() {
    confirmChange();
}

lightOnSchedule.onchange = function() {
    confirmChange();
}

lightOffSchedule.onchange = function() {
    confirmChange();
}

//==========================================================
// Confirmar alteração

function confirmChange() {
    swal({
        title: "Atenção!",
        text: "Deseja salvar as alterações?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((isConfirm) => {
        if (isConfirm) {
            GenerateJSON();
        }else{
        config_info();
        swal("Cancelado!", "", "error");
        } 
    });
};

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