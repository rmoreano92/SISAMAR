var ID_ReporteAdmitidos = {

    Inicializar() {
        $('#txtFechaInicioAdmitidos').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaFinAdmitidos').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        const hoy = moment().format('DD/MM/YYYY');
        $('#txtFechaInicioAdmitidos').val(hoy);
        $('#txtFechaFinAdmitidos').val(hoy);
        $('#txtHoraInicioAdmitidos').val('00:00');
        $('#txtHoraFinAdmitidos').val('00:00');
    },

    CerrarModal() {
        $('#modalReporte').modal('hide');
    },

    GenerarReporte() {
        const fechaInicio = $('#txtFechaInicioAdmitidos').val();
        const fechaFin = $('#txtFechaFinAdmitidos').val();
        const horaInicio = $('#txtHoraInicioAdmitidos').val();
        const horaFin = $('#txtHoraFinAdmitidos').val();

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
        fetch('/Reportes/ReporteAdmitidosEmergencia?area=Reportes', {
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
                a.download = 'Reporte_Admitidos_Emergencia.xlsx';
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
    ID_ReporteAdmitidos.Inicializar();
});
