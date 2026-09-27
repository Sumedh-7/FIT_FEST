import sys
import os
import time
import subprocess
import requests

def test_full_server():
    print("Launching FastAPI server for verification...")
    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.dirname(__file__)
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8008", "--host", "127.0.0.1"],
        cwd=os.path.dirname(__file__),
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    try:
        base_url = "http://127.0.0.1:8008"
        # Poll health until ready
        connected = False
        for attempt in range(10):
            try:
                res = requests.get(f"{base_url}/api/health", timeout=1)
                if res.status_code == 200:
                    connected = True
                    break
            except Exception:
                time.sleep(1)

        assert connected, "Server failed to start in 10 seconds"
        print("Health Check Status: 200 OK")
        
        # 2. Frontend static serving
        res_fe = requests.get(f"{base_url}/")
        print(f"Frontend Static Index HTML Status: {res_fe.status_code}")
        assert res_fe.status_code == 200
        assert "<div id=\"root\"></div>" in res_fe.text
        
        # 3. Create request API with Pune details
        payload = {
            "name": "Ananya Iyer",
            "phone": "+91 98220 55443",
            "category": "E-Waste",
            "address": "Flat 301, IT Park Road, Aundh, Pune - 411007",
            "pickup_date": "2026-10-10",
            "pickup_time": "09:00 AM - 12:00 PM",
            "description": "Old smartphone and broken router"
        }
        res_post = requests.post(f"{base_url}/api/requests", json=payload)
        print(f"Create Request Status: {res_post.status_code}, ID: {res_post.json().get('request_id')}")
        assert res_post.status_code == 201
        req_code = res_post.json().get('request_id')
        
        # 4. Fetch created request by code
        res_get = requests.get(f"{base_url}/api/requests/{req_code}")
        assert res_get.status_code == 200
        assert res_get.json()['name'] == "Ananya Iyer"
        
        # 5. Patch status to Collected
        res_patch = requests.patch(f"{base_url}/api/requests/{req_code}/status", json={"status": "Collected"})
        assert res_patch.status_code == 200
        assert res_patch.json()['status'] == "Collected"
        
        # 6. Fetch Stats
        res_stats = requests.get(f"{base_url}/api/stats")
        print(f"Stats Endpoint Status: {res_stats.status_code}, Total Requests: {res_stats.json()['total_requests']}")
        assert res_stats.status_code == 200
        
        print("\nSUCCESS: All E2E server checks passed cleanly!")
    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    test_full_server()
