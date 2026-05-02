using CapaEntidades;
using DocumentFormat.OpenXml.Office.Word;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.CapaEntidades;

namespace CapaDatos
{
    public class DalCitasAdmision
    {
        // JDELGADO010
        public Task<DataSet> listarDepartamentosHospital()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "DepartamentosHospitalSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> listarDepartamentoHospitalario(string lcFiltro, int idIpress = 0) //MGAMERO
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        //string sql = "usp_DepartamentoHospitalario";
                        string sql = "web_DepartamentosHospitalSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro; //Nombre
                        da.SelectCommand.Parameters.Add("@IdIpress", SqlDbType.Int).Value = idIpress;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> listarEspecialidadPorDepartamento(string lcFiltro) //MGAMERO
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "usp_EspecialidadPorDepartamento";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarMedicosPorFiltroConEspecialidad(string lcFiltro) //MGAMERO
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "usp_MedicosPorFiltroConEspecialidad";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> BuscarProgramacionCitasWeb(string lcFiltro) //MGAMERO
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "usp_ProgramacionMedicaSeleccionarPorFechas";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro ?? "";

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> BuscarCitasWebCuposBloqueados(string lcFiltro) //MGAMERO
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "usp_CitasWebCuposSeleccionarPorFechas";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro ?? "";

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> BuscarCitasProgramadasPorServicioYFecha(int idServicio, string fechaYmd) //MGAMERO
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "dbo.usp_CitasSeleccionarPorServicioYfecha";

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.DateTime).Value =
                            DateTime.ParseExact(fechaYmd, "yyyyMMdd", System.Globalization.CultureInfo.InvariantCulture);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<bool> GuardarDetalleSistemaCitasWeb(List<SistemaCitasWebDetalleGuardarRequest> payload) //MGAMERO
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();

