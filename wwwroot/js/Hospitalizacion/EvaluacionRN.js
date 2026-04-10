var ObjtableHospitalizadosRn;
var FechaDia;
var idAccion;
var EvaluacionRn = {
    InicializarComponentesEvaluacionRn() {
        $('#modalEvaluacionRN').modal({ backdrop: 'static', keyboard: false });
        $('#modalEvaluacionRN').modal('hide');
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
        $('#rdbTardioNO').prop('checked', true);
        $('#rdbLacthoraNO').prop('checked', true);
        ObjtableHospitalizadosRn = $("#lstRnHospitalizados").dataTable({
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '70vh',
            scrollCollapse: true,
            bLengthChange: false,
            // dom: 'Bflr<"table-responsive"t>ip',
            buttons: [],
            columns: [
                { "data": "nroCuenta", className: 'ContCenter' },
                { "data": "paciente", className: 'ContCenter' },
                { "data": "nroHistoriaClinica", className: 'ContCenter' },
                { "data": "fecNac" },
                { "data": "servicioIngreso" },
                { "data": "fechaIngreso" },
                { "data": "plann" },
                { "data": "direccionDomicilio", "visible": false },
                { "data": "idEstadoAtencion", "visible": false },
                { "data": "horaIngreso", "visible": false }

            ],
            'rowCallback': function (row, data, index) {

                if (data.cantEvaluacion > 0 && data.idEstadoAtencion != 0) {
                    $(row).find('td:eq(0)').css('color', 'blue');
                    $(row).find('td:eq(1)').css('color', 'blue');
                    $(row).find('td:eq(2)').css('color', 'blue');
                    $(row).find('td:eq(3)').css('color', 'blue');
                    $(row).find('td:eq(4)').css('color', 'blue');
                    $(row).find('td:eq(5)').css('color', 'blue');
                    $(row).find('td:eq(6)').css('color', 'blue');

                }
            }
        });

        Cargando(0);
    },
    LlenarCombos() {
        //var idServicio = $("#idServicio").val();
        //var midata = new FormData();
        //midata.append('idTipoServicio', idServicio);

        $.ajax({
            async: false,
            cache: false,
            url: "/EvaluacionRN/ListarRiesgosObstetricos?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboRiesgo').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboRiesgo').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar riesgo!", "2");
                }, 900)
            }
        });


        $.ajax({
            async: false,
            cache: false,
            url: "/EvaluacionRN/ListarCondicionRn?area=Hospitalizacion",
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
                    alerta("ERROR", "Error listar condición!", "2");
                }, 900)
            }
        });


        $.ajax({
            async: false,
            cache: false,
            url: "/EvaluacionRN/ListarContactoPielaPiel?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboContactoPiel').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboContactoPiel').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar Contacto piel a piel!", "2");
                }, 900)
            }
        });


        $.ajax({


            async: false,
            cache: false,
            url: "/EvaluacionRN/ListarObstetras?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboProfResponsable').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProfResponsable').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar contacto piel a piel!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/EvaluacionRN/ListarTipoPartoRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoParto').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoParto').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar contacto piel a piel!", "2");
                }, 900)
            }
        });




        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });
    },
    ListarHospitalizados() {
        var Recurso
        Recurso = $("#lstRnHospitalizados").data('source');
        Cargando(1);
        var midata = new FormData();
        midata.append('NroCuenta', $("#txtNroCuentaFiltro").val());
        midata.append('NroDocumento', $("#txtDniFiltro").val());
        midata.append('NroHistoria', $("#txtNroHistoriaFiltro").val());
        midata.append('idTipoServicio', $("#txtApPaternoFiltro").val());
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
                
                Cargando(0)
                ObjtableHospitalizadosRn.fnClearTable();
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtableHospitalizadosRn.fnAddData(datos.table);
                    }

                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    Eventos() {

        $('#lstRnHospitalizados tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                ObjtableHospitalizadosRn.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
    },
    ObtenerEvaluacionRN(idCuentaAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        $.ajax({
            method: "POST",
            url: "/EvaluacionRN/ObtenerEvaluacionRN?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                       
                        $("#hdnIdEvaluacionRN").val(datos.table[0].idEvaluacionRN);
                        $("#hdnIdCuentaAtencion").val(datos.table[0].idCuentaAtencion);
                        $("#txtPeso").val(datos.table[0].peso);
                        $("#txtTalla").val(datos.table[0].talla);
                        $("#txtPerToracico").val(datos.table[0].perimetroToracico);
                        $("#txtPerCefalico").val(datos.table[0].perimetroCefalico);
                        $("#txtObservacion").val(datos.table[0].observaciones);
                        $("#cboProfResponsable").val(datos.table[0].idMedico);
                        $("#cboTipoParto").val(datos.table[0].idTipoParto);
                        $("#cboCondicion").val(datos.table[0].idCondicion);
                        $("#cboRiesgo").val(datos.table[0].idRiesgo);
                        $("#txtNroGemelar").val(datos.table[0].nroGemelar);
                        $("#cboContactoPiel").val(datos.table[0].pielaPïel);
                        $("#txtEdadGestacional").val(datos.table[0].edadGes);
                        $("#txtGestas").val(datos.table[0].gesta);
                        $("#txtParidad").val(datos.table[0].paridad);
                        $("#txtMinuto").val(datos.table[0].alMinuto);
                        $("#txt5Minuto").val(datos.table[0].alos5Minutos);

                        $("#cboProfResponsable").trigger("chosen:updated");
                        $("#cboTipoParto").trigger("chosen:updated");
                        $("#cboCondicion").trigger("chosen:updated");
                        $("#cboRiesgo").trigger("chosen:updated");
                        $("#cboContactoPiel").trigger("chosen:updated");
                        if (datos.PosicionParto == "H") {
                            $('#rdbTipoPartoH').prop('checked', true);
                        } else {
                            $('#rdbTipoPartoV').prop('checked', true);
                        }
                        //midata.append("", posicion);
                        $("#chkConAcompaniante").prop('checked', datos.table[0].conAcompaniante);
                        $("#chkConAnalgesia").prop('checked', datos.table[0].conAnaglgesia);


                        $("#rdbLacthoraSi").prop('checked', datos.table[0].lactancia1raHora);
                        $("#rdbTardioSi").prop('checked', datos.table[0].clampadoTardio);
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    ValidarCampos() {

        if ($("#txtPeso").val() == "") { alerta(2, "Debe ingresar el peso."); $("#txtPeso").focus(); return false; }
        if ($("#txtTalla").val() == "") { alerta(2, "Debe ingresar la talla."); $("#txtTalla").focus(); return false; }
        if ($("#txtPerToracico").val() == "") { alerta(2, "Debe ingresar el perimetro torácico."); $("#txtPerToracico").focus(); return false; }
        if ($("#txtPerCefalico").val() == "") { alerta(2, "Debe ingresar el perimetro cefálico."); $("#txtPerCefalico").focus(); return false; }
        if ($("#cboProfResponsable").val() == -1) { alerta(2, "Debe seleccionar el profesional."); $("#cboProfResponsable").focus(); return false; }
        if ($("#cboTipoParto").val() == -1) { alerta(2, "Debe seleccionar el tipo de parto."); $("#cboTipoParto").focus(); return false; }
        if ($("#cboCondicion").val() == -1) { alerta(2, "Debe seleccionar la condición."); $("#cboCondicion").focus(); return false; }
        if ($("#cboRiesgo").val() == -1) { alerta(2, "Debe seleccionar el riesgon."); $("#cboRiesgo").focus(); return false; }
        if ($("#txtNroGemelar").val() == -1) { alerta(2, "Debe ingresar el nro gemelar."); $("#txtNroGemelar").focus(); return false; }
        if ($("#txtEdadGestacional").val() == -1) { alerta(2, "Debe ingresar la edad gestacional."); $("#txtEdadGestacional").focus(); return false; }
        if ($("#cboContactoPiel").val() == -1) { alerta(2, "Debe seleccionar el contacto piel a piel."); $("#cboContactoPiel").focus(); return false; }
        if ($("#txtGestas").val() == -1) { alerta(2, "Debe ingresar las gestas."); $("#txtGestas").focus(); return false; }
        if ($("#txtParidad").val() == -1) { alerta(2, "Debe ingresar la paridad."); $("#txtParidad").focus(); return false; }
        if ($("#txtMinuto").val() == -1) { alerta(2, "Debe ingresar los minutos."); $("#txtMinuto").focus(); return false; }
        if ($("#txt5Minuto").val() == -1) { alerta(2, "Debe ingresar a los 5 min."); $("#cboTipoAtencion").focus(); return false; }
        if ($("#cboTipoAtencion").val() == -1) { alerta(2, "Debe seleccionar el tipo de parto."); $("#cboTipoAtencion").focus(); return false; }

        return true;
    }
};

function CargaMetodoxCargaUsuaria(idEstadoUsuaria) {
    var midata = new FormData();
    midata.append('idEstadoUsuaria', idEstadoUsuaria);
    $.ajax({
        method: "POST",
        url: "/EvaluacionRn/ListarMetodoxIdEstadoUsuaria?area=Comun",
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
        url: "/EvaluacionRn/DevuelveCondicionPaciente?area=Comun",
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
        url: "/EvaluacionRn/ListarEfectoSecxMetodo?area=Comun",
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

function LimpiarFiltros() {
    $("#txtCama").val("");
    $("#txtNroCuentaFiltro").val("");
    $("#txtDniFiltro").val("");
    $("#txtNroHistoriaFiltro").val("");
    $("#txtApPaternoFiltro").val("");
    $('#txtFechaFiltro').val(FechaDia);
    EvaluacionRn.ListarHospitalizados();
}

function limpiarmodal() {

    $("#hdnIdEvaluacionRN").val("");
    $("#hdnIdCuentaAtencion").val("");
    $("#txtPeso").val("");
    $("#txtTalla").val("");
    $("#txtPerToracico").val("");
    $("#txtPerCefalico").val("");
    $("#txtObservacion").val("");
    $("#cboProfResponsable").val(-1);
    $("#cboTipoParto").val(-1);
    $("#cboCondicion").val(-1);
    $("#cboRiesgo").val(-1);
    $("#txtNroGemelar").val("");
    $("#cboContactoPiel").val(-1);
    $("#txtEdadGestacional").val("");
    $("#txtGestas").val("");
    $("#txtParidad").val("");
    $("#txtMinuto").val("");
    $("#txt5Minuto").val("");
    $("#cboProfResponsable").trigger("chosen:updated");
    $("#cboTipoParto").trigger("chosen:updated");
    $("#cboCondicion").trigger("chosen:updated");
    $("#cboRiesgo").trigger("chosen:updated");
    $("#cboContactoPiel").trigger("chosen:updated");
    $('#rdbTipoPartoH').prop('checked', false);
    $('#rdbTipoPartoV').prop('checked', false);
    //midata.append("", posicion);
    $("#chkConAcompaniante").prop('checked', false);
    $("#chkConAnalgesia").prop('checked', false);
    $("#rdbLacthoraNO").prop('checked', true);
    $("#rdbTardioNO").prop('checked', true);
    idAccion = 0;

//    BloquearControles(false);
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

    if (EvaluacionRn.ValidarCampos() == false) {
        return false;
    };
    var midata = new FormData();

    var posicion = '';
    debugger;
    if ($("#rdbTipoPartoH").is(":checked") == false && $("#rdbTipoPartoV").is(":checked") == false) {
        alerta(3, "Debe elegir el tipo de parto.");
    } else {
        if ($("#rdbTipoPartoH").is(":checked")) { posicion = 'H' } else { posicion = 'V' }
    }
    midata.append("idEvaluacionRN", $("#hdnIdEvaluacionRN").val());
    midata.append("idCuentaAtencion", $("#hdnIdCuentaAtencion").val());
    midata.append("Peso", $("#txtPeso").val());
    midata.append("Talla", $("#txtTalla").val());
    midata.append("PerimetroCefalico", $("#txtPerToracico").val());
    midata.append("PerimetroToracico", $("#txtPerCefalico").val());
    midata.append("Observaciones", $("#txtObservacion").val());
    midata.append("idMedico", $("#cboProfResponsable").val());
    midata.append("idTipoParto", $("#cboTipoParto").val());
    midata.append("idCondicion", $("#cboCondicion").val());
    midata.append("idRiesgo", $("#cboRiesgo").val());
    midata.append("NroGemelar", $("#txtNroGemelar").val());
    midata.append("PielaPïel", $("#cboContactoPiel").val());
    midata.append("EdadGes", $("#txtEdadGestacional").val());
    midata.append("ClampadoTardio", $("#rdbTardioSi").is(":checked"));
    midata.append("Lactancia1raHora", $("#rdbLacthoraSI").is(":checked"));
    midata.append("Gesta", $("#txtGestas").val());
    midata.append("Paridad", $("#txtParidad").val());
    midata.append("AlMinuto", $("#txtMinuto").val());
    midata.append("Alos5Minutos", $("#txt5Minuto").val());
    midata.append("PosicionParto", posicion );
    midata.append("ConAcompaniante", $("#chkConAcompaniante").is(":checked"));
    midata.append("ConAnaglgesia", $("#chkConAnalgesia").is(":checked"));
    midata.append("EdadMadre", $('#txtEdadMadre').val());
    midata.append("idAccion", 0);
    //midata.append('lstComorbilidad', JSON.stringify(ListComorbilidad.toArray()));
    midata.append('idAccion', idAccion);
    $.ajax({
        method: "POST",
        url: "/EvaluacionRn/GuardarEvaluacionRn?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            if (datos.respuesta > 0) {
                alerta(1, datos.mensaje);
                cerrarModal();
                EvaluacionRn.ListarHospitalizados();
            } else {
                alerta(2, datos.mensaje);
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    });
}


function ModificarEvaluacionRn() {
    limpiarmodal();
    var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();
    if (isEmpty(objrow)) {
        alerta(2, "Debe seleccionar la atención a modificar.");
        return false;
    }
    if (objrow.idEstadoAtencion == 0) {
        alerta(2, "La cuenta se encuentra Anulada.");
        return false;
    }
    $('#txtDatos').html('  N°.Historia: ' + objrow.nroHistoriaClinica + ' / N°.Cuenta: ' + objrow.nroCuenta + ' / Paciente:' + objrow.paciente)    
    $('#modalEvaluacionRN').modal('show');
    //asignar valores
    $('#txtFecNac').val(objrow.fecNac);
    $('#txtHoraNac').val(objrow.horaIngreso);
    $('#txtPaciente').val(objrow.paciente);
    $('#txtSexoPac').val(objrow.sexo);
    $('#txtNroHijo').val(objrow.nroOrdenHijo);
    $('#txtNombreMadre').val(objrow.madre);
    $('#txtNroDocMadre').val(objrow.docMadre);
    $('#txtNroHistoriaMadre').val(objrow.historiaMadre);
    $('#txtEdadMadre').val(objrow.edadMadre);
    $('#hdnIdCuentaAtencion').val(objrow.nroCuenta);

    
    if (objrow.cantEvaluacion > 0) {
        EvaluacionRn.ObtenerEvaluacionRN(objrow.nroCuenta);
    }

    //LlenarCondicionPaciente();
   // ValidarAtencionEvaluacionRn();

}


function ConsultarEvaluacionRn() {
   
    limpiarmodal();
    var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();
    if (isEmpty(objrow)) {
        alerta(2, "Debe seleccionar la atencion a evaluar.");
        return false;
    }
    if (objrow.idEstadoAtencion == 0) {
        alerta(2, "La cuenta se encuentra Anulada.");
        return false;
    }
    if (objrow.cantEvaluacion == 0) {
        alerta(2, "La atención seleccionada no cuenta con la evaluación.");
        return false;
    }
    $('#txtDatos').html('N°.Historia: ' + objrow.nroHistoriaClinica + ' / N°.Cuenta: ' + objrow.nroCuenta + ' / Paciente:' + objrow.paciente);    
    $('#modalEvaluacionRN').modal('show');
    //asignar valores
    $('#txtFecNac').val(objrow.fecNac);
    $('#txtHoraNac').val(objrow.horaIngreso);
    $('#txtPaciente').val(objrow.paciente);
    $('#txtSexoPac').val(objrow.sexo);
    $('#txtNroHijo').val(objrow.nroOrdenHijo);
    $('#txtNombreMadre').val(objrow.madre);
    $('#txtNroDocMadre').val(objrow.docMadre);
    $('#txtNroHistoriaMadre').val(objrow.historiaMadre);
    $('#hdnIdCuentaAtencion').val(objrow.nroCuenta);
    $("#btnGuardar").hide();
    if (objrow.cantEvaluacion > 0) {
        EvaluacionRn.ObtenerEvaluacionRN(objrow.nroCuenta);
    }

   

}


function HabilitarControlesPlani() {
    $("#cboConsulta").removeAttr('disabled', 'disabled');
    $("#cboProcedimientoEntrada").removeAttr('disabled', 'disabled');
    $("#txtNroInsumos").removeAttr('disabled', 'disabled');
    $("#cboMetodo").removeAttr('disabled', 'disabled');
    $("#cboProcedimiento").removeAttr('disabled', 'disabled');
    $("#cboEfectoSecundario").removeAttr('disabled', 'disabled');
    $("#btnGuardar").show();
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
    $('#modalEvaluacionRN').modal('show');
    $("#btnGuardar").show();
    //$('.chosen-select', this).chosen();
    // $("select").chosen({ width: "inherit" }) 
}
function cerrarModal() {
    $('#modalEvaluacionRN').modal('hide');
    limpiarmodal();
}
function EliminarEvaluacionRn() {
    var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();

    if (isEmpty(objrow)) {
        alerta(2, "Debe seleccionar la atencion a eliminar.");
        return false;
    }
    if (objrow.cantEvaluacion == 0) {
        alerta(2, "No se puede Eliminar, ya que no cuenta con una evaluación.");
        return false;
    }

    swal({
        title: 'Eliminar',
        text: 'Estas seguro de eliminar la Evaluación del recien nacido ' + objrow.paciente + ' con Nro cuenta: ' + objrow.nroCuenta + ' ?',
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
        url: "/EvaluacionRn/EliminarEvaluacionRn?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            if (datos.respuesta > 0) {
                alerta(1, datos.mensaje);
                cerrarModal();
                EvaluacionRn.ListarHospitalizados();
            } else {
                alerta(2, datos.mensaje);
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    });
}



 






/************/

function BloquearControles(bDesactivar) {
    if (bDesactivar == false) {
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
    EvaluacionRn.InicializarComponentesEvaluacionRn();
    EvaluacionRn.LlenarCombos();
    EvaluacionRn.ListarHospitalizados();
    EvaluacionRn.Eventos();
    //InicializarComponentesEvaluacionRn();
    // LlenarCombos();
    //ListarHospitalizados();
    // Eventos();
    //$(".dataTables_scrollHeadInner .table").addClass("table-responsive");
    //$(".dataTables_wrapper .dt-buttons .btn").addClass('btn-secondary').removeClass('btn-default');


});