subpase MCP: prompt: 1. Configure MCP
Set up your MCP client.
Details:
Add this configuration to ~/.config/opencode/opencode.json:
After adding the configuration, run the following command to authenticate:
This will open your browser to complete the OAuth authentication flow.
Need help?View OpenCode docs
Code:
File: Code
```
1{
2  "$schema": "https://opencode.ai/config.json",
3  "mcp": {
4    "supabase": {
5      "type": "remote",
6      "url": "https://mcp.supabase.com/mcp?project_ref=mqbyjshkocnkxfqoypyj&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching%2Cfeedback",
7      "enabled": true
8    }
9  }
10}
```

File: Code
```
opencode mcp auth supabase
```

2. Install Agent Skills (optional)
Agent Skills give AI coding tools ready-made instructions, scripts, and resources for working with Supabase more accurately and efficiently.
Code:
File: Code
```
npx skills add supabase/agent-skills
```

npx skills add supabase/agent-skills



Telegarm API=8795413972:AAHXxQu2NnHVTau6DY9GrTXfYhMd5Nfkgts


grok api=GROQ_API_KEY_REDACTEDdmK1d

n8n api=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDQxYWYwOS01YzM5LTQ5OGMtYThmMS04ZGQ5MDE0Mjc0OTEiLCJpc3MiOiJuOG4iLCJqdGkiOiI0OWM1ODQxYi0yYzk5LTQyMGUtOGNiYi1mZmJmNzY5NWIxMjUiLCJpYXQiOjE3OTM1NDYwMzEsImF1ZCI6InB1YmxpYy1hcGkifQ.na6jUmCTXREm-lCreIOo2evoza8J3j9IPIV8iu9mSDg

supbase API=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYnlqc2hrb2Nua3hmcW95cHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MzE5NjcsImV4cCI6MjEwOTEwNzk2N30.WtAAUxP_aJH7Q27pvkkZD7QAs2MlVSUYK6NTvA7_RFg

supbase secret=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYnlqc2hrb2Nua3hmcW95cHlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzUzMTk2NywiZXhwIjoyMTA5MTA3OTY3fQ.R6AuoF9iHcnCng2KF1qHWYninffjZgY0w7cKoVs4ZlU