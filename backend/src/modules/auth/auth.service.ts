import { prisma } from '../../config/database';
import { hashPassword, comparePassword } from '../../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshExpiryDate,
} from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';

const formatUser = (user: any) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role?.name || 'employe',
  department: user.service?.name,
  avatar: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
  status: user.isActive ? 'active' : 'inactive',
  createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
  updatedAt: user.lastLogin ? new Date(user.lastLogin).toISOString() : new Date().toISOString(),
});

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true, service: true },
    });

    if (!user) throw new AppError('Email ou mot de passe incorrect', 401);
    if (!user.isActive) throw new AppError('Votre compte est en attente de validation par un administrateur', 403);

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw new AppError('Email ou mot de passe incorrect', 401);

    const payload = { userId: user.id, email: user.email, role: user.role.name };
    const token = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: getRefreshExpiryDate() },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return { user: formatUser(user), token, refreshToken };
  },

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    department?: string;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) throw new AppError('Un compte avec cet email existe déjà', 409);

    const passwordHash = await hashPassword(data.password);

    // Get default role (employe)
    let employeRole = await prisma.role.findUnique({ where: { name: 'employe' } });
    if (!employeRole) {
      employeRole = await prisma.role.create({ data: { name: 'employe' } });
    }

    // Get or create department
    let serviceId = null;
    if (data.department) {
      let service = await prisma.service.findFirst({ where: { name: data.department } });
      if (!service) {
        service = await prisma.service.create({ data: { name: data.department } });
      }
      serviceId = service.id;
    }

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        serviceId,
        roleId: employeRole.id,
        isActive: false,
      },
      include: { role: true, service: true },
    });

    // Notify admins
    const admins = await prisma.user.findMany({ where: { role: { name: 'admin' } } });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map(a => ({
          userId: a.id,
          title: 'Nouvelle demande de création de compte',
          message: `L'utilisateur ${user.firstName} ${user.lastName} (${user.email}) vient de s'inscrire et attend votre validation.`
        }))
      });
    }

    // Ne pas retourner de token pour forcer la connexion manuelle après validation
    return { user: formatUser(user), message: 'Compte créé avec succès, en attente de validation' };
  },

  async getMe(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, service: true },
    });
    if (!user) throw new AppError('Utilisateur introuvable', 404);
    return formatUser(user);
  },

  async updateProfile(userId: number, data: Partial<{ firstName: string; lastName: string; department: string; avatar: string }>) {
    let serviceId = undefined;
    if (data.department) {
      let service = await prisma.service.findFirst({ where: { name: data.department } });
      if (!service) {
        service = await prisma.service.create({ data: { name: data.department } });
      }
      serviceId = service.id;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        ...(serviceId !== undefined ? { serviceId } : {}),
      },
      include: { role: true, service: true },
    });
    return formatUser(user);
  },

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw new AppError('Utilisateur introuvable', 404);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetRequested: true }
    });

    // Notify admins
    const admins = await prisma.user.findMany({ where: { role: { name: 'admin' } } });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map(a => ({
          userId: a.id,
          title: 'Demande de réinitialisation de mot de passe',
          message: `L'utilisateur ${user.firstName} ${user.lastName} (${user.email}) a demandé la réinitialisation de son mot de passe.`
        }))
      });
    }

    return { message: "Demande envoyée à l'administrateur" };
  },



  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('Utilisateur introuvable', 404);

    const valid = await comparePassword(currentPassword, user.passwordHash);
    if (!valid) throw new AppError('Mot de passe actuel incorrect', 400);

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    return { message: 'Mot de passe mis à jour avec succès' };
  },

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    return { message: 'Déconnexion réussie' };
  },

  async refresh(token: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError('Refresh token invalide ou expiré', 401);
    }

    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true },
    });
    if (!user) throw new AppError('Utilisateur introuvable', 404);

    const newPayload = { userId: user.id, email: user.email, role: user.role.name };
    const accessToken = generateAccessToken(newPayload);
    const refreshToken = generateRefreshToken(newPayload);

    // Rotate refresh token
    await prisma.refreshToken.delete({ where: { token } });
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt: getRefreshExpiryDate() },
    });

    return { user: formatUser(user), token: accessToken, refreshToken };
  },

  async getUserNotifications(userId: number) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 20
    });
    return notifications;
  },

  async markNotificationAsRead(userId: number, notificationId: number) {
    const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif || notif.userId !== userId) {
      throw new AppError('Notification introuvable ou non autorisée', 404);
    }
    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
    return updated;
  }
};
