var Objtable;
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

    $('#modalLlamada').modal({ backdrop: 'static', keyboard: false });
    $('#modalLlamada').modal('hide');


    Objtable = $("#mytable").dataTable({
        destroy: true,
         responsive: true,
        
        dom: 'Bflr<"table-responsive"t>ip',
        buttons: ['copy', 'csv', 'print'],

        columns: [
            { "data": "paciente" },
            { "data": "nroHistoriaClinica", className: 'ContCenter'  },
            { "data": "telefono", className: 'ContCenter' },
            { "data": "direccionDomicilio"  },
            { "data": "edadGestacional"  },
            { "data": "medico", className: 'ContCenter' },
            { "data": "operacion", className: 'ContCenter' }
        ],
        "bLengthChange": false, //thought this line could hide the LengthMenu
        "bInfo": false,
    });
    Cargando(0);


}

function ListarPacientes() {
    var FecIni = $("#FechaInicio").val();
    var FecFin = $("#FechaFin").val();
    if (FecIni == "" || FecFin == "")
    {
        alerta(2, "Ingrese las Fecha.");
        return;
    } 

    var midata = new FormData();
    midata.append('FechaInicio', FecIni);
    midata.append('FechaFin', FecFin);
    var Recurso
    Recurso = $("#mytable").data('source');
    Cargando(1);
    //var dat 
    $.ajax( {
        method: "POST",
        url: Recurso,
        //contentType: "application/json; charset=utf-8",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            console.log(datos);
            Cargando(0)
            Objtable.fnClearTable();
            if (!isEmpty(datos)) {
           Objtable.fnAddData(datos);
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    })
}

function Guardar() {
    var Descripcion = $("#Descripcion").val();
    if (Descripcion == "") {
        alerta(2, "Ingrese la descripción.");
        return;
    }
    var midata = new FormData();
        midata.append('idCita', $("#idCita").val());
        midata.append('idLlamada', $("#idLlamada").val());
        midata.append('descripcion', Descripcion);
        $.ajax({
        method: "POST",
        url: "/Paciente/GuardarLlamada?area=ConsultaExterna",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
           success: function (datos) {

               if (datos.respuesta > 0) {
                   alerta(1, datos.mensaje);
                   cerrarModal();
                   ListarPacientes();
               } else {
                   alerta(2, datos.mensaje);
               }

            console.log(datos);
        },
        error: function (msg) {
            Cargando(0)
        }
    });


}


function Editar(idllamada,idCita, Descripcion) {
    $('#idCita').val(idCita);
    $('#Descripcion').val(Descripcion);
    abrirModal(idCita);
    console.log(idllamada);
    $('#idLlamada').val(idllamada);
    $('#titulo').text("Editar Llamada.");
}
function abrirModal(idCita) {
    console.log(idCita);
    $('#modalLlamada').modal('show');
    $("#idCita").val(idCita);
    $('#titulo').text("Registrar Llamada.");
    $('#idLlamada').val(0);
    //$("#Descripcion").val("EN");
}
function cerrarModal() {
    $('#idCita').val("");
    $('#Descripcion').val("");
    $('#modalLlamada').modal('hide');
}
$(document).ready(function () {

    InicializarComponentes();

});