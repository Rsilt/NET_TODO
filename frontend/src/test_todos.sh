#!/bin/bash

BASE_URL="http://localhost:5261/api/todos"

echo "=== 1. Get all todos ==="
curl -s $BASE_URL | jq .
echo

echo "=== 2. Create a new todo ==="
curl -s -X POST $BASE_URL \
-H "Content-Type: application/json" \
-d '{"description":"Auto-Test Task","dueDate":"2025-08-30T12:00:00","isDone":false}' | jq .
echo

echo "=== 3. Update todo with id=3 (Call Alice to completed) ==="
curl -s -X PUT "$BASE_URL/3" \
-H "Content-Type: application/json" \
-d '{"description":"Call Alice","dueDate":"2026-03-05T00:00:00","isDone":true}' | jq .
echo

echo "=== 4. Delete todo with id=4 (New Task) ==="
curl -s -X DELETE "$BASE_URL/4" -w "HTTP Status: %{http_code}\n"
echo

echo "=== 5. Filter by done=false ==="
curl -s "$BASE_URL?done=false" | jq .
echo

echo "=== 6. Filter by dueDate=2025-08-22 ==="
curl -s "$BASE_URL?dueDate=2025-08-22" | jq .
echo

echo "=== 7. Filter by search='Buy' ==="
curl -s "$BASE_URL?search=Buy" | jq .
echo

echo "=== 8. Multiple filters (done=false, dueDate=2025-08-22, search='Buy') ==="
curl -s "$BASE_URL?done=false&dueDate=2025-08-22&search=Buy" | jq .
echo
