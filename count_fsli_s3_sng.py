import pathlib
import re
import collections

path = pathlib.Path(r'C:\Users\nanda\Downloads\20260210000001-seed-workpaper-templates-SNG.js')
text = path.read_text(encoding='utf-8', errors='ignore')
pattern = re.compile(r"\{[^}]*?fsli_name\s*:\s*'(?P<fsli>[^']+)'[^}]*?source_file\s*:\s*'(?P<source>[^']+)'[^}]*?\}", re.DOTALL)
counts = collections.Counter()
for m in pattern.finditer(text):
    if 's3://' in m.group('source'):
        counts[m.group('fsli')] += 1
for fsli, count in counts.most_common():
    print(f"{count}\t{fsli}")
print('TOTAL fsli', len(counts), 'records', sum(counts.values()))
