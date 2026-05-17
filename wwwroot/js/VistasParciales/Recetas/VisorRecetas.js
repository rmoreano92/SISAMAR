////var idRecetaRX = 0;
////var idRecetaPatCli = 0;
////var idRecetaAnatPat = 0;
////var idRecetaBs = 0;
////var idRecetaEcoGene = 0;
////var idRecetaEcoObs = 0;
////var idRecetaEcoObsProc = 0;
////var idRecetaFarm = 0;
////var idRecetaInterconsulta = 0; // jdelgado011
////var idRecetaTomografia = 0; // jdelgado011

var idBtnRecetaSelect = '';
var idRecetaSelect = 0;
var tipoRecetaSelect = '';
var flagEstadoCuenta = false;
var tabSelect = '';

var VisorReceta = {

    idRecetaRX: 0,
    idRecetaPatCli: 0,
    idRecetaAnatPat: 0,
    idRecetaBs: 0,
    idRecetaEcoGene: 0,
    idRecetaEcoObs: 0,
    idRecetaEcoObsProc: 0,
    idRecetaFarm: 0,
    idRecetaFarmAntimic: 0,
    idRecetaFarmIntSanit: 0,
    idRecetaInterconsulta: 0,
    idRecetaTomografia: 0,
    idRecetaSolicitudCQx: 0,

    idProcedimiento: 0,


    codeSelect: '',
    idBtnSelect: '',

    AbrirVisorRecetas(recetas) {
        //console.log(recetas);
        //console.log(recetas.length);

        //console.log('recetas', recetas)
        this.LimpiarVisorRecetas();
        if (recetas.length > 0) {
            var tab = this.CargarDatosRecetas(recetas);
            //this.AbrirVisor();
            $('#modalRecetaImprime').modal('show');
            $(tab).click();
        } else {
            alerta(2, 'No existen recetas para mostrar.');
        }        

    },

    CargarDatosRecetas(recetas) {
        var tab = ""
        $(recetas).each(function (i, obj) {            
            if (obj.idReceta > 0) {
                //console.log(obj.idReceta);
                switch (obj.idPuntoCarga) {
                    case 12: VisorReceta.idRecetaInterconsulta = obj.idReceta; $("#interconsultasRece").attr("data-rec", obj.idReceta); $("#interconsultasRece").attr("data-code", obj.code); tab = "#interconsultasRece"; break;
                    case 22: VisorReceta.idRecetaTomografia = obj.idReceta; $("#tomografiaRece").attr("data-rec", obj.idReceta); $("#tomografiaRece").attr("data-code", obj.code); tab = "#tomografiaRece"; break;
                    case 21: VisorReceta.idRecetaRX = obj.idReceta; $("#rayosRece").attr("data-rec", obj.idReceta); $("#rayosRece").attr("data-code", obj.code); tab = "#rayosRece"; break;
                    case 20: VisorReceta.idRecetaEcoGene = obj.idReceta; $("#ecoGeneRece").attr("data-rec", obj.idReceta); $("#ecoGeneRece").attr("data-code", obj.code); tab = "#ecoGeneRece"; break;
                    case 24: VisorReceta.idRecetaEcoObsProc = obj.idReceta; $("#ecoObstProcRece").attr("data-rec", obj.idReceta); $("#ecoObstProcRece").attr("data-code", obj.code); tab = "#ecoObstProcRece"; break;
                    case 23: VisorReceta.idRecetaEcoObs = obj.idReceta; $("#ecoObstRece").attr("data-rec", obj.idReceta); $("#ecoObstRece").attr("data-code", obj.code); tab = "#ecoObstRece"; break;
                    case 11: VisorReceta.idRecetaBs = obj.idReceta; $("#bancoSangreRece").attr("data-rec", obj.idReceta); $("#bancoSangreRece").attr("data-code", obj.code); tab = "#bancoSangreRece"; break;
                    case 3: VisorReceta.idRecetaAnatPat = obj.idReceta; $("#anatoPatoRece").attr("data-rec", obj.idReceta); $("#anatoPatoRece").attr("data-code", obj.code); tab = "#anatoPatoRece"; break;
                    case 2: VisorReceta.idRecetaPatCli = obj.idReceta; $("#patoClinicaRece").attr("data-rec", obj.idReceta); $("#patoClinicaRece").attr("data-code", obj.code); tab = "#patoClinicaRece"; break;
                    case 5:
                        if (obj.esRecetaAntimicrobiano == 1) {
                            VisorReceta.idRecetaFarmAntimic = obj.idReceta; $("#farmaciaAntimicRece").attr("data-rec", obj.idReceta); $("#farmaciaAntimicRece").attr("data-code", obj.code); tab = "#farmaciaAntimicRece"; break;
                        } else if (obj.esRecetaIntervencionSanitaria == 1) {
                            VisorReceta.idRecetaFarmIntSanit = obj.idReceta; $("#farmaciaIntSanitRece").attr("data-rec", obj.idReceta); $("#farmaciaIntSanitRece").attr("data-code", obj.code); tab = "#farmaciaIntSanitRece"; break;
                        } else {
                            VisorReceta.idRecetaFarm = obj.idReceta; $("#farmaciaRece").attr("data-rec", obj.idReceta); $("#farmaciaRece").attr("data-code", obj.code); tab = "#farmaciaRece"; break;
                        }
                    case 1060: VisorReceta.idRecetaSolicitudCQx = obj.idReceta; $("#solicitudCQxRece").attr("data-rec", obj.idReceta); $("#solicitudCQxRece").attr("data-code", obj.code); tab = "#solicitudCQxRece"; break;

                    default: break;
                }
                $(tab).show();
            }

            //console.log('idRecetaTomografia', idRecetaTomografia)
        });
        //console.log("El tab: " + tab);

        //$('#procedimientos').show(); // jdelgado borrar

        return tab;
    },

    LimpiarVisorRecetas() {
        VisorReceta.idRecetaRX = 0;
        VisorReceta.idRecetaPatCli = 0;
        VisorReceta.idRecetaAnatPat = 0;
        VisorReceta.idRecetaBs = 0;
        VisorReceta.idRecetaEcoGene = 0;
        VisorReceta.idRecetaEcoObs = 0;
        VisorReceta.idRecetaEcoObsProc = 0;
        VisorReceta.idRecetaFarm = 0;
        VisorReceta.idRecetaFarmAntimic = 0;
        VisorReceta.idRecetaFarmIntSanit = 0;
        VisorReceta.idRecetaInterconsulta = 0; 
        VisorReceta.idRecetaTomografia = 0; 
        VisorReceta.idRecetaSolicitudCQx = 0;

        VisorReceta.codeSelect = '';
        VisorReceta.idBtnSelect = '';

        $(".btnReceta").hide();
        $(".btnReceta").attr("data-rec", "");
        $(".btnReceta").attr("data-code", "");
    },

    CerrarVisorRecetas() {
        VisorReceta.idRecetaRX = 0;
        VisorReceta.idRecetaPatCli = 0;
        VisorReceta.idRecetaAnatPat = 0;
        VisorReceta.idRecetaBs = 0;
        VisorReceta.idRecetaEcoGene = 0;
        VisorReceta.idRecetaEcoObs = 0;
        VisorReceta.idRecetaEcoObsProc = 0;
        VisorReceta.idRecetaFarm = 0;
        VisorReceta.idRecetaFarmAntimic = 0;
        VisorReceta.idRecetaFarmIntSanit = 0;
        VisorReceta.idRecetaInterconsulta = 0; // jdelgado011
        VisorReceta.idRecetaTomografia = 0; // jdelgado011
        VisorReceta.idRecetaSolicitudCQx = 0;

        idBtnRecetaSelect = '';
        flagEstadoCuenta = false;
        tabSelect = '';

        VisorReceta.codeSelect = '';
        VisorReceta.idBtnSelect = '';

        $("#ImpresionReceta-nav-content .tab-pane").removeClass('active');
        $("#ImpresionReceta-nav-content .tab-pane").removeClass('in');
        $("#ImpresionReceta-nav-content .tab-pane").removeClass('fade');
        $("#ImpresionReceta-nav-content .tab-pane").addClass('fade');
        $('#procedimientos').removeClass('active'); // jdelgado procedimientos borrar
        $('.btnReceta').removeClass('active');
        $("#ifrmReceta").attr('src', '');
               
        $('#modalRecetaImprime').modal('hide');
    },

    ListarDocumentoFirmaDigital: function (idCuentaAtencion) {
        let formData = new FormData();
        formData.append("idCuentaAtencion", idCuentaAtencion)

        return HttpClient.Post('/Utilitario/ListarDocumentoFirmaDigital', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table
                    } else {
                        Cargando(0)
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },

    /////////////////////////////////////////////////////////////////////
    showHideTabs(idReceta, tab, code) {
        if (idReceta == 0 || typeof idReceta === 'undefined') {
            //$(`a[href="${tab}"]`).closest('li').hide()
            $(tab).hide()
        } else {
            //$(`a[href="${tab}"]`).closest('li').show()            
            $(tab).show()
            tabSelect = tab
            //$(`a[href="${tab}"]`).click();
            //$(`.nav-tabs a[href="${tab}"]`).tab('show');
        }
    },

    async imprimirRecetaConFirma(idCuentaAtencion, idRegistro, code, idDoc, tipo) {
        Cargando(1);
        var url = await "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url);
        request.onload = function () {
            if (this.response.size > 0) {
                var url = window.URL.createObjectURL(this.response);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                //a.download = this.response.name || "CE-" + $.now()
                a.download = tipo + idCuentaAtencion + "-" + $.now()
                //a.click();


                AbrirVisorDocumento(url, 1);
                if (tipo == 'REC-F') { $("#farmaciaRece-tab").click(); }
                if (tipo == 'REC-RX') { $("#rayosRece-tab").click(); }
                if (tipo == 'REC-EO') { $("#ecoObstRece-tab").click(); }
                if (tipo == 'REC-EOP') { $("#ecoObstProcRece-tab").click(); }
                if (tipo == 'REC-EG') { $("#ecoGeneRece-tab").click(); }
                if (tipo == 'REC-PC') { $("#patoClinicaRece-tab").click(); }
                if (tipo == 'REC-AP') { $("#anatoPatoRece-tab").click(); }
                if (tipo == 'REC-BS') { $("#bancoSangreRece-tab").click(); }
                if (tipo == 'REC-I') { $("#interconsulta-tab").click(); }
                if (tipo == 'REC-T') { $("#tomografiaRece-tab").click(); }
                if (tipo == 'REC-CQx') { $("#solicitudCQx-tab").click(); }
                //ListaAtencionesCE();
            } else {
                alerta(2, "El documento aún no está firmado digitalmente.")
            }
            Cargando(0);
        }
        request.send();
    },

    DevolverTipoReceta(tipo) {
        var nroReceta = '';
        switch (tipo) {
            case 'REC-F': nroReceta = VisorReceta.idRecetaFarm; break;
            case 'REC-PC': nroReceta = VisorReceta.idRecetaPatCli; break;
            case 'REC-AP': nroReceta = VisorReceta.idRecetaAnatPat; break;
            case 'REC-BS': nroReceta = VisorReceta.idRecetaBs; break;
            case 'REC-EG': nroReceta = VisorReceta.idRecetaEcoGene; break;
            case 'REC-EO': nroReceta = VisorReceta.idRecetaEcoObs; break;
            case 'REC-EOP': nroReceta = VisorReceta.idRecetaEcoObsProc; break;
            case 'REC-RX': nroReceta = VisorReceta.idRecetaRX; break;
            case 'REC-I': nroReceta = VisorReceta.idRecetaInterconsulta; break;
            case 'REC-T': nroReceta = VisorReceta.idRecetaTomografia; break;
            case 'REC-CQx': nroReceta = VisorReceta.idRecetaSolicitudCQx; break;

            default: break;
        }
               
        return nroReceta;
    },

    Eventos() {
        $('#btnCerrarRecetas').on('click', function () {
            VisorReceta.CerrarVisorRecetas();
        });

        $('#btnCerrarRecetasV2').on('click', function () {
            VisorReceta.CerrarVisorRecetas();
        });


        //-----------------------------------------CARGAR RECETA PDF A LA VISTA-----------------------------------------//
        $('.btnReceta').on('click', async function () {
            console.log("ID RECETA: " + "#" + $(this).attr('id'));
            var idBtnReceta = "#" + $(this).attr('id');
            //var tipoReceta = $(idBtnReceta).attr("data-name");
            var idReceta = $(idBtnReceta).attr("data-rec");
            var codeReceta = $(idBtnReceta).attr("data-code");
            var tipo = $(idBtnReceta).attr("data-name");
            VisorReceta.codeSelect = codeReceta;
            VisorReceta.idBtnSelect = idBtnReceta;

            if (tipo == 'REC-F') {
                tipo = 'F'
            }
            
            Cargando(1);
            $('#btnifrmReceta').hide();               //KHOYOSI                        
            $('#btnFirmaRecetaPorLote').hide();               //JELGADO                        
            $('#ifrmReceta').attr('src', '');               //KHOYOSI
            $('.btnReceta').removeClass('active');
            $('#procedimientos').removeClass('active'); // jdelgado procedimientos borrar
            
            console.log(idReceta, codeReceta)
            
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(codeReceta)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarRecetaPdf(Variables.IdCuentaAtencion, idReceta, tipo);
                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.');
                    const recetas = await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, Variables.IdServicioIngreso, Variables.IdMedico);
                    VisorReceta.CargarDatosRecetas(recetas);
                    $(idBtnReceta).click();
                }
            } else {
                if (firma.statusFirma == 0) {
                    $('#btnifrmReceta').show();
                    $('#btnFirmaRecetaPorLote').show();               //JELGADO  
                    url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI
                } else {
                    //url = PathServerFiles + '/4IdentitySignedFiles' + firma.rutaArchivo;               //KHOYOSI
                    firma.rutaArchivo = firma.rutaArchivo.replace('/UNSIGNED','')
                    url = PathServerFiles + '/SIGNED' + firma.rutaArchivo;               //KHOYOSI
                }
                //idRecetaSelect = idReceta;
                //tipoRecetaSelect = tipoReceta;
                $(idBtnReceta).addClass('active');
                //$('#TituloVisorReceta').append("");
                $('#TituloVisorReceta').text("Receta N° " + idReceta);
                $('#ifrmReceta').attr('src', url);
            }
            Cargando(0);
        });
        
        $("#btnifrmReceta").on("click", async function () {
            
            Utilitario.TipoArchivoFirmar = 'REC';
            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(VisorReceta.codeSelect)               //KHOYOSI            
            if (firma) {
                //if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(VisorReceta.codeSelect); }
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(VisorReceta.codeSelect); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(VisorReceta.codeSelect); }
                //await Utilitario.AbrirServicioFirmaBit4Id(VisorReceta.codeSelect);
            }
            Cargando(0);
        });

        $("#btnifrmRecetaFirmado").on("click", async function () {
            
            await Utilitario.AbrirDocumentoFirmadoBit4Id(VisorReceta.codeSelect);
        });


        $("#btnFirmaRecetaPorLote").on("click", async function () {

            Cargando(1)
            Utilitario.TipoArchivoFirmar = 'REC';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(Variables.IdCuentaAtencion, '', "'REC'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data);
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru(Variables.IdCuentaAtencion, "'REC'");
            }                           
            Cargando(0)
        });

        $('#procedimientos').on('click', async function () { // JDELGADO J0 CAMBIO METODO IMPRESION}

            let procedimientos = await VisorReceta.ListarDocumentoFirmaDigital(Variables.IdCuentaAtencion)

            const firma = await Utilitario.SeleccionarFirmaDigitalV2(procedimientos[0].codeProc)               //KHOYOSI

            let url = PathServerFiles + firma.rutaArchivo


            console.log('firma', firma)

            $('.btnReceta').removeClass('active');
            $('#procedimientos').addClass('active');
            //$('#TituloVisorReceta').append("");
            $('#TituloVisorReceta').text("N° Orden");
            $('#ifrmReceta').attr('src', url);

            //var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            //var row = oTable_atenciones.fnGetData(objrow);

            //Cargando(1);
            //const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeProc)               //KHOYOSI            
            //if (typeof firma === 'undefined') {
            //    alerta('2', 'El documento no esta generado, Vuelva a guardar la atencion.')

            //} else {
            //    AbrirVisorDocumento(firma.rutaArchivo, 0);
            //}
            //Cargando(0);
        })

    }
}