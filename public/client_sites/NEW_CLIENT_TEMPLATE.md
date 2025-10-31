# Adding New Client Sites

## How to Add Your Client's Website

Follow these steps to add a new client site to your portal:

### 1. Create Client Folder
Create a new folder in `/public/client_sites/` with the client's domain name:
```
/public/client_sites/yourdomain.com/
```

### 2. Add Client Files
Place all your client's website files in this folder:
```
/public/client_sites/yourdomain.com/
├── index.html
├── styles/
├── images/
├── js/
└── ... (other files)
```

### 3. Add Activation Check to index.html
At the top of your client's `index.html` file, add these two lines inside the `<head>` tag:

```html
<script src="/utils/siteActivation.js"></script>
<script>
    window.siteActivation.initializeSiteActivation('yourdomain.com');
</script>
```

Replace `yourdomain.com` with your actual domain name.

### 4. Register Client in Admin Portal
1. Go to your Admin Portal
2. Click "Add Client" button in Client Management
3. Enter:
   - **Site Name**: Client's business name
   - **Domain Name**: yourdomain.com (must match the folder name)
   - **Email**: Client's contact email
   - **Monthly Fee**: Amount to charge monthly

### 5. How Activation/Deactivation Works

**When you click "Deactivate" in Admin Portal:**
- Site status is updated in Supabase
- Client's website automatically redirects to the renewal notice page
- Your PayPal payment link is displayed

**When you click "Activate" in Admin Portal:**
- Site status is updated in Supabase
- Client's website loads normally again

**How it works:**
- The `siteActivation.js` script checks the client's status every time the page loads
- It caches the status locally for 5 minutes to reduce API calls
- If site is inactive, user is redirected to `/renewal_notice/index.html`
- If site is active, website displays normally

### Example Setup

For a client at `myclient.com`:

1. Create folder: `/public/client_sites/myclient.com/`
2. Add their website files there
3. In their `index.html`, add:
   ```html
   <script src="/utils/siteActivation.js"></script>
   <script>
       window.siteActivation.initializeSiteActivation('myclient.com');
   </script>
   ```
4. In Admin Portal, add new client with domain: `myclient.com`

### Troubleshooting

**Site not redirecting to renewal notice:**
- Check that domain name matches exactly in the script and Admin Portal
- Verify the client status is set to "inactive" in the Clients table
- Check browser cache (do a hard refresh: Ctrl+F5 or Cmd+Shift+R)

**Getting 404 errors:**
- Make sure client files are in correct folder: `/public/client_sites/yourdomain.com/`
- Verify `index.html` file exists in the client folder

**PayPal button not working:**
- Verify the link URL is correct
- Check that popup blockers aren't preventing the new window
