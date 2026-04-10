var ObjtablePlanificacion;
var FechaDia;
var idAccion;
var cero;
function InicializarComponentesPlanificacion()
{
    $('#modalPlanificacion').modal({ backdrop: 'static', keyboard: false });
    $('#modalEliminar').modal({ backdrop: 'static', keyboard: false, });
    $('#modalPlanificacion').modal('hide');
    $('#modalEliminar').modal('hide');
    $('#txtFechaFiltro').datepicker({
        todayHighlight: true,
        autoclose: true,
        orientation: "bottom"
    });
    var f = new Date();
    var dia = f.getDate();

    var mes = (f.getMonth() + 1);
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    FechaDia = dia + "/" + mes + "/" + f.getFullYear();
    $('#txtFechaFiltro').val(FechaDia);
    ObjtablePlanificacion =  $("#lstPlanificacion").dataTable({
        destroy: true,  
        data: null,
        info:false,
        bFilter: false,
        scrollY: '70vh',
        "autoWidth": false,
        scrollCollapse: true,
        bLengthChange: false,
        // dom: 'Bflr<"table-responsive"t>ip',
        buttons: [],
        columns: [
            { width: '10%', targets: 0,"data":  "nroCuenta", className: 'ContCenter' },
            { width: '30%', targets: 0,"data": "paciente", className: 'ContCenter' },
            { width: '10%', targets: 0, "data": "nroHistoriaClinica", className: 'ContCenter'  },
            { width: '10%', targets: 0,"data": "fecNac" },
            { width: '20%', targets: 0,"data": "servicioIngreso" },
            { width: '10%', targets: 0,"data": "fechaIngreso" },
            { width: '10%', targets: 0, "data": "plann" },
            { width: '0%', targets: 0, "data": "direccionDomicilio", "visible": false },
            { width: '0%', targets: 0, "data": "idEstadoAtencion", "visible": false },
            { width: '0%', targets: 0, "data": "horaEgreso", "visible": false },
            { width: '0%', targets: 0, "data": "idServicio", "visible": false }
            
        ],
        'rowCallback': function (row, data, index) {
            var idGrupo = $("#idGrupo").val();

            if (data.idEstadoAtencion == 0) {
                $(row).find('td:eq(0)').css('color', 'red');
                $(row).find('td:eq(1)').css('color', 'red');
                $(row).find('td:eq(2)').css('color', 'red');
                $(row).find('td:eq(3)').css('color', 'red');
                $(row).find('td:eq(4)').css('color', 'red');
                $(row).find('td:eq(5)').css('color', 'red');
                $(row).find('td:eq(6)').css('color', 'red');
            }

            if (idGrupo == 100 && data.horaEgreso != null ) {                
                $(row).find('td:eq(0)').css('color', 'blue');
                $(row).find('td:eq(1)').css('color', 'blue');
                $(row).find('td:eq(2)').css('color', 'blue');
                $(row).find('td:eq(3)').css('color', 'blue');
                $(row).find('td:eq(4)').css('color', 'blue');
                $(row).find('td:eq(5)').css('color', 'blue');
                $(row).find('td:eq(6)').css('color', 'blue');
            }

            if (idGrupo == 200 && data.cantEvaluacion > 0 && data.idEstadoAtencion != 0) {
                $(row).find('td:eq(0)').css('color', 'blue');
                $(row).find('td:eq(1)').css('color', 'blue');
                $(row).find('td:eq(2)').css('color', 'blue');
                $(row).find('td:eq(3)').css('color', 'blue');
                $(row).find('td:eq(4)').css('color', 'blue');
                $(row).find('td:eq(5)').css('color', 'blue');
                $(row).find('td:eq(6)').css('color', 'blue');

            }
            if (idGrupo == 300 && data.cantEvaluacion > 0 && data.idEstadoAtencion != 0) {
                $(row).find('td:eq(0)').css('color', 'blue');
                $(row).find('td:eq(1)').css('color', 'blue');
                $(row).find('td:eq(2)').css('color', 'blue');
                $(row).find('td:eq(3)').css('color', 'blue');
                $(row).find('td:eq(4)').css('color', 'blue');
                $(row).find('td:eq(5)').css('color', 'blue');
                $(row).find('td:eq(6)').css('color', 'blue');

            }


            //if (data[2].toUpperCase() == 'EE') {
            //    $(row).find('td:eq(2)').css('color', 'blue');
            //}
        }
    });
    Cargando(0);
}

