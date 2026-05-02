ALTER PROCEDURE [dbo].[web_DepartamentosHospitalSeleccionarTodos]
(
@idIpress int = 0,
@tipoListado int = 1
)
AS
begin
	
	if @tipoListado = 1 
	begin 
		  select 0 as IdDepartamento, 0 as Valor, 'Todos' AS Descripcion, 'Todos' AS DescripcionLarga
		union all 
		select IdDepartamento, IdDepartamento Valor, Nombre Descripcion, convert(varchar(5), IdDepartamento) + ' = ' + Nombre as DescripcionLarga	
		from DepartamentosHospital
		WHERE idIpress = @idIpress or @idIpress = 0	
	end;
	else
	begin
		select IdDepartamento, IdDepartamento Valor, Nombre Descripcion, convert(varchar(5), IdDepartamento) + ' = ' + Nombre as DescripcionLarga	
		from DepartamentosHospital
		WHERE idIpress = @idIpress or @idIpress = 0	
	end; 
	
END;
GO





















