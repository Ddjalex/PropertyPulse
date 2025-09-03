import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

// Enums
export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented',
  PENDING = 'pending'
}

export enum PropertyType {
  APARTMENT = 'apartment',
  VILLA = 'villa',
  OFFICE = 'office',
  COMMERCIAL = 'commercial',
  LAND = 'land'
}

export enum ListingType {
  SALE = 'sale',
  RENT = 'rent'
}

// Session interface for express-session
export interface Session extends Document {
  sid: string;
  sess: any;
  expire: Date;
}

const SessionSchema = new Schema<Session>({
  sid: { type: String, required: true, unique: true },
  sess: { type: Schema.Types.Mixed, required: true },
  expire: { type: Date, required: true, index: true }
});

// User interface and schema
export interface User extends Document {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>({
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Property interface and schema
export interface Property extends Document {
  title: string;
  description?: string;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  price: number;
  pricePerSqm?: number;
  currency: string;
  location: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  features: string[];
  images: string[];
  featured: boolean;
  virtualTourUrl?: string;
  mapCoordinates?: string;
  agentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<Property>({
  title: { type: String, required: true },
  description: String,
  propertyType: { type: String, enum: Object.values(PropertyType), required: true },
  listingType: { type: String, enum: Object.values(ListingType), required: true },
  status: { type: String, enum: Object.values(PropertyStatus), default: PropertyStatus.AVAILABLE },
  price: { type: Number, required: true },
  pricePerSqm: Number,
  currency: { type: String, default: 'ETB' },
  location: { type: String, required: true },
  address: String,
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  features: [String],
  images: [String],
  featured: { type: Boolean, default: false },
  virtualTourUrl: String,
  mapCoordinates: String,
  agentId: { type: String, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Project interface and schema
export interface Project extends Document {
  name: string;
  description?: string;
  location: string;
  status: string;
  progress: number;
  totalUnits?: number;
  availableUnits?: number;
  startDate?: Date;
  expectedCompletion?: Date;
  images: string[];
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<Project>({
  name: { type: String, required: true },
  description: String,
  location: { type: String, required: true },
  status: { type: String, default: 'planning' },
  progress: { type: Number, default: 0 },
  totalUnits: Number,
  availableUnits: Number,
  startDate: Date,
  expectedCompletion: Date,
  images: [String],
  features: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Construction Update interface and schema
export interface ConstructionUpdate extends Document {
  projectId: string;
  title: string;
  content?: string;
  progress?: number;
  images: string[];
  updateDate: Date;
  createdAt: Date;
}

const ConstructionUpdateSchema = new Schema<ConstructionUpdate>({
  projectId: { type: String, ref: 'Project', required: true },
  title: { type: String, required: true },
  content: String,
  progress: Number,
  images: [String],
  updateDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Blog Post interface and schema
export interface BlogPost extends Document {
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  published: boolean;
  authorId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<BlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: String,
  excerpt: String,
  featuredImage: String,
  published: { type: Boolean, default: false },
  authorId: { type: String, ref: 'User' },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Team Member interface and schema
export interface TeamMember extends Document {
  userId?: string;
  name: string;
  position: string;
  bio?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  profileImage?: string;
  specializations: string[];
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<TeamMember>({
  userId: { type: String, ref: 'User' },
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: String,
  phone: String,
  whatsapp: String,
  email: String,
  profileImage: String,
  specializations: [String],
  active: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Lead interface and schema
export interface Lead extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  propertyInterest?: string;
  message?: string;
  source: string;
  status: string;
  propertyId?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<Lead>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  propertyInterest: String,
  message: String,
  source: { type: String, default: 'website' },
  status: { type: String, default: 'new' },
  propertyId: { type: String, ref: 'Property' },
  assignedTo: { type: String, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Setting interface and schema
export interface Setting extends Document {
  key: string;
  value?: string;
  type: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<Setting>({
  key: { type: String, required: true, unique: true },
  value: String,
  type: { type: String, default: 'string' },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Models
export const SessionModel = mongoose.model<Session>('sessions', SessionSchema);
export const UserModel = mongoose.model<User>('User', UserSchema);
export const PropertyModel = mongoose.model<Property>('Property', PropertySchema);
export const ProjectModel = mongoose.model<Project>('Project', ProjectSchema);
export const ConstructionUpdateModel = mongoose.model<ConstructionUpdate>('ConstructionUpdate', ConstructionUpdateSchema);
export const BlogPostModel = mongoose.model<BlogPost>('BlogPost', BlogPostSchema);
export const TeamMemberModel = mongoose.model<TeamMember>('TeamMember', TeamMemberSchema);
export const LeadModel = mongoose.model<Lead>('Lead', LeadSchema);
export const SettingModel = mongoose.model<Setting>('Setting', SettingSchema);

// Validation schemas using Zod
export const insertPropertySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType),
  listingType: z.nativeEnum(ListingType),
  status: z.nativeEnum(PropertyStatus).optional(),
  price: z.number(),
  pricePerSqm: z.number().optional(),
  currency: z.string().optional(),
  location: z.string(),
  address: z.string().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  area: z.number().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  virtualTourUrl: z.string().optional(),
  mapCoordinates: z.string().optional(),
  agentId: z.string().optional(),
});

export const insertProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  location: z.string(),
  status: z.string().optional(),
  progress: z.number().optional(),
  totalUnits: z.number().optional(),
  availableUnits: z.number().optional(),
  startDate: z.date().optional(),
  expectedCompletion: z.date().optional(),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
});

export const insertLeadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  propertyInterest: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  propertyId: z.string().optional(),
  assignedTo: z.string().optional(),
});

export const insertTeamMemberSchema = z.object({
  userId: z.string().optional(),
  name: z.string(),
  position: z.string(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  profileImage: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export const insertBlogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  published: z.boolean().optional(),
  authorId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const insertSettingSchema = z.object({
  key: z.string(),
  value: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
});

// Types
export type UpsertUser = Partial<User>;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertSetting = z.infer<typeof insertSettingSchema>;