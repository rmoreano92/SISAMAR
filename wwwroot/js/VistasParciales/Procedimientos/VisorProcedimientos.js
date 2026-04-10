let VisorProcedimientos = {
    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();
    },
    CargaInicial: async function () {
        //permisoFirma4Identity = await PermisoGeneral.SeleccionarPermisoGeneral("FIRMA4IDENTITY");
        permisoFirma4Identity = 1;
        permisoClasiPaciente = await PermisoGeneral.SeleccionarPermisoGeneral("CLASI_PAC");

    },

    BuscaAtencionesCptCEparaFormatoHIS: function (idCuentaAtencion) { // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        var formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);
       
        Cargando(1)
        oTable_consumoServAtencion.fnClearTable();
        return HttpClient.Post('/ConsumoServicio/BuscaAtencionesCptCEparaFormatoHIS?area=Facturacion', formData)
            .then(res => {
                if (res.session) {
                    if (res.listaCpt.table.length !== 0) {
                        oTable_consumoServAtencion.fnAddData(res.listaCpt.table)
                        Cargando(0)
                    }
                }
                else {
                    location.reload()
                }
            })
            .catch(e => {
                alerta(3, "Error al listar Cpt")
                Cargando(0)
            })

        oTable_consumoServAtencion.resize();
    },
    BuscaAtencionesCptCEparaFormatoHISInterconsulta: function (idCuentaAtencion) { // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
        var formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);
       
        Cargando(1)
        oTable_consumoServAtencion.fnClearTable();
        return HttpClient.Post('/ConsumoServicio/BuscaAtencionesCptCEparaFormatoHISInterconsulta?area=Facturacion', formData)
            .then(res => {
                if (res.session) {
                    if (res.listaCpt.table.length !== 0) {
                        oTable_consumoServAtencion.fnAddData(res.listaCpt.table)
                    }
                    Cargando(0)
                }
                else {
                    location.reload()
                }
            })
            .catch(e => {
                alerta(3, "Error al listar Cpt")
                Cargando(0)
            })

        oTable_consumoServAtencion.resize();
    },

    InitDatablesConsumoAtencion: function () {

        var parms = {
            "scrollY": "150px",
            "scrollCollapse": true,
            "order": [[0, "desc"]],
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstadoFacturacion == 9) {
                            $(td).parent().css('color', '#ef6f6c');
                            $(td).parent().css('font-weight', 'bold');
                        }
                        if (rowData.idEstadoFacturacion == 4) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    data: "idOrdenPago",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblCSAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_consumoServAtencion = $("#tblCSAtencion").dataTable(parms)
    },

    Events: function () {
        $('#tblCSAtencion tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
    }
}



$(document).ready(function () {
    VisorProcedimientos.Plugins()
    VisorProcedimientos.CargaInicial()

    //VisorProcedimientos.InitDatablesConsumoAtencion()

    VisorProcedimientos.Events()
});