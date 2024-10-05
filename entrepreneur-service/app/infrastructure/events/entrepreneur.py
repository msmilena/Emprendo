from app.domain.entities.entrepreneur import EntrepreneurEntity
from app.domain.events.entrepreneur import EntrepreneurCreatedEvent, EntrepreneurUpdatedEvent


class EntrepreneurCreatedQueueEvent(EntrepreneurCreatedEvent):

    def send(self, entrepreneur: EntrepreneurEntity):
        # TODO: Your code here
        return True

class EntrepreneurUpdatedQueueEvent(EntrepreneurUpdatedEvent):

    def send(self, entrepreneur: EntrepreneurEntity):
        # TODO: Your code here
        return True
