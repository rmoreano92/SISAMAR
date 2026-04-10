using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System;
using System.Data;
using System.Threading.Tasks;
using WebAppMaternidad.CapaDatos;
using WebAppMaternidad.CapaEntidades;
using Microsoft.AspNetCore.Http;
using SiHospCrypKey;
using WebAppMaternidad.Areas.Comun;
using System.IO;
using System.Drawing;
using Microsoft.IdentityModel.Tokens;

namespace WebAppMaternidad.Areas.Seguridad
{
    public class EmpleadosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> BuscarEmpleado(string dni, string apPaterno, string apMaterno, string nombres)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalEmpleado daoEmpleado = new DalEmpleado();

            lstData = await daoEmpleado.BuscarEmpleado(dni, apPaterno, apMaterno, nombres);

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosFiltrar(string filtro, int activo)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalEmpleado daoEmpleado = new DalEmpleado();

            lstData = await daoEmpleado.EmpleadosFiltrar(filtro, activo);

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaTiposEmpleados()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lstData;
            DalEmpleado dalEmpleado = new DalEmpleado();
            lstData = await dalEmpleado.ListaTiposEmpleados();
            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaTiposCondicionTrabajo()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lstData;
            DalEmpleado dalEmpleado = new DalEmpleado();
            lstData = await dalEmpleado.ListaTiposCondicionTrabajo();
            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaTiposDestacado()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lstData;
            DalEmpleado dalEmpleado = new DalEmpleado();
            lstData = await dalEmpleado.ListaTiposDestacados();
            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaTiposPuestos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lstData;
            DalEmpleado dalEmpleado = new DalEmpleado();
            lstData = await dalEmpleado.ListaTiposPuestos();
            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaCargos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lstData;
            DalEmpleado dalEmpleado = new DalEmpleado();
            lstData = await dalEmpleado.ListaTiposCargos();
            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListaColegiosHis()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lstData;
            DalEmpleado dalEmpleado = new DalEmpleado();
            lstData = await dalEmpleado.ListaColegiosHis();
            return Json(new { lstData = lstData, session = true });
        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosRolesSeleccionar(int idEmpleado)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalEmpleado daoEmpleado = new DalEmpleado();

            lstData = await daoEmpleado.EmpleadosRolesSeleccionar(idEmpleado);

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosCargosSeleccionar(int idEmpleado)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalEmpleado daoEmpleado = new DalEmpleado();

            lstData = await daoEmpleado.EmpleadosCargosSeleccionar(idEmpleado);

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosLaboraLugarSeleccionar(int idEmpleado)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalEmpleado daoEmpleado = new DalEmpleado();

            lstData = await daoEmpleado.EmpleadosLaboraLugarSeleccionar(idEmpleado);

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> EmpleadosMedicosEspecialidadesSeleccionar(int idMedico)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalEmpleado daoEmpleado = new DalEmpleado();

            lstData = await daoEmpleado.EmpleadosMedicosEspecialidadesSeleccionar(idMedico);

            return Json(new { lstData = lstData, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> GuardarModificarEmpleado(Empleado empleado, Medico medico, String lstRoles, String lstCargos, String lstLaboraLugar, String lstEspecialidades)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            //DataSet lstData;
            DalEmpleado daoEmpleado = new DalEmpleado();
            Encriptar encriptar = new Encriptar();
            Conexion con = new Conexion();
            UtilitarioController util = new UtilitarioController();
            bool rpta = false;            
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            var lstobjRoles = JsonConvert.DeserializeObject<List<UsuariosRoles>>(lstRoles);
            var lstobjCargos = JsonConvert.DeserializeObject<List<EmpleadosCargos>>(lstCargos);
            var lstobjLaboraLugar = JsonConvert.DeserializeObject<List<EmpleadosLugarDeTrabajo>>(lstLaboraLugar);
            var lstobjEspecialidades = JsonConvert.DeserializeObject<List<MedicosEspecialidad>>(lstEspecialidades);

            if(empleado.ClaveVWeb != "---------------")
            {
                empleado.ClaveVWeb = encriptar.EncriptarCadena(empleado.ClaveVWeb);
            }

            if (!string.IsNullOrEmpty(empleado.FotoFirma))
            {
                if (empleado.FotoFirma != "SIN-MODIFICAR")
                {
                    string nombreArchivo = "";
                    string carpetaArchivo = "";
                    byte[] imageBytes = Convert.FromBase64String(empleado.FotoFirma);

                    Image image;
                    using (MemoryStream ms = new MemoryStream(imageBytes))
                    {
                        image = Image.FromStream(ms);

                        nombreArchivo = await util.EncriptarNombreArchivo(empleado.DNI + "_" + empleado.ApellidoPaterno + "_" + empleado.ApellidoMaterno + "_" + empleado.Nombres);
                        carpetaArchivo = con.ObtenerServidorArchivos() + "resources/empleados/firmas";
                        if (!Directory.Exists(carpetaArchivo))
                        {
                            Directory.CreateDirectory(carpetaArchivo);
                        }

                        image.Save(carpetaArchivo + "/" + nombreArchivo + ".png", System.Drawing.Imaging.ImageFormat.Png);
                    }

                    empleado.FotoFirma = carpetaArchivo + "/" + nombreArchivo + ".png";
                }
            }

            rpta = await daoEmpleado.GuardarModificarEmpleado(empleado, medico, lstobjRoles, lstobjCargos, lstobjLaboraLugar, lstobjEspecialidades, idUsuario);

            return Json(new { rpta = rpta, mensaje = "", sesion = true });
        }

        public async Task<ActionResult> EliminarEmpleado(int idEmpleado)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalEmpleado daoEmpleado = new DalEmpleado();
            bool rpta = false;

            rpta = await daoEmpleado.EliminarEmpleado(idEmpleado);


            return Json(new { rpta = rpta, mensaje = "", sesion = true });
        }

        [HttpPost]
        public async Task<ActionResult> DevuelveSubAreaDondeLaboraElUsuarioDelSistema(int idLaboraArea)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DataSet lstData;
            DalEmpleado daoEmpleado = new DalEmpleado();
            int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

            lstData = await daoEmpleado.DevuelveSubAreaDondeLaboraElUsuarioDelSistema(idLaboraArea, idUsuario);

            return Json(new { lstData = lstData, mensaje = "", sesion = true, session = true, estado = true });
        }

        [HttpPost]
        public async Task<ActionResult> ListarMedicosTodos()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }
            DataSet lstData;
            DalEmpleado dalEmpleado = new DalEmpleado();
            lstData = await dalEmpleado.ListarMedicosTodos();
            return Json(new { lstData = lstData, session = true });
        }

    }
}
