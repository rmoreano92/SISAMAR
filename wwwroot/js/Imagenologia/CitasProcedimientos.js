window.onbeforeunload = async function (e) { // -M
    await CitasProcedimientos.LimpiarCitaProcedimientoBloqueado();
    //console.log("XXXXXXXX")
};


var myMenu = [
    {
        icon: 'fa fa-calendar-plus',
        label: 'Agregar Cita',
        idAccion: 1,
        action: function (option, contextMenuIndex, optionIndex) {
            CitasProcedimientos.SeleccionarOpcionMenuContextual(option)
        },
        submenu: null,
        disabled: $("#optAgregar").length == 0 ? true : false 
    },    
    {
        icon: 'fa fa-calendar-heart',
        label: 'Consultar Cita',
        idAccion: 3,
        action: function (option, contextMenuIndex, optionIndex) {
            CitasProcedimientos.SeleccionarOpcionMenuContextual(option)
        },
        submenu: null,
        disabled: $("#optConsultar").length == 0 ? true : false
    },  
    {
        icon: 'fa fa-trash-o',
        label: 'Eliminar Cita',
        idAccion: 4,
        action: function (option, contextMenuIndex, optionIndex) {
            CitasProcedimientos.SeleccionarOpcionMenuContextual(option)
        },
        submenu: null,
        disabled: $("#optEliminar").length == 0 ? true : false
    },
    {
        icon: 'fa fa-calendar-pen',
        label: 'Reprogramar Cita',
        idAccion: 5,
        action: function (option, contextMenuIndex, optionIndex) {
            CitasProcedimientos.SeleccionarOpcionMenuContextual(option)
        },
        submenu: null,
        disabled: $("#optModificar").length == 0 ? true : false
    },
    {
        icon: 'fa fa-print',
        label: 'Imprimir ticket',
        idAccion: 10,
        action: function (option, contextMenuIndex, optionIndex) {
            CitasProcedimientos.SeleccionarOpcionMenuContextual(option)
        },
        submenu: null,
        disabled: $("#optConsultar").length == 0 ? true : false
    },

];

