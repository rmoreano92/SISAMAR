var ConfigResImg = {

    opcion: '',

    async Plugins() {
        //let FechaHora = await Utilitario.FechaHoraServidor();        
        //let FechaDia = FechaHora.substring(0, 10);

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        //$("#txtFechaIngresoIniBusq, #txtFechaIngresoFinBusq").datepicker("setDate", FechaDia);

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $(".maskFecha").mask("Dd/Mm/abcd");


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
    },

    DataTableProcedimiento: function () {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "subGrupo",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "codigo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombre",
                    width: "35%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombreMinsa",
                    width: "40%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableProcedimiento = $("#tblProcedimientos").dataTable(parms);
    },
    DataTableItemPorProcedimiento: function () {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "grupo",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "item",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "valorSiEsCombo",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "valorReferencial",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "ordenXresultado",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    }
                },
                {
                    data: "metodo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "soloNumero",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        let checkBox = `
                            <div class="check__toggle">
                                <label class="toggle">
                                    <input class="toggle__input bloquear" type="checkbox" id="chkNumero_${rowData.idProductoCpt}_${rowData.ordenXresultado}" ${rowData.soloNumero == 1 ? "checked" : ''}>
                                    <span class="toggle__label">
                                    </span>
                                </label>
                            </div>
                        `
                        $(td).html(checkBox);
                    }
                },
                {
                    data: "soloTexto",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        let checkBox = `
                            <div class="check__toggle">
                                <label class="toggle">
                                    <input class="toggle__input bloquear" type="checkbox" id="chkTexto_${rowData.idProductoCpt}_${rowData.ordenXresultado}" ${rowData.soloTexto == 1 ? "checked" : ''}>
                                    <span class="toggle__label">
                                    </span>
                                </label>
                            </div>
                        `
                        $(td).html(checkBox);
                    }
                },
                {
                    data: "soloCombo",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        let checkBox = `
                            <div class="check__toggle">
                                <label class="toggle">
                                    <input class="toggle__input bloquear" type="checkbox" id="chkCombo_${rowData.idProductoCpt}_${rowData.ordenXresultado}" ${rowData.soloCombo == 1 ? "checked" : ''}>
                                    <span class="toggle__label">
                                    </span>
                                </label>
                            </div>
                        `
                        $(td).html(checkBox);
                    }
                },
                {
                    data: "soloCheck",
                    width: "5%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        let checkBox = `
                            <div class="check__toggle">
                                <label class="toggle">
                                    <input class="toggle__input bloquear" type="checkbox" id="chkCheck_${rowData.idProductoCpt}_${rowData.ordenXresultado}" ${rowData.soloCheck == 1 ? "checked" : ''}>
                                    <span class="toggle__label">
                                    </span>
                                </label>
                            </div>
                        `
                        $(td).html(checkBox);
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableItemsProcedimiento = $("#tblItemsProcedimiento").dataTable(parms);
    },
    DataTableItemGrupoBusqueda: function () {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idItemGrupo",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "grupo",
                    width: "80%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableItemGrupo = $("#tblItemGrupo").dataTable(parms);
    },
    DataTableItemBusqueda: function () {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "idItem",
                    width: "20%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "item",
                    width: "80%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableItem = $("#tblItem").dataTable(parms);
    },
    DataTableProcedimientoBusqueda: function () {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "codigo",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombre",
                    width: "45%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombreMinsa",
                    width: "45%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableProcedimientoBusq = $("#tblProcedimientoBusq").dataTable(parms);
    },

    DataTableOpcionesDesplegable: function () {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "opciones",
                    width: "100%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TableOpcionesDesplegable = $("#tblOpcionesDesplegable").dataTable(parms);
    },

    ImgItemsGruposSeleccionarTodos: async function (Filtro) {
        Cargando(1)

        let formData = new FormData()

        formData.append("Filtro", Filtro);

        oTable_TableItemGrupo.fnClearTable()

        let response = await HttpClient.Post(`/ConfiguracionResultadosImagenes/ImgItemsGruposSeleccionarTodos`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        if (data.length > 0) {
            oTable_TableItemGrupo.fnAddData(data)
            console.log('data', data)
        }

        Cargando(0)
    },
    async CargarFormatoResultadosImagenes(idProducto) {
        var resp = null;
        var data = new FormData();

        data.append('idProducto', idProducto);

        try {
            if (typeof oTable_resultadosOrdenes != 'undefined') {
                oTable_resultadosOrdenes.fnClearTable();
            }

            $('#lblNombreExamen').html("");
            $('#tbodyResultados').html("");
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ConfiguracionResultadosImagenes/ImgItemsCptSeleccionarPorProducto?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.data.table.length > 0) {
                resp = datos.data.table;
            } else {
                alerta2('info', '', 'No existe formato de resultados para el examen seleccionado.');
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;

    },
    ListarProcedimientoImgConfigurar: async function (IdSubGrupo, Codigo, Nombre, tabla) {
        Cargando(1)

        let formData = new FormData()

        formData.append("IdSubGrupo", IdSubGrupo);
        formData.append("Codigo", Codigo);
        formData.append("Nombre", Nombre);

        tabla.fnClearTable()

        let response = await HttpClient.Post(`/ConfiguracionResultadosImagenes/ListarProcedimientoImgConfigurar`, formData)

        if (isEmpty(response)) {
            Cargando(0)
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            Cargando(0)
            return false
        }

        if (data.length > 0) {
            tabla.fnAddData(data)
            console.log('data', data)
        }

        Cargando(0)
    },

    ImgItemsSeleccionarTodos: async function (Filtro) {

        Cargando(1)

        let formData = new FormData()

        formData.append("Filtro", Filtro);

        oTable_TableItem.fnClearTable()

        let response = await HttpClient.Post(`/ConfiguracionResultadosImagenes/ImgItemsSeleccionarTodos`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        if (data.length > 0) {
            oTable_TableItem.fnAddData(data)
            console.log('data', data)
        }

        Cargando(0)
    },

    async CargarFormatoResultadosImagenologia(idProducto) {
        var resp = null;
        var data = new FormData();

        data.append('idProducto', idProducto);

        try {
            oTable_resultadosOrdenes.fnClearTable();
            $('#lblNombreExamen').html("");
            $('#tbodyResultados').html("");
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ConfiguracionResultadosImagenes/ImgItemsCptSeleccionarPorProducto?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.data.table.length > 0) {
                resp = datos.data.table;
            } else {
                alerta2('info', '', 'No existe formato de resultados para el examen seleccionado.');
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;

    },
    ImgItemsCptModificar: async function () {
        const formData = new FormData();

        let items = oTable_TableItemsProcedimiento.api(true).data().toArray()
        let LabItemsCpt = []

        for (item of items) {
            let labItem = {
                idProductoCpt: item.idProductoCpt,
                ordenXresultado: item.ordenXresultado,
                idGrupo: item.idGrupo,
                idItemGrupo: item.idItemGrupo,
                idItem: item.idItem,
                valorSiEsCombo: item.valorSiEsCombo,
                valorReferencial: item.valorReferencial,
                metodo: item.metodo,
                soloNumero: $(`#chkNumero_${item.idProductoCpt}_${item.ordenXresultado}`).is(":checked"),
                soloTexto: $(`#chkTexto_${item.idProductoCpt}_${item.ordenXresultado}`).is(":checked"),
                soloCombo: $(`#chkCombo_${item.idProductoCpt}_${item.ordenXresultado}`).is(":checked"),
                soloCheck: $(`#chkCheck_${item.idProductoCpt}_${item.ordenXresultado}`).is(":checked"),
                codigoIntegracion: ""
            };

            LabItemsCpt.push(labItem)
        }

        formData.append("lstLabItems", JSON.stringify(LabItemsCpt));
        formData.append("idListBar", ObtenerItemListBar());
        formData.append("opcion", ConfigResImg.opcion);


        let response = await HttpClient.Post(`/ConfiguracionResultadosImagenes/ImgItemsCptModificar`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        return data[0]
    },
    Events: async function () {
        $('#btnAgregar').on('click', function () {
            ConfigResImg.opcion = 'A'

            $('#modalRegistroResultados').modal('show')
        })
        $('#btnModificar').on('click', async function () {

            let row = oTable_TableProcedimiento.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta2('warning', '', 'Debe seleccionar un registro')
                return
            }

            ConfigResImg.opcion = 'M'

            await ConfigResImg.CargarDatos(row)

            $('#modalRegistroResultados').modal('show')
        })
        $('#btnConsultar').on('click', async function () {

            let row = oTable_TableProcedimiento.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta2('warning', '', 'Debe seleccionar un registro')
                return
            }

            ConfigResImg.opcion = 'C'

            await ConfigResImg.CargarDatos(row)

            $('#modalRegistroResultados').modal('show')
        })

        $('#btnEliminar').on('click', async function () {

            let row = oTable_TableProcedimiento.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta2('warning', '', 'Debe seleccionar un registro')
                return
            }

            ConfigResImg.opcion = 'E'

            await ConfigResImg.CargarDatos(row)

            $('#modalRegistroResultados').modal('show')
        })

        $('#btnGuardar').on('click', async function () {

            let items = oTable_TableItemsProcedimiento.api(true).data()

            if ($('#hdIdServicioCpt').val() == '') {
                alerta2('warning', '', 'Por favor selecciona un Procedimiento')
                return
            }

            if ($('#cboGrupoExamen').val() == '' || isEmpty($('#cboGrupoExamen').val())) {
                alerta2('warning', '', 'Por favor selecciona un Grupo de Examen')
                return
            }

            if (isEmpty(items)) {
                alerta2('warning', '', 'Por favor ingresa un item')
                return
            }

            //let resultados = await ConfigReslab.CargarFormatoResultadosImagenes($('#hdIdServicioCpt').val())

            //if (ConfigReslab.opcion == 'E') {
            //    if (resultados.length > 0) {
            //        alerta2('info', '', 'El procedimiento ya cuenta con una configuracion no se puede elminar.')
            //        return
            //    }
            //}


            let labItemModificar = await ConfigResImg.ImgItemsCptModificar()

            if (labItemModificar) {
                alerta2(labItemModificar.estado, '', labItemModificar.mensaje)
                //$('#modalRegistroResultados').modal('hide')
                $('#btnCerrarModalRegistroResultados').click()
            } else {
                alerta2(labItemModificar.estado, '', 'Hubo un error al registrar')
                console.log('Error', labItemModificar.mensaje)
            }

        })
        $('#btnCerrarModalRegistroResultados').on('click', function () {

            LimpiarDatosConfig()
            LimpiarDatosItem()

            $('#modalRegistroResultados').modal('hide')
        })

        $('#btnModalServicioCpt').on('click', async function () {
            $('#modalProcedimientos').modal('show')
        })
        $('#btnCerrarModalServicioCpt').on('click', function () {
            $('#modalProcedimientos').modal('hide')
        })

        $('#btnModalGrupoItem').on('click', async function () {
            $('#modalItemsGrupos').modal('show')

            await ConfigResImg.ImgItemsGruposSeleccionarTodos('')
        })
        $('#btnCerrarModalItemsGrupo').on('click', function () {
            $('#modalItemsGrupos').modal('hide')
        })

        $('#btnModalItem').on('click', async function () {
            $('#modalItems').modal('show')
            await ConfigResImg.ImgItemsSeleccionarTodos('')
        })
        $('#btnCerrarModalItems').on('click', function () {
            $('#modalItems').modal('hide')
        })


        $('#btnBuscarItemGrupo').on('click', async function () {

            let filtro = ''

            let codigo = $('#txtCodigoItemGrupoBusq').val()
            let nombre = $('#txtNombreItemGrupoBusq').val()

            if (codigo != '') {
                filtro = filtro + ` WHERE idItemGrupo = '${codigo}'`
            }

            if (nombre != '') {
                if (filtro != '') {
                    filtro = filtro + ` AND grupo LIKE '%${nombre}%'`
                } else {
                    filtro = filtro + ` WHERE grupo LIKE '%${nombre}%'`
                }
            }

            await ConfigResImg.ImgItemsGruposSeleccionarTodos(filtro)
        })
        $('#btnLimpiarBusqItemGrupo').on('click', async function () {

            let filtro = ''

            $('#txtCodigoItemGrupoBusq').val('')
            $('#txtNombreItemGrupoBusq').val('')

            await ConfigResImg.ImgItemsGruposSeleccionarTodos(filtro)
        })


        $('#btnBuscarItem').on('click', async function () {

            let filtro = ''

            let codigo = $('#txtCodigoItemBusq').val()
            let nombre = $('#txtNombreItemBusq').val()

            if (codigo != '') {
                filtro = filtro + ` WHERE idItem = '${codigo}'`
            }

            if (nombre != '') {
                if (filtro != '') {
                    filtro = filtro + ` AND Item LIKE '%${nombre}%'`
                } else {
                    filtro = filtro + ` WHERE Item LIKE '%${nombre}%'`
                }
            }

            await ConfigResImg.ImgItemsSeleccionarTodos('')
        })
        $('#btnLimpiarBusqItem').on('click', async function () {

            let filtro = ''

            $('#txtCodigoItemBusq').val('')
            $('#txtNombreItemBusq').val('')

            await ConfigResImg.ImgItemsSeleccionarTodos(filtro)
        })

        $('#btnBuscar').on('click', async function () {

            let filtro = ''

            let idGrupo = $('#cboSubGrupoBusq').val()
            let codigo = $('#txtCodigoProductoBusq').val()
            let nombre = $('#txtNombreProductoBusq').val()

            await ConfigResImg.ListarProcedimientoImgConfigurar(idGrupo, codigo, nombre, oTable_TableProcedimiento)
        })

        $('#btnBuscarProcedimiento').on('click', async function () {

            let filtro = ''

            let codigo = $('#txtCodigoProcedimientoBusq').val()
            let nombre = $('#txtNombreProcedimientoBusq').val()

            await ConfigResImg.ListarProcedimientoImgConfigurar(0, codigo, nombre, oTable_TableProcedimientoBusq)
        })
        $('#btnLimpiarBusqProcedimiento').on('click', async function () {
            $('#txtCodigoProcedimientoBusq').val('')
            $('#txtNombreProcedimientoBusq').val('')
        })
        $('#btnAgregarItem').on('click', async function () {
            oTable_TableItemsProcedimiento.$('tr.selected').removeClass('selected')
            $('.campo-item').prop('disabled', false)
            $('#btnEliminarItem').prop('disabled', true)

            let orden = oTable_TableItemsProcedimiento.api(true).data().toArray().length + 1
            $('#txtOrdenResultadoRegistrar').val(orden)

            $('.chzn-select-deselect').chosen().trigger("chosen:updated")
        })
        $('#btnGuardarItem').on('click', async function () {

            AgregarLabItem()
            $('#btnCancelarItem').click()
        })
        $('#btnEliminarItem').on('click', async function () {
        })
        $('#btnCancelarItem').on('click', async function () {
            $('.campo-item').prop('disabled', true)
            $('#btnEliminarItem').prop('disabled', false)

            LimpiarDatosItem()

            $('.chzn-select-deselect').chosen().trigger("chosen:updated")
        })

        $('#btnAgregarOpcion').on('click', async function () {

            if ($('#txtOpcionDesplegable').val() == '') {
                alerta(2, 'Ingresa un valor valido')
                return
            }

            let obj = {
                opciones: $('#txtOpcionDesplegable').val()
            }

            $('#txtOpcionDesplegable').val('')

            oTable_TableOpcionesDesplegable.fnAddData(obj)

            $('#txtOpcionDesplegable').focus()
        })
        $('#btnEliminarOpcion').on('click', async function () {

            let objRow = oTable_TableOpcionesDesplegable.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Selecciona un registro de la tabla de opciones')
                return
            }

            oTable_TableOpcionesDesplegable.api(true).row('.selected').remove().draw(false)
        })




        $('#tblItemsProcedimiento').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableItemsProcedimiento.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
        $('#tblItemGrupo').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableItemGrupo.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
        $('#tblItemGrupo').on('dblclick', 'tr', function () {

            $(this).addClass('selected')

            let row = oTable_TableItemGrupo.api(true).row('.selected').data()

            $('#hdIdGrupoItemRegistrar').val(row.idItemGrupo)
            $('#txtGrupoItemRegistrar').val(row.grupo)

            $('#modalItemsGrupos').modal('hide')
        })

        $('#tblItem').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableItem.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
        $('#tblItem').on('dblclick', 'tr', function () {

            $(this).addClass('selected')

            let row = oTable_TableItem.api(true).row('.selected').data()

            $('#hdItemRegistrar').val(row.idItem)
            $('#txtItemRegistrar').val(row.item)

            $('#modalItems').modal('hide')
        })

        $('#tblProcedimientoBusq').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableProcedimientoBusq.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
        $('#tblProcedimientoBusq').on('dblclick', 'tr', async function () {

            $(this).addClass('selected')

            let row = oTable_TableProcedimientoBusq.api(true).row('.selected').data()

            let resultados = await ConfigResImg.CargarFormatoResultadosImagenes(row.idProducto)

            if (resultados.length > 0) {
                alerta2('info', '', 'El procedimiento ya cuenta con una configuracion.')
                return
            }

            $('#hdIdServicioCpt').val(row.idProducto)
            $('#txtServicioCpt').val(row.codigo + ' - ' + row.nombre)

            $('#modalProcedimientos').modal('hide')
        })

        $('#tblProcedimientos').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableProcedimiento.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })

        $('#tblOpcionesDesplegable').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableOpcionesDesplegable.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
        //$('#tblProcedimientos').on('dblclick', 'tr', function () {

        //    $(this).addClass('selected')

        //    let row = oTable_TableProcedimiento.api(true).row('.selected').data()

        //    $('#hdIdServicioCpt').val(row.idProducto)
        //    $('#txtServicioCpt').val(row.codigo + ' - ' + row.nombre)

        //    $('#modalRegistroResultados').modal('show')
        //})

        $('#cboTipoDatoRegistrar').on('change', function () {
            $('#contOpciones').hide()
            if (this.value == 2) {
                $('#contOpciones').show()
            }
        });


        $('#modalItemsGrupos').on('shown.bs.modal', function () {
            oTable_TableItemGrupo.fnDraw()
        });
        $('#modalItems').on('shown.bs.modal', function () {
            oTable_TableItem.fnDraw()
        });

        $('#modalRegistroResultados').on('shown.bs.modal', function () {
            oTable_TableItemsProcedimiento.fnDraw()
        });
    },

    CargarDatos: async function (data) {

        $('#hdIdServicioCpt').val(data.idProducto)
        $('#txtServicioCpt').val(data.codigo + ' - ' + data.nombre)

        let resultados = await ConfigResImg.CargarFormatoResultadosImagenes(data.idProducto)

        oTable_TableItemsProcedimiento.fnClearTable()
        if (resultados.length > 0) {
            $('#cboGrupoExamen').val(resultados[0].idGrupo)
            oTable_TableItemsProcedimiento.fnAddData(resultados)
        }

        if (ConfigResImg.opcion != 'A' && ConfigResImg.opcion != 'M') {
            $('#btnModalServicioCpt').prop('disabled', true)

            if (ConfigResImg.opcion != 'C' || ConfigResImg.opcion != 'E') {
                $('#cboGrupoExamen').prop('disabled', true)
                $('#btnAgregarItem').prop('disabled', true)
                $('#btnEliminarItem').prop('disabled', true)
                $('#btnCancelarItem').prop('disabled', true)
                $('#btnGuardar').prop('disabled', true)
                oTable_TableItemsProcedimiento.$('input[type="checkbox"]').prop('disabled', true);
            }
            if (ConfigResImg.opcion == 'E') {
                $('#btnGuardar').prop('disabled', false)
            }
        } else {
            $('#btnModalServicioCpt').prop('disabled', false)
            $('#cboGrupoExamen').prop('disabled', false)
            $('#btnAgregarItem').prop('disabled', false)
            $('#btnEliminarItem').prop('disabled', false)
            $('#btnCancelarItem').prop('disabled', false)
            $('#btnGuardar').prop('disabled', false)
            oTable_TableItemsProcedimiento.$('input[type="checkbox"]').prop('disabled', false);

            if (ConfigResImg.opcion == 'M') {
                $('#btnModalServicioCpt').prop('disabled', true)
            }
        }

        $('.chzn-select-deselect').chosen().trigger("chosen:updated")
    },
    Init: async function () {
        await this.Plugins()

        await this.DataTableProcedimiento()
        await this.DataTableItemPorProcedimiento()
        await this.DataTableProcedimientoBusqueda()
        await this.DataTableItemGrupoBusqueda()
        await this.DataTableItemBusqueda()
        await this.DataTableOpcionesDesplegable()

        await this.Events()
    }
}

