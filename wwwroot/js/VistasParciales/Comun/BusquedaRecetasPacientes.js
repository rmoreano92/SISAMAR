var BusqRecetasPacientes = {
    idPuntoCarga: 0,
    esAntimicrobiano: 0,
    esIntervencionSanitaria: 0,

    Iniciar() {
        $('#txtBusquedaRecetaFechaInicio, #txtBusquedaRecetaFechaFinal').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'
        });

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $('#txtBusquedaRecetaFechaInicio, #txtBusquedaRecetaFechaFinal').mask("Dd/Mm/abcd");
               
        BusqRecetasPacientes.CargarFechaHoy();

        BusqRecetasPacientes.DataTableBusquedaRecetas();
        //BusqRecetasPacientes.DataTableAtencionesPacientes();
        BusqRecetasPacientes.Eventos();
            
        
    },

    CargarFechaHoy() {
        let fecha = new Date()
        let dia = fecha.getDate()
        let mes = parseInt(fecha.getMonth()) + 1
        let yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $("#txtBusquedaRecetaFechaInicio").datepicker("setDate", fechaP);
        $("#txtBusquedaRecetaFechaFinal").datepicker("setDate", fechaP);
                
    },

    DataTableBusquedaRecetas() {
        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '45vh',
            autoWidth: false,
            columns: [
                {
                    width: '6%',
                    targets: 0,
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 1,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 2,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },                
                {
                    width: '8%',
                    targets: 7,
                    data: "fechaReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '4%',
                    targets: 10,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.code != '') {
                            let btnRuta = "";
                            let btnImprime = "";
                            let btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirBusquedaRecetaCF btn btn-sm btn-deep-green glow_button"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnImprimeSinF = '<button class="ImprimirBusquedaRecetaSF btn btn-sm btn-deep-orange glow_button"><i class="fa fa-print"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                },
            ]
        }
        var tableWrapper = $('#tblBusquedaRecetasPacientes');
        oTable_BusquedaRecetasPacientes = $("#tblBusquedaRecetasPacientes").dataTable(parms);
        $('#tblBusquedaRecetasPacientes_length').css('display', 'none');
    },

   
    Eventos() {
        $('#btnmodalBusquedaRecetas').on('click', async function () {
            BusqRecetasPacientes.CargarFechaHoy();
            $("#btnBuscarRecetaPacientes").click();
            $('#modalBusquedaRecetas').modal('show');
        });

        $('#btnBuscarDatosPacienteNroReceta').on('click', async function () {
            BusqRecetasPacientes.CargarFechaHoy();
            $("#btnBuscarRecetaPacientes").click();
            $('#modalBusquedaRecetas').modal('show');
        });

        $('.searchRecetaPaciente').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".searchRecetaPaciente").blur();
                $("#btnBuscarRecetaPacientes").click();
            }
        });
        $('#btnBuscarRecetaPacientes').on('click', async function () {
            //let busquedaPacientes = await Ventas.RecetasFiltrarPorRangoFechas();
            await BusqRecetasPacientes.RecetasFiltrarPorRangoFechas();
        });

        $('#btnLimpiarBusquedaRecetaPaciente').on('click', async function () {
            $(".searchRecetaPaciente").val("");
        });

        $('#tblBusquedaRecetasPacientes tbody').on('click', 'tr', async function () {
            oTable_BusquedaRecetasPacientes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let busqueda = oTable_BusquedaRecetasPacientes.api(true).row('.selected').data();
            //await BusqRecetasPacientes.AtencionesPacienteFiltrarTodos(busqueda.idPaciente);
        });
                

        //$('#btnAceptarCAPaciente').on('click', async function () {
        //    let cuenta = oTable_CuentasAtencionesPacientes.api(true).row('.selected').data();
        //    if (cuenta.idEstado != 1) {
        //        alerta2("info", "", "La cuenta seleccionada NO se encuentra ABIERTA.");
        //        return;
        //    }
        //    $(".searchCAPaciente").val("");
        //    oTable_BusquedaRecetasPacientes.fnClearTable();
        //    oTable_CuentasAtencionesPacientes.fnClearTable();
        //    $("#modalBusquedaCuentasAtenciones").modal("hide");
        //    await BusqRecetasPacientes.BuscarNumeroCuenta(cuenta.idCuentaAtencion);
        //});

        $('#btnCerrarModalBusquedaRecetaPaciente').on('click', async function () {
            $(".searchRecetaPaciente").val("");
            oTable_BusquedaRecetasPacientes.fnClearTable();
            $("#modalBusquedaRecetas").modal("hide");
        });

        $('#tblBusquedaRecetasPacientes tbody').on('click', '.ImprimirBusquedaRecetaSF', async function () {
            var objrow = oTable_BusquedaRecetasPacientes.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_BusquedaRecetasPacientes.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
            if (!isEmpty(firma)) {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
                //$('#tblOrdenesMedicas tbody tr').removeClass('selected');
            } else {
                alerta2('warning', '', 'No existe el documento digital.')
            }
            Cargando(0);
        });

        $('#tblBusquedaRecetasPacientes tbody').on('click', '.ImprimirBusquedaRecetaCF', async function () {
            var objrow = oTable_BusquedaRecetasPacientes.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_BusquedaRecetasPacientes.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });
    },

    async RecetasFiltrarPorRangoFechas() {
        let resp = null;
        let recetas = null;

        let midata = new FormData();
        midata.append('NroHistoriaClinica', isNull($('#txtBusquedaRecetaNroHistoria').val(), 0));
        midata.append('NroDocumento', $('#txtBusquedaRecetaDNI').val());
        midata.append('ApellidoPaterno', $('#txtBusquedaRecetaApPaterno').val());        
        midata.append('FechaInicio', $('#txtBusquedaRecetaFechaInicio').val());
        midata.append('FechaFinal', $('#txtBusquedaRecetaFechaFinal').val());
        midata.append('IdPuntoCarga', BusqRecetasPacientes.idPuntoCarga);
        midata.append('EsAntimicrobiano', isNull(BusqRecetasPacientes.esAntimicrobiano, 0));

        try {
            Cargando(1);
            oTable_BusquedaRecetasPacientes.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/RecetasFiltrarPorRangoFechas?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.lstData.table.length > 0) {
                recetas = datos.lstData.table;
                if (BusqRecetasPacientes.esIntervencionSanitaria == 1) {
                    recetas = recetas.filter(function (obj) {
                        return obj.esRecetaIntervencionSanitaria == 1;
                    });
                } else {
                    recetas = recetas.filter(function (obj) {
                        return obj.esRecetaIntervencionSanitaria == 0;
                    });
                }

                if (recetas.length > 0) {
                    oTable_BusquedaRecetasPacientes.fnAddData(recetas);
                    oTable_BusquedaRecetasPacientes.resize();
                }
                
                //resp = datos.lstData.table[0];
            }
        } catch (error) {
            alerta2("error", "", error.toString());
            Cargando(0);
        }
        //return resp;
    },

    //async AtencionesPacienteFiltrarTodos(idPaciente) {
    //    let resp = null;

    //    let midata = new FormData();
    //    midata.append('idPaciente', idPaciente);

    //    try {
    //        Cargando(1);
    //        oTable_CuentasAtencionesPacientes.fnClearTable();
    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Atencion/ListarAtencionesPaciente?area=ConsultaExterna",
    //                data: midata,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });
    //        Cargando(0);
    //        if (datos.respuesta.table.length > 0) {
    //            oTable_CuentasAtencionesPacientes.fnAddData(datos.respuesta.table);
    //            oTable_CuentasAtencionesPacientes.resize();
    //            //resp = datos.lstData.table[0];
    //        }
    //    } catch (error) {
    //        alerta2("error", "", error.toString());
    //        Cargando(0);
    //    }
    //    //return resp;
    //},



}