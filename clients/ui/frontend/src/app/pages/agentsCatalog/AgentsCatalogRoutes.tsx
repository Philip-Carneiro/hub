import * as React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AgentsCatalog from './screens/AgentsCatalog';
import AgentDetailsPage from './screens/AgentDetailsPage';

const AgentsCatalogRoutes: React.FC = () => (
  <Routes>
    <Route path="/*" element={<Outlet />}>
      <Route index element={<AgentsCatalog />} />
      <Route path=":agentName" element={<Navigate to="overview" replace />} />
      <Route path=":agentName/overview" element={<AgentDetailsPage />} />
      <Route path="*" element={<Navigate to="." />} />
    </Route>
  </Routes>
);

export default AgentsCatalogRoutes;
