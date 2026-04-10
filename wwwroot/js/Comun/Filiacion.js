var Filiacion = {
    IdSiaSis: '',
    Codigo: '',
    AfiliacionDisa: '',
    AfiliacionTipoFormato: '',
    AfiliacionNroFormato: '',
    AfiliacionNroIntegrante: '',
    DocumentoTipo: '',
    CodigoEstablAdscripcion: '',
    AfiliacionFecha: '',
    Paterno: '',
    Materno: '',
    Pnombre: '',
    Onombres: '',
    Genero: '',
    Fnacimiento: '',
    IdDistritoDomicilio: '',
    Estado: '',
    Fbaja: '',
    DocumentoNumero: '',
    MotivoBaja: '',


    async SeleccionarAfiliacionSis(dni) {        
        let formData = new FormData();

        formData.append("disa", '250')
        formData.append("tipoFormato", '2')
        formData.append("contrato", dni)
        formData.append("tipoTabla", 7)

        Cargando(1)
        return HttpClient.Post('/Sis/ListarAfiliadosSis', formData)
            .then(res => {
                console.log('res', res)
                Cargando(0)
                if (res.estado) {
                    //alerta(1, res.msg)
                    //Cargando(0)
                    //return res.data.body.buscarAseguradosResult
                    let datosAfiliado = res.data.body.buscarAseguradosResult;
                    //let array = datosAfiliado.split('|');
                    let resp = Filiacion.Cargar(datosAfiliado);

                    return resp;

                } else {
                    alerta(3, res.msg)
                    //Cargando(0)
                    return false
                }
            })
            .catch(e => {
                Cargando(0)
                alerta(3, 'Error: ' + e)
            })
    },

    Cargar(datosAfiliado) {
        Filiacion.Limpiar();
        let array = datosAfiliado.split('|');

        if (array[0] != '-1') {

            Filiacion.IdSiaSis = array[0];
            Filiacion.Codigo = array[1];
            Filiacion.AfiliacionDisa = array[2];
            Filiacion.AfiliacionTipoFormato = array[3];
            Filiacion.AfiliacionNroFormato = array[4];
            Filiacion.AfiliacionNroIntegrante = array[5];
            Filiacion.DocumentoTipo = array[6];
            Filiacion.CodigoEstablAdscripcion = array[7];
            Filiacion.AfiliacionFecha = array[8];
            Filiacion.Paterno = array[9];
            Filiacion.Materno = array[10];
            Filiacion.Pnombre = array[11];
            Filiacion.Onombres = array[12]
            Filiacion.Genero = array[13];
            Filiacion.Fnacimiento = array[14];
            Filiacion.IdDistritoDomicilio = array[15];
            Filiacion.Estado = array[16];
            Filiacion.Fbaja = array[17];
            Filiacion.DocumentoNumero = array[18];
            Filiacion.MotivoBaja = array[19];

            return true;

        } else {
            alerta(2, 'El paciente no tiene CODIGO DE ESTABLECIMIENTO DE ADSCRIPCION');
            //$('#cboFuenteFinanciamientoCita').val(0)
            //$('.chzn-select').chosen().trigger("chosen:updated")
            //Cargando(0)
            return false;
        }

    },

    Limpiar() {
        Filiacion.IdSiaSis = '';
        Filiacion.Codigo = '';
        Filiacion.AfiliacionDisa = '';
        Filiacion.AfiliacionTipoFormato = '';
        Filiacion.AfiliacionNroFormato = '';
        Filiacion.AfiliacionNroIntegrante = '';
        Filiacion.DocumentoTipo = '';
        Filiacion.CodigoEstablAdscripcion = '';
        Filiacion.AfiliacionFecha = '';
        Filiacion.Paterno = '';
        Filiacion.Materno = '';
        Filiacion.Pnombre = '';
        Filiacion.Onombres = '';
        Filiacion.Genero = '';
        Filiacion.Fnacimiento = '';
        Filiacion.IdDistritoDomicilio = '';
        Filiacion.Estado = '';
        Filiacion.Fbaja = '';
        Filiacion.DocumentoNumero = '';
        Filiacion.MotivoBaja = '';
    }
}