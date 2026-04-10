export function renderFuentesFinaciamiento(data) {
    $('#cboFuenteFinancimiento').empty();

    $(data).each(function (i, obj) {

        $('#cboFuenteFinancimiento').append(`<option value="${obj.idFuenteFinanciamiento}">${obj.descripcion}</option>`)
    })
    $('#cboFuenteFinancimiento').val(0)
    $('.chzn-select').chosen().trigger("chosen:updated")
}

export function renderProductoPlan(data) {
    $('#cboProductoPlan').empty();

    $(data).each(function (i, obj) {

        $('#cboProductoPlan').append(`<option value="${obj.idTipoFinanciamiento}">${obj.descripcion}</option>`)
    })
    $('#cboProductoPlan').val(0)
    $('.chzn-select').chosen().trigger("chosen:updated")
}

export function renderComboCuentasAtencion(listaCuentas) {
    $('#cboSeleccionarCuenta').empty();

    $(listaCuentas).each(function (i, obj) {

        $('#cboSeleccionarCuenta').append(`<option value="${obj.idCuentaAtencion}">${obj.datosCuenta}</option>`)
    })
    $('#cboSeleccionarCuenta').val(0)
    $('.chzn-select').chosen().trigger("chosen:updated")
}

export function renderTablas(ctx, { servicios, farmacia, consolidado }) {
    cargarTabla(ctx.oTable_TableServicios, servicios);
    cargarTabla(ctx.oTable_TableFarmacia, farmacia);
    cargarTabla(ctx.oTable_TableConsolidado, consolidado?.detalle || []);

    if (consolidado && consolidado.cabecera?.length > 0) {
        renderTotalesConsolidado(consolidado.cabecera[0]);
    }
}

export function renderTotalesConsolidado(totales) {

    $('#lblDeudasPacientePorCuenta').text(``)
    $('#lblDeudasPaciente').text(``)

    $('#txtTotalPagar').val(totales?.totalServicios);
    $('#txtTotalSeguros').val(totales?.totalFinanciadoServicios);

    $('#txtTotalPagarFarm').val(totales?.totalFarmacia);
    $('#txtTotalSegurosFarm').val(totales?.totalFinanciadoFarmacia);

    $('#txtPagoCuentaFarm').val(totales?.pagoCuentaFarmacia);
    $('#txtPagoCuenta').val(totales?.pagoCuentaServicios);

    $('#txtDevolucionConsolidado').val(totales?.devolucion);
    $('#txtPagosCuentaConsolidado').val(totales?.pagoCuenta);
    $('#txtSaldoFinalConsolidado').val(totales?.totalSaldoFinal);
    $('#txtTotalConsumoConsolidado').val(totales?.totalConsumo);
    $('#txtExoneracionConsolidado').val(totales?.exoneraciones);
    $('#txtSegurosConsolidado').val(totales?.totalSeguros);

    if (totales?.totalSaldoFinal > 0) {
        $('#lblDeudasPacientePorCuenta').text(`La cuenta tiene una deuda de: ${totales?.totalSaldoFinal} soles`)
    }

    if (totales?.cuentasConDeuda != '') {
        $('#lblDeudasPaciente').text(`Deudas: Ctas: ${totales?.cuentasConDeuda}`)
    }

}

export function renderDatosCabecera(data) {

    $('#lblTipoPlanPaciente').text(``)

    $('#txtNroCuenta').val(data.idCuentaAtencion)
    $('#txtNroHistoria').val(data.nroHistoriaClinica)
    $('#txtNombrePaciente').val(data.paciente)
    $('#txtDomicilioPaciente').val(data.direccionDomicilio)

    $('#txtDatosCuenta').val(`(${data.estadoCta}) IAFA: ${data.dFuenteFinanciamiento} PP: ${data.dTipoFinanciamiento}`)
    $('#txtFechaIngreso').val(data.fechaIngreso + ' ' + data.horaIngreso)
    $('#txtFechaAltaMedica').val(data.fechaEgreso + ' ' + data.horaEgreso)
    $('#txtFechaAperturaCuenta').val(data.fechaCreacion + ' ' + data.horaCreacion)
    $('#txtFechaEgresoAdministrativo').val(data.fechaEgresoAdministrativo + ' ' + data.horaEgresoAdministrativo)

    $('#txtServicioEgreso').val(`${data.servActual} (${data.dTipoServicio}) Cod.Cama ${data.camaActual}`)
    $('#txtDiagnosticoEgreso').val(data.diagnostico)

    if (data.idFormaPago == 1) {
        $('#txtDatosCuenta, #txtNroCuenta').attr('style', 'background: #64a9ff; color: #fff; font-weight: bold;')
    } else {
        $('#txtDatosCuenta, #txtNroCuenta').attr('style', 'background: #FF9E99; color: #fff; font-weight: bold;')
    }

    $('#lblTipoPlanPaciente').text(` (TIPO DE PLAN: ${data.dTipoFinanciamiento})`)
}

export function ocultarContenedores() {
    $('#contListaPacientesTipoServicio').hide();
    $('#contListaPacientesPreventas').hide();
    $('#contListaPacientesExoFarmacia').hide();
    $('#contListaPacientesExternos').hide();
}

export function mostrarContenedorPorOpcion(ctx, opcion, data) {
    switch (opcion) {
        case '1':
        case '2':
        case '3':
            $('#contListaPacientesTipoServicio').show();

            if (data && data.length > 0) {
                ctx.oTable_TableListaPacientes.fnClearTable();
                ctx.oTable_TableListaPacientes.fnAddData(data);
            }
            break;
        case '4':
            $('#contListaPacientesPreventas').show();

            if (data && data.length > 0) {
                ctx.oTable_TableListaPacientesPreventas.fnClearTable()
                ctx.oTable_TableListaPacientesPreventas.fnAddData(data)
            }
            break;
        case '5':
            $('#contListaPacientesExoFarmacia').show();
            if (data && data.length > 0) {
                ctx.oTable_TableExoneracionesFarmacia.fnClearTable();
                ctx.oTable_TableExoneracionesFarmacia.fnAddData(data);
            }
            break;
        case '6':
            $('#contListaPacientesExternos').show();
            if (data && data.length > 0) {
                ctx.oTable_TableListaPacientesExternos.fnClearTable();
                ctx.oTable_TableListaPacientesExternos.fnAddData(data);
            }
            break;
    }
}





export function obtenerDiasTranscurridos(fecha) {
    // fecha en formato 'dd/mm/yyyy'
    let partes = fecha.split('/');
    let fechaInicio = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
    let fechaActual = new Date();

    // Calcular diferencia en milisegundos y convertir a días
    let diferencia = fechaActual - fechaInicio;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
}

export function toggleRowSelection(table, trElement) {
    if ($(trElement).hasClass('selected')) {
        $(trElement).removeClass('selected');
    } else {
        table.$('tr.selected').removeClass('selected');
        $(trElement).addClass('selected');
    }
}

export function parseDateDMY(fecha) {
    const partes = fecha.split('/');
    // partes[0]: día, partes[1]: mes, partes[2]: año
    return new Date(parseInt(partes[2], 10), parseInt(partes[1], 10) - 1, parseInt(partes[0], 10));
}

export function cargarTabla(table, data) {
    table.fnClearTable();
    if (data && data.length > 0) {
        table.fnAddData(data);
    }
}