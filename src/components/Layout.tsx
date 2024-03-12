import SideBar from "./SideBar";

const Layout = ({ children }) => {
	return (
		<div>
			<SideBar></SideBar>
			{children}
		</div>
	);
};

export default Layout;
