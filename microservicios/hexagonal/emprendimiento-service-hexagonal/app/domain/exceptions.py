# class InvalidDescription(Exception):
#     def __init__(self):
#         super().__init__('The description must have less than 50 characters')

class InvalidRUC(Exception):
    def __init__(self):
        super().__init__('El RUC no es valido')

class InvalidCategoria(Exception):
    def __init__(self):
        super().__init__('La categoria no es valida')