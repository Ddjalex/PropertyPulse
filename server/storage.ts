import mongoose from "./db";
import {
  UserModel,
  PropertyModel,
  ProjectModel,
  ConstructionUpdateModel,
  BlogPostModel,
  TeamMemberModel,
  LeadModel,
  SettingModel,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Project,
  type InsertProject,
  type ConstructionUpdate,
  type BlogPost,
  type InsertBlogPost,
  type TeamMember,
  type InsertTeamMember,
  type Lead,
  type InsertLead,
  type Setting,
  type InsertSetting,
} from "@shared/models";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Property operations
  getProperties(filters?: {
    type?: string;
    listingType?: string;
    status?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Construction update operations
  getConstructionUpdates(projectId?: string): Promise<ConstructionUpdate[]>;
  createConstructionUpdate(update: any): Promise<ConstructionUpdate>;
  
  // Blog operations
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;
  
  // Team operations
  getTeamMembers(active?: boolean): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: string): Promise<void>;
  
  // Lead operations
  getLeads(status?: string): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: string): Promise<void>;
  
  // Settings operations
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  upsertSetting(setting: InsertSetting): Promise<Setting>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (userData.id) {
      // Try to find and update existing user by id
      const existingUser = await UserModel.findByIdAndUpdate(
        userData.id,
        { ...userData, updatedAt: new Date() },
        { new: true, setDefaultsOnInsert: true }
      );
      if (existingUser) return existingUser;
    }
    
    // If user has email, try to find by email first
    if (userData.email) {
      const existingUser = await UserModel.findOneAndUpdate(
        { email: userData.email },
        { ...userData, updatedAt: new Date() },
        { new: true, setDefaultsOnInsert: true }
      );
      if (existingUser) return existingUser;
    }
    
    // Create new user
    const newUser = new UserModel({ 
      ...(userData.id && { _id: userData.id }),
      ...userData, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    });
    return await newUser.save();
  }

  // Property operations
  async getProperties(filters?: {
    type?: string;
    listingType?: string;
    status?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }): Promise<Property[]> {
    const query: any = {};
    
    if (filters) {
      if (filters.type) query.propertyType = filters.type;
      if (filters.listingType) query.listingType = filters.listingType;
      if (filters.status) query.status = filters.status;
      if (filters.location) query.location = { $regex: filters.location, $options: 'i' };
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
      }
      if (filters.featured !== undefined) query.featured = filters.featured;
    }
    
    return await PropertyModel.find(query).sort({ createdAt: -1 });
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const property = await PropertyModel.findById(id);
    return property || undefined;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const newProperty = new PropertyModel(property);
    return await newProperty.save();
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property> {
    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      id,
      { ...property, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedProperty) throw new Error('Property not found');
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<void> {
    await PropertyModel.findByIdAndDelete(id);
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return await ProjectModel.find().sort({ createdAt: -1 });
  }

  async getProject(id: string): Promise<Project | undefined> {
    const project = await ProjectModel.findById(id);
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject = new ProjectModel(project);
    return await newProject.save();
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      id,
      { ...project, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedProject) throw new Error('Project not found');
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await ProjectModel.findByIdAndDelete(id);
  }

  // Construction update operations
  async getConstructionUpdates(projectId?: string): Promise<ConstructionUpdate[]> {
    const query = projectId ? { projectId } : {};
    return await ConstructionUpdateModel.find(query).sort({ updateDate: -1 });
  }

  async createConstructionUpdate(update: any): Promise<ConstructionUpdate> {
    const newUpdate = new ConstructionUpdateModel(update);
    return await newUpdate.save();
  }

  // Blog operations
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    const query = published !== undefined ? { published } : {};
    return await BlogPostModel.find(query).sort({ createdAt: -1 });
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const post = await BlogPostModel.findById(id);
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const post = await BlogPostModel.findOne({ slug });
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const newPost = new BlogPostModel(post);
    return await newPost.save();
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const updatedPost = await BlogPostModel.findByIdAndUpdate(
      id,
      { ...post, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedPost) throw new Error('Blog post not found');
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await BlogPostModel.findByIdAndDelete(id);
  }

  // Team operations
  async getTeamMembers(active?: boolean): Promise<TeamMember[]> {
    const query = active !== undefined ? { active } : {};
    return await TeamMemberModel.find(query).sort({ displayOrder: 1 });
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    const member = await TeamMemberModel.findById(id);
    return member || undefined;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const newMember = new TeamMemberModel(member);
    return await newMember.save();
  }

  async updateTeamMember(id: string, member: Partial<InsertTeamMember>): Promise<TeamMember> {
    const updatedMember = await TeamMemberModel.findByIdAndUpdate(
      id,
      { ...member, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedMember) throw new Error('Team member not found');
    return updatedMember;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await TeamMemberModel.findByIdAndDelete(id);
  }

  // Lead operations
  async getLeads(status?: string): Promise<Lead[]> {
    const query = status ? { status } : {};
    return await LeadModel.find(query).sort({ createdAt: -1 });
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const lead = await LeadModel.findById(id);
    return lead || undefined;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const newLead = new LeadModel(lead);
    return await newLead.save();
  }

  async updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead> {
    const updatedLead = await LeadModel.findByIdAndUpdate(
      id,
      { ...lead, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedLead) throw new Error('Lead not found');
    return updatedLead;
  }

  async deleteLead(id: string): Promise<void> {
    await LeadModel.findByIdAndDelete(id);
  }

  // Settings operations
  async getSettings(): Promise<Setting[]> {
    return await SettingModel.find().sort({ key: 1 });
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const setting = await SettingModel.findOne({ key });
    return setting || undefined;
  }

  async upsertSetting(setting: InsertSetting): Promise<Setting> {
    const updatedSetting = await SettingModel.findOneAndUpdate(
      { key: setting.key },
      { ...setting, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return updatedSetting;
  }
}

export const storage = new DatabaseStorage();