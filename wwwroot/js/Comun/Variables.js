var Variables = {
    IdPaciente: 0,
    IdAtencion: 0,
    IdCuentaAtencion: 0,
    NroHistoriaClinica: 0,
    NroDocumento: 0,
    IdTipoSexo: 0,
    IdTipoServicio: 0,
    IdServicio: 0,
    IdEspecialidadIngreso: 0,
    IdServicioIngreso: 0,
    IdEspecialidadEgreso: 0,
    IdServicioEgreso: 0,
    IdServicioActual: 0,
    IdEstadoAtencion: 0,
    IdTipoAtencionAdolescencia: 0,
    IdTipoAtencionAnestesio: 0,
    IdMedico: 0,
    IdCita: 0,
    FechaInicioCita: '',
    HoraInicioCita: '',
    IdTipoFinanciamiento: 0,
    IdFuenteFinanciamiento: 0,
    UsaModuloMaterno: false,
    UsaModuloNAR: false,
    UsaModuloAnestesio: false,
    TipoModulo: '',
    FechaIngreso: '',
    HoraIngreso: '',
    FechaEgresoAdministrativo: '',
    NumeroEvaluacion: 0,
    IdProductoBienInsumo: 0,
    IdCamaActual: 0,
    IdEstanciaHospitalariaActual: 0,
    IdCitaProxima: 0,

    IdReferencia: 0,

    TipoArchivoFirmar: '',

    EsTeleconsulta: false,
    EsConsejeriaObstetrica: false,
    EsConsejeriaOncologica: false,
    EsConsejeriaEstrategiasSanitaria: false,

    //PanelDiagnostico: '',

    Cargar(datos) {
        Variables.IdPaciente = datos.idPaciente;
        Variables.IdAtencion = datos.idAtencion;
        Variables.IdCuentaAtencion = datos.idCuentaAtencion;
        Variables.NroHistoriaClinica = datos.nroHistoriaClinica;
        Variables.NroDocumento = datos.nroDocumento;
        Variables.IdTipoSexo = datos.idTipoSexo;
        Variables.IdTipoServicio = datos.idTipoServicio;
        Variables.IdServicio = datos.idServicio;
        Variables.IdServicioIngreso = datos.idServicioIngreso;
        Variables.IdEspecialidadIngreso = datos.idEspecialidadIngreso;
        Variables.IdServicioEgreso = datos.idServicioEgreso;
        Variables.IdEspecialidadEgreso = datos.idEspecialidadEgreso;
        Variables.IdServicioActual = datos.idServicioActual;
        Variables.IdEstadoAtencion = datos.idEstadoAtencion;
        Variables.IdTipoAtencionAdolescencia = datos.idTipoAtencionAdolescencia;
        Variables.IdTipoAtencionAnestesio = datos.idTipoAtencionAnestesio;
        Variables.IdTipoAtencionAnestesio = datos.idTipoAtencionAnestesio;
        Variables.IdMedico = datos.idMedico;
        Variables.IdCita = datos.idCita;
        Variables.FechaInicioCita = datos.fechaInicioCita;
        Variables.HoraInicioCita = datos.horaInicio;
        Variables.IdTipoFinanciamiento = datos.idTipoFinanciamiento;
        Variables.IdFuenteFinanciamiento = datos.idFuenteFinanciamiento;
        Variables.UsaModuloMaterno = datos.usaModuloMaterno;
        Variables.UsaModuloNAR = datos.usaModuloNinoSano;
        Variables.UsaModuloAnestesio = datos.usaModuloAnestesio;
        Variables.FechaIngreso = datos.fechaIngreso;
        Variables.HoraIngreso = datos.horaIngreso;
        Variables.FechaEgresoAdministrativo = datos.fechaEgresoAdministrativo;
        Variables.NumeroEvaluacion = datos.idNumero;
        Variables.EsTeleconsulta = datos.esTeleconsulta;
        Variables.EsConsejeriaObstetrica = datos.esConsejeriaObstetrica;
        Variables.EsConsejeriaOncologica = datos.esConsejeriaOncologica;
        Variables.EsConsejeriaEstrategiasSanitaria = datos.esConsejeriaEstrategiasSanitaria;
        Variables.IdCamaActual = datos.idCamaActual; 
        Variables.IdEstanciaHospitalariaActual = datos.idEstanciaHospitalariaActual;
        Variables.IdCitaProxima = datos.idCitaProxima;
        Variables.IdReferencia = datos.idReferenciaRefCon;
        Variables.TipoModulo = datos.tipoModulo;
    },

    Limpiar() {
        Variables.IdPaciente = 0;
        Variables.IdAtencion = 0;
        Variables.IdCuentaAtencion = 0;
        Variables.NroHistoriaClinica = 0;
        Variables.NroDocumento = 0;
        Variables.IdTipoSexo = 0;
        Variables.IdTipoServicio = 0;
        Variables.IdServicio = 0;
        Variables.IdEspecialidadIngreso = 0;
        Variables.IdServicioIngreso = 0;
        Variables.IdEspecialidadEgreso = 0;
        Variables.IdServicioEgreso = 0;
        Variables.IdServicioActual = 0;
        Variables.IdProductoBienInsumo = 0;
        Variables.IdEstadoAtencion = 0;
        Variables.IdTipoAtencionAdolescencia = 0;
        Variables.IdTipoAtencionAnestesio = 0;
        Variables.IdMedico = 0;
        Variables.IdCita = 0;
        Variables.FechaInicioCita = '';
        Variables.HoraInicioCita = '';
        Variables.IdTipoFinanciamiento = 0;
        Variables.IdFuenteFinanciamiento = 0;
        Variables.UsaModuloMaterno = false;
        Variables.UsaModuloNAR = false;
        Variables.UsaModuloAnestesio = false;
        Variables.FechaIngreso = '';
        Variables.HoraIngreso = '';
        Variables.FechaEgresoAdministrativo = '';
        Variables.NumeroEvaluacion = 0;
        Variables.TipoModulo = '';
        Variables.EsTeleconsulta = false;
        Variables.EsConsejeriaObstetrica = false;
        Variables.EsConsejeriaOncologica = false;
        Variables.EsConsejeriaEstrategiasSanitaria = false;
        Variables.IdCamaActual = 0;
        Variables.IdEstanciaHospitalariaActual = 0;
        Variables.IdCitaProxima = 0;
        Variables.IdReferencia = 0;
    },
}


