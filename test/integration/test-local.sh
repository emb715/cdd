#!/bin/bash
#
# CDD Local Testing Script
# Tests CLI functionality, RAG integration, and end-to-end workflows
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Get script directory and monorepo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CDD_BIN="$MONOREPO_ROOT/packages/cdd/bin/cdd.js"

# Helper functions
print_header() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

print_test() {
  echo -e "${YELLOW}🧪 Test $1: $2${NC}"
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
  ((TESTS_PASSED++))
}

print_failure() {
  echo -e "${RED}❌ $1${NC}"
  ((TESTS_FAILED++))
}

print_info() {
  echo -e "   $1"
}

run_test() {
  ((TESTS_RUN++))
}

# Create temporary test directory
TEST_DIR=$(mktemp -d -t cdd-test-XXXXXX)
trap "rm -rf $TEST_DIR" EXIT

print_header "CDD Local Testing Suite"
echo "📁 Test directory: $TEST_DIR"
echo "📦 Monorepo root: $MONOREPO_ROOT"
echo "🔧 CDD CLI: $CDD_BIN"
echo ""

# Navigate to test directory
cd "$TEST_DIR"

# Test 1: CDD Init
print_header "Test 1: CDD Init"
run_test
print_test "1.1" "Running 'cdd init'"

node "$CDD_BIN" init > /dev/null 2>&1

if [ -d "cdd/.meta" ]; then
  print_success "cdd/.meta/ directory created"
else
  print_failure "cdd/.meta/ directory NOT created"
fi

run_test
print_test "1.2" "Checking Claude commands"
if [ -f ".claude/commands/cdd:create-work.md" ]; then
  print_success "Claude commands created"
else
  print_failure "Claude commands NOT created"
fi

run_test
print_test "1.3" "Checking workspace structure"
if [ -d "cdd/.meta/templates" ] && [ -d "cdd/.meta/metrics" ]; then
  print_success "Workspace structure complete"
else
  print_failure "Workspace structure incomplete"
fi

echo ""

# Test 2: Add RAG Extension
print_header "Test 2: Add RAG Extension"
run_test
print_test "2.1" "Running 'cdd add rag'"

node "$CDD_BIN" add rag > /dev/null 2>&1

if [ -d "cdd/.rag" ]; then
  print_success "cdd/.rag/ directory created"
else
  print_failure "cdd/.rag/ directory NOT created"
fi

run_test
print_test "2.2" "Checking RAG command"
if [ -f ".claude/commands/cdd:query.md" ]; then
  print_success "cdd:query command added"
else
  print_failure "cdd:query command NOT added"
fi

run_test
print_test "2.3" "Checking RAG structure"
if [ -f "cdd/.rag/requirements.txt" ] && [ -d "cdd/.rag/core" ]; then
  print_success "RAG structure complete"
else
  print_failure "RAG structure incomplete"
fi

echo ""

# Test 3: Python Environment (Optional - skip if Python not available)
print_header "Test 3: Python Environment"

if command -v python3 &> /dev/null; then
  run_test
  print_test "3.1" "Creating Python virtual environment"

  cd cdd/.rag
  python3 -m venv venv > /dev/null 2>&1

  if [ -d "venv" ]; then
    print_success "Virtual environment created"
  else
    print_failure "Virtual environment creation failed"
  fi

  run_test
  print_test "3.2" "Installing Python dependencies"

  source venv/bin/activate
  pip install -q -r requirements.txt > /dev/null 2>&1

  if [ $? -eq 0 ]; then
    print_success "Python dependencies installed"
  else
    print_failure "Python dependencies installation failed"
  fi

  deactivate
  cd ../..
else
  print_info "⚠️  Python3 not found - skipping Python tests"
fi

echo ""

# Test 4: File Permissions
print_header "Test 4: File Permissions"
run_test
print_test "4.1" "Checking CDD CLI is executable"

if [ -x "$CDD_BIN" ]; then
  print_success "CDD CLI has execute permission"
else
  print_failure "CDD CLI missing execute permission"
fi

echo ""

# Test 5: Edge Cases
print_header "Test 5: Edge Cases"

# Create a new test directory for edge case testing
EDGE_TEST_DIR=$(mktemp -d -t cdd-edge-XXXXXX)
trap "rm -rf $TEST_DIR $EDGE_TEST_DIR" EXIT
cd "$EDGE_TEST_DIR"

run_test
print_test "5.1" "Testing 'add rag' before 'init' (should fail gracefully)"

node "$CDD_BIN" add rag > /dev/null 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  print_success "Correctly rejects 'add rag' before init"
else
  print_failure "Should reject 'add rag' before init"
fi

run_test
print_test "5.2" "Testing double init (should handle existing files)"

node "$CDD_BIN" init > /dev/null 2>&1
node "$CDD_BIN" init > /dev/null 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ] && [ -d "cdd/.meta" ]; then
  print_success "Handles double init gracefully"
else
  print_failure "Failed to handle double init"
fi

cd "$TEST_DIR"

echo ""

# Summary
print_header "Test Summary"
echo -e "Total tests run:    ${TESTS_RUN}"
echo -e "${GREEN}Tests passed:       ${TESTS_PASSED}${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
  echo -e "${RED}Tests failed:       ${TESTS_FAILED}${NC}"
else
  echo -e "Tests failed:       ${TESTS_FAILED}"
fi
echo ""

# Calculate success rate
SUCCESS_RATE=$((TESTS_PASSED * 100 / TESTS_RUN))
echo "Success rate: ${SUCCESS_RATE}%"
echo ""

# Exit with appropriate code
if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed${NC}"
  exit 1
fi