function AgregarLabItem() {
    let orden = oTable_TableItemsProcedimiento.api(true).data().toArray().length

    let soloNumero = $('#cboTipoDatoRegistrar').val() == 0 ? 1 : 0
    let soloTexto = $('#cboTipoDatoRegistrar').val() == 1 ? 1 : 0
    let soloCombo = $('#cboTipoDatoRegistrar').val() == 2 ? 1 : 0
    let soloCheck = $('#cboTipoDatoRegistrar').val() == 3 ? 1 : 0

    if (soloCombo == 1) {
        let opciones = oTable_TableOpcionesDesplegable.api(true).data().toArray()

        for (let opc of opciones) {
            orden = oTable_TableItemsProcedimiento.api(true).data().toArray().length

            let obj = {
                "idProductoCpt": $('#hdIdServicioCpt').val(),
                "ordenXresultado": orden + 1,
                "idGrupo": $('#cboGrupoExamen').val(),
                "idItemGrupo": $('#hdIdGrupoItemRegistrar').val(),
                "idItem": $('#hdItemRegistrar').val(),
                "valorSiEsCombo": opc.opciones,
                "valorReferencial": $('#txtValorReferencialRegistrar').val(),
                "metodo": $('#txtMetodoRegistrar').val(),
                "soloNumero": soloNumero,
                "soloTexto": soloTexto,
                "soloCombo": soloCombo,
                "soloCheck": soloCheck,
                "codigoIntegracion": null,
                "codigo": '',
                "nombre": $('#txtGrupoItemRegistrar').val(),
                "item": $('#txtItemRegistrar').val(),
                "grupo": $('#txtGrupoItemRegistrar').val()
            }

            oTable_TableItemsProcedimiento.fnAddData(obj)
        }
    } else {
        let obj = {
            "idProductoCpt": $('#hdIdServicioCpt').val(),
            "ordenXresultado": orden + 1,
            "idGrupo": $('#cboGrupoExamen').val(),
            "idItemGrupo": $('#hdIdGrupoItemRegistrar').val(),
            "idItem": $('#hdItemRegistrar').val(),
            "valorSiEsCombo": null,
            "valorReferencial": $('#txtValorReferencialRegistrar').val(),
            "metodo": $('#txtMetodoRegistrar').val(),
            "soloNumero": soloNumero,
            "soloTexto": soloTexto,
            "soloCombo": soloCombo,
            "soloCheck": soloCheck,
            "codigoIntegracion": null,
            "codigo": '',
            "nombre": $('#txtGrupoItemRegistrar').val(),
            "item": $('#txtItemRegistrar').val(),
            "grupo": $('#txtGrupoItemRegistrar').val()
        }

        oTable_TableItemsProcedimiento.fnAddData(obj)
    }
}

function LimpiarDatosConfig() {
    $('#hdIdServicioCpt').val('')
    $('#txtServicioCpt').val('')
    $('#cboGrupoExamen').val('')

    oTable_TableItemsProcedimiento.fnClearTable()
}
function LimpiarDatosItem() {
    $('#hdIdGrupoItemRegistrar').val('')
    $('#txtGrupoItemRegistrar').val('')
    $('#hdItemRegistrar').val('')
    $('#txtItemRegistrar').val('')
    $('#cboTipoDatoRegistrar').val('')
    $('#txtValorReferencialRegistrar').val('')
    $('#txtOrdenResultadoRegistrar').val('')
    $('#txtMetodoRegistrar').val('')

    $('#contOpciones').hide()
    oTable_TableOpcionesDesplegable.fnClearTable()
}