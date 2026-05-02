using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.ConsultaExterna
{
    public class AnestesiologiaController: BaseController
    {
        [HttpPost]
        public async Task<ActionResult> CrearModificarAtencionAnestesiologia(int IdTipoAtencionAnestesio,
            AntecedentesPersonalesAnestesiologia antecedentesPersonales, AtencionesAnestesiologia atencionesAnestesiologia,
            AntecedentesFamiliaresAnestesiologia antecedentesFamiliares, AlergiasAnestesiologia alergiasAnestesiologia,
            ExamenFisicoAnestesiologia examenFisico, string Hb, string Hto, string TProt, string TTrombiop, string Glucosa, string Urea,
            string Creatinina, string VDRL, string HIV, string GrupoyRh, string Fibrogeno, string RxTorax, string RectPlaquetas,
            string Rq, string OrinaRes, string Covid19,
            string MedicacionSuministrada, string Diagnosticos, string PatologiaClinica, string IntervencionQuirurgicaPropuesta)
        {
            if(HttpContext.User.Identity.IsAuthenticated  == false)
            {
                return Json(new { session = false });
            }

            DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();
            DalUtilitario dalUtilitario = new DalUtilitario();

            try
            {
                var lstMedicacionSuministrada = JsonConvert.DeserializeObject<List<MedicacionSuministradaAnestesiologia>>(MedicacionSuministrada);
                var lstDiagnosticos = JsonConvert.DeserializeObject<List<Diagnosticos>>(Diagnosticos);
                var lstPatologiaClinica = JsonConvert.DeserializeObject<List<PatologiaClinicaAnestesiologia>>(PatologiaClinica);

                int resp = 0;
                //bool nRptaDiagnosticos = false;
                int nRpta = await dalAnestesiologia.CrearModificarAtencionAnestesiologia(atencionesAnestesiologia, IntervencionQuirurgicaPropuesta);

                if (nRpta != 0)
                {
                    int idUsuario = int.Parse(HttpContext.Session.GetString("idusu"));

                    resp = await dalAnestesiologia.CrearModificarAntecedentesPersonalesAnestesiologia(nRpta, antecedentesPersonales);
                    resp = await dalAnestesiologia.CrearModificarAntecedentesFamiliaresAnestesiologia(nRpta, antecedentesFamiliares);
                    resp = await dalAnestesiologia.CrearModificarAlergiasAnestesiologia(nRpta, alergiasAnestesiologia);
                    resp = await dalAnestesiologia.CrearExamenFisicoAnestesiologia(nRpta, examenFisico);
                    resp = await dalAnestesiologia.CrearResultadosAnestesiologia(nRpta, Hb, Hto, TProt, TTrombiop, Glucosa, Urea, Creatinina, VDRL, HIV, GrupoyRh, Fibrogeno, RxTorax, RectPlaquetas, Rq, OrinaRes, Covid19);

                    resp = await dalAnestesiologia.CrearModificarMedicacionSuministradaAnestesiologia(nRpta, lstMedicacionSuministrada);
                    //resp = await dalAnestesiologia.CrearModificarPatologiaClinicaAnestesiologia(nRpta, lstPatologiaClinica);
                    //nRptaDiagnosticos = await dalUtilitario.insertaDiagnosticos(atencionesAnestesiologia.IdAtencion, (int)Enumerados.TiposDiagnostico.AtencionConsultaExterna, idUsuario, lstDiagnosticos);
                }

                return Json(new { session = true, estado = true, nRpta });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al registrar," + ex.Message + "." });
            }
            
        }

        [HttpPost]
        public async Task<ActionResult> ListarAtencionesAnestesiologia(int idAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();

            try
            {
                DataSet dataSet = await dalAnestesiologia.ListarAtencionesAnestesiologia(idAtencion);

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar, " + ex.Message + "." });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarMedicacionSuministradaAnestesiologia(int idAtencionAnestesiologia)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();

            try
            {
                DataSet dataSet = await dalAnestesiologia.ListarMedicacionSuministradaAnestesiologia(idAtencionAnestesiologia);

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar ListarMedicacionSuministradaAnestesiologia, " + ex.Message + "." });
            }

        }
        [HttpPost]
        public async Task<ActionResult> ListarExamenesAnestesiologiaByCuenta(int idCuentaAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();

            try
            {
                DataSet dataSet = await dalAnestesiologia.ListarExamenesAnestesiologiaByCuenta(idCuentaAtencion);

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar ListarExamenesAnestesiologiaByCuenta, " + ex.Message + "." });
            }

        }

        [HttpPost] // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS
        public async Task<ActionResult> ListarExamenesPatologiaParaAtencionAnestesiologia(int idCuentaAtencion)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();

            try
            {
                DataSet dataSet = await dalAnestesiologia.ListarExamenesPatologiaParaAtencionAnestesiologia(idCuentaAtencion);

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar ListarExamenesPatologiaParaAtencionAnestesiologia, " + ex.Message + "." });
            }

        }

        [HttpPost] // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS
        public async Task<ActionResult> ListarResultadosAnestesiologiaByIdAtencionAnestesiologia(int idAtencionAnestesiologia)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();

            try
            {
                DataSet dataSet = await dalAnestesiologia.ListarResultadosAnestesiologiaByIdAtencionAnestesiologia(idAtencionAnestesiologia);

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar ListarResultadosAnestesiologiaByIdAtencionAnestesiologia, " + ex.Message + "." });
            }

        }

        [HttpPost]
        public async Task<ActionResult> ListarPatologiaClinicaAnestesiologia(int idAtencionAnestesiologia)
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();

            try
            {
                DataSet dataSet = await dalAnestesiologia.ListarPatologiaClinicaAnestesiologia(idAtencionAnestesiologia);

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar ListarPatologiaClinicaAnestesiologia, " + ex.Message + "." });
            }

        }

        [HttpGet]
        public async Task<ActionResult> ListarFactCatalogoServicios()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Json(new { session = false });
            }

            DalAnestesiologia dalAnestesiologia = new DalAnestesiologia();

            try
            {
                DataSet dataSet = await dalAnestesiologia.ListarFactCatalogoServicios();

                return Json(new { session = true, estado = true, dataSet });
            }
            catch (Exception ex)
            {
                return Json(new { session = true, estado = false, mensaje = "Error al listar ListarFactCatalogoServicios, " + ex.Message + "." });
            }

        }

    }
}
