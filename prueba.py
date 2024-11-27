import random

def generate_random_coordinates(lat_min, lat_max, lon_min, lon_max):
    lat = random.uniform(lat_min, lat_max)
    lon = random.uniform(lon_min, lon_max)
    return lat, lon


lat_min = -12.05722329317737
lat_max = -11.713198096611467
lon_min = -77.15149746791376
lon_max = -76.89881194784046


random_lat, random_lon = generate_random_coordinates(lat_min, lat_max, lon_min, lon_max)
print(f"Coordenadas aleatorias: ({random_lat}, {random_lon})")