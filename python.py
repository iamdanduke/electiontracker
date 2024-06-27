import pandas as pd

# Load the data from the uploaded CSV file
file_path = '/Users/danielduke/Documents/GitHub/electiontracker/dc-candidates-election_id_parl2024-07-04-2024-06-26T16-42-33.csv'
data = pd.read_csv(file_path)

# Organize the data by constituency
constituencies = {}
for _, row in data.iterrows():
    constituency = row['post_label']
    candidate = row['person_name']
    party = row['party_name'].replace(" ", "").lower()  # Simplify party class names
    
    if constituency not in constituencies:
        constituencies[constituency] = []
    
    constituencies[constituency].append((candidate, party))

# Generate the HTML content
html_content = ""
for constituency, candidates in constituencies.items():
    constituency_id = constituency.replace(" ", "_").replace("-", "_").lower()
    html_content += f'<div class="constituency" id="{constituency_id}">\n'
    html_content += f'  <h2>{constituency}</h2>\n'
    html_content += '  <ul>\n'
    for candidate, party in candidates:
        html_content += f'    <li data-party="{party}" onclick="markWinner(\'{constituency_id}\', \'{party}\')">{candidate} ({party})</li>\n'
    html_content += '  </ul>\n'
    html_content += '</div>\n'

# Save the HTML content to a file for reference
html_file_path = 'constituencies.html'
with open(html_file_path, 'w') as file:
    file.write(html_content)

print(f"HTML content has been written to {html_file_path}")
