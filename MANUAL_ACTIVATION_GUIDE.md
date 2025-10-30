# Manual Website Activation/Deactivation Guide

This guide explains how to use the manual website activation/deactivation feature in your Salmin Hosting Admin Portal.

## Overview

You can now manually control whether your clients' websites display their normal content or a payment renewal notice page. This feature allows you to manage site visibility before connecting automated workflows.

## How It Works

### Database Status Control
- Each client has a `site_active` field in the database (true/false)
- When `site_active = true`: The client sees their normal website
- When `site_active = false`: The client sees a payment renewal notice page

### Real-Time Updates
- The system uses Supabase real-time subscriptions
- When you toggle the status in the Admin Portal, the client's website updates **instantly** without requiring a page refresh
- The renewal notice displays the client's specific `monthly_fee` amount

## Testing the Feature

### Step 1: Log into Admin Portal
1. Navigate to your website at `/#/portal`
2. Log in with your admin credentials

### Step 2: View Client Status
1. Go to the **Clients** tab in the Admin Portal
2. You'll see all clients with their current status:
   - Green "Active" badge = site is live
   - Red "Inactive" badge = renewal notice is showing
   - "(Manual)" label indicates manual override is active

### Step 3: Deactivate a Client Site
1. Find the client you want to test (e.g., AquaBliss Water)
2. Click the toggle switch next to their entry
3. The switch will turn gray and move to the "off" position
4. The status badge changes to "Inactive (Manual)"

### Step 4: View the Renewal Notice
1. Open a new browser tab/window
2. Navigate to the client's website (e.g., aquablisswaters.com)
3. You'll see the **Website Renewal Payment Notice** page with:
   - Red warning banner: "Website Temporarily Suspended"
   - Client's site name displayed
   - Service details with the monthly fee amount
   - PayPal payment button
   - Contact email: websiterenewalnetlify@gmail.com

### Step 5: Reactivate the Client Site
1. Return to the Admin Portal
2. Click the same toggle switch again
3. The switch turns green and moves to "on" position
4. The status badge changes to "Active (Manual)"

### Step 6: Verify Site Restoration
1. Go back to the client's website tab
2. The page automatically updates to show the normal website content
3. The renewal notice disappears completely

## Features

### Admin Portal Controls
- **Toggle Switch**: Quick on/off control for each client
- **Visual Indicators**: Color-coded badges show site status at a glance
- **Manual Override Flag**: Shows when manual control is active
- **Real-time Updates**: Dashboard and client list update automatically

### Renewal Notice Page
- **Dynamic Content**: Shows actual client name and monthly fee
- **Professional Design**: Clean, centered layout with gold/red accents
- **Service Details**: Lists all included services
- **Payment Integration**: PayPal button for instant payment
- **Contact Information**: Support email clearly displayed
- **Responsive**: Works on all devices

### Normal Client Website
- **Placeholder Content**: Professional landing page when site is active
- **Service Highlights**: Shows hosting features and benefits
- **Admin Access**: Login button for provider access
- **Branded Footer**: Salmin Hosting Services branding

## Database Fields Used

| Field | Type | Purpose |
|-------|------|---------|
| `site_active` | boolean | Controls whether site shows normal content or renewal notice |
| `manual_override` | boolean | Indicates manual control (vs automated) |
| `monthly_fee` | decimal | Amount displayed on renewal notice |
| `site_name` | text | Client's business name shown on notice |
| `domain_name` | text | Used to identify which client is viewing the site |

## Important Notes

1. **Manual vs Automated**: This is purely manual control. N8N automation will be added later.

2. **Instant Updates**: Changes take effect immediately thanks to Supabase real-time subscriptions.

3. **Domain Matching**: The system identifies clients by matching `window.location.hostname` to `domain_name` in the database.

4. **PayPal Integration**: The payment button is functional but won't automatically reactivate sites (that comes with N8N automation).

5. **Testing Locally**: When testing on localhost, the system won't find a matching client in the database, so it will show the normal placeholder website.

## Troubleshooting

### Site Not Updating After Toggle
- Check browser console for errors
- Verify Supabase connection is active
- Refresh the client's website manually

### Wrong Amount Showing
- Check the client's `monthly_fee` field in the database
- Default is $14.99 if not set

### Toggle Not Working
- Verify you're logged in as admin
- Check network tab for failed API calls
- Ensure client exists in database

## Next Steps

Once you're ready to add automation:
1. Connect N8N workflows to automatically toggle `site_active` based on payment dates
2. Set up payment webhooks to automatically reactivate sites after successful payment
3. Add email notifications for payment reminders
4. Implement scheduled checks for expired payments

---

**Need Help?**
Contact: websiterenewalnetlify@gmail.com