function LlenarCombos() {
    var idServicio = $("#idServicio").val();
    var midata = new FormData();
    midata.append('idTipoServicio', idServicio);    

    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarComboRiesgoReproductivo?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboRiesgoReproductivo').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboRiesgoReproductivo').append('<option  value="' + obj.valor + '" lab="' + obj.lab + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar tipos de atención!", "2");
            }, 900)
        }
    });

    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarTipoAtencion?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboTipoAtencion').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboTipoAtencion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar tipos de atención!", "2");
            }, 900)
        }
    });

    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarRetiroMetodo?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboMetodoRetirado').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboMetodoRetirado').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar Metodo retirado!", "2");
            }, 900)
        }
    });

    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarFallaMetodo?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboFalla').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboFalla').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar falla de metodo!", "2");
            }, 900)
        }
    });

    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarEstadoUsuaria?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboEstadoUsuaria').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboEstadoUsuaria').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar falla de metodo!", "2");
            }, 900)
        }
    });

    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarTipoConsejeria?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboTipoConsejeria').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboTipoConsejeria').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar consejeria!", "2");
            }, 900)
        }
    });

    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarMetodosEfectoSecundario?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboMetodoEfectoSec').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboMetodoEfectoSec').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar metodos del efecto secundario!", "2");
            }, 900)
        }
    });

    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarSubClasificacionDiagnostico?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboTipoEfectoSec').empty();
            $('#cboTipoEfecto').empty();
            $('#cboTipoMetodo').empty();
            $('#cboLabTamizajeViolencia').empty();

            $('#cboTipoMetodo').append('<option  value="0">--Seleccione--</option>');

            $(datos.table).each(function (i, obj) {
                $('#cboTipoEfectoSec').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                $('#cboTipoEfecto').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                //$('#cboTipoMetodo').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                if (obj.valor == 'D') {
                    $('#cboTipoMetodo').append('<option  value="' + obj.valor + '">' + obj.descripcion + ' - (paciente nuevo en función al método)' + '</option>');
                }
                if (obj.valor == 'R') {
                    $('#cboTipoMetodo').append('<option  value="' + obj.valor + '">' + obj.descripcion + ' - (paciente continuador en función al método)' + '</option>');
                }
                
                $('#cboLabTamizajeViolencia').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar sub clasificacion!", "2");
            }, 900)
        }
    });

    $.ajax({
        async: false,
        cache: false,
        url: "/PlanificacionFamiliar/ListarMedicosObstetrasEnfermeras?area=Comun",
        datatype: "json",
        type: "get",
        success: function (datos) {
            let row = ObjtablePlanificacion.api(true).row('.selected').data()

            $('#cboProfesionalConsejeria').empty();
            $('#cboProfesionalMetodo').empty();
            $('#cboProfesionalRetiroMetodo').empty();
            $(datos.table).each(function (i, obj) {
                //alert(idServicio);
                if (obj.tipo == 0) {
                    $('#cboProfesionalConsejeria').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    $('#cboProfesionalMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    $('#cboProfesionalRetiroMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                }
                if (idServicio == 1) {
                    
                    if (obj.tipo == 6) {
                       
                    }
                    if (obj.tipo == 5) {
                        $('#cboProfesionalConsejeria').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                        $('#cboProfesionalMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                        $('#cboProfesionalRetiroMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    }
                    if (obj.tipo == 1) {
                        $('#cboProfesionalConsejeria').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                        $('#cboProfesionalMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                        $('#cboProfesionalRetiroMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    }
                }

                if (idServicio == 2) {
                    if (obj.tipo == 6) {
                        $('#cboProfesionalConsejeria').append('<option style="background: #b2e2f2"  value="' + obj.idMedico + '">' + obj.medico + '</option>'); // JDELGADO001.2
                    }
                    if (obj.tipo == 5) {
                        $('#cboProfesionalRetiroMetodo').append('<option style="background: #fdcae1"  value="' + obj.idMedico + '">' + obj.medico + '</option>'); // JDELGADO001.2
                        // $('#cboProfesionalMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    }
                    if (obj.tipo == 5 && row.idServicio != 8) {
                        $('#cboProfesionalConsejeria').append('<option style="background: #fdcae1"  value="' + obj.idMedico + '">' + obj.medico + '</option>'); // JDELGADO001.2
                        // $('#cboProfesionalMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    }
                    if (obj.tipo == 1) {
                        $('#cboProfesionalRetiroMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                        $('#cboProfesionalMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    }
                }
                
                if (idServicio == 3) {
                    if (obj.tipo == 6) {
                    }
                    if (obj.tipo == 5) {
                        $('#cboProfesionalConsejeria').append('<option style="background: #fdcae1"  value="' + obj.idMedico + '">' + obj.medico + '</option>');  // JDELGADO001.2
                        $('#cboProfesionalMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    }
                    if (obj.tipo == 1 && (obj.tipoEmpleado == 28 || obj.tipoEmpleado == 109 || obj.tipoEmpleado == 101)) { // JDELGADO001.2
                        $('#cboProfesionalConsejeria').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                        $('#cboProfesionalMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                        $('#cboProfesionalRetiroMetodo').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    }
                } 



            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar médicos!", "2");
            }, 900)
        }
    });

    $('#cboEstadoUsuaria').on('change', function () {

        if ($('#cboEstadoUsuaria').val() == 0) {
            limpiarNoAceptaMetodo();
            BloquearControles(true);
        }
        else {
            BloquearControles(false);
        }

        if ($('#cboEstadoUsuaria').val() != -1) {
            var midata = new FormData();
            midata.append('idEstadoUsuaria', $('#cboEstadoUsuaria').val());
            $.ajax({
                method: "POST",
                url: "/PlanificacionFamiliar/ListarMetodoxIdEstadoUsuaria?area=Comun",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                async: false,
                success: function (datos) {
                    $('#cboMetodo').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboMetodo').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    });
                    $("#cboMetodo").trigger("chosen:updated");
                },
                error: function (msg) {
                    setTimeout(function () {
                        alerta("ERROR", "Error listar procedimientos!", "2");
                    }, 900)
                }
            });

        }
    });

    $('#cboTipoMetodo').on('change', function () {

        $("#txtNroInsumos").val("");
        $("#txtNroInsumos").prop('disabled', false);

        if ($('#cboMetodo').val() == 8 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 8 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 18 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 18 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val('');
        }

        if ($('#cboMetodo').val() == 17 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 17 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val('');
        }

        if ($('#cboMetodo').val() == 15 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 15 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 20 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 20 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 4 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 4 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 5 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 5 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 6 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(10);
        }

        if ($('#cboMetodo').val() == 6 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(30);
        }

        if ($('#cboMetodo').val() == 7 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(10);
        }

        if ($('#cboMetodo').val() == 7 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(30);
        }

        if ($('#cboMetodo').val() == 2 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 2 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(4);
        }

        if ($('#cboMetodo').val() == 3 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 3 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 11 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 11 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val('');
        }

        if ($('#cboMetodo').val() == 21 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 21 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 9 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 9 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val('');
        }

        if ($('#cboMetodo').val() == 12 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 12 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('2');
        }

        if ($('#cboMetodo').val() == 13 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 13 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('3');
        }

        if (($('#cboMetodo').val() == 18 && $('#cboTipoMetodo').val() == 'R') || ($('#cboMetodo').val() == 19 && $('#cboTipoMetodo').val() == 'R')) { // BTB
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('');
        }



        if ($('#cboMetodo').val() == 11 || $('#cboMetodo').val() == 12 || $('#cboMetodo').val() == 15 || $('#cboMetodo').val() == 17 || $('#cboMetodo').val() == 18 || $('#cboMetodo').val() == 19) {
            $("#txtNroInsumos").prop('disabled', true);
        }
    })

    $("#cboMetodo").on('change', function () {
        //$("#txtNroInsumos").val("");
        $("#txtNroInsumos").attr("disabled", false);
        $("#txtNroInsumos").val("");

        if ($("#idServicio").val() == 1) {
            if ($("#cboEstadoUsuaria").val() == 9 && $("#cboMetodo").val()==11) {
                $("#txtNroInsumos").val("");
                $("#txtNroInsumos").attr("disabled",true);
            }
            if ($("#cboEstadoUsuaria").val() == 9 && $("#cboMetodo").val() == 19) {
                $("#txtNroInsumos").val("");
                $("#txtNroInsumos").attr("disabled", true);
            }
           
        }
        if ($("#idServicio").val() == 2) {
            if ($("#cboEstadoUsuaria").val() == 4 && $("#cboMetodo").val() == 19) {
                $("#txtNroInsumos").val("");
                $("#txtNroInsumos").attr("disabled", true);
            }
            if ($("#cboEstadoUsuaria").val() == 10 && $("#cboMetodo").val() == 19) {
                $("#txtNroInsumos").val("");
                $("#txtNroInsumos").attr("disabled", true);
            }
            if ($("#cboEstadoUsuaria").val() == 10 && $("#cboMetodo").val() == 11) {
                $("#txtNroInsumos").val("");
                $("#txtNroInsumos").attr("disabled", true);
            }
        }
        if ($("#idServicio").val() == 3) {
            if ($("#cboEstadoUsuaria").val() == 5 && $("#cboMetodo").val() == 17) {
                $("#txtNroInsumos").val("");
                $("#txtNroInsumos").attr("disabled", true);
            }
            if ($("#cboEstadoUsuaria").val() == 7 && $("#cboMetodo").val() == 18) {
                $("#txtNroInsumos").val("");
                $("#txtNroInsumos").attr("disabled", true);
            }
            if ($("#cboEstadoUsuaria").val() == 11 && $("#cboMetodo").val() == 19) {
                $("#txtNroInsumos").val("");
                $("#txtNroInsumos").attr("disabled", true);
            }
            if ($("#cboEstadoUsuaria").val() == 11 && $("#cboMetodo").val() == 11) {
                $("#txtNroInsumos").val("");
                $("#txtNroInsumos").attr("disabled", true);
            }

        }

        if ($('#cboMetodo').val() == 21 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 21 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 8 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 8 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 18 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 18 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val('');
        }

        if ($('#cboMetodo').val() == 17 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 17 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val('');
        }

        if ($('#cboMetodo').val() == 15 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 15 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 20 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 20 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 4 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 4 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 5 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 5 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 6 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(10);
        }

        if ($('#cboMetodo').val() == 6 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(30);
        }

        if ($('#cboMetodo').val() == 7 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(10);
        }

        if ($('#cboMetodo').val() == 7 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(30);
        }

        if ($('#cboMetodo').val() == 2 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 2 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(4);
        }

        if ($('#cboMetodo').val() == 3 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 3 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val(1);
        }

        if ($('#cboMetodo').val() == 11 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val(''); // ANTES ESTABA CON 1
        }

        if ($('#cboMetodo').val() == 11 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val('');
        }

        if ($('#cboMetodo').val() == 9 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 9 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").val('');
        }

        if ($('#cboMetodo').val() == 12 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 12 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('2');
        }

        if ($('#cboMetodo').val() == 13 && $('#cboTipoMetodo').val() == 'D') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('1');
        }

        if ($('#cboMetodo').val() == 13 && $('#cboTipoMetodo').val() == 'R') {
            $("#txtNroInsumos").prop('disabled', true);
            $("#txtNroInsumos").val('3');
        }

        

        if ($('#cboMetodo').val() == 11 || $('#cboMetodo').val() == 12 || $('#cboMetodo').val() == 15 || $('#cboMetodo').val() == 17 || $('#cboMetodo').val() == 18 || $('#cboMetodo').val() == 19) {
            $("#txtNroInsumos").prop('disabled', true);
        }
    });
    $('#cboMetodoEfectoSec').on('change', function () {
            var midata = new FormData();
                midata.append('idMetodoEfecto', $('#cboMetodoEfectoSec').val());
            $.ajax({
                method: "POST",
                url: "/PlanificacionFamiliar/ListarEfectoSecxMetodo?area=Comun",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                async: false,
                success: function (datos) {
                    $('#cboEfectoSec').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboEfectoSec').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    });
                    $("#cboEfectoSec").trigger("chosen:updated");
                },
                error: function (msg) {
                    setTimeout(function () {
                        alerta("ERROR", "Error listar efectos secundarios!", "2");
                    }, 900)
                }
            });

        
    });
             
   

    $(".hide_search").chosen({ disable_search_threshold: 10 });
    $('.chzn-select').chosen().trigger("chosen:updated");
    $('.hide_search').chosen().trigger("chosen:updated");
    $('.chosen-container').css({ 'width': '100%' });
}

function CargaMetodoxCargaUsuaria(idEstadoUsuaria) {
    var midata = new FormData();
    midata.append('idEstadoUsuaria', idEstadoUsuaria);
    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarMetodoxIdEstadoUsuaria?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboMetodo').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboMetodo').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $("#cboMetodo").trigger("chosen:updated");
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar procedimientos!", "2");
            }, 900)
        }
    });

}

function LlenarCondicionPaciente() {
    var midata = new FormData();
    midata.append('idNroCuenta', $("#txtNroCuenta").val());
    midata.append('idGrupo', $("#idGrupo").val());
    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/DevuelveCondicionPaciente?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $(datos.table).each(function (i, obj) {
                if (obj.categoria == "MGP") {
                    $("#txtCondServicio").val(obj.descripcion);
                    $("#hdnCondServicio").val(obj.idTipoCondicionPaciente);
                } else {
                    $("#txtCondEstablecimiento").val(obj.descripcion);
                    $("#hdnCondEstablecimiento").val(obj.idTipoCondicionPaciente);
                }
            });
        },
        error: function (msg) {
            setTimeout(function () {
                alerta(3, "Error al obtener las condiciones del paciente");
            }, 900)
        }
    });
}

function LlenarEfecto(idMetodoEfecto) {
    var midata = new FormData();
    midata.append('idMetodoEfecto', idMetodoEfecto);
    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/ListarEfectoSecxMetodo?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {
            $('#cboEfectoSec').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboEfectoSec').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $("#cboEfectoSec").trigger("chosen:updated");
        },
        error: function (msg) {
            setTimeout(function () {
                alerta("ERROR", "Error listar efectos secundarios!", "2");
            }, 900)
        }
    });
}

function ValidarAtencionPlanificacionFamiliar() {
    var midata = new FormData();
    midata.append('idNroCuenta', $("#txtNroCuenta").val());
    midata.append('idGrupo', $("#idGrupo").val());
    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/DevuelvePlanificacionFamiliar?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        async: false,
        success: function (datos) {            
            if (datos.table.length>0) {
                alert("Cuenta con atención");   
                idAccion = 1;
                $(datos.table).each(function (i, obj) {                    
                    $("#hdnCondEstablecimiento").val(obj.idTipoCondicionALEstab);
                    $("#hdnCondServicio").val(obj.idTipoCondicionAlServicio);
                    $("#txtCondEstablecimiento").val(obj.condicionEstablecimiento);
                    $("#txtCondServicio").val(obj.condicionServicio);
                    $("#cboTipoAtencion").val(obj.idTipoAtencion);
                    $("#cboTipoConsejeria").val(obj.idTipoConsejeria);
                    $("#txtNroConsejerias").val(obj.nroConsejeria);
                    $("#cboProfesionalConsejeria").val(obj.idProfesionalConsejeria);
                    $("#cboEstadoUsuaria").val(obj.idEstadoUsuaria);
                    CargaMetodoxCargaUsuaria(obj.idEstadoUsuaria);
                    $("#cboMetodo").val(obj.idMetodoAdmin);
                    $("#cboTipoMetodo").val(obj.idTipoMetodoAdmin);
                    $("#txtNroInsumos").val(obj.nroInsumosAdm == 0 ? '' : obj.nroInsumosAdm);
                    $("#cboProfesionalMetodo").val(obj.idProfesionalAdm);
                    $("#cboMetodoRetirado").val(obj.idMetodoRetirado);
                    $("#cboProfesionalRetiroMetodo").val(obj.idProfesionalRetiro);
                    $("#cboMetodoEfectoSec").val(obj.idMetodoEfect);
                    LlenarEfecto(obj.idMetodoEfect);
                    $("#cboTipoEfectoSec").val(obj.idTipoEfectSec);
                    $("#cboEfectoSec").val(obj.idEfecto);
                    $("#cboTipoEfecto").val(obj.idTipoEfecto);
                    $("#cboFalla").val(obj.idFalla);
                    if (obj.esCaptada==1) {
                        $("#chkUsuaria").prop("checked", true);
                    } else {
                        $("#chkUsuaria").prop("checked", false);
                    }

                    if (obj.esControl == 1) {
                        $("#chkControl").prop("checked", true);
                        $("#txtNroControl").removeAttr('disabled', 'disabled');
                    } else {
                        $("#chkControl").prop("checked", false);
                        $("#txtNroControl").attr('disabled', 'disabled');
                    }

                    if (obj.conDiscapacidad == 1) {
                        $("#chkConDiscapacidad").prop("checked", true);
                    } else {
                        $("#chkConDiscapacidad").prop("checked", false);
                    }

                    $("#chkNoAceptaMetodo").prop("checked", obj.noAceptaMetodo);
                    $("#chkControlDIU").prop("checked", obj.esControlDiu);
                    $("#chkControlImplante").prop("checked", obj.esControlImplante);

                    $("#chkEsPacienteProtegida").prop("checked", obj.esPacienteProtegida);
                    $("#chkEsGestante").prop("checked", obj.esGestante);



                    $("#cboRiesgoReproductivo").val(obj.idRiesgoReproductivo);

                    $("#txtNroControl").val(obj.nroControl);

                    if (obj.idMetodo == 0) {
                        BloquearControles(true);
                    }
                    $("#cboProcedimiento").val(obj.idProcedimiento);
                    $("#cboEfectoSecundario").val(obj.idefectosecundario);
                    $("#cboMetodoDefinitivo").val(obj.idMetodoDefinitivo);
                    $("#cboMetodoTemporal").val(obj.idMetodoTemporal);
                    $("#cboMedico").val(obj.idMedicoRealiza);

                    if ($("#chkNoAceptaMetodo").prop("checked")) {
                        $("#cboEstadoUsuaria").attr('disabled', true);
                        $("#cboMetodo").attr('disabled', true);
                        $("#cboTipoMetodo").attr('disabled', true);
                        $("#txtNroInsumos").attr('disabled', true);
                        $("#cboProfesionalMetodo").attr('disabled', true);
                        $("#chkControl").attr('disabled', true);
                        $("#txtNroControl").attr('disabled', true);
                        $("#chkControlDIU").attr('disabled', true);
                        $("#chkControlImplante").attr('disabled', true);

                        //$("#chkEsPacienteProtegida").attr('disabled', true);
                        //$("#chkEsGestante").attr('disabled', true);

                        $("#cboEstadoUsuaria").val(-1)
                        $("#cboMetodo").val(-1)
                        $("#cboTipoMetodo").val(-1)
                        $("#txtNroInsumos").val('')
                        $("#cboProfesionalMetodo").val(-1)
                        $("#chkControl").prop("checked", false)
                        $("#txtNroControl").val(0)
                        $("#chkControlDIU").prop("checked", false)
                        $("#chkControlImplante").prop("checked", false)

                        //$("#chkEsPacienteProtegida").prop("checked", false)
                        //$("#chkEsGestante").prop("checked", false)
                    }
                    

                })
                //$("#cboMetodo").change();
                //$("#txtNroInsumos").val(obj.nroInsumosAdm);
              //ahi ya comienzo a leer las dos tablas 
                $("#cboTipoAtencion").trigger("chosen:updated");
                $("#cboTipoConsejeria").trigger("chosen:updated");
                $("#cboProfesionalConsejeria").trigger("chosen:updated");
                $("#cboEstadoUsuaria").trigger("chosen:updated");
                $("#cboMetodo").trigger("chosen:updated");
                $("#cboTipoMetodo").trigger("chosen:updated");
                $("#cboProfesionalMetodo").trigger("chosen:updated");
                $("#cboMetodoRetirado").trigger("chosen:updated");
                $("#cboProfesionalRetiroMetodo").trigger("chosen:updated");
                $("#cboMetodoEfectoSec").trigger("chosen:updated");
                $("#cboTipoEfectoSec").trigger("chosen:updated");
                $("#cboEfectoSec").trigger("chosen:updated");
                $("#cboTipoEfecto").trigger("chosen:updated");
                $("#cboFalla").trigger("chosen:updated");
                $("#cboRiesgoReproductivo").trigger("chosen:updated");

                if ($('#cboMetodo').val() == 11 || $('#cboMetodo').val() == 12 || $('#cboMetodo').val() == 15 || $('#cboMetodo').val() == 17 || $('#cboMetodo').val() == 18 || $('#cboMetodo').val() == 19 || $('#cboMetodo').val() == 20) {
                    $("#txtNroInsumos").prop('disabled', true);
                }

                
            } 
        },
        error: function (msg) {
            setTimeout(function () {
                alerta(3, "Error al obtener las condiciones del paciente");
            }, 900)
        }
    });
}

