
CREATE PROCEDURE [dbo].[web_modificarDiponibilidadProducto]
(
@IdAlmacen int = 0,
@IdProducto int = 0,
@IdAnaquel int = null
) AS
BEGIN

	UPDATE farmSaldo
	SET IdAnaquel = @IdAnaquel
	WHERE
		IdAlmacen = @IdAlmacen and 
		IdProducto = @IdProducto
END
GO





