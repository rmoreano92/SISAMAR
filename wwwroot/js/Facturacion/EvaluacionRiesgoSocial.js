IdCuentaAtencionTemp = 0

var RiesgoSocial = {
    NroEvaluacion: 0,
    IdCuentaAtencion: 0,
    IdPaciente: 0,
    IdTrabajadoraSocial: 0,
    //IdOrden: 0,
    //IdProducto: 0,
    //idCuentaAtencion: 0,
    //IdAtencion: 0,

    //IdRiesgoSocialMacroscopica: 0,
    //IdRiesgoSocialMicroscopica: 0,
    //registro: null,

    Iniciar() {



        RiesgoSocial.DataTableBusqueda();
        RiesgoSocial.DataTableEvaluacionesPaciente();
        RiesgoSocial.InitDatablesAtenciones()
        RiesgoSocial.DataTableListaPacientesBusqueda()
        RiesgoSocial.DataTableListaCuentasPacientesBusqueda()
        RiesgoSocial.Plugins();
        //RiesgoSocial.LLenarCombos();
        RiesgoSocial.Eventos();

        //$("#txtPreTotalMovilidad").attr("disabled", true);
    },

    Plugins() {
        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $("#txtFechaBusq").datepicker("setDate", FechaDia);

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $(".maskFecha").mask("Dd/Mm/abcd");


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });

        $(".chosen-select").chosen();
    },

    Eventos() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            let tabId = $(e.target).attr('id');
            //console.log(tabId);
            if (tabId === 'TabBusqueda') {
                oTable_RiesgoSocial.resize();
            }
        });

        $('.tabListEvaluacion a').on('click', function (e) {
            let tabhref = $(e.target).attr('href');
            $(".submenu a").removeClass("active");
            //$(e.target).addClass("active");

            $('.nav-tabs a[href="' + tabhref + '"]').tab('show');
        });

        $('.tabListEvaluacion .collapse').on('show.bs.collapse', function () {
            $('.tabListEvaluacion .collapse').not(this).collapse('hide'); // Cierra todos los demás
        });

        $('#modalEvaluacionesRiesgoSocial').on('shown.bs.modal', function () {
            oTable_RiesgoSocialPaciente.resize();
        });

        $('.rdbPuntajeEvaluacion').on('click', async function (e) {
            if ($(this).data('checked')) {
                $(this).prop('checked', false).data('checked', false);
            } else {
                $('input[type="radio"]').data('checked', false); // Resetea otros radios
                $(this).data('checked', true);
            }

            await RiesgoSocial.TotalizarPuntaje();
        });

        $("#btnImprimeSeguimiento").on('click', function () {
            SeguimientoPaciente.limpiaDatos();
            var objrow = oTable_atenciones.api(true).row('.selected').data();
            //SeguimientoPaciente.llendaDatos(Variables.NroHistoriaClinica, 0)
            SeguimientoPaciente.llenaDatos(Variables.NroHistoriaClinica, 0);
            $("#modalSeguimiento").modal('show');
        })

        // $('#cboDiagnosticoRs_chosen .chosen-drop .chosen-search input').on('input', async function () {
        //     let filtro = $(this).val();
        //     await RiesgoSocial.ListaDiagnosticosPorFiltro(filtro);
        // });

        $('#cboDiagnosticoRs_chosen').on('keyup', '.search-field input', async function (e) {
            let filtro = $(this).val();

            if (e.keyCode === 38 || e.keyCode === 40) {
                return
            }

            if (filtro.length >= 3) {
                await RiesgoSocial.ListaDiagnosticosPorFiltroV2(filtro);

                // Después de actualizar Chosen, volver a poner el texto en el input
                $('#cboDiagnosticoRs_chosen .search-field input').val(filtro).focus();
            }
        });
        //$('.rdbPuntajeEvaluacion').on('change', function () {

        //});

        $('#btnBuscar').on('click', async function () {
            await RiesgoSocial.ListarEvaluacionRiesgoSocial();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', async function () {
            await RiesgoSocial.LimpiarCamposBusqueda();
        });

        $('#tblEvaluacionRiesgoSocial tbody').on('click', 'tr', function () {
            //if ($(this).hasClass('selected')) {
            //    $(this).removeClass('selected');
            //}
            //else {
            //    oTable_RiesgoSocial.$('tr.selected').removeClass('selected');
            //    $(this).addClass('selected');
            //}
            $(this).removeClass('selected');
            oTable_RiesgoSocial.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#txtNroCuentaPaciente').keypress(async function (e) {
            let idCuenta = $('#txtNroCuentaPaciente').val().trim();
            if (e.which == 13) {
                e.preventDefault();

                await RiesgoSocial.LimpiarCamposRegistro()

                $('#txtNroCuentaPaciente').val(idCuenta)
                $('#txtNroCuentaPaciente').blur();


                await RiesgoSocial.BuscarCuentaPaciente($('#txtNroCuentaPaciente').val());

            }
        });

        $('.busquedaPaciente').keypress(async function (e) {
            if (e.which == 13) {
                if ($('#txtDniPacienteBusqueda').val() == '' && $('#txtNroHistoriaPacienteBusqueda').val() == '' && $('#txtApPaternoPacienteBusqueda').val() == ''
                    && $('#txtApMaternoPacienteBusqueda').val() == '' && $('#txtPrimerNombrePacienteBusqueda').val() == '') {
                    alerta(2, 'Debe ingresar al menos un campo para la busqueda.')
                    return
                }

                try {
                    Cargando(1)

                    let pacientes = await RiesgoSocial.PacientesFiltrarTodosSoloHistorias()

                    oTable_TableListaPacientesBusqueda.fnClearTable();
                    if (pacientes && pacientes.length > 0) {
                        oTable_TableListaPacientesBusqueda.fnAddData(pacientes);
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    Cargando(0)
                }

            }
        });

        $('#btnAgregar').on('click', async function () {
            await RiesgoSocial.LimpiarCamposRegistro();
            $("#txtNroCuentaPaciente").removeAttr("disabled");
            let FechaHora = await Utilitario.FechaHoraServidor();
            $("#txtFechaEvaluacionRs").datepicker("setDate", FechaHora.substring(0, 10));
            //RiesgoSocial.DeshabilitarRegistro();
            $("#btnHistorialEvaluacionesRS").show();

            $('#cboTrabajadoraSocialRs').val($('#hdIdUsuario').val())
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            MostrarAreaRegistro();
        });

        $('#btnModificar').on('click', async function () {
            let objrowTb = oTable_RiesgoSocial.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            // if (objrowTb.idEstadoAtencion != 1) {
            //     alerta2("info", "", "El estado de la cuenta NO se ecuentra ABIERTA.");
            //     return false;
            // }

            if (objrowTb.estado != 1) {
                alerta2("info", "", "La evaluación se encuentra ANULADA.");
                return false;
            }

            RiesgoSocial.LimpiarCamposRegistro();
            await RiesgoSocial.BuscarCuentaPaciente(objrowTb.idCuentaAtencion);
            Variables.Cargar(objrowTb)
            const resp = await RiesgoSocial.SeleccionarEvaluacionRiesgoSocial(objrowTb);
            if (resp) {

                if (RiesgoSocial.IdTrabajadoraSocial != 0 && RiesgoSocial.IdTrabajadoraSocial != $('#hdIdUsuario').val()) {
                    
                    alerta2("info", "", "<b>La evaluación pertenece a otro usuario</b> <br> Si desea registrar un nuevo seguimiento, debe crear una nueva evaluación para este paciente.");
                    RiesgoSocial.BloquearRegistro();
                    $("#btnHistorialEvaluacionesRS").hide();
                    MostrarAreaRegistro();
                } else {
                    RiesgoSocial.DesbloquearRegistro();
                    $("#btnHistorialEvaluacionesRS").hide();
                    MostrarAreaRegistro();
                }
            }
        });

        $('#btnConsultar').on('click', async function () {
            let objrowTb = oTable_RiesgoSocial.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            if (objrowTb.idEstadoAtencion != 1) {
                alerta2("info", "", "El estado de la cuenta NO se ecuentra ABIERTA.");
            }

            if (objrowTb.estado != 1) {
                alerta2("info", "", "La evaluación se encuentra ANULADA.");
            }

            RiesgoSocial.LimpiarCamposRegistro();
            await RiesgoSocial.BuscarCuentaPaciente(objrowTb.idCuentaAtencion);
            const resp = await RiesgoSocial.SeleccionarEvaluacionRiesgoSocial(objrowTb);
            if (resp) {
                RiesgoSocial.BloquearRegistro();
                $("#btnHistorialEvaluacionesRS").hide();
                MostrarAreaRegistro();
            }
        });

        $('#btnEliminar').on('click', async function () {
            let objrowTb = oTable_RiesgoSocial.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            if (objrowTb.idEstadoAtencion != 1) {
                alerta2("info", "", "La estado de la cuenta NO se ecuentra ABIERTA.");
                return false;
            }

            if (objrowTb.estado != 1) {
                alerta2("info", "", "La evaluación se encuentra ANULADA.");
                return false;
            }

            swal({
                title: 'ELIMINAR',
                html: "¿Esta seguro de eliminar el registro de evaluación?" + '<br><table class="table table-bordered border mx-auto" style="width: 290px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Evaluación</th><th class="text-sm-center">' + objrowTb.nroEvaluacion + '</th></tr></table>',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    const resp = await RiesgoSocial.EliminarEvaluacionRiesgoSocial(objrowTb.nroEvaluacion);
                    if (resp) {
                        RiesgoSocial.ListarEvaluacionRiesgoSocial();
                    }
                }
            }, function (dimiss) {

            });

        });

        $('#btnHistorialEvaluacionesRS').on('click', async function () {
            await RiesgoSocial.ListarEvaluacionRiesgoSocialPorPaciente();
            $("#modalEvaluacionesRiesgoSocial").modal("show");
        });

        $('#tblEvaluacionesRSPaciente tbody').on('click', 'tr', function () {
            //if ($(this).hasClass('selected')) {
            //    $(this).removeClass('selected');
            //}
            //else {
            //    oTable_RiesgoSocialPaciente.$('tr.selected').removeClass('selected');
            //    $(this).addClass('selected');
            //}
            $(this).removeClass('selected');
            oTable_RiesgoSocialPaciente.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#btnAceptarEvaluacionesRS').on('click', async function () {
            let objrowTb = oTable_RiesgoSocialPaciente.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            //RiesgoSocial.LimpiarCamposRegistro();
            const resp = await RiesgoSocial.SeleccionarEvaluacionAnteriorRiesgoSocial(objrowTb);
            if (resp) {
                oTable_RiesgoSocialPaciente.fnClearTable();
                $("#modalEvaluacionesRiesgoSocial").modal("hide");
            }

        });

        $('#btnCerrarEvaluacionesRS').on('click', function () {
            oTable_RiesgoSocialPaciente.fnClearTable();
            $("#modalEvaluacionesRiesgoSocial").modal("hide");
        });

        $("#btnGuardarEvaluacionRiesgoSocial").on("click", function () {
            if (isEmpty($("#cboTrabajadoraSocialRs").val())) {
                alerta2("info", "", "Por favor seleccione una Trabajadora Social.");
                return;
            }

            if (isEmpty($("#cboTurnoLaboradoRs").val())) {
                alerta2("info", "", "Por favor debe seleccionar el turno.");
                return;
            }

            if (isEmpty($("#cboDiagnosticoRs").val())) {
                alerta2("info", "", "Por favor seleccione un diagnóstico.");
                return;
            }

            if (isEmpty($("#txtObservacionRs").val())) {
                alerta2("info", "", "Por favor ingrese los comentarios.");
                return;
            }

            swal({
                title: 'Guardar',
                html: "¿Esta seguro de guardar el registro?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    const resp = await RiesgoSocial.GuardarEvaluacionRiesgoSocial();
                    if (resp) {
                        RiesgoSocial.ListarEvaluacionRiesgoSocial();
                        alerta2("success", "", "El registro se guardó correctamente.");
                        MostrarAreaLista();
                    }
                }
            }, function (dimiss) {

            });

        });

        $("#btnCancelarEvaluacionRiesgoSocial").on("click", async function () {
            swal({
                title: 'Salir',
                html: "¿Esta seguro de salir?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(function (result) {
                if (result.isConfirmed) {
                    RiesgoSocial.LimpiarCamposRegistro();
                    RiesgoSocial.ListarEvaluacionRiesgoSocial();
                    MostrarAreaLista();
                }
            }, function (dimiss) {

            });
        });

        /////////////////////////////FIRMA DIGITAL INFORME EVALUACION//////////////////////////////////////
        $('#tblEvaluacionRiesgoSocial tbody').on('click', '.ImprimirInformeSF', async function () {
            var objrow = oTable_RiesgoSocial.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RiesgoSocial.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro por favor.');
            } else {
                if (isEmpty(row.code)) {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.');

                    const pdf = await Utilitario.GenerarHojaEvaluacionRiesgoSocial(row.idCuentaAtencion, row.nroEvaluacion);

                    if (pdf == true) {
                        await RiesgoSocial.ListarEvaluacionRiesgoSocial();
                        alerta('1', 'Se generó el documento correctamente.');
                    } else {
                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la evaluación nuevamente.');
                    }
                } else {
                    const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }
            }
            Cargando(0);
        });

        $('#tblEvaluacionRiesgoSocial tbody').on('click', '.ImprimirInformeCF', async function () {
            var objrow = oTable_RiesgoSocial.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RiesgoSocial.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
            }
            Cargando(0);
        });

        $('#tblEvaluacionRiesgoSocial tbody').on('click', '.FirmarInformeSF', async function () {
            var objrow = oTable_RiesgoSocial.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RiesgoSocial.fnGetData(objrow);

            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'INF-RS';
                Cargando(1);
                const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI            
                if (firma) {
                    if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
                    if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }
                    //await Utilitario.IniciarServicioFirmaBit4Id(row.code);
                }
                Cargando(0);
            }
            Cargando(0);
        });

        $('#btnFirmaLote').on('click', async function () {
            let listOrdenes = oTable_RiesgoSocial.api(true).data();
            let numOrdenes = [];

            Cargando(1)
            $(listOrdenes).each(async (i, obj) => {
                if (obj.estado == 1 && obj.code != '') {
                    numOrdenes.push(obj.nroEvaluacion);
                }
            })

            Utilitario.TipoArchivoFirmar = 'INF-RS';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos('', numOrdenes, "'INF-RS'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data)
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'INF-RS'", numOrdenes);
            }

            Cargando(0)
        });


        $('#tblEvaluacionesRSPaciente tbody').on('click', '.ImprimirInformePacienteSF', async function () {
            var objrow = oTable_RiesgoSocialPaciente.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RiesgoSocialPaciente.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro por favor.');
            } else {
                if (isEmpty(row.code)) {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.');

                    const pdf = await Utilitario.GenerarHojaEvaluacionRiesgoSocial(row.idCuentaAtencion, row.idEvaluacion);

                    if (pdf == true) {
                        await RiesgoSocial.ListarEvaluacionRiesgoSocialPorPaciente();
                        alerta('1', 'Se generó el documento correctamente.');
                    } else {
                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la evaluación nuevamente.');
                    }
                } else {
                    const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }
            }
            Cargando(0);
        });

        $('#tblEvaluacionesRSPaciente tbody').on('click', '.ImprimirInformePacienteCF', async function () {
            var objrow = oTable_RiesgoSocialPaciente.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RiesgoSocialPaciente.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
            }
            Cargando(0);
        });

        $('#btnNroCuentaBusq').on('click', async () => {
            $('#txtDniPacienteBusqueda').val('')
            $('#txtNroHistoriaPacienteBusqueda').val('')
            $('#txtApPaternoPacienteBusqueda').val('')
            $('#txtApMaternoPacienteBusqueda').val('')
            $('#txtPrimerNombrePacienteBusqueda').val('')
            $('#modalBusquedaPacientes').modal('show')

            oTable_TableListaPacientesBusqueda.fnClearTable();
        })
        $('#btnCerrarModalListaPacientes').on('click', async () => {

            $('#modalBusquedaPacientes').modal('hide')
        })

        $('#btnBuscarPacientes').on('click', async () => {
            if ($('#txtDniPacienteBusqueda').val() == '' && $('#txtNroHistoriaPacienteBusqueda').val() == '' && $('#txtApPaternoPacienteBusqueda').val() == ''
                && $('#txtApMaternoPacienteBusqueda').val() == '' && $('#txtPrimerNombrePacienteBusqueda').val() == '') {
                alerta(2, 'Debe ingresar al menos un campo para la busqueda.')
                return
            }

            try {
                Cargando(1)

                let pacientes = await RiesgoSocial.PacientesFiltrarTodosSoloHistorias()

                oTable_TableListaPacientesBusqueda.fnClearTable();
                if (pacientes && pacientes.length > 0) {
                    oTable_TableListaPacientesBusqueda.fnAddData(pacientes);
                }
            } catch (e) {
                console.error(e)
            } finally {
                Cargando(0)
            }
        })
        $('#btnCerrarModalListaCuentasPaciente').on('click', async () => {

            $('#modalBusquedaCuentasPaciente').modal('hide')
        })
        $('#btnLimpiarBusquedaPacientes').on('click', async () => {
            $('#txtDniPacienteBusqueda').val('')
            $('#txtNroHistoriaPacienteBusqueda').val('')
            $('#txtApPaternoPacienteBusqueda').val('')
            $('#txtApMaternoPacienteBusqueda').val('')
            $('#txtPrimerNombrePacienteBusqueda').val('')
            oTable_TableListaPacientesBusqueda.fnClearTable();

        })

        $('#tblListaPacientesBusqueda').on('dblclick', 'tr', async (e) => {

            let trElement = e.currentTarget

            oTable_TableListaPacientesBusqueda.$('tr.selected').removeClass('selected')
            $(trElement).addClass('selected')

            let rowData = oTable_TableListaPacientesBusqueda.api(true).row('.selected').data()
            if (!rowData) return;

            IdPaciente = rowData.idPaciente;

            await RiesgoSocial.ListarAtencionesPorPaciente(rowData.idPaciente)

            $('#modalBusquedaCuentasPaciente').modal('show')

        })

        $('#tblListaCuentasPacientesBusqueda').on('dblclick', 'tr', async (e) => {
            let trElement = e.currentTarget

            oTable_TableListaCuentasPacientesBusqueda.$('tr.selected').removeClass('selected')
            $(trElement).addClass('selected')

            let rowData = oTable_TableListaCuentasPacientesBusqueda.api(true).row('.selected').data()


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (isEmpty(rowData)) {
                alerta(2, 'Ingrese un registro valido')
                return false
            }

            await RiesgoSocial.LimpiarCamposRegistro()

            $('.modal').modal('hide')

            $('#txtNroCuentaPaciente').val(rowData.idCuentaAtencion)

            await RiesgoSocial.BuscarCuentaPaciente($('#txtNroCuentaPaciente').val());
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        })

    },
    InitDatablesAtenciones: () => {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
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
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '10%',
                //    targets: 2,
                //    data: "apellidoPaterno",
                //    visible: false,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    width: '10%',
                //    targets: 3,
                //    data: "apellidoMaterno",
                //    visible: false,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    width: '10%',
                //    targets: 4,
                //    data: "nombres",
                //    visible: false,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')                        
                //    }
                //},
                {
                    width: '15%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.apellidoPaterno + " " + rowData.apellidoMaterno + " " + rowData.nombres);
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "telefono",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 5,
                    data: "planA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                },
                {
                    width: '7%',
                    targets: 6,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //KHOYOSI
                        if (rowData.estadoCita == "Separada") {
                            $(td).html('<span class="chip orange">' + rowData.estadoCita + '</span >');
                        }
                        if (rowData.estadoCita == "Atendido") {
                            $(td).html('<span class="chip success">' + rowData.estadoCita + '</span >');
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
                {
                    width: '5%',
                    targets: 7,
                    data: "horaInicioAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                },
                {
                    width: '5%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        //KHOYOSI
                        //if (ValidarServicioCarnetPrenatal(rowData.idServicioIngreso)) {
                        if (rowData.usaModuloMaterno) {
                            $(td).html('<button class="btnCarnetPrenatal btn btn-sm btn-indigo glow_button" title="Visualiza Carnet Prenatal" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-address-card"></i> </button>');
                        } else {
                            $(td).html("");
                        }
                        //KHOYOSI
                    }
                },
                //////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
                {
                    width: '7%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            //var rutaBit4Id = "";

                            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.code != '0') {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            }


                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }


                    }
                },
                //////////////////////////KHOYOSI (TICKET PROXIMA CITA)///////////////////////////////////////
                {
                    width: '5%',
                    targets: 10,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        //KHOYOSI
                        //if (ValidarServicioCarnetPrenatal(rowData.idServicioIngreso)) {
                        if (rowData.idCitaProxima > 0) {
                            $(td).html('<button class="btnImprimirTicketProximaCita btn btn-sm btn-teal glow_button" title="Visualiza Ticket Proxima Cita" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-calendar-heart"></i> </button>');
                        } else {
                            $(td).html("");
                        }
                        //KHOYOSI
                    }
                },
                //////////////////////////KHOYOSI (RECETAS)///////////////////////////////////////
                {
                    width: '7%',
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            var btnRecetas = "";
                            //var rutaBit4Id = "";

                            if (rowData.tieneRecetas > 0) {
                                btnRecetas = '<button class="btnImprimeRecetas btn btn-sm btn-cyan glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-note-medical"></i> </button>';
                            }

                            $(td).html(btnRecetas);
                        }
                        else {
                            $(td).html('');
                        }


                    }
                },
                //{
                //    width: '8%',
                //    targets: 13,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        if (!isEmpty(rowData.fechaEgreso)) {
                //            var btnRecetas = "";
                //            //var rutaBit4Id = "";

                //            if (rowData.codeProc != 0) {
                //                btnRecetas = '<button class="btnImprimepRrocedimientos btn btn-sm btn-cyan glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-note-medical"></i> </button>';
                //            }

                //            $(td).html(btnRecetas);
                //        }
                //        else {
                //            $(td).html('');
                //        }


                //    }
                //},
                //////////////////////////KHOYOSI (REFCON)///////////////////////////////////////                
                {
                    width: '7%',
                    targets: 12,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {

                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            if (rowData.idReferencia > 0 || rowData.idContraReferencia > 0) {
                                btnImprimeSinF = '<button class="ImprimeHojaRefConSF btn btn-sm btn-warning glow_button" title="Visualiza REFCON" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                                const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                                if (permisoRefcon == '1' && (rowData.codeRef != '0' || rowData.codeCRef != '0')) {
                                    if (rowData.statusFirmaRef == 1 || rowData.statusFirmaCRef == 1) {
                                        btnImprimeSinF = "";
                                        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeHojaRefConCF" title="Imprime REFCON Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarHojaRefConSF" title="Firmar REFCON" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                    }
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }

                    }
                },
                ////////////////////////////////////////////////////////////////////

                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '7%',
                    targets: 13,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {

                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            if (rowData.idCuentaFua > 0) {
                                btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                                //const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");
                                if (AtencionMedica.permisoFua == '1' && rowData.codeFua != '0') {
                                    if (rowData.statusFirmaFua == 1) {
                                        btnImprimeSinF = "";
                                        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeFuaCF" title="Imprime FUA Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarFuaSF" title="Firmar FUA" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                    }
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }

                        ////////////////////ESTADO ATENCION: ABIERTO O CERRADO//////////////////////
                        //if (rowData.idEstadoAtencion == 2) {
                        //    $(td).parent().css('background-color', '#ecebeb');
                        //    $($(td).parent()).children('td').css('border-color', 'white');
                        //}

                    }
                }
                ///////////////////////////////////////////////////////////////////////////

            ]

        }

        var tableWrapper = $('#tblAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atenciones = $("#tblAtencion").dataTable(parms);

    },

    DataTableBusqueda() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "nroEvaluacion",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idCuentaAtencion",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "paciente",
                    width: "25%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaEvaluacion",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaIngreso",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioActual",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "planFinanciamiento",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');

                        if (rowData.estado == 0) {
                            $(td).parent().css('color', '#F44336');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.code != '') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirInformeCF btn btn-sm btn-success glow_button" title="Imprime Evaluación Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Evaluación" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                btnImprimeSinF = '<button class="ImprimirInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Evaluación" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            btnImprimeSinF = '<button class="ImprimirInformeSF btn btn-sm btn-secondary glow_button" title="Visualiza Evaluación" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            $(td).html(btnImprimeSinF);
                        }
                    }
                },

            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_RiesgoSocial = $("#tblEvaluacionRiesgoSocial").dataTable(parms);
    },

    DataTableEvaluacionesPaciente() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idEvaluacion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "evaluador",
                    width: "35%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaEvaluacion",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "puntaje",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "resultado",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idCuentaAtencion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');

                        if (rowData.estado == 0) {
                            $(td).parent().css('color', '#F44336');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.code != '') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirInformePacienteCF btn btn-sm btn-success glow_button" title="Imprime Evaluación Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            } else {
                                //btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformePacienteSF" title="Firmar Evaluación" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                btnImprimeSinF = '<button class="ImprimirInformePacienteSF btn btn-sm btn-warning glow_button" title="Visualiza Evaluación" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            btnImprimeSinF = '<button class="ImprimirInformePacienteSF btn btn-sm btn-secondary glow_button" title="Visualiza Evaluación" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            $(td).html(btnImprimeSinF);
                        }
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_RiesgoSocialPaciente = $("#tblEvaluacionesRSPaciente").dataTable(parms);
    },
    DataTableListaPacientesBusqueda() {
        var parms = {
            "paging": false,
            "bFilter": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "apellidoPaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "primerNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "segundoNombre",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroDocumento",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fecNacimiento",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoServicio",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableListaPacientesBusqueda = $("#tblListaPacientesBusqueda").dataTable(parms);
    },

    DataTableListaCuentasPacientesBusqueda() {
        var parms = {
            "paging": false,
            "bFilter": true,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idCuentaAtencion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "estadoCuenta",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaIngreso))
                    }
                },
                {
                    data: "fechaEgreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaEgreso))
                    }
                },
                {
                    data: "horaEgreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioIngreso",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "descripcion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "edad",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html('')
                    }
                },
                {
                    data: "estadoEval",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.estadoEval == 0) {          //Aceptado
                            $(td).html('<span class="chip danger"><i class="fa fa-circle-o-notch" aria-hidden="true"></i></span >');
                        } else {
                            $(td).html('<span class="chip success"><i class="fa fa-check-square-o" aria-hidden="true"></i></span >');
                        }
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableListaCuentasPacientesBusqueda = $("#tblListaCuentasPacientesBusqueda").dataTable(parms);
    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async ListarEvaluacionRiesgoSocial() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        if (isEmpty($("#txtNroEvaluacionBusq").val()) && isEmpty($("#txtNroCuentaBusq").val()) && isEmpty($("#txtNroDocumentoBusq").val()) && isEmpty($("#txtNroHistoriaBusq").val()) && isEmpty($("#txtApPaternoBusq").val()) && isEmpty($("#txtApPaternoBusq").val()) && isEmpty($("#txtFechaBusq").val())) {
            alerta2("info", "", "Por favor ingrese algun de los filtros de busqueda.");
            return false;
        }

        data.append('NroEvaluacion', $("#txtNroEvaluacionBusq").val());
        data.append('NroCuenta', $("#txtNroCuentaBusq").val());
        data.append('NroDocumento', $("#txtNroDocumentoBusq").val());
        data.append('NroHistoria', $("#txtNroHistoriaBusq").val());
        data.append('ApPaterno', $("#txtApPaternoBusq").val());
        data.append('ApMaterno', $("#txtApMaternoBusq").val());
        data.append('Fecha', $("#txtFechaBusq").val());

        try {
            Cargando(1);
            oTable_RiesgoSocial.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionRiesgoSocial/ListarEvaluacionRiesgoSocial?area=Facturacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_RiesgoSocial.fnAddData(datos.respuesta.table);
                oTable_RiesgoSocial.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async ListarEvaluacionRiesgoSocialPorPaciente() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdPaciente', RiesgoSocial.IdPaciente);

        try {
            Cargando(1);
            oTable_RiesgoSocialPaciente.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionRiesgoSocial/ListarEvaluacionRiesgoSocialPorPaciente?area=Facturacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_RiesgoSocialPaciente.fnAddData(datos.respuesta.table);
                oTable_RiesgoSocialPaciente.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarEvaluacionRiesgoSocial(obj) {
        let resp = false;
        let midata = new FormData();
        midata.append('NroEvaluacion', obj.nroEvaluacion);

        let datos;
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionRiesgoSocial/SeleccionarEvaluacionRiesgoSocial?area=Facturacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                await RiesgoSocial.CargarDatosALaVista(datos.respuesta);
                resp = true;
            }
        } catch (error) {
            //console.error(error)
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async ListarDiagnosticosEvaluacion(IdCuentaAtencion, diagnosticos) {
        let resp = false;
        let midata = new FormData();
        midata.append('IdCuentaAtencion', IdCuentaAtencion);

        let datos;
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionRiesgoSocial/ListarDiagnosticosEvaluacion?area=Facturacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {

                console.log('diagnosticos', datos.respuesta.table)
                $('#cboDiagnosticoRs').empty()
                $('#cboDiagnosticoRs').append('<option value=""></option>');
                $(datos.respuesta.table).each(function (i, obj) {
                    $('#cboDiagnosticoRs').append('<option data-cie10="' + obj.codigoCIE10 + '" value="' + obj.idDiagnostico + '">' + obj.diagnostico + '</option>');
                });

                $('#cboDiagnosticoRs').val(diagnosticos?.split(','))

                resp = true;
            }
        } catch (error) {
            //console.error(error)
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async SeleccionarEvaluacionAnteriorRiesgoSocial(obj) {
        let resp = false;
        let midata = new FormData();
        midata.append('NroEvaluacion', obj.idEvaluacion);

        let datos;
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionRiesgoSocial/SeleccionarEvaluacionRiesgoSocial?area=Facturacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                RiesgoSocial.CargarDatosAnteriorALaVista(datos.respuesta);
                resp = true;
            }
        } catch (error) {
            //console.error(error)
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async BuscarCuentaPaciente(IdCuentaAtencion) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idCuenta', IdCuentaAtencion);


        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaAtencionByIdCuentaAtencion?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstAtenciones.table.length > 0) {
                resp = datos.lstAtenciones.table[0];
                RiesgoSocial.CargarDatosPaciente(resp);
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async CalcularNivelEvaluacionRiesgoSocial(total) {
        let resp = false;
        let midata = new FormData();
        midata.append('total', total);

        let datos;
        try {
            $("#txtCodigoPuntajeRs").val("");
            $("#txtNroPlanRs").val("");
            $("#txtNombrePlanRs").val("");
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionRiesgoSocial/CalcularNivelEvaluacionRiesgoSocial?area=Facturacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                let nivel = datos.respuesta.table[0];
                $("#txtTotalPuntajeRs").val(total);
                $("#txtCodigoPuntajeRs").val(nivel.codigo);
                $("#txtNroPlanRs").val(nivel.plnnum);
                $("#txtNombrePlanRs").val(nivel.nivel);
                resp = true;
            }
        } catch (error) {
            //console.error(error)
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async ListaDiagnosticosPorFiltro(filtro) {
        let datos = null;
        let midata = new FormData();
        //let filtro = '';

        $('#cboDiagnosticoRs').empty();
        $('#cboDiagnosticoRs').append('<option value=""></option>');
        //$('#cboDiagnosticoRs').append('<option value="0">Busque y seleccione un diagnóstico</option>');
        $('#cboDiagnosticoRs').val("0");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        if (filtro.length >= 3) {
            try {

                midata.append('filtro', filtro);

                //Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Diagnosticos/ListaDiagnosticosPorFiltro?area=Comun",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                //Cargando(0)
                $('#cboDiagnosticoRs').append('<option value=""></option>');
                $(datos.table).each(function (i, obj) {
                    $('#cboDiagnosticoRs').append('<option data-cie10="' + obj.codigoCIE10 + '" value="' + obj.idDiagnostico + '">' + obj.diagnostico + '</option>');
                });

                $('#cboDiagnosticoRs').val("0");
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            } catch (error) {
                resp = false;
                //console.error(error)
                alerta(3, error);
            }
        }

        $('#cboDiagnosticoRs_chosen .chosen-drop .chosen-search input').val(filtro);
    },

    async ListaDiagnosticosPorFiltroV2(filtro) {
        if (filtro.length < 3) return;

        let $select = $('#cboDiagnosticoRs');

        // Guardar los seleccionados (value y texto)
        let seleccionados = [];
        $select.find('option:selected').each(function () {
            seleccionados.push({
                value: $(this).val(),
                text: $(this).text(),
                cie10: $(this).data('cie10')
            });
        });

        let midata = new FormData();
        midata.append('filtro', filtro);

        try {
            let datos = await $.ajax({
                method: "POST",
                url: "/Diagnosticos/ListaDiagnosticosPorFiltro?area=Comun",
                data: midata,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            // Limpiar solo las opciones NO seleccionadas
            $select.find('option').not(':selected').remove();

            // Agregar las opciones filtradas
            $(datos.table).each(function (i, obj) {
                // Evitar agregar duplicados (ya seleccionados)
                if (!seleccionados.some(s => s.value == obj.idDiagnostico)) {
                    $select.append(
                        `<option data-cie10="${obj.codigoCIE10}" value="${obj.idDiagnostico}">${obj.diagnostico}</option>`
                    );
                }
            });

            // Restaurar las opciones seleccionadas (aseguramos que existan en el select)
            seleccionados.forEach(s => {
                if ($select.find(`option[value="${s.value}"]`).length === 0) {
                    $select.append(
                        `<option data-cie10="${s.cie10}" value="${s.value}" selected>${s.text}</option>`
                    );
                }
            });

            // Actualizar Chosen
            $select.trigger("chosen:updated");

        } catch (error) {
            alerta(3, error);
        }
    },



    async GuardarEvaluacionRiesgoSocial() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('invnum', RiesgoSocial.NroEvaluacion);
        data.append('idCuentaAtencion', RiesgoSocial.IdCuentaAtencion);
        data.append('evafec', $("#txtFechaEvaluacionRs").val());
        data.append('idTurnoLabora', $("#cboTurnoLaboradoRs").val());
        data.append('usecod', $("#cboTrabajadoraSocialRs").val());
        data.append('diacod', $('#cboDiagnosticoRs option:selected').data('cie10'));
        data.append('evacom', $("#txtObservacionRs").val());

        data.append('telefono1', $("#txtTelefono1Paciente").val());
        data.append('telefono2', $("#txtTelefono2Paciente").val());
        data.append('telefono3', $("#txtTelefono3Paciente").val());
        data.append('telefono4', $("#txtTelefono4Paciente").val());

        data.append('familiar1', $("#txtFamiliar1Paciente").val());
        data.append('familiar2', $("#txtFamiliar2Paciente").val());
        data.append('familiar3', $("#txtFamiliar3Paciente").val());
        data.append('familiar4', $("#txtFamiliar4Paciente").val());


        data.append('evaPadre', $("#txtPadrePaciente").val());
        data.append('evaMadre', $("#txtMadrePaciente").val());
        data.append('evaTutor', $("#txtTutorPaciente").val());
        data.append('evaTratamiento', $("#txtTratamientoSocial").val());

        data.append('direccionActual', $("#txtDireccionActualPaciente").val());

        data.append('referenciaDireccion', $("#txtReferenciaDireccionPaciente").val());
        data.append('tipoPaciente', $("#cboTipoPacienteRs").val());
        data.append('especificarTipoPaciente', $("#txtEspecificarTipoPaciente").val());
        data.append('diagnosticos', $('#cboDiagnosticoRs').val().join(','));


        data.append('detalle', JSON.stringify(RiesgoSocial.DevolverDetalleEvaluacion()));
        data.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            //oTable_RiesgoSocial.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionRiesgoSocial/GuardarEvaluacionRiesgoSocial?area=Facturacion",
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
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async EliminarEvaluacionRiesgoSocial(NroEvaluacion) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('NroEvaluacion', NroEvaluacion);
        data.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            oTable_RiesgoSocial.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionRiesgoSocial/EliminarEvaluacionRiesgoSocial?area=Facturacion",
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
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    CargarDatosPaciente(datos) {
        //console.log("CANTIDA:" + datos.length);
        if (isEmpty(datos)) {
            return
        }

        // if (datos.idEstadoAtencion != 1) {
        //     alerta2("info", "", "El estado de la cuenta NO se ecuentra ABIERTA.");
        //     return
        // }

        RiesgoSocial.NroEvaluacion = 0;
        RiesgoSocial.IdCuentaAtencion = datos.idCuentaAtencion;
        RiesgoSocial.IdPaciente = datos.idPaciente;

        $("#txtNroCuentaPaciente").val(datos.idCuentaAtencion);
        $("#txtNroHistoriaPaciente").val(datos.nroHistoriaClinica);
        $("#txtNroDocumentoPaciente").val(datos.nroDocumento);
        $("#txtNombrePaciente").val(datos.apellidoPaterno + ' ' + datos.apellidoMaterno + ' ' + datos.nombres);
        $("#txtFuenteFinanciamientoPaciente").val(datos.planA);
        $("#txtServicioPaciente").val(datos.servicio);
        $("#txtLugarNacimientoPaciente").val(datos.lugarNacimiento);
        $("#txtProcedenciaPaciente").val(datos.distritoProcedencia);
        $("#txtDireccionPaciente").val(datos.direccionDomicilio);

        $("#txtCondicionEstablecimientoPaciente").val(datos.condicionEstablecimiento);
        $("#txtCondicionServicioPaciente").val(datos.condicionServicio);
        $("#txtTipoDocumentoPaciente").val(datos.dTipoDocumento);
        $("#txtEdadPaciente").val(datos.edadPaciente);
        $("#txtSexoPaciente").val(datos.sexo);
        $("#txtEstadoCivilPaciente").val(datos.dEstadoCivil);
        $("#txtIdiomaPaciente").val(datos.idioma);
        $("#txtReligionPaciente").val(datos.religion);
        $("#txtTelefonoPaciente").val(datos.telefono);
        $("#txtNombreMadreTutorPaciente").val(datos.madreTutor);
    },

    async CargarDatosALaVista(resp) {
        console.log(resp);
        let eval = resp.table[0];
        let det = resp.table1;
        RiesgoSocial.NroEvaluacion = eval.nroEvaluacion;
        RiesgoSocial.IdCuentaAtencion = eval.idCuentaAtencion;
        RiesgoSocial.IdPaciente = eval.idPaciente;

        RiesgoSocial.IdTrabajadoraSocial = eval.idtrabajadoraSocial

        $("#txtNroCuentaPaciente").val(eval.idCuentaAtencion);
        $("#txtNroHistoriaPaciente").val(eval.nroHistoriaClinica);
        $("#txtNroDocumentoPaciente").val(eval.nroDocumento);
        $("#txtNombrePaciente").val(eval.paciente);
        $("#txtFuenteFinanciamientoPaciente").val(eval.planFinanciamiento);
        $("#txtServicioPaciente").val(eval.servicioActual);
        $("#txtLugarNacimientoPaciente").val(eval.lugarNacimiento);
        $("#txtProcedenciaPaciente").val(eval.distritoProcedencia);

        $("#txtNroEvaluacionRs").val(eval.nroEvaluacion + " (Estado: " + eval.estadoEvaluacion + ")");
        $("#txtFechaEvaluacionRs").datepicker("setDate", eval.fechaEvaluacion);
        $("#cboTurnoLaboradoRs").val(eval.idTurnoLabora);
        $("#cboTrabajadoraSocialRs").val(eval.idtrabajadoraSocial);
        await RiesgoSocial.ListaDiagnosticosPorFiltro(isNull(eval.cieDx, ''));
        $('#cboDiagnosticoRs').val(eval.idDiagnostico);
        $("#txtObservacionRs").val(eval.comentarios);

        $("#cboTipoPacienteRs").val(eval.tipoPaciente);
        $("#txtEspecificarTipoPaciente").val(eval.especificarTipoPaciente);


        $("#txtTelefono1Paciente").val(eval.telefono1);
        $("#txtTelefono2Paciente").val(eval.telefono2);
        $("#txtTelefono3Paciente").val(eval.telefono3);
        $("#txtTelefono4Paciente").val(eval.telefono4);

        $("#txtFamiliar1Paciente").val(eval.familiar1);
        $("#txtFamiliar2Paciente").val(eval.familiar2);
        $("#txtFamiliar3Paciente").val(eval.familiar3);
        $("#txtFamiliar4Paciente").val(eval.familiar4);


        $("#txtDireccionActualPaciente").val(eval.direccionActual);

        $("#txtReferenciaDireccionPaciente").val(eval.referenciaDireccion);

        $("#txtPadrePaciente").val(eval.evaPadre);
        $("#txtMadrePaciente").val(eval.evaMadre);
        $("#txtTutorPaciente").val(eval.evaTutor);
        $("#txtTratamientoSocial").val(eval.evaTratamiento);

        $(det).each(function (i, obj) {
            $('#rdbRs' + obj.idRsCategoriaSub + '_' + obj.numeroOrden).prop("checked", true);
        });

        await RiesgoSocial.TotalizarPuntaje();

        await RiesgoSocial.ListarDiagnosticosEvaluacion(eval.idCuentaAtencion, eval.diagnosticos)

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $('.chzn-select').chosen().trigger("chosen:updated")
        $('.chosen-select').chosen().trigger("chosen:updated")

    },

    async CargarDatosAnteriorALaVista(resp) {
        console.log(resp);
        let eval = resp.table[0];
        let det = resp.table1;
        //RiesgoSocial.NroEvaluacion = 0;
        //RiesgoSocial.IdCuentaAtencion = eval.idCuentaAtencion;
        //RiesgoSocial.IdPaciente = eval.idPaciente;

        //$("#txtNroCuentaPaciente").val(eval.idCuentaAtencion);
        //$("#txtNroHistoriaPaciente").val(eval.nroHistoriaClinica);
        //$("#txtNroDocumentoPaciente").val(eval.nroDocumento);
        //$("#txtNombrePaciente").val(eval.paciente);
        //$("#txtFuenteFinanciamientoPaciente").val(eval.planFinanciamiento);
        //$("#txtServicioPaciente").val(eval.servicioActual);
        //$("#txtLugarNacimientoPaciente").val(eval.lugarNacimiento);
        //$("#txtProcedenciaPaciente").val(eval.distritoProcedencia);

        //$("#txtNroEvaluacionRs").val("");
        //$("#txtFechaEvaluacionRs").datepicker("setDate", eval.fechaEvaluacion);
        //$("#cboTurnoLaboradoRs").val(eval.idTurnoLabora);
        //$("#cboTrabajadoraSocialRs").val(eval.idtrabajadoraSocial);
        await RiesgoSocial.ListaDiagnosticosPorFiltro(isNull(eval.cieDx, ''));
        $('#cboDiagnosticoRs').val(eval.idDiagnostico);
        $("#txtObservacionRs").val(eval.comentarios);

        $(det).each(function (i, obj) {
            $('#rdbRs' + obj.idRsCategoriaSub + '_' + obj.numeroOrden).prop("checked", true);
        });

        await RiesgoSocial.TotalizarPuntaje();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");

    },

    async TotalizarPuntaje() {
        let total = 0;
        $('.rdbPuntajeEvaluacion:checked').each(function () {
            total += parseFloat($(this).val()) || 0;
        });
        $('#txtTotalPuntajeRs').val(total);
        await RiesgoSocial.CalcularNivelEvaluacionRiesgoSocial(total);
    },

    DevolverDetalleEvaluacion() {
        let detalleEval = [];
        let objItemDetalle = null;

        $('.rdbPuntajeEvaluacion:checked').each(function () {
            objItemDetalle = {
                invnum: RiesgoSocial.NroEvaluacion,
                idRsCategoriaSub: $(this).data('subcategoria'),
                numeroOrden: $(this).data('orden'),
                rieval: parseInt($(this).val()),
                riechk: 'S'
            }

            detalleEval.push(objItemDetalle);
        });

        return detalleEval;
    },

    BloquearRegistro() {
        $(".writing").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnGuardarEvaluacionRiesgoSocial").hide();
        $("#btnNroCuentaBusq").attr('disabled', true);
        //$("#btnEliminarMedicinaReproductiva").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnGuardarEvaluacionRiesgoSocial").show();
        $("#btnNroCuentaBusq").attr('disabled', false);
        //$("#btnEliminarMedicinaReproductiva").hide();

        let color = $('input[name="EvalMacroColor"]:checked').val();
        if (color == 9) {
            $("#txtEvalMacroColorOpt9").removeAttr("disabled");
        } else {
            $("#txtEvalMacroColorOpt9").attr("disabled", true);
        }

        let lugar = $('#cboLugarObtencion').val();
        if (lugar == 9) {
            $("#txtLugarObtencion").removeAttr("disabled");
        } else {
            $("#txtLugarObtencion").attr("disabled", true);
        }

        let metodo = $('#cboMetodoObtencion').val();
        if (metodo == 9) {
            $("#txtMetodoObtencion").removeAttr("disabled");
        } else {
            $("#txtMetodoObtencion").attr("disabled", true);
        }
    },

    async LimpiarCamposRegistro() {
        RiesgoSocial.NroEvaluacion = 0;
        RiesgoSocial.IdCuentaAtencion = 0;
        RiesgoSocial.IdPaciente = 0;

        await RiesgoSocial.ListaDiagnosticosPorFiltro('');
        $('.writing').val('');
        $('.reading').val('');

        $(".rdbPuntajeEvaluacion").prop('checked', false);
        $('#sbRs1').collapse('show');
        $('.nav-tabs a[href="#panelRs113"]').tab('show');

        let FechaHora = await Utilitario.FechaHoraServidor();
        $("#txtFechaEvaluacionRs").datepicker("setDate", FechaHora.substring(0, 10));

        $("#cboDiagnosticoRs").val([]).trigger("chosen:updated");
    },

    LimpiarCamposBusqueda() {
        $('.search').val('');
    },

    PacientesFiltrarTodosSoloHistorias: async function () {

        let formData = new FormData()

        let idDocIdentidad = ''

        if ($('#txtDniPacienteBusqueda').val().length == 8) {
            idDocIdentidad = 1
        } else if ($('#txtDniPacienteBusqueda').val().length == 9) {
            idDocIdentidad = 2
        }

        formData.append("nroHistoriaClinica", $('#txtNroHistoriaPacienteBusqueda').val())
        formData.append("apellidoPaterno", $('#txtApPaternoPacienteBusqueda').val())
        formData.append("apellidoMaterno", $('#txtApMaternoPacienteBusqueda').val())
        formData.append("primerNombre", $('#txtPrimerNombrePacienteBusqueda').val())
        formData.append("segundoNombre", '')
        formData.append("idDocIdentidad", idDocIdentidad)
        formData.append("nroDocumento", $('#txtDniPacienteBusqueda').val())

        let response = await HttpClient.Post(`/EstadoCuenta/PacientesFiltrarTodosSoloHistorias`, formData)

        if (isEmpty(response) || response.data.table <= 0) {
            return false
        }

        return response.data.table
    },

    ListarAtencionesPorPaciente: async function () {

        let formData = new FormData();

        formData.append('IdPaciente', IdPaciente);

        const res = await HttpClient.Post('/EstadoCuenta/AtencionesListaCuentasXpaciente?area=Comun', formData);

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar cuentas')
            return null
        }

        let data = res.data.table

        oTable_TableListaCuentasPacientesBusqueda.fnClearTable();
        if (data && data.length > 0) {
            oTable_TableListaCuentasPacientesBusqueda.fnAddData(data);
        }

    },




}


$(document).ready(function () {
    RiesgoSocial.Iniciar();

    $('#cboTrabajadoraSocialRs').val($('#hdIdUsuario').val())
    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    //PermisoGeneral.ValidarServicioFirmaDigital();
});