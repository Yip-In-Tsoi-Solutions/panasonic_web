import { Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
const { Sider } = Layout;
const Navigation = (props) => {
  const disPatch = useDispatch();
  const items = useSelector((state) => state?.navigations?.items);
  return (
    <Sider width={240} className="h-screen">
      <img
        className="w-full h-auto object-cover overflow-hidden"
        src={props.logo}
      />
      <Menu mode="vertical" className="w-full h-screen text-[11px] font-bold">
        {items.length > 0 &&
          items.map((i) => (
            <Menu.Item
              key={i.key}
              onClick={(e) => props.setSelected(sessionStorage.setItem('pageId', e.key))}
            >
              {i.label}
            </Menu.Item>
          ))}
      </Menu>
    </Sider>
  );
};
export default Navigation;
