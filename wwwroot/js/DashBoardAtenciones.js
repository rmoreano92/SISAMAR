var chart3;
var bandera = 0;
function eventos() {    
    $('#cboServicio').on('change', function () {
        cargarGrafico();
        CargarGraficoporAnio(-1);
        CargarGraficoporAnioMes(-1,-1);
    });
    $("#cboMes").trigger("chosen:updated");
}

function listarCombos() {
    $.ajax({
        async: false,
        cache: false,
        url: "/DashBoardEmergencia/ListarServicio?area=Emergencia",
        datatype: "json",
        type: "get",
        success: function (datos) {
            $('#cboServicio').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('.chzn-select').chosen().trigger("chosen:updated");
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar tipos de servicio!", "2");
            }, 900)
        }
    });
}

function cargarGrafico() {
    var midata = new FormData();
    var Datos
    midata.append('idTipoServicio', $("#cboServicio").val());
    $.ajax({
        method: "POST",
        url: "/DashBoardEmergencia/ListaAtendidosAnio?area=Emergencia",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            Datos = datos.table
        },
        error: function (msg) {
            //  Cargando(0)
        }
    });   
    var chart = c3.generate({
        size: {
            height: 240,
            width: 360
        },
        bindto: '#chart1',
        data: {
            json: Datos,
            keys: {
                x: 'anio',
                value: ['cantidad'],
            },
            labels: true,
            onclick: function (d, i) {
                var objs = Datos[d.index];
                CargarGraficoporAnio(objs.anio)
            }
        },
        colors: {
            cantidad: '#ff0000'
        },
        axis: {
            x: {
                x: ['Anio'],
                type: "category"
            }
        },
        tooltip: {
            show: false
        }
    });
    chart.transform('bar'); 
    chart.data.names({ cantidad: 'Atendidos' });

    

}

function CargarGraficoporAnio(Anio) {

    Cargando(1)
    var midata = new FormData();
    var DatosMeses
    midata.append('idTipoServicio', $("#cboServicio").val());
    midata.append('Anio', Anio);
    $.ajax({
        method: "POST",
        url: "/DashBoardEmergencia/ListadoAtendidosxAnio?area=Emergencia",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            DatosMeses = datos.table
        },
        error: function (msg) {
              Cargando(0)
        }
    });
    chart3 = c3.generate({
        title: {
            text: 'Atendidos del '+Anio
        },
        size: {
            height: 240,
            width: 360
        },
        bindto: '#chart2',
        data: {
            json: DatosMeses,
            keys: {
                x: 'nombreMes',
                value: ['cantidad'],
            },
            labels: true,
            onclick: function (d, i) {
                var objs = DatosMeses[d.index];
        
                CargarGraficoporAnioMes(Anio, objs.mes, objs.nombreMes)
            }
        },
        axis: {
            x: {
                x: ['nombreMes'],
                type: "category"
              

            }
         },
         tooltip: {
             show: false
         }
    });



    CargarGraficoporAnioMes(-1, -1);
    chart3.transform('bar');
    chart3.data.names({ cantidad: 'Atendidos' });
    Cargando(0);
}


function CargarGraficoporAnioMes(Anio,Mes,NombreMes) {

    Cargando(1)
    var Titulo = ''
    if (Anio !=-1) {
        Titulo=   'Atendidos del mes de ' + NombreMes + ' del ' + Anio
    }
        

    var midata = new FormData();
    var DatosMesesAnio
    midata.append('idTipoServicio', $("#cboServicio").val());
    midata.append('Anio', Anio);
    midata.append('Mes', Mes);
    $.ajax({
        method: "POST",
        url: "/DashBoardEmergencia/ListadoAtendidosxMes?area=Emergencia",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            console.log(datos);
            DatosMesesAnio = datos.table
        },
        error: function (msg) {
            Cargando(0)
        }
    });
    var chart4 = c3.generate({
        title: {
            text: Titulo
        },
        bindto: '#chart3',
        data: {
            json: DatosMesesAnio,
            keys: {
                x: 'dia',
                value: ['cantidad','evaluaciones'],
            },
            labels: true
        },
        axis: {
            x: {
                x: ['dia'],
                type: "category",
                tick: {
                    rotate: 75,
                    multiline: false,
                    
                },

            }
        },
        onclick: function (d, i) {
            //var objs = Datoss[d.index];
            //CargarGraficoporAnio(objs.anio)
        }
    });
    chart4.transform('bar');
    chart4.data.names({ cantidad: 'Atendidos',evaluaciones:'Atenciones' });
    Cargando(0);
}
function CambiarGrafico() {
    if (bandera == 0) {
        chart3.transform('bar');
        $("#btnCambiarGrafico").text("Lineal");
        bandera = 1
    } else {
        chart3.transform('area-spline');
        $("#btnCambiarGrafico").text("Barras");
        bandera = 0
    }
}
$(document).ready(function () {

    listarCombos();
    eventos();
    cargarGrafico();
    
});