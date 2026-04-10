var Migracion = {
    DocumentosEmitidos: [],

    CargaInicial() {
        //Referencias.limpiar();

        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaInicioBuscar').val(fechaP);
        $('#txtFechaFinBuscar').val(fechaP);

        /*$("#cboTipoConsulta").attr('disabled', 'disabled');
        $("#cboTipoConsulta").trigger("chosen:updated");
        $("#ceAtencion-tab").css("pointer-events", "none");*/

        $('.modalRefCon').modal({ backdrop: 'static', keyboard: false });
        $('.modalRefCon').modal('hide');

        //EstablecimientosSaludTodos();
        //ListaDepartamentos();

        
    },


    plugins() {


        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: false });
        $(".chzn-select-deselect,#select2_sample").chosen();
        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#txtFechaInicioBuscar,#txtFechaFinBuscar').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");


    },

    Eventos() {
        $('#cboTipoDocumento').on('change', async function () {
            await Migracion.FechaLimiteDocumentosEmitidos();
        });

        $('#btnBuscarDocumentosEmitidos').on('click', async function () {
            await Migracion.BuscarDocumentosEmitidos();
            ReposicionarVista();
        });
    },


    //////////////////////////METODOS CONEXION BD////////////////////////////////
    async FechaLimiteDocumentosEmitidos() {
        var midata = new FormData();
        midata.append('tipo', $('#cboTipoDocumento').val());

        oTable_docEmitidos.fnClearTable();
        Migracion.DocumentosEmitidos = [];

        Cargando(1);
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MigracionDocumentos/FechaLimiteDocumentosEmitidos?area=Economia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            console.log(datos);
            if (datos.session) {
                if (datos.lsResultado.table.length !== 0) {
                    dataRes = datos.lsResultado.table[0];
                    $('#txtFechaInicioBuscar').val(dataRes.fechaSiguiente);
                    swal({
                        title: 'Información',
                        html: "<h4>Fecha de la ultima migración: " + dataRes.fechaUltima + "<br>Fecha opcional para la siguiente migración: " + dataRes.fechaSiguiente + "<b>",
                        type: 'info',
                    }).done();
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, JSON.stringify(error));
        }
    },

    async BuscarDocumentosEmitidos() {
        var midata = new FormData();
        midata.append('fechaInicio', $('#txtFechaInicioBuscar').val());
        midata.append('fechaFin', $('#txtFechaFinBuscar').val());
        midata.append('tipo', $('#cboTipoDocumento').val());

        oTable_docEmitidos.fnClearTable();
        Migracion.DocumentosEmitidos = [];

        Cargando(1);
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/MigracionDocumentos/BuscarDocumentosEmitidos?area=Economia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            //console.log(datos);
            if (datos.session) {
                if (datos.lsResultado.table.length !== 0) {
                    oTable_docEmitidos.fnAddData(datos.lsResultado.table);
                    Migracion.DocumentosEmitidos = datos.lsResultado.table;
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta(3, JSON.stringify(error));
        }
    },

    /////////////////////////INICIALIZAR TABLAS////////////////////////////////
    initDatables() {
        var parms = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            "ordering": true,
            columns: [
                {
                    width: '6%',
                    targets: 0,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        var tipoDoc = '';
                        if (rowData.tipoDocumento == '01') {
                            tipoDoc = 'Factura';
                        }
                        if (rowData.tipoDocumento == '03') {
                            tipoDoc = 'Boleta';
                        }
                        if (rowData.tipoDocumento == '07') {
                            tipoDoc = 'Nota de Crédito';
                        }
                        if (rowData.tipoDocumento == '08') {
                            tipoDoc = 'Nota de Débito';
                        }
                        $(td).attr('align', 'left')
                        $(td).html(tipoDoc);
                    }
                },
                {
                    width: '4%',
                    targets: 1,
                    data: "serieDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "correlativoDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 3,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fechaEmision));
                    }
                },
                {
                    width: '4%',
                    targets: 4,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        var afectoigv = '';
                        if (rowData.afectoIgv == 1) {
                            afectoigv = 'SI';
                        }
                        $(td).attr('align', 'left')
                        $(td).html(afectoigv);
                    }
                },
                {
                    width: '4%',
                    targets: 5,
                    data: 'tipo',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '13%',
                    targets: 5,
                    data: 'nombre',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 5,
                    data: 'direccion',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '4%',
                    targets: 5,
                    data: 'total',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')                      
                    }
                },
                {
                    width: '4%',
                    targets: 6,
                    data: "subTotal",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '4%',
                    targets: 7,
                    data: "totalDescuentos",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '4%',
                    targets: 8,
                    data: "subTotalVenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '4%',
                    targets: 9,
                    data: "totalIGV",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '4%',
                    targets: 10,
                    data: "totalMontoPagar",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '4%',
                    targets: 11,
                    data: "totalImpuesto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                

            ]

        }

        var tableWrapper = $('#tblDocEmitidos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_docEmitidos = $("#tblDocEmitidos").dataTable(parms);


    },


    //////////////////INICO////////////////////////////
    Iniciar() {
        Migracion.CargaInicial();
        Migracion.plugins();
        Migracion.Eventos();
        Migracion.initDatables();
        Migracion.FechaLimiteDocumentosEmitidos();
    }
}