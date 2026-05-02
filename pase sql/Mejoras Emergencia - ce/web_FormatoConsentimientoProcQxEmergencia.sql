ALTER PROCEDURE [dbo].[web_FormatoConsentimientoProcQxEmergencia]    
(        
 @NroCuenta INT = NULL  
 )        
 AS        
 BEGIN

 SELECT TOP 1
	a.IdCuentaAtencion,
	UPPER(ISNULL(pc.ApellidoPaterno, '') + ' ' +
		ISNULL(pc.ApellidoMaterno, '') + ' ' +  
		ISNULL(pc.PrimerNombre, '') + ' ' + 
		ISNULL(pc.SegundoNombre, '') + ' ' + 
		ISNULL(pc.TercerNombre, '')) Paciente,
	isnull(pc.FichaFamiliar,pc1.FichaFamiliar) CIP,pc.NroDocumento,
	gi.descripcion GradoIntruccion, a.Edad,
	cl.Descripcion Parentesco, upper(dx.descripcion) Diagnostico,
	cpts.Nombre Procedimiento,dx.Medico,dx.RNE,s.nombre Servicio,
	dx.Colegiatura, dx.dni NroDocumentoMedico
FROM dbo.Atenciones a
INNER JOIN pacientes pc on pc.idpaciente = a.idpaciente
INNER JOIN pacientes2207 pc1 on pc.idpaciente = pc1.idpaciente
inner join servicios s on s.IdServicio = a.IdServicioIngreso
LEFT JOIN TiposGradoInstruccion gi on gi.IdGradoInstruccion = isnull(pc.IdGradoInstruccion,pc1.IdGradoInstruccion)
LEFT JOIN TiposCondicionLaboral cl on cl.Idcondicion = isnull(pc.CondLaboral,pc1.CondLaboral)
OUTER APPLY (
	SELECT top 1 
		ad.IdAtencion,ad.IdDiagnostico,d.Descripcion,
		UPPER(e.ApellidoPaterno + ' ' + e.ApellidoMaterno + ' ' + e.Nombres) AS Medico,
		m.Colegiatura,m.rne RNE, e.dni
	FROM AtencionesDiagnosticos ad
	inner join Diagnosticos d on ad.IdDiagnostico = d.IdDiagnostico
	left join empleados e on e.IdEmpleado = ad.IdUsuario
	left join medicos m on m.IdEmpleado = e.IdEmpleado
	WHERE ad.IdAtencion = a.IdAtencion
	ORDER BY 
	CASE ad.IdSubClasificacionDX
			WHEN 502 THEN 1
			WHEN 501 THEN 2
			WHEN 301 THEN 3
			ELSE 4
	END,
	ad.NroEvaluacion desc,
	ad.IdAtencionDiagnostico desc
) dx
OUTER APPLY (
	SELECT TOP 1 fcs.IdProducto,fcs.Codigo,fcs.Nombre
	FROM FactCatalogoServicios fcs
	INNER join FacturacionServicioDespacho fsd on fsd.idproducto = fcs.idProducto
	INNER join FactOrdenServicio fos on fos.IdOrden = fsd.IdOrden
	WHERE fos.IdCuentaAtencion = a.IdCuentaAtencion and fos.idPuntoCarga = 1 and fos.IdEstadoFacturacion <> 9
	ORDER BY FechaCreacion DESC
) cpts
WHERE
a.IdCuentaAtencion = @NroCuenta AND
a.IdTipoServicio IN (2,4)
--Atenciones.EsPacienteExterno <> 1 
ORDER BY 
	a.FechaIngreso DESC,
	a.HoraIngreso DESC,
	a.FechaEgreso DESC,
	a.HoraEgreso DESC 
END;

















