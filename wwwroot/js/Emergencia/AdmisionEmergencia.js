/*var listaDxRefCon = [{}];
var tratamientoRefCon = '';
var moduloActualRefCon = '';*/
//var idPacienteGlobal = 0;


var AdmisionEmergencia = {
    IdAtencion: 0,
    IdServicioEgreso: 0,
    accion: '',
    permisoFua: '',
    tipoBusqueda: 0,

    async CargaInicial() {
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

        //$('#txtFechaAtencionBuscar').val(fechaP);
        $('#txtFechaAtencionBuscar').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#txtFechaAtencionFinBuscar').datepicker("setDate", moment().toDate().format('dd/mm/yyyy')); // JDELGADOPM

        /*$("#cboTipoConsulta").attr('disabled', 'disabled');
        $("#cboTipoConsulta").trigger("chosen:updated");
        $("#ceAtencion-tab").css("pointer-events", "none");*/

        $('.modalRefCon').modal({ backdrop: 'static', keyboard: false });
        $('.modalRefCon').modal('hide');

        const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();
        if (!isEmpty(permisosGenerales)) {
            AdmisionEmergencia.permisoFua = permisosGenerales.table.find(item => item.codigo === 'FUA').valorInt;
        }
        //EstablecimientosSaludTodos();
        //ListaDepartamentos();

        Transferencias.tipoServicio = 'EMER';
        AltaMedica.tipoServicio = "EMER";
        AltaMedica.EventosInicial();

        $("#ecoMedFet-tab").val("ECO. OBTÉTRICA");
    },


    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: false });
        $(".chzn-select-deselect,#select2_sample").chosen();
        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#txtFinEmb,#txtFechaAtencion,#txtFechaAtencionBuscar, #txtFechaAtencionFinBuscar, #txtFUM,#txtFPP,#txtFEcog,#txtFechaControl,#txtFPPControl,#txtProximaConsulta').datepicker({ // se agrego txtProximaConsulta RQ0002
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
        $('#txtFinEmb,#txtFechaAtencion,#txtFechaAtencionBuscar, #txtFechaAtencionFinBuscar, #txtFUM,#txtFPP,#txtFEcog,#txtFechaControl,#txtFPPControl,#txtProximaConsulta').mask("Dd/Mm/abcd");
    },




    /// <summary>
    /// EVENTOS
    /// </summary>
    /// Carga los eventos que se encargan de la interaccion y acciones en las vistas para el módulo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.search').blur();
                $("#btnBuscarAtencionesEmergencia").click();
            }
        });

        /*================================ADMISION EMERGENCIA=====================================*/
        $('#tblAtencionEmer tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_atencionesEmer.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_atencionesEmer.api(true).row($(this)).index();
            var row = oTable_atencionesEmer.fnGetData(pos);

        });
        /*===================================================================================*/


        /*============================ADMISION EMRGENCIAS==============================*/
        $('#cboServicioEmergenciaBuscar').on('change', function (e) {
            e.preventDefault();
            $('.search').blur();
            $("#btnBuscarAtencionesEmergencia").click();
        });

        $('#btnBuscarAtencionesEmergencia').on('click', function () {
            //$('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta2('info', '', 'Ingrese la fecha de ingreso.');
                return false;
            }

            if (isEmpty($('#cboServicioEmergenciaBuscar').val())) {
                alerta2('info', '', 'Seleccione un servicio.');
                return false;
            }
            AdmisionEmergencia.tipoBusqueda = 1;
            AdmisionEmergencia.ListarAtenciones(AdmisionEmergencia.tipoBusqueda);
            ReposicionarVista();
        });

        $('#btnBuscarAtencionesEmergenciaSinAltaMedica').on('click', function () {
            //$('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta2('info', '', 'Ingrese la fecha de ingreso.');
                return false;
            }

            if ($('#cboServicioEmergenciaBuscar').val() == 0) {
                alerta2('info', '', 'Seleccione un servicio.');
                return false;
            }
            AdmisionEmergencia.tipoBusqueda = 2;
            AdmisionEmergencia.ListarAtenciones(AdmisionEmergencia.tipoBusqueda);
            ReposicionarVista();
        });

        $('#btnBuscarAtencionesEmergenciaSinRecepcion').on('click', function () {
            //$('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta2('info', '', 'Ingrese la fecha de ingreso.');
                return false;
            }

            if ($('#cboServicioEmergenciaBuscar').val() == 0) {
                alerta2('info', '', 'Seleccione un servicio.');
                return false;
            }
            AdmisionEmergencia.tipoBusqueda = 3;
            AdmisionEmergencia.ListarAtenciones(AdmisionEmergencia.tipoBusqueda);
            ReposicionarVista();
        });

        $('#btnBuscarAtencionesEmergenciaSinAltaAdministrativa').on('click', function () {
            //$('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta2('info', '', 'Ingrese la fecha de ingreso.');
                return false;
            }

            if ($('#cboServicioEmergenciaBuscar').val() == 0) {
                alerta2('info', '', 'Seleccione un servicio.');
                return false;
            }
            AdmisionEmergencia.tipoBusqueda = 4;
            AdmisionEmergencia.ListarAtenciones(AdmisionEmergencia.tipoBusqueda);
            ReposicionarVista();
        });

        $('#btnLimpiarFiltro').on('click', function () {
            $('.search').val('');
            $('#txtFechaAtencionBuscar').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
            $('#txtFechaAtencionFinBuscar').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
            $(`#cboServicioEmergenciaBuscar`).val(0);
            $('.chzn-select').chosen().trigger("chosen:updated");

        })

        $('#btnImprimirTicket').on('click', function () {
            let objCupo = oTable_atencionesEmer.api(true).row('.selected').data()

            var url = "/AdmisionEmergencia/ImprimeTicketCita?area=ConsultaExterna&idAtencion=" + RegistroAdmision.IdAtencion + "&nroCupo=" + "__"
            $('#ifrmTicketCita').attr('src', url)

            Cargando(1)
            $('#ifrmTicketCita')
                .off('load') // elimina handlers anteriores si hubiera
                .on('load', function () {
                    $("#modalTicket").modal('show');
                    Cargando(0)
                })
                .attr('src', url);
        })
        $('#btnImprimeHojaFiliacionConsultorio').on('click', function () {
            let objCupo = oTable_atencionesEmer.api(true).row('.selected').data()

            var url = "/AdmisionEmergencia/ImprimeHojaFiliacionConsultorio?area=ConsultaExterna&idPaciente=" + RegistroAdmision.IdPaciente + "&idAtencion=" + RegistroAdmision.IdAtencion
            $('#ifrmTicketCita').attr('src', url)

            Cargando(1)
            $('#ifrmTicketCita')
                .off('load') // elimina handlers anteriores si hubiera
                .on('load', function () {
                    $("#modalTicket").modal('show');
                    Cargando(0)
                })
                .attr('src', url);
        })

        $('#ImprimeFormatoFiliacionArchivoClinico').on('click', function () {
            let objCupo = oTable_atencionesEmer.api(true).row('.selected').data()

            var url = "/AdmisionEmergencia/ImprimeFormatoFiliacionArchivoClinico?area=ConsultaExterna&idPaciente=" + RegistroAdmision.IdPaciente + "&idAtencion=" + RegistroAdmision.IdAtencion
            $('#ifrmTicketCita').attr('src', url)

            Cargando(1)
            $('#ifrmTicketCita')
                .off('load') // elimina handlers anteriores si hubiera
                .on('load', function () {
                    $("#modalTicket").modal('show');
                    Cargando(0)
                })
                .attr('src', url);
        })

        $('#ImprimeFormatoFO030').on('click', function () {
            let objCupo = oTable_atencionesEmer.api(true).row('.selected').data()

            var url = "/AdmisionEmergencia/ImprimeFormatoFO030?area=ConsultaExterna&idPaciente=" + RegistroAdmision.IdPaciente + "&idAtencion=" + RegistroAdmision.IdAtencion
            $('#ifrmTicketCita').attr('src', url)

            Cargando(1)
            $('#ifrmTicketCita')
                .off('load') // elimina handlers anteriores si hubiera
                .on('load', function () {
                    $("#modalTicket").modal('show');
                    Cargando(0)
                })
                .attr('src', url);
        })

        ///////////////////////////EVENTOS IMPRIMIR INFORME///////////////////////////////////
        $('#tblAtencionEmer tbody').on('click', '.ImprimirEvalNeoEmerSinF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'NEOE-1');

            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(row.idCuentaAtencion, row.idAtencion, row.idServicioEgreso, 1);
                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
        });

        $('#tblAtencionEmer tbody').on('click', '.ImprimeHojaRefConSF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);
            var idRefCon = 0;
            var tipo = '';
            var code = '';

            Cargando(1);
            if (row.idReferencia > 0) {
                idRefCon = row.idReferencia;
                tipo = 'RF'
                code = row.codeRef;
            } else if (row.idContraReferencia > 0) {

                idRefCon = row.idContraReferencia;
                tipo = 'CRF';
                code = row.codeCRef;
            }
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(code)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarRefConPdf(row.idCuentaAtencion, idRefCon, tipo);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblAtencionEmer tbody').on('click', '.ImprimeHojaRefConCF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);
            var tipo = '';
            var code = '';

            if (row.idReferencia > 0) {
                idRefCon = row.idReferencia;
                tipo = 'RF'
                code = row.codeRef;
            } else if (row.idContraReferencia > 0) {

                idRefCon = row.idContraReferencia;
                tipo = 'CRF';
                code = row.codeCRef;
            }
            await Utilitario.AbrirDocumentoFirmadoBit4Id(code);
        });

        $('#tblAtencionEmer tbody').on('click', '.FirmarHojaRefConSF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);
            var tipo = '';
            var code = '';

            if (row.idReferencia > 0) {
                idRefCon = row.idReferencia;
                tipo = 'RF'
                code = row.codeRef;
            } else if (row.idContraReferencia > 0) {

                idRefCon = row.idContraReferencia;
                tipo = 'CRF';
                code = row.codeCRef;
            }
            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(code)               //KHOYOSI            
            if (firma) {
                //if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(code); }
                //if (permisoFirmaDigital == 2) { await Utilitario.AbrirServicioFirmaPeru(code); }
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(code); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(code); }
                //await Utilitario.AbrirServicioFirmaBit4Id(code);
            }
            Cargando(0);
        });

        //RMOREANO PAPELETA EGRESO

        $('#tblAtencionEmer tbody').on('click', '.ImprimirpaPapeletaEgreso', async function () {
            
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);       
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codePapeletaEgreso)
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
              
                AbrirVisorDocumento(firma.rutaArchivo, 0);

            }
            Cargando(0);
        });

        $('#tblAtencionEmer tbody').on('click', '.ImprimirPapeletaEgresoSF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'E-PE';
                Cargando(1);
                const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codePapeletaEgreso)               //KHOYOSI            
                if (firma) {
                    if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.codePapeletaEgreso); }
                    if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.codePapeletaEgreso); }
                }
                Cargando(0);
            }
            Cargando(0);
        });


        $('#tblAtencionEmer tbody').on('click', '.ImprimirpaDescansoMedico', async function () {

            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeDescansoMed)
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {

                AbrirVisorDocumento(firma.rutaArchivo, 0);

            }
            Cargando(0);
        });

        $('#tblAtencionEmer tbody').on('click', '.ImprimirpaDescansoMedicoSF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'E-PE';
                Cargando(1);
                const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codeDescansoMed)               //KHOYOSI            
                if (firma) {
                    if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.codeDescansoMed); }
                    if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.codeDescansoMed); }
                }
                Cargando(0);
            }
            Cargando(0);
        });


        // FIN RMOREANO 

        $('#tblInformeEvaluacionesEmergencia tbody').on('click', '.ImprimirEvalSF', async function () {
            var objrow = oTable_EvaInfEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInfEmer.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
                if (isEmpty(firma)) {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                    const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(row.idCuentaAtencion, row.idEvaluacionDetalle, row.idAtencion, row.idServicio, row.idNumero);

                    if (pdf) {
                        alerta('1', 'Se generó el documento correctamente.')
                        $("#btnBuscarAtenciones").click();
                    } else {
                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                    }
                } else {
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }
            }
            Cargando(0);
        });

        $('#tblInforPapeletasAlta tbody').on('click', '.ImprimirPapSF', async function () {
            var objrow = oTable_EvaInfPapAlta.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInfPapAlta.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
                AbrirVisorDocumento(firma.rutaArchivo, 0);
                /*if (isEmpty(firma)) {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                    const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(row.idCuentaAtencion, row.idEvaluacionDetalle, row.idAtencion, row.idServicio, row.idNumero);

                    if (pdf) {
                        alerta('1', 'Se generó el documento correctamente.')
                        $("#btnBuscarAtenciones").click();
                    } else {
                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                    }
                } else {
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }*/
            }
            Cargando(0);
        });

        $('#tblInformeEvaluacionesEmergencia tbody').on('click', '.ImprimirEvalCF', async function () {
            var objrow = oTable_EvaInfEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInfEmer.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
            }
            Cargando(0);
        });

        $('#tblInformeEvaluacionesEmergencia tbody').on('click', '.FirmarEvalSF', async function () {
            var objrow = oTable_EvaInfEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInfEmer.fnGetData(objrow);

            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'EMER-EVA';
                Cargando(1);
                const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI            
                if (firma) {
                    //await Utilitario.IniciarServicioFirmaBit4Id(row.code);
                    if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
                    if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }
                }
                Cargando(0);
            }
            Cargando(0);
        });


        $('#cboServicioDestinoCR').on('change', function () {
            //$('#lblMedicoProgramado').html("")
            $('#txtServContraRefCR').val($('#cboServicioDestinoCR_chosen span').html())
            //console.log("Seleccionadnooo");
        });

        $('#FechaInicioAtencion').on('keydown', function () {
            return false;
        });

        

        //------------------------------EVENTO MODIFICAR EVALUACION--------------------------------//
        $("#btnModificarEvaluacion").on('click', async function () {
            $("#modulo").html("");
            //opcionModificar = false;
            AdmisionEmergencia.accion = "M";
            OrdenMedica.accion = "M";
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('info', 'Atención', 'Por favor seleccione un registro.')
                return;
            }


            if (objrowTb.idEstadoFacturacion == 9) {
                alerta2('warning', 'Atención', 'La atención se encuentra anulada, no se puede evaluar.')
                return
            }

            Cargando(1);
            if (AdmisionEmergencia.ValidaCargaModulo()) {
                if (AdmisionEmergencia.ValidaTipoModulo()) {
                    Variables.Cargar(objrowTb);
                    await AdmisionEmergencia.ValidaAbrirModulo();
                    Triaje.eventos();
                    if (objrowTb.tipoModuloEmergencia == "ginecobstetra") { await EvaluacionEmergencia.ModificarEvaluacion(); }
                    if (objrowTb.tipoModuloEmergencia == "neonatal") { EvaluacionNeonatal.ModificarEvaluacion(); }
                    if (objrowTb.tipoModuloEmergencia == "especialidades") { EvaluacionEspecialidad.ModificarEvaluacion(); }
                    if (objrowTb.tipoModuloEmergencia == "trabajador") { EvaluacionEspecialidad.ModificarEvaluacion(); }
                }
            }
            Cargando(0);
        });

        //----------------------------EVENTO CONSULTAR EVALUACION-----------------------------------//
        $("#btnConsultarEvaluacion").on('click', async function () {
            $("#modulo").html("");
            //opcionModificar = false;
            AdmisionEmergencia.accion = "C";
            OrdenMedica.accion = "C";
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('info', 'Atención', 'Por favor seleccione un registro.')
                return;
            }

            if (objrowTb.idEstadoFacturacion == 9) {
                alerta2('warning', 'Atención', 'La atención se encuentra anulada, no se puede consultar.')
                return
            }

            Cargando(1);
            if (AdmisionEmergencia.ValidaCargaModulo()) {
                if (AdmisionEmergencia.ValidaTipoModulo()) {
                    Variables.Cargar(objrowTb);
                    await AdmisionEmergencia.ValidaAbrirModulo();

                    if (objrowTb.tipoModuloEmergencia == "ginecobstetra") { EvaluacionEmergencia.ConsultarEvaluacion(); }
                    if (objrowTb.tipoModuloEmergencia == "neonatal") { EvaluacionNeonatal.ConsultarEvaluacion(); }
                    if (objrowTb.tipoModuloEmergencia == "especialidades") { EvaluacionEspecialidad.ConsultarEvaluacion(); }
                    if (objrowTb.tipoModuloEmergencia == "trabajador") { EvaluacionEspecialidad.ConsultarEvaluacion(); }
                }
            }
            Cargando(0);
        });

        //----------------------------EVENTO ALTA MEDICA-----------------------------------//
        //$("#btnAltaMedica").on('click', async function () {
        //    $("#ModuloAlta").html("");

        //    AdmisionEmergencia.accion = "AM";
        //    var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        //    Cargando(1);
        //    if (AdmisionEmergencia.ValidaCargaModulo()) {
        //        Variables.Cargar(objrowTb);
        //        AltaMedica.tipoServicio = 0;
        //        AltaMedica.idEspecialidad = objrowTb.idEspecialidad;
        //        await Utilitario.CargarModuloAlta();
        //        await AltaMedica.IniciarScript();
        //        await AltaMedica.ModificarAltaMedica(objrowTb);
        //    }
        //    Cargando(0);

        //    //AdmisionEmergencia.ListarAtenciones();
        //});


        //----------------------------AUTORIZACIÓN EXÁMENES ESPECIALIZADOS-----------------------------------//
        $("#btnAutorizacionExamenesEspecializados").on('click', async function () {
            const objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('info', 'Atención', 'Por favor seleccione un registro.');
                return;
            }

            await AdmisionEmergencia.GenerarAutorizacionExamenesEspecializadosVista(
                objrowTb.idCuentaAtencion,
                objrowTb.idAtencion,
                objrowTb.idServicioEgreso,
                objrowTb.cantEvaluacion
            );
        });

        //----------------------------CONSENTIMIENTO PROCESOS QX-----------------------------------//
        $("#btnConsentimientoProcesosQx").on('click', async function () {
            const objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('info', 'Atención', 'Por favor seleccione un registro.');
                return;
            }

            await AdmisionEmergencia.GenerarConsentimientoProcesosQxVista(
                objrowTb.idCuentaAtencion,
                objrowTb.idAtencion,
                objrowTb.idServicioEgreso,
                objrowTb.cantEvaluacion
            );
        });




        /////////////////////////////EVENTO LISTA INFORMES DE EVALAUCION///////////////////////////
        $('#tblAtencionEmer tbody').on('click', '.btnInformeEvaluacion', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atencionesEmer.fnGetData(objrow)

            AdmisionEmergencia.IdAtencion = row.idAtencion;
            AdmisionEmergencia.IdServicioEgreso = row.idServicioEgreso;
            //await AdmisionEmergencia.SeleccionarEvaluacionDetalle(AdmisionEmergencia.IdAtencion, AdmisionEmergencia.IdServicioEgreso);
            await AdmisionEmergencia.SeleccionarEvaluacionDetalle(AdmisionEmergencia.IdAtencion, 0);
            $("#modalInformeEvaluacion").modal("show");
        });

        $('#tblAtencionEmer tbody').on('click', '.btnPapeletasAlta', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atencionesEmer.fnGetData(objrow)

            AdmisionEmergencia.IdAtencion = row.idAtencion;
            AdmisionEmergencia.IdServicioEgreso = row.idServicioEgreso;
            //await AdmisionEmergencia.SeleccionarEvaluacionDetalle(AdmisionEmergencia.IdAtencion, AdmisionEmergencia.IdServicioEgreso);
            await AdmisionEmergencia.SeleccionarPapeletasDetalle(AdmisionEmergencia.IdAtencion, 0);
            $("#modalPapeletasAlta").modal("show");
        });

        $("#btnCerrarInformeEvaluacion").on('click', function () {
            AdmisionEmergencia.IdAtencion = 0;
            AdmisionEmergencia.IdServicioEgreso = 0;
            $("#modalInformeEvaluacion").modal("hide");
        });

        /////////////////////////////////EVENTOS IMPRIMIR FUA/////////////////////////////////////////
        $('#tblAtencionEmer tbody').on('click', '.ImprimeFuaSF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeFua)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarFuaPdf(row.idCuentaAtencion, row.idCuentaAtencion);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblAtencionEmer tbody').on('click', '.ImprimeFuaCF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atencionesEmer.fnGetData(objrow)

            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeFua);
        });

        $('#tblAtencionEmer tbody').on('click', '.FirmarFuaSF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atencionesEmer.fnGetData(objrow)

            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codeFua)               //KHOYOSI            
            if (firma) {
                Utilitario.TipoArchivoFirmar = 'EMER';
                //await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua);
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.codeFua); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.codeFua); }

            }
            Cargando(0);
        });
        ////////////////////////////////////////////////////////////////////////////////////////////////

        ////////////////////////OPCIONES DE FIRMA POR LOTE//////////////////////////////////////////////
        $('#btnFirmaAtencion').on('click', async function () {
            let objrow = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro')
                return false
            }

            if (objrow.idEstadoAtencion == 0) {
                swal({
                    title: 'Atenciones',
                    text: "La cuenta del paciente se encuentra anulado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            if (objrow.idEstadoAtencion == 2) {
                swal({
                    title: 'Atenciones',
                    text: "La cuenta del paciente se encuentra cerrado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra cerrado.");
                return false;
            }

            //if (isEmpty(objrow.fechaEgreso)) {
            //    swal({
            //        title: 'Atenciones',
            //        text: "El paciente aun no ha sido atendido.",
            //        type: 'warning',
            //        allowOutsideClick: false,
            //    }).done();
            //    //alerta(2, "La cuenta del paciente se encuentra cerrado.");
            //    return false;
            //}

            Cargando(1);
            Utilitario.TipoArchivoFirmar = 'EMER-EVA';
            //const paquete = await Utilitario.CrearPaqueteArchivos(objrow.idCuentaAtencion, 0, 0);
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(objrow.idCuentaAtencion, '', "'E-EVA','REC','RF', 'CRF','FUA'");
                if (!isEmpty(paquete)) {
                    //console.log(paquete.data);
                    //await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data)
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data);
                }
            } else if (permisoFirmaDigital == 2) {
                const paquete = await Utilitario.CrearPaqueteArchivos7zip(objrow.idCuentaAtencion, '', "'E-EVA','REC','RF', 'CRF','FUA'");
                if (!isEmpty(paquete)) {
                    //await Utilitario.AbrirServicioFirmaPeruMultiple(paquete.data);
                    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
                }
            }



            Cargando(0);
        })

        $('#btnFirmaLote').on('click', async function () {
            let listAtenciones = oTable_atencionesEmer.api(true).data();
            let cuentasAtencion = [];

            Cargando(1);
            $(listAtenciones).each(async (i, obj) => {
                if (obj.idEstadoAtencion == 1 && obj.cantEvaluacion > 0) {
                    cuentasAtencion.push(obj.idCuentaAtencion);
                }
            })

            Utilitario.TipoArchivoFirmar = 'EMER-EVA';
            //const paquete = await Utilitario.CrearPaqueteArchivos(cuentasAtencion, 0, 0);
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(cuentasAtencion, '', "'E-EVA','REC','RF', 'CRF','FUA'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data)
                }
            } else if (permisoFirmaDigital == 2) {
                const paquete = await Utilitario.CrearPaqueteArchivos7zip(cuentasAtencion, '', "'E-EVA','REC','RF', 'CRF','FUA'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
                }
            }



            Cargando(0);
        });
        ///////////////////////////////////////////////////////////////////////////////////////////////




        /////////////////////////////// EVENTO AGREGAR ADMISION ///////////////////////////////
        $('#btnAgregarAdmision').on('click', async function () {

            RegistroAdmision.opcion = "A";

            $('#modalAdmision').modal('show')

            $('#txtFechaIngresoAdmision').datepicker("setDate", getCurrentDate());

            $('#txtHoraIngresoAdmision').val(getCurrentHour())

            BloquearCampos($('#hdIdTipoServicio').val(), RegistroAdmision.opcion)

            Cargando(0);
        });

        //------------------------------ EVENTO MODIFICAR ADMISION --------------------------------//
        $("#btnModificarAtenciones").on('click', async function () {
            $("#modulo").html("");
            //opcionModificar = false;
            AdmisionEmergencia.accion = "M";
            OrdenMedica.accion = "M";
            RegistroAdmision.opcion = 'M'
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (objrowTb.idEstadoFacturacion == 9) {
                alerta2('warning', 'Atención', 'La atención se encuentra anulada, no se puede modificar.')
                return
            }

            Cargando(1);

            if (!isEmpty(objrowTb)) {

                BloquearCampos($('#hdIdTipoServicio').val(), RegistroAdmision.opcion)

                paciente = await RegistroAdmision.PacientesSeleccionarPorId(objrowTb.idPaciente)

                //----------------------------------------------------------------------------------------------------------------
                await RegistroPaciente.CompletarDatosPaciente(paciente, 0)
                let cargar = await RegistroAdmision.CargarDatosAtencion(objrowTb.idAtencion)

                $('#txtNroDerivacion').prop('disabled', true)
                if (cargar) {
                    $('#modalAdmision').modal('show')
                }
            }

            Cargando(0);
        });

        //----------------------------EVENTO CONSULTAR ADMISION-----------------------------------//
        $("#btnConsultarAtenciones").on('click', async function () {
            $("#modulo").html("");
            //opcionModificar = false;
            AdmisionEmergencia.accion = "C";
            OrdenMedica.accion = "C";
            RegistroAdmision.opcion = 'C'
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (objrowTb.idEstadoFacturacion == 9) {
                alerta2('warning', 'Atención', 'La atención se encuentra anulada, no se puede consultar.')
                return
            }

            Cargando(1);

            if (!isEmpty(objrowTb)) {

                BloquearCampos($('#hdIdTipoServicio').val(), RegistroAdmision.opcion)

                paciente = await RegistroAdmision.PacientesSeleccionarPorId(objrowTb.idPaciente)

                //----------------------------------------------------------------------------------------------------------------
                await RegistroPaciente.CompletarDatosPaciente(paciente, 0)
                await RegistroAdmision.CargarDatosAtencion(objrowTb.idAtencion)

                $('#txtNroDerivacion').prop('disabled', true)

                $('#modalAdmision').modal('show')
            }

            Cargando(0);
        });

        //----------------------------EVENTO CONFIRMAR PAGO ADMISION-----------------------------------//
        $("#btnConfirmarPago").on('click', async function() {

            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('warning', 'Atención', 'Debe seleccionar un registro.');
                return;
            }

            if (objrowTb.idEstadoFacturacion == 9) {
                alerta2('warning', 'Atención', 'La atención se encuentra anulada, no es posible confirmar el pago.');
                return;
            }

            if (objrowTb.generaPago == 2) {
                alerta2('info', 'Atención', 'La atención seleccionada no genera pago, por lo tanto no corresponde marcarla como pagada.');
                return;
            }

            if (objrowTb.generaPago != 1) {
                alerta2('info', 'Atención', 'La atención seleccionada no tiene una condición válida para confirmar pago.');
                return;
            }

            if (objrowTb.idEstadoFacturacion == 4) {
                alerta2('info', 'Atención', 'La cuenta ya se encuentra en estado PAGADO.');
                return;
            }

            const respConfirm = await Swal.fire({
                title: 'Confirmar pago',
                html: '¿Está seguro de cambiar el estado de facturación a <b>PAGADO</b> del paciente <b>' 
                    + objrowTb.paciente + 
                    '</b>, con la cuenta <b>' + objrowTb.idCuentaAtencion + '</b>?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No'
            });

            if (!respConfirm.isConfirmed) {
                return;
            }

            Cargando(1);

            $.ajax({
                method: "POST",
                url: "/AdmisionEmergencia/ConfirmarPagoCuentaAtencion?area=Emergencia",
                data: {
                    idCuentaAtencion: objrowTb.idCuentaAtencion
                },
                dataType: "json",
                success: function(respuesta) {
                    Cargando(0);

                    if (respuesta.session === false) {
                        alerta2('warning', 'Sesión', 'La sesión ha expirado.');
                        return;
                    }

                    if (respuesta.ok) {
                        alerta2('success', 'Correcto', respuesta.mensaje);
                        $("#btnBuscarAtencionesEmergencia").click();
                    } else {
                        alerta2('warning', 'Atención', respuesta.mensaje);
                    }
                },
                error: function() {
                    Cargando(0);
                    alerta2('error', 'Error', 'Ocurrió un error al confirmar el pago.');
                }
            });
        });


        //----------------------------EVENTO ELIMINAR ADMISION-----------------------------------//
        $("#btnEliminarAtenciones").on('click', async function () {
            $("#modulo").html("");
            //opcionModificar = false;
            AdmisionEmergencia.accion = "E";
            RegistroAdmision.opcion = 'E'
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (objrowTb.cantEvaluacion > 0) {
                alerta2('warning', 'Atención', 'La atención tiene evaluaciones, no se puede eliminar.')
                return
            }

            Cargando(1);

            if (!isEmpty(objrowTb)) {

                BloquearCampos($('#hdIdTipoServicio').val(), RegistroAdmision.opcion)

                paciente = await RegistroAdmision.PacientesSeleccionarPorId(objrowTb.idPaciente)

                //----------------------------------------------------------------------------------------------------------------
                await RegistroPaciente.CompletarDatosPaciente(paciente, 0)
                let cargar = await RegistroAdmision.CargarDatosAtencion(objrowTb.idAtencion)

                $('#txtNroDerivacion').prop('disabled', true)
                if (cargar) {
                    $('#modalAdmision').modal('show')
                }
                
            }

            Cargando(0);
        });

        //---------------------------GENERAR BRAZALETE-----------------------------------//
        $("#GenerarBrazalete").on('click', async function () {
            let objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('warning', 'Atención', 'Debe seleccionar un registro.');
                return;
            }

            Brazalete.idPaciente = objrowTb.idPaciente;
            Brazalete.nroHistoria = objrowTb.nroHistoriaClinica;
            Brazalete.apellidos = objrowTb.apellidoPaterno + " " + objrowTb.apellidoMaterno;
            Brazalete.nombres = objrowTb.primerNombre + " " + objrowTb.segundoNombre;
            Brazalete.tipoDocumento = objrowTb.tipoDocumento;
            Brazalete.nroDocumento = objrowTb.nroDocumento;
            Brazalete.fechaNacimiento = objrowTb.fechaNacimiento;
            Brazalete.horaNacimiento = "";
            Brazalete.tipoSexo = objrowTb.idTipoSexo == 1 ? "Masculino" : "Femenino";
            Brazalete.gemelar = "";
            let edad = CalcularEdadAnioMesDia(objrowTb.fechaNacimiento);
            console.log('Fecha nacimiento:', objrowTb.fechaNacimiento);
            console.log('Edad calculada:', edad);
            console.log('Años:', edad.años, 'Meses:', edad.meses, 'Días:', edad.dias);
            if (edad.años > 0) {
                Brazalete.edad = edad.años + ' A';
            } else if (edad.meses > 0) {
                Brazalete.edad = edad.meses + ' M';
            } else if (edad.dias > 0) {
                Brazalete.edad = edad.dias + ' D';
            } else {
                Brazalete.edad = ' - ';
            }
            Brazalete.fichaFamiliar = objrowTb.fichaFamiliar;
            Brazalete.parentesco = objrowTb.parentesco;
            //alert("AQUI ES");
            await Brazalete.GenerarBrazaletePaciente();
            Brazalete.LimpiarBrazalete();

        });
    },

    async GenerarConsentimientoProcesosQxVista(idCuentaAtencion, idAtencion, idServicio, eval) {
        Cargando(1);
        const formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);
        formData.append('idAtencion', idAtencion);
        formData.append('idServicio', idServicio);
        formData.append('eval', eval > 0 ? eval : 1);

        const url = "/Emergencia/GenerarConsentimientoProcesosQxPdf?area=Emergencia";
        const request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = function () {
            Cargando(0);

            if (request.status === 200 && request.response && request.response.size > 0) {
                const urlBlob = window.URL.createObjectURL(request.response);
                AbrirVisorDocumentoPersonalizado(urlBlob, "Consentimiento de Procesos Qx");
                return;
            }

            alerta2('warning', 'Consentimiento', 'No fue posible generar el documento.');
        };

        request.onerror = function () {
            Cargando(0);
            alerta2('error', 'Consentimiento', 'Ocurrió un error al generar el documento.');
        };

        request.send(formData);
    },

    async GenerarAutorizacionExamenesEspecializadosVista(idCuentaAtencion, idAtencion, idServicio, eval) {
        Cargando(1);
        const formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);
        formData.append('idAtencion', idAtencion);
        formData.append('idServicio', idServicio);
        formData.append('eval', eval > 0 ? eval : 1);

        const url = "/Emergencia/GenerarAutorizacionExamenesEspecializadosPdf?area=Emergencia";
        const request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = function () {
            Cargando(0);

            if (request.status === 200 && request.response && request.response.size > 0) {
                const urlBlob = window.URL.createObjectURL(request.response);
                AbrirVisorDocumentoPersonalizado(urlBlob, "Autorización de Exámenes Especializados");
                return;
            }

            alerta2('warning', 'Autorización', 'No fue posible generar el documento.');
        };

        request.onerror = function () {
            Cargando(0);
            alerta2('error', 'Autorización', 'Ocurrió un error al generar el documento.');
        };

        request.send(formData);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// VALIDACIONES
    /// </summary>
    /// Lista de metodos que se encargan de realizar validaciones
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ValidaCargaModulo() {
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            //alerta(2, 'Seleccione un registro por favor.');
            alerta2('info', '', 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            //alerta(2, 'La cuenta esta cerrada.');
            alerta2('warning', '', 'La cuenta se encuentra cerrada.');
            if (AdmisionEmergencia.accion == 'M') {
                return false;
            }

            if (AdmisionEmergencia.accion == 'AM') {
                return true;
            }
        }

        if (objrowTb.fechaEgreso != '' && objrowTb.fechaEgreso != null) {
            //alerta(2, 'El paciente tiene alta médica.');
            alerta2('warning', '', 'El paciente tiene alta médica.');
            if (AdmisionEmergencia.accion == 'M') {
                return false;
            }

            if (AdmisionEmergencia.accion == 'AM') {
                return true;
            }
        }

        if (objrowTb.esObservacionEmergencia) {
            //if (isEmpty(objrowTb.idCamaIngreso)) {
            //    alerta2('warning', '', 'El paciente aún no se le asignado cama de ingreso.<br>Por favor realice la recepción.');
            //    return false;
            //}

            if (objrowTb.llegoAlServicio == 0) {
                alerta2('warning', '', 'El paciente aún no llega al servicio.<br>Por favor realice la recepción.');
                return false;
            }
        }

        //if (objrowTb.esObservacionEmergencia) {
        //    if (objrowTb.llegoAlServicio == 0) {
        //        swal({
        //            title: 'Transferencia',
        //            text: 'Debe confirmar que el paciente <strong style="font-weight: 900;text-decoration: underline;">Llegó al Servicio Transferido</strong>.<br>Cama Nro: ' + objrowTb.codigoCama + ' <br>¿Esta seguro de confirmar la llegada?',
        //            type: 'warning',
        //            showCancelButton: true,
        //            confirmButtonColor: '#4fb7fe',
        //            cancelButtonColor: '#6c6c6c',
        //            confirmButtonText: 'SÍ LLEGÓ',
        //            cancelButtonText: 'CANCELAR',
        //        }).then(async function () {
        //            const llegada = await Transferencias.ConfirmarLlegadaAlServicio(objrowTb.idEstanciaHospitalariaActual);
        //            if (llegada) {
        //                AdmisionEmergencia.ListarAtenciones(1);
        //                ReposicionarVista();
        //            }
        //        }, function (dimiss) {
        //            AdmisionEmergencia.ListarAtenciones(1);
        //            ReposicionarVista();
        //        });

        //        return false;
        //    }
        //}

        return true;
    },

    ValidaTipoModulo() {
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        if (objrowTb.tipoModuloEmergencia != "ginecobstetra" && objrowTb.tipoModuloEmergencia != "neonatal" && objrowTb.tipoModuloEmergencia != "especialidades" && objrowTb.tipoModuloEmergencia != "trabajador") {
            //alerta(2, 'No existe un módulo para evaluar en este servicio.');
            alerta2('warning', '', 'No existe un módulo para evaluar en este servicio.')
            return false;
        } else {
            if ($('#hdUtilizaValidaciones').val() == 0) { // accede a las validaciones de emergencia neonatal
                if (objrowTb.tipoModuloEmergencia == "neonatal") {
                    if (objrowTb.tipoPaciente != "Neonatologia") {
                        //alerta(2, 'El paciente no es Neonato. No es posible realizar la evaluación.');
                        alerta2('warning', '', 'El paciente no es Neonato. No es posible realizar la evaluación.')
                        return false;
                    }
                }
            }

        }

        return true;
    },

    async ValidaAbrirModulo() {
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        await AdmisionEmergencia.CargarModulo(objrowTb.tipoModuloEmergencia);

        if (objrowTb.tipoModuloEmergencia == "ginecobstetra") {
            await EvaluacionEmergencia.IniciarModulo();
        }
        if (objrowTb.tipoModuloEmergencia == "neonatal") {
            await EvaluacionNeonatal.IniciarModulo();
        }
        if (objrowTb.tipoModuloEmergencia == "especialidades") {
            await EvaluacionEspecialidad.IniciarModulo();
        }
        if (objrowTb.tipoModuloEmergencia == "trabajador") {
            await EvaluacionEspecialidad.IniciarModulo();
            $("#ContentSignosSintomas").hide();
        }


        BusquedaDiagnosticos.IniciarScript();
        /////////////DIAGNOSTICOS//////////////
        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
        ///////////////////////////////////////

        /////////ORDENES MEDICAS////////////////
        OrdenMedica.IniciarScript();
        ////////////////////////////////////////

        /////////RESULTADOS LABORATORIO////////////////
        Resultados.IniciarScript();
        ////////////////////////////////////////

        ConsumoServicio.IniciarScript();
        Ordenes.IniciarScript();
        Ordenes.IniciarData();

        MostrarAreaRegistro();


    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    LimpiarModal() {
        //$('.campo').val("");
        $("#modalEvaluacionNeonatal input").val("");
        $("#modalEvaluacionNeonatal textarea").val("");
        //$("#modalRef select").html("");
        $('#modalEvaluacionNeonatal .chzn-select').chosen().trigger("chosen:updated");

        $("#modalEvaluacionNeonatal input").val("");
        $("#modalEvaluacionNeonatal textarea").val("");
        // $("#modalConRef select").html("");
        $('#modalEvaluacionNeonatal .chzn-select').chosen().trigger("chosen:updated");
    },

    DeshabilitarModal() {
        $(".campo").attr('disabled', 'disabled');
    },

    HabilitarModal() {
        $(".campo").removeAttr('disabled', 'disabled');
    },

    AbrirModal() {
        $('#modalEvaluacionNeonatal').modal('show');
    },


    /*===================================ADMISION EMERGENCIA==========================*/
    async Accion(tipo) {
        $("#modulo").html("");
        opcionModificar = false;
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            //alerta(2, 'Seleccione un registro por favor.');
            alerta2('warning', '', 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            //alerta(2, 'La cuenta esta cerrada.');
            alerta2('warning', '', 'La cuenta se encuentra cerrada.');
            if (tipo == 'M') {
                return false;
            }
        }

        if (objrowTb.fechaEgreso != '' && objrowTb.fechaEgreso != null) {
            //alerta(2, 'El paciente tiene alta médica.');
            alerta2('warning', '', 'El paciente tiene alta médica.');
            if (tipo == 'M') {
                return false;
            }
        }

        if (tipo != 'A') {
            if (objrowTb.idServicioIngreso == 6) {
                if (objrowTb.tipoPaciente == "Neonatologia") {
                    Cargando(1);
                    Variables.Cargar(objrowTb);
                    await this.CargarModulo('neonatal');
                    await EvaluacionNeonatal.IniciarScript();

                    BusquedaDiagnosticos.IniciarScript();
                    /////////////DIAGNOSTICOS//////////////
                    Diagnosticos.PanelDx = '#PanelDiagnostico ';
                    Diagnosticos.IniciarScript();
                    ///////////////////////////////////////
                    ConsumoServicio.IniciarScript();
                    Ordenes.IniciarScript();
                    Cargando(0);
                    if (tipo == 'C') { EvaluacionNeonatal.ConsultarEvaluacionNeonatal(); }
                    if (tipo == 'M') { EvaluacionNeonatal.ModificarEvaluacionNeonatal(); }
                } else {
                    if ($('#hdUtilizaValidaciones').val() == 0) { // accede a las validaciones de emergencia neonatal
                        //alerta(2, 'El paciente no es Neonato.');
                        alerta2('warning', '', 'El paciente no es Neonato.');
                        return false;
                    }
                }
            } else {
                Cargando(1);
                Variables.Cargar(objrowTb);
                await this.CargarModulo('emergencia');
                await EvaluacionEmergencia.IniciarScript();

                BusquedaDiagnosticos.IniciarScript();
                /////////////DIAGNOSTICOS//////////////
                Diagnosticos.PanelDx = '#PanelDiagnostico ';
                Diagnosticos.IniciarScript();
                ///////////////////////////////////////
                ConsumoServicio.IniciarScript();
                Ordenes.IniciarScript();
                Cargando(0);
                if (tipo == 'C') { EvaluacionEmergencia.ConsultarEvaluacionNeonatal(); }
                if (tipo == 'M') { EvaluacionEmergencia.ModificarEvaluacionNeonatal(); }
            }

        }

        if (tipo == 'A') {          //TIPO ALTA MEDICA
            Cargando(1);
            Variables.Cargar(objrowTb);
            await Utilitario.CargarModuloAlta();
            await AltaMedica.IniciarScript();
            await AltaMedica.ModificarAltaMedica();



            Cargando(0);
        }
    },

    ModificarEvaluacion() {
        //console.log("ENTROOOOO");       
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        //console.log(objrowTb);
        this.LimpiarModal();
        this.HabilitarModal();
        this.AbrirModal();
        //this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);

        $("#btnGuardar").show();
    },

    ListarAtenciones(tipoBusqueda) {
        Cargando(1);
        //console.log("F1");
        oTable_atencionesEmer.fnClearTable();
        var midata = new FormData();
        var fecha = $('#txtFechaAtencionBuscar').val();
        var fechaFin = $('#txtFechaAtencionFinBuscar').val(); // JDELGADOPM
        if ($('#txtNroCuentaBuscar').val() != '' || $('#txtNroDniBuscar').val() != '' || $('#txtNroHistoriaBuscar').val() != '' || $('#txtApPaternoBuscar').val() != '') {
            fecha = '';
            fechaFin = ''; // JDELGADOPM
        }

        midata.append('idCuenta', $('#txtNroCuentaBuscar').val());
        midata.append('dni', $('#txtNroDniBuscar').val());
        midata.append('historia', $('#txtNroHistoriaBuscar').val());
        midata.append('apPaterno', $('#txtApPaternoBuscar').val());
        midata.append('fecha', fecha);
        midata.append('fechaFin', fechaFin); // JDELGADOPM
        midata.append('idServicio', $('#cboServicioEmergenciaBuscar').val());
        midata.append('tipoBusqueda', tipoBusqueda); // KHOYOSI
        var dataAtenciones = {};

        $.ajax({
            method: "POST",
            url: "/AdmisionEmergencia/ListarAtencionesEmergencia?area=Emergencia",
            //url: "/AdmisionEmergencia/BuscarAtencionesEmergenciaPorFiltro?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                Cargando(0);
                //console.log(datos.lsAtenciones.table)
                if (datos.session) {
                    if (datos.lsAtenciones.table.length > 0) {
                        dataAtenciones = datos.lsAtenciones.table;
                        oTable_atencionesEmer.fnAddData(dataAtenciones);
                    }
                    else {
                        dataAtenciones = {};
                    }
                }
                else {
                    //alert("La sesion ya expiro se volvera a recargar la pagina.")
                    alerta(2, "La sesion ya expiro, por favor inicie sesión nuevamente.");
                    $("#modalLogin").modal('show');
                    //location.reload();
                }
            }
        })
    },

    ///////////////KHOYOSI/////////////////////////////////////////////
    ObtenerIdUsuarioSesion() {
        var idUser = 0;
        $.ajax({
            method: "POST",
            url: "/Utilitario/ObtenerIdUsuarioLogeado?area=Comun",
            //data: midata,
            //dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                idUser = datos;
            },
            error: function (msg) {
                alerta("ERROR", "Error aal obtener Id del Medico!", "2");
            }
        });

        return idUser;
    },
    /////////////////////////////////////////////////////////////////////



    /*===============================SECCION ADMISION EMERGENCIA==============================================*/
    ListarServiciosAdmisionEmergencia() {
        var midata = new FormData();
        midata.append('filtro', ' (2,4) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre');
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/AdmisionEmergencia/DevuelveServiciosDelHospitalFiltro?area=Emergencia",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {
                //console.log(datos.lsServicios)
                Cargando(0);
                $('#cboServicioEmergenciaBuscar').empty();
                $(datos.lsServicios.table).each(function (i, obj) {
                    console.log(obj);
                    /*$('#cboServicioEmergenciaBuscar').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');*/
                    $('#cboServicioEmergenciaBuscar').append('<option data-idespecialidad="' + obj.idEspecialidad + '" value="' + obj.idServicio + '">' + obj.dservicio + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                Cargando(0);
                alerta(3, "Error listar servicios!" + JSON.stringify(msg));
                //                    Cargando(0);                
                //setTimeout(function () {
                //    Cargando(0);
                //    //                    Cargando(0);
                //    alerta("ERROR", "Error listar servicios!", "2");
                //}, 900)
            }
        });
    },


    async CargarModulo(modulo) {
        var midata = new FormData();
        midata.append('modulo', modulo);
        $("#ModuloAlta").html("");
        $("#modulo").html("");

        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AdmisionEmergencia/CargarModulo?area=Emergencia",
                    data: midata,
                    dataType: "HTML",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            $("#modulo").html(datos);
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            alerta(3, JSON.stringify(error));
        }
    },

    CerrarModulo() {
        $("#modulo").html("");
    },
    /*===========================================================================================================*/


    /// <summary>
    /// LLENAR COMBOS
    /// </summary>
    /// Metodos que llenan combos.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async ListarTiposGravedadAtencion() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarTiposGravedadAtencion?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboPrioridad').empty();
            $(datos.lsTiposGravedad.table).each(function (i, obj) {
                $('#cboPrioridad').append('<option  value="' + obj.idTipoGravedad + '">' + obj.descripcion + '</option>');
            });
            $('#cboPrioridad').val(0);

            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarTiposServiciosMGP() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarTiposServiciosMGP?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboTipoPaciente').empty();
            $(datos.lsTiposServiciosMGP.table).each(function (i, obj) {
                $('#cboTipoPaciente').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>');
            });
            $('#cboTipoPaciente').val(0);

            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarTiposPaciente() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarTiposServiciosMGP?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboTipoPaciente').empty();
            $(datos.lsTiposServiciosMGP.table).each(function (i, obj) {
                if (obj.idServicio != 3) {
                    $('#cboTipoPaciente').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>');
                }
            });
            $('#cboTipoPaciente').val(0);

            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarOrigenAtencionEmergencia() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarOrigenAtencionEmergencia?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboOrigenPaciente').empty();
            $(datos.lsOrigenAtencionEmer.table).each(function (i, obj) {
                $('#cboOrigenPaciente').append('<option  value="' + obj.idOrigenAtencion + '">' + obj.descripcionLarga + '</option>');
            });
            $('#cboOrigenPaciente').val(0);

            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarTiposEmbarazo() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaTipoDeEmbarazo?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            $('#cboTipoEmbrazo').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboTipoEmbrazo').append('<option  value="' + obj.id + '">' + obj.nombre + '</option>');
            });

            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta(3, error);
        }
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////SELECCIONA EVALUACIONES PARA LA TABLA DE IMPRESION DE INFORMES////////////////////
    //async SeleccionarEvaluaciones() {

    //},

    async SeleccionarEvaluacionDetalle(idAtencion, idServicio) {

        try {
            let datos;
            oTable_EvaInfEmer.fnClearTable();
            var midata = new FormData();
            midata.append('idAtencion', idAtencion);
            midata.append('idServicio', idServicio);
            var dataEvaluacionDetalle = [];

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/SeleccionarEvaluacionDetalle?area=Emergencia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    dataEvaluacionDetalle = datos.respuesta.table;
                    oTable_EvaInfEmer.fnAddData(dataEvaluacionDetalle);
                }
                else {
                    dataEvaluacionDetalle = [];
                }

            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
        }

        return dataEvaluacionDetalle;

        //Cargando(1);
        //oTable_EvaInfEmer.fnClearTable();
        //var midata = new FormData();
        //midata.append('idAtencion', idAtencion);
        //midata.append('idServicio', idServicio);
        //var dataEvaluacionDetalle = [];

        //$.ajax({
        //    method: "POST",
        //    url: "/EvaluacionEmergencia/SeleccionarEvaluacionDetalle?area=Emergencia",
        //    //contentType: "application/json; charset=utf-8",
        //    data: midata,
        //    dataType: "json",
        //    processData: false,
        //    contentType: false,
        //    async: false,
        //    success: function (datos) {
        //        Cargando(0);
        //        if (datos.session) {
        //            if (datos.respuesta.table.length > 0) {
        //                dataEvaluacionDetalle = datos.respuesta.table;
        //                oTable_EvaInfEmer.fnAddData(dataEvaluacionDetalle);
        //            }
        //            else {
        //                dataEvaluacionDetalle = [];
        //            }

        //        }
        //        else {
        //            alert("La sesion ya expiro se volvera a recargar la pagina")
        //            location.reload();
        //        }
        //    }
        //})
        //console.log(dataReferencia);

    },

    async SeleccionarPapeletasDetalle(idAtencion, idServicio) {

        try {
            let datos;
            oTable_EvaInfPapAlta.fnClearTable();
            var midata = new FormData();
            midata.append('idAtencion', idAtencion);
            midata.append('idServicio', idServicio);
            var dataEvaluacionDetalle = [];

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/SeleccionarPapeletasDetalle?area=Emergencia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    dataEvaluacionDetalle = datos.respuesta.table;
                    oTable_EvaInfPapAlta.fnAddData(dataEvaluacionDetalle);
                }
                else {
                    dataEvaluacionDetalle = [];
                }

            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
        }

        return dataEvaluacionDetalle;
               

    },

    //////////////ADMISION EMERGENCIA////////////////////
    limpiarRecetas() {
        idRecetaRX = 0;
        idRecetaPatCli = 0;
        idRecetaAnatPat = 0;
        idRecetaBs = 0;
        idRecetaEcoGene = 0;
        idRecetaEcoObs = 0;
        idRecetaFarm = 0;


        $("#ifrmRecetaFarm").contents().find("body").html('');
        $("#ifrmRecetaRx").contents().find("body").html('');
        $("#ifrmRecetaEcoObs").contents().find("body").html('');
        $("#ifrmRecetaEcoGene").contents().find("body").html('');
        $("#ifrmRecetaAnaPatolg").contents().find("body").html('');
        $("#ifrmRecetaPatoClini").contents().find("body").html('');
        $("#ifrmRecetaBs").contents().find("body").html('');

    },
    ///////////////////////////////////////////////////////

    initDatables() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '3%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '10%',
                //    targets: 1,
                //    data: "apellidoPaterno",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    width: '10%',
                //    targets: 2,
                //    data: "apellidoMaterno",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    width: '10%',
                //    targets: 3,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //        $(td).html((rowData.primerNombre == null ? '' : rowData.primerNombre.toUpperCase()) + " " + (rowData.segundoNombre == null ? '' : rowData.segundoNombre.toUpperCase()));
                //    }
                //},
                {
                    width: '15%',
                    targets: 1,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //$(td).html(rowData.apellidoPaterno.toUpperCase() + ' ' + rowData.apellidoMaterno.toUpperCase() + ' ' + rowData.primerNombre.toUpperCase() + ' ' + rowData.segundoNombre.toUpperCase());
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        let edad = CalcularEdadAnioMesDia(rowData.fechaNacimiento);
                        //$(td).html(FormatearFecha(rowData.fecNacim));     //reemplazado por edad
                        if (edad.años > 0) {
                            $(td).html(edad.años + ' A');
                        } else if (edad.meses > 0) {
                            $(td).html(edad.meses + ' M');
                        } else if (edad.dias > 0) {
                            $(td).html(edad.dias + ' D');
                        }
                        //$(td).html('--');
                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "tipoPaciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.tipoGravedad == "Prioridad I" && rowData.cantEvaluacion == 0 && isEmpty(rowData.fechaEgreso) == true) {
                            $(td).css("background-color", "red");
                            $(td).css("color", "white");
                        }
                        if (rowData.tipoGravedad == "Prioridad II" && rowData.cantEvaluacion == 0 && isEmpty(rowData.fechaEgreso) == true) {
                            $(td).css("background-color", "orange");
                            $(td).css("color", "darkslategray");
                        }
                        if (rowData.tipoGravedad == "Prioridad III" && rowData.cantEvaluacion == 0 && isEmpty(rowData.fechaEgreso) == true) {
                            $(td).css("background-color", "yellow");
                            $(td).css("color", "darkslategray");
                        }
                        if (rowData.tipoGravedad == "Prioridad IV" && rowData.cantEvaluacion == 0 && isEmpty(rowData.fechaEgreso) == true) {
                            $(td).css("background-color", "green");
                            $(td).css("color", "white");
                        }

                        $(td).html("<strong>" + rowData.tipoGravedad + "</strong>");
                    }
                },
                {
                    width: '6%',
                    targets: 6,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.fechaIngreso + ' ' + rowData.horaIngreso);
                    }
                },
                {
                    width: '6%',
                    targets: 7,
                    data: 'fechaPrimeraEvaluacion',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //console.log(rowData.fechaEgreso);
                        $(td).html(isNull(rowData.fechaEgreso, '') + ' ' + isNull(rowData.horaEgreso, ''));
                    }
                },
                {
                    width: '6%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(isNull(rowData.fechaEgresoAdministrativo, ''));
                    }
                },
                //{
                //    width: '6%',
                //    targets: 8,
                //    data: "horaIngreso",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: '10%',
                    targets: 10,
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 11,
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 12,
                    data: null,
                    createdCell: function(td, cellData, rowData, row, col) {
                        $(td).css({
                            'text-align': 'center',
                            'vertical-align': 'middle'
                        });

                        let html = '';

                        if (rowData.generaPago == 1) {
                            if (rowData.idEstadoFacturacion == 4) {
                                html = '<span class="chip-estado-min chip-pagado-min">Pagado</span>';
                            } else {
                                html = '<span class="chip-estado-min chip-genera-pago-min">Genera Pago</span>';
                            }
                        }

                        $(td).html(html);
                    }
                },
                {
                    width: '5%',
                    targets: 13,
                    data: "cantEvaluacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                    }
                },
                {
                    width: '8%',
                    targets: 14,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')

                        if (rowData.cantFirmas > 0) {
                            var btnRuta = "";
                            btnRuta = ' <button class="btnInformeEvaluacion btn btn-sm btn-pink glow_button" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            $(td).html(btnRuta);

                            var btnRutaPapeletas = "";
                            btnRuta += ' <button class="btnPapeletasAlta btn btn-sm btn-danger glow_button" data-toggle="tooltip"><i class="fa fa-print"></i> </button> ';
                            $(td).html(btnRuta);

                        } else {
                            $(td).html('');
                        }

                        //if (!isEmpty(rowData.fechaRegistroEvaluacion)) {
                        //    $(td).parent().css('color', '#347dff');
                        //    $(td).parent().css('font-weight', 'bold');
                        //}

                        if (rowData.cantEvaluacion > 0) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.idEstadoFacturacion == 12) {
                            $(td).parent().css('color', '#8e24aa');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.conAlta == 1) {
                            $(td).parent().css('color', '#00ad15');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (rowData.idEstadoFacturacion == 9) {
                            $(td).parent().css('color', '#f60000');
                            $(td).parent().css('font-weight', 'bold');
                        }



                    }
                },
                ///////////////////////////FUA//////////////////////////////////

                //{
                //    width: '1%',
                //    targets: 15,
                //    data: null,
                //    hide:true,

                //    createdCell: async function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        if (!isEmpty(rowData.fechaEgreso)) {

                //            var btnRuta = "";
                //            var btnImprime = "";
                //            var btnImprimeSinF = "";

                //            if (rowData.idCuentaFua > 0) {
                //                btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                //                if (AdmisionEmergencia.permisoFua == '1' && rowData.codeFua != '0') {
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
                //},
                ///////////////////////////////////////////////////////////////////////////
                //////////////////////////KHOYOSI (REFCON)///////////////////////////////////////                
                //{
                //    width: '8%',
                //    targets: 16,
                //    data: null,
                //    hide: true,
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
                //////////////////////////////RMOREANO PAPELETA DE EGRESO//////////////////////////////////////
                {
                    width: '8%',                   
                    data: null,
                    targets: 15,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.codePapeletaEgreso != null && rowData.conAlta == 1) {
                            let btnImprime = "";
                            let btnImprimeSinF = "";
                            if (rowData.statusFirmaPapeletaEgreso == 1) {
                                btnImprime = ' <button class="ImprimirpaPapeletaEgreso btn btn-sm btn-deep-orange glow_button"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnImprime = '<button class="ImprimirPapeletaEgresoSF btn btn-sm btn btn-sm btn-info glow_button"><i class="fa fa-pencil"></i> </button> <button class="ImprimirpaPapeletaEgreso btn btn-sm btn-deep-orange  glow_button"><i class="fa fa-print"></i> </button> ';
                               
                            }
                            $(td).html(btnImprime);
                        } else {
                            $(td).html('');
                        }
                    }
                },
                {
                    width: '8%',
                    data: null,
                    targets: 16,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        
                        if (rowData.codeDescansoMed !=  null && rowData.tieneDescansoMed == 1) {
                            let btnImprime = "";
                            let btnImprimeSinF = "";
                                    
                            if (rowData.statusFirmaDescansoMed == 1) {
                                btnImprime = ' <button class="ImprimirpaDescansoMedico btn btn-sm btn-deep-orange glow_button"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnImprime = '<button class="ImprimirpaDescansoMedicoSF btn btn-sm btn btn-sm btn-info glow_button"><i class="fa fa-pencil"></i> </button> <button class="ImprimirpaDescansoMedico btn btn-sm btn-deep-orange  glow_button"><i class="fa fa-print"></i> </button> ';

                            }
                            $(td).html(btnImprime);
                        } else {
                            $(td).html('');
                        }
                    }
                },
            ]

        }

        var tableWrapper = $('#tblAtencionEmer'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atencionesEmer = $("#tblAtencionEmer").dataTable(parms);


    },

    // <summary>
    // DATATABLES
    // </summary>
    // INICIALIZA DATA TABLE DE INFORME DE EVALUACIONES
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    IniciarDataTablesInformeEvaluacion() {
        var parms = {
            scrollY: "200px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: "10%",
                    targets: 0,
                    data: "idNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        $(td).html("<span data-evaluacion=" + rowData.idNumero + ">" + rowData.idNumero + "</span>");
                    }
                },
                {
                    width: "60%",
                    targets: 1,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "30%",
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.code != '') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirEvalCF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarEvalSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                btnImprimeSinF = '<button class="ImprimirEvalSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblInformeEvaluacionesEmergencia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_EvaInfEmer = $("#tblInformeEvaluacionesEmergencia").dataTable(parms);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    IniciarDataTablesPapeletasAlta() {
        var parms = {
            scrollY: "200px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: "10%",
                    targets: 0,
                    data: "id",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        $(td).html("<span data-evaluacion=" + rowData.id + ">" + rowData.id + "</span>");
                    }
                },
                {
                    width: "60%",
                    targets: 1,
                    data: "tipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        console.log(rowData,row);

                    }
                },
                {
                    width: "30%",
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        
                        if (rowData.code != '') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            /*if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirEvalCF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarEvalSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                btnImprimeSinF = '<button class="ImprimirEvalSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            }*/
                            btnImprimeSinF = '<button class="ImprimirPapSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblInforPapeletasAlta'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_EvaInfPapAlta = $("#tblInforPapeletasAlta").dataTable(parms);
    },

    /*=========================KHOYOSI========================*/
    ImprimirEvaEmerSF(rutaArchivo) {
        $('#ifrmReporte').attr('src', rutaArchivo);
        var myIframe = document.getElementById("ifrmReporte").contentWindow;
        myIframe.focus();
        myIframe.print();
    },
    ImprimirEvaEmerCF(idCuentaAtencion, idRegistro, code, idDoc, tipo) {
        //var objrow = oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();

        var url = "/Referencia/statusAndDownload?area=Comun&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url);
        request.onload = function () {

            var url = window.URL.createObjectURL(this.response);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            //a.download = this.response.name || "CE-" + $.now()
            a.download = "REFCON-" + idCuentaAtencion + "-" + $.now()
            a.click();

            ListaAtencionesCE();
        }
        request.send();
    }
    /*========================================================*/
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

}

