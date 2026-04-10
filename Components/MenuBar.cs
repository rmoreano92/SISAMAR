using CapaDatos;
using CapaEntidades;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using WebAppMaternidad.ViewModels;
using System.Threading.Tasks;

namespace WebAppMaternidad.Components
{
    public class MenuBar:ViewComponent 
    {
        public MenuBar()
        {
            
        }

        public async Task<IViewComponentResult> InvokeAsync() {
            MenuViewModel menuView = new MenuViewModel();
            try
            {
                int idUser = int.Parse(HttpContext.Session.GetString("idusu"));
                List<Menu> lstMenuPadre = null;

                DalMenu daoMenu = new DalMenu();

                lstMenuPadre = await daoMenu.ObtenerMenuPadre(idUser);
                foreach (Menu menu in lstMenuPadre)
                {
                    menu.Menuhijos = await daoMenu.ObtenerMenuHijos(idUser, menu.IdListGrupo);
                }                
                menuView.lstMenu = lstMenuPadre;
            }
            catch(Exception ex) {
                ViewBag.DescripcionError = ex.Message;
                return View("Login");


            }
            return View(menuView);
        }
    }
}
