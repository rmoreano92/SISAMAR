import { FormatoFua } from "./FormatoFua/FormatoFua.js"

$(document).ready(function() {
    let formatoFua = new FormatoFua()

    formatoFua.init()
})

// const FormatoFua = {

//     CodigoEstablecimiento: '',
//     NombreEstablecimiento: '',

//     IdInstitucionEducativa: 0,

//     CargaInicial: async function () {

//         this.CodigoEstablecimiento = (await Utilitario.SeleccionarParametro(280))['valorTexto']
//         this.NombreEstablecimiento = (await Utilitario.SeleccionarParametro(205))['valorTexto']

//         this.DataTableInstitucionesEducativas();

//         await FormatoFua.CargarDatosCabecera();
//     },

//     plugins: function () {
//         $(".maskFecha").datepicker({
//             todayHighlight: true,
//             autoclose: true,
//             orientation: "bottom",
//         });

//         $.mask.definitions["D"] = "[0123]";
//         $.mask.definitions["d"] = "[123456789]";
//         $.mask.definitions["M"] = "[01]";
//         $.mask.definitions["m"] = "[0123456789]";
//         $.mask.definitions["a"] = "[12]";
//         $.mask.definitions["b"] = "[0123456789]";
//         $.mask.definitions["c"] = "[0123456789]";
//         $.mask.definitions["d"] = "[0123456789]";
//         $(".maskFecha").mask("Dd/Mm/abcd");

//         $.mask.definitions["H"] = "[012]";
//         $.mask.definitions["N"] = "[012345]";
//         $.mask.definitions["n"] = "[0123456789]";
//         $(".maskHora").mask("Hn:Nn");

//         $(".chzn-select").chosen({ allow_single_deselect: true });
//         $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
//     },

//     DataTableInstitucionesEducativas: function () {
//         let params = {
//             paging: true,
//             bFilter: false,
//             ordering: false,
//             info: false,
//             responsive: false,
//             autoWidth: false,
//             columns: [
//                 {
//                     data: "codigo",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     data: "nombre",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     data: "ubigeo",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     data: "direccion",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//             ],
//         };

//         oTable_TableListaInstitucionesEducativas = $(
//             "#tblListaInstitucionesEducativas"
//         ).dataTable(params);
//     },

//     Listar_m_IIEE_Grado: async function (IdNivel) {
//         Cargando(1);

//         let formData = new FormData();

//         formData.append("IdNivel", IdNivel);

//         const res = await HttpClient.Post(
//             "/FormatoFua/Listar_m_IIEE_Grado?area=Comun",
//             formData
//         );

//         $("#cboGradoInstitucionEducativa").empty();

//         if (isEmpty(res.data)) {
//             alerta(2, "Error al listar las fuentes de financiamiento");
//             return;
//         }
//         $(res.data.table).each(function (i, obj) {
//             $("#cboGradoInstitucionEducativa").append(
//                 `<option value="${obj.idGrado}">${obj.grado}</option>`
//             );
//         });
//         $("#cboGradoInstitucionEducativa").val(0);
//         $(".chzn-select").chosen().trigger("chosen:updated");

//         Cargando(0);
//     },


//     SeleccionarSisFuaAtencion: async function (IdCuentaAtencion) {
//         let formData = new FormData();

//         formData.append('IdCuentaAtencion', IdCuentaAtencion);

//         const res = await HttpClient.Post('/FormatoFua/SeleccionarSisFuaAtencion?area=Comun', formData);

//         if (isEmpty(res.data)) {
//             alerta(2, 'Error al seleccionar la atención');
//             return
//         }

//         if (res.data.table.length > 0) {
//             return res.data.table[0];
//         }
//     },


//     CargarDatosCabecera: async function () {
//         $("#txtCodigoIpress").val(FormatoFua.CodigoEstablecimiento);
//         $("#txtNombreIpress").val(FormatoFua.NombreEstablecimiento);
//     },
//     CargarDatosAtencion: async function (IdCuentaAtencion) {
//         let sisFuaAtencion = await this.SeleccionarSisFuaAtencion(IdCuentaAtencion)

