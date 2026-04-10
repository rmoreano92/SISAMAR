var chart3;
var bandera = 0;



function eventos() {
    $('#cboMes').on('change', function () {
        cargarGrafico();
    });

    $('#cboServicio').on('change', function () {
        cargarGrafico();
    });

    var Fecha = new Date;
    $("#cboMes").val(Fecha.getMonth());
    $("#cboMes").trigger("chosen:updated");
}

function listaMeses() {

    $.ajax({
        async: false,
        cache: false,
        url: "/DashBoard/ListarMeses?area=ConsultaExterna",
        datatype: "json",
        type: "get",
        success: function (datos) {
            console.log(datos)

            $('#cboMes').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboMes').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');

            });

            $(".hide_search").chosen({ disable_search_threshold: 10 });
           // $('.chzn-select').chosen().trigger("chosen:updated");

        },
        error: function (msg) {
            setTimeout(function () {
                //                    Cargando(0);
                alerta("ERROR", "Error listar meses!", "2");
            }, 900)
        }
    });
    $.ajax({
        async: false,
        cache: false,
        url: "/DashBoard/ListarServicio?area=ConsultaExterna",
        datatype: "json",
        type: "get",
        success: function (datos) {
            console.log(datos)

            $('#cboServicio').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });

            //$(".hide_search").chosen({ disable_search_threshold: 10 });
            $('.chzn-select').chosen().trigger("chosen:updated");

        },
        error: function (msg) {
            setTimeout(function () {

                //                    Cargando(0);
                alerta("ERROR", "Error listar tipos de servicio!", "2");
            }, 900)
        }
    });





}


function cargarGrafico() {
    // stacked area chart
    var midata = new FormData();
    var Datos
    var Atendidos
    var NoAtendidos
    midata.append('Mes', $("#cboMes").val());
    midata.append('idTipoServicio', $("#cboServicio").val());
    midata.append('idEspecialidad', 0);
    $.ajax({
        method: "POST",
        url: "/DashBoard/ListadoPrincipal?area=ConsultaExterna",
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

    /*********************CANTIDAD CITAS ATENDIDAS Y NO ATENDIDAS********************/
    $.ajax({
        method: "POST",
        url: "/DashBoard/ListadoCitasAtendidos?area=ConsultaExterna",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (data) {
            Atendidos = data.table;
            NoAtendidos = data.table1;

        },
        error: function (msg) {
            //  Cargando(0)
        }
    });
    /*********************CANTIDAD CITAS ATENDIDAS Y NO ATENDIDAS********************/



    var chart = c3.generate({
        bindto: '#chart2',
        data: {
            json: Datos,
            keys: {
                x: 'fecha',
                value: ['cantidad'],
            }
        },
        axis: {
            x: {
                x: ['fecha'],
                type: "category"

            }
        }

        
    });

     chart3 = c3.generate({
        bindto: '#chart3',
        data: {
            json: Atendidos,           
            keys: {
                x: 'fecha',
                value: ['atendidos', 'noAtendidos'],                
            }
        },
        axis: {
            x: {
                x: ['fecha'],
                type: "category"

            }
            
        }

    });


  

    setTimeout(function () {
        chart.transform('area-spline', 'cantidad');
        chart3.transform('area-spline', ['atendidos','noAtendidos']);
    }, 1000);

    //setTimeout(function () {
    //    chart.transform('area-spline', 'data2');
    //}, 2000);

    setTimeout(function () {
    
        chart3.transform('bar');
    }, 3000);

    setTimeout(function () {
        chart.transform('area-spline');
        chart3.transform('area-spline');
    }, 4000);

    
    // End of stacked area chart
}

function cargarAtencionesxCE() {
    var midata = new FormData();
    var Datos
    midata.append('FechaInicio', $("#FechaInicio").val());
    midata.append('FechaFin', $("#FechaFin").val());
    $.ajax({
        method: "POST",
        url: "/DashBoard/ListadoCitasAtendidasxCE?area=ConsultaExterna",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (data) {
            Datos = data.table;
        },
        error: function (msg) {
            //  Cargando(0)
        }
    });

    var chart1 = c3.generate({
        bindto: '#chart1',
        data: {
            json: Datos,
            keys: {
                x: 'consultorio',
                value: ['cantidad'],
            },
            onclick: function (d, i) {
                var objs = Datos[d.index];
                console.log(objs);
                console.log(i);
                $("#cboServicio").val(objs.idServicio);
                $("#cboServicio").trigger("chosen:updated");
               // $("#cboServicio").text();
                $('#cboServicio').change();
                i.style.backgroundColor = "red";

                //console.log("onclick", d, i);
            }
        },
        
        axis: {
            x: {
                x: ['consultorio'],
                type: "category",
                tick: {
                    rotate: 75,
                    multiline: false
                },
                height: 130

            }            
        },
       
    });
    chart1.transform('bar');

}


function CambiarGrafico() {
   
    console.log(bandera);
    if (bandera == 0) {
        chart3.transform('bar');
        $("#btnCambiarGrafico").text("Lineal");
        bandera=1
    } else {
        chart3.transform('area-spline');
        $("#btnCambiarGrafico").text("Barras");
        bandera=0
    }
    
}

function InicializarComponentes() {
    $('#FechaInicio').datepicker({
        todayHighlight: true,
        autoclose: true,
        orientation: "bottom"

    });
    $('#FechaFin').datepicker({
        todayHighlight: true,
        autoclose: true,
        orientation: "bottom"
    });
}


$(document).ready(function () {

    
    InicializarComponentes();
    listaMeses();
    eventos();
    //InicializarComponentes();

});