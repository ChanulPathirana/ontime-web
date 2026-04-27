# OnTime Project Management Guide

## 🎯 Overview

This document outlines the project management structure, team responsibilities, and workflows for the OnTime Public Transport Tracking System.

---

## 👥 Team Structure & Responsibilities

### G3 Team Members

| Member | Role | GitHub Username |
|--------|------|-----------------|
| Lasana Pahanga | Frontend Lead (G3.1) | @LasanaPahanga |
| Kalana Pankaja | Map & Live Tracking (G3.2) | @kalana-pankaja |
| Chanul Pathirana | Real-Time Communication (G3.3) | @ChanulPathirana |
| Ravindu Pathirana | UI/UX & Display (G3.4) | @Ravindu-Pathirana |
| Hasaranga Dinuj | Integration & Advanced (G3.5) | @hasarangadinuj |

---

### 1. Frontend Lead (App Structure) - @LasanaPahanga
**Focus:** Foundation of mobile and web applications

**Key Responsibilities:**
- **Application Setup**
  - Initialize Flutter (mobile) and Next.js (web) projects
  - Configure folder structure following best practices
  - Manage dependencies and environment setup
  
- **Navigation & Routing**
  - Implement Flutter Navigator/GoRouter and Next Router
  - Define navigation flow: Home → Bus List → Bus Details → Map View
  
- **Layout Structure**
  - Create reusable layouts (Header, Sidebar, Main content)
  - Ensure consistency across pages
  
- **API Integration (Basic)**
  - Connect frontend to backend APIs
  - Handle GET requests and error handling
  - Structure API service layer

**Issue Label:** `role: frontend-lead`

---

### 2. Map & Live Tracking - @kalana-pankaja
**Focus:** Map integration and real-time bus visualization

**Key Responsibilities:**
- **Mapbox Integration**
  - Integrate Mapbox SDK into Flutter and Next.js
  - Configure map styles and API keys
  
- **Bus Location Display**
  - Show current bus positions (markers)
  - Display bus stops and routes (polylines)
  
- **Route Visualization**
  - Draw routes between stops
  - Highlight active routes
  
- **Bus Animation**
  - Animate bus movement smoothly
  - Handle position interpolation
  
- **Performance Handling**
  - Optimize rendering for multiple buses
  - Handle map reloading and zoom interactions

**Issue Label:** `role: map-tracking`

---

### 3. Real-Time Communication - @ChanulPathirana
**Focus:** Live data synchronization using Socket.IO

**Key Responsibilities:**
- **Socket.IO Implementation**
  - Establish client-server connection
  - Manage connection lifecycle (connect/disconnect/reconnect)
  
- **Live Data Handling**
  - Receive real-time updates (bus location, ETA, delays)
  - Emit events when needed
  
- **UI Synchronization**
  - Update UI instantly when new data arrives
  - Ensure smooth state updates without reloading
  
- **Error & Latency Handling**
  - Handle network delays and lost connections
  - Implement fallback mechanisms

**Issue Label:** `role: realtime-comm`

---

### 4. UI/UX & Display Features - @Ravindu-Pathirana
**Focus:** User-friendly, responsive, and visually appealing interfaces

**Key Responsibilities:**
- **User Interface Design**
  - Design clean screens (Dashboard, Bus details, Map)
  - Maintain consistent color schemes and typography
  
- **Bus Information Display**
  - Show bus number, route, location, status
  
- **ETA Display System**
  - Present Estimated Time of Arrival clearly
  - Use visual indicators (colors, icons)
  
- **Components Development**
  - Create reusable UI components (Bus cards, Info panels, Notification banners)
  
- **Responsive Design**
  - Ensure compatibility across mobile and web screens
  
- **Role-Based UI**
  - Adapt UI for Passenger vs Admin roles
  
- **User Experience Enhancements**
  - Add loading indicators, empty states, smooth transitions

**Issue Label:** `role: ui-ux`

---

### 5. Integration & Advanced Features - @hasarangadinuj
**Focus:** System integration, testing, and optimization

**Key Responsibilities:**
- **Notification System**
  - Implement real-time notifications (delays, arrival alerts)
  - Use push notifications (mobile) and in-app alerts (web)
  
- **User Roles & Authentication**
  - Define and implement Admin vs Passenger roles
  - Implement access control
  
- **System Integration**
  - Combine map module, real-time communication, and UI components
  - Ensure smooth data flow
  
- **Testing & Bug Fixing**
  - Perform unit and integration testing
  - Fix UI, API, and real-time issues
  
- **Final Optimization**
  - Improve performance
  - Optimize loading times
  - Ensure system stability

**Issue Label:** `role: integration`

---

## 🏷️ Label System

### Role Labels
- `role: frontend-lead` - Frontend structure tasks
- `role: map-tracking` - Map and tracking tasks
- `role: realtime-comm` - Real-time communication tasks
- `role: ui-ux` - UI/UX design tasks
- `role: integration` - Integration and testing tasks

### Type Labels
- `type: feature` - New feature
- `type: bug` - Bug report
- `type: enhancement` - Improvement to existing feature
- `type: documentation` - Documentation updates
- `type: refactor` - Code refactoring

### Priority Labels
- `priority: critical` - 🔴 Critical issue, needs immediate attention
- `priority: high` - 🟠 High priority
- `priority: medium` - 🟡 Medium priority
- `priority: low` - 🟢 Low priority

### Status Labels
- `status: todo` - Not started
- `status: in-progress` - Currently being worked on
- `status: review` - Ready for review
- `status: blocked` - Blocked by dependencies
- `status: done` - Completed

