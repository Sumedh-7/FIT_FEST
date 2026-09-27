"""
EcoCollect Backend - Full Endpoint Verification Script
Tests every single API endpoint and proves the backend is connected and working.
"""
import sys, os, time, subprocess, requests, json

# Fix Windows encoding
os.environ["PYTHONIOENCODING"] = "utf-8"

def main():
    print("=" * 70)
    print("  EcoCollect Backend - Full API Endpoint Test Suite")
    print("  Testing all 7 endpoints across 9 feature routes")
    print("=" * 70)

    # Start the server
    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.dirname(__file__)
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--port", "8009", "--host", "127.0.0.1"],
        cwd=os.path.dirname(__file__),
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    base = "http://127.0.0.1:8009"
    passed = 0
    failed = 0

    def check(label, condition, detail=""):
        nonlocal passed, failed
        if condition:
            passed += 1
            print(f"  [PASS] {label}")
        else:
            failed += 1
            print(f"  [FAIL] {label} | {detail}")

    try:
        # Wait for server
        ready = False
        for _ in range(15):
            try:
                r = requests.get(f"{base}/api/health", timeout=1)
                if r.status_code == 200:
                    ready = True
                    break
            except Exception:
                time.sleep(1)

        if not ready:
            print("[FAIL] Server did not start. Aborting.")
            return

        # -------------------------------------------------
        # 1. GET /api/health  -  System Health Check
        # -------------------------------------------------
        print("\n-- 1. GET /api/health - System Health Check --")
        r = requests.get(f"{base}/api/health")
        data = r.json()
        check("Status code 200", r.status_code == 200)
        check("Response has 'status: ok'", data.get("status") == "ok")
        check("Pune jurisdiction tag present", "Pune" in data.get("jurisdiction", ""))

        # -------------------------------------------------
        # 2. GET /api/categories  -  Waste Category Selection
        # -------------------------------------------------
        print("\n-- 2. GET /api/categories - Waste Category Selection --")
        r = requests.get(f"{base}/api/categories")
        cats = r.json()
        check("Status code 200", r.status_code == 200)
        check("Returns 5 categories", len(cats) == 5)
        cat_names = [c["name"] for c in cats]
        for expected in ["Organic Waste", "Recyclable Waste", "General Waste", "E-Waste", "Hazardous Waste"]:
            check(f"Category '{expected}' present", expected in cat_names)
        check("Each category has 'guide' field", all("guide" in c for c in cats))
        check("Each category has 'examples' list", all(isinstance(c.get("examples"), list) for c in cats))

        # -------------------------------------------------
        # 3. POST /api/requests  -  Pickup Request + Scheduling + Location
        # -------------------------------------------------
        print("\n-- 3. POST /api/requests - Pickup Request + Scheduling + Location --")
        payload = {
            "name": "Sneha Deshpande",
            "phone": "+91 99220 88776",
            "category": "Organic Waste",
            "address": "Flat 12, Sahyadri Colony, Paud Road, Kothrud, Pune - 411038",
            "pickup_date": "2026-10-05",
            "pickup_time": "09:00 AM - 12:00 PM",
            "description": "Garden waste and vegetable peels"
        }
        r = requests.post(f"{base}/api/requests", json=payload)
        created = r.json()
        check("Status code 201 Created", r.status_code == 201)
        check("Returns request_id starting with EC-", created.get("request_id", "").startswith("EC-"))
        check("Status defaults to 'Pending'", created.get("status") == "Pending")
        check("Name stored correctly", created.get("name") == "Sneha Deshpande")
        check("Phone stored correctly", created.get("phone") == "+91 99220 88776")
        check("Category stored correctly", created.get("category") == "Organic Waste")
        check("Pune address stored", "Kothrud, Pune" in created.get("address", ""))
        check("Pickup date stored", created.get("pickup_date") == "2026-10-05")
        check("Pickup time stored", created.get("pickup_time") == "09:00 AM - 12:00 PM")
        check("Description stored", "Garden waste" in created.get("description", ""))
        check("created_at timestamp present", created.get("created_at") is not None)
        new_id = created.get("request_id")

        # Validate rejection of invalid category
        bad_payload = {**payload, "category": "Nuclear Waste"}
        r_bad = requests.post(f"{base}/api/requests", json=bad_payload)
        check("Rejects invalid category (400)", r_bad.status_code == 400)

        # -------------------------------------------------
        # 4. GET /api/requests/{id}  -  Request Status Lookup
        # -------------------------------------------------
        print(f"\n-- 4. GET /api/requests/{new_id} - Request Status Lookup --")
        r = requests.get(f"{base}/api/requests/{new_id}")
        fetched = r.json()
        check("Status code 200", r.status_code == 200)
        check("Correct request returned", fetched.get("request_id") == new_id)
        check("Name matches", fetched.get("name") == "Sneha Deshpande")

        # Non-existent ID
        r_404 = requests.get(f"{base}/api/requests/EC-9999")
        check("Returns 404 for non-existent ID", r_404.status_code == 404)

        # -------------------------------------------------
        # 5. PATCH /api/requests/{id}/status  -  Admin Status Workflow
        # -------------------------------------------------
        print(f"\n-- 5. PATCH /api/requests/{new_id}/status - Admin Status Workflow --")

        # Pending -> Assigned
        r = requests.patch(f"{base}/api/requests/{new_id}/status", json={"status": "Assigned"})
        check("Pending -> Assigned (200)", r.status_code == 200 and r.json().get("status") == "Assigned")

        # Assigned -> Collected
        r = requests.patch(f"{base}/api/requests/{new_id}/status", json={"status": "Collected"})
        check("Assigned -> Collected (200)", r.status_code == 200 and r.json().get("status") == "Collected")

        # Test Cancelled
        r = requests.patch(f"{base}/api/requests/{new_id}/status", json={"status": "Cancelled"})
        check("Can set Cancelled (200)", r.status_code == 200 and r.json().get("status") == "Cancelled")

        # Back to Pending
        requests.patch(f"{base}/api/requests/{new_id}/status", json={"status": "Pending"})

        # Invalid status
        r_bad = requests.patch(f"{base}/api/requests/{new_id}/status", json={"status": "Exploded"})
        check("Rejects invalid status (400)", r_bad.status_code == 400)

        # -------------------------------------------------
        # 6. GET /api/requests  -  Admin Dashboard + Search & Filter + History
        # -------------------------------------------------
        print("\n-- 6. GET /api/requests - Admin Dashboard + Search & Filtering + Pickup History --")

        # Unfiltered
        r = requests.get(f"{base}/api/requests")
        all_reqs = r.json()
        check("Status code 200", r.status_code == 200)
        check("Returns list of requests", isinstance(all_reqs, list) and len(all_reqs) > 0)

        # Filter by category
        r = requests.get(f"{base}/api/requests", params={"category": "E-Waste"})
        filtered = r.json()
        check("Category filter works", all(req["category"] == "E-Waste" for req in filtered))

        # Filter by status
        r = requests.get(f"{base}/api/requests", params={"status": "Pending"})
        filtered = r.json()
        check("Status filter works", all(req["status"] == "Pending" for req in filtered))

        # Search by name
        r = requests.get(f"{base}/api/requests", params={"search": "Sneha"})
        filtered = r.json()
        check("Search by citizen name works", any(req["name"] == "Sneha Deshpande" for req in filtered))

        # Search by request ID
        r = requests.get(f"{base}/api/requests", params={"search": new_id})
        filtered = r.json()
        check("Search by request ID works", any(req["request_id"] == new_id for req in filtered))

        # Combined filter
        r = requests.get(f"{base}/api/requests", params={"category": "Organic Waste", "status": "Pending"})
        filtered = r.json()
        check("Combined category + status filter works",
              all(req["category"] == "Organic Waste" and req["status"] == "Pending" for req in filtered))

        # -------------------------------------------------
        # 7. GET /api/stats  -  Collection Statistics
        # -------------------------------------------------
        print("\n-- 7. GET /api/stats - Collection Statistics --")
        r = requests.get(f"{base}/api/stats")
        stats = r.json()
        check("Status code 200", r.status_code == 200)
        check("total_requests field present", "total_requests" in stats)
        check("pending count present", "pending" in stats)
        check("assigned count present", "assigned" in stats)
        check("collected count present", "collected" in stats)
        check("cancelled count present", "cancelled" in stats)
        check("category_breakdown is a list", isinstance(stats.get("category_breakdown"), list))
        check("All 5 categories in breakdown", len(stats["category_breakdown"]) == 5)
        check("Counts are non-negative integers", all(isinstance(c["count"], int) and c["count"] >= 0 for c in stats["category_breakdown"]))

        # Verify total = sum of statuses
        total = stats["total_requests"]
        status_sum = stats["pending"] + stats["assigned"] + stats["collected"] + stats["cancelled"]
        check(f"Total ({total}) = sum of statuses ({status_sum})", total == status_sum)

        # -------------------------------------------------
        # 8. Frontend static serving (production build)
        # -------------------------------------------------
        print("\n-- 8. Static Frontend Serving --")
        r = requests.get(f"{base}/")
        check("Frontend index.html served (200)", r.status_code == 200)
        check("Contains React root <div>", '<div id="root"></div>' in r.text)

        # -------------------------------------------------
        # SUMMARY
        # -------------------------------------------------
        print("\n" + "=" * 70)
        print(f"  RESULTS:  {passed} passed  /  {failed} failed  /  {passed + failed} total")
        if failed == 0:
            print("  ALL TESTS PASSED - BACKEND IS FULLY OPERATIONAL")
        else:
            print(f"  WARNING: {failed} test(s) FAILED - review output above")
        print("=" * 70)

    finally:
        proc.terminate()
        proc.wait()

if __name__ == "__main__":
    main()
