import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Coupons from '../components/Coupons/Coupons';
import Dashboard from '../components/Dashboard/Dashboard';
import Home from '../components/Dashboard/Home';
import FlashSales from '../components/FlashSales/FlashSales';
import Login from '../components/Login/Login';
import ResetPassword from '../components/Login/ResetPassword';
import Attributes from '../components/Product/Attributes/Attributes';
import CreateAttribute from '../components/Product/Attributes/CreateAttribute';
import AttributeSets from '../components/Product/AttributeSets/AttributeSets';
import CreateAttributeSet from '../components/Product/AttributeSets/CreateAttributeSet';
import Brands from '../components/Product/Brands/Brands';
import CreateBrand from '../components/Product/Brands/CreateBrand';
import CreateProduct from '../components/Product/Products/CreateProduct';
import Options from '../components/Product/Options/Options';
import Reviews from '../components/Product/Reviews/Reviews';
import CreateTag from '../components/Product/Tags/CreateTag';
import Tags from '../components/Product/Tags/Tags';
import CreateUser from '../components/User/CreateUser';
import CreateRole from '../components/User/Roles/CreateRole';
import Roles from '../components/User/Roles/Roles';
import Users from '../components/User/Users';
import PrivateRoute from './privateroutes';
import PublicRoute from './publicroutes';
import Catalog from '../components/Product/Products/Catalog';
import CreateOption from '../components/Product/Options/CreateOption';
import CreateCoupon from '../components/Coupons/CreateCoupon';
import CreateReview from '../components/Product/Reviews/CreateReview';
import CreateFlashSale from '../components/FlashSales/CreateFlashSale';
import Taxes from '../components/Localization/Taxes/Taxes';
import CreateTax from '../components/Localization/Taxes/CreateTax';
import Media from '../components/Media/Media';
import Settings from '../components/Settings/Settings';
import Categories from '../components/Product/Categories/Categories';
import Pages from '../components/Pages/Pages';
import CreatePage from '../components/Pages/CreatePage';
import Sliders from '../components/Appearance/Sliders/Sliders';
import CreateSlider from '../components/Appearance/Sliders/CreateSlider';
import StoreFront from '../components/Appearance/StoreFront/StoreFront';
import Orders from '../components/Sales/Orders/Orders';
import EditOrder from '../components/Sales/Orders/EditOrder';
import Transactions from '../components/Sales/Transactions/Transactions';
import Importer from '../components/Importer/Importer';
import Profile from '../components/Profile/Profile';
import Menu from '../components/Menu/Menu'
import CreateMenu from '../components/Menu/CreateMenu';
import CreateMenuItem from '../components/Menu/CreateMenuItem';
import Reports from '../components/Reports/Reports';
import Translations from '../components/Localization/Translations/Translations';
import CurrencyRates from '../components/Localization/CurrencyRates/CurrencyRates';
import EditCurrency from '../components/Localization/CurrencyRates/EditCurrency';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Blogs from '../components/Blogs/Blogs';
import CreateBlog from '../components/Blogs/CreateBlog';
import Queries from '../components/Support/Queries/Queries';
import Complaints from '../components/Support/Complaints/Complaints';
import EditQuery from '../components/Support/Queries/EditQuery';
import EditComplaint from '../components/Support/Complaints/EditComplaint';


