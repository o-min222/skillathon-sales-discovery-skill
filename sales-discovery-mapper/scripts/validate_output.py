#!/usr/bin/env python3
import json
import sys
from pathlib import Path


REQUIRED_TOP_LEVEL = [
    "metadata",
    "account",
    "opportunity",
    "communications",
    "stakeholders",
    "bant",
    "meddpicc",
    "ontology",
    "strategy",
    "risks",
    "data_quality",
]

BANT_KEYS = {"budget", "authority", "need", "timeline"}
MEDDPICC_KEYS = {
    "metrics",
    "economic_buyer",
    "decision_criteria",
    "decision_process",
    "paper_process",
    "identify_pain",
    "champion",
    "competition",
}


def fail(message):
    print(f"FAIL: {message}")
    sys.exit(1)


def require(condition, message):
    if not condition:
        fail(message)


def validate_field(name, item):
    for key in ["status", "confirmed", "inferred", "unknown", "evidence_ids", "confidence", "freshness", "changeability", "sensitive", "next_questions"]:
        require(key in item, f"{name} missing {key}")

    require(item["status"] in {"confirmed", "partial", "unknown", "risk"}, f"{name} has invalid status")
    require(0 <= item["confidence"] <= 1, f"{name} confidence must be 0..1")
    require(item["freshness"] in {"fresh", "watch", "stale", "revalidate_required"}, f"{name} has invalid freshness")
    require(item["changeability"] in {"low", "medium", "high"}, f"{name} has invalid changeability")

    if item["confirmed"]:
        require(item["evidence_ids"], f"{name} has confirmed claims without evidence_ids")

    if item["unknown"]:
        require(item["next_questions"], f"{name} has unknown fields without next_questions")


def main():
    if len(sys.argv) != 2:
        fail("usage: validate_output.py path/to/dashboard-output-example.json")

    path = Path(sys.argv[1])
    require(path.exists(), f"{path} does not exist")
    data = json.loads(path.read_text(encoding="utf-8"))

    for key in REQUIRED_TOP_LEVEL:
        require(key in data, f"missing top-level key: {key}")

    require(set(data["bant"].keys()) == BANT_KEYS, "BANT keys are incorrect")
    require(set(data["meddpicc"].keys()) == MEDDPICC_KEYS, "MEDDPICC keys are incorrect")

    for key, item in data["bant"].items():
        validate_field(f"bant.{key}", item)

    for key, item in data["meddpicc"].items():
        validate_field(f"meddpicc.{key}", item)

    for item in data["communications"]:
        for key in ["id", "type", "date", "channel", "title", "participants", "summary", "source_summary", "raw_excerpt", "sensitive"]:
            require(key in item, f"communication missing {key}: {item.get('id', 'unknown')}")
        require(item["raw_excerpt"].strip(), f"communication raw_excerpt is empty: {item['id']}")
        require(item["source_summary"].strip(), f"communication source_summary is empty: {item['id']}")

    node_ids = {node["id"] for node in data["ontology"]["nodes"]}
    for edge in data["ontology"]["edges"]:
        require(edge["from"] in node_ids, f"edge references missing from node: {edge}")
        require(edge["to"] in node_ids, f"edge references missing to node: {edge}")

    require(data["strategy"].get("must_know"), "strategy.must_know is empty")
    require(data["strategy"].get("deal_closing_plan"), "strategy.deal_closing_plan is empty")
    require(data["strategy"].get("next_meeting_agenda"), "strategy.next_meeting_agenda is empty")
    require(data["strategy"].get("email_strategy"), "strategy.email_strategy is empty")

    print("PASS: dashboard output structure is valid")


if __name__ == "__main__":
    main()
