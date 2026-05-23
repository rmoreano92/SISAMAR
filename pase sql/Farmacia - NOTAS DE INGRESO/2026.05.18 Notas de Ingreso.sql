
  CREATE TABLE TiposEstadoReserva
(
    idEstadoReserva INT PRIMARY KEY,
    Descripcion VARCHAR(100) NOT NULL
);

INSERT INTO TiposEstadoReserva (idEstadoReserva, Descripcion)
VALUES
(0, 'Eliminado'),
(1, 'Generado'),
(2, 'Conclusión Parcial'),
(3, 'Concluído');


ALTER TABLE ReservaNotaSalida
ADD FechaRegistro DATETIME NULL;


/*CREAR STORED PROCEDURE PARA VISUALIZAR LAS RESERVAS*/

USE SIGH
GO
CREATE OR ALTER PROCEDURE usp_ListarReservaNotaSalida
(
    @idEstadoReserva VARCHAR(20) = '',
    @idAlmacenDestino VARCHAR(20) = ''
)
AS
BEGIN
    SET NOCOUNT ON;
/****************************************************************************************
FECHA       | USUARIO  | DESCRIPCION
------------|----------|---------------------------------------------------------------
2026-05-18  | MGAMERO  | Creación del procedimiento usp_ListarReservaNotaSalida para listar reservas de nota de salida, permitiendo filtrar por estado de reserva y almacén destino.
****************************************************************************************/
    SELECT 
           RNS.idReserva
          ,RNS.MovNumero
          ,RNS.MovTipo
          ,RNS.idEstadoMovimiento
          ,RNS.idTipoLocales
          ,RNS.idTipoSuministro
          ,RNS.documentoIdTipo
          ,FTD.Nombre AS TipoDocumentos
          ,RNS.idAlmacenOrigen
          ,RNS.idAlmacenDestino
          ,fOrigen.descripcion AS AlmacenOrigen
          ,ISNULL('(' + fOrigen.codigoSISMED + ') ', '') + fOrigen.descripcion AS AlmacenOrigenVentas
          ,ISNULL('(' + fDestino.codigoSISMED + ') ', '') + fDestino.descripcion AS AlmacenDestino
          ,RNS.IdTipoConceptoFarmacia
          ,FTC.Concepto AS TipoConceptoFarmacia
          ,RNS.Observaciones
          ,RNS.movimientoDetalle
          ,RNS.idUsuario
          ,RNS.IdListBarItem
          ,RNS.idAreaTerritorial
          ,RNS.idUnidadDependencia
          ,RNS.idTipoCompartimientoSalida
          ,RNS.idTipoCompartimientoOrigen
          ,RNS.idCompartimiento
          ,RNS.docReferencia
          ,RNS.idEstadoReserva
          ,RNS.fechaCreacion as FechaRegistro
          ,TER.Descripcion AS EstadoReserva
          ,FMV.IdServicioPaciente
          ,S.Nombre AS ServicioPaciente
          ,FMV.idPaciente
          ,FMV.idCuentaAtencion
          ,FMV.idDiagnostico
    FROM ReservaNotaSalida RNS
        LEFT JOIN farmAlmacen fOrigen ON RNS.idAlmacenOrigen = fOrigen.idAlmacen
        LEFT JOIN farmAlmacen fDestino ON RNS.idAlmacenDestino = fDestino.idAlmacen
        INNER JOIN farmTipoConceptos FTC ON RNS.IdTipoConceptoFarmacia = FTC.idTipoConcepto
        INNER JOIN farmTipoDocumentos FTD ON RNS.DocumentoIdtipo = FTD.idTipoDocumento
        LEFT JOIN farmMovimientoVentas FMV ON RNS.MovNumero = FMV.movNumero AND RNS.MovTipo = FMV.MovTipo
        LEFT JOIN Servicios S ON FMV.IdServicioPaciente = S.IdServicio
        LEFT JOIN TiposEstadoReserva TER ON TER.idEstadoReserva = RNS.idEstadoReserva
    WHERE 
        (ISNULL(@idEstadoReserva, '') = '' OR RNS.idEstadoReserva = TRY_CAST(@idEstadoReserva AS INT)) AND
        (ISNULL(@idAlmacenDestino, '') = '' OR RNS.idAlmacenDestino = TRY_CAST(@idAlmacenDestino AS INT))
    ORDER BY 
        RNS.FechaRegistro DESC,
        RNS.idReserva DESC;
END;
GO

/* Actualizar Estado */
USE SIGH
GO
CREATE OR ALTER PROCEDURE usp_ActualizarEstadoReservaNotaSalida
(
    @idReserva INT,
    @idEstadoReserva INT,
    @MovNumero VARCHAR(20) = ''
)
AS
BEGIN
    SET NOCOUNT ON;
    /****************************************************************************************
    FECHA       | USUARIO  | DESCRIPCION
    ------------|----------|---------------------------------------------------------------
    2026-05-18  | MGAMERO  | Creación del procedimiento para actualizar el estado de una reserva de nota de salida.
    2026-05-19  | MGAMERO  | Se agrega actualización del número de movimiento generado al confirmar la guía.
    ****************************************************************************************/
    UPDATE ReservaNotaSalida
    SET 
        idEstadoReserva = @idEstadoReserva,
        MovNumero = CASE 
                        WHEN ISNULL(@MovNumero, '') = '' THEN MovNumero
                        ELSE @MovNumero
                    END
    WHERE idReserva = @idReserva;
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

