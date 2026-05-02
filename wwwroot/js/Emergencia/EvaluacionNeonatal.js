var EvaluacionNeonatal = {
    nuevaEvaluacion: false,
    modificaEvaluacion: false,
    
    //idMedico: 0,
    //nroEvaluacion: 0,
    //idServicio: 0,

    /// <summary>
    /// EVENTOS
    /// </summary>
    /// Carga los eventos que se encargan de la interaccion y acciones en las vistas para el módulo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        
        $('#tblEvaluacionesEmergencia tbody').on('click', 'tr', async function () {
            EvaluacionNeonatal.LimpiarVistaModuloEvaluacionDetalle();
            EvaluacionNeonatal.BloquearOpcionesModificacion();

            //oTable_EvaEmer.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();
            
            if (!isEmpty(objrowTb)) {
                EvaluacionDetalle.Cargar(objrowTb);
                //EvaluacionNeonatal.nroEvaluacion = objrowTb.idNumero;
                //if (EvaluacionNeonatal.nroEvaluacion > 0) {
                if (EvaluacionDetalle.IdNumero > 0) {
                    //await EvaluacionNeonatal.CargarDatosEvaluacionDetalle(Variables.IdAtencion, Variables.IdServicioEgreso, EvaluacionNeonatal.nroEvaluacion);
                    await EvaluacionNeonatal.CargarDatosEvaluacionDetalle(EvaluacionDetalle.IdAtencion, EvaluacionDetalle.IdServicio, EvaluacionDetalle.IdNumero);
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

        $('.OpcionEvalNeo').on('click', function () {            
            EvaluacionNeonatal.nuevaEvaluacion = false;
            EvaluacionNeonatal.modificaEvaluacion = false;

            $("#FirmarEvalEmer").show();
            $("#ImprimirEvalEmerCF").show();
            $("#ImprimirEvalEmerSF").show();

            $("#txtFecNac").attr('disabled', true);
            $("#txtHoraNac").attr('disabled', true);
            $("#cboSexo").attr('disabled', true);
            $("#txtNroHijo").attr('disabled', true);

            $("#CardEvaNeo").removeClass("bg-blue");
            $('#tblEvaluacionesEmergencia tbody').find('tr').removeClass("selected");
            //$("#FirmarEvalEmer").attr("href", "");  (COMNETADO POR KHOYOSI - FIRMA ANTERIOR)

            ////////////COMENTADO POR KHOYOSI//////////////////////////
            //if (AdmisionEmergencia.accion == 'M') {
            //    $("#btnGuardarEvaNeo").show();
            //} else {
            //    if (AdmisionEmergencia.accion == 'C') {
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
                
        $('#ImprimirEvalEmerSF').on('click', async function () {
            var objrow = oTable_EvaEmer.api(true).row('.selected').data();
            //console.log(objrow);

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

        //////////////////////////////FIRMAR DIGITAL/////////////////////////////////////
        $('#FirmarEvalEmer').on('click', async function () {
            var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.')
                return false
            }

            Cargando(1);
            Utilitario.TipoArchivoFirmar = 'EMER-EVA-DET';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(Variables.IdCuentaAtencion, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio);
                if (!isEmpty(paquete)) {
                    //console.log(paquete.data);                
                    await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data)
                }
            } else if (permisoFirmaDigital == 2) {
                const paquete = await Utilitario.CrearPaqueteArchivos7zip(Variables.IdCuentaAtencion, EvaluacionDetalle.IdNumero, EvaluacionDetalle.IdServicio);
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
                }
            } 

            //const paquete = await Utilitario.CrearPaqueteArchivos(Variables.IdCuentaAtencion, EvaluacionNeonatal.nroEvaluacion, Variables.IdServicioIngreso);
            
            Cargando(0);

        });
        ///////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////EVENTOS VISOR RECETAS////////////////////////////////////////////////////
        $('#btnVisorRecetasEmer').on('click', async function () {
            var row = oTable_EvaEmer.api(true).row('.selected').data();
            //console.log(row);
            if (typeof row === 'undefined') {
                alerta(2, "Seleccione una evaluación por favor.");
            } else {
                //const recetas = await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, EvaluacionNeonatal.nroEvaluacion, Variables.IdServicioIngreso, Variables.IdMedico);
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
            var eval = oTable_EvaEmer.DataTable().data().count();

            EvaluacionDetalle.IdMedico = await Utilitario.ObtenerIdMedicoSesion();
            EvaluacionDetalle.IdServicio = Variables.IdServicioEgreso;
            EvaluacionDetalle.IdNumero = eval + 1;

            OrdenMedica.nroEvaluaciones = eval;

            $('#hdNroEvaluacion').val(EvaluacionDetalle.IdNumero);

            if (EvaluacionDetalle.IdMedico > 0) {
                EvaluacionNeonatal.LimpiarVistaModuloEvaluacionDetalle();
                EvaluacionNeonatal.DesbloquearOpcionesModificacion();

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

                EvaluacionNeonatal.nuevaEvaluacion = true;
                EvaluacionNeonatal.modificaEvaluacion = false;
                //EvaluacionEmergencia.idMedico = Utilitario.ObtenerIdMedicoSesion();
                //Variables.IdMedico = EvaluacionEmergencia.idMedico;

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
        ///////////////////////////////////////////////////////////////////////////////////////


        /////////////////////////GUARDAR Y CANCELAR EVALUACION////////////////////////
        $("#btnGuardarEvaNeo").on('click', async function () {            
            var eval = oTable_EvaEmer.DataTable().data().count();

            if (eval == 0 && EvaluacionNeonatal.nuevaEvaluacion == false) {
                alerta(2, "No se ha registrado ninguna evaluación. Por favor registre una evaluación.");
            } else {
                if (EvaluacionNeonatal.ValidarVariablesEvaluacionNeonatal()) {
                    Cargando(1);
                    //Triaje.GuardarTriajeHospEmeg(objrow.idAtencion, objrow.idServicioEgreso, 0);
                    Triaje.GuardarTriajeHospEmeg(Variables.IdAtencion, Variables.IdServicioEgreso, 0);
                    const data1 = await EvaluacionNeonatal.GuardarEvaluacionNeonatal();
                    const data2 = await EvaluacionNeonatal.GuardarAntecedentes();
                    const data3 = await EvaluacionNeonatal.GuardarExamenNeonatal();

                    if (EvaluacionNeonatal.nuevaEvaluacion == true || EvaluacionNeonatal.modificaEvaluacion == true) {
                        if (data1 == true && data2 == true && data3 == true) {
                            const data4 = await EvaluacionNeonatal.GuardarEvaluacionDetalleNeonatal();

                            let nuevaEval = EvaluacionNeonatal.nuevaEvaluacion;
                            EvaluacionNeonatal.CargarEvaluacionDetalle(EvaluacionDetalle.IdNumero);

                            if (nuevaEval == true) {
                                swal({
                                    title: 'EMERGENCIA',
                                    text: "La evaluación se guardó correctamente. <br><br>¿Desea generar una receta/orden médica?",
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


                            //console.log("Eval: " + $('#hdNroEvaluacion').val());
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
                    }

                    //EvaluacionNeonatal.LimpiarModuloNeonatal();
                    //EvaluacionDetalle.Limpiar();
                    //AdmisionEmergencia.CerrarModulo();
                    //ReposicionarVista();
                    //MostrarAreaLista();
                    //AdmisionEmergencia.ListarAtenciones();

                    Cargando(0);
                }
            }
        });
        

        $("#btnCancelarEvaNeo").on('click', function () {
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
                AdmisionEmergencia.limpiarRecetas()
                EvaluacionNeonatal.LimpiarModuloNeonatal();
                EvaluacionDetalle.Limpiar();
                AdmisionEmergencia.CerrarModulo();
                ReposicionarVista();
                MostrarAreaLista();
            }, function (dimiss) {

            });
        });

        $("#btnRecargarEvaNeo").on('click', function () {
            //$('span[data-evaluacion=' + EvaluacionNeonatal.nroEvaluacion + ']').click();
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
            if (datos.session) {
                $(datos.lsTiposServiciosMGP.table).each(function (i, obj) {
                    $('#cboTipoPaciente').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>');
                });
                $('#cboTipoPaciente').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
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
            alerta(3, error);
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
            if (datos.session) {
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                });
                $('#cboSexo').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },
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
        EvaluacionNeonatal.CargarEvaluacion();
        EvaluacionNeonatal.DesbloquearCampos();        
        //console.log("ENTROO");
    },

    ConsultarEvaluacion() {
        EvaluacionNeonatal.CargarEvaluacion();
        EvaluacionNeonatal.BloquearCampos();        
        //console.log("ENTROO");
    },

    CargarEvaluacion() {
        //opcionModificar = true;
        //var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

        //this.LimpiarModal();
        //this.HabilitarModal();
        AdmisionEmergencia.limpiarRecetas()
        EvaluacionNeonatal.LimpiarModuloNeonatal();
        //Triaje.listaTriajeEmgHosp(objrow.idAtencion, objrow.idServicioEgreso, 0);
        EvaluacionNeonatal.CargarDatosEvaluacion();
        //EvaluacionNeonatal.AbrirModalNeonatal();

        //AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        //ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)

        //idPacienteGlobal = objrow.idPaciente;     //idPaciente para el Alta

        $("#motivo-tab").click();
        //this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);

        //$("#btnGuardarEvaNeo").hide();
        //$("#btnNuevoRegistro").show();

        MostrarAreaRegistro();
    },

    CargarEvaluacionDetalle(idEval) {
        AdmisionEmergencia.limpiarRecetas()        
        EvaluacionNeonatal.LimpiarModuloNeonatal();
        EvaluacionNeonatal.CargarDatosEvaluacion();
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
    SeleccionarEvaluacionNeonatal(idAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        var dataEvaluacion = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatal/SeleccionarEvaluacionNeonatal?area=Emergencia",
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

    SeleccionarEvaluacionDetalleNeonatal(idAtencion, idServicio) {
        Cargando(1);
        oTable_EvaEmer.fnClearTable();
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        var dataEvaluacionDetalle = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatal/SeleccionarEvaluacionDetalleNeonatal?area=Emergencia",
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
                        dataEvaluacionDetalle = datos.respuesta.table;
                        oTable_EvaEmer.fnAddData(dataEvaluacionDetalle);

                        OrdenMedica.nroEvaluaciones = datos.respuesta.table.length;
                    }
                    else {
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
                url: "/EvaluacionNeonatal/SeleccionarEvaluacionDetalleNeonatalPorEvaluacion?area=Emergencia",
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

    SeleccionarExamenFisicoNeonatal(idAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        var dataExamenFisico = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatal/SeleccionarExamenFisicoNeonatal?area=Emergencia",
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
                        dataExamenFisico = datos.respuesta.table[0];
                    }
                    else {
                        dataExamenFisico = [];
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
        //console.log(dataReferencia);
        return dataExamenFisico;
    },

    SeleccionarAntecedentes(idPaciente) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);
        var dataAntecedentes = [];

        $.ajax({
            method: "POST",
            url: "/EvaluacionNeonatal/SeleccionarRnAntecedentes?area=Emergencia",
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
    CargarDatosEvaluacion() {
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        $("#txtPaciente").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtPacienteNombre").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtNroHistoria").val(objrowTb.nroHistoriaClinica);
        $("#txtHistoria").val(objrowTb.nroHistoriaClinica);
        $("#HistoriaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-clipboard-medical'></i><b>Historia: </b>" + objrowTb.nroHistoriaClinica);
        $("#txtTipoDocumentoEmer").val(objrowTb.tipoDocumento);
        $("#txtNroDocumentoEmer").val(objrowTb.nroDocumento);
        //$("#txtEdadAnio").val(objrowTb.edadEnAnio);
        //$("#txtEdadMes").val(objrowTb.edadEnMes);
        //$("#txtEdadDia").val(objrowTb.edadEnDia);
        $("#txtNroCuenta").val(objrowTb.idCuentaAtencion);
        $("#CuentaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-hashtag'></i><b>Cuenta: </b>" + objrowTb.idCuentaAtencion);
        $("#txtNroAtencion").val(objrowTb.idAtencion);
        $("#cboTipoPaciente").val(objrowTb.idTipoPaciente);
        $("#cboOrigenPaciente").val(objrowTb.idOrigenAtencion);
        $("#cboPrioridad").val(objrowTb.idTipoGravedad);
        $("#hdIdTipoFuenteFian").val(objrowTb.idTipoFinanciamiento);
        $('#hdIdCuentaAtencion').val(objrowTb.idCuentaAtencion);
        $('#hdIdServicioPaciente').val(Variables.IdServicioEgreso);
        //$('#hdIdServicioPaciente').val(objrowTb.idServicioEgreso);
        IdCuentaAtencionTemp = objrowTb.idCuentaAtencion;       //variable para conservar el IdCuentaAtencion despues de abrir el modulo de SEGUIMIENTO

        Triaje.listaTriajeEmgHosp(Variables.IdAtencion, Variables.IdServicioEgreso, 0);

        var EvaNeo = EvaluacionNeonatal.SeleccionarEvaluacionNeonatal(Variables.IdAtencion);
        //var EvaDetneo = EvaluacionNeonatal.SeleccionarEvaluacionDetalleNeonatal(Variables.IdAtencion, Variables.IdServicioEgreso);
        var EvaDetneo = EvaluacionNeonatal.SeleccionarEvaluacionDetalleNeonatal(Variables.IdAtencion, 0);
        var ExaFisNeo = EvaluacionNeonatal.SeleccionarExamenFisicoNeonatal(Variables.IdAtencion);
        var EvaAnte = EvaluacionNeonatal.SeleccionarAntecedentes(Variables.IdPaciente);

        //----------------------EVALUACION NEONATAL-----------------------//
        $("#txtEdadAnio").val(EvaNeo.edadEnAnio);
        $("#txtEdadMes").val(EvaNeo.edadEnMes);
        $("#txtEdadDia").val(EvaNeo.edadEnDia);

        $('#txtGlasgow').val(EvaNeo.glasgow);

        $('#txtTiempoEnfermedad').val(EvaNeo.tiempoEnfermedad);
        $('#txtInicioEnfermedad').val(EvaNeo.inicio);
        $('#txtCursoEnfermedad').val(EvaNeo.curso);

        $('#chkDificultadRespiratoria').prop('checked', EvaNeo.dificultadRespiratoria);
        $('#chkDiarrea').prop('checked', EvaNeo.diarrea);
        $('#chkDistensionAbdominal').prop('checked', EvaNeo.distensionAbdominal);
        $('#chkCianosis').prop('checked', EvaNeo.cianosis);
        $('#chkMalOlorOmbligo').prop('checked', EvaNeo.malOlorOmbligo);
        $('#chkIctericia').prop('checked', EvaNeo.ictericia);
        $('#chkDolor').prop('checked', EvaNeo.dolor);
        $('#chkConvulsiones').prop('checked', EvaNeo.convulsiones);
        $('#chkFiebre').prop('checked', EvaNeo.fiebre);
        $('#chkVomitos').prop('checked', EvaNeo.vomitos);
        $('#chkHemorragia').prop('checked', EvaNeo.hemorragia);
        $('#chkOtros').prop('checked', EvaNeo.otros);
        if (EvaNeo.otros) {
            $('#txtOtroSintomas').val(EvaNeo.otrosSintomas);
            $("#txtOtroSintomas").show();
        } else {
            $("#txtOtroSintomas").val("");
            $("#txtOtroSintomas").hide();
        }

        $('#txtRelato').val(EvaNeo.relato);
        $('#txtAntecedentesGenerales').val(EvaNeo.antecedentes);

        //--------------------EXAMEN FISICO----------------------------//
        $(".rdbGeneral").eq(ExaFisNeo.estadoGeneralSensorio - 1).prop('checked', true);
        $('#txtEstadoGeneralSensorio').val(ExaFisNeo.dEstadoGeneralSensorio);
        $('#txtEstadoGeneralSensorioEdemas').val(ExaFisNeo.eEstadoGeneralSensorio);
        $(".rdbPiel").eq(ExaFisNeo.piel - 1).prop('checked', true);
        $('#txtPiel').val(ExaFisNeo.dPiel);
        $(".rdbCraneo").eq(ExaFisNeo.craneo - 1).prop('checked', true);
        $('#txtCraneo').val(ExaFisNeo.dCraneo);
        $(".rdbPabAuri").eq(ExaFisNeo.pabellonAuricular - 1).prop('checked', true);
        $('#txtPabellonAuricular').val(ExaFisNeo.dPabellonAuricular)
        $(".rdbCara").eq(ExaFisNeo.cara - 1).prop('checked', true);
        $('#txtCara').val(ExaFisNeo.dCara);
        $(".rdbBocaRL").eq(ExaFisNeo.bocaORL - 1).prop('checked', true);
        $('#txtBocaORL').val(ExaFisNeo.dBocaORL);
        $(".rdbCuello").eq(ExaFisNeo.cuello - 1).prop('checked', true);
        $('#txtCuello').val(ExaFisNeo.dCuello);
        $(".rdbClavicula").eq(ExaFisNeo.clavicula - 1).prop('checked', true);
        $('#txtClavicula').val(ExaFisNeo.dClavicula);
        $(".rdbToraxSilv").eq(ExaFisNeo.toraxSilv - 1).prop('checked', true);
        $('#txtToraxSilv').val(ExaFisNeo.dToraxSilv);
        $(".rdbCardio").eq(ExaFisNeo.aparatoCardioVascular - 1).prop('checked', true);
        $('#txtAparatoCardioVascular').val(ExaFisNeo.dAparatoCardioVascular);
        $('#txtAparatoCardioVascularReflejos').val(ExaFisNeo.rAparatoCardioVascular);
        $(".rdbAbdomen").eq(ExaFisNeo.abdomen - 1).prop('checked', true);
        $('#txtAbdomen').val(ExaFisNeo.dAbdomen);
        $(".rdbOmbligo").eq(ExaFisNeo.ombligo - 1).prop('checked', true);
        $('#txtOmbligo').val(ExaFisNeo.dOmbligo);
        $(".rdbAno").eq(ExaFisNeo.ano - 1).prop('checked', true);
        $('#txtAno').val(ExaFisNeo.dAno);
        $(".rdbGenitales").eq(ExaFisNeo.genitales - 1).prop('checked', true);
        $('#txtGenitales').val(ExaFisNeo.dGenitales);
        $(".rdbExtSup").eq(ExaFisNeo.extSuperiores - 1).prop('checked', true);
        $('#txtExtSuperiores').val(ExaFisNeo.dExtSuperiores);
        $(".rdbExtInf").eq(ExaFisNeo.extInferiores - 1).prop('checked', true);
        $('#txtExtInferiores').val(ExaFisNeo.dExtInferiores);
        $(".rdbColumna").eq(ExaFisNeo.columna - 1).prop('checked', true);
        $('#txtColumna').val(ExaFisNeo.dColumna);
        $(".rdbSistemaNervioso").eq(ExaFisNeo.sistemaNervioso - 1).prop('checked', true);
        $('#txtSistemaNervioso').val(ExaFisNeo.dSistemaNervioso);

        /*----------------------------ANTECEDENTES----------------------------------------*/
        if (EvaAnte.lsAntecedentesPerinatales.table.length > 0) {
            $(".rdbEmbarazo").eq(EvaAnte.lsAntecedentesPerinatales.table[0].tipoEmbarazo - 1).prop('checked', true);
            $("#txtPatGest").val(EvaAnte.lsAntecedentesPerinatales.table[0].patologias);
            $("#txtNroEmbarazo").val(EvaAnte.lsAntecedentesPerinatales.table[0].nroEmbarazo);
            $(".rdbAtPreNatal").eq(EvaAnte.lsAntecedentesPerinatales.table[0].atencionPrenatal - 1).prop('checked', true);
            $("#txtNroAPN").val(EvaAnte.lsAntecedentesPerinatales.table[0].nroApn);
            $("#txtLugarAPN").val(EvaAnte.lsAntecedentesPerinatales.table[0].lugarApn);
            $(".rdbParto").eq(EvaAnte.lsAntecedentesPerinatales.table[0].tipoParto - 1).prop('checked', true);
            $("#txtComplicaciones").val(EvaAnte.lsAntecedentesPerinatales.table[0].complicacionParto);
            $("#cboLugarParto").val(EvaAnte.lsAntecedentesPerinatales.table[0].lugarParto);
            $("#cboAtendidoPor").val(EvaAnte.lsAntecedentesPerinatales.table[0].atendidoPor);
            $("#txtNombreAtendio").val(EvaAnte.lsAntecedentesPerinatales.table[0].atendidoPorotro);
        }

        $("#txtFecNac").val(objrowTb.fechaNacimiento);
        $("#txtHoraNac").val(objrowTb.horaNacimiento);
        $("#cboSexo").val(objrowTb.idTipoSexo);
        $("#txtNroHijo").val(objrowTb.nroOrdenHijo);

        if (EvaAnte.lsAntecedentesNacimiento.table.length > 0) {
            $("#txtEdadGestacional").val(EvaAnte.lsAntecedentesNacimiento.table[0].estaGestacionalAlNacer);
            $("#txtPesoRn").val(EvaAnte.lsAntecedentesNacimiento.table[0].pesoAlNacer);
            $("#txtTallaRn").val(EvaAnte.lsAntecedentesNacimiento.table[0].tallaAlNacer);
            $("#txtPerCefalico").val(EvaAnte.lsAntecedentesNacimiento.table[0].perimetroCefalico);
            $("#txtPerToracico").val(EvaAnte.lsAntecedentesNacimiento.table[0].perimetroToracico);
            $(".rdbInmediato").eq(EvaAnte.lsAntecedentesNacimiento.table[0].inmedito - 1).prop('checked', true);
            $("#txtMinuto").val(EvaAnte.lsAntecedentesNacimiento.table[0].apgar1min);
            $("#txt5Minuto").val(EvaAnte.lsAntecedentesNacimiento.table[0].apgar5min);
            $(".rdbReanimacion").eq(EvaAnte.lsAntecedentesNacimiento.table[0].reanimacion - 1).prop('checked', true);
            $(".rdbPatNeo").eq(EvaAnte.lsAntecedentesNacimiento.table[0].patologiaNeonatal - 1).prop('checked', true);
            $("#txtEspecificar").val(EvaAnte.lsAntecedentesNacimiento.table[0].patologiaNeonatalDescripcion);
            $(".rdbHosp").eq(EvaAnte.lsAntecedentesNacimiento.table[0].hospitalizacion - 1).prop('checked', true);
            $("#txtTiempoHosp").val(EvaAnte.lsAntecedentesNacimiento.table[0].tiempoHospitalizado);
        }


        $('.chzn-select').chosen().trigger("chosen:updated");
        //console.log(EvaNeo);
        //console.log(EvaDetneo);
        //console.log(ExaFisNeo);
    },

    async CargarDatosEvaluacionDetalle(idAtencion, idServicio, nroEvaluacion) {
        $("#BadgeEvaluacion .msc-hotline").addClass("bg-blue");
        $("#BadgeEvaluacion .msc-hotline-icon").addClass("bg-info");

        $("#lblNumeroEvaluacion").html("Evaluación N° " + nroEvaluacion);
        $("#lblTipoEvaluacion").html("Evaluación Registrada");

        var evaluacion = await EvaluacionNeonatal.SeleccionarEvaluacionDetalleNeonatalPorEvaluacion(idAtencion, idServicio, nroEvaluacion);
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
        $('#txtTratamientoNeo').val(evaluacion.indicaciones);
        $('#txtPlanTrabajoNeo').val(evaluacion.plandeTrabajo);
                      
        if (evaluacion.idUsuario == AdmisionEmergencia.ObtenerIdUsuarioSesion() && AdmisionEmergencia.accion == 'M') {
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

            EvaluacionNeonatal.nuevaEvaluacion = false;
            EvaluacionNeonatal.modificaEvaluacion = true;

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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// <summary>
    /// CARGA DATOS A LAS VARIABLES
    /// </summary>
    /// Lista de metodos que carga los datos de la evaluacion a la variables
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CargarVariablesEvaluacionNeonatal() {
        var formData = new FormData();

        formData.append('IdAtencion', Variables.IdAtencion);

        formData.append('Prioridad', $('#cboPrioridad').val());
        formData.append('Glasgow', $('#txtGlasgow').val());

        ///////////////////////ENFERMEDAD ACTUAL//////////////////////////
        formData.append('TiempoEnfermedad', $('#txtTiempoEnfermedad').val());
        formData.append('InicioEnfermedad', $('#txtInicioEnfermedad').val());
        formData.append('CursoEnfermedad', $('#txtCursoEnfermedad').val());

        //////////////////////SIGNOS Y SINTOMAS////////////////////////////////
        formData.append('DificultadRespiratoria', $('#chkDificultadRespiratoria').is(":checked"));
        formData.append('Diarrea', $('#chkDiarrea').is(":checked"));
        formData.append('DistensionAbdominal', $('#chkDistensionAbdominal').is(":checked"));
        formData.append('Cianosis', $('#chkCianosis').is(":checked"));
        formData.append('MalOlorOmbligo', $('#chkMalOlorOmbligo').is(":checked"));
        formData.append('Ictericia', $('#chkIctericia').is(":checked"));
        formData.append('Dolor', $('#chkDolor').is(":checked"));
        formData.append('Convulsiones', $('#chkConvulsiones').is(":checked"));
        formData.append('Fiebre', $('#chkFiebre').is(":checked"));
        formData.append('Vomitos', $('#chkVomitos').is(":checked"));
        formData.append('Hemorragia', $('#chkHemorragia').is(":checked"));
        formData.append('Otros', $('#chkOtros').is(":checked"));
        formData.append('OtrosSintomas', $('#txtOtroSintomas').val());

        //////////////////////////////RELATO/////////////////////////////////////////
        formData.append('Relato', $('#txtRelato').val());

        ////////////////////////////ANTECEDENTES GENERALES//////////////////////////
        formData.append('AtecedentesGenerales', $('#txtAntecedentesGenerales').val());

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

        return formData;
    },

    CargarVariablesAntecedentes() {
        var formData = new FormData
        //var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        /////////////////////////ANTECEDENTES PERINATALES//////////////////////////////
        formData.append("tipoEmbarazo", $(".rdbEmbarazo").index($(".rdbEmbarazo:checked")) + 1);
        formData.append("patologias", $("#txtPatGest").val());
        formData.append("nroEmbarazo", $("#txtNroEmbarazo").val());
        formData.append("atencionPrenatal", $(".rdbAtPreNatal").index($(".rdbAtPreNatal:checked")) + 1);
        formData.append("nroApn", $("#txtNroAPN").val());
        formData.append("lugarApn", $("#txtLugarAPN").val());
        formData.append("tipoParto", $(".rdbParto").index($(".rdbParto:checked")) + 1);
        formData.append("complicacionParto", $("#txtComplicaciones").val());
        formData.append("lugarParto", $("#cboLugarParto").val());
        formData.append("atendidoPor", $("#cboAtendidoPor").val());
        formData.append("atendidoPorotro", $("#txtNombreAtendio").val());

        /////////////////////////ANTECEDENTES NACIMIENTO//////////////////////////////
        formData.append("estaGestacionalAlNacer", $("#txtEdadGestacional").val());
        formData.append("pesoAlNacer", $("#txtPesoRn").val());
        formData.append("tallaAlNacer", $("#txtTallaRn").val());
        formData.append("perimetroCefalico", $("#txtPerCefalico").val());
        formData.append("perimetroToracico", $("#txtPerToracico").val());

        formData.append("inmedito", $(".rdbInmediato").index($(".rdbInmediato:checked")) + 1);
        formData.append("apgar1min", $("#txtMinuto").val());
        formData.append("apgar5min", $("#txt5Minuto").val());
        formData.append("reanimacion", $(".rdbReanimacion").index($(".rdbReanimacion:checked")) + 1);
        formData.append("patologiaNeonatal", $(".rdbPatNeo").index($(".rdbPatNeo:checked")) + 1);
        formData.append("patologiaNeonatalDescripcion", $("#txtEspecificar").val());
        formData.append("hospitalizacion", $(".rdbHosp").index($(".rdbHosp:checked")) + 1);
        formData.append("tiempoHospitalizado", $("#txtTiempoHosp").val());

        formData.append("idPaciente", Variables.IdPaciente);
        formData.append("idAtencion", Variables.IdAtencion);

        return formData;
    },

    CargarVariablesEvaluacionNeonatalDetalle() {
        var formData = new FormData();
        //var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        var objrowTb2 = oTable_EvaEmer.api(true).row('.selected').data();

        //console.log("idusu: " + objrowTb2);
        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();

        //var nroEval = isEmpty(objrowTb2) ? (oTable_EvaEmer.DataTable().data().count() + 1) : objrowTb2.idNumero;

        formData.append('IdAtencion', Variables.IdAtencion);
        formData.append('NroEvaluacion', EvaluacionDetalle.IdNumero);
        formData.append('IdUsuario', isEmpty(objrowTb2) ? 0 : objrowTb2.idUsuario);

        formData.append('FechaInicioAtencion', ConvertirFormatoFecha($('#FechaInicioAtencion').val()));
        formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());

        formData.append('ImpresionDiagnostica', $('#txtImpresionDiagnosticaNeo').val());
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
        if ($("#HoraInicioAtencion").val() == "" || $("#HoraInicioAtencion").val() == "__: __") {
            alerta('2', 'Ingrese la Hora de Inicio de Atención');
            $("#HoraInicioAtencion").focus();
            return false;
        }

        var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        if (ListDiagnosticos.toArray().length == 0 && EvaluacionNeonatal.nuevaEvaluacion == true) {
            alerta('2', 'Ingresa un diagnóstico');
            $('.nav-tabs a[href="#diagnosticos"]').tab('show');
            return false;
        }

        return true;
    },

    ValidarInformeFirmado() {
        var objrowTb = oTable_EvaEmer.api(true).row('.selected').data();

        if (objrowTb.statusFirma == 1) {
            $("#FirmarEvalNeo").hide();
        } else {
            $("#FirmarEvalNeo").show();
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
        var data = EvaluacionNeonatal.CargarVariablesEvaluacionNeonatal();
        var respuesta;
        var resp = false;
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatal/GuardarEvaluacion?area=Emergencia",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                if (datos.estado) {
                    resp = true;
                    alerta(1, 'La evaluación se guardó correctamente.');
                    
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

    async GuardarAntecedentes() {
        //Cargando(1);
        //console.log("GuardarAntecedentes");
        var data = EvaluacionNeonatal.CargarVariablesAntecedentes();
        var respuesta;
        var resp = false;
        let datos
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatal/GuardarRnAntecedentes?area=Emergencia",
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
                    alerta(1, 'Los antecedentes perinatales y nacimiento se guardó correctamente.');
                } else {
                    alerta(2, datos.msj);
                    Cargando(0);
                }
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }

        } catch (error) {
            alerta(3, error);
        }

        //return datos;
        return resp;
    },

    async GuardarExamenNeonatal() {
        //Cargando(1);
        //console.log("GuardarExamenNeonatal");
        var data = EvaluacionNeonatal.CargarVariablesExamenFisicoNeonatal();
        var respuesta;
        var resp = false;
        let datos
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatal/GuardarExamenNeonatal?area=Emergencia",
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
                    alerta(1, 'El examen físico se guardó correctamente.')
                    
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

    async GuardarEvaluacionDetalleNeonatal() {
        //console.lo("ENTROOOOO");
        //Cargando(1);
        //console.log("GuardarEvaluacionDetalleNeonatal");
        var data = EvaluacionNeonatal.CargarVariablesEvaluacionNeonatalDetalle();
        var respuesta;
        var resp = false;
        let datos
        try {
            Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatal/GuardarEvaluacionDetalle?area=Emergencia",
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
                    alerta(1, 'Los detalles de la evaluación se guardó correctamente.');
                    Cargando(0)
                } else {
                    alerta(2, datos.msj);
                    EvaluacionNeonatal.CerrarModuloNeonatal();
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
        EvaluacionNeonatal.nuevaEvaluacion = false;
        EvaluacionNeonatal.modificaEvaluacion = false;

        $("#btnGuardarEvaNeo").hide();

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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// INICIAR SCRIPT Y MODULO
    /// </summary>
    /// Lista de metodos que incian la carga del módulo 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async IniciarModulo() {
        await EvaluacionNeonatal.IniciarScript();
    },

    async IniciarScript() {
        await EvaluacionNeonatal.cargaInicial();
        //EvaluacionNeonatal.initDatables();
        EvaluacionNeonatal.IniciarDataTablesEvaluacion();
        EvaluacionNeonatal.Eventos();
    },

    async cargaInicial() {
        EvaluacionNeonatal.nuevaEvaluacion = false;
        EvaluacionNeonatal.modificaEvaluacion = false;
        //opcionModificar = false;

        await this.ListarTiposGravedadAtencion();
        await this.ListarTiposServiciosMGP();
        await this.ListarOrigenAtencionEmergencia();
        await this.ListarTiposSexo();

        $("#txtOtroSintomas").hide();

        $('#FechaInicioAtencion').datepicker({ 
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


