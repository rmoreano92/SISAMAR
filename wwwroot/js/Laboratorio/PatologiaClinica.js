let PatologiaClinica = {
    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaInicio, #txtFechaFin').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraInicio, #txtHoraFin").mask("Hn:Nn");

        
    },

    CargaInicial: () => {
        var fecha = new Date()
        var dia = fecha.getDate()
        var mes = parseInt(fecha.getMonth()) + 1
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $("#txtFechaInicio").datepicker("setDate", fechaP);
        $("#txtFechaFin").datepicker("setDate", fechaP);
    },
    
    FactOrdenServicioPorFechasLabPaciente: () => {
        let formData = new FormData()
        formData.append('fechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val())
        formData.append('fechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val())
        formData.append('idPuntoCarga', 2) // cambiar por parametro

        oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/PatologiaClinica/FactOrdenServicioPorFechasLabPaciente?area=Laboratorio', formData)
            .then(res => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                return null
            })
    },
    LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga: (idOrden, idPuntoCarga, idMovimiento) => {
        let formData = new FormData()
        formData.append('idOrden', idOrden)
        formData.append('idPuntoCarga', idPuntoCarga)
        formData.append('idMovimiento', idMovimiento) // cambiar por parametro

        oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/PatologiaClinica/LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga?area=Laboratorio', formData)
            .then(res => {
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table;
                    } else {
                        return null;
                    } 
                } else {
                    alerta(3, res.mensaje)
                    return null;
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                return null;
            })
    },

    FactOrdenServicioPorFechasLabPaciente: () => {
        let formData = new FormData();
        formData.append('idMovimiento', $("#txtNroMovimiento").val())
        formData.append('idCuenta', $("#txtNroCuenta").val())
        formData.append('historia', $("#txtNroHistoria").val())
        formData.append('nombres', $("#txtNombres").val())
        formData.append('fechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val())
        formData.append('fechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val())
        formData.append('idPuntoCarga', 2) // cambiar por parametro

        oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/PatologiaClinica/FactOrdenServicioPorFechasLabPaciente?area=Laboratorio', formData)
            .then(res => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                return null
            })
    },
    FactOrdenServicioPorIdMovimiento: (idMovimiento, idPuntoCarga) => {
        let formData = new FormData()
        formData.append('idMovimiento', idMovimiento)
        formData.append('idPuntoCarga', idPuntoCarga) // cambiar por parametro

        oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/PatologiaClinica/FactOrdenServicioPorIdMovimiento?area=Laboratorio', formData)
            .then(res => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                return null
            })
    },




    ListarSaldosPorAlmacenConFechaCorte: () => {
        let formData = new FormData()
        formData.append('fechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val())
        formData.append('fechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val())

        oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        HttpClient.Post('/PatologiaClinica/ListarExamenesConResultadoPorFecha?area=Farmacia', formData)
            .then(res => {
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        oTable_patologiaClinica.fnAddData(res.data.table)
                    }
                    Cargando(0)
                } else {
                    alerta(3, res.mensaje)
                    Cargando(0)
                }
                return res
                Cargando(0)
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                Cargando(0)
            })
    },

    InitDatablesListaOrdenes: () => {

        var parms = {
            "paging": true,
            "bFilter": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "estadoOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "fechaCreacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "ordenaPrueba",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: "idTipoSexo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

                //////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
                //{
                //    width: '8%',
                //    targets: 7,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        var btnRuta = "";
                //        var btnImprime = "";
                //        var btnImprimeSinF = "";
                //        //var rutaBit4Id = "";

                //        btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                //        if (rowData.code != '0') {
                //            if (rowData.statusFirma == 1) {
                //                btnImprimeSinF = "";
                //                btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //            } else {
                //                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                //            }
                //        }

                //        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);


                //    }
                //}
            ]

        }

        var tableWrapper = $('#tblListadoOrdenes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ListaOrdenes = $("#tblListadoOrdenes").dataTable(parms);

    },

    InitDatablesListaOrdenesDetalle: () => {

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "resultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '20%',
                    targets: 6,
                    data: "obseraciones",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        //var rutaBit4Id = "";
                        if (rowData.resultado == 'SI' && rowData.code != '') {
                            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.code != '0') {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            }

                        }
                       
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);


                    }
                }
            ]

        }

        var tableWrapper = $('#tblListadoOrdenesDetalle'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ListaOrdenesDetalle = $("#tblListadoOrdenesDetalle").dataTable(parms);

    },

    InitDatablesPatologiaClinica: () => {

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '6%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '6%',
                    targets: 1,
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 3,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '40%',
                    targets: 4,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '12%',
                    targets: 5,
                    data: "fechaRecepcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '12%',
                    targets: 6,
                    data: "fechaResultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                
                //////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
                {
                    width: '8%',
                    targets: 7,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        //var rutaBit4Id = "";

                        btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                        if (rowData.code != '0') {
                            if (rowData.statusFirma == 1) {
                                btnImprimeSinF = "";
                                btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                            } else {
                                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                            }
                        }

                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);


                    }
                }
            ]

        }

        var tableWrapper = $('#tblResultadosPatologiaClinica'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_patologiaClinica = $("#tblResultadosPatologiaClinica").dataTable(parms);

    },


    Events: () => {

        //$('#btnListarOrdenesPatologia').on('click', () => {
        //    PatologiaClinica.ListarSaldosPorAlmacenConFechaCorte()
        //})

        $('#btnListarOrdenesPatologia').on('click', async () => {
            Cargando(1)

            oTable_ListaOrdenes.fnClearTable();
            oTable_ListaOrdenesDetalle.fnClearTable();
            let ordenServicioPorFechas = await PatologiaClinica.FactOrdenServicioPorFechasLabPaciente()
            //console.log(ordenServicioPorFechas);
            if (ordenServicioPorFechas.length == 0) {
                Cargando(0)
                alerta(2, 'No se encontro resultados para la busqueda indicada.')
                return false
            }
                        
            oTable_ListaOrdenes.fnAddData(ordenServicioPorFechas)

            Cargando(0)
        })

        $('#btnGenerarTodosOrdenesPatologia').on('click', () => {
            let objrows = oTable_patologiaClinica.api(true).data()

            Cargando(1)
            $(objrows).each(async (i, row) => {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
                if (typeof firma === 'undefined') {
                    //alerta('2', 'El documento no esta generado, se procedera a generar el documento.')

                    let tipoFormato = 'LAB-PC';
                    const pdf = await Utilitario.GenerarFormatoResultadosPorItem(row.idCuentaAtencion, row.idOrden, row.idMovimiento, row.idProducto, tipoFormato);

                    //if (pdf) {
                    //    alerta('1', 'Se generó el documento correctamente.')
                    //} 
                }
            })
            Cargando(0)
            $("#btnListarOrdenesPatologia").click();

            //PatologiaClinica.ListarSaldosPorAlmacenConFechaCorte()
        })

        $('#btnImprimirTodosResultados').on('click', async () => {
            let objRowOrden = oTable_ListaOrdenes.api(true).row('.selected').data()
            Cargando(1)
            if (isEmpty(objRowOrden)) {
                alerta(2, 'Selecciona un elemento de la lista de Ordenes')
                Cargando(0)
                return false
            }

            
            const ordenServicio = await PatologiaClinica.FactOrdenServicioPorIdMovimiento(objRowOrden.idMovimiento, objRowOrden.idPuntoCarga)
            
            if (ordenServicio.length > 0) {

                let firma = await Utilitario.SeleccionarFirmaDigitalV2(ordenServicio[0].code) 
                if (typeof firma === 'undefined') {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')

                    let tipoFormato = 'LAB-PCT';
                    const pdf = await Utilitario.GenerarFormatoResultados(objRowOrden.idOrden, objRowOrden.idPuntoCarga, objRowOrden.idMovimiento, tipoFormato);

                    if (pdf) {
                        alerta('1', 'Se generó el documento correctamente.')
                    }
                } else {
                    //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }

                Cargando(0)
            }

            //KHOYOSI
                       
            
        })

        $('#tblListadoOrdenes tbody').on('click', 'tr', async function () {
            
            oTable_ListaOrdenes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            //if ($(this).hasClass('selected')) {
                
            //}
            //else {
            //    
                
            //}
            Cargando(1)
            let objRow = oTable_ListaOrdenes.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona una orden')
                Cargando(0)
                return false
            }

            let facturacionServicioDespacho = await PatologiaClinica.LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(objRow.idOrden, objRow.idPuntoCarga, objRow.idMovimiento)
            console.log(facturacionServicioDespacho);
            oTable_ListaOrdenesDetalle.fnClearTable();
            if (!isEmpty(facturacionServicioDespacho)) {
                oTable_ListaOrdenesDetalle.fnAddData(facturacionServicioDespacho);                
            }
            Cargando(0)
        });

        $('#tblListadoOrdenesDetalle tbody').on('click', '.ImprimeInformeSF', async function () {

            let objOrden = oTable_ListaOrdenes.api(true).row('.selected').data()

            var objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
            console.log('row', row)
            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')

                let tipoFormato = 'LAB-PC';
                console.log('row', row) /// verificar aqui los parametros y los datos que se enviaran
                const pdf = await Utilitario.GenerarFormatoResultadosPorItem(objOrden.idCuentaAtencion, row.idOrden, objOrden.idMovimiento, row.idProducto, tipoFormato);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')

                    let objRow = oTable_ListaOrdenes.api(true).row('.selected').data()

                    if (isEmpty(objRow)) {
                        alerta(2, 'Selecciona una orden')
                        Cargando(0)
                        return false
                    }

                    let facturacionServicioDespacho = await PatologiaClinica.LabFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(objRow.idOrden, objRow.idPuntoCarga, objRow.idMovimiento)
                    
                    oTable_ListaOrdenesDetalle.fnClearTable()
                    if (!isEmpty(facturacionServicioDespacho)) {
                        oTable_ListaOrdenesDetalle.fnAddData(facturacionServicioDespacho)                        
                    }
                    Cargando(0)

                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });


        $('#tblResultadosPatologiaClinica tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = oTable_patologiaClinica.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_patologiaClinica.fnGetData(objrow);
            console.log('row', row)
            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')

                let tipoFormato = 'LAB-PC';
                console.log('row', row)
                const pdf = await Utilitario.GenerarFormatoResultadosPorItem(row.idCuentaAtencion, row.idOrden, row.idMovimiento, row.idProducto, tipoFormato);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnListarOrdenesPatologia").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);          
        });

        $('#tblResultadosPatologiaClinica tbody').on('click', '.FirmarInformeSF', async function () {
            var objrow = oTable_patologiaClinica.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_patologiaClinica.fnGetData(objrow);

            Cargando(1);
            //const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI
            //if (firma) {
            //    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
            //}
            await Utilitario.AbrirServicioFirmaBit4Id(row.code);

            Cargando(0);

        });

        $('#tblResultadosPatologiaClinica tbody').on('click', '.ImprimeInformeCF', async function () {
            var objrow = oTable_patologiaClinica.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_patologiaClinica.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#btnLimpiarBusqueda').on('click', () => {
            PatologiaClinica.Limpiar();
        })
    },

    Limpiar() {
        $(".search").val("");        
    }

}

$(document).ready(() => {    
    PatologiaClinica.Plugins()
    PatologiaClinica.CargaInicial();
    PatologiaClinica.InitDatablesListaOrdenes()
    PatologiaClinica.InitDatablesListaOrdenesDetalle()
    PatologiaClinica.InitDatablesPatologiaClinica()

    PatologiaClinica.Events()
})