//////////////////////KHOYOSI////////////////////////////////
var imprimirDocumentoConFirma = async function (idCuentaAtencion, code, idDoc, tipo) {
    //var objrow = oTable_atenciones.api(true).row('.selected').data();
    //var midata = new FormData();
    Cargando(1);
    var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
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
            a.download = "EMERNEOEVA-" + idCuentaAtencion + "-" + $.now()

            AbrirVisorDocumento(url, 1);
            AdmisionEmergencia.ListarAtenciones(1);
        } else {
            alerta(2, "El documento aún no está firmado digitalmente.")
        }
        Cargando(0);
    }
    request.send();
}

var imprimirDocumentoConFirma2 = function (idCuentaAtencion, code, idDoc, tipo) {
    //var objrow = oTable_atenciones.api(true).row('.selected').data();
    //var midata = new FormData();
    Cargando(1);
    var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
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
            a.download = "EMERNEOEVA-" + idCuentaAtencion + "-" + $.now()

            AbrirVisorDocumento(url, 1);
        } else {
            alerta(2, "El documento aún no está firmado digitalmente.")
        }
        Cargando(0);
    }
    request.send();
}
//////////////////////////////////////////////////////////////////

//////////////ADMISION DE EMERGENCIA//////////////////////
function valida_hora(valor) {
    //que no existan elementos sin escribir
    if (valor.indexOf(":") != -1) {
        var hora = valor.split(":")[0];
        if (parseInt(hora) > 23) {
            $("#HoraInicioAtencion").val("");
            alerta(2, "Hora incorrecta");

        }//end if
    }//end if
}//end function

