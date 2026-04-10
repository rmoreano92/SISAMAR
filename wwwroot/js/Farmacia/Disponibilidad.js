let Disponibilidad = {
    Plugins: () => {
        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' })
        $(".chzn-select-deselect,#select2_sample").chosen()
    },

    ListarDisponibilidadFarmacia: () => {
        let formData = new FormData()

        Cargando(1)
        oTable_disponibilidad.fnClearTable()
        HttpClient.Post('/ReportesFarmacia/ListarDisponibilidadFarmacia?area=Farmacia', formData)
            .then((res) => {
                if (res.estado) {
                    if (res.dataSet.table.length > 0) {
                        console.log(res.dataSet.table)
                        //console.log('res.dataSet.table.length', res.dataSet.table.length)
                        oTable_disponibilidad.fnAddData(res.dataSet.table)
                    }
                } else {
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },


    InitDatablesDisponibilidad: () => {
        var parms = {
            "scrollY": "600px",
            "scrollCollapse": true,
            "order": [[0, "asc"]],
            data: null,
            destroy: true,
            //info: false,
            //paging: false,
            //responsive: true,
            fixedColumns: true,
            fixedHeader: true,
            scrollX: true,
            columns: [
                {
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "concentracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "presentacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "formaFarmaceutica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "tipo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                //{
                //    data: "mes1",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes2",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes3",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes4",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes5",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes6",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes7",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes8",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes9",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes10",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes11",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    data: "mes12",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    data: "cpma",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "stock",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "rotacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "mesesAbastecidos",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "estado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.estado == 'SOBRE STOCK') {
                            $(td).css('background', '#ffda9e');
                        }
                        if (rowData.estado == 'NORMO STOCK') {
                            $(td).css('background', '#77dd77');
                        }
                        if (rowData.estado == 'SUB STOCK') {
                            $(td).css('background', '#fabfb7');
                        }
                        if (rowData.estado == 'DESABASTECIDO') {
                            $(td).css('background', '#ff6961');
                        }
                        if (rowData.estado == 'No Rota') {
                            //$(td).css('background', '#347dff');
                        }
                        
                    }
                }
            ]
        }

        var tableWrapper = $('#tblDisponibilidad'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_disponibilidad= $("#tblDisponibilidad").dataTable(parms);
    },

    Events: () => {
        $('#btnDescargarExcelDisponibilidad').on('click', () => {

            window.open(
                '/ReportesFarmacia/rptDisponibilidad?area=Farmacia',
                '_blank' // <- This is what makes it open in a new window.
            );
        })
    }
}

$(document).ready(() => {
    Disponibilidad.Plugins()

    Disponibilidad.InitDatablesDisponibilidad()

    Disponibilidad.ListarDisponibilidadFarmacia()

    Disponibilidad.Events()
})