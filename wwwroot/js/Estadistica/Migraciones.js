

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

    var GenerarReporte = function () {
        if ($("#txtFechaIni").val() == "") {
            alerta('2', 'Debe ingresar la fecha inicio.');
            return false;
        };
        if ($("#txtFechaFin").val() == "") {
            alerta('2', 'Debe ingresar la fecha fin.');
            return false;
        };

        var FechaInicio = $("#txtFechaIni").val();
        var FechaFin = $("#txtFechaFin").val();
        var splFecIni = FechaInicio.split("/");
        var splFecFin = FechaFin.split("/");
        FechaInicio = splFecIni[1] + "/" + splFecIni[0] + "/" + splFecIni[2];
        FechaFin = splFecFin[1] + "/" + splFecFin[0] + "/" + splFecFin[2];

        if ($("#txtFechaIni").val() == "") {
            alerta('2', 'Debe ingresar la fecha inicio.');
            return false;
        };
        if ($("#txtFechaFin").val() == "") {
            alerta('2', 'Debe ingresar la fecha fin.');
            return false;
        };
        var Tipo = $("#cboServicioAtenciones").val();
        var TipoBusqueda = $("#cboTipoBusqueda").val();

        var url = "/Migracion/GenerarReporteHis?area=Estadistica&Tipo=" + Tipo + "&FecIni=" + FechaInicio + "&FecFin=" + FechaFin + "&TipoBusqueda=" + TipoBusqueda
        window.location.href = url;
    }

    var GenerarReporteDepuracion = function () {


        Cargando(1)
        fetch(`/Migracion/GenerarReporteDepuracion?area=Estadistica`, {
            method: "GET",
        })
            .then(response => response.blob())
            .then(blob => {
                var url = window.URL.createObjectURL(blob)
                var a = document.createElement('a')
                a.href = url
                a.download = "ErroresMigracionHis.xlsx"
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


        //var url = "//?area="
        //window.location.href = url;
    }

    var limpiarValores = function () {

    }
    var fehaDiaActual = function () {
        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy
        return fechaP
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
    var ListaatencionesHis = function () {
        if ($("#txtFechaIni").val() == "") {
            alerta('2', 'Ingrese fecha inicial');
            return false;
        }

        if ($("#txtFechaFin").val() == "") {
            alerta('2', 'Ingrese fecha final');
            return false;
        }

        Cargando(1)
        $("#cboServicioAtenciones").prop("disabled", false)
        $("#txtFechaIni").attr("disabled", false)
        $("#txtFechaFin").attr("disabled", false)
        oTable_AtancionesHis.fnClearTable();

        var midata = new FormData();
        midata.append('Tipo', $('#cboServicioAtenciones').val());
        midata.append('FecIni', $('#txtFechaIni').val());
        midata.append('FecFin', $('#txtFechaFin').val());
        console.log("datos")
        $.ajax({
            method: "POST",
            url: "/Migracion/DevuelveListaAtencionesaCEMigrar?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                console.log(datos)
                Cargando(0)

                if (datos.session) {
                    if ($('#cboServicioAtenciones').val() == 1) {
                        if (datos.lstDatos.table.length > 0) {
                            oTable_AtancionesHis.fnAddData(datos.lstDatos.table);

                            $("#cboServicioAtenciones").prop("disabled", "disabled");
                            $("#txtFechaIni").attr("disabled", true);
                            $("#txtFechaFin").attr("disabled", true);
                            $("#btnBuscar").attr("disabled", true);
                            $("#cboServicioAtenciones").trigger("chosen:updated");
                        }
                        else {
                            Cargando(0)
                        }
                    } else if ($('#cboServicioAtenciones').val() == 2) {
                        if (datos.lstDatos.table.length > 0) {
                            oTable_AtancionesHis.fnAddData(datos.lstDatos.table);

                            $("#cboServicioAtenciones").prop("disabled", "disabled");
                            $("#txtFechaIni").attr("disabled", true);
                            $("#txtFechaFin").attr("disabled", true);
                            $("#btnBuscar").attr("disabled", true);

                            $("#cboServicioAtenciones").trigger("chosen:updated");

                        }
                        else {

                            Cargando(0)
                        }
                    }
                    else {
                        if (datos.lstDatos.table.length > 0) {
                            oTable_AtancionesHis.fnAddData(datos.lstDatos.table);

                            $("#cboServicioAtenciones").prop("disabled", "disabled");
                            $("#txtFechaIni").attr("disabled", true);
                            $("#txtFechaFin").attr("disabled", true);
                            $("#btnBuscar").attr("disabled", true);

                            $("#cboServicioAtenciones").trigger("chosen:updated");

                        }
                        else {

                            Cargando(0)
                        }
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


    var ListarAtencionesCEJsonaMigradas = async function () {
        if ($("#txtFechaIni").val() == "") {
            alerta('2', 'Ingrese fecha inicial');
            return false;
        }

        if ($("#txtFechaFin").val() == "") {
            alerta('2', 'Ingrese fecha final');
            return false;
        }


        let formData = new FormData()

        formData.append('Tipo', $('#cboServicioAtenciones').val());
        formData.append('FecIni', $('#txtFechaIni').val());
        formData.append('FecFin', $('#txtFechaFin').val());

        try {
            const response = await HttpClient.Post(`/Migracion/ListarAtencionesCEJsonaMigradas?area=Estadistica`, formData)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            console.log('Atenciones Migradas', response)

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




    };

    var MigraatencionesHis = async function () {
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
            url: "/Migracion/MigrarDataHisMinsa?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                console.log(datos)
                Cargando(0)

                if (datos.session) {
                    if (datos.respuesta) {

                        swal({
                            title: 'Migracion HIS',
                            text: 'Se realizo la migracion correctamente',
                            type: 'info',
                        }).done();

                        //limpiarCampos();

                        ListarAtencionesCEJsonaMigradas();
                    }
                    else {
                        swal({
                            title: 'Migracion HIS',
                            text: 'Error al realizar migracion',
                            type: 'danger',
                        }).done();

                        limpiarCampos();
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
                    alerta("ERROR", "Error migrar datos", "2");
                }, 900)
            }
        })


    };


    var MigrarDataHisMinsa = async function () {
        if ($("#txtFechaIni").val() == "") {
            alerta('2', 'Ingrese fecha inicial');
            return false;
        }

        if ($("#txtFechaFin").val() == "") {
            alerta('2', 'Ingrese fecha final');
            return false;
        }


        let formData = new FormData()

        formData.append('Tipo', $('#cboServicioAtenciones').val());
        formData.append('FecIni', $('#txtFechaIni').val());
        formData.append('FecFin', $('#txtFechaFin').val());

        Cargando(1)

        try {
            const response = await HttpClient.Post(`/Migracion/MigrarDataHisMinsa?area=Estadistica`, formData)

            if (!response.session) {
                console.log("La sesión ha expirado.")
                return false
            }

            if (!response.estado) {
                console.error(response.msg)
                throw new Error('Error en el servidor')
            }

            const datos = response

            if (datos.data) {

                //const atencionesMigradas = await ListarAtencionesCEJsonaMigradas()

                //oTable_AtancionesHis.fnClearTable()

                //if (atencionesMigradas.length > 0) {
                //    oTable_AtancionesHis.fnAddData(atencionesMigradas)
                //}
                swal({
                    title: 'Migracion HIS',
                    text: 'Se realizo la migracion correctamente',
                    type: 'info',
                }).done();
            }

            console.log('datos', datos)
            Cargando(0)
            return null
        } catch (error) {
            Cargando(0)
            alerta(2, 'Ocurrio un error')
            console.error("Ha ocurrido un error:", error)
            // Puedes lanzar excepciones personalizadas aquí si lo deseas.
            return false
        }


    };

    var DepurarDataMigrada = function () {

        Cargando(1)

        $.ajax({
            method: "POST",
            url: "/Migracion/DepurarDataMigrada?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            //data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {
                    if (datos.respuesta) {

                        swal({
                            title: 'Migracion HIS',
                            text: 'Se realizo la depuración correctamente',
                            type: 'info',
                        }).done();
                    }
                    else {
                        swal({
                            title: 'Migracion HIS',
                            text: 'Error al realizar la depuración',
                            type: 'danger',
                        }).done();
                    }

                    ListaTramaConErrorDepuracion();

                }
                else {
                    Cargando(0);
                    location.reload();
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
            url: "/Migracion/GeneradorJson?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            //data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {
                    if (datos.respuesta) {

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
                    location.reload();
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
            url: "/Migracion/ListaJsonSinEnvio?area=Estadistica",
            //contentType: "application/json; charset=utf-8",
            // data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)

                if (datos.session) {
                    if (datos.lstDatos.table.length > 0) {

                        oTable_jsonPendientes.fnAddData(datos.lstDatos.table);
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
            ListaatencionesHis();
        });
        $('#btnLimpiarFiltro').on('click', function () {
            limpiarCampos();
        });

        $('#btnMigrar').on('click', function () {
            MigrarDataHisMinsa();
        });

        $('#btnDepurar').on('click', function () {
            DepurarDataMigrada();
        });
        $('#btnGeneraReporteDepuracion').on('click', function () {
            GenerarReporteDepuracion();
        });

        $('#btnPendientesJSON').on('click', function () {
            ListaJsonSinEnvio();
        });

        $('#btnGenerarReporte').on('click', function () {
            GenerarReporte();
        })

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
                    width: '20%',
                    targets: 0,
                    data: "idAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: 'fechaIngreso',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: 'codMINSA2020',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 3,
                    data: 'codigoServicioHIS',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,

                {
                    width: '10%',
                    targets: 4,
                    data: 'apellidoMaternoPaciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 5,
                    data: 'apellidoMaternoPaciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 6,
                    data: 'primerNombrePaciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 7,
                    data: 'sexoPaciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 8,
                    data: 'fechaNacimientoPaciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapper2 = $('#tblAtencionesMigrar'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_AtancionesHis = $("#tblAtencionesMigrar").dataTable(parms);


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
                    data: "idAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: 'fechaAtencion',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: 'docPaciente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '20%',
                    targets: 3,
                    data: 'hc',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,

                {
                    width: '20%',
                    targets: 4,
                    data: 'error',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '20%',
                    targets: 5,
                    data: 'fechaMigracion',
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
            //destroy: true,
            responsive: true,
            "autoWidth": false,
            "dom": '<"top"i>rt<"bottom"flp><"clear">',
            scrollCollapse: true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "i_ID",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: 'v_CITA_ORIGEN',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },

                {
                    width: '40%',
                    targets: 2,
                    data: 'v_JSON',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,

                {
                    width: '5%',
                    targets: 3,
                    data: 'i_ESTADO',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 4,
                    data: 'i_ID_CITA',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 5,
                    data: 'v_DESCRIPCION_RESPUESTA',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 6,
                    data: 'd_FECHA_REGISTRO',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }

        var tableWrapper = $('#tblJsonPendientes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_jsonPendientes = $("#tblJsonPendientes").dataTable(parms);


    }

    var initDatablesJsonEnviados = function () {


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
                    width: '5%',
                    targets: 0,
                    data: "i_ID",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: 'v_CITA_ORIGEN',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },

                {
                    width: '40%',
                    targets: 2,
                    data: 'v_JSON',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,

                {
                    width: '5%',
                    targets: 3,
                    data: 'i_ESTADO',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 4,
                    data: 'i_ID_CITA',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 5,
                    data: 'v_DESCRIPCION_RESPUESTA',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
                ,
                {
                    width: '10%',
                    targets: 6,
                    data: 'd_FECHA_REGISTRO',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }

        var tableWrapper = $('#tblJsonEnviados'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_jsonEnviados = $("#tblJsonEnviados").dataTable(parms);


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