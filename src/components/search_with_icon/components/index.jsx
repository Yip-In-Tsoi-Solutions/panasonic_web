import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

const SearchWithIcon = ()=> {
    return (
        <Input className="w-full h-10 mt-5 mr-5" placeholder="Search" prefix={<SearchOutlined/>} />
    )
}
export default SearchWithIcon;