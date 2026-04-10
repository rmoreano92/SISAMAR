let SeguridadIntervencionCQx = {
    IdSeguridadIntervencion: 0,
    IdAtencion: 0,
    NroEvaluacion: 1,

    async Plugins() {

        $('.maskFecha').datepicker({
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
        $(".maskFecha").mask("Dd/Mm/abcd");


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });


        $('#txtFechaInicioBusqueda').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#txtFechaFinBusqueda').datepicker("setDate", moment().toDate().format('dd/mm/yyyy')); // JDELGADOPM
    },
    DataTableAtenciones: function () {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            scrollY: '45vh',
            responsive: false,

            scrollX: true,
            autoWidth: false,
            destroy: true,
            columns: [
                {
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaIngreso))
                    }
                },
                {
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaEgreso))
                    }
                },
                {
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoFinanciamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoFinanciamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).html('')
                        if (rowData.idSeguridadIntervencion > 0) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },

            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableAtenciones = $("#tblAtenciones").dataTable(parms);
    },
    InitDataTablesEvaluacion() {
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
                    data: "nroEvaluacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "85%",
                    targets: 1,
                    data: "empleadoEvalua",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblEvaluaciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_Evaluacion = $("#tblEvaluaciones").dataTable(parms);
    },


    ListarMedicos: () => {
        let formData = new FormData()

        return HttpClient.Post('/Utilitario/ListarMedicos?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.dataSet.table;

                $('#cboMedicoSolicita').empty();

                $('#cboMedicoPrincipal').empty();
                $('#cboMedicoAyudanteI').empty();
                $('#cboAnestesiologo').empty();
                $('#cboInstrumentistaI').empty();
                $('#cboTecEnfermeria').empty();
                $('#cboCirujanoII').empty();
                $('#cboMedicoAyudanteII').empty();
                $('#cboAyudanteAnestesiologo').empty();
                $('#cboInstrumentistaII').empty();

                if (datos.length > 0) {

                    $('#cboMedicoSolicita').append(`<option value="0">Seleccionar una opcion</option>`)

                    $('#cboMedicoPrincipal').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboMedicoAyudanteI').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboAnestesiologo').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboInstrumentistaI').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboTecEnfermeria').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboCirujanoII').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboMedicoAyudanteII').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboAyudanteAnestesiologo').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboInstrumentistaII').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboMedicoSolicita').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)

                        $('#cboMedicoPrincipal').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboMedicoAyudanteI').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboAnestesiologo').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboInstrumentistaI').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboTecEnfermeria').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboCirujanoII').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboMedicoAyudanteII').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboAyudanteAnestesiologo').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                        $('#cboInstrumentistaII').append(`<option value="${obj.idMedico}">${obj.medico} - (${obj.profesion})</option>`)
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    return true
                } else {
                    console.log("No se encontraron datos.");
                    return false
                }
            } else {
                console.log("La sesión ha expirado.");
                return false
            }
        })
    },
    DevuelveServiciosDelHospitalFiltro: async function () {
        var formData = new FormData();
        formData.append('filtro', ' (1, 2, 3) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre');

        let res = await HttpClient.Post('/Servicios/DevuelveServiciosDelHospitalFiltro?area=Emergencia', formData)

        $('#cboServicioBusqueda').empty();
        if (isEmpty(res)) {
            return
        }

        const servicios = res.data.table;
        if (!isEmpty(servicios)) {
            $(servicios).each((i, obj) => {
                $('#cboServicioBusqueda').append(`<option value="${obj.idServicio}">${obj.dservicio}</option>`);
            });
            $('#cboServicioBusqueda').val(0);
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    TiposClasificacionPaciente: async function () {
        let formData = new FormData()

        let res = await HttpClient.Post('/Atencion/TiposClasificacionPaciente?area=Emergencia', formData)

        $('#cboTipoPaciente').empty();
        if (isEmpty(res)) {
            return
        }

        const data = res.data.table;
        if (!isEmpty(data)) {
            $(data).each((i, obj) => {
                $('#cboTipoPaciente').append(`<option value="${obj.id}">${obj.descripcion}</option>`);
            });
            $('#cboTipoPaciente').val(0);
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },



    ListarAtencionesSeguridadIntervencionCQx: async function (IdCuentaAtencion, NroHistoriaClinica, NroDocumento, ApellidoPaterno, ApellidoMaterno, Nombres, FechaInicio, FechaFin, IdServicio, IdAtencion, NroEvaluacion) {



        let formData = new FormData();
        formData.append('IdCuentaAtencion', IdCuentaAtencion);
        formData.append('NroHistoriaClinica', NroHistoriaClinica);
        formData.append('NroDocumento', NroDocumento);
        formData.append('ApellidoPaterno', ApellidoPaterno);
        formData.append('ApellidoMaterno', ApellidoMaterno);
        formData.append('Nombres', Nombres);
        formData.append('FechaInicio', FechaInicio);
        formData.append('FechaFin', FechaFin);
        formData.append('IdServicio', IdServicio);

        formData.append('IdAtencion', IdAtencion);
        formData.append('NroEvaluacion', NroEvaluacion);

        let res = await HttpClient.Post('/SeguridadIntervencionCQx/ListarAtencionesSeguridadIntervencionCQx', formData)

        if (isEmpty(res)) {
            Cargando(0)
            return
        }

        if (res.data.table.length > 0) {
            return res.data.table
        }

        return null

    },

    CompletarDatosAtencion: async function (data) {

        SeguridadIntervencionCQx.IdSeguridadIntervencion = data.idSeguridadIntervencion
        SeguridadIntervencionCQx.IdAtencion = data.idAtencion
        SeguridadIntervencionCQx.NroEvaluacion = data.nroEvaluacion

        $('#txtNroCuenta').val(data.idCuentaAtencion)
        $('#txtNroHistoria').val(data.nroHistoriaClinica)
        $('#txtNroDocumento').val(data.nroDocumento)
        $('#txtApellidosNombrePaciente').val(data.paciente)
        $('#txtSexo').val(data.sexo)
        $('#txtEdadAnio').val(data.edadAnio)
        $('#txtEdadMes').val(data.edadMes)
        $('#txtEdadDia').val(data.edadADia)
        $('#txtTipoAtencion').val(data.tiposServicio)
        $('#txtServicioActual').val(data.servicioActual)
        $('#txtFechaIngreso').datepicker("setDate", FormatearFecha(data.fechaIngreso));
        $('#txtCodigoCama').val(data.camaActual)

        await this.ListarEvaluaciones(0)

        await this.SeleccionarEvaluacion()
    },

    ListarEvaluaciones: async function (eval) {

        $('#FechaInicioAtencion').datepicker("setDate", getCurrentDate());
        $('#HoraInicioAtencion').val(getCurrentHour());

        Cargando(1)


        oTable_Evaluacion.fnClearTable()

        let res = await SeguridadIntervencionCQx.ListarAtencionesSeguridadIntervencionCQx(IdCuentaAtencion = null, NroHistoriaClinica = null, NroDocumento = '', ApellidoPaterno = '',
            ApellidoMaterno = '', Nombres = '', FechaInicio = null, FechaFin = null, IdServicio = null, SeguridadIntervencionCQx.IdAtencion, eval)

        if (!isEmpty(res)) {
            oTable_Evaluacion.fnAddData(res)
        }

        Cargando(0)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    SeleccionarEvaluacion: async function () {

        let data = null

        let res = await SeguridadIntervencionCQx.ListarAtencionesSeguridadIntervencionCQx(IdCuentaAtencion = null, NroHistoriaClinica = null, NroDocumento = '', ApellidoPaterno = '',
            ApellidoMaterno = '', Nombres = '', FechaInicio = null, FechaFin = null, IdServicio = null, SeguridadIntervencionCQx.IdAtencion, SeguridadIntervencionCQx.NroEvaluacion)

        if (isEmpty(res)) {
            return null
        }

        data = res[0]

        swal({
            title: 'Evaluaciones',
            text: "Se selecciono la Evaluación N° " + (data.nroEvaluacion),
            type: 'info',
        }).done()

        $("#evaluaciones-tab").click()
        $("#lblNumeroEvaluacion").text(`Evaluacion N° ${data.nroEvaluacion}`)

        $('#cboTipoPaciente').val(data.tipoPaciente);
        $('input[name="rdbEstadoPaciente"][value="' + data.estadoPaciente + '"]').prop('checked', true);
        $('input[name="rdbPacienteConoceCirujano"][value="' + data.pacienteConoceCirujano + '"]').prop('checked', true);
        $('input[name="rdbSeMarcoSitioQuirurgico"][value="' + data.seMarcoSitioQuirurgico + '"]').prop('checked', true);

        $('#chkConfirmacionNombreAdultos').prop('checked', data.confirmacionNombreAdultos);
        $('#chkConfirmacionZonaOperatoriaAdultos').prop('checked', data.confirmacionZonaOperatoriaAdultos);
        $('#chkConfirmacionProcedimientoAdultos').prop('checked', data.confirmacionProcedimientoAdultos);
        $('#chkConfirmacionConsentimientoAdultos').prop('checked', data.confirmacionConsentimientoAdultos);

        $('#chkConfirmacionNombreNeonatos').prop('checked', data.confirmacionNombreNeonatos);
        $('#chkConfirmacionZonaOperatoriaNeonatos').prop('checked', data.confirmacionZonaOperatoriaNeonatos);
        $('#chkConfirmacionProcedimientoNeonatos').prop('checked', data.confirmacionProcedimientoNeonatos);
        $('#chkConfirmacionConsentimientoNeonatos').prop('checked', data.confirmacionConsentimientoNeonatos);

        $('#chkOximetroPulsoColocadoFuncionando').prop('checked', data.oximetroPulsoColocadoFuncionando);
        $('#chkAspirador').prop('checked', data.aspirador);
        $('#chkEquipoViaArea').prop('checked', data.equipoViaArea);
        $('#chkMaquinaAnestesiaOperativa').prop('checked', data.maquinaAnestesiaOperativa);
        $('#chkDrogasEmergencia').prop('checked', data.drogasEmergencia);
        $('#chkOxigeno').prop('checked', data.oxigeno);

        $('input[name="rdbAlergiaConocida"][value="' + data.alergiaConocida + '"]').prop('checked', true);
        $('input[name="rdbRiesgoPerdidaSangre"][value="' + data.riesgoPerdidaSangre + '"]').prop('checked', true);
        $('input[name="rdbDificultadesViaArea"][value="' + data.dificultadesViaArea + '"]').prop('checked', true);
        $('input[name="rdbDisponeReposicionSanguinea"][value="' + data.disponeReposicionSanguinea + '"]').prop('checked', true);
        $('input[name="rdbPrevisoDosVias"][value="' + data.previsoDosVias + '"]').prop('checked', true);

        $('input[name="rdbCumplieronProtocoloAsepsiaQuirurgica"][value="' + data.cumplieronProtocoloAsepsiaQuirurgica + '"]').prop('checked', true);
        $('input[name="rdbSePresentaronPorNombreFuncion"][value="' + data.sePresentaronPorNombreFuncion + '"]').prop('checked', true);

        $('#chkNombresPaciente').prop('checked', data.confirmaNombresPaciente);
        $('#chkTiempoOperatorio').prop('checked', data.confirmaTiempoOperatorio);
        $('#chkZonaOperatoria').prop('checked', data.confirmaZonaOperatoria);
        $('#chkPerdidaSanguineaEstimada').prop('checked', data.confirmaPerdidaSanguineaEstimada);
        $('#chkProcedimiento').prop('checked', data.confirmaProcedimiento);

        $('input[name="rdbTuvoSituacionInesperadaActoAnestesico"][value="' + data.tuvoSituacionInesperadaActoAnestesico + '"]').prop('checked', true);

        $('#chkResultadosIndicadoresEsterilizacion').prop('checked', data.resultadosIndicadoresEsterilizacion);
        $('#chkInstrumentalGrasasCompresasAgujas').prop('checked', data.instrumentalGrasasCompresasAgujas);
        $('#chkMaterialInstrumentalEquipoAdicional').prop('checked', data.materialInstrumentalEquipoAdicional);

        $('input[name="rdbConsideracionEspecial"][value="' + data.consideracionEspecial + '"]').prop('checked', true);
        $('input[name="rdbAdministroProfilaxisConAntibioticosUltimos60"][value="' + data.administroProfilaxisConAntibioticos + '"]').prop('checked', true);
        $('input[name="rdbTieneExamenRadiograficoParaExhibir"][value="' + data.tieneExamenRadiograficoParaExhibir + '"]').prop('checked', true);

        $('#chkNombreProcedimientoQuirurgico').prop('checked', data.nombreProcedimientoQuirurgico);
        $('#chkRecuentoInstrumentosGasasCompresasAgujas').prop('checked', data.recuentoInstrumentosGasasCompresasAgujas);
        $('#chkRecomendacionesPostOperatorioInmediata').prop('checked', data.recomendacionesPostOperatorioInmediata);


        $('input[name="rdbMuestraAnatomiaPatologicaRotulada"][value="' + data.muestraAnatomiaPatologicaRotulada + '"]').prop('checked', true);
        $('input[name="rdbProblemasConMaquinaAnestesiaMonitoreo"][value="' + data.problemasConMaquinaAnestesiaMonitoreo + '"]').prop('checked', true);
        $('input[name="rdbEventosIntraoperatoriosImportantes"][value="' + data.eventosIntraoperatoriosImportantes + '"]').prop('checked', true);
        $('input[name="rdbProblemasConInstrumento"][value="' + data.problemasConInstrumento + '"]').prop('checked', true);
        $('#txtObservacionesSalida').val(data.observacionesSalida);

        $('#txtNumeroSolicitud').val(data.numeroSolicitud);
        $('#cboMedicoPrincipal').val(data.medicoPrincipal);
        $('#cboCirujanoII').val(data.cirujanoII);
        $('#cboMedicoAyudanteI').val(data.medicoAyudanteI);
        $('#cboMedicoAyudanteII').val(data.medicoAyudanteII);
        $('#cboAnestesiologo').val(data.anestesiologo);
        $('#cboAyudanteAnestesiologo').val(data.ayudanteAnestesiologo);
        $('#cboInstrumentistaI').val(data.instrumentistaI);
        $('#cboInstrumentistaII').val(data.instrumentistaII);


        $('#FechaInicioAtencion').datepicker("setDate", FormatearFecha(data.fechaInicioAtencion));
        $('#HoraInicioAtencion').val(data.horaInicioAtencion);


        oTable_Evaluacion.$('tr.selected').removeClass('selected');
        $('#tblEvaluaciones tbody tr').eq(data.nroEvaluacion - 1).addClass('selected');


        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    LimpiarCamposFormulario: async function () {
        $('#cboTipoPaciente').val('');
        $('input[name="rdbEstadoPaciente"]').prop('checked', false);
        $('input[name="rdbPacienteConoceCirujano"]').prop('checked', false);
        $('input[name="rdbSeMarcoSitioQuirurgico"]').prop('checked', false);

        $('#chkConfirmacionNombreAdultos').prop('checked', false);
        $('#chkConfirmacionZonaOperatoriaAdultos').prop('checked', false);
        $('#chkConfirmacionProcedimientoAdultos').prop('checked', false);
        $('#chkConfirmacionConsentimientoAdultos').prop('checked', false);

        $('#chkConfirmacionNombreNeonatos').prop('checked', false);
        $('#chkConfirmacionZonaOperatoriaNeonatos').prop('checked', false);
        $('#chkConfirmacionProcedimientoNeonatos').prop('checked', false);
        $('#chkConfirmacionConsentimientoNeonatos').prop('checked', false);

        $('#chkOximetroPulsoColocadoFuncionando').prop('checked', false);
        $('#chkAspirador').prop('checked', false);
        $('#chkEquipoViaArea').prop('checked', false);
        $('#chkMaquinaAnestesiaOperativa').prop('checked', false);
        $('#chkDrogasEmergencia').prop('checked', false);
        $('#chkOxigeno').prop('checked', false);

        $('input[name="rdbAlergiaConocida"]').prop('checked', false);
        $('input[name="rdbRiesgoPerdidaSangre"]').prop('checked', false);
        $('input[name="rdbDificultadesViaArea"]').prop('checked', false);
        $('input[name="rdbDisponeReposicionSanguinea"]').prop('checked', false);
        $('input[name="rdbPrevisoDosVias"]').prop('checked', false);

        $('input[name="rdbCumplieronProtocoloAsepsiaQuirurgica"]').prop('checked', false);
        $('input[name="rdbSePresentaronPorNombreFuncion"]').prop('checked', false);

        $('#chkNombresPaciente').prop('checked', false);
        $('#chkTiempoOperatorio').prop('checked', false);
        $('#chkZonaOperatoria').prop('checked', false);
        $('#chkPerdidaSanguineaEstimada').prop('checked', false);
        $('#chkProcedimiento').prop('checked', false);

        $('input[name="rdbTuvoSituacionInesperadaActoAnestesico"]').prop('checked', false);

        $('#chkResultadosIndicadoresEsterilizacion').prop('checked', false);
        $('#chkInstrumentalGrasasCompresasAgujas').prop('checked', false);
        $('#chkMaterialInstrumentalEquipoAdicional').prop('checked', false);

        $('input[name="rdbConsideracionEspecial"]').prop('checked', false);
        $('input[name="rdbAdministroProfilaxisConAntibioticosUltimos60"]').prop('checked', false);
        $('input[name="rdbTieneExamenRadiograficoParaExhibir"]').prop('checked', false);

        $('#chkNombreProcedimientoQuirurgico').prop('checked', false);
        $('#chkRecuentoInstrumentosGasasCompresasAgujas').prop('checked', false);
        $('#chkRecomendacionesPostOperatorioInmediata').prop('checked', false);

        $('input[name="rdbMuestraAnatomiaPatologicaRotulada"]').prop('checked', false);
        $('input[name="rdbProblemasConMaquinaAnestesiaMonitoreo"]').prop('checked', false);
        $('input[name="rdbEventosIntraoperatoriosImportantes"]').prop('checked', false);
        $('input[name="rdbProblemasConInstrumento"]').prop('checked', false);
        $('#txtObservacionesSalida').val('');

        $('#txtNumeroSolicitud').val('');
        $('#cboMedicoPrincipal').val('');
        $('#cboCirujanoII').val('');
        $('#cboMedicoAyudanteI').val('');
        $('#cboMedicoAyudanteII').val('');
        $('#cboAnestesiologo').val('');
        $('#cboAyudanteAnestesiologo').val('');
        $('#cboInstrumentistaI').val('');
        $('#cboInstrumentistaII').val('');
    },


    Events: function () {
        ////////////////////////////////////// EVENTS BUTTONS //////////////////////////////////////

        $('#btnBuscarAtenciones').on('click', async function () {

            if ($('#txtNroCuentaBusqueda').val() == '' && $('#txtNroHistoriaBusqueda').val() == '' && $('#txtNroDocumentoBusqueda').val() == '' && $('#txtAPaternoBusqueda').val() == '' && $('#txtAMaternoBusqueda').val() == '' &&
                $('#txtNombresBusqueda').val() == '' && $('#txtFechaInicioBusqueda').val() == '' && $('#txtFechaFinBusqueda').val() == '' && isEmpty($('#cboServicioBusqueda').val())) {
                alerta(2, 'Debe ingresar al menos un dato para realizar la búsqueda.');
                return
            }

            Cargando(1)

            let IdCuentaAtencion = $('#txtNroCuentaBusqueda').val()
            let NroHistoriaClinica = $('#txtNroHistoriaBusqueda').val()
            let NroDocumento = $('#txtNroDocumentoBusqueda').val()
            let ApellidoPaterno = $('#txtAPaternoBusqueda').val()
            let ApellidoMaterno = $('#txtAMaternoBusqueda').val()
            let Nombres = $('#txtNombresBusqueda').val()
            let FechaInicio = $('#txtFechaInicioBusqueda').val()
            let FechaFin = $('#txtFechaFinBusqueda').val()
            let IdServicio = $('#cboServicioBusqueda').val()


            oTable_TableAtenciones.fnClearTable()

            let res = await SeguridadIntervencionCQx.ListarAtencionesSeguridadIntervencionCQx(IdCuentaAtencion, NroHistoriaClinica, NroDocumento, ApellidoPaterno, ApellidoMaterno, Nombres, FechaInicio, FechaFin, IdServicio)

            if (!isEmpty(res)) {
                oTable_TableAtenciones.fnAddData(res)
            }

            Cargando(0)
        })
        $('#btnModificarAtencion').on('click', async function () {

            let row = oTable_TableAtenciones.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta2('warning', '', 'Por favor seleccione un registro')
                return
            }

            await SeguridadIntervencionCQx.LimpiarCamposFormulario()

            await SeguridadIntervencionCQx.CompletarDatosAtencion(row)

            MostrarAreaRegistro()
        })
        $('#btnNuevaEvaluacion').on('click', async function () {

            SeguridadIntervencionCQx.LimpiarCamposFormulario(9)

            oTable_Evaluacion.$('tr.selected').removeClass('selected');

            let eval = oTable_Evaluacion.DataTable().data().count();

            SeguridadIntervencionCQx.NroEvaluacion = eval + 1

            $('#FechaInicioAtencion').datepicker("setDate", getCurrentDate());
            $('#HoraInicioAtencion').val(getCurrentHour());

            swal({
                title: 'Evaluaciones',
                text: "Se iniciara con la Evaluación N° " + (SeguridadIntervencionCQx.NroEvaluacion),
                type: 'info',
            }).done()

            Cargando(1)


            //await SeguridadIntervencionCQx.SeleccionarEvaluacion()


            Cargando(0)
        })
        $("#btnCerrarAtencion").on('click', function () {
            swal({
                title: 'Salir',
                text: '¿Estas seguro de  Salir?',
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function () {
                $('#btnBuscarAtenciones').click()
                MostrarAreaLista();         //KHOYOSI
                CerrarModulo();             //KHOYOSI
                oTable_Atenciones.resize();
                
            }).catch(swal.noop);

        });
        $("#btnGuardar").on('click', async function () {

            let formData = new FormData()

            formData.append('IdSeguridadIntervencion', SeguridadIntervencionCQx.IdSeguridadIntervencion)
            formData.append('IdAtencion', SeguridadIntervencionCQx.IdAtencion)
            formData.append('NroEvaluacion', SeguridadIntervencionCQx.NroEvaluacion)

            formData.append('TipoPaciente', $('#cboTipoPaciente').val())
            formData.append('EstadoPaciente', $('input[name="rdbEstadoPaciente"]:checked').val() ?? null)
            formData.append('PacienteConoceCirujano', $('input[name="rdbPacienteConoceCirujano"]:checked').val() ?? null)
            formData.append('SeMarcoSitioQuirurgico', $('input[name="rdbSeMarcoSitioQuirurgico"]:checked').val() ?? null)

            formData.append('ConfirmacionNombreAdultos', $('#chkConfirmacionNombreAdultos').is(':checked'))
            formData.append('ConfirmacionZonaOperatoriaAdultos', $('#chkConfirmacionZonaOperatoriaAdultos').is(':checked'))
            formData.append('ConfirmacionProcedimientoAdultos', $('#chkConfirmacionProcedimientoAdultos').is(':checked'))
            formData.append('ConfirmacionConsentimientoAdultos', $('#chkConfirmacionConsentimientoAdultos').is(':checked'))

            formData.append('ConfirmacionNombreNeonatos', $('#chkConfirmacionNombreNeonatos').is(':checked'))
            formData.append('ConfirmacionZonaOperatoriaNeonatos', $('#chkConfirmacionZonaOperatoriaNeonatos').is(':checked'))
            formData.append('ConfirmacionProcedimientoNeonatos', $('#chkConfirmacionProcedimientoNeonatos').is(':checked'))
            formData.append('ConfirmacionConsentimientoNeonatos', $('#chkConfirmacionConsentimientoNeonatos').is(':checked'))

            formData.append('OximetroPulsoColocadoFuncionando', $('#chkOximetroPulsoColocadoFuncionando').is(':checked'));
            formData.append('Aspirador', $('#chkAspirador').is(':checked'));
            formData.append('EquipoViaArea', $('#chkEquipoViaArea').is(':checked'));
            formData.append('MaquinaAnestesiaOperativa', $('#chkMaquinaAnestesiaOperativa').is(':checked'));
            formData.append('DrogasEmergencia', $('#chkDrogasEmergencia').is(':checked'));
            formData.append('Oxigeno', $('#chkOxigeno').is(':checked'));

            formData.append('AlergiaConocida', $('input[name="rdbAlergiaConocida"]:checked').val() ?? null);
            formData.append('RiesgoPerdidaSangre', $('input[name="rdbRiesgoPerdidaSangre"]:checked').val() ?? null);
            formData.append('DificultadesViaArea', $('input[name="rdbDificultadesViaArea"]:checked').val() ?? null);
            formData.append('DisponeReposicionSanguinea', $('input[name="rdbDisponeReposicionSanguinea"]:checked').val() ?? null);
            formData.append('PrevisoDosVias', $('input[name="rdbPrevisoDosVias"]:checked').val() ?? null);

            formData.append('CumplieronProtocoloAsepsiaQuirurgica', $('input[name="rdbCumplieronProtocoloAsepsiaQuirurgica"]:checked').val() ?? null);
            formData.append('SePresentaronPorNombreFuncion', $('input[name="rdbSePresentaronPorNombreFuncion"]:checked').val() ?? null);

            formData.append('ConfirmaNombresPaciente', $('#chkNombresPaciente').is(':checked'));
            formData.append('ConfirmaTiempoOperatorio', $('#chkTiempoOperatorio').is(':checked'));
            formData.append('ConfirmaZonaOperatoria', $('#chkZonaOperatoria').is(':checked'));
            formData.append('ConfirmaPerdidaSanguineaEstimada', $('#chkPerdidaSanguineaEstimada').is(':checked') ?? null);
            formData.append('ConfirmaProcedimiento', $('#chkProcedimiento').is(':checked'));

            formData.append('TuvoSituacionInesperadaActoAnestesico', $('input[name="rdbTuvoSituacionInesperadaActoAnestesico"]:checked').val() ?? null);

            formData.append('ResultadosIndicadoresEsterilizacion', $('#chkResultadosIndicadoresEsterilizacion').is(':checked'));
            formData.append('InstrumentalGrasasCompresasAgujas', $('#chkInstrumentalGrasasCompresasAgujas').is(':checked'));
            formData.append('MaterialInstrumentalEquipoAdicional', $('#chkMaterialInstrumentalEquipoAdicional').is(':checked'));

            formData.append('ConsideracionEspecial', $('input[name="rdbConsideracionEspecial"]:checked').val() ?? null);
            formData.append('AdministroProfilaxisConAntibioticos', $('input[name="rdbAdministroProfilaxisConAntibioticosUltimos60"]:checked').val() ?? null);
            formData.append('TieneExamenRadiograficoParaExhibir', $('input[name="rdbTieneExamenRadiograficoParaExhibir"]:checked').val() ?? null);

            formData.append('NombreProcedimientoQuirurgico', $('#chkNombreProcedimientoQuirurgico').is(':checked'));
            formData.append('RecuentoInstrumentosGasasCompresasAgujas', $('#chkRecuentoInstrumentosGasasCompresasAgujas').is(':checked'));
            formData.append('RecomendacionesPostOperatorioInmediata', $('#chkRecomendacionesPostOperatorioInmediata').is(':checked'));


            formData.append('MuestraAnatomiaPatologicaRotulada', $('input[name="rdbMuestraAnatomiaPatologicaRotulada"]:checked').val() ?? null);
            formData.append('ProblemasConMaquinaAnestesiaMonitoreo', $('input[name="rdbProblemasConMaquinaAnestesiaMonitoreo"]:checked').val() ?? null);
            formData.append('EventosIntraoperatoriosImportantes', $('input[name="rdbEventosIntraoperatoriosImportantes"]:checked').val() ?? null);
            formData.append('ProblemasConInstrumento', $('input[name="rdbProblemasConInstrumento"]:checked').val() ?? null);
            formData.append('ObservacionesSalida', $('#txtObservacionesSalida').val());


            formData.append('NumeroSolicitud', $('#txtNumeroSolicitud').val());
            formData.append('MedicoPrincipal', $('#cboMedicoPrincipal').val());
            formData.append('CirujanoII', $('#cboCirujanoII').val());
            formData.append('MedicoAyudanteI', $('#cboMedicoAyudanteI').val());
            formData.append('MedicoAyudanteII', $('#cboMedicoAyudanteII').val());
            formData.append('Anestesiologo', $('#cboAnestesiologo').val());
            formData.append('AyudanteAnestesiologo', $('#cboAyudanteAnestesiologo').val());
            formData.append('InstrumentistaI', $('#cboInstrumentistaI').val());
            formData.append('InstrumentistaII', $('#cboInstrumentistaII').val());

            formData.append('FechaInicioAtencion', $('#FechaInicioAtencion').val());
            formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());

            formData.append("idListBar", ObtenerItemListBar());

            let res = await HttpClient.Post('/SeguridadIntervencionCQx/CrearModificarSeguridadIntervencionQuirurgica', formData)

            if (res.estado) {
                let data = res.data.table[0]

                await SeguridadIntervencionCQx.ListarEvaluaciones(0)

                await SeguridadIntervencionCQx.SeleccionarEvaluacion()

                alerta2('success', 'Correcto', `${data.successMessage} <br> Evaluacion N° ${data.nroEvaluacion}`)
            }
            console.log('res', res)

        });

        $('#btnAbrirModalReporte').on('click', function () {
            $('#modalReporte').modal('show')
        })
        //$('#').on('click', function () {
        //    $('#modalReporte').modal('hdie')
        //})
        $('#btnDescargarReporte').on('click', async function () {


            if ($('#txtFechaInicioReporte').val() == '') {
                alerta(2, 'Ingresa la Fecha de Inicio')
                $('#txtFechaInicioReporte').focus()
                return false
            }

            if ($('#txtFechaFinReporte').val() == '') {
                alerta(2, 'Ingresa la Fecha Final')
                $('#txtFechaFinReporte').focus()
                return false
            }

            let formData = new FormData()

            formData.append('FechaInicio', $('#txtFechaInicioReporte').val())
            formData.append('FechaFin', $('#txtFechaFinReporte').val())

            Cargando(1)

            fetch('/SeguridadIntervencionCQx/GenerarReporte?area=Sis', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "Reporte.xlsx"
                    document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                    a.click();
                    a.remove();  //afterwards we remove the element again
                    alerta(1, 'La descarga se realizo con exito.')
                    Cargando(0)
                })
                .catch((e) => {
                    alerta(2, 'Error al descargar documento, intente nuevamente.')
                    Cargando(0)
                })

        })


        ////////////////////////////////////// EVENTS TABLE //////////////////////////////////////

        $('#tblAtenciones').on('click', 'tr', async function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableAtenciones.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
        $('#tblEvaluaciones').on('click', 'tr', async function () {
            oTable_Evaluacion.$('tr.selected').removeClass('selected')
            $(this).addClass('selected')

            let row = oTable_Evaluacion.api(true).row('.selected').data()

            SeguridadIntervencionCQx.NroEvaluacion = row.nroEvaluacion

            Cargando(1)

            await SeguridadIntervencionCQx.SeleccionarEvaluacion()

            Cargando(0)

        })

    }
}


$(document).ready(function () {
    SeguridadIntervencionCQx.Plugins()

    SeguridadIntervencionCQx.DataTableAtenciones()
    SeguridadIntervencionCQx.InitDataTablesEvaluacion()

    SeguridadIntervencionCQx.ListarMedicos()
    SeguridadIntervencionCQx.DevuelveServiciosDelHospitalFiltro()
    SeguridadIntervencionCQx.TiposClasificacionPaciente()

    SeguridadIntervencionCQx.Events()
})