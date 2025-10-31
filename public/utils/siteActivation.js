const SUPABASE_URL = 'https://dflmgfymcsiaefgdevdh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbG1nZnltY3NpYWVmZ2RldmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyMDE0NDUsImV4cCI6MTk4MTc3NzQ0NX0.7Ot7oDm8_0lNjkqmPcwPvOc1hKr-JvLPANxqX6YrN8w';

async function checkSiteActivation(domainName) {
  const cacheKey = `site_status_${domainName}`;
  const cacheTTL = 5 * 60 * 1000;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { status, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTTL) {
        return status === 'active';
      }
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/clients?domain_name=eq.${domainName}&select=site_active`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Accept': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const isActive = data.length > 0 ? data[0].site_active : true;

      localStorage.setItem(cacheKey, JSON.stringify({
        status: isActive ? 'active' : 'inactive',
        timestamp: Date.now()
      }));

      return isActive;
    } else {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { status } = JSON.parse(cached);
        return status === 'active';
      }
      return true;
    }
  } catch (error) {
    console.warn('Error checking site activation:', error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { status } = JSON.parse(cached);
      return status === 'active';
    }
    return true;
  }
}

function initializeSiteActivation(domainName) {
  checkSiteActivation(domainName).then(isActive => {
    if (!isActive) {
      window.location.href = '/renewal_notice/index.html';
    }
  });
}

window.siteActivation = { checkSiteActivation, initializeSiteActivation };
