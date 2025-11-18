#!/bin/bash
# ============================================================================
# CDD-RAG Quick Start Script
# ============================================================================
# Automated setup and verification for CDD-RAG
#
# Usage:
#   ./quick_start.sh          # Full setup
#   ./quick_start.sh verify   # Verify only
#   ./quick_start.sh index    # Index only

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "╔════════════════════════════════════════════════════════╗"
echo "║          CDD-RAG Quick Start                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check Python
echo -e "${BLUE}Checking Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3 found${NC}"
echo ""

# Check if in .rag directory
if [ ! -f "config.yaml" ]; then
    echo -e "${RED}❌ Not in .rag directory${NC}"
    echo "Please run this script from the .rag directory"
    exit 1
fi

# Create virtual environment if needed
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}✅ Virtual environment created${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Virtual environment already exists${NC}"
    echo ""
fi

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate
echo -e "${GREEN}✅ Virtual environment activated${NC}"
echo ""

# Install dependencies if needed
if [ "$1" != "verify" ] && [ "$1" != "index" ]; then
    echo -e "${BLUE}Installing dependencies...${NC}"
    pip install -q --upgrade pip
    pip install -q -r requirements.txt
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
fi

# Create .env if doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env created from .env.example${NC}"
    echo -e "${YELLOW}⚠️  Edit .env to add OPENAI_API_KEY for AI features${NC}"
    echo ""
fi

# Verify installation
if [ "$1" = "verify" ] || [ "$1" = "" ]; then
    echo -e "${BLUE}Verifying installation...${NC}"
    python3 verify_installation.py
    echo ""
fi

# Index workspace
if [ "$1" = "index" ] || [ "$1" = "" ]; then
    echo -e "${BLUE}Index workspace?${NC}"
    read -p "Index CDD workspace now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}Indexing workspace...${NC}"
        python3 -m core.cli index
        echo ""
    fi
fi

# Success
echo "╔════════════════════════════════════════════════════════╗"
echo "║          Setup Complete!                               ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Activate virtual environment:"
echo "   source venv/bin/activate"
echo ""
echo "2. Try commands:"
echo "   python -m core.cli stats           # Show statistics"
echo "   python -m core.cli search 'query'  # Search"
echo "   python -m core.cli ask 'question'  # AI answer"
echo ""
echo "3. Use in CDD workflow:"
echo "   /cdd:query \"your search or question\""
echo ""
echo "📚 Documentation: See README.md and SETUP.md"
echo ""
