#!/bin/bash
# Banned words scan - 一级禁用词
echo "=== 情态类 ==="
grep -n '仿佛\|好像\|犹如\|宛若\|一丝\|一抹\|些许\|几分\|隐约' novel/正文/第*.md | head -100

echo ""
echo "=== 动作类 ==="
grep -n '深吸一口气\|缓缓\|不禁\|微微\|轻轻\|淡淡' novel/正文/第*.md | head -100

echo ""
echo "=== 表情类 ==="
grep -n '眼中闪过\|嘴角勾起\|眉头微皱\|眉眼低垂\|瞳孔微缩' novel/正文/第*.md | head -50

echo ""
echo "=== 心理类 ==="
grep -n '心中一动\|心头一震\|心下了然\|心中暗道\|心底泛起\|不由得' novel/正文/第*.md | head -50

echo ""
echo "=== 判断类 ==="
grep -n '不容置疑\|不易察觉\|显而易见\|毫无疑问\|不可否认' novel/正文/第*.md | head-30

echo ""
echo "=== 形容类 ==="
grep -n '坚定\|闪烁着光芒\|狡黠\|深邃\|凛冽' novel/正文/第*.md | head-50

echo ""
echo "=== 过渡类 ==="
grep -n '突然\|瞬间\|不由自主\|情不自禁\|自然而然' novel/正文/第*.md | head-80

echo ""
echo "=== 禁用句式模板 ==="
grep -n '说道\|问道\|笑道\|，带着\|他感到\|她感到\|他意识到\|她意识到\|像.*一样' novel/正文/第*.md | head -100

echo ""
echo "=== 升华/总结句式 ==="
grep -n '这一刻\|他知道\|她明白\|这就是\|他终于明白\|她终于明白\|他这才意识到\|她这才意识到' novel/正文/第*.md | head -50

echo ""
echo "=== 像字频率 ==="
grep -n '像' novel/正文/第*.md | head-80
