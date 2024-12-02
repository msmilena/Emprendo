from cloudevents.http import CloudEvent
import functions_framework
from google.cloud import firestore
from google.events.cloud import firestore as firestoredata

client = firestore.Client()

@functions_framework.cloud_event
def update_emprendimiento_valoracion(cloud_event: CloudEvent) -> None:
    firestore_payload = firestoredata.DocumentEventData()
    firestore_payload._pb.ParseFromString(cloud_event.data)

    path_parts = firestore_payload.value.name.split("/")
    separator_idx = path_parts.index("documents")
    collection_path = path_parts[separator_idx + 1]
    document_path = "/".join(path_parts[(separator_idx + 2) :])

    # Obtener el idEmprendimiento de la valoración
    id_emprendimiento = firestore_payload.value.fields["idEmprendimiento"].string_value

    emprendimiento_ref = client.collection('emprendimientos').document(id_emprendimiento)
    valoraciones_ref = client.collection_group('valoraciones').where('idEmprendimiento', '==', id_emprendimiento)
    valoraciones = valoraciones_ref.stream()

    total_valoracion = 0
    valoracion_count = 0

    for doc in valoraciones:
        total_valoracion += doc.to_dict()['valoracion']
        valoracion_count += 1

    valoracion_promedio = total_valoracion / valoracion_count if valoracion_count > 0 else 0

    emprendimiento_ref.update({
        'valoracion.promedio': valoracion_promedio,
        'valoracion.cantidad': valoracion_count
    })

if __name__ == "__main__":
    from cloudevents.http import CloudEvent

    # Simular un CloudEvent para pruebas locales
    event_data = {
        "value": {
            "fields": {
                "idEmprendimiento": {"stringValue": "test_id"}
            }
        }
    }
    attributes = {
        "type": "google.cloud.firestore.document.v1.created",
        "specversion": "1.0",
        "source": "//pubsub.googleapis.com/",
        "id": "1234567890"
    }
    cloud_event = CloudEvent(attributes, event_data)
    update_emprendimiento_valoracion(cloud_event)