//         // if (isEmpty(sisFuaAtencion)) {
//         //     alerta(2, "Error al cargar los datos de la atención");
//         //     return;
//         // }

//         console.log(sisFuaAtencion);
//         $("#cboComponenteRegimen").val(sisFuaAtencion.fuaComponente);
//         $("#txtDisaFormatoAsegurado").val(sisFuaAtencion.afiliacionDisa);
//         $("#txtTipoFormatoAsegurado").val(sisFuaAtencion.afiliacionTipoFormato);
//         $("#txtNroFormatoAsegurado").val(sisFuaAtencion.afiliacionNroFormato);
//         $("#txtNroHistoriaClinica").val(sisFuaAtencion.fuaNrohistoria);
//         $("#cboTipoDocumentoPaciente").val(sisFuaAtencion.documentoTipo);
//         $("#txtNroDocumentoPaciente").val(sisFuaAtencion.documentoNumero);
//         $("#txtApellidosNombresPaciente").val(sisFuaAtencion.apellidosNombresPaciente);
//         $("#txtFechaNacimientoPaciente").datepicker("setDate", FormatearFecha(sisFuaAtencion.fnacimiento));
//         $("#txtEdadPaciente").val(sisFuaAtencion.edad);
//         $("#cboSexoPaciente").val(sisFuaAtencion.genero);
//         $("#cboEtniaPaciente").val(sisFuaAtencion.fuaetnia);
//         // $("#cboAseguradoOtrasIafas").val(sisFuaAtencion.peso);
//         // $("#txtCodigoAseguradoOtraIafa").val(sisFuaAtencion.peso);
//         $("#cboSaludMaterna").val(sisFuaAtencion.fuaCondicionMaterna);
//         $("#txtFechaParto").datepicker("setDate", FormatearFecha(sisFuaAtencion.fuaFechaParto));
//         $("#txtNroAutorizacion").val(sisFuaAtencion.fuaCodAutorizacion);
//         $("#txtMonto").val(sisFuaAtencion.fuaConceptoPrMonto);
//         // $("#txtCodigoAcreditacion").val(sisFuaAtencion.peso);

//         $('.chzn-select').chosen().trigger("chosen:updated")
//     },

//     Eventos: function () {
//         /////////////////////////////////// EVENTS BUTTON ///////////////////////////////////
//         $("#btnModalInstitucionEducativa").on("click", function () {
//             $("#modalInstitucionEducativa").modal("show");
//         });
//         $("#btnCerrarModalInstitucionesEducativas").on("click", function () {
//             $("#modalInstitucionEducativa").modal("hide");
//         });
//         $("#btnBuscarInstitucionEducativa").on("click", async function () {
//             let codigo = $("#txtCodigoInstitucionEducativaBuscar").val();
//             let nombre = $("#txtNombreInstitucionEducativaBuscar").val();

//             // if(codigo == '' && nombre == '') {
//             //     alerta(2, 'Debe ingresar al menos un dato para la busqueda.')
//             //     return false
//             // }

//             Cargando(1)

//             await FormatoFua.ListarInstitucionEducativa(codigo, nombre);

//             Cargando(0)
//         });
//         $("#btnLimpiarBusquedaInstitucionEducativa").on("click", async function () {
//             $("#txtCodigoInstitucionEducativaBuscar").val('');
//             $("#txtNombreInstitucionEducativaBuscar").val('');
//             oTable_TableListaInstitucionesEducativas.fnClearTable()
//         });
//         /////////////////////////////////// EVENTS BUTTON ///////////////////////////////////

//         /////////////////////////////////// EVENTS SELECT ///////////////////////////////////
//         $("#cboNivelInstitucionEducativa").on("change", async function () {
//             let idNivel = $(this).val();

//             await FormatoFua.Listar_m_IIEE_Grado(idNivel);
//         });
//         /////////////////////////////////// EVENTS SELECT ///////////////////////////////////

//         /////////////////////////////////// EVENTS TABLE ///////////////////////////////////
//         $('#tblListaInstitucionesEducativas').on("click", "tr", function () {
//             if ($(this).hasClass("selected")) {
//                 $(this).removeClass("selected")
//             } else {
//                 oTable_TableListaInstitucionesEducativas.$('tr.selected').removeClass('selected')
//                 $(this).addClass("selected")
//             }
//         })
//         $('#tblListaInstitucionesEducativas').on("dblclick", "tr", function () {
//             oTable_TableListaInstitucionesEducativas.$('tr.selected').removeClass('selected')
//             $(this).addClass("selected")

