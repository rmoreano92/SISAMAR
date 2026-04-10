let Farmacia = {
    Plugins: () => {
        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' })
        $(".chzn-select-deselect,#select2_sample").chosen()
    },

    ListarFarmAlmacenes: () => {
        let formData = new FormData()

        Cargando(1)

        HttpClient.Post('/UtilFarmacia/ListarFarmAlmacenes?area=Farmacia', formData)
            .then((res) => {
                if (res.estado) {
                    if (res.dataSet.table.length > 0) {

                        $('#cboFarmAlmacen').empty();
                        $('#cboFarmAlmacenPorFecha').empty();
                        $(res.dataSet.table).each(function (i, obj) {
                            $('#cboFarmAlmacen').append('<option  value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                            $('#cboFarmAlmacenPorFecha').append('<option  value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                        });

                        $('.chzn-select').chosen().trigger("chosen:updated");

                    }
                } else {
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },

    ListarSaldosPorAlmacen: () => {
        let formData = new FormData()

        formData.append('idTipoBusqueda', $('#cboTipoReporteFarmacia').val())
        formData.append('idAlmacen', $('#cboFarmAlmacen').val())

        HttpClient.Post('/ReportesFarmacia/ListarSaldosPorAlmacen?area=Farmacia', formData)
            .then((res) => {
                if (res.estado) {
                    if (res.dataSet.table.length > 0) {
                        console.log('res.dataSet.table', res.dataSet.table)
                    }
                } else {
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },


    Events: () => {
    }
}

$(document).ready(() => {
    Farmacia.Plugins()

    Farmacia.ListarFarmAlmacenes()

    Farmacia.Events()
})