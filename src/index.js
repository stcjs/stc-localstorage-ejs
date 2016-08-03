export default class stcAdapter {
  constructor(options, config) {
    this.blockStart = options.blockStart || config.tpl.ld[0];
    this.blockEnd = options.blockStart || config.tpl.rd[0];
    
    this.options = options;
    this.config = config;
  }

  getLsSupportCode() {
    let { blockStart, blockEnd } = this;

    let nlsCookie = this.options.nlsCookie;

    let data = {};

    data['if'] = `${blockStart} if(http.userAgent().indexOf("MSIE ") === -1 && !http.cookie("${nlsCookie}")) { ${blockEnd}`;
    data['else'] = `${blockStart} } else { ${blockEnd}`;
    data['end'] = `${blockStart} } ${blockEnd}`;

    return data;
  }

  getLsConfigCode(appConfig) {
    let { blockStart, blockEnd } = this;
    
    let configStr = JSON.stringify(appConfig);

    return `${blockStart} var stc_ls_config = JSON.parse(\'${configStr}\') ${blockEnd}`;
  }

  getLsBaseCode() {
    let { blockStart, blockEnd } = this;

    let name = 'stc_ls_base_flag';

    let data = {};

    data['if'] = `${blockStart} if(!http.${name}) { http.${name}=true; ${blockEnd}`;
    data['end'] = `${blockStart} } ${blockEnd}`;

    return data;
  }

  getLsParseCookieCode() {
    let { blockStart, blockEnd } = this;

    let lsCookie = this.options.lsCookie;

    let content = [
      `${blockStart} var stc_ls_cookie = http.cookie("${lsCookie}");`,
      `var stc_cookie_length = stc_ls_cookie.length;`,
      `var stc_ls_cookies = {};`,
      `for(var i = 0; i < stc_cookie_length;i += 2) {`,
      `stc_ls_cookies[stc_ls_cookie[i]] = stc_ls_cookie[i+1];`,
      `} ${blockEnd}`,
    ];

    return content.join('');
  }

  getLsConditionCode(lsValue) {
    let { blockStart, blockEnd } = this;

    let data = {};

    data['if'] = `${blockStart} if(stc_ls_config["${lsValue}"] && stc_ls_cookies[stc_ls_config["${lsValue}"].key] && stc_ls_config["${lsValue}"].version === stc_ls_cookies[stc_ls_config["${lsValue}"].key]) { ${blockEnd}`;
    data['else'] = `${blockStart} } else { ${blockEnd}`;
    data['end'] = `${blockStart} } ${blockEnd}`;
    data['key'] = `${blockStart}-stc_ls_config["${lsValue}"]["key"] ${blockEnd}`;
    data['version'] = `${blockStart}-stc_ls_config["${lsValue}"]["version"] ${blockEnd}`;

    return data;
  }
};