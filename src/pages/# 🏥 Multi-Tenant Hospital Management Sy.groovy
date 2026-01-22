# 🏥 Multi-Tenant Hospital Management System - Complete Guide

## 📋 Overview
Build a SaaS-style system where multiple clinics/hospitals can register and use the software independently with unique URLs or subdomains.

---

## 🎯 Two Approaches

### **Approach 1: Subdomain-based (Ideal but needs custom domain)**
- `clinic-a.yourdomain.com`
- `clinic-b.yourdomain.com`
- ❌ Not possible with Render free tier

### **Approach 2: Path-based (Works with Render free tier)** ✅
- `yourdomain.com/clinic-a`
- `yourdomain.com/clinic-b`
- ✅ Perfect for your use case

---

## 🗂️ Complete Folder Structure

```
server/
├── models/
│   ├── Tenant.js                    # Clinic/Hospital registration
│   ├── User.js                      # Users (doctors, staff, etc.)
│   ├── Patient.js                   # Patients (tenant-specific)
│   └── PatientVisit.js              # Visits (tenant-specific)
│
├── controllers/
│   ├── tenant.controller.js         # Tenant CRUD operations
│   ├── auth.controller.js           # Authentication
│   ├── patient.controller.js        # Patient operations (tenant-aware)
│   └── visit.controller.js          # Visit operations (tenant-aware)
│
├── middleware/
│   ├── tenantMiddleware.js          # Extract and validate tenant
│   ├── authMiddleware.js            # JWT authentication
│   └── roleMiddleware.js            # Role-based access control
│
├── routes/
│   ├── public.routes.js             # Public routes (registration, login)
│   ├── tenant.routes.js             # Tenant management
│   ├── patient.routes.js            # Patient routes
│   └── visit.routes.js              # Visit routes
│
├── utils/
│   ├── slugGenerator.js             # Generate unique slugs
│   ├── validators.js                # Input validation
│   └── constants.js                 # App constants
│
└── server.js                        # Main entry point

client/
├── src/
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Landing.jsx          # Public landing page
│   │   │   ├── TenantRegister.jsx   # Clinic registration
│   │   │   └── TenantLogin.jsx      # Clinic login
│   │   │
│   │   ├── tenant/
│   │   │   ├── Dashboard.jsx        # Tenant dashboard
│   │   │   ├── Settings.jsx         # Tenant settings
│   │   │   └── Users.jsx            # Manage staff
│   │   │
│   │   └── app/
│   │       ├── PatientRegistration.jsx
│   │       ├── DoctorScreen.jsx
│   │       ├── VisitHistory.jsx
│   │       └── PatientList.jsx
│   │
│   ├── components/
│   │   ├── TenantGuard.jsx          # Verify tenant context
│   │   └── TenantSelector.jsx       # Switch tenants (if super admin)
│   │
│   ├── context/
│   │   └── TenantContext.jsx        # Global tenant state
│   │
│   ├── api/
│   │   └── services/
│   │       ├── tenantService.js
│   │       ├── authService.js
│   │       └── patientService.js
│   │
│   └── routes/
│       └── AppRoutes.jsx            # Dynamic routing
```

---

## 📊 Database Schema

### **1. Tenant Schema**

```javascript
// models/Tenant.js
import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  // Business Information
  businessName: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  // Unique identifier (used in URL)
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-z0-9-]+$/  // Only lowercase letters, numbers, hyphens
  },
  
  // Contact Information
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true 
  },
  
  phone: { type: String },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Business Details
  businessType: { 
    type: String, 
    enum: ['hospital', 'clinic', 'diagnostic-center'],
    default: 'clinic'
  },
  
  // Registration Details
  registrationNumber: String,
  taxId: String,
  
  // Subscription
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  
  subscriptionStatus: {
    type: String,
    enum: ['active', 'suspended', 'cancelled', 'trial'],
    default: 'trial'
  },
  
  subscriptionExpiry: Date,
  
  // Settings
  settings: {
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    logo: String,
    primaryColor: { type: String, default: '#1e293b' }
  },
  
  // Admin User (First user who registers)
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'cancelled'],
    default: 'pending'
  },
  
  // Metadata
  onboardingCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes
tenantSchema.index({ slug: 1 });
tenantSchema.index({ email: 1 });
tenantSchema.index({ status: 1 });

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;
```

### **2. Updated User Schema (Tenant-aware)**

```javascript
// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Tenant Reference (CRITICAL)
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true  // Important for query performance
  },
  
  // User Info
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: String,
  
  // Role
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist'],
    default: 'receptionist'
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  // Permissions (optional)
  permissions: [String],
  
  // Profile
  avatar: String,
  department: String,
  specialization: String,
  
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Compound unique index: email must be unique within a tenant
userSchema.index({ tenant: 1, email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
export default User;
```

