var ObjtableSolicitud;
var FechaDia;
function InicializarComponentesSolicitud() {
    $('#modalSolicitud').modal({ backdrop: 'static', keyboard: false });
    $('#modalEliminar').modal({ backdrop: 'static', keyboard: false, });
    $('#modalSolicitud').modal('hide');
    $('#modalEliminar').modal('hide');
    $("#txtNroCuenta").attr('disabled', 'disabled');  
    ObjtableSolicitud = $("#lstSolicitud").dataTable({
        destroy: true,
        //responsive: true,      
        dom: 'Bflr<"table-responsive"t>ip',
        buttons: ['copy', 'csv', 'print'],
        columns: [            
            { "data": "nroHistoria", className: 'ContCenter'},
            { "data": "paciente", className: 'ContCenter' },
            { "data": "telefono" },
            { "data": "servicio" },
            { "data": "fechaCita" },          
            { "data": "doctor" },
            { "data": "estado" },
            { "data": "plan" },
            { "data": "operaciones", className: 'ContCenter' },
            { "data": "idEstado", "visible": false }
        ]
    });
    var tableWrapper = $('#lstSolicitud_wrapper'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    // carga Estado 
    $.ajax({
        async: false,
        cache: false,
        url: "/SolicitudCitas/ListarEstadoSolicitud?area=ConsultaExterna",
        datatype: "json",
        type: "get",
        success: function (datos) {
     
            $('#cboEstado').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboEstado').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                //Cargando(0);
                alerta("ERROR", "Error listar tipos de servicio!", "2");
            }, 900)
        }
    });
    $(".hide_search").chosen({ disable_search_threshold: 10 });
    $('.chzn-select').chosen().trigger("chosen:updated");
    $('.chosen-container').css({ 'width': '100%' });
    Cargando(0);
}

function ListarSolicitud() {
    var Recurso
    Recurso = $("#lstSolicitud").data('source');
    Cargando(1);
    //var dat 
    $.ajax({
        method: "POST",
        url: Recurso,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            console.log(datos.table);
            Cargando(0)
            ObjtableSolicitud.fnClearTable();
            if (!isEmpty(datos.table)) {
                ObjtableSolicitud.fnAddData(datos.table);
            }
        },
        error: function (msg) {           
            Cargando(0)
        }
    })
}


function limpiarmodal() {
    $("#cboEstado").val(0);
    $('#txtNroCuenta').val("");
    $('#idSolicitud').val("");
    $('#txtComentario').val("");
    $("#cboEstado").trigger("chosen:updated");
}


function Guardar() {

    if (ValidarCampos() == false) {
        return false;
    };

    if (ValidarCuenta()==false) {
        return false;
    };

    var midata = new FormData();
    midata.append('idEstado', $("#cboEstado").val());
    midata.append('NroCuenta', $('#txtNroCuenta').val());
    midata.append('idSolicitud', $('#idSolicitud').val());
    midata.append('Comentario', $('#txtComentario').val());
    $.ajax({
        method: "POST",
        url: "/SolicitudCitas/GuardarSolicitud?area=ConsultaExterna",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            if (datos.respuesta > 0) {
                alerta(1, datos.mensaje);
                cerrarModal();
                ListarSolicitud();
            } else {
                alerta(2, datos.mensaje);
            }           
        },
        error: function (msg) {
            Cargando(0)
        }
    });
}


function ValidarCuenta(  ) {  
    var midata = new FormData();
    midata.append('NroCuenta', $('#txtNroCuenta').val());
    midata.append('idSolicitud', $('#idSolicitud').val());
    var rsp = false;
    $.ajax({
        method: "POST",
        url: "/SolicitudCitas/ValidarCuenta?area=ConsultaExterna",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            if (datos.table[0].rsp == 0) {
                alerta(2, datos.table[0].descripcion);
                rsp= false;
            }
            else {
                alerta(1, datos.table[0].descripcion);
                rsp= true;
            }
           
        },
        error: function (msg) {
            Cargando(0)
        }
    });
    return rsp;
}
function RegistrarSolicitud(idSolicitud, idProgramacion,idEstado,control) {
    
    var nroHistoria = $(control).parents("tr").find("td")[0].innerHTML;
    var nombre = $(control).parents("tr").find("td")[1].innerHTML;
    var telefono = $(control).parents("tr").find("td")[2].innerHTML;
    var consultorio = $(control).parents("tr").find("td")[3].innerHTML;
    var FecCita = $(control).parents("tr").find("td")[4].innerHTML;
    var Doctor = $(control).parents("tr").find("td")[5].innerHTML;
    var Estado = $(control).parents("tr").find("td")[6].innerHTML;
    $('#txtNroHistoria').val(nroHistoria);
    $('#txtPaciente').val(nombre);
    $('#txtTelefono').val(telefono);
    $("#txtServicio").val(consultorio);
    $('#txtFechaCita').val(FecCita);
    $('#txtMedico').val(Doctor);
    $('#modalSolicitud').modal('show');
    $("#cboEstado").val(idEstado);
    $("#cboEstado").trigger("chosen:updated");
    $('#idSolicitud').val(idSolicitud);
  
}
function cerrarModal() {
    $('#modalSolicitud').modal('hide');
    limpiarmodal();
}

function ValidarCampos() {  
    if ($("#cboEstado").val() == 0) { alerta(2, "Debe actualizar el estado."); $("#cboEstado").focus(); return false; }
    if ($("#txtNroCuenta").val() == "" && $("#cboEstado").val() == 1) { alerta(2, "Debe ingresar el Nro.Cuenta."); $("#txtNroCuenta").focus(); return false; }
    if ($("#txtComentario").val() == "") { alerta(2, "Debe ingresar un comentario."); $("#txtComentario").focus(); return false; }    
    return true;
}


function EventosSolicitud() {
    $('#cboEstado').on('change', function () {
        if ($('#cboEstado').val() == 1) {
            $("#txtNroCuenta").removeAttr('disabled');
        }
        else
        {          
            $("#txtNroCuenta").val("");
            $("#txtNroCuenta").attr('disabled', 'disabled');
        }
    });


}


$(document).ready(function () {
   
    InicializarComponentesSolicitud();
    ListarSolicitud();
    EventosSolicitud();
    $(".dataTables_scrollHeadInner .table").addClass("table-responsive");
    $(".dataTables_wrapper .dt-buttons .btn").addClass('btn-secondary').removeClass('btn-default');
   
});