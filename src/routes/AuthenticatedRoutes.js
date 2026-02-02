import React from 'react';
import { Route, Routes } from "react-router-dom"
import Dashboard from '../Pages/Dashboard/Dashboard';
import CategoriesList from '../Pages/Category/CategoriesList';
import SubCategoriesList from '../Pages/Category/SubCategoryList';
import BrandsList from '../Pages/Brand/BrandsList';
import AttributeSetList from '../Pages/Attribute/AttributeSetList';
import AttributeList from '../Pages/Attribute/AttributeList';
import BannerList from '../Pages/Banner/BannerList';
import TagList from '../Pages/Tag/TagList';
import ProductTypeList from '../Pages/Product/ProductTypeList';
import TaxList from '../Pages/Tax/TaxList';
import ProductManufactureLocactionList from '../Pages/Product/ProductManufactureLocationList';
import ProductList from '../Pages/Product/ProductList';
import AddProduct from '../Pages/Product/AddProduct';
import UserFaq from '../Pages/Support/Faq/UserFaq';
import UserTermsAndCondition from '../Pages/Support/TermsAndCondition/UserTermsAndCondition';
import ProductUpdateStep2 from '../Pages/Product/ProductUpdateStep2';
import ProductUpdateStep3 from '../Pages/Product/ProductUpdateStep3';
import NotificationList from '../Pages/Notification/NotificationList';
import ProductUpdateAttribute from '../Pages/Product/ProductUpdateAtrribute';
import PermissionList from '../Pages/CommandCenter/PermissionList';
import AdminList from '../Pages/CommandCenter/AdminList';
import UserPrivacyPolicy from '../Pages/Support/PrivacyPolicy/UserPrivacyPolicy';
import ContactQueryList from '../Pages/Support/Contact/ContactQueryList';
import UserTicketList from '../Pages/SupportTickets/UserTicketList';
import TicketCategoryList from '../Pages/SupportTickets/TicketCategoryList';
import ChatBox from '../Pages/SupportTickets/ChatBox';
import ProductApproval from '../Pages/Product/ProductApproval';
import UserCookiePolicy from '../Pages/Support/CookiePolicy/UserCookiePolicy';
import UserShippingPolicy from '../Pages/Support/ShippingPolicy/ShippingPolicy';
import UserRefundAndReturn from '../Pages/Support/RefundAndReturn/RefundAndReturn';
import ProductUpdateStep1 from '../Pages/Product/ProductUpdateStep1';
import OrderList from '../Pages/Order/OrderList';
import AddComboProduct from '../Pages/Product/ComboProduct/AddComboProduct';
import ComboProductList from '../Pages/Product/ComboProduct/ComboProductList';
import ComboProductUpdateStep1 from '../Pages/Product/ComboProduct/ComboProductUpdateStep1';
import ComboProductUpdateStep2 from '../Pages/Product/ComboProduct/ComboProductUpdateStep2';
import ComboProductUpdateStep3 from '../Pages/Product/ComboProduct/ComboProductUpdateStep3';
import BulkOrderList from '../Pages/Order/BulkOrderList';
import UserList from '../Pages/User/UserList';
import VendorList from '../Pages/Vendor/VendorList';
import OrderDetails from '../Pages/Order/OrderDetails';
import StateList from '../Pages/Location/StateList';
import CityList from '../Pages/Location/CityList';
import OrderInvoice from '../Pages/Order/OrderInvoice';
import ProductDetails from '../Pages/Product/ProuctDetails';
import PincodeList from '../Pages/Location/PinCodeList';
import AreaList from '../Pages/Location/AreaList';
import BulkUpload from '../Pages/Location/BulkUpload';
import Scheme from '../Pages/Subscription/Scheme';
import SubscriptionChitDetails from '../Pages/Subscription/SubscriptionDetails';
import SubscriptionChitUsersList from '../Pages/Subscription/SubscriptionChitUsersList';
import PremiumCustomerList from '../Pages/User/PremiumCutomerList';
import RolesList from '../Pages/User/Role';
import BranchList from '../Pages/HR Management/Branches';
import DepartmentList from '../Pages/HR Management/Department';
import DesignationList from '../Pages/HR Management/Designation';
import DocumentTypeList from '../Pages/HR Management/DocumentType';
import EmployeeList from '../Pages/HR Management/Employee';
import CreateEmployee from '../Pages/HR Management/CreateEmployee';
import EditEmployee from '../Pages/HR Management/EditEmployee';
import AwardTypeList from '../Pages/HR Management/AwardType';
import AwardList from '../Pages/HR Management/AwardList';
import LeaveType from '../Pages/LeaveManagement/LeaveType';
import LeavePolicies from '../Pages/LeaveManagement/LeavePolicies';
import LeaveApplicationList from '../Pages/LeaveManagement/LeaveApplicationList';
import LeaveBalance from '../Pages/LeaveManagement/LeaveBalance';
import Shifts from '../Pages/Attendance/Shifts';
import AttendancePolicy from '../Pages/Attendance/AttendancePolicy';
import AttendanceRecord from '../Pages/Attendance/AttendanceRecord';
import AttendanceRegularization from '../Pages/Attendance/AttendanceRegularization';
import LoanCollection from '../Pages/Collection/LoanCollection';
import ProfitDashboard from '../Pages/Collection/ProfitDashboard';
import ExpenseDashboard from '../Pages/Collection/ExpenseDashboard';
import FinanceDashboard from '../Pages/Finance Management/FinanceDashboard';
import Leads from '../Pages/LeadsManagement/Leads';
import LeadStatus from '../Pages/LeadsManagement/LeadStatus';
import LeadSource from '../Pages/LeadsManagement/LeadSources';
import GenerateLead from '../Pages/LeadsManagement/GenerateLead';
import PermissionGuard from '../Components/PermissionGuard';


