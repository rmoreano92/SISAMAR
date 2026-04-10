let Especialidades = {
    permisoClasiPaciente: '0',

    async CargaInicial() {
        Especialidades.permisoClasiPaciente = await PermisoGeneral.SeleccionarPermisoGeneral("CLASI_PAC")
        if (Especialidades.permisoClasiPaciente == '0') {
            $('#divClasificacionPaciente').hide()
        } else {
            $('#divClasificacionPaciente').show()
        }
    },

    Eventos() {
        $("#cboClasisifcacion").on('change', function () {
            $('#txtControles').val(0);
            $('#txtEdadGestacional').val(0);
            $('#txtGestas').val(0);
            var valorClas = $("#cboClasisifcacion").val()
            Especialidades.Bloqueo(valorClas)
        });
    },

    async TiposClasificacionPaciente() {
        let formData = new FormData()
        return HttpClient.Post('/Atencion/TiposClasificacionPaciente?area=ConsultaExterna', formData)
            .then(res => {
                if (res.lsClasiPac.table.length > 0) {
                    //$('#cboClasisifcacionAnest').empty();
                    $('#cboClasisifcacion').empty();
                    $(res.lsClasiPac.table).each(function (i, obj) {
                        //console.log(obj);
                        //$('#cboClasisifcacionAnest').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                        $('#cboClasisifcacion').append('<option  value="' + obj.id + '" '+ (obj.id==7?'selected':'') +'>' + obj.descripcion + '</option>');
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated")

                } else {
                    alerta(2, 'Error listar clasificacion!')
                }
            })
    },

    Bloqueo: (valorClas) => {
        switch (valorClas) {
            case "1":
                $('#txtControles').attr("disabled", false);
                $('#txtEdadGestacional').attr("disabled", false);
                $('#txtGestas').attr("disabled", false);
                break;
            case "2":
                $('#txtControles').attr("disabled", false);
                $('#txtEdadGestacional').attr("disabled", true);
                $('#txtGestas').attr("disabled", false);
                break;
            case "3":
                $('#txtControles').attr("disabled", false);
                $('#txtEdadGestacional').attr("disabled", true);
                $('#txtGestas').attr("disabled", true);
                break;
            case "4":
                $('#txtControles').attr("disabled", false);
                $('#txtEdadGestacional').attr("disabled", true);
                $('#txtGestas').attr("disabled", false);
                break;
            default:
                $('#txtControles').attr("disabled", true);
                $('#txtEdadGestacional').attr("disabled", true);
                $('#txtGestas').attr("disabled", true);
                break;
            // code block
        }
    },

    async CargarFormData(formData) {
        
        

        //formData.append('fechaIngreso', objrow.fechaIngreso);
        //formData.append('antecedQuirurgico', $('#txtQuirurgicos').val());
        //formData.append('antecedPatologico', $('#txtPatologicos').val());
        //formData.append('antecedObstetrico', $('#txtObstetricos').val());
        //formData.append('antecedAlergico', $('#txtAlergias').val());
        //formData.append('antecedFamiliar', $('#txtFamiliares').val());
        //formData.append('antecedentes', $('#txtOtros').val());

        /////////////////ATENCION DATOS ADICIONALES////////////////////////////////
        formData.append("Apetito", $("#txtApetito").val());
        formData.append("Suenio", $("#txtSuenio").val());
        formData.append("Sed", $("#txtSed").val());
        formData.append("Orina", $("#txtOrina").val());
        formData.append("Deposiciones", $("#txtDiposiciones").val());

        //////////////////ATENCION TRIAJE//////////////////////////////////
        formData.append('CitaMotivo', $('#txtMotivoCons').val());
        formData.append('CitaExamenClinico', $('#txtExamenC').val());

        return formData;
    },


    async Iniciar() {
        Especialidades.CargaInicial();
        Especialidades.Eventos();
        await Especialidades.TiposClasificacionPaciente();

    }
}