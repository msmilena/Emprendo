from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage
import datetime
import json
from werkzeug.utils import secure_filename

from flask_cors import CORS, cross_origin



app = Flask(__name__)

CORS(app, origins="*", supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE"], allow_headers=["Content-Type", "Authorization"])

# Inicializar Firebase Admin SDK y Firestore
cred = credentials.Certificate('credentials.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Inicializar Firebase Storage
BUCKET_NAME = 'emprendo-1c101.firebasestorage.app'  # El nombre del bucket extraído del enlace
storage_client = storage.Client.from_service_account_json('credentials.json')
bucket = storage_client.bucket(BUCKET_NAME)

class CustomException(Exception):
    """Excepción personalizada para manejar errores específicos."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message

    def __str__(self):
        return f"CustomException: {self.message}"

# Subir imagen a Firebase Storage
def upload_image_to_storage(image, filename):
    try:
        if not filename.startswith('productos/'):
            filename = f'productos/{secure_filename(filename)}'

        # Obtener el bucket desde el cliente de storage
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(filename)

        # Subir la imagen
        blob.upload_from_file(image, content_type=image.content_type)

        # Hacer pública la imagen
        blob.make_public()
        return blob.public_url

    except Exception as e:
        print(f"Error al subir la imagen a Firebase Storage: {e}")
        raise CustomException("No se pudo subir la imagen al almacenamiento.")



# Eliminar imagen de Firebase Storage
def delete_image_from_storage(filename):
    blob = bucket.blob(filename)
    blob.delete()


# Endpoint para agregar un producto con imagen
@app.route('/emprendimientos/<id_emprendimiento>/agregar_producto', methods=['POST'])
def add_product_to_emprendimiento(id_emprendimiento):
    if 'imagen' not in request.files:
        return jsonify({'error': 'La imagen es obligatoria'}), 400

    # Obtener la imagen y los datos del producto
    imagen = request.files['imagen']
    data = request.form.to_dict()

    # Validar campos requeridos
    required_fields = [
        'nombre_producto', 'descripcion_producto', 'flgDisponible',
        'categoria_producto', 'precio', 'cantidadFavoritos'
    ]
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'El campo {field} es obligatorio'}), 400

    # Subir la imagen a Firebase Storage
    filename = imagen.filename
    image_url = upload_image_to_storage(imagen, filename)

    # Crear datos del producto
    product_data = {
        'nombre_producto': data['nombre_producto'],
        'descripcion_producto': data['descripcion_producto'],
        'flgDisponible': data['flgDisponible'] == 'true',
        'categoria_producto': data['categoria_producto'],
        'precio': float(data['precio']),
        'cantidadFavoritos': int(data['cantidadFavoritos']),
        'imagen': image_url,
        'fechaActualizacion': datetime.datetime.utcnow()
    }

    # Guardar el producto en Firestore
    productos_ref = db.collection('emprendimientos').document(id_emprendimiento).collection('productos')
    productos_ref.add(product_data)

    return jsonify({'message': 'Producto agregado exitosamente', 'imagen_url': image_url}), 201


# Endpoint para actualizar un producto (y su imagen si es necesario)
@app.route('/emprendimientos/<id_emprendimiento>/productos/<id_producto>', methods=['PUT'])
def update_product_in_emprendimiento(id_emprendimiento, id_producto):
    data = request.form.to_dict()
    imagen = request.files.get('imagen')

    # Referencia al producto
    producto_ref = db.collection('emprendimientos').document(id_emprendimiento).collection('productos').document(id_producto)
    producto = producto_ref.get()

    if not producto.exists:
        return jsonify({'error': 'Producto no encontrado'}), 404

    product_data = producto.to_dict()

    # Si se proporciona una nueva imagen, reemplazar la existente
    if imagen:
        filename = imagen.filename
        new_image_url = upload_image_to_storage(imagen, filename)

        # Eliminar la imagen anterior
        old_image_url = product_data.get('imagen')
        if old_image_url:
            old_filename = '/'.join(old_image_url.split('/')[-2:])
            delete_image_from_storage(old_filename)

        product_data['imagen'] = new_image_url

    # Actualizar los datos restantes
    for key in ['nombre_producto', 'descripcion_producto', 'flgDisponible', 'categoria_producto', 'precio', 'cantidadFavoritos']:
        if key in data:
            product_data[key] = data[key]

    product_data['fechaActualizacion'] = datetime.datetime.utcnow()

    producto_ref.set(product_data)
    return jsonify({'message': 'Producto actualizado exitosamente'}), 200


# Endpoint para eliminar un producto y su imagen
@app.route('/emprendimientos/<id_emprendimiento>/productos/<id_producto>', methods=['DELETE'])
def delete_product_from_emprendimiento(id_emprendimiento, id_producto):
    producto_ref = db.collection('emprendimientos').document(id_emprendimiento).collection('productos').document(id_producto)
    producto = producto_ref.get()

    if not producto.exists:
        return jsonify({'error': 'Producto no encontrado'}), 404

    product_data = producto.to_dict()

    # Eliminar la imagen de Firebase Storage
    image_url = product_data.get('imagen')
    if image_url:
        filename = '/'.join(image_url.split('/')[-2:])
        delete_image_from_storage(filename)

    # Eliminar el producto de Firestore
    producto_ref.delete()
    return jsonify({'message': 'Producto eliminado exitosamente'}), 200


# Endpoint para obtener todos los productos de un emprendimiento
@app.route('/emprendimientos/<id_emprendimiento>/productos', methods=['GET'])
def get_products_of_emprendimiento(id_emprendimiento):
    try:
        print(f"Obteniendo productos para el emprendimiento: {id_emprendimiento}")
        productos_ref = db.collection('emprendimientos').document(id_emprendimiento).collection('productos')
        productos = [
            {**doc.to_dict(), 'id_producto': doc.id}  # Incluye el ID del documento como 'id_producto'
            for doc in productos_ref.stream()
        ]
        if not productos:  # Si no hay productos
            return jsonify({'mensaje': 'No hay productos disponibles para este emprendimiento'}), 200
        return jsonify(productos), 200
    except Exception as e:
        print(f"Error al obtener los productos: {e}")
        return jsonify({'mensaje': 'Error al obtener los productos'}), 500


# Endpoint para obtener todos los productos de todos los emprendimientos
@app.route('/productos', methods=['GET'])
def get_all_products():
    emprendimientos = db.collection('emprendimientos').stream()
    all_products = []
    for emprendimiento in emprendimientos:
        productos_ref = emprendimiento.reference.collection('productos')
        all_products.extend([doc.to_dict() for doc in productos_ref.stream()])
    return jsonify(all_products), 200


# Endpoint para obtener un solo producto por su ID
@app.route('/emprendimientos/<id_emprendimiento>/productos/<id_producto>', methods=['GET'])
def get_product_by_id(id_emprendimiento, id_producto):
    # Referencia al producto
    producto_ref = db.collection('emprendimientos').document(id_emprendimiento).collection('productos').document(id_producto)
    producto = producto_ref.get()

    if not producto.exists:
        return jsonify({'error': 'Producto no encontrado'}), 404

    # Retornar los datos del producto
    product_data = producto.to_dict()
    return jsonify(product_data), 200


@app.route('/categorias', methods=['GET'])
def get_categorias():
    with open('categoriasHome.json', 'r') as file:
        categorias = json.load(file)
    return jsonify(categorias), 200


@app.route('/emprendimientos/categoria/<categoria>', methods=['GET'])
def get_emprendimientos_by_categoria(categoria):
    try:
        emprendimientos_ref = db.collection('emprendimientos')
        emprendimientos = emprendimientos_ref.where('categoria', '==', categoria).stream()
        
        result = []
        for emprendimiento in emprendimientos:
            emprendimiento_data = emprendimiento.to_dict()
            
            # Limpiar campos innecesarios
            if 'idEmprendedor' in emprendimiento_data:
                del emprendimiento_data['idEmprendedor']
            if 'localizacion' in emprendimiento_data:
                del emprendimiento_data['localizacion']
            
            # ID del emprendimiento
            idEmprendimiento = emprendimiento.id
            
            # Acceder a la subcolección 'productos'
            productos_ref = emprendimiento.reference.collection('productos')
            productos = []
            for producto_doc in productos_ref.stream():
                producto_data = producto_doc.to_dict()
                producto_data['id'] = producto_doc.id  # Agregar el ID del documento
                producto_data['idEmprendimiento'] = idEmprendimiento  # Agregar el ID del emprendimiento
                productos.append(producto_data)
            
            emprendimiento_data['productos'] = productos  # Agregar los productos al emprendimiento
            result.append(emprendimiento_data)
        
        # Verificar si hay resultados
        if not result:
            return jsonify({'mensaje': 'No hay emprendimientos disponibles para esta categoría'}), 200
        
        return jsonify(result), 200
    except Exception as e:
        print(f"Error al obtener los emprendimientos por categoría: {e}")
        return jsonify({'mensaje': 'Error al obtener los emprendimientos por categoría'}), 500



@app.route('/categorias_subcategorias', methods=['GET'])
def get_categorias_subcategorias():
    categorias_subcategorias = {
        "Manufactura y Producción": [
            "Productos alimenticios y bebidas",
            "Textiles y confección",
            "Productos de madera y papel",
            "Productos químicos",
            "Metales y productos metálicos"
        ],
        "Comercio": [
            "Venta al por mayor",
            "Venta al por menor"
        ],
        "Servicios": [
            "Servicios profesionales",
            "Servicios de transporte",
            "Servicios financieros",
            "Servicios de salud"
        ],
        "Tecnología y comunicaciones": [
            "Servicios informáticos",
            "Telecomunicaciones"
        ],
        "Educación y cultura": [
            "Servicios educativos",
            "Actividades culturales y recreativas"
        ],
        "Construcción y bienes raíces": [
            "Construcción",
            "Actividades inmobiliarias"
        ],
        "Hotelería y turismo": [
            "Alojamiento",
            "Servicios turísticos"
        ],
        "Servicios personales": [
            "Servicios de belleza",
            "Mantenimiento y reparación"
        ]
    }
    return jsonify(categorias_subcategorias), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=8080)