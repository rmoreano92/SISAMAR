
export async function FacturacionServicioDespachoXcuenta(idCuentaAtencion) {

    let formData = new FormData()

    formData.append("idCuentaAtencion", idCuentaAtencion);



    let response = await HttpClient.Post(`/ConsumoServicio/FacturacionServicioDespachoXcuenta`, formData)

    if (isEmpty(response) || response.data.table <= 0) {
        return false
    }

    let data = response.data.table

    return response.data.table

}

export async function FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion) {

    let formData = new FormData()

    formData.append("idCuentaAtencion", idCuentaAtencion);

    let response = await HttpClient.Post(`/EstadoCuenta/FarmMovimientoVentasDetalleXcuenta`, formData)

    if (isEmpty(response) || response.data.table <= 0) {
        return false
    }

    return response.data.table

}

export async function ListarConsolidadoPorEstadoCuenta(idCuentaAtencion) {

    let formData = new FormData()

    formData.append("idCuentaAtencion", idCuentaAtencion);

    let response = await HttpClient.Post(`/EstadoCuenta/ListarConsolidadoPorEstadoCuenta`, formData)

    if (isEmpty(response) || response.data.table <= 0) {
        return false
    }

    return { cabecera: response.data.table1, detalle: response.data.table }

}

export async function AtencionesListaCuentasXpaciente(IdPaciente) {

    let formData = new FormData();

    formData.append('IdPaciente', IdPaciente);

    const res = await HttpClient.Post('/EstadoCuenta/AtencionesListaCuentasXpaciente?area=Comun', formData);

    if (isEmpty(res.data)) {
        alerta(2, 'Error al listar las cuentas')
        return
    }

    return res.data.table

}

export async function TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta(IdtipoFinanciamiento) {
    let formData = new FormData();
    formData.append('IdtipoFinanciamiento', IdtipoFinanciamiento);

    let res = await HttpClient.Post("/EstadoCuenta/TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta?area=Seguridad", formData)

    if (res.data.table.length <= 0) {
        return 0
    }

    return res.data.table[0]
}

export async function DevuelveSubAreaDondeLaboraElUsuarioDelSistema(idLaboraArea) {
    let formData = new FormData();
    formData.append('idLaboraArea', idLaboraArea);

    let areaLabora = await HttpClient.Post("/Empleados/DevuelveSubAreaDondeLaboraElUsuarioDelSistema?area=Seguridad", formData)

    if (areaLabora.lstData.table.length <= 0) {
        return 0
    }

    return areaLabora.lstData.table[0].idLaboraSubArea
}

export async function AtencionesFiltraDatosCabecera(IdCuentaAtencion) {

    let formData = new FormData()

    formData.append("IdCuentaAtencion", IdCuentaAtencion);

    let response = await HttpClient.Post(`/EstadoCuenta/AtencionesFiltraDatosCabecera`, formData)

    if (isEmpty(response) || response.data.table <= 0) {
        return false
    }

    let data = response.data.table

    return data

}

export async function AtencionesSeleccionarPorTipoServicio() {

    let formData = new FormData()

    formData.append("idTipoServicio", $('input[name="rdbTipoBusqueda"]:checked').val());
    formData.append("FechaIni", $('#txtFechaIngresoBusq').val());
    formData.append("FechaFin", $('#txtFechaHastaBusq').val());

    let response = await HttpClient.Post(`/EstadoCuenta/AtencionesSeleccionarPorTipoServicio`, formData)

    if (isEmpty(response) || response.data.table <= 0) {
        Cargando(0)
        return false
    }

    return response.data.table
}

export async function FactOrdenServicioPreventasServicio() {
    let formData = new FormData()

    formData.append("FechaInicio", $('#txtFechaIngresoBusq').val());
    formData.append("FechaFin", $('#txtFechaHastaBusq').val());

    let response = await HttpClient.Post(`/EstadoCuenta/FactOrdenServicioPreventasServicio`, formData)

    if (isEmpty(response) || response.data.table <= 0) {
        Cargando(0)
        return false
    }

    return response.data.table
}

export async function farmMovimientoVentasExoneracionesEnFarmacia() {
    let formData = new FormData()

    formData.append("FechaInicio", $('#txtFechaIngresoBusq').val());
    formData.append("FechaFin", $('#txtFechaHastaBusq').val());

    let response = await HttpClient.Post(`/EstadoCuenta/farmMovimientoVentasExoneracionesEnFarmacia`, formData)

    if (isEmpty(response) || response.data.table <= 0) {
        Cargando(0)
        return false
    }

    return response.data.table
}

