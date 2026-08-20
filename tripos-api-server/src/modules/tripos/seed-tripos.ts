import 'reflect-metadata';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { randomBytes, scryptSync } from 'node:crypto';
import { OrganizationSchema } from '../organizations/schemas/organization.schema';
import { CrmUserSchema } from '../auth/schemas/crm-user.schema';
import { LeadSchema } from '../leads/schemas/leads.schema';
import { CustomerSchema } from '../customers/schemas/customer.schema';
import { QuotationSchema } from '../quotations/schemas/quotation.schema';
import { ItinerarySchema } from '../itineraries/schemas/itinerary.schema';
import { BookingSchema } from '../bookings/schemas/booking.schema';
import { SupplierSchema } from '../suppliers/schemas/supplier.schema';
import { OperationTaskSchema } from '../operations/schemas/operation-task.schema';
import { B2BAgentSchema } from '../b2b-agents/schemas/b2b-agent.schema';
import { PaymentSchema } from '../payments/schemas/payment.schema';
import { InvoiceSchema } from '../finance/schemas/invoice.schema';
import { DestinationSchema } from '../destinations/schemas/destination.schema';
import { TourPackageSchema } from '../tour-packages/schemas/tour-package.schema';
import { TravelDocumentSchema } from '../travel-documents/schemas/travel-document.schema';
import { VoucherSchema } from '../vouchers/schemas/voucher.schema';
import { SupportTicketSchema } from '../support-tickets/schemas/support-ticket.schema';
import { CampaignSchema } from '../campaigns/schemas/campaign.schema';
import { StoredFileSchema } from '../storage/schemas/stored-file.schema';
import { SavedReportSchema } from '../reporting/schemas/saved-report.schema';
import { AuditLogSchema } from '../audit/schemas/audit-log.schema';
import { SettingSchema } from '../settings/schemas/setting.schema';
import { TagSchema } from '../tags/schemas/tag.schema';
import { TaskSchema } from '../tasks/schemas/task.schema';
import { PricingPlanSchema } from '../subscriptions/schemas/pricing-plan.schema';
import { SubscriptionSchema } from '../subscriptions/schemas/subscription.schema';
import { WorkflowRuleSchema } from '../workflows/schemas/workflow-rule.schema';
import { CommunicationSchema } from '../communications/schemas/communication.schema';
import { FeatureFlagSchema } from '../feature-flags/schemas/feature-flag.schema';
import { ImportExportJobSchema } from '../imports-exports/schemas/import-export-job.schema';
import { OperatingRecordSchema } from '../operating-records/schemas/operating-record.schema';
import {
  BranchSchema,
  DepartmentSchema,
  PermissionSchema,
  RolePermissionSchema,
  RoleSchema,
  TeamSchema,
  UserRoleSchema,
} from '../identity/schemas/identity.schema';

config({ path: '.env.local' });
config({ path: '.env.development' });
config();

const BRANCH_ID = 'delhi';

