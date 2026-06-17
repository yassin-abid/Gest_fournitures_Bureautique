# 🔐 DEMO LOGIN CREDENTIALS

The frontend now supports **mock login without needing a backend server** during development!

---

## 📝 Demo Credentials

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | `admin@example.com` | `admin123` | Full system access, user management |
| **Manager** | `manager@example.com` | `manager123` | Purchase manager, approve requests |
| **Employee** | `employee@example.com` | `employee123` | Create requests, view data |
| **Viewer** | `viewer@example.com` | `viewer123` | Read-only access |

---

## ✅ How It Works

### Automatic Fallback to Mock Login

1. **If backend is running** → Uses real API authentication
2. **If backend is DOWN** → Automatically uses mock login for demo credentials
3. **Invalid credentials** → Shows error (simulates real behavior)

### What Happens When You Login

✅ Uses mock credentials (if they match)  
✅ Simulates 800ms network delay  
✅ Generates mock JWT token  
✅ Stores token in localStorage  
✅ Logs you in with the specified role  

---

## 🚀 Try It Now

1. Open frontend at `http://localhost:5173`
2. Click "Login"
3. Enter any demo credential from the table above
4. Click "Sign In"
5. You should be logged in with that role! ✅

---

## 🎯 What You Can Do After Login

### With Admin Account
- ✅ Access all pages
- ✅ Manage users
- ✅ Configure system settings
- ✅ View all reports

### With Manager Account
- ✅ View and approve requests
- ✅ Manage purchase orders
- ✅ Access catalog
- ✅ View reports

### With Employee Account
- ✅ Create requests
- ✅ View own requests
- ✅ Browse catalog
- ✅ View basic dashboard

### With Viewer Account
- ✅ Read-only access
- ✅ View dashboard
- ✅ View catalog (read-only)
- ✅ View reports

---

## 🔄 Backend Integration

When you're ready to integrate with the real backend:

1. **Start your backend API** at `http://localhost:3000`
2. **The frontend will automatically switch** to using real API
3. **Demo credentials will no longer work** (use real user accounts)
4. **JWT tokens will be validated** by backend

---

## 💡 Troubleshooting

### Login still shows connection error?
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

**Solution:** 
- Clear browser cache and reload
- Press `Ctrl+Shift+Delete` → Clear browsing data
- Close and reopen browser tab
- Restart dev server: `npm run dev`

### Mock login not working?
- Make sure you're using exact credentials from the table
- Check spelling and case (email is case-sensitive)
- Password must match exactly (including spaces if any)

### Want to test with fake data?
- All pages use mock data stores
- Navigate around and explore all features
- The app is fully functional without a backend
- Perfect for frontend testing and UI/UX validation

---

## 📊 Mock Data Available

The frontend includes mock data for:

- ✅ Articles and supplies
- ✅ Stock levels
- ✅ Historical requests
- ✅ Purchase orders
- ✅ Reports and analytics
- ✅ User list (for admin panel)
- ✅ System settings
- ✅ Activity logs

---

## 🎯 Development Workflow

### 1. Test Frontend Features
```bash
npm run dev
# Use demo login to explore all pages
```

### 2. Test Navigation & UI
- Login with different roles
- See how UI changes based on role
- Test all pages and features
- Check responsive design

### 3. When Backend is Ready
- Update `VITE_API_URL` in `.env.local`
- Replace mock functions with real API calls
- Demo login will no longer work (expected)
- Use real user accounts instead

---

## 🔧 Customizing Demo Credentials

To add more demo accounts or change credentials:

**File:** `src/services/authService.ts` (lines 8-14)

```typescript
const DEMO_CREDENTIALS = {
  'admin@example.com': { password: 'admin123', role: 'admin' },
  'manager@example.com': { password: 'manager123', role: 'manager' },
  'employee@example.com': { password: 'employee123', role: 'employee' },
  'viewer@example.com': { password: 'viewer123', role: 'viewer' },
  // Add more here:
  'test@example.com': { password: 'test123', role: 'employee' },
};
```

---

## 🎊 Ready to Explore!

You can now:

1. ✅ Run the frontend without backend
2. ✅ Login with demo credentials
3. ✅ Explore all pages and features
4. ✅ Test UI/UX with full mock data
5. ✅ Prepare for backend integration

**Start exploring:** `npm run dev` → Login → Enjoy! 🚀

---

**Note:** This mock login is for development only. In production, real authentication will be required.
