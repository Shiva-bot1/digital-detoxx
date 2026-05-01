const router   = require('express').Router();
const auth     = require('../middleware/auth');
const supabase = require('../supabase');

// Log usage
router.post('/', auth, async (req, res) => {
  try {
    const { appName, minutesSpent } = req.body;
    const date = new Date().toISOString(); // always use server time

    const { data, error } = await supabase
      .from('sessions')
      .insert([{ user_id: req.user.id, app_name: appName, minutes_spent: minutesSpent, date }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get usage
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;