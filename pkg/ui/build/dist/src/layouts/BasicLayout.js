import React, { Suspense } from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
// import logo from '../assets/logo.svg';
import logo from '../assets/logo.png';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import getPageTitle from '@/utils/getPageTitle';
import styles from './BasicLayout.less';
// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));
const { Content } = Layout;
const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
        maxWidth: 1599,
    },
    'screen-xxl': {
        minWidth: 1600,
    },
};
class BasicLayout extends React.Component {
    constructor() {
        super(...arguments);
        this.getLayoutStyle = () => {
            const { fixSiderbar, isMobile, collapsed, layout } = this.props;
            if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
                return {
                    paddingLeft: collapsed ? '80px' : '256px',
                };
            }
            return null;
        };
        this.handleMenuCollapse = collapsed => {
            const { dispatch } = this.props;
            dispatch({
                type: 'global/changeLayoutCollapsed',
                payload: collapsed,
            });
        };
        this.renderSettingDrawer = () => {
            // Do not render SettingDrawer in production
            // unless it is deployed in preview.pro.ant.design as demo
            // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
            if (process.env.NODE_ENV === 'production' &&
                ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION !== 'site') {
                return null;
            }
            return React.createElement(SettingDrawer, null);
        };
    }
    componentDidMount() {
        const { dispatch, route: { routes, path, authority }, } = this.props;
        dispatch({
            type: 'user/fetchCurrent',
        });
        dispatch({
            type: 'setting/getSetting',
        });
        dispatch({
            type: 'menu/getMenuData',
            payload: { routes, path, authority },
        });
    }
    getContext() {
        const { location, breadcrumbNameMap } = this.props;
        return {
            location,
            breadcrumbNameMap,
        };
    }
    render() {
        const { navTheme, layout: PropsLayout, children, location: { pathname }, isMobile, menuData, breadcrumbNameMap, fixedHeader, } = this.props;
        const isTop = PropsLayout === 'topmenu';
        const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
        const layout = (React.createElement(Layout, null,
            isTop && !isMobile ? null : (React.createElement(SiderMenu, Object.assign({ logo: logo, theme: navTheme, onCollapse: this.handleMenuCollapse, menuData: menuData, isMobile: isMobile }, this.props))),
            React.createElement(Layout, { style: Object.assign({}, this.getLayoutStyle(), { minHeight: '100vh' }) },
                React.createElement(Header, Object.assign({ menuData: menuData, handleMenuCollapse: this.handleMenuCollapse, logo: logo, isMobile: isMobile }, this.props)),
                React.createElement(Content, { className: styles.content, style: contentStyle }, children),
                React.createElement(Footer, null))));
        return (React.createElement(React.Fragment, null,
            React.createElement(DocumentTitle, { title: getPageTitle(pathname, breadcrumbNameMap) },
                React.createElement(ContainerQuery, { query: query }, params => (React.createElement(Context.Provider, { value: this.getContext() },
                    React.createElement("div", { className: classNames(params) }, layout))))),
            React.createElement(Suspense, { fallback: null }, this.renderSettingDrawer())));
    }
}
export default connect(({ global, setting, menu: menuModel }) => (Object.assign({ collapsed: global.collapsed, layout: setting.layout, menuData: menuModel.menuData, breadcrumbNameMap: menuModel.breadcrumbNameMap }, setting)))(props => (React.createElement(Media, { query: "(max-width: 599px)" }, isMobile => React.createElement(BasicLayout, Object.assign({}, props, { isMobile: isMobile })))));
//# sourceMappingURL=BasicLayout.js.map