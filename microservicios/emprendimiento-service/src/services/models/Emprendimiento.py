class Emprendimiento:
    def __init__(self, idEmprendedor, nombreComercial, localizacion, ruc, image_url=None):
        self.idEmprendedor = idEmprendedor
        self.nombreComercial = nombreComercial
        self.localizacion = localizacion
        self.ruc = ruc
        self.image_url = image_url

    def to_dict(self):
        return {
            'idEmprendedor': self.idEmprendedor,
            'nombreComercial': self.nombreComercial,
            'localizacion': self.localizacion,
            'ruc': self.ruc,
            'image_url': self.image_url
        }