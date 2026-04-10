


var controlDrawLabResSegGen = false;
var controlDrawLabResSeg = false;
var SeguimientoPaciente = {

    LabResultadosGenerales: null,

    plugins() {

        


        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $("#SeguimientoCE").hide();
        $("#SeguimnientoEMER").hide();
    },

    initDataTableFarmacia() {

        const self = this;

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            scrollY: '45vh',
            responsive: false,

            scrollX: true,
            autoWidth: false,
            destroy: true,
            columns: [
                {
                    data: "fechaCreacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).text(FormatearFecha(rowData.fechaCreacion) + ' ' + rowData.horaCreacion)

                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            return FormatearFecha(row.fechaCreacion) + ' ' + row.horaCreacion

                        }
                    }
                },
                {
                    data: "desPuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "codigo",
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
                },
                {
                    data: "precioUnitario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "subTotal",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                { // Solo se meustra si es paciente sis
                    data: "cantidadFinanciadaSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //let table = self.ctx.oTable_TableFarmacia;

                    },
                    //render: function (data, type, row, meta) {
                    //    if (type === 'display') {
                    //        //if (self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2) {
                    //        //    return `<input class="input-table input-table-cantidad-sis solo-numero" value="${data}">`;
                    //        //} else {
                    //        //    return data;
                    //        //}

                    //    }
                    //}
                },
                { // Solo se meustra si es paciente sis
                    data: "precioFinanciadoSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //let table = self.ctx.oTable_TableFarmacia;

                    }
                },
                {
                    data: "totalFinanciadoSis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "totalFinanciadoSoat",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "importeExonera",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //let table = self.ctx.oTable_TableFarmacia;
                        
                    },
                    //render: function (data, type, row, meta) {
                    //    if (type === 'display') {
                    //        if (self.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 9 && (row.idEstadoFacturacion == 1 || row.idEstadoFacturacion == 16)) {
                    //            return `<input class="input-table input-table-exonera solo-decimal" value="${data}">`;
                    //        } else {
                    //            return data;
                    //        }

                    //    }
                    //}
                },
                {
                    data: "usuarioExonera",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    data: "cantidadPagar",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "totalPagar",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "cantidadDevuelta",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "estadosFacturacion",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "docReembolso",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "servInternamiento",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "idOrden",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "nroComprobante",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "dfinanciamiento",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "descripcionPorItem",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "movNumero",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "movtipo",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "servicioEstancia",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    data: "idOrdenPago",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},




                //{
                //    data: "fechaDespacho",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //        $(td).text(FormatearFecha(rowData.fechaDespacho) + ' ' + rowData.horaDespacho)
                //    },
                //    render: function (data, type, row, meta) {
                //        if (type === 'display') {
                //            return FormatearFecha(row.fechaDespacho) + ' ' + row.horaDespacho

                //        }
                //    }
                //},

            ],

            //createdRow: function (row, data, dataIndex) {
            //    if (data.idProducto == self.ctx.idPagosACuenta) {
            //        $(row).css('color', '#189fff');
            //        $(row).css('font-weight', 'bold');
            //    } else if (data.idProducto == self.ctx.idDevoluciones) {
            //        $(row).css('color', '#2dc71b');
            //        $(row).css('font-weight', 'bold');
            //    } else if (data.idProducto == 4692) {
            //        $(row).css('color', '#H16CD32');
            //        $(row).css('font-weight', 'bold');
            //    } else if (data.idProducto == 4693) {
            //        $(row).css('color', '#H3049FA');
            //        $(row).css('font-weight', 'bold');
            //    } else if (data.cantidadPagar > 0 && data.idTipoFinanciamiento == 2) {
            //        $(row).css('color', '#FF00FF');
            //        $(row).css('font-weight', 'bold');
            //    }
            //}
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableFarmacia = $("#tblFarmaciaLista").dataTable(parms);

    },


    initDatablesCuenta() {
        var parms = {
            scrollY: '550px',
            order: [[1, "desc"]],
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    visible: false,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    visible: false,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html("<b>Cuenta: " + rowData.idCuentaAtencion + "</b><br> Fecha Ing.: " + rowData.fechaIngreso2 + "<br> Servicio: " + rowData.servicio + "<br><b> Tipo Ser.: " + rowData.tipoServicio + "</b>" + "<br><b> Médico: " + rowData.medico + "</b>")

                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#00ad15');
                            $(td).parent().css('font-weight', 'bold');
                        }
                                                
                        if (rowData.estadoCuenta == 0) {
                            $(td).parent().css('color', 'red');
                            $(td).parent().css('font-weight', 'bold');
                        }

                    }
                }


            ]

        }

        var tableWrapper = $('#tblCuentas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_cuentas = $("#tblCuentas").dataTable(parms);

    },

    IniciarDataTablesEvaluacion() {
        var parms = {
            scrollY: "145px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: "15%",
                    targets: 0,
                    data: "idNumero",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "85%",
                    targets: 1,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblEvaluacionesEmergenciaSegui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_EvaEmerSegui = $("#tblEvaluacionesEmergenciaSegui").dataTable(parms);
    },


    initDatablesDiagnosticos() {
        var parms = {
            "scrollY": "145px",
            order: [[0, "desc"]],
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {

                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html("(" + rowData.codigoCIE2004 + ") " + rowData.descripcion)
                    }
                },
                {
                    data: "subclasDiagnostico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                    }
                }


            ]

        }

        var tableWrapper = $('#tblDiagSgui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_diagnosticosSegui = $("#tblDiagSgui").dataTable(parms);
    },

    initDatablesDiagnosticosEval() {
        var parms = {
            "scrollY": "145px",
            order: [[0, "desc"]],
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {

                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoDiagnostico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')


                    }
                }


            ]

        }

        var tableWrapper = $('#tblDiagEvalSgui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_diagnosticosEvalSegui = $("#tblDiagEvalSgui").dataTable(parms);
    },

    IniciarDataTablesOrdenesMedicas() {
        var parms = {
            scrollY: "250px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: "8%",
                    targets: 0,
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.idEstado == 2) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: "18%",
                    targets: 1,
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: "40%",
                    targets: 2,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "14%",
                    targets: 3,
                    data: "fechaRecetaMedica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "12%",
                    targets: 4,
                    data: "estadoReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "8%",
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.code != '') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirRecetaSeguiCF btn btn-sm btn-deep-green glow_button"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnImprimeSinF = '<button class="ImprimirRecetaSeguiSF btn btn-sm btn-deep-orange glow_button"><i class="fa fa-print"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblOrdenesMedicasSegui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_OrdenesMedicasSegui = $("#tblOrdenesMedicasSegui").dataTable(parms);
    },

    IniciarDataTablesOrdenesMedicasGenerales() {
        var parms = {
            scrollY: "350px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: "6%",
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.idEstado == 2) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: "15%",
                    targets: 1,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: "6%",
                    targets: 2,
                    data: "idReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "12%",
                    targets: 3,
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: "36%",
                    targets: 4,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "10%",
                    targets: 3,
                    data: "fechaRecetaMedica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "9%",
                    targets: 4,
                    data: "estadoReceta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "6%",
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        if (rowData.code != '') {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            if (rowData.statusFirma == 1) {
                                btnImprime = ' <button class="ImprimirRecetaGeneralesSeguiCF btn btn-sm btn-deep-green glow_button"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnImprimeSinF = '<button class="ImprimirRecetaGeneralesSeguiSF btn btn-sm btn-deep-orange glow_button"><i class="fa fa-print"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        } else {
                            $(td).html('');
                        }
                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblOrdenesMedicasGeneralesSegui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_OrdenesMedicasGeneralesSegui = $("#tblOrdenesMedicasGeneralesSegui").dataTable(parms);
    },

    IniciarDataTableslaboratorioMovimientos() {
        var parms = {
            scrollY: "250px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            "drawCallback": function (settings) {
                SeguimientoPaciente.FormatearCeldaLaboratorioMovimientosSeguiInformeGrupo();
            },
            columns: [
                {
                    width: "8%",
                    targets: 0,
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.idEstado == 2) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: "12%",
                    targets: 1,
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: "10%",
                //    targets: 2,
                //    data: "codigo",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: "27%",
                    targets: 2,
                    data: "examen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "25%",
                    targets: 3,
                    data: "ordenaPrueba",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                //{
                //    width: "10%",
                //    targets: 4,
                //    data: "fecha",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: "12%",
                    targets: 4,
                    data: "fechaResultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                //{
                //    width: "5%",
                //    targets: 7,
                //    data: "tieneResultado",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: "8%",
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        let btnRuta = "";
                        let btnImprime = "";
                        let btnImprimeSinF = "";
                        let spanInfo = '<span class="d-none idMovimiento">' + rowData.idMovimiento + '</span><span class="d-none tieneResultadoPdf">' + rowData.tieneResultadoPdf + '</span>';
                        if (rowData.tieneResultado == 'SI') {
                            if (rowData.tienePdf == 1) {
                                if (rowData.code != '') {
                                    if (rowData.statusFirma == 1) {
                                        btnImprime = ' <button class="ImprimirResultadoLabSeguiCF btn btn-sm btn-success glow_button"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnImprimeSinF = '<button class="ImprimirResultadoLabSeguiSF btn btn-sm btn-warning glow_button"><i class="fa fa-eye"></i> </button>';
                                    }
                                    $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF + " " + spanInfo);
                                }
                            } else {
                                $(td).html('SI' + " " + spanInfo);
                            }
                        } else {
                            $(td).html('NO' + " " + spanInfo);
                        }

                    }
                },
                {
                    width: "8%",
                    targets: 6,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        $(td).html('<button class="btn btn-sm btn-indigo layout_btn_prevent btnImprimirGrupoResLabSegui" data-idMovimiento="' + rowData.idMovimiento +'"><i class="fa-sharp fa-solid fa-print"><span class="d-none idMovimiento">' + rowData.idMovimiento + '</span><span class="d-none tieneResultadoPdf">' + rowData.tieneResultadoPdf + '</span></i></button>');

                    },

                }
            ]

        }

        var tableWrapperEmer = $('#tblLaboratorioMovimientosSegui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_LaboratorioMovimientosSegui = $("#tblLaboratorioMovimientosSegui").dataTable(parms);
    },

    FormatearCeldaLaboratorioMovimientosSeguiInformeGrupo() {
        let last = null;
        let rowspan = 1;
        let rowPos = 1;
        let current = '';
        let currentRow = 0;
        let tieneResultadoPdf = 0;
        let primerColor = "#2b00ff0d";
        let segundoColor = "transparent";
        let color = primerColor;
        let controlColor = 1;

        $('#tblLaboratorioMovimientosSegui tbody tr').each(function () {

            //if (controlDrawLabResSeg || isEmpty($(this).attr("role"))) {
            //    return;
            //}

            current = $(this).find("td:eq(5) span.idMovimiento").text(); // Columna sobre la que se hará el rowspan

            if (isEmpty(current)) {
                return;
            }

            if (last === current) {
                tieneResultadoPdf = tieneResultadoPdf + parseInt($(this).find("td:eq(5) .tieneResultadoPdf").text());
                rowspan++;
                $(this).find("td:eq(6)").remove(); // Eliminar la celda si es igual al anterior                
                //console.log(tieneResultadoPdf)
            } else {
                if (!isEmpty(last)) {
                    controlColor = controlColor * -1;
                    if (controlColor == 1) {
                        color = primerColor;
                    } else {
                        color = segundoColor;
                    }

                    if (rowspan > 1) {
                        $("#tblLaboratorioMovimientosSegui tbody").find("tr:eq(" + rowPos + ")").find("td:eq(6)").attr('rowspan', rowspan);
                    }

                    if (tieneResultadoPdf == 0) {
                        $("#tblLaboratorioMovimientosSegui tbody").find("tr:eq(" + rowPos + ")").find("td:eq(6)").find("button").remove();
                    }

                }


                last = current;
                rowspan = 1;
                rowPos = currentRow
                tieneResultadoPdf = 0;
            }

            $(this).css("background-color", color);
            currentRow++;
            
        });

        // Para la última celda
        if (rowspan > 1) {
            $("#tblLaboratorioMovimientosSegui tbody").find("tr:eq(" + rowPos + ")").find("td:eq(6)").attr('rowspan', rowspan);
        }

        if (tieneResultadoPdf == 0) {
            $("#tblLaboratorioMovimientosSegui tbody").find("tr:eq(" + rowPos + ")").find("td:eq(6)").find("button").remove();
        }

        //controlDrawLabResSeg = true;
        //console.log(current)
        //console.log(tienePdf)
    },

    IniciarDataTableslaboratorioMovimientosGenerales() {
        //oTable_LaboratorioMovimientosGeneralesSegui = $("#tblLaboratorioMovimientosGeneralesSegui").dataTable();
        var parms = {
            scrollY: "350px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            "drawCallback": function (settings) {
                SeguimientoPaciente.FormatearCeldaLaboratorioMovimientosGeneralesSeguiInformeGrupo();
            },
            columns: [
                {
                    width: "6%",
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.idEstado == 2) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: "12%",
                    targets: 1,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: "6%",
                    targets: 2,
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "10%",
                    targets: 3,
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: "27%",
                    targets: 4,
                    data: "examen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "17%",
                    targets: 5,
                    data: "ordenaPrueba",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "10%",
                    targets: 6,
                    data: "fechaResultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "6%",
                    targets: 7,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        let btnRuta = "";
                        let btnImprime = "";
                        let btnImprimeSinF = "";
                        let spanInfo = '<span class="d-none idMovimiento">' + rowData.idMovimiento + '</span><span class="d-none tieneResultadoPdf">' + rowData.tieneResultadoPdf + '</span>';
                        if (rowData.tieneResultado == 'SI') {
                            if (rowData.tienePdf == 1) {
                                if (rowData.code != '') {
                                    if (rowData.statusFirma == 1) {
                                        btnImprime = ' <button class="ImprimirResultadoLabGeneralesSeguiCF btn btn-sm btn-success glow_button"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnImprimeSinF = '<button class="ImprimirResultadoLabGeneralesSeguiSF btn btn-sm btn-warning glow_button"><i class="fa fa-eye"></i> </button>';
                                    }
                                    $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF + " " + spanInfo);
                                }
                            } else {
                                $(td).html('SI' + " " + spanInfo);
                            }
                        } else {
                            $(td).html('NO' + " " + spanInfo);
                        }

                    }
                },
                {
                    width: "6%",
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        $(td).html('<button class="btn btn-sm btn-indigo layout_btn_prevent btnImprimirGrupoResLabSegui" data-idMovimiento="' + rowData.idMovimiento +'"><i class="fa-sharp fa-solid fa-print"></i></button>');
                        
                    },

                }
            ]

        }

        var tableWrapperEmer = $('#tblLaboratorioMovimientosGeneralesSegui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_LaboratorioMovimientosGeneralesSegui = $("#tblLaboratorioMovimientosGeneralesSegui").dataTable(parms);
    },

    FormatearCeldaLaboratorioMovimientosGeneralesSeguiInformeGrupo() {
        let last = null;
        let rowspan = 1;
        let rowPos = 0;
        let current = '';
        let currentRow = 0;     
        let tieneResultadoPdf = 0;
        let primerColor = "#2b00ff0d";
        let segundoColor = "transparent";        
        let color = primerColor;
        let controlColor = 1;

        $('#tblLaboratorioMovimientosGeneralesSegui tbody tr').each(function () {
            //if (typeof oTable_LaboratorioMovimientosGeneralesSegui == "undefined") {
            //    return
            //}

            //if (oTable_LaboratorioMovimientosGeneralesSegui.fnGetData().length == 0 || controlDrawLabResSegGen || isEmpty($(this).attr("role"))) {
            //    return;
            //}

            current = $(this).find("td:eq(7) span.idMovimiento").text(); // Columna sobre la que se hará el rowspan

            if (isEmpty(current)) {
                return;
            }

            if (last === current) {
                tieneResultadoPdf = tieneResultadoPdf + parseInt($(this).find("td:eq(7) .tieneResultadoPdf").text());
                rowspan++;
                $(this).find("td:eq(8)").remove(); // Eliminar la celda si es igual al anterior                
                //console.log(tieneResultadoPdf)
            } else {
                if (!isEmpty(last)) {
                    controlColor = controlColor * -1;
                    if (controlColor == 1) {
                        color = primerColor;
                    } else {
                        color = segundoColor;
                    }

                    if (rowspan > 1) {
                        $("#tblLaboratorioMovimientosGeneralesSegui tbody").find("tr:eq(" + rowPos + ")").find("td:eq(8)").attr('rowspan', rowspan);                        
                    }

                    if (tieneResultadoPdf == 0) {
                        $("#tblLaboratorioMovimientosGeneralesSegui tbody").find("tr:eq(" + rowPos + ")").find("td:eq(8)").find("button").remove();
                    } 
                    
                }


                last = current;
                rowspan = 1;
                rowPos = currentRow
                tieneResultadoPdf = 0;
            }

            $(this).css("background-color", color);
            currentRow++;
            
        });

        // Para la última celda
        if (rowspan > 1) {
            $("#tblLaboratorioMovimientosGeneralesSegui tbody").find("tr:eq(" + rowPos + ")").find("td:eq(8)").attr('rowspan', rowspan);
        }

        if (tieneResultadoPdf == 0) {
            $("#tblLaboratorioMovimientosGeneralesSegui tbody").find("tr:eq(" + rowPos + ")").find("td:eq(8)").find("button").remove();
        } 

        //controlDrawLabResSegGen = true;
        //console.log(current)
        //console.log(tienePdf)
    },

    IniciarDataTablesImagenesMovimientos() {
        var parms = {
            scrollY: "250px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: "8%",
                    targets: 0,
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.idEstado == 2) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: "15%",
                    targets: 1,
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: "10%",
                //    targets: 2,
                //    data: "codigo",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: "32%",
                    targets: 2,
                    data: "examen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "25%",
                    targets: 3,
                    data: "ordenaPrueba",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                //{
                //    width: "10%",
                //    targets: 4,
                //    data: "fecha",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: "12%",
                    targets: 4,
                    data: "fechaResultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                //{
                //    width: "5%",
                //    targets: 7,
                //    data: "tieneResultado",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: "8%",
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        if (rowData.tieneResultado == 'SI') {
                            if (rowData.tienePdf == 1) {
                                if (rowData.code != '') {
                                    if (rowData.statusFirma == 1) {
                                        btnImprime = ' <button class="ImprimirResultadoImgSeguiCF btn btn-sm btn-success glow_button"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnImprimeSinF = '<button class="ImprimirResultadoImgSeguiSF btn btn-sm btn-warning glow_button"><i class="fa fa-eye"></i> </button>';
                                    }
                                    $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                                }
                            } else {
                                $(td).html('SI');
                            }
                        } else {
                            $(td).html('NO');
                        }

                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblImagenesMovimientosSegui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_ImagenesMovimientosSegui = $("#tblImagenesMovimientosSegui").dataTable(parms);
    },

    IniciarDataTablesImagenesMovimientosGenerales() {
        var parms = {
            scrollY: "350px",
            scrollCollapse: true,
            autoWidth: false,
            ordering: false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: "6%",
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.idEstado == 2) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: "15%",
                    targets: 1,
                    data: "servicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: "6%",
                    targets: 2,
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    width: "10%",
                    targets: 3,
                    data: "puntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: "27%",
                    targets: 4,
                    data: "examen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "20%",
                    targets: 5,
                    data: "ordenaPrueba",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "10%",
                    targets: 6,
                    data: "fechaResultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: "6%",
                    targets: 7,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        if (rowData.tieneResultado == 'SI') {
                            if (rowData.tienePdf == 1) {
                                if (rowData.code != '') {
                                    if (rowData.statusFirma == 1) {
                                        btnImprime = ' <button class="ImprimirResultadoImgGeneralesSeguiCF btn btn-sm btn-success glow_button"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnImprimeSinF = '<button class="ImprimirResultadoImgGeneralesSeguiSF btn btn-sm btn-warning glow_button"><i class="fa fa-eye"></i> </button>';
                                    }
                                    $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                                }
                            } else {
                                $(td).html('SI');
                            }
                        } else {
                            $(td).html('NO');
                        }

                    }
                }
            ]

        }

        var tableWrapperEmer = $('#tblImagenesMovimientosGeneralesSegui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_ImagenesMovimientosGeneralesSegui = $("#tblImagenesMovimientosGeneralesSegui").dataTable(parms);
    },

    IniciarDataTableResultados() {
        var parms = {
            "scrollY": "440px",
            "scrollCollapse": true,
            "targets": 'no-sort',
            "bSort": false,
            //data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //buttons: ['copy', 'csv', 'print']
            //columns: [                            

        }

        var tableWrapper = $('#tblResultadosExamenesSegui'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_resultadosOrdenesSegui = $("#tblResultadosExamenesSegui").dataTable(parms);
        $('#tblResultadosExamenesSegui_length').css('display', 'none')
        $('#tblResultadosExamenesSegui').DataTable().columns.adjust();

    },



    async BuscarPaciente() {
        controlDrawLabResSeg = false;
        controlDrawLabResSegGen = false;
        if (!isEmpty($('#txtNroHistoria').val()) || !isEmpty($('#txtNroDocumento').val())) {
            SeguimientoPaciente.limpiaDatos();
            SeguimientoPaciente.limpiaDatosEval();

            $('#lblDatosAtencionCuenta').html("");
            $('#lblDatosAtencionFechaIngreso').html("");
            $('#lblDatosAtencionServicio').html("");
            $('#lblDatosAtencionTipoServicio').html("");

            $("#SeguimientoCE").hide();
            $("#SeguimnientoEMER").hide();

            //SeguimientoPaciente.llendaDatos($('#txtNroHistoria').val(), 1)
            await SeguimientoPaciente.llenaDatos($('#txtNroHistoria').val(), $('#txtNroDocumento').val(), 1);
        }
    },

    async llenaDatos(historia, documento, valor) {
        let datos;
        var data = new FormData();

        if (valor == 0) {
            $('#txtNroHistoria').attr('disabled', true);

        }
        else {
            $('#txtNroHistoria').attr('disabled', false);

        }
        $('#txtNombres').val("");
        $('#txtNombres').attr('disabled', true);
        $('#txtNroHistoria').val(historia)
        $('#txtNroDocumento').val(documento)

        oTable_cuentas.fnClearTable();
                SeguimientoPaciente.LabResultadosGenerales = null;

        oTable_OrdenesMedicasGeneralesSegui.fnClearTable();
        oTable_LaboratorioMovimientosGeneralesSegui.fnClearTable();
        oTable_ImagenesMovimientosGeneralesSegui.fnClearTable();

        oTable_OrdenesMedicasSegui.fnClearTable();
        oTable_LaboratorioMovimientosSegui.fnClearTable();
        oTable_ImagenesMovimientosSegui.fnClearTable();

        //OrdenesYResultados.limpiarCatalogo();
        //OrdenesYResultados.limpiarREsultadosGenerales();

        data.append('nroHistoria', historia);
        data.append('nroDocumento', documento);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Paciente/PacienteBuscarPorFiltro?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos.lsPacientes.table[0])) {
                var idPaciente = datos.lsPacientes.table[0]["idPaciente"];
                $('#txtNombres').val(datos.lsPacientes.table[0]["apellidoPaterno"] + ' ' + datos.lsPacientes.table[0]["apellidoMaterno"] + ' ' + datos.lsPacientes.table[0]["primerNombre"] + ' ' + isNull(datos.lsPacientes.table[0]["segundoNombre"], ''));

                await SeguimientoPaciente.listaCuentasPaciente(idPaciente);
                await SeguimientoPaciente.CargarOrdenesMedicasPorIdPaciente(idPaciente);
                await SeguimientoPaciente.CargarLaboratorioMovimientosPorIdPaciente(idPaciente);
                await SeguimientoPaciente.CargarImagenesMovimientosPorIdPaciente(idPaciente);

                //SE CREARA UN SP [web_farmMovimientoVentasDetalleXidPaciente]
                await SeguimientoPaciente.CargarMovimientosFarmaciaPorIdPaciente(idPaciente);
            } else {
                alerta2("info", '', 'La historia del paciente que esta buscando no existe.')
            }
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    //area=ConsultaExterna
    async CargarMovimientosFarmaciaPorIdPaciente(idPaciente) {
        let datos;
        var data = new FormData();

        data.append('idPaciente', idPaciente);
        data.append('orden', 1);

        try {
            //oTable_OrdenesMedicasGeneralesSegui.fnClearTable();
            oTable_TableFarmacia.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/MovimientosFarmaciaPorIdPaciente?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length !== 0) {
                //console.log(datos.table);
                oTable_TableFarmacia.fnAddData(datos.table)
            }
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    async listaCuentasPaciente(idPaciente) {
        let datos;
        var data = new FormData();

        data.append('idPaciente', idPaciente);

        try {
            //oTable_OrdenesMedicasGeneralesSegui.fnClearTable();
            oTable_cuentas.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/AtencionesXidPaciente?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length !== 0) {
                //console.log(datos.table);
                oTable_cuentas.fnAddData(datos.table)
            }
        } catch (error) {
            alerta2('danger', '', error);
        }
    },

    listaDiagosticos() {
        oTable_diagnosticosSegui.fnClearTable()
        var objrow = oTable_cuentas.api(true).row('.selected').data();
        var midata = new FormData();
        midata.append('idAtencion', objrow.idAtencion);

        $.ajax({

            method: "POST",
            url: "/Atencion/AtencionesDiagnosticosSeleccionarXidAtencion?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                diagnosticos = "";
                if (datos.table.length !== 0) {
                    if (!isEmpty(datos.table)) {

                        oTable_diagnosticosSegui.fnAddData(datos.table)
                    }
                }
                else {
                    Cargando(0)
                }



            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    async listaDiagosticosPorEvaluacion(idAtencion, idServicio, nroEvaluacion, clasificacion) {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        data.append('idAtencion', idAtencion);
        data.append('idServicio', idServicio);
        data.append('clasificacionDiagnostico', clasificacion);
        data.append('nroEvaluacion', nroEvaluacion);

        oTable_diagnosticosEvalSegui.fnClearTable()
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/DiagnosticosSeleccionarPorAtencionPorNumeroEvaluacion?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            resp = true;
            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {
                    oTable_diagnosticosEvalSegui.fnAddData(datos.table)
                }
            }
        } catch (error) {
            resp = false;
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

    },

    async CargarOrdenesMedicasPorIdPaciente(idPaciente) { // KHOYOSI
        //var resp = [];
        let datos;
        var data = new FormData();

        data.append('idPaciente', idPaciente);

        try {
            oTable_OrdenesMedicasGeneralesSegui.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListarOrdenesMedicasPorIdPaciente?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                oTable_OrdenesMedicasGeneralesSegui.fnAddData(datos.table);
            }
        } catch (error) {
            alerta(3, error);
        }

        //return resp;
    },

    async CargarOrdenesMedicasPorIdCuentaAtencion(idCuenta) { // KHOYOSI
        //var resp = [];
        let datos;
        var data = new FormData();

        data.append('idCuentaAtencion', idCuenta);

        try {
            oTable_OrdenesMedicasSegui.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListarOrdenesMedicasPorIdCuentaAtencion?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                oTable_OrdenesMedicasSegui.fnAddData(datos.table);
            }
        } catch (error) {
            alerta(3, error);
        }

        //return resp;
    },

    async CargarLaboratorioMovimientosPorIdCuentaAtencion(idCuenta) {
        //var resp = [];
        let datos;
        var data = new FormData();

        data.append('idCuentaAtencion', idCuenta);

        try {
            oTable_LaboratorioMovimientosSegui.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/LaboratorioResultados/ListarMovimientosPorCuenta?area=Laboratorio",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                oTable_LaboratorioMovimientosSegui.fnAddData(datos.table);
            }
        } catch (error) {
            alerta(3, error);
        }
        //return resp;
    },

    async CargarLaboratorioMovimientosPorIdPaciente(idPaciente) {
        //var resp = [];
        let datos;
        var data = new FormData();

        data.append('idPaciente', idPaciente);

        try {
            oTable_LaboratorioMovimientosGeneralesSegui.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/LaboratorioResultados/ListarMovimientosPorIdPaciente?area=Laboratorio",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                oTable_LaboratorioMovimientosGeneralesSegui.fnAddData(datos.table);
                
            }
        } catch (error) {
            alerta(3, error);
        }
        //return resp;
    },

    async CargarImagenesMovimientosPorIdCuentaAtencion(idCuenta) {
        //var resp = [];
        let datos;
        var data = new FormData();

        data.append('idCuentaAtencion', idCuenta);

        try {
            oTable_ImagenesMovimientosSegui.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenesResultados/ListarMovimientosPorCuenta?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                oTable_ImagenesMovimientosSegui.fnAddData(datos.table);
            }
        } catch (error) {
            alerta(3, error);
        }
        //return resp;
    },

    async CargarImagenesMovimientosPorIdPaciente(idPaciente) {
        //var resp = [];
        let datos;
        var data = new FormData();

        data.append('idPaciente', idPaciente);

        try {
            oTable_ImagenesMovimientosGeneralesSegui.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenesResultados/ListarMovimientosPorIdPaciente?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                oTable_ImagenesMovimientosGeneralesSegui.fnAddData(datos.table);
            }
        } catch (error) {
            alerta(3, error);
        }
        //return resp;
    },

    async CargarResultadosImagenesLaboratorio(idProducto, idOrden, tipo) {
        var hmltTabla = "";
        var data = new FormData();

        data.append('idOrden', idOrden);
        data.append('idProducto', idProducto);
        data.append('tipo', tipo);

        try {
            oTable_resultadosOrdenesSegui.fnClearTable();
            $('#lblNombreExamenSegui').html("");
            $('#tbodyResultadosSegui').html("");
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarResultadosLabImg?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.lsResultados.table.length > 0) {
                var resultados = datos.lsResultados.table;
                var idGrupoRes = 0
                var idItemRes = 0
                resultados.forEach(function (valor) {
                    $('#lblNombreExamenSegui').html(valor.producto);
                    if (valor.idGrupo != idGrupoRes) {
                        idGrupoRes = valor.idGrupo;
                        hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;font-weight:bold'><td colspan='3'><b>" + valor.grupo + "</b> </td></tr>";
                    }

                    if (valor.idItem != idItemRes) {
                        idItemRes = valor.idItem;
                        hmltTabla = hmltTabla + "<tr><td>" + valor.item + " </td><td>" + valor.valor + "</td><td>" + valor.valorReferencial + "</td></tr>";
                    }
                    $('#txtObserOrdResSegui').val(valor.observaciones + '\n' + valor.conclusiones);
                });
                $('#tbodyResultadosSegui').html(hmltTabla);
                $('#modalResultadosLabImgSegui').modal('show');

            } else {
                alerta2('info', '', 'No existen resultados para el examen seleccionado.');
            }
        } catch (error) {
            alerta(3, error);
        }

    },

    async SeleccionarEvaluacionDetalle(idAtencion, idServicio) {
        SeguimientoPaciente.limpiaDatosEval();
        oTable_EvaEmerSegui.fnClearTable();
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);

        try {
            Cargando(1);
            datos = await $.ajax({
                method: "POST",
                url: "/EvaluacionEmergencia/SeleccionarEvaluacionDetalle?area=Emergencia",
                //contentType: "application/json; charset=utf-8",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                async: false,
                success: function (datos) {
                    Cargando(0);
                    if (datos.session) {
                        if (datos.respuesta.table.length > 0) {
                            oTable_EvaEmerSegui.fnAddData(datos.respuesta.table);
                        }
                    }
                    else {
                        alert("La sesion ya expiro se volvera a recargar la pagina")
                        location.reload();
                    }
                }
            })
        } catch (error) {
            alerta(3, error);
        }
    },

    CargarRecetaDetalle(data) {
        const receta = [];
        receta.push(data);
        OrdenesYResultados.CargarDatosRecetaDetalle(receta);
    },

    llenaOtrosDatos() {
        var objrow = oTable_cuentas.api(true).row('.selected').data();
        $('#txtMotivoConsultaSeg').val(objrow.citaMotivo)
        $('#txtExamenClinicoSeg').val(objrow.citaExamenClinico)
        $('#txtPlandeTrabajoSeg').val(objrow.planTrabajo)

        $('#txtTratamientoSeg').val(objrow.tratamiento)
        //$('#txtAntecedenRelacionadosSeg').val(objrow.citaAntecedente)
    },

    llenaOtrosDatosEval() {
        var objrow = oTable_EvaEmerSegui.api(true).row('.selected').data();
        $('#txtImpresionDxEmerSeg').val(objrow.seguimiento);
        $('#txtPlandeTrabajoEmerSeg').val(objrow.plandeTrabajo);
        $('#txtTratamientoEmerSeg').val(objrow.indicaciones);
    },

    limpiaDatos() {
        oTable_cuentas.fnClearTable();
        oTable_diagnosticosSegui.fnClearTable();
        oTable_OrdenesMedicasSegui.fnClearTable();
        oTable_LaboratorioMovimientosSegui.fnClearTable();
        oTable_ImagenesMovimientosSegui.fnClearTable();
        $('#txtMotivoConsultaSeg').val("");
        $('#txtExamenClinicoSeg').val("");
        $('#txtPlandeTrabajoSeg').val("");
        $('#txtTratamientoSeg').val("");
        //$('#txtAntecedenRelacionadosSeg').val("");
        $('#tabSeguimientoGenerales a[href="#atencionesGeneralesSegui"]').tab('show')
        $('#tabSeguimiento a[href="#diagnosticoCons"]').tab('show')
    },

    limpiaDatosEval() {
        oTable_EvaEmerSegui.fnClearTable();
        oTable_diagnosticosEvalSegui.fnClearTable();
        $('#txtImpresionDxEmerSeg').val("");
        $('#txtPlandeTrabajoEmerSeg').val("");
        $('#txtTratamientoEmerSeg').val("");
    },

    eventos() {
        
       

        //$('#btnBuscarPaciente').on("click", async function (event) {
        //    SeguimientoPaciente.limpiaDatos();
        //    SeguimientoPaciente.limpiaDatosEval();

        //    $('#lblDatosAtencionCuenta').html("");
        //    $('#lblDatosAtencionFechaIngreso').html("");
        //    $('#lblDatosAtencionServicio').html("");
        //    $('#lblDatosAtencionTipoServicio').html("");

        //    $("#SeguimientoCE").hide();
        //    $("#SeguimnientoEMER").hide();

        //    //SeguimientoPaciente.llendaDatos($('#txtNroHistoria').val(), 1)
        //    await SeguimientoPaciente.llenaDatos($('#txtNroHistoria').val(), 1);
        //});

        $('#btnBuscarPacienteHistoria').on("click", async function (event) {
            await SeguimientoPaciente.BuscarPaciente();
            $('#txtNroDocumento').val("");
        });

        $('#btnBuscarPacienteDocumento').on("click", async function (event) {
            await SeguimientoPaciente.BuscarPaciente();
            $('#txtNroHistoria').val("");
        });

        $('#txtNroHistoria').on("keyup", async function (event) {


            

            if (event.keyCode === 13) {

                //listaPacientes = await Api.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion)
                

                //SeguimientoPaciente.limpiaDatos();
                //SeguimientoPaciente.limpiaDatosEval();

                //$('#lblDatosAtencionCuenta').html("");
                //$('#lblDatosAtencionFechaIngreso').html("");
                //$('#lblDatosAtencionServicio').html("");
                //$('#lblDatosAtencionTipoServicio').html("");

                //$("#SeguimientoCE").hide();
                //$("#SeguimnientoEMER").hide();

                //SeguimientoPaciente.llendaDatos($('#txtNroHistoria').val(), 1)
                //await SeguimientoPaciente.llenaDatos($('#txtNroHistoria').val(), 1);
                $('#txtNroDocumento').val("");
                await SeguimientoPaciente.BuscarPaciente();
            }
        });

        $('#txtNroDocumento').on("keyup", async function (event) {
            if (event.keyCode === 13) {
                //SeguimientoPaciente.limpiaDatos();
                //SeguimientoPaciente.limpiaDatosEval();

                //$('#lblDatosAtencionCuenta').html("");
                //$('#lblDatosAtencionFechaIngreso').html("");
                //$('#lblDatosAtencionServicio').html("");
                //$('#lblDatosAtencionTipoServicio').html("");

                //$("#SeguimientoCE").hide();
                //$("#SeguimnientoEMER").hide();

                //SeguimientoPaciente.llendaDatos($('#txtNroHistoria').val(), 1)
                //await SeguimientoPaciente.llenaDatos($('#txtNroHistoria').val(), 1);
                $('#txtNroHistoria').val("");
                await SeguimientoPaciente.BuscarPaciente();
            }
        });

        $('#tblCuentas tbody').on('click', 'tr', async function () {

            //if ($(this).hasClass('selected')) {
            //    $(this).removeClass('selected');

            //}
            //else {              
            controlDrawLabResSeg = false;

            $("#SeguimientoCE").hide();
            $("#SeguimnientoEMER").hide();

            oTable_cuentas.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('.nav-tabs a[href="#diagnosticoCons"]').tab('show');
            var objrow = oTable_cuentas.api(true).row('.selected').data();
            if (!isEmpty(objrow)) {
                $('#lblDatosAtencionCuenta').html("Cuenta: " + objrow.idCuentaAtencion);
                $('#lblDatosAtencionFechaIngreso').html("Fecha Ing.: " + objrow.fechaIngreso2);
                $('#lblDatosAtencionServicio').html("Servicio: " + objrow.servicio);
                $('#lblDatosAtencionTipoServicio').html("Tipo Servicio: " + objrow.tipoServicio);

                if (objrow.idTipoServicio == 1 || objrow.idTipoServicio == 3) {
                    $("#SeguimientoCE").show();

                    $('#btnVerInformeAtencionSF').hide();
                    $('#btnVerInformeAtencionCF').hide();
                    if (objrow.statusFirma == 0) {
                        $('#btnVerInformeAtencionSF').show();
                    } else if (objrow.statusFirma == 1) {
                        $('#btnVerInformeAtencionCF').show();
                    }
                    $('#btnVerInformeAtencionSF').show();
                    SeguimientoPaciente.listaDiagosticos();
                    SeguimientoPaciente.llenaOtrosDatos();
                    await SeguimientoPaciente.CargarOrdenesMedicasPorIdCuentaAtencion(objrow.idCuentaAtencion);
                    await SeguimientoPaciente.CargarLaboratorioMovimientosPorIdCuentaAtencion(objrow.idCuentaAtencion);
                    await SeguimientoPaciente.CargarImagenesMovimientosPorIdCuentaAtencion(objrow.idCuentaAtencion);
                    //OrdenesYResultados.limpiarCatalogo();
                    //OrdenesYResultados.listaCabeceraRecetasByIdCuenta(objrow.idCuentaAtencion, 0)

                    $('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion);             //KHOYOSI

                }

                if (objrow.idTipoServicio == 2 || objrow.idTipoServicio == 4) {
                    $("#SeguimnientoEMER").show();

                    $('#btnVerInformeEvaluacionSF').hide();
                    $('#btnVerInformeEvaluacionCF').hide();
                    await SeguimientoPaciente.SeleccionarEvaluacionDetalle(objrow.idAtencion, 0);
                    await SeguimientoPaciente.CargarOrdenesMedicasPorIdCuentaAtencion(objrow.idCuentaAtencion);
                    await SeguimientoPaciente.CargarLaboratorioMovimientosPorIdCuentaAtencion(objrow.idCuentaAtencion);
                    await SeguimientoPaciente.CargarImagenesMovimientosPorIdCuentaAtencion(objrow.idCuentaAtencion);
                    //await SeguimientoPaciente.listaDiagosticosPorEvaluacion(objrow.idAtencion, objrow.idServicio)
                    $('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion);             //KHOYOSI
                }



                if (isEmpty(objrow.fechaEgreso)) {
                    alerta2('info', '', 'El paciente no ha sido atendido. No existen registros de atencion médica.');
                    $('#btnVerInformeAtencionSF').hide();
                }

            }

            //}
        });

        $('#tblOrdenesMedicasSegui tbody').on('click', 'tr', async function () {
            oTable_OrdenesMedicasSegui.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblOrdenesMedicasGeneralesSegui tbody').on('click', 'tr', async function () {
            oTable_OrdenesMedicasGeneralesSegui.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        //$('#tblOrdenesMedicasGeneralesSegui tbody').on('dblclick', 'tr', async function () {
        //    alerta2('success', '', 'Doble Click');            
        //});

        $('#tblOrdenesMedicasSegui tbody').on('click', '.ImprimirRecetaSeguiSF', async function () {
            var objrow = oTable_OrdenesMedicasSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_OrdenesMedicasSegui.fnGetData(objrow);

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

        $('#tblOrdenesMedicasGeneralesSegui tbody').on('click', '.ImprimirRecetaGeneralesSeguiSF', async function () {
            var objrow = oTable_OrdenesMedicasGeneralesSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_OrdenesMedicasGeneralesSegui.fnGetData(objrow);

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


        $('#tblOrdenesMedicasSegui tbody').on('click', '.ImprimirRecetaSeguiCF', async function () {
            var objrow = oTable_OrdenesMedicasSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_OrdenesMedicasSegui.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#tblOrdenesMedicasGeneralesSegui tbody').on('click', '.ImprimirRecetaGeneralesSeguiCF', async function () {
            var objrow = oTable_OrdenesMedicasGeneralesSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_OrdenesMedicasGeneralesSegui.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#btnConsultarOrdenMedicaSegui').on('click', async function () {
            var objrowTb = oTable_OrdenesMedicasSegui.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                SeguimientoPaciente.CargarRecetaDetalle(objrowTb);
                $("#modalRecetaSegui").modal("show");
            } else {
                alerta2('info', '', 'No se ha seleccionado ninguna receta.');
            }
        });

        $('#btnConsultarOrdenMedicaGeneralesSegui').on('click', async function () {
            var objrowTb = oTable_OrdenesMedicasGeneralesSegui.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                SeguimientoPaciente.CargarRecetaDetalle(objrowTb);
                $("#modalRecetaSegui").modal("show");
            } else {
                alerta2('info', '', 'No se ha seleccionado ninguna receta.');
            }
        });

        $('#btnCerrarRecetaSegui').on('click', function () {
            $('#modalRecetaSegui').modal('hide');
        });


        $('#tblLaboratorioMovimientosSegui tbody').on('click', 'tr', async function () {
            oTable_LaboratorioMovimientosSegui.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblLaboratorioMovimientosGeneralesSegui tbody').on('click', 'tr', async function () {
            oTable_LaboratorioMovimientosGeneralesSegui.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblImagenesMovimientosSegui tbody').on('click', 'tr', async function () {
            oTable_ImagenesMovimientosSegui.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblImagenesMovimientosGeneralesSegui tbody').on('click', 'tr', async function () {
            oTable_ImagenesMovimientosGeneralesSegui.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#btnConsultarResultadoLabSegui').on('click', async function () {
            var objrowTb = oTable_LaboratorioMovimientosSegui.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await SeguimientoPaciente.CargarResultadosImagenesLaboratorio(objrowTb.idProducto, objrowTb.idOrden, 'LAB');
            } else {
                alerta2('info', '', 'No se ha seleccionado ninguna receta.');
            }
        });


        $('#btnConsultarResultadoLabGeneralesSegui').on('click', async function () {
            var objrowTb = oTable_LaboratorioMovimientosGeneralesSegui.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await SeguimientoPaciente.CargarResultadosImagenesLaboratorio(objrowTb.idProducto, objrowTb.idOrden, 'LAB');
            } else {
                alerta2('info', '', 'No se ha seleccionado ninguna receta.');
            }
        });

        $('#tblLaboratorioMovimientosSegui tbody').on('click', '.ImprimirResultadoLabSeguiSF', async function () {
            var objrow = oTable_LaboratorioMovimientosSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_LaboratorioMovimientosSegui.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
            if (!isEmpty(firma)) {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            } else {
                alerta2('warning', '', 'No existe el documento digital.')
            }
            Cargando(0);
        });

        $('#tblLaboratorioMovimientosGeneralesSegui tbody').on('click', '.ImprimirResultadoLabGeneralesSeguiSF', async function () {
            var objrow = oTable_LaboratorioMovimientosGeneralesSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_LaboratorioMovimientosGeneralesSegui.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
            if (!isEmpty(firma)) {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            } else {
                alerta2('warning', '', 'No existe el documento digital.')
            }
            Cargando(0);
        });

        $('#tblLaboratorioMovimientosSegui tbody').on('click', '.ImprimirResultadoLabSeguiCF', async function () {
            var objrow = oTable_LaboratorioMovimientosSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_LaboratorioMovimientosSegui.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#tblLaboratorioMovimientosGeneralesSegui tbody').on('click', '.ImprimirResultadoLabGeneralesSeguiCF', async function () {
            var objrow = oTable_LaboratorioMovimientosGeneralesSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_LaboratorioMovimientosGeneralesSegui.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#btnConsultarResultadoImgSegui').on('click', async function () {
            var objrowTb = oTable_ImagenesMovimientosSegui.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await SeguimientoPaciente.CargarResultadosImagenesLaboratorio(objrowTb.idProducto, objrowTb.idOrden, 'IMG');
            } else {
                alerta2('warning', '', 'No se ha seleccionado ninguna receta.');
            }
        });

        $('#btnConsultarResultadoImgGeneralesSegui').on('click', async function () {
            var objrowTb = oTable_ImagenesMovimientosGeneralesSegui.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await SeguimientoPaciente.CargarResultadosImagenesLaboratorio(objrowTb.idProducto, objrowTb.idOrden, 'IMG');
            } else {
                alerta2('warning', '', 'No se ha seleccionado ninguna receta.');
            }
        });

        $('#tblImagenesMovimientosSegui tbody').on('click', '.ImprimirResultadoImgSeguiSF', async function () {
            var objrow = oTable_ImagenesMovimientosSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ImagenesMovimientosSegui.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
            if (!isEmpty(firma)) {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            } else {
                alerta2('warning', '', 'No existe el documento digital.')
            }
            Cargando(0);
        });

        $('#tblImagenesMovimientosGeneralesSegui tbody').on('click', '.ImprimirResultadoImgGeneralesSeguiSF', async function () {
            var objrow = oTable_ImagenesMovimientosGeneralesSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ImagenesMovimientosGeneralesSegui.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)
            if (!isEmpty(firma)) {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            } else {
                alerta2('warning', '', 'No existe el documento digital.')
            }
            Cargando(0);
        });

        $('#tblImagenesMovimientosSegui tbody').on('click', '.ImprimirResultadoImgSeguiCF', async function () {
            var objrow = oTable_ImagenesMovimientosSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ImagenesMovimientosSegui.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#tblImagenesMovimientosGeneralesSegui tbody').on('click', '.ImprimirResultadoImgGeneralesSeguiCF', async function () {
            var objrow = oTable_ImagenesMovimientosGeneralesSegui.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ImagenesMovimientosGeneralesSegui.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#btnCerrarResultadoLabImgSegui').on('click', function () {
            $('#modalResultadosLabImgSegui').modal('hide');
        });

        ////////////////////EVENTOS ATENCIONES EVALUACIONES EMRGENCIA/////////////////////////////
        $('#tblEvaluacionesEmergenciaSegui tbody').on('click', 'tr', async function () {
            oTable_EvaEmerSegui.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            var objrowTb = oTable_EvaEmerSegui.api(true).row('.selected').data();

            if (!isEmpty(objrowTb)) {
                $('#btnVerInformeEvaluacionSF').hide();
                $('#btnVerInformeEvaluacionCF').hide();
                if (objrowTb.statusFirma == 0) {
                    $('#btnVerInformeEvaluacionSF').show();
                } else if (objrowTb.statusFirma == 1) {
                    $('#btnVerInformeEvaluacionCF').show();
                }
                $('#btnVerInformeEvaluacionSF').show();

                await SeguimientoPaciente.listaDiagosticosPorEvaluacion(objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero, 8);
                SeguimientoPaciente.llenaOtrosDatosEval(objrowTb);
            } else {
                swal({
                    title: 'Evaluaciones',
                    text: "No se ha seleccionado ninguna evaluación.",
                    type: 'info',
                    allowOutsideClick: false,
                }).done();
            }
        });

        $('#btnVerInformeEvaluacionSF').on('click', async function () {
            var objrow = oTable_EvaEmerSegui.api(true).row('.selected').data();

            Cargando(1);
            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione una evaluación por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(objrow.code)
                if (!isEmpty(firma)) {
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                } else {
                    //alerta2('warning', '', 'El documento digital no está generado.');
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.');
                    if (objrow.idServicio == 6) {
                        const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(objrow.idCuentaAtencion, objrow.idEvaluacionDetalle, objrow.idAtencion, objrow.idServicio, objrow.idNumero);
                    } else {
                        const pdf = await Utilitario.GenerarHojaEvaluacionEmergencia(objrow.idCuentaAtencion, objrow.idEvaluacionDetalle, objrow.idAtencion, objrow.idServicio, objrow.idNumero);
                    }
                    $('#btnBuscarPaciente').click();
                }
            }
            Cargando(0);
        });

        $('#btnVerInformeEvaluacionCF').on('click', async function () {
            var objrowTb = oTable_EvaEmerSegui.api(true).row('.selected').data();
            Cargando(1);
            if (!isEmpty(objrowTb)) {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(objrowTb.code);
            } else {
                alerta(2, 'Seleccione una evaluación por favor.');
            }
            Cargando(0);
        });
        //////////////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////KHOYOSI/////////////////////////////////////
        $("#btnCerrarSeguimiento").on('click', function () {
            $('#hdIdCuentaAtencion').val(IdCuentaAtencionTemp);
            SeguimientoPaciente.limpiaDatos();

            $("#SeguimientoCE").hide();
            $("#SeguimnientoEMER").hide();
            $('#lblDatosAtencionCuenta').html("");
            $('#lblDatosAtencionFechaIngreso').html("");
            $('#lblDatosAtencionServicio').html("");
            $('#lblDatosAtencionTipoServicio').html("");

            $("#modalSeguimiento").modal('hide');
        });

        $('#btnVerInformeAtencionSF').on('click', async function () {
            var objrow = oTable_cuentas.api(true).row('.selected').data();

            Cargando(1);
            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione una atención por favor.');
            } else {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(objrow.code)
                if (!isEmpty(firma)) {
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                } else {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                    //alerta2('warning', '', 'El documento digital no está generado, se procedera a generar el documento.');
                    if (typeof objrow.usaModuloMaterno === 'undefined') {
                        alerta(2, "Seleccione Fila");
                    } else {
                        if (objrow.usaModuloMaterno) {
                            tipoFormato = 1;
                        }
                        else if (objrow.usaModuloNinoSano) {
                            tipoFormato = 2;
                        }
                        else {
                            tipoFormato = 0;
                        }

                        tipoHoja = 'AT';
                        if (objrow.idTipoAtencionAnestesio > 0) {
                            tipoHoja = 'AN';
                        }
                    }
                    //alerta2('warning', '', 'El documento digital se ha generaedo correctamente.');
                    const pdf = await Utilitario.GenerarAtencionPdf(objrow.idCuentaAtencion, objrow.idAtencion, objrow.idProCabecera, tipoFormato, tipoHoja);
                    $('#btnBuscarPaciente').click();
                }
            }
            Cargando(0);
        });

        $('#btnVerInformeAtencionCF').on('click', async function () {
            var objrowTb = oTable_cuentas.api(true).row('.selected').data();
            Cargando(1);
            if (!isEmpty(objrowTb)) {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(objrowTb.code);
            } else {
                alerta(2, 'Seleccione una atención por favor.');
            }
            Cargando(0);
        });

        //$('#btnVerInformeAtencion').on('click', async function () {
        //    var row = oTable_cuentas.api(true).row('.selected').data();
        //    tipoFormato = 0;

        //    Cargando(1);
        //    if (!isEmpty(row)) {
        //        if (row.idTipoServicio == 1) {
        //            if (row.fechaEgreso != '' && row.fechaEgreso != null) {
        //                const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
        //                if (typeof firma === 'undefined') {
        //                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //                    if (typeof row.usaModuloMaterno === 'undefined') {
        //                        alerta(2, "Seleccione Fila");
        //                    } else {
        //                        if (row.usaModuloMaterno) {
        //                            tipoFormato = 1;
        //                        }
        //                        else if (row.usaModuloNinoSano) {
        //                            tipoFormato = 2;
        //                        }
        //                        else {
        //                            tipoFormato = 0;
        //                        }

        //                        tipoHoja = 'AT';
        //                        if (row.idTipoAtencionAnestesio > 0) {
        //                            tipoHoja = 'AN';
        //                        }
        //                        //imprimiInformeSF(row.idCuentaAtencion, row.idProCabecera, tipoFormato)
        //                    }

        //                    const pdf = await Utilitario.GenerarAtencionPdf(row.idCuentaAtencion, row.idAtencion, row.idProCabecera, tipoFormato, tipoHoja);

        //                    if (pdf) {
        //                        alerta('1', 'Se generó el documento correctamente.')
        //                        $("#btnBuscarAtenciones").click();
        //                    } else {
        //                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
        //                    }
        //                } else {
        //                    //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
        //                    AbrirVisorDocumento(firma.rutaArchivo, 0);
        //                }
        //            } else {
        //                alerta(2, "El paciente no ha sido atendido.");
        //            }
        //        } else {
        //            alerta(2, "No existe un formato para generar este informe de atención.");
        //        }                
        //    } else {
        //        alerta(2, "Seleccione una cuenta de la lista.");
        //    }
        //    Cargando(0);

        //});

        $('#btnVerRecetasMedicas').on('click', async function () {
            var row = oTable_cuentas.api(true).row('.selected').data();
            if (!isEmpty(row)) {
                const recetas = await Ordenes.SeleccionarRecetasCabecera(row.idCuentaAtencion, row.idFormaPago, row.idServicioIngreso, row.idMedicoIngreso);
                VisorReceta.AbrirVisorRecetas(recetas);
            } else {
                alerta(2, "Seleccione una cuenta de la lista.");
            }

            //var row = oTable_cuentas.api(true).row('.selected').data();

            //if (typeof row === 'undefined') {
            //    alerta(2, "Seleccione un registro");
            //} else {
            //    VisorReceta.AbrirVisorRecetas(OrdenesRecetasMedicasSeguimiento);
            //}
            //console.log(OrdenesRecetas);            
        });
        ///////////////////////////////////////////////////////////////////////


        ////////////////////////////////EVENTOS RESULTADOS DE LABORATORIO/////////////////////////////////
        $('#tblListadoOrdenesDetalle tbody').on('click', '.ImprimeInformeResultadoSF', async function () {
            let objOrden = oTable_ListaOrdenes.api(true).row('.selected').data()
            var objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();

            Cargando(1);
            var row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code);               //KHOYOSI
            if (isEmpty(firma)) {
                alerta('2', 'El documento no está generado.');
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#tblListadoOrdenesDetalle tbody').on('click', '.ImprimeInformeResultadoCF', async function () {
            var objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $(document).on("click", ".btnImprimirGrupoResLabSegui", async function () {            
            //let idMovimiento = $(this).find("span").html();
            let idMovimiento = $(this).attr("data-idMovimiento");
                       
            if (isEmpty(idMovimiento)) {
                alerta2('info', '', 'Por favor seleccione un registro.')
                return false
            }

            Cargando(1);
            let tipoFormato = 'LAB-RES-GRUPO';
            const firma = await Utilitario.SeleccionarFirmaDigitalPorGrupo(idMovimiento, tipoFormato);
            if (typeof firma === 'undefined') {
                alerta2('info', '', 'El documento no ha podido ser generado por falta de información. Por favor guarde algun resultado del movimiento seleccionado.');               
            } else {
                await Utilitario.GenerarGrupoDocumentoPdf(idMovimiento, tipoFormato);                
            }
            Cargando(0);            
        });
        ///////////////////////////////////////////////////////////////////////////////////////////////////


    },

};

$(document).ready(function () {

    SeguimientoPaciente.plugins();
    SeguimientoPaciente.eventos();
    SeguimientoPaciente.initDatablesCuenta();
    SeguimientoPaciente.IniciarDataTablesOrdenesMedicasGenerales();
    SeguimientoPaciente.IniciarDataTableslaboratorioMovimientosGenerales();
    SeguimientoPaciente.IniciarDataTablesImagenesMovimientosGenerales();
    SeguimientoPaciente.initDatablesDiagnosticos();
    SeguimientoPaciente.IniciarDataTablesOrdenesMedicas();
    SeguimientoPaciente.IniciarDataTableslaboratorioMovimientos();
    SeguimientoPaciente.IniciarDataTablesImagenesMovimientos();
    SeguimientoPaciente.IniciarDataTableResultados();
    SeguimientoPaciente.IniciarDataTablesEvaluacion();
    SeguimientoPaciente.initDatablesDiagnosticosEval();
    SeguimientoPaciente.initDataTableFarmacia();

    VisorReceta.Eventos();          //KHOYOSI
});


