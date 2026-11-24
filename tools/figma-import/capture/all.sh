#!/usr/bin/env bash
# Xuất JSON cho landing tổng + phân bón (desktop 1440, mobile 390) vào tools/figma-import/data/
set -e
cd "$(dirname "$0")"
export SOURCE="$(git rev-parse --abbrev-ref HEAD) @ $(git rev-parse --short HEAD)"
node capture.mjs /        1440 0 01-landing-tong-desktop "Landing tổng – Desktop 1440" "Landing tổng"
node capture.mjs /        390  1 02-landing-tong-mobile  "Landing tổng – Mobile 390"   "Landing tổng"
node capture.mjs /phanbon 1440 0 03-phan-bon-desktop     "Phân bón – Desktop 1440"     "Phân bón"
node capture.mjs /phanbon 390  1 04-phan-bon-mobile      "Phân bón – Mobile 390"       "Phân bón"
