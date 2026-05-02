-- =====================================================
-- PRUEBAS - Firma por Lote (feature/firma-por-lotes)
-- =====================================================


-- Atenciones de un médico por DNI
Select A.*
from Atenciones A
inner join medicos M on M.idMedico = A.idmedicoingreso
inner join empleados E on E.idEmpleado = M.IdEmpleado
inner join Servicios S on S.IdServicio = A.IdServicioIngreso
where E.DNI = '76589726'
order by 1 desc


-- Catálogo de estados de atención
SELECT * FROM EstadosAtencion;


-- Firmas digitales por cuenta de atención
SELECT TOP 200 * FROM FirmasDigitales WHERE idCuentaAtencion = 69272
SELECT TOP 200 * FROM FirmasDigitales WHERE idCuentaAtencion = 69273


-- Autorizados de firma por IdFirmaDigital
SELECT * FROM FirmaDigitalAutorizados WHERE IdFirmaDigital = 638
SELECT * FROM FirmaDigitalAutorizados WHERE IdFirmaDigital = 651


-- =====================================================
-- RESET: Volver un documento a estado pendiente de firma
--   statusFirma  = 0  → pendiente
--   processFirma = 1  → en proceso / disponible para firmar
-- =====================================================
UPDATE FirmasDigitales
SET statusFirma  = 0,
    processFirma = 1
WHERE id = 638;
