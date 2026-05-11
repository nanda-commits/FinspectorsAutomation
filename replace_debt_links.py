import re

# New source files in order
new_sources = [
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/1. BOR-P01 - Understanding - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/2. BOR-P02 - Evaluate Accounting Policy - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/3. BOR-P03 - Identify Borrowings Lenders and Locations - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/4. BOR-P04 - Identify and Assess Assertion-level Risks - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/5. BOR-P05 - Fraud Risk Consideration - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/6. BOR-S01 - Borrowings Lead Schedule & TB Tie-out.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/7. BOR-S02 - Rollforward - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/8. BOR-S03 - Lender External Confirmations - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/9. BOR-S04 - Debt Terms and Covenant Testing - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/10. BOR-S05 - Interest Expense and Accrual Testing - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/11. BOR-S06 - Current vs Non-Current Classification - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/12. BOR-S07 - New and Modified Debt Agreements - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/13. BOR-S08 - Debt Repayment and Utilisation - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/14. BOR-S09 - Cross-default and Security Review - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/15. BOR-S10 - Related Party Borrowings - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/16. BOR-S11 - Debt Disclosure Tie-in - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/17. BOR-F01 - Ind AS 23 - Disclosure Checklist - Borrowing Costs.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/18. BOR-F02 - Misstatements Evaluation - Borrowings and Debt.xlsx",
    "s3://finspectors-templates/workpapers/india/12. Debt Borrowings/19. BOR-F03 - Final Conclusion - Borrowings and Debt.xlsx"
]

path = r"C:\Users\nanda\Downloads\20260210000001-seed-workpaper-templates-IND.js"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all Debt entries
debt_pattern = re.compile(r"(\{[^}]*?fsli_name\s*:\s*'Debt'[^}]*?source_file\s*:\s*)'([^']+)'([^}]*?\})", re.DOTALL)
matches = list(debt_pattern.finditer(content))

if len(matches) != len(new_sources):
    print(f"Mismatch: {len(matches)} matches, {len(new_sources)} new sources")
    exit(1)

# Replace each
new_content = content
for i, match in enumerate(matches):
    old_source = match.group(2)
    new_source = new_sources[i]
    replacement = match.group(1) + "'" + new_source + "'" + match.group(3)
    new_content = new_content.replace(match.group(0), replacement, 1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replaced all Debt source files.")
