ALTER PROCEDURE [dbo].[web_ListarMedicosPorEspecialidad] (
@IdEspecialidad INT,
@idIpress INT = 0
)
AS
BEGIN

SELECT * FROM (
SELECT DISTINCT
Medicos.IdMedico,
Medico = ISNULL(Empleados.ApellidoPaterno, '') + ' ' + ISNULL(Empleados.ApellidoMaterno, '') + ' ' + ISNULL(Empleados.Nombres, '')
FROM Medicos
INNER JOIN Empleados ON Empleados.IdEmpleado = Medicos.IdEmpleado
INNER JOIN MedicosEspecialidad on MedicosEspecialidad.IdMedico = Medicos.IdMedico
INNER JOIN Especialidades on Especialidades.IdEspecialidad = MedicosEspecialidad.IdEspecialidad
INNER JOIN DepartamentosHospital on DepartamentosHospital.IdDepartamento = Especialidades.IdDepartamento
WHERE (@IdEspecialidad = 0 OR MedicosEspecialidad.IdEspecialidad = @IdEspecialidad) and 
	(DepartamentosHospital.idIpress = @idIpress or @idIpress = 0)
--ORDER BY Empleados.ApellidoPaterno, Empleados.ApellidoMaterno, Empleados.Nombres ASC
) medicos 
ORDER BY medicos.Medico ASC
END;
GO