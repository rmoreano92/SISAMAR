ALTER PROCEDURE [dbo].[web_PapeletasAltaMedica] (
@IdAtencion INT = NULL,
@IdServicio INT = NULL,
@usuarioRegistro INT = NULL
)
AS
BEGIN
--UPDATE EvaluacionEmergenciaDetalle SET idServicio = @IdServicio WHERE IdAtencion = @IdAtencion AND idServicio IS NULL
SELECT 
FirmasDigitales.id,
Atenciones.IdCuentaAtencion,
Empleados.ApellidoPaterno + ' ' + Empleados.ApellidoMaterno + ' ' + Empleados.Nombres AS Medico,
ISNULL(Medicos.IdMedico, 0) AS IdMedico,
ISNULL(FirmasDigitales.code, '') AS code,
FirmasDigitales.statusFirma,
FirmasDigitales.idEmpleado AS idEmpleadoFirma,
CASE 
	when FirmasDigitales.tipo = 'E-PH'  then 'PAPELETA HOSPITALIZACIÓN'
	when FirmasDigitales.tipo = 'E-PHF' then 'PAPELETA HOSPITALIZACIÓN FAMILIAR'
	when FirmasDigitales.tipo = 'E-PEM' then 'PAPELETA EXONERACION MÉDICA'
	ELSE ''
END Tipo
FROM Atenciones
LEFT JOIN Medicos ON Medicos.IdMedico = Atenciones.IdMedicoEgreso 
LEFT JOIN Empleados ON Empleados.IdEmpleado = Medicos.IdEmpleado
LEFT JOIN FirmasDigitales ON FirmasDigitales.idCuentaAtencion = Atenciones.IdCuentaAtencion AND 
	FirmasDigitales.idRegistro = Atenciones.IdAtencion AND FirmasDigitales.tipo in('E-PH','E-PHF','E-PEM')
WHERE Atenciones.IdAtencion = @IdAtencion AND FirmasDigitales.tipo in('E-PH','E-PHF','E-PEM') and FirmasDigitales.idEstado = 1
 ORDER BY FirmasDigitales.id ASC

END