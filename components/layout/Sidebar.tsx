
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getNavLinks } from '../../constants';
import { UserRole } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowLeftOnRectangleIcon } from '../icons/Icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuthStore();
  const navLinks = getNavLinks(user?.role || UserRole.PATIENT);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05 + 0.2,
      },
    }),
  };

  const activeLinkStyle = {
    backgroundColor: '#A2D2FF',
    color: '#334155',
  };

  const renderLinks = () => navLinks.map((link, i) => (
    <motion.li key={link.href} custom={i} variants={navItemVariants}>
      <NavLink
        to={link.href}
        onClick={() => setIsOpen(false)}
        style={({ isActive }) => (isActive ? activeLinkStyle : {})}
        className="flex items-center p-3 my-1 rounded-lg text-brand-text-light hover:bg-brand-primary-light hover:text-brand-text transition-colors duration-200"
      >
        <span className="w-6 h-6 mr-3">{link.icon}</span>
        <span className="font-medium">{link.label}</span>
      </NavLink>
    </motion.li>
  ));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 md:z-auto bg-brand-surface w-64 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-brand-primary-light h-16">
            <h1 className="text-2xl font-bold text-brand-primary">Lucidia</h1>
            <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-brand-text-light">
              <XMarkIcon />
            </button>
          </div>
          <nav className="flex-1 p-4">
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
            >
              {renderLinks()}
            </motion.ul>
          </nav>
          <div className="p-4 border-t border-brand-primary-light">
            <button
              onClick={logout}
              className="w-full flex items-center p-3 rounded-lg text-brand-text-light hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
            >
              <span className="w-6 h-6 mr-3"><ArrowLeftOnRectangleIcon /></span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;