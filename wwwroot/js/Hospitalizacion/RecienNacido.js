//var ObjtableHospitalizadosRn;
var FechaDia;
var FechaTemp;
var idAccion;
var gemelar = [];
var medobsenf = [];
var proferesp = 0;
var accion = '';
var RegistroRN = {
    IdRegistroRn: 0,
    IdCuentaAtencion: 0,
    IdPaciente: 0,
    IdPacienteMadre: 0,
    idCuentaAtencionMadre: 0,
    IdTriajeRn: 0,
    NacidoEn: 0,
    Tabla: '',
    PacientePorMigrar: [],
    tienePermisoRegistroNacimiento: 0,



    InicializarComponentesEvaluacionRn() {
        //$('#modalRegistroRN').modal({ backdrop: 'static', keyboard: false });
        //$('#modalRegistroRN').modal('hide');

        //$('#rdbTardioNO').prop('checked', true);
        //$('#rdbLacthoraNO').prop('checked', true);

        //$(".chzn-select").chosen({ placeholder_text_single: 'Seleccione una opción', allow_single_deselect: true });
        //$(".chzn-select-deselect").chosen({ placeholder_text_single: 'Seleccione una opción', allow_single_deselect: true });

        //Cargando(0);
    },

    InitPlugin() {
        $('#txtFechaFiltro').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
        $('#txtFechaNacimiento').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
        $('#txtFechaClampaje').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaInicioRpt').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaFinRpt').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaMigrar').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaNacimientoFiliacion').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaNacimientoRegistroNacimiento').datepicker({
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
        $("#txtFechaFiltro, #txtFechaNacimiento, #txtFecNac, #txtFechaClampaje, #txtFechaInicioRpt, #txtFechaFinRpt, #txtFechaMigrar, #txtFechaNacimientoFiliacion, #txtFechaNacimientoRegistroNacimiento, #txtFUR").mask("Dd/Mm/abcd");

        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();
        //$('#txtFechaFiltro').val(FechaDia);
        $("#txtFechaFiltro").datepicker("setDate", FechaDia);

        $("#txtFechaInicioRpt").datepicker("setDate", FechaDia);
        $("#txtFechaFinRpt").datepicker("setDate", FechaDia);


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraNacimiento").mask("Hn:Nn");
        $("#txtHoraNac").mask("Hn:Nn");
        $("#txtHoraClampaje").mask("Hn:Nn");
        $("#txtHoraNacimientoFiliacion").mask("Hn:Nn");
        $("#txtHoraNacimientoRegistroNacimiento").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
    },

    InitDataTableRecienNacidos() {
        var parms = {
            "paging": false,
            //"ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            autoWidth: false,
            columns: [
                {
                    width: '5%',
                    targets: 1,
                    data: "nroCuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idRegistroRN != '') {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
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
                    width: '13%',
                    targets: 3,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (isEmpty(rowData.fecNac) || isEmpty(rowData.horaNac) || isEmpty(rowData.idDocIdentidad) || isEmpty(rowData.nroDocumento) || isEmpty(rowData.idTipoSexo)) {
                            $(td).parent().css('color', '#f19204');
                        }
                    }
                },
                {
                    width: '6%',
                    targets: 5,
                    data: "fecNac",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 6,
                    data: "sexo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 7,
                    data: "docMadre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '13%',
                    targets: 8,
                    data: "madre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 10,
                    data: "servicioEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center');

                        //if (rowData.idRegistroRN != '') {
                        if (rowData.tabla == 'S_NEONATO' || rowData.tabla == 'CEOB_REGCNV') {
                            $(td).html('<span class="chip bg-indigo" style="font-size: 11px;">SIAN</span >');
                        }

                        if (rowData.tabla == 'LIBRO_NAC') {
                            $(td).html('<span class="chip bg-indigo" style="font-size: 11px;">LIBRO NAC</span >');
                        }

                        if (rowData.tabla == 'SISGALEN') {
                            $(td).html('<span class="chip bg-indigo" style="font-size: 11px;">SISGALEN</span >');
                        }
                    }
                },
                {
                    targets: 12,
                    data: null,
                    width: "6%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        btnImprimeBrazalete = '<button type="button" class="btn btn-sm btn-unique GenerarBrazalete"><i class="fa-light fa-rectangle-barcode"></i></button>';
                        $(td).html(btnImprimeBrazalete);
                    }
                },
                {
                    targets: 13,
                    data: null,
                    width: "6%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        btnImprimeBrazalete = '<button type="button" class="btn btn-sm btn-teal GeneraFormatoFiliacionArchivoClinico"><i class="fa fi fi-ss-treatment"></i></button>';
                        $(td).html(btnImprimeBrazalete);
                    }
                },

            ]

        }

        var tableWrapper = $('#lstRnHospitalizados'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        ObjtableHospitalizadosRn = $("#lstRnHospitalizados").dataTable(parms);
    },

    InitDataTablePacientes() {
        var parms = {
            "paging": false,
            //"ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            autoWidth: false,
            columns: [
                {
                    targets: 1,
                    width: '5%',
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

                {
                    targets: 3,
                    width: '10%',
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 6,
                    width: '5%',
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
            ]
        }

        var tableWrapper = $('#tblPacientes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Pacientes = $("#tblPacientes").dataTable(parms);
    },

    InitDataTableTriajeRn() {
        var parms = {
            "paging": false,
            //"ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            autoWidth: false,
            columns: [
                {
                    targets: 1,
                    data: "idTriajeRn",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 2,
                    data: "idCuentaAtencionRn",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 3,
                    data: "nroHistoriaClinicaRn",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 4,
                    data: "nombresRn",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 5,
                    data: "fechaNacRn",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 6,
                    data: "sexoRn",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 7,
                    data: "tipoGestacion",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 8,
                    data: "fetos",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 9,
                    data: "gemelar",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 10,
                    data: "condicion",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 11,
                    data: "fechaTriaje",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TriajeRn = $("#tblTriajeRn").dataTable(parms);
    },

    InitDataTableRegistroNacimientos() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '40vh',
            autoWidth: false,
            columns: [
                {
                    targets: 1,
                    data: "idRegistroNacimiento",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 2,
                    data: "idCuentaAtencionMadre",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 3,
                    data: "nroHistoriaMadre",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 4,
                    data: "pacienteMadre",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 5,
                    data: "fechaHoraNacimientoRn",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 6,
                    data: "sexoRn",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 7,
                    data: "tipoGestacion",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 8,
                    data: "fetos",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 9,
                    data: "gemelar",
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 10,
                    data: "condicion",
                    width: "9%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    targets: 11,
                //    data: "fecha",
                //    width: "9%",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                {
                    data: null,
                    width: "8%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                        btnEliminar = '<button class="EliminarRegistroNacimiento btn btn-sm btn-danger glow_button" title="Eliminar registro" data-toggle="tooltip"><i class="fa fa-trash"></i> </button>';
                        $(td).html(btnEliminar);
                    }
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_RegistroNacimientos = $("#tblRegistroNacimientos").dataTable(parms);
    },

    InitDataTableDiagnosticosRn() {
        var parms = {
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            bFilter: false,
            responsive: true,
            columns: [
                {
                    targets: 1,
                    width: '25%',
                    data: "conjunto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 2,
                    width: '60%',
                    data: "diagnostico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 3,
                    width: '15%',
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                        $(td).html('<button class="btn btn-sm btn-danger layout_btn_prevent btnEliminarDiagnosticoRn"><i class="fa-solid fa-trash-can"></i></button>');
                    }
                },

            ]
        }

        var tableWrapper = $('#tblDiagnosticosRn'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DiagnosticosRn = $("#tblDiagnosticosRn").dataTable(parms);
    },

    InitDataTablePacientesMigrar() {
        var parms = {
            "paging": true,
            "ordering": true,
            "info": false,
            "scrollX": true,
            bFilter: false,
            responsive: true,
            columns: [
                {
                    targets: 1,
                    width: '10%',
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    data: "horaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },

                {
                    targets: 3,
                    width: '10%',
                    data: "talla",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    data: "peso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    data: "perCefalico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    data: "apgarUno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 7,
                    width: '10%',
                    data: "apgarCinco",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    targets: 8,
                    width: '10%',
                    data: "hcMadre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    argets: 9,
                    width: '10%',
                    data: "hcNeo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    argets: 10,
                    width: '10%',
                    data: "tipoParto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblPacientesMigrar'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_PacientesMigrar = $("#tblPacientesMigrar").dataTable(parms);
    },

    LlenarCombos() {
        //var idServicio = $("#idServicio").val();
        //var midata = new FormData();
        //midata.append('idTipoServicio', idServicio);
        var midata = new FormData();
        midata.append('IdTipoServicio', 0);

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposSexo?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoSexo').empty();
                $('#cboTipoSexoFiliacion').empty();
                $('#cboTipoSexoRegistroNacimiento').empty();
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboTipoSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                    $('#cboTipoSexoFiliacion').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                    $('#cboTipoSexoRegistroNacimiento').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
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
                $('#cboTipoGestacionFiliacion').empty();
                $('#cboTipoGestacionRegistroNacimiento').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoGestacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboTipoGestacionFiliacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboTipoGestacionRegistroNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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
                gemelar = datos.table;
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
            url: "/RecienNacido/ListarTiposProcedenciaRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboProcedenciaRn').empty();
                $('#cboProcedenciaFiliacion').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboProcedenciaRn').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboProcedenciaFiliacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar numeros gemelar!", "2");
                }, 900)
            }
        });


        $.ajax({
            //async: false,
            cache: false,
            //url: "/RecienNacido/ListarServiciosNacimiento?area=Hospitalizacion",
            url: "/Utilitario/ListarServicioPorTipoServicio?area=Comun",
            data: midata,
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
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

        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarRiesgosObstetricos?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboRiesgo').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboRiesgo').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar riesgo obstetrico!", "2");
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
                $('#cboCondicionRegistroNacimiento').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboCondicion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboCondicionRegistroNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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
            url: "/RecienNacido/ListarTiemposContactoPielaPiel?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTiempoContactoPiel').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTiempoContactoPiel').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar Tiempo Contacto piel a piel!", "2");
                }, 900)
            }
        });



        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarMedicosObstetrasEnfermeras?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboProfResponsable').empty();
                medobsenf = datos.table;
                /*$(datos.table).each(function (i, obj) {
                    $('#cboProfResponsable').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });*/
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar profesionales responsables!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/EvaluacionRN/ListarTipoPartoRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoParto').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoParto').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos parto!", "2");
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

        //////////////////KHOYOSI////////////////////////////////////
        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposDocumentos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoDocumento').empty();
                $('#cboTipoDocMadre').empty();
                $(datos.lsDocumentos.table).each(function (i, obj) {
                    $('#cboTipoDocumento').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
                    $('#cboTipoDocMadre').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos documentos!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposSexo?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboSexo').empty();
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
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
            url: "/Utilitario/ListaTiposEstadoCivilTodos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboEstadoCivilMadre').empty();
                $(datos.lsEstadoCivil.table).each(function (i, obj) {
                    $('#cboEstadoCivilMadre').append('<option  value="' + obj.idEstadoCivil + '">' + obj.dCorto + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos estado civil!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/TiposGradoInstruccionTodos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboGradoInstruccionMadre').empty();
                $(datos.lsGradosIns.table).each(function (i, obj) {
                    $('#cboGradoInstruccionMadre').append('<option  value="' + obj.idGradoInstruccion + '">' + obj.dCorto + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos grados instruccion!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Diagnosticos/ListarClasificacionDiagnosticos?area=Comun",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboConjuntoDiagnosticos').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboConjuntoDiagnosticos').append('<option  value="' + obj.idConjuntoDiagnostico + '">' + obj.descripcion + '</option>');
                });
                $('#cboConjuntoDiagnosticos').val("");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos grados instruccion!", "2");
                }, 900)
            }
        });

        // $.ajax({
        //     async: false,
        //     cache: false,
        //     url: "/RecienNacido/ListarServiciosIngresoRecienNacido?area=Hospitalizacion",
        //     datatype: "json",
        //     type: "get",
        //     success: function (datos) {
        //         $('#cboServicioIngresoFiliacion').empty();
        //         $(datos.table).each(function (i, obj) {
        //             $('#cboServicioIngresoFiliacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
        //         });
        //     },
        //     error: function (msg) {
        //         setTimeout(function () {
        //             alerta("ERROR", "Error listar tipos transporte!", "2");
        //         }, 900)
        //     }
        // });

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
                $('#cboServicioIngresoFiliacion').empty();
                $('#cboServicioIngresoFiliacion').append('<option value=""></option>');

                $('#cboServicioIngresoFiliacion').append('<option  value="72">CENTRO OBSTETRICO</option>');
                $('#cboServicioIngresoFiliacion').append('<option  value="88">CENTRO QUIRURGICO</option>');
                $(datos.respuesta.table).each(function (i, obj) {
                    if ((obj.idServicio >= 2 && obj.idServicio <= 6) || (obj.idServicio >= 65 && obj.idServicio <= 68)) {
                        $('#cboServicioIngresoFiliacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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


        $.ajax({
            async: false,
            cache: false,
            url: "/RecienNacido/ListarDiagnosticosIngresoRecienNacido?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboDiagnosticoIngresoFiliacion').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboDiagnosticoIngresoFiliacion').append('<option  value="' + obj.valor + '">(' + obj.codigoCIE10 + ') ' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos transporte!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Medicos/ListarMedicosTodos?area=Seguridad",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboMedicoIngresoFiliacion').empty();
                $(datos.lsResultado.table).each(function (i, obj) {
                    $('#cboMedicoIngresoFiliacion').append('<option  value="' + obj.idMedico + '">' + obj.apNom + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipos transporte!", "2");
                }, 900)
            }
        });
        //////////////////KHOYOSI////////////////////////////////////

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });
    },

    ListarPacientesRegistroRN() {
        var midata = new FormData();

        if ($("#txtFechaFiltro").val() == "" && $("#txtNroCuentaFiltro").val() == "" && $("#txtNroHistoriaFiltro").val() == "" && $("#txtDniFiltro").val() == "" &&
            $("#txtApPaternoFiltro").val() == "" && $("#txtApMaternoFiltro").val() == "" && $("#txtDniMadreFiltro").val() == "") {
            alerta2("info", "", "Por favor ingrese algun de los filtros de busqueda.");
            return false;
        }

        midata.append('FechaFiltro', isNull($("#txtFechaFiltro").val(), '1/1/0001'));
        midata.append('TipoFecha', $('input[name="rdbFechaFiltro"]:checked').val());
        midata.append('NroCuenta', $("#txtNroCuentaFiltro").val());
        midata.append('NroHistoria', $("#txtNroHistoriaFiltro").val());
        midata.append('NroDocumento', $("#txtDniFiltro").val());
        midata.append('ApPaterno', $("#txtApPaternoFiltro").val());
        midata.append('ApMaterno', $("#txtApMaternoFiltro").val());
        midata.append('NroDocumentoMadre', $("#txtDniMadreFiltro").val());
        midata.append('idGrupo', $("#idGrupo").val());

        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/RecienNacido/ListarPacientesRegistroRecienNacido?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                Cargando(0)
                ObjtableHospitalizadosRn.fnClearTable();
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtableHospitalizadosRn.fnAddData(datos.table);
                        ObjtableHospitalizadosRn.resize();
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ListarMigracionPacientesRecienNacido() {
        var midata = new FormData();

        if ($("input[name='TipoFiltroMigracion']:checked").val() == 1) {
            midata.append('TipoFiltro', 'F');
            midata.append('Filtro', $("#txtFechaMigrar").val());
        } else if ($("input[name='TipoFiltroMigracion']:checked").val() == 2) {
            midata.append('TipoFiltro', 'H');
            midata.append('Filtro', $("#txtNroHistoriaMigrar").val());
        }

        Cargando(1);
        //var dat 
        RegistroRN.PacientePorMigrar = [];
        oTable_PacientesMigrar.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/RecienNacido/ListarMigracionPacientesRecienNacido?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        oTable_PacientesMigrar.fnAddData(datos.table);
                        RegistroRN.PacientePorMigrar = datos.table;
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ListarDiagnosticoPorConjunto(idConjuntoDx) {
        var midata = new FormData();

        midata.append('idConjuntoDx', idConjuntoDx);

        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Diagnosticos/ListarDiagnosticoPorConjunto?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                console.log(datos.table);
                Cargando(0)
                $('#cboDiagnosticosRn').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboDiagnosticosRn').append('<option  value="' + obj.idDiagnostico + '">' + obj.codigoCIE10 + ' - ' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },


    Eventos() {

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscarPacientesRegistrRN").click();
            }
        });

        $('.search2').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search2").blur();
                $("#btnBuscarPacientes").click();
            }
        });

        $('.search3').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search3").blur();
                $("#btnBuscarMigracionPacientesRN").click();
            }
        });

        $('#lstRnHospitalizados tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                ObjtableHospitalizadosRn.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('input[name=rdbAtendidoPor]').on('change', function () {
            RegistroRN.FiltrarProfesionalAtendio();
        });
        $('input[name=rdbReanimacion]').on('change', function () {
            RegistroRN.Reanimacion_Change();
        });

        $('input[name=rdbPatNeo]').on('change', function () {
            RegistroRN.PatNeo_Change();
        });

        $('input[name=rdbTransporte]').on('change', function () {
            RegistroRN.Transporte_Change();
        });

        $('#cboTipoGestacion').on('change', function () {
            RegistroRN.TipoGestacion_Change();
        });

        $('#cboTipoGestacionFiliacion').on('change', function () {
            RegistroRN.TipoGestacionFiliacion_Change();
        });

        $('#cboTipoGestacionRegistroNacimiento').on('change', function () {
            RegistroRN.TipoGestacionRegistroNacimiento_Change();
        });

        $('#cboCondicion').on('change', function () {
            RegistroRN.Condicion_Change();
        });

        $('input[name=rdbTardio]').on('change', async function () {
            await RegistroRN.ClampajeTardio_Change();
        });

        // $('input[name=rdbContactoPiel]').on('change', async function () {
        //     await RegistroRN.TiempoContactoPielaPiel_Change();
        // });

        $('#cboCondicionFiliacion').on('change', function () {
            RegistroRN.CondicionFiliacion_Change();
        });

        $('#cboCondicionRegistroNacimiento').on('change', function () {
            RegistroRN.CondicionRegistroNacimiento_Change();
        });

        $('#txtNroFetos').on('keyup', function () {
            if ($('#txtNroFetos').val() < 0 || $('#txtNroFetos').val() > 10) {
                alerta(2, "El Nro Fetos no puede ser menor a 0 ni mayor a 10.");
                $('#txtNroFetos').val("");
            }
            RegistroRN.Fetos_Change();
        });

        $('#txtNroFetosFiliacion').on('keyup', function () {
            if ($('#txtNroFetosFiliacion').val() < 0 || $('#txtNroFetosFiliacion').val() > 10) {
                alerta(2, "El Nro Fetos no puede ser menor a 0 ni mayor a 10.");
                $('#txtNroFetosFiliacion').val("");
            }
            RegistroRN.FetosFiliacion_Change();
        });

        $('#txtNroFetosRegistroNacimiento').on('keyup', function () {
            if ($('#txtNroFetosRegistroNacimiento').val() < 0 || $('#txtNroFetosRegistroNacimiento').val() > 10) {
                alerta(2, "El Nro Fetos no puede ser menor a 0 ni mayor a 10.");
                $('#txtNroFetosRegistroNacimiento').val("");
            }
            RegistroRN.FetosRegistroNacimiento_Change();
        });


        $('#cboTipoReporte').on('change', function () {
            RegistroRN.TipoReporte_Change();
        });


        //////////////////BUSQUEDA PACIENTES//////////////////////
        $('#tblPacientes tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Pacientes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnBuscarPacientes').on('click', async function () {
            await RegistroRN.ListarPacientes();
        });

        $('#btnLimpiarPacientes').on('click', function () {
            RegistroRN.LimpiarBusquedaPacientes();
        });

        $('#btnAceptarPaciente').on('click', function () {
            RegistroRN.AgregarRegistroRn();
        });

        $('#btnCancelarPaciente').on('click', function () {
            RegistroRN.LimpiarBusquedaPacientes();
            $("#modalPacienteBusqueda").modal("hide");
        });

        ///////////////////////TRIAJE RECIEN NACIDOS/////////////////////
        $('#tblTriajeRn tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_TriajeRn.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnTriajeRn').on('click', async function () {
            await RegistroRN.ListarTriajeRecienNacido();
        });

        $('#btnAgregarTriajeRn').on('click', async function () {
            await RegistroRN.SeleccionarTriajeRecienNacido();
        });

        $('#btnCancelarTriajeRn').on('click', async function () {
            await RegistroRN.CerrarModalTriajeRn();
        });

        $('#modalTriajeRn').on('shown.bs.modal', function (e) {
            oTable_TriajeRn.resize();
        });

        ////////////////////DIAGNOSTICO RECIEN NACIDOS///////////////////
        $('#btnDiagnosticosRn').on('click', function () {
            $("#modalDiagnosticosRn").modal("show");

        });

        $('#modalDiagnosticosRn').on('shown.bs.modal', function (e) {
            oTable_DiagnosticosRn.resize();
        });

        $('#btnCancelarDiagnosticosRn').on('click', function () {
            $("#modalDiagnosticosRn").modal("hide");
        });

        $('#cboConjuntoDiagnosticos').on('change', function () {
            RegistroRN.ListarDiagnosticoPorConjunto($('#cboConjuntoDiagnosticos').val());
        });

        $('.rdbPartoComplicado').on('change', function () {
            if ($(".rdbPartoComplicado").is(':checked')) {
                if ($("#rdbComplicado").is(":checked")) {
                    $("#btnDiagnosticosRn").show();
                } else {
                    $("#btnDiagnosticosRn").hide();
                }
            }
        });

        $('#btnAgregarDiagnosticoRn').on('click', function () {
            if ($("#cboDiagnosticosRn").val() > 0) {
                lstDiagnosticosRn = oTable_DiagnosticosRn.api(true).rows().data();
                //if (lstDiagnosticos.length == 0) {
                //    return false;
                //}

                for (var i = 0; i < lstDiagnosticosRn.length; i++) {
                    if (lstDiagnosticosRn[i].idDiagnostico == $("#cboDiagnosticosRn").val()) {
                        alerta2('info', '', 'El diagnóstico ya existe.');
                        return false;
                    }
                }

                var objRow = {
                    idDiagnostico: $("#cboDiagnosticosRn").val(),
                    conjunto: $("#cboConjuntoDiagnosticos option:selected").text(),
                    diagnostico: $("#cboDiagnosticosRn option:selected").text(),
                }
                oTable_DiagnosticosRn.api(true).row.add(objRow).draw(false);
                oTable_DiagnosticosRn.resize();
            } else {
                alerta2("info", "", "Por favor seleccione un diagnóstico para agregar.");
            }
        });


        $('#tblDiagnosticosRn tbody').on('click', '.btnEliminarDiagnosticoRn', async function () {
            //var objrow = oTable_DiagnosticosRn.api(true).row($(this).parents("tr")).index();
            //var row = oTable_DiagnosticosRn.fnGetData(objrow);

            // oTable_DiagnosticosRn.api(true).row(row).remove().draw(false);
            oTable_DiagnosticosRn.api(true).row($(this).parents("tr")).remove().draw(false);

        });


        //////////////////LIBRO NACIMIENTOS//////////////////////
        $('#btnAgregarLibroNacimiento').on('click', function () {
            $("#modalRegistroLibroNacimiento").modal("show");
        });

        //////////////////MIGRACION DE HISTORIAS//////////////////////
        $('input[type=radio][name=TipoFiltroMigracion]').on('change', function () {
            RegistroRN.TipoFiltroMigracion_Change();
        });

        /////////////////GENERAR BRAZALETE///////////////////////
        $('#lstRnHospitalizados tbody').on('click', '.GenerarBrazalete', async function () {
            var objrow = ObjtableHospitalizadosRn.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableHospitalizadosRn.fnGetData(objrow);

            Brazalete.idPaciente = row.idPaciente;
            Brazalete.nroHistoria = row.nroHistoriaClinica;
            Brazalete.apellidos = row.apellidosRn;
            Brazalete.nombres = row.nombresRn;
            Brazalete.tipoDocumento = row.tipoDocumentoRn;
            Brazalete.nroDocumento = row.nroDocumentoRn;
            Brazalete.fechaNacimiento = row.fechaNacimientoRn;
            Brazalete.horaNacimiento = row.horaNacimientoRn;
            Brazalete.tipoSexo = row.sexoRn;
            Brazalete.gemelar = row.gemelarRn;

            await Brazalete.GenerarBrazaletePaciente();
            Brazalete.LimpiarBrazalete();

        });

        $('#GenerarBrazalete').on('click', async function () {
            //let idPaciente = $('#txtIdPaciente').val()
            await Brazalete.GenerarBrazaletePaciente();
        });


        /////////////EVENTOS CONSUMO EN EL SERVICIO//////////////////////
        //$('#tblCSAtencion tbody').on('click', 'tr', function () {

        //    if ($(this).hasClass('selected')) {
        //        $(this).removeClass('selected');
        //    }
        //    else {
        //        oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
        //        $(this).addClass('selected');
        //    }
        //});

        //$("#modalConsumoServicio").on('hidden.bs.modal', function () {
        //    var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();
        //    AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        //});

        //$('#btnEliminarCSAtencion').on('click', function () {
        //    var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
        //    //ConsumoServicio.eliminar(objrow.idCuentaAtencion)
        //    var objrowConsumoServ = oTable_consumoServAtencion.api(true).row('.selected').data();

        //    if (isEmpty(objrowConsumoServ)) {
        //        alerta(2, 'Seleccione el procedimiento que desea eliminar.');
        //        return false;
        //    }

        //    if (objrow.idEstadoAtencion == 2) {
        //        alerta('2', 'Verifique el estado de la atencion');
        //        return false;
        //    }
        //    else {
        //        if (objrowConsumoServ.idEstadoFacturacion == 1) {
        //            swal({
        //                title: 'Eliminar',
        //                text: 'Estas seguro de eliminar orden?',
        //                type: 'warning',
        //                showCancelButton: true,
        //                confirmButtonColor: '#4fb7fe',
        //                cancelButtonColor: '#EF6F6C',
        //                confirmButtonText: 'Aceptar'
        //            }).then(function () {

        //                ConsumoServicio.eliminar(objrowConsumoServ.idOrden)
        //                AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        //            }).catch(swal.noop);;
        //        }
        //        else {
        //            alerta('2', 'Esta orden no se puede eliminar, verifique el estado');
        //            return false;
        //        }
        //    }

        //});

        //$('#btnActualizaCSAtencion').on('click', function () {
        //    var objrow = oTable_atencionesEmer.api(true).row('.selected').data();
        //    AdmisionEmergencia.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        //});

        //$('#btnAgregarCSAtencion').on('click', function () {
        //    ConsumoServicio.bloqueoProcedencia();
        //    ConsumoServicio.limpiar();
        //    var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();
        //    $("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);
        //    ConsumoServicio.listaPorCuenta(objrow.idCuentaAtencion, 1); // bloquear aqui
        //    $('#modalConsumoServicio').modal('show');
        //});

        /////////////EVENTOS FILIACION RECIEN NACIDO//////////////////////////////////////////////////////
        $('#btnAbrirModalFiliacionRn').on('click', function () {
            $("#btnCambiarMadreFiliacion").hide();
            RegistroRN.LimpiarRegistroFiliacionRn();
            $("#modalFiliacionRn").modal("show");
        });

        $('#btnCerrarModalFiliacionRn').on('click', function () {
            swal({
                title: 'Cerrar',
                text: "¿Esta seguro de cerrar el registro?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    $("#btnCambiarMadreFiliacion").hide();
                    RegistroRN.LimpiarRegistroFiliacionRn();
                    $("#modalFiliacionRn").modal("hide");
                }

            }, function (dimiss) { });

        });

        $('#btnGuardarFiliacionRn').on('click', async function () {
            swal({
                title: 'Guardar',
                text: "¿Esta seguro de guardar el registro?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    let resp = await RegistroRN.GuardarFiliacionRn();
                    if (resp) {
                        let resp2 = await RegistroRN.GuardarRegistroRecienNacidoFiliacion();
                        if (resp2) {
                            RegistroRN.LimpiarRegistroFiliacionRn();
                            $("#modalFiliacionRn").modal("hide");
                            RegistroRN.ListarPacientesRegistroRN();
                        }
                    }
                }

            }, function (dimiss) { });

        });

        $('#btnBuscarMadreFiliacion').on('click', async function () {
            let resp = await RegistroRN.BuscarCuentaMadre($("#txtNroCuentaMadreFiliacion").val());
            if (!isEmpty(resp)) {
                RegistroRN.CargarDatosMadre(resp);
            }

        });

        $('.buscarMadreFiliacion').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.search').blur();
                $("#btnBuscarMadreFiliacion").click();
            }
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////

        /////////////EVENTOS PRIMER REGISTRO DE NACIMIENTO//////////////////////////////////////////////////////
        $('#btnAbrirModalRegistroNacimiento').on('click', async function () {
            $("#btnCambiarMadreRegistroNacimiento").hide();
            RegistroRN.LimpiarRegistroRegistroNacimiento();
            await RegistroRN.ListarRegistroNacimiento();
            $("#TabRegistroNacimiento").click();
            $("#modalRegistroNacimiento").modal("show");
        });

        $('#btnCerrarModalRegistroNacimiento').on('click', function () {
            swal({
                title: 'Cerrar',
                text: "¿Esta seguro de cerrar el registro?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    $("#btnCambiarMadreRegistroNacimiento").hide();
                    RegistroRN.LimpiarRegistroRegistroNacimiento();
                    $("#modalRegistroNacimiento").modal("hide");
                }

            }, function (dimiss) { });

        });

        $('#btnGuardarRegistroNacimiento').on('click', async function () {
            swal({
                title: 'Guardar',
                text: "¿Esta seguro de guardar el registro?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    let resp = await RegistroRN.GuardarRegistroNacimiento();
                    if (resp) {
                        RegistroRN.LimpiarRegistroRegistroNacimiento();
                        $("#modalRegistroNacimiento").modal("hide");
                        RegistroRN.ListarPacientesRegistroRN();
                    }
                }

            }, function (dimiss) { });

        });

        $('#btnBuscarMadreRegistroNacimiento').on('click', async function () {
            let resp = await RegistroRN.BuscarCuentaMadre($("#txtNroCuentaMadreRegistroNacimiento").val());
            if (!isEmpty(resp)) {
                RegistroRN.CargarDatosMadreRegistroNacimiento(resp);
            }
        });

        $('.buscarMadreRegistroNacimiento').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.search').blur();
                $("#btnBuscarMadreRegistroNacimiento").click();
            }
        });

        $('#tblRegistroNacimientos tbody').on('click', 'tr', function () {
            oTable_RegistroNacimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblRegistroNacimientos tbody').on('click', '.EliminarRegistroNacimiento', async function () {
            var objrow = oTable_RegistroNacimientos.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_RegistroNacimientos.fnGetData(objrow);
            //console.log(row);
            Cargando(1);
            if (isEmpty(row)) {
                alerta(2, 'Seleccione un registro por favor.');
            } else {
                swal({
                    title: 'Eliminar',
                    text: "¿Esta seguro de eliminar el registro?",
                    icon: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        let resp = await RegistroRN.EliminarRegistroNacimiento(row.idRegistroNacimiento);
                        if (resp) {
                            RegistroRN.ListarRegistroNacimiento();
                        }
                    }

                }, function (dimiss) { });
            }
            Cargando(0);
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////

        $('#lstRnHospitalizados tbody').on('click', '.GeneraFormatoFiliacionArchivoClinico', async function () {
            let objrow = ObjtableHospitalizadosRn.api(true).row($(this).parents("tr")[0]).index();
            let row = ObjtableHospitalizadosRn.fnGetData(objrow);

            await Utilitario.GenerarFormatoArchivoClinico(row.idPaciente);

        });
    },

    ////////////////////////////FILIACION RECIEN NACIDOS///////////////////////////////
    async BuscarCuentaMadre(idCuenta) {
        var respuesta;
        var resp = null;
        let datos
        var data = new FormData();

        data.append('idCuenta', idCuenta);


        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaAtencionByIdCuentaAtencion?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.lstAtenciones.table.length > 0) {
                resp = datos.lstAtenciones.table[0];
                //RegistroRN.CargarDatosMadre(resp);
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    CargarDatosMadre(datos) {
        //console.log("CANTIDA:" + datos.length);
        if (datos != null) {
            //TriajeRn.idCuentaMadre = datos.idCuentaAtencion;
            RegistroRN.idCuentaAtencionMadre = datos.idCuentaAtencion;
            $("#txtNroHistoriaMadreFiliacion").val(datos.nroHistoriaClinica);
            $("#txtNombreMadreFiliacion").val(datos.apellidoPaterno + ' ' + datos.apellidoMaterno + ' ' + datos.nombres);
            $("#txtEdadMadreFiliacion").val(datos.edad);
            $("#txtTipoDocMadreFiliacion").val(datos.dTipoDocumento);
            $("#txtNroDocMadreFiliacion").val(datos.nroDocumento);
            $("#txtEstadoCivilMadreFiliacion").val(datos.dEstadoCivil);
            $("#txtGradoInstruccionMadreFiliacion").val(datos.dGradoInstruccion);
            //TriajeRn.HabilitarRegistro();           
        } else {
            RegistroRN.idCuentaAtencionMadre = 0;
            $("#txtNroHistoriaMadreFiliacion").val("");
            $("#txtNombreMadreFiliacion").val("");
            $("#txtEdadMadreFiliacion").val("");
            $("#txtTipoDocMadreFiliacion").val("");
            $("#txtNroDocMadreFiliacion").val("");
            $("#txtEstadoCivilMadreFiliacion").val("");
            $("#txtGradoInstruccionMadreFiliacion").val("");
        }
    },

    async GuardarFiliacionRn() {
        let resp = false;

        if (RegistroRN.ValidarCamposFiliacionRn() == false) {
            return false;
        }

        //let nroRn = 0
        //if (!isEmpty($("#cboNumeroGemelar").val())) {
        //    let gemelar = $('#cboNumeroGemelar option:selected').text();
        //    if (gemelar == "PUN") {
        //        nroRn = 0;
        //    } else {
        //        nroRn = gemelar.match(/\d+/);
        //    }
        //}

        let midata = new FormData();
        midata.append("IdCuentaAtencionMadre", RegistroRN.idCuentaAtencionMadre);

        midata.append("FechaNacimiento", $("#txtFechaNacimientoFiliacion").val());
        midata.append("HoraNacimiento", $("#txtHoraNacimientoFiliacion").val());
        midata.append("IdTipoSexo", $("#cboTipoSexoFiliacion").val());
        midata.append("NroGemelar", $("#cboNumeroGemelarFiliacion").val());

        midata.append("IdServicioIngreso", $("#cboServicioIngresoFiliacion").val());
        midata.append("IdDiagnosticoIngreso", $("#cboDiagnosticoIngresoFiliacion").val());
        midata.append("IdMedicoIngreso", $("#cboMedicoIngresoFiliacion").val());
        midata.append("Procedencia", $("#cboProcedenciaFiliacion").val());

        midata.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/FiliacionPaciente/FiliacionRecienNacidoGuardar?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage + '<br><table class="table table-bordered border mx-auto" style="width: 330px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Historia</th><th class="text-sm-center">' + datos.nroHistoria + '</th></tr><tr><th class="text-sm-center" style="width: 170px;background: #c7b0de;">Nº Cuenta</th><th class="text-sm-center">' + datos.idCuentaAtencion + '</th></tr></table>');
                        RegistroRN.IdCuentaAtencion = datos.idCuentaAtencion;
                        RegistroRN.IdPaciente = datos.idPaciente;
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;

    },

    async GuardarRegistroRecienNacidoFiliacion() {
        let resp = false;
        let midata = new FormData();
        //let lstDiagnosticoRn = '[]';                           

        ////////////////////////NEONATAO/////////////////////////////////       
        midata.append("FechaNacimiento", $("#txtFechaNacimientoFiliacion").val());
        midata.append("HoraNacimiento", $("#txtHoraNacimientoFiliacion").val());
        midata.append("IdTipoSexo", $("#cboTipoSexoFiliacion").val());
        midata.append("IdTipoGestacion", $("#cboTipoGestacionFiliacion").val());
        midata.append("Fetos", $("#txtNroFetosFiliacion").val());
        midata.append("NroGemelar", $("#cboNumeroGemelarFiliacion").val());
        midata.append("idCuentaAtencionMadre", RegistroRN.idCuentaAtencionMadre);
        midata.append("idCuentaAtencion", RegistroRN.IdCuentaAtencion);
        midata.append("idPaciente", RegistroRN.IdPaciente);
        midata.append("IdServicioIngreso", $("#cboServicioIngresoFiliacion").val());
        midata.append("IdDiagnosticoIngreso", $("#cboDiagnosticoIngresoFiliacion").val());
        midata.append("IdMedicoIngreso", $("#cboMedicoIngresoFiliacion").val());
        //midata.append("idRegistroRN", RegistroRN.IdRegistroRn);
        //midata.append("idTriajeRn", RegistroRN.IdTriajeRn);
        //midata.append("nacidoEn", RegistroRN.NacidoEn);
        //midata.append("tabla", RegistroRN.Tabla);

        midata.append('idListBar', ObtenerItemListBar());

        //midata.append('lstComorbilidad', JSON.stringify(ListComorbilidad.toArray()));
        //midata.append('idAccion', idAccion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/GuardarRegistroRecienNacidoFiliacion?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        //alerta2("success", "", datos.successMessage);                        
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    ValidarCamposFiliacionRn() {
        if (RegistroRN.idCuentaAtencionMadre == 0) { alerta2("info", "", "Debe ingresar el Nº Cuenta de la madre."); $("#txtNroCuentaMadreFiliacion").focus(); return false; }
        //if (TriajeRn.idCuentaMadre == 0) { alerta2("info", "", "Debe ingresar la cuenta de la madre.");  $("#txtNroCuentaMadre").focus(); return false; }
        if (isEmpty($("#txtFechaNacimientoFiliacion").val())) { alerta2("info", "", "Debe ingresar la fecha de nacimiento."); $("#txtFechaNacimientoFiliacion").focus(); return false; }
        if (isEmpty($("#txtHoraNacimientoFiliacion").val())) { alerta2("info", "", "Debe ingresar la hora de nacimiento."); $("#txtHoraNacimientoFiliacion").focus(); return false; }
        if (isEmpty($("#cboTipoSexoFiliacion").val())) { alerta2("info", "", "Debe seleccionar el Sexo."); $("#cboTipoSexoFiliacion").focus(); $("#cboTipoSexoFiliacion_chosen").addClass("chosen-container-active"); return false; }
        if ($("#cboNumeroGemelarFiliacion").val() == '') { alerta2("info", "", "Debe seleccionar el Gemelar."); $("#cboNumeroGemelarFiliacion").focus(); $("#cboNumeroGemelarFiliacion_chosen").addClass("chosen-container-active"); return false; }
        if (isEmpty($("#cboServicioIngresoFiliacion").val())) { alerta2("info", "", "Debe seleccionar el Servicio de Ingreso."); $("#cboServicioIngresoFiliacion").focus(); $("#cboServicioIngresoFiliacion_chosen").addClass("chosen-container-active"); return false; }
        // if (isEmpty($("#cboDiagnosticoIngresoFiliacion").val())) { alerta2("info", "", "Debe seleccionar el Diagnostico de Ingreso."); $("#cboDiagnosticoIngresoFiliacion").focus(); $("#cboDiagnosticoIngresoFiliacion_chosen").addClass("chosen-container-active"); return false; }
        if (isEmpty($("#cboMedicoIngresoFiliacion").val())) { alerta2("info", "", "Debe seleccionar el Médico de Ingreso."); $("#cboMedicoIngresoFiliacion").focus(); $("#cboMedicoIngresoFiliacion_chosen").addClass("chosen-container-active"); return false; }

        return true;
    },

    LimpiarRegistroFiliacionRn() {
        RegistroRN.idCuentaAtencionMadre = 0;
        RegistroRN.IdCuentaAtencion = 0;
        RegistroRN.IdPaciente = 0;
        $(".reading").val("");
        $(".writing").val("");
        RegistroRN.TipoGestacionFiliacion_Change();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    //////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////REGISTRO DE NACIMIENTO///////////////////////////////   
    CargarDatosMadreRegistroNacimiento(datos) {
        //console.log("CANTIDA:" + datos.length);
        if (datos != null) {
            //TriajeRn.idCuentaMadre = datos.idCuentaAtencion;
            RegistroRN.idCuentaAtencionMadre = datos.idCuentaAtencion;
            $("#txtNroHistoriaMadreRegistroNacimiento").val(datos.nroHistoriaClinica);
            $("#txtNombreMadreRegistroNacimiento").val(datos.apellidoPaterno + ' ' + datos.apellidoMaterno + ' ' + datos.nombres);
            $("#txtEdadMadreRegistroNacimiento").val(datos.edad);
            $("#txtTipoDocMadreRegistroNacimiento").val(datos.dTipoDocumento);
            $("#txtNroDocMadreRegistroNacimiento").val(datos.nroDocumento);
            $("#txtEstadoCivilMadreRegistroNacimiento").val(datos.dEstadoCivil);
            $("#txtGradoInstruccionMadreRegistroNacimiento").val(datos.dGradoInstruccion);
            //TriajeRn.HabilitarRegistro();           
        } else {
            RegistroRN.idCuentaAtencionMadre = 0;
            $("#txtNroHistoriaMadreRegistroNacimiento").val("");
            $("#txtNombreMadreRegistroNacimiento").val("");
            $("#txtEdadMadreRegistroNacimiento").val("");
            $("#txtTipoDocMadreRegistroNacimiento").val("");
            $("#txtNroDocMadreRegistroNacimiento").val("");
            $("#txtEstadoCivilMadreRegistroNacimiento").val("");
            $("#txtGradoInstruccionMadreRegistroNacimiento").val("");
        }
    },

    async ListarRegistroNacimiento() {
        let resp = false;
        let midata = new FormData();
        //let lstDiagnosticoRn = '[]';                           

        ////////////////////////NEONATAO/////////////////////////////////       
        //midata.append("idRegistroNacimiento", idRegistroNacimiento);
        //midata.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            oTable_RegistroNacimientos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/ListarRegistroNacimiento?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    //datos = datos.respuesta.table[0];
                    oTable_RegistroNacimientos.fnAddData(datos.respuesta.table);
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    async GuardarRegistroNacimiento() {
        let resp = false;

        if (RegistroRN.ValidarCamposRegistroNacimiento() == false) {
            return false;
        }

        //let nroRn = 0
        //if (!isEmpty($("#cboNumeroGemelar").val())) {
        //    let gemelar = $('#cboNumeroGemelar option:selected').text();
        //    if (gemelar == "PUN") {
        //        nroRn = 0;
        //    } else {
        //        nroRn = gemelar.match(/\d+/);
        //    }
        //}

        let obito = '';
        //debugger;
        if ($("#rdbObitoRegistroNacimientoNo").is(":checked") == false && $("#rdbObitoRegistroNacimientoSiMenor").is(":checked") == false && $("#rdbObitoRegistroNacimientoSiMayor").is(":checked") == false) {
            alerta2("info", "", "Debe seleccionar el Óbito.");
        } else {
            if ($("#rdbObitoRegistroNacimientoNo").is(":checked")) { obito = 'No' } else if ($("#rdbObitoRegistroNacimientoSiMenor").is(":checked")) { obito = 'Menor' } else { obito = 'Mayor' }
        }

        let midata = new FormData();
        midata.append("idCuentaAtencionMadre", RegistroRN.idCuentaAtencionMadre);

        midata.append("FechaNacimiento", $("#txtFechaNacimientoRegistroNacimiento").val());
        midata.append("HoraNacimiento", $("#txtHoraNacimientoRegistroNacimiento").val());
        midata.append("IdTipoSexo", $("#cboTipoSexoRegistroNacimiento").val());
        midata.append("IdTipoGestacion", $("#cboTipoGestacionRegistroNacimiento").val());
        midata.append("Fetos", $("#txtNroFetosRegistroNacimiento").val());
        midata.append("NroGemelar", $("#cboNumeroGemelarRegistroNacimiento").val());
        midata.append("idCondicion", $("#cboCondicionRegistroNacimiento").val());
        midata.append("Obito", obito);

        midata.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/GuardarRegistroNacimiento?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        alerta2("success", "", datos.successMessage + '<br><table class="table table-bordered border mx-auto" style="width: 330px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Nacimiento</th><th class="text-sm-center">' + datos.idRegistroNacimiento + '</th></tr></table>');
                        RegistroRN.IdCuentaAtencion = 0;
                        RegistroRN.IdPaciente = 0;
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;

    },

    async EliminarRegistroNacimiento(idRegistroNacimiento) {
        let resp = false;
        let midata = new FormData();
        //let lstDiagnosticoRn = '[]';                           

        ////////////////////////NEONATAO/////////////////////////////////       
        midata.append("idRegistroNacimiento", idRegistroNacimiento);
        midata.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/EliminarRegistroNacimiento?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        //alerta2("success", "", datos.successMessage);                        
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    ValidarCamposRegistroNacimiento() {
        if (RegistroRN.idCuentaAtencionMadre == 0) { alerta2("info", "", "Debe ingresar el Nº Cuenta de la madre."); $("#txtNroCuentaMadreRegistroNacimiento").focus(); return false; }
        //if (TriajeRn.idCuentaMadre == 0) { alerta2("info", "", "Debe ingresar la cuenta de la madre.");  $("#txtNroCuentaMadre").focus(); return false; }
        if (isEmpty($("#txtFechaNacimientoRegistroNacimiento").val())) { alerta2("info", "", "Debe ingresar la fecha de nacimiento."); $("#txtFechaNacimientoRegistroNacimiento").focus(); return false; }
        if (isEmpty($("#txtHoraNacimientoRegistroNacimiento").val())) { alerta2("info", "", "Debe ingresar la hora de nacimiento."); $("#txtHoraNacimientoRegistroNacimiento").focus(); return false; }
        if (isEmpty($("#cboTipoSexoRegistroNacimiento").val())) { alerta2("info", "", "Debe seleccionar el Sexo."); $("#cboTipoSexoRegistroNacimiento").focus(); $("#cboTipoSexoRegistroNacimiento_chosen").addClass("chosen-container-active"); return false; }
        if ($("#cboNumeroGemelarRegistroNacimiento").val() == '') { alerta2("info", "", "Debe seleccionar el Gemelar."); $("#cboNumeroGemelarRegistroNacimiento").focus(); $("#cboNumeroGemelarRegistroNacimiento_chosen").addClass("chosen-container-active"); return false; }

        return true;
    },

    LimpiarRegistroRegistroNacimiento() {
        RegistroRN.idCuentaAtencionMadre = 0;
        RegistroRN.IdCuentaAtencion = 0;
        RegistroRN.IdPaciente = 0;
        $(".reading").val("");
        $(".writing").val("");
        RegistroRN.TipoGestacionRegistroNacimiento_Change();
        RegistroRN.CondicionRegistroNacimiento_Change();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    //////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////BUSCAQUEDA PACIENTE////////////////////////////////
    async ListarPacientes() {

        var formData = new FormData
        var respuesta;
        let datos

        if ($("#txtApPaternoBusq").val() != '' || $("#txtApMaternoBusq").val() != '' || $("#txtNroDniBusq").val() != '' || $("#txtNroHistoriaBusq").val() != '') {

            oTable_Pacientes.fnClearTable();

            formData.append("ApellidoPaterno", $("#txtApPaternoBusq").val());
            formData.append("ApellidoMaterno", $("#txtApMaternoBusq").val());
            formData.append("NroDocumento", $("#txtNroDniBusq").val());
            formData.append("NroHistoriaClinica", $("#txtNroHistoriaBusq").val());

            try {
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Paciente/ListaPacientes?area=Comun",
                        //contentType: "application/json; charset=utf-8",
                        data: formData,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });
                Cargando(0);
                if (datos.session) {
                    if (datos.lsPacientes.table.length > 0) {
                        oTable_Pacientes.fnAddData(datos.lsPacientes.table);
                    }
                }
            } catch (error) {
                //console.error(error)
                alerta(3, error);
            }
        } else {
            alerta(2, "Ingrese alguno de los campos para realizar la busqueda de pacientes.")
            return false;
        }

        return true;
    },

    LimpiarBusquedaPacientes() {
        $(".search2").val("");
        oTable_Pacientes.fnClearTable();
    },

    //////////FUNCION CONSUMO SERVICIO BUSQUEDA CPT/////////////////////////////////
    //BuscaAtencionesCptCEparaFormatoHIS(idCuentaAtencion) { // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
    //    var midata = new FormData();
    //    midata.append('idCuentaAtencion', idCuentaAtencion);
    //    Cargando(1)
    //    oTable_consumoServAtencion.fnClearTable();
    //    $.ajax({
    //        method: "POST",
    //        url: "/ConsumoServicio/BuscaAtencionesCptCEparaFormatoHIS?area=Facturacion",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        success: function (datos) {
    //            Cargando(0)
    //            if (datos.session) {
    //                if (datos.listaCpt.table.length !== 0) {

    //                    oTable_consumoServAtencion.fnAddData(datos.listaCpt.table);
    //                }
    //            }
    //            else {
    //                location.reload();
    //            }
    //        },
    //        error: function (msg) {
    //            alerta(3, "Error al listar Cpt");
    //            Cargando(0)
    //        }
    //    });

    //    oTable_consumoServAtencion.resize();

    //},

    ////////////////////////////SELECCIONAR//////////////////////////////////
    async SeleccionarRegistroRN(idCuentaAtencion, idRegistroRn, tabla) {
        //Cargando(1);
        var resp = false;
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        midata.append('idRegistroRn', idRegistroRn);
        midata.append('tabla', tabla);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/SeleccionarRegistroRN?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.table.length > 0) {
                if (accion == 'M') {
                    RegistroRN.EjecutarAccion();
                }

                //console.log(datos.table[0]);
                //$("#hdnIdRegistroRN").val(idRegistroRn);
                //$("#hdnIdCuentaAtencion").val(idCuentaAtencion);
                //$("#hdnTablaRN").val(tabla);
                RegistroRN.IdRegistroRn = idRegistroRn;
                RegistroRN.IdCuentaAtencion = idCuentaAtencion;
                RegistroRN.Tabla = tabla;
                if (datos.table[0].idTriajeRn > 0) {
                    $("#btnTriajeRn").hide();
                } else {
                    $("#btnTriajeRn").show();
                }

                $("#txtFechaNacimiento").datepicker("setDate", datos.table[0].fechaNacimiento);
                $("#txtHoraNacimiento").val(datos.table[0].horaNacimiento);
                $("#cboTipoSexo").val(datos.table[0].idTipoSexo);

                //$("#txtFechaClampaje").datepicker("setDate", datos.table[0].fechaClampaje);
                //$("#txtHoraClampaje").val(datos.table[0].horaClampaje);
                $("#cboTipoGestacion").val(datos.table[0].idTipoGestacion);
                $("#cboTipoGestacion").trigger("chosen:updated");
                RegistroRN.TipoGestacion_Change();
                $("#txtNroFetos").val(datos.table[0].fetos);
                RegistroRN.Fetos_Change();
                $("#cboNumeroGemelar").val(datos.table[0].nroGemelar);
                $("#cboNumeroGemelar").trigger("chosen:updated");
                $("#cboCondicion").val(datos.table[0].idCondicion);
                $("#cboCondicion").trigger("chosen:updated");
                RegistroRN.Condicion_Change();
                if (datos.table[0].obito == "No") {
                    $('#rdbObitoNo').prop('checked', true);
                } else if (datos.table[0].obito == "Menor") {
                    $('#rdbObitoSiMenor').prop('checked', true);
                } else if (datos.table[0].obito == "Mayor") {
                    $('#rdbObitoSiMayor').prop('checked', true);
                }

                $("#txtEdadGestacional").val(datos.table[0].edadGes);
                $("#txtPeso").val(datos.table[0].peso);
                $("#txtTalla").val(datos.table[0].talla);
                $("#txtPerCefalico").val(datos.table[0].perimetroCefalico);
                $("#txtPerToracico").val(datos.table[0].perimetroToracico);

                $("#txtFUR").datepicker("setDate", datos.table[0].fur);

                if (datos.table[0].idServicioNacimiento > 0) {
                    $("#cboServicioNacimiento").val(datos.table[0].idServicioNacimiento);
                } else {
                    $("#cboServicioNacimiento").val("");
                }
                $("#cboServicioNacimiento").trigger("chosen:updated");
                if (datos.table[0].idOtraProcedencia == null || datos.table[0].idOtraProcedencia == '') {
                    $("#cboProcedenciaRn").val(1);
                } else {
                    $("#cboProcedenciaRn").val(datos.table[0].idOtraProcedencia);
                }
                $("#cboProcedenciaRn").trigger("chosen:updated");
                if (datos.table[0].inmediato == true) {
                    $('#rdbInmediatoSi').prop('checked', true);
                } else if (datos.table[0].inmediato == false) {
                    $('#rdbInmediatoNO').prop('checked', true);
                }



                if (datos.table[0].clampadoTardio == true) {
                    $('#rdbTardioSi').prop('checked', true);
                } else if (datos.table[0].clampadoTardio == false) {
                    $('#rdbTardioNO').prop('checked', true);
                }
                await RegistroRN.ClampajeTardio_Change();

                $("#cboTiempoClampaje").val(datos.table[0].idTiempoClampaje);
                $("#cboTiempoClampaje").trigger("chosen:updated");


                $("#txtMinuto").val(datos.table[0].alMinuto);
                $("#txt5Minuto").val(datos.table[0].alos5Minutos);
                $("#txt10Minuto").val(datos.table[0].alos10Minutos);
                $("#txt15Minuto").val(datos.table[0].alos15Minutos);
                $("#txt20Minuto").val(datos.table[0].alos20Minutos);

                if (datos.table[0].reanimacion == true) {
                    $('#rdbReanimacionSi').prop('checked', true);
                } else if (datos.table[0].reanimacion == false) {
                    $('#rdbReanimacionNO').prop('checked', true);
                }
                RegistroRN.Reanimacion_Change();
                $("#cboTipoReanimacionRn").val(datos.table[0].idTipoReanimacion);
                $("#cboTipoReanimacionRn").trigger("chosen:updated");

                if (datos.table[0].patologiaNeonatal == true) {
                    $('#rdbPatNeoSi').prop('checked', true);
                } else if (datos.table[0].patologiaNeonatal == false) {
                    $('#rdbPatNeoNo').prop('checked', true);
                }
                RegistroRN.PatNeo_Change();
                $("#txtEspecificar").val(datos.table[0].especificar);


                if (datos.table[0].transporte == true) {
                    $('#rdbTransporteSi').prop('checked', true);
                } else if (datos.table[0].transporte == false) {
                    $('#rdbTransporteNO').prop('checked', true);
                }
                RegistroRN.Transporte_Change();
                $("#cboTipoTransporteRn").val(datos.table[0].idTipoTransporte);
                $("#cboTipoTransporteRn").trigger("chosen:updated");

                //$("#txtTiempoHosp").val(datos.table[0].tiempoHosp);
                if (datos.table[0].embarazo == "N") {
                    $('#rdbEmbarazoN').prop('checked', true);
                } else if (datos.table[0].embarazo == "C") {
                    $('#rdbEmbarazoC').prop('checked', true);
                }
                $("#txtPatGest").val(datos.table[0].patologiaGest);
                $("#txtNroEmbarazo").val(datos.table[0].nroEmbarazo);
                if (datos.table[0].attPrenatal == true) {
                    $('#rdbAtPreNatalSi').prop('checked', true);
                } else if (datos.table[0].attPrenatal == false) {
                    $('#rdbAtPreNatalNo').prop('checked', true);
                }
                $("#txtNroAPN").val(datos.table[0].nroApn);
                $("#txtLugarAPN").val(datos.table[0].lugarApn);
                $("#txtGestas").val(datos.table[0].gesta);
                //$("#txtParidad").val(datos.table[0].paridad);
                $("#txtParidad1").val(datos.table[0].paridad1);
                $("#txtParidad2").val(datos.table[0].paridad2);
                $("#txtParidad3").val(datos.table[0].paridad3);
                $("#txtParidad4").val(datos.table[0].paridad4);
                if (datos.table[0].atendidoPor == "M") {
                    $('#rdbAtendidoPorMed').prop('checked', true);
                } else if (datos.table[0].atendidoPor == "O") {
                    $('#rdbAtendidoPorObs').prop('checked', true);
                } else if (datos.table[0].atendidoPor == "X") {
                    $('#rdbAtendidoPorOtro').prop('checked', true);
                }
                proferesp = datos.table[0].idMedico;
                RegistroRN.FiltrarProfesionalAtendio();
                $("#cboProfResponsable").val(datos.table[0].idMedico);
                $("#cboProfResponsable").trigger("chosen:updated");
                $("#txtProfResponsable").val(datos.table[0].responsableAtencion);
                $("#cboTipoParto").val(datos.table[0].idTipoParto);
                $("#cboTipoParto").trigger("chosen:updated");
                $("#cboRiesgo").val(datos.table[0].idRiesgo);
                $("#cboRiesgo").trigger("chosen:updated");

                if (datos.table[0].pielaPiel > 0) {
                    $("#frmContactoPielaPiel_V1").show();
                    $("#cboContactoPiel").val(datos.table[0].pielaPiel);
                    $("#cboContactoPiel").trigger("chosen:updated");
                } else {
                    $("#frmContactoPielaPiel_V2").show();
                    if (datos.table[0].contactoPielaPiel == 1) {
                        $('#rdbContactoPielSi').prop('checked', true);
                    } else if (datos.table[0].contactoPielaPiel == 0) {
                        $('#rdbContactoPielNo').prop('checked', true);
                    }
                    await RegistroRN.TiempoContactoPielaPiel_Change();

                    $("#cboTiempoContactoPiel").val(datos.table[0].idTiempoContactoPielaPiel);
                    $("#cboTiempoContactoPiel").trigger("chosen:updated");

                    if (datos.table[0].efectividadContactoPielaPiel == 1) {
                        $('#rdbEfectividadContactoPielSi').prop('checked', true);
                    } else if (datos.table[0].efectividadContactoPielaPiel == 0) {
                        $('#rdbEfectividadContactoPielNo').prop('checked', true);
                    }
                }

                if (datos.table[0].parto == true) {
                    $('#rdbEutocito').prop('checked', true);
                } else if (datos.table[0].parto == false) {
                    $('#rdbComplicado').prop('checked', true);
                }
                RegistroRN.ListarDiagnosticosRecienNacidos(RegistroRN.IdRegistroRn);
                $('.rdbPartoComplicado').change();

                $("#txtComplicaciones").val(datos.table[0].complicacionParto);
                if (datos.table[0].posicionParto == "H") {
                    $('#rdbTipoPartoH').prop('checked', true);
                } else if (datos.table[0].posicionParto == "V") {
                    $('#rdbTipoPartoV').prop('checked', true);
                }
                //if (datos.table[0].clampadoTardio == true) {
                //    $('#rdbTardioSi').prop('checked', true);
                //} else if (datos.table[0].clampadoTardio == false) {
                //    $('#rdbTardioNO').prop('checked', true);
                //}
                if (datos.table[0].lactancia1raHora == true) {
                    $('#rdbLacthoraSi').prop('checked', true);
                } else if (datos.table[0].lactancia1raHora == false) {
                    $('#rdbLacthoraNO').prop('checked', true);
                }
                $("#txtTiempoLactancia").val(datos.table[0].tiempoLactancia);

                $("#chkConAcompaniante").prop('checked', datos.table[0].conAcompaniante);
                $("#chkConAnalgesia").prop('checked', datos.table[0].conAnaglgesia);
                $("#chkTrasladoConjunto").prop('checked', datos.table[0].trasladoConjunto);

                //$("#txtObservacion").val(datos.table[0].observaciones);
                //$("#txtNroGemelar").val(datos.table[0].nroGemelar);
                //console.log("HOla1");
                //midata.append("", posicion);

                if (accion == 'C') {
                    RegistroRN.EjecutarAccion();
                }

                resp = true;
            }
            else {
                resp = false;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;

    },

    async SeleccionarRegistroRNporHistoria(nroHistoria) {
        resp = false;
        var midata = new FormData();
        midata.append('nroHistoria', nroHistoria);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/SeleccionarRegistroRNporHistoria?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos.table)) {
                if (datos.table.length > 0) {
                    alerta2('warning', '', 'El paciente que intenta agregar ya cuenta con un registro de nacimiento.');
                    resp = true;
                }
            } else {
                resp = false;
            }
        } catch (error) {
            alerta2('danger', '', error);
        }

        return resp;
    },

    async VerificarNacimientoRegistroRN(idPaciente) {
        resp = null;
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/VerificarNacimientoRegistroRN?area=Hospitalizacion",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos.table)) {
                if (datos.table.length > 0) {
                    resp = datos.table[0];
                }
            } else {
                resp = null;
            }
        } catch (error) {
            alerta2('danger', '', error);
        }

        return resp;
    },

    async ListarDiagnosticosRecienNacidos(idRecienNacido) {

        var formData = new FormData
        var respuesta;
        let datos

        formData.append('idRecienNacido', idRecienNacido);

        try {
            Cargando(1);
            oTable_DiagnosticosRn.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/ListarRecienNacidosDiagnosticos?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.table.length > 0) {
                oTable_DiagnosticosRn.fnAddData(datos.table);
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return true;
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////VALIDAR CAMPOS/////////////////////////////////////////////
    ValidarCampos() {

        if (isEmpty($("#txtFecNac").val())) { alerta(2, "Debe ingresar la Fecha Nacimiento."); $("#txtFecNac").focus(); return false; }
        if (isEmpty($("#txtHoraNac").val())) { alerta(2, "Debe ingresar la Hora Nacimiento."); $("#txtHoraNac").focus(); return false; }
        if (isEmpty($("#txtNroHijo").val())) { alerta(2, "Debe ingresar el N° Orden Hijo"); $("#txtNroHijo").focus(); return false; }
        if (isEmpty($("#cboTipoDocumento").val())) { alerta(2, "Debe seleccionar el Tipo de Documento."); $("#cboTipoDocumento").focus(); $("#cboTipoDocumento_chosen").addClass("chosen-container-active"); return false; }
        if (isEmpty($("#txtNroDocumento").val())) { alerta(2, "Debe ingresar el Nº Documento."); $("#txtNroDocumento").focus(); return false; }
        if (isEmpty($("#cboSexo").val())) { alerta(2, "Debe seleccionar el Tipo Sexo."); $("#cboSexo").focus(); $("#cboSexo_chosen").addClass("chosen-container-active"); return false; }

        if ($(".rdbEmbarazo").is(':checked') == false) { alerta(2, "Debe seleccionar el Embarazo."); $('#atencion-tab-link').trigger('click'); $("#rdbEmbarazoN").focus(); return false; }
        //if ($("#txtPatGest").val() == '') { alerta(2, "Debe ingresar las Patología(s) durante la Gestión"); $('#atencion-tab-link').trigger('click'); $("#txtPatGest").focus(); return false; }
        if ($("#txtNroEmbarazo").val() == '') { alerta(2, "Debe ingresar Número de Embarazo"); $('#atencion-tab-link').trigger('click'); $("#txtNroEmbarazo").focus(); return false; } else if ($('#txtNroEmbarazo').val() < 1 || $('#txtNroEmbarazo').val() > 20) { alerta(2, "El Nro Embarazo no puede ser menor a 1 ni mayor a 20."); $('#txtNroEmbarazo').val(""); $('#atencion-tab-link').trigger('click'); $('#txtNroEmbarazo').focus(); return false; }
        if ($(".rdbAtPreNatal").is(':checked') == false) { alerta(2, "Debe seleccionar la Atención Prenatal."); $('#atencion-tab-link').trigger('click'); $("#rdbAtPreNatalSi").focus(); return false; }
        if ($("#txtNroAPN").val() == '') { alerta(2, "Debe ingresar Número de APN"); $('#atencion-tab-link').trigger('click'); $("#txtNroAPN").focus(); return false; } else if ($('#txtNroAPN').val() < 0) { alerta(2, 'El Nro APN no puede ser menor a 0'); $('#txtNroAPN').val(""); $('#atencion-tab-link').trigger('click'); $('#txtNroAPN').focus(); return false; }
        if ($("#txtGestas").val() == '') { alerta(2, "Debe ingresar las Gestas."); $('#atencion-tab-link').trigger('click'); $("#txtGestas").focus(); return false; } else if ($('#txtGestas').val() < 1 || $('#txtGestas').val() > 15) { alerta(2, "La Gesta no puede ser menor a 1 ni mayor a 15."); $('#txtGestas').val(""); $('#atencion-tab-link').trigger('click'); $('#txtGestas').focus(); return false; }
        if ($("#txtParidad1").val() == '') { alerta(2, "Debe ingresar la Paridad 1."); $('#atencion-tab-link').trigger('click'); $("#txtParidad1").focus(); return false; } else if ($('#txtParidad1').val() < 0 || $('#txtParidad1').val() > 15) { alerta(2, "La Paridad 1 no puede ser menor a 0 ni mayor a 15."); $('#txtParidad1').val(""); $('#atencion-tab-link').trigger('click'); $('#txtParidad1').focus(); return false; }
        if ($("#txtParidad2").val() == '') { alerta(2, "Debe ingresar la Paridad 2."); $('#atencion-tab-link').trigger('click'); $("#txtParidad2").focus(); return false; } else if ($('#txtParidad2').val() < 0 || $('#txtParidad2').val() > 15) { alerta(2, "La Paridad 2 no puede ser menor a 0 ni mayor a 15."); $('#txtParidad2').val(""); $('#atencion-tab-link').trigger('click'); $('#txtParidad2').focus(); return false; }
        if ($("#txtParidad3").val() == '') { alerta(2, "Debe ingresar la Paridad 3."); $('#atencion-tab-link').trigger('click'); $("#txtParidad3").focus(); return false; } else if ($('#txtParidad3').val() < 0 || $('#txtParidad3').val() > 15) { alerta(2, "La Paridad 3 no puede ser menor a 0 ni mayor a 15."); $('#txtParidad3').val(""); $('#atencion-tab-link').trigger('click'); $('#txtParidad3').focus(); return false; }
        if ($("#txtParidad4").val() == '') { alerta(2, "Debe ingresar la Paridad 4."); $('#atencion-tab-link').trigger('click'); $("#txtParidad4").focus(); return false; } else if ($('#txtParidad4').val() < 0 || $('#txtParidad4').val() > 15) { alerta(2, "La Paridad 4 no puede ser menor a 0 ni mayor a 15."); $('#txtParidad4').val(""); $('#atencion-tab-link').trigger('click'); $('#txtParidad4').focus(); return false; }
        if ($(".rdbAtendidoPor").is(':checked') == false) { alerta(2, "Debe seleccionar el Atendido Por."); $('#atencion-tab-link').trigger('click'); $("#rdbAtendidoPorMed").focus(); return false; }
        if ($("#cboTipoParto").val() == null) { alerta(2, "Debe seleccionar el Tipo de Parto."); $('#atencion-tab-link').trigger('click'); $("#cboTipoParto").focus(); $("#cboTipoParto_chosen").addClass("chosen-container-active"); return false; }
        if ($(".rdbPartoComplicado").is(':checked') == false) { alerta(2, "Debe seleccionar la Complicación del Parto."); $('#atencion-tab-link').trigger('click'); $("#rdbComplicado").focus(); return false; }
        if ($(".rdbTipoParto").is(':checked') == false) { alerta(2, "Debe seleccionar la Posición del Parto."); $('#atencion-tab-link').trigger('click'); $("#rdbTipoPartoH").focus(); return false; }


        if ($("#cboTipoGestacion").val() == null) { alerta(2, "Debe seleccionar el Tipo Gestación."); $('#nacimiento-tab-link').trigger('click'); $("#cboTipoGestacion").focus(); $("#cboTipoGestacion_chosen").addClass("chosen-container-active"); return false; }
        if ($("#txtNroFetos").val() == '') { alerta(2, "Debe ingresar el Nro Fetos."); $('#nacimiento-tab-link').trigger('click'); $("#txtNroFetos").focus(); return false; }
        if ($("#cboNumeroGemelar").val() == null) { alerta(2, "Debe seleccionar el Gemelar."); $('#nacimiento-tab-link').trigger('click'); $("#cboNumeroGemelar").focus(); $("#cboNumeroGemelar_chosen").addClass("chosen-container-active"); return false; }
        //if ($("#cboRiesgo").val() == null) { alerta(2, "Debe seleccionar el Riesgo."); $('#nacimiento-tab-link').trigger('click'); $("#cboRiesgo").focus(); $("#cboRiesgo_chosen").addClass("chosen-container-active"); return false; }
        if ($("#cboCondicion").val() == null) { alerta(2, "Debe seleccionar la Condición."); $('#nacimiento-tab-link').trigger('click'); $("#cboCondicion").focus(); $("#cboCondicion_chosen").addClass("chosen-container-active"); return false; }
        if ($(".rdbObito").is(':checked') == false) { alerta(2, "Debe seleccionar el Óbito."); $('#nacimiento-tab-link').trigger('click'); $("#rdbObitoNo").focus(); return false; }

        //if ($("#txtPeso").val() == '') { alerta(2, "Debe ingresar el Peso."); $('#nacimiento-tab-link').trigger('click'); $("#txtPeso").focus(); return false; } else if ($('#txtPeso').val() < 100 || $('#txtPeso').val() > 6000) { alerta(2, "El Peso no puede ser menor a 100gr ni mayor a 6000gr."); $('#txtPeso').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtPeso').focus(); return false; }
        //if ($("#txtTalla").val() == '') { alerta(2, "Debe ingresar la Talla."); $('#nacimiento-tab-link').trigger('click'); $("#txtTalla").focus(); return false; } else if ($('#txtTalla').val() < 13 || $('#txtTalla').val() > 60) { alerta(2, "La talla no puede ser menor a 13cm ni mayor a 60cm."); $('#txtTalla').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtTalla').focus(); return false; }
        //if ($("#txtPerCefalico").val() == '') { alerta(2, "Debe ingresar el perimetro Cefálico."); $('#nacimiento-tab-link').trigger('click'); $("#txtPerCefalico").focus(); return false; } else if ($('#txtPerCefalico').val() < 14 || $('#txtPerCefalico').val() > 40) { alerta(2, "El Perimetro Cefálico no puede ser menor a 14cm ni mayor a 40cm."); $('#txtPerCefalico').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtPerCefalico').focus(); return false; }
        //if ($("#txtPerToracico").val() == '') { alerta(2, "Debe ingresar el perimetro Torácico."); $('#nacimiento-tab-link').trigger('click'); $("#txtPerToracico").focus(); return false; } else if ($('#txtPerToracico').val() < 15 || $('#txtPerToracico').val() > 45) { alerta(2, "El Perimetro Toráxio no puede ser menor a 15cm ni mayor a 45cm."); $('#txtPerToracico').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtPerToracico').focus(); return false; }
        if ($("#txtEdadGestacional").val() == '') { alerta(2, "Debe ingresar la Edad Gestacional."); $('#nacimiento-tab-link').trigger('click'); $("#txtEdadGestacional").focus(); return false; } else if ($('#txtEdadGestacional').val() < 17 || $('#txtEdadGestacional').val() > 42) { alerta(2, "La Edad Gestacional no puede ser menor a 17 ni mayor a 42."); $('#txtEdadGestacional').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtEdadGestacional').focus(); return false; }
        if ($("#cboServicioNacimiento").val() == null) { alerta(2, "Debe seleccionar el Servicio de Nacimiento."); $('#nacimiento-tab-link').trigger('click'); $("#cboServicioNacimiento").focus(); $("#cboServicioNacimiento_chosen").addClass("chosen-container-active"); return false; }
        if ($("#cboProcedenciaRn").val() == null) { alerta(2, "Debe seleccionar la Otra Procedencia."); $('#nacimiento-tab-link').trigger('click'); $("#cboProcedenciaRn").focus(); $("#cboProcedenciaRn_chosen").addClass("chosen-container-active"); return false; }
        //if ($(".rdbInmediato").is(':checked') == false) { alerta(2, "Debe seleccionar el Inmediato."); $('#nacimiento-tab-link').trigger('click'); $("#rdbInmediatoSi").focus(); return false; }
        if ($("#txtMinuto").val() == '') { alerta(2, "Debe ingresar Apgar al Minuto."); $('#nacimiento-tab-link').trigger('click'); $("#txtMinuto").focus(); return false; } else if ($('#txtMinuto').val() < 0 || $('#txtMinuto').val() > 10) { alerta(2, "El Apgar 1 min no puede ser menor a 0 ni mayor a 10."); $('#txtMinuto').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txtMinuto').focus(); return false; }
        if ($("#txt5Minuto").val() == '') { alerta(2, "Debe ingresar Apgar a los 5 min."); $('#nacimiento-tab-link').trigger('click'); $("#txt5Minuto").focus(); return false; } else if ($('#txt5Minuto').val() < 0 || $('#txt5Minuto').val() > 10) { alerta(2, "El Apgar 5 min no puede ser menor a 0 ni mayor a 10."); $('#txt5Minuto').val(""); $('#nacimiento-tab-link').trigger('click'); $('#txt5Minuto').focus(); return false; }
        //if ($(".rdbReanimacion").is(':checked') == false) { alerta(2, "Debe seleccionar la Reanimación."); $('#nacimiento-tab-link').trigger('click'); $("#rdbReanimacionSi").focus(); return false; }
        if ($(".rdbPatNeo").is(':checked') == false) { alerta(2, "Debe seleccionar la Patología Neonatal."); $('#nacimiento-tab-link').trigger('click'); $("#rdbPatNeoSi").focus(); return false; }
        if ($("#rdbPatNeoSi").is(":checked") && $("#txtEspecificar").val() == '') { alerta(2, "Debe ingresar el Especificar"); $('#nacimiento-tab-link').trigger('click'); $("#txtEspecificar").focus(); return false; }
        //if ($("#txtTiempoHosp").val() == '') { alerta(2, "Debe ingresar el Tiempo de Hospitalización"); $('#nacimiento-tab-link').trigger('click'); $("#txtTiempoHosp").focus(); return false; }


        //if ($("#cboContactoPiel").val() == null) { alerta(2, "Debe seleccionar el Contacto Piel a Piel."); $('#atencion-tab-link').trigger('click'); $("#cboContactoPiel").focus(); $("#cboContactoPiel_chosen").addClass("chosen-container-active"); return false; }

        //if ($(".rdbTardio").is(':checked') == false) { alerta(2, "Debe seleccionar el Clamp Tardio."); $('#atencion-tab-link').trigger('click'); $("#rdbTardioSi").focus(); return false; }
        //if ($(".rdbLacthora").is(':checked') == false) { alerta(2, "Debe seleccionar la Lact. 1era Hora."); $('#atencion-tab-link').trigger('click'); $("#rdbLacthoraSi").focus(); return false; }

        //if ($("#txtNroGemelar").val() == -1) { alerta(2, "Debe ingresar el nro gemelar."); $("#txtNroGemelar").focus(); return false; }

        //if ($("#cboTipoAtencion").val() == -1) { alerta(2, "Debe seleccionar el tipo de parto."); $("#cboTipoAtencion").focus(); return false; }

        return true;
    },
    ////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////GENERAR PARTE DIARIO/////////////////////////////////////////////////
    async GenerarParteDiario(idCuenta, fecha) {
        Cargando(1);
        var formData = new FormData
        var respuesta;
        let datos
        try {
            formData.append('idCuenta', idCuenta);
            formData.append('fechaInicio', fecha);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/RecienNacido/GenerarParteDiario?area=Emergencia",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos) {
                alerta(1, 'La Hparte diario se creo correctamente.');
            } else {
                alerta(3, 'Hubo un error durante la creación del parte diario.');
            }
        } catch (error) {
            //console.error(error)
            alerta(3, error);
        }

        return datos;
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////

    EjecutarAccion() {
        if (accion == 'M') {
            HabilitarCampos();
            if ($('#cboTipoGestacion').val() == 1) {
                $("#txtNroFetos").attr('disabled', true);
                $("#cboNumeroGemelar").attr('disabled', true);
            }
            if ($("#rdbPatNeoNo").is(":checked")) {
                $("#txtEspecificar").attr('disabled', true);
            }
            //RegistroRN.PatNeo_Change();
            RegistroRN.Condicion_Change();
        } else if (accion == 'C') {
            DeshabilitarCampos();
        }
        $('.chzn-select').chosen().trigger("chosen:updated");

        //$('#modalRegistroRN').modal('show');
        MostrarAreaRegistro();
    },

    FiltrarProfesionalAtendio() {
        var tipo = '';
        var resp = 0;
        if ($("#rdbAtendidoPorMed").is(":checked")) { tipo = '1' } else if ($("#rdbAtendidoPorObs").is(":checked")) { tipo = '5' } else if ($("#rdbAtendidoPorOtro").is(":checked")) { tipo = '6' }
        $('#cboProfResponsable').empty();
        //console.log(medobsenf);
        if (tipo == '6') {
            $('#profesionalResponsableCombo').hide();
            $('#profesionalResponsableTexto').show();
        } else {
            $('#profesionalResponsableCombo').show();
            $('#profesionalResponsableTexto').hide();
            $(medobsenf).each(function (i, obj) {
                //console.log(obj.descripcion);
                if (obj.tipo == tipo && obj.esActivo == 1) {
                    if (obj.valor == proferesp) {
                        resp = obj.valor;
                    }
                    $('#cboProfResponsable').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
        }

        $("#cboProfResponsable").val(resp);
        $("#cboProfResponsable").trigger("chosen:updated");
        //$('.chzn-select').chosen().trigger("chosen:updated");
    },

    PatNeo_Change() {
        if ($("#rdbPatNeoSi").is(":checked")) {
            $("#txtEspecificar").val("");
            $("#txtEspecificar").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbPatNeoNo").is(":checked")) {
            $("#txtEspecificar").val("");
            $("#txtEspecificar").attr('disabled', true);
        } else {
            $("#txtEspecificar").val("");
            $("#txtEspecificar").attr('disabled', true);
        }
    },

    Reanimacion_Change() {
        if ($("#rdbReanimacionSi").is(":checked")) {
            $("#cboTipoReanimacionRn").val("");
            $("#cboTipoReanimacionRn").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbReanimacionNO").is(":checked")) {
            $("#cboTipoReanimacionRn").val("");
            $("#cboTipoReanimacionRn").attr('disabled', true);
        } else {
            $("#cboTipoReanimacionRn").val("");
            $("#cboTipoReanimacionRn").attr('disabled', true);
        }
        $("#cboTipoReanimacionRn").trigger("chosen:updated");
    },

    Transporte_Change() {
        if ($("#rdbTransporteSi").is(":checked")) {
            $("#cboTipoTransporteRn").val("");
            $("#cboTipoTransporteRn").removeAttr('disabled', 'disabled');
        }
        else if ($("#rdbTransporteNO").is(":checked")) {
            $("#cboTipoTransporteRn").val("");
            $("#cboTipoTransporteRn").attr('disabled', true);
        } else {
            $("#cboTipoTransporteRn").val("");
            $("#cboTipoTransporteRn").attr('disabled', true);
        }
        $("#cboTipoTransporteRn").trigger("chosen:updated");
    },

    Condicion_Change() {
        $("#ObitoPeso").hide();
        $(".rdbObito").prop('checked', false);
        if ($("#cboCondicion").val() == 1) {
            $("#ObitoPeso").hide();
            $('#rdbObitoNo').prop('checked', true);
            $(".rdbObito").attr('disabled', true);
        }
        else if ($("#cboCondicion").val() == 3) {
            //$("#txtEspecificar").val("");
            $("#ObitoPeso").show();
            $(".rdbObito").removeAttr('disabled', 'disabled');
        }
    },

    CondicionFiliacion_Change() {
        //$("#ObitoPeso").hide();
        //$(".rdbObito").prop('checked', false);
        //if ($("#cboCondicion").val() == 1) {
        //    $("#ObitoPeso").hide();
        //    $('#rdbObitoNo').prop('checked', true);
        //    $(".rdbObito").attr('disabled', true);
        //}
        //else if ($("#cboCondicion").val() == 3) {
        //    //$("#txtEspecificar").val("");
        //    $("#ObitoPeso").show();
        //    $(".rdbObito").removeAttr('disabled', 'disabled');
        //}
    },

    CondicionRegistroNacimiento_Change() {
        $("#ObitoPesoRegistroNacimiento").hide();
        $(".rdbObitoRegistroNacimiento").prop('checked', false);
        if ($("#cboCondicionRegistroNacimiento").val() == 1) {
            $("#ObitoPesoRegistroNacimiento").hide();
            $('#rdbObitoRegistroNacimientoNo').prop('checked', true);
            $(".rdbObitoRegistroNacimiento").attr('disabled', true);
        }
        else if ($("#cboCondicionRegistroNacimiento").val() == 3) {
            //$("#txtEspecificar").val("");
            $("#ObitoPesoRegistroNacimiento").show();
            $(".rdbObitoRegistroNacimiento").removeAttr('disabled', 'disabled');
        }
    },

    TipoGestacion_Change() {
        $('#cboNumeroGemelar').empty();
        if ($('#cboTipoGestacion').val() == 1) {
            //console.log(medobsenf);
            $(gemelar).each(function (i, obj) {
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
            $('#txtNroFetos').val('');
            $('#cboNumeroGemelar').val('');
            $("#txtNroFetos").removeAttr('disabled', 'disabled');
            $("#cboNumeroGemelar").removeAttr('disabled', 'disabled');
        } else {
            $("#txtNroFetos").attr('disabled', true);
            $("#cboNumeroGemelar").attr('disabled', true);
        }
        $("#cboNumeroGemelar").trigger("chosen:updated");
    },

    TipoGestacionFiliacion_Change() {
        $('#cboNumeroGemelarFiliacion').empty();
        if ($('#cboTipoGestacionFiliacion').val() == 1) {
            //console.log(medobsenf);
            $(gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
                if (obj.nroGemelos == 0) {
                    $('#cboNumeroGemelarFiliacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
            $('#txtNroFetosFiliacion').val(0);
            $('#cboNumeroGemelarFiliacion').val(0);
            $("#txtNroFetosFiliacion").attr('disabled', true);
            $("#cboNumeroGemelarFiliacion").attr('disabled', true);
        } else if ($('#cboTipoGestacionFiliacion').val() == 2) {
            $('#txtNroFetosFiliacion').val('');
            $('#cboNumeroGemelarFiliacion').val('');
            $("#txtNroFetosFiliacion").removeAttr('disabled', 'disabled');
            $("#cboNumeroGemelarFiliacion").removeAttr('disabled', 'disabled');
        } else {
            $("#txtNroFetosFiliacion").attr('disabled', true);
            $("#cboNumeroGemelarFiliacion").attr('disabled', true);
        }
        $("#cboNumeroGemelarFiliacion").trigger("chosen:updated");
    },

    TipoGestacionRegistroNacimiento_Change() {
        $('#cboNumeroGemelarRegistroNacimiento').empty();
        if ($('#cboTipoGestacionRegistroNacimiento').val() == 1) {
            //console.log(medobsenf);
            $(gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
                if (obj.nroGemelos == 0) {
                    $('#cboNumeroGemelarRegistroNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
            $('#txtNroFetosRegistroNacimiento').val(0);
            $('#cboNumeroGemelarRegistroNacimiento').val(0);
            $("#txtNroFetosRegistroNacimiento").attr('disabled', true);
            $("#cboNumeroGemelarRegistroNacimiento").attr('disabled', true);
        } else if ($('#cboTipoGestacionRegistroNacimiento').val() == 2) {
            $('#txtNroFetosRegistroNacimiento').val('');
            $('#cboNumeroGemelarRegistroNacimiento').val('');
            $("#txtNroFetosRegistroNacimiento").removeAttr('disabled', 'disabled');
            $("#cboNumeroGemelarRegistroNacimiento").removeAttr('disabled', 'disabled');
        } else {
            $("#txtNroFetosRegistroNacimiento").attr('disabled', true);
            $("#cboNumeroGemelarRegistroNacimiento").attr('disabled', true);
        }
        $("#cboNumeroGemelarRegistroNacimiento").trigger("chosen:updated");
    },

    Fetos_Change() {
        var fetos = 0;
        $('#cboNumeroGemelar').empty();
        fetos = $('#txtNroFetos').val();

        if (fetos > 0 && fetos <= 10) {
            $(gemelar).each(function (i, obj) {
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
                $(gemelar).each(function (i, obj) {
                    //console.log(obj.descripcion);
                    if (obj.nroGemelos == 0) {
                        $('#cboNumeroGemelar').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });
            }
        }
        $('#cboNumeroGemelar').val('');
        $("#cboNumeroGemelar").trigger("chosen:updated");
    },

    FetosFiliacion_Change() {
        var fetos = 0;
        $('#cboNumeroGemelarFiliacion').empty();
        fetos = $('#txtNroFetosFiliacion').val();

        if (fetos > 0 && fetos <= 10) {
            $(gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
                /*
                if (fetos > 5) {
                    fetos = 5;
                }*/
                if (obj.nroGemelos == fetos) {
                    $('#cboNumeroGemelarFiliacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }

            });
        } else {
            if (fetos < 0 || fetos > 10 || (fetos == 0 && $('#cboTipoGestacionFiliacion').val() == 2)) {
                $('#txtNroFetosFiliacion').val('');
            } else {
                $(gemelar).each(function (i, obj) {
                    //console.log(obj.descripcion);
                    if (obj.nroGemelos == 0) {
                        $('#cboNumeroGemelarFiliacion').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });
            }
        }
        $('#cboNumeroGemelarFiliacion').val('');
        $("#cboNumeroGemelarFiliacion").trigger("chosen:updated");
    },

    FetosRegistroNacimiento_Change() {
        var fetos = 0;
        $('#cboNumeroGemelarRegistroNacimiento').empty();
        fetos = $('#txtNroFetosRegistroNacimiento').val();

        if (fetos > 0 && fetos <= 10) {
            $(gemelar).each(function (i, obj) {
                //console.log(obj.descripcion);
                /*
                if (fetos > 5) {
                    fetos = 5;
                }*/
                if (obj.nroGemelos == fetos) {
                    $('#cboNumeroGemelarRegistroNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }

            });
        } else {
            if (fetos < 0 || fetos > 10 || (fetos == 0 && $('#cboTipoGestacionRegistroNacimiento').val() == 2)) {
                $('#txtNroFetosRegistroNacimiento').val('');
            } else {
                $(gemelar).each(function (i, obj) {
                    //console.log(obj.descripcion);
                    if (obj.nroGemelos == 0) {
                        $('#cboNumeroGemelarRegistroNacimiento').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });
            }
        }
        $('#cboNumeroGemelarRegistroNacimiento').val('');
        $("#cboNumeroGemelarRegistroNacimiento").trigger("chosen:updated");
    },

    async ClampajeTardio_Change() {
        let tiempos = await RegistroRN.ListarTiemposClampaje();
        if ($("#rdbTardioSi").is(":checked")) {
            $("#cboTiempoClampaje").val("");
            $("#cboTiempoClampaje").removeAttr('disabled', 'disabled');
            $(tiempos).each(function (i, obj) {
                if (obj.valor != 4) {
                    $('#cboTiempoClampaje').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
        }
        else if ($("#rdbTardioNO").is(":checked")) {
            $("#cboTiempoClampaje").val(4);
            $("#cboTiempoClampaje").attr('disabled', true);
            $(tiempos).each(function (i, obj) {
                if (obj.valor == 4) {
                    $('#cboTiempoClampaje').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                }
            });
        } else {
            $('#cboTiempoClampaje').empty();
            $("#cboTiempoClampaje").val("");
            $("#cboTiempoClampaje").attr('disabled', true);
        }
        $("#cboTiempoClampaje").trigger("chosen:updated");
    },

    async TiempoContactoPielaPiel_Change() {
        if ($("#rdbContactoPielSi").is(":checked")) {
            $("#cboTiempoContactoPiel").val("");
            $("#optTiempoContactoPielaPiel").show();
        }
        else if ($("#rdbContactoPielNo").is(":checked")) {
            $("#cboTiempoContactoPiel").val("");
            $("#optTiempoContactoPielaPiel").hide();

        } else {
            $("#cboTiempoContactoPiel").val("");
            $("#optTiempoContactoPielaPiel").hide();
        }
        $("#cboTiempoContactoPiel").trigger("chosen:updated");
    },

    async ListarTiemposClampaje() {
        let resp = null;
        await $.ajax({
            //async: false,
            cache: false,
            url: "/RecienNacido/ListarTiemposClampaje?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTiempoClampaje').empty();
                resp = datos.table;
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar condición!", "2");
                }, 900)
            }
        });

        return resp;
    },


    CargaMetodoxCargaUsuaria(idEstadoUsuaria) {
        var midata = new FormData();
        midata.append('idEstadoUsuaria', idEstadoUsuaria);
        $.ajax({
            method: "POST",
            url: "/RecienNacido/ListarMetodoxIdEstadoUsuaria?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboMetodo').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMetodo').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $("#cboMetodo").trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar procedimientos!", "2");
                }, 900)
            }
        });

    },

    LlenarCondicionPaciente() {
        var midata = new FormData();
        midata.append('idNroCuenta', $("#txtNroCuenta").val());
        midata.append('idGrupo', $("#idGrupo").val());
        $.ajax({
            method: "POST",
            url: "/RecienNacido/DevuelveCondicionPaciente?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $(datos.table).each(function (i, obj) {
                    if (obj.categoria == "MGP") {
                        $("#txtCondServicio").val(obj.descripcion);
                        $("#hdnCondServicio").val(obj.idTipoCondicionPaciente);
                    } else {
                        $("#txtCondEstablecimiento").val(obj.descripcion);
                        $("#hdnCondEstablecimiento").val(obj.idTipoCondicionPaciente);
                    }
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta(3, "Error al obtener las condiciones del paciente");
                }, 900)
            }
        });
    },

    LlenarEfecto(idMetodoEfecto) {
        var midata = new FormData();
        midata.append('idMetodoEfecto', idMetodoEfecto);
        $.ajax({
            method: "POST",
            url: "/RecienNacido/ListarEfectoSecxMetodo?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboEfectoSec').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboEfectoSec').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $("#cboEfectoSec").trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar efectos secundarios!", "2");
                }, 900)
            }
        });
    },

    TipoFiltroMigracion_Change() {
        if ($("input[name='TipoFiltroMigracion']:checked").val() == '1') {
            $("#FiltroFechaMigracion").show();
            $("#FiltroHistoriaMigracion").hide();
        }
        else if ($("input[name='TipoFiltroMigracion']:checked").val() == '2') {
            $("#FiltroHistoriaMigracion").show();
            $("#FiltroFechaMigracion").hide();
        }
    },


    LimpiarFiltros() {
        /*
        $("#txtCama").val("");
        $("#txtNroCuentaFiltro").val("");
        $("#txtDniFiltro").val("");
        $("#txtNroHistoriaFiltro").val("");
        $("#txtApPaternoFiltro").val("");
        $('#txtFechaFiltro').val(FechaDia);
        RegistroRN.ListarHospitalizados(); */
        //$("#txtNroCuentaFiltro").val("");
        $(".search").val();
        $("#txtNroCuentaFiltro").val("");
        $("#txtDniFiltro").val("");
        $("#txtNroHistoriaFiltro").val("");
        $("#txtApPaternoFiltro").val("");
        $("#txtApMaternoFiltro").val("");
        $("#txtDniMadreFiltro").val("");
        $("#txtFechaFiltro").val("");
        //$("#txtFechaFiltro").datepicker("setDate", FechaDia);

    },

    LimpiarFiltrosMigracion() {
        var fm = new Date();
        $("#txtAnioMigrar").val(fm.getFullYear());
        $("#txtNroHistoriaMigrar").val("");
        $("input[name=TipoFiltroMigracion]").removeAttr('checked');
        $("#TipoFiltroMigracionFecha").click();
        //$("input[name=TipoFiltroMigracion][value=" + 1 + "]").attr('checked', true);        
        $("#txtFechaMigrar").datepicker("setDate", FechaDia);
        RegistroRN.PacientePorMigrar = [];
        oTable_PacientesMigrar.fnClearTable();
    },

    limpiarmodal() {

        //$("#hdnIdCuentaAtencion").val("");
        //$("#hdnIdRegistroRN").val("");
        //$("#hdnTablaRN").val("");
        RegistroRN.IdRegistroRn = 0;
        RegistroRN.IdCuentaAtencion = 0;
        RegistroRN.IdPaciente = 0;
        RegistroRN.IdPacienteMadre = 0;
        RegistroRN.IdTriajeRn = 0;
        RegistroRN.Tabla = '';
        $("#txtNroHistoria").val("");
        $("#txtNombreRn").val("");
        $("#txtFecNac").val("");
        $("#txtHoraNac").val("");
        $("#cboTipoDocumento").val("");
        $("#cboTipoDocumento").trigger("chosen:updated");
        $("#txtNroDocumento").val("");
        $("#cboSexo").val("");
        $("#cboSexo").trigger("chosen:updated");
        $("#txtNroHijo").val("");
        $("#txtFechaClampaje").val("");
        $("#cboTipoGestacion").val("");
        $("#cboTipoGestacion").trigger("chosen:updated");
        $("#txtNroFetos").val("");
        $("#cboNumeroGemelar").val("");
        $("#cboNumeroGemelar").trigger("chosen:updated");
        $("#cboCondicion").val("");
        $("#cboCondicion").trigger("chosen:updated");
        $(".rdbObito").prop('checked', false);
        $(".rdbObito").attr('disabled', true);
        $("#txtEdadGestacional").val("");
        $("#txtPeso").val("");
        $("#txtTalla").val("");
        $("#txtPerCefalico").val("");
        $("#txtPerToracico").val("");
        $("#cboServicioNacimiento").val("");
        $("#cboServicioNacimiento").trigger("chosen:updated");
        $("#cboProcedenciaRn").val(1);
        $("#cboProcedenciaRn").trigger("chosen:updated");
        $("#txtNroHistoriaMadre").val("");
        $("#txtNombreMadre").val("");
        $("#txtNroHistoriaMadre").val("");
        $("#cboTipoDocMadre").val("");
        $("#cboTipoDocMadre").trigger("chosen:updated");
        $("#txtNroDocMadre").val("");
        $("#txtEdadMadre").val("");
        $("#cboEstadoCivilMadre").val("");
        $("#cboEstadoCivilMadre").trigger("chosen:updated");
        $("#cboGradoInstruccionMadre").val("");
        $("#cboGradoInstruccionMadre").trigger("chosen:updated");
        $(".rdbInmediato").prop('checked', false);
        $("#txtMinuto").val("");
        $("#txt5Minuto").val("");
        $(".rdbReanimacion").prop('checked', false);
        $(".rdbPatNeo").prop('checked', false);
        $("#txtEspecificar").val("");
        $("#txtEspecificar").attr('disabled', true);
        $("#txtTiempoHosp").val("");
        $(".rdbEmbarazo").prop('checked', false);
        $("#txtPatGest").val("");
        $("#txtNroEmbarazo").val("");
        $(".rdbAtPreNatal").prop('checked', false);
        $("#txtNroAPN").val("");
        $("#txtLugarAPN").val("");
        $("#txtGestas").val("");
        $("#txtParidad").val("");
        $("#txtParidad1").val("");
        $("#txtParidad2").val("");
        $("#txtParidad3").val("");
        $("#txtParidad4").val("");
        $(".rdbAtendidoPor").prop('checked', false);
        $("#cboProfResponsable").val("");
        $("#cboProfResponsable").trigger("chosen:updated");
        $("#txtProfResponsable").val("");
        $("#cboTipoParto").val("");
        $("#cboTipoParto").trigger("chosen:updated");
        $("#cboRiesgo").val("");
        $("#cboRiesgo").trigger("chosen:updated");
        $("#cboContactoPiel").val("");
        $("#cboContactoPiel").trigger("chosen:updated");
        $("#btnDiagnosticosRn").hide();
        $(".rdbParto").prop('checked', false);
        $(".rdbPartoComplicado").prop('checked', false);
        $("#txtComplicaciones").val("");
        $(".rdbTipoParto").prop('checked', false);
        $(".rdbTardio").removeAttr('checked');
        $(".rdbLacthora").prop('checked', false);
        $("#chkConAcompaniante").prop('checked', false);
        $("#chkConAnalgesia").prop('checked', false);
        $("#chkTrasladoConjunto").prop('checked', false);

        $(".rdbContactoPiel").removeAttr('checked');
        $(".rdbEfectividadContactoPiel").removeAttr('checked');
        $(".rdbLacthora").removeAttr('checked');

        $(".rdbInmediato").removeAttr('checked');
        $(".rdbReanimacion").removeAttr('checked');
        $(".rdbPatNeo").removeAttr('checked');
        $(".rdbTransporte").removeAttr('checked');

        $("#frmContactoPielaPiel_V1").hide();
        $("#frmContactoPielaPiel_V2").hide();

        //$('.rdbInmediato').prop('checked', '');
        //$('.rdbReanimacion').prop('checked', '');
        //$('.rdbPatNeo').prop('checked', '');
        //$('.rdbEmbarazo').prop('checked', '');
        //$('.rdbAtPreNatal').prop('checked', '');
        //$('.rdbAtendidoPor').prop('checked', '');
        //$('.rdbTipoParto').prop('checked', '');
        //$('.rdbTardio').prop('checked', '');
        //$('.rdbLacthora').prop('checked', '');
        //$('#chkConAcompaniante').prop('checked', '');
        //$('#chkConAnalgesia').prop('checked', '');

        /*
        $('.nav-link').removeClass('active');
        $('.nav-link').prop('aria-expanded', false);
        $('#home-tab').addClass('active');
        $('#home-tab').prop('aria-expanded', false);
        */
        $('#atencion-tab-link').trigger('click');

        $("#txtObservacion").val(null);
        //$("#txtNroGemelar").val(null);


        //$('#rdbTipoPartoH').prop('checked', false);
        //$('#rdbTipoPartoV').prop('checked', false);

        //$("#rdbLacthoraNO").prop('checked', true);
        //$("#rdbTardioNO").prop('checked', true);    

        //$('#rdbTipoPartoH').prop('checked', false);

        //$("#PacienteHeaderModal").html("");
        //$("#HistoriaHeaderModal").html("");
        //$("#CuentaHeaderModal").html("");

        //idAccion = 0;
        //medobsenf = [];
        proferesp = 0;

        Brazalete.LimpiarBrazalete();
        //    BloquearControles(false);
    },
    /*
    function limpiarNoAceptaMetodo() {
    
        $("#cboConsulta").val(-1);
        $("#cboProcedimientoEntrada").val(-1);
        $("#txtNroInsumos").val("");
        $("#cboProcedimiento").val(-1);
        $("#cboEfectoSecundario").val(-1);
        $("#cboMetodoDefinitivo").val(-1);
        $("#cboMetodoTemporal").val(-1);
        $("#cboMedico").val(-1);
        idAccion = 0;
        $("#cboConsulta").trigger("chosen:updated");
        $("#cboProcedimientoEntrada").trigger("chosen:updated");
    
        $("#cboProcedimiento").trigger("chosen:updated");
        $("#cboEfectoSecundario").trigger("chosen:updated");
        $("#cboMetodoDefinitivo").trigger("chosen:updated");
        $("#cboMetodoTemporal").trigger("chosen:updated");
        $("#cboMedico").trigger("chosen:updated");
    
    }
    */
    //////////////////////////GUARDAR-AGREGAR///////////////////////////////////////
    //AgregarPacienteRegistroRn() {
    //    $("#modalBuscarPaciente").modal("show")
    //},

    //CerrarModalBusquedaPaciente() {
    //    $("#modalBuscarPaciente").modal("hide")
    //},

    //AgregarRegistroRn() {
    //    accion = 'A';
    //    RegistroRN.limpiarmodal();
    //    var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();


    //},




    //////////////////////////AGREGAR - MODIFICAR - GUARDAR///////////////////////////////////////
    BuscarPacienteRegistroRn() {
        ObjtableHospitalizadosRn.$('tr.selected').removeClass('selected');
        RegistroRN.LimpiarBusquedaPacientes();
        $("#modalPacienteBusqueda").modal("show");
    },

    async AgregarRegistroRn() {
        accion = 'A';
        RegistroRN.limpiarmodal();
        var objrow = oTable_Pacientes.api(true).row('.selected').data();


        //console.log(objrow)
        if (isEmpty(objrow)) {
            alerta(2, "Debe seleccionar un paciente.");
            return false;
        }

        const resp = await RegistroRN.SeleccionarRegistroRNporHistoria(objrow.nroHistoriaClinica);

        if (resp == false) {

            if (objrow.idDocIdentidad != 1 && objrow.idDocIdentidad != 7) {
                alerta2("warning", "", "Por favor actualice el Tipo de Documento y Nro de Documento del paciente. Solo se aceptan DNI o CIU.");
                return false;
            }

            if (objrow.docMadre == '' || objrow.docMadre == null) {
                alerta2("warning", "", "Por favor agregue el número de documento de la madre a la historia del paciente.");
                return false;
            }


            $('#txtNroHistoria').val(objrow.nroHistoriaClinica);
            $('#txtFecNac').val(objrow.fecNac);
            $('#txtHoraNac').val(objrow.horaNac);
            $('#txtNombreRn').val(objrow.paciente);
            //$('#txtSexoPac').val(objrow.sexo);
            $('#cboTipoDocumento').val(objrow.idDocIdentidad);
            $('#txtNroDocumento').val(objrow.nroDocumento);
            $('#cboSexo').val(objrow.idTipoSexo);
            $('#txtNroHijo').val(objrow.nroOrdenHijo);
            $('#cboTipoDocMadre').val(objrow.idDocIdentidadMadre);
            $('#txtNombreMadre').val(objrow.madre);
            $('#txtNroDocMadre').val(objrow.docMadre);
            $('#txtNroHistoriaMadre').val(objrow.historiaMadre);
            $('#txtEdadMadre').val(objrow.edadMadre);
            $('#cboEstadoCivilMadre').val(objrow.estadoCivilMadre);
            $('#cboGradoInstruccionMadre').val(objrow.gradoInstruccionMadre);
            $("#txtTiempoHosp").val(objrow.tiempoHosp);

            const resp2 = await RegistroRN.VerificarNacimientoRegistroRN(objrow.idPaciente);
            //console.log(resp2);
            if (!isEmpty(resp2)) {
                RegistroRN.IdCuentaAtencion = resp2.idCuentaAtencion;
                $('#txtTiempoHosp').val(resp2.tiempoHosp);
                //$('#cboServicioNacimiento').val(resp2.idServicioIngreso);
                //$("#cboServicioNacimiento").trigger("chosen:updated");                
            } else {
                RegistroRN.IdCuentaAtencion = 0;
            }
            RegistroRN.IdRegistroRn = 0;
            RegistroRN.IdPaciente = objrow.idPaciente;
            RegistroRN.IdPacienteMadre = objrow.idPacienteMadre;
            RegistroRN.IdTriajeRn = 0;
            RegistroRN.NacidoEn = 1;
            RegistroRN.Tabla = null;

            $("#btnTriajeRn").show();

            $("#frmContactoPielaPiel_V2").show();

            $('.chzn-select').chosen().trigger("chosen:updated");

            //$("#cboServicioNacimiento").val(objrow.idServicioIngreso);

            $("#btnGuardar").show();

            //RegistroRN.SeleccionarRegistroRN(0, 0, 'NONE');

            $("#modalPacienteBusqueda").modal("hide");


            MostrarAreaRegistro();
        }

    },

    async ModificarRegistroRn() {
        accion = 'M';
        RegistroRN.limpiarmodal();
        var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();
        if (isEmpty(objrow)) {
            alerta2("info", "", "Debe seleccionar un Registro de Nacimiento a modificar.");
            return false;
        }
        if (objrow.idEstadoAtencion == 0) {
            alerta2("info", "", "La cuenta se encuentra Anulada.");
            return false;
        }

        if (objrow.idEstadoAtencion == 2) {
            alerta2("info", "", "La cuenta se encuentra cerrada.");
            return false;
        }

        if (objrow.idDocIdentidad != 1 && objrow.idDocIdentidad != 7) {
            alerta2("info", "", "Por favor actualice el Tipo de Documento y Nro de Documento del paciente. Solo se aceptan DNI o CIU.");
            //return false;
        }

        if (objrow.docMadre == '' || objrow.docMadre == null) {
            alerta2("info", "", "Por favor agregue el número de documento de la madre a la historia del paciente.");
            return false;
        }

        if (objrow.nroDocumento == '0') {
            alerta2("warning", "FALTA REGISTRO DE CIU", "No se encontró el número de CIU. Por favor, debe registrar el Nª de documento.");
        }
        //$('#txtDatos').html(' | N° Cuenta: ' + objrow.nroCuenta + ' | N° Historia: ' + objrow.nroHistoriaClinica + ' | Paciente: ' + objrow.paciente.toUpperCase())
        //$("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrow.paciente == null ? '' : objrow.paciente));
        //$("#HistoriaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-clipboard-medical'></i><b>Historia: </b>" + objrow.nroHistoriaClinica);
        //$("#CuentaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-hashtag'></i><b>Cuenta: </b>" + objrow.nroCuenta);

        //asignar valores    
        $('#txtNroHistoria').val(objrow.nroHistoriaClinica);
        $('#txtFecNac').val(objrow.fecNac);
        $('#txtHoraNac').val(objrow.horaNac);
        $('#txtNombreRn').val(objrow.paciente);
        //$('#txtSexoPac').val(objrow.sexo);
        $('#cboTipoDocumento').val(objrow.idDocIdentidad);
        $('#txtNroDocumento').val(objrow.nroDocumento);
        $('#cboSexo').val(objrow.idTipoSexo);
        $('#txtNroHijo').val(objrow.nroOrdenHijo);
        $('#cboTipoDocMadre').val(objrow.idDocIdentidadMadre);
        $('#txtNombreMadre').val(objrow.madre);
        $('#txtNroDocMadre').val(objrow.docMadre);
        $('#txtNroHistoriaMadre').val(objrow.historiaMadre);
        $('#txtEdadMadre').val(objrow.edadMadre);
        $('#cboEstadoCivilMadre').val(objrow.estadoCivilMadre);
        $('#cboGradoInstruccionMadre').val(objrow.gradoInstruccionMadre);
        $("#txtTiempoHosp").val(objrow.tiempoHosp);

        //$('#hdnTablaRN').val(objrow.tabla);
        //$('#hdnIdRegistroRN').val(objrow.idRegistroRN);
        //$('#hdnIdCuentaAtencion').val(objrow.nroCuenta);
        //$('#hdnIdPaciente').val(objrow.idPaciente);

        RegistroRN.IdRegistroRn = objrow.idRegistroRN;
        RegistroRN.IdCuentaAtencion = objrow.nroCuenta;
        RegistroRN.IdPaciente = objrow.idPaciente;
        RegistroRN.NacidoEn = objrow.nacidoEn;
        RegistroRN.Tabla = objrow.tabla;
        RegistroRN.IdPacienteMadre = objrow.idPacienteMadre;

        $("#cboServicioNacimiento").val(objrow.idServicioIngreso);

        $("#btnGuardar").show();
        //console.log(objrow);
        /*
        if (objrow.cantEvaluacion > 0) {
            EvaluacionRn.SeleccionarEvaluacionRN(objrow.nroCuenta, objrow.idRegistroRN, objrow.tabla);
        }
        */
        /////////////////////BRAZALETE//////////////////////////////
        Brazalete.idPaciente = objrow.idPaciente;
        Brazalete.nroHistoria = objrow.nroHistoriaClinica;
        Brazalete.apellidos = objrow.apellidosRn;
        Brazalete.nombres = objrow.nombresRn;
        Brazalete.tipoDocumento = objrow.tipoDocumentoRn;
        Brazalete.nroDocumento = objrow.nroDocumentoRn;
        Brazalete.fechaNacimiento = objrow.fechaNacimientoRn;
        Brazalete.horaNacimiento = objrow.horaNacimientoRn;
        Brazalete.tipoSexo = objrow.sexoRn;
        Brazalete.gemelar = objrow.gemelarRn;
        ////////////////////////////////////////////////////////////

        //////////////////////////COMENTADO POR KHOYOSI - PORQUE YA NO SE USARA EN ESTE MODULO /////////////////////////
        //Diagnosticos.SeleccionarDiagnosticos(objrow.idAtencion, 2);

        //ConsumoServicio.idCuentaAtencion = objrow.nroCuenta;
        //ConsumoServicio.idEstadoAtencion = objrow.idEstadoAtencion;
        //ConsumoServicio.BuscaAtencionesCptCEparaFormatoHIS(objrow.nroCuenta);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        await RegistroRN.SeleccionarRegistroRN(objrow.nroCuenta, objrow.idRegistroRN, objrow.tabla);

        RegistroRN.tienePermisoRegistroNacimiento = await Utilitario.ValidarPermisoUsuario("REGISTRO-NACIMIENTO");
        if (RegistroRN.tienePermisoRegistroNacimiento > 0) {
            $("#nacimiento-tab .campo").prop("disabled", true);
            $('.chzn-select').chosen().trigger("chosen:updated");
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        }

        $('#txtPeso').prop('disabled', true)
        $('#txtTalla').prop('disabled', true)
        $('#txtPerCefalico').prop('disabled', true)
        $('#txtPerToracico').prop('disabled', true)
        $('#txtEdadGestacional').prop('disabled', true)

        $('#rdbLacthoraSi').prop('disabled', true)
        $('#rdbLacthoraNO').prop('disabled', true)
        $('#txtTiempoLactancia').prop('disabled', true)

        $('#rdbInmediatoSi').prop('disabled', true)
        $('#rdbInmediatoNO').prop('disabled', true)
        $('#rdbReanimacionSi').prop('disabled', true)
        $('#rdbReanimacionNO').prop('disabled', true)
        $('#cboTipoReanimacionRn').prop('disabled', true)
        $('#txtMinuto').prop('disabled', true)
        $('#txt5Minuto').prop('disabled', true)
        $('#txt10Minuto').prop('disabled', true)
        $('#txt15Minuto').prop('disabled', true)
        $('#txt20Minuto').prop('disabled', true)
        $('#rdbPatNeoSi').prop('disabled', true)
        $('#rdbPatNeoNo').prop('disabled', true)
        $('#txtEspecificar').prop('disabled', true)
        $('#rdbTransporteSi').prop('disabled', true)
        $('#rdbTransporteNO').prop('disabled', true)
        $('#cboTipoTransporteRn').prop('disabled', true)
        $('#cboCondicion').prop('disabled', true)
        $('#rdbObitoSiMenor').prop('disabled', true)
        $('#rdbObitoSiMayor').prop('disabled', true)
        // $('#cboProcedenciaRn').prop('disabled', true)

        $('.chzn-select').chosen().trigger("chosen:updated");
        $(".chzn-select").chosen({ allow_single_deselect: true });
        //LlenarCondicionPaciente();
        // ValidarAtencionEvaluacionRn();
    },

    async Guardar() {
        //var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();              //COMENTADO POR KHOYOSI - (YA NO SE UTILIZARA EN ESTE MODULO, SINO EN NOTA DE INGRESO)
        //Diagnosticos.GuardarDiagnosticosPorEvaluacion(objrow.idAtencion, 2, null, null);      //COMENTADO POR KHOYOSI - (YA NO SE UTILIZARA EN ESTE MODULO, SINO EN NOTA DE INGRESO)
        await this.GuardarRegistroRN();
    },

    async GuardarRegistroRN() {

        if (RegistroRN.ValidarCampos() == false) {
            return false;
        }

        var midata = new FormData();

        var obito = '';
        var posicion = '';
        var embarazo = '';
        var attpor = '';
        var parto = '';
        var lstDiagnosticoRn = '[]';

        //debugger;               
        if ($("#rdbObitoNo").is(":checked") == false && $("#rdbObitoSiMenor").is(":checked") == false && $("#rdbObitoSiMayor").is(":checked") == false) {
            alerta(3, "Debe seleccionar el Óbito.");
        } else {
            if ($("#rdbObitoNo").is(":checked")) { obito = 'No' } else if ($("#rdbObitoSiMenor").is(":checked")) { obito = 'Menor' } else { obito = 'Mayor' }
        }

        if ($("#rdbTipoPartoH").is(":checked") == false && $("#rdbTipoPartoV").is(":checked") == false) {
            alerta(3, "Debe seleccionar el Tipo de Parto.");
        } else {
            if ($("#rdbTipoPartoH").is(":checked")) { posicion = 'H' } else { posicion = 'V' }
        }

        if ($("#rdbEmbarazoN").is(":checked") == false && $("#rdbEmbarazoC").is(":checked") == false) {
            alerta(3, "Debe seleccionar el Embarazo.");
        } else {
            if ($("#rdbEmbarazoN").is(":checked")) { embarazo = 'N' } else { embarazo = 'C' }
        }

        if ($("#rdbAtendidoPorMed").is(":checked") == false && $("#rdbAtendidoPorObs").is(":checked") == false && $("#rdbAtendidoPorOtro").is(":checked") == false) {
            alerta(3, "Debe seleccionar por quien fue Atendido.");
        } else {
            if ($("#rdbAtendidoPorMed").is(":checked")) {
                if ($("#cboProfResponsable").val() == null) { alerta(2, "Debe seleccionar el Profesional."); $('#atencion-tab-link').trigger('click'); $("#cboProfResponsable").focus(); $("#cboProfResponsable_chosen").addClass("chosen-container-active"); return false; }
                $("#txtProfResponsable").val("");
                attpor = 'M';
            } else if ($("#rdbAtendidoPorObs").is(":checked")) {
                if ($("#cboProfResponsable").val() == null) { alerta(2, "Debe seleccionar el Profesional."); $('#atencion-tab-link').trigger('click'); $("#cboProfResponsable").focus(); $("#cboProfResponsable_chosen").addClass("chosen-container-active"); return false; }
                $("#txtProfResponsable").val("");
                attpor = 'O';
            } else {
                $("#cboProfResponsable").val("");
                attpor = 'X';

            }

        }

        if ($("#rdbEutocito").is(":checked") == false && $("#rdbComplicado").is(":checked") == false) {
            alerta(3, "Debe seleccionar la Complicación del Parto.");
        } else {
            if ($("#rdbEutocito").is(":checked")) {
                parto = true;
            } else if ($("#rdbComplicado").is(":checked")) {
                lstDiagnosticoRn = oTable_DiagnosticosRn.api(true).rows().data();
                lstDiagnosticoRn = JSON.stringify(lstDiagnosticoRn.toArray());
                parto = false;
            } else {
                parto = '';
            }
        }

        if ($("#txtParidad1").val().length < 2) {
            $("#txtParidad1").val('0' + $("#txtParidad1").val());
        }

        if ($("#txtParidad2").val().length < 2) {
            $("#txtParidad2").val('0' + $("#txtParidad2").val());
        }

        if ($("#txtParidad3").val().length < 2) {
            $("#txtParidad3").val('0' + $("#txtParidad3").val());
        }

        if ($("#txtParidad4").val().length < 2) {
            $("#txtParidad4").val('0' + $("#txtParidad4").val());
        }


        ///////////////////////MADRE/////////////////////////////////////        
        midata.append("Embarazo", embarazo);
        midata.append("PatologiaGestacion", $('#txtPatGest').val());
        midata.append("NroEmbarazo", $('#txtNroEmbarazo').val());
        midata.append("AtencionPrenatal", $("#rdbAtPreNatalSi").is(":checked"));
        midata.append("NroApn", $('#txtNroAPN').val());
        midata.append("LugarApn", $('#txtLugarAPN').val());
        midata.append("Gesta", $("#txtGestas").val());
        //midata.append("Paridad", $("#txtParidad").val());
        midata.append("Paridad1", $("#txtParidad1").val());
        midata.append("Paridad2", $("#txtParidad2").val());
        midata.append("Paridad3", $("#txtParidad3").val());
        midata.append("Paridad4", $("#txtParidad4").val());

        midata.append("AtendidoPor", attpor);
        midata.append("idMedico", $("#cboProfResponsable").val());
        midata.append("medicoResponsable", $("#txtProfResponsable").val());
        midata.append("idTipoParto", $("#cboTipoParto").val());
        midata.append("Parto", parto);
        midata.append('lstDiagnosticosRn', lstDiagnosticoRn);
        midata.append("ComplicacionParto", $("#txtComplicaciones").val());
        midata.append("PosicionParto", posicion);
        midata.append("ConAcompaniante", $("#chkConAcompaniante").is(":checked"));
        midata.append("ConAnaglgesia", $("#chkConAnalgesia").is(":checked"));
        midata.append("TrasladoConjunto", $("#chkTrasladoConjunto").is(":checked"));


        midata.append("EdadMadre", $('#txtEdadMadre').val());


        //midata.append("Observaciones", $("#txtObservacion").val());
        //midata.append("NroGemelar", $("#txtNroGemelar").val());


        ////////////////////////NEONATAO/////////////////////////////////
        midata.append("IdTipoDocumentoRn", $("#cboTipoDocumento").val());
        midata.append("NroDocumentoRn", $("#txtNroDocumento").val());

        midata.append("FechaNacimiento", $("#txtFecNac").val());
        midata.append("HoraNacimiento", $("#txtHoraNac").val());
        midata.append("IdTipoSexo", $("#cboSexo").val());
        midata.append("NroHijo", $("#txtNroHijo").val());
        midata.append("IdTipoGestacion", $("#cboTipoGestacion").val());
        midata.append("Fetos", $("#txtNroFetos").val());
        midata.append("NroGemelar", $("#cboNumeroGemelar").val());
        midata.append("idCondicion", $("#cboCondicion").val());
        midata.append("Obito", obito);

        midata.append("Peso", $("#txtPeso").val());
        midata.append("Talla", $("#txtTalla").val());
        midata.append("PerimetroCefalico", $("#txtPerCefalico").val());
        midata.append("PerimetroToracico", $("#txtPerToracico").val());
        midata.append("EdadGes", $("#txtEdadGestacional").val());
        midata.append("Fur", $("#txtFUR").val());

        midata.append("ClampadoTardio", $("#rdbTardioSi").is(":checked"));
        midata.append("IdTiempoClampaje", $("#cboTiempoClampaje").val());
        midata.append("FechaClamp", null);
        midata.append("HoraClamp", null);

        midata.append("PielaPiel", $("#cboContactoPiel").val());
        midata.append("ContactoPielaPiel", $("#rdbContactoPielSi").is(":checked") == true ? 1 : ($("#rdbContactoPielNo").is(":checked") == true ? 0 : null));
        midata.append("IdTiempoContactoPielaPiel", $("#cboTiempoContactoPiel").val());
        midata.append("EfectividadContactoPielaPiel", $("#rdbEfectividadContactoPielSi").is(":checked") == true ? 1 : ($("#rdbEfectividadContactoPielNo").is(":checked") == true ? 0 : null));

        midata.append("TiempoLactancia", $("#txtTiempoLactancia").val());
        midata.append("Lactancia1raHora", $("#rdbLacthoraSi").is(":checked"));

        midata.append("IdServicioNacimiento", $("#cboServicioNacimiento").val());
        midata.append("IdOtraProcedencia", $("#cboProcedenciaRn").val());
        midata.append("TiempoHospitalizacion", $('#txtTiempoHosp').val());

        midata.append("Inmediato", $("#rdbInmediatoSi").is(":checked"));
        midata.append("Reanimacion", $("#rdbReanimacionSi").is(":checked"));
        midata.append("IdTipoReanimacion", $("#cboTipoReanimacionRn").val());
        midata.append("AlMinuto", $("#txtMinuto").val());
        midata.append("Alos5Minutos", $("#txt5Minuto").val());
        midata.append("Alos10Minutos", $("#txt10Minuto").val());
        midata.append("Alos15Minutos", $("#txt15Minuto").val());
        midata.append("Alos20Minutos", $("#txt20Minuto").val());
        midata.append("PatologiaNeonatal", $("#rdbPatNeoSi").is(":checked"));
        midata.append("Especificar", $('#txtEspecificar').val());
        midata.append("Transporte", $("#rdbTransporteSi").is(":checked"));
        midata.append("IdTipoTransporte", $("#cboTipoTransporteRn").val());

        midata.append("idRiesgo", $("#cboRiesgo").val());

        //midata.append("idCuentaAtencion", $("#hdnIdCuentaAtencion").val());
        //midata.append("idPaciente", $("#hdnIdPaciente").val());
        //midata.append("idRegistroRN", $("#hdnIdRegistroRN").val());
        //midata.append("tabla", $("#hdnTablaRN").val());

        midata.append("idCuentaAtencion", RegistroRN.IdCuentaAtencion);
        midata.append("idPaciente", RegistroRN.IdPaciente);
        midata.append("idRegistroRN", RegistroRN.IdRegistroRn);
        midata.append("idTriajeRn", RegistroRN.IdTriajeRn);
        midata.append("nacidoEn", RegistroRN.NacidoEn);
        midata.append("tabla", RegistroRN.Tabla);

        midata.append('idListBar', ObtenerItemListBar());

        //midata.append('lstComorbilidad', JSON.stringify(ListComorbilidad.toArray()));
        //midata.append('idAccion', idAccion);
        await $.ajax({
            method: "POST",
            url: "/RecienNacido/GuardarRegistroRn?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.respuesta > 0) {
                    alerta(1, datos.mensaje);
                    RegistroRN.cerrarModal();
                    RegistroRN.ListarPacientesRegistroRN();
                } else {
                    alerta(2, datos.mensaje);
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    MigrarHistoriaPacientes() {
        if (RegistroRN.PacientePorMigrar.length == 0) {
            alerta2("info", "", "No existe pacientes para migrar.");
            return;
        }

        var midata = new FormData();
        midata.append("pacientes", JSON.stringify(RegistroRN.PacientePorMigrar));
        midata.append("anio", $("#txtAnioMigrar").val());
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/RecienNacido/MigrarHistoriaPacientes?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0);
                if (datos.respuesta > 0) {
                    alerta2("success", "", datos.mensaje);
                    RegistroRN.CerrarModalMigracion();
                } else {
                    alerta2("warning", "", datos.mensaje);
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },


    //////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////CONSULTAR///////////////////////////////////////
    async ConsultarRegistroRn() {
        accion = 'C';
        RegistroRN.limpiarmodal();
        var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();

        if (isEmpty(objrow)) {
            alerta(2, "Debe seleccionar un Registro de Nacimiento a consultar.");
            return false;
        }

        if (objrow.idEstadoAtencion == 0) {
            alerta(2, "La cuenta se encuentra Anulada.");
            //return false;
        }

        if (objrow.idEstadoAtencion == 2) {
            alerta(2, "La cuenta se encuentra cerrada.");
            //return false;
        }

        if (objrow.idRegistroRN == 0 || objrow.bActivo == 0) {
            alerta(2, "No hay nada que consultar. No cuenta con un Registro de Nacimiento.");
            return false;
        }

        //$('#txtDatos').html(' | N°.Cuenta: ' + objrow.nroCuenta + ' | N°.Historia: ' + objrow.nroHistoriaClinica + ' | Paciente: ' + objrow.paciente.toUpperCase())
        $("#PacienteHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-wheelchair'></i><b>Paciente: </b>" + (objrow.paciente == null ? '' : objrow.paciente));
        $("#HistoriaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-clipboard-medical'></i><b>Historia: </b>" + objrow.nroHistoriaClinica);
        $("#CuentaHeaderModal").html("<i style='width: 20px; text-align: center;' class='fa fa-hashtag'></i><b>Cuenta: </b>" + objrow.nroCuenta);

        //asignar valores
        $('#txtNroHistoria').val(objrow.nroHistoriaClinica);
        $('#txtFecNac').val(objrow.fecNac);
        $('#txtHoraNac').val(objrow.horaNac);
        $('#txtNombreRn').val(objrow.paciente);
        //$('#txtSexoPac').val(objrow.sexo);
        $('#cboTipoDocumento').val(objrow.idDocIdentidad);
        $('#txtNroDocumento').val(objrow.nroDocumento);
        $('#cboSexo').val(objrow.idTipoSexo);
        $('#txtNroHijo').val(objrow.nroOrdenHijo);
        $('#cboTipoDocMadre').val(objrow.idDocIdentidadMadre);
        $('#txtNombreMadre').val(objrow.madre);
        $('#txtNroDocMadre').val(objrow.docMadre);
        $('#txtNroHistoriaMadre').val(objrow.historiaMadre);
        $('#txtEdadMadre').val(objrow.edadMadre);
        $('#cboEstadoCivilMadre').val(objrow.estadoCivilMadre);
        $('#cboGradoInstruccionMadre').val(objrow.gradoInstruccionMadre);

        //$('#hdnTablaRN').val(objrow.tabla);
        //$('#hdnIdRegistroRN').val(objrow.idRegistroRN);
        //$('#hdnIdCuentaAtencion').val(objrow.nroCuenta);
        //$('#hdnIdPaciente').val(objrow.idPaciente);

        RegistroRN.IdRegistroRn = objrow.idRegistroRN;
        RegistroRN.IdCuentaAtencion = objrow.nroCuenta;
        RegistroRN.IdPaciente = objrow.idPaciente;
        RegistroRN.IdPacienteMadre = objrow.idPacienteMadre;
        RegistroRN.Tabla = objrow.tabla;

        $("#btnGuardar").hide();

        /*
        if (objrow.cantEvaluacion > 0) {
            EvaluacionRn.ObtenerEvaluacionRN(objrow.nroCuenta);
        }*/

        await RegistroRN.SeleccionarRegistroRN(objrow.nroCuenta, objrow.idRegistroRN, objrow.tabla);


    },
    /////////////////////////////////////////////////////////////////////////////

    /*
    function HabilitarControlesPlani() {
        $("#cboConsulta").removeAttr('disabled', 'disabled');
        $("#cboProcedimientoEntrada").removeAttr('disabled', 'disabled');
        $("#txtNroInsumos").removeAttr('disabled', 'disabled');
        $("#cboMetodo").removeAttr('disabled', 'disabled');
        $("#cboProcedimiento").removeAttr('disabled', 'disabled');
        $("#cboEfectoSecundario").removeAttr('disabled', 'disabled');
        $("#btnGuardar").show();
    }
    
    
    
    
    function RegistrarVisita(idCuenta, idPaciente, control) {
    
        var nroHistoria = $(control).parents("tr").find("td")[0].innerHTML;
        var nombre = $(control).parents("tr").find("td")[1].innerHTML;
        var telefono = $(control).parents("tr").find("td")[3].innerHTML;
        $("#txtFechaEvaluacion").val(FechaDia);
        //asignar valores
        $('#txtNroHistoria').val(nroHistoria);
        $('#txtPaciente').val(nombre);
        $('#txtTelefono').val(telefono);
        $('#idPaciente').val(idPaciente);
        $('#idCuenta').val(idCuenta);
        $('#idVisita').val(0);
        $('#modalEvaluacionRN').modal('show');
        $("#btnGuardar").show();
        //$('.chosen-select', this).chosen();
        // $("select").chosen({ width: "inherit" }) 
    }
    */
    Cancelar() {
        swal({
            title: 'Salir',
            text: '¿Estas seguro de  Salir?',
            icon: 'warning',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#706f6f',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(function (result) {
            if (result.isConfirmed) {
                RegistroRN.cerrarModal();
                //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
            }

        }).catch(swal.noop);
    },

    cerrarModal() {
        //$('#modalRegistroRN').modal('hide');
        RegistroRN.limpiarmodal();
        MostrarAreaLista();
        ReposicionarVista();
    },

    //////////////////////////////////ELIMINAR//////////////////////////////////////////
    EliminarRegistroRN() {
        accion = 'E';
        var objrow = ObjtableHospitalizadosRn.api(true).row('.selected').data();
        var msg = '';

        if (isEmpty(objrow)) {
            alerta(2, "Debe seleccionar un Registro de Nacimiento a eliminar.");
            return false;
        }
        if (objrow.idRegistroRN == 0 || objrow.bActivo == 0) {
            alerta(2, "No se puede Eliminar. No cuenta con un Registro de Nacimiento.");
            return false;
        }

        if (objrow.idEstadoAtencion == 0) {
            alerta(2, "La cuenta se encuentra Anulada.");
            return false;
        }

        if (objrow.idEstadoAtencion == 2) {
            alerta(2, "La cuenta se encuentra cerrada.");
            return false;
        }

        msg = "Estas seguro de eliminar el Registro de Nacimiento <strong style='font-weight: bold;'>" + objrow.paciente + '</strong>';
        if (objrow.nroCuenta > 0) {
            msg = msg + " <br>  <strong style='text-decoration: underline;'>Nro cuenta: " + objrow.nroCuenta + '</strong>';
        }
        msg = msg + ' ?';

        swal({
            title: 'Eliminar',
            text: msg,
            icon: 'warning',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: '#EF6F6C',
            cancelButtonColor: '#706f6f',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(function (result) {
            if (result.isConfirmed) {
                RegistroRN.Eliminar(objrow.idRegistroRN, objrow.tabla);
            }

        }).catch(swal.noop);;
    },


    Eliminar(IdRegistroRN, Tabla) {
        //var ListDiagnosticos = DiagnosticosPlani.DevolverDiagnosticosPlani();
        var midata = new FormData();
        midata.append('idRegistroRN', IdRegistroRN);
        midata.append('tabla', Tabla);
        //midata.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
        //midata.append('idAccion', 2);

        $.ajax({
            method: "POST",
            url: "/RecienNacido/EliminarRegistroRn?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.respuesta > 0) {
                    alerta(1, datos.mensaje);
                    RegistroRN.cerrarModal();
                    RegistroRN.ListarPacientesRegistroRN();
                } else {
                    alerta(2, datos.mensaje);
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    ///////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////MODAL REPORTES//////////////////////////////////////////////
    AbrirModalReporte() {
        $("#cboTipoReporte").val(1)
        $('.chzn-select').chosen().trigger("chosen:updated");
        this.TipoReporte_Change();
        $("#modalReporte").modal("show");
    },

    CerrarModalReporte() {
        $("#cboTipoReporte").val(1);
        //$("#txtFechaInicioRpt").val("");
        //$("#txtFechaFinRpt").val("");
        $("#txtFechaInicioRpt").datepicker("setDate", FechaDia);
        $("#txtFechaFinRpt").datepicker("setDate", FechaDia);
        $("#modalReporte").modal("hide");
    },

    async GenerarReporteRegistroRn() {
        if ($("#cboTipoReporte").val() == 1) {
            if ($("#txtFechaInicioRpt").val() == "") {
                alerta('2', 'Debe ingresar la fecha inicio.');
                return false;
            }

            //var idCuenta = $("#hdnIdCuentaAtencion").val();
            var FechaInicioRpt = $("#txtFechaInicioRpt").val();
            //var splFecIniRpt = FechaInicioRpt.split("/");
            //FechaInicioRpt = splFecIniRpt[1] + "/" + splFecIniRpt[0] + "/" + splFecIniRpt[2];
            await this.GenerarParteDiarioRn(FechaInicioRpt);
        }
        else {
            if ($("#cboTipoReporte").val() == 2 || $("#cboTipoReporte").val() == 3) {
                if ($("#txtFechaInicioRpt").val() == "") {
                    alerta('2', 'Debe ingresar la fecha inicio.');
                    return false;
                }

                if ($("#txtFechaFinRpt").val() == "") {
                    alerta('2', 'Debe ingresar la fecha fin.');
                    return false;
                }

                let formData = new FormData();
                let urlReporteRn = '';
                let nombreReporteRn = '';
                formData.append('FechaInicio', $("#txtFechaInicioRpt").val());
                formData.append('FechaFin', $("#txtFechaFinRpt").val());
                Cargando(1)

                if ($("#cboTipoReporte").val() == 2) {
                    urlReporteRn = '/RecienNacido/ReporteRegistroRn?area=Hospitalizacion';
                    nombreReporteRn = 'Reporte_Registro_Nacimientos.xlsx';
                }

                if ($("#cboTipoReporte").val() == 3) {
                    urlReporteRn = '/RecienNacido/ReporteEstadisticoRn?area=Hospitalizacion';
                    nombreReporteRn = 'Reporte_Estadistico_Nacimientos.xlsx';
                }

                fetch(urlReporteRn, {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.blob())
                    .then(blob => {
                        var url = window.URL.createObjectURL(blob)
                        var a = document.createElement('a')
                        a.href = url
                        a.download = nombreReporteRn
                        document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
                        a.click();
                        a.remove();  //afterwards we remove the element again
                        alerta2('success', '', 'La descarga se realizo con exito.')
                        Cargando(0)
                    })
                    .catch((e) => {
                        alerta2('danger', '', 'Error al descargar documento, intente nuevamente.')
                        Cargando(0)
                    })

            }
        }
    },

    TipoReporte_Change() {
        //$("#txtFechaInicioRpt").val("");
        //$("#txtFechaFinRpt").val("");
        $("#txtFechaInicioRpt").datepicker("setDate", FechaDia);
        $("#txtFechaFinRpt").datepicker("setDate", FechaDia);

        if ($("#cboTipoReporte").val() == 1) {
            $(".FechaFinRpt").hide();
        }
        else {
            if ($("#cboTipoReporte").val() == 2 || $("#cboTipoReporte").val() == 3) {
                $(".FechaFinRpt").show();
            }
        }
    },

    //////////////////////////////MODAL MIGRACION///////////////////////////////////////
    AbrirModalMigracion() {
        //$("#cboTipoReporte").val(1)
        //$('.chzn-select').chosen().trigger("chosen:updated");
        //this.TipoReporte_Change();
        RegistroRN.LimpiarFiltrosMigracion();
        $("#modalMigracionHistorias").modal("show");
    },

    CerrarModalMigracion() {
        //$("#cboTipoReporte").val(1);
        //$("#txtFechaInicioRpt").val("");
        //$("#txtFechaFinRpt").val("");
        RegistroRN.LimpiarFiltrosMigracion();
        $("#modalMigracionHistorias").modal("hide");
    },
    /////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    async GenerarParteDiarioRn(fecha) {
        Cargando(1);

        var formData = new FormData();
        formData.append('FechaInicio', fecha);

        var url = "/RecienNacido/GenerarReportePdf?area=Hospitalizacion";
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
                    a.download = "ParteDiarioRN-" + fecha + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    AbrirVisorDocumentoPersonalizado(url, "Parte Diario de Partos y Nacimientos");
                }
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }
        }
        request.send(formData);

    },
    ///////////////////////////////////////////////////////////////////////////////


    /************/

    BloquearControles(bDesactivar) {
        if (bDesactivar == false) {
            $("#cboMetodoTemporal").removeAttr('disabled', 'disabled');
            $("#cboMetodoDefinitivo").removeAttr('disabled', 'disabled');
            $("#cboConsulta").removeAttr('disabled', 'disabled');
            $("#cboProcedimientoEntrada").removeAttr('disabled', 'disabled');
            $("#cboEfectoSecundario").removeAttr('disabled', 'disabled');
            $("#cboProcedimiento").removeAttr('disabled', 'disabled');
            $("#txtNroInsumos").removeAttr('disabled', 'disabled');
            $("#cboMedico").removeAttr('disabled', 'disabled');
        } else {

            $("#cboMetodoTemporal").attr('disabled', 'disabled');
            $("#cboMetodoDefinitivo").attr('disabled', 'disabled');
            $("#cboConsulta").attr('disabled', 'disabled');
            $("#cboProcedimientoEntrada").attr('disabled', 'disabled');
            $("#cboEfectoSecundario").attr('disabled', 'disabled');
            $("#cboProcedimiento").attr('disabled', 'disabled');
            $("#txtNroInsumos").attr('disabled', 'disabled');
            $("#cboMedico").attr('disabled', 'disabled');
        }
        $("#cboMetodoTemporal").trigger("chosen:updated");
        $("#cboMetodoDefinitivo").trigger("chosen:updated");
        $("#cboConsulta").trigger("chosen:updated");
        $("#cboProcedimientoEntrada").trigger("chosen:updated");
        $("#cboEfectoSecundario").trigger("chosen:updated");
        $("#cboProcedimiento").trigger("chosen:updated");
        $("#cboMedico").trigger("chosen:updated");
    },


    /***********/

    //////////////////////////////////////TRIAJE RECIEN NACIDOS////////////////////////////////////
    async ListarTriajeRecienNacido() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idPacienteMadre', RegistroRN.IdPacienteMadre);

        try {
            Cargando(1);
            oTable_TriajeRn.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/TriajeRecienNacido/ListarRelacionadosTriajeRn?area=Hospitalizacion",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_TriajeRn.fnAddData(datos.respuesta.table);
                RegistroRN.AbrirModalTriajeRn();
                //oTable_TriajeRn.resize();
            }
            else {
                alerta2("info", "", "No se encontraron triajes recientes relacionados al neonato.")
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarTriajeRecienNacido() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        var objrow = oTable_TriajeRn.api(true).row('.selected').data();
        if (isEmpty(objrow)) {
            alerta2("info", "", "Debe seleccionar un registro de triaje.");
            return false;
        }

        data.append('NroTriajeRn', objrow.idTriajeRn);

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
                RegistroRN.CargarDatosAlForm(datos.respuesta.table[0]);
                RegistroRN.CerrarModalTriajeRn();
                $('#nacimiento-tab-link').trigger('click');
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

    CargarDatosAlForm(datos) {
        //TriajeRn.idTriajeRn = datos.idTriajeRn;
        //TriajeRn.idCuentaMadre = datos.idCuentaMadre;
        RegistroRN.IdTriajeRn = datos.idTriajeRn;

        $("#txtNroCuentaMadre").val(datos.idCuentaMadre);
        $("#txtNroHistoriaMadre").val(datos.nroHistoriaClinica);
        $("#txtNombreMadre").val(datos.madre);
        $("#txtEdadMadre").val(datos.edadMadre);
        $("#txtTipoDocMadre").val(datos.tipoDocMadre);
        $("#txtNroDocMadre").val(datos.nroDocMadre);

        $("#txtFechaNacimiento").datepicker("setDate", datos.fechaNacimientoRn);
        $("#txtHoraNacimiento").val(datos.horaNacimiento);
        $("#cboTipoSexo").val(datos.idTipoSexo);
        $("#cboTipoSexo").trigger("chosen:updated");
        $("#cboTipoGestacion").val(datos.idTipoGestacion);
        $("#cboTipoGestacion").trigger("chosen:updated");
        RegistroRN.TipoGestacion_Change();
        $("#txtNroFetos").val(datos.fetos);
        RegistroRN.Fetos_Change();
        $("#cboNumeroGemelar").val(datos.nroGemelar);
        $("#cboNumeroGemelar").trigger("chosen:updated");
        $("#cboCondicion").val(datos.idCondicion);
        $("#cboCondicion").trigger("chosen:updated");
        RegistroRN.Condicion_Change();
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
        $("#cboContactoPiel").val(datos.idContactoPielaPiel);
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
        RegistroRN.Reanimacion_Change();
        $("#cboTipoReanimacionRn").val(datos.idTipoReanimacion);
        $("#cboTipoReanimacionRn").trigger("chosen:updated");


        $("#txtMinuto").val(datos.alMinuto);
        $("#txt5Minuto").val(datos.alos5Minutos);
        $("#txt10Minuto").val(datos.alos10Minutos);
        $("#txt15Minuto").val(datos.alos15Minutos);
        $("#txt20Minuto").val(datos.alos20Minutos);

        if (datos.patologiaNeonatal == true) {
            $('#rdbPatNeoSi').prop('checked', true);
        } else if (datos.patologiaNeonatal == false) {
            $('#rdbPatNeoNo').prop('checked', true);
        }
        RegistroRN.PatNeo_Change();
        $("#txtEspecificar").val(datos.especificar);

        if (datos.transporte == true) {
            $('#rdbTransporteSi').prop('checked', true);
        } else if (datos.transporte == false) {
            $('#rdbTransporteNO').prop('checked', true);
        }
        RegistroRN.Transporte_Change();
        $("#cboTipoTransporteRn").val(datos.idTipoTransporte);
        $("#cboTipoTransporteRn").trigger("chosen:updated");

    },

    AbrirModalTriajeRn() {
        $("#modalTriajeRn").modal("show");
    },

    CerrarModalTriajeRn() {
        oTable_TriajeRn.fnClearTable();
        $("#modalTriajeRn").modal("hide");
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////

};


$(document).ready(function () {
    //RegistroRN.InicializarComponentesEvaluacionRn();
    RegistroRN.LlenarCombos();
    RegistroRN.InitPlugin();
    //EvaluacionRn.ListarHospitalizados();    
    RegistroRN.Eventos();
    RegistroRN.InitDataTableRecienNacidos();
    RegistroRN.InitDataTablePacientes();
    RegistroRN.InitDataTableTriajeRn();
    RegistroRN.InitDataTableRegistroNacimientos();
    RegistroRN.InitDataTableDiagnosticosRn();
    RegistroRN.InitDataTablePacientesMigrar();
    //ConsumoServicio.Inicializar();        //COMETNADO POR KHOYOSI - PORQUE SE UTILIZARA EN EL MODULO DE NOTA INGRESO

    //InicializarComponentesEvaluacionRn();
    // LlenarCombos();
    //ListarHospitalizados();
    // Eventos();
    //$(".dataTables_scrollHeadInner .table").addClass("table-responsive");
    //$(".dataTables_wrapper .dt-buttons .btn").addClass('btn-secondary').removeClass('btn-default');

    // $('#txtPeso').prop('disabled', false)
    // $('#txtTalla').prop('disabled', false)
    // $('#txtPerCefalico').prop('disabled', false)
    // $('#txtPerToracico').prop('disabled', false)
    // $('#txtEdadGestacional').prop('disabled', false)

    $('#txtPeso').prop('disabled', true)
    $('#txtTalla').prop('disabled', true)
    $('#txtPerCefalico').prop('disabled', true)
    $('#txtPerToracico').prop('disabled', true)
    $('#txtEdadGestacional').prop('disabled', true)

    $('#rdbLacthoraSi').prop('disabled', true)
    $('#rdbLacthoraNO').prop('disabled', true)
    $('#txtTiempoLactancia').prop('disabled', true)

    $('#rdbInmediatoSi').prop('disabled', true)
    $('#rdbInmediatoNO').prop('disabled', true)
    $('#rdbReanimacionSi').prop('disabled', true)
    $('#rdbReanimacionNO').prop('disabled', true)
    $('#cboTipoReanimacionRn').prop('disabled', true)
    $('#txtMinuto').prop('disabled', true)
    $('#txt5Minuto').prop('disabled', true)
    $('#txt10Minuto').prop('disabled', true)
    $('#txt15Minuto').prop('disabled', true)
    $('#txt20Minuto').prop('disabled', true)
    $('#rdbPatNeoSi').prop('disabled', true)
    $('#rdbPatNeoNo').prop('disabled', true)
    $('#txtEspecificar').prop('disabled', true)
    $('#rdbTransporteSi').prop('disabled', true)
    $('#rdbTransporteNO').prop('disabled', true)
    $('#cboTipoTransporteRn').prop('disabled', true)

    $('.chzn-select').chosen().trigger("chosen:updated");
    $(".chzn-select").chosen({ allow_single_deselect: true });
});