#!/bin/bash
#
# Cleanup Test Environment
# Removes test directories and unlinks packages
#

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get script directory and monorepo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${YELLOW}🧹 Cleaning up test environment...${NC}"
echo ""

# Unlink packages
echo "📦 Unlinking npm packages..."
cd "$MONOREPO_ROOT/packages/cdd"
npm unlink -g @emb715/cdd 2>/dev/null || true

cd "$MONOREPO_ROOT/packages/cdd-rag"
npm unlink -g @emb715/cdd-rag 2>/dev/null || true

echo -e "${GREEN}✅ Packages unlinked${NC}"
echo ""

# Remove test directory if provided
if [ -n "$1" ]; then
  if [ -d "$1" ]; then
    echo "📁 Removing test directory: $1"
    rm -rf "$1"
    echo -e "${GREEN}✅ Test directory removed${NC}"
  else
    echo -e "${YELLOW}⚠️  Directory not found: $1${NC}"
  fi
  echo ""
fi

# Remove any cdd-test-* directories in home
echo "🔍 Looking for test directories in ~/"
TEST_DIRS=$(find ~ -maxdepth 1 -type d -name "cdd-test-*" 2>/dev/null || true)

if [ -n "$TEST_DIRS" ]; then
  echo "Found test directories:"
  echo "$TEST_DIRS"
  echo ""
  read -p "Remove these directories? (y/N) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "$TEST_DIRS" | xargs rm -rf
    echo -e "${GREEN}✅ Test directories removed${NC}"
  else
    echo "Skipped removal"
  fi
else
  echo "No test directories found"
fi

echo ""
echo -e "${GREEN}🎉 Cleanup complete!${NC}"
