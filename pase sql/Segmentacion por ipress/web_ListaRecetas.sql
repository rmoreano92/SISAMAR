/*
  
  Modificacion: ROGER MOREANO CARLOS
  objetivo: archivo de formato de petitorio
  Fecha:17032026*/
  
ALTER PROCEDURE [dbo].[web_ListaRecetas]  
@nroReceta int,  
@nroCuenta int,  
@nroDni varchar(100) = '',  
@nroHistoria int,  
@apellidoPaterno varchar(100)='',  
@apellidoMaterno varchar(100)='',  
@idServicioGeneral int,
@IdIpress int = 0
as  
begin  
  
 SELECT   
 top 1000    
 Atenciones.IdAtencion,  
 dbo.RecetaCabecera.idCuentaAtencion,   
 Pacientes.IdPaciente,  
 convert(varchar(10),dbo.RecetaCabecera.FechaReceta,103) as FechaReceta,   
 dbo.Pacientes.NroDocumento,  
 dbo.Pacientes.NroHistoriaClinica,   
 dbo.Pacientes.ApellidoPaterno,     
 dbo.Pacientes.ApellidoMaterno ,  
 dbo.Pacientes.PrimerNombre,   
 Paciente = ISNULL(Pacientes.ApellidoPaterno, '') + ' ' + ISNULL(Pacientes.ApellidoMaterno, '') + ' ' + + ISNULL(Pacientes.PrimerNombre, '') + ' ' + ISNULL(Pacientes.SegundoNombre, '') + ' ' + ISNULL(Pacientes.TercerNombre, ''),  
 PlanFinanciamiento = ISNULL(FuentesFinanciamiento.Descripcion, ''),  
 FuentesFinanciamiento.IdFuenteFinanciamiento,  
 FuentesFinanciamiento.IdTipoFinanciamiento,  
 dbo.Atenciones.idTipoServicio,  
 dbo.RecetaCabecera.PreUnidosis ,   
 dbo.RecetaCabecera.idReceta ,   
 RecetaCabecera.idServicioReceta,  
 dbo.Servicios.Nombre as Servicio,  
 DesptCarga = (CASE   
      WHEN FactPuntosCarga.IdPuntoCarga = 5 AND RecetaCabecera.EsRecetaAntimicrobiano = 1 THEN FactPuntosCarga.Descripcion + ' (Antimicrobiano)'   
      WHEN FactPuntosCarga.IdPuntoCarga = 5 AND RecetaCabecera.EsRecetaIntervencionSanitaria = 1 THEN FactPuntosCarga.Descripcion + ' (Int. Sanitaria)'   
               ELSE FactPuntosCarga.Descripcion END),  
 RecetaCabecera.idEstado,  
 RecetaEstados.Estado as descEstado,  
 RecetaEstados.Estado as estadoReceta,  
 RecetaCabecera.IdPuntoCarga,  
 FechaVigenciaWeb = CONVERT(varchar(10), RecetaCabecera.fechaVigencia, 103),  
 NroEvaluacion = ISNULL(RecetaCabecera.NroEvaluacion, 0),  
 IdNumero = ISNULL(RecetaCabecera.NroEvaluacion, 0),  
 -----------------KHOYOSI-------------------  
 RecetaCabecera.idServicioReceta,  
 RecetaCabecera.idMedicoReceta,   
 movimiento = ISNULL((SELECT TOP 1 DocumentoDespacho FROM RecetaDetalleItem WHERE idReceta = RecetaCabecera.idReceta), ''),  
 boleta = ISNULL((SELECT TOP 1 LTRIM(RTRIM(NroSerie + '-' + NroDocumento)) FROM CajaComprobantesPago WHERE idComprobantePago = RecetaCabecera.idComprobantePago), ''),  
 ------------------------------------------------------------------------  
 ----------------KHOYOSI ANTIMICROBIANOS----------------------------------  
 EsRecetaAntimicrobiano = ISNULL(RecetaCabecera.EsRecetaAntimicrobiano, 0),  
 IdSolicitudAntimicrobiano = ISNULL(SolicitudAntimicrobianos.IdSolicitudAntimicrobiano, 0),  
 AutorizaAntimicrobiano = ISNULL(SolicitudAntimicrobianos.AutorizaAntimicrobiano, 9), -- 9: aun esta pendiente de autorizacion o rechazo.   
 --------------------------------------------  
 -----------------KHOYOSI INTERVENCION SANITARIA-------------------  
 EsRecetaIntervencionSanitaria = ISNULL(RecetaCabecera.EsRecetaIntervencionSanitaria, 0),  
 RecetaCabecera.IdObstetraReceta,  
 RecetaCabecera.IdCoordinadorIS,  
 RecetaCabecera.IdComponenteIS,  
 RecetaCabecera.IdSubComponenteIS,  
 RecetaCabecera.IdDiagnosticoIS,  
 codigoDxIS = ISNULL(LTRIM(RTRIM(Diagnosticos.CodigoCIE10)), ''),  
 RecetaCabecera.ObservacionesIS,   
 --------------------------------------------  
 firma.code,  
 firma.statusFirma, 
 --PACIENTE CRONICO
 Atenciones.PacienteCronico,
 codeCro =firmacro.code,  
 statusFirmaCro =firmacro.statusFirma 
 FROM dbo.RecetaCabecera  
 LEFT JOIN SolicitudAntimicrobianos ON SolicitudAntimicrobianos.IdReceta = RecetaCabecera.idReceta AND SolicitudAntimicrobianos.Estado = 1  
 LEFT JOIN Diagnosticos ON Diagnosticos.IdDiagnostico = RecetaCabecera.IdDiagnosticoIS  
 INNER JOIN dbo.Atenciones ON dbo.Atenciones.IdCuentaAtencion = dbo.RecetaCabecera.idCuentaAtencion  
 INNER JOIN dbo.Pacientes ON dbo.Pacientes.IdPaciente = dbo.Atenciones.IdPaciente  
 INNER JOIN dbo.Servicios ON dbo.Servicios.IdServicio = dbo.RecetaCabecera.idServicioReceta
 
 INNER JOIN dbo.Especialidades ON dbo.Especialidades.IdEspecialidad = dbo.Servicios.IdEspecialidad  
 INNER JOIN dbo.DepartamentosHospital ON dbo.DepartamentosHospital.IdDepartamento = dbo.Especialidades.IdDepartamento
 
 LEFT JOIN FuentesFinanciamiento ON FuentesFinanciamiento.IdFuenteFinanciamiento = Atenciones.idFuenteFinanciamiento  
 INNER join FactPuntosCarga on FactPuntosCarga.IdPuntoCarga=RecetaCabecera.IdPuntoCarga  
 INNER join RecetaEstados on RecetaEstados.idEstado=RecetaCabecera.idEstado  
 LEFT JOIN FirmasDigitales firma ON firma.idCuentaAtencion = RecetaCabecera.idCuentaAtencion AND firma.idRegistro = RecetaCabecera.idReceta AND firma.tipo = 'REC' 
 LEFT JOIN  FirmasDigitales firmacro on   firmaCro.idCuentaAtencion = dbo.RecetaCabecera.idCuentaAtencion   AND firmaCro.tipo = 'CE-APC'
 where   
 (@nroReceta =0 OR RecetaCabecera.idReceta=@nroReceta) and  
 (@nroCuenta =0 OR RecetaCabecera.idCuentaAtencion=@nroCuenta) and  
 (@nroDni = '' OR Pacientes.NroDocumento=@nroDni) and  
 (@nroHistoria = 0 OR Pacientes.NroHistoriaClinica=@nroHistoria) and  
 (@IdIpress = 0 OR DepartamentosHospital.idipress=@IdIpress) and  
 (@apellidoPaterno = '' OR Pacientes.ApellidoPaterno like '%'+@apellidoPaterno+'%') and  
 (@apellidoMaterno = '' OR Pacientes.ApellidoMaterno like '%'+@apellidoMaterno+'%') and  
 Atenciones.IdTipoServicio = @idServicioGeneral  
 ORDER BY RecetaCabecera.idReceta DESC  
  
end
















