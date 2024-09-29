from copy import copy
from typing import List
from app.domain.entities.product import ProductEntityFactory, ProductEntity
from app.domain.repositories.product import ProductRepository


class ProductInMemoryRepository(ProductRepository):

    products: List[dict] = [
            {'id': '3f996431-e90e-4d12-b2be-5614959c0202', 'name': 'Leche', 'description': 'Leche desnatada de vaca', 'price': 1.20, 'stock': 50, 'image': 'leche.jpg'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0201', 'name': 'Carne', 'description': 'Filete de ternera', 'price': 8.50, 'stock': 20, 'image': 'carne.jpg'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0203', 'name': 'Pan', 'description': 'Barra de pan recién horneada', 'price': 0.80, 'stock': 100, 'image': 'pan.jpg'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0204', 'name': 'Queso', 'description': 'Queso manchego curado', 'price': 12.30, 'stock': 30, 'image': 'queso.jpg'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0205', 'name': 'Tomates', 'description': 'Tomates maduros de la huerta', 'price': 2.40, 'stock': 80, 'image': 'tomates.jpg'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0206', 'name': 'Aceite de oliva', 'description': 'Aceite de oliva virgen extra', 'price': 5.60, 'stock': 40, 'image': 'aceite.jpg'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0207', 'name': 'Huevos', 'description': 'Huevos frescos de gallinas camperas', 'price': 2.80, 'stock': 60, 'image': 'huevos.jpg'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0208', 'name': 'Patatas', 'description': 'Patatas nuevas para cocinar', 'price': 1.50, 'stock': 100, 'image': 'patatas.jpg'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0209', 'name': 'Arroz', 'description': 'Arroz redondo para paella', 'price': 2.20, 'stock': 70, 'image': 'arroz.jpg'},
            {'id': '3f996431-e90e-4d12-b2be-5614959c0210', 'name': 'Jamón', 'description': 'Jamón ibérico de bellota', 'price': 95.00, 'stock': 10, 'image': 'jamon.jpg'}
    ]

    def get_all(self) -> List[ProductEntity]:
        return [ProductEntityFactory.create(**product) for product in self.products]

    def get_by_id(self, id: str) -> ProductEntity|None:
        try:
            product = next(filter(lambda p: p['id'] == id, self.products))
            return ProductEntityFactory.create(**product)
        except StopIteration:
            return None

    def add(self, product: ProductEntity) -> ProductEntity:
        self.products.append(copy(product.__dict__))
        return product

    def update(self, product: ProductEntity) -> ProductEntity:
        for key, value in enumerate(self.products):
            if value['id'] == product.id:
                self.products[key] = copy(product.__dict__)
        return product
