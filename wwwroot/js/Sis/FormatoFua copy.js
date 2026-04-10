

const FormatoFua = {

    CodigoEstablecimiento: '',
    NombreEstablecimiento: '',

    IdInstitucionEducativa: 0,

    CargaInicial: async function () {

        this.CodigoEstablecimiento = (await Utilitario.SeleccionarParametro(280))['valorTexto']
        this.NombreEstablecimiento = (await Utilitario.SeleccionarParametro(205))['valorTexto']

        this.DataTableInstitucionesEducativas();

        await FormatoFua.CargarDatosCabecera();
    },


    

    
    ListarInstitucionEducativa: async function (Codigo, Nombre) {

        let formData = new FormData();

        formData.append("Codigo", Codigo);
        formData.append("Nombre", Nombre);

        const res = await HttpClient.Post(
            "/FormatoFua/ListarInstitucionEducativa?area=Comun",
            formData
        );

        oTable_TableListaInstitucionesEducativas.fnClearTable();

        if (isEmpty(res.data)) {
            alerta(2, "Error al listar las fuentes de financiamiento");
            return;
        }

        if (res.data.table.length > 0) {
            oTable_TableListaInstitucionesEducativas.fnAddData(res.data.table);
        }
    },

    


    CargarDatosCabecera: async function () {
        $("#txtCodigoIpress").val(FormatoFua.CodigoEstablecimiento);
        $("#txtNombreIpress").val(FormatoFua.NombreEstablecimiento);
    },
    

    Eventos: function () {
        /////////////////////////////////// EVENTS BUTTON ///////////////////////////////////
        
        
        /////////////////////////////////// EVENTS BUTTON ///////////////////////////////////

       

        /////////////////////////////////// EVENTS TABLE ///////////////////////////////////
        
        /////////////////////////////////// EVENTS TABLE ///////////////////////////////////

        

        ///////////////////////////////////BUSQUEDA//////////////////////////////////////////////////
        $(".search").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $("#btnBuscarAtenciones").click();
            }
        });

        

        $("#btnLimpiarBusqueda").on("click", async function () {
            $(".search").val("");
        });
        ///////////////////////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////GENERAR FUA/////////////////////////////////////////////////
        $("#btnModificar").on("click", async function () {
            
            // if (isEmpty(objrowTb)) {
            //     alerta(2, "Seleccione una atención por favor.");
            //     return false;
            // } else {
            //     if (objrowTb.idFuenteFinanciamiento == 3) {
            //         swal({
            //             title: "Mensaje",
            //             text: "¿Esta seguro que desea generar el formato FUA para la atención?",
            //             type: "question",
            //             showCancelButton: true,
            //             confirmButtonColor: "#4fb7fe",
            //             cancelButtonColor: "#6c6c6c",
            //             confirmButtonText: "Aceptar",
            //             cancelButtonText: "Cancelar",
            //         }).then(
            //             function () {
            //                 FormatoFua.GenerarFormatoFua(objrowTb.idCuentaAtencion);
            //                 //EvaluacionEmergencia.GenerarHojaEvaluacion(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero);
            //             },
            //             function (dimiss) { }
            //         );
            //     } else {
            //         alerta(2, "La atención no pertenece a un paciente SIS.");
            //         //    rutaInfoEme = objrowTb.rutaArchivoEmer;
            //         //    $("#visorDocumento").attr("src", PathServerFiles + rutaInfoEme);
            //         //    $('#modalVisorDocumento').modal('show');
            //     }
            // }
        });
        ////////////////////////////////////////////////////////////////////////////////////////////

        /////////////////////EVENTOS IMPRIMIR FUA/////////////////////////////
        //$('#tblAtencion tbody').on('click', '.ImprimeFuaSF', function () {
        //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atenciones.fnGetData(objrow);

        //    //console.log("RUTA: " + ruta);
        //    $("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivoFua);
        //    $('#modalVisorDocumento').modal('show');
        //});

        //$('#tblAtencion tbody').on('click', '.ImprimeFuaCF', function () {
        //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atenciones.fnGetData(objrow);
        //    imprimirDocumentoConFirma(row.idCuentaAtencion, row.codeFua, row.idDocFua, row.tipoFua);
        //});

        $("#tblAtencion tbody").on("click", ".ImprimeFuaSF", async function () {
            var objrow = oTable_atenciones
                .api(true)
                .row($(this).parents("tr")[0])
                .index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeFua); //KHOYOSI
            if (typeof firma === "undefined") {
                alerta(
                    "2",
                    "El documento no esta generado, se procedera a generar el documento."
                );
                const pdf = await Utilitario.GenerarFuaPdf(
                    row.idCuentaAtencion,
                    row.idCuentaAtencion
                );

                if (pdf) {
                    alerta("1", "Se generó el documento correctamente.");
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta(
                        "2",
                        "El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente."
                    );
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $("#tblAtencion tbody").on("click", ".ImprimeFuaCF", async function () {
            var objrow = oTable_atenciones
                .api(true)
                .row($(this).parents("tr")[0])
                .index();
            var row = oTable_atenciones.fnGetData(objrow);

            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeFua);
        });

        $("#tblAtencion tbody").on("click", ".FirmarFuaSF", async function () {
            var objrow = oTable_atenciones
                .api(true)
                .row($(this).parents("tr")[0])
                .index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codeFua); //KHOYOSI
            if (firma) {
                /*if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua); }*/
                if (permisoFirmaDigital == 1) {
                    await Utilitario.IniciarServicioFirmaBit4Id(row.codeFua);
                }
                if (permisoFirmaDigital == 2) {
                    await Utilitario.IniciarServicioFirmaPeru(row.codeFua);
                }
                //await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua);
            }
            Cargando(0);
        });
        ///////////////////////////////////////////////////////////////////////////////////////

        /////////////////////EVENTOS FIRMAR FUA FUA/////////////////////////////
        $("#tblAtencion tbody").on("click", ".Firma4IdentityFUA", function (event) {
            event.preventDefault();

            var objrow = oTable_atenciones
                .api(true)
                .row($(this).parents("tr")[0])
                .index();
            var row = oTable_atenciones.fnGetData(objrow);
            $(".bit4id-sign").attr(
                "action",
                "/Utilitario/FirmaComponent?area=ConsultaExterna"
            );
            $("#bit4id-document").text(`${PathServerFiles}${row.rutaArchivoFua}`);
            $("#bit4id-documentName").text(
                row.rutaArchivoFua
                    .substr(row.rutaArchivoFua.indexOf("/") + 1)
                    .substr(
                        row.rutaArchivoFua
                            .substr(row.rutaArchivoFua.indexOf("/") + 1)
                            .indexOf("/") + 1
                    )
            );
            $("#bit4id-documentID").text(
                `${row.rutaArchivoFua},${row.idCuentaAtencion},FUA,Sis,FormatoFua`
            );
            //imgVisto = "<?="http://".$_SERVER['HTTP_HOST'].str_replace("firmaDocumentos.php","images/isotipo.png",$_SERVER['PHP_SELF'])?>";
            //imgFormat = "[{\"align\":\"middle\",\"data_format\":{\"timezone\":\"America/Lima\",\"strtime\":\"%d/%m/%Y %H:%M:%S\"},\"format\":[\"Firmado digitalmente por:\",\"$(CN)s\",\"Fecha: $(date)s\"]}]";
            $(".bit4id-image").html("https://www.mgp.gob.pe/uploads/1565361369.png");
            $(".bit4id-paragraphFormat").html(
                "https://www.mgp.gob.pe/uploads/1565361369.png"
            );

            window.location.href =
                document.getElementsByClassName("bit4-link")[0].href;

            return false;
        });

        $("#tblAtencion tbody").on(
            "click",
            ".btnFirma4IdentityImprimeFUA",
            function () {
                var objrow = oTable_atenciones
                    .api(true)
                    .row($(this).parents("tr")[0])
                    .index();
                var row = oTable_atenciones.fnGetData(objrow);

                AbrirVisorDocumento("/4IdentitySignedFiles" + row.rutaArchivoFua, 0);
            }
        );
        ///////////////////////////////////////////////////////////////////////////////////////
    },

    ///////////////////////////////LISTAR ATENCIONES////////////////////////////////////////////////
    
    ///////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////GENERAR FUA////////////////////////////////////////////////
    async GenerarFormatoFua(idCuenta) {
        const datosfua = await FormatoFua.ModificarFua(idCuenta);
        if (datosfua.respuesta == 1) {
            const hojafua = await FormatoFua.GenerarFua(idCuenta);
        }
        //        console.log(datosfua);
        //
    },

    async ModificarFua(idCuenta) {
        var formData = new FormData();
        let datos;

        formData.append("idCuentaAtencion", idCuenta);
        try {
            Cargando(1);
            datos = await $.ajax({
                method: "POST",
                url: "/Atencion/CrearModificarFua?area=ConsultaExterna",
                data: formData,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta == 1) {
                    alerta(1, "Los datos se guardaron correctamente.");
                    return datos;
                } else {
                    alerta(3, "Hubo un error al guardar los datos del FUA.");
                    return 0;
                }
            } else {
                alert("La sesion ya expiro se volvera a recargar la pagina.");
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return datos;
    },

    async GenerarFua(idCuenta) {
        var formData = new FormData();
        let datos;

        formData.append("idCuentaAtencion", idCuenta);
        try {
            Cargando(1);
            datos = await $.ajax({
                method: "POST",
                url: "/Atencion/GenerarFormatoFua?area=ConsultaExterna",
                data: formData,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            Cargando(0);
            if (datos.session) {
                if (datos.respuesta == "Ok") {
                    alerta(1, datos.mensaje);
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta(3, datos.mensaje);
                }
            } else {
                alert("La sesion ya expiro se volvera a recargar la pagina");
                location.reload();
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return datos;
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////KHOYOSI/////////////////////////////////////////////
    ObtenerIdUsuarioSesion() {
        var idUser = 0;
        $.ajax({
            method: "POST",
            url: "/Utilitario/ObtenerIdUsuarioLogeado?area=Comun",
            //data: midata,
            //dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                idUser = datos;
            },
            error: function (msg) {
                alerta("ERROR", "Error aal obtener Id del Medico!", "2");
            },
        });

        return idUser;
    },
    /////////////////////////////////////////////////////////////////////

    //////////////////////////////INICIALIZAR TABLAS///////////////////////////////////////////
    
};

//////////////////////KHOYOSI////////////////////////////////
var imprimirDocumentoConFirma = function (idCuentaAtencion, code, idDoc, tipo) {
    var objrow = oTable_atenciones.api(true).row(".selected").data();
    //var midata = new FormData();

    var url =
        "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" +
        idCuentaAtencion +
        "&idRegistro=" +
        idCuentaAtencion +
        "&code=" +
        code +
        "&documentId=" +
        idDoc +
        "&tipo=" +
        tipo;
    //$('#ifrmReporte').attr('src', url);

    var request = new XMLHttpRequest();
    request.responseType = "blob";
    request.open("GET", url);
    request.onload = function () {
        var url = window.URL.createObjectURL(this.response);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        //a.download = this.response.name || "CE-" + $.now()
        a.download = "CE-FUA" + idCuentaAtencion + "-" + $.now();
        a.click();

        ListaAtencionesCE();
    };
    request.send();
};
//////////////////////////////////////////////////////////////////

$(document).ready(function () {
    FormatoFua.CargaInicial();
    //AdmisionEmergencia.IniciarCombos();
    FormatoFua.plugins();
    FormatoFua.initDatables();
    //AdmisionEmergencia.initDatablesConsumoAtencion();
    FormatoFua.Eventos();

    
});