//             let objRow = oTable_TableListaInstitucionesEducativas.api(true).row('.selected').data()

//             if(isEmpty(objRow)) {
//                 alerta(2, "Debe seleccionar un registro.")
//                 return
//             }

//             FormatoFua.IdInstitucionEducativa = objRow.idInstitucionEducativa
//             $("#txtCodigoInstitucionEducativa").val(objRow.codigo)
//             $("#txtDescripcionInstitucionEducativa").val(objRow.nombre)

//             $("#modalInstitucionEducativa").modal("hide");

//         })
//         /////////////////////////////////// EVENTS TABLE ///////////////////////////////////

//         $("#tblAtencion tbody").on("click", "tr", function (e) {
//             e.stopPropagation();
//             //console.log("SELECCIONAR TABLA");
//             if ($(this).hasClass("selected")) {
//                 //$(this).removeClass('selected');
//             } else {
//                 oTable_atenciones.$("tr.selected").removeClass("selected");
//                 $(this).addClass("selected");
//             }

//             //var pos = oTable_atencionesEmer.api(true).row($(this)).index();
//             //var row = oTable_atencionesEmer.fnGetData(pos);
//         });

//         ///////////////////////////////////BUSQUEDA//////////////////////////////////////////////////
//         $(".search").keypress(function (e) {
//             if (e.which == 13) {
//                 e.preventDefault();
//                 $("#btnBuscarAtenciones").click();
//             }
//         });

//         $("#btnBuscarAtenciones").on("click", async function () {
//             //$('#lblMedicoProgramado').html('');
//             var filtro = "";

//             if (
//                 $("#txtNroCuentaBuscar").val() == "" &&
//                 $("#txtNroDniBuscar").val() == "" &&
//                 $("#txtNroHistoriaBuscar").val() == "" &&
//                 $("#txtApPaternoBuscar").val() == "" &&
//                 $("#txtApMaternoBuscar").val() == ""
//             ) {
//                 alerta("2", "Ingrese almenos un campo para la busqueda.");
//                 return false;
//             } else {
//                 //$('#lblMedicoProgramado').html("Medico: " + $('#cboConsultorio>option:selected').attr("med"))
//                 if ($("#txtNroCuentaBuscar").val() != "") {
//                     filtro =
//                         filtro +
//                         " AND ate.IdCuentaAtencion = " +
//                         $("#txtNroCuentaBuscar").val();
//                 }
//                 if ($("#txtNroDniBuscar").val() != "") {
//                     filtro =
//                         filtro +
//                         " AND pac.NroDocumento = '" +
//                         $("#txtNroDniBuscar").val() +
//                         "'";
//                 }
//                 if ($("#txtNroHistoriaBuscar").val() != "") {
//                     filtro =
//                         filtro +
//                         " AND pac.NroHistoriaClinica = '" +
//                         $("#txtNroHistoriaBuscar").val() +
//                         "'";
//                 }
//                 if ($("#txtApPaternoBuscar").val() != "") {
//                     filtro =
//                         filtro +
//                         " AND pac.ApellidoPaterno LIKE '" +
//                         $("#txtApPaternoBuscar").val() +
//                         "%'";
//                 }
//                 if ($("#txtApMaternoBuscar").val() != "") {
//                     filtro =
//                         filtro +
//                         " AND pac.ApellidoMaterno LIKE '" +
//                         $("#txtApMaternoBuscar").val() +
//                         "%'";
//                 }

//                 const atenciones = await FormatoFua.ListarAtenciones(filtro);
//             }
//             $("html, body").animate(
//                 {
//                     scrollTop: $(".head").offset().top,
//                 },
//                 1000
//             );
//         });

//         $("#btnLimpiarBusqueda").on("click", async function () {
//             $(".search").val("");
//         });
//         ///////////////////////////////////////////////////////////////////////////////////////////////////

