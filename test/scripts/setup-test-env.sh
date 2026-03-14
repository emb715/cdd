#!/bin/bash
#
# Setup Test Environment
# Creates a clean test environment for manual CDD testing
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory and monorepo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  CDD Test Environment Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Create test directory
TEST_DIR="$HOME/cdd-test-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$TEST_DIR"

echo "📁 Created test directory: $TEST_DIR"
echo ""

# Copy test fixtures
if [ -d "$MONOREPO_ROOT/test/fixtures/sample-work-items" ]; then
  echo "📋 Copying test fixtures..."
  mkdir -p "$TEST_DIR/cdd"
  cp -r "$MONOREPO_ROOT/test/fixtures/sample-work-items"/* "$TEST_DIR/cdd/" 2>/dev/null || true
  echo -e "${GREEN}✅ Test fixtures copied${NC}"
  echo ""
fi

# Instructions
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Navigate to test directory:"
echo "   cd $TEST_DIR"
echo ""
echo "2. Link CDD CLI (development mode):"
echo "   cd $MONOREPO_ROOT/packages/cdd"
echo "   npm link"
echo "   cd $TEST_DIR"
echo ""
echo "3. Test CDD init:"
echo "   cdd init"
echo ""
echo "4. Cleanup when done:"
echo "   $SCRIPT_DIR/cleanup.sh $TEST_DIR"
echo ""
