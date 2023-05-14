(function(){

function module_init() {
    console.log("[lora-prompt-tool] load localization module");

    const my_localization_data = {
        "LoRA prompt helper" : {
            "zh_TW": "LoRA提示詞工具"
        },
        "Edit Model Trigger Words" : {
            "zh_TW": "編輯模型觸發詞"
        },
        "Update the JSON data from user input." : {
            "zh_TW": "從在編輯頁面上做的編輯更新本JSON表格"
        },
        "Reload trigger words from model information file." : {
            "zh_TW": "從模型資料檔案中重新載入模型觸發詞"
        },
        "Save the trigger words to model information file." : {
            "zh_TW": "將模型觸發詞存檔到模型資料檔案中"
        },
        "prompts" : {
            "zh_TW": "提示詞"
        },
        "prompt" : {
            "zh_TW": "提示詞"
        },
        "title" : {
            "zh_TW": "標題"
        },
        "trainedWords" : {
            "zh_TW": "已訓練的提示詞"
        },
        "baseModel" : {
            "zh_TW": "基底模型"
        },
        "description" : {
            "zh_TW": "描述"
        },
        "modelId" : {
            "zh_TW": "模型編號"
        },
        "negativePrompt" : {
            "zh_TW": "反向提示詞"
        },
        "hashes" : {
            "zh_TW": "雜湊值"
        },
        "Size" : {
            "zh_TW": "尺寸"
        },
        "name" : {
            "zh_TW": "名稱"
        },
        "Success" : {
            "zh_TW": "成功"
        },
        "virusScanResult" : {
            "zh_TW": "掃毒結果"
        },
        "downloadUrl" : {
            "zh_TW": "下載網址"
        },
        "sizeKB" : {
            "zh_TW": "檔案大小 (KB)"
        },
        "(from CivitAI)" : {
            "zh_TW": "(來自CivitAI)"
        },
        "(No Trigger Word)" : {
            "zh_TW": "(無觸發詞)"
        },
        "edit prompt words..." : {
            "zh_TW": "編輯..."
        },
        "Not" : {
            "zh_TW": "否"
        },
        "##Civitai##" : {
            "zh_TW": "(CivitAI提供的提詞)"
        },
        "Sort Order" : {
            "zh_TW": "排序方式"
        },
        "Ascending" : {
            "zh_TW": "升序排序"
        },
        "Descending" : {
            "zh_TW": "降序排序"
        },
        "Content copied to clipboard" : {
            "zh_TW": "成功將所選擇的儲存格複製到剪貼簿"
        },
        "Failed to copy" : {
            "zh_TW": "複製失敗"
        },
        "translating..." : {
            "zh_TW": "翻譯中..."
        },
        "translation error" : {
            "zh_TW": "翻譯發生錯誤"
        },
        "add prompt by image" : {
            "zh_TW": "加入範例圖片的提示詞"
        },
        "use prompt and setting by image" : {
            "zh_TW": "使用範例圖片的提示詞和生圖設定"
        },
        "Chinese Traditional" : {
            "zh_TW": "繁體中文"
        },
        "add model using suggested setting" : {
            "zh_TW": "使用建議的模型設定"
        },
        "Use suggested weight" : {
            "zh_TW": "使用建議的權重"
        },
        "Use suggested params" : {
            "zh_TW": "使用建議的模型參數"
        },
        "Use suggested weight and params" : {
            "zh_TW": "使用建議的權重和模型參數"
        },
    };
    
    lorahelper.localizationPromise = new Promise((resolve, reject) => {
        lorahelper.localizationPromiseResolve = resolve;
        lorahelper.localizationPromiseReject = reject;
    });

    let other_translate = {};
    let try_localization_looping = false;
    let try_localization = window.setInterval(function(){
        if (try_localization_looping) return;
        try {
            if(!lorahelper.is_nullptr(window.localization) && !lorahelper.is_nullptr(opts.localization)){
                try_localization_looping = true;
                if (Object.keys(window.localization).length) {
                    for (const [key, value] of Object.entries(my_localization_data)) {
                        if(value[opts.localization]){
                            window.localization[key] = value[opts.localization];
                        }
                    }
                } else {
                    if(has_bilingual()){
                        const dirs = opts["bilingual_localization_dirs"];
                        const file = opts["bilingual_localization_file"];
                        if (file !== "None" && dirs !== "None"){
                            const dirs_list = JSON.parse(dirs);
                            const regex_scope = /^##(?<scope>\S+)##(?<skey>\S+)$/ // ##scope##.skey
                            const i18n = JSON.parse(lorahelper.readFile(dirs_list[file]), (key, value) => {
                                if (key.startsWith('@@')) {} //skip
                                else if (regex_scope.test(key)) {} //skip
                                else return value;
                            });
                            other_translate = i18n;
                        }
                    }
                    //opts["bilingual_localization_dirs"]
                }
                if(typeof(lorahelper.localizationPromiseResolve) === typeof(lorahelper.noop_func)){
                    lorahelper.localizationPromiseResolve();
                }
                try_localization_looping = false;
                window.clearInterval(try_localization);
            }
        } catch (error) {
            console.log(error.stack);
        }
    },10);

    function get_if_not_empty(toget){
        if(lorahelper.is_empty(toget)) return undefined;
        if((''+toget).toLowerCase() === "none") return undefined;
        return toget;
    }
    function get_system_language(){
        let DateTimeFormat_obj = Intl?.DateTimeFormat;
        if(typeof(DateTimeFormat_obj) !== typeof(lorahelper.noop_func)) return undefined;
        return DateTimeFormat_obj()?.resolvedOptions()?.locale
    }

    function has_bilingual(){
        return !!opts.bilingual_localization_enabled && !!get_if_not_empty(opts.bilingual_localization_file) && !(Object.keys(window.localization||{}).length);
    }

    function get_language_code(for_translate){
        const selected_language_code = get_if_not_empty(opts.localization);
        if(selected_language_code){
            return selected_language_code
        } else {
            if(opts.bilingual_localization_enabled){
                const bilingual_language_code = get_if_not_empty(opts.bilingual_localization_file);
                if (bilingual_language_code){
                    return (x=>((x||[]).length>1)?x.slice(0,-1):x)(bilingual_language_code.split(".")).join(".");
                }
            } else if (for_translate) {
                const browser_language_code = get_if_not_empty(navigator.language || navigator.userLanguage);
                if (browser_language_code){
                    return browser_language_code;
                }
                const system_language_code = get_if_not_empty(get_system_language());
                if (system_language_code){
                    return system_language_code;
                }
                return "en"; //default english
            }
        }
        return undefined;
    }

    function is_same_language(lang1, lang2){
        lang1_split = (''+lang1).trim().toLowerCase().replace(/[_\s\-\+]+/g,"_").split("_");
        lang2_split = (''+lang2).trim().toLowerCase().replace(/[_\s\-\+]+/g,"_").split("_");
        if (lang1_split[0] !== lang2_split[0]) return false;
        if (lang1_split.length <= 1) return true;
        if (lang2_split.length <= 1) return false;
        let flag = true;
        for (const variants of lang1_split){
            flag = flag && !!lang2_split.includes(variants);
        }
        return flag;
    }

    function get_myTranslation_in_mydist(msg, lang_code){
        const msg_obj = my_localization_data[msg];
        if (msg_obj){
            for (const [lang_name, translated_msg] of Object.entries(msg_obj)) {
                if(is_same_language(lang_name, lang_code)) return translated_msg;
            }
        }
        return undefined;
    }

    function my_getTranslation(msg){
        const selected_language_code = get_language_code();
        let trans = getTranslation(msg);
        if (selected_language_code){
            const my_translate = get_myTranslation_in_mydist(msg,selected_language_code);
            if(my_translate) return my_translate;
        }
        if (!trans) {
            trans = other_translate[msg];
            if (!trans) trans = msg;
        }
        return trans;
    }

    function set_bilingual(element){
        if (!has_bilingual()) return;
        if (!lorahelper.is_nullptr(element.querySelector(".bilingual__trans_wrapper"))) return;
        const msg = element.innerHTML;
        element.innerHTML = get_UI_display(msg);
    }

    function get_UI_display(msg){
        const tmsg = my_getTranslation(msg);
        if (has_bilingual()){
            if (tmsg != msg){
                if(opts.bilingual_localization_order.toLowerCase() === "translation first")
                    return `<div class="bilingual__trans_wrapper">${tmsg}<em>${msg}</em></div>`;
                else return `<div class="bilingual__trans_wrapper">${msg}<em>${tmsg}</em></div>`
            }
        }
        return tmsg;
    }

    function translate_language_selector(){
        lorahelper.dataedit_translate_btn = lorahelper.gradioApp().getElementById("lorahelp_dataedit_translate_btn")
        //Create and append select list
        var selectList = document.createElement("select");
        selectList.id = "translate_language_selector";
        let select_box = document.createElement("div");

        selectList.style.position = "absolute";
        selectList.style.top = "0px";
        selectList.style.border = "none";
        selectList.style.backgroundColor = "transparent";
        selectList.style.opacity = 0;

        select_box.appendChild(selectList);
        lorahelper.dataedit_translate_btn.appendChild(select_box);
        lorahelper.dataedit_translate_translate_language_selector = selectList;

        let lang_display = document.createElement("span");
        lang_display.style.margin = "0.5em";
        select_box.appendChild(lang_display);

        //Create and append the options
        let i = 0;
        const selected_lang_code = get_language_code(true);
        let select_id = 0;
        for (const [lang_code, lang_name] of Object.entries(lorahelper.languages)) {
            var option = document.createElement("option");
            const lang_data = !!(lang_name.name) ? lang_name : {name: lang_name};
			option.value = lang_code;
			option.text = lang_data.display ? `${lang_code} - ${lang_data.display} (${lang_data.name})` : lang_data.name;
			option.setAttribute("title", lang_data.display ? lang_data.display : lang_data.name);
			option.setAttribute("lang-name", lang_data.name);
            if(is_same_language(lang_code, selected_lang_code)){
                lang_display.innerHTML = lang_data.display;
                select_id = i;
            }
            //option.text = my_getTranslation(lang_name);
            selectList.appendChild(option);
            ++i;
        }
        selectList.addEventListener("change", function(event){
            const lang_name = lorahelper.languages[selectList.value];
            const lang_data = !!(lang_name.name) ? lang_name : {name: lang_name};
            lang_display.innerHTML = lang_data.display;
        });
        lorahelper.dataedit_translate_translate_language_selector.selectedIndex = select_id;
    }
    lorahelper.translate_language_selector = translate_language_selector;
    lorahelper.get_language_code = get_language_code;
    lorahelper.my_getTranslation = my_getTranslation;
    lorahelper.get_UI_display = get_UI_display;

    lorahelper.languages = {
        "auto": "Auto",
        "af": {
          "name": "Afrikaans",
          "display": "Afrikaans"
        },
        "sq": {
          "name": "Albanian",
          "display": "shqip"
        },
        "am": {
          "name": "Amharic",
          "display": "አማርኛ"
        },
        "ar": {
          "name": "Arabic",
          "display": "العربية"
        },
        "hy": {
          "name": "Armenian",
          "display": "հայերեն"
        },
        "az": {
          "name": "Azerbaijani",
          "display": "azərbaycanca"
        },
        "eu": {
          "name": "Basque",
          "display": "euskara"
        },
        "be": {
          "name": "Belarusian",
          "display": "беларуская"
        },
        "bn": {
          "name": "Bengali",
          "display": "বাংলা"
        },
        "bs": {
          "name": "Bosnian",
          "display": "bosanski"
        },
        "bg": {
          "name": "Bulgarian",
          "display": "български"
        },
        "ca": {
          "name": "Catalan",
          "display": "català"
        },
        "ceb": {
          "name": "Cebuano",
          "display": "Cebuano"
        },
        "ny": {
          "name": "Chichewa",
          "display": "Chi-Chewa"
        },
        "zh": {
          "name": "Chinese",
          "display": "中文"
        },
        "zh_cn": {
          "name": "Chinese Simplified",
          "display": "简体中文 (中国大陆)"
        },
        "zh_tw": {
          "name": "Chinese Traditional",
          "display": "繁體中文 (臺灣)"
        },
        "zh_hk": {
          "name": "Chinese Traditional",
          "display": "繁體中文 (香港)"
        },
        "co": {
          "name": "Corsican",
          "display": "corsu"
        },
        "hr": {
          "name": "Croatian",
          "display": "hrvatski"
        },
        "cs": {
          "name": "Czech",
          "display": "čeština"
        },
        "da": {
          "name": "Danish",
          "display": "dansk"
        },
        "nl": {
          "name": "Dutch",
          "display": "Nederlands"
        },
        "en": {
          "name": "English",
          "display": "English"
        },
        "eo": {
          "name": "Esperanto",
          "display": "Esperanto"
        },
        "et": {
          "name": "Estonian",
          "display": "eesti"
        },
        "tl": {
          "name": "Filipino",
          "display": "Tagalog"
        },
        "fi": {
          "name": "Finnish",
          "display": "suomi"
        },
        "fr": {
          "name": "French",
          "display": "français"
        },
        "fy": {
          "name": "Frisian",
          "display": "Frysk"
        },
        "gl": {
          "name": "Galician",
          "display": "galego"
        },
        "ka": {
          "name": "Georgian",
          "display": "ქართული"
        },
        "de": {
          "name": "German",
          "display": "Deutsch"
        },
        "el": {
          "name": "Greek",
          "display": "Ελληνικά"
        },
        "gu": {
          "name": "Gujarati",
          "display": "ગુજરાતી"
        },
        "ht": {
          "name": "Haitian Creole",
          "display": "Kreyòl ayisyen"
        },
        "ha": {
          "name": "Hausa",
          "display": "Hausa"
        },
        "haw": {
          "name": "Hawaiian",
          "display": "Hawaiʻi"
        },
        "he": {
          "name": "Hebrew",
          "display": "עברית"
        },
        "iw": "Hebrew",
        "hi": {
          "name": "Hindi",
          "display": "हिन्दी"
        },
        "hmn": "Hmong",
        "hu": {
          "name": "Hungarian",
          "display": "magyar"
        },
        "is": {
          "name": "Icelandic",
          "display": "íslenska"
        },
        "ig": {
          "name": "Igbo",
          "display": "Igbo"
        },
        "id": {
          "name": "Indonesian",
          "display": "Bahasa Indonesia"
        },
        "ga": {
          "name": "Irish",
          "display": "Gaeilge"
        },
        "it": {
          "name": "Italian",
          "display": "italiano"
        },
        "ja": {
          "name": "Japanese",
          "display": "日本語"
        },
        "jw": "Javanese",
        "kn": {
          "name": "Kannada",
          "display": "ಕನ್ನಡ"
        },
        "kk": {
          "name": "Kazakh",
          "display": "қазақша"
        },
        "km": {
          "name": "Khmer",
          "display": "ភាសាខ្មែរ"
        },
        "rw": {
          "name": "Kinyarwanda",
          "display": "Ikinyarwanda"
        },
        "ko": {
          "name": "Korean",
          "display": "한국어"
        },
        "ku": {
          "name": "Kurdish (Kurmanji)",
          "display": "kurdî"
        },
        "ky": {
          "name": "Kyrgyz",
          "display": "кыргызча"
        },
        "lo": {
          "name": "Lao",
          "display": "ລາວ"
        },
        "la": {
          "name": "Latin",
          "display": "Latina"
        },
        "lv": {
          "name": "Latvian",
          "display": "latviešu"
        },
        "lt": {
          "name": "Lithuanian",
          "display": "lietuvių"
        },
        "lb": {
          "name": "Luxembourgish",
          "display": "Lëtzebuergesch"
        },
        "mk": {
          "name": "Macedonian",
          "display": "македонски"
        },
        "mg": {
          "name": "Malagasy",
          "display": "Malagasy"
        },
        "ms": {
          "name": "Malay",
          "display": "Bahasa Melayu"
        },
        "ml": {
          "name": "Malayalam",
          "display": "മലയാളം"
        },
        "mt": {
          "name": "Maltese",
          "display": "Malti"
        },
        "mi": {
          "name": "Maori",
          "display": "Māori"
        },
        "mr": {
          "name": "Marathi",
          "display": "मराठी"
        },
        "mn": {
          "name": "Mongolian",
          "display": "монгол"
        },
        "my": {
          "name": "Myanmar (Burmese)",
          "display": "မြန်မာဘာသာ"
        },
        "ne": {
          "name": "Nepali",
          "display": "नेपाली"
        },
        "no": "Norwegian",
        "or": {
          "name": "Odia (Oriya)",
          "display": "ଓଡ଼ିଆ"
        },
        "ps": {
          "name": "Pashto",
          "display": "پښتو"
        },
        "fa": {
          "name": "Persian",
          "display": "فارسی"
        },
        "pl": {
          "name": "Polish",
          "display": "polski"
        },
        "pt": {
          "name": "Portuguese",
          "display": "português"
        },
        "pa": {
          "name": "Punjabi",
          "display": "ਪੰਜਾਬੀ"
        },
        "ro": {
          "name": "Romanian",
          "display": "română"
        },
        "ru": {
          "name": "Russian",
          "display": "русский"
        },
        "sm": {
          "name": "Samoan",
          "display": "Gagana Samoa"
        },
        "gd": {
          "name": "Scots Gaelic",
          "display": "Gàidhlig"
        },
        "sr": {
          "name": "Serbian",
          "display": "српски / srpski"
        },
        "st": {
          "name": "Sesotho",
          "display": "Sesotho"
        },
        "sn": {
          "name": "Shona",
          "display": "chiShona"
        },
        "sd": {
          "name": "Sindhi",
          "display": "سنڌي"
        },
        "si": {
          "name": "Sinhala",
          "display": "සිංහල"
        },
        "sk": {
          "name": "Slovak",
          "display": "slovenčina"
        },
        "sl": {
          "name": "Slovenian",
          "display": "slovenščina"
        },
        "so": {
          "name": "Somali",
          "display": "Soomaaliga"
        },
        "es": {
          "name": "Spanish",
          "display": "español"
        },
        "su": {
          "name": "Sundanese",
          "display": "Sunda"
        },
        "sw": {
          "name": "Swahili",
          "display": "Kiswahili"
        },
        "sv": {
          "name": "Swedish",
          "display": "svenska"
        },
        "tg": {
          "name": "Tajik",
          "display": "тоҷикӣ"
        },
        "ta": {
          "name": "Tamil",
          "display": "தமிழ்"
        },
        "tt": {
          "name": "Tatar",
          "display": "татарча / tatarça"
        },
        "te": {
          "name": "Telugu",
          "display": "తెలుగు"
        },
        "th": {
          "name": "Thai",
          "display": "ไทย"
        },
        "tr": {
          "name": "Turkish",
          "display": "Türkçe"
        },
        "tk": {
          "name": "Turkmen",
          "display": "Türkmençe"
        },
        "uk": {
          "name": "Ukrainian",
          "display": "українська"
        },
        "ur": {
          "name": "Urdu",
          "display": "اردو"
        },
        "ug": {
          "name": "Uyghur",
          "display": "ئۇيغۇرچە / Uyghurche"
        },
        "uz": {
          "name": "Uzbek",
          "display": "oʻzbekcha / ўзбекча"
        },
        "vi": {
          "name": "Vietnamese",
          "display": "Tiếng Việt"
        },
        "cy": {
          "name": "Welsh",
          "display": "Cymraeg"
        },
        "xh": {
          "name": "Xhosa",
          "display": "isiXhosa"
        },
        "yi": {
          "name": "Yiddish",
          "display": "ייִדיש"
        },
        "yo": {
          "name": "Yoruba",
          "display": "Yorùbá"
        },
        "zu": {
          "name": "Zulu",
          "display": "isiZulu"
        }
      };
}
let module_loadded = false;
document.addEventListener("DOMContentLoaded", () => {
    if (module_loadded) return;
    module_loadded = true;
    module_init();
});
document.addEventListener("load", () => {
    if (module_loadded) return;
    module_loadded = true;
    module_init();
});
})();