//         /////////////////////////////////GENERAR FUA/////////////////////////////////////////////////
//         $("#btnModificar").on("click", async function () {
//             var objrowTb = oTable_atenciones.api(true).row(".selected").data();

//             if (isEmpty(objrowTb)) {
//                 alerta(2, "Seleccione una atención por favor.");
//                 return false;
//             }

//             await FormatoFua.CargarDatosAtencion(objrowTb.idCuentaAtencion)
//             MostrarAreaRegistro()

//             // if (isEmpty(objrowTb)) {
//             //     alerta(2, "Seleccione una atención por favor.");
//             //     return false;
//             // } else {
//             //     if (objrowTb.idFuenteFinanciamiento == 3) {
//             //         swal({
//             //             title: "Mensaje",
//             //             text: "¿Esta seguro que desea generar el formato FUA para la atención?",
//             //             type: "question",
//             //             showCancelButton: true,
//             //             confirmButtonColor: "#4fb7fe",
//             //             cancelButtonColor: "#6c6c6c",
//             //             confirmButtonText: "Aceptar",
//             //             cancelButtonText: "Cancelar",
//             //         }).then(
//             //             function () {
//             //                 FormatoFua.GenerarFormatoFua(objrowTb.idCuentaAtencion);
//             //                 //EvaluacionEmergencia.GenerarHojaEvaluacion(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.idServicio, objrowTb.idNumero);
//             //             },
//             //             function (dimiss) { }
//             //         );
//             //     } else {
//             //         alerta(2, "La atención no pertenece a un paciente SIS.");
//             //         //    rutaInfoEme = objrowTb.rutaArchivoEmer;
//             //         //    $("#visorDocumento").attr("src", PathServerFiles + rutaInfoEme);
//             //         //    $('#modalVisorDocumento').modal('show');
//             //     }
//             // }
//         });
//         ////////////////////////////////////////////////////////////////////////////////////////////

//         /////////////////////EVENTOS IMPRIMIR FUA/////////////////////////////
//         //$('#tblAtencion tbody').on('click', '.ImprimeFuaSF', function () {
//         //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
//         //    var row = oTable_atenciones.fnGetData(objrow);

//         //    //console.log("RUTA: " + ruta);
//         //    $("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivoFua);
//         //    $('#modalVisorDocumento').modal('show');
//         //});

//         //$('#tblAtencion tbody').on('click', '.ImprimeFuaCF', function () {
//         //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
//         //    var row = oTable_atenciones.fnGetData(objrow);
//         //    imprimirDocumentoConFirma(row.idCuentaAtencion, row.codeFua, row.idDocFua, row.tipoFua);
//         //});

//         $("#tblAtencion tbody").on("click", ".ImprimeFuaSF", async function () {
//             var objrow = oTable_atenciones
//                 .api(true)
//                 .row($(this).parents("tr")[0])
//                 .index();
//             var row = oTable_atenciones.fnGetData(objrow);

//             Cargando(1);
//             const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeFua); //KHOYOSI
//             if (typeof firma === "undefined") {
//                 alerta(
//                     "2",
//                     "El documento no esta generado, se procedera a generar el documento."
//                 );
//                 const pdf = await Utilitario.GenerarFuaPdf(
//                     row.idCuentaAtencion,
//                     row.idCuentaAtencion
//                 );

//                 if (pdf) {
//                     alerta("1", "Se generó el documento correctamente.");
//                     $("#btnBuscarAtenciones").click();
//                 } else {
//                     alerta(
//                         "2",
//                         "El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente."
//                     );
//                 }
//             } else {
//                 AbrirVisorDocumento(firma.rutaArchivo, 0);
//             }
//             Cargando(0);
//         });

//         $("#tblAtencion tbody").on("click", ".ImprimeFuaCF", async function () {
//             var objrow = oTable_atenciones
//                 .api(true)
//                 .row($(this).parents("tr")[0])
//                 .index();
//             var row = oTable_atenciones.fnGetData(objrow);

//             await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeFua);
//         });

//         $("#tblAtencion tbody").on("click", ".FirmarFuaSF", async function () {
//             var objrow = oTable_atenciones
//                 .api(true)
//                 .row($(this).parents("tr")[0])
//                 .index();
//             var row = oTable_atenciones.fnGetData(objrow);

