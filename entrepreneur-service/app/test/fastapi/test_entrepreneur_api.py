import pytest
from app.infrastructure.fast_api import create_app
from fastapi.testclient import TestClient
from app.test import create_mock_entrepreneur_repository, expected_entrepreneurs_catalog, expected_entrepreneur_description


class TestUserApi:

    @pytest.fixture(autouse=True)
    def setup(self):
        self.app = create_app()
        self.client = TestClient(self.app)
        self.base_path = '/entrepreneurs'

    def test_get_entrepreneur_catalog(self):
        with self.app.container.entrepreneur_repository.override(create_mock_entrepreneur_repository()):
            response = self.client.get(self.base_path + '/')
            assert expected_entrepreneurs_catalog == response.json()
            assert response.status_code == 200

    def test_get_entrepreneur_detail(self):
        with self.app.container.entrepreneur_repository.override(create_mock_entrepreneur_repository()):
            response = self.client.get(self.base_path + '/mock_id')
            assert expected_entrepreneur_description == response.json()
            assert response.status_code == 200

    def test_post_register_entrepreneur(self):
        with self.app.container.entrepreneur_repository.override(create_mock_entrepreneur_repository()):
            response = self.client.post(
                self.base_path,
                json=expected_entrepreneur_description
            )
            assert expected_entrepreneur_description == response.json()
            assert response.status_code == 200

    def test_put_update_entrepreneur(self):
        with self.app.container.entrepreneur_repository.override(create_mock_entrepreneur_repository()):
            response = self.client.put(
                self.base_path + '/mock_id',
                json=expected_entrepreneur_description
            )
            assert expected_entrepreneur_description == response.json()
            assert response.status_code == 200