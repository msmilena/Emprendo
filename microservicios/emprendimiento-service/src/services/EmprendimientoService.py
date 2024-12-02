# Database
from src.database.db import get_connection
# Errors
from src.utils.errors.CustomException import CustomException
# Models
from .models.Emprendimiento import Emprendimiento
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime

class EmprendimientoService():

    @classmethod
    def get_infoEmprendimiento(cls, idEmprendimiento):
        try:
            db = get_connection()
            emprendimiento_ref = db.collection('emprendimientos').document(idEmprendimiento)
            emprendimiento_data = emprendimiento_ref.get()

            if emprendimiento_data.exists:
                doc_data = emprendimiento_data.to_dict()

                # Agregar el idEmprendimiento al diccionario principal
                doc_data['idEmprendimiento'] = idEmprendimiento

                # Verificar si hay una subcolección llamada 'productos'
                productos_ref = emprendimiento_ref.collection('productos')
                productos_docs = productos_ref.stream()  # Obtener documentos de la subcolección
                
                # Agregar idEmprendimiento a cada producto
                productos = [
                    {
                        **producto.to_dict(),  # Copiar los datos del producto
                        'idEmprendimiento': idEmprendimiento  # Agregar el idEmprendimiento
                    }
                    for producto in productos_docs
                ]
                
                if productos:  # Si hay productos, agregarlos al resultado
                    doc_data['productos'] = productos
                else:  # Si no hay productos, agregar mensaje adicional
                    doc_data['mensaje_productos'] = 'No hay productos disponibles.'
                
                print(doc_data)
                return doc_data
            
            return None
        except Exception as ex:
            raise CustomException(ex)


     
    @classmethod
    def get_top_emprendimientos(cls, limit=10):
        try:
            db = get_connection()
            emprendimientos_ref = db.collection('emprendimientos').limit(limit)
            docs = emprendimientos_ref.stream()
            emprendimientos = []
            for doc in docs:
                emprendimiento = doc.to_dict()
                emprendimiento['idEmprendimiento'] = doc.id
                emprendimientos.append(emprendimiento)
            return emprendimientos
        except Exception as ex:
            raise CustomException(ex)
            
    @classmethod
    def save_emprendimiento(cls, emprendimiento):
        try:
            db = get_connection()
            emprendimiento_ref = db.collection('emprendimientos').document()
            emprendimiento_data = emprendimiento.to_dict()
            emprendimiento_data['fechaCreacion'] = datetime.now()
            emprendimiento_ref.set(emprendimiento_data)
            return {'success': True}
        except Exception as ex:
            raise CustomException(ex)

    @classmethod
    def get_infoEmprendimiento_by_emprendedor(cls, idEmprendedor):
        try:
            db = get_connection()
             # Crear una referencia al documento del emprendedor
            emprendimientos_ref = db.collection('emprendimientos').where('idEmprendedor', '==', idEmprendedor)
            docs = emprendimientos_ref.stream()
            emprendimientos = []
            for doc in docs:
                emprendimiento = doc.to_dict()
                emprendimiento['idEmprendimiento'] = doc.id
                emprendimientos.append(emprendimiento)
            return emprendimientos if emprendimientos else None
        except Exception as ex:
            raise CustomException(ex)


    @classmethod
    def get_summary_info_dashboard_by_emprendedor(cls, idEmprendedor):
        try:
            db = get_connection()
            
            # Obtener los emprendimientos del emprendedor
            emprendimientos_ref = db.collection('emprendimientos').where('idEmprendedor', '==', idEmprendedor)
            docs = emprendimientos_ref.stream()
            
            resumenes = []
            for doc in docs:
                emprendimiento_data = doc.to_dict()
                emprendimiento_id = doc.id
                
                # Obtener los datos de valoración
                promedio_valoracion = emprendimiento_data.get('valoracion', {}).get('promedioValoracion', 0)
                totales_valoracion = emprendimiento_data.get('valoracion', {}).get('totalesValoracion', 0)
                
                # Contar el número de productos en la colección de productos
                productos_ref = db.collection('emprendimientos').document(emprendimiento_id).collection('productos')
                numero_productos = len(list(productos_ref.stream()))
                
                # Agregar los datos al resumen
                resumenes.append({
                    "idEmprendimiento": emprendimiento_id,
                    "promedioValoracion": promedio_valoracion,
                    "totalesValoracion": totales_valoracion,
                    "numeroProductos": numero_productos
                })
            
            return resumenes if resumenes else None
        except Exception as ex:
            raise CustomException(ex)



    @classmethod
    def get_top_productos_favoritos(cls, idEmprendimiento=None, idEmprendedor=None):
        try:
            db = get_connection()

            # Si se proporciona idEmprendimiento, obtener los productos directamente
            if idEmprendimiento:
                emprendimiento_ref = db.collection('emprendimientos').document(idEmprendimiento)
                productos_ref = emprendimiento_ref.collection('productos')
                productos_docs = productos_ref.stream()
                productos = [producto.to_dict() for producto in productos_docs]

                # Ordenar los productos por cantidadFavoritos de mayor a menor
                productos_ordenados = sorted(productos, key=lambda x: x.get('cantidadFavoritos', 0), reverse=True)

                # Devolver los primeros 3 productos
                return productos_ordenados[:3] if productos_ordenados else None

            # Si no se proporciona idEmprendimiento pero sí idEmprendedor, buscar los emprendimientos asociados
            if idEmprendedor:
                emprendimientos_ref = db.collection('emprendimientos').where('idEmprendedor', '==', idEmprendedor)
                docs = emprendimientos_ref.stream()
                productos = []

                for doc in docs:
                    emprendimiento = doc.to_dict()
                    emprendimiento_ref = db.collection('emprendimientos').document(doc.id)
                    productos_ref = emprendimiento_ref.collection('productos')
                    productos_docs = productos_ref.stream()

                    for producto_doc in productos_docs:
                        producto = producto_doc.to_dict()
                        producto['idProducto'] = producto_doc.id
                        productos.append(producto)

                # Ordenar los productos por cantidadFavoritos de mayor a menor
                productos_ordenados = sorted(productos, key=lambda x: x.get('cantidadFavoritos', 0), reverse=True)

                # Devolver los primeros 3 productos
                return productos_ordenados[:3] if productos_ordenados else None

        except Exception as ex:
            raise CustomException(ex)

    @classmethod
    def get_emprendimiento_por_emprendedor(cls, idEmprendedor):
        try:
            db = get_connection()
            # Buscar el emprendimiento donde el campo 'idEmprendedor' coincida
            emprendimiento_ref = db.collection('emprendimientos').where('idEmprendedor', '==', idEmprendedor)
            emprendimiento_id = emprendimiento_ref.stream()

            # Si se encuentra un emprendimiento, devolver solo el 'idEmprendimiento'
            for doc in emprendimiento_id:
                return doc.id  # Retorna el id del emprendimiento encontrado

            return None
        except Exception as ex:
            raise CustomException(ex)