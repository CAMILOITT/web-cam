import { Navigate, Outlet } from 'react-router-dom'

interface IProps {}

export default function ProtectRoute({}: IProps) {
  if (!localStorage.getItem('idRoom')) {
    return <Navigate to="/" />
  }

  return <Outlet />
}
