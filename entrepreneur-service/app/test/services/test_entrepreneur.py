import pytest
from app.application.services.entrepreneur import EntrepreneurService
from app.domain.entities.entrepreneur import EntrepreneurEntity, EntrepreneurEntityFactory
from app.infrastructure.container import Container
from app.test import create_mock_entrepreneur_repository
from app.test.data.entrepreneur import expected_entrepreneur_description


class TestEntrepreneurService:

    """
    this fixture fulfills the function of dependency injection for all tests
    """
    @pytest.fixture(autouse=True)
    def injector(self):
        container = Container()
        with container.entrepreneur_repository.override(create_mock_entrepreneur_repository()):
            self.entrepreneur_service: EntrepreneurService = container.entrepreneur_services()
            self.entrepreneur_factory: EntrepreneurEntityFactory = container.entrepreneur_factory()

    def test_that_all_entrepreneurs_in_the_catalog_are_an_entity(self):
        catalog = self.entrepreneur_service.entrepreneurs_catalog()
        for entrepreneur in catalog:
            assert type(entrepreneur) is EntrepreneurEntity

    def test_that_entrepreneur_detail_is_an_entity(self):
        entrepreneur = self.entrepreneur_service.entrepreneur_detail('mock_id')
        assert type(entrepreneur) is EntrepreneurEntity

    def test_entrepreneur_name_is_correct(self):
        entrepreneur = self.entrepreneur_service.entrepreneur_detail('mock_id')
        assert entrepreneur.name == expected_entrepreneur_description['name']

    def test_register_entrepreneur(self):
        uid, name, description, price, stock, image = expected_entrepreneur_description.values()
        entrepreneur_entity = self.entrepreneur_factory.create(None, name, description, float(price), int(stock), image)
        entrepreneur = self.entrepreneur_service.register_entrepreneur(entrepreneur_entity)
        assert type(entrepreneur) is EntrepreneurEntity
        assert entrepreneur.id == uid

    def test_update_entrepreneur(self):
        uid, name, description, price, stock, image = expected_entrepreneur_description.values()
        entrepreneur_entity = self.entrepreneur_factory.create(uid, name, description, price, stock, image)
        entrepreneur = self.entrepreneur_service.update_entrepreneur(entrepreneur_entity)
        assert type(entrepreneur) is EntrepreneurEntity
