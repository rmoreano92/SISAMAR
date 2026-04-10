let PriorizacionEmergencia = {

    tipoBusqueda: 0,
    IdDerivacion: 0,
    CodigoServicio: 0,
    IdEspecialidad: 0,
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

        $('#txtFechaIngresoAdmision').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
        $('#txtFechaIngresoAdmision').mask("Dd/Mm/abcd");

        $('#txtFechaAtencionBuscar, #txtFechaAtencionFinBuscar, #txtFechaInicioReporte, #txtFechaFinReporte').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
        $('#txtFechaAtencionBuscar, #txtFechaAtencionFinBuscar, #txtFechaInicioReporte, #txtFechaFinReporte').mask("Dd/Mm/abcd");


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraIngresoAdmision").mask("Hn:Nn");
    },
    CargaInicial: function () {
        //Diagnosticos.PanelDx = '#PanelDiagnosticoIngreso ';

        //Diagnosticos.IniciarScript()
        //BusquedaDiagnosticos.IniciarScript();

        //$('#txtFechaAtencionBuscar').val(fechaP);
        $('#txtFechaAtencionBuscar').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#txtFechaAtencionFinBuscar').datepicker("setDate", moment().toDate().format('dd/mm/yyyy')); // JDELGADOPM

        $('#txtFechaInicioReporte').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#txtFechaFinReporte').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
    },

    initDatables() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '10%',
                //    targets: 1,
                //    data: "apellidoPaterno",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    width: '10%',
                //    targets: 2,
                //    data: "apellidoMaterno",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    width: '10%',
                //    targets: 3,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //        $(td).html((rowData.primerNombre == null ? '' : rowData.primerNombre.toUpperCase()) + " " + (rowData.segundoNombre == null ? '' : rowData.segundoNombre.toUpperCase()));
                //    }
                //},
                {
                    width: '15%',
                    targets: 1,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //$(td).html(rowData.apellidoPaterno.toUpperCase() + ' ' + rowData.apellidoMaterno.toUpperCase() + ' ' + rowData.primerNombre.toUpperCase() + ' ' + rowData.segundoNombre.toUpperCase());
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        let edad = CalcularEdadAnioMesDia(rowData.fechaNacimiento);
                        //$(td).html(FormatearFecha(rowData.fecNacim));     //reemplazado por edad
                        if (edad.años > 0) {
                            $(td).html(edad.años + ' A');
                        } else if (edad.meses > 0) {
                            $(td).html(edad.meses + ' M');
                        } else if (edad.dias > 0) {
                            $(td).html(edad.dias + ' D');
                        }
                        //$(td).html('--');
                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "tipoPaciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.tipoGravedad == "Prioridad I" && rowData.cantEvaluacion == 0 && isEmpty(rowData.fechaEgreso) == true) {
                            $(td).css("background-color", "red");
                            $(td).css("color", "white");
                        }
                        if (rowData.tipoGravedad == "Prioridad II" && rowData.cantEvaluacion == 0 && isEmpty(rowData.fechaEgreso) == true) {
                            $(td).css("background-color", "orange");
                            $(td).css("color", "darkslategray");
                        }
                        if (rowData.tipoGravedad == "Prioridad III" && rowData.cantEvaluacion == 0 && isEmpty(rowData.fechaEgreso) == true) {
                            $(td).css("background-color", "yellow");
                            $(td).css("color", "darkslategray");
                        }
                        if (rowData.tipoGravedad == "Prioridad IV" && rowData.cantEvaluacion == 0 && isEmpty(rowData.fechaEgreso) == true) {
                            $(td).css("background-color", "green");
                            $(td).css("color", "white");
                        }

                        $(td).html("<strong>" + rowData.tipoGravedad + "</strong>");
                    }
                },
                {
                    width: '6%',
                    targets: 6,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.fechaIngreso + ' ' + rowData.horaIngreso);
                    }
                },
                {
                    width: '6%',
                    targets: 7,
                    data: 'fechaPrimeraEvaluacion',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //console.log(rowData.fechaEgreso);
                        $(td).html(isNull(rowData.fechaEgreso, '') + ' ' + isNull(rowData.horaEgreso, ''));
                    }
                },
                {
                    width: '6%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(isNull(rowData.fechaEgresoAdministrativo, ''));
                    }
                },
                //{
                //    width: '6%',
                //    targets: 8,
                //    data: "horaIngreso",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: '10%',
                    targets: 10,
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 11,
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 12,
                    data: "cantEvaluacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                    }
                },
                {
                    width: '5%',
                    targets: 13,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')

                        if (rowData.cantFirmas > 0) {
                            var btnRuta = "";
                            btnRuta = ' <button class="btnInformeEvaluacion btn btn-sm btn-pink glow_button" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
                            $(td).html(btnRuta);
                        } else {
                            $(td).html('');
                        }

                        //if (!isEmpty(rowData.fechaRegistroEvaluacion)) {
                        //    $(td).parent().css('color', '#347dff');
                        //    $(td).parent().css('font-weight', 'bold');
                        //}

                        if (rowData.cantEvaluacion > 0) {
                            $(td).parent().css('color', '#347dff');
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

                    }
                },
                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '5%',
                    targets: 14,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {

                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            if (rowData.idCuentaFua > 0) {
                                btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                                if (AdmisionEmergencia.permisoFua == '1' && rowData.codeFua != '0') {
                                    if (rowData.statusFirmaFua == 1) {
                                        btnImprimeSinF = "";
                                        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeFuaCF" title="Imprime FUA Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarFuaSF" title="Firmar FUA" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                    }
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                },
                ///////////////////////////////////////////////////////////////////////////
                //////////////////////////KHOYOSI (REFCON)///////////////////////////////////////                
                {
                    width: '8%',
                    targets: 15,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {

                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            if (rowData.idReferencia > 0 || rowData.idContraReferencia > 0) {
                                btnImprimeSinF = '<button class="ImprimeHojaRefConSF btn btn-sm btn-warning glow_button" title="Visualiza REFCON" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                                const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                                if (permisoRefcon == '1' && (rowData.codeRef != '0' || rowData.codeCRef != '0')) {
                                    if (rowData.statusFirmaRef == 1 || rowData.statusFirmaCRef == 1) {
                                        btnImprimeSinF = "";
                                        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeHojaRefConCF" title="Imprime REFCON Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarHojaRefConSF" title="Firmar REFCON" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                    }
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }

                    }
                },
                ////////////////////////////////////////////////////////////////////

            ]

        }

        var tableWrapper = $('#tblAtencionEmer'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atencionesEmer = $("#tblAtencionEmer").dataTable(parms);


    },
    InitDatablesDerivacion: function () {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 1,
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '30%',
                    targets: 1,
                    data: "nombresPaciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: "usuario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 3,
                    data: "consultorioEmergencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 4,
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        $(td).html(FormatearFecha(rowData.fecha) + ' ' + rowData.horaDerivacion)
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]

        }

        var tableWrapper = $('#tblDerivacion');

        oTable_Derivacion = $("#tblDerivacion").dataTable(parms);
    },

    InitDatablesServicios: function () {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '70%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "codigoServicioHIS",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]

        }

        var tableWrapper = $('#tblServicios');

        oTable_Servicios = $("#tblServicios").dataTable(parms);
    },
    InitDatablesMedicoTopico: function () {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    width: '70%',
                    targets: 0,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.apellidoPaterno.toUpperCase() + ' ' + rowData.apellidoMaterno.toUpperCase() + ' ' + rowData.nombres.toUpperCase());
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "colegiatura",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]

        }

        var tableWrapper = $('#tblMedicoTopico');

        oTable_MedicoTopico = $("#tblMedicoTopico").dataTable(parms);
    },

    ListarAtenciones(tipoBusqueda) {
        Cargando(1);
        //console.log("F1");
        oTable_atencionesEmer.fnClearTable();
        var midata = new FormData();
        var fecha = $('#txtFechaAtencionBuscar').val();
        var fechaFin = $('#txtFechaAtencionFinBuscar').val(); // JDELGADOPM
        if ($('#txtNroCuentaBuscar').val() != '' || $('#txtNroDniBuscar').val() != '' || $('#txtNroHistoriaBuscar').val() != '' || $('#txtApPaternoBuscar').val() != '') {
            fecha = '';
            fechaFin = ''; // JDELGADOPM
        }

        midata.append('idCuenta', $('#txtNroCuentaBuscar').val());
        midata.append('dni', $('#txtNroDniBuscar').val());
        midata.append('historia', $('#txtNroHistoriaBuscar').val());
        midata.append('apPaterno', $('#txtApPaternoBuscar').val());
        midata.append('fecha', fecha);
        midata.append('fechaFin', fechaFin); // JDELGADOPM
        midata.append('idServicio', $('#cboServicioEmergenciaBuscar').val());
        midata.append('tipoBusqueda', tipoBusqueda); // KHOYOSI
        var dataAtenciones = {};

        $.ajax({
            method: "POST",
            url: "/AdmisionEmergencia/ListarAtencionesEmergencia?area=Emergencia",
            //url: "/AdmisionEmergencia/BuscarAtencionesEmergenciaPorFiltro?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                Cargando(0);
                //console.log(datos.lsAtenciones.table)
                if (datos.session) {
                    if (datos.lsAtenciones.table.length > 0) {
                        dataAtenciones = datos.lsAtenciones.table;
                        oTable_atencionesEmer.fnAddData(dataAtenciones);
                    }
                    else {
                        dataAtenciones = {};
                    }
                }
                else {
                    //alert("La sesion ya expiro se volvera a recargar la pagina.")
                    alerta(2, "La sesion ya expiro, por favor inicie sesión nuevamente.");
                    $("#modalLogin").modal('show');
                    //location.reload();
                }
            }
        })
    },

    //=======KHOYOSI 20032026===================================================================================================
    async ListarDerivaciones() {
        try {
            Cargando(1);
            oTable_Derivacion.fnClearTable();

            let midata = new FormData();

            midata.append('codigo', $('#txtNroDerivacionBuscar').val());
            midata.append('idCuenta', $('#txtNroCuentaBuscar').val());
            midata.append('dni', $('#txtNroDniBuscar').val());
            midata.append('nombres', $('#txtNombresBuscar').val());
            midata.append('idServicio', $('#cboServicioEmergenciaBuscar').val());
            midata.append('fechaInicio', $('#txtFechaAtencionBuscar').val());
            midata.append('fechaFin', $('#txtFechaAtencionFinBuscar').val());

            const datos = await $.ajax({
                method: "POST",
                url: "/Derivacion/ListarDerivaciones?area=Emergencia",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false
            });

            Cargando(0);

            if (!datos.session) {
                alerta(2, "La sesión expiró, inicia sesión nuevamente.");
                $("#modalLogin").modal('show');
                return;
            }

            if (Array.isArray(datos.data.table) && datos.data.table.length > 0) {
                oTable_Derivacion.fnAddData(datos.data.table);
            } else {
                oTable_Derivacion.fnClearTable();
            }

        } catch (error) {
                Cargando(0);
                console.error("Error en ListarDerivaciones:", error);
                alerta(2, "Ocurrió un error al obtener los datos.");
        }
    },


    async DerivacionELiminar() {
        try {
            Cargando(1);
            oTable_Derivacion.fnClearTable();

            let midata = new FormData();

            midata.append('idDerivacion', PriorizacionEmergencia.IdDerivacion);
            
            const datos = await $.ajax({
                method: "POST",
                url: "/Derivacion/DerivacionELiminar?area=Emergencia",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false
            });

            Cargando(0);

            if (!datos.session) {
                alerta(2, "La sesión expiró, inicia sesión nuevamente.");
                $("#modalLogin").modal('show');
                return false;
            }

            return true;

        } catch (error) {
            Cargando(0);
            console.error("Error en EliminarDerivaciones:", error);
            alerta(2, "Ocurrió un error al obtener los datos.");

            return false;
        }
    },
    //==========================================================================================================================

    ListarTipoServicio: async function () {

        const res = await HttpClient.Get('/Utilitario/listarTipoServicio?area=Comun');

        $('#cboTipoServicioAdmision').empty();
        $('#cboTipoServicioBuscar').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoServicioAdmision').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
            $('#cboTipoServicioBuscar').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
        })

        //$('#cboTipoServicioAdmision').val($('#hdIdTipoServicio').val())
        $('#cboTipoServicioBuscar').val($('#hdIdTipoServicio').val())
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    ServiciosFiltrar: async function (codigo, descripcion) {
        Cargando(1);

        let formData = new FormData();

        let filtro = `where  Servicios.IdTipoServicio = ${$('#cboTipoServicioBuscar').val()} and  Servicios.idEstado=1`

        oTable_Servicios.fnClearTable()

        if (codigo != '') {
            filtro += ` and Servicios.Codigo = '${codigo}'`
        }

        if (descripcion != '') {
            filtro += ` and Servicios.Nombre like '%${descripcion}%'`
        }

        filtro += ' order by Servicios.Nombre, Especialidades.Nombre'

        formData.append('lcFiltro', filtro);

        const res = await HttpClient.Post('/Utilitario/ServiciosFiltrar?area=Comun', formData);

        let data = res.data.table;
        if (!isEmpty(data) && data.length > 0) {
            oTable_Servicios.fnAddData(data)
        }

        Cargando(0)
    },

    ListarDerivacion: async function () {
        Cargando(1);

        oTable_Derivacion.fnClearTable()

        const res = await HttpClient.Get('/Derivacion/ListarDerivacion?area=Comun');

        let data = res.data.table;
        if (!isEmpty(data) && data.length > 0) {
            oTable_Derivacion.fnAddData(data)
        }

        Cargando(0)
    },

    MedicosFiltrar: async function (codigoPlanilla, apellidoPaterno, apellidoMaterno, nombres) {
        Cargando(1);

        let formData = new FormData();

        let filtro = 'where  MedicosEspecialidad.IdEspecialidad <> 50'

        oTable_MedicoTopico.fnClearTable()

        if (codigoPlanilla != '') {
            filtro += ` and Empleados.CodigoPlanilla = '${codigoPlanilla}'`
        }

        if (apellidoPaterno != '') {
            filtro += ` and Empleados.ApellidoPaterno like '${apellidoPaterno}%'`
        }

        if (apellidoMaterno != '') {
            filtro += ` and Empleados.ApellidoMaterno like '${apellidoMaterno}%'`
        }

        if (nombres != '') {
            filtro += ` and Empleados.Nombres like '%${nombres}%'`
        }


        filtro += ' order by Empleados.ApellidoPaterno, Empleados.ApellidoMaterno, Empleados.Nombres'

        formData.append('lcFiltro', filtro);

        const res = await HttpClient.Post('/Utilitario/MedicosFiltrar?area=Comun', formData);

        let data = res.data.table;
        if (!isEmpty(data) && data.length > 0) {
            oTable_MedicoTopico.fnAddData(data)
        }

        Cargando(0)
    },
    DevuelveListaDeUsuariosDelSistema: async function () {

        const res = await HttpClient.Get('/Utilitario/DevuelveListaDeUsuariosDelSistema?area=Comun');

        $('#cboUsuarioReporte').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el cboUsuarioReporte')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboUsuarioReporte').append(`<option value="${obj.idEmpleado}">${obj.nombres}</option>`)
        })

        //$('#cboMotivoAtencionDerivacion').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    ListarServiciosMGP: async function () {

        const res = await HttpClient.Get('/Utilitario/ListarServiciosMGP?area=Comun');

        $('#cboMotivoAtencionDerivacion').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de gravedad')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboMotivoAtencionDerivacion').append(`<option value="${obj.idServicio}">${obj.descripcion}</option>`)
        })

        //$('#cboMotivoAtencionDerivacion').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    ListarFormasLLegada: async function () {

        const res = await HttpClient.Get('/Utilitario/ListarFormasLLegada?area=Comun');

        $('#cboFormaLlegadaDerivacion').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de gravedad')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboFormaLlegadaDerivacion').append(`<option value="${obj.idFormasLLegada}">${obj.descripcion}</option>`)
        })

        //$('#cboFormaLlegadaDerivacion').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    ListarTipoAtencion_Derivacion: async function () {

        const res = await HttpClient.Get('/Utilitario/ListarTipoAtencion_Derivacion?area=Comun');

        $('#cboTipoAtencionDerivacion').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de gravedad')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoAtencionDerivacion').append(`<option value="${obj.idTipoAtencion}">${obj.descripcion}</option>`)
        })

        //$('#cboTipoAtencionDerivacion').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    TiposGravedadAtencionSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Utilitario/TiposGravedadAtencionSeleccionarTodos?area=Comun');

        $('#cboGravedadAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de gravedad')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboGravedadAdmision').append(`<option value="${obj.idTipoGravedad}">${obj.descripcion}</option>`)
        })

        //$('#cboGravedadAdmision').val($('#hdIdTipoServicio').val())
        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    TiposFinanciamientosTarifaSeleccionarPorPlan: async function (idFuenteFinanciamiento) {
        Cargando(1);

        let formData = new FormData();

        formData.append('idFuenteFinanciamiento', idFuenteFinanciamiento);

        const res = await HttpClient.Post('/Utilitario/TiposFinanciamientosTarifaSeleccionarPorPlan?area=Comun', formData);

        $('#cboProductoPlanAdmision').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el producto plan')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboProductoPlanAdmision').append(`<option value="${obj.idTipoFinanciamiento}">${obj.descripcion}</option>`)
        })
        $('#cboProductoPlanAdmision').val(0)
        $('.chzn-select').chosen().trigger("chosen:updated")

        Cargando(0)
    },
    ListarDerivacionById: async function (IdDerivacion) {

        let formData = new FormData();

        formData.append('IdDerivacion', IdDerivacion);

        //const res = await HttpClient.Post('/AdmisionEmergencia/ListarDerivacionById?area=Comun', formData);     //KHOYOSI 20032026
        const res = await HttpClient.Post('/Derivacion/ListarDerivacionById?area=Comun', formData);     //KHOYOSI 20032026

        if (isEmpty(res.data.table)) {
            return null
        }
        return res.data.table[0]
    },

    //MGAMERO
    TiposGradoInstruccionTodos: () => {
        fetch('/Utilitario/TiposGradoInstruccionTodos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboGradoInstruccionPaciente').empty();
                $(response.lsGradosIns.table).each(function(i, obj) {
                    $('#cboGradoInstruccionPaciente').append(`<option value="${obj.idGradoInstruccion}">${obj.dCorto}</option>`)
                })
                $('#cboGradoInstruccionPaciente').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },

    //MGAMERO
    ListaParentesco2: async () => {
        console.log('Ejecutando ListaParentesco2');
        try {

            const res = await fetch('/Utilitario/ListarTiposParentesco?area=Comun', {
                method: 'POST'
            });

            if (!res.ok) throw new Error('Error en la respuesta del servidor');

            const response = await res.json();

            console.log('Parentesco response:', response);

            if (!response.session) {
                alert("Sesión expirada");
                location.reload();
                return;
            }

            const $combo = $('#cboParentescoPaciente');
            $combo.empty();
            $combo.append('<option value="">Seleccione una opción</option>');

            // 👇 AQUÍ ESTÁ EL CAMBIO REAL
            const data = response.respuesta?.table || [];

            data.forEach(obj => {
                $combo.append(
                    `<option value="${obj.idCondicion}">
                    ${obj.descripcion}
                 </option>`
                );
            });

            $combo.trigger("chosen:updated");

        } catch (error) {
            console.error('Error:', error);
        }
    },

    ListarServiciosAdmisionEmergencia() {
        var midata = new FormData();
        midata.append('filtro', ' (2,4) AND Servicios.idEstado = 1 ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre');
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/AdmisionEmergencia/DevuelveServiciosDelHospitalFiltro?area=Emergencia",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: true,
            success: function (datos) {
                //console.log(datos.lsServicios)
                Cargando(0);
                $('#cboServicioEmergenciaBuscar').empty();
                $(datos.lsServicios.table).each(function (i, obj) {
                    /*$('#cboServicioEmergenciaBuscar').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');*/
                    $('#cboServicioEmergenciaBuscar').append('<option value="' + obj.idServicio + '">' + obj.dservicio + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                Cargando(0);
                alerta(3, "Error listar servicios!" + JSON.stringify(msg));
                //                    Cargando(0);                
                //setTimeout(function () {
                //    Cargando(0);
                //    //                    Cargando(0);
                //    alerta("ERROR", "Error listar servicios!", "2");
                //}, 900)
            }
        });
    },
    consultaPaciente: async function () {
        let data = new FormData()
        data.append('nroHistoria', '');
        data.append('nroDocumento', $('#txtNroDocumentoDerivacion').val());

        try {
            Cargando(1);
            datos = await
            $.ajax({
                method: "POST",
                url: "/Paciente/PacienteBuscarPorFiltro?area=ConsultaExterna",
                //contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });
            Cargando(0);
   
            if (!isEmpty(datos.lsPacientes.table[0])) {

            let planPaciente = await PriorizacionEmergencia.BuscarFuentePorDNI(datos.lsPacientes.table[0]["nroDocumento"]);
            console.log(planPaciente);

                var idPaciente = datos.lsPacientes.table[0]["idPaciente"];
                $('#txtNombresCompletosDerivacion').val(datos.lsPacientes.table[0]["apellidoPaterno"] + ' ' + datos.lsPacientes.table[0]["apellidoMaterno"] + ' ' + datos.lsPacientes.table[0]["primerNombre"] + ' ' + isNull(datos.lsPacientes.table[0]["segundoNombre"], ''));
                $('#cboGradoInstruccionPaciente').val(datos.lsPacientes.table[0]["idGradoInstruccion"]);
                $('#cboParentescoPaciente').val(datos.lsPacientes.table[0]["parentescoPaciente"]);
                $('#txtCipPaciente').val(datos.lsPacientes.table[0]["cipPaciente"] || planPaciente?.cip);
                $('.chzn-select').chosen().trigger("chosen:updated")

            } else {
                alerta2("info", '', 'La historia del paciente que esta buscando no existe.')
            }
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    //MGAMERO
    BuscarFuentePorDNI: function (nroDocumento) {
        var formData = new FormData();
        formData.append('nroDocumento', nroDocumento);
        
        return HttpClient.Post('/Paciente/BuscarFuentePorDNI?comun=ConsultaExterna', formData).then(res => {
            return res?.lsPacientes?.table[0]
        })
    },

    CargarDatosDerivacion: async function (derivacion) {
        if (isEmpty(derivacion)) {
            alerta2('warning', 'Atención', 'El Número de Derivación no existe')
            return
        }

        let planPaciente = await RegistroPaciente.BuscarFuentePorDNI(derivacion.nroDocumento);
        console.log(planPaciente);

        PriorizacionEmergencia.IdDerivacion = derivacion.idDerivacion
        PriorizacionEmergencia.CodigoServicio = derivacion.idCodigoServicio
        PriorizacionEmergencia.IdEspecialidad = derivacion.idEspecialidad

        $('#txtNroDerivacion').val(derivacion.idDerivacion)
        $('#cboMotivoAtencionDerivacion').val(derivacion.idMotivoAtencion)
        $('#txtNroDocumentoDerivacion').val(derivacion.nroDocumento)
        $('#txtNombresCompletosDerivacion').val(derivacion.nombresCompletos)
        $('#txtObservacionesDerivacion').val(derivacion.observaciones)

        //MGAMERO
        $('#cboGradoInstruccionPaciente').val(derivacion.idGradoInstruccion);
        $('#cboParentescoPaciente').val(derivacion.parentescoPaciente);
        $('#txtCipPaciente').val(derivacion.cipPaciente || planPaciente?.cip);
        $("#txtLlenadoCapilar").val(derivacion.triajeLlenadoCapilar);
        $("#txtDolor").val(derivacion.triajeDolor);
        $("#txtGlasgow").val(derivacion.glasgow);
        $("#txtBiermanPierson").val(derivacion.biermanPierson);

        //====KHOYOSI 20032026==================================================
        presionAr = derivacion.triajePresion

        if (!(presionAr == null)) {
            presionSep = presionAr.split("/");

            $("#txtPA").val(presionSep[0]);
            $("#txtPAD").val(presionSep[1]);
        }
        else {
            $("#txtPA").val("");
            $("#txtPAD").val("");
        }

        $("#txtPulso").val(derivacion.triajePulso);

        $("#txtT").val(derivacion.triajeTemperatura);


        if (derivacion.triajeFrecRespiratoria == 0) {
            $("#txtFr").val("");
        }
        else {
            $("#txtFr").val(derivacion.triajeFrecRespiratoria);
        }

        if (derivacion.triajeFrecCardiaca == 0) {
            $("#txtFc").val("");
        }
        else {
            $("#txtFc").val(derivacion.triajeFrecCardiaca);
        }

        $("#txtPeso").val(derivacion.triajePeso);
        $("#txtTalla").val(derivacion.triajeTalla);

        $("#txtPC").val(derivacion.triajePerimCefalico);

        $("#txtSO").val(derivacion.triajeSaturacionOxigeno);     //KHOYOSI
        $("#txtPAbdo").val(derivacion.triajePerimAbdominal);     //KHOYOSI

        //$("#txtImc").val(Triaje.calculaImc($("#txtPeso").val(), $("#txtTalla").val())) // cambio calculo imc
        //$("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
        //$("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
        //txtPesoPregesta

        /*if ($("#txtPeso").val() != '' && $("#txtTalla").val() != '') {
            $("#txtTriajeIMC").val(PriorizacionEmergencia.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
            $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Triaje.imc($("#txtTriajeIMC").val()) + ')');
        }*/

        PriorizacionEmergencia.validarRango();
        //=====================================================================

        $('#hdIdServicioIngresoAdmision').val(derivacion.idServicio)
        $('#txtServicioIngresoAdmision').val(derivacion.idCodigoServicio + ' - '+ derivacion.nombreServicio)

        $('#cboGravedadAdmision').val(derivacion.idGravedad)
        $('#cboTipoAtencionDerivacion').val(derivacion.idTipoAtencion)
        $('#cboFormaLlegadaDerivacion').val(derivacion.idComoLLego)

        $(`input[name="rdbPerdidaLiquido"][value="${derivacion.perdidaLiquido}"]`).prop('checked', true)
        $(`input[name="rdbMovimientosFetales"][value="${derivacion.movimientosFetales}"]`).prop('checked', true)
        $(`input[name="rdbDolorCabeza"][value="${derivacion.dolorCabeza}"]`).prop('checked', true)
        $(`input[name="rdbContracciones"][value="${derivacion.contracciones}"]`).prop('checked', true)
        $(`input[name="rdbSangradoVaginal"][value="${derivacion.sangradoVaginal}"]`).prop('checked', true)

        if (derivacion.idServicio == 3102) {
            $('#cboMotivoAtencionDerivacion').val('3').trigger('chosen:updated').trigger('change');
        }

        $('.chzn-select').chosen().trigger("chosen:updated")

        PriorizacionEmergencia.toggleScorePorMotivoAtencion();
    },


    LimpiarDatosDerivacion: function () {
        PriorizacionEmergencia.IdDerivacion = 0
        PriorizacionEmergencia.CodigoServicio = 0
        PriorizacionEmergencia.IdEspecialidad = 0

        $('input[name="rdbPerdidaLiquido"][value="1"]').prop('checked', true)
        $('input[name="rdbMovimientosFetales"][value="1"]').prop('checked', true)
        $('input[name="rdbDolorCabeza"][value="1"]').prop('checked', true)
        $('input[name="rdbContracciones"][value="1"]').prop('checked', true)
        $('input[name="rdbSangradoVaginal"][value="0"]').prop('checked', true)

        $('#txtNroDerivacion').val('')
        $('#cboMotivoAtencionDerivacion').val(1)
        $('#txtNroDocumentoDerivacion').val('')
        $('#txtNombresCompletosDerivacion').val('')
    
        $('#cboGradoInstruccionPaciente').val(0)
        $('#cboParentescoPaciente').val('')
        $('#txtCipPaciente').val('')
        $('#txtLlenadoCapilar').val('')
        $('#txtDolor').val('')
        $('#txtGlasgow').val('')
        $('#txtBiermanPierson').val('')

        $('#txtObservacionesDerivacion').val('')
        $('#hdIdServicioIngresoAdmision').val('')
        $('#txtServicioIngresoAdmision').val('')

        //=====KHOYOSI 20032026=============================
        $("#txtPA").val("");
        $("#txtT").val("");
        $("#txtFr").val("");
        $("#txtFc").val("");
        $("#txtPeso").val("");
        $("#txtTalla").val("");
        $("#txtImc").val("");
        $("#txtPAD").val("");
        $("#txtPC").val("");
        $("#txtSO").val("");
        $("#txtPAbdo").val("");
        $("#txtPulso").val("");
        //===================================================

        $('#cboGravedadAdmision').val(1)
        $('#cboTipoAtencionDerivacion').val(1)
        $('#cboFormaLlegadaDerivacion').val(1)

        $('.chzn-select').chosen().trigger("chosen:updated")

        PriorizacionEmergencia.toggleScorePorMotivoAtencion()
    },

    //=====KHOYOSI 20032026=============================================================
    validarRango() {
        if (90 > $("#txtPA").val() || $("#txtPA").val() > 140) {

            $("#txtPA").css('color', 'red');
        }
        else {
            $("#txtPA").css('color', 'black');
        }

        if (50 > $("#txtPAD").val() || $("#txtPAD").val() > 140) {

            $("#txtPAD").css('color', 'red');
        }
        else {
            $("#txtPAD").css('color', 'black');
        }

        if (60 > $("#txtFc").val() || $("#txtFc").val() > 90) {

            $("#txtFc").css('color', 'red');
        }
        else {
            $("#txtFc").css('color', 'black');
        }

        if (12 > $("#txtFr").val() || $("#txtFr").val() > 20) {

            $("#txtFr").css('color', 'red');
        }
        else {
            $("#txtFr").css('color', 'black');
        }

        if (36 > $("#txtT").val() || $("#txtT").val() > 37) {

            $("#txtT").css('color', 'red');
        }
        else {
            $("#txtT").css('color', 'black');
        }

        if (95 > $("#txtSO").val() || $("#txtSO").val() > 100) {

            $("#txtSO").css('color', 'red');
        }
        else {
            $("#txtSO").css('color', 'black');
        }
    },
    //============================================================================
    toggleScorePorMotivoAtencion() {
        var motivo = $('#cboMotivoAtencionDerivacion').val();

        if (motivo == '3') {
            $('#cardScore').show();
        } else {
            $('#cardScore').hide();
            $('#txtGlasgow').val('');
            $('#txtBiermanPierson').val('');
            
        }
    },

    Events: function () {
        $('#txtNroDocumentoDerivacion').keypress(async function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('#txtNroDocumentoDerivacion').blur();

                let datosDerivacion = await PriorizacionEmergencia.consultaPaciente($('#txtNroDerivacion').val())

            }
        });


        /*_________________________________________________ TABLES _______________________________________________*/
        $('#tblServicios tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Servicios.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_Servicios.api(true).row($(this)).index();
            var row = oTable_Servicios.fnGetData(pos);

        });
        $('#tblMedicoTopico tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_MedicoTopico.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_MedicoTopico.api(true).row($(this)).index();
            var row = oTable_MedicoTopico.fnGetData(pos);

        });
        $('#tblDerivacion tbody').on('click', 'tr', function () {

            oTable_Derivacion.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var pos = oTable_Derivacion.api(true).row($(this)).index();
            var row = oTable_Derivacion.fnGetData(pos);

        });

        /*======KHOYOSI 20032026=========================================================
        $('#tblDerivacion tbody').on('dblclick', 'tr', async function () {

            oTable_Derivacion.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var pos = oTable_Derivacion.api(true).row($(this)).index();
            var row = oTable_Derivacion.fnGetData(pos);

            let datosDerivacion = await PriorizacionEmergencia.ListarDerivacionById(row.codigo)

            if (datosDerivacion.idAtencion > 0) {
                swal({
                    title: 'Atención',
                    text: `El paciente seleccionado ya tiene una Admisión`,
                    type: 'info',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#706f6f',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                })

                return
            }
            

            await PriorizacionEmergencia.CargarDatosDerivacion(datosDerivacion)

            $('#tabDerivacion-tab').click()
        });
        =================================================================================*/

        /*_________________________________________________ BUTTONS _______________________________________________*/

        $('#btnBuscarAtencionesEmergencia').on('click', async function () {
            //$('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta2('info', '', 'Ingrese la fecha de ingreso desde.');
                return false;
            }

            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta2('info', '', 'Ingrese la fecha de ingreso hasta.');
                return false;
            }

            if (isEmpty($('#cboServicioEmergenciaBuscar').val())) {
                alerta2('info', '', 'Seleccione un servicio.');
                return false;
            }
            PriorizacionEmergencia.tipoBusqueda = 1;
            //PriorizacionEmergencia.ListarAtenciones(PriorizacionEmergencia.tipoBusqueda);     ///KHOYOSI 20032026
            await PriorizacionEmergencia.ListarDerivaciones();       ///KHOYOSI 20032026
            ReposicionarVista();
        });

        $('#btnAgregarAdmision').on('click', async function () {

            $('#modalAdmisionEmergencia').modal('show');

            $('#txtFechaIngresoAdmision').datepicker("setDate", getCurrentDate());

            $('#txtHoraIngresoAdmision').val(getCurrentHour())
                       
            PriorizacionEmergencia.LimpiarDatosDerivacion()   
            $('#btnguardarDerivacion').show();

            Cargando(0);
        });

        $('#btnModificarAdmision').on('click', async function () {
            let objrowTb = oTable_Derivacion.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            let datosDerivacion = await PriorizacionEmergencia.ListarDerivacionById(objrowTb.codigo)

            $('#btnguardarDerivacion').show();
            if (datosDerivacion.idAtencion > 0) {
                swal({
                    title: 'Derivación',
                    text: 'El paciente seleccionado ya tiene una Admisión con Nº Cuenta ' + datosDerivacion.idCuentaAtencion + '.<br>No es posible modificar esta derivación.',
                    type: 'info',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#706f6f',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                })

                $('#btnguardarDerivacion').hide();
                
                //return
            }


            await PriorizacionEmergencia.CargarDatosDerivacion(datosDerivacion);
            $('#modalAdmisionEmergencia').modal('show');
        });

        $('#btnEliminarAdmision').on('click', async function () {
            let objrowTb = oTable_Derivacion.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            let datosDerivacion = await PriorizacionEmergencia.ListarDerivacionById(objrowTb.codigo)

            if (datosDerivacion.idAtencion > 0) {
                swal({
                    title: 'Derivación',
                    text: 'El paciente seleccionado ya tiene una Admisión con Nº Cuenta ' + datosDerivacion.idCuentaAtencion + '.<br>No es posible eliminar esta derivación.',
                    icon: 'info',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#706f6f',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                })

                return
            }

            swal({
                title: 'ELIMINAR',
                html: "¿Esta seguro de eliminar el registro?" +
                    '<br><table class="table table-bordered border mx-auto">' +
                    '<tr style="background: lightsteelblue;">' +
                    '<th style="width: 120px;">Nº Derivación</th><th>Paciente</th></tr>' +
                    '<tr><td>' + datosDerivacion.idDerivacion + '</td>' +
                    '<td align="left">' + datosDerivacion.nombresCompletos + '</td></tr></table>',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function (result) {

                if (result.isConfirmed) {
                    PriorizacionEmergencia.IdDerivacion = datosDerivacion.idDerivacion;

                    const resp = await PriorizacionEmergencia.DerivacionELiminar();

                    if (resp) {
                        alerta2("success", "", "El registro se eliminó correctamente.");
                    }
                }

            }).catch(function (dismiss) {
                console.log("Cancelado:", dismiss);
            });

        });

        $('#btnConsultarAdmision').on('click', async function () {
            let objrowTb = oTable_Derivacion.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            let datosDerivacion = await PriorizacionEmergencia.ListarDerivacionById(objrowTb.codigo)

            if (datosDerivacion.idAtencion > 0) {
                swal({
                    title: 'Derivación',
                    text: 'El paciente seleccionado ya tiene una Admisión con Nº Cuenta ' + datosDerivacion.idCuentaAtencion + '.<br>No es posible modificar esta derivación.',
                    type: 'info',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#706f6f',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                })

               

                //return
            }
            
            await PriorizacionEmergencia.CargarDatosDerivacion(datosDerivacion);            
            $('#modalAdmisionEmergencia').modal('show');
            $('#btnguardarDerivacion').hide();
            
        });

        $('#btnCerrarModalDerivacion').on('click', async function () {

            $('#modalAdmisionEmergencia').modal('hide')

            PriorizacionEmergencia.LimpiarDatosDerivacion()

            Cargando(0);
        });

        $('#btnModalServicioIngreso').on('click', async function () {
            $('#modalServicios').modal('show')
            await PriorizacionEmergencia.ServiciosFiltrar('', '')
        })
        $('#btnCerrarModalServicio').on('click', function () {
            $('#modalServicios').modal('hide')
        })
        $('#btnBuscarServicio').on('click', async function () {
            await PriorizacionEmergencia.ServiciosFiltrar($('#txtCodigoServicioBuscar').val(), $('#txtNombreServicioBuscar').val())
        })
        $('#btnSeleccionarServicio').on('click', async function () {

            var objRowTb = oTable_Servicios.api(true).row('.selected').data();

            if (isEmpty(objRowTb)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            $('#hdIdServicioIngresoAdmision').val(objRowTb.idServicio)
            $('#txtServicioIngresoAdmision').val(objRowTb.codigo + ' - ' + objRowTb.nombre)

            PriorizacionEmergencia.CodigoServicio = objRowTb.codigo
            PriorizacionEmergencia.IdEspecialidad = objRowTb.idEspecialidad

            if (objRowTb.idServicio == 3102) {
                $('#cboMotivoAtencionDerivacion').val('3').trigger('chosen:updated').trigger('change');
            }

            $('#modalServicios').modal('hide')
        })

        $('#btnModalMedicoIngreso').on('click', async function () {
            $('#modalMedicoTopico').modal('show')
            await RegistroAdmision.MedicosFiltrar('', '', '', '')
        })
        $('#btnCerrarModalMedicoTopico').on('click', function () {
            $('#modalMedicoTopico').modal('hide')
        })
        $('#btnSeleccionarMedicoTopico').on('click', async function () {

            var objRowTb = oTable_MedicoTopico.api(true).row('.selected').data();

            if (isEmpty(objRowTb)) {
                alerta(2, 'Debe seleccionar un registro')
                return false
            }

            $('#hdIdMedicoIngreso').val(objRowTb.idMedico)
            $('#txtMedicoIngreso').val(objRowTb.idMedico + ' - ' + objRowTb.apellidoPaterno + ' ' + objRowTb.apellidoMaterno + ' ' + objRowTb.nombres)

            $('#modalMedicoTopico').modal('hide')
        })

        $('#btnOpenModalEstablecimientoReferenciaAdmision').on('click', function () {

            if (($('#cboTipoReferenciaAdmision').val() == 0)) {
                alert("Seleccionar el tipo de referencia/contrareferencia")
                return false
            }

            EstablecimientoSalud.opcionEst = 'ADM'

            //oTable_establecimientos.fnClearTable()
            if ($('#cboTipoReferenciaAdmision').val() == 2) {
                $('#divCodigoRenaes').hide()
            } else {
                $('#divCodigoRenaes').show()
            }
            $('#modalEstablecimientosBuscar').modal('show')
        })

        $('#btnguardarDerivacion').on('click', async function () {

            Cargando(1)

            if ($('#txtNombresCompletosDerivacion').val() == '') {
                swal({
                    title: 'Atención',
                    text: `Ingrese nombres del paciente`,
                    type: 'warning',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#706f6f',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                })
                Cargando(0)
                return
            }

            if ($('#hdIdServicioIngresoAdmision').val() == '') {
                swal({
                    title: 'Atención',
                    text: `Ingrese el servicio de ingreso`,
                    type: 'warning',
                    allowOutsideClick: false,
                    showCancelButton: false,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#706f6f',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                })
                Cargando(0)
                return
            }

            let formData = new FormData()

            formData.append('idDerivacion', PriorizacionEmergencia.IdDerivacion);
            formData.append('nroDocumento', $('#txtNroDocumentoDerivacion').val());
            formData.append('nombresCompletos', $('#txtNombresCompletosDerivacion').val());
            formData.append('observaciones', $('#txtObservacionesDerivacion').val());
            formData.append('idConsultorio', $('#hdIdServicioIngresoAdmision').val());
            formData.append('perdidaLiquido', $('input[name="rdbPerdidaLiquido"]:checked').val());
            formData.append('movimientosFetales', $('input[name="rdbMovimientosFetales"]:checked').val());
            formData.append('dolorCabeza', $('input[name="rdbDolorCabeza"]:checked').val());
            formData.append('contracciones', $('input[name="rdbContracciones"]:checked').val());
            formData.append('hinchazonPies', 1);
            formData.append('sangradoVaginal', $('input[name="rdbSangradoVaginal"]:checked').val());
            formData.append('idServicio', $('#hdIdServicioIngresoAdmision').val());
            formData.append('idCodigoServicio', PriorizacionEmergencia.CodigoServicio);
            formData.append('idEspecialidad', PriorizacionEmergencia.IdEspecialidad);
            formData.append('fechaProgramadaMed', '');
            formData.append('horaProgramadaMed', '');
            formData.append('idCodigoPlanilla', 29295);
            formData.append('idMedico', 21);
            formData.append('nombreMedico', 'Mejia CHAVEZ HOMERO');
            formData.append('idComoLlego', $('#cboFormaLlegadaDerivacion').val());
            formData.append('idGravedad', $('#cboGravedadAdmision').val());
            formData.append('idTipoAtencion', $('#cboTipoAtencionDerivacion').val());
            formData.append('idMotivoAtencion', $('#cboMotivoAtencionDerivacion').val());
            //======KHOYOSI 20032026==============================================================================================
            presion = $("#txtPA").val() + "/" + $("#txtPAD").val()
            formData.append("TriajePresion", presion);
            formData.append("TriajeTemperatura", $("#txtT").val());
            formData.append("TriajeFrecRespiratoria", $("#txtFr").val());
            formData.append("TriajeFrecCardiaca", $("#txtFc").val());
            formData.append("TriajePeso", $("#txtPeso").val());
            formData.append("TriajeTalla", $("#txtTalla").val());
            formData.append("TriajePerimCefalico", $("#txtPC").val());
            formData.append("TriajeSaturacionOxigeno", $("#txtSO").val());
            formData.append("TriajePerimAbdominal", $("#txtPAbdo").val());
            formData.append("TriajePulso", $("#txtPulso").val());
            //=====================================================================================================================
            
            //======MGAMERO 20260331==============================================================================================
            formData.append("IdGradoInstruccion", $('#cboGradoInstruccionPaciente').val());
            formData.append("ParentescoPaciente", $('#cboParentescoPaciente').val());
            formData.append("CipPaciente", $('#txtCipPaciente').val());
            formData.append("TriajeLlenadoCapilar", $('#txtLlenadoCapilar').val());
            formData.append("TriajeDolor", $('#txtDolor').val());
            formData.append("Glasgow", $('#txtGlasgow').val());
            formData.append("BiermanPierson", $('#txtBiermanPierson').val());
            //=====================================================================================================================
            

            const res = await HttpClient.Post('/Derivacion/DerivacionAgregar?area=Comun', formData);

            let data = res.data.table;
            if (!isEmpty(data) && data.length > 0) {
                console.log('data', data)

                alerta2('success', 'Atención', `Los datos se agregaron correctamente \n Nro Derivacion: (${data[0].idDerivacion})`)
                //swal({
                //    title: 'Atención',
                //    text: ,
                //    type: 'success',
                //    allowOutsideClick: false,
                //    showCancelButton: false,
                //    confirmButtonColor: '#4fb7fe',
                //    cancelButtonColor: '#706f6f',
                //    confirmButtonText: 'Aceptar',
                //    cancelButtonText: 'Cancelar',
                //}).catch(swal.noop);

                PriorizacionEmergencia.LimpiarDatosDerivacion()
            }

            Cargando(0)

        })

        $('#btnGenerarReporteDerivacion').on('click', () => {

            if ($('#txtFechaInicioReporte').val() == '') {
                $('#txtFechaInicioReporte').focus()
                alerta(2, 'Ingresa la Fecha de Inicio.')
                return false
            }
            if ($('#txtFechaFinReporte').val() == '') {
                $('#txtFechaFinReporte').focus()
                alerta(2, 'Ingresa la Fecha de Fin.')
                return false
            }

            let formData = new FormData()
            formData.append('FechaIni', $('#txtFechaInicioReporte').val())
            formData.append('FechaFin', $("#txtFechaFinReporte").val())
            if ($('#chkTodosLosUsuarios').is(':checked')) {
                formData.append('IdUsuario', 0)
            } else {
                formData.append('IdUsuario', $("#cboUsuarioReporte").val())
            }
            
            Cargando(1)

            fetch('/Derivacion/GeneraRptListarDerivacionByUsuario?area=Emergencia', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "ReporteDerivacion.xlsx"
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

        /*_________________________________________________ COMBO BOX _______________________________________________*/
        $('#cboTipoOrigenAdmision').on('change', function () {


            if ($('#hdIdTipoServicio').val() == 2) { // Emergencia

                if ($('#cboTipoOrigenAdmision>option:selected').val() == 21) {
                    $('#cboTipoReferenciaAdmision').attr('disabled', false)
                    $('#txtNroReferenciaAdmision').attr('disabled', false)
                    $('#btnOpenModalEstablecimientoReferenciaAdmision').attr('disabled', false)

                    $('#lblTipoRefCon').text('Tipo Referencia')
                    $('#lblEstabRefCon').text('Estab. Referencia')

                } else if ($('#cboTipoOrigenAdmision>option:selected').val() == 22) {
                    $('#cboTipoReferenciaAdmision').attr('disabled', false)
                    $('#txtNroReferenciaAdmision').attr('disabled', false)
                    $('#btnOpenModalEstablecimientoReferenciaAdmision').attr('disabled', false)

                    $('#lblTipoRefCon').text('Tipo Contrareferencia')
                    $('#lblEstabRefCon').text('Estab. Contrareferencia')

                } else {
                    $('#cboTipoReferenciaCita').attr('disabled', true)
                    $('#cboTipoReferenciaAdmision').attr('disabled', true)
                    $('#btnOpenModalEstablecimientoReferenciaAdmision').attr('disabled', true)

                    $(`#cboTipoReferenciaCita`).val(0);
                    $('#txtIdReferenciaCita').val('')
                    $('#txtDescripcionReferenciaCita').val('')
                    $('#cboTipoReferenciaAdmision').val('')
                }
            }

            $('.chzn-select').chosen().trigger("chosen:updated")
        })
        $('#cboFuenteFinanciamientoAdmision').on('change', function () {
            //if (this.value == 0) {
            //    $('#cboProductoPlan').empty()
            //    $('#cboProductoPlan').attr('disabled', true)
            //    $('#divParticular').hide()
            //    $('#divSis').hide()
            //    $('.chzn-select').chosen().trigger("chosen:updated")
            //    return false
            //}

            RegistroAdmision.TiposFinanciamientosTarifaSeleccionarPorPlan($('#cboFuenteFinanciamientoAdmision').val())

            $('#cboCodPrestacion').val('0')
            $('.chzn-select').chosen().trigger("chosen:updated");

            if (this.value == 3) {
                $('#divParticular').hide()
                $('#divSis').show()
            } else {
                $('#divParticular').show()
                $('#divSis').hide()
            }
        })

        $('#cboMotivoAtencionDerivacion').on('change', function() {
            PriorizacionEmergencia.toggleScorePorMotivoAtencion();
        });


        /*_________________________________________________ MODALS _______________________________________________*/
        $('#modalServicios').on('shown.bs.modal', function (e) {
            oTable_Servicios.fnDraw()
        });
        $('#modalMedicoTopico').on('shown.bs.modal', function (e) {
            oTable_MedicoTopico.fnDraw()
        });
        $('#modalAdmisionEmergencia').on('shown.bs.modal', function (e) {
            $('#tabDerivacion-tab').click()
        });

        /*_________________________________________________ TEXTS _______________________________________________*/
        $('#txtNroDerivacion').keypress(async function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('#txtNroDerivacion').blur();

                let datosDerivacion = await RegistroAdmision.ListarDerivacionById($('#txtNroDerivacion').val())

                await RegistroAdmision.CargarDatosDerivacion(datosDerivacion)
            }
        });

        /*_________________________________________________ TABS _______________________________________________*/
        /*$('#tabListaDerivacion-tab').on('click', function () {
            PriorizacionEmergencia.ListarDerivacion()
            $('#btnguardarDerivacion').hide()
            $('#btnGenerarReporteDerivacion').hide()
        })

        $('#tabListaDerivacion-tab').on('shown.bs.tab', function (e) {
            var tabId = $(e.target).attr('href'); // Obtiene el ID de la pestaña activa
            console.log("Pestaña activa:", tabId);

            // Ejecuta una función específica según la pestaña
            oTable_Derivacion.fnDraw()
        });

        $('#tabReportePorFecha-tab').on('click', function () {
            $('#btnguardarDerivacion').hide()
            $('#btnGenerarReporteDerivacion').show()
        })

        $('#tabDerivacion-tab').on('click', function () {
            $('#btnguardarDerivacion').show()
            $('#btnGenerarReporteDerivacion').hide()
        })*/
    },

    Init: function () {
        PriorizacionEmergencia.Plugins()
        PriorizacionEmergencia.CargaInicial()

        PriorizacionEmergencia.initDatables()
        PriorizacionEmergencia.InitDatablesServicios()
        PriorizacionEmergencia.InitDatablesDerivacion()

        PriorizacionEmergencia.ListarServiciosAdmisionEmergencia()
        PriorizacionEmergencia.DevuelveListaDeUsuariosDelSistema()

        PriorizacionEmergencia.ListarTipoServicio()
        PriorizacionEmergencia.TiposGravedadAtencionSeleccionarTodos()
        PriorizacionEmergencia.ListarServiciosMGP()
        PriorizacionEmergencia.ListarFormasLLegada()
        PriorizacionEmergencia.ListarTipoAtencion_Derivacion()

        PriorizacionEmergencia.TiposGradoInstruccionTodos()
        PriorizacionEmergencia.ListaParentesco2()

        PriorizacionEmergencia.Events()
    }
}

$(document).ready(function () {
    PriorizacionEmergencia.Init()
})