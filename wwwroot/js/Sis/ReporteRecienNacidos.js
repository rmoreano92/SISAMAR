let ReporteRecienNacidos = {

    ListarRecienNacidoParaSIS: async function () {

        return HttpClient.Get('/ReportesSis/ListarRecienNacidoParaSIS')
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)

                    oTable_ReporteRecienNacidos.fnClearTable()

                    if (res.lsResultado.table.length > 0) {
                        oTable_ReporteRecienNacidos.fnAddData(res.lsResultado.table)
                    }

                    

                    console.log('Datos de recien nacidos')
                } else {
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })

    },

    InitDatablesReporteRecienNacidos: () => {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        $($(td).parent()[0]).attr('style', 'background: ' + rowData.colorAlerta)
                        $($(td).parent()[0]).attr('class', rowData.claseParpadea)
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "horaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '13%',
                    targets: 3,
                    data: "tipoDocRN",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "nroDocumentoRN",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "sexoRN",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '13%',
                    targets: 6,
                    data: "observacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '7%',
                    targets: 7,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 8,
                    data: "tipoDocMadre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 9,
                    data: "madreDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 10,
                    data: "madreApellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 11,
                    data: "madreApellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 12,
                    data: "madreNombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }

        var tableWrapper = $('#tblReporteRecienNacidos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ReporteRecienNacidos = $("#tblReporteRecienNacidos").dataTable(parms);

    },

    Events: () => {
        $('#btnDescargarReporteRecienNacidos').on('click', () => {

            let formData = new FormData()
            formData.append('FechaInicio', $('#txtFechaInicio').val())
            formData.append('FechaFin', $("#txtFechaFin").val())
            Cargando(1)

            fetch('/ReportesSis/GeneraRptRecienNacidos?area=Sis', {
                method: "POST",
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob)
                    var a = document.createElement('a')
                    a.href = url
                    a.download = "RecienNacidos.xlsx"
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
    },


    InitComponent: async () => {

        
        ReporteRecienNacidos.InitDatablesReporteRecienNacidos()
        await ReporteRecienNacidos.ListarRecienNacidoParaSIS()
        setInterval(async () => {
            await ReporteRecienNacidos.ListarRecienNacidoParaSIS()
        }, 20000)

        ReporteRecienNacidos.Events()
    }
}


$(document).ready(() => {
    ReporteRecienNacidos.InitComponent()
})