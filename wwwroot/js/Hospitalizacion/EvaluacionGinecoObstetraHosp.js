var EvaluacionGinecoObstetra = {
    nuevaEvaluacion: false,
    modificaEvaluacion: false,
    modificaCabecera: false,
    idMedicoPrimeraEvaluacion: 0,

    tipoEstablecimiento: 0,
    //idMedico: 0,
    //nroEvaluacion: 0,
    //idServicio: 0,

    /// <summary>
    /// EVENTOS
    /// </summary>
    /// Carga los eventos que se encargan de la interaccion y acciones en las vistas para el módulo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {

        $("#btnImprimeSeguimientoCPN").on('click', function () {
            SeguimientoPacienteCPN.limpiaDatos();
            
            //console.log(objrow)
            SeguimientoPacienteCPN.llendaDatos(Variables.NroHistoriaClinica)
            $("#modalSeguimientoCPN").modal('show');
        })

        $("#btnCerrarSeguimientoCPN").on('click', function () {
            $("#modalSeguimientoCPN").modal('hide');
        })

        $('#dxIngresoHospitalizacion-tab').on('click', function () {
            Diagnosticos.PanelDx = '#PanelDiagnostico3 ';
        });

        $('#tblEstSaludUci tbody').on('click', 'tr', function (e) {

            oTable_establecimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })
        $('#tblEstSaludUci tbody').on('dblclick', 'tr', function (e) {

            oTable_establecimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrow = oTable_establecimientos.api(true).row('.selected').data();

            if (EvaluacionGinecoObstetra.tipoEstablecimiento == 1) {
                $('#txtIdReferenciaEESSGA').val(objrow.idEstablecimiento)
                $('#txtCodigoReferenciaEESSGA').val(objrow.codigo)
                $('#txtDescripcionReferenciaEESSGA').val(objrow.nombre)
            } else if (EvaluacionGinecoObstetra.tipoEstablecimiento == 2) {
                $('#txtIdReferenciaOtroEESSGA').val(objrow.idEstablecimiento)
                $('#txtCodigoReferenciaOtroEESSGA').val(objrow.codigo)
                $('#txtDescripcionReferenciaOtroEESSGA').val(objrow.nombre)
            }




            $('#modalEstablecimientosUciBuscar').modal('hide')
        })

        $('#cmbdepEstUcibuscar').on('change', function () {
            $('#cmbprovEstUciBuscar').empty();
            EvaluacionGinecoObstetra.ListaProvincias();
        });

        $('#cmbprovEstUciBuscar').on('change', function () {
            $('#cmbdistEstUciBuscar').empty();
            EvaluacionGinecoObstetra.ListaDistrito();
        });

        $('#btnBuscarEstablecimientoUci').off().on('click', function () {
            let formData = new FormData()

            formData.append('codigoRenaes', $('#codigoEstUciBuscar').val())
            formData.append('nombreEstablecimiento', $('#nombreEstUciBuscar').val())
            formData.append('idDepartamento', $('#cmbdepEstUcibuscar').val())
            formData.append('idProvincia', $('#cmbprovEstUciBuscar').val())
            formData.append('idDistrito', $('#cmbdistEstUciBuscar').val())

            fetch('/citas/ListarEstablecimientosReferenciaV2?area=ConsultaExterna', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .catch(error => console.error('error:', error))
                .then(response => {
                    Cargando(1)
                    oTable_establecimientos.fnClearTable()
                    if (response.dataSet.table.length > 0) {
                        oTable_establecimientos.fnAddData(response.dataSet.table);
                    }
                    Cargando(0)
                });
        })
        $("#btnGuardarClap").off().on('click', async function () {
            //var eval = oTable_EvaHosp.DataTable().data().count();

            sesion = Utilitario.ValidarSesion();
            if (sesion) {
                Cargando(1);

                Diagnosticos.PanelDx = '#PanelDiagnosticoClap ';
                ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();

                if (ListDiagnosticos.toArray().length == 0) {
                    alerta(2, 'Debe Ingresar un diagnostico')
                    Cargando(0)
                    return
                }

                Diagnosticos.PanelDx = '#PanelDiagnosticoClap ';

                const data1 = await EvaluacionGinecoObstetra.GuardarEvaluacionGinecoObstetra();
                const data2 = await EvaluacionGinecoObstetra.GuardarExamenGinecoObstetra();

                alerta2('success', 'HOSPITALIZACIÓN', 'El registro se guardó correctamente.');
                
                $("#modalClap").modal('hide')
                $('#btnEdisipClap').focus()

                $("#modalClap").on('hidden.bs.modal', function () {
                    $("#moduloClap").html("");
                });
                Cargando(0);
                //if (eval == 0 && EvaluacionGinecoObstetra.nuevaEvaluacion == false) {
                //    alerta2('info', '', "No se ha registrado ninguna evaluación. Por favor registre una evaluación.");
                //} else {
                //    if (EvaluacionGinecoObstetra.ValidarVariablesEvaluacionGinecoObstetra()) {
                //        Cargando(1);
                //        Triaje.GuardarTriajeHospEmeg(Variables.IdAtencion, Variables.IdServicioEgreso, 0);
                //        const data1 = await EvaluacionGinecoObstetra.GuardarEvaluacionGinecoObstetra();
                //        const data2 = await EvaluacionGinecoObstetra.GuardarExamenGinecoObstetra();

                //        if (EvaluacionGinecoObstetra.nuevaEvaluacion == true || EvaluacionGinecoObstetra.modificaEvaluacion == true) {
                //            if (data1 == true && data2 == true) {
                //                const data3 = await EvaluacionGinecoObstetra.GuardarEvaluacionGinecoObstetraDetalle();
                //                if (data3) {
                //                    alerta2('success', 'HOSPITALIZACIÓN', 'La evaluación se guardó correctamente.');
                //                }
                //                //const data5 =  await Diagnosticos.GuardarDiagnosticosPorEvaluacion(Variables.IdAtencion, 8, Variables.IdServicioEgreso, EvaluacionGinecoObstetra.nroEvaluacion);                            
                //                //if (data4 == true) {
                //                //    //console.log("GENERAR RECETAS");
                //                //    const datarec = await Ordenes.GuardarOrdenesMedicasV2();
                //                //    if (datarec.length > 0) {
                //                //        const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdMedico);
                //                //        VisorReceta.AbrirVisorRecetas(recetas);
                //                //    }
                //                //    //console.log(datarec);
                //                //}
                //            }
                //        } else {
                //            if (EvaluacionGinecoObstetra.modificaCabecera == true) {
                //                const data4 = EvaluacionGinecoObstetra.ActualizarHojaCabecera();
                //                if (data4) {
                //                    alerta2('success', 'HOSPITALIZACIÓN', 'La evaluación se guardó correctamente.');
                //                }
                //            }
                //        }
                //        EvaluacionGinecoObstetra.CargarEvaluacion();
                //        //EvaluacionGinecoObstetra.LimpiarModuloEmergencia();
                //        //EvaluacionDetalle.Limpiar();
                //        //AdmisionHospitalizacion.CerrarModulo();
                //        //ReposicionarVista();
                //        //MostrarAreaLista();
                //        //AdmisionHospitalizacion.ListarAtenciones();

                //        Cargando(0);
                //    }
                //}
            }

        });
        $('#btnCerrarClap').off().on('click', function () {

            //$("#moduloClap").html('');
            $("#modalClap").modal('hide')
            $('#btnEdisipClap').focus()

            $("#modalClap").on('hidden.bs.modal', function () {
                $("#moduloClap").html("");
            });
        })


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
                EvaluacionGinecoObstetra.BloqueoDiferido(1);
            } else if ($('input:radio[name=rdbTactoVaginal]:checked').val() == 0) {
                EvaluacionGinecoObstetra.BloqueoDiferido(0);
            }
        });

        $(".rdbMembranaRota").on('click', function () {
            if ($('input:radio[name=rdbMembranaRota]:checked').val() == 1) {
                EvaluacionGinecoObstetra.ValidaMembranaRotas(1);
            } else if ($('input:radio[name=rdbMembranaRota]:checked').val() == 0) {
                EvaluacionGinecoObstetra.ValidaMembranaRotas(0);
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

        $('#tblEvaluacionesHospitalizacion tbody').on('click', 'tr', async function () {
            EvaluacionGinecoObstetra.LimpiarVistaModuloEvaluacionDetalle();
            EvaluacionGinecoObstetra.BloquearOpcionesModificacion();

            //oTable_EvaHosp.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_EvaHosp.api(true).row('.selected').data();

            if (!isEmpty(objrowTb)) {
                EvaluacionDetalle.Cargar(objrowTb);
                if (EvaluacionDetalle.IdNumero > 0) {
                    //await EvaluacionGinecoObstetra.CargarDatosEvaluacionDetalle(Variables.IdAtencion, Variables.IdServicioEgreso, EvaluacionGinecoObstetra.nroEvaluacion);                    
                    await EvaluacionGinecoObstetra.CargarDatosEvaluacionDetalle(EvaluacionDetalle.IdAtencion, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdNumero);
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

        $('.OpcionEvalEmer').on('click', function () {
            EvaluacionGinecoObstetra.nuevaEvaluacion = false;
            EvaluacionGinecoObstetra.modificaEvaluacion = false;
            EvaluacionGinecoObstetra.modificaCabecera = false;

            $("#FirmarEvalEmer").show();
            $("#ImprimirEvalEmerCF").show();
            $("#ImprimirEvalEmerSF").show();

            $("#CardEva").removeClass("bg-blue");
            $('#tblEvaluacionesHospitalizacion tbody').find('tr').removeClass("selected");
            //$("#FirmarEvalEmer").attr("href", "");  (COMNETADO POR KHOYOSI - FIRMA ANTERIOR)

            ///////////COMENTADO POR KHOYOSI////////////////
            if (AdmisionHospitalizacion.accion == 'M') {
                if (EvaluacionGinecoObstetra.idMedicoPrimeraEvaluacion > 0) {
                    if (EvaluacionGinecoObstetra.idMedicoPrimeraEvaluacion == Utilitario.ObtenerIdMedicoSesion()) {
                        EvaluacionGinecoObstetra.modificaCabecera = true;
                        EvaluacionGinecoObstetra.DesbloquearCabecera();
                        $("#btnGuardarEva").show();
                    } else {
                        EvaluacionGinecoObstetra.modificaCabecera = false;
                        EvaluacionGinecoObstetra.BloquearCabecera();
                        $("#btnGuardarEva").hide();
                    }
                } else {
                    $("#btnGuardarEva").hide();
                }
            } else {
                if (AdmisionHospitalizacion.accion == 'C') {
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
            var eval = oTable_EvaHosp.DataTable().data().count();

            EvaluacionDetalle.IdMedico = await Utilitario.ObtenerIdMedicoSesion();
            EvaluacionDetalle.IdServicio = Variables.IdServicioEgreso;
            EvaluacionDetalle.IdNumero = eval + 1;

            OrdenMedica.nroEvaluaciones = eval;

            if (EvaluacionDetalle.IdMedico > 0) {
                EvaluacionGinecoObstetra.LimpiarVistaModuloEvaluacionDetalle();
                EvaluacionGinecoObstetra.DesbloquearOpcionesModificacion();

                $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-success");
                $("#CardEva").addClass("bg-blue");

                $("#lblNumeroEvaluacion").html("Evaluación N° " + (eval + 1));
                $("#lblTipoEvaluacion").html("Nueva Evaluación");


                $('#FechaInicioAtencion').attr('readonly', 'readonly');
                $('#FechaInicioAtencion').datepicker('setStartDate', moment(moment(ConvertirFormatoFecha(Variables.FechaIngreso)).toDate()).toDate().format('dd/mm/yyyy'));
                $('#FechaInicioAtencion').datepicker('setEndDate', moment().toDate());
                $('#FechaInicioAtencion').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

                $('#HoraInicioAtencion').val(moment().toDate().format('HH:MM'));

                EvaluacionGinecoObstetra.nuevaEvaluacion = true;
                EvaluacionGinecoObstetra.modificaEvaluacion = false;
                EvaluacionGinecoObstetra.modificaCabecera = false;
                //EvaluacionGinecoObstetra.idMedico = Utilitario.ObtenerIdMedicoSesion();

                swal({
                    title: 'Evaluaciones',
                    text: "Paciente iniciará la evaluación N° " + (eval + 1),
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
                
                Diagnosticos.PanelDx = '#PanelDiagnostico ';
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
            var objrow = oTable_EvaHosp.api(true).row('.selected').data();

            Cargando(1);
            if (isEmpty(objrow)) {
                alerta2('info', '', 'Seleccione una evaluación por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(objrow.code)
                if (isEmpty(firma)) {
                    alerta2('info', '', 'El documento no esta generado, se procedera a generar el documento.')
                    const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(objrow.idCuentaAtencion, objrow.idEvaluacionDetalle, objrow.idAtencion, objrow.idServicio, objrow.idNumero);

                    if (pdf) {
                        alerta2('success', '', 'Se generó el documento correctamente.')
                        $("#btnBuscarAtenciones").click();
                    } else {
                        alerta2('warning', '', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                    }
                } else {
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }
            }
            Cargando(0);
        });

        $('#FirmarEvalEmer').on('click', async function () {
            var objrowTb = oTable_EvaHosp.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('info', '', 'Seleccione una evaluación por favor.')
                return false
            }

            Cargando(1);
            Utilitario.TipoArchivoFirmar = 'EMER-EVA-DET';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(Variables.IdCuentaAtencion, EvaluacionGinecoObstetra.nroEvaluacion, Variables.IdServicioIngreso);
                if (!isEmpty(paquete)) {
                    await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data)
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru(Variables.IdCuentaAtencion, Variables.IdServicioIngreso, EvaluacionGinecoObstetra.nroEvaluacion);
            }

            Cargando(0);
        });

        $('#ImprimirEvalEmerCF').on('click', async function () {
            var objrowTb = oTable_EvaHosp.api(true).row('.selected').data();
            Cargando(1);
            if (isEmpty(objrowTb)) {
                alerta2('info', '', 'Seleccione una evaluación por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(objrowTb.code);
            }
            Cargando(0);
        });
        ///////////////////////////////////////////////////////////////////////////////////////



        /////////////////////////GUARDAR Y CANCELAR EVALUACION////////////////////////
        $("#btnGuardarEva").on('click', async function () {
            var eval = oTable_EvaHosp.DataTable().data().count();

            sesion = Utilitario.ValidarSesion();
            if (sesion) {
                if (eval == 0 && EvaluacionGinecoObstetra.nuevaEvaluacion == false) {
                    alerta2('info', '', "No se ha registrado ninguna evaluación. Por favor registre una evaluación.");
                } else {

                    if (isEmpty($('#cboTipoPaciente').val())) {
                        alerta2('info', '', "Debe seleccionar el tipo de paciente.");
                        return
                    }

                    if (EvaluacionGinecoObstetra.ValidarVariablesEvaluacionGinecoObstetra()) {
                        Cargando(1);
                        Diagnosticos.PanelDx = '#PanelDiagnostico ';
                        Triaje.GuardarTriajeHospEmeg(Variables.IdAtencion, Variables.IdServicioEgreso, 0);
                        const data1 = await EvaluacionGinecoObstetra.GuardarEvaluacionGinecoObstetra();
                        const data2 = await EvaluacionGinecoObstetra.GuardarExamenGinecoObstetra();

                        if (EvaluacionGinecoObstetra.nuevaEvaluacion == true || EvaluacionGinecoObstetra.modificaEvaluacion == true) {
                            if (data1 == true && data2 == true) {
                                const data3 = await EvaluacionGinecoObstetra.GuardarEvaluacionGinecoObstetraDetalle();
                                if (data3) {
                                    alerta2('success', 'HOSPITALIZACIÓN', 'La evaluación se guardó correctamente.');
                                }
                                //const data5 =  await Diagnosticos.GuardarDiagnosticosPorEvaluacion(Variables.IdAtencion, 8, Variables.IdServicioEgreso, EvaluacionGinecoObstetra.nroEvaluacion);                            
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
                            if (EvaluacionGinecoObstetra.modificaCabecera == true) {
                                const data4 = EvaluacionGinecoObstetra.ActualizarHojaCabecera();
                                if (data4) {
                                    alerta2('success', 'HOSPITALIZACIÓN', 'La evaluación se guardó correctamente.');
                                }
                            }
                        }
                        EvaluacionGinecoObstetra.CargarEvaluacion();
                        //EvaluacionGinecoObstetra.LimpiarModuloEmergencia();
                        //EvaluacionDetalle.Limpiar();
                        //AdmisionHospitalizacion.CerrarModulo();
                        //ReposicionarVista();
                        //MostrarAreaLista();
                        //AdmisionHospitalizacion.ListarAtenciones();

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
                AdmisionHospitalizacion.limpiarRecetas()
                EvaluacionGinecoObstetra.LimpiarModuloEmergencia();
                AdmisionHospitalizacion.CerrarModulo();
                ReposicionarVista();
                MostrarAreaLista();
            }, function (dimiss) {

            });
        });
        //--------------------------------------------------------------//

        /////////////////////////////////EVENTOS VISOR RECETAS////////////////////////////////////////////////////
        $('#btnVisorRecetasEmer').on('click', async function () {
            var row = oTable_EvaHosp.api(true).row('.selected').data();
            //console.log(row);
            if (typeof row === 'undefined') {
                alerta2('info', '', "Seleccione una evaluación por favor.");
            } else {
                //const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionGinecoObstetra.nroEvaluacion, Variables.IdServicioIngreso, Variables.IdMedico);
                const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdMedico);
                VisorReceta.AbrirVisorRecetas(recetas);
            }
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        $("#cboTipoEmbrazo").change();


        $("#btnOpenModalReferenciaEESSGA").on('click', () => {
            $("#modalEstablecimientosUciBuscar").modal("show")

            EvaluacionGinecoObstetra.tipoEstablecimiento = 1
        })
        $("#btnOpenModalReferenciaOtroEESSGA").on('click', () => {
            $("#modalEstablecimientosUciBuscar").modal("show")

            EvaluacionGinecoObstetra.tipoEstablecimiento = 2
        })
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

        var tableWrapperEmer = $('#tblEvaluacionesHospitalizacion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_EvaHosp = $("#tblEvaluacionesHospitalizacion").dataTable(parms);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    InitDatablesEstablecimientos: function () {

        $('#tblEstSaludUci').DataTable().clear().destroy()

        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
            scrollCollapse: true,
            columns: [
                {
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "distrito",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "provincia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "departamento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html('<span class="chip orange">' + 'Estab' + '</span >');
                    }
                }
            ]
        }
        oTable_establecimientos = $("#tblEstSaludUci").dataTable(parms);

        //oTable_EstSalud = $("#tblEstSalud").dataTable(parms);
    },
    InitDatablesEstanciaHosp: () => {

        $('#tblEstanciaHosp').DataTable().clear().destroy()

        var parms = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            "ordering": true,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "fechaHoraOcupacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '30%',
                    targets: 1,
                    data: "nombreServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "codigoCama",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '30%',
                    targets: 3,
                    data: "nombreMedico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

            ]
        }
        var tableWrapper = $('#tblEstanciaHosp'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_estanciaHosp = $("#tblEstanciaHosp").dataTable(parms);
    },

    ListaCatalogo(idCatalogo) {
        var midata = new FormData();
        midata.append('idCatalogo', idCatalogo);
        $.ajax({
            url: "/Atencion/ListaCatalogoCombo?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {

                if (idCatalogo == 43) {
                    $('#cboTerminacion').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboTerminacion').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                }
                if (idCatalogo == 44) {
                    $('#cboAborto').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboAborto').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                }
                if (idCatalogo == 45) {
                    $('#cbofracaso').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cbofracaso').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                }
                if (idCatalogo == 46) {
                    $('#cboEmbplaneado').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboEmbplaneado').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    });
                }
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar combosCatalogo!", "2");
                }, 900)
            }
        });
    },


    ListaDepartamentos() {

        $.ajax({
            url: "/Utilitario/ListaDepartamentos?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbdepEstUcibuscar').empty();
                if (datos.session) {
                    $(datos.lsDeparta.table).each(function (i, obj) {
                        $('#cmbdepEstUcibuscar').append('<option  value="' + obj.idDepartamento + '">' + obj.nombre + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    $('#cmbdepEstUcibuscar').val(15);
                    EstablecimientosSalud.ListaProvincias();
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                alerta(3, "Error al listar departamentos! " + JSON.stringify(msg));
            }
        });
    },

    ListaProvincias() {
        var midata = new FormData();

        midata.append('idDepartamento', $('#cmbdepEstUcibuscar').val());
        $.ajax({
            url: "/Utilitario/ListaProvinciasByDepartamentos?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbprovEstUciBuscar').empty();
                if (datos.session) {
                    $(datos.lsProvincias.table).each(function (i, obj) {
                        $('#cmbprovEstUciBuscar').append('<option  value="' + obj.idProvincia + '">' + obj.nombre + '</option>');
                    });
                    $('#cmbprovEstUciBuscar').val("");
                    $('#cmbdistEstUciBuscar').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");
                    //$('#cmbprovEstBuscar').val("");
                    //$('#cmbdistEstBuscar').val("");                
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar provincias!", "2");
                }, 900)
            }
        });
    },

    ListaDistrito() {
        var midata = new FormData();

        midata.append('idDProvincia', $('#cmbprovEstUciBuscar').val());
        $.ajax({
            url: "/Utilitario/ListaDistritosByProvincia?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $('#cmbdistEstUciBuscar').empty();
                if (datos.session) {
                    $(datos.lsDistrito.table).each(function (i, obj) {
                        $('#cmbdistEstUciBuscar').append('<option  value="' + obj.idDistrito + '">' + obj.nombre + '</option>');
                    });
                    $('#cmbdistEstUciBuscar').val("");
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error al listar distritos!", "2");
                }, 900)
            }
        });
    },

    /// <summary>
    /// MODIFICAR Y CONSULTAR EVALUACION
    /// </summary>
    /// Opciones de consulta y modificacion
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ModificarEvaluacion() {
        EvaluacionGinecoObstetra.CargarEvaluacion();
        EvaluacionGinecoObstetra.DesbloquearCampos();
        //$("#btnGuardarEva").hide();
        //console.log("ENTROO");
    },

    ConsultarEvaluacion() {
        EvaluacionGinecoObstetra.CargarEvaluacion();
        EvaluacionGinecoObstetra.BloquearCampos();
        //console.log("ENTROO");
    },

    CargarEvaluacion() {
        //opcionModificar = true;
        //var objrow = oTable_atencionesHosp.api(true).row('.selected').data();

        //this.LimpiarModal();
        //this.HabilitarModal();
        AdmisionHospitalizacion.limpiarRecetas()
        EvaluacionGinecoObstetra.LimpiarModuloEmergencia();
        //Triaje.listaTriajeEmgHosp(objrow.idAtencion, objrow.idServicioEgreso, 0);
        EvaluacionGinecoObstetra.CargarDatosEvaluacion();
        //EvaluacionNeonatal.AbrirModalNeonatal();

        //AdmisionHospitalizacion.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)

        //idPacienteGlobal = objrow.idPaciente;     //idPaciente para el Alta

        $("#motivo-tab").click();
        //this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);

        //$("#btnGuardarEva").hide();
        //$("#btnNuevoRegistro").show();

        MostrarAreaRegistro();
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
            url: "/EvaluacionGinecoObstetraHosp/SeleccionarEvaluacion?area=Hospitalizacion",
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
        oTable_EvaHosp.fnClearTable();
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        var dataEvaluacionDetalle = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionGinecoObstetraHosp/SeleccionarEvaluacionDetalle?area=Hospitalizacion",
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
                        oTable_EvaHosp.fnAddData(dataEvaluacionDetalle);
                        EvaluacionGinecoObstetra.idMedicoPrimeraEvaluacion = datos.respuesta.table[0].idMedico;

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
                    url: "/EvaluacionGinecoObstetraHosp/SeleccionarEvaluacionDetallePorEvaluacion?area=Hospitalizacion",
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
            alerta2('', '', error);
        }

        return resp;
    },

    SeleccionarExamenGinecoObstetra(idAtencion, idServicio) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        var dataExamenGinecoObstetra = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionGinecoObstetraHosp/SeleccionarExamenGinecoObstetra?area=Hospitalizacion",
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

    async EstanciaHospitalariaSeleccionarPorAtencion(idAtencion, SecuenciaMayorA) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('SecuenciaMayorA', SecuenciaMayorA);
        var estanciaHosp = [];

        await $.ajax({
            method: "POST",
            url: "/EvaluacionGinecoObstetraHosp/EstanciaHospitalariaSeleccionarPorAtencion?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                oTable_estanciaHosp.fnClearTable()
                if (datos.session) {
                    if (datos.respuesta.table.length > 0) {
                        estanciaHosp = datos.respuesta.table;

                        if (estanciaHosp.length > 0) {
                            oTable_estanciaHosp.fnAddData(estanciaHosp)
                        }
                        console.log('estanciaHosp', estanciaHosp)
                    }
                    else {
                        estanciaHosp = [];
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataReferencia);
        return estanciaHosp;
    },

    SeleccionarAntecedentes(idAtencion) {

    },

    ListarResultadosLaboratorioByIdCuentaAtencion: async (idCuentaAtencion) => {
        let formData = new FormData()

        formData.append('idCuentaAtencion', idCuentaAtencion)

        return HttpClient.Post('/Utilitario/ListarResultadosLaboratorioByIdCuentaAtencion?area=ConsultaExterna', formData)
            .then((res) => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
                return null
            })
            .finally(() => {
                Cargando(0)
            })
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// CARGA DATOS A LA VISTA
    /// </summary>
    /// Carga los datos de la evaluacion a la vista
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CompletarResultadosExamenes: async (data) => {

        let grupoRhResAnest = ''

        $(data).each((i, obj) => {

            console.log('revisando', obj)


            // ANTECEDENTES PERSONALES Grupo sanguíneo - Factor RH
            if (obj.codigo == '86900' && obj.idItem == '84' && RegistroEvaluacionesUCI.nroEvaluacion < 2) { // Grupo sanguíneo ABO
                $('#txtGrupoSanguineo').val(obj.valorTexto)
            }
            if (obj.codigo == '86901' && obj.idItem == '84' && RegistroEvaluacionesUCI.nroEvaluacion < 2) { // TIPIFICACION SANGUINEA RH
                $('#txtFactor').val(obj.valorCombo)
            }
            // END ANTECEDENTES PERSONALES Grupo sanguíneo - Factor RH

            // ------------------------ HEMOGRAMA
            if (obj.codigo == '85027' && obj.idItem == '5') { // Leucocitos
                $('#txtAuxLeucocitoNumero').val(obj.valorNumero)
            }
            // NO HAY NEUTROFILOS
            if (obj.codigo == '85027' && obj.idItem == '6') { // Abastonados
                $('#txtAuxAbastonado').val(obj.valorNumero)
            }
            if (obj.codigo == '85027' && obj.idItem == '11') { // Linfocitos
                $('#txtAuxLinfocitos').val(obj.valorNumero)
            }
            if (obj.codigo == '85027' && obj.idItem == '1') { // Hemoglobina
                $('#txtHbAnest').val(obj.valorNumero)
            }
            if (obj.codigo == '85027' && obj.idItem == '2') { // Hematocrito
                $('#txtHtoAnest').val(obj.valorNumero)
            }
            if (obj.codigo == '85027' && obj.idItem == '4') { // Plaquetas
                $('#txtAuxPlaquetas').val(obj.valorNumero)
            }
            // ------------------------ END HEMOGRAMA

            // ------------------------ BIOQUÍMICO
            if (obj.codigo == '84520' && obj.idItem == '84') { // UREA
                $('#txtAuxUrea').val(obj.ValorTexto)
            }

            // FALTA GLUCOSA

            if (obj.codigo == '82565' && obj.idItem == '84') { // CREATININA EN SANGRE
                $('#txtAuxCreatinina').val(obj.valorTexto)
            }

            if (obj.codigo == '84165' && obj.idItem == '25') { // PROTEINAS TOTALES/FRACCIONADAS Albumina
                $('#txtAuxAlbumina').val(obj.valorTexto)
            }
            if (obj.codigo == '80076' && obj.idItem == '25' && $('#txtAuxAlbumina').val() == '') { // PERFIL HEPATICO Albumina
                $('#txtAuxAlbumina').val(obj.valorNumero)
            }

            if (obj.codigo == '84165' && obj.idItem == '26') { // PROTEINAS TOTALES/FRACCIONADAS Globulina
                $('#txtAuxGlobulina').val(obj.valorTexto)
            }
            if (obj.codigo == '80076' && obj.idItem == '26' && $('#txtAuxGlobulina').val() == '') { // PERFIL HEPATICO Globulina
                $('#txtAuxGlobulina').val(obj.valorNumero)
            }

            if (obj.codigo == '82247' && obj.idItem == '89') { // BILIRRUBINAS TOTAL Bilirrubina Total
                $('#txtAuxBilirrubinaTotal').val(obj.valorTexto)
            }

            if (obj.codigo == '82248' && obj.idItem == '117') { // BILIRRUBINA  DIRECTA Directa
                $('#txtAuxBilirrubinaDirecta').val(obj.valorTexto)
            }

            if (obj.codigo == '84075' && obj.idItem == '84') { // FOSFATASA ALCALINA
                $('#txtAuxFosfatasaAlcalina').val(obj.valorTexto)
            }
            if (obj.codigo == '80076' && obj.idItem == '29' && $('#txtAuxFosfatasaAlcalina').val() == '') { // PERFIL HEPATICO Fosfatasa alcalina
                $('#txtAuxFosfatasaAlcalina').val(obj.valorNumero)
            }

            if (obj.codigo == '84450' && obj.idItem == '84') { // Transaminasa(TGO)
                $('#txtAuxTGO').val(obj.valorTexto)
            }
            if (obj.codigo == '84460' && obj.idItem == '84') { // Transaminasa(TGP)
                $('#txtAuxTGP').val(obj.valorTexto)
            }

            if (obj.codigo == '89051.01' && obj.idItem == '405') { // lactato deshidrogenasa LDH
                $('#txtAuxLactatoDeshidrogenasa').val(obj.valorNumero)
            }

            // FALTA Magnesio

            // FALTA Fosforo

            if (obj.codigo == '82310' && obj.idItem == '391') { // CALCIO SERICO
                $('#txtAuxCalcioSerico').val(obj.valorTexto)
            }

            if ($('#txtAuxAlbumina').val() != '') {
                $('#txtAuxIndiceAlbumina').val((parseFloat($('#txtAuxAlbumina').val()) * 5.54).toFixed(3))
            }
            if ($('#txtAuxGlobulina').val() != '') {
                $('#txtAuxIndiceGlobulina').val((parseFloat($('#txtAuxGlobulina').val()) * 1.43).toFixed(3))
            }
            if ($('#txtAuxIndiceAlbumina').val() != '' && $('#txtAuxIndiceGlobulina').val() != '') { // Presión oncótica Po
                $('#txtAuxPresionOncoticaPo').val((parseFloat($('#txtAuxIndiceAlbumina').val()) + parseFloat($('#txtAuxIndiceGlobulina').val())).toFixed(3))
            }
            if ($('#txtAuxPresionOncoticaPo').val() != '' && $('#txtEFisicoPAM').val() != '') { // Índice de Briones
                $('#txtAuxIndiceBriones').val((parseFloat($('#txtAuxPresionOncoticaPo').val()) / parseFloat($('#txtEFisicoPAM').val())).toFixed(3))
            }

            // ------------------------ END BIOQUÍMICO

            // ------------------------ PERFIL DE COAGULACIÓN
            if (obj.codigo == '80063' && obj.idItem == '85') { // Tiempo de Protrombina
                $('#txtAuxTiempoProtrombina').val(obj.valorTexto)
            }

            if (obj.codigo == '80063' && obj.idItem == '86') { // Tiempo Parcial de Tromboplastina
                $('#txtAuxTTPA').val(obj.valorTexto)
            }

            if (obj.codigo == '80063' && obj.idItem == '87') { // Fibrinógeno
                $('#txtAuxFibrinogeno').val(obj.valorTexto)
            }

            // Falta Dimero D

            // Marcadores inflamatorios

            if (obj.codigo == '86140' && obj.idItem == '84') { // PROTEINA C REACTIVA
                $('#txtAuxProteinaCReactiva').val(obj.valorTexto + '')
            }

            // Procalcitonina

            // ------------------------ END PERFIL DE COAGULACIÓN


            // ------------------------ GASOMETRÍA
            if (obj.codigo == '81001' && obj.idItem == '92') { // EXAMEN COMPLETO DE ORINA (PH)
                $('#txtAuxPH').val(obj.valorTexto + '')
            }
            if (obj.codigo == '81000' && obj.idItem == '92' && $('#txtAuxPH').val() == '') { // Examen Completo de Orina.... (PH)
                $('#txtAuxPH').val(obj.valorTexto + '')
            }



            // ------------------------ END GASOMETRÍA



            //if (obj.codigo == '82947' && obj.idItem == '84') { // GLUCOSA EN SANGRE CUANTITATIVO
            //    $('#txtGlucosaResAnest').val(obj.valorTexto + '')
            //}



            //if (obj.codigo == '86592' && obj.idItem == '84') { // RPR/VDRL
            //    $('#txtVdrlAnest').val(obj.valorCombo)
            //}
            //if (obj.codigo == '86703' && obj.idItem == '84') { // HIV 1 - 2 Ag/Ac
            //    $('#txtHivResAnest').val(obj.valorCombo)
            //}


            //if (obj.codigo == '80063' && obj.idItem == '4') { // Plaquetas
            //    $('#txtRecPlaquetasAnest').val(obj.valorTexto)
            //}





            //if (obj.codigo == '87635.02' && obj.idItem == '84') { // Prueba Rapida Antigénica (Covid-19)
            //    $('#txtCovidResAnest').val(obj.valorCombo)
            //}


            //$('#').val()
            //$('#txtRxToraxResAnest').val()
            //$('#txtRqAnest').val()
            //$('#txtOrinaResAnest').val()
        })

        $('#txtGrupoRhResAnest').val(grupoRhResAnest)
    },

    async CargarDatosEvaluacion() {
        var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();


        $("#txtNroCuentaClap").val(objrowTb.idCuentaAtencion);
        $("#txtHistoriaClap").val(objrowTb.nroHistoriaClinica);
        $("#txtPacienteNombreClap").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtTipoDocumentoClap").val(objrowTb.tipoDocumento);
        $("#txtNroDocumentoClap").val(objrowTb.nroDocumento);

        $("#txtIafaPlanHosp").val(objrowTb.plan);
        $("#txtMedicoIngresoHosp").val(objrowTb.medicoIngreso);
        $("#txtRiesgoSocialHosp").val(objrowTb.codigo + ' ' + objrowTb.nivel);

        // $('#txtIafaPlanHosp').val(EvaHosp.iafaPlanHosp || '');
        // $('#txtRiesgoSocialHosp').val(EvaHosp.riesgoSocialHosp || '');
        // $('#txtMedicoIngresoHosp').val(EvaHosp.medicoIngresoHosp || '');


        $("#txtPaciente").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtPacienteNombre").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        //$("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtNroHistoria").val(objrowTb.nroHistoriaClinica);
        $("#txtHistoria").val(objrowTb.nroHistoriaClinica);
        //$("#HistoriaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-clipboard-medical'></i><b>Historia: </b>" + objrowTb.nroHistoriaClinica);
        $("#txtTipoDocumentoEmer").val(objrowTb.tipoDocumento);
        $("#txtNroDocumentoEmer").val(objrowTb.nroDocumento);
        $("#txtEdadAnio").val(objrowTb.edadEnAnio);
        $("#txtEdadMes").val(objrowTb.edadEnMes);
        $("#txtEdadDia").val(objrowTb.edadEnDia);
        $("#txtNroCuenta").val(objrowTb.idCuentaAtencion);
        //$("#CuentaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-hashtag'></i><b>Cuenta: </b>" + objrowTb.idCuentaAtencion);
        $("#txtNroAtencion").val(objrowTb.idAtencion);
        //$("#cboTipoPaciente").val(objrowTb.idTipoPaciente);
        $("#cboOrigenPaciente").val(objrowTb.idOrigenAtencion);
        //$("#cboPrioridad").val(objrowTb.idTipoGravedad);
        $("#hdIdTipoFuenteFian").val(objrowTb.idTipoFinanciamiento);
        $('#hdIdCuentaAtencion').val(objrowTb.idCuentaAtencion);
        $('#hdIdServicioPaciente').val(Variables.IdServicioEgreso);
        //$('#hdIdServicioPaciente').val(objrowTb.idServicioEgreso);

        $("#txtFechaIngresoHospitalizacion").val(objrowTb.fechaIngreso);
        $("#txtFechaNacimientoDatosGenerales").val(objrowTb.fechaNacimiento);
        $("#txtEstadoCivilDatosGenerales").val(objrowTb.estadoCivil);
        $("#txtGradoInstruccionDatosGenerales").val(objrowTb.gradoInstruccion);
        $("#txtServicioActualDatosGenerales").val(objrowTb.servicioActual);
        $("#txtDistritoProcedenciaDatosGenerales").val(objrowTb.distritoProcedencia);
        $("#txtCamaDatosGenerales").val(objrowTb.codigoCama);

        IdCuentaAtencionTemp = Variables.IdCuentaAtencion;       //variable para conservar el IdCuentaAtencion despues de abrir el modulo de SEGUIMIENTO

        $("#hdIdTipoFuenteFian").val(objrowTb.idTipoFinanciamiento);
        $('#hdIdCuentaAtencion').val(objrowTb.idCuentaAtencion);
        $('#hdIdServicioPaciente').val(Variables.IdServicioEgreso);

        Triaje.listaTriajeEmgHosp(Variables.IdAtencion, Variables.IdServicioEgreso, 0);

        var EvaHosp = EvaluacionGinecoObstetra.SeleccionarEvaluacion(Variables.IdAtencion);
        //var EvaDetEmer = EvaluacionGinecoObstetra.SeleccionarEvaluacionDetalle(Variables.IdAtencion, Variables.IdServicioEgreso);
        if (typeof oTable_EvaHosp !== 'undefined') {
            // La variable está definida, puedes usarla
            var EvaDetEmer = EvaluacionGinecoObstetra.SeleccionarEvaluacionDetalle(Variables.IdAtencion, 0);
        }

        var ExaGineObs = EvaluacionGinecoObstetra.SeleccionarExamenGinecoObstetra(Variables.IdAtencion, Variables.IdServicioEgreso);


        await EvaluacionGinecoObstetra.EstanciaHospitalariaSeleccionarPorAtencion(Variables.IdAtencion, 0)

        $("#cboTipoPaciente").val(EvaHosp.idTipoPaciente);
        $("#cboPrioridad").val(EvaHosp.prioridad);

        //----------------------EVALUACION HOSPITALIZACION-----------------------//
        $('#txtGlasgow').val(EvaHosp.glasgow);

        //----------------------MOTIVO ATENCION-----------------------//
        $('#txtApetitoIngreso').val(EvaHosp.apetito)
        $('#txtSedIngreso').val(EvaHosp.sed)
        $('#txtOrinaIngreso').val(EvaHosp.orina)
        $('#txtDeposicionesIngreso').val(EvaHosp.deposiciones)
        $('#txtSeunioIngreso').val(EvaHosp.suenio)

        $('#chkDolor').prop('checked', EvaHosp.dolor);
        $('#chkConvulsion').prop('checked', EvaHosp.convulsiones);
        $('#chkFiebre').prop('checked', EvaHosp.fiebre);
        $('#chkVomitos').prop('checked', EvaHosp.vomitos);
        $('#chkContraccionUterina').prop('checked', EvaHosp.contraccionesU);
        $('#chkSangradoV').prop('checked', EvaHosp.sangradoV);
        $('#chkPerdidaLA').prop('checked', EvaHosp.perdidaLA);
        $('#chkAusenciaMF').prop('checked', EvaHosp.ausenciaMF);
        $('#chkSintomasU').prop('checked', EvaHosp.sintomasU);
        $('#chkFlujoVaginal').prop('checked', EvaHosp.flujoV);
        $('#chkTumoracion').prop('checked', EvaHosp.tumoracion);
        $('#chkAlteracionesM').prop('checked', EvaHosp.alteracionesM);
        $('#chkDismMovFetal').prop('checked', EvaHosp.disMovFetales);
        $('#chkOtrosSintomas').prop('checked', EvaHosp.otros);

        $('#txtRelato').val(EvaHosp.relato);
        $('#txtEnfermedadActual').val(EvaHosp.enfermedadA);

        /////////////////////ANTECEDENTES//////////////////////////////////////////////////
        //$('#txtFechaFUR').val(EvaHosp.fechaUR);
        EvaHosp.fechaUR == '__/__/____' ? $('#txtFechaFUR').val(FormatearFecha(EvaHosp.fechaUR)) : $('#txtFechaFUR').datepicker("setDate", FormatearFecha(EvaHosp.fechaUR));
        //$('#txtFechaFUE').val(EvaHosp.fechaEco);
        EvaHosp.fechaEco == '__/__/____' ? $('#txtFechaFUE').val(FormatearFecha(EvaHosp.fechaEco)) : $('#txtFechaFUE').datepicker("setDate", FormatearFecha(EvaHosp.fechaEco));
        //$('#txtFechaFPP').val(EvaHosp.fechaPP);
        EvaHosp.fechaPP == '__/__/____' ? $('#txtFechaFPP').val(FormatearFecha(EvaHosp.fechaPP)) : $('#txtFechaFPP').datepicker("setDate", FormatearFecha(EvaHosp.fechaPP));

        //EvaHosp.fechaPrimeraEco == '__/__/____' ? $('#txtFechaECO').val(EvaHosp.fechaPrimeraEco) : $('#txtFechaECO').datepicker("setDate", EvaHosp.fechaPrimeraEco);
        //$('#txtSemEco').val(EvaHosp.semPrimeraEco);
        //$('#txtDiasEco').val(EvaHosp.diasPrimeraEco);

        $('#txtEGsemanas').val(EvaHosp.edadGestacional);
        $('#txtEGdias').val(EvaHosp.diasGestacional);
        $('#txtCPNveces').val(EvaHosp.cnp);

        


        $('#txtG').val(EvaHosp.gMotiA);
        $('#txtP').val(EvaHosp.pMotiA);
        $('#txtPin').val(EvaHosp.pin);
        $('#txtDeltaPeso').val(EvaHosp.deltaPeso);

        $('input:radio[name=rdbPulmonar][value=' + EvaHosp.maduracionPulmonar + ']').attr('checked', true);
        $('#txtMadPulmonar').val(EvaHosp.maduracionPulmonarDesc);
        $('input:radio[name=rdbCervical][value=' + EvaHosp.maduracionCervical + ']').attr('checked', true);
        $('#txtMadCervical').val(EvaHosp.maduracionCervicalDesc);


        $('#txtAntecedentesMedicos').val(EvaHosp.antecedentes);
        $('#txtRam').val(EvaHosp.ram);
        $('input:radio[name=rdbTransfucion][value=' + EvaHosp.transfucionSangre + ']').attr('checked', true);
        $('#txtAntecedentesQuirurgico').val(EvaHosp.antecedentesQuirurgicos);

        //$('#txtMayorPesoFetal').val(EvaHosp.pesoFetalAnt);

        if (objrowTb.idTipoPaciente == 2) {
            $("#examenObstetrico-tab").hide();
            $("#examenTactoVaginal-tab").hide();
        } else if (objrowTb.idTipoPaciente == 1) {
            $("#examenObstetrico-tab").show();
            $("#examenTactoVaginal-tab").show();
        }

        $('#txtDescripcionExamenFisico').val(EvaHosp.descripcionExamenFisico);
       
        ///////////////////////////////////////////////// ANTECEDENTES FAMILIARES ///////////////////////////////////////////////
        $('input:radio[name=rdbDiabetesFam][value=' + (EvaHosp.diabetesFam ?? 0) + ']').attr('checked', true);
        $("#txtDiabetesFam").val(EvaHosp.diabetesDescripcionFam);

        $('input:radio[name=rdbTbcFam][value=' + (EvaHosp.tbcFam ?? 0) + ']').attr('checked', true);
        $("#txtTbcFam").val(EvaHosp.tbcDescripcionFam);

        $('input:radio[name=rdbHtaFam][value=' + (EvaHosp.htaFam ?? 0) + ']').attr('checked', true);
        $("#txtHtaFam").val(EvaHosp.htaDescripcionFam);

        $('input:radio[name=rdbGemelaresFam][value=' + (EvaHosp.gemelaresFam ?? 0) + ']').attr('checked', true);
        $("#txtGemelaresFam").val(EvaHosp.gemelaresDescripcionFam);

        $('input:radio[name=rdbMalformacionesFam][value=' + (EvaHosp.malformacionesFam ?? 0) + ']').attr('checked', true);
        $("#txtMalformacionesFam").val(EvaHosp.malformacionesDescripcionFam);

        $('input:radio[name=rdbPreEclampsiaFam][value=' + (EvaHosp.preEclampsiaFam ?? 0) + ']').attr('checked', true);
        $("#txtPreEclampsiaFam").val(EvaHosp.preEclampsiaDescripcionFam);

        $('input:radio[name=rdbCondMedicaGraveAntFam][value=' + (EvaHosp.condMedicaGraveAntFam ?? 0) + ']').attr('checked', true);
        $("#txtCondMedicaGraveAntFam").val(EvaHosp.otrosCondMedicaGraveAntFam);

        $('input:radio[name=rdbOtrosAntFam][value=' + (EvaHosp.otrosAntFam ?? 0) + ']').attr('checked', true);
        $("#txtOtrosAntFam").val(EvaHosp.otrosAntDescripcionFam);

        $("#txtAntecedentesGeneralesFam").val(EvaHosp.antecedentesGeneralesFam);


        ///////////////////////////////////////////////// ANTECEDENTES PERSONALES ///////////////////////////////////////////////
        $('input:radio[name=rdbTbcPerso][value=' + (EvaHosp.tbcPerso ?? 0) + ']').attr('checked', true);
        $("#txtTbcPerso").val(EvaHosp.tbcPersoDescripcion);

        $('input:radio[name=rdbHtaPerso][value=' + (EvaHosp.htaPerso ?? 0) + ']').attr('checked', true);
        $("#txtHtaPerso").val(EvaHosp.htaPersoDescripcion);

        $('input:radio[name=rdbVIHPerso][value=' + (EvaHosp.vihPerso ?? 0) + ']').attr('checked', true);
        $("#txtVIHPerso").val(EvaHosp.vihPersoDescripcion);

        $('input:radio[name=rdbCirugiaMayorPerso][value=' + (EvaHosp.cirugiaMayorPerso ?? 0) + ']').attr('checked', true);
        $("#txtCirugiaMayorPerso").val(EvaHosp.cirugiaMayorPersoDescripcion);

        $('input:radio[name=rdbVacunaPreviaPerso][value=' + (EvaHosp.vacunaPreviaPerso ?? 0) + ']').attr('checked', true);
        $("#txtVacunaPreviaPerso").val(EvaHosp.vacunaPreviaPersoDescripcion);

        $('input:radio[name=rdbDiabetesPerso][value=' + (EvaHosp.diabetesPerso ?? 0) + ']').attr('checked', true);
        $("#txtDiabetesPerso").val(EvaHosp.diabetesPersoDescripcion);

        $('input:radio[name=rdbPreEclampsiaPerso][value=' + (EvaHosp.preEclampsiaPerso ?? 0) + ']').attr('checked', true);
        $("#txtPreEclampsiaPerso").val(EvaHosp.preEclampsiaPersoDescripcion);

        $('input:radio[name=rdbAlergiaPerso][value=' + (EvaHosp.alergiaPerso ?? 0) + ']').attr('checked', true);
        $("#txtAlergiaPerso").val(EvaHosp.alergiaPersoDescripcion);

        $('input:radio[name=rdbViolenciaPerso][value=' + (EvaHosp.violenciaPerso ?? 0) + ']').attr('checked', true);
        $("#txtViolenciaPerso").val(EvaHosp.violenciaPersoDescripcion);

        $('input:radio[name=rdbCondMedicaGravePerso][value=' + (EvaHosp.condMedicaGravePerso ?? 0) + ']').attr('checked', true);
        $("#txtCondMedicaGraveAntPerso").val(EvaHosp.condMedicaGraveAntDescripcionPerso);

        $('input:radio[name=rdbCardiopatiaPerso][value=' + (EvaHosp.cardiopatiaPerso ?? 0) + ']').attr('checked', true);
        $("#txtCardiopatiaAntPerso").val(EvaHosp.cardiopatiaAntDescripcionPerso);

        $('input:radio[name=rdbMetropatiaPerso][value=' + (EvaHosp.metropatiaPerso ?? 0) + ']').attr('checked', true);
        $("#txtMetropatiaAntPerso").val(EvaHosp.metropatiaPersoAntDescripcionPerso);

        $('input:radio[name=rdbOtrosPerso][value=' + (EvaHosp.otrosPerso ?? 0) + ']').attr('checked', true);
        $("#txtOtrosPerso").val(EvaHosp.otrosPersoDescripcion);


        /// Asignar valores de campos de texto (txt)
        // Asignar valores a los campos de texto (string)
        $("#txtGestasP").val(EvaHosp.gestasPObst);
        $("#txtAbortos").val(EvaHosp.abortosObst);
        $("#txtVaginales").val(EvaHosp.vaginalesObst);
        $("#txtNacidosVivos").val(EvaHosp.nacidosVivosObst);
        $("#txtViven").val(EvaHosp.vivenObst);
        $("#txt1Sem").val(EvaHosp.sem1Obst);
        $("#txtPartos").val(EvaHosp.partosObst);
        $("#txtCesareas").val(EvaHosp.cesareasObst);
        $("#txtNacMuertos").val(EvaHosp.nacMuertosObst);
        $("#txtDesp1Sem").val(EvaHosp.desp1SemObst);
        $("#txtPesoPregesta").val(EvaHosp.pesoPregestaObst);
        $("#txtPar1").val(EvaHosp.par1Obst);
        $("#txtPar2").val(EvaHosp.par2Obst);
        $("#txtPar3").val(EvaHosp.par3Obst);
        $("#txtPar4").val(EvaHosp.par4Obst);
        //$("#txtFinEmb").val(EvaHosp.finEmbObst);

        //if (EvaHosp.fechaEcoAct == 1) {
        //    $('#chkMuestraEcoGA').prop('checked', true)
        //} else {
        //    $('#chkMuestraEcoGA').prop('checked', false)
        //}
        //if (EvaHosp.calculaFE == 1) {
        //    $('#chkCalculaFechaEcoGA').prop('checked', true)
        //} else {
        //    $('#chkCalculaFechaEcoGA').prop('checked', false)
        //}

        $(`input[name="rdbGemelaresObst"][value="${EvaHosp.gemelaresObst}"]`).attr('checked', true)
        $('#txtGemelaresObst').val(EvaHosp.gemelaresDescripcionObst)

        $('#txtFinEmb').datepicker("setDate", FormatearFecha(EvaHosp.finEmbObst));

        // Asignar valores de combobox (cbo)
        $("#cboTerminacion").val(EvaHosp.terminacionObst);
        $("#cboAborto").val(EvaHosp.abortoObst);
        $("#cbofracaso").val(EvaHosp.fracasoObst);
        $("#cboEmbplaneado").val(EvaHosp.embPlaneadoObst);

        // Asignar valores de checkbox (ch)
        $('#ch2500').prop('checked', EvaHosp.peso2500Obst ? true : false);
        $('#chMult').prop('checked', EvaHosp.multObst ? true : false);
        $('#ch37Sem').prop('checked', EvaHosp.sem37Obst ? true : false);
        $('#ch4000g').prop('checked', EvaHosp.peso4000Obst ? true : false);
        $('#chEtopico').prop('checked', EvaHosp.etOtopicoObst ? true : false);



        /////////////////////////////////////////////// GESTACION ACTUAL ///////////////////////////////////////////////
        // Asignar valores a los campos de texto (txt)
        $("#txtFechaFURGA").datepicker("setDate", FormatearFecha(EvaHosp.fechaFURGA));
        $("#txtEGsemanasGA").val(EvaHosp.eGsemanasGA);
        $("#txtEGdiasGA").val(EvaHosp.eGdiasGA);
        $('#txtFechaFPPGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaFPPGA));
        $('#txtFEcogGA').datepicker("setDate", FormatearFecha(EvaHosp.fEcogGA));
        $("#txtSemasEcoGA").val(EvaHosp.semasEcoGA);
        $("#txtDiasEcoGA").val(EvaHosp.diasEcoGA);
        $("#txtPesoAntGA").val(EvaHosp.pesoAntGA);
        $("#txtTallaAntGA").val(EvaHosp.tallaAntGA);
        $("#txtTipoDrogaGA").val(EvaHosp.tipoDrogaGA);

        // Asignar valores a los combobox (cbo)
        $("#cboEdadGestConfiableCA").val(EvaHosp.edadGestConfiableCA);
        $("#cboAlcoholDrogaGA").val(EvaHosp.alcoholDrogaGA);
        $("#cboTrimestreGA").val(EvaHosp.trimestreGA);
        $("#cboExOdontoGA").val(EvaHosp.exOdontoGA);
        $("#cboExCervixGA").val(EvaHosp.exCervixGA);
        $("#cboPreparacionPartoGA").val(EvaHosp.preparacionPartoGA);
        $("#cboViolenciaGA").val(EvaHosp.violenciaGA);
        $("#cboTrimestreVGA").val(EvaHosp.trimestreVGA);
        $("#cboExMamasGA").val(EvaHosp.exMamasGA);
        $("#cboConsejeriaLMGA").val(EvaHosp.consejeriaLMGA);
        $("#cbTamizajeHepatitisBGA").val(EvaHosp.tamizajeHepatitisBGA);

        // Asignar valores de vacunación (cbo y txt)
        $("#cboTetanoGA").val(EvaHosp.tetanoGA);
        $('#txtFechaTetanoGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaTetanoGA));
        $("#txtDosisTetanoGA").val(EvaHosp.dosisTetanoGA);

        $("#cboTDAPGA").val(EvaHosp.tdapga);
        $('#txtFechaTDAPGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaTDAPGA));
        $("#txtDosisTDAPGA").val(EvaHosp.dosisTDAPGA);

        $("#cboInfluenzaGA").val(EvaHosp.influenzaGA);
        $('#txtFechaInfluenzaGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaInfluenzaGA));
        $("#txtDosisInfluenzaGA").val(EvaHosp.dosisInfluenzaGA);

        $("#cboAntirubiolaGA").val(EvaHosp.antirubiolaGA);
        $('#txtFechaAntirubiolaGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaAntirubiolaGA));
        $("#txtDosisAntirubiolaGA").val(EvaHosp.dosisAntirubiolaGA);

        $("#cboHepatitisBGA").val(EvaHosp.hepatitisBGA);
        $('#txtFechaHepatitisBGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaHepatitisBGA));
        $("#txtDosisHepatitisBGA").val(EvaHosp.dosisHepatitisBGA);

        $("#cboHepatitisAGA").val(EvaHosp.hepatitisAGA);
        $('#txtFechaHepatitisAGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaHepatitisAGA));
        $("#txtDosisHepatitisAGA").val(EvaHosp.dosisHepatitisAGA);

        // Asignar valores a los checkbox (chk)
        $('#chkMuestraEcoGA').prop('checked', EvaHosp.muestraEcoGA ? true : false);
        $('#chkCalculaFechaEcoGA').prop('checked', EvaHosp.calculaFechaEcoGA ? true : false);

        //$('#chkMuestraEcoGA').prop('checked', EvaHosp.muestraEcoGA ? true : false);
        //$('#chkConFUE').prop('checked', EvaHosp.calculaFechaEcoGA ? true : false);


        let resultados = await EvaluacionGinecoObstetra.ListarResultadosLaboratorioByIdCuentaAtencion(objrowTb.idCuentaAtencion)

        if (isEmpty(EvaHosp.grupoSanguineoGA) || EvaHosp.grupoSanguineoGA == '') {
            if (!isEmpty(resultados)) {
                $(resultados).each((i, obj) => {

                    // ANTECEDENTES PERSONALES Grupo sanguíneo
                    if (obj.codigo == '86900' && obj.idItem == '84') { // Grupo sanguíneo ABO
                        $('#txtGrupoSanguineoGA').val(obj.valorTexto)
                    }
                    // END ANTECEDENTES PERSONALES Grupo sanguíneo

                })
            }
        } else {
            $('#txtGrupoSanguineoGA').val(EvaHosp.grupoSanguineoGA || '');
        }

        if (isEmpty(EvaHosp.factorRhGA) || EvaHosp.factorRhGA == '') {

            let factorRh = await EvaluacionGinecoObstetra.SeleccionarItemResultadoExamen(Variables.IdPaciente, '86901', 18, 426);

            $('#txtFactorRhGA').val(factorRh?.valor)
        } else {
            $('#txtFactorRhGA').val(EvaHosp?.factorRhGA || '');
        }


        
        //$('#txtFactorRhGA').val(EvaHosp.factorRhGA || '');




        $('#txtHbMenor20GA').val(EvaHosp.hbMenor20GA || '');
        $('#txtHbMayor20GA').val(EvaHosp.hbMayor20GA || '');
        $('#txtGlausemiaMenor20GA').val(EvaHosp.glausemiaMenor20GA || '');
        $('#txtGlausemiaMayor20GA').val(EvaHosp.glausemiaMayor20GA || '');

        // Campos numéricos
        $('#cboToxoplasmosisGA').val(EvaHosp.toxoplasmosisGA !== null ? EvaHosp.toxoplasmosisGA : '');
        $('#cboPapanicolauGA').val(EvaHosp.papanicolauGA !== null ? EvaHosp.papanicolauGA : '');
        $('#cboVihSolicitadoGA').val(EvaHosp.vihSolicitadoGA !== null ? EvaHosp.vihSolicitadoGA : '');
        $('#cboVdrlRprMenor20GA').val(EvaHosp.vdrlRprMenor20GA !== null ? EvaHosp.vdrlRprMenor20GA : '');
        $('#cboVdrlRprMayor20GA').val(EvaHosp.vdrlRprMayor20GA !== null ? EvaHosp.vdrlRprMayor20GA : '');
        $('#cboSifilisFtaGA').val(EvaHosp.sifilisFtaGA !== null ? EvaHosp.sifilisFtaGA : '');
        $('#cboFolatosGA').val(EvaHosp.folatosGA !== null ? EvaHosp.folatosGA : '');
        $('#cboVersExterGA').val(EvaHosp.versExterGA !== null ? EvaHosp.versExterGA : '');
        $('#cboBacteriuriaGA').val(EvaHosp.bacteriuriaGA !== null ? EvaHosp.bacteriuriaGA : '');
        $('#cboChagasGA').val(EvaHosp.chagasGA !== null ? EvaHosp.chagasGA : '');
        $('#cboPaludismoMalariaGA').val(EvaHosp.paludismoMalariaGA !== null ? EvaHosp.paludismoMalariaGA : '');
        $('#cboEstreptococoGA').val(EvaHosp.estreptococoGA !== null ? EvaHosp.estreptococoGA : '');

        if (EvaHosp.numControlesInmpGA > 0) {
            $("#cboControlInmpGA").val(1);
        } else {
            $("#cboControlInmpGA").val(0);
        }

        $("#cboControlInmpGA").val(EvaHosp.controlInmpGA);
        $("#txtNumControlesInmpGA").val(EvaHosp.numControlesInmpGA);

        $("#txtFechaPrimerControlGA").datepicker("setDate", FormatearFecha(EvaHosp.fechaPrimerControl))
        $("#txtFechaUltimoControlGA").datepicker("setDate", FormatearFecha(EvaHosp.fechaUltimoControl))

        if (!isEmpty(EvaHosp.cnp) && EvaHosp.cnp != '' && EvaHosp.cnp != 0 && $("#txtNumControlesInmpGA").val() == '') {
            $('#cboControlInmpGA').val(1)
            $('#txtNumControlesInmpGA').val(EvaHosp.cnp);
        }

        if (!isEmpty(EvaHosp.fechaPrimerControl) && EvaHosp.fechaPrimerControl != '' && EvaHosp.fechaPrimerControl != 0 && $("#txtFechaPrimerControlGA").val() == '') {
            $('#txtFechaPrimerControlGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaPrimerControl))
        }
        if (!isEmpty(EvaHosp.fechaUltimoControl) && EvaHosp.fechaUltimoControl != '' && EvaHosp.fechaUltimoControl != 0 && $("#txtFechaUltimoControlGA").val() == '') {
            $('#txtFechaUltimoControlGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaUltimoControl))
        }

        



        $("#txtIdReferenciaEESSGA").val(EvaHosp.idReferenciaEESSGA);
        $("#txtCodigoReferenciaEESSGA").val(EvaHosp.codigoReferenciaEESSGA);
        $("#txtDescripcionReferenciaEESSGA").val(EvaHosp.descripcionReferenciaEESSGA);
        $("#txtNumControlesOtroESSGA").val(EvaHosp.numControlesOtroESSGA);
        $("#txtIdReferenciaOtroEESSGA").val(EvaHosp.idReferenciaOtroEESSGA);
        $("#txtCodigoReferenciaOtroEESSGA").val(EvaHosp.codigoReferenciaOtroEESSGA);
        $("#txtDescripcionReferenciaOtroEESSGA").val(EvaHosp.descripcionReferenciaOtroEESSGA);
        $("#txtMotivoReferenciaGA").val(EvaHosp.motivoReferenciaGA);
        $("#cboRequirioHospitalizacionGA").val(EvaHosp.requirioHospitalizacionGA);
        $("#txtDiasHospitalizacionCpnGA").val(EvaHosp.diasHospitalizacionCpnGA);
        $("#txtObservacionesCpnGA").val(EvaHosp.observacionesCpnGA);

        $("#txtQuirurgicos").val(EvaHosp.antecedQuirurgico);
        $("#txtPatologicos").val(EvaHosp.antecedPatologico);
        $("#txtObstetricos").val(EvaHosp.antecedObstetrico);
        $("#txtAlergias").val(EvaHosp.antecedAlergico);
        $("#txtOtros").val(EvaHosp.antecedentes);


        // Suponiendo que EvaHosp es el objeto que contiene los datos obtenidos de la base de datos
        $('#txtFechaUltimoIngresoCqTp').datepicker("setDate", FormatearFecha(EvaHosp.fechaUltimoIngresoCqTp));
        $('#cboCorticoidesAntenatalesCiclosTp').val(EvaHosp.corticoidesAntenatalesCiclosTp || '');
        $('#txtCorticoidesAntenatalesSemanasTp').val(EvaHosp.corticoidesAntenatalesSemanasTp || '');
        $('#cboInicioTipoTp').val(EvaHosp.inicioTipoTp || '');
        $('#txtEdadGestacionalPartoTp').val(EvaHosp.edadGestacionalPartoTp || '');
        $('#cboPresentacionSituacionTp').val(EvaHosp.presentacionSituacionTp || '');
        $('#cboTamanioFetalTp').val(EvaHosp.tamanioFetalTp || '');
        $('#cboRoturaMembranaTp').val(EvaHosp.roturaMembranaTp || '');
        $('#txtRoturaMembranaDiaTp').val(EvaHosp.roturaMembranaDiaTp || '');
        $('#txtRoturaMembranaMesTp').val(EvaHosp.roturaMembranaMesTp || '');
        $('#txtRoturaMembranaAnioTp').val(EvaHosp.roturaMembranaAnioTp || '');
        $('#chkRoturaMenor37Sem').prop('checked', EvaHosp.roturaMenor37Sem === 1);
        $('#txtRoturaMembranaHoraTp').val(EvaHosp.roturaMembranaHoraTp || '');
        $('#txtRoturaMembranaMinutoTp').val(EvaHosp.roturaMembranaMinutoTp || '');
        $('#chkMayor18Horas').prop('checked', EvaHosp.mayor18Horas === 1);
        $('#chkMayor38Grados').prop('checked', EvaHosp.mayor38Grados === 1);
        $('#cboTerminacionAp').val(EvaHosp.terminacionAp || '');
        $('#cboCausaInduccionAp').val(EvaHosp.causaInduccionAp || '');
        $('#cboAcompanianteAp').val(EvaHosp.acompanianteAp || '');
        $('#cboPosicionPartoAp').val(EvaHosp.posicionPartoAp || '');
        $('#cboEpisiotomiaAp').val(EvaHosp.episiotomiaAp || '');
        $('#cboDesgarroAp').val(EvaHosp.desgarroAp || '');
        $('#cboOcitocAlumbramAp').val(EvaHosp.ocitocAlumbramAp || '');
        $('#cboPlacentaPreviaAp').val(EvaHosp.placentaPreviaAp || '');
        $('#cboLigaduraCordonAp').val(EvaHosp.ligaduraCordonAp || '');
        $('#cboMedicacionAp').val(EvaHosp.medicacionAp || '');
        $('#cboMgSulfatoAp').val(EvaHosp.mgSulfatoAp || '');
        $('#cboOcitocicosAp').val(EvaHosp.ocitocicosAp || '');
        $('#cboAntibióticosAp').val(EvaHosp.antibioticosAp || '');
        $('#cboAnalgésiaAp').val(EvaHosp.analgesiaAp || '');
        $('#cboAnestesiaRegionalAp').val(EvaHosp.anestesiaRegionalAp || '');
        $('#cboAnestesiaGeneralAp').val(EvaHosp.anestesiaGeneralAp || '');
        $('#cboTransfusionAp').val(EvaHosp.transfusionAp || '');
        $('#txtObservacionesAtencionPartoAp').val(EvaHosp.observacionesAtencionPartoAp || '');
        $('#txtFechaPartoNacimiento').datepicker("setDate", FormatearFecha(EvaHosp.fechaPartoNacimiento));
        $('#txtHoraPartoNacimiento').val(EvaHosp.horaPartoNacimiento || '');
        $('#cboTipoGestacionNacimiento').val(EvaHosp.tipoGestacionNacimiento || '');
        $('#txtNumFetosNacimiento').val(EvaHosp.numFetosNacimiento || '');
        $('#cboGemelarNacimiento').val(EvaHosp.gemelarNacimiento || '');
        $('#cboCondicionNacimiento').val(EvaHosp.condicionNacimiento || '');
        $('#chkObitoMenor500Nacimiento').prop('checked', EvaHosp.obitoMenor500Nacimiento === 1);
        $('#chkObitoMayor500Nacimiento').prop('checked', EvaHosp.obitoMayor500Nacimiento === 1);
        $('#txtPesoNacerNacimiento').val(EvaHosp.pesoNacerNacimiento || '');
        $('#txtTallaNacerNacimiento').val(EvaHosp.tallaNacerNacimiento || '');
        $('#txtPerimetroCefalicoNacimiento').val(EvaHosp.perimetroCefalicoNacimiento || '');
        $('#txtEdadGestAlNacerNacimiento').val(EvaHosp.edadGestAlNacerNacimiento || '');
        $('#txtApgar1MinNacimiento').val(EvaHosp.apgar1MinNacimiento || '');
        $('#txtApgar5MinNacimiento').val(EvaHosp.apgar5MinNacimiento || '');
        $('input:radio[name=rdbRespuestaLlanoInmediatoNacimiento][value="' + (EvaHosp.respuestaLlanoInmediatoNacimiento || '') + '"]').prop('checked', true);
        $('input:radio[name=rdbRespuestaLlanoReanimacionNacimiento][value="' + (EvaHosp.respuestaLlanoReanimacionNacimiento || '') + '"]').prop('checked', true);
        $('input:radio[name=rdbRespuestaLlanoPatologiaNeonatalNacimiento][value="' + (EvaHosp.respuestaLlanoPatologiaNeonatalNacimiento || '') + '"]').prop('checked', true);

        Diagnosticos.PanelDx = '#PanelDiagnosticoClap ';
        Diagnosticos.IniciarScript();
        $(Diagnosticos.PanelDx + "#TituloCardDiagnostico").html("Diagnósticos de Ingreso");
        //console.log(ExaGineObs);
        if (ExaGineObs.length != 0) {
            //----------------------EXAMEN FISICO-----------------------//        
            $('input:radio[name=rdbEstGS][value=' + ExaGineObs.lEstadoGeneral + ']').attr('checked', true);
            $('#txtEstdGeneSens').val(ExaGineObs.dEstadoGeneral);
            $('#txtEdemas').val(ExaGineObs.dEdemas);
            $('input:radio[name=rdbCard][value=' + ExaGineObs.lAparatoCV + ']').attr('checked', true);
            $('#txtCardVas').val(ExaGineObs.dAparatoCV);
            $('#txtReflejos').val(ExaGineObs.dReflejos);
            $('input:radio[name=rdbAbdomen][value=' + ExaGineObs.lAbdomen + ']').attr('checked', true);
            $('#txtAbdomenNormal').val(ExaGineObs.dAbdomen);
            $('input:radio[name=rdbAptResp][value=' + ExaGineObs.lAparatoR + ']').attr('checked', true);
            $('#txtbAptResp').val(ExaGineObs.dAparatoR);
            $('input:radio[name=rdbAptUrin][value=' + ExaGineObs.lAparatoU + ']').attr('checked', true);
            $('#txtbAptUrin').val(ExaGineObs.dAparatoU);
            $('input:radio[name=rdbExtrem][value=' + ExaGineObs.lExtremidades + ']').attr('checked', true);
            $('#txtExtrem').val(ExaGineObs.dExtremidades);
            $('input:radio[name=rdbNeurologico][value=' + ExaGineObs.lNeurologico + ']').attr('checked', true);
            $('#txtNeurologico').val(ExaGineObs.dNeurologico);
            $('input:radio[name=rdbPiel][value=' + ExaGineObs.lPiel + ']').attr('checked', true);
            $('#txtPiel').val(ExaGineObs.dPiel);

            


            //----------------------EXAMEN GINECOLOGICO-----------------------//        
            $('input:radio[name=rdbGB][value=' + ExaGineObs.lGeBus + ']').attr('checked', true);
            $('#txtGB').val(ExaGineObs.dGeBus);
            $('input:radio[name=rdVagina][value=' + ExaGineObs.lVagina + ']').attr('checked', true);
            $('#txtVagina').val(ExaGineObs.dVagina);
            $('input:radio[name=rdbCervix][value=' + ExaGineObs.lCervix + ']').attr('checked', true);
            $('#txtCervix').val(ExaGineObs.dCervix);
            $('input:radio[name=rdbUtero][value=' + ExaGineObs.lUtero + ']').attr('checked', true);
            $('#txtUtero').val(ExaGineObs.dUtero);
            $('input:radio[name=rdbAnexos][value=' + ExaGineObs.lAnexos + ']').attr('checked', true);
            $('#txtAnexos').val(ExaGineObs.dAnexos);
            $('input:radio[name=rdbFsDouglas][value=' + ExaGineObs.lDouglas + ']').attr('checked', true);
            $('#txtFsDouglas').val(ExaGineObs.dDouglas);
            $('input:radio[name=rdbParam][value=' + ExaGineObs.lParametros + ']').attr('checked', true);
            $('#txtParam').val(ExaGineObs.dParametros);
            $('input:radio[name=rdbMamas][value=' + ExaGineObs.lMamas + ']').attr('checked', true);
            $('#txtMamas').val(ExaGineObs.dMamas);
            $('#txtObservacionesGinecologicas').val(ExaGineObs.observacionGinecologica);

            //----------------------EXAMEN OBSTETRICO-----------------------//        
            $('#txtAlturaUterina').val(ExaGineObs.lua);
            $('#txtDU').val(ExaGineObs.ldu);
            $('input:radio[name=rdbDips][value=' + ExaGineObs.lDips + ']').attr('checked', true);
            $('input:radio[name=rdbSoplos][value=' + ExaGineObs.lSoplos + ']').attr('checked', true);
            $('input:radio[name=rdbHidromios][value=' + ExaGineObs.lHidraminios + ']').attr('checked', true);
            $('#txtPonderado').val(ExaGineObs.lPonderado);
            $('#txtPonderadoClinico').val(ExaGineObs.lPonderadoClinico);
            $('#txtPonderadoEcografo').val(ExaGineObs.lPonderadoEcografo);
            $('#cboTipoEmbrazo').val(ExaGineObs.lTipoEmbarazo);
            $('#cboTipoEmbrazo').change();
            if (ExaGineObs.lTipoEmbarazo == 1) {
                $('input:radio[name=rdbSituacion][value=' + ExaGineObs.lSituacion + ']').attr('checked', true);
                $('input:radio[name=rdbPosicion][value=' + ExaGineObs.lPosicion + ']').attr('checked', true);
                $('input:radio[name=rdbPresentacion][value=' + ExaGineObs.lPresentacion + ']').attr('checked', true);
                $('#txtLfc').val(ExaGineObs.llcf);
                $('#txtMovFetales').val(ExaGineObs.movFetales);
            } else if (ExaGineObs.lTipoEmbarazo == 2) {
                let spp1 = ExaGineObs.dF1Spp;
                let spp2 = ExaGineObs.dF2Spp;
                let spp3 = ExaGineObs.dF3Spp;

                //-------------------FETO 01----------------------------
                if (spp1.indexOf('L') >= 0) { $('input:radio[name=rdbSituacion][value=' + 1 + ']').attr('checked', true); }
                else if (spp1.indexOf('T') >= 0) { $('input:radio[name=rdbSituacion][value=' + 2 + ']').attr('checked', true); }
                else { $('input:radio[name=rdbSituacion][value=' + 5 + ']').attr('checked', true); }

                if (spp1.indexOf('D') >= 0) { $('input:radio[name=rdbPosicion][value=' + 1 + ']').attr('checked', true); }
                else if (spp1.indexOf('I') >= 0) { $('input:radio[name=rdbPosicion][value=' + 2 + ']').attr('checked', true); }
                else { $('input:radio[name=rdbPosicion][value=' + 5 + ']').attr('checked', true); }

                if (spp1.indexOf('C') >= 0) { $('input:radio[name=rdbPresentacion][value=' + 1 + ']').attr('checked', true); }
                else if (spp1.indexOf('P') >= 0) { $('input:radio[name=rdbPresentacion][value=' + 2 + ']').attr('checked', true); }
                else { $('input:radio[name=rdbPresentacion][value=' + 5 + ']').attr('checked', true); }

                $('#txtLfc').val(ExaGineObs.lF1Lcf);
                $('#txtMovFetales').val(ExaGineObs.mfF01);

                //-------------------FETO 02----------------------------
                if (spp2.indexOf('L') >= 0) { $('input:radio[name=rdbSituacion2][value=' + 1 + ']').attr('checked', true); }
                else if (spp2.indexOf('T') >= 0) { $('input:radio[name=rdbSituacion2][value=' + 2 + ']').attr('checked', true); }
                else { $('input:radio[name=rdbSituacion2][value=' + 5 + ']').attr('checked', true); }

                if (spp2.indexOf('D') >= 0) { $('input:radio[name=rdbPosicion2][value=' + 1 + ']').attr('checked', true); }
                else if (spp2.indexOf('I') >= 0) { $('input:radio[name=rdbPosicion2][value=' + 2 + ']').attr('checked', true); }
                else { $('input:radio[name=rdbPosicion2][value=' + 5 + ']').attr('checked', true); }

                if (spp2.indexOf('C') >= 0) { $('input:radio[name=rdbPresentacion2][value=' + 1 + ']').attr('checked', true); }
                else if (spp2.indexOf('P') >= 0) { $('input:radio[name=rdbPresentacion2][value=' + 2 + ']').attr('checked', true); }
                else { $('input:radio[name=rdbPresentacion2][value=' + 5 + ']').attr('checked', true); }

                $('#txtLfc2').val(ExaGineObs.lF2Lcf);
                $('#txtMovFetales2').val(ExaGineObs.mfF02);

                //-------------------FETO 03----------------------------
                if (spp3.indexOf('L') >= 0) { $('input:radio[name=rdbSituacion3][value=' + 1 + ']').attr('checked', true); }
                else if (spp3.indexOf('T') >= 0) { $('input:radio[name=rdbSituacion3][value=' + 2 + ']').attr('checked', true); }
                else { $('input:radio[name=rdbSituacion3][value=' + 5 + ']').attr('checked', true); }

                if (spp3.indexOf('D') >= 0) { $('input:radio[name=rdbPosicion3][value=' + 1 + ']').attr('checked', true); }
                else if (spp3.indexOf('I') >= 0) { $('input:radio[name=rdbPosicion3][value=' + 2 + ']').attr('checked', true); }
                else { $('input:radio[name=rdbPosicion3][value=' + 5 + ']').attr('checked', true); }

                if (spp3.indexOf('C') >= 0) { $('input:radio[name=rdbPresentacion3][value=' + 1 + ']').attr('checked', true); }
                else if (spp3.indexOf('P') >= 0) { $('input:radio[name=rdbPresentacion3][value=' + 2 + ']').attr('checked', true); }
                else { $('input:radio[name=rdbPresentacion3][value=' + 5 + ']').attr('checked', true); }

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
            $('input:radio[name=rdbTactoVaginal][value=' + ExaGineObs.lTipoTactoVaginal + ']').attr('checked', true);
            if (ExaGineObs.lTipoTactoVaginal == 1) {
                $('#txtDilatacion').val(ExaGineObs.lDilatacion);
                $('#txtIncorporacion').val(ExaGineObs.lIncorporacion);

                $('#txtAltPresen').val(ExaGineObs.lAlPresent);
                $('#txtVarPresen').val(ExaGineObs.dVarPresent);
                EvaluacionGinecoObstetra.BloqueoDiferido(1);
            } else {
                $('#txtDilatacion').val('');
                $('#txtIncorporacion').val('');

                $('#txtAltPresen').val('');
                $('#txtVarPresen').val('');
                EvaluacionGinecoObstetra.BloqueoDiferido(0);
            }
            //$('#txtAltPresen').val(ExaGineObs.lAlPresent);
            //$('#txtVarPresen').val(ExaGineObs.dVarPresent);

            $('input:radio[name=rdbMembranaRota][value=' + ExaGineObs.membranasRotas + ']').attr('checked', true);
            if (ExaGineObs.membranasRotas == 1) {
                EvaluacionGinecoObstetra.ValidaMembranaRotas(1);
            } else if (ExaGineObs.membranasRotas == 0) {
                EvaluacionGinecoObstetra.ValidaMembranaRotas(0);
            }
            $('input:radio[name=rdbProcubito][value=' + ExaGineObs.lProcubito + ']').attr('checked', true);
            $('input:radio[name=rdbProlapso][value=' + ExaGineObs.lProlapso + ']').attr('checked', true);
            $('input:radio[name=rdbSangradoVaginal][value=' + ExaGineObs.dSangradoV + ']').attr('checked', true);

            $('input:radio[name=rdbPelvSuperior][value=' + ExaGineObs.lPelvimetriaSup + ']').attr('checked', true);
            $('input:radio[name=rdbPelvMedio][value=' + ExaGineObs.lPelvimetriaMed + ']').attr('checked', true);
            $('input:radio[name=rdbPelvInferior][value=' + ExaGineObs.lPelvimetriaInf + ']').attr('checked', true);
            $('input:radio[name=rdbPelvisGinecoide][value=' + ExaGineObs.lPelvisGinecoide + ']').attr('checked', true);
            $('#txtPelvisGinecoide').val(ExaGineObs.pelvisGineDesc);

            $('input:radio[name=rdbLiquidoAmniotico][value=' + ExaGineObs.lLiquidoA + ']').attr('checked', true);
            $('input:radio[name=rdbMalOlor][value=' + ExaGineObs.malOlor + ']').attr('checked', true);
            $('input:radio[name=rdbCompFetoPelvica][value=' + ExaGineObs.lCompatibilidadF + ']').attr('checked', true);



            ///////////////////////////////////////////////// ANTECEDENTES FAMILIARES ///////////////////////////////////////////////
            //$('input:radio[name=rdbDiabetesFam][value=' + EvaHosp.diabetesFam + ']').attr('checked', true);
            //$("#txtDiabetesFam").val(EvaHosp.diabetesDescripcionFam);  // Descripción de Diabetes

            //$('input:radio[name=rdbTbcFam][value=' + EvaHosp.tbcFam + ']').attr('checked', true);
            //$("#txtTbcFam").val(EvaHosp.tbcDescripcionFam);  // Descripción de Tbc

            //$('input:radio[name=rdbHtaFam][value=' + EvaHosp.htaFam + ']').attr('checked', true);
            //$("#txtHtaFam").val(EvaHosp.htaDescripcionFam);  // Descripción de Hta

            //$('input:radio[name=rdbGemelaresFam][value=' + EvaHosp.gemelaresFam + ']').attr('checked', true);
            //$("#txtGemelaresFam").val(EvaHosp.gemelaresDescripcionFam);  // Descripción de Gemelares

            //$('input:radio[name=rdbMalformacionesFam][value=' + EvaHosp.malformacionesFam + ']').attr('checked', true);
            //$("#txtMalformacionesFam").val(EvaHosp.malformacionesDescripcionFam);  // Descripción de Malformaciones

            //$('input:radio[name=rdbPreEclampsiaFam][value=' + EvaHosp.preEclampsiaFam + ']').attr('checked', true);
            //$("#txtPreEclampsiaFam").val(EvaHosp.preEclampsiaDescripcionFam);  // Descripción de PreEclampsia

            //$('input:radio[name=rdbCondMedicaGraveAntFam][value=' + EvaHosp.condMedicaGraveAntFam + ']').attr('checked', true);
            //$("#txtCondMedicaGraveAntFam").val(EvaHosp.otrosCondMedicaGraveAntFam);  // Descripción de Otros Antecedentes

            //$('input:radio[name=rdbOtrosAntFam][value=' + EvaHosp.otrosAntFam + ']').attr('checked', true);
            //$("#txtOtrosAntFam").val(EvaHosp.otrosAntDescripcionFam);  // Descripción de Otros Antecedentes

            //$("#txtAntecedentesGeneralesFam").val(EvaHosp.antecedentesGeneralesFam);


            ///////////////////////////////////////////////// ANTECEDENTES PERSONALES ///////////////////////////////////////////////
            //// Asignación de valores a los radio buttons y campos de texto
            //$('input:radio[name=rdbTbcPerso][value=' + EvaHosp.tbcPerso + ']').attr('checked', true);
            //$("#txtTbcPerso").val(EvaHosp.tbcPersoDescripcion);

            //$('input:radio[name=rdbHtaPerso][value=' + EvaHosp.htaPerso + ']').attr('checked', true);
            //$("#txtHtaPerso").val(EvaHosp.htaPersoDescripcion);

            //$('input:radio[name=rdbVIHPerso][value=' + EvaHosp.vihPerso + ']').attr('checked', true);
            //$("#txtVIHPerso").val(EvaHosp.vihPersoDescripcion);

            //$('input:radio[name=rdbCirugiaMayorPerso][value=' + EvaHosp.cirugiaMayorPerso + ']').attr('checked', true);
            //$("#txtCirugiaMayorPerso").val(EvaHosp.cirugiaMayorPersoDescripcion);

            //$('input:radio[name=rdbVacunaPreviaPerso][value=' + EvaHosp.vacunaPreviaPerso + ']').attr('checked', true);
            //$("#txtVacunaPreviaPerso").val(EvaHosp.vacunaPreviaPersoDescripcion);

            //$('input:radio[name=rdbDiabetesPerso][value=' + EvaHosp.diabetesPerso + ']').attr('checked', true);
            //$("#txtDiabetesPerso").val(EvaHosp.diabetesPersoDescripcion);

            //$('input:radio[name=rdbPreEclampsiaPerso][value=' + EvaHosp.preEclampsiaPerso + ']').attr('checked', true);
            //$("#txtPreEclampsiaPerso").val(EvaHosp.preEclampsiaPersoDescripcion);

            //$('input:radio[name=rdbAlergiaPerso][value=' + EvaHosp.alergiaPerso + ']').attr('checked', true);
            //$("#txtAlergiaPerso").val(EvaHosp.alergiaPersoDescripcion);

            //$('input:radio[name=rdbViolenciaPerso][value=' + EvaHosp.violenciaPerso + ']').attr('checked', true);
            //$("#txtViolenciaPerso").val(EvaHosp.violenciaPersoDescripcion);

            //$('input:radio[name=rdbCondMedicaGravePerso][value=' + EvaHosp.condMedicaGravePerso + ']').attr('checked', true);
            //$("#txtCondMedicaGraveAntPerso").val(EvaHosp.condMedicaGraveAntDescripcionPerso);

            //$('input:radio[name=rdbCardiopatiaPerso][value=' + EvaHosp.cardiopatiaPerso + ']').attr('checked', true);
            //$("#txtCardiopatiaAntPerso").val(EvaHosp.cardiopatiaAntDescripcionPerso);

            //$('input:radio[name=rdbMetropatiaPerso][value=' + EvaHosp.metropatiaPerso + ']').attr('checked', true);
            //$("#txtMetropatiaAntPerso").val(EvaHosp.metropatiaPersoAntDescripcionPerso);

            //$('input:radio[name=rdbOtrosPerso][value=' + EvaHosp.otrosPerso + ']').attr('checked', true);
            //$("#txtOtrosPerso").val(EvaHosp.otrosPersoDescripcion);


            ///// Asignar valores de campos de texto (txt)
            //// Asignar valores a los campos de texto (string)
            //$("#txtGestasP").val(EvaHosp.gestasPObst);
            //$("#txtAbortos").val(EvaHosp.abortosObst);
            //$("#txtVaginales").val(EvaHosp.vaginalesObst);
            //$("#txtNacidosVivos").val(EvaHosp.nacidosVivosObst);
            //$("#txtViven").val(EvaHosp.vivenObst);
            //$("#txt1Sem").val(EvaHosp.sem1Obst);
            //$("#txtPartos").val(EvaHosp.partosObst);
            //$("#txtCesareas").val(EvaHosp.cesareasObst);
            //$("#txtNacMuertos").val(EvaHosp.nacMuertosObst);
            //$("#txtDesp1Sem").val(EvaHosp.desp1SemObst);
            //$("#txtPesoPregesta").val(EvaHosp.pesoPregestaObst);
            //$("#txtPar1").val(EvaHosp.par1Obst);
            //$("#txtPar2").val(EvaHosp.par2Obst);
            //$("#txtPar3").val(EvaHosp.par3Obst);
            //$("#txtPar4").val(EvaHosp.par4Obst);
            ////$("#txtFinEmb").val(EvaHosp.finEmbObst);

            //$(`input[name="rdbGemelaresObst"][value="${EvaHosp.gemelaresObst}"]`).attr('checked', true)
            //$('#txtGemelaresObst').val(EvaHosp.gemelaresDescripcionObst)

            //$('#txtFinEmb').datepicker("setDate", FormatearFecha(EvaHosp.finEmbObst));

            //// Asignar valores de combobox (cbo)
            //$("#cboTerminacion").val(EvaHosp.terminacionObst);
            //$("#cboAborto").val(EvaHosp.abortoObst);
            //$("#cbofracaso").val(EvaHosp.fracasoObst);
            //$("#cboEmbplaneado").val(EvaHosp.embPlaneadoObst);

            //// Asignar valores de checkbox (ch)
            //$('#ch2500').prop('checked', EvaHosp.peso2500Obst ? true : false);
            //$('#chMult').prop('checked', EvaHosp.multObst ? true : false);
            //$('#ch37Sem').prop('checked', EvaHosp.sem37Obst ? true : false);
            //$('#ch4000g').prop('checked', EvaHosp.peso4000Obst ? true : false);
            //$('#chEtopico').prop('checked', EvaHosp.etOtopicoObst ? true : false);



            ///////////////////////////////////////////////// GESTACION ACTUAL ///////////////////////////////////////////////
            //// Asignar valores a los campos de texto (txt)
            //$("#txtFechaFURGA").datepicker("setDate", FormatearFecha(EvaHosp.fechaFURGA));
            //$("#txtEGsemanasGA").val(EvaHosp.eGsemanasGA);
            //$("#txtEGdiasGA").val(EvaHosp.eGdiasGA);
            //$('#txtFechaFPPGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaFPPGA));
            //$('#txtFEcogGA').datepicker("setDate", FormatearFecha(EvaHosp.fEcogGA));
            //$("#txtSemasEcoGA").val(EvaHosp.semasEcoGA);
            //$("#txtDiasEcoGA").val(EvaHosp.diasEcoGA);
            //$("#txtPesoAntGA").val(EvaHosp.pesoAntGA);
            //$("#txtTallaAntGA").val(EvaHosp.tallaAntGA);
            //$("#txtTipoDrogaGA").val(EvaHosp.tipoDrogaGA);

            //// Asignar valores a los combobox (cbo)
            //$("#cboEdadGestConfiableCA").val(EvaHosp.edadGestConfiableCA);
            //$("#cboAlcoholDrogaGA").val(EvaHosp.alcoholDrogaGA);
            //$("#cboTrimestreGA").val(EvaHosp.trimestreGA);
            //$("#cboExOdontoGA").val(EvaHosp.exOdontoGA);
            //$("#cboExCervixGA").val(EvaHosp.exCervixGA);
            //$("#cboPreparacionPartoGA").val(EvaHosp.preparacionPartoGA);
            //$("#cboViolenciaGA").val(EvaHosp.violenciaGA);
            //$("#cboTrimestreVGA").val(EvaHosp.trimestreVGA);
            //$("#cboExMamasGA").val(EvaHosp.exMamasGA);
            //$("#cboConsejeriaLMGA").val(EvaHosp.consejeriaLMGA);
            //$("#cbTamizajeHepatitisBGA").val(EvaHosp.tamizajeHepatitisBGA);

            //// Asignar valores de vacunación (cbo y txt)
            //$("#cboTetanoGA").val(EvaHosp.tetanoGA);
            //$('#txtFechaTetanoGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaTetanoGA));
            //$("#txtDosisTetanoGA").val(EvaHosp.dosisTetanoGA);

            //$("#cboTDAPGA").val(EvaHosp.tdapga);
            //$('#txtFechaTDAPGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaTDAPGA));
            //$("#txtDosisTDAPGA").val(EvaHosp.dosisTDAPGA);

            //$("#cboInfluenzaGA").val(EvaHosp.influenzaGA);
            //$('#txtFechaInfluenzaGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaInfluenzaGA));
            //$("#txtDosisInfluenzaGA").val(EvaHosp.dosisInfluenzaGA);

            //$("#cboAntirubiolaGA").val(EvaHosp.antirubiolaGA);
            //$('#txtFechaAntirubiolaGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaAntirubiolaGA));
            //$("#txtDosisAntirubiolaGA").val(EvaHosp.dosisAntirubiolaGA);

            //$("#cboHepatitisBGA").val(EvaHosp.hepatitisBGA);
            //$('#txtFechaHepatitisBGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaHepatitisBGA));
            //$("#txtDosisHepatitisBGA").val(EvaHosp.dosisHepatitisBGA);

            //$("#cboHepatitisAGA").val(EvaHosp.hepatitisAGA);
            //$('#txtFechaHepatitisAGA').datepicker("setDate", FormatearFecha(EvaHosp.fechaHepatitisAGA));
            //$("#txtDosisHepatitisAGA").val(EvaHosp.dosisHepatitisAGA);

            //// Asignar valores a los checkbox (chk)
            //$('#chkMuestraEcoGA').prop('checked', EvaHosp.muestraEcoGA ? true : false);
            //$('#chkCalculaFechaEcoGA').prop('checked', EvaHosp.calculaFechaEcoGA ? true : false);


            //$('#txtGrupoSanguineoGA').val(EvaHosp.grupoSanguineoGA || '');
            //$('#txtFactorRhGA').val(EvaHosp.factorRhGA || '');
            //$('#txtHbMenor20GA').val(EvaHosp.hbMenor20GA || '');
            //$('#txtHbMayor20GA').val(EvaHosp.hbMayor20GA || '');
            //$('#txtGlausemiaMenor20GA').val(EvaHosp.glausemiaMenor20GA || '');
            //$('#txtGlausemiaMayor20GA').val(EvaHosp.glausemiaMayor20GA || '');

            //// Campos numéricos
            //$('#cboToxoplasmosisGA').val(EvaHosp.toxoplasmosisGA !== null ? EvaHosp.toxoplasmosisGA : '');
            //$('#cboPapanicolauGA').val(EvaHosp.papanicolauGA !== null ? EvaHosp.papanicolauGA : '');
            //$('#cboVihSolicitadoGA').val(EvaHosp.vihSolicitadoGA !== null ? EvaHosp.vihSolicitadoGA : '');
            //$('#cboVdrlRprMenor20GA').val(EvaHosp.vdrlRprMenor20GA !== null ? EvaHosp.vdrlRprMenor20GA : '');
            //$('#cboVdrlRprMayor20GA').val(EvaHosp.vdrlRprMayor20GA !== null ? EvaHosp.vdrlRprMayor20GA : '');
            //$('#cboSifilisFtaGA').val(EvaHosp.sifilisFtaGA !== null ? EvaHosp.sifilisFtaGA : '');
            //$('#cboFolatosGA').val(EvaHosp.folatosGA !== null ? EvaHosp.folatosGA : '');
            //$('#cboVersExterGA').val(EvaHosp.versExterGA !== null ? EvaHosp.versExterGA : '');
            //$('#cboBacteriuriaGA').val(EvaHosp.bacteriuriaGA !== null ? EvaHosp.bacteriuriaGA : '');
            //$('#cboChagasGA').val(EvaHosp.chagasGA !== null ? EvaHosp.chagasGA : '');
            //$('#cboPaludismoMalariaGA').val(EvaHosp.paludismoMalariaGA !== null ? EvaHosp.paludismoMalariaGA : '');
            //$('#cboEstreptococoGA').val(EvaHosp.estreptococoGA !== null ? EvaHosp.estreptococoGA : '');


            //$("#cboControlInmpGA").val(EvaHosp.controlInmpGA);
            //$("#txtNumControlesInmpGA").val(EvaHosp.numControlesInmpGA);
            //$("#txtIdReferenciaEESSGA").val(EvaHosp.idReferenciaEESSGA);
            //$("#txtCodigoReferenciaEESSGA").val(EvaHosp.codigoReferenciaEESSGA);
            //$("#txtDescripcionReferenciaEESSGA").val(EvaHosp.descripcionReferenciaEESSGA);
            //$("#txtNumControlesOtroESSGA").val(EvaHosp.numControlesOtroESSGA);
            //$("#txtIdReferenciaOtroEESSGA").val(EvaHosp.idReferenciaOtroEESSGA);
            //$("#txtCodigoReferenciaOtroEESSGA").val(EvaHosp.codigoReferenciaOtroEESSGA);
            //$("#txtDescripcionReferenciaOtroEESSGA").val(EvaHosp.descripcionReferenciaOtroEESSGA);
            //$("#txtMotivoReferenciaGA").val(EvaHosp.motivoReferenciaGA);
            //$("#cboRequirioHospitalizacionGA").val(EvaHosp.requirioHospitalizacionGA);
            //$("#txtDiasHospitalizacionCpnGA").val(EvaHosp.diasHospitalizacionCpnGA);
            //$("#txtObservacionesCpnGA").val(EvaHosp.observacionesCpnGA);


            //// Suponiendo que EvaHosp es el objeto que contiene los datos obtenidos de la base de datos
            //$('#txtFechaUltimoIngresoCqTp').datepicker("setDate", FormatearFecha(EvaHosp.fechaUltimoIngresoCqTp));
            //$('#cboCorticoidesAntenatalesCiclosTp').val(EvaHosp.corticoidesAntenatalesCiclosTp || '');
            //$('#txtCorticoidesAntenatalesSemanasTp').val(EvaHosp.corticoidesAntenatalesSemanasTp || '');
            //$('#cboInicioTipoTp').val(EvaHosp.inicioTipoTp || '');
            //$('#txtEdadGestacionalPartoTp').val(EvaHosp.edadGestacionalPartoTp || '');
            //$('#cboPresentacionSituacionTp').val(EvaHosp.presentacionSituacionTp || '');
            //$('#cboTamanioFetalTp').val(EvaHosp.tamanioFetalTp || '');
            //$('#cboRoturaMembranaTp').val(EvaHosp.roturaMembranaTp || '');
            //$('#txtRoturaMembranaDiaTp').val(EvaHosp.roturaMembranaDiaTp || '');
            //$('#txtRoturaMembranaMesTp').val(EvaHosp.roturaMembranaMesTp || '');
            //$('#txtRoturaMembranaAnioTp').val(EvaHosp.roturaMembranaAnioTp || '');
            //$('#chkRoturaMenor37Sem').prop('checked', EvaHosp.roturaMenor37Sem === 1);
            //$('#txtRoturaMembranaHoraTp').val(EvaHosp.roturaMembranaHoraTp || '');
            //$('#txtRoturaMembranaMinutoTp').val(EvaHosp.roturaMembranaMinutoTp || '');
            //$('#chkMayor18Horas').prop('checked', EvaHosp.mayor18Horas === 1);
            //$('#chkMayor38Grados').prop('checked', EvaHosp.mayor38Grados === 1);
            //$('#cboTerminacionAp').val(EvaHosp.terminacionAp || '');
            //$('#cboCausaInduccionAp').val(EvaHosp.causaInduccionAp || '');
            //$('#cboAcompanianteAp').val(EvaHosp.acompanianteAp || '');
            //$('#cboPosicionPartoAp').val(EvaHosp.posicionPartoAp || '');
            //$('#cboEpisiotomiaAp').val(EvaHosp.episiotomiaAp || '');
            //$('#cboDesgarroAp').val(EvaHosp.desgarroAp || '');
            //$('#cboOcitocAlumbramAp').val(EvaHosp.ocitocAlumbramAp || '');
            //$('#cboPlacentaPreviaAp').val(EvaHosp.placentaPreviaAp || '');
            //$('#cboLigaduraCordonAp').val(EvaHosp.ligaduraCordonAp || '');
            //$('#cboMedicacionAp').val(EvaHosp.medicacionAp || '');
            //$('#cboMgSulfatoAp').val(EvaHosp.mgSulfatoAp || '');
            //$('#cboOcitocicosAp').val(EvaHosp.ocitocicosAp || '');
            //$('#cboAntibióticosAp').val(EvaHosp.antibioticosAp || '');
            //$('#cboAnalgésiaAp').val(EvaHosp.analgesiaAp || '');
            //$('#cboAnestesiaRegionalAp').val(EvaHosp.anestesiaRegionalAp || '');
            //$('#cboAnestesiaGeneralAp').val(EvaHosp.anestesiaGeneralAp || '');
            //$('#cboTransfusionAp').val(EvaHosp.transfusionAp || '');
            //$('#txtObservacionesAtencionPartoAp').val(EvaHosp.observacionesAtencionPartoAp || '');
            //$('#txtFechaPartoNacimiento').datepicker("setDate", FormatearFecha(EvaHosp.fechaPartoNacimiento));
            //$('#txtHoraPartoNacimiento').val(EvaHosp.horaPartoNacimiento || '');
            //$('#cboTipoGestacionNacimiento').val(EvaHosp.tipoGestacionNacimiento || '');
            //$('#txtNumFetosNacimiento').val(EvaHosp.numFetosNacimiento || '');
            //$('#cboGemelarNacimiento').val(EvaHosp.gemelarNacimiento || '');
            //$('#cboCondicionNacimiento').val(EvaHosp.condicionNacimiento || '');
            //$('#chkObitoMenor500Nacimiento').prop('checked', EvaHosp.obitoMenor500Nacimiento === 1);
            //$('#chkObitoMayor500Nacimiento').prop('checked', EvaHosp.obitoMayor500Nacimiento === 1);
            //$('#txtPesoNacerNacimiento').val(EvaHosp.pesoNacerNacimiento || '');
            //$('#txtTallaNacerNacimiento').val(EvaHosp.tallaNacerNacimiento || '');
            //$('#txtPerimetroCefalicoNacimiento').val(EvaHosp.perimetroCefalicoNacimiento || '');
            //$('#txtEdadGestAlNacerNacimiento').val(EvaHosp.edadGestAlNacerNacimiento || '');
            //$('#txtApgar1MinNacimiento').val(EvaHosp.apgar1MinNacimiento || '');
            //$('#txtApgar5MinNacimiento').val(EvaHosp.apgar5MinNacimiento || '');
            //$('input:radio[name=rdbRespuestaLlanoInmediatoNacimiento][value="' + (EvaHosp.respuestaLlanoInmediatoNacimiento || '') + '"]').prop('checked', true);
            //$('input:radio[name=rdbRespuestaLlanoReanimacionNacimiento][value="' + (EvaHosp.respuestaLlanoReanimacionNacimiento || '') + '"]').prop('checked', true);
            //$('input:radio[name=rdbRespuestaLlanoPatologiaNeonatalNacimiento][value="' + (EvaHosp.respuestaLlanoPatologiaNeonatalNacimiento || '') + '"]').prop('checked', true);




            $('input:radio[name=rdbTieneIQxHosp][value="' + (EvaHosp.tieneIQxHosp || '') + '"]').prop('checked', true);
            $('#txtFechaIQxHosp').datepicker("setDate", FormatearFecha(EvaHosp.fechaIQxHosp));
            $('#cboMetodoPlanificacionHosp').val(EvaHosp.metodoPlanificacionHosp || '');

            
            await Diagnosticos.SeleccionarDiagnosticos(Variables.IdAtencion, 2);

            await ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)

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

        var evaluacion = await EvaluacionGinecoObstetra.SeleccionarEvaluacionDetallePorEvaluacion(idAtencion, idServicio, nroEvaluacion);
        //var evaluacion = EvaDetneo.find(evaluacion => evaluacion.idNumero === nroEvaluacion);

        //$('#FechaInicioAtencion').datepicker('setStartDate', moment(evaluacion.fecha).add(-1, 'days').toDate().format('dd/mm/yyyy'));
        //$('#FechaInicioAtencion').datepicker('setEndDate', moment(evaluacion.fecha).toDate().format('dd/mm/yyyy'));
        $('#FechaInicioAtencion').datepicker('setStartDate', moment(moment(ConvertirFormatoFecha(Variables.FechaIngreso)).toDate()).toDate().format('dd/mm/yyyy'));
        $('#FechaInicioAtencion').datepicker('setEndDate', moment().toDate());
        $('#FechaInicioAtencion').datepicker("setDate", FormatearFecha(evaluacion.fecha));

        $('#HoraInicioAtencion').val(evaluacion.horaInicioAtencion);

        $('#txtImpresionDiagnostica').val(evaluacion.seguimiento);
        //$('#txtTratamiento').val(evaluacion.indicaciones);
        $('#txtTratamiento').val(evaluacion.tratamiento);
        $('#txtPlanTrabajo').val(evaluacion.plandeTrabajo);

        if (evaluacion.idUsuario == AdmisionHospitalizacion.ObtenerIdUsuarioSesion() && AdmisionHospitalizacion.accion == 'M') {
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

            EvaluacionGinecoObstetra.nuevaEvaluacion = false;
            EvaluacionGinecoObstetra.modificaEvaluacion = true;
            EvaluacionGinecoObstetra.modificaCabecera = false;

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

        //EvaluacionGinecoObstetra.idMedico = evaluacion.idMedico;
        //EvaluacionGinecoObstetra.idServicio = evaluacion.idServicio;
        //Variables.IdMedico = EvaluacionGinecoObstetra.idMedico;
        $('#hdIdServicioPaciente').val(evaluacion.idServicio);
        $('#hdNroEvaluacion').val(evaluacion.idNumero);

        Diagnosticos.PanelDx = '#PanelDiagnostico ';
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
    ValidarVariablesEvaluacionGinecoObstetra() {
        if ($("#HoraInicioAtencion").val() == "" || $("#HoraInicioAtencion").val() == "__: __") {
            alerta2('info', '', 'Ingrese la Hora de Inicio de Atención');
            $("#HoraInicioAtencion").focus();
            return false;
        }

        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        if (ListDiagnosticos.toArray().length == 0 && EvaluacionGinecoObstetra.nuevaEvaluacion == true) {
            alerta2('info', '', 'Ingresa un diagnóstico');
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
    CargarVariablesEvaluacionGinecoObstetra() {
        var formData = new FormData();

        formData.append('IdAtencion', Variables.IdAtencion);

        formData.append('TipoPaciente', $('#cboTipoPaciente').val());
        formData.append('Prioridad', $('#cboPrioridad').val());
        formData.append('Glasgow', $('#txtGlasgow').val());

        ///////////////////////MOTIVO ATENCION//////////////////////////
        formData.append('apetitoEval', $('#txtApetitoIngreso').val());
        formData.append('sedEval', $('#txtSedIngreso').val());
        formData.append('orinaEval', $('#txtOrinaIngreso').val());
        formData.append('deposicionesEval', $('#txtDeposicionesIngreso').val());
        formData.append('suenioEval', $('#txtSeunioIngreso').val());

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

        formData.append('Relato', $('#txtRelato').val());
        formData.append('EnfermedadA', $('#txtEnfermedadActual').val());

        /////////////////////ANTECEDENTES/////////////////////////////////////
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
        formData.append('PMotiA', $('#txtP').val());
        formData.append("Pin", $("#txtPin").val());
        formData.append("DeltaPeso", $("#txtDeltaPeso").val());
        formData.append("MaduracionPulmonar", $('input:radio[name=rdbPulmonar]:checked').val());
        formData.append("MaduracionCervical", $('input:radio[name=rdbCervical]:checked').val());
        formData.append("MaduracionPulmonarDesc", $("#txtMadPulmonar").val());
        formData.append("MaduracionCervicalDesc", $("#txtMadCervical").val());

        formData.append("Antecedentes", $("#txtAntecedentesMedicos").val());
        formData.append("Ram", $("#txtRam").val());
        formData.append("TransfucionSangre", $('input:radio[name=rdbTransfucion]:checked').val());

        formData.append("AntecedentesQuirurgicos", $("#txtAntecedentesQuirurgico").val());
        //formData.append("Sintomas", $("#txtSignosSintomas").val());

        /////////////////////ANTECEDENTES FAMILIARES/////////////////////////////////////
        formData.append('DiabetesFam', $('input:radio[name=rdbDiabetesFam]:checked').val());
        formData.append("DiabetesDescripcionFam", $("#txtDiabetesFam").val());
        formData.append('TbcFam', $('input:radio[name=rdbTbcFam]:checked').val());
        formData.append("TbcDescripcionFam", $("#txtTbcFam").val());
        formData.append('HtaFam', $('input:radio[name=rdbHtaFam]:checked').val());
        formData.append("HtaDescripcionFam", $("#txtHtaFam").val());
        formData.append('GemelaresFam', $('input:radio[name=rdbGemelaresFam]:checked').val());
        formData.append("GemelaresDescripcionFam", $("#txtGemelaresFam").val());
        formData.append('MalformacionesFam', $('input:radio[name=rdbMalformacionesFam]:checked').val());
        formData.append("MalformacionesDescripcionFam", $("#txtMalformacionesFam").val());
        formData.append('PreEclampsiaFam', $('input:radio[name=rdbPreEclampsiaFam]:checked').val());
        formData.append("PreEclampsiaDescripcionFam", $("#txtPreEclampsiaFam").val());
        formData.append('OtrosAntFam', $('input:radio[name=rdbOtrosAntFam]:checked').val());
        formData.append("OtrosAntDescripcionFam", $("#txtOtrosAntFam").val());
        formData.append("AntecedentesGeneralesFam", $("#txtAntecedentesGeneralesFam").val());

        formData.append('CondMedicaGraveAntFam', $('input:radio[name=rdbCondMedicaGraveAntFam]:checked').val());
        formData.append("OtrosCondMedicaGraveAntFam", $("#txtCondMedicaGraveAntFam").val());

        formData.append('CondMedicaGravePerso', $('input:radio[name=rdbCondMedicaGravePerso]:checked').val());
        formData.append("CondMedicaGraveAntDescripcionPerso", $("#txtCondMedicaGraveAntPerso").val());
        formData.append('CardiopatiaPerso', $('input:radio[name=rdbCardiopatiaPerso]:checked').val());
        formData.append("CardiopatiaAntDescripcionPerso", $("#txtCardiopatiaAntPerso").val());
        formData.append('MetropatiaPerso', $('input:radio[name=rdbMetropatiaPerso]:checked').val());
        formData.append("MetropatiaPersoAntDescripcionPerso", $("#txtMetropatiaAntPerso").val());

        /////////////////////ANTECEDENTES PERSONALES/////////////////////////////////////
        formData.append('TbcPerso', $('input:radio[name=rdbTbcPerso]:checked').val());
        formData.append("TbcPersoDescripcion", $("#txtTbcPerso").val());
        formData.append('HtaPerso', $('input:radio[name=rdbHtaPerso]:checked').val());
        formData.append("HtaPersoDescripcion", $("#txtHtaPerso").val());
        formData.append('VIHPerso', $('input:radio[name=rdbVIHPerso]:checked').val());
        formData.append("VIHPersoDescripcion", $("#txtVIHPerso").val());
        formData.append('CirugiaMayorPerso', $('input:radio[name=rdbCirugiaMayorPerso]:checked').val());
        formData.append("CirugiaMayorPersoDescripcion", $("#txtCirugiaMayorPerso").val());
        formData.append('VacunaPreviaPerso', $('input:radio[name=rdbVacunaPreviaPerso]:checked').val());
        formData.append("VacunaPreviaPersoDescripcion", $("#txtVacunaPreviaPerso").val());
        formData.append('DiabetesPerso', $('input:radio[name=rdbDiabetesPerso]:checked').val());
        formData.append("DiabetesPersoDescripcion", $("#txtDiabetesPerso").val());
        formData.append('PreEclampsiaPerso', $('input:radio[name=rdbPreEclampsiaPerso]:checked').val());
        formData.append("PreEclampsiaPersoDescripcion", $("#txtPreEclampsiaPerso").val());
        formData.append('AlergiaPerso', $('input:radio[name=rdbAlergiaPerso]:checked').val());
        formData.append("AlergiaPersoDescripcion", $("#txtAlergiaPerso").val());
        formData.append('ViolenciaPerso', $('input:radio[name=rdbViolenciaPerso]:checked').val());
        formData.append("ViolenciaPersoDescripcion", $("#txtViolenciaPerso").val());
        formData.append('OtrosPerso', $('input:radio[name=rdbOtrosPerso]:checked').val());
        formData.append("OtrosPersoDescripcion", $("#txtOtrosPerso").val());


        /////////////////////ANTECEDENTES OBSTETRICOS/////////////////////////////////////
        formData.append("GestasPObst", $("#txtGestasP").val());
        formData.append("AbortosObst", $("#txtAbortos").val());
        formData.append("VaginalesObst", $("#txtVaginales").val());
        formData.append("NacidosVivosObst", $("#txtNacidosVivos").val());
        formData.append("VivenObst", $("#txtViven").val());
        formData.append("Sem1Obst", $("#txt1Sem").val());
        formData.append("PartosObst", $("#txtPartos").val());
        formData.append("CesareasObst", $("#txtCesareas").val());
        formData.append("NacMuertosObst", $("#txtNacMuertos").val());
        formData.append("Desp1SemObst", $("#txtDesp1Sem").val());
        formData.append("PesoPregestaObst", $("#txtPesoPregesta").val());
        formData.append("Par1Obst", $("#txtPar1").val());
        formData.append("Par2Obst", $("#txtPar2").val());
        formData.append("Par3Obst", $("#txtPar3").val());
        formData.append("Par4Obst", $("#txtPar4").val());

        formData.append('GemelaresObst', $('input:radio[name=rdbGemelaresObst]:checked').val());
        formData.append("GemelaresDescripcionObst", $("#txtGemelaresObst").val());

        formData.append("FinEmbObst", $("#txtFinEmb").val());
        formData.append("TerminacionObst", $("#cboTerminacion").val());
        formData.append("AbortoObst", $("#cboAborto").val());
        formData.append("FracasoObst", $("#cbofracaso").val());
        formData.append("EmbPlaneadoObst", $("#cboEmbplaneado").val());

        formData.append("Peso2500Obst", $('#ch2500').is(':checked') ? 1 : 0);
        formData.append("MultObst", $('#chMult').is(':checked') ? 1 : 0);
        formData.append("Sem37Obst", $('#ch37Sem').is(':checked') ? 1 : 0);
        formData.append("Peso4000Obst", $('#ch4000g').is(':checked') ? 1 : 0);
        formData.append("EtOtopicoObst", $('#chEtopico').is(':checked') ? 1 : 0);

        /////////////////////GESTACION ACTUAL/////////////////////////////////////
        formData.append("FechaFURGA", $("#txtFechaFURGA").val());
        formData.append("EGsemanasGA", $("#txtEGsemanasGA").val());
        formData.append("EGdiasGA", $("#txtEGdiasGA").val());
        formData.append("FechaFPPGA", $("#txtFechaFPPGA").val());
        formData.append("MuestraEcoGA", $('#chkMuestraEcoGA').is(':checked') ? 1 : 0);
        formData.append("FEcogGA", $("#txtFEcogGA").val());
        formData.append("SemasEcoGA", $("#txtSemasEcoGA").val());
        formData.append("DiasEcoGA", $("#txtDiasEcoGA").val());
        formData.append("CalculaFechaEcoGA", $('#chkCalculaFechaEcoGA').is(':checked') ? 1 : 0);
        formData.append("EdadGestConfiableCA", $("#cboEdadGestConfiableCA").val());
        formData.append("PesoAntGA", $("#txtPesoAntGA").val());
        formData.append("TallaAntGA", $("#txtTallaAntGA").val());
        formData.append("AlcoholDrogaGA", $("#cboAlcoholDrogaGA").val());
        formData.append("TipoDrogaGA", $("#txtTipoDrogaGA").val());
        formData.append("TrimestreGA", $("#cboTrimestreGA").val());
        formData.append("ExOdontoGA", $("#cboExOdontoGA").val());
        formData.append("ExCervixGA", $("#cboExCervixGA").val());
        formData.append("PreparacionPartoGA", $("#cboPreparacionPartoGA").val());
        formData.append("ViolenciaGA", $("#cboViolenciaGA").val());
        formData.append("TrimestreVGA", $("#cboTrimestreVGA").val());
        formData.append("ExMamasGA", $("#cboExMamasGA").val());
        formData.append("ConsejeriaLMGA", $("#cboConsejeriaLMGA").val());
        formData.append("TamizajeHepatitisBGA", $("#cbTamizajeHepatitisBGA").val());
        formData.append("TetanoGA", $("#cboTetanoGA").val());
        formData.append("FechaTetanoGA", $("#txtFechaTetanoGA").val());
        formData.append("DosisTetanoGA", $("#txtDosisTetanoGA").val());
        formData.append("TDAPGA", $("#cboTDAPGA").val());
        formData.append("FechaTDAPGA", $("#txtFechaTDAPGA").val());
        formData.append("DosisTDAPGA", $("#txtDosisTDAPGA").val());
        formData.append("InfluenzaGA", $("#cboInfluenzaGA").val());
        formData.append("FechaInfluenzaGA", $("#txtFechaInfluenzaGA").val());
        formData.append("DosisInfluenzaGA", $("#txtDosisInfluenzaGA").val());
        formData.append("AntirubiolaGA", $("#cboAntirubiolaGA").val());
        formData.append("FechaAntirubiolaGA", $("#txtFechaAntirubiolaGA").val());
        formData.append("DosisAntirubiolaGA", $("#txtDosisAntirubiolaGA").val());
        formData.append("HepatitisBGA", $("#cboHepatitisBGA").val());
        formData.append("FechaHepatitisBGA", $("#txtFechaHepatitisBGA").val());
        formData.append("DosisHepatitisBGA", $("#txtDosisHepatitisBGA").val());
        formData.append("HepatitisAGA", $("#cboHepatitisAGA").val());
        formData.append("FechaHepatitisAGA", $("#txtFechaHepatitisAGA").val());
        formData.append("DosisHepatitisAGA", $("#txtDosisHepatitisAGA").val());


        formData.append("GrupoSanguineoGA", $("#txtGrupoSanguineoGA").val());
        formData.append("FactorRhGA", $("#txtFactorRhGA").val());
        formData.append("ToxoplasmosisGA", $("#cboToxoplasmosisGA").val());
        formData.append("PapanicolauGA", $("#cboPapanicolauGA").val());
        formData.append("VihSolicitadoGA", $("#cboVihSolicitadoGA").val());
        formData.append("VdrlRprMenor20GA", $("#cboVdrlRprMenor20GA").val());
        formData.append("VdrlRprMayor20GA", $("#cboVdrlRprMayor20GA").val());
        formData.append("SifilisFtaGA", $("#cboSifilisFtaGA").val());
        formData.append("HbMenor20GA", $("#txtHbMenor20GA").val());
        formData.append("HbMayor20GA", $("#txtHbMayor20GA").val());
        formData.append("FolatosGA", $("#cboFolatosGA").val());
        formData.append("VersExterGA", $("#cboVersExterGA").val());
        formData.append("BacteriuriaGA", $("#cboBacteriuriaGA").val());
        formData.append("ChagasGA", $("#cboChagasGA").val());
        formData.append("PaludismoMalariaGA", $("#cboPaludismoMalariaGA").val());
        formData.append("EstreptococoGA", $("#cboEstreptococoGA").val());
        formData.append("GlausemiaMenor20GA", $("#txtGlausemiaMenor20GA").val());
        formData.append("GlausemiaMayor20GA", $("#txtGlausemiaMayor20GA").val());


        formData.append("ControlInmpGA", $("#cboControlInmpGA").val());
        formData.append("NumControlesInmpGA", $("#txtNumControlesInmpGA").val());
        formData.append("IdReferenciaEESSGA", $("#txtIdReferenciaEESSGA").val());
        formData.append("CodigoReferenciaEESSGA", $("#txtCodigoReferenciaEESSGA").val());
        formData.append("DescripcionReferenciaEESSGA", $("#txtDescripcionReferenciaEESSGA").val());
        formData.append("NumControlesOtroESSGA", $("#txtNumControlesOtroESSGA").val());
        formData.append("IdReferenciaOtroEESSGA", $("#txtIdReferenciaOtroEESSGA").val());
        formData.append("CodigoReferenciaOtroEESSGA", $("#txtCodigoReferenciaOtroEESSGA").val());
        formData.append("DescripcionReferenciaOtroEESSGA", $("#txtDescripcionReferenciaOtroEESSGA").val());
        formData.append("MotivoReferenciaGA", $("#txtMotivoReferenciaGA").val());
        formData.append("RequirioHospitalizacionGA", $("#cboRequirioHospitalizacionGA").val());
        formData.append("DiasHospitalizacionCpnGA", $("#txtDiasHospitalizacionCpnGA").val());
        formData.append("ObservacionesCpnGA", $("#txtObservacionesCpnGA").val());

        formData.append("FechaPrimerControl", $("#txtFechaPrimerControlGA").val());
        formData.append("FechaUltimoControl", $("#txtFechaUltimoControlGA").val());



        formData.append("FechaUltimoIngresoCqTp", $("#txtFechaUltimoIngresoCqTp").val());
        formData.append("CorticoidesAntenatalesCiclosTp", $("#cboCorticoidesAntenatalesCiclosTp").val());
        formData.append("CorticoidesAntenatalesSemanasTp", $("#txtCorticoidesAntenatalesSemanasTp").val());
        formData.append("InicioTipoTp", $("#cboInicioTipoTp").val());
        formData.append("EdadGestacionalPartoTp", $("#txtEdadGestacionalPartoTp").val());
        formData.append("PresentacionSituacionTp", $("#cboPresentacionSituacionTp").val());
        formData.append("TamanioFetalTp", $("#cboTamanioFetalTp").val());
        formData.append("RoturaMembranaTp", $("#cboRoturaMembranaTp").val());
        formData.append("RoturaMembranaDiaTp", $("#txtRoturaMembranaDiaTp").val());
        formData.append("RoturaMembranaMesTp", $("#txtRoturaMembranaMesTp").val());
        formData.append("RoturaMembranaAnioTp", $("#txtRoturaMembranaAnioTp").val());
        formData.append("RoturaMenor37Sem", $('#chkRoturaMenor37Sem').is(':checked') ? 1 : 0);
        formData.append("RoturaMembranaHoraTp", $("#txtRoturaMembranaHoraTp").val());
        formData.append("RoturaMembranaMinutoTp", $("#txtRoturaMembranaMinutoTp").val());
        formData.append("Mayor18Horas", $('#chkMayor18Horas').is(':checked') ? 1 : 0);
        formData.append("Mayor38Grados", $('#chkMayor38Grados').is(':checked') ? 1 : 0);
        formData.append("TerminacionAp", $("#cboTerminacionAp").val());
        formData.append("CausaInduccionAp", $("#cboCausaInduccionAp").val());
        formData.append("AcompanianteAp", $("#cboAcompanianteAp").val());
        formData.append("PosicionPartoAp", $("#cboPosicionPartoAp").val());
        formData.append("EpisiotomiaAp", $("#cboEpisiotomiaAp").val());
        formData.append("DesgarroAp", $("#cboDesgarroAp").val());
        formData.append("OcitocAlumbramAp", $("#cboOcitocAlumbramAp").val());
        formData.append("PlacentaPreviaAp", $("#cboPlacentaPreviaAp").val());
        formData.append("LigaduraCordonAp", $("#cboLigaduraCordonAp").val());
        formData.append("MedicacionAp", $("#cboMedicacionAp").val());
        formData.append("MgSulfatoAp", $("#cboMgSulfatoAp").val());
        formData.append("OcitocicosAp", $("#cboOcitocicosAp").val());
        formData.append("AntibioticosAp", $("#cboAntibióticosAp").val());
        formData.append("AnalgesiaAp", $("#cboAnalgésiaAp").val());
        formData.append("AnestesiaRegionalAp", $("#cboAnestesiaRegionalAp").val());
        formData.append("AnestesiaGeneralAp", $("#cboAnestesiaGeneralAp").val());
        formData.append("TransfusionAp", $("#cboTransfusionAp").val());
        formData.append("ObservacionesAtencionPartoAp", $("#txtObservacionesAtencionPartoAp").val());
        formData.append("FechaPartoNacimiento", $("#txtFechaPartoNacimiento").val());
        formData.append("HoraPartoNacimiento", $("#txtHoraPartoNacimiento").val());
        formData.append("TipoGestacionNacimiento", $("#cboTipoGestacionNacimiento").val());
        formData.append("NumFetosNacimiento", $("#txtNumFetosNacimiento").val());
        formData.append("GemelarNacimiento", $("#cboGemelarNacimiento").val());
        formData.append("CondicionNacimiento", $("#cboCondicionNacimiento").val());
        formData.append("ObitoMenor500Nacimiento", $('#chkObitoMenor500Nacimiento').is(':checked') ? 1 : 0);
        formData.append("ObitoMayor500Nacimiento", $('#chkObitoMayor500Nacimiento').is(':checked') ? 1 : 0);
        formData.append("PesoNacerNacimiento", $("#txtPesoNacerNacimiento").val());
        formData.append("TallaNacerNacimiento", $("#txtTallaNacerNacimiento").val());
        formData.append("PerimetroCefalicoNacimiento", $("#txtPerimetroCefalicoNacimiento").val());
        formData.append("EdadGestAlNacerNacimiento", $("#txtEdadGestAlNacerNacimiento").val());
        formData.append("Apgar1MinNacimiento", $("#txtApgar1MinNacimiento").val());
        formData.append("Apgar5MinNacimiento", $("#txtApgar5MinNacimiento").val());
        formData.append("RespuestaLlanoInmediatoNacimiento", $('input:radio[name=rdbRespuestaLlanoInmediatoNacimiento]:checked').val());
        formData.append("RespuestaLlanoReanimacionNacimiento", $('input:radio[name=rdbRespuestaLlanoReanimacionNacimiento]:checked').val());
        formData.append("RespuestaLlanoPatologiaNeonatalNacimiento", $('input:radio[name=rdbRespuestaLlanoPatologiaNeonatalNacimiento]:checked').val());

        formData.append("IafaPlanHosp", $("#txtIafaPlanHosp").val());
        formData.append("RiesgoSocialHosp", $("#txtRiesgoSocialHosp").val());
        formData.append("MedicoIngresoHosp", $("#txtMedicoIngresoHosp").val());
        formData.append("TieneIQxHosp", $('input:radio[name=rdbTieneIQxHosp]:checked').val());
        formData.append("FechaIQxHosp", $("#txtFechaIQxHosp").val());
        formData.append("MetodoPlanificacionHosp", $("#cboMetodoPlanificacionHosp").val());



        Diagnosticos.PanelDx = '#PanelDiagnosticoClap ';
        ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        formData.append('lstDiagnosticosIngreso', JSON.stringify(ListDiagnosticos.toArray()));


        /////////////////////EXAMEN FISICO/////////////////////////////////////
        formData.append('DescripcionExamenFisico', $('#txtDescripcionExamenFisico').val());

        //formData.append('PesoFetalAnt', $('#txtMayorPesoFetal').val());

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

        formData.append('DF1Spp', EvaluacionGinecoObstetra.FormatearSPP($('input:radio[name=rdbSituacion]:checked').val(), $('input:radio[name=rdbPresentacion]:checked').val(), $('input:radio[name=rdbPosicion]:checked').val()));
        formData.append('DF2Spp', EvaluacionGinecoObstetra.FormatearSPP($('input:radio[name=rdbSituacion2]:checked').val(), $('input:radio[name=rdbPresentacion2]:checked').val(), $('input:radio[name=rdbPosicion2]:checked').val()));
        formData.append('DF3Spp', EvaluacionGinecoObstetra.FormatearSPP($('input:radio[name=rdbSituacion3]:checked').val(), $('input:radio[name=rdbPresentacion3]:checked').val(), $('input:radio[name=rdbPosicion3]:checked').val()));
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

    CargarVariablesEvaluacionGinecoObstetraDetalle() {
        var formData = new FormData();
        //var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();
        var objrowTb2 = oTable_EvaHosp.api(true).row('.selected').data();

        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        //console.log("idusu: " + objrowTb2);
        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();

        //var nroEval = isEmpty(objrowTb2) ? (oTable_EvaHosp.DataTable().data().count() + 1) : objrowTb2.idNumero;

        formData.append('IdCuentaAtencion', Variables.IdCuentaAtencion);
        formData.append('IdAtencion', Variables.IdAtencion);
        formData.append('IdNumero', EvaluacionDetalle.IdNumero);
        formData.append('IdUsuario', isEmpty(objrowTb2) ? 0 : objrowTb2.idUsuario);

        formData.append('fecha', $('#FechaInicioAtencion').val());
        formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());

        formData.append('Seguimiento', $('#txtImpresionDiagnostica').val());
        //formData.append('Indicaciones', $('#txtTratamiento').val());
        formData.append('Tratamiento', $('#txtTratamiento').val());
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
    async GuardarEvaluacionGinecoObstetra() {
        //Cargando(1);
        //console.log("GuardarEvaluacionNeonatal");
        var data = EvaluacionGinecoObstetra.CargarVariablesEvaluacionGinecoObstetra();
        var respuesta;
        var resp = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionGinecoObstetraHosp/GuardarEvaluacion?area=Hospitalizacion",
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
                    alerta2('info', '', datos.msj)
                    Cargando(0)
                }
            }
            else {
                alert2('warning', '', "La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2('error', '', error);
        }

        //return datos;
        return resp;
    },

    async GuardarEvaluacionGinecoObstetraDetalle() {
        //console.lo("ENTROOOOO");
        //Cargando(1);
        //console.log("GuardarEvaluacionDetalleNeonatal");
        var data = EvaluacionGinecoObstetra.CargarVariablesEvaluacionGinecoObstetraDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            //Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionGinecoObstetraHosp/GuardarEvaluacionDetalle?area=Hospitalizacion",
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
                    alerta2('info', '', datos.msj);
                    //EvaluacionGinecoObstetra.CerrarModuloNeonatal();
                    Cargando(0)
                }

            }
            else {
                alert2('warning', '', "La sesion ya expiro se volvera a recargar la pagina deta")
                Cargando(0)
                location.reload()
            }
        } catch (error) {
            //console.error(error)
            alerta2('error', '', error);
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

        var data = EvaluacionGinecoObstetra.CargarVariablesEvaluacionGinecoObstetraDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            //Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionGinecoObstetraHosp/GenerarHojaCabecera?area=Hospitalizacion",
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
                    alerta2('info', '', datos.msj);
                }

            }
            else {
                alert2('warning', '', "La sesion ya expiro se volvera a recargar la pagina")
                Cargando(0)
                location.reload()
            }
        } catch (error) {
            //console.error(error)
            alerta2('error', '', error);
        }

        //return datos;
        return resp;

        ////////////////////////////////////////////////////////////
        //console.log(data);
    },

    async SeleccionarItemResultadoExamen(idPaciente, codigoCpt, idItemGrupo, idItem) {
        let datos;
        var resp = null;
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);
        midata.append('codigoCpt', codigoCpt);
        midata.append('idItemGrupo', idItemGrupo);
        midata.append('idItem', idItem);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ExamenLaboratorioResultadoItemSeleccionar?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.dataSet.table.length > 0) {
                resp = datos.dataSet.table[0];
            }
        } catch (error) {
            alerta2("danger", "", stringify(error));
        }

        return resp;
    },

    async GuardarExamenGinecoObstetra() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionGinecoObstetra.CargarVariablesExamenGinecoObstetra();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionGinecoObstetraHosp/GuardarExamenGinecoObstetra?area=Hospitalizacion",
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
                    alerta2('info', '', datos.msj);
                }
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2('error', '', error);
        }

        //return datos;
        return resp;
    },

    LlenarCombos() {
        //var idServicio = $("#idServicio").val();
        //var midata = new FormData();
        //midata.append('idTipoServicio', idServicio);
        var midata = new FormData();
        midata.append('IdTipoServicio', 0);

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposSexo?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoSexo').empty();
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboTipoSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos sexo!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarTiposGestacion?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoGestacionNacimiento').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoGestacionNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos gestacion!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarNumeroGemelar?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboGemelarNacimiento').empty();
                gemelar = datos.table;
                
                $(datos.table).each(function (i, obj) {
                    $('#cboGemelarNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar numeros gemelar!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarTiposProcedenciaRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboProcedenciaRn').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProcedenciaRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar numeros gemelar!", "2");
                }, 900)
            }
        });


        $.ajax({
            //async: false,
            cache: false,
            //url: "/RecienNacido/ListarServiciosNacimiento?area=Hospitalizacion",
            url: "/Utilitario/ListarServicioPorTipoServicio?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboServicioNacimiento').empty();
                $('#cboServicioNacimiento').append('<option value=""></option>');

                $('#cboServicioNacimiento').append('<option  value="72">CENTRO OBSTETRICO</option>');
                $('#cboServicioNacimiento').append('<option  value="88">CENTRO QUIRURGICO</option>');
                $(datos.respuesta.table).each(function (i, obj) {
                    if ((obj.idServicio >= 2 && obj.idServicio <= 6) || (obj.idServicio >= 65 && obj.idServicio <= 68)) {
                        $('#cboServicioNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });
                $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar numeros gemelar!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarRiesgosObstetricos?area=Hospitalizacion",
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
                    alerta("ERROR", "Error listar riesgo obstetrico!", "2");
                }, 900)
            }
        });


        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarCondicionRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboCondicionNacimiento').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboCondicionNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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
            url: "/RecienNacido/ListarTiemposClampaje?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTiempoClampaje').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTiempoClampaje').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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
            url: "/RecienNacido/ListarContactoPielaPiel?area=Hospitalizacion",
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
            url: "/RecienNacido/ListarMedicosObstetrasEnfermeras?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboProfResponsable').empty();
                medobsenf = datos.table;
                /*$(datos.table).each(function (i, obj) {
                    $('#cboProfResponsable').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });*/
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar profesionales responsables!", "2");
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
                    alerta("ERROR", "Error listar tipos parto!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarTiposReanimacionRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoReanimacionRn').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoReanimacionRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos reanimacion!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarTiposTransporteRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoTransporteRn').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoTransporteRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos transporte!", "2");
                }, 900)
            }
        });

        //////////////////KHOYOSI////////////////////////////////////
        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposDocumentos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoDocumento').empty();
                $('#cboTipoDocMadre').empty();
                $(datos.lsDocumentos.table).each(function (i, obj) {
                    $('#cboTipoDocumento').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
                    $('#cboTipoDocMadre').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos documentos!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposSexo?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboSexo').empty();
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos sexo!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposEstadoCivilTodos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboEstadoCivilMadre').empty();
                $(datos.lsEstadoCivil.table).each(function (i, obj) {
                    $('#cboEstadoCivilMadre').append('<option  value="' + obj.idEstadoCivil + '">' + obj.dCorto + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos estado civil!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/TiposGradoInstruccionTodos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboGradoInstruccionMadre').empty();
                $(datos.lsGradosIns.table).each(function (i, obj) {
                    $('#cboGradoInstruccionMadre').append('<option  value="' + obj.idGradoInstruccion + '">' + obj.dCorto + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos grados instruccion!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Diagnosticos/ListarClasificacionDiagnosticos?area=Comun",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboConjuntoDiagnosticos').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboConjuntoDiagnosticos').append('<option  value="' + obj.idConjuntoDiagnostico + '">' + obj.descripcion + '</option>');
                });
                $('#cboConjuntoDiagnosticos').val("");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos grados instruccion!", "2");
                }, 900)
            }
        });
        //////////////////KHOYOSI////////////////////////////////////

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });
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
        EvaluacionGinecoObstetra.BloqueoDiferido(1);

        //$(".frmTactoVaginal").show();
        $("#examenTactoVaginal input:radio[name=rdbPelvSuperior][value=1]").attr('checked', true);
        $("#examenTactoVaginal input:radio[name=rdbPelvMedio][value=1]").attr('checked', true);
        $("#examenTactoVaginal input:radio[name=rdbPelvInferior][value=1]").attr('checked', true);

        $("#examenTactoVaginal input:radio[name=rdbMalOlor][value=1]").attr('checked', true);

        $("#examenTactoVaginal input:radio[name=rdbPelvisGinecoide][value=1]").attr('checked', true);
        $("#examenTactoVaginal input:radio[name=rdbCompFetoPelvica][value=1]").attr('checked', true);

        $('input[name="rdbDiabetesFam"][value="0"]').prop('checked', true)
        $('input[name="rdbTbcFam"][value="0"]').prop('checked', true)
        $('input[name="rdbPreEclampsiaFam"][value="0"]').prop('checked', true)
        $('input[name="rdbHtaFam"][value="0"]').prop('checked', true)
        $('input[name="rdbCondMedicaGraveAntFam"][value="0"]').prop('checked', true)
        $('input[name="rdbOtrosAntFam"][value="0"]').prop('checked', true)

        $('input[name="rdbTbcPerso"][value="0"]').prop('checked', true)
        $('input[name="txtHtaPerso"][value="0"]').prop('checked', true)
        $('input[name="txtVIHPerso"][value="0"]').prop('checked', true)
        $('input[name="txtCirugiaMayorPerso"][value="0"]').prop('checked', true)
        $('input[name="txtVacunaPreviaPerso"][value="0"]').prop('checked', true)
        $('input[name="txtCardiopatiaAntPerso"][value="0"]').prop('checked', true)
        $('input[name="txtOtrosPerso"][value="0"]').prop('checked', true)

        $('input[name="rdbDiabetesPerso"][value="0"]').prop('checked', true)
        $('input[name="rdbPreEclampsiaPerso"][value="0"]').prop('checked', true)
        $('input[name="rdbAlergiaPerso"][value="0"]').prop('checked', true)
        $('input[name="rdbViolenciaPerso"][value="0"]').prop('checked', true)
        $('input[name="rdbCondMedicaGravePerso"][value="0"]').prop('checked', true)
        $('input[name="rdbMetropatiaPerso"][value="0"]').prop('checked', true)


        $('.chzn-select').chosen().trigger("chosen:updated");
        EvaluacionGinecoObstetra.nuevaEvaluacion = false;
        EvaluacionGinecoObstetra.modificaEvaluacion = false;
        EvaluacionGinecoObstetra.modificaCabecera = false;
        EvaluacionGinecoObstetra.idMedicoPrimeraEvaluacion = 0;

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

        oTable_EvaHosp.$('tr.selected').removeClass('selected');

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

        EvaluacionGinecoObstetra.ValidaMembranaRotas(0);

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

        $("#txtFechaFURGA").attr('disabled', 'disabled');
        $("#txtEGsemanasGA").attr('disabled', 'disabled');
        $("#txtEGdiasGA").attr('disabled', 'disabled');
        $("#txtFechaFPPGA").attr('disabled', 'disabled');
        $("#chkMuestraEcoGA").attr('disabled', 'disabled');
        $("#txtFEcogGA").attr('disabled', 'disabled');
        $("#txtSemasEcoGA").attr('disabled', 'disabled');
        $("#txtDiasEcoGA").attr('disabled', 'disabled');
        $("#chkCalculaFechaEcoGA").attr('disabled', 'disabled');

        $("#txtQuirurgicos").attr('disabled', 'disabled');
        $("#txtPatologicos").attr('disabled', 'disabled');
        $("#txtObstetricos").attr('disabled', 'disabled');
        $("#txtAlergias").attr('disabled', 'disabled');
        $("#txtOtros").attr('disabled', 'disabled');

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
        await EvaluacionGinecoObstetra.IniciarScript();
    },

    async IniciarScript() {
        await EvaluacionGinecoObstetra.cargaInicial();
        EvaluacionGinecoObstetra.IniciarDataTablesEvaluacion();
        EvaluacionGinecoObstetra.InitDatablesEstablecimientos();
        EvaluacionGinecoObstetra.InitDatablesEstanciaHosp();

        // SeguimientoPacienteCPN.InitDatablesControles()
        

        EvaluacionGinecoObstetra.Eventos();

        //EvaluacionGinecoObstetra.AbrirModulo();
    },

    async cargaInicial() {
        EvaluacionGinecoObstetra.nuevaEvaluacion = false;
        EvaluacionGinecoObstetra.modificaEvaluacion = false;
        EvaluacionGinecoObstetra.modificaCabecera = false;
        //opcionModificar = false;

        await AdmisionHospitalizacion.ListarTiposGravedadAtencion();
        await AdmisionHospitalizacion.ListarTiposPaciente();
        await AdmisionHospitalizacion.ListarOrigenAtencionHospitalizacion(1);
        await AdmisionHospitalizacion.ListarTiposEmbarazo();
        await EvaluacionGinecoObstetra.ListaDepartamentos();
        await EvaluacionGinecoObstetra.ListaCatalogo(43);
        await EvaluacionGinecoObstetra.ListaCatalogo(44);
        await EvaluacionGinecoObstetra.ListaCatalogo(45);
        await EvaluacionGinecoObstetra.ListaCatalogo(46);

        await EvaluacionGinecoObstetra.LlenarCombos();

        $('#FechaInicioAtencion, #txtFechaFUR, #txtFechaFUE, #txtFechaECO, #txtFinEmb, #txtFechaUltimoIngresoCqTp, #txtFechaPartoNacimiento').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaFURGA, #txtFechaFPPGA, #txtFEcogGA, #txtFechaTetanoGA, #txtFechaTDAPGA, #txtFechaInfluenzaGA, #txtFechaAntirubiolaGA, #txtFechaHepatitisBGA, #txtFechaHepatitisAGA').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaPrimerControlGA, #txtFechaUltimoControlGA').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';


        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';

        $('#txtFechaFUR, #txtFechaFUE, #txtFechaFPP, #txtFinEmb, #txtFechaFURGA, #txtFEcogGA, #txtFechaFPPGA').mask("Dd/Mm/abcd");
        $('#txtFechaTetanoGA, #txtFechaTDAPGA, #txtFechaInfluenzaGA, #txtFechaAntirubiolaGA, #txtFechaHepatitisBGA, #txtFechaHepatitisAGA').mask("Dd/Mm/abcd");
        $('#txtFechaPrimerControlGA, #txtFechaUltimoControlGA, #txtFechaUltimoIngresoCqTp, #txtFechaPartoNacimiento').mask("Dd/Mm/abcd");

        Diagnosticos.PanelDx = '#PanelDiagnostico3 ';
        Diagnosticos.IniciarScript();

        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
        $("#HoraInicioAtencion").mask("Hn:Nn");
        $("#txtHoraPartoNacimiento").mask("Hn:Nn");


    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}