//             Cargando(1);
//             const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codeFua); //KHOYOSI
//             if (firma) {
//                 /*if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua); }*/
//                 if (permisoFirmaDigital == 1) {
//                     await Utilitario.IniciarServicioFirmaBit4Id(row.codeFua);
//                 }
//                 if (permisoFirmaDigital == 2) {
//                     await Utilitario.IniciarServicioFirmaPeru(row.codeFua);
//                 }
//                 //await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua);
//             }
//             Cargando(0);
//         });
//         ///////////////////////////////////////////////////////////////////////////////////////

//         /////////////////////EVENTOS FIRMAR FUA FUA/////////////////////////////
//         $("#tblAtencion tbody").on("click", ".Firma4IdentityFUA", function (event) {
//             event.preventDefault();

//             var objrow = oTable_atenciones
//                 .api(true)
//                 .row($(this).parents("tr")[0])
//                 .index();
//             var row = oTable_atenciones.fnGetData(objrow);
//             $(".bit4id-sign").attr(
//                 "action",
//                 "/Utilitario/FirmaComponent?area=ConsultaExterna"
//             );
//             $("#bit4id-document").text(`${PathServerFiles}${row.rutaArchivoFua}`);
//             $("#bit4id-documentName").text(
//                 row.rutaArchivoFua
//                     .substr(row.rutaArchivoFua.indexOf("/") + 1)
//                     .substr(
//                         row.rutaArchivoFua
//                             .substr(row.rutaArchivoFua.indexOf("/") + 1)
//                             .indexOf("/") + 1
//                     )
//             );
//             $("#bit4id-documentID").text(
//                 `${row.rutaArchivoFua},${row.idCuentaAtencion},FUA,Sis,FormatoFua`
//             );
//             //imgVisto = "<?="http://".$_SERVER['HTTP_HOST'].str_replace("firmaDocumentos.php","images/isotipo.png",$_SERVER['PHP_SELF'])?>";
//             //imgFormat = "[{\"align\":\"middle\",\"data_format\":{\"timezone\":\"America/Lima\",\"strtime\":\"%d/%m/%Y %H:%M:%S\"},\"format\":[\"Firmado digitalmente por:\",\"$(CN)s\",\"Fecha: $(date)s\"]}]";
//             $(".bit4id-image").html("https://www.mgp.gob.pe/uploads/1565361369.png");
//             $(".bit4id-paragraphFormat").html(
//                 "https://www.mgp.gob.pe/uploads/1565361369.png"
//             );

//             window.location.href =
//                 document.getElementsByClassName("bit4-link")[0].href;

//             return false;
//         });

//         $("#tblAtencion tbody").on(
//             "click",
//             ".btnFirma4IdentityImprimeFUA",
//             function () {
//                 var objrow = oTable_atenciones
//                     .api(true)
//                     .row($(this).parents("tr")[0])
//                     .index();
//                 var row = oTable_atenciones.fnGetData(objrow);

//                 AbrirVisorDocumento("/4IdentitySignedFiles" + row.rutaArchivoFua, 0);
//             }
//         );
//         ///////////////////////////////////////////////////////////////////////////////////////
//     },

//     ///////////////////////////////LISTAR ATENCIONES////////////////////////////////////////////////
//     async ListarAtenciones(filtro) {
//         var formData = new FormData();
//         let datos;

//         formData.append("lcFiltro", filtro);
//         oTable_atenciones.fnClearTable();
//         try {
//             Cargando(1);
//             datos = await $.ajax({
//                 method: "POST",
//                 url: "/FormatoFua/ListarAtenciones?area=Sis",
//                 data: formData,
//                 dataType: "json",
//                 cache: false,
//                 processData: false,
//                 contentType: false,
//             });

//             Cargando(0);
//             if (datos.session) {
//                 if (datos.lsAtenciones.table.length > 0) {
//                     dataAtenciones = datos.lsAtenciones.table;
//                     oTable_atenciones.fnAddData(dataAtenciones);
//                 } else {
//                     dataAtenciones = {};
//                 }
//             } else {
//                 alert("La sesion ya expiro se volvera a recargar la pagina");
//                 location.reload();
//             }
//         } catch (error) {
//             //console.error(error)
//             Cargando(0);
//             alerta(3, error);
//         }

