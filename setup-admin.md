# Admin Setup Instructions

This portal uses Supabase Authentication for admin login.

## Creating the Admin User

To create the admin user account, follow these steps:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add User** > **Create new user**
4. Enter the following details:
   - **Email**: `admin@salminhosting.com`
   - **Password**: `NimlasKe93` (or choose a secure password)
   - **Auto Confirm User**: Check this box
5. Click **Create User**

### Option 2: Using SQL (Alternative)

If you prefer, you can create the user directly via SQL, but Option 1 is simpler and recommended for security.

## Login Credentials

Once created, you can login to the portal with:
- **Email**: salminabdalla93@gmail.com
- **Password**: NimlasKe93 (or the password you set)

## Demo Client Data

The database has been pre-seeded with three demo clients:
1. **Aqua Bliss Waters** (aquablisswaters.com) - $14.99 - PAID ✓
2. **Injaaz** (injaaz.netlify.app) - $63.00 - NOT PAID ✗
3. **Jaylocs** (jaylocs.netlify.app) - $29.99 - PAID ✓

## Testing the Portal

1. Create the admin user using Option 1 above
2. Navigate to your portal URL
3. Login with admin credentials
4. Test suspend/reactivate functionality on the demo clients
5. Check the email notification simulation when reactivating a site

## Production Notes

- Change the admin password immediately after first login
- Update email notification logic to connect with your n8n workflow
- Configure webhooks in the Settings tab for automation
