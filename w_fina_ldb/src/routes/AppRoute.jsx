import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import Login from '../pages/Login';
import { AuthProvider } from '@/hooks/auth/useAuth';

import Layout_data_entry from '@/LayOut/Layout_data_entry';
import Data_entry from '@/pages/data_entry/Data_entry';
import Follow_status from '@/pages/data_entry/Follow_status';
import EditApplicant from '@/pages/EditApplicant';

import Verifier_confirm from '@/pages/verifier/Verifier_confirm';
import Layout_verifier from '@/LayOut/Layot_verifier';
import Issued from '@/pages/verifier/Issued';
import Received from '@/pages/verifier/Received';
import View_log from '@/pages/verifier/View_log';
import Dasdbord from '@/pages/admin/Dasdbord';
import Dasdbord_admin from '@/LayOut/Dasdbord_admin';
import Audit_Log from '@/pages/admin/page/Audit_Log';
import Management from '@/pages/admin/page/Management';
import LayOut_Management from '@/LayOut/LayOut_Management';
import Provinces from '@/pages/admin/page/Provinces';
import Districts from '@/pages/admin/page/Districts';
import { Employee } from '@/pages/admin/page/Employee';

// Wrapper component that provides Auth context with stable navigation
const RootLayout = () => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  // Keep the ref updated with the latest navigate function
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  return (
    <AuthProvider navigateRef={navigateRef}>
      <Outlet />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Login /> },
      {
        path: 'data-entry',
        element: <Layout_data_entry />,
        children: [
          { path: 'applicants', element: <Data_entry /> },
          { path: 'status', element: <Follow_status /> },
          { path: 'edit/:id', element: <EditApplicant /> },
        ]
      },
      {
        path: 'admin-dasdbord',
        element: <Dasdbord_admin />,
        children: [
          { index: true, element: <Audit_Log /> },
          {
            path: 'management',
            element: <LayOut_Management />,
            children: [
              { index: true, element: <Provinces /> },
              { path: 'districts', element: <Districts /> },
              { path: 'employee', element: <Employee /> },
            ]
          }
        ]
      },
      {
        path: 'verifier',
        element: <Layout_verifier />,
        children: [
          { path: 'verifie-check', element: <Verifier_confirm /> },
          { path: 'verifie-issued', element: <Issued /> },
          { path: 'verifie-received', element: <Received /> },
          { path: 'verifie-view-log', element: <View_log /> },
        ]
      },
    ]
  }
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;
