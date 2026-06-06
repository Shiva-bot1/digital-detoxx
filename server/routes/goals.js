const router   = require('express').Router();
const auth     = require('../middleware/auth');
const supabase = require('../supabase');

// Set goal
router.post('/', auth, async (req, res) => {
  try {
    const { appName, dailyLimitMinutes } = req.body;

    const { data, error } = await supabase
      .from('goals')
      .insert([{
        user_id:             req.user.id,
        app_name:            appName,
        daily_limit_minutes: dailyLimitMinutes,
      }])
      .select()
      .single();

    if (error) {
      console.error('Goal insert error:', error);
      return res.status(500).json({ message: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error('Goal route error:', err);
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

    if (error) {
      console.error('Goal fetch error:', error);
      return res.status(500).json({ message: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error('Goal fetch route error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;