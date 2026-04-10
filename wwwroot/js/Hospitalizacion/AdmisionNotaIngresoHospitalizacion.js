var AdmisionHospitalizacion = {
    IdAtencion: 0,
    IdServicioEgreso: 0,
    accion: '',
    permisoFua: '',
    esNeo: false,
    accion: '',
    tipoBusqueda: 0,

    Plugins() {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaAtencionBuscar, #txtFUR, #txtFUE, #txtFPP, #txtFechaTransferencia, #txtFechaFinAtencionBuscar').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $('#txtFechaAtencionBuscar, #txtFUR, #txtFUE, #txtFPP, #txtFechaTransferencia, #txtFechaFinAtencionBuscar').mask("Dd/Mm/abcd");

        Ordenes.tipoServicio = 'HOSP'
    },

    async CargaInicial() {
        let fecha = new Date();
        let dia = fecha.getDate();
        let mes = parseInt(fecha.getMonth()) + 1;
        let yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        //$('#txtFechaAtencionBuscar').val(fechaP);
        $('#txtFechaAtencionBuscar').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
        $('#txtFechaFinAtencionBuscar').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

        $('.modalRefCon').modal({ backdrop: 'static', keyboard: false });
        $('.modalRefCon').modal('hide');

        const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();
        if (!isEmpty(permisosGenerales)) {
            AdmisionHospitalizacion.permisoFua = permisosGenerales.table.find(item => item.codigo === 'FUA').valorInt;
        }
        //EstablecimientosSaludTodos();
        //ListaDepartamentos();

        Transferencias.tipoServicio = 'HOSP';
        AltaMedica.tipoServicio = "HOSP";
        AltaMedica.EventosInicial();

        Diagnosticos.PanelDx = '#PanelDiagnosticoClap ';

        Diagnosticos.IniciarScript()
        BusquedaDiagnosticos.IniciarScript();
    },

    async SeleccionarEvaluacionDetalle(idAtencion, idServicio) {

        try {
            let datos;
            oTable_EvaInfHosp.fnClearTable();
            var midata = new FormData();
            midata.append('idAtencion', idAtencion);
            midata.append('idServicio', idServicio);
            var dataEvaluacionDetalle = [];

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/EvaluacionGinecoObstetraHosp/SeleccionarEvaluacionDetalle?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.respuesta.table.length > 0) {
                    dataEvaluacionDetalle = datos.respuesta.table;
                    oTable_EvaInfHosp.fnAddData(dataEvaluacionDetalle);
                }
                else {
                    dataEvaluacionDetalle = [];
                }

            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
        }

        return dataEvaluacionDetalle;

    },

    limpiarRecetas() {
        idRecetaRX = 0;
        idRecetaPatCli = 0;
        idRecetaAnatPat = 0;
        idRecetaBs = 0;
        idRecetaEcoGene = 0;
        idRecetaEcoObs = 0;
        idRecetaFarm = 0;


        $("#ifrmRecetaFarm").contents().find("body").html('');
        $("#ifrmRecetaRx").contents().find("body").html('');
        $("#ifrmRecetaEcoObs").contents().find("body").html('');
        $("#ifrmRecetaEcoGene").contents().find("body").html('');
        $("#ifrmRecetaAnaPatolg").contents().find("body").html('');
        $("#ifrmRecetaPatoClini").contents().find("body").html('');
        $("#ifrmRecetaBs").contents().find("body").html('');

    },
    ///////////////////////////////////////////////////////

    // <summary>
    // DATATABLES
    // </summary>
    // INICIALIZA DATA TABLE
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    InitDatables() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh', // JDELGADOPM
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

                        if (!isEmpty(rowData.fechaNacimiento)) {
                            let edad = CalcularEdadAnioMesDia(rowData.fechaNacimiento);
                            //$(td).html(FormatearFecha(rowData.fecNacim));     //reemplazado por edad
                            if (edad.años > 0) {
                                $(td).html(edad.años + ' A');
                            } else if (edad.meses > 0) {
                                $(td).html(edad.meses + ' M');
                            } else if (edad.dias > 0) {
                                $(td).html(edad.dias + ' D');
                            }
                        } else {
                            $(td).html("");
                        }                        
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
                //{
                //    width: '5%',
                //    targets: 5,
                //    data: "tipoGravedad",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: '7%',
                    targets: 6,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.fechaIngreso + ' ' + rowData.horaIngreso);
                    }
                },
                {
                    width: '7%',
                    targets: 7,
                    data: 'fechaPrimeraEvaluacion',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '7%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //console.log(rowData.fechaEgreso);
                        $(td).html(isNull(rowData.fechaEgreso, '') + ' ' + isNull(rowData.horaEgreso, ''));
                    }
                },
                {
                    width: '7%',
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
                    width: '7%',
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
                        //console.log("IdEstadoFacturacion: " + rowData.idEstadoFacturacion)
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

                                if (AdmisionHospitalizacion.permisoFua == '1' && rowData.codeFua != '0') {
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

        var tableWrapper = $('#tblAtencionHosp'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atencionesHosp = $("#tblAtencionHosp").dataTable(parms);

    },
    //InitDatables() {
    //    var parms = {
    //        "paging": false,
    //        "ordering": false,
    //        "info": false,
    //        "searching": false,
    //        "scrollX": true,  
    //        scrollY: '40vh',
    //        columns: [
    //            {
    //                width: '5%',
    //                targets: 0,
    //                data: "idCuentaAtencion",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            //{
    //            //    width: '10%',
    //            //    targets: 1,
    //            //    data: "apellidoPaterno",
    //            //    createdCell: function (td, cellData, rowData, row, col) {
    //            //        $(td).attr('align', 'left')
    //            //    }
    //            //},
    //            //{
    //            //    width: '10%',
    //            //    targets: 2,
    //            //    data: "apellidoMaterno",
    //            //    createdCell: function (td, cellData, rowData, row, col) {
    //            //        $(td).attr('align', 'left')
    //            //    }
    //            //},
    //            //{
    //            //    width: '10%',
    //            //    targets: 3,
    //            //    data: null,
    //            //    createdCell: function (td, cellData, rowData, row, col) {
    //            //        $(td).attr('align', 'left')
    //            //        $(td).html((rowData.primerNombre == null ? '' : rowData.primerNombre.toUpperCase()) + " " + (rowData.segundoNombre == null ? '' : rowData.segundoNombre.toUpperCase()));
    //            //    }
    //            //},
    //            {
    //                width: '12%',
    //                targets: 3,
    //                data: null,
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                    $(td).html(rowData.apellidoPaterno + ' ' + rowData.apellidoMaterno + ' ' + rowData.primerNombre + ' ' + rowData.segundoNombre);
    //                }
    //            },
    //            {
    //                width: '5%',
    //                targets: 4,
    //                data: "nroHistoriaClinica",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                width: '5%',
    //                targets: 5,
    //                data: null,
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                    $(td).html(FormatearFecha(rowData.fecNacim));
    //                }
    //            },
    //            {
    //                width: '8%',
    //                targets: 6,
    //                data: "tipoPaciente",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                width: '5%',
    //                targets: 7,
    //                data: "fechaIngreso",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                width: '5%',
    //                targets: 8,
    //                data: "horaIngreso",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                width: '10%',
    //                targets: 9,
    //                data: "servicioActual",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                width: '10%',
    //                targets: 10,
    //                data: "plan",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'left')
    //                }
    //            },
    //            {
    //                width: '5%',
    //                targets: 11,
    //                data: "cantEvaluacion",
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).attr('align', 'center')
    //                }
    //            },
    //            {
    //                width: '7%',
    //                targets: 12,
    //                data: null,
    //                createdCell: function (td, cellData, rowData, row, col) {
    //                    $(td).css('text-align', 'center')
    //                    if (!isEmpty(rowData.id) && rowData.id > 0) {
    //                        var btnRuta = "";
    //                        var btnImprime = "";
    //                        var btnImprimeSinF = "";

    //                        //btnRuta = ' <button class="btnInformeEvaluacion btn btn-sm btn-pink glow_button" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';
    //                        /*SE COMENTO PORQUE SOLO PERMITIRA FIRMAR DESDE EL MODULO DEL DETALLE DE LA EVALUACION
    //                        if (rowData.statusFirma == 0) {
    //                            btnRuta = '<a href="' + rowData.ruta + '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip"> <i class="fa fa-pencil"></i></a>';
    //                        }*/

    //                        //if (rowData.statusFirma == 1 || rowData.statusFirma == 0) {
    //                        if (rowData.statusFirma == 1) {
    //                            btnImprime = ' <button class="ImprimirEvalNeoEmerConF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';

    //                            //btnRuta = "";
    //                        } else {
    //                            btnImprimeSinF = '<button class="ImprimirEvalNeoEmerSinF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
    //                        }

    //                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
    //                    }
    //                    else {
    //                        $(td).html('');
    //                    }

    //                    if (!isEmpty(rowData.fechaRegistroEvaluacion)) {
    //                        $(td).parent().css('color', '#347dff');
    //                        $(td).parent().css('font-weight', 'bold');
    //                    }

    //                    if (rowData.conAlta == 1) {
    //                        $(td).parent().css('color', '#00ad15');
    //                        $(td).parent().css('font-weight', 'bold');
    //                    }

    //                }
    //            },
    //            ///////////////////////////FUA//////////////////////////////////
    //            {
    //                width: '5%',
    //                targets: 13,
    //                data: null,
    //                createdCell: async function (td, cellData, rowData, row, col) {
    //                    $(td).css('text-align', 'center')
    //                    if (!isEmpty(rowData.fechaEgreso)) {

    //                        var btnRuta = "";
    //                        var btnImprime = "";
    //                        var btnImprimeSinF = "";

    //                        if (rowData.idCuentaFua > 0) {
    //                            btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

    //                            if (AdmisionHospitalizacion.permisoFua == '1' && rowData.codeFua != '0') {
    //                                if (rowData.statusFirmaFua == 1) {
    //                                    btnImprimeSinF = "";
    //                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeFuaCF" title="Imprime FUA Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
    //                                } else {
    //                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarFuaSF" title="Firmar FUA" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
    //                                }
    //                            }
    //                        }

    //                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
    //                    }
    //                    else {
    //                        $(td).html('');
    //                    }
    //                }
    //            }
    //        ]
    //    }
    //    var tableWrapper = $('#tblAtencionHosp'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    //    oTable_atencionesHosp = $("#tblAtencionHosp").dataTable(parms);
    //},


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
                    width: "60%",
                    targets: 1,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "30%",
                    targets: 1,
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

        var tableWrapperEmer = $('#tblInformeEvaluacionesHospitalizacion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_EvaInfHosp = $("#tblInformeEvaluacionesHospitalizacion").dataTable(parms);
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// EVENTOS
    /// </summary>
    /// Carga los eventos que se encargan de la interaccion y acciones en las vistas para el módulo
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#btnFormatoPiePagina').on('click', async function () {

            let row = oTable_atencionesHosp.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro')
                return
            }

            Cargando(1)
            await NotaIngreso.GenerarFormatoPiePagina(row.idCuentaAtencion)
            Cargando(0)
        })
        $('#btnEdisipClap').on('click', async function () {

            var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro');
                return false;
            }

            Variables.Cargar(objrowTb)

            Variables.IdAtencion = objrowTb.idAtencion
            Variables.IdServicioEgreso = objrowTb.idServicioEgreso
            Variables.NroHistoriaClinica = objrowTb.nroHistoriaClinica

            await AdmisionHospitalizacion.CargarModuloClap('clapGineco')
            await EvaluacionGinecoObstetra.IniciarModulo();
            await ConsumoServicio.IniciarScript()
            Diagnosticos.PanelDx = '#PanelDiagnosticoClap ';
            EvaluacionGinecoObstetra.CargarDatosEvaluacion();

            $("#modalClap").modal('show')
        })






        $("#btnOpenModalReferenciaEESSGA").on('click', () => {
            $("#modalEstablecimientosUciBuscar").modal("show")

            EvaluacionGinecoObstetra.tipoEstablecimiento = 1
        })
        $("#btnOpenModalReferenciaOtroEESSGA").on('click', () => {
            $("#modalEstablecimientosUciBuscar").modal("show")

            EvaluacionGinecoObstetra.tipoEstablecimiento = 2
        })

        $('#btnBuscarEstablecimientoUci').off().on('click', function () {
            let formData = new FormData()

            formData.append('codigoRenaes', $('#codigoEstUciBuscar').val())
            formData.append('nombreEstablecimiento', $('#nombreEstUciBuscar').val())
            formData.append('idDepartamento', $('#cmbdepEstUcibuscar').val())
            formData.append('idProvincia', $('#cmbprovEstUciBuscar').val())
            formData.append('idDistrito', $('#cmbdistEstUciBuscar').val())

            fetch('/citas/ListarEstablecimientosReferenciaV2?area=ConsultaExterna', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .catch(error => console.error('error:', error))
                .then(response => {
                    Cargando(1)
                    oTable_establecimientos.fnClearTable()
                    if (response.dataSet.table.length > 0) {
                        oTable_establecimientos.fnAddData(response.dataSet.table);
                    }
                    Cargando(0)
                });
        })







        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.search').blur();
                $("#btnBuscarAtencionesHospitalizacion").click();
            }
        });

        $('#tblAtencionHosp tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_atencionesHosp.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_atencionesHosp.api(true).row($(this)).index();
            var row = oTable_atencionesHosp.fnGetData(pos);

        });


        $("#txtFUR").on('change', function () {

            if ($("#txtFUR").val() != "") {
                var midata = new FormData();

                midata.append('FechaCita', fehaDiaActual());
                midata.append('Fecha', $("#txtFUR").val());
                midata.append('SemanasEco', 0);
                midata.append('DiasEco', 0);
                midata.append('Tipo', 1);

                $.ajax({
                    method: "POST",
                    url: "/Atencion/DevolverEdadGestacional?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    processData: false,
                    contentType: false,
                    async: false,
                    success: function (datos) {
                        if (isEmpty(datos) == false) {
                            $("#txtEdadGestacionalSemanas").val(datos.cantSemanas);
                            $("#txtEdadGestacionalDias").val(datos.cantDias);
                            $("#txtFPP").val(datos.fpp);
                        }
                    },
                    error: function (msg) {
                        setTimeout(function () {
                            //                    Cargando(0);
                            alerta("ERROR", "Error al calcular la edad gestacional!", "2");
                        }, 900)
                    }
                });

            }
            else {
                alerta(3, "Debe ingresar la fecha de ultima regla");
                $("#txtFUM").focus();
            }

        });

        $("#chkFUR").on('click', function () { // JDELGADO001.2
            if ($("#chkFUR").is(':checked')) {
                $("#txtFUR").attr('disabled', true);
                $("#txtFUR").val('');
            } else {
                $("#txtFUR").attr('disabled', false);
            }
        })
        $("#chkFUE").on('click', function () { // JDELGADO001.2
            if ($("#chkFUE").is(':checked')) {
                $("#txtFUE").attr('disabled', true);
                $("#txtFUE").val('');
            } else {
                $("#txtFUE").attr('disabled', false);
            }
        })

        $("#rdbTactoVaginalSi").on("click", function () {
            NotaIngresoRegistrar.TactoVaginalBloqueaLimpia(2);
        });
        $("#rdbTactoVaginalDiferido").on("click", function () {
            NotaIngresoRegistrar.TactoVaginalBloqueaLimpia(1);
        });


        $('#cboServicioHospitalizacionBuscar').on('change', function () {
            AdmisionHospitalizacion.ListarAtenciones(1);
        });

        $('#btnBuscarAtencionesHospitalizacion').on('click', function () {
            if ($('#txtNroHistoriaBuscar').val() == '' && $('#txtNroCuentaBuscar').val() == '' && $('#txtNroDniBuscar').val() == '' && $('#txtApPaternoBuscar').val() == '' &&
                $('#txtFechaAtencionBuscar').val() == '' && $('#txtFechaTransferencia').val() == '' && $('#cboServicioHospitalizacionBuscar').val() == 0 && $('#txtFechaFinAtencionBuscar').val() == '') {

                alerta(2, 'Debe ingresar al menos un campo para la busqueda');
                return false
            }
            AdmisionHospitalizacion.tipoBusqueda = 1;
            AdmisionHospitalizacion.ListarAtenciones(AdmisionHospitalizacion.tipoBusqueda);
        })

        $('#btnBuscarAtencionesEmergenciaSinAltaMedica').on('click', function () {
            //$('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta2('info', '', 'Ingrese la fecha de ingreso.');
                return false;
            }

            if ($('#cboServicioHospitalizacionBuscar').val() == 0) {
                alerta2('info', '', 'Seleccione un servicio.');
                return false;
            }
            AdmisionHospitalizacion.tipoBusqueda = 2;
            AdmisionHospitalizacion.ListarAtenciones(AdmisionHospitalizacion.tipoBusqueda);
            ReposicionarVista();
        });

        $('#btnBuscarAtencionesEmergenciaSinRecepcion').on('click', function () {
            //$('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta2('info', '', 'Ingrese la fecha de ingreso.');
                return false;
            }

            if ($('#cboServicioHospitalizacionBuscar').val() == 0) {
                alerta2('info', '', 'Seleccione un servicio.');
                return false;
            }
            AdmisionHospitalizacion.tipoBusqueda = 3;
            AdmisionHospitalizacion.ListarAtenciones(AdmisionHospitalizacion.tipoBusqueda);
            ReposicionarVista();
        });

        $('#btnBuscarAtencionesEmergenciaSinAltaAdministrativa').on('click', function () {
            //$('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta2('info', '', 'Ingrese la fecha de ingreso.');
                return false;
            }

            if ($('#cboServicioHospitalizacionBuscar').val() == 0) {
                alerta2('info', '', 'Seleccione un servicio.');
                return false;
            }
            AdmisionHospitalizacion.tipoBusqueda = 4;
            AdmisionHospitalizacion.ListarAtenciones(AdmisionHospitalizacion.tipoBusqueda);
            ReposicionarVista();
        });

        $('#btnLimpiarFiltro').on('click', function () {
            //$('#txtNroHistoriaBuscar').val('')
            //$('#txtNroCuentaBuscar').val('')
            //$('#txtNroDniBuscar').val('')
            //$('#txtApPaternoBuscar').val('')            
            //$('#txtFechaTransferencia').val('')
            $('.search').val('');
            $('#txtFechaAtencionBuscar').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));
            $(`#cboServicioHospitalizacionBuscar`).val(0);
            $('.chzn-select').chosen().trigger("chosen:updated");

        })

        $("#btnAgregarNI").on('click', async function () {
            $("#modulo").html("");
            //opcionModificar = false;
            //AdmisionEmergencia.accion = "M";
            var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro');
                return false;
            } else {

                let estado = await ConsumoServicio.verificarEstadosCuenta(objrowTb.idCuentaAtencion, 1);

                if (estado.estado != 1) {
                    swal({
                        title: 'Atenciones',
                        text: `Verificar cuenta \n
                            Estado: ${estado.estado} - ${estado.descripcionEstado}  \n
                            Servicio actual: ${objrowTb.servicioActual}`,
                        type: 'info',
                    }).done();
                    return false;
                }
                Variables.Cargar(objrowTb);
                NotaIngreso.Mostrar(objrowTb)

            }

        });

        /////////////////////////////////EVENTOS IMPRIMIR FUA/////////////////////////////////////////
        $('#tblAtencionHosp tbody').on('click', '.ImprimeFuaSF', async function () {
            var objrow = oTable_atencionesHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesHosp.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeFua)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarFuaPdf(row.idCuentaAtencion, row.idCuentaAtencion);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblAtencionHosp tbody').on('click', '.ImprimeFuaCF', async function () {
            var objrow = oTable_atencionesHosp.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atencionesHosp.fnGetData(objrow)

            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeFua);
        });

        $('#tblAtencionHosp tbody').on('click', '.FirmarFuaSF', async function () {
            var objrow = oTable_atencionesHosp.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atencionesHosp.fnGetData(objrow)

            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codeFua)               //KHOYOSI            
            if (firma) {
                Utilitario.TipoArchivoFirmar = 'HOSP';
                await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua);
            }
            Cargando(0);
        });
        ////////////////////////////////////////////////////////////////////////////////////////////////


        $('#tblAtencionHosp tbody').on('click', '.ImprimeHojaRefConSF', async function () {
            var objrow = oTable_atencionesHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesHosp.fnGetData(objrow);
            var idRefCon = 0;
            var tipo = '';
            var code = '';

            Cargando(1);
            if (row.idReferencia > 0) {
                idRefCon = row.idReferencia;
                tipo = 'RF'
                code = row.codeRef;
            } else if (row.idContraReferencia > 0) {

                idRefCon = row.idContraReferencia;
                tipo = 'CRF';
                code = row.codeCRef;
            }
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(code)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarRefConPdf(row.idCuentaAtencion, idRefCon, tipo);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblAtencionHosp tbody').on('click', '.ImprimeHojaRefConCF', async function () {
            var objrow = oTable_atencionesHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesHosp.fnGetData(objrow);
            var tipo = '';
            var code = '';

            if (row.idReferencia > 0) {
                idRefCon = row.idReferencia;
                tipo = 'RF'
                code = row.codeRef;
            } else if (row.idContraReferencia > 0) {

                idRefCon = row.idContraReferencia;
                tipo = 'CRF';
                code = row.codeCRef;
            }
            await Utilitario.AbrirDocumentoFirmadoBit4Id(code);
        });

        $('#tblAtencionHosp tbody').on('click', '.FirmarHojaRefConSF', async function () {
            var objrow = oTable_atencionesHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesHosp.fnGetData(objrow);
            var tipo = '';
            var code = '';

            if (row.idReferencia > 0) {
                idRefCon = row.idReferencia;
                tipo = 'RF'
                code = row.codeRef;
            } else if (row.idContraReferencia > 0) {

                idRefCon = row.idContraReferencia;
                tipo = 'CRF';
                code = row.codeCRef;
            }
            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(code)               //KHOYOSI            
            if (firma) {
                if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(code); }
                if (permisoFirmaDigital == 2) { await Utilitario.AbrirServicioFirmaPeru(code); }
                //await Utilitario.AbrirServicioFirmaBit4Id(code);
            }
            Cargando(0);
        });

        //==============================EVENTO MODIFICAR EVALUACION==============================//
        $("#btnModificarAtenciones").on('click', async function () {
            $("#modulo").html("");
            //opcionModificar = false;
            AdmisionHospitalizacion.accion = "M";
            OrdenMedica.accion = "M";
            var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();

            Cargando(1);
            if (AdmisionHospitalizacion.ValidaCargaModulo()) {
                //if (AdmisionHospitalizacion.ValidaTipoModulo()) {
                Variables.Cargar(objrowTb);
                await AdmisionHospitalizacion.ValidaAbrirModulo();
                Triaje.eventos();
                if (!AdmisionHospitalizacion.esNeo) {
                    //await NotaIngreso.IniciaFormulario(1);
                    await EvaluacionGinecoObstetra.ModificarEvaluacion();
                } else {
                    await EvaluacionNeonatalHosp.ModificarEvaluacion();
                }
                //if (objrowTb.tipoModuloEmergencia == "ginecobstetra") { EvaluacionEmergencia.ModificarEvaluacion(); }
                //if (objrowTb.tipoModuloEmergencia == "neonatal") { EvaluacionNeonatal.ModificarEvaluacion(); }
                //}
            }

            $('#btnNuevoRegistro').show()
            $('#btnGuardarEva').show()
            $('#btnGuardarEvaNeo').show()
            Cargando(0);
        });

        //==============================EVENTO CONSULTAR EVALUACION==============================//
        $("#btnConsultarAtenciones").on('click', async function () {
            $("#modulo").html("");
            //opcionModificar = false;
            AdmisionHospitalizacion.accion = "C";
            OrdenMedica.accion = "C";
            var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();

            //if (isEmpty(objrowTb.fechaEgreso)) {

            //    alerta(2, 'El paciente aun no fue atendido')

            //    return false
            //}
            Cargando(1);
            if (AdmisionHospitalizacion.ValidaCargaModulo()) {
                //if (AdmisionHospitalizacion.ValidaTipoModulo()) {
                Variables.Cargar(objrowTb);
                await AdmisionHospitalizacion.ValidaAbrirModulo();

                Triaje.eventos();
                if (!AdmisionHospitalizacion.esNeo) {
                    //await NotaIngreso.IniciaFormulario(1);
                    await EvaluacionGinecoObstetra.ConsultarEvaluacion();
                    //$('#btnGuardarEvaNeo').hide()
                } else {
                    await EvaluacionNeonatalHosp.ConsultarEvaluacion();
                    //$('#btnGuardarEvaNeo').hide()
                }
                //if (objrowTb.tipoModuloEmergencia == "ginecobstetra") { EvaluacionEmergencia.ConsultarEvaluacion(); }
                //if (objrowTb.tipoModuloEmergencia == "neonatal") { EvaluacionNeonatal.ConsultarEvaluacion(); }

                //}
            }

            //$('#btnNuevoRegistro').hide()
            //$('#btnGuardarEva').hide()
            //$('#btnGuardarEvaNeo').hide()

            Cargando(0);
        });

        /////////////////////////////EVENTO LISTA INFORMES DE EVALAUCION///////////////////////////
        $('#tblAtencionHosp tbody').on('click', '.btnInformeEvaluacion', async function () {
            var objrow = oTable_atencionesHosp.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atencionesHosp.fnGetData(objrow)

            AdmisionHospitalizacion.IdAtencion = row.idAtencion;
            AdmisionHospitalizacion.IdServicioEgreso = row.idServicioEgreso;
            //await AdmisionHospitalizacion.SeleccionarEvaluacionDetalle(AdmisionHospitalizacion.IdAtencion, AdmisionHospitalizacion.IdServicioEgreso);
            await AdmisionHospitalizacion.SeleccionarEvaluacionDetalle(AdmisionHospitalizacion.IdAtencion, 0);
            $("#modalInformeEvaluacion").modal("show");
        });

        $("#btnCerrarInformeEvaluacion").on('click', function () {
            AdmisionHospitalizacion.IdAtencion = 0;
            AdmisionHospitalizacion.IdServicioEgreso = 0;
            $("#modalInformeEvaluacion").modal("hide");
        });

        $('#tblInformeEvaluacionesHospitalizacion tbody').on('click', '.ImprimirEvalSF', async function () {
            var objrow = oTable_EvaInfHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInfHosp.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
                if (isEmpty(firma)) {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                    const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(row.idCuentaAtencion, row.idEvaluacionDetalle, row.idAtencion, row.idServicio, row.idNumero);

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

        $('#tblInformeEvaluacionesHospitalizacion tbody').on('click', '.ImprimirEvalCF', async function () {
            var objrow = oTable_EvaInfHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInfHosp.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
            }
            Cargando(0);
        });

        $('#tblInformeEvaluacionesHospitalizacion tbody').on('click', '.FirmarEvalSF', async function () {
            var objrow = oTable_EvaInfHosp.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_EvaInfHosp.fnGetData(objrow);

            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                Utilitario.TipoArchivoFirmar = 'HOSP-EVA';
                const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code);
                if (firma) {
                    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
                }
            }
            Cargando(0);
        });
        ////////////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////////EVENTO ALTA MEDICA///////////////////////////////
        //$("#btnAltaMedica").on('click', async function () {
        //    $("#ModuloAlta").html("");

        //    AdmisionHospitalizacion.accion = "AM";
        //    var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();

        //    Cargando(1);
        //    if (AdmisionHospitalizacion.ValidaCargaModulo()) {
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



        //$('#tblAtencionEmer tbody').on('click', 'tr', function () {

        //    if ($(this).hasClass('selected')) {
        //        $(this).removeClass('selected');
        //    }
        //    else {
        //        oTable_atencionesEmer.$('tr.selected').removeClass('selected');
        //        $(this).addClass('selected');
        //    }
        //    //var pos = oTable_atencionesEmer.api(true).row($(this)).index();
        //    //var row = oTable_atencionesEmer.fnGetData(pos);
        //})
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// <summary>
    /// FUNCIONES
    /// </summary>
    /// Funciones 
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ListarServiciosAdmisionHospitalizacion() {
        var midata = new FormData();
        midata.append('filtro', ' (3) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre');
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
                $('#cboServicioHospitalizacionBuscar').empty();
                $('#cboServicioHospitalizacionBuscar').append('<option value="0">Todos</option>');
                $(datos.lsServicios.table).each(function (i, obj) {
                    /*$('#cboServicioEmergenciaBuscar').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');*/
                    $('#cboServicioHospitalizacionBuscar').append('<option value="' + obj.idServicio + '">' + obj.dservicio + '</option>');
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

    ListarAtenciones(tipoBusqueda) {

        Cargando(1)
        oTable_atencionesHosp.fnClearTable();

        var midata = new FormData();
        midata.append('historiaClinica', $('#txtNroHistoriaBuscar').val());
        midata.append('idCuentaAtencion', $('#txtNroCuentaBuscar').val());
        midata.append('dni', $('#txtNroDniBuscar').val());
        midata.append('apellidoPaterno', $('#txtApPaternoBuscar').val());
        midata.append('fechaIngreso', $('#txtFechaAtencionBuscar').val());
        midata.append('fechaFin', $('#txtFechaFinAtencionBuscar').val());
        midata.append('idServicio', $('#cboServicioHospitalizacionBuscar').val());
        midata.append('fechaTransferencia', $('#txtFechaTransferencia').val());
        midata.append('tipoBusqueda', tipoBusqueda); // KHOYOSI

        $.ajax({ //jdelgado010
            method: "POST",
            url: "/AdmisionHospitalizacion/ListarAtencionesHospitalizacion?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {
                    //console.log("consulta este")
                    if (datos.lstPacientesHops.table.length > 0) {
                        oTable_atencionesHosp.fnAddData(datos.lstPacientesHops.table);
                        oTable_atencionesHosp.resize();
                    }
                    else {
                        Cargando(0)
                    }
                }
                else {
                    Cargando(0);
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })

    },

    ObtenerIdUsuarioSesion() {
        var idUser = 0;
        $.ajax({
            method: "POST",
            url: "/Utilitario/ObtenerIdUsuarioLogeado?area=Comun",
            //data: midata,
            //dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                idUser = datos;
            },
            error: function (msg) {
                alerta("ERROR", "Error aal obtener Id del Medico!", "2");
            }
        });

        return idUser;
    },
    /////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /// <summary>
    /// VALIDACIONES
    /// </summary>
    /// Lista de metodos que se encargan de realizar validaciones
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ValidaCargaModulo() {
        var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            //alerta(2, 'Seleccione un registro por favor.');
            alerta2('info', '', 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            //alerta(2, 'La cuenta esta cerrada.');
            alerta2('warning', '', 'La cuenta se encuentra cerrada.');
            if (AdmisionHospitalizacion.accion == 'M') {
                return false;
            }

            //if (AdmisionHospitalizacion.accion == 'AM') {
            //    return false;
            //}
        }

        if (objrowTb.fechaEgreso != '' && objrowTb.fechaEgreso != null) {
            //alerta(2, 'El paciente tiene alta médica.');
            alerta2('warning', '', 'El paciente tiene alta médica.');
            if (AdmisionHospitalizacion.accion == 'M') {
                return false;
            }

            if (AdmisionHospitalizacion.accion == 'AM') {
                return true;
            }
        }

        if (isEmpty(objrowTb.idCamaIngreso)) {
            alerta2('warning', '', 'El paciente aún no se le asignado cama de ingreso.<br>Por favor realice la recepción.');
            return false;
        }

        if (objrowTb.llegoAlServicio == 0) {
            alerta2('warning', '', 'El paciente aún no llega al servicio.<br>Por favor realice la recepción.');
            return false;
        }

        //if (objrowTb.llegoAlServicio == 0) {
        //    swal({
        //        title: 'Transferencia',
        //        text: 'Debe confirmar que el paciente <strong style="font-weight: 900;text-decoration: underline;">Llegó al Servicio Transferido</strong>.<br>Cama Nro: ' + objrowTb.codigoCama + ' <br>¿Esta seguro de confirmar la llegada?',
        //        type: 'warning',
        //        showCancelButton: true,
        //        confirmButtonColor: '#4fb7fe',
        //        cancelButtonColor: '#6c6c6c',
        //        confirmButtonText: 'SÍ LLEGÓ',
        //        cancelButtonText: 'CANCELAR',
        //    }).then(async function () {
        //        const llegada = await Transferencias.ConfirmarLlegadaAlServicio(objrowTb.idEstanciaHospitalariaActual);
        //        if (llegada) {
        //            AdmisionHospitalizacion.ListarAtenciones(1);
        //            ReposicionarVista();
        //        }
        //    }, function (dimiss) {
        //        AdmisionHospitalizacion.ListarAtenciones(1);
        //        ReposicionarVista();
        //    });

        //    return false;
        //}

        return true;
    },

    //ValidaTipoModulo() {
    //    var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();

    //    if (objrowTb.tipoModuloEmergencia != "ginecobstetra" && objrowTb.tipoModuloEmergencia != "neonatal") {
    //        //alerta(2, 'No existe un módulo para evaluar en este servicio.');
    //        alerta2('warning', '', 'No existe un módulo para evaluar en este servicio.')
    //        return false;
    //    } else {
    //        if (objrowTb.tipoModuloEmergencia == "neonatal") {
    //            if (objrowTb.tipoPaciente != "Neonatologia") {
    //                //alerta(2, 'El paciente no es Neonato. No es posible realizar la evaluación.');
    //                alerta2('warning', '', 'El paciente no es Neonato. No es posible realizar la evaluación.')
    //                return false;
    //            }
    //        }
    //    }

    //    return true;
    //},

    async ValidaAbrirModulo() {
        var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();

        let antecedentes = await PermisoGeneral.SeleccionaParametros(1009)
        let examenFisico = await PermisoGeneral.SeleccionaParametros(1010)
        let examenObstetrico = await PermisoGeneral.SeleccionaParametros(1011)
        let trabajoParto = await PermisoGeneral.SeleccionaParametros(1012)

        if (antecedentes[0].valorTexto.split(',').includes(objrowTb.idServicioEgreso.toString())) {
            AdmisionHospitalizacion.esNeo = false
            await AdmisionHospitalizacion.CargarModulo('ginecobstetra');
            await EvaluacionGinecoObstetra.IniciarModulo();
            //await NotaIngreso.IniciarModulo();
        } else {
            AdmisionHospitalizacion.esNeo = true
            await AdmisionHospitalizacion.CargarModulo('neonatal');
            await EvaluacionNeonatalHosp.IniciarModulo();
        }

        BusquedaDiagnosticos.IniciarScript();
        /////////////DIAGNOSTICOS//////////////
        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
        ///////////////////////////////////////

        /////////ORDENES MEDICAS////////////////
        OrdenMedica.IniciarScript();
        ////////////////////////////////////////

        /////////RESULTADOS LABORATORIO////////////////
        Resultados.IniciarScript();
        ////////////////////////////////////////

        ConsumoServicio.IniciarScript();
        Ordenes.IniciarScript();
        Ordenes.IniciarData();

        //if (!AdmisionHospitalizacion.esNeo) {
        //    //await NotaIngreso.IniciaFormulario(1);
        //} else {
        //    await EvaluacionNeonatal.ModificarEvaluacion();
        //}

        MostrarAreaRegistro();
    },

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

    async CargarModuloClap(modulo) {
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

            $("#moduloClap").html(datos);
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            alerta(3, JSON.stringify(error));
        }
    },

    CerrarModulo() {
        $("#modulo").html("");
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /// <summary>
    /// LLENAR COMBOS
    /// </summary>
    /// Metodos que llenan combos.
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
            $(datos.lsTiposGravedad.table).each(function (i, obj) {
                $('#cboPrioridad').append('<option  value="' + obj.idTipoGravedad + '">' + obj.descripcion + '</option>');
            });
            $('#cboPrioridad').val(0);

            $('.chzn-select').chosen().trigger("chosen:updated");
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
            $(datos.lsTiposServiciosMGP.table).each(function (i, obj) {
                $('#cboTipoPaciente').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>');
            });
            $('#cboTipoPaciente').val(0);

            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarTiposPaciente() {
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
            $(datos.lsTiposServiciosMGP.table).each(function (i, obj) {
                if (obj.idServicio != 3) {
                    $('#cboTipoPaciente').append('<option  value="' + obj.idServicio + '">' + obj.descripcion + '</option>');
                }
            });
            $('#cboTipoPaciente').val(0);

            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarOrigenAtencionHospitalizacion(idTipoServicio) {
        let datos;
        var midata = new FormData();
        midata.append('idTipoServicio', idTipoServicio);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarOrigenAtencionHospitalizacion?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $('#cboOrigenPaciente').empty();
            $(datos.lsOrigenAtencionHosp.table).each(function (i, obj) {
                $('#cboOrigenPaciente').append('<option  value="' + obj.idOrigenAtencion + '">' + obj.descripcionLarga + '</option>');
            });
            $('#cboOrigenPaciente').val(0);

            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarTiposEmbarazo() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaTipoDeEmbarazo?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            $('#cboTipoEmbrazo').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboTipoEmbrazo').append('<option  value="' + obj.id + '">' + obj.nombre + '</option>');
            });

            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta(3, error);
        }
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}


