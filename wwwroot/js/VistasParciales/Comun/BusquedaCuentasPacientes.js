var BusqCuentasPacientes = {

    Iniciar() {
        BusqCuentasPacientes.DataTableBusquedaPacientes();
        BusqCuentasPacientes.DataTableAtencionesPacientes();
        BusqCuentasPacientes.Eventos();
    },

    DataTableBusquedaPacientes() {
        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '20vh',
            autoWidth: false,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "fechaHoraNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 7,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblBusquedaCAPacientes');
        oTable_BusquedaCAPacientes = $("#tblBusquedaCAPacientes").dataTable(parms);
        $('#tblBusquedaCAPacientes_length').css('display', 'none');
    },

    DataTableAtencionesPacientes() {
        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '20vh',
            autoWidth: false,
            columns: [
                {
                    width: '7%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "estadoCuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 2,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 3,
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 4,
                    data: "horaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '13%',
                    targets: 5,
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "dTipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 7,
                    data: "edad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '25%',
                    targets: 8,
                    data: "diagnostico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 9,
                    data: "vecesAbierto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblCuentasAtencionesPacientes');
        oTable_CuentasAtencionesPacientes = $("#tblCuentasAtencionesPacientes").dataTable(parms);
        $('#tblCuentasAtencionesPacientes_length').css('display', 'none');
    },

    Eventos() {
        $('#btnmodalBusquedaCuentasAtenciones').on('click', async function () {
            $('#modalBusquedaCuentasAtenciones').modal('show')
        });

        $('.searchCAPaciente').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".searchCAPaciente").blur();
                $("#btnBuscarCAPacientes").click();
            }
        });
        $('#btnBuscarCAPacientes').on('click', async function () {
            //let busquedaPacientes = await Ventas.PacientesFiltrarTodos();
            await BusqCuentasPacientes.PacientesFiltrarTodos();
        });

        $('#btnLimpiarBusquedaCAPaciente').on('click', async function () {
            $(".searchCAPaciente").val("");
        });

        $('#tblBusquedaCAPacientes tbody').on('click', 'tr', async function () {
            oTable_BusquedaCAPacientes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let busqueda = oTable_BusquedaCAPacientes.api(true).row('.selected').data();
            await BusqCuentasPacientes.AtencionesPacienteFiltrarTodos(busqueda.idPaciente);
        });

        $('#tblCuentasAtencionesPacientes tbody').on('click', 'tr', async function () {
            oTable_CuentasAtencionesPacientes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        //$('#btnAceptarCAPaciente').on('click', async function () {
        //    let cuenta = oTable_CuentasAtencionesPacientes.api(true).row('.selected').data();
        //    if (cuenta.idEstado != 1) {
        //        alerta2("info", "", "La cuenta seleccionada NO se encuentra ABIERTA.");
        //        return;
        //    }
        //    $(".searchCAPaciente").val("");
        //    oTable_BusquedaCAPacientes.fnClearTable();
        //    oTable_CuentasAtencionesPacientes.fnClearTable();
        //    $("#modalBusquedaCuentasAtenciones").modal("hide");
        //    await BusqCuentasPacientes.BuscarNumeroCuenta(cuenta.idCuentaAtencion);
        //});

        $('#btnCerrarModalBusquedaCAPaciente').on('click', async function () {
            $(".searchCAPaciente").val("");
            oTable_BusquedaCAPacientes.fnClearTable();
            oTable_CuentasAtencionesPacientes.fnClearTable();
            $("#modalBusquedaCuentasAtenciones").modal("hide");
        });
    },

    async PacientesFiltrarTodos() {
        let resp = null;

        let midata = new FormData();
        midata.append('NroHistoriaClinica', isNull($('#txtBusquedaCAPacienteNroHistoria').val(), 0));
        midata.append('apellidoPaterno', $('#txtBusquedaCAPacienteApPaterno').val());
        midata.append('apellidoMaterno', $('#txtBusquedaCAPacienteApMaterno').val());
        midata.append('primerNombre', $('#txtBusquedaCAPacientePrimerNombre').val());
        midata.append('segundoNombre', '');
        midata.append('idDocIdentidad', '0');
        midata.append('NroDocumento', $('#txtBusquedaCAPacienteDNI').val());
        midata.append('FichaFamiliar', '');

        try {
            Cargando(1);
            oTable_BusquedaCAPacientes.fnClearTable();
            oTable_CuentasAtencionesPacientes.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Paciente/PacientesFiltrarTodos?area=Farmacia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.lstData.table.length > 0) {
                oTable_BusquedaCAPacientes.fnAddData(datos.lstData.table);
                oTable_BusquedaCAPacientes.resize();
                //resp = datos.lstData.table[0];
            }
        } catch (error) {
            alerta2("error", "", error.toString());
            Cargando(0);
        }
        //return resp;
    },

    async AtencionesPacienteFiltrarTodos(idPaciente) {
        let resp = null;

        let midata = new FormData();
        midata.append('idPaciente', idPaciente);

        try {
            Cargando(1);
            oTable_CuentasAtencionesPacientes.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListarAtencionesPaciente?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_CuentasAtencionesPacientes.fnAddData(datos.respuesta.table);
                oTable_CuentasAtencionesPacientes.resize();
                //resp = datos.lstData.table[0];
            }
        } catch (error) {
            alerta2("error", "", error.toString());
            Cargando(0);
        }
        //return resp;
    },



}