export async function AtencionesSeleccionarPacExtPorFechas() {
    let formData = new FormData()

    formData.append("ldFechaIni", $('#txtFechaIngresoBusq').val());
    formData.append("ldFechaFin", $('#txtFechaHastaBusq').val());

    let response = await HttpClient.Post(`/EstadoCuenta/AtencionesSeleccionarPacExtPorFechas`, formData)

    if (isEmpty(response) || response.data.table <= 0) {
        Cargando(0)
        return false
    }

    return response.data.table
}

export async function ValidarInicioSesion(usuario, contrasenia) {

    let formData = new FormData()

    formData.append("usuario", usuario);
    formData.append("contrasenia", contrasenia);

    let response = await HttpClient.Post(`/EstadoCuenta/ValidarInicioSesion`, formData)

    return response
}

export async function GenerarExoneracionCuentaPaciente(IdCuentaAtencion, lstServicios, lstFarmacias) {

    let formData = new FormData()

    formData.append('IdCuentaAtencion', IdCuentaAtencion)
    formData.append('lstServicios', lstServicios)
    formData.append('lstFarmacias', lstFarmacias)
    formData.append('IdListBarItem', ObtenerItemListBar())

    let res = await HttpClient.Post('/EstadoCuenta/GenerarExoneracionCuentaPaciente?area=Farmacia', formData)

    if (!res.success) {
        alerta2('error', '', res.statusText)
        return
    }

    return res.data.table[0]
}

export async function FacturacionCuentasAtencionPagada(IdCuentaAtencion, IdPaciente) {

    let formData = new FormData();

    formData.append('IdCuentaAtencion', IdCuentaAtencion);
    formData.append('IdPaciente', IdPaciente);
    formData.append('IdListItem', ObtenerItemListBar());

    let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionPagada?area=Farmacia', formData)

    if (!res.success) {
        alerta2('error', '', res.statusText)
        return
    }

    return res.data.table[0]
}

export async function PacientesSeleccionarPorId(idPaciente) {
    let formData = new FormData();

    formData.append("idPaciente", idPaciente);

    let res = await HttpClient.Post('/Paciente/PacientesSeleccionarPorId', formData);

    if (!res.estado) {
        //alerta(3, res.msg);
        return null;
    }

    if (res.data.table?.length) {
        return res.data.table[0];
    }
    return null;
}

export async function FacturacionCuentasAtencionPendientePagoSeguro(IdCuentaAtencion, IdPaciente) {
    let formData = new FormData();

    formData.append('IdCuentaAtencion', IdCuentaAtencion);
    formData.append('IdPaciente', IdPaciente);
    formData.append('IdListItem', ObtenerItemListBar());

    let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionPendientePagoSeguroEstadoCuenta?area=Farmacia', formData)

    if (!res.success) {
        alerta2('error', '', res.statusText)
        return
    }

    return res.data.table[0]
}

export async function ValidarPermisoAbrirCuentas() {
    let formData = new FormData()

    let response = await HttpClient.Post(`/EstadoCuenta/ValidarPermisoAbrirCuentas`, formData)

    return response.data.table[0]
}

export async function FacturacionCuentasAtencionAbrir(IdCuentaAtencion) {
    let formData = new FormData();

    formData.append('IdCuentaAtencion', IdCuentaAtencion);
    formData.append('IdListItem', ObtenerItemListBar());

    let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionAbrir?area=Farmacia', formData)

    if (!res.success) {
        alerta2('error', '', res.statusText)
        return
    }

    return res.data.table[0]
}

export async function FacturacionCuentasAtencionCerrar(IdCuentaAtencion, IdPaciente) {

    let formData = new FormData();

    formData.append('IdCuentaAtencion', IdCuentaAtencion);
    formData.append('IdPaciente', IdPaciente);
    formData.append('IdListItem', ObtenerItemListBar());

    let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionCerrar?area=Farmacia', formData)

    if (!res.success) {
        alerta2('error', '', res.statusText)
        return
    }

    return res.data.table[0]
}

export async function FacturacionCuentasAtencionAnulada(IdCuentaAtencion, IdPaciente) {

    let formData = new FormData();

    formData.append('IdCuentaAtencion', IdCuentaAtencion);
    formData.append('IdPaciente', IdPaciente);
    formData.append('IdListItem', ObtenerItemListBar());

    let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionAnulada?area=Farmacia', formData)

    if (!res.success) {
        alerta2('error', '', res.statusText)
        return
    }

    return res.data.table[0]
}