function ListarAtencionesPlan() {
    var Recurso
    Recurso = $("#lstPlanificacion").data('source');
    Cargando(1);
    var midata = new FormData();
    midata.append('NroCuenta', $("#txtNroCuentaFiltro").val());
    midata.append('NroDocumento', $("#txtDniFiltro").val());
    midata.append('NroHistoria', $("#txtNroHistoriaFiltro").val());
    midata.append('ApPaterno', $("#txtApPaternoFiltro").val());
    midata.append('FechaAtencion', $("#txtFechaFiltro").val());
    midata.append('idGrupo', $("#idGrupo").val());
    //var dat 
    $.ajax({
        method: "POST",
        url: Recurso,
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            console.log(datos);
            Cargando(0)
            ObjtablePlanificacion.fnClearTable();
            if (!isEmpty(datos.table)) {
                if (datos.table.length > 0) {
                    ObjtablePlanificacion.fnAddData(datos.table);
                }
                
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    })
}

function LimpiarFiltros() {
    $("#txtCama").val("");
    $("#txtNroCuentaFiltro").val("");
    $("#txtDniFiltro").val("");
    $("#txtNroHistoriaFiltro").val("");
    $("#txtApPaternoFiltro").val("");
    $('#txtFechaFiltro').val(FechaDia);
    ListarAtencionesPlan();

}


function limpiarmodal() {
    $("#txtNroCuenta").val("");
    $("#txtCondEstablecimiento").val(0);
    $("#txtCondServicio").val(0);
    $("#hdnCondEstablecimiento").val(0);
    $("#hdnCondServicio").val(0);

   $("#cboTipoAtencion").val(-1);
   $("#cboTipoConsejeria").val(-1);
   $("#txtNroConsejerias").val("");
   $("#cboProfesionalConsejeria").val(-1);
   $("#cboEstadoUsuaria").val(-1);
   $("#cboMetodo").val(-1);
   $("#cboTipoMetodo").val(-1);
   $("#txtNroInsumos").val("");
   $("#cboProfesionalMetodo").val(-1);
   $("#cboMetodoRetirado").val(-1);
   $("#cboProfesionalRetiroMetodo").val(-1);
   $("#cboMetodoEfectoSec").val(-1);
   $("#cboTipoEfectoSec").val(-1);
   $("#cboEfectoSec").val(-1);
   $("#cboTipoEfecto").val(-1);
    $("#cboFalla").val(-1);

    $("#chkUsuaria").prop("checked", false);
    $("#chkControl").prop("checked", false);
    $("#chkConDiscapacidad").prop("checked", false);

    $("#chkNoAceptaMetodo").prop("checked", false);
    $("#chkControlDIU").prop("checked", false);
    $("#chkControlImplante").prop("checked", false);

    $("#chkEsPacienteProtegida").prop("checked", false);
    $("#chkEsGestante").prop("checked", false);

    $("#txtNroControl").attr('disabled', 'disabled');
    $("#txtNroControl").val(0);

    idAccion = 0;
    $("#cboTipoAtencion").trigger("chosen:updated");
    $("#cboTipoConsejeria").trigger("chosen:updated");
    $("#cboProfesionalConsejeria").trigger("chosen:updated");
    $("#cboEstadoUsuaria").trigger("chosen:updated");
    $("#cboMetodo").trigger("chosen:updated");
    $("#cboTipoMetodo").trigger("chosen:updated");
    $("#cboProfesionalMetodo").trigger("chosen:updated");
    $("#cboMetodoRetirado").trigger("chosen:updated");
    $("#cboProfesionalRetiroMetodo").trigger("chosen:updated");
    $("#cboMetodoEfectoSec").trigger("chosen:updated");
    $("#cboTipoEfectoSec").trigger("chosen:updated");
    $("#cboEfectoSec").trigger("chosen:updated");
    $("#cboTipoEfecto").trigger("chosen:updated");
    $("#cboFalla").trigger("chosen:updated");
    BloquearControles(false);
}

function limpiarNoAceptaMetodo() {
   
    $("#cboConsulta").val(-1);
    $("#cboProcedimientoEntrada").val(-1);
    $("#txtNroInsumos").val("");
    $("#cboProcedimiento").val(-1);
    $("#cboEfectoSecundario").val(-1);
    $("#cboMetodoDefinitivo").val(-1);
    $("#cboMetodoTemporal").val(-1);
    $("#cboMedico").val(-1);
    idAccion = 0;
    $("#cboConsulta").trigger("chosen:updated");
    $("#cboProcedimientoEntrada").trigger("chosen:updated");
 
    $("#cboProcedimiento").trigger("chosen:updated");
    $("#cboEfectoSecundario").trigger("chosen:updated");
    $("#cboMetodoDefinitivo").trigger("chosen:updated");
    $("#cboMetodoTemporal").trigger("chosen:updated");
    $("#cboMedico").trigger("chosen:updated");
   
}


function Guardar() {

    if (ValidarCampos() == false) {
        if ($("#cboTipoAtencion").val() == -1) { alerta(2, "Debe seleccionar el tipo de atención."); $("#cboTipoAtencion").focus(); return false; }
        if ($("#cboTipoConsejeria").val() == -1) { alerta(2, "Debe seleccionar el tipo de consejería."); $("#cboTipoConsejeria").focus(); return false; } // JDELGADO001.2
        if ($("#cboProfesionalConsejeria").val() == -1) { alerta(2, "Debe seleccionar el profesional."); $("#cboProfesionalConsejeria").focus(); return false; } // JDELGADO001.2
        if ($("#txtNroConsejerias").val() == '') { alerta(2, "Ingrese numero de consejerias."); $("#txtNroConsejerias").focus(); return false; } // JDELGADO001.2
        return false;
    };

    //if (!$("#chkNoAceptaMetodo").prop("checked")) {
    //    if ($("#cboMetodo").val() == -1) {
    //        alerta(2, "Debe inresar el metodo.")
    //        return false
    //    }
    //}
    var midata = new FormData();
    
    //if ($("#txtNroInsumos").val() == "") { $("#txtNroInsumos").val('') }

    //if ($("#txtNroConsejerias").val() == "") { $("#txtNroConsejerias").val('') }


    var MetodoEfecto = -1;
    if ($("#cboMetodoEfectoSec").val() != null) {
        MetodoEfecto = $("#cboMetodoEfectoSec").val();
    }


    var Efecto = -1;
    if ($("#cboEfectoSec").val() != null) {
        Efecto = $("#cboEfectoSec").val();
    }

    var idmetodo = -1;
    
    if ($("#cboMetodo").val() != null) {
        idmetodo = $("#cboMetodo").val();
    }

    if (idmetodo != -1) {
        if ($("#cboTipoMetodo").val() != 'D' && $("#cboTipoMetodo").val() != 'R') {
            alerta(3, "Debe seleccionar el Tipo de metodo.");
            return false;
        }
        if ($("#cboProfesionalMetodo").val()==-1) {
            alerta(3, "Debe seleccionar el profesional que administra.");
            return false;
        }

    }

    midata.append('IdCuentaAtencion', $("#txtNroCuenta").val());
    midata.append('IdTipoCondicionALEstab', $("#hdnCondEstablecimiento").val());
    midata.append('IdTipoCondicionAlServicio', $("#hdnCondServicio").val());
    midata.append('idTipoAtencion', $("#cboTipoAtencion").val());
    midata.append('idTipoConsejeria', $("#cboTipoConsejeria").val());
    midata.append('NroConsejeria', $("#txtNroConsejerias").val());
    midata.append('idProfesionalConsejeria', $("#cboProfesionalConsejeria").val());
    midata.append('idEstadoUsuaria', $("#cboEstadoUsuaria").val());
    midata.append('idMetodoAdmin', idmetodo);
    midata.append('idTipoMetodoAdmin', $("#cboTipoMetodo").val());
    midata.append('NroInsumosAdm', $("#txtNroInsumos").val());
    midata.append('idProfesionalAdm', $("#cboProfesionalMetodo").val());
    midata.append('idMetodoRetirado', $("#cboMetodoRetirado").val());
    midata.append('idProfesionalRetiro', $("#cboProfesionalRetiroMetodo").val());
    midata.append('idMetodoEfect', MetodoEfecto);
    midata.append('idTipoEfectSec', $("#cboTipoEfectoSec").val());
    midata.append('idEfecto', Efecto);
    midata.append('idTipoEfecto', $("#cboTipoEfecto").val());
    midata.append('idFalla', $("#cboFalla").val());
    midata.append('esCaptada', $('#chkUsuaria').is(':checked'));
    midata.append('esControl', $('#chkControl').is(':checked'));
    midata.append('nroControl', $("#txtNroControl").val());
    midata.append('ConDiscapacidad', $('#chkConDiscapacidad').is(':checked') ? 1 : 0);
    midata.append('idRiesgoReproductivo', $("#cboRiesgoReproductivo").val());

    midata.append('noAceptaMetodo', $('#chkNoAceptaMetodo').is(':checked') ? 1 : 0);
    midata.append('esControlDiu', $('#chkControlDIU').is(':checked') ? 1 : 0);
    midata.append('esControlImplante', $('#chkControlImplante').is(':checked') ? 1 : 0);

    midata.append('esPacienteProtegida', $('#chkEsPacienteProtegida').is(':checked') ? 1 : 0);
    midata.append('esGestante', $('#chkEsGestante').is(':checked') ? 1 : 0);

    //midata.append('lstComorbilidad', JSON.stringify(ListComorbilidad.toArray()));
    midata.append('idAccion', idAccion);
    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/GuardarPlanificacionFamiliar?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            if (datos.respuesta > 0) {
                alerta(1, datos.mensaje);
                cerrarModal();
                ListarAtencionesPlan();
            } else {
                alerta(2, datos.mensaje);
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    });
}


