export async function ListarAtenciones(filtro) {
    let formData = new FormData();
    formData.append("lcFiltro", filtro);

    let datosAtencion = await HttpClient.Post('/FormatoFua/ListarAtenciones?area=Sis', formData)

    return datosAtencion.data.table
}

export async function SeleccionarSisFuaAtencion(IdCuentaAtencion) {
    let formData = new FormData();

    formData.append('IdCuentaAtencion', IdCuentaAtencion);

    const res = await HttpClient.Post('/FormatoFua/SeleccionarSisFuaAtencion?area=Comun', formData);

    if (isEmpty(res.data)) {
        alerta(2, 'Error al seleccionar la atención');
        return
    }
    return res.data.table[0];
}

export async function Listar_m_IIEE_Grado(IdNivel) {
    let formData = new FormData();

    formData.append("IdNivel", IdNivel);

    const res = await HttpClient.Post(
        "/FormatoFua/Listar_m_IIEE_Grado?area=Comun",
        formData
    );

    if (isEmpty(res.data)) {
        alerta(2, "Error al listar las fuentes de financiamiento");
        return;
    }

    return res.data.table
}

export async function ListarInstitucionEducativa (Codigo, Nombre) {

    let formData = new FormData();

    formData.append("Codigo", Codigo);
    formData.append("Nombre", Nombre);

    const res = await HttpClient.Post(
        "/FormatoFua/ListarInstitucionEducativa?area=Comun",
        formData
    );

    return res.data.table
}