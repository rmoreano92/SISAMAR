var chart3;
var bandera = 0;
function eventos() {    
    $('#cboServicio').on('change', function () {
        cargarGrafico();
        CargarGraficoporAnio(-1);
        CargarGraficoporAnioMes(-1, -1,'');
        CargarGraficoporAnioMesyTipo(-1,-1,'')
    });
    $("#cboMes").trigger("chosen:updated");
}

function listarCombos() {
    $.ajax({
        async: false,
        cache: false,
        url: "/DashBoardHosp/ListarServicio?area=Hospitalizacion",
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
        url: "/DashBoardHosp/ListaAtendidosAnio?area=Hospitalizacion",
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
    chart.data.names({ cantidad: 'N°.Hospitalizados' });

    

}

function CargarGraficoporAnio(Anio) {

    Cargando(1)
    var midata = new FormData();
    var DatosMeses
    midata.append('idTipoServicio', $("#cboServicio").val());
    midata.append('Anio', Anio);
    $.ajax({
        method: "POST",
        url: "/DashBoardHosp/ListadoAtendidosxAnio?area=Hospitalizacion",
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
    chart2 = c3.generate({
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
        
                CargarGraficoporAnioMes(Anio, objs.mes, objs.nombreMes);
                CargarGraficoporAnioMesyTipo(Anio, objs.mes, objs.nombreMes)
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



    CargarGraficoporAnioMes(-1, -1,'');
    CargarGraficoporAnioMesyTipo(-1, -1,'');
    chart2.transform('bar');
    chart2.data.names({ cantidad: 'N°.Hospitalizados' });
    Cargando(0);
}


function CargarGraficoporAnioMes(Anio,Mes,NombreMes) {

    Cargando(1)
    var Titulo = ''
    if (Anio !=-1) {
        Titulo =   'Hospitalizados del mes de ' + NombreMes + ' del ' + Anio
    }
        

    var midata = new FormData();
    var DatosMesesAnio
    midata.append('idTipoServicio', $("#cboServicio").val());
    midata.append('Anio', Anio);
    midata.append('Mes', Mes);
    $.ajax({
        method: "POST",
        url: "/DashBoardHosp/ListadoAtendidosxMes?area=Hospitalizacion",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
           // console.log(datos);
            DatosMesesAnio = datos.table
        },
        error: function (msg) {
            Cargando(0)
        }
    });
     chart3 = c3.generate({
        title: {
            text: Titulo
        },
        bindto: '#chart3',
        data: {
            json: DatosMesesAnio,
            keys: {
                x: 'dia',
                value: ['cantidad'],
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
    chart3.transform('bar');
    chart3.data.names({ cantidad: 'Hospitalizados' });
    Cargando(0);
}

function CargarGraficoporAnioMesyTipo(Anio, Mes, NombreMes) {

    Cargando(1)
    var Titulo = ''
    if (Anio != -1) {
        Titulo = 'Cesarea y Partos del mes de ' + NombreMes + ' del ' + Anio
    }


    var midata = new FormData();
    var DatosMesesAnio
    midata.append('idTipoServicio', $("#cboServicio").val());
    midata.append('Anio', Anio);
    midata.append('Mes', Mes);
    $.ajax({
        method: "POST",
        url: "/DashBoardHosp/ListadoAtendidosHospxMesyTipo?area=Hospitalizacion",
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
        bindto: '#chart4',
        data: {
            json: DatosMesesAnio,
            keys: {
                x: 'dia',
                value: ['cesarea', 'parto'],
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
    chart4.data.names({ cesarea: 'Cesarea', parto: 'Parto Natural' });
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


/********************************************************************************************************************/
function EsportarGrafico() {  
    exportChartToPng('chart1');
    exportChartToPng('chart2');
    exportChartToPng('chart3');
    exportChartToPng('chart4');
}


function exportChartToPng(chartID) {
    //fix weird back fill
    d3.select('#' + chartID).selectAll("path").attr("fill", "none");
    //fix no axes
    d3.select('#' + chartID).selectAll("path.domain").attr("stroke", "black");
    //fix no tick
    d3.select('#' + chartID).selectAll(".tick line").attr("stroke", "black");
    var svgElement = $('#' + chartID).find('svg')[0];
    saveSvgAsPng(svgElement, chartID + '.png');
}

/***********************************************************************************************************************/




$(document).ready(function () {

    listarCombos();
    eventos();
    cargarGrafico();
    
});