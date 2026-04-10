var IdCuentaAtencionTemp = 0;
var AtencionConsejeria = {
    permisoRefCon: 0,
    estadoGuardadoRefCon: false,

    async Iniciar() {
        AtencionConsejeria.Plugins();
        await AtencionConsejeria.Inicializar();                
        await AtencionConsejeria.InitDataTableAtencionesConsejeria();
        await AtencionConsejeria.Eventos();
        const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();  
        if (!isEmpty(permisosGenerales)) {
            //AtencionConsejeria.permisoClasiPaciente = permisosGenerales.table.find(item => item.codigo === 'CLASI_PAC').valorInt;
            //permisoFirmaDigital = permisosGenerales.table.find(item => item.codigo === 'FIRMA_DIGITAL').valorInt;
            //AtencionConsejeria.permisoFua = permisosGenerales.table.find(item => item.codigo === 'FUA').valorInt;
            AtencionConsejeria.permisoRefCon = permisosGenerales.table.find(item => item.codigo === 'REFCON').valorInt;
        }

        $("#btnLlamarPaciente").hide();

        $("#divProximaConsulta").hide();
        $("#divReferencia").hide();
    },

    Plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();
                
        $('#txtFechaAtencionFiltro').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $('#txtFechaAtencionFiltro').mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");
    },

    async Inicializar() {
        let FechaHora = await Utilitario.FechaHoraServidor();
        $("#txtFechaAtencionFiltro").datepicker("setDate", FechaHora.substring(0, 10));
        //$("#txtHoraResultado").val(FechaHora.substring(11, 16));

        await AtencionConsejeria.CargarCombos();
    },

    async CargarCombos() {
        await AtencionConsejeria.ListarProgramacionMedica();
    },

    /*==============EVENTOS JQUERY===================================================================================================================================================================*/
    async Eventos() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            let tabId = $(e.target).attr('id');
            //console.log(tabId);
            if (tabId === 'TabBusqueda') {
                oTable_AtencionesConsejeria.resize();
            }

            if (tabId === 'TabRegistro') {
                if (Variables.TipoModulo == "psicoprofilaxis") {
                    oTable_DiagnosticosUltimoControl.resize();
                }                
            }
        });

        $("#txtFechaAtencionFiltro").on("change", async function (e) {
            if (esFormatoFecha($("#txtFechaAtencionFiltro").val())) {
                await AtencionConsejeria.ListarProgramacionMedica();
                $('#lblMedicoProgramado').html("");
            } 

            $("#btnLlamarPaciente").hide();
        });

        $("#cboConsultorioFiltro").on("change", async function (e) {
            await AtencionConsejeria.ListarAtencionesConsejeria();
            $('#lblMedicoProgramado').html("<b>MÉDICO: </b>" + $('#cboConsultorioFiltro>option:selected').attr("med"));

            let idEmpleadoSesion = await Utilitario.ObtenerIdUsuarioSesion();
            let idEmpleadoConsultorio = $('#cboConsultorioFiltro>option:selected').attr("idempleado");

            if (idEmpleadoSesion == idEmpleadoConsultorio) {
                $("#btnLlamarPaciente").show();
            }            
        });
                
        $('#btnBuscarAtenciones').on('click', async function () {
            await AtencionConsejeria.ListarAtencionesConsejeria();
        });

        $('#tblAtencionConsejeria tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_AtencionesConsejeria.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }            
        });

        $('#btnModificarAtencion').on('click', async function () {
            let objrowTb = oTable_AtencionesConsejeria.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro')
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
                return false
            }

            if (objrowTb.idEstadoAtencion == 0) {
                swal({
                    title: 'Atenciones',
                    text: "La cuenta del paciente se encuentra anulado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            if (objrowTb.idEstadoAtencion == 2) {
                swal({
                    title: 'Atenciones',
                    text: "La cuenta del paciente se encuentra cerrado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra cerrado.");
                return false;
            }

            if (objrowTb.generaPago == 1) {
                if (objrowTb.costoCeroCE != "S") {
                    if (objrowTb.idEstadoCita != 4 && objrowTb.idEstadoCita != 2) {
                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                        alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pagó.");
                        return false;
                    }
                }
            }

            Variables.Cargar(objrowTb);
            await AtencionConsejeria.CargarDatosAtencion(objrowTb);
            //////////////LLAMADO/////////////////////////////////////////////////////
            await Utilitario.GenerarAccionFlujoAtencionTerapias(objrowTb.idCita, 2);      //2: Atendiendo Paciente
            //////////////////////////////////////////////////////////////////////////
            AtencionConsejeria.DesbloquearRegistro();
        });

        $('#btnConsultarAtencion').on('click', async function () {
            let objrowTb = oTable_AtencionesConsejeria.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro')
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
                return false
            }

            if (objrowTb.idEstadoAtencion == 0) {
                swal({
                    title: 'Atenciones',
                    text: "La cuenta del paciente se encuentra anulado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            if (objrowTb.idEstadoAtencion == 2) {
                swal({
                    title: 'Atenciones',
                    text: "La cuenta del paciente se encuentra cerrado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra cerrado.");
                //return false;
            }

            if (objrowTb.generaPago == 1) {
                if (objrowTb.costoCeroCE != "S") {
                    if (objrowTb.idEstadoCita != 4 && objrowTb.idEstadoCita != 2) {
                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                        alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pagó.");
                        return false;
                    }
                }
            }

            if (objrowTb.idEstadoCita == 1) {
                alerta2("info", "", "El paciente aun no ha sido atendido, no existen datos que mostrar.");
                return false;
            }

            Variables.Cargar(objrowTb);
            await AtencionConsejeria.CargarDatosAtencion(objrowTb);
            AtencionConsejeria.BloquearRegistro();
        });

        $('#btnEliminarAtencion').on('click', async function () {
            let objrowTb = oTable_AtencionesConsejeria.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro')
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
                return false
            }

            if (objrowTb.idEstadoAtencion == 0) {
                swal({
                    title: 'Atenciones',
                    text: "La cuenta del paciente se encuentra anulado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            if (objrowTb.idEstadoAtencion == 2) {
                swal({
                    title: 'Atenciones',
                    text: "La cuenta del paciente se encuentra cerrado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra cerrado.");
                return false;
            }

            if (objrowTb.generaPago == 1) {
                if (objrowTb.costoCeroCE != "S") {
                    if (objrowTb.idEstadoCita != 4 && objrowTb.idEstadoCita != 2) {
                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                        alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pagó.");
                        return false;
                    }
                }
            }

            if (objrowTb.idEstadoCita == 1) {
                alerta2("info", "", "El paciente aun no ha sido atendido, no existen datos que eliminar.");
                return false;
            }

            swal({
                title: 'ELIMINAR',
                text: "¿Esta seguro de eliminar el registro de atención?" + '<br><table class="table table-bordered border mx-auto" style="width: 290px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Cuenta</th><th class="text-sm-center">' + objrowTb.idCuentaAtencion + '</th></tr></table>',
                type: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function () {
                if (objrowTb.tipoModulo = "psicoprofilaxis") {
                    let resp = await ConsejeriaPsicoprofilaxis.EliminarConsejeriaPsicoprofilaxis(objrowTb.idAtencion, objrowTb.idCita);
                    if (resp) {
                        await AtencionConsejeria.CerrarModuloAtencion();
                        MostrarAreaLista();
                        await AtencionConsejeria.ListarAtencionesConsejeria();
                    }
                }                
            }, function (dimiss) {

            });
        });

        $('#btnguardar').on('click', async function () {
            if (Variables.TipoModulo == "psicoprofilaxis") {
                let resp = await ConsejeriaPsicoprofilaxis.GuardarDatosPsicoprofilaxis();
                if (resp) {
                    await AtencionConsejeria.CerrarModuloAtencion();
                    MostrarAreaLista();
                    await AtencionConsejeria.ListarAtencionesConsejeria();
                }
            }
        });

        $('#btnCerrarAtencion').on('click', async function () {
            swal({
                title: 'CERRAR',
                text: "¿Esta seguro de cerrar el módulo de registro de atención?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            }).then(async function () {
                Cargando(1)
                await AtencionConsejeria.CerrarModuloAtencion();
                MostrarAreaLista();
                await AtencionConsejeria.ListarAtencionesConsejeria();
                Cargando(0)
            }, function (dimiss) {

            });

            
        });


        $("#HoraInicioAtencion").on("change", function (e) {
            let valor = $(this).val();
            if (!esFormatoHora(valor)) {
                alerta2("info", "", "La Hora Inicio de Atención no es valida.");
            }
        });

        ///////////////////////LLAMADO PACIENTE//////////////////////////////////
        $('#btnLlamarPaciente').on('click', async function () {
            let objrowTb = oTable_AtencionesConsejeria.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2("info", "Atenciones", "Seleccione un registro.");
                return false
            }

            if (objrowTb.idEstadoAtencion == 0) {
                alerta2("warning", "Atenciones", "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            if (objrowTb.idEstadoAtencion == 2) {
                alerta2("warning", "Atenciones", "La cuenta del paciente se encuentra cerrado.");
                return false;
            }

            if (objrowTb.generaPago == 1) {
                if (objrowTb.costoCeroCE != "S") {
                    if (objrowTb.idEstadoCita != 4 && objrowTb.idEstadoCita != 2) {
                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                        alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pagó.");
                        return false;
                    }
                }
            }

            if ($("#idMedicotxt").val() != objrowTb.idMedico) {
                alerta2("info", "Atenciones", "Usted no tiene permiso para llamar al paciente.");
                return false
            }

            $("#txtLlamadoCuenta").val(objrowTb.idCuentaAtencion);
            $("#txtLlamadoHistoria").val(objrowTb.nroHistoriaClinica);
            $("#txtLlamadoPaciente").val(objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno + ' ' + objrowTb.nombres);
            await Utilitario.GenerarAccionFlujoAtencionTerapias(objrowTb.idCita, 1);      //1: Llamar Paciente
            $("#modalLlamadoPaciente").modal("show");

        });

        $('#btnCancelarLlamadoPaciente').on('click', async function () {
            let objrowTb = oTable_AtencionesConsejeria.api(true).row('.selected').data();
            $("#txtLlamadoCuenta").val("");
            $("#txtLlamadoHistoria").val("");
            $("#txtLlamadoPaciente").val("");
            await Utilitario.GenerarAccionFlujoAtencionTerapias(objrowTb.idCita, 0);      //0: Cancelar llamado Paciente
            $("#modalLlamadoPaciente").modal("hide");
        });
        /////////////////////////////////////////////////////////////////////////


        /////////////////////VALIDA DESTINO DE ATENCION/////////////////////
        //$("#cboDestino").on('change', async function () {
        //    $("#divProximaConsulta").hide();
        //    $("#divReferencia").hide();

        //    if ($("#cboDestino").val() == 60) {
        //        $('#txtProximaConsulta').attr("disabled", false);
        //        //$("#cboTipoConsulta").removeAttr('disabled', 'disabled');
        //        $("#cboTipoConsulta").trigger("chosen:updated");

        //        ///////////////////PROXIMA CITA/////////////////////////////////////////////////////////
        //        if (Variables.IdEspecialidadIngreso >= 1 && Variables.IdEspecialidadIngreso <= 5) {
        //            if (Variables.IdCitaProxima > 0) {
        //                let citaProx = await AtencionConsejeria.CitaSeleccionarPorId(Variables.IdCitaProxima);
        //                if (isEmpty(citaProx) == false) {
        //                    $('#txtProximaConsulta').val(citaProx.fecha);
        //                    await AtencionConsejeria.ProximaConsulta_Change();
        //                    //$('#cboTipoConsulta').val(citaProx.idTipoConsulta);
        //                    $('#cboProgramacionProximaConsulta').val(citaProx.idProgramacion);
        //                    await AtencionConsejeria.ProgramacionCuposTotales();
        //                    $('#cboHoraProximaConsulta').val(citaProx.horaInicio);

        //                    $('#cboDestino').attr("disabled", true);
        //                    $('#txtProximaConsulta').attr("disabled", true);
        //                    $('#cboTipoConsulta').attr("disabled", true);
        //                    $('#cboProgramacionProximaConsulta').attr("disabled", true);
        //                    $('#cboHoraProximaConsulta').attr("disabled", true);

        //                    $('.chzn-select').chosen().trigger("chosen:updated");
        //                }
        //            }
        //        }
        //        ///////////////////////////////////////////////////////////////////////////////////////////

        //        $("#divProximaConsulta").show();
        //    } else {
        //        $('#txtProximaConsulta').val("");
        //        $('#cboTipoConsulta').val(1);

        //        $('#cboProgramacionProximaConsulta').empty();
        //        $('#cboProgramacionProximaConsulta').val("");
        //        $('#cboHoraProximaConsulta').empty();
        //        $('#cboHoraProximaConsulta').val("");

        //        $('#txtProximaConsulta').attr("disabled", true);
        //        $("#cboTipoConsulta").attr('disabled', 'disabled');
        //        $("#cboTipoConsulta").trigger("chosen:updated");

        //        $("#divProximaConsulta").hide();
        //    }

        //    //KHOYOSI (START)   (validamos que boton mostrar de acuerdo al destino que se seleccione)
        //    //const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
        //    if (AtencionConsejeria.permisoRefCon == '1') {
        //        if ($("#cboDestino").val() == 12 || $("#cboDestino").val() == 13) {
        //            AtencionConsejeria.estadoGuardadoRefCon = false;           //asigna que no aun no se ha guardado la hoja de refcon, a causa de que se ha seleccionado un nuevo destino
        //            if ($("#cboDestino").val() == 12) {
        //                $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " REFERENCIA")
        //            }
        //            if ($("#cboDestino").val() == 13) {
        //                $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " CONTRAREFERENCIA")
        //            }
        //            $("#divReferencia").show();
        //            $('#btnRefCon').show();
        //        } else {
        //            AtencionConsejeria.estadoGuardadoRefCon = true //asiga que se ha guardado la hoja de refcon, ya que el destino es diferente a las opciones de Referencia o Contrareferencia
        //            $("#divReferencia").hide();
        //            $('#btnRefCon').hide();
        //        }
        //    }
        //    //KHOYOSI (END)
        //});
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////EVENTOS - PROXIMA CITA//////////////////////////////////////////////////////////////////////////
        //$('#txtProximaConsulta').datepicker({
        //    todayHighlight: true,
        //    autoclose: true,
        //    orientation: "bottom"
        //}).on('show', async function () {
        //    //console.log("El calendario se ha desplegado.");
        //    await AtencionConsejeria.ListarFechasFuturasProgramacionMedica(Variables.IdEspecialidadIngreso, 0, FormatearFecha(Variables.FechaIngreso), '#a09afd');
        //    await AtencionConsejeria.ListarFechasFuturasProgramacionMedica(Variables.IdEspecialidadIngreso, Variables.IdMedico, FormatearFecha(Variables.FechaIngreso), '#03dda6');
        //});

        //$("#txtProximaConsulta").on('change', async function () {
        //    await AtencionConsejeria.ProximaConsulta_Change();
        //});

        //$("#cboProgramacionProximaConsulta").on('change', async function () {
        //    await AtencionConsejeria.ProgramacionProximaConsulta_Change();
        //});

        ////$('.btnImprimirTicketProximaCita').on('click', async function () {
        //$(document).on("click", ".btnImprimirTicketProximaCita", async function () {
        //    let objCupo = oTable_atenciones.api(true).row('.selected').data()

        //    if (isEmpty(objCupo) == false) {
        //        if (objCupo.idCitaProxima > 0) {
        //            let citaProx = await AtencionConsejeria.CitaSeleccionarPorId(objCupo.idCitaProxima);

        //            var url = "/Citas/ImprimeTicketCita?area=ConsultaExterna&idCita=" + citaProx.idCita + "&nroCupo=" + citaProx.turno
        //            //$('#ifrmTicketCita').attr('src', url)
        //            newIframe.src = url;

        //            //$('#btnCerrarModalCita').trigger("click")
        //            //$("#modalTicket").modal('show')
        //        }
        //    }

        //});
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        /////////////EVENTOS SEGUIMIENTO PACIENTES//////////////////////////////////////////////////////////
        $("#btnImprimeSeguimiento").on('click', function () {
            SeguimientoPaciente.limpiaDatos();
            var objrow = oTable_AtencionesConsejeria.api(true).row('.selected').data();
            //SeguimientoPaciente.llendaDatos(Variables.NroHistoriaClinica, 0)
            SeguimientoPaciente.llenaDatos(Variables.NroHistoriaClinica, 0);
            $("#modalSeguimiento").modal('show');
        })
        $("#btnCerrarSeguimiento").on('click', function () {
            $("#modalSeguimiento").modal('hide');
        })
        //jdelgado
        $("#btnImprimeSeguimientoCPN").on('click', function () {
            SeguimientoPacienteCPN.limpiaDatos();
            var objrow = oTable_AtencionesConsejeria.api(true).row('.selected').data()
            //console.log(objrow)
            SeguimientoPacienteCPN.llendaDatos(Variables.NroHistoriaClinica)
            $("#modalSeguimientoCPN").modal('show');
        })
        $("#btnCerrarSeguimientoCPN").on('click', function () {
            $("#modalSeguimientoCPN").modal('hide');
        })
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        

    },

    /*==============DATATABLES===================================================================================================================================================================*/

    InitDataTableAtencionesConsejeria() {

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '7%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 1,
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },                
                {
                    width: '18%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.apellidoPaterno + " " + rowData.apellidoMaterno + " " + rowData.nombres);
                    }
                },
                {
                    width: '22%',
                    targets: 3,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '7%',
                    targets: 4,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '9%',
                    targets: 5,
                    data: "telefono",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '12%',
                    targets: 6,
                    data: "planA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                    }

                },
                {
                    width: '9%',
                    targets: 8,
                    data: "horaInicioAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }

                },
                {
                    width: '9%',
                    targets: 7,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //KHOYOSI
                        if (rowData.estadoCita == "Separada") {
                            $(td).html('<span class="chip orange">' + rowData.estadoCita + '</span >');
                        }
                        if (rowData.estadoCita == "Atendido") {
                            $(td).html('<span class="chip success">' + rowData.estadoCita + '</span >');
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                        if (rowData.estadoCita == "Pagada") {
                            $(td).html('<span class="chip blue">' + rowData.estadoCita + '</span >');
                        }
                        if (rowData.estadoCita == "Vencida (No pagada)") {
                            $(td).html('<span class="chip secondary">' + rowData.estadoCita + '</span >');
                        }
                        //KHOYOSI
                    }
                },                
                //{
                //    width: '5%',
                //    targets: 8,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'center')
                //        //KHOYOSI
                //        //if (ValidarServicioCarnetPrenatal(rowData.idServicioIngreso)) {
                //        if (rowData.usaModuloMaterno) {
                //            $(td).html('<button class="btnCarnetPrenatal btn btn-sm btn-indigo glow_button" title="Visualiza Carnet Prenatal" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-address-card"></i> </button>');
                //        } else {
                //            $(td).html("");
                //        }
                //        //KHOYOSI
                //    }
                //},
                ////////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
                //{
                //    width: '7%',
                //    targets: 9,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        if (!isEmpty(rowData.fechaEgreso)) {
                //            var btnRuta = "";
                //            var btnImprime = "";
                //            var btnImprimeSinF = "";
                //            //var rutaBit4Id = "";

                //            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                //            if (rowData.code != '0') {
                //                if (rowData.statusFirma == 1) {
                //                    btnImprimeSinF = "";
                //                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //                } else {
                //                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                //                }
                //            }


                //            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                //        }
                //        else {
                //            $(td).html('');
                //        }


                //    }
                //},
                ////////////////////////////KHOYOSI (TICKET PROXIMA CITA)///////////////////////////////////////
                //{
                //    width: '5%',
                //    targets: 10,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'center')
                //        //KHOYOSI
                //        //if (ValidarServicioCarnetPrenatal(rowData.idServicioIngreso)) {
                //        if (rowData.idCitaProxima > 0) {
                //            $(td).html('<button class="btnImprimirTicketProximaCita btn btn-sm btn-teal glow_button" title="Visualiza Ticket Proxima Cita" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-calendar-heart"></i> </button>');
                //        } else {
                //            $(td).html("");
                //        }
                //        //KHOYOSI
                //    }
                //},
                ////////////////////////////KHOYOSI (RECETAS)///////////////////////////////////////
                //{
                //    width: '7%',
                //    targets: 11,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        if (!isEmpty(rowData.fechaEgreso)) {
                //            var btnRecetas = "";
                //            //var rutaBit4Id = "";

                //            if (rowData.tieneRecetas > 0) {
                //                btnRecetas = '<button class="btnImprimeRecetas btn btn-sm btn-cyan glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-note-medical"></i> </button>';
                //            }

                //            $(td).html(btnRecetas);
                //        }
                //        else {
                //            $(td).html('');
                //        }


                //    }
                //},
                
                ////////////////////////////KHOYOSI (REFCON)///////////////////////////////////////                
                //{
                //    width: '7%',
                //    targets: 12,
                //    data: null,
                //    createdCell: async function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        if (!isEmpty(rowData.fechaEgreso)) {

                //            var btnRuta = "";
                //            var btnImprime = "";
                //            var btnImprimeSinF = "";

                //            if (rowData.idReferencia > 0 || rowData.idContraReferencia > 0) {
                //                btnImprimeSinF = '<button class="ImprimeHojaRefConSF btn btn-sm btn-warning glow_button" title="Visualiza REFCON" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                //                const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                //                if (permisoRefcon == '1' && (rowData.codeRef != '0' || rowData.codeCRef != '0')) {
                //                    if (rowData.statusFirmaRef == 1 || rowData.statusFirmaCRef == 1) {
                //                        btnImprimeSinF = "";
                //                        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeHojaRefConCF" title="Imprime REFCON Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //                    } else {
                //                        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarHojaRefConSF" title="Firmar REFCON" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                //                    }
                //                }
                //            }

                //            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                //        }
                //        else {
                //            $(td).html('');
                //        }

                //    }
                //},
                //////////////////////////////////////////////////////////////////////

                /////////////////////////////FUA//////////////////////////////////
                //{
                //    width: '7%',
                //    targets: 13,
                //    data: null,
                //    createdCell: async function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        if (!isEmpty(rowData.fechaEgreso)) {

                //            var btnRuta = "";
                //            var btnImprime = "";
                //            var btnImprimeSinF = "";

                //            if (rowData.idCuentaFua > 0) {
                //                btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                //                //const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");
                //                if (AtencionConsejeria.permisoFua == '1' && rowData.codeFua != '0') {
                //                    if (rowData.statusFirmaFua == 1) {
                //                        btnImprimeSinF = "";
                //                        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeFuaCF" title="Imprime FUA Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //                    } else {
                //                        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarFuaSF" title="Firmar FUA" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                //                    }
                //                }
                //            }

                //            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                //        }
                //        else {
                //            $(td).html('');
                //        }

                //    }
                //}
                /////////////////////////////////////////////////////////////////////////////

            ]

        }

        var tableWrapper = $('#tblAtencionConsejeria'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_AtencionesConsejeria = $("#tblAtencionConsejeria").dataTable(parms);

    },

   
    /*==============CONSUMO APIS====================================================================================================================================================================*/

    async ListarProgramacionMedica() {
        let midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencionFiltro').val());

        try {
            Cargando(1);
            $("#cboConsultorioFiltro").empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AtencionConsejeria/ListarProgramacionMedica?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                $(datos.respuesta.table).each(function (i, obj) {
                    if (obj.activaProcedimiento == 2) {                       
                        $('#cboConsultorioFiltro').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" idEmpleado="' + obj.idEmpleado + '" idEspecialidad="' + obj.idEspecialidad + '"  value="' + obj.valor + '">' + obj.nombreServicio + '</option>');                        
                    }
                });
            } else {
                Utilitario.CargarModalInicioSesion();
            }

            $("#cboConsultorioFiltro").val("");
            $(".chzn-select").chosen().trigger("chosen:updated");

        } catch(error) {
            Cargando(0);
            alerta2("error", "ERROR", JSON.stringify(error));
        }        
    },

    async ListarAtencionesConsejeria() {
        //let respuesta;
        //let resp = false;
        let datos
        
        let idProgramacion = $('#cboConsultorioFiltro option:selected').attr('prog');
        if (isEmpty(idProgramacion)) {
            return;
        }

        let data = new FormData();
        data.append('idProgramacion', idProgramacion);

        try {
            Cargando(1);
            oTable_AtencionesConsejeria.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AtencionConsejeria/ListarAtencionesConsejeria?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    oTable_AtencionesConsejeria.fnAddData(datos.respuesta.table);
                    oTable_AtencionesConsejeria.resize();
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }            
        } catch (error) {
            Cargando(0);
            alerta2("error", "ERROR", JSON.stringify(error));
        }

        //return resp;
    },

    async CondicionEstablecimiento(idCuentaAtencion, idServicio) {
        var midata = new FormData();
        midata.append('idNroCuenta', idCuentaAtencion);
        midata.append('idServicio', idServicio);

        await $.ajax({
                method: "POST",
                url: "/Atencion/CondicionEstablecimiento?area=ConsultaExterna",
                //contentType: "application/json; charset=utf-8",
                data: midata,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
                success: function (datos) {

                    $(datos.table).each(function (i, obj) {
                        if (obj.categoria == "MGP") {
                            $('#txtCondicionEstablecimiento').val(obj.descripcion) //KHOYOSI
                            //$('#idEnEstablecimiento').val(obj.idTipoCondicionPaciente)
                        }

                        if (obj.categoria == "ServicioMGP") {
                            $('#txtCondicionServicio').val(obj.descripcion) //KHOYOSI
                            //$('#idEnServicio').val(obj.idTipoCondicionPaciente)
                        }
                    })

                },
                error: function (msg) {
                    setTimeout(function () {
                        alerta2("error", "", "Error listar condicion de establecimiento!")
                    }, 900)
                }
        });
    },

    //async ListarDestinosAtencion() {
    //    //let resp = false;
    //    let datos

    //    try {
    //        Cargando(1);            
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/AtencionConsejeria/ListarDestinosAtencion?area=ConsultaExterna",
    //                //contentType: "application/json; charset=utf-8",
    //                data: null,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });

    //        Cargando(0);
    //        if (datos.sesion) {
    //            if (datos.respuesta.table.length > 0) {
    //                $(datos.respuesta.table).each(function (i, obj) {
    //                    if (Variables.IdFuenteFinanciamiento != 3) {
    //                        if (obj.idDestinoAtencion != 12 && obj.idDestinoAtencion != 13) {
    //                            $('#cboDestino').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcionLarga + '</option>');
    //                        }
    //                    } else {
    //                        $('#cboDestino').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcionLarga + '</option>');
    //                    }
    //                });

    //                $("#cboDestino").val("");
    //                $(".chzn-select").chosen().trigger("chosen:updated");
    //            }
    //        } else {
    //            Utilitario.CargarModalInicioSesion();
    //        }
    //    } catch (error) {
    //        Cargando(0);
    //        alerta2("error", "ERROR", JSON.stringify(error));
    //    }

    //    //return resp;
    //},

    //////////////////////////////////////////PROXIMA CITA////////////////////////////////////////////////////////////////////////////////
    //async ProximaConsulta_Change() {
    //    let fecha = $("#txtProximaConsulta").val();

    //    $("#cboProgramacionProximaConsulta").empty();
    //    $("#cboHoraProximaConsulta").empty();
    //    $("#cboProgramacionProximaConsulta").val("");
    //    $("#cboHoraProximaConsulta").val("");

    //    if (isEmpty(fecha) == false) {
    //        if (esFormatoFecha(fecha) == true) {
    //            await AtencionConsejeria.ListarServiciosPorFechaEspecialidadMedico(Variables.IdEspecialidadIngreso, 0, fecha);
    //        }
    //    }

    //    $('.chzn-select').chosen().trigger("chosen:updated");
    //},

    //async ProgramacionProximaConsulta_Change() {
    //    let idProg = $("#cboProgramacionProximaConsulta").val();

    //    $("#cboHoraProximaConsulta").empty();
    //    $("#cboHoraProximaConsulta").val("");

    //    if (isEmpty(idProg) == false) {
    //        await AtencionConsejeria.ListarProgramacionMedicaCuposDisponibles(idProg);
    //    }

    //    $('.chzn-select').chosen().trigger("chosen:updated");
    //},

    //async ProgramacionProximaConsulta_Change() {
    //    let idProg = $("#cboProgramacionProximaConsulta").val();

    //    $("#cboHoraProximaConsulta").empty();
    //    $("#cboHoraProximaConsulta").val("");

    //    if (isEmpty(idProg) == false) {
    //        await AtencionConsejeria.ListarProgramacionMedicaCuposDisponibles(idProg);
    //    }

    //    $('.chzn-select').chosen().trigger("chosen:updated");
    //},

    //async ProgramacionCuposTotales() {
    //    let idProg = $("#cboProgramacionProximaConsulta").val();

    //    $("#cboHoraProximaConsulta").empty();
    //    $("#cboHoraProximaConsulta").val("");

    //    if (isEmpty(idProg) == false) {
    //        await AtencionConsejeria.ListarProgramacionMedicaCuposTotales(idProg);
    //    }

    //    $('.chzn-select').chosen().trigger("chosen:updated");
    //},

    //async CitaSeleccionarPorId(idCita) {
    //    let datos;
    //    let resp = null;
    //    let midata = new FormData();
    //    midata.append('idCita', idCita);

    //    try {
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Citas/CitaSeleccionarPorId?area=ConsultaExterna",
    //                data: midata,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0)
    //        if (datos.dataSet.table.length > 0) {
    //            resp = datos.dataSet.table[0];
    //        }
    //    } catch (error) {
    //        Cargando(0)
    //        //console.error(JSON.stringify(error))
    //        alerta(3, JSON.stringify(error));
    //    }

    //    return resp;
    //},

    //async ListarFechasFuturasProgramacionMedica(idEspecialidad, idMedico, fechaAtencion, codigoColor) {
    //    let datos;
    //    let midata = new FormData();
    //    midata.append('idEspecialidad', idEspecialidad);
    //    midata.append('idMedico', idMedico);
    //    midata.append('fechaAtencion', fechaAtencion);

    //    try {
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Citas/ListarFechasFuturasProgramacionMedica?area=ConsultaExterna",
    //                data: midata,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0)
    //        if (datos.dataSet.table.length > 0) {
    //            datos = datos.dataSet.table;
    //            $(datos).each(function (i, obj) {
    //                ResaltarFechaDatePicker(obj.fecha, codigoColor);
    //            });
    //        }
    //    } catch (error) {
    //        Cargando(0)
    //        //console.error(JSON.stringify(error))
    //        alerta(3, JSON.stringify(error));
    //    }

    //    return datos;
    //},

    //async ListarServiciosPorFechaEspecialidad(idEspecialidad, fecha) {
    //    let resp = null;
    //    let datos
    //    let data = new FormData();

    //    data.append('idTipoServicio', 1);
    //    data.append('idEspecialidad', idEspecialidad);
    //    data.append('activaProcedimiento', 0);
    //    data.append('fecha', fecha);

    //    try {
    //        $('#cboProgramacionProximaConsulta').empty();
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Citas/ListarServiciosPorFechaEspecialidad?area=ConsultaExterna",
    //                //contentType: "application/json; charset=utf-8",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);

    //        resp = datos.respuesta;
    //        $(resp.table).each(function (i, obj) {
    //            $('#cboProgramacionProximaConsulta').append('<option data-medico="' + obj.medico + '" value="' + obj.idProgramacion + '">' + obj.nombre + ' (' + obj.codigoTurno + ') ' + ' [' + obj.medico + ']' + '</option>');
    //        });
    //        $('#cboProgramacionProximaConsulta').val("");
    //        $('.chzn-select').chosen().trigger("chosen:updated");

    //    } catch (error) {
    //        Cargando(0);
    //        resp = null;
    //        alerta2("error", "", error);
    //    }

    //    return resp;
    //},

    //async ListarServiciosPorFechaEspecialidadMedico(idEspecialidad, idMedico, fecha) {
    //    let resp = null;
    //    let datos
    //    let data = new FormData();

    //    data.append('idTipoServicio', 1);
    //    data.append('idEspecialidad', idEspecialidad);
    //    data.append('idMedico', idMedico);
    //    data.append('activaProcedimiento', 0);
    //    data.append('fecha', fecha);

    //    try {
    //        $('#cboProgramacionProximaConsulta').empty();
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Citas/ListarServiciosPorFechaEspecialidadMedico?area=ConsultaExterna",
    //                //contentType: "application/json; charset=utf-8",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);

    //        resp = datos.respuesta;
    //        $(resp.table).each(function (i, obj) {
    //            $('#cboProgramacionProximaConsulta').append('<option data-medico="' + obj.medico + '" value="' + obj.idProgramacion + '">' + obj.nombre + ' (' + obj.codigoTurno + ') ' + ' [' + obj.medico + ']' + '</option>');
    //        });
    //        $('#cboProgramacionProximaConsulta').val("");
    //        $('.chzn-select').chosen().trigger("chosen:updated");

    //    } catch (error) {
    //        Cargando(0);
    //        resp = null;
    //        alerta2("error", "", error);
    //    }

    //    return resp;
    //},

    //async ListarProgramacionMedicaCuposDisponibles(idProgramacion) {
    //    let resp = null;
    //    let datos
    //    let cantidadCupos = 0;
    //    let cantidadContinuadores = 0;
    //    let limiteNuevos = 4;     //LIMITE DE PACIENTES NUEVOS POR PROGRAMACION
    //    let limiteContinuadores = 0;
    //    let data = new FormData();

    //    data.append('idProgramacion', idProgramacion);

    //    try {
    //        $('#cboHoraProximaConsulta').empty();
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Citas/ListarProgramacionMedicaCuposTotales?area=ConsultaExterna",
    //                //contentType: "application/json; charset=utf-8",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);

    //        resp = datos.respuesta;
    //        cantidadCupos = resp.table.length;
    //        limiteContinuadores = cantidadCupos - limiteNuevos;

    //        $(resp.table).each(function (i, obj) {
    //            if (obj.tipoPaciente == 'CONTINUADOR') {
    //                cantidadContinuadores++;
    //            }

    //            if (obj.idPaciente == 0) {
    //                $('#cboHoraProximaConsulta').append('<option data-horaInicio="' + obj.horaInicio + '" data-horaFin="' + obj.horaFin + '" value="' + obj.horaInicio + '">' + obj.cupoDisponible + '</option>');
    //            }
    //        });

    //        if (cantidadContinuadores == limiteContinuadores) {
    //            $('#cboHoraProximaConsulta').empty();
    //            alerta(4, 'Ya no existen cupos disponibles.');
    //        }

    //        $('#cboHoraProximaConsulta').val("");
    //        $('.chzn-select').chosen().trigger("chosen:updated");

    //    } catch (error) {
    //        Cargando(0);
    //        resp = null;
    //        alerta2("error", "", error);
    //    }

    //    return resp;
    //},

    //async ListarProgramacionMedicaCuposTotales(idProgramacion) {
    //    let resp = null;
    //    let datos
    //    let data = new FormData();

    //    data.append('idProgramacion', idProgramacion);

    //    try {
    //        $('#cboHoraProximaConsulta').empty();
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Citas/ListarProgramacionMedicaCuposTotales?area=ConsultaExterna",
    //                //contentType: "application/json; charset=utf-8",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);

    //        resp = datos.respuesta;
    //        $(resp.table).each(function (i, obj) {
    //            $('#cboHoraProximaConsulta').append('<option data-horaInicio="' + obj.horaInicio + '" data-horaFin="' + obj.horaFin + '" value="' + obj.horaInicio + '">' + obj.cupoDisponible + '</option>');
    //        });
    //        $('#cboHoraProximaConsulta').val("");
    //        $('.chzn-select').chosen().trigger("chosen:updated");

    //    } catch (error) {
    //        Cargando(0);
    //        resp = null;
    //        alerta2("error", "", error);
    //    }

    //    return resp;
    //},

    //async GuardarProximaCita(idAtencionOrigen, idCita, idPaciente, idProgramacion, horaInicioAtencion, idTipoConsulta, idSiaSis, sisCodigo) {
    //    let formData = new FormData();
    //    let datos;
    //    let resp = false;
    //    let result = null;

    //    formData.append('IdAtencionOrigen', idAtencionOrigen);
    //    formData.append('IdCita', idCita);
    //    formData.append('IdPaciente', idPaciente);
    //    formData.append('IdProgramacion', idProgramacion);
    //    formData.append('HoraInicioAtencion', horaInicioAtencion);
    //    formData.append('IdTipoConsulta', idTipoConsulta);
    //    formData.append('IdSiaSis', idSiaSis);
    //    formData.append('SisCodigo', sisCodigo);

    //    try {
    //        Cargando(1);
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Citas/GuardarProximaCita?area=ConsultaExterna",
    //                data: formData,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);
    //        if (datos.respuesta.table.length > 0) {
    //            datos = datos.respuesta.table[0];
    //            if (datos.errorNumber == 0) {
    //                alerta(1, datos.successMessage);
    //                //alerta2("success", "", datos.successMessage);
    //                return true;
    //            } else {
    //                alerta(3, datos.errorMessage);
    //                //alerta2("error", "", datos.errorMessage);
    //                return false;
    //            }
    //        }
    //        else {
    //            alerta2('error', '', 'Hubo un error al guardar la cita.');
    //        }
    //    } catch (error) {
    //        console.error(JSON.stringify(error))
    //        Cargando(0);
    //        alerta2("error", "", JSON.stringify(error));
    //    }

    //    return resp;
    //},

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    
    /*==============METODOS==========================================================================================================================================================================================*/
    async CargarDatosAtencion(datos) {
        IdCuentaAtencionTemp = datos.idCuentaAtencion;
        //$('#idPaciente').val(datos.idPaciente);
        //$('#idAtencion').val(datos.idAtencion);
        //$('#idDestinoAtencion').val(datos.idDestinoAtencion);

        $('#txtDatos').html('N°. HC: ' + datos.nroHistoriaClinica + ' / N°. Cuenta: ' + datos.idCuentaAtencion + ' / Paciente: ' + datos.apellidoPaterno + ' ' + datos.apellidoMaterno + ' ' + datos.nombres + " / Edad: " + datos.edadPaciente)
        $('#txtDatoCuenta').val(datos.idCuentaAtencion);
        $('#txtDatoPaciente').val(datos.apellidoPaterno + ' ' + datos.apellidoMaterno + ' ' + datos.nombres);
        $('#txtDatoHistoria').val(datos.nroHistoriaClinica);
        $('#txtDatoEdad').val(datos.edadPaciente);
        $('#txtHoraCita').val(datos.horaInicio);
        $('#HoraInicioAtencion').val(datos.horaInicioAtencion);
        $('#txtDistritoDomicilio').val(datos.distritoDomicilio);
        $('#txtDireccionDomicilio').val(datos.direccionDomicilio);
        await AtencionConsejeria.CondicionEstablecimiento(Variables.IdCuentaAtencion, Variables.IdServicioIngreso);
        let FechaHora = await Utilitario.FechaHoraServidor();        
        $("#HoraInicioAtencion").val(FechaHora.substring(11, 16));

        let respTipoModulo = await Utilitario.CargarModuloAtencion(datos.tipoModulo);
        if (respTipoModulo) {
            if (datos.tipoModulo == "psicoprofilaxis") {
                await ConsejeriaPsicoprofilaxis.Iniciar();
                await ConsejeriaPsicoprofilaxis.CargarDatosPsicoprofilaxis();
            }

            MostrarAreaRegistro();
            $("#atencion-tab").click();
        }

    },

    LimpiarRegistro() {
        $("#modulo").html("");
        $(".writing").val("");
        $(".reading").val("");
        $('.chzn-select').chosen().trigger("chosen:updated");
        IdCuentaAtencionTemp = 0;
        Variables.Limpiar();
    },

    BloquearRegistro() {
        $(".writing").attr("disabled", true);
        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#btnguardar").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#btnguardar").show();
    },

    async CerrarModuloAtencion() {        
        //////////////LLAMADO/////////////////////////////////////////////////////
        await Utilitario.GenerarAccionFlujoAtencionTerapias(Variables.IdCita, 0);      //0: ESPERANDO
        //////////////////////////////////////////////////////////////////////////
        AtencionConsejeria.LimpiarRegistro();        
    },

}


$(document).ready(() => {
    AtencionConsejeria.Iniciar()

})