export async function FacturacionCuentasAtencionAltaConDeudaYGarante(IdCuentaAtencion, IdPaciente) {

    let formData = new FormData();

    formData.append('IdCuentaAtencion', IdCuentaAtencion);
    formData.append('IdPaciente', IdPaciente);
    formData.append('IdListItem', ObtenerItemListBar());

    let res = await HttpClient.Post('/EstadoCuenta/FacturacionCuentasAtencionAltaConDeudaYGarante?area=Farmacia', formData)

    if (!res.success) {
        alerta2('error', '', res.statusText)
        return
    }

    return res.data.table[0]
}

export async function FuentesFinanciamientoSegunFiltro(lcFiltro) {

    let formData = new FormData();

    formData.append('lcFiltro', lcFiltro);

    const res = await HttpClient.Post('/Utilitario/FuentesFinanciamientoSegunFiltro?area=Comun', formData);

    return res.data.table
}

export async function TiposFinanciamientosTarifaSeleccionarPorPlan(idFuenteFinanciamiento) {
    let formData = new FormData();

    formData.append('idFuenteFinanciamiento', idFuenteFinanciamiento);

    const res = await HttpClient.Post('/Utilitario/TiposFinanciamientosTarifaSeleccionarPorPlan?area=Comun', formData);

    return res.data.table
}

export async function PacientesFiltrarTodosSoloHistorias() {

    let formData = new FormData()

    let idDocIdentidad = ''

    if ($('#txtDniPacienteBusqueda').val().length == 8) {
        idDocIdentidad = 1
    } else if ($('#txtDniPacienteBusqueda').val().length == 9) {
        idDocIdentidad = 2
    }

    formData.append("nroHistoriaClinica", $('#txtNroHistoriaPacienteBusqueda').val())
    formData.append("apellidoPaterno", $('#txtApPaternoPacienteBusqueda').val())
    formData.append("apellidoMaterno", $('#txtApMaternoPacienteBusqueda').val())
    formData.append("primerNombre", $('#txtPrimerNombrePacienteBusqueda').val())
    formData.append("segundoNombre", '')
    formData.append("idDocIdentidad", idDocIdentidad)
    formData.append("nroDocumento", $('#txtDniPacienteBusqueda').val())

    let response = await HttpClient.Post(`/EstadoCuenta/PacientesFiltrarTodosSoloHistorias`, formData)

    if (isEmpty(response) || response.data.table <= 0) {
        return false
    }

    return response.data.table
}

export async function CambiarFuenteFinancimiento(idCuentaAtencion) {

    let formData = new FormData()

    formData.append('IdFuenteFinanciamiento', $('#cboFuenteFinancimiento').val())
    formData.append('IdTipoFinanciamiento', $('#cboProductoPlan').val())
    formData.append('IdCuentaAtencion', idCuentaAtencion)

    formData.append('IdListBarItem', ObtenerItemListBar())

    let res = await HttpClient.Post('/EstadoCuenta/CambiarFuenteFinancimiento?area=Farmacia', formData)

    if (!res.success) {
        alerta2('error', '', res.statusText)
        return
    }

    return res.data.table[0]
}

export async function ListarAtencionesPorPaciente (IdPaciente) {

    let formData = new FormData();

    formData.append('IdPaciente', IdPaciente);

    const res = await HttpClient.Post('/EstadoCuenta/AtencionesListaCuentasXpaciente?area=Comun', formData);

    if (isEmpty(res.data)) {
        alerta(2, 'Error al listar cuentas')
        return null
    }

    return res.data.table
}

export async function ObtenerCuentasConDudaDeSangrePorPaciente (idPaciente) {

    let formData = new FormData();

    formData.append('idPaciente', idPaciente);

    const res = await HttpClient.Post('/api/estado-cuenta/paciente/deudas/sangre', formData);

    if (isEmpty(res.data)) {
        alerta(2, 'Error al listar cuentas')
        return null
    }

    return res.data.table
}

// export class EstadoCuentaApi {
//     constructor(context) {
//         this.ctx = context;
//     }



//     async ListarAtencionesPorPaciente(IdPaciente) {
//         Cargando(1);

//         let formData = new FormData();

//         formData.append('IdPaciente', IdPaciente);

//         const res = await HttpClient.Post('/EstadoCuenta/AtencionesListaCuentasXpaciente?area=Comun', formData);

//         oTable_TableListaCuentasPacientesBusqueda.fnClearTable()

//         if (isEmpty(res.data)) {
//             alerta(2, 'Error al listar cuentas')
//             return
//         }

//         if (res.data.table.length > 0) {
//             oTable_TableListaCuentasPacientesBusqueda.fnAddData(res.data.table)
//         }


//         $('.chzn-select').chosen().trigger("chosen:updated")

//         Cargando(0)
//     }






















    






// }