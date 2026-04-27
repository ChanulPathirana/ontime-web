# G3 Team Management - Quick Guide

## 🎯 Your Team (G3: System Engineering & Interaction)

You are **Group G3**, responsible for the user-facing applications. Your team has **5 members**:

### Team Members & Roles

| Member | Role | GitHub | Responsibilities |
|--------|------|--------|------------------|
| Lasana Pahanga | **G3.1 - Frontend Lead** | [@LasanaPahanga](https://github.com/LasanaPahanga) | App structure, routing, layouts, API integration |
| Kalana Pankaja | **G3.2 - Map & Live Tracking** | [@kalana-pankaja](https://github.com/kalana-pankaja) | Mapbox, bus markers, route visualization, animation |
| Chanul Pathirana | **G3.3 - Real-Time Communication** | [@ChanulPathirana](https://github.com/ChanulPathirana) | Socket.IO, live data, UI synchronization |
| Ravindu Pathirana | **G3.4 - UI/UX** | [@Ravindu-Pathirana](https://github.com/Ravindu-Pathirana) | Design, components, responsive layouts, user experience |
| Hasaranga Dinuj | **G3.5 - Integration & Testing** | [@hasarangadinuj](https://github.com/hasarangadinuj) | Notifications, auth, testing, optimization |

---

## 📂 Your Repositories

### Current Setup: ✅

**ontime-web** (This repo)
- Next.js web application
- Already has complete project management setup!

**passenger-app** (Your Flutter app - detected in workspace)
- You can copy the same `.github` folder structure here

### Do You Need Another Repo? **NO!** ❌

You can manage both apps in your existing repos:
- `ontime-web` - for web tasks
- `passenger-app` - for mobile tasks (copy the templates there)

Or optionally create:
- `ontime-mobile` - separate Flutter repo with same structure

---

## 🚀 How to Use (For G3 Only)

### 1. Setup Labels (One-Time)

Run this once to create all labels:

1. Go to: https://github.com/OnTime-SE-G/ontime-web/actions
2. Click **"Setup Repository Labels"**
3. Click **"Run workflow"**

This creates all the role labels for your 5 sub-teams!

### 2. Create Issues for Your Team

Each team member uses their specific template:

- **Frontend Lead** → Use `01-frontend-lead.yml` template
- **Map & Tracking** → Use `02-map-tracking.yml` template
- **Real-Time Comm** → Use `03-realtime-communication.yml` template
- **UI/UX** → Use `04-ui-ux.yml` template
- **Integration** → Use `05-integration-advanced.yml` template

**All templates are already created!** Just go to:
https://github.com/OnTime-SE-G/ontime-web/issues/new/choose

### 3. Project Board

Create ONE board for G3:

1. Go to: https://github.com/orgs/OnTime-SE-G/projects
2. Click **"New project"**
3. Name: **"G3 - Frontend & Mobile Development"**
4. Choose **Board** layout

**Columns**:
```
📋 Backlog
🔵 Frontend Lead
🟢 Map & Tracking  
🟡 Real-Time Comm
🔴 UI/UX
🟣 Integration
👀 Review
✅ Done
```

Or simpler:
```
📋 To Do
🔄 In Progress
👀 Review
✅ Done
```

### 4. Daily Workflow

**Step 1: Create Task**
- Go to Issues → New Issue
- Choose your role template
- Fill it out
- Auto-labeled! ✨

**Step 2: Start Work**
- Assign yourself
- Auto-moves to "In Progress"
- Create branch: `feature/123-your-task`

**Step 3: Submit**
- Create PR
- Add `Closes #123`
- Auto-moves to "Review"

**Step 4: Complete**
- PR merged
- Issue auto-closes
- Moves to "Done" ✅

---

## 🏷️ Your Labels

### Role Labels (Internal to G3)
```
role: frontend-lead    → G3.1
role: map-tracking     → G3.2
role: realtime-comm    → G3.3
role: ui-ux            → G3.4
role: integration      → G3.5
```

### External Dependencies
```
depends-on: g1  → Need something from Edge/IoT team
depends-on: g2  → Need something from Data/ML team
depends-on: g4  → Need something from Backend team
```

### Standard Labels
```
type: feature
type: bug
priority: high/medium/low
status: todo/in-progress/review/done
platform: flutter/nextjs/both
```

---

## 📋 Example: Complete Task Lifecycle

### Scenario: Add Bus Marker Animation

**1. Frontend Lead** creates foundation:
```
Title: [Frontend] Setup map service layer
Role: frontend-lead
Platform: Next.js
Status: todo → in-progress → done
```

**2. Map & Tracking** implements feature:
```
Title: [Map] Add bus marker animation
Role: map-tracking
Platform: Both
Depends on: #123 (Frontend Lead task)
Status: todo → in-progress → review → done
```

**3. UI/UX** styles it:
```
Title: [UI/UX] Design bus marker icons
Role: ui-ux
Platform: Both
Status: todo → in-progress → done
```

**4. Real-Time Comm** connects data:
```
Title: [RealTime] Stream bus location updates
Role: realtime-comm
Platform: Both
Depends on: g4 (Backend Socket.IO server)
Status: todo → blocked → in-progress → done
```

**5. Integration** tests everything:
```
Title: [Integration] Test live bus tracking end-to-end
Role: integration
Platform: Both
Status: todo → in-progress → done
```

---

## 🤝 Coordination with Other Groups

### When You Need Something from Other Groups

Create an issue with dependencies:

```markdown
Title: [Integration] Need ETA data from backend

Labels:
- role: integration
- depends-on: g4
- depends-on: g2
- priority: high

Description:
We need the ETA prediction API endpoint to display in our tracking map.

**Required from G2 (Data):**
- ETA prediction model output

**Required from G4 (Backend):**
- REST endpoint: GET /api/eta/:busId
- Socket event: 'eta:update'

**API Contract:**
... (define what you need)

cc: @g4-backend-lead @g2-data-lead
```

### When Others Need Something from You

They'll create issues in their repos and tag you. Or they'll comment on your issues.

---

## 📊 Tracking Progress

### View by Role

**See all Frontend Lead tasks:**
```
label:"role: frontend-lead"
```

**See all Map & Tracking tasks:**
```
label:"role: map-tracking"
```

### View by Status

**Available tasks:**
```
label:"status: todo" no:assignee
```

**Your tasks:**
```
assignee:@me is:open
```

**Blocked tasks (need help):**
```
label:"status: blocked"
```

### View by Platform

**Next.js tasks:**
```
label:"platform: nextjs"
```

**Flutter tasks:**
```
label:"platform: flutter"
```

---

## 🎯 Sprint Planning (For G3 Only)

### Every 2 Weeks

**Sprint Planning Meeting:**
- Review backlog
- Assign tasks by role
- Set sprint goal
- Mark priorities

**Example Sprint Goal:**
"Complete live tracking map with real-time bus updates"

**Tasks Distribution:**
```
Frontend Lead:    Setup map page routing, API service
Map & Tracking:   Integrate Mapbox, show bus markers
Real-Time Comm:   Connect Socket.IO, receive updates
UI/UX:           Design map controls, status indicators
Integration:     Test end-to-end, add notifications
```

**Mid-Sprint Check (Friday):**
- Are we on track?
- Any blockers?
- Need help from other groups?

**Sprint Review (End):**
- Demo what you built
- Close completed issues
- Celebrate! 🎉

---

## ✅ Your Setup Checklist

- [x] Project management templates created (DONE!)
- [x] GitHub Actions workflows ready (DONE!)
- [x] Documentation written (DONE!)
- [ ] Run "Setup Labels" workflow
- [ ] Create G3 project board
- [ ] Add team members to organization
- [ ] Assign roles to team members
- [ ] Create first sprint issues
- [ ] Start development!

---

## 📞 Questions?

**For G3 internal questions:**
- Create issue with `label: question`
- Tag your team members

**For cross-group questions:**
- Create issue with `label: question` and `depends-on: gX`
- Tag the other group's lead

---

## 🔗 Quick Links

- **Create Issue**: https://github.com/OnTime-SE-G/ontime-web/issues/new/choose
- **View Issues**: https://github.com/OnTime-SE-G/ontime-web/issues
- **Project Board**: https://github.com/orgs/OnTime-SE-G/projects
- **Setup Labels**: https://github.com/OnTime-SE-G/ontime-web/actions/workflows/setup-labels.yml

---

## 📚 Documentation

- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [PROJECT_MANAGEMENT.md](./PROJECT_MANAGEMENT.md) - Full documentation
- [MULTI_GROUP_STRUCTURE.md](./MULTI_GROUP_STRUCTURE.md) - How all 4 groups work together

---

**You're all set!** 🚀 

Your G3 team can now work independently in this repo with proper project management. No need for another repo unless you want to separate mobile app completely.

*Happy coding!*
