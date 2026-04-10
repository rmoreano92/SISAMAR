window.onbeforeunload = async function (e) { // -M
    CitasTerapia.CitasTerapiasBloqueadasEliminar()
};

var myMenu = [
    {
        // This example uses Font Awesome Iconic Font.
        icon: 'fa fa-calendar-o',
        // Menu Label
        label: 'Agregar Cita',
        idAccion: 1,
        // Callback
        action: function (option, contextMenuIndex, optionIndex) {
            CitasTerapia.SeleccionarOpcionMenuContextual(option)
        },
        // An array of submenu objects
        submenu: null,
        // is disabled?
        disabled: false   //Disabled status of the option
    },

    {
        icon: 'fa fa-pencil-square-o',
        label: 'Modificar Cita',
        idAccion: 2,
        action: function (option, contextMenuIndex, optionIndex) {
            CitasTerapia.SeleccionarOpcionMenuContextual(option)
        },
        submenu: null,
        disabled: false
    },

    {
        icon: 'fa fa-hospital-o',
        label: 'Interconsulta',
        idAccion: 3,
        action: function (option, contextMenuIndex, optionIndex) {
            CitasTerapia.SeleccionarOpcionMenuContextual(option)
        },
        submenu: null,
        disabled: false
    },

    {
        icon: 'fa fa-print',
        label: 'Imprimir ticket',
        idAccion: 4,
        action: function (option, contextMenuIndex, optionIndex) {
            CitasTerapia.SeleccionarOpcionMenuContextual(option)
        },
        submenu: null,
        disabled: false
    },

    {
        icon: 'fa fa-trash-o',
        label: 'Eliminar Cita',
        idAccion: 10,
        action: function (option, contextMenuIndex, optionIndex) {
            CitasTerapia.SeleccionarOpcionMenuContextual(option)
        },
        submenu: null,
        disabled: false
    },
    //{
    //    //Menu separator
    //    separator: true
    //},
    //{
    //    icon: 'fa fa-share',
    //    label: 'Compartir',
    //    action: function (option, contextMenuIndex, optionIndex) { },
    //    submenu: [{ // sub menus
    //        icon: 'fa fa-facebook',
    //        label: '<a href="https://www.facebook.com/Baulphp-1484048218538757/" target="_blank">Facebook</a>',
    //        action: function (option, contextMenuIndex, optionIndex) { },
    //        submenu: null,
    //        disabled: false
    //    },
    //    {
    //        icon: 'fa fa-twitter',
    //        label: '<a href="https://twitter.com/?lang=es" target="_blank">Twitter</a>',
    //        action: function (option, contextMenuIndex, optionIndex) { },
    //        submenu: null,
    //        disabled: false
    //    },
    //    {
    //        icon: 'fa fa-google-plus',
    //        label: '<a href="https://plus.google.com/" target="_blank">Google Plus</a>',
    //        action: function (option, contextMenuIndex, optionIndex) { },
    //        submenu: null,
    //        disabled: false
    //    }],
    //    disabled: false
    //},
];

