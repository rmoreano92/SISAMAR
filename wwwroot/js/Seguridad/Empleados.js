var Empleado = {
    idEmpleado: 0,
    idMedico: 0,
    idEstablecimientoExterno: 0,
    idSupervisor: 0,
    estadoClave: false,
    esMedico: 0,

    async Iniciar() {        

        $('#txtFechaNacimiento').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        //$(".hide_search").chosen({ disable_search_threshold: 10 });
        //$(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });

        Empleado.DataTableEmpleado();
        Empleado.DataTableRoles();
        Empleado.DataTableCargos();
        Empleado.DataTableLaboraLugar();
        Empleado.DataTableEspecilidadesMedico();
        Empleado.Eventos();
        await Empleado.ListarTiposDocumentos();
        await Empleado.ListarTiposSexo();
        await Empleado.ListaTiposEmpleados();
        await Empleado.ListaTiposCondicionTrabajo();
        await Empleado.ListaTiposDestacado();
        await Empleado.ListaTiposPuestos();
        await Empleado.ListaTiposCargos();
        await Empleado.ListaTiposLaboraEn(0);
        await Empleado.ListaColegiosHis();
        await Empleado.ListaDepartamentos();
        await Empleado.ListarRoles();    
                
    },

    //////////////////////////////////INICIALIZA DATATABLE///////////////////////////////////
    DataTableEmpleado() {
        var parms = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            "ordering": true,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "dni",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '20%',
                    targets: 3,
                    data: "nombres",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 4,
                    data: "tipoEmpleado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '15%',
                    targets: 5,
                    data: "condicionTrabajo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }
            ]

        }

        var tableWrapper = $('#tblEmpleado'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Empleado = $("#tblEmpleado").dataTable(parms);
    },

    DataTableRoles() {
        var parms = {
            scrollY: "140px",
            scrollCollapse: true,
            targets: 'no-sort',
            bSort: false,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,            
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "rol",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },                
            ]

        }

        var tableWrapper = $('#tblRoles'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Roles = $("#tblRoles").dataTable(parms);
    },

    DataTableCargos() {
        var parms = {
            scrollY: "140px",
            scrollCollapse: true,
            targets: 'no-sort',
            bSort: false,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "cargo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]

        }

        var tableWrapper = $('#tblCargos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Cargos = $("#tblCargos").dataTable(parms);
    },

    DataTableLaboraLugar() {
        var parms = {
            scrollY: "140px",
            scrollCollapse: true,
            targets: 'no-sort',
            bSort: false,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '40%',
                    targets: 0,
                    data: "area",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '60%',
                    targets: 0,
                    data: "subarea",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]

        }

        var tableWrapper = $('#tblLaboraLugar'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_LaboraLugar = $("#tblLaboraLugar").dataTable(parms);
    },

    DataTableEspecilidadesMedico() {
        var parms = {
            scrollY: "140px",
            scrollCollapse: true,
            targets: 'no-sort',
            bSort: false,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            columns: [
                {
                    width: '40%',
                    targets: 0,
                    data: "departamento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '60%',
                    targets: 1,
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]

        }

        var tableWrapper = $('#tblEspecialidades'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_EspecialidadesMedico = $("#tblEspecialidades").dataTable(parms);
    },

    ///////////////////////////EVENTOS DE INTERACCION INTERFAZ - USUARIO//////////////////////////
    Eventos() {

        /*================================EVENTO DE BUSQUEDA CON ENTER=====================================*/
        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.search').blur();
                $("#btnIniciarBusquedaEmpleado").click();
            }
        });
        /*===================================================================================*/

        /*================================SELECCIÓN DE REGISTRO EN TABLA=====================================*/
        $('#tblEmpleado tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Empleado.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_Empleado.api(true).row($(this)).index();
            var row = oTable_Empleado.fnGetData(pos);
            console.log(row);

        });
        /*===================================================================================*/

        /*==============================OPCIONES DE ACCIÓN/INTERACCIÓN=======================================*/
        $('#btnIniciarBusquedaEmpleado').on('click', async function () {
            await Empleado.IniciarBusquedaEmpleado();
        });

        $('#btnLimpiarBusquedaEmpleado').on('click', function () {
            $(".search").val("");
        });

        $('#btnCambiarClave').on('click', function () {
            if (Empleado.estadoClave == false) {
                $("#txtClaveWeb").val('');
                $("#txtClaveWeb").prop('disabled', false);
                Empleado.estadoClave = true;
            } else if (Empleado.estadoClave == true) {
                $("#txtClaveWeb").val('---------------');
                $("#txtClaveWeb").prop('disabled', true);
                Empleado.estadoClave = false;
            }
        });

        $('#btnAgregarEmpleado').on('click', function () {
            Empleado.LimpiarDatosVista();
            $("#modalRegistroEmpleado").modal("show");
        });

        $('#btnModificarEmpleado').on('click', async function () {
            var objrowTb = oTable_Empleado.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await Empleado.CargarDatosVista(objrowTb);
                $("#modalRegistroEmpleado").modal("show");
                Empleado.DesbloquearCampos();
                $("#txtClaveWeb").prop('disabled', true);
            } else {
                alerta(2, "Debe Seleccionar un registro.");
            }   
        });

        $('#btnEliminarEmpleado').on('click', function () {
            var objrowTb = oTable_Empleado.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                swal({
                    title: 'Eliminar Empleado',
                    text: '¿Estas seguro que desea eliminar el empleado seleccionado?',
                    type: 'warning',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#656464',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar'
                }).then(async function () {
                    const empleado = await Empleado.EliminarEmpleado(objrowTb.idEmpleado);
                    if (empleado) {
                        $("#modalRegistroEmpleado").modal("hide");
                        await Empleado.IniciarBusquedaEmpleado();
                    }
                }).done();
            } else {
                alerta(2, "Debe Seleccionar un registro.");
            }  
        });

        $('#btnConsultarEmpleado').on('click', async function () {
            var objrowTb = oTable_Empleado.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await Empleado.CargarDatosVista(objrowTb);
                $("#modalRegistroEmpleado").modal("show");
                Empleado.BloquearCampos();
            } else {
                alerta(2, "Debe Seleccionar un registro.");
            }
        });

        $('#cboTiposEmpleados').on('change', async function () {
            var esProgramado = $("#cboTiposEmpleados option:selected").attr("data-tipoMedico");
            if (esProgramado == 'true') {
                $('#profesional-tab').show();
                Empleado.esMedico = 1;
                if ($('#txtColegiatura').val() == "" && $('#txtLoteHis').val() == "" && $('#cboColegioProfesionales').val() == null && $('#txtRne').val() == "" && $('#chkEgresado').is(":checked") == false) {
                    alerta2('info', '', "El usuario es un médico, puede registrar los datos adicionales en la sección Prof. de la Salud.");
                }
                //$('.nav-tabs a[href="#profesional"]').tab('show');
            } else if (esProgramado == 'false') {
                $('.nav-tabs a[href="#roles"]').tab('show');
                $('#profesional-tab').hide();
                Empleado.esMedico = 0;
                //$('.nav-tabs a[href="#profesional"]').tab('dispose');
            }
            
        });

        $('#cboArea').on('change', async function () {
            var idArea = $("#cboArea").val();
            await Empleado.ListaTiposLaboraEn(idArea);
        });

        $('#cboDepartamento').on('change', async function () {
            var idDepartamento = $("#cboDepartamento").val();
            await Empleado.ListaEspecialidadesPorDepartamento(idDepartamento);
        });

        /////////////AGREGAR - QUITAR ELEMENTOS////////////////////
        $('#tblRoles tbody').on('click', 'tr', function () {
            $('#tblRoles tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#tblCargos tbody').on('click', 'tr', function () {
            $('#tblCargos tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#tblLaboraLugar tbody').on('click', 'tr', function () {
            $('#tblLaboraLugar tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });

        $('#tblEspecialidades tbody').on('click', 'tr', function () {
            $('#tblEspecialidades tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });
        ///////////////////////////////////////////////////////////

        $('#btnCancelarEmpleado').on('click', function () {
            Empleado.LimpiarDatosVista();
            $("#modalRegistroEmpleado").modal("hide");
        });

        $('#btnGuardarEmpleado').on('click', async function () {
            if (Empleado.ValidarDatos()) {
                const empleado = await Empleado.GuardarEmpleado();
                if (empleado) {
                    Empleado.LimpiarDatosVista();
                    $("#modalRegistroEmpleado").modal("hide");
                    await Empleado.IniciarBusquedaEmpleado();
                }
            } 
        });
        /*===================================================================================*/

        /*========================FIRMA DIGITAL===============================================*/
        $('#btnFotoFirma').on('click', function () {
            $('#fileFotoFirma').click();
        });

        $('#fileFotoFirma').on('change', function () {
            const fileInput = document.getElementById('fileFotoFirma');
            // Obtener el contenedor de la imagen
            const imageContainer = document.getElementById('marcoFotoFirma');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                // Crear un objeto URL para la imagen seleccionada
                const imageUrl = URL.createObjectURL(fileInput.files[0]);
                // Mostrar la imagen en el contenedor
                imageContainer.innerHTML = `<img id="imgFotoFirma" src="${imageUrl}" alt="Foto de la Firma" style='height: 100%; position: absolute; top: 50%; left:50%; transform: translate(-50%, -50%);'>`;

                reader.onloadend = () => {
                    const base64String = reader.result.split(',')[1];
                    $("#fotoFirma").val(base64String);
                };
                reader.readAsDataURL(file);
            }
        });
        /*=========================================================================================*/
    },

    ///////////////////////////METODOS QUE CONSULTA BD///////////////////////////////////
    async ListarTiposDocumentos() {
        $('#cboTiposDocumentos').empty();
        const tiposDocumentos = await Utilitario.ListarTiposDocumentos();
        //console.log(tiposDocumentos.lsDocumentos.table);
        if (tiposDocumentos.lsDocumentos.table.length > 0) {
            $('#cboTiposDocumentos').empty();
            $('#cboTiposDocumentos').append('<option value=""></option>');
            $(tiposDocumentos.lsDocumentos.table).each(function (i, obj) {
                $('#cboTiposDocumentos').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
            });
            $('#cboTiposDocumentos').val('');
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        }               
    },

    async ListarTiposSexo() {
        $('#cboTiposSexo').empty();
        const tiposDocumentos = await Utilitario.ListarTiposSexo();
        //console.log(lsSexos.lsDocumentos.table);
        if (tiposDocumentos.lsSexos.table.length > 0) {
            $('#cboTiposSexo').empty();
            $('#cboTiposSexo').append('<option value=""></option>');
            $(tiposDocumentos.lsSexos.table).each(function (i, obj) {
                $('#cboTiposSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
            });
            $('#cboTiposSexo').val('');
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        }
    },

    async ListaTiposEmpleados() {
        let datos;
        let resp = null;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/ListaTiposEmpleados?area=Comun",
                    data: null,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                $('#cboTiposEmpleados').empty();
                $('#cboTiposEmpleados').append('<option value=""></option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTiposEmpleados').append('<option data-tipoMedico=' + obj.esProgramado + ' value="' + obj.idTipoEmpleado + '">' + obj.descripcion + '</option>');
                });
                $('#cboTiposEmpleados').val('');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            } else {
                resp = null;
            }            
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async ListaTiposCondicionTrabajo() {
        let datos;
        let resp = null;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/ListaTiposCondicionTrabajo?area=Comun",
                    data: null,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                $('#cboTiposCondicionTrabajo').empty();
                $('#cboTiposCondicionTrabajo').append('<option value=""></option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTiposCondicionTrabajo').append('<option  value="' + obj.idCondicionTrabajo + '">' + obj.descripcion + '</option>');
                });
                $('#cboTiposCondicionTrabajo').val('');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            } else {
                resp = null;
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async ListaTiposDestacado() {
        let datos;
        let resp = null;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/ListaTiposDestacado?area=Comun",
                    data: null,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                $('#cboTiposDestacado').empty();
                $('#cboTiposDestacado').append('<option value=""></option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTiposDestacado').append('<option  value="' + obj.idDestacado + '">' + obj.destacado + '</option>');
                });
                $('#cboTiposDestacado').val('');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            } else {
                resp = null;
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async ListaTiposPuestos() {
        let datos;
        let resp = null;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/ListaTiposPuestos?area=Seguridad",
                    data: null,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                $('#cboTipoPuesto').empty();
                $('#cboTipoPuesto').append('<option value=""></option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboTipoPuesto').append('<option value="' + obj.idPuesto + '">' + obj.puesto + '</option>');
                });
                $('#cboTipoPuesto').val('');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            } else {
                resp = null;
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async ListaTiposCargos() {
        let datos;
        let resp = null;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/ListaCargos?area=Comun",
                    data: null,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                $('#cboCargos').empty();
                $('#cboCargos').append('<option value=""></option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboCargos').append('<option  value="' + obj.idTipoCargo + '">' + obj.cargo + '</option>');
                });
                $('#cboCargos').val('');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            } else {
                resp = null;
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async ListaColegiosHis() {
        let datos;
        let resp = null;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/ListaColegiosHis?area=Comun",
                    data: null,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                $('#cboColegioProfesionales').empty();
                $('#cboColegioProfesionales').append('<option value=""></option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboColegioProfesionales').append('<option  value="' + obj.cod_col + '">' + obj.des_col + '</option>');
                });
                $('#cboColegioProfesionales').val('');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            } else {
                resp = null;
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async ListaDepartamentos() {
        let datos;
        let resp = null;

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Especialidades/DepartamentosHospitalSeleccionarTodos?area=General",
                    data: null,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                $('#cboDepartamento').empty();
                $('#cboDepartamento').append('<option value=""></option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboDepartamento').append('<option  value="' + obj.idDepartamento + '">' + obj.descripcionLarga + '</option>');
                });
                $('#cboDepartamento').val('');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            } else {
                resp = null;
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async ListaEspecialidadesPorDepartamento(idDepartamento) {
        let datos;
        let resp = null;
        var data = new FormData();
        data.append("idDepartamento", idDepartamento);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Especialidades/EspecialidadesSeleccionarPorDepartamento?area=General",
                    data: data,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                $('#cboEspecialidad').empty();
                $('#cboEspecialidad').append('<option value=""></option>');
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboEspecialidad').append('<option  value="' + obj.idEspecialidad + '">' + obj.descripcionLarga + '</option>');
                });
                $('#cboEspecialidad').val('');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            } else {
                resp = null;
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    async ListaTiposLaboraEn(idLugar) {
        let datos;
        let resp = null;
        var url = '';
        var data = new FormData();
                
        if (idLugar == 0) {
            $('#cboSubArea').empty();            
            $('#cboSubArea').val('');
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");
            $('#SubArea').hide();
        } else if (idLugar == 1) {
            url = '/Farmacias/FarmaciasSeleccionarSegunFiltro?area=Farmacia';
            data.append("filtro", "idTipoLocales<>'X' and idEstado=1");
        } else if (idLugar == 2) {
            url = '/FactPuntosCarga/FactPuntosCargaSeleccionarPorFiltro?area=Comun';
            data.append("filtro", "TipoPunto='I'");
        } else if (idLugar == 3) {
            url = '/FactPuntosCarga/FactPuntosCargaSeleccionarPorFiltro?area=Comun';
            data.append("filtro", "TipoPunto='L'");
        } else if (idLugar == 4) {
            url = '/ProductoPlan/TiposFinanciamientoSegunFiltro?area=Comun';
            data.append("filtro", "esOficina=1");
        } else if (idLugar == 5) {
            url = '/Especialidades/DevuelveEspecialidadesDelHospitalfiltro?area=Comun';
            data.append("filtro", "(1)");
        } else if (idLugar == 6) {
            url = '/Especialidades/DevuelveEspecialidadesDelHospitalfiltro?area=Comun';
            data.append("filtro", "(3)");
        } else if (idLugar == 7) {
            url = '/Especialidades/DevuelveEspecialidadesDelHospitalfiltro?area=Comun';
            data.append("filtro", "(4)");
        } else if (idLugar == 8) {
            url = '/Especialidades/DevuelveEspecialidadesDelHospitalfiltro?area=Comun';
            data.append("filtro", "(2)");
        } else if (idLugar == 9) {
            url = '/EstadoCuenta/AreaTramitaSegurosDevuelveTodosSegunFiltro?area=Comun';
            data.append("filtro", "");
        }
        
        if (idLugar > 0) {
            try {
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: url,
                        data: data,
                        //dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });
                Cargando(0);
                if (!isEmpty(datos)) {
                    $('#SubArea').show();
                    $('#cboSubArea').empty();
                    $('#SubArea').append('<option value=""></option>');
                    $('#cboSubArea').append('<option value=""></option>');
                    $(datos.lstData.table).each(function (i, obj) {
                        if (idLugar == 1) {
                            $('#cboSubArea').append('<option  value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                        } else if (idLugar == 2 || idLugar == 3) {
                            $('#cboSubArea').append('<option  value="' + obj.idPuntoCarga + '">' + obj.descripcion + '</option>');
                        } else if (idLugar == 4) {
                            $('#cboSubArea').append('<option  value="' + obj.idTipoFinanciamiento + '">' + obj.descripcion + '</option>');
                        } else if (idLugar == 5 || idLugar == 6 || idLugar == 7 || idLugar == 8) {
                            $('#cboSubArea').append('<option  value="' + obj.idEspecialidad + '">' + obj.nombre + '</option>');
                        } else if (idLugar == 9) {
                            $('#cboSubArea').append('<option  value="' + obj.idAreaTramitaSeguros + '">' + obj.descripcion + '</option>');
                        }                        
                    });
                    $('#cboSubArea').val('');
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                } else {
                    resp = null;
                }
                //console.log(datos);
            } catch (error) {
                //console.error(error)
                Cargando(0);
                alerta(3, error);
            }
        }        
    },

    async IniciarBusquedaEmpleado() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('dni', $("#txtSearchDni").val());
        data.append('apPaterno', $("#txtSearchApPaterno").val());
        data.append('apMaterno', $("#txtSearchApMaterno").val());
        data.append('nombres', $("#txtSearchNombres").val());

        Cargando(1)
        oTable_Empleado.fnClearTable();
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/BuscarEmpleado?area=Seguridad",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.lstData.table.length > 0) {
                    oTable_Empleado.fnAddData(datos.lstData.table);
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
            return false;
        }

        return true;
    },

    async ListarRoles() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        Cargando(1)
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Roles/ListarRoles?area=Seguridad",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.lstData.table.length > 0) {
                    $('#cboRoles').empty();
                    $(datos.lstData.table).each(function (i, obj) {
                        $('#cboRoles').append('<option  value="' + obj.idRol + '">' + obj.nombre + '</option>');
                    });
                    $('#cboRoles').val('');
                    $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
            return false;
        }

        return true;
    },

    async EmpleadosRolesSeleccionar(idEmpleado) {
        let datos;
        let resp = null;

        var data = new FormData();
        data.append('idEmpleado', idEmpleado);

        try {
            Cargando(1);
            oTable_Roles.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/EmpleadosRolesSeleccionar?area=Seguridad",
                    data: data,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                if (datos.lstData.table.length > 0) {
                    oTable_Roles.fnAddData(datos.lstData.table);
                }
            } 
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }
    },

    async EmpleadosCargosSeleccionar(idEmpleado) {
        let datos;
        let resp = null;

        var data = new FormData();
        data.append('idEmpleado', idEmpleado);

        try {
            Cargando(1);
            oTable_Cargos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/EmpleadosCargosSeleccionar?area=Seguridad",
                    data: data,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                if (datos.lstData.table.length > 0) {
                    oTable_Cargos.fnAddData(datos.lstData.table);
                }
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }
    },

    async EmpleadosLaboraLugarSeleccionar(idEmpleado) {
        let datos;
        let resp = null;

        var data = new FormData();
        data.append('idEmpleado', idEmpleado);

        try {
            Cargando(1);
            oTable_LaboraLugar.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/EmpleadosLaboraLugarSeleccionar?area=Seguridad",
                    data: data,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                if (datos.lstData.table.length > 0) {
                    oTable_LaboraLugar.fnAddData(datos.lstData.table);
                }
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }
    },

    async EmpleadosMedicosEspecialidadesSeleccionar(idMedico) {
        let datos;
        let resp = null;

        var data = new FormData();
        data.append('idMedico', idMedico);

        try {
            Cargando(1);
            oTable_EspecialidadesMedico.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/EmpleadosMedicosEspecialidadesSeleccionar?area=Seguridad",
                    data: data,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (!isEmpty(datos)) {
                if (datos.lstData.table.length > 0) {
                    oTable_EspecialidadesMedico.fnAddData(datos.lstData.table);
                }
            }
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }
    },
    
    async GuardarEmpleado() {
        var respuesta;
        var resp = false;
        let datos
        var data = Empleado.CargarDatosControlador();

        Cargando(1)
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/GuardarModificarEmpleado?area=Seguridad",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.rpta) {
                    resp = true;
                    alerta2('success', '', 'El empleado se guardó correctamente.');

                } else {
                    alerta2('warning', '', datos.msj)
                    return false;
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('danger', '', error);
            return false;
        }

        return resp;
    },

    async EliminarEmpleado(idEmpleado) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idEmpleado', idEmpleado);

        Cargando(1)
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Empleados/EliminarEmpleado?area=Seguridad",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.rpta) {
                    resp = true;
                    alerta(1, 'El empleado se eliminó correctamente.');

                } else {
                    alerta(2, datos.msj)
                    return false;
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
            return false;
        }

        return resp;
    },

    async CargarDatosVista(datos) {
        Empleado.idEmpleado = datos.idEmpleado;
        Empleado.idMedico = datos.idMedico;
        Empleado.idEstablecimientoExterno = datos.idEstablecimientoExterno;
        Empleado.idSupervisor = datos.idSupervisor;

        $("#txtCodigoPlanilla").val(datos.codigoPlanilla);
        $("#cboTiposDocumentos").val(datos.idTipoDocumento);
        $("#txtDni").val(datos.dni);
        $("#txtApPaterno").val(datos.apellidoPaterno);
        $("#txtApMaterno").val(datos.apellidoMaterno);
        $("#txtNombres").val(datos.nombres);
        //var fechaNac = moment(datos.fechaNacimiento.substring(0, 10)).toDate();
        $('#txtFechaNacimiento').datepicker("setDate", moment(datos.fechaNacimiento.substring(0, 10)).toDate());
        $("#cboTiposSexo").val(datos.idTipoSexo);
        $("#cboTiposEmpleados").val(datos.idTipoEmpleado);
        $("#cboTiposCondicionTrabajo").val(datos.idCondicionTrabajo);
        $("#cboTiposDestacado").val(datos.idTipoDestacado);
        $('#cboTipoPuesto').val(datos.idPuesto)

        $("#destino").val(datos.establecimientoExterno);
        $("#supervisor").val(datos.supervisor);
        
        $("#txtUsuario").val(datos.usuario);
        //$("#txtClaveWeb").val(datos.claveVWeb);
        $("#txtClaveWeb").val("---------------");         
        $('#chkAutorizaReniec').prop('checked', datos.reniecAutorizado);
        $("#txtCodigoHis").val(datos.hisCodigoDigitador);
        $("#txtLoginPc").val(datos.loginPC);
        $('#chkActivo').prop('checked', datos.esActivo);

        await Empleado.EmpleadosRolesSeleccionar(Empleado.idEmpleado);
        await Empleado.EmpleadosCargosSeleccionar(Empleado.idEmpleado);
        await Empleado.EmpleadosLaboraLugarSeleccionar(Empleado.idEmpleado);

        if (Empleado.idMedico > 0) {
            $("#txtColegiatura").val(datos.colegiatura);
            $("#txtLoteHis").val(datos.loteHIS);
            $("#cboColegioProfesionales").val(datos.idColegioHIS);
            $("#txtRne").val(datos.rne);
            $('#chkEgresado').prop('checked', datos.egresado);
            await Empleado.EmpleadosMedicosEspecialidadesSeleccionar(Empleado.idMedico);
        }

        if (!isEmpty(datos.rutaFirmaEmpleado)) {
            $('#marcoFotoFirma').html('<img id="imgFotoFirma" src="' + PathServerFiles + datos.rutaFirmaEmpleado + '" alt="Foto de la Firma" style="height: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">')
        }
        
        //$("#cboRoles").val(datos.idRol);
        $('#cboTiposEmpleados').change();
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    LimpiarDatosVista() {
        $(".campo").val("");    
        $('#txtFechaNacimiento').datepicker("setDate", moment().toDate());
        $("input[type=checkbox]").prop('checked', false);
        $('.chzn-select').val('');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#marcoFotoFirma").html("");
        $("#fileFotoFirma").val("");
        $("#fotoFirma").val("");

        $('#TabPanelOpcionesEmpleado a[href="#roles"]').tab('show')

        Empleado.idEmpleado = 0;
        Empleado.idMedico = 0;
        Empleado.idEstablecimientoExterno = 0;
        Empleado.idSupervisor = 0;
        Empleado.estadoClave = false;

        oTable_Roles.fnClearTable();
        oTable_Cargos.fnClearTable();
        oTable_LaboraLugar.fnClearTable();
        oTable_EspecialidadesMedico.fnClearTable();
    },

    ValidarDatos() {
        if ($("#txtDni").val() == '') {
            alerta(2, "Debe ingresar el número de DNI.");
            $("#txtDni").focus();
            return false;
        }

        if ($("#txtApPaterno").val() == '') {
            alerta(2, "Debe ingresar el Apellido Paterno.");
            $("#txtApPaterno").focus();
            return false;
        }

        if ($("#txtApMaterno").val() == '') {
            alerta(2, "Debe ingresar el Apellido Materno.");
            $("#txtApMaterno").focus();
            return false;
        }

        if ($("#txtNombres").val() == '') {
            alerta(2, "Debe ingresar el Nombre.");
            $("#txtNombres").focus();
            return false;
        }

        if ($("#txtFechaNacimiento").val() == '') {
            alerta(2, "Debe ingresar la Fecha Nacimiento.");
            $("#txtFechaNacimiento").focus();
            return false;
        }

        if ($("#txtUsuario").val() == '') {
            alerta(2, "Debe ingresar el Usuario.");
            $("#txtUsuario").focus();
            return false;
        }

        if ($("#txtClaveWeb").val() == '') {
            alerta(2, "Debe ingresar la contraseña.");
            $("#txtClaveWeb").focus();
            return false;
        }

        if (Empleado.esMedico == 1) {
            if ($("#txtColegiatura").val() == '') {
                alerta(2, "Debe ingresar la colegiatura.");
                $("#txtColegiatura").focus();
                return false;
            }

            if ($("#cboColegioProfesionales").val() == '') {
                alerta(2, "Debe seleccionar el Colegio Profesional.");
                $("#cboColegioProfesionales").focus();
                return false;
            }
        }


        //if ($("#cboRoles").val() == '') {
        //    alerta(2, "Debe seleccionar el Rol.");
        //    $("#cboRoles").focus();
        //    return false;
        //}

        return true;
    },

    CargarDatosControlador() {
        var formData = new FormData();
        formData.append('IdEmpleado', Empleado.idEmpleado);
        formData.append('CodigoPlanilla', $('#txtCodigoPlanilla').val());
        formData.append('idTipoDocumento', $('#cboTiposDocumentos').val());
        formData.append('DNI', $('#txtDni').val());
        formData.append('ApellidoPaterno', $('#txtApPaterno').val());
        formData.append('ApellidoMaterno', $('#txtApMaterno').val());
        formData.append('Nombres', $('#txtNombres').val());
        formData.append('FechaNacimiento', $('#txtFechaNacimiento').val());
        formData.append('IdTipoSexo', $('#cboTiposSexo').val());
        formData.append('IdTipoEmpleado', $('#cboTiposEmpleados').val());
        formData.append('IdCondicionTrabajo', $('#cboTiposCondicionTrabajo').val());
        formData.append('idTipoDestacado', $('#cboTiposDestacado').val());
        formData.append('IdPuesto', $('#cboTipoPuesto').val());
        
        formData.append('Usuario', $('#txtUsuario').val());
        formData.append('ClaveVWeb', $('#txtClaveWeb').val());
        formData.append('HisCodigoDigitador', $('#txtCodigoHis').val());
        formData.append('ReniecAutorizado', $('#chkAutorizaReniec').is(":checked") ? true : false);
        formData.append('esActivo', $('#chkActivo').is(":checked") ? true : false);
        
        formData.append('lstRoles', JSON.stringify(Empleado.DevolverRoles()));
        formData.append('lstCargos', JSON.stringify(Empleado.DevolverCargos()));
        formData.append('lstLaboraLugar', JSON.stringify(Empleado.DevolverLaboraLugar()));

        if (Empleado.idMedico > 0) {
            if (isEmpty($('#txtColegiatura').val()) && isEmpty($('#txtLoteHis').val()) && isEmpty($('#cboColegioProfesionales').val()) && isEmpty($('#txtRne').val()) && $('#chkEgresado').is(":checked") == false) {
                Empleado.esMedico = 0;
            } else {
                formData.append('idMedico', Empleado.idMedico);
                Empleado.esMedico = 1;
            }            
        } else if (Empleado.esMedico == 1) {
            if ($('#txtColegiatura').val() == "" && $('#txtLoteHis').val() == "" && $('#cboColegioProfesionales').val() == "" && $('#txtRne').val() == "" && $('#chkEgresado').is(":checked") == false) {
                Empleado.esMedico = 0;
            }
        }
                     
        if (Empleado.esMedico == 1) {
            formData.append('esMedico', Empleado.esMedico);
            formData.append('Colegiatura', $('#txtColegiatura').val());
            formData.append('LoteHIS', $('#txtLoteHis').val());
            formData.append('idColegioHIS', $('#cboColegioProfesionales').val());
            formData.append('rne', $('#txtRne').val());
            formData.append('egresado', $('#chkEgresado').is(":checked") ? true : false);
            
        }  
        formData.append('lstEspecialidades', JSON.stringify(Empleado.DevolverEspecialidades()));

        formData.append("FotoFirma", Empleado.ObtenerCodigoFotoFirma());
        //formData.append('IdRol', $('#cboRoles').val());

        return formData;
    },

    AgregarRol() {
        var id = $("#cboRoles").val();
        if (id > 1) {
            if (!Empleado.ExisteRol(id)) {                
                var objRow = {
                    idEmpleado: Empleado.idEmpleado,
                    idRol: id,
                    rol: $('select[id="cboRoles"] option:selected').text()
                }
                oTable_Roles.api(true).row.add(objRow).draw(false);
                //alerta2('success', '', 'Ya se agrego');
            }
        } else {
            if (id == 1) {
                alerta2('warning', '', 'Usted no puede agregar este Rol.');
            } else {
                alerta2('info', '', 'Por favor seleccione un Rol para asignar.');
            }            
        }
    },

    QuitarRol() {
        var objrowTb = oTable_Roles.api(true).row('.selected').data();
        if (objrowTb.idRol == 1) {
            alerta2('warning', '', 'Usted no puede quitar este Rol.');
        } else {
            oTable_Roles.api(true).row('.selected').remove().draw(false);
        }        
    },

    AgregarCargo() {
        var id = $("#cboCargos").val();
        if (id > 0) {
            if (!Empleado.ExisteCargo(id)) {
                var objRow = {
                    idEmpleado: Empleado.idEmpleado,
                    idCargo: id,
                    cargo: $('select[id="cboCargos"] option:selected').text()
                }
                oTable_Cargos.api(true).row.add(objRow).draw(false);
                //alerta2('success', '', 'Ya se agrego');
            }
        } else {
            alerta2('info', '', 'Por favor seleccione un Cargo para asignar.')
        }
    },

    QuitarCargo() {
        oTable_Cargos.api(true).row('.selected').remove().draw(false);
    },

    AgregarLaboraLugar() {
        var idA = $("#cboArea").val();
        var idS = $("#cboSubArea").val();
        if (idA > 0 && idS > 0) {
            if (!Empleado.ExisteLaboraLugar(idA, idS)) {
                var objRow = {
                    idEmpleado: Empleado.idEmpleado,
                    idLaboraArea: idA,
                    idLaboraSubArea: idS,
                    area: $('select[id="cboArea"] option:selected').text(),
                    subarea: $('select[id="cboSubArea"] option:selected').text()
                }
                oTable_LaboraLugar.api(true).row.add(objRow).draw(false);
                //alerta2('success', '', 'Ya se agrego');
            }
        } else {
            alerta2('info', '', 'Por favor seleccione una Area/SubArea para asignar.')
        }
    },

    QuitarLaboraLugar() {
        oTable_LaboraLugar.api(true).row('.selected').remove().draw(false);
    },

    AgregarEspecialidad() {
        var id = $("#cboEspecialidad").val();
        if (id > 0) {
            if (!Empleado.ExisteEspecialidad(id)) {
                var objRow = {
                    idMedico: Empleado.idMedico,
                    idEspecialidad: id,
                    departamento: $('select[id="cboDepartamento"] option:selected').text(),
                    especialidad: $('select[id="cboEspecialidad"] option:selected').text()
                }
                oTable_EspecialidadesMedico.api(true).row.add(objRow).draw(false);
                //alerta2('success', '', 'Ya se agrego');
            }
        } else {
            alerta2('info', '', 'Por favor seleccione un Departamento y Especialidad para asignar.')
        }
    },

    QuitarEspecialidad() {
        oTable_EspecialidadesMedico.api(true).row('.selected').remove().draw(false);
    },

    ExisteRol(id) {
        var lstDatos = oTable_Roles.api(true).rows().data();
        if (lstDatos.length == 0) {
            return false;
        }

        for (var i = 0; i < lstDatos.length; i++) {
            if (lstDatos[i].idRol == id) {
                alerta2('warning', '', 'El rol ya se encuentra asignado.');
                return true;
            }
        }

        return false;
    },

    ExisteCargo(id) {
        var lstDatos = oTable_Cargos.api(true).rows().data();
        if (lstDatos.length == 0) {
            return false;
        }

        for (var i = 0; i < lstDatos.length; i++) {
            if (lstDatos[i].idCargo == id) {
                alerta2('warning', '', 'El cargo ya se encuentra asignado.');
                return true;
            }
        }

        return false;
    },

    ExisteLaboraLugar(idArea, idSubArea) {
        var lstDatos = oTable_LaboraLugar.api(true).rows().data();
        if (lstDatos.length == 0) {
            return false;
        }

        for (var i = 0; i < lstDatos.length; i++) {
            if (lstDatos[i].idLaboraArea == idArea && lstDatos[i].idLaboraSubArea == idSubArea) {
                alerta2('warning', '', 'El Area/SubArea ya se encuentra asignado.');
                return true;
            }
        }

        return false;
    },

    ExisteEspecialidad(id) {
        var lstDatos = oTable_EspecialidadesMedico.api(true).rows().data();
        if (lstDatos.length == 0) {
            return false;
        }

        for (var i = 0; i < lstDatos.length; i++) {
            if (lstDatos[i].idEspecialidad == id) {
                alerta2('warning', '', 'El Departamento y Especialidad ya se encuentra asignado.');
                return true;
            }
        }

        return false;
    },

    DevolverRoles() {
        var lstData = oTable_Roles.api(true).rows().data();
        lstData = lstData.toArray();
        return lstData;
    },

    DevolverCargos() {
        var lstData = oTable_Cargos.api(true).rows().data();
        lstData = lstData.toArray();
        return lstData;
    },

    DevolverLaboraLugar() {
        var lstData = oTable_LaboraLugar.api(true).rows().data();
        lstData = lstData.toArray();
        return lstData;
    },

    DevolverEspecialidades() {
        var lstData = oTable_EspecialidadesMedico.api(true).rows().data();
        lstData = lstData.toArray();
        return lstData;
    },

    BloquearCampos() {
        $(".campo").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");

        $("#btnGuardarEmpleado").hide();
    },

    DesbloquearCampos() {
        $(".campo").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");

        $("#btnGuardarEmpleado").show();
    },

    ObtenerCodigoFotoFirma() {
        var base64String = $("#fotoFirma").val();

        if (isEmpty(base64String)) {
            base64String = "SIN-MODIFICAR";
        } else if (base64String == "ELIMINADO") {
            base64String = "";
        }

        return base64String;
    },
    

}

$(document).ready(function () {
    Empleado.Iniciar();
});