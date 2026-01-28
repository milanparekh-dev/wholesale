let toggle_light_header = false;
let oldDataJson = [];
let dataThemeGeneral =[];
let revenueHeroEnabledRH = false;
let formWithRh = {};
let Demodata = null

const setDatatoggle_light_header = (value) => {
    toggle_light_header = value;
};
const setDemodata = (value) => {
    Demodata = value;
};

const setDataThemeGeneral = (value) => {
    dataThemeGeneral = value;
};
const setRevenueHeroEnabledRH = (value) => {
    revenueHeroEnabledRH = value;
};
const setFormWithRh = (value) => {
    formWithRh = value;
};
const setoldDataJson = (value) => {
    oldDataJson = value;
};
const getDatatoggle_light_header = () => {
    return toggle_light_header;
};
const getDataThemeGeneral = () => {
    return dataThemeGeneral;
};
const getRevenueHeroEnabledRH = () => {
    return revenueHeroEnabledRH;
};
const getFormWithRh = () => {
    return formWithRh;
};
const getoldDataJson = () => {
    return oldDataJson;
};
const getDemodata = () => {
    return Demodata;
};

export {getDemodata, setDemodata, setDatatoggle_light_header,  getDatatoggle_light_header, setoldDataJson, getoldDataJson, setDataThemeGeneral, getDataThemeGeneral, setRevenueHeroEnabledRH, getRevenueHeroEnabledRH, setFormWithRh, getFormWithRh};