const firebaseConfig = {
    apiKey: "AIzaSyCRTZYW_lXNRaw1tmtMBeuUgoSKHiNyyiU",
    authDomain: "rominafinalp2.firebaseapp.com",
    projectId: "rominafinalp2",
    storageBucket: "rominafinalp2.appspot.com",
    messagingSenderId: "433452142573",
    appId: "1:433452142573:web:ec28239d4f8a240b7ee1e4"
  };

firebase.initializeApp(firebaseConfig);
const defaultFirestore = firebase.firestore();

$(document).ready(function (){
    console.log("Página cargada");

    // Consultar base de datos
    cargarBD();
});

function cargarBD() {
    $('#expedientes tbody').empty();

    const datos = obtenerColeccion();

    datos.get().then((snap) => {
        snap.forEach(doc => {
            const dato = doc.data();
            
            var htmlTags = '<tr>' +
                '<td><a href="#" onclick="mostrar(\''+doc.id+'\')">' + dato.expediente + '</a></td>'+
            '</tr>';

            $('#expedientes tbody').append(htmlTags);
        });
    });
}

function guardarInfo() {
    var dato = new Object();

    if(!validarFormulario()) {
        return;
    }

    dato.expediente = $('#expediente').val();
    dato.nombre = $('#nombre').val();
    dato.causa = $('#causa').val();
    dato.telefono1 = $('#telefono1').val();
    dato.telefono2 = $('#telefono2').val();
    dato.email = $('#email').val();
    dato.sipe = $('#sipe').val();
    dato.comentario = $('#comentarios').val();

    guardarFirestore(dato);

    $('#btnGuardar').html('<i class="fas fa-hourglass spin"></i>');
    cargarBD();
    setTimeout(() => {
        $('#btnGuardar').html('Guardar');
    }, 6000);

    limpiarFormulario();
}

function mostrar(expediente) {
    console.log(expediente);

    obtenerExpediente(expediente).then((dato) => {
        if (dato != undefined) {
            const informacion = '<div class="row"><div class="col-4">Expediente:</div><div class="col">'+dato.expediente+'</div></div>' +
                                '<div class="row"><div class="col-4">Nombre:</div><div class="col">'+dato.nombre+'</div></div>' +
                                '<div class="row"><div class="col-4">Causa:</div><div class="col">'+dato.causa+'</div></div>' +
                                '<div class="row"><div class="col-4">Tel 1:</div><div class="col">'+dato.telefono1+'</div></div>' +
                                '<div class="row"><div class="col-4">Tel 2:</div><div class="col">'+dato.telefono2+'</div></div>' +
                                '<div class="row"><div class="col-4">Correo:</div><div class="col"> '+dato.email+'</div></div>' +
                                '<div class="row"><div class="col-4">SIPE: </div><div class="col">'+dato.sipe+'</div></div>' +
                                '<div class="row"><div class="col-4">Comentarios:</div><div class="col"></div></div>' +
                                '<p>'+dato.comentario+'</p>' + 
                                '<div class="row"><div class="col-12"><a href="#" class="btn btn-block btn-danger" onclick="borrarExpediente(\'' + expediente + '\', \'' + dato.expediente + '\')">Borrar</a></div>';
            
            $('#informacion').html(informacion);
        }
    });

}

function guardarFirestore(expediente) {
    defaultFirestore.collection("expedientes").add(expediente).then((docRef) => {
        console.log("Expediente agregado con el id: ", docRef.id);
    }).catch((error) => {
        console.error("Error al agregar el expediente: ", error);
    });
}

function obtenerColeccion() {
    const expedientes = defaultFirestore.collection("expedientes").orderBy("expediente");
    
    return expedientes;
}

async function obtenerExpediente(id) {
    const docRef = defaultFirestore.collection("expedientes").doc(id);
    var expediente = undefined;

    await docRef.get().then((doc) => {
        if (doc.exists) {
            expediente = doc.data();
        }
    });

    return expediente;
}

function borrarExpediente(id, expediente) {
    if (confirm('¿Realmente deseas borrar el expediente ' + expediente + '?')) {
        defaultFirestore.collection('expedientes').doc(id).delete().then(res => {
            console.log("Expediente eliminado");
            cargarBD();
            $('#informacion').html('');
        })
        .error(err => {
            console.log("Error al borrar expedinte: ", err);
        });
    }
}

function validarFormulario() {
    var valido = true;

    $("#formulario").addClass("was-validated");
    $("#formulario").removeClass("need-validation");

    if ($("#expediente").val().trim() === '') {
        valido = valido && false;
        $("#expediente").addClass('invalid');
    }
    else {
        $("#expediente").addClass('valid');
    }
    if ($("#nombre").val().trim() === '') {
        valido = valido && false;
        $("#nombre").addClass('invalid');
    }
    else {
        $("#nombre").addClass('valid');
    }
    if ($("#causa").val().trim() === '') {
        valido = valido && false;
        $("#causa").addClass('invalid');
    }
    else {
        $("#causa").addClass('valid');
    }
    if ($("#telefono1").val().trim() === '') {
        valido = valido && false;
        $("#telefono1").addClass('invalid');
    }
    else {
        $("#telefono1").addClass('valid');
    }
    if ($("#email").val().trim() === '') {
        valido = valido && false;
        $("#email").addClass('invalid');
    }
    else {
        $("#email").addClass('valid');
    }
    if ($("#sipe").val().trim() === '') {
        valido = valido && false;
        $("#sipe").addClass('invalid');
    }
    else {
        $("#sipe").addClass('valid');
    }

    return valido;
}

function limpiarFormulario() {
    $('#expediente').removeClass('valid');
    $('#nombre').removeClass('valid');
    $('#causa').removeClass('valid');
    $('#telefono1').removeClass('valid');
    $('#telefono2').removeClass('valid');
    $('#email').removeClass('valid');
    $('#sipe').removeClass('valid');
    $('#comentarios').removeClass('valid');

    $('#expediente').removeClass('invalid');
    $('#nombre').removeClass('invalid');
    $('#causa').removeClass('invalid');
    $('#telefono1').removeClass('invalid');
    $('#telefono2').removeClass('invalid');
    $('#email').removeClass('invalid');
    $('#sipe').removeClass('invalid');
    $('#comentarios').removeClass('invalid');

    $("#formulario").removeClass("was-validated");
    $("#formulario").addClass("need-validation");

    $('#expediente').val('');
    $('#nombre').val('');
    $('#causa').val('');
    $('#telefono1').val('');
    $('#telefono2').val('');
    $('#email').val('');
    $('#sipe').val('');
    $('#comentarios').val('');
}

/*
nst informacion = '<span>Expediente: '+dato.expediente+'</span><br>' +
                            '<span>Nombre: '+dato.nombre+'</span><br>' +
                            '<span>Causa: '+dato.causa+'</span><br>' +
                            '<span>Teléfono 1: '+dato.telefono1+'</span><br>' +
                            '<span>Teléfono 2: '+dato.telefono2+'</span><br>' +
                            '<span>Correo: '+dato.email+'</span><br>' +
                            '<span>SIPE: '+dato.sipe+'</span><br>' +
                            '<span>Comentarios:</span><br>' +
                            '<p>'+dato.comentario+'</p>';
                            */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", f => {
        navigator.serviceWorker.register('/sw.js')
                                .then(res => {
                                    console.log("ServiceWorker Registrado");
                                    res.scope;
                                })
                                .catch(err => {
                                    console.error("Error al registrar el ServiceWorker: ", err);
                                });
    });
}