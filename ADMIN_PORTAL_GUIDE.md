# Admin Portal Quick Reference Guide

## Overview

Your Hosting/Domain Provider Admin Portal is now fully integrated with backend management and n8n AI agent support. The portal manages three client websites with real-time updates and manual override capabilities.

## Current Clients

| Site Name | Domain | Email |
|-----------|--------|-------|
| AquaBliss Water | aquablisswaters.com | victormogeni34@gmail.com |
| Injaaz | injaaz.netlify.app | salminabdalla93@gmail.com |
| Jaylocs | jaylocs.netlify.app | salminabdalla93@gmail.com |

## Key Features

### 1. Real-Time Dashboard
- View total clients, active sites, paid clients, and unpaid clients at a glance
- Statistics update automatically when data changes
- Clean white/gold themed interface

### 2. Client Management Table
The Clients tab displays comprehensive information for each site:

**Columns:**
- **Site Name**: The business/site name with a visual status indicator (green = active, red = inactive)
- **Domain**: Clickable link to visit the client's website
- **Email**: Clickable mailto link to contact the client
- **Status**: Payment status badge (Paid/Unpaid)
- **Payment Date**: Last payment date or "Never" if no payment recorded
- **Site Active**: Current activation status with manual override indicator
- **Manual Control**: Toggle switch to manually activate/deactivate sites

### 3. Manual Override Toggle
Each client has a toggle switch that allows you to:
- **Toggle ON (Green)**: Manually activate the site
- **Toggle OFF (Gray)**: Manually deactivate the site

When you use the manual toggle:
- The site immediately activates/deactivates
- A "(Manual)" indicator appears next to the site status
- The n8n webhook will NO LONGER automatically change the site activation
- Payment status can still be updated by n8n, but site activation stays under your manual control

### 4. Automatic n8n Integration
The portal includes a webhook endpoint for your n8n AI agent:

**Webhook URL:**
```
https://[your-supabase-project].supabase.co/functions/v1/n8n-payment-webhook
```

**What n8n Can Do:**
- Update payment status (paid/unpaid)
- Update payment date
- Automatically activate/deactivate sites based on payment status
- Updates appear in the portal instantly (no refresh needed)

**Automatic Activation Logic:**
- When n8n marks a payment as "paid" → Site automatically activates
- When n8n marks a payment as "unpaid" → Site automatically deactivates
- If manual override is enabled → n8n cannot change site activation (only you can)

### 5. Real-Time Updates
The portal uses Supabase real-time subscriptions:
- Changes from n8n appear instantly
- No need to refresh the page
- All admin sessions stay synchronized

## Common Workflows

### Workflow 1: n8n Receives Payment
1. n8n AI agent detects payment from client
2. n8n calls webhook with payment details
3. Database updates payment status to "paid"
4. If manual override is OFF: Site automatically activates
5. Portal updates instantly to show new status

### Workflow 2: Manual Override for Special Case
1. Client requests temporary access before payment
2. You enable the manual toggle in the portal
3. Site activates immediately
4. "(Manual)" indicator appears
5. Even if payment is unpaid, site stays active
6. Later, when payment is received, you can toggle manual override OFF

### Workflow 3: Handling Unpaid Client
1. Payment deadline passes
2. n8n marks payment as "unpaid"
3. If manual override is OFF: Site automatically deactivates
4. Portal shows site as inactive with red indicators
5. Client's site goes offline until payment is received

## Visual Indicators

### Status Indicators
- **Green Pulsing Dot**: Site is active
- **Red Pulsing Dot**: Site is inactive
- **Green Badge**: Payment status is "Paid"
- **Red Badge**: Payment status is "Unpaid"
- **"(Manual)" Label**: Manual override is enabled

### Toggle Switch States
- **Green (Right Position)**: Site is active
- **Gray (Left Position)**: Site is inactive
- **Spinning Icon**: Operation in progress

## Security & Data

### Database Structure
- **Secure Authentication**: Only logged-in admins can access the portal
- **Row Level Security**: All database tables are protected
- **Real-Time Sync**: Changes propagate instantly across all sessions

### Manual Override Flag
- Stored in database as `manual_override` field
- Prevents n8n from overriding your manual decisions
- You can toggle it on/off at any time

### Payment Tracking
- `payment_status`: Current payment status (paid/unpaid)
- `payment_date`: Last payment date
- `site_active`: Whether site is currently active
- `manual_override`: Whether manual control is enabled

## Tips & Best Practices

1. **Use Manual Override Sparingly**: Let n8n handle automatic activation/deactivation for normal operations
2. **Check the Dashboard First**: Get a quick overview before diving into client details
3. **Watch for Manual Indicators**: If you see "(Manual)", remember that n8n won't auto-deactivate that site
4. **Test the Webhook**: Use the curl command in N8N_INTEGRATION.md to test webhook functionality
5. **Monitor Real-Time Updates**: Watch the portal when n8n sends updates to verify integration is working

## Troubleshooting

### Site Not Activating After Payment
- Check if manual override is enabled (look for "(Manual)" label)
- Verify n8n sent the correct domain name to the webhook
- Check payment status in the portal

### Changes Not Appearing in Portal
- Verify you're logged in
- Check your internet connection
- Refresh the page if real-time sync fails

### Manual Toggle Not Working
- Ensure you're authenticated
- Check if there's a spinning icon (operation in progress)
- Try refreshing the page

## Next Steps

1. Configure your n8n AI agent with the webhook URL
2. Test the integration with a sample payment update
3. Monitor the dashboard for real-time updates
4. Use manual override when needed for special cases

For detailed n8n integration instructions, see `N8N_INTEGRATION.md`.
