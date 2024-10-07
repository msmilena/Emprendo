class InvalidEmail(Exception):
    def __init__(self):
        super().__init__('The email is not valid')
