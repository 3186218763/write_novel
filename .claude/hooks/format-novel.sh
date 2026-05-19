#!/bin/bash
# format-novel.sh — 正文文件格式整理（不改变文字内容）
#
# 功能：
# 1. CRLF → LF 统一换行符
# 2. 去除行尾空白
# 3. 规范化 --- 场景分隔符（移除多余空格）
# 4. 压缩连续多个空行为一个空行
# 5. 确保文件末尾只有一个换行符
#
# 原则：只改空白符，不改文字内容
set -euo pipefail

source "$(dirname "$0")/lib/common.sh"

BOOK_DIR=$(discover_book_dir)
[ -z "$BOOK_DIR" ] && exit 0

format_file() {
  local file="$1"

  # 使用 perl 批量处理（-i 原地修改，-0777 slurp 模式）
  # 每步分开执行以保证可读性和稳定性
  perl -i -0777 -pe '
    # 1. CRLF → LF
    s/\r\n/\n/g;

    # 2. 去除行尾空白（空格和 tab）
    s/[ \t]+$//gm;

    # 3. 规范化 --- 场景分隔符（移除多余空格）
    s/^[ \t]*---[ \t]*$/---/gm;

    # 4. 压缩连续空行为一个空行（\n{3,} → \n\n）
    s/\n{3,}/\n\n/g;

    # 5. 删除文件开头的空行
    s/^\n+//;

    # 6. 确保文件末尾只有一个换行符
    s/\n*$/\n/;
  ' "$file"
}

process_dir() {
  local dir="$1"
  [ -d "$dir" ] || return
  find "$dir" -name "*.md" -type f -print0 | while IFS= read -r -d '' file; do
    format_file "$file"
  done
}

process_dir "$BOOK_DIR/正文"
process_dir "$BOOK_DIR/大纲"
process_dir "$BOOK_DIR/设定"
process_dir "$BOOK_DIR/追踪"
