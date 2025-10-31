// ========================================
// SITE ACTIVATION CHECK UTILITY
// Checks if a client site is active in Supabase
// ========================================

const SUPABASE_URL = 'https://dflmgfymcsiaefgdevdh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbG1nZnltY3NpYWVmZ2RldmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTg3NjEsImV4cCI6MjA3NjIzNDc2MX0.2WtCwfstAfLateKHBGdixR6lX4Xjit5uf0atTDqDcUQ';

/**
 * UPDATED: Added Authorization Bearer token to fix 401 Unauthorized errors
 * Fetch requests now include both 'apikey' and 'Authorization' headers
 */
async function checkSiteActivation(domainName) {
  const cacheKey = `site_status_${domainName}`;
  const cacheTTL = 5 * 60 * 1000; // 5 minutes

  try {
    // Check localStorage cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { status, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < cacheTTL) {
        console.log(`[Activation] Using cached status for ${domainName}: ${status}`);
        return status === 'active';
      }
    }

    // Fetch fresh status from Supabase
    console.log(`[Activation] Fetching status for ${domainName}...`);
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/clients?domain_name=eq.${domainName}&select=site_active`,
      {
        headers: {
          // FIX 1: Added Authorization Bearer token (was missing, causing 401 error)
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    // FIX 2: Improved error handling for non-OK responses
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch site activation status`);
    }

    const data = await response.json();
    const isActive = data.length > 0 ? data[0].site_active : true;

    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      status: isActive ? 'active' : 'inactive',
      timestamp: Date.now()
    }));

    console.log(`[Activation] Status for ${domainName}: ${isActive ? 'active' : 'inactive'}`);
    return isActive;

  } catch (error) {
    console.warn(`[Activation] Error checking status for ${domainName}:`, error);

    // Fallback to cached value if available
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { status } = JSON.parse(cached);
        console.log(`[Activation] Using stale cache for ${domainName}: ${status}`);
        return status === 'active';
      }
    } catch (cacheError) {
      // localStorage access may fail in sandboxed iframe without allow-same-origin
      console.warn('[Activation] Cannot access localStorage, defaulting to active');
    }

    // Default to active if all else fails (safe default: show the site)
    return true;
  }
}

/**
 * Initialize site activation check on page load
 * Redirects to renewal notice if site is inactive
 */
function initializeSiteActivation(domainName) {
  console.log(`[Activation] Initializing for ${domainName}`);

  checkSiteActivation(domainName).then(isActive => {
    if (!isActive) {
      console.log(`[Activation] Site is inactive, redirecting to renewal notice`);
      window.location.href = '/renewal_notice/index.html';
    } else {
      console.log(`[Activation] Site is active, allowing access`);
    }
  }).catch(error => {
    console.error('[Activation] Error in initialization:', error);
    // Default to active if initialization fails
  });
}

// Expose functions to global scope for client sites to use
window.siteActivation = {
  checkSiteActivation,
  initializeSiteActivation
};