/* Buscar Nota de Ingreso desde una Nota de Salida */
USE SIGH
GO
CREATE OR ALTER PROCEDURE usp_BuscarMovimientoIngresoRelacionado
(
    @MovNumero VARCHAR(20),
    @MovTipo CHAR(1)
)
AS
BEGIN
    SET NOCOUNT ON;
    /****************************************************************************************
    FECHA       | USUARIO  | DESCRIPCION
    ------------|----------|---------------------------------------------------------------
    2026-05-20  | MGAMERO  | Creación del procedimiento para buscar el último movimiento de
                |          | ingreso relacionado a un movimiento de salida, comparando almacén
                |          | origen, almacén destino, concepto, tipo documento, número documento,
                |          | total e usuario.
    ****************************************************************************************/
    SELECT TOP 1
           FMI.MovNumero
          ,FMI.MovTipo
          ,FMI.idAlmacenOrigen
          ,FMI.idAlmacenDestino
          ,FMI.idTipoConcepto
          ,FMI.DocumentoIdtipo
          ,FMI.DocumentoNumero
          ,FMI.Observaciones
          ,FMI.Total
          ,FMI.idMotivoAnulacion
          ,FMI.fechaAnulacion
          ,FMI.idUsuarioAnulacion
          ,FMI.fechaCreacion
          ,FMI.idUsuario
          ,FMI.idEstadoMovimiento
          ,FMI.idEspecialidadDestino
          ,FMI.IdMotivoDevolucion
          ,FMI.IdOrigenDevolucion
          ,FMI.indValidado
          ,FMI.idEmpleadoValida
    FROM farmMovimiento FMS
        INNER JOIN farmMovimiento FMI
            ON FMI.MovTipo = 'E'
           AND FMI.idAlmacenOrigen = FMS.idAlmacenOrigen
           AND FMI.idAlmacenDestino = FMS.idAlmacenDestino
           AND FMI.idTipoConcepto = FMS.idTipoConcepto
           AND FMI.DocumentoIdtipo = FMS.DocumentoIdtipo
           AND FMI.DocumentoNumero = FMS.DocumentoNumero
           AND FMI.Total = FMS.Total
           AND FMI.idUsuario = FMS.idUsuario
    WHERE 
        FMS.MovNumero = @MovNumero
        AND FMS.MovTipo = @MovTipo
    ORDER BY 
        FMI.MovNumero DESC;
END;
GO

USE SIGH
GO
CREATE TABLE ReservaNotaSalidaDesestimacionTipo
(
    idTipoDesestimacion INT IDENTITY(1,1) PRIMARY KEY,
    Descripcion VARCHAR(150) NOT NULL,
    Estado BIT NOT NULL DEFAULT 1
);
GO

INSERT INTO ReservaNotaSalidaDesestimacionTipo (Descripcion)
VALUES 
('Error en la guía'),
('Destino incorrecto'),
('Productos no corresponden'),
('Stock no conforme'),
('Solicitud anulada por el área usuaria'),
('Otro motivo');
GO

ALTER TABLE ReservaNotaSalida
ADD 
    idTipoDesestimacion INT NULL,
    MotivoDesestimacion VARCHAR(max) NULL,
    idUsuarioDesestimacion INT NULL,
    FechaDesestimacion DATETIME NULL;;
GO


USE SIGH
GO
CREATE OR ALTER PROCEDURE usp_ListarReservaNotaSalidaDesestimacionTipo
AS
BEGIN
    SET NOCOUNT ON;

    /****************************************************************************************
    FECHA       | USUARIO  | DESCRIPCION
    ------------|----------|---------------------------------------------------------------
    2026-05-20  | MGAMERO  | Creación del procedimiento para listar tipos de desestimación
                |          | de reserva de nota de salida.
    ****************************************************************************************/

    SELECT 
        idTipoDesestimacion,
        Descripcion
    FROM ReservaNotaSalidaDesestimacionTipo
    WHERE Estado = 1
    ORDER BY Descripcion;
END;
GO


USE SIGH
GO
CREATE OR ALTER PROCEDURE usp_ActualizarEstadoReservaNotaSalida
(
    @idReserva INT,
    @idEstadoReserva INT,
    @MovNumero VARCHAR(20) = '',
    @idTipoDesestimacion INT = NULL,
    @MotivoDesestimacion VARCHAR(max) = NULL,
    @idUsuarioDesestimacion INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    /****************************************************************************************
    FECHA       | USUARIO  | DESCRIPCION
    ------------|----------|---------------------------------------------------------------
    2026-05-18  | MGAMERO  | Creación del procedimiento para actualizar el estado de una reserva de nota de salida.
    2026-05-19  | MGAMERO  | Se agrega actualización del número de movimiento generado al confirmar la guía.
    2026-05-20  | MGAMERO  | Se agregan datos de desestimación para rechazo de reserva.
    ****************************************************************************************/

    UPDATE ReservaNotaSalida
    SET 
        idEstadoReserva = @idEstadoReserva,
        MovNumero = CASE 
                        WHEN ISNULL(@MovNumero, '') = '' THEN MovNumero
                        ELSE @MovNumero
                    END,
        idTipoDesestimacion = CASE 
                                  WHEN @idEstadoReserva = 1 THEN @idTipoDesestimacion 
                                  ELSE idTipoDesestimacion 
                              END,
        MotivoDesestimacion = CASE 
                                  WHEN @idEstadoReserva = 1 THEN @MotivoDesestimacion 
                                  ELSE MotivoDesestimacion 
                              END,
        idUsuarioDesestimacion = CASE 
                                     WHEN @idEstadoReserva = 1 THEN @idUsuarioDesestimacion 
                                     ELSE idUsuarioDesestimacion 
                                 END,
        FechaDesestimacion = CASE 
                                 WHEN @idEstadoReserva = 1 THEN GETDATE() 
                                 ELSE FechaDesestimacion 
                             END
    WHERE idReserva = @idReserva;
    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO





