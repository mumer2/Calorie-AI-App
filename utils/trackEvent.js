export const trackEvent = async (eventName, userId) => {
  try {
    await fetch('https://your-site.netlify.app/.netlify/functions/umeng-track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        event: eventName,
        timestamp: Date.now(),
      }),
    });
  } catch (err) {
    console.error('Failed to track event:', err);
  }
};