//         return datos;
//     },
//     ///////////////////////////////////////////////////////////////////////////////////////////////

//     ///////////////////////////////GENERAR FUA////////////////////////////////////////////////
//     async GenerarFormatoFua(idCuenta) {
//         const datosfua = await FormatoFua.ModificarFua(idCuenta);
//         if (datosfua.respuesta == 1) {
//             const hojafua = await FormatoFua.GenerarFua(idCuenta);
//         }
//         //        console.log(datosfua);
//         //
//     },

//     async ModificarFua(idCuenta) {
//         var formData = new FormData();
//         let datos;

//         formData.append("idCuentaAtencion", idCuenta);
//         try {
//             Cargando(1);
//             datos = await $.ajax({
//                 method: "POST",
//                 url: "/Atencion/CrearModificarFua?area=ConsultaExterna",
//                 data: formData,
//                 dataType: "json",
//                 cache: false,
//                 processData: false,
//                 contentType: false,
//             });

//             Cargando(0);
//             if (datos.session) {
//                 if (datos.respuesta == 1) {
//                     alerta(1, "Los datos se guardaron correctamente.");
//                     return datos;
//                 } else {
//                     alerta(3, "Hubo un error al guardar los datos del FUA.");
//                     return 0;
//                 }
//             } else {
//                 alert("La sesion ya expiro se volvera a recargar la pagina.");
//                 location.reload();
//             }
//         } catch (error) {
//             //console.error(error)
//             Cargando(0);
//             alerta(3, error);
//         }

//         return datos;
//     },

//     async GenerarFua(idCuenta) {
//         var formData = new FormData();
//         let datos;

//         formData.append("idCuentaAtencion", idCuenta);
//         try {
//             Cargando(1);
//             datos = await $.ajax({
//                 method: "POST",
//                 url: "/Atencion/GenerarFormatoFua?area=ConsultaExterna",
//                 data: formData,
//                 dataType: "json",
//                 cache: false,
//                 processData: false,
//                 contentType: false,
//             });

//             Cargando(0);
//             if (datos.session) {
//                 if (datos.respuesta == "Ok") {
//                     alerta(1, datos.mensaje);
//                     $("#btnBuscarAtenciones").click();
//                 } else {
//                     alerta(3, datos.mensaje);
//                 }
//             } else {
//                 alert("La sesion ya expiro se volvera a recargar la pagina");
//                 location.reload();
//             }
//         } catch (error) {
//             //console.error(error)
//             Cargando(0);
//             alerta(3, error);
//         }

//         return datos;
//     },
//     ///////////////////////////////////////////////////////////////////////////////////////////////

//     ///////////////KHOYOSI/////////////////////////////////////////////
//     ObtenerIdUsuarioSesion() {
//         var idUser = 0;
//         $.ajax({
//             method: "POST",
//             url: "/Utilitario/ObtenerIdUsuarioLogeado?area=Comun",
//             //data: midata,
//             //dataType: "json",
//             processData: false,
//             contentType: false,
//             async: false,
//             success: function (datos) {
//                 idUser = datos;
//             },
//             error: function (msg) {
//                 alerta("ERROR", "Error aal obtener Id del Medico!", "2");
//             },
//         });

//         return idUser;
//     },
//     /////////////////////////////////////////////////////////////////////

