const isAdmin = async (req, res, next) => {
    const { userId, clubId } = req.body;
  
    try {
      const club = await Clubs.findByPk(clubId);
  
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
  
      if (!club.admins.includes(userId)) {
        return res.status(403).json({ message: 'User is not an admin' });
      }
      req.club=club
      next();
    } catch (error) {
      console.error('Error checking admin status:', error);
      res.status(500).json({ message: 'Failed to check admin status' });
    }
  };

  
  module.exports = isAdmin;
  