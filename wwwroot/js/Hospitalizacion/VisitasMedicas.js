var ObjtableVisitas;
var FechaDia;
function InicializarComponentesVisitas() {
    $('#modalVisita').modal({ backdrop: 'static', keyboard: false });
    $('#modalEliminar').modal({ backdrop: 'static', keyboard: false, });
    $('#modalVisita').modal('hide');
    $('#modalEliminar').modal('hide');
    $('#FechaAlta').datepicker({
        todayHighlight: true,
        autoclose: true,
        orientation: "bottom"
    });
    $('#txtFechaEvaluacion').datepicker({
        todayHighlight: true,
        autoclose: true,
        orientation: "bottom"
    });
    $("#txtFechaEvaluacion").prop("disabled", true);
    var f = new Date();
    var dia = f.getDate();
    var mes = (f.getMonth() + 1);
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    FechaDia = dia + "/" + mes + "/" + f.getFullYear();


    ObjtableVisitas = $("#lstVisita").dataTable({
        destroy: true,
        //responsive: true,      
        dom: 'Bflr<"table-responsive"t>ip',
        buttons: ['copy', 'csv', 'print'],
        columns: [            
            { "data": "historiaClinica", className: 'ContCenter'},
            { "data": "paciente", className: 'ContCenter' },
            { "data": "servicioIngreso" },
            { "data": "datosAdicionales" },
           // { "data": "estadoLlamada" },
            { "data": "operaciones", className: 'ContCenter' }
        ]
    });
    var tableWrapper = $('#lstVisita_wrapper'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

    // carga servicios 
    $.ajax({
        async: false,
        cache: false,
        url: "/Visitas/ListarServicio?area=CallCenter",
        datatype: "json",
        type: "get",
        success: function (datos) {
            $('#cboServicio').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                //Cargando(0);
                alerta("ERROR", "Error listar tipos de servicio!", "2");
            }, 900)
        }
    });
    //condicion 
    $.ajax({
        async: false,
        cache: false,
        url: "/Visitas/ListarCondicion?area=CallCenter",
        datatype: "json",
        type: "get",
        success: function (datos) {
            $('#cboCondicion').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboCondicion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar tipos de servicio!", "2");
            }, 900)
        }
    });
    $(".form_datetime").datetimepicker({
        format: "dd/mm/yyyy hh:ii",
        autoclose: true,
        todayBtn: true,
        minuteStep: 5
    });
    $(".hide_search").chosen({ disable_search_threshold: 10 });
    $('.chzn-select').chosen().trigger("chosen:updated");
    $('.chosen-container').css({ 'width': '100%' });
    Cargando(0);
}