let CitasProcedimientos = {
    idProgramacionMedicaSeleccionada: 0,
    fechaInicioSeleccionada: '',
    fechaFinSeleccionada: '',
    horaInicioSeleccionada: '',
    horaFinSeleccionada: '',
    idMovimiento: 0,
    idOrden: 0,
    idCuentaAtencion: 0,
    idPaciente: 0,
    idCita: 0,
    idTipoServicio: 0,
    idEspecialidad: 0,

    async Iniciar() {
        await CitasProcedimientos.Plugins();
        CitasProcedimientos.InitDataTablesProgramacionMedica();
        CitasProcedimientos.InitDataTablesCupos();
        CitasProcedimientos.InitDataTablesDetalleOrdenCitaProcedimiento();
        CitasProcedimientos.InitDataTablesPacientesCitados();
        CitasProcedimientos.InitDataTablesCitasProcedimientos();
        CitasProcedimientos.Eventos();

        await CitasProcedimientos.ListarMedicosPorEspecialidad(0);
        //await CitasProcedimientos.ListarServicios(1,0,0,0,0);
    },

    async Plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, width: "100%" });
        //$(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaNuevaReprogMed').datepicker({
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
        $('#txtFechaNuevaReprogMed').mask("Dd/Mm/abcd");

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
            header: false,
            locale: 'es',
            //height: 280,
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],

            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            
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
                let mesInicio = parseInt(fechaInicio.split('/')[1]);
                let mesFin = parseInt(fechaFin.split('/')[1]);

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

                let mesSeleccionado = parseInt(fechaInicio.split('/')[1]);
                //console.log(mesSeleccionado)

                let idMed = $('#cboMedicoProgramacionFiltro').val();
                let anio = $('#cboAnioCalendario').val();
                let mes = $('#cboMesCalendario').val();

                oTable_ProgramacionMedica.fnClearTable();
                if (mesSeleccionado == mes) {
                    if (idMed > 0 && anio > 0 && mes > 0) {
                        await CitasProcedimientos.ListarProgramacionMedicaMensual(1, 0, 0, 0, idMed, 1, anio, mes);
                    }

                    //let fechaF = fecha.substr(8, 2) + '/' + fecha.substr(5, 2) + '/' + fecha.substr(0, 4);
                    if (esFormatoFecha(fechaInicio) && esFormatoFecha(fechaFin)) {
                        if (fechaInicio == fechaFin) {
                            let idMed = $('#cboMedicoProgramacionFiltro').val();
                            let idServ = $('#cboServicioProgramacionFiltro').val();
                            await CitasProcedimientos.ListarProgramacionMedica(1, 0, 0, idServ, idMed, 1, fechaInicio, fechaFin);
                        }

                    }

                    $("#btnLlamarPaciente").hide();
                    
                    CitasProcedimientos.fechaInicioSeleccionada = fechaInicio;
                    CitasProcedimientos.fechaFinSeleccionada = fechaFin;
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

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    InitDataTablesProgramacionMedica() {
        hProgram = ($(window).height() - $("#top").height() - $("#top").height() - $("#header").height() - $("#filtroProgramacion").height() - 25) + 'px';
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            //scrollY: '50vh',
            scrollY: hProgram,
            scrollCollapse: true,
            //bFilter: false,
            columns: [
                {
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        let servicio = rowData.servicio + " (" + rowData.turno + ")"
                        $(td).html(servicio);
                    }
                },
                //{
                //    data: "idProgramacion",
                //    visible: false,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //}
            ]
        }
        oTable_ProgramacionMedica = $("#tblProgramacionMedica").dataTable(parms);
        $("#tblProgramacionMedica_filter").hide();
    },

    InitDataTablesCupos() {
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
                        let NroCuentaCita = rowData.idCuentaAtencion > 0 ?  "<span class='mr-1'>N° Cuenta: " + rowData.idCuentaAtencion + "</span>" : "";
                        let NroMovimiento = "<span class='mr-1'>N° Mov.: " + rowData.idMovimiento + "</span>";
                        let PlanCita = "<span>Plan: " + rowData.fuenteFinanciamiento + "</span>";
                        let HistoriaCita = rowData.nroHistoria > 0  ? "<span class='mr-1'>HC: " + rowData.nroHistoria + "</span>" : "";
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

                        //let infoCupo = "";

                        //infoCupo =
                        //"<table>" 
                        //"<tr>"
                        //"<td colspan='3'>[" + (rowData.id < 10 ? '0' + rowData.id : rowData.id) + "]</td>"
                        //"<td>Plan: " + rowData.fuenteFinanciamiento + "]</td>"
                        //"<tr>"
                        //"<tr>"                        
                        //"<td>HC: " + rowData.fuenteFinanciamiento + "]</td>"
                        //"<td>Nº Cuenta: " + rowData.fuenteFinanciamiento + "]</td>"
                        //"<td>Nº Movimiento: " + rowData.nroMovimiento + "]</td>"
                        //"<tr>"
                        //"<tr>"
                        //"<td>HC: " + rowData.fuenteFinanciamiento + "]</td>"
                        //"<td>Nº Cuenta: " + rowData.fuenteFinanciamiento + "]</td>"
                        //"<td>Nº Movimiento: " + rowData.nroMovimiento + "]</td>"
                        //"<tr>"
                        //"</table>";

                        let estadoCita = "";

                        if (rowData.idEstadoCita == "6") {
                            estadoCita = "BLOQUEADO";
                            EstadoCita = "<span class='mr-1'>Estado: BLOQUEADO</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;'><span>Fecha: " + rowData.fechaSolicitud + "</span></div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>Por: " + rowData.usuarioCita + "</div>";
                            InfoFila4CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + InfoFila4CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " ESTADO: &nbsp BLOQUEADO"
                            $(td).parent().css('background', '#fcff60');
                        } else {
                            if (rowData.idEstadoCita == "0") {
                                estadoCita = "DISPONIBLE";
                                EstadoCita = "<span class='mr-1'>Estado: DISPONIBLE</span>";
                                InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + "</div>";
                                InfoFila2CupoCita = "<div style='line-height: 15px;'><span>&nbsp;</span></div>";
                                InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
                                //InfoFila4CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
                                InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + "</div>";
                                InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                                //estado += " Estado: &nbsp DISPONIBLE"
                                $(td).parent().css('background', '#6fcf72');
                            } else {
                                if (rowData.tieneResultado == "CON RESULTADO") {
                                    estadoCita = "ATENDIDO";
                                    $(td).parent().css('background', 'whitesmoke');
                                } else if (rowData.idEstadoCita == "1") {
                                    estadoCita = "SEPARADO";
                                    $(td).parent().css('background', '#f79836');
                                } else if (rowData.idEstadoCita == "4") {
                                    estadoCita = "PAGADO";                                    
                                    $(td).parent().css('background', '#6c82ff');
                                } else if (rowData.idEstadoCita == "9") {
                                    estadoCita = "VENCIDO";
                                    $(td).parent().css('background', '#b48aff');
                                }  

                                InfoEstadoCita = "<span class='mr-1'>Estado: " + estadoCita + "</span>";
                                InfoFila1CupoCita = "<div style='line-height: 15px;'>" + InfoEstadoCita + PlanCita + "</div>";
                                InfoFila2CupoCita = "<div style='line-height: 15px;' class='text-truncate'>" + HistoriaCita + NroCuentaCita + NroMovimiento + "</div>";
                                InfoFila3CupoCita = "<div style='line-height: 15px;'>" + PacienteCita /*TipoCita + UsuarioCita*/ + "</div>";
                                InfoFila4CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + UsuarioCita + /*FechaSolicitud +*/ "</div>";
                                InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + InfoFila4CupoCita + "</div>";
                                InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            }
                        }

                                                                        
                        //$(td).html("<b>" + InfoCupoCita + estado + ' <BR> ' + info + "</b>")
                        $(td).html("<b>" + InfoCupoCita + "</b>");
                        //$(td).parent().css('font-size', '13px');
                    }
                }
            ]
        }

        var tableWrapper = $('#tblCupos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_Cupos = $("#tblCupos").dataTable(parms);
    },

    InitDataTablesDetalleOrdenCitaProcedimiento() {        
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '20vh',
            columns: [
                //{
                //    data: "idProducto",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
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

        var tableWrapper = $('#tblDetalleOrdenCitaProcedimiento'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_DetalleOrdenCitaProcedimiento = $("#tblDetalleOrdenCitaProcedimiento").dataTable(parms);
    },

    InitDataTablesPacientesCitados() {
        //hProgram = ($(window).height() - $("#top").height() - $("#top").height() - $("#header").height() - $("#filtroProgramacion").height() - 25) + 'px';
        let parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    data: "turnoHoraInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "turnoHoraFin",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "pacienteNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "nroHistoria",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "tieneResultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "examen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
            ]
        }
        oTable_PacientesCitados = $("#tblPacientesCitas").dataTable(parms);
        $("#tblPacientesCitas_filter").hide();
    },

    InitDataTablesCitasProcedimientos() {
        //hProgram = ($(window).height() - $("#top").height() - $("#top").height() - $("#header").height() - $("#filtroProgramacion").height() - 25) + 'px';
        let parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "horaFin",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "tieneResultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: "examen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
            ]
        }
        oTable_CitasProcedimientos = $("#tblCitasProcedimientos").dataTable(parms);
        $("#tblCitasProcedimientos_filter").hide();
    },

    
    /*=====================EVENTOS=======================================================================================*/
    Eventos() {
        $('#modalRegistroCitaProcedimiento').on('shown.bs.modal', function (e) {
            oTable_DetalleOrdenCitaProcedimiento.resize();
        });

        $('#cboServicioProgramacionFiltro').on('change', async function () {
            //let idEspecialidad = $('#cboServicioProgramacionFiltro').val();
            //if (idEspecialidad > 0) {
            //    await CitasProcedimientos.ListarMedicosPorEspecialidad(idEspecialidad);
            //}
            
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let idServ = $('#cboServicioProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();
            //await CitasProcedimientos.ListarProgramacionMedicaMensual(1, 0, 0, idServ, idMed, 1, anio, mes);

            let servicio = $('#cboServicioProgramacionFiltro option:selected').text();
            oTable_ProgramacionMedica.$('tr.selected').removeClass('selected');
            oTable_ProgramacionMedica.fnFilter(servicio, 1);
            oTable_ProgramacionMedica.fnDraw();
        });

        $('#cboMedicoProgramacionFiltro').on('change', async function () {

            if(CitasProcedimientos.fechaFinSeleccionada == '') {
                $('#cboMedicoProgramacionFiltro').val(0)
                alerta2('warning', '', 'Por favor seleccione una fecha.')
                $('.chzn-select').chosen().trigger("chosen:updated");
                return
            }

            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let idServ = $('#cboServicioProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();
            if (anio > 0 && mes > 0) {
                await CitasProcedimientos.ListarProgramacionMedicaMensual(1, 0, 0, idServ, idMed, 1, anio, mes);
                await CitasProcedimientos.ListarProgramacionMedica(1, 0, 0, idServ, idMed, 1, CitasProcedimientos.fechaInicioSeleccionada, CitasProcedimientos.fechaFinSeleccionada);
            }            
        });

        $('#btnLimpiarFiltro').on('click', async function () {
            $("#cboServicioProgramacionFiltro").val("");
            $("#cboMedicoProgramacionFiltro").val("");
            oTable_ProgramacionMedica.fnFilter("", 1);
            await CitasProcedimientos.ListarProgramacionMedica(1, 0, 0, 0, 0, 1, CitasProcedimientos.fechaInicioSeleccionada, CitasProcedimientos.fechaFinSeleccionada);            
            //oTable_ProgramacionMedica.$('tr.selected').removeClass('selected');
            //oTable_ProgramacionMedica.fnFilter("", 1);
            //oTable_ProgramacionMedica.fnDraw();
        });

        $('#cboAnioCalendario').on('change', async function () {
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let idServ = $('#cboServicioProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();

            $('#calendar').fullCalendar('gotoDate', new Date($('#cboAnioCalendario>option:selected').val(), $('#cboMesCalendario>option:selected').val() - 1));
            if (anio > 0 && mes > 0) {
                //await CitasProcedimientos.ListarProgramacionMedicaMensual(1, 0, 0, idServ, idMed, 1, anio, mes);
            }
        });

        $('#cboMesCalendario').on('change', async function () {
            let idMed = $('#cboMedicoProgramacionFiltro').val();
            let idServ = $('#cboServicioProgramacionFiltro').val();
            let anio = $('#cboAnioCalendario').val();
            let mes = $('#cboMesCalendario').val();

            $('#calendar').fullCalendar('gotoDate', new Date($('#cboAnioCalendario>option:selected').val(), $('#cboMesCalendario>option:selected').val() - 1));
            if (anio > 0 && mes > 0) {
                //await CitasProcedimientos.ListarProgramacionMedicaMensual(1, 0, 0, idServ, idMed, 1, anio, mes);
            }
        });

        $('#tblProgramacionMedica tbody').on('click', 'tr', async function () {
            oTable_ProgramacionMedica.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrow = oTable_ProgramacionMedica.api(true).row('.selected').data();
            CitasProcedimientos.idProgramacionMedicaSeleccionada = objrow.idProgramacion;

            await CitasProcedimientos.CargarCuposProgramacion();      

            let fechaActual = await Utilitario.FechaHoraServidor();
            fechaActual = fechaActual.substring(0, 10)
            if (CitasProcedimientos.fechaInicioSeleccionada == fechaActual) {
                let idMedicoSesion = await Utilitario.ObtenerIdMedicoSesion();
                let idMedicoProgramacion = objrow.idMedico
                if (idMedicoProgramacion == idMedicoSesion) {
                    $("#btnLlamarPaciente").show();
                } else {
                    $("#btnLlamarPaciente").hide();
                }                
            } else {
                $("#btnLlamarPaciente").hide();
            }

            $('#lblNombreMedico').html("(" + objrow.medico + ")");
            $('#lblTurnoMedico').html("(" + objrow.horaInicio + " - " + objrow.horaFin + ")");
            $('#lblEspecialidadMedica').html("(" + objrow.servicio + ")");
                       
        });

        /*================CUPOS===================================================================*/
        $('#tblCupos tbody').on('click', 'tr', async function () {            
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                CitasProcedimientos.horaInicioSeleccionada = "";
                CitasProcedimientos.horaFinSeleccionada = "";
            }
            else {
                oTable_Cupos.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');

                let objRow = oTable_Cupos.api(true).row('.selected').data();
                CitasProcedimientos.horaInicioSeleccionada = objRow.turnoHoraInicio;
                CitasProcedimientos.horaFinSeleccionada = objRow.turnoHoraFin;
            } 
        });

        $('#tblCupos tbody').on('contextmenu', 'tr', function (e) {
            e.preventDefault();

            $(oTable_Cupos.$('tr.selected').children()[0]).removeClass('even selected');
            oTable_Cupos.$('tr.selected').removeClass('selected');

            $(this).addClass('selected');
            $($(this).children()[0]).addClass("even selected")

            let objRow = oTable_Cupos.api(true).row('.selected').data();
            CitasProcedimientos.horaInicioSeleccionada = objRow.turnoHoraInicio;
            CitasProcedimientos.horaFinSeleccionada = objRow.turnoHoraFin;

            superCm.createMenu(myMenu, e);
            //superCm.createMenu(CitasAdmision.myMenu, e);
        });

        $('#btnCitaAdicional').on('click', async function () {
            let objRow = oTable_ProgramacionMedica.api(true).row('.selected').data();
            let nuevaHora = moment(objRow.horaFin, "HH:mm").add(objRow.tiempoPromedioAtencion, 'minutes').format("HH:mm");
            CitasProcedimientos.horaInicioSeleccionada = objRow.horaFin;
            CitasProcedimientos.horaFinSeleccionada = nuevaHora;
            await CitasProcedimientos.AgregarRegistroCitaProcedimientoAdicional();
        });

        /*================REGISTRO DE CITAS PROCEDIMIENTOS===================================================================*/
        $('.searchMovimiento').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscarNroMovimiento").click();
            }
        });

        $('#btnBuscarNroMovimiento').on('click', async function () {
            let mov = isNull($("#txtCitaNroMovimiento").val(), 0);
            if (mov > 0) {
                await CitasProcedimientos.SeleccionarImgMovimiento(mov);
            } else {
                alerta2("info", "", "Por favor ingrese un número de movimiento.");
            }
        });

        $('#btnLimpiarNroMovimiento').on('click', async function () {
            CitasProcedimientos.LimpiarRegistroCitaProcedimiento();
        });

        $('#btnGuardarCitaProcedimiento').on('click', async function () {
            if (CitasProcedimientos.idProgramacionMedicaSeleccionada > 0 && CitasProcedimientos.idMovimiento > 0 && isEmpty(CitasProcedimientos.horaInicioSeleccionada) == false && isEmpty(CitasProcedimientos.horaFinSeleccionada) == false) {
                CitasProcedimientos.GuardarCitaProcedimiento();
            }            
        });

        $('#btnCerrarCitaProcedimiento').on('click', async function () {            
            let bloqueo = await CitasProcedimientos.GuardarCitaProcedimientoBloqueado(0);             //0:Desbloquear Cupo
            if (bloqueo) {
                CitasProcedimientos.LimpiarRegistroCitaProcedimiento();
                await CitasProcedimientos.CargarCuposProgramacion();

                $('#modalRegistroCitaProcedimiento').modal('hide');
            }
        });


        /*================REPROGRAMACION DE CITAS PROCEDIMIENTOS===================================================================*/
        $('#btnCerrarReprogramacionCitaProcedimiento').on('click', async function () {            
            CitasProcedimientos.LimpiarReprogramacionCitaProcedimiento();
            await CitasProcedimientos.CargarCuposProgramacion();

            $('#modalReprogramacionCitaProcedimiento').modal('hide');
        });

        $('#txtFechaNuevaReprogMed').on('change', async function () {
            $('#cboServicioNuevoReprogMed').val("");
            $('#txtMedicoNuevoReprogMed').val("");
            $('#cboHoraNuevaReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

            let fecha = $("#txtFechaNuevaReprogMed").val();
            if (esFormatoFecha(fecha) == true) {
                await CitasProcedimientos.ListarServiciosPorFechaEspecialidad(fecha);
            }
        });

        $('#cboServicioNuevoReprogMed').on('change', async function () {
            $('#txtMedicoNuevoReprogMed').val("");
            $('#cboHoraNuevaReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

            if (CitasProcedimientos.idCita == 0 ) {
                alerta2("info", "", "Por favor seleccione la cita que desea reprogramar.");
                return;
            }

            let idProgramacion = $("#cboServicioNuevoReprogMed").val();
            if (isEmpty(idProgramacion) || idProgramacion == 0) {
                alerta2("info", "", "Por favor seleccione el nuevo sericio al cual se reprogramara.");
                return;
            }

            let medico = $('#cboServicioNuevoReprogMed option:selected').data('medico');
            $("#txtMedicoNuevoReprogMed").val(medico);

            await CitasProcedimientos.ListarProgramacionMedicaCuposDisponibles(idProgramacion);

        });

        $('#btnReprogramarPorPaciente').on('click', async function () {

            if (CitasProcedimientos.idCita == 0) {
                alerta2("info", "", "Por favor seleccione la cita que desea reprogramar.");
                return;
            }

            let idProgramacion = $("#cboServicioNuevoReprogMed").val();
            if (isEmpty(idProgramacion) || idProgramacion == 0) {
                alerta2("info", "", "Por favor seleccione el nuevo servicio al cual se reprogramara.");
                return;
            }

            let idCupo = $("#cboHoraNuevaReprogMed").val();
            if (isEmpty(idCupo) || idCupo == 0) {
                alerta2("info", "", "Por favor seleccione el nuevo cupo al cual se reprogramara.");
                return;
            }

            await CitasProcedimientos.GuardarReprogramacionCitaProcedimientoPorPaciente();
        });


        /*================BUSQEUDA DE CITAS PROCEDIMIENTOS===================================================================*/
        $('#btnAbrirBusquedaCitaProcedimiento').on('click', async function () {
            $(".searchCitaProcedimiento").val("");
            oTable_CitasProcedimientos.fnClearTable();
            $('#modalBusquedaCitaProcedimiento').modal('show');
        });

        $('#btnCerrarBusquedaCitaProcedimiento').on('click', async function () {                        
            $(".searchCitaProcedimiento").val("");
            oTable_CitasProcedimientos.fnClearTable();
            $('#modalBusquedaCitaProcedimiento').modal('hide');
        });

        $('.searchCitaProcedimiento').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscarFiltroCitaProcedimiento").click();
            }
        });

        $('#btnBuscarFiltroCitaProcedimiento').on('click', async function () {
            await CitasProcedimientos.ListarCitasProcedimientos();
        });

        $('#btnLimpiarFiltroCitaProcedimiento').on('click', async function () {
            $(".searchCitaProcedimiento").val("");
        });

        $('#tblCitasProcedimientos tbody').on('click', 'tr', async function () {
            oTable_CitasProcedimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');                        
        });


        /*================LLAMADO DE PACIENTES===================================================================*/
        $('#btnLlamarPaciente').on('click', async function () {          
            let objRowCupo = oTable_Cupos.api(true).row('.selected').data();

            if (!isEmpty(objRowCupo)) {
                if (objRowCupo.idCita > 0 && isEmpty(objRowCupo.idCitaBloqueo)) {                    
                    $("#txtLlamadoCuenta").val(objRowCupo.idCuentaAtencion);
                    $("#txtLlamadoHistoria").val(objRowCupo.nroHistoria);
                    $("#txtLlamadoPaciente").val(objRowCupo.pacienteNombre);
                    await Utilitario.GenerarAccionFlujoAtencionProcedimientos(objRowCupo.idCita, 1);      //1: Llamar Paciente
                    $("#modalLlamadoPaciente").modal("show");
                } else {
                    if (objRowCupo.idEstadoCita == 6) {
                        alerta2("info", "", "El cupo seleccionado se encuentra bloqueado por otro usuario.");
                    } else {
                        alerta2("info", "", "El cupo seleccionado no cuenta con ninguna cita asignada.");
                    }
                }
            } else {
                alerta2("info", "", "Por favor seleccione un cupo.");
            }
                      

        });

        $('#btnCancelarLlamadoPaciente').on('click', async function () {
            let objRowCupo = oTable_Cupos.api(true).row('.selected').data();
            if (!isEmpty(objRowCupo)) {
                $("#txtLlamadoCuenta").val("");
                $("#txtLlamadoHistoria").val("");
                $("#txtLlamadoPaciente").val("");
                await Utilitario.GenerarAccionFlujoAtencionProcedimientos(objRowCupo.idCita, 0);      //0: Cancelar llamado Paciente
                $("#modalLlamadoPaciente").modal("hide");
            } else {
                alerta2("info", "", "Por favor seleccione un cupo.");
            }            
        });

    },



    /*====================CONSUMO API=================================================================================*/
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
            $('.chzn-select').chosen().trigger("chosen:updated");
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
                    let idMedicoSesion = await Utilitario.ObtenerIdMedicoSesion();
                    $('#cboMedicoProgramacionFiltro').val(idMedicoSesion);
                    if (idMedicoSesion > 0) {
                        $('#cboMedicoProgramacionFiltro').attr("disabled", true);
                    }
                    //$('#cboMedicoProgramacion').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
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

    //async ListarServicios(idTipoServicio, idDepartamento, idEspecialidad, idServicio) {
    //    var respuesta;
    //    var resp = false;
    //    let datos
    //    var data = new FormData();

    //    data.append('idTipoServicio', idTipoServicio);
    //    data.append('idDepartamento', idDepartamento);
    //    data.append('idEspecialidad', idEspecialidad);
    //    data.append('idServicio', idServicio);

    //    Cargando(1)
    //    try {
    //        //oTable_MedicosFiltro.fnClearTable();
    //        $('#cboServicioProgramacionFiltro').empty();
    //        //$('#cboMedicoProgramacion').empty();
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Servicios/ListarServicios?area=General",
    //                //contentType: "application/json; charset=utf-8",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });

    //        Cargando(0);
    //        if (datos.sesion) {
    //            if (datos.lsResultado.table.length > 0) {
    //                //oTable_MedicosFiltro.fnAddData(datos.lsResultado.table);
    //                $(datos.lsResultado.table).each(function (i, obj) {
    //                    if (obj.activaProcedimiento == 1) {
    //                        $('#cboServicioProgramacionFiltro').append('<option value="' + obj.idServicio + '">' + obj.servicio + '</option>');
    //                    }                        
    //                    //$('#cboMedicoProgramacion').append('<option value="' + obj.idMedico + '">' + obj.medico + '</option>');
    //                });
    //                $('#cboServicioProgramacionFiltro').val('');
    //                //$('#cboMedicoProgramacion').val('');
    //                $('.chzn-select').chosen().trigger("chosen:updated");
    //            }
    //        }
    //        else {
    //            location.reload();
    //        }
    //    } catch (error) {
    //        Cargando(0);
    //        alerta2('error', '', error.toString());
    //        return false;
    //    }

    //    return true;
    //},

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
        let respuesta;
        let resp = false;
        let servicios = [];
        let datos
        let data = new FormData();

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
            $('#cboServicioProgramacionFiltro').empty();
            $('.chzn-select').chosen().trigger("chosen:updated");
            oTable_ProgramacionMedica.fnClearTable();
            oTable_Cupos.fnClearTable();
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
                    
                    $(datos.lsResultado.table).each(function (i, obj) {
                        let serv = {
                            idServicio: obj.idServicio,
                            servicio: obj.servicio
                        }
                        servicios.push(serv);
                    });
                    servicios = servicios.filter((valor, indice, self) => indice === self.findIndex((obj) => obj.idServicio === valor.idServicio));;
                    console.log(servicios)

                    $(servicios).each(function (i, obj) {
                        $('#cboServicioProgramacionFiltro').append('<option value="' + obj.idServicio + '">' + obj.servicio + '</option>');                     
                    });
                    $('#cboServicioProgramacionFiltro').val("");                    
                    $('.chzn-select').chosen().trigger("chosen:updated");
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

    async ListarCuposCitas(idProgramacion) {
        let respuesta;
        let resp = false;
        let servicios = [];
        let datos
        let data = new FormData();

        data.append('idProgramacion', idProgramacion);

        try {
            Cargando(1);            
            oTable_Cupos.fnClearTable();
            oTable_PacientesCitados.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CitasProcedimientos/ListarCuposCitasProcedimientos?area=Imagenologia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    oTable_Cupos.fnAddData(datos.respuesta.table);                         
                    CitasProcedimientos.CargarInformacionAdicional(datos.respuesta.table);
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

    async SeleccionarImgMovimiento(idMovimiento) {
        let cabecera = null;
        let detalle = null;
        let resp = false;
        let datos
        var data = new FormData();

        data.append('idMovimiento', idMovimiento);

        try {
            Cargando(1);
            oTable_DetalleOrdenCitaProcedimiento.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaMovimiento/SeleccionarMovimiento?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);

            if (datos.respuesta.table.length > 0) {
                cabecera = datos.respuesta.table[0];
                detalle = datos.respuesta.table1;
                //insumos = datos.respuesta.table2;

                CitasProcedimientos.idMovimiento = cabecera.idMovimiento;
                CitasProcedimientos.idOrden = cabecera.idOrden;               
                CitasProcedimientos.idCuentaAtencion = cabecera.idCuentaAtencion;
                CitasProcedimientos.idPaciente = cabecera.idPaciente;

                $('#txtCitaNroMovimiento').val(cabecera.idMovimiento);
                $('#txtCitaNroMovimiento').attr("disabled", true);

                $('#txtCitaNroMov').val(cabecera.idMovimiento);
                $('#txtCitaNroCuenta').val(cabecera.idCuentaAtencion > 0 ? cabecera.idCuentaAtencion : "");                
                $('#txtCitaNroHistoria').val(cabecera.nroHistoriaClinica > 0 ? cabecera.nroHistoriaClinica : "");
                $('#txtCitaPaciente').val(cabecera.nroHistoriaClinica > 0 ? cabecera.apellidoPaterno + " " + cabecera.apellidoMaterno + " " + cabecera.primerNombre + " " + cabecera.segundoNombre: cabecera.paciente);

                $('#txtCitaPlan').val("IAFA Act.: " + cabecera.planA);

                if (cabecera.idCuentaAtencion > 0) {
                    $('#txtCitaDatosCuenta').val("F. Ing.: " + cabecera.fechaIngreso + " - " + cabecera.tipoServicio + " - (Est.: " + cabecera.estadoAtencion + ")");
                } else {
                    $('#txtCitaDatosCuenta').val("Paciente Externo - Con Boleta");
                }
                
                                
                //$('.chzn-select').chosen().trigger("chosen:updated");

                /////////////////CARGA DETALLE DE PRODUCTOS DEL MOVIMIENTO//////////////////////////////
                oTable_DetalleOrdenCitaProcedimiento.fnAddData(detalle);

            } else {
                resp = false;
                alerta2("error", "", "Hubo un error en la seleccion de los datos de la orden.");
            }

        } catch (error) {
            resp = false;
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async SeleccionarCitaProcedimiento(idCita) {
        let cabecera = null;
        let detalle = null;
        let resp = false;
        let respuesta = null;
        let datos
        var data = new FormData();

        data.append('idCita', idCita);

        try {
            Cargando(1);
            oTable_DetalleOrdenCitaProcedimiento.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CitasProcedimientos/SeleccionarCitaProcedimiento?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    respuesta = datos.respuesta;
                    
                    //$('.chzn-select').chosen().trigger("chosen:updated");
                    resp = true;                   

                } else {
                    resp = false;
                    alerta2("error", "", "Hubo un error en la seleccion de los datos de la cita.");
                }
            }
            else {
                location.reload();
            }            

        } catch (error) {
            resp = false;
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return respuesta;

    },

    async GuardarCitaProcedimientoBloqueado(accion) {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idProgramacion', CitasProcedimientos.idProgramacionMedicaSeleccionada);        
        data.append('horaInicio', CitasProcedimientos.horaInicioSeleccionada);
        data.append('horaFin', CitasProcedimientos.horaFinSeleccionada);
        data.append('accion', accion);
        data.append('idListBar', ObtenerItemListBar());

        Cargando(1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CitasProcedimientos/GuardarCitaProcedimientoBloqueado?area=Imagenes",
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

    async LimpiarCitaProcedimientoBloqueado() {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idListBar', ObtenerItemListBar());

        Cargando(1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CitasProcedimientos/LimpiarCitaProcedimientoBloqueado?area=Imagenes",
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

    async GuardarCitaProcedimiento() {
        var respuesta = null;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idProgramacion', CitasProcedimientos.idProgramacionMedicaSeleccionada);
        data.append('idMovimiento', CitasProcedimientos.idMovimiento);        
        data.append('horaInicio', CitasProcedimientos.horaInicioSeleccionada);
        data.append('horaFin', CitasProcedimientos.horaFinSeleccionada);
        data.append('idListBar', ObtenerItemListBar());

        Cargando(1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CitasProcedimientos/GuardarCitaProcedimiento?area=Imagenes",
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

                        $('#txtCitaFechaCita').val("");
                        $('#txtCitaHoraCita').val("");

                        CitasProcedimientos.LimpiarRegistroCitaProcedimiento();
                        await CitasProcedimientos.CargarCuposProgramacion();

                        $('#modalRegistroCitaProcedimiento').modal('hide');
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

    async EliminarCitaProcedimiento(idCita) {
        let cabecera = null;
        let detalle = null;
        let resp = false;
        let datos
        var data = new FormData();

        data.append('idCita', idCita);
        data.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CitasProcedimientos/EliminarCitaProcedimiento?area=Imagenes",
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

                        $('#txtCitaFechaCita').val("");
                        $('#txtCitaHoraCita').val("");

                        await CitasProcedimientos.CargarCuposProgramacion();

                        return true;
                    }
                }
            }
            else {
                location.reload();
            }

        } catch (error) {
            resp = false;
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async ListarServiciosPorFechaEspecialidad(fecha) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idTipoServicio', CitasProcedimientos.idTipoServicio);
        data.append('idEspecialidad', CitasProcedimientos.idEspecialidad);
        data.append('activaProcedimiento', 1);
        data.append('fecha', fecha);

        try {
            $('#cboServicioNuevoReprogMed').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ReprogramacionMedica/ListarServiciosPorFechaEspecialidad?area=Herramientas",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;
            $(resp.table).each(function (i, obj) {
                $('#cboServicioNuevoReprogMed').append('<option data-medico="' + obj.medico + '" value="' + obj.idProgramacion + '">' + obj.nombre + ' (' + obj.codigoTurno + ')' + '</option>');
            });
            $('#cboServicioNuevoReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async ListarProgramacionMedicaCuposDisponibles(idProgramacion) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idProgramacion', idProgramacion);

        try {
            $('#cboHoraNuevaReprogMed').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ReprogramacionMedica/ListarProgramacionMedicaCuposDisponibles?area=Herramientas",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;
            $(resp.table).each(function (i, obj) {
                $('#cboHoraNuevaReprogMed').append('<option data-horaInicio="' + obj.horaInicio + '" data-horaFin="' + obj.horaFin + '" value="' + obj.horaInicio + '">' + obj.cupoDisponible + '</option>');
            });
            $('#cboHoraNuevaReprogMed').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async GuardarReprogramacionCitaProcedimientoPorPaciente() {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idCita', CitasProcedimientos.idCita);
        data.append('idProgramacion', $("#cboServicioNuevoReprogMed").val());
        data.append('horaInicio', $('#cboHoraNuevaReprogMed option:selected').data('horainicio'));
        data.append('horaFin', $('#cboHoraNuevaReprogMed option:selected').data('horafin'));

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ReprogramacionMedica/GuardarReprogramacionCitaProcedimientoPorPaciente?area=Herramientas",
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

                if (resp.exito == 1) {
                    alerta2("success", "", resp.mensaje);

                    CitasProcedimientos.LimpiarReprogramacionCitaProcedimiento();
                    await CitasProcedimientos.CargarCuposProgramacion();

                    $('#modalReprogramacionCitaProcedimiento').modal('hide');
                } else {
                    alerta2("warning", "", resp.mensaje);
                }
            }


        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async ListarCitasProcedimientos() {
        let respuesta;
        let resp = false;
        let servicios = [];
        let datos
        let data = new FormData();

        data.append('idMovimiento', $("#txtCitaProcedimientoNroMovimientoBusq").val());
        data.append('nombres', $("#txtCitaProcedimientoNombreBusq").val());

        try {
            Cargando(1);
            oTable_CitasProcedimientos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CitasProcedimientos/ListarCitasProcedimientos?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    oTable_CitasProcedimientos.fnAddData(datos.respuesta.table);
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


    /*====================METODOS=================================================================================*/
    async CargarCuposProgramacion() {
        let objrow = oTable_ProgramacionMedica.api(true).row('.selected').data();
        let idMed = objrow.idMedico;
        let idServ = $('#cboServicioProgramacionFiltro').val();
        let anio = $('#cboAnioCalendario').val();
        let mes = $('#cboMesCalendario').val();
        if (anio > 0 && mes > 0) {
            await CitasProcedimientos.ListarProgramacionMedicaMensual(1, 0, 0, idServ, idMed, 1, anio, mes);
            await CitasProcedimientos.ListarCuposCitas(objrow.idProgramacion);
            
        }
    },

    SeleccionarOpcionMenuContextual: async function (option) {

        let idAccion = option.idAccion
        
        switch (idAccion) {
            case 1:
                await CitasProcedimientos.AgregarRegistroCitaProcedimiento()
                break;
            //case 2:
            //    await CitasProcedimientos.AbrirReprogramacionCitaProcedimiento()
            //    break;
            case 3:
                await CitasProcedimientos.ConsultarRegistroCitaProcedimiento()
                break;
            case 4:
                await CitasProcedimientos.EliminarRegistroCitaProcedimiento()
                break;
            case 5:
                await CitasProcedimientos.ReprogramarCitaProcedimiento()
                break;
            case 10:
                await CitasProcedimientos.GenerarTicketCitaProcedimiento()
                break;
        }
        //console.log('option', option)
    },

    async AgregarRegistroCitaProcedimiento () {
        let objRowCupo = oTable_Cupos.api(true).row('.selected').data();
        let objRowProg = oTable_ProgramacionMedica.api(true).row('.selected').data();

        let bloqueo = await CitasProcedimientos.GuardarCitaProcedimientoBloqueado(1);             //1:Bloquear Cupo
        if (bloqueo) {
            if (isEmpty(objRowCupo.idCita) && isEmpty(objRowCupo.idCitaBloqueo)) {
                $('#txtCitaMedico').val(objRowProg.medico);
                $('#txtCitaServicio').val(objRowProg.servicio);
                $('#txtCitaFechaCita').val(objRowProg.fecha);
                $('#txtCitaHoraCita').val(objRowCupo.turnoHoraInicio + " - " + objRowCupo.turnoHoraFin);
                CitasProcedimientos.LimpiarRegistroCitaProcedimiento();

                $("#frmBusquedaMovimiento").show();
                $("#btnGuardarCitaProcedimiento").show();
                $('#modalRegistroCitaProcedimiento').modal('show');
            } else {
                alerta2("info", "", "El cupo seleccionado ya se encuentra asignado para otro paciente.")
            }
        }        
    },

    async AgregarRegistroCitaProcedimientoAdicional() {        
        let objRowProg = oTable_ProgramacionMedica.api(true).row('.selected').data();

        let bloqueo = await CitasProcedimientos.GuardarCitaProcedimientoBloqueado(1);             //1:Bloquear Cupo
        if (bloqueo) {
            $('#txtCitaMedico').val(objRowProg.medico);
            $('#txtCitaServicio').val(objRowProg.servicio);
            $('#txtCitaFechaCita').val(objRowProg.fecha);
            $('#txtCitaHoraCita').val(CitasProcedimientos.horaInicioSeleccionada + " - " + CitasProcedimientos.horaFinSeleccionada);
            CitasProcedimientos.LimpiarRegistroCitaProcedimiento();

            $("#frmBusquedaMovimiento").show();
            $("#btnGuardarCitaProcedimiento").show();
            $('#modalRegistroCitaProcedimiento').modal('show');
        }
    },

    async ConsultarRegistroCitaProcedimiento() {
        let objRowCupo = oTable_Cupos.api(true).row('.selected').data();

        if (objRowCupo.idCita > 0 && isEmpty(objRowCupo.idCitaBloqueo)) {
            let resp = await CitasProcedimientos.SeleccionarCitaProcedimiento(objRowCupo.idCita);
            if (!isEmpty(resp)) {
                CitasProcedimientos.CargarDatosCita(resp);
                $("#frmBusquedaMovimiento").hide();
                $("#btnGuardarCitaProcedimiento").hide();
                $('#modalRegistroCitaProcedimiento').modal('show');
            }            
        } else {
            if (objRowCupo.idEstadoCita == 6) {
                alerta2("info", "", "El cupo seleccionado se encuentra bloqueado por otro usuario.");
            } else {
                alerta2("info", "", "El cupo seleccionado no cuenta con ninguna cita asignada.");
            }            
        }
    },

    async EliminarRegistroCitaProcedimiento() {
        let objRowCupo = oTable_Cupos.api(true).row('.selected').data();
        
        if (objRowCupo.idCita > 0 && isEmpty(objRowCupo.idCitaBloqueo)) {
            let resp = await CitasProcedimientos.SeleccionarCitaProcedimiento(objRowCupo.idCita);
            if (!isEmpty(resp)) {
                cabecera = resp.table[0];
                
                let info = '<table class="table table-sm table-bordered border mx-auto mt-1">' +
                    '<tr>' +
                    '<th class="text-sm-center" style="background: lightsteelblue;">Nº Movimiento</th>' +                    
                    '<th class="text-sm-center" style="background: lightsteelblue;">Nº Cuenta</th>' +                    
                    '<th class="text-sm-center" style="background: lightsteelblue;">Nº Historia</th>' +                    
                    '</tr>' +
                    '<tr>' +                    
                    '<th class="text-sm-center" style="font-weight: normal;">' + cabecera.idMovimiento + '</th>' +                    
                    '<th class="text-sm-center" style="font-weight: normal;">' + (cabecera.idCuentaAtencion > 0 ? cabecera.idCuentaAtencion : "") + '</th>' +
                    '<th class="text-sm-center" style="font-weight: normal;">' + (cabecera.nroHistoriaClinica > 0 ? cabecera.nroHistoriaClinica : "") + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th class="text-sm-center" colspan="3" style="background: lightsteelblue;">Paciente</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th class="text-sm-center" colspan="3" style="font-weight: normal;">' + cabecera.paciente + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th class="text-sm-center" colspan="3" style="background: lightsteelblue;">Fecha Cita</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th class="text-sm-center" colspan="3" style="font-weight: normal;">' + cabecera.fechaCita + " " + cabecera.horaInicio + " - " + cabecera.horaFin + '</th>' +
                    '</tr>' +
                    '</table>';

                swal({
                    title: 'ELIMINAR',
                    text: "¿Esta seguro de eliminar la cita?<br>" + info,
                    type: 'error',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#ea423e',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'ELIMINAR',
                    cancelButtonText: 'CANCELAR',
                }).then(async function () {
                    await CitasProcedimientos.EliminarCitaProcedimiento(objRowCupo.idCita);
                }, function (dimiss) {

                });
            } 

        } else {
            if (objRowCupo.idEstadoCita == 6) {
                alerta2("info", "", "El cupo seleccionado se encuentra bloqueado por otro usuario.");
            } else {
                alerta2("info", "", "El cupo seleccionado no cuenta con ninguna cita asignada.");
            }
        }
    },

    async ReprogramarCitaProcedimiento() {
        let objRowCupo = oTable_Cupos.api(true).row('.selected').data();

        if (objRowCupo.idCita > 0) {
            let resp = await CitasProcedimientos.SeleccionarCitaProcedimiento(objRowCupo.idCita);
            if (!isEmpty(resp)) {
                CitasProcedimientos.CargarDatosReprogramacionCita(resp);     

                let fechaActual = await Utilitario.FechaHoraServidor();
                $("#txtFechaNuevaReprogMed").datepicker('setStartDate', fechaActual.substring(0, 10));
                $("#txtFechaNuevaReprogMed").datepicker('setDate', fechaActual.substring(0, 10));
                
                $('#modalReprogramacionCitaProcedimiento').modal('show');
            }
        } else {
            if (objRowCupo.idEstadoCita == 6) {
                alerta2("info", "", "El cupo seleccionado se encuentra bloqueado por otro usuario.");
            } else {
                alerta2("info", "", "El cupo seleccionado no cuenta con ninguna cita asignada.");
            }
        }
    },

    async GenerarTicketCitaProcedimiento() {
        let objRowCupo = oTable_Cupos.api(true).row('.selected').data();

        if (objRowCupo.idCita > 0) {

            Cargando(1);

            var formData = new FormData();
            formData.append('idCita', objRowCupo.idCita);
            formData.append('nroCupo', objRowCupo.id);

            var url = "/CitasProcedimientos/GenerarTicketCitaProcedimiento?area=Imagenes";
            //$('#ifrmReporte').attr('src', url);

            var request = new XMLHttpRequest();
            request.responseType = "blob";
            request.open("POST", url, true);

            request.onload = async function () {
                if (request.status === 200) {
                    if (this.response.size > 0) {
                        var url = window.URL.createObjectURL(this.response);
                        var a = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = url;
                        //a.download = this.response.name || "CE-" + $.now()
                        a.download = "TicketCita-" + objRowCupo.idCita + "-" + $.now()
                        //a.click();              

                        Cargando(0);

                        AbrirVisorDocumentoPersonalizado(url, "Ticket Cita Procedimiento");
                    }
                } else {
                    Cargando(0);
                    alerta(3, "Hubo un error al generar el ticket.")
                    // Code here for the server answer when not successful
                }
            }
            request.send(formData);
            //Cargando(0); 
            
        } else {
            if (objRowCupo.idEstadoCita == 6) {
                alerta2("info", "", "El cupo seleccionado se encuentra bloqueado por otro usuario.");
            } else {
                alerta2("info", "", "El cupo seleccionado no cuenta con ninguna cita asignada.");
            }
        }

        
    },

    CargarDatosCita(datos) {
        cabecera = datos.table[0];
        detalle = datos.table1;

        CitasProcedimientos.idProgramacionMedicaSeleccionada = cabecera.idProgramacion;
        CitasProcedimientos.idMovimiento = cabecera.idMovimiento;
        CitasProcedimientos.idOrden = cabecera.idOrden;
        CitasProcedimientos.idCuentaAtencion = cabecera.idCuentaAtencion;
        CitasProcedimientos.idPaciente = cabecera.idPaciente;
        CitasProcedimientos.idCita = cabecera.idCita;
        CitasProcedimientos.idTipoServicio = cabecera.idTipoServicio;
        CitasProcedimientos.idEspecialidad = cabecera.idEspecialidadCita;

        //$('#txtCitaNroMovimiento').val(cabecera.idMovimiento);
        //$('#txtCitaNroMovimiento').attr("disabled", true);

        $('#txtCitaMedico').val(cabecera.medico);
        $('#txtCitaServicio').val(cabecera.servicio);
        $('#txtCitaFechaCita').val(cabecera.fechaCita);
        $('#txtCitaHoraCita').val(cabecera.horaInicio + " - " + cabecera.horaFin);

        $('#txtCitaNroMov').val(cabecera.idMovimiento);
        $('#txtCitaNroCuenta').val(cabecera.idCuentaAtencion);
        $('#txtCitaNroHistoria').val(cabecera.nroHistoriaClinica);
        $('#txtCitaPaciente').val(cabecera.paciente);

        $('#txtCitaPlan').val("IAFA Act.: " + cabecera.fuenteFinanciamiento);
        if (cabecera.idCuentaAtencion > 0) {
            $('#txtCitaDatosCuenta').val("F. Ing.: " + cabecera.fechaIngreso + " - " + cabecera.tipoServicio + " - (Est.: " + cabecera.estadoAtencion + ")");
        } else {
            $('#txtCitaDatosCuenta').val("Paciente Externo - Con Boleta");
        }       

        /////////////////CARGA DETALLE DE PRODUCTOS DEL MOVIMIENTO//////////////////////////////
        oTable_DetalleOrdenCitaProcedimiento.fnAddData(detalle);
    },

    CargarDatosReprogramacionCita(datos) {
        cabecera = datos.table[0];
        detalle = datos.table1;

        CitasProcedimientos.idProgramacionMedicaSeleccionada = cabecera.idProgramacion;
        CitasProcedimientos.idMovimiento = cabecera.idMovimiento;
        CitasProcedimientos.idOrden = cabecera.idOrden;
        CitasProcedimientos.idCuentaAtencion = cabecera.idCuentaAtencion;
        CitasProcedimientos.idPaciente = cabecera.idPaciente;
        CitasProcedimientos.idCita = cabecera.idCita;
        CitasProcedimientos.idTipoServicio = cabecera.idTipoServicio;
        CitasProcedimientos.idEspecialidad = cabecera.idEspecialidadCita;

        $('#tdCitaNroMovimiento').html(cabecera.idMovimiento);
        $('#tdCitaNroCuenta').html(cabecera.idCuentaAtencion);
        $('#tdCitaNroHistoria').html(cabecera.nroHistoriaClinica);
        $('#tdCitaPaciente').html(cabecera.paciente);
        $('#tdCitaFechaCita').html(cabecera.fechaCita);
        $('#tdCitaHoraCita').html(cabecera.horaInicio + " - " + cabecera.horaFin);
        $('#tdCitaMedico').html(cabecera.medico);
        $('#tdCitaServicio').html(cabecera.servicio);        

        //$('#txtCitaPlan').val("IAFA Act.: " + cabecera.fuenteFinanciamiento);
        //$('#txtCitaDatosCuenta').val("F. Ing.: " + cabecera.fechaIngreso + " - " + cabecera.tipoServicio + " - (Est.: " + cabecera.estadoAtencion + ")");

        ///////////////////CARGA DETALLE DE PRODUCTOS DEL MOVIMIENTO//////////////////////////////
        //oTable_DetalleOrdenCitaProcedimiento.fnAddData(detalle);
    },

    CargarInformacionAdicional(datos) {
        let totalCupos = 0;
        let cuposAsignados = 0;
        let cuposLibres = 0;
        let citados = [];
        //let cupos = datos.toArray();

        for (let [i, obj] of datos.entries()) {
            
            //console.log(obj);
            if (obj.idCita > 0) {
                cuposAsignados = cuposAsignados + 1;

                citados.push(obj);
            }

            totalCupos++;
        }

        cuposLibres = totalCupos - cuposAsignados;
        $('#spNroCuposLibres').text(cuposLibres);
        $('#spNroCuposAsignados').text(cuposAsignados);

        if (citados.length > 0) {
            oTable_PacientesCitados.fnAddData(citados);
        }     

        if (cuposLibres == 0) {
            $("#btnCitaAdicional").attr("disabled", false);
        } else {
            $("#btnCitaAdicional").attr("disabled", true);
        }
    },
        

    LimpiarRegistroCitaProcedimiento() {
        CitasProcedimientos.idMovimiento = 0;
        CitasProcedimientos.idOrden = 0;
        CitasProcedimientos.idCuentaAtencion = 0;
        CitasProcedimientos.idPaciente = 0;
        CitasProcedimientos.idCita = 0;
        CitasProcedimientos.idTipoServicio = 0;
        CitasProcedimientos.idEspecialidad = 0;
        $("#txtCitaNroMovimiento").val("");
        $("#txtCitaNroMovimiento").removeAttr("disabled");
        $(".registro").val("");
        oTable_DetalleOrdenCitaProcedimiento.fnClearTable();
    },

    LimpiarReprogramacionCitaProcedimiento() {
        CitasProcedimientos.idMovimiento = 0;
        CitasProcedimientos.idOrden = 0;
        CitasProcedimientos.idCuentaAtencion = 0;
        CitasProcedimientos.idPaciente = 0;  
        CitasProcedimientos.idCita = 0;
        CitasProcedimientos.idTipoServicio = 0;
        CitasProcedimientos.idEspecialidad = 0;
        $(".tdRegistro").html("");
        $(".campoReprogMed").val("");
        $('.chzn-select').chosen().trigger("chosen:updated");
    },


}

$(document).ready(function () {
    CitasProcedimientos.Iniciar();
    //CitasProcedimientos.Init()
})

