const router   = require('express').Router();
const supabase = require('../supabase');

// Sync user profile to users table after registration
router.post('/sync', async (req, res) => {
  try {
    const { id, name, email } = req.body;

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) {
      await supabase
        .from('users')
        .insert([{ id, name, email }]);
    }

    res.status(200).json({ message: 'User synced' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;