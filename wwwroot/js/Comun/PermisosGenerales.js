var permisoFirmaDigital = 0;
var PermisoGeneral = {

    async ValidarServicioFirmaDigital() {
        const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();
        permisoFirmaDigital = permisosGenerales.table.find(item => item.codigo === 'FIRMA_DIGITAL').valorInt;
    },

    async SeleccionarPermisoGeneral (tipo) {
        var formData = new FormData();
        let datos;
        let resp;
                
        formData.append('tipo', tipo);
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/SeleccionaPermisoGeneral?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            //if (datos.session) {
                permisoRefcon = datos.respuesta;
                resp = datos.respuesta;
                //console.log(permisoRefcon);
            //}
            //else {
                //alert("La sesion ya expiro se volvera a recargar la pagina")                
                //location.reload();                
                //return false;
                //alerta(2, "La sesion ya expiro, por favor inicie sesión nuevamente.");
                //$("#modalLogin").modal('show');
            //}
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    SeleccionaParametros(idParametro) {
        let formData = new FormData();
        formData.append('idParametro', idParametro);

        return HttpClient.Post('/Utilitario/SeleccionaParametros?area=Comun', formData).then(res => {
            return res.dataSet.table
        })
    },

    async SeleccionarPermisosGenerales() {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('tipo', 'PERMISOS_GENERALES');
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Parametros/ParametrosSeleccionarPorTipo?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {                
                resp = datos.respuesta;
            } else {
                resp = null
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },
}