let CitasTerapia = {

    FechaSeleccionada: FormatearFecha(new Date()),
    IdMedico: 0,
    IdAtencion: 0,
    IdServicio: 0,
    IdEspecialidad: 0,
    IdProgramacion: 0,
    IdPaciente: 0,
    IdCita: 0,
    TipoCita: 'N',
    TotalCupos: 0,
    CuposAsignados: 0,
    EsCitaAdicional: 0,
    //Id: 0,
    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';

        $('#txtFechaNuevaReemplazaReprogMed').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy',
            startDate: new Date() // Bloquea fechas anteriores a hoy
        })

        $('#txtFechaNuevaReemplazaReprogMed').mask("Dd/Mm/abcd");


        $("#txtHoraFinActualReprogMed").mask("Hn:Nn");

    },

    ListarAnios: function () {
        for (i = 2000; i < 2072; i += 1) {
            $('#cboAnio').append(`<option value="${i}">${i}</option>`)
        }
    },

    CargaDatosIniciales: async function () {

        var fecha = new Date()

        var mesSincero = parseInt(fecha.getMonth()) + 1

        this.ListarAnios()
        await this.ActualizarListaProgramacion()

        $(`#cboAnio option[value='${fecha.getFullYear()}']`).attr("selected", true);
        $(`#cboMes option[value='${mesSincero}']`).attr("selected", true)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    ConfigCalendar: function () {
        opts = {
            header: false,
            locale: 'es',
            height: 280,
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],

            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            dayClick: async function (date, jsEvent, view) {
                Cargando(1)
                let fecha = date.format()

                CitasTerapia.FechaSeleccionada = fecha.substr(8, 2) + '/' + fecha.substr(5, 2) + '/' + fecha.substr(0, 4)

                await CitasTerapia.ActualizarListaProgramacion()
                await CitasTerapia.MostrarProgramacionPorFecha()

                console.log('fecha', FormatearFecha(fecha))
                //CitasAdmision.anio = fecha.substr(0, 4)
                //CitasAdmision.mes = fecha.substr(5, 2)
                //CitasAdmision.dia = fecha.substr(8, 2)

                ////CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
                //await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
                //await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

                //await CitasAdmision.ListaServicios(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

                $(".day-highlight").removeClass("day-highlight");
                $(this).addClass("day-highlight");
                Cargando(0)
            },
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
                Cargando(1)
                let fecha = event.start.format('YYYY-MM-DD');

                CitasTerapia.FechaSeleccionada = fecha.substr(8, 2) + '/' + fecha.substr(5, 2) + '/' + fecha.substr(0, 4)
                //CitasAdmision.anio = fecha.substr(0, 4)
                //CitasAdmision.mes = fecha.substr(5, 2)
                //CitasAdmision.dia = fecha.substr(8, 2)

                ////CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
                //await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
                //await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

                //await CitasAdmision.ListaServicios(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

                await CitasTerapia.ActualizarListaProgramacion()
                await CitasTerapia.MostrarProgramacionPorFecha()

                $(".day-highlight").removeClass("day-highlight");
                $('.fc-day').removeClass('highlight');

                $('.fc-day[data-date="' + fecha + '"]').addClass('day-highlight');
                ////$($(this).parent()).addClass("day-highlight");
                Cargando(0)
            },
        }

        $('#calendar').fullCalendar(opts);
    },
    InitDatablesMedicosProgramados: function () {
        hProgram = ($(window).height() - $("#top").height() - $("#top").height() - $("#header").height() - $("#filtroProgramacion").height() - 25) + 'px';
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            //scrollY: '50vh',
            scrollY: hProgram,
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "dservicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idProgramacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        oTable_medicosProgramados = $("#tblMedicosProgramados").dataTable(parms);
    },
    InitDatablesCupos: function () {
        hCupos = ($(window).height() - $("#top").height() - $("#top").height() - $("#header").height() - 55) + 'px';
        let parms = {
            data: null,
            info: false,
            bFilter: false,
            paging: false,
            ordering: false,
            //scrollY: '70vh',
            scrollY: hCupos,
            scrollCollapse: true,
            columns: [
                {
                    data: "id",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        let tipoCita = 'P'

                        if (rowData.idReferencia > 0) {
                            tipoCita = 'RF'
                        }
                        if (rowData.tipoCita == 'I ') {
                            tipoCita = 'I'
                        }

                        //let tipoCita = rowData.tipoCita.trim() == 'I' ? 'I' : rowData.tipoCita.trim() == 'R' ? 'R' : 'P'



                        let estado = "[" + (rowData.id < 10 ? '0' + rowData.id : rowData.id) + "] &nbsp;"
                        let datosAtencion = "N° Cuenta: " + rowData.idCuentaAtencion + " &nbsp; &nbsp; &nbsp;" + " Plan: " + rowData.fuenteFinanciamiento
                        let datosPaciente = "&nbsp; &nbsp; &nbsp; &nbsp; HC: " + rowData.nroHistoria + " &nbsp; &nbsp; &nbsp;" + " Paciente: " + rowData.pacienteNombre
                        let info = '&nbsp; &nbsp; &nbsp; &nbsp; H. I. ' + rowData.turnoHoraInicio.substr(0, 5) + '&nbsp; &nbsp; H. F. ' + rowData.turnoHoraFin.substr(0, 5)

                        let boton = ""
                        //let datosAtencion = 'HC: ' + rowData. + '  &nbsp;   &nbsp; : ' + rowData.
                        let NroCupoCita = "<div style='width:25px;line-height: 15px;'><span>[" + (rowData.id < 10 ? '0' + rowData.id : rowData.id) + "]</span></div>";
                        let NroCuentaCita = "<span class='mr-1'>N° Cuenta: " + rowData.idCuentaAtencion + "</span>";
                        let PlanCita = "<span>Plan: " + rowData.fuenteFinanciamiento + "</span>";
                        let HistoriaCita = "<span class='mr-1'>HC: " + rowData.nroHistoria + "</span>";
                        let PacienteCita = "<span>Paciente: " + rowData.pacienteNombre + "</span>";
                        let HorarioCita = "<span class='mr-1'>" + rowData.turnoHoraInicio.substr(0, 5) + " - " + rowData.turnoHoraFin.substr(0, 5) + "</span>";
                        let TipoCita = "<span class='mr-1'>Tipo Cita: " + tipoCita + "</span>";
                        let UsuarioCita = "<span>Usuario: " + rowData.usuarioCita + "</span>"

                        let TipoPaciente = "<span class='mr-1'>Tipo Paciente: " + rowData.tipoPaciente + "</span>";
                        let FechaSolicitud = "<span>Fecha Solicitud: " + rowData.fechaSolicitud + "</span>"
                        /*console.log(fila1)
                        console.log(fila2)
                        console.log(fila3)*/
                        let EstadoCita = "";
                        let InfoFila1CupoCita = "";
                        let InfoFila2CupoCita = "";
                        let InfoFila3CupoCita = "";
                        let InfoCupoCita = "";

                        if (rowData.idEstadoCita == "1") {
                            EstadoCita = "<span class='mr-1'>Estado: SEPARADO</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + NroCuentaCita + PlanCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;' class='text-truncate'>" + HistoriaCita + PacienteCita + "</div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + TipoCita + UsuarioCita + "</div>";
                            InfoFila4CupoCita = "<div style='line-height: 15px;'>" + TipoPaciente + FechaSolicitud + "</div>";
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + InfoFila4CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " Estado: SEPARADO &nbsp; &nbsp; &nbsp;" + datosAtencion + "<br>" + datosPaciente
                            //info = info + '&nbsp; &nbsp; Tipo Cita: ' + tipoCita + '  &nbsp; &nbsp; Usuario: ' + rowData.usuarioCita

                            if (rowData.estaHospitalizado > 0) {
                                $(td).css('background', '#ff00e0');
                            } else {
                                $(td).css('background', '#f79836');
                            }
                        }
                        if (rowData.idEstadoCita == "4") {
                            EstadoCita = "<span class='mr-1'>Estado: PAGADO</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + NroCuentaCita + PlanCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;' class='text-truncate'>" + HistoriaCita + PacienteCita + "</div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + TipoCita + UsuarioCita + "</div>";
                            InfoFila4CupoCita = "<div style='line-height: 15px;'>" + TipoPaciente + FechaSolicitud + "</div>";
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + InfoFila4CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " Estado: PAGADO &nbsp; &nbsp; &nbsp;" + datosAtencion + "<br>" + datosPaciente
                            //info = info + '&nbsp; &nbsp; Tipo Cita: ' + tipoCita + '  &nbsp; &nbsp; Usuario: ' + rowData.usuarioCitam

                            $(td).css('background', '#00a1ff;');
                        }
                        if (rowData.idEstadoCita == "2") {
                            EstadoCita = "<span class='mr-1'>Estado: ATENDIDO</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + NroCuentaCita + PlanCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;' class='text-truncate'>" + HistoriaCita + PacienteCita + "</div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + TipoCita + UsuarioCita + "</div>";
                            InfoFila4CupoCita = "<div style='line-height: 15px;'>" + TipoPaciente + FechaSolicitud + "</div>";
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + InfoFila4CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " Estado: ATENDIDO &nbsp; &nbsp; &nbsp;" + datosAtencion + "<br>" + datosPaciente
                            //info = info + '&nbsp; &nbsp; Tipo Cita: ' + tipoCita + '  &nbsp; &nbsp; Usuario: ' + rowData.usuarioCita
                        }
                        if (rowData.idEstadoCita == "0") {
                            EstadoCita = "<span class='mr-1'>Estado: DISPONIBLE</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;'><span>&nbsp;</span></div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
                            //InfoFila4CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " Estado: &nbsp DISPONIBLE"
                            $(td).css('background', '#6fcf72');
                        }
                        if (rowData.idEstadoCita == "6") {
                            EstadoCita = "<span class='mr-1'>Estado: BLOQUEADO</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;'><span>&nbsp;</span></div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
                            /*InfoFila4CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";*/
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " ESTADO: &nbsp BLOQUEADO"
                            $(td).css('background', '#f0ff14');
                        }

                        //$(td).html("<b>" + InfoCupoCita + estado + ' <BR> ' + info + "</b>")
                        $(td).html("<b>" + InfoCupoCita + "</b>");
                    }
                }
            ]
        }

        var tableWrapper = $('#tblCupos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_cupos = $("#tblCupos").dataTable(parms);
    },

    InitDatablesDetalleOrdenCitaTerapia: function () {
        hCupos = ($(window).height() - $("#top").height() - $("#top").height() - $("#header").height() - 55) + 'px';
        let parms = {
            data: null,
            info: false,
            bFilter: false,
            paging: false,
            ordering: false,
            //scrollY: '70vh',
            scrollY: hCupos,
            scrollCollapse: true,
            columns: [
                {
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
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
                }
            ]
        }

        var tableWrapper = $('#tblDetalleOrdenCitaTerapia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_DetalleOrdenCitaTerapia = $("#tblDetalleOrdenCitaTerapia").dataTable(parms);
    },
    InitDatablesCitasTerapiaPorPaciente: function () {
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            bFilter: false,
            columns: [
                {
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "horaFin",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        $(td).html(moment(rowData.fecha).format('L'))
                    }
                },
                {
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "hc",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        oTable_CitasTerapiaPorPaciente = $("#tblCitasTerapiaPorPaciente").dataTable(parms);
    },
    ListarMedicosPorFiltroConEspecialidad: function () {

        return HttpClient.Get('/Citas/listarMedicosPorFiltroConEspecialidad?area=ConsultaExterna').then(res => {
            $('#cboMedico').empty();
            $('#cboMedico').append(`<option value="0">Seleccione una opción<option>`)
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboMedico').append(`<option value="${obj.idmedico}">${obj.nombre}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");
        })
    },
    ListarMedicosFiltrarPorProgramacion: async function (fecha) {
        let formData = new FormData();

        let idMedico = $('#cboMedico').val()
        let idServicio = $('#cboDepartamentosHospital').val()

        let lcFiltro = `WHERE dbo.ProgramacionMedica.Fecha = CONVERT(DATETIME,'${fecha}',103) `

        if (idMedico != '0' && !isEmpty(idMedico)) {
            lcFiltro += ` and dbo.Medicos.IdMedico = ${idMedico} `
        }
        if (idServicio != '0' && !isEmpty(idServicio)) {
            lcFiltro += ` and dbo.ProgramacionMedica.IdServicio = ${idServicio} `
        }

        lcFiltro += ` and dbo.Servicios.activaProcedimiento=2 ORDER BY dbo.Servicios.Nombre`

        formData.append("lcFiltro", lcFiltro)

        let data = await HttpClient.Post('/Citas/listarmedicosfiltrarporprogramacion?area=Comun', formData)

        if (!isEmpty(data) && data.estado) {
            if (data.data.table.length > 0) {
                return data.data.table
            }
            else {
                /*alerta(2, 'No se ha encontrado una programación correspondiente a los datos ingresados.')*/
                return null
            }
        } else {
            //alerta(2, 'No se ha encontrado una programación correspondiente a los datos ingresados.')
            console.error('3', 'Error: ' + res.msg)
            return null
        }
    },

    ActualizarListaServicios: async function () {

        let servicios = await this.ListarMedicosFiltrarPorProgramacion(CitasTerapia.FechaSeleccionada)

        if (isEmpty(servicios)) return

        $('#cboDepartamentosHospital').empty();
        $('#cboDepartamentosHospital').append(`<option value="0">Seleccione una opción</option>`)
        $(servicios).each(function (i, obj) {
            $('#cboDepartamentosHospital').append(`<option value="${obj.idServicio}">${obj.dservicio}</option>`)
        })
        $('.chzn-select').chosen().trigger("chosen:updated");
        console.log('servicios', servicios)
    },

    ActualizarListaMedicosProgramados: async function () {

        let medicos = await this.ListarMedicosFiltrarPorProgramacion(CitasTerapia.FechaSeleccionada)

        oTable_medicosProgramados.fnClearTable()

        if (isEmpty(medicos)) {
            alerta(2, 'No se ha encontrado una programación correspondiente a los datos ingresados.')
            return
        }

        oTable_medicosProgramados.fnAddData(medicos)

        $('#tblMedicosProgramados tbody tr:first').addClass('selected')

        let objrow = oTable_medicosProgramados.api(true).row('.selected').data();

        CitasTerapia.IdMedico = objrow.idMedico
        CitasTerapia.IdServicio = objrow.idServicio
        CitasTerapia.IdEspecialidad = objrow.idEspecialidad
        CitasTerapia.IdProgramacion = objrow.idProgramacion

        console.log('medicos', medicos)
    },

    ListarProgramacionMedicaPorIdMedicoMesAnio: function (idMedico, mes, anio, idServicio) {
        let formData = new FormData();

        formData.append("idMedico", idMedico)
        formData.append("mes", mes)
        formData.append("anio", anio)
        formData.append("idServicio", idServicio)

        return HttpClient.Post('/Citas/ProgramacionMedicaPorIdMedicoMesAnio?area=ConsultaExterna', formData).then(res => {
            $('#calendar').fullCalendar('removeEvents')
            $(res.dataSet.table).each(function (i, obj) {
                $("#calendar").fullCalendar('renderEvent',
                    {
                        start: obj.fecha.substr(0, 10),
                        end: obj.fecha.substr(0, 10),
                        overlap: false,
                        rendering: 'background',
                        title: '<i class="fa fa-edit"></i>',
                        color: '#7fcbfb'

                    });

                $("#calendar").fullCalendar('renderEvent',
                    {
                        start: obj.fecha.substr(0, 10),
                        end: obj.fecha.substr(0, 10),
                        overlap: false,
                        //rendering: 'background',
                        title: `<b style="font-size: 11px"><i class="far fa-clock" style="text-center"></i> ${obj.turno} / ${obj.cuposLibres}</b>`,
                        color: '#fff0'

                    });
            })
        })
    },

    ListaCuposCitasTerapia: async function (idProgramacion) {
        let formData = new FormData();
        formData.append("idProgramacion", idProgramacion)

        let res = await HttpClient.Post('/Citas/ListaCuposCitasTerapia?area=Comun', formData)

        if (res.dataSet.table.length > 0) {

            let filterCupos = res.dataSet.table.filter(obj => (obj.idEstadoCita !== '0' && obj.idEstadoCita !== '6'))

            CitasTerapia.TotalCupos = res.dataSet.table.length
            CitasTerapia.CuposAsignados = filterCupos.length;
            //CitasTerapia.Cupos = res.dataSet.table.filter(obj => (obj.idEstadoCita !== 0 && obj.idEstadoCita !== 6)).length;
            //

            

            $('#spNroCuposLibres').text((CitasTerapia.TotalCupos - CitasTerapia.CuposAsignados))
            $('#spNroCuposAsignados').text(CitasTerapia.CuposAsignados)

            if ((CitasTerapia.TotalCupos - CitasTerapia.CuposAsignados) == 0) {
                $('#btnCitaAdicional').attr('disabled', false)
            } else {
                $('#btnCitaAdicional').attr('disabled', true)
            }

            return res.dataSet.table
        }

        return null
    },

    ActualizarListaProgramacion: async function () {
        await this.ActualizarListaServicios()
        await this.ActualizarListaMedicosProgramados()
    },

    ActualizarListaCupos: async function (idProgramacion) {

        oTable_cupos.fnClearTable()

        CitasTerapia.EsCitaAdicional = 0

        let res = await this.ListaCuposCitasTerapia(idProgramacion)
        await this.CitasSeleeccionarPacientePorIdProgramacion(idProgramacion)

        if (!isEmpty(res) && res.length > 0) {
            
            oTable_cupos.fnAddData(res)
        }
    },

    BuscarOrdenParaCitaTerapia: async function (TipoFiltro, NroSerie, NroOrdenBoleta) {

        let formData = new FormData()

        formData.append("TipoFiltro", TipoFiltro);
        formData.append("NroSerie", NroSerie);
        formData.append("NroOrdenBoleta", NroOrdenBoleta);

        let response = await HttpClient.Post(`/Citas/BuscarOrdenParaCitaTerapia`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        return data[0]
    },

    ListaCitaTerapiaByIdCita: async function (idCita) {

        let formData = new FormData()

        formData.append("idCita", idCita);

        let response = await HttpClient.Post(`/Citas/ListaCitaTerapiaByIdCita`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        return data[0]
    },

    CajaComprobantePagoServiciosPorNroSerieNroDocumentoByMGP: async function (NroSerie, NroDocumento, idTipoComprobante) {

        let formData = new FormData()

        formData.append("NroSerie", NroSerie);
        formData.append("NroDocumento", NroDocumento);
        formData.append("idTipoComprobante", idTipoComprobante);

        let response = await HttpClient.Post(`/Citas/BuscarOrdenParaCitaTerapia`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        return data[0]
    },

   

    CitasSeleeccionarPacientePorIdProgramacion: async function (IdProgramacion) {

        let formData = new FormData()

        formData.append("IdProgramacion", IdProgramacion);

        oTable_CitasTerapiaPorPaciente.fnClearTable()

        let response = await HttpClient.Post(`/Citas/CitasSeleeccionarPacientePorIdProgramacion`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        oTable_CitasTerapiaPorPaciente.fnAddData(data)
    },
    FacturacionServicioDespachoDetalleFiltraPorIdOrden: async function (idOrden) {

        let formData = new FormData()

        formData.append("idOrden", idOrden);

        oTable_DetalleOrdenCitaTerapia.fnClearTable()

        let response = await HttpClient.Post(`/ConsumoServicio/FacturacionServicioDespachoDetalleFiltraPorIdOrden`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        data = data.filter(obj => obj.idCitaTerapia == 0)

        if (data.length > 0) {
            oTable_DetalleOrdenCitaTerapia.fnAddData(data)
        }
        
    },
    ListaRecetasInterconsulta: async function (nroOrden, idEspecialidad) {

        let formData = new FormData()

        formData.append('nroOrden', nroOrden)
        formData.append('idEspecialidad', idEspecialidad)

        oTable_DetalleOrdenCitaTerapia.fnClearTable()

        let response = await HttpClient.Post(`/Citas/ListaRecetasInterconsulta`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.dataSet.table

        if (data.length <= 0) {
            return false
        }

        oTable_DetalleOrdenCitaTerapia.fnAddData(data)


    },
   
    CrearModificarCitasTerapia: async function (
        HoraSolicitud, FechaSolicitud, IdProducto, IdProgramacion, IdServicio, HoraFin, HoraInicio, Fecha, IdEstadoCita,
        IdMedico, IdEspecialidad, IdAtencion, IdPaciente, EsCitaAdicional, TipoCita, IdCuenta, nroOrden, IdCitaRegistrada
    ) {

        let formData = new FormData()

        formData.append("HoraSolicitud", HoraSolicitud);
        formData.append("FechaSolicitud", FechaSolicitud);
        formData.append("IdProducto", IdProducto);
        formData.append("IdProgramacion", IdProgramacion);
        formData.append("IdServicio", IdServicio);
        formData.append("HoraFin", HoraFin);
        formData.append("HoraInicio", HoraInicio);
        formData.append("Fecha", Fecha);
        formData.append("IdEstadoCita", IdEstadoCita);
        formData.append("IdMedico", IdMedico);
        formData.append("IdEspecialidad", IdEspecialidad);
        formData.append("IdAtencion", IdAtencion);
        formData.append("IdPaciente", IdPaciente);
        formData.append("EsCitaAdicional", EsCitaAdicional);
        formData.append("TipoCita", TipoCita);
        formData.append("IdCuenta", IdCuenta);
        formData.append("nroOrden", nroOrden);
        formData.append("IdCitaRegistrada", IdCitaRegistrada);

        let response = await HttpClient.Post(`/Citas/CrearModificarCitasTerapia`, formData)

        if (isEmpty(response)) {
            return false
        }

        return response
    },
    CitasEliminarTerapia: async function (IdCita) {

        let formData = new FormData()

        formData.append("IdCita", IdCita);

        //oTable_DetalleOrdenCitaTerapia.fnClearTable()

        let response = await HttpClient.Post(`/Citas/CitasEliminarTerapia`, formData)

        if (isEmpty(response)) {
            return false
        }

        return response
    },

    CitasTerapiasBloqueadasAgregar: async function () {

        let objrowCita = oTable_cupos.api(true).row('.selected').data()
        let objrowMedico = oTable_medicosProgramados.api(true).row('.selected').data()

        let formData = new FormData();
        formData.append("horaBloqueo", getCurrentHour())
        formData.append("fechaBloqueo", getCurrentDate())
        formData.append("idMedico", objrowMedico.idMedico)
        formData.append("horaInicio", objrowCita.turnoHoraInicio.substr(0, 5))
        formData.append("horaFin", objrowCita.turnoHoraFin.substr(0, 5))
        formData.append("fecha", CitasTerapia.FechaSeleccionada)

        //oTable_DetalleOrdenCitaTerapia.fnClearTable()

        let response = await HttpClient.Post(`/Citas/CitasTerapiasBloqueadasAgregar`, formData)

        if (isEmpty(response)) {
            return false
        }

        objrowCita.idCitaBloquear = response.data

        return response
        console.log('response', response)

        //let data = response.data.table

        //if (data.length <= 0) {
        //    return false
        //}

        //oTable_DetalleOrdenCitaTerapia.fnAddData(data)
    },

    CitasTerapiasBloqueadasEliminar: async function () {

        let objrowCita = oTable_cupos.api(true).row('.selected').data()

        response = null

        if (!isEmpty(objrowCita)) {
            let formData = new FormData();
            formData.append("IdCitaBloqueada", objrowCita.idCitaBloquear)


            response = await HttpClient.Post(`/Citas/CitasTerapiasBloqueadasEliminar`, formData)

            if (isEmpty(response)) {
                return false
            }
        }

        return response

    },

    CitasTerapiasBloqueadasSeleccionarPorMedicoYFecha: async function (IdMedico, Fecha) {

        let formData = new FormData()

        formData.append('IdMedico', IdMedico)
        formData.append('Fecha', Fecha)

        let response = await HttpClient.Post(`/Citas/CitasTerapiasBloqueadasSeleccionarPorMedicoYFecha`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        return data


    },

    MostrarProgramacionPorFecha: async function () {
        let mes = CitasTerapia.FechaSeleccionada.substr(4, 1)
        let anio = CitasTerapia.FechaSeleccionada.substr(6, 4)

        await this.ListarProgramacionMedicaPorIdMedicoMesAnio(CitasTerapia.IdMedico, mes, anio, CitasTerapia.IdServicio)
        await this.ActualizarListaCupos(CitasTerapia.IdProgramacion)
        
    },

    SeleccionarOpcionMenuContextual: async function (option) {

        let idAccion = option.idAccion
        let title = `<i class="${option.icon} mr-1"></i> ${option.label}`

        switch (idAccion) {
            case 1:
                await this.AbrirModalCita(title)
                break;
            case 2:
                await this.AbrirModalReprogramacion()
                break;
            case 3:
                await this.AbrirAtencionInterconsulta()
                break;
            case 4:
                await this.ImprimeTicketCitaTerapia()
                break;
            case 10:
                await this.EliminarCitaTerapia()
                break;
        }
        console.log('option', option)
    },

    AbrirModalCita: async function (title) {
        let objRow = oTable_cupos.api(true).row('.selected').data()
        let objrowMed = oTable_medicosProgramados.api(true).row('.selected').data()

        objrowMed.IdPaciente = 0
        //

        $('#txtNroSerie').val('')
        $('#txtNroOrdenBoleta').val('')
        $('#txtNroCuenta').val('')
        $('#txtNroOrden').val('')
        $('#txtNombrePaciente').val('')
        $('#txtFechaCita').val('')
        $('#txtHoraCita').val('')

        $('input[name="rdbTipoFiltro"][value="1"]').prop('checked', true)
        $('#txtNroSerie').prop('disabled', true)

        

        let FechaSeleccionada = new Date(CitasTerapia.FechaSeleccionada.split('/')[1] + '-' + CitasTerapia.FechaSeleccionada.split('/')[0] + '-' + CitasTerapia.FechaSeleccionada.split('/')[2])
        let FechaActual = new Date()

        FechaSeleccionada.setHours(0, 0, 0, 0);
        FechaActual.setHours(0, 0, 0, 0);
        FechaActual.setHours(0, 0, 0, 0);

        oTable_DetalleOrdenCitaTerapia.fnClearTable()

        let citasBloqueadas = await this.CitasTerapiasBloqueadasSeleccionarPorMedicoYFecha(CitasTerapia.IdMedico, CitasTerapia.FechaSeleccionada)

        let existeCita = null

        if (citasBloqueadas) {
            existeCita = citasBloqueadas.filter(obj => obj.horaInicio == objRow.turnoHoraInicio)
        }

        if (FechaSeleccionada < FechaActual) {
            alerta2("info", "", "No se puede registrar citas para fechas anteriores.");
            return
        }


        if (CitasTerapia.EsCitaAdicional == 0) {

            if (objRow.idEstadoCita == 6) {
                alerta2("info", "", "Este cupo se encuentra bloqueado por otro usuario.");
                await CitasTerapia.ActualizarListaCupos(CitasTerapia.IdProgramacion)
                return
            }

            if (objRow.idEstadoCita != 0) {
                alerta2("info", "", "Este cupo ya tiene una cita registrada, selecione otro por favor.");
                return
            }


            if (!isEmpty(existeCita) && existeCita.length > 0) {
                alerta2("info", "", "Este cupo se encuentra bloqueado por otro usuario.");
                await CitasTerapia.ActualizarListaCupos(CitasTerapia.IdProgramacion)
                return
            }

            await this.CitasTerapiasBloqueadasAgregar()

        } else {

            var nuevaHora = agregarMinutosAHora(objrowMed.horaFin.substr(0, 5), parseInt(objrowMed.tiempoPromedioAtencion.toString().padStart(2, '0')));

            let horaFin = nuevaHora

            $('#txtHoraCita').val(objrowMed.horaFin.substr(0, 5))
            $('#txtHoraFinCita').val(horaFin)
        }



        

        $('#txtFechaCita').val(CitasTerapia.FechaSeleccionada)
        if (CitasTerapia.EsCitaAdicional == 0) {
            $('#txtHoraCita').val(objRow.turnoHoraInicio)
        }
       

        $('#title-modal-cita-terapia').html(title)
        $('#modalCita').modal('show')

    },

    AbrirModalReprogramacion: async function () {
        let objRow = oTable_cupos.api(true).row('.selected').data()
        let objMedicosProgramados = oTable_medicosProgramados.api(true).row('.selected').data()

        $('#txtFechaNuevaReemplazaReprogMed').val('')
        $('#cboMedicoNuevoReemplazaReprogMed').empty()
        $('#cboHoraNuevaReprogMed').empty()
        $('#txtHoraFinActualReprogMed').val('')


        CitasTerapia.IdCita = objRow.idCita

        if (objRow.idEstadoCita == 0) {
            alerta(2, 'No existe una cita registrada en este cupo, selecione otro por favor.')
            return
        }

        if (objRow.idEstadoCita == 2) {
            alerta(2, 'La cita ya fue atendida no se puede modificar')
            return
        }

        if (objRow.idEstadoCita == 4) {
            alerta(2, 'La cita se encuentra en estado pagado no se puede modificar')
            return
        }


        $('#txtNroCuentaReprogMed').val(objRow.idCuentaAtencion)
        $('#txtNroHistoriaReprogMed').val(objRow.nroHistoria)
        $('#txtFechaAtencionReprogMed').val(CitasTerapia.FechaSeleccionada)
        $('#txtPacienteReprogMed').val(objRow.pacienteNombre)
        $('#txtServicioReprogMed').val(objMedicosProgramados.dservicio)
        $('#txtMedicoReprogMed').val(objMedicosProgramados.nombre)
        $('#txtPlanReprogMed').val(`IAFA Act.: ${objRow.fuenteFinanciamiento}`)


        $('#modalReprogramacionMedica').modal('show')

        $('.chzn-select').chosen().trigger("chosen:updated");


    },
    AbrirAtencionInterconsulta: async function () {

        let objCupo = oTable_cupos.api(true).row('.selected').data()

        let cita = await this.ListaCitaTerapiaByIdCita(objCupo.idCita)

        await InterconsultasHO.CargarDatosInterconsulta(cita)

        //$('#title-modal-cita-terapia').html(title)
        $('#modalInterconsultasHo').modal('show')

    },
    ImprimeTicketCitaTerapia: async function () {
        let objCupo = oTable_cupos.api(true).row('.selected').data()

        var url = "/Citas/ImprimeTicketCitaTerapia?area=ConsultaExterna&idCita=" + objCupo.idCita + "&nroCupo=" + objCupo.id
        //$('#ifrmTicketCita').attr('src', url)
        newIframe.src = url;
    },

    EliminarCitaTerapia: async function () {
        let objRowCita = oTable_cupos.api(true).row('.selected').data()

        if (isEmpty(objRowCita)) {
            alerta(2, 'Debe seleccionar un cupo')
            return
        }

        if (objRowCita.idEstadoCita == 0) {
            alerta(2, 'No existe una cita registrada en este horario')
            return
        }

        if (objRowCita.idEstadoCita == 2) {
            alerta(2, 'La cita ya fue atendida no se puede eliminar')
            return
        }

        if (objRowCita.idEstadoCita == 4) {
            alerta(2, 'La cita se encuentra en estado pagado no se puede eliminar')
            return
        }

        swal({
            title: 'Atención',
            text: "¿Esta seguro?",
            type: 'question',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#6c6c6c',
            confirmButtonText: 'Si, estoy seguro',
            cancelButtonText: 'No',
        }).then(async function () {
            let res = await CitasTerapia.CitasEliminarTerapia(objRowCita.idCita)

            if (res.estado) {
                alerta2('info', 'Atención', 'La cita fue Eliminada.')

                CitasTerapia.ActualizarListaCupos(CitasTerapia.IdProgramacion)
                $('#modalReprogramacionMedica').modal('hide')
            }
        }, function (dimiss) {

        });
    },


    CargarDatosOrden: async function (data, TipoFiltro) {

        this.IdPaciente = data.idPaciente
        this.IdAtencion = data.idAtencion
        //this. = ''

        $('#txtNroCuenta').val(data.idCuentaAtencion)
        $('#txtNroOrden').val(data.idOrden)
        $('#txtNombrePaciente').val(data.paciente)

        if (TipoFiltro == 1 || TipoFiltro == 2) {
            let detalleOrden = await CitasTerapia.FacturacionServicioDespachoDetalleFiltraPorIdOrden(data.idOrden)
        }

        if (TipoFiltro == 3) {
            let listaRecetasInterconsulta = await this.ListaRecetasInterconsulta(data.idOrden, $('#cboEspecialidadCita').val())
        }
        
    },

    Events: function () {

        // INPUTTEXT
        $('#txtFechaNuevaReemplazaReprogMed').on('changeDate', async function (e) {
            Cargando(1)

            $('#cboMedicoNuevoReemplazaReprogMed').empty()
            $('#cboHoraNuevaReprogMed').empty()

            if (esFormatoFecha($('#txtFechaNuevaReemplazaReprogMed').val())) {
                let medicos = await CitasTerapia.ListarMedicosFiltrarPorProgramacion($('#txtFechaNuevaReemplazaReprogMed').val())

                if (!isEmpty(medicos)) {
                    $(medicos).each(function (i, obj) {
                        $('#cboMedicoNuevoReemplazaReprogMed').append(`<option value="${obj.idMedico}" idProgramacion="${obj.idProgramacion}" idServicio="${obj.idServicio}" idEspecialidad="${obj.idEspecialidad}">${obj.nombre}</option>`);
                    });
                    $('#cboMedicoNuevoReemplazaReprogMed').val("");
                }
            }


            $('.chzn-select').chosen().trigger("chosen:updated");

            Cargando(0)
        });

        // INPUTSELECT

        $('#cboMedicoNuevoReemplazaReprogMed').on('change', async function () {
            let cupos = await CitasTerapia.ListaCuposCitasTerapia($('#cboMedicoNuevoReemplazaReprogMed>option:selected').attr('idProgramacion'))

            $('#cboHoraNuevaReprogMed').empty()

            if (!isEmpty(cupos)) {
                $(cupos).each(function (i, obj) {
                    if (obj.idEstadoCita == 0) {
                        $('#cboHoraNuevaReprogMed').append(`<option value="${obj.turnoHoraInicio}" turnoHoraFin="${obj.turnoHoraFin}">${obj.turnoHoraInicio}</option>`);
                    }
                    $('#cboHoraNuevaReprogMed').val("");
                });
            }
            $('.chzn-select').chosen().trigger("chosen:updated");
        })

        $('#cboHoraNuevaReprogMed').on('change', async function () {
            $('#txtHoraFinActualReprogMed').val($('#cboHoraNuevaReprogMed>option:selected').attr('turnoHoraFin').substr(0, 5))
        })

        $('#cboDepartamentosHospital').on('change', async function () {
            Cargando(1)

            await CitasTerapia.ActualizarListaMedicosProgramados()
            //await CitasTerapia.ActualizarListaProgramacion()
            //await CitasTerapia.MostrarProgramacionPorFecha()

            //let servicios = await this.ListarMedicosFiltrarPorProgramacion(CitasTerapia.FechaSeleccionada)
            ////await CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            //await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            Cargando(0)

        })


        // BUTTONS
        $('#btnBuscarOrdenesParaCita').on('click', async function () {

            let TipoFiltro = $('input[name="rdbTipoFiltro"]:checked').val()
            let NroSerie = $('#txtNroSerie').val()
            let NroOrdenBoleta = $('#txtNroOrdenBoleta').val()

            oTable_DetalleOrdenCitaTerapia.fnClearTable()

            let datosPaciente = null

            datosPaciente = await CitasTerapia.BuscarOrdenParaCitaTerapia(TipoFiltro, NroSerie, NroOrdenBoleta)

            if (!isEmpty(datosPaciente)) {
                CitasTerapia.CargarDatosOrden(datosPaciente, TipoFiltro)
            }

        })
        $('#btnGuardarCitaTerapia').on('click', async function () {

            let objRowOrden = oTable_DetalleOrdenCitaTerapia.api(true).row('.selected').data()
            //let objRowProgramacion = oTable_medicosProgramados.api(true).row('.selected').data()
            let objRowCita = oTable_cupos.api(true).row('.selected').data()


            if (CitasTerapia.EsCitaAdicional == 0 && isEmpty(objRowCita)) {
                alerta(2, 'Debe seleccionar un cupo')
                return
            }

            if (isEmpty(objRowOrden)) {
                alerta(2, 'Debe seleccionar un procedimiento')
                return
            }

            if (CitasTerapia.EsCitaAdicional == 0) {
                $('#txtHoraCita').val(objRowCita.turnoHoraInicio)
                $('#txtHoraFinCita').val(objRowCita.turnoHoraFin)
            }

            

            let res = await CitasTerapia.CrearModificarCitasTerapia(
                HoraSolicitud = getCurrentHour(),
                FechaSolicitud = getCurrentDate(),
                IdProducto = objRowOrden.idProducto,
                IdProgramacion = CitasTerapia.IdProgramacion,
                IdServicio = CitasTerapia.IdServicio,
                HoraFin = $('#txtHoraFinCita').val(),
                HoraInicio = $('#txtHoraCita').val(),
                Fecha = $('#txtFechaCita').val(),
                IdEstadoCita = 1,
                IdMedico = CitasTerapia.IdMedico,
                IdEspecialidad = CitasTerapia.IdEspecialidad,
                IdAtencion = CitasTerapia.IdAtencion,
                IdPaciente = CitasTerapia.IdPaciente,
                EsCitaAdicional = CitasTerapia.EsCitaAdicional,
                TipoCita = CitasTerapia.TipoCita,
                IdCuenta = objRowOrden.idCuentaAtencion,
                nroOrden = objRowOrden.idOrden,
                IdCitaRegistrada = 0
            )

            if (res.estado) {
                alerta2('success', 'Atención', 'La cita fue agregada.')

                await CitasTerapia.CitasTerapiasBloqueadasEliminar()
                CitasTerapia.ActualizarListaCupos(CitasTerapia.IdProgramacion)
                
                $('#modalCita').modal('hide')
            }

            console.log('res', res)

        })
        $('#btnReprogramar').on('click', async function () {

            let objRowCita = oTable_cupos.api(true).row('.selected').data()


            if (isEmpty(objRowCita)) {
                alerta(2, 'Debe seleccionar un cupo')
                return
            }


            swal({
                title: 'Atención',
                text: "¿Esta seguro?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Si, estoy seguro',
                cancelButtonText: 'No',
            }).then(async function () {
                let res = await CitasTerapia.CrearModificarCitasTerapia(
                    HoraSolicitud = getCurrentHour(),
                    FechaSolicitud = getCurrentDate(),
                    IdProducto = 0,
                    IdProgramacion = $('#cboMedicoNuevoReemplazaReprogMed>option:selected').attr('idProgramacion'),
                    IdServicio = $('#cboMedicoNuevoReemplazaReprogMed>option:selected').attr('idServicio'),
                    HoraFin = $('#txtHoraFinActualReprogMed').val(),
                    HoraInicio = $('#cboHoraNuevaReprogMed').val(),
                    Fecha = $('#txtFechaNuevaReemplazaReprogMed').val(),
                    IdEstadoCita = 1,
                    IdMedico = $('#cboMedicoNuevoReemplazaReprogMed>option:selected').val(),
                    IdEspecialidad = $('#cboMedicoNuevoReemplazaReprogMed>option:selected').attr('idEspecialidad'),
                    IdAtencion = 0,
                    IdPaciente = 0,
                    EsCitaAdicional = '0',
                    TipoCita = 'P',
                    IdCuenta = 0,
                    nroOrden = 0,
                    IdCitaRegistrada = objRowCita.idCita
                )

                if (res.estado) {
                    alerta2('success', 'Atención', 'Se reprogramo paciente citado.')

                    CitasTerapia.ActualizarListaCupos(CitasTerapia.IdProgramacion)

                    $('#modalReprogramacionMedica').modal('hide')
                }
            }, function (dimiss) {

            });



        })
        $('#btnCerrarHerrReprogramacionMedica').on('click', async function () {
            $('#modalReprogramacionMedica').modal('hide')
        })
        $('#btnCerrarModalCitaTerapia').on('click', async function () {
            Cargando(1)
            await CitasTerapia.CitasTerapiasBloqueadasEliminar()

            await CitasTerapia.ActualizarListaCupos(CitasTerapia.IdProgramacion)
            Cargando(0)
        })
        $('#btnCitaAdicional').on('click', async function () {
            Cargando(1)

            CitasTerapia.EsCitaAdicional = 1

            await CitasTerapia.AbrirModalCita('Agregar Cita')

            Cargando(0)
        })

        // RADIO BUTTONS
        $('input[name="rdbTipoFiltro"]').on('change', function () {
            let opcion = $('input[name="rdbTipoFiltro"]:checked').val()

            $('#txtNroSerie').prop('disabled', true)

            CitasTerapia.TipoCita = 'N'

            if (opcion == 1) {
                $('#txtNroSerie').prop('disabled', true)
            } else if (opcion == 2) {
                $('#txtNroSerie').prop('disabled', false)
            } else if (opcion == 3) {
                CitasTerapia.TipoCita = 'I'
            }
        })

        // TABLES
        $('#tblMedicosProgramados tbody').on('click', 'tr', async function (e) {

            Cargando(1)
            oTable_medicosProgramados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrow = oTable_medicosProgramados.api(true).row('.selected').data();

            CitasTerapia.IdMedico = objrow.idMedico
            CitasTerapia.IdServicio = objrow.idServicio
            CitasTerapia.IdEspecialidad = objrow.idEspecialidad
            CitasTerapia.IdProgramacion = objrow.idProgramacion
            //CitasAdmision.CargarDatosGenerales(objrow)

            await CitasTerapia.MostrarProgramacionPorFecha()
            Cargando(0)
        })

        $('#tblCupos tbody').on('click', 'tr', async function () {

            $(oTable_cupos.$('tr.selected').children()[0]).removeClass('day-highlight');
            oTable_cupos.$('tr.selected').removeClass('selected');

            $(this).addClass('selected');
            $($(this).children()[0]).addClass("day-highlight")

        })

        $('#tblDetalleOrdenCitaTerapia').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_DetalleOrdenCitaTerapia.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }

        })

        $('#tblCupos tbody').on('contextmenu', 'tr', function (e) {
            e.preventDefault();

            $(oTable_cupos.$('tr.selected').children()[0]).removeClass('day-highlight');
            oTable_cupos.$('tr.selected').removeClass('selected');

            $(this).addClass('selected');
            $($(this).children()[0]).addClass("day-highlight")

            superCm.createMenu(myMenu, e);

            let objCupo = oTable_cupos.api(true).row('.selected').data()

            if (objCupo.tipoCita != 'I') {
                let parentDiv = $('span.option-text:contains("Interconsulta")').closest('.context-menu-option');

                parentDiv.hide()
            } 
            
            //superCm.createMenu(CitasAdmision.myMenu, e);
        })


    },

    Init: async function () {
        this.Plugins()
        this.ConfigCalendar()

        // Tables
        this.InitDatablesMedicosProgramados()
        this.InitDatablesCupos()
        this.InitDatablesDetalleOrdenCitaTerapia()
        this.InitDatablesCitasTerapiaPorPaciente()

        // Combos
        await this.ListarMedicosPorFiltroConEspecialidad()

        // -----------------------------------------------------------

        await this.CargaDatosIniciales()
        await this.MostrarProgramacionPorFecha()
        await this.Events()
    }


}

$(document).ready(function () {
    CitasTerapia.Init()
})

function agregarMinutosAHora(hora, minutos) {
    var partesHora = hora.split(':');
    var horas = parseInt(partesHora[0]);
    var minutosActuales = parseInt(partesHora[1]);

    var totalMinutos = horas * 60 + minutosActuales + minutos;

    var horaNueva = Math.floor(totalMinutos / 60);
    var minutosNuevos = totalMinutos % 60;

    horaNueva = horaNueva.toString().padStart(2, '0');
    minutosNuevos = minutosNuevos.toString().padStart(2, '0');

    return horaNueva + ':' + minutosNuevos;
}