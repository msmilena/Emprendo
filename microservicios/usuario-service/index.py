from config import config
from src import init_app
from flask_cors import CORS, cross_origin

configuration = config['development']
app = init_app(configuration)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)