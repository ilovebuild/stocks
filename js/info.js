

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

var stocksCode = [
"전체",
"농업, 임업 및 어업",
"광업",
"제조업",
" - 식료품 제조업",
" - 음료 제조업",
" - 담배 제조업",
" - 섬유제품 제조업; 의복제외",
" - 의복, 의복액세서리 및 모피제품 제조업",
" - 가죽, 가방 및 신발 제조업",
" - 목재 및 나무제품 제조업;가구제외",
" - 펄프, 종이 및 종이제품 제조업",
" - 인쇄 및 기록매체 복제업",
" - 코크스, 연탄 및 석유정제품 제조업",
" - 화학물질 및 화학제품 제조업;의약품 제외",
" - 의료용 물질 및 의약품 제조업",
" - 고무 및 플라스틱제품 제조업",
" - 비금속 광물제품 제조업",
" - 1차 금속 제조업",
" - 금속가공제품 제조업;기계 및 가구 제외",
" - 전자부품, 컴퓨터, 영상, 음향 및 통신장비 제조업",
" - 의료, 정밀, 광학기기 및 시계 제조업",
" - 전기장비 제조업",
" - 기타 기계 및 장비 제조업",
" - 자동차 및 트레일러 제조업",
" - 기타 운송장비 제조업",
" - 가구 제조업",
" - 기타 제품 제조업",
" - 산업용 기계 및 장비 수리업",
"전기, 가스, 증기 및 공기조절 공급업",
"수도, 하수 및 폐기물 처리, 원료 재생업",
"건설업",
"도매 및 소매업",
"운수 및 창고업",
"숙박 및 음식점업",
"정보통신업",
"금융 및 보험업",
"부동산업",
"전문, 과학 및 기술 서비스업",
"사업시설 관리, 사업지원 및 임대 서비스업",
"공공행정, 국방 및 사회보장 행정",
"교육 서비스업",
"보건업 및 사회복지 서비스업",
"예술, 스포츠 및 여가관련 서비스업 ",
"협회 및 단체, 수리 및 기타 개인 서비스업",
"가구 내 고용활동 및 달리 분류되지 않은 자가소비 생산활동",
"국제 및 외국기관",
]
var stocksIndex = [
0,1,2,3,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,
326,327,328,329,330,331,332,333,334,
4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
21,22,23,24,25,26,27,28,29]
function buildSelect(){
    var x = document.getElementById("stockscode");
    for(var i=0; i<stocksCode.length ;++i)
    {
        var option = document.createElement("option");
        option.text = stocksCode[i];
        option.value = stocksIndex[i].toString();
        x.add(option);
    }
}

function buildTable(mkt, reload) {

    var data = localStorage.getItem(mkt);

    if(data==null && reload)
    {
        submitformPOST(mkt)
        return ;
    }
    if(data)
    {
        stocks_data[mkt] = JSON.parse(data);
        for(var i=0; i<stocks_data[mkt].length ;++i)
        {
            if(stocks_data[mkt][i].length<2)continue;
            var name = stocks_data[mkt][i][0];
            var code = stocks_data[mkt][i][1].toString().lpad(6,'0');
            stocks_data[mkt][i][0] = '<a href="http://comp.fnguide.com/SVO2/ASP/SVD_main.asp?pGB=1&gicode=A'+code+'&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=&strResearchYN=" target="_blank">'+name+'</a>'
        }
    }
    
    var datas = stocks_data[mkt];
    var length = datas.length;
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
                order: [[11, 'desc']],
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
            buildTable(mkt,false);
        }
    }
    var url = 'https://hpcz28rerj.execute-api.ap-northeast-2.amazonaws.com/stocks/datalist?MKT='+mkt;
    //var url = 'http://localhost:8001?MKT='+mkt;
    xhr.open('GET', url,true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.send(null);

}
async function submitformPOST(mkt) {
    //var val = $('.form-select').val();
    

    var code = 0;
    var e = document.getElementById("stockscode");
    if(e.selectedIndex>0)
    {
        var option = e.options[e.selectedIndex];
        var val = option.value;
        if (val!=null && val.length>0)
        {
            code = parseInt(val);
        }
    }
    
    var j = {
        query:`query {
            stocks(mkt:\"${mkt}\",code:${code}){
                name
                code
                total_amount
                margin
                rate
                price
                exp_roe_rt
                exp_price_rt
                ratio_exp_rt
                ratio_report_rt
                exp_ratio
                report_ratio
            }
        }`
    };
    var jsonData = JSON.stringify(j);
    console.log(jsonData);
    let url = `https://hpcz28rerj.execute-api.ap-northeast-2.amazonaws.com/stocks/stockslist`;
    //let url = `http://localhost:8001/`;
    fetch(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: jsonData
        }
    ).then(res => res.json()
    ).then(json => {
        
        console.log(json.data.stocks);

        let stocks = []

        for(var i in json.data.stocks){
            let objs = json.data.stocks[i]
            let array = [];
            for(var key in objs){
                array.push(objs[key]);
            }
            stocks.push(array);
        }
        console.log(stocks);
        localStorage.setItem(mkt, JSON.stringify(stocks));
        buildTable(mkt,false);
    });


    // var j = {
    //     MKT:mkt,
    //     CODE:code,
    // };
    // var jsonData = JSON.stringify(j);
    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function(){
    //     if(xhr.readyState === xhr.DONE && xhr.status === 200){

    //         localStorage.setItem(mkt, xhr.responseText);
    //         buildTable(mkt,false);
    //     }
    // }
    // var url = 'https://hpcz28rerj.execute-api.ap-northeast-2.amazonaws.com/stocks/datalist';
    // //var url = 'http://localhost:8001?MKT='+mkt;
    // xhr.open('POST', url);
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhr.send(jsonData);
}