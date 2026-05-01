const router   = require('express').Router();
const auth     = require('../middleware/auth');
const supabase = require('../supabase');

// Set goal
router.post('/', auth, async (req, res) => {
  try {
    const { appName, dailyLimitMinutes } = req.body;

    const { data, error } = await supabase
      .from('goals')
      .insert([{ user_id: req.user.id, app_name: appName, daily_limit_minutes: dailyLimitMinutes }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get goals
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('active', true);

    if (error) throw error;
    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;