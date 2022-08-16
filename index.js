const axios = require('axios');
const cron = require("node-cron");
const {google} = require('googleapis');
// const sheets = google.sheets('v4');
const cheerio = require('cheerio');
const dayjs = require('dayjs');
//const dataModel = require('./model.js');
//const mongoose = require('mongoose');


//////////////////////////////////////////////////////
//      bir database'e bağlanmak istenirse >>>      //
//////////////////////////////////////////////////////

/* mongoose.connect('mongodb://127.0.0.1/weatherApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB connection is set.')
}); */


// random seçilecek userAgent'ları içeren bir array, 32 tane içeriyor
const userAgents = ['Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 10; SM-G996U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 10; SM-G980F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.96 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 9; SM-G973U Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 6.0.1; SM-G935S Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 9; J8110 Build/55.0.A.0.552; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 7.1.1; G8231 Build/41.2.A.0.219; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 6.0.1; E6653 Build/32.2.A.0.253) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 10; HTC Desire 21 pro 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 10; Wildfire U20 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.136 Mobile Safari/537.36'
                ,
                'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.3'
                ,
                'Mozilla/5.0 (iPhone14,6; U; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19E241 Safari/602.1'
                ,
                'Mozilla/5.0 (iPhone13,2; U; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1'
                ,
                'Mozilla/5.0 (iPhone12,1; U; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1'
                ,
                'Mozilla/5.0 (iPhone12,1; U; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1'
                ,
                'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
                ,
                'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1'
                ,
                'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/13.2b11866 Mobile/16A366 Safari/605.1.15'
                ,
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
                ,
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1'
                ,
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A5370a Safari/604.1'
                ,
                'Mozilla/5.0 (iPhone9,3; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1'
                ,
                'Mozilla/5.0 (iPhone9,4; U; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1'
                ,
                'Mozilla/5.0 (Apple-iPhone7C2/1202.466; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3'
                ,
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
                ,
                'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1'
                ,
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'];
// 4 şehri tutan bir array
const url = ["https://tr.weatherspark.com/td/94320/%C4%B0zmir-T%C3%BCrkiye-Ortalama-Hava-Durumu-Bug%C3%BCn",
             "https://tr.weatherspark.com/td/95434/%C4%B0stanbul-T%C3%BCrkiye-Ortalama-Hava-Durumu-Bug%C3%BCn",
             "https://tr.weatherspark.com/td/97345/Ankara-T%C3%BCrkiye-Ortalama-Hava-Durumu-Bug%C3%BCn",
             "https://tr.weatherspark.com/td/96052/Bursa-T%C3%BCrkiye-Ortalama-Hava-Durumu-Bug%C3%BCn"];

console.log("#########################################################################################" + "\n"
 + "#########################################################################################" + "\n" 
 + "###########################                                   ###########################" + "\n" 
 + "###########################        WEATHER APP v3.0           ###########################"+ "\n"
 + "###########################                                   ###########################" + "\n"
 + "#########################################################################################" + "\n"
 + "#########################################################################################" + "\n\n"
 );


//  şimdilik her dakika her şehir için semi-random saniye aralıklarında çalışıyor
//  dakikalar da randomize edilebilir? böylece her saat ya da her gün belirli saatlerde random şekilde çalışabilir
//
//      Seconds: 0-59
//      Minutes: 0-59
//      Hours: 0-23
//      Day of Month: 1-31
//      Months: 0-11 (Jan-Dec)
//      Day of Week: 0-6 (Sun-Sat)

async function getData(url, randomSecond) {
    cron.schedule(`${randomSecond} * * * * *`, () => {

        // datetime formatting
        // if date is not 'td' TODAY, changes it to the required date
        justAList = url.split("/");
        if(justAList[3] == 'td'){
            today = dayjs();
            dateToday = today.format("DD-MM-YYYY");
        }
        else{
            monthFromUrl = justAList[5];
            dayFromUrl = justAList[6];
            let today = dayjs().set('date', dayFromUrl).set('month', monthFromUrl-1);
            dateToday = today.format("DD-MM-YYYY");
        }


        console.log(dateToday);
        // random header
        userAgentHeader = userAgents[Math.floor(Math.random() * userAgents.length)]
        // gönderilen userAgent istenirse data olarak pass'lanabilir
        console.log("Gönderilen User-Agent Header: "+ "\n" +userAgentHeader );
        console.log("\n" + "<=========================================================================================================================================>" + "\n");
        axios.get(`${url}`,
            { headers: { 'User-Agent': `${userAgentHeader}` } })
            .then(res => {

                htmlData = res.data;
                const $ = cheerio.load(htmlData);
                $('.body_table_style').each(function () {
                    part = $(this).find('p').text();
                });

                let partey = part.slice(0, 500);
                let array = [];
                array = partey.split(" ");
                console.log("Adı " +array[4], "olan şehir için veriler >>>" + "\n");
                console.log(array);
                console.log("\n");
                derecesizMin = (array[7].split("°C")[0] * 1);
                derecesizMax = (array[9].split("°C")[0] * 1);
                nomMin = (array[14].split("°C")[0] * 1);
                nomMax = (array[18].split("°C")[0] * 1);

            

                async function authAndAppend() {
                    
                    /////////////////////////////////////////////////////////
                    //  "credentials.json" ilgili service için sağlanmalı  //
                    /////////////////////////////////////////////////////////

                    const auth = new google.auth.GoogleAuth({
                        keyFile: "credentials.json",
                        scopes: "https://www.googleapis.com/auth/spreadsheets",
                    });
                    const client = await auth.getClient();
                    const googleSheets = google.sheets({ version: "v4", auth: client });
                    
                    //////////////////////////////////////////
                    // alt tarafa spreadsheetId girilmeli   //
                    // @params required                     //
                    //////////////////////////////////////////
                    
                    const spreadsheetId = "1WOQsxvR2Vlqg70oHbFg2GYpuZ01ulwVfU4tc6jQBtjU";

                    
                    // spreadsheet'e değerleri ekler
                    
                    console.log("Adı " +array[4], "olan şehir için veriler spreadsheets'e yazılıyor >>>");
                    await googleSheets.spreadsheets.values.append({
                        auth,
                        spreadsheetId,
                        range: "weather!A:F",
                        valueInputOption: "USER_ENTERED",
                        resource: {
                            values: [
                                [`${dateToday}`, array[4], derecesizMin, derecesizMax, nomMin, nomMax]
                            ]
                        }
                    })

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // eğer database'e bağlanmak istenirse burası aktif edilecek >>>                                                                    //
                //                                                                                                                                  //
                //const data = await dataModel.create({ city: array[4], min: derecesizMin, max: derecesizMax, nomMin: nomMin, nomMax: nomMax });    //
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                }

                authAndAppend();

            ///////////// error handling
            }).catch(function (error) {
                console.log(error);
            });
    })
    return
}





function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive || örn: max 60, min 0 (saniye için)
}


// bugünün derecelerini almak için
// her dakika başı belirtilen saniyeler arasında semi-random şekilde çalışıyor
function getCityAndDatas (url) {
    getData(url[0], getRandomInt(0,10));
    getData(url[1], getRandomInt(15,25));   // takes a list which contains the required url's, passes random integers to the func to randomize time
    getData(url[2], getRandomInt(30,40));
    getData(url[3], getRandomInt(45,55));
}

getCityAndDatas(url);








//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      CODE BELOW IS TO GET PAST DATA      ||      CODE BELOW IS TO GET PAST DATA      ||      CODE BELOW IS TO GET PAST DATA      // 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPastData(urlList){
    for (i in urlList){
        getData(urlList[i], i+5)
    }
    return
}

// MM-DD-YYYY is the date format
// takes the startDate, endDate and the cityName, returns the requires url's for the given parameters
function urlListGenerator (startDate, endDate, cityName) {

    function getDatesInRange(sDate, eDate) {

        const date = new Date(sDate.getTime());
        const dates = [];
        while (date <= eDate) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
    
        return dates;
    }
    dateList = getDatesInRange(startDate, endDate);
    months = ["Ocak",
                "Şubat",
                "Mart",
                "Nisan",
                "Mayıs",
                "Haziran",
                "Temmuz",
                "Ağustos",
                "Eylül",
                "Ekim",
                "Kasım",
                "Aralık"]
    urlList = [];
    for (i in dateList){
        let day = dateList[i].getDate();
        let month = dateList[i].getMonth();
        cityList = ['İzmir', 'İstanbul', 'Ankara', 'Bursa'];
        codeList = ['94320', '95434', '97345', '96052'];
        urlList[i] = encodeURI(`https://tr.weatherspark.com/d/${codeList[cityList.indexOf(cityName)]}/${month+1}/${day}/${day}-${months[month]}-tarihinde-${cityName}-T%C3%BCrkiye-Ortalama-Hava-Durumu`)
        // example url: https://tr.weatherspark.com/d/94320/8/4/4-A%C4%9Fustos-tarihinde-%C4%B0zmir-T%C3%BCrkiye-Ortalama-Hava-Durumu
    }
  return urlList
} 





// MM-DD-YYYY
// START(d1) AND ENDDATE(d2) 
// const d1 = new Date('06-01-2022');
// const d2 = new Date('06-05-2022');


// getPastData(urlListGenerator(d1, d2, "İzmir"));
// getPastData(urlListGenerator(d1, d2, "İstanbul"));
// getPastData(urlListGenerator(d1, d2, "Ankara"));
// getPastData(urlListGenerator(d1, d2, "Bursa"));

