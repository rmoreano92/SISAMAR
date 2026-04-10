let EstadoCuenta = {

    

    

    
    


    

    


    Init: async function () {

        this.Plugins()

        

        this.DataTableServicios()
        this.DataTableFarmacia()
        this.DataTableConsolidado()
        this.DataTableReembolso()
        this.DataTableFarmaciaDonaciones()
        this.DataTableListaPacientes()
        this.DataTableListaPacientesPreventas()
        this.DataTableListaPacientesExoFarmacia()
        this.DataTableListaPacientesExternos()
        this.DataTableListaPacientesBusqueda()
        this.DataTableListaCuentasPacientesBusqueda()

        this.FuentesFinanciamientoSegunFiltro('UtilizadoEn=1 or UtilizadoEn=3  or UtilizadoEn=2')

        EstadoCuenta.idPagosACuenta = (await Utilitario.SeleccionarParametro(245)).valorTexto
        EstadoCuenta.idDevoluciones = (await Utilitario.SeleccionarParametro(265)).valorTexto

        this.Events()
    }
}



$(document).ready(function () {

    EstadoCuenta.Init()
})