const routes = (
  <>
  <Router>
    <React.Fragment>
      <Switch>
        <PublicRoute exact path='/'  component={Login} />
        <PublicRoute exact path='/reset-password' component={ResetPassword} />
        <PrivateRoute exact path='/dashboard' component={()=><Dashboard abc={ <Home />} />} />

        <PrivateRoute exact path='/users' component={()=><Dashboard abc={<Users />} />} />
        <PrivateRoute exact path='/users/create' component={()=><Dashboard abc={<CreateUser />} />} />
        <PrivateRoute exact path='/users/:id/edit' component={()=><Dashboard abc={<CreateUser edit="true" />} />} />

        <PrivateRoute exact path='/roles' component={()=><Dashboard abc={<Roles />} />} />
        <PrivateRoute exact path='/roles/create' component={()=><Dashboard abc={<CreateRole />} />} />
        <PrivateRoute exact path='/roles/:id/edit' component={()=><Dashboard abc={<CreateRole edit="true"/>} />} />

        <PrivateRoute exact path='/products' component={()=><Dashboard abc={ <Catalog />} />} />
        <PrivateRoute exact path='/products/create' component={()=><Dashboard abc={ <CreateProduct />} />} />
        <PrivateRoute exact path='/products/:id/edit' component={()=><Dashboard abc={ <CreateProduct edit="true"/>} />} />

        <PrivateRoute exact path='/categories' component={()=><Dashboard abc={ <Categories />} />} />

        <PrivateRoute exact path='/brands' component={()=><Dashboard abc={ <Brands />} />} />
        <PrivateRoute exact path='/brands/create' component={()=><Dashboard abc={ <CreateBrand />} />} />
        <PrivateRoute exact path='/brands/:id/edit' component={()=><Dashboard abc={ <CreateBrand edit="true"/>} />} />

        <PrivateRoute exact path='/attribute-sets' component={()=><Dashboard abc={ <AttributeSets />} />} />
        <PrivateRoute exact path='/attribute-sets/create' component={()=><Dashboard abc={ <CreateAttributeSet />} />} />
        <PrivateRoute exact path='/attribute-sets/:id/edit' component={()=><Dashboard abc={ <CreateAttributeSet edit="true"/>} />} />

        <PrivateRoute exact path='/attributes' component={()=><Dashboard abc={ <Attributes />} />} />
        <PrivateRoute exact path='/attributes/create' component={()=><Dashboard abc={ <CreateAttribute />} />} />
        <PrivateRoute exact path='/attributes/:id/edit' component={()=><Dashboard abc={ <CreateAttribute edit="true"/>} />} />
        
        <PrivateRoute exact path='/options' component={()=><Dashboard abc={ <Options />} />} />
        <PrivateRoute exact path='/options/create' component={()=><Dashboard abc={ <CreateOption />} />} />
        <PrivateRoute exact path='/options/:id/edit' component={()=><Dashboard abc={ <CreateOption edit="true"/>} />} />
        
        <PrivateRoute exact path='/tags' component={()=><Dashboard abc={ <Tags />} />} />
        <PrivateRoute exact path='/tags/create' component={()=><Dashboard abc={ <CreateTag />} />} />
        <PrivateRoute exact path='/tags/:id/edit' component={()=><Dashboard abc={ <CreateTag edit="true"/>} />} />

        <PrivateRoute exact path='/reviews' component={()=><Dashboard abc={ <Reviews />} />} />
        <PrivateRoute exact path='/reviews/:id/edit' component={()=><Dashboard abc={ <CreateReview edit="true"/>} />} />

        <PrivateRoute exact path='/orders' component={()=><Dashboard abc={ <Orders />} />} />
        <PrivateRoute exact path='/orders/:id' component={()=><Dashboard abc={ <EditOrder />} />} />

        <PrivateRoute exact path='/transactions' component={()=><Dashboard abc={ <Transactions />} />} />

        <PrivateRoute exact path='/queries' component={()=><Dashboard abc={ <Queries />} />} />
        <PrivateRoute exact path='/queries/:id' component={()=><Dashboard abc={ <EditQuery />} />} />

        <PrivateRoute exact path='/complaints' component={()=><Dashboard abc={ <Complaints />} />} />
        <PrivateRoute exact path='/complaints/:id' component={()=><Dashboard abc={ <EditComplaint />} />} />

        <PrivateRoute exact path='/flashsales' component={()=><Dashboard abc={ <FlashSales />} />} />
        <PrivateRoute exact path='/flashsales/create' component={()=><Dashboard abc={ <CreateFlashSale />} />} />
        <PrivateRoute exact path='/flashsales/:id/edit' component={()=><Dashboard abc={ <CreateFlashSale edit="true"/>} />} />

        <PrivateRoute exact path='/coupons' component={()=><Dashboard abc={ <Coupons />} />} />
        <PrivateRoute exact path='/coupons/create' component={()=><Dashboard abc={ <CreateCoupon />} />} />
        <PrivateRoute exact path='/coupons/:id/edit' component={()=><Dashboard abc={ <CreateCoupon edit="true"/>} />} />

        <PrivateRoute exact path='/pages' component={()=><Dashboard abc={ <Pages />} />} />
        <PrivateRoute exact path='/pages/create' component={()=><Dashboard abc={ <CreatePage />} />} />
        <PrivateRoute exact path='/pages/:id/edit' component={()=><Dashboard abc={ <CreatePage edit="true"/>} />} />

        <PrivateRoute exact path='/blogs' component={()=><Dashboard abc={ <Blogs />} />} />
        <PrivateRoute exact path='/blogs/create' component={()=><Dashboard abc={ <CreateBlog />} />} />
        <PrivateRoute exact path='/blogs/:id/edit' component={()=><Dashboard abc={ <CreateBlog edit="true"/>} />} />

        <PrivateRoute exact path='/media' component={()=><Dashboard abc={ <Media />} />} />

        <PrivateRoute exact path='/menus' component={()=><Dashboard abc={ <Menu />} />} />
        <PrivateRoute exact path='/menus/create' component={()=><Dashboard abc={ <CreateMenu />} />} />
        <PrivateRoute exact path='/menus/:id/edit' component={()=><Dashboard abc={ <CreateMenu edit="true"/>} />} />
        <PrivateRoute exact path='/menus/:id/items/create' component={()=><Dashboard abc={ <CreateMenuItem />} />} />
        <PrivateRoute exact path='/menus/:id/items/:id2/edit' component={()=><Dashboard abc={ <CreateMenuItem edit="true"/>} />} />

        <PrivateRoute exact path='/translations' component={()=><Dashboard abc={ <Translations />} />} />

        <PrivateRoute exact path='/currency-rates' component={()=><Dashboard abc={ <CurrencyRates />} />} />
        <PrivateRoute exact path='/currency-rates/:id/edit' component={()=><Dashboard abc={ <EditCurrency />} />} />

        <PrivateRoute exact path='/taxes' component={()=><Dashboard abc={ <Taxes />} />} />
        <PrivateRoute exact path='/taxes/create' component={()=><Dashboard abc={ <CreateTax />} />} />
        <PrivateRoute exact path='/taxes/:id/edit' component={()=><Dashboard abc={ <CreateTax edit="true"/>} />} />

        <PrivateRoute exact path='/sliders' component={()=><Dashboard abc={ <Sliders />} />} />
        <PrivateRoute exact path='/sliders/create' component={()=><Dashboard abc={ <CreateSlider />} />} />
        <PrivateRoute exact path='/sliders/:id/edit' component={()=><Dashboard abc={ <CreateSlider edit="true"/>} />} />

        <PrivateRoute exact path='/storefront' component={()=><Dashboard abc={ <StoreFront />} />} />

        <PrivateRoute exact path='/importer' component={()=><Dashboard abc={ <Importer />} />} />

        <PrivateRoute exact path='/reports' component={()=><Dashboard abc={ <Reports />} />} />

        <PrivateRoute exact path='/settings' component={()=><Dashboard abc={ <Settings />} />} />

        <PrivateRoute exact path='/profile' component={()=><Dashboard abc={ <Profile />} />} />

      </Switch>
    </React.Fragment>
  </Router>
     <ToastContainer
     position="bottom-right"
     autoClose={3000}
     hideProgressBar={true}
     newestOnTop={false}
     closeOnClick
     pauseOnFocusLoss
     draggable
     pauseOnHover
   />
   </>
);
export default routes;
