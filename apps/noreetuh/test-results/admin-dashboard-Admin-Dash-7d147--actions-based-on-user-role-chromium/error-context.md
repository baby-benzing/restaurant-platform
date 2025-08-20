# Page snapshot

```yaml
- main:
  - heading "Admin Login" [level=1]
  - text: Email
  - textbox "Email": admin@pave46.com
  - text: Password
  - textbox "Password": AdminPassword123!
  - text: Login failed
  - button "Login"
  - link "Forgot your password?":
    - /url: /auth/reset-password
- alert
```