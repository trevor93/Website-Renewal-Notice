# Automatic Monthly Site Management Setup

## Overview
Your Salmin Hosting Admin Portal now includes automatic monthly site management. Sites are automatically deactivated 30 days after their last payment date.

## How It Works

### 1. Automatic Deactivation (30 Days)
- **Trigger**: Daily automated check
- **Action**: Sites with payment dates older than 30 days are automatically:
  - Set to `payment_status = "unpaid"`
  - Set to `site_active = false`
- **Exception**: Sites with `manual_override = true` are NOT affected

### 2. Automatic Reactivation (Payment Received)
- **Trigger**: Payment webhook from n8n
- **Action**: When payment is received, the site is automatically:
  - Set to `payment_status = "paid"`
  - Set to `site_active = true`
  - `payment_date` updated to current date

## Setting Up n8n Automation

### Daily Check Workflow (Recommended)

1. **Create a Schedule Trigger in n8n**
   - Frequency: Every day at 2:00 AM
   - Or use a Cron expression: `0 2 * * *`

2. **Add HTTP Request Node**
   - Method: POST
   - URL: `https://[your-supabase-project].supabase.co/functions/v1/check-expired-clients`
   - Headers:
     ```json
     {
       "Authorization": "Bearer [your-anon-key]"
     }
     ```

3. **Response Handling**
   The endpoint returns:
   ```json
   {
     "success": true,
     "message": "Deactivated X expired client(s)",
     "checked": "2025-10-27T02:00:00Z",
     "deactivated": 2,
     "clients": [
       {
         "site_name": "Example Site",
         "domain_name": "example.com",
         "payment_date": "2025-09-27"
       }
     ]
   }
   ```

4. **Optional: Email Notification**
   Add an email node to notify clients when their site is deactivated:
   - To: Client email (from response)
   - Subject: "Action Required: Your hosting payment is overdue"
   - Body: Custom template with payment instructions

### Payment Received Workflow

1. **Webhook Trigger in n8n**
   - Listen for payment confirmation from PayPal/Stripe/Manual entry

2. **HTTP Request to Reactivate Site**
   - Method: POST
   - URL: `https://[your-supabase-project].supabase.co/functions/v1/n8n-payment-webhook`
   - Headers:
     ```json
     {
       "Authorization": "Bearer [your-anon-key]",
       "Content-Type": "application/json"
     }
     ```
   - Body:
     ```json
     {
       "domain": "aquablisswaters.com",
       "payment_status": "paid",
       "payment_date": "2025-10-27"
     }
     ```

3. **Optional: Send Confirmation Email**
   - To: Client email
   - Subject: "Payment Received - Your site is now active"
   - Body: Confirmation with next renewal date

## Manual Control

To prevent automatic deactivation for specific clients:

1. Go to the Clients tab in your admin portal
2. Toggle the site using the Manual Control switch
3. This sets `manual_override = true` and the automation will skip this client

## Current Status

✅ **Active**: AquaBliss Water
- Domain: aquablisswaters.com
- Email: victormogeni34@gmail.com
- Payment Date: 2025-10-27 (Today)
- Status: Paid & Active
- Next Check: 2025-11-26 (30 days from today)

## Testing the Automation

To test the automatic check manually, you can call the endpoint directly:

```bash
curl -X POST \
  https://[your-supabase-project].supabase.co/functions/v1/check-expired-clients \
  -H "Authorization: Bearer [your-anon-key]"
```

## Webhook Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/functions/v1/check-expired-clients` | POST | Check and deactivate expired clients |
| `/functions/v1/n8n-payment-webhook` | POST | Reactivate site on payment received |

## Support

For questions or issues with the automation setup, refer to:
- N8N_INTEGRATION.md - n8n workflow examples
- ADMIN_PORTAL_GUIDE.md - Admin portal usage guide