function asigna_FechaHoraAtencion(f) {
    //('#cboFechaInicioAtencion').empty();
    // cargo por defecto la hora
    var dt = new Date();
    var time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes());
    //var date = ((dt.getDay() + 1) < 10 ? ("0" + (dt.getDay() + 1)) : (dt.getDay() + 1)) + "/" + ((dt.getMonth() + 1) < 10 ? ("0" + (dt.getMonth() + 1)) : (dt.getMonth() + 1)) + "/" + dt.getFullYear();

    if (f == null) {
        var fecha = new Date();
        var fecha2 = new Date();
    } else {
        var fecha = new Date(f);
        var fecha2 = new Date(f);
    }


    var dia = fecha.getDate();
    var mes = parseInt(fecha.getMonth()) + 1;
    var yyy = fecha.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    fechaP = yyy + "-" + mes + "-" + dia

    $('#HoraInicioAtencion').val(time);
    $('#FechaInicioAtencion').val(fechaP);
    $('#FechaInicioAtencion').attr("max", fechaP);

    //$('#cboFechaInicioAtencion').append('<option  value="' + fechaP + '">' + fechaP + '</option>');


    fecha2.setDate(fecha.getDate() - 1);
    dia = fecha2.getDate();
    mes = parseInt(fecha2.getMonth()) + 1;
    yyy = fecha2.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    fechaP = yyy + "-" + mes + "-" + dia

    $('#FechaInicioAtencion').attr("min", fechaP);
}

