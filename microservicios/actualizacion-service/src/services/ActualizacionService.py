# Database
from src.database.db import get_connection
# Errors
from src.utils.errors.CustomException import CustomException
# Models
from .models.Emprendimiento import Emprendimiento
from google.cloud.firestore_v1.base_query import FieldFilter
from google.cloud.firestore_v1.document import DocumentReference  # Add this import
from datetime import datetime
from google.cloud import bigquery
from google.oauth2 import service_account

# Set Up Google Cloud Credentials
credentials_path = 'credenciales.json'
credentials = service_account.Credentials.from_service_account_file(credentials_path)


class ActualizacionService():

    @classmethod
    def update_bigquery_from_firestore(cls):
        try:
            db = get_connection()
            users_ref = db.collection('usuarios')
            users_docs = users_ref.stream()

            client = bigquery.Client(credentials=credentials, project=credentials.project_id)
            table_id = 'emprendo-1c101.emprendofirestore.usuarios'
            staging_table_id = f"{table_id}_staging"

            rows_to_insert = []
            existing_ids = set()

            # Fetch existing ids from BigQuery
            query = f"SELECT idUser FROM `{table_id}`"
            try:
                query_job = client.query(query)
                for row in query_job:
                    existing_ids.add(row["idUser"])
            except:
                # Table does not exist, create it
                schema = [
                    bigquery.SchemaField("idUser", "STRING"),
                    bigquery.SchemaField("email", "STRING"),
                    bigquery.SchemaField("fechaCreacion", "RECORD", fields=[
                        bigquery.SchemaField("date_time", "TIMESTAMP"),
                        bigquery.SchemaField("string", "STRING"),
                        bigquery.SchemaField("provided", "STRING")
                    ]),
                    bigquery.SchemaField("nombre", "STRING"),
                    bigquery.SchemaField("password", "STRING"),
                    bigquery.SchemaField("primerLogin", "STRING"),
                    bigquery.SchemaField("tipo", "STRING"),
                    bigquery.SchemaField("tipoAuth", "INT64"),
                    bigquery.SchemaField("urlPerfil", "STRING"),
                    bigquery.SchemaField("localizacion", "RECORD", fields=[
                        bigquery.SchemaField("lat", "FLOAT"),
                        bigquery.SchemaField("long", "FLOAT")
                    ])
                ]
                table = bigquery.Table(table_id, schema=schema)
                client.create_table(table)

            for doc in users_docs:
                user_data = doc.to_dict()
                fecha_creacion = user_data.get("fechaCreacion")
                localizacion = user_data.get("localizacion")
                print(doc.id)
                row = {
                    "idUser": doc.id,
                    "email": user_data.get("email"),
                    "fechaCreacion": {
                        "date_time": fecha_creacion.isoformat() if isinstance(fecha_creacion, datetime) else fecha_creacion,
                        "string": None,
                        "provided": None
                    },
                    "nombre": user_data.get("nombre"),
                    "password": user_data.get("password"),
                    "primerLogin": user_data.get("primerLogin"),
                    "tipo": user_data.get("tipo"),
                    "tipoAuth": int(user_data.get("tipoAuth")) if user_data.get("tipoAuth") is not None else None,
                    "urlPerfil": user_data.get("urlPerfil"),
                    "localizacion": {
                        "lat": localizacion.latitude if localizacion else None,
                        "long": localizacion.longitude if localizacion else None
                    },
                }
                rows_to_insert.append(row)

            # Create the staging table
            schema = [
                bigquery.SchemaField("idUser", "STRING"),
                bigquery.SchemaField("email", "STRING"),
                bigquery.SchemaField("fechaCreacion", "RECORD", fields=[
                    bigquery.SchemaField("date_time", "TIMESTAMP"),
                    bigquery.SchemaField("string", "STRING"),
                    bigquery.SchemaField("provided", "STRING")
                ]),
                bigquery.SchemaField("nombre", "STRING"),
                bigquery.SchemaField("password", "STRING"),
                bigquery.SchemaField("primerLogin", "STRING"),
                bigquery.SchemaField("tipo", "STRING"),
                bigquery.SchemaField("tipoAuth", "INT64"),
                bigquery.SchemaField("urlPerfil", "STRING"),
                bigquery.SchemaField("localizacion", "RECORD", fields=[
                    bigquery.SchemaField("lat", "FLOAT"),
                    bigquery.SchemaField("long", "FLOAT")
                ])
            ]

            # Delete the original table if it exists
            client.delete_table(table_id, not_found_ok=True)

            # Create the main table with the new schema
            table = bigquery.Table(table_id, schema=schema)
            client.create_table(table, exists_ok=True)

            # Create the staging table
            table = bigquery.Table(staging_table_id, schema=schema)
            client.create_table(table, exists_ok=True)

            # Insert data into the staging table
            errors = client.insert_rows_json(staging_table_id, rows_to_insert, row_ids=[None] * len(rows_to_insert))
            if errors:
                raise CustomException(f"Errors occurred while inserting rows into staging table: {errors}")

            # Replace the main table with the staging table
            replace_query = f"""
            CREATE OR REPLACE TABLE `{table_id}` AS
            SELECT * FROM `{staging_table_id}`
            """
            query_job = client.query(replace_query)
            query_job.result()

            # Drop the staging table
            client.delete_table(staging_table_id, not_found_ok=True)

            return {"success": True, "message": "BigQuery table updated successfully"}
        except Exception as ex:
            raise CustomException(ex)

    @classmethod
    def update_bigquery_from_emprendimientos(cls):
        try:
            db = get_connection()
            emprendimientos_ref = db.collection('emprendimientos')
            emprendimientos_docs = emprendimientos_ref.stream()

            client = bigquery.Client(credentials=credentials, project=credentials.project_id)
            table_id = 'emprendo-1c101.emprendofirestore.emprendimientos'
            staging_table_id = f"{table_id}_staging"

            rows_to_insert = []

            for doc in emprendimientos_docs:
                emprendimiento_data = doc.to_dict()
                fecha_creacion = emprendimiento_data.get("fechaCreacion")
                fecha_actualizacion = emprendimiento_data.get("fechaActualizacion")
                localizacion = emprendimiento_data.get("localizacion")
                valoracion = emprendimiento_data.get("valoracion", {})
                redes_sociales = emprendimiento_data.get("redesSociales", {})

                id_emprendedor = emprendimiento_data.get("idEmprendedor")
                if isinstance(id_emprendedor, DocumentReference):
                    id_emprendedor = id_emprendedor.path.split('/')[-1]

                row = {
                    "idEmprendimiento": doc.id,
                    "categoria": emprendimiento_data.get("categoria"),
                    "descripcion": emprendimiento_data.get("descripcion"),
                    "fechaActualizacion": fecha_actualizacion.isoformat() if isinstance(fecha_actualizacion, datetime) else fecha_actualizacion,
                    "fechaCreacion": fecha_creacion.isoformat() if isinstance(fecha_creacion, datetime) else fecha_creacion,
                    "idEmprendedor": id_emprendedor,
                    "localizacion": {
                        "lat": localizacion.latitude if localizacion else None,
                        "long": localizacion.longitude if localizacion else None
                    },
                    "nombreComercial": emprendimiento_data.get("nombreComercial"),
                    "redesSociales": {
                        "facebook": redes_sociales.get("facebook"),
                        "instagram": redes_sociales.get("instagram"),
                        "twitter": redes_sociales.get("twitter")
                    },
                    "ruc": emprendimiento_data.get("ruc"),
                    "subcategoria": emprendimiento_data.get("subcategoria"),
                    "valoracion": {
                        "promedioValoracion": valoracion.get("promedioValoracion"),
                        "totalesValoracion": valoracion.get("totalesValoracion")
                    }
                }
                rows_to_insert.append(row)

            # Create the staging table
            schema = [
                bigquery.SchemaField("idEmprendimiento", "STRING"),
                bigquery.SchemaField("categoria", "STRING"),
                bigquery.SchemaField("descripcion", "STRING"),
                bigquery.SchemaField("fechaActualizacion", "TIMESTAMP"),
                bigquery.SchemaField("fechaCreacion", "TIMESTAMP"),
                bigquery.SchemaField("idEmprendedor", "STRING"),
                bigquery.SchemaField("localizacion", "RECORD", fields=[
                    bigquery.SchemaField("lat", "FLOAT"),
                    bigquery.SchemaField("long", "FLOAT")
                ]),
                bigquery.SchemaField("nombreComercial", "STRING"),
                bigquery.SchemaField("redesSociales", "RECORD", fields=[
                    bigquery.SchemaField("facebook", "STRING"),
                    bigquery.SchemaField("instagram", "STRING"),
                    bigquery.SchemaField("twitter", "STRING")
                ]),
                bigquery.SchemaField("ruc", "STRING"),
                bigquery.SchemaField("subcategoria", "STRING"),
                bigquery.SchemaField("valoracion", "RECORD", fields=[
                    bigquery.SchemaField("promedioValoracion", "FLOAT"),
                    bigquery.SchemaField("totalesValoracion", "INTEGER")
                ])
            ]

            table = bigquery.Table(staging_table_id, schema=schema)
            client.create_table(table, exists_ok=True)

            # Verify the staging table exists
            table = client.get_table(staging_table_id)

            # Insert data into the staging table
            errors = client.insert_rows_json(staging_table_id, rows_to_insert, row_ids=[None] * len(rows_to_insert))
            if errors:
                raise CustomException(f"Errors occurred while inserting rows into staging table: {errors}")

            # Replace the main table with the staging table
            replace_query = f"""
            CREATE OR REPLACE TABLE `{table_id}` AS
            SELECT * FROM `{staging_table_id}`
            """
            query_job = client.query(replace_query)
            query_job.result()

            # Drop the staging table
            client.delete_table(staging_table_id, not_found_ok=True)

            return {"success": True, "message": "BigQuery table updated successfully"}
        except Exception as ex:
            raise CustomException(ex)

    @classmethod
    def create_emprendimientos_table(cls):
        try:
            client = bigquery.Client(credentials=credentials, project=credentials.project_id)
            table_id = 'emprendo-1c101.emprendofirestore.emprendimientos'

            schema = [
                bigquery.SchemaField("categoria", "STRING"),
                bigquery.SchemaField("descripcion", "STRING"),
                bigquery.SchemaField("fechaActualizacion", "TIMESTAMP"),
                bigquery.SchemaField("fechaCreacion", "TIMESTAMP"),
                bigquery.SchemaField("idEmprendedor", "STRING"),
                bigquery.SchemaField("localizacion", "RECORD", fields=[
                    bigquery.SchemaField("lat", "FLOAT"),
                    bigquery.SchemaField("long", "FLOAT")
                ]),
                bigquery.SchemaField("nombreComercial", "STRING"),
                bigquery.SchemaField("redesSociales", "RECORD", fields=[
                    bigquery.SchemaField("facebook", "STRING"),
                    bigquery.SchemaField("instagram", "STRING"),
                    bigquery.SchemaField("twitter", "STRING")
                ]),
                bigquery.SchemaField("ruc", "STRING"),
                bigquery.SchemaField("subcategoria", "STRING"),
                bigquery.SchemaField("valoracion", "RECORD", fields=[
                    bigquery.SchemaField("promedioValoracion", "FLOAT"),
                    bigquery.SchemaField("totalesValoracion", "INTEGER")
                ])
            ]

            table = bigquery.Table(table_id, schema=schema)
            client.create_table(table, exists_ok=True)

            return {"success": True, "message": "Emprendimientos table created successfully"}
        except Exception as ex:
            raise CustomException(ex)

    @classmethod
    def update_bigquery_from_productos(cls):
        try:
            db = get_connection()
            emprendimientos_ref = db.collection('emprendimientos')
            emprendimientos_docs = emprendimientos_ref.stream()

            client = bigquery.Client(credentials=credentials, project=credentials.project_id)
            table_id = 'emprendo-1c101.emprendofirestore.productos'
            recommendations_table_id = 'emprendo-1c101.emprendofirestore.productos_recomendations'

            rows_to_insert = []
            recommendations_rows_to_insert = []

            for emprendimiento_doc in emprendimientos_docs:
                productos_ref = emprendimiento_doc.reference.collection('productos')
                productos_docs = productos_ref.stream()

                for doc in productos_docs:
                    producto_data = doc.to_dict()
                    fecha_actualizacion = producto_data.get("fechaActualizacion")

                    row = {
                        "idProducto": doc.id,
                        "idEmprendimiento": emprendimiento_doc.id,
                        "cantidadFavoritos": producto_data.get("cantidadFavoritos"),
                        "categoria_producto": producto_data.get("categoria_producto"),
                        "descripcion_producto": producto_data.get("descripcion_producto"),
                        "fechaActualizacion": fecha_actualizacion.isoformat() if isinstance(fecha_actualizacion, datetime) else fecha_actualizacion,
                        "flgDisponible": producto_data.get("flgDisponible"),
                        "imagen": producto_data.get("imagen"),
                        "nombre_producto": producto_data.get("nombre_producto"),
                        "precio": producto_data.get("precio"),
                        "id": doc.id,  # New field
                        "title": producto_data.get("nombre_producto"),  # New field
                        "categories": [producto_data.get("categoria_producto")]  # Wrap in array
                    }
                    rows_to_insert.append(row)

                    recommendations_row = {
                        "id": doc.id,
                        "title": producto_data.get("nombre_producto"),
                        "categories": [producto_data.get("categoria_producto")]
                    }
                    recommendations_rows_to_insert.append(recommendations_row)

            # Create the main table schema
            schema = [
                bigquery.SchemaField("idProducto", "STRING"),
                bigquery.SchemaField("idEmprendimiento", "STRING"),
                bigquery.SchemaField("cantidadFavoritos", "INT64"),
                bigquery.SchemaField("categoria_producto", "STRING"),
                bigquery.SchemaField("descripcion_producto", "STRING"),
                bigquery.SchemaField("fechaActualizacion", "TIMESTAMP"),
                bigquery.SchemaField("flgDisponible", "BOOLEAN"),
                bigquery.SchemaField("imagen", "STRING"),
                bigquery.SchemaField("nombre_producto", "STRING"),
                bigquery.SchemaField("precio", "FLOAT"),
                bigquery.SchemaField("id", "STRING", mode="REQUIRED"),  # New field
                bigquery.SchemaField("title", "STRING", mode="REQUIRED"),  # New field
                bigquery.SchemaField("categories", "STRING", mode="REPEATED")  # New field
            ]

            # Create the recommendations table schema
            recommendations_schema = [
                bigquery.SchemaField("id", "STRING", mode="REQUIRED"),
                bigquery.SchemaField("title", "STRING", mode="REQUIRED"),
                bigquery.SchemaField("categories", "STRING", mode="REPEATED")
            ]

            # Check if the main table exists, if not create it
            try:
                client.get_table(table_id)
            except:
                table = bigquery.Table(table_id, schema=schema)
                client.create_table(table)

            # Check if the recommendations table exists, if not create it
            try:
                client.get_table(recommendations_table_id)
            except:
                recommendations_table = bigquery.Table(recommendations_table_id, schema=recommendations_schema)
                client.create_table(recommendations_table)

            # Insert data into the main table
            errors = client.insert_rows_json(table_id, rows_to_insert, row_ids=[None] * len(rows_to_insert))
            if errors:
                raise CustomException(f"Errors occurred while inserting rows into main table: {errors}")

            # Insert data into the recommendations table
            recommendations_errors = client.insert_rows_json(recommendations_table_id, recommendations_rows_to_insert, row_ids=[None] * len(recommendations_rows_to_insert))
            if recommendations_errors:
                raise CustomException(f"Errors occurred while inserting rows into recommendations table: {recommendations_errors}")

            return {"success": True, "message": "BigQuery tables updated successfully"}
        except Exception as ex:
            raise CustomException(ex)

    @classmethod
    def update_bigquery_from_favoritos(cls):
        try:
            db = get_connection()
            users_ref = db.collection('usuarios')
            users_docs = users_ref.stream()

            client = bigquery.Client(credentials=credentials, project=credentials.project_id)
            table_id = 'emprendo-1c101.emprendofirestore.favoritos'
            staging_table_id = f"{table_id}_staging"

            rows_to_insert = []

            for user_doc in users_docs:
                favoritos_ref = user_doc.reference.collection('favoritos')
                favoritos_docs = favoritos_ref.stream()

                for doc in favoritos_docs:
                    favorito_data = doc.to_dict()
                    fecha_favorito = favorito_data.get("fechaFavorito")

                    id_producto = favorito_data.get("idProducto")
                    if isinstance(id_producto, DocumentReference):
                        id_producto = id_producto.path.split('/')[-1]

                    row = {
                        "idFavorito": doc.id,
                        "idUsuario": user_doc.id,
                        "fechaFavorito": fecha_favorito.isoformat() if isinstance(fecha_favorito, datetime) else fecha_favorito,
                        "idProducto": id_producto
                    }
                    rows_to_insert.append(row)

            # Create the staging table
            schema = [
                bigquery.SchemaField("idFavorito", "STRING"),
                bigquery.SchemaField("idUsuario", "STRING"),
                bigquery.SchemaField("fechaFavorito", "TIMESTAMP"),
                bigquery.SchemaField("idProducto", "STRING")
            ]

            table = bigquery.Table(staging_table_id, schema=schema)
            client.create_table(table, exists_ok=True)

            # Verify the staging table exists
            table = client.get_table(staging_table_id)

            # Insert data into the staging table
            errors = client.insert_rows_json(staging_table_id, rows_to_insert, row_ids=[None] * len(rows_to_insert))
            if errors:
                raise CustomException(f"Errors occurred while inserting rows into staging table: {errors}")

            # Replace the main table with the staging table
            replace_query = f"""
            CREATE OR REPLACE TABLE `{table_id}` AS
            SELECT * FROM `{staging_table_id}`
            """
            query_job = client.query(replace_query)
            query_job.result()

            # Drop the staging table
            client.delete_table(staging_table_id, not_found_ok=True)

            return {"success": True, "message": "BigQuery table updated successfully"}
        except Exception as ex:
            raise CustomException(ex)

    @classmethod
    def update_bigquery_from_valoraciones(cls):
        try:
            db = get_connection()
            users_ref = db.collection('usuarios')
            users_docs = users_ref.stream()

            client = bigquery.Client(credentials=credentials, project=credentials.project_id)
            table_id = 'emprendo-1c101.emprendofirestore.valoraciones'
            staging_table_id = f"{table_id}_staging"

            rows_to_insert = []

            for user_doc in users_docs:
                valoraciones_ref = user_doc.reference.collection('valoraciones')
                valoraciones_docs = valoraciones_ref.stream()

                for doc in valoraciones_docs:
                    valoracion_data = doc.to_dict()
                    fecha_valoracion = valoracion_data.get("fechaValoracion")

                    id_emprendimiento = valoracion_data.get("idEmprendimiento")
                    if isinstance(id_emprendimiento, DocumentReference):
                        id_emprendimiento = id_emprendimiento.path.split('/')[-1]

                    row = {
                        "idValoracion": doc.id,
                        "idUsuario": user_doc.id,
                        "fechaValoracion": fecha_valoracion.isoformat() if isinstance(fecha_valoracion, datetime) else fecha_valoracion,
                        "idEmprendimiento": id_emprendimiento,
                        "valoracion": valoracion_data.get("valoracion")
                    }
                    rows_to_insert.append(row)

            # Create the staging table
            schema = [
                bigquery.SchemaField("idValoracion", "STRING"),
                bigquery.SchemaField("idUsuario", "STRING"),
                bigquery.SchemaField("fechaValoracion", "TIMESTAMP"),
                bigquery.SchemaField("idEmprendimiento", "STRING"),
                bigquery.SchemaField("valoracion", "INT64")
            ]

            table = bigquery.Table(staging_table_id, schema=schema)
            client.create_table(table, exists_ok=True)

            # Verify the staging table exists
            table = client.get_table(staging_table_id)

            # Insert data into the staging table
            errors = client.insert_rows_json(staging_table_id, rows_to_insert, row_ids=[None] * len(rows_to_insert))
            if errors:
                raise CustomException(f"Errors occurred while inserting rows into staging table: {errors}")

            # Replace the main table with the staging table
            replace_query = f"""
            CREATE OR REPLACE TABLE `{table_id}` AS
            SELECT * FROM `{staging_table_id}`
            """
            query_job = client.query(replace_query)
            query_job.result()

            # Drop the staging table
            client.delete_table(staging_table_id, not_found_ok=True)

            return {"success": True, "message": "BigQuery table updated successfully"}
        except Exception as ex:
            raise CustomException(ex)