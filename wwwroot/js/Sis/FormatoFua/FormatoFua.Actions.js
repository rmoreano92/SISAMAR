import * as API from "./FormatoFua.Api.js"
import Helpers from "../../Helpers.js";

export class FormatoFuaActions {

    constructor(ctx) {
        this.ctx = ctx
    }


    async ListarAtencionesFua() {
        let filtro = ''

        if (
            $("#txtNroCuentaBuscar").val() == "" && $("#txtNroDniBuscar").val() == "" &&
            $("#txtNroHistoriaBuscar").val() == "" && $("#txtApPaternoBuscar").val() == "" &&
            $("#txtApMaternoBuscar").val() == ""
        ) {
            alerta("2", "Ingrese almenos un campo para la busqueda.");
            return false;
        }

        if ($("#txtNroCuentaBuscar").val() != "") {
            filtro =
                filtro +
                " AND ate.IdCuentaAtencion = " +
                $("#txtNroCuentaBuscar").val();
        }
        if ($("#txtNroDniBuscar").val() != "") {
            filtro =
                filtro +
                " AND pac.NroDocumento = '" +
                $("#txtNroDniBuscar").val() +
                "'";
        }
        if ($("#txtNroHistoriaBuscar").val() != "") {
            filtro =
                filtro +
                " AND pac.NroHistoriaClinica = '" +
                $("#txtNroHistoriaBuscar").val() +
                "'";
        }
        if ($("#txtApPaternoBuscar").val() != "") {
            filtro =
                filtro +
                " AND pac.ApellidoPaterno LIKE '" +
                $("#txtApPaternoBuscar").val() +
                "%'";
        }
        if ($("#txtApMaternoBuscar").val() != "") {
            filtro =
                filtro +
                " AND pac.ApellidoMaterno LIKE '" +
                $("#txtApMaternoBuscar").val() +
                "%'";
        }

        let listaAtenciones = await API.ListarAtenciones(filtro)

        this.ctx.oTable_atenciones.fnClearTable();

        if (listaAtenciones.length > 0) {
            this.ctx.oTable_atenciones.fnAddData(listaAtenciones);
        }
    }

    async AbrirFormularioFormatoFua() {
        var objrowTb = this.ctx.oTable_atenciones.api(true).row(".selected").data();

        if (isEmpty(objrowTb)) {
            alerta(2, "Seleccione una atención por favor.");
            return false;
        }

        await this.CargarDatosAtencion(objrowTb.idCuentaAtencion)
        MostrarAreaRegistro()
    }

    async BuscarInstitucionesEducativas() {
        let codigo = $("#txtCodigoInstitucionEducativaBuscar").val();
        let nombre = $("#txtNombreInstitucionEducativaBuscar").val();

        Cargando(1)

        let instituciones = await API.ListarInstitucionEducativa(codigo, nombre);

        this.ctx.oTable_TableListaInstitucionesEducativas.fnClearTable();

        if (isEmpty(instituciones)) {
            alerta(2, "Error al listar las fuentes de financiamiento");
            return;
        }

        if (instituciones.length > 0) {
            this.ctx.oTable_TableListaInstitucionesEducativas.fnAddData(instituciones);
        }

        Cargando(0)
    }







    async CargarDatosAtencion(IdCuentaAtencion) {
        let sisFuaAtencion = await API.SeleccionarSisFuaAtencion(IdCuentaAtencion)

        $("#cboComponenteRegimen").val(sisFuaAtencion.fuaComponente);
        $("#txtDisaFormatoAsegurado").val(sisFuaAtencion.afiliacionDisa);
        $("#txtTipoFormatoAsegurado").val(sisFuaAtencion.afiliacionTipoFormato);
        $("#txtNroFormatoAsegurado").val(sisFuaAtencion.afiliacionNroFormato);
        $("#txtNroHistoriaClinica").val(sisFuaAtencion.fuaNrohistoria);
        $("#cboTipoDocumentoPaciente").val(sisFuaAtencion.documentoTipo);
        $("#txtNroDocumentoPaciente").val(sisFuaAtencion.documentoNumero);
        $("#txtApellidosNombresPaciente").val(sisFuaAtencion.apellidosNombresPaciente);
        $("#txtFechaNacimientoPaciente").datepicker("setDate", FormatearFecha(sisFuaAtencion.fnacimiento));
        $("#txtEdadPaciente").val(sisFuaAtencion.edad);
        $("#cboSexoPaciente").val(sisFuaAtencion.genero);
        $("#cboEtniaPaciente").val(sisFuaAtencion.fuaetnia);
        // $("#cboAseguradoOtrasIafas").val(sisFuaAtencion.peso);
        // $("#txtCodigoAseguradoOtraIafa").val(sisFuaAtencion.peso);
        $("#cboSaludMaterna").val(sisFuaAtencion.fuaCondicionMaterna);
        $("#txtFechaParto").datepicker("setDate", FormatearFecha(sisFuaAtencion.fuaFechaParto));
        $("#txtNroAutorizacion").val(sisFuaAtencion.fuaCodAutorizacion);
        $("#txtMonto").val(sisFuaAtencion.fuaConceptoPrMonto);
        // $("#txtCodigoAcreditacion").val(sisFuaAtencion.peso);

        $('.chzn-select').chosen().trigger("chosen:updated")
    }







    async CargarComboGradosInstitucionEducativa() {
        let idNivel = $('#cboNivelInstitucionEducativa').val()

        let grados = await API.Listar_m_IIEE_Grado(idNivel)

        $("#cboGradoInstitucionEducativa").empty();
        $(grados).each(function (i, obj) {
            $("#cboGradoInstitucionEducativa").append(
                `<option value="${obj.idGrado}">${obj.grado}</option>`
            );
        });
        $("#cboGradoInstitucionEducativa").val(0);
        $(".chzn-select").chosen().trigger("chosen:updated");
    }

    ResaltarFilaTablaAtencion(element) {
        Helpers.toggleRowSelection(this.ctx.oTable_atenciones, element)
    }
    ResaltarFilaTablaInstitucionEducativa(element) {
        Helpers.toggleRowSelection(this.ctx.oTable_TableListaInstitucionesEducativas, element)
    }
    async SeleccionarInstitucionEducativa(element) {

        let objRow = Helpers.toggleRowSelectionReturnData(this.ctx.oTable_TableListaInstitucionesEducativas, element)

        if (isEmpty(objRow)) {
            alerta(2, "Debe seleccionar un registro.")
            return
        }

        this.ctx.IdInstitucionEducativa = objRow.idInstitucionEducativa
        $("#txtCodigoInstitucionEducativa").val(objRow.codigo)
        $("#txtDescripcionInstitucionEducativa").val(objRow.nombre)

        $("#modalInstitucionEducativa").modal("hide");
    }
}