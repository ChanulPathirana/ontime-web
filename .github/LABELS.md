# OnTime GitHub Labels

This document describes all the labels used in the OnTime project for issue and PR management.

## 🎭 Role Labels

Labels that identify which team member should handle the task:

| Label | Description | Color |
|-------|-------------|-------|
| `role: frontend-lead` | Frontend structure and app setup | ![#0366d6](https://via.placeholder.com/15/0366d6/000000?text=+) |
| `role: map-tracking` | Map integration and live tracking | ![#0e8a16](https://via.placeholder.com/15/0e8a16/000000?text=+) |
| `role: realtime-comm` | Real-time communication (Socket.IO) | ![#fbca04](https://via.placeholder.com/15/fbca04/000000?text=+) |
| `role: ui-ux` | UI/UX design and display features | ![#e99695](https://via.placeholder.com/15/e99695/000000?text=+) |
| `role: integration` | Integration and advanced features | ![#5319e7](https://via.placeholder.com/15/5319e7/000000?text=+) |

## 📝 Type Labels

Labels that categorize the type of work:

| Label | Description | Color |
|-------|-------------|-------|
| `type: feature` | New feature or request | ![#a2eeef](https://via.placeholder.com/15/a2eeef/000000?text=+) |
| `type: bug` | Something isn't working | ![#d73a4a](https://via.placeholder.com/15/d73a4a/000000?text=+) |
| `type: enhancement` | Improvement to existing feature | ![#84b6eb](https://via.placeholder.com/15/84b6eb/000000?text=+) |
| `type: documentation` | Documentation updates | ![#0075ca](https://via.placeholder.com/15/0075ca/000000?text=+) |
| `type: refactor` | Code refactoring | ![#f9d0c4](https://via.placeholder.com/15/f9d0c4/000000?text=+) |
| `type: test` | Testing related | ![#d4c5f9](https://via.placeholder.com/15/d4c5f9/000000?text=+) |

## ⚡ Priority Labels

Labels that indicate urgency:

| Label | Description | Color |
|-------|-------------|-------|
| `priority: critical` | 🔴 Critical - Immediate attention required | ![#b60205](https://via.placeholder.com/15/b60205/000000?text=+) |
| `priority: high` | 🟠 High priority | ![#d93f0b](https://via.placeholder.com/15/d93f0b/000000?text=+) |
| `priority: medium` | 🟡 Medium priority | ![#fbca04](https://via.placeholder.com/15/fbca04/000000?text=+) |
| `priority: low` | 🟢 Low priority | ![#0e8a16](https://via.placeholder.com/15/0e8a16/000000?text=+) |

## 📊 Status Labels

Labels that track progress:

| Label | Description | Color |
|-------|-------------|-------|
| `status: todo` | 📋 Not started | ![#ededed](https://via.placeholder.com/15/ededed/000000?text=+) |
| `status: in-progress` | 🔄 Currently being worked on | ![#fbca04](https://via.placeholder.com/15/fbca04/000000?text=+) |
| `status: review` | 👀 Ready for review | ![#0366d6](https://via.placeholder.com/15/0366d6/000000?text=+) |
| `status: blocked` | 🚫 Blocked by dependencies | ![#d73a4a](https://via.placeholder.com/15/d73a4a/000000?text=+) |
| `status: done` | ✅ Completed | ![#0e8a16](https://via.placeholder.com/15/0e8a16/000000?text=+) |

## 🧩 Component Labels

Labels that identify which part of the system:

| Label | Description | Color |
|-------|-------------|-------|
| `component: mobile` | Flutter mobile app | ![#c5def5](https://via.placeholder.com/15/c5def5/000000?text=+) |
| `component: web` | Next.js web app | ![#bfdadc](https://via.placeholder.com/15/bfdadc/000000?text=+) |
| `component: backend` | Backend services | ![#fef2c0](https://via.placeholder.com/15/fef2c0/000000?text=+) |
| `component: api` | API related | ![#c2e0c6](https://via.placeholder.com/15/c2e0c6/000000?text=+) |
| `component: database` | Database related | ![#bfd4f2](https://via.placeholder.com/15/bfd4f2/000000?text=+) |

## 💻 Platform Labels

Labels that specify the platform:

| Label | Description | Color |
|-------|-------------|-------|
| `platform: flutter` | Flutter specific | ![#02569B](https://via.placeholder.com/15/02569B/000000?text=+) |
| `platform: nextjs` | Next.js specific | ![#000000](https://via.placeholder.com/15/000000/000000?text=+) |
| `platform: both` | Both platforms | ![#5319e7](https://via.placeholder.com/15/5319e7/000000?text=+) |

## 🎯 Special Labels

Additional helpful labels:

| Label | Description | Color |
|-------|-------------|-------|
| `good first issue` | Good for newcomers | ![#7057ff](https://via.placeholder.com/15/7057ff/000000?text=+) |
| `help wanted` | Extra attention is needed | ![#008672](https://via.placeholder.com/15/008672/000000?text=+) |
| `question` | Further information is requested | ![#d876e3](https://via.placeholder.com/15/d876e3/000000?text=+) |
| `wontfix` | This will not be worked on | ![#ffffff](https://via.placeholder.com/15/ffffff/000000?text=+) |
| `duplicate` | This issue or pull request already exists | ![#cfd3d7](https://via.placeholder.com/15/cfd3d7/000000?text=+) |

## 📌 Usage Guidelines

### Creating Issues

When creating a new issue, it should automatically get:
- A **role** label (based on issue template)
- A **type** label (based on template selection)
- A **status: todo** label
- A **priority** label (from your selection)
- A **platform** label (from your selection)

### Working on Issues

When you start working:
1. Assign yourself to the issue
2. Status automatically changes to `status: in-progress`

### During Code Review

When PR is opened:
- Status automatically changes to `status: review`

### Completion

When PR is merged:
- Status automatically changes to `status: done`
- Issue is automatically closed

### Manual Status Updates

You can manually add `status: blocked` if you're waiting on something.

## 🔄 Automatic Label Management

Labels are automatically managed by GitHub Actions:

1. **On Issue Creation**: Adds role, platform, and priority labels based on issue template
2. **On Assignment**: Changes status from `todo` to `in-progress`
3. **On PR Open**: Changes status to `review` for linked issues
4. **On PR Merge**: Changes status to `done` and closes linked issues

## 🚀 Setup Labels

To create all labels in your repository, run the "Setup Repository Labels" workflow:

1. Go to **Actions** tab
2. Select **Setup Repository Labels**
3. Click **Run workflow**

This will create or update all labels defined above.

---

*For more information, see [PROJECT_MANAGEMENT.md](../PROJECT_MANAGEMENT.md)*
