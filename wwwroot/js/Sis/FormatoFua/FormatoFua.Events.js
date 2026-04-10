export class FormatoFuaEvents {
    constructor(ctx) {
        this.ctx = ctx
    }

    async bindAll() {
        //////////////////////////////////// EVENTS BUTTONS ////////////////////////////////////
        $("#btnModalInstitucionEducativa").on("click", function () {
            $("#modalInstitucionEducativa").modal("show");
        });
        $("#btnCerrarModalInstitucionesEducativas").on("click", function () {
            $("#modalInstitucionEducativa").modal("hide");
        });
        $("#btnBuscarAtenciones").on("click", async () => {
            //$('#lblMedicoProgramado').html('');
            const atenciones = await this.ctx.actions.ListarAtencionesFua();

            $("html, body").animate(
                {
                    scrollTop: $(".head").offset().top,
                },
                1000
            );
        });
        $("#btnModificar").on("click", async () => {
           this.ctx.actions.AbrirFormularioFormatoFua()
        });
        $("#btnBuscarInstitucionEducativa").on("click", async () => {
            await this.ctx.actions.BuscarInstitucionesEducativas()
        });
        $("#btnLimpiarBusquedaInstitucionEducativa").on("click", async function () {
            $("#txtCodigoInstitucionEducativaBuscar").val('');
            $("#txtNombreInstitucionEducativaBuscar").val('');
            oTable_TableListaInstitucionesEducativas.fnClearTable()
        });
        //////////////////////////////////// EVENTS BUTTONS ////////////////////////////////////


        //////////////////////////////////// EVENTS TABLES ////////////////////////////////////
        $("#tblAtencion tbody").on("click", "tr", async (e) => {
            await this.ctx.actions.ResaltarFilaTablaAtencion($(e.currentTarget))
        });
        $('#tblListaInstitucionesEducativas').on("click", "tr", async (e) => {
            await this.ctx.actions.ResaltarFilaTablaInstitucionEducativa($(e.currentTarget))
        })
        $('#tblListaInstitucionesEducativas').on("dblclick", "tr", async (e) => {
            await this.ctx.actions.SeleccionarInstitucionEducativa($(e.currentTarget))
        })
        //////////////////////////////////// EVENTS TABLES ////////////////////////////////////


         /////////////////////////////////// EVENTS SELECT ///////////////////////////////////
        $("#cboNivelInstitucionEducativa").on("change", async () => {
            await this.ctx.actions.CargarComboGradosInstitucionEducativa();
        });
        /////////////////////////////////// EVENTS SELECT ///////////////////////////////////
    }
}