let NotaEnfermeria = {

    IdNotaEnfermeria: 0,
    IdAtencion: 0,
    NroEvaluacion: 1,

    Intervenciones: [],

    charFrecCardiaca: "",
    charFrecRespiratoria: "",
    charTemperatura: "",

    gemelar: '',

    Plugins: () => {
        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: false })
        $(".chzn-select-deselect,#select2_sample").chosen()
        $('.chzn-select').chosen().trigger("chosen:updated")

        $('#txtFechaAtencion, #txtFechaInicioReporte, #txtFechaFinReporte, #txtFechaInicio, #txtFechaFin').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraRegistroEvolucion, #txtHoraRegistroEvolucionAt").mask("Hn:Nn");

        $(".chosen-select").chosen();
        //Transferencias.tipoServicio = 'UCI';
        //AltaMedica.tipoServicio = "UCI";
        //AltaMedica.EventosInicial();
    },

    InitDatablesAtenciones() {

        var parms = {
            "paging": false,
            "ordering": true,
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
                    width: '17%',
                    targets: 2,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 4,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 4,
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '8%',
                    targets: 6,
                    data: "servicioEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '12%',
                    targets: 7,
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        console.log('rowData.idNotaEnfermeria', rowData.idNotaEnfermeria)
                        if (!isEmpty(rowData.idNotaEnfermeria)) {

                            btnRuta = ' <button class="btnInformeEvaluacion btn btn-sm btn-pink glow_button" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            $(td).html(btnRuta);


                            $(td).html(btnRuta);
                        } else {
                            $(td).html("");
                        }

                    }
                }
            ]
        }

        var tableWrapper = $('#tblAtenciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Atenciones = $("#tblAtenciones").dataTable(parms);
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
                    data: "enfermera",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblEvaluaciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_Evaluacion = $("#tblEvaluaciones").dataTable(parms);
    },

    //InitDataTablesIntervencionesEnfemeria() {
    //    var parms = {
    //        scrollY: "145px",
    //        scrollCollapse: true,
    //        autoWidth: false,
    //        ordering: false,
    //        //deferRender: true,
    //        //scroller: true,
    //        data: null,
    //        destroy: true,
    //        info: false,
    //        bFilter: false,
    //        paging: false,
    //        responsive: true,
    //        columns: [
    //            {
    //                width: "15%",
    //                targets: 0,
    //                data: "idIntervencion",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'center')
    //                }
    //            },
    //            {
    //                width: "85%",
    //                targets: 1,
    //                data: "descripcion",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')

    //                }
    //            }
    //        ]

    //    }

    //    var tableWrapperEmer = $('#tblIntervencionesEnfemeria'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

    //    oTable_IntervencionesEnfemeria = $("#tblIntervencionesEnfemeria").dataTable(parms);
    //},


    InitChartFrecCardiaca: () => {
        const ctx = document.getElementById('chartFrecuenciaCardiaca');

        const data = {
            labels: [],
            datasets: [
                {
                    label: [],
                    data: [],
                    borderColor: 'rgba(255, 0, 0, 0.5)',
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    pointStyle: 'rectRot',
                    pointRadius: 10,
                    pointHoverRadius: 15
                }
            ]
        };

        this.charFrecCardiaca = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Frecuencia Cardiaca',
                    }
                }
            }
        });
    },

    InitChartFrecRespiratoria: () => {
        const ctx = document.getElementById('charFrecuenciaRespiratoria');

        const data = {
            labels: [],
            datasets: [
                {
                    label: [],
                    data: [],
                    borderColor: 'rgba(0, 0, 255, 0.5)',
                    backgroundColor: 'rgba(0, 0, 255, 0.5)',
                    pointStyle: 'rectRot',
                    pointRadius: 10,
                    pointHoverRadius: 15
                }
            ]
        };

        this.charFrecRespiratoria = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Frecuencia Respiratoria',
                    }
                }
            }
        });
    },

    InitChartTemperatura: () => {
        const ctx = document.getElementById('charTemperatura');

        const data = {
            labels: [],
            datasets: [
                {
                    label: [],
                    data: [],
                    borderColor: 'rgba(225, 125, 0, 0.5)',
                    backgroundColor: 'rgba(225, 125, 0, 0.5)',
                    pointStyle: 'rectRot',
                    pointRadius: 10,
                    pointHoverRadius: 15
                }
            ]
        };

        this.charTemperatura = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Temperatura',
                    }
                }
            }
        });
    },

    InitDatablesEvolucionSV() {

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
                    data: "fechaRegistro",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "horaRegistro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 2,
                    data: "temperatura",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "frecuenciaCardiaca",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "frecuenciaRespiratoria",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "presionSiastolica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "presionDiastolica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: "presionPromedio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                //{
                //    width: '10%',
                //    targets: 8,
                //    data: "peso",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: '10%',
                    targets: 9,
                    data: "saturacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 10,
                    data: "hgt",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]
        }

        var tableWrapper = $('#tblEvolucionSv'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_EvolucionSv = $("#tblEvolucionSv").dataTable(parms);
    },

    InitDatablesEvolucionAT() {

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
                    data: "fechaRegistro",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "horaRegistro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 2,
                    data: "idSoporteO2",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 3,
                    data: "soporteO2",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "idCanalizacionEv",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "canalizacionEv",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "idInmovilizacionMiembro",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: "inmovilizacionMiembro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "idAlimentacion",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "alimentacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 10,
                    data: "detalleFormula",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 11,
                    data: "idEliminacion",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 12,
                    data: "eliminacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 13,
                    data: "detalleEliminacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]
        }

        var tableWrapper = $('#tblEvolucionAt'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_EvolucionAt = $("#tblEvolucionAt").dataTable(parms);
    },

    InitDataTablesInformeEvaluacion() {
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
                    data: "nroEvaluacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "30%",
                    targets: 1,
                    data: "fechaRegistro",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaRegistro) + ' ' + rowData.horaRegistro);
                    }
                },
                {
                    width: "40%",
                    targets: 2,
                    data: "enfermera",
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

        var tableWrapperInf = $('#tblInformeEvaluaciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_EvaInf = $("#tblInformeEvaluaciones").dataTable(parms);
    },

    InitDataTablesDiagnosticosEnfermeria() {
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
                    data: "codificacionNanda",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "85%",
                    targets: 1,
                    data: "enunciado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapperDiagnosticosEnfermeria = $('#lstDiagnosticosEnfermeria'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_DiagnosticosEnfermeria = $("#lstDiagnosticosEnfermeria").dataTable(parms);
    },



    // GET, POST Request
    ListarAtencionesNotaEnfermeria: async function (IdCuentaAtencion, NroEvaluacion) {

        let formData = new FormData()

        formData.append("IdCuentaAtencion", IdCuentaAtencion);
        formData.append("NroHistoria", $('#txtNroHistoriaBusqueda').val());
        formData.append("NroDocumento", $('#txtNroDocumentoBusqueda').val());
        formData.append("ApellidoPaterno", $('#txtAPaternoBusqueda').val());
        formData.append("ApellidoMaterno", $('#txtAMaternoBusqueda').val());
        formData.append("Nombres", $('#txtNombresBusqueda').val());
        formData.append("FechaInicio", $('#txtFechaInicio').val());
        formData.append("FechaFin", $('#txtFechaFin').val());
        formData.append("IdServicio", $('#cboConsultorio').val());
        formData.append("NroEvaluacion", NroEvaluacion);

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/ListarAtencionesNotaEnfermeria`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        return data
    },

    ListarNotaEnfermeriaNeoEvolucionSvById: async function (IdAtencion) {

        let formData = new FormData()

        formData.append("IdAtencion", IdAtencion);

        oTable_EvolucionSv.fnClearTable()

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/ListarNotaEnfermeriaNeoEvolucionSvById`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        oTable_EvolucionSv.fnAddData(data)


        $(oTable_EvolucionSv.api(true).data().toArray()).each((i, obj) => { 

            insertarDatosGrafico(charFrecCardiaca.data, obj.horaRegistro, obj.frecuenciaCardiaca)

            insertarDatosGrafico(charFrecRespiratoria.data, obj.horaRegistro, obj.frecuenciaRespiratoria)

            insertarDatosGrafico(charTemperatura.data, obj.horaRegistro, obj.temperatura)


            charFrecCardiaca.update();
            charFrecRespiratoria.update();
            charTemperatura.update();
        })
        console.log('data', data)
    },
    ListarNotaEnfermeriaNeoEvolucionAtById: async function (IdAtencion) {

        let formData = new FormData()

        formData.append("IdAtencion", IdAtencion);

        oTable_EvolucionAt.fnClearTable()

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/ListarNotaEnfermeriaNeoEvolucionAtById`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        oTable_EvolucionAt.fnAddData(data)
    },

    SeleccionarNotaEnfermeriaNeoEvaluacion: async function (IdAtencion, IdNotaEnfermeria, NroEvaluacion) {

        let formData = new FormData()

        formData.append("IdAtencion", IdAtencion);
        formData.append("IdNotaEnfermeria", IdNotaEnfermeria);
        formData.append("NroEvaluacion", NroEvaluacion);

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/SeleccionarNotaEnfermeriaNeoEvaluacion`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        return data
    },

    ServicioSeleccionarPorTipoServicioYEspecialidad: async (idTipoServicio) => {
        let data = await Utilitario.ServicioSeleccionarPorTipoServicio(idTipoServicio)
        if (!isEmpty(data)) {
            if (data.table.length > 0) {
                $('#cboConsultorio').empty()
                $('#cboConsultorio').append('<option  value="0">--Seleccionar--</option>')
                $(data.table).each(function (i, obj) {
                    //console.log('obj', obj)
                    //if (obj.idEspecialidad == 13 || obj.idEspecialidad == 14) {
                    $('#cboConsultorio').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
                    //}
                });

                $('.chzn-select').chosen().trigger("chosen:updated")
            }
        }
    },

    SeleccionarIntervencionesEnfermeriaByCpt: async function (cpt) {

        let formData = new FormData()

        formData.append("cpt", cpt);

        $('#cboIntervencionesEnfermeria').empty()

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/SeleccionarIntervencionesEnfermeriaByCpt`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        if (data.length > 0) {

            $('#cboIntervencionesEnfermeria').append('<option  value="0">--Seleccionar--</option>')
            $(data).each(function (i, obj) {
                $('#cboIntervencionesEnfermeria').append('<option  value="' + obj.idIntervencion + '">' + obj.descripcion + '</option>')
            });

            $('.chzn-select').chosen().trigger("chosen:updated")
        }
    },

    ListarEmpleadosNotaEnfermeria: async function () {

        const res = await HttpClient.Get('/NotaEnfermeriaNeo/ListarEmpleadosNotaEnfermeria?area=Comun');

        $('#cboEnfermeraRegistra').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboEnfermeraRegistra').append(`<option value="${obj.idEmpleado}">${obj.apellidoPaterno} ${obj.apellidoMaterno} ${obj.nombres}</option>`)
        })
        $('#cboEnfermeraRegistra').val($('#idUsuariotxt').val())
        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    ListarOpcionesNotaEnfermeria: async function () {

        const res = await HttpClient.Get('/NotaEnfermeriaNeo/ListarOpcionesNotaEnfermeria?area=Comun');

        $(".chosen-select").chosen();

        $('#cboPielColor').empty();
        $('#cboFontanela').empty();
        $('#cboSuturas').empty();
        $('#cboOrejas').empty();
        $('#cboNariz').empty();
        $('#cboBoca').empty();
        $('#cboCuello').empty();
        $('#cboTorax').empty();
        $('#cboAbdomen').empty();
        $('#cboCordonUmbilical').empty();
        $('#cboCaracteristicaAbdomen').empty();
        $('#cboGenitoUrinario').empty();
        $('#cboEliminacion').empty();
        $('#cboColumnaVertebral').empty();
        $('#cboExtremidades').empty();
        $('#cboTonoMuscular').empty();
        $('#cboCadera').empty();
        $('#cboValoracionNeur').empty();
        $('#cboReflejo').empty();

        $('#cboSoporteO2EvolucionAt').empty();
        $('#cboCanalizacionEvEvolucionAt').empty();
        $('#cboInmovilizacionMiembroEvaluacionAt').empty();
        $('#cboAlimentacionEvaluacionAt').empty();
        $('#cboEliminacionEvolucionAt').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }

        $(res.data.table).each(function (i, obj) {

            if (obj.idTipoOpcion == 1) {
                $('#cboPielColor').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 2) {
                $('#cboFontanela').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 3) {
                $('#cboSuturas').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 4) {
                $('#cboOrejas').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 5) {
                $('#cboNariz').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 6) {
                $('#cboBoca').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 7) {
                $('#cboCuello').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 8) {
                $('#cboTorax').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 9) {
                $('#cboCordonUmbilical').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 10) {
                $('#cboCaracteristicaAbdomen').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 11) {
                $('#cboGenitoUrinario').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 12) {
                $('#cboEliminacion').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 13) {
                $('#cboColumnaVertebral').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 14) {
                $('#cboExtremidades').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 15) {
                $('#cboTonoMuscular').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 16) {
                $('#cboCadera').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 17) {
                $('#cboValoracionNeur').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 18) {
                $('#cboReflejo').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 19) {
                $('#cboSoporteO2EvolucionAt').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 20) {
                $('#cboCanalizacionEvEvolucionAt').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 21) {
                $('#cboInmovilizacionMiembroEvaluacionAt').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 22) {
                $('#cboAlimentacionEvaluacionAt').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }
            if (obj.idTipoOpcion == 23) {
                $('#cboEliminacionEvolucionAt').append(`<option value="${obj.idOpcion}">${obj.descripcion}</option>`)
            }

        })
        $('#cboPielColor').val(0)
        $('#cboFontanela').val(0)
        $('#cboSuturas').val(0)
        $('#cboOrejas').val(0)
        $('#cboNariz').val(0)
        $('#cboBoca').val(0)
        $('#cboCuello').val(0)
        $('#cboTorax').val(0)
        $('#cboAbdomen').val(0)
        $('#cboCordonUmbilical').val(0)
        $('#cboCaracteristicaAbdomen').val(0)
        $('#cboGenitoUrinario').val(0)
        $('#cboEliminacion').val(0)
        $('#cboColumnaVertebral').val(0)
        $('#cboExtremidades').val(0)
        $('#cboTonoMuscular').val(0);
        $('#cboCadera').val(0);
        $('#cboValoracionNeur').val(0);
        $('#cboReflejo').val(0);
        $('#cboSoporteO2EvolucionAt').val(0);
        $('#cboCanalizacionEvEvolucionAt').val(0);
        $('#cboInmovilizacionMiembroEvaluacionAt').val(0);
        $('#cboAlimentacionEvaluacionAt').val(0);
        $('#cboEliminacionEvolucionAt').val(0);
        
        
        $('.chzn-select').chosen().trigger("chosen:updated")
        $('.chosen-select').chosen().trigger("chosen:updated")
        
    },

    ListarDiagnosticosNANDA: async function () {

        const res = await HttpClient.Get('/NotaEnfermeriaNeo/ListarDiagnosticosNANDA?area=Comun');

        $('#cboDiagnosticosNanda').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de origen')
            return
        }
        $(res.data.table).each(function (i, obj) {

            $('#cboDiagnosticosNanda').append(`<option codificacionNanda="${obj.codificacionNanda}" value="${obj.idDiagnostico}">${obj.enunciado}</option>`)

        })
        $('#cboDiagnosticosNanda').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    // ---------------------------------
    CargarDatosAtencion: async function (data) {

        Variables.Cargar(data)

        NotaEnfermeria.IdAtencion = data.idAtencion
        NotaEnfermeria.IdNotaEnfermeria = data.idNotaEnfermeria ?? NotaEnfermeria.IdNotaEnfermeria

        await ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)

        await NotaEnfermeria.ListarNotaEnfermeriaNeoEvolucionSvById(NotaEnfermeria.IdAtencion)
        await NotaEnfermeria.ListarNotaEnfermeriaNeoEvolucionAtById(NotaEnfermeria.IdAtencion)

        await NotaEnfermeria.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(Variables.IdAtencion, '')
        await NotaEnfermeria.SeleccionarTriajeRecienNacido(data.idTriajeRn, '')

        //await NotaEnfermeria.SeleccionarRegistroRN(Variables.IdCuentaAtencion, data.idTriajeRn, 'SISGALEN')
        //await NotaEnfermeria.SeleccionarRegistroNeonatal(data.idPaciente)

        let evaluaciones = await NotaEnfermeria.SeleccionarNotaEnfermeriaNeoEvaluacion(NotaEnfermeria.IdAtencion, NotaEnfermeria.IdNotaEnfermeria, 0)
        oTable_Evaluacion.fnClearTable()

        if (evaluaciones && !isEmpty(evaluaciones)) {
            oTable_Evaluacion.fnAddData(evaluaciones)

            if (evaluaciones.length > 0) {
                $('#tblEvaluaciones tbody').find('tr').eq(NotaEnfermeria.NroEvaluacion - 1).addClass("selected");

                await NotaEnfermeria.CargarDatosEvaluacion()
            }
        }

        $('#txtNroCuenta').val(data.idCuentaAtencion)
        $('#txtNroHistoria').val(data.nroHistoriaClinica)
        $('#txtApellidosNombrePaciente').val(data.paciente)
        $('#txtNroHistoriaMadre').val(data.nroHistoriaClinicaMadre)
        $('#txtFechaNacimiento').datepicker("setDate", data.fechaNacimiento);
        //$('#txtHoraNacimiento').val(data.horaNacimiento)
        $('#txtSexo').val(data.sexo)

        //$("#txtNroCuentaMadre").val(data.idCuentaMadre);
        //$("#txtNroHistoriaMadreTriaje").val(data.nroHistoriaClinicaMadre);
        //$("#txtNombreMadre").val(data.madre);
        //$("#txtEdadMadre").val(data.edadMadre);
        //$("#txtTipoDocMadre").val(data.tipoDocMadre);
        //$("#txtNroDocMadre").val(data.nroDocMadre);
        //$('#txtApgar').val(data)


        // datos que se deben guardar

        //$('#txtEdadSemanas').val(data.edadGestacional)
        //$('#txtEdadDias').val(data.edadDiaGestacional)

        //if (data.idNotaEnfermeria > 0) {
        //    $('#txtEdadSemanas').val(data.edadGestacionalSemanas);
        //    $('#txtEdadDias').val(data.edadGestacionalDias);
        //}

        // Asignación de valores desde el objeto data a los campos del formulario
        //if (!isEmpty(data.apgar5) && data.apgar5 != '') {
        //    $('#txtApgar5').val(data.apgar5);
        //}
        
        $('#txtValidacionPeso').val(data.peso);
        $('#txtValidacionTalla').val(data.talla);
        $('#txtValidacionPC').val(data.perimetroCefalico);
        $('#txtValidacionPT').val(data.perimetroToraxico);
        $('#cboPielColor').val(data.pielColor);
        $('#txtColorPielEspecificar').val(data.pielColorEspecificar);
        $('#cboFontanela').val(data.fontanela);
        $('#txtFontanelaEspecificar').val(data.fontanelaEspecificar);
        $('#cboSuturas').val(data.suturas);
        $('#txtSuturasEspecificar').val(data.suturasEspecificar || '');  // Valor vacío si es nulo
        $('#cboOrejas').val(data.orejas);
        $('#txtOrejasEspecificar').val(data.orejasEspecificar);
        $('#txtImplantacionUbicacion').val(data.implantacionUbicacion);
        $('#cboNariz').val(data.nariz);
        $('#txtNarizEspecificar').val(data.narizEspecificar);
        $('#cboBoca').val(data.boca);
        $('#txtBocaEspecificar').val(data.bocaEspecificar || '');  // Valor vacío si es nulo
        $('#cboCuello').val(data.cuello);
        $('#txtCuelloEspecificar').val(data.cuelloEspecificar);
        $('#cboTorax').val(data.torax);
        $('#cboAbdomen').val(data.abdomen);
        $('#cboCordonUmbilical').val(data.cordonUmbilical);
        $('#cboCaracteristicaAbdomen').val(data.caracteristicasAbdomen);
        $('#txtCaracteristicaAbdomenEspecificar').val(data.caracteristicasAbdomenEspecificar);
        $('#cboGenitoUrinario').val(data.genitoUrinario);
        $('#txtGenitoUrinarioObservacion').val(data.genitoUrinarioObservacion);
        $('#cboEliminacion').val(data.eliminacion);
        $('#txtEliminacionEspecificar').val(data.eliminacionEspecificar);
        $('#cboColumnaVertebral').val(data.columnaVertebral);
        $('#txtColumnaVertebralEspecificar').val(data.columnaVertebralEspecificar);
        $('#cboExtremidades').val(data.extremidades);
        $('#cboTonoMuscular').val(data.tonoMuscular);
        $('#txtTonoMuscularEspecificar').val(data.tonoMuscularEspecificar);
        $('#cboCadera').val(data.cadera);
        $('#cboValoracionNeur').val(data.valoracionNeur);
        $('#cboReflejo').val(data.reflejo?.split(','));
        $('#txtObservacionesExamenFisico').val(data.observacionExamenFisico);

        $('#txtManiobraDuranteParto').val(data.maniobraDuranteParto);
        $('#txtRecepcionRn').val(data.recepcionRn);
        $('#txtToraxEspecificar').val(data.toraxEspecificar);
        $('#txtCordonUmbilicalEspecificar').val(data.cordonUmbilicalEspecificar);
        $('#txtExtremidadesEspecificar').val(data.extremidadesEspecificar);
        $('#txtCaderaEspecificar').val(data.caderaEspecificar);
        $('#txtValoracionNeurEspecificar').val(data.valoracionNeurEspecificar);
        $('#txtReflejoEspecificar').val(data.reflejoEspecificar);

        $('#txtImpresionDiagnostica').val(data.impresionDiagnostica);

        $('.chosen-select').chosen().trigger("chosen:updated")
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    GuardarNotaEnfermeriaNeo: async function () {
        const formData = new FormData();

        formData.append("IdNotaEnfermeria", NotaEnfermeria.IdNotaEnfermeria);
        formData.append("IdAtencion", NotaEnfermeria.IdAtencion);
        formData.append("Apgar1", '');
        formData.append("Apgar5", $('#txtApgar5').val());
        formData.append("EdadGestacionalSemanas", $('#txtEdadSemanas').val());
        formData.append("EdadGestacionalDias", $('#txtEdadDias').val());
        formData.append("Peso", $('#txtValidacionPeso').val());
        formData.append("Talla", $('#txtValidacionTalla').val());
        formData.append("PerimetroCefalico", $('#txtValidacionPC').val());
        formData.append("PerimetroToraxico", $('#txtValidacionPT').val());
        formData.append("PielColor", $('#cboPielColor').val());
        formData.append("PielColorEspecificar", $('#txtColorPielEspecificar').val());
        formData.append("Fontanela", $('#cboFontanela').val());
        formData.append("FontanelaEspecificar", $('#txtFontanelaEspecificar').val());
        formData.append("Suturas", $('#cboSuturas').val());
        formData.append("SuturasEspecificar", $('#txtSuturasEspecificar').val());
        formData.append("Orejas", $('#cboOrejas').val());
        formData.append("OrejasEspecificar", $('#txtOrejasEspecificar').val());
        formData.append("ImplantacionUbicacion", $('#txtImplantacionUbicacion').val());
        formData.append("Nariz", $('#cboNariz').val());
        formData.append("NarizEspecificar", $('#txtNarizEspecificar').val());
        formData.append("Boca", $('#cboBoca').val());
        formData.append("BocaEspecificar", $('#txtBocaEspecificar').val());
        formData.append("Cuello", $('#cboCuello').val());
        formData.append("CuelloEspecificar", $('#txtCuelloEspecificar').val());
        formData.append("Torax", $('#cboTorax').val());
        formData.append("Abdomen", $('#cboAbdomen').val());
        formData.append("CordonUmbilical", $('#cboCordonUmbilical').val());
        formData.append("CaracteristicasAbdomen", $('#cboCaracteristicaAbdomen').val());
        formData.append("CaracteristicasAbdomenEspecificar", $('#txtCaracteristicaAbdomenEspecificar').val());
        formData.append("GenitoUrinario", $('#cboGenitoUrinario').val());
        formData.append("GenitoUrinarioObservacion", $('#txtGenitoUrinarioObservacion').val());
        formData.append("Eliminacion", $('#cboEliminacion').val());
        formData.append("EliminacionEspecificar", $('#txtEliminacionEspecificar').val());
        formData.append("ColumnaVertebral", $('#cboColumnaVertebral').val());
        formData.append("ColumnaVertebralEspecificar", $('#txtColumnaVertebralEspecificar').val());
        formData.append("Extremidades", $('#cboExtremidades').val());
        formData.append("TonoMuscular", $('#cboTonoMuscular').val());
        formData.append("TonoMuscularEspecificar", $('#txtTonoMuscularEspecificar').val());
        formData.append("Cadera", $('#cboCadera').val());
        formData.append("ValoracionNeur", $('#cboValoracionNeur').val());
        formData.append("Reflejo", $('#cboReflejo').val());
        formData.append("ObservacionExamenFisico", $('#txtObservacionesExamenFisico').val());

        formData.append("ManiobraDuranteParto", $('#txtManiobraDuranteParto').val());
        formData.append("ToraxEspecificar", $('#txtToraxEspecificar').val());
        formData.append("CordonUmbilicalEspecificar", $('#txtCordonUmbilicalEspecificar').val());
        formData.append("ExtremidadesEspecificar", $('#txtExtremidadesEspecificar').val());
        formData.append("CaderaEspecificar", $('#txtCaderaEspecificar').val());
        formData.append("ValoracionNeurEspecificar", $('#txtValoracionNeurEspecificar').val());
        formData.append("ReflejoEspecificar", $('#txtReflejoEspecificar').val());
        formData.append("RecepcionRn", $('#txtRecepcionRn').val());
        formData.append("ImpresionDiagnostica", $('#txtImpresionDiagnostica').val());

        formData.append("NroEvaluacion", NotaEnfermeria.NroEvaluacion);



        formData.append('evolucionSv', JSON.stringify(oTable_EvolucionSv.api(true).data().toArray()));
        formData.append('evolucionAt', JSON.stringify(oTable_EvolucionAt.api(true).data().toArray()));

        // Diagnosticos.PanelDx = '#PanelDiagnosticoClap ';
        // ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        formData.append('lstDiagnosticos', JSON.stringify(oTable_DiagnosticosEnfermeria.api(true).data().toArray()));

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/GuardarNotaEnfermeriaNeo`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        NotaEnfermeria.IdNotaEnfermeria = data[0].idNotaEnfermeria

        console.log('data', data)
    },

    CrearModificarNotaEnfermeriaNeoEvaluacion: async function (IdAtencion, NroEvaluacion, FechaRegistro, HoraRegistro, EvaluacionCuidadoRn, EvaluacionCuidadoRnFactorRiesgo, IdEnfermeraAtiende) {
        const formData = new FormData();

        formData.append("IdAtencion", IdAtencion);
        formData.append("IdNotaEnfermeria", NotaEnfermeria.IdNotaEnfermeria);
        formData.append("NroEvaluacion", NroEvaluacion);
        formData.append("FechaRegistro", FechaRegistro);
        formData.append("HoraRegistro", HoraRegistro);
        formData.append("EvaluacionCuidadoRn", EvaluacionCuidadoRn);
        formData.append("EvaluacionCuidadoRnFactorRiesgo", EvaluacionCuidadoRnFactorRiesgo);
        formData.append("IdEnfermeraAtiende", IdEnfermeraAtiende);


        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/CrearModificarNotaEnfermeriaNeoEvaluacion`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        console.log('data', data)
    },

    GuardarIntervencionesNotaEnfermeriaNeo: async function () {
        const formData = new FormData();

        formData.append("IdAtencion", Variables.IdAtencion);
        formData.append('lstIntervenciones', JSON.stringify(NotaEnfermeria.Intervenciones));
        // formData.append('lstIntervenciones', JSON.stringify(oTable_IntervencionesEnfemeria.api(true).data().toArray()));

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/GuardarIntervencionesNotaEnfermeriaNeo`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        console.log('data', data)
    },

    SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt: async function (IdAtencion, cpt) {
        const formData = new FormData();

        oTable_IntervencionesEnfemeria.fnClearTable()

        formData.append("IdAtencion", IdAtencion);
        formData.append('cpt', cpt);

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            // alerta(2, 'No existen datos para mostrar.')
            return false
        }

        NotaEnfermeria.Intervenciones = data

        // oTable_IntervencionesEnfemeria.fnAddData(NotaEnfermeria.Intervenciones.filter(obj => (obj.cpt == cpt)))
    },
   
    SeleccionarDiagnosticosNandaByIdAtencion: async function (IdAtencion) {
        const formData = new FormData();

        oTable_DiagnosticosEnfermeria.fnClearTable()

        formData.append("IdAtencion", IdAtencion);

        let response = await HttpClient.Post(`/NotaEnfermeriaNeo/SeleccionarDiagnosticosNandaByIdAtencion`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            // alerta(2, 'No existen datos para mostrar.')
            return false
        }

        oTable_DiagnosticosEnfermeria.fnAddData(data)
    },

    async SeleccionarTriajeRecienNacido(idTriajeRn) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        //var objrow = oTable_TriajeRn.api(true).row('.selected').data();
        //if (isEmpty(objrow)) {
        //    alerta2("info", "", "Debe seleccionar un registro de triaje.");
        //    return false;
        //}

        data.append('NroTriajeRn', idTriajeRn);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TriajeRecienNacido/SeleccionarTriajeRn?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {

                data = datos.respuesta.table[0]
                NotaEnfermeria.CargarDatosTriajeAlForm(datos.respuesta.table[0]);

                $("#txtNroCuentaMadre").val(data.idCuentaMadre);
                $("#txtNroHistoriaMadreTriaje").val(data.nroHistoriaClinica);
                $("#txtNombreMadre").val(data.madre);
                $("#txtEdadMadre").val(data.edadMadre);
                $("#txtTipoDocMadre").val(data.tipoDocMadre);
                $("#txtNroDocMadre").val(data.nroDocMadre);
                resp = true;
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarRegistroNeonatal(idPaciente) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idPaciente', idPaciente);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionNeonatalHosp/RegistroNacimientoEnHospitalEnExternoSeleccionar?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                NotaEnfermeria.CargarDatosTriajeAlForm(datos.respuesta.table[0]);
                resp = true;
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    ////////////////////////////SELECCIONAR//////////////////////////////////
    SeleccionarRegistroRN(idCuentaAtencion, idRegistroRn, tabla) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        midata.append('idRegistroRn', idRegistroRn);
        midata.append('tabla', tabla);
        $.ajax({
            method: "POST",
            url: "/RecienNacido/SeleccionarRegistroRN?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        NotaEnfermeria.CargarDatosTriajeAlForm(datos.table[0]);
                        resp = true;
                    }

                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    CargarDatosTriajeAlForm(datos) {
       

        

        //$("#txtFechaNacimientoTriaje").datepicker("setDate", FormatearFecha(datos.fechaNacimiento) );
        $("#txtFechaNacimientoTriaje").datepicker("setDate", FormatearFecha(datos.fechaNacimiento));
        $("#txtHoraNacimientoTriaje").val(datos.horaNacimiento);
        $("#txtHoraNacimiento").val(datos.horaNacimiento);
        $("#cboTipoSexo").val(datos.idTipoSexo);
        $("#cboTipoSexo").trigger("chosen:updated");
        $("#cboTipoGestacion").val(datos.idTipoGestacion);
        $("#cboTipoGestacion").trigger("chosen:updated");
        NotaEnfermeria.TipoGestacion_Change();
        $("#txtNroFetos").val(datos.fetos);
        NotaEnfermeria.Fetos_Change();
        $("#cboNumeroGemelar").val(datos.nroGemelar);
        $("#cboNumeroGemelar").trigger("chosen:updated");
        $("#cboCondicion").val(datos.idCondicion);
        $("#cboCondicion").trigger("chosen:updated");
        NotaEnfermeria.Condicion_Change();
        if (datos.obito == "No") {
            $('#rdbObitoNo').prop('checked', true);
        } else if (datos.obito == "Menor") {
            $('#rdbObitoSiMenor').prop('checked', true);
        } else if (datos.obito == "Mayor") {
            $('#rdbObitoSiMayor').prop('checked', true);
        }

        $("#txtPeso").val(datos.peso);
        $("#txtTalla").val(datos.talla);
        $("#txtPerCefalico").val(datos.perimetroCefalico);
        $("#txtPerToracico").val(datos.perimetroToracico);
        $("#txtEdadGestacional").val(datos.edadGes);

        if (datos.clampadoTardio == true) {
            $('#rdbTardioSi').prop('checked', true);
        } else if (datos.clampadoTardio == false) {
            $('#rdbTardioNO').prop('checked', true);
        }
        if (datos.lactancia1raHora == true) {
            $('#rdbLacthoraSi').prop('checked', true);
        } else if (datos.lactancia1raHora == false) {
            $('#rdbLacthoraNO').prop('checked', true);
        }
        $("#cboContactoPiel").val(datos.pielaPiel);
        $("#cboContactoPiel").trigger("chosen:updated");
        $("#cboServicioNacimiento").val(datos.idServicioNacimiento);
        $("#cboServicioNacimiento").trigger("chosen:updated");
        $("#cboProcedenciaRn").val(datos.idOtraProcedencia);
        $("#cboProcedenciaRn").trigger("chosen:updated");

        //$("#txtFechaClampaje").datepicker("setDate", datos.fechaClampajeRn);
        //$("#txtHoraClampaje").val(datos.horaClampaje);
        $("#cboTiempoClampaje").val(datos.idTiempoClampaje);
        $("#cboTiempoClampaje").trigger("chosen:updated");

        if (datos.inmediato == true) {
            $('#rdbInmediatoSi').prop('checked', true);
        } else if (datos.inmediato == false) {
            $('#rdbInmediatoNO').prop('checked', true);
        }

        if (datos.reanimacion == true) {
            $('#rdbReanimacionSi').prop('checked', true);
        } else if (datos.reanimacion == false) {
            $('#rdbReanimacionNO').prop('checked', true);
        }
        NotaEnfermeria.Reanimacion_Change();
        $("#cboTipoReanimacionRn").val(datos.idTipoReanimacion);
        $("#cboTipoReanimacionRn").trigger("chosen:updated");

        $("#txtMinuto").val(datos.alMinuto);
        $("#txt5Minuto").val(datos.alos5Minutos);
        $("#txt10Minuto").val(datos.alos10Minutos);
        $("#txt15Minuto").val(datos.alos15Minutos);
        $("#txt20Minuto").val(datos.alos20Minutos);


        $('#txtApgar5').val((isEmptyValue(datos.alMinuto) ? '' : datos.alMinuto) + (isEmptyValue(datos.alos5Minutos) ? '' : '-' + datos.alos5Minutos) + (isEmptyValue(datos.alos10Minutos) ? '' : '-' + datos.alos10Minutos) + (isEmptyValue(datos.alos15Minutos) ? '' : '-' + datos.alos15Minutos) + (isEmptyValue(datos.alos20Minutos) ? '' : '-' + datos.alos20Minutos));
        $("#txtEdadSemanas").val(datos.edadGes);


        if (datos.patologiaNeonatal == true) {
            $('#rdbPatNeoSi').prop('checked', true);
        } else if (datos.patologiaNeonatal == false) {
            $('#rdbPatNeoNo').prop('checked', true);
        }
        NotaEnfermeria.PatNeo_Change();
        $("#txtEspecificar").val(datos.especificar);

        if (datos.transporte == true) {
            $('#rdbTransporteSi').prop('checked', true);
        } else if (datos.transporte == false) {
            $('#rdbTransporteNO').prop('checked', true);
        }
        NotaEnfermeria.Transporte_Change();
        $("#cboTipoTransporteRn").val(datos.idTipoTransporte);
        $("#cboTipoTransporteRn").trigger("chosen:updated");

    },

    CargarDatosEvaluacion: async function () {

        var objrowTb = oTable_Evaluacion.api(true).row('.selected').data();

        let evaluaciones = await NotaEnfermeria.SeleccionarNotaEnfermeriaNeoEvaluacion(NotaEnfermeria.IdAtencion, NotaEnfermeria.IdNotaEnfermeria, isEmpty(objrowTb) ? 1 : objrowTb.nroEvaluacion)

        if (evaluaciones && !isEmpty(evaluaciones)) {
            let evaluacion = evaluaciones[0]

            NotaEnfermeria.NroEvaluacion = evaluacion.nroEvaluacion

            $("#lblNumeroEvaluacion").text(`Evaluacion N° ${evaluacion.nroEvaluacion}`)

            $('#FechaInicioAtencion').datepicker("setDate", evaluacion.fechaRegistro);
            $('#HoraInicioAtencion').val(evaluacion.horaRegistro);
            $('#txtEvaluacionCuidadoRN').val(evaluacion.evaluacionCuidadoRn);
            $('#txtEvaluacionCuidadoRnFactorRiesgo').val(evaluacion.evaluacionCuidadoRnFactorRiesgo);
            $('#cboEnfermeraRegistra').val(evaluacion.idEnfermeraAtiende);

            Diagnosticos.PanelDx = '#PanelDiagnosticoClap ';
            //Diagnosticos.IniciarScript();
            $(Diagnosticos.PanelDx + "#TituloCardDiagnostico").html("DIAGNÓSTICO DE ENFERMERÍA");
            await NotaEnfermeria.SeleccionarDiagnosticosNandaByIdAtencion(Variables.IdAtencion);

            if (evaluacion.statusFirma == 1) {
                $('#ImprimirEvalEmerCF').show()
                $('#FirmarEvalEmer').hide()
                $('#ImprimirEvalEmerSF').hide()
            } else {
                $('#ImprimirEvalEmerCF').hide()
                $('#FirmarEvalEmer').show()
                $('#ImprimirEvalEmerSF').show()
            }

            $("#evaluaciones-tab").click()
        } else {
            NotaEnfermeria.NroEvaluacion = 1

            swal({
                title: 'Evaluaciones',
                text: "Se iniciara la Evaluación N° " + (NotaEnfermeria.NroEvaluacion),
                type: 'info',
            }).done()

            $("#lblNumeroEvaluacion").text(`Evaluacion N° ${NotaEnfermeria.NroEvaluacion}`)

            $('#FechaInicioAtencion').datepicker("setDate", getCurrentDate());
            $('#HoraInicioAtencion').val(getCurrentHour());

            $('#ImprimirEvalEmerCF').hide()
            $('#FirmarEvalEmer').hide()
            $('#ImprimirEvalEmerSF').hide()
        }

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    LLenarCombos() {

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
                $('#cboTipoGestacion').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoGestacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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
                $('#cboNumeroGemelar').empty();
                NotaEnfermeria.gemelar = datos.table;
                /*
                $(datos.table).each(function (i, obj) {
                    $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });*/
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
            url: "/RecienNacido/ListarCondicionRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboCondicion').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboCondicion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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
                    alerta("ERROR", "Error listar tipo procedencia!", "2");
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

        var formData = new FormData();
        formData.append('IdTipoServicio', 0);
        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListarServicioPorTipoServicio?area=Comun",
            data: JSON.stringify(formData),
            datatype: "json",
            type: "post",
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

    },

    TipoGestacion_Change() {
        $('#cboNumeroGemelar').empty();
        if ($('#cboTipoGestacion').val() == 1) {
            //console.log(medobsenf);
            $(NotaEnfermeria.gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
                if (obj.nroGemelos == 0) {
                    $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
            $('#txtNroFetos').val(0);
            $('#cboNumeroGemelar').val(0);
            $("#txtNroFetos").attr('disabled', true);
            $("#cboNumeroGemelar").attr('disabled', true);
        } else if ($('#cboTipoGestacion').val() == 2) {
            if ($('#txtNroFetos').val() == '') {
                $('#txtNroFetos').val('');
                $('#cboNumeroGemelar').val('');
            }
            $("#txtNroFetos").removeAttr('disabled', 'disabled');
            $("#cboNumeroGemelar").removeAttr('disabled', 'disabled');
        } else {
            $("#txtNroFetos").attr('disabled', true);
            $("#cboNumeroGemelar").attr('disabled', true);
        }
        $("#cboNumeroGemelar").trigger("chosen:updated");
    },

    Fetos_Change() {
        var fetos = 0;
        $('#cboNumeroGemelar').empty();
        fetos = $('#txtNroFetos').val();

        if (fetos > 0 && fetos <= 10) {
            $(NotaEnfermeria.gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
                /*
                if (fetos > 5) {
                    fetos = 5;
                }*/
                if (obj.nroGemelos == fetos) {
                    $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }

            });
        } else {
            if (fetos < 0 || fetos > 10 || (fetos == 0 && $('#cboTipoGestacion').val() == 2)) {
                $('#txtNroFetos').val('');
            } else {
                $(NotaEnfermeria.gemelar).each(function (i, obj) {
                    //console.log(obj.descripcion);
                    if (obj.nroGemelos == 0) {
                        $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });

                $('#cboNumeroGemelar').val('0');
            }
        }

        $("#cboNumeroGemelar").trigger("chosen:updated");
    },

    Condicion_Change() {
        $(".rdbObito").attr('disabled', true);
        if ($("#cboCondicion").val() == 1) {
            $(".rdbObito").prop('checked', false);
            $('#rdbObitoNo').prop('checked', true);
            $(".rdbObito").attr('disabled', true);
        }
        else if ($("#cboCondicion").val() == 3) {
            //$("#txtEspecificar").val("");
            $(".rdbObito").removeAttr('disabled', 'disabled');
        }
    },

    PatNeo_Change() {
        if ($("#rdbPatNeoSi").is(":checked")) {
            $("#txtEspecificar").val("");
            //$("#txtEspecificar").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbPatNeoNo").is(":checked")) {
            $("#txtEspecificar").val("");
            //$("#txtEspecificar").attr('disabled', true);
        } else {
            $("#txtEspecificar").val("");
            //$("#txtEspecificar").attr('disabled', true);
        }
    },

    Reanimacion_Change() {
        if ($("#rdbReanimacionSi").is(":checked")) {
            $("#cboTipoReanimacionRn").val("");
            //$("#cboTipoReanimacionRn").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbReanimacionNO").is(":checked")) {
            $("#cboTipoReanimacionRn").val("");
            //$("#cboTipoReanimacionRn").attr('disabled', true);
        } else {
            $("#cboTipoReanimacionRn").val("");
            //$("#cboTipoReanimacionRn").attr('disabled', true);
        }
        $("#cboTipoReanimacionRn").trigger("chosen:updated");
    },

    Transporte_Change() {
        if ($("#rdbTransporteSi").is(":checked")) {
            $("#cboTipoTransporteRn").val("");
            //$("#cboTipoTransporteRn").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbTransporteNO").is(":checked")) {
            $("#cboTipoTransporteRn").val("");
            //$("#cboTipoTransporteRn").attr('disabled', true);
        } else {
            $("#cboTipoTransporteRn").val("");
            //$("#cboTipoTransporteRn").attr('disabled', true);
        }
        $("#cboTipoTransporteRn").trigger("chosen:updated");
    },

    LimpiarDatos: async function () {
        NotaEnfermeria.NroEvaluacion = 1
        NotaEnfermeria.IdNotaEnfermeria = 0

        $('#cboPielColor').val(0);
        $('#txtColorPielEspecificar').val('');
        $('#cboFontanela').val(0);
        $('#txtColorPielEspecificar').val('');
        $('#cboPielColor').val(0);
    },
    LimpiarDatosEvaluacion: async function () {
        NotaEnfermeria.NroEvaluacion = 1
        NotaEnfermeria.IdNotaEnfermeria = 0

        $('#txtEvaluacionCuidadoRN').val('');
        $('#txtEvaluacionCuidadoRnFactorRiesgo').val('');
        $('#cboEnfermeraRegistra').val(0);

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    BloquearCampos: async function () {
        $('#examenFisico input').prop('disabled', true)
        $('#examenFisico select').prop('disabled', true)
        $('#examenFisico textarea').prop('disabled', true)

        $('#diagnosticos input').prop('disabled', true)
        $('#diagnosticos select').prop('disabled', true)
        $('#diagnosticos textarea').prop('disabled', true)
        $('#diagnosticos button').prop('disabled', true)

        $('#evolucionSV input').prop('disabled', true)
        $('#evolucionSV select').prop('disabled', true)
        $('#evolucionSV textarea').prop('disabled', true)
        $('#evolucionSV button').prop('disabled', true)

        $('#evolucionAT input').prop('disabled', true)
        $('#evolucionAT select').prop('disabled', true)
        $('#evolucionAT textarea').prop('disabled', true)
        $('#evolucionAT button').prop('disabled', true)

        $('#intervencionesCpt input').prop('disabled', true)
        $('#intervencionesCpt select').prop('disabled', true)
        $('#intervencionesCpt textarea').prop('disabled', true)
        $('#intervencionesCpt button').prop('disabled', true)
        $('#btnAgregarIntervencion').prop('disabled', true)
        $('#btnEliminarIntervencion').prop('disabled', true)
        $('#btnAgregarIntervenciones').prop('disabled', false)

        $('#evaluaciones input').prop('disabled', true)
        $('#evaluaciones select').prop('disabled', true)
        $('#evaluaciones textarea').prop('disabled', true)
        $('#evaluaciones button').prop('disabled', true)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    DesbloquearCampos: async function () {
        $('#examenFisico input').prop('disabled', false)
        $('#examenFisico select').prop('disabled', false)
        $('#examenFisico textarea').prop('disabled', false)

        $('#diagnosticos input').prop('disabled', false)
        $('#diagnosticos select').prop('disabled', false)
        $('#diagnosticos textarea').prop('disabled', false)
        $('#diagnosticos button').prop('disabled', false)

        $('#evolucionSV input').prop('disabled', false)
        $('#evolucionSV select').prop('disabled', false)
        $('#evolucionSV textarea').prop('disabled', false)
        $('#evolucionSV button').prop('disabled', false)

        $('#evolucionAT input').prop('disabled', false)
        $('#evolucionAT select').prop('disabled', false)
        $('#evolucionAT textarea').prop('disabled', false)
        $('#evolucionAT button').prop('disabled', false)

        $('#intervencionesCpt input').prop('disabled', false)
        $('#intervencionesCpt select').prop('disabled', false)
        $('#intervencionesCpt textarea').prop('disabled', false)
        $('#intervencionesCpt button').prop('disabled', false)
        $('#btnAgregarIntervencion').prop('disabled', false)
        $('#btnEliminarIntervencion').prop('disabled', false)
        $('#btnAgregarIntervenciones').prop('disabled', false)

        $('#evaluaciones input').prop('disabled', false)
        $('#evaluaciones select').prop('disabled', false)
        $('#evaluaciones textarea').prop('disabled', false)
        $('#evaluaciones button').prop('disabled', false)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    Events: () => {
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

                ReposicionarVista();        //KHOYOSI
                MostrarAreaLista();         //KHOYOSI
                CerrarModulo();             //KHOYOSI
                oTable_Atenciones.resize();
            }).catch(swal.noop);

        });
        $('#btnBuscarAtenciones').on('click', async () => {

            if ($('#txtFechaInicio').val() == '') {
                alerta(2, 'Ingrese la Fecha de Inicio')
                return
            }

            if ($('#txtFechaFin').val() == '') {
                alerta(2, 'Ingrese la Fecha Final')
                return
            }

            Cargando(1)

            oTable_Atenciones.fnClearTable()
            let data = await NotaEnfermeria.ListarAtencionesNotaEnfermeria($('#txtNroCuentaBusqueda').val(), NotaEnfermeria.NroEvaluacion)

            if (data && !isEmpty(data)) {
                oTable_Atenciones.fnAddData(data)
            }
            
            Cargando(0)
        })
        $('#btnGuardar').on('click', async () => {

            Cargando(1)

            await NotaEnfermeria.GuardarNotaEnfermeriaNeo()

            if (NotaEnfermeria.NroEvaluacion > 0) {
                await NotaEnfermeria.CrearModificarNotaEnfermeriaNeoEvaluacion(
                    IdAtencion = NotaEnfermeria.IdAtencion, NroEvaluacion = NotaEnfermeria.NroEvaluacion, FechaRegistro = $('#FechaInicioAtencion').val(), HoraRegistro = $('#HoraInicioAtencion').val(),
                    EvaluacionCuidadoRn = $('#txtEvaluacionCuidadoRN').val(), EvaluacionCuidadoRnFactorRiesgo = $('#txtEvaluacionCuidadoRnFactorRiesgo').val(),
                    IdEnfermeraAtiende = $('#cboEnfermeraRegistra').val())
            }

            await NotaEnfermeria.GuardarIntervencionesNotaEnfermeriaNeo()

            let objRow = oTable_Atenciones.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Por favor seleccione un registro.')
                return false
            }
            // await NotaEnfermeria.CargarDatosAtencion(objRow)

            await NotaEnfermeria.LimpiarDatos()
            await NotaEnfermeria.LimpiarDatosEvaluacion()
            swal({
                title: 'Evaluaciones',
                text: "La Evaluación N° " + (NotaEnfermeria.NroEvaluacion) + " fue registrada con exito.",
                type: 'success',
            }).done()

            ReposicionarVista();        //KHOYOSI
            MostrarAreaLista();         //KHOYOSI
            CerrarModulo();             //KHOYOSI
            oTable_Atenciones.resize();

            Cargando(0)
        })

        $('#btnAgregarEvolucionSV').on('click', () => {

            if ($('#txtHoraRegistroEvolucion').val() == '') {
                alerta(2, 'Ingresa la hora de registro')
                $('#txtHoraRegistroEvolucion').focus()
                return
            }

            var f = new Date();
            var dia = f.getDate();
            var mes = (f.getMonth() + 1);
            if (dia < 10)
                dia = '0' + dia; //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes

            FechaHoy = dia + "/" + mes + "/" + f.getFullYear();

            let time = (f.getHours() < 10 ? ("0" + f.getHours()) : f.getHours()) + ":" + (f.getMinutes() < 10 ? ("0" + f.getMinutes()) : f.getMinutes())

            //$('#txtHoraRegistroEvolucion').val(time)

            var objRow = {
                fechaRegistro: FechaHoy + ' ' + $('#txtHoraRegistroEvolucion').val(),
                horaRegistro: $('#txtHoraRegistroEvolucion').val(),
                temperatura: $('#txtTemperaturaEvolucion').val(),
                frecuenciaCardiaca: $('#txtFCardiacaEvolucion').val(),
                frecuenciaRespiratoria: $('#txtFRespiratoriaEvolucion').val(),
                presionSiastolica: $('#txtPresionSiastoEvolucion').val(),
                presionDiastolica: $('#txtPresionDiastoEvolucion').val(),
                presionPromedio: $('#txtPresionPromedioEvolucion').val(),
                peso: $('#txtPesoEvolucion').val(),
                saturacion: $('#txtSaturacionEvolucion').val(),
                hgt: $('#txtHgtEvolucion').val(),
            }


            insertarDatosGrafico(charFrecCardiaca.data, objRow.horaRegistro, objRow.frecuenciaCardiaca)

            insertarDatosGrafico(charFrecRespiratoria.data, objRow.horaRegistro, objRow.frecuenciaRespiratoria)

            insertarDatosGrafico(charTemperatura.data, objRow.horaRegistro, objRow.temperatura)


            charFrecCardiaca.update();
            charFrecRespiratoria.update();
            charTemperatura.update();


            oTable_EvolucionSv.api(true).row.add(objRow).draw(false);

            $('#txtHoraRegistroEvolucion').val('')
            $('#txtTemperaturaEvolucion').val('')
            $('#txtFCardiacaEvolucion').val('')
            $('#txtFRespiratoriaEvolucion').val('')
            $('#txtPresionSiastoEvolucion').val('')
            $('#txtPresionDiastoEvolucion').val('')
            $('#txtPresionPromedioEvolucion').val('')
            $('#txtPesoEvolucion').val('')
            $('#txtSaturacionEvolucion').val('')
            $('#txtHgtEvolucion').val('')

            $('#txtHoraRegistroEvolucion').val('') 
        })

        $('#btnModificarEvolucionSV').on('click', () => {

            let row = oTable_EvolucionSv.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            if ($('#txtHoraRegistroEvolucion').val() == '') {
                alerta(2, 'Ingresa la hora de registro')
                $('#txtHoraRegistroEvolucion').focus()
                return
            }

            var f = new Date();
            var dia = f.getDate();
            var mes = (f.getMonth() + 1);
            if (dia < 10)
                dia = '0' + dia; //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes

            FechaHoy = dia + "/" + mes + "/" + f.getFullYear();

            

            var objRow = {
                fechaRegistro: FechaHoy + ' ' + $('#txtHoraRegistroEvolucion').val(),
                horaRegistro: $('#txtHoraRegistroEvolucion').val(),
                temperatura: $('#txtTemperaturaEvolucion').val(),
                frecuenciaCardiaca: $('#txtFCardiacaEvolucion').val(),
                frecuenciaRespiratoria: $('#txtFRespiratoriaEvolucion').val(),
                presionSiastolica: $('#txtPresionSiastoEvolucion').val(),
                presionDiastolica: $('#txtPresionDiastoEvolucion').val(),
                presionPromedio: $('#txtPresionPromedioEvolucion').val(),
                peso: $('#txtPesoEvolucion').val(),
                saturacion: $('#txtSaturacionEvolucion').val(),
                hgt: $('#txtHgtEvolucion').val(),
            }

            oTable_EvolucionSv.api(true).row('.selected').remove().draw(false);
            oTable_EvolucionSv.api(true).row.add(objRow).draw(false);

            limpiarDatosGrafico(charFrecCardiaca)
            limpiarDatosGrafico(charFrecRespiratoria)
            limpiarDatosGrafico(charTemperatura)



            $(oTable_EvolucionSv.api(true).data().toArray()).each((i, obj) => {

                insertarDatosGrafico(charFrecCardiaca.data, obj.horaRegistro, obj.frecuenciaCardiaca)

                insertarDatosGrafico(charFrecRespiratoria.data, obj.horaRegistro, obj.frecuenciaRespiratoria)

                insertarDatosGrafico(charTemperatura.data, obj.horaRegistro, obj.temperatura)


                charFrecCardiaca.update();
                charFrecRespiratoria.update();
                charTemperatura.update();
            })


            $('#txtHoraRegistroEvolucion').val('')
            $('#txtTemperaturaEvolucion').val('')
            $('#txtFCardiacaEvolucion').val('')
            $('#txtFRespiratoriaEvolucion').val('')
            $('#txtPresionSiastoEvolucion').val('')
            $('#txtPresionDiastoEvolucion').val('')
            $('#txtPresionPromedioEvolucion').val('')
            $('#txtPesoEvolucion').val('')
            $('#txtSaturacionEvolucion').val('')
            $('#txtHgtEvolucion').val('')

            $('#txtHoraRegistroEvolucion').val('')
        })

        $('#btnEliminarEvolucionSV').on('click', () => {

            let row = oTable_EvolucionSv.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            
            oTable_EvolucionSv.api(true).row('.selected').remove().draw(false);

            limpiarDatosGrafico(charFrecCardiaca)
            limpiarDatosGrafico(charFrecRespiratoria)
            limpiarDatosGrafico(charTemperatura)

            $(oTable_EvolucionSv.api(true).data().toArray()).each((i, obj) => {

                insertarDatosGrafico(charFrecCardiaca.data, obj.horaRegistro, obj.frecuenciaCardiaca)

                insertarDatosGrafico(charFrecRespiratoria.data, obj.horaRegistro, obj.frecuenciaRespiratoria)

                insertarDatosGrafico(charTemperatura.data, obj.horaRegistro, obj.temperatura)


                charFrecCardiaca.update();
                charFrecRespiratoria.update();
                charTemperatura.update();
            })

        })


        $('#btnAgregarEvolucionAT').on('click', () => {

            if ($('#txtHoraRegistroEvolucionAt').val() == '') {
                alerta(2, 'Ingresa la hora de registro')
                $('#txtHoraRegistroEvolucionAt').focus()
                return
            }

            var f = new Date();
            var dia = f.getDate();
            var mes = (f.getMonth() + 1);
            if (dia < 10)
                dia = '0' + dia; //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes

            FechaHoy = dia + "/" + mes + "/" + f.getFullYear();

            let time = (f.getHours() < 10 ? ("0" + f.getHours()) : f.getHours()) + ":" + (f.getMinutes() < 10 ? ("0" + f.getMinutes()) : f.getMinutes())

            //$('#txtHoraRegistroEvolucionAt').val(time)//$('#txtHoraRegistroEvolucionAt').val(time)

            var objRow = {
                fechaRegistro: FechaHoy + ' ' + $('#txtHoraRegistroEvolucionAt').val(),
                horaRegistro: $('#txtHoraRegistroEvolucionAt').val(),
                idSoporteO2: $('#cboSoporteO2EvolucionAt').val(),
                soporteO2: $('#cboSoporteO2EvolucionAt option:selected').text(),
                idCanalizacionEv: $('#cboCanalizacionEvEvolucionAt').val(),
                canalizacionEv: $('#cboCanalizacionEvEvolucionAt option:selected').text(),
                idInmovilizacionMiembro: $('#cboInmovilizacionMiembroEvaluacionAt').val(),
                inmovilizacionMiembro: $('#cboInmovilizacionMiembroEvaluacionAt option:selected').text(),
                idAlimentacion: $('#cboAlimentacionEvaluacionAt').val(),
                alimentacion: $('#cboAlimentacionEvaluacionAt option:selected').text(),
                detalleFormula: $('#txtDetalleFormulaEvolucionAt').val(),
                idEliminacion: $('#cboEliminacionEvolucionAt').val(),
                eliminacion: $('#cboEliminacionEvolucionAt option:selected').text(),
                detalleEliminacion: $('#txtEliminacionEvolucionAt').val(),
            }
            oTable_EvolucionAt.api(true).row.add(objRow).draw(false);

            $('#txtHoraRegistroEvolucionAt').val('')
            $('#cboSoporteO2EvolucionAt').val('')
            $('#cboCanalizacionEvEvolucionAt').val('')
            $('#cboInmovilizacionMiembroEvaluacionAt').val('')
            $('#cboAlimentacionEvaluacionAt').val('')
            $('#txtDetalleFormulaEvolucionAt').val('')
            $('#cboEliminacionEvolucionAt').val('')
            $('#txtEliminacionEvolucionAt').val('')

            $('.chzn-select').chosen().trigger("chosen:updated");

        })

        $('#btnModificarEvolucionAT').on('click', () => {

            let row = oTable_EvolucionAt.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            if ($('#txtHoraRegistroEvolucionAt').val() == '') {
                alerta(2, 'Ingresa la hora de registro')
                $('#txtHoraRegistroEvolucionAt').focus()
                return
            }

            var f = new Date();
            var dia = f.getDate();
            var mes = (f.getMonth() + 1);
            if (dia < 10)
                dia = '0' + dia; //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes

            FechaHoy = dia + "/" + mes + "/" + f.getFullYear();



            var objRow = {
                fechaRegistro: FechaHoy + ' ' + $('#txtHoraRegistroEvolucionAt').val(),
                horaRegistro: $('#txtHoraRegistroEvolucionAt').val(),
                idSoporteO2: $('#cboSoporteO2EvolucionAt').val(),
                soporteO2: $('#cboSoporteO2EvolucionAt option:selected').text(),
                idCanalizacionEv: $('#cboCanalizacionEvEvolucionAt').val(),
                canalizacionEv: $('#cboCanalizacionEvEvolucionAt option:selected').text(),
                idInmovilizacionMiembro: $('#cboInmovilizacionMiembroEvaluacionAt').val(),
                inmovilizacionMiembro: $('#cboInmovilizacionMiembroEvaluacionAt option:selected').text(),
                idAlimentacion: $('#cboAlimentacionEvaluacionAt').val(),
                alimentacion: $('#cboAlimentacionEvaluacionAt option:selected').text(),
                detalleFormula: $('#txtDetalleFormulaEvolucionAt').val(),
                idEliminacion: $('#cboEliminacionEvolucionAt').val(),
                eliminacion: $('#cboEliminacionEvolucionAt option:selected').text(),
                detalleEliminacion: $('#txtEliminacionEvolucionAt').val(),
            }

            oTable_EvolucionAt.api(true).row('.selected').remove().draw(false);
            oTable_EvolucionAt.api(true).row.add(objRow).draw(false);

           

            $('#txtHoraRegistroEvolucionAt').val('')
            $('#cboSoporteO2EvolucionAt').val('')
            $('#cboCanalizacionEvEvolucionAt').val('')
            $('#cboInmovilizacionMiembroEvaluacionAt').val('')
            $('#cboAlimentacionEvaluacionAt').val('')
            $('#txtDetalleFormulaEvolucionAt').val('')
            $('#cboEliminacionEvolucionAt').val('')
            $('#txtEliminacionEvolucionAt').val('')

            $('.chzn-select').chosen().trigger("chosen:updated");

        })

        $('#btnEliminarEvolucionAT').on('click', () => {

            let row = oTable_EvolucionAt.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }


            oTable_EvolucionAt.api(true).row('.selected').remove().draw(false);

        })

        $('#btnModificarAtencion').on('click', async function () {
            let objRow = oTable_Atenciones.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Por favor seleccione un registro.')
                return false
            }

            Cargando(1)

            let data = await NotaEnfermeria.ListarAtencionesNotaEnfermeria(objRow.idCuentaAtencion, NotaEnfermeria.NroEvaluacion)

            await NotaEnfermeria.CargarDatosAtencion(data[0])

            await NotaEnfermeria.CargarDatosEvaluacion()

            NotaEnfermeria.DesbloquearCampos()

            Cargando(0)
            MostrarAreaRegistro();

        })

        $('#btnConsultarAtencion').on('click', async function () {
            let objRow = oTable_Atenciones.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Por favor seleccione un registro.')
                return false
            }
            Cargando(1)
            await NotaEnfermeria.CargarDatosAtencion(objRow)

            await NotaEnfermeria.CargarDatosEvaluacion()

            NotaEnfermeria.BloquearCampos()

            Cargando(0)
            MostrarAreaRegistro();

        })

        $('#btnNuevaEvaluacion').on('click', async () => {

            NotaEnfermeria.LimpiarDatosEvaluacion()
            let eval = oTable_Evaluacion.DataTable().data().count();

            NotaEnfermeria.NroEvaluacion = eval + 1

            Cargando(1)

            

            swal({
                title: 'Evaluaciones',
                text: "Se iniciara la Evaluación N° " + (NotaEnfermeria.NroEvaluacion),
                type: 'info',
            }).done()

            $("#evaluaciones-tab").click()
            $("#lblNumeroEvaluacion").text(`Evaluacion N° ${NotaEnfermeria.NroEvaluacion}`)

            $('#FechaInicioAtencion').datepicker("setDate", getCurrentDate());
            $('#HoraInicioAtencion').val(getCurrentHour());

            $('#cboEnfermeraRegistra').val($('#idUsuariotxt').val())

            oTable_Evaluacion.$('tr.selected').removeClass('selected');
            $('.chzn-select').chosen().trigger("chosen:updated")

            

            Cargando(0)
        })
        //$('#btnAgregarIntervenciones').on('click', async function () {

        //    var objrowConsumoServ = oTable_consumoServAtencion.api(true).row('.selected').data();

        //    if (objrowConsumoServ.codigo == '99436' || objrowConsumoServ.codigo == '99460' || objrowConsumoServ.codigo == '99468') {
        //        $('#txtCodigoCptIntervencion').val(objrowConsumoServ.codigo)
        //        $('#txtDescripcionIntervencion').val(objrowConsumoServ.nombre)

        //        let intervencion = await NotaEnfermeria.SeleccionarIntervencionesEnfermeriaByCpt(objrowConsumoServ.codigo)

        //        let filterIntervenciones = NotaEnfermeria.Intervenciones.filter(obj => (obj.cpt == objrowConsumoServ.codigo))

        //        oTable_IntervencionesEnfemeria.fnClearTable()
        //        if (filterIntervenciones.length > 0) {
        //            oTable_IntervencionesEnfemeria.fnAddData(filterIntervenciones)
        //        }

        //        // await NotaEnfermeria.SeleccionarIntervencionesEnfermeriaByIdAtencionAndCpt(Variables.IdAtencion, objrowConsumoServ.codigo)

        //        $('#modalIntervencionEnfermeria').modal('show')
        //    } else {
        //        swal({
        //            title: 'Evaluaciones',
        //            text: "No existen Actividades para el Código: " + (objrowConsumoServ.codigo),
        //            type: 'info',
        //        }).done()
        //    }


        //})
        //$('#btnCerrarModalIntervencion').on('click', async function () {
        //    $('#modalIntervencionEnfermeria').modal('hide')
        //})
        //$('#btnAgregarIntervencion').on('click', async function () {

        //    let objrowConsumoServ = oTable_consumoServAtencion.api(true).row('.selected').data();

        //    lstIntegracion = oTable_IntervencionesEnfemeria.api(true).rows().data();

        //    for (let i = 0; i < lstIntegracion.length; i++) {
        //        if (lstIntegracion[i].idIntervencion == $('#cboIntervencionesEnfermeria').val()) {
        //            alerta(2, 'La intervención ya fue agregado')
        //            return true;
        //        }
        //    }

        //    let intervencion = {
        //        cpt: objrowConsumoServ.codigo,
        //        idIntervencion: $('#cboIntervencionesEnfermeria').val(),
        //        descripcion: $('#cboIntervencionesEnfermeria option:selected').text()
        //    }

        //    NotaEnfermeria.Intervenciones.push(intervencion)

        //    oTable_IntervencionesEnfemeria.fnAddData(intervencion)


        //    $('#modalIntervencionEnfermeria').modal('show')
        //})
        //$('#btnEliminarIntervencion').on('click', function () {
        //    let objIntervenciones = oTable_IntervencionesEnfemeria.api(true).row('.selected').data();

        //    if (!isEmpty(objIntervenciones)) {
        //        NotaEnfermeria.Intervenciones = NotaEnfermeria.Intervenciones.filter(obj => !(obj.cpt == objIntervenciones.cpt && obj.idIntervencion == objIntervenciones.idIntervencion));

        //        oTable_IntervencionesEnfemeria.api(true).row('.selected').remove().draw(false);
        //    } else {
        //        alerta(2, "Debe Seleccionar el registro para eliminar.");
        //    }
        //})
        //$('#btnGuardarIntervenciones').on('click', async function () {
        //    Cargando(1)
        //    await NotaEnfermeria.GuardarIntervencionesNotaEnfermeriaNeo()
        //    Cargando(0)
        //})

        $('#tblAtenciones tbody').on('click', '.btnInformeEvaluacion', async function () {
            var objrow = oTable_Atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_Atenciones.fnGetData(objrow)

            NotaEnfermeria.IdNotaEnfermeria = row.idNotaEnfermeria;
            NotaEnfermeria.IdAtencion = row.idAtencion;
            // RegistroEvaluacionesUCI.IdServicio = row.idServicioEgreso;
            //await AdmisionEmergencia.SeleccionarEvaluacionDetalle(AdmisionEmergencia.IdAtencion, AdmisionEmergencia.IdServicioEgreso);
            //await AdmisionEmergencia.SeleccionarEvaluacionDetalle(AdmisionEmergencia.IdAtencion, 0);

            let evaluaciones = await NotaEnfermeria.SeleccionarNotaEnfermeriaNeoEvaluacion(NotaEnfermeria.IdAtencion, NotaEnfermeria.IdNotaEnfermeria, 0)

            oTable_EvaInf.fnClearTable()

            if (!isEmpty(evaluaciones)) {
                if (evaluaciones.length > 0) {

                    oTable_EvaInf.fnAddData(evaluaciones)

                }
            }

            $("#modalInformeEvaluacion").modal("show");
        });

        $("#btnCerrarInformeEvaluacion").on('click', function () {
            //AdmisionEmergencia.IdAtencion = 0;
            //AdmisionEmergencia.IdServicioEgreso = 0;
            $("#modalInformeEvaluacion").modal("hide");
        })
        $('#tblIntervencionesEnfemeria tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_IntervencionesEnfemeria.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

        });

        $('#btnAñadirDiagnosticoNanda').on('click', async function () {

            if (isEmpty($('#cboDiagnosticosNanda>option:selected').attr("codificacionNanda"))) {
                alerta(2, 'Seleccione un diagnostico.')
                return
            }

            lstDiagnosticos = oTable_DiagnosticosEnfermeria.api(true).rows().data();

            for (let i = 0; i < lstDiagnosticos.length; i++) {
                if (lstDiagnosticos[i].idDiagnostico == $('#cboDiagnosticosNanda').val()) {
                    alerta(2, 'El Diagnostico ya fue agregado')
                    return true;
                }
            }

            let diagnosticosEnfermeria = {
                codificacionNanda: $('#cboDiagnosticosNanda>option:selected').attr("codificacionNanda"),
                idDiagnostico: $('#cboDiagnosticosNanda').val(),
                enunciado: $('#cboDiagnosticosNanda option:selected').text()
            }

            oTable_DiagnosticosEnfermeria.fnAddData(diagnosticosEnfermeria)
        })

        $('#btnQuitarDiagnosticoNanda').on('click', async function () {

            oTable_DiagnosticosEnfermeria.api(true).row('.selected').remove().draw(false);

        })
        $('#lstDiagnosticosEnfermeria tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_DiagnosticosEnfermeria.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

        });


        $('#ImprimirEvalEmerSF').on('click', async function () {
            var objrow = oTable_Evaluacion.api(true).row('.selected').index();
            var row = oTable_Evaluacion.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                //if (typeof row.usaModuloMaterno === 'undefined') {
                //    alerta(2, "Seleccione Fila");
                //} else {

                //    const pdf = await Utilitario.GenerarHojaInformeUCI(row.idCuentaAtencion, row.idAtencion, row.idAtencionDetalleUCI, row.idServicioIngreso, row.nroEvaluacion);

                //    if (pdf) {
                //        alerta('1', 'Se generó el documento correctamente.')
                //        $("#btnBuscarAtenciones").click();
                //    } else {
                //        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                //    }
                //}


            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });

        $('#tblAtenciones tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_Atenciones.api(true).row($(this)).index();
            var row = oTable_Atenciones.fnGetData(pos);

            console.log('row', row)

        });
        $('#tblEvaluaciones tbody').on('click', 'tr', async function () {

            let objRow = oTable_Atenciones.api(true).row('.selected').data()

            oTable_Evaluacion.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            Cargando(1)

            

            

            await NotaEnfermeria.CargarDatosEvaluacion()

            let data = await NotaEnfermeria.ListarAtencionesNotaEnfermeria(objRow.idCuentaAtencion, NotaEnfermeria.NroEvaluacion)

            //await NotaEnfermeria.CargarDatosAtencion(data[0])
            Cargando(0)
        });

        $('#tblInformeEvaluaciones tbody').on('click', '.ImprimirEvalSF', async function () {
            var objrow = oTable_EvaInf.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInf.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                // if (typeof row.usaModuloMaterno === 'undefined') {
                //     alerta(2, "Seleccione Fila");
                // } else {

                //     const pdf = await Utilitario.GenerarHojaInformeUCI(row.idCuentaAtencion, row.idAtencion, row.idAtencionDetalleUCI, row.idServicioIngreso, row.nroEvaluacion);

                //     if (pdf) {
                //         alerta('1', 'Se generó el documento correctamente.')
                //         $("#btnBuscarAtenciones").click();
                //     } else {
                //         alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                //     }
                // }


            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
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

        $('#tblInformeEvaluaciones tbody').on('click', '.FirmarEvalSF', async function () {
            var objrow = oTable_EvaInf.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInf.fnGetData(objrow);
            Utilitario.TipoArchivoFirmar = 'NE-NEO'
            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI            
            if (firma) {
                /*if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(row.code); }*/
                // if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
                // if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }

                await Utilitario.IniciarServicioFirmaPeru(row.code);
            }
            Cargando(0);
        });

        $('#tblEvolucionSv tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_EvolucionSv.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }



            var pos = oTable_EvolucionSv.api(true).row($(this)).index();
            var row = oTable_EvolucionSv.fnGetData(pos);

            console.log('row', row)

        });
        $('#tblEvolucionAt tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_EvolucionAt.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_EvolucionAt.api(true).row($(this)).index();
            var row = oTable_EvolucionAt.fnGetData(pos);

            $('#txtHoraRegistroEvolucionAt').val('')
            $('#cboSoporteO2EvolucionAt').val('')
            $('#cboCanalizacionEvEvolucionAt').val('')
            $('#cboInmovilizacionMiembroEvaluacionAt').val('')
            $('#cboAlimentacionEvaluacionAt').val('')
            $('#txtDetalleFormulaEvolucionAt').val('')
            $('#cboEliminacionEvolucionAt').val('')
            $('#txtEliminacionEvolucionAt').val('')

            $('.chzn-select').chosen().trigger("chosen:updated");

            console.log('row', row)

        });

        $('#tblEvolucionSv tbody').on('dblclick', 'tr', async function () {

            oTable_EvolucionSv.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            try {
                resultado = await alertaAsync('question', 'Atención', `¿Desea modificar el registro?`)
            } catch (e) {
                console.log('Accion de usuario: No se permite continuar', e)
                return false
            }

            if (resultado) {

                var pos = oTable_EvolucionSv.api(true).row($(this)).index();
                var row = oTable_EvolucionSv.fnGetData(pos);


                $('#txtHoraRegistroEvolucion').val(row.horaRegistro)
                $('#txtTemperaturaEvolucion').val(row.temperatura)
                $('#txtFCardiacaEvolucion').val(row.frecuenciaCardiaca)
                $('#txtFRespiratoriaEvolucion').val(row.frecuenciaRespiratoria)
                $('#txtPresionSiastoEvolucion').val(row.presionSiastolica)
                $('#txtPresionDiastoEvolucion').val(row.presionDiastolica)
                $('#txtPresionPromedioEvolucion').val(row.presionPromedio)
                $('#txtPesoEvolucion').val(row.peso)
                $('#txtSaturacionEvolucion').val(row.saturacion)
                $('#txtHgtEvolucion').val(row.hgt)

                console.log('row', row)
            }
        });
        $('#tblEvolucionAt tbody').on('dblclick', 'tr', async function () {

            oTable_EvolucionAt.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            try {
                resultado = await alertaAsync('question', 'Atención', `¿Desea modificar el registro?`)
            } catch (e) {
                console.log('Accion de usuario: No se permite continuar', e)
                return false
            }

            if (resultado) {

                var pos = oTable_EvolucionAt.api(true).row($(this)).index();
                var row = oTable_EvolucionAt.fnGetData(pos);

                $('#txtHoraRegistroEvolucionAt').val(row.horaRegistro)
                $('#cboSoporteO2EvolucionAt').val(row.idSoporteO2)
                $('#cboCanalizacionEvEvolucionAt').val(row.idCanalizacionEv)
                $('#cboInmovilizacionMiembroEvaluacionAt').val(row.idInmovilizacionMiembro)
                $('#cboAlimentacionEvaluacionAt').val(row.idAlimentacion)
                $('#txtDetalleFormulaEvolucionAt').val(row.detalleFormula)
                $('#cboEliminacionEvolucionAt').val(row.idAlimentacion)
                $('#txtEliminacionEvolucionAt').val(row.detalleEliminacion)

                console.log('row', row)
                $('.chzn-select').chosen().trigger("chosen:updated");
            } 

            
        });
        ////////////////////////////FIRMA DIGITAL///////////////////////////////////////
        $('#ImprimirEvalEmerSF').on('click', async function () {
            var objrow = oTable_Evaluacion.api(true).row('.selected').data();

            Cargando(1);
            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(objrow.code)
                if (isEmpty(firma)) {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                    // const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(objrow.idCuentaAtencion, objrow.idEvaluacionDetalle, objrow.idAtencion, objrow.idServicio, objrow.idNumero);

                    // if (pdf) {
                    //     alerta('1', 'Se generó el documento correctamente.')
                    //     $("#btnBuscarAtenciones").click();
                    // } else {
                    //     alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                    // }
                } else {
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }
            }
            Cargando(0);
        });

        $('#FirmarEvalEmer').on('click', async function () {
            var objrowTb = oTable_Evaluacion.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.')
                return false
            }

            Utilitario.TipoArchivoFirmar = 'NE-NEO';
            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(objrowTb.code)               //KHOYOSI            
            if (firma) {
                await Utilitario.IniciarServicioFirmaPeru(objrowTb.code);
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
            var objrowTb = oTable_Evaluacion.api(true).row('.selected').data();
            Cargando(1);
            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(objrowTb.code);
            }
            Cargando(0);
        });
        ///////////////////////////////////////////////////////////////////////////////////////
    },

    Init: function () {
        NotaEnfermeria.ServicioSeleccionarPorTipoServicioYEspecialidad(3)
        NotaEnfermeria.ListarEmpleadosNotaEnfermeria()
        NotaEnfermeria.ListarOpcionesNotaEnfermeria()
        NotaEnfermeria.ListarDiagnosticosNANDA()
        NotaEnfermeria.LLenarCombos()

        $('#triajeRn input').prop('disabled', true)
        $('#triajeRn select').prop('disabled', true)
        $('#triajeRn textarea').prop('disabled', true)
        $('#triajeRn button').prop('disabled', true)
        $('.chzn-select').chosen().trigger("chosen:updated")


        $('#txtFechaInicio').datepicker("setDate", getCurrentDate());
        $('#txtFechaFin').datepicker("setDate", getCurrentDate()); // JDELGADOPM

        // Diagnosticos.PanelDx = '#PanelDiagnosticoClap ';

        // Diagnosticos.IniciarScript()
        // BusquedaDiagnosticos.IniciarScript();

        $('#btnAgregarIntervenciones').show()
    }
}

