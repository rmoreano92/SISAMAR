var infoFecha = null;
var ProgramacionMedica = {
    idProgramacionMedica: 0,
    fechaInicioSeleccionada: '',
    fechaFinSeleccionada: '',
    fechasSeleccionadas: [],
    async Iniciar() {
        //$(".chzn-select").addClass("chzn-select-deselect");
        //$(".chzn-select").removeClass("chzn-select");
        //$(".chzn-select-deselect").append("<option value=''></option>")

        ProgramacionMedica.plugins();
        ProgramacionMedica.DataTableMedicos();
        ProgramacionMedica.Eventos();
        await ProgramacionMedica.ListarDepartamentos();
        await ProgramacionMedica.ListarMedicosPorEspecialidad(0);
        await ProgramacionMedica.ListarTiposServicios();
        await ProgramacionMedica.ListarTiposProgramacion();

        //Turnos.ListarRefConTurnosUPS();
        //Camas.TiposCamaSeleccionarTodos();
        //Camas.EstadosCamaSeleccionarTodos();
        //Camas.TiposCondicionOcupacionSeleccionarTodos();

    },

    async plugins() {
        //$(".hide_search").chosen({ disable_search_threshold: 10 });
        //$(".chzn-select").chosen({ allow_single_deselect: true, width: "100%" });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
        //$(".chzn-select-deselect,#select2_sample").chosen();


        //$('#txtFechaIngreso,#txtFechaSalida').datepicker({
        //    todayHighlight: true,
        //    autoclose: true,
        //    orientation: "bottom"
        //});

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

                ProgramacionMedica.fechasSeleccionadas.forEach(function (day) {
                    let fechaCalendar = moment(day, "DD/MM/YYYY").format("YYYY-MM-DD");
                    $("td[data-date='" + fechaCalendar + "'].fc-day").addClass('fc-selected-day');
                });

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
                let mesInicio = parseInt(fechaInicio.split('/')[1]);
                let mesFin = parseInt(fechaFin.split('/')[1]);

                $(".fc-day").removeClass('fc-selected-day');
                //console.log("Fecha Inicio: " + fechaInicio);
                //console.log("Fecha Fin: " + fechaFin);
                // Permitir selección solo si ambos están en el mismo mes
                return (mesInicio == $("#cboMesCalendario").val() && mesFin == $("#cboMesCalendario").val());
            },
            dayClick: async function (date, jsEvent, view) {

                let fecha = date.format('DD/MM/YYYY');
                let celda = $(this);

                // agregar o quitar fecha
                if (ProgramacionMedica.fechasSeleccionadas.includes(fecha)) {

                    ProgramacionMedica.fechasSeleccionadas = ProgramacionMedica.fechasSeleccionadas.filter(f => f !== fecha);
                    celda.removeClass("fc-selected-day");

                } else {

                    ProgramacionMedica.fechasSeleccionadas.push(fecha);
                    celda.addClass("fc-selected-day");

                }

                // ordenar fechas
                if (ProgramacionMedica.fechasSeleccionadas.length > 0) {

                    ProgramacionMedica.fechasSeleccionadas.sort(function (a, b) {
                        return moment(a, "DD/MM/YYYY") - moment(b, "DD/MM/YYYY");
                    });

                    ProgramacionMedica.fechaInicioSeleccionada = ProgramacionMedica.fechasSeleccionadas[0];
                    ProgramacionMedica.fechaFinSeleccionada = ProgramacionMedica.fechasSeleccionadas[ProgramacionMedica.fechasSeleccionadas.length - 1];

                } else {

                    ProgramacionMedica.fechaInicioSeleccionada = '';
                    ProgramacionMedica.fechaFinSeleccionada = '';
                }

                console.log("Fechas seleccionadas:", ProgramacionMedica.fechasSeleccionadas);

                // actualizar campos del modal
                if (ProgramacionMedica.fechasSeleccionadas.length == 1) {

                    $('#txtFechaInicioProgramacion').val(ProgramacionMedica.fechaInicioSeleccionada);
                    $('#txtFechaFinProgramacion').val('');
                    $('#divFechaFinProgramacion').hide();

                }
                else if (ProgramacionMedica.fechasSeleccionadas.length > 1) {

                    $('#txtFechaInicioProgramacion').val(ProgramacionMedica.fechaInicioSeleccionada);
                    $('#txtFechaFinProgramacion').val(ProgramacionMedica.fechaFinSeleccionada);
                    $('#divFechaFinProgramacion').show();

                }
                else {

                    $('#txtFechaInicioProgramacion').val('');
                    $('#txtFechaFinProgramacion').val('');
                    $('#divFechaFinProgramacion').hide();

                }

                // cargar programación mensual
                let idMed = $('#cboMedicoProgramacionFiltro').val();
                let idEsp = $('#cboEspecialidadHospProgramacionFiltro').val();
                let anio = $('#cboAnioCalendario').val();
                let mes = $('#cboMesCalendario').val();

                if (idMed > 0 && anio > 0 && mes > 0) {

                    await ProgramacionMedica.ListarProgramacionMedicaMensual(
                        1,
                        0,
                        idEsp,
                        0,
                        idMed,
                        9,
                        anio,
                        mes
                    );
                }

                // cargar programación por rango (tu lógica existente)
                if (ProgramacionMedica.fechaInicioSeleccionada != '' &&
                    ProgramacionMedica.fechaFinSeleccionada != '') {

                    if (ProgramacionMedica.fechaInicioSeleccionada ==
                        ProgramacionMedica.fechaFinSeleccionada) {

                        await ProgramacionMedica.ListarProgramacionMedica(
                            1,
                            0,
                            idEsp,
                            0,
                            idMed,
                            9,
                            ProgramacionMedica.fechaInicioSeleccionada,
                            ProgramacionMedica.fechaFinSeleccionada
                        );
                    }
                }

                ProgramacionMedica.fechasSeleccionadas.forEach(function (day) {
                    let fechaCalendar = moment(day, "DD/MM/YYYY").format("YYYY-MM-DD");
                    $("td[data-date='" + fechaCalendar + "'].fc-day").addClass('fc-selected-day');
                });
            },
            select: async function (start, end) {
                // Formatear las fechas seleccionadas
                let fechaInicio = moment(start).format('DD/MM/YYYY');
                let fechaFin = moment(end).subtract(1, 'days').format('DD/MM/YYYY'); // Rango hasta el día anterior
                                
                let mesSeleccionado = parseInt(fechaInicio.split('/')[1]);
                //console.log(mesSeleccionado)
                
                let idMed = $('#cboMedicoProgramacionFiltro').val();
                let idEsp = $('#cboEspecialidadHospProgramacionFiltro').val();
                let anio = $('#cboAnioCalendario').val();
                let mes = $('#cboMesCalendario').val();
                
                if(fechaInicio == fechaFin) return;

                ProgramacionMedica.fechasSeleccionadas = [];
                oTable_ProgramacionMedica.fnClearTable();
                if (mesSeleccionado == mes) {
                    if (idMed > 0 && anio > 0 && mes > 0) {
                        await ProgramacionMedica.ListarProgramacionMedicaMensual(1, 0, idEsp, 0, idMed, 9, anio, mes);
                    }

                    //let fechaF = fecha.substr(8, 2) + '/' + fecha.substr(5, 2) + '/' + fecha.substr(0, 4);
                    if (esFormatoFecha(fechaInicio) && esFormatoFecha(fechaFin)) {
                        if (fechaInicio == fechaFin) {
                            await ProgramacionMedica.ListarProgramacionMedica(1, 0, idEsp, 0, idMed, 9, fechaInicio, fechaFin);
                        }

                    }

                    ProgramacionMedica.fechaInicioSeleccionada = fechaInicio;
                    ProgramacionMedica.fechaFinSeleccionada = fechaFin;
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

                // Agregar los nuevos días
                rangoDias.forEach(function (d) {
                    if (!diasSeleccionados.includes(d)) {
                        diasSeleccionados.push(d);
                    }
                });
                
                console.log(diasSeleccionados);
                if(diasSeleccionados.length > 0){
                    diasSeleccionados.forEach(function (day) {
                        ProgramacionMedica.fechasSeleccionadas.push(moment(day, "YYYY-MM-DD").format("DD/MM/YYYY"));
                        $("td[data-date='" + day + "'].fc-day").addClass('fc-selected-day');
                    });
                }               

                /*ProgramacionMedica.fechasSeleccionadas.forEach(function (day) {
                    let fechaCalendar = moment(day, "DD/MM/YYYY").format("YYYY-MM-DD");
                    $("td[data-date='" + fechaCalendar + "'].fc-day").addClass('fc-selected-day');
                });*/

                //alert(`Seleccionaste desde ${fechaInicio} hasta ${fechaFin}`);
            }
        }

        $('#calendar').fullCalendar(opts);

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },


    //////////////////////////////////INICIALIZA DATATABLE////////////////////////////////////////////////////////////////////
    DataTableMedicos() {
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
                    width: '10%',
                    targets: 0,
                    data: "idProgramacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '20%',
                    targets: 0,
                    data: "servicio",
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
                    width: '15%',
                    targets: 0,
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    data: "horaFin",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    data: "tiempoPromedioAtencion",
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
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////EVENTOS DE INTERACCION INTERFAZ - USUARIO///////////////////////////////////////////////////////////
    Eventos() {
        $('#cboDepartamentoHospProgramacionFiltro').on('change', async function () {
            let idDepartamento = $('#cboDepartamentoHospProgramacionFiltro').val();
            if (idDepartamento > 0) {
                await ProgramacionMedica.ListarEspecialidadPorDepartamento(idDepartamento);
            }
        });

        $('#cboEspecialidadHospProgramacionFiltro').on('change', async function () {
            let idEspecialidad = $('#cboEspecialidadHospProgramacionFiltro').val();
            if (idEspecialidad > 0) {
                await ProgramacionMedica.ListarMedicosPorEspecialidad(idEspecialidad);
            }
        });

        $('#cboMedicoProgramacionFiltro').on('change', async function () {
            let idEsp = $('#cboEspecialidadHospProgramacionFiltro').val();
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();
            if (idMed > 0 && anio > 0 && mes > 0) {
                await ProgramacionMedica.ListarProgramacionMedicaMensual(1, 0, idEsp, 0, idMed, 9, anio, mes);
            }
        });

        $('#cboAnioCalendario').on('change', async function () {
            let idEsp = $('#cboEspecialidadHospProgramacionFiltro').val();
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();

            $('#calendar').fullCalendar('gotoDate', new Date($('#cboAnioCalendario>option:selected').val(), $('#cboMesCalendario>option:selected').val() - 1));
            if (idMed > 0 && anio > 0 && mes > 0) {
                await ProgramacionMedica.ListarProgramacionMedicaMensual(1, 0, idEsp, 0, idMed, 9, anio, mes);
            }
        });

        $('#cboMesCalendario').on('change', async function () {
            let idEsp = $('#cboEspecialidadHospProgramacionFiltro').val();
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();

            $('#calendar').fullCalendar('gotoDate', new Date($('#cboAnioCalendario>option:selected').val(), $('#cboMesCalendario>option:selected').val() - 1));

            if (idMed > 0 && anio > 0 && mes > 0) {
                await ProgramacionMedica.ListarProgramacionMedicaMensual(1, 0, idEsp, 0, idMed, 9, anio, mes);
            }
        });

        $('#tblProgramacionMedica tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ProgramacionMedica.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#cboTipoServicioProgramacion').on('change', async function () {
            let idTipoServ = $('#cboTipoServicioProgramacion').val();
            let idMed = $('#txtIdMedicoProgramacion').val();
            if (idMed > 0) {
                await ProgramacionMedica.ListarEspecialidadPorMedico(idMed);
                await ProgramacionMedica.ListarTurnosPorTipoServicio(idTipoServ);
            }
        });

        $('#cboEspecialidadProgramacion').on('change', async function () {
            let idTipoServ = $('#cboTipoServicioProgramacion').val();
            let idEsp = $('#cboEspecialidadProgramacion').val();
            if (idTipoServ > 0 && idEsp > 0) {
                await ProgramacionMedica.ListarServiciosPorEspecialidad(idTipoServ, 0, idEsp, 0);
            }
        });

        $('#cboTurnoProgramacion').on('change', async function () {
            let horaInicio = $('#cboTurnoProgramacion option:selected').attr('data-horaInicio');
            let horaFin = $('#cboTurnoProgramacion option:selected').attr('data-horaFin');
            if (isEmpty(horaInicio) == false && isEmpty(horaFin) == false) {
                $('#txtHoraInicoProgramacion').val(horaInicio);
                $('#txtHoraFinProgramacion').val(horaFin);
            }
        });


        $('#btnAgregarProgramacion').on('click', async function () {

            //ProgramacionMedica.idProgramacionMedica = 0;
            ProgramacionMedica.DesbloquearCampos();
            //ProgramacionMedica.LimpiarRegistroProgramacion();

            let fechaHoy = await Utilitario.FechaHoraServidor();
            let fi = moment(ConvertirFormatoFecha(ProgramacionMedica.fechaInicioSeleccionada), "YYYY-MM-DD").toDate();
            let ff = moment(ConvertirFormatoFecha(ProgramacionMedica.fechaFinSeleccionada), "YYYY-MM-DD").toDate();
            let fh = moment(ConvertirFormatoFecha(ConvertirFormatoFecha(fechaHoy.substring(0, 10))), "YYYY-MM-DD").toDate();

            if (fi < fh || ff < fh) {
                alerta2("info", "", "No puede programar fechas anteriores al día de hoy.");
                return;
            }

            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let idDep = $('#cboDepartamentoHospProgramacionFiltro').val();
            let med = $('#cboMedicoProgramacionFiltro option:selected').text();

            if (isEmpty(idMed)) {
                alerta2("info", "", "Por favor seleccione un médico.");
                return;
            }

            if (isEmpty(ProgramacionMedica.fechaInicioSeleccionada) || isEmpty(ProgramacionMedica.fechaFinSeleccionada)) {
                alerta2("info", "", "Por favor seleccione la(s) fecha(s) a programar.");
                return;
            }


            $('#cboTipoServicioProgramacion').val(1);
            $('#txtIdMedicoProgramacion').val(idMed);
            $('#txtMedicoProgramacion').val(med);
            $("#txtFechaInicioProgramacion").datepicker("setDate", ProgramacionMedica.fechaInicioSeleccionada);
            $("#txtFechaFinProgramacion").datepicker("setDate", ProgramacionMedica.fechaFinSeleccionada);

            if (ProgramacionMedica.fechaInicioSeleccionada == ProgramacionMedica.fechaFinSeleccionada) {
                $("#divFechaFinProgramacion").hide();
            } else {
                $("#divFechaFinProgramacion").show();
            }

            //await ProgramacionMedica.ListarEspecialidadPorMedico(idMed);
            await ProgramacionMedica.ListarEspecialidadPorMedicoYDepartamento(idMed,idDep);
            await ProgramacionMedica.ListarTurnosPorTipoServicio(1);

            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            $("#modalRegistroProgramacion").modal("show");

        });

        $('#btnModificarProgramacion').on('click', async function () {
            let objrowTb = oTable_ProgramacionMedica.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            await ProgramacionMedica.CargarDatosProgramacionMedica(objrowTb);
            ProgramacionMedica.DesbloquearCampos();

            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            $("#modalRegistroProgramacion").modal("show");
        });

        $('#btnConsultarProgramacion').on('click', async function () {
            var objrowTb = oTable_ProgramacionMedica.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Seleccione un registro.");
                return false;
            }

            await ProgramacionMedica.CargarDatosProgramacionMedica(objrowTb);
            ProgramacionMedica.BloquearCampos();

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
                html: 'Esta seguro que desea eliminar la programación <br> <span style="font-weight: 600;">' + objrowTb.servicio + ' (' + objrowTb.medico + ')' + ' (' + objrowTb.fecha + ')' + '</span>',
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#EF6F6C',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then(async function (result) {

                if (result?.value || result?.isConfirmed) { // depende de la versión
                    await ProgramacionMedica.EliminarProgramacionMedica(objrowTb.idProgramacion);
                }

            }).catch(swal.noop);
            //$("#modalRegistroCama").modal("show");
        });

        $('#btnGuardarProgramacion').on('click', async function () {
            if (ProgramacionMedica.ValidarDatosObligatorios()) {
                await ProgramacionMedica.GuardarProgramacionMedica();
            }
        });

        $('#btnCerrarProgramacion').on('click', async function () {
            ProgramacionMedica.LimpiarRegistroProgramacion();
            //await ProgramacionMedica.ListarProgramacionMedica();
            $("#modalRegistroProgramacion").modal("hide");
        });

    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////METODOS QUE CONSULTA BD////////////////////////////////////////////////////////////////////////
    async ListarDepartamentos() {
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
                    $('#cboDepartamentoHospProgramacionFiltro').val('');
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

    async ListarEspecialidadPorDepartamento(idDepartamento) {
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

    async ListarServicios(idTipoServicio, idDepartamento, idEspecialidad, idServicio) {
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

    async ListarMedicosPorEspecialidad(idEspecialidad) {
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

    async ListarProgramacionMedicaMensual(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idMedico, activaProcedimiento, anio, mes) {
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
                    url: "/ProgramacionMedica/ListarProgramacionMedicaMensual?area=ProgramacionGeneral",
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

    async ListarProgramacionMedica(idTipoServicio, idDepartamento, idEspecialidad, idServicio, idMedico, activaProcedimiento, fechaInicio, fechaFin) {
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
                    url: "/ProgramacionMedica/ListarProgramacionMedicaPorRango?area=ProgramacionGeneral",
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

    async ListarTiposServicios() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        //data.append('idTipoServicio', idTipoServicio);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboTipoServicioProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarTiposServiciosHosp?area=Comun",
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
                        $('#cboTipoServicioProgramacion').append('<option value="' + obj.idTipoServicio + '">' + obj.descripcion + '</option>');
                    });
                    $('#cboTipoServicioProgramacion').val('');
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

    async ListarEspecialidadPorMedico(idMedico) {
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

    async ListarEspecialidadPorMedicoYDepartamento(idMedico,idDepartamento) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idMedico', idMedico);
        data.append('idDepartamento', idDepartamento);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboEspecialidadProgramacion').empty();
            $('#cboConsultorioProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Especialidades/EspecialidadesSeleccionarPorMedicoYDepartamento?area=General",
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

    async ListarServiciosPorEspecialidad(idTipoServicio, idDepartamento, idEspecialidad, idServicio) {
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
            $('#cboConsultorioProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Servicios/ListarServicios?area=General",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.lsResultado.table.length > 0) {
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $('#cboConsultorioProgramacion').append('<option value="' + obj.idServicio + '">' + obj.nombre + '</option>');
                    });
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

    async ListarTiposProgramacion() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        //data.append('idTipoServicio', idTipoServicio);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboTipoProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ProgramacionMedica/ListarTiposProgramacion?area=ProgramacionGeneral",
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
                        $('#cboTipoProgramacion').append('<option value="' + obj.idTipoProgramacion + '">' + obj.descripcion + '</option>');
                    });
                    $('#cboTipoProgramacion').val('');
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

    async ListarTurnosPorTipoServicio(idTipoServicio) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idTipoServicio', idTipoServicio);

        Cargando(1)
        try {
            //oTable_MedicosFiltro.fnClearTable();
            $('#cboTurnoProgramacion').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Turnos/TurnosSeleccionarPorTipoServicio?area=ProgramacionGeneral",
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
                        $('#cboTurnoProgramacion').append('<option data-horaInicio="' + obj.horaInicio + '" data-horaFin="' + obj.horaFin + '" value="' + obj.idTurno + '">' + obj.descripcion + '</option>');
                    });
                    $('#cboTurnoProgramacion').val('');
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

    async ProgramacionMedicaSeleccionar(idProgramacion) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idProgramacion', idProgramacion);

        Cargando(1)
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ProgramacionMedica/ProgramacionMedicaSeleccionar?area=ProgramacionGeneral",
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
                    respuesta = datos.lsResultado.table[0];
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

        return respuesta;
    },

    async GuardarProgramacionMedica() {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdProgramacion', ProgramacionMedica.idProgramacionMedica);
        data.append('IdTipoServicio', $("#cboTipoServicioProgramacion").val());
        data.append('IdEspecialidad', $("#cboEspecialidadProgramacion").val());
        data.append('IdServicio', $("#cboConsultorioProgramacion").val());
        data.append('IdMedico', $("#txtIdMedicoProgramacion").val());
        data.append('FechaInicio', ProgramacionMedica?.fechasSeleccionadas?.join(','));
        //data.append('FechaInicio', $("#txtFechaInicioProgramacion").val());
        //data.append('FechaFinal', $("#txtFechaFinProgramacion").val());
        data.append('IdTipoProgramacion', $("#cboTipoProgramacion").val());
        data.append('IdTurno', $("#cboTurnoProgramacion").val());
        data.append('HoraInicio', $("#txtHoraInicoProgramacion").val());
        data.append('HoraFinal', $("#txtHoraFinProgramacion").val());
        data.append('Descripcion', $("#txtDescripcion").val());
        //data.append('Color', $("#txtColorProgramacion").val());
        data.append('Color', null);

        Cargando(1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ProgramacionMedica/ProgramacionMedicaModificar?area=ProgramacionGeneral",
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
                    datos = datos.lsResultado.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        return false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        return false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        ProgramacionMedica.LimpiarRegistroProgramacion();
                        let idMed = $('#cboMedicoProgramacionFiltro').val();
                        let anio = $('#cboAnioCalendario').val();
                        let mes = $('#cboMesCalendario').val();
                        if (idMed > 0 && anio > 0 && mes > 0) {
                            await ProgramacionMedica.ListarProgramacionMedicaMensual(1, 0, 0, 0, idMed, 9, anio, mes);
                        }
                        $("#modalRegistroProgramacion").modal("hide");
                        return true;
                    }
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

        return respuesta;
    },


    async EliminarProgramacionMedica(idProgramacion) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('IdProgramacion', idProgramacion);

        Cargando(1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ProgramacionMedica/ProgramacionMedicaEliminar?area=ProgramacionGeneral",
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
                    datos = datos.lsResultado.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        return false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        return false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage);
                        ProgramacionMedica.LimpiarRegistroProgramacion();
                        let idMed = $('#cboMedicoProgramacionFiltro').val();
                        let anio = $('#cboAnioCalendario').val();
                        let mes = $('#cboMesCalendario').val();
                        if (idMed > 0 && anio > 0 && mes > 0) {
                            await ProgramacionMedica.ListarProgramacionMedicaMensual(1, 0, 0, 0, idMed, 9, anio, mes);
                        }
                        //$("#modalRegistroProgramacion").modal("hide");
                        return true;
                    }
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

        return respuesta;
    },


    ///////////////////////////METODOS Y FUNCIONES////////////////////////////////////////
    async CargarDatosProgramacionMedica(obj) {
        const objProg = await ProgramacionMedica.ProgramacionMedicaSeleccionar(obj.idProgramacion);

        ProgramacionMedica.idProgramacionMedica = objProg.idProgramacion;

        $("#cboTipoServicioProgramacion").val(objProg.idTipoServicio);
        await ProgramacionMedica.ListarTurnosPorTipoServicio(objProg.idTipoServicio);
        $("#txtIdMedicoProgramacion").val(objProg.idMedico);
        $("#txtMedicoProgramacion").val(objProg.medico);
        //await ProgramacionMedica.ListarEspecialidadPorMedico(objProg.idMedico);
        await ProgramacionMedica.ListarEspecialidadPorMedico(objProg.idMedico);
        $("#cboEspecialidadProgramacion").val(objProg.idEspecialidad);
        await ProgramacionMedica.ListarServiciosPorEspecialidad(objProg.idTipoServicio, 0, objProg.idEspecialidad, 0);
        $("#cboConsultorioProgramacion").val(objProg.idServicio);
        $("#txtFechaInicioProgramacion").datepicker("setDate", objProg.fechaP);
        $("#txtFechaFinProgramacion").datepicker("setDate", objProg.fechaP);
        $("#divFechaFinProgramacion").hide();
        $("#cboTipoProgramacion").val(objProg.idTipoProgramacion);
        $("#cboTurnoProgramacion").val(objProg.idTurno);
        $("#txtHoraInicoProgramacion").val(objProg.horaInicio);
        $("#txtHoraFinProgramacion").val(objProg.horaFin);
        $("#txtDescripcionProgramacion").val(objProg.descripcion);
        $("#txtColorProgramacion").val(objProg.color);





        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    ValidarDatosObligatorios() {
        if (isEmpty($("#cboTipoServicioProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Tipo Servicio.');
            return false;
        }

        if (isEmpty($("#txtIdMedicoProgramacion").val()) && isEmpty($("#txtMedicoProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Médico.');
            return false;
        }

        if (isEmpty($("#cboEspecialidadProgramacion").val())) {
            alerta2('info', '', 'Seleccione la Especialidad.');
            return false;
        }

        if (isEmpty($("#cboConsultorioProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Consultorio.');
            return false;
        }

        if (isEmpty($("#txtFechaInicioProgramacion").val())) {
            alerta2('info', '', 'Ingrese la Fecha.');
            return false;
        }

        if (isEmpty($("#cboTipoProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Tipo de Programación.');
            return false;
        }

        if (isEmpty($("#cboTurnoProgramacion").val())) {
            alerta2('info', '', 'Seleccione el Turno.');
            return false;
        }

        if (isEmpty($("#txtHoraInicoProgramacion").val())) {
            alerta2('info', '', 'Ingrese la Hora Inicio.');
            return false;
        }

        if (isEmpty($("#txtHoraFinProgramacion").val())) {
            alerta2('info', '', 'Ingrese la Hora Final.');
            return false;
        }

        let hi = $('#txtHoraInicoProgramacion').val();
        let hf = $('#txtHoraFinProgramacion').val();
        if (hi >= hf) {
            alerta2("info", "", "La hora de final no puede ser igual o menor que la hora de inicio.");
            return;
        }


        return true;
    },

    LimpiarRegistroProgramacion() {
        ProgramacionMedica.fechasSeleccionadas = [];
        ProgramacionMedica.idProgramacionMedica = 0;
        ProgramacionMedica.fechaInicioSeleccionada = '';
        ProgramacionMedica.fechaFinSeleccionada = '';
        $(".campo").val('');
        $(".fc-day").removeClass('fc-selected-day');
        oTable_ProgramacionMedica.fnClearTable();
        //oTable_Turnos.fnClearTable();
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

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

$(document).ready(function () {
    ProgramacionMedica.Iniciar();
});