"use client";
import { useEffect } from "react";
import SideBar from "./SideBar";

const Layout = (props: any) => {
	useEffect(() => {
		console.log("ok", props.id);
	});
	return (
		<div>
			<SideBar></SideBar>
			{props.children}
		</div>
	);
};

export default Layout;