async function main() {
  const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/tripos';
  await mongoose.connect(uri);

  const Organization = model('Organization', OrganizationSchema);
  const CrmUser = model('CrmUser', CrmUserSchema);
  const Lead = model('Lead', LeadSchema);
  const Customer = model('Customer', CustomerSchema);
  const Quotation = model('Quotation', QuotationSchema);
  const Itinerary = model('Itinerary', ItinerarySchema);
  const Booking = model('Booking', BookingSchema);
  const Supplier = model('Supplier', SupplierSchema);
  const OperationTask = model('OperationTask', OperationTaskSchema);
  const B2BAgent = model('B2BAgent', B2BAgentSchema);
  const Payment = model('Payment', PaymentSchema);
  const Invoice = model('Invoice', InvoiceSchema);
  const Destination = model('Destination', DestinationSchema);
  const TourPackage = model('TourPackage', TourPackageSchema);
  const TravelDocument = model('TravelDocument', TravelDocumentSchema);
  const Voucher = model('Voucher', VoucherSchema);
  const SupportTicket = model('SupportTicket', SupportTicketSchema);
  const Campaign = model('Campaign', CampaignSchema);
  const StoredFile = model('StoredFile', StoredFileSchema);
  const SavedReport = model('SavedReport', SavedReportSchema);
  const AuditLog = model('AuditLog', AuditLogSchema);
  const Setting = model('Setting', SettingSchema);
  const Tag = model('Tag', TagSchema);
  const Task = model('Task', TaskSchema);
  const PricingPlan = model('PricingPlan', PricingPlanSchema);
  const Subscription = model('Subscription', SubscriptionSchema);
  const WorkflowRule = model('WorkflowRule', WorkflowRuleSchema);
  const Communication = model('Communication', CommunicationSchema);
  const FeatureFlag = model('FeatureFlag', FeatureFlagSchema);
  const ImportExportJob = model('ImportExportJob', ImportExportJobSchema);
  const OperatingRecord = model('OperatingRecord', OperatingRecordSchema);
  const Branch = model('Branch', BranchSchema);
  const Department = model('Department', DepartmentSchema);
  const Team = model('Team', TeamSchema);
  const Role = model('Role', RoleSchema);
  const Permission = model('Permission', PermissionSchema);
  const UserRole = model('UserRole', UserRoleSchema);
  const RolePermission = model('RolePermission', RolePermissionSchema);

  const organization = await Organization.findOneAndUpdate(
    { code: 'WEBNZA' },
    {
      name: 'Webnza Travels Demo',
      code: 'WEBNZA',
      dataHostingMode: 'tripos_cloud',
      branches: [
        { id: 'delhi', name: 'Delhi HQ', city: 'Delhi' },
        { id: 'dubai', name: 'Dubai Desk', city: 'Dubai' },
        { id: 'jaipur', name: 'Jaipur Sales', city: 'Jaipur' },
      ],
      syncPolicy: {
        syncMode: 'realtime',
        offlineWindowHours: 24,
        customerManagedStorage: false,
      },
      status: 'active',
    },
    { returnDocument: 'after', upsert: true },
  ).exec();

  const organizationId = String(organization._id);
  await upsertMany(Organization, 'code', [
    {
      name: 'TripOS Demo Company',
      code: 'TRIPOS',
      dataHostingMode: 'tripos_cloud',
      branches: [
        { id: 'main', name: 'Main Office', city: 'Bengaluru' },
        { id: 'remote', name: 'Remote Desk', city: 'Remote' },
      ],
      syncPolicy: {
        syncMode: 'realtime',
        offlineWindowHours: 24,
        customerManagedStorage: false,
      },
      status: 'active',
    },
    {
      name: 'DMC Operations',
      code: 'DMC',
      dataHostingMode: 'hybrid_sync',
      branches: [
        { id: 'dubai', name: 'Dubai Operations', city: 'Dubai' },
        { id: 'singapore', name: 'Singapore Desk', city: 'Singapore' },
      ],
      syncPolicy: {
        syncMode: 'scheduled',
        offlineWindowHours: 48,
        customerManagedStorage: true,
      },
      status: 'active',
    },
  ]);
  const switchableOrganizations = await Organization.find({
    code: { $in: ['TRIPOS', 'DMC'] },
  })
    .lean()
    .exec();
  await upsertMany(
    Branch,
    'code',
    switchableOrganizations.flatMap((item) =>
      normalizeSeedBranches(String(item._id), item.branches),
    ),
  );
  await upsertMany(PricingPlan, 'code', [
    {
      code: 'starter',
      name: 'Starter CRM',
      description:
        'Core TripOS CRM for small travel teams starting operations.',
      audience: 'b2b_crm',
      billingCycle: 'monthly',
      currencyCode: 'INR',
      priceMinor: 999900,
      setupFeeMinor: 0,
      trialDays: 14,
      minSeats: 3,
      includedSeats: 5,
      extraSeatPriceMinor: 49900,
      features: [
        'Lead CRM',
        'Quotations',
        'Bookings',
        'Operations',
        'Invoices',
      ],
      limits: { branches: 1, crmUsers: 5, monthlyBookings: 200 },
      status: 'active',
    },
    {
      code: 'growth',
      name: 'Growth Suite',
      description: 'Multi-branch CRM with B2B agents, suppliers, and finance.',
      audience: 'enterprise',
      billingCycle: 'monthly',
      currencyCode: 'INR',
      priceMinor: 2499900,
      setupFeeMinor: 2500000,
      trialDays: 14,
      minSeats: 8,
      includedSeats: 15,
      extraSeatPriceMinor: 79900,
      features: [
        'Multi-branch',
        'B2B Agents',
        'Supplier Payables',
        'Advanced Reports',
        'Sandbox Integrations',
      ],
      limits: { branches: 5, crmUsers: 15, monthlyBookings: 1000 },
      status: 'active',
    },
    {
      code: 'enterprise',
      name: 'Enterprise OS',
      description: 'Private deployment, hybrid sync, SLA support, and add-ons.',
      audience: 'enterprise',
      billingCycle: 'yearly',
      currencyCode: 'INR',
      priceMinor: 49999000,
      setupFeeMinor: 7500000,
      trialDays: 0,
      minSeats: 25,
      includedSeats: 50,
      extraSeatPriceMinor: 59900,
      features: [
        'Hybrid Sync',
        'Custom Branding',
        'Dedicated Account Manager',
        'SLA Support',
        'Data Residency',
      ],
      limits: { branches: 25, crmUsers: 50, monthlyBookings: 10000 },
      status: 'active',
    },
  ]);

  await upsertMany(Subscription, 'planCode', [
    {
      organizationId,
      branchId: BRANCH_ID,
      planCode: 'growth',
      planName: 'Growth Suite',
      audience: 'enterprise',
      billingCycle: 'monthly',
      currencyCode: 'INR',
      amountMinor: 2499900,
      setupFeeMinor: 2500000,
      seats: 15,
      trialDays: 14,
      startsAt: new Date(),
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentProvider: 'sandbox',
      checkoutReference: 'seed_growth_subscription',
      billingProfile: {
        legalName: 'Webnza Travels Demo',
        billingEmail: 'billing@webnza.test',
        countryCode: 'IN',
        taxId: 'GSTIN-DEMO-0001',
      },
      limitsSnapshot: { branches: 5, crmUsers: 15, monthlyBookings: 1000 },
      featuresSnapshot: [
        'Multi-branch',
        'B2B Agents',
        'Supplier Payables',
        'Advanced Reports',
      ],
      status: 'trialing',
    },
  ]);

  await seedCrmUsers(CrmUser, organizationId);

  const seededUsers = await CrmUser.find({ organizationId }).lean().exec();
  const usersByRole = new Map(
    seededUsers.map((user) => [String(user.role), user]),
  );
  const adminUser = usersByRole.get('organization_admin');

  await upsertMany(Branch, 'code', [
    {
      organizationId,
      name: 'Delhi HQ',
      code: 'delhi',
      city: 'Delhi',
      country: 'India',
      timezone: 'Asia/Kolkata',
      phone: '+911140001111',
      email: 'delhi@webnza.test',
      status: 'active',
    },
    {
      organizationId,
      name: 'Dubai Desk',
      code: 'dubai',
      city: 'Dubai',
      country: 'UAE',
      timezone: 'Asia/Dubai',
      phone: '+97140001111',
      email: 'dubai@webnza.test',
      status: 'active',
    },
    {
      organizationId,
      name: 'Jaipur Sales',
      code: 'jaipur',
      city: 'Jaipur',
      country: 'India',
      timezone: 'Asia/Kolkata',
      phone: '+911414001111',
      email: 'jaipur@webnza.test',
      status: 'active',
    },
  ]);

  await upsertMany(Department, 'code', [
    {
      organizationId,
      branchId: 'delhi',
      name: 'Sales',
      code: 'sales',
      status: 'active',
    },
    {
      organizationId,
      branchId: 'delhi',
      name: 'Operations',
      code: 'operations',
      status: 'active',
    },
    {
      organizationId,
      branchId: 'delhi',
      name: 'Finance',
      code: 'finance',
      status: 'active',
    },
  ]);

  await upsertMany(Team, 'code', [
    {
      organizationId,
      branchId: 'delhi',
      departmentId: 'sales',
      name: 'B2C Sales',
      code: 'b2c-sales',
      memberUserIds: adminUser ? [String(adminUser._id)] : [],
      status: 'active',
    },
    {
      organizationId,
      branchId: 'delhi',
      departmentId: 'operations',
      name: 'DMC Operations',
      code: 'dmc-ops',
      memberUserIds: adminUser ? [String(adminUser._id)] : [],
      status: 'active',
    },
  ]);

  const permissionModules = [
    'leads',
    'customers',
    'quotations',
    'itineraries',
    'bookings',
    'suppliers',
    'operations',
    'b2b-agents',
    'payments',
    'finance',
    'documents',
    'campaigns',
    'support',
    'audit',
    'reports',
    'settings',
    'billing',
    'tasks',
    'tags',
    'batch-jobs',
    'identity',
  ];
  const permissionActions = [
    'read',
    'create',
    'update',
    'delete',
    'approve',
    'export',
  ];
  await upsertMany(
    Permission,
    'code',
    permissionModules.flatMap((moduleName) =>
      permissionActions.map((action) => ({
        module: moduleName,
        action,
        code: `${moduleName}:${action}`,
        label: `${titleCase(moduleName)} ${titleCase(action)}`,
        status: 'active',
      })),
    ),
  );

  await upsertMany(Role, 'code', [
    {
      organizationId,
      name: 'Organization Admin',
      code: 'organization_admin',
      roleType: 'system',
      defaultBranchIds: ['delhi', 'dubai', 'jaipur'],
      status: 'active',
    },
    {
      organizationId,
      name: 'Branch Manager',
      code: 'branch_manager',
      roleType: 'system',
      defaultBranchIds: ['delhi'],
      status: 'active',
    },
    {
      organizationId,
      name: 'Sales Consultant',
      code: 'sales',
      roleType: 'system',
      defaultBranchIds: ['delhi'],
      status: 'active',
    },
    {
      organizationId,
      name: 'Operations Executive',
      code: 'operations',
      roleType: 'system',
      defaultBranchIds: ['delhi'],
      status: 'active',
    },
    {
      organizationId,
      name: 'Finance Executive',
      code: 'finance',
      roleType: 'system',
      defaultBranchIds: ['delhi'],
      status: 'active',
    },
  ]);

  const seededRoles = await Role.find({ organizationId }).lean().exec();
  await seedRoleAssignments(UserRole, organizationId, seededUsers, seededRoles);
  await seedRolePermissionGrants(RolePermission, organizationId, seededRoles);

  await upsertMany(Lead, 'phone', [
    {
      organizationId,
      branchId: BRANCH_ID,
      customerName: 'Sharma Family',
      email: 'sharma.family@example.com',
      phone: '+919811110001',
      source: 'Website',
      channel: 'b2c',
      requirement: {
        destination: 'Dubai',
        travelDate: '2026-12-25',
        adults: 2,
        children: 1,
        budget: 'INR 1.5L',
        duration: '5N/6D',
      },
      assignedTo: 'Ritika',
      stage: 'quotation_sent',
      temperature: 'hot',
      score: 86,
      tags: ['family', 'dubai', 'december'],
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      customerName: 'Mehta Corporate Group',
      email: 'traveldesk@mehtagroup.test',
      phone: '+919811110002',
      source: 'B2B Agent',
      channel: 'corporate',
      requirement: {
        destination: 'Singapore',
        travelDate: '2026-11-18',
        adults: 14,
        children: 0,
        budget: 'INR 9L',
        duration: '4N/5D',
      },
      assignedTo: 'Aman',
      stage: 'negotiation',
      temperature: 'hot',
      score: 78,
      tags: ['corporate', 'singapore'],
    },
  ]);

  await upsertMany(Customer, 'phone', [
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Rohit Sharma',
      phone: '+919811110001',
      email: 'sharma.family@example.com',
      customerType: 'family',
      source: 'Website',
      city: 'Delhi',
      country: 'India',
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Mehta Corporate Travel Desk',
      phone: '+919811110002',
      email: 'traveldesk@mehtagroup.test',
      customerType: 'corporate',
      source: 'B2B Agent',
      city: 'Gurugram',
      country: 'India',
      status: 'active',
    },
  ]);

  await upsertMany(Quotation, 'customerName', [
    {
      organizationId,
      branchId: BRANCH_ID,
      customerName: 'Sharma Family',
      destination: 'Dubai',
      travelDates: '25 Dec - 30 Dec 2026',
      travellers: 3,
      services: [{ type: 'hotel' }, { type: 'transfer' }, { type: 'activity' }],
      pricing: {
        baseCost: 104000,
        markup: 28000,
        discount: 2500,
        total: 129500,
      },
      status: 'sent',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      customerName: 'Mehta Corporate Group',
      destination: 'Singapore',
      travelDates: '18 Nov - 22 Nov 2026',
      travellers: 14,
      services: [{ type: 'hotel' }, { type: 'conference-transfer' }],
      pricing: {
        baseCost: 720000,
        markup: 164000,
        discount: 20000,
        total: 864000,
      },
      status: 'negotiation',
    },
  ]);

  await upsertMany(Itinerary, 'title', [
    {
      organizationId,
      branchId: BRANCH_ID,
      title: 'Dubai Family 5N',
      destination: 'Dubai',
      durationDays: 6,
      theme: 'Family Luxury',
      days: [{ day: 1, title: 'Arrival and Marina Dhow' }],
      status: 'ready',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      title: 'Singapore Corporate 4N',
      destination: 'Singapore',
      durationDays: 5,
      theme: 'MICE',
      days: [{ day: 1, title: 'Arrival and check-in' }],
      status: 'ready',
    },
  ]);

  await upsertMany(Booking, 'customerName', [
    {
      organizationId,
      branchId: BRANCH_ID,
      customerName: 'Sharma Family',
      destination: 'Dubai',
      travelDates: '25 Dec - 30 Dec 2026',
      passengers: [
        { name: 'Rohit Sharma' },
        { name: 'Neha Sharma' },
        { name: 'Aarav Sharma' },
      ],
      services: [
        { type: 'hotel', status: 'confirmed' },
        { type: 'transfer', status: 'assigned' },
      ],
      documents: [],
      paymentSchedule: [{ label: 'Advance', amount: 65000, status: 'paid' }],
      vouchers: [
        {
          supplierName: 'DXB Prime Cars',
          serviceType: 'transfer',
          status: 'issued',
        },
      ],
      status: 'confirmed',
    },
  ]);

  await upsertMany(Supplier, 'name', [
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'DXB Prime Cars',
      type: 'Transporter',
      destination: 'Dubai',
      contacts: [{ name: 'Omar', phone: '+971500000001' }],
      contracts: [{ title: 'Dubai 2026 Transfer Contract', status: 'active' }],
      rates: [
        { serviceName: 'Airport sedan', netRate: 220, currencyCode: 'AED' },
      ],
      confirmations: [
        {
          bookingId: 'BKG-SHARMA-DXB',
          serviceType: 'transfer',
          status: 'confirmed',
        },
      ],
      creditLimit: 250000,
      payable: 42000,
      rating: 4.7,
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Marina Bay Stay',
      type: 'Hotel',
      destination: 'Singapore',
      contacts: [{ name: 'Lina', email: 'sales@marinabaystay.test' }],
      contracts: [{ title: 'Singapore Group FIT 2026', status: 'active' }],
      rates: [
        { serviceName: 'Deluxe room', netRate: 160, currencyCode: 'SGD' },
      ],
      confirmations: [],
      creditLimit: 500000,
      payable: 0,
      rating: 4.5,
      status: 'active',
    },
  ]);

  await upsertMany(OperationTask, 'title', [
    {
      organizationId,
      branchId: BRANCH_ID,
      bookingId: 'BKG-SHARMA-DXB',
      title: 'Dubai airport pickup confirmation',
      serviceType: 'transfer',
      supplierId: 'DXB Prime Cars',
      assignedTo: 'Ops Team',
      dueAt: new Date('2026-12-24T10:00:00.000Z'),
      priority: 'high',
      slaStatus: 'on_track',
      payload: { priority: 'high' },
      timeline: [
        {
          type: 'created',
          note: 'Supplier assigned',
          at: new Date().toISOString(),
        },
      ],
      status: 'assigned',
    },
  ]);

  await upsertMany(B2BAgent, 'agencyName', [
    {
      organizationId,
      branchId: BRANCH_ID,
      agencyName: 'Skyline Travels',
      contactName: 'Karan Malhotra',
      email: 'karan@skylinetravels.test',
      phone: '+919811110099',
      market: 'Delhi NCR',
      creditLimit: 1000000,
      receivable: 76000,
      commissionEarned: 18500,
      kycDocuments: [{ documentType: 'GST', status: 'verified' }],
      walletLedger: [{ type: 'invoice', amount: 76000, currencyCode: 'INR' }],
      commissionLedger: [
        { bookingId: 'BKG-SHARMA-DXB', amount: 18500, currencyCode: 'INR' },
      ],
      invoices: [{ invoiceNo: 'AG-0001', amount: 76000, status: 'issued' }],
      status: 'active',
    },
  ]);

  await upsertMany(Payment, 'partyName', [
    {
      organizationId,
      branchId: BRANCH_ID,
      bookingId: 'BKG-SHARMA-DXB',
      type: 'receivable',
      amount: 129500,
      amountMinor: 12950000,
      currencyCode: 'INR',
      partyName: 'Sharma Family',
      dueDate: '2026-11-15',
      paidAt: '2026-10-01',
      status: 'partially_paid',
      metadata: { collected: 65000 },
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      bookingId: 'BKG-SHARMA-DXB',
      type: 'payable',
      amount: 42000,
      amountMinor: 4200000,
      currencyCode: 'INR',
      partyName: 'DXB Prime Cars',
      dueDate: '2026-12-20',
      status: 'pending',
      metadata: {},
    },
  ]);

  await Invoice.updateOne(
    { organizationId, invoiceSeries: 'TRV-', invoiceNo: '0001' },
    {
      $set: {
        organizationId,
        branchId: BRANCH_ID,
        invoiceSeries: 'TRV-',
        invoiceNo: '0001',
        invoiceDate: new Date().toISOString().slice(0, 10),
        countryCode: 'IN',
        currencyCode: 'INR',
        currencySymbol: 'INR',
        taxLabel: 'GST',
        taxRate: 18,
        provider: { companyName: 'Webnza Travels', taxNo: 'GSTIN-TRIPOS-DEMO' },
        customer: { companyName: 'Sharma Family' },
        entries: [
          {
            description: 'Dubai family package',
            qty: 1,
            qtyType: 'package',
            rate: 109746,
            total: 109746,
          },
        ],
        totals: { subtotal: 109746, taxAmount: 19754, totalPayable: 129500 },
        totalsMinor: {
          subtotalMinor: 10974600,
          taxAmountMinor: 1975400,
          taxBasisMinor: 10974600,
          totalPayableMinor: 12950000,
        },
        status: 'draft',
      },
    },
    { upsert: true },
  ).exec();

  await upsertMany(Destination, 'name', [
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Dubai',
      country: 'UAE',
      region: 'Middle East',
      bestSeason: 'Nov-Mar',
      highlights: ['Burj Khalifa', 'Desert Safari'],
      visaRequirement: 'Tourist visa required',
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Singapore',
      country: 'Singapore',
      region: 'Asia',
      bestSeason: 'Year-round',
      highlights: ['Sentosa', 'Marina Bay'],
      visaRequirement: 'Visa as per passport',
      status: 'active',
    },
  ]);

  await upsertMany(TourPackage, 'title', [
    {
      organizationId,
      branchId: BRANCH_ID,
      title: 'Dubai Family Delight',
      destination: 'Dubai',
      category: 'Family',
      durationDays: 6,
      basePrice: 129500,
      currency: 'INR',
      inclusions: ['Hotel', 'Transfers', 'Sightseeing'],
      status: 'active',
    },
  ]);

  await upsertMany(TravelDocument, 'documentNumber', [
    {
      organizationId,
      branchId: BRANCH_ID,
      customerName: 'Rohit Sharma',
      bookingId: 'BKG-SHARMA-DXB',
      documentType: 'Passport',
      documentNumber: 'Z1234567',
      expiryDate: '2031-09-01',
      fileUrl: '/storage/demo/passport.pdf',
      status: 'verified',
    },
  ]);

  await upsertMany(Voucher, 'confirmationNumber', [
    {
      organizationId,
      branchId: BRANCH_ID,
      bookingId: 'BKG-SHARMA-DXB',
      customerName: 'Sharma Family',
      voucherType: 'Transfer',
      supplierName: 'DXB Prime Cars',
      issueDate: '2026-12-20',
      confirmationNumber: 'DXB-TRF-8891',
      status: 'issued',
    },
  ]);

  await upsertMany(SupportTicket, 'subject', [
    {
      organizationId,
      branchId: BRANCH_ID,
      subject: 'Wheelchair assistance request',
      customerName: 'Sharma Family',
      bookingId: 'BKG-SHARMA-DXB',
      channel: 'WhatsApp',
      priority: 'medium',
      description: 'Arrange airport assistance for senior traveller.',
      status: 'open',
    },
  ]);

  await upsertMany(Campaign, 'name', [
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Dubai December Campaign',
      channel: 'Google Ads',
      source: 'google',
      spend: 42000,
      leads: 100,
      quotations: 28,
      bookings: 7,
      revenue: 906500,
      status: 'active',
    },
  ]);

  await upsertMany(Setting, 'key', [
    {
      organizationId,
      branchId: BRANCH_ID,
      key: 'default_currency',
      label: 'Default Currency',
      category: 'finance',
      value: { currencyCode: 'INR' },
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      key: 'quotation_validity_days',
      label: 'Quotation Validity Days',
      category: 'sales',
      value: { days: 7 },
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      key: 'operations_sla_hours',
      label: 'Operations SLA Hours',
      category: 'operations',
      value: { high: 4, medium: 12, low: 24 },
      status: 'active',
    },
  ]);

  await upsertMany(FeatureFlag, 'key', [
    {
      organizationId,
      branchId: BRANCH_ID,
      key: 'b2c_mobile_vouchers',
      label: 'B2C Mobile Vouchers',
      category: 'mobile',
      enabled: true,
      rollout: { percentage: 100 },
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      key: 'agent_credit_approval',
      label: 'Agent Credit Approval',
      category: 'b2b',
      enabled: true,
      rollout: { roles: ['organization_admin', 'finance'] },
      status: 'active',
    },
  ]);

  await upsertMany(WorkflowRule, 'code', [
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Quotation Expiry Follow Up',
      code: 'quotation-expiry-follow-up',
      module: 'quotations',
      trigger: 'quotation_expiring',
      conditions: { daysBeforeExpiry: 1, status: ['sent'] },
      actions: [
        { type: 'create_task', owner: 'sales', priority: 'high' },
        { type: 'send_whatsapp', templateCode: 'quotation_expiry_reminder' },
      ],
      priority: 20,
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Supplier SLA Escalation',
      code: 'supplier-sla-escalation',
      module: 'operations',
      trigger: 'task_overdue',
      conditions: { slaStatus: 'breached' },
      actions: [{ type: 'notify_role', role: 'operations' }],
      priority: 10,
      status: 'active',
    },
  ]);

  await upsertMany(Communication, 'providerMessageId', [
    {
      organizationId,
      branchId: BRANCH_ID,
      channel: 'whatsapp',
      category: 'transactional',
      entityType: 'booking',
      entityId: 'BK-DXB-001',
      recipient: '+919811110001',
      recipientName: 'Rohit Sharma',
      subject: 'Dubai booking voucher ready',
      templateCode: 'voucher_ready',
      provider: 'sandbox',
      providerMessageId: 'sandbox_msg_voucher_001',
      sentAt: new Date(),
      status: 'delivered',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      channel: 'email',
      category: 'marketing',
      entityType: 'lead',
      entityId: 'lead_corporate_demo',
      recipient: 'travel.manager@example.com',
      recipientName: 'Travel Manager',
      subject: 'Corporate Thailand proposal',
      templateCode: 'quotation_sent',
      provider: 'sandbox',
      providerMessageId: 'sandbox_email_quote_001',
      status: 'sent',
    },
  ]);

  await upsertMany(ImportExportJob, 'fileName', [
    {
      organizationId,
      branchId: BRANCH_ID,
      jobType: 'import',
      module: 'customers',
      fileName: 'demo-customer-import.csv',
      format: 'csv',
      totalRows: 42,
      successRows: 40,
      failedRows: 2,
      requestedBy: 'admin@tripos.test',
      completedAt: new Date(),
      status: 'completed',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      jobType: 'export',
      module: 'bookings',
      fileName: 'booking-export-august.xlsx',
      format: 'xlsx',
      totalRows: 18,
      successRows: 18,
      failedRows: 0,
      requestedBy: 'finance@tripos.test',
      completedAt: new Date(),
      status: 'completed',
    },
  ]);

  await upsertMany(OperatingRecord, 'code', [
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'contacts',
      title: 'Sharma Family Emergency Contact',
      code: 'contact-sharma-family-emergency',
      category: 'Emergency Contact',
      entityType: 'customer',
      entityId: 'Rohit Sharma',
      ownerId: 'operations@tripos.test',
      assignedTo: 'operations@tripos.test',
      channel: 'phone',
      priority: 'high',
      description:
        'Primary local contact for Dubai family departure and arrival coordination.',
      details: { phone: '+919811110001', relation: 'Traveller' },
      tags: ['family', 'dubai'],
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'activities',
      title: 'Corporate Thailand Discovery Call',
      code: 'activity-corporate-thailand-discovery',
      category: 'Sales Call',
      entityType: 'lead',
      entityId: 'Thailand Corporate Incentive',
      ownerId: 'sales@tripos.test',
      assignedTo: 'sales@tripos.test',
      channel: 'phone',
      priority: 'medium',
      scheduledAt: new Date(),
      description:
        'Captured group size, budget range, preferred dates, and approval workflow.',
      status: 'completed',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'follow-ups',
      title: 'Quotation Expiry Reminder',
      code: 'followup-quotation-expiry-reminder',
      category: 'Quotation',
      entityType: 'quotation',
      entityId: 'Dubai Family Quote',
      ownerId: 'sales@tripos.test',
      assignedTo: 'sales@tripos.test',
      channel: 'whatsapp',
      priority: 'high',
      dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      description: 'Follow up before supplier rates expire.',
      status: 'open',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'meetings',
      title: 'Supplier Review With Desert Safari Partner',
      code: 'meeting-desert-safari-supplier-review',
      category: 'Supplier Review',
      entityType: 'supplier',
      entityId: 'Desert Safari Partner',
      ownerId: 'operations@tripos.test',
      assignedTo: 'operations@tripos.test',
      channel: 'video',
      priority: 'medium',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      details: { agenda: ['SLA', 'vehicle quality', 'peak season capacity'] },
      status: 'open',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'notes',
      title: 'Passport Copy Pending',
      code: 'note-passport-copy-pending',
      category: 'Booking Note',
      entityType: 'booking',
      entityId: 'Dubai Family Booking',
      ownerId: 'operations@tripos.test',
      description:
        'Two child traveller passport copies are still pending from customer.',
      priority: 'medium',
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'service-catalog',
      title: 'Dubai Airport Private Transfer',
      code: 'service-dubai-private-transfer',
      category: 'Transfer',
      entityType: 'service',
      entityId: 'DXB-TRANSFER-PRIVATE',
      ownerId: 'operations@tripos.test',
      priority: 'medium',
      details: {
        supplier: 'Dubai Transfers LLC',
        currency: 'AED',
        baseCost: 180,
      },
      tags: ['transfer', 'dubai'],
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'custom-fields',
      title: 'Passport Expiry Capture',
      code: 'custom-field-passport-expiry',
      category: 'Traveller Field',
      entityType: 'travel_document',
      entityId: 'passportExpiryDate',
      ownerId: 'admin@tripos.test',
      details: { fieldType: 'date', requiredFor: ['international_booking'] },
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'call-center',
      title: 'Hot Lead Callback Queue',
      code: 'call-center-hot-lead-callback',
      category: 'Outbound',
      entityType: 'lead',
      entityId: 'Thailand Corporate Incentive',
      ownerId: 'sales@tripos.test',
      assignedTo: 'sales@tripos.test',
      channel: 'phone',
      priority: 'urgent',
      dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
      details: { disposition: 'Interested', nextAction: 'Send revised quote' },
      status: 'open',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'field-force',
      title: 'Hotel Inspection Checklist',
      code: 'field-force-hotel-inspection',
      category: 'Supplier Visit',
      entityType: 'supplier',
      entityId: 'Dubai Marina Hotel',
      ownerId: 'operations@tripos.test',
      assignedTo: 'operations@tripos.test',
      priority: 'medium',
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      details: {
        location: 'Dubai Marina',
        checklist: ['rooms', 'breakfast', 'coach parking'],
      },
      status: 'open',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'content',
      title: 'Dubai Family Package FAQ',
      code: 'content-dubai-family-faq',
      category: 'FAQ',
      entityType: 'tour_package',
      entityId: 'Dubai Family Package',
      ownerId: 'marketing@tripos.test',
      details: { publishTarget: 'public_website', locale: 'en-IN' },
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      moduleKey: 'analytics',
      title: 'Sales Funnel Conversion',
      code: 'analytics-sales-funnel-conversion',
      category: 'Sales',
      entityType: 'report',
      entityId: 'sales_funnel',
      ownerId: 'admin@tripos.test',
      details: {
        dimensions: ['source', 'destination', 'branch'],
        metrics: ['leadCount', 'quoteValue', 'bookingValue'],
      },
      status: 'active',
    },
  ]);

  await upsertMany(Tag, 'name', [
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Luxury Family',
      module: 'leads',
      color: '#0f766e',
      description: 'Premium family holiday enquiries.',
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Urgent Departure',
      module: 'bookings',
      color: '#dc2626',
      description: 'Trips requiring same-day operations attention.',
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Preferred Supplier',
      module: 'suppliers',
      color: '#7c3aed',
      description: 'Vendors approved for priority quoting.',
      status: 'active',
    },
  ]);

  await upsertMany(Task, 'title', [
    {
      organizationId,
      branchId: BRANCH_ID,
      title: 'Follow up Dubai family quotation',
      description: 'Confirm decision timeline and collect passport names.',
      module: 'quotations',
      entityId: 'QTN-SHARMA-DXB',
      assignedTo: 'sales@webnza.test',
      priority: 'high',
      dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'open',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      title: 'Verify supplier confirmation',
      description: 'Check transfer confirmation and driver reporting time.',
      module: 'operations',
      entityId: 'BKG-SHARMA-DXB',
      assignedTo: 'ops@webnza.test',
      priority: 'urgent',
      dueAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
      status: 'in_progress',
    },
  ]);

  await upsertMany(StoredFile, 'storageKey', [
    {
      organizationId,
      branchId: BRANCH_ID,
      entityType: 'booking',
      entityId: 'BKG-SHARMA-DXB',
      fileName: 'sharma-passport.pdf',
      mimeType: 'application/pdf',
      size: 184000,
      storageDriver: 'local',
      storageKey: `${organizationId}/booking/BKG-SHARMA-DXB/sharma-passport.pdf`,
      url: '/storage/demo/sharma-passport.pdf',
      status: 'available',
      metadata: { documentType: 'passport' },
    },
  ]);

  await upsertMany(SavedReport, 'name', [
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Daily Sales Funnel',
      reportType: 'sales-funnel',
      filters: {},
      schedule: { frequency: 'daily', time: '09:00' },
      recipients: ['ops@webnza.test'],
      nextRunAt: new Date(Date.now() - 60 * 60 * 1000),
      status: 'active',
    },
    {
      organizationId,
      branchId: BRANCH_ID,
      name: 'Weekly Finance Summary',
      reportType: 'finance',
      filters: {},
      schedule: { frequency: 'weekly', day: 'monday' },
      recipients: ['finance@webnza.test'],
      nextRunAt: new Date(Date.now() - 60 * 60 * 1000),
      status: 'active',
    },
  ]);

  await upsertMany(AuditLog, 'action', [
    {
      organizationId,
      branchId: BRANCH_ID,
      actorId: 'seed',
      actorRole: 'system',
      action: 'seed.initial_data',
      method: 'SEED',
      path: 'tripos.seed',
      statusCode: 200,
      outcome: 'success',
      metadata: { organizationCode: 'WEBNZA' },
    },
  ]);

  await mongoose.disconnect();
  console.log(
    `Seeded TripOS initial data for organization WEBNZA (${organizationId}).`,
  );
  console.log(
    'CRM login: admin@tripos.test / TripOS@123 / organization WEBNZA / branch delhi',
  );
  console.log(
    'Additional CRM users: platform@tripos.test, manager@tripos.test, sales@tripos.test, operations@tripos.test, finance@tripos.test. Password: TripOS@123',
  );
}

