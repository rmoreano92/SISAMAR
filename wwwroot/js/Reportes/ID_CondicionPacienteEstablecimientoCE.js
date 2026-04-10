var FechaDia;
var ID_CondicionPacienteEstablecimientoCE = {


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
    },


    CerrarModal() {
        $('#modalReporte').modal('hide');
    },

    GenerarReporte() {
        var FechaInicio = $("#txtFechaInicio").val();
        var FechaFin = $("#txtFechaFin").val();
        

        var splFecIni = FechaInicio.split("/");
        var splFecFin = FechaFin.split("/");
        FechaInicio = splFecIni[1] + "/" + splFecIni[0] + "/" + splFecIni[2];
        FechaFin = splFecFin[1] + "/" + splFecFin[0] + "/" + splFecFin[2];
        //var url = "/Reportes/rptProduccionEstadisticaObstetras?area=Reportes&FechaInicio=" + FechaInicio + "&FechaFin=" + FechaFin + "&TipoServicio=" + TipoServicio;
        var url = "/Reportes/rptCondicionEstablecimientoPacienteCE?area=Reportes&FechaInicio=" + FechaInicio + "&FechaFin=" + FechaFin;
        window.location.href = url;
    },


}
$(document).ready(function () {
    ID_CondicionPacienteEstablecimientoCE.inicializarComponentes();
});