### Component Labels
- `component: mobile` - Flutter mobile app
- `component: web` - Next.js web app
- `component: backend` - Backend services
- `component: api` - API related
- `component: database` - Database related

### Platform Labels
- `platform: flutter` - Flutter specific
- `platform: nextjs` - Next.js specific
- `platform: both` - Both platforms

---

## 📋 GitHub Projects Setup

### 1. Create Organization Project Board

1. Go to: `https://github.com/orgs/OnTime-SE-G/projects`
2. Click **"New project"**
3. Name it: **"OnTime Development Board"**
4. Choose **"Board"** layout
5. Add columns:
   - 📋 **Backlog** - All new tasks
   - 🎯 **To Do** - Ready to start
   - 🔄 **In Progress** - Currently working
   - 👀 **Review** - Awaiting review
   - ✅ **Done** - Completed

### 2. Link Repositories

- Add `ontime-web` repository to the project
- Add other repositories as they're created (backend, mobile app repo if separate)

### 3. Automation Rules

Set up automation in project settings:

**When issue is opened:**
- Add to project → Backlog column

**When issue is assigned:**
- Move to → To Do column
- Add `status: todo` label

**When PR is opened:**
- Move linked issues to → Review column
- Add `status: review` label

**When PR is merged:**
- Move linked issues to → Done column
- Add `status: done` label
- Close linked issues

---

## 🔄 Workflow

### 1. Creating Issues

**Use the appropriate template:**
- 🏗️ Frontend Lead Task
- 🗺️ Map & Live Tracking Task
- ⚡ Real-Time Communication Task
- 🎨 UI/UX & Display Features Task
- 🔧 Integration & Advanced Features Task
- 🐛 Bug Report
- ✨ Feature Request

**Fill in all required fields:**
- Clear description
- Acceptance criteria
- Priority level
- Technical notes

### 2. Working on Issues

1. **Assign yourself** to the issue
2. Move to **"In Progress"** column
3. Create a **feature branch**: `git checkout -b feature/issue-number-description`
4. Make your changes and commit regularly
5. Update issue with progress comments

### 3. Code Review Process

1. Create **Pull Request** when ready
2. Link to related issue(s) using keywords:
   - `Closes #123`
   - `Fixes #456`
   - `Resolves #789`
3. Request review from relevant team members
4. Address review comments
5. Merge after approval

### 4. Branch Naming Convention

- **Feature:** `feature/123-add-mapbox-integration`
- **Bug fix:** `fix/456-socket-reconnection`
- **Enhancement:** `enhance/789-improve-eta-display`
- **Refactor:** `refactor/101-api-service-layer`

### 5. Commit Message Convention

```
<type>(<scope>): <subject>

<body>

Closes #<issue-number>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

**Example:**
```
feat(map): add bus marker animation

Implemented smooth bus movement animation using coordinate interpolation.
Animation runs at 60fps with linear interpolation between updates.

Closes #123
```

---

## 📊 Sprint Planning

### Sprint Cycle: 2 weeks

**Sprint Planning (Monday Week 1):**
- Review backlog
- Assign priorities
- Distribute tasks based on team roles
- Set sprint goals

**Daily Standups (Every day):**
- What did you do yesterday?
- What will you do today?
- Any blockers?

**Mid-Sprint Check (Friday Week 1):**
- Progress review
- Adjust priorities if needed

**Sprint Review (Friday Week 2):**
- Demo completed features
- Review what was accomplished

**Sprint Retrospective (Friday Week 2):**
- What went well?
- What could be improved?
- Action items for next sprint

---

## 🎯 Milestones

### Milestone 1: Foundation (Weeks 1-2)
- Project setup (Flutter & Next.js)
- Basic navigation and routing
- Initial layout structure
- API service layer

### Milestone 2: Core Features (Weeks 3-4)
- Mapbox integration
- Basic bus location display
- Socket.IO connection
- Basic UI components

### Milestone 3: Real-Time Features (Weeks 5-6)
- Live bus tracking
- Real-time updates
- Route visualization
- Bus animation

### Milestone 4: User Experience (Weeks 7-8)
- ETA display system
- Complete UI components
- Responsive design
- Loading states and transitions

### Milestone 5: Integration & Testing (Weeks 9-10)
- Notification system
- User authentication
- System integration
- Testing and bug fixes

### Milestone 6: Optimization & Launch (Weeks 11-12)
- Performance optimization
- Final testing
- Documentation
- Deployment

---

## 🔗 Quick Links

- **Organization:** https://github.com/OnTime-SE-G
- **Repository:** https://github.com/OnTime-SE-G/ontime-web
- **Project Board:** https://github.com/orgs/OnTime-SE-G/projects
- **Issues:** https://github.com/OnTime-SE-G/ontime-web/issues
- **Wiki:** https://github.com/OnTime-SE-G/ontime-web/wiki

---

## 📞 Communication

- **Issues:** For task tracking and technical discussions
- **Pull Requests:** For code reviews
- **Discussions:** For general questions and ideas
- **Comments:** For updates on specific issues/PRs

---

## ✅ Best Practices

1. **Always create an issue before starting work**
2. **Link PRs to issues**
3. **Keep issues updated with progress**
4. **Use proper labels**
5. **Write clear commit messages**
6. **Request reviews from relevant team members**
7. **Test before submitting PR**
8. **Document your code**
9. **Keep PRs small and focused**
10. **Communicate blockers early**

---

## 🆘 Getting Help

If you're stuck:
1. Check existing issues and documentation
2. Ask in the issue comments
3. Start a discussion
4. Tag relevant team members
5. Mention blockers in daily standup

---

*Last updated: April 27, 2026*
