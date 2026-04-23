const now = Date.now();
const hours = (value) => new Date(now + value * 60 * 60 * 1000).toISOString();

export const seedData = {
  departments: [
    {
      id: "dept-ops",
      name: "Operations",
      description: "Store operations, facilities, and daily business requests.",
      headId: "emp-olivia",
      slaHours: 24,
      createdAt: hours(-220),
      updatedAt: hours(-220)
    },
    {
      id: "dept-it",
      name: "IT Support",
      description: "Hardware, software, network, and access management.",
      headId: "emp-ishaan",
      slaHours: 8,
      createdAt: hours(-220),
      updatedAt: hours(-220)
    },
    {
      id: "dept-finance",
      name: "Finance",
      description: "Expense, invoice, payroll, and purchase approvals.",
      headId: "emp-farah",
      slaHours: 16,
      createdAt: hours(-220),
      updatedAt: hours(-220)
    },
    {
      id: "dept-hr",
      name: "People",
      description: "HR operations, onboarding, policies, and employee services.",
      headId: "emp-harini",
      slaHours: 32,
      createdAt: hours(-220),
      updatedAt: hours(-220)
    }
  ],
  teams: [
    {
      id: "team-field",
      departmentId: "dept-ops",
      name: "Field Services",
      leaderId: "emp-rhea",
      createdAt: hours(-210),
      updatedAt: hours(-210)
    },
    {
      id: "team-procurement",
      departmentId: "dept-ops",
      name: "Procurement",
      leaderId: "emp-vikram",
      createdAt: hours(-210),
      updatedAt: hours(-210)
    },
    {
      id: "team-helpdesk",
      departmentId: "dept-it",
      name: "Helpdesk",
      leaderId: "emp-neel",
      createdAt: hours(-210),
      updatedAt: hours(-210)
    },
    {
      id: "team-infra",
      departmentId: "dept-it",
      name: "Infrastructure",
      leaderId: "emp-aisha",
      createdAt: hours(-210),
      updatedAt: hours(-210)
    },
    {
      id: "team-payables",
      departmentId: "dept-finance",
      name: "Accounts Payable",
      leaderId: "emp-rahul",
      createdAt: hours(-210),
      updatedAt: hours(-210)
    },
    {
      id: "team-people-ops",
      departmentId: "dept-hr",
      name: "People Operations",
      leaderId: "emp-mira",
      createdAt: hours(-210),
      updatedAt: hours(-210)
    }
  ],
  employees: [
    {
      id: "emp-super",
      name: "Sam Carter",
      email: "sam.carter@ticketly.local",
      role: "super_user",
      departmentId: "dept-ops",
      teamId: "team-field",
      active: true,
      createdAt: hours(-200),
      updatedAt: hours(-200)
    },
    {
      id: "emp-olivia",
      name: "Olivia Mendes",
      email: "olivia.mendes@ticketly.local",
      role: "department_head",
      departmentId: "dept-ops",
      teamId: "team-field",
      active: true,
      createdAt: hours(-200),
      updatedAt: hours(-200)
    },
    {
      id: "emp-ishaan",
      name: "Ishaan Rao",
      email: "ishaan.rao@ticketly.local",
      role: "department_head",
      departmentId: "dept-it",
      teamId: "team-helpdesk",
      active: true,
      createdAt: hours(-200),
      updatedAt: hours(-200)
    },
    {
      id: "emp-farah",
      name: "Farah Khan",
      email: "farah.khan@ticketly.local",
      role: "department_head",
      departmentId: "dept-finance",
      teamId: "team-payables",
      active: true,
      createdAt: hours(-200),
      updatedAt: hours(-200)
    },
    {
      id: "emp-harini",
      name: "Harini Iyer",
      email: "harini.iyer@ticketly.local",
      role: "department_head",
      departmentId: "dept-hr",
      teamId: "team-people-ops",
      active: true,
      createdAt: hours(-200),
      updatedAt: hours(-200)
    },
    {
      id: "emp-rhea",
      name: "Rhea Sharma",
      email: "rhea.sharma@ticketly.local",
      role: "team_leader",
      departmentId: "dept-ops",
      teamId: "team-field",
      active: true,
      createdAt: hours(-190),
      updatedAt: hours(-190)
    },
    {
      id: "emp-vikram",
      name: "Vikram Jain",
      email: "vikram.jain@ticketly.local",
      role: "team_leader",
      departmentId: "dept-ops",
      teamId: "team-procurement",
      active: true,
      createdAt: hours(-190),
      updatedAt: hours(-190)
    },
    {
      id: "emp-neel",
      name: "Neel Gupta",
      email: "neel.gupta@ticketly.local",
      role: "team_leader",
      departmentId: "dept-it",
      teamId: "team-helpdesk",
      active: true,
      createdAt: hours(-190),
      updatedAt: hours(-190)
    },
    {
      id: "emp-aisha",
      name: "Aisha Thomas",
      email: "aisha.thomas@ticketly.local",
      role: "team_leader",
      departmentId: "dept-it",
      teamId: "team-infra",
      active: true,
      createdAt: hours(-190),
      updatedAt: hours(-190)
    },
    {
      id: "emp-rahul",
      name: "Rahul Nair",
      email: "rahul.nair@ticketly.local",
      role: "team_leader",
      departmentId: "dept-finance",
      teamId: "team-payables",
      active: true,
      createdAt: hours(-190),
      updatedAt: hours(-190)
    },
    {
      id: "emp-mira",
      name: "Mira Bose",
      email: "mira.bose@ticketly.local",
      role: "team_leader",
      departmentId: "dept-hr",
      teamId: "team-people-ops",
      active: true,
      createdAt: hours(-190),
      updatedAt: hours(-190)
    },
    {
      id: "emp-kabir",
      name: "Kabir Sethi",
      email: "kabir.sethi@ticketly.local",
      role: "employee",
      departmentId: "dept-ops",
      teamId: "team-field",
      active: true,
      createdAt: hours(-180),
      updatedAt: hours(-180)
    },
    {
      id: "emp-lina",
      name: "Lina Joseph",
      email: "lina.joseph@ticketly.local",
      role: "employee",
      departmentId: "dept-it",
      teamId: "team-helpdesk",
      active: true,
      createdAt: hours(-180),
      updatedAt: hours(-180)
    },
    {
      id: "emp-zoya",
      name: "Zoya Merchant",
      email: "zoya.merchant@ticketly.local",
      role: "employee",
      departmentId: "dept-finance",
      teamId: "team-payables",
      active: true,
      createdAt: hours(-180),
      updatedAt: hours(-180)
    }
  ],
  tickets: [
    {
      id: "ticket-1001",
      title: "POS terminal not syncing sales after shift close",
      description:
        "The checkout terminal at Store 14 closes the shift locally, but sales are not visible in the central report.",
      status: "in_progress",
      priority: "high",
      departmentId: "dept-it",
      teamId: "team-helpdesk",
      createdById: "emp-kabir",
      assigneeId: "emp-lina",
      dueAt: hours(4),
      resolvedAt: null,
      transfers: [
        {
          id: "transfer-1001",
          fromDepartmentId: "dept-ops",
          fromTeamId: "team-field",
          toDepartmentId: "dept-it",
          toTeamId: "team-helpdesk",
          transferredById: "emp-rhea",
          reason: "Needs application support from IT.",
          createdAt: hours(-12)
        }
      ],
      history: [
        {
          id: "event-1001-open",
          type: "created",
          actorId: "emp-kabir",
          message: "Ticket created for Operations.",
          createdAt: hours(-14)
        },
        {
          id: "event-1001-transfer",
          type: "transferred",
          actorId: "emp-rhea",
          message: "Transferred from Operations to IT Support.",
          createdAt: hours(-12)
        }
      ],
      createdAt: hours(-14),
      updatedAt: hours(-2)
    },
    {
      id: "ticket-1002",
      title: "Vendor invoice needs urgent approval",
      description:
        "A logistics vendor is blocked because their March invoice is pending approval in the payment queue.",
      status: "pending",
      priority: "medium",
      departmentId: "dept-finance",
      teamId: "team-payables",
      createdById: "emp-vikram",
      assigneeId: "emp-zoya",
      dueAt: hours(10),
      resolvedAt: null,
      transfers: [],
      history: [
        {
          id: "event-1002-open",
          type: "created",
          actorId: "emp-vikram",
          message: "Ticket created for Finance.",
          createdAt: hours(-6)
        }
      ],
      createdAt: hours(-6),
      updatedAt: hours(-1)
    },
    {
      id: "ticket-1003",
      title: "New joiner laptop and access request",
      description:
        "People Ops needs laptop allocation and business application access before Monday onboarding.",
      status: "resolved",
      priority: "low",
      departmentId: "dept-it",
      teamId: "team-infra",
      createdById: "emp-mira",
      assigneeId: "emp-aisha",
      dueAt: hours(-8),
      resolvedAt: hours(-10),
      transfers: [],
      history: [
        {
          id: "event-1003-open",
          type: "created",
          actorId: "emp-mira",
          message: "Ticket created for IT Support.",
          createdAt: hours(-40)
        },
        {
          id: "event-1003-resolved",
          type: "status_changed",
          actorId: "emp-aisha",
          message: "Status changed to resolved.",
          createdAt: hours(-10)
        }
      ],
      createdAt: hours(-40),
      updatedAt: hours(-10)
    }
  ],
  messages: [
    {
      id: "msg-1001-1",
      ticketId: "ticket-1001",
      authorId: "emp-kabir",
      type: "user",
      body: "The last successful sync was yesterday evening.",
      attachmentIds: [],
      createdAt: hours(-13.5)
    },
    {
      id: "msg-1001-2",
      ticketId: "ticket-1001",
      authorId: "emp-rhea",
      type: "system",
      body: "Transferred from Operations to IT Support. Reason: Needs application support from IT.",
      attachmentIds: [],
      createdAt: hours(-12)
    },
    {
      id: "msg-1001-3",
      ticketId: "ticket-1001",
      authorId: "emp-lina",
      type: "user",
      body: "Checking the sync queue and terminal service logs now.",
      attachmentIds: [],
      createdAt: hours(-2)
    },
    {
      id: "msg-1002-1",
      ticketId: "ticket-1002",
      authorId: "emp-zoya",
      type: "user",
      body: "Please confirm if the receipt copy has the updated PO number.",
      attachmentIds: [],
      createdAt: hours(-1)
    },
    {
      id: "msg-1003-1",
      ticketId: "ticket-1003",
      authorId: "emp-aisha",
      type: "user",
      body: "Laptop assigned and access has been provisioned.",
      attachmentIds: [],
      createdAt: hours(-10)
    }
  ],
  attachments: []
};
