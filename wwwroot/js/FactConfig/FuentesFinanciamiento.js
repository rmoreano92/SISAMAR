let FuentesFinanciamiento = {
    IdPaquete: 0,
    oTable_Lista: null,

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
        cargarCombo('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar_TipoFinanciador',
            'cboTipoFinanciador',
            'Seleccione una opción',
            'id',
            'nombre',
            {},
            '');
        cargarCombo('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar_FarmTipoConceptos',
            'cboTipoConceptoF',
            'Seleccione una opción',
            'id',
            'nombre',
            {},
            '');
        cargarCombo('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar_UtilizadosEn',
            'cboUtilizadoEn',
            'Seleccione una opción',
            'id',
            'nombre',
            {},
            '');
        cargarCombo('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar_AreaTramitaSeguros',
            'cboAreaTramitaSeguro',
            'Seleccione una opción',
            'id',
            'nombre',
            {},
            '');
        cargarCombo('/FuentesFinanciamiento/FuenteFinanciamientoIAFA_Listar_TiposFinanciamiento',
            'cboTarifario',
            'Seleccione una opción',
            'id',
            'nombre',
            {},
            '');






        

    },
    initDataTable() {
        if (this.oTable_Lista) {
            this.oTable_Lista.destroy();
        }

        this.oTable_Lista = $("#tblTableLista").DataTable({
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
                { data: 'descripcion', title: 'Descripción' },

            ]
        });

    },
    validaGuardar: function () {
        // Validar campo requerido
        let valor = $('#txtFuenteFinanciamiento').val();
        if (!valor || !valor.toString().trim()) {
            alerta(2, 'El campo Fuente Financiamiento (IAFA) es requerido.');
            $('#txtFuenteFinanciamiento').focus();
            return false;
            
        } else {
            return true;
        }
    },
    LimpiarDatosFormulario() {

        $('#txtId').val('');
        $('#txtCodigo').val('');
        $('#txtFuenteFinanciamiento').val('');
        $('#txtCodigoSEM').val('');
        $('#txtCodigoHIS').val('');

        $('#cboTipoFinanciador').val('');
        $('#cboTipoConceptoF').val('');
        $('#cboUtilizadoEn').val('');
        $('#cboAreaTramitaSeguro').val('');
        $('#cboTarifario').val('');

        $('#chkUsadoCaja').prop('checked', false);


        $('#tblDetalleFuente tbody').empty();



    },



    async FuenteFinanciamientoListarFactCatalogo(IdTipoFinanciamiento, Descripcion) {
        Cargando(1);
        try {
            //let formData = new FormData();
            //formData.append('IdTipoFinanciamiento', IdTipoFinanciamiento);
            //formData.append('Descripcion', Descripcion);

            const params = new URLSearchParams();

            params.append('IdTipoFinanciamiento', IdTipoFinanciamiento) ?? '';
            params.append('Descripcion', Descripcion ?? '');

            const res = await HttpClient.Post('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar?area=Comun', params);
            //const res = await HttpClient.Post('/ProductoPlan/FactConfigProductoPlan_Listar?area=Comun', formData);

            if (!res || !res.data) {
                alerta(2, 'Error en la respuesta del servidor');
                return;
            }
            this.oTable_Lista.clear();

            if (res.data.table && res.data.table.length > 0) {
                this.oTable_Lista.rows.add(res.data.table).draw();
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



    async FuentesFinanciamientoBuscar(IdTipoFinanciamiento) {
        let Descripcion=''
        Cargando(1);
        try {
            //let formData = new FormData();
            //formData.append('IdTipoFinanciamiento', IdTipoFinanciamiento);
            //formData.append('Descripcion', Descripcion);

            const params = new URLSearchParams();

            params.append('IdTipoFinanciamiento', IdTipoFinanciamiento) ?? '';
            params.append('Descripcion', Descripcion ?? '');

            const res = await HttpClient.Post('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar?area=Comun', params);
            //const res = await HttpClient.Post('/ProductoPlan/FactConfigProductoPlan_Listar?area=Comun', formData);

            if (!res || !res.data) {
                alerta(2, 'Error en la respuesta del servidor');
                return;
            }
            //this.oTable_Lista.clear();


            if (res.data.table && res.data.table.length > 0) {
                const fila = res.data.table[0];



                // Textbox
                $('#txtId').val(fila.id);
                $('#txtCodigo').val("000000000000");
                $('#txtFuenteFinanciamiento').val(fila.descripcion);
                $('#txtCodigoSEM').val(fila.codigoFuenteFinanciamientoSEM);
                $('#txtCodigoHIS').val(fila.codigoHIS);
                // Checkboxes
                $('#chkUsadoCaja').prop('checked', fila.esUsadoEnCaja == 1);

                cargarCombo('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar_TipoFinanciador',
                    'cboTipoFinanciador',
                    'Seleccione una opción',
                    'id',
                    'nombre',
                    {},
                    fila.idTipoFinanciador);
                cargarCombo('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar_FarmTipoConceptos',
                    'cboTipoConceptoF',
                    'Seleccione una opción',
                    'id',
                    'nombre',
                    {},
                    fila.idTipoConceptoFarmacia);
                cargarCombo('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar_UtilizadosEn',
                    'cboUtilizadoEn',
                    'Seleccione una opción',
                    'id',
                    'nombre',
                    {},
                    fila.utilizadoEn);
                cargarCombo('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_Listar_AreaTramitaSeguros',
                    'cboAreaTramitaSeguro',
                    'Seleccione una opción',
                    'id',
                    'nombre',
                    {},
                    fila.idAreaTramitaSeguros);
                cargarCombo('/FuentesFinanciamiento/FuenteFinanciamientoIAFA_Listar_TiposFinanciamiento',
                    'cboTarifario',
                    'Seleccione una opción',
                    'id',
                    'nombre',
                    {},
                    '');

            

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




    async FuentesFinanciamientoBuscarDetalle(IdFuenteFinanciamiento) {
        let Descripcion = ''
        Cargando(1);
        try {
            //let formData = new FormData();
            //formData.append('IdTipoFinanciamiento', IdTipoFinanciamiento);
            //formData.append('Descripcion', Descripcion);

            const params = new URLSearchParams();

            params.append('IdFuenteFinanciamiento', IdFuenteFinanciamiento) ?? '';


            const res = await HttpClient.Post('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_ListarDetalle?area=Comun', params);
            //const res = await HttpClient.Post('/ProductoPlan/FactConfigProductoPlan_Listar?area=Comun', formData);

            if (!res || !res.data) {
                alerta(2, 'Error en la respuesta del servidor');
                return;
            }
            //this.oTable_Lista.clear();


            if (res.data.table && res.data.table.length > 0) {
                const fila = res.data.table[0];

                // DEBUG: Verificar los datos que llegan
                console.log('✅ Datos recibidos:', res.data.table);
                console.log('✅ Primera fila:', fila);
                console.log('✅ Campos disponibles:', Object.keys(fila));
                console.log('✅ Valor de id:', fila.id);
                console.log('✅ Valor de nombre:', fila.nombre);
                console.log('✅ Tbody encontrado:', document.getElementById('tbodyDetalleFuente'));




                //if (res.data.table) {
                TablaHelper(res, {
                    idTablaBody: 'tbodyDetalleFuente',
                    campos: [
                        { campo: 'idTipoFinanciamiento', clase: 'text-center fw-bold' },     // ID centrado y en negrita
                        { campo: 'nombre', clase: 'text-start' }           // Nombre alineado a la izquierda
                    ],
                    mensajeVacio: 'No hay tarifarios disponibles'
                });






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










    
    InsertarActualizar: async function () {

        let formData = new FormData();

        formData.append('IdFuenteFinanciamiento', $('#txtId').val() || '');
        formData.append('Descripcion', $('#txtFuenteFinanciamiento').val() || '');
        formData.append('IdTipoFinanciamiento','0');
        formData.append('idTipoConceptoFarmacia', $('#cboTipoConceptoF option:selected').val() || '');
        formData.append('UtilizadoEn', $('#cboUtilizadoEn option:selected').val() || '');
        formData.append('CodigoFuenteFinanciamientoSEM', $('#txtCodigoSEM').val() || '');
        formData.append('idAreaTramitaSeguros', $('#cboAreaTramitaSeguro option:selected').val() || '');
        formData.append('EsUsadoEnCaja', $('#chkUsadoCaja').is(':checked') ? 1 : 0);
        formData.append('CodigoHIS', $('#txtCodigoHIS').val() || '');
        formData.append('idTipoFinanciador', $('#cboTipoFinanciador option:selected').val() || '');
        //formData.append('idTipoFinanciador', $('#cboTipoFinanciador option:selected').val() || 0);
        formData.append('codigo', $('#txtCodigo').val() || '');
        formData.append('Estado', '1');

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const res = await HttpClient.Post('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_InsertarActualizar?area=Comun', formData);

        if (!res.success) {
            alerta2('error', '', res.statusText);
            return;

        }
        alerta(1, 'Guardado');

    },

    GuardarDetalle: async function (
        vIdFuenteFinanciamiento,
        vIdTipoFinanciamiento) {

        let formData = new FormData();

        formData.append('vIdFuenteFinanciamiento', vIdFuenteFinanciamiento || '');
        formData.append('vIdTipoFinanciamiento', vIdTipoFinanciamiento || '');

        const res = await HttpClient.Post('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_InsertarActualizarDetalle?area=Comun', formData);

        if (!res.success) {
            alerta2('error', '', res.statusText);
            return;

        }
        alerta(1, 'Guardado');

    },
    EliminarDetalle: async function (
        vIdFuenteFinanciamiento,
        vIdTipoFinanciamiento) {

        let formData = new FormData();

        formData.append('vIdFuenteFinanciamiento', vIdFuenteFinanciamiento || '');
        formData.append('vIdTipoFinanciamiento', vIdTipoFinanciamiento || '');

        const res = await HttpClient.Post('/FuentesFinanciamiento/FuentesFinanciamientoIAFA_EliminarDetalle?area=Comun', formData);

        if (!res.success) {
            alerta2('error', '', res.statusText);
            return;

        }
        alerta(1, 'Eliminado');

    },

















    Events() {
        const self = this;

        $('#btnBuscar').on('click', async function () {
            let codigo = $('#txtCodigoff').val().trim();;
            let descripcion = $('#txtDescripcionff').val().trim();
            await self.FuenteFinanciamientoListarFactCatalogo(codigo, descripcion);
        });
        // Agrega evento para limpiar
        $('#btnLimpiar').on('click', function () {
            $('#txtCodigoPaqueteBusq').val('');
            $('#txtDescripcionPaqueteBusq').val('');
            self.oTable_Lista.clear().draw();
        });





        $('#btnEliminar').on('click', async function () {

        });


        $('#btnGuardar').on('click', async function () {
            if (!FuentesFinanciamiento.validaGuardar()) {
                return; // Detener ejecución si no es válido
            }

            await self.InsertarActualizar();
            //alerta2('success');
            FuentesFinanciamiento.LimpiarDatosFormulario();
            $('#modalFuenteFinanciamiento').modal('hide');
                $('#btnBuscar').click();
        });


        $('#btnModificar').on('click', async function () {

            $('#btnAgregarFilaPlan').prop('enable', true);
            $('#btnEliminarFilaPlan').prop('enable', true);

            let objRow = self.oTable_Lista.row('.selected').data();

            if (!objRow) {
                alerta(2, 'Por favor seleccione un registro.');
                return;
            }


            FuentesFinanciamiento.LimpiarDatosFormulario();
            $('#modalFuenteFinanciamiento').modal('show')

            $('#txtId').val(objRow.id)
            $('#txtId').prop('disabled', true);
            $('txtCodigo').prop('disabled', true);

            
            FuentesFinanciamiento.FuentesFinanciamientoBuscar(objRow.id)
            FuentesFinanciamiento.FuentesFinanciamientoBuscarDetalle(objRow.id)
        });


        //$('#modalFuenteFinanciamiento').one('shown.bs.modal', function () {
        //    FuentesFinanciamiento.FuentesFinanciamientoBuscar(objRow.id)
        //    FuentesFinanciamiento.FuentesFinanciamientoBuscarDetalle(objRow.id)
        //});




        $('#btnAgregar').on('click', async function () {
            $('#txtCodigo').val("000000000000");
            $('#txtCodigo').prop('disabled', true);
            $('#btnAgregarFilaPlan').prop('disabled', true);
            $('#btnEliminarFilaPlan').prop('disabled', true);


            $('#modalFuenteFinanciamiento').modal('show')

            self.cargarCombos();
            //this.LimpiarDatosFormulario();
      
            $('#txtId').prop('disabled', true);
        });






        $('#btnAgregarFilaPlan').on('click', async function () {

            const tarifarioSeleccionado = $('#cboTarifario option:selected').val();
            const id = $('#txtId').val()

            if (!tarifarioSeleccionado || tarifarioSeleccionado === '' || tarifarioSeleccionado === '0') {
                alerta2('warning', '', 'Debe seleccionar un tarifario');
                return false;
            } else {

                await  FuentesFinanciamiento.GuardarDetalle(id, tarifarioSeleccionado)

                FuentesFinanciamiento.FuentesFinanciamientoBuscarDetalle(id)
            }

            

        });

        $('#btnEliminarFilaPlan').on('click', async function () {
            

            const id = $('#txtId').val();
            let filaSeleccionada = $('#tblDetalleFuente tr.selected');

            if (filaSeleccionada.length === 0) {
                alerta(2, 'Por favor seleccione un registro.');
                return;
            }

            // Obtener el ID directamente de la primera columna
            let idEliminar = filaSeleccionada.find('td:first-child').text().trim();

            await FuentesFinanciamiento.EliminarDetalle(id, idEliminar);

            // Eliminar la fila visualmente inmediatamente
            filaSeleccionada.remove();
            await FuentesFinanciamiento.FuentesFinanciamientoBuscarDetalle(id);

        });
















        $('#tblTableLista').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                
                self.oTable_Lista.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        });

        $('#tblDetalleFuente').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {

                //self.oTable_Lista.$('tr.selected').removeClass('selected')
                $('#tblDetalleFuente tr.selected').removeClass('selected');
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
    FuentesFinanciamiento.Init();
});