using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppMaternidad.Models
{
    public class UseSesion:PageModel 
    {
        public bool  ValidarSession()
        {
            return HttpContext.User.Identity.IsAuthenticated;
            
        }
    }
}
