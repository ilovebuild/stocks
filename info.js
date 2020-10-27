

String.prototype.lpad = function(padLen, padStr) {
    var str = this;
    if (padStr.length > padLen) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
};
var stocks_data = {
    "KOSPI":[] ,
    "KOSDAQ":[] ,
};
window.stocks_data = stocks_data;

function buildTable(mkt) {

    var data = localStorage.getItem(mkt);
    if(  data ){
        stocks_data[mkt] = JSON.parse(data);
    }

    var data = stocks_data[mkt];

    var table = document.getElementById('table_STOCKS');
    table.innerHTML=``;
    for (var i=0; i < data.length; i++) {
        var code = data[i][1].toString().lpad(6,'0');
        var row = `<tr>
            <td><a href="http://comp.fnguide.com/SVO2/ASP/SVD_main.asp?pGB=1&gicode=A${code}&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=&strResearchYN=" target="_blank">
                ${data[i][0]}</a></td>
            <td>${data[i][1]}</td>
            <td style="background-color: rgb(139, 250, 12);">${data[i][2]}</td>
            <td>${data[i][3]}</td> 
            <td>${data[i][4]}</td> 
            <td>${data[i][5]}</td> 
            <td style="background-color: rgb(245, 161, 130);">${data[i][6]}</td>
        </tr>`;
        table.innerHTML += row
    }
}
function buildSelect(data) {
    var table = document.getElementById('sectors');
    for (var i=0; i < data.length; i++) {
        var row = `<option value="${data[i].ID}">${data[i].NAME}</option>`;
        table.innerHTML += row;
    }
    
}

async function submitform(mkt) {

    var j = {
        MKT:mkt,
    };
    var jsonData = JSON.stringify(j);
    
    var xhr = new XMLHttpRequest();

    
    xhr.onreadystatechange = function(){
        if(xhr.readyState === xhr.DONE && xhr.status === 200){

            localStorage.setItem(mkt, xhr.responseText);
            buildTable(mkt);
        }
    }
    /*/
    xhr.open('POST', 'https://b1thhkvj25.execute-api.ap-northeast-2.amazonaws.com/stocks/datalist');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(jsonData);

    /*/
    xhr.open('GET', 'https://b1thhkvj25.execute-api.ap-northeast-2.amazonaws.com/stocks/datalist?MKT=KOSPI',true);
    //xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(null);
    /**/
}
