var EvaluacionEmergencia = {
    nuevaEvaluacion: false,
    modificaEvaluacion: false,
    modificaCabecera: false,
    idMedicoPrimeraEvaluacion: 0,
    idProCabecera: 0,
    //idMedico: 0,
    //nroEvaluacion: 0,
    //idServicio: 0,
    
    /// <summary>
    /// EVENTOS
    /// </summary>
    /// Carga los eventos que se encargan de la interaccion y acciones en las vistas para el módulo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $("#cboTipoPaciente").on('change', function () {
            $("#motivo-tab").click();
            if ($("#cboTipoPaciente").val() == 2) {
                $("#examenObstetrico-tab").hide();
                $("#examenTactoVaginal-tab").hide();
            } else if ($("#cboTipoPaciente") .val() == 1) {
                $("#examenObstetrico-tab").show();
                $("#examenTactoVaginal-tab").show();
            }
        });

        //$("#txtFechaFUR").on('change', function () {
        //    $('#txtFechaFPP').datepicker("setDate", Utilitario.DevuelveFechaPosibleParto($("#txtFechaFUR").val()));
        //    //$("#txtFechaFPP").val(Utilitario.DevuelveFechaPosibleParto($("#txtFechaFUR").val()));
        //    $("#txtEGsemanas").val(Utilitario.DevuelveEdadGestacional($("#txtFechaFUR").val()));
        //    $("#txtEGdias").val(Utilitario.DevuelveDiasEdadGestacional($("#txtFechaFUR").val()));                                    
        //});

        //$("#chkConFUR").on('click', function () {
        //    if ($('#chkConFUR').is(":checked")) {
        //        $("#txtFechaFUR").attr("disabled", true);
        //        $("#txtFechaFUR").val('');
        //    } else {
        //        $("#txtFechaFUR").attr("disabled", false);
        //    }
            
        //    $("#txtFechaFPP").val('');
        //    $("#txtEGsemanas").val('');
        //    $("#txtEGsemanas").val('');
        //});

        //$("#chkConFUE").on('click', function () {
        //    if ($('#chkConFUE').is(":checked")) {
        //        $("#txtFechaFUE").attr("disabled", true);
        //        $("#txtFechaFUE").val('');
        //    } else {
        //        $("#txtFechaFUE").attr("disabled", false);
        //    }

        //    $("#txtFechaFPP").val('');
        //    $("#txtEGsemanas").val('');
        //    $("#txtEGsemanas").val('');
        //});

        //$("#txtFechaECO").on("change", function () {  
        //    var edadGestacional = null;
        //    if ($("#txtFechaECO").val() != '' && esFormatoFecha($("#txtFechaECO").val()) && $("#txtSemEco").val() != '' && $("#txtDiasEco").val() != '') {
        //        edadGestacional = Utilitario.CalcularEdadGestacional(Variables.FechaIngreso, $("#txtFechaECO").val(), $("#txtSemEco").val(), $("#txtDiasEco").val());
        //        $("#txtEGsemanas").val(edadGestacional.cantSemanas);
        //        $("#txtEGdias").val(edadGestacional.cantDias);
        //    }
        //});

        //$("#txtSemEco").on("change", function () {
        //    if ($("#txtFechaECO").val() != '' && esFormatoFecha($("#txtFechaECO").val()) && $("#txtSemEco").val() != '' && $("#txtDiasEco").val() != '') {
        //        edadGestacional = Utilitario.CalcularEdadGestacional(Variables.FechaIngreso, $("#txtFechaECO").val(), $("#txtSemEco").val(), $("#txtDiasEco").val());
        //        $("#txtEGsemanas").val(edadGestacional.cantSemanas);
        //        $("#txtEGdias").val(edadGestacional.cantDias);
        //    }
        //});

        //$("#txtDiasEco").on("change", function () {
        //    if ($("#txtFechaECO").val() != '' && esFormatoFecha($("#txtFechaECO").val()) && $("#txtSemEco").val() != '' && $("#txtDiasEco").val() != '') {
        //        edadGestacional = Utilitario.CalcularEdadGestacional(Variables.FechaIngreso, $("#txtFechaECO").val(), $("#txtSemEco").val(), $("#txtDiasEco").val());
        //        $("#txtEGsemanas").val(edadGestacional.cantSemanas);
        //        $("#txtEGdias").val(edadGestacional.cantDias);
        //    }
        //});
        

        $(".rdbTactoVaginal").on('click', function () {
            if ($('input:radio[name=rdbTactoVaginal]:checked').val() == 1) {
                EvaluacionEmergencia.BloqueoDiferido(1);
            } else if ($('input:radio[name=rdbTactoVaginal]:checked').val() == 0) {
                EvaluacionEmergencia.BloqueoDiferido(0);
            }
        });

        $(".rdbMembranaRota").on('click', function () {
            if ($('input:radio[name=rdbMembranaRota]:checked').val() == 1) {
                EvaluacionEmergencia.ValidaMembranaRotas(1);
            } else if ($('input:radio[name=rdbMembranaRota]:checked').val() == 0) {
                EvaluacionEmergencia.ValidaMembranaRotas(0);
            }            
        });

        $(".rdbInformarFamiliar").on('click', function () {
            EvaluacionEmergencia.ValidaInformacionFamiliar();
        });

        $("#cboTipoEmbrazo").on('change', function () {

            /*$("#CardFetoUnico input[type=text]").val("");
            $("#CardFetoUnico input[type=radio]").prop('checked', false);
            $("#CardFetoUnico input[type=text]").attr("disabled", true);
            $("#CardFetoUnico input[type=radio]").attr("disabled", true);

            $("#CardFetoMultiple input[type=text]").val("");
            $("#CardFetoMultiple input[type=text]").attr("disabled", true);
            */
            $('input:radio[name=rdbSituacion][value=5]').attr('checked', true);
            $('input:radio[name=rdbSituacion2][value=5]').attr('checked', true);
            $('input:radio[name=rdbSituacion3][value=5]').attr('checked', true);

            $('input:radio[name=rdbPosicion][value=5]').attr('checked', true);
            $('input:radio[name=rdbPosicion2][value=5]').attr('checked', true);
            $('input:radio[name=rdbPosicion3][value=5]').attr('checked', true);

            $('input:radio[name=rdbPresentacion][value=5]').attr('checked', true);
            $('input:radio[name=rdbPresentacion2][value=5]').attr('checked', true);
            $('input:radio[name=rdbPresentacion3][value=5]').attr('checked', true);

            $("#CardFetoUnico input[type=text]").attr("disabled", false);

            $("#CardFetoMultiple input[type=text]").attr("disabled", false);

            $("#nav-tab-TipoEmbarazo").show();
            $("#nav-feto01-tab").show();
            $("#nav-feto02-tab").show();
            $("#nav-feto03-tab").show();
                        
            $("#tab-tabContent-TipoEmbarazo").show();
            $('#nav-tab-TipoEmbarazo a[href="#nav-feto01"]').tab('show');
            if ($("#cboTipoEmbrazo").val() == 1) {
                $("#nav-feto02-tab").hide();
                $("#nav-feto03-tab").hide();

                $("#MovimientosFetales").show();
                //$("#CardFetoUnico").show();
                //$("#CardFetoMultiple").hide();
            }
            else {
                if ($("#cboTipoEmbrazo").val() == 2) {  
                    $("#MovimientosFetales").hide();
                    //$("#CardFetoMultiple").show();
                    //$("#CardFetoUnico").hide();
                } else {
                    $("#nav-tab-TipoEmbarazo").hide();
                    $("#tab-tabContent-TipoEmbarazo").hide();
                    //$("#nav-feto01-tab").hide();
                    //$("#nav-feto02-tab").hide();
                    //$("#nav-feto03-tab").hide();

                    //$("#CardFetoUnico").hide();
                    //$("#CardFetoMultiple").hide();
                }                
            }
        });

        $('#tblEvaluacionesEmergencia tbody').on('click', 'tr', async function () {
            EvaluacionEmergencia.LimpiarVistaModuloEvaluacionDetalle();
            EvaluacionEmergencia.BloquearOpcionesModificacion();

            //oTable_EvaEmer.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();
            
            if (!isEmpty(objrowTb)) {
                EvaluacionDetalle.Cargar(objrowTb);
                if (EvaluacionDetalle.IdNumero > 0) {
                    //await EvaluacionEmergencia.CargarDatosEvaluacionDetalle(Variables.IdAtencion, Variables.IdServicioEgreso, EvaluacionEmergencia.nroEvaluacion);                    
                    await EvaluacionEmergencia.CargarDatosEvaluacionDetalle(EvaluacionDetalle.IdAtencion, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdNumero);
                    
                }
                $("#evaluaciones-tab").click();
            } else {
                //swal({
                //    title: 'Evaluaciones',
                //    html: "No se ha seleccionado ninguna evaluación.",
                //    icon: 'info',
                //    allowOutsideClick: false,
                //}).done();
                alerta2("info", "Evaluaciones", "No se ha seleccionado ninguna evaluación.")
            }
        });

        $('.OpcionEvalEmer').on('click', async function () {
            EvaluacionEmergencia.nuevaEvaluacion = false;
            EvaluacionEmergencia.modificaEvaluacion = false;
            EvaluacionEmergencia.modificaCabecera = false;

            $("#FirmarEvalEmer").show();
            $("#ImprimirEvalEmerCF").show();
            $("#ImprimirEvalEmerSF").show();
            
            $("#CardEva").removeClass("bg-blue");
            $('#tblEvaluacionesEmergencia tbody').find('tr').removeClass("selected");
            //$("#FirmarEvalEmer").attr("href", "");  (COMNETADO POR KHOYOSI - FIRMA ANTERIOR)

            ///////////COMENTADO POR KHOYOSI////////////////
            if (AdmisionEmergencia.accion == 'M') {
                if (EvaluacionEmergencia.idMedicoPrimeraEvaluacion > 0) {
                    if (EvaluacionEmergencia.idMedicoPrimeraEvaluacion == await Utilitario.ObtenerIdMedicoSesion()) {
                        EvaluacionEmergencia.modificaCabecera = true;
                        EvaluacionEmergencia.DesbloquearCabecera();
                        $("#btnGuardarEva").show();
                    } else {
                        EvaluacionEmergencia.modificaCabecera = false;
                        EvaluacionEmergencia.BloquearCabecera();
                        $("#btnGuardarEva").hide();
                    }
                } else {
                    $("#btnGuardarEva").hide();
                }                                
            } else {
                if (AdmisionEmergencia.accion == 'C') {
                    $("#btnGuardarEva").hide();
                }
            }
            ///////////COMENTADO POR KHOYOSI////////////////
            //$("#btnGuardarEva").hide();

            //console.log("Entro Card Opciones");

            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        /////////////////////////AGREGAR NUEVO EVALUACION////////////////////////////////////
        $("#btnNuevoRegistro").on('click', async function () {
            Cargando(1);
            let eval = oTable_EvaEmer.DataTable().data().count();

            EvaluacionDetalle.IdMedico = await Utilitario.ObtenerIdMedicoSesion();
            EvaluacionDetalle.IdServicio = Variables.IdServicioEgreso;
            EvaluacionDetalle.IdNumero = eval + 1;

            OrdenMedica.nroEvaluaciones = eval;

            $('#hdNroEvaluacion').val(EvaluacionDetalle.IdNumero);

            if (EvaluacionDetalle.IdMedico > 0) {
                EvaluacionEmergencia.LimpiarVistaModuloEvaluacionDetalle();
                EvaluacionEmergencia.DesbloquearOpcionesModificacion();

                $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-success");
                $("#CardEva").addClass("bg-blue");

                $("#lblNumeroEvaluacion").html("Evaluación N° " + (eval + 1));
                $("#lblTipoEvaluacion").html("Nueva Evaluación");


                $('#FechaInicioAtencion').attr('readonly', 'readonly');
                $('#FechaInicioAtencion').datepicker('setStartDate', moment(moment(ConvertirFormatoFecha(Variables.FechaIngreso)).toDate()).toDate().format('dd/mm/yyyy'));
                $('#FechaInicioAtencion').datepicker('setEndDate', moment().toDate());
                $('#FechaInicioAtencion').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

                $('#HoraInicioAtencion').val(moment().toDate().format('HH:MM'));

                EvaluacionEmergencia.nuevaEvaluacion = true;
                EvaluacionEmergencia.modificaEvaluacion = false;
                EvaluacionEmergencia.modificaCabecera = false;
                //EvaluacionEmergencia.idMedico = Utilitario.ObtenerIdMedicoSesion();

                $('.nav-tabs a[href="#diagnosticos-tab"]').tab('show');     //KHOYOSI

                //swal({
                //    title: 'Evaluaciones',
                //    text: "Paciente iniciara la Evaluación N° " + (eval + 1),
                //    type: 'info',
                //    allowOutsideClick: false,
                //}).done();
                alerta2("info", "Evaluaciones", "Paciente iniciara la Evaluación N° " + (eval + 1));
                $("#evaluaciones-tab").click();
            } else {
                //swal({
                //    title: 'Evaluaciones',
                //    text: "Usted no tiene rol de médico para realizar una evaluación",
                //    type: 'warning',
                //    allowOutsideClick: false,
                //}).done();
                alerta2("", "Evaluaciones", "Usted no tiene rol de médico para realizar una evaluación");
            }
                       
            Cargando(0);
        });

        ////////////////////////////FIRMA DIGITAL///////////////////////////////////////
        $('#ImprimirEvalEmerSF').on('click', async function () {            
            var objrow = oTable_EvaEmer.api(true).row('.selected').data();
            
            Cargando(1);
            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(objrow.code)
                if (isEmpty(firma)) {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                    const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(objrow.idCuentaAtencion, objrow.idEvaluacionDetalle, objrow.idAtencion, objrow.idServicio, objrow.idNumero);

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

        $('#FirmarEvalEmer').on('click', async function () {
            var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.')
                return false
            }

            Utilitario.TipoArchivoFirmar = 'EMER-EVA-DET';
            Cargando(1);            
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(objrowTb.code)               //KHOYOSI            
            if (firma) {                
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(objrowTb.code); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(objrowTb.code); }
                //await Utilitario.IniciarServicioFirmaBit4Id(objrowTb.code);
            }
            Cargando(0);     

            //Cargando(1);            
            //const paquete = await Utilitario.CrearPaqueteArchivos(Variables.IdCuentaAtencion, '', "'EMER-EVA-DET''");
            //if (!isEmpty(paquete)) {                
            //    await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data)
            //}
            //Cargando(0);
        });

        $('#ImprimirEvalEmerCF').on('click', async function () {
            var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();
            Cargando(1);
            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(objrowTb.code);
            }
            Cargando(0);
        });
        ///////////////////////////////////////////////////////////////////////////////////////



        /////////////////////////GUARDAR Y CANCELAR EVALUACION////////////////////////
        $("#btnGuardarEva").on('click', async function () {            
            var eval = oTable_EvaEmer.DataTable().data().count();

            sesion = Utilitario.ValidarSesion();
            if (sesion) {
                if (eval == 0 && EvaluacionEmergencia.nuevaEvaluacion == false) {
                    alerta(2, "No se ha registrado ninguna evaluación. Por favor registre una evaluación.");
                } else {
                    if (EvaluacionEmergencia.ValidarVariablesEvaluacionEmergencia()) {
                        Cargando(1);
                        Triaje.GuardarTriajeHospEmeg(Variables.IdAtencion, Variables.IdServicioEgreso, 0);                        
                        const data1 = await EvaluacionEmergencia.GuardarEvaluacionEmergencia();
                        const data2 = await EvaluacionEmergencia.GuardarExamenGinecoObstetra();
                        const dataAnt = await Antecedentes.AntecedentesPacienteGuardar(Variables.IdPaciente, Variables.IdAtencion, EvaluacionEmergencia.idProCabecera);

                        if (EvaluacionEmergencia.nuevaEvaluacion == true || EvaluacionEmergencia.modificaEvaluacion == true) {
                            if (data1 == true && data2 == true && dataAnt == true) {
                                const data3 = await EvaluacionEmergencia.GuardarEvaluacionEmergenciaDetalle();
                                //if (data3) {

                                //    alerta2('success', 'EMERGENCIA', 'La evaluación se guardó correctamente.');
                                //}
                                let nuevaEval = EvaluacionEmergencia.nuevaEvaluacion;
                                await EvaluacionEmergencia.CargarEvaluacionDetalle(EvaluacionDetalle.IdNumero);

                                if (nuevaEval == true) {
                                    swal({
                                        title: 'EMERGENCIA',
                                        html: "La evaluación se guardó correctamente. <br><br>¿Desea generar una receta/orden médica?",
                                        icon: 'success',
                                        allowOutsideClick: false,
                                        showCancelButton: true,
                                        confirmButtonColor: '#4fb7fe',
                                        cancelButtonColor: '#6c6c6c',
                                        confirmButtonText: 'Si',
                                        cancelButtonText: 'No',
                                    }).then(function (result) {
                                        if (result.isConfirmed) {
                                            $('.nav-tabs a[href="#ordenes-tab"]').tab('show');
                                            $('#btnAgregarOrdenMedica').click();
                                        }                                        
                                    }, function (dimiss) {

                                    });
                                } else {
                                    alerta2('success', 'EMERGENCIA', 'La evaluación se guardó correctamente.');
                                }

                                
                                //const data5 =  await Diagnosticos.GuardarDiagnosticosPorEvaluacion(Variables.IdAtencion, 8, Variables.IdServicioEgreso, EvaluacionEmergencia.nroEvaluacion);                            
                                //if (data4 == true) {
                                //    //console.log("GENERAR RECETAS");
                                //    const datarec = await Ordenes.GuardarOrdenesMedicasV2();
                                //    if (datarec.length > 0) {
                                //        const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdMedico);
                                //        VisorReceta.AbrirVisorRecetas(recetas);
                                //    }
                                //    //console.log(datarec);
                                //}
                            }
                        } else {
                            if (EvaluacionEmergencia.modificaCabecera == true) {
                                const data4 = EvaluacionEmergencia.ActualizarHojaCabecera();
                                await EvaluacionEmergencia.CargarEvaluacion();
                                if (data4) {
                                    alerta2('success', 'EMERGENCIA', 'La evaluación se guardó correctamente.');
                                }
                            }
                        }
                                              

                        //EvaluacionEmergencia.CargarEvaluacion();
                        //EvaluacionEmergencia.LimpiarModuloEmergencia();
                        //EvaluacionDetalle.Limpiar();
                        //AdmisionEmergencia.CerrarModulo();
                        //ReposicionarVista();
                        //MostrarAreaLista();
                        //AdmisionEmergencia.ListarAtenciones();

                        Cargando(0);
                    }
                }
            }
            
        });


        $("#btnCancelarEva").on('click', function () {
            swal({
                title: 'CERRAR',
                html: "¿Esta seguro de cerrar el módulo de evaluación?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            }).then(function (result) {
                if (result.isConfirmed) {
                    console.log("Cerrar desde archivo EvaluacionEmergencia.js");
                    AdmisionEmergencia.limpiarRecetas()
                    EvaluacionEmergencia.LimpiarModuloEmergencia();
                    AdmisionEmergencia.CerrarModulo();
                    ReposicionarVista();
                    MostrarAreaLista();
                    $("#btnBuscarAtencionesEmergencia").click();
                }
                
            }, function (dimiss) {

            });
        });
        //--------------------------------------------------------------//

        /////////////////////////////////EVENTOS VISOR RECETAS////////////////////////////////////////////////////
        $('#btnVisorRecetasEmer').on('click', async function () {
            var row = oTable_EvaEmer.api(true).row('.selected').data();
            //console.log(row);
            if (typeof row === 'undefined') {
                alerta(2, "Seleccione una evaluación por favor.");
            } else {
                //const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionEmergencia.nroEvaluacion, Variables.IdServicioIngreso, Variables.IdMedico);
                const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdMedico);
                VisorReceta.AbrirVisorRecetas(recetas);                
            }            
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////KHOYOSI/////////////////
        $('#anteceObst-tab[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            $('#CardFormulaObstetrica .lineaConectorInput').remove();
            EvaluacionEmergencia.DibujarLineasFormulaObstetrica();
            //console.log(tabId);

        });
        ////KHOYOSI/////////////////

        $("#cboTipoEmbrazo").change();
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// DATATABLES
    /// </summary>
    /// INICIALIZA DATA TABLE DE EVALAUACIONES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    IniciarDataTablesEvaluacion() {
        var parms = {
            scrollY: "145px",
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
                    width: "15%",
                    targets: 0,
                    data: "idNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "85%",
                    targets: 1,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblEvaluacionesEmergencia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_EvaEmer = $("#tblEvaluacionesEmergencia").dataTable(parms);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// MODIFICAR Y CONSULTAR EVALUACION
    /// </summary>
    /// Opciones de consulta y modificacion
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async ModificarEvaluacion() {
        await EvaluacionEmergencia.CargarEvaluacion();
        EvaluacionEmergencia.DesbloquearCampos();
        //$("#btnGuardarEva").hide();
        //console.log("ENTROO");
    },

    async ConsultarEvaluacion() {
        await EvaluacionEmergencia.CargarEvaluacion();
        EvaluacionEmergencia.BloquearCampos();
        //console.log("ENTROO");
    },

    async CargarEvaluacion() {
        //opcionModificar = true;
        //var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

        //this.LimpiarModal();
        //this.HabilitarModal();
        AdmisionEmergencia.limpiarRecetas()
        EvaluacionEmergencia.LimpiarModuloEmergencia();
        //Triaje.listaTriajeEmgHosp(objrow.idAtencion, objrow.idServicioEgreso, 0);
        await EvaluacionEmergencia.CargarDatosEvaluacion();
        //EvaluacionNeonatal.AbrirModalNeonatal();

        //AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)

        //idPacienteGlobal = objrow.idPaciente;     //idPaciente para el Alta

        $("#motivo-tab").click();
        //this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);

        //$("#btnGuardarEva").hide();
        //$("#btnNuevoRegistro").show();

        MostrarAreaRegistro();
    },

    async CargarEvaluacionDetalle(idEval) {
        AdmisionEmergencia.limpiarRecetas()
        EvaluacionEmergencia.LimpiarModuloEmergencia();
        await EvaluacionEmergencia.CargarDatosEvaluacion();        
        ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)     

        let evaluacion = oTable_EvaEmer.fnGetNodes()[idEval-1];
        evaluacion.click();    
        $('.nav-tabs a[href="#diagnosticos-tab"]').tab('show');
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// <summary>
    /// CARGA DATOS DESDE LA BD
    /// </summary>
    /// Lista de metodos que carga los datos de la evaluacion desde la BD
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async SeleccionarEvaluacion(idAtencion) {
        let respuesta = [];
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idAtencion', idAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/SeleccionarEvaluacion?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    respuesta = datos.respuesta.table[0];                    
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return respuesta;
    },

    async SeleccionarEvaluacionDetalle(idAtencion, idServicio) {
        let respuesta = [];
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idAtencion', idAtencion);
        formData.append('idServicio', idServicio);

        try {
            Cargando(1);
            oTable_EvaEmer.fnClearTable();
            datos = await
            $.ajax({
                method: "POST",
                url: "/EvaluacionEmergencia/SeleccionarEvaluacionDetalle?area=Emergencia",
                //contentType: "application/json; charset=utf-8",
                data: formData,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            Cargando(0);
            if (datos.session) {
                $("#btnNuevoRegistro").text("");
                if (datos.respuesta.table.length > 0) {
                    $("#PanelEvaluaciones").show();
                    $("#btnNuevoRegistro").append('<i style="width: 20px; text-align: center;" class="fa-solid fa-file-plus"></i> REEVALUAR');
                    respuesta = datos.respuesta.table;
                    oTable_EvaEmer.fnAddData(respuesta);
                    EvaluacionEmergencia.idMedicoPrimeraEvaluacion = datos.respuesta.table[0].idMedico;

                    //let eval = oTable_EvaEmer.DataTable().data().count();

                    OrdenMedica.nroEvaluaciones = datos.respuesta.table.length;
                }
                else {
                    $("#PanelEvaluaciones").hide();
                    $("#btnNuevoRegistro").append('<i style="width: 20px; text-align: center;" class="fa-solid fa-file-plus"></i> EVALUAR');
                    respuesta = [];
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return respuesta;                       
    },

    async SeleccionarEvaluacionDetallePorEvaluacion(idAtencion, idServicio, nroEvaluacion) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idAtencion', idAtencion);
        data.append('idServicio', idServicio);
        data.append('nroEvaluacion', nroEvaluacion);
        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/SeleccionarEvaluacionDetallePorEvaluacion?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
            else {
                resp = [];
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarExamenGinecoObstetra(idAtencion, idServicio) {
        let respuesta = [];
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idAtencion', idAtencion);
        formData.append('idServicio', idServicio);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/SeleccionarExamenGinecoObstetra?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    respuesta = datos.respuesta.table[0];
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return respuesta;                
    },

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// CARGA DATOS A LA VISTA
    /// </summary>
    /// Carga los datos de la evaluacion a la vista
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async CargarDatosEvaluacion() {
        let objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        $("#txtPaciente").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtPacienteNombre").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        //$("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtNroHistoria").val(objrowTb.nroHistoriaClinica);
        $("#txtHistoria").val(objrowTb.nroHistoriaClinica);
        //$("#HistoriaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-clipboard-medical'></i><b>Historia: </b>" + objrowTb.nroHistoriaClinica);
        $("#txtTipoDocumentoEmer").val(objrowTb.tipoDocumento);
        $("#txtNroDocumentoEmer").val(objrowTb.nroDocumento);
        //$("#txtEdadAnio").val(objrowTb.edadEnAnio);
        //$("#txtEdadMes").val(objrowTb.edadEnMes);
        //$("#txtEdadDia").val(objrowTb.edadEnDia);
        $("#txtNroCuenta").val(objrowTb.idCuentaAtencion);
        //$("#CuentaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-hashtag'></i><b>Cuenta: </b>" + objrowTb.idCuentaAtencion);
        $("#txtNroAtencion").val(objrowTb.idAtencion);
        $("#cboTipoPaciente").val(objrowTb.idTipoPaciente);
        $("#cboOrigenPaciente").val(objrowTb.idOrigenAtencion);
        $("#cboPrioridad").val(objrowTb.idTipoGravedad);        
        $("#hdIdTipoFuenteFian").val(objrowTb.idTipoFinanciamiento); 
        $('#hdIdCuentaAtencion').val(objrowTb.idCuentaAtencion);
        $('#hdIdServicioPaciente').val(Variables.IdServicioEgreso);
        //$('#hdIdServicioPaciente').val(objrowTb.idServicioEgreso);
        IdCuentaAtencionTemp = Variables.IdCuentaAtencion;       //variable para conservar el IdCuentaAtencion despues de abrir el modulo de SEGUIMIENTO

        await Triaje.TriajeEmgHospListar(Variables.IdAtencion, Variables.IdServicioEgreso, 0);

        let EvaEmer = await EvaluacionEmergencia.SeleccionarEvaluacion(Variables.IdAtencion);        
        //var EvaDetEmer = EvaluacionEmergencia.SeleccionarEvaluacionDetalle(Variables.IdAtencion, Variables.IdServicioEgreso);
        let EvaDetEmer = await EvaluacionEmergencia.SeleccionarEvaluacionDetalle(Variables.IdAtencion, 0);
        let ExaGineObs = await EvaluacionEmergencia.SeleccionarExamenGinecoObstetra(Variables.IdAtencion, Variables.IdServicioEgreso);

        //----------------------EVALUACION EMERGENCIA-----------------------//
        //$("#txtEdadAnio").val(EvaEmer.edadEnAnio);
        //$("#txtEdadMes").val(EvaEmer.edadEnMes);
        //$("#txtEdadDia").val(EvaEmer.edadEnDia);

        let edad = calcularEdad_v2(objrowTb.fechaNacimiento);
        $("#txtEdadAnio").val(edad.años);
        $("#txtEdadMes").val(edad.meses);
        $("#txtEdadDia").val(edad.dias);

        $('#txtGlasgow').val(EvaEmer.glasgow);
        $('input:radio[name=rdbRiesgoCaida][value=' + isNull(EvaEmer.riesgoCaida, 0) + ']').prop('checked', true);

        //----------------------ANTECEDENTES-----------------------//
        if (EvaEmer.idProCabecera > 0) {
            await Antecedentes.EvaluacionObstetricaSeleccionar(Variables.IdAtencion);
            let antEmer = await Antecedentes.AntecedentesPacienteListar(Variables.IdPaciente, EvaEmer.idProCabecera);
            EvaluacionEmergencia.idProCabecera = EvaEmer.idProCabecera;
        } else {
            let pro = await Antecedentes.ProCabeceraPorPacienteSeleccionar(Variables.IdPaciente);
            if (isEmpty(pro)) {
                EvaluacionEmergencia.idProCabecera = 0;
                //await Antecedentes.EvaluacionObstetricaSeleccionar();
                let antEmer = await Antecedentes.AntecedentesPacienteListar(Variables.IdPaciente, 0);
                await Antecedentes.EvaluacionObstetricaSeleccionar(Variables.IdAtencion);
            } else {
                EvaluacionEmergencia.idProCabecera = isNull(pro.idProcabecera, 0);
                await Antecedentes.EvaluacionObstetricaSeleccionar(pro.ultimoIdAtencion);
                let antEmer = await Antecedentes.AntecedentesPacienteListar(Variables.IdPaciente, pro.idProcabecera);
            }
                        
        }
        
        //----------------------MOTIVO ATENCION-----------------------//        
        //EvaEmer.fechaUR == '__/__/____' ? $('#txtFechaFUR').val(EvaEmer.fechaUR) : $('#txtFechaFUR').datepicker("setDate", EvaEmer.fechaUR);
        //EvaEmer.fechaEco == '__/__/____' ? $('#txtFechaFUE').val(EvaEmer.fechaEco) : $('#txtFechaFUE').datepicker("setDate", EvaEmer.fechaEco);
        //EvaEmer.fechaPP == '__/__/____' ? $('#txtFechaFPP').val(EvaEmer.fechaPP) : $('#txtFechaFPP').datepicker("setDate", EvaEmer.fechaPP);
        //EvaEmer.fechaPrimeraEco == '__/__/____' ? $('#txtFechaECO').val(EvaEmer.fechaPrimeraEco) : $('#txtFechaECO').datepicker("setDate", EvaEmer.fechaPrimeraEco);
        //$('#txtSemEco').val(EvaEmer.semPrimeraEco);
        //$('#txtDiasEco').val(EvaEmer.diasPrimeraEco);

        //$('#txtEGsemanas').val(EvaEmer.edadGestacional);
        //$('#txtEGdias').val(EvaEmer.diasGestacional);
        //$('#txtCPNveces').val(EvaEmer.cnp);
        //$('#txtG').val(EvaEmer.gMotiA);
        //$('#txtP').val(EvaEmer.pMotiA);

        //$('#txtParidad1').val(EvaEmer.paridad1);
        //$('#txtParidad2').val(EvaEmer.paridad2);
        //$('#txtParidad3').val(EvaEmer.paridad3);
        //$('#txtParidad4').val(EvaEmer.paridad4);

        $('#chkDolor').prop('checked', EvaEmer.dolor);
        $('#chkConvulsion').prop('checked', EvaEmer.convulsiones);
        $('#chkFiebre').prop('checked', EvaEmer.fiebre);
        $('#chkVomitos').prop('checked', EvaEmer.vomitos);
        $('#chkContraccionUterina').prop('checked', EvaEmer.contraccionesU);
        $('#chkSangradoV').prop('checked', EvaEmer.sangradoV);
        $('#chkPerdidaLA').prop('checked', EvaEmer.perdidaLA);
        $('#chkAusenciaMF').prop('checked', EvaEmer.ausenciaMF);
        $('#chkSintomasU').prop('checked', EvaEmer.sintomasU);
        $('#chkFlujoVaginal').prop('checked', EvaEmer.flujoV);
        $('#chkTumoracion').prop('checked', EvaEmer.tumoracion);
        $('#chkAlteracionesM').prop('checked', EvaEmer.alteracionesM);
        $('#chkDismMovFetal').prop('checked', EvaEmer.disMovFetales);
        $('#chkOtrosSintomas').prop('checked', EvaEmer.otros);

        $('#txtAntecedentes').val(EvaEmer.antecedentes);
        $('#txtEnfermedadActual').val(EvaEmer.enfermedadA);
        $('#txtMayorPesoFetal').val(EvaEmer.pesoFetalAnt);

        if (objrowTb.idTipoPaciente == 2) {
            $("#examenObstetrico-tab").hide();
            $("#examenTactoVaginal-tab").hide();
        } else if (objrowTb.idTipoPaciente == 1) {
            $("#examenObstetrico-tab").show();
            $("#examenTactoVaginal-tab").show();
        }

        //console.log(ExaGineObs);
        if (ExaGineObs.length != 0) {
            //----------------------EXAMEN FISICO-----------------------//        
            $('input:radio[name=rdbEstGS][value=' + ExaGineObs.lEstadoGeneral + ']').prop('checked', true);
            $('#txtEstdGeneSens').val(ExaGineObs.dEstadoGeneral);
            $('#txtEdemas').val(ExaGineObs.dEdemas);
            $('input:radio[name=rdbCard][value=' + ExaGineObs.lAparatoCV + ']').prop('checked', true);
            $('#txtCardVas').val(ExaGineObs.dAparatoCV);
            $('#txtReflejos').val(ExaGineObs.dReflejos);
            $('input:radio[name=rdbAbdomen][value=' + ExaGineObs.lAbdomen + ']').prop('checked', true);
            $('#txtAbdomenNormal').val(ExaGineObs.dAbdomen);
            $('input:radio[name=rdbAptResp][value=' + ExaGineObs.lAparatoR + ']').prop('checked', true);
            $('#txtbAptResp').val(ExaGineObs.dAparatoR);
            $('input:radio[name=rdbAptUrin][value=' + ExaGineObs.lAparatoU + ']').prop('checked', true);
            $('#txtbAptUrin').val(ExaGineObs.dAparatoU);
            $('input:radio[name=rdbExtrem][value=' + ExaGineObs.lExtremidades + ']').prop('checked', true);
            $('#txtExtrem').val(ExaGineObs.dExtremidades);
            $('input:radio[name=rdbNeurologico][value=' + ExaGineObs.lNeurologico + ']').prop('checked', true);
            $('#txtNeurologico').val(ExaGineObs.dNeurologico);
            $('input:radio[name=rdbPiel][value=' + ExaGineObs.lPiel + ']').prop('checked', true);
            $('#txtPiel').val(ExaGineObs.dPiel);


            //----------------------EXAMEN GINECOLOGICO-----------------------//        
            $('input:radio[name=rdbGB][value=' + ExaGineObs.lGeBus + ']').prop('checked', true);
            $('#txtGB').val(ExaGineObs.dGeBus);
            $('input:radio[name=rdVagina][value=' + ExaGineObs.lVagina + ']').prop('checked', true);
            $('#txtVagina').val(ExaGineObs.dVagina);
            $('input:radio[name=rdbCervix][value=' + ExaGineObs.lCervix + ']').prop('checked', true);
            $('#txtCervix').val(ExaGineObs.dCervix);
            $('input:radio[name=rdbUtero][value=' + ExaGineObs.lUtero + ']').prop('checked', true);
            $('#txtUtero').val(ExaGineObs.dUtero);
            $('input:radio[name=rdbAnexos][value=' + ExaGineObs.lAnexos + ']').prop('checked', true);
            $('#txtAnexos').val(ExaGineObs.dAnexos);
            $('input:radio[name=rdbFsDouglas][value=' + ExaGineObs.lDouglas + ']').prop('checked', true);
            $('#txtFsDouglas').val(ExaGineObs.dDouglas);
            $('input:radio[name=rdbParam][value=' + ExaGineObs.lParametros + ']').prop('checked', true);
            $('#txtParam').val(ExaGineObs.dParametros);
            $('input:radio[name=rdbMamas][value=' + ExaGineObs.lMamas + ']').prop('checked', true);
            $('#txtMamas').val(ExaGineObs.dMamas);
            $('#txtObservacionesGinecologicas').val(ExaGineObs.observacionGinecologica);

            //----------------------EXAMEN OBSTETRICO-----------------------//        
            $('#txtAlturaUterina').val(ExaGineObs.lua);
            $('#txtDU').val(ExaGineObs.ldu);
            $('input:radio[name=rdbDips][value=' + ExaGineObs.lDips + ']').prop('checked', true);
            $('input:radio[name=rdbSoplos][value=' + ExaGineObs.lSoplos + ']').prop('checked', true);
            $('input:radio[name=rdbHidromios][value=' + ExaGineObs.lHidraminios + ']').prop('checked', true);
            $('#txtPonderado').val(ExaGineObs.lPonderado);
            $('#txtPonderadoClinico').val(ExaGineObs.lPonderadoClinico);
            $('#txtPonderadoEcografo').val(ExaGineObs.lPonderadoEcografo);
            $('#cboTipoEmbrazo').val(ExaGineObs.lTipoEmbarazo);
            $('#cboTipoEmbrazo').change();
            if (ExaGineObs.lTipoEmbarazo == 1) {
                $('input:radio[name=rdbSituacion][value=' + ExaGineObs.lSituacion + ']').prop('checked', true);
                $('input:radio[name=rdbPosicion][value=' + ExaGineObs.lPosicion + ']').prop('checked', true);
                $('input:radio[name=rdbPresentacion][value=' + ExaGineObs.lPresentacion + ']').prop('checked', true);
                $('#txtLfc').val(ExaGineObs.llcf);
                $('#txtMovFetales').val(ExaGineObs.movFetales);
            } else if (ExaGineObs.lTipoEmbarazo == 2) {
                let spp1 = ExaGineObs.dF1Spp;
                let spp2 = ExaGineObs.dF2Spp;
                let spp3 = ExaGineObs.dF3Spp;

                //-------------------FETO 01----------------------------
                if (spp1.indexOf('L') >= 0) { $('input:radio[name=rdbSituacion][value=' + 1 + ']').prop('checked', true); }
                else if (spp1.indexOf('T') >= 0) { $('input:radio[name=rdbSituacion][value=' + 2 + ']').prop('checked', true); }
                else { $('input:radio[name=rdbSituacion][value=' + 5 + ']').prop('checked', true); }

                if (spp1.indexOf('D') >= 0) { $('input:radio[name=rdbPosicion][value=' + 1 + ']').prop('checked', true); }
                else if (spp1.indexOf('I') >= 0) { $('input:radio[name=rdbPosicion][value=' + 2 + ']').prop('checked', true); }
                else { $('input:radio[name=rdbPosicion][value=' + 5 + ']').prop('checked', true); }

                if (spp1.indexOf('C') >= 0) { $('input:radio[name=rdbPresentacion][value=' + 1 + ']').prop('checked', true); }
                else if (spp1.indexOf('P') >= 0) { $('input:radio[name=rdbPresentacion][value=' + 2 + ']').prop('checked', true); }
                else { $('input:radio[name=rdbPresentacion][value=' + 5 + ']').prop('checked', true); }

                $('#txtLfc').val(ExaGineObs.lF1Lcf);
                $('#txtMovFetales').val(ExaGineObs.mfF01);

                //-------------------FETO 02----------------------------
                if (spp2.indexOf('L') >= 0) { $('input:radio[name=rdbSituacion2][value=' + 1 + ']').prop('checked', true); }
                else if (spp2.indexOf('T') >= 0) { $('input:radio[name=rdbSituacion2][value=' + 2 + ']').prop('checked', true); }
                else { $('input:radio[name=rdbSituacion2][value=' + 5 + ']').prop('checked', true); }

                if (spp2.indexOf('D') >= 0) { $('input:radio[name=rdbPosicion2][value=' + 1 + ']').prop('checked', true); }
                else if (spp2.indexOf('I') >= 0) { $('input:radio[name=rdbPosicion2][value=' + 2 + ']').prop('checked', true); }
                else { $('input:radio[name=rdbPosicion2][value=' + 5 + ']').prop('checked', true); }

                if (spp2.indexOf('C') >= 0) { $('input:radio[name=rdbPresentacion2][value=' + 1 + ']').prop('checked', true); }
                else if (spp2.indexOf('P') >= 0) { $('input:radio[name=rdbPresentacion2][value=' + 2 + ']').prop('checked', true); }
                else { $('input:radio[name=rdbPresentacion2][value=' + 5 + ']').prop('checked', true); }

                $('#txtLfc2').val(ExaGineObs.lF2Lcf);
                $('#txtMovFetales2').val(ExaGineObs.mfF02);

                //-------------------FETO 03----------------------------
                if (spp3.indexOf('L') >= 0) { $('input:radio[name=rdbSituacion3][value=' + 1 + ']').prop('checked', true); }
                else if (spp3.indexOf('T') >= 0) { $('input:radio[name=rdbSituacion3][value=' + 2 + ']').prop('checked', true); }
                else { $('input:radio[name=rdbSituacion3][value=' + 5 + ']').prop('checked', true); }

                if (spp3.indexOf('D') >= 0) { $('input:radio[name=rdbPosicion3][value=' + 1 + ']').prop('checked', true); }
                else if (spp3.indexOf('I') >= 0) { $('input:radio[name=rdbPosicion3][value=' + 2 + ']').prop('checked', true); }
                else { $('input:radio[name=rdbPosicion3][value=' + 5 + ']').prop('checked', true); }

                if (spp3.indexOf('C') >= 0) { $('input:radio[name=rdbPresentacion3][value=' + 1 + ']').prop('checked', true); }
                else if (spp3.indexOf('P') >= 0) { $('input:radio[name=rdbPresentacion3][value=' + 2 + ']').prop('checked', true); }
                else { $('input:radio[name=rdbPresentacion3][value=' + 5 + ']').prop('checked', true); }

                $('#txtLfc3').val(ExaGineObs.lF3Lcf);
                $('#txtMovFetales3').val(ExaGineObs.mfF03);


                //$('#txtF1SiPoPr').val(ExaGineObs.dF1Spp);
                //$('#txtF2SiPoPr').val(ExaGineObs.dF2Spp);
                //$('#txtF3SiPoPr').val(ExaGineObs.dF3Spp);

                //$('#txtF1Lfc').val(ExaGineObs.lF1Lcf);
                //$('#txtF2Lfc').val(ExaGineObs.lF2Lcf);
                //$('#txtF3Lfc').val(ExaGineObs.lF3Lcf);

                //$('#txtF1Mf').val(ExaGineObs.mfF01);
                //$('#txtF2Mf').val(ExaGineObs.mfF02);
                //$('#txtF3Mf').val(ExaGineObs.mfF03);
            }
            $('#txtObsservacionesObstetricas').val(ExaGineObs.dObservacionesObstetricas);

            //----------------------EXAMEN TACTO VAGINAL-----------------------//
            $('input:radio[name=rdbTactoVaginal][value=' + ExaGineObs.lTipoTactoVaginal + ']').prop('checked', true);
            if (ExaGineObs.lTipoTactoVaginal == 1) {
                $('#txtDilatacion').val(ExaGineObs.lDilatacion);
                $('#txtIncorporacion').val(ExaGineObs.lIncorporacion);

                $('#txtAltPresen').val(ExaGineObs.lAlPresent);
                $('#txtVarPresen').val(ExaGineObs.dVarPresent);
                EvaluacionEmergencia.BloqueoDiferido(1);
            } else {
                $('#txtDilatacion').val('');
                $('#txtIncorporacion').val('');

                $('#txtAltPresen').val('');
                $('#txtVarPresen').val('');
                EvaluacionEmergencia.BloqueoDiferido(0);
            }
            //$('#txtAltPresen').val(ExaGineObs.lAlPresent);
            //$('#txtVarPresen').val(ExaGineObs.dVarPresent);

            $('input:radio[name=rdbMembranaRota][value=' + ExaGineObs.membranasRotas + ']').prop('checked', true);
            if (ExaGineObs.membranasRotas == 1) {
                EvaluacionEmergencia.ValidaMembranaRotas(1);
            } else if (ExaGineObs.membranasRotas == 0) {
                EvaluacionEmergencia.ValidaMembranaRotas(0);
            }
            $('input:radio[name=rdbProcubito][value=' + ExaGineObs.lProcubito + ']').prop('checked', true);
            $('input:radio[name=rdbProlapso][value=' + ExaGineObs.lProlapso + ']').prop('checked', true);
            $('input:radio[name=rdbSangradoVaginal][value=' + ExaGineObs.dSangradoV + ']').prop('checked', true);

            $('input:radio[name=rdbPelvSuperior][value=' + ExaGineObs.lPelvimetriaSup + ']').prop('checked', true);
            $('input:radio[name=rdbPelvMedio][value=' + ExaGineObs.lPelvimetriaMed + ']').prop('checked', true);
            $('input:radio[name=rdbPelvInferior][value=' + ExaGineObs.lPelvimetriaInf + ']').prop('checked', true);
            $('input:radio[name=rdbPelvisGinecoide][value=' + ExaGineObs.lPelvisGinecoide + ']').prop('checked', true);
            $('#txtPelvisGinecoide').val(ExaGineObs.pelvisGineDesc);

            $('input:radio[name=rdbLiquidoAmniotico][value=' + ExaGineObs.lLiquidoA + ']').prop('checked', true);
            $('input:radio[name=rdbMalOlor][value=' + ExaGineObs.malOlor + ']').prop('checked', true);
            $('input:radio[name=rdbCompFetoPelvica][value=' + ExaGineObs.lCompatibilidadF + ']').prop('checked', true);
        } else {
            $('#cboTipoEmbrazo').val(1);
            $('#cboTipoEmbrazo').change();
        }
                
        
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async CargarDatosEvaluacionDetalle(idAtencion, idServicio, nroEvaluacion) {
        $("#BadgeEvaluacion .msc-hotline").addClass("bg-blue");
        $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-info");

        $("#lblNumeroEvaluacion").html("Evaluación N° " + nroEvaluacion);
        $("#lblTipoEvaluacion").html("Evaluación Registrada");

        var evaluacion = await EvaluacionEmergencia.SeleccionarEvaluacionDetallePorEvaluacion(idAtencion, idServicio, nroEvaluacion);
        //var evaluacion = EvaDetneo.find(evaluacion => evaluacion.idNumero === nroEvaluacion);

        //$('#FechaInicioAtencion').datepicker('setStartDate', moment(evaluacion.fecha).add(-1, 'days').toDate().format('dd/mm/yyyy'));
        //$('#FechaInicioAtencion').datepicker('setEndDate', moment(evaluacion.fecha).toDate().format('dd/mm/yyyy'));
        $('#FechaInicioAtencion').datepicker('setStartDate', moment(moment(ConvertirFormatoFecha(Variables.FechaIngreso)).toDate()).toDate().format('dd/mm/yyyy'));
        $('#FechaInicioAtencion').datepicker('setEndDate', moment().toDate());
        $('#FechaInicioAtencion').datepicker("setDate", FormatearFecha(evaluacion.fecha));

        $('#HoraInicioAtencion').val(evaluacion.horaInicioAtencion);

        $('#txtImpresionDiagnostica').val(evaluacion.seguimiento);        
        $('#txtTratamiento').val(evaluacion.indicaciones);
        $('#txtPlanTrabajo').val(evaluacion.plandeTrabajo);

        $('input:radio[name=rdbInformarFamiliar]').removeAttr("checked");
        $('input:radio[name=rdbInformarFamiliar][value=' + isNull(evaluacion.informarFamiliar, 0) + ']').prop('checked', true);                
        $('#txtInformacionFamiliar').val(evaluacion.informacionFamiliar);

        $('input:radio[name=rdbRiesgoFuga]').removeAttr("checked");
        $('input:radio[name=rdbRiesgoFuga][value=' + isNull(evaluacion.riesgoFuga, 0) + ']').prop('checked', true);                

        if (evaluacion.idUsuario == AdmisionEmergencia.ObtenerIdUsuarioSesion() && AdmisionEmergencia.accion == 'M') {
            $(".OpcionesCPT").show();
            $(".OpcionesRecetas").show();
            $(".OpcionesOrdenes").show();
            $(".OpcionesDiagnosticos").show();
            $("#FirmarEvalEmer").show();
            $("#evaluaciones .entrada").removeAttr("disabled");
            $("#btnGuardarEva").show();

            //////////VALIDAR SI DOCUMENTO ESTA FIRMADO////////////////
            if (evaluacion.statusFirma == 1) {
                $("#ImprimirEvalEmerCF").show();
                $("#FirmarEvalEmer").hide();
                $("#ImprimirEvalEmerSF").hide();
            } else {
                $("#ImprimirEvalEmerCF").hide();
                $("#FirmarEvalEmer").show();
                $("#ImprimirEvalEmerSF").show();
            }
            ///////////////////////////////////////////////////////////

            EvaluacionEmergencia.nuevaEvaluacion = false;
            EvaluacionEmergencia.modificaEvaluacion = true;
            EvaluacionEmergencia.modificaCabecera = false;

        } else {
            //////////VALIDAR SI DOCUMENTO ESTA FIRMADO////////////////
            if (evaluacion.statusFirma == 1) {
                $("#ImprimirEvalEmerCF").show();
                $("#ImprimirEvalEmerSF").hide();
            } else {
                $("#ImprimirEvalEmerCF").hide();
                $("#ImprimirEvalEmerSF").show();
            }
            ///////////////////////////////////////////////////////////
        }

        EvaluacionEmergencia.ValidaInformacionFamiliar();
        //EvaluacionEmergencia.idMedico = evaluacion.idMedico;
        //EvaluacionEmergencia.idServicio = evaluacion.idServicio;
        //Variables.IdMedico = EvaluacionEmergencia.idMedico;
        $('#hdIdServicioPaciente').val(evaluacion.idServicio);
        $('#hdNroEvaluacion').val(evaluacion.idNumero);

        await Diagnosticos.SeleccionarDiagnosticosPorEvaluacion(idAtencion, idServicio, nroEvaluacion, 8);
        await OrdenMedica.CargarOrdenesMedicasPorIdCuentaAtencion(Variables.IdCuentaAtencion);
        await Resultados.CargarLaboratorioMovimientosPorIdCuentaAtencion(Variables.IdCuentaAtencion);
        await Resultados.CargarImagenesMovimientosPorIdCuentaAtencion(Variables.IdCuentaAtencion);

        //Ordenes.ubicaMedico(evaluacion.idMedico);
        //const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdFuenteFinanciamiento, nroEvaluacion, idServicio, evaluacion.idMedico)
        //await Ordenes.CargarDatosRecetaCabecera(recetas);



        //console.log($('#FechaInicioAtencion').val());

        //console.log(EvaDetneo);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    ////////////////////////VALIDAR VARIABLES/////////////////////////////
    ValidarVariablesEvaluacionEmergencia() {
        if ($("#HoraInicioAtencion").val() == "" || $("#HoraInicioAtencion").val() == "__: __") {
            alerta2('info', '', 'Ingrese la Hora de Inicio de Atención');
            $("#HoraInicioAtencion").focus();
            return false;
        }

        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        if (ListDiagnosticos.length == 0 /*&& EvaluacionEmergencia.nuevaEvaluacion == true*/) {
            alerta2('info', '', 'Ingrese al menos un diagnóstico');
            $('.nav-tabs a[href="#diagnosticos"]').tab('show');
            return false;
        }

        return true;
    },


    /// <summary>
    /// CARGA DATOS A LAS VARIABLES
    /// </summary>
    /// Lista de metodos que carga los datos de la evaluacion a la variables
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CargarVariablesEvaluacionEmergencia() {
        var formData = new FormData();

        if ($("#txtPar1").val().length < 2) {
            $("#txtPar1").val('0' + $("#txtPar1").val());
        }

        if ($("#txtPar2").val().length < 2) {
            $("#txtPar2").val('0' + $("#txtPar2").val());
        }

        if ($("#txtPar3").val().length < 2) {
            $("#txtPar3").val('0' + $("#txtPar3").val());
        }

        if ($("#txtPar4").val().length < 2) {
            $("#txtPar4").val('0' + $("#txtPar4").val());
        }

        let paridad = parseInt($("#txtPar1").val()).toString() + parseInt($("#txtPar2").val()).toString() + parseInt($("#txtPar3").val()).toString() + parseInt($("#txtPar4").val()).toString();

        formData.append('IdAtencion', Variables.IdAtencion);

        formData.append('TipoPaciente', $('#cboTipoPaciente').val());
        formData.append('Prioridad', $('#cboPrioridad').val());
        formData.append('Glasgow', $('#txtGlasgow').val());

        ///////////////////////MOTIVO ATENCION//////////////////////////
        formData.append('FechaUR', $('#txtFechaFUR').val());
        formData.append('FechaEco', $('#txtFechaFUE').val());
        formData.append('FechaPP', $('#txtFechaFPP').val());
        formData.append('FechaPrimeraEco', $('#txtFechaECO').val());
        formData.append('SemPrimeraEco', $('#txtSemEco').val());
        formData.append('DiasPrimeraEco', $('#txtDiasEco').val());
        formData.append('EdadGestacional', $('#txtEGsemanas').val());
        formData.append('DiasGestacional', $('#txtEGdias').val());
        formData.append('Cnp', $('#txtCPNveces').val());
        formData.append('GMotiA', $('#txtG').val());
        formData.append('PMotiA', paridad);
        formData.append("Paridad1", $("#txtPar1").val());
        formData.append("Paridad2", $("#txtPar2").val());
        formData.append("Paridad3", $("#txtPar3").val());
        formData.append("Paridad4", $("#txtPar4").val());
                
        formData.append('Dolor', $('#chkDolor').is(":checked") ? 1 : 0);
        formData.append('Convulsiones', $('#chkConvulsion').is(":checked") ? 1 : 0);
        formData.append('Fiebre', $('#chkFiebre').is(":checked") ? 1 : 0);
        formData.append('Vomitos', $('#chkVomitos').is(":checked") ? 1 : 0);
        formData.append('ContraccionesU', $('#chkContraccionUterina').is(":checked") ? 1 : 0);
        formData.append('SangradoV', $('#chkSangradoV').is(":checked") ? 1 : 0);
        formData.append('PerdidaLA', $('#chkPerdidaLA').is(":checked") ? 1 : 0);
        formData.append('AusenciaMF', $('#chkAusenciaMF').is(":checked") ? 1 : 0);
        formData.append('SintomasU', $('#chkSintomasU').is(":checked") ? 1 : 0);
        formData.append('FlujoV', $('#chkFlujoVaginal').is(":checked") ? 1 : 0);
        formData.append('Tumoracion', $('#chkTumoracion').is(":checked") ? 1 : 0);
        formData.append('AlteracionesM', $('#chkAlteracionesM').is(":checked") ? 1 : 0);
        formData.append('DisMovFetales', $('#chkDismMovFetal').is(":checked") ? 1 : 0);
        formData.append('Otros', $('#chkOtrosSintomas').is(":checked") ? 1 : 0);

        formData.append('Antecedentes', $('#txtAntecedentes').val());
        formData.append('EnfermedadA', $('#txtEnfermedadActual').val());
        formData.append('PesoFetalAnt', $('#txtMayorPesoFetal').val());

        formData.append('RiesgoCaida', $('input:radio[name=rdbRiesgoCaida]:checked').val());

        formData.append('idServicio', Variables.IdServicioEgreso);                      

        return formData;
    },

    CargarVariablesExamenGinecoObstetra() {
        var formData = new FormData();

        /////////////////////////EXAMEN FISICO//////////////////////////////
        formData.append('IdAtencion', Variables.IdAtencion);
        formData.append('idServicio', Variables.IdServicioEgreso);

        formData.append('LEstadoGeneral', $('input:radio[name=rdbEstGS]:checked').val());
        formData.append('DEstadoGeneral', $('#txtEstdGeneSens').val());
        formData.append('DEdemas', $('#txtEdemas').val());
        formData.append('LAparatoCV', $('input:radio[name=rdbCard]:checked').val());
        formData.append('DAparatoCV', $('#txtCardVas').val());
        formData.append('DReflejos', $('#txtReflejos').val());
        formData.append('LAbdomen', $('input:radio[name=rdbAbdomen]:checked').val());
        formData.append('DAbdomen', $('#txtAbdomenNormal').val());
        formData.append('LAparatoR', $('input:radio[name=rdbAptResp]:checked').val());
        formData.append('DAparatoR', $('#txtbAptResp').val());
        formData.append('LAparatoU', $('input:radio[name=rdbAptUrin]:checked').val());
        formData.append('DAparatoU', $('#txtbAptUrin').val());
        formData.append('LExtremidades', $('input:radio[name=rdbExtrem]:checked').val());
        formData.append('DExtremidades', $('#txtExtrem').val());
        formData.append('LNeurologico', $('input:radio[name=rdbNeurologico]:checked').val());
        formData.append('DNeurologico', $('#txtNeurologico').val());
        formData.append('LPiel', $('input:radio[name=rdbPiel]:checked').val());
        formData.append('DPiel', $('#txtPiel').val());

        formData.append('LGeBus', $('input:radio[name=rdbGB]:checked').val());
        formData.append('DGeBus', $('#txtGB').val());
        formData.append('LVagina', $('input:radio[name=rdVagina]:checked').val());
        formData.append('DVagina', $('#txtVagina').val());
        formData.append('LCervix', $('input:radio[name=rdbCervix]:checked').val());
        formData.append('DCervix', $('#txtCervix').val());
        formData.append('LUtero', $('input:radio[name=rdbUtero]:checked').val());
        formData.append('DUtero', $('#txtUtero').val());
        formData.append('LAnexos', $('input:radio[name=rdbAnexos]:checked').val());
        formData.append('DAnexos', $('#txtAnexos').val());
        formData.append('LDouglas', $('input:radio[name=rdbFsDouglas]:checked').val());
        formData.append('DDouglas', $('#txtFsDouglas').val());
        formData.append('LParametros', $('input:radio[name=rdbParam]:checked').val());
        formData.append('DParametros', $('#txtParam').val());
        formData.append('LMamas', $('input:radio[name=rdbMamas]:checked').val());
        formData.append('DMamas', $('#txtMamas').val());
        formData.append('ObservacionGinecologica', $('#txtObservacionesGinecologicas').val());
        formData.append('LUA', $('#txtAlturaUterina').val());        
        formData.append('LDU', $('#txtDU').val());
        formData.append('LDips', $('input:radio[name=rdbDips]:checked').val());
        formData.append('LSoplos', $('input:radio[name=rdbSoplos]:checked').val());
        formData.append('LHidraminios', $('input:radio[name=rdbHidromios]:checked').val());
        formData.append('LPonderado', $('#txtPonderado').val());
        formData.append('LPonderadoClinico', $('#txtPonderadoClinico').val());
        formData.append('LPonderadoEcografo', $('#txtPonderadoEcografo').val());

        formData.append('LTipoEmbarazo', $('#cboTipoEmbrazo').val());
        formData.append('LSituacion', $('input:radio[name=rdbSituacion]:checked').val());
        formData.append('LPosicion', $('input:radio[name=rdbPosicion]:checked').val());
        formData.append('LPresentacion', $('input:radio[name=rdbPresentacion]:checked').val());
        formData.append('LLCF', $('#txtLfc').val());
        formData.append('MovFetales', $('#txtMovFetales').val());
                
        formData.append('DF1Spp', EvaluacionEmergencia.FormatearSPP($('input:radio[name=rdbSituacion]:checked').val(), $('input:radio[name=rdbPresentacion]:checked').val(), $('input:radio[name=rdbPosicion]:checked').val()));
        formData.append('DF2Spp', EvaluacionEmergencia.FormatearSPP($('input:radio[name=rdbSituacion2]:checked').val(), $('input:radio[name=rdbPresentacion2]:checked').val(), $('input:radio[name=rdbPosicion2]:checked').val()));
        formData.append('DF3Spp', EvaluacionEmergencia.FormatearSPP($('input:radio[name=rdbSituacion3]:checked').val(), $('input:radio[name=rdbPresentacion3]:checked').val(), $('input:radio[name=rdbPosicion3]:checked').val()));
        formData.append('LF1Lcf', $('#txtLfc').val());
        formData.append('LF2Lcf', $('#txtLfc2').val());
        formData.append('LF3Lcf', $('#txtLfc3').val());
        formData.append('MFF01', $('#txtMovFetales').val());
        formData.append('MFF02', $('#txtMovFetales2').val());
        formData.append('MFF03', $('#txtMovFetales3').val());

        formData.append('DObservacionesObstetricas', $('#txtObsservacionesObstetricas').val());
        
        formData.append('LTipoTactoVaginal', $('input:radio[name=rdbTactoVaginal]:checked').val());
        formData.append('LDilatacion', $('#txtDilatacion').val());
        formData.append('LIncorporacion', $('#txtIncorporacion').val());
        formData.append('LAlPresent', $('#txtAltPresen').val());
        formData.append('DVarPresent', $('#txtVarPresen').val());
        formData.append('MembranasRotas', $('input:radio[name=rdbMembranaRota]:checked').val());
        formData.append('LProcubito', $('input:radio[name=rdbProcubito]:checked').val());
        formData.append('LProlapso', $('input:radio[name=rdbProlapso]:checked').val());
        formData.append('DSangradoV', $('input:radio[name=rdbSangradoVaginal]:checked').val());
        formData.append('LPelvimetriaSup', $('input:radio[name=rdbPelvSuperior]:checked').val());
        formData.append('LPelvimetriaMed', $('input:radio[name=rdbPelvMedio]:checked').val());
        formData.append('LPelvimetriaInf', $('input:radio[name=rdbPelvInferior]:checked').val());
        formData.append('LPelvisGinecoide', $('input:radio[name=rdbPelvisGinecoide]:checked').val());
        formData.append('PelvisGineDesc', $('#txtPelvisGinecoide').val());
        formData.append('LLiquidoA', $('input:radio[name=rdbLiquidoAmniotico]:checked').val());
        formData.append('MalOlor', $('input:radio[name=rdbMalOlor]:checked').val());
        formData.append('LCompatibilidadF', $('input:radio[name=rdbCompFetoPelvica]:checked').val());

        return formData;
    },

    CargarVariablesEvaluacionEmergenciaDetalle() {
        var formData = new FormData();
        //var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        var objrowTb2 = oTable_EvaEmer.api(true).row('.selected').data();

        //console.log("idusu: " + objrowTb2);
        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();

        //var nroEval = isEmpty(objrowTb2) ? (oTable_EvaEmer.DataTable().data().count() + 1) : objrowTb2.idNumero;

        formData.append('IdCuentaAtencion', Variables.IdCuentaAtencion);
        formData.append('IdAtencion', Variables.IdAtencion);
        formData.append('IdNumero', EvaluacionDetalle.IdNumero);
        formData.append('IdUsuario', isEmpty(objrowTb2) ? 0 : objrowTb2.idUsuario);

        formData.append('fecha', $('#FechaInicioAtencion').val());
        formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());

        formData.append('Seguimiento', $('#txtImpresionDiagnostica').val());
        formData.append('Indicaciones', $('#txtTratamiento').val());
        formData.append('PlandeTrabajo', $('#txtPlanTrabajo').val());

        formData.append('idCuentaAtencion', Variables.IdCuentaAtencion);
        formData.append("idservicio", EvaluacionDetalle.IdServicio);
        formData.append("idMedico", EvaluacionDetalle.IdMedico);

        formData.append('InformarFamiliar', $('input:radio[name=rdbInformarFamiliar]:checked').val());
        formData.append('InformacionFamiliar', $('#txtInformacionFamiliar').val());

        formData.append('RiesgoFuga', $('input:radio[name=rdbRiesgoFuga]:checked').val());

        $('#hdNroEvaluacion').val(EvaluacionDetalle.IdNumero);

        //Diagnosticos
        formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));

        return formData;
    },

    
    /// <summary>
    /// GUARDA DATOS A LA BD
    /// </summary>
    /// Lista de metodos que guarda los datos de la evaluacion a la BD
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async GuardarEvaluacionEmergencia() {
        //Cargando(1);
        //console.log("GuardarEvaluacionNeonatal");
        var data = EvaluacionEmergencia.CargarVariablesEvaluacionEmergencia();
        var respuesta;
        var resp = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/GuardarEvaluacion?area=Emergencia",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                if (datos.estado) {
                    resp = true;
                    //alerta(1, 'La evaluación se guardó correctamente.');

                } else {
                    alerta(2, datos.msj)
                    Cargando(0)
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarEvaluacionEmergenciaDetalle() {
        //console.lo("ENTROOOOO");
        //Cargando(1);
        //console.log("GuardarEvaluacionDetalleNeonatal");
        var data = EvaluacionEmergencia.CargarVariablesEvaluacionEmergenciaDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            //Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/GuardarEvaluacionDetalle?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                if (datos.estado) {
                    idCuentaAtt = $('#txtNroCuenta').val();

                    resp = true;
                    //alerta(1, 'Los detalles de la evaluación se guardó correctamente.');
                    //Cargando(0)
                } else {
                    alerta(2, datos.msj);
                    //EvaluacionEmergencia.CerrarModuloNeonatal();
                    Cargando(0)
                }

            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina deta")
                Cargando(0)
                location.reload()
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

        ////////////////////////////////////////////////////////////
        //console.log(data);
    },

    async ActualizarHojaCabecera() {
        var formData = new FormData();

        formData.append('idCuentaAtencion', Variables.IdCuentaAtencion);
        formData.append('idAtencion', Variables.IdAtencion);

        var data = EvaluacionEmergencia.CargarVariablesEvaluacionEmergenciaDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            //Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/GenerarHojaCabecera?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            
            if (datos.session) {
                if (datos.estado) {
                    idCuentaAtt = $('#txtNroCuenta').val();

                    resp = true;
                    //alerta(1, 'Los detalles de la evaluación se guardó correctamente.');
                    //alerta2('success', '', 'La evaluación se guardó correctamente.');
                } else {
                    Cargando(0)
                    alerta(2, datos.msj);                    
                }

            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                Cargando(0)
                location.reload()
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

        ////////////////////////////////////////////////////////////
        //console.log(data);
    },

    async GuardarExamenGinecoObstetra() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionEmergencia.CargarVariablesExamenGinecoObstetra();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEmergencia/GuardarExamenGinecoObstetra?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                if (datos.estado) {
                    resp = true;
                    //alerta(1, 'El examen gíneco obstetra se guardó correctamente.')

                } else {
                    Cargando(0);
                    alerta(2, datos.msj);
                }
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    /////////////////////EVALUACIÓN OBSTETRICA/////////////////////////////////////////
    async EvaluacionObstetricaSeleccionar(IdAtencion) {
        var respuesta;
        var resp = false;
        let datos = null;
        let obj = null;
        var formData = new FormData();

        formData.append('idAtencion', IdAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/EvaluacionObstetricaSeleccionar?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            //if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    obj = datos.respuesta.table[0];

                    //$("#txtFUM").val(obj.fechaUR);
                    $("#txtFUM").datepicker("setDate", obj.fechaURFormato);
                    //$("#txtFPP").val(obj.fechaPP);
                    $("#txtFPP").datepicker("setDate", obj.fechaPPFormato);
                    //$("#txtFEcog").val(obj.fechaEco);
                    $("#txtFEcog").datepicker("setDate", obj.fechaEcoFormato);
                    $("#txtSemanas").val(obj.edadGestacional);
                    $("#txtDias").val(obj.diasGestacional);

                    $("#txtCPNveces").val(obj.cnp);

                    //Traigo la misma info porque ambas tiene q ser iguales
                    //$("#txtFPPControl").val($("#txtFPP").val());
                    $("#txtFPPControl").datepicker("setDate", $("#txtFPP").val());
                    $("#txtSemanaGestacional").val($("#txtSemanas").val());
                    $("#txtDiasGestacional").val($("#txtDias").val());

                    if (obj.calculaFE == 1) {
                        $('#chkCalculaFechaEco').prop('checked', true)
                    }
                    else {
                        $('#chkCalculaFechaEco').prop('checked', false)
                    }
                    if (obj.fechaEcoAct == 1) {
                        $('#chkMuestraEco').prop('checked', true)
                        $("#txtFEcog").attr("disabled", false);
                        $("#txtDiasEco").attr('disabled', false);
                        $("#txtSemasEco").attr('disabled', false);

                        $("#txtFUM").attr("disabled", true);
                    }
                    else {
                        $('#chkMuestraEco').prop('checked', false)
                        $("#txtFEcog").attr("disabled", true);
                        $("#txtDiasEco").attr('disabled', true);
                        $("#txtSemasEco").attr('disabled', true);

                        $("#txtFUM").prop("disabled", false);
                        $("#txtFEcog").val("");
                    }

                    if (obj.diasGestacionalEco == 0) {
                        $("#txtDiasEco").val("");
                    }
                    else {
                        $("#txtDiasEco").val(obj.diasGestacionalEco);
                    }

                    if (obj.semanaGestacionalEco == 0) {
                        $("#txtSemasEco").val("");
                    }
                    else {
                        $("#txtSemasEco").val(obj.semanaGestacionalEco);
                    }
                }
            //} else {
            //    Utilitario.CargarModalInicioSesion();
            //}
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

   

    /// <summary>
    /// OPCIONES DE LIMPIEZA
    /// </summary>
    /// Lista de metodos de limpieza variables y bloqueos
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    LimpiarModuloEmergencia() {
        $("#TabPanelRegistro input[type=text]").val("");
        $("#TabPanelRegistro textarea").val("");
        $("#TabPanelRegistro .chzn-select").val("");
        $("#TabPanelRegistro input[type=checkbox]").prop('checked', false);        
        //$("#TabPanelRegistro input:radio").attr('checked', false);
        $("#input:radio[name=rdbRiesgoCaida][value=0]").prop('checked', true);
        

        $("#lblNumeroEvaluacion").html("");
        $("#lblTipoEvaluacion").html("");

        $("#examenFisico input:radio[value=1]").prop('checked', true);
        $("#examenGinecologico input:radio[value=1]").prop('checked', true);
        $("#examenObstetrico input:radio[name=rdbDips][value=4]").prop('checked', true);
        $("#examenObstetrico input:radio[name=rdbSoplos][value=0]").prop('checked', true);
        $("#examenObstetrico input:radio[name=rdbHidromios][value=0]").prop('checked', true);
        $("#cboTipoEmbrazo").val(1);
        $("#cboTipoEmbrazo").change();

        //$("#rdbTactovaginalSi").click();        
        $("#examenTactoVaginal input:radio[name=rdbTactoVaginal][value=1]").prop('checked', true);
        EvaluacionEmergencia.BloqueoDiferido(1);
        
        //$(".frmTactoVaginal").show();
        $("#examenTactoVaginal input:radio[name=rdbPelvSuperior][value=1]").prop('checked', true);
        $("#examenTactoVaginal input:radio[name=rdbPelvMedio][value=1]").prop('checked', true);
        $("#examenTactoVaginal input:radio[name=rdbPelvInferior][value=1]").prop('checked', true);

        $("#examenTactoVaginal input:radio[name=rdbMalOlor][value=1]").prop('checked', true);

        $("#examenTactoVaginal input:radio[name=rdbPelvisGinecoide][value=1]").prop('checked', true);
        $("#examenTactoVaginal input:radio[name=rdbCompFetoPelvica][value=1]").prop('checked', true);

        
                
        $('.chzn-select').chosen().trigger("chosen:updated");
        EvaluacionEmergencia.nuevaEvaluacion = false;
        EvaluacionEmergencia.modificaEvaluacion = false;
        EvaluacionEmergencia.modificaCabecera = false;
        EvaluacionEmergencia.idMedicoPrimeraEvaluacion = 0;       
        EvaluacionEmergencia.idProCabecera = 0;
        $("#btnGuardarEva").hide();

        asigna_FechaHoraAtencion(null);
    },

    async LimpiarVistaModuloEvaluacionDetalle() {
        $("#evaluaciones input[type=text]").val("");
        $("#evaluaciones textarea").val("");
        $("#evaluaciones input[type=checkbox]").prop('checked', false);
        $("#evaluaciones input:radio[name=rdbInformarFamiliar][value=0]").prop('checked', true);
        EvaluacionEmergencia.ValidaInformacionFamiliar();

        //$("#evaluaciones input[type=date]").val("");
        //$("#evaluaciones #examenFisico input[type=radio].default").prop('checked', true);
        //$("#evaluaciones #antecedentesGenerales input[type=radio]").prop('checked', false);
        //$("#evaluaciones #antecedentesGenerales .chzn-select").val("");

        $("#lblNumeroEvaluacion").html("");
        $("#lblTipoEvaluacion").html("");

        $("#BadgeEvaluacion .msc-hotline").removeClass("bg-green");
        $("#BadgeEvaluacion .msc-hotline-icon").removeClass("bg-success");

        $("#BadgeEvaluacion .msc-hotline").removeClass("bg-blue");
        $("#BadgeEvaluacion .msc-hotline-icon").removeClass("bg-info");

        //Ordenes.ubicaFarmacia(8);
        Ordenes.ubicaFarmacia(await Utilitario.Configuracion("FarmaciaEmer")); //RMOREANO SETEAR LA FARMACIA DE EMERGENCIA

        Ordenes.limpiarCatalogoV2();
        Diagnosticos.LimpiarDiagnosticosAtencion();

        oTable_EvaEmer.$('tr.selected').removeClass('selected');
        $("#hdIdTipoFuenteFian").val(Variables.IdTipoFinanciamiento);
    },

    ValidaMembranaRotas(valor) {
        if (valor == 0) {
            $('input:radio[name=rdbLiquidoAmniotico][value=' + 5 + ']').prop('checked', true);
            $('.frmLiquidoAmniotico').hide();
        } else {
            $('.frmLiquidoAmniotico').show();
        }
    },

    FormatearSPP(situacion, presentacion, posicion) {
        let spp = ''

        if (situacion == '1') {
            spp = spp + 'L';
        } else if (situacion == '2') {
            spp = spp + 'T';
        }

        if (presentacion == '1') {
            spp = spp + 'C';
        } else if (presentacion == '2') {
            spp = spp + 'P';
        }

        if (posicion == '1') {
            spp = spp + 'D';
        } else if (posicion == '2') {
            spp = spp + 'I';
        }

        return spp;
    },

    DibujarLineasFormulaObstetrica() {
        ConectarInputs("CardFormulaObstetrica", "txtGestasP", "txtAbortos");
        ConectarInputs("CardFormulaObstetrica", "txtGestasP", "txtPartos");
        ConectarInputs("CardFormulaObstetrica", "txtPartos", "txtVaginales");
        ConectarInputs("CardFormulaObstetrica", "txtPartos", "txtCesareas");
        ConectarInputs("CardFormulaObstetrica", "txtVaginales", "txtNacMuertos");
        ConectarInputs("CardFormulaObstetrica", "txtCesareas", "txtNacidosVivos");
        ConectarInputs("CardFormulaObstetrica", "txtNacidosVivos", "txtViven");
        ConectarInputs("CardFormulaObstetrica", "txtNacidosVivos", "txt1Sem");
        ConectarInputs("CardFormulaObstetrica", "txtNacidosVivos", "txtDesp1Sem");

        ConectarInputs("CardFormulaObstetrica", "form_ch2500", "txtPartos");
        ConectarInputs("CardFormulaObstetrica", "form_chMult", "txtPartos");
        ConectarInputs("CardFormulaObstetrica", "form_ch37Sem", "txtPartos");
        ConectarInputs("CardFormulaObstetrica", "form_ch4000g", "txtPartos");
    },

    ValidaInformacionFamiliar() {
        /*
        if ($('input:radio[name=rdbInformarFamiliar]:checked').val() == 1) {
            $("#txtInformacionFamiliar").removeAttr("disabled");
        } else if ($('input:radio[name=rdbInformarFamiliar]:checked').val() == 0) {
            $("#txtInformacionFamiliar").val("");
            $("#txtInformacionFamiliar").attr('disabled', 'disabled');
        }*/
    },

    BloqueoDiferido(valor) {
        //$('#txtDilatacion').val('');
        //$('#txtIncorporacion').val('');
        //$('#txtAltPresen').val('');
        //$('#txtVarPresen').val('');

        $('input:radio[name=rdbMembranaRota][value=' + 0 + ']').prop('checked', true);
        $('input:radio[name=rdbProcubito][value=' + 0 + ']').prop('checked', true);
        $('input:radio[name=rdbProlapso][value=' + 0 + ']').prop('checked', true);
        $('input:radio[name=rdbSangradoVaginal][value="NO"]').prop('checked', true);

        EvaluacionEmergencia.ValidaMembranaRotas(0);

        if (valor == 1) {
            $('.frmTactoVaginal').show(); 
        } else {
            $('.frmTactoVaginal').hide(); 
        }        
    },

    BloquearOpcionesModificacion() {
        $(".OpcionesCPT").hide();
        $(".OpcionesRecetas").hide();
        $(".OpcionesOrdenes").hide();
        $(".OpcionesDiagnosticos").hide();
        $("#FirmarEvalEmer").hide();
        $("#ImprimirEvalEmerCF").hide();
        $("#ImprimirEvalEmerSF").hide();
        $("#evaluaciones .entrada").attr('disabled', 'disabled');
        EvaluacionEmergencia.ValidaInformacionFamiliar();
        $("#CardEva").removeClass("bg-blue");
        $("#btnGuardarEva").hide();
    },

    DesbloquearOpcionesModificacion() {
        $(".OpcionesCPT").show();
        $(".OpcionesRecetas").show();
        $(".OpcionesOrdenes").show();
        $(".OpcionesDiagnosticos").show();
        //$("#FirmarEvalEmer").show();
        $("#evaluaciones .entrada").removeAttr("disabled");
        EvaluacionEmergencia.ValidaInformacionFamiliar();
        $("#btnGuardarEva").show();
    },

    BloquearCampos() {
        $("#TabPanelRegistro .campo input[type=text]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo textarea").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo input[type=checkbox]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo input[type=radio]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo .chzn-select").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");

        $("#btnGuardarEva").hide();
        $("#btnNuevoRegistro").hide();
    },

    DesbloquearCampos() {
        $("#TabPanelRegistro .campo input[type=text]").removeAttr("disabled");
        $("#TabPanelRegistro .campo textarea").removeAttr("disabled");
        $("#TabPanelRegistro .campo input[type=checkbox]").removeAttr("disabled");
        $("#TabPanelRegistro .campo input[type=radio]").removeAttr("disabled");
        $("#TabPanelRegistro .campo .chzn-select").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");

        $("#btnGuardarEva").show();
        $("#btnNuevoRegistro").show();
    },

    BloquearCabecera() {
        $("#CardEva .PanelCabeceraEmer input[type=text]").attr('disabled', 'disabled');
        $("#CardEva .PanelCabeceraEmer textarea").attr('disabled', 'disabled');
        $("#CardEva .PanelCabeceraEmer input[type=checkbox]").attr('disabled', 'disabled');
        $("#CardEva .PanelCabeceraEmer input[type=radio]").attr('disabled', 'disabled');
        $("#CardEva .PanelCabeceraEmer .chzn-select").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    DesbloquearCabecera() {
        $("#CardEva .PanelCabeceraEmer input[type=text]").removeAttr("disabled");
        $("#CardEva .PanelCabeceraEmer textarea").removeAttr("disabled");
        $("#CardEva .PanelCabeceraEmer input[type=checkbox]").removeAttr("disabled");
        $("#CardEva .PanelCabeceraEmer input[type=radio]").removeAttr("disabled");
        $("#CardEva .PanelCabeceraEmer .chzn-select").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

       

    /// <summary>
    /// INICIAR SCRIPT Y MODULO
    /// </summary>
    /// Lista de metodos que incian la carga del módulo 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async IniciarModulo() {
        await EvaluacionEmergencia.IniciarScript();
    },

    async IniciarScript() {
        await EvaluacionEmergencia.cargaInicial();
        EvaluacionEmergencia.IniciarDataTablesEvaluacion();
        EvaluacionEmergencia.Eventos();
        Antecedentes.Iniciar();

        //EvaluacionEmergencia.AbrirModulo();
    },

    async cargaInicial() {
        EvaluacionEmergencia.nuevaEvaluacion = false;
        EvaluacionEmergencia.modificaEvaluacion = false;
        EvaluacionEmergencia.modificaCabecera = false;
        EvaluacionEmergencia.idProCabecera = 0;
        //opcionModificar = false;

        //await AdmisionEmergencia.ListarTiposGravedadAtencion();
        //await AdmisionEmergencia.ListarTiposPaciente();
        //await AdmisionEmergencia.ListarOrigenAtencionEmergencia();
        //await AdmisionEmergencia.ListarTiposEmbarazo();

        $('#FechaInicioAtencion,#txtFechaFUR,#txtFechaFUE,#txtFechaECO').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFUM').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
		$('#txtFPP').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
		$('#txtFEcog').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
		$('#txtFinEmb').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");                
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}