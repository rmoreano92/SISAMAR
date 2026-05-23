ALTER PROCEDURE [dbo].[web_rptRecetasAtendidas] 
(
@IdAlmacen int = 0
)
as
begin
	
	Select 
		mv.MovNumero,
		m.documentoNumero,
		CONVERT(VARCHAR(10), mv.FechaHoraPrescribe, 103) AS Fecha,
		al.descripcion Farmacia,
		e.ApellidoPaterno + ' ' + e.ApellidoMaterno + ' ' + ISNULL(e.Nombres,'') as Usuario,
		'ACTIVO' estado,
		tf.descripcion productoPlan,
		re.idCuentaAtencion,
		p.nroHistoriaClinica,
		p.ApellidoPaterno + ' ' + p.ApellidoMaterno + ' ' + ISNULL(p.PrimerNombre,'') + ' ' + ISNULL(p.SegundoNombre,'') as Paciente,
		(select sum(cantidad*precio) from farmMovimientoDetalle where MovNumero = mv.MovNumero and movTipo = 'S' group by MovNumero) total
	from farmMovimientoVentas mv
	inner join RecetaCabecera re on re.IdReceta = mv.idReceta
	inner join TiposFinanciamiento tf on tf.idTipoFinanciamiento = mv.IdTipoFinanciamiento
	inner join farmMovimiento m on m.MovNumero = mv.MovNumero and m.movTipo = 'S'
	inner join farmAlmacen al on al.idAlmacen = m.idAlmacenOrigen
	inner join Pacientes p on p.idPaciente = mv.idPaciente
	inner join Empleados e on e.idEmpleado = m.idUsuario
	where al.idAlmacen = @IdAlmacen 

END
Go
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
 