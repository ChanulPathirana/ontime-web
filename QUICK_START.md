# Quick Start Guide - OnTime Project Management

## 🚀 Initial Setup (One-time setup)

### 1. Setup Labels

Run the label setup workflow to create all project labels:

1. Go to: `https://github.com/OnTime-SE-G/ontime-web/actions`
2. Click on **"Setup Repository Labels"** workflow
3. Click **"Run workflow"** → **"Run workflow"** button
4. Wait for completion (should take ~30 seconds)

### 2. Create Organization Project Board

1. Go to: `https://github.com/orgs/OnTime-SE-G/projects`
2. Click **"New project"**
3. Fill in details:
   - **Name:** OnTime Development Board
   - **Template:** Board
4. Click **"Create project"**

### 3. Configure Project Columns

Add/rename columns in your project board:
- 📋 **Backlog** - All new tasks
- 🎯 **To Do** - Ready to start this sprint
- 🔄 **In Progress** - Currently working
- 👀 **Review** - Awaiting review
- ✅ **Done** - Completed

### 4. Link Repository to Project

1. In your project board, click **"..."** menu
2. Select **"Settings"**
3. Under **"Manage access"**, ensure `ontime-web` repository is linked

---

## 📝 Daily Workflow

### Creating a New Task

1. **Go to Issues:** `https://github.com/OnTime-SE-G/ontime-web/issues`
2. **Click "New issue"**
3. **Select appropriate template:**
   - 🏗️ Frontend Lead Task
   - 🗺️ Map & Live Tracking Task
   - ⚡ Real-Time Communication Task
   - 🎨 UI/UX & Display Features Task
   - 🔧 Integration & Advanced Features Task
   - 🐛 Bug Report
   - ✨ Feature Request

4. **Fill in all fields:**
   - Title with proper prefix (e.g., `[Frontend]`, `[Map]`)
   - Description
   - Platform (Flutter/Next.js/Both)
   - Priority
   - Acceptance criteria

5. **Submit** - Labels will be auto-applied! ✨

### Working on a Task

1. **Find your task** in the project board or issues
2. **Assign yourself** to the issue
3. **Status automatically changes** to "In Progress" 🔄
4. **Create a branch:**
   ```bash
   git checkout -b feature/123-your-feature-name
   ```
5. **Make your changes**
6. **Commit with clear messages:**
   ```bash
   git commit -m "feat(map): add bus marker animation

   Implemented smooth animation for bus movements
   
   Closes #123"
   ```

### Submitting Your Work

1. **Push your branch:**
   ```bash
   git push origin feature/123-your-feature-name
   ```

2. **Create Pull Request:**
   - Go to: `https://github.com/OnTime-SE-G/ontime-web/pulls`
   - Click **"New pull request"**
   - Select your branch
   - Write description
   - **Important:** Add `Closes #123` (your issue number) in the PR description
   - Request review from team members

3. **Status automatically changes** to "Review" 👀

4. **After approval & merge:**
   - Issue automatically closes ✅
   - Status changes to "Done"

---

## 🏷️ Common Label Combinations

### For Frontend Lead:
```
role: frontend-lead
platform: nextjs (or flutter)
type: feature (or bug)
priority: high (or medium/low)
status: todo → in-progress → review → done
```

### For Map & Tracking:
```
role: map-tracking
platform: both
type: feature
priority: high
status: in-progress
```

### For UI/UX:
```
role: ui-ux
component: web
type: enhancement
priority: medium
status: review
```

---

## 🔍 Finding Tasks

### By Role:
- `label:"role: frontend-lead"`
- `label:"role: map-tracking"`
- `label:"role: ui-ux"`

### By Status:
- `label:"status: todo"` - Available tasks
- `label:"status: in-progress"` - Someone's working on it
- `label:"status: blocked"` - Needs help

### By Priority:
- `label:"priority: high"` - Urgent tasks
- `label:"priority: medium"` - Important tasks

### Your Tasks:
- `assignee:@me` - All your assigned tasks
- `assignee:@me label:"status: in-progress"` - What you're working on

---

## 🆘 Common Actions

### I'm Blocked!
1. Add comment to your issue explaining the blocker
2. Add label: `status: blocked`
3. Remove label: `status: in-progress`
4. Mention the issue/person blocking you
5. Pick up another task if available

### Need Help?
1. Add label: `help wanted`
2. Add comment with specific questions
3. Tag team members who might help: `@username`

### Found a Bug While Working?
1. Create new issue using **Bug Report** template
2. Reference it in your current issue: "Discovered #456 while working on this"
3. Decide priority with team

### Task is Taking Longer?
1. Add comment with update
2. Break it into smaller subtasks if needed
3. Communicate in standup

---

## 📊 Team Views

### Project Board Views

**Backlog View:**
- See all `status: todo` tasks
- Helps with sprint planning

**My Tasks:**
- Filter: `assignee:@me`
- See everything you're responsible for

**High Priority:**
- Filter: `label:"priority: high"` or `label:"priority: critical"`
- Focus on urgent work

**By Role:**
- Filter by your role label
- See all tasks for your area

---

## ✅ Best Practices

### DO:
✅ Create issues before starting work  
✅ Use proper issue templates  
✅ Write clear acceptance criteria  
✅ Link PRs to issues with `Closes #123`  
✅ Keep issues updated with comments  
✅ Break large tasks into smaller ones  
✅ Ask for help when blocked  

### DON'T:
❌ Start work without an issue  
❌ Leave issues without updates  
❌ Forget to assign yourself  
❌ Create PRs without linking issues  
❌ Work on tasks assigned to others (without asking)  

---

## 🔗 Quick Links

- **Issues:** https://github.com/OnTime-SE-G/ontime-web/issues
- **Pull Requests:** https://github.com/OnTime-SE-G/ontime-web/pulls
- **Project Board:** https://github.com/orgs/OnTime-SE-G/projects
- **Actions:** https://github.com/OnTime-SE-G/ontime-web/actions

---

## 📚 Additional Resources

- [PROJECT_MANAGEMENT.md](../PROJECT_MANAGEMENT.md) - Full documentation
- [LABELS.md](.github/LABELS.md) - Label reference
- [Issue Templates](.github/ISSUE_TEMPLATE/) - All templates

---

**Questions?** Create an issue with `label: question` or start a discussion!

*Happy coding! 🚀*
