var Resultados = {
    IniciarScript() {
        Resultados.IniciarDataTables();
        Resultados.Eventos();
    },

    IniciarData() {

    },

    IniciarDataTables() {
        Resultados.IniciarDataTableslaboratorioMovimientos();
        Resultados.IniciarDataTablesImagenesMovimientos();
        Resultados.IniciarDataTableResultados();
    },

    Limpiar() {

    },

    // <summary>
    // DATATABLES
    // </summary>
    // INICIALIZA EVENTOS
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#btnCerrarResultadoLabImg').on('click', function () {
            Resultados.Limpiar();
            $('#modalResultadosLabImg').modal('hide');
        });

        //---------------------------------LABORATORIO--------------------------------------------//
        $('#tblLaboratorioMovimientos tbody').on('click', 'tr', async function () {           
            oTable_LaboratorioMovimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#btnConsultarResultadoLab').on('click', async function () {
            var objrowTb = oTable_LaboratorioMovimientos.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await Resultados.CargarResultadosImagenesLaboratorio(objrowTb.idProducto, objrowTb.idOrden, 'LAB');
                //Ordenes.ubicaMedico(objrowTb.idMedico);
                //$(".OpcionesOrdenes").hide();
                //$("#btnGuardarRecetas").hide();
                //$("#modalReceta").modal("show");
            } else {
                alerta2('warning', '', 'No se ha seleccionado ninguna receta.');
            }
        });
                
        $('#tblLaboratorioMovimientos tbody').on('click', '.ImprimirResultadoLabSF', async function () {
            var objrow = oTable_LaboratorioMovimientos.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_LaboratorioMovimientos.fnGetData(objrow);

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

        $('#tblLaboratorioMovimientos tbody').on('click', '.ImprimirResultadoLabCF', async function () {
            var objrow = oTable_LaboratorioMovimientos.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_LaboratorioMovimientos.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $(document).on("click", ".btnImprimirGrupoResLab", async function () {
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

        //----------------------------------IMAGENOLOGÍA------------------------------------------------//
        $('#tblImagenesMovimientos tbody').on('click', 'tr', async function () {
            oTable_ImagenesMovimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#btnConsultarResultadoImg').on('click', async function () {
            var objrowTb = oTable_ImagenesMovimientos.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await Resultados.CargarResultadosImagenesLaboratorio(objrowTb.idProducto, objrowTb.idOrden, 'IMG');
                //Ordenes.ubicaMedico(objrowTb.idMedico);
                //$(".OpcionesOrdenes").hide();
                //$("#btnGuardarRecetas").hide();
                //$("#modalReceta").modal("show");
            } else {
                alerta2('warning', '', 'No se ha seleccionado ninguna receta.');
            }
        });

        $('#tblImagenesMovimientos tbody').on('click', '.ImprimirResultadoImgSF', async function () {
            var objrow = oTable_ImagenesMovimientos.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ImagenesMovimientos.fnGetData(objrow);

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

        $('#tblImagenesMovimientos tbody').on('click', '.ImprimirResultadoImgCF', async function () {
            var objrow = oTable_ImagenesMovimientos.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ImagenesMovimientos.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // <summary>
    // DATATABLES
    // </summary>
    // INICIALIZA DATA TABLE
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                Resultados.FormatearCeldaInformeGrupo();
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
                                        btnImprime = ' <button class="ImprimirResultadoLabCF btn btn-sm btn-success glow_button"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnImprimeSinF = '<button class="ImprimirResultadoLabSF btn btn-sm btn-warning glow_button"><i class="fa fa-eye"></i> </button>';
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

                        $(td).html('<button class="btn btn-sm btn-indigo layout_btn_prevent btnImprimirGrupoResLab" data-idMovimiento="' + rowData.idMovimiento + '"><i class="fa-sharp fa-solid fa-print"><span class="d-none idMovimiento">' + rowData.idMovimiento + '</span><span class="d-none tieneResultadoPdf">' + rowData.tieneResultadoPdf + '</span></i></button>');

                    },

                }
            ]

        }

        var tableWrapperEmer = $('#tblLaboratorioMovimientos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_LaboratorioMovimientos = $("#tblLaboratorioMovimientos").dataTable(parms);
    },

    FormatearCeldaInformeGrupo() {
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

        $('#tblLaboratorioMovimientos tbody tr').each(function () {

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
                        $("#tblLaboratorioMovimientos tbody").find("tr:eq(" + rowPos + ")").find("td:eq(6)").attr('rowspan', rowspan);
                    }

                    if (tieneResultadoPdf == 0) {
                        $("#tblLaboratorioMovimientos tbody").find("tr:eq(" + rowPos + ")").find("td:eq(6)").find("button").remove();
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
            $("#tblLaboratorioMovimientos tbody").find("tr:eq(" + rowPos + ")").find("td:eq(6)").attr('rowspan', rowspan);
        }

        if (tieneResultadoPdf == 0) {
            $("#tblLaboratorioMovimientos tbody").find("tr:eq(" + rowPos + ")").find("td:eq(6)").find("button").remove();
        }
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
                                        btnImprime = ' <button class="ImprimirResultadoImgCF btn btn-sm btn-success glow_button"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnImprimeSinF = '<button class="ImprimirResultadoImgSF btn btn-sm btn-warning glow_button"><i class="fa fa-eye"></i> </button>';
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

        var tableWrapperEmer = $('#tblImagenesMovimientos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper

        oTable_ImagenesMovimientos = $("#tblImagenesMovimientos").dataTable(parms);
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

        var tableWrapper = $('#tblResultadosExamenes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_resultadosOrdenes = $("#tblResultadosExamenes").dataTable(parms);
        $('#tblResultadosExamenes_length').css('display', 'none')
        $('#tblResultadosExamenes').DataTable().columns.adjust();

    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // <summary>
    // DATATABLES
    // </summary>
    // INICIALIZA CONSUMO BD
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async CargarLaboratorioMovimientosPorIdCuentaAtencion(idCuenta) { 
        //var resp = [];
        let datos;
        var data = new FormData();

        data.append('idCuentaAtencion', idCuenta);

        try {
            oTable_LaboratorioMovimientos.fnClearTable();
            //OrdenMedica.Limpiar();
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
                oTable_LaboratorioMovimientos.fnAddData(datos.table);
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
            oTable_ImagenesMovimientos.fnClearTable();
            //OrdenMedica.Limpiar();
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
                oTable_ImagenesMovimientos.fnAddData(datos.table);
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
            oTable_resultadosOrdenes.fnClearTable();   
            $('#lblNombreExamen').html("");
            $('#tbodyResultados').html("");
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
                    $('#lblNombreExamen').html(valor.producto);
                    if (valor.idGrupo != idGrupoRes) {
                        idGrupoRes = valor.idGrupo;
                        //hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;'><td><b>" + valor.grupo + "</b> </td><td> </td><td> </td></tr>";
                        hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;font-weight:bold'><td colspan='3'><b>" + valor.grupo + "</b> </td></tr>";
                    }

                    if(valor.idItem != idItemRes){
                        idItemRes = valor.idItem;
                        //hmltTabla = hmltTabla + "<tr><td></td><td>" + valor.item + " </td><td>" + valor.valor + "</td></tr>";
                        hmltTabla = hmltTabla + "<tr><td>" + valor.item + " </td><td>" + valor.valor + "</td><td>" + valor.valorReferencial + "</td></tr>";
                    }      
                    $('#txtObserOrdRes').val(valor.obseraciones + '\n' + valor.conclusiones);
                });
                $('#tbodyResultados').html(hmltTabla);
                //$('#tblResultadosExamenes').DataTable().columns.adjust();
                $('#modalResultadosLabImg').modal('show');

                //var grupos = [];

                //datos.table.forEach(function (dato) {
                //    if (grupos.indexOf(dato.grupo) == -1) {
                //        grupos.push(dato.grupo);
                //    }
                //});

                //console.log(grupos);

                //jQuery.each(grupos, function (i, val) {
                //    hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;'><td><b>" + val + "</b> </td><td> </td><td> </td></tr>";
                //    jQuery.each(datos.table, function (x, valor) {

                //        if (valor.grupo == val) {
                //            hmltTabla = hmltTabla + "<tr><td ></td><td style='width: 100px;'> " + valor.item + " </td><td style='width: 100px;'>" + valor.valor + "</td></tr>";
                //        }

                //    });
                //});

                //$('#txtObserOrdRes').val(datos.table[0]["obseracionesGenerales"]);

                //$('#tbodyResultados').html(hmltTabla);
                //$('#tblResultadosExamenes').DataTable().columns.adjust();
                ////oTable_resultadosOrdenes.columns.adjust().draw();
                //$('#modalResultadosLabImg').modal('show');

            } else {
                alerta2('info', '', 'No existen resultados para el examen seleccionado.');
            }
        } catch (error) {
            alerta(3, error);
        }
                
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    
}