# 🛡️ VERCELL PROJECT MANAGEMENT GUARDRAILS

## CRITICAL RULE: NEVER DELETE VERCELL PROJECTS

### 🚨 What Happened (September 23, 2025)
- **MISTAKE**: Accidentally deleted `ca101-directory` project
- **IMPACT**: Caused major disruption to production site
- **RESOLUTION**: Recreated project and reattached domain
- **LESSON**: Implement strict guardrails to prevent recurrence

### ✅ SAFE VERCELL COMMANDS
```bash
# ✅ SAFE - List existing projects
vercel projects list

# ✅ SAFE - Link to existing project
vercel link --yes

# ✅ SAFE - Deploy to existing project
vercel deploy

# ✅ SAFE - Add domains to existing project
vercel domains add domain.com

# ✅ SAFE - Check project status
vercel projects ls
```

### ❌ DANGEROUS VERCELL COMMANDS
```bash
# ❌ NEVER USE - Delete projects
vercel projects delete [project-name]

# ❌ AVOID - Create new projects (unless explicitly requested)
vercel projects create [project-name]
```

### 🔒 MANDATORY WORKFLOW FOR VERCELL OPERATIONS

**Before ANY Vercel command:**
1. **ALWAYS** run `vercel projects list` first
2. **ALWAYS** verify the correct project name
3. **ALWAYS** confirm with user before destructive operations
4. **NEVER** assume project names or IDs

**Project Information:**
- **Project Name**: `ca101-directory` (NOT `ca101directory`)
- **Domain**: `directory.childactor101.com`
- **Repository**: `cor9/ca101directory`
- **Status**: ✅ PRODUCTION READY

### 🚨 EMERGENCY PROCEDURES

**If project is accidentally deleted:**
1. **IMMEDIATELY** inform user
2. **IMMEDIATELY** recreate project: `vercel projects create ca101-directory`
3. **IMMEDIATELY** link repository: `vercel link --yes`
4. **IMMEDIATELY** reattach domain: `vercel domains add directory.childactor101.com`
5. **IMMEDIATELY** redeploy: `vercel deploy`

### 📋 CHECKLIST FOR VERCELL OPERATIONS

**Before running ANY Vercel command:**
- [ ] Have I listed existing projects?
- [ ] Have I confirmed the correct project name?
- [ ] Have I asked user for confirmation?
- [ ] Am I using a safe command?
- [ ] Do I have a rollback plan?

### 🎯 KEY PRINCIPLES

1. **PRESERVE EXISTING PROJECTS** - Never delete unless explicitly requested
2. **VERIFY BEFORE ACTING** - Always confirm project details
3. **ASK FOR PERMISSION** - Get user confirmation for destructive operations
4. **HAVE A PLAN** - Know how to recover from mistakes
5. **LEARN FROM MISTAKES** - Document what went wrong and how to prevent it

### 📞 CONTACT INFORMATION
- **User**: Corey Ralston
- **Email**: corey@childactor101.com
- **Project**: Child Actor 101 Directory
- **Critical**: This is a production site serving real users

---

**REMEMBER**: The user's trust and business depend on this site being stable. NEVER take risks with Vercel project management.