function ModificarPlanificacion() {
    limpiarmodal();
    LlenarCombos();
    $('#administracion-tab').click();
    var objrow = ObjtablePlanificacion.api(true).row('.selected').data();    
    if (isEmpty(objrow)) {
        alerta(2, "Debe seleccionar la atencion a modificar.");
        return false;
    }
    if (objrow.idEstadoAtencion == 0) {
        alerta(2, "La cuenta se encuentra Anulada.");
        return false;
    }
    $('#txtDatos').html('N°.Historia: ' + objrow.nroHistoriaClinica + ' / N°.Cuenta: ' + objrow.nroCuenta + ' / Paciente:' + objrow.paciente)
    HabilitarControlesPlani();
    $('#modalPlanificacion').modal('show');

    //asignar valores
    $('#txtNroCuenta').val(objrow.nroCuenta);
    $('#txtNroHistoria').val(objrow.nroHistoriaClinica);
    $('#txtPaciente').val(objrow.paciente);
    $('#txtDireccion').val(objrow.direccionDomicilio);
    LlenarCondicionPaciente();
    ValidarAtencionPlanificacionFamiliar();
  
}


function ConsultarPlanificacion() {
    limpiarmodal();
    LlenarCombos();
    var objrow = ObjtablePlanificacion.api(true).row('.selected').data();
    if (isEmpty(objrow)) {
        alerta(2, "Debe seleccionar la atencion a modificar.");
        return false;
    }
    if (objrow.idEstadoAtencion == 0) {
        alerta(2, "La cuenta se encuentra Anulada.");
        return false;
    }
    $('#txtDatos').html('N°.Historia: ' + objrow.nroHistoriaClinica + ' / N°.Cuenta: ' + objrow.nroCuenta + ' / Paciente:' + objrow.paciente)

    DeshabilitarControlesPlani();
    $('#modalPlanificacion').modal('show');
    //asignar valores
    $('#txtNroCuenta').val(objrow.nroCuenta);
    $('#txtNroHistoria').val(objrow.nroHistoriaClinica);
    $('#txtPaciente').val(objrow.paciente);
    $('#txtDireccion').val(objrow.direccionDomicilio);
    LlenarCondicionPaciente();
    ValidarAtencionPlanificacionFamiliar();
   
}


