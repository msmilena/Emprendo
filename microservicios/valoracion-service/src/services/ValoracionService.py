from src.database.db import get_connection
from src.utils.errors.CustomException import CustomException
from .models.Valoracion import Valoracion
from google.cloud.firestore_v1.base_query import FieldFilter
from firebase_admin import firestore

class ValoracionService():

    @classmethod
    def save_valoracion(cls, valoracion):
        try:
            db = get_connection()

            # Validar que los campos no estén vacíos
            required_fields = ['idUsuario', 'idEmprendimiento', 'valor']
            for field in required_fields:
                if not getattr(valoracion, field):
                    return {'success': False, 'message': f'El campo {field} no puede estar vacío'}
            if not valoracion.idUsuario:
                return {'success': False, 'message': 'El campo idUsuario no puede estar vacío'}
            if not valoracion.idEmprendimiento:
                return {'success': False, 'message': 'El campo idEmprendimiento no puede estar vacío'}
            if not valoracion.valor:
                return {'success': False, 'message': 'El campo valor no puede estar vacío'}
            
            emprendimiento_ref = db.collection('emprendimientos').document(valoracion.idEmprendimiento)
            print("emprendimiento ref",emprendimiento_ref)
            print("valoracion id", valoracion.idEmprendimiento)
            if not emprendimiento_ref.get().exists:
                return {'success': False, 'message': 'El emprendimiento especificado no existe'}


            # Agregar a usuario un nuevo documento en la colección 'valoracion'
            db.collection('usuarios').document(valoracion.idUsuario).collection('valoraciones').add({
                'fechaValoracion': firestore.SERVER_TIMESTAMP,
                'idEmprendimiento': emprendimiento_ref,
                'valoracion': valoracion.valor
            })

            return {'success': True, 'message': 'Valoracion guardada exitosamente'}
        except Exception as ex:
            raise CustomException(ex)


    @classmethod
    def upd_valoracion(cls,idUsuario,idEmprendimiento,valor):
        try:
            db = get_connection()
            
            if not idUsuario or not idEmprendimiento or valor is None:
                return ({'success': False, 'message': 'Faltan datos obligatorios'}), 400
            
            # Referencia a la colección de valoraciones del usuario
            valoraciones_ref = db.collection('usuarios').document(idUsuario).collection('valoraciones')

            # Buscar la valoración que corresponde al emprendimiento
            emprendimiento_ref = db.collection('emprendimientos').document(idEmprendimiento)
            query = valoraciones_ref.where('idEmprendimiento', '==', emprendimiento_ref).limit(1).get()

            if not query:
                return {'success': False, 'message': 'No se encontró una valoración para este emprendimiento'}

            # Obtener el ID del documento para actualizar
            valoracion_doc = query[0].reference
            valoracion_doc.update({
                'valoracion': valor,
                'fechaValoracion': firestore.SERVER_TIMESTAMP
            })

            return {'success': True, 'message': 'Valoración actualizada exitosamente'}
        
        except Exception as ex:
            raise CustomException(ex)


    @classmethod
    def get_valoraciones(cls, idUsuario):
        try:
            db = get_connection()
            valoracion_list = []
            valoraciones_ref = db.collection('usuarios').document(idUsuario).collection('valoraciones')
            valoraciones_docs = valoraciones_ref.stream()

            if not valoraciones_docs:
            # Si no hay valoraciones para ese usuario, puedes manejarlo así:
                return {'message': 'No se encontraron valoraciones para este usuario', 'success': True}

            for doc in valoraciones_docs:
                valoracion_data = doc.to_dict()
                fechaValoracion = valoracion_data.get('fechaValoracion')
                idEmprendimiento_ref = valoracion_data.get('idEmprendimiento')
                valoracion = valoracion_data.get('valoracion')

                if not idEmprendimiento_ref:
                    continue

                # Obtener el documento del emprendimiento
                emprendimiento_doc = idEmprendimiento_ref.get()
                if not emprendimiento_doc.exists:
                    continue

                idEmprendimiento = emprendimiento_doc.id
                emprendimiento_data = emprendimiento_doc.to_dict()
                nombreComercial = emprendimiento_data.get('nombreComercial')

                # Crear el diccionario con los datos requeridos
                valoracion_info = {
                    'idEmprendimiento': idEmprendimiento,
                    'nombreComercial': nombreComercial,
                    'fechaValoracion': fechaValoracion,
                    'valoracion': valoracion
                }

                valoracion_list.append(valoracion_info)

            return valoracion_list
        except Exception as ex:
            raise CustomException(ex)





    @classmethod
    def save_favorito(cls, idUsuario, idEmprendimiento, idProducto):
        try:
            db = get_connection()

            emprendimiento_ref = db.collection('emprendimientos').document(idEmprendimiento)
            producto_ref = emprendimiento_ref.collection('productos').document(idProducto)

            # Agregar a la colección 'favoritos' del usuario
            db.collection('usuarios').document(idUsuario).collection('favoritos').add({
                'fechaValoracion': firestore.SERVER_TIMESTAMP,
                'idProducto': producto_ref  # Se guarda la referencia al producto
            })

            #actualización cantidad favorito de producto!!!
            #producto_ref.update({
            #    'cantidadFavoritos': firestore.Increment(1)  # Incrementa en 1
            #})
            return {'success': True, 'message': 'Producto favorito guardado exitosamente'}
        except Exception as ex:
            raise CustomException(ex)


    @classmethod
    def dlt_favorito(cls, idUsuario, idEmprendimiento, idProducto):
        try:
            db = get_connection()

            if not idUsuario or not idEmprendimiento or idProducto is None:
                return ({'success': False, 'message': 'Faltan datos obligatorios'}), 400
            
            # Obtener la referencia del usuario y su colección de favoritos
            favoritos_ref = db.collection('usuarios').document(idUsuario).collection('favoritos')

            # Crear la referencia al documento del producto
            producto_ref = db.document(f'emprendimientos/{idEmprendimiento}/productos/{idProducto}')

            # Realizar la consulta usando la referencia del documento
            query = favoritos_ref.where('idProducto', '==', producto_ref).limit(1).get()

            # Verificar si se encontraron documentos
            documentos = list(query)
            if documentos:
                documentos[0].reference.delete()
                return {'success': True, 'message': 'Favorito eliminado exitosamente'}
            
            return {'success': False, 'message': 'No se encontró el favorito'}

        except Exception as ex:
            print(f"Error al eliminar favorito: {str(ex)}")
            raise CustomException(ex)



    @classmethod
    def get_favoritos(cls, idUsuario):
        try:
            db = get_connection()
            favoritos_list = []
            favoritos_ref = db.collection('usuarios').document(idUsuario).collection('favoritos')
            favoritos_docs = favoritos_ref.stream()

            if not favoritos_docs:
            # Si no hay favoritos para ese usuario, puedes manejarlo así:
                return {'message': 'No se encontraron favoritos para este usuario', 'success': True}

            for doc in favoritos_docs:
                favoritos_data = doc.to_dict()
                idProducto_ref = favoritos_data.get('idProducto')

                if idProducto_ref:  # Verifica si la referencia es válida
                    # Obtén el ID del emprendimiento desde la referencia
                    id_emprendimiento = idProducto_ref.parent.parent.id

                    # Verifica si el documento del emprendimiento existe
                    emprendimiento_doc = db.collection("emprendimientos").document(id_emprendimiento).get()
                    if emprendimiento_doc.exists:
                        emprendimiento_data = emprendimiento_doc.to_dict()
                        nombre_comercial = emprendimiento_data.get("nombreComercial")

                        # Obtén el documento del producto referenciado
                        producto_doc = idProducto_ref.get()
                        if producto_doc.exists:
                            producto_data = producto_doc.to_dict()
                            id_producto = producto_doc.id

                            # Construye el objeto del favorito
                            favoritos_list.append({
                                "idEmprendimiento": id_emprendimiento,
                                "nombreComercial": nombre_comercial,
                                "idProducto": id_producto,
                                "nombre_producto": producto_data.get("nombre_producto"),
                                "imagen": producto_data.get("imagen"),
                                "categoria_producto": producto_data.get("categoria_producto"),
                                "descripcion_producto": producto_data.get("descripcion_producto"),
                                "flgDisponible": producto_data.get("flgDisponible"),
                                "precio": producto_data.get("precio")
                            })
            return favoritos_list
        except Exception as ex:
            raise CustomException(ex)
