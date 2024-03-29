import { Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
const { Sider } = Layout;
const Navigation = (props) => {
  const disPatch = useDispatch();
  const items = useSelector((state) => state?.navigations?.items);
  return (
    <Sider>
      <img
        className="w-full h-auto object-cover overflow-hidden"
        src={props.logo}
      />
      <Menu mode="vertical" className="w-full h-screen">
        {items.length > 0 &&
          items.map((i) => <Menu.Item key={i.key} onClick={(e)=> props.setSelected(parseInt(e.key))}>{i.label}</Menu.Item>)}
      </Menu>
    </Sider>
  );
};
export default Navigation;
