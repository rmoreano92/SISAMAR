var ObjtableVisitas;
var nTipo = 0;
function InicializarComponentesDerivacion() {
    $(".form_datetime").datetimepicker({
        format: "dd/mm/yyyy hh:ii",
        autoclose: true,
        todayBtn: true,
        minuteStep: 5
    });


    ObjtableVisitas = $("#lstVisita").dataTable({
        destroy: true,
        //responsive: true,      
        dom: 'Bflr<"table-responsive"t>ip',
        buttons: ['copy', 'csv', 'print'],
        columns: [
            { "data": "nroDocumento", className: 'ContCenter' },
            { "data": "paciente", className: 'ContCenter' },
            { "data": "consultorio" }
        ]
    });
}

function cargarGrafico() {
    // stacked area chart
    var midata = new FormData();
    var Datos
    midata.append('FechaInicio', $("#txtFechaInicio").val());
    midata.append('FechaFin', $("#txtFechaFin").val());
    $.ajax({
        method: "POST",
        url: "/DashBoardEmergencia/CantidadDerivacionEmergencia?area=Emergencia",
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
        title: {
            text: 'Derivacion y Atencion Emergencia  Desde:' + $("#txtFechaInicio").val() + ' Hasta:' + $("#txtFechaFin").val()
        },
        bindto: '#chart1',
        data: {
            json: Datos,
            keys: {
                x: 'descripcion',
                value: ['cantidad'],
            },
            labels: true,
            onclick: function (d, i) {
                var objs = Datos[d.index];
                console.log(objs.descripcion);
                ListarTabla(objs.descripcion)
            }
        },
        axis: {
            x: {
                x: ['descripcion'],
                type: "category"

            }
        }


    });
    chart.transform('bar');
}

function ListarTabla(Tipo) {

    $("#lblTitulo").text(Tipo);

    console.log(Tipo);
    var Recurso
    Recurso = $("#lstVisita").data('source');
    Cargando(1);
    var nTipo=0
    var midata
    if (Tipo == 'Derivacion') { nTipo = 1 }
    else if (Tipo == 'Admision') { nTipo = 2 }
    else { nTipo = 3 }

    var midata = new FormData();
    midata.append('FechaInicio', $("#txtFechaInicio").val());
    midata.append('FechaFin', $("#txtFechaFin").val());
    midata.append('Tipo', nTipo);



    //var dat 
    $.ajax({
        method: "POST",
        url: Recurso,
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            Cargando(0)
            ObjtableVisitas.fnClearTable();
            if (!isEmpty(datos.table)) {
                ObjtableVisitas.fnAddData(datos.table);
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    })
}

function DescargarExcel() {
    var midata = new FormData();
    midata.append('FechaInicio', $("#txtFechaInicio").val());
    midata.append('FechaFin', $("#txtFechaFin").val());
    midata.append('Tipo', nTipo);
    //$.ajax(
    //    {
    //        url: "/DashBoardEmergencia/Excel?area=Emergencia",
    //        contentType: 'application/json; charset=utf-8',
    //        datatype: 'json',
    //        data: midata,
    //        type: "GET",
    //        success: function () {
    //          //  window.location = '@Url.Action("DownloadAttachment", "PostDetail", new { studentId = 123 })';
    //        }
    //    });

    var FecIni = $("#txtFechaInicio").val();
    var FecFin = $("#txtFechaFin").val();
    var splFecIni = FecIni.split("/");
    var splFecFin = FecFin.split("/");
    console.log(splFecIni);
    FecIni = splFecIni[1] + "/" + splFecIni[0] + "/" + splFecIni[2];
    FecFin = splFecFin[1] + "/" + splFecFin[0] + "/" + splFecFin[2];

    var url = "/DashBoardEmergencia/Excel?area=Emergencia&FechaInicio=" + FecIni + "&FechaFin=" + FecFin;
    console.log(url);
    window.location.href = url;



  //  window.location = '/DashBoardEmergencia/Excel?area=Emergencia&FechaInicio:' + $("#txtFechaInicio").val() + '&FechaFin:' + $("#txtFechaFin").val() + '&Tipo:' + nTipo + ' })';


    
    //$.ajax({
    //    method: "POST",
    //    url: "/DashBoardEmergencia/Excel?area=Emergencia",
    //    data: midata,
    //    dataType: "json",
    //    processData: false,
    //    contentType: false,
    //    success: function (datos) {
    //        window.location = '/DashBoardEmergencia/Excel?area=Emergencia", new { ' + midata + ' })';
    //        Cargando(0)
    //    },
    //    error: function (msg) {
    //        Cargando(0)
    //    }
    //})

}



$(document).ready(function () {
    InicializarComponentesDerivacion();

});