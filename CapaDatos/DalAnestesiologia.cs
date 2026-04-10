using CapaEntidades;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DalAnestesiologia
    {
        public Task<int> CrearModificarAtencionAnestesiologia(AtencionesAnestesiologia atencionesAnestesiologia, string IntervencionQuirurgicaPropuesta)
        {
            DataSet ds = new DataSet();
            int nRpta;
            Conexion cx = new Conexion();

            return Task.Run(async () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_CrearModificarAtencionAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", atencionesAnestesiologia.IdAtencionAnestesiologia);
                            cmd.Parameters.AddWithValue("@IdAtencion", atencionesAnestesiologia.IdAtencion);
                            cmd.Parameters.AddWithValue("@ClasificacionPaciente", atencionesAnestesiologia.ClasificacionPaciente ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Controles", atencionesAnestesiologia.Controles ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@EdadGestacional", atencionesAnestesiologia.EdadGestacional ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@NroGestas", atencionesAnestesiologia.NroGestas ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@EnfermedadActual", atencionesAnestesiologia.EnfermedadActual ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TiempoEnfermedad", atencionesAnestesiologia.TiempoEnfermedad ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Relato", atencionesAnestesiologia.Relato ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Disnea", atencionesAnestesiologia.Disnea ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Ortopnea", atencionesAnestesiologia.Ortopnea ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Convulsiones", atencionesAnestesiologia.Convulsiones ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Fotopsias", atencionesAnestesiologia.Fotopsias ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Cianosis", atencionesAnestesiologia.Cianosis ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Cefalea", atencionesAnestesiologia.Cefalea ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Hemorragias", atencionesAnestesiologia.Hemorragias ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Fiebre", atencionesAnestesiologia.Fiebre ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Dolor", atencionesAnestesiologia.Dolor ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Nausea_Vomito", atencionesAnestesiologia.Nausea_Vomito ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Otros", atencionesAnestesiologia.Otros ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Ninguno", atencionesAnestesiologia.Ninguno ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@DescripcionOtros", atencionesAnestesiologia.DescripcionOtros ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Apetito", atencionesAnestesiologia.Apetito ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Sed", atencionesAnestesiologia.Sed ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Orina", atencionesAnestesiologia.Orina ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Deposiciones", atencionesAnestesiologia.Deposiciones ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Suenio", atencionesAnestesiologia.Suenio ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@RXToraxResumen", atencionesAnestesiologia.RXToraxResumen ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@RiesgoQuirurgico", atencionesAnestesiologia.RiesgoQuirurgico ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Operacion", atencionesAnestesiologia.Operacion ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@ClasificacionASA", atencionesAnestesiologia.ClasificacionASA ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Conclusion", atencionesAnestesiologia.Conclusion ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TipoAnestesiaPrevista", atencionesAnestesiologia.TipoAnestesiaPrevista ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TipoEvaluacionAnestesia", atencionesAnestesiologia.TipoEvaluacionAnestesia ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@IntervencionQuirurgicaPropuesta", IntervencionQuirurgicaPropuesta ?? Convert.DBNull);

                            //cmd.ExecuteNonQuery();
                            await cmd.ExecuteNonQueryAsync();
                            nRpta = int.Parse(cmd.Parameters["@nRpta"].Value.ToString());
                        }
                        catch (Exception ex)
                        {
                            nRpta = 0;
                            throw new Exception(ex.Message);
                        }
                        return nRpta;
                    }
                }
            });
            
        }

        public Task<int> CrearModificarAntecedentesPersonalesAnestesiologia(int IdAtencionAnestesiologia, AntecedentesPersonalesAnestesiologia antecedentesPersonales)
        {
            DataSet dataSet = new DataSet();
            int nRpta;
            Conexion cx = new Conexion();

            return Task.Run(async () => {

                using (SqlConnection conn = cx.obtenerConexion()) 
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_CrearModificarAntecedentesPersonalesAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", IdAtencionAnestesiologia);
                            cmd.Parameters.AddWithValue("@Diabetes", antecedentesPersonales.DiabetesP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@DiabetesDesc", antecedentesPersonales.DiabetesDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TBC", antecedentesPersonales.TBCP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TBCDesc", antecedentesPersonales.TBCDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Asma", antecedentesPersonales.AsmaP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@AsmaDesc", antecedentesPersonales.AsmaDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Hipertension", antecedentesPersonales.HipertensionP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@HipertensionDesc", antecedentesPersonales.HipertensionDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@PatologiaTiroidea", antecedentesPersonales.PatologiaTiroideaP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@PatologiaTiroideaDesc", antecedentesPersonales.PatologiaTiroideaDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@CirugiaPrevia", antecedentesPersonales.CirugiaPreviaP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@CirugiaPreviaDesc", antecedentesPersonales.CirugiaPreviaDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Alcohol", antecedentesPersonales.AlcoholP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@AlcoholDesc", antecedentesPersonales.AlcoholDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Tabaco", antecedentesPersonales.TabacoP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TabacoDesc", antecedentesPersonales.TabacoDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Drogas", antecedentesPersonales.DrogasP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@DrogasDesc", antecedentesPersonales.DrogasDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Transfusiones", antecedentesPersonales.TransfusionesP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TransfusionesDesc", antecedentesPersonales.TransfusionesDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@AnestesiasPrevias", antecedentesPersonales.AnestesiasPreviasP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@AnestesiasPreviasDesc", antecedentesPersonales.AnestesiasPreviasDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TendenciaHemorragias", antecedentesPersonales.TendenciaHemorragiasP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TendenciaHemorragiasDesc", antecedentesPersonales.TendenciaHemorragiasDescP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Otros", antecedentesPersonales.OtrosP ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@OtrosDesc", antecedentesPersonales.OtrosDescP ?? Convert.DBNull);

                            await cmd.ExecuteNonQueryAsync();
                            nRpta = 1;
                        }
                        catch (Exception ex)
                        {
                            nRpta = 0;
                            throw new Exception(ex.Message);
                        }
                        return nRpta;
                    }
                }
                
            });
        }

        public Task<int> CrearModificarAntecedentesFamiliaresAnestesiologia(int IdAtencionAnestesiologia, AntecedentesFamiliaresAnestesiologia antecedentesFamiliares)
        {
            DataSet dataSet = new DataSet();
            int nRpta;
            Conexion cx = new Conexion();

            return Task.Run(async () =>
            {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_CrearModificarAntecedentesFamiliaresAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", IdAtencionAnestesiologia);
                            cmd.Parameters.AddWithValue("@Diabetes", antecedentesFamiliares.DiabetesF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@DiabetesDesc", antecedentesFamiliares.DiabetesDescF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TBC", antecedentesFamiliares.TBCF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TBCDesc", antecedentesFamiliares.TBCDescF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Asma", antecedentesFamiliares.AsmaF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@AsmaDesc", antecedentesFamiliares.AsmaDescF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Hipertension", antecedentesFamiliares.HipertensionF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@HipertensionDesc", antecedentesFamiliares.HipertensionDescF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Otros", antecedentesFamiliares.OtrosF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@OtrosDesc", antecedentesFamiliares.OtrosDescF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@AnestesiasFamiliares", antecedentesFamiliares.AnestesiasFamiliaresF ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@AnestesiasFamiliaresDesc", antecedentesFamiliares.AnestesiasFamiliaresDescF ?? Convert.DBNull);

                            await cmd.ExecuteNonQueryAsync();
                            nRpta = 1;
                        }
                        catch (Exception ex)
                        {
                            nRpta = 0;
                            throw new Exception(ex.Message);
                        }
                        return nRpta;
                    }
                }
            });
        }

        public Task<int> CrearModificarAlergiasAnestesiologia(int IdAtencionAnestesiologia, AlergiasAnestesiologia alergiasAnestesiologia)
        {
            DataSet dataSet = new DataSet();
            int nRpta;
            Conexion cx = new Conexion();

            return Task.Run(async () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_CrearModificarAlergiasAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", IdAtencionAnestesiologia);
                            cmd.Parameters.AddWithValue("@Farmacologicas", alergiasAnestesiologia.Farmacologicas ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@FarmacologicasDesc", alergiasAnestesiologia.FarmacologicasDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Alimentacion", alergiasAnestesiologia.Alimentacion ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@AlimentacionDesc", alergiasAnestesiologia.AlimentacionDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Eosinofilia", alergiasAnestesiologia.Eosinofilia ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@EosinofiliaDesc", alergiasAnestesiologia.EosinofiliaDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Broncoespasmos", alergiasAnestesiologia.Broncoespasmos ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@BroncoespasmosDesc", alergiasAnestesiologia.BroncoespasmosDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Otros", alergiasAnestesiologia.Otros ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@OtrosDesc", alergiasAnestesiologia.OtrosDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@SignosSintomas", alergiasAnestesiologia.SignosSintomas ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Shock", alergiasAnestesiologia.Shock ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@RASH", alergiasAnestesiologia.RASH ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Edema", alergiasAnestesiologia.Edema ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Glotis", alergiasAnestesiologia.Glotis ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Prurito", alergiasAnestesiologia.Prurito ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Observacion", alergiasAnestesiologia.Observacion ?? Convert.DBNull);

                            await cmd.ExecuteNonQueryAsync();
                            nRpta = 1;
                        }
                        catch (Exception ex)
                        {
                            nRpta = 0;
                            throw new Exception(ex.Message);
                        }
                        return nRpta;
                    }
                }
            });
        }

        public Task<int> CrearExamenFisicoAnestesiologia(int IdAtencionAnestesiologia, ExamenFisicoAnestesiologia examenFisico)
        {
            DataSet dataSet = new DataSet();
            int nRpta;
            Conexion cx = new Conexion();

            return Task.Run(async () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_CrearExamenFisicoAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", IdAtencionAnestesiologia);
                            cmd.Parameters.AddWithValue("@EstadoGeneralSensorio", examenFisico.EstadoGeneralSensorio ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@EstadoGeneralSensorioDesc", examenFisico.EstadoGeneralSensorioDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@EstadoGeneralSensorioEdemas", examenFisico.EstadoGeneralSensorioEdemas ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Cardiovascular", examenFisico.Cardiovascular ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@CardiovascularDesc", examenFisico.CardiovascularDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@CardiovascularEdemas", examenFisico.CardiovascularEdemas ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Abdomen", examenFisico.Abdomen ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@AbdomenDesc", examenFisico.AbdomenDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Piel", examenFisico.Piel ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@PielDesc", examenFisico.PielDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Ojos", examenFisico.Ojos ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@OjosDesc", examenFisico.OjosDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@MovCervical", examenFisico.MovCervical ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@MovCervicalDesc", examenFisico.MovCervicalDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Neurologico", examenFisico.Neurologico ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@NeurologicoDesc", examenFisico.NeurologicoDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@ColumnaVertebral", examenFisico.ColumnaVertebral ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@ColumnaVertebralDesc", examenFisico.ColumnaVertebralDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@EstadoGeneral", examenFisico.EstadoGeneral ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@EstadoGeneralDesc", examenFisico.EstadoGeneralDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@EstadoNutricional", examenFisico.EstadoNutricional ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@EstadoNutricionalDesc", examenFisico.EstadoNutricionalDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Venas", examenFisico.Venas ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@VenasDesc", examenFisico.VenasDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@ViasAereas", examenFisico.ViasAereas ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@ViasAereasDesc", examenFisico.ViasAereasDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Dentadura", examenFisico.Dentadura ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@DentaduraDesc", examenFisico.DentaduraDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Traquea", examenFisico.Traquea ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TraqueaDesc", examenFisico.TraqueaDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Torax", examenFisico.Torax ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@ToraxDesc", examenFisico.ToraxDesc ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Mallampati", examenFisico.Mallampati ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@DistanciaMentoTiroidea", examenFisico.DistanciaMentoTiroidea ?? Convert.DBNull);

                            await cmd.ExecuteNonQueryAsync();
                            nRpta = 1;
                        }
                        catch (Exception ex)
                        {
                            nRpta = 0;
                            throw new Exception(ex.Message);
                        }
                        return nRpta;
                    }
                }
            });
        }

        public Task<int> CrearResultadosAnestesiologia(
            int IdAtencionAnestesiologia, string Hb, string Hto, string TProt, string TTrombiop, string Glucosa, string Urea,
            string Creatinina, string VDRL, string HIV, string GrupoyRh, string Fibrogeno, string RxTorax, string RectPlaquetas,
            string Rq, string Orina, string Covid19
            )
        {
            DataSet dataSet = new DataSet();
            int nRpta;
            Conexion cx = new Conexion();

            return Task.Run(async () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_CrearResultadosAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", IdAtencionAnestesiologia);
                            cmd.Parameters.AddWithValue("@Hb", Hb ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Hto", Hto ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TProt", TProt ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@TTrombiop", TTrombiop ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Glucosa", Glucosa ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Urea", Urea ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Creatinina", Creatinina ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@VDRL", VDRL ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@HIV", HIV ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@GrupoyRh", GrupoyRh ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Fibrogeno", Fibrogeno ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@RxTorax", RxTorax ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@RectPlaquetas", RectPlaquetas ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Rq", Rq ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Orina", Orina ?? Convert.DBNull);
                            cmd.Parameters.AddWithValue("@Covid19", Covid19 ?? Convert.DBNull);

                            await cmd.ExecuteNonQueryAsync();
                            nRpta = 1;
                        }
                        catch (Exception ex)
                        {
                            nRpta = 0;
                            throw new Exception(ex.Message);
                        }
                        return nRpta;
                    }
                }
            });
        }
        public Task<int> CrearModificarMedicacionSuministradaAnestesiologia(int IdAtencionAnestesiologia, List<MedicacionSuministradaAnestesiologia> lstMedicacionSuministrada)
        {
            DataSet dataSet = new DataSet();
            int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(async () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string xmlMedicacionSuministrada;
                            xmlMedicacionSuministrada = XmlUtil.Serializer(typeof(List<MedicacionSuministradaAnestesiologia>), lstMedicacionSuministrada);

                            string sql = "web_InsertaMedicacionSuministradaAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", IdAtencionAnestesiologia);
                            cmd.Parameters.AddWithValue("@MedicacionSuministrada", xmlMedicacionSuministrada);

                            await cmd.ExecuteNonQueryAsync();
                            nRpta = 1;
                        }
                        catch (Exception ex)
                        {
                            nRpta = 0;
                            throw new Exception(ex.Message);
                        }
                        return nRpta;
                    }
                }
            });
        }

        public Task<int> CrearModificarPatologiaClinicaAnestesiologia(int IdAtencionAnestesiologia, List<PatologiaClinicaAnestesiologia> lstPatologiaClinicaAnestesiologia)
        {
            DataSet dataSet = new DataSet();
            int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run(async () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    conn.Open();
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string xmlPatologiaClinica;
                            xmlPatologiaClinica = XmlUtil.Serializer(typeof(List<PatologiaClinicaAnestesiologia>), lstPatologiaClinicaAnestesiologia);

                            string sql = "web_InsertaPatologiaClinicaAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            //cmd.Parameters.Add("@nRpta", SqlDbType.Int).Direction = ParameterDirection.Output;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", IdAtencionAnestesiologia);
                            cmd.Parameters.AddWithValue("@PatologiaClinicaAnestesiologia", xmlPatologiaClinica);

                            await cmd.ExecuteNonQueryAsync();
                            nRpta = 1;
                        }
                        catch (Exception ex)
                        {
                            nRpta = 0;
                            throw new Exception(ex.Message);
                        }
                        return nRpta;
                    }
                }
            });
        }

        public Task<DataSet> ListarAtencionesAnestesiologia(int idAtencion)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarAtencionesAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idAtencion", idAtencion);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> ListarMedicacionSuministradaAnestesiologia(int idAtencionAnestesiologia)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarMedicacionSuministradaAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", idAtencionAnestesiologia);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> ListarPatologiaClinicaAnestesiologia(int idAtencionAnestesiologia)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarPatologiaClinicaAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@IdAtencionAnestesiologia", idAtencionAnestesiologia);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }
        public Task<DataSet> ListarExamenesAnestesiologiaByCuenta(int idCuentaAtencion)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarExamenesAnestesiologiaByCuenta";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }

        public Task<DataSet> ListarExamenesPatologiaParaAtencionAnestesiologia(int idCuentaAtencion) // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarExamenesPatologiaParaAtencionAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idCuentaAtencion", idCuentaAtencion);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }
        public Task<DataSet> ListarResultadosAnestesiologiaByIdAtencionAnestesiologia(int idAtencionAnestesiologia)
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListarResultadosAnestesiologiaByIdAtencionAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@idAtencionAnestesiologia", idAtencionAnestesiologia);

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }
        public Task<DataSet> ListarFactCatalogoServicios()
        {
            DataSet dataSet = new DataSet();
            //int nRpta = 0;
            Conexion cx = new Conexion();

            return Task.Run( () => {

                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_ListaCptsAnestesiologia";
                            SqlCommand cmd = new SqlCommand(sql, conn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand = cmd;
                            da.Fill(dataSet);
                        }
                        catch (Exception ex)
                        {
                            dataSet = null;
                            throw new Exception(ex.Message);
                        }
                        return dataSet;
                    }
                }
            });
        }
    }
}
