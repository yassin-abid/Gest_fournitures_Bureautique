import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { getPrismaSkip, buildPaginatedResult } from '../../utils/pagination';
import { hashPassword } from '../../utils/password';

const formatUser = (u: any) => ({
  id: u.id,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  role: u.role?.name || 'employe',
  department: u.service?.name,
  status: u.isActive ? 'active' : 'inactive',
  passwordResetRequested: u.passwordResetRequested,
  passwordResetApproved: u.passwordResetApproved,
  createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
  updatedAt: u.lastLogin ? new Date(u.lastLogin).toISOString() : new Date().toISOString(),
});

export const adminService = {
  // ─── Users ────────────────────────────────────────────────

  async getUsers(page: number, limit: number, role?: string, search?: string) {
    const where: any = {};
    if (role) where.role = { name: role };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: getPrismaSkip(page, limit),
        take: limit,
        include: { role: true, service: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = data.map(formatUser);

    return buildPaginatedResult(formatted, total, page, limit);
  },

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true, service: true },
    });
    if (!user) throw new AppError('Utilisateur introuvable', 404);
    return formatUser(user);
  },

  async createUser(data: any) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError('Cet email est déjà utilisé', 400);

    const passwordHash = await hashPassword(data.password || 'password123'); // Default password if none provided

    // Get or create role
    let roleId = null;
    if (data.role) {
      let role = await prisma.role.findUnique({ where: { name: data.role } });
      if (!role) role = await prisma.role.create({ data: { name: data.role } });
      roleId = role.id;
    } else {
      let role = await prisma.role.findUnique({ where: { name: 'employe' } });
      if (!role) role = await prisma.role.create({ data: { name: 'employe' } });
      roleId = role.id;
    }

    // Get or create department
    let serviceId = null;
    if (data.department) {
      let service = await prisma.service.findFirst({ where: { name: data.department } });
      if (!service) service = await prisma.service.create({ data: { name: data.department } });
      serviceId = service.id;
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        roleId,
        serviceId,
        isActive: data.status !== 'inactive',
      },
      include: { role: true, service: true },
    });

    return formatUser(user);
  },

  async updateUser(id: number, data: any) {
    let roleId = undefined;
    if (data.role) {
      let role = await prisma.role.findUnique({ where: { name: data.role } });
      if (!role) role = await prisma.role.create({ data: { name: data.role } });
      roleId = role.id;
    }

    let serviceId = undefined;
    if (data.department) {
      let service = await prisma.service.findFirst({ where: { name: data.department } });
      if (!service) service = await prisma.service.create({ data: { name: data.department } });
      serviceId = service.id;
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        ...(roleId !== undefined ? { roleId } : {}),
        ...(serviceId !== undefined ? { serviceId } : {}),
        ...(data.status !== undefined ? { isActive: data.status !== 'inactive' } : {}),
      },
      include: { role: true, service: true },
    });

    return formatUser(user);
  },

  async deleteUser(id: number) {
    await prisma.user.update({ where: { id }, data: { isActive: false } });
  },

  async hardDeleteUser(id: number) {
    await prisma.user.delete({ where: { id } });
  },

  async activateUser(id: number) {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true },
      include: { role: true, service: true }
    });
    return formatUser(user);
  },

  async deactivateUser(id: number) {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      include: { role: true, service: true }
    });
    return formatUser(user);
  },

  async approvePasswordReset(id: number) {
    const user = await prisma.user.update({
      where: { id },
      data: { 
        passwordResetApproved: true,
        passwordResetRequested: false
      },
      include: { role: true, service: true }
    });
    
    // Notify user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Réinitialisation de mot de passe approuvée',
        message: 'Votre demande de réinitialisation de mot de passe a été approuvée. Vous pouvez maintenant définir un nouveau mot de passe.'
      }
    });

    return formatUser(user);
  },

  async rejectPasswordReset(id: number) {
    const user = await prisma.user.update({
      where: { id },
      data: { 
        passwordResetRequested: false 
      },
      include: { role: true, service: true }
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Réinitialisation de mot de passe refusée',
        message: "Votre demande de réinitialisation de mot de passe a été refusée par l'administrateur."
      }
    });

    return formatUser(user);
  },

  // ─── Logs ─────────────────────────────────────────────────

  async getLogs(page: number, limit: number, userId?: number, action?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: getPrismaSkip(page, limit),
        take: limit,
        include: { user: true },
        orderBy: { timestamp: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    const formatted = data.map((l) => {
      let entity = undefined;
      let entityId = undefined;
      let entityName = undefined;
      try {
        if (l.details) {
          const parsed = JSON.parse(l.details);
          entity = parsed.entity;
          entityId = parsed.entityId;
          
          const entityData = parsed.newValues || parsed.oldValues;
          if (entityData) {
             if (entity === 'User' && entityData.firstName && entityData.lastName) {
                 entityName = `${entityData.firstName} ${entityData.lastName}`;
             } else if (entityData.name) {
                 entityName = entityData.name;
             } else if (entityData.nom_service) {
                 entityName = entityData.nom_service;
             } else if (entityData.nom_role) {
                 entityName = entityData.nom_role;
             } else if (entityData.nom) {
                 entityName = entityData.nom;
             } else if (entityData.orderNumber) {
                 entityName = entityData.orderNumber;
             } else if (entityData.requestNumber) {
                 entityName = entityData.requestNumber;
             } else if (entityData.code) {
                 entityName = entityData.code;
             }
          }
        }
      } catch(e) {}
      return {
        ...l,
        userName: `${l.user.firstName} ${l.user.lastName}`,
        entity,
        entityId,
        entityName,
        timestamp: l.timestamp?.toISOString() || new Date().toISOString(),
      };
    });

    return buildPaginatedResult(formatted, total, page, limit);
  },

  // ─── Settings ─────────────────────────────────────────────

  async getSettings() {
    const settings = await prisma.systemSettings.findMany();
    const result: any = {};
    settings.forEach((s) => {
      if (s.value === 'true') result[s.key] = true;
      else if (s.value === 'false') result[s.key] = false;
      else if (!isNaN(Number(s.value))) result[s.key] = Number(s.value);
      else result[s.key] = s.value;
    });
    return result;
  },

  async updateSettings(data: any) {
    for (const [key, value] of Object.entries(data)) {
      await prisma.systemSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
    return this.getSettings();
  },
};
