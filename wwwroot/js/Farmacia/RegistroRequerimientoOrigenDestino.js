(function () {
    const state = { detalle: [], requerimientos: [] };

    const parseDate = (v) => moment(v, 'DD/MM/YYYY', true);
    const isDateRangeValid = (ini, fin) => ini.isValid() && fin.isValid() && !ini.isAfter(fin);

    const setLoading = (show) => {
        if (show) { ShowLoading(); } else { HideLoading(); }
    };

    const notify = (type, msg) => Mensaje(type, msg);

    const validateRow = (row) => row.cantidadSolicitar > 0 && row.cantidadSolicitar <= row.saldoActual;

    const renderDetalle = () => {
        const tbody = $('#tblDetalleRequerimiento tbody');
        tbody.empty();
        state.detalle.forEach((it, i) => {
            tbody.append(`<tr data-id="${it.idProducto}">
                <td>${it.codigo}</td><td>${it.producto}</td><td>${it.unidad}</td>
                <td>${it.saldoActual}</td><td>${it.consumo}</td>
                <td><input class="form-control form-control-sm txt-cant" data-index="${i}" type="number" min="1" value="${it.cantidadSolicitar}"/></td>
                <td><button class="btn btn-danger btn-sm btn-del" data-index="${i}">Eliminar</button></td>
            </tr>`);
        });
    };

    const addProducto = () => {
        const id = prompt('ID Producto');
        const nombre = prompt('Nombre Producto');
        if (!id || !nombre) return;
        if (state.detalle.some(x => String(x.idProducto) === String(id))) return notify(3, 'No se permiten productos duplicados.');
        state.detalle.push({ idProducto: id, codigo: `P-${id}`, producto: nombre, unidad: 'UND', saldoActual: 100, consumo: 0, cantidadSolicitar: 1 });
        renderDetalle();
    };

    const calcularConsumo = async () => {
        const fi = parseDate($('#txtFechaInicioConsumo').val());
        const ff = parseDate($('#txtFechaFinConsumo').val());
        if (!$('#txtFechaInicioConsumo').val() || !$('#txtFechaFinConsumo').val()) return notify(3, 'Fecha inicio y fecha fin son obligatorias.');
        if (!isDateRangeValid(fi, ff)) return notify(3, 'Fecha inicio no puede ser mayor que fecha fin.');
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 500));
            state.detalle = state.detalle.map(x => ({ ...x, consumo: Math.floor(Math.random() * 10) + 1 }));
            renderDetalle();
            notify(1, 'Consumo calculado correctamente.');
        } finally { setLoading(false); }
    };

    const validarAntesGuardar = () => {
        if (state.detalle.length === 0) return 'Debe agregar al menos un producto.';
        const invalid = state.detalle.find(x => !validateRow(x));
        if (invalid) return `Cantidad inválida para ${invalid.producto}. Debe ser > 0 y no superar saldo actual.`;
        return '';
    };

    const enviar = async (esEnvio) => {
        const msg = validarAntesGuardar();
        if (msg) return notify(3, msg);
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 500));
            notify(1, esEnvio ? 'Requerimiento enviado correctamente.' : 'Requerimiento guardado correctamente.');
        } finally { setLoading(false); }
    };

    const renderRequerimientos = () => {
        const tbody = $('#tblRequerimientosEnviados tbody');
        tbody.empty();
        state.requerimientos.forEach((r, i) => {
            tbody.append(`<tr><td>${r.numero}</td><td>${r.fecha}</td><td>${r.origen}</td><td>${r.destino}</td><td>${r.estado}</td>
                <td>
                    <button class="btn btn-info btn-sm">Ver detalle</button>
                    <button class="btn btn-success btn-sm">Aprobar</button>
                    <button class="btn btn-warning btn-sm">Editar cantidades</button>
                    <button class="btn btn-danger btn-sm">Rechazar</button>
                    <button class="btn btn-secondary btn-sm">Desestimar</button>
                </td></tr>`);
        });
    };

    const buscarRequerimientos = async () => {
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 400));
            state.requerimientos = [
                { numero: 'REQ-001', fecha: moment().format('DD/MM/YYYY'), origen: 'FARM CENTRAL', destino: 'ALM PRINCIPAL', estado: 'PENDIENTE' }
            ];
            renderRequerimientos();
        } finally { setLoading(false); }
    };

    $(function () {
        $('#txtFechaRegistro').val(moment().format('DD/MM/YYYY'));
        $('#btnAgregarRequerimiento').on('click', function () {
            $('#TabRegistro').show().tab('show');
            $('#txtEstadoReq').val('BORRADOR');
        });
        $('#btnLimpiarBusqueda').on('click', function () {
            $('.search').val('');
            $('#tblRequerimientosEnviados tbody').empty();
        });
        $('#btnAgregarProducto').on('click', addProducto);
        $('#btnCalcularConsumo').on('click', calcularConsumo);
        $('#btnGuardarRequerimiento').on('click', () => enviar(false));
        $('#btnEnviarRequerimiento').on('click', () => enviar(true));
        $('#btnCancelarRequerimiento').on('click', () => {
            state.detalle = [];
            renderDetalle();
            $('#TabBusqueda').tab('show');
            $('#TabRegistro').hide();
            notify(1, 'Operación cancelada.');
        });
        $('#btnBuscarRequerimientos').on('click', buscarRequerimientos);

        $('#tblDetalleRequerimiento').on('click', '.btn-del', function () {
            const i = Number($(this).data('index'));
            state.detalle.splice(i, 1);
            renderDetalle();
        });

        $('#tblDetalleRequerimiento').on('change', '.txt-cant', function () {
            const i = Number($(this).data('index'));
            const value = Number($(this).val());
            state.detalle[i].cantidadSolicitar = value;
            if (!validateRow(state.detalle[i])) notify(3, 'Cantidad a solicitar debe ser mayor a cero y no exceder el saldo actual.');
        });
    });
})();
