#!/bin/bash
#
# CDD Local Testing Script
# Tests CLI functionality and end-to-end workflows
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

# Test 2: File Permissions
print_header "Test 2: File Permissions"
run_test
print_test "2.1" "Checking CDD CLI is executable"

if [ -x "$CDD_BIN" ]; then
  print_success "CDD CLI has execute permission"
else
  print_failure "CDD CLI missing execute permission"
fi

echo ""

# Test 3: Edge Cases
print_header "Test 3: Edge Cases"

# Create a new test directory for edge case testing
EDGE_TEST_DIR=$(mktemp -d -t cdd-edge-XXXXXX)
trap "rm -rf $TEST_DIR $EDGE_TEST_DIR" EXIT
cd "$EDGE_TEST_DIR"

run_test
print_test "3.1" "Testing double init (should handle existing files)"

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
