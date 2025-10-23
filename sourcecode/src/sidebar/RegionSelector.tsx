import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionSelect: (region: string) => void;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onRegionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 使用与 SidebarApp DropdownMenu 相同的动画状态管理
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // 地区选项
  const regionOptions = [
    // 全球选项
    { value: "全球", label: "全球 🌍", searchKey: "global" },
    
    // A
    { value: "阿尔巴尼亚", label: "阿尔巴尼亚 🇦🇱", searchKey: "albania" },
    { value: "阿尔及利亚", label: "阿尔及利亚 🇩🇿", searchKey: "algeria" },
    { value: "阿富汗", label: "阿富汗 🇦🇫", searchKey: "afghanistan" },
    { value: "阿根廷", label: "阿根廷 🇦🇷", searchKey: "argentina" },
    { value: "阿联酋", label: "阿联酋 🇦🇪", searchKey: "uae" },
    { value: "阿曼", label: "阿曼 🇴🇲", searchKey: "oman" },
    { value: "阿塞拜疆", label: "阿塞拜疆 🇦🇿", searchKey: "azerbaijan" },
    { value: "埃及", label: "埃及 🇪🇬", searchKey: "egypt" },
    { value: "埃塞俄比亚", label: "埃塞俄比亚 🇪🇹", searchKey: "ethiopia" },
    { value: "爱尔兰", label: "爱尔兰 🇮🇪", searchKey: "ireland" },
    { value: "爱沙尼亚", label: "爱沙尼亚 🇪🇪", searchKey: "estonia" },
    { value: "安道尔", label: "安道尔 🇦🇩", searchKey: "andorra" },
    { value: "安哥拉", label: "安哥拉 🇦🇴", searchKey: "angola" },
    { value: "安提瓜和巴布达", label: "安提瓜和巴布达 🇦🇬", searchKey: "antigua-barbuda" },
    { value: "奥地利", label: "奥地利 🇦🇹", searchKey: "austria" },
    { value: "澳大利亚", label: "澳大利亚 🇦🇺", searchKey: "australia" },
    { value: "澳门", label: "澳门 🇲🇴", searchKey: "macau" },
    
    // B
    { value: "巴巴多斯", label: "巴巴多斯 🇧🇧", searchKey: "barbados" },
    { value: "巴布亚新几内亚", label: "巴布亚新几内亚 🇵🇬", searchKey: "papua-new-guinea" },
    { value: "巴哈马", label: "巴哈马 🇧🇸", searchKey: "bahamas" },
    { value: "巴基斯坦", label: "巴基斯坦 🇵🇰", searchKey: "pakistan" },
    { value: "巴拉圭", label: "巴拉圭 🇵🇾", searchKey: "paraguay" },
    { value: "巴林", label: "巴林 🇧🇭", searchKey: "bahrain" },
    { value: "巴拿马", label: "巴拿马 🇵🇦", searchKey: "panama" },
    { value: "巴西", label: "巴西 🇧🇷", searchKey: "brazil" },
    { value: "白俄罗斯", label: "白俄罗斯 🇧🇾", searchKey: "belarus" },
    { value: "保加利亚", label: "保加利亚 🇧🇬", searchKey: "bulgaria" },
    { value: "贝宁", label: "贝宁 🇧🇯", searchKey: "benin" },
    { value: "比利时", label: "比利时 🇧🇪", searchKey: "belgium" },
    { value: "冰岛", label: "冰岛 🇮🇸", searchKey: "iceland" },
    { value: "波兰", label: "波兰 🇵🇱", searchKey: "poland" },
    { value: "波黑", label: "波黑 🇧🇦", searchKey: "bosnia-herzegovina" },
    { value: "玻利维亚", label: "玻利维亚 🇧🇴", searchKey: "bolivia" },
    { value: "博茨瓦纳", label: "博茨瓦纳 🇧🇼", searchKey: "botswana" },
    { value: "伯利兹", label: "伯利兹 🇧🇿", searchKey: "belize" },
    { value: "不丹", label: "不丹 🇧🇹", searchKey: "bhutan" },
    { value: "布基纳法索", label: "布基纳法索 🇧🇫", searchKey: "burkina-faso" },
    { value: "布隆迪", label: "布隆迪 🇧🇮", searchKey: "burundi" },
    
    // C
    { value: "朝鲜", label: "朝鲜 🇰🇵", searchKey: "north-korea" },
    { value: "赤道几内亚", label: "赤道几内亚 🇬🇶", searchKey: "equatorial-guinea" },
    
    // D
    { value: "丹麦", label: "丹麦 🇩🇰", searchKey: "denmark" },
    { value: "德国", label: "德国 🇩🇪", searchKey: "germany" },
    { value: "东帝汶", label: "东帝汶 🇹🇱", searchKey: "east-timor" },
    { value: "多哥", label: "多哥 🇹🇬", searchKey: "togo" },
    { value: "多米尼加", label: "多米尼加 🇩🇴", searchKey: "dominican-republic" },
    { value: "多米尼克", label: "多米尼克 🇩🇲", searchKey: "dominica" },
    
    // E
    { value: "俄罗斯", label: "俄罗斯 🇷🇺", searchKey: "russia" },
    { value: "厄瓜多尔", label: "厄瓜多尔 🇪🇨", searchKey: "ecuador" },
    { value: "厄立特里亚", label: "厄立特里亚 🇪🇷", searchKey: "eritrea" },
    
    // F
    { value: "法国", label: "法国 🇫🇷", searchKey: "france" },
    { value: "梵蒂冈", label: "梵蒂冈 🇻🇦", searchKey: "vatican" },
    { value: "菲律宾", label: "菲律宾 🇵🇭", searchKey: "philippines" },
    { value: "斐济", label: "斐济 🇫🇯", searchKey: "fiji" },
    { value: "芬兰", label: "芬兰 🇫🇮", searchKey: "finland" },
    { value: "佛得角", label: "佛得角 🇨🇻", searchKey: "cape-verde" },
    
    // G
    { value: "冈比亚", label: "冈比亚 🇬🇲", searchKey: "gambia" },
    { value: "刚果布", label: "刚果布 🇨🇬", searchKey: "congo-brazzaville" },
    { value: "刚果金", label: "刚果金 🇨🇩", searchKey: "congo-kinshasa" },
    { value: "哥伦比亚", label: "哥伦比亚 🇨🇴", searchKey: "colombia" },
    { value: "哥斯达黎加", label: "哥斯达黎加 🇨🇷", searchKey: "costa-rica" },
    { value: "格林纳达", label: "格林纳达 🇬🇩", searchKey: "grenada" },
    { value: "格鲁吉亚", label: "格鲁吉亚 🇬🇪", searchKey: "georgia" },
    { value: "古巴", label: "古巴 🇨🇺", searchKey: "cuba" },
    { value: "圭亚那", label: "圭亚那 🇬🇾", searchKey: "guyana" },
    { value: "哈萨克斯坦", label: "哈萨克斯坦 🇰🇿", searchKey: "kazakhstan" },
    { value: "海地", label: "海地 🇭🇹", searchKey: "haiti" },
    { value: "韩国", label: "韩国 🇰🇷", searchKey: "south-korea" },
    { value: "荷兰", label: "荷兰 🇳🇱", searchKey: "netherlands" },
    { value: "黑山", label: "黑山 🇲🇪", searchKey: "montenegro" },
    { value: "洪都拉斯", label: "洪都拉斯 🇭🇳", searchKey: "honduras" },
    { value: "基里巴斯", label: "基里巴斯 🇰🇮", searchKey: "kiribati" },
    { value: "吉布提", label: "吉布提 🇩🇯", searchKey: "djibouti" },
    { value: "吉尔吉斯斯坦", label: "吉尔吉斯斯坦 🇰🇬", searchKey: "kyrgyzstan" },
    { value: "几内亚", label: "几内亚 🇬🇳", searchKey: "guinea" },
    { value: "几内亚比绍", label: "几内亚比绍 🇬🇼", searchKey: "guinea-bissau" },
    { value: "加纳", label: "加纳 🇬🇭", searchKey: "ghana" },
    { value: "加拿大", label: "加拿大 🇨🇦", searchKey: "canada" },
    { value: "加蓬", label: "加蓬 🇬🇦", searchKey: "gabon" },
    { value: "柬埔寨", label: "柬埔寨 🇰🇭", searchKey: "cambodia" },
    { value: "捷克", label: "捷克 🇨🇿", searchKey: "czech-republic" },
    { value: "津巴布韦", label: "津巴布韦 🇿🇼", searchKey: "zimbabwe" },
    
    // K
    { value: "喀麦隆", label: "喀麦隆 🇨🇲", searchKey: "cameroon" },
    { value: "卡塔尔", label: "卡塔尔 🇶🇦", searchKey: "qatar" },
    { value: "科摩罗", label: "科摩罗 🇰🇲", searchKey: "comoros" },
    { value: "科特迪瓦", label: "科特迪瓦 🇨🇮", searchKey: "ivory-coast" },
    { value: "科威特", label: "科威特 🇰🇼", searchKey: "kuwait" },
    { value: "克罗地亚", label: "克罗地亚 🇭🇷", searchKey: "croatia" },
    { value: "肯尼亚", label: "肯尼亚 🇰🇪", searchKey: "kenya" },
    { value: "库克群岛", label: "库克群岛 🇨🇰", searchKey: "cook-islands" },
    
    // L
    { value: "拉脱维亚", label: "拉脱维亚 🇱🇻", searchKey: "latvia" },
    { value: "莱索托", label: "莱索托 🇱🇸", searchKey: "lesotho" },
    { value: "老挝", label: "老挝 🇱🇦", searchKey: "laos" },
    { value: "黎巴嫩", label: "黎巴嫩 🇱🇧", searchKey: "lebanon" },
    { value: "立陶宛", label: "立陶宛 🇱🇹", searchKey: "lithuania" },
    { value: "利比里亚", label: "利比里亚 🇱🇷", searchKey: "liberia" },
    { value: "利比亚", label: "利比亚 🇱🇾", searchKey: "libya" },
    { value: "列支敦士登", label: "列支敦士登 🇱🇮", searchKey: "liechtenstein" },
    { value: "卢森堡", label: "卢森堡 🇱🇺", searchKey: "luxembourg" },
    { value: "卢旺达", label: "卢旺达 🇷🇼", searchKey: "rwanda" },
    { value: "罗马尼亚", label: "罗马尼亚 🇷🇴", searchKey: "romania" },
    
    // M
    { value: "马达加斯加", label: "马达加斯加 🇲🇬", searchKey: "madagascar" },
    { value: "马尔代夫", label: "马尔代夫 🇲🇻", searchKey: "maldives" },
    { value: "马耳他", label: "马耳他 🇲🇹", searchKey: "malta" },
    { value: "马拉维", label: "马拉维 🇲🇼", searchKey: "malawi" },
    { value: "马来西亚", label: "马来西亚 🇲🇾", searchKey: "malaysia" },
    { value: "马里", label: "马里 🇲🇱", searchKey: "mali" },
    { value: "马绍尔群岛", label: "马绍尔群岛 🇲🇭", searchKey: "marshall-islands" },
    { value: "毛里求斯", label: "毛里求斯 🇲🇺", searchKey: "mauritius" },
    { value: "毛里塔尼亚", label: "毛里塔尼亚 🇲🇷", searchKey: "mauritania" },
    { value: "美国", label: "美国 🇺🇸", searchKey: "usa" },
    { value: "蒙古", label: "蒙古 🇲🇳", searchKey: "mongolia" },
    { value: "孟加拉国", label: "孟加拉国 🇧🇩", searchKey: "bangladesh" },
    { value: "秘鲁", label: "秘鲁 🇵🇪", searchKey: "peru" },
    { value: "密克罗尼西亚", label: "密克罗尼西亚 🇫🇲", searchKey: "micronesia" },
    { value: "缅甸", label: "缅甸 🇲🇲", searchKey: "myanmar" },
    { value: "摩尔多瓦", label: "摩尔多瓦 🇲🇩", searchKey: "moldova" },
    { value: "摩洛哥", label: "摩洛哥 🇲🇦", searchKey: "morocco" },
    { value: "摩纳哥", label: "摩纳哥 🇲🇨", searchKey: "monaco" },
    { value: "莫桑比克", label: "莫桑比克 🇲🇿", searchKey: "mozambique" },
    { value: "墨西哥", label: "墨西哥 🇲🇽", searchKey: "mexico" },
    
    // N
    { value: "纳米比亚", label: "纳米比亚 🇳🇦", searchKey: "namibia" },
    { value: "南非", label: "南非 🇿🇦", searchKey: "south-africa" },
    { value: "南苏丹", label: "南苏丹 🇸🇸", searchKey: "south-sudan" },
    { value: "瑙鲁", label: "瑙鲁 🇳🇷", searchKey: "nauru" },
    { value: "尼泊尔", label: "尼泊尔 🇳🇵", searchKey: "nepal" },
    { value: "尼加拉瓜", label: "尼加拉瓜 🇳🇮", searchKey: "nicaragua" },
    { value: "尼日尔", label: "尼日尔 🇳🇪", searchKey: "niger" },
    { value: "尼日利亚", label: "尼日利亚 🇳🇬", searchKey: "nigeria" },
    { value: "挪威", label: "挪威 🇳🇴", searchKey: "norway" },
    
    // P
    { value: "帕劳", label: "帕劳 🇵🇼", searchKey: "palau" },
    { value: "葡萄牙", label: "葡萄牙 🇵🇹", searchKey: "portugal" },
    
    // Q
    { value: "乔治亚", label: "乔治亚 🇬🇪", searchKey: "georgia" },
    
    // R
    { value: "日本", label: "日本 🇯🇵", searchKey: "japan" },
    { value: "瑞典", label: "瑞典 🇸🇪", searchKey: "sweden" },
    { value: "瑞士", label: "瑞士 🇨🇭", searchKey: "switzerland" },
    
    // S
    { value: "萨尔瓦多", label: "萨尔瓦多 🇸🇻", searchKey: "el-salvador" },
    { value: "萨摩亚", label: "萨摩亚 🇼🇸", searchKey: "samoa" },
    { value: "塞尔维亚", label: "塞尔维亚 🇷🇸", searchKey: "serbia" },
    { value: "塞拉利昂", label: "塞拉利昂 🇸🇱", searchKey: "sierra-leone" },
    { value: "塞内加尔", label: "塞内加尔 🇸🇳", searchKey: "senegal" },
    { value: "塞浦路斯", label: "塞浦路斯 🇨🇾", searchKey: "cyprus" },
    { value: "塞舌尔", label: "塞舌尔 🇸🇨", searchKey: "seychelles" },
    { value: "沙特阿拉伯", label: "沙特阿拉伯 🇸🇦", searchKey: "saudi-arabia" },
    { value: "圣多美和普林西比", label: "圣多美和普林西比 🇸🇹", searchKey: "sao-tome-principe" },
    { value: "圣基茨和尼维斯", label: "圣基茨和尼维斯 🇰🇳", searchKey: "saint-kitts-nevis" },
    { value: "圣卢西亚", label: "圣卢西亚 🇱🇨", searchKey: "saint-lucia" },
    { value: "圣马力诺", label: "圣马力诺 🇸🇲", searchKey: "san-marino" },
    { value: "圣文森特和格林纳丁斯", label: "圣文森特和格林纳丁斯 🇻🇨", searchKey: "saint-vincent-grenadines" },
    { value: "斯里兰卡", label: "斯里兰卡 🇱🇰", searchKey: "sri-lanka" },
    { value: "斯洛伐克", label: "斯洛伐克 🇸🇰", searchKey: "slovakia" },
    { value: "斯洛文尼亚", label: "斯洛文尼亚 🇸🇮", searchKey: "slovenia" },
    { value: "斯威士兰", label: "斯威士兰 🇸🇿", searchKey: "eswatini" },
    { value: "苏丹", label: "苏丹 🇸🇩", searchKey: "sudan" },
    { value: "苏里南", label: "苏里南 🇸🇷", searchKey: "suriname" },
    { value: "所罗门群岛", label: "所罗门群岛 🇸🇧", searchKey: "solomon-islands" },
    { value: "索马里", label: "索马里 🇸🇴", searchKey: "somalia" },
    
    // T
    { value: "塔吉克斯坦", label: "塔吉克斯坦 🇹🇯", searchKey: "tajikistan" },
    { value: "台湾", label: "台湾 🇹🇼", searchKey: "taiwan" },
    { value: "泰国", label: "泰国 🇹🇭", searchKey: "thailand" },
    { value: "坦桑尼亚", label: "坦桑尼亚 🇹🇿", searchKey: "tanzania" },
    { value: "汤加", label: "汤加 🇹🇴", searchKey: "tonga" },
    { value: "特立尼达和多巴哥", label: "特立尼达和多巴哥 🇹🇹", searchKey: "trinidad-tobago" },
    { value: "突尼斯", label: "突尼斯 🇹🇳", searchKey: "tunisia" },
    { value: "图瓦卢", label: "图瓦卢 🇹🇻", searchKey: "tuvalu" },
    { value: "土耳其", label: "土耳其 🇹🇷", searchKey: "turkey" },
    { value: "土库曼斯坦", label: "土库曼斯坦 🇹🇲", searchKey: "turkmenistan" },
    
    // W
    { value: "瓦努阿图", label: "瓦努阿图 🇻🇺", searchKey: "vanuatu" },
    { value: "危地马拉", label: "危地马拉 🇬🇹", searchKey: "guatemala" },
    { value: "委内瑞拉", label: "委内瑞拉 🇻🇪", searchKey: "venezuela" },
    { value: "文莱", label: "文莱 🇧🇳", searchKey: "brunei" },
    { value: "乌干达", label: "乌干达 🇺🇬", searchKey: "uganda" },
    { value: "乌克兰", label: "乌克兰 🇺🇦", searchKey: "ukraine" },
    { value: "乌拉圭", label: "乌拉圭 🇺🇾", searchKey: "uruguay" },
    { value: "乌兹别克斯坦", label: "乌兹别克斯坦 🇺🇿", searchKey: "uzbekistan" },
    
    // X
    { value: "西班牙", label: "西班牙 🇪🇸", searchKey: "spain" },
    { value: "希腊", label: "希腊 🇬🇷", searchKey: "greece" },
    { value: "新加坡", label: "新加坡 🇸🇬", searchKey: "singapore" },
    { value: "新西兰", label: "新西兰 🇳🇿", searchKey: "new-zealand" },
    { value: "匈牙利", label: "匈牙利 🇭🇺", searchKey: "hungary" },
    { value: "叙利亚", label: "叙利亚 🇸🇾", searchKey: "syria" },
    { value: "香港", label: "香港 🇭🇰", searchKey: "hong-kong" },
    
    // Y
    { value: "牙买加", label: "牙买加 🇯🇲", searchKey: "jamaica" },
    { value: "亚美尼亚", label: "亚美尼亚 🇦🇲", searchKey: "armenia" },
    { value: "也门", label: "也门 🇾🇪", searchKey: "yemen" },
    { value: "伊拉克", label: "伊拉克 🇮🇶", searchKey: "iraq" },
    { value: "伊朗", label: "伊朗 🇮🇷", searchKey: "iran" },
    { value: "以色列", label: "以色列 🇮🇱", searchKey: "israel" },
    { value: "意大利", label: "意大利 🇮🇹", searchKey: "italy" },
    { value: "印度", label: "印度 🇮🇳", searchKey: "india" },
    { value: "印度尼西亚", label: "印度尼西亚 🇮🇩", searchKey: "indonesia" },
    { value: "英国", label: "英国 🇬🇧", searchKey: "united-kingdom" },
    { value: "约旦", label: "约旦 🇯🇴", searchKey: "jordan" },
    { value: "越南", label: "越南 🇻🇳", searchKey: "vietnam" },
    
    // Z
    { value: "赞比亚", label: "赞比亚 🇿🇲", searchKey: "zambia" },
    { value: "乍得", label: "乍得 🇹🇩", searchKey: "chad" },
    { value: "智利", label: "智利 🇨🇱", searchKey: "chile" },
    { value: "中非", label: "中非 🇨🇫", searchKey: "central-african-republic" },
    { value: "中国", label: "中国 🇨🇳", searchKey: "china" }
  ];

  // 使用与 SidebarApp DropdownMenu 相同的动画状态管理逻辑
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimatingOut(false);
    } else if (shouldRender) {
      setIsAnimatingOut(true);
      // 等待动画完成后再停止渲染
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsAnimatingOut(false);
      }, 300); // 匹配动画持续时间
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // 过滤地区选项
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return regionOptions;
    
    const searchTermLower = searchTerm.toLowerCase().trim();
    return regionOptions.filter(region => {
      return region.label.toLowerCase().includes(searchTermLower) ||
             region.searchKey.toLowerCase().includes(searchTermLower) ||
             region.value.toLowerCase().includes(searchTermLower);
    });
  }, [searchTerm]);

  // 处理外部点击
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 处理地区选择 - 使用 setTimeout 避免事件冲突
  const handleRegionSelect = (regionValue: string) => {
    // 先调用回调，再关闭下拉框，避免状态冲突
    onRegionSelect(regionValue);
    
    // 使用 setTimeout 确保状态更新的顺序
    setTimeout(() => {
      setIsOpen(false);
      setSearchTerm('');
    }, 0);
  };

  // 处理搜索输入
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 处理按钮点击
  const handleButtonClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // 延迟聚焦输入框，确保下拉菜单已经渲染
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleButtonClick}
        className={`w-full px-5 py-2 bg-stone-200/90 rounded-3xl border border-gray-200 flex items-center justify-between text-left hover:border-blue-200 hover:ring-2 hover:ring-blue-200 hover:shadow-md transition-all duration-200`}
      >
        <span className="text-gray-800 font-medium">{selectedRegion}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {shouldRender && (
        <div className={`absolute top-full left-0 right-0 mt-2 z-10 ${!isOpen ? 'pointer-events-none' : ''}`}>
          <div className={`
            bg-stone-200/90 backdrop-blur-sm border border-gray-100 rounded-3xl card-shadow overflow-hidden
            transform origin-top
            ${isOpen && !isAnimatingOut
              ? 'animate-dropdown-in' 
              : isAnimatingOut
              ? 'animate-dropdown-out'
              : 'opacity-0'
            }
          `}>
            {/* 搜索框 */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="搜索地区..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-stone-400/80 border border-gray-200 rounded-3xl text-sm text-white placeholder-white focus:outline-none focus:border-blue-200 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* 选项列表 */}
            <div className="overflow-y-auto max-h-72 scrollbar-hide">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div key={option.value} className="mx-2 my-0.5">
                    <button
                      onClick={() => handleRegionSelect(option.value)}
                      className={`
                        w-full text-left text-gray-700 font-medium 
                        hover:bg-stone-400
                        px-5 py-1 rounded-xl
                        transition-all duration-200 ease-out
                        hover:scale-[1.02] hover:shadow-sm
                      `}
                    >
                      {option.label}
                    </button>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  未找到匹配的地区
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;