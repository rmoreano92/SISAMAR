var Brazalete = {
    idPaciente: 0,    
    nroHistoria: 0,
    apellidos: '',
    nombres: '',
    tipoDocumento: '',
    nroDocumento: '',
    fechaNacimiento: '',
    horaNacimiento: '',
    tipoSexo: '',
    gemelar: '',

    async GenerarBrazaletePaciente() {
        Cargando(1);

        var formData = new FormData();
        formData.append('idPaciente', Brazalete.idPaciente);
        formData.append('nroHistoria', Brazalete.nroHistoria);
        formData.append('apellidos', Brazalete.apellidos);
        formData.append('nombres', Brazalete.nombres);
        formData.append('tipoDocumento', Brazalete.tipoDocumento);
        formData.append('nroDocumento', Brazalete.nroDocumento);
        formData.append('fechaNacimiento', Brazalete.fechaNacimiento);
        formData.append('horaNacimiento', Brazalete.horaNacimiento);
        formData.append('tipoSexo', Brazalete.tipoSexo);
        formData.append('gemelar', Brazalete.gemelar);

        var url = "/Paciente/GenerarBrazaletePacienteRecienNacido?area=ConsultaExterna";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);

                    newIframe.src = url;

                    //var a = document.createElement("a");
                    //document.body.appendChild(a);
                    //a.href = url;
                    ////a.download = this.response.name || "CE-" + $.now()
                    //a.download = "Brazalete-" + idPaciente + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    //AbrirVisorDocumentoPersonalizado(url, "Brazalete");
                }
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }
        }
        request.send(formData);
        //Cargando(0);        
    },

    LimpiarBrazalete() {
        Brazalete.idPaciente = 0;    
        Brazalete.nroHistoria = 0,
        Brazalete.apellidos = '';
        Brazalete.nombres = '';
        Brazalete.tipoDocumento = '';
        Brazalete.nroDocumento = '';
        Brazalete.fechaNacimiento = '';
        Brazalete.horaNacimiento = '';
        Brazalete.tipoSexo = '';
        Brazalete.gemelar = '';
    }

}