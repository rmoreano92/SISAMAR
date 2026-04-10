var EvaluacionDetalle = {
    IdPaciente: 0,
    IdAtencion: 0,
    IdCuentaAtencion: 0,
    NroHistoriaClinica: 0,
    IdServicio: 0,
    IdMedico: 0,
    IdNumero: 0,

    Cargar(datos) {
        EvaluacionDetalle.IdPaciente = datos.idPaciente;
        EvaluacionDetalle.IdAtencion = datos.idAtencion;
        EvaluacionDetalle.IdCuentaAtencion = datos.idCuentaAtencion;
        EvaluacionDetalle.NroHistoriaClinica = datos.nroHistoriaClinica;
        EvaluacionDetalle.IdServicio = datos.idServicio == null ? 0 : datos.idServicio;
        EvaluacionDetalle.IdMedico = datos.idMedico == null ? 0 : datos.idMedico;
        EvaluacionDetalle.IdNumero = datos.idNumero;
    },

    Limpiar() {
        EvaluacionDetalle.IdPaciente = 0;
        EvaluacionDetalle.IdAtencion = 0;
        EvaluacionDetalle.IdCuentaAtencion = 0;
        EvaluacionDetalle.NroHistoriaClinica = 0;
        EvaluacionDetalle.IdServicio = 0;
        EvaluacionDetalle.IdMedico = 0;
        EvaluacionDetalle.IdNumero = 0;
    }
}