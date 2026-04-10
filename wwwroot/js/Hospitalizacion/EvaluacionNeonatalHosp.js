var gemelar = [];
var medobsenf = [];
var proferesp = 0;
var EvaluacionNeonatalHosp = {
    nuevaEvaluacion: false,
    modificaEvaluacion: false,
    modificaCabecera: false,
    idMedicoPrimeraEvaluacion: 0,
    IdAtencionSintoma: 0,
    TablaRegistroNacimiento: '',
    IdPacienteMadre: 0,
    IdCuentaAtencionMadre: 0,
    tieneTamizajeOftalmologico: 0,
    //idMedico: 0,
    //nroEvaluacion: 0,
    //idServicio: 0,

    /// <summary>
    /// EVENTOS
    /// </summary>
    /// Carga los eventos que se encargan de la interaccion y acciones en las vistas para el módulo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#evaluaciones').on('shown.bs.tab', function (event) {
            Cargando(0);
        });

        $('#tblEvaluacionesHospitalizacion tbody').on('click', 'tr', async function () {
            EvaluacionNeonatalHosp.LimpiarVistaModuloEvaluacionDetalle();
            EvaluacionNeonatalHosp.BloquearOpcionesModificacion();

            //oTable_EvaHosp.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_EvaHosp.api(true).row('.selected').data();

            if (!isEmpty(objrowTb)) {                
                EvaluacionDetalle.Cargar(objrowTb);
                //EvaluacionNeonatalHosp.nroEvaluacion = objrowTb.idNumero;
                //if (EvaluacionNeonatalHosp.nroEvaluacion > 0) {                
                if (EvaluacionDetalle.IdNumero > 0) {
                    //await EvaluacionNeonatalHosp.CargarDatosEvaluacionDetalle(Variables.IdAtencion, Variables.IdServicioEgreso, EvaluacionNeonatalHosp.nroEvaluacion);
                    await EvaluacionNeonatalHosp.CargarDatosEvaluacionDetalle(EvaluacionDetalle.IdAtencion, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdNumero);
                }
                $("#evaluaciones-tab").click();
            } else {
                swal({
                    title: 'Evaluaciones',
                    text: "No se ha seleccionado ninguna evaluación.",
                    icon: 'info',
                    allowOutsideClick: false,
                }).done();
            }
        });

        $('.ListaOpcionesEval').on('click', function () {
            EvaluacionNeonatalHosp.nuevaEvaluacion = false;
            EvaluacionNeonatalHosp.modificaEvaluacion = false;

            $("#FirmarEvalEmer").hide();
            $("#ImprimirEvalEmerCF").hide();
            $("#ImprimirEvalEmerSF").hide();

            //$("#txtFecNac").attr('disabled', true);
            //$("#txtHoraNac").attr('disabled', true);
            //$("#cboSexo").attr('disabled', true);
            //$("#txtNroHijo").attr('disabled', true);

            /*$("#CardEvaNeo").removeClass("bg-blue");*/
            $('#tblEvaluacionesHospitalizacion tbody').find('tr').removeClass("selected");
            //$("#FirmarEvalEmer").attr("href", "");  (COMNETADO POR KHOYOSI - FIRMA ANTERIOR)

            ////////////COMENTADO POR KHOYOSI//////////////////////////
            //if (AdmisionHospitalizacion.accion == 'M') {
            //    $("#btnGuardarEvaNeo").show();
            //} else {
            //    if (AdmisionHospitalizacion.accion == 'C') {
            //        $("#btnGuardarEvaNeo").hide();
            //    }
            //}
            //////////////////////////////////////////////////////////
            $("#btnGuardarEvaNeo").hide();

            //console.log("Entro Card Opciones");

            $('.chzn-select').chosen().trigger("chosen:updated");
        });


        $('#chkOtros').on('click', function () {
            if ($('#chkOtros').is(":checked")) {
                $("#txtOtroSintomas").show();
            } else {
                $("#txtOtroSintomas").val("");
                $("#txtOtroSintomas").hide();
            }

            //console.log("Entro Card Opciones");
        });

        $('.chkRiesgoPerinatal').on('change', function () {
            EvaluacionNeonatalHosp.OtroRiesgoPerinatal_Change();
        });

        $('.chkInfeccionesMaternas').on('change', function () {
            EvaluacionNeonatalHosp.OtraInfeccionMaterna_Change();
        });

        $('.chkEnfermedadesMaternas').on('change', function () {
            EvaluacionNeonatalHosp.OtraEnfermedadMaterna_Change();
        });


        ///////////////////////EVENTOS REGISTRO DE NACIMIENTOS//////////////////////////////////
        $('input[name=rdbAtendidoPor]').on('change', function () {
            EvaluacionNeonatalHosp.FiltrarProfesionalAtendio();
        });
        $('#cboTipoGestacionRn').on('change', function () {
            EvaluacionNeonatalHosp.TipoGestacion_Change();
        });

        $('#txtNroFetosRn').on('keyup', function () {
            if ($('#txtNroFetosRn').val() < 0 || $('#txtNroFetosRn').val() > 10) {
                alerta2("info", "", "El Nro Fetos no puede ser menor a 0 ni mayor a 10.");
                $('#txtNroFetosRn').val("");
            }
            EvaluacionNeonatalHosp.Fetos_Change();
        });

        $('#cboCondicionRn').on('change', function () {
            EvaluacionNeonatalHosp.Condicion_Change();
        });

        $('input[name=rdbReanimacion]').on('change', function () {
            EvaluacionNeonatalHosp.Reanimacion_Change();
        });

        $('input[name=rdbPatNeoRn]').on('change', function () {
            EvaluacionNeonatalHosp.PatNeo_Change();
        });

        $('input[name=rdbTransporte]').on('change', function () {
            EvaluacionNeonatalHosp.Transporte_Change();
        });

        $('input[name=rdbReflejoRojo]').on('change', function () {
            EvaluacionNeonatalHosp.ReflejoRojo_Change();
        });
        ////////////////////////////////////////////////////////////////////////////////////////

        $('#ImprimirEvalEmerSF').on('click', async function () {
            var objrow = oTable_EvaHosp.api(true).row('.selected').data();
            //console.log(objrow);

            Cargando(1);
            if (isEmpty(objrow)) {
                alerta2('info', '', 'Seleccione una evaluación por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(objrow.code)
                if (isEmpty(firma)) {
                    alerta2('warning', '', 'El documento no esta generado, se procedera a generar el documento.')
                    const pdf = await Utilitario.GenerarHojaEvaluacionNeonatalHosp(objrow.idCuentaAtencion, objrow.idEvaluacionDetalle, objrow.idAtencion, objrow.idServicio, objrow.idNumero);

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

        //////////////////////////////FIRMAR CON Bit4ID/////////////////////////////////////
        $('#FirmarEvalEmer').on('click', async function () {
            var objrowTb = oTable_EvaHosp.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('info', '', 'Seleccione una evaluación por favor.')
                return false
            }

            Cargando(1);
            Utilitario.TipoArchivoFirmar = 'EMER-EVA-DET';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(Variables.IdCuentaAtencion, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio);
                if (!isEmpty(paquete)) {               
                    await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data)
                }
            } else if (permisoFirmaDigital == 2) {
                const paquete = await Utilitario.CrearPaqueteArchivos7zip(Variables.IdCuentaAtencion, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio);
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
                }
            }    
            //const paquete = await Utilitario.CrearPaqueteArchivos(Variables.IdCuentaAtencion, EvaluacionNeonatalHosp.nroEvaluacion, Variables.IdServicioIngreso);
            
            Cargando(0);

        });
        ///////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////EVENTOS VISOR RECETAS////////////////////////////////////////////////////
        $('#btnVisorRecetasEmer').on('click', async function () {
            var row = oTable_EvaHosp.api(true).row('.selected').data();
            //console.log(row);
            if (typeof row === 'undefined') {
                alerta2('info', '', "Seleccione una evaluación por favor.");
            } else {
                //const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionNeonatalHosp.nroEvaluacion, Variables.IdServicioIngreso, Variables.IdMedico);
                const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdMedico);
                VisorReceta.AbrirVisorRecetas(recetas);
                //if (isEmpty(OrdenesRecetasMedicas)) {
                //    alerta(2, "No existen recetas para esta evaluación.");
                //} else {
                //    VisorReceta.AbrirVisorRecetas(OrdenesRecetasMedicas);
                //}
            }
            //console.log(OrdenesRecetas);            
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////




        /////////////////////////AGREGAR NUEVO EVALUACION////////////////////////////////////
        $("#btnNuevoRegistro").on('click', async function () {
            Cargando(1);
            var eval = oTable_EvaHosp.DataTable().data().count();

            EvaluacionDetalle.IdMedico = await Utilitario.ObtenerIdMedicoSesion();
            EvaluacionDetalle.IdServicio = Variables.IdServicioEgreso;
            EvaluacionDetalle.IdNumero = eval + 1;

            OrdenMedica.nroEvaluaciones = eval;

            if (EvaluacionDetalle.IdMedico > 0) {
                EvaluacionNeonatalHosp.LimpiarVistaModuloEvaluacionDetalle();
                EvaluacionNeonatalHosp.DesbloquearOpcionesModificacion();

                $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-success");
                $("#CardEvaNeo").addClass("bg-blue");

                $("#lblNumeroEvaluacion").html("Evaluación N° " + (eval + 1));
                $("#lblTipoEvaluacion").html("Nueva Evaluación");


                $('#FechaInicioAtencion').attr('readonly', 'readonly');
                //$('#FechaInicioAtencion').datepicker('setStartDate', moment(moment(ConvertirFormatoFecha(Variables.FechaIngreso)).toDate()).toDate().format('dd/mm/yyyy'));
                $('#FechaInicioAtencion').datepicker('setStartDate', moment(moment(ConvertirFormatoFecha(Variables.FechaIngreso)).toDate()).toDate().format('dd/mm/yyyy'));
                $('#FechaInicioAtencion').datepicker('setEndDate', moment().toDate());
                $('#FechaInicioAtencion').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

                $('#HoraInicioAtencion').val(moment().toDate().format('HH:MM'));

                EvaluacionNeonatalHosp.nuevaEvaluacion = true;
                EvaluacionNeonatalHosp.modificaEvaluacion = false;
                EvaluacionNeonatalHosp.modificaCabecera = false;
                //EvaluacionEmergencia.idMedico = Utilitario.ObtenerIdMedicoSesion();
                //Variables.IdMedico = EvaluacionEmergencia.idMedico;


                swal({
                    title: 'Evaluaciones',
                    text: "Paciente iniciara la Evaluación N° " + (eval + 1),
                    icon: 'info',
                    allowOutsideClick: false,
                }).done();

                $("#evaluaciones-tab").click();
            } else {

                swal({
                    title: 'Evaluaciones',
                    text: "Usted no tiene rol de médico para realizar una evaluación",
                    icon: 'warning',
                    allowOutsideClick: false,
                }).done();

            }

            Cargando(0);
        });
        ///////////////////////////////////////////////////////////////////////////////////////


        /////////////////////////GUARDAR Y CANCELAR EVALUACION////////////////////////
        $("#btnGuardarEvaNeo").on('click', async function () {
            var eval = oTable_EvaHosp.DataTable().data().count();

            if (eval == 0 && EvaluacionNeonatalHosp.nuevaEvaluacion == false) {
                alerta2('info', '', "No se ha registrado ninguna evaluación. Por favor registre una evaluación.");
            } else {
                if (EvaluacionNeonatalHosp.ValidarVariablesEvaluacionNeonatal()) {
                    Cargando(1);
                    //Triaje.GuardarTriajeHospEmeg(objrow.idAtencion, objrow.idServicioEgreso, 0);
                    Triaje.GuardarTriajeHospEmeg(Variables.IdAtencion, Variables.IdServicioEgreso, 0);
                    const data1 = await EvaluacionNeonatalHosp.GuardarEvaluacionNeonatal();
                    const data2 = await EvaluacionNeonatalHosp.GuardarSintomasNeonatal();
                    const data3 = await EvaluacionNeonatalHosp.GuardarAntecedentesFamiliares();
                    const data4 = await EvaluacionNeonatalHosp.GuardarRiesgosPerinatales();
                    const data5 = await EvaluacionNeonatalHosp.GuardarInfeccionesMaternas();
                    const data6 = await EvaluacionNeonatalHosp.GuardarEnfermedadesMaternas();
                    const data7 = await EvaluacionNeonatalHosp.GuardarRegistroNacimientoExterno();
                    const data10 = await EvaluacionNeonatalHosp.GuardarExamenNeonatal();

                    if (EvaluacionNeonatalHosp.nuevaEvaluacion == true || EvaluacionNeonatalHosp.modificaEvaluacion == true) {
                        if (data1 == true && data2 == true && data3 == true && data4 == true && data5 == true && data6 == true && data7 == true && data10 == true) {
                            const data4 = await EvaluacionNeonatalHosp.GuardarEvaluacionDetalleNeonatal();
                            //if (data4) {
                            //    alerta2('success', 'HOSPITALIZACIÓN', 'La evaluación se guardó correctamente.');
                            //}
                            let nuevaEval = EvaluacionNeonatalHosp.nuevaEvaluacion;
                            await EvaluacionNeonatalHosp.CargarEvaluacionDetalle(EvaluacionDetalle.IdNumero);

                            if (nuevaEval == true) {
                                swal({
                                    title: 'HOSPITALIZACIÓN',
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
                                alerta2('success', 'HOSPITALIZACIÓN', 'La evaluación se guardó correctamente.');
                            }
                        }
                    }

                    //EvaluacionNeonatalHosp.LimpiarModuloNeonatal();
                    //EvaluacionDetalle.Limpiar();
                    //AdmisionHospitalizacion.CerrarModulo();
                    //ReposicionarVista();
                    //MostrarAreaLista();
                    //AdmisionHospitalizacion.ListarAtenciones(AdmisionHospitalizacion.tipoBusqueda);

                    Cargando(0);
                }
            }
        });


        $("#btnCancelarEvaNeo").on('click', function () {
            swal({
                title: 'CERRAR',
                text: "¿Esta seguro de cerrar el módulo de evaluación?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            }).then(function (result) {
                if (result.isConfirmed) {
                    AdmisionHospitalizacion.limpiarRecetas()
                    EvaluacionNeonatalHosp.LimpiarModuloNeonatal();
                    EvaluacionDetalle.Limpiar();
                    AdmisionHospitalizacion.CerrarModulo();
                    ReposicionarVista();
                    MostrarAreaLista();
                }
                
            }, function (dimiss) {

            });
        });

        $("#btnRecargarEvaNeo").on('click', function () {
            //$('span[data-evaluacion=' + EvaluacionNeonatalHosp.nroEvaluacion + ']').click();
            $('span[data-evaluacion=' + EvaluacionDetalle.IdNumero + ']').click();
        });

        /////////////////////////////////////////////////////////////////
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// <summary>
    /// LLENAR COMBOS
    /// </summary>
    /// Lista de metodos que se encargan de llenar y cargar los combobox con los valroes correspondientes
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
            if (datos.session) {
                $(datos.lsTiposGravedad.table).each(function (i, obj) {
                    $('#cboPrioridad').append('<option  value="' + obj.idTipoGravedad + '">' + obj.descripcion + '</option>');
                });
                $('#cboPrioridad').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta2('danger', '', error);
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
            if (datos.session) {
                $(datos.lsTiposServiciosMGP.table).each(function (i, obj) {
                    $('#cboTipoPaciente').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>');
                });
                $('#cboTipoPaciente').val(3);
                $('#cboTipoPaciente').attr("disabled", true);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta2('danger', '', error);
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
            if (datos.session) {
                $(datos.lsOrigenAtencionEmer.table).each(function (i, obj) {
                    $('#cboOrigenPaciente').append('<option  value="' + obj.idOrigenAtencion + '">' + obj.descripcionLarga + '</option>');
                });
                $('#cboOrigenPaciente').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarMedicosObstetrasEnfermeras() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/RecienNacido/ListarMedicosObstetrasEnfermeras?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboProfResponsable').empty();
            medobsenf = datos.table;
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarTiposSexo() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/Utilitario/ListaTiposSexo?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboSexo').empty();
            $('#cboTipoSexoRn').empty();
            if (datos.session) {
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                    $('#cboTipoSexoRn').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                });
                $('#cboSexo').val(0);
                $('#cboTipoSexoRn').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarTiposGestacion() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/RecienNacido/ListarTiposGestacion?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboTipoGestacionRn').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboTipoGestacionRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarGemelares() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/RecienNacido/ListarNumeroGemelar?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboNumeroGemelarRn').empty();
            gemelar = datos.table;
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarTiposClampaje() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/RecienNacido/ListarTiemposClampaje?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboTiempoClampajeRn').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboTiempoClampajeRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarTiposCondicion() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/RecienNacido/ListarCondicionRn?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboCondicionRn').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboCondicionRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarTiposContactoPielaPiel() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/RecienNacido/ListarContactoPielaPiel?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboContactoPielRn').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboContactoPielRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarTiposReanimacion() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/RecienNacido/ListarTiposReanimacionRn?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboTipoReanimacionRn').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboTipoReanimacionRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarTiposTransportes() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/RecienNacido/ListarTiposTransporteRn?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboTipoTransporteRn').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboTipoTransporteRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        } catch (error) {
            alerta2('danger', '', error);
        }
    },
    
    async ListarServicios() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarServicioPorTipoServicio?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboServicioNacimientoRn').empty();
            $('#cboServicioNacimientoRn').append('<option value=""></option>');

            $('#cboServicioNacimientoRn').append('<option  value="72">CENTRO OBSTETRICO</option>');
            $('#cboServicioNacimientoRn').append('<option  value="88">CENTRO QUIRURGICO</option>');
            $(datos.respuesta.table).each(function (i, obj) {
                if ((obj.idServicio >= 2 && obj.idServicio <= 6) || (obj.idServicio >= 65 && obj.idServicio <= 68)) {
                    $('#cboServicioNacimientoRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
            $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async ListarTiposProcedencia() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "GET",
                    url: "/RecienNacido/ListarTiposProcedenciaRn?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboProcedenciaRn').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboProcedenciaRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    

    //--------------------------------LISTAR TIPOS LABOR PARTO-----------------------------------------------------------------//
    async ListarTiposLaborParto() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposInicioLaborParto?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboDescripcionInicioLabor').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboDescripcionInicioLabor').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboDescripcionInicioLabor').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposPresentacionFetal?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboPresentacionFetal').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboPresentacionFetal').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboPresentacionFetal').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposDetalleParto?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboTrabajoParto').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboTrabajoParto').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboTrabajoParto').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposDetalleCesarea?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboDetalleCesarea').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboDetalleCesarea').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboDetalleCesarea').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposSufrimientoFetal?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboSufrimientoFetal').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboSufrimientoFetal').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboSufrimientoFetal').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposTrabajoParto?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboTipoTrabajoParto').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboTipoTrabajoParto').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboTipoTrabajoParto').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposAnestesiaAplicada?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboAnestesiaAplicada').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboAnestesiaAplicada').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboAnestesiaAplicada').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposLiquidoAmniotico?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboLiquidoAmniotico').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboLiquidoAmniotico').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboLiquidoAmniotico').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposCordonUmbilical?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboCordonUmbilical').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboCordonUmbilical').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboCordonUmbilical').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposPlacenta?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboPlacenta').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboPlacenta').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboPlacenta').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposMedicamentos?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboMedicamentos').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboMedicamentos').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboMedicamentos').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarTiposLugarParto?area=Hospitalizacion",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboLugarParto').empty();
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboLugarParto').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
            });
            $('#cboLugarParto').val("");
        } catch (error) {
            alerta2('danger', '', error);
        }
    },


    //-----------------------------------------------------------------------------------------------------------------//

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// DATATABLES
    /// </summary>
    /// INICIALIZA DATA TABLE DE EVALUACIONES
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
                        $(td).html("<span data-evaluacion=" + rowData.idNumero + ">" + rowData.idNumero + "</span>");
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

    /// <summary>
    /// MODIFICAR Y CONSULTAR EVALUACION
    /// </summary>
    /// Opciones de consulta y modificacion
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async ModificarEvaluacion() {
        await EvaluacionNeonatalHosp.CargarEvaluacion();
        EvaluacionNeonatalHosp.DesbloquearCampos();
        if (EvaluacionNeonatalHosp.TablaRegistroNacimiento != 'EXTERNO') {
            EvaluacionNeonatalHosp.BloquearCamposRegistroNacimiento();
        }
        EvaluacionNeonatalHosp.BloquearCamposAntecedentes();
        //console.log("ENTROO");
    },

    async ConsultarEvaluacion() {
        await EvaluacionNeonatalHosp.CargarEvaluacion();
        EvaluacionNeonatalHosp.BloquearCampos();
        EvaluacionNeonatalHosp.BloquearCamposRegistroNacimiento();
        EvaluacionNeonatalHosp.BloquearCamposAntecedentes();
        //console.log("ENTROO");
    },

    async CargarEvaluacion() {
        //opcionModificar = true;
        //var objrow = oTable_atencionesHosp.api(true).row('.selected').data();

        //this.LimpiarModal();
        //this.HabilitarModal();
        AdmisionHospitalizacion.limpiarRecetas()
        EvaluacionNeonatalHosp.LimpiarModuloNeonatal();
        //Triaje.listaTriajeEmgHosp(objrow.idAtencion, objrow.idServicioEgreso, 0);
        ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion);
        await EvaluacionNeonatalHosp.CargarDatosEvaluacion();
        //EvaluacionNeonatalHosp.AbrirModalNeonatal();

        //AdmisionHospitalizacion.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        //ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        

        //idPacienteGlobal = objrow.idPaciente;     //idPaciente para el Alta

        $("#motivo-tab").click();
        //this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);

        //$("#btnGuardarEvaNeo").hide();
        //$("#btnNuevoRegistro").show();

        MostrarAreaRegistro();
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    async CargarEvaluacionDetalle(idEval) {
        AdmisionHospitalizacion.limpiarRecetas()
        EvaluacionNeonatalHosp.LimpiarModuloNeonatal();
        ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion);
        await EvaluacionNeonatalHosp.CargarDatosEvaluacion();        

        let evaluacion = oTable_EvaHosp.fnGetNodes()[idEval - 1];
        evaluacion.click();
        $('.nav-tabs a[href="#diagnosticos-tab"]').tab('show');
    },
    /// <summary>
    /// CARGA DATOS DESDE LA BD
    /// </summary>
    /// Lista de metodos que carga los datos de la evaluacion desde la BD
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async SeleccionarEvaluacionNeonatal(idAtencion) {
        let datos;
        var resp = null;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        try {
            Cargando(1);
            datos = await
            $.ajax({
                method: "POST",
                url: "/EvaluacionNeonatalHosp/SeleccionarEvaluacionNeonatal?area=Hospitalizacion",
                data: midata,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }            
        } catch (error) {
            alerta2("danger", "", stringify(error));
        }

        return resp;
        
    },

    async SeleccionarEvaluacionDetalleNeonatal(idAtencion, idServicio) {
        Cargando(1);
        oTable_EvaHosp.fnClearTable();
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        var dataEvaluacionDetalle = [];

        await $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatalHosp/SeleccionarEvaluacionDetalleNeonatal?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    $("#btnNuevoRegistro").text("");
                    if (datos.respuesta.table.length > 0) {
                        $("#PanelEvaluaciones").show();
                        $("#btnNuevoRegistro").append('<i style="width: 20px; text-align: center;" class="fa-solid fa-file-plus"></i> REEVALUAR');
                        dataEvaluacionDetalle = datos.respuesta.table;
                        oTable_EvaHosp.fnAddData(dataEvaluacionDetalle);
                        EvaluacionNeonatalHosp.idMedicoPrimeraEvaluacion = datos.respuesta.table[0].idMedico;

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

    async SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(idAtencion, idServicio, nroEvaluacion) {
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
                    url: "/EvaluacionNeonatalHosp/SeleccionarEvaluacionDetalleNeonatalPorEvaluacion?area=Hospitalizacion",
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
            alerta2('danger', '', error);
        }

        return resp;
    },
        
    async SeleccionarExamenFisicoNeonatal(idAtencion) {
        let datos;
        var resp = null;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarExamenFisicoNeonatal?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
        } catch (error) {
            alerta2("danger", "", stringify(error));
        }

        return resp;

    },

    SeleccionarAntecedentes(idPaciente) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);
        var dataAntecedentes = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatalHosp/SeleccionarRnAntecedentes?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    /*if (datos.respuesta.lsAntecedentesPerinatales.length > 0 || datos.respuesta.lsAntecedentesNacimiento.length > 0) {
                        dataAntecedentes = datos.respuesta;
                    }
                    else {
                        dataAntecedentes = [];
                    }*/
                    dataAntecedentes = datos;
                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataAntecedentes);

        return dataAntecedentes;
    },

    async SeleccionarSintomasNeonatal(idAtencion) {
        let datos;
        var resp = null;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/SeleccionarSintomasNeonatal?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
        } catch (error) {
            alerta2("danger", "", stringify(error));
        }

        return resp;
    },

    async SeleccionarInfeccionesMaternas(idAtencion) {
        let datos;
        var resp = null;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/InfeccionesMaternasSeleccionar?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
        } catch (error) {
            alerta2("danger", "", stringify(error));
        }

        return resp;
    },

    async SeleccionarEnfermedadesMaternas(idAtencion) {
        let datos;
        var resp = null;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/EnfermedadesMaternasSeleccionar?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
        } catch (error) {
            alerta2("danger", "", stringify(error));
        }

        return resp;
    },

    async SeleccionarRiesgosPerintales(idAtencion) {
        let datos;
        var resp = null;
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/RiesgosPerinatalesSeleccionar?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
        } catch (error) {
            alerta2("danger", "", stringify(error));
        }

        return resp;
    },

    async SeleccionarAntecedentesFamiliares(idPaciente) {
        let datos;
        var resp = null;
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Paciente/SeleccionarAntecedentesFamiliares?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
        } catch (error) {
            alerta2("danger", "", stringify(error));
        }

        return resp;
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

    async SeleccionarRegistroNeonatal(idPaciente) {
        let datos;
        var resp = null;
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/RegistroNacimientoEnHospitalEnExternoSeleccionar?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
            }
        } catch (error) {
            alerta2("danger", "", JSON.stringify(error));
        }

        return resp;

    },
    
    //SeleccionarDiagnosticosEvaluacion(idAtencion, idServicio, nroEvaluacion) {

    //    Diagnosticos.LimpiarDiagnosticosAtencion();

    //    var midata = new FormData();
    //    midata.append('idAtencion', idAtencion);
    //    midata.append('idServicio', idServicio);
    //    midata.append('nroEvaluacion', nroEvaluacion);

    //    $.ajax({

    //        method: "POST",
    //        url: "/AdmisionEmergencia/AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion?area=Emergencia",
    //        //contentType: "application/json; charset=utf-8",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        success: function (datos) {

    //            Cargando(0)
    //            if (datos.table.length !== 0) {
    //                if (!isEmpty(datos.table)) {
    //                    Diagnosticos.ListaDiagnosticosAtencion(datos.table);
    //                }
    //            }
    //            else {
    //                Cargando(0)
    //            }

    //        },
    //        error: function (msg) {
    //            Cargando(0)
    //        }
    //    })
    //},
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    /// <summary>
    /// CARGA DATOS A LA VISTA
    /// </summary>
    /// Carga los datos de la evaluacion a la vista
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async CargarDatosEvaluacion() {
        var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();
        
        ////////////////DATOS PACIENTE//////////////////////////////////////////
        $("#txtNroCuenta").val(objrowTb.idCuentaAtencion);
        $("#txtHistoria").val(objrowTb.nroHistoriaClinica);
        $("#txtPacienteNombre").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtTipoDocumento").val(objrowTb.tipoDocumento);
        $("#txtNroDocumento").val(objrowTb.nroDocumento);        
        $('#txtFechaNacimiento').datepicker("setDate", objrowTb.fechaNacimiento);
        $("#txtHoraNacimiento").val(objrowTb.horaNacimiento); 
        let edad = CalcularEdadAnioMesDia(objrowTb.fechaNacimiento);
        $("#txtEdadAnio").val(edad.años);
        $("#txtEdadMes").val(edad.meses);
        $("#txtEdadDia").val(edad.dias)
        $("#cboSexo").val(objrowTb.idTipoSexo)
        $("#txtServicioNacimiento").val(objrowTb.servicioIngreso)
        $("#txtServicioActual").val(objrowTb.servicioActual)
        $("#txtNroCama").val(objrowTb.camaActual)

        /////////////////DATOS MADRE///////////////////////////////////////////////        
        $("#txtNroHistoriaMadre").val(objrowTb.nroHistoriaClinicaMadre);
        $("#txtNombreMadre").val(objrowTb.madre);
        $("#txtTipoDocMadre").val(objrowTb.dTipoDocIdentidadMadre);
        $("#txtNroDocMadre").val(objrowTb.dNroDocumentoMadre);
        $("#txtEdadMadre").val(CalcularEdad(objrowTb.fechaNacMadre));
        $("#txtEstadoCivilMadre").val(objrowTb.dTipoEstadoCivilMadre);


        /////////////////ANTECEDENTES - DATOS MADRE///////////////////////////////////////////////        
        $("#txtAnteNroHistoriaMadre").val(objrowTb.nroHistoriaClinicaMadre);
        $("#txtAnteDatosPersonalesMadre").val(objrowTb.madre);
        $("#txtAnteTipoDocumentoMadre").val(objrowTb.dTipoDocIdentidadMadre);
        $("#txtAnteNroDocumentoMadre").val(objrowTb.dNroDocumentoMadre);
        $("#txtAnteEstadoCivilMadre").val(objrowTb.dTipoEstadoCivilMadre);
        $("#txtAnteGradoInstruccionMadre").val(objrowTb.dTipoGradoInstruccionMadre);        
        $("#txtAnteEdadMadre").val(CalcularEdad(objrowTb.fechaNacMadre));
        $("#txtAnteDomicilioMadre").val(objrowTb.dDomicilioMadre);
        $("#txtAnteDistritoDomicilioMadre").val(objrowTb.dDistritoDomicilioMadre);
        $("#txtAnteNroTelefonoMadre").val(objrowTb.dTelefonoMadre);

        EvaluacionNeonatalHosp.IdPacienteMadre = objrowTb.idPacienteMadre;
                
        IdCuentaAtencionTemp = objrowTb.idCuentaAtencion;       //variable para conservar el IdCuentaAtencion despues de abrir el modulo de SEGUIMIENTO

        Triaje.listaTriajeEmgHosp(Variables.IdAtencion, Variables.IdServicioEgreso, 0);

        
        await EvaluacionNeonatalHosp.CargarVistaSintomasNeonatal();        
        await EvaluacionNeonatalHosp.CargarVistaAntecedentesFamiliar();        
        await EvaluacionNeonatalHosp.CargarVistaRiesgosPerinatales();        
        await EvaluacionNeonatalHosp.CargarVistaInfeccionesMaternas();        
        await EvaluacionNeonatalHosp.CargarVistaEnfermedadesMaternas();        
        await EvaluacionNeonatalHosp.CargarVistaRegistroNeonatal();        
        await EvaluacionNeonatalHosp.CargarVistaExamenFisico();        
        await EvaluacionNeonatalHosp.CargarVistaEvaluacionNeonatal();

        //var EvaDetneo = EvaluacionNeonatalHosp.SeleccionarEvaluacionDetalleNeonatal(Variables.IdAtencion, Variables.IdServicioEgreso);

        $("#hdIdTipoFuenteFian").val(objrowTb.idTipoFinanciamiento);
        $('#hdIdCuentaAtencion').val(objrowTb.idCuentaAtencion);
        $('#hdIdServicioPaciente').val(Variables.IdServicioEgreso);

        let EvaDetneo = await EvaluacionNeonatalHosp.SeleccionarEvaluacionDetalleNeonatal(Variables.IdAtencion, 0);
                
        //var EvaAnte = EvaluacionNeonatalHosp.SeleccionarAntecedentes(Variables.IdPaciente);

        //----------------------EVALUACION NEONATAL-----------------------//       

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

        
    async CargarDatosEvaluacionDetalle(idAtencion, idServicio, nroEvaluacion) {
        $("#BadgeEvaluacion .msc-hotline").addClass("bg-blue");
        $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-info");

        $("#lblNumeroEvaluacion").html("Evaluación N° " + nroEvaluacion);
        $("#lblTipoEvaluacion").html("Evaluación Registrada");

        var evaluacion = await EvaluacionNeonatalHosp.SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(idAtencion, idServicio, nroEvaluacion);
        //var evaluacion = EvaDetneo.find(evaluacion => evaluacion.idNumero === nroEvaluacion);

        //$('#FechaInicioAtencion').datepicker('setStartDate', moment(evaluacion.fecha).add(-1, 'days').toDate().format('dd/mm/yyyy'));
        //$('#FechaInicioAtencion').datepicker('setEndDate', moment(evaluacion.fecha).toDate().format('dd/mm/yyyy'));
        $('#FechaInicioAtencion').datepicker('setStartDate', moment(moment(ConvertirFormatoFecha(Variables.FechaIngreso)).toDate()).toDate().format('dd/mm/yyyy'));
        $('#FechaInicioAtencion').datepicker('setEndDate', moment().toDate());
        $('#FechaInicioAtencion').datepicker("setDate", FormatearFecha(evaluacion.fecha));

        $('#HoraInicioAtencion').val(evaluacion.horaInicioAtencion);

        //$('#txtImpresionDiagnosticaNeo').val(evaluacion.indicaciones);
        $('#txtImpresionDiagnosticaNeo').val(evaluacion.seguimiento);
        //$('#txtTratamientoNeo').val(evaluacion.tratamiento);
        $('#txtTratamientoNeo').val(evaluacion.tratamiento);
        $('#txtPlanTrabajoNeo').val(evaluacion.plandeTrabajo);

        if (evaluacion.idUsuario == AdmisionHospitalizacion.ObtenerIdUsuarioSesion() && AdmisionHospitalizacion.accion == 'M') {
            $(".OpcionesCPT").show();
            $(".OpcionesRecetas").show();
            $(".OpcionesOrdenes").show();
            $(".OpcionesDiagnosticos").show();
            $("#FirmarEvalEmer").show();
            $("#evaluaciones .entrada").removeAttr("disabled");
            $("#btnGuardarEvaNeo").show();

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

            EvaluacionNeonatalHosp.nuevaEvaluacion = false;
            EvaluacionNeonatalHosp.modificaEvaluacion = true;

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

        //EvaluacionEmergencia.idMedico = evaluacion.idMedico;
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

    //------------------------SINTOMAS NEONATAL---------------------------------------------//
    async CargarVistaSintomasNeonatal() {
        let datos = await EvaluacionNeonatalHosp.SeleccionarSintomasNeonatal(Variables.IdAtencion);
        EvaluacionNeonatalHosp.IdAtencionSintoma = 0;
        if (datos != null) {
            EvaluacionNeonatalHosp.IdAtencionSintoma = datos.idAtencionSintoma;
            $('#chkNinoSano').prop('checked', datos.ninoSano == 1 ? true : false);
            $('#chkPrematuridad').prop('checked', datos.prematuridad == 1 ? true : false);
            $('#chkSDR').prop('checked', datos.sdr == 1 ? true : false);
            $('#chkApnea').prop('checked', datos.apnea == 1 ? true : false);
            $('#chkBPN').prop('checked', datos.bpn == 1 ? true : false);
            $('#chkAsfixiaSevera').prop('checked', datos.asfixiaSevera == 1 ? true : false);
            $('#chkShock').prop('checked', datos.shock == 1 ? true : false);
            $('#chkMBPN').prop('checked', datos.mbpn == 1 ? true : false);
            $('#chkEMBPN').prop('checked', datos.embpn == 1 ? true : false);
            $('#chkSepsis').prop('checked', datos.sepsis == 1 ? true : false);
            $('#chkRCIU').prop('checked', datos.rciu == 1 ? true : false);
            $('#chkConvulsion').prop('checked', datos.convulsion == 1 ? true : false);
            $('#chkTraumaObstetrico').prop('checked', datos.traumaObstetrico == 1 ? true : false);
            $('#chkMalformacionCongenita').prop('checked', datos.malfomacionCongenita == 1 ? true : false);
            $('#chkOtros').prop('checked', datos.otros == 1 ? true : false);
            if (datos.otros == 1) {
                $('#txtOtroSintomas').val(datos.dOtros);
                $("#txtOtroSintomas").show();
            } else {
                $("#txtOtroSintomas").val("");
                $("#txtOtroSintomas").hide();
            }
        }
    },

    //------------------------ANTECEDENTE FAMILIAR---------------------------------------------//
    async CargarVistaAntecedentesFamiliar() {
        let datos = await EvaluacionNeonatalHosp.SeleccionarAntecedentesFamiliares(Variables.IdPaciente);
        if (datos != null) {
            $(".rdbDiabetes").eq(datos.diabetes - 1).prop('checked', true);
            $('#txtDiabetes').val(datos.diabetesDescripcion);
            $(".rdbTbc").eq(datos.tbc - 1).prop('checked', true);
            $('#txtTbc').val(datos.tbcDescripcion);
            $(".rdbHta").eq(datos.hta - 1).prop('checked', true);
            $('#txtHta').val(datos.htaDescripcion);
            $(".rdbGemelares").eq(datos.gemelares - 1).prop('checked', true);
            $('#txtGemelares').val(datos.gemelaresDescripcion)
            $(".rdbMalformaciones").eq(datos.malformaciones - 1).prop('checked', true);
            $('#txtMalformaciones').val(datos.malformacionesDescripcion);
            $(".rdbOtros").eq(datos.otros - 1).prop('checked', true);
            $('#txtOtros').val(datos.otrosDescripcion);
            
            $('#txtComentariosAntecFamiliares').val(datos.comentarios);            
        }
    },

    //------------------------RESULTADO EXAMENES AUXILIARES---------------------------------------------//
    //async CargarVistaResultadosExamenesAuxiliares() {
    //    let grupoSang = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '86900', 33, 84);
    //    let factorRh = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '86901', 18, 426);
    //    let hematocrito = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '85027', 1, 2);
    //    let hemoglobina = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '85027', 1, 1);

    //    if (grupoSang != null) {
    //        $('#txtAnteGrupoSan').val(grupoSang.valor);
    //        $("#FechaGrupoSan").datepicker("setDate", grupoSang.fechaResultado);
    //    }

    //    if (factorRh != null) {
    //        $('#txtAntefactorRH').val(factorRh.valor);
    //        $("#FechaFactorRH").datepicker("setDate", factorRh.fechaResultado);
    //    }

    //    if (hematocrito != null) {
    //        $('#txtAnteHematocrito').val(hematocrito.valor);
    //        $("#FechaHematocrito").datepicker("setDate", hematocrito.fechaResultado);
    //    }

    //    if (hemoglobina != null) {
    //        $('#txtAnteHemoglobina').val(hemoglobina.valor);
    //        $("#FechaHemoglobina").datepicker("setDate", hemoglobina.fechaResultado);
    //    }

    //},
    
    //------------------------RIESGOS PERINATALES---------------------------------------------//
    async CargarVistaRiesgosPerinatales() {
        let datos = await EvaluacionNeonatalHosp.SeleccionarRiesgosPerintales(Variables.IdAtencion);
        if (datos != null) {
            $('#chkPeso4000gr').prop('checked', datos.peso4000Gramos == 1 ? true : false);
            $('#chkPeso2500gr').prop('checked', datos.peso2500Gramos == 1 ? true : false);
            $('#chkPreTerminos').prop('checked', datos.preTermino == 1 ? true : false);
            $('#chkPostTerminos').prop('checked', datos.postTermino == 1 ? true : false);
            $('#chkNatimuerto').prop('checked', datos.natimuerto == 1 ? true : false);
            $('#chkMuerteNeonatal').prop('checked', datos.muerteNeonatal == 1 ? true : false);
            $('#chkDistocidos').prop('checked', datos.distocidos == 1 ? true : false);
            $('#chkOtrosRiesgoPerinatal').prop('checked', datos.otros == 1 ? true : false);

            EvaluacionNeonatalHosp.OtroRiesgoPerinatal_Change();

            $('#txtPeso4000gr').val(datos.peso4000GramosDescripcion);
            $('#txtPeso2500gr').val(datos.peso2500GramosDescripcion);
            $('#txtPreTerminos').val(datos.preTerminosDescripcion);
            $('#txtPostTerminos').val(datos.postTerminosDescripcion);
            $('#txtNatimuerto').val(datos.natimuertoDescripcion);
            $('#txtMuerteNeonatal').val(datos.muerteNeonatalDescripcion);
            $('#txtDistocidos').val(datos.distocidosDescripcion);
            $('#txtOtrosRiesgoPerinatal').val(datos.otrosDescripcion);
        }
    },

    //------------------------INFECCIONES MATERNAS---------------------------------------------//
    async CargarVistaInfeccionesMaternas() {
        let datos = await EvaluacionNeonatalHosp.SeleccionarInfeccionesMaternas(Variables.IdAtencion);
        if (datos != null) {
            $('#chkTBCactiva').prop('checked', datos.tbcActiva == 1 ? true : false);
            $('#chkLues').prop('checked', datos.lues == 1 ? true : false);
            $('#chkTorch').prop('checked', datos.torch == 1 ? true : false);
            $('#chkITUtrim').prop('checked', datos.ituIIITrim == 1 ? true : false);
            $('#chkUrocultivo').prop('checked', datos.urocultivo == 1 ? true : false);
            $('#chkGermen').prop('checked', datos.germen == 1 ? true : false);
            $('#chkCovid').prop('checked', datos.covid == 1 ? true : false);
            $('#chkDengue').prop('checked', datos.dengue == 1 ? true : false);
            $('#chkOtrasInfeccionesMaternas').prop('checked', datos.otros == 1 ? true : false);    
            
            EvaluacionNeonatalHosp.OtraInfeccionMaterna_Change();

            $('#txtTBCactiva').val(datos.tbcActivaDescripcion);
            $('#txtLues').val(datos.luesDescripcion);
            $('#txtTorch').val(datos.torchDescripcion);
            $('#txtITUtrim').val(datos.ituIIITrimDescripcion);
            $('#txtUrocultivo').val(datos.urocultivoDescripcion);
            $('#txtGermen').val(datos.germenDescripcion);
            $('#txtCovid').val(datos.covidDescripcion);
            $('#txtDengue').val(datos.dengueDescripcion);
            $('#txtOtrasInfeccionesMaternas').val(datos.otrosDescripcion);
        }
    },

    //------------------------ENFERMEDADES MATERNAS---------------------------------------------//
    async CargarVistaEnfermedadesMaternas() {
        let datos = await EvaluacionNeonatalHosp.SeleccionarEnfermedadesMaternas(Variables.IdAtencion);
        if (datos != null) {
            $('#chkPreClampsia').prop('checked', datos.preEclampsia == 1 ? true : false);
            $('#chkEclampsia').prop('checked', datos.eclampsia == 1 ? true : false);
            $('#chkHTT').prop('checked', datos.htt == 1 ? true : false);
            $('#chkDesnutricion').prop('checked', datos.desnutricion == 1 ? true : false);
            $('#chkDiabetesMellitus').prop('checked', datos.diabetesMellitus == 1 ? true : false);
            $('#chkHepatitisB').prop('checked', datos.hepatitisB == 1 ? true : false);
            $('#chkAnemia').prop('checked', datos.anemia == 1 ? true : false);
            $('#chkHipoHipertiroides').prop('checked', datos.hipoHipertiroides == 1 ? true : false);
            $('#chkOtrasEnfermedadesMaternas').prop('checked', datos.otros == 1 ? true : false);

            EvaluacionNeonatalHosp.OtraEnfermedadMaterna_Change();

            $('#txtPreClampsia').val(datos.preEclampsiaDescripcion);
            $('#txtEclampsia').val(datos.eclampsiaDescripcion);
            $('#txtHTT').val(datos.httDescripcion);
            $('#txtDesnutricion').val(datos.desnutricionDescripcion);
            $('#txtDiabetesMellitus').val(datos.diabetesMellitusDescripcion);
            $('#txtHepatitisB').val(datos.hepatitisBDescripcion);
            $('#txtAnemia').val(datos.anemiaDescripcion);
            $('#txtHipoHipertiroides').val(datos.hipoHipertiroidesDescripcion);
            $('#txtOtrasEnfermedadesMaternas').val(datos.otrosDescripcion);
        }
    },

    
    //-------------------------REGISTRO NEONATAL----------------------------------------------//
    async CargarVistaRegistroNeonatal() {
        let datos = await EvaluacionNeonatalHosp.SeleccionarRegistroNeonatal(Variables.IdPaciente);
        //console.log(datos)
        if (datos != null) {
            //////////////////DATOS DEL PARTO/////////////////////////////////////////
            if (datos.embarazo == "N") {
                $('#rdbEmbarazoN').prop('checked', true);
            } else if (datos.embarazo == "C") {
                $('#rdbEmbarazoC').prop('checked', true);
            }
            $("#txtNroEmbarazo").val(datos.nroEmbarazo);
            if (datos.attPrenatal == true) {
                $('#rdbAtPreNatalSi').prop('checked', true);
            } else if (datos.attPrenatal == false) {
                $('#rdbAtPreNatalNo').prop('checked', true);
            }
            $("#txtNroAPN").val(datos.nroApn);
            $("#txtLugarAPN").val(datos.lugarApn);
            $("#txtGestas").val(datos.gesta);
            $("#txtParidad1").val(datos.paridad1);
            $("#txtParidad2").val(datos.paridad2);
            $("#txtParidad3").val(datos.paridad3);
            $("#txtParidad4").val(datos.paridad4);

            if (datos.atendidoPor == "M") {
                $('#rdbAtendidoPorMed').prop('checked', true);
            } else if (datos.atendidoPor == "O") {
                $('#rdbAtendidoPorObs').prop('checked', true);
            } else if (datos.atendidoPor == "X") {
                $('#rdbAtendidoPorOtro').prop('checked', true);
            }
            proferesp = datos.idMedico;
            EvaluacionNeonatalHosp.FiltrarProfesionalAtendio();
            $("#cboProfResponsable").val(datos.idMedico);
            $("#cboProfResponsable").trigger("chosen:updated");
            $("#txtProfResponsable").val(datos.responsableAtencion);

            if (datos.parto == true) {
                $('#rdbEutocito').prop('checked', true);
            } else if (datos.parto == false) {
                $('#rdbComplicado').prop('checked', true);
            }

            $("#txtComplicaciones").val(datos.complicacionParto);
            if (datos.posicionParto == "H") {
                $('#rdbTipoPartoH').prop('checked', true);
            } else if (datos.posicionParto == "V") {
                $('#rdbTipoPartoV').prop('checked', true);
            }

            $("#chkConAcompaniante").prop('checked', datos.conAcompaniante);
            $("#chkConAnalgesia").prop('checked', datos.conAnaglgesia);
            $("#chkTrasladoConjunto").prop('checked', datos.trasladoConjunto);

            //////////////////DATOS DE NACIMIENTO/////////////////////////////////////
            $("#txtFechaNacimientoRn").datepicker("setDate", datos.fechaNacimiento);
            $("#txtHoraNacimientoRn").val(datos.horaNacimiento);
            $("#txtHoraNacimiento").val(datos.horaNacimiento);
            $("#cboTipoSexoRn").val(datos.idTipoSexo);
            $("#cboTipoSexoRn").trigger("chosen:updated");
            $("#cboTipoGestacionRn").val(datos.idTipoGestacion);
            $("#cboTipoGestacionRn").trigger("chosen:updated");
            EvaluacionNeonatalHosp.TipoGestacion_Change();
            $("#txtNroFetosRn").val(datos.fetos);
            EvaluacionNeonatalHosp.Fetos_Change();
            $("#cboNumeroGemelarRn").val(datos.nroGemelar);
            $("#cboNumeroGemelarRn").trigger("chosen:updated");
            $("#cboCondicionRn").val(datos.idCondicion);
            $("#cboCondicionRn").trigger("chosen:updated");
            EvaluacionNeonatalHosp.Condicion_Change();
            if (datos.obito == "No") {
                $('#rdbObitoRnNo').prop('checked', true);
            } else if (datos.obito == "Menor") {
                $('#rdbObitoRnSiMenor').prop('checked', true);
            } else if (datos.obito == "Mayor") {
                $('#rdbObitoRnSiMayor').prop('checked', true);
            }

            $("#txtPesoRn").val(datos.peso);
            $("#txtTallaRn").val(datos.talla);
            $("#txtPerCefalicoRn").val(datos.perimetroCefalico);
            $("#txtPerToracicoRn").val(datos.perimetroToracico);
            $("#txtEdadGestacionalRn").val(datos.edadGes);

            if (datos.clampadoTardio == true) {
                $('#rdbTardioRnSi').prop('checked', true);
            } else if (datos.clampadoTardio == false) {
                $('#rdbTardioRnNO').prop('checked', true);
            }
            if (datos.lactancia1raHora == true) {
                $('#rdbLacthoraRnSi').prop('checked', true);
            } else if (datos.lactancia1raHora == false) {
                $('#rdbLacthoraRnNO').prop('checked', true);
            }
            $("#cboContactoPielRn").val(datos.pielaPiel);
            $("#cboContactoPielRn").trigger("chosen:updated");
            $("#cboServicioNacimientoRn").val(datos.idServicioNacimiento);
            $("#cboServicioNacimientoRn").trigger("chosen:updated");
            $("#cboProcedenciaRn").val(datos.idOtraProcedencia);
            $("#cboProcedenciaRn").trigger("chosen:updated");

            //$("#txtFechaClampaje").datepicker("setDate", datos.fechaClampajeRn);
            //$("#txtHoraClampaje").val(datos.horaClampaje);
            $("#cboTiempoClampajeRn").val(datos.idTiempoClampaje);
            $("#cboTiempoClampajeRn").trigger("chosen:updated");

            if (datos.inmediato == true) {
                $('#rdbInmediatoRnSi').prop('checked', true);
            } else if (datos.inmediato == false) {
                $('#rdbInmediatoRnNO').prop('checked', true);
            }
            if (datos.reanimacion == true) {
                $('#rdbReanimacionRnSi').prop('checked', true);
            } else if (datos.reanimacion == false) {
                $('#rdbReanimacionRnNO').prop('checked', true);
            }
            EvaluacionNeonatalHosp.Reanimacion_Change();
            $("#cboTipoReanimacionRn").val(datos.idTipoReanimacion);
            $("#cboTipoReanimacionRn").trigger("chosen:updated");

            $("#txtMinutoRn").val(datos.alMinuto);
            $("#txt5MinutoRn").val(datos.alos5Minutos);
            $("#txt10MinutoRn").val(datos.alos10Minutos);
            $("#txt15MinutoRn").val(datos.alos15Minutos);
            $("#txt20MinutoRn").val(datos.alos20Minutos);

            if (datos.patologiaNeonatal == true) {
                $('#rdbPatNeoRnSi').prop('checked', true);
            } else if (datos.patologiaNeonatal == false) {
                $('#rdbPatNeoRnNo').prop('checked', true);
            }
            EvaluacionNeonatalHosp.PatNeo_Change();
            $("#txtEspecificarRn").val(datos.especificar);

            if (datos.transporte == true) {
                $('#rdbTransporteSi').prop('checked', true);
            } else if (datos.transporte == false) {
                $('#rdbTransporteNO').prop('checked', true);
            }
            EvaluacionNeonatalHosp.Transporte_Change();
            $("#cboTipoTransporteRn").val(datos.idTipoTransporte);
            $("#cboTipoTransporteRn").trigger("chosen:updated");

            EvaluacionNeonatalHosp.TablaRegistroNacimiento = datos.tabla;
        }
        else {
            EvaluacionNeonatalHosp.TablaRegistroNacimiento = 'EXTERNO';
        }
    },

    //------------------------EXAMEN FISICO---------------------------------------------//
    async CargarVistaExamenFisico() {  
        let datos = await EvaluacionNeonatalHosp.SeleccionarExamenFisicoNeonatal(Variables.IdAtencion);

        $(".rdbReflejoRojo").removeAttr("checked");		
        if (datos != null) {
            $(".rdbGeneral").eq(datos.estadoGeneralSensorio - 1).prop('checked', true);
            $('#txtEstadoGeneralSensorio').val(datos.dEstadoGeneralSensorio);
            $('#txtEstadoGeneralSensorioEdemas').val(datos.eEstadoGeneralSensorio);
            $(".rdbPiel").eq(datos.piel - 1).prop('checked', true);
            $('#txtPiel').val(datos.dPiel);
            $(".rdbCraneo").eq(datos.craneo - 1).prop('checked', true);
            $('#txtCraneo').val(datos.dCraneo);
            $(".rdbPabAuri").eq(datos.pabellonAuricular - 1).prop('checked', true);
            $('#txtPabellonAuricular').val(datos.dPabellonAuricular)
            $(".rdbCara").eq(datos.cara - 1).prop('checked', true);
            $('#txtCara').val(datos.dCara);
            $(".rdbBocaRL").eq(datos.bocaORL - 1).prop('checked', true);
            $('#txtBocaORL').val(datos.dBocaORL);
            $(".rdbCuello").eq(datos.cuello - 1).prop('checked', true);
            $('#txtCuello').val(datos.dCuello);
            $(".rdbClavicula").eq(datos.clavicula - 1).prop('checked', true);
            $('#txtClavicula').val(datos.dClavicula);
            $(".rdbToraxSilv").eq(datos.toraxSilv - 1).prop('checked', true);
            $('#txtToraxSilv').val(datos.dToraxSilv);
            //$(".rdbOjos").eq(datos.ojos - 1).prop('checked', true);             //230605
            //$('#txtOjos').val(datos.dOjos);                          //230605
            $(".rdbReflejoRojo").eq(datos.reflejoRojo - 1).prop('checked', true);             //240605
            $('#txtReflejoRojo').val(datos.dReflejoRojo);                          //240605
            $(".rdbCardio").eq(datos.aparatoCardioVascular - 1).prop('checked', true);
            $('#txtAparatoCardioVascular').val(datos.dAparatoCardioVascular);
            $('#txtAparatoCardioVascularReflejos').val(datos.rAparatoCardioVascular);
            $(".rdbAbdomen").eq(datos.abdomen - 1).prop('checked', true);
            $('#txtAbdomen').val(datos.dAbdomen);
            $(".rdbOmbligo").eq(datos.ombligo - 1).prop('checked', true);
            $('#txtOmbligo').val(datos.dOmbligo);
            $(".rdbAno").eq(datos.ano - 1).prop('checked', true);
            $('#txtAno').val(datos.dAno);
            $(".rdbGenitales").eq(datos.genitales - 1).prop('checked', true);
            $('#txtGenitales').val(datos.dGenitales);
            $(".rdbExtSup").eq(datos.extSuperiores - 1).prop('checked', true);
            $('#txtExtSuperiores').val(datos.dExtSuperiores);
            $(".rdbExtInf").eq(datos.extInferiores - 1).prop('checked', true);
            $('#txtExtInferiores').val(datos.dExtInferiores);
            $(".rdbColumna").eq(datos.columna - 1).prop('checked', true);
            $('#txtColumna').val(datos.dColumna);
            $(".rdbSistemaNervioso").eq(datos.sistemaNervioso - 1).prop('checked', true);
            $('#txtSistemaNervioso').val(datos.dSistemaNervioso);

            $('#txtRelatoExamenFisico').val(datos.relato);
        }
    },

    //------------------------EXAMEN FISICO---------------------------------------------//
    async CargarVistaEvaluacionNeonatal() {
        let datos = await EvaluacionNeonatalHosp.SeleccionarEvaluacionNeonatal(Variables.IdAtencion);
        let grupoSang = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '86900', 33, 84);
        let factorRh = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '86901', 18, 426);
        let hematocrito = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '85027', 1, 2);
        let hemoglobina = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '85027', 1, 1);
        let vdrl = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '86593.02', 69, 424);
        let coombsDirecto = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '86880', 97, 84);
        let coombsIndirecto = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '86886', 115, 84);
        let hiv = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '86592.02', 69, 446);
        let hepatitisb = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '86706.01', 71, 425);
        let covid19 = await EvaluacionNeonatalHosp.SeleccionarItemResultadoExamen(EvaluacionNeonatalHosp.IdPacienteMadre, '87635.02', 163, 84);

        if (grupoSang != null) {
            $('#txtAnteGrupoSan').val(grupoSang.valor);
            $("#FechaGrupoSan").datepicker("setDate", grupoSang.fechaResultado);
        }

        if (hemoglobina != null) {
            $('#txtAnteHemoglobina').val(hemoglobina.valor);
            $("#FechaHemoglobina").datepicker("setDate", hemoglobina.fechaResultado);
        }
        
        if (factorRh != null) {
            $('#txtAntefactorRH').val(factorRh.valor);
            $("#FechaFactorRH").datepicker("setDate", factorRh.fechaResultado);
        }

        if (hematocrito != null) {
            $('#txtAnteHematocrito').val(hematocrito.valor);
            $("#FechaHematocrito").datepicker("setDate", hematocrito.fechaResultado);
        }

        if (vdrl != null) {
            $('#txtVDRL').val(vdrl.valor);
        }

        if (coombsDirecto != null) {
            $('#txtCommbs').val("Directo:" + coombsDirecto.valor + "|");
        }

        if (coombsIndirecto != null) {
            $('#txtCommbs').val($('#txtCommbs').val() + "Indirecto:" + coombsIndirecto.valor + "|");
        }

        if (hiv != null) {
            $('#txtHIV').val(hiv.valor);
        }

        if (hepatitisb != null) {
            $('#txtVHB').val(hepatitisb.valor);
        }

        if (covid19 != null) {
            $('#txtCovid19').val(covid19.valor);
        }


        if (datos != null) {            
            $('#txtRelatoCronologico').val(datos.relatoCronologico);
            $('#txtAnteFactorRiesgoMadre').val(datos.factorRiesgo);
            $('#txtAnteEdadPadre').val(datos.edadPadreRn);
            $('#txtPesoMadre').val(datos.pesoMadre);
            $('#txtTallaMadre').val(datos.tallaMadre);

            if (!isEmpty(datos.grupoSanguineo) || !isEmpty(datos.fechaResultadoGrupoSanguineo)) {
                $('#txtAnteGrupoSan').val(datos.grupoSanguineo);
                $("#FechaGrupoSan").datepicker("setDate", datos.fechaResultadoGrupoSanguineo);
            } 

            if (!isEmpty(datos.hemoglobina) || !isEmpty(datos.fechaResultadoHemoglobina)) {
                $('#txtAnteHemoglobina').val(datos.hemoglobina);
                $("#FechaHemoglobina").datepicker("setDate", datos.fechaResultadoHemoglobina);
            } 

            if (!isEmpty(datos.factoRH) || !isEmpty(datos.fechaResultadoFactorRH)) {
                $('#txtAntefactorRH').val(datos.factoRH);
                $("#FechaFactorRH").datepicker("setDate", datos.fechaResultadoFactorRH);
            } 

            if (!isEmpty(datos.hematocrito) || !isEmpty(datos.fechaResultadoHematocrito)) {
                $('#txtAnteHematocrito').val(datos.hematocrito);
                $("#FechaHematocrito").datepicker("setDate", datos.fechaResultadoHematocrito);
            }  
            
            if (!isEmpty(datos.vdrl)) {
                $('#txtVDRL').val(datos.vdrl);
            }  

            if (!isEmpty(datos.coombs)) {
                $('#txtCommbs').val(datos.coombs);
            } 

            if (!isEmpty(datos.hiv)) {
                $('#txtHIV').val(datos.hiv);
            } 

            if (!isEmpty(datos.hepatitisB)) {
                $('#txtVHB').val(datos.hepatitisB);
            } 

            if (!isEmpty(datos.covid19)) {
                $('#txtCovid19').val(datos.covid19);
            } 
            
            $('#txtComentariosExAuxMadre').val(datos.comentariosExamenesAuxiliares);
            $('#txtEcografiaExAuxMadre').val(datos.ecografiaExamenesAuxiliares);            //KHOYOSI 230625
            $("#FechaInicioLaborParto").datepicker("setDate", datos.fechaInicioLaborParto);
            //$('#FechaInicioLaborParto').val(datos.fechaInicioLaborParto);
            $('#txtHoraInicioLaborParto').val(datos.horaInicioLaborParto);
            $('#txtPrimerPeriodo').val(datos.primerPeriodo);
            $('#txtSegundoPeriodo').val(datos.segundoPeriodo);
            $('#cboDescripcionInicioLabor').val(datos.idTipoInicioLaborParto);
            $('#cboPresentacionFetal').val(datos.idTipoPresentacionFetal);
            $('#cboTrabajoParto').val(datos.idTipoDetalleParto);
            $('#cboDetalleCesarea').val(datos.idTipoDetalleCesarea);
            $('#cboSufrimientoFetal').val(datos.idTipoSufrimientoFetal);
            $('#cboTipoTrabajoParto').val(datos.idTipoTrabajoParto);
            $('#cboAnestesiaAplicada').val(datos.idTipoAnestesiaAplicada);
            $('#cboLiquidoAmniotico').val(datos.idTipoLiquidoAmniotico);
            $('#cboCordonUmbilical').val(datos.idTipoCordonUmbilical);
            $('#cboPlacenta').val(datos.idTipoPlacenta);
            $('#cboMedicamentos').val(datos.idTipoMedicamento);
            $('#txtOtrosMedicamentos').val(datos.otrosMedicamentos);
            $('#cboLugarParto').val(datos.idTipoLugarParto);
            $('#txtRupturaMembranaMinutos').val(datos.rupturaMembranaMinutos);
            $('#txtRupturaMembranaHoras').val(datos.rupturaMembranaHoras);
            $('#txtRupturaMembranaDias').val(datos.rupturaMembranaDias);
            $('#txtObservacionesLaborParto').val(datos.observacionesLaborParto);

            EvaluacionNeonatalHosp.tieneTamizajeOftalmologico = datos.tieneTamizajeOftalmologico;
        }
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// <summary>
    /// CARGA DATOS A LAS VARIABLES
    /// </summary>
    /// Lista de metodos que carga los datos de la evaluacion a la variables
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CargarVariablesEvaluacionNeonatal() {
        var formData = new FormData();
        
        formData.append('IdAtencion', Variables.IdAtencion);
        formData.append('RelatoCronologico', $('#txtRelatoCronologico').val());
        formData.append('FactorRiesgo', $('#txtAnteFactorRiesgoMadre').val());
        formData.append('EdadPadreRn', $('#txtAnteEdadPadre').val());
        formData.append('PesoMadre', $('#txtPesoMadre').val());
        formData.append('TallaMadre', $('#txtTallaMadre').val());
        formData.append('GrupoSanguineo', $('#txtAnteGrupoSan').val());
        formData.append('FechaResultadoGrupoSanguineo', $('#FechaGrupoSan').val());
        formData.append('Hemoglobina', $('#txtAnteHemoglobina').val());
        formData.append('FechaResultadoHemoglobina', $('#FechaHemoglobina').val());
        formData.append('FactoRH', $('#txtAntefactorRH').val());
        formData.append('FechaResultadoFactorRH', $('#FechaFactorRH').val());
        formData.append('Hematocrito', $('#txtAnteHematocrito').val());
        formData.append('FechaResultadoHematocrito', $('#FechaHematocrito').val());
        formData.append('Vdrl', $('#txtVDRL').val());
        formData.append('Coombs', $('#txtCommbs').val());
        formData.append('HIV', $('#txtHIV').val());
        formData.append('HepatitisB', $('#txtVHB').val());
        formData.append('Covid19', $('#txtCovid19').val());
        formData.append('ComentariosExamenesAuxiliares', $('#txtComentariosExAuxMadre').val());
        formData.append('EcografiaExamenesAuxiliares', $('#txtEcografiaExAuxMadre').val());         //KHOYOSI 230625
        formData.append('FechaInicioLaborParto', $('#FechaInicioLaborParto').val());
        formData.append('HoraInicioLaborParto', $('#txtHoraInicioLaborParto').val());
        formData.append('PrimerPeriodo', $('#txtPrimerPeriodo').val());
        formData.append('SegundoPeriodo', $('#txtSegundoPeriodo').val());
        formData.append('IdTipoInicioLaborParto', $('#cboDescripcionInicioLabor').val());
        formData.append('IdTipoPresentacionFetal', $('#cboPresentacionFetal').val());
        formData.append('IdTipoDetalleParto', $('#cboTrabajoParto').val());
        formData.append('IdTipoDetalleCesarea', $('#cboDetalleCesarea').val());
        formData.append('IdTipoSufrimientoFetal', $('#cboSufrimientoFetal').val());
        formData.append('IdTipoTrabajoParto', $('#cboTipoTrabajoParto').val());
        formData.append('IdTipoAnestesiaAplicada', $('#cboAnestesiaAplicada').val());
        formData.append('IdTipoLiquidoAmniotico', $('#cboLiquidoAmniotico').val());
        formData.append('IdTipoCordonUmbilical', $('#cboCordonUmbilical').val());
        formData.append('IdTipoPlacenta', $('#cboPlacenta').val());
        formData.append('IdTipoMedicamento', $('#cboMedicamentos').val());
        formData.append('OtrosMedicamentos', $('#txtOtrosMedicamentos').val());
        formData.append('IdTipoLugarParto', $('#cboLugarParto').val());
        formData.append('RupturaMembranaMinutos', $('#txtRupturaMembranaMinutos').val());
        formData.append('RupturaMembranaHoras', $('#txtRupturaMembranaHoras').val());
        formData.append('RupturaMembranaDias', $('#txtRupturaMembranaDias').val());
        formData.append('ObservacionesLaborParto', $('#txtObservacionesLaborParto').val());

        //formData.append('Prioridad', $('#cboPrioridad').val());
        //formData.append('Glasgow', $('#txtGlasgow').val());

        ///////////////////////ENFERMEDAD ACTUAL//////////////////////////
        //formData.append('TiempoEnfermedad', $('#txtTiempoEnfermedad').val());
        //formData.append('InicioEnfermedad', $('#txtInicioEnfermedad').val());
        //formData.append('CursoEnfermedad', $('#txtCursoEnfermedad').val());

        //////////////////////SIGNOS Y SINTOMAS////////////////////////////////
        //formData.append('DificultadRespiratoria', $('#chkDificultadRespiratoria').is(":checked"));
        //formData.append('Diarrea', $('#chkDiarrea').is(":checked"));
        //formData.append('DistensionAbdominal', $('#chkDistensionAbdominal').is(":checked"));
        //formData.append('Cianosis', $('#chkCianosis').is(":checked"));
        //formData.append('MalOlorOmbligo', $('#chkMalOlorOmbligo').is(":checked"));
        //formData.append('Ictericia', $('#chkIctericia').is(":checked"));
        //formData.append('Dolor', $('#chkDolor').is(":checked"));
        //formData.append('Convulsiones', $('#chkConvulsiones').is(":checked"));
        //formData.append('Fiebre', $('#chkFiebre').is(":checked"));
        //formData.append('Vomitos', $('#chkVomitos').is(":checked"));
        //formData.append('Hemorragia', $('#chkHemorragia').is(":checked"));
        //formData.append('Otros', $('#chkOtros').is(":checked"));
        //formData.append('OtrosSintomas', $('#txtOtroSintomas').val());

        //////////////////////////////RELATO/////////////////////////////////////////
        //formData.append('Relato', $('#txtRelatoCronologico').val());

        ////////////////////////////ANTECEDENTES GENERALES//////////////////////////
        //formData.append('AtecedentesGenerales', $('#txtAntecedentesGenerales').val());

        return formData;
    },

    CargarVariablesSintomasNeonatal() {
        var formData = new FormData();

        /////////////////////////SINTOMAS//////////////////////////////
        formData.append('IdAtencionSintoma', EvaluacionNeonatalHosp.IdAtencionSintoma);
        formData.append('IdAtencion', Variables.IdAtencion);

        formData.append('NinoSano', $('#chkNinoSano').is(":checked") == true ? 1 : 0);
        formData.append('Prematuridad', $('#chkPrematuridad').is(":checked") == true ? 1 : 0);
        formData.append('Sdr', $('#chkSDR').is(":checked") == true ? 1 : 0);
        formData.append('Apnea', $('#chkApnea').is(":checked") == true ? 1 : 0);
        formData.append('Bpn', $('#chkBPN').is(":checked") == true ? 1 : 0);
        formData.append('AsfixiaSevera', $('#chkAsfixiaSevera').is(":checked") == true ? 1 : 0);
        formData.append('Shock', $('#chkShock').is(":checked") == true ? 1 : 0);
        formData.append('Mbpn', $('#chkMBPN').is(":checked") == true ? 1 : 0);
        formData.append('Embpn', $('#chkEMBPN').is(":checked") == true ? 1 : 0);
        formData.append('Sepsis', $('#chkSepsis').is(":checked") == true ? 1 : 0);
        formData.append('Rciu', $('#chkRCIU').is(":checked") == true ? 1 : 0);
        formData.append('Convulsion', $('#chkConvulsion').is(":checked") == true ? 1 : 0);
        formData.append('TraumaObstetrico', $('#chkTraumaObstetrico').is(":checked") == true ? 1 : 0);
        formData.append('MalfomacionCongenita', $('#chkMalformacionCongenita').is(":checked") == true ? 1 : 0);
        formData.append('Otros', $('#chkOtros').is(":checked") == true ? 1 : 0);
        formData.append('DOtros', $('#txtOtroSintomas').val());

        return formData;
    },

    CargarVariablesAntecedentesFamiliares() {
        var formData = new FormData

        /////////////////////////ANTECEDENTES FAMILIARES//////////////////////////////
        formData.append("IdPaciente", Variables.IdPaciente);
        formData.append("Diabetes", $(".rdbDiabetes").index($(".rdbDiabetes:checked")) + 1);
        formData.append("DiabetesDescripcion", $("#txtDiabetes").val());
        formData.append("Tbc", $(".rdbTbc").index($(".rdbTbc:checked")) + 1);
        formData.append("TbcDescripcion", $("#txtTbc").val());
        formData.append("Hta", $(".rdbHta").index($(".rdbHta:checked")) + 1);
        formData.append("HtaDescripcion", $("#txtHta").val());
        formData.append("Gemelares", $(".rdbGemelares").index($(".rdbGemelares:checked")) + 1);
        formData.append("GemelaresDescripcion", $("#txtGemelares").val());
        formData.append("Malformaciones", $(".rdbMalformaciones").index($(".rdbMalformaciones:checked")) + 1);
        formData.append("MalformacionesDescripcion", $("#txtMalformaciones").val());
        formData.append("Otros", $(".rdbOtros").index($(".rdbOtros:checked")) + 1);
        formData.append("OtrosDescripcion", $("#txtOtros").val());

        formData.append("Comentarios", $("#txtComentariosAntecFamiliares").val());

        return formData;
    },

    CargarVariablesRiesgosPerinatales() {
        var formData = new FormData

        /////////////////////////INFECCIONES MATERNAS//////////////////////////////        
        formData.append("IdAtencion", Variables.IdAtencion);
        formData.append("Peso4000Gramos", $('#chkPeso4000gr').is(":checked") == true ? 1 : 0);
        formData.append("Peso2500Gramos", $('#chkPeso2500gr').is(":checked") == true ? 1 : 0);
        formData.append("PreTerminos", $('#chkPreTerminos').is(":checked") == true ? 1 : 0);
        formData.append("PostTerminos", $('#chkPostTerminos').is(":checked") == true ? 1 : 0);
        formData.append("Natimuerto", $('#chkNatimuerto').is(":checked") == true ? 1 : 0);
        formData.append("MuerteNeonatal", $('#chkMuerteNeonatal').is(":checked") == true ? 1 : 0);
        formData.append("Distocidos", $('#chkDistocidos').is(":checked") == true ? 1 : 0);
        formData.append("Otros", $('#chkOtrosRiesgoPerinatal').is(":checked") == true ? 1 : 0);

        formData.append("Peso4000GramosDescripcion", $('#chkPeso4000gr').is(":checked") == true ? $("#txtPeso4000gr").val() : "");                           //KHOYOSI 230625
        formData.append("Peso2500GramosDescripcion", $('#chkPeso2500gr').is(":checked") == true ? $("#txtPeso2500gr").val() : "");                           //KHOYOSI 230625
        formData.append("PreTerminosDescripcion", $('#chkPreTerminos').is(":checked") == true ? $("#txtPreTerminos").val() : "");                            //KHOYOSI 230625
        formData.append("PostTerminosDescripcion", $('#chkPostTerminos').is(":checked") == true ? $("#txtPostTerminos").val() : "");                             //KHOYOSI 230625
        formData.append("NatimuertoDescripcion", $('#chkNatimuerto').is(":checked") == true ? $("#txtNatimuerto").val() : "");                           //KHOYOSI 230625
        formData.append("MuerteNeonatalDescripcion", $('#chkMuerteNeonatal').is(":checked") == true ? $("#txtMuerteNeonatal").val() : "");                           //KHOYOSI 230625
        formData.append("DistocidosDescripcion", $('#chkDistocidos').is(":checked") == true ? $("#txtDistocidos").val() : "");                           //KHOYOSI 230625
        formData.append("OtrosDescripcion", $('#chkOtrosRiesgoPerinatal').is(":checked") == true ? $("#txtOtrosRiesgoPerinatal").val() : "");

        return formData;
    },

    CargarVariablesInfeccionesMaternas() {
        var formData = new FormData

        /////////////////////////INFECCIONES MATERNAS//////////////////////////////        
        formData.append("IdPaciente", Variables.IdPaciente);
        formData.append("IdAtencion", Variables.IdAtencion);
        formData.append("TbcActiva", $('#chkTBCactiva').is(":checked") == true ? 1 : 0);
        formData.append("Lues", $('#chkLues').is(":checked") == true ? 1 : 0);
        formData.append("Torch", $('#chkTorch').is(":checked") == true ? 1 : 0);
        formData.append("ItuIIITrim", $('#chkITUtrim').is(":checked") == true ? 1 : 0);
        formData.append("Urocultivo", $('#chkUrocultivo').is(":checked") == true ? 1 : 0);
        formData.append("Germen", $('#chkGermen').is(":checked") == true ? 1 : 0);
        formData.append("Covid", $('#chkCovid').is(":checked") == true ? 1 : 0);
        formData.append("Dengue", $('#chkDengue').is(":checked") == true ? 1 : 0);
        formData.append("OtrosInfecciones", $('#chkOtrasInfeccionesMaternas').is(":checked") == true ? 1 : 0);

        formData.append("TbcActivaDescripcion", $('#chkTBCactiva').is(":checked") == true ? $("#txtTBCactiva").val() : "");                          //KHOYOSI 230625
        formData.append("LuesDescripcion", $('#chkLues').is(":checked") == true ? $("#txtLues").val() : "");                             //KHOYOSI 230625
        formData.append("TorchDescripcion", $('#chkTorch').is(":checked") == true ? $("#txtTorch").val() : "");                          //KHOYOSI 230625
        formData.append("ItuIIITrimDescripcion", $('#chkITUtrim').is(":checked") == true ? $("#txtITUtrim").val() : "");                             //KHOYOSI 230625
        formData.append("UrocultivoDescripcion", $('#chkUrocultivo').is(":checked") == true ? $("#txtUrocultivo").val() : "");                           //KHOYOSI 230625
        formData.append("GermenDescripcion", $('#chkGermen').is(":checked") == true ? $("#txtGermen").val() : "");                           //KHOYOSI 230625
        formData.append("CovidDescripcion", $('#chkCovid').is(":checked") == true ? $("#txtCovid").val() : "");                          //KHOYOSI 230625
        formData.append("DengueDescripcion", $('#chkDengue').is(":checked") == true ? $("#txtDengue").val() : "");                           //KHOYOSI 230625
        formData.append("OtrosInfeccionesDescripcion", $('#chkOtrasInfeccionesMaternas').is(":checked") == true ? $("#txtOtrasInfeccionesMaternas").val() : "");
        
        return formData;
    },

    CargarVariablesEnfermedadesMaternas() {
        var formData = new FormData

        /////////////////////////ENFERMEDADES MATERNAS//////////////////////////////        
        formData.append("IdPaciente", Variables.IdPaciente);
        formData.append("IdAtencion", Variables.IdAtencion);
        formData.append("PreEclampsia", $('#chkPreClampsia').is(":checked") == true ? 1 : 0);
        formData.append("Eclampsia", $('#chkEclampsia').is(":checked") == true ? 1 : 0);
        formData.append("Htt", $('#chkHTT').is(":checked") == true ? 1 : 0);
        formData.append("Desnutricion", $('#chkDesnutricion').is(":checked") == true ? 1 : 0);
        formData.append("DiabetesMellitus", $('#chkDiabetesMellitus').is(":checked") == true ? 1 : 0);
        formData.append("HepatitisB", $('#chkHepatitisB').is(":checked") == true ? 1 : 0);
        formData.append("Anemia", $('#chkAnemia').is(":checked") == true ? 1 : 0);
        formData.append("HipoHipertiroides", $('#chkHipoHipertiroides').is(":checked") == true ? 1 : 0);
        formData.append("OtrosEnfermedades", $('#chkOtrasEnfermedadesMaternas').is(":checked") == true ? 1 : 0);

        formData.append("PreEclampsiaDescripcion", $('#chkPreClampsia').is(":checked") == true ? $("#txtPreClampsia").val() : "");                                           //KHOYOSI 230625
        formData.append("EclampsiaDescripcion", $('#chkEclampsia').is(":checked") == true ? $("#txtEclampsia").val() : "");                                          //KHOYOSI 230625
        formData.append("HttDescripcion", $('#chkHTT').is(":checked") == true ? $("#txtHTT").val() : "");                                            //KHOYOSI 230625
        formData.append("DesnutricionDescripcion", $('#chkDesnutricion').is(":checked") == true ? $("#txtDesnutricion").val() : "");                                             //KHOYOSI 230625
        formData.append("DiabetesMellitusDescripcion", $('#chkDiabetesMellitus').is(":checked") == true ? $("#txtDiabetesMellitus").val() : "");                                             //KHOYOSI 230625
        formData.append("HepatitisBDescripcion", $('#chkHepatitisB').is(":checked") == true ? $("#txtHepatitisB").val() : "");                                           //KHOYOSI 230625
        formData.append("AnemiaDescripcion", $('#chkAnemia').is(":checked") == true ? $("#txtAnemia").val() : "");                                           //KHOYOSI 230625
        formData.append("HipoHipertiroidesDescripcion", $('#chkHipoHipertiroides').is(":checked") == true ? $("#txtHipoHipertiroides").val() : "");                                          //KHOYOSI 230625
        formData.append("OtrosEnfermedadesDescripcion", $('#chkOtrasEnfermedadesMaternas').is(":checked") == true ? $("#txtOtrasEnfermedadesMaternas").val() : "");

        return formData;
    },

    CargarVariablesRegistroNacimientoExterno() {
        var formData = new FormData

        /////////////////////////REGISTRO NACIMIENTO EXTERNO//////////////////////////////        
        if ($("#rdbObitoRnNo").is(":checked") == false && $("#rdbObitoRnSiMenor").is(":checked") == false && $("#rdbObitoRnSiMayor").is(":checked") == false) {
            obito = null;
        } else {
            if ($("#rdbObitoRnNo").is(":checked")) { obito = 'No' } else if ($("#rdbObitoRnSiMenor").is(":checked")) { obito = 'Menor' } else { obito = 'Mayor' }
        }

        if ($("#rdbTipoPartoH").is(":checked") == false && $("#rdbTipoPartoV").is(":checked") == false) {
            posicion = null;
        } else {
            if ($("#rdbTipoPartoH").is(":checked")) { posicion = 'H' } else { posicion = 'V' }
        }

        if ($("#rdbEmbarazoN").is(":checked") == false && $("#rdbEmbarazoC").is(":checked") == false) {
            embarazo = null;
        } else {
            if ($("#rdbEmbarazoN").is(":checked")) { embarazo = 'N' } else { embarazo = 'C' }
        }

        if ($("#rdbAtendidoPorMed").is(":checked") == false && $("#rdbAtendidoPorObs").is(":checked") == false && $("#rdbAtendidoPorOtro").is(":checked") == false) {
            attpor = null;
        } else {
            if ($("#rdbAtendidoPorMed").is(":checked")) {
                if ($("#cboProfResponsable").val() == null) { alerta(2, "Debe seleccionar el Profesional."); $('#atencion-tab-link').trigger('click'); $("#cboProfResponsable").focus(); $("#cboProfResponsable_chosen").addClass("chosen-container-active"); return false; }
                $("#txtProfResponsable").val("");
                attpor = 'M';
            } else if ($("#rdbAtendidoPorObs").is(":checked")) {
                if ($("#cboProfResponsable").val() == null) { alerta(2, "Debe seleccionar el Profesional."); $('#atencion-tab-link').trigger('click'); $("#cboProfResponsable").focus(); $("#cboProfResponsable_chosen").addClass("chosen-container-active"); return false; }
                $("#txtProfResponsable").val("");
                attpor = 'O';
            } else {
                $("#cboProfResponsable").val("");
                attpor = 'X';

            }

        }

        if ($("#rdbEutocito").is(":checked") == false && $("#rdbComplicado").is(":checked") == false) {
            parto = '';
        } else {
            if ($("#rdbEutocito").is(":checked")) {
                parto = true;
            } else if ($("#rdbComplicado").is(":checked")) {                
                parto = false;
            } else {
                parto = '';
            }
        }

        if ($("#txtParidad1").val().length < 2) {
            $("#txtParidad1").val('0' + $("#txtParidad1").val());
        }

        if ($("#txtParidad2").val().length < 2) {
            $("#txtParidad2").val('0' + $("#txtParidad2").val());
        }

        if ($("#txtParidad3").val().length < 2) {
            $("#txtParidad3").val('0' + $("#txtParidad3").val());
        }

        if ($("#txtParidad4").val().length < 2) {
            $("#txtParidad4").val('0' + $("#txtParidad4").val());
        }

        //var embarazo = '';
        //var attpor = '';
        //var parto = '';
        //var posicion = '';
        ///////////////////////MADRE/////////////////////////////////////        
        formData.append("Embarazo", embarazo);
        formData.append("PatologiaGestacion", $('#txtPatGest').val());
        formData.append("NroEmbarazo", $('#txtNroEmbarazo').val());
        formData.append("AtencionPrenatal", $("#rdbAtPreNatalSi").is(":checked"));
        formData.append("NroApn", $('#txtNroAPN').val());
        formData.append("LugarApn", $('#txtLugarAPN').val());
        formData.append("Gesta", $("#txtGestas").val());
        formData.append("Paridad1", $("#txtParidad1").val());
        formData.append("Paridad2", $("#txtParidad2").val());
        formData.append("Paridad3", $("#txtParidad3").val());
        formData.append("Paridad4", $("#txtParidad4").val());

        formData.append("AtendidoPor", attpor);
        formData.append("idMedico", $("#cboProfResponsable").val());
        formData.append("medicoResponsable", $("#txtProfResponsable").val());
        formData.append("idTipoParto", $("#cboTipoParto").val());
        formData.append("Parto", parto);
        formData.append("ComplicacionParto", $("#txtComplicaciones").val());
        formData.append("PosicionParto", posicion);
        formData.append("ConAcompaniante", $("#chkConAcompaniante").is(":checked"));
        formData.append("ConAnaglgesia", $("#chkConAnalgesia").is(":checked"));
        formData.append("TrasladoConjunto", $("#chkTrasladoConjunto").is(":checked"));
        
        formData.append("EdadMadre", $('#txtEdadMadre').val());
                

        ////////////////////////NEONATAO/////////////////////////////////
        formData.append("FechaNacimiento", $("#txtFechaNacimientoRn").val());
        formData.append("HoraNacimiento", $("#txtHoraNacimientoRn").val());
        formData.append("IdTipoSexo", $("#cboTipoSexoRn").val());
        formData.append("IdTipoGestacion", $("#cboTipoGestacionRn").val());
        formData.append("Fetos", $("#txtNroFetosRn").val());
        formData.append("NroGemelar", $("#cboNumeroGemelarRn").val());
        formData.append("idCondicion", $("#cboCondicionRn").val());
        formData.append("Obito", obito);

        formData.append("Peso", $("#txtPesoRn").val());
        formData.append("Talla", $("#txtTallaRn").val());
        formData.append("PerimetroCefalico", $("#txtPerCefalicoRn").val());
        formData.append("PerimetroToracico", $("#txtPerToracicoRn").val());
        formData.append("EdadGes", $("#txtEdadGestacionalRn").val());
        formData.append("IdTiempoClampaje", $("#cboTiempoClampajeRn").val());

        formData.append("ClampadoTardio", $("#rdbTardioRnSi").is(":checked"));
        formData.append("PielaPiel", $("#cboContactoPielRn").val());
        formData.append("Lactancia1raHora", $("#rdbLacthoraRnSi").is(":checked"));
        formData.append("IdServicioNacimientoRn", $("#cboServicioNacimientoRn").val());
        formData.append("IdOtraProcedencia", $("#cboProcedenciaRn").val());
        formData.append("TiempoHospitalizacion", $('#txtTiempoHospRn').val());

        formData.append("Inmediato", $("#rdbInmediatoRnSi").is(":checked"));
        formData.append("Reanimacion", $("#rdbReanimacionRnSi").is(":checked"));
        formData.append("IdTipoReanimacion", $("#cboTipoReanimacionRn").val());
        formData.append("AlMinuto", $("#txtMinutoRn").val());
        formData.append("Alos5Minutos", $("#txt5MinutoRn").val());
        formData.append("Alos10Minutos", $("#txt10MinutoRn").val());
        formData.append("Alos15Minutos", $("#txt15MinutoRn").val());
        formData.append("Alos20Minutos", $("#txt20MinutoRn").val());
        formData.append("PatologiaNeonatal", $("#rdbPatNeoRnSi").is(":checked"));
        formData.append("Especificar", $('#txtEspecificarRn').val());
        formData.append("Transporte", $("#rdbTransporteSi").is(":checked"));
        formData.append("IdTipoTransporte", $("#cboTipoTransporteRn").val());

        formData.append("idRiesgo", $("#cboRiesgo").val());
        
        formData.append("idCuentaAtencion", Variables.IdCuentaAtencion);
        formData.append("idPaciente", Variables.IdPaciente);

        return formData;
    },

    CargarVariablesExamenFisicoNeonatal() {
        var formData = new FormData();

        /////////////////////////EXAMEN FISICO//////////////////////////////
        formData.append('IdAtencion', Variables.IdAtencion);
        formData.append('NroEvaluacion', 1);

        formData.append('EstadoGeneralSensorio', $(".rdbGeneral").index($(".rdbGeneral:checked")) + 1);
        formData.append('DEstadoGeneralSensorio', $('#txtEstadoGeneralSensorio').val());
        formData.append('EEstadoGeneralSensorio', $('#txtEstadoGeneralSensorioEdemas').val());

        formData.append('Piel', $(".rdbPiel").index($(".rdbPiel:checked")) + 1);
        formData.append('DPiel', $('#txtPiel').val());

        formData.append('Craneo', $(".rdbCraneo").index($(".rdbCraneo:checked")) + 1);
        formData.append('DCraneo', $('#txtCraneo').val());

        formData.append('PabellonAuricular', $(".rdbPabAuri").index($(".rdbPabAuri:checked")) + 1);
        formData.append('DPabellonAuricular', $('#txtPabellonAuricular').val());

        formData.append('Cara', $(".rdbCara").index($(".rdbCara:checked")) + 1);
        formData.append('DCara', $('#txtCara').val());

        formData.append('BocaORL', $(".rdbBocaRL").index($(".rdbBocaRL:checked")) + 1);
        formData.append('DBocaORL', $('#txtBocaORL').val());

        formData.append('Cuello', $(".rdbCuello").index($(".rdbCuello:checked")) + 1);
        formData.append('DCuello', $('#txtCuello').val());

        formData.append('Clavicula', $(".rdbClavicula").index($(".rdbClavicula:checked")) + 1);
        formData.append('DClavicula', $('#txtClavicula').val());

        formData.append('ToraxSilv', $(".rdbToraxSilv").index($(".rdbToraxSilv:checked")) + 1);
        formData.append('DToraxSilv', $('#txtToraxSilv').val());

        //formData.append('Ojos', $(".rdbOjos").index($(".rdbOjos:checked")) + 1);                //230625
        //formData.append('DOjos', $('#txtOjos').val());                           //230625

        formData.append('ReflejoRojo', $(".rdbReflejoRojo").index($(".rdbReflejoRojo:checked")) + 1);                //240625
        formData.append('DReflejoRojo', $('#txtReflejoRojo').val());                           //240625

        formData.append('AparatoCardioVascular', $(".rdbCardio").index($(".rdbCardio:checked")) + 1);
        formData.append('DAparatoCardioVascular', $('#txtAparatoCardioVascular').val());
        formData.append('RAparatoCardioVascular', $('#txtAparatoCardioVascularReflejos').val());

        formData.append('Abdomen', $(".rdbAbdomen").index($(".rdbAbdomen:checked")) + 1);
        formData.append('DAbdomen', $('#txtAbdomen').val());

        formData.append('Ombligo', $(".rdbOmbligo").index($(".rdbOmbligo:checked")) + 1);
        formData.append('DOmbligo', $('#txtOmbligo').val());

        formData.append('Ano', $(".rdbAno").index($(".rdbAno:checked")) + 1);
        formData.append('DAno', $('#txtAno').val());

        formData.append('Genitales', $(".rdbGenitales").index($(".rdbGenitales:checked")) + 1);
        formData.append('DGenitales', $('#txtGenitales').val());

        formData.append('ExtSuperiores', $(".rdbExtSup").index($(".rdbExtSup:checked")) + 1);
        formData.append('DExtSuperiores', $('#txtExtSuperiores').val());

        formData.append('ExtInferiores', $(".rdbExtInf").index($(".rdbExtInf:checked")) + 1);
        formData.append('DExtInferiores', $('#txtExtInferiores').val());

        formData.append('Columna', $(".rdbColumna").index($(".rdbColumna:checked")) + 1);
        formData.append('DColumna', $('#txtColumna').val());

        formData.append('SistemaNervioso', $(".rdbSistemaNervioso").index($(".rdbSistemaNervioso:checked")) + 1);
        formData.append('DSistemaNervioso', $('#txtSistemaNervioso').val());

        formData.append('Relato', $('#txtRelatoExamenFisico').val());
                
        return formData;
    },
       

    CargarVariablesEvaluacionNeonatalDetalle() {
        var formData = new FormData();
        //var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();
        var objrowTb2 = oTable_EvaHosp.api(true).row('.selected').data();

        //console.log("idusu: " + objrowTb2);
        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();

        //var nroEval = isEmpty(objrowTb2) ? (oTable_EvaHosp.DataTable().data().count() + 1) : objrowTb2.idNumero;

        formData.append('IdAtencion', Variables.IdAtencion);
        formData.append('NroEvaluacion', EvaluacionDetalle.IdNumero);
        formData.append('IdUsuario', isEmpty(objrowTb2) ? 0 : objrowTb2.idUsuario);

        formData.append('FechaInicioAtencion', ConvertirFormatoFecha($('#FechaInicioAtencion').val()));
        formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());

        //formData.append('ImpresionDiagnostica', $('#txtImpresionDiagnosticaNeo').val());
        formData.append('Seguimiento', $('#txtImpresionDiagnosticaNeo').val());
        formData.append('Tratamiento', $('#txtTratamientoNeo').val());
        formData.append('PlanTrabajo', $('#txtPlanTrabajoNeo').val());

        formData.append('idCuentaAtencion', Variables.IdCuentaAtencion);
        formData.append("idServicio", EvaluacionDetalle.IdServicio);
        formData.append("idMedico", EvaluacionDetalle.IdMedico);

        $('#hdNroEvaluacion').val(EvaluacionDetalle.IdNumero);

        //Diagnosticos
        formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));

        return formData;
    },

    ////////////////////////VALIDAR VARIABLES/////////////////////////////
    ValidarVariablesEvaluacionNeonatal() {
        if (isEmpty($("#FechaInicioAtencion").val()) == true) {
            alerta2('info', '', 'Ingrese la Fecha de Inicio de Atención.');
            $("#HoraInicioAtencion").focus();
            return false;
        }

        if (isEmpty($("#HoraInicioAtencion").val()) == true || $("#HoraInicioAtencion").val() == "__: __") {
            alerta2('info', '', 'Ingrese la Hora de Inicio de Atención.');
            $("#HoraInicioAtencion").focus();
            return false;
        }
                
        if (EvaluacionNeonatalHosp.nuevaEvaluacion == true || EvaluacionNeonatalHosp.modificaEvaluacion == true) {
            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            if (ListDiagnosticos.length == 0) {
                alerta2('info', '', 'Ingrese un diagnóstico.');
                $('.nav-tabs a[href="#diagnosticos"]').tab('show');
                return false;
            }
        }        

        return true;
    },

    ValidarInformeFirmado() {
        var objrowTb = oTable_EvaHosp.api(true).row('.selected').data();

        if (objrowTb.statusFirma == 1) {
            $("#FirmarEvalNeo").hide();
        } else {
            $("#FirmarEvalNeo").show();
        }
    },

    
    FiltrarProfesionalAtendio() {
        var tipo = '';
        var resp = 0;
        if ($("#rdbAtendidoPorMed").is(":checked")) { tipo = '1' } else if ($("#rdbAtendidoPorObs").is(":checked")) { tipo = '5' } else if ($("#rdbAtendidoPorOtro").is(":checked")) { tipo = '6' }
        $('#cboProfResponsable').empty();
        //console.log(medobsenf);
        if (tipo == '6') {
            $('#profesionalResponsableCombo').hide();
            $('#profesionalResponsableTexto').show();
        } else {
            $('#profesionalResponsableCombo').show();
            $('#profesionalResponsableTexto').hide();
            $(medobsenf).each(function (i, obj) {
                //console.log(obj.descripcion);
                if (obj.tipo == tipo && obj.esActivo == true) {
                    if (obj.valor == proferesp) {
                        resp = obj.valor;
                    }
                    $('#cboProfResponsable').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
        }

        $("#cboProfResponsable").val(resp);
        $("#cboProfResponsable").trigger("chosen:updated");
        //$('.chzn-select').chosen().trigger("chosen:updated");
    },

    PatNeo_Change() {
        if ($("#rdbPatNeoRnSi").is(":checked")) {
            $("#txtEspecificarRn").val("");
            $("#txtEspecificarRn").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbPatNeoRnNo").is(":checked")) {
            $("#txtEspecificarRn").val("");
            $("#txtEspecificarRn").attr('disabled', true);
        } else {
            $("#txtEspecificarRn").val("");
            $("#txtEspecificarRn").attr('disabled', true);
        }
    },

    Reanimacion_Change() {
        if ($("#rdbReanimacionSi").is(":checked")) {
            $("#cboTipoReanimacionRn").val("");
            $("#cboTipoReanimacionRn").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbReanimacionNO").is(":checked")) {
            $("#cboTipoReanimacionRn").val("");
            $("#cboTipoReanimacionRn").attr('disabled', true);
        } else {
            $("#cboTipoReanimacionRn").val("");
            $("#cboTipoReanimacionRn").attr('disabled', true);
        }
        $("#cboTipoReanimacionRn").trigger("chosen:updated");
    },

    Transporte_Change() {
        if ($("#rdbTransporteSi").is(":checked")) {
            $("#cboTipoTransporteRn").val("");
            $("#cboTipoTransporteRn").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbTransporteNO").is(":checked")) {
            $("#cboTipoTransporteRn").val("");
            $("#cboTipoTransporteRn").attr('disabled', true);
        } else {
            $("#cboTipoTransporteRn").val("");
            $("#cboTipoTransporteRn").attr('disabled', true);
        }
        $("#cboTipoTransporteRn").trigger("chosen:updated");
    },

    Condicion_Change() {
        $(".rdbObitoRn").prop('checked', false);
        if ($("#cboCondicionRn").val() == 1) {
            $('#rdbObitoRnNo').prop('checked', true);
            $(".rdbObitoRn").attr('disabled', true);
        }
        else if ($("#cboCondicionRn").val() == 3) {
            //$("#txtEspecificar").val("");
            $(".rdbObitoRn").removeAttr('disabled', 'disabled');
        }
    },

    TipoGestacion_Change() {
        $('#cboNumeroGemelarRn').empty();
        if ($('#cboTipoGestacionRn').val() == 1) {
            //console.log(medobsenf);
            $(gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
                if (obj.nroGemelos == 0) {
                    $('#cboNumeroGemelarRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
            $('#txtNroFetosRn').val(0);
            $('#cboNumeroGemelarRn').val(0);
            $("#txtNroFetosRn").attr('disabled', true);
            $("#cboNumeroGemelarRn").attr('disabled', true);
        } else if ($('#cboTipoGestacionRn').val() == 2) {
            $('#txtNroFetosRn').val('');
            $('#cboNumeroGemelarRn').val('');
            $("#txtNroFetosRn").removeAttr('disabled', 'disabled');
            $("#cboNumeroGemelarRn").removeAttr('disabled', 'disabled');
        } else {
            $("#txtNroFetosRn").attr('disabled', true);
            $("#cboNumeroGemelarRn").attr('disabled', true);
        }
        $("#cboNumeroGemelarRn").trigger("chosen:updated");
    },

    Fetos_Change() {
        var fetos = 0;
        $('#cboNumeroGemelarRn').empty();
        fetos = $('#txtNroFetosRn').val();

        if (fetos > 0 && fetos <= 10) {
            $(gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
                /*
                if (fetos > 5) {
                    fetos = 5;
                }*/
                if (obj.nroGemelos == fetos) {
                    $('#cboNumeroGemelarRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }

            });
        } else {
            if (fetos < 0 || fetos > 10 || (fetos == 0 && $('#cboTipoGestacionRn').val() == 2)) {
                $('#txtNroFetosRn').val('');
            } else {
                $(gemelar).each(function (i, obj) {
                    //console.log(obj.descripcion);
                    if (obj.nroGemelos == 0) {
                        $('#cboNumeroGemelarRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });
            }
        }
        $('#cboNumeroGemelarRn').val('');
        $("#cboNumeroGemelarRn").trigger("chosen:updated");
    },


    OtroRiesgoPerinatal_Change() {
        //let estaMarcado = $('#chkOtrosRiesgoPerinatal').prop('checked');
        //if (estaMarcado) {
        //    $('#txtOtrosRiesgoPerinatal').show();
        //} else {
        //    $('#txtOtrosRiesgoPerinatal').hide();
        //}

        $('#chkPeso4000gr').prop('checked') ? $('#txtPeso4000gr').show() : $('#txtPeso4000gr').hide();
        $('#chkPeso2500gr').prop('checked') ? $('#txtPeso2500gr').show() : $('#txtPeso2500gr').hide();
        $('#chkPreTerminos').prop('checked') ? $('#txtPreTerminos').show() : $('#txtPreTerminos').hide();
        $('#chkPostTerminos').prop('checked') ? $('#txtPostTerminos').show() : $('#txtPostTerminos').hide();
        $('#chkNatimuerto').prop('checked') ? $('#txtNatimuerto').show() : $('#txtNatimuerto').hide();
        $('#chkMuerteNeonatal').prop('checked') ? $('#txtMuerteNeonatal').show() : $('#txtMuerteNeonatal').hide();
        $('#chkDistocidos').prop('checked') ? $('#txtDistocidos').show() : $('#txtDistocidos').hide();
        $('#chkOtrosRiesgoPerinatal').prop('checked') ? $('#txtOtrosRiesgoPerinatal').show() : $('#txtOtrosRiesgoPerinatal').hide();
                
    },

    OtraInfeccionMaterna_Change() {
        //let estaMarcado = $('#chkOtrasInfeccionesMaternas').prop('checked');
        //if (estaMarcado) {
        //    $('#txtOtrasInfeccionesMaternas').show();
        //} else {
        //    $('#txtOtrasInfeccionesMaternas').hide();
        //}
        
        $('#chkTBCactiva').prop('checked') ? $('#txtTBCactiva').show() : $('#txtTBCactiva').hide();
        $('#chkLues').prop('checked') ? $('#txtLues').show() : $('#txtLues').hide();
        $('#chkTorch').prop('checked') ? $('#txtTorch').show() : $('#txtTorch').hide();
        $('#chkITUtrim').prop('checked') ? $('#txtITUtrim').show() : $('#txtITUtrim').hide();
        $('#chkUrocultivo').prop('checked') ? $('#txtUrocultivo').show() : $('#txtUrocultivo').hide();
        $('#chkGermen').prop('checked') ? $('#txtGermen').show() : $('#txtGermen').hide();
        $('#chkCovid').prop('checked') ? $('#txtCovid').show() : $('#txtCovid').hide();
        $('#chkDengue').prop('checked') ? $('#txtDengue').show() : $('#txtDengue').hide();
        $('#chkOtrasInfeccionesMaternas').prop('checked') ? $('#txtOtrasInfeccionesMaternas').show() : $('#txtOtrasInfeccionesMaternas').hide();
    },

    OtraEnfermedadMaterna_Change() {
        //let estaMarcado = $('#chkOtrasEnfermedadesMaternas').prop('checked');
        //if (estaMarcado) {
        //    $('#txtOtrasEnfermedadesMaternas').show();
        //} else {
        //    $('#txtOtrasEnfermedadesMaternas').hide();
        //}
        
        $('#chkPreClampsia').prop('checked') ? $('#txtPreClampsia').show() : $('#txtPreClampsia').hide();
        $('#chkEclampsia').prop('checked') ? $('#txtEclampsia').show() : $('#txtEclampsia').hide();
        $('#chkHTT').prop('checked') ? $('#txtHTT').show() : $('#txtHTT').hide();
        $('#chkDesnutricion').prop('checked') ? $('#txtDesnutricion').show() : $('#txtDesnutricion').hide();
        $('#chkDiabetesMellitus').prop('checked') ? $('#txtDiabetesMellitus').show() : $('#txtDiabetesMellitus').hide();
        $('#chkHepatitisB').prop('checked') ? $('#txtHepatitisB').show() : $('#txtHepatitisB').hide();
        $('#chkAnemia').prop('checked') ? $('#txtAnemia').show() : $('#txtAnemia').hide();
        $('#chkHipoHipertiroides').prop('checked') ? $('#txtHipoHipertiroides').show() : $('#txtHipoHipertiroides').hide();
        $('#chkOtrasEnfermedadesMaternas').prop('checked') ? $('#txtOtrasEnfermedadesMaternas').show() : $('#txtOtrasEnfermedadesMaternas').hide();
    },

    ReflejoRojo_Change() {
        if (EvaluacionNeonatalHosp.tieneTamizajeOftalmologico == 0) {
            if ($("#rdbReflejoRojoSi").is(":checked") || $("#rdbReflejoRojoNo").is(":checked")) {
                swal({
                    title: 'Tamizaje Oftalmológico',
                    text: "Se cargara automaticamente el Tamizaje Oftalmológico a la cuenta del paciente.",
                    icon: 'info',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCancelButton: false,
                    confirmButtonColor: '#4fb7fe',
                    //cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    //cancelButtonText: 'Cancelar',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        const resp = await ConsumoServicio.ConsumoServicioPorCodigoGuardar(Variables.IdCuentaAtencion, '99431.02', 1);
                        if (resp) {
                            EvaluacionNeonatalHosp.tieneTamizajeOftalmologico = 1
                        } 
                    }
                                       
                }, function (dimiss) {

                });
            }
        }        
    },

    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// GUARDA DATOS A LA BD
    /// </summary>
    /// Lista de metodos que guarda los datos de la evaluacion a la BD
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async GuardarEvaluacionNeonatal() {
        //Cargando(1);
        //console.log("GuardarEvaluacionNeonatal");
        var data = EvaluacionNeonatalHosp.CargarVariablesEvaluacionNeonatal();
        var respuesta;
        var resp = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/GuardarEvaluacion?area=Emergencia",
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
                    alerta2('danger', '', datos.msj);
                    Cargando(0)
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2('danger', '', error);
        }

        //return datos;
        return resp;
    },
    
    async GuardarSintomasNeonatal() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionNeonatalHosp.CargarVariablesSintomasNeonatal();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/GuardarSintomasNeonatal?area=Hospitalizacion",
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
                    //alerta(1, 'El examen físico se guardó correctamente.')

                } else {
                    Cargando(0);
                    alerta2('danger', '', datos.msj);
                }

            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarRiesgosPerinatales() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionNeonatalHosp.CargarVariablesRiesgosPerinatales();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/GuardarRiesgosPerinatales?area=Hospitalizacion",
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
                    //alerta(1, 'El examen físico se guardó correctamente.')

                } else {
                    Cargando(0);
                    alerta2('danger', '', datos.msj);
                }

            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarInfeccionesMaternas() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionNeonatalHosp.CargarVariablesInfeccionesMaternas();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/GuardarInfeccionesMaternas?area=Hospitalizacion",
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
                    //alerta(1, 'El examen físico se guardó correctamente.')

                } else {
                    Cargando(0);
                    alerta2('danger', '', datos.msj);
                }

            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarEnfermedadesMaternas() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionNeonatalHosp.CargarVariablesEnfermedadesMaternas();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/GuardarEnfermedadesMaternas?area=Hospitalizacion",
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
                    //alerta(1, 'El examen físico se guardó correctamente.')

                } else {
                    Cargando(0);
                    alerta2('danger', '', datos.msj);
                }

            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarAntecedentesFamiliares() {
        //Cargando(1);
        //console.log("GuardarAntecedentes");
        var data = EvaluacionNeonatalHosp.CargarVariablesAntecedentesFamiliares();
        var respuesta;
        var resp = false;
        let datos
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Paciente/GuardarAntecedentesFamiliares?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                respuesta = datos.respuesta;
                if (datos.estado) {
                    resp = true;
                    //alerta(1, 'Los antecedentes perinatales y nacimiento se guardó correctamente.');
                } else {
                    alerta2('danger', '', datos.msj);
                    Cargando(0);
                }
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }

        } catch (error) {
            alerta2('danger', '', error);
        }

        //return datos;
        return resp;
    },

    async GuardarRegistroNacimientoExterno() {

        if (EvaluacionNeonatalHosp.TablaRegistroNacimiento != 'EXTERNO') {
            return true;
        }

        var data = EvaluacionNeonatalHosp.CargarVariablesRegistroNacimientoExterno();
        var respuesta;
        var resp = false;
        let datos
                
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/GuardarRegistroNacimientoExterno?area=Hospitalizacion",
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
                    //alerta(1, 'El examen físico se guardó correctamente.')

                } else {
                    Cargando(0);
                    alerta2('danger', '', datos.msj);
                }

            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarExamenNeonatal() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionNeonatalHosp.CargarVariablesExamenFisicoNeonatal();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/GuardarExamenNeonatal?area=Emergencia",
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
                    //alerta(1, 'El examen físico se guardó correctamente.')

                } else {
                    Cargando(0);
                    alerta2('danger', '', datos.msj);
                }

            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            alerta2(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarEvaluacionDetalleNeonatal() {
        //console.lo("ENTROOOOO");
        //Cargando(1);
        //console.log("GuardarEvaluacionDetalleNeonatal");
        var data = EvaluacionNeonatalHosp.CargarVariablesEvaluacionNeonatalDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/GuardarEvaluacionDetalle?area=Emergencia",
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
                    Cargando(0)
                } else {
                    alerta2('danger', '', datos.msj);
                    EvaluacionNeonatalHosp.CerrarModuloNeonatal();
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
            alerta2('danger', '', error);
        }

        //return datos;
        return resp;

        ////////////////////////////////////////////////////////////
        //console.log(data);

    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    /// <summary>
    /// OPCIONES DE INTERACCIÓN
    /// </summary>
    /// Lista de metodos de limpieza variables y bloqueos
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    LimpiarModuloNeonatal() {
        $("#TabPanelRegistro input[type=text]").val("");
        $("#TabPanelRegistro textarea").val("");
        $("#TabPanelRegistro input[type=checkbox]").prop('checked', false);
        $("#TabPanelRegistro #examenFisico input[type=radio].default").prop('checked', true);
        $("#TabPanelRegistro #antecedentesGenerales input[type=radio]").prop('checked', false);
        $("#modalEvaluacionNeonatal #antecedentesGenerales .chzn-select").val("");

        $("#lblNumeroEvaluacion").html("");
        $("#lblTipoEvaluacion").html("");

        $("#txtOtroSintomas").hide();

        $('.chzn-select').chosen().trigger("chosen:updated");
        EvaluacionNeonatalHosp.nuevaEvaluacion = false;
        EvaluacionNeonatalHosp.modificaEvaluacion = false;

        $("#btnGuardarEvaNeo").hide();

        asigna_FechaHoraAtencion(null);

        proferesp = 0;
        EvaluacionNeonatalHosp.IdAtencionSintoma = 0;
        EvaluacionNeonatalHosp.IdCuentaAtencionMadre = 0;
        EvaluacionNeonatalHosp.IdPacienteMadre = 0;
        EvaluacionNeonatalHosp.tieneTamizajeOftalmologico = 0;
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

    BloquearOpcionesModificacion() {
        $(".OpcionesCPT").hide();
        $(".OpcionesRecetas").hide();
        $(".OpcionesOrdenes").hide();
        $(".OpcionesDiagnosticos").hide();
        $("#FirmarEvalEmer").hide();
        $("#ImprimirEvalEmerCF").hide();
        $("#ImprimirEvalEmerSF").hide();
        $("#evaluaciones .entrada").attr('disabled', 'disabled');

        $("#CardEvaNeo").removeClass("bg-blue");
        $("#btnGuardarEvaNeo").hide();
    },

    DesbloquearOpcionesModificacion() {
        $(".OpcionesCPT").show();
        $(".OpcionesRecetas").show();
        $(".OpcionesOrdenes").show();
        $(".OpcionesDiagnosticos").show();
        //$("#FirmarEvalEmer").show();
        $("#evaluaciones .entrada").removeAttr("disabled");
        $("#btnGuardarEvaNeo").show();
    },

    BloquearCampos() {
        $("#TabPanelRegistro .campo input[type=text]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo textarea").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo input[type=checkbox]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo input[type=radio]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo .chzn-select").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");

        $("#btnGuardarEvaNeo").hide();
        $("#btnNuevoRegistro").hide();
    },

    DesbloquearCampos() {
        $("#TabPanelRegistro .campo input[type=text]").removeAttr("disabled");
        $("#TabPanelRegistro .campo textarea").removeAttr("disabled");
        $("#TabPanelRegistro .campo input[type=checkbox]").removeAttr("disabled");
        $("#TabPanelRegistro .campo input[type=radio]").removeAttr("disabled");
        $("#TabPanelRegistro .campo .chzn-select").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");

        $("#btnGuardarEvaNeo").show();
        $("#btnNuevoRegistro").show();
    },

    BloquearCamposRegistroNacimiento() {
        $("#TabPanelRegistro .campoNac input[type=text]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoNac textarea").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoNac input[type=checkbox]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoNac input[type=radio]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoNac .chzn-select").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoNac .chzn-select-deselect").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    BloquearCamposAntecedentes() {
        $("#TabPanelRegistro .campoAnte input[type=text]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoAnte textarea").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoAnte input[type=checkbox]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoAnte input[type=radio]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoAnte .chzn-select").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campoAnte .chzn-select-deselect").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// INICIAR SCRIPT Y MODULO
    /// </summary>
    /// Lista de metodos que incian la carga del módulo 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async IniciarModulo() {
        await EvaluacionNeonatalHosp.IniciarScript();
    },

    async IniciarScript() {
        await EvaluacionNeonatalHosp.cargaInicial();
        //EvaluacionNeonatalHosp.initDatables();
        EvaluacionNeonatalHosp.IniciarDataTablesEvaluacion();
        EvaluacionNeonatalHosp.Eventos();
    },

    async cargaInicial() {
        EvaluacionNeonatalHosp.nuevaEvaluacion = false;
        EvaluacionNeonatalHosp.modificaEvaluacion = false;

        //opcionModificar = false;

        await EvaluacionNeonatalHosp.ListarTiposGravedadAtencion();
        await EvaluacionNeonatalHosp.ListarTiposServiciosMGP();
        await AdmisionHospitalizacion.ListarOrigenAtencionHospitalizacion(1);
        await EvaluacionNeonatalHosp.ListarMedicosObstetrasEnfermeras();
        await EvaluacionNeonatalHosp.ListarTiposSexo();
        await EvaluacionNeonatalHosp.ListarTiposGestacion();
        await EvaluacionNeonatalHosp.ListarGemelares();
        await EvaluacionNeonatalHosp.ListarTiposClampaje();
        await EvaluacionNeonatalHosp.ListarTiposCondicion();
        await EvaluacionNeonatalHosp.ListarTiposContactoPielaPiel();
        await EvaluacionNeonatalHosp.ListarTiposReanimacion();
        await EvaluacionNeonatalHosp.ListarTiposTransportes();
        await EvaluacionNeonatalHosp.ListarServicios();
        await EvaluacionNeonatalHosp.ListarTiposProcedencia();
                
        /////////////////COMBOS DATOS LABOR PARTO/////////////////////////
        await EvaluacionNeonatalHosp.ListarTiposLaborParto();
        //////////////////////////////////////////////////////////////////

        $("#txtOtroSintomas").hide();

        $('#FechaInicioAtencion, #FechaInicioLaborParto, #FechaGrupoSan, #FechaFactorRH, #FechaHemoglobina, #FechaHematocrito, #txtFechaNacimientoRn').datepicker({
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
        $('#FechaInicioAtencion, #FechaInicioLaborParto, #FechaGrupoSan, #FechaFactorRH, #FechaHemoglobina, #FechaHematocrito, #txtFechaNacimientoRn').mask("Dd/Mm/abcd"); 

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");
        $("#txtHoraInicioLaborParto").mask("Hn:Nn");

    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}