### **3. Updated Patient Schema (Tenant-aware)**

```javascript
// models/Patient.js
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  // Tenant Reference (CRITICAL)
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  
  // Patient Info
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  age: Number,
  gender: String,
  address: String,
  emergencyContact: String,
  emergencyPhone: String,
  
  // Medical Info
  bloodGroup: String,
  allergies: [String],
  chronicConditions: [String],
  
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Compound indexes
patientSchema.index({ tenant: 1, phone: 1 });
patientSchema.index({ tenant: 1, createdAt: -1 });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
```

### **4. Updated PatientVisit Schema (Tenant-aware)**

```javascript
// models/PatientVisit.js
import mongoose from 'mongoose';

const patientVisitSchema = new mongoose.Schema({
  // Tenant Reference (CRITICAL)
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  
  tokenNo: String,
  registrationTime: String,
  registrationDate: Date,
  appointmentType: String,
  priority: String,
  status: String,
  medicalHistory: [{
    diagnosis: String,
    symptoms: String,
    medicines: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String
    }],
    notes: String,
    attachments: [String]
  }]
}, {
  timestamps: true
});

// Compound indexes
patientVisitSchema.index({ tenant: 1, registrationDate: -1 });
patientVisitSchema.index({ tenant: 1, patient: 1 });
patientVisitSchema.index({ tenant: 1, status: 1 });

const PatientVisit = mongoose.model('PatientVisit', patientVisitSchema);
export default PatientVisit;
```

---

## 🔧 Backend Implementation

### **1. Slug Generator Utility**

```javascript
// utils/slugGenerator.js

/**
 * Generate a URL-safe slug from business name
 * Example: "City Care Hospital" -> "city-care-hospital"
 */
export const generateSlug = (businessName) => {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
};

/**
 * Generate unique slug by checking database
 */
export const generateUniqueSlug = async (businessName, TenantModel) => {
  let slug = generateSlug(businessName);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existing = await TenantModel.findOne({ slug });
    
    if (!existing) {
      isUnique = true;
    } else {
      slug = `${generateSlug(businessName)}-${counter}`;
      counter++;
    }
  }

  return slug;
};

/**
 * Validate slug format
 */
export const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};
```

### **2. Tenant Middleware**

```javascript
// middleware/tenantMiddleware.js
import Tenant from '../models/Tenant.js';

/**
 * Extract tenant from URL path or header
 * Supports: /tenant-slug/... or X-Tenant-Slug header
 */
export const extractTenant = async (req, res, next) => {
  try {
    let tenantSlug = null;

    // Method 1: From URL path (/tenant-slug/patients)
    const pathParts = req.path.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      // Check if first part is a valid slug
      const potentialSlug = pathParts[0];
      if (potentialSlug && potentialSlug.length > 0) {
        // Verify it's a tenant slug, not a route name
        const tenant = await Tenant.findOne({ slug: potentialSlug });
        if (tenant) {
          tenantSlug = potentialSlug;
        }
      }
    }

    // Method 2: From header (useful for APIs)
    if (!tenantSlug && req.headers['x-tenant-slug']) {
      tenantSlug = req.headers['x-tenant-slug'];
    }

    if (!tenantSlug) {
      return res.status(400).json({
        success: false,
        message: 'Tenant not specified'
      });
    }

    // Fetch tenant
    const tenant = await Tenant.findOne({ 
      slug: tenantSlug,
      status: 'active'
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found or inactive'
      });
    }

    // Attach to request
    req.tenant = tenant;
    req.tenantId = tenant._id;

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing tenant'
    });
  }
};

/**
 * Ensure user belongs to the tenant
 */
export const validateTenantAccess = (req, res, next) => {
  if (!req.user || !req.tenant) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if user's tenant matches the request tenant
  if (req.user.tenant.toString() !== req.tenant._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this tenant'
    });
  }

  next();
};
```

### **3. Tenant Controller**