function model(name: string, schema: mongoose.Schema) {
  return mongoose.models[name] ?? mongoose.model(name, schema);
}

async function upsertMany(
  modelRef: mongoose.Model<unknown>,
  uniqueKey: string,
  rows: Array<Record<string, unknown>>,
): Promise<void> {
  if (rows.length === 0) {
    return;
  }

  if (!modelRef.schema.path(uniqueKey)) {
    throw new Error(
      `Cannot seed ${modelRef.modelName}: unique key "${uniqueKey}" is not defined in its schema.`,
    );
  }

  const isOrganizationScoped = Boolean(modelRef.schema.path('organizationId'));

  const operations = rows.map((row, index) => {
    const uniqueValue = row[uniqueKey];

    if (
      uniqueValue === undefined ||
      uniqueValue === null ||
      uniqueValue === ''
    ) {
      throw new Error(
        `Cannot seed ${modelRef.modelName}: row ${index + 1} has no value for unique key "${uniqueKey}".`,
      );
    }

    const filter: Record<string, unknown> = {
      [uniqueKey]: uniqueValue,
    };

    if (isOrganizationScoped) {
      const organizationId = row.organizationId;

      if (
        organizationId === undefined ||
        organizationId === null ||
        organizationId === ''
      ) {
        throw new Error(
          `Cannot seed organization-scoped model ${modelRef.modelName}: row ${index + 1} has no organizationId.`,
        );
      }

      filter.organizationId = organizationId;
    }

    return {
      updateOne: {
        filter,
        update: { $set: row },
        upsert: true,
      },
    };
  });

  try {
    await modelRef.bulkWrite(operations, { ordered: true });
    console.log(`Seeded ${modelRef.modelName}: ${rows.length} record(s).`);
  } catch (error) {
    console.error(`Failed seeding model ${modelRef.modelName}.`, {
      uniqueKey,
      isOrganizationScoped,
    });
    throw error;
  }
}

async function seedCrmUsers(
  modelRef: mongoose.Model<unknown>,
  organizationId: string,
) {
  const users = [
    {
      name: 'TripOS Platform Owner',
      email: 'platform@tripos.test',
      branchId: 'delhi',
      branchIds: ['delhi', 'dubai', 'jaipur'],
      role: 'platform_admin',
      permissions: ['*'],
    },
    {
      name: 'TripOS Admin',
      email: 'admin@tripos.test',
      branchId: 'delhi',
      branchIds: ['delhi', 'dubai', 'jaipur'],
      role: 'organization_admin',
      permissions: ['*'],
    },
    {
      name: 'Delhi Branch Manager',
      email: 'manager@tripos.test',
      branchId: 'delhi',
      branchIds: ['delhi'],
      role: 'branch_manager',
      permissions: [],
    },
    {
      name: 'Sales Consultant',
      email: 'sales@tripos.test',
      branchId: 'delhi',
      branchIds: ['delhi'],
      departmentIds: ['sales'],
      teamIds: ['b2c-sales'],
      role: 'sales',
      permissions: [],
    },
    {
      name: 'Operations Executive',
      email: 'operations@tripos.test',
      branchId: 'delhi',
      branchIds: ['delhi'],
      departmentIds: ['operations'],
      teamIds: ['dmc-ops'],
      role: 'operations',
      permissions: [],
    },
    {
      name: 'Finance Executive',
      email: 'finance@tripos.test',
      branchId: 'delhi',
      branchIds: ['delhi'],
      departmentIds: ['finance'],
      role: 'finance',
      permissions: [],
    },
    {
      name: 'B2B Agent User',
      email: 'agent@tripos.test',
      branchId: 'delhi',
      branchIds: ['delhi'],
      role: 'agent',
      permissions: [],
    },
  ];

  await modelRef.bulkWrite(
    users.map((user) => ({
      updateOne: {
        filter: { organizationId, email: user.email },
        update: {
          $set: {
            ...user,
            organizationId,
            passwordHash: hashPassword('TripOS@123'),
            departmentIds: user.departmentIds ?? [],
            teamIds: user.teamIds ?? [],
            status: 'active',
          },
        },
        upsert: true,
      },
    })),
    { ordered: true },
  );
  console.log(`Seeded CrmUser: ${users.length} record(s).`);
}

