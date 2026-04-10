'use strict';

$(document).ready(function() {
    initLoginPage();
});

// ✅ 1) Inicialización general
function initLoginPage() {
    initUI();               // preloader + fondos
    initValidators();       // validator principal
    initExtraValidators();  // otros validators (los tenías, pero no lo llamabas)
    initIPress();           // carga select + set hidden
    initSlider();           // slider
}

// ✅ 2) IPress: cargar y mantener hidden sincronizado
function initIPress() {
    // cuando cambia el select, actualiza el hidden
    $(document).on('change', '#ipress', function() {
        setNombreIPressHidden();
    });

    cargarIPress();
}

function setNombreIPressHidden() {
    var txt = $('#ipress option:selected').text() || '';
    // si está en el placeholder, lo dejamos vacío
    if ($('#ipress').val() === '' || txt.indexOf('Seleccione') === 0) txt = '';
    $('#NombreIPress').val(txt);
}

function cargarIPress() {
    $.ajax({
        url: "/Home/ListarIPress",
        dataType: "json",
        type: "get",
        cache: false,

  success: function(r) {
            if (!r || r.ok === false) {
                toastr.error("Error al listar IPress:<br>" + r?.mensaje || "No se pudo listar IPress");
                return;
            }

            var $ipress = $('#ipress');
            $ipress.empty().append('<option value="">Seleccione Hospital IPress</option>');

            $(r.table || []).each(function(i, obj) {
                $ipress.append('<option value="' + (obj.valor ?? '') + '">' + (obj.descripcion ?? '') + '</option>');
            });

            // default: deja hidden vacío
            setNombreIPressHidden();

            // revalida si ya está inicializado el bootstrapValidator
            var bv = $('#login_validator').data('bootstrapValidator');
            if (bv) {
                bv.revalidateField('IdIPress');
            }
        },
        error: function() {
            toastr.error("Error al llamar /Home/ListarIPress");
            $('#ipress').empty().append('<option value="">Seleccione Hospital IPress</option>');
            setNombreIPressHidden();
            removeRequiredIPress(); // opcional
        }
    });
}

// ✅ opcional: si no hay IPress por error, que NO sea obligatorio
function removeRequiredIPress() {
    $('#ipress').removeAttr('required');

    var bv = $('#login_validator').data('bootstrapValidator');
    if (bv) {
        // deshabilita validación del campo
        bv.enableFieldValidators('IdIPress', false);
    }
}

// ✅ 3) UI
function initUI() {
    $('.bg-mascara').hide();
    $('body').removeClass('login_backimg');

    $(".login_backimg").backstretch([
        "/images/fondo1.jpg",
        "/images/fondo2.jpg",
        "/images/fondo3.jpg"
    ], { duration: 3000, fade: 750 });

    $(window).on("load", function() {
        $('.preloader img').fadeOut();
        $('.preloader').fadeOut(1000);
    });
}

// ✅ 4) Validaciones
function initValidators() {
    $('#login_validator').bootstrapValidator({
        fields: {
            USERID: { validators: { notEmpty: { message: 'Ingrese el usuario por favor.' } } },
            PASSWORD: { validators: { notEmpty: { message: 'Ingrese la contraseña por favor.' } } },
            IdIPress: { validators: { notEmpty: { message: 'Seleccione Hospital IPress por favor.' } } }
        }
    });
}

function initExtraValidators() {
    // si no existen en esta vista, no rompe
    if ($('#register_valid').length) {
        $('#register_valid').bootstrapValidator({
            fields: {
                UserName: { validators: { notEmpty: { message: 'The user name is required and cannot be empty' } } },
                email: {
                    validators: {
                        notEmpty: { message: 'The email address is required' },
                        regexp: { regexp: /^\S+@\S{1,}\.\S{1,}$/, message: 'The input is not a valid email address' }
                    }
                },
                password: { validators: { notEmpty: { message: 'Please provide a password' } } },
                confirmpassword: {
                    validators: {
                        notEmpty: { message: 'The confirm password is required and can\'t be empty' },
                        identical: { field: 'password', message: 'Please enter the same password as above' }
                    }
                }
            }
        });
    }

    if ($('#login_validator1').length) {
        $('#login_validator1').bootstrapValidator({
            fields: {
                email_modal: {
                    validators: {
                        notEmpty: { message: 'enter your valid email' },
                        regexp: { regexp: /^\S+@\S{1,}\.\S{1,}$/, message: 'The input is not a valid email address' }
                    }
                }
            }
        });
    }

    toggleSubmitEmail();
}

function toggleSubmitEmail() {
    if ($('.email_forgot').length) {
        $(".submit_email").prop("disabled", !($('.email_forgot').val() && $('.email_forgot').val().length > 0));
    }
}

/* ====== Slider ====== */
function initSlider() {
    var $slides = $('#slider .slide');
    var $dots = $('#slideDots .dot');
    if ($slides.length === 0) return;

    // set backgrounds
    $slides.each(function() {
        var img = $(this).data('img');
        if (img) $(this).css('background-image', 'url(' + img + ')');
    });

    var idx = 0;

    function go(i) {
        idx = i;
        $slides.removeClass('active').eq(idx).addClass('active');
        $dots.removeClass('active').eq(idx).addClass('active');
    }

    $dots.off('click').on('click', function() {
        go(parseInt($(this).data('idx'), 10) || 0);
    });

    go(0);

    setInterval(function() {
        go((idx + 1) % $slides.length);
    }, 3500);
} 