var ObjtableVisitas;
var nTipo = 0;
var PacientesHosp = {

     
    () {
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
                { "data": "idCuentaAtencion", className: 'ContCenter' },

                { "data": "nombre", className: 'ContCenter' },
                { "data": "nroHistoriaClinica", className: 'ContCenter' },
                { "data": "plan", className: 'ContCenter' },
                { "data": "estadoPlan", className: 'ContCenter' },
                { "data": "servicioActual", className: 'ContCenter' },
                { "data": "FechaIngreso", className: 'ContCenter' },
                { "data": "HoraIngreso", className: 'ContCenter' }
            ]
      });




        $.ajax({
            async: false,
            cache: false,
            url: "/PlanificacionFamiliar/ListarTipoConsulta?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {

                $('#cboConsulta').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboConsulta').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</cboConsulta>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos deconsulta!", "2");
                }, 900)
            }
        });


    },

     cargarGrafico() {
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
            success:  (datos) {
                Datos = datos.table
            },
            error:  (msg) {
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
                onclick:  (d, i) {
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
     },

     ListarTabla(Tpo) {


        var midata = new FormData();
        midata.append('FechaInicio', $("#txtFechaInicio").val());
        midata.append('FechaFin', $("#txtFechaFin").val());
        midata.append('idEstado', nTipo);
        $.ajax({
            method: "POST",
            url: Recurso,
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success:  (datos) {
                Cargando(0)
                ObjtableVisitas.fnClearTable();
                if (!isEmpty(datos.table)) {
                    ObjtableVisitas.fnAddData(datos.table);
                }
            },
            error:  (msg) {
                Cargando(0)
            }
        })
    },

     DescargarExcel() {
        var midata = new FormData();
        midata.append('FechaInicio', $("#txtFechaInicio").val());
        midata.append('FechaFin', $("#txtFechaFin").val());
        midata.append('Tipo', nTipo);


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


     }

};



$(document).ready(function () {
    PacientesHosp.InicializarComponentes();

});