var NotaIngreso = {
    nuevaEvaluacion: false,
    modificaEvaluacion: false,
    modificaCabecera: false,
    idMedicoPrimeraEvaluacion: 0,

    /// <summary>
    /// EVENTOS
    /// </summary>
    /// Carga los eventos que se encargan de la interaccion y acciones en las vistas para el módulo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {

        

        $('#btnEdisipClap').on('click', function () {
            $("#modalClap").modal('show')
        })
       


        $('#btnNuevoRegistro').on('click', function () {
            NotaIngresoRegistrar.ListaNumeroAtencion()

            $("#hdestadoBtn").val(1)
            $("#lblNroAtencion").css("color", "#00cc99")
            swal({
                title: 'Atenciones',
                text: "Paciente iniciara la atencion " + $("#hdIdNumeroSiguiente").val(),
                type: 'info',
            }).done()
        })
        $('#btnguardar').on('click', async function () {
            if (!NotaIngreso.esNeo) {
                const data = await NotaIngresoRegistrar.GuardarEvaluacionHosp()
                console.log(data)
                if (data == true) {
                    console.log("GENERAR RECETAS")
                    const datarec = await Ordenes.GuardarOrdenesMedicas()
                    console.log(datarec)

                    NotaIngreso.ListaPacientesHosp()
                    $('#TabBusqueda').click()
                    //$("#modalNotaIngreso").modal("hide")
                }
            } else {
                NotaIngresoRegistrar.GuardarEvaluacionNeo()
            }
        })
        $("#btncerrar").on('click', function () {
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
                //AdmisionEmergencia.limpiarRecetas()
                //EvaluacionNeonatal.LimpiarModuloNeonatal();
                //AdmisionEmergencia.CerrarModulo();
                //ReposicionarVista();
                //MostrarAreaLista();
                $('#TabBusqueda').click();
            }, function (dimiss) {

            });
        })
        /////////////////////////////////EVENTOS VISOR RECETAS////////////////////////////////////////////////////
        $('#btnVisorRecetasHosp').on('click', async function () {
            var row = oTable_atencionesEmer.api(true).row('.selected').data();
            console.log(row);
            if (typeof row === 'undefined') {
                alerta(2, "Seleccione una evaluación por favor.");
            } else {
                if (isEmpty(OrdenesRecetasMedicas)) {
                    alerta(2, "No existen recetas para esta evaluación.");
                } else {
                    VisorReceta.AbrirVisorRecetas(OrdenesRecetasMedicas);
                }
            }
            //console.log(OrdenesRecetas);            
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        $("#btnHistorial").on('click', function () {

            SeguimientoPaciente.limpiaDatos();
            var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
            HistorialEvaluacionesHosp.llendaDatos(objrow.nroHistoriaClinica, 0)

            $("#modalHistorial").modal('show');
        })
        $("#btnCerrarHistorial").on('click', function () {
            $("#modalHistorial").modal('hide');
        })
        $('#btnImprimeInformeSF').on('click', async function () {

            var objrowTb = oTable_EvaHosp.api(true).row('.selected').data();
            var objrowTb2 = oTable_atencionesEmer.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.');
                return false;
            } else {
                Cargando(1)
                var tipo = 'HOSPNI';
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(objrowTb.code)

                if (typeof firma === 'undefined') {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                    const pdf = await Utilitario.GenerarHojaEvaluacionNI(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero);
                    if (pdf) {
                        alerta('1', 'Se generó el documento correctamente.')
                        NotaIngresoRegistrar.ListaEvaluaciones()
                        $("#btnBuscarAtenciones").click();
                    } else {
                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                    }
                } else {
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }
                Cargando(0)
            }
        });

        $('#btnFirmaNotaIngreso').on('click', async function () {
            let objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
            let objrowTb2 = oTable_EvaHosp.api(true).row('.selected').data();

            console.log(objrowTb2, 'objrowTb')
            console.log(objrowTb2, 'objrowTb2')

            await Utilitario.AbrirServicioFirmaBit4Id(objrowTb2.code);

            //Utilitario.AbrirServicioFirmaBit4Id(objrowTb2.idCuentaAtencion, objrowTb2.idCuentaAtencion, 'HOSPNI-' + objrowTb2.idNumero)
        });
        $('#btnDocumentoFirmadoNotaIngreso').on('click', async function () {
            let objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
            let objrowTb2 = oTable_EvaHosp.api(true).row('.selected').data();

            console.log(objrowTb2, 'objrowTb')
            console.log(objrowTb2, 'objrowTb2')

            await Utilitario.AbrirDocumentoFirmadoBit4Id(objrowTb2.code)
        });

        $("#cboTipoEmbrazo").on('change', function () {
            NotaIngresoRegistrar.BloqueaFetos();
        });

        $('#tblEvaluaciones tbody').on('click', 'tr', async function () { // -M

            oTable_EvaHosp.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var pos = oTable_EvaHosp.api(true).row($(this)).index();
            var row = oTable_EvaHosp.fnGetData(pos);

            Cargando(1)

            if (row.length != 0) {

                if (row.idUsuario != $('#hdIdUsuarioActual').val()) {
                    swal({
                        title: 'Nota de ingreso',
                        text: "Esta evaluacion solo puede ser modificada por: " + row.usuario,
                        type: 'warning',
                    }).done();
                    $('.div_bloquea').show()
                    $('#btnguardar').hide()
                } else {
                    $('.div_bloquea').hide()
                    $('#btnguardar').show()
                }

                await ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(row.idCuentaAtencion)

                await Diagnosticos.SeleccionarDiagnosticosPorEvaluacion(row.idAtencion, row.idServicio, row.idNumero, 2);
                await Ordenes.SeleccionarRecetasCabeceraPorNroEvaluacion(row.idCuentaAtencion, row.idTipoFinanciamiento, row.idNumero, row.idServicio, row.idMedico)

                await Triaje.listaTriajeEmgHosp(row.idAtencion, row.idServicio, row.idNumero)
                await asigna_FechaHoraAtencion(row.fechaRegistro)

                $('#hdIdNumero').val(row.idNumero);
                $('#hdestadoBtn').val(0);
                $('#hdNroEvaluacion').val(row.idNumero) // jdelgado para agregar recetas






                NotaIngresoRegistrar.CargaDatosEvaluacion(row.idAtencion, row.idNumero, pos);
                NotaIngresoRegistrar.CargarDatosEvaluacionHospi(row.idAtencion, row.idServicio, row.idNumero)


                //////await NotaIngresoRegistrar.AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso(row.idAtencion, , ) // -C
                //////await NotaIngresoRegistrar.ListaRecetas(row.idCuentaAtencion, , row.idNumero, , )






                //if (isEmpty(row.code)) {
                //    $('#btnDescargaGineObstetra').css("visibility", 'hidden')
                //    $('#btnGeneraGineObstetra').css("visibility", 'visible')
                //} else if (row.statusFirma == 0) {
                //    $('#btnGeneraGineObstetra').css("visibility", 'visible')
                //    $('#btnDescargaGineObstetra').css("visibility", 'visible')
                //} else if (row.statusFirma == 1) {
                //    $('#btnGeneraGineObstetra').css("visibility", 'hidden')
                //    $('#btnDescargaGineObstetra').css("visibility", 'visible')
                //}

                ////if (row.idNumero > 1) { // JDELGADO001.2
                ////    bloquearCampos()
                ////} else {
                ////    desbloquearCampos()
                ////}

                //var objrowPc = oTable_atencionesEmer.api(true).row('.selected').data();

                //NotaIngresoRegistrar.ListaEvalEmergenciaDetalleByServicioByNumero(row.idAtencion, row.idServicio, row.idNumero) // JDELGADO001.2


                //if (NotaIngreso.esNeo) {
                //    //this.CargarDatosEvaluacionNeo()
                //    ////$("#motivo-tab").click();
                //    ////$("#btnGuardarEvaNeo").show();
                //    ////$("#btnNuevoRegistro").show();
                //    //EvaluacionEmergencia.DesbloquearCampos();
                //} else {
                //    
                //}

                //
            }

            Cargando(0)
        });

        $('#btnCerraEstablecimientoBuscarUci').on('click', function () {
            $('#modalEstablecimientosUciBuscar').modal('hide')
        })
    },


    /// <summary>
    /// DATATABLES
    /// </summary>
    /// INICIALIZA DATA TABLE DE EVALAUACIONES
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    InitDatablesEvaluaciones: () => {

        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "idNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '90%',
                    targets: 1,
                    data: 'medico',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblEvaluaciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_EvaHosp = $("#tblEvaluaciones").dataTable(parms);

    },


    GenerarFormatoPiePagina: async function (idCuentaAtencion) {

        var url = "/AdmisionHospitalizacion/GenerarFormatoPiePagina?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion
        //$('#ifrmTicketCita').attr('src', url)
        newIframe.src = url;
    },

    /// <summary>
    /// LLENAR COMBOS
    /// </summary>
    /// Metodos que llenan combos.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ListaTiposEmb() {

        $.ajax({
            async: false,
            cache: false,
            url: "/Atencion/ListaTipoDeEmbarazo?area=ConsultaExterna",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboTipoEmbrazo').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoEmbrazo').append('<option  value="' + obj.id + '">' + obj.nombre + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar tiposEmbarazo!", "2");
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
        NotaIngreso.CargarEvaluacion();
        NotaIngreso.DesbloquearCampos();
        //$("#btnGuardarEva").hide();
        //console.log("ENTROO");
    },

    ConsultarEvaluacion() {
        NotaIngreso.CargarEvaluacion();
        NotaIngreso.BloquearCampos();
        //console.log("ENTROO");
    },

    CargarEvaluacion() {
        //opcionModificar = true;
        //var objrow = oTable_atencionesEmer.api(true).row('.selected').data();

        //this.LimpiarModal();
        //this.HabilitarModal();
        AdmisionHospitalizacion.limpiarRecetas()
        NotaIngreso.LimpiarModuloEmergencia();
        //Triaje.listaTriajeEmgHosp(objrow.idAtencion, objrow.idServicioEgreso, 0);
        NotaIngreso.CargarDatosEvaluacion();
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
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// <summary>
    /// INICIAR SCRIPT Y MODULO
    /// </summary>
    /// Lista de metodos que incian la carga del módulo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async IniciarModulo() {
        await NotaIngreso.IniciarScript();
    },

    async IniciarScript() {
        //EvaluacionNeonatal.initDatables();
        NotaIngreso.CargaInicial();
        NotaIngreso.InitDatablesEvaluaciones();
        NotaIngreso.Eventos();


    },

    CargaInicial() {
        NotaIngreso.nuevaEvaluacion = false;
        NotaIngreso.modificaEvaluacion = false;
        NotaIngreso.modificaCabecera = false;

        NotaIngreso.ListaTiposEmb();

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


}

$(document).ready(() => {
    EvaluacionGinecoObstetra.InitDatablesEstablecimientos();
})