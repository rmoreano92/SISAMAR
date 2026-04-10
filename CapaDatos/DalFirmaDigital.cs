//using Aspose.Zip.SevenZip;
using CapaDatos;
using System;
using System.Data;
using System.Data.SqlClient;
using System.IO.Compression;
using System.Threading.Tasks;
//using SharpCompress.Archives;
//using SharpCompress.Archives.SevenZip;
//using SharpCompress.Common;
//using System.IO;
using SevenZip;
using Aspose.Zip.Saving;

namespace WebAppMaternidad.CapaDatos
{
    public class DalFirmaDigital
    {

        public async Task<DataSet> FirmaDigitalSeleccionarPorCodePorIdEmpleado(string code, int idEmpleado)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FirmaDigitalSeleccionarPorCodePorIdEmpleado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@code", SqlDbType.VarChar).Value = code;
                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }


        public async Task<DataSet> SeleccionarFirmaDigitalPorNombreArchivo(string nombre)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            //bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_SeleccionarFirmaDigitalPorNombreArchivo";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@nombre", SqlDbType.VarChar).Value = nombre;

                            da.Fill(ds);

                            return ds;
                        }
                        catch (Exception ex)
                        {
                            //nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        //return null;
                    }
                }
            });
        }

        public async Task<Boolean> EstadoFirmaEmpleadoModificar(int idFirma, string codeFirma, int idEmpleado, int estado)
        {
            DataSet ds = new DataSet();
            Conexion cx = new Conexion();
            bool nRpta = false;
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        try
                        {
                            string sql = "web_EstadoFirmaDigitalAutorizadoModificar";
                            da.SelectCommand = new SqlCommand(sql, conn);
                            da.SelectCommand.CommandType = CommandType.StoredProcedure;

                            da.SelectCommand.Parameters.Add("@IdFirma", SqlDbType.Int).Value = idFirma;
                            da.SelectCommand.Parameters.Add("@CodeFirma", SqlDbType.VarChar).Value = codeFirma;
                            da.SelectCommand.Parameters.Add("@IdEmpleado", SqlDbType.Int).Value = idEmpleado;
                            da.SelectCommand.Parameters.Add("@Estado", SqlDbType.Int).Value = estado;

                            da.Fill(ds);

                            nRpta = true;
                        }
                        catch (Exception ex)
                        {
                            nRpta = false;
                            throw new Exception(ex.Message);
                        }

                        return nRpta;
                    }
                }
            });
        }

        public async Task<string> PaqueteArchivoModificar(string nombre, int idUsuario, int estado)
        {
            string nRpta = "";
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            try
            {
                using (var conn = cx.obtenerConexion())
                {
                    await conn.OpenAsync();
                    var cmd = new SqlCommand("web_PaqueteArchivoModificar", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    //cmd.Parameters.AddWithValue("@IdPaquete", idPaquete);
                    cmd.Parameters.Add("@Nombre", SqlDbType.VarChar, 256).Value = nombre;                    
                    cmd.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = idUsuario;
                    cmd.Parameters.Add("@Estado", SqlDbType.Int).Value = estado;
                    cmd.Parameters.Add("@NombrePackage", SqlDbType.VarChar, 256).Direction = ParameterDirection.Output;
                    await cmd.ExecuteNonQueryAsync();
                    conn.Close();
                    nRpta = cmd.Parameters["@NombrePackage"].Value.ToString(); ;
                }

            }
            catch (Exception ex)
            {
                nRpta = "ERROR: " + ex.Message.ToString();
                throw new Exception(ex.Message);
            }
            return nRpta;
        }



        public async Task<string> FirmaDigitalGenerarPaquete(string cuentas, string registros, string tipos, int idUsuario)
        {
            string nRpta = "";
            //SqlCommand cmd = null;
            Conexion cx = new Conexion();
            try
            {
                using (var conn = cx.obtenerConexion())
                {
                    await conn.OpenAsync();
                    var cmd = new SqlCommand("web_FirmaDigitalGenerarPaquete", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    //cmd.Parameters.AddWithValue("@IdPaquete", idPaquete);
                    cmd.Parameters.Add("@cuentas", SqlDbType.VarChar).Value = (cuentas == null ? "" : cuentas);
                    cmd.Parameters.Add("@registros", SqlDbType.VarChar).Value = (registros == null ? "" : registros);
                    cmd.Parameters.Add("@tipos", SqlDbType.VarChar, 256).Value = (tipos == null ? "" : tipos);
                    cmd.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idUsuario;
                    cmd.Parameters.Add("@paquete", SqlDbType.VarChar, 50).Direction = ParameterDirection.Output;
                    await cmd.ExecuteNonQueryAsync();
                    conn.Close();
                    nRpta = cmd.Parameters["@paquete"].Value.ToString(); ;
                }

            }
            catch (Exception ex)
            {
                nRpta = "ERROR: " + ex.Message.ToString();
                throw new Exception(ex.Message);
            }
            return nRpta;
        }

        public async Task<DataSet> FirmaDigitalSeleccionarPorPaquetePorIdEmpleado(string paquete, int idEmpleado)
        {
            Conexion cx = new Conexion();
            return await Task.Run(() =>
            {
                using (SqlConnection conn = cx.obtenerConexion())
                {
                    using (SqlDataAdapter da = new SqlDataAdapter())
                    {
                        string sql = "web_FirmaDigitalSeleccionarPorPaquetePorIdEmpleado";
                        da.SelectCommand = new SqlCommand(sql, conn);
                        da.SelectCommand.CommandType = CommandType.StoredProcedure;

                        da.SelectCommand.Parameters.Add("@paquete", SqlDbType.VarChar).Value = paquete;
                        da.SelectCommand.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;

                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        return ds;
                    }
                }
            });
        }

        public string ComprimirArchivoEnZip(string directorio, string zip)
        {

            try
            {
                System.IO.Compression.ZipFile.CreateFromDirectory(directorio, zip, System.IO.Compression.CompressionLevel.Fastest, false);
            }
            catch (Exception e)
            {
                return e.ToString();
            }

            return "Ok";
        }


        public string ComprimirArchivoEn7Zip(string directorio, string zip)
        {

            try
            {
                ////VERSION HASTA LA WEBA
                //using (SevenZipArchive archive = new SevenZipArchive())
                //{
                //    archive.CreateEntries(directorio, false);
                //    archive.Save(zip);
                //}
                Conexion con = new Conexion();
                //string sevenZipDllPath = @"C:\Program Files\7-Zip\7z.dll";
                string sevenZipDllPath = con.obtenerApi7zip();
                SevenZipCompressor.SetLibraryPath(sevenZipDllPath);

                SevenZipCompressor compressor = new SevenZipCompressor
                {
                    CompressionMethod = SevenZip.CompressionMethod.Lzma2, // Método LZMA2 para 7z
                    CompressionLevel = SevenZip.CompressionLevel.Ultra,  // Nivel de compresión alto
                };

                compressor.CompressDirectory(directorio, zip);
                Console.WriteLine("Archivo 7z generado correctamente.");               
            }
            catch (Exception e)
            {
                return e.ToString();
            }

            return "Ok";
        }

    }
}