//////////////////////////////////////////////////////////

function BloquearCampos(idTipoServicio, opcion) {

    if (idTipoServicio == 2) {
        $('#btnImprimeHojaFiliacionConsultorio').html('<i class="fa-solid fa-print"></i> <br> Hist Clinica Emergencia')
    }

    if (idTipoServicio == 3) {
        $('#btnImprimeHojaFiliacionConsultorio').html('<i class="fa-solid fa-print"></i> <br> Hist Clinica Hosp')
    }

    $('#contCama').hide()

    $('.BusquedaPacienteContenedor input').prop('disabled', false)
    $('.BusquedaPacienteContenedor select').prop('disabled', false)
    $('.BusquedaPacienteContenedor button').prop('disabled', false)

    $('#tabPaciente input').prop('disabled', false)
    $('#tabPaciente select').prop('disabled', false)
    $('#tabPaciente button').prop('disabled', false)

    $('#tabAtencion input').prop('disabled', false)
    $('#tabAtencion select').prop('disabled', false)
    $('#tabAtencion button').prop('disabled', false)

    $('#contPacienteProviene').hide()
    $('#contPacienteProviene button').prop('disabled', false)

    $("#txtUsuarioCrea, #txtUsuarioModifica, #cboTipoHistoriaPaciente, #txtNroHistoriaPaciente, #txtFechaCreacionPaciente, #txtIdPaciente").prop('disabled', true)
    $("#cboTipoServicioAdmision, #txtMedicoIngreso, #txtServicioIngresoAdmision, #txtNroCuentaPaciente, #txtOrdenPagoPaciente, #txtidAtencion").prop('disabled', true)

    $('#btnImprimeHojaFiliacionConsultorio').prop('disabled', false)
    $('#btnImprimirTicket').prop('disabled', false)
    $('#ImprimeFormatoFiliacionArchivoClinico').prop('disabled', false)

    $('#btnRegistrarAdmision').show()

    if (idTipoServicio == '3') {
        $('#contPacienteProviene').show()
    }
    if (opcion == 'A') {

        $('#btnImprimeHojaFiliacionConsultorio').prop('disabled', true)
        $('#btnImprimirTicket').prop('disabled', true)
        $('#ImprimeFormatoFiliacionArchivoClinico').prop('disabled', true)

        if (idTipoServicio == 3) {

            $('.BusquedaPacienteContenedor input').prop('disabled', true)
            $('.BusquedaPacienteContenedor select').prop('disabled', true)
            $('.BusquedaPacienteContenedor button').prop('disabled', true)
        }


    } else if (opcion == 'M') {
        $('.BusquedaPacienteContenedor input').prop('disabled', true)
        $('.BusquedaPacienteContenedor select').prop('disabled', true)
        $('.BusquedaPacienteContenedor button').prop('disabled', true)

        $('#contPacienteProviene button').prop('disabled', true)
    } else if (opcion == 'C') {
        $('#tabPaciente input').prop('disabled', true)
        $('#tabPaciente select').prop('disabled', true)
        $('#tabPaciente button').prop('disabled', true)

        $('#tabAtencion input').prop('disabled', true)
        $('#tabAtencion select').prop('disabled', true)
        $('#tabAtencion button').prop('disabled', true)

        $('#contPacienteProviene button').prop('disabled', true)

        $('#btnRegistrarAdmision').hide()
    } else if (opcion == 'E') {
        $('#tabPaciente input').prop('disabled', true)
        $('#tabPaciente select').prop('disabled', true)
        $('#tabPaciente button').prop('disabled', true)

        $('#tabAtencion input').prop('disabled', true)
        $('#tabAtencion select').prop('disabled', true)
        $('#tabAtencion button').prop('disabled', true)

        $('#contPacienteProviene button').prop('disabled', true)
        //$('#btnRegistrarAdmision').text('Eliminar')
    }


    //.not("#txtUsuarioCrea, #txtUsuarioModifica, #cboTipoHistoriaPaciente, #txtNroHistoriaPaciente, #txtFechaCreacionPaciente, #txtIdPaciente")

    $('.chzn-select').chosen().trigger("chosen:updated");
}

$(document).ready(function () {
    AdmisionEmergencia.plugins();
    AdmisionEmergencia.CargaInicial();
    //AdmisionEmergencia.IniciarCombos();    

    AdmisionEmergencia.initDatables();
    AdmisionEmergencia.IniciarDataTablesInformeEvaluacion();
    AdmisionEmergencia.IniciarDataTablesPapeletasAlta();

    AdmisionEmergencia.Eventos();

    AdmisionEmergencia.ListarServiciosAdmisionEmergencia();

    EstablecimientosSalud.IniciarScript();

    Ordenes.tipoServicio = 'EMER';

    PermisoGeneral.ValidarServicioFirmaDigital();

    $("#cboServicioEmergenciaBuscar").val(6);
    $('.chzn-select').chosen().trigger("chosen:updated");
});

