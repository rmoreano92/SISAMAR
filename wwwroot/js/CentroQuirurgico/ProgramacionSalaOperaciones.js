var infoFecha = null;

let ProgramacionSalaOperaciones = {
    idDepartamento: 7,
    tipoTurno: 2, // Programada
    opcion: '',

    idProgramacionMedicaSop: 0,
    idPaciente: 0,
    idOrdenProg: 0,
    idSolicitudSOP: 0,
    idEspecialidad: 0,

    fechaInicioSeleccionada: '',
    fechaFinSeleccionada: '',


    Init: async function () {
        await this.Plugins()

        this.DataTableMedicos()
        this.InitDatablesPacientesBusqueda()
        this.InitDatableDiagnostico()
        this.InitDatablesSolicitudCQx()

        await this.ListarM_SalaCQx()
        await this.ListarM_SalaFiltroCQx()
        //await this.ListarM_QuirofanoCQx(objRow.idSalaProg)
        await this.ListarM_TipoCirugiaCQx()
        

        await this.ListarDepartamentos()
        await this.ListarMedicos()
        await this.ListarEspecialidadPorDepartamento(this.idDepartamento);

        await this.ListarMedicosPorEspecialidad(0);

        await this.Events()
    },
    Plugins: async function () {
        //$(".hide_search").chosen({ disable_search_threshold: 10 });
        //$(".chzn-select").chosen({ allow_single_deselect: true, width: "100%" });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
        //$(".chzn-select-deselect,#select2_sample").chosen();


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

        let FechaHora = await Utilitario.FechaHoraServidor();
        let mesActual = parseInt(FechaHora.substring(3, 5));
        let anioActual = FechaHora.substring(6, 10);
        for (i = 1992; i < 2072; i += 1) {
            $('#cboAnioCalendario').append(`<option value="${i}">${i}</option>`)
        }
        $('#cboMesCalendario').val(mesActual);
        $('#cboAnioCalendario').val(anioActual);



        opts = {
            //header: {
            //    left: '',
            //    center: 'title',
            //    right: '',
            //},
            header: false,
            locale: 'es',
            //height: 280,
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],

            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            //dayClick: async function (date, jsEvent, view) {
            //    //Cargando(1)
            //    let fecha = date.format();

            //    let mesSeleccionado = parseInt(fecha.substr(5, 2));
            //    //console.log(mesSeleccionado)

            //    let idMed = $('#cboMedicoProgramacionFiltro').val();
            //    let anio = $('#cboAnioCalendario').val();
            //    let mes = $('#cboMesCalendario').val();

            //    if (mesSeleccionado == mes) {
            //        if (idMed > 0 && anio > 0 && mes > 0) {
            //            await ProgramacionMedica.ListarProgramacionMedicaMensual(1, 0, 0, 0, idMed, 0, anio, mes);
            //        }

            //        let fechaF = fecha.substr(8, 2) + '/' + fecha.substr(5, 2) + '/' + fecha.substr(0, 4);
            //        if (esFormatoFecha(fechaF)) {
            //            await ProgramacionMedica.ListarProgramacionMedica(1, 0, 0, 0, 0, 0, fechaF);
            //        }

            //        ProgramacionMedica.fechaSeleccionada = fechaF;

            //        $(".day-highlight").removeClass("day-highlight");
            //        $(this).addClass("day-highlight");
            //    }

            //},
            dayRender: function (date, cell) {
                let today = new Date()
                if (moment(Date.now()).format('L') === date.format('L')) {
                    $(cell).addClass("day-highlight");
                }
            },
            eventRender: function (event, element) {
                if (event.title) {
                    element.find('.fc-title').html(event.title);  // Interpreta el HTML del título
                }
            },
            eventClick: async function (event) {
                let fecha = event.start.format('YYYY-MM-DD');
            },
            beforeShowDay: function (date) {
                let selectedMonth = new Date().getMonth(); // Obtener mes actual (puedes cambiarlo)
                return [date.getMonth() === selectedMonth]; // Habilitar solo días del mes actual
            },
            selectable: true, // Habilita la selección
            selectHelper: true, // Muestra un área visual mientras seleccionas
            selectAllow: function (selectInfo) {
                let fechaInicio = moment(selectInfo.start).format('DD/MM/YYYY');
                let fechaFin = moment(selectInfo.end).subtract(1, 'days').format('DD/MM/YYYY');

                // Obtener el mes de inicio y fin
                let mesInicio = parseInt(fechaInicio.substr(4, 2));
                let mesFin = parseInt(fechaFin.substr(4, 2));

                $(".fc-day").removeClass('fc-selected-day');
                //console.log("Fecha Inicio: " + fechaInicio);
                //console.log("Fecha Fin: " + fechaFin);
                // Permitir selección solo si ambos están en el mismo mes
                return (mesInicio == $("#cboMesCalendario").val() && mesFin == $("#cboMesCalendario").val());
            },
            select: async function (start, end) {
                // Formatear las fechas seleccionadas
                let fechaInicio = moment(start).format('DD/MM/YYYY');
                let fechaFin = moment(end).subtract(1, 'days').format('DD/MM/YYYY'); // Rango hasta el día anterior

                let mesSeleccionado = parseInt(fechaInicio.substr(4, 2));
                //console.log(mesSeleccionado)

                let idMed = $('#cboMedicoProgramacionFiltro').val();
                let idEsp = $('#cboEspecialidadHospProgramacionFiltro').val();
                let anio = $('#cboAnioCalendario').val();
                let mes = $('#cboMesCalendario').val();

                oTable_ProgramacionMedica.fnClearTable();
                if (mesSeleccionado == mes) {
                    if (idMed > 0 && anio > 0 && mes > 0) {
                        await ProgramacionSalaOperaciones.ListarProgramacionMedicaMensual(0, 0, idEsp, 0, idMed, 9, anio, mes);
                    }

                    //let fechaF = fecha.substr(8, 2) + '/' + fecha.substr(5, 2) + '/' + fecha.substr(0, 4);
                    if (esFormatoFecha(fechaInicio) && esFormatoFecha(fechaFin)) {
                        if (fechaInicio == fechaFin) {
                            await ProgramacionSalaOperaciones.ListarProgramacionMedica(0, 0, idEsp, 0, idMed, 9, fechaInicio, fechaFin);
                        }

                    }

                    ProgramacionSalaOperaciones.fechaInicioSeleccionada = fechaInicio;
                    ProgramacionSalaOperaciones.fechaFinSeleccionada = fechaFin;
                }

                let startDate = moment(start);
                let endDate = moment(end).subtract(1, 'days'); // Ajuste
                let rangoDias = [];
                while (startDate.isBefore(endDate) || startDate.isSame(endDate, 'day')) {
                    rangoDias.push(startDate.format('YYYY-MM-DD'));
                    startDate.add(1, 'days');
                }

                // Agregar días al array para persistencia
                let diasSeleccionados = [];
                diasSeleccionados = diasSeleccionados.concat(rangoDias);

                // Marcar los días seleccionados visualmente
                $(".fc-day").removeClass('fc-selected-day');
                diasSeleccionados.forEach(function (day) {
                    $("td[data-date='" + day + "'].fc-day").addClass('fc-selected-day');
                });


                //alert(`Seleccionaste desde ${fechaInicio} hasta ${fechaFin}`);
            }
        }

        $('#calendar').fullCalendar(opts);

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    //////////////////////////////////INICIALIZA DATATABLE////////////////////////////////////////////////////////////////////
    DataTableMedicos: function () {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '70vh',
            //order: [[0, 'asc']],
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idProgramacionSala",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    data: "sala",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '5%',
                    targets: 0,
                    data: "quirofano",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '5%',
                    targets: 0,
                    data: "turno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '5%',
                    targets: 0,
                    data: "idOrdenProg",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '25%',
                    targets: 0,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    data: "horaProgramada",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '25%',
                    targets: 0,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                
            ]

        }

        var tableWrapper = $('#tblProgramacionMedica'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ProgramacionMedica = $("#tblProgramacionMedica").dataTable(parms);
    },
    InitDatablesPacientesBusqueda: function () {

        var parms = {
            "scrollY": "600px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "nroSolicitud",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '24%',
                    targets: 2,
                    data: 'paciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: 'sexo',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: 'fechaNacimientoPaciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: 'idCuentaAtencion',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: 'fechaIngreso',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '12%',
                //    targets: 6,
                //    data: 'servicioIngreso',
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '12%',
                //    targets: 7,
                //    data: 'servicioEgreso',
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                {
                    width: '12%',
                    targets: 7,
                    data: 'tipoServicio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblPacientesBusqueda'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_PacientesBusqueda = $("#tblPacientesBusqueda").dataTable(parms);

    },
    InitDatableDiagnostico: function () {
        visible = true;
        params = {
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '70vh',
            "autoWidth": false,
            scrollCollapse: true,
            bLengthChange: false,
            bPaginate: false,
            buttons: [],
            columns: [
                {
                    width: '0%', targets: 0, "data": "iddiagnostico", className: 'ContCenter', "visible": false
                },
                { width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
                { width: '80%', targets: 3, "data": "descripcion" },
                { width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter', "visible": visible },
                //{ width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false },
                //{ width: '10%', targets: 9, "data": "lab", className: 'ContCenter', "visible": visible }

            ]
        }

        ObjtableDiagnosticosSolicitudCQx = $("#lstDiagnosticosSolicitudCQx").dataTable(params);

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });


        $('#txtLabDiagnostico').val('')

        $('#cbolabDiagnostico').val(-1)
        $('#cbolabDiagnostico').trigger("chosen:updated");

        //Cargando(0);
    },
    InitDatablesSolicitudCQx: function () {
        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '60%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero" disabled>'
                        $(td).html(inputCantidad);
                    }
                }
            ]
        }
        var tableWrapper = $('#tblCatalogoSolicitudCQx'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_solicitudCQx = $("#tblCatalogoSolicitudCQx").dataTable(parms);
        $('#tblCatalogoSolicitudCQx_length').css('display', 'none')
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ListarM_SalaFiltroCQx: async function () {
        let formData = new FormData()

        let res = await HttpClient.Post('/SalaOperaciones/ListarM_SalaCQx?area=Comun', formData)

        const datos = res.data.table;

        $('#cboSalaFiltro').empty();

        if (datos.length > 0) {

            $('#cboSalaFiltro').append(`<option value="0">Seleccionar una opcion</option>`)
            $(datos).each(function (i, obj) {
                $('#cboSalaFiltro').append(`<option value="${obj.idSalaCqx}">${obj.descripcion}</option>`)
            })

            $('.chzn-select').chosen().trigger("chosen:updated");
            return true
        } else {
            console.log("No se encontraron datos.");
            return false
        }
    },
    ListarM_SalaCQx: async function () {
        let formData = new FormData()

        let res = await HttpClient.Post('/SalaOperaciones/ListarM_SalaCQx?area=Comun', formData)

        const datos = res.data.table;

        $('#cboSala').empty();

        if (datos.length > 0) {

            $('#cboSala').append(`<option value="0">Seleccionar una opcion</option>`)
            $(datos).each(function (i, obj) {
                $('#cboSala').append(`<option value="${obj.idSalaCqx}">${obj.descripcion}</option>`)
            })

            $('.chzn-select').chosen().trigger("chosen:updated");
            return true
        } else {
            console.log("No se encontraron datos.");
            return false
        }
    },
    ListarM_QuirofanoFiltroCQx: async function (IdSala) {
        let formData = new FormData()

        formData.append('IdSala', IdSala)

        let res = await HttpClient.Post('/SalaOperaciones/ListarM_QuirofanoCQx?area=Comun', formData)

        const datos = res.data.table;

        $('#cboQuirofanoFiltro').empty();

        if (datos.length > 0) {

            $('#cboQuirofanoFiltro').append(`<option value="0">Seleccionar una opcion</option>`)
            $(datos).each(function (i, obj) {
                $('#cboQuirofanoFiltro').append(`<option value="${obj.idQuirofanoCqx}">${obj.descripcion}</option>`)
            })

            $('.chzn-select').chosen().trigger("chosen:updated");
            return true
        } else {
            console.log("No se encontraron datos.");
            return false
        }
    },
    ListarM_QuirofanoCQx: async function (IdSala) {
        let formData = new FormData()

        formData.append('IdSala', IdSala)

        let res = await HttpClient.Post('/SalaOperaciones/ListarM_QuirofanoCQx?area=Comun', formData)

        const datos = res.data.table;

        $('#cboQuirofano').empty();

        if (datos.length > 0) {

            $('#cboQuirofano').append(`<option value="0">Seleccionar una opcion</option>`)
            $(datos).each(function (i, obj) {
                $('#cboQuirofano').append(`<option value="${obj.idQuirofanoCqx}">${obj.descripcion}</option>`)
            })

            $('.chzn-select').chosen().trigger("chosen:updated");
            return true
        } else {
            console.log("No se encontraron datos.");
            return false
        }
    },
    ListarM_TurnosCirugiaCQx: async function (IdTipoTurno) {
        let formData = new FormData()

        formData.append('IdTipoTurno', IdTipoTurno)
        return HttpClient.Post('/SalaOperaciones/ListarM_TurnosCirugiaCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboTurno').empty();
                $('#cboTurnoQx').empty();

                if (datos.length > 0) {

                    $('#cboTurno').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboTurnoQx').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboTurno').append(`<option value="${obj.idTurnoCQx}">${obj.descripcion}</option>`)
                        $('#cboTurnoQx').append(`<option value="${obj.idTurnoCQx}">${obj.descripcion}</option>`)
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
    ListarM_TipoCirugiaCQx: async function () {
        let formData = new FormData()
        return HttpClient.Post('/SalaOperaciones/ListarM_TipoCirugiaCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboTipoCirugia').empty();
                $('#cboTipoCirugiaProg').empty();

                if (datos.length > 0) {

                    $('#cboTipoCirugia').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboTipoCirugiaProg').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        $('#cboTipoCirugia').append(`<option value="${obj.idTipoCirugiaCqx}">${obj.descripcion}</option>`)
                        $('#cboTipoCirugiaProg').append(`<option value="${obj.idTipoCirugiaCqx}">${obj.descripcion}</option>`)
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
    ListarM_OrdenCQx: async function () {
        var isDisabled;
        let formData = new FormData()
        return HttpClient.Post('/SalaOperaciones/ListarM_OrdenCQx?area=Comun', formData).then(res => {
            if (res.session) {
                // Procesar los datos de las empresas
                const datos = res.data.table;

                $('#cboOrdenSugerido').empty();
                $('#cboOrdenProg').empty();

                if (datos.length > 0) {

                    $('#cboOrdenSugerido').append(`<option value="0">Seleccionar una opcion</option>`)
                    $('#cboOrdenProg').append(`<option value="0">Seleccionar una opcion</option>`)
                    $(datos).each(function (i, obj) {
                        if (obj.idSalaCqx == $('#cboSala').val() && obj.idQuirofanoCqx == $('#cboQuirofano').val() && obj.idTurnoCQx == $('#cboTurnoQx').val()) {
                            if (obj.idPaciente != ProgramacionSalaOperaciones.idPaciente) {
                                if (obj.idOrdenCqx == -1) {
                                    //isDisabled = 'disabled'
                                    isDisabled = ''
                                }
                                $('#cboOrdenSugerido').append('<option ' + isDisabled + ' value="' + obj.idOrdenCqx + '">' + obj.paciente + '</option>');
                                $('#cboOrdenProg').append('<option ' + isDisabled + ' value="' + obj.idOrdenCqx + '">' + obj.paciente + '</option>');
                            } else {
                                $('#cboOrdenSugerido').append('<option ' + isDisabled + ' value="' + ProgramacionSalaOperaciones.idOrdenProg + '">' + obj.paciente + '</option>');
                                $('#cboOrdenProg').append('<option ' + isDisabled + ' value="' + ProgramacionSalaOperaciones.idOrdenProg + '">' + obj.paciente + '</option>');
                            }
                        }
                        
                        isDisabled = '';
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
    ListarDepartamentos: async function () {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        Cargando(1)
        try {
            $('#cboDepartamentoHospProgramacionFiltro').empty();
            $('#cboEspecialidadHospProgramacionFiltro').empty();
            $('#cboMedicoProgramacionFiltro').empty();

            $('#cboDepartamentoHospProgramacionFiltro').append("<option value=''></option>")
            $('#cboEspecialidadHospProgramacionFiltro').append("<option value=''></option>")
            $('#cboMedicoProgramacionFiltro').append("<option value=''></option>")
            //oTable_MedicosFiltro.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Departamentos/ListarDepartamentos?area=General",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboDepartamentoHospProgramacionFiltro').append('<option value="' + obj.idDepartamento + '">' + obj.descripcionLarga + '</option>');
                    });
                    $('#cboDepartamentoHospProgramacionFiltro').val(ProgramacionSalaOperaciones.idDepartamento);
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },
    ListarServicios: async function (idTipoServicio, idDepartamento, idEspecialidad, idServicio) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idTipoServicio', idTipoServicio);
        data.append('idDepartamento', idDepartamento);
        data.append('idEspecialidad', idEspecialidad);
        data.append('idServicio', idServicio);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboEspecialidadHospProgramacionFiltro').empty();
            $('#cboMedicoProgramacionFiltro').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Especialidades/ListarServicios?area=General",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.lstData.table.length > 0) {
                    $(datos.lstData.table).each(function (i, obj) {
                        $('#cboEspecialidadHospProgramacionFiltro').append('<option value="' + obj.idEspecialidad + '">' + obj.descripcionLarga + '</option>');
                    });
                    $('#cboEspecialidadHospProgramacionFiltro').val('');
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },
    ListarEspecialidadPorDepartamento: async function (idDepartamento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idDepartamento', idDepartamento);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboEspecialidadHospProgramacionFiltro').empty();
            $('#cboMedicoProgramacionFiltro').empty();

            $('#cboEspecialidadHospProgramacionFiltro').append("<option value=''></option>")
            $('#cboMedicoProgramacionFiltro').append("<option value=''></option>")
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Especialidades/EspecialidadesSeleccionarPorDepartamento?area=General",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.lstData.table.length > 0) {
                    $(datos.lstData.table).each(function (i, obj) {
                        $('#cboEspecialidadHospProgramacionFiltro').append('<option value="' + obj.idEspecialidad + '">' + obj.descripcionLarga + '</option>');
                    });
                    $('#cboEspecialidadHospProgramacionFiltro').val('');
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },
    ListarMedicosPorEspecialidad: async function (idEspecialidad) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idEspecialidad', idEspecialidad);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboMedicoProgramacionFiltro').empty();
            $('#cboMedicoProgramacionFiltro').append("<option value=''></option>")

            //$('#cboMedicoProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Medicos/ListarMedicosPorEspecialidad?area=Seguridad",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    //oTable_MedicosFiltro.fnAddData(datos.lsResultado.table);
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboMedicoProgramacionFiltro').append('<option value="' + obj.idMedico + '">' + obj.medico + '</option>');
                        //$('#cboMedicoProgramacion').append('<option value="' + obj.idMedico + '">' + obj.medico + '</option>');
                    });
                    $('#cboMedicoProgramacionFiltro').val('');
                    //$('#cboMedicoProgramacion').val('');
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },
    ListarEspecialidadPorMedico: async function (idMedico) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idMedico', idMedico);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboEspecialidadProgramacion').empty();
            $('#cboConsultorioProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Especialidades/EspecialidadesSeleccionarPorMedico?area=General",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.lstData.table.length > 0) {
                    $(datos.lstData.table).each(function (i, obj) {
                        $('#cboEspecialidadProgramacion').append('<option value="' + obj.idEspecialidad + '">' + obj.nombre + '</option>');
                    });
                    $('#cboEspecialidadProgramacion').val('');
                    $('#cboConsultorioProgramacion').val('');
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },
    ListarProgramacionMedica: async function (idTipoServicio, idDepartamento, idEspecialidad, idServicio, idMedico, activaProcedimiento, fechaInicio, fechaFin) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idTipoServicio', idTipoServicio);
        data.append('idDepartamento', idDepartamento);
        data.append('idEspecialidad', idEspecialidad);
        data.append('idServicio', idServicio);
        data.append('idMedico', idMedico);
        data.append('activaProcedimiento', activaProcedimiento);
        data.append('fechaInicio', fechaInicio);
        data.append('fechaFin', fechaFin);

        try {
            Cargando(1);
            oTable_ProgramacionMedica.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SalaOperaciones/ListarProgramacionMedicaSopPorRango?area=ProgramacionGeneral",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    oTable_ProgramacionMedica.fnAddData(datos.lsResultado.table);
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },
    ListarProgramacionMedicaMensual: async function (idTipoServicio, idDepartamento, idEspecialidad, idServicio, idMedico, activaProcedimiento, anio, mes) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idTipoServicio', idTipoServicio);
        data.append('idDepartamento', idDepartamento);
        data.append('idEspecialidad', idEspecialidad);
        data.append('idServicio', idServicio);
        data.append('idMedico', idMedico);
        data.append('activaProcedimiento', activaProcedimiento);
        data.append('anio', anio);
        data.append('mes', mes);

        try {
            Cargando(1);
            $('#calendar').fullCalendar('removeEvents');
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SalaOperaciones/ListarProgramacionMedicaSopMensual?area=ProgramacionGeneral",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $(datos.lsResultado.table).each(function (i, obj) {
                        //console.log('fecha para probar', obj)
                        let programacion = {
                            title: obj.codigoTurno + ' (' + obj.horasProgramadas + ')',
                            start: obj.fechaP.substr(0, 10),
                            end: obj.fechaP.substr(0, 10),
                            allDay: false                // Si es un evento de día completo
                        };

                        // Agregar el evento al calendario
                        $('#calendar').fullCalendar('renderEvent', programacion, true);

                    });
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },
    ListarSolicitudesSalaOperaciones: async function (NroHistoria, NroSolicitud, IdCuentaAtencion, NroDocumento, ApellidoPaterno, ApellidoMaterno, FechaSolicitud) {
        let formData = new FormData()

        formData.append('NroHistoria', NroHistoria)
        formData.append('NroSolicitud', NroSolicitud)
        formData.append('NroDocumento', NroDocumento)
        formData.append('ApellidoPaterno', ApellidoPaterno)
        formData.append('ApellidoMaterno', ApellidoMaterno)
        formData.append('FechaSolicitud', FechaSolicitud)

        try {
            const response = await HttpClient.Post(`/SalaOperaciones/ListarSolicitudesSalaOperaciones?area=Comun&nroHistoria=${NroHistoria}`, formData)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            const datos = response.data.table

            if (datos.length > 0) {
                return datos
            }
            return null
        } catch (error) {

            alerta(2, 'Ocurrio un error')
            console.error("Ha ocurrido un error:", error)
            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
            return false
        }

    },
    ListarMedicos: async function () {
        let formData = new FormData()

        let res = await HttpClient.Post('/Utilitario/ListarMedicos?area=Comun', formData)

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

            //$('#cboMedicoSolicita').append(`<option value="0">Seleccionar una opcion</option>`)

            //$('#cboMedicoPrincipal').append(`<option value="0">Seleccionar una opcion</option>`)
            //$('#cboMedicoAyudanteI').append(`<option value="0">Seleccionar una opcion</option>`)
            //$('#cboAnestesiologo').append(`<option value="0">Seleccionar una opcion</option>`)
            //$('#cboInstrumentistaI').append(`<option value="0">Seleccionar una opcion</option>`)
            //$('#cboTecEnfermeria').append(`<option value="0">Seleccionar una opcion</option>`)
            //$('#cboCirujanoII').append(`<option value="0">Seleccionar una opcion</option>`)
            //$('#cboMedicoAyudanteII').append(`<option value="0">Seleccionar una opcion</option>`)
            //$('#cboAyudanteAnestesiologo').append(`<option value="0">Seleccionar una opcion</option>`)
            //$('#cboInstrumentistaII').append(`<option value="0">Seleccionar una opcion</option>`)
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
    },
    SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud: async function (NroSolicitud) {
        let formData = new FormData()

        try {
            const response = await HttpClient.Get(`/SalaOperaciones/SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud?area=Comun&NroSolicitud=${NroSolicitud}`)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            const datos = response.data.table

            if (datos.length > 0) {
                return datos[0]
            }
            return null
        } catch (error) {

            alerta(2, 'Ocurrio un error')
            console.error("Ha ocurrido un error:", error)
            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
            return false
        }

    },
    SeleccionarDiagnosticos: async function (idAtencion, clasificacion) {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasificacion);

        ObjtableDiagnosticosSolicitudCQx.fnClearTable()
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            resp = true;

            $(datos.table).each((i, obj) => {
                if (obj.idTipoDiagnosticoCQx == 1) {
                    ObjtableDiagnosticosSolicitudCQx.api(true).row.add(obj).draw(false);
                }

            })

        } catch (error) {
            resp = false;
            alerta(3, error);
        }

        return resp;
    },
    ListarProcedimientosCQx: async function (NroSolicitud) {
        var resp = false;
        let datos
        var data = new FormData();

        data.append('NroSolicitud', NroSolicitud);

        try {

            oTable_solicitudCQx.fnClearTable()

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SalaOperaciones/ListarProcedimientosCQx?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (!isEmpty(datos.table)) {
                if (datos.table.length !== 0)
                    oTable_solicitudCQx.fnAddData(datos.table);
                //else
                //    Ordenes.listaFecha();
            }

            resp = true;
        } catch (error) {
            resp = false;
            alerta(3, error);
        }

        return resp;
    },
    CrearModificarProgramacionSalaOperacionesCQx: async () => {
        let formData = new FormData()

        formData.append('IdProgramacionSala', ProgramacionSalaOperaciones.idProgramacionMedicaSop)
        formData.append('IdSolicitudSOP', ProgramacionSalaOperaciones.idSolicitudSOP)
        formData.append('IdPaciente', ProgramacionSalaOperaciones.idPaciente)
        formData.append('IdEspecialidad', ProgramacionSalaOperaciones.IdEspecialidad)
        formData.append('IdServicio', 0) // Verificar si es necesario
        formData.append('FechaProgramada', $('#txtFechaSolicitudCQxProgramada').val())
        formData.append('HoraProgramada', $('#txtHoraSolicitudCQxProgramada').val())
        formData.append('IdMedicoProgramado', $('#hdIdMedicoProgramado').val())
        formData.append('IdOrdenProg', $('#cboOrdenProg').val())
        formData.append('IdTurno', $('#cboTurnoQx').val())
        formData.append('IdSala', $('#cboSala').val())
        formData.append('IdTipoCirugia', $('#cboTipoCirugiaProg').val())
        formData.append('IdQuirofano', $('#cboQuirofano').val())
        formData.append('IdBancoSangre', $('input[name="rdbBancoSangre"]:checked').val())
        formData.append('CantidadBS', $('#txtCantBancoSangre').val())
        formData.append('ExamenesAuxiliares', $('input[name="rdbExamenesAuxiliares"]:checked').val())
        formData.append('EvaluacionPreanestesica', $('input[name="rdbEvaluacionPreanestesica"]:checked').val())
        formData.append('ConsentimientoInformado', $('input[name="rdbConsentimientoInformado"]:checked').val())
        formData.append('IdRiesgoQx', $('input[name="rdbRiesgoCardiologico"]:checked').val())
        formData.append('NivelRiesgoQx', $('#cboNivelRiesgoCardiologico').val())
        formData.append('FechaCirugia', $('#txtFechaCirugia').val())
        formData.append('IdAnestesiologo', $('#cboAnestesiologo').val())
        formData.append('IdAyudanteAnestesiologo', $('#cboAyudanteAnestesiologo').val())
        formData.append('IdInstrumentistaI', $('#cboInstrumentistaI').val())
        formData.append('IdInstrumentistaII', $('#cboInstrumentistaII').val())
        formData.append('ObservacionProgramacion', $('#txtObservacionProgramacion').val())


        //formData.append('FechaAprobado', null)
        ////formData.append('IdServicioOpera', $('#cboServicioOpera').val())
        //formData.append('IdServicioOpera', null)


        //formData.append('GrupoSanguineo', $('#txtGrupoSanguineo').val())
        //formData.append('FactorRH', $('#txtFactorRH').val())

        //formData.append('ReqInstrumental', $('#txtReqInstrumental').val())

        //formData.append('TiempoQx', $('#cboTurnoQx').val())
        //formData.append('HoraFinal', $('#txtHoraFinalCirugia').val())
        //formData.append('ResumenCirugia', $('#txtResumenCirugia').val())
        //formData.append('ImpresionDiagnostica', $('#txtImpresion').val())
        //formData.append('PlanTrabajo', $('#txtPlan').val())

        //formData.append('lstDiagnosticos', JSON.stringify(Diagnosticos.DevolverDiagnosticos().toArray()));

        try {
            const response = await HttpClient.Post(`/SalaOperaciones/CrearModificarProgramacionSalaOperacionesCQx?area=ProgramacionSalaOperaciones`, formData)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            const datos = response.data.table

            if (datos.length > 0) {
                return datos[0]
            }
            return null
        } catch (error) {

            alerta(2, 'Ocurrio un error')
            console.error("Ha ocurrido un error:", error)
            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
            return false
        }

    },


    ///////////////////////////////// FUNCIONES FORMULARIO /////////////////////////////////
    CargarDatosSolicitudSalaQx: async function (objRow) {
        var fecha = new Date()
        var dia = fecha.getDate()
        var mes = parseInt(fecha.getMonth()) + 1
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        let time1 = fecha.getHours() + ":" + (fecha.getMinutes() < 10 ? ("0" + fecha.getMinutes()) : fecha.getMinutes())

        ProgramacionSalaOperaciones.idPaciente = objRow.idPaciente
        ProgramacionSalaOperaciones.idSolicitudSOP = objRow.idSolicitudSOP
        ProgramacionSalaOperaciones.idOrdenProg = objRow.idOrdenProg
        //ProgramacionSalaOperaciones.IdEstadoSolicitud = objRow.idEstado
        ProgramacionSalaOperaciones.nroHistoriaClinica = objRow.nroHistoriaClinica
        //ProgramacionSalaOperaciones.NroSolicitud = objRow.nroSolicitud
        //ProgramacionSalaOperaciones.IdCuentaAtencion = objRow.idCuentaAtencion
        ProgramacionSalaOperaciones.idProgramacionMedicaSop = objRow.idProgramacionSala
        ProgramacionSalaOperaciones.idEspecialidad = objRow.idEspecialidad

        
        await ProgramacionSalaOperaciones.ListarM_TurnosCirugiaCQx(objRow.idTIpoIntervencion)

        
        $("#txtFechaSolicitudCQxAceptada").datepicker("setDate", objRow.fechaAceptada);
        $("#txtHoraSolicitudCQxAceptada").val(objRow.horaAceptada)

        $('#txtNroSolicitudBusq').val(objRow.nroSolicitud)
        $('#txtNroHistoriaSolicitud').val(objRow.nroHistoriaClinica)
        $('#cboMedicoSolicita').val(objRow.idMedicoSolicita)
        $("#txtEstado").val(objRow.estado)
        $('#txtDatosPaciente').val(objRow.paciente)
        $('#txtNroSolicitud').val(objRow.nroSolicitud)
        $("#txtEdadAnioSolicitud").val(objRow.edadEnAnio)
        $("#txtEdadMesSolicitud").val(objRow.edadEnMes)
        $("#txtEdadDiaSolicitud").val(objRow.edadEnDia)
        $("#txtSexoSolicitud").val(objRow.sexo)
        $("#txtServicioSolicitud").val(objRow.servicio)
        $("#txtCamaSolicitud").val(objRow.cama)
        $('#cboUbicacionPaciente').val(objRow.idUbicacionPaciente)
        $("#cboClaseIntervencion").val(objRow.idTIpoIntervencion)
        $("#cboClasePlaciente").val(objRow.idTipoPaciente)
        $("#txtFechaParaCQx").val(objRow.fechaSugerida)
        $("#txtHoraParaCqx").val(objRow.horaSugerida)
        $("#txtFechaSolicitudCQx").val(objRow.fechaSolicitud)
        $("#txtHoraSolicitudCQx").val(objRow.horaSolicitud)
        //$("#txtFechaSolicitudCQxAceptada").val(objRow.fechaAceptada)
        //$("#txtHoraSolicitudCQxAceptada").val(objRow.horaAceptada)
        
        

        $('#cboTipoCirugia').val(objRow.idTipoCirugia)
        $('#cboTurno').val(objRow.idTurno)
        $('#cboOrdenSugerido').val(objRow.idOrdenSugerido)
        $('#cboEstadoSolicitud').val(objRow.idEstado)


        

        $('#cboTipoCirugiaProg').val(objRow.idTipoCirugiaProg)

        
        $('#txtFechaCirugia').val(objRow.fechaCirugia)
        $('#txtObservacionProgramacion').val(objRow.observacionProgramacion)

        $('input[name="rdbRiesgoCardiologico"][value="' + objRow.idRiesgoQx + '"]').prop('checked', true);
        $('#cboNivelRiesgoCardiologico').val(objRow.nivelRiesgoQx)
        $('input[name="rdbBancoSangre"][value="' + objRow.idBancoSangre + '"]').prop('checked', true);
        $('#txtCantBancoSangre').val(objRow.cantidadBS)
        $('input[name="rdbExamenesAuxiliares"][value="' + objRow.examenesAuxiliares + '"]').prop('checked', true);
        $('input[name="rdbEvaluacionPreanestesica"][value="' + objRow.evaluacionPreanestesica + '"]').prop('checked', true);
        $('input[name="rdbConsentimientoInformado"][value="' + objRow.consentimientoInformado + '"]').prop('checked', true);
        //$('input[name="options"][value="' + objRow.idEstado + '"]').prop('checked', true);
        
        $('#cboMedicoPrincipal').val(objRow.idMedicoPrincipal)
        $('#cboCirujanoII').val(objRow.idCirujanoII)
        $('#cboMedicoAyudanteI').val(objRow.idMedicoAyudanteI)
        $('#cboMedicoAyudanteII').val(objRow.idMedicoAyudanteII)
        $('#cboAnestesiologo').val(objRow.idAnestesiologo)
        $('#cboAyudanteAnestesiologo').val(objRow.idAyudanteAnestesiologo)
        $('#cboInstrumentistaI').val(objRow.idInstrumentistaI)
        $('#cboInstrumentistaII').val(objRow.idInstrumentistaII)
        $('#cboTecEnfermeria').val(objRow.idTecnicoEnfermeria)
        $('#cboTurnoQx').val(objRow.idTurnoProg)

        await ProgramacionSalaOperaciones.SeleccionarDiagnosticos(objRow.idAtencion, 8)
        await ProgramacionSalaOperaciones.ListarProcedimientosCQx(objRow.nroSolicitud)

        if (ProgramacionSalaOperaciones.opcion != 'A') {

            await ProgramacionSalaOperaciones.ListarM_QuirofanoCQx(objRow.idSalaProg)
            $('#cboSala').val(objRow.idSalaProg)
            $('#cboQuirofano').val(objRow.idQuirofano)

            $("#txtFechaSolicitudCQxProgramada").datepicker("setDate", objRow.fecha);
            $("#txtHoraSolicitudCQxProgramada").val(objRow.horaProgramada)
            $("#hdIdMedicoProgramado").val(objRow.idMedico)
            $("#txtMedicoProgramado").val(objRow.medico)

            await this.ListarM_OrdenCQx()
        }

        $('#cboOrdenProg').val(objRow.idOrdenProg)

        $('.chzn-select').chosen().trigger("chosen:updated")
        
    },

    Events: function () {

        ////////////////////////////////// SELECT //////////////////////////////////
        $('#cboDepartamentoHospProgramacionFiltro').on('change', async function () {
            let idDepartamento = $('#cboDepartamentoHospProgramacionFiltro').val();
            if (idDepartamento > 0) {
                await ProgramacionSalaOperaciones.ListarEspecialidadPorDepartamento(idDepartamento);
            }
        });
        $('#cboSala').on('change', async () => {
            Cargando(1)
            await ProgramacionSalaOperaciones.ListarM_QuirofanoCQx($('#cboSala').val())
            Cargando(0)
        })
        $('#cboSalaFiltro').on('change', async () => {
            Cargando(1)
            await ProgramacionSalaOperaciones.ListarM_QuirofanoFiltroCQx($('#cboSalaFiltro').val())
            Cargando(0)
        })
        $('#cboTurnoQx').on('change', async () => {
            Cargando(1)
            await this.ListarM_OrdenCQx()
            Cargando(0)
        })
        $('#cboEspecialidadHospProgramacionFiltro').on('change', async function () {
            let idEspecialidad = $('#cboEspecialidadHospProgramacionFiltro').val();
            ProgramacionSalaOperaciones.idEspecialidad = idEspecialidad
            if (idEspecialidad > 0) {
                await ProgramacionSalaOperaciones.ListarMedicosPorEspecialidad(idEspecialidad);
            }
        });

        $('#cboMedicoProgramacionFiltro').on('change', async function () {
            let idEsp = $('#cboEspecialidadHospProgramacionFiltro').val();
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();
            if (idMed > 0 && anio > 0 && mes > 0) {
                await ProgramacionSalaOperaciones.ListarProgramacionMedicaMensual(0, 0, idEsp, 0, idMed, 9, anio, mes);
            }
        });

        $('#cboAnioCalendario').on('change', async function () {
            let idEsp = $('#cboEspecialidadHospProgramacionFiltro').val();
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();

            $('#calendar').fullCalendar('gotoDate', new Date($('#cboAnioCalendario>option:selected').val(), $('#cboMesCalendario>option:selected').val() - 1));
            if (idMed > 0 && anio > 0 && mes > 0) {
                await ProgramacionSalaOperaciones.ListarProgramacionMedicaMensual(0, 0, idEsp, 0, idMed, 9, anio, mes);
            }
        });

        $('#cboMesCalendario').on('change', async function () {
            let idEsp = $('#cboEspecialidadHospProgramacionFiltro').val();
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();

            $('#calendar').fullCalendar('gotoDate', new Date($('#cboAnioCalendario>option:selected').val(), $('#cboMesCalendario>option:selected').val() - 1));
            if (idMed > 0 && anio > 0 && mes > 0) {
                await ProgramacionSalaOperaciones.ListarProgramacionMedicaMensual(0, 0, idEsp, 0, idMed, 9, anio, mes);
            }
        });


        //////////////////////////////////  BUTTONS //////////////////////////////////
        $('#btnAgregarProgramacion').on('click', async function () {

            //ProgramacionMedica.idProgramacionMedicaSop = 0;
            ProgramacionSalaOperaciones.DesbloquearCampos();
            //ProgramacionMedica.LimpiarRegistroProgramacion();

            let fechaHoy = await Utilitario.FechaHoraServidor();
            let fi = moment(ConvertirFormatoFecha(ProgramacionSalaOperaciones.fechaInicioSeleccionada), "YYYY-MM-DD").toDate();
            let ff = moment(ConvertirFormatoFecha(ProgramacionSalaOperaciones.fechaFinSeleccionada), "YYYY-MM-DD").toDate();
            let fh = moment(ConvertirFormatoFecha(ConvertirFormatoFecha(fechaHoy.substring(0, 10))), "YYYY-MM-DD").toDate();

            if (fi < fh || ff < fh) {
                alerta2("info", "", "No puede programar fechas anteriores al día de hoy.");
                return;
            }

            let idEspecialidad = $('#cboEspecialidadHospProgramacionFiltro').val();
            let idSala = $('#cboSalaFiltro').val();
            let idQuirofano = $('#cboQuirofanoFiltro').val();
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let med = $('#cboMedicoProgramacionFiltro option:selected').text();

            if (isEmpty(idEspecialidad)) {
                alerta2("info", "", "Por favor seleccione una especialidad.");
                return;
            }
            if (isEmpty(idSala)) {
                alerta2("info", "", "Por favor seleccione una sala.");
                return;
            }
            if (isEmpty(idQuirofano)) {
                alerta2("info", "", "Por favor seleccione un quirofano.");
                return;
            }

            if (isEmpty(idMed)) {
                alerta2("info", "", "Por favor seleccione un médico.");
                return;
            }

            if (isEmpty(ProgramacionSalaOperaciones.fechaInicioSeleccionada) || isEmpty(ProgramacionSalaOperaciones.fechaFinSeleccionada)) {
                alerta2("info", "", "Por favor seleccione la(s) fecha(s) a programar.");
                return;
            }


            //$('#cboTipoServicioProgramacion').val(1);
            //$('#txtIdMedicoProgramacion').val(idMed);

            //$("#txtFechaInicioProgramacion").datepicker("setDate", ProgramacionSalaOperaciones.fechaInicioSeleccionada);
            //$("#txtFechaFinProgramacion").datepicker("setDate", ProgramacionSalaOperaciones.fechaFinSeleccionada);

            //if (ProgramacionSalaOperaciones.fechaInicioSeleccionada == ProgramacionSalaOperaciones.fechaFinSeleccionada) {
            //    $("#divFechaFinProgramacion").hide();
            //} else {
            //    $("#divFechaFinProgramacion").show();
            //}

            //await ProgramacionSalaOperaciones.ListarEspecialidadPorMedico(idMed);


            //////////////////////// CARGAR DATOS A FORMULARIO REGISTRO PROGRAMACION SALA OPERACIONES ////////////////////////
            ProgramacionSalaOperaciones.opcion = 'A'
            await ProgramacionSalaOperaciones.ListarM_TurnosCirugiaCQx(ProgramacionSalaOperaciones.tipoTurno);
            await ProgramacionSalaOperaciones.ListarM_QuirofanoCQx(idSala);
            $("#txtFechaSolicitudCQxProgramada").datepicker("setDate", ProgramacionSalaOperaciones.fechaInicioSeleccionada);
            $('#cboSala').val(idSala);
            $('#cboQuirofano').val(idQuirofano);
            $('#hdIdMedicoProgramado').val(idMed);
            $('#txtMedicoProgramado').val(med);
            ////////////////////// END CARGAR DATOS A FORMULARIO REGISTRO PROGRAMACION SALA OPERACIONES //////////////////////


            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            $('.chzn-select').chosen().trigger("chosen:updated");

            $("#modalRegistroProgramacion").modal("show");

        });
        $('#btnModificarProgramacion').on('click', async function () {
            let objrowTb = oTable_ProgramacionMedica.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            await ProgramacionSalaOperaciones.CargarDatosSolicitudSalaQx(objrowTb);
            ProgramacionSalaOperaciones.DesbloquearCampos();

            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            $("#modalRegistroProgramacion").modal("show");
        });

        $('#btnConsultarProgramacion').on('click', async function () {
            var objrowTb = oTable_ProgramacionMedica.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            await ProgramacionMedicaSop.CargarDatosProgramacionMedica(objrowTb);
            ProgramacionMedicaSop.BloquearCampos();

            $("#modalRegistroProgramacion").modal("show");
        });

        $('#btnEliminarProgramacion').on('click', function () {
            var objrowTb = oTable_ProgramacionMedica.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            swal({
                title: 'Eliminar',
                text: 'Esta seguro que desea eliminar la programación <br> <span style="font-weight: 600;">' + objrowTb.servicio + ' (' + objrowTb.medico + ')' + ' (' + objrowTb.fecha + ')' + '</span>',
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#EF6F6C',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then(async function () {

                await ProgramacionMedicaSop.EliminarProgramacionMedica(objrowTb.idProgramacion);


                //console.log(res.estancias);
            }).catch(swal.noop);
            //$("#modalRegistroCama").modal("show");
        });
        $('#btnBuscarNroSolicitud').on('click', async () => {

            $('#modalPacientesBusqueda').modal('show')

            $('.chzn-select').chosen().trigger("chosen:updated")

            //if ($('#txtNroSolicitudBusq').val() == '') {
            //    alerta(2, 'Debe ingresar un Nro. de Solicitud para la busqueda.')
            //    $('#txtNroSolicitudBusq').focus()
            //    return false
            //}

            //Cargando(1)

            //let response = await ProgramacionSalaOperaciones.SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud($('#txtNroSolicitudBusq').val())

            //if (isEmpty(response)) {
            //    alerta(4, 'No se encontraron datos para el número de solicitud ingresado.')
            //    Cargando(0)
            //    return false
            //}

            //if (response.idProgramacionSala > 0) {
            //    swal({
            //        title: 'Atención',
            //        text: `Esta solicitud ya se encuentra registrada. \n N° Solicitud: ${response.nroSolicitud} \n N° Historia: ${response.nroHistoriaClinica} \n N° Cuenta: ${response.idCuentaAtencion}`,
            //        type: 'info',
            //        allowOutsideClick: false,
            //    }).done();
            //    Cargando(0)
            //    return false
            //}

            //ProgramacionSalaOperaciones.CargarDatosSolicitudSalaQx(response)


            ////$('#cboUbicacionPaciente').val(response.ultimoIdTipoServicio)
            ////
            ////$('#txtHcPaciente').val(response.nroHistoriaClinica)
            ////$('#cboSexo').val(response.idTipoSexo)
            ////



            //console.log('response', response)


            //$('.chzn-select').chosen().trigger("chosen:updated")

            //Cargando(0)
        })
        $('#btnBuscarSolicitud').on('click', async () => {
            //if ($('#txtHc').val() == '') {
            //    alerta(2, 'Debe ingresar un Nro. de Historia para la busqueda.')
            //    $('#txtHc').focus()
            //    return false
            //}

            Cargando(1)

            let response = await ProgramacionSalaOperaciones.ListarSolicitudesSalaOperaciones(NroHistoria = $('#txtHistoriaBusqSolicitud').val(), NroSolicitud = $('#txtNroSolicitudBusqSolicitud').val(),
                IdCuentaAtencion = 0, NroDocumento = $('#txtNroSolicitudBusqSolicitud').val(), ApellidoPaterno = $('#txtApPaternoBusqSolicitud').val(),
                ApellidoMaterno = $('#txtApMaternoBusqSolicitud').val(), FechaSolicitud = $('#txtFechaSolicitudBusqSolicitud').val())

            oTable_PacientesBusqueda.fnClearTable()

            if (isEmpty(response)) {
                alerta(4, 'No se encontraron datos.')
                Cargando(0)
                return false
            }

            for (let obj of response) {
                if (obj.idEstado == 2) {
                    oTable_PacientesBusqueda.api(true).row.add(obj).draw(false);
                }
            }


            //ObjtableDiagnosticosSolicitudCQx.api(true).row.add(objRow).draw(false);

            //oTable_PacientesBusqueda.(response)



            Cargando(0)
        })
        $('#btnGuardar').on('click', async () => {

            if (ProgramacionSalaOperaciones.IdPaciente == 0) {
                alerta(2, 'Debe seleccionar un paciente')
                $('#txtHc').focus()
                return false
            }

            if ($('#txtFechaSolicitudCQxProgramada').val() == '') {
                alerta(2, 'Debe ingresar la hora programada')
                $('#txtHoraSolicitudCQxProgramada').focus()
                return false
            }

            if ($('#txtHoraSolicitudCQxProgramada').val() == '') {
                alerta(2, 'Debe ingresar la hora programada')
                $('#txtHoraSolicitudCQxProgramada').focus()
                return false
            }

            if (isEmpty($('#cboTurnoQx').val())) {
                alerta(2, 'Debe seleccionar el Turno')
                return false
            }

            if (isEmpty($('#cboOrdenProg').val())) {
                alerta(2, 'Debe seleccionar el Orden')
                return false
            }

            Cargando(1)

            let response = await ProgramacionSalaOperaciones.CrearModificarProgramacionSalaOperacionesCQx()

            if (!isEmpty(response)) {
                swal({
                    title: 'Atención',
                    text: `La solicitud se registro con exito. \n N° Solicitud: ${response.nroSolicitud.padStart(9, 0)} \n N° Historia: ${ProgramacionSalaOperaciones.nroHistoriaClinica}`,
                    type: 'info',
                    allowOutsideClick: false,
                }).done();

                $("#modalRegistroProgramacion").modal("hide");
            }


            console.log('response', response)


            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })


        /* Select Events */

        $('#cboSala').on('change', async () => {

            Cargando(1)

            await ProgramacionSalaOperaciones.ListarM_QuirofanoCQx($('#cboSala').val())

            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })

        /* Table Events */
        $('#tblListaSolicitudes tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ListaSolicitudes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
        ////////////////////////////////// TABLES //////////////////////////////////
        $('#tblProgramacionMedica tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ProgramacionMedica.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
        $('#tblPacientesBusqueda tbody').on('click', 'tr', function (e) {
            oTable_PacientesBusqueda.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })

        $('#tblPacientesBusqueda tbody').on('dblclick', 'tr', async function (e) {
            Cargando(1)
            oTable_PacientesBusqueda.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');

            let objrow = oTable_PacientesBusqueda.api(true).row('.selected').data()


            Cargando(1)

            let response = await ProgramacionSalaOperaciones.SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud(objrow.nroSolicitud)

            if (isEmpty(response)) {
                alerta(4, 'No se encontraron datos para el número de solicitud ingresado.')
                Cargando(0)
                return false
            }

            if (response.idProgramacionSala > 0) {
                swal({
                    title: 'Atención',
                    text: `Esta solicitud ya se encuentra registrada. \n N° Solicitud: ${response.nroSolicitud} \n N° Historia: ${response.nroHistoriaClinica} \n N° Cuenta: ${response.idCuentaAtencion}`,
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
                Cargando(0)
                return false
            }

            ProgramacionSalaOperaciones.CargarDatosSolicitudSalaQx(response)


            //$('#cboUbicacionPaciente').val(response.ultimoIdTipoServicio)
            //
            //$('#txtHcPaciente').val(response.nroHistoriaClinica)
            //$('#cboSexo').val(response.idTipoSexo)
            //



            console.log('response', response)


            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)

            ////let paciente = await CitasAdmision.PacientesSeleccionarPorId(objrow.idPaciente)

            //SolicitudSalaOperaciones.IdPaciente = objrow.idPaciente
            //SolicitudSalaOperaciones.NroHistoriaClinica = objrow.nroHistoriaClinica
            ////SolicitudSalaOperaciones.IdCuentaAtencion = 0

            //SolicitudSalaOperaciones.IdFormaPago = objrow.idFormaPago
            //SolicitudSalaOperaciones.IdFuenteFinanciamiento = objrow.idFuenteFinanciamiento
            //SolicitudSalaOperaciones.DireccionDomicilio = objrow.direccionDomicilio
            //SolicitudSalaOperaciones.IdSiaSis = objrow.idSiaSis
            //SolicitudSalaOperaciones.SisCodigo = objrow.sisCodigo
            //SolicitudSalaOperaciones.IdTipoEdad = objrow.idTipoEdad
            //SolicitudSalaOperaciones.IdTipoServicio = objrow.idTipoServicio


            //$('#cboUbicacionPaciente').val(objrow.idTipoServicio)
            //$('#txtDatosPaciente').val(objrow.paciente)
            //$('#txtHcPaciente').val(objrow.nroHistoriaClinica)
            //$('#txtEdad').val(objrow.edad)


            //$('#cboSexo').val(objrow.idTipoSexo)

            //isEmpty(objrow.idServicioEgreso) || objrow.idServicioEgreso == 0 ? $('#cboServicioOrigen').val(objrow.idServicioIngreso) : $('#cboServicioOrigen').val(objrow.idServicioEgreso)


            $('#modalPacientesBusqueda').modal('hide')

            $('.chzn-select').chosen().trigger("chosen:updated")

            Cargando(0)
        })
    },


    ///////////////////////////METODOS Y FUNCIONES////////////////////////////////////////
    BloquearCampos() {
        $(".campoEdicion").attr('disabled', 'disabled');
        $("#btnGuardarProgramacion").hide();
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    DesbloquearCampos() {
        $(".campoEdicion").removeAttr("disabled");
        $("#btnGuardarProgramacion").show();
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}

$(document).ready(() => {
    ProgramacionSalaOperaciones.Init()

    ConsumoServicio.IniciarScript()
    ConsumoServicio.IniciarData()
})

//let ProgramacionSalaOperaciones = {

//    IdPaciente: 0,
//    IdProgramacionSala: 0,
//    IdSolicitudSOP: 0,
//    IdEstadoSolicitud: 0,
//    NroHistoriaClinica: 0,
//    NroSolicitud: '',
//    IdCuentaAtencion: 0,

//    Plugins: function () {
//        $(".hide_search").chosen({ disable_search_threshold: 10 });
//        $(".chzn-select").chosen({ allow_single_deselect: true });
//        $(".chzn-select-deselect,#select2_sample").chosen();

//        $('#txtFechaSolicitudSalaOp').datepicker({
//            todayHighlight: true,
//            autoclose: true,
//            orientation: "bottom"

//        });
//        $('.chosen-container').css({ "width": "100%" });
//        $('.chosen-drop').css({ minWidth: '80%', width: 'auto' });

//        $('.chzn-select').chosen().trigger("chosen:updated")

//        $.mask.definitions['H'] = '[012]';
//        $.mask.definitions['N'] = '[012345]';
//        $.mask.definitions['n'] = '[0123456789]';

//        $("#txtHoraCirugia, #txtHoraFinalCirugia").mask("Hn:Nn");
//    },

//    CargaInicial: function () {
//        ProgramacionSalaOperaciones.ConfigurarCamposPorDefecto()
//    },

//    Init: async function () {
//        Cargando(1)
//        try {
//            ProgramacionSalaOperaciones.Plugins()
//            ProgramacionSalaOperaciones.CargaInicial()
//            ProgramacionSalaOperaciones.Events()

//            ProgramacionSalaOperaciones.InitDatablesListaSolicitudes()
//            ProgramacionSalaOperaciones.InitDatablesPacientesBusqueda()
//            ProgramacionSalaOperaciones.InitDatableDiagnostico()
//            ProgramacionSalaOperaciones.InitDatablesSolicitudCQx()


//            await ProgramacionSalaOperaciones.ListarTipoServicio()
//            await ProgramacionSalaOperaciones.ListarTipoSexo()
//
//            await ProgramacionSalaOperaciones.ListarCamasByIdServicio(88)
//            await ProgramacionSalaOperaciones.ListaTiposDocumentos()

//            await ProgramacionSalaOperaciones.ListarM_ClaseIntervencionCQx()
//            await ProgramacionSalaOperaciones.ListarM_ClasificacionPacienteCQx()
//            await ProgramacionSalaOperaciones.ListarM_TipoCirugiaCQx()
//            await ProgramacionSalaOperaciones.ListarM_OrdenCQx()
//            await ProgramacionSalaOperaciones.ListarM_SalaCQx()

//            await ProgramacionSalaOperaciones.ServicioSeleccionarPorTipoServicio(0)


//            /////////////DIAGNOSTICO////////////////////
//            BusquedaDiagnosticos.IniciarScript();
//            Diagnosticos.PanelDx = '#PanelDiagnostico ';
//            Diagnosticos.IniciarScript();
//            ///////////////////////////////////////////


//            Cargando(0)
//        } catch (e) {
//            alerta(3, 'Error: ' + e)
//            Cargando(0)
//        }

//    },

//    BuscaAtencionesCptCEparaFormatoHIS: (idCuentaAtencion) => {
//        var midata = new FormData();
//        midata.append('idCuentaAtencion', idCuentaAtencion);
//        Cargando(1)
//        oTable_consumoServAtencion.fnClearTable();
//        $.ajax({
//            method: "POST",
//            url: "/ConsumoServicio/BuscaAtencionesCptCEparaFormatoHIS?area=Facturacion",
//            data: midata,
//            dataType: "json",
//            processData: false,
//            contentType: false,
//            async: false,
//            success: function (datos) {
//                Cargando(0)
//                if (datos.session) {
//                    if (datos.listaCpt.table.length !== 0) {
//                        oTable_consumoServAtencion.fnAddData(datos.listaCpt.table);
//                    }
//                }
//                else {
//                    location.reload();
//                }
//            },
//            error: function (msg) {
//                alerta(3, "Error al listar Cpt");
//                Cargando(0)
//            }
//        });

//        oTable_consumoServAtencion.resize();
//    },
//    ListarTipoServicio: () => {
//        return HttpClient.Get('/Utilitario/listarTipoServicio?area=Comun').then(res => {
//            if (res.session) {
//                // Procesar los datos de las empresas
//                const datos = res.dataSet.table;

//                $('#cboUbicacionPaciente').empty();

//                if (datos.length > 0) {

//                    $(datos).each(function (i, obj) {
//                        if (obj.valor == 0) {
//                            $('#cboUbicacionPaciente').append(`<option value="${obj.valor}">Seleccionar una opcion</option>`)
//                        } else {
//                            $('#cboUbicacionPaciente').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
//                        }

//                    })

//                    $('.chzn-select').chosen().trigger("chosen:updated");
//                    return true
//                } else {
//                    console.log("No se encontraron datos.");
//                    return false
//                }
//            } else {
//                console.log("La sesión ha expirado.");
//                return false
//            }
//        })
//    },
//    ListarTipoSexo: () => {
//        return HttpClient.Get('/Utilitario/ListaTiposSexo?area=Comun').then(res => {
//            if (res.session) {
//                // Procesar los datos de las empresas
//                const datos = res.lsSexos.table;

//                $('#cboSexo').empty();

//                if (datos.length > 0) {

//                    $('#cboSexo').append(`<option value="0">Seleccionar una opcion</option>`)
//                    $(datos).each(function (i, obj) {
//                        $('#cboSexo').append(`<option value="${obj.idTipoSexo}">${obj.descripcion}</option>`)
//                    })

//                    $('.chzn-select').chosen().trigger("chosen:updated");
//                    return true
//                } else {
//                    console.log("No se encontraron datos.");
//                    return false
//                }
//            } else {
//                console.log("La sesión ha expirado.");
//                return false
//            }
//        })
//    },

//    ListarCamasByIdServicio: async (idServicio) => {
//        let camas = await Utilitario.SeleccionarCamaByIdServicio(idServicio)

//        if (!isEmpty(camas)) {
//            if (camas.table.length > 0) {
//                $('#cboNroCama').empty()
//                $('#cboNroCama').append('<option  value="0">--Seleccionar--</option>')
//                $(camas.table).each(function (i, obj) {
//                    $('#cboNroCama').append('<option  value="' + obj.idCama + '">' + obj.codigo + '</option>')
//                });

//                $('.chzn-select').chosen().trigger("chosen:updated")
//            }
//        }
//    },
//    ListaTiposDocumentos: () => {

//        fetch('/Utilitario/ListaTiposDocumentos?area=Comun', {
//            method: 'GET',
//            headers: {
//                'Content-Type': 'application/json'
//            }
//        })
//            .then(res => res.json())
//            .catch(error => console.error('Error:', error))
//            .then(response => {
//                $('#cboTipoDocTutor').empty();
//                $(response.lsDocumentos.table).each(function (i, obj) {
//                    $('#cboTipoDocTutor').append(`<option value="${obj.idDocIdentidad}">${obj.descripcionLarga}</option>`)
//                })
//                $('.chzn-select').chosen().trigger("chosen:updated");
//            })
//    },

//    ServicioSeleccionarPorTipoServicio: async (idTipoServicio) => {
//        let data = await Utilitario.ServicioSeleccionarPorTipoServicio(idTipoServicio)
//        if (!isEmpty(data)) {
//            if (data.table.length > 0) {
//                $('#cboServicioOrigen').empty()
//                $('#cboServicioOpera').empty()

//                $('#cboServicioOrigen').append('<option  value="0">Seleccionar una opcion</option>')
//                $('#cboServicioOpera').append('<option  value="0">Seleccionar una opcion</option>')
//                $(data.table).each(function (i, obj) {
//                    $('#cboServicioOrigen').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
//                    $('#cboServicioOpera').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>')
//                });

//                $('.chzn-select').chosen().trigger("chosen:updated")
//            }
//        }
//    },





//    ListarProgramacionSalaOperaciones: async (nroHistoria) => {
//        let formData = new FormData()

//        formData.append('NroHistoria', $('#txtHistoriaBusq').val())
//        formData.append('IdCuentaAtencion', 0)
//        formData.append('NroDocumento', $('#txtNroDocumentoBusq').val())
//        formData.append('ApellidoPaterno', $('#txtApPaternoBusq').val())
//        formData.append('ApellidoMaterno', $('#txtApMaternoBusq').val())
//        formData.append('FechaSolicitud', $('#txtFechaSolicitudBusq').val())

//        try {
//            const response = await HttpClient.Post(`/SalaOperaciones/ListarProgramacionSalaOperaciones?area=Comun&nroHistoria=${nroHistoria}`, formData)

//            if (!response.session) {
//                console.log("La sesión ha expirado.")
//                return false
//            }

//            if (!response.estado) {
//                console.error(response.msg)
//                throw new Error('Error en el servidor')
//            }

//            const datos = response.data.table

//            if (datos.length > 0) {
//                return datos
//            }
//            return null
//        } catch (error) {

//            alerta(2, 'Ocurrio un error')
//            console.error("Ha ocurrido un error:", error)
//            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
//            return false
//        }

//    },




//    ListarM_ClaseIntervencionCQx: () => {
//        let formData = new FormData()
//        return HttpClient.Post('/SalaOperaciones/ListarM_ClaseIntervencionCQx?area=Comun', formData).then(res => {
//            if (res.session) {
//                // Procesar los datos de las empresas
//                const datos = res.data.table;

//                $('#cboClaseIntervencion').empty();

//                if (datos.length > 0) {

//                    $('#cboClaseIntervencion').append(`<option value="0">Seleccionar una opcion</option>`)
//                    $(datos).each(function (i, obj) {
//                        $('#cboClaseIntervencion').append(`<option value="${obj.idClaseIntervencion}">${obj.descripcion}</option>`)
//                    })

//                    $('.chzn-select').chosen().trigger("chosen:updated");
//                    return true
//                } else {
//                    console.log("No se encontraron datos.");
//                    return false
//                }
//            } else {
//                console.log("La sesión ha expirado.");
//                return false
//            }
//        })
//    },
//    ListarM_ClasificacionPacienteCQx: () => {
//        let formData = new FormData()
//        return HttpClient.Post('/SalaOperaciones/ListarM_ClasificacionPacienteCQx?area=Comun', formData).then(res => {
//            if (res.session) {
//                // Procesar los datos de las empresas
//                const datos = res.data.table;

//                $('#cboClasePlaciente').empty();

//                if (datos.length > 0) {

//                    $('#cboClasePlaciente').append(`<option value="0">Seleccionar una opcion</option>`)
//                    $(datos).each(function (i, obj) {
//                        $('#cboClasePlaciente').append(`<option value="${obj.idClasificacion}">${obj.descripcion}</option>`)
//                    })

//                    $('.chzn-select').chosen().trigger("chosen:updated");
//                    return true
//                } else {
//                    console.log("No se encontraron datos.");
//                    return false
//                }
//            } else {
//                console.log("La sesión ha expirado.");
//                return false
//            }
//        })
//    },




//    ListarM_TurnosProgramacionCirugiaCQx: (IdTipoTurno) => {
//        let formData = new FormData()

//        formData.append('IdTipoTurno', IdTipoTurno)
//        return HttpClient.Post('/SalaOperaciones/ListarM_TurnosCirugiaCQx?area=Comun', formData).then(res => {
//            if (res.session) {
//                // Procesar los datos de las empresas
//                const datos = res.data.table;

//                $('#cboTurnoQx').empty();

//                if (datos.length > 0) {

//                    $('#cboTurnoQx').append(`<option value="0">Seleccionar una opcion</option>`)
//                    $(datos).each(function (i, obj) {
//                        $('#cboTurnoQx').append(`<option value="${obj.idTurnoCQx}">${obj.descripcion}</option>`)
//                    })

//                    $('.chzn-select').chosen().trigger("chosen:updated");
//                    return true
//                } else {
//                    console.log("No se encontraron datos.");
//                    return false
//                }
//            } else {
//                console.log("La sesión ha expirado.");
//                return false
//            }
//        })
//    },










//    ConfigurarCamposPorDefecto: () => {
//        //$('#txtHc').prop('disabled', true)
//        //$('#btnBuscarHC').prop('disabled', true)

//        //$('#txtPeso').prop('disabled', true)
//        //$('#cboSexo').prop('disabled', true)

//        //$('#cboUbicacionPaciente').prop('disabled', true)
//        //$('#cboTipoSolicitud').prop('disabled', true)
//        //$('#cboMedicoSolicita').prop('disabled', true)
//        //$('#cboTipoInterCQx').prop('disabled', true)
//        //$('#cboTipointervencion').prop('disabled', true)
//        //$('#cboTurno').prop('disabled', true)
//        //$('#cboTipoOperacion').prop('disabled', true)
//        //$('#cboTipoCirugia').prop('disabled', true)
//        ////$('#cboSala').prop('disabled', true)
//        //$('#cboEspecialidad').prop('disabled', true)
//        //$('#cboCondicion').prop('disabled', true)
//        //$('#cboQuirofano').prop('disabled', true)
//        //$('#cboServicioOrigen').prop('disabled', true)
//        //$('#cboNroCama').prop('disabled', true)
//        //$('#txtFechaCirugia').prop('disabled', true)
//        //$('#txtHoraCirugia').prop('disabled', true)
//        //$('#txtDescripcioncirugia').prop('disabled', true)
//        //$('#txtRiesgosDerivados').prop('disabled', true)
//        //$('#cboTipoDocTutor').prop('disabled', true)
//        //$('#txtNroDocumentoMaterno').prop('disabled', true)
//        //$('#cboParentesco').prop('disabled', true)
//        //$('#cboMedicoPrincipal').prop('disabled', true)
//        //$('#cboCirujanoII').prop('disabled', true)
//        //$('#cboMedicoAyudanteI').prop('disabled', true)
//        //$('#cboMedicoAyudanteII').prop('disabled', true)
//        //$('#cboAnestesiologo').prop('disabled', true)
//        //$('#cboAyudanteAnestesiologo').prop('disabled', true)
//        //$('#cboInstrumentistaI').prop('disabled', true)
//        //$('#cboInstrumentistaII').prop('disabled', true)
//        //$('#cboTecEnfermeria').prop('disabled', true)

//        $('.chzn-select').chosen().trigger("chosen:updated")
//    },

//    LimpiarDatosSolicitudSalaQx: () => {

//        ProgramacionSalaOperaciones.IdPaciente = 0
//        ProgramacionSalaOperaciones.IdProgramacionSala = 0
//        ProgramacionSalaOperaciones.IdSolicitudSOP = 0
//        ProgramacionSalaOperaciones.IdEstadoSolicitud = 0
//        ProgramacionSalaOperaciones.NroHistoriaClinica = 0
//        ProgramacionSalaOperaciones.NroSolicitud = ''
//        ProgramacionSalaOperaciones.IdCuentaAtencion = 0

//        $('#txtNroSolicitudBusq').val('')
//        $('#txtNroHistoriaSolicitud').val('')
//        $('#cboMedicoSolicita').val(0)
//        $('#txtEstado').val('')
//        $('#txtDatosPaciente').val('')
//        $('#txtNroSolicitud').val('')
//        $("#txtEdadAnioSolicitud").val('')
//        $("#txtEdadMesSolicitud").val('')
//        $("#txtEdadDiaSolicitud").val('')
//        $("#txtSexoSolicitud").val('')
//        $("#txtServicioSolicitud").val('')
//        $("#txtCamaSolicitud").val('')
//        $('#cboUbicacionPaciente').val(0)
//        $("#cboClaseIntervencion").val(0)
//        $("#cboClasePlaciente").val(0)
//        $("#txtFechaParaCQx").val('')
//        $("#txtHoraParaCqx").val('')
//        $("#txtFechaSolicitudCQx").val('')
//        $("#txtHoraSolicitudCQx").val('')
//        $("#txtFechaSolicitudCQxAceptada").val('')
//        $("#txtHoraSolicitudCQxAceptada").val('')

//        $("#cboTurnoQx").val(0)
//        $("#cboSala").val(0)
//        $("#cboTipoCirugiaProg").val(0)
//        $("#cboQuirofano").val(0)
//        $("#cboOrdenProg").val(0)
//        $("#txtFechaCirugia").val('')
//        $("#txtObservacionProgramacion").val('')
//        $('input[name="rdbRiesgoCardiologico"][value="0"]').prop('checked', true);
//        $("#cboNivelRiesgoCardiologico").val(0)
//        $('input[name="rdbBancoSangre"][value="0"]').prop('checked', true);
//        $("#txtCantBancoSangre").val('')
//        $('input[name="rdbExamenesAuxiliares"][value="0"]').prop('checked', true);
//        $('input[name="rdbEvaluacionPreanestesica"][value="0"]').prop('checked', true);
//        $('input[name="rdbConsentimientoInformado"][value="0"]').prop('checked', true);

//        $('#cboMedicoPrincipal').val(0)
//        $('#cboCirujanoII').val(0)
//        $('#cboMedicoAyudanteI').val(0)
//        $('#cboMedicoAyudanteII').val(0)
//        $('#cboAnestesiologo').val(0)
//        $('#cboAyudanteAnestesiologo').val(0)
//        $('#cboInstrumentistaI').val(0)
//        $('#cboInstrumentistaII').val(0)
//        $('#cboTecEnfermeria').val(0)

//        ObjtableDiagnosticosSolicitudCQx.fnClearTable()
//        oTable_solicitudCQx.fnClearTable()

//        //$('#cboUbicacionPaciente').val(0)
//        //$('#txtDatosPaciente').val('')
//        //$('#txtNroSolicitud').val('')
//        //$('#txtHcPaciente').val('')
//        //$('#txtEdad').val('')
//        //$('#txtPeso').val('')
//        //$('#cboSexo').val(0)
//        //$('#txtFechaSolicitudSalaOp').val('')
//        //$('#cboTipoSolicitud').val(0)
//        //$('#cboMedicoSolicita').val(0)
//        //$('#txtEstado').val('')
//        //$('#cboTipoInterCQx').val(0)
//        //$('#cboTipointervencion').val(0)
//        //$('#cboTurno').val(0)
//        //$('#cboTipoOperacion').val(0)
//        //$('#cboTipoCirugia').val(0)
//        //$('#cboSala').val(0)
//        //$('#cboEspecialidad').val(0)
//        //$('#cboCondicion').val(0)
//        //$('#cboQuirofano').val(0)
//        //$('#cboServicioOrigen').val(0)
//        //$('#cboNroCama').val(0)
//        //$('#txtFechaCirugia').val('')
//        //$('#txtHoraCirugia').val('')
//        //$('#txtDescripcioncirugia').val('')
//        //$('#txtRiesgosDerivados').val('')
//        //$('#cboTipoDocTutor').val(0)
//        //$('#txtNroDocumentoMaterno').val('')
//        //$('#cboParentesco').val(0)




//        //$('#cboServicioOpera').val(0)
//        //$('#cboBancoSangre').val(0)
//        //$('#txtCantBancoSangre').val('')
//        //$('#txtGrupoSanguineo').val('')
//        //$('#txtFactorRH').val('')
//        //$('#cboRiesgoQx').val(0)
//        //$('#txtReqInstrumental').val('')
//        //$('#cboTurnoQx').val(0)
//        //$('#txtTiempoQx').val('')
//        //$('#txtHoraFinalCirugia').val('')
//        //$('#txtResumenCirugia').val('')

//        $('.chzn-select').chosen().trigger("chosen:updated")
//    },
//    HabilitarDeshabilitarCamposSolicitudQx: (estado) => {

//        $('#txtNroSolicitudBusq').prop('disabled', estado);
//        $('#btnBuscarNroSolicitud').prop('disabled', estado);

//        $('#cboTurnoQx').prop('disabled', estado);
//        $('#cboSala').prop('disabled', estado);
//        $('#cboTipoCirugiaProg').prop('disabled', estado);
//        $('#cboQuirofano').prop('disabled', estado);
//        $('#cboOrdenProg').prop('disabled', estado);
//        $('#txtFechaCirugia').prop('disabled', estado);
//        $('#txtObservacionProgramacion').prop('disabled', estado);

//        $('input[name="rdbRiesgoCardiologico"]').prop('disabled', estado);
//        $('#cboNivelRiesgoCardiologico').prop('disabled', estado);
//        $('input[name="rdbBancoSangre"]').prop('disabled', estado);
//        $('#txtCantBancoSangre').prop('disabled', estado);
//        $('input[name="rdbExamenesAuxiliares"]').prop('disabled', estado);
//        $('input[name="rdbEvaluacionPreanestesica"]').prop('disabled', estado);
//        $('input[name="rdbConsentimientoInformado"]').prop('disabled', estado);
//        //$('input[name="options"]').prop('disabled', estado);



//        $('#cboMedicoPrincipal').prop('disabled', estado);
//        $('#cboCirujanoII').prop('disabled', estado);
//        $('#cboMedicoAyudanteI').prop('disabled', estado);
//        $('#cboMedicoAyudanteII').prop('disabled', estado);
//        $('#cboAnestesiologo').prop('disabled', estado);
//        $('#cboAyudanteAnestesiologo').prop('disabled', estado);
//        $('#cboInstrumentistaI').prop('disabled', estado);
//        $('#cboInstrumentistaII').prop('disabled', estado);
//        $('#cboTecEnfermeria').prop('disabled', estado);

//        $('.chzn-select').chosen().trigger("chosen:updated")
//    },

//    InitDatablesListaSolicitudes: () => {

//        var parms = {
//            "scrollY": "600px",
//            "scrollCollapse": true,
//            "autoWidth": false,
//            data: null,
//            destroy: true,
//            info: false,
//            bFilter: false,
//            paging: false,
//            responsive: true,
//            columns: [
//                {
//                    width: '10%',
//                    targets: 0,
//                    data: "nroSolicitud",
//                    createdCell: function (td, cellData, rowData, row, col) {
//                        $(td).attr('align', 'left')
//                        $(td).text(rowData.nroSolicitud.padStart(9, 0))
//                    }
//                },
//                {
//                    width: '10%',
//                    targets: 1,
//                    data: 'fechaSolicitud',
//                    createdCell: function (td, cellData, rowData, row, col) {
//                        $(td).attr('align', 'left')
//                    }
//                },
//                {
//                    width: '10%',
//                    targets: 2,
//                    data: 'nroHistoriaClinica',
//                    createdCell: function (td, cellData, rowData, row, col) {
//                        $(td).attr('align', 'left')
//                    }
//                },
//                {
//                    width: '70%',
//                    targets: 2,
//                    data: 'paciente',
//                    createdCell: function (td, cellData, rowData, row, col) {
//                        $(td).attr('align', 'left')
//                    }
//                },
//                {
//                    width: '10%',
//                    targets: 4,
//                    data: 'estado',
//                    createdCell: function (td, cellData, rowData, row, col) {
//                        $(td).attr('align', 'left')


//                        if (rowData.idEstado == 1) {
//                            $(td).html('<span class="chip secondary">' + rowData.estado + '</span >');
//                        }
//                        if (rowData.idEstado == 2) {
//                            $(td).html('<span class="chip blue">' + rowData.estado + '</span >');
//                            $(td).parent().css('color', '#758cff');
//                        }
//                        if (rowData.idEstado == 3) {
//                            $(td).html('<span class="chip" style="background: #a206cb; color: #fff;">' + rowData.estado + '</span >');
//                            $(td).parent().css('color', '#a206cb');
//                        }
//                        if (rowData.idEstado == 4) {
//                            $(td).html('<span class="chip success">' + rowData.estado + '</span >');
//                            $(td).parent().css('color', '#00cc99');
//                        }
//                        if (rowData.idEstado == 10) {
//                            $(td).html('<span class="chip danger">' + rowData.estado + '</span >');
//                            $(td).parent().css('color', '#df4a44');
//                        }
//                    }
//                }
//            ]
//        }

//        var tableWrapper = $('#tblListaSolicitudes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
//        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//        oTable_ListaSolicitudes = $("#tblListaSolicitudes").dataTable(parms);

//    },






//    Events: function () {
//        /* Button Events */


//        $("#btnModificarRegistro").on("click", function () {
//            let objRow = oTable_ListaSolicitudes.api(true).row('.selected').data()

//            if (isEmpty(objRow)) {
//                alerta(2, 'Selecciona un registro de la tabla.')
//                return false
//            }

//            if (objRow.idEstado == 4) {
//                swal({
//                    title: 'Atención',
//                    html: `La solicitud con estado <b>${objRow.estado}</b>, no se puede modificar.`,
//                    type: 'warning',
//                    allowOutsideClick: false,
//                }).done();

//                return false
//            }

//            ProgramacionSalaOperaciones.HabilitarDeshabilitarCamposSolicitudQx(false)

//            $('#btnGuardar').show()

//            ProgramacionSalaOperaciones.LimpiarDatosSolicitudSalaQx()
//            ProgramacionSalaOperaciones.CargarDatosSolicitudSalaQx(objRow)

//            $("#modalSolicitudSalaOp").modal("show");
//        })

//        $("#btnConsultar").on("click", function () {
//            let objRow = oTable_ListaSolicitudes.api(true).row('.selected').data()

//            if (isEmpty(objRow)) {
//                alerta(2, 'Selecciona un registro de la tabla.')
//                return false
//            }

//            ProgramacionSalaOperaciones.HabilitarDeshabilitarCamposSolicitudQx(true)

//            $('#txtHc').prop('disabled', true)
//            $('#btnBuscarHC').prop('disabled', true)
//            $('#btnGuardar').hide()

//            ProgramacionSalaOperaciones.LimpiarDatosSolicitudSalaQx()
//            ProgramacionSalaOperaciones.CargarDatosSolicitudSalaQx(objRow)

//            $("#modalSolicitudSalaOp").modal("show");
//        })

//        $('#btnBuscarPacientes').on('click', async () => {
//            //if ($('#txtHc').val() == '') {
//            //    alerta(2, 'Debe ingresar un Nro. de Historia para la busqueda.')
//            //    $('#txtHc').focus()
//            //    return false
//            //}

//            Cargando(1)

//            let response = await ProgramacionSalaOperaciones.ListarProgramacionSalaOperaciones()

//            oTable_ListaSolicitudes.fnClearTable()

//            if (isEmpty(response)) {
//                alerta(4, 'No se encontraron datos.')
//                Cargando(0)
//                return false
//            }

//            oTable_ListaSolicitudes.fnAddData(response)



//            Cargando(0)
//        })








//    },
//}