function ListarVisitas() {
    var Recurso
    Recurso = $("#lstVisita").data('source');
    Cargando(1);
    //var dat 
    $.ajax({
        method: "POST",
        url: Recurso,
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


function limpiarmodal() {
    $("#cboServicio").val(-1);
    $("#txtCama").val("");
    $("#cboCondicion").val(-1);
    $("#cboTipoParto").val(-1);
    $("#txtFechaParto").val("");
    $("#cboSexoRn").val(-1);
    $("#txtComplicaciones").val("");
    $("#SiVisita").prop('checked', false);
    $("#NoVisita").prop('checked', false);
    $("#SiAlta").prop('checked', false);
    $("#NoAlta").prop('checked', false); 
    $('#idCuenta').val("");
    $('#idPaciente').val("");
    $('#idVisita').val("");
    $("#cboServicio").trigger("chosen:updated");
    $("#cboCondicion").trigger("chosen:updated");
    $("#cboTipoParto").trigger("chosen:updated");
    $("#cboSexoRn").trigger("chosen:updated");
    $('#FechaAlta').val("");
    $("#txtPase").val("");
}


function Guardar() {

    if (ValidarCampos() == false) {
        return false;
    };
    var midata = new FormData();
    midata.append('idServicioActual', $("#cboServicio").val());
    midata.append('nroCama', $("#txtCama").val());
    midata.append('FechaEvaluacion', $("#txtFechaEvaluacion").val());
    midata.append('idCondicionMadre', $("#cboCondicion").val());
    midata.append('idTipoParto', $("#cboTipoParto").val());
    midata.append('FechaParto', $("#txtFechaParto").val());
    midata.append('SexoRN', $("#cboSexoRn").val());
    midata.append('ComplicacionesMadre', $("#txtComplicaciones").val());
    midata.append('NecesitaVisita', $('input:radio[name=necesitaVisita]:checked').val());
    midata.append('altaMedica', $('input:radio[name=altaMedica]:checked').val());
    midata.append('idCuenta', $('#idCuenta').val());
    midata.append('idPaciente', $('#idPaciente').val());
    midata.append('idVisita', $('#idVisita').val());
    midata.append('idEstadoLlamada', -1);
    midata.append('FechaAlta', $('#FechaAlta').val());
    midata.append('DocFamiliar',$("#txtPase").val());

           
    
    $.ajax({
        method: "POST",
        url: "/Visitas/GuardarVisita?area=CallCenter",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            if (datos.respuesta > 0) {
                alerta(1, datos.mensaje);
                cerrarModal();
                ListarVisitas();
            } else {
                alerta(2, datos.mensaje);
            }           
        },
        error: function (msg) {
            Cargando(0)
        }
    });
}


function EditarVisita( idVisita,control ) {
    var nroHistoria = $(control).parents("tr").find("td")[0].innerHTML;
    var nombre = $(control).parents("tr").find("td")[1].innerHTML;
    var telefono = $(control).parents("tr").find("td")[3].innerHTML;
    //asignar valores
    $('#txtNroHistoria').val(nroHistoria);
    $('#txtPaciente').val(nombre);
    $('#txtTelefono').val(telefono);
    var midata = new FormData();
    midata.append('idVisita', idVisita);
    $.ajax({
        method: "POST",
        url: "/Visitas/ObtenerVisita?area=CallCenter",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            //if (datos.respuesta > 0) {
            $("#cboServicio").val(datos.idServicioActual);
            $("#txtCama").val(datos.nroCama);
            $("#txtFechaEvaluacion").val(datos.fechaEvaluacionString);
            $("#cboCondicion").val(datos.idCondicionMadre);
            $("#cboTipoParto").val(datos.idTipoParto);
            $("#txtFechaParto").val(datos.fechaParto);
            $("#cboSexoRn").val(datos.sexoRN);
            $("#cboSexoRn").focus();
            $("#txtComplicaciones").val(datos.complicacionesMadre);
            if (datos.necesitaVisita == 1) {
                $("#SiVisita").prop('checked', true);
            } else {
                $("#NoVisita").prop('checked', true);
            }
            if (datos.altaMedica == 1) { $("#SiAlta").prop('checked', true); } else { $("#NoAlta").prop('checked', true); }

            if (datos.fechaAltaString == "01/01/1999") {
                $('#FechaAlta').val("");
            } else {
                $('#FechaAlta').val(datos.fechaAltaString);
            }
            $('#idCuenta').val(datos.idcuenta);
            $('#idPaciente').val(datos.idPaciente);
            $('#idVisita').val(datos.idVisita);
            $("#txtPase").val(datos.docFamiliar);
            $("#cboServicio").trigger("chosen:updated");
            $("#cboCondicion").trigger("chosen:updated");
            $("#cboTipoParto").trigger("chosen:updated");
            $("#cboSexoRn").trigger("chosen:updated");           
            $('#modalVisita').modal('show');
        },
        error: function (msg) {
            Cargando(0)
        }
    });
}
function RegistrarVisita(idCuenta, idPaciente, control) {
    
    var nroHistoria = $(control).parents("tr").find("td")[0].innerHTML;
    var nombre = $(control).parents("tr").find("td")[1].innerHTML;
    var telefono = $(control).parents("tr").find("td")[3].innerHTML;
    $("#txtFechaEvaluacion").val(FechaDia);
    //asignar valores
    $('#txtNroHistoria').val(nroHistoria);
    $('#txtPaciente').val(nombre);
    $('#txtTelefono').val(telefono);
    $('#idPaciente').val(idPaciente);
    $('#idCuenta').val(idCuenta);
    $('#idVisita').val(0);
    $('#modalVisita').modal('show');
    //$('.chosen-select', this).chosen();
   // $("select").chosen({ width: "inherit" }) 
}
function cerrarModal() {
    $('#modalVisita').modal('hide');
    limpiarmodal();
}

function EliminarVisita(idvisita,control) {
    var nombre = $(control).parents("tr").find("td")[1].innerHTML;
    swal({
        title: 'Eliminar',
        text: 'Estas seguro de eliminar la visita del paciente ' + nombre +' ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4fb7fe',
        cancelButtonColor: '#EF6F6C',
        confirmButtonText: 'Aceptar'
    }).then(function () {
        eliminar(idvisita)
        ListarPacientes();
    });
}


function eliminar(idVisita) {
    var midata = new FormData();
    midata.append('idVisita', idVisita);
    $.ajax({
        method: "POST",
        url: "/Visitas/EliminarVisita?area=CallCenter",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            if (datos.respuesta > 0) {
                alerta(1, datos.mensaje);
                cerrarModal();
                ListarVisitas();
            } else {
                alerta(2, datos.mensaje);
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    });
}



$('input[type=radio][name=altaMedica]').on('change', function () {
        if ($(this).val() == 1) {
            $("#FechaAlta").removeAttr('disabled');
        }
        else {
            $("#FechaAlta").prop("disabled", true);
        }
});

function ValidarCampos() {  
    if ($("#cboServicio").val() == -1) { alerta(2, "Debe seleccionar el servicio."); $("#cboServicio").focus(); return false; }
    if ($("#txtCama").val() == "") { alerta(2, "Debe ingresar la cama."); $("#txtCama").focus(); return false; }
    if ($("#cboCondicion").val() == -1) { alerta(2, "Debe seleccionar la condición."); $("#cboCondicion").focus(); return false; } 
    if ($('input:radio[name=altaMedica]').is(':checked')==false) {
        alerta(2, "Debe ingresar Alta Medica."); return false;
    }
    if ($('input:radio[name=necesitaVisita]:checked').val() == 1 && $("#txtPase").val() == "") {
        alerta(2, "Debe ingresar clave del pase."); return false;
    }
    if ($('input:radio[name=altaMedica]:checked').val() == 1) { return true }
    if ($("#txtFechaEvaluacion").val() == "") { alerta(2, "Debe ingresar la Fec.Evaluacion."); $("#txtFechaEvaluacion").focus(); return false; }
    if ($("#cboTipoParto").val() != -1 && $("#cboTipoParto").val() != 3) {
        if ($("#txtFechaParto").val() == "") { alerta(2, "Debe ingresar la fecha de parto."); $("#txtFechaParto").focus(); return false; }
        if ($("#cboSexoRn").val() == -1) { alerta(2, "Debe ingresar seleccionar el sexo del bebe."); $("#cboSexoRn").focus(); return false; }
     } 
    if ($('input:radio[name=necesitaVisita]:checked').val() == "") { alerta(2, "Debe ingresar si necesita visita."); return false; } 
   
    return true;
}


function Eventos() {
    $('#cboCondicion').on('change', function () {
        if ($('#cboCondicion').val() == 3) { $("#SiVisita").prop('checked', true); } else { $("#NoVisita").prop('checked', true); }
    });

    $('#cboTipoParto').on('change', function () {
        if ($('#cboTipoParto').val() == 3) {
            
            $("#txtFechaParto").prop("disabled", true);
            $('#cboSexoRn').prop('disabled', true);
            $("#cboSexoRn").trigger("chosen:updated");
        }
        else {
            $("#txtFechaParto").removeAttr('disabled');
            $("#cboSexoRn").removeAttr('disabled');
            $("#cboSexoRn").trigger("chosen:updated");
           // $('#cboSexoRn').prop('disabled', true).trigger("liszt:updated");
        }
    });
    
    $('input:radio[name=altaMedica]').on('change', function () {
        if ($('input:radio[name=altaMedica]:checked').val() == 1) {
            $("#FechaAlta").val(FechaDia);
            $("#SiVisita").prop('checked', true);

        } else {
            $("#FechaAlta").val("");
          //  $("#NoVisita").prop('checked', true);
        }

    });



    $('#lstVisita tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            ObjtableVisitas.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

}


$(document).ready(function () {
   
    InicializarComponentesVisitas();
    ListarVisitas();
    Eventos();
    $(".dataTables_scrollHeadInner .table").addClass("table-responsive");
    $(".dataTables_wrapper .dt-buttons .btn").addClass('btn-secondary').removeClass('btn-default');
   
});