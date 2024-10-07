import requests
from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate(r"\etc\secrets\loyalfilsm-firebase-adminsdk-c3vxb-294f23391f.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'secreta'
app.config['WTF_CSRF_ENABLED'] = False


api_key = 'eec91e51c2cbe9fd8e941f3bbc0fd811'

@app.route('/prueba')
def prueba():
    
    
    url = "https://api.themoviedb.org/3/movie/343611?api_key=eec91e51c2cbe9fd8e941f3bbc0fd811"
    

    try:
        response = requests.get(url)
        response.raise_for_status()
        movie_data = response.json()
        return jsonify(movie_data)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Error fetching movie: {e}'}), 500


if __name__ == '_main_':
    app.run(debug=True)



#   apiKey: "AIzaSyAneR4gmqKRbrtvSDHDew_8Hge_LwOVBMo",
#   authDomain: "loyalfilsm.firebaseapp.com",
#   projectId: "loyalfilsm",
#   storageBucket: "loyalfilsm.appspot.com",
#   messagingSenderId: "83024199519",
#   appId: "1:83024199519:web:c15856394cc0484e1280ea",
#   measurementId: "G-WRWN8947W8"