```javascript
// controllers/tenant.controller.js
import Tenant from '../models/Tenant.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateUniqueSlug, isValidSlug } from '../utils/slugGenerator.js';

/**
 * Register new tenant (clinic/hospital)
 */
export const registerTenant = async (req, res) => {
  try {
    const {
      businessName,
      email,
      phone,
      address,
      businessType,
      adminName,
      adminEmail,
      adminPassword
    } = req.body;

    // Validation
    if (!businessName || !email || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if tenant email already exists
    const existingTenant = await Tenant.findOne({ email });
    if (existingTenant) {
      return res.status(400).json({
        success: false,
        message: 'A tenant with this email already exists'
      });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(businessName, Tenant);

    // Create tenant
    const tenant = await Tenant.create({
      businessName,
      slug,
      email,
      phone,
      address,
      businessType: businessType || 'clinic',
      status: 'active',  // Auto-activate or keep 'pending' for approval
      subscriptionStatus: 'trial'
    });

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = await User.create({
      tenant: tenant._id,
      fullName: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    // Link admin user to tenant
    tenant.adminUser = adminUser._id;
    await tenant.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: adminUser._id,
        tenantId: tenant._id,
        role: adminUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Tenant registered successfully',
      data: {
        tenant: {
          id: tenant._id,
          businessName: tenant.businessName,
          slug: tenant.slug,
          url: `${process.env.APP_URL}/${tenant.slug}`  // e.g., https://yourapp.com/city-care-hospital
        },
        user: {
          id: adminUser._id,
          name: adminUser.fullName,
          email: adminUser.email,
          role: adminUser.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Tenant registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register tenant',
      error: error.message
    });
  }
};

/**
 * Check slug availability
 */
export const checkSlugAvailability = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!isValidSlug(slug)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slug format'
      });
    }

    const existing = await Tenant.findOne({ slug });

    res.json({
      success: true,
      available: !existing,
      slug
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking slug'
    });
  }
};

/**
 * Get tenant details
 */
export const getTenantDetails = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.tenantId)
      .select('-__v')
      .populate('adminUser', 'fullName email');

    res.json({
      success: true,
      data: tenant
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tenant details'
    });
  }
};

/**
 * Update tenant settings
 */
export const updateTenant = async (req, res) => {
  try {
    const { businessName, phone, address, settings } = req.body;

    const tenant = await Tenant.findByIdAndUpdate(
      req.tenantId,
      {
        businessName,
        phone,
        address,
        settings,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Tenant updated successfully',
      data: tenant
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tenant'
    });
  }
};
```

---

## 🛣️ Routing Structure

### **Backend Routes**

```javascript
// routes/public.routes.js
import express from 'express';
import { registerTenant, checkSlugAvailability } from '../controllers/tenant.controller.js';
import { loginTenant } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerTenant);
router.get('/check-slug/:slug', checkSlugAvailability);
router.post('/login', loginTenant);

export default router;
```

```javascript
// routes/tenant.routes.js
import express from 'express';
import { getTenantDetails, updateTenant } from '../controllers/tenant.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { extractTenant, validateTenantAccess } from '../middleware/tenantMiddleware.js';

const router = express.Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(extractTenant);
router.use(validateTenantAccess);

router.get('/details', getTenantDetails);
router.put('/update', updateTenant);

export default router;
```

```javascript
// server.js
import express from 'express';
import publicRoutes from './routes/public.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import patientRoutes from './routes/patient.routes.js';

const app = express();

// Public routes (no tenant required)
app.use('/api/public', publicRoutes);

// Tenant-specific routes
app.use('/api/:tenantSlug/tenant', tenantRoutes);
app.use('/api/:tenantSlug/patients', patientRoutes);
app.use('/api/:tenantSlug/visits', visitRoutes);

// Example URL: https://yourapp.com/api/city-care-hospital/patients
```

---

## 🎨 Frontend Implementation

### **1. Tenant Context**

```javascript
// context/TenantContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const { tenantSlug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantSlug) {
      // Fetch tenant details
      fetchTenantDetails(tenantSlug);
    } else {
      setLoading(false);
    }
  }, [tenantSlug]);

  const fetchTenantDetails = async (slug) => {
    try {
      // Fetch from API
      const response = await fetch(`/api/${slug}/tenant/details`);
      const data = await response.json();
      setTenant(data.data);
    } catch (error) {
      console.error('Error fetching tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, tenantSlug, loading }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
```

### **2. Updated App Routes**

```javascript
// App.jsx
import { TenantProvider } from './context/TenantContext';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<TenantRegister />} />
      <Route path="/login" element={<Login />} />

      {/* Tenant Routes */}
      <Route path="/:tenantSlug/*" element={
        <TenantProvider>
          <ProtectedRoute />
        </TenantProvider>
      }>
        <Route path="" element={<Layout />}>
          <Route index element={<PatientRegistration />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:patientId" element={<PatientDetail />} />
          <Route path="doctor-screen" element={<DoctorScreen />} />
          <Route path="visits" element={<VisitHistory />} />
          <Route path="settings" element={<TenantSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

---

## 📝 Summary

### **URLs will be:**
```
Public:
https://yourapp.com/
https://yourapp.com/register
https://yourapp.com/login

Tenant-specific:
https://yourapp.com/city-care-hospital/patients
https://yourapp.com/city-care-hospital/doctor-screen
https://yourapp.com/downtown-clinic/patients
https://yourapp.com/downtown-clinic/doctor-screen
```

### **Key Features:**
✅ Multi-tenant support with unique slugs
✅ Isolated data per tenant
✅ Path-based routing (works on Render free tier)
✅ Professional tenant registration
✅ Automatic slug generation
✅ Tenant-aware authentication
✅ Data isolation at database level

Would you like me to help you implement any specific part of this system?