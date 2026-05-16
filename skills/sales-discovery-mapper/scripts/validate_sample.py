#!/usr/bin/env python3
"""Reviewer-friendly wrapper around the canonical validation script."""

from pathlib import Path
import runpy
import sys

ROOT = Path(__file__).resolve().parents[3]
CANONICAL_SCRIPT = ROOT / "sales-discovery-mapper" / "scripts" / "validate_output.py"
SAMPLE_OUTPUT = ROOT / "sales-discovery-mapper" / "references" / "dashboard-output-example.json"

if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else SAMPLE_OUTPUT
    sys.argv = [str(CANONICAL_SCRIPT), str(target)]
    runpy.run_path(str(CANONICAL_SCRIPT), run_name="__main__")
