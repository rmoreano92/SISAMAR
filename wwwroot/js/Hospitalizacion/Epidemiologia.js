var Epidemiologia = {

    Eventos() {
        $("#btnAgregarFichaEpidemiologica").on('click', function () {
            $("#modalRegistroFichaEpidemiologica").modal("show");
        });
    },

    Iniciar() {
        Epidemiologia.Eventos();
    }
}


$(document).ready(function () {
    Epidemiologia.Iniciar();
});