$(document).ready(() => {

    NotaEnfermeria.Plugins()

    NotaEnfermeria.InitDatablesAtenciones()
    NotaEnfermeria.InitDataTablesEvaluacion()
    //NotaEnfermeria.InitDataTablesIntervencionesEnfemeria()

    NotaEnfermeria.InitDataTablesDiagnosticosEnfermeria()

    NotaEnfermeria.InitChartFrecCardiaca()
    NotaEnfermeria.InitChartFrecRespiratoria()
    NotaEnfermeria.InitChartTemperatura()

    NotaEnfermeria.InitDatablesEvolucionSV()
    NotaEnfermeria.InitDatablesEvolucionAT()
    NotaEnfermeria.InitDataTablesInformeEvaluacion()



    NotaEnfermeria.Events()
    NotaEnfermeria.Init()

    ConsumoServicio.IniciarScript();
    //ConsumoServicio.initDatablesConsumoServicio();
    //ConsumoServicio.initDatablesConsumoAtencion();
    ////ConsumoServicio.initDatables();
    //ConsumoServicio.eventos();
})

function horaAMinutos(hora) {
    let [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
}
function extraerNumero(valor) {
    let match = valor?.toString().match(/-?\d+(\.\d+)?/); // Busca la parte numérica (entero o decimal)
    return match ? parseFloat(match[0]) : null; // Convierte a número o devuelve null
}

function insertarDatosGrafico(data, hora, valor) {


    let dataCard = data;
    // Crear un array de objetos con las horas y valores
    let datos = dataCard.labels.map((hora, i) => ({
        horaRegistro: hora,
        valor: extraerNumero(dataCard.datasets[0].data[i])
    }));

    // Agregar el nuevo dato
    datos.push({
        horaRegistro: hora,
        valor: extraerNumero(valor)
    })

    // Ordenar los datos por hora
    datos.sort((a, b) => horaAMinutos(a.horaRegistro) - horaAMinutos(b.horaRegistro));

    // Reemplazar los datos en el chart ordenados
    dataCard.labels = datos.map(d => d.horaRegistro);
    dataCard.datasets[0].data = datos.map(d => d.valor);
}

function limpiarDatosGrafico(chart) {
    chart.data.labels = []; // Limpiar etiquetas (horas)
    chart.data.datasets.forEach(dataset => dataset.data = []); // Limpiar datos
    chart.update(); // Actualizar gráfico
}