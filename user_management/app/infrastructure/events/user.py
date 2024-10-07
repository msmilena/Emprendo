from app.domain.entities.user import UserEntity
from app.domain.events.user import UserCreatedEvent


class UserCreatedQueueEvent(UserCreatedEvent):

    def send(self, user: UserEntity):
        # TODO: Your code here
        return True