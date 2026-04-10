let EvaluacionesUCI = {
    accion: '',

    Plugins: () => {
        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: false })
        $(".chzn-select-deselect,#select2_sample").chosen()
        $('.chzn-select').chosen().trigger("chosen:updated")

        $('#txtFechaAtencion, #txtFechaInicioReporte, #txtFechaFinReporte').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        Transferencias.tipoServicio = 'UCI';
        AltaMedica.tipoServicio = "UCI";
        AltaMedica.EventosInicial();

        EstablecimientosSalud.IniciarScript()

    },

    IniciarCamposPorDefecto: () => {
        $('#rdbDiabetesFamiliarSi').prop('checked', false)
        $('#rdbDiabetesFamiliarNo').prop('checked', true)
        $('#rdbTBCFamiliarSi').prop('checked', false)
        $('#rdbTBCFamiliarNo').prop('checked', true)
        $('#rdbHipertensionFamiliarSi').prop('checked', false)
        $('#rdbHipertensionFamiliarNo').prop('checked', true)
        $('#rdbMeoplasicoCancerFamiliarSi').prop('checked', false)
        $('#rdbMeoplasicoCancerFamiliarNo').prop('checked', true)
        $('#rdbEnfTiroideaFamiliarSi').prop('checked', false)
        $('#rdbEnfTiroideaFamiliarNo').prop('checked', true)
        $('#rdbEnfReumaticaFamiliarSi').prop('checked', false)
        $('#rdbEnfReumaticaFamiliarNo').prop('checked', true)
        $('#rdbAsmaFamiliarSi').prop('checked', false)
        $('#rdbAsmaFamiliarNo').prop('checked', true)
        $('#rdbOtrosFamiliarSi').prop('checked', false)
        $('#rdbOtrosFamiliarNo').prop('checked', true)

        $('#rdbVacunaInfluenzaSi').prop('checked', false)
        $('#rdbVacunaInfluenzaNo').prop('checked', true)
        $('#rdbVacunaDTAdultoSi').prop('checked', false)
        $('#rdbVacunaDTAdultoNo').prop('checked', true)
        $('#rdbVacunaTexoideTetanicoSi').prop('checked', false)
        $('#rdbVacunaTexoideTetanicoNo').prop('checked', true)
        $('#rdbVacunaFiebreAmarillaSi').prop('checked', false)
        $('#rdbVacunaFiebreAmarillaNo').prop('checked', true)
        $('#rdbVacunaHepatitisBSi').prop('checked', false)
        $('#rdbVacunaHepatitisBNo').prop('checked', true)
        $('#rdbVacunaBCGSi').prop('checked', false)
        $('#rdbVacunaBCGNo').prop('checked', true)
        $('#rdbVacunaPapilomavirusSi').prop('checked', false)
        $('#rdbVacunaPapilomavirusNo').prop('checked', true)
        $('#rdbVacunaOtraSi').prop('checked', false)
        $('#rdbVacunaOtraNo').prop('checked', true)

        $('#rdbBebidasAlcoholicasHabNocSi').prop('checked', false)
        $('#rdbBebidasAlcoholicasHabNocNo').prop('checked', true)
        $('#rdbDrogasHabNocSi').prop('checked', false)
        $('#rdbDrogasHabNocNo').prop('checked', true)
        $('#rdbTabacoCigarrosHabNocSi').prop('checked', false)
        $('#rdbTabacoCigarrosHabNocNo').prop('checked', true)
        $('#rdbOtrosHabNocSi').prop('checked', false)
        $('#rdbOtrosHabNocNo').prop('checked', true)

        $('#rdbFarmacologicasAlerSi').prop('checked', false)
        $('#rdbFarmacologicasAlerNo').prop('checked', true)
        $('#rdbAlimentacionAlerSi').prop('checked', false)
        $('#rdbAlimentacionAlerNo').prop('checked', true)
        $('#rdbOtrosAlerSi').prop('checked', false)
        $('#rdbOtrosAlerNo').prop('checked', true)

        $('#rdbCirugiasPreviasQuirurSi').prop('checked', false)
        $('#rdbCirugiasPreviasQuirurNo').prop('checked', true)

        $('#rdbGEyBUSSi').prop('checked', false)
        $('#rdbGEyBUSNo').prop('checked', true)
        $('#rdbVaginaSi').prop('checked', false)
        $('#rdbVaginaNo').prop('checked', true)
        $('#rdbCervixSi').prop('checked', false)
        $('#rdbCervixNo').prop('checked', true)
        $('#rdbrdbUteroSi').prop('checked', false)
        $('#rdbrdbUteroNo').prop('checked', true)
        $('#rdbAnexosSi').prop('checked', false)
        $('#rdbAnexosNo').prop('checked', true)
        $('#rdbFSDouglasSi').prop('checked', false)
        $('#rdbFSDouglasNo').prop('checked', true)
        $('#rdbParametriosSi').prop('checked', false)
        $('#rdbParametriosNo').prop('checked', true)
        $('#rdbMamasSi').prop('checked', false)
        $('#rdbMamasNo').prop('checked', true)

        
    },

    ListarAtenciones: async () => {
        Cargando(1)
        let atenciones = await EvaluacionesUCI.ListaAtencionesUCI(
            IdCuentaAtencion = $('#txtNroCuentaBusqueda').val(), NroHistoria = $('#txtNroHistoriaBusqueda').val(), ApellidoPaterno = $('#txtAPaternoBusqueda').val(),
            ApellidoMaterno = $('#txtAMaternoBusqueda').val(), Nombres = $('#txtNombresBusqueda').val(), FechaIngreso = $('#txtFechaAtencion').val(), IdServicio = $('#cboConsultorio').val())

        oTable_AtencionesUCI.fnClearTable()

        if (!isEmpty(atenciones.table)) {
            if (atenciones.table.length > 0) {
                oTable_AtencionesUCI.fnAddData(atenciones.table)
            } else {
                alerta(2, 'No hay atenciones para los datos ingresados')
            }
        }
        Cargando(0)
    },


    ListaAtencionesUCI: async (IdCuentaAtencion, NroHistoria, ApellidoPaterno, ApellidoMaterno, Nombres, FechaIngreso, IdServicio) => {
        let formData = new FormData()

        formData.append('IdCuentaAtencion', IdCuentaAtencion)
        formData.append('NroHistoria', NroHistoria)
        formData.append('ApellidoPaterno', ApellidoPaterno)
        formData.append('ApellidoMaterno', ApellidoMaterno)
        formData.append('Nombres', Nombres)
        formData.append('FechaIngreso', FechaIngreso)
        formData.append('IdServicio', IdServicio)
        return HttpClient.Post('/EvaluacionesUCI/ListaAtencionesUCI?area=Hospitalizacion', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }

            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },


    ServicioSeleccionarPorTipoServicioYEspecialidad: async (idTipoServicio) => {
        let data = await Utilitario.ServicioSeleccionarPorTipoServicio(idTipoServicio)
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboConsultorio').empty()
                $('#cboConsultorio').append('<option  value="0">--Seleccionar--</option>')
                $(data.table).each(function (i, obj) {
                    //console.log('obj', obj)
                    if (obj.idEspecialidad == 13 || obj.idEspecialidad == 14) {
                        $('#cboConsultorio').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
                    }
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },
    


    ListarPaises: async () => {
        let data = await Utilitario.ListarPaises()
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboNacionalidad').empty()
                $('#cboNacionalidad').append('<option  value="0">--Seleccionar--</option>')
                $(data.table).each(function (i, obj) {
                    console.log()
                    $('#cboNacionalidad').append('<option  value="' + obj.idPais + '">' + obj.descripcionLarga + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },
    ListaTiposEstadoCivilTodosV2: async () => {
        let data = await Utilitario.ListaTiposEstadoCivilTodosV2()
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboEstadoCivil').empty()
                $('#cboEstadoCivil').append('<option  value="0">--Seleccionar--</option>')
                $(data.table).each(function (i, obj) {
                    console.log()
                    $('#cboEstadoCivil').append('<option  value="' + obj.idEstadoCivil + '">' + obj.dCorto + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },
    TiposGradoInstruccionTodosV2: async () => {
        let data = await Utilitario.TiposGradoInstruccionTodosV2()
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboGradoInstruccion').empty()

                $(data.table).each(function (i, obj) {
                    console.log()
                    $('#cboGradoInstruccion').append('<option  value="' + obj.idGradoInstruccion + '">' + obj.dCorto + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },

    TiposGradoInstruccionTodosV2: async () => {
        let data = await Utilitario.TiposGradoInstruccionTodosV2()
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboGradoInstruccion').empty()
                $('#cboGradoInstruccion').append('<option  value="0">--Seleccionar--</option>')
                $(data.table).each(function (i, obj) {
                    console.log()
                    $('#cboGradoInstruccion').append('<option  value="' + obj.idGradoInstruccion + '">' + obj.dCorto + '</option>')
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },

    ServicioSeleccionarPorTipoServicio: async (idTipoServicio) => {
        let data = await Utilitario.ServicioSeleccionarPorTipoServicio(idTipoServicio)
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboProcedenciaServicio').empty()
                $('#cboProcedenciaServicio').append('<option  value="0">--Seleccionar--</option>')
                $(data.table).each(function (i, obj) {
                    $('#cboProcedenciaServicio').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
                });

                $('#cboProcedenciaServicio').val(RegistroEvaluacionesUCI.EstablecimientoProcedenciaInstitucional)

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },

    EstablecimientosSeleccionarTodos: async () => {
        let data = await Utilitario.EstablecimientosSeleccionarTodosV2()
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboProcedenciaHospital').empty()
                $('#cboProcedenciaHospital').append('<option  value="0">--Seleccionar--</option>')
                $(data.table).each(function (i, obj) {
                    console.log()
                    $('#cboProcedenciaHospital').append('<option  value="' + obj.idEstablecimiento + '">' + obj.codigo + '-' + obj.nombre + '</option>')
                });

                $('#cboProcedenciaHospital').val(RegistroEvaluacionesUCI.EstablecimientoProcedenciaReferido)

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },


    InitDatablesAtencionesUCI() {

        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '80vh',
            scrollCollapse: true,
            bFilter: false,
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
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "cama",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 4,
                    data: "fechaIngreso2",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.fechaEgresoAdministrativo + ' ' + rowData.horaEgresoAdministrativo);

                    }
                },
                {
                    width: '8%',
                    targets: 6,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 7,
                    data: "servicioEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 8,
                    data: "planA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 9,
                    data: "cantidadEvaluaciones",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                    }
                },
                {
                    width: '8%',
                    targets: 10,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        let estado = await ConsumoServicio.verificarEstadosCuenta(rowData.idCuentaAtencion, 1);

                        $(td).html(estado.descripcionEstado);

                    }
                },
                {
                    width: '5%',
                    targets: 11,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        let estado = await ConsumoServicio.verificarEstadosCuenta(rowData.idCuentaAtencion, 1);

                        if (rowData.cantidadEvaluaciones > 0) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (estado.estado != 1) {
                            $(td).parent().css('color', '#c76d14');
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

                        if (!isEmpty(rowData.fechaEgresoAdministrativo)) {
                            $(td).parent().css('color', '#00ad15');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        //var rutaBit4Id = "";

                        if (rowData.cantidadEvaluaciones > 0) {
                            //btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            //if (rowData.code != '0') {
                            //    if (rowData.statusFirma == 1) {
                            //        btnImprimeSinF = "";
                            //        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                            //    } else {
                            //        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                            //    }
                            //}

                            btnRuta = ' <button class="btnInformeEvaluacion btn btn-sm btn-pink glow_button" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            $(td).html(btnRuta);


                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html("");
                        }
                        
                    }
                },
                {
                    width: '10%',
                    targets: 12,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";


                        //const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");
                        if (rowData.codeInformeMedico != '0') {
                            btnImprimeSinF = '<button class="ImprimeAltaSF btn btn-sm btn-warning glow_button" title="Visualiza Alta" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.statusFirmaInformeMedico == 1) {
                                btnImprimeSinF = "";
                                btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeAltaCF" title="Imprime Alta Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarAltaSF" title="Firmar Alta" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                            }
                        }

                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);

                    }
                }
            ]
        }

        var tableWrapper = $('#tblAtencionesUCI'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_AtencionesUCI = $("#tblAtencionesUCI").dataTable(parms);
    },
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
                    width: "30%",
                    targets: 1,
                    data: "fechaEvaluacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.fechaEvaluacion + ' ' + rowData.horaEvaluacion);
                    }
                },
                {
                    width: "40%",
                    targets: 2,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "20%",
                    targets: 3,
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

        var tableWrapperInf= $('#tblInformeEvaluaciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_EvaInf = $("#tblInformeEvaluaciones").dataTable(parms);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    InitDatablesNeurologicoSedantes() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '50vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    data: "idItem",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 2,
                    data: "idMedida",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "medida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "velocidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]
        }

        var tableWrapper = $('#tblNeurologicoSedantes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_NeurologicoSedantes = $("#tblNeurologicoSedantes").dataTable(parms);
    },
    InitDatablesNeurologicoAnalgesicos() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '50vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    data: "idItem",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 2,
                    data: "idMedida",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "medida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "velocidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]
        }

        var tableWrapper = $('#tblNeurologicoAnalgesicos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_NeurologicoAnalgesicos = $("#tblNeurologicoAnalgesicos").dataTable(parms);
    },
    InitDatablesNeurologicoRelajanteNeuromuscular() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '50vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    data: "idItem",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 2,
                    data: "idMedida",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "medida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "velocidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]
        }

        var tableWrapper = $('#tblNeurologicoRelajanteNeuromuscular'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_NeurologicoRelajanteNeuromuscular = $("#tblNeurologicoRelajanteNeuromuscular").dataTable(parms);
    },
    InitDatablesCardioVasoconstrictor() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '50vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    data: "idItem",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '70%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 2,
                    data: "idMedida",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "medida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "velocidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]
        }

        var tableWrapper = $('#tblCardioVasoconstrictor'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_CardioVasoconstrictor = $("#tblCardioVasoconstrictor").dataTable(parms);
    },
    InitDatablesCardioVasodilatador() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '50vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    data: "idItem",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '70%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 2,
                    data: "idMedida",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "medida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "velocidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]
        }

        var tableWrapper = $('#tblCardioVasodilatador'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_CardioVasodilatador = $("#tblCardioVasodilatador").dataTable(parms);
    },

    InitDatablesIntervencionesHemoderivado() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '50vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    data: "idIntervencionesItem",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '70%',
                    targets: 1,
                    data: "descripcionIntervencionesItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '30%',
                    targets: 2,
                    data: "nroUnidades",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblIntervencionesHemoderivado'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_IntervencionesHemoderivado = $("#tblIntervencionesHemoderivado").dataTable(parms);
    },
    InitDatablesIntervencionesCorticoide() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '50vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    data: "idIntervencionesItem",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "descripcionIntervencionesItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "horario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblIntervencionesCorticoide'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_IntervencionesCorticoide = $("#tblIntervencionesCorticoide").dataTable(parms);
    },
    InitDatablesIntervencionesFluidoterapia() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '50vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    data: "idIntervencionesItem",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "descripcionIntervencionesItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "volumen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblIntervencionesFluidoterapia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_IntervencionesFluidoterapia = $("#tblIntervencionesFluidoterapia").dataTable(parms);
    },

    InitDatablesAccesosVasculares() {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '50vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    data: "idTipoAcceso",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "tipoAcceso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 0,
                    data: "idUbicacion",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '30%',
                    targets: 1,
                    data: "ubicacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '50%',
                    targets: 2,
                    data: "cambios",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblAccesosVasculares'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_AccesosVasculares = $("#tblAccesosVasculares").dataTable(parms);
    },

    EventosIniciales() {
        $('#btnBuscarAtenciones').on('click', async function () {

            //if ($('#txtFechaAtencion').val() == '') {
            //    alerta(2, 'Ingresa la fecha de busqueda')
            //    return false
            //}

            //if ($('#cboConsultorio').val() == 0) {
            //    alerta(2, 'Selecciona el consultorio')
            //    return false
            //}


            EvaluacionesUCI.ListarAtenciones();

        })
        $('#btnModificarAtencion').on('click', async function () {
            let objRowAtencion = oTable_AtencionesUCI.api(true).row('.selected').data()

            OrdenMedica.accion = 'M'
            console.log('objRowAtencion', objRowAtencion)

            if (!isEmpty(objRowAtencion.fechaEgreso) || !isEmpty(objRowAtencion.fechaEgresoAdministrativo)) {
                alerta(2, 'El paciente tiene alta.')
                return false
            }

            //if (objRowAtencion.idEstadoAtencion == 2) {
            //    alerta(2, 'El cuenta se encuentra cerrada.')
            //    return false
            //}

            let estado = await ConsumoServicio.verificarEstadosCuenta(objRowAtencion.idCuentaAtencion, 1);

            if (estado.estado != 1) {
                swal({
                    title: 'Atenciones',
                    //text: `Verificar cuenta \n
                    //        Estado: ${estado.estado} - ${estado.descripcionEstado}  \n
                    //        Servicio actual: ${objrowTb.servicioActual}`,
                    text: `Verificar cuenta \n
                            Estado: ${estado.estado} - ${estado.descripcionEstado}  \n`,
                    type: 'info',
                }).done();
                return false;
            }

            Cargando(1)
            await EvaluacionesUCI.CargarModulo('uci');
            await EvaluacionesUCI.IniciarModulo();

            RegistroEvaluacionesUCI.idCuentaAtencion = 0
            RegistroEvaluacionesUCI.idAtencion = 0
            RegistroEvaluacionesUCI.idAtencionUCI = 0
            RegistroEvaluacionesUCI.IdAtencionDetalleUCI = 0
            RegistroEvaluacionesUCI.IdServicio = 0

            RegistroEvaluacionesUCI.nroEvaluacion = 0

            RegistroEvaluacionesUCI.EstablecimientoProcedenciaReferido = 0
            RegistroEvaluacionesUCI.EstablecimientoProcedenciaInstitucional = 0

            Variables.Cargar(objRowAtencion)

            /////////RESULTADOS LABORATORIO////////////////
            Resultados.IniciarScript();
            ////////////////////////////////////////

            await RegistroEvaluacionesUCI.CompletarDatosRegistro(objRowAtencion)
            Cargando(0)
            MostrarAreaRegistro();

        })

        $('#btnConsultarAtencion').on('click', async function () {
            let objRowAtencion = oTable_AtencionesUCI.api(true).row('.selected').data()

            OrdenMedica.accion = 'C'
            console.log('objRowAtencion', objRowAtencion)

            //if (!isEmpty(objRowAtencion.fechaEgreso) || !isEmpty(objRowAtencion.fechaEgresoAdministrativo)) {
            //    alerta(2, 'El paciente tiene alta.')
            //    return false
            //}

            ////if (objRowAtencion.idEstadoAtencion == 2) {
            ////    alerta(2, 'El cuenta se encuentra cerrada.')
            ////    return false
            ////}

            //let estado = await ConsumoServicio.verificarEstadosCuenta(objRowAtencion.idCuentaAtencion, 1);

            //if (estado.estado != 1) {
            //    swal({
            //        title: 'Atenciones',
            //        //text: `Verificar cuenta \n
            //        //        Estado: ${estado.estado} - ${estado.descripcionEstado}  \n
            //        //        Servicio actual: ${objrowTb.servicioActual}`,
            //        text: `Verificar cuenta \n
            //                Estado: ${estado.estado} - ${estado.descripcionEstado}  \n`,
            //        type: 'info',
            //    }).done();
            //    return false;
            //}

            Cargando(1)
            await EvaluacionesUCI.CargarModulo('uci');
            await EvaluacionesUCI.IniciarModulo();

            RegistroEvaluacionesUCI.idCuentaAtencion = 0
            RegistroEvaluacionesUCI.idAtencion = 0
            RegistroEvaluacionesUCI.idAtencionUCI = 0
            RegistroEvaluacionesUCI.IdAtencionDetalleUCI = 0
            RegistroEvaluacionesUCI.IdServicio = 0

            RegistroEvaluacionesUCI.nroEvaluacion = 0

            RegistroEvaluacionesUCI.EstablecimientoProcedenciaReferido = 0
            RegistroEvaluacionesUCI.EstablecimientoProcedenciaInstitucional = 0

            Variables.Cargar(objRowAtencion)

            /////////RESULTADOS LABORATORIO////////////////
            Resultados.IniciarScript();
            ////////////////////////////////////////

            await RegistroEvaluacionesUCI.CompletarDatosRegistro(objRowAtencion)
            Cargando(0)
            MostrarAreaRegistro();

        })

        $('#tblAtencionesUCI tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_AtencionesUCI.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_AtencionesUCI.api(true).row($(this)).index();
            var row = oTable_AtencionesUCI.fnGetData(pos);

            console.log('row', row)

        });

        $('#tblAtencionesUCI tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = oTable_AtencionesUCI.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_AtencionesUCI.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                if (typeof row.usaModuloMaterno === 'undefined') {
                    alerta(2, "Seleccione Fila");
                } else {

                    const pdf = await Utilitario.GenerarHojaInformeUCI(row.idCuentaAtencion, row.idAtencion, row.idRegistro, row.idServicio, 1);

                    if (pdf) {
                        alerta('1', 'Se generó el documento correctamente.')
                        $("#btnBuscarAtenciones").click();
                    } else {
                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                    }
                }


            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });

        $('#tblAtencionesUCI tbody').on('click', '.btnInformeEvaluacion', async function () {
            var objrow = oTable_AtencionesUCI.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_AtencionesUCI.fnGetData(objrow)

            RegistroEvaluacionesUCI.idAtencion = row.idAtencion;
            RegistroEvaluacionesUCI.IdServicio = row.idServicioEgreso;
            //await AdmisionEmergencia.SeleccionarEvaluacionDetalle(AdmisionEmergencia.IdAtencion, AdmisionEmergencia.IdServicioEgreso);
            //await AdmisionEmergencia.SeleccionarEvaluacionDetalle(AdmisionEmergencia.IdAtencion, 0);

            let evaluacionesUCI = await RegistroEvaluacionesUCI.ListarAtencionesEvaluacionDetalleUCIByIdAtencionUCI(row.idAtencionUCI)

            oTable_EvaInf.fnClearTable()

            if (!isEmpty(evaluacionesUCI)) {
                if (evaluacionesUCI.length > 0) {

                    oTable_EvaInf.fnAddData(evaluacionesUCI)

                } else {
                }
            }

            $("#modalInformeEvaluacion").modal("show");
        });

        $('#btnAbrirModalReporteUCI').on('click', async function () {


            $('#modalReporteUCI').modal('show')

        })

        $('#btnAbrirModalReporteUCI').on('click', async function () {


            $('#modalReporteUCI').modal('show')

        })

        $('#btnDescargarReporteUCI').on('click', async function () {


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

            fetch('/EvaluacionesUCI/GenerarReporteUCI', {
                method: "POST",
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al generar el reporte');
                    }
                    return response.blob();
                })
                .then(blob => {
                    // Crear un objeto URL para el blob
                    const url = window.URL.createObjectURL(blob);

                    // Crear un enlace <a> para iniciar la descarga
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ReporteUCIM.csv'; // Nombre de archivo sugerido
                    document.body.appendChild(a);

                    // Hacer clic en el enlace para iniciar la descarga
                    a.click();

                    // Limpiar el objeto URL y eliminar el enlace
                    window.URL.revokeObjectURL(url);
                    a.remove();
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        })
    },

    Events: async () => {
        

        $("#btnCerrarInformeEvaluacion").on('click', function () {
            //AdmisionEmergencia.IdAtencion = 0;
            //AdmisionEmergencia.IdServicioEgreso = 0;
            $("#modalInformeEvaluacion").modal("hide");
        });

        $('#txtEFisicoPA').on('focusout', function () {
            if ($('#txtEFisicoPA').val() != '' && $('#txtEFisicoPAD').val() != '') {
                $('#txtEFisicoPAM').val((((2 * parseFloat($('#txtEFisicoPAD').val())) + parseInt($('#txtEFisicoPA').val())) / 3).toFixed(2) )
            }
            if ($('#txtAuxPresionOncoticaPo').val() != '' && $('#txtEFisicoPAM').val() != '') { // Índice de Briones
                $('#txtAuxIndiceBriones').val((parseFloat($('#txtAuxPresionOncoticaPo').val()) / parseFloat($('#txtEFisicoPAM').val())).toFixed(3))
            }
        })
        $('#txtEFisicoPAD').on('focusout', function () {
            if ($('#txtEFisicoPA').val() != '' && $('#txtEFisicoPAD').val() != '') {
                $('#txtEFisicoPAM').val((((2 * parseFloat($('#txtEFisicoPAD').val())) + parseInt($('#txtEFisicoPA').val())) / 3).toFixed(2))
            }
            if ($('#txtAuxPresionOncoticaPo').val() != '' && $('#txtEFisicoPAM').val() != '') { // Índice de Briones
                $('#txtAuxIndiceBriones').val((parseFloat($('#txtAuxPresionOncoticaPo').val()) / parseFloat($('#txtEFisicoPAM').val())).toFixed(3))
            }
        })
        //$('#txtEFisicoPAD').on('focusout', function () {
        //    if ($('#txtEFisicoPA').val() != '' && $('#txtEFisicoPAD').val() != '') {
        //        $('#txtEFisicoPAM').val((((2 * parseInt($('#txtEFisicoPAD').val())) + parseInt($('#txtEFisicoPA').val())) / 3).toFixed(2))
        //    }
        //})

        $('#txtEFisicoFc').on('focusout', function () {
            if ($('#txtEFisicoPA').val() != '' && $('#txtEFisicoFc').val() != '') {
                $('#txtEFisicoCardioIShock').val(($('#txtEFisicoFc').val() / $('#txtEFisicoPA').val()).toFixed(2))
            }
        })

        $('#txtAuxAlbumina').on('focusout', function () {
            $('#txtAuxIndiceAlbumina').val($('#txtAuxAlbumina').val() * 5.54)

            if ($('#txtAuxIndiceAlbumina').val() != '' && $('#txtAuxIndiceGlobulina').val() != '') {
                $('#txtAuxPresionOncoticaPo').val(parseFloat($('#txtAuxIndiceAlbumina').val()) + parseFloat($('#txtAuxIndiceGlobulina').val()))

                if ($('#txtEFisicoPAM').val() != '') {
                    $('#txtAuxIndiceBriones').val($('#txtAuxPresionOncoticaPo').val() / $('#txtEFisicoPAM').val())
                }
            }
        })
        $('#txtAuxGlobulina').on('focusout', function () {
            $('#txtAuxIndiceGlobulina').val($('#txtAuxGlobulina').val() * 1.43)

            if ($('#txtAuxIndiceAlbumina').val() != '' && $('#txtAuxIndiceGlobulina').val() != '') {
                $('#txtAuxPresionOncoticaPo').val(parseFloat($('#txtAuxIndiceAlbumina').val()) + parseFloat($('#txtAuxIndiceGlobulina').val()))

                if ($('#txtEFisicoPAM').val() != '') {
                    $('#txtAuxIndiceBriones').val($('#txtAuxPresionOncoticaPo').val() / $('#txtEFisicoPAM').val())
                }
            }
        })
        //$('#txtEFisicoPAM').on('focusout', function () {
        //    if ($('#txtEFisicoPAM').val() != '' && $('#txtAuxPresionOncoticaPo').val() != '') {
        //        $('#txtAuxIndiceBriones').val($('#txtAuxPresionOncoticaPo').val() / $('#txtEFisicoPAM').val())
        //    }
        //})

        $('#txtEFisicoSpO2').on('focusout', function () {
            if ($('#txtEFisicoSpO2').val() != '' && $('#txtEFisicoRespFIO').val() != '') {
                $('#txtEFisicoSoFio2').val(($('#txtEFisicoSpO2').val() / $('#txtEFisicoRespFIO').val()).toFixed(2))
            } else {
                $('#txtEFisicoSoFio2').val('')
            }
        })

        $('#txtEFisicoRespFIO').on('focusout', function () {
            if ($('#txtEFisicoSpO2').val() != '' && $('#txtEFisicoRespFIO').val() != '') {
                $('#txtEFisicoSoFio2').val(($('#txtEFisicoSpO2').val() / $('#txtEFisicoRespFIO').val()).toFixed(2))
            } else {
                $('#txtEFisicoSoFio2').val('')
            }

            if ($('#txtAuxPO2').val() != '' && $('#txtEFisicoRespFIO').val() != '') {
                $('#txtEFisicoIndiceKirby').val(($('#txtAuxPO2').val() / $('#txtEFisicoRespFIO').val()).toFixed(2))
            } else {
                $('#txtEFisicoIndiceKirby').val('')
            }
            
        })

        $('#txtAuxPO2').on('focusout', function () {
            if ($('#txtAuxPO2').val() != '' && $('#txtEFisicoRespFIO').val() != '') {
                $('#txtEFisicoIndiceKirby').val(($('#txtAuxPO2').val() / $('#txtEFisicoRespFIO').val()).toFixed(2))
            } else {
                $('#txtEFisicoIndiceKirby').val('')
            }
        })
        //$('#txtEFisicoRespFIO').on('focusout', function () {
        //    if ($('#txtAuxPO2').val() != '' && $('#txtEFisicoRespFIO').val() != '') {
        //        $('#txtEFisicoIndiceKirby').val(($('#txtAuxPO2').val() / $('#txtEFisicoRespFIO').val()).toFixed(2))
        //    } else {
        //    }
        //})
        $('#txtEFisicoSpO2').on('focusout', function () {
            if ($('#txtEFisicoSpO2').val() != '' && $('#txtEFisicoRespFIO').val() != '' && $('#txtEFisicoFr').val() != '') {
                $('#txtEFisicoIndiceRox').val(($('#txtEFisicoSpO2').val() / $('#txtEFisicoRespFIO').val() / $('#txtEFisicoFr').val()).toFixed(2))
            }
        })
        $('#txtEFisicoRespFIO').on('focusout', function () {
            if ($('#txtEFisicoSpO2').val() != '' && $('#txtEFisicoRespFIO').val() != '' && $('#txtEFisicoFr').val() != '') {
                $('#txtEFisicoIndiceRox').val(($('#txtEFisicoSpO2').val() / $('#txtEFisicoRespFIO').val() / $('#txtEFisicoFr').val()).toFixed(2))
            }
        })
        $('#txtEFisicoFr').on('focusout', function () {
            if ($('#txtEFisicoSpO2').val() != '' && $('#txtEFisicoRespFIO').val() != '' && $('#txtEFisicoFr').val() != '') {
                $('#txtEFisicoIndiceRox').val(($('#txtEFisicoSpO2').val() / $('#txtEFisicoRespFIO').val() / $('#txtEFisicoFr').val()).toFixed(2))
            } else {
                $('#txtEFisicoIndiceRox').val('')
            }
        })
        $('#txtEFisicoPMedViaArea').on('focusout', function () {
            if ($('#txtEFisicoPMedViaArea').val() != '' && $('#txtEFisicoRespFIO').val() != '' && $('#txtEFisicoSpO2').val() != '') {
                $('#txtEFisicoIOxigenatorio').val((($('#txtEFisicoPMedViaArea').val() * $('#txtEFisicoRespFIO').val() * 100) / $('#txtEFisicoSpO2').val()).toFixed(2))
            } else {
                $('#txtEFisicoIOxigenatorio').val('')
            }
        })
        $('#txtEFisicoRespFIO').on('focusout', function () {
            if ($('#txtEFisicoPMedViaArea').val() != '' && $('#txtEFisicoRespFIO').val() != '' && $('#txtEFisicoSpO2').val() != '') {
                $('#txtEFisicoIOxigenatorio').val((($('#txtEFisicoPMedViaArea').val() * $('#txtEFisicoRespFIO').val() * 100) / $('#txtEFisicoSpO2').val()).toFixed(2))
            } else {
                $('#txtEFisicoIOxigenatorio').val('')
            }
        })
        $('#txtEFisicoSpO2').on('focusout', function () {
            if ($('#txtEFisicoPMedViaArea').val() != '' && $('#txtEFisicoRespFIO').val() != '' && $('#txtEFisicoSpO2').val() != '') {
                $('#txtEFisicoIOxigenatorio').val((($('#txtEFisicoPMedViaArea').val() * $('#txtEFisicoRespFIO').val() * 100) / $('#txtEFisicoSpO2').val()).toFixed(2))
            } else {
                $('#txtEFisicoIOxigenatorio').val('')
            }
        })

        $('#cboProcedenciaUCI').on('change', async function () {

            //if (this.value == 1) {
            //    $('#contProcedenciaHospital').show()
            //    $('#contProcedenciaServicio').hide()
            //    Cargando(1)
            //    await EvaluacionesUCI.EstablecimientosSeleccionarTodos()
            //    Cargando(0)
            //} else if (this.value == 2) {
            //    $('#contProcedenciaServicio').show()
            //    $('#contProcedenciaHospital').hide()
            //    Cargando(1)
            //    await EvaluacionesUCI.ServicioSeleccionarPorTipoServicio(3)
            //    Cargando(0)
            //} else {
            //    $('#contProcedenciaHospital').hide()
            //    $('#contProcedenciaServicio').hide()
            //}
        })

        $('#cboEFisicoRadioTorax').on('change', function () {
            if (this.value == 1) {
                $('#contEFisicoRadioToraxDescripcion').show()
            } else {
                $('#contEFisicoRadioToraxDescripcion').hide()
            }
        })


        $('#chkDisfuncionesOtros').on('click', function () {

            if ($(this).is(':checked'))
                $('#txtDisfuncionesOtros').attr("disabled", false)
            else
                $('#txtDisfuncionesOtros').attr("disabled", true)
        })
        $('#chkMotivoOtrosSignosYSintomas').on('click', function () {
            
            if ($(this).is(':checked'))
                $('#txtMotivoOtrosSignosYSintomas').attr("disabled", false)
            else
                $('#txtMotivoOtrosSignosYSintomas').attr("disabled", true)
        })
        $('#chkOtroCardioPat').on('click', function () {

            if ($(this).is(':checked'))
                $('#txtDescripcionOtroCardioPat').attr("disabled", false)
            else
                $('#txtDescripcionOtroCardioPat').attr("disabled", true)
                $('#txtDescripcionOtroCardioPat').val('')
        })
        $('#chkOtroMetabolicaPat').on('click', function () {

            if ($(this).is(':checked'))
                $('#txtDescripcionOtroMetabolicaPat').attr("disabled", false)
            else
                $('#txtDescripcionOtroMetabolicaPat').attr("disabled", true)
                $('#txtDescripcionOtroMetabolicaPat').val('')
        })
        $('#chkOtroInfecciosaPat').on('click', function () {

            if ($(this).is(':checked'))
                $('#txtDescripcionOtroInfecciosaPat').attr("disabled", false)
            else
                $('#txtDescripcionOtroInfecciosaPat').attr("disabled", true)
                $('#txtDescripcionOtroInfecciosaPat').val('')
        })
        $('#chkOtroNeuroPat').on('click', function () {

            if ($(this).is(':checked'))
                $('#txtDescripcionOtroNeuroPat').attr("disabled", false)
            else
                $('#txtDescripcionOtroNeuroPat').attr("disabled", true)
            $('#txtDescripcionOtroNeuroPat').val('')
        })
        $('#chkOtroReumaPat').on('click', function () {

            if ($(this).is(':checked'))
                $('#txtDescripcionOtroReumaPat').attr("disabled", false)
            else
                $('#txtDescripcionOtroReumaPat').attr("disabled", true)
            $('#txtDescripcionOtroReumaPat').val('')
        })

        $('#chkOtroDispositivo').on('click', function () {
            activarDesactivarRB('chkOtroDispositivo', 'txtDescripcionOtroDispositivo', '')
        })


        $('input[name=rdbDiabetesFamiliar]').on('click', function () {
            activarDesactivarRB('rdbDiabetesFamiliarSi', 'txtDiabetesFamiliar', 'rdbDiabetesFamiliarParen')
        })
        $('input[name=rdbTBCFamiliar]').on('click', function () {
            activarDesactivarRB('rdbTBCFamiliarSi', 'txtTBCFamiliar', 'rdbTBCFamiliarParen')
        })
        $('input[name=rdbHipertensionFamiliar]').on('click', function () {
            activarDesactivarRB('rdbHipertensionFamiliarSi', 'txtHipertensionFamiliar', 'rdbHipertensionFamiliarParen')
        })
        $('input[name=rdbMeoplasicoCancerFamiliar]').on('click', function () {
            activarDesactivarRB('rdbMeoplasicoCancerFamiliarSi', 'txtMeoplasicoCancerFamiliar', 'rdbMeoplasicoCancerFamiliarParen')
        })
        $('input[name=rdbEnfTiroideaFamiliar]').on('click', function () {
            activarDesactivarRB('rdbEnfTiroideaFamiliarSi', 'txtEnfTiroideaFamiliar', 'rdbEnfTiroideaFamiliarParen')
        })
        $('input[name=rdbEnfReumaticaFamiliar]').on('click', function () {
            activarDesactivarRB('rdbEnfReumaticaFamiliarSi', 'txtEnfReumaticaFamiliar', 'rdbEnfReumaticaFamiliarParen')
        })
        $('input[name=rdbAsmaFamiliar]').on('click', function () {
            activarDesactivarRB('rdbAsmaFamiliarSi', 'txtAsmaFamiliar', 'rdbAsmaFamiliarParen')
        })
        $('input[name=rdbOtrosFamiliar]').on('click', function () {
            activarDesactivarRB('rdbOtrosFamiliarSi', 'txtOtrosFamiliar', 'rdbOtrosFamiliarParen')
        })
        $('#chkTipoAlimentacionOtro').on('click', function () {
            activarDesactivarRB('chkTipoAlimentacionOtro', 'txtTipoAlimentacionOtroDescripcion', '')
        })

        

        $('input[name=rdbVacunaInfluenza]').on('click', function () {
            if ($('#rdbVacunaInfluenzaSi').is(':checked')) {
                $('#txtVacunaInfluenza').attr("disabled", false);
            } else {
                $('#txtVacunaInfluenza').attr("disabled", true);
                $('#txtVacunaInfluenza').val('')
            }
        })
        $('input[name=rdbVacunaDTAdulto]').on('click', function () {
            if ($('#rdbVacunaDTAdultoSi').is(':checked')) {
                $('#txtVacunaDTAdulto').attr("disabled", false);
            } else {
                $('#txtVacunaDTAdulto').attr("disabled", true);
                $('#txtVacunaDTAdulto').val('')
            }
        })
        $('input[name=rdbVacunaTexoideTetanico]').on('click', function () {
            if ($('#rdbVacunaTexoideTetanicoSi').is(':checked')) {
                $('#txtVacunaTexoideTetanico').attr("disabled", false);
            } else {
                $('#txtVacunaTexoideTetanico').attr("disabled", true);
                $('#txtVacunaTexoideTetanico').val('')
            }
        })
        $('input[name=rdbVacunaFiebreAmarilla]').on('click', function () {
            if ($('#rdbVacunaFiebreAmarillaSi').is(':checked')) {
                $('#txtVacunaFiebreAmarilla').attr("disabled", false);
            } else {
                $('#txtVacunaFiebreAmarilla').attr("disabled", true);
                $('#txtVacunaFiebreAmarilla').val('')
            }
        })
        $('input[name=rdbVacunaHepatitisB]').on('click', function () {
            if ($('#rdbVacunaHepatitisBSi').is(':checked')) {
                $('#txtVacunaHepatitisB').attr("disabled", false);
            } else {
                $('#txtVacunaHepatitisB').attr("disabled", true);
                $('#txtVacunaHepatitisB').val('')
            }
        })
        $('input[name=rdbVacunaBCG]').on('click', function () {
            if ($('#rdbVacunaBCGSi').is(':checked')) {
                $('#txtVacunaBCG').attr("disabled", false);
            } else {
                $('#txtVacunaBCG').attr("disabled", true);
                $('#txtVacunaBCG').val('')
            }
        })
        $('input[name=rdbVacunaPapilomavirus]').on('click', function () {
            if ($('#rdbVacunaPapilomavirusSi').is(':checked')) {
                $('#txtVacunaPapilomavirus').attr("disabled", false);
            } else {
                $('#txtVacunaPapilomavirus').attr("disabled", true);
                $('#txtVacunaPapilomavirus').val('')
            }
        })
        $('input[name=rdbVacunaOtra]').on('click', function () {
            if ($('#rdbVacunaOtraSi').is(':checked')) {
                $('#txtVacunaOtra').attr("disabled", false);
            } else {
                $('#txtVacunaOtra').attr("disabled", true);
                $('#txtVacunaOtra').val('')
            }
        })

        $('input[name=rdbBebidasAlcoholicasHabNoc]').on('click', function () {
            if ($('#rdbBebidasAlcoholicasHabNocSi').is(':checked')) {
                $('#txtBebidasAlcoholicasHabNoc').attr("disabled", false);
            } else {
                $('#txtBebidasAlcoholicasHabNoc').attr("disabled", true);
                $('#txtBebidasAlcoholicasHabNoc').val('')
            }
        })
        $('input[name=rdbDrogasHabNoc]').on('click', function () {
            if ($('#rdbDrogasHabNocSi').is(':checked')) {
                $('#txtDrogasHabNoc').attr("disabled", false);
            } else {
                $('#txtDrogasHabNoc').attr("disabled", true);
                $('#txtDrogasHabNoc').val('')
            }
        })
        $('input[name=rdbTabacoCigarrosHabNoc]').on('click', function () {
            if ($('#rdbTabacoCigarrosHabNocSi').is(':checked')) {
                $('#txtTabacoCigarrosHabNoc').attr("disabled", false);
            } else {
                $('#txtTabacoCigarrosHabNoc').attr("disabled", true);
                $('#txtTabacoCigarrosHabNoc').val('')
            }
        })
        $('input[name=rdbOtrosHabNoc]').on('click', function () {
            if ($('#rdbOtrosHabNocSi').is(':checked')) {
                $('#txtOtrosHabNoc').attr("disabled", false);
            } else {
                $('#txtOtrosHabNoc').attr("disabled", true);
                $('#txtOtrosHabNoc').val('')
            }
        })

        $('input[name=rdbFarmacologicasAler]').on('click', function () {
            if ($('#rdbFarmacologicasAlerSi').is(':checked')) {
                $('#txtFarmacologicasAler').attr("disabled", false);
            } else {
                $('#txtFarmacologicasAler').attr("disabled", true);
                $('#txtFarmacologicasAler').val('')
            }
        })
        $('input[name=rdbAlimentacionAler]').on('click', function () {
            if ($('#rdbAlimentacionAlerSi').is(':checked')) {
                $('#txtAlimentacionAler').attr("disabled", false);
            } else {
                $('#txtAlimentacionAler').attr("disabled", true);
                $('#txtAlimentacionAler').val('')
            }
        })
        $('input[name=rdbOtrosAler]').on('click', function () {
            if ($('#rdbOtrosAlerSi').is(':checked')) {
                $('#txtOtrosAler').attr("disabled", false);
            } else {
                $('#txtOtrosAler').attr("disabled", true);
                $('#txtOtrosAler').val('')
            }
        })
        $('input[name=rdbCirugiasPreviasQuirur]').on('click', function () {
            if ($('#rdbCirugiasPreviasQuirurSi').is(':checked')) {
                $('#txtCirugiasPreviasQuirur').attr("disabled", false);
                $('#txtFechaUltimaCiruQuirur').attr("disabled", false);
            } else {
                $('#txtCirugiasPreviasQuirur').attr("disabled", true);
                $('#txtFechaUltimaCiruQuirur').attr("disabled", true);
                $('#txtCirugiasPreviasQuirur').val('')
                $('#txtFechaUltimaCiruQuirur').val('')
            }
        })

        $('input[name=rdbGEyBUS]').on('click', function () {
            if ($('#rdbGEyBUSSi').is(':checked')) {
                $('#txtGEyBUS').attr("disabled", false);;
            } else {
                $('#txtGEyBUS').attr("disabled", true);
                $('#txtGEyBUS').val('')
            }
        })
        $('input[name=rdbVagina]').on('click', function () {
            if ($('#rdbVaginaSi').is(':checked')) {
                $('#txtVagina').attr("disabled", false);;
            } else {
                $('#txtVagina').attr("disabled", true);
                $('#txtVagina').val('')
            }
        })
        $('input[name=rdbCervix]').on('click', function () {
            if ($('#rdbCervixSi').is(':checked')) {
                $('#txtCervix').attr("disabled", false);;
            } else {
                $('#txtCervix').attr("disabled", true);
                $('#txtCervix').val('')
            }
        })
        $('input[name=rdbUtero]').on('click', function () {
            if ($('#rdbUteroSi').is(':checked')) {
                $('#txtUtero').attr("disabled", false);;
            } else {
                $('#txtUtero').attr("disabled", true);
                $('#txtUtero').val('')
            }
        })
        $('input[name=rdbAnexos]').on('click', function () {
            if ($('#rdbAnexosSi').is(':checked')) {
                $('#txtAnexos').attr("disabled", false);;
            } else {
                $('#txtAnexos').attr("disabled", true);
                $('#txtAnexos').val('')
            }
        })
        $('input[name=rdbFSDouglas]').on('click', function () {
            if ($('#rdbFSDouglasSi').is(':checked')) {
                $('#txtFSDouglas').attr("disabled", false);;
            } else {
                $('#txtFSDouglas').attr("disabled", true);
                $('#txtFSDouglas').val('')
            }
        })
        $('input[name=rdbParametrios]').on('click', function () {
            if ($('#rdbParametriosSi').is(':checked')) {
                $('#txtParametrios').attr("disabled", false);;
            } else {
                $('#txtParametrios').attr("disabled", true);
                $('#txtParametrios').val('')
            }
        })
        $('input[name=rdbMamas]').on('click', function () {
            if ($('#rdbMamasSi').is(':checked')) {
                $('#txtMamas').attr("disabled", false);;
            } else {
                $('#txtMamas').attr("disabled", true);
                $('#txtMamas').val('')
            }
        })

        $('input[name=rdbDrenajeAbdominal]').on('click', function () {
            activarDesactivarRB('rdbDrenajeAbdominalSi', 'txtDrenajeAbdominal', '')
        })
        $('input[name=rdbSondaNasogastrica]').on('click', function () {
            activarDesactivarRB('rdbSondaNasogastricaSi', 'txtSondaNasogastrica', '')
        })
        $('input[name=rdbBolsaLaparotomia]').on('click', function () {
            activarDesactivarRB('rdbBolsaLaparotomiaSi', 'txtBolsaLaparotomia', '')
        })
        $('input[name=rdbVac]').on('click', function () {
            activarDesactivarRB('rdbVacSi', 'txtVac', '')
        })
        $('input[name=rdbSondaUrinaria]').on('click', function () {
            activarDesactivarRB('rdbSondaUrinariaSi', 'txtSondaUrinaria', '')
        })
        $('input[name=rdbOtroInvasivoDispositivo]').on('click', function () {
            activarDesactivarRB('rdbOtroInvasivoDispositivoSi', 'txtOtroInvasivoDispositivo', '')
        })
        $('input[name=rdbInfeccioComunitaria]').on('click', function () {
            activarDesactivarRB('rdbInfeccioComunitariaSi', 'txtInfeccioComunitaria', '')
        })
        $('input[name=rdbInfeccionIntrahospitalaria]').on('click', function () {
            activarDesactivarRB('rdbInfeccionIntrahospitalariaSi', 'txtInfeccionIntrahospitalaria', '')
        })
        $('input[name=rdbDispositivoMedicionPIA]').on('click', function () {
            activarDesactivarRB('rdbDispositivoMedicionPIASi', 'txtDispositivoMedicionPIA', '')
        })
        $('input[name=rdbTaponamientoPelvico]').on('click', function () {
            activarDesactivarRB('rdbTaponamientoPelvicoSi', 'txtTaponamientoPelvico', '')
        })
        $('input[name=rdbTaponamientoHepatico]').on('click', function () {
            activarDesactivarRB('rdbTaponamientoHepaticoSi', 'txtTaponamientoHepatico', '')
        })


        $('input[name=rdbInfeccionHemocultivo]').on('click', function () {
            activarDesactivarRB('rdbInfeccionHemocultivoSi', 'txtInfeccionHemocultivo', '')
        })
        $('input[name=rdbInfeccionSecrecionBronquial]').on('click', function () {
            activarDesactivarRB('rdbInfeccionSecrecionBronquialSi', 'txtInfeccionSecrecionBronquial', '')
        })
        $('input[name=rdbInfeccionOrina]').on('click', function () {
            activarDesactivarRB('rdbInfeccionOrinaSi', 'txtInfeccionOrina', '')
        })
        $('input[name=rdbInfeccionHeces]').on('click', function () {
            activarDesactivarRB('rdbInfeccionHecesSi', 'txtInfeccionHeces', '')
        })
        $('input[name=rdbInfeccionSecreciones]').on('click', function () {
            activarDesactivarRB('rdbInfeccionSecrecionesSi', 'txtInfeccionSecreciones', '')
        })


        

        $('#tblInformeEvaluaciones tbody').on('click', '.ImprimirEvalSF', async function () {
            var objrow = oTable_EvaInf.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInf.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                if (typeof row.usaModuloMaterno === 'undefined') {
                    alerta(2, "Seleccione Fila");
                } else {

                    const pdf = await Utilitario.GenerarHojaInformeUCI(row.idCuentaAtencion, row.idAtencion, row.idAtencionDetalleUCI, row.idServicioIngreso, row.nroEvaluacion);

                    if (pdf) {
                        alerta('1', 'Se generó el documento correctamente.')
                        $("#btnBuscarAtenciones").click();
                    } else {
                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                    }
                }


            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblInformeEvaluaciones tbody').on('click', '.FirmarEvalSF', async function () {
            var objrow = oTable_EvaInf.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInf.fnGetData(objrow);

            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'UCI-EVA';
                const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code);
                if (firma) {
                    if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
                    if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }
                    /*await Utilitario.AbrirServicioFirmaBit4Id(row.code);*/
                }
            }
            Cargando(0);
        });

        $('#tblInformeEvaluaciones tbody').on('click', '.ImprimirEvalCF', async function () {
            var objrow = oTable_EvaInf.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInf.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
            }
            Cargando(0);
        });


        $('#tblAtencionesUCI tbody').on('click', '.ImprimeAltaSF', async function () {
            var objrow = oTable_AtencionesUCI.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_AtencionesUCI.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeInformeMedico)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                //alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                //const pdf = await Utilitario.GenerarFuaPdf(row.idCuentaAtencion, row.idCuentaAtencion);

                //if (pdf) {
                //    alerta('1', 'Se generó el documento correctamente.')
                //    $("#btnBuscarAtenciones").click();
                //} else {
                //    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                //}
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblAtencionesUCI tbody').on('click', '.ImprimeAltaCF', async function () {
            var objrow = oTable_AtencionesUCI.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_AtencionesUCI.fnGetData(objrow)

            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeInformeMedico);
        });

        $('#tblAtencionesUCI tbody').on('click', '.FirmarAltaSF', async function () {
            var objrow = oTable_AtencionesUCI.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_AtencionesUCI.fnGetData(objrow)

            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codeInformeMedico)               //KHOYOSI            
            if (firma) {
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.codeInformeMedico); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.codeInformeMedico); }                
            }
            Cargando(0);
        });
        ///////////////////////////////EVENTO ALTA MEDICA///////////////////////////////
        //$("#btnAltaMedica").on('click', async function () {
        //    $("#ModuloAlta").html("");

        //    EvaluacionesUCI.accion = "AM";
        //    var objrowTb = oTable_AtencionesUCI.api(true).row('.selected').data();

        //    Cargando(1);
        //    if (EvaluacionesUCI.ValidaCargaModulo()) {
        //        Variables.Cargar(objrowTb);
        //        AltaMedica.tipoServicio = 1;
        //        AltaMedica.idEspecialidad = objrowTb.idEspecialidad;
        //        await Utilitario.CargarModuloAlta();
        //        await AltaMedica.IniciarScript();
        //        await AltaMedica.ModificarAltaMedica(objrowTb);
        //    }
        //    Cargando(0);

        //    //AdmisionEmergencia.ListarAtenciones();
        //});
        //////////////////////////////////////////////////////////////////////////////
    },


    /// <summary>
    /// VALIDACIONES
    /// </summary>
    /// Lista de metodos que se encargan de realizar validaciones
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //ValidaCargaModulo() {
    //    var objrowTb = oTable_AtencionesUCI.api(true).row('.selected').data();

    //    if (isEmpty(objrowTb)) {
    //        //alerta(2, 'Seleccione un registro por favor.');
    //        alerta2('info', '', 'Seleccione un registro por favor.');
    //        return false;
    //    }

    //    if (objrowTb.idEstadoAtencion == 2) {
    //        //alerta(2, 'La cuenta esta cerrada.');
    //        alerta2('warning', '', 'La cuenta se encuentra cerrada.');
    //        if (EvaluacionesUCI.accion == 'M') {
    //            return false;
    //        }

    //        //if (AdmisionHospitalizacion.accion == 'AM') {
    //        //    return false;
    //        //}
    //    }

    //    if (objrowTb.fechaEgreso != '' && objrowTb.fechaEgreso != null) {
    //        //alerta(2, 'El paciente tiene alta médica.');
    //        alerta2('warning', '', 'El paciente tiene alta médica.');
    //        if (EvaluacionesUCI.accion == 'M') {
    //            return false;
    //        }

    //        if (EvaluacionesUCI.accion == 'AM') {
    //            return true;
    //        }
    //    }

    //    if (objrowTb.llegoAlServicio == 0) {
    //        alerta2('warning', '', 'El paciente aún no llega al servicio.<br>Por favor realice la recepción.');
    //        return false;
    //    }

    //    return true;
    //},

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
                    url: "/AdmisionHospitalizacion/CargarModulo?area=Hospitalizacion",
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

    IniciarModulo() {
        //EvaluacionesUCI.Plugins()
        EvaluacionesUCI.IniciarCamposPorDefecto()
        EvaluacionesUCI.IniciarDataTablesInformeEvaluacion()
        EvaluacionesUCI.InitDatablesNeurologicoSedantes()
        EvaluacionesUCI.InitDatablesNeurologicoAnalgesicos()
        EvaluacionesUCI.InitDatablesNeurologicoRelajanteNeuromuscular()
        EvaluacionesUCI.InitDatablesCardioVasoconstrictor()
        EvaluacionesUCI.InitDatablesCardioVasodilatador()

        EvaluacionesUCI.InitDatablesIntervencionesHemoderivado()
        EvaluacionesUCI.InitDatablesIntervencionesCorticoide()
        EvaluacionesUCI.InitDatablesIntervencionesFluidoterapia()

        EvaluacionesUCI.InitDatablesAccesosVasculares()

        EvaluacionesUCI.ServicioSeleccionarPorTipoServicioYEspecialidad(3)
        //EvaluacionesUCI.ServicioSeleccionarPorTipoServicioYEspecialidad(3)

        EvaluacionesUCI.ListarPaises()
        EvaluacionesUCI.ListaTiposEstadoCivilTodosV2()
        EvaluacionesUCI.TiposGradoInstruccionTodosV2()
        //EvaluacionesUCI.ServicioSeleccionarPorTipoServicio(3)
        EvaluacionesUCI.ServicioSeleccionarPorTipoServicio(0)
        //EvaluacionesUCI.EstablecimientosSeleccionarTodos()

        EvaluacionesUCI.Events()

        RegistroEvaluacionesUCI.IniciarScripts();
    },

    async CargarEvaluacionDetalle(idEval) {
        let objRowAtencion = oTable_AtencionesUCI.api(true).row('.selected').data()
        await RegistroEvaluacionesUCI.CompletarDatosRegistro(objRowAtencion)

        let evaluacion = oTable_Evaluaciones.fnGetNodes()[idEval - 1];
        evaluacion.click();
        $('.nav-tabs a[href="#evaluacionFisica-tab"]').tab('show');
        $('.nav-tabs a[href="#examenFisico-tab"]').tab('show');
        $('.nav-tabs a[href="#examenFisicoNeurologico-tab"]').tab('show');
    },

}

