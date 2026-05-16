#!/usr/bin/env bash
set -euo pipefail

SKILL_NAME="sales-discovery-mapper"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="${REPO_DIR}/${SKILL_NAME}"
CODEX_HOME_DIR="${CODEX_HOME:-${HOME}/.codex}"
TARGET_PARENT="${CODEX_HOME_DIR}/skills"
TARGET_DIR="${TARGET_PARENT}/${SKILL_NAME}"

if [[ ! -f "${SOURCE_DIR}/SKILL.md" ]]; then
  echo "Could not find ${SOURCE_DIR}/SKILL.md"
  exit 1
fi

if [[ -e "${TARGET_DIR}" && "${1:-}" != "--force" ]]; then
  echo "Skill already exists at ${TARGET_DIR}"
  echo "Run with --force to replace it:"
  echo "  ./install-codex-skill.sh --force"
  exit 1
fi

mkdir -p "${TARGET_PARENT}"

if [[ -e "${TARGET_DIR}" ]]; then
  rm -rf "${TARGET_DIR}"
fi

cp -R "${SOURCE_DIR}" "${TARGET_PARENT}/"

echo "Installed ${SKILL_NAME} to ${TARGET_DIR}"
echo "Open a new Codex chat, then ask: 세일즈 분석을 진행해줘."
