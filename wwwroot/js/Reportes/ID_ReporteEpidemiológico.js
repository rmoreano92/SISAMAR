var FechaDia;
var ID_ReporteEpidemiológico = {


    inicializarComponentes() {
        
        $('#txtFechaIni').datepicker({
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
        $('#txtFechaIni').val(FechaDia);
        $('#txtFechaFin').val(FechaDia);

        $('#txtHoraInicio').val('00:00');
        $('#txtHoraFin').val('00:00');
    },




    CerrarModal() {
        $('#modalReporte').modal('hide');
    },

    GenerarReporte() {

        var FechaIni = $("#txtFechaIni").val();
        var FechaFin = $("#txtFechaFin").val();

        var HoraIni = $("#txtHoraInicio").val();
        var HoraFin = $("#txtHoraFin").val();

        if (isEmpty(FechaIni)) {
            alerta2('info', '', 'Ingrese la fecha de inicio.');
            return;
        }

        if (isEmpty(FechaFin)) {
            alerta2('info', '', 'Ingrese la fecha de fin.');
            return;
        }

        if (isEmpty(HoraIni)) {
            alerta2('info', '', 'Ingrese la hora de inicio.');
            return;
        }

        if (isEmpty(HoraFin)) {
            alerta2('info', '', 'Ingrese la hora de fin.');
            return;
        }
     
     

        var splFecIni = FechaIni.split("/");
        FechaIni = splFecIni[1] + "/" + splFecIni[0] + "/" + splFecIni[2];

        var splFecFin = FechaFin.split("/");
        FechaFin = splFecFin[1] + "/" + splFecFin[0] + "/" + splFecFin[2];

        var url = "/Reportes/Epidemiologico?area=Reportes&HoraFin=" + HoraFin + "&HoraIni=" + HoraIni + "&FechaInicio=" + FechaIni+"&FechaFin=" + FechaFin;
        window.location.href = url;
    },

  

}
$(document).ready(function () {
    ID_ReporteEpidemiológico.inicializarComponentes();
 

});
