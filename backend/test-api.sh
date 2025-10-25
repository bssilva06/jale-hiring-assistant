#!/bin/bash

# Jale Backend API Testing Script
# This script tests all the endpoints to verify everything works

BASE_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Jale Backend API Test Suite"
echo "================================"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -n "Testing: $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $http_code)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Status: $http_code)"
        echo "Response: $body"
        return 1
    fi
}

# Check if server is running
echo "Checking if server is running..."
if ! curl -s "$BASE_URL/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Server is not running!${NC}"
    echo ""
    echo "Please start the server first:"
    echo "  cd backend && npm run dev"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Test 1: Health Check
echo "=== Health Check ==="
test_endpoint "GET" "/health" "Health endpoint"
echo ""

# Test 2: Jobs API
echo "=== Jobs API ==="
test_endpoint "POST" "/api/jobs" "Create job" '{
  "title": "Test Warehouse Worker",
  "company": "Test Company",
  "location": "Dallas, TX",
  "pay": 18.50,
  "schedule": "Monday-Friday, 8am-5pm",
  "requirements": ["Forklift certified", "2+ years experience"],
  "description": "Test job posting",
  "language": "en"
}'

test_endpoint "GET" "/api/jobs" "Get all jobs"
test_endpoint "GET" "/api/jobs?status=active" "Get active jobs"
echo ""

# Test 3: Candidates API
echo "=== Candidates API ==="
echo -e "${YELLOW}Note: This will fail without a valid job_id${NC}"
echo "To test properly, replace 'test-job-id' with an actual UUID from the jobs table"
test_endpoint "POST" "/api/candidates" "Submit application" '{
  "job_id": "test-job-id",
  "name": "Test Candidate",
  "email": "test@example.com",
  "phone": "555-1234",
  "skills": ["Forklift", "Inventory"],
  "experience_years": 3,
  "certifications": ["Forklift certified"],
  "language_preference": "en"
}'

test_endpoint "GET" "/api/candidates" "Get all candidates"
echo ""

# Test 4: Chat API
echo "=== Chat API ==="
echo -e "${YELLOW}Note: This requires valid job_id and will call Claude AI${NC}"
test_endpoint "POST" "/api/chat" "Send chat message" '{
  "job_id": "test-job-id",
  "message": "What is the pay for this position?",
  "language": "en"
}'
echo ""

# Test 5: Interviews API
echo "=== Interviews API ==="
test_endpoint "GET" "/api/interviews" "Get all interviews"
test_endpoint "GET" "/api/interviews?status=scheduled" "Get scheduled interviews"
echo ""

# Summary
echo ""
echo "================================"
echo "✅ Basic API tests complete!"
echo ""
echo "💡 Next Steps:"
echo "   1. Check the output above for any failures"
echo "   2. Create real test data using the manual tests below"
echo "   3. Test the AI features (matching, chat)"
echo ""
