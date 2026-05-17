var EvaluacionEspecialidad = {
    nuevaEvaluacion: false,
    modificaEvaluacion: false,
    modificaCabecera: false,
    idMedicoPrimeraEvaluacion: 0,
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
            } else if ($("#cboTipoPaciente").val() == 1) {
                $("#examenObstetrico-tab").show();
                $("#examenTactoVaginal-tab").show();
            }
        });

        $("#txtFechaFUR").on('change', function () {
            $('#txtFechaFPP').datepicker("setDate", Utilitario.DevuelveFechaPosibleParto($("#txtFechaFUR").val()));
            //$("#txtFechaFPP").val(Utilitario.DevuelveFechaPosibleParto($("#txtFechaFUR").val()));
            $("#txtEGsemanas").val(Utilitario.DevuelveEdadGestacional($("#txtFechaFUR").val()));
            $("#txtEGdias").val(Utilitario.DevuelveDiasEdadGestacional($("#txtFechaFUR").val()));
        });

        $("#chkConFUR").on('click', function () {
            if ($('#chkConFUR').is(":checked")) {
                $("#txtFechaFUR").attr("disabled", true);
                $("#txtFechaFUR").val('');
            } else {
                $("#txtFechaFUR").attr("disabled", false);
            }

            $("#txtFechaFPP").val('');
            $("#txtEGsemanas").val('');
            $("#txtEGsemanas").val('');
        });

        $("#chkConFUE").on('click', function () {
            if ($('#chkConFUE').is(":checked")) {
                $("#txtFechaFUE").attr("disabled", true);
                $("#txtFechaFUE").val('');
            } else {
                $("#txtFechaFUE").attr("disabled", false);
            }

            $("#txtFechaFPP").val('');
            $("#txtEGsemanas").val('');
            $("#txtEGsemanas").val('');
        });

        $("#txtFechaECO").on("change", function () {
            var edadGestacional = null;
            if ($("#txtFechaECO").val() != '' && esFormatoFecha($("#txtFechaECO").val()) && $("#txtSemEco").val() != '' && $("#txtDiasEco").val() != '') {
                edadGestacional = Utilitario.CalcularEdadGestacional(Variables.FechaIngreso, $("#txtFechaECO").val(), $("#txtSemEco").val(), $("#txtDiasEco").val());
                $("#txtEGsemanas").val(edadGestacional.cantSemanas);
                $("#txtEGdias").val(edadGestacional.cantDias);
            }
        });

        $("#txtSemEco").on("change", function () {
            if ($("#txtFechaECO").val() != '' && esFormatoFecha($("#txtFechaECO").val()) && $("#txtSemEco").val() != '' && $("#txtDiasEco").val() != '') {
                edadGestacional = Utilitario.CalcularEdadGestacional(Variables.FechaIngreso, $("#txtFechaECO").val(), $("#txtSemEco").val(), $("#txtDiasEco").val());
                $("#txtEGsemanas").val(edadGestacional.cantSemanas);
                $("#txtEGdias").val(edadGestacional.cantDias);
            }
        });

        $("#txtDiasEco").on("change", function () {
            if ($("#txtFechaECO").val() != '' && esFormatoFecha($("#txtFechaECO").val()) && $("#txtSemEco").val() != '' && $("#txtDiasEco").val() != '') {
                edadGestacional = Utilitario.CalcularEdadGestacional(Variables.FechaIngreso, $("#txtFechaECO").val(), $("#txtSemEco").val(), $("#txtDiasEco").val());
                $("#txtEGsemanas").val(edadGestacional.cantSemanas);
                $("#txtEGdias").val(edadGestacional.cantDias);
            }
        });

        $(".rdbTactoVaginal").on('click', function () {
            if ($('input:radio[name=rdbTactoVaginal]:checked').val() == 1) {
                EvaluacionEspecialidad.BloqueoDiferido(1);
            } else if ($('input:radio[name=rdbTactoVaginal]:checked').val() == 0) {
                EvaluacionEspecialidad.BloqueoDiferido(0);
            }
        });

        $(".rdbMembranaRota").on('click', function () {
            if ($('input:radio[name=rdbMembranaRota]:checked').val() == 1) {
                EvaluacionEspecialidad.ValidaMembranaRotas(1);
            } else if ($('input:radio[name=rdbMembranaRota]:checked').val() == 0) {
                EvaluacionEspecialidad.ValidaMembranaRotas(0);
            }
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
            EvaluacionEspecialidad.LimpiarVistaModuloEvaluacionDetalle();
            EvaluacionEspecialidad.BloquearOpcionesModificacion();

            //oTable_EvaEmer.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();

            if (!isEmpty(objrowTb)) {
                EvaluacionDetalle.Cargar(objrowTb);
                if (EvaluacionDetalle.IdNumero > 0) {
                    //await EvaluacionEspecialidad.CargarDatosEvaluacionDetalle(Variables.IdAtencion, Variables.IdServicioEgreso, EvaluacionEspecialidad.nroEvaluacion);                    
                    await EvaluacionEspecialidad.CargarDatosEvaluacionDetalle(EvaluacionDetalle.IdAtencion, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdNumero);
                }
                $("#evaluaciones-tab").click();
            } else {
                swal({
                    title: 'Evaluaciones',
                    text: "No se ha seleccionado ninguna evaluación.",
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
            }
        });

        $('.OpcionEvalEmer').on('click', async function () {
            EvaluacionEspecialidad.nuevaEvaluacion = false;
            EvaluacionEspecialidad.modificaEvaluacion = false;
            EvaluacionEspecialidad.modificaCabecera = false;

            $("#FirmarEvalEmer").show();
            $("#ImprimirEvalEmerCF").show();
            $("#ImprimirEvalEmerSF").show();

            $("#CardEva").removeClass("bg-blue");
            $('#tblEvaluacionesEmergencia tbody').find('tr').removeClass("selected");
            //$("#FirmarEvalEmer").attr("href", "");  (COMNETADO POR KHOYOSI - FIRMA ANTERIOR)

            ///////////COMENTADO POR KHOYOSI////////////////
            if (AdmisionEmergencia.accion == 'M') {
                if (EvaluacionEspecialidad.idMedicoPrimeraEvaluacion > 0) {
                    if (EvaluacionEspecialidad.idMedicoPrimeraEvaluacion == await Utilitario.ObtenerIdMedicoSesion()) {
                        EvaluacionEspecialidad.modificaCabecera = true;
                        EvaluacionEspecialidad.DesbloquearCabecera();
                        $("#btnGuardarEva").show();
                    } else {
                        EvaluacionEspecialidad.modificaCabecera = false;
                        EvaluacionEspecialidad.BloquearCabecera();
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
            var eval = oTable_EvaEmer.DataTable().data().count();

            EvaluacionDetalle.IdMedico = await Utilitario.ObtenerIdMedicoSesion();
            EvaluacionDetalle.IdServicio = Variables.IdServicioEgreso;
            EvaluacionDetalle.IdNumero = eval + 1;

            OrdenMedica.nroEvaluaciones = eval;

            $('#hdNroEvaluacion').val(EvaluacionDetalle.IdNumero);

            if (EvaluacionDetalle.IdMedico > 0) {
                EvaluacionEspecialidad.LimpiarVistaModuloEvaluacionDetalle();
                EvaluacionEspecialidad.DesbloquearOpcionesModificacion();

                $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-success");
                $("#CardEva").addClass("bg-blue");

                $("#lblNumeroEvaluacion").html("Evaluación N° " + (eval + 1));
                $("#lblTipoEvaluacion").html("Nueva Evaluación");


                $('#FechaInicioAtencion').attr('readonly', 'readonly');
                $('#FechaInicioAtencion').datepicker('setStartDate', moment(moment(ConvertirFormatoFecha(Variables.FechaIngreso)).toDate()).toDate().format('dd/mm/yyyy'));
                $('#FechaInicioAtencion').datepicker('setEndDate', moment().toDate());
                $('#FechaInicioAtencion').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

                $('#HoraInicioAtencion').val(moment().toDate().format('HH:MM'));

                EvaluacionEspecialidad.nuevaEvaluacion = true;
                EvaluacionEspecialidad.modificaEvaluacion = false;
                EvaluacionEspecialidad.modificaCabecera = false;
                //EvaluacionEspecialidad.idMedico = Utilitario.ObtenerIdMedicoSesion();

                $('.nav-tabs a[href="#diagnosticos-tab"]').tab('show');     //KHOYOSI

                swal({
                    title: 'Evaluaciones',
                    text: "Paciente iniciará la evaluación N° " + (eval + 1),
                    type: 'info',
                    allowOutsideClick: false,
                }).done();

                $("#evaluaciones-tab").click();
            } else {
                swal({
                    title: 'Evaluaciones',
                    text: "Usted no tiene rol de médico para realizar una evaluación",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
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

            Cargando(1);
            Utilitario.TipoArchivoFirmar = 'EMER-EVA-DET';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(Variables.IdCuentaAtencion, EvaluacionNeonatal.nroEvaluacion, Variables.IdServicioIngreso);
                if (!isEmpty(paquete)) {            
                    await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data)
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru(Variables.IdCuentaAtencion, Variables.IdServicioIngreso, EvaluacionNeonatal.nroEvaluacion);
            }

            
            Cargando(0);
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
                if (eval == 0 && EvaluacionEspecialidad.nuevaEvaluacion == false) {
                    alerta(2, "No se ha registrado ninguna evaluación. Por favor registre una evaluación.");
                } else {
                    if (EvaluacionEspecialidad.ValidarVariablesEvaluacionEmergencia()) {
                        Cargando(1);
                        Triaje.GuardarTriajeHospEmeg(Variables.IdAtencion, Variables.IdServicioIngreso, 0);
                        const data1 = await EvaluacionEspecialidad.GuardarEvaluacionEmergencia();
                        const data2 = await EvaluacionEspecialidad.GuardarExamenFisico();

                        if (EvaluacionEspecialidad.nuevaEvaluacion == true || EvaluacionEspecialidad.modificaEvaluacion == true) {
                            if (data1 == true && data2 == true) {
                                const data3 = await EvaluacionEspecialidad.GuardarEvaluacionEmergenciaDetalle();

                                let nuevaEval = EvaluacionEspecialidad.nuevaEvaluacion;
                                EvaluacionEspecialidad.CargarEvaluacionDetalle(EvaluacionDetalle.IdNumero);

                                if (nuevaEval == true) {
                                    swal({
                                        title: 'EMERGENCIA',
                                        html: "La evaluación se guardó correctamente. <br><br>¿Desea generar una receta/orden médica?",
                                        type: 'success',
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

                                //if (data3) {
                                //    alerta2('success', 'EMERGENCIA', 'La evaluación se guardó correctamente.');
                                //}
                                //const data5 =  await Diagnosticos.GuardarDiagnosticosPorEvaluacion(Variables.IdAtencion, 8, Variables.IdServicioEgreso, EvaluacionEspecialidad.nroEvaluacion);                            
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
                            if (EvaluacionEspecialidad.modificaCabecera == true) {
                                const data4 = EvaluacionEspecialidad.ActualizarHojaCabecera();
                                if (data4) {
                                    alerta2('success', 'EMERGENCIA', 'La evaluación se guardó correctamente.');
                                }
                            }
                        }

                        //EvaluacionEspecialidad.CargarEvaluacion();
                        //EvaluacionEspecialidad.LimpiarModuloEmergencia();
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
                text: "¿Esta seguro de cerrar el módulo de evaluación?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            }).then(function () {
                console.log("Cerrar desde archivo EvaluacionEspecialidades.js");
                AdmisionEmergencia.limpiarRecetas()
                EvaluacionEspecialidad.LimpiarModuloEmergencia();
                AdmisionEmergencia.CerrarModulo();
                ReposicionarVista();
                MostrarAreaLista();
                $("#btnBuscarAtencionesEmergencia").click();
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
                //const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionEspecialidad.nroEvaluacion, Variables.IdServicioIngreso, Variables.IdMedico);
                const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdMedico);
                VisorReceta.AbrirVisorRecetas(recetas);
            }
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    ModificarEvaluacion() {
        EvaluacionEspecialidad.CargarEvaluacion();
        EvaluacionEspecialidad.DesbloquearCampos();
        //$("#btnGuardarEva").hide();
        //console.log("ENTROO");
    },

    ConsultarEvaluacion() {
        EvaluacionEspecialidad.CargarEvaluacion();
        EvaluacionEspecialidad.BloquearCampos();
        //console.log("ENTROO");
    },

    CargarEvaluacion() {
        //opcionModificar = true;
        //var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

        //this.LimpiarModal();
        //this.HabilitarModal();
        AdmisionEmergencia.limpiarRecetas()
        EvaluacionEspecialidad.LimpiarModuloEmergencia();
        //Triaje.listaTriajeEmgHosp(objrow.idAtencion, objrow.idServicioEgreso, 0);
        EvaluacionEspecialidad.CargarDatosEvaluacion();
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

    CargarEvaluacionDetalle(idEval) {
        AdmisionEmergencia.limpiarRecetas()
        EvaluacionEspecialidad.LimpiarModuloEmergencia();
        EvaluacionEspecialidad.CargarDatosEvaluacion();
        ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)

        let evaluacion = oTable_EvaEmer.fnGetNodes()[idEval - 1];
        evaluacion.click();
        $('.nav-tabs a[href="#diagnosticos-tab"]').tab('show');
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// <summary>
    /// CARGA DATOS DESDE LA BD
    /// </summary>
    /// Lista de metodos que carga los datos de la evaluacion desde la BD
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    SeleccionarEvaluacion(idAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        var dataEvaluacion = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionEspecialidades/SeleccionarEvaluacion?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    if (datos.respuesta.table.length > 0) {
                        dataEvaluacion = datos.respuesta.table[0];
                    }
                    else {
                        dataEvaluacion = [];
                    }
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataEvaluacion);
        return dataEvaluacion;
    },

    SeleccionarEvaluacionDetalle(idAtencion, idServicio) {
        Cargando(1);
        oTable_EvaEmer.fnClearTable();
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        var dataEvaluacionDetalle = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionEspecialidades/SeleccionarEvaluacionDetalle?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    $("#btnNuevoRegistro").text("");
                    if (datos.respuesta.table.length > 0) {
                        $("#PanelEvaluaciones").show();
                        $("#btnNuevoRegistro").append('<i style="width: 20px; text-align: center;" class="fa-solid fa-file-plus"></i> REEVALUAR');
                        dataEvaluacionDetalle = datos.respuesta.table;
                        oTable_EvaEmer.fnAddData(dataEvaluacionDetalle);
                        EvaluacionEspecialidad.idMedicoPrimeraEvaluacion = datos.respuesta.table[0].idMedico;

                        OrdenMedica.nroEvaluaciones = datos.respuesta.table.length;
                    }
                    else {
                        $("#PanelEvaluaciones").hide();
                        $("#btnNuevoRegistro").append('<i style="width: 20px; text-align: center;" class="fa-solid fa-file-plus"></i> EVALUAR');
                        dataEvaluacionDetalle = [];
                    }
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataReferencia);
        return dataEvaluacionDetalle;
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
                    url: "/EvaluacionEspecialidades/SeleccionarEvaluacionDetallePorEvaluacion?area=Emergencia",
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

    SeleccionarExamenFisico(idAtencion, idServicio) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        var dataExamenGinecoObstetra = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionEspecialidades/SeleccionarExamenFisico?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    if (datos.respuesta.table.length > 0) {
                        dataExamenGinecoObstetra = datos.respuesta.table[0];
                    }
                    else {
                        dataExamenGinecoObstetra = [];
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataReferencia);
        return dataExamenGinecoObstetra;
    },

    SeleccionarAntecedentes(idAtencion) {

    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// CARGA DATOS A LA VISTA
    /// </summary>
    /// Carga los datos de la evaluacion a la vista
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CargarDatosEvaluacion() {
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        $("#txtPaciente").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtPacienteNombre").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        //$("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtNroHistoria").val(objrowTb.nroHistoriaClinica);
        $("#txtHistoria").val(objrowTb.nroHistoriaClinica);
        //$("#HistoriaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-clipboard-medical'></i><b>Historia: </b>" + objrowTb.nroHistoriaClinica);
        $("#txtTipoDocumentoEmer").val(objrowTb.tipoDocumento);
        $("#txtNroDocumentoEmer").val(objrowTb.nroDocumento);
        ///$("#txtEdadAnio").val(objrowTb.edadEnAnio);
        ///$("#txtEdadMes").val(objrowTb.edadEnMes);
        ///$("#txtEdadDia").val(objrowTb.edadEnDia);
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

        Triaje.listaTriajeEmgHosp(Variables.IdAtencion, Variables.IdServicioIngreso, 0);

        var EvaEsp = EvaluacionEspecialidad.SeleccionarEvaluacion(Variables.IdAtencion);
        //var EvaDetEmer = EvaluacionEspecialidad.SeleccionarEvaluacionDetalle(Variables.IdAtencion, Variables.IdServicioEgreso);
        var EvaDetEmer = EvaluacionEspecialidad.SeleccionarEvaluacionDetalle(Variables.IdAtencion, 0);
        var ExaFisico= EvaluacionEspecialidad.SeleccionarExamenFisico(Variables.IdAtencion, Variables.IdServicioEgreso);

        //----------------------EVALUACION EMERGENCIA-----------------------//
        //$("#txtEdadAnio").val(EvaEsp.edadEnAnio);
        //$("#txtEdadMes").val(EvaEsp.edadEnMes);
        //$("#txtEdadDia").val(EvaEsp.edadEnDia);

        let edad = calcularEdad_v2(objrowTb.fechaNacimiento);
        $("#txtEdadAnio").val(edad.años);
        $("#txtEdadMes").val(edad.meses);
        $("#txtEdadDia").val(edad.dias);

        if (EvaEsp && EvaEsp.glasgow !== undefined && EvaEsp.glasgow !== null) {
            $('#txtGlasgow').val(EvaEsp.glasgow);
            $('#txtGlasgowTriaje').val(EvaEsp.glasgow);//19:49
        }

        //----------------------MOTIVO ATENCION-----------------------//        
        $('#chkDolor').prop('checked', EvaEsp.dolor);
        $('#chkConvulsion').prop('checked', EvaEsp.convulsiones);
        $('#chkFiebre').prop('checked', EvaEsp.fiebre);
        $('#chkVomitos').prop('checked', EvaEsp.vomitos);
        $('#chkDiarrea').prop('checked', EvaEsp.diarrea);
        $('#chkHemorragia').prop('checked', EvaEsp.hemorragia);

        $('#chkDificultadRespiratoria').prop('checked', EvaEsp.dificultadRespiratoria);
        $('#chkDistensionAbdominal').prop('checked', EvaEsp.distensionAbdominal);
        $('#chkCianosis').prop('checked', EvaEsp.cianosis);
        $('#chkMalOlorOmbligo').prop('checked', EvaEsp.malOlorOmbligo);
        $('#chkIctericia').prop('checked', EvaEsp.ictericia);
        $('#chkContraccionUterina').prop('checked', EvaEsp.contraccionesU);

        $('#chkSangradoV').prop('checked', EvaEsp.sangradoV);
        $('#chkPerdidaLA').prop('checked', EvaEsp.perdidaLA);
        $('#chkAusenciaMF').prop('checked', EvaEsp.ausenciaMF);
        $('#chkSintomasU').prop('checked', EvaEsp.sintomasU);
        $('#chkFlujoVaginal').prop('checked', EvaEsp.flujoV);
        $('#chkTumoracion').prop('checked', EvaEsp.tumoracion);

        $('#chkAlteracionesM').prop('checked', EvaEsp.alteracionesM);
        $('#chkDismMovFetal').prop('checked', EvaEsp.disMovFetales);
        $('#chkOtrosSintomas').prop('checked', EvaEsp.otros);
                
        $('#txtEnfermedadActual').val(EvaEsp.enfermedadA);
        $('#txtAntecedentes').val(EvaEsp.antecedentes);

        $('#txtApetito').val(EvaEsp.apetitoAte);
        $('#txtOrina').val(EvaEsp.orinaAte);
        $('#txtSuenio').val(EvaEsp.suenioAte);
        $('#txtSed').val(EvaEsp.sedAte);
        $('#txtDiposiciones').val(EvaEsp.deposicionesAte);
        
        //console.log(ExaGineObs);
        if (ExaFisico.length != 0) {
            //----------------------EXAMEN FISICO-----------------------//        
            $('input:radio[name=rdbEstGS][value=' + ExaFisico.lEstadoGeneral + ']').attr('checked', true);
            $('#txtEstdGeneSens').val(ExaFisico.dEstadoGeneral);
            $('#txtEdemas').val(ExaFisico.dEdemas);
            $('input:radio[name=rdbCard][value=' + ExaFisico.lAparatoCV + ']').attr('checked', true);
            $('#txtCardVas').val(ExaFisico.dAparatoCV);
            $('#txtReflejos').val(ExaFisico.dReflejos);
            $('input:radio[name=rdbAbdomen][value=' + ExaFisico.lAbdomen + ']').attr('checked', true);
            $('#txtAbdomenNormal').val(ExaFisico.dAbdomen);
            $('input:radio[name=rdbNeurologico][value=' + ExaFisico.lNeurologico + ']').attr('checked', true);
            $('#txtNeurologico').val(ExaFisico.dNeurologico);
            $('input:radio[name=rdbAptResp][value=' + ExaFisico.lAparatoR + ']').attr('checked', true);
            $('#txtbAptResp').val(ExaFisico.dAparatoR);
            $('input:radio[name=rdbAptUrin][value=' + ExaFisico.lAparatoU + ']').attr('checked', true);
            $('#txtbAptUrin').val(ExaFisico.dAparatoU);
            $('input:radio[name=rdbExtrem][value=' + ExaFisico.lExtremidades + ']').attr('checked', true);
            $('#txtExtrem').val(ExaFisico.dExtremidades);           
            $('input:radio[name=rdbPiel][value=' + ExaFisico.lPiel + ']').attr('checked', true);
            $('#txtPiel').val(ExaFisico.dPiel);
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async CargarDatosEvaluacionDetalle(idAtencion, idServicio, nroEvaluacion) {
        $("#BadgeEvaluacion .msc-hotline").addClass("bg-blue");
        $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-info");

        $("#lblNumeroEvaluacion").html("Evaluación N° " + nroEvaluacion);
        $("#lblTipoEvaluacion").html("Evaluación Registrada");

        var evaluacion = await EvaluacionEspecialidad.SeleccionarEvaluacionDetallePorEvaluacion(idAtencion, idServicio, nroEvaluacion);
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

            EvaluacionEspecialidad.nuevaEvaluacion = false;
            EvaluacionEspecialidad.modificaEvaluacion = true;
            EvaluacionEspecialidad.modificaCabecera = false;

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

        //EvaluacionEspecialidad.idMedico = evaluacion.idMedico;
        //EvaluacionEspecialidad.idServicio = evaluacion.idServicio;
        //Variables.IdMedico = EvaluacionEspecialidad.idMedico;
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
            alerta('2', 'Ingrese la Hora de Inicio de Atención');
            $("#HoraInicioAtencion").focus();
            return false;
        }

        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        if (ListDiagnosticos.toArray().length == 0/* && EvaluacionNeonatal.nuevaEvaluacion == true*/) {
            alerta('2', 'Ingresa un diagnóstico');
            $('.nav-tabs a[href="#diagnosticos"]').tab('show');
            return false;
        }

        return true;
    },

    obtenerGlasgowSegunTipoPaciente() {
        const idTipoPaciente = ($('#cboTipoPaciente').val() || '').toString();
        const descripcionTipoPaciente = ($('#cboTipoPaciente option:selected').text() || '').toLowerCase();
        const esPediatrico = descripcionTipoPaciente.includes('pediatr');
        const usaGlasgowCabecera = esPediatrico || idTipoPaciente === '3'; //19:49

        const glasgowCabecera = ($('#txtGlasgow').val() || '').trim();
        const glasgowTriaje = ($('#txtGlasgowTriaje').val() || '').trim();

        if (usaGlasgowCabecera) {
            return glasgowCabecera || glasgowTriaje;
        }

        return glasgowTriaje || glasgowCabecera;
    },


    /// <summary>
    /// CARGA DATOS A LAS VARIABLES
    /// </summary>
    /// Lista de metodos que carga los datos de la evaluacion a la variables
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CargarVariablesEvaluacionEmergencia() {
        var formData = new FormData();

        formData.append('IdAtencion', Variables.IdAtencion);

        formData.append('TipoPaciente', $('#cboTipoPaciente').val());
        formData.append('Prioridad', $('#cboPrioridad').val());
        //formData.append('Glasgow', $('#txtGlasgow').val());
        formData.append('Glasgow', EvaluacionEspecialidad.obtenerGlasgowSegunTipoPaciente()); //19:49

        ///////////////////////MOTIVO ATENCION//////////////////////////
        /*formData.append('FechaUR', $('#txtFechaFUR').val());
        formData.append('FechaEco', $('#txtFechaFUE').val());
        formData.append('FechaPP', $('#txtFechaFPP').val());
        formData.append('FechaPrimeraEco', $('#txtFechaECO').val());
        formData.append('SemPrimeraEco', $('#txtSemEco').val());
        formData.append('DiasPrimeraEco', $('#txtDiasEco').val());
        formData.append('EdadGestacional', $('#txtEGsemanas').val());
        formData.append('DiasGestacional', $('#txtEGdias').val());
        formData.append('Cnp', $('#txtCPNveces').val());
        formData.append('GMotiA', $('#txtG').val());
        formData.append('PMotiA', $('#txtP').val());*/

        formData.append('Dolor', $('#chkDolor').is(":checked") ? 1 : 0);
        formData.append('Convulsiones', $('#chkConvulsion').is(":checked") ? 1 : 0);
        formData.append('Fiebre', $('#chkFiebre').is(":checked") ? 1 : 0);
        formData.append('Vomitos', $('#chkVomitos').is(":checked") ? 1 : 0);
        formData.append('Vomitos', $('#chkVomitos').is(":checked") ? 1 : 0);
        formData.append('Vomitos', $('#chkVomitos').is(":checked") ? 1 : 0);
        formData.append('Diarrea', $('#chkDiarrea').is(":checked") ? 1 : 0);
        formData.append('Hemorragia', $('#chkHemorragia').is(":checked") ? 1 : 0);

        formData.append('DificultadRespiratoria', $('#chkDificultadRespiratoria').is(":checked") ? 1 : 0);
        formData.append('DistensionAbdominal', $('#chkDistensionAbdominal').is(":checked") ? 1 : 0);
        formData.append('Cianosis', $('#chkCianosis').is(":checked") ? 1 : 0);
        formData.append('MalOlorOmbligo', $('#chkMalOlorOmbligo').is(":checked") ? 1 : 0);
        formData.append('Ictericia', $('#chkIctericia').is(":checked") ? 1 : 0);
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

        formData.append('Apetito', $('#txtApetito').val());
        formData.append('Orina', $('#txtOrina').val());
        formData.append('Suenio', $('#txtSuenio').val());
        formData.append('Sed', $('#txtSed').val());
        formData.append('Deposiciones', $('#txtDiposiciones').val());

        formData.append('idServicio', Variables.IdServicioEgreso);

        return formData;
    },

    CargarVariablesExamenFisico() {
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

        /*
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

        formData.append('DF1Spp', EvaluacionEspecialidad.FormatearSPP($('input:radio[name=rdbSituacion]:checked').val(), $('input:radio[name=rdbPresentacion]:checked').val(), $('input:radio[name=rdbPosicion]:checked').val()));
        formData.append('DF2Spp', EvaluacionEspecialidad.FormatearSPP($('input:radio[name=rdbSituacion2]:checked').val(), $('input:radio[name=rdbPresentacion2]:checked').val(), $('input:radio[name=rdbPosicion2]:checked').val()));
        formData.append('DF3Spp', EvaluacionEspecialidad.FormatearSPP($('input:radio[name=rdbSituacion3]:checked').val(), $('input:radio[name=rdbPresentacion3]:checked').val(), $('input:radio[name=rdbPosicion3]:checked').val()));
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
        formData.append('LCompatibilidadF', $('input:radio[name=rdbCompFetoPelvica]:checked').val());*/

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
        var data = EvaluacionEspecialidad.CargarVariablesEvaluacionEmergencia();
        var respuesta;
        var resp = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEspecialidades/GuardarEvaluacion?area=Emergencia",
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
        var data = EvaluacionEspecialidad.CargarVariablesEvaluacionEmergenciaDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            //Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEspecialidades/GuardarEvaluacionDetalle?area=Emergencia",
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
                    //EvaluacionEspecialidad.CerrarModuloNeonatal();
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

        var data = EvaluacionEspecialidad.CargarVariablesEvaluacionEmergenciaDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            //Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEspecialidades/GenerarHojaCabecera?area=Emergencia",
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

    async GuardarExamenFisico() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionEspecialidad.CargarVariablesExamenFisico();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionEspecialidades/GuardarExamenEspecialidades?area=Emergencia",
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


    /// <summary>
    /// OPCIONES DE LIMPIEZA
    /// </summary>
    /// Lista de metodos de limpieza variables y bloqueos
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    LimpiarModuloEmergencia() {
        $("#TabPanelRegistro input[type=text]").val("");
        $("#TabPanelRegistro textarea").val("");
        $("#TabPanelRegistro input[type=checkbox]").prop('checked', false);
        //$("#TabPanelRegistro input:radio").attr('checked', false);

        $("#lblNumeroEvaluacion").html("");
        $("#lblTipoEvaluacion").html("");

        $("#examenFisico input:radio[value=1]").attr('checked', true);
        $("#examenGinecologico input:radio[value=1]").attr('checked', true);
        $("#examenObstetrico input:radio[name=rdbDips][value=4]").attr('checked', true);
        $("#examenObstetrico input:radio[name=rdbSoplos][value=0]").attr('checked', true);
        $("#examenObstetrico input:radio[name=rdbHidromios][value=0]").attr('checked', true);
        $("#cboTipoEmbrazo").val(1);
        $("#cboTipoEmbrazo").change();

        //$("#rdbTactovaginalSi").click();        
        $("#examenTactoVaginal input:radio[name=rdbTactoVaginal][value=1]").attr('checked', true);
        EvaluacionEspecialidad.BloqueoDiferido(1);

        //$(".frmTactoVaginal").show();
        $("#examenTactoVaginal input:radio[name=rdbPelvSuperior][value=1]").attr('checked', true);
        $("#examenTactoVaginal input:radio[name=rdbPelvMedio][value=1]").attr('checked', true);
        $("#examenTactoVaginal input:radio[name=rdbPelvInferior][value=1]").attr('checked', true);

        $("#examenTactoVaginal input:radio[name=rdbMalOlor][value=1]").attr('checked', true);

        $("#examenTactoVaginal input:radio[name=rdbPelvisGinecoide][value=1]").attr('checked', true);
        $("#examenTactoVaginal input:radio[name=rdbCompFetoPelvica][value=1]").attr('checked', true);

        $('.chzn-select').chosen().trigger("chosen:updated");
        EvaluacionEspecialidad.nuevaEvaluacion = false;
        EvaluacionEspecialidad.modificaEvaluacion = false;
        EvaluacionEspecialidad.modificaCabecera = false;
        EvaluacionEspecialidad.idMedicoPrimeraEvaluacion = 0;

        $("#txtGlasgow").hide();
        $("#btnGuardarEva").hide();

        asigna_FechaHoraAtencion(null);
    },

    LimpiarVistaModuloEvaluacionDetalle() {
        $("#evaluaciones input[type=text]").val("");
        $("#evaluaciones textarea").val("");
        $("#evaluaciones input[type=checkbox]").prop('checked', false);

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

        Ordenes.ubicaFarmacia(8);
        Ordenes.limpiarCatalogoV2();
        Diagnosticos.LimpiarDiagnosticosAtencion();

        oTable_EvaEmer.$('tr.selected').removeClass('selected');

        $("#hdIdTipoFuenteFian").val(Variables.IdTipoFinanciamiento);
    },

    ValidaMembranaRotas(valor) {
        if (valor == 0) {
            $('input:radio[name=rdbLiquidoAmniotico][value=' + 5 + ']').attr('checked', true);
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

    BloqueoDiferido(valor) {
        //$('#txtDilatacion').val('');
        //$('#txtIncorporacion').val('');
        //$('#txtAltPresen').val('');
        //$('#txtVarPresen').val('');

        $('input:radio[name=rdbMembranaRota][value=' + 0 + ']').attr('checked', true);
        $('input:radio[name=rdbProcubito][value=' + 0 + ']').attr('checked', true);
        $('input:radio[name=rdbProlapso][value=' + 0 + ']').attr('checked', true);
        $('input:radio[name=rdbSangradoVaginal][value="NO"]').attr('checked', true);

        EvaluacionEspecialidad.ValidaMembranaRotas(0);

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
        await EvaluacionEspecialidad.IniciarScript();
    },

    async IniciarScript() {
        await EvaluacionEspecialidad.cargaInicial();
        EvaluacionEspecialidad.IniciarDataTablesEvaluacion();
        EvaluacionEspecialidad.Eventos();

        //EvaluacionEspecialidad.AbrirModulo();
    },

    async cargaInicial() {
        EvaluacionEspecialidad.nuevaEvaluacion = false;
        EvaluacionEspecialidad.modificaEvaluacion = false;
        EvaluacionEspecialidad.modificaCabecera = false;
        //opcionModificar = false;

        await AdmisionEmergencia.ListarTiposGravedadAtencion();
        await AdmisionEmergencia.ListarTiposPaciente();
        await AdmisionEmergencia.ListarOrigenAtencionEmergencia();
        await AdmisionEmergencia.ListarTiposEmbarazo();

        $('#FechaInicioAtencion,#txtFechaFUR,#txtFechaFUE,#txtFechaECO').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");

        
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}