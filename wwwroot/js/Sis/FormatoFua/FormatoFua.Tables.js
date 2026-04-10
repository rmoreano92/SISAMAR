export class FormatoFuaTables {
    constructor(ctx) {
        this.ctx = ctx
    }

    init() {
        this.DataTablesAtencion()
        this.DataTableInstitucionesEducativas()
    }

    DataTablesAtencion() {
        var parms = {
            paging: true,
            ordering: false,
            info: false,
            searching: false,
            scrollX: true,
            ordering: true,
            columns: [
                {
                    width: "7%",
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    width: "10%",
                    targets: 1,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    width: "10%",
                    targets: 2,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    width: "10%",
                    targets: 3,
                    data: "nombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                        //$(td).html((rowData.primerNombre == null ? '' : rowData.primerNombre.toUpperCase()) + " " + (rowData.segundoNombre == null ? '' : rowData.segundoNombre.toUpperCase()));
                    },
                },
                {
                    width: "7%",
                    targets: 4,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    width: "7%",
                    targets: 5,
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                        //$(td).html(FormatearFecha(rowData.fecNacim));
                    },
                },
                /*{
                            width: '10%',
                            targets: 6,
                            data: "tipoPaciente",
                            createdCell: function (td, cellData, rowData, row, col) {
                                $(td).attr('align', 'left')
        
                            }
                        },*/
                {
                    width: "7%",
                    targets: 7,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    width: "7%",
                    targets: 8,
                    data: "horaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    width: "15%",
                    targets: 9,
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    width: "10%",
                    targets: 10,
                    data: "tipoPlan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    width: "10%",
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css("text-align", "center");
                        if (rowData.idFuenteFinanciamiento == 3) {
                            if (rowData.codeFua != "") {
                                var btnRuta = "";
                                var btnImprime = "";
                                var btnImprimeSinF = "";

                                btnImprimeSinF =
                                    '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                                if (rowData.statusFirmaFua == 0) {
                                    btnRuta =
                                        '<a href="' +
                                        rowData.rutaFua +
                                        '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                                }
                                if (
                                    rowData.statusFirmaFua == 1 ||
                                    rowData.statusFirmaFua == 0
                                ) {
                                    btnImprime =
                                        ' <button class="ImprimeFuaCF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';

                                    //btnRuta = "";
                                }

                                $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);

                                $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                            } else {
                                $(td).html("");
                            }
                        } else {
                            $(td).html("");
                        }

                        /*if (!isEmpty(rowData.fechaRegistroEvaluacion)) {
                                        $(td).parent().css('color', '#347dff');
                                        $(td).parent().css('font-weight', 'bold');
                                    }*/
                    },
                },
            ],
        };

        var tableWrapper = $("#tblAtencion"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        this.ctx.oTable_atenciones = $("#tblAtencion").dataTable(parms);
    }

    DataTableInstitucionesEducativas() {
        let params = {
            paging: true,
            bFilter: false,
            ordering: false,
            info: false,
            responsive: false,
            autoWidth: false,
            columns: [
                {
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    data: "ubigeo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
                {
                    data: "direccion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr("align", "left");
                    },
                },
            ],
        };

        this.ctx.oTable_TableListaInstitucionesEducativas = $(
            "#tblListaInstitucionesEducativas"
        ).dataTable(params);
    }
}