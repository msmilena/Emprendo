const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.updateEmprendimientoValoracion = functions.firestore
    .document('usuarios/{userId}/valoraciones/{valoracionId}')
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        const idEmprendimiento = newValue.idEmprendimiento;

        const emprendimientoRef = admin.firestore().collection('emprendimientos').doc(idEmprendimiento);
        const valoracionesSnapshot = await admin.firestore().collectionGroup('valoraciones')
            .where('idEmprendimiento', '==', idEmprendimiento).get();

        let totalValoracion = 0;
        let valoracionCount = 0;

        valoracionesSnapshot.forEach(doc => {
            totalValoracion += doc.data().valoracion;
            valoracionCount++;
        });

        const valoracionPromedio = totalValoracion / valoracionCount;

        await emprendimientoRef.update({
            'valoracion.promedio': valoracionPromedio,
            'valoracion.cantidad': valoracionCount
        });
    });