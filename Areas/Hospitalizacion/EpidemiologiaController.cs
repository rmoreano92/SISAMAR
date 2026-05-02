using Microsoft.AspNetCore.Mvc;
using WebAppMaternidad.Controllers;

namespace WebAppMaternidad.Areas.Hospitalizacion
{
    public class EpidemiologiaController : BaseController
    {
        
        public IActionResult Index()
        {
            return View();
        }
    }
}
