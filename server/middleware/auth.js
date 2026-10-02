const jwt = require('jsonwebtoken');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET || 'darul-quran-secret-key-change-in-production';
const logFile = 'logs/auth-debug.log';

// Authentication middleware
const authenticate = (req, res, next) => {
  // Debug logging removed for performance in production

  try {
    // Check token in: cookies, authorization header, OR query params (for file uploads)
    const token = req.headers.authorization?.split(' ')[1] ||
      req.cookies.token ||
      req.query.token;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      req.schoolId = decoded.schoolId ? parseInt(decoded.schoolId) : null;

      // DEMO PROTECTION: Prevent modifications by demo_admin
      if (decoded.username === 'demo_admin') {
        const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method.toUpperCase());
        const isWhitelisted = ['/api/auth/logout', '/api/platform-billing/initialize-subscription'].some(path => req.path.startsWith(path));

        if (isWriteOperation && !isWhitelisted) {
          return res.status(403).json({
            error: 'Action restricted in Demo Mode',
            isDemoRestriction: true,
            message: 'To protect the shared demo environment, editing and deleting are disabled. Purchase a license to unlock full features!'
          });
        }
      }
    } catch (jwtError) {
      console.error(`[Auth] JWT Verification failed: ${jwtError.message}. Token starts with: ${token?.substring(0, 10)}`);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    next();
  } catch (error) {
    console.error(`[Auth] Fatal authentication error: ${error.message}`);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  // Flatten roles array in case it's passed as an array
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Superadmins always have access
    if (req.user.role === 'superadmin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log(`Authorization failed. User ID: ${req.user.id}, Role: ${req.user.role}, Required: ${allowedRoles.join(', ')}`);
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      req.schoolId = decoded.schoolId ? parseInt(decoded.schoolId) : null;
    }
  } catch (error) {
    // Ignore errors for optional auth
  }
  next();
};

// Section scope middleware for sub-admins
// Populates req.assignedSectionIds (section IDs) and req.allowedClassIds (class IDs in those sections)
// Only applies to sub_admin users who have section restrictions.
// If no sections are assigned, req.allowedClassIds remains undefined (= full access).
const attachSectionScope = async (req, res, next) => {
  try {
    if (req.user && req.user.id && req.user.role === 'sub_admin') {
      const prisma = require('../db');
      const sectionAssignments = await prisma.sectionAdminAccess.findMany({
        where: { userId: req.user.id },
        select: {
          sectionId: true,
          Section: { select: { id: true, name: true, code: true } }
        }
      });

      if (sectionAssignments && sectionAssignments.length > 0) {
        req.assignedSectionIds = sectionAssignments.map(a => a.sectionId);

        const sections = sectionAssignments.map(a => a.Section).filter(Boolean);
        const nameConditions = [];
        for (const sec of sections) {
          const secName = sec.name.trim();
          nameConditions.push({ name: { startsWith: secName, mode: 'insensitive' } });
          if (sec.code) {
            const secCode = sec.code.trim();
            nameConditions.push({ name: { startsWith: secCode, mode: 'insensitive' } });
          }
        }

        // Pre-fetch all class IDs within assigned sections (by direct sectionId OR name/code matching)
        const classes = await prisma.class.findMany({
          where: {
            schoolId: req.schoolId,
            OR: [
              { sectionId: { in: req.assignedSectionIds } },
              ...nameConditions
            ]
          },
          select: { id: true, name: true, sectionId: true }
        });

        req.allowedClassIds  = classes.map(c => c.id);
        req.allowedClassNames = classes.map(c => c.name);

        // Auto-backfill: update class sectionId in DB if sectionId was null
        const unlinked = classes.filter(c => !c.sectionId);
        if (unlinked.length > 0) {
          for (const cls of unlinked) {
            const clsLower = cls.name.trim().toLowerCase();
            const matchedSec = sections.find(s => 
              clsLower.startsWith(s.name.trim().toLowerCase()) ||
              (s.code && clsLower.startsWith(s.code.trim().toLowerCase()))
            );
            if (matchedSec) {
              prisma.class.update({
                where: { id: cls.id },
                data: { sectionId: matchedSec.id }
              }).catch(() => {});
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[SectionScope] Error attaching section scope:', err);
  }
  next();
};


module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  attachSectionScope,
  JWT_SECRET
};
