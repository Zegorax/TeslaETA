from interfaces.backendinterface import IBackendProvider
import requests

class TeslaloggerBackendProvider(IBackendProvider):
    def refresh_data(self):
        data = requests.get(f"{self.base_url}/currentjson/{self.car_id}/").json()

        self.state.latitude = data["latitude"]
        self.state.longitude = data["longitude"]
        self.state.odometer = data["odometer"]
        self.state.is_driving = data["driving"]
        self.state.is_charging  = data["charging"]
        self.state.battery_level = data["battery_level"]

        self.state.active_route_latitude = data["active_route_latitude"]
        self.state.active_route_longitude = data["active_route_longitude"]

        self.state.active_route_destination = data["active_route_destination"]
        self.state.active_route_minutes_to_arrival = data["active_route_minutes_to_arrival"]
        self.state.active_route_energy_at_arrival = data["active_route_energy_at_arrival"]