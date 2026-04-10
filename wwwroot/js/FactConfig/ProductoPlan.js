let ProductoPlanes = {
    IdPaquete: 0,
    oTable_TableProductoPlanes: null,

    async Plugins() {
        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[0123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $(".maskFecha").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");

        $(".chzn-select, .chzn-select-deselect").chosen({
            allow_single_deselect: true
        });
    },
    async cargarCombos() {
        cargarCombo('/ProductoPlan/FactConfigProductoPlan_Listar_TipoConcepto',
            'cboTipoConcepto',
            'Seleccione una opción',
            'id',
            'nombre',
            {},
            '');

        cargarCombo('/ProductoPlan/FactConfigProductoPlan_Listar_TipoComprobante',
            'cboTipoComprobante',
            'Seleccione una opción',
            'id',
            'nombre',
            {},
            '');



        const lista = [
            { id: 0, nombre: "Ninguno" },
            { id: 1, nombre: "Trabaja sólo Particulares" },
            { id: 2, nombre: "Trabaja sólo Seguro SIS" },
            { id: 3, nombre: "Trabaja sólo Seguro SOAT" },
            { id: 4, nombre: "Trabaja sólo Seguros Convenios" }
        ];
        cargarComboD('cboEstadoCuenta', 'Seleccione una opción', lista, '');

    },
    initDataTable() {
        if (this.oTable_TableProductoPlanes) {
            this.oTable_TableProductoPlanes.destroy();
        }

        this.oTable_TableProductoPlanes = $("#DataTablePlanes").DataTable({
            paging: true,
            ordering: true,
            searching: true,
            select: {
                style: 'single'
            },
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
            },
            columns: [
                { data: 'id', title: 'Id', width: '10%' },
                { data: 'descripcionFF', title: 'Fuente Financiamiento' },
                { data: 'descripcion', title: 'Descripción' },
                { data: 'descripcionLarga', title: 'Descripción larga' }
            ]
        });

    },

    validaGuardar: function () {
        // Validar campo requerido
        let valor = $('#txtProductoPlanDescripcion').val();
        if (!valor || !valor.toString().trim()) {
            alerta(2, 'El campo Producto/Plan es requerido.');
            $('#txtFuenteFinanciamiento').focus();
            return false;
        } else {
            return true;
        }

        //// Validar selects
        //if (!$('#cboTipoComprobante').val()) {
        //    alerta(2, 'El tipo de comprobante es requerido.');
        //    $('#cboTipoComprobante').focus();
        //    return false;
        //}

        //if (!$('#cboEstadoCuenta').val()) {
        //    alerta(2, 'El estado de cuenta es requerido.');
        //    $('#cboEstadoCuenta').focus();
        //    return false;
        //}

        //if (!$('#cboTipoConcepto').val()) {
        //    alerta(2, 'El tipo de concepto es requerido.');
        //    $('#cboTipoConcepto').focus();
        //    return false;
        //}

        //// Validar que al menos un radio button esté seleccionado
        //if (!$('input[name="grupoRadio"]:checked').val()) {
        //    alerta(2, 'Debe seleccionar una opción de radio.');
        //    return false;
        //}

        // Si pasa todas las validaciones
        return true;
    },


    LimpiarDatosFormulario() {
        $('#txtId').val('');
        $('#txtProductoPlanDescripcion').val('');

        // Checkboxes
        $('#chkEsOficinaHospital').prop('checked', false);
        $('#chkSeUsaOpcionVentas').prop('checked', false);
        $('#chkSeIngresaPrecios').prop('checked', false);
        $('#chkEsUnaFormaPago').prop('checked', false);
        $('#chkSeImprimirComprobante').prop('checked', false);
        $('#chkTieneFuenteFinanciamiento').prop('checked', false);

        // Selects
        $('#cboTipoComprobante').val('');
        $('#cboEstadoCuenta').val('');
        $('#cboTipoConcepto').val('');

        // Radio buttons
        $('#optVDCI').prop('checked', true);
    },



    async ProductoPlanListarFactCatalogo(IdTipoFinanciamiento, Descripcion) {
        Cargando(1);
        try {
            //let formData = new FormData();
            //formData.append('IdTipoFinanciamiento', IdTipoFinanciamiento);
            //formData.append('Descripcion', Descripcion);

            const params = new URLSearchParams();

            params.append('IdTipoFinanciamiento', IdTipoFinanciamiento) ?? '';
            params.append('Descripcion', Descripcion ?? '');

            const res = await HttpClient.Post('/ProductoPlan/FactConfigProductoPlan_Listar?area=Comun', params);
            //const res = await HttpClient.Post('/ProductoPlan/FactConfigProductoPlan_Listar?area=Comun', formData);

            if (!res || !res.data) {
                alerta(2, 'Error en la respuesta del servidor');
                return;
            }
            this.oTable_TableProductoPlanes.clear();

            if (res.data.table && res.data.table.length > 0) {
                this.oTable_TableProductoPlanes.rows.add(res.data.table).draw();
                alerta(1, `Se encontraron ${res.data.table.length} registros`);
            } else {
                alerta(2, 'No se encontraron resultados');
            }
        } catch (error) {
            console.error('Error:', error);
            alerta(2, 'Error al conectar con el servidor');
        } finally {
            Cargando(0);
        }
    },



    async ProductoPlanBuscar(IdTipoFinanciamiento) {
        let Descripcion = ''
        Cargando(1);
        try {
            //let formData = new FormData();
            //formData.append('IdTipoFinanciamiento', IdTipoFinanciamiento);
            //formData.append('Descripcion', Descripcion);

            const params = new URLSearchParams();

            params.append('IdTipoFinanciamiento', IdTipoFinanciamiento) ?? '';
            params.append('Descripcion', Descripcion ?? '');

            const res = await HttpClient.Post('/ProductoPlan/FactConfigProductoPlan_Listar?area=Comun', params);
            //const res = await HttpClient.Post('/ProductoPlan/FactConfigProductoPlan_Listar?area=Comun', formData);

            if (!res || !res.data) {
                alerta(2, 'Error en la respuesta del servidor');
                return;
            }
            //this.oTable_TableProductoPlanes.clear();


            if (res.data.table && res.data.table.length > 0) {
                const fila = res.data.table[0];

                // Textbox
                $('#txtId').val(fila.id);
                $('#txtProductoPlanDescripcion').val(fila.descripcion);

                // Checkboxes
                $('#chkEsOficinaHospital').prop('checked', fila.esOficina == 1);
                $('#chkSeIngresaPrecios').prop('checked', fila.seIngresPrecios == 1);
                $('#chkTieneFuenteFinanciamiento').prop('checked', fila.esFuenteFinanciamiento == 1);
                $('#chkEsUnaFormaPago').prop('checked', fila.esFarmacia == 1);
                $('#chkSeImprimirComprobante').prop('checked', fila.seImprimeComprobante == 1);
                $('#chkSeUsaOpcionVentas').prop('checked', fila.esSalida == 1);

                cargarCombo('/ProductoPlan/FactConfigProductoPlan_Listar_TipoConcepto',
                    'cboTipoConcepto',
                    'Seleccione una opción',
                    'id',
                    'nombre',
                    {},
                    fila.idTipoConcepto);

                cargarCombo('/ProductoPlan/FactConfigProductoPlan_Listar_TipoComprobante',
                    'cboTipoComprobante',
                    'Seleccione una opción',
                    'id',
                    'nombre',
                    {},
                    fila.idCajaTiposComprobante);

                const lista = [
                    { id: 0, nombre: "Ninguno" },
                    { id: 1, nombre: "Trabaja sólo Particulares" },
                    { id: 2, nombre: "Trabaja sólo Seguro SIS" },
                    { id: 3, nombre: "Trabaja sólo Seguro SOAT" },
                    { id: 4, nombre: "Trabaja sólo Seguros Convenios" }
                ];
                cargarComboD('cboEstadoCuenta', 'Seleccione una opción', lista, fila.generaPago);


                // Radios (tipoVenta: D / N / P)
                if (fila.tipoVenta === "D") {
                    $('#optVDCI').prop('checked', true);
                } else if (fila.tipoVenta === "N") {
                    $('#optVDSI').prop('checked', true);
                } else if (fila.tipoVenta === "P") {
                    $('#optPVTA').prop('checked', true);
                }


            } else {
                alerta(2, 'No se encontraron resultados');
            }
        } catch (error) {
            console.error('Error:', error);
            alerta(2, 'Error al conectar con el servidor');
        } finally {
            Cargando(0);
        }
    },


    ProductoPlan_InsertarActualizar: async function () {

        let formData = new FormData();
        let tipoVenta = "";
        if (document.querySelector('#optVDCI')?.checked) {
            tipoVenta = "D";
        } else if (document.querySelector('#optVDSI')?.checked) {
            tipoVenta = "N";
        } else if (document.querySelector('#optPVTA')?.checked) {
            tipoVenta = "P";
        }
        formData.append('IdTipoFinanciamiento', $('#txtId').val() || '');
        formData.append('Descripcion', $('#txtProductoPlanDescripcion').val() || '');
        formData.append('esOficina', $('#chkEsOficinaHospital').is(':checked') ? 1 : 0);
        formData.append('esSalida', $('#chkSeUsaOpcionVentas').is(':checked') ? 1 : 0);
        formData.append('SeIngresPrecios', $('#chkSeIngresaPrecios').is(':checked') ? 1 : 0);
        formData.append('EsFarmacia', $('#chkEsUnaFormaPago').is(':checked') ? 1 : 0);
        formData.append('idCajaTiposComprobante', $('#cboTipoComprobante option:selected').val() || 0);
        formData.append('tipoVenta', tipoVenta);
        formData.append('SeImprimeComprobante', $('#chkSeImprimirComprobante').is(':checked') ? 1 : 0);
        formData.append('esFuenteFinanciamiento', $('#chkTieneFuenteFinanciamiento').is(':checked') ? 1 : 0);
        formData.append('GeneraPago', $('#cboEstadoCuenta option:selected').val() || 0);
        formData.append('idTipoConcepto', $('#cboTipoConcepto option:selected').val() || 0);

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const res = await HttpClient.Post('/ProductoPlan/FactConfigProductoPlan_InsertarActualizar?area=Comun', formData);

        if (!res.success) {
            alerta2('error', '', res.statusText);
            return;

        }
        alerta(1, 'Guardado');

    },



















    Events() {
        const self = this;

        $('#btnBuscar').on('click', async function () {
            let codigo = $('#txtCodigoPaqueteBusq').val().trim();
            let descripcion = $('#txtDescripcionPaqueteBusq').val().trim();

            //if (!codigo && !descripcion) {
            //    alerta(2, 'Debe ingresar al menos un criterio de búsqueda');
            //    return;
            //}

            await self.ProductoPlanListarFactCatalogo(codigo, descripcion);
        });

        $('#btnGuardar').on('click', async function () {
            let valor = $('#txtProductoPlanDescripcion').val().trim();
            //const fuente = document.getElementById('txtFuenteFinanciamiento');
            if (!ProductoPlanes.validaGuardar()) {
                return; // Detener ejecución si no es válido


            }

            // Continuar con el guardado...
            await self.ProductoPlan_InsertarActualizar();
            ProductoPlanes.LimpiarDatosFormulario();
            $('#modalProductosPlan').modal('hide');
            $('#btnBuscar').click();


        });


        $('#btnModificar').on('click', async function () {
            let objRow = self.oTable_TableProductoPlanes.row('.selected').data();

            if (!objRow) {
                alerta(2, 'Por favor seleccione un registro.');
                return;
            }



            $('#modalProductosPlan').modal('show')

            $('#txtId').val(objRow.id)
            $('#txtId').prop('disabled', true);

            ProductoPlanes.ProductoPlanBuscar(objRow.id)





        });


        $('#btnAgregar').on('click', async function () {
            $('#modalProductosPlan').modal('show')

            self.cargarCombos();
            //this.LimpiarDatosFormulario();

            $('#txtId').prop('disabled', true);


        });














        // Agrega evento para limpiar
        $('#btnLimpiar').on('click', function () {
            $('#txtCodigoPaqueteBusq').val('');
            $('#txtDescripcionPaqueteBusq').val('');
            self.oTable_TableProductoPlanes.clear().draw();
        });



        $('#DataTablePlanes').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {

                self.oTable_TableProductoPlanes.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        });




    },

    Init() {
        this.Plugins();
        this.initDataTable();
        //this.cargarCombos();
        this.Events();
    }
}

$(document).ready(function () {
    ProductoPlanes.Init();
});