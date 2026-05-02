


ALTER PROCEDURE [dbo].[web_ProgramacionMedicaModificarV2] (
@IdProgramacion int,
@IdTipoServicio INT,
@IdEspecialidad INT,
@IdServicio INT,
@IdMedico INT,
@Fechas VARCHAR(MAX), -- NUEVO PARAMETRO
@IdTipoProgramacion INT,
@IdTurno INT,
@HoraInicio VARCHAR(5),
@HoraFinal VARCHAR(5),
@Descripcion VARCHAR(MAX) = NULL,
@Color VARCHAR(20) = NULL,
@IdUsuario INT
)
AS
BEGIN

BEGIN TRY

	DECLARE @WarningNumber INT = 0
	DECLARE @SuccessNumber INT = 0
	DECLARE @WarningMessage VARCHAR(100) = ''
	DECLARE @SuccessMessage VARCHAR(100) = ''

	DECLARE @IdProgramacionNueva INT = 0
	DECLARE @Mensaje VARCHAR(MAX) = ''
	DECLARE @Exito INT = 0
	DECLARE @existe int = 0

	DECLARE @IdDepartamento INT = (SELECT TOP 1 IdDepartamento FROM Especialidades WHERE IdEspecialidad = @IdEspecialidad)
	DECLARE @TiempoPromedioAtencion INT = (SELECT TOP 1 TiempoPromedioAtencion FROM EspecialidadCE WHERE IdEspecialidad = @IdEspecialidad)
	DECLARE @HoraFinProgramacion VARCHAR(5) = (SELECT TOP 1 HoraFin FROM Turnos WHERE IdTurno = @IdTurno)
	DECLARE @IdIpress INT = (select top 1 isnull(i.IdIpress,1) 
			from ipress i
			inner join DepartamentosHospital d on d.idIpress = i.idIpress
			inner join Especialidades e on e.idDepartamento = d.IdDepartamento
			where e.idEspecialidad = 1
	)

	DECLARE @FechaProgramacion DATETIME = NULL
	

	DECLARE @Servicio VARCHAR(200) = ''
	DECLARE @Medico VARCHAR(200) = ''
	DECLARE @ObsAuditoria VARCHAR(200) = ''

	----------------------------------------------------------
	-- CONVERTIR STRING DE FECHAS A TABLA (SQL SERVER 2014)
	----------------------------------------------------------

	DECLARE @TablaFechas TABLE (Fecha DATETIME)

	DECLARE @xml XML
	SET @xml = CAST('<i>' + REPLACE(@Fechas, ',', '</i><i>') + '</i>' AS XML)

	INSERT INTO @TablaFechas
	SELECT CONVERT(DATETIME, T.c.value('.', 'VARCHAR(20)'), 103)
	FROM @xml.nodes('/i') T(c)

	----------------------------------------------------------
	-- VALIDACION DE PROGRAMACION
	----------------------------------------------------------

	DECLARE curFechas CURSOR FOR
	SELECT Fecha FROM @TablaFechas

	OPEN curFechas
	FETCH NEXT FROM curFechas INTO @FechaProgramacion

	IF @IdProgramacion = 0
	BEGIN

		WHILE @@FETCH_STATUS = 0
		BEGIN

			IF @FechaProgramacion < CONVERT(DATE, GETDATE())
			BEGIN
				SET @WarningMessage = 'No puede programar fechas anteriores al día de hoy.'
				SET @WarningNumber = 1
				BREAK
			END

			SET @existe = (Select COUNT(IdProgramacion) 
							from ProgramacionMedica 
							where 
							IdMedico = @IdMedico AND
							CONVERT(VARCHAR(10), Fecha, 103) = CONVERT(VARCHAR(10), @FechaProgramacion, 103) AND
							(@HoraInicio >= HoraInicio AND @HoraInicio < HoraFin) AND
							(@HoraFinal > HoraInicio AND @HoraFinal <= HoraFin))

			IF @existe = 0
			BEGIN
				SET @existe = (Select COUNT(IdProgramacion) 
							   from ProgramacionMedica 
							   where 
							   IdServicio = @IdServicio AND
							   CONVERT(VARCHAR(10), Fecha, 103) = CONVERT(VARCHAR(10), @FechaProgramacion, 103) AND
							   (@HoraInicio >= HoraInicio AND @HoraInicio < HoraFin) AND
							   (@HoraFinal > HoraInicio AND @HoraFinal <= HoraFin))

				IF @existe = 0
				BEGIN
					SET @SuccessNumber = 1
				END
				ELSE
				BEGIN
					SET @WarningMessage = 'El servicio actual ya tiene una programación para la fecha ' + CONVERT(VARCHAR(10), @FechaProgramacion, 103)
					SET @WarningNumber = 1
					BREAK
				END
			END
			ELSE
			BEGIN
				SET @WarningMessage = 'El médico ya tiene una programación para la fecha ' + CONVERT(VARCHAR(10), @FechaProgramacion, 103)
				SET @WarningNumber = 1
				BREAK
			END

			FETCH NEXT FROM curFechas INTO @FechaProgramacion
		END
	END
	ELSE
	BEGIN

		FETCH NEXT FROM curFechas INTO @FechaProgramacion

		SET @existe = (Select COUNT(IdProgramacion) 
						from ProgramacionMedica 
						where
						IdProgramacion <> @IdProgramacion AND
						IdMedico = @IdMedico AND
						CONVERT(VARCHAR(10), Fecha, 103) = CONVERT(VARCHAR(10), @FechaProgramacion, 103) AND
						(@HoraInicio >= HoraInicio AND @HoraInicio < HoraFin) AND
						(@HoraFinal > HoraInicio AND @HoraFinal <= HoraFin))

		IF @existe = 0
		BEGIN
			SET @existe = (Select COUNT(IdProgramacion) 
						   from ProgramacionMedica 
						   where 
						   IdProgramacion <> @IdProgramacion AND 
						   IdServicio = @IdServicio AND 
						   CONVERT(VARCHAR(10), Fecha, 103) = CONVERT(VARCHAR(10), @FechaProgramacion, 103) AND
						   (@HoraInicio >= HoraInicio AND @HoraInicio < HoraFin) AND
						   (@HoraFinal > HoraInicio AND @HoraFinal <= HoraFin))

			IF @existe = 0
			BEGIN
				SET @existe = (Select COUNT(IdProgramacion) from Citas where IdProgramacion = @IdProgramacion) +
							  (Select COUNT(IdProgramacion) from CitasProcedimientos where IdProgramacion = @IdProgramacion) +
							  (Select COUNT(IdProgramacion) from CitasTerapia where IdProgramacion = @IdProgramacion)

				IF @existe = 0
				BEGIN
					SET @SuccessNumber = 1
				END
				ELSE
				BEGIN
					SET @WarningMessage = 'La programación ya cuenta con pacientes programados. No es posible modificar la programación.'
					SET @WarningNumber = 1					
				END
			END
			ELSE
			BEGIN
				SET @WarningMessage = 'El servicio actual ya tiene una programación para la fecha ' + CONVERT(VARCHAR(10), @FechaProgramacion, 103)
				SET @WarningNumber = 1				
			END
		END
		ELSE
		BEGIN
			SET @WarningMessage = 'El médico ya tiene una programación para la fecha ' + CONVERT(VARCHAR(10), @FechaProgramacion, 103)
			SET @WarningNumber = 1			
		END

	END

	CLOSE curFechas
	DEALLOCATE curFechas

	----------------------------------------------------------
	-- INSERTAR PROGRAMACION
	----------------------------------------------------------

	IF @SuccessNumber = 1
	BEGIN

		DECLARE curInsert CURSOR FOR
		SELECT Fecha FROM @TablaFechas

		OPEN curInsert
		FETCH NEXT FROM curInsert INTO @FechaProgramacion

		WHILE @@FETCH_STATUS = 0
		BEGIN

			INSERT INTO ProgramacionMedica 
			(IdMedico, IdDepartamento, Fecha, HoraInicio, HoraFin, IdTipoProgramacion, Descripcion, IdTurno, IdEspecialidad, Color, IdServicio, IdTipoServicio, FechaReg, TiempoPromedioAtencion, HoraFinProgramacion,IdIpress)
			VALUES
			(@IdMedico, @IdDepartamento, @FechaProgramacion, @HoraInicio, @HoraFinal, @IdTipoProgramacion, @Descripcion, @IdTurno, @IdEspecialidad, NUll, @IdServicio, @IdTipoServicio, GETDATE(), @TiempoPromedioAtencion, @HoraFinProgramacion,@IdIpress)

			SET @IdProgramacionNueva = @@IDENTITY

			SET @Servicio = (SELECT TOP 1 ISNULL(Servicios.Nombre, '') FROM Servicios WHERE IdServicio = @IdServicio)
			SET @Medico = (SELECT TOP 1 ISNULL(Empleados.ApellidoPaterno, '') + ' ' + ISNULL(Empleados.ApellidoMaterno, '') + ' ' + ISNULL(Empleados.Nombres, '') FROM Medicos INNER JOIN Empleados ON Empleados.IdEmpleado = Medicos.IdEmpleado WHERE Medicos.IdMedico = @IdMedico)
			SET @ObsAuditoria = @Medico + ' - ' + @Servicio + ' (' + CONVERT(varchar(10), @FechaProgramacion, 103) + ')'

			exec AuditoriaAgregarV @IdUsuario, 'A', @IdProgramacionNueva, 'ProgramacionMedica', 401, 'WEB', @ObsAuditoria

			FETCH NEXT FROM curInsert INTO @FechaProgramacion
		END

		CLOSE curInsert
		DEALLOCATE curInsert

		SET @SuccessMessage = 'La programación se registro correctamente.'
		SET @SuccessNumber = 1
	END


	SELECT 
        0 AS ErrorNumber,
		'' AS ErrorMessage,
		@WarningNumber AS WarningNumber,        
		@WarningMessage AS WarningMessage,
		@SuccessNumber AS SuccessNumber,
		@SuccessMessage AS SuccessMessage;

END TRY
BEGIN CATCH

    SELECT 
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_MESSAGE() AS ErrorMessage,
		0 AS WarningNumber,        
		'' AS WarningMessage,
		0 AS SuccessNumber,
		'' AS SuccessMessage;

END CATCH;

END
GO



