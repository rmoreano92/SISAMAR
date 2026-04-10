var ObjtableConstanciasRn;
var ObjtablePacientesRn;
var FechaDia;
var idAccion;
var ConstanciaRn = {
    InicializarComponentesConstanciaRn() {
        $('#modalConstanciaRn').modal({ backdrop: 'static', keyboard: false });
        $('#modalConstanciaRn').modal('hide');
        $('#modalBuscarPaciente').modal({
            backdrop: 'static', keyboard: false
            
        });
        $('#modalBuscarPaciente').modal('hide');
        $('#txtFechaFiltro').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaNacFiltro').datepicker({
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
        ObjtableConstanciasRn = $("#lstRnHospitalizados").dataTable({
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
        ObjtablePacientesRn = $("#lstPacientesRn").dataTable({
            "scrollY": "300px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            info: false,
            columns: [
                { "data": "idPaciente", className: 'ContCenter', "visible": false },
                { "data": "nroHistoriaClinica", className: 'ContCenter', "orderable": false },
                { "data": "paciente"},
                { "data": "fechaNacimiento", className: 'ContCenter', "orderable": false },
                { "data": "edad", className: 'ContCenter', "orderable": false},
                { "data": "madre",  "orderable": false},
                { "data": "bd", "visible": false }
            ]
        });

        Cargando(0);
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
                ObjtableConstanciasRn.fnClearTable();
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtableConstanciasRn.fnAddData(datos.table);
                    }

                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    Eventos() {
        $('#ifrmReporte').on('load', function () { //your code (will be called once iframe is done loading)
            let objFra = document.getElementById('ifrmReporte');
            objFra.contentWindow.focus();
            objFra.contentWindow.print();
            Cargando(0);
        }); 
        $('#lstPacientesRn tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                ObjtablePacientesRn.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $("#txtNroCorrelativo").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                if ($("#txtNroCorrelativo").val() == "" || $("#txtNroDocumento").val() =="") {
                    alerta(2, "Debe ingresar el correlativo correcto.");
                } else {
                    ConstanciaRn.ValidaComprobante();
                }
            }
        });


    },
    ObtenerConstanciaRn(idCuentaAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        $.ajax({
            method: "POST",
            url: "/ConstanciaRn/ObtenerConstanciaRn?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {

                        $("#hdnIdConstanciaRn").val(datos.table[0].idConstanciaRn);
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

        if ($("#cboSolicitante").val() == -1) { alerta(2, "Debe seleccionar el tipo de solicitante."); $("#cboSolicitante").focus(); return false; }
        if ($("#cboTipoDoc").val() == -1) { alerta(2, "Debe seleccionar el tipo de documento."); $("#cboTipoDoc").focus(); return false; }
        if ($("#txtDocumentoSol").val() == "") { alerta(2, "Debe ingresar el documento del solicitante."); $("#txtDocumentoSol").focus(); return false; }
        if ($("#txtNroDocumento").val() == "" || $("#txtNroCorrelativo").val() == "") { alerta(2, "Debe ingresar el comprobante correcto."); $("#txtNroDocumento").focus(); return false; }        
        return true;
    },

    BuscarPaciente() {
        ConstanciaRn.LimpiarFiltrosBusquedaPaciente();
        $('#modalBuscarPaciente').modal('show');
    },

    cerrarModal() {
        $('#modalConstanciaRn').modal('hide');
        limpiarmodal();
    },

    cerrarModalBuscarPaciente() {
        $('#modalBuscarPaciente').modal('hide');
        limpiarmodal();
    },


   BuscarPacienteRn() {
        var Recurso
       Recurso = $("#lstPacientesRn").data('source');
        Cargando(1);
        var midata = new FormData();
       midata.append('Anio', $("#txtAnioNacFiltro").val());
       midata.append('Apellidos', $("#txtApNomFiltro").val());
       midata.append('FecNac', $("#txtFechaNacFiltro").val());
       midata.append('NroHistoria', $("#txtNroHistoriaNacFiltro").val());

        $.ajax({
            method: "POST",
            url: Recurso,
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                console.log(datos)
                Cargando(0)
                ObjtablePacientesRn.fnClearTable();
                if (!isEmpty(datos.lstPacientes.table)) {
                    if (datos.lstPacientes.table.length > 0) {
                        ObjtablePacientesRn.fnAddData(datos.lstPacientes.table);
                    }
                }

                if (!isEmpty(datos.lstPacientesAnt.table)) {
                    if (datos.lstPacientesAnt.table.length > 0) {
                        ObjtablePacientesRn.fnAddData(datos.lstPacientesAnt.table);
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

   AceptarPaciente() {
       var objrow = ObjtablePacientesRn.api(true).row('.selected').data();
       if (isEmpty(objrow)) {
           alerta(2, "Debe seleccionar el paciente.");
           return false;
       } else {
           $("#hdnAnio").val($("#txtAnioNacFiltro").val());
           $("#hdnIdPaciente").val(objrow.idPaciente);
           $("#hdnNroHistoria").val(objrow.nroHistoriaClinica);
           $("#hdnBd").val(objrow.bd);
           var midata = new FormData();
           midata.append('Anio', $("#hdnAnio").val());
           midata.append('IdPaciente', $("#hdnIdPaciente").val());
           midata.append('NroHistoria', $("#hdnNroHistoria").val());
           midata.append('bd', $("#hdnBd").val());
           $.ajax({
               method: "POST",
               url: "/ConstanciasRN/ObtenerDatosPaciente?area=Estadistica",
               data: midata,
               dataType: "json",
               processData: false,
               contentType: false,
               success: function (datos) {
                   if (!isEmpty(datos)) {
                      
                       if (datos.rsp = 'OK') {
                           if (!isEmpty(datos.objPaciente.table)) {
                               if (datos.objPaciente.table.length > 0) {
                                   var objPaciente = datos.objPaciente.table[0];
                                   $("#txtNroHistoria").val(objPaciente.nroHistoriaClinicaMadre);
                                   $("#txtNombre").val(objPaciente.nombres);
                                   $("#txtApPaterno").val(objPaciente.apPaterno);
                                   $("#txtApMaterno").val(objPaciente.apMaterno);
                                   $("#txtDocIdentidad").val(objPaciente.tipoDocMadre);
                                   $("#txtNroIdentidad").val(objPaciente.docMadre);
                                   $("#txtDireccion").val(objPaciente.direccion);
                                  // $("#txtEstadoCivil").val(objPaciente.estadoCivil);
                                   $("#txtEdad").val(objPaciente.edadMadre);
                                   $("#txtResidencia").val(objPaciente.residenciaActual);

                                   $("#txtFecNac").val(objPaciente.fechaNac);
                                   $("#txtHoraNac").val(objPaciente.horaNac);
                                   $("#txtSexoPac").val(objPaciente.sexo);
                                   $("#txtPesoPac").val(objPaciente.peso);
                                   $("#txtTipoParto").val(objPaciente.tipoParto);
                                   $("#txtNroHijo").val(objPaciente.nroGemelar);
                                   ConstanciaRn.cerrarModalBuscarPaciente();
                               }
                           }
                       } else {
                           mensaje(3, datos.rsp)
                       }

                   
                  
                   }
                    Cargando(0)
                   
               },
               error: function (msg) {
                   Cargando(0)
               }
           })




       }
    },

   LlenarCombos() {
       $.ajax({
           async: false,
           cache: false,
           url: "/ConstanciasRN/ListarTiposSolicitante?area=Estadistica",
           datatype: "json",
           type: "get",
           success: function (datos) {
               $('#cboSolicitante').empty();
               $(datos.table).each(function (i, obj) {
                   $('#cboSolicitante').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
               });
           },
           error: function (msg) {
               setTimeout(function () {
                   alerta("ERROR", "Error listar tipos de solicitante!", "2");
               }, 900)
           }
       });

       $.ajax({
           async: false,
           cache: false,
           url: "/ConstanciasRN/ListarTiposDocumento?area=Estadistica",
           datatype: "json",
           type: "get",
           success: function (datos) {
               $('#cboTipoDoc').empty();
               $(datos.table).each(function (i, obj) {
                   $('#cboTipoDoc').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
               });
           },
           error: function (msg) {
               setTimeout(function () {
                   alerta("ERROR", "Error listar médicos!", "2");
               }, 900)
           }
       });
        
        
        
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });
    },

    ValidaComprobante() {
        var midata = new FormData();
        midata.append('NroCorrelativo', $("#txtNroCorrelativo").val());
        midata.append('NroDocumento', $("#txtNroDocumento").val());
        $.ajax({
            method: "POST",
            url: "/ConstanciasRN/ValidarComprobantedePago?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.rsp > 0) {
                    alerta(1, datos.mensaje);
                } else {
                    $("#txtNroCorrelativo").focus();
                    alerta(3, datos.mensaje);
                }
            },
            error: function (msg) {
                console.log(msg);
                Cargando(0)
            }
        });
    },

    LimpiarConstanciaNacimiento() {
        $("#txtNroHistoria").val("");
        $("#txtNombre").val("");
        $("#txtApPaterno").val("");
        $("#txtApMaterno").val("");

        $("#txtDocIdentidad").val("");
        $("#txtNroIdentidad").val("");
        $("#txtEdad").val("");

        $("#txtResidencia").val("");
        $("#txtDireccion").val("");

        $("#txtFecNac").val("");
        $("#txtHoraNac").val("");
        $("#txtSexoPac").val("");
        $("#txtNroHijo").val("");
        $("#txtPesoPac").val("");
        $("#txtTipoParto").val("");

        $("#cboSolicitante").val(-1);
        $("#cboTipoDoc").val(-1);
        $("#txtDocumentoSol").val("");

        $("#txtNroDocumento").val("");
        $("#txtNroCorrelativo").val("");
    },
    LimpiarFiltrosBusquedaPaciente() {

        $("#txtAnioNacFiltro").val("");
        $("#txtApNomFiltro").val("");
        $("#txtFechaNacFiltro").val("");
        $("#txtNroHistoriaNacFiltro").val("");
        ObjtablePacientesRn.fnClearTable();
    },

    ImprimirConstancia() {
        if (ConstanciaRn.ValidarCampos() == false) {
            return;
        }

        var midata = new FormData();
        midata.append("idConstancia",0);
        midata.append("Anio", $("#hdnAnio").val());
        midata.append("NroHistoria", $("#hdnNroHistoria").val());
        midata.append("Base", $("#hdnBd").val());
        midata.append("NroSerie", $("#txtNroDocumento").val());
        midata.append("NroCorrelativo", $("#txtNroCorrelativo").val());

        $.ajax({
            method: "POST",
            url: "/ConstanciasRN/GuardarConstanciaRn?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.respuesta > 0) {
                        alerta(1, datos.mensaje);
                        ConstanciaRn.cerrarModal();
                        Cargando(1);
                        var url = "/ConstanciasRN/Reporte?area=Estadistica&idConstancia=" + datos.respuesta;
                       
                        $('#ifrmReporte').attr('src', url);
                    } else {
                        alerta(3, datos.mensaje);
                    }
                } else {

                }
                
            },
            error: function (msg) {
                Cargando(0)
            }
        });



       

        //window.print(url);
        //window.open(url, '_blank',);
        

        
        return false;


    }


    


    /*******************************************/


};

function CargaMetodoxCargaUsuaria(idEstadoUsuaria) {
    var midata = new FormData();
    midata.append('idEstadoUsuaria', idEstadoUsuaria);
    $.ajax({
        method: "POST",
        url: "/ConstanciaRn/ListarMetodoxIdEstadoUsuaria?area=Comun",
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
        url: "/ConstanciaRn/DevuelveCondicionPaciente?area=Comun",
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
        url: "/ConstanciaRn/ListarEfectoSecxMetodo?area=Comun",
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

 

function limpiarmodal() {

    $("#hdnIdConstanciaRn").val("");
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

    if (ConstanciaRn.ValidarCampos() == false) {
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
    midata.append("idConstanciaRn", $("#hdnIdConstanciaRn").val());
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
    midata.append("PosicionParto", posicion);
    midata.append("ConAcompaniante", $("#chkConAcompaniante").is(":checked"));
    midata.append("ConAnaglgesia", $("#chkConAnalgesia").is(":checked"));
    midata.append("idAccion", 0);
    //midata.append('lstComorbilidad', JSON.stringify(ListComorbilidad.toArray()));
    midata.append('idAccion', idAccion);
    $.ajax({
        method: "POST",
        url: "/ConstanciaRn/GuardarConstanciaRn?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            if (datos.respuesta > 0) {
                alerta(1, datos.mensaje);
                ConstanciaRn.cerrarModal();
                ConstanciaRn.ListarHospitalizados();
            } else {
                alerta(2, datos.mensaje);
            }
        },
        error: function (msg) {
            Cargando(0)
        }
    });
}


function AgregarConstanciaRn() {
    ConstanciaRn.LimpiarConstanciaNacimiento();  
    $('#modalConstanciaRn').modal('show');
}


function ConsultarConstanciaRn() {

    limpiarmodal();
    var objrow = ObjtableConstanciasRn.api(true).row('.selected').data();
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
    $('#modalConstanciaRn').modal('show');
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
        ConstanciaRn.ObtenerConstanciaRn(objrow.nroCuenta);
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
    $('#modalConstanciaRn').modal('show');
    $("#btnGuardar").show();
    //$('.chosen-select', this).chosen();
    // $("select").chosen({ width: "inherit" }) 
}
 
function EliminarConstanciaRn() {
    var objrow = ObjtableConstanciasRn.api(true).row('.selected').data();

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
        url: "/ConstanciaRn/EliminarConstanciaRn?area=Comun",
        data: midata,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (datos) {
            if (datos.respuesta > 0) {
                alerta(1, datos.mensaje);
                ConstanciaRn.cerrarModal();
                ConstanciaRn.ListarHospitalizados();
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
    ConstanciaRn.InicializarComponentesConstanciaRn();
    ConstanciaRn.LlenarCombos();
    ConstanciaRn.ListarHospitalizados();
    ConstanciaRn.Eventos();
    //InicializarComponentesConstanciaRn();
   
    //ListarHospitalizados();
    // Eventos();
    //$(".dataTables_scrollHeadInner .table").addClass("table-responsive");
    //$(".dataTables_wrapper .dt-buttons .btn").addClass('btn-secondary').removeClass('btn-default');


});