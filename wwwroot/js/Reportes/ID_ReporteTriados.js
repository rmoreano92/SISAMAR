var ID_ReporteTriados = {

    Inicializar() {
        $('#txtFechaInicioTriados').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaFinTriados').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        const hoy = moment().format('DD/MM/YYYY');
        $('#txtFechaInicioTriados').val(hoy);
        $('#txtFechaFinTriados').val(hoy);
        $('#txtHoraInicioTriados').val('00:00');
        $('#txtHoraFinTriados').val('00:00');
    },

    CerrarModal() {
        $('#modalReporte').modal('hide');
    },

    GenerarReporte() {
        const fechaInicio = $('#txtFechaInicioTriados').val();
        const fechaFin = $('#txtFechaFinTriados').val();
        const horaInicio = $('#txtHoraInicioTriados').val();
        const horaFin = $('#txtHoraFinTriados').val();

        if (isEmpty(fechaInicio)) {
            alerta2('info', '', 'Ingrese la fecha de inicio.');
            return;
        }

        if (isEmpty(fechaFin)) {
            alerta2('info', '', 'Ingrese la fecha de fin.');
            return;
        }

        if (isEmpty(horaInicio)) {
            alerta2('info', '', 'Ingrese la hora de inicio.');
            return;
        }

        if (isEmpty(horaFin)) {
            alerta2('info', '', 'Ingrese la hora de fin.');
            return;
        }

        const mFechaInicio = moment(fechaInicio, 'DD/MM/YYYY', true);
        const mFechaFin = moment(fechaFin, 'DD/MM/YYYY', true);

        if (!mFechaInicio.isValid() || !mFechaFin.isValid()) {
            alerta2('info', '', 'Formato de fecha inválido.');
            return;
        }

        if (mFechaInicio.isAfter(mFechaFin)) {
            alerta2('info', '', 'La fecha de inicio debe ser menor o igual a la fecha fin.');
            return;
        }

        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(horaInicio) || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(horaFin)) {
            alerta2('info', '', 'Formato de hora inválido. Use HH:mm.');
            return;
        }

        if (mFechaInicio.isSame(mFechaFin) && horaInicio > horaFin) {
            alerta2('info', '', 'La hora de inicio debe ser menor o igual a la hora fin.');
            return;
        }

        let formData = new FormData();
        formData.append('fechaInicio', fechaInicio);
        formData.append('fechaFin', fechaFin);
        formData.append('horaInicio', horaInicio);
        formData.append('horaFin', horaFin);

        Cargando(1);
        fetch('/Reportes/ReporteTriadosEmergencia?area=Reportes', {
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
                if (isEmpty(blob)) {
                    return;
                }

                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'Reporte_Triados_Emergencia.xlsx';
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
    ID_ReporteTriados.Inicializar();
});
