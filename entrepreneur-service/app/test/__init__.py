from unittest.mock import Mock, patch
from app.domain.entities.entrepreneur import EntrepreneurEntityFactory
from app.domain.repositories.entrepreneur import EntrepreneurRepository
from app.test.data.entrepreneur import expected_entrepreneurs_catalog, expected_entrepreneur_description


entrepreneur_data = {'id': 'MockID', 'name': 'MockEntrepreneur', 'description': 'MockDescription', 'price': 10, 'stock': 1, 'image': 'MockImage.jpg'}
entrepreneur_repository_get_all = [entrepreneur_data for x in range(2)]
entrepreneur_repository_get_by_id = entrepreneur_data

@patch('app.infrastructure.repositories.entrepreneur.EntrepreneurInMemoryRepository', spec=True)
def create_mock_entrepreneur_repository(mock_repository: Mock):
    mock_entrepreneur_repo: EntrepreneurRepository = mock_repository.return_value
    mock_entrepreneur_repo.get_all = Mock(return_value=[EntrepreneurEntityFactory.create(**entrepreneur) for entrepreneur in entrepreneur_repository_get_all])
    mock_entrepreneur_repo.get_by_id = Mock(return_value=EntrepreneurEntityFactory.create(**entrepreneur_repository_get_by_id))
    mock_entrepreneur_repo.add = Mock(return_value=EntrepreneurEntityFactory.create(**entrepreneur_repository_get_by_id))
    mock_entrepreneur_repo.update = Mock(return_value=EntrepreneurEntityFactory.create(**entrepreneur_repository_get_by_id))
    return mock_entrepreneur_repo
