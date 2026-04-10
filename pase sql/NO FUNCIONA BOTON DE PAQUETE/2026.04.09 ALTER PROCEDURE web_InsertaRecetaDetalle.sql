ALTER PROCEDURE [dbo].[web_InsertaRecetaDetalle] 

@detalleReceta  xml,
@idReceta int
as
begin
	
	declare @estado int
	declare @estadoItem int 
	declare @puntoCarga int
	
	set @estado = (select top 1 idEstado from RecetaCabecera where idReceta=@idReceta)
	set @puntoCarga = (select top 1 IdPuntoCarga from RecetaCabecera where idReceta=@idReceta)

	if @puntoCarga<>5 
	begin
		set @estadoItem=1
	end 
	else
	begin
		set @estadoItem = null
	end 
	
	if @estado=1
	begin
		DECLARE @hdoc int
		EXEC sp_xml_preparedocument @hdoc OUTPUT,@detalleReceta
	
		delete  RecetaDetalle where idReceta =@idReceta

		insert RecetaDetalle
		(idReceta, idItem, CantidadPedida, Precio, Total, SaldoEnRegistroReceta, SaldoEnDespachoReceta, CantidadDespachada,
		idDosisRecetada, idEstadoDetalle, MotivoAnulacionMedico, observaciones, IdViaAdministracion, IdFrecuencia,dx)
		select @idReceta,
		idItem,cantidadPedida,precio,total,saldoEnRegistroReceta,saldoEnDespachoReceta,cantidadDespachada,
		idDosisRecetada,@estadoItem as idEstadoDetalle,null as motivoanulacionmedico,observaciones as observaciones,idViaAdministracion, IdFrecuencia,dx
		FROM OPENXML (@hdoc, '/ArrayOfRecetaDetalle/RecetaDetalle',2)
		--aca van lo que te llega el xml tal cual los nombres del campo y el tipo que es varchar o int etc
		-- pon punto de interrupcion para obtener el xml
		WITH (
		idItem int,
		cantidadPedida int,
		precio decimal(18,2),
		total decimal(18,2),
		saldoEnRegistroReceta int,
		saldoEnDespachoReceta int,
		cantidadDespachada int,
		idDosisRecetada int,
		idEstadoDetalle int,
		idViaAdministracion int,
		IdFrecuencia int,
		observaciones varchar(max),
		dx nvarchar(20)
		)

		if @puntoCarga<>5 -- corrige receta precios 
		begin
			exec regularizaRecetaServicios @idReceta
		end 

		if @puntoCarga=5 -- corrige receta precios 
		begin
			DECLARE @idTipoFinan INT = (SELECT IdFormaPago FROM RecetaCabecera rec INNER JOIN Atenciones a ON a.IdCuentaAtencion = rec.idCuentaAtencion WHERE rec.idReceta = @idReceta)
			/* Comentado porque FactCatalogoBienesInsumosHosp no contiene todos los precios de idproductos*/
			--UPDATE RecetaDetalle SET
			--Precio = (select PrecioUnitario from FactCatalogoBienesInsumosHosp where idProducto=idItem and idTipoFinanciamiento=@idTipoFinan),
			--Total = (select PrecioUnitario*CantidadPedida from FactCatalogoBienesInsumosHosp where idProducto=idItem and idTipoFinanciamiento=@idTipoFinan)
			--FROM RecetaDetalle WHERE idReceta = @idReceta

		end 
	end
end