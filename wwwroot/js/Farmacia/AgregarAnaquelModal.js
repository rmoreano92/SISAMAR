var AgregarAnaquelModal = {
    Abrir: function() {
        $('#modalAgregarAnaquel').modal('show');
    },
    Cerrar: function() {
        $('#modalAgregarAnaquel').modal('hide');
    },
    Guardar: function() {
        var descripcion = $('#txtNuevaDescripcionAnaquel').val();
        if (!descripcion) { alerta2('info','','Ingrese una descripción'); return; }

        var formData = new FormData();
        formData.append('Descripcion', descripcion);

        Cargando(1);
        fetch('/Farmacia/AgregarAnaquel?area=Farmacia', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            if (res.estado) {
                alerta2('success','','Anaquel agregado');
                AgregarAnaquelModal.Cerrar();
                // recargar combo
                Disponibilidad.TiposAnaqueles();
            } else {
                alerta2('danger','', res.mensaje || 'Error al guardar');
            }
        })
        .catch(e => { alerta2('danger','', 'Error: ' + e); })
        .finally(() => { Cargando(0); });
    }
}

$(document).ready(function(){
    // nada
});