//     //////////////////////////////INICIALIZAR TABLAS///////////////////////////////////////////
//     initDatables() {
//         var parms = {
//             paging: true,
//             ordering: false,
//             info: false,
//             searching: false,
//             scrollX: true,
//             ordering: true,
//             columns: [
//                 {
//                     width: "7%",
//                     targets: 0,
//                     data: "idCuentaAtencion",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     width: "10%",
//                     targets: 1,
//                     data: "apellidoPaterno",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     width: "10%",
//                     targets: 2,
//                     data: "apellidoMaterno",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     width: "10%",
//                     targets: 3,
//                     data: "nombres",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                         //$(td).html((rowData.primerNombre == null ? '' : rowData.primerNombre.toUpperCase()) + " " + (rowData.segundoNombre == null ? '' : rowData.segundoNombre.toUpperCase()));
//                     },
//                 },
//                 {
//                     width: "7%",
//                     targets: 4,
//                     data: "nroHistoriaClinica",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     width: "7%",
//                     targets: 5,
//                     data: "fechaNacimiento",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                         //$(td).html(FormatearFecha(rowData.fecNacim));
//                     },
//                 },
//                 /*{
//                             width: '10%',
//                             targets: 6,
//                             data: "tipoPaciente",
//                             createdCell: function (td, cellData, rowData, row, col) {
//                                 $(td).attr('align', 'left')
        
//                             }
//                         },*/
//                 {
//                     width: "7%",
//                     targets: 7,
//                     data: "fechaIngreso",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     width: "7%",
//                     targets: 8,
//                     data: "horaIngreso",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     width: "15%",
//                     targets: 9,
//                     data: "servicioActual",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     width: "10%",
//                     targets: 10,
//                     data: "tipoPlan",
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).attr("align", "left");
//                     },
//                 },
//                 {
//                     width: "10%",
//                     targets: 11,
//                     data: null,
//                     createdCell: function (td, cellData, rowData, row, col) {
//                         $(td).css("text-align", "center");
//                         if (rowData.idFuenteFinanciamiento == 3) {
//                             if (rowData.codeFua != "") {
//                                 var btnRuta = "";
//                                 var btnImprime = "";
//                                 var btnImprimeSinF = "";

//                                 btnImprimeSinF =
//                                     '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

//                                 if (rowData.statusFirmaFua == 0) {
//                                     btnRuta =
//                                         '<a href="' +
//                                         rowData.rutaFua +
//                                         '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
//                                 }
//                                 if (
//                                     rowData.statusFirmaFua == 1 ||
//                                     rowData.statusFirmaFua == 0
//                                 ) {
//                                     btnImprime =
//                                         ' <button class="ImprimeFuaCF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';

//                                     //btnRuta = "";
//                                 }

//                                 $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);

//                                 $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
//                             } else {
//                                 $(td).html("");
//                             }
//                         } else {
//                             $(td).html("");
//                         }

//                         /*if (!isEmpty(rowData.fechaRegistroEvaluacion)) {
//                                         $(td).parent().css('color', '#347dff');
//                                         $(td).parent().css('font-weight', 'bold');
//                                     }*/
//                     },
//                 },
//             ],
//         };

//         var tableWrapper = $("#tblAtencion"); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
//         //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
//         oTable_atenciones = $("#tblAtencion").dataTable(parms);
//     },
// };

// //////////////////////KHOYOSI////////////////////////////////
// var imprimirDocumentoConFirma = function (idCuentaAtencion, code, idDoc, tipo) {
//     var objrow = oTable_atenciones.api(true).row(".selected").data();
//     //var midata = new FormData();

//     var url =
//         "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" +
//         idCuentaAtencion +
//         "&idRegistro=" +
//         idCuentaAtencion +
//         "&code=" +
//         code +
//         "&documentId=" +
//         idDoc +
//         "&tipo=" +
//         tipo;
//     //$('#ifrmReporte').attr('src', url);

//     var request = new XMLHttpRequest();
//     request.responseType = "blob";
//     request.open("GET", url);
//     request.onload = function () {
//         var url = window.URL.createObjectURL(this.response);
//         var a = document.createElement("a");
//         document.body.appendChild(a);
//         a.href = url;
//         //a.download = this.response.name || "CE-" + $.now()
//         a.download = "CE-FUA" + idCuentaAtencion + "-" + $.now();
//         a.click();

//         ListaAtencionesCE();
//     };
//     request.send();
// };
// //////////////////////////////////////////////////////////////////

// $(document).ready(function () {
//     FormatoFua.CargaInicial();
//     //AdmisionEmergencia.IniciarCombos();
//     FormatoFua.plugins();
//     FormatoFua.initDatables();
//     //AdmisionEmergencia.initDatablesConsumoAtencion();
//     FormatoFua.Eventos();

    
// });
