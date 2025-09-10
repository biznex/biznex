import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import {
  Home,
  FileText,
  CreditCard,
  Boxes,
  LogOut,
  Banknote,
  ArrowLeftRight,
  IndianRupee,
  ChevronDown,
  Package,
  ChartNoAxesGantt,
  Users,
  Briefcase,
  File,
  Printer,
  Megaphone,
  IdCard,
  Calculator,
} from 'lucide-react';

function DashboardSidebar() {
  const [showFinanceSubMenu, setShowFinanceSubMenu] = useState(false);
  const [showInventorySubMenu, setShowInventorySubMenu] = useState(false);
  const [showEmployeesSubMenu, setShowEmployeesSubMenu] = useState(false);
  const [showBillingSubMenu, setShowBillingSubMenu] = useState(false);
  const [showJobsSubMenu, setShowJobsSubMenu] = useState(false);
  const [showDocumentsSubMenu, setShowDocumentsSubMenu] = useState(false);
  const [showMarketingSubMenu, setShowMarketingSubMenu] = useState(false);
  const [showEcomSubMenu, setShowEcomSubMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  


  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    if (pathname.startsWith('/dashboard/finance')) {
      setShowFinanceSubMenu(true);
    }
    if (pathname.startsWith('/dashboard/employees')) {
      setShowEmployeesSubMenu(true);
    }
    if (pathname.startsWith('/dashboard/inventory')) {
      setShowInventorySubMenu(true);
    }
    if (pathname.startsWith('/dashboard/billing')) {
      setShowBillingSubMenu(true);
    }
    if (pathname.startsWith('/dashboard/jobs')) {
      setShowJobsSubMenu(true);
    }
    if (pathname.startsWith('/dashboard/ecom')) {
      setShowEcomSubMenu(true);
    }
    if (pathname.startsWith('/dashboard/documents')) {
      setShowDocumentsSubMenu(true);
    }
    if (pathname.startsWith('/dashboard/marketing')) {
      setShowMarketingSubMenu(true);
    }

  }, [pathname]);

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div className={`flex flex-col h-full font-sans ${isClient ? 'overflow-y-auto' : ''}`}>
      <ul className="flex-grow">
        <li>
          <Link href="/dashboard">
            <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit mt-12 md:mt-4 ${isActive('/dashboard') ? 'bg-[#E0E0E0]' : ''}`}>
              <Home size={18} className="shrink-0" />
              <span>Home</span>
            </div>
          </Link>
        </li>
        <li>
          <div
            className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-[#F0F0F0] text-inherit"
            onClick={() => setShowFinanceSubMenu(!showFinanceSubMenu)}
          >
            <FileText size={18} className="shrink-0" />
            <span>Finance</span>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          {showFinanceSubMenu && (
            <ul className="pl-6">
              <li>
                <Link href="/dashboard/finance/overview">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/finance/overview') ? 'bg-[#E0E0E0]' : ''}`}>
                    <CreditCard size={18} className="shrink-0" />
                    <span>Overview</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/finance/payments">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/finance/payments') ? 'bg-[#E0E0E0]' : ''}`}>
                    <Banknote size={18} className="shrink-0" />
                    <span>Payments</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/finance/transactions">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/finance/transactions') ? 'bg-[#E0E0E0]' : ''}`}>
                    <ArrowLeftRight size={18} className="shrink-0" />
                    <span>Transactions</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/finance/salary">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/finance/salary') ? 'bg-[#E0E0E0]' : ''}`}>
                    <IndianRupee size={18} className="shrink-0" />
                    <span>Salary</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/finance/taxestimate">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/finance/taxestimate') ? 'bg-[#E0E0E0]' : ''}`}>
                    <Calculator size={18} className="shrink-0" />
                    <span>Tax Estimate</span>
                  </div>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-[#F0F0F0] text-inherit"
            onClick={() => setShowInventorySubMenu(!showInventorySubMenu)}
          >
            <Boxes size={18} className="shrink-0" />
            <span>Inventory</span>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          {showInventorySubMenu && (
            <ul className="pl-6">
              <li>
                <Link href="/dashboard/inventory/products">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/inventory/products') ? 'bg-[#E0E0E0]' : ''}`}>
                    <Package size={18} className="shrink-0" />
                    <span>Products</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/inventory/categories">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/inventory/categories') ? 'bg-[#E0E0E0]' : ''}`}>
                    <ChartNoAxesGantt size={18} className="shrink-0" />
                    <span>Categories</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/inventory/printbarcode">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/inventory/printbarcode') ? 'bg-[#E0E0E0]' : ''}`}>
                    <Printer size={18} className="shrink-0" />
                    <span>Print Barcode</span>
                  </div>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-[#F0F0F0] text-inherit"
            onClick={() => setShowEmployeesSubMenu(!showEmployeesSubMenu)}
          >
            <Users size={18} className="shrink-0" />
            <span>Employees</span>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          {showEmployeesSubMenu && (
            <ul className="pl-6">
              <li>
                <Link href="/dashboard/employees/staff">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/employees/staff') ? 'bg-[#E0E0E0]' : ''}`}>
                    <Users size={18} className="shrink-0" />
                    <span>Staff</span>
                  </div>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-[#F0F0F0] text-inherit"
            onClick={() => setShowJobsSubMenu(!showJobsSubMenu)}
          >
            <Briefcase size={18} className="shrink-0" />
            <span>Jobs</span>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          {showJobsSubMenu && (
            <ul className="pl-6">
              <li>
                <Link href="/dashboard/jobs/joblistings">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/jobs/joblistings') ? 'bg-[#E0E0E0]' : ''}`}>
                    <Briefcase size={18} className="shrink-0" />
                    <span>Job Listings</span>
                  </div>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-[#F0F0F0] text-inherit"
            onClick={() => setShowEcomSubMenu(!showEcomSubMenu)}
          >
            <FileText size={18} className="shrink-0" />
            <span>Ecom</span>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          {showEcomSubMenu && (
            <ul className="pl-6">
              <li>
                <Link href="/dashboard/ecom/subdomain">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/ecom/subdomain') ? 'bg-[#E0E0E0]' : ''}`}>
                    <FileText size={18} className="shrink-0" />
                    <span> Subdomain</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/ecom/ecomproducts">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/ecom/ecomproducts') ? 'bg-[#E0E0E0]' : ''}`}>
                    <FileText size={18} className="shrink-0" />
                    <span>Ecom Products</span>
                  </div>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-[#F0F0F0] text-inherit"
            onClick={() => setShowBillingSubMenu(!showBillingSubMenu)}
          >
            <FileText size={18} className="shrink-0" />
            <span>Billing</span>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          {showBillingSubMenu && (
            <ul className="pl-6">
              <li>
                <Link href="/dashboard/billing/createinvoice">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/billing/createinvoice') ? 'bg-[#E0E0E0]' : ''}`}>
                    <FileText size={18} className="shrink-0" />
                    <span>Create Invoice</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/billing/createbill">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/billing/createbill') ? 'bg-[#E0E0E0]' : ''}`}>
                    <FileText size={18} className="shrink-0" />
                    <span>Create Bill</span>
                  </div>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-[#F0F0F0] text-inherit"
            onClick={() => setShowDocumentsSubMenu(!showDocumentsSubMenu)}
          >
            <File size={18} className="shrink-0" />
            <span>Documents</span>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          {showDocumentsSubMenu && (
            <ul className="pl-6">
              <li>
                <Link href="/dashboard/documents/myfiles">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/documents/myfiles') ? 'bg-[#E0E0E0]' : ''}`}>
                    <File size={18} className="shrink-0" />
                    <span>My Files</span>
                  </div>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-[#F0F0F0] text-inherit"
            onClick={() => setShowMarketingSubMenu(!showMarketingSubMenu)}
          >
            <Megaphone size={18} className="shrink-0" />
            <span>Marketing</span>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          {showMarketingSubMenu && (
            <ul className="pl-6">
              <li>
                <Link href="/dashboard/marketing/businesscard">
                  <div className={`flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit ${isActive('/dashboard/marketing/businesscard') ? 'bg-[#E0E0E0]' : ''}`}>
                    <IdCard size={18} className="shrink-0" />
                    <span>Business Card</span>
                  </div>
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
      <div className="mb-4">
        <Link href="/">
          <div className="flex items-center space-x-3 p-2 rounded hover:bg-[#F0F0F0] text-inherit">
            <LogOut size={18} className="shrink-0" />
            <span>Back to Biznex</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default DashboardSidebar;