                    using (SqlTransaction tran = conn.BeginTransaction())
                    {
                        try
                        {
                            foreach (var item in payload)
                            {
                                using (SqlCommand cmd = new SqlCommand("dbo.usp_SistemaCitasWebGuardarDetalleFila", conn, tran))
                                {
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.Add("@Fecha", SqlDbType.Char, 8).Value = (object)item.Fecha ?? DBNull.Value;
                                    cmd.Parameters.Add("@IdServicio", SqlDbType.Int).Value = item.IdServicio;
                                    cmd.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = item.IdProgramacion <= 0 ? (object)DBNull.Value : item.IdProgramacion;
                                    cmd.Parameters.Add("@IdWeb", SqlDbType.Int).Value = item.IdWeb <= 0 ? (object)DBNull.Value : item.IdWeb;
                                    cmd.Parameters.Add("@IdCitaBloqueada", SqlDbType.Int).Value = item.IdCitaBloqueada <= 0 ? (object)DBNull.Value : item.IdCitaBloqueada;
                                    cmd.Parameters.Add("@IdMedico", SqlDbType.Int).Value = item.IdMedico;
                                    cmd.Parameters.Add("@HoraInicio", SqlDbType.Char, 5).Value = (object)item.HoraInicio ?? DBNull.Value;
                                    cmd.Parameters.Add("@HoraFinal", SqlDbType.Char, 5).Value = (object)item.HoraFinal ?? DBNull.Value;
                                    cmd.Parameters.Add("@IdEstadoCitaWeb", SqlDbType.Int).Value = item.IdEstadoCitaWeb;
                                    cmd.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = item.IdUsuario;

                                    cmd.ExecuteNonQuery();
                                }
                            }

                            tran.Commit();
                            return true;
                        }
                        catch
                        {
                            tran.Rollback();
                            throw;
                        }
                    }
                }
            });
        }
        /*
        public Task<DataSet> listarMedicosPorFiltroConEspecialidad()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "MedicosPorFiltroConEspecialidad";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = " where EsActivo = 1  order by Nombre";

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        */
        public Task<DataSet> listarMedicosFiltrarPorProgramacion(string lcFiltro,int idIpress = 0)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_MedicosFiltrarPorProgramacion";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro;
                        da.SelectCommand.Parameters.Add("@idIpress", SqlDbType.Int).Value = idIpress;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarProgramacionMedicaPorIdMedicoMesAnio(int idMedico, int mes, int anio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ProgramacionMedicaPorIdMedicoMesAnio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lIdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@iMes", SqlDbType.Int).Value = mes;
                        da.SelectCommand.Parameters.Add("@iAnio", SqlDbType.Int).Value = anio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> obtenerProgramacionMedicaPorIdProgramacionIdMedico(int idProgramacion, int idMedico)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ProgramacionMedicaPorIdProgramacionIdMedico";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idProgramacion", SqlDbType.Int).Value = idProgramacion;
                        da.SelectCommand.Parameters.Add("@idMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarCitasSeleccionarPorMedicoYFecha(int idMedico, DateTime fecha)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CitasSeleccionarPorMedicoYFecha";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.DateTime).Value = fecha;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public Task<DataSet> listarCitasSeleeccionarPacientePorMedicoFechaHoras(int idMedico, DateTime fecha, string horaInicio, string horaFin)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CitasSeleeccionarPacientePorMedicoFechaHoras";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.DateTime).Value = fecha;
                        da.SelectCommand.Parameters.Add("@HoraInicial", SqlDbType.VarChar).Value = horaInicio;
                        da.SelectCommand.Parameters.Add("@HoraFinal", SqlDbType.VarChar).Value = horaFin;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> obtenerEspecialidadesSeleccionarPorMedico(int idMedico)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EspecialidadesSeleccionarPorMedico";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> obtenerTurnosSeleccionarPorId(int idTurno)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TurnosSeleccionarPorId";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = idTurno;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarCupos(int dProgrmacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "listaCupos_CitasWeb";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idProgrmacion", SqlDbType.Int).Value = dProgrmacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaCuposCitasTerapia(int dProgrmacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ListaCuposCitasTerapia";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idProgrmacion", SqlDbType.Int).Value = dProgrmacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarTipoFormatoSIS()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH_SIS..TipoFormatoSIS";
                        da.SelectCommand = new SqlCommand(sql, conn);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ObtenerMedicosSeleccionarPorIdMedicoPlanilla(int idMedico)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "MedicosSeleccionarPorIdMedicoPlanilla";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> obtenerEspecialidadCEseleccionarIdServicio(int idServicio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "EspecialidadCEseleccionarIdServicio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarServiciosSeleccionarConsultoriosPorEspecialidad(int idEspecialidad)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "ServiciosSeleccionarConsultoriosPorEspecialidad";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarFuentesFinanciamientoSegunFiltro(string lcFiltro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FuentesFinanciamientoSegunFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarTiposReferenciaSeleccionarTodos()
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposReferenciaSeleccionarTodos";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarEstablecimientosReferencia(string lcFiltro, int tipoReferencia)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "";

                        if (tipoReferencia == 2)
                        {
                            sql = "EstablecimientosNoMinsaFiltrar";
                        }
                        else
                        {
                            sql = "EstablecimientosFiltrar";
                        }

                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListarEstablecimientosReferenciaV2(string Codigo, string Nombre, int IdDepartamento, int IdProvincia, int IdDistrito)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        da.SelectCommand = new SqlCommand("Web_EstablecimientosFiltrar", conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@Codigo", Codigo);
                        da.SelectCommand.Parameters.AddWithValue("@Nombre", Nombre);
                        da.SelectCommand.Parameters.AddWithValue("@IdDepartamento", IdDepartamento);
                        da.SelectCommand.Parameters.AddWithValue("@IdProvincia", IdProvincia);
                        da.SelectCommand.Parameters.AddWithValue("@IdDistrito", IdDistrito);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarFactCatalogoServiciosSeleccionarTipoConsulta(int idEspecialidad)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "FactCatalogoServiciosSeleccionarTipoConsulta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarTiposFinanciamientosTarifaSeleccionarPorPlan(int idFuenteFinanciamiento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "TiposFinanciamientosTarifaSeleccionarPorPlan";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdFuenteFinanciamiento", SqlDbType.Int).Value = idFuenteFinanciamiento;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> listarSisServiciosSeleccionarPorFiltro(string lcFiltro)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH_SIS..SisServiciosSeleccionarPorFiltro";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lcFiltro", SqlDbType.VarChar).Value = lcFiltro;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<int> CitasAgregar(Citas objCitas, int IdUsuarioAuditoria, int IdPaciente) // JDELGADO001.2
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CitasAgregar";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@HoraSolicitud", objCitas.HoraSolicitud ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@FechaSolicitud", objCitas.FechaSolicitud);
                        cmd.Parameters.AddWithValue("@IdProducto", objCitas.IdProducto);
                        cmd.Parameters.AddWithValue("@IdProgramacion", objCitas.IdProgramacion);
                        cmd.Parameters.AddWithValue("@IdServicio", objCitas.IdServicio);
                        cmd.Parameters.AddWithValue("@HoraFin", objCitas.HoraFin ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@HoraInicio", objCitas.HoraInicio ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@IdCita", objCitas.IdCita ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Fecha", objCitas.Fecha);
                        cmd.Parameters.AddWithValue("@IdEstadoCita", 1); // VER LUEGO
                        cmd.Parameters.AddWithValue("@IdMedico", objCitas.IdMedico);
                        cmd.Parameters.AddWithValue("@IdEspecialidad", objCitas.IdEspecialidad);
                        cmd.Parameters.AddWithValue("@IdAtencion", objCitas.IdAtencion);
                        cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                        cmd.Parameters.AddWithValue("@EsCitaAdicional", objCitas.EsCitaAdicional);
                        cmd.Parameters.AddWithValue("@TipoCita", objCitas.TipoCita);
                        cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }

        public Task<int> CitasModificar(Citas objCitas, int IdUsuarioAuditoria, int IdPaciente) // JDELGADO001.2
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_citasModificar";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@HoraSolicitud", objCitas.HoraSolicitud ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@FechaSolicitud", objCitas.FechaSolicitud);
                        cmd.Parameters.AddWithValue("@IdProducto", objCitas.IdProducto);
                        cmd.Parameters.AddWithValue("@IdProgramacion", objCitas.IdProgramacion);
                        cmd.Parameters.AddWithValue("@IdServicio", objCitas.IdServicio);
                        cmd.Parameters.AddWithValue("@HoraFin", objCitas.HoraFin ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@HoraInicio", objCitas.HoraInicio ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@IdCita", objCitas.IdCita ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@Fecha", objCitas.Fecha);
                        cmd.Parameters.AddWithValue("@IdEstadoCita", 1); // VER LUEGO
                        cmd.Parameters.AddWithValue("@IdMedico", objCitas.IdMedico);
                        cmd.Parameters.AddWithValue("@IdEspecialidad", objCitas.IdEspecialidad);
                        cmd.Parameters.AddWithValue("@IdAtencion", objCitas.IdAtencion);
                        cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                        cmd.Parameters.AddWithValue("@EsCitaAdicional", 0);
                        cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }

        public Task<int> CitasBloqueadasAgregar(
            string horaBloqueo, DateTime fechaBloqueo, int idMedico, string horaInicio, string horaFin,
            DateTime fecha, int idUsuario) // JDELGADO001.2
        {

            int nRpta = 0;

            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CitasBloqueadasAgregar";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@IdCitaBloqueada", SqlDbType.Int).Direction = ParameterDirection.Output;

                        cmd.Parameters.AddWithValue("@HoraBloqueo", horaBloqueo ?? Convert.DBNull);
                        cmd.Parameters.AddWithValue("@FechaBloqueo", fechaBloqueo);
                        cmd.Parameters.AddWithValue("@IdMedico", idMedico);
                        cmd.Parameters.AddWithValue("@HoraFin", horaFin);
                        cmd.Parameters.AddWithValue("@HoraInicio", horaInicio);
                        cmd.Parameters.AddWithValue("@Fecha", fecha);
                        cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                        cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);

                        cmd.ExecuteNonQuery();
                        nRpta = int.Parse(cmd.Parameters["@IdCitaBloqueada"].Value.ToString());

                        return nRpta;
                    }
                }
            });
        }

        public Task<int> CitasBloqueadasEliminar(int idCitaBloqueada, int idUsuario) // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CitasBloqueadasEliminar";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdCitaBloqueada", idCitaBloqueada);
                        cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);

                        cmd.ExecuteNonQuery();

                        return 1;
                    }
                }
            });
        }

        public Task<int> CitasEliminar(int idCita, int idUsuarioAuditoria) // JDELGADO001.2
        {
            Conexion cx = new Conexion();

            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "CitasEliminar";
                        SqlCommand cmd = new SqlCommand(sql, conn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdCita", idCita);
                        cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuarioAuditoria);

                        cmd.ExecuteNonQuery();

                        return 1;
                    }
                }
            });
        }

        public Task<DataSet> ListaCitaByIdCita(int idCita) // JDELGADO010
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaCitaByIdCita";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCita", SqlDbType.VarChar).Value = idCita;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaCitaTerapiaByIdCita(int idCita) // JDELGADO010
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaCitaTerapiaByIdCita";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idCita", SqlDbType.VarChar).Value = idCita;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaPacienteTieneCitaByIdPacienteIdServicio(int idPaciente, int idServicio, string fechaCita) // JDELGADO010
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaPacienteTieneCitaByIdPacienteIdServicio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idPaciente", SqlDbType.Int).Value = idPaciente;
                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@fechaCita", SqlDbType.VarChar).Value = fechaCita;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> CitasBloqueadasByFecha(DateTime fecha) // JDELGADO011
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_CitasBloqueadasByFecha";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@fecha", SqlDbType.Date).Value = fecha;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ListaRecetasInterconsulta(int nroOrden, int idEspecialidad) // JDELGADO011
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListaRecetasInterconsulta";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idReceta", SqlDbType.Int).Value = nroOrden;
                        da.SelectCommand.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidad;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SeleccionarServicioById(int idServicio) // JDELGADO011
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_SeleccionarServicioById";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> SisFiltraPacientesAfiliados(string paterno, string materno, string pnombre, string onombres, string genero, string fnacimiento)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "SIGH_EXTERNA..Web_SisFiltraPacientesAfiliados";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.AddWithValue("@paterno", paterno);
                        da.SelectCommand.Parameters.AddWithValue("@materno", materno);
                        da.SelectCommand.Parameters.AddWithValue("@pnombre", pnombre);
                        da.SelectCommand.Parameters.AddWithValue("@onombres", onombres);
                        da.SelectCommand.Parameters.AddWithValue("@genero", genero);
                        da.SelectCommand.Parameters.AddWithValue("@fnacimiento", fnacimiento);

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public Task<DataSet> ProgramacionMedicaPorIdMedicoMesAnio(int idMedico, int mes, int anio, int idServicio)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "Web_ProgramacionMedicaPorIdMedicoMesAnio";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@lIdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@idServicio", SqlDbType.Int).Value = idServicio;
                        da.SelectCommand.Parameters.Add("@iMes", SqlDbType.Int).Value = mes;
                        da.SelectCommand.Parameters.Add("@iAnio", SqlDbType.Int).Value = anio;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        //////////////////////////PROXIMA CITA /////////////////////////////////////////////////////////////////////////////////////////////////////////
        public Task<DataSet> ListarFechasFuturasProgramacionMedica(int idEspecialidad, int idMedico, string fechaAtencion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarFechasFuturasProgramacionMedica";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@FechaAtencion", SqlDbType.VarChar).Value = fechaAtencion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }
        public Task<DataSet> ListarFechasFuturasProgramacionMedicaRefcon(int idEspecialidad, int idMedico, string fechaAtencion, string codigoServicioSuSalud)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ListarFechasFuturasProgramacionMedicaRefcon";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@FechaAtencion", SqlDbType.VarChar).Value = fechaAtencion;
                        da.SelectCommand.Parameters.Add("@codigoServicioSuSalud", SqlDbType.VarChar).Value = codigoServicioSuSalud;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

                
        public Task<DataSet> ListarServiciosPorFechaEspecialidad(int idTipoServicio, int idEspecialidad, int activaProcedimiento, string fecha)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ServiciosSeleccionarPorFechaProgramacionPorEspecialidad";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@activaProcedimiento", SqlDbType.Int).Value = activaProcedimiento;
                        da.SelectCommand.Parameters.Add("@FechaProgramacion", SqlDbType.VarChar).Value = fecha;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarServiciosPorFechaEspecialidadMedico(int idTipoServicio, int idEspecialidad, int idMedico, int activaProcedimiento, string fecha)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ServiciosSeleccionarPorFechaProgramacionPorEspecialidadMedico";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdTipoServicio", SqlDbType.Int).Value = idTipoServicio;
                        da.SelectCommand.Parameters.Add("@IdEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        da.SelectCommand.Parameters.Add("@IdMedico", SqlDbType.Int).Value = idMedico;
                        da.SelectCommand.Parameters.Add("@activaProcedimiento", SqlDbType.Int).Value = activaProcedimiento;
                        da.SelectCommand.Parameters.Add("@FechaProgramacion", SqlDbType.VarChar).Value = fecha;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarProgramacionMedicaCuposDisponibles(int idProgramacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaSeleccionarCuposDisponibles";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }

        public Task<DataSet> ListarProgramacionMedicaCuposTotales(int idProgramacion)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {

                        string sql = "web_ProgramacionMedicaSeleccionarCuposTotales";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = idProgramacion;

                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;

                    }
                }
            });
        }


        public Task<DataSet> GuardarProximaCita(int idAtencionOrigen, int idCita, int idPaciente, int idProgramacion, string horaInicioAtencion, int idTipoConsulta, int idSiaSis, string sisCodigo, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_ProximaCitaModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdAtencionOrigen", SqlDbType.Int).Value = (object) idAtencionOrigen ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@IdCita", SqlDbType.Int).Value = (object)idCita ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@IdPaciente", SqlDbType.Int).Value = (object)idPaciente ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@IdProgramacion", SqlDbType.Int).Value = (object)idProgramacion ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@HoraInicioAtencion", SqlDbType.VarChar).Value = (object)horaInicioAtencion ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@IdTipoConsulta", SqlDbType.Int).Value = (object)idTipoConsulta ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@IdSiaSis", SqlDbType.Int).Value = (object) idSiaSis ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@SisCodigo", SqlDbType.VarChar).Value = (object) sisCodigo ?? Convert.DBNull;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = (object) idUsuario ?? Convert.DBNull;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        public async Task<DataSet> BuscarOrdenParaCitaTerapia(int TipoFiltro, string NroSerie, string NroOrdenBoleta)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_BuscarOrdenParaCitaTerapia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@TipoFiltro", TipoFiltro);
                da.SelectCommand.Parameters.AddWithValue("@NroSerie", NroSerie);
                da.SelectCommand.Parameters.AddWithValue("@NroOrdenBoleta", NroOrdenBoleta);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<int> CrearModificarCitasTerapia(Citas objCitas, int IdUsuarioAuditoria, int IdPaciente, int IdCuenta,  int nroOrden, int IdCitaRegistrada) // JDELGADO001.2
        {

            int nRpta = 0;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CrearModificarCitasTerapia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                await conn.OpenAsync();

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@IdCita", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@HoraSolicitud", objCitas.HoraSolicitud ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaSolicitud", objCitas.FechaSolicitud);
                cmd.Parameters.AddWithValue("@IdProducto", objCitas.IdProducto);
                cmd.Parameters.AddWithValue("@IdProgramacion", objCitas.IdProgramacion);
                cmd.Parameters.AddWithValue("@IdServicio", objCitas.IdServicio);
                cmd.Parameters.AddWithValue("@HoraFin", objCitas.HoraFin ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@HoraInicio", objCitas.HoraInicio ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@Fecha", objCitas.Fecha);
                cmd.Parameters.AddWithValue("@IdEstadoCita", 1); // VER LUEGO
                cmd.Parameters.AddWithValue("@IdMedico", objCitas.IdMedico);
                cmd.Parameters.AddWithValue("@IdEspecialidad", objCitas.IdEspecialidad);
                cmd.Parameters.AddWithValue("@IdAtencion", objCitas.IdAtencion);
                cmd.Parameters.AddWithValue("@IdPaciente", IdPaciente);
                cmd.Parameters.AddWithValue("@EsCitaAdicional", objCitas.EsCitaAdicional);
                cmd.Parameters.AddWithValue("@TipoCita", objCitas.TipoCita);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", IdUsuarioAuditoria);
                cmd.Parameters.AddWithValue("@IdCuenta", IdCuenta);
                cmd.Parameters.AddWithValue("@nroOrden", nroOrden);
                cmd.Parameters.AddWithValue("@IdCitaRegistrada", IdCitaRegistrada);

                await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@IdCita"].Value.ToString());

                await conn.CloseAsync();

                return nRpta;
            }

        }

        public async Task<int> CitasEliminarTerapia(int IdCita) // JDELGADO001.2
        {

            int nRpta = 0;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("CitasEliminarTerapia", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                await conn.OpenAsync();

                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.AddWithValue("@IdCita", IdCita);

                nRpta = await cmd.ExecuteNonQueryAsync();

                await conn.CloseAsync();

                return nRpta;
            }

        }

        public async Task<int> CitasTerapiasBloqueadasAgregar(string horaBloqueo, DateTime fechaBloqueo, int idMedico, string horaInicio, string horaFin,
            DateTime fecha, int idUsuario) // JDELGADO001.2
        {

            int nRpta = 0;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("CitasTerapiasBloqueadasAgregar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                await conn.OpenAsync();

                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.Add("@IdCitaBloqueada", SqlDbType.Int).Direction = ParameterDirection.Output;

                cmd.Parameters.AddWithValue("@HoraBloqueo", horaBloqueo ?? Convert.DBNull);
                cmd.Parameters.AddWithValue("@FechaBloqueo", fechaBloqueo);
                cmd.Parameters.AddWithValue("@IdMedico", idMedico);
                cmd.Parameters.AddWithValue("@HoraFin", horaFin);
                cmd.Parameters.AddWithValue("@HoraInicio", horaInicio);
                cmd.Parameters.AddWithValue("@Fecha", fecha);
                cmd.Parameters.AddWithValue("@IdUsuario", idUsuario);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);

                nRpta = await cmd.ExecuteNonQueryAsync();
                nRpta = int.Parse(cmd.Parameters["@IdCitaBloqueada"].Value.ToString());

                await conn.CloseAsync();

                return nRpta;
            }

        }

        public async Task<int> CitasTerapiasBloqueadasEliminar(int IdCitaBloqueada, int idUsuario) // JDELGADO001.2
        {

            int nRpta = 0;

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("CitasTerapiasBloqueadasEliminar", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                await conn.OpenAsync();

                cmd.CommandType = CommandType.StoredProcedure;


                cmd.Parameters.AddWithValue("@IdCitaBloqueada", IdCitaBloqueada);
                cmd.Parameters.AddWithValue("@IdUsuarioAuditoria", idUsuario);

                nRpta = await cmd.ExecuteNonQueryAsync();

                await conn.CloseAsync();

                return nRpta;
            }

        }

        public async Task<DataSet> CitasTerapiasBloqueadasSeleccionarPorMedicoYFecha(int IdMedico, DateTime Fecha)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("CitasTerapiasBloqueadasSeleccionarPorMedicoYFecha", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdMedico", IdMedico);
                da.SelectCommand.Parameters.AddWithValue("@Fecha", Fecha);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

        public async Task<DataSet> CitasSeleeccionarPacientePorIdProgramacion(int IdProgramacion)  // JDELGADO002
        {
            DataSet ds = new DataSet();

            using (SqlConnection conn = new Conexion().obtenerConexion())
            using (SqlCommand cmd = new SqlCommand("Web_CitasSeleeccionarPacientePorIdProgramacion", conn))
            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                da.SelectCommand.Parameters.AddWithValue("@IdProgramacion", IdProgramacion);

                await conn.OpenAsync();

                da.Fill(ds);

                return ds;
            }
        }

    }
}