function HabilitarControlesPlani() {
    $("#cboConsulta").removeAttr('disabled', 'disabled');
    $("#cboProcedimientoEntrada").removeAttr('disabled', 'disabled');
    $("#txtNroInsumos").removeAttr('disabled', 'disabled');
    $("#cboMetodo").removeAttr('disabled', 'disabled');
    $("#cboProcedimiento").removeAttr('disabled', 'disabled');
    $("#cboEfectoSecundario").removeAttr('disabled', 'disabled');
    $("#btnGuardarPlani").show();
}

function DeshabilitarControlesPlani(){
    $("#cboConsulta").attr('disabled', 'disabled');
    $("#cboProcedimientoEntrada").attr('disabled', 'disabled');
    $("#txtNroInsumos").attr('disabled', 'disabled');
    $("#cboMetodo").attr('disabled', 'disabled');
    $("#cboProcedimiento").attr('disabled', 'disabled');
    $("#cboEfectoSecundario").attr('disabled', 'disabled');
    $("#btnGuardarPlani").hide();
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
    $('#modalPlanificacion').modal('show');

    //$('.chosen-select', this).chosen();
    // $("select").chosen({ width: "inherit" }) 
}
function cerrarModal() {
    $('#modalPlanificacion').modal('hide');
    limpiarmodal();
}
function EliminarPlanificacionFamiliar() {
    var objrow = ObjtablePlanificacion.api(true).row('.selected').data();

    if (isEmpty(objrow)) {
        alerta(2, "Debe seleccionar la atencion a eliminar.");
        return false;
    }
    if (objrow.cantEvaluacion == 0) {
        alerta(2, "No se puede Eliminar, ya que no cuenta con una atención en planificación familiar.");
        return false;
    }

    swal({
        title: 'Eliminar',
        text: 'Estas seguro de eliminar la planificacion familiar  del paciente ' + objrow.paciente + ' con Nro cuenta: ' + objrow.nroCuenta + ' ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4fb7fe',
        cancelButtonColor: '#EF6F6C',
        confirmButtonText: 'Aceptar'
    }).then(function () {
        eliminar(objrow.nroCuenta)
    });
}


