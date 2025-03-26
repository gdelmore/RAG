File Structure and Organization
Project Structure
src/
├── api/
│   ├── axiosConfig.js
│   └── services/
│       ├── auth.js
│       ├── dashboard.js
│       ├── fileAnalysis.js
│       ├── tenant.js
│       └── user.js
├── assets/
│   ├── icons/
│   │   ├── index.js
│   │   ├── GoogleIcon.jsx
│   │   ├── MicrosoftIcon.jsx
│   │   └── AppleIcon.jsx
│   └── images/
│       └── airiam-logo.svg
├── components/
│   ├── admin/
│   │   ├── TenantList.jsx
│   │   └── UserManagement.jsx
│   ├── auth/
│   │   ├── EmailPasswordForm.jsx
│   │   ├── LoginPage.jsx
│   │   ├── OAuthLoginButton.jsx
│   │   └── RegisterPage.jsx
│   ├── chat/
│   │   ├── ChatContainer.jsx
│   │   ├── ChatLayout.jsx
│   │   └── ChatSidebar.jsx
│   ├── common/
│   │   ├── Avatar.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── EmptyState.jsx
│   │   ├── LoadingIndicator.jsx
│   │   ├── PageHeader.jsx
│   │   ├── PeriodSelector.jsx
│   │   └── StatsCard.jsx
│   ├── dashboard/
│   │   ├── ActivityLog.jsx
│   │   ├── CreditConsumption.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── QueryDistribution.jsx
│   │   ├── TopDocuments.jsx
│   │   └── UsageStats.jsx
│   ├── file-analysis/
│   │   ├── CloudStorageConnector.jsx
│   │   ├── FileAnalysisPage.jsx
│   │   ├── FileAnalysisResults.jsx
│   │   ├── FileList.jsx
│   │   └── FileUploader.jsx
│   └── layout/
│       ├── Header.jsx
│       ├── MainLayout.jsx
│       └── Sidebar.jsx
├── contexts/
│   ├── TenantContext.jsx
│   └── ThemeContext.jsx
├── redux/
│   ├── slices/
│   │   ├── adminSlice.js
│   │   ├── authSlice.js
│   │   ├── chatSlice.js
│   │   ├── dashboardSlice.js
│   │   └── fileSlice.js
│   └── store.js
├── utils/
│   └── helpers.js
├── App.jsx
├── index.jsx
└── index.css

API Services Structure
The API services should be implemented with these functions:
- auth.js: login, register, forgotPassword, resetPassword
- dashboard.js: getUsageStats, getCreditConsumption, getQueryDistribution, getTopDocuments, getActivityLog
- fileAnalysis.js: uploadFile, getFileAnalysis, listFiles, connectCloudStorage, listCloudFiles, analyzeCloudFile
- tenant.js: listTenants, createTenant, deleteTenant, fetchTenantConfig
- user.js: getUsersByTenant, createUser, updateUser, deleteUser, assignUserRole, removeUserRole

