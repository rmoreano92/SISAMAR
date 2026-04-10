var DepartamentoHosp = {

    ///////////////////////////METODOS QUE CONSULTA BD////////////////////////////////////////////////////////////////////////
    async ListarDepartamentos(idHtml) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        Cargando(1)
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Departamentos/ListarDepartamentos?area=General",
                    //contentType: "application/json; charset=utf-8",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado.table.length > 0) {
                    $(idHtml).empty();
                    $(datos.lsResultado.table).each(function (i, obj) {
                        $(idHtml).append('<option value="' + obj.idDepartamento + '">' + obj.descripcionLarga + '</option>');
                    });
                    $(idHtml).val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('error', '', error.toString());
            return false;
        }

        return true;
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}