function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/generate-lead" element={<PermissionGuard module="Leads"><GenerateLead /></PermissionGuard>} />

      <Route path="/category-list" element={<CategoriesList />} />
      <Route path="/sub-category-list" element={<SubCategoriesList />} />

      <Route path="/attribute-set-list" element={<AttributeSetList />} />
      <Route path="/attribute-list" element={<AttributeList />} />

      <Route path="/brand-list" element={<BrandsList />} />

      <Route path="/banner-list" element={<BannerList />} />

      <Route path="/tag-list" element={<TagList />} />

      <Route path="/tax-list" element={<TaxList />} />


      <Route path="/product-type-list" element={<ProductTypeList />} />

      <Route path="/product-manufacture-location-list" element={<ProductManufactureLocactionList />} />

      <Route path="/product-list" element={<ProductList />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/product-approval/:id" element={<ProductApproval />} />
      <Route path="/update-product-step1/:id" element={<ProductUpdateStep1 />} />
      <Route path="/update-product-step2/:id" element={<ProductUpdateStep2 />} />
      <Route path="/update-product-step3/:id" element={<ProductUpdateStep3 />} />
      <Route path="/update-product-attributes/:id" element={<ProductUpdateAttribute />} />
      <Route path="/product-details/:id" element={<ProductDetails />} />


      <Route path="/faq-user-list" element={<UserFaq />} />
      <Route path="/contact-query" element={<ContactQueryList />} />

      <Route path="/notification-list" element={<NotificationList />} />

      <Route path="/permission-list" element={<PermissionGuard module="Role"><PermissionList /></PermissionGuard>} />
      <Route path="/admin-list" element={<AdminList />} />

      <Route path="/user-ticket-list" element={<UserTicketList />} />
      <Route path="/ticket-category-list" element={<TicketCategoryList />} />
      <Route path="/chat-box/:id" element={<ChatBox />} />

      <Route path="/order-list" element={<OrderList />} />
      <Route path="/bulk-order-list" element={<BulkOrderList />} />
      <Route path="/orders" element={<OrderList />} />
      <Route path="/orders/:status" element={<OrderList />} />
      <Route path="/order-details/:id" element={<OrderDetails />} />
      <Route path="/order-invoice/:id" element={<OrderInvoice />} />

      <Route path='/user-cookie-policy' element={<UserCookiePolicy />} />
      <Route path="/user-terms-condition" element={<UserTermsAndCondition />} />
      <Route path="/user-privacy-policy" element={<UserPrivacyPolicy />} />
      <Route path="/user-shipping-policy" element={<UserShippingPolicy />} />
      <Route path="/user-refund-return" element={<UserRefundAndReturn />} />

      <Route path='/add-combo-product' element={<AddComboProduct />} />
      <Route path='/combo-product-list' element={<ComboProductList />} />
      <Route path="/update-combo-product-step1/:id" element={<ComboProductUpdateStep1 />} />
      <Route path="/update-combo-product-step2/:id" element={<ComboProductUpdateStep2 />} />
      <Route path="/update-combo-product-step3/:id" element={<ComboProductUpdateStep3 />} />

      <Route path="/user-list" element={<PermissionGuard module="Users"><UserList /></PermissionGuard>} />
      <Route path="/role-list" element={<PermissionGuard module="Role"><RolesList /></PermissionGuard>} />
      <Route path='/premium-user' element={<PermissionGuard module="Users"><PremiumCustomerList /></PermissionGuard>} />

      <Route path='/vendor-list' element={<VendorList />} />

      <Route path='/state-list' element={<StateList />} />
      <Route path='/city-list' element={<CityList />} />
      <Route path='/pin-code' element={<PincodeList />} />
      <Route path='/area' element={<AreaList />} />
      <Route path='/bulk-upload' element={<BulkUpload />} />

      <Route path='/subscription-details/:id' element={<SubscriptionChitDetails />} />
      <Route path='/scheme' element={<Scheme />} />
      <Route path='/subscription-user' element={<SubscriptionChitUsersList />} />

      <Route path='/branch-list' element={<PermissionGuard module="Branches"><BranchList /></PermissionGuard>} />
      <Route path='/department-list' element={<PermissionGuard module="Department"><DepartmentList /></PermissionGuard>} />
      <Route path='/designation-list' element={<PermissionGuard module="Designation"><DesignationList /></PermissionGuard>} />
      <Route path='/document-type' element={<PermissionGuard module="Documents Type"><DocumentTypeList /></PermissionGuard>} />
      <Route path='/employee-list' element={<PermissionGuard module="Employee"><EmployeeList /></PermissionGuard>} />
      <Route path='/create-employee' element={<PermissionGuard module="Employee"><CreateEmployee /></PermissionGuard>} />
      <Route path='/edit-employee/:id' element={<PermissionGuard module="Employee"><EditEmployee /></PermissionGuard>} />
      <Route path='/award-type' element={<PermissionGuard module="Award Types"><AwardTypeList /></PermissionGuard>} />
      <Route path='/award-list' element={<PermissionGuard module="Awards"><AwardList /></PermissionGuard>} />

      <Route path='/leave-type' element={<PermissionGuard module="Leave Types"><LeaveType /></PermissionGuard>} />
      <Route path='/leave-policy' element={<PermissionGuard module="Leave Policies"><LeavePolicies /></PermissionGuard>} />
      <Route path='/leave-application' element={<PermissionGuard module="Leave Application"><LeaveApplicationList /></PermissionGuard>} />
      <Route path='/leave-balance' element={<PermissionGuard module="Leave Balance"><LeaveBalance /></PermissionGuard>} />

      <Route path='/shift' element={<PermissionGuard module="Shifts"><Shifts /></PermissionGuard>} />
      <Route path='/attendance-policy' element={<PermissionGuard module="Attendance Policy"><AttendancePolicy /></PermissionGuard>} />
      <Route path='/attendance-record' element={<PermissionGuard module="Attendance Record"><AttendanceRecord /></PermissionGuard>} />
      <Route path='/attendance-regularization' element={<PermissionGuard module="Attendance Regularization"><AttendanceRegularization /></PermissionGuard>} />

      <Route path='/collection' element={<PermissionGuard module="Collection"><LoanCollection /></PermissionGuard>} />
      <Route path='/profit' element={<PermissionGuard module="Profit"><ProfitDashboard /></PermissionGuard>} />
      <Route path='/expense' element={<PermissionGuard module="Expense"><ExpenseDashboard /></PermissionGuard>} />

      <Route path='/finance' element={<PermissionGuard module="Finance"><FinanceDashboard /></PermissionGuard>} />

      <Route path='/leads' element={<PermissionGuard module="Leads"><Leads /></PermissionGuard>} />
      <Route path='/leads-status' element={<PermissionGuard module="Leads Status"><LeadStatus /></PermissionGuard>} />
      <Route path='/leads-source' element={<PermissionGuard module="Leads Sources"><LeadSource /></PermissionGuard>} />
    </Routes>
  )
}

export default AuthenticatedRoutes