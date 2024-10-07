from app.domain.exceptions import InvalidCategoria, InvalidRUC


class EmprendimientoValidator:

    @staticmethod
    def validate_ruc(ruc: str) -> None:
        if len(ruc) != 11:
            raise InvalidRUC