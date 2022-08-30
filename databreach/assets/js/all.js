// document.querySelector("body > div.disclaimer").remove();

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

let data_set = [],
    bubbles_labels = [],
    font_sizes = [];

function sort_unique(arr) {
    return arr.sort().filter(function(el,i,a) {
        return (i==a.indexOf(el));
    });
}
//usage:
readTextFile("assets/data/data_3.json", function (text) {
    data_json = JSON.parse(text);

    let data_industries = [],
        data_coordinates = [{ x: 0, y: 0, r: 0 }],
        countOfIndustries = 0;


    for (let i = 0; i < data_json.length; i++) {

        if (data_json[i]['Industry'] !== "") {
            let isFound = data_industries.some(element => {
                if (element.Title === data_json[i]['Industry'].toLowerCase() && element.BreachDate === data_json[i]['BreachDate'].toLowerCase().split("-")[0]) {
                    return true;
                }
                return false;
            });

            if (!isFound) {
                data_industries.push({
                    Title: data_json[i]['Industry'].toLowerCase(),
                    BreachDate: data_json[i]['BreachDate'].toLowerCase().split("-")[0],
                    PwnCount: 1,
                    DataClasses: data_json[i]['DataClasses'],
                    AccHacked:  data_json[i]['PwnCount']
                });
            } else {
                data_industries.some(element => {
                    if (element.Title === data_json[i]['Industry'].toLowerCase() && element.BreachDate === data_json[i]['BreachDate'].toLowerCase().split("-")[0]) {
                        element.PwnCount = element.PwnCount + 1;
                        element.AccHacked = element.AccHacked + data_json[i]['PwnCount'];
                        element.DataClasses = element.DataClasses + " / " + data_json[i]['DataClasses'];
                    }
                });
            }
        }
    }

    let data_counts = [],
        year_for_index = [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

    for (let i = 0; i < year_for_index.length; i++) {
        let countIndustries = 0,
            countOfCompanies = 0,
            countOfAccountAccountsHacked = 0,
            industry_filter = '',
            data_stolen_filter = '';

        for (let m = 0; m < data_json.length; m++) {
            if (data_json[m]['BreachDate'].split("-")[0] == year_for_index[i]) {
                countOfCompanies++;
                countOfAccountAccountsHacked += data_json[m]['PwnCount'];
                countOfAccountAccountsHacked = countOfAccountAccountsHacked;
            }
        }
        for (let m = 0; m < data_industries.length; m++) {
            if (data_industries[m]['BreachDate'].split("-")[0] == year_for_index[i]) {
                countIndustries++;
                industry_filter += data_industries[m]['Title'] + "//";
                data_stolen_filter += data_industries[m]['DataClasses'] + "\n";
            }
        }

        industry_filter = industry_filter.replace(0, industry_filter.length - 2);
        data_stolen_filter = data_stolen_filter.replace(0, data_stolen_filter.length - 2);

        data_counts.push({
            count_industries: countIndustries,
            count_companies: countOfCompanies,
            count_accounts_hacked: countOfAccountAccountsHacked,
            industry_filtrate: industry_filter,
            data_stolen: data_stolen_filter
        });

    }

    let group_toggles = document.querySelectorAll("#group_toggles > div"),
        selectBy = data_industries,
        selecyByTitle = "industries",
        industryFilter = false,
        industryFilterName = '';
    dataStolenFilter = false;
    dataStolenFilterName = '';

    let year_filter_elements = document.querySelectorAll("#year_filter_elements > span"),
        slide_element = document.querySelector("#slide_element"),
        last_year = 2007,
        years_plus = 0,
        accounts_hacked = document.querySelector("#accounts_hacked"),
        companies_hacked = document.querySelector("#companies_hacked"),
        industries = document.querySelector("#industries"),
        chart = document.querySelector("#chart"),
        slide_element_resize_minus = document.querySelector("#slide_element_resize_minus"),
        slide_element_resize_plus = document.querySelector("#slide_element_resize_plus"),
        slider = document.querySelector("#slider");


    HTMLElement.prototype.filterChart = function (year, y_plus) {
        if (selecyByTitle == "industries") {
            filter_Industries(year, y_plus);
        } else {
            filter_Companies(year, y_plus);
        }


        let data_stolen = '',
            industries_f = '';

        if(!y_plus){
            y_plus = 1;
        }

        for (let ix = year + y_plus - 1; ix >= year; ix--) {
            data_stolen += data_counts[year_for_index.indexOf(ix)]['data_stolen'];
            industries_f += data_counts[year_for_index.indexOf(ix)]['industry_filtrate']
        }
        data_stolen = data_stolen.replaceAll(' / ', '\n').split("\n").filter(item => item.length)
        data_stolen = sort_unique(data_stolen).filter(Boolean);

        industries_f = industries_f.replaceAll('//', '\n').split("\n").filter(item => item.length);
        industries_f = sort_unique(industries_f).filter(Boolean);

        let data_stolen_select = document.querySelector("#data_stolen");

        data_stolen_select.innerHTML = "<option value='any'>Any</option>";

        for (let i = 0; i < data_stolen.length; i++) {
            data_stolen_select.innerHTML += "<option value=\"" + data_stolen[i] + "\">" + data_stolen[i] + "</option>";
        }

        if(dataStolenFilter){
            select('data_stolen', dataStolenFilterName);
        }


        let industry_select = document.querySelector("#industry_select");

        industry_select.innerHTML = "<option value='all'>All ( " + (industries_f.length) + " )</option>";

        for (let i = 0; i < industries_f.length; i++) {
            industry_select.innerHTML += "<option value=\"" + industries_f[i] + "\">" + industries_f[i] + "</option>";
        }

        if(industryFilter){
            select('industry_select', industryFilterName);
        }

    }

    function filter_Industries(year, y_plus) {
        chart.classList.add("active");
        slider.classList.remove("active");

        let this_index = year_for_index.indexOf(year),
            otherYear = false;

        if (last_year != year) {
            otherYear = true;
            last_year = year;
        }
        if (year + y_plus > 2022) {
            y_plus = 2022 - year + 1;
        } else {
            years_plus = y_plus;
        }
        years_plus = y_plus;
        for (let i = 0; i < year_filter_elements.length; i++) {
            year_filter_elements[i].classList.remove("active");
        }

        slide_element.style.left = "calc(100% / 15 * " + this_index + " + 15px)";
        slide_element_resize_minus.style.left =  "calc(100% / 15 * " + this_index + " + 15px)";

        if(!years_plus){
            slide_element_resize_plus.style.left =  "calc(100% / 15 * " + ( this_index + 1 ) + " + 5px)";
        }else{
            slide_element_resize_plus.style.left =  "calc(100% / 15 * " + ( this_index + years_plus ) + " + 5px)";
        }

        if (!years_plus) {
            year_filter_elements[this_index].classList.add("active");
            year_filter_elements[this_index + 1].classList.add("active");
        } else {
            for (let x = last_year + years_plus; x >= year; x--) {
                year_filter_elements[year_for_index.indexOf(x)].classList.add("active");
            }
            slide_element.style.width = "calc(100% / 15 * " + years_plus + ")";
        }

        data_coordinates = [];

        setTimeout(function () {
            chart.classList.remove("active");
            chart.innerHTML = "";

            let countOfData = 0,
                sortedData = [];

            for (let i = 0; i < selectBy.length; i++) {
                if (!years_plus) {
                    if (selectBy[i]['BreachDate'].split("-")[0] == year) {
                        sortedData.push(selectBy[i]);
                    }
                } else {
                    if (selectBy[i]['BreachDate'].split("-")[0] >= year && selectBy[i]['BreachDate'].split("-")[0] <= year + years_plus - 1) {
                        sortedData.push(selectBy[i]);
                    }
                }

            };

            if(!years_plus || years_plus <= 1){
                if (otherYear) {
                    industryFilter = false;

                    document.querySelector("#data_stolen").options[0].selected = true;

                    dataStolenFilter = false;
                    let industries_f = data_counts[this_index]['industry_filtrate'].split("//");

                }
            }

            accounts_hacked.style.opacity = 0.3;
            companies_hacked.style.opacity = 0.3;
            industries.style.opacity = 0.3;

            const sorted_by_name = sortedData.sort((a, b) => {
                return b.PwnCount - a.PwnCount;
            });

            let countFiltrate = 0
            filtrateArray = [];

            for (let i = 0; i < sortedData.length; i++) {
                if (industryFilter) {
                    if (selecyByTitle != "industries") {
                        if (sortedData[i]['Industry'].toLowerCase() != industryFilterName.toLowerCase()) {
                            continue;
                        }
                    } else {
                        if (sortedData[i]['Title'].toLowerCase() != industryFilterName.toLowerCase()) {
                            continue;
                        }
                    }
                }
                if (dataStolenFilter) {
                    let data_cls = sortedData[i]['DataClasses'].replaceAll(" / ", "\n").split("\n");

                    function checkArr(element) {
                        if (element.toLowerCase() == dataStolenFilterName.toLowerCase()) {
                            return true;
                        }
                        return false;
                    }

                    if (!data_cls.find(checkArr)) {
                        continue;
                    }
                }

                filtrateArray.push(sortedData[i]);
            }

            let newFiltrate = [];

            for (let i = 0; i < filtrateArray.length; i++) {

                let isFound = newFiltrate.some(element => {
                    if (element.Title.toLowerCase() === filtrateArray[i]['Title'].toLowerCase()) {
                        return true;
                    }
                    return false;
                });

                if (!isFound) {
                    newFiltrate.push({
                        Title: filtrateArray[i]['Title'],
                        PwnCount: filtrateArray[i]['PwnCount'],
                        DataClasses: filtrateArray[i]['DataClasses'],
                        AccHacked:  filtrateArray[i]['AccHacked']
                    });
                } else {
                    newFiltrate.some(element => {
                        if (element.Title.toLowerCase() === filtrateArray[i]['Title'].toLowerCase()) {
                            element.PwnCount = element.PwnCount + filtrateArray[i]['PwnCount'];
                            element.AccHacked = element.AccHacked + filtrateArray[i]['AccHacked'];
                            element.DataClasses = element.DataClasses + " / " + filtrateArray[i]['DataClasses'];
                        }
                    });
                }
            }

            if(years_plus && years_plus > 1){
                if (otherYear) {
                    industryFilter = false;
                    document.querySelector("#data_stolen").options[0].selected = true;
                    dataStolenFilter = false;
                }
            }

            if (!years_plus) {
                let ah = data_counts[this_index]['count_accounts_hacked'];
                ch = data_counts[this_index]['count_companies'];
                ind = data_counts[this_index]['count_industries'];

                if (ah.toString().length < 9) {
                    ah = (ah / 1000000);
                    ah = ah.toString().slice(0, 4) + "M";
                } else {
                    ah = (ah / 1000000000);
                    ah = ah.toString().slice(0, 4) + "B";
                }

                setTimeout(() => accounts_hacked.innerText = ah, 150);
                setTimeout(() => companies_hacked.innerText = ch, 150);
                setTimeout(() => industries.innerText = ind, 150);
            } else {

                let data_new = [],
                    ah = 0,
                    ch = 0,
                    ind = 0;

                for (let ix = year + years_plus - 1; ix >= year; ix--) {
                    ah += data_counts[year_for_index.indexOf(ix)]['count_accounts_hacked'];
                    ch += data_counts[year_for_index.indexOf(ix)]['count_companies'];
                }

                ind = newFiltrate.length;

                if (ah.toString().length < 9) {
                    ah = (ah / 1000000);
                    ah = ah.toString().slice(0, 4) + "M";
                } else {
                    ah = (ah / 1000000000);
                    ah = ah.toString().slice(0, 4) + "B";
                }

                setTimeout(() => accounts_hacked.innerText = ah, 150);
                setTimeout(() => companies_hacked.innerText = ch, 150);
                setTimeout(() => industries.innerText = ind, 150);
            }

            setTimeout(() => accounts_hacked.style.opacity = 1, 150);
            setTimeout(() => companies_hacked.style.opacity = 1, 150);
            setTimeout(() => industries.style.opacity = 1, 150);

            if(years_plus > 1){
                countOfData = newFiltrate.length;

            }else{
                countOfData = newFiltrate.length;
            }

            if (countOfData <= 5) {
                countOfData = 10;
            }
            else if (countOfData > 5 && countOfData <= 10) {
                countOfData = 14;
            }
            else if (countOfData > 10 && countOfData <= 15) {
                countOfData = 20;
            }
            else if (countOfData > 15 && countOfData <= 30) {
                countOfData = 30;
            }

            let count_of_pwn = 0;

            for (let j = 0; j < newFiltrate.length; j++) {
                count_of_pwn += newFiltrate[j]['PwnCount'];
            }

            newFiltrate.sort((a, b) => {
                return b.PwnCount - a.PwnCount;
            });

            let eq = 0;

            if(count_of_pwn <= 5){
                eq = chart.offsetWidth / 5;
            }else{
                eq = chart.offsetWidth / count_of_pwn;
            }
            for (let i = 0; i < newFiltrate.length; i++) {

                let randomize_data = newFiltrate[i]['PwnCount'],
                    radius = randomize_data * eq;

                let element_x = 0;
                    element_y = 0,
                    asd = 0;

                let selected_background, selected_outline;

                radius = 26 + radius / 3;

                if(randomize_data >= 1 && randomize_data <= 3){
                    selected_background = 'rgba(57, 66, 234, 1)';
                    selected_outline = 'rgba(57, 66, 234, 0.3)';
                    radius += randomize_data;
                }else if(randomize_data >= 4 && randomize_data <= 10){
                    selected_background = 'rgba(253, 190, 16, 1)';
                    selected_outline = 'rgba(253, 190, 16, 0.3)';
                    radius += 4;
                }else if(randomize_data >= 11 && randomize_data <= 19){
                    selected_background = 'rgba(252, 115, 3, 1)';
                    selected_outline = 'rgba(252, 115, 3, 0.3)';
                    radius += 8;
                }else{
                    selected_background = 'rgba(239, 69, 67, 1)';
                    selected_outline = 'rgba(239, 69, 67, 0.3)';
                    radius += 12;
                }

                if(radius < 100){
                    // radius = 60 - (40 - radius);
                    radius = 20 + radius;
                }
                if(radius >= 100){
                    radius = 80 + radius / 3;
                }
                start: while (true) {
                    element_x = Math.ceil(Math.random() * (chart.offsetWidth));
                    element_y = Math.ceil(Math.random() * (chart.offsetHeight - 150)) + 50;

                    if(element_x - radius < 0 || element_y - radius < 0 || element_x + radius > chart.offsetWidth|| element_y + radius > chart.offsetHeight){
                        continue start;
                    }

                    if(asd == 5000){
                        radius -= 10;
                    }
                    if(asd == 10000){
                        radius -= 10;
                    }
                    if (asd == 15000) {
                        break;
                    }
                    asd++;

                    for (let z = 0; z < data_coordinates.length; z++) {
                        if ( radius + data_coordinates[z]['r'] > Math.sqrt(Math.pow(element_x - data_coordinates[z]['x'], 2) + Math.pow(element_y - data_coordinates[z]['y'], 2))){
                            continue start;
                        }
                    }
                    break;
                }

                data_coordinates.push({
                    x: element_x,
                    y: element_y,
                    r: radius
                });

                let acc_hacked = newFiltrate[i]['AccHacked'];

                if (acc_hacked.toString().length < 9) {
                    acc_hacked = (acc_hacked / 1000000);
                    acc_hacked = acc_hacked.toString().slice(0, 4) + "M";
                } else {
                    acc_hacked = (acc_hacked / 1000000000);
                    acc_hacked = acc_hacked.toString().slice(0, 4) + "B";
                }

                chart.innerHTML += "<div class='bubble' style='left:" + element_x + "px; top: " + element_y + "px; width:" + (radius * 2) + "px; height: " + (radius * 2) + "px; padding: " + (radius * 2 / 10) + "px; font-size: " + (radius * 2 / 10) + "px; transform: translate(-" + radius + "px, -" + radius + "px); outline-color: " + selected_outline + "; background-color: " + selected_background + "'>" +
                    "<div class='data_count'>" + randomize_data + "</div>" +
                    "<div class='bubble_title'><span><span class='acc_hacked'>( " + acc_hacked + " )</span>" + newFiltrate[i]['Title'] + "</span></div>" +
                    "<button onclick='check_industry(\"" + newFiltrate[i]['Title'] + "\")' class='bubble_btn'>View report</button>" +
                    "</div>";

            }
        }, 300);
    }

    console.log(data_industries);

    function filter_Companies(year, y_plus) {
        chart.classList.add("active");
        slider.classList.add("active");
        let this_index = year_for_index.indexOf(year),
            otherYear = false;

        if (last_year != year) {
            otherYear = true;
            last_year = year;
        }
        if (year + y_plus > 2022) {
            y_plus = 2022 - year + 1;
        } else {
            years_plus = y_plus;
        }
        years_plus = y_plus;
        for (let i = 0; i < year_filter_elements.length; i++) {
            year_filter_elements[i].classList.remove("active");
        }

        slide_element.style.left = "calc(100% / 15 * " + this_index + " + 15px)";
        slide_element_resize_minus.style.left =  "calc(100% / 15 * " + this_index + " + 15px)";
        if(!years_plus){
            slide_element_resize_plus.style.left =  "calc(100% / 15 * " + ( this_index + 1 ) + " + 5px)";
        }else{
            slide_element_resize_plus.style.left =  "calc(100% / 15 * " + ( this_index + years_plus ) + " + 5px)";
        }

        if (!years_plus) {
            year_filter_elements[this_index].classList.add("active");
            year_filter_elements[this_index + 1].classList.add("active");
        } else {
            for (let x = last_year + years_plus; x >= year; x--) {
                year_filter_elements[year_for_index.indexOf(x)].classList.add("active");
            }
            slide_element.style.width = "calc(100% / 15 * " + years_plus + ")";
        }

        data_coordinates = [];

        setTimeout(function () {
            chart.classList.remove("active");
            chart.innerHTML = '';

            let countOfData = 0,
                sortedData = [];

            for (let i = 0; i < selectBy.length; i++) {
                if (!years_plus) {
                    if (selectBy[i]['BreachDate'].split("-")[0] == year) {
                        sortedData.push(selectBy[i]);
                    }
                } else {
                    if (selectBy[i]['BreachDate'].split("-")[0] >= year && selectBy[i]['BreachDate'].split("-")[0] <= year + years_plus - 1) {
                        sortedData.push(selectBy[i]);
                    }
                }

            };

            const sorted_by_name = sortedData.sort((a, b) => {
                return b.PwnCount - a.PwnCount;
            });

            filtrateArray = [];

            for (let i = 0; i < sortedData.length; i++) {
                if (industryFilter) {
                    if (sortedData[i]['Industry'].toLowerCase() != industryFilterName.toLowerCase()) {
                        continue;
                    }
                }
                if (dataStolenFilter == true) {
                    let data_cls = sortedData[i]['DataClasses'].split("\n");

                    function checkArr(element) {
                        if (element.toLowerCase() == dataStolenFilterName.toLowerCase()) {
                            return true;
                        }
                        return false;
                    }

                    if (!data_cls.find(checkArr)) {
                        continue;
                    }
                }

                filtrateArray.push(sortedData[i]);
            }

            let final_echo = "",
                description;

            for (let i = 0; i < filtrateArray.length; i++) {
                description = filtrateArray[i]['Description'].replace( /(<([^>]+)>)/ig, '').replace(/D/g, '');
                final_echo += `
                <div onclick="getCompanyData(\`` + filtrateArray[i]['LogoPath'] + `\`,\`` + description + `\`,\`` + filtrateArray[i]['Title'] + `\`)">
                    <p>` + filtrateArray[i]['Title'] + `</p>
                    <p>` + filtrateArray[i]['Industry'].replace("\n", ", ") + `</p>
                    <p>` + filtrateArray[i]['PwnCount'].toLocaleString('en-US') + `</p>
                    <p>` + filtrateArray[i]['BreachDate'] + `</p>
                </div>
                `;
            }

            accounts_hacked.style.opacity = 0.3;
            companies_hacked.style.opacity = 0.3;
            industries.style.opacity = 0.3;

            if (!years_plus) {
                let ah = data_counts[this_index]['count_accounts_hacked'];
                ch = data_counts[this_index]['count_companies'];
                ind = data_counts[this_index]['count_industries'];

                if (ah.toString().length < 9) {
                    ah = (ah / 1000000);
                    ah = ah.toString().slice(0, 4) + "M";
                } else {
                    ah = (ah / 1000000000);
                    ah = ah.toString().slice(0, 4) + "B";
                }

                setTimeout(() => accounts_hacked.innerText = ah, 150);
                setTimeout(() => companies_hacked.innerText = ch, 150);
                setTimeout(() => industries.innerText = ind, 150);
            } else {

                let data_new = [],
                    ah = 0,
                    ch = 0,
                    ind = 0,
                    ind_new_data;

                for (let ix = year + years_plus - 1; ix >= year; ix--) {
                    ah += data_counts[year_for_index.indexOf(ix)]['count_accounts_hacked'];
                    ch += data_counts[year_for_index.indexOf(ix)]['count_companies'];
                    ind_new_data += data_counts[year_for_index.indexOf(ix)]['industry_filtrate'].replace("under");
                }

                ind = sort_unique(ind_new_data.replace("undefined", "").split("//")).slice(1).length;

                if (ah.toString().length < 9) {
                    ah = (ah / 1000000);
                    ah = ah.toString().slice(0, 4) + "M";
                } else {
                    ah = (ah / 1000000000);
                    ah = ah.toString().slice(0, 4) + "B";
                }

                setTimeout(() => accounts_hacked.innerText = ah, 150);
                setTimeout(() => companies_hacked.innerText = ch, 150);
                setTimeout(() => industries.innerText = ind, 150);
            }

            setTimeout(() => accounts_hacked.style.opacity = 1, 150);
            setTimeout(() => companies_hacked.style.opacity = 1, 150);
            setTimeout(() => industries.style.opacity = 1, 150);

            chart.innerHTML += `
            <div id="companies_table">
                <div id="companies_table_heading">
                    <div>company</div>
                    <div>industry</div>
                    <div>Accounts affected</div>
                    <div>breech date</div>
                </div>` +
                final_echo
            + `</div>`;

        }, 300);
    }

    document.body.filterChart(2021);

    let slide_zone = document.querySelector("#slide_zone"),
        drag_start_position = 0,
        drag_start_width = 0
        resize_func = false;

    slide_element_resize_plus.addEventListener("mousedown", function(e){
        slide_zone.addEventListener("mouseover", resize_element_plus);
    });
    slide_element_resize_minus.addEventListener("mousedown", function(e){
        drag_start_position = slide_element.offsetLeft;
        drag_start_width = slide_element.offsetWidth;
        slide_zone.addEventListener("mouseover", resize_element_minus);
    });

    function resize_element_plus(e){
        let bounds = slide_zone.getBoundingClientRect(),
            x = e.clientX - bounds.left;

        // slide_element_resize_plus.style.width = '40px';
        slide_element_resize_plus.style.left = (x - 5) + 'px';

        let one_slide = slide_zone.offsetWidth / 30;

        for(let i = -1; i < 30; i += 2){
            if (x >= i * one_slide && x < one_slide * (i + 2)) {
                resize_func = true;
                slide_element.style.width = ( one_slide * (i + 1) - slide_element.offsetLeft ) + 'px';
            }
        }

    }
    function resize_element_minus(e){
        let bounds = slide_zone.getBoundingClientRect();
        let x = e.clientX - bounds.left;

        // slide_element_resize_minus.style.width = '40px';
        slide_element_resize_minus.style.left = (x - 5) + 'px';

        let one_slide = slide_zone.offsetWidth / 30;

        for(let i = -1; i < 30; i += 2){
            if (x >= i * one_slide && x < one_slide * (i + 2)) {
                resize_func = true;
                slide_element.style.left = ( one_slide * (i + 1) + 12) + 'px';
                slide_element.style.width = ( drag_start_position + drag_start_width - ( one_slide * (i + 1) ) + 3) + 'px';
            }
        }
    }

    slide_element_resize_plus.addEventListener("mouseup", resize_evt_plus);
    slide_element_resize_minus.addEventListener("mouseup", resize_evt_minus);

    function resize_evt_plus(){
        resize_func = false;
        slide_element.classList.remove("active");

        let one_slide = slide_zone.offsetWidth / 30;

        console.log(parseInt(slide_element_resize_plus.style.left));
        console.log(parseInt(one_slide));

        if (parseInt(slide_element_resize_plus.style.left) >= 0 && parseInt(slide_element_resize_plus.style.left) < one_slide) {
            years_plus = 2008 - last_year;
        } else if (parseInt(slide_element_resize_plus.style.left) >= one_slide && parseInt(slide_element_resize_plus.style.left) < one_slide * 3) {
            years_plus = 2009 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 3 && parseInt(slide_element_resize_plus.style.left) < one_slide * 5) {
            years_plus = 2010 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 5 && parseInt(slide_element_resize_plus.style.left) < one_slide * 7) {
            years_plus = 2011 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 7 && parseInt(slide_element_resize_plus.style.left) < one_slide * 9) {
            years_plus = 2012 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 9 && parseInt(slide_element_resize_plus.style.left) < one_slide * 11) {
            years_plus = 2013 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 11 && parseInt(slide_element_resize_plus.style.left) < one_slide * 13) {
            years_plus = 2014 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 13 && parseInt(slide_element_resize_plus.style.left) < one_slide * 15) {
            years_plus = 2015 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 15 && parseInt(slide_element_resize_plus.style.left) < one_slide * 17) {
            years_plus = 2016 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 17 && parseInt(slide_element_resize_plus.style.left) < one_slide * 19) {
            years_plus = 2017 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 19 && parseInt(slide_element_resize_plus.style.left) < one_slide * 21) {
            years_plus = 2018 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 21 && parseInt(slide_element_resize_plus.style.left) < one_slide * 23) {
            years_plus = 2019 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 23 && parseInt(slide_element_resize_plus.style.left) < one_slide * 25) {
            years_plus = 2020 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 25 && parseInt(slide_element_resize_plus.style.left) < one_slide * 27) {
            years_plus = 2021 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 27 && parseInt(slide_element_resize_plus.style.left) < one_slide * 29) {
            years_plus = 2022 - last_year;
        }
        else if (parseInt(slide_element_resize_plus.style.left) >= one_slide * 29) {
            years_plus = 2023 - last_year;
        }

        slide_element_resize_plus.style.width = 10 + 'px';
        slide_element_resize_plus.style.left = (parseInt(slide_element_resize_plus.style.left) - 20) + 'px';

        if(years_plus < 1){
            years_plus = 1;
        }

        console.log(last_year);
        console.log(years_plus);

        document.body.filterChart(last_year, years_plus);
    }

    function resize_evt_minus(){
        resize_func = false;
        slide_element.classList.remove("active");

        let one_slide = slide_zone.offsetWidth / 30;

        if(!years_plus){
            years_plus = 1;
        }

        if (parseInt(slide_element_resize_minus.style.left) >= 0 && parseInt(slide_element_resize_minus.style.left) < one_slide) {
            years_plus += last_year - 2008;
            last_year -= last_year - 2008;
        } else if (parseInt(slide_element_resize_minus.style.left) >= one_slide && parseInt(slide_element_resize_minus.style.left) < one_slide * 3) {
            years_plus += last_year - 2009;
            last_year -= last_year - 2009;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 3 && parseInt(slide_element_resize_minus.style.left) < one_slide * 5) {
            years_plus += last_year - 2010;
            last_year -= last_year - 2010;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 5 && parseInt(slide_element_resize_minus.style.left) < one_slide * 7) {
            years_plus += last_year - 2011;
            last_year -= last_year - 2011;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 7 && parseInt(slide_element_resize_minus.style.left) < one_slide * 9) {
            years_plus += last_year - 2012;
            last_year -= last_year - 2012;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 9 && parseInt(slide_element_resize_minus.style.left) < one_slide * 11) {
            years_plus += last_year - 2013;
            last_year -= last_year - 2013;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 11 && parseInt(slide_element_resize_minus.style.left) < one_slide * 13) {
            years_plus += last_year - 2014;
            last_year -= last_year - 2014;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 13 && parseInt(slide_element_resize_minus.style.left) < one_slide * 15) {
            years_plus += last_year - 2015;
            last_year -= last_year - 2015;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 15 && parseInt(slide_element_resize_minus.style.left) < one_slide * 17) {
            years_plus += last_year - 2016;
            last_year -= last_year - 2016;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 17 && parseInt(slide_element_resize_minus.style.left) < one_slide * 19) {
            years_plus += last_year - 2017;
            last_year -= last_year - 2017;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 19 && parseInt(slide_element_resize_minus.style.left) < one_slide * 21) {
            years_plus += last_year - 2018;
            last_year -= last_year - 2018;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 21 && parseInt(slide_element_resize_minus.style.left) < one_slide * 23) {
            years_plus += last_year - 2019;
            last_year -= last_year - 2019;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 23 && parseInt(slide_element_resize_minus.style.left) < one_slide * 25) {
            years_plus += last_year - 2020;
            last_year -= last_year - 2020;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 25 && parseInt(slide_element_resize_minus.style.left) < one_slide * 27) {
            years_plus += last_year - 2021;
            last_year -= last_year - 2021;
        }
        else if (parseInt(slide_element_resize_minus.style.left) >= one_slide * 27) {
            years_plus += last_year - 2022;
            last_year -= last_year - 2022;
        }

        slide_element_resize_minus.style.width = 10 + 'px';
        slide_element_resize_minus.style.left = (parseInt(slide_element_resize_minus.style.left) + 40) + 'px';

        if(years_plus < 1){
            years_plus = 1;
        }

        document.body.filterChart(last_year, years_plus);
    }

    function onDrag(e) {
        let bounds = e.target.getBoundingClientRect();
        let x = e.clientX - bounds.left;

        if (x <= 0 + (slide_element.offsetWidth / 2) + 15) {
            slide_element.style.left = `15px`;
        } else if (x >= slide_zone.offsetWidth - (slide_element.offsetWidth / 2) + 18) {
            slide_element.style.left = slide_zone.offsetWidth - slide_element.offsetWidth;
        } else {
            slide_element.style.left = `${x - slide_element.offsetWidth / 2}px`;
        }
    }
    slide_zone.addEventListener("mousedown", (e) => {
        let bounds = e.target.getBoundingClientRect();
        let x = e.clientX - bounds.left;

        if (x <= (slide_element.offsetWidth / 2) + 10) {
            slide_element.style.left = `15px`;
        } else if (x >= slide_zone.offsetWidth - (slide_element.offsetWidth / 2) + 18) {
            slide_element.style.left = slide_zone.offsetWidth - slide_element.offsetWidth;
        } else {
            slide_element.style.left = `${x - slide_element.offsetWidth / 2 }px`;
        }

        slide_zone.addEventListener("mousemove", onDrag);
        slide_element.classList.add("active");
    });
    document.addEventListener("mouseup", () => {
        slide_zone.removeEventListener("mouseover", resize_element_plus);
        slide_zone.removeEventListener("mouseover", resize_element_minus);
        if(resize_func){
            resize_evt_plus();
            resize_evt_minus();
        }

        if (slide_element.classList.contains("active")) {
            slide_element.classList.remove("active");

            let one_slide = slide_zone.offsetWidth / 30;

            if (parseInt(slide_element.style.left) >= 0 && parseInt(slide_element.style.left) < one_slide) {
                document.body.filterChart(2008, years_plus);
            } else if (parseInt(slide_element.style.left) >= one_slide && parseInt(slide_element.style.left) < one_slide * 3) {
                document.body.filterChart(2009, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 3 && parseInt(slide_element.style.left) < one_slide * 5) {
                document.body.filterChart(2010, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 5 && parseInt(slide_element.style.left) < one_slide * 7) {
                document.body.filterChart(2011, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 7 && parseInt(slide_element.style.left) < one_slide * 9) {
                document.body.filterChart(2012, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 9 && parseInt(slide_element.style.left) < one_slide * 11) {
                document.body.filterChart(2013, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 11 && parseInt(slide_element.style.left) < one_slide * 13) {
                document.body.filterChart(2014, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 13 && parseInt(slide_element.style.left) < one_slide * 15) {
                document.body.filterChart(2015, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 15 && parseInt(slide_element.style.left) < one_slide * 17) {
                document.body.filterChart(2016, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 17 && parseInt(slide_element.style.left) < one_slide * 19) {
                document.body.filterChart(2017, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 19 && parseInt(slide_element.style.left) < one_slide * 21) {
                document.body.filterChart(2018, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 21 && parseInt(slide_element.style.left) < one_slide * 23) {
                document.body.filterChart(2019, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 23 && parseInt(slide_element.style.left) < one_slide * 25) {
                document.body.filterChart(2020, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 25 && parseInt(slide_element.style.left) < one_slide * 27) {
                document.body.filterChart(2021, years_plus);
            }
            else if (parseInt(slide_element.style.left) >= one_slide * 27) {
                document.body.filterChart(2022, years_plus);
            }
        }
        slide_zone.removeEventListener("mousemove", onDrag);
    });

    HTMLElement.prototype.sortChart = function (type) {
        for (let i = 0; i < group_toggles.length; i++) {
            group_toggles[i].classList.remove("active");
        }
        this.classList.add("active");

        industryFilter = false,
        industryFilterName = '';
        dataStolenFilter = false,
        dataStolenFilterName = '';

        if (type == 'Companies') {
            selectBy = data_json;
            selecyByTitle = "companies";
        } else {
            selectBy = data_industries;
            selecyByTitle = "industries";
        }

        document.body.filterChart(last_year, years_plus);
    }

    HTMLElement.prototype.check_industry = function (industry) {
        industryFilter = true;
        industryFilterName = industry;
        selectBy = data_json;
        selecyByTitle = "companies";

        group_toggles[0].classList.remove("active");
        group_toggles[1].classList.add("active");

        document.body.filterChart(last_year, years_plus);
        select('industry_select', industry);
    }

    let industry_select = document.querySelector("#industry_select");

    industry_select.addEventListener("change", function () {

        if (this.value != 'all') {
            industryFilter = true,
            industryFilterName = this.value;

            document.body.filterChart(last_year, years_plus);
        } else {
            industryFilter = false,
            industryFilterName = '';

            document.body.filterChart(last_year, years_plus);
        }
    });

    let data_stolen_select = document.querySelector("#data_stolen");

    data_stolen_select.addEventListener("change", function () {

        if (this.value != 'all') {
            dataStolenFilter = true,
            dataStolenFilterName = this.value;

            document.body.filterChart(last_year, years_plus);
        } else {
            dataStolenFilter = false,
            dataStolenFilterName = '';

            document.body.filterChart(last_year, years_plus);
        }
    });

    let
    company_info_modal = document.querySelector('#company_info_modal'),
    company_info_modal_thumb = document.querySelector('#company_info_modal-thumb'),
    company_info_modal_title = document.querySelector('#company_info_modal-title'),
    company_info_modal_description = document.querySelector('#company_info_modal-description');
    company_info_modal_close = document.querySelector('#company_info_modal-close')

    HTMLElement.prototype.getCompanyData = function (thumb_url, description, name) {
        company_info_modal.classList.add("active");
        company_info_modal_thumb.src = thumb_url;
        company_info_modal_title.innerHTML = name;
        company_info_modal_description.innerHTML = description;
    }

    company_info_modal_close.addEventListener("click", function(){
        company_info_modal.classList.remove("active");
    });

    setTimeout(() => document.querySelector("#preloader").style.opacity = 0, 1000);
    setTimeout(() => document.querySelector("#preloader").remove(), 2000);

});

function select(selectId, optionValToSelect){
    //Get the select element by it's unique ID.
    var selectElement = document.getElementById(selectId);
    //Get the options.
    var selectOptions = selectElement.options;
    //Loop through these options using a for loop.
    for (var opt, j = 0; opt = selectOptions[j]; j++) {
        //If the option of value is equal to the option we want to select.
        if (opt.value == optionValToSelect) {
            //Select the option and break out of the for loop.
            selectElement.selectedIndex = j;
            break;
        }
    }
}
