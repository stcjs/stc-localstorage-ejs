export default class stcAdapter {
  constructor(options, config) {
    this.options = options;
    this.config = config;
  }

  getLsSupportCode() {
    let { ld, rd } = this.config.tpl;
    let nlsCookie = this.options.nlsCookie;

    let data = {};

    data['if'] = `${ld}if isset($smarty.server.HTTP_USER_AGENT) && strpos($smarty.server.HTTP_USER_AGENT, "MSIE ") === false && !isset($smarty.cookies.${nlsCookie})${rd}`;
    data['else'] = `${ld}else${rd}`;
    data['end'] = `${ld}/if${rd}`;

    return data;
  }

  getLsConfigCode(appConfig) {
    let { ld, rd } = this.config.tpl;
    
    let configStr = JSON.stringify(appConfig);

    return `${ld}$stc_ls_config=json_decode("${configStr}", true)${rd}`;
  }

  getLsBaseCode() {
    let { ld, rd } = this.config.tpl;
    let name = 'stc_ls_base_flag';

    let data = {};

    data['if'] = `${ld}if !isset($${name})${rd}${ld}$${name}=true${rd}`;
    data['end'] = `${ld}/if${rd}`;

    return data;
  }

  getLsParseCookieCode() {
    let { ld, rd } = this.config.tpl;
    let lsCookie = this.options.lsCookie;

    let content = [
      `${ld}if isset($smarty.cookies.${lsCookie}) ${rd}`, 
      `${ld}$stc_ls_cookie=$smarty.cookies.${lsCookie}${rd}`, 
      `${ld}else${rd}`, 
      `${ld}$stc_ls_cookie=""${rd}`, 
      `${ld}/if${rd}`, 
      `${ld}$stc_cookie_length=strlen($stc_ls_cookie)${rd}`, 
      `${ld}$stc_ls_cookies=[]${rd}`, 
      `${ld}$index=0${rd}`, 
      `${ld}while $index < $stc_cookie_length${rd}`, 
      `${ld}$stc_ls_cookies[$stc_ls_cookie[$index]]=$stc_ls_cookie[$index+1]${rd}`, 
      `${ld}$index=$index+2${rd}`, 
      `${ld}/while${rd}`,
    ];

    return content.join('');
  }

  getLsConditionCode(lsValue) {
    let { ld, rd } = this.config.tpl;

    let data = {};

    data['if'] = `${ld}if isset($stc_ls_config["${lsValue}"]) && isset($stc_ls_cookies[$stc_ls_config["${lsValue}"]["key"]]) && $stc_ls_config["${lsValue}"]["version"] === $stc_ls_cookies[$stc_ls_config["${lsValue}"]["key"]]${rd}`;
    data['else'] = `${ld}else${rd}`;
    data['end'] = `${ld}/if${rd}`;
    data['key'] = `${ld}$stc_ls_config["${lsValue}"]["key"]${rd}`;
    data['version'] = `${ld}$stc_ls_config["${lsValue}"]["version"]${rd}`;

    return data;
  }
};