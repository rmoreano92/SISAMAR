USE [SIGH]
GO
/*---------------------------------------------------------------
SP      : usp_CambiarEstadoCitaPagado
Modulo  : CE > Admisión > Cambiar estado a pagado
---------------------------------------------------------------
| Usuario | Fecha       | Cambio
---------------------------------------------------------------
| MGAMERO | 29/04/2026  | Se agrega actualización de estado en FacturacionCuentasAtencion usando el IdCuentaAtencion relacionado a la cita.
---------------------------------------------------------------
*/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[usp_CambiarEstadoCitaPagado]
(
    @IdCita INT,
    @resultado BIT OUTPUT,
    @mensaje VARCHAR(500) OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    SET @resultado = 0;
    SET @mensaje = '';

    DECLARE @IdCuentaAtencion INT = NULL;

    BEGIN TRY

        IF NOT EXISTS (SELECT 1 FROM Citas WHERE IdCita = @IdCita)
        BEGIN
            SET @mensaje = 'No se encontró la cita.';
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM Citas WHERE IdCita = @IdCita AND IdEstadoCita = 4)
        BEGIN
            SET @mensaje = 'La cita ya se encuentra en estado Pagado.';
            RETURN;
        END

        BEGIN TRANSACTION;

            UPDATE Citas
            SET IdEstadoCita = 4
            WHERE IdCita = @IdCita;

            /************************************************************
            INICIO CAMBIO - MGAMERO - 29/04/2026
            ************************************************************/

            SELECT TOP 1
                @IdCuentaAtencion = A.IdCuentaAtencion
            FROM Citas C
            INNER JOIN Atenciones A ON C.IdAtencion = A.IdAtencion
            WHERE C.IdCita = @IdCita
              AND A.IdCuentaAtencion IS NOT NULL;

            IF ISNULL(@IdCuentaAtencion, 0) > 0
            BEGIN
                UPDATE FacturacionCuentasAtencion
                SET IdEstado = 4
                WHERE IdCuentaAtencion = @IdCuentaAtencion;
            END

            /************************************************************
            FIN CAMBIO - MGAMERO - 29/04/2026
            ************************************************************/

        COMMIT TRANSACTION;

        SET @resultado = 1;
        SET @mensaje = 'La cita fue cambiada a estado Pagado correctamente.';

    END TRY
    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SET @resultado = 0;
        SET @mensaje = ERROR_MESSAGE();

    END CATCH
END
GO