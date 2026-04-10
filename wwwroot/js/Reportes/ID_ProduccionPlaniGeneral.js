var FechaDia;
var ID_ProduccionPlaniGeneral = {

    inicializarComponentes() {

        $('#txtFechaInicio').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
        $('#txtFechaFin').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();
        $('#txtFechaInicio').val(FechaDia);
        $('#txtFechaFin').val(FechaDia);
        $("#cboTipoServicio").on('change', function () {
            ID_ProduccionPlaniGeneral.cargarComboServicios();
        });
        $('#cboTipoServicio').val($("#hdnIdTipoServicio").val());
        $("#cboTipoServicio").val(-1);
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });
    },


    listarCombos() {
        $.ajax({
            async: false,
            cache: false,
            url: "/Atencion/ListarServicio?area=ConsultaExterna",
            datatype: "json",
            type: "post",
            success: function (datos) {
                console.log(datos);
                $('#cboServicio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });
    },
    cargarComboServicios() {
        var midata = new FormData();
        midata.append('idTipoServicio', $('#cboTipoServicio').val());
        $.ajax({
            async: false,
            method: "POST",
            url: "/Reportes/ListarServiciosxTipoServicioyIdTipoEspecialidad?area=Reportes",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {

                $('#cboServicio').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                //$(".hide_search").chosen({ disable_search_threshold: 10 });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipo de consultas!", "2");
                }, 900)
            }
        });
    },

    CerrarModal() {
        $('#modalReporte').modal('hide');
    },

    GenerarReporte() {
        //if ($("#cboTipoServicio").val() == -1) {
        //    alerta('2', 'Seleccione el tipo de servicio.');
        //    return false;
        //};
        if ($("#txtFechaInicio").val() == "") {
            alerta('2', 'Debe ingresar la fecha inicio.');
            return false;
        };
        if ($("#txtFechaFin").val() == "") {
            alerta('2', 'Debe ingresar la fecha fin.');
            return false;
        };
        var FechaInicio = $("#txtFechaInicio").val();
        var FechaFin = $("#txtFechaFin").val();
        var idTipoServicio = $("#cboTipoServicio").val();
        var idServicio = $("#cboServicio").val();
        var splFecIni = FechaInicio.split("/");
        var splFecFin = FechaFin.split("/");
        var TipoServicio = $("#cboTipoServicio option:selected").text();
        var Servicio = $("#cboServicio option:selected").text();
        FechaInicio = splFecIni[1] + "/" + splFecIni[0] + "/" + splFecIni[2];
        FechaFin = splFecFin[1] + "/" + splFecFin[0] + "/" + splFecFin[2];
        var url = "/Reportes/rptProduccionEstadisticaGeneral?area=Reportes&FechaInicio=" + FechaInicio + "&FechaFin=" + FechaFin
            + "&idTipoServicio=" + idTipoServicio + "&idServicio=" + idServicio
            + "&TipoServicio=" + TipoServicio + "&Servicio=" + Servicio;
        window.location.href = url;
    },


}
$(document).ready(function () {
    ID_ProduccionPlaniGeneral.inicializarComponentes();
    ID_ProduccionPlaniGeneral.cargarComboServicios();
});
