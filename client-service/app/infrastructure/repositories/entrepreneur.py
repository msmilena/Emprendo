from copy import copy
from typing import List
from app.domain.entities.entrepreneur import EntrepreneurEntityFactory, EntrepreneurEntity
from app.domain.repositories.entrepreneur import EntrepreneurRepository


class EntrepreneurInMemoryRepository(EntrepreneurRepository):

    entrepreneurs: List[dict] = [
        {'id': '3f996431-e90e-4d12-b2be-5614959c0202', 'name': 'milk', 'description': 'skimmed cows milk', 'price': 10.50, 'stock': 1, 'image': 'milk.jpg'},
        {'id': '3f996431-e90e-4d12-b2be-5614959c0201', 'name': 'meat', 'description': 'beef licence', 'price': 20.50, 'stock': 2, 'image': 'meat.jpg'}
    ]

    def get_all(self) -> List[EntrepreneurEntity]:
        return [EntrepreneurEntityFactory.create(**entrepreneur) for entrepreneur in self.entrepreneurs]

    def get_by_id(self, id: str) -> EntrepreneurEntity|None:
        try:
            entrepreneur = next(filter(lambda p: p['id'] == id, self.entrepreneurs))
            return EntrepreneurEntityFactory.create(**entrepreneur)
        except StopIteration:
            return None

    def add(self, entrepreneur: EntrepreneurEntity) -> EntrepreneurEntity:
        self.entrepreneurs.append(copy(entrepreneur.__dict__))
        return entrepreneur

    def update(self, entrepreneur: EntrepreneurEntity) -> EntrepreneurEntity:
        for key, value in enumerate(self.entrepreneurs):
            if value['id'] == entrepreneur.id:
                self.entrepreneurs[key] = copy(entrepreneur.__dict__)
        return entrepreneur
