from abc import ABC, abstractmethod

from dtos.state_dto import StateDTO

class IBackendProvider(ABC):
    base_url: str = None
    car_id: int = 0
    
    state: StateDTO = StateDTO()

    def __init__(self, base_url, car_id):
        self.base_url = base_url
        self.car_id = car_id

        print(f"Starting provider. BASE_URL : {base_url}, CAR_ID : {car_id}")

    @abstractmethod
    def refresh_data(self):
        pass

    @property
    def active_route_seconds_to_arrival(self) -> float:
        return self.active_route_minutes_to_arrival * 60