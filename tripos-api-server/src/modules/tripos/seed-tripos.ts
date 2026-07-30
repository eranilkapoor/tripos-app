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
import {
  BranchSchema,
  DepartmentSchema,
  PermissionSchema,
  RolePermissionSchema,
  RoleSchema,
  TeamSchema,
  UserRoleSchema,
} from '../identity/schemas/identity.schema';

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
  await CrmUser.updateOne(
    { email: 'admin@tripos.test' },
    {
      $set: {
        name: 'TripOS Admin',
        email: 'admin@tripos.test',
        passwordHash: hashPassword('TripOS@123'),
        organizationId: organizationId,
        branchId: BRANCH_ID,
        branchIds: ['delhi', 'dubai', 'jaipur'],
        departmentIds: [],
        teamIds: [],
        role: 'organization_admin',
        status: 'active',
        permissions: ['*'],
      },
    },
    { upsert: true },
  ).exec();

  const adminUser = await CrmUser.findOne({ email: 'admin@tripos.test' })
    .lean()
    .exec();

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
    'settings',
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

  const adminRole = await Role.findOne({
    organizationId,
    code: 'organization_admin',
  })
    .lean()
    .exec();
  if (adminRole && adminUser) {
    await UserRole.updateOne(
      {
        organizationId,
        userId: String(adminUser._id),
        roleId: String(adminRole._id),
      },
      {
        $set: {
          organizationId,
          userId: String(adminUser._id),
          roleId: String(adminRole._id),
          branchIds: ['delhi', 'dubai', 'jaipur'],
          departmentIds: [],
          teamIds: [],
          status: 'active',
        },
      },
      { upsert: true },
    ).exec();
    await RolePermission.updateOne(
      {
        organizationId,
        roleId: String(adminRole._id),
        permissionCode: '*',
      },
      {
        $set: {
          organizationId,
          roleId: String(adminRole._id),
          permissionCode: '*',
          status: 'active',
        },
      },
      { upsert: true },
    ).exec();
  }

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

  const isOrganizationScoped = Boolean(
    modelRef.schema.path('organizationId'),
  );

  const operations = rows.map((row, index) => {
    const uniqueValue = row[uniqueKey];

    if (uniqueValue === undefined || uniqueValue === null || uniqueValue === '') {
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

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
