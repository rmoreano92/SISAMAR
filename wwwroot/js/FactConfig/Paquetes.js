let Paquetes = {

    IdPaquete: 0,

    async Plugins() {

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

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

    DataTablePaquetes() {

        let params = {
            paging: false,
            ordering: false,
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
                }
            ]
        }

        oTable_TablePaquetes = $("#tblPaquetes").dataTable(params);

    },
    DataTableDetallePaquete() {

        let params = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            //scrollY: '45vh',
            responsive: false,

            //scrollX: true,
            autoWidth: false,
            //destroy: true,
            columns: [
                {
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            return `<input class="input-table input-table-cantidad solo-numero" value="${data}">`;
                        } else {
                            return data
                        }
                    }
                },
                {
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    },
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            return `<input class="input-table input-table-precio solo-decimal" value="${data}">`;
                        } else {
                            return data
                        }
                    }
                },
                {
                    data: "importe",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        oTable_TableDetallePaquete = $("#tblDetallePaquete").dataTable(params);
        //oTable_TableDetallePaquete.fnAdjustColumnSizing();
    },

    ListarFactCatalogoPaquete: async function (Codigo, Descripcion) {
        Cargando(1);

        let formData = new FormData();

        formData.append('Codigo', Codigo);
        formData.append('Descripcion', Descripcion);

        const res = await HttpClient.Post('/Paquetes/ListarFactCatalogoPaquete?area=Comun', formData);

        oTable_TablePaquetes.fnClearTable()

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar cuentas')
            return
        }

        if (res.data.table.length > 0) {
            oTable_TablePaquetes.fnAddData(res.data.table)
        }


        $('.chzn-select').chosen().trigger("chosen:updated")

        Cargando(0)
    },
    ListarDetallePaquete: async function (idFactPaquete) {
        Cargando(1);

        let formData = new FormData();

        formData.append('idFactPaquete', idFactPaquete);

        const res = await HttpClient.Post('/Paquetes/ListarDetallePaquete?area=Comun', formData);

        oTable_TableDetallePaquete.fnClearTable()

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar detalle')
            return
        }

        if (res.data.table.length > 0) {
            oTable_TableDetallePaquete.fnAddData(res.data.table)
        }


        $('.chzn-select').chosen().trigger("chosen:updated")

        Cargando(0)
    },
    CrearModificarFacturacionCatalogoPaquetes: async function () {

        let formData = new FormData();

        formData.append('idFactPaquete', Paquetes.IdPaquete);

        formData.append('Codigo', $('#txtCodigoPaquete').val());
        formData.append('Descripcion', $('#txtDescripcionPaquete').val());
        formData.append('idTipoFinanciamiento', 1);
        formData.append('idEstado', $('#chkActivo').is(':checked') ? 1 : -1);
        formData.append('TipoPaquete', 2);

        formData.append('lstDetallePaquete', JSON.stringify(oTable_TableDetallePaquete.api(true).data().toArray()));
        formData.append('IdListBarItem', ObtenerItemListBar());

        const res = await HttpClient.Post('/Paquetes/CrearModificarFacturacionCatalogoPaquetes?area=Comun', formData);

        if (!res.success) {
            alerta2('error', '', res.statusText)
            return
        }

        let data = res.data.table[0]


        if (data.successNumber == 1) {
            alerta2('success', '', data.successMessage)
            this.LimpiarDatosFormulario()
            $('#modalRegistroPaquetes').modal('hide')
            $('#btnBuscar').click()
        } else {
            alerta2('error', '', data.errorMessage)
        }
    },

    AgregarItemDetalle: function (idPuntoCarga, idEspecialidadServicio, idProducto, codigo, descripcionProducto, producto, cantidad, precio) {
        let objDetalle = {
            "idFactPaquete": Paquetes.IdPaquete,
            "idEspecialidadServicio": idEspecialidadServicio,
            idPuntoCarga: idPuntoCarga,
            "idProducto": idProducto,
            "codigo": codigo,
            "descripcionProducto": descripcionProducto,
            "producto": producto,
            "cantidad": cantidad,
            "precio": precio,
            "importe": precio
        }

        let detallePaqueteFilter
        let detallePaquete = oTable_TableDetallePaquete.api(true).data().toArray()

        if (idPuntoCarga == 6) {
            detallePaqueteFilter = detallePaquete.filter(obj => obj.idProducto == idProducto && obj.idEspecialidadServicio == idEspecialidadServicio)
        } else {
            detallePaqueteFilter = detallePaquete.filter(obj => obj.idProducto == idProducto)
        }

        if (detallePaqueteFilter.length > 0) {
            alerta(2, 'El producto ya fue ingresado')
            return
        } else {
            oTable_TableDetallePaquete.fnAddData(objDetalle)
        }

    },

    //AgregarItemDetalleCita: function (idPuntoCarga, idEspecialidadServicio, idProducto, codigo, descripcionProducto, producto, cantidad, precio) {
    //    let objDetalle = {
    //        "idFactPaquete": Paquetes.IdPaquete,
    //        "idEspecialidadServicio": idEspecialidadServicio,
    //        idPuntoCarga: idPuntoCarga,
    //        "idProducto": idProducto,
    //        "codigo": codigo,
    //        "descripcionProducto": descripcionProducto,
    //        "producto": producto,
    //        "cantidad": cantidad,
    //        "precio": precio,
    //        "importe": precio
    //    }

    //    let detallePaquete = oTable_TableDetallePaquete.api(true).data().toArray()
    //    let detallePaqueteFilter = detallePaquete.filter(obj => obj.idProducto == idProducto && obj.idEspecialidadServicio == idEspecialidadServicio)

    //    if (detallePaqueteFilter.length > 0) {
    //        alerta(2, 'El producto ya fue ingresado')
    //        return
    //    } else {
    //        oTable_TableDetallePaquete.fnAddData(objDetalle)
    //    }

    //},

    CargarDatosFormulario: async function (data) {

        Paquetes.IdPaquete = data.idFactPaquete
        $('#txtCodigoPaquete').val(data.codigo)
        $('#txtDescripcionPaquete').val(data.descripcion)
        $('#chkActivo').prop('checked', data.idEstado == 1)

        await this.ListarDetallePaquete(Paquetes.IdPaquete)
    },
    LimpiarDatosFormulario: async function () {

        Paquetes.IdPaquete = 0
        $('#txtCodigoPaquete').val('')
        $('#txtDescripcionPaquete').val('')
        $('#chkActivo').prop('checked', false)

        oTable_TableDetallePaquete.fnClearTable()

        await this.ListarDetallePaquete(Paquetes.IdPaquete)
    },

    Events: function () {

        ///////////////////////////////////// EVENTS BUTTON //////////////////////////////////////
        $('#btnBuscar').on('click', async function () {

            let codigo = $('#txtCodigoPaqueteBusq').val()
            let descripcion = $('#txtDescripcionPaqueteBusq').val()

            await Paquetes.ListarFactCatalogoPaquete(codigo, descripcion)
        })
        $('#btnLimpiar').on('click', async function () {
            $('#txtCodigoPaqueteBusq').val('')
            $('#txtDescripcionPaqueteBusq').val('')
        })
        $('#btnAgregar').on('click', async function () {
            Paquetes.LimpiarDatosFormulario()
            $('#modalRegistroPaquetes').modal('show')
        })
        $('#btnModificar').on('click', async function () {

            let objRow = oTable_TablePaquetes.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, 'Por favor seleccione un registro.')
                return
            }

            await Paquetes.CargarDatosFormulario(objRow)

            $('#modalRegistroPaquetes').modal('show')
        })
        $('#btnGuardadPaquete').on('click', async function () {

            let paqueteDetalle = oTable_TableDetallePaquete.api(true).data().toArray()

            if ($('#txtCodigoPaquete').val() == '') {
                alerta2('warning', '', 'El Código del Paquete es obligatorio')
                return
            }
            if ($('#txtDescripcionPaquete').val() == '') {
                alerta2('warning', '', 'La Descripcion del Paquete es obligatoria')
                return
            }

            if (paqueteDetalle.length == 0) {
                alerta2('warning', '', 'Debe ingresar al menos un producto')
                return
            }

            Cargando(1);
            let guardarPaquete = await Paquetes.CrearModificarFacturacionCatalogoPaquetes()

            Cargando(0);
        })
        $('#btnCerrarModalPaquete').on('click', async function () {

            $('#modalRegistroPaquetes').modal('hide')
        })


        $('#btnAgregarRx').on('click', async function () {

            if (isEmpty($('#cboRayosX').val())) {
                alerta(2, 'Selecciona un producto')
                return
            }

            let idPuntoCarga = 21
            let idProducto = $('#cboRayosX').val()
            let codigo = $('#cboRayosX option:selected').attr('codigo')
            let descripcionProducto = $('#cboRayosX option:selected').attr('nombre')
            let producto = $('#cboRayosX option:selected').text()
            let precio = $('#cboRayosX option:selected').attr('precio')

            await Paquetes.AgregarItemDetalle(idPuntoCarga = idPuntoCarga, idEspecialidadServicio = 21, idProducto = idProducto, codigo = codigo,
                descripcionProducto = descripcionProducto, producto = producto, cantidad = 1, precio = precio)
        })
        $('#btnAgregarTomografia').on('click', async function () {

            if (isEmpty($('#cboTomografia').val())) {
                alerta(2, 'Selecciona un producto')
                return
            }

            let idPuntoCarga = 22
            let idProducto = $('#cboTomografia').val()
            let codigo = $('#cboTomografia option:selected').attr('codigo')
            let descripcionProducto = $('#cboTomografia option:selected').attr('nombre')
            let producto = $('#cboTomografia option:selected').text()
            let precio = $('#cboTomografia option:selected').attr('precio')

            await Paquetes.AgregarItemDetalle(idPuntoCarga = idPuntoCarga, idEspecialidadServicio = 21, idProducto = idProducto, codigo = codigo,
                descripcionProducto = descripcionProducto, producto = producto, cantidad = 1, precio = precio)
        })
        $('#btnAgregarEcoObstetrica').on('click', async function () {

            if (isEmpty($('#cboEcografiaObstetrica').val())) {
                alerta(2, 'Selecciona un producto')
                return
            }

            let idPuntoCarga = 23
            let idProducto = $('#cboEcografiaObstetrica').val()
            let codigo = $('#cboEcografiaObstetrica option:selected').attr('codigo')
            let descripcionProducto = $('#cboEcografiaObstetrica option:selected').attr('nombre')
            let producto = $('#cboEcografiaObstetrica option:selected').text()
            let precio = $('#cboEcografiaObstetrica option:selected').attr('precio')

            await Paquetes.AgregarItemDetalle(idPuntoCarga = idPuntoCarga, idEspecialidadServicio = 6, idProducto = idProducto, codigo = codigo,
                descripcionProducto = descripcionProducto, producto = producto, cantidad = 1, precio = precio)
        })
        $('#btnAgregarEcoGeneral').on('click', async function () {

            if (isEmpty($('#cboEcografiaGeneral').val())) {
                alerta(2, 'Selecciona un producto')
                return
            }

            let idPuntoCarga = 20
            let idProducto = $('#cboEcografiaGeneral').val()
            let codigo = $('#cboEcografiaGeneral option:selected').attr('codigo')
            let descripcionProducto = $('#cboEcografiaGeneral option:selected').attr('nombre')
            let producto = $('#cboEcografiaGeneral option:selected').text()
            let precio = $('#cboEcografiaGeneral option:selected').attr('precio')

            await Paquetes.AgregarItemDetalle(idPuntoCarga = idPuntoCarga, idEspecialidadServicio = 21, idProducto = idProducto, codigo = codigo,
                descripcionProducto = descripcionProducto, producto = producto, cantidad = 1, precio = precio)
        })
        $('#btnAgregarPatologiaClinica').on('click', async function () {

            if (isEmpty($('#cboPatologiaClinica').val())) {
                alerta(2, 'Selecciona un producto')
                return
            }

            let idPuntoCarga = 2
            let idProducto = $('#cboPatologiaClinica').val()
            let codigo = $('#cboPatologiaClinica option:selected').attr('codigo')
            let descripcionProducto = $('#cboPatologiaClinica option:selected').attr('nombre')
            let producto = $('#cboPatologiaClinica option:selected').text()
            let precio = $('#cboPatologiaClinica option:selected').attr('precio')

            await Paquetes.AgregarItemDetalle(idPuntoCarga = idPuntoCarga, idEspecialidadServicio = 22, idProducto = idProducto, codigo = codigo,
                descripcionProducto = descripcionProducto, producto = producto, cantidad = 1, precio = precio)
        })
        $('#btnAgregarCitaEnCe').on('click', async function () {

            if (isEmpty($('#cboCitasEnCe').val())) {
                alerta(2, 'Selecciona un producto')
                return
            }

            let idPuntoCarga = 6
            let idEspecialidadServicio = $('#cboCitasEnCe').val()
            let idProducto = $('#cboCitasEnCe option:selected').attr('idProducto')
            let codigo = $('#cboCitasEnCe option:selected').attr('codigo')
            let descripcionProducto = $('#cboCitasEnCe option:selected').attr('nombre')
            let producto = $('#cboCitasEnCe option:selected').text()
            let precio = $('#cboCitasEnCe option:selected').attr('precio')

            await Paquetes.AgregarItemDetalle(idPuntoCarga = idPuntoCarga, idEspecialidadServicio = idEspecialidadServicio,
                idProducto = idProducto, codigo = codigo, descripcionProducto = descripcionProducto, producto = producto, cantidad = 1, precio = precio)
        })
        $('#btnAgregarAdministrativos').on('click', async function () {

            if (isEmpty($('#cboAdministrativos').val())) {
                alerta(2, 'Selecciona un producto')
                return
            }

            let idPuntoCarga = 99
            let idProducto = $('#cboAdministrativos').val()
            let codigo = $('#cboAdministrativos option:selected').attr('codigo')
            let descripcionProducto = $('#cboAdministrativos option:selected').attr('nombre')
            let producto = $('#cboAdministrativos option:selected').text()
            let precio = $('#cboAdministrativos option:selected').attr('precio')

            await Paquetes.AgregarItemDetalle(idPuntoCarga = idPuntoCarga, idEspecialidadServicio = 95,
                idProducto = idProducto, codigo = codigo, descripcionProducto = descripcionProducto, producto = producto, cantidad = 1, precio = precio)
        })
        $('#btnAgregarFarmacia').on('click', async function () {

            if (isEmpty($('#cboFarmacia').val())) {
                alerta(2, 'Selecciona un producto')
                return
            }

            let idPuntoCarga = 5
            let idProducto = $('#cboFarmacia').val()
            let codigo = $('#cboFarmacia option:selected').attr('codigo')
            let descripcionProducto = $('#cboFarmacia option:selected').attr('nombre')
            let producto = $('#cboFarmacia option:selected').text()
            let precio = $('#cboFarmacia option:selected').attr('precio')

            await Paquetes.AgregarItemDetalle(idPuntoCarga = idPuntoCarga, idEspecialidadServicio = 71,
                idProducto = idProducto, codigo = codigo, descripcionProducto = descripcionProducto, producto = producto, cantidad = 1, precio = precio)
        })
        $('#btnQuitarProductoDetalle').on('click', async function () {

            var objrowTb = oTable_TableDetallePaquete.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                oTable_TableDetallePaquete.api(true).row('.selected').remove().draw(false);
                oTable_TableDetallePaquete.resize();

            } else {
                alerta2("info", "", "Por favor seleccione un producto para eliminar.");
            }

            
        })
        ///////////////////////////////////// EVENTS BUTTON //////////////////////////////////////


        ///////////////////////////////////// EVENTS TABLE //////////////////////////////////////
        $('#tblPaquetes').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TablePaquetes.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        });
        $('#tblDetallePaquete').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_TableDetallePaquete.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        });

        $('#tblDetallePaquete').on('input', '.input-table-cantidad', function () {
            const input = $(this);
            const tr = input.closest('tr');
            const table = oTable_TableDetallePaquete.api(true);
            const row = table.row(tr);
            const data = row.data();


            const valor = input.val();

            if (valor == '') {
                return
            }
            if (valor < 1) {
                alerta2('info', '', `La cantidad no debe ser inferior a "1"`)
                input.val(0)
                return
            }

            let calculoTotal = parseFloat(data.precio) * (valor);

            data.cantidad = valor
            data.importe = calculoTotal

            const colIndex = input.closest('td').index(); // para ubicar el input exacto
            const rowIndex = row.index();

            // Reasignar los datos para que el render se active
            row.data(data).draw();


            // Esperar al redibujado y volver a enfocar
            const nuevoInput = $('#tblDetallePaquete tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-cantidad');
            nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
        });

        $('#tblDetallePaquete').on('input', '.input-table-precio', function () {
            const input = $(this);
            const tr = input.closest('tr');
            const table = oTable_TableDetallePaquete.api(true);
            const row = table.row(tr);
            const data = row.data();


            const valor = input.val();

            if (valor == '') {
                return
            }
            if (valor < 0) {
                alerta2('info', '', `Ingreso un valor mayor a "0"`)
                input.val(0)
                return
            }

            let calculoTotal = parseFloat(valor) * (data.cantidad);

            data.precio = valor
            data.importe = calculoTotal

            const colIndex = input.closest('td').index(); // para ubicar el input exacto
            const rowIndex = row.index();

            // Reasignar los datos para que el render se active
            row.data(data).draw();


            // Esperar al redibujado y volver a enfocar
            const nuevoInput = $('#tblDetallePaquete tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-precio');
            nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
        });
        ///////////////////////////////////// EVENTS TABLE //////////////////////////////////////


        ///////////////////////////////////// EVENTS MODAL //////////////////////////////////////
        $('#modalRegistroPaquetes').on('shown.bs.modal', function () {
            oTable_TableDetallePaquete.fnDraw()
        });
        ///////////////////////////////////// EVENTS MODAL //////////////////////////////////////
    },

    Init: function () {
        this.Plugins()

        this.Events()

        this.DataTablePaquetes()
        this.DataTableDetallePaquete()
    }
}

$(document).ready(function () {
    Paquetes.Init()
})