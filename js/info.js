

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
        for(var i=0; i<stocks_data[mkt].length ;++i)
        {
            var name = stocks_data[mkt][i][0];
            var code = stocks_data[mkt][i][1].toString().lpad(6,'0');
            stocks_data[mkt][i][0] = '<a href="http://comp.fnguide.com/SVO2/ASP/SVD_main.asp?pGB=1&gicode=A'+code+'&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=&strResearchYN=" target="_blank">'+name+'</a>'
        }
    }

    var datas = stocks_data[mkt];
    if( $.fn.DataTable.isDataTable( '#dataTable' ) )
        $('#dataTable').DataTable().destroy();

    $(document).ready(function() {
        datatable = $('#dataTable').DataTable(
            {
                //paging:false,
                //langthChange:false,
                //filter:false,
                //ordering:false,
                scrollY: true,
                scrollX: true,
                order: [[10, 'desc']],
                data:datas,
                lengthMenu: [
                    [ 25, 50, 100 ],
                    [ '25 rows', '50 rows', '100 rows' ]
                ],

            },
            
        );
    });

}

async function submitformGET(mkt) {

    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === xhr.DONE && xhr.status === 200){

            localStorage.setItem(mkt, xhr.responseText);
            buildTable(mkt);
        }
    }
    var url = 'https://hpcz28rerj.execute-api.ap-northeast-2.amazonaws.com/stocks/datalist?MKT='+mkt;
    //var url = 'http://localhost:8001?MKT='+mkt;
    xhr.open('GET', url,true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.send(null);

}
async function submitformPOST(mkt) {

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
    var url = 'https://hpcz28rerj.execute-api.ap-northeast-2.amazonaws.com/stocks/datalist';
    //var url = 'http://localhost:8001?MKT='+mkt;
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(jsonData);
}