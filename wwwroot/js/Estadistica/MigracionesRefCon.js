

var MIGRACIONES = function () {

    var plugins = function () {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaIni,#txtFechaFin').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'

        });

    }

    var CargaInicial = function () {

        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        //$('#txtFechaIngreso').val(fechaP);

    }
    var ListaTramaConErrorDepuracion = function () {

        oTable_Depurar.fnClearTable();
        Cargando(1)

        $.ajax({
            method: "POST",
            url: "/Migracion/ListaTramaConErrorDepuracion?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
           // data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {
                    oTable_Depurar.fnAddData(datos.lstDatos.table);

                }
                else {
                    Cargando(0);
                    location.reload();
                }


            },
            error: function (msg) {
                Cargando(0)
                setTimeout(function () {
                    alerta("ERROR", "Error listar", "2");
                }, 900)
            }
        })


    };
    var ListaatencionesRefCon = async function () {
        if ($("#txtFechaIni").val() == "") {
            alerta('2', 'Ingrese fecha inicial');
            return false;
        }
        if ($("#txtFechaFin").val() == "") {
            alerta('2', 'Ingrese fecha final');
            return false;
        }

        var midata = new FormData();
        midata.append('FecIni', $('#txtFechaIni').val());
        midata.append('FecFin', $('#txtFechaFin').val());

        Cargando(1)
        oTable_AtancionesHis.fnClearTable();

        $.ajax({
            method: "POST",
            url: "/MigracionRefCon/ListarIntegracionRefCon?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: await function (res) {
                
                if (res.estado) {
                    Cargando(0);
                    if (res.data.table.length > 0) {
                        oTable_AtancionesHis.fnAddData(res.data.table);
                    }
                }
                else {
                    Cargando(0);
                    //location.reload();
                }


            },
            error: function (msg) {
                Cargando(0)
                setTimeout(function () {
                    alerta("ERROR", "Error listar", "2");
                }, 900)
            }
        })


    };

    var MigraatencionesRefCon = function () {
        if ($("#txtFechaIni").val() == "") {
            alerta('2', 'Ingrese fecha inicial');
            return false;
        }
        if ($("#txtFechaFin").val() == "") {
            alerta('2', 'Ingrese fecha final');
            return false;
        }
        var midata = new FormData();
        midata.append('Tipo', $('#cboServicioAtenciones').val());
        midata.append('FecIni', $('#txtFechaIni').val());
        midata.append('FecFin', $('#txtFechaFin').val());

        Cargando(1)

        $.ajax({
            method: "POST",
            url: "/MigracionRefCon/MigrarIntegracionRefCon?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (res) {
                Cargando(0)

                if (res.session) {
                    if (res.estado) {

                        swal({
                            title:'Migracion HIS',
                            text: 'Se realizo la migracion correctamente',
                            type: 'info',
                        }).done();
                    }
                    else {
                        swal({
                            title: 'Migracion HIS',
                            text: 'Error al realizar migracion',
                            type: 'danger',
                        }).done();
                    }

                    limpiarCampos();
                }
                else {
                    Cargando(0);
                    location.reload();
                }


            },
            error: function (msg) {
                Cargando(0)
                setTimeout(function () {
                    alerta("ERROR", "Error migrar datos", "2");
                }, 900)
            }
        })


    };

    var DepurarDataMigrada = function () {

        Cargando(1)

        oTable_AtancionesHis.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/MigracionRefCon/DepurarDataMigradaRefcon?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            //data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (res) {
                Cargando(0)

                if (res.estado) {
                    Cargando(0);
                    if (res.data.table.length > 0) {
                        oTable_AtancionesHis.fnAddData(res.data.table);
                    }
                }
                else {
                    Cargando(0);
                    //location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
                setTimeout(function () {
                    alerta("ERROR", "Error depurar datos", "2");
                }, 900)
            }
        })


    };

    var GeneradorJson = function () {

        Cargando(1)

        $.ajax({
            method: "POST",
            url: "/MigracionRefCon/MigrarIntegracionJsonRefCon?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            //data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                console.log(datos)
                Cargando(0)

                if (datos.session) {
                    if (datos.estado) {

                        swal({
                            title: 'Migracion HIS',
                            text: 'Se realizo la migracion correctamente',
                            type: 'info',
                        }).done();
                    }
                    else {
                        swal({
                            title: 'Migracion HIS',
                            text: 'Error al realizar la migracion',
                            type: 'danger',
                        }).done();
                    }

                    ListaJsonSinEnvio();
                }
                else {
                    Cargando(0);
                   // location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
                setTimeout(function () {
                    alerta("ERROR", "Error depurar datos", "2");
                }, 900)
            }
        })

    };

    var ListaJsonSinEnvio = function () {

        oTable_jsonPendientes.fnClearTable();
        Cargando(1)

        $.ajax({
            method: "POST",
            url: "/MigracionRefCon/ListarIntegracionJsonRefCon?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            // data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (res) {
                Cargando(0)

                console.log(res)
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        oTable_jsonPendientes.fnAddData(res.data.table);
                    }
                }
                else {
                    Cargando(0);
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
                setTimeout(function () {
                    alerta("ERROR", "Error listar", "2");
                }, 900)
            }
        })


    };

    var EnviaTramaRefCon = function () {

        oTable_jsonPendientes.fnClearTable();
        Cargando(1)

        $.ajax({
            method: "POST",
            url: "/MigracionRefCon/MigrarRefCon?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            // data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (res) {
                Cargando(0)

                if (res.estado) {
                    if (res.data.table.length > 0) {
                        oTable_jsonEnviados.fnAddData(res.data.table);
                    }
                }
                else {
                    Cargando(0);
                    if (res.tipo == 2) {
                        if (res.data.table.length > 0) {
                            oTable_jsonEnviados.fnAddData(res.data.table);
                        }
                    }
                    swal({
                        title: 'Error al enviar',
                        text: res.mensaje,
                        type: 'info',
                    }).done();
                }
            },
            error: function (msg) {
                Cargando(0)
                setTimeout(function () {
                    alerta("ERROR", "Error listar", "2");
                }, 900)
            }
        })
    }

    var limpiarCampos = function () {
        Cargando(1);
        $("#txtFechaIni").val("");
        $("#txtFechaFin").val("");
        $("#cboServicioAtenciones").prop("disabled", false)
        $("#txtFechaIni").attr("disabled", false)
        $("#txtFechaFin").attr("disabled", false)
        $("#btnBuscar").attr("disabled", false);
        $("#cboServicioAtenciones").trigger("chosen:updated");
       
        oTable_AtancionesHis.fnClearTable();

        Cargando(0);
    }

    var eventos = function () {
        
        $('#btnGenerarJSON').on('click', function () {
            GeneradorJson();
        });
        $('.nav-link').on('click', function () {
            //alert("prueba");
            $($.fn.dataTable.tables(true)).css('width', '100%');
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
        });
        $('#btnBuscar').on('click', function () {
            ListaatencionesRefCon();
        });
        $('#btnLimpiarFiltro').on('click', function () {
            limpiarCampos();
        });
        $('#btnMigrar').on('click', function () {
            MigraatencionesRefCon();
        });
        $('#btnDepurar').on('click', function () {
            DepurarDataMigrada();
        });
        $('#btnPendientesJSON').on('click', function () {
            ListaJsonSinEnvio();
        });
        $('#btnEnviarJSON').on('click', function () {
            EnviaTramaRefCon();
        });
        $('#btnDepurar').on('click', function () {
            DepurarDataMigrada();
        });
    }

    var initDatablesEvaluaciones = function () {


        var parms = {

            "scrollY": "350px",
            "order": [[0, "desc"]],
            data: null,
            //destroy: true,
            responsive: true,
            "autoWidth": false,
            "dom": '<"top"i>rt<"bottom"flp><"clear">',
            scrollCollapse: true,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "id_cuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: 'p_numdoc',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: 'p_apelpatpac',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 3,
                    data: 'p_apelmatpac',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,

                {
                    width: '10%',
                    targets: 4,
                    data: 'p_nombpac',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 5,
                    data: 'fecha_registro',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '30%',
                    targets: 6,
                    data: 'descripcion_estado',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }

        var tableWrapper2 = $('#tblAtencionesMigrar'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_AtancionesHis= $("#tblAtencionesMigrar").dataTable(parms);


    }

    var initDatablesDepuraciones = function () {


        var parms = {

            "scrollY": "350px",
            "order": [[0, "desc"]],
            data: null,
           //destroy: true,
            responsive: true,
            "autoWidth": false,
            "dom": '<"top"i>rt<"bottom"flp><"clear">',
            scrollCollapse: true,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "id_cuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: 'P_numdoc',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: 'P_apelpatpac',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '20%',
                    targets: 3,
                    data: 'P_apelmatpac',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,

                {
                    width: '20%',
                    targets: 4,
                    data: 'P_nombpac',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '20%',
                    targets: 5,
                    data: 'fecha_registro',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
              
            ]

        }

        var tableWrapper = $('#tblDepurar'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Depurar = $("#tblDepurar").dataTable(parms);


    }

    var initDatablesJsonPendiente = function () {
        var parms = {

            "scrollY": "350px",
            "order": [[0, "desc"]],
            data: null,
            responsive: true,
            "autoWidth": false,
            "dom": '<"top"i>rt<"bottom"flp><"clear">',
            scrollCollapse: true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "id_cuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '40%',
                    targets: 1,
                    data: 'json',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: 'idReferencia',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: 'nro_referencia',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: 'fecha_registro',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: 'fecha_envio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: 'estado',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: 'codRespuesta',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: 'mensajeRespuesta',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblJsonPendientes');
        oTable_jsonPendientes = $("#tblJsonPendientes").dataTable(parms);
    }


    var initDatablesJsonEnviados = function () {
        var parms = {

            "scrollY": "350px",
            "order": [[0, "desc"]],
            data: null,
            responsive: true,
            "autoWidth": false,
            "dom": '<"top"i>rt<"bottom"flp><"clear">',
            scrollCollapse: true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "id_cuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                    }
                },
                {
                    width: '40%',
                    targets: 1,
                    data: 'json',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: 'idReferencia',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: 'nro_referencia',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: 'fecha_registro',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: 'fecha_envio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: 'estado',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: 'codRespuesta',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: 'mensajeRespuesta',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblJsonEnviados');
        oTable_jsonEnviados  = $("#tblJsonEnviados").dataTable(parms);
    }

    return {
        init: function () {
            CargaInicial();
            plugins();
            initDatablesEvaluaciones();
            initDatablesDepuraciones();
            initDatablesJsonPendiente();
            initDatablesJsonEnviados();
            eventos();

        }
    };
}();
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