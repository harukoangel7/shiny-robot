GHS / AAK DISTRICT STAFF USER REGISTRATION + ADMIN DASHBOARD

WHAT'S INCLUDED
- Registration form styled to closely match the supplied screenshots: numbered green circles, white cards, rounded inputs, compact typography and Ghana Health Service / AAK District branding.
- Work posting fields for authority domain, sub-district, facility, cadre, grade, position, unit and specialty.
- Multi-select assigned roles dropdown.
- Administration dashboard with summary counts, search/filter, view/edit, approve and deactivate actions.
- Google Apps Script backend storing records in the "User Registration" Google Sheet.

SETUP
1. Create/open a Google Sheet for the application.
2. Extensions > Apps Script, replace Code.gs with the supplied Code.gs.
3. Change ADMIN_KEY in Code.gs from CHANGE_THIS_ADMIN_KEY to your own administrator key.
4. Deploy > New deployment > Web app. Execute as: Me. Choose the access setting appropriate for your organisation.
5. Copy the Web app URL.
6. Open index.html and replace PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE with the Web app URL.
7. Host index.html on your website/Vercel or serve it from your preferred web host.

ADMIN DASHBOARD
Click "User administration" and enter the administrator key. The dashboard uses the Apps Script endpoint to load users. The key is entered at runtime and stored only in the browser session.

IMPORTANT SECURITY NOTE
For a production Ghana Health Service deployment, prefer Google Workspace/domain authentication or another real authentication/authorization layer rather than relying only on a client-supplied shared key. The dashboard UI is provided as a complete functional starting point, while access control should be hardened before production use.

EXISTING SHEETS
The script automatically adds the new Status / approval / deactivation / update columns if the sheet already contains the older registration columns.