//////////////FUNCIONES ADICIONALES//////////////////////
function valida_hora(valor) {
    //que no existan elementos sin escribir
    if (valor.indexOf(":") != -1) {
        var hora = valor.split(":")[0];
        if (parseInt(hora) > 23) {
            $("#HoraInicioAtencion").val("");
            alerta(2, "Hora incorrecta");

        }//end if
    }//end if
}//end function

function asigna_FechaHoraAtencion(f) {
    //('#cboFechaInicioAtencion').empty();
    // cargo por defecto la hora
    var dt = new Date();
    var time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes());
    //var date = ((dt.getDay() + 1) < 10 ? ("0" + (dt.getDay() + 1)) : (dt.getDay() + 1)) + "/" + ((dt.getMonth() + 1) < 10 ? ("0" + (dt.getMonth() + 1)) : (dt.getMonth() + 1)) + "/" + dt.getFullYear();

    if (f == null) {
        var fecha = new Date();
        var fecha2 = new Date();
    } else {
        var fecha = new Date(f);
        var fecha2 = new Date(f);
    }


    var dia = fecha.getDate();
    var mes = parseInt(fecha.getMonth()) + 1;
    var yyy = fecha.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    fechaP = yyy + "-" + mes + "-" + dia

    $('#HoraInicioAtencion').val(time);
    $('#FechaInicioAtencion').val(fechaP);
    $('#FechaInicioAtencion').attr("max", fechaP);

    //$('#cboFechaInicioAtencion').append('<option  value="' + fechaP + '">' + fechaP + '</option>');


    fecha2.setDate(fecha.getDate() - 1);
    dia = fecha2.getDate();
    mes = parseInt(fecha2.getMonth()) + 1;
    yyy = fecha2.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    fechaP = yyy + "-" + mes + "-" + dia

    $('#FechaInicioAtencion').attr("min", fechaP);
}

//////////////////////////////////////////////////////////

$(document).ready(function () {
    AdmisionHospitalizacion.Plugins();
    AdmisionHospitalizacion.CargaInicial();
    //AdmisionHospitalizacion.IniciarCombos();

    AdmisionHospitalizacion.InitDatables();
    AdmisionHospitalizacion.IniciarDataTablesInformeEvaluacion();

    AdmisionHospitalizacion.Eventos();

    AdmisionHospitalizacion.ListarServiciosAdmisionHospitalizacion();
    AdmisionHospitalizacion.ListarTiposEmbarazo()

    EstablecimientosSalud.IniciarScript();

    Ordenes.tipoServicio = 'HOSP';

    PermisoGeneral.ValidarServicioFirmaDigital();
    EvaluacionGinecoObstetra.InitDatablesEstanciaHosp();
    EvaluacionGinecoObstetra.Eventos();

    $("#cboServicioHospitalizacionBuscar").val(6);
    $('.chzn-select').chosen().trigger("chosen:updated");
});
