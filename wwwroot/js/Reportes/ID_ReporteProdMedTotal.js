var ID_ReporteProdMedTotal = {

    Inicializar() {
        // Inicializar combos usando lógica de Disponibilidad
        if (typeof Disponibilidad !== 'undefined') {
            Disponibilidad.Plugins();
            Disponibilidad.TiposAnaqueles();
            Disponibilidad.TiposAlmacen();
        }
    },

    CerrarModal() {
        $('#modalReporte').modal('hide');
    },

    GenerarReporte() {
        const idAlmacen = $('#cboAlmacen').val();
        const idAnaquel = $('#cboAnaquel').val();

        let formData = new FormData();
        formData.append('IdAlmacen', idAlmacen);
        formData.append('IdAnaquel', idAnaquel);

        Cargando(1);
        // Por ahora solo descargar placeholder o invocar endpoint cuando exista
        fetch('/ReportesFarmacia/ReporteProdMedTotal?area=Farmacia', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.status === 204) {
                    alerta2('info', '', 'No existen registros para descargar en el rango seleccionado.');
                    Cargando(0);
                    return;
                }

                if (!response.ok) {
                    throw new Error('No se pudo generar el reporte.');
                }

                return response.blob();
            })
            .then(blob => {
                if (!blob) return;
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'Reporte_ProdMed_Total.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                alerta2('success', '', 'La descarga se realizó con éxito.');
            })
            .catch(() => {
                alerta2('danger', '', 'Error al descargar documento, intente nuevamente.');
            })
            .finally(() => {
                Cargando(0);
            });
    }
};

$(document).ready(function () {
    ID_ReporteProdMedTotal.Inicializar();
});
