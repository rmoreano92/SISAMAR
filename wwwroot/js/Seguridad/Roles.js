var Roles = {
    idRol: 0,

    Iniciar() {
        Roles.DataTableRoles();
        Roles.DataTableModulosRoles();
        Roles.DataTablePermisosRoles();
        Roles.DataTableReportesRoles();
        Roles.Eventos();
        Roles.ListarRoles();
        Roles.ListarListBarItems();
        Roles.ListarPermisos();
        Roles.ListarListBarReportes();

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

    },

    //////////////////////////////////INICIALIZA DATATABLE///////////////////////////////////
    DataTableRoles() {
        var parms = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": true,
            "scrollX": true,
            "ordering": true,            
            columns: [                
                {
                    width: '15%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },                
            ]

        }

        var tableWrapper = $('#tblRoles'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_roles = $("#tblRoles").dataTable(parms);
    },

    DataTableModulosRoles() {
        var parms = {            
            paging: false,
            //"ordering": false,
            info: false,
            searching: false,
            //"scrollX": true,
            ordering: true,
            scrollY: '350px',
            scrollCollapse: true,            
            responsive: true,
            columns: [
                {
                    width: '40%',
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.subModulo);
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.modulo);
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.agregar) {
                            var agregar = '<div class="form-group"><div class="check__toggle text-sm-center"><label class="toggle"><input class="toggle__input" type="checkbox" id="chkAgregar_' + rowData.idListItem + '" checked><span class="toggle__label mr-2"></span></label> </div></div>';                            
                        } else {
                            var agregar = '<div class="form-group"><div class="check__toggle text-sm-center"><label class="toggle"><input class="toggle__input" type="checkbox" id="chkAgregar_' + rowData.idListItem + '"><span class="toggle__label mr-2"></span></label> </div></div>';
                        }                            
                        $(td).html(agregar);
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {                        
                        $(td).attr('align', 'center')
                        if (rowData.modificar) {
                            var modificar = '<div class="form-group"><div class="check__toggle text-sm-center"><label class="toggle"><input class="toggle__input" type="checkbox" id="chkModificar_' + rowData.idListItem + '" checked><span class="toggle__label mr-2"></span></label> </div></div>';
                        } else {
                            var modificar = '<div class="form-group"><div class="check__toggle text-sm-center"><label class="toggle"><input class="toggle__input" type="checkbox" id="chkModificar_' + rowData.idListItem + '"><span class="toggle__label mr-2"></span></label> </div></div>';
                        }
                        $(td).html(modificar);
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.consultar) {
                            var consultar = '<div class="form-group"><div class="check__toggle text-sm-center"><label class="toggle"><input class="toggle__input" type="checkbox" id="chkConsultar_' + rowData.idListItem + '" checked><span class="toggle__label mr-2"></span></label> </div></div>';
                        } else {
                            var consultar = '<div class="form-group"><div class="check__toggle text-sm-center"><label class="toggle"><input class="toggle__input" type="checkbox" id="chkConsultar_' + rowData.idListItem + '"><span class="toggle__label mr-2"></span></label> </div></div>';
                        }
                        $(td).html(consultar);
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        if (rowData.eliminar) {
                            var eliminar = '<div class="form-group"><div class="check__toggle text-sm-center"><label class="toggle"><input class="toggle__input" type="checkbox" id="chkEliminar_' + rowData.idListItem + '" checked><span class="toggle__label mr-2"></span></label> </div></div>';
                        } else {
                            var eliminar = '<div class="form-group"><div class="check__toggle text-sm-center"><label class="toggle"><input class="toggle__input" type="checkbox" id="chkEliminar_' + rowData.idListItem + '"><span class="toggle__label mr-2"></span></label> </div></div>';
                        }
                        $(td).html(eliminar);
                    }
                },
            ]

        }

        var tableWrapper = $('#tblModulosRoles'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_modulosRoles = $("#tblModulosRoles").dataTable(parms);
    },

    DataTablePermisosRoles() {
        var parms = {
            paging: false,
            //"ordering": false,
            info: false,
            searching: false,
            //"scrollX": true,
            ordering: true,
            scrollY: '350px',
            scrollCollapse: true,
            responsive: true,
            columns: [
                {
                    width: '100%',
                    targets: 1,
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
            ]

        }

        var tableWrapper = $('#tblPermisosRoles'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_permisosRoles = $("#tblPermisosRoles").dataTable(parms);
    },

    DataTableReportesRoles() {
        var parms = {
            paging: false,
            //"ordering": false,
            info: false,
            searching: false,
            //"scrollX": true,
            ordering: true,
            scrollY: '350px',
            scrollCollapse: true,
            responsive: true,
            columns: [
                {
                    width: '100%',
                    targets: 1,
                    data: "reporte",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
            ]

        }

        var tableWrapper = $('#tblReportesRoles'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_reportesRoles = $("#tblReportesRoles").dataTable(parms);
    },

    ///////////////////////////EVENTOS DE INTERACCION INTERFAZ - USUARIO//////////////////////////
    Eventos() {        
        $('#tblRoles tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_roles.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#tblModulosRoles tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_modulosRoles.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#tblPermisosRoles tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_permisosRoles.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#tblReportesRoles tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_reportesRoles.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregarRol').on('click', function () {
            Roles.LimpiarDatosVista();
            $("#modalRegistroRoles").modal("show");
        });

        $('#btnModificarRol').on('click', async function () {
            var objrowTb = oTable_roles.api(true).row('.selected').data();    
            if (!isEmpty(objrowTb)) {
                await Roles.CargarDatosVista(objrowTb);
                Roles.AbrirModal();
                Roles.DesbloquearCampos();
            } else {
                alerta(2, "Debe Seleccionar un registro.");
            }            
        });

        $('#btnEliminarRol').on('click', function () {
            var objrowTb = oTable_roles.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                swal({
                    title: 'Eliminar Rol',
                    text: '¿Estas seguro que desea eliminar el rol seleccionado?',
                    type: 'warning',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#656464',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar'
                }).then(async function () {
                    const rol = await Roles.EliminarRol(objrowTb.idRol);
                    if (rol) {
                        Roles.CerrarModal();
                        await Roles.ListarRoles();
                    }                    
                }).done();
            } else {
                alerta(2, "Debe Seleccionar un registro.");
            }             
        });

        $('#btnConsultarRol').on('click', async function () {
            var objrowTb = oTable_roles.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await Roles.CargarDatosVista(objrowTb);
                Roles.AbrirModal();
                Roles.BloquearCampos();
            } else {
                alerta(2, "Debe Seleccionar un registro.");
            }
        });

               
        ////////////////////MODULOS/////////////////////////////
        $('#btnAgregarModulo').on('click', function () {
            Roles.AgregarModuloRol();            
        });

        $('#btnQuitarModulo').on('click', function () {
            var objrowTb = oTable_modulosRoles.api(true).row('.selected').data(); 
            Roles.QuitarModuloRol(objrowTb);
        });

        ////////////////////PERMISOS/////////////////////////////
        $('#btnAgregarPermiso').on('click', function () {
            Roles.AgregarPermisoRol();
        });

        $('#btnQuitarPermiso').on('click', function () {
            var objrowTb = oTable_permisosRoles.api(true).row('.selected').data();
            Roles.QuitarPermisoRol(objrowTb);
        });

        ////////////////////REPORTES/////////////////////////////
        $('#btnAgregarReporte').on('click', function () {
            Roles.AgregarReporteRol();
        });

        $('#btnQuitarReporte').on('click', function () {
            var objrowTb = oTable_reportesRoles.api(true).row('.selected').data();
            Roles.QuitarReporteRol(objrowTb);
        });

        $('#btnGuardarRol').on('click', async function () {
            if (Roles.ValidarDatosRol()) {
                const rol = await Roles.GuardarRol(); 
                if (rol) {
                    Roles.LimpiarDatosVista();
                    Roles.CerrarModal();
                    await Roles.ListarRoles();
                }
            }            
        });

        $('#btnCancelarRol').on('click', function () {
            Roles.LimpiarDatosVista();
            Roles.CerrarModal();
        });
    },

    ///////////////////////////METODOS QUE CONSULTA BD///////////////////////////////////
    async ListarRoles() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();        

        Cargando(1)
        oTable_roles.fnClearTable();
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
                    oTable_roles.fnAddData(datos.lstData.table);
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

    async ListarListBarItems() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();
        var grupo = "";
        var idGrupo = "";

        Cargando(1)        
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Roles/ListarListBarItems?area=Seguridad",
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
                    $('#cboModulos').empty();
                    $(datos.lstData.table).each(function (i, obj) {
                        if (grupo != obj.grupo) {
                            idGrupo = obj.idListGrupo;
                            grupo = obj.grupo;
                            $('#cboModulos').append('<optgroup label="' + obj.grupo + '" id="' + idGrupo + '"></optgroup>');                            
                        }
                        $('#cboModulos #' + idGrupo).append('<option  value="' + obj.idListItem + '" data-modulo="'+obj.grupo+'" data-submodulo="'+obj.texto+'">' + obj.texto + '</option>');
                    });
                    $('#cboModulos').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
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

    async ListarPermisos() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();
        var grupo = "";
        var idGrupo = "";

        Cargando(1)
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Roles/ListarPermisos?area=Seguridad",
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
                    $('#cboPermisos').empty();
                    $(datos.lstData.table).each(function (i, obj) {
                        $('#cboPermisos').append('<option  value="' + obj.idPermiso + '" data-permiso="' + obj.descripcion + '">' + obj.descripcion + '</option>');
                    });
                    
                    $('#cboPermisos').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
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

    async ListarListBarReportes() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();
        var grupo = "";
        var idGrupo = "";

        Cargando(1)
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Roles/ListarListBarReportes?area=Seguridad",
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
                    $('#cboReportes').empty();
                    $(datos.lstData.table).each(function (i, obj) {
                        if (grupo != obj.modulo) {
                            idGrupo = obj.idListBarItem;
                            grupo = obj.modulo;
                            $('#cboReportes').append('<optgroup label="' + obj.modulo + '" id="' + idGrupo + '"></optgroup>');
                        }
                        $('#cboReportes #' + idGrupo).append('<option  value="' + obj.idReporte + '" data-reporte="' + obj.reporte + '">' + obj.reporte + '</option>');
                    });
                    $('#cboReportes').val('');
                    $('.chzn-select').chosen().trigger("chosen:updated");
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

    async SeleccionarRolesItems(idRol) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idRol', idRol);

        Cargando(1)
        oTable_modulosRoles.fnClearTable();
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Roles/SeleccionarRolesItems?area=Seguridad",
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
                    oTable_modulosRoles.fnAddData(datos.lstData.table);
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

    async SeleccionarRolesPermisos(idRol) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idRol', idRol);

        Cargando(1)
        oTable_permisosRoles.fnClearTable();
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Roles/SeleccionarRolesPermisos?area=Seguridad",
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
                    oTable_permisosRoles.fnAddData(datos.lstData.table);
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

    async SeleccionarRolesReportes(idRol) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idRol', idRol);

        Cargando(1)
        oTable_reportesRoles.fnClearTable();
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Roles/SeleccionarRolesReportes?area=Seguridad",
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
                    oTable_reportesRoles.fnAddData(datos.lstData.table);
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

    async GuardarRol() {
        var respuesta;
        var resp = false;
        let datos
        var data = Roles.CargarDatosControlador();
        
        Cargando(1)        
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Roles/GuardarModificarRol?area=Seguridad",
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
                    alerta(1, 'El rol se guardó correctamente.');

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

    async EliminarRol(idRol) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idRol', idRol);

        Cargando(1)
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Roles/EliminarRol?area=Seguridad",
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
                    alerta(1, 'El rol se eliminó correctamente.');

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

    /////////////////////////////METODOS///////////////////////////////////////
    async CargarDatosVista(datos) {
        Roles.idRol = datos.idRol;
        $("#txtNombreRol").val(datos.nombre);
        const rol = await Roles.SeleccionarRolesItems(datos.idRol);
        const perm = await Roles.SeleccionarRolesPermisos(datos.idRol);
        const repo = await Roles.SeleccionarRolesReportes(datos.idRol);
    },

    LimpiarDatosVista() {
        $(".campo").val("");
        oTable_modulosRoles.fnClearTable();
        oTable_permisosRoles.fnClearTable();
        oTable_reportesRoles.fnClearTable();
        $('#cboModulos').val('');
        $('.chzn-select').chosen().trigger("chosen:updated");

        Roles.idRol = 0;
    },

    AgregarModuloRol() {        
        if (!isEmpty($('#cboModulos').val())) {
            if (!Roles.ExisteRol()) {
                var objRow = {
                    idRol: Roles.idRol,
                    idListItem: $('#cboModulos').val(),
                    modulo: $("#cboModulos option:selected").attr("data-modulo"),
                    subModulo: $("#cboModulos option:selected").attr("data-submodulo"),
                    agregar: false,
                    modificar: false,
                    consultar: false,
                    eliminar: false
                }
                oTable_modulosRoles.api(true).row.add(objRow).draw(false);
            } else {
                alerta(2, "El módulo que intenta agregar ya existe.");
            }
        } else {
            alerta(2, "Debe Seleccionar un módulo para agregar.");
        }       
    },

    AgregarPermisoRol() {
        if (!isEmpty($('#cboPermisos').val())) {
            if (!Roles.ExistePermiso()) {
                var objRow = {
                    idRol: Roles.idRol,
                    idPermiso: $('#cboPermisos').val(),
                    descripcion: $("#cboPermisos option:selected").attr("data-permiso")                    
                }
                oTable_permisosRoles.api(true).row.add(objRow).draw(false);
            } else {
                alerta(2, "El permiso que intenta agregar ya existe.");
            }
        } else {
            alerta(2, "Debe Seleccionar un permiso para agregar.");
        }
    },

    AgregarReporteRol() {
        if (!isEmpty($('#cboReportes').val())) {
            if (!Roles.ExisteReporte()) {
                var objRow = {
                    idRol: Roles.idRol,
                    idReporte: $('#cboReportes').val(),
                    reporte: $("#cboReportes option:selected").attr("data-reporte")
                }
                oTable_reportesRoles.api(true).row.add(objRow).draw(false);
            } else {
                alerta(2, "El reporte que intenta agregar ya existe.");
            }
        } else {
            alerta(2, "Debe Seleccionar un reporte para agregar.");
        }
    },

    QuitarModuloRol(datos) {
        if (!isEmpty(datos)) {
            oTable_modulosRoles.api(true).row('.selected').remove().draw(false);

        } else {
            alerta(2, "Debe Seleccionar un módulo  para eliminar.");
        }
    },

    QuitarPermisoRol(datos) {
        if (!isEmpty(datos)) {
            oTable_permisosRoles.api(true).row('.selected').remove().draw(false);

        } else {
            alerta(2, "Debe Seleccionar un permiso  para eliminar.");
        }
    },

    QuitarReporteRol(datos) {
        if (!isEmpty(datos)) {
            oTable_reportesRoles.api(true).row('.selected').remove().draw(false);

        } else {
            alerta(2, "Debe Seleccionar un reporte  para eliminar.");
        }
    },

    ExisteRol() {
        lstRol = oTable_modulosRoles.api(true).rows().data();
        if (lstRol.length == 0) {
            return false;
        }

        for (var i = 0; i < lstRol.length; i++) {
            if (lstRol[i].idListItem == $('#cboModulos').val()) {
                return true;
            }
        }
        return false;
    },

    ExistePermiso() {
        lstRol = oTable_permisosRoles.api(true).rows().data();
        if (lstRol.length == 0) {
            return false;
        }

        for (var i = 0; i < lstRol.length; i++) {
            if (lstRol[i].idPermiso == $('#cboPermisos').val()) {
                return true;
            }
        }
        return false;
    },

    ExisteReporte() {
        lstRol = oTable_reportesRoles.api(true).rows().data();
        if (lstRol.length == 0) {
            return false;
        }

        for (var i = 0; i < lstRol.length; i++) {
            if (lstRol[i].idReporte == $('#cboReportes').val()) {
                return true;
            }
        }
        return false;
    },

    DevolverModulosRol() {
        var lstRol = oTable_modulosRoles.api(true).rows().data();
        var lstRolItems = [];
        for (var i = 0; i < lstRol.length; i++) {
            var objRow = {
                idRol: lstRol[i].idRol,
                idListItem: lstRol[i].idListItem,                
                agregar: $("#chkAgregar_" + lstRol[i].idListItem).is(':checked') == true ? 1 : 0,
                modificar: $("#chkModificar_" + lstRol[i].idListItem).is(':checked') == true ? 1 : 0 ,
                eliminar: $("#chkEliminar_" + lstRol[i].idListItem).is(':checked') == true ? 1 : 0,
                consultar: $("#chkConsultar_" + lstRol[i].idListItem).is(':checked') == true ? 1 : 0
            }
            lstRolItems.push(objRow);
        }
        console.log(lstRolItems);
        return JSON.stringify(lstRolItems);
    },

    DevolverPermisosRol() {
        var lstRol = oTable_permisosRoles.api(true).rows().data();
        var lstRolPermisos = [];
        for (var i = 0; i < lstRol.length; i++) {
            var objRow = {
                idRol: lstRol[i].idRol,
                idPermiso: lstRol[i].idPermiso                
            }
            lstRolPermisos.push(objRow);
        }
        console.log(lstRolPermisos);
        return JSON.stringify(lstRolPermisos);
    },

    DevolverReportesRol() {
        var lstRol = oTable_reportesRoles.api(true).rows().data();
        var lstRolReportes = [];
        for (var i = 0; i < lstRol.length; i++) {
            var objRow = {
                idRol: lstRol[i].idRol,
                idReporte: lstRol[i].idReporte,
                tieneAcceso: 1
            }
            lstRolReportes.push(objRow);
        }
        console.log(lstRolReportes);
        return JSON.stringify(lstRolReportes);
    },
    
    ValidarDatosRol() {
        if ($("#txtNombreRol").val() == '') {
            alerta(2, "Debe ingresar el nombre del Rol.");
            $("#txtNombreRol").focus();
            return false;
        }

        if (Roles.DevolverModulosRol() == '[]' && Roles.DevolverPermisosRol() == '[]' && Roles.DevolverReportesRol() == '[]') {
            alerta(2, "Debe agregar al menos un módulo, permiso o reporte para registrar rol.");            
            return false;
        }

        return true;
    },

    CargarDatosControlador() {
        var formData = new FormData();
        formData.append('idRol', Roles.idRol);
        formData.append('nombreRol', $('#txtNombreRol').val());
        formData.append('lstModulosRol', Roles.DevolverModulosRol());
        formData.append('lstPermisosRol', Roles.DevolverPermisosRol());
        formData.append('lstReportesRol', Roles.DevolverReportesRol());

        return formData;
    },

    BloquearCampos() {
        $(".campo").attr('disabled', 'disabled');        
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.opciones').hide();

        $("#btnGuardarRol").hide();  
    },

    DesbloquearCampos() {
        $(".campo").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.opciones').show();

        $("#btnGuardarRol").show();
    },

    AbrirModal() {
        $('#myTab a[href="#TabPanelModulos"]').tab('show');
        $("#modalRegistroRoles").modal("show");
    },

    CerrarModal() {
        $('#myTab a[href="#TabPanelModulos"]').tab('show');
        $("#modalRegistroRoles").modal("hide");
    }
}


$(document).ready(function () {
    Roles.Iniciar();
});