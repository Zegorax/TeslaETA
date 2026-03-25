#!/usr/bin/env python3
"""
Simulate car movement by publishing fake location data to MQTT.
Usage: python3 dev/simulate_location.py [--host localhost] [--port 1883] [--car-id 1] [--interval 2]
"""

import argparse
import json
import math
import time

import paho.mqtt.publish as publish

# Fixed destination: Berlin Hauptbahnhof
DESTINATION_NAME = "Berlin Hauptbahnhof"
DESTINATION_LAT  = 52.5251
DESTINATION_LNG  = 13.3694


def build_route():
    """Generate a circular route in Berlin (Alexanderplatz area)."""
    center_lat = 52.5219
    center_lng = 13.4132
    radius_deg = 0.003  # ~300m radius
    steps = 36  # 10° per step → full circle

    waypoints = []
    for i in range(steps + 1):
        angle_rad = math.radians(i * (360 / steps))
        lat = center_lat + radius_deg * math.cos(angle_rad)
        lng = center_lng + radius_deg * math.sin(angle_rad)
        # Heading: tangent to the circle (perpendicular to radius, clockwise)
        heading = (i * (360 / steps) + 90) % 360
        waypoints.append((lat, lng, heading))
    return waypoints


def publish_state(host, port, car_id, lat, lng, heading, speed=40, battery=80):
    # Estimate a rough minutes_to_arrival based on straight-line distance at ~40 km/h
    dist_deg = math.hypot(lat - DESTINATION_LAT, lng - DESTINATION_LNG)
    dist_km = dist_deg * 111  # 1° ≈ 111 km
    minutes_to_arrival = round((dist_km / 40) * 60, 1)

    msgs = [
        {"topic": f"teslamate/cars/{car_id}/location",
         "payload": json.dumps({"latitude": lat, "longitude": lng}), "qos": 0},
        {"topic": f"teslamate/cars/{car_id}/heading",
         "payload": str(round(heading, 1)), "qos": 0},
        {"topic": f"teslamate/cars/{car_id}/shift_state",
         "payload": "D", "qos": 0},
        {"topic": f"teslamate/cars/{car_id}/speed",
         "payload": str(speed), "qos": 0},
        {"topic": f"teslamate/cars/{car_id}/battery_level",
         "payload": str(battery), "qos": 0},
        {"topic": f"teslamate/cars/{car_id}/active_route",
         "payload": json.dumps({
             "destination": DESTINATION_NAME,
             "location": {"latitude": DESTINATION_LAT, "longitude": DESTINATION_LNG},
             "minutes_to_arrival": minutes_to_arrival,
             "energy_at_arrival": max(battery - 5, 0),
         }), "qos": 0},
    ]
    publish.multiple(msgs, hostname=host, port=port)


def main():
    parser = argparse.ArgumentParser(description="Simulate Tesla location via MQTT")
    parser.add_argument("--host", default="localhost", help="MQTT broker host (default: localhost)")
    parser.add_argument("--port", type=int, default=1883, help="MQTT broker port (default: 1883)")
    parser.add_argument("--car-id", type=int, default=1, help="TeslaMate car ID (default: 1)")
    parser.add_argument("--interval", type=float, default=2.0, help="Seconds between updates (default: 2)")
    parser.add_argument("--loops", type=int, default=3, help="Number of full laps (default: 3, 0 = infinite)")
    args = parser.parse_args()

    route = build_route()
    total_steps = len(route) * args.loops if args.loops > 0 else float("inf")
    step = 0

    print(f"Publishing to {args.host}:{args.port} | car_id={args.car_id} | interval={args.interval}s")
    print(f"Route: {len(route)} waypoints/lap | {'infinite' if args.loops == 0 else f'{args.loops} lap(s)'}")
    print(f"Destination: {DESTINATION_NAME} ({DESTINATION_LAT}, {DESTINATION_LNG})")
    print("Press Ctrl+C to stop\n")

    try:
        while step < total_steps:
            wp = route[step % len(route)]
            lat, lng, heading = wp
            publish_state(args.host, args.port, args.car_id, lat, lng, heading)
            print(f"  Step {step + 1:>4}  lat={lat:.6f}  lng={lng:.6f}  heading={heading:>6.1f}°")
            step += 1
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
