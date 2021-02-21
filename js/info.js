

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
"01	농업, 임업 및 어업",
"02	광업",
"03	제조업",
"   0310	 - 식료품 제조업",
"   0311	 - 음료 제조업",
"   0312	 - 담배 제조업",
"   0313	 - 섬유제품 제조업; 의복제외",
"   0314	 - 의복, 의복액세서리 및 모피제품 제조업",
"   0315	 - 가죽, 가방 및 신발 제조업",
"   0316	 - 목재 및 나무제품 제조업;가구제외",
"   0317	 - 펄프, 종이 및 종이제품 제조업",
"   0318	 - 인쇄 및 기록매체 복제업",
"   0319	 - 코크스, 연탄 및 석유정제품 제조업",
"   0320	 - 화학물질 및 화학제품 제조업;의약품 제외",
"   0321	 - 의료용 물질 및 의약품 제조업",
"   0322	 - 고무 및 플라스틱제품 제조업",
"   0323	 - 비금속 광물제품 제조업",
"   0324	 - 1차 금속 제조업",
"   0325	 - 금속가공제품 제조업;기계 및 가구 제외",
"   0326	 - 전자부품, 컴퓨터, 영상, 음향 및 통신장비 제조업",
"   0327	 - 의료, 정밀, 광학기기 및 시계 제조업",
"   0328	 - 전기장비 제조업",
"   0329	 - 기타 기계 및 장비 제조업",
"   0330	 - 자동차 및 트레일러 제조업",
"   0331	 - 기타 운송장비 제조업",
"   0332	 - 가구 제조업",
"   0333	 - 기타 제품 제조업",
"   0334	 - 산업용 기계 및 장비 수리업",
"04	전기, 가스, 증기 및 공기조절 공급업",
"05	수도, 하수 및 폐기물 처리, 원료 재생업",
"06	건설업",
"07	도매 및 소매업",
"08	운수 및 창고업",
"09	숙박 및 음식점업",
"10	정보통신업",
"11	금융 및 보험업",
"12	부동산업",
"13	전문, 과학 및 기술 서비스업",
"14	사업시설 관리, 사업지원 및 임대 서비스업",
"15	공공행정, 국방 및 사회보장 행정",
"16	교육 서비스업",
"17	보건업 및 사회복지 서비스업",
"18	예술, 스포츠 및 여가관련 서비스업 ",
"19	협회 및 단체, 수리 및 기타 개인 서비스업",
"20	가구 내 고용활동 및 달리 분류되지 않은 자가소비 생산활동",
"21	국제 및 외국기관",
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
        MKT:mkt,
        CODE:code,
    };
    var jsonData = JSON.stringify(j);
    
    
    var xhr = new XMLHttpRequest();

    
    xhr.onreadystatechange = function(){
        if(xhr.readyState === xhr.DONE && xhr.status === 200){

            localStorage.setItem(mkt, xhr.responseText);
            buildTable(mkt,false);
        }
    }
    var url = 'https://hpcz28rerj.execute-api.ap-northeast-2.amazonaws.com/stocks/datalist';
    //var url = 'http://localhost:8001';
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(jsonData);
}