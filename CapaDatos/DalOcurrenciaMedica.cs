using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using CapaEntidades;
using CapaDatos;
using WebAppMaternidad.CapaEntidades;
using DocumentFormat.OpenXml.Office.Word;
using System.Collections.Generic;

namespace WebAppMaternidad.CapaDatos
{
    public class DalOcurrenciaMedica
    {
        public Task<DataSet> ListarOcurrenciasMedicas(int nroFolio, string fechaOcurrencia, int estadoOcurrencia, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_OcurrenciasMedicasListar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@NroFolio", SqlDbType.Int).Value = nroFolio;
                        da.SelectCommand.Parameters.Add("@FechaOcurrencia", SqlDbType.VarChar).Value = fechaOcurrencia;
                        da.SelectCommand.Parameters.Add("@EstadoOcurrencia", SqlDbType.Int).Value = estadoOcurrencia;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarOcurrenciaMedica(int idOcurrenciaMedica, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_OcurrenciasMedicasSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdOcurrenciaMedica", SqlDbType.Int).Value = idOcurrenciaMedica;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarMedicosGuardiaOcurrencia(int idOcurrenciaMedica, int idUsuario)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_MedicosGuardiaOcurrenciaSeleccionar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdOcurrenciaMedica", SqlDbType.Int).Value = idOcurrenciaMedica;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        public Task<DataSet> SeleccionarCantidadAtencionesGuardiaOcurrencia(string fecha, int idTurno)
        {
            Conexion cx = new Conexion();
            return Task.Run(() =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_OcurrenciasMedicasCantidadAtenciones";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@Fecha", SqlDbType.VarChar).Value = fecha;
                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = idTurno;                        

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }


        public Task<DataSet> GuardarOcurrenciaMedica(OcurrenciaMedica obj, List<MedicosOcurrencia> dsMedicos, int IdUsuario)
        {
            Conexion cx = new Conexion();
            string xmlMedicos;
            xmlMedicos = XmlUtil.Serializer(typeof(List<MedicosOcurrencia>), dsMedicos);
            return Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {                        
                        string sql = "web_OcurrenciasMedicasModificar";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@IdOcurrenciaMedica", SqlDbType.Int).Value = obj.IdOcurrenciaMedica;

                        da.SelectCommand.Parameters.Add("@NroDocJefeGuardia", SqlDbType.VarChar).Value = obj.NroDocJefeGuardia;
                        da.SelectCommand.Parameters.Add("@NroDocJefeGuardiaEntrante", SqlDbType.VarChar).Value = obj.NroDocJefeGuardiaEntrante;
                        da.SelectCommand.Parameters.Add("@IdTurno", SqlDbType.Int).Value = obj.IdTurno;
                        da.SelectCommand.Parameters.Add("@MedicosOcurrencia", SqlDbType.Xml).Value = xmlMedicos;
                        da.SelectCommand.Parameters.Add("@MuertesMaternas", SqlDbType.Int).Value = obj.MuertesMaternas;
                        da.SelectCommand.Parameters.Add("@DMuertesMaternas", SqlDbType.Text).Value = obj.DMuertesMaternas;
                        da.SelectCommand.Parameters.Add("@EventosAdversos", SqlDbType.Int).Value = obj.EventosAdversos;
                        da.SelectCommand.Parameters.Add("@DEventosAdversos", SqlDbType.Text).Value = obj.DEventosAdversos;
                        da.SelectCommand.Parameters.Add("@PacientesCriticos", SqlDbType.Int).Value = obj.PacientesCriticos;
                        da.SelectCommand.Parameters.Add("@DPacientesCriticos", SqlDbType.Text).Value = obj.DPacientesCriticos;
                        da.SelectCommand.Parameters.Add("@ReintervencionesQx", SqlDbType.Int).Value = obj.ReintervencionesQx;
                        da.SelectCommand.Parameters.Add("@DReintervencionesQx", SqlDbType.Text).Value = obj.DReintervencionesQx;
                        da.SelectCommand.Parameters.Add("@CasosMedicoLegal", SqlDbType.Int).Value = obj.CasosMedicoLegal;
                        da.SelectCommand.Parameters.Add("@DCasosMedicoLegal", SqlDbType.Text).Value = obj.DCasosMedicoLegal;
                        da.SelectCommand.Parameters.Add("@AtEmerObstetricas", SqlDbType.Int).Value = obj.AtEmerObstetricas;
                        da.SelectCommand.Parameters.Add("@AtEmerGinecologicas", SqlDbType.Int).Value = obj.AtEmerGinecologicas;
                        da.SelectCommand.Parameters.Add("@AtEmerPediatricas", SqlDbType.Int).Value = obj.AtEmerPediatricas;
                        da.SelectCommand.Parameters.Add("@AtEmerObservacion", SqlDbType.Int).Value = obj.AtEmerObservacion;
                        da.SelectCommand.Parameters.Add("@AtEmerTraumaShock", SqlDbType.Int).Value = obj.AtEmerTraumaShock;
                        da.SelectCommand.Parameters.Add("@AtEmerEcografias", SqlDbType.Int).Value = obj.AtEmerEcografias;
                        da.SelectCommand.Parameters.Add("@AtEmerCesareas", SqlDbType.Int).Value = obj.AtEmerCesareas;
                        da.SelectCommand.Parameters.Add("@AtEmerLaparatomias", SqlDbType.Int).Value = obj.AtEmerLaparatomias;
                        da.SelectCommand.Parameters.Add("@AtEmerLaparascopias", SqlDbType.Int).Value = obj.AtEmerLaparascopias;
                        da.SelectCommand.Parameters.Add("@AtEmerLegrados", SqlDbType.Int).Value = obj.AtEmerLegrados;
                        da.SelectCommand.Parameters.Add("@AtEmerPartos", SqlDbType.Int).Value = obj.AtEmerPartos;
                        da.SelectCommand.Parameters.Add("@AtEmerTocolisis", SqlDbType.Int).Value = obj.AtEmerTocolisis;
                        da.SelectCommand.Parameters.Add("@AtCoCesareas", SqlDbType.Int).Value = obj.AtCoCesareas;
                        da.SelectCommand.Parameters.Add("@AtCoLapratomias", SqlDbType.Int).Value = obj.AtCoLapratomias;
                        da.SelectCommand.Parameters.Add("@AtCoLaparascopias", SqlDbType.Int).Value = obj.AtCoLaparascopias;
                        da.SelectCommand.Parameters.Add("@AtCoLegrados", SqlDbType.Int).Value = obj.AtCoLegrados;
                        da.SelectCommand.Parameters.Add("@AtCoPartos", SqlDbType.Int).Value = obj.AtCoPartos;
                        da.SelectCommand.Parameters.Add("@AtCoTocolisis", SqlDbType.Int).Value = obj.AtCoTocolisis;
                        da.SelectCommand.Parameters.Add("@AtPerCesareas", SqlDbType.Int).Value = obj.AtPerCesareas;
                        da.SelectCommand.Parameters.Add("@AtPerLaparatomias", SqlDbType.Int).Value = obj.AtPerLaparatomias;
                        da.SelectCommand.Parameters.Add("@AtPerLaparascopias", SqlDbType.Int).Value = obj.AtPerLaparascopias;
                        da.SelectCommand.Parameters.Add("@AtPerLegrados", SqlDbType.Int).Value = obj.AtPerLegrados;
                        da.SelectCommand.Parameters.Add("@AtPerPartos", SqlDbType.Int).Value = obj.AtPerPartos;
                        da.SelectCommand.Parameters.Add("@AtPerTocolisis", SqlDbType.Int).Value = obj.AtPerTocolisis;

                        da.SelectCommand.Parameters.Add("@AtEmerCesareasPend", SqlDbType.Int).Value = obj.AtEmerCesareasPend;
                        da.SelectCommand.Parameters.Add("@AtEmerAmeuPend", SqlDbType.Int).Value = obj.AtEmerAmeuPend;
                        da.SelectCommand.Parameters.Add("@AtEmerEcografiasPend", SqlDbType.Int).Value = obj.AtEmerEcografiasPend;
                        da.SelectCommand.Parameters.Add("@AtEmerLaparascopiasPend", SqlDbType.Int).Value = obj.AtCoLaparascopiasPend;
                        da.SelectCommand.Parameters.Add("@AtEmerLaparatomiasPend", SqlDbType.Int).Value = obj.AtEmerLaparatomiasPend;
                        da.SelectCommand.Parameters.Add("@AtEmerReferidosPorLlegarPend", SqlDbType.Int).Value = obj.AtEmerReferidosPorLlegarPend;
                        da.SelectCommand.Parameters.Add("@DPacientesEmer", SqlDbType.Text).Value = obj.DPacientesEmer;

                        da.SelectCommand.Parameters.Add("@AtCoCesareasPend", SqlDbType.Int).Value = obj.AtCoCesareasPend;
                        da.SelectCommand.Parameters.Add("@AtCoAmeuPend", SqlDbType.Int).Value = obj.AtCoAmeuPend;
                        da.SelectCommand.Parameters.Add("@AtCoEcografiasPend", SqlDbType.Int).Value = obj.AtCoEcografiasPend;
                        da.SelectCommand.Parameters.Add("@AtCoLaparascopiasPend", SqlDbType.Int).Value = obj.AtCoLaparascopiasPend;
                        da.SelectCommand.Parameters.Add("@AtCoLaparatomiasPend", SqlDbType.Int).Value = obj.AtCoLaparatomiasPend;
                        da.SelectCommand.Parameters.Add("@AtCoReferidosPorLlegarPend", SqlDbType.Int).Value = obj.AtCoReferidosPorLlegarPend;
                        da.SelectCommand.Parameters.Add("@DPacientesCO", SqlDbType.Text).Value = obj.DPacientesCO;

                        da.SelectCommand.Parameters.Add("@AtPerCesareasPend", SqlDbType.Int).Value = obj.AtPerCesareasPend;
                        da.SelectCommand.Parameters.Add("@AtPerAmeuPend", SqlDbType.Int).Value = obj.AtPerAmeuPend;
                        da.SelectCommand.Parameters.Add("@AtPerEcografiasPend", SqlDbType.Int).Value = obj.AtPerEcografiasPend;
                        da.SelectCommand.Parameters.Add("@AtPerLaparascopiasPend", SqlDbType.Int).Value = obj.AtPerLaparascopiasPend;
                        da.SelectCommand.Parameters.Add("@AtPerLaparatomiasPend", SqlDbType.Int).Value = obj.AtPerLaparatomiasPend;
                        da.SelectCommand.Parameters.Add("@AtPerReferidosPorLlegarPend", SqlDbType.Int).Value = obj.AtPerReferidosPorLlegarPend;
                        da.SelectCommand.Parameters.Add("@DPacientesPer", SqlDbType.Text).Value = obj.DPacientesPer;

                        da.SelectCommand.Parameters.Add("@PacientesUCI", SqlDbType.Int).Value = obj.PacientesUCI;
                        da.SelectCommand.Parameters.Add("@DPacientesUCI", SqlDbType.Text).Value = obj.DPacientesUCI;
                        da.SelectCommand.Parameters.Add("@Ocurrencias", SqlDbType.Text).Value = obj.Ocurrencias;
                        da.SelectCommand.Parameters.Add("@FechaOcurrencia", SqlDbType.VarChar).Value = obj.FechaOcurrencia;
                        da.SelectCommand.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = IdUsuario;
                        
                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }

            });
        }

        //public Task<DataSet> SeleccionarEvaluacionDetalle(int idAtencion, int idServicio, int idUsuario)
        //{
        //    Conexion cx = new Conexion();
        //    return Task.Run(() =>
        //    {

        //        using (SqlConnection conn = cx.obtenerConexion())
        //        {
        //            using (SqlDataAdapter da = new SqlDataAdapter())
        //            {
        //                string sql = "web_EvaluacionEmergenciaDetalleSeleccionar";
        //                da.SelectCommand = new SqlCommand(sql, conn);
        //                da.SelectCommand.CommandType = CommandType.StoredProcedure;

        //                da.SelectCommand.Parameters.Add("@IdAtencion", SqlDbType.Int).Value = idAtencion;
        //                da.SelectCommand.Parameters.Add("@IdServicio", SqlDbType.Int).Value = idServicio;
        //                da.SelectCommand.Parameters.Add("@usuarioRegistro", SqlDbType.Int).Value = idUsuario;

        //                DataSet ds = new DataSet();
        //                da.Fill(ds);

        //                return ds;
        //            }
        //        }

        //    });
        //}
    }
}
