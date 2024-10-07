from copy import copy
from typing import List
from app.domain.entities.user import UserEntityFactory, UserEntity
from app.domain.repositories.user import UserRepository


class UserInMemoryRepository(UserRepository):

    users: List[dict] = [
            {'id': '3f996431-e90e-4d12-b2be-5614959c0202', 'name': 'Sebastian Diaz', 'lastName': '','email': 'sebas@gmail.com', 'password': 'qwerty', 'tipo': 'cliente'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0201', 'name': 'Gabriela Romero', 'lastName': '','email': 'gabi@gmail.com', 'password': '123123', 'tipo': 'cliente'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0203', 'name': 'Jose Palomino', 'lastName': '','email': 'jose@gmail.com', 'password': 'mnbmnb', 'tipo': 'cliente'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0204', 'name': 'Alex Castro', 'lastName': '','email': 'alex@gmail.com', 'password': 'ffjjfjfj', 'tipo': 'cliente'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0205', 'name': 'Romy Soldevilla', 'lastName': '','email': 'romy@gmail.com', 'password': 'test4', 'tipo': 'cliente'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0206', 'name': 'Yashmin Solano', 'lastName': '','email': 'yashmin@gmail.com', 'password': 'dfgrrr', 'tipo': 'cliente'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0207', 'name': 'Elvia Mantilla', 'lastName': '','email': 'elvia@gmail.com', 'password': '1470147', 'tipo': 'emprendedor'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0208', 'name': 'Sara Villegas', 'lastName': '','email': 'sara@gmail.com', 'password': '666', 'tipo': 'emprendedor'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0209', 'name': 'Raul Rojas', 'lastName': '','email': 'raul@gmail.com', 'password': 'root', 'tipo': 'emprendedor'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0210', 'name': 'Renato Silva', 'lastName': '','email': 'renato@gmail.com', 'password': 'y6y6y6y6y6', 'tipo': 'emprendedor'}
    ]

    def add(self, user: UserEntity) -> UserEntity:
        self.users.append(copy(user.__dict__))
        return user

    def get_by_id(self, id: str) -> UserEntity|None:
        try:
            user = next(filter(lambda p: p['id'] == id, self.users))
            return UserEntityFactory.create(**user)
        except StopIteration:
            return None

    def get_by_email(self, email: str) -> UserEntity|None:
        try:
            user = next(filter(lambda p: p['email'] == email, self.users))
            return UserEntityFactory.create(**user)
        except StopIteration:
            return None

