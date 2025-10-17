# Application Routing Guide

## Routes

### Client Renewal Notice (Public)
- **URL:** `/` or `/#/client`
- **Description:** White & gold themed client renewal template with PayPal payment option
- **Features:**
  - Clean, professional design with white background and gold accents (#d4af37)
  - Provider login icon in top-right corner
  - Website renewal notice with service details
  - PayPal payment integration placeholder
  - Contact information for Salmin Abdalla

### Provider Portal (Protected)
- **URL:** `/#/portal`
- **Description:** Admin dashboard for Salmin Abdalla to manage clients
- **Features:**
  - Login authentication required
  - Dashboard with statistics
  - Client management table
  - Settings page
  - Email notification system

## Navigation

### From Client View to Provider Portal
Click the **Provider Login** button (gold icon with "Provider Login" text) in the top-right corner of the client renewal page.

### From Provider Portal to Client View
Navigate to `/#/client` or `/#/` in your browser.

## Technical Details

- Uses hash-based routing (`window.location.hash`)
- No external routing library required
- Client view is public and accessible without authentication
- Provider portal requires Supabase authentication
