export const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {

        // Sécurité : authMiddleware doit être exécuté avant
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        // Vérification du rôle
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Permissions insuffisantes' });
        }

        next();
    };
};
