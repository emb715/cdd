#!/usr/bin/env python3
"""
CDD-RAG Installation Verification Script
Run this after installation to verify everything is set up correctly
"""

import sys
from pathlib import Path


def check_python_version():
    """Check Python version"""
    print("1. Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 9:
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print(
            f"   ❌ Python {version.major}.{version.minor}.{version.micro} (need 3.9+)"
        )
        return False


def check_dependencies():
    """Check required dependencies"""
    print("\n2. Checking dependencies...")
    required = [
        "chromadb",
        "sentence_transformers",
        "openai",
        "yaml",
        "frontmatter",
        "click",
        "rich",
    ]

    all_ok = True
    for package in required:
        try:
            if package == "yaml":
                import yaml

                print(f"   ✅ pyyaml")
            elif package == "sentence_transformers":
                import sentence_transformers

                print(f"   ✅ sentence-transformers")
            elif package == "frontmatter":
                import frontmatter

                print(f"   ✅ python-frontmatter")
            else:
                __import__(package)
                print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} (run: pip install {package})")
            all_ok = False

    return all_ok


def check_configuration():
    """Check configuration files"""
    print("\n3. Checking configuration...")
    config_path = Path(__file__).parent / "config.yaml"

    if config_path.exists():
        print(f"   ✅ config.yaml exists")
        try:
            import yaml

            with open(config_path) as f:
                config = yaml.safe_load(f)
            print(f"   ✅ config.yaml is valid YAML")
            return True
        except Exception as e:
            print(f"   ❌ config.yaml is invalid: {e}")
            return False
    else:
        print(f"   ❌ config.yaml not found")
        return False


def check_workspace():
    """Check workspace path"""
    print("\n4. Checking workspace path...")
    try:
        from core.config import load_config

        config = load_config()
        if config.workspace_path.exists():
            print(f"   ✅ Workspace found: {config.workspace_path}")
            return True
        else:
            print(f"   ⚠️  Workspace not found: {config.workspace_path}")
            print(
                f"      Update 'workspace_path' in config.yaml or create CDD workspace"
            )
            return False
    except Exception as e:
        print(f"   ❌ Error checking workspace: {e}")
        return False


def check_api_key():
    """Check API key (optional)"""
    print("\n5. Checking API key (optional for AI features)...")
    try:
        from core.config import get_config

        config = get_config()
        if config.openai_api_key:
            print(f"   ✅ OPENAI_API_KEY is set")
            return True
        else:
            print(f"   ⚠️  OPENAI_API_KEY not set")
            print(f"      AI features will not work (search still works)")
            print(f"      Add OPENAI_API_KEY to .env to enable AI features")
            return None  # Not required
    except Exception as e:
        print(f"   ⚠️  Could not check API key: {e}")
        return None


def check_core_modules():
    """Check core modules can be imported"""
    print("\n6. Checking core modules...")
    modules = [
        "core.config",
        "core.models",
        "core.embedder",
        "core.vector_store",
        "core.query_engine",
        "core.llm_client",
        "core.cli",
    ]

    all_ok = True
    for module in modules:
        try:
            __import__(module)
            print(f"   ✅ {module}")
        except ImportError as e:
            print(f"   ❌ {module}: {e}")
            all_ok = False

    return all_ok


def check_hooks():
    """Check hook modules"""
    print("\n7. Checking hook modules...")
    modules = ["hooks.indexer", "hooks.enhancer", "hooks.utils"]

    all_ok = True
    for module in modules:
        try:
            __import__(module)
            print(f"   ✅ {module}")
        except ImportError as e:
            print(f"   ❌ {module}: {e}")
            all_ok = False

    return all_ok


def test_embedding():
    """Test embedding generation"""
    print("\n8. Testing embedding generation...")
    try:
        from core.embedder import Embedder

        embedder = Embedder()
        embedding = embedder.embed("test")

        if embedding and len(embedding) > 0:
            print(f"   ✅ Embedding generated ({len(embedding)} dimensions)")
            return True
        else:
            print(f"   ❌ Embedding generation failed")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def test_vector_store():
    """Test vector store initialization"""
    print("\n9. Testing vector store...")
    try:
        from core.vector_store import VectorStore

        store = VectorStore()
        count = store.count()
        print(f"   ✅ Vector store initialized ({count} chunks)")
        return True
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False


def print_summary(results):
    """Print summary"""
    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)

    passed = sum(1 for r in results if r is True)
    warnings = sum(1 for r in results if r is None)
    failed = sum(1 for r in results if r is False)

    print(f"✅ Passed: {passed}")
    if warnings > 0:
        print(f"⚠️  Warnings: {warnings}")
    if failed > 0:
        print(f"❌ Failed: {failed}")

    print()

    if failed == 0:
        print("🎉 Installation verified successfully!")
        print()
        print("Next steps:")
        print("1. Index your workspace: python -m core.cli index")
        print("2. Try a search: python -m core.cli search 'your query'")
        print("3. Check stats: python -m core.cli stats")
    else:
        print("❌ Installation has issues. Please fix errors above.")
        print()
        print("Common fixes:")
        print("- Install dependencies: pip install -r requirements.txt")
        print("- Check config.yaml workspace_path")
        print("- Verify you're in the .rag directory")


def main():
    """Run all checks"""
    print("=" * 60)
    print("CDD-RAG Installation Verification")
    print("=" * 60)
    print()

    results = []

    results.append(check_python_version())
    results.append(check_dependencies())
    results.append(check_configuration())
    results.append(check_workspace())
    results.append(check_api_key())  # Optional
    results.append(check_core_modules())
    results.append(check_hooks())
    results.append(test_embedding())
    results.append(test_vector_store())

    print_summary(results)

    # Exit with error code if any required checks failed
    if any(r is False for r in results):
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏸️  Interrupted")
        sys.exit(130)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
