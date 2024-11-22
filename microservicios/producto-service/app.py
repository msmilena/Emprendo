from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud import storage
import datetime

app = Flask(__name__)

# Inicializar Firebase Admin SDK y Firestore
cred = credentials.Certificate('credentials.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Inicializar Firebase Storage
BUCKET_NAME = 'emprendo-1c101.firebasestorage.app'  # El nombre del bucket extraído del enlace
storage_client = storage.Client.from_service_account_json('credentials.json')
bucket = storage_client.bucket(BUCKET_NAME)


# Subir imagen a Firebase Storage
def upload_image_to_storage(image, filename):
    blob = bucket.blob(f'productos/{filename}')
    blob.upload_from_file(image, content_type=image.content_type)
    return blob.public_url


# Eliminar imagen de Firebase Storage
def delete_image_from_storage(filename):
    blob = bucket.blob(f'productos/{filename}')
    blob.delete()


# Endpoint para agregar un producto con imagen
@app.route('/emprendimientos/<emprendimiento_id>/agregar_producto', methods=['POST'])
def add_product_to_emprendimiento(emprendimiento_id):
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
    productos_ref = db.collection('emprendimientos').document(emprendimiento_id).collection('productos')
    productos_ref.add(product_data)

    return jsonify({'message': 'Producto agregado exitosamente', 'imagen_url': image_url}), 201


# Endpoint para actualizar un producto (y su imagen si es necesario)
@app.route('/emprendimientos/<emprendimiento_id>/productos/<producto_id>', methods=['PUT'])
def update_product_in_emprendimiento(emprendimiento_id, producto_id):
    data = request.form.to_dict()
    imagen = request.files.get('imagen')

    # Referencia al producto
    producto_ref = db.collection('emprendimientos').document(emprendimiento_id).collection('productos').document(producto_id)
    producto = producto_ref.get()
    if not producto.exists():
        return jsonify({'error': 'Producto no encontrado'}), 404

    product_data = producto.to_dict()

    # Si se proporciona una nueva imagen, reemplazar la existente
    if imagen:
        filename = imagen.filename
        new_image_url = upload_image_to_storage(imagen, filename)

        # Eliminar la imagen anterior
        old_image_url = product_data.get('imagen')
        if old_image_url:
            old_filename = old_image_url.split('/')[-1]
            delete_image_from_storage(f'productos/{old_filename}')

        product_data['imagen'] = new_image_url

    # Actualizar los datos restantes
    product_data.update({
        key: value for key, value in data.items() if key in [
            'nombre_producto', 'descripcion_producto', 'flgDisponible',
            'categoria_producto', 'precio', 'cantidadFavoritos'
        ]
    })
    product_data['fechaActualizacion'] = datetime.datetime.utcnow()

    producto_ref.set(product_data)
    return jsonify({'message': 'Producto actualizado exitosamente'}), 200


# Endpoint para eliminar un producto y su imagen
@app.route('/emprendimientos/<emprendimiento_id>/productos/<producto_id>', methods=['DELETE'])
def delete_product_from_emprendimiento(emprendimiento_id, producto_id):
    producto_ref = db.collection('emprendimientos').document(emprendimiento_id).collection('productos').document(producto_id)
    producto = producto_ref.get()
    if not producto.exists():
        return jsonify({'error': 'Producto no encontrado'}), 404

    product_data = producto.to_dict()

    # Eliminar la imagen de Firebase Storage
    image_url = product_data.get('imagen')
    if image_url:
        filename = image_url.split('/')[-1]
        delete_image_from_storage(f'productos/{filename}')

    # Eliminar el producto de Firestore
    producto_ref.delete()
    return jsonify({'message': 'Producto eliminado exitosamente'}), 200


# Endpoint para obtener todos los productos de un emprendimiento
@app.route('/emprendimientos/<emprendimiento_id>/productos', methods=['GET'])
def get_products_of_emprendimiento(emprendimiento_id):
    productos_ref = db.collection('emprendimientos').document(emprendimiento_id).collection('productos')
    productos = [doc.to_dict() for doc in productos_ref.stream()]
    return jsonify(productos), 200


# Endpoint para obtener todos los productos de todos los emprendimientos
@app.route('/productos', methods=['GET'])
def get_all_products():
    emprendimientos = db.collection('emprendimientos').stream()
    all_products = []
    for emprendimiento in emprendimientos:
        productos_ref = emprendimiento.reference.collection('productos')
        all_products.extend([doc.to_dict() for doc in productos_ref.stream()])
    return jsonify(all_products), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=8080)