async function seedRoleAssignments(
  modelRef: mongoose.Model<unknown>,
  organizationId: string,
  users: Array<Record<string, unknown>>,
  roles: Array<Record<string, unknown>>,
) {
  const roleByCode = new Map(roles.map((role) => [String(role.code), role]));
  const assignments = users
    .map((user) => {
      const role = roleByCode.get(String(user.role));
      if (!role || String(user.role) === 'platform_admin') return null;
      return {
        organizationId,
        userId: String(user._id),
        roleId: String(role._id),
        branchIds: (user.branchIds as string[]) ?? [],
        departmentIds: (user.departmentIds as string[]) ?? [],
        teamIds: (user.teamIds as string[]) ?? [],
        status: 'active',
      };
    })
    .filter(Boolean) as Array<Record<string, unknown>>;

  if (!assignments.length) return;
  await modelRef.bulkWrite(
    assignments.map((assignment) => ({
      updateOne: {
        filter: {
          organizationId,
          userId: assignment.userId,
          roleId: assignment.roleId,
        },
        update: { $set: assignment },
        upsert: true,
      },
    })),
    { ordered: true },
  );
  console.log(`Seeded UserRole: ${assignments.length} record(s).`);
}

async function seedRolePermissionGrants(
  modelRef: mongoose.Model<unknown>,
  organizationId: string,
  roles: Array<Record<string, unknown>>,
) {
  const permissionsByRole: Record<string, string[]> = {
    organization_admin: ['*'],
    branch_manager: [
      'leads:read',
      'leads:create',
      'leads:update',
      'customers:read',
      'quotations:read',
      'quotations:create',
      'quotations:update',
      'bookings:read',
      'bookings:update',
      'operations:read',
      'reports:read',
    ],
    sales: [
      'leads:read',
      'leads:create',
      'leads:update',
      'customers:read',
      'quotations:read',
      'quotations:create',
      'quotations:update',
      'itineraries:read',
      'bookings:read',
    ],
    operations: [
      'bookings:read',
      'bookings:update',
      'suppliers:read',
      'operations:read',
      'operations:create',
      'operations:update',
      'documents:read',
    ],
    finance: [
      'payments:read',
      'payments:create',
      'payments:update',
      'finance:read',
      'finance:create',
      'finance:update',
      'finance:export',
    ],
  };
  const grants = roles.flatMap((role) =>
    (permissionsByRole[String(role.code)] ?? []).map((permissionCode) => ({
      organizationId,
      roleId: String(role._id),
      permissionCode,
      status: 'active',
    })),
  );
  if (!grants.length) return;
  await modelRef.bulkWrite(
    grants.map((grant) => ({
      updateOne: {
        filter: {
          organizationId,
          roleId: grant.roleId,
          permissionCode: grant.permissionCode,
        },
        update: { $set: grant },
        upsert: true,
      },
    })),
    { ordered: true },
  );
  console.log(`Seeded RolePermission: ${grants.length} record(s).`);
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function titleCase(value: string) {
  return value
    .split(/[-_]/g)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function normalizeSeedBranches(
  organizationId: string,
  branches: Array<Record<string, unknown>>,
) {
  return branches.map((branch) => ({
    organizationId,
    name: String(branch.name ?? titleCase(String(branch.id ?? 'main'))),
    code: String(branch.id ?? branch.code ?? 'main'),
    city: String(branch.city ?? ''),
    country: String(branch.country ?? ''),
    timezone: String(branch.timezone ?? 'Asia/Kolkata'),
    status: 'active',
  }));
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