$(document).ready(() => {    
    EvaluacionesUCI.Plugins()

    //EvaluacionesUCI.IniciarCamposPorDefecto()

    EvaluacionesUCI.InitDatablesAtencionesUCI()
    EvaluacionesUCI.IniciarDataTablesInformeEvaluacion()

    //EvaluacionesUCI.InitDatablesNeurologicoSedantes()
    //EvaluacionesUCI.InitDatablesNeurologicoAnalgesicos()
    //EvaluacionesUCI.InitDatablesNeurologicoRelajanteNeuromuscular()
    //EvaluacionesUCI.InitDatablesCardioVasoconstrictor()
    //EvaluacionesUCI.InitDatablesCardioVasodilatador()

    //EvaluacionesUCI.InitDatablesIntervencionesHemoderivado()
    //EvaluacionesUCI.InitDatablesIntervencionesCorticoide()
    //EvaluacionesUCI.InitDatablesIntervencionesFluidoterapia()

    //EvaluacionesUCI.InitDatablesAccesosVasculares()

    EvaluacionesUCI.ServicioSeleccionarPorTipoServicioYEspecialidad(3)

    EvaluacionesUCI.EventosIniciales();
    
    //EvaluacionesUCI.ListarPaises()
    //EvaluacionesUCI.ListaTiposEstadoCivilTodosV2()
    //EvaluacionesUCI.TiposGradoInstruccionTodosV2()
    
    //EvaluacionesUCI.ServicioSeleccionarPorTipoServicio(0)
    
    EvaluacionesUCI.Events()

    PermisoGeneral.ValidarServicioFirmaDigital();
})

function activarDesactivarRB(rdbInputSiNo, txtDescripcion, rdbOtro) {
    if ($(`#${rdbInputSiNo}`).is(':checked')) {
        $(`#${txtDescripcion}`).attr("disabled", false)
        if (rdbOtro != '') {
            $(`input[name=${rdbOtro}]`).attr("disabled", false)
        }
        
    } else {
        $(`#${txtDescripcion}`).attr("disabled", true)
        $(`#${txtDescripcion}`).val('')
        if (rdbOtro != '') {
            $(`input[name=${rdbOtro}]`).attr("disabled", true)
            $(`input[name=${rdbOtro}]`).attr("checked", false)
        }
    }
}