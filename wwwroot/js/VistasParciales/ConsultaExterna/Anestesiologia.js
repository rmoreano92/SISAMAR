let Anestesiologia = {
    permisoClasiPaciente: '0',

    async CargaInicial() {
        Anestesiologia.permisoClasiPaciente = await PermisoGeneral.SeleccionarPermisoGeneral("CLASI_PAC")
        if (Anestesiologia.permisoClasiPaciente == '0') {
            $('#divClasificacionPaciente').hide()
        } else {
            $('#divClasificacionPaciente').show()
        }
    },
    Plugins: () => {
        $(".hide_search").chosen({ disable_search_threshold: 10 })
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' })
        $(".chzn-select-deselect,#select2_sample").chosen()
    },
    CargaDatosPorDefecto: () => {

        $('#txtHbAnest').val()
        $('#txtHtoAnest').val()
        $('#txtTprotAnest').val()
        $('#txtTrombiopAnest').val()
        $('#txtGlucosaResAnest').val()
        $('#txtUreaResAnest').val()
        $('#txtCreatininaResAnest').val()
        $('#txtVdrlAnest').val()
        $('#txtHivResAnest').val()
        $('#txtGrupoRhResAnest').val()
        $('#txtFibrogenoAnest').val()
        $('#txtRxToraxResAnest').val()
        $('#txtRecPlaquetasAnest').val()
        $('#txtRqAnest').val()
        $('#txtOrinaResAnest').val()
        $('#txtCovidResAnest').val()

        $('#txtOtroSintomasAnest').attr('disabled', true)

        // Antecedentes Personales
        $('#rdbDiabNoAnest').attr('checked', true)
        $('#rdbTbcNoAnest').attr('checked', true)
        $('#rdbAsmaNoAnest').attr('checked', true)
        $('#rdbHiperNoAnest').attr('checked', true)
        $('#rdbPTiroNoAnest').attr('checked', true)
        $('#rdbCiruNoAnest').attr('checked', true)
        $('#rdbAlcoholNoAnest').attr('checked', true)
        $('#rdbTabacoNoAnest').attr('checked', true)
        $('#rdbDrogasNoAnest').attr('checked', true)
        $('#rdbTransNoAnest').attr('checked', true)
        $('#rdbAnestPrevNoAnest').attr('checked', true)
        $('#rdbHemorragiaNoAnest').attr('checked', true)
        $('#rdbOtrosNoAnest').attr('checked', true)

        $('#txtDiabeAnest').attr('disabled', true)
        $('#txtTbcAnest').attr('disabled', true)
        $('#txtAsmaAnest').attr('disabled', true)
        $('#txtHiperPAnest').attr('disabled', true)
        $('#txtPTiroAnest').attr('disabled', true)
        $('#txtCiruAnest').attr('disabled', true)
        $('#txtAlcoholAnest').attr('disabled', true)
        $('#txtTabacoAnest').attr('disabled', true)
        $('#txtDrogasAnest').attr('disabled', true)
        $('#txtTransAnest').attr('disabled', true)
        $('#txtAnestPrevAnest').attr('disabled', true)
        $('#txtHemorragiaAnest').attr('disabled', true)
        $('#txtOtrosAnest').attr('disabled', true)
        // Antecedentes Personales

        // Antecedentes Familiares
        $('#rdbDiabNoFamAnest').attr('checked', true)
        $('#rdbTbcNoFamAnest').attr('checked', true)
        $('#rdbAsmaNoFamAnest').attr('checked', true)
        $('#rdbHiperNoFamAnest').attr('checked', true)
        $('#rdbOtrosNoFamAnest').attr('checked', true)
        $('#rdbAnestesiasNoFamAnest').attr('checked', true)

        $('#txtDiabFamAntest').attr('disabled', true)
        $('#txtTbcFamAnest').attr('disabled', true)
        $('#txtAsmaFamAnest').attr('disabled', true)
        $('#txtHiperFamAnest').attr('disabled', true)
        $('#txtOtrosFamAnest').attr('disabled', true)
        $('#txtAnestesiasFamAnest').attr('disabled', true)
        // Antecedentes Familiares

        // Alergias
        $('#rdbFarmaNoAlerAnest').attr('checked', true)
        $('#rdbAlimenNoAlerAnest').attr('checked', true)
        $('#rdbEosinoNoAlerAnest').attr('checked', true)
        $('#rdbBroncoNoAlerAnest').attr('checked', true)
        $('#rdbOtrosNoAlerAnest').attr('checked', true)

        $('#txtFarmaAlerAnest').attr('disabled', true)
        $('#txtAlimenAlerAnest').attr('disabled', true)
        $('#txtEosinoAlerAnest').attr('disabled', true)
        $('#txtBroncoAlerAnest').attr('disabled', true)
        $('#txtOtrosAlerAnest').attr('disabled', true)
        // Alergias
    },

    TiposClasificacionPaciente: () => {
        let formData = new FormData()
        return HttpClient.Post('/Atencion/TiposClasificacionPaciente?area=ConsultaExterna', formData)
            .then(res => {
                if (res.lsClasiPac.table.length > 0) {
                    //$('#cboClasisifcacionAnest').empty();
                    $('#cboClasisifcacion').empty();
                    $(res.lsClasiPac.table).each(function (i, obj) {
                        console.log()
                        //$('#cboClasisifcacionAnest').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                        $('#cboClasisifcacion').append('<option  value="' + obj.id + '" '+ (obj.id==7?'selected':'') +'>' + obj.descripcion + '</option>');
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated")

                } else {
                    alerta(2, 'Error listar clasificacion!')
                }
            })
    },

    ListarAtencionesAnestesiologia: (idAtencion) => {
        let formData = new FormData()

        formData.append('idAtencion', idAtencion)

        Cargando(1)
        return HttpClient.Post('/Anestesiologia/ListarAtencionesAnestesiologia?area=ConsultaExterna', formData)
            .then((res) => {
                if (res.estado) {
                    return res.dataSet.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },
    ListarMedicacionSuministradaAnestesiologia: (idAtencionAnestesiologia) => {
        let formData = new FormData()

        formData.append('idAtencionAnestesiologia', idAtencionAnestesiologia)

        Cargando(1)
        oTable_medicacionSuministrada.fnClearTable()
        HttpClient.Post('/Anestesiologia/ListarMedicacionSuministradaAnestesiologia?area=ConsultaExterna', formData)
            .then((res) => {
                if (res.estado) {
                    if (res.dataSet.table.length > 0) {
                        console.log('res.dataSet.table.length', res.dataSet.table.length)
                        oTable_medicacionSuministrada.fnAddData(res.dataSet.table)
                    }
                } else {
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },
    ListarExamenesAnestesiologiaByCuenta: (idCuentaAtencion) => {
        let formData = new FormData()

        formData.append('idCuentaAtencion', idCuentaAtencion)

        Cargando(1)
        oTable_patologiaClinica.fnClearTable()
        HttpClient.Post('/Anestesiologia/ListarExamenesAnestesiologiaByCuenta?area=ConsultaExterna', formData)
            .then((res) => {
                if (res.estado) {
                    if (res.dataSet.table.length > 0) {
                        oTable_patologiaClinica.fnAddData(res.dataSet.table)
                    }
                } else {
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },
    ListarExamenesPatologiaParaAtencionAnestesiologia: async (idAtencion, idCuentaAtencion) => { // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS

        let atencionAnestesiologia = await Anestesiologia.ListarAtencionesAnestesiologia(idAtencion)

        if (atencionAnestesiologia.length > 0) {
            let resultadosAnest = await Anestesiologia.ListarResultadosAnestesiologiaByIdAtencionAnestesiologia(atencionAnestesiologia[0].idAtencionAnestesiologia)

            if (resultadosAnest.length > 0) {
                console.log("con resulados")
                Anestesiologia.CompletarResultadosAnestesioCargados(resultadosAnest[0])
            } else {
                console.log("sin resulados")
                let formData = new FormData()

                formData.append('idCuentaAtencion', idCuentaAtencion)

                Cargando(1)
                //oTable_patologiaClinica.fnClearTable()
                HttpClient.Post('/Anestesiologia/ListarExamenesPatologiaParaAtencionAnestesiologia?area=ConsultaExterna', formData)
                    .then((res) => {
                        if (res.estado) {
                            Anestesiologia.CompletarResultadosAnestesioPorDefecto(res.dataSet.table)
                        } else {
                            alerta(3, res.mensaje)
                        }
                    })
                    .catch((e) => {
                        if (e) throw alerta(2, e)
                    })
                    .finally(() => {
                        Cargando(0)
                    })
            }
        } else {
            console.log("No es anestesio")
            let formData = new FormData()

            formData.append('idCuentaAtencion', idCuentaAtencion)

            Cargando(1)
            oTable_patologiaClinica.fnClearTable()
            HttpClient.Post('/Anestesiologia/ListarExamenesPatologiaParaAtencionAnestesiologia?area=ConsultaExterna', formData)
                .then((res) => {
                    if (res.estado) {
                        Anestesiologia.CompletarResultadosAnestesioPorDefecto(res.dataSet.table)
                    } else {
                        alerta(3, res.mensaje)
                    }
                })
                .catch((e) => {
                    if (e) throw alerta(2, e)
                })
                .finally(() => {
                    Cargando(0)
                })
        }

    },
    ListarResultadosAnestesiologiaByIdAtencionAnestesiologia: (idAtencionAnestesiologia) => {
        let formData = new FormData()

        formData.append('idAtencionAnestesiologia', idAtencionAnestesiologia)

        Cargando(1)
        return HttpClient.Post('/Anestesiologia/ListarResultadosAnestesiologiaByIdAtencionAnestesiologia?area=ConsultaExterna', formData)
            .then((res) => {
                if (res.estado) {
                    return res.dataSet.table
                } else {
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },
    ListarPatologiaClinicaAnestesiologia: (idAtencionAnestesiologia) => {
        let formData = new FormData()

        formData.append('idAtencionAnestesiologia', idAtencionAnestesiologia)

        Cargando(1)
        HttpClient.Post('/Anestesiologia/ListarPatologiaClinicaAnestesiologia?area=ConsultaExterna', formData)
            .then((res) => {
                if (res.estado) {
                    if (res.dataSet.table.length > 0) {

                        let examenesAsignados = res.dataSet.table

                        $(res.dataSet.table).each((index) => {

                            $(oTable_patologiaClinica.children()[1].children).each((e) => {
                                let pos = $(oTable_patologiaClinica.children()[1].children[e].children[3].children[0]).attr('row')
                                let patologia = oTable_patologiaClinica.fnGetData(pos)
                                if (patologia.idProducto == examenesAsignados[index].idProducto) {
                                    oTable_patologiaClinica.children()[1].children[e].children[3].children[0].checked = true
                                }
                            })

                        })

                    }
                } else {
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })
    },
    ListarFactCatalogoServicios: () => {

        HttpClient.Get('/Anestesiologia/ListarFactCatalogoServicios?area=ConsultaExterna')
            .then((res) => {
                if (res.estado) {
                    if (res.dataSet.table.length > 0) {

                        $('#cboOperacionAnest').empty()
                        $(res.dataSet.table).each(function (i, obj) {
                            $('#cboOperacionAnest').append('<option  value="' + obj.idProducto + '">' + obj.nombre + '</option>')
                        })
                        //$(".hide_search").chosen({ disable_search_threshold: 10 });
                        $('.chzn-select').chosen().trigger("chosen:updated")
                    }
                } else {
                    alerta(3, res.mensaje)
                }
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
    },


    GuardarAtencionAnestesiologia: () => {
        let objRowAtenciones = oTable_atenciones.api(true).row('.selected').data();

        let lstMedicacionSuministrada = oTable_medicacionSuministrada.api(true).rows().data()
        let lstDiagnosticos = Diagnosticos.DevolverDiagnosticos()

        let lstPatologiaClinica = []

        //let tablePatologia = $('#tblPatologiaClinicaAnest').DataTable();

        //if (tablePatologia.data().any()) {
        //    $(oTable_patologiaClinica.children()[1].children).each((e) => {
        //        if (oTable_patologiaClinica.children()[1].children[e].children[3].children[0].checked) {
        //            let pos = $(oTable_patologiaClinica.children()[1].children[e].children[3].children[0]).attr('row')
        //            lstPatologiaClinica.push(oTable_patologiaClinica.fnGetData(pos))
        //        }
        //    })
        //} else {
        //    console.log('La tabla esta vacia')
        //}

        //console.log('lstDiagnosticos', JSON.stringify(lstDiagnosticos.toArray()))
        //console.log('lstPatologiaClinica', JSON.stringify(lstPatologiaClinica))

        let formData = new FormData()

        formData.append('IdAtencionAnestesiologia', 0)
        formData.append('IdAtencion', objRowAtenciones.idAtencion)
        
        formData.append('ClasificacionPaciente', $('#cboClasisifcacion').val())
        formData.append('Controles', $('#txtControles').val())
        formData.append('EdadGestacional', $('#txtEdadGestacional').val())
        formData.append('NroGestas', $('#txtGestas').val())

        formData.append('IntervencionQuirurgicaPropuesta', $('#txtIntervencionQuirurgicaPropuesta').val())
        formData.append('EnfermedadActual', $('#txtEnfermedadActualAnest').val())
        formData.append('TiempoEnfermedad', $('#txtTiempoEnfermedadAnest').val())
        formData.append('Relato', $('#txtRelatoAnest').val())
        formData.append('Disnea', $('#chkDisneaAnest').is(':checked') ? 1 : 0)
        formData.append('Ortopnea', $('#chkOrtopneaAnest').is(':checked') ? 1 : 0)
        formData.append('Convulsiones', $('#chkConvulsionesAnest').is(':checked') ? 1 : 0)
        formData.append('Fotopsias', $('#chkFotopsiasAnest').is(':checked') ? 1 : 0)
        formData.append('Cianosis', $('#chkCianosisAnest').is(':checked') ? 1 : 0)
        formData.append('Cefalea', $('#chkCefaleaAnest').is(':checked') ? 1 : 0)
        formData.append('Hemorragias', $('#chkHemorragiasAnest').is(':checked') ? 1 : 0)
        formData.append('Fiebre', $('#chkFiebreAnest').is(':checked') ? 1 : 0)
        formData.append('Dolor', $('#chkDolorAnest').is(':checked') ? 1 : 0)
        formData.append('Nausea_Vomito', $('#chkVomitosAnest').is(':checked') ? 1 : 0)
        formData.append('Otros', $('#chkOtrosAnest').is(':checked') ? 1 : 0)
        formData.append('Ninguno', $('#chkNingunoAnest').is(':checked') ? 1 : 0)
        formData.append('DescripcionOtros', $('#txtOtroSintomasAnest').val())
        formData.append('Apetito', $('#txtApetitoAnest').val())
        formData.append('Sed', $('#txtSedAnest').val())
        formData.append('Orina', $('#txtOrinaAnest').val())
        formData.append('Deposiciones', $('#txtDiposicionesAnest').val())
        formData.append('Suenio', $('#txtSuenioAnest').val())
        formData.append('MedicacionSuministrada', JSON.stringify(lstMedicacionSuministrada.toArray()))
        formData.append('RXToraxResumen', $('#txtRxToraxAnest').val())
        formData.append('RiesgoQuirurgico', $('#txtQuirurgicoAnest').val())
        formData.append('Operacion', $('#cboOperacionAnest').val())
        formData.append('ClasificacionASA', $('#cboClasificacionASA').val())
        formData.append('Conclusion', $('#txtConclusionAnest').val())
        formData.append('TipoAnestesiaPrevista', $('#txtTipoAnestesiaAnest').val())
        formData.append('TipoEvaluacionAnestesia', $('#cboTipoEvaluacionAnest').val())
        formData.append('Diagnosticos', JSON.stringify(lstDiagnosticos.toArray()))
        formData.append('PatologiaClinica', JSON.stringify(lstPatologiaClinica))

        formData.append('DiabetesP', $('#rdbDiabSiAnest').is(':checked') ? 1 : 0)
        formData.append('DiabetesDescP', $('#txtDiabeAnest').val())
        formData.append('TBCP', $('#rdbTbcSiAnest').is(':checked') ? 1 : 0)
        formData.append('TBCDescP', $('#txtTbcAnest').val())
        formData.append('AsmaP', $('#rdbAsmaSiAnest').is(':checked') ? 1 : 0)
        formData.append('AsmaDescP', $('#txtAsmaAnest').val())
        formData.append('HipertensionP', $('#rdbHiperSiAnest').is(':checked') ? 1 : 0)
        formData.append('HipertensionDescP', $('#txtHiperPAnest').val())
        formData.append('PatologiaTiroideaP', $('#rdbPTiroSiAnest').is(':checked') ? 1 : 0)
        formData.append('PatologiaTiroideaDescP', $('#txtPTiroAnest').val())
        formData.append('CirugiaPreviaP', $('#rdbCiruSiAnest').is(':checked') ? 1 : 0)
        formData.append('CirugiaPreviaDescP', $('#txtCiruAnest').val())
        formData.append('AlcoholP', $('#rdbAlcoholSiAnest').is(':checked') ? 1 : 0)
        formData.append('AlcoholDescP', $('#txtAlcoholAnest').val())
        formData.append('TabacoP', $('#rdbTabacoSiAnest').is(':checked') ? 1 : 0)
        formData.append('TabacoDescP', $('#txtTabacoAnest').val())
        formData.append('DrogasP', $('#rdbDrogasSiAnest').is(':checked') ? 1 : 0)
        formData.append('DrogasDescP', $('#txtDrogasAnest').val())
        formData.append('TransfusionesP', $('#rdbTransSiAnest').is(':checked') ? 1 : 0)
        formData.append('TransfusionesDescP', $('#txtTransAnest').val())
        formData.append('AnestesiasPreviasP', $('#rdbAnestPrevSiAnest').is(':checked') ? 1 : 0)
        formData.append('AnestesiasPreviasDescP', $('#txtAnestPrevAnest').val())
        formData.append('TendenciaHemorragiasP', $('#rdbHemorragiaSiAnest').is(':checked') ? 1 : 0)
        formData.append('TendenciaHemorragiasDescP', $('#txtHemorragiaAnest').val())
        formData.append('OtrosP', $('#rdbOtrosSiAnest').is(':checked') ? 1 : 0)
        formData.append('OtrosDescP', $('#txtOtrosAnest').val())

        formData.append('DiabetesF', $('#rdbDiabSiFamAnest').is(':checked') ? 1 : 0)
        formData.append('DiabetesDescF', $('#txtDiabFamAntest').val())
        formData.append('TBCF', $('#rdbTbcSiFamAnest').is(':checked') ? 1 : 0)
        formData.append('TBCDescF', $('#txtTbcFamAnest').val())
        formData.append('AsmaF', $('#rdbAsmaSiFamAnest').is(':checked') ? 1 : 0)
        formData.append('AsmaDescF', $('#txtAsmaFamAnest').val())
        formData.append('HipertensionF', $('#rdbHiperSiFamAnest').is(':checked') ? 1 : 0)
        formData.append('HipertensionDescF', $('#txtHiperFamAnest').val())
        formData.append('OtrosF', $('#rdbOtrosSiFamAnest').is(':checked') ? 1 : 0)
        formData.append('OtrosDescF', $('#txtOtrosFamAnest').val())
        formData.append('AnestesiasFamiliaresF', $('#rdbAnestesiasSiFamAnest').is(':checked') ? 1 : 0)
        formData.append('AnestesiasFamiliaresDescF', $('#txtAnestesiasFamAnest').val())

        formData.append('Farmacologicas', $('#rdbFarmaSiAlerAnest').is(':checked') ? 1 : 0)
        formData.append('FarmacologicasDesc', $('#txtFarmaAlerAnest').val())
        formData.append('Alimentacion', $('#rdbAlimenSiAlerAnest').is(':checked') ? 1 : 0)
        formData.append('AlimentacionDesc', $('#txtAlimenAlerAnest').val())
        formData.append('Eosinofilia', $('#rdbEosinoSiAlerAnest').is(':checked') ? 1 : 0)
        formData.append('EosinofiliaDesc', $('#txtEosinoAlerAnest').val())
        formData.append('Broncoespasmos', $('#rdbBroncoSiAlerAnest').is(':checked') ? 1 : 0)
        formData.append('BroncoespasmosDesc', $('#txtBroncoAlerAnest').val())
        formData.append('Otros', $('#rdbOtrosSiAlerAnest').is(':checked') ? 1 : 0)
        formData.append('OtrosDesc', $('#txtOtrosAlerAnest').val())
        formData.append('SignosSintomas', $('#txtSignosAlerAnest').val())
        formData.append('Shock', $('#txtShockAlerAnest').val())
        formData.append('RASH', $('#txtRashAlerAnest').val())
        formData.append('Edema', $('#txtEdemaAlerAnest').val())
        formData.append('Glotis', $('#txtGlotisAlerAnest').val())
        formData.append('Prurito', $('#txtPruritoAlerAnest').val())
        formData.append('Observacion', $('#txtObservacionAlerAnest').val())

        formData.append('EstadoGeneralSensorio', $('#rdbGeneralSiExaAnest').is(':checked') ? 1 : $('#rdbGeneralNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('EstadoGeneralSensorioDesc', $('#txtEstadoGeneralSensorioExaAnest').val())
        formData.append('EstadoGeneralSensorioEdemas', $('#txtEstadoGeneralSensorioEdemasExaAnest').val())
        formData.append('Cardiovascular', $('#rdbCardioSiExaAnest').is(':checked') ? 1 : $('#rdbCardioNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('CardiovascularDesc', $('#txtCardioVascularExaAnest').val())
        formData.append('CardiovascularEdemas', $('#txtCardioVascularReflejosExaAnest').val())
        formData.append('Abdomen', $('#rdbAbdomenSiExaAnest').is(':checked') ? 1 : $('#rdbAbdomenNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('AbdomenDesc', $('#txtAbdomenExaAnest').val())
        formData.append('Piel', $('#rdbPielSiExaAnest').is(':checked') ? 1 : $('#rdbPielNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('PielDesc', $('#txtPielExaAnest').val())
        formData.append('Ojos', $('#rdbOjosSiExaAnest').is(':checked') ? 1 : $('#rdbOjosNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('OjosDesc', $('#txtOjosExaAnest').val())
        formData.append('MovCervical', $('#rdbCervicalSiExaAnest').is(':checked') ? 1 : $('#rdbCervicalNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('MovCervicalDesc', $('#txtCervicalExaAnest').val())
        formData.append('Neurologico', $('#rdbNeurologicoSiExaAnest').is(':checked') ? 1 : $('#rdbNeurologicoNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('NeurologicoDesc', $('#txtNeurologicoExaAnest').val())
        formData.append('ColumnaVertebral', $('#rdbColumnaSiExaAnest').is(':checked') ? 1 : $('#rdbColumnaNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('ColumnaVertebralDesc', $('#txtColumnaExaAnest').val())
        formData.append('EstadoGeneral', $('#rdbEstaGeneSiExaAnest').is(':checked') ? 1 : $('#rdbEstaGeneNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('EstadoGeneralDesc', $('#txtEstaGeneExaAnest').val())
        formData.append('EstadoNutricional', $('#rdbEstaNutriSiExaAnest').is(':checked') ? 1 : $('#rdbEstaNutriNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('EstadoNutricionalDesc', $('#txtEstaNutriExaAnest').val())
        formData.append('Venas', $('#rdbVenasSiExaAnest').is(':checked') ? 1 : $('#rdbVenasNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('VenasDesc', $('#txtVenasExaAnest').val())
        formData.append('ViasAereas', $('#rdbViasAereasSiExaAnest').is(':checked') ? 1 : $('#rdbViasAereasNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('ViasAereasDesc', $('#txtViasAereasExaAnest').val())
        formData.append('Dentadura', $('#rdbDentaduraSiExaAnest').is(':checked') ? 1 : $('#rdbDentaduraNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('DentaduraDesc', $('#txtDentaduraExaAnest').val())
        formData.append('Traquea', $('#rdbTraqueaSiExaAnest').is(':checked') ? 1 : $('#rdbTraqueaNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('TraqueaDesc', $('#txtTraqueaExaAnest').val())
        formData.append('Torax', $('#rdbToraxSiExaAnest').is(':checked') ? 1 : $('#rdbToraxNoExaAnest').is(':checked') ? 2 : 0)
        formData.append('ToraxDesc', $('#txtToraxExaAnest').val())
        formData.append('Mallampati', $('#cboMallampatiExaAnest').val())
        formData.append('DistanciaMentoTiroidea', $('#cboDisMentoTiroideaExaAnest').val())

        formData.append('Hb', $('#txtHbAnest').val())
        formData.append('Hto', $('#txtHtoAnest').val())
        formData.append('TProt', $('#txtTprotAnest').val())
        formData.append('TTrombiop', $('#txtTrombiopAnest').val())
        formData.append('Glucosa', $('#txtGlucosaResAnest').val())
        formData.append('Urea', $('#txtUreaResAnest').val())
        formData.append('Creatinina', $('#txtCreatininaResAnest').val())
        formData.append('VDRL', $('#txtVdrlAnest').val())
        formData.append('HIV', $('#txtHivResAnest').val())
        formData.append('GrupoyRh', $('#txtGrupoRhResAnest').val())
        formData.append('Fibrogeno', $('#txtFibrogenoAnest').val())
        formData.append('RxTorax', $('#txtRxToraxResAnest').val())
        formData.append('RectPlaquetas', $('#txtRecPlaquetasAnest').val())
        formData.append('Rq', $('#txtRqAnest').val())
        formData.append('OrinaRes', $('#txtOrinaResAnest').val())
        formData.append('Covid19', $('#txtCovidResAnest').val())

        Cargando(1)
        HttpClient.Post('/Anestesiologia/CrearModificarAtencionAnestesiologia?area=ConsultaExterna', formData)
            .then((res) => {
                if (res.estado) {
                    alerta(1, "Se registro la atencion")
                } else {
                    alerta(3, res.mensaje)
                }
                return res
            })
            .catch((e) => {
                if (e) throw alerta(2, e)
            })
            .finally(() => {
                Cargando(0)
            })

        $('#cboClasisifcacionAnest')
        $('#txtControlesAnest')
        $('#txtEdadGestacionalAnest')
        $('#txtGestasAnest')

        // Motivo de la consulta
        $('#txtEnfermedadActualAnest')
        $('#txtTiempoEnfermedadAnest')
        $('#txtRelatoAnest')
        // Motivo de la consulta

        // Signos y sintomas
        $('#chkDisneaAnest')
        $('#chkOrtopneaAnest')
        $('#chkConvulsionesAnest')
        $('#chkFotopsiasAnest')
        $('#chkCianosisAnest')
        $('#chkCefaleaAnest')
        $('#chkHemorragiasAnest')
        $('#chkFiebreAnest')
        $('#chkDolorAnest')
        $('#chkVomitosAnest')
        $('#chkOtrosAnest')
        $('#chkNingunoAnest')

        $('#txtOtroSintomasAnest')
        // Signos y sintomas

        // Funciones Biológicas
        $('#txtApetitoAnest')
        $('#txtSedAnest')
        $('#txtOrinaAnest')
        $('#txtDiposicionesAnest')
        $('#txtSuenioAnest')
        // Funciones Biológicas

        // Antecedentes Personales
        $('#rdbDiabSiAnest')
        $('#rdbDiabNoAnest')
        $('#rdbTbcSiAnest')
        $('#rdbTbcNoAnest')
        $('#rdbAsmaSiAnest')
        $('#rdbAsmaNoAnest')
        $('#rdbHiperSiAnest')
        $('#rdbHiperNoAnest')
        $('#rdbPTiroSiAnest')
        $('#rdbPTiroNoAnest')
        $('#rdbCiruSiAnest')
        $('#rdbCiruNoAnest')
        $('#rdbAlcoholSiAnest')
        $('#rdbAlcoholNoAnest')
        $('#rdbTabacoSiAnest')
        $('#rdbTabacoNoAnest')
        $('#rdbDrogasSiAnest')
        $('#rdbDrogasNoAnest')
        $('#rdbTransSiAnest')
        $('#rdbTransNoAnest')
        $('#rdbAnestPrevSiAnest')
        $('#rdbAnestPrevNoAnest')
        $('#rdbHemorragiaSiAnest')
        $('#rdbHemorragiaNoAnest')

        $('#txtDiabeAnest')
        $('#txtTbcAnest')
        $('#txtAsmaAnest')
        $('#txtHiperPAnest')
        $('#txtPTiroAnest')
        $('#txtCiruAnest')
        $('#txtAlcoholAnest')
        $('#txtTabacoAnest')
        $('#txtDrogasAnest')
        $('#txtTransAnest')
        $('#txtAnestPrevAnest')
        $('#txtHemorragiaAnest')
        // Antecedentes Personales

        // Antecedentes Familiares
        $('#rdbDiabSiFamAnest')
        $('#rdbDiabNoFamAnest')
        $('#rdbTbcSiFamAnest')
        $('#rdbTbcNoFamAnest')
        $('#rdbAsmaSiFamAnest')
        $('#rdbAsmaNoFamAnest')
        $('#rdbHiperSiFamAnest')
        $('#rdbHiperNoFamAnest')
        $('#rdbOtrosSiFamAnest')
        $('#rdbOtrosNoFamAnest')
        $('#rdbAnestesiasSiFamAnest')
        $('#rdbAnestesiasNoFamAnest')

        $('#txtDiabFamAntest')
        $('#txtTbcFamAnest')
        $('#txtAsmaFamAnest')
        $('#txtHiperFamAnest')
        $('#txtOtrosFamAnest')
        $('#txtAnestesiasFamAnest')
        // Antecedentes Familiares

        // Alergias
        $('#rdbFarmaSiAlerAnest')
        $('#rdbFarmaNoAlerAnest')
        $('#rdbAlimenSiAlerAnest')
        $('#rdbAlimenNoAlerAnest')
        $('#rdbEosinoSiAlerAnest')
        $('#rdbEosinoNoAlerAnest')
        $('#rdbBroncoSiAlerAnest')
        $('#rdbBroncoNoAlerAnest')
        $('#rdbOtrosSiAlerAnest')
        $('#rdbOtrosNoAlerAnest')

        $('#txtFarmaAlerAnest')
        $('#txtAlimenAlerAnest')
        $('#txtEosinoAlerAnest')
        $('#txtBroncoAlerAnest')
        $('#txtOtrosAlerAnest')
        $('#txtSignosAlerAnest')
        $('#txtShockAlerAnest')
        $('#txtRashAlerAnest')
        $('#txtEdemaAlerAnest')
        $('#txtGlotisAlerAnest')
        $('#txtPruritoAlerAnest')
        $('#txtObservacionAlerAnest')
        // Alergias

        // Examen Fisico
        $('#rdbGeneralSiExaAnest')
        $('#rdbGeneralNoExaAnest')
        $('#rdbCardioSiExaAnest')
        $('#rdbCardioNoExaAnest')
        $('#rdbAbdomenSiExaAnest')
        $('#rdbAbdomenNoExaAnest')
        $('#rdbPielSiExaAnest')
        $('#rdbPielNoExaAnest')
        $('#rdbOjosSiExaAnest')
        $('#rdbOjosNoExaAnest')
        $('#rdbCervicalSiExaAnest')
        $('#rdbCervicalNoExaAnest')
        $('#rdbNeurologicoSiExaAnest')
        $('#rdbNeurologicoNoExaAnest')
        $('#rdbColumnaSiExaAnest')
        $('#rdbColumnaNoExaAnest')
        $('#rdbEstaGeneSiExaAnest')
        $('#rdbEstaGeneNoExaAnest')
        $('#rdbEstaNutriSiExaAnest')
        $('#rdbEstaNutriNoExaAnest')
        $('#rdbVenasSiExaAnest')
        $('#rdbVenasNoExaAnest')
        $('#rdbViasAereasSiExaAnest')
        $('#rdbViasAereasNoExaAnest')
        $('#rdbDentaduraSiExaAnest')
        $('#rdbDentaduraNoExaAnest')
        $('#rdbTraqueaSiExaAnest')
        $('#rdbTraqueaNoExaAnest')
        $('#rdbToraxSiExaAnest')
        $('#rdbToraxNoExaAnest')

        $('#txtEstadoGeneralSensorioExaAnest')
        $('#txtEstadoGeneralSensorioEdemasExaAnest')
        $('#txtCardioVascularExaAnest')
        $('#txtCardioVascularReflejosExaAnest')
        $('#txtAbdomenExaAnest')
        $('#txtPielExaAnest')
        $('#txtOjosExaAnest')
        $('#txtCervicalExaAnest')
        $('#txtNeurologicoExaAnest')
        $('#txtColumnaExaAnest')
        $('#txtEstaGeneExaAnest')
        $('#txtEstaNutriExaAnest')
        $('#txtVenasExaAnest')
        $('#txtViasAereasExaAnest')
        $('#txtDentaduraExaAnest')
        $('#txtTraqueaExaAnest')
        $('#txtToraxExaAnest')

        $('#cboMallampatiExaAnest')
        $('#cboDisMentoTiroideaExaAnest')
        // Examen Fisico
    },

    CompletarAtencionAnestesio: async (idAtencion, idCuentaAtencion) => {
        let atencionAnestesiologia = await Anestesiologia.ListarAtencionesAnestesiologia(idAtencion)

        console.log('atencionAnestesiologia', atencionAnestesiologia)

        $('#cboTipoEvaluacionAnest').trigger('change')

        $('#cboClasisifcacion').val(atencionAnestesiologia[0].clasificacionPacienteAA)
        $('#txtControles').val(atencionAnestesiologia[0].controlesAA)
        $('#txtEdadGestacional').val(atencionAnestesiologia[0].edadGestacionalAA)
        $('#txtGestas').val(atencionAnestesiologia[0].nroGestasAA)

        $('#txtIntervencionQuirurgicaPropuesta').val(atencionAnestesiologia[0].intervencionQuirurgicaPropuestaAA)

        // Motivo de la consulta
        $('#txtEnfermedadActualAnest').val(atencionAnestesiologia[0].enfermedadActualAA)
        $('#txtTiempoEnfermedadAnest').val(atencionAnestesiologia[0].tiempoEnfermedadAA)
        $('#txtRelatoAnest').val(atencionAnestesiologia[0].relatoAA)
        // Motivo de la consulta

        // Signos y sintomas
        atencionAnestesiologia[0].disneaAA == 1 ? $('#chkDisneaAnest').prop('checked', true) : $('#chkDisneaAnest').prop('checked', false)
        atencionAnestesiologia[0].ortopneaAA == 1 ? $('#chkOrtopneaAnest').prop('checked', true) : $('#chkOrtopneaAnest').prop('checked', false)
        atencionAnestesiologia[0].convulsionesAA == 1 ? $('#chkConvulsionesAnest').prop('checked', true) : $('#chkConvulsionesAnest').prop('checked', false)
        atencionAnestesiologia[0].fotopsiasAA == 1 ? $('#chkFotopsiasAnest').prop('checked', true) : $('#chkFotopsiasAnest').prop('checked', false)
        atencionAnestesiologia[0].cianosisAA == 1 ? $('#chkCianosisAnest').prop('checked', true) : $('#chkCianosisAnest').prop('checked', false)
        atencionAnestesiologia[0].cefaleaAA == 1 ? $('#chkCefaleaAnest').prop('checked', true) : $('#chkCefaleaAnest').prop('checked', false)
        atencionAnestesiologia[0].hemorragiasAA == 1 ? $('#chkHemorragiasAnest').prop('checked', true) : $('#chkHemorragiasAnest').prop('checked', false)
        atencionAnestesiologia[0].fiebreAA == 1 ? $('#chkFiebreAnest').prop('checked', true) : $('#chkFiebreAnest').prop('checked', false)
        atencionAnestesiologia[0].dolorAA == 1 ? $('#chkDolorAnest').prop('checked', true) : $('#chkDolorAnest').prop('checked', false)
        atencionAnestesiologia[0].nausea_VomitoAA == 1 ? $('#chkVomitosAnest').prop('checked', true) : $('#chkVomitosAnest').prop('checked', false)
        atencionAnestesiologia[0].otrosAA == 1 ? $('#chkOtrosAnest').prop('checked', true) : $('#chkOtrosAnest').prop('checked', false)
        atencionAnestesiologia[0].ningunoAA == 1 ? $('#chkNingunoAnest').prop('checked', true) : $('#chkNingunoAnest').prop('checked', false)

        $('#txtOtroSintomasAnest').val(atencionAnestesiologia[0].descripcionOtrosAA)

        Anestesiologia.BloquearInputByChecked($('#chkOtrosAnest'), $('#txtOtroSintomasAnest'))
        // Signos y sintomas

        // Funciones Biológicas
        $('#txtApetitoAnest').val(atencionAnestesiologia[0].apetitoAA)
        $('#txtSedAnest').val(atencionAnestesiologia[0].sedAA)
        $('#txtOrinaAnest').val(atencionAnestesiologia[0].orinaAA)
        $('#txtDiposicionesAnest').val(atencionAnestesiologia[0].deposicionesAA)
        $('#txtSuenioAnest').val(atencionAnestesiologia[0].suenioAA)
        // Funciones Biológicas

        // Antecedentes Personales
        atencionAnestesiologia[0].diabetesP == 1 ? $('#rdbDiabSiAnest').prop('checked', true) : $('#rdbDiabNoAnest').prop('checked', true)
        atencionAnestesiologia[0].tbcp == 1 ? $('#rdbTbcSiAnest').prop('checked', true) : $('#rdbTbcNoAnest').prop('checked', true)
        atencionAnestesiologia[0].asmaP == 1 ? $('#rdbAsmaSiAnest').prop('checked', true) : $('#rdbAsmaNoAnest').prop('checked', true)
        atencionAnestesiologia[0].hipertensionP == 1 ? $('#rdbHiperSiAnest').prop('checked', true) : $('#rdbHiperNoAnest').prop('checked', true)
        atencionAnestesiologia[0].patologiaTiroideaP == 1 ? $('#rdbPTiroSiAnest').prop('checked', true) : $('#rdbPTiroNoAnest').prop('checked', true)
        atencionAnestesiologia[0].cirugiaPreviaP == 1 ? $('#rdbCiruSiAnest').prop('checked', true) : $('#rdbCiruNoAnest').prop('checked', true)
        atencionAnestesiologia[0].alcoholP == 1 ? $('#rdbAlcoholSiAnest').prop('checked', true) : $('#rdbAlcoholNoAnest').prop('checked', true)
        atencionAnestesiologia[0].tabacoP == 1 ? $('#rdbTabacoSiAnest').prop('checked', true) : $('#rdbTabacoNoAnest').prop('checked', true)
        atencionAnestesiologia[0].drogasP == 1 ? $('#rdbDrogasSiAnest').prop('checked', true) : $('#rdbDrogasNoAnest').prop('checked', true)
        atencionAnestesiologia[0].transfusionesP == 1 ? $('#rdbTransSiAnest').prop('checked', true) : $('#rdbTransNoAnest').prop('checked', true)
        atencionAnestesiologia[0].anestesiasPreviasP == 1 ? $('#rdbAnestPrevSiAnest').prop('checked', true) : $('#rdbAnestPrevNoAnest').prop('checked', true)
        atencionAnestesiologia[0].tendenciaHemorragiasP == 1 ? $('#rdbHemorragiaSiAnest').prop('checked', true) : $('#rdbHemorragiaNoAnest').prop('checked', true)
        atencionAnestesiologia[0].otrosP == 1 ? $('#rdbOtrosSiAnest').prop('checked', true) : $('#rdbOtrosNoAnest').prop('checked', true)

        $('#txtDiabeAnest').val(atencionAnestesiologia[0].diabetesDescP)
        $('#txtTbcAnest').val(atencionAnestesiologia[0].tbcDescP)
        $('#txtAsmaAnest').val(atencionAnestesiologia[0].asmaDescP)
        $('#txtHiperPAnest').val(atencionAnestesiologia[0].hipertensionDescP)
        $('#txtPTiroAnest').val(atencionAnestesiologia[0].patologiaTiroideaDescP)
        $('#txtCiruAnest').val(atencionAnestesiologia[0].cirugiaPreviaDescP)
        $('#txtAlcoholAnest').val(atencionAnestesiologia[0].alcoholDescP)
        $('#txtTabacoAnest').val(atencionAnestesiologia[0].tabacoDescP)
        $('#txtDrogasAnest').val(atencionAnestesiologia[0].drogasDescP)
        $('#txtTransAnest').val(atencionAnestesiologia[0].transfusionesDescP)
        $('#txtAnestPrevAnest').val(atencionAnestesiologia[0].anestesiasPreviasDescP)
        $('#txtHemorragiaAnest').val(atencionAnestesiologia[0].tendenciaHemorragiasDescP)
        $('#txtOtrosAnest').val(atencionAnestesiologia[0].otrosDescP)
        // Antecedentes Personales

        // Antecedentes Familiares
        atencionAnestesiologia[0].diabetesF == 1 ? $('#rdbDiabSiFamAnest').prop('checked', true) : $('#rdbDiabNoFamAnest').prop('checked', true)
        atencionAnestesiologia[0].tbcf == 1 ? $('#rdbTbcSiFamAnest').prop('checked', true) : $('#rdbTbcNoFamAnest').prop('checked', true)
        atencionAnestesiologia[0].asmaF == 1 ? $('#rdbAsmaSiFamAnest').prop('checked', true) : $('#rdbAsmaNoFamAnest').prop('checked', true)
        atencionAnestesiologia[0].hipertensionF == 1 ? $('#rdbHiperSiFamAnest').prop('checked', true) : $('#rdbHiperNoFamAnest').prop('checked', true)
        atencionAnestesiologia[0].otrosF == 1 ? $('#rdbOtrosSiFamAnest').prop('checked', true) : $('#rdbOtrosNoFamAnest').prop('checked', true)
        atencionAnestesiologia[0].anestesiasFamiliaresF == 1 ? $('#rdbAnestesiasSiFamAnest').prop('checked', true) : $('#rdbAnestesiasNoFamAnest').prop('checked', true)

        $('#txtDiabFamAntest').val(atencionAnestesiologia[0].diabetesDescF)
        $('#txtTbcFamAnest').val(atencionAnestesiologia[0].tbcDescF)
        $('#txtAsmaFamAnest').val(atencionAnestesiologia[0].asmaDescF)
        $('#txtHiperFamAnest').val(atencionAnestesiologia[0].hipertensionDescF)
        $('#txtOtrosFamAnest').val(atencionAnestesiologia[0].otrosDescF)
        $('#txtAnestesiasFamAnest').val(atencionAnestesiologia[0].anestesiasFamiliaresDescF)
        // Antecedentes Familiares

        // Alergias
        atencionAnestesiologia[0].farmacologicasALER == 1 ? $('#rdbFarmaSiAlerAnest').prop('checked', true) : $('#rdbFarmaNoAlerAnest').prop('checked', true)
        atencionAnestesiologia[0].alimentacionALER == 1 ? $('#rdbAlimenSiAlerAnest').prop('checked', true) : $('#rdbAlimenNoAlerAnest').prop('checked', true)
        atencionAnestesiologia[0].eosinofiliaALER == 1 ? $('#rdbEosinoSiAlerAnest').prop('checked', true) : $('#rdbEosinoNoAlerAnest').prop('checked', true)
        atencionAnestesiologia[0].broncoespasmosALER == 1 ? $('#rdbBroncoSiAlerAnest').prop('checked', true) : $('#rdbBroncoNoAlerAnest').prop('checked', true)
        atencionAnestesiologia[0].otrosALER == 1 ? $('#rdbOtrosSiAlerAnest').prop('checked', true) : $('#rdbOtrosNoAlerAnest').prop('checked', true)

        $('#txtFarmaAlerAnest').val(atencionAnestesiologia[0].farmacologicasDescALER)
        $('#txtAlimenAlerAnest').val(atencionAnestesiologia[0].alimentacionDescALER)
        $('#txtEosinoAlerAnest').val(atencionAnestesiologia[0].eosinofiliaDescALER)
        $('#txtBroncoAlerAnest').val(atencionAnestesiologia[0].broncoespasmosDescALER)
        $('#txtOtrosAlerAnest').val(atencionAnestesiologia[0].otrosDescALER)
        $('#txtSignosAlerAnest').val(atencionAnestesiologia[0].signosSintomasALER)
        $('#txtShockAlerAnest').val(atencionAnestesiologia[0].shockALER)
        $('#txtRashAlerAnest').val(atencionAnestesiologia[0].rashaler)
        $('#txtEdemaAlerAnest').val(atencionAnestesiologia[0].edemaALER)
        $('#txtGlotisAlerAnest').val(atencionAnestesiologia[0].glotisALER)
        $('#txtPruritoAlerAnest').val(atencionAnestesiologia[0].pruritoALER)
        $('#txtObservacionAlerAnest').val(atencionAnestesiologia[0].observacionALER)
        // Alergias

        // Examen Fisico
        atencionAnestesiologia[0].estadoGeneralSensorioEF == 1 ? $('#rdbGeneralSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].estadoGeneralSensorioEF == 2 ? $('#rdbGeneralNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].cardiovascularEF == 1 ? $('#rdbCardioSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].cardiovascularEF == 2 ? $('#rdbCardioNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].abdomenEF == 1 ? $('#rdbAbdomenSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].abdomenEF == 2 ? $('#rdbAbdomenNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].pielEF == 1 ? $('#rdbPielSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].pielEF == 2 ? $('#rdbPielNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].ojosEF == 1 ? $('#rdbOjosSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].ojosEF == 2 ? $('#rdbOjosNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].movCervicalEF == 1 ? $('#rdbCervicalSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].movCervicalEF == 2 ? $('#rdbCervicalNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].neurologicoEF == 1 ? $('#rdbNeurologicoSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].neurologicoEF == 2 ? $('#rdbNeurologicoNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].columnaVertebralEF == 1 ? $('#rdbColumnaSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].columnaVertebralEF == 2 ? $('#rdbColumnaNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].estadoGeneralEF == 1 ? $('#rdbEstaGeneSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].estadoGeneralEF == 2 ? $('#rdbEstaGeneNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].estadoNutricionalEF == 1 ? $('#rdbEstaNutriSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].estadoNutricionalEF == 2 ? $('#rdbEstaNutriNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].venasEF == 1 ? $('#rdbVenasSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].venasEF == 2 ? $('#rdbVenasNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].viasAereasEF == 1 ? $('#rdbViasAereasSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].viasAereasEF == 2 ? $('#rdbViasAereasNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].dentaduraEF == 1 ? $('#rdbDentaduraSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].dentaduraEF == 2 ? $('#rdbDentaduraNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].traqueaEF == 1 ? $('#rdbTraqueaSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].traqueaEF == 2 ? $('#rdbTraqueaNoExaAnest').prop('checked', true) : ''
        atencionAnestesiologia[0].toraxEF == 1 ? $('#rdbToraxSiExaAnest').prop('checked', true) : atencionAnestesiologia[0].toraxEF == 2 ? $('#rdbToraxNoExaAnest').prop('checked', true) : ''

        $('#txtEstadoGeneralSensorioExaAnest').val(atencionAnestesiologia[0].estadoGeneralSensorioDescEF)
        $('#txtEstadoGeneralSensorioEdemasExaAnest').val(atencionAnestesiologia[0].estadoGeneralSensorioEdemasEF)
        $('#txtCardioVascularExaAnest').val(atencionAnestesiologia[0].cardiovascularDescEF)
        $('#txtCardioVascularReflejosExaAnest').val(atencionAnestesiologia[0].cardiovascularEdemasEF)
        $('#txtAbdomenExaAnest').val(atencionAnestesiologia[0].abdomenDescEF)
        $('#txtPielExaAnest').val(atencionAnestesiologia[0].pielDescEF)
        $('#txtOjosExaAnest').val(atencionAnestesiologia[0].ojosDescEF)
        $('#txtCervicalExaAnest').val(atencionAnestesiologia[0].movCervicalDescEF)
        $('#txtNeurologicoExaAnest').val(atencionAnestesiologia[0].neurologicoDescEF)
        $('#txtColumnaExaAnest').val(atencionAnestesiologia[0].columnaVertebralDescEF)
        $('#txtEstaGeneExaAnest').val(atencionAnestesiologia[0].estadoGeneralDescEF)
        $('#txtEstaNutriExaAnest').val(atencionAnestesiologia[0].estadoNutricionalDescEF)
        $('#txtVenasExaAnest').val(atencionAnestesiologia[0].venasDescEF)
        $('#txtViasAereasExaAnest').val(atencionAnestesiologia[0].viasAereasDescEF)
        $('#txtDentaduraExaAnest').val(atencionAnestesiologia[0].dentaduraDescEF)
        $('#txtTraqueaExaAnest').val(atencionAnestesiologia[0].traqueaDescEF)
        $('#txtToraxExaAnest').val(atencionAnestesiologia[0].toraxDescEF)

        $('#cboMallampatiExaAnest').val(atencionAnestesiologia[0].mallampatiEF)
        $('#cboDisMentoTiroideaExaAnest').val(atencionAnestesiologia[0].distanciaMentoTiroideaEF)

        // Examen Fisico

        // Resultados
        $('#cboTipoEvaluacionAnest').val(atencionAnestesiologia[0].tipoEvaluacionAnestesiaAA)
        $('#cboTipoEvaluacionAnest').trigger('change')

        $('#txtRxToraxAnest').val(atencionAnestesiologia[0].rxToraxResumenAA)
        $('#txtQuirurgicoAnest').val(atencionAnestesiologia[0].riesgoQuirurgicoAA)
        $('#cboOperacionAnest').val(atencionAnestesiologia[0].operacionAA)
        $('#cboClasificacionASA').val(atencionAnestesiologia[0].clasificacionASAAA)
        $('#txtConclusionAnest').val(atencionAnestesiologia[0].conclusionAA)
        $('#txtTipoAnestesiaAnest').val(atencionAnestesiologia[0].tipoAnestesiaPrevistaAA)
        // Resultados

        // Antecedentes Personales
        Anestesiologia.BloquearInputByChecked($('#rdbDiabSiAnest'), $('#txtDiabeAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbTbcSiAnest'), $('#txtTbcAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbAsmaSiAnest'), $('#txtAsmaAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbHiperSiAnest'), $('#txtHiperPAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbPTiroSiAnest'), $('#txtPTiroAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbCiruSiAnest'), $('#txtCiruAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbAlcoholSiAnest'), $('#txtAlcoholAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbTabacoSiAnest'), $('#txtTabacoAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbDrogasSiAnest'), $('#txtDrogasAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbTransSiAnest'), $('#txtTransAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbAnestPrevSiAnest'), $('#txtAnestPrevAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbHemorragiaSiAnest'), $('#txtHemorragiaAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbOtrosSiAnest'), $('#txtOtrosAnest'))
        // Antecedentes Personales

        // Antecedentes Familiares
        Anestesiologia.BloquearInputByChecked($('#rdbDiabSiFamAnest'), $('#txtDiabFamAntest'))
        Anestesiologia.BloquearInputByChecked($('#rdbTbcSiFamAnest'), $('#txtTbcFamAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbAsmaSiFamAnest'), $('#txtAsmaFamAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbHiperSiFamAnest'), $('#txtHiperFamAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbOtrosSiFamAnest'), $('#txtOtrosFamAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbAnestesiasSiFamAnest'), $('#txtAnestesiasFamAnest'))
        // Antecedentes Familiares

        // Alergias
        Anestesiologia.BloquearInputByChecked($('#rdbFarmaSiAlerAnest'), $('#txtFarmaAlerAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbAlimenSiAlerAnest'), $('#txtAlimenAlerAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbEosinoSiAlerAnest'), $('#txtEosinoAlerAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbBroncoSiAlerAnest'), $('#txtBroncoAlerAnest'))
        Anestesiologia.BloquearInputByChecked($('#rdbOtrosSiAlerAnest'), $('#txtOtrosAlerAnest'))
        // Alergias

        // Medicacion Suministrada
        Anestesiologia.ListarMedicacionSuministradaAnestesiologia(atencionAnestesiologia[0].idAtencionAnestesiologia)
        //Anestesiologia.ListarExamenesAnestesiologiaByCuenta(idCuentaAtencion)
        //Anestesiologia.ListarPatologiaClinicaAnestesiologia(atencionAnestesiologia[0].idAtencionAnestesiologia)
        // Medicacion Suministrada

        $('.chzn-select').chosen().trigger("chosen:updated")

    },

    CompletarResultadosAnestesioPorDefecto: async (data) => {

        let grupoRhResAnest = ''

        $(data).each((i, obj) => {

            console.log('revisando', obj)

            if (obj.codigo == '85027' && obj.idItem == '1') { // Hemoglobina
                $('#txtHbAnest').val(obj.valorNumero)
            }
            if (obj.codigo == '85027' && obj.idItem == '2') { // Hematocrito
                $('#txtHtoAnest').val(obj.valorNumero)
            }

            if (obj.codigo == '80063' && obj.idItem == '85') { // Tiempo de Protrombina
                $('#txtTprotAnest').val(obj.valorTexto)
            }
            if (obj.codigo == '80063' && obj.idItem == '86') { // Tiempo Parcial de Tromboplastina
                $('#txtTrombiopAnest').val(obj.valorTexto)
            }

            if (obj.codigo == '82947' && obj.idItem == '84') { // GLUCOSA EN SANGRE CUANTITATIVO
                $('#txtGlucosaResAnest').val(obj.valorTexto + '')
            }
            if (obj.codigo == '84520' && obj.idItem == '84') { // UREA
                $('#txtUreaResAnest').val((obj.valorCombo != '' ? obj.valorCombo : ''))
            }
            if (obj.codigo == '82565' && obj.idItem == '84') { // CREATININA EN SANGRE
                $('#txtCreatininaResAnest').val(obj.valorTexto)
            }

            if (obj.codigo == '86592' && obj.idItem == '84') { // RPR/VDRL
                $('#txtVdrlAnest').val(obj.valorCombo)
            }
            if (obj.codigo == '86703' && obj.idItem == '84') { // HIV 1 - 2 Ag/Ac
                $('#txtHivResAnest').val(obj.valorCombo)
            }

            if (obj.codigo == '80063' && obj.idItem == '87') { // Fibrinógeno
                $('#txtFibrogenoAnest').val(obj.valorTexto)
            }
            if (obj.codigo == '80063' && obj.idItem == '4') { // Plaquetas
                $('#txtRecPlaquetasAnest').val(obj.valorTexto)
            }


            if (obj.codigo == '86900' && obj.idItem == '84') { // Grupo sanguíneo ABO
                grupoRhResAnest = grupoRhResAnest + obj.valorTexto + ' '
            }
            if (obj.codigo == '86901' && obj.idItem == '84') { // TIPIFICACION SANGUINEA RH
                grupoRhResAnest = grupoRhResAnest + obj.valorCombo + ' '
            }


            if (obj.codigo == '87635.02' && obj.idItem == '84') { // Prueba Rapida Antigénica (Covid-19)
                $('#txtCovidResAnest').val(obj.valorCombo)
            }


            //$('#').val()
            //$('#txtRxToraxResAnest').val()
            //$('#txtRqAnest').val()
            //$('#txtOrinaResAnest').val()
        })

        $('#txtGrupoRhResAnest').val(grupoRhResAnest)
    },
    CompletarResultadosAnestesioCargados: async (data) => {

        $('#txtTprotAnest').val(data.tProt)
        $('#txtTrombiopAnest').val(data.tTrombiop)
        $('#txtFibrogenoAnest').val(data.fibrogeno)
        $('#txtCreatininaResAnest').val(data.creatinina)
        $('#txtRecPlaquetasAnest').val(data.rectPlaquetas)
        $('#txtHtoAnest').val(data.hto)
        $('#txtVdrlAnest').val(data.vdrl)
        $('#txtHivResAnest').val(data.hiv)
        $('#txtCovidResAnest').val(data.covid19)
        $('#txtGlucosaResAnest').val(data.glucosa)
        $('#txtHbAnest').val(data.hb)

        $('#txtUreaResAnest').val(data.urea)
        //$('#txtRxToraxResAnest').val(data.rxTorax)
        //$('#txtRqAnest').val(data.rq)
        $('#txtOrinaResAnest').val(data.orina)
        $('#txtGrupoRhResAnest').val(data.grupoyRh)
    },

    BloquearByClasificacion: (tipoClasificacion) => {
        switch (tipoClasificacion) {
            case "1":
                $('#txtControlesAnest').attr("disabled", false);
                $('#txtEdadGestacionalAnest').attr("disabled", false);
                $('#txtGestasAnest').attr("disabled", false);
                break;
            case "2":
                $('#txtControlesAnest').attr("disabled", false);
                $('#txtEdadGestacionalAnest').attr("disabled", true);
                $('#txtGestasAnest').attr("disabled", false);
                break;
            case "3":
                $('#txtControlesAnest').attr("disabled", false);
                $('#txtEdadGestacionalAnest').attr("disabled", true);
                $('#txtGestasAnest').attr("disabled", true);

                break;
            case "4":
                $('#txtControlesAnest').attr("disabled", false);
                $('#txtEdadGestacionalAnest').attr("disabled", true);
                $('#txtGestasAnest').attr("disabled", false);
                break;
            default:
                $('#txtControlesAnest').attr("disabled", true);
                $('#txtEdadGestacionalAnest').attr("disabled", true);
                $('#txtGestasAnest').attr("disabled", true);
                break;
        }
    },
    BloquearInputByChecked: (radio, input) => {
        if (radio.is(':checked')) {
            input.attr('disabled', false)
        } else {
            input.attr('disabled', true)
            input.val('')
        }
    },

    LimpiarCampos: () => {
        $('#cboClasisifcacionAnest').val(0)
        $('#txtControlesAnest').val('')
        $('#txtEdadGestacionalAnest').val('')
        $('#txtGestasAnest').val('')

        // Motivo de la consulta
        $('#txtEnfermedadActualAnest').val('')
        $('#txtTiempoEnfermedadAnest').val('')
        $('#txtRelatoAnest').val('')
        // Motivo de la consulta

        // Signos y sintomas
        $('#chkDisneaAnest').prop('checked', false)
        $('#chkOrtopneaAnest').prop('checked', false)
        $('#chkConvulsionesAnest').prop('checked', false)
        $('#chkFotopsiasAnest').prop('checked', false)
        $('#chkCianosisAnest').prop('checked', false)
        $('#chkCefaleaAnest').prop('checked', false)
        $('#chkHemorragiasAnest').prop('checked', false)
        $('#chkFiebreAnest').prop('checked', false)
        $('#chkDolorAnest').prop('checked', false)
        $('#chkVomitosAnest').prop('checked', false)
        $('#chkOtrosAnest').prop('checked', false)
        $('#chkNingunoAnest').prop('checked', false)

        $('#txtOtroSintomasAnest').val('')
        // Signos y sintomas

        // Funciones Biológicas
        $('#txtApetitoAnest').val('')
        $('#txtSedAnest').val('')
        $('#txtOrinaAnest').val('')
        $('#txtDiposicionesAnest').val('')
        $('#txtSuenioAnest').val('')
        // Funciones Biológicas

        // Antecedentes Personales
        $('#rdbDiabSiAnest')
        $('#rdbDiabNoAnest').prop('checked', true)
        $('#rdbTbcSiAnest')
        $('#rdbTbcNoAnest').prop('checked', true)
        $('#rdbAsmaSiAnest')
        $('#rdbAsmaNoAnest').prop('checked', true)
        $('#rdbHiperSiAnest')
        $('#rdbHiperNoAnest').prop('checked', true)
        $('#rdbPTiroSiAnest')
        $('#rdbPTiroNoAnest').prop('checked', true)
        $('#rdbCiruSiAnest')
        $('#rdbCiruNoAnest').prop('checked', true)
        $('#rdbAlcoholSiAnest')
        $('#rdbAlcoholNoAnest').prop('checked', true)
        $('#rdbTabacoSiAnest')
        $('#rdbTabacoNoAnest').prop('checked', true)
        $('#rdbDrogasSiAnest')
        $('#rdbDrogasNoAnest').prop('checked', true)
        $('#rdbTransSiAnest')
        $('#rdbTransNoAnest').prop('checked', true)
        $('#rdbAnestPrevSiAnest')
        $('#rdbAnestPrevNoAnest').prop('checked', true)
        $('#rdbHemorragiaSiAnest')
        $('#rdbHemorragiaNoAnest').prop('checked', true)
        $('#rdbOtrosNoAnest').prop('checked', true)

        $('#txtDiabeAnest').val('')
        $('#txtTbcAnest').val('')
        $('#txtAsmaAnest').val('')
        $('#txtHiperPAnest').val('')
        $('#txtPTiroAnest').val('')
        $('#txtCiruAnest').val('')
        $('#txtAlcoholAnest').val('')
        $('#txtTabacoAnest').val('')
        $('#txtDrogasAnest').val('')
        $('#txtTransAnest').val('')
        $('#txtAnestPrevAnest').val('')
        $('#txtHemorragiaAnest').val('')
        $('#txtOtrosAnest').val('')

        // Antecedentes Personales

        // Antecedentes Familiares
        $('#rdbDiabSiFamAnest')
        $('#rdbDiabNoFamAnest').prop('checked', true)
        $('#rdbTbcSiFamAnest')
        $('#rdbTbcNoFamAnest').prop('checked', true)
        $('#rdbAsmaSiFamAnest')
        $('#rdbAsmaNoFamAnest').prop('checked', true)
        $('#rdbHiperSiFamAnest')
        $('#rdbHiperNoFamAnest').prop('checked', true)
        $('#rdbOtrosSiFamAnest')
        $('#rdbOtrosNoFamAnest').prop('checked', true)
        $('#rdbAnestesiasSiFamAnest')
        $('#rdbAnestesiasNoFamAnest').prop('checked', true)

        $('#txtDiabFamAntest').val('')
        $('#txtTbcFamAnest').val('')
        $('#txtAsmaFamAnest').val('')
        $('#txtHiperFamAnest').val('')
        $('#txtOtrosFamAnest').val('')
        $('#txtAnestesiasFamAnest').val('')
        // Antecedentes Familiares

        // Alergias
        $('#rdbFarmaSiAlerAnest')
        $('#rdbFarmaNoAlerAnest').prop('checked', true)
        $('#rdbAlimenSiAlerAnest')
        $('#rdbAlimenNoAlerAnest').prop('checked', true)
        $('#rdbEosinoSiAlerAnest')
        $('#rdbEosinoNoAlerAnest').prop('checked', true)
        $('#rdbBroncoSiAlerAnest')
        $('#rdbBroncoNoAlerAnest').prop('checked', true)
        $('#rdbOtrosSiAlerAnest')
        $('#rdbOtrosNoAlerAnest').prop('checked', true)

        $('#txtFarmaAlerAnest').val('')
        $('#txtAlimenAlerAnest').val('')
        $('#txtEosinoAlerAnest').val('')
        $('#txtBroncoAlerAnest').val('')
        $('#txtOtrosAlerAnest').val('')
        $('#txtSignosAlerAnest').val('')
        $('#txtShockAlerAnest').val('')
        $('#txtRashAlerAnest').val('')
        $('#txtEdemaAlerAnest').val('')
        $('#txtGlotisAlerAnest').val('')
        $('#txtPruritoAlerAnest').val('')
        $('#txtObservacionAlerAnest').val('')
        // Alergias

        // Examen Fisico
        $('#rdbGeneralSiExaAnest').prop('checked', true)
        $('#rdbGeneralNoExaAnest')
        $('#rdbCardioSiExaAnest').prop('checked', true)
        $('#rdbCardioNoExaAnest')
        $('#rdbAbdomenSiExaAnest').prop('checked', true)
        $('#rdbAbdomenNoExaAnest')
        $('#rdbPielSiExaAnest').prop('checked', true)
        $('#rdbPielNoExaAnest')
        $('#rdbOjosSiExaAnest').prop('checked', true)
        $('#rdbOjosNoExaAnest')
        $('#rdbCervicalSiExaAnest').prop('checked', true)
        $('#rdbCervicalNoExaAnest')
        $('#rdbNeurologicoSiExaAnest').prop('checked', true)
        $('#rdbNeurologicoNoExaAnest')
        $('#rdbColumnaSiExaAnest').prop('checked', true)
        $('#rdbColumnaNoExaAnest')
        $('#rdbEstaGeneSiExaAnest').prop('checked', true)
        $('#rdbEstaGeneNoExaAnest')
        $('#rdbEstaNutriSiExaAnest').prop('checked', true)
        $('#rdbEstaNutriNoExaAnest')
        $('#rdbVenasSiExaAnest').prop('checked', true)
        $('#rdbVenasNoExaAnest')
        $('#rdbViasAereasSiExaAnest').prop('checked', true)
        $('#rdbViasAereasNoExaAnest')
        $('#rdbDentaduraSiExaAnest').prop('checked', true)
        $('#rdbDentaduraNoExaAnest')
        $('#rdbTraqueaSiExaAnest').prop('checked', true)
        $('#rdbTraqueaNoExaAnest')
        $('#rdbToraxSiExaAnest').prop('checked', true)
        $('#rdbToraxNoExaAnest')

        $('#txtEstadoGeneralSensorioExaAnest').val('')
        $('#txtEstadoGeneralSensorioEdemasExaAnest').val('')
        $('#txtCardioVascularExaAnest').val('')
        $('#txtCardioVascularReflejosExaAnest').val('')
        $('#txtAbdomenExaAnest').val('')
        $('#txtPielExaAnest').val('')
        $('#txtOjosExaAnest').val('')
        $('#txtCervicalExaAnest').val('')
        $('#txtNeurologicoExaAnest').val('')
        $('#txtColumnaExaAnest').val('')
        $('#txtEstaGeneExaAnest').val('')
        $('#txtEstaNutriExaAnest').val('')
        $('#txtVenasExaAnest').val('')
        $('#txtViasAereasExaAnest').val('')
        $('#txtDentaduraExaAnest').val('')
        $('#txtTraqueaExaAnest').val('')
        $('#txtToraxExaAnest').val('')

        $('#cboMallampatiExaAnest')
        $('#cboDisMentoTiroideaExaAnest')
        // Examen Fisico
        $('#txtConclusionAnest').val('')
        $('#txtIntervencionQuirurgicaPropuesta').val('')
    },

    InitDatablesMedicacionSuministrada: () => {
        var parms = {
            "scrollY": "150px",
            "scrollCollapse": true,
            "order": [[0, "desc"]],
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    data: "droga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "via",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    data: "duracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

            ]

        }

        var tableWrapper = $('#tblMedicacionSuministrada'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_medicacionSuministrada = $("#tblMedicacionSuministrada").dataTable(parms);
    },
    InitDatablesPatologiaClinica: () => {
        var parms = {
            "scrollY": "150px",
            "scrollCollapse": true,
            "order": [[0, "desc"]],
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    with: '40%',
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    with: '10%',
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    with: '40%',
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    with: '10%',
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        // añadir descripcion en el value del checkbox
                        $(td).html(`<input type="checkbox" id="blankCheckbox" row=${row}>`);
                    }
                }

            ]

        }

        var tableWrapper = $('#tblPatologiaClinicaAnest'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_patologiaClinica = $("#tblPatologiaClinicaAnest").dataTable(parms);
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

    Events: () => {

        $("#cboClasisifcacion").on('change', function () {
            $('#txtControles').val(0);
            $('#txtEdadGestacional').val(0);
            $('#txtGestas').val(0);
            var valorClas = $("#cboClasisifcacion").val()
            Anestesiologia.Bloqueo(valorClas)
        });

        $('#tblMedicacionSuministrada tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_medicacionSuministrada.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });


        $('#chkOtrosAnest').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#chkOtrosAnest'), $('#txtOtroSintomasAnest'))
        })

        
        // Antecedentes Personales
        $('input[name=rdbDiabAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbDiabSiAnest'), $('#txtDiabeAnest'))
        })
        $('input[name=rdbTbcAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbTbcSiAnest'), $('#txtTbcAnest'))
        })
        $('input[name=rdbAsmaAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbAsmaSiAnest'), $('#txtAsmaAnest'))
        })
        $('input[name=rdbHiperAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbHiperSiAnest'), $('#txtHiperPAnest'))
        })
        $('input[name=rdbPTiroAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbPTiroSiAnest'), $('#txtPTiroAnest'))
        })
        $('input[name=rdbCiruAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbCiruSiAnest'), $('#txtCiruAnest'))
        })
        $('input[name=rdbAlcoholAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbAlcoholSiAnest'), $('#txtAlcoholAnest'))
        })
        $('input[name=rdbTabacoAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbTabacoSiAnest'), $('#txtTabacoAnest'))
        })
        $('input[name=rdbDrogasAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbDrogasSiAnest'), $('#txtDrogasAnest'))
        })
        $('input[name=rdbTransAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbTransSiAnest'), $('#txtTransAnest'))
        })
        $('input[name=rdbAnestPrevAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbAnestPrevSiAnest'), $('#txtAnestPrevAnest'))
        })
        $('input[name=rdbHemorragiaAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbHemorragiaSiAnest'), $('#txtHemorragiaAnest'))
        })
        $('input[name=rdbOtrosAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbOtrosSiAnest'), $('#txtOtrosAnest'))
        })
        // Antecedentes Personales

        // Antecedentes Familiares
        $('input[name=rdbDiabFamAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbDiabSiFamAnest'), $('#txtDiabFamAntest'))
        })
        $('input[name=rdbTbcFamAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbTbcSiFamAnest'), $('#txtTbcFamAnest'))
        })
        $('input[name=rdbAsmaFamAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbAsmaSiFamAnest'), $('#txtAsmaFamAnest'))
        })
        $('input[name=rdbHiperFamAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbHiperSiFamAnest'), $('#txtHiperFamAnest'))
        })
        $('input[name=rdbOtrosFamAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbOtrosSiFamAnest'), $('#txtOtrosFamAnest'))
        })
        $('input[name=rdbAnestesiasFamAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbAnestesiasSiFamAnest'), $('#txtAnestesiasFamAnest'))
        })
        // Antecedentes Familiares

        // Alergias
        $('input[name=rdbFarmaAlerAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbFarmaSiAlerAnest'), $('#txtFarmaAlerAnest'))
        })
        $('input[name=rdbAlimenAlerAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbAlimenSiAlerAnest'), $('#txtAlimenAlerAnest'))
        })
        $('input[name=rdbEosinoAlerAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbEosinoSiAlerAnest'), $('#txtEosinoAlerAnest'))
        })
        $('input[name=rdbBroncoAlerAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbBroncoSiAlerAnest'), $('#txtBroncoAlerAnest'))
        })
        $('input[name=rdbOtrosAlerAnest]').on('click', () => {
            Anestesiologia.BloquearInputByChecked($('#rdbOtrosSiAlerAnest'), $('#txtOtrosAlerAnest'))
        })
        // Alergias

        $("#cboClasisifcacionAnest").on('change', () => {
            $('#txtControlesAnest').val(0);
            $('#txtEdadGestacionalAnest').val(0);
            $('#txtGestasAnest').val(0);

            Anestesiologia.BloquearByClasificacion($("#cboClasisifcacionAnest").val())
        })
        $('#cboTipoEvaluacionAnest').on('change', () => {
            let option = ''

            if ($('#cboTipoEvaluacionAnest').val() == 1) {
                option = `<option value="1">I</option>
                        <option value="2">II</option>
                        <option value="3">III</option>
                        <option value="4">IV</option>
                        <option value="5">V</option>
                        <option value="6">VI</option>`
            }

            if ($('#cboTipoEvaluacionAnest').val() == 2) {
                option = `<option value="1">I E</option>
                        <option value="2">II E</option>
                        <option value="3">III E</option>
                        <option value="4">IV E</option>
                        <option value="5">V E</option>
                        <option value="6">VI E</option>`
            }

            $('#cboClasificacionASA').html(option)
            $('.chzn-select').chosen().trigger("chosen:updated")
        })

        $('#btnAgregarDroga').on('click', () => {

            if ($('#txtDrogaMedAnest').val() != "" || $('#txtDosisMedAnest').val() != "" || $('#txtViaMedAnest').val() != "" || $('#txtDuracionMedAnest').val() != "") {
                let medicacionSuministrada = [{
                    "droga": $('#txtDrogaMedAnest').val(),
                    "dosis": $('#txtDosisMedAnest').val(),
                    "via": $('#txtViaMedAnest').val(),
                    "duracion": $('#txtDuracionMedAnest').val()
                }]

                oTable_medicacionSuministrada.fnAddData(medicacionSuministrada)

                $('#txtDrogaMedAnest').val('')
                $('#txtDosisMedAnest').val('')
                $('#txtViaMedAnest').val('')
                $('#txtDuracionMedAnest').val('')
            } else {
                alerta(2, "Debe llenar al menos uno de los campos.");
            }            
        })

        $('#btnEliminarDroga').on('click', () => {
            let objRowMedicacion = oTable_medicacionSuministrada.api(true).row('.selected').data()

            if (!isEmpty(objRowMedicacion)) {
                oTable_medicacionSuministrada.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro a eliminar.");
            }
        })


        $('#btnGuardarAtencionAnest').on('click', () => {
            Anestesiologia.GuardarAtencionAnestesiologia()
        })
    },

    async CargarFormData(formData) {
        
        ///////////////EXTERNO///////////
        //formData.append('fechaIngreso', objrow.fechaIngreso);
        //formData.append('antecedQuirurgico', $('#txtQuirurgicos').val());
        //formData.append('antecedPatologico', $('#txtPatologicos').val());
        //formData.append('antecedObstetrico', $('#txtObstetricos').val());
        //formData.append('antecedAlergico', $('#txtAlergias').val());
        //formData.append('antecedFamiliar', $('#txtFamiliares').val());
        //formData.append('antecedentes', $('#txtOtros').val());
        /////////////////////////////////



    },

    Iniciar: () => {
        Anestesiologia.CargaInicial();
        Anestesiologia.Plugins();
        Anestesiologia.CargaDatosPorDefecto();

        //Anestesiologia.InitDatablesPatologiaClinica()
        Anestesiologia.InitDatablesMedicacionSuministrada();

        Anestesiologia.TiposClasificacionPaciente();
        Anestesiologia.ListarFactCatalogoServicios();

        //AtencionMedica.InitDatablesConsumoAtencion();

        Anestesiologia.Events();

    }

};
