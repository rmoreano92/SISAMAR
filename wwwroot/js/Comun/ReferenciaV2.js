var listaDxRefCon = [{}];
var tratamientoRefCon = '';
var responsable = 0;
var responsableEESS = 0;
//var moduloActualRefCon = '';
//var estadoGuardadoRefCon = false;


var Referencias = {
    moduloActualRefCon: '',
    estadoGuardadoRefCon: false,
    CodigoEstablecimiento: '6208',
    idResponsable: 0,
    idResponsableEESS: 0,

    idReferencia: 0,
    idContraReferencia: 0,

    async Iniciar() {
        Referencias.CargaInicial();
        Referencias.plugins();
        Referencias.initDatables();
        //Referencias.initDatablesRefconMinsa();
        Referencias.Eventos();

        await Referencias.ListarEspecialidades();
        await Referencias.ListarUPServiciosOrigen(Referencias.CodigoEstablecimiento);

       await  Referencias.ListarCondicionUsuario();
    },

    CargaInicial() {
        //Referencias.limpiar();

        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaAtencionRefCon').val(fechaP);

        $("#cboTipoConsulta").attr('disabled', 'disabled');
        $("#cboTipoConsulta").trigger("chosen:updated");
        $("#ceAtencion-tab").css("pointer-events", "none");

        //$('.modalRefCon').modal({ backdrop: 'static', keyboard: false });
        //$('.modalRefCon').modal('hide');
    },

    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: false });
        $(".chzn-select-deselect,#select2_sample").chosen();
        $('.chzn-select').chosen().trigger("chosen:updated");
        //$(".chzn-select").chosen({ );

        $('#tblAnexos').DataTable({
            //            "scrollX": true,
            "searching": false,
            "lengthChange": false,
            "paging": false
        });

        $('#txtFinEmb,#txtFechaAtencionRefCon,#txtFUM,#txtFPP,#txtFEcog,#txtFechaControl,#txtFPPControl,#txtProximaConsulta').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");
    },



    Eventos() {
        $('#tblAtencionRefCon tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_atencionesRefCon.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_atencionesRefCon.api(true).row($(this)).index();
            var row = oTable_atencionesRefCon.fnGetData(pos);

            $('#idPaciente').val(row.idPaciente);
            $('#idAtencion').val(row.idAtencion);
            $('#idDestinoAtencion').val(row.idDestinoAtencion);

            if (row.tipoRef == 1) {
                $('.txtTituloRefCon').html('Referencia / N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            } else if (row.tipoRef == 2) {
                $('.txtTituloRefCon').html('Contrareferencia / N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            }
        });

        $('.searchRefCon').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscarAtencionesRefCon").click();
            }
        });

        


        $('#btnBuscarAtencionesRefCon').on('click', function () {
            $('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionRefCon').val() == "") {
                alerta('2', 'Ingrese fecha de atencion');
                return false;
            }
            else {
                $('#lblMedicoProgramado').html("Medico: " + $('#cboConsultorioRefCon>option:selected').attr("med"))
                Referencias.ListarAtenciones();
            }
            $('html, body').animate({
                scrollTop: $(".head").offset().top
            }, 1000);
        });

        $('#cboServicioDestinoCR').on('change', function () {
            //$('#lblMedicoProgramado').html("")
            $('#txtServContraRefCR').val($('#cboServicioDestinoCR_chosen span').html())
            //console.log("Seleccionadnooo");
        });

        $('#cboResponsableEstablecimiento').on('change', function () {

            //Referencias.responsableEESS = $('#cboResponsableEstablecimiento').val();
            //Referencias.idResponsableEESS = $('#cboResponsableEstablecimiento  option:selected').data('empleado');
            Referencias.idResponsableEESS = $('#cboResponsableEstablecimiento').val();
            $('#txtMedicoEESS').val($('#cboResponsableEstablecimiento>option:selected').text());
            $('#txtProfesionMedicoESS').val($('#cboResponsableEstablecimiento>option:selected').attr("profesion"));
            $('#txtColegioProfesionalEESS').val($('#cboResponsableEstablecimiento>option:selected').attr("colegiomedico"));
        });

        $('#tblAtencionRefCon tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = oTable_atencionesRefCon.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesRefCon.fnGetData(objrow);
         
            tipoFormato = 0;
            Cargando(1);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A')               //KHOYOSI

            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                if (typeof row.usaModuloMaterno === 'undefined') {
                    alerta(2, "Seleccione Fila");
                } else {
                    if (row.usaModuloMaterno) {
                        tipoFormato = 1;
                    }
                    else if (row.usaModuloNinoSano) {
                        tipoFormato = 2;
                    }
                    else {
                        tipoFormato = 0;
                    }
                    //imprimiInformeSF(row.idCuentaAtencion, row.idProCabecera, tipoFormato)
                }

                const pdf = await Utilitario.GenerarAtencionPdf(row.idCuentaAtencion, row.idProCabecera, tipoFormato);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblAtencionRefCon tbody').on('click', '.ImprimeHojaRefConSinF', async function () {
            var objrow = oTable_atencionesRefCon.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesRefCon.fnGetData(objrow);
            var idRefCon = 0;
            var tipo = '';

            if (row.idReferencia != null) {
                idRefCon = row.idReferencia;
                tipo = 'RF';
            } else {
                if (row.idContraReferencia != null) {
                    idRefCon = row.idContraReferencia;
                    tipo = 'CRF';
                }
            }

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, idRefCon, tipo)               //KHOYOSI
            AbrirVisorDocumento(firma.rutaArchivo, 0);
        });

        $('#tblAtencionRefCon tbody').on('click', '.ImprimeHojaRefConConF', async function () {
            var objrow = oTable_atencionesRefCon.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesRefCon.fnGetData(objrow);

            if (row.idReferencia != null) {
                idRefCon = row.idReferencia;
                tipo = 'RF';
            } else {
                if (row.idContraReferencia != null) {
                    idRefCon = row.idContraReferencia;
                    tipo = 'CRF';
                }
            }

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, idRefCon, tipo)               //KHOYOSI
            ImprimirRefConFirmado(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);
        });

        $('#tblAtencionRefCon tbody').on('click', '.ModalMigracionRefcon', function () {
            var objrow = oTable_atencionesRefCon.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesRefCon.fnGetData(objrow);

            $('#txtCodRespuestaRefCon').val('')
            $('#txtMensajeRespuestaRefCon').val('')

            $('#txtIdReferenciaRespuestaRefCon').val('')
            $('#txtNroReferenciaRespuestaRefCon').val('')

            $('#hdnIdCuentaAtencionMigracionRefCon').val(row.idCuentaAtencion)

            $('#btnEnviarReferencia').show()
            $('#btnEnviarContraReferencia').hide()

            $('#modalMigracionRefCon').modal('show')
        });

        $('#tblAtencionRefCon tbody').on('click', '.ModalMigracionContraref', function () {
            var objrow = oTable_atencionesRefCon.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesRefCon.fnGetData(objrow);

            $('#txtCodRespuestaRefCon').val('')
            $('#txtMensajeRespuestaRefCon').val('')

            $('#txtIdReferenciaRespuestaRefCon').val('')
            $('#txtNroReferenciaRespuestaRefCon').val('')

            $('#hdnIdCuentaAtencionMigracionRefCon').val(row.idCuentaAtencion)

            $('#btnEnviarReferencia').hide()
            $('#btnEnviarContraReferencia').show()

            $('#modalMigracionRefCon').modal('show')
        });


        $('#ifrmReporteRefCon').on('load', function () { //your code (will be called once iframe is done loading)
            let objFra = document.getElementById('ifrmReporteRefCon');
           
        });

        $('#btnEnviarReferencia').on('click', () => { // jdelgado
            console.log('idCuenta si captura', $('#hdnIdCuentaAtencionMigracionRefCon').val())
            Referencias.MigrarRefCon($('#hdnIdCuentaAtencionMigracionRefCon').val())
        })

        $('#btnEnviarContraReferencia').on('click', () => { // jdelgado
            console.log('idCuenta si captura', $('#hdnIdCuentaAtencionMigracionRefCon').val())
            Referencias.MigrarContraRef($('#hdnIdCuentaAtencionMigracionRefCon').val())
        })

        $('#btnCerrarModalEnvioReferencia').on('click', () => { // jdelgado

            $('#modalMigracionRefCon').modal('hide')
        })
               

    },

    LimpiarModal() {
        //$('.campo').val("");
        $("#modalRef input").val("");
        $("#modalRef textarea").val("");
        //$("#modalRef select").html("");
        $('#modalRef .chzn-select').chosen().trigger("chosen:updated");

        $("#modalConRef input").val("");
        $("#modalConRef textarea").val("");
        // $("#modalConRef select").html("");
        $('#modalConRef .chzn-select').chosen().trigger("chosen:updated");

        Referencias.idResponsable = 0;
        Referencias.idResponsableEESS = 0;
    },

    DeshabilitarModal() {
        $(".campo").attr('disabled', 'disabled');
    },

    HabilitarModal() {
        $(".campo").removeAttr('disabled', 'disabled');
    },

    AbrirModalRef() {
        $('#modalRef').modal('show');
    },

    AbrirModalConRef() {
        $('#modalConRef').modal('show');
    },

    CerrarModal() {
        $('.modalRefCon').modal('hide');
    },

    async ConsultarRefCon() {
        //console.log("ENTROOOOO");    
        var objrowTb = oTable_atencionesRefCon.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        this.LimpiarModal();
        this.DeshabilitarModal();
        await this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);
        $("#btnGuardarRefCon").hide();
    },

    async ModificarRefCon() {
        //console.log("ENTROOOOO");       
        var objrowTb = oTable_atencionesRefCon.api(true).row('.selected').data();
        //console.log(objrowTb);
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }

        //if ($('#nroreferencia').val() == '') {
        //    alerta(2, 'Ingrese el N° de Referencia.');
        //    //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');
        //    $('#nroreferencia').focus()
        //    return false;
        //}
        this.LimpiarModal();
        this.HabilitarModal();
        await this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);
        $("#btnGuardarRefCon").show();
    },

    GuardarRef() {
        if (this.ValidarVariablesRef()) {
            Cargando(1);
            var data = this.CargarVariablesRef();
            $.ajax({
                method: "POST",
                url: "/Referencia/GuardarReferencia?area=Comun",
                //contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                async: true,
                success: function (datos) {
                    Cargando(0);
                    var respuesta;
                    if (datos.session) {
                        if (datos.respuesta.table.length > 0) {
                            respuesta = datos.respuesta.table[0];
                            if (respuesta.mensaje == "Exito") {
                                Referencias.estadoGuardadoRefCon = true;
                                Referencias.idReferencia = respuesta.idReferencia
                                Referencias.idContraReferencia = 0
                                alerta(1, 'La Referencia se modificó correctamente.');
                                Referencias.CerrarModal();
                                if (Referencias.moduloActualRefCon == '') {
                                    //console.log("ENTROOOOOO");
                                    Referencias.ListarAtenciones();
                                }

                            } else {
                                alerta(2, respuesta.mensaje);
                            }
                            //console.log(respuesta);
                        }
                        else {
                            respuesta = {};
                        }
                    }
                    else {
                        alert("La sesion ya expiro se volvera a recargar la pagina")
                        //location.reload();
                    }
                }
            });
        }
    },

    GuardarConRef() {
        if (this.ValidarVariablesConRef()) {
            Cargando(1);
            var data = this.CargarVariablesConRef();
            $.ajax({
                method: "POST",
                url: "/Referencia/GuardarContraReferencia?area=Comun",
                //contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                async: true,
                success: function (datos) {
                    Cargando(0);
                    var respuesta;
                    if (datos.session) {
                        if (datos.respuesta.table.length > 0) {
                            respuesta = datos.respuesta.table[0];
                            if (respuesta.mensaje == "Exito") {
                                Referencias.estadoGuardadoRefCon = true;
                                Referencias.idReferencia = 0
                                Referencias.idContraReferencia = respuesta.idContraReferencia
                                alerta(1, 'La Contrareferencia se modificó correctamente.');
                                Referencias.CerrarModal();
                                if (Referencias.moduloActualRefCon == '') {
                                    //console.log("ENTROOOOOO");
                                    Referencias.ListarAtenciones();
                                }
                            } else {
                                alerta(2, respuesta.mensaje);
                            }
                            //console.log(respuesta);
                        }
                        else {
                            respuesta = {};
                        }
                    }
                    else {
                        alert("La sesion ya expiro se volvera a recargar la pagina")
                        //location.reload();
                    }
                }
            });
        }
    },
 

    async CargarData(IdCuentaAtencion, IdAtencion, TipoRef) {

        //await Referencias.ListarEspecialidades();
        //await Referencias.ListarUPServiciosOrigen('6208');
        //await Referencias.ListarCondicionUsuario();

        if (this.ValidarCargaData()) {
            //var objrowTb = oTable_atencionesRefCon.api(true).row('.selected').data();

            if (TipoRef == 1) {
                await this.CargarDataRef(IdCuentaAtencion, IdAtencion, TipoRef);
                await EstablecimientoSalud.IniciarData();
            } else if (TipoRef == 2) {
                await this.CargarDataConRef(IdCuentaAtencion, IdAtencion, TipoRef);
                await EstablecimientoSalud.IniciarData();
            }
        }
    },

    async CargarDataSinValidar(IdCuentaAtencion, IdAtencion, TipoRef, modulo) {
        this.LimpiarModal();
        this.HabilitarModal();
        Referencias.moduloActualRefCon = modulo;
        //console.log(TipoRef);
        if (TipoRef == 1) {
            await this.CargarDataRef(IdCuentaAtencion, IdAtencion, TipoRef);
            await EstablecimientoSalud.IniciarData();
        } else if (TipoRef == 2) {
            await this.CargarDataConRef(IdCuentaAtencion, IdAtencion, TipoRef);
            await EstablecimientoSalud.IniciarData();
        }
    },

    async CargarDataRef(IdCuentaAtencion, IdAtencion, TipoRef) {
        //var objrowTb = oTable_atencionesRefCon.api(true).row('.selected').data();
        Cargando(1);
        const objrow = await this.AtencionReferenciaSeleccionarPorIdCuenta(IdCuentaAtencion, TipoRef);
        const dxAt = await this.ListaDiagnosticosAtencion(IdAtencion);
        const respEESS = await this.ReferenciaResponsableEESSSelecionar();

        await this.ListarMedicos()

        //await this.ListarUPServiciosOrigen(objrow.codigoEstablecimientoOrigen);

        $("#cboServicioDestino").empty();
        if (objrow.ipressDestino != '') {
            await this.ListarUPServiciosDestino(objrow.ipressDestino);
        }

        Referencias.idResponsable = objrow.idEmpleadoMedico;
        
        $('#cboResponsableEstablecimiento').val(objrow.idResponsableEESS)

        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#cboResponsableEstablecimiento').trigger('change')
        //Referencias.idResponsableEESS = respEESS.idEmpleadoEESS;
        //$('#txtMedicoEESS').val(respEESS.medicoEESS);
        //$('#txtProfesionMedicoESS').val(respEESS.profesionMedicoEESS);
        //$('#txtColegioProfesionalEESS').val(respEESS.colegioMedicoEESS);


        //$('#txtNroReferencia').val('6208-01090');
        $('#ipressorigen').val(objrow.codigoEstablecimientoOrigen);
        $('#origen').val(objrow.nombreEstablecimientoOrigen);
        //$('#servicioorigen').val(objrow.servicioOrigen + ' / ' + objrow.especialidadOrigen);
        $('#cboServicioOrigen').val(objrow.upsOrigen);
        //$('#servicioorigen').val(objrow.idServicioOrigen);
        $('#ipressdestino').val(objrow.ipressDestino);
        $('#destino').val(objrow.nombreEstablecimientoDestino);
        $('#cboServicioDestino').val(objrow.upsDestino);
        //$('#serviciodestino').val(objrow.servicioDestino + ' / ' + objrow.especialidadDestino);
        //$('#serviciodestino').val(objrow.idServicioDestino);
        $('#txtTipoDoc').val(objrow.tipoDocumentoPaciente);
        $('#txtNumDoc').val(objrow.nrodocumentoPaciente);
        //$('#txtFinanciador').val('USUARIO');
        $('#txtFinanciador').val(objrow.financiador);
        $('#txtNumAfiliacion').val(objrow.nroAfiliacion);
        $('#txtNumHistoria').val(objrow.historiaPaciente);
        $('#txtApPaterno').val(objrow.apPaternoPaciente);
        $('#txtApMaterno').val(objrow.apMaternoPaciente);
        $('#txtNombresR').val(objrow.nombresPaciente);
        $('#txtSexo').val(objrow.sexoPaciente);
        $('#txtFechaNacimiento').val(objrow.fechaNacimientoPaciente);
        $('#txtEdad').val(objrow.edadPaciente);
        $('#txtDomicilio').val(objrow.direccionPaciente);
        $('#txtDepartamento').val(objrow.departamentoPaciente);
        $('#txtProvincia').val(objrow.provinciaPaciente);
        $('#txtDistrito').val(objrow.distritoPaciente);
        $('#txtOrigenRef').val(objrow.nombreEstablecimientoDestino);
        $('#txtServContraRef').val(objrow.servicioOrigen);
        $('#txtEspContraRef').val(objrow.especialidadOrigen);

        if (Referencias.moduloActualRefCon == 'AltaMedica') {
            $('#txtMedico').val($('#cboMedicoAlta  option:selected').data('mediconombre'));
            $('#txtProfesionMedico').val($('#cboMedicoAlta  option:selected').data('tipoempleado'));
            $('#txtColegioProfesional').val($('#cboMedicoAlta  option:selected').data('colegio'));
        }

        if (isEmpty(objrow.medico) == false) {
            $('#txtMedico').val(objrow.medico);
            $('#txtProfesionMedico').val(objrow.profesionMedico);
            $('#txtColegioProfesional').val(objrow.colegioMedico);
        }
                
        //////////REFERENCIA//////////////
        //$('#txtNroReferencia').val('6208-' + objrow.nroReferenciaOrigen);
        $('#txtNroReferencia').val(objrow.codigoEstablecimientoOrigen + '-' + objrow.nroReferenciaOrigen);        
        $('#txtAnamnesisRef').val(objrow.anamnesis);
        $('#txtTPRef').val(objrow.tp);
        $('#txtPARef').val(objrow.pa);
        $('#txtFRRef').val(objrow.fr);
        $('#txtFCRef').val(objrow.fc);
        $('#txtExamenFisicoRef').val(objrow.examenFisico);
        //$('#txtMotivoRef').val(objrow.motivo);
        $("#cboMotivoRef").val(objrow.motivo);
        $('#txtDetalleMotivoRef').val(objrow.detalleMotivo);
        $('#txtNotasObsRef').val(objrow.observaciones);
        $('#cboCondicion').val(objrow.condicionPaciente);
        $('#cbotransporte').val(objrow.tipoTransporte);
        $('#cboEspecialidadRef').val(objrow.especialidadDestino);
        ////////////////////////////////////

        $('#txtDxEgresoRef').val('');
        $.each(dxAt, function (i, item) {
            //alert(data.result[i].PageName);
            //var dx = $('#txtDxEgreso').val() + '\n';
            //$('#txtDxOrigenCR').val($('#txtDxEgresoRef').val() + 'Dx ' + (i + 1) + ' = ' + dxAt[i].codigoCIEsinPto + '- ' + dxAt[i].descripcion + '  (' + dxAt[i].subclasDiagnostico + ') \n');
            //$('#txtDxIngresoCR').val($('#txtDxEgresoRef').val() + 'Dx ' + (i + 1) + ' = ' + dxAt[i].codigoCIEsinPto + '- ' + dxAt[i].descripcion + '  (' + dxAt[i].subclasDiagnostico + ') \n');
            $('#txtDxEgresoRef').val($('#txtDxEgresoRef').val() + 'Dx ' + (i + 1) + ' = ' + dxAt[i].codigoCIEsinPto + '- ' + dxAt[i].descripcion + '  (' + dxAt[i].subclasDiagnostico + ') \n');
        });
        $('#txtTratamientoRef').val(objrow.tratamiento);

        if (Referencias.moduloActualRefCon == 'ModuloCE' || Referencias.moduloActualRefCon == 'ModuloNinoSano' || Referencias.moduloActualRefCon == 'ModuloMaterno') {
            Referencias.idResponsable = Referencias.idResponsable;

            $('#txtDxEgresoRef').val('');
            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            ListDiagnosticos = ListDiagnosticos.toArray();
            $.each(ListDiagnosticos, function (i, item) {
                $('#txtDxEgresoRef').val($('#txtDxEgresoRef').val() + 'Dx ' + (i + 1) + ' = ' + ListDiagnosticos[i].codigoCIE10.trim() + '- ' + ListDiagnosticos[i].descripcion.trim() + '  (' + ListDiagnosticos[i].tipoDiagnostico.trim() + ') \n');
            });

            if (objrow.idRefCon == null) {
                if (Referencias.moduloActualRefCon == 'ModuloMaterno') {
                    $('#txtAnamnesisRef').val($('#txtMotivoConsultaPeri').val());
                }
                if (Referencias.moduloActualRefCon == 'ModuloCE') {
                    $('#txtAnamnesisRef').val($('#txtMotivoCons').val());
                    $('#txtExamenFisicoRef').val($('#txtExamenC').val());
                }

                $('#txtTratamientoRef').val($('#txtTratamiento').val());
            }
        }

        if (Referencias.moduloActualRefCon == 'AltaMedica') {
            //Referencias.idResponsable = $("#cboMedicoAlta").val();
            Referencias.idResponsable = $('#cboMedicoAlta  option:selected').data('empleado');
            
            $('#txtDxEgresoRef').val('');
            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            ListDiagnosticos = ListDiagnosticos.toArray();
            $.each(ListDiagnosticos, function (i, item) {
                $('#txtDxEgresoRef').val($('#txtDxEgresoRef').val() + 'Dx ' + (i + 1) + ' = ' + ListDiagnosticos[i].codigoCIE10.trim() + '- ' + ListDiagnosticos[i].descripcion.trim() + '  (' + ListDiagnosticos[i].tipoDiagnostico.trim() + ') \n');
            });
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
        Cargando(0);
        this.AbrirModalRef();
    },

    async CargarDataConRef(IdCuentaAtencion, IdAtencion, TipoRef) {
        //var objrowTb = oTable_atencionesRefCon.api(true).row('.selected').data();
        //console.log(objrowTb);
        Cargando(1);
        const objrow = await this.AtencionReferenciaSeleccionarPorIdCuenta(IdCuentaAtencion, TipoRef);
        const dxAt = await this.ListaDiagnosticosAtencion(IdAtencion);
        const respEESS = await this.ReferenciaResponsableEESSSelecionar();

        //await this.ListarUPServiciosOrigen(objrow.codigoEstablecimientoOrigen);
        await this.ListarUPServiciosDestino(objrow.codigoEstablecimientoDestino);

        Referencias.idResponsable = objrow.idEmpleadoMedico;
        Referencias.idResponsableEESS = respEESS.idEmpleadoEESS;
        
        $('#ipressorigenCR').val(objrow.codigoEstablecimientoOrigen);
        $('#origenCR').val(objrow.nombreEstablecimientoOrigen);
        $('#cboServicioOrigenCR').val(objrow.upsOrigen);
        //$('#servicioorigenCR').val(objrow.servicioOrigen + ' / ' + objrow.especialidadOrigen);
        //$('#servicioorigen').val(objrow.idServicioOrigen);
        $('#ipressdestinoCR').val(objrow.codigoEstablecimientoDestino);
        $('#destinoCR').val(objrow.nombreEstablecimientoDestino);
        $('#cboServicioDestinoCR').val(objrow.upsDestino);
        //$('#serviciodestino').val(objrow.servicioDestino + ' / ' + objrow.especialidadDestino);
        //$('#serviciodestino').val(objrow.idServicioDestino);
        $('#txtTipoDocCR').val(objrow.tipoDocumentoPaciente);
        $('#txtNumDocCR').val(objrow.nrodocumentoPaciente);
        //$('#txtFinanciador').val('USUARIO');
        $('#txtFinanciadorCR').val(objrow.financiador);
        $('#txtNumAfiliacionCR').val(objrow.nroAfiliacion);
        $('#txtNumHistoriaCR').val(objrow.historiaPaciente);
        $('#txtApPaternoCR').val(objrow.apPaternoPaciente);
        $('#txtApMaternoCR').val(objrow.apMaternoPaciente);
        $('#txtNombresCR').val(objrow.nombresPaciente);
        $('#txtSexoCR').val(objrow.sexoPaciente);
        $('#txtFechaNacimientoCR').val(objrow.fechaNacimientoPaciente);
        $('#txtEdadCR').val(objrow.edadPaciente);
        $('#txtDomicilioCR').val(objrow.direccionPaciente);
        $('#txtDepartamentoCR').val(objrow.departamentoPaciente);
        $('#txtProvinciaCR').val(objrow.provinciaPaciente);
        $('#txtDistritoCR').val(objrow.distritoPaciente);
        $('#txtOrigenRefCR').val(objrow.nombreEstablecimientoDestino);
        //$('#txtServContraRefCR').val(objrow.servicioOrigen);

        //$('#txtEspContraRefCR').val(objrow.especialidadOrigen);
        //$('#cboEspecialidadCR').val(objrow.especialidadOrigen)
        $('#cboEspecialidadCR').val(objrow.especialidad);

        if (Referencias.moduloActualRefCon == 'AltaMedica') {
            $('#txtMedicoCR').val($('#cboMedicoAlta  option:selected').data('mediconombre'));
            $('#txtProfesionMedicoCR').val($('#cboMedicoAlta  option:selected').data('tipoempleado'));
            $('#txtColegioProfesionalCR').val($('#cboMedicoAlta  option:selected').data('colegio'));
        }

        if (isEmpty(objrow.medico) == false) {
            $('#txtMedicoCR').val(objrow.medico);
            $('#txtProfesionMedicoCR').val(objrow.profesionMedico);
            $('#txtColegioProfesionalCR').val(objrow.colegioMedico);
        }
        if (objrow.nroHoja != null) {
            $('#txtNroContraReferencia').val(objrow.nroHoja);
        }
        
        $('#txtDxOrigenCR').val(objrow.dxOrigen);
        $('#txtDxIngresoCR').val(objrow.dxIngreso);
        $('#txtCalificaRefCR').val(objrow.calificacion);
        $('#txtRecomendaciones').val(objrow.recomendaciones);
        $('#cboCondicionUsuario').val(objrow.idCondicionUsuario);

        $('#txtDxEgresoCR').val('');
        $.each(dxAt, function (i, item) {
            //$('#txtDxOrigenCR').val($('#txtDxOrigenCR').val() + 'Dx ' + (i + 1) + ' = ' + dxAt[i].codigoCIEsinPto + '- ' + dxAt[i].descripcion + '  (' + dxAt[i].subclasDiagnostico + ') \n');

            //if (dxAt[i].idClasificacionDx == 2) {
            //    $('#txtDxIngresoCR').val($('#txtDxIngresoCR').val() + 'Dx ' + (i + 1) + ' = ' + dxAt[i].codigoCIEsinPto + '- ' + dxAt[i].descripcion + '  (' + dxAt[i].subclasDiagnostico + ') \n');

            //}
            
            $('#txtDxEgresoCR').val($('#txtDxEgresoCR').val() + 'Dx ' + (i + 1) + ' = ' + dxAt[i].codigoCIEsinPto.trim() + '- ' + dxAt[i].descripcion.trim() + '  (' + dxAt[i].subclasDiagnostico + ') \n');
        });
        $('#txtTratamientoCR').val(objrow.tratamiento);

        if (Referencias.moduloActualRefCon == 'ModuloCE' || Referencias.moduloActualRefCon == 'ModuloNinoSano' || Referencias.moduloActualRefCon == 'ModuloMaterno') {
            Referencias.idResponsable = Referencias.idResponsable;

            $('#txtDxEgresoCR').val('');
            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            ListDiagnosticos = ListDiagnosticos.toArray();
            $.each(ListDiagnosticos, function (i, item) {
                $('#txtDxEgresoCR').val($('#txtDxEgresoCR').val() + 'Dx ' + (i + 1) + ' = ' + ListDiagnosticos[i].codigoCIE10.trim() + '- ' + ListDiagnosticos[i].descripcion.trim() + '  (' + ListDiagnosticos[i].tipoDiagnostico.trim() + ') \n');
            });

            if (objrow.idRefCon == null) {
                $('#txtTratamientoCR').val($('#txtTratamiento').val());
            }

        }

        if (Referencias.moduloActualRefCon == 'AltaMedica') {
            //Referencias.idResponsable = $("#cboMedicoAlta").val();
            Referencias.idResponsable = $('#cboMedicoAlta  option:selected').data('empleado');

            $('#txtDxEgresoCR').val('');
            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            ListDiagnosticos = ListDiagnosticos.toArray();
            $.each(ListDiagnosticos, function (i, item) {
                $('#txtDxEgresoCR').val($('#txtDxEgresoCR').val() + 'Dx ' + (i + 1) + ' = ' + ListDiagnosticos[i].codigoCIE10.trim() + '- ' + ListDiagnosticos[i].descripcion.trim() + '  (' + ListDiagnosticos[i].tipoDiagnostico.trim() + ') \n');
            });
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
        $('#txtServContraRefCR').val($('#cboServicioDestinoCR_chosen span').html())
        Cargando(0);
        this.AbrirModalConRef();
    },


    ValidarCargaData() {
        var objrowTb = oTable_atencionesRefCon.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro.');
            return false;
        }
        //var objrow = AtencionReferenciaSeleccionarPorIdCuenta(objrowTb.idCuentaAtencion, objrowTb.TipoRef);
        //var dxAt = ListaDiagnosticosAtencion(objrow.idAtencion);

        if (objrowTb.idEstadoAtencion == 2) {
            alerta(2, 'La cuenta se encuentra cerrada.');
            return false;
        }
        return true;
    },

    ValidarVariablesConRef() {
        if ($("#cboServicioOrigenCR").val() == "" || $("#cboServicioOrigenCR").val() == null) { alerta(2, "Debe seleccionar el Servicio de Origen."); $("#cboServicioOrigenCR").focus(); return false; }
        if ($("#cboServicioDestinoCR").val() == "" || $("#cboServicioDestinoCR").val() == null) { alerta(2, "Debe seleccionar el Servicio de Destino."); $("#cboServicioDestinoCR").focus(); return false; }
        if ($("#txtTratamientoCR").val() == "" || $("#txtTratamientoCR").val() == null) { alerta(2, "Debe ingresar el Tratamiento Realizado."); $("#txtTratamientoCR").focus(); return false; }
        if ($("#cboEspecialidadCR").val() == "" || $("#cboEspecialidadCR").val() == null) { alerta(2, "Debe seleccionar la Especialidad que Ordena la Contrareferencia."); $("#cboEspecialidadCR").focus(); return false; }
        if ($("#cboCondicionUsuario").val() == "" || $("#cboCondicionUsuario").val() == null) { alerta(2, "Debe seleccionar la Condición del Usuario."); $("#cboCondicionUsuario").focus(); return false; }
        if ($("#txtRecomendaciones").val() == "" || $("#txtRecomendaciones").val() == null) { alerta(2, "Debe ingresar las Recomendaciones e Indicaciones."); $("#txtRecomendaciones").focus(); return false; }
        return true;
    },

    ValidarVariablesRef() {
        if ($("#cboServicioOrigen").val() == "" || $("#cboServicioOrigen").val() == null) { alerta(2, "Debe seleccionar el Servicio de Origen."); $("#cboServicioOrigen").focus(); return false; }
        if ($("#cboServicioDestino").val() == "" || $("#cboServicioDestino").val() == null) { alerta(2, "Debe seleccionar el Servicio de Destino."); $("#cboServicioDestino").focus(); return false; }
        if ($("#txtAnamnesisRef").val() == "" || $("#txtAnamnesisRef").val() == null) { alerta(2, "Debe ingresar la Anamnesis."); $("#txtAnamnesisRef").focus(); return false; }
        if ($("#txtExamenFisicoRef").val() == "" || $("#txtExamenFisicoRef").val() == null) { alerta(2, "Debe ingresar el Examen Físico."); $("#txtExamenFisicoRef").focus(); return false; }
        if ($("#txtTratamientoRef").val() == "" || $("#txtTratamientoRef").val() == null) { alerta(2, "Debe ingresar el Tratamiento."); $("#txtTratamientoRef").focus(); return false; }
        //if ($("#txtMotivoRef").val() == "" || $("#txtMotivoRef").val() == null) { alerta(2, "Debe ingresar el Motivo de la Referencia."); $("#txtMotivoRef").focus(); return false; }
        if ($("#cboMotivoRef").val() == "" || $("#cboMotivoRef").val() == null) { alerta(2, "Debe seleccionar el Motivo de la Referencia."); $("#cboMotivoRef").focus(); return false; }
        if ($("#txtDetalleMotivoRef").val() == "" || $("#txtDetalleMotivoRef").val() == null) { alerta(2, "Debe ingresar el Detalle del Motivo de la Referencia."); $("#txtDetalleMotivoRef").focus(); return false; }
        if ($("#txtNotasObsRef").val() == "" || $("#txtNotasObsRef").val() == null) { alerta(2, "Debe ingresar Notas/Observaciones de la Referencia."); $("#txtNotasObsRef").focus(); return false; }

        if ($("#cboEspecialidadRef").val() == "" || $("#cboEspecialidadRef").val() == null) { alerta(2, "Debe seleccionar la Especialidad del Destino."); $("#cboEspecialidadRef").focus(); return false; }
        if ($("#cboCondicion").val() == "" || $("#cboCondicion").val() == null) { alerta(2, "Debe seleccionar la Condición del Paciente."); $("#cboCondicion").focus(); return false; }
        if ($("#cbotransporte").val() == "" || $("#cbotransporte").val() == null) { alerta(2, "Debe seleccionar el Tipo de Transporte."); $("#cbotransporte").focus(); return false; }
        return true;
    },

    CargarVariablesConRef() {
        //var objrow = oTable_atencionesRefCon.api(true).row('.selected').data();

        //if (isEmpty(objrow)) {
        //    objrow = AtencionMedicaInit.oTable_atencionesRefCon.api(true).row('.selected').data();
        //}
               
        var formData = new FormData();
        formData.append('NroHojaContraReferencia', $('#txtNroContraReferencia').val());
        //formData.append('IdCuentaAtencion', objrow.idCuentaAtencion);
        formData.append('IdCuentaAtencion', Variables.IdCuentaAtencion);
        formData.append('IpressOrigen', $('#ipressorigenCR').val());
        formData.append('IpressDestino', $('#ipressdestinoCR').val());
        formData.append('ServicioOrigen', $('#cboServicioOrigenCR').val());
        formData.append('ServicioDestino', $('#cboServicioDestinoCR').val());
        formData.append('Especialidad', $('#cboEspecialidadCR').val());
        formData.append('DxOrigen', $('#txtDxOrigenCR').val());
        formData.append('DxIngreso', $('#txtDxIngresoCR').val());
        formData.append('DxEgreso', $('#txtDxEgresoCR').val());
        formData.append('Tratamiento', $('#txtTratamientoCR').val());
        formData.append('Recomendaciones', $('#txtRecomendaciones').val());
        formData.append('Calificacion', $('#txtCalificaRefCR').val());
        formData.append('CondicionUsuario', $('#cboCondicionUsuario').val());

        $('.chzn-select').chosen().trigger("chosen:updated");

        formData.append('DescOrigen', $('#origenCR').val());
        formData.append('DescServicioOrigen', $('#cboServicioOrigenCR_chosen').text());
        formData.append('DescDestino', $('#destinoCR').val());
        formData.append('DescServicioDestino', $('#cboServicioDestinoCR_chosen').text());
        formData.append('DxEgreso', $('#txtDxEgresoCR').val());
        formData.append('DescEspecialidad', $('#cboEspecialidadCR_chosen').text());

        formData.append('IdResponsable', Referencias.idResponsable);
        formData.append('IdResponsableEESS', Referencias.idResponsableEESS);

        //////////////Para Firma DIgital////////////////////
        //formData.append('codigoFD', objrow.codeCRef);
        //formData.append('IdTipoServicioFD', objrow.idTipoServicio);
        //formData.append('IdServicioFD', objrow.idServicioIngreso);
        //formData.append('IdEmpleadoFD', objrow.idEmpleadoMedico);
        //formData.append('IdServicioFD', objrow.idServicioIngreso);
        //formData.append('fechaFD', objrow.fechaIngreso2);
        ////////////////////////////////////////////////////


        return formData;
    },

    CargarVariablesRef() {
        //var objrow = oTable_atencionesRefCon.api(true).row('.selected').data();
        
        //if (isEmpty(objrow)) {
        //    objrow = AtencionMedicaInit.oTable_atencionesRefCon.api(true).row('.selected').data();
        //}
        
        var formData = new FormData();
        formData.append('NroHojaReferencia', $('#NroHojaReferencia').val());
        //formData.append('IdCuentaAtencion', objrow.idCuentaAtencion);
        formData.append('IdCuentaAtencion', Variables.IdCuentaAtencion);
        formData.append('IpressOrigen', $('#ipressorigen').val());
        formData.append('IpressDestino', $('#ipressdestino').val());
        formData.append('ServicioOrigen', $('#cboServicioOrigen').val());
        formData.append('ServicioDestino', $('#cboServicioDestino').val());
        formData.append('Anamnesis', $('#txtAnamnesisRef').val());
        formData.append('ExamenFisico', $('#txtExamenFisicoRef').val());
        formData.append('Tratamiento', $('#txtTratamientoRef').val());
        //formData.append('Motivo', $('#txtMotivoRef').val())
        formData.append('Motivo', $('#cboMotivoRef').val())
        formData.append('DetalleMotivo', $('#txtDetalleMotivoRef').val());
        formData.append('NotasObservaciones', $('#txtNotasObsRef').val());
        formData.append('EspecialidadDestino', $('#cboEspecialidadRef').val());
        formData.append('CondicionPaciente', $('#cboCondicion').val());
        formData.append('TipoTransporte', $('#cbotransporte').val());

        $('.chzn-select').chosen().trigger("chosen:updated");

        formData.append('DescOrigen', $('#origen').val());
        formData.append('DescServicioOrigen', $('#cboServicioOrigen_chosen').text());
        formData.append('DescDestino', $('#destino').val());
        formData.append('DescServicioDestino', $('#cboServicioDestino_chosen').text());
        formData.append('DxEgreso', $('#txtDxEgresoRef').val());
        formData.append('DescEspecialidad', $('#cboEspecialidadRef_chosen').text());

        formData.append('IdResponsable', Referencias.idResponsable);
        formData.append('IdResponsableEESS', Referencias.idResponsableEESS);

        //////////////Para Firma DIgital////////////////////
        //formData.append('codigoFD', objrow.codeCRef);
        //formData.append('IdTipoServicioFD', objrow.idTipoServicio);
        //formData.append('IdServicioFD', objrow.idServicioIngreso);
        //formData.append('IdEmpleadoFD', objrow.idEmpleadoMedico);
        //formData.append('IdServicioFD', objrow.idServicioIngreso);
        //formData.append('fechaFD', objrow.fechaIngreso2);
        ////////////////////////////////////////////////////

        return formData;
    },

    async AtencionReferenciaSeleccionarPorIdCuenta(idCuenta, tipo) {


        var respuesta;
        let datos;

        var midata = new FormData();
        midata.append('idCuenta', idCuenta);
        midata.append('tipo', tipo);
        var dataReferencia = {};

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Referencia/AtencionReferenciaSeleccionarPorIdCuenta?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsReferencia.table.length > 0) {
                    dataReferencia = datos.lsReferencia.table[0];
                }
                else {
                    dataReferencia = {};
                }

            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return dataReferencia;
    },

    async ListarMedicos() { // JDELGADO010
        //console.log("ENTRANDO A LISTAR MEDICOS")
        $.ajax({
            method: "POST",
            url: "/Utilitario/ListarMedicosResponsableReferencia?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboResponsableEstablecimiento').empty();
                $(datos.dataSet.table).each(function (i, obj) {
                    $('#cboResponsableEstablecimiento').append('<option data-medico="'+obj.idMedico+'"  value="' + obj.idEmpleado + '" colegiatura="' + obj.colegiatura + '" colegioMedico="' + obj.colegioMedico + '" profesion="' + obj.profesion + '">' + obj.medico + '</option>');
                });
                $('#cboResponsableEstablecimiento').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar medicos!", "2");
                }, 900)
            }
        });
    },

    async ReferenciaResponsableEESSSelecionar() {


        var respuesta;
        let datos;
        var dataResponsableEESS = {};

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Referencia/ReferenciaResponsableEESSSelecionar?area=ConsultaExterna",
                    //data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    dataResponsableEESS = datos.respuesta.table[0];
                }
                else {
                    dataReferencia = {};
                }

            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return dataResponsableEESS;
    },

  
    async ListaDiagnosticosAtencion(idAtencion) {

        var respuesta;
        let datos;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        var dataDiagnosticos = {};

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/AtencionesDiagnosticosSeleccionarXidAtencion?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {
                    dataDiagnosticos = datos.table;
                }
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }

        return dataDiagnosticos;
    },

    async ListarEspecialidades() {

        var respuesta;
        let datos;
        $('#cboEspecialidadCR').empty();
        $('#cboEspecialidadRef').empty();

        try {
            Cargando(1);
            datos = { "codigo": "0000", "data": [ { "codigo_especialidad": "1-0001", "especialidad": "ADMINISTRACIÓN DE HOSPITALES" }, { "codigo_especialidad": "3-0001", "especialidad": "CIRUGÍA BUCAL MÁXILO FACIAL" }, { "codigo_especialidad": "8-0001", "especialidad": "PSICOLOGÍA CLÍNICA Y DE LA SALUD" }, { "codigo_especialidad": "9-0001", "especialidad": "TERAPIA FÍSICA Y REHABILITACIÓN" }, { "codigo_especialidad": "1-0002", "especialidad": "ADMINISTRACIÓN DE SALUD" }, { "codigo_especialidad": "3-0002", "especialidad": "CARIELOGÍA Y ENDODONCIA" }, { "codigo_especialidad": "8-0002", "especialidad": "PSICOLOGÍA JURÍDICA" }, { "codigo_especialidad": "9-0002", "especialidad": "LABORATORIO CLÍNICO Y ANATOMÍA PATOLÓGICA" }, { "codigo_especialidad": "1-0003", "especialidad": "ADOLESCENTOLOGÍA ONCOLÓGICA" }, { "codigo_especialidad": "3-0003", "especialidad": "MEDICINA Y PATOLOGÍA ESTOMATOLÓGICA" }, { "codigo_especialidad": "8-0003", "especialidad": "PSICOLOGÍA ORGANIZACIONAL" }, { "codigo_especialidad": "9-0003", "especialidad": "RADIOLOGÍA" }, { "codigo_especialidad": "1-0004", "especialidad": "ANATOMÍA HUMANA" }, { "codigo_especialidad": "3-0004", "especialidad": "ODONTOPEDIATRÍA" }, { "codigo_especialidad": "8-0004", "especialidad": "PSICOLOGÍA EDUCACIONAL" }, { "codigo_especialidad": "9-0004", "especialidad": "OPTOMETRÍA" }, { "codigo_especialidad": "1-0005", "especialidad": "ANATOMÍA PATOLÓGICA" }, { "codigo_especialidad": "3-0005", "especialidad": "ORTODONCIA Y ORTOPEDIA MAXILAR" }, { "codigo_especialidad": "8-0005", "especialidad": "PSICOLOGÍA POLICIAL-MILITAR" }, { "codigo_especialidad": "9-0005", "especialidad": "TERAPIA OCUPACIONAL" }, { "codigo_especialidad": "1-0006", "especialidad": "ANATOMÍA PATOLÓGICA-PATOLOGÍA CLÍNICA" }, { "codigo_especialidad": "3-0006", "especialidad": "PERIODONCIA" }, { "codigo_especialidad": "8-0006", "especialidad": "PSICOLOGÍA DEL DEPORTE" }, { "codigo_especialidad": "9-0006", "especialidad": "TERAPIA DE LENGUAJE" }, { "codigo_especialidad": "3-0007", "especialidad": "RADIOLOGÍA BUCAL Y MÁXILO FACIAL" }, { "codigo_especialidad": "8-0007", "especialidad": "PSICOLOGÍA SOCIAL-COMUNITARIA" }, { "codigo_especialidad": "1-0008", "especialidad": "ANESTESIOLOGÍA" }, { "codigo_especialidad": "3-0008", "especialidad": "REHABILITACIÓN ORAL" }, { "codigo_especialidad": "8-0008", "especialidad": "PSICOLOGÍA DEL ADULTO MAYOR" }, { "codigo_especialidad": "1-0009", "especialidad": "ANGIOLOGÍA" }, { "codigo_especialidad": "3-0009", "especialidad": "SALUD PÚBLICA ESTOMATOLÓGICA" }, { "codigo_especialidad": "8-0009", "especialidad": "PSICOLOGÍA DE LAS EMERGENCIAS Y DESASTRES" }, { "codigo_especialidad": "1-0010", "especialidad": "BIOQUÍMICA 2" }, { "codigo_especialidad": "3-0010", "especialidad": "ODONTOLOGÍA FORENSE" }, { "codigo_especialidad": "8-0010", "especialidad": "PSICOLOGÍA DE LA FAMILIA" }, { "codigo_especialidad": "1-0011", "especialidad": "CARDIOLOGÍA" }, { "codigo_especialidad": "3-0011", "especialidad": "ESTOMATOLÓGICA DE PACIENTES ESPECIALES" }, { "codigo_especialidad": "8-0011", "especialidad": "PSICOLOGÍA DE LAS ADICCIONES" }, { "codigo_especialidad": "1-0012", "especialidad": "PEDIATRÍA - CIRUGÍA CARDIOVASCULAR PEDIÁTRICA" }, { "codigo_especialidad": "8-0012", "especialidad": "PSICOLOGÍA AMBIENTAL" }, { "codigo_especialidad": "1-0013", "especialidad": "CIRUGÍA DE CABEZA Y CUELLO" }, { "codigo_especialidad": "8-0013", "especialidad": "PSICOLOGÍA POLÍTICA" }, { "codigo_especialidad": "1-0014", "especialidad": "TRAUMATOLOGÍA Y ORTOPEDIA - CIRUGÍA DE MANO" }, { "codigo_especialidad": "8-0014", "especialidad": "PSICOLOGÍA PENITENCIARIA" }, { "codigo_especialidad": "1-0015", "especialidad": "CIRUGÍA GENERAL" }, { "codigo_especialidad": "1-0016", "especialidad": "CIRUGÍA ONCOLÓGICA" }, { "codigo_especialidad": "1-0017", "especialidad": "CIRUGÍA NEUMOLÓGICA" }, { "codigo_especialidad": "1-0018", "especialidad": "CIRUGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0019", "especialidad": "CIRUGÍA PLÁSTICA" }, { "codigo_especialidad": "1-0020", "especialidad": "CIRUGÍA DE TÓRAX Y CARDIOVASCULAR" }, { "codigo_especialidad": "1-0021", "especialidad": "DERMATOLOGÍA" }, { "codigo_especialidad": "1-0022", "especialidad": "EMBRIONOLOGÍA" }, { "codigo_especialidad": "1-0023", "especialidad": "ENDOCRINOLOGÍA" }, { "codigo_especialidad": "1-0024", "especialidad": "ENDOCRINOLOGÍA PEDIÁTRICA Y GENÉTICA" }, { "codigo_especialidad": "1-0025", "especialidad": "ENFERMEDADES INFECCIOSAS Y TROPICALES" }, { "codigo_especialidad": "1-0026", "especialidad": "EPIDEMIOLOGÍA" }, { "codigo_especialidad": "1-0027", "especialidad": "FARMACOLOGÍA" }, { "codigo_especialidad": "1-0028", "especialidad": "FISIOLOGÍA" }, { "codigo_especialidad": "1-0029", "especialidad": "GASTROENTEROLOGÍA" }, { "codigo_especialidad": "1-0030", "especialidad": "GASTROENTEROLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0031", "especialidad": "GENÉTICA" }, { "codigo_especialidad": "1-0032", "especialidad": "GERIATRÍA" }, { "codigo_especialidad": "1-0033", "especialidad": "GINECOLOGÍA Y OBSTETRICIA - GINECOLOGÍA ONCOLÓGICA" }, { "codigo_especialidad": "1-0034", "especialidad": "GINECOLOGÍA Y OBSTETRICIA" }, { "codigo_especialidad": "1-0035", "especialidad": "HEMATOLOGÍA" }, { "codigo_especialidad": "1-0036", "especialidad": "HISTOLOGÍA" }, { "codigo_especialidad": "1-0037", "especialidad": "HISTOPATOLOGÍA" }, { "codigo_especialidad": "1-0038", "especialidad": "PEDIATRÍA - INFECTOLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0039", "especialidad": "INMUNOLOGÍA Y ALERGIA" }, { "codigo_especialidad": "1-0040", "especialidad": "INMUNOLOGÍA Y REUMATOLOGÍA" }, { "codigo_especialidad": "1-0041", "especialidad": "LABORATORIO CLÍNICO" }, { "codigo_especialidad": "1-0042", "especialidad": "LABORATORIO CLÍNICO Y ANATOMÍA PATOLÓGICA" }, { "codigo_especialidad": "1-0043", "especialidad": "MEDICINA DE EMERGENCIA Y DESASTRES" }, { "codigo_especialidad": "1-0044", "especialidad": "MEDICINA DEL DEPORTE " }, { "codigo_especialidad": "1-0045", "especialidad": "MEDICINA DEL TRABAJO " }, { "codigo_especialidad": "1-0046", "especialidad": "MEDICINA FAMILIAR " }, { "codigo_especialidad": "1-0047", "especialidad": "MEDICINA DE REHABILITACIÓN" }, { "codigo_especialidad": "1-0048", "especialidad": "MEDICINA GENERAL INTEGRAL " }, { "codigo_especialidad": "1-0049", "especialidad": "MEDICINA GENERAL" }, { "codigo_especialidad": "1-0050", "especialidad": "MEDICINA INTEGRAL Y GESTIÓN EN SALUD" }, { "codigo_especialidad": "1-0051", "especialidad": "MEDICINA INTENSIVA" }, { "codigo_especialidad": "1-0052", "especialidad": "PEDIATRÍA - MEDICINA INTENSIVA PEDIÁTRICA" }, { "codigo_especialidad": "1-0053", "especialidad": "MEDICINA INTERNA " }, { "codigo_especialidad": "1-0054", "especialidad": "MEDICINA LEGAL " }, { "codigo_especialidad": "1-0055", "especialidad": "MEDICINA OCUPACIONAL Y MEDIO AMBIENTE" }, { "codigo_especialidad": "1-0056", "especialidad": "MEDICINA NUCLEAR" }, { "codigo_especialidad": "1-0057", "especialidad": "NEFROLOGÍA" }, { "codigo_especialidad": "1-0058", "especialidad": "PEDIATRÍA - NEFROLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0059", "especialidad": "NEONATOLOGÍA" }, { "codigo_especialidad": "1-0060", "especialidad": "NEUMOLOGÍA" }, { "codigo_especialidad": "1-0061", "especialidad": "PEDIATRÍA - NEUMOLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0062", "especialidad": "NEUROCIRUGÍA" }, { "codigo_especialidad": "1-0063", "especialidad": "NEUROLOGÍA" }, { "codigo_especialidad": "1-0064", "especialidad": "PEDIATRÍA - NEUROLOGÍA PEDIÁTRICA" }, { "codigo_especialidad": "1-0065", "especialidad": "NUTRICIÓN" }, { "codigo_especialidad": "1-0066", "especialidad": "OFTALMOLOGÍA" }, { "codigo_especialidad": "1-0067", "especialidad": "OFTALMOLOGÍA ONCOLÓGICA" }, { "codigo_especialidad": "1-0068", "especialidad": "MEDICINA ONCOLÓGICA" }, { "codigo_especialidad": "1-0069", "especialidad": "ONCOLOGÍA QUIRÚRGICA " }, { "codigo_especialidad": "1-0070", "especialidad": "TRAUMATOLOGÍA Y ORTOPEDIA" }, { "codigo_especialidad": "1-0071", "especialidad": "OTORRINOLARINGOLOGÍA" }, { "codigo_especialidad": "1-0072", "especialidad": "PARASITOLOGÍA" }, { "codigo_especialidad": "1-0073", "especialidad": "PATOLOGÍA CLÍNICA " }, { "codigo_especialidad": "1-0074", "especialidad": "PATOLOGÍA ONCOLÓGICA" }, { "codigo_especialidad": "1-0075", "especialidad": "PATOLOGÍA Y LABORATORIO CLÍNICO" }, { "codigo_especialidad": "1-0076", "especialidad": "PEDIATRÍA" }, { "codigo_especialidad": "1-0077", "especialidad": "PROCTOLOGÍA" }, { "codigo_especialidad": "1-0078", "especialidad": "PSIQUIATRÍA" }, { "codigo_especialidad": "1-0079", "especialidad": "PSIQUIATRÍA INFANTIL" }, { "codigo_especialidad": "1-0080", "especialidad": "RADIODIAGNÓSTICO" }, { "codigo_especialidad": "1-0081", "especialidad": "RADIOLOGÍA" }, { "codigo_especialidad": "1-0082", "especialidad": "RADIOTERAPIA" }, { "codigo_especialidad": "1-0083", "especialidad": "REUMATOLOGÍA" }, { "codigo_especialidad": "1-0084", "especialidad": "SALUD PÚBLICA " }, { "codigo_especialidad": "1-0085", "especialidad": "UROLOGÍA" }, { "codigo_especialidad": "1-0086", "especialidad": "UROLOGÍA GENERAL Y ONCOLÓGICA" }, { "codigo_especialidad": "1-0087", "especialidad": "VENEREOLOGÍA" }, { "codigo_especialidad": "1-0089", "especialidad": "SISTEMAS HOSPITALARIOS" }, { "codigo_especialidad": "1-0091", "especialidad": "ODONTOLOGIA" }, { "codigo_especialidad": "99-092", "especialidad": "NO APLICA" }, { "codigo_especialidad": "99-093", "especialidad": "ACTUALIZAR" } ] }


            $(datos.data).each(function (i, obj) {
                $('#cboEspecialidadCR').append('<option value="' + obj.codigo_especialidad + '">' + obj.especialidad + '</option>');
                $('#cboEspecialidadRef').append('<option value="' + obj.codigo_especialidad + '">' + obj.especialidad + '</option>');
            });
            $('#cboEspecialidadCR').val(0);
            $('#cboEspecialidadRef').val(0);
            $('.chzn-select').chosen().trigger("chosen:updated");
            Cargando(0);
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
    },


    async ListarUPServiciosOrigen(codigoups) {

        var respuesta;
        let datos;

        var midata = new FormData();
        midata.append('codigoups', codigoups);
        $('#cboServicioOrigen').empty();
        $('#cboServicioOrigenCR').empty();

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Referencia/ListarUPServiciosRefCon?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.data.codigo = '0000') {
                //console.log(datos.lsUps.table);
                $(datos.data.datos).each(function (i, obj) {
                    $('#cboServicioOrigen').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
                    $('#cboServicioOrigenCR').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
                });
                $('#cboServicioOrigen').val(0);
                $('#cboServicioOrigenCR').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                //location.reload();
                alerta("ERROR", "Error al listar UPS!", "2");
            }
            Cargando(0);
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
    },

    async ListarUPServiciosDestino(codigoups) {
        Cargando(1);

        var respuesta;
        let datos;

        var midata = new FormData();
        midata.append('codigoups', codigoups);
        $('#cboServicioDestino').empty();
        $('#cboServicioDestinoCR').empty();

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Referencia/ListarUPServiciosRefCon?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            console.log(datos.data);
            if (datos.data.codigo = '0000') {
                //console.log(datos.lsUps.table);
                $(datos.data.datos).each(function (i, obj) {
                    $('#cboServicioDestino').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
                    $('#cboServicioDestinoCR').append('<option  value="' + obj.codUps + '">' + obj.descripcion + '</option>');
                });
                $('#cboServicioDestino').val(0);
                $('#cboServicioDestinoCR').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                //location.reload();
                alerta("ERROR", "Error al listar UPS!", "2");
            }
            Cargando(0);
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, error);
        }
    },

    
    async ListarCondicionUsuario() {
        $.ajax({
            url: "/Utilitario/CondicionUsuarioReferenciaSeleccionarTodos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {

                $('#cboCondicionUsuario').empty();
                if (datos.session) {
                    //console.log(datos.lsCondUsu.table);
                    $(datos.lsCondUsu.table).each(function (i, obj) {
                        $('#cboCondicionUsuario').append('<option  value="' + obj.idCondicion + '">' + obj.descripcion + '</option>');
                    });
                    $('#cboCondicionUsuario').val(0);

                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar UPS!", "2");
                }, 900)
            }
        });
    },

    ServiciosPorFiltro() {

        var midata = new FormData();
        midata.append('lcfiltro', ' AND Servicios.IdTipoServicio = 1');
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Referencia/ServiciosFiltrar?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {
                Cargando(0);
                $('#cboServicioOrigen').empty();
                $('#cboServicioDestino').empty();
                $(datos.lsFiltro.table).each(function (i, obj) {
                    $('#cboServicioOrigen').append('<option value="' + obj.idServicio + '">' + obj.nombre + '</option>');
                    $('#cboServicioDestino').append('<option value="' + obj.idServicio + '">' + obj.nombre + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },


    ListaServicios() {
        var midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencionRefCon').val());
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaProgramacionBtFecha?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {
                Cargando(0);
                $('#cboConsultorioRefCon').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboConsultorioRefCon').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" value="' + obj.valor + '">' + obj.nombreServicio + '</option>');


                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },



    ListarAtenciones() {

        Cargando(1)
        oTable_atencionesRefCon.fnClearTable();
        //alert($('#cboConsultorioRefCon>option:selected').attr("prog"));
        var midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencionRefCon').val());
        midata.append('idServicio', $('#cboConsultorioRefCon').val());
        midata.append('idTipoServicio', 1);
        midata.append('idTipoRef', $('#cboTipoRef').val());
        midata.append('prog', $('#cboConsultorioRefCon>option:selected').attr("prog"));
        $.ajax({
            method: "POST",
            url: "/Referencia/ListarAtencionesReferencia?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {

                    if (datos.lstAtenciones.table.length > 0) {
                        oTable_atencionesRefCon.fnAddData(datos.lstAtenciones.table);
                    }
                    else {
                        Cargando(0)
                    }
                }
                else {
                    Cargando(0);
                    location.reload();
                }


            },
            error: function (msg) {
                Cargando(0)
            }
        })


    },

    MigrarRefCon(idCuentaAtencion) {

        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        Cargando(1)
        $.ajax({
            method: "POST",
            url: "/Referencia/MigrarRefCon?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            async: true,
            success: function (res) {

                if (res.estado) {
                    alerta(res.tipo, res.msj)

                    $('#txtCodRespuestaRefCon').val(res.data.respuesta.codRespuesta)
                    $('#txtMensajeRespuestaRefCon').val(res.data.respuesta.mensajeRespuesta)

                    $('#txtIdReferenciaRespuestaRefCon').val(res.data.idReferencia)
                    $('#txtNroReferenciaRespuestaRefCon').val(res.data.nro_referencia)

                } else {
                    alerta(res.tipo, res.msj)
                    console.log(res)
                }


                Cargando(0)
            }
        });
    },

    MigrarContraRef(idCuentaAtencion) {

        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        Cargando(1)
        $.ajax({
            method: "POST",
            url: "/Referencia/MigrarContraRef?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            async: true,
            success: function (res) {

                if (res.estado) {
                    alerta(res.tipo, res.msj)

                    $('#txtCodRespuestaRefCon').val(res.data.respuesta.codRespuesta)
                    $('#txtMensajeRespuestaRefCon').val(res.data.respuesta.codRespuesta + ' ' + res.data.respuesta.mensajeRespuesta)

                    $('#txtIdReferenciaRespuestaRefCon').val(res.data.idReferencia)
                    $('#txtNroReferenciaRespuestaRefCon').val(res.data.nro_referencia)

                } else {
                    alerta(res.tipo, res.msj)
                    console.log(res)
                }


                Cargando(0)
            }
        });
    },

    EstadoReferencia(idReferencia) {
        var midata = new FormData();
        midata.append('idReferencia', idReferencia);
        Cargando(1)
        return $.ajax({
            method: "POST",
            url: "/Referencia/EstadoReferencia?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            async: true,
            success: function (res) {
                if (res.estado) {
                    return res
                } else {
                    return res
                }
                Cargando(0)
            }
        });
    },

    initDatables() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": true,
            "searching": true,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "fechaIngreso2",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
                ,
                {
                    width: '10%',
                    targets: 5,
                    data: "nombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
                ,
                {
                    width: '5%',
                    targets: 6,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: "planA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            if (rowData.tipoRef == 1) {
                                $(td).html("Referido");
                            } else {
                                if (rowData.tipoRef == 2) {
                                    $(td).html("Contrareferido");
                                }
                            }
                        }

                    }
                },
                {
                    width: '10%',
                    targets: 10,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {                        
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            $(td).html(btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                },
                {
                    width: '15%',
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        
                        if ((rowData.idReferencia > 0 || rowData.idContraReferencia > 0)) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            btnImprimeSinF = '<button class="ImprimeHojaRefConSinF btn btn-sm btn-warning glow_button" title="Visualiza Ref/Con" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            $(td).html(btnImprimeSinF);
                            //$(td).html(btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                    },

                },
                {
                    width: '15%',
                    targets: 12,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')

                        if (rowData.idReferenciaMigracion != '') {
                            let referencia = await Referencias.EstadoReferencia(rowData.idReferenciaMigracion)

                            console.log('referencia ' + rowData.idCuentaAtencion, referencia)

                            if (referencia.estado) {
                                if (referencia.data.referencia.estado == 'REGISTRADA') {
                                    $(td).parent().css('color', '#000000');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'OBSERVADA') {
                                    $(td).parent().css('color', '#ff8033');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'PENDIENTE') {
                                    $(td).parent().css('color', '#990033');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'ACEPTADA') {
                                    $(td).parent().css('color', '#3a0');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'PACIENTE CITADO') {
                                    $(td).parent().css('color', '#992b99');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'RECHAZADA') {
                                    $(td).parent().css('color', '#a3a3a3');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'RECIBIDO') {
                                    $(td).parent().css('color', '#0080ff');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'CONTRAREFERIDO') {
                                    $(td).parent().css('color', '#ffaa00');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                                if (referencia.data.referencia.estado == 'ANULADA') {
                                    $(td).parent().css('color', '#ff2b33');
                                    $(td).parent().css('font-weight', 'bold');
                                }
                            }


                        }


                        if (!isEmpty(rowData.fechaEgreso)) {
                            var btnReferencia = "";

                            if ($('#cboTipoRef').val() == 1) {
                                btnReferencia = '<button class="ModalMigracionRefcon btn btn-sm btn-indigo glow_button" title="Migrar a RefCon" data-toggle="tooltip" style="margin: 2px;"><i class="fa-regular fa-cloud-arrow-up"></i></button>';
                            } else if ($('#cboTipoRef').val() == 2) {
                                btnReferencia = '<button class="ModalMigracionContraref btn btn-sm btn-indigo glow_button" title="Migrar a RefCon" data-toggle="tooltip" style="margin: 2px;"><i class="fa-regular fa-cloud-arrow-up"></i></button>';
                            }

                            $(td).html(btnReferencia);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                }

            ]

        }

        var tableWrapper = $('#tblAtencionRefCon'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atencionesRefCon = $("#tblAtencionRefCon").dataTable(parms);


    }

}

var imprimiInformeAtencionSF = function (idCuentaAtencion, idProCabecera, tipoFormato) {
    var url = "/Atencion/AtencionPdfSinFirma?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idProCabecera=" + idProCabecera + "&tipoFormato=" + tipoFormato;

    $('#ifrmReporteRefCon').attr('src', url);

}

var ImprimirRefCon = function (rutaArchivoRefCon) {
    $('#ifrmReporteRefCon').attr('src', rutaArchivoRefCon);
    var myIframe = document.getElementById("ifrmReporteRefCon").contentWindow;
    myIframe.focus();
    myIframe.print();
    //console.log(myIframe);
}
var ImprimirRefConFirmado = function (idCuentaAtencion, idRegistro, code, idDoc, tipo) {
    //var objrow = oTable_atencionesRefCon.api(true).row('.selected').data();
    //var midata = new FormData();
    Cargando(1);
    var url = "/Referencia/statusAndDownload?area=Comun&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
    //$('#ifrmReporte').attr('src', url);

    var request = new XMLHttpRequest();
    request.responseType = "blob";
    request.open("GET", url);
    request.onload = function () {
        if (this.response.size > 0) {
            var url = window.URL.createObjectURL(this.response);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            //a.download = this.response.name || "CE-" + $.now()
            a.download = tipo + idCuentaAtencion + "-" + $.now()
            //a.click();

            AbrirVisorDocumento(url, 1);
            //ATENCIONES.ListaAtencionesCE();
            $("#btnBuscarAtenciones").click();
        } else {
            alerta(2, "El documento aún no está firmado digitalmente.")
        }
        Cargando(0);
    }
    request.send();
}


