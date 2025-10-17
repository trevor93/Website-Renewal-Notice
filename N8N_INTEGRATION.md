# n8n AI Agent Integration Guide

This document explains how to integrate your n8n AI agent with the Hosting/Domain Provider Admin Portal to automatically update client payment status and site activation.

## Webhook Endpoint

The admin portal includes a webhook endpoint that n8n can call to update client information in real-time.

**Endpoint URL:**
```
https://[your-supabase-project].supabase.co/functions/v1/n8n-payment-webhook
```

Replace `[your-supabase-project]` with your actual Supabase project reference ID.

## Request Format

### HTTP Method
`POST`

### Headers
```
Content-Type: application/json
```

### Request Body

Send a JSON payload with the following fields:

```json
{
  "domain": "example.com",
  "payment_status": "paid",
  "payment_date": "2025-10-17"
}
```

#### Required Fields

- `domain` (string, required): The domain name of the client to update. Must match exactly with the domain stored in the database.

#### Optional Fields

- `payment_status` (string, optional): The payment status. Valid values:
  - `"paid"` - Marks payment as complete and automatically activates the site (unless manual override is enabled)
  - `"unpaid"` - Marks payment as incomplete and automatically deactivates the site (unless manual override is enabled)

- `payment_date` (string, optional): The date of the payment in YYYY-MM-DD format (e.g., "2025-10-17")

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Client updated successfully",
  "client": {
    "id": "uuid",
    "site_name": "Example Site",
    "domain_name": "example.com",
    "email": "client@example.com",
    "payment_status": "paid",
    "payment_date": "2025-10-17",
    "site_active": true,
    "manual_override": false,
    "created_at": "2025-10-17T10:00:00.000Z",
    "updated_at": "2025-10-17T12:00:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request** - Missing required field
```json
{
  "error": "Domain is required"
}
```

**404 Not Found** - Client not found
```json
{
  "error": "Client not found"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "Error message details"
}
```

## Automatic Site Activation Logic

The webhook automatically manages site activation based on payment status:

1. **When `payment_status` is set to `"paid"`:**
   - If `manual_override` is `false`, the site is automatically activated
   - If `manual_override` is `true`, the site activation status is NOT changed (admin has manual control)

2. **When `payment_status` is set to `"unpaid"`:**
   - If `manual_override` is `false`, the site is automatically deactivated
   - If `manual_override` is `true`, the site activation status is NOT changed (admin has manual control)

## Manual Override

Admins can toggle the "Manual Control" switch in the portal to override automatic activation/deactivation. When manual override is enabled:

- The webhook will still update payment status and payment date
- Site activation status will NOT be changed by the webhook
- Only the admin can manually toggle site activation using the portal interface

## Real-Time Updates

The admin portal uses Supabase real-time subscriptions to instantly reflect changes made by the webhook. When n8n updates a client's payment status:

1. The webhook updates the database
2. The portal automatically refreshes the client list
3. All connected admin sessions see the update immediately

## Example n8n Workflow

Here's a simple example of how to configure an n8n HTTP Request node:

**HTTP Request Node Configuration:**
- Method: POST
- URL: `https://[your-project].supabase.co/functions/v1/n8n-payment-webhook`
- Body Content Type: JSON
- Body:
```json
{
  "domain": "{{ $json.domain }}",
  "payment_status": "paid",
  "payment_date": "{{ $now.format('yyyy-MM-dd') }}"
}
```

## Testing the Webhook

You can test the webhook using curl:

```bash
curl -X POST https://[your-project].supabase.co/functions/v1/n8n-payment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "aquablisswaters.com",
    "payment_status": "paid",
    "payment_date": "2025-10-17"
  }'
```

## Current Clients

The portal is pre-configured with three clients:

1. **AquaBliss Water**
   - Domain: `aquablisswaters.com`
   - Email: victormogeni34@gmail.com

2. **Injaaz**
   - Domain: `injaaz.netlify.app`
   - Email: salminabdalla93@gmail.com

3. **Jaylocs**
   - Domain: `jaylocs.netlify.app`
   - Email: salminabdalla93@gmail.com

## Security Notes

- The webhook is configured as a public endpoint (no JWT verification required)
- This allows n8n to call it without authentication
- The webhook uses the Supabase service role key internally for database access
- Only authorized operations (updating clients) are permitted

## Support

For issues or questions about the webhook integration, check the Edge Function logs in your Supabase project dashboard under Functions > n8n-payment-webhook > Logs.
