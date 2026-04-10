using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaEntidades
{
    public class ListBarItemEnum
    {
        public enum ConsultaExterna
        {
            Paciente = 101,
            Citas_y_Admisión = 102,
            Registro_de_atenciones = 103,
            Admision = 104,
            Registro_de_Triaje = 1303,
            Recetas = 1366,
            vacio = 1367,
            MAR_Atención_Rapida = 1373,
            Cita_Terapias = 1386,
            Dashboard = 1388,
            Solicitud_de_Citas = 1395,
        }
        public enum Emergencia
        {
            Paciente = 201,
            Admision_de_emergencia = 202,
            Camas_de_observación = 203,
            Recetas = 1343,
            Triaje_de_Emergencia = 1374,
            Pre_Ingreso_Emergencia = 1375,
            Priorización_de_Emergencia = 1383,
            Dashboard = 1389,
            Dashboard_Atenciones = 1391,
            Dashboard_Hospitalizacion = 1392,
            DashBoard_Derivacion_Atencion = 1394,
        }
        public enum Hospitalización
        {
            Paciente = 301,
            Admisión_de_hospitalización = 302,
            Camas_de_hospitalización = 303,
            Alojados = 1330,
            Recetas = 1344,
            Visitas_medicas = 1390,
        }
        public enum ProgramacionGeneral
        {
            Programacion = 401,
            Turno = 402,
            Profesionales_de_la_Salud = 403,
        }
        public enum ArchivoClinico
        {
            Historia_Clínica = 501,
            Movimiento_de_historias = 502,
            Solicitud_de_historias = 503,
            Archiveros = 504,
            Movimiento_Formatos_HC = 1332
        }
        public enum FacturaciónGeneral
        {

        }
        public enum Caja
        {
            Gestion_de_caja = 702,
            Cajas = 705,
            Aprueba_Nota_de_Debito = 1378,
            Extracto_Bancario = 1379,
            Trasferencia_Bancaria = 1380,
            Nota_Contable = 1381,
            Devoluciones = 1364,
            Aprueba_Nota_de_Credito = 1365,

        }
        public enum Farmacia
        {
            Despacho_Donaciones = 1342,
            Farmacias = 1355,
            Nota_de_Ingreso_Farmacia = 1357,
            Nota_de_Salida_Farmacia = 1358,
            Historico_de_Precios = 1363,
            Inventario = 801,
            Recetas_para_Unidosis = 1348,
            Nota_de_Ingreso_Almacén = 1304,
            Nota_de_Salida_Almacén = 1305,
            Venta = 1307,
            Intervenciones_Sanitarias = 1308,
            Dependencias_Externas = 1310,
        }
        public enum Estadística
        {
            Constancias = 1325,
        }
        public enum General
        {
            Servicios = 1201,
            Diagnósticos = 1202,
            Procedimientos = 1203,
            Establecimientos_No_MINSA = 1204,
            Diagnosticos_PDF = 1205,
            Especialidades = 1206,
            Establecimientos = 1333
        }
        public enum Seguridad
        {
            Empleados = 1301,
            Roles = 1302
        }
        public enum Facturación
        {
            Consumo_en_el_Servicio = 601,
            Laboratorio = 603,
            Imagenología = 604,
            Anatomía_Patológica = 605,
            Farmacia = 606,
            Sala_de_Operaciones = 607,
            Estado_de_Cuenta = 613,
            Reembolsos = 1331,
            Pacientes_Externos_con_Cuenta_Seguro = 1339,
            Pacientes_Externos_con_Cuenta_Particular = 1340,
            Apertura_de_Credito = 1382,
            Evaluacion_Riesgo_Social = 1387,
        }
        public enum FactConfig
        {
            Centro_de_costos = 609,
            Catalogo_de_servicios = 610,
            Producto_Plan = 611,
            Catalogo_de_Partidas = 612,
            Catalogo_de_bienes_e_insumos = 803,
            Fuente_Financiamiento_IAFA = 1311,
            Tipos_de_Cargo = 1334,
            Tipos_de_Condición_de_trabajo = 1335,
            Tipos_de_Empleado = 1336,
            Tipo_Tarifa = 1337,
            Tipos_de_Establecimientos = 1338,
            Paquetes = 1341,
            Configuración_Resultados_de_Laboratorio = 1356,
            Integración_con_otros_sistemas = 1362,
            Configuración_Resultados_de_Imagenologia = 1384,
        }
        public enum Laboratorio
        {
            Pat_Clínica = 1312,
            Ingreso_Insumos = 1313,
            Salida_Insumos = 1314,
            Anat_Patológica = 1321,
            Banco_de_Sangre = 1322,
        }
        public enum Imagenología
        {
            Ingresos = 1315,
            Salidas = 1316,
            Ecografía_General = 1317,
            Rayos_X = 1318,
            Tomografía = 1319,
            Ecografía_Obstétrica = 1320,
            Tipo_Modalidad_Sala = 1359,
            Salas = 1360,
            Duración_de_Procedimientos_por_servicio = 1361,
            CitaProcedimientos = 1385,
        }
        public enum SIS
        {
            Formato_FUA = 1345,
        }
        public enum HIS
        {
            Registro_HIS_de_la_MicroRed = 1346,
            Programación_Medica_de_la_MicroRed = 1347,
            Establecimientos_de_la_MicroRed = 1349,
            Calidad = 1353,
            Padrón_Nominal = 1354,
        }
        public enum Seguimiento
        {
            HC_Electrónica = 1350,
            Programas = 1351,
            Adscripción = 1352,
        }
        public enum CentroQuirurgico
        {
            Orden_PreOperatoria = 1368,
            Admisión_de_Orden_Operatoria = 1369,
            Programación_de_Sala = 1370,
            Módulo_Quirúrgico = 1371,
            Sala_de_Operaciones = 1372,
            Dirección_Medica = 1376,
            Asignación_Anestesiólogos = 1377,
        }
        public enum CallCenter
        {
        }

    }
}