function eliminar(NroCuenta) {
    var ListDiagnosticos = DiagnosticosPlani.DevolverDiagnosticosPlani();
    var midata = new FormData();
    midata.append('IdCuentaAtencion', NroCuenta);
    midata.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
    midata.append('idAccion', 2);
    $.ajax({
        method: "POST",
        url: "/PlanificacionFamiliar/EliminarPlanificacionFamiliar?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            if (datos.respuesta > 0) {
                alerta(1, datos.mensaje);
                cerrarModal();
                ListarAtencionesPlan();
            } else {
                alerta(2, datos.mensaje);
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    });
}



function ValidarCampos() {
    if ($("#cboTipoAtencion").val() == -1) { alerta(2, "Debe seleccionar el tipo de atención."); $("#cboTipoAtencion").focus(); return false; }
    //if ($("#cboMetodo").val() != 0 || $("#cboMetodo").val() != -1) {
    //    if ($("#cboConsulta").val() == -1) { alerta(2, "Debe seleccionar el tipo de consulta."); $("#cboConsulta").focus(); return false; }
    //    if ($("#txtNroInsumos").val() == "") { alerta(2, "Debe el número de insumos."); $("#txtCama").focus(); return false; }
    //    if ($("#cboProcedimientoEntrada").val() == -1) { alerta(2, "Debe seleccionar el procedimiento de entrada."); $("#cboProcedimientoEntrada").focus(); return false; }
    //    if ($("#cboProcedimiento").val() == -1) { alerta(2, "Debe seleccionar el procedimiento."); $("#cboProcedimiento").focus(); return false; }
    //    if ($("#cboEfectoSecundario").val() == -1) { alerta(2, "Debe seleccionar el efecto secundario."); $("#cboEfectoSecundario").focus(); return false; }
    //   // if ($("#cboMetodoDefinitivo").val() == -1) { alerta(2, "Debe selecciona el método definitivo."); $("#cboMetodoDefinitivo").focus(); return false; }
    //   // if ($("#cboMetodoTemporal").val() == -1) { alerta(2, "Debe seleccionar el método temporal"); $("#cboMetodoTemporal").focus(); return false; }
    //    if ($("#cboMedico").val() == -1) { alerta(2, "Debe seleccionar el personal que realiza."); $("#cboMedico").focus(); return false; }
    //    var selected = $("#cboMetodo").find('option:selected');
    //    var ExigeMedico = selected.data('medico');
    //    if (ExigeMedico == 1) {
    //        var Persona = $("#cboMedico").find('option:selected').text();
    //        var res = Persona.split("-");
    //        if (res[0] == "OBS") {
    //            alerta(2, "El método seleccionado lo realiza un Médico, debe seleccionar el médico."); $("#cboMedico").focus(); return false;
    //        }
    //    }
    //}
    return true;
}


function Eventos() {
  
    $('#lstPlanificacion tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            ObjtablePlanificacion.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $("#chkControl").on('click', function () {
      

        if ($('#chkControl').prop('checked')) {
            $("#txtNroControl").removeAttr('disabled', 'disabled');
        } else {
            $("#txtNroControl").attr('disabled', 'disabled');
            $("#txtNroControl").val(0);           
        }

    })

    $("#chkNoAceptaMetodo").on('click', function (event) {

        

        if ($('#chkNoAceptaMetodo').prop('checked')) {

            $("#cboEstadoUsuaria").attr('disabled', true);
            $("#cboMetodo").attr('disabled', true);
            $("#cboTipoMetodo").attr('disabled', true);
            $("#txtNroInsumos").attr('disabled', true);
            $("#cboProfesionalMetodo").attr('disabled', true);
            $("#chkControl").attr('disabled', true);
            $("#txtNroControl").attr('disabled', true);
            $("#chkControlDIU").attr('disabled', true);
            $("#chkControlImplante").attr('disabled', true);


            $("#cboEstadoUsuaria").val(-1)
            $("#cboMetodo").val(-1)
            $("#cboTipoMetodo").val(-1)
            $("#txtNroInsumos").val('')
            $("#cboProfesionalMetodo").val(-1)
            $("#chkControl").prop("checked", false)
            $("#txtNroControl").val(0)
            $("#chkControlDIU").prop("checked", false)
            $("#chkControlImplante").prop("checked", false)


        } else {

            $("#cboEstadoUsuaria").attr('disabled', false);
            $("#cboMetodo").attr('disabled', false);
            $("#cboTipoMetodo").attr('disabled', false);
            $("#txtNroInsumos").attr('disabled', false);
            $("#cboProfesionalMetodo").attr('disabled', false);
            $("#chkControl").attr('disabled', false);
            $("#txtNroControl").attr('disabled', false);
            $("#chkControlDIU").attr('disabled', false);
            $("#chkControlImplante").attr('disabled', false);


            $("#txtNroControl").val(0);
        }

        $("#cboEstadoUsuaria").trigger("chosen:updated");
        $("#cboMetodo").trigger("chosen:updated");
        $("#cboTipoMetodo").trigger("chosen:updated");
        $("#cboProfesionalMetodo").trigger("chosen:updated");

    })


}



/************/

function BloquearControles(bDesactivar) {
    if (bDesactivar==false) {
        $("#cboMetodoTemporal").removeAttr('disabled', 'disabled');
        $("#cboMetodoDefinitivo").removeAttr('disabled', 'disabled');
        $("#cboConsulta").removeAttr('disabled', 'disabled');
        $("#cboProcedimientoEntrada").removeAttr('disabled', 'disabled');
        $("#cboEfectoSecundario").removeAttr('disabled', 'disabled');
        $("#cboProcedimiento").removeAttr('disabled', 'disabled');
        $("#txtNroInsumos").removeAttr('disabled', 'disabled');
        $("#cboMedico").removeAttr('disabled', 'disabled');
    } else {
        
        $("#cboMetodoTemporal").attr('disabled', 'disabled');
        $("#cboMetodoDefinitivo").attr('disabled', 'disabled');
        $("#cboConsulta").attr('disabled', 'disabled');
        $("#cboProcedimientoEntrada").attr('disabled', 'disabled');
        $("#cboEfectoSecundario").attr('disabled', 'disabled');
        $("#cboProcedimiento").attr('disabled', 'disabled');
        $("#txtNroInsumos").attr('disabled', 'disabled');
        $("#cboMedico").attr('disabled', 'disabled');
    }
    $("#cboMetodoTemporal").trigger("chosen:updated");
    $("#cboMetodoDefinitivo").trigger("chosen:updated");
    $("#cboConsulta").trigger("chosen:updated");
    $("#cboProcedimientoEntrada").trigger("chosen:updated");
    $("#cboEfectoSecundario").trigger("chosen:updated");
    $("#cboProcedimiento").trigger("chosen:updated");
    $("#cboMedico").trigger("chosen:updated");
}


/***********/




$(document).ready(function () {

    InicializarComponentesPlanificacion();
    
    ListarAtencionesPlan();
    Eventos();
    $(".dataTables_scrollHeadInner .table").addClass("table-responsive");
    $(".dataTables_wrapper .dt-buttons .btn").addClass('btn-secondary').removeClass('btn-default');


});