var ID_ReporteRecetasAtendidas = {

    Inicializar() {
        if (typeof Disponibilidad !== 'undefined') {
            Disponibilidad.Plugins();
            Disponibilidad.TiposAlmacen();
        }
    },

    CerrarModal() {
        $('#modalReporte').modal('hide');
    },

    GenerarReporte() {
        const idAlmacen = $('#cboAlmacen').val();

        let formData = new FormData();
        formData.append('IdAlmacen', idAlmacen);

        Cargando(1);
        fetch('/ReportesFarmacia/ReporteRecetasAtendidas?area=Farmacia', {
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
                a.download = 'Reporte_RecetasAtendidas.xlsx';
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
    ID_ReporteRecetasAtendidas.Inicializar();
});
