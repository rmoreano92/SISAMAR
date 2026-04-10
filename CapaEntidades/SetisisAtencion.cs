using CapaDatos;
using System.Collections.Generic;

namespace WebAppMaternidad.CapaEntidades
{
    public class SetisisAtencion
    {
        public string idAtencion { get; set;}
        public string loteFua { get; set;}
        public string nroFua { get; set;}
        public string renipress { get; set;}
        public string idCategoria { get; set;}
        public string nivel { get; set;}
        public string idPuntoDigitacion { get; set;}
        public string idComponente { get; set;}
        public string idDisaAsegurado { get; set;}
        public string idLoteAsegurado { get; set;}
        public string idCorrelativoAsegurado { get; set;}
        public string idSecuenciaAsegurado { get; set;}
        public string idTablaAsegurado { get; set;}
        public string idContratoAsegurado { get; set;}
        public string idPlan { get; set;}
        public string idGrupoPoblacional { get; set;}
        public string idTipoDocAsegurado { get; set;}
        public string numDocAsegurado { get; set;}
        public string apePaterno { get; set;}
        public string apeMaterno { get; set;}
        public string nombres { get; set;}
        public string fecNac { get; set;}
        public string idSexo { get; set;}
        public string idUbigeo { get; set;}
        public string historiaClinica { get; set;}
        public string idTipoAtencion { get; set;}
        public string idCondicionMaterna { get; set;}
        public string idModalidadAtencion { get; set;}
        public string nroAutorizacion { get; set;}
        public string montoAutorizado { get; set;}
        public string fecHoraAtencion { get; set;}
        public string renipressReferencia { get; set;}
        public string nroHojaReferencia { get; set;}
        public string idServicio { get; set;}
        public string idOrigenPersonal { get; set;}
        public string idLugarAtencion { get; set;}
        public string idDestinoAsegurado { get; set;}
        public string fecIngresoHospitalizacion { get; set;}
        public string fecAltaHospitalizacion { get; set;}
        public string renipressContraReferencia { get; set;}
        public string nroHojaContraReferencia { get; set;}
        public string fecParto { get; set;}
        public string idGrupoRiesgo { get; set;}
        public string fecFallecimiento { get; set;}
        public string renipressOfertaFlexible { get; set;}
        public string idEtnia { get; set;}
        public string idIafas { get; set;}
        public string idCodigoIafas { get; set;}
        public string idUps { get; set;}
        public string fecCorteAdministrativo { get; set;}
        public string idUdrAutorizaVinculado { get; set;}
        public string loteAutorizaVinculado { get; set;}
        public string nroAutorizaVinculado { get; set;}
        public string disaFuaVinculado { get; set;}
        public string loteFuaVinculado { get; set;}
        public string nroFuaVinculado { get; set;}
        public string idTipoDocRespAte { get; set;}
        public string numDocRespAte { get; set;}
        public string idTipoPersonalSalud { get; set;}
        public string idEspecialidadRespAte { get; set;}
        public string esEgresadoRespAte { get; set;}
        public string colegiaturaRespAte { get; set;}
        public string rneRespAte { get; set;}
        public string idTipoDocDigitador { get; set;}
        public string numDocDigitador { get; set;}
        public string fecHoraRegistro { get; set;}
        public string observacion { get; set;}
        public string versionAplicativo { get; set;}
        public string codigoAcreditacion { get; set;}
        public string fecHoraIniFuaAdm { get; set;}
        public string fecHoraFinFuaAdm { get; set;}
        public string idMotivoIngresoCasaMaterna { get; set;}
        public string idCasaMaterna { get; set;}
        public string idEstado { get; set;  }
        public string esObservado { get; set; }
        public SetisisControl control { get; set; }
        public List<SetisisAtDiagnostico> atDiagnosticos { get; set; }
        public List<SetisisAtInsumo> atInsumos { get; set; }
        public List<SetisisAtMedicamento> atMedicamentos { get; set; }
        public List<SetisisAtProcedimiento> atProcedimientos { get; set; }
        public List<SetisisAtRecienNacido> atRecienNacidos { get; set; }
        public List<SetisisAtServAdicional> atServAdicionales { get; set; }
        public List<SetisisAtServMatInfantil> atServMatInfantiles { get; set; }
        public List<SetisisAtTransporte> atTransportes { get; set; }
        public List<SetisisAtViatico> atViaticos { get; set; }
        public List<SetisisAtOtroGasto> atOtrosGastos